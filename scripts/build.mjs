import { cp, mkdir, rm } from "node:fs/promises"
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
console.log(`Built static site to ${destination}`)
