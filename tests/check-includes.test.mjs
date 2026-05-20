import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import os from 'os'
import path from 'path'
import {
    extractIncludeSrcs,
    findMissingIncludes,
} from '../scripts/lib/check-includes-core.mjs'

describe('extractIncludeSrcs', () => {
    it('parses include tags', () => {
        const html = '<include src="src/partials/foo.html" />\n<include src=\'bar.html\'></include>'
        assert.deepEqual(extractIncludeSrcs(html), [
            'src/partials/foo.html',
            'bar.html',
        ])
    })
})

describe('findMissingIncludes', () => {
    it('reports missing partial', () => {
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pf-include-'))
        fs.writeFileSync(
            path.join(tmp, 'index.html'),
            '<include src="missing.html" />',
        )
        const missing = findMissingIncludes([path.join(tmp, 'index.html')], tmp)
        assert.equal(missing.length, 1)
        assert.equal(missing[0].reason, 'file not found')
        fs.rmSync(tmp, { recursive: true })
    })

    it('reports circular include', () => {
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pf-include-'))
        fs.writeFileSync(path.join(tmp, 'a.html'), '<include src="b.html" />')
        fs.writeFileSync(path.join(tmp, 'b.html'), '<include src="a.html" />')
        fs.writeFileSync(path.join(tmp, 'index.html'), '<include src="a.html" />')
        const missing = findMissingIncludes([path.join(tmp, 'index.html')], tmp)
        assert.ok(missing.some((m) => m.reason === 'circular include'))
        fs.rmSync(tmp, { recursive: true })
    })
})
