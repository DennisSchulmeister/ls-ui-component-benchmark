import * as esbuild from "esbuild";

import sveltePlugin from "esbuild-svelte";
import { sveltePreprocess } from "svelte-preprocess";

esbuild.build({
    entryPoints: [`src/index.ts`],
    outdir: "static/_bundle/",    

    bundle: true,
    splitting: true,
    minify: true,
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
