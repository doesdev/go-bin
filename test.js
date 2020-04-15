'use strict'

const test = require('mvt')
const fs = require('fs')
const { resolve, join } = require('path')
const goBin = require('./index')
const vendor = resolve(__dirname, 'vendor')
const version = '1.12.5'

const exists = (f) => {
  try {
    fs.statSync(f)
    return true
  } catch (ex) {
    if (ex.code !== 'ENOENT') console.error(ex)
    return false
  }
}

const rmDir = (dir) => {
  let files

  try {
    files = fs.readdirSync(dir)
  } catch (e) {
    return
  }

  for (const file of files) {
    const filePath = join(dir, file)

    if (fs.statSync(filePath).isDirectory()) {
      try {
        rmDir(filePath)
      } catch (ex) {}
    } else {
      try {
        fs.unlinkSync(filePath)
      } catch (ex) {
        console.error(ex)
      }
    }
  }

  fs.rmdirSync(dir)
}

const clearDir = () => {
  if (!exists(vendor)) return

  try {
    rmDir(vendor)
  } catch (ex) {
    console.log(ex)
  }
}

test.before(() => { clearDir() })
test.after(() => { clearDir() })

test('goBin downloads and unpacks as expected', async (assert) => {
  if (exists(vendor)) throw new Error('Cannot test, directory not empty')

  await goBin({ version, dir: vendor, includeTag: false })

  assert.true(exists(vendor))
})
