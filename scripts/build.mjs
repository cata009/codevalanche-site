import { cp, mkdir, rm, readFile, writeFile } from "node:fs/promises"
import { createHash } from "node:crypto"
import path from "node:path"
import { build } from "esbuild"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const source = path.join(root, "src")
const destination = path.join(root, "dist")

await rm(destination, { recursive: true, force: true })
await mkdir(destination, { recursive: true })
await cp(source, destination, { recursive: true, errorOnExist: false })

await build({ entryPoints: [path.join(source, "account/app.js")], outfile: path.join(destination, "account/app.js"), bundle: true, format: "esm", minify: true, target: ["es2022"], legalComments: "eof" })
// Version the completed bundle, styles and public configuration so a new page
// cannot reuse an older cached account implementation after deployment.
const assets = ["/account/app.js", "/account/account.css", "/config.js"]
const versions = await Promise.all(assets.map(async (asset) => {
  const content = await readFile(path.join(destination, asset))
  return [asset, createHash("sha256").update(content).digest("hex").slice(0, 16)]
}))
for (const page of ["account/index.html", "account/authorize/index.html"]) {
  const output = path.join(destination, page)
  let html = await readFile(output, "utf8")
  for (const [asset, version] of versions) html = html.replaceAll(`"${asset}"`, `"${asset}?v=${version}"`)
  await writeFile(output, html)
}
console.log(`Built static site to ${destination}`)
