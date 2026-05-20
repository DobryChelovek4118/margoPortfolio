import fs from 'fs'

const LEGACY_PATTERNS = [
    { name: 'relative img', re: /(?:src|poster|href)=["']\.\.\/img\// },
    { name: 'relative resource', re: /(?:src|poster|href)=["']\.\.\/resource\// },
    { name: 'unrooted img', re: /(?:src|poster)=["']img\// },
    { name: 'css relative img', re: /url\(["']?\.\.\/img\// },
    { name: 'raster in img path', re: /\/img\/[^"')]+\.(?:png|jpe?g)(?:["'?)])/i },
]

export function findLegacyPathViolations(files) {
    const violations = []
    for (const file of files) {
        const content = fs.readFileSync(file, 'utf8')
        const lines = content.split('\n')
        for (const { name, re } of LEGACY_PATTERNS) {
            lines.forEach((line, i) => {
                if (re.test(line)) {
                    violations.push({ file, line: i + 1, rule: name, snippet: line.trim() })
                }
            })
        }
    }
    return violations
}
