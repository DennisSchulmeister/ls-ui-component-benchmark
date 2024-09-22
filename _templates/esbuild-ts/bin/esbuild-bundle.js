import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

import * as esbuild from "esbuild";
import path from "path";

esbuild.build({
    entryPoints: [`src/index.ts`, `src/i18n/lang/**/*.ts`],
    outdir: "static/_bundle/",    

    bundle: true,
    minify: true,
    sourcemap: true,
    format: "esm",

    plugins: [],

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
