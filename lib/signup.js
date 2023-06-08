'use strict'

import delay from 'delay'

export const signup = async (browser, user, opts) => {
  const page = await browser.newPage()
  await page.goto('https://instagram.com/accounts/emailsignup/')

  // basic information
  // -----------------

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
  // if (signupButton.length > 0) {
  //   await signupButton[0].click({ delay: 30 })
  // }
  await Promise.all([
    // page.waitForNavigation(),
    signupButton.click({ delay: 30 })
  ])

  // follow suggestions
  // ------------------
  await delay(3000)
  await page.select('select[title="Month:"]', '5') // Set the month to June (value: 6)
  await page.select('select[title="Day:"]', '5') // Set the date to 8th (value: 8)
  await page.select('select[title="Year:"]', '1995') // Set the year to 2023
  // next step is to verify email from 'registrations@mail.instagram.com'
  await delay(10000)

  const nextButton = await page.$x('//button[@type="button"]')
  if (nextButton.length > 0) {
    nextButton[1].click()
  }
  await delay(10000)

  await page.waitForSelector('input[name=email_confirmation_code]', { visible: true })
  await delay(300)
  await page.type('input[name=email_confirmation_code]', '423467', { delay: 27 })

  await delay(10000)
  const confirmationButton = await page.$x('//button[@type="submit"]')
  if (confirmationButton.length > 0) {
    confirmationButton[0].click()
  }

  await page.close()
}
