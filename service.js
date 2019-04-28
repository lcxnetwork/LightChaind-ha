// Copyright (c) 2018, Brandon Lehmann, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

'use strict'

const LightChaind = require('./')
const util = require('util')

var daemon = new LightChaind({
  // These are our LightChaind-ha options
  pollingInterval: 10000, 
  maxPollingFailures: 3, 
  checkHeight: true, 
  maxDeviance: 5, 
  clearP2pOnStart: true, 
  clearDBLockFile: true, 
  timeout: 100000, 

  // These are the standard LightChaind options
  path: '~/LightChain/LightChaind', 
  dataDir: '~/.LightChain', 
  testnet: false, 
  enableCors: "*", 
  enableBlockExplorer: true, 
  loadCheckpoints: false, 
  rpcBindIp: '0.0.0.0', 
  rpcBindPort: 10002, 
  p2pBindIp: '0.0.0.0',
  p2pBindPort: 10001, 
  peers: false,
  validate: '80620f845dbdf3a4b3bd1fc944836eec'

})

function log (message) {
  console.log(util.format('%s: %s', (new Date()).toUTCString(), message))
}

daemon.on('start', (args) => {
  log(util.format('LightChaind has started... %s', args))
})

daemon.on('started', () => {
  log('LightChaind is attempting to synchronize with the network...')
})

daemon.on('syncing', (info) => {
  log(util.format('LightChaind has synchronized %s out of %s blocks [%s%]', info.height, info.network_height, info.percent))
})

daemon.on('synced', () => {
  log('LightChaind is synchronized with the network...')
})

daemon.on('ready', (info) => {
  log(util.format('LightChaind is waiting for connections at %s @ %s - %s H/s', info.height, info.difficulty, info.globalHashRate))
})

daemon.on('desync', (daemon, network, deviance) => {
  log(util.format('LightChaind is currently off the blockchain by %s blocks. Network: %s  Daemon: %s', deviance, network, daemon))
})

daemon.on('down', () => {
  log('LightChaind is not responding... stopping process...')
  daemon.stop()
})

daemon.on('stopped', (exitcode) => {
  log(util.format('LightChaind has closed (exitcode: %s)... restarting process...', exitcode))
  daemon.start()
})

daemon.on('info', (info) => {
  log(info)
})

daemon.on('error', (err) => {
  log(err)
})

daemon.start()
