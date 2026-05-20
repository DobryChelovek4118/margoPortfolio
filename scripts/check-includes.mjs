import { projectRoot } from './lib/project-root.mjs'
import {
    collectHtmlEntrypoints,
    findMissingIncludes,
} from './lib/check-includes-core.mjs'

const entries = collectHtmlEntrypoints(projectRoot)
const missing = findMissingIncludes(entries, projectRoot)

if (missing.length) {
    console.error(`Include errors: ${missing.length}`)
    for (const m of missing) {
        console.error(`- ${m.reason}: ${m.src} (from ${m.chain.join(' → ')})`)
    }
    process.exit(1)
}

console.log(`OK: ${entries.length} HTML entrypoints, all includes resolve.`)
