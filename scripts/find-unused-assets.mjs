import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const SCAN_ROOTS = [
    path.join(root, 'src'),
    path.join(root, 'projects'),
    path.join(root, 'css'),
    path.join(root, 'js'),
    path.join(root, 'public'),
    path.join(root, 'index.html'),
]

const MEDIA_EXT = /\.(png|jpe?g|webp|svg|mp4)$/i

function collectSourceFiles(dirOrFile, out = []) {
    if (!fs.existsSync(dirOrFile)) return out
    const stat = fs.statSync(dirOrFile)
    if (stat.isFile()) {
        if (/\.(html|css|js)$/i.test(dirOrFile)) out.push(dirOrFile)
        return out
    }
    for (const entry of fs.readdirSync(dirOrFile, { withFileTypes: true })) {
        if (entry.name.startsWith('.')) continue
        collectSourceFiles(path.join(dirOrFile, entry.name), out)
    }
    return out
}

function extractUrls(content) {
    const urls = []
    const patterns = [
        /\bsrc=["']([^"']+)["']/g,
        /\bposter=["']([^"']+)["']/g,
        /url\(["']?([^"')]+)["']?\)/g,
    ]
    for (const re of patterns) {
        let m
        while ((m = re.exec(content))) urls.push(m[1])
    }
    return urls
}

function isLocalMedia(url) {
    const u = url.trim()
    return u.includes('img/') || u.includes('resource/')
}

function resolveToRepoPath(fromFile, url) {
    const clean = url.split('?')[0].split('#')[0].trim()
    if (!isLocalMedia(clean)) return null

    if (clean.startsWith('/')) {
        return path.normalize(path.join(root, clean.slice(1)))
    }
    if (clean.startsWith('img/') || clean.startsWith('resource/')) {
        return path.normalize(path.join(root, clean))
    }

    const normalizedFrom = fromFile.split(path.sep).join('/')
    if (normalizedFrom.includes('/src/partials/projects/')) {
        return path.normalize(path.resolve(path.join(root, 'projects'), clean))
    }

    return path.normalize(path.resolve(path.dirname(fromFile), clean))
}

function walkMedia(dir, out = []) {
    if (!fs.existsSync(dir)) return out
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const abs = path.join(dir, entry.name)
        if (entry.isDirectory()) walkMedia(abs, out)
        else if (MEDIA_EXT.test(entry.name)) out.push(abs)
    }
    return out
}

const used = new Set()
const sourceFiles = SCAN_ROOTS.flatMap((p) => collectSourceFiles(p))

for (const file of sourceFiles) {
    const content = fs.readFileSync(file, 'utf8')
    for (const url of extractUrls(content)) {
        const abs = resolveToRepoPath(file, url)
        if (abs && fs.existsSync(abs)) {
            used.add(abs)
            if (/\.(png|jpe?g)$/i.test(abs)) {
                const webp = abs.replace(/\.(png|jpe?g)$/i, '.webp')
                if (fs.existsSync(webp)) used.add(webp)
            }
        }
    }
}

const allMedia = [
    ...walkMedia(path.join(root, 'public', 'img')),
    ...walkMedia(path.join(root, 'public', 'resource')),
]

const unused = allMedia.filter((f) => !used.has(path.normalize(f)))

if (process.argv.includes('--json')) {
    console.log(JSON.stringify(unused.map((f) => path.relative(root, f)), null, 2))
} else {
    console.log(`Used: ${used.size}, total: ${allMedia.length}, unused: ${unused.length}`)
    for (const f of unused.sort()) console.log(path.relative(root, f))
}
