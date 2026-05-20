/**
 * WebP-only migration: convert PNG/JPG in img/ → optimized WebP, delete raster sources.
 * Run: node scripts/to-webp-only.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const imgDir = path.join(root, 'img')

const rasterExt = /\.(png|jpe?g)$/i
const webpOpts = { quality: 82, effort: 6 }

function walk(dir, files = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const abs = path.join(dir, entry.name)
        if (entry.isDirectory()) walk(abs, files)
        else files.push(abs)
    }
    return files
}

async function rasterToWebp(srcPath) {
    const webpPath = srcPath.replace(rasterExt, '.webp')
    const tmp = `${webpPath}.tmp`
    await sharp(srcPath).webp(webpOpts).toFile(tmp)
    fs.renameSync(tmp, webpPath)
    return webpPath
}

async function recompressWebp(webpPath) {
    const before = fs.statSync(webpPath).size
    const tmp = `${webpPath}.tmp`
    await sharp(webpPath).webp(webpOpts).toFile(tmp)
    const after = fs.statSync(tmp).size
    if (after <= before) {
        fs.renameSync(tmp, webpPath)
        return { before, after, saved: true }
    }
    fs.unlinkSync(tmp)
    return { before, after: before, saved: false }
}

const allFiles = fs.existsSync(imgDir) ? walk(imgDir) : []
const rasters = allFiles.filter((f) => rasterExt.test(f))
const webps = allFiles.filter((f) => f.endsWith('.webp'))

console.log(`Converting ${rasters.length} PNG/JPG → WebP...`)
for (const src of rasters) {
    const rel = path.relative(imgDir, src)
    await rasterToWebp(src)
    fs.unlinkSync(src)
    console.log(`  ${rel} → deleted, webp updated`)
}

console.log(`\nRecompressing ${webps.length} existing WebP...`)
let saved = 0
for (const file of webps) {
    const result = await recompressWebp(file)
    if (result.saved && result.after < result.before) saved += 1
}
console.log(`  ${saved}/${webps.length} webp files reduced further`)

console.log('\nDone. Update HTML/CSS paths to .webp if not already.')
