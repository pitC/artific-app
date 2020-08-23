import requests
import os
import config


url = os.path.join(config.API_HOST,"arconfig")

payload  = {}
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

response = requests.request("GET", url, headers=headers, data = payload)

def test_ok_code():

    assert response.status_code == 200

    
def test_content():
    body = response.json()
    assert body["frameConfig"] != None
