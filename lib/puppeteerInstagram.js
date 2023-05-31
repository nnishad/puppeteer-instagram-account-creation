import { faker } from '@faker-js/faker'
import puppeteer from 'puppeteer-extra'

import { signup } from './signup.js'
import { signin } from './signin.js'
import { signout } from './signout.js'
import { verifyEmail } from './verify-email.js'

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

  async signup (user, opts = {}) {
    if (this.isAuthenticated) {
      throw new Error('"signup" requires no authentication')
    }
    // ow(user, ow.object.plain.nonEmpty.label('user'))
    // ow(user.email, ow.string.nonEmpty.label('user.email'))

    user.username = faker.internet.userName()
    user.password = faker.internet.password()
    user.firstName = faker.person.firstName()
    user.lastName = faker.person.lastName()
    user.email = faker.internet.email()

    user.username = user.username
      .trim()
      .toLowerCase()
      .replace(/[^\d\w-]/g, '-')
      .replace(/_/g, '-')
      .replace(/^-/g, '')
      .replace(/-$/g, '')
      .replace(/--/g, '-')

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
