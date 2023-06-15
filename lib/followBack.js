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
      try {
        const scrollStep = 500 // Number of pixels to scroll
        const scrollDelay = 1000 // Delay between each scroll step
        const maxScrollAttempts = 10 // Maximum number of scroll attempts

        for (let item = 1; item <= 100; item++) {
          const xPathStart = '/html/body/div[2]/div/div/div[2]/div/div/div[1]/div/div[2]/div/div/div/div/div[2]/div/div/div[2]/div[1]/div/div['
          const xPathEnd = ']/div/div/div/div[3]/div/button/div/div'
          const followButtons = await page.$x(`${xPathStart}${item}${xPathEnd}`)
          if (followButtons.length > 0) {
            const followButton = followButtons[0]
            // Rest of your code using the 'followButton' variable
            // ? Add names of the following in the list. & random for loop number
            await followButton.click()
          }
          const followerUsernameXPathStart = '/html/body/div[2]/div/div/div[2]/div/div/div[1]/div/div[2]/div/div/div/div/div[2]/div/div/div[2]/div[1]/div/div['
          const followerUsernameXPathEnd = ']/div/div/div/div[2]/div/div/span[1]/span/div/div/div/a'
          const followerNames = await page.$x(`${followerUsernameXPathStart}${item}${followerUsernameXPathEnd}`)
          await delay(2000)
          if (followerNames.length > 0) {
            const followerName = followerNames[0]
            const followerText = await page.evaluate((element) => element.textContent, followerName)
            const currentDate = new Date()
            const timestamp = currentDate.getTime()
            const followerData = {
              followerUsername: followerText,
              timestamp
            }
            console.log({ followerData })
            // Do something with the followerText, such as adding it to a list
          } else {
            // Scroll to the next set of elements
            let scrollAttempts = 0
            while (scrollAttempts < maxScrollAttempts) {
              await page.evaluate((step) => {
                window.scrollBy(0, step) // Scroll vertically by 'step' pixels
              }, scrollStep)
              await page.waitForTimeout(scrollDelay)

              const updatedFollowButtons = await page.$x(`${xPathStart}${item}${xPathEnd}`)
              if (updatedFollowButtons.length > 0) {
                const followButton = updatedFollowButtons[0]
                // Rest of your code using the 'followButton' variable
                await followButton.click()
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
  } catch (err) {
    console.error(err)
  }
}
