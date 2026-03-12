import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function webpBuildPlugin() {
    const imageExtRegex = /\.(png|jpg|jpeg)$/i

    function toWebpPath(filePath) {
        return filePath.replace(imageExtRegex, '.webp')
    }

    async function ensureWebpForFile(absPath) {
        if (!imageExtRegex.test(absPath)) return
        const webpPath = toWebpPath(absPath)
        if (fs.existsSync(webpPath)) return
        await sharp(absPath).webp({ quality: 82 }).toFile(webpPath)
    }

    function walkDir(dir, files = []) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const abs = path.join(dir, entry.name)
            if (entry.isDirectory()) walkDir(abs, files)
            else files.push(abs)
        }
        return files
    }

    function replaceImgUrlsToWebp(html) {
        // Replace only when the corresponding .webp exists.
        // Supports absolute (/img/...) and relative (../img/...) paths.
        return html.replace(/(["'])([^"']+\.(?:png|jpg|jpeg))\1/gi, (m, quote, url) => {
            const normalized = url.split('?')[0].split('#')[0]
            const abs = normalized.startsWith('/')
                ? path.resolve(__dirname, `.${normalized}`)
                : path.resolve(__dirname, normalized)
            const webpAbs = toWebpPath(abs)
            if (!fs.existsSync(webpAbs)) return m
            const webpUrl = url.replace(imageExtRegex, '.webp')
            return `${quote}${webpUrl}${quote}`
        })
    }

    return {
        name: 'webp-build',
        apply: 'build',
        async buildStart() {
            const imgDir = path.resolve(__dirname, 'img')
            if (!fs.existsSync(imgDir)) return
            const allFiles = walkDir(imgDir)
            for (const absPath of allFiles) {
                // eslint-disable-next-line no-await-in-loop
                await ensureWebpForFile(absPath)
            }
        },
        transformIndexHtml: {
            order: 'pre',
            handler(html) {
                return replaceImgUrlsToWebp(html)
            },
        },
    }
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
            if (isPartial || isHtml || isCss) {
                server.ws.send({ type: 'full-reload' })
                return []
            }
        },
    }
}

export default {
    plugins: [webpBuildPlugin(), htmlIncludePlugin()],
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                crm: path.resolve(__dirname, 'projects/project-crm.html'),
                ecomm: path.resolve(__dirname, 'projects/project-e-comm.html'),
                miniapp: path.resolve(__dirname, 'projects/project-mini-app.html'),
            },
        },
    },
}
