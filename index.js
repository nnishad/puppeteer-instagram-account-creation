import readline from 'readline'
import logger from './util/custom-logger.js'
import apiClient from './util/api-client.js'
import PuppeteerInstagram from './lib/puppeteerInstagram.js'

function prompt (question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

async function main () {
  let validAction = false
  let action

  while (!validAction) {
    action = await prompt('Enter action to perform.\n' +
      '1. Create Accounts\n' +
      '2. Warmup Accounts\n' +
      '3. exit\n')

    if (action === '1' || action === '2' || action === '3') {
      validAction = true
    } else {
      logger.error('Invalid action! Please enter 1, 2, or 3.')
    }
  }

  if (action === '1') {
    logger.info('Performing account creation...')
    try {
      const response = await apiClient.get('http://localhost:3001/profile/generate/5')
      // Process the response data
      logger.info('Data:', response)
    } catch (error) {
      logger.error('Account creation failed')
    }
    // Call your account creation function here
  } else if (action === '2') {
    logger.info('Performing account warmup...')
    try {
      const response = await apiClient.get('http://localhost:3001/profile/unused')
      // Process the response data
      logger.info('Data:', response)
      response.profiles.forEach(profile => {
        profile.remainingAccounts.forEach(() => {
          new PuppeteerInstagram({ headless: false })
            .signup(profile.uuid)
            .then(r => { console.log('Program Executed') })
            .catch(e => console.error(e))
        })
      })
    } catch (error) {
      logger.error('Account creation failed' + error)
    }
    /* const instagram = new PuppeteerInstagram({ headless: false })
    instagram.signup({}).then(r => { console.log('Program Executed') }).catch(e => console.error(e)) */
    // Call your account warmup function here
  } else if (action === '3') {
    logger.info('Exiting the program...')
  }
}

export const index = () => {
  /*  const instagram = new PuppeteerInstagram({ headless: false })
    if (instagram.isAuthenticated === false) {
      console.error('Authentication does not verified')
    }
    if (instagram.user == null) {
      console.log('User is not available, so Initiating Signup Process')
    }

    instagram.signup({}).then(r => { console.log('Program Executed') }).catch(e => console.error(e)) */

  main().catch((error) => console.error(error))
}

index()
