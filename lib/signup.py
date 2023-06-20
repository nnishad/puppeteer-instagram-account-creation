import time
import random
import requests
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select

def signup(browser, user):
    browser.get('https://instagram.com/accounts/emailsignup/')
    time.sleep(0.3)

    email_input = browser.find_element_by_css_selector('input[name=emailOrPhone]')
    email_input.send_keys(user['number'])
    time.sleep(0.5)

    full_name_input = browser.find_element_by_css_selector('input[name=fullName]')
    full_name_input.send_keys(user['firstName'] + ' ' + user['lastName'])
    print("Hello")
    time.sleep(0.7)

    username_input = browser.find_element_by_css_selector('input[name=username]')
    username = username_input.get_attribute('value')
    if username:
        user['username'] = username
    else:
        username_input.send_keys(user['username'])

    username_input.send_keys(Keys.TAB)
    time.sleep(1)
    browser.find_element_by_tag_name('body').send_keys(Keys.SPACE)
    time.sleep(0.3)

    password_input = browser.find_element_by_css_selector('input[name=password]')
    password_input.send_keys(user['password'])
    time.sleep(0.7)

    signup_button = browser.find_element_by_xpath('//button[@type="submit"]')
    user['username'] = browser.find_element_by_css_selector('input[name=username]').get_attribute('value')
    time.sleep(4)

    def fetchOTPDetails():
        status = 1
        while status not in [0, 2, 3, 4, 5, 6]:
            try:
                time.sleep(3)
                SmSPoolFetchAPI = 'https://api.smspool.net/sms/check'
                response = requests.get(f'{SmSPoolFetchAPI}?orderid={user["orderId"]}&key={user["key"]}')
                jsonData = response.json()
                message = str(jsonData['sms'])
                status = jsonData['status']
                timeLeft = jsonData['time_left']
                print('[OTP Response]', {'jsonData': jsonData, 'message': message, 'timeLeft': timeLeft})
                time.sleep(4)
            except Exception as error:
                print('An error occurred while checking API status:', error)
                break
        print('[Status of the API is]', status)

    signup_button.click()
    time.sleep(5)

    def getRandomInteger(min, max):
        return str(random.randint(min, max))

    month_select = Select(browser.find_element_by_css_selector('select[title="Month:"]'))
    month_select.select_by_value(getRandomInteger(0, 12))

    day_select = Select(browser.find_element_by_css_selector('select[title="Day:"]'))
    day_select.select_by_value(getRandomInteger(0, 29))

    year_select = Select(browser.find_element_by_css_selector('select[title="Year:"]'))
    year_select.select_by_value(getRandomInteger(1965, 2000))
    time.sleep(5)

    next_buttons = browser.find_elements_by_xpath('//button[@type="button"]')
    if len(next_buttons) > 0:
        next_buttons[1].click()

    fetchOTPDetails()
    time.sleep(0.3)
    if status != 1:
        confirmation_code_input = browser.find_element_by_css_selector('input[name=confirmationCode]')
        confirmation_code_input.send_keys(message)
        time.sleep(5)
        confirmation_signup_button = browser.find_elements_by_xpath('//button[@type="button"]')
        if len(confirmation_signup_button) > 0:
            confirmation_signup_button[0].click()
            addAccountDataToProfile()

    browser.close()
