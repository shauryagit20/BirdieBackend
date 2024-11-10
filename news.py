import requests

def search_news(query):
    api_key = '87c975d1e217484787a25a12124a5dee'
    url = 'https://newsapi.org/v2/everything'
    params = {
        'qInTitle': query,
        'apiKey': api_key,
        'pageSize': 3, # Limit the number of results to 3
        'sortBy': 'publishedAt', # Sort articles by date,
        'language': 'en' # Filter news articles to English language
    }
    response = requests.get(url, params=params)
    out = {}
    print(response.json())
    if response.status_code == 200:
        articles = response.json().get('articles', [])
        for article in articles:
            out[article['title']] = article['url']
    else:
        print(f"Failed to fetch news articles: {response.status_code}")
    
    return out
