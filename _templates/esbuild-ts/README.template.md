Template: esbuild for TypeScript and LESS
=========================================

This is a minimal project template for a web frontend project that uses the
esbuild bundler and TypeScript. Copy to another directory and use the following
commands to work on it:

 * `npm start`: Start development server on [localhost:8888](http://localhost:8888)
 * `npm check`: To run TypeScript typechecking only
 * `npm run build`: Build distribution bundles for deployment on a static web server
 * `npm run clean`: Clean results of the previous build

This should be a fairly standard project structure for any frontend project
without many caveats. And thanks to esbuild it is very lightweight, too.

But please consider the [TypeScript Caveats](https://esbuild.github.io/content-types/#typescript)
mentioned in the esbuild documentation.