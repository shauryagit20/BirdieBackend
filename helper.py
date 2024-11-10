import re
import requests



BASE_URL = "http://localhost:5000"

class Status:
    def __init__(self, code, message, payload=None):
        self.__code = code
        self.__message = message
        self.__payload = payload

    @property
    def code(self):
        return self.__code

    @code.setter
    def code(self, value):
        self.__code = value

    @property
    def message(self):
        return self.__message

    @message.setter
    def message(self, value):
        self.__message = value

    @property
    def payload(self):
        return self.__payload

    def __str__(self):
        return f"Code: {self.code}\nMessage: {self.message}\nPayload: {self.payload}"


def fetch_portfolio():
    url = f"{BASE_URL}/api/fetchPortfolio"
    print(url)
    response = requests.get(url)
    print(response.text)
    return response.text
