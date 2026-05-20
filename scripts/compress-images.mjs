import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const imgDir = path.resolve(__dirname, '../public/img')
const webpExt = /\.webp$/i
const webpOpts = { quality: 82, effort: 6 }

function walk(dir, files = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const abs = path.join(dir, entry.name)
        if (entry.isDirectory()) walk(abs, files)
        else if (webpExt.test(entry.name)) files.push(abs)
    }
    return files
}

function formatBytes(n) {
    if (n < 1024) return `${n} B`
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
    return `${(n / (1024 * 1024)).toFixed(2)} MB`
}

async function compressWebp(absPath) {
    const before = fs.statSync(absPath).size
    const tmp = `${absPath}.tmp`
    await sharp(absPath).webp(webpOpts).toFile(tmp)
    const after = fs.statSync(tmp).size
    if (after < before) {
        fs.renameSync(tmp, absPath)
        return { before, after, saved: true }
    }
    fs.unlinkSync(tmp)
    return { before, after: before, saved: false }
}

const files = fs.existsSync(imgDir) ? walk(imgDir) : []
let totalBefore = 0
let totalAfter = 0
let changed = 0

console.log(`Compressing ${files.length} WebP files in img/...\n`)

for (const file of files) {
    const result = await compressWebp(file)
    totalBefore += result.before
    totalAfter += result.after
    if (result.saved) {
        changed += 1
        const rel = path.relative(imgDir, file)
        console.log(
            `${rel}: ${formatBytes(result.before)} → ${formatBytes(result.after)} (−${Math.round((1 - result.after / result.before) * 100)}%)`,
        )
    }
}

console.log(`\nDone: ${changed}/${files.length} files reduced`)
console.log(`Total: ${formatBytes(totalBefore)} → ${formatBytes(totalAfter)} (−${Math.round((1 - totalAfter / totalBefore) * 100)}%)`)
