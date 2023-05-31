'use strict'

import PuppeteerEmail from 'puppeteer-email'
import pRetry from 'p-retry'

import { parseVerificationEmail } from './parse-verification-email.js'

export const verifyEmail = async (browser, user, opts = {}) => {
  const client = new PuppeteerEmail(user.email)

  const session = await client.signin(user, {
    ...opts,
    browser
  })

  // TODO: checking for a valid email should be part of the retry loop
  const emails = await pRetry(async () => session.getEmails({
    query: 'from:registrations@mail.instagram.com confirm'
  }), {
    retries: 3
  })

  // console.log(JSON.stringify(emails, null, 2))
  const validEmails = emails.filter((email) => email && email.html)

  if (validEmails.length) {
    const email = validEmails[0]
    const url = parseVerificationEmail(email)
    const page = await browser.newPage()
    await page.goto(url)
    await page.close()
  } else {
    throw new Error(`unable to find verification email for ${user.email}`)
  }
}
