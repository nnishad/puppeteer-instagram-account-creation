import { faker } from '@faker-js/faker'
import puppeteer from 'puppeteer-extra'

import { signup } from './signup.js'
import { signin } from './signin.js'
import { signout } from './signout.js'
import { verifyEmail } from './verify-email.js'
import { countryList } from './countryIdList.js'
import { followBack } from './followBack.js'

import puppeteerExtraPluginStealth from 'puppeteer-extra-plugin-stealth'

puppeteer.use(puppeteerExtraPluginStealth())

class PuppeteerInstagram {
  constructor (opts = {}) {
    this._opts = opts
    this._user = null
  }

  get isAuthenticated () {
    return !!this._user
  }

  get user () {
    return this._user
  }

  async browser () {
    if (!this._browser) {
      this._browser = this._opts.browser || await puppeteer.launch({ headless: false })
    }
    return this._browser
  }

  async followBack () {
    // if (!this.isAuthenticated) {
    //   throw new Error('"signout" requires authentication')
    // }
    const browser = await this.browser()
    await followBack(browser)
  }

  async signup (user, opts = {}) {
    if (this.isAuthenticated) {
      throw new Error('"signup" requires no authentication')
    }
    let CountryId = '15'

    user.username = faker.internet.userName()
    user.password = faker.internet.password()
    user.firstName = faker.person.firstName()
    user.lastName = faker.person.lastName()
    user.username = user.username
      .trim()
      .toLowerCase()
      .replace(/[^\d\w-]/g, '-')
      .replace(/_/g, '-')
      .replace(/^-/g, '')
      .replace(/-$/g, '')
      .replace(/--/g, '-')
      .replace(/-/, '')
    const SmSPoolAPI = 'https://api.smspool.net/purchase/sms'
    const key = 'hFXGJFunoIckg01PLNJlEqHG5IcG8niv'
    countryList.forEach(element => {
      if (element.name === 'United Kingdom') {
        CountryId = element.ID
      }
    })
    // code 15 is for India  https://api.smspool.net/country/retrieve_all`
    const ServiceId = '457'
    const response = await fetch(`${SmSPoolAPI}?key=${key}&country=${CountryId}&service=${ServiceId}`)
    const jsonData = await response.json()
    const phoneNumber = jsonData.phonenumber
    const orderId = jsonData.order_id
    const country = jsonData.country
    const success = jsonData.success
    const countryCode = jsonData.cc
    const message = jsonData.message
    user.number = '+' + String(countryCode) + String(phoneNumber)
    user.orderId = orderId
    user.key = key
    console.log('[UserInformation]', { phoneNumber: user.number, orderId, country, success, countryCode, message })
    if (message.startsWith('This country is currently not available for this service')) {
      console.error('[Error Message]', { jsonData })
    }
    const browser = await this.browser()
    await signup(browser, user, opts)
    this._user = user

    if (opts.verify) {
      await this.verifyEmail(opts)
    }
  }

  async signin (user, opts = {}) {
    if (this.isAuthenticated) {
      throw new Error('"signin" requires no authentication')
    }

    const browser = await this.browser()
    await signin(browser, user, opts)

    this._user = user
  }

  async signout () {
    if (!this.isAuthenticated) {
      throw new Error('"signout" requires authentication')
    }
    const browser = await this.browser()

    await signout(browser, this._user)
    this._user = null
  }

  async verifyEmail (opts) {
    const browser = await this.browser()
    await verifyEmail(browser, {
      email: opts.email || this.user.email,
      password: opts.emailPassword
    }, opts)
  }

  async close () {
    const browser = await this.browser()
    await browser.close()

    this._browser = null
    this._user = null
  }
}

export default PuppeteerInstagram
