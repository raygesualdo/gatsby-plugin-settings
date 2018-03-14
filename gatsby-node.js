const fs = require('fs')
const chokidar = require('chokidar')
const throttle = require('lodash/throttle')
// TODO: figure out why `reporter == undefined` for export.sourceNodes fn
const reporter = require('gatsby-cli/lib/reporter')
const createSettingsNode = require('./utils/create-settings-node')
const { GLOB } = require('./utils/get-settings')

// Adapted from https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-source-filesystem/src/gatsby-node.js
const watchSettingsFiles = ({ boundActionCreators }, { path }) => {
  if (!path) {
    reporter.panic('options.path must be specified .')
  }
  if (!fs.existsSync(path)) {
    reporter.panic('options.path must exist.')
  }

  const { createNode } = boundActionCreators
  const createSettingsNodeThrottled = throttle(
    () => createSettingsNode({ createNode, path }),
    1000
  )
  const watcher = chokidar.watch(`${path}/${GLOB}`)
  watcher.on('add', createSettingsNodeThrottled)
  watcher.on('change', createSettingsNodeThrottled)
  watcher.on('unlink', createSettingsNodeThrottled)

  return new Promise((resolve, reject) => {
    watcher.on('ready', () => {
      createSettingsNodeThrottled()
      resolve()
    })
  })
}

exports.sourceNodes = watchSettingsFiles
