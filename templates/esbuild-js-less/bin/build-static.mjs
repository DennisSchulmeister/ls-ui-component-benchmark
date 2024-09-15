/**
 * Utility script to copy static assets from the source directory into the build directory.
 * For this the following settings can be made in file `package.json`:
 *
 * ````js
 * {
 *     "config": {
 *       "static_dir": "static",    // Source directory from which to copy files
 *       "build_dir": "build",      // Target directory to which to copy files
 *     },
 * }
 * ```
 */
import fs       from "node:fs";
import path     from "node:path";
import shell    from "shelljs";

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const sourceDir = path.normalize(path.join(__dirname, "..", process.env.npm_package_config_static_dir));
const buildDir  = path.normalize(path.join(__dirname, "..", process.env.npm_package_config_build_dir));

shell.mkdir("-p", buildDir);

for (let file of shell.ls("-R", sourceDir)) {
    if (file.startsWith("_") || file.includes("/_")) continue;

    let sourcePath = path.join(sourceDir, file);
    let sourceStat = fs.statSync(sourcePath);
    let buildPath  = path.join(buildDir, file);

    console.log(file, "=>", buildPath);

    if (sourceStat.isDirectory()) {
        shell.mkdir("-p", buildPath);
    } else {
        shell.cp(sourcePath, buildPath);
    }
}
