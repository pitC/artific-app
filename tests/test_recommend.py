import requests
import os
import config
import json

url = os.path.join(config.API_HOST,"recommend")


headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

def test_empty_payload():
    payload  = {}
    response = requests.request("POST", url, headers=headers, data = payload)
    assert response.status_code == 400

def test_one_colour():
    payload = {"colours":["#ffaa00"],"answers":[],"blacklist":[],"enhance":True,"collectionFilter":None}
    response = requests.request("POST", url, headers=headers, data = json.dumps(payload))
    assert response.status_code ==200
    assert len(response.json()["images"]) == 5

def test_answer_only():
    payload = {"colours":[],"answers":[{"Q6":"Energy"}],"blacklist":[],"enhance":True,"collectionFilter":None}
    response = requests.request("POST", url, headers=headers, data = json.dumps(payload))
    assert response.status_code ==200
    assert len(response.json()["images"]) == 5

def test_colour_answer():
    payload = {"colours":["#ffaa00"],"answers":[{"Q6":"Energy"}],"blacklist":[],"enhance":True,"collectionFilter":None}
    response = requests.request("POST", url, headers=headers, data = json.dumps(payload))
    assert response.status_code ==200
    assert len(response.json()["images"]) == 5

def test_blacklist():
    payload = {"colours":["#ffaa00"],"answers":[{"Q6":"Energy"}],"blacklist":[],"enhance":True,"collectionFilter":None}
    response = requests.request("POST", url, headers=headers, data = json.dumps(payload))
    # Find image to blacklist
    returned_image = response.json()["images"][0]["_id"]
    # set the found image to blacklist
    payload["blacklist"]=[returned_image]
    resp_blacklisted = requests.request("POST", url, headers=headers, data = json.dumps(payload))
    resp_str = json.dumps(resp_blacklisted.json())
    assert resp_str.find(returned_image) == -1
