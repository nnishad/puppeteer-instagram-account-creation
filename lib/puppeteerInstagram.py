from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import re
import requests
from faker import Faker
from signup import signup

faker = Faker()
class PuppeteerInstagram:
    def __init__(self):
        self._user = None
        # self._ws = ws
        self._browser = None
    
    @property
    def isAuthenticated(self):
        return bool(self._user)
    
    @property
    def user(self):
        return self._user
    
    async def browser(self):
        if not self._browser:
            options = Options()
            options.add_argument("--headless")  # Optional: Run in headless mode
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-gpu")
            
            # service = Service('/path/to/chromedriver')  # Replace with the actual path to chromedriver executable
            
            # self._browser = webdriver.Chrome(service=service, options=options)
        self._browser = webdriver.Chrome()
        return self._browser
    
    def signup(self):
        CountryId = '15'
        user = {}
        user['username'] = faker.user_name()
        user['password'] = faker.password()
        user['firstName'] = faker.first_name()
        user['lastName'] = faker.last_name()
        user['username'] = re.sub(r'[^\d\w-]', '-', user['username'])
        user['username'] = re.sub(r'_', '-', user['username'])
        user['username'] = re.sub(r'^-', '', user['username'])
        user['username'] = re.sub(r'-$', '', user['username'])
        user['username'] = re.sub(r'--', '-', user['username'])
        user['username'] = re.sub(r'-', '', user['username'])
        SmSPoolAPI = 'https://api.smspool.net/purchase/sms'
        key = 'hFXGJFunoIckg01PLNJlEqHG5IcG8niv'
        # for element in countryList:
        #     if element['name'] == 'United Kingdom':
        #         CountryId = element['ID']
        ServiceId = '457'
        response = requests.get(f"{SmSPoolAPI}?key={key}&country={CountryId}&service={ServiceId}")
        jsonData = response.json()
        phoneNumber = jsonData['phonenumber']
        orderId = jsonData['order_id']
        country = jsonData['country']
        success = jsonData['success']
        countryCode = jsonData['cc']
        message = jsonData['message']
        user['number'] = '+' + str(countryCode) + str(phoneNumber)
        user['orderId'] = orderId
        user['key'] = key
        print('[UserInformation]', {'phoneNumber': user['number'], 'orderId': orderId, 'country': country, 'success': success, 'countryCode': countryCode, 'message': message})
        if message.startswith('This country is currently not available for this service'):
            print('[Error Message]', {'jsonData': jsonData})
        browser= webdriver.Chrome('/Users/anmolagarwal/Downloads/driver_path/chromedriver')
        signup(browser, user)

    def close(self):
        browser = self.get_browser()
        browser.close()
        self._browser = None
        self._user = None

# instagram = SeleniumInstagram(ws, proxy)
profileId="ahdjbd"
instagram = PuppeteerInstagram()
instagram.signup()