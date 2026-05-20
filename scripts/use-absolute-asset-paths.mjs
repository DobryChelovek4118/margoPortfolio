import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

function walk(dir, out = []) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name)
        if (e.isDirectory()) walk(p, out)
        else if (e.name.endsWith('.html')) out.push(p)
    }
    return out
}

const files = [
    path.join(root, 'index.html'),
    ...walk(path.join(root, 'src')),
    ...walk(path.join(root, 'projects')),
]

for (const file of files) {
    let s = fs.readFileSync(file, 'utf8')
    const next = s
        .replaceAll('../img/', '/img/')
        .replaceAll('../resource/', '/resource/')
        .replaceAll('src="img/', 'src="/img/')
        .replaceAll('poster="img/', 'poster="/img/')
    if (next !== s) fs.writeFileSync(file, next)
}

console.log(`Updated ${files.length} HTML files.`)
