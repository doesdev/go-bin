'use strict'

const { runTests, testAsync } = require('mvt')
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

  for (let file of files) {
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

runTests('testing go-bin', () => {
  clearDir()

  return testAsync(`goBin downloads and unpacks as expected`, () => {
    if (exists(vendor)) return Promise.resolve(false)

    return goBin({ version, dir: vendor, includeTag: false }).then(() => {
      return exists(vendor)
    })
  }).then((result) => {
    clearDir()

    return result
  })
})
