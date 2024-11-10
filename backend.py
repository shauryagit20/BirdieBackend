from flask import Flask, request, jsonify, make_response
import helper
import requests
from flask_cors import CORS
import chatbot
import stress_testing_backend
from prophecy import generate_history_and_forecast_data
import news

app = Flask(__name__)

# Allow CORS from any origin
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/api/health', methods=['GET'])  
def health():
    return jsonify(status="UP"), 200


@app.route("/api/fetchPortfolioSymbols", methods=['GET'])
def fetch_portfolio_symbols():
    url = "http://localhost:5000/api/fetchPortfolio"
    
    try:
        response = requests.get(url)
        response.raise_for_status()  # Check if request was successful
        
        # Parse the JSON response to extract symbols
        portfolio_data = response.json()
        symbols = [item["symbol"] for item in portfolio_data]
        
        return jsonify(symbols), 200
    
    except requests.exceptions.RequestException as e:
        logging.error("Failed to fetch portfolio symbols", exc_info=True)
        return jsonify({"error": "Unable to fetch portfolio symbols"}), 500
    
    
@app.route('/api/fetchPortfolioResults', methods=['POST'])
def fetch_portfolio_results():
    url = "http://localhost:5000/api/fetchPortfolio"
    try:
        data = request.get_json()
        symbol = data.get('symbol')
        
        # Get the portfolio data
        response = requests.get(url)
        response.raise_for_status()
        portfolio_data = response.json()
        
        # Find the first matching item for the given symbol
        stock_data = next((item for item in portfolio_data if item["symbol"] == symbol), None)
        
        # Round numeric values in each item of portfolio_data
        for item in portfolio_data:
            for key, value in item.items():
                if isinstance(value, (float, int)):
                    item[key] = round(value, 2)
        
        if stock_data:
            stock_data.pop("symbol", None)
            return jsonify(stock_data), 200
        else:
            return jsonify({"error": f"Symbol '{symbol}' not found"}), 404
    
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Unable to fetch portfolio data"}), 500
    except Exception as e:
        return jsonify({"error": "An error occurred"}), 500

    

@app.route('/api/conversation_chatbot', methods=['POST'])
def summary_chatbot():
    # Process POST request
    data = request.get_json()
    sentence = data.get('sentence', '')
    resp = chatbot.chat_handler("1",sentence)
    print(resp)
    # Check if the response is JSON-serializable
    if isinstance(resp, helper.Status):
        # Convert helper.Status to a dictionary or string
        resp = {"response": resp.payload.message} if hasattr(resp.payload, 'message') else str(resp.payload)
    
    response = make_response(resp, 200)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route('/api/stress_test_chatbot', methods=['POST'])
def stress_test_chatbot():
    print("Stress Testing Chatbot")
    data =  request.get_json()
    sentence = data.get('sentence', '')
    resp = stress_testing_backend.stress_testing_simulation(sentence)
    
    if isinstance(resp, helper.Status):
        resp = {"response": resp.payload.message} if hasattr(resp.payload, 'message') else str(resp.payload)
    
    response = make_response(resp, 200)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

# @app.route('/api/generate_graph', methods=['POST'])
# def prophecy():
#     data =  request.get_json()
#     symbol = data.get('symbol', '')
#     resp = prophet_forecast(symbol)
#     if isinstance(resp, helper.Status):
#         resp = {"response": resp.payload.message} if hasattr(resp.payload, 'message') else str(resp.payload)
    
#     response = make_response(resp, 200)
#     response.headers.add("Access-Control-Allow-Origin", "*")
#     return response

@app.route('/api/fetchNews', methods=['POST'])
def fetch_news():
    data = request.get_json()
    symbol = data.get('symbol', '')
    resp = news.search_news(symbol)
    r = {"response": resp}

    response = make_response(r, 200)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/api/fetchScenarioNewsArticle', methods=['POST'])
def fetch_scenario_news_article():
    l = {}
    count  = 0
    data = request.get_json()
    scenario = data.get('scenario', '')
    while count < 3:
        out = news.search_news(scenario)
        for ele in out:
            l[ele] = out[ele]
            cout += 1
        if count >3:
            break
        
    response = make_response(l, 200)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

        
@app.route('/api/generateHistoricalGraph', methods=['POST'])
def history_and_prophecy():
    data =  request.get_json()
    symbol = data.get('symbol', '')
    resp = generate_history_and_forecast_data(symbol)
    if isinstance(resp, helper.Status):
        resp = {"response": resp.payload.message} if hasattr(resp.payload, 'message') else str(resp.payload)
    
    response = make_response(resp, 200)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/api/topic_summaries', methods=['POST'])
def topic_summaries():
    data = request.get_json()
    topics = data.get('list', [])
    
    # Ensure 'topics' is a list
    if not isinstance(topics, list):
        topics = [topics]

    # Call the modified get_topic_summaries function with the list of topics
    resp = chatbot.get_topic_summaries(topics)
    
    # Prepare the response for JSON serialization
    if isinstance(resp, dict):
        response = make_response(resp, 200)
    elif isinstance(resp, helper.Status):
        # If resp is a Status object, extract the payload message if it exists
        response = {"response": resp.payload.message} if hasattr(resp.payload, 'message') else str(resp.payload)
        response = make_response(response, 200)
    else:
        response = make_response({"error": "Unexpected response format"}, 500)

    # Set response headers
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


if __name__ == "__main__":
    app.run(port=6000, debug=True)
