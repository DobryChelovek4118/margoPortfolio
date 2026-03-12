import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const TARGET_DIRS = [
  path.join(root, 'src', 'partials'),
  path.join(root, 'projects'),
  path.join(root, 'index.html'),
].filter((p) => fs.existsSync(p))

function walk(dirOrFile, out = []) {
  const stat = fs.statSync(dirOrFile)
  if (stat.isFile()) {
    out.push(dirOrFile)
    return out
  }
  for (const entry of fs.readdirSync(dirOrFile, { withFileTypes: true })) {
    const abs = path.join(dirOrFile, entry.name)
    if (entry.isDirectory()) walk(abs, out)
    else out.push(abs)
  }
  return out
}

function uniq(arr) {
  return [...new Set(arr)]
}

function extractAssetUrls(content) {
  const urls = []

  // src="..." poster="..." href="..."
  for (const re of [
    /\bsrc=["']([^"']+)["']/g,
    /\bposter=["']([^"']+)["']/g,
    /\bhref=["']([^"']+)["']/g,
  ]) {
    let m
    while ((m = re.exec(content))) {
      urls.push(m[1])
    }
  }

  return urls
}

function isAssetUrl(url) {
  // Only check local media paths we own.
  return (
    url.startsWith('/img/') ||
    url.startsWith('/resource/') ||
    url.startsWith('../img/') ||
    url.startsWith('../resource/')
  )
}

function resolveAssetPath(fromFile, url) {
  const clean = url.split('?')[0].split('#')[0]
  if (clean.startsWith('/')) return path.join(root, clean)

  // Partials under src/partials/projects/** are included into projects/*.html.
  // Their relative paths like ../img/... are written relative to the project HTML location.
  const normalizedFrom = fromFile.split(path.sep).join('/')
  if (normalizedFrom.includes('/src/partials/projects/')) {
    return path.resolve(path.join(root, 'projects'), clean)
  }

  return path.resolve(path.dirname(fromFile), clean)
}

const files = uniq(
  TARGET_DIRS.flatMap((p) => (p.endsWith('.html') ? [p] : walk(p)))
).filter((f) => f.endsWith('.html'))

const missing = []

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8')
  const urls = extractAssetUrls(content).filter(isAssetUrl)
  for (const url of urls) {
    const abs = resolveAssetPath(file, url)
    if (!fs.existsSync(abs)) {
      missing.push({ file: path.relative(root, file), url, abs: path.relative(root, abs) })
    }
  }
}

if (missing.length) {
  console.error(`Missing assets: ${missing.length}`)
  for (const m of missing) {
    console.error(`- ${m.file}: ${m.url} -> ${m.abs}`)
  }
  process.exit(1)
} else {
  console.log(`OK: ${files.length} HTML files checked, all assets exist.`)
}

