import PuppeteerInstagram from './lib/puppeteerInstagram.js'

export const index = () => {
  const instagram = new PuppeteerInstagram({ headless: false })
  if (instagram.isAuthenticated === false) {
    console.error('Authentication does not verified')
  }
  if (instagram.user == null) {
    console.log('User is not available, so Initiating Signup Process')
  }

  instagram.signup({}).then(r => { console.log('Program Executed') }).catch(e => console.error(e))
}

index()
