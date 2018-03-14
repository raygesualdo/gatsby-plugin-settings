# gatsby-plugin-settings

[![npm (scoped)](https://img.shields.io/npm/v/@raygesualdo/gatsby-plugin-settings.svg?style=flat-square)](https://www.npmjs.com/package/@raygesualdo/gatsby-plugin-settings)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

This plugin allows the user to add settings as YAML, TOML, and/or JSON files to their site and consume their data via Gatsby's GraphQL layer.

## Install

```shell
$ npm install --save @raygesualdo/gatsby-plugin-settings
```

## How to Use

#### Configure your Gatsby site.

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: '@raygesualdo/gatsby-plugin-settings',
    options: {
      path: `${__dirname}/path/to/settings/directory`,
    },
  },
]
```

NOTE: `options.path` must exist before starting Gatsby!

#### Add and query settings files

In the directory specified in `options.path`, create YAML, TOML and/or JSON files.

```js
// contributors.json
[
  { name: 'Jane Smith', handle: 'janesmith03' },
  { name: 'Dwayne Jones', handle: 'dwayne_jones' },
]
```

```yaml
# social.yml
facebook: 'myFacebookHandle'
twitter: 'myTwitterHandle'
linkedin: 'myLinkedinHandle'
```

```toml
# location.toml
[address]
streetAddress = "123 Main Street"
city = "Springfield"
```

Then query them as you would any other Gatsby data.

```graphql
query Settings {
  siteSettings {
    contributors {
      name
      handle
    }
    social {
      facebook
      twitter
      linkedin
    }
    location {
      address {
        streetAddress
        city
      }
    }
  }
}
```

The above query would result in the following data set:

```json
{
  "data": {
    "siteSettings": {
      "contributors": [
        {
          "name": "Jane Smith",
          "handle": "janesmith03"
        },
        {
          "name": "Dwayne Jones",
          "handle": "dwayne_jones"
        }
      ],
      "social": {
        "facebook": "myFacebookHandle",
        "twitter": "myTwitterHandle",
        "linkedin": "myLinkedinHandle"
      },
      "location": {
        "address": {
          "streetAddress": "123 Main Street",
          "city": "Springfield"
        }
      }
    }
  }
}
```

## Things to Know

* Currently, only one instance of this plugin is allowed per site.
* This plugin supports the following file extensions: `.yml`, `.yaml`, `.toml`, and `.json`
* This will add both a `siteSettings` and `allSiteSettings` fields to the root GraphQL query. Only `siteSettings` is to be used. `allSiteSettings` is a side-effect of Gatsby assuming all node types are collections.
* When working with arrays of data, values as the same path cannot be of different types. This requirement is due to GraphQL's strongly-typed schema; neither this plugin nor Gatsby can change that. For instance, the following YAML file will throw an error:

  ```yaml
  oops:
    - 1
    - "a string"
  ```

* This plugin watches your settings file and will hot-reload your settings when values change but your query schema does not e.g. changing a value or adding an item to a pre-existing array. Settings changes that affect your query schema will require a full restart of Gatsby's dev mode, e.g. adding a settings file or changing a key name.
