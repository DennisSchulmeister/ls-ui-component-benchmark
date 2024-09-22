import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

import * as esbuild from "esbuild";
import path from "path";

import sveltePlugin from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";

esbuild.build({
    entryPoints: [path.join(__dirname, "..", "src", "index.js")],
    bundle: true,
    minify: true,
    outfile: path.join(__dirname, "..", "build", "_bundle.js"),
    sourcemap: true,
    format: "esm",
    mainFields: ["svelte", "browser", "module", "main"],
    conditions: ["svelte", "browser"],
    plugins: [sveltePlugin({
        preprocess: sveltePreprocess(),
    })],
    loader: {
        ".svg": "text",
        ".ttf": "dataurl",
        ".woff": "dataurl",
        ".woff2": "dataurl",
        ".eot": "dataurl",
        ".jpg": "dataurl",
        ".png": "dataurl",
        ".gif": "dataurl",
    },
});