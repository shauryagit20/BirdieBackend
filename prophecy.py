import pandas as pd
import yfinance as yf
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error
import numpy as np
import datetime
import json

def get_signal(latest_price, forecasted_price, recent_trend):
    change_percentage = ((forecasted_price - latest_price) / latest_price) * 100
    
    if change_percentage > 5 and recent_trend > 0:
        return "Strong Buy"
    elif change_percentage > 2 and recent_trend > 0:
        return "Buy"
    elif abs(change_percentage) <= 2:
        return "Neutral"
    elif change_percentage < -2 and recent_trend < 0:
        return "Sell"
    elif change_percentage < -5 and recent_trend < 0:
        return "Strong Sell"
    else:
        return "Neutral"

def generate_history_and_forecast_data(symbol, forecast_days=5):
    try:
        # Download historical data
        end_date = datetime.datetime.now()
        start_date = end_date - datetime.timedelta(days=180)
        
        # Download data and check if it's valid
        data = yf.download(symbol, start=start_date, end=end_date)
        if data.empty:
            raise ValueError(f"No data found for symbol {symbol}")

        # Create the DataFrame with explicit column handling
        df = pd.DataFrame()
        # Convert timezone-aware dates to timezone-naive dates
        df['ds'] = data.index.tz_localize(None)
        df['y'] = data['Close'].values
        
        # Convert types explicitly
        df['y'] = df['y'].astype(float)
        
        # Print debug information
        print("DataFrame shape:", df.shape)
        print("DataFrame head:\n", df.head())
        print("DataFrame dtypes:", df.dtypes)
        
        # Check for any NaN values
        if df['y'].isna().any():
            print("Warning: NaN values found in the data")
            df = df.dropna()

        # Initialize and fit Prophet model
        model = Prophet(daily_seasonality=True)
        model.fit(df)

        # Generate future predictions
        future = model.make_future_dataframe(periods=forecast_days)
        forecast = model.predict(future)

        # Prepare actual data points
        actual_data = []
        for index, row in df.iterrows():
            actual_data.append({
                "x": row['ds'].strftime("%Y-%m-%d"),
                "y": float(row['y'])
            })

        # Prepare forecast data points
        forecast_data = []
        for i in range(len(df), len(forecast)):
            forecast_data.append({
                "x": forecast['ds'].iloc[i].strftime("%Y-%m-%d"),
                "y": float(forecast['yhat'].iloc[i]),
                "y_lower": float(forecast['yhat_lower'].iloc[i]),
                "y_upper": float(forecast['yhat_upper'].iloc[i])
            })

        # Calculate signal components
        latest_price = float(df['y'].iloc[-1])
        forecasted_price = float(forecast['yhat'].iloc[-forecast_days:].mean())
        
        # Calculate recent trend (10-day lookback)
        lookback_days = min(10, len(df))
        earlier_price = float(df['y'].iloc[-lookback_days])
        recent_trend = latest_price - earlier_price

        # Get trading signal
        signal = get_signal(latest_price, forecasted_price, recent_trend)

        # Prepare response
        response = {
            "symbol": symbol,
            "actual_data": actual_data,
            "forecast_data": forecast_data,
            "signal": signal,
            "latest_price": latest_price,
            "forecasted_price": forecasted_price,
            "price_change_percent": ((forecasted_price - latest_price) / latest_price) * 100
        }

        return response

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        error_response = {
            "error": True,
            "message": str(e),
            "symbol": symbol
        }
        return error_response

if __name__ == "__main__":
    print("Starting script...")
    try:
        result = generate_history_and_forecast_data("AAPL")
        print("Result:", json.dumps(result, indent=2))
    except Exception as e:
        print(f"Main error: {str(e)}")