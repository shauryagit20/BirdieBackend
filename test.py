import requests
import json

def test_connection():
    url = "http://localhost:5000/api/health"
    response = requests.get(url)
    print(response.text)
    
def insert_test_data():
    url = "http://localhost:5000/api/insertTestData"
    response = requests.post(url)
    print(response.text)

def delete_mmny():
    url = "http://localhost:5000/api/cleanData"
    response = requests.get(url)
    print(response.text)
    
def fetch_portfolio():
    url = "http://localhost:5000/api/fetchPortfolio"
    response = requests.get(url)
    print(response.text)
    
def test_chatbot_connection():
    url = "http://localhost:6000/api/health"
    response = requests.get(url)
    print(response.text)
    
def conversation_chatbot():
    url = "http://localhost:6000/api/conversation_chatbot"
    data = {"sentence": "Hello, how is my stock performing?"}
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, json=data, headers=headers)
    print(response.text)
    
def stress_test():
    url = "http://localhost:6000/api/stress_test_chatbot"
    data = {"sentence": "This is a stress test message. What would happen if Trump increases the tariffs on China?"}
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, json=data, headers=headers)
    print(response.text)

def generate_graph_test():
    url = "http://localhost:6000/api/generate_graph"
    data = {"symbol": "TSLA"}
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, json=data, headers=headers)
    print(response.text)
    
# Write test for  fetch_portfolio() functio
def fetch_portfolio():
    url = "http://localhost:6000/api/fetchPortfolioResults"
    data = {"symbol": "TSLA"}
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, json=data, headers=headers)
    print(response.text)

def fetch_news():
    url = "http://localhost:6000/api/fetchNews"
    data = {"symbol": "AAPL"}
    headers = {'Content-Type': 'application/json'}
    response = requests.get(url, json=data, headers=headers)
    print(response.text)

def fetch_scenario_news_article():
    url = "http://localhost:6000/api/fetchScenarioNewsArticle"
    data = {"scenario": "stock market crash"}
    headers = {'Content-Type': 'application/json'}
    response = requests.get(url, json=data, headers=headers)
    print(response.text)

def fetch_news():
    url = "http://localhost:6000/api/fetchNews"
    data = {"symbol": "AAPL"}
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, json=data, headers=headers)
    print(response.text)

def fetch_scenario_news_article():
    url = "http://localhost:6000/api/fetchScenarioNewsArticle"
    data = {"scenario": "trump wins election"}
    headers = {'Content-Type': 'application/json'}
    
    response = requests.get(url, json=data, headers=headers)
    print(response.text)
    
def topic_summaries_test():
    url = "http://localhost:6000/api/topic_summaries"
    data = {"list": ["Hedge Fund", "Investment", "Loans"]}
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, json=data, headers=headers)
    print(response.text)
    
    

if __name__ == "__main__":
    print("Choose an option:")
    print("1. Test connection")
    print("2. Insert test data")
    print("3. Delete data")
    print("4. Fetch portfolio")
    print("5. Test Chatbot Connection Health")
    print("6. Conversation Chatbot")
    print("7. Stress Test")
    print("8. Generate Graph Test")
    print("9. Fetch Portfolio Test")
    print("10. Fetch News Test")
    print("11. Fetch Scenario News Article Test")
    print("12. Topic Summaries Test")
    
    
    
    choice = input("Enter your choice: ")
    if choice == "1":
        test_connection()
    elif choice == "2":
        insert_test_data()
    elif choice == "3":
        delete_mmny()
    elif choice == "4":
        fetch_portfolio()
    elif choice == "5":
        test_chatbot_connection()
    elif choice == "6":
        conversation_chatbot()
    elif choice == "7":
        stress_test()
    elif choice == "8":
        generate_graph_test()   
    elif choice == "9":
        fetch_portfolio()
    elif choice == "10":
        fetch_news()
    elif choice == "11":
        fetch_scenario_news_article()
    elif choice == "12":
        topic_summaries_test()
    else:
        print("Invalid choice") 
        