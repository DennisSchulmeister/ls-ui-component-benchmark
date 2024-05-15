UI Component Benchmark: Tonic
=============================

This is a minimal project based on the esbuild + TypeScrip template in the same
repository. It uses the @socketsupply/tonic Tonic Framework, whihc is a very
lightweight web component wrapper.

Steps how this project was set up:

1. Copy the esbuild + TypeScript template
2. Run `npm add -D @socketsupply/tonic`

Thoughts and Learnings
----------------------

* Element properties (`props`) are always serialized to HTML properties as strings.
  So we cannot pass callback functions etc. from a parent component to its children.

* Components can manage their own state using plain object attributes. It is not
  necessary to use Tonic's `this.state` object which is just a key/value-pair on
  the `Tonic` class using the element's ID, that must be manually cleaned up.

  The only reason to use this would probably be to update the state of an elements
  from outside the element.

* How to handle global state that needs to update many components deep in the DOM tree?
  A possible strategy could be:

    * Global state is held by the MyApplication component and possibly the page components,
      which can be globaly accessed from other files.

    * Atoms are strictly for rendering. They may have internal state but otherwise use
      HTML properties to receive the values to render.
    
    * Molecules observe the state of `MyApplication` or the current `Page` via the observer
      pattern (implemented here via the `ObservableValue` class borrowed from `@dschulmeis/ls-utils`)
      and trigger rerenderings of their contained atoms as necessary.
