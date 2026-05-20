import fs from 'fs'
import path from 'path'

export function walkFiles(dirOrFile, out = []) {
    if (!fs.existsSync(dirOrFile)) return out
    const stat = fs.statSync(dirOrFile)
    if (stat.isFile()) {
        out.push(dirOrFile)
        return out
    }
    for (const entry of fs.readdirSync(dirOrFile, { withFileTypes: true })) {
        if (entry.name.startsWith('.')) continue
        walkFiles(path.join(dirOrFile, entry.name), out)
    }
    return out
}

export function collectHtmlCssFiles(root, targetDirs) {
    const existing = targetDirs.filter((p) => fs.existsSync(p))
    const files = [...new Set(existing.flatMap((p) => (p.endsWith('.html') ? [p] : walkFiles(p))))]
    return files.filter((f) => f.endsWith('.html') || f.endsWith('.css'))
}
