import traceback
from openai import OpenAI
import time
import redis_manager
import helper
import openai

BASE_URL = "http://localhost:5000"


client = OpenAI(api_key="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")
assistant_id = "asst_ltLf6lTtaqZeQDMd6exZE8rN"

def format_response_text(text):
    # Replace **text** for bold (Markdown style) with HTML <b> tags
    # Using a loop to replace each ** pair with <b> and </b> alternately
    bold_open = True
    while "**" in text:
        if bold_open:
            text = text.replace("**", "<b>", 1)
        else:
            text = text.replace("**", "</b>", 1)
        bold_open = not bold_open
    
    # Replace \n with <br> for line breaks
    formatted_text = text.replace("\\n", "<br>")
    
    return formatted_text



def create_thread_id(phone_no: str):
    try:
        thread = client.beta.threads.create(messages=[{"role": "user", "content": "Hey There!"}])
        thread_id = thread.id
        redis_manager.update_redis_session(phone_no=phone_no, thread_id=thread_id)
        print(f"Thread ID created successfully for {phone_no}.")
        return helper.Status(200, payload=thread_id, message="Thread ID created successfully.")

    except Exception as e:
        print(f"Error creating thread ID for {phone_no} Error - {e}: Traceback - {traceback.format_exc()}")
        return helper.Status(code=404, message="An error occurred at creating the thread",
                             payload="Error creating thread ID.")


def add_message_to_thread(thread_id, message):
    """
    Adds a user message to an existing OpenAI thread.

    :param thread_id: Unique identifier for the conversation thread.
    :param message: Message content to be added to the thread.
    """
    try:
        print(f"Message: {message}")
        print(f"Thread ID: {thread_id}")
        client.beta.threads.messages.create(role="user", thread_id=thread_id, content=message)
        return helper.Status(200, "Message added to thread successfully.")

    except Exception as e:
        print(f"Error adding message to thread {thread_id}: {e}. Traceback - {traceback.format_exc()}")
        return helper.Status(404, f"An unknown exception occurred when trying to add the message {e}",
                             payload="Error adding message to thread.")


def wait_for_run_completion(thread_id, run_id) -> helper.Status:
    while True:
        try:
            run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run_id)

            if run.completed_at:
                messages = client.beta.threads.messages.list(thread_id=thread_id)
                last_message = messages.data[0]
                response = last_message.content[0].text.value
                formatted_response = format_response_text(response)
                return helper.Status(code=200, message="Chatbot Response Found", payload=formatted_response)

            elif run.required_action:
                required_actions = run.required_action.submit_tool_outputs.model_dump()
                tool_outputs = []

                for action in required_actions["tool_calls"]:
                    func_name = action['function']['name']

                    if func_name == "fetch_portfolio_function":
                        output = helper.fetch_portfolio()
                        tool_outputs.append({
                            "tool_call_id": action['id'],
                            "output": output
                        })
                client.beta.threads.runs.submit_tool_outputs(
                    thread_id=thread_id,
                    run_id=run.id,
                    tool_outputs=tool_outputs
                )
            time.sleep(2)
        except Exception as e:
            print(
                f"Error while waiting for run completion in thread {thread_id}: {e}. Traceback -  {traceback.format_exc()}")
            # client.beta.threads.runs.cancel(run_id=run_id, thread_id=thread_id)
            return helper.Status(code=404, message=f"An error occurred while fetching the run object {e}",
                                 payload="Error while waiting for run completion.")


def get_chatbot_response(thread_id, assistant_id) -> helper.Status:
    """
    Initiates a chatbot response process for a given thread and waits for its completion.

    :param thread_id: The identifier of the chat thread with OpenAI.
    :param user_details: User context for customizing responses.
    :return: A Status object with details about the response or an error message.
    """

    try:
        run = client.beta.threads.runs.create(thread_id=thread_id, assistant_id=assistant_id)
        response = wait_for_run_completion(thread_id=thread_id, run_id=run.id)

        run_status = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)

        if run_status.status != "completed":
            client.beta.threads.runs.cancel(run_id=run.id, thread_id=thread_id)
            print(f"Run {run.id} was cancelled as it did not complete successfully.")

        return response

    except Exception as e:
        print(
            f"Failed to get chatbot response for thread {thread_id}: {e}. Traceback - {traceback.format_exc()}")
        return helper.Status(404, "Failed to retrieve chatbot response.",
                             payload="Error while fetching chatbot response.")


def chat_handler(phone_no: str, message: str, thread_id=None):
    print(f"Handling chat for {phone_no} with message: {message}")
    if thread_id is None:
          thread_id = redis_manager.get_thread_id(phone_no)
          if thread_id.code == 200:
              thread_id = thread_id.payload
          else:
            thread_id = create_thread_id(phone_no=phone_no)
            if thread_id.code == 404:
                return thread_id
            thread_id = thread_id.payload
    

    add_message_to_thread_status = add_message_to_thread(thread_id, message)

    if add_message_to_thread_status.code == 404:
        return add_message_to_thread_status

    resp = get_chatbot_response(thread_id=thread_id, assistant_id="asst_ltLf6lTtaqZeQDMd6exZE8rN")
    print(type(resp.payload))
  
    return {"response": str(resp.payload)}  # Extract JSON-serializable da
  

def search_news(topic):
    assistant_id =  "asst_y4d0fxzf258TdQT9FqUvEqfv"
    thread_id = create_thread_id(phone_no="1").payload
    add_message_to_thread(thread_id, topic)
    response = get_chatbot_response(thread_id, assistant_id=assistant_id)
    return response.payload

    
    
def get_topic_summaries(topics: list) -> helper.Status:
    assistant_id =  "asst_jfFXMPRUnxroFdVrSlfVc150"
    thread_id = create_thread_id(phone_no="1").payload
    
    d = {}
    
    for topic in topics:
        message = f"Help me understand, based on my portfolio information if avaiable: {topic}"
        thread_id = redis_manager.get_thread_id(phone_no="1").payload
        add_message_to_thread(thread_id, message)
        response = get_chatbot_response(thread_id, assistant_id=assistant_id)
        d[topic] = response.payload
    
    return d
