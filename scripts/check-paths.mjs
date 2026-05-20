import path from 'path'
import { projectRoot } from './lib/project-root.mjs'
import { collectHtmlCssFiles } from './lib/walk-files.mjs'
import { findLegacyPathViolations } from './lib/check-legacy-paths-core.mjs'

const TARGET_DIRS = [
    path.join(projectRoot, 'src', 'partials'),
    path.join(projectRoot, 'projects'),
    path.join(projectRoot, 'index.html'),
    path.join(projectRoot, 'css'),
]

const files = collectHtmlCssFiles(projectRoot, TARGET_DIRS)
const violations = findLegacyPathViolations(files)

if (violations.length) {
    console.error(`Legacy path violations: ${violations.length}`)
    for (const v of violations) {
        const rel = path.relative(projectRoot, v.file)
        console.error(`- ${rel}:${v.line} [${v.rule}] ${v.snippet}`)
    }
    process.exit(1)
}

console.log(`OK: ${files.length} HTML/CSS files use /img/ and /resource/ paths.`)
