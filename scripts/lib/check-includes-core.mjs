import fs from 'fs'
import path from 'path'

const INCLUDE_RE = /<include\s+src=["']([^"']+)["']\s*\/?>/g

export function extractIncludeSrcs(html) {
    const srcs = []
    let m
    const re = new RegExp(INCLUDE_RE.source, INCLUDE_RE.flags)
    while ((m = re.exec(html))) {
        srcs.push(m[1])
    }
    return srcs
}

/**
 * @param {string[]} entryHtmlPaths absolute paths to index.html and projects/*.html
 * @param {string} root project root
 */
export function findMissingIncludes(entryHtmlPaths, root) {
    const missing = []
    const stack = []

    function visit(absEntry, chain) {
        if (!fs.existsSync(absEntry)) {
            missing.push({
                chain: [...chain, path.relative(root, absEntry)],
                src: path.relative(root, absEntry),
                reason: 'entry not found',
            })
            return
        }

        const content = fs.readFileSync(absEntry, 'utf8')
        for (const src of extractIncludeSrcs(content)) {
            const partialAbs = path.resolve(root, src)
            const rel = path.relative(root, partialAbs)
            if (chain.includes(rel)) {
                missing.push({
                    chain: [...chain, rel],
                    src: rel,
                    reason: 'circular include',
                })
                continue
            }
            if (!fs.existsSync(partialAbs)) {
                missing.push({
                    chain: [...chain, rel],
                    src: rel,
                    reason: 'file not found',
                })
                continue
            }
            visit(partialAbs, [...chain, rel])
        }
    }

    for (const entry of entryHtmlPaths) {
        const rel = path.relative(root, entry)
        visit(entry, [rel])
    }

    return missing
}

export function collectHtmlEntrypoints(root) {
    const entries = [path.join(root, 'index.html')]
    const projectsDir = path.join(root, 'projects')
    if (fs.existsSync(projectsDir)) {
        for (const name of fs.readdirSync(projectsDir)) {
            if (name.endsWith('.html')) {
                entries.push(path.join(projectsDir, name))
            }
        }
    }
    return entries.filter((p) => fs.existsSync(p))
}
