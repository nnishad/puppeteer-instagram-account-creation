'use strict'

import cheerio from 'cheerio'

export const parseVerificationEmail = (email) => {
  const $ = cheerio.load(email.html)
  return $('a[href*="confirm_email"]').attr('href')
}
