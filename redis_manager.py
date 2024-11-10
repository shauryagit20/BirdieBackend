import redis
import helper
import pickle
import traceback

# Connecting to a Redis instance.
client = redis.Redis(host="localhost", port=6379)


def create_redis_session(phone_no: str, thread_id=None) -> helper.Status:
    """
    Creates or updates a Redis session for a user with the given details.

    :param phone_no: The user's phone number as a unique identifier.
    :param thread_id: The thread ID associated with the user's current session (optional).
    :return: A status object indicating the result of the operation.
    """
    try:
        if client.exists(phone_no) and not client.type(phone_no) == b'hash':
            client.delete(phone_no)

        data = {
            "thread_id": pickle.dumps(thread_id)
        }

        # Initializing the reddis session to expire after 24 hours.
        client.hset(phone_no, mapping=data)
        client.expire(phone_no, 3600)
        return helper.Status(code=200, message="Successfully Created User Session")

    except Exception as e:
        return helper.Status(code=404, message=f"Unexpected error occurred during adding the user: {e}")

def update_redis_session(phone_no: str, thread_id=None) -> helper.Status:
    """
    Updates a Redis session with new user details, state, or thread ID.

    :param phone_no: The user's phone number as a unique identifier.
    :param thread_id: Updated thread ID for the user's session (optional).
    """
    return create_redis_session(phone_no, thread_id)



def get_thread_id(phone_no: str) -> helper.Status:
    """
    Retrieves the thread ID for a user's session from Redis.

    :param phone_no: The user's phone number.
    :return: A status object with the thread ID if found, else an error message.
    """
    thread_id_byte_stream = client.hgetall(phone_no)

    if len(thread_id_byte_stream) > 0 and b"thread_id" in thread_id_byte_stream:
        return helper.Status(200, "Thread ID fetched successfully",
                             pickle.loads(thread_id_byte_stream[b"thread_id"]))
    else:
        return helper.Status(404, "User not found", None)