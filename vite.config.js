import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function getRollupInputs() {
    const inputs = {
        main: path.resolve(__dirname, 'index.html'),
    }
    const projectsDir = path.resolve(__dirname, 'projects')
    if (!fs.existsSync(projectsDir)) return inputs

    for (const file of fs.readdirSync(projectsDir)) {
        if (!file.endsWith('.html') || !file.startsWith('project-')) continue
        const key = file.replace(/^project-/, '').replace(/\.html$/, '').replace(/-/g, '')
        inputs[key] = path.join(projectsDir, file)
    }
    return inputs
}

function htmlIncludePlugin() {
    const includeRegex = /<include\s+src=["']([^"']+)["']\s*\/?>/g

    function resolveIncludes(html) {
        return html.replace(includeRegex, (match, src) => {
            const filePath = path.resolve(__dirname, src)
            if (!fs.existsSync(filePath)) {
                console.warn(`[html-include] File not found: ${filePath}`)
                return ''
            }
            const content = fs.readFileSync(filePath, 'utf-8')
            return resolveIncludes(content)
        })
    }

    return {
        name: 'html-include',
        transformIndexHtml: {
            order: 'pre',
            handler(html) {
                return resolveIncludes(html)
            },
        },
        handleHotUpdate({ file, server }) {
            const isPartial = file.includes(`${path.sep}src${path.sep}partials${path.sep}`)
            const isHtml = file.endsWith('.html')
            const isCss = file.endsWith('.css')
            const isJs = file.endsWith('.js') && file.includes(`${path.sep}js${path.sep}`)
            if (isPartial || isHtml || isCss || isJs) {
                server.ws.send({ type: 'full-reload' })
                return []
            }
        },
    }
}

export default {
    base: '/',
    plugins: [htmlIncludePlugin()],
    build: {
        rollupOptions: {
            input: getRollupInputs(),
        },
    },
}
