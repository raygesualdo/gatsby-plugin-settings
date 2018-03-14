const fs = require('fs')
const { basename, extname } = require('path')
const glob = require('glob')
const toml = require('toml')
const yaml = require('js-yaml')
const set = require('lodash/set')
// TODO: figure out why `reporter == undefined` for export.sourceNodes fn
const reporter = require('gatsby-cli/lib/reporter')

const GLOB = '*.@(yml|yaml|toml|json)'

const getKey = file => basename(file).split('.')[0]

const getData = file => {
  switch (extname(file)) {
    case '.yml':
    case '.yaml':
      return yaml.safeLoad(fs.readFileSync(file, 'utf-8'))
    case '.toml':
      return toml.parse(fs.readFileSync(file, 'utf-8'))
    case '.json':
      return require(file)
    default:
      // We should never get here
      return
  }
}

const getSettings = ({ path }) =>
  glob.sync(`${path}/${GLOB}`).reduce((obj, file) => {
    try {
      return set(obj, getKey(file), getData(file))
    } catch (e) {
      reporter.warn(`Could not parse ${file}. Skipping.`)
      return obj
    }
  }, {})

exports.getSettings = getSettings
exports.GLOB = GLOB
