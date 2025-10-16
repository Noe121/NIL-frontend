import requests

# Update these values as needed
AUTH_SERVICE_URL = 'http://localhost:8002/login'
EMAIL = 'youruser@example.com'
PASSWORD = 'yourpassword'

payload = {
    'email': EMAIL,
    'password': PASSWORD
}
headers = {'Content-Type': 'application/json'}

response = requests.post(AUTH_SERVICE_URL, json=payload, headers=headers)
if response.status_code == 200:
    token = response.json().get('access_token')
    print(f'Bearer {token}')
else:
    print('Failed to get JWT:', response.text)
