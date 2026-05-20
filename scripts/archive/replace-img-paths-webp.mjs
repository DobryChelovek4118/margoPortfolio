/**
 * Replace .png / .jpg in local img/ URLs inside HTML and CSS.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const TARGETS = [
    path.join(root, 'src', 'partials'),
    path.join(root, 'projects'),
    path.join(root, 'css'),
    path.join(root, 'index.html'),
].filter((p) => fs.existsSync(p))

function walk(dirOrFile, out = []) {
    const stat = fs.statSync(dirOrFile)
    if (stat.isFile()) {
        out.push(dirOrFile)
        return out
    }
    for (const entry of fs.readdirSync(dirOrFile, { withFileTypes: true })) {
        walk(path.join(dirOrFile, entry.name), out)
    }
    return out
}

function shouldReplaceUrl(url) {
    return (
        url.includes('/img/') ||
        url.includes('../img/') ||
        url.startsWith('img/') ||
        url.includes("'img/") ||
        url.includes('"img/')
    )
}

function replaceContent(content) {
    return content
        .replace(
            /((?:\.\.\/img\/|\/img\/|img\/)[^"'()\s]+\.)(png|jpe?g)/gi,
            (_, prefix) => `${prefix}webp`,
        )
        .replace(
            /(url\(['"]?\.\.\/img\/[^)'"]+\.)(png|jpe?g)(['"]?\))/gi,
            (_, prefix, _ext, suffix) => `${prefix}webp${suffix}`,
        )
}

const files = [...new Set(TARGETS.flatMap((p) => (p.endsWith('.html') ? [p] : walk(p))))].filter(
    (f) => f.endsWith('.html') || f.endsWith('.css'),
)

let changed = 0
for (const file of files) {
    const before = fs.readFileSync(file, 'utf8')
    const after = replaceContent(before)
    if (after !== before) {
        fs.writeFileSync(file, after)
        changed += 1
        console.log(path.relative(root, file))
    }
}
console.log(`\nUpdated ${changed} files.`)
