import requests
import os
import config


image_id="5bfc5d5d6ba9b622d2aff9e5"
url = os.path.join(config.API_HOST,"image",image_id)


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
    assert body["title"] == "Dog Lying in the Snow"


def test_error_code():
    url = os.path.join(config.API_HOST,"image","0")
    response = requests.request("GET", url, headers=headers, data = payload)
    assert response.status_code == 404
    