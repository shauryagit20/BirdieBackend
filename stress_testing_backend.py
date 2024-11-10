from openai import OpenAI
import time
import yfinance as yf 
import redis_manager
import helper
import json
import datetime 
import re



# How will this work?
"""
Stress testeed values, will store this in the backend.

What will  the sstress testedd values store.
1) The predicted market price.
2) THe predicted loss or profit.
3) The predicted value at risk.
4) The predicted risk score aassociated with that value.

"""

client = OpenAI(api_key="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")
assistant_id = "asst_TwpzzaVhPzGu0jfNNWPPmlDq"

def extract_json_blocks(text):
    # Regular expression to match ```json ... ```
    pattern = r'```json\s*(.*?)\s*```'
    matches = re.findall(pattern, text, re.DOTALL)
    json_objects = []
    for match in matches:
        try:
            # Parse the JSON content
            json_obj = json.loads(match)
            json_objects.append(json_obj)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
    return json_objects

def combine_json_blocks(json_blocks):
    """
    Combines multiple JSON objects into a single JSON structure.

    Args:
        json_blocks (list): A list of JSON objects.

    Returns:
        dict: A combined JSON object.
    """
    combined = {}
    if len(json_blocks) >= 1:
        combined["stocks"] = json_blocks[0]
    if len(json_blocks) >= 2:
        combined["assumptions"] = json_blocks[1].get("Assumptions", "")
    return combined

def fetch_thread_id(phone_no: str):
    thread_id = redis_manager.get_thread_id(phone_no)
    if thread_id.code == 200:
        thread_id = thread_id.payload
    else:
        thread_id = create_thread_id(phone_no=phone_no)
        if thread_id.code == 404:
            return thread_id
        thread_id = thread_id.payload
        
    return thread_id
        
def create_thread_id(phone_no: str):
    try:
        thread = client.beta.threads.create(messages=[{"role": "user", "content": "Hey There!"}])
        thread_id = thread.id
        redis_manager.update_redis_session(phone_no=phone_no, thread_id=thread_id)
        print(f"Thread ID created successfully for {phone_no}.")
        return helper.Status(200, payload=thread_id, message="Thread ID created successfully.")

    except Exception as e:
        print(f"Error creating thread ID for {phone_no} Error - {e}")
        return helper.Status(code=404, message="An error occurred at creating the thread",
                             payload="Error creating thread ID.")
        
def add_message_to_thread(thread_id, message):
    print(thread_id)
    client.beta.threads.messages.create(role="user", thread_id=thread_id, content=message)
    return helper.Status(200, "Message added to thread successfully.")

def wait_for_run_completion(thread_id, run_id) -> helper.Status:
    while True:
        try:
            run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run_id)

            if run.completed_at:
                messages = client.beta.threads.messages.list(thread_id=thread_id)
                last_message = messages.data[0]
                response = last_message.content[0].text.value
                return helper.Status(code=200, message="Chatbot Response Found", payload=response)
            

            elif run.required_action:
                required_actions = run.required_action.submit_tool_outputs.model_dump()
                tool_outputs = []
                for action in required_actions:
                    tool_outputs.append(action)
                return helper.Status(code=200, message="Required Actions Found", payload=tool_outputs)

            time.sleep(5)

        except Exception as e:
            return helper.Status(code=404, message="An error occurred at waiting for the run", payload="Error waiting for run.")
        
def chatbot_response(phone_no: str, message: str):
    message = message.replace("\n", "")
    thread_id = redis_manager.get_thread_id(phone_no)
    if thread_id.code == 200:
        thread_id = thread_id.payload
    else:
        thread_id = create_thread_id(phone_no=phone_no)
        if thread_id.code == 404:
            return thread_id
        thread_id = thread_id.payload
        
    if thread_id:
        add_message_to_thread(thread_id=thread_id, message=message)
        run = client.beta.threads.runs.create(thread_id=thread_id, assistant_id = assistant_id)
        run_id = run.id
        return wait_for_run_completion(thread_id=thread_id, run_id=run_id)
    else:
        return thread_id
    
def stress_testing_simulation(message):
    """
    Parts of the stress testing simulation. 
    Once the person clicks onn stress testing button, the system first goes and gets all the shares and it's closing priee from the last 14 days to today.
    """
    
    stress_testing_information = ""
    portfolio = helper.fetch_portfolio()
    
    portfolio = json.loads(portfolio)
    
    for i in range(2):
        portfolio_item = portfolio[i]
        symbol = portfolio_item["symbol"]
        if symbol is not None:
            stress_testing_information += f"Symbol : {symbol}-"
            
            # Download data
            data = yf.download(
                symbol, 
                start=datetime.datetime.now() - datetime.timedelta(days=20), 
                end=datetime.datetime.now()
            )
            data = data.tail(14)
            
            close_series = data[("Close", symbol)]
            for i in range(14):
                stress_testing_information += f"Day {i}: {close_series[i]}\n"            
            
    prompt =  f"Hey Birdie! Please help me understand what will happen to my portofilios in the next 14 days. Here is my portfoilio and the last 14 days closing price of the stock, if this event plays out {message}" + stress_testing_information
    prompt = prompt.strip()
    print(prompt)
    response = chatbot_response(phone_no="1", message=prompt)
    response = response.payload
    print(response)
    
    json_blocks = extract_json_blocks(response)
    combined_json = combine_json_blocks(json_blocks)
    json_output = combined_json
    
    print(json_output)
 
    
    add_message_to_thread(thread_id=fetch_thread_id("1"), message=json_output['stocks']['Assumptions'])
    
    return json_output