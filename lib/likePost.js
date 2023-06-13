'use strict'
import delay from 'delay'

export const likePost = async (browser, user) => {
  try {
    const page = await browser.newPage()
    // go to instagram feed
    await page.goto('https://instagram.com/')
    await delay(7000)

    setTimeout(async () => {
    // scrap likeButton section html
      for (let item = 0; item <= 100; item++) {
        // const [signup] = await page.$x('//button[contains(.,"Log in")]')

        const xPathStart = '/html/body/div[2]/div/div/div[1]/div/div/div/div[1]/div[1]/div[2]/section/main/div[1]/div/div/div[2]/div/div[2]/div/article['
        const variablePath = item
        const xPathEnd = ']/div/div[3]/div/div/div[1]/div[1]/span[1]/button/div[2]/span'
        const likeButton = await page.$x(`${xPathStart}${variablePath}${xPathEnd}`[0])
        // Rest of your code using the 'likeButton' variable
        await Promise.all([
          likeButton.click({ delay: 30 })
        ])
        console.log({ likeButton })
      }
    }, 3000)
  } catch (err) {
    console.error(err)
  }
}
