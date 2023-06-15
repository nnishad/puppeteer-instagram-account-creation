'use strict'
import delay from 'delay'

function likePostsHandler (page) {
  setTimeout(async () => {
    try {
      const scrollStep = 500 // Number of pixels to scroll
      const scrollDelay = 1000 // Delay between each scroll step
      const maxScrollAttempts = 10 // Maximum number of scroll attempts

      for (let item = 1; item <= 100; item++) {
        const xPathStart = '/html/body/div[2]/div/div/div[1]/div/div/div/div[1]/div[1]/div[2]/section/main/div[1]/section/div/div[3]/div/div/div[1]/div/article['
        const variablePath = item
        const xPathEnd = ']/div/div[3]/div/div/section[1]/span[1]/button'
        delay(7000)
        const likeButtons = await page.$x(`${xPathStart}${variablePath}${xPathEnd}`)
        console.log({ length: likeButtons.length })
        if (likeButtons.length > 0) {
          const likeButton = likeButtons[0]
          // Rest of your code using the 'likeButton' variable
          await likeButton.click()
        } else {
          // Scroll to the next set of elements
          let scrollAttempts = 0
          while (scrollAttempts < maxScrollAttempts) {
            await page.evaluate((step) => {
              window.scrollBy(0, step) // Scroll vertically by 'step' pixels
            }, scrollStep)
            await page.waitForTimeout(scrollDelay)
            delay(5000)
            const updatedLikeButtons = await page.$x(`${xPathStart}${item}${xPathEnd}`)
            delay(2000)
            if (updatedLikeButtons.length > 0) {
              const likeButton = updatedLikeButtons[0]
              // Rest of your code using the 'likeButton' variable
              console.log({ length: updatedLikeButtons.length })
              await likeButton.click()
              break // Exit the loop after successful button click
            }

            scrollAttempts++
          }
        }
      }
    } catch (err) {
      console.error(err)
    }
  }, 3000)
}

export const likePost = async (browser, user) => {
  try {
    // go to instagram feed
    const page = await browser.newPage()
    await page.goto('https://instagram.com/')
    await delay(7000)
    const turnOnNotificationButtons = await page.$x('/html/body/div[2]/div/div/div[2]/div/div/div[1]/div/div[2]/div/div/div/div/div[2]/div/div/div[3]/button[1]')

    if (turnOnNotificationButtons.length > 0) {
      const turnOnNotificationButton = turnOnNotificationButtons[0]
      await turnOnNotificationButton.click()
      console.log('[Turn on Notification Yes Clicked]')
    }
    likePostsHandler(page)
  } catch (err) {
    console.error(err)
  }
}
