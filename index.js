import PuppeteerInstagram from './lib/puppeteerInstagram.js'

export const index = () => {
  const instagram = new PuppeteerInstagram({ headless: false })
  if (instagram.isAuthenticated === false) {
    console.log('not isAuthenticated')
  }
  if (instagram.user == null) {
    console.log('nul user')
  }

  instagram.signup({}).then(r => { console.log('run') }).catch(e => console.log(e))
}

index()
