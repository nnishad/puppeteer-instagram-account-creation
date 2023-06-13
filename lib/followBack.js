'use strict'
import delay from 'delay'

export const followBack = async (browser, user) => {
  try {
    const page = await browser.newPage()
    const username = 'vindiesel'
    // go to profile page
    await page.goto(`https://instagram.com/${username}/`)
    await delay(300)

    // click on followers button
    await page.waitForSelector(`a[href="/${username}/followers/"]`)
    await page.click(`a[href="/${username}/followers/"]`)
    await delay(300)

    setTimeout(async () => {
    // scrap followers section html
      // const followHandles = await page.$x('//button[@type="button"]')
      for (let item = 0; item <= 100; item++) {
        const xPathStart = '/html/body/div[2]/div/div/div[2]/div/div/div[1]/div/div[2]/div/div/div/div/div[2]/div/div/div[2]/div[1]/div/div['
        const variablePath = item
        const xPathEnd = ']/div/div/div/div[3]/div/button/div/div'
        const followButton = await page.$x(`${xPathStart}${variablePath}${xPathEnd}`)[0]
        // Rest of your code using the 'followButton' variable
        console.log({ followButton })
        // followButton.click()
      }
    }, 3000)
  } catch (err) {
    console.error(err)
  }
}
