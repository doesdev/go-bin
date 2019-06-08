'use strict'

const { runTests, testAsync } = require('mvt')
const fs = require('fs').promises
const { resolve, join } = require('path')
const goBin = require('./index')
const vendor = resolve(__dirname, 'vendor')
const version = '1.12.5'

const exists = async (f) => {
  try {
    await fs.stat(f)
    return true
  } catch (ex) {
    if (ex.code !== 'ENOENT') console.error(ex)

    return false
  }
}

const rmDir = async (dir) => {
  let files

  try {
    files = await fs.readdir(dir)
  } catch (e) {
    return
  }

  for (let file of files) {
    const filePath = join(dir, file)

    if ((await fs.stat(filePath)).isDirectory()) {
      try {
        await rmDir(filePath)
      } catch (ex) {}
    } else {
      await fs.unlink(filePath)
    }
  }

  await fs.rmdir(dir)
}

const clearDir = async () => {
  if (!(await exists(vendor))) return

  try {
    await rmDir(vendor)
  } catch (ex) {
    console.log(ex)
  }
}

runTests('testing go-bin', async () => {
  await clearDir()

  await testAsync(`goBin downloads and unpacks as expected`, async () => {
    if (await exists(vendor)) return false

    await goBin({ version, dir: vendor, includeTag: false })

    return exists(vendor)
  })

  await clearDir()

  return true
})
