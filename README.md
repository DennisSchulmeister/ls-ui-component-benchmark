Lecture-Slides.js: Component Framework Benchmark
================================================

1. [Description](#description)
1. [Results](#results)
1. [Copyright](#copyright)

Description
-----------

This repository contains a few small projects, benchmarking the creation of a
simple (but not trivial) UI component in different modern component frameworks
for the web. The intention is to understand the design decisions of each
framework and to compare metrics like number of dependencies, bundle size
or complexity of using it.

Results
-------

| **Framework** | **node_modules** | **Files** | **Lines of Code** | **Bundle Size** | **Subjective Complexity** | **Subjective Code Cleanliness** |
|---------------|------------------|-----------|-------------------|-----------------|---------------------------|---------------------------------|
| Angular       | 1029             |           |                   |                 |                           |                                 |
| Lit           | 6                |           |                   |                 |                           |                                 |
| NanoJSX       | 407              |           |                   |                 |                           |                                 |
| React         | 5                |           |                   |                 |                           |                                 |
| Stencil       | 392              |           |                   |                 |                           |                                 |
| Svelte        | 60               |           |                   |                 |                           |                                 |
| Vue.js        | 39               |           |                   |                 |                           |                                 |
| Tonic         | xx               |           |                   |                 |                           |                                 |

To make the results somewhat comparable only the most-basic projects have been
created. When there was a wizard to create the project, no optional features
have been selected. The meaning of the metrics is the following:

* **node_modules:** Number of packages in `node_modules` after the initial
  project setup. Determined with `find node_modules -name "package.json" | wc -l`.

* **Files:** Number of code files needed to create for the simple example component.

* **Lines of Code:** Lines of code needed to be written for the example component
  (including comments and white space, as I am too lazy to filter them out).

* **Bundle Size:** File size of the generated build output that a client needs
  to download when running the app.

* **Subjective Complexity:** My personal rating of the felt complexity while
  implementing the example component.

* **Subjective Code Cleanliness:** My personal rating of how good or bad the
  self-written code looks like and how easy it is to understand and maintain.

Copyright
---------

This work is marked with CC0 1.0.
To view a copy of this license, visit https://creativecommons.org/publicdomain/zero/1.0/
