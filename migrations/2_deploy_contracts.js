var wrappedXX = artifacts.require('./contracts/WrappedXX')

module.exports = function (deployer) {
  deployer.then(async () => {
    try {
        await deployer.deploy(wrappedXX)
    } catch (err) {
      console.log(('Failed to Deploy Wrapped XX Contract', err))
    }
  })
}
