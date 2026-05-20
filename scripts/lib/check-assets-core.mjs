import fs from 'fs'
import path from 'path'

export function extractAssetUrls(content) {
    const urls = []
    for (const re of [
        /\bsrc=["']([^"']+)["']/g,
        /\bposter=["']([^"']+)["']/g,
        /\bhref=["']([^"']+)["']/g,
        /url\(["']?([^"')]+\.(?:webp|svg|mp4))["']?\)/gi,
    ]) {
        let m
        while ((m = re.exec(content))) {
            urls.push(m[1])
        }
    }
    return urls
}

export function isAssetUrl(url) {
    return (
        url.startsWith('/img/') ||
        url.startsWith('/resource/') ||
        url.startsWith('../img/') ||
        url.startsWith('../resource/')
    )
}

export function resolveAssetPath(fromFile, url, root) {
    const clean = url.split('?')[0].split('#')[0]
    if (clean.startsWith('/img/') || clean.startsWith('/resource/')) {
        return path.join(root, 'public', clean.slice(1))
    }
    if (clean.startsWith('/')) return path.join(root, clean.slice(1))

    const normalizedFrom = fromFile.split(path.sep).join('/')
    if (normalizedFrom.includes('/src/partials/projects/')) {
        return path.resolve(path.join(root, 'projects'), clean)
    }
    if (normalizedFrom.includes('/css/')) {
        return path.resolve(path.join(root, 'css'), clean)
    }
    return path.resolve(path.dirname(fromFile), clean)
}

export function findMissingAssets(root, files) {
    const missing = []
    for (const file of files) {
        const content = fs.readFileSync(file, 'utf8')
        const urls = extractAssetUrls(content).filter(isAssetUrl)
        for (const url of urls) {
            const abs = resolveAssetPath(file, url, root)
            if (!fs.existsSync(abs)) {
                missing.push({
                    file: path.relative(root, file),
                    url,
                    abs: path.relative(root, abs),
                })
            }
        }
    }
    return missing
}
