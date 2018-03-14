const crypto = require('crypto')
const { getSettings } = require('./get-settings')

const createSettingsNode = ({ createNode, path }) => {
  const settings = getSettings({ path })
  createNode(
    Object.assign({}, settings, {
      id: 'SiteSettings',
      parent: null,
      children: [],
      internal: {
        type: 'SiteSettings',
        contentDigest: crypto
          .createHash('md5')
          .update(JSON.stringify(settings))
          .digest('hex'),
      },
    })
  )
}

module.exports = createSettingsNode
