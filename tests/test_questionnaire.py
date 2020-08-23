import requests
import os
import config


url = os.path.join(config.API_HOST,"questions")

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
    assert len(body)==8
    assert body[0]["id"]=="Q1"
