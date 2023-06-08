'use strict'

import delay from 'delay'

export const signup = async (browser, user, opts) => {
  const page = await browser.newPage()
  await page.goto('https://instagram.com/accounts/emailsignup/')

  await page.waitForSelector('input[name=emailOrPhone]', { visible: true })
  await delay(300)
  await page.type('input[name=emailOrPhone]', user.email, { delay: 27 })

  await delay(500)
  await page.type('input[name=fullName]', user.firstName + ' ' + user.lastName, { delay: 82 })

  await delay(700)
  const username = await page.$eval('input[name=username]', (el) => el.value)
  if (username) {
    user.username = username
  } else {
    await page.type('input[name=username]', user.username, { delay: 67 })
  }
  await page.keyboard.press('Tab')
  await delay(300)
  await page.keyboard.press('Space')
  await delay(300)

  await delay(300)
  await page.type('input[name=password]', user.password, { delay: 42 })

  await delay(700)
  const [signupButton] = await page.$x('//button[@type="submit"]')
  // !store username in database
  const newUsername = await page.$eval('input[name=username]', (el) => el.value)

  await Promise.all([
    signupButton.click({ delay: 30 })
  ])
  // const [Error] =  await page.$eval('div[id=ssfErrorAlert]', (el) => el.value)
  // console.log('[Error]: ' + Error)
  await delay(3000)
  function getRandomInteger(min, max) { //min and max are exclusive
    return String(Math.floor(Math.random() * (max - min) ) + min); 
  }
  await page.select('select[title="Month:"]', getRandomInteger(0,12)) 
  await page.select('select[title="Day:"]', getRandomInteger(0,29)) 
  await page.select('select[title="Year:"]', getRandomInteger(1965,2000))
  await delay(5000)

  const nextButton = await page.$x('//button[@type="button"]')
  if (nextButton.length > 0) {
    nextButton[1].click()
  }
  await delay(5000)

  await page.waitForSelector('input[name=confirmationCode]', { visible: true })
  await delay(300)
  await page.type('input[name=confirmationCode]', '423467', { delay: 27 })

  await delay(10000)
  const confirmationSignupButton = await page.$x('//button[@type="submit"]')
  if (confirmationSignupButton.length > 0) {
    confirmationSignupButton[0].click()
  }

  // await page.close()
}
