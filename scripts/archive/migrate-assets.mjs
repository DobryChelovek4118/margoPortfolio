import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

/** @type {Record<string, string>} old relative path from repo root -> new */
const MOVES = {
    // shared
    'img/hero.jpg': 'img/shared/hero.jpg',
    'img/keys-2-loop.jpg': 'img/shared/work-e-comm-loop.jpg',
    'img/keys-2-loop-mobile.jpg': 'img/shared/work-e-comm-loop-mobile.jpg',
    'img/keys-3-loop.jpg': 'img/shared/work-marketplace-loop.jpg',
    'img/keys-3-loop-mobile.jpg': 'img/shared/work-marketplace-loop-mobile.jpg',
    'img/1-keys-loop.jpg': 'img/shared/work-providers-loop.jpg',
    'img/1-keys-loop-mobile.jpg': 'img/shared/work-providers-loop-mobile.jpg',

    // marketplace
    'img/411.png': 'img/marketplace/01-cover.png',
    'img/417.png': 'img/marketplace/02-process-stages.png',
    'img/420.png': 'img/marketplace/03-personas.png',
    'img/421.png': 'img/marketplace/04-user-stories.png',
    'img/419.png': 'img/marketplace/05-cjm.png',
    'img/404.png': 'img/marketplace/06-scenarios-table.png',
    'img/422.png': 'img/marketplace/07-site-before.png',
    'img/1924.png': 'img/marketplace/08-wireframes.png',
    'img/1925.png': 'img/marketplace/09-main-variants.png',
    'img/1926.png': 'img/marketplace/10-main-current.png',
    'img/423.png': 'img/marketplace/11-providers-page.png',
    'img/1927.png': 'img/marketplace/12-sim-card-flow.png',
    'img/424.png': 'img/marketplace/13-tariffs-page.png',
    'img/425.png': 'img/marketplace/14-modals.png',

    // providers
    'img/410.png': 'img/providers/01-cover.png',
    'img/400.png': 'img/providers/02-process-stages.png',
    'img/412.png': 'img/providers/03-competitors-table.png',
    'img/415.png': 'img/providers/04-mts-megafon.png',
    'img/413.png': 'img/providers/05-beeline-template.png',
    'img/416.png': 'img/providers/06-domru.png',

    // erm
    'img/keys-6-img-1.png': 'img/erm/01-cover.png',
    'img/401.png': 'img/erm/02-process-stages.png',
    'img/405.png': 'img/erm/03-scenarios-table.png',
    'img/407.png': 'img/erm/04-filters.png',
    'img/402.png': 'img/erm/05-admin.png',
    'img/403.png': 'img/erm/06-ticket-form.png',
    'img/406.png': 'img/erm/07-search-history.png',
    'img/409.png': 'img/erm/08-themes.png',

    // e-comm
    'img/418.png': 'img/e-comm/02-process-stages.png',
    'img/e-comm/keys-2-img.png': 'img/e-comm/01-cover-poster.png',
    'img/e-comm/keys-2-img-1.png': 'img/e-comm/03-tariff-card-poster.png',
    'img/e-comm/keys-2-img-2.png': 'img/e-comm/04-modals-poster.png',
    'img/e-comm/keys-2-img-3.png': 'img/e-comm/05-main-page.png',
    'img/e-comm/keys-2-img-4.png': 'img/e-comm/06-main-before-after.png',
    'img/e-comm/keys-2-img-5.png': 'img/e-comm/07-modals.png',
    'img/e-comm/keys-2-img-6.png': 'img/e-comm/08-scenarios-schema.png',

    // design-system
    'img/keys-7-img-1.png': 'img/design-system/01-cover-poster.png',
    'img/keys-7-img-2.png': 'img/design-system/02-showcase.png',

    // crm images
    'img/crm/keys-1-img-1.png': 'img/crm/01-cover-poster.png',
    'img/crm/keys-1-img-18.png': 'img/crm/02-flow-schema.png',
    'img/crm/keys-1-img-9.png': 'img/crm/03-flow-v1-v2.png',
    'img/crm/keys-1-img-10.png': 'img/crm/04-flow-v3-v4.png',
    'img/crm/keys-1-img-11.png': 'img/crm/05-flow-final.png',
    'img/crm/keys-1-img-5.png': 'img/crm/06-navigation.png',
    'img/crm/keys-1-img-13.png': 'img/crm/07-widgets.png',
    'img/crm/keys-1-img.png': 'img/crm/08-widgets-video-poster.png',
    'img/crm/keys-1-img-6.png': 'img/crm/09-ticket-page-v1.png',
    'img/crm/keys-1-img-14.png': 'img/crm/10-ticket-page-v2.png',
    'img/crm/keys-1-img-15.png': 'img/crm/11-client-card.png',
    'img/crm/keys-1-img-16.png': 'img/crm/12-tariff-modal.png',
    'img/crm/keys-1-img-3.png': 'img/crm/13-flow-video-poster.png',
    'img/crm/keys-1-img-7.png': 'img/crm/14-gamification-v1.png',
    'img/crm/keys-1-img-8.png': 'img/crm/15-gamification-v2.png',
    'img/crm/keys-1-img-4.png': 'img/crm/16-gamification-video-poster.png',
    'img/crm/keys-1-img-12.png': 'img/crm/17-schedule-variants.png',
    'img/crm/keys-1-img-11-2.png': 'img/crm/18-schedule-final.png',
    'img/crm/keys-1-img-2.png': 'img/crm/19-schedule-video-poster.png',
    'img/crm/keys-1-img-17.png': 'img/crm/20-design-system.png',
    'img/crm/keys-1-img-11-1.png': 'img/crm/21-profile-notifications.png',
    'img/crm/keys-1-img-11-3.png': 'img/crm/22-news-client.png',

    // mini-app images
    'img/mini-app/keys-3-img-7.png': 'img/mini-app/01-cover.png',
    'img/mini-app/keys-3-img-18.png': 'img/mini-app/02-ui-analysis.png',
    'img/mini-app/keys-3-img-9.png': 'img/mini-app/03-scenarios-schema.png',
    'img/mini-app/keys-3-img-8.png': 'img/mini-app/04-bot-onboarding.png',
    'img/mini-app/keys-3-img-14.png': 'img/mini-app/05-payment.png',
    'img/mini-app/keys-3-img-15.png': 'img/mini-app/06-channels.png',
    'img/mini-app/keys-3-img-3.png': 'img/mini-app/07-channels-video-poster.png',
    'img/mini-app/keys-3-img-17.png': 'img/mini-app/08-editor-scenarios.png',
    'img/mini-app/keys-3-img-12.png': 'img/mini-app/09-editor-buttons.png',
    'img/mini-app/keys-3-img-2.png': 'img/mini-app/10-create-post-poster.png',
    'img/mini-app/keys-3-img-4.png': 'img/mini-app/11-post-themes-poster.png',
    'img/mini-app/keys-3-img-16.png': 'img/mini-app/12-signature.png',
    'img/mini-app/keys-3-img-6.png': 'img/mini-app/13-calendar-poster.png',
    'img/mini-app/keys-3-img-13.png': 'img/mini-app/14-profile.png',
    'img/mini-app/keys-3-img-5.png': 'img/mini-app/15-themes-video-poster.png',

    // videos
    'resource/e-comm/keys-2.mp4': 'resource/e-comm/hero.mp4',
    'resource/e-comm/progect-keys-2-video-1.mp4': 'resource/e-comm/tariff-card.mp4',
    'resource/e-comm/progect-keys-2-video-2.mp4': 'resource/e-comm/modals-demo.mp4',

    'resource/crm/progect-keys-1-video-1.mp4': 'resource/crm/hero.mp4',
    'resource/crm/keys-1.mp4': 'resource/crm/widgets-demo.mp4',
    'resource/crm/progect-keys-1-video-2.mp4': 'resource/crm/schedule-demo.mp4',
    'resource/crm/progect-keys-1-video-3.mp4': 'resource/crm/flow-demo.mp4',
    'resource/crm/progect-keys-1-video-4.mp4': 'resource/crm/gamification-demo.mp4',

    'resource/mini-app/keys-3.mp4': 'resource/mini-app/hero.mp4',
    'resource/mini-app/progect-keys-3-video-2.mp4': 'resource/mini-app/editor-demo.mp4',
    'resource/mini-app/progect-keys-3-video-3.mp4': 'resource/mini-app/channels-demo.mp4',
    'resource/mini-app/progect-keys-3-video-4.mp4': 'resource/mini-app/create-post-demo.mp4',
    'resource/mini-app/progect-keys-3-video-5.mp4': 'resource/mini-app/calendar-demo.mp4',
}

function ensureDir(filePath) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
}

function moveFile(fromRel, toRel) {
    const from = path.join(root, fromRel)
    const to = path.join(root, toRel)
    if (!fs.existsSync(from)) {
        console.warn(`skip missing: ${fromRel}`)
        return
    }
    ensureDir(to)
    fs.renameSync(from, to)
    console.log(`mv ${fromRel} -> ${toRel}`)

    const fromWebp = from.replace(/\.(png|jpe?g)$/i, '.webp')
    const toWebp = to.replace(/\.(png|jpe?g)$/i, '.webp')
    if (fs.existsSync(fromWebp)) {
        ensureDir(toWebp)
        fs.renameSync(fromWebp, toWebp)
        console.log(`mv ${path.relative(root, fromWebp)} -> ${path.relative(root, toWebp)}`)
    }
}

function walk(dir, out = []) {
    if (!fs.existsSync(dir)) return out
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const abs = path.join(dir, entry.name)
        if (entry.isDirectory()) walk(abs, out)
        else if (/\.(html|css|md)$/i.test(entry.name)) out.push(abs)
    }
    return out
}

function replaceInFiles() {
    const files = [
        path.join(root, 'index.html'),
        path.join(root, 'css', 'base.css'),
        ...walk(path.join(root, 'projects')),
        ...walk(path.join(root, 'src')),
    ].filter((f) => fs.existsSync(f))

    const entries = Object.entries(MOVES).sort((a, b) => b[0].length - a[0].length)

    for (const file of files) {
        let content = fs.readFileSync(file, 'utf-8')
        let changed = false
        for (const [oldPath, newPath] of entries) {
            const patterns = [
                oldPath,
                `../${oldPath}`,
                `/${oldPath}`,
            ]
            for (const oldRef of patterns) {
                const newRef = oldRef.startsWith('../')
                    ? `../${newPath}`
                    : oldRef.startsWith('/')
                      ? `/${newPath}`
                      : newPath
                if (content.includes(oldRef)) {
                    content = content.split(oldRef).join(newRef)
                    changed = true
                }
            }
        }
        if (changed) {
            fs.writeFileSync(file, content)
            console.log(`updated ${path.relative(root, file)}`)
        }
    }
}

console.log('=== Moving assets ===\n')
for (const [from, to] of Object.entries(MOVES)) {
    moveFile(from, to)
}

console.log('\n=== Updating references ===\n')
replaceInFiles()

console.log('\nDone.')
