import path from 'path'
import { projectRoot } from './lib/project-root.mjs'
import { collectHtmlCssFiles } from './lib/walk-files.mjs'
import { findMissingAssets } from './lib/check-assets-core.mjs'

const TARGET_DIRS = [
    path.join(projectRoot, 'src', 'partials'),
    path.join(projectRoot, 'projects'),
    path.join(projectRoot, 'index.html'),
    path.join(projectRoot, 'css'),
]

const files = collectHtmlCssFiles(projectRoot, TARGET_DIRS)
const missing = findMissingAssets(projectRoot, files)

if (missing.length) {
    console.error(`Missing assets: ${missing.length}`)
    for (const m of missing) {
        console.error(`- ${m.file}: ${m.url} -> ${m.abs}`)
    }
    process.exit(1)
}

console.log(`OK: ${files.length} HTML/CSS files checked, all assets exist.`)
