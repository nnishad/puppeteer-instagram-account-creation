'use strict'

import delay from 'delay'
import random from 'random'

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

  await delay(300)
  await page.type('input[name=password]', user.password, { delay: 42 })

  await delay(700)
  const [signupButton] = await page.$x('//button[@type="submit"]')
  // if (signupButton.length > 0) {
  //   await signupButton[0].click({ delay: 30 })
  // }
  await Promise.all([
    page.waitForNavigation(),
    signupButton.click({ delay: 30 })
  ])

  // follow suggestions
  // ------------------

  await delay(1000)

  const closeLinks = await page.$x('//span[@role="button" and contains(text(),"✕")]')
  closeLinks.forEach((closeLink) => {
    try {
      closeLink.click({ delay: 30 })
    } catch (err) {}
  })

  await delay(random.int(200, 1200))

  try {
    const followLinks = await page.$x('//button[contains(text(),"Follow")]')
    const numToFollow = random.int(followLinks.length)
    for (let i = 0; i < numToFollow; ++i) {
      const [follow] = followLinks.splice(random.int(0, followLinks.length - 1), 1)
      follow.click({ delay: 82 })
      await delay(random.int(800, 1600))
    }
  } catch (err) {
    console.warn('error following suggestions', err)
  }

  const [getStarted] = await page.$x('//button[contains(.,"Get Started")]')
  await Promise.all([
    page.waitForNavigation(),
    getStarted.click({ delay: 38 })
  ])

  // => https://www.instagram.com/ (main feed)

  // next step is to verify email from 'registrations@mail.instagram.com'
  await delay(200)
  await page.close()
}
