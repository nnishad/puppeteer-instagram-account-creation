'use strict'

import delay from 'delay'
// import { followBack } from './followBack.js'
import { likePost } from './likePost.js'

export const signin = async (browser, user, opts) => {
  const page = await browser.newPage()
  user.email = 'nightowldevelopers'
  user.password = 'nightowl'
  await page.goto('https://www.instagram.com/accounts/login/')

  await page.waitForSelector('input[name=username]', { visible: true })
  await delay(300)
  await page.type('input[name=username]', user.email || user.username, { delay: 27 })

  await page.waitForSelector('input[name=password]', { visible: true })
  await delay(520)
  await page.type('input[name=password]', user.password, { delay: 42 })

  await delay(700)
  const [signup] = await page.$x('//button[contains(.,"Log in")]')
  await Promise.all([
    page.waitForNavigation(),
    signup.click({ delay: 30 })
  ])

  // => https://www.instagram.com/ (main feed)

  await delay(200)
  // await page.close()
  try {
    const saveYourLoginInfoButton = await page.$x('//button[@type="button"]')
    if (saveYourLoginInfoButton.length > 0) {
      saveYourLoginInfoButton[0].click()
    }
  } catch (err) { console.error({ err }) } finally {
    console.log('Login Success, Ready for next Step..\n')
    // ?? Turn on Notification
    await delay(2000)
    await page.keyboard.press('Tab')
    await delay(2000)
    await page.keyboard.press('Space')
    await delay(300)
    // followBack(browser, user)
    likePost(browser, user)
  }
}
