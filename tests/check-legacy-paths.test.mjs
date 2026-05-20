import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { findLegacyPathViolations } from '../scripts/lib/check-legacy-paths-core.mjs'

describe('findLegacyPathViolations', () => {
    it('flags relative img paths', () => {
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pf-paths-'))
        const file = path.join(tmp, 'x.html')
        fs.writeFileSync(file, '<img src="../img/foo.webp" />')
        const v = findLegacyPathViolations([file])
        assert.ok(v.some((x) => x.rule === 'relative img'))
        fs.rmSync(tmp, { recursive: true })
    })

    it('allows absolute webp paths', () => {
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pf-paths-'))
        const file = path.join(tmp, 'x.html')
        fs.writeFileSync(file, '<img src="/img/foo.webp" />')
        const v = findLegacyPathViolations([file])
        assert.equal(v.length, 0)
        fs.rmSync(tmp, { recursive: true })
    })
})
