import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import path from 'path'
import { fileURLToPath } from 'url'
import {
    extractAssetUrls,
    isAssetUrl,
    resolveAssetPath,
} from '../scripts/lib/check-assets-core.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

describe('extractAssetUrls', () => {
    it('finds src, poster and css url()', () => {
        const html = `
            <img src="/img/crm/01.webp" />
            <video poster="/resource/crm/hero.mp4"></video>
        `
        const css = `.hero { background: url('/img/shared/hero.webp'); }`
        assert.deepEqual(extractAssetUrls(html), [
            '/img/crm/01.webp',
            '/resource/crm/hero.mp4',
        ])
        assert.equal(extractAssetUrls(css)[0], '/img/shared/hero.webp')
    })
})

describe('isAssetUrl', () => {
    it('accepts absolute and legacy relative paths', () => {
        assert.equal(isAssetUrl('/img/foo.webp'), true)
        assert.equal(isAssetUrl('../img/foo.webp'), true)
        assert.equal(isAssetUrl('https://example.com/x'), false)
    })
})

describe('resolveAssetPath', () => {
    it('resolves /img/ to public/img/', () => {
        const from = path.join(root, 'src/partials/index/work.html')
        const abs = resolveAssetPath(from, '/img/shared/hero.webp', root)
        assert.equal(abs, path.join(root, 'public', 'img', 'shared', 'hero.webp'))
    })

    it('resolves legacy ../img/ from project partials to project root img/', () => {
        const from = path.join(root, 'src/partials/projects/crm/project-crm-hero.html')
        const abs = resolveAssetPath(from, '../img/crm/01.webp', root)
        assert.equal(abs, path.join(root, 'img', 'crm', '01.webp'))
    })
})
