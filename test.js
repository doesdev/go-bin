'use strict'

import test from 'ava'
import { resolve } from 'path'
import { remove, pathExists } from 'fs-extra'
import goBin from './index'
const vendor = resolve(__dirname, 'vendor')
const version = '1.9.4'

const clearDir = async () => {
  if (!(await pathExists(vendor))) return
  try {
    await remove(vendor)
  } catch (ex) {
    console.log(ex)
  }
}

test.before(clearDir)
test.after(clearDir)

test(`goBin downloads and unpacks as expected`, async (assert) => {
  assert.falsy(await pathExists(vendor))
  await goBin({version, dir: vendor, includeTag: false})
  assert.truthy(await pathExists(vendor))
})
