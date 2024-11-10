import os
from flask import Flask, request, jsonify
from pymongo.mongo_client import MongoClient
import yfinance as yf
from pymongo.server_api import ServerApi
import logging
from bson.json_util import loads
from bson.json_util import dumps
from datetime import datetime
from datetime import timedelta

logging.basicConfig(level=logging.ERROR)

# Load MongoDB credentials from environment variables
uri = "mongodb+srv://roboticsshaurya:v1XGRjsL6tTeRy7U@cluster0.i3ezw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server with Server API Version 1
client = MongoClient(uri, server_api=ServerApi('1'))
app = Flask(__name__)

@app.get('/api/health')
def health():
    try:
        client.admin.command('ping')
        return jsonify(status="UP"), 200
    except Exception as e:
        logging.error("Health check failed", exc_info=True)
        return jsonify(status="DOWN", error=str(e)), 500


def get_last_weekday(date_str):
    """Returns the last available weekday if the given date falls on a weekend."""
    date = datetime.strptime(date_str, "%Y-%m-%d")
    while date.weekday() > 4:  # Saturday (5) and Sunday (6) are weekend days
        date -= timedelta(days=1)
    return date.strftime("%Y-%m-%d")

def get_price_on_date(symbol, date, end_date=None):
    try:
        stock = yf.Ticker(symbol)
        date = get_last_weekday(date)
        
        if end_date is None:
            # Single date query
            next_day = (datetime.strptime(date, "%Y-%m-%d") + timedelta(days=1)).strftime("%Y-%m-%d")
            hist = stock.history(interval='1d', start=date, end=next_day)
            if hist.empty:
                logging.warning(f"No data for {symbol} on {date}")
                return None
            return float(hist["Close"].iloc[0])
        else:
            # Date range query
            end_date = get_last_weekday(end_date)
            # Since yfinance's 'end' parameter is exclusive, add one day to include end_date
            next_day = (datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1)).strftime("%Y-%m-%d")
            hist = stock.history(interval='1d', start=date, end=next_day)
            if hist.empty:
                logging.warning(f"No data for {symbol} from {date} to {end_date}")
                return None
            # Return the closing price on end_date
            hist.index = hist.index.strftime('%Y-%m-%d')
            if end_date in hist.index:
                closing_price = float(hist.loc[end_date]["Close"])
                return closing_price
            else:
                logging.warning(f"No data for {symbol} on {end_date}")
                return None
    except Exception as e:
        logging.error(f"Failed to fetch data for {symbol} from {date} to {end_date}: {e}")
        return None


@app.route(('/api/cleanData'), methods=['GET'])
def clean_data():
    try:
        db = client["Portfolio"]
        collection = db["test"]
        collection.delete_many({})
        return "Deleted", 200
    except Exception as e:
        logging.error("Failed to delete data", exc_info=True)
        return jsonify(error=str(e)), 500
 
@app.route('/api/insertTestData', methods=['POST'])
def insert_test_data():
    try:
        db = client["Portfolio"]
        collection = db["test"]
        portfolio = []
        
        # List of stock symbols
        symbols = ["TSLA", "NVDA", "MSFT", "AAPL", "AMZN", "INTC", "GOOGL", "META", "AMD", "NFLX", "AMT", "EQIX"]
        quantity = [100, 200, 2030, 1020, 100, 100, 300, 100, 150, 300, 500, 200]
        
        # Set the date to a past date (e.g., October 1, 2023)
        target_date = "2024-10-10"  # Updated date string

        for index in range(len(symbols)):
            symbol = symbols[index]
            buying_price = get_price_on_date(symbol, target_date)
            if buying_price is not None:
                stock_data = {
                    "symbol": symbol,
                    "buying_price": buying_price,
                    "quantity": quantity[index]
                }
                portfolio.append(stock_data)
            else:
                logging.warning(f"Skipping {symbol} due to missing price data.")
        
        print(portfolio)    
        if portfolio:
            collection.insert_many(portfolio)
                
        return "Inserted", 200
                
    except Exception as e:
        logging.error("Failed to insert test data", exc_info=True)
        return jsonify(error=str(e)), 500
    
@app.route('/api/fetchPortfolio', methods=['GET'])
def fetch_portfolio():
    try:
        db = client["Portfolio"]
        collection = db["test"]        
        cursor = collection.find()
        portfolio = [doc for doc in cursor]
        
        portfolio_formatted =  []
        for portfolio_item in portfolio:
            symbol = portfolio_item["symbol"]
            quantity = portfolio_item["quantity"]
            buying_price = portfolio_item["buying_price"]
            
            current_price = get_price_on_date(symbol, datetime.now().strftime("%Y-%m-%d"))
            print(current_price)
            if current_price is not None:
                stock_data = {
                    "symbol": symbol,
                    "quantity": quantity,
                    "buying_price": buying_price,
                    "current_price": current_price,
                    "profit_loss": (current_price - buying_price) * quantity
                }
                portfolio_formatted.append(stock_data)
            else:
                logging.warning(f"Skipping {symbol} due to missing price data.")
                
        return jsonify(portfolio_formatted), 200
    
    except Exception as e:
        logging.error("Failed to fetch portfolio", exc_info=True)
        return jsonify(error=str(e)), 500

if __name__ == "__main__":
    app.run(debug=True)
