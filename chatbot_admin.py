from openai import OpenAI

client = OpenAI(api_key="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")


def create_normal_assistant():
    def create_assistant():
        instruction = """You are a financial advisor, and you help people manage and understand their finances. """

        assistant = client.beta.assistants.create(
            name="Birdie",
            instructions=instruction,
            model="gpt-4o-mini",
            tools=[{
                "type": "function",
                "function": {
                    "name": "fetch_portfolio_function",
                    "description": "Whenever the useer asks for information on their portfolios, this function will be called. Ensure this function is always called",
                    }
                }
                
        ]
    )

        return assistant


    assistant = create_assistant()
    print(assistant.id)
    
def create_processing_assstant():
    def create_assistant():
        instruction = """
        You are Birdie, an economist who excels at predicting how events affect share prices with accuracy. 
        Given the last 14 days of market conditions, calculate the following for each share provided, ppredicted for 10 days into the future.

        - **Predicted Market Price**
        - **Predicted Loss or Profit**
        - **Predicted Value at Risk** (on a scale of 1-10)
        - **Predicted Risk Score** associated with that value

        **Output Format:**

        Present your results in JSON format, enclosed within triple backticks labeled as `json`. Here's the template: Just output in the below format do not 
        do anything else. Do not include any other information in the response.

        ```json
        {
        "stocks": [
            {
            "symbol": "AAPL",
            "predicted_market_price": 150.0,
            "predicted_loss_or_profit": -5.0,
            "predicted_value_at_risk": 5.0,
            "predicted_risk_score": 0.5
            },
            {
            "symbol": "GOOGL",
            "predicted_market_price": 200.0,
            "predicted_loss_or_profit": 10.0,
            "predicted_value_at_risk": 7.0,
            "predicted_risk_score": 0.7
            }
            // ... Include entries for all the shares.
        ],
        "Assumptions": "Briefly describe the assumptions made for the predictions."
        }
        ```
        """
        
        
  
        assistant = client.beta.assistants.create(
            name="Birdie",
            instructions=instruction,
            model="gpt-4o-mini",
        )
    
        return assistant

    return create_assistant()

# assistant =  create_processing_assstant()
# print(assistant)
# print(assistant.id)
# print(assistant.name)

# def create_news_assistant():
#     def create_assistant():
#         instruction = """You are a someone who suggests topics to search for in order to find new articles. Be general when suggesting 
#         news article topics. As response just return the topic nothing else.."""

#         assistant = client.beta.assistants.create(
#             name="Arnab Goswami",
#             instructions=instruction,
#             model="gpt-4o-mini"
                
#     )

#         return assistant


#     assistant = create_assistant()
#     print(assistant.id)
    
# create_news_assistant()



def create_education_assistant():
    def create_assistant():
        instruction = """YOu are someone who helps people learn about finance.e.g. Ensure that you provide, correct information that is easy to understand, for a list of topics. Write a 200 word essay explaining the topic in simple terms. """
        

        assistant = client.beta.assistants.create(
            name="Arnab Goswami",
            instructions=instruction,
            model="gpt-4o-mini"
            
        )

        print(assistant.id)
        return assistant
    
    create_assistant()

create_education_assistant()