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

* When working in Visual Studio Code, the [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html)
  extension adds nice syntax highlighting to the HTML templates.

* Element properties (`props`) are always serialized to HTML properties as strings.
  So we cannot pass callback functions etc. from a parent component to its children.
  Passing javascript data objects is possible but somewhat expensive due to the
  JSON marshalling.
  
* Components can manage their own state using plain object attributes. It is not
  necessary to use Tonic's `this.state` object which is just a key/value-pair on
  the `Tonic` class using the element's ID, that must be manually cleaned up.

  The only reason to use this would probably be to update the state of an elements
  from outside the element.

* How to handle global state that needs to update many components deep in the DOM tree?
  Extract it into globally accessible `Observable` objects (e.g. accessible via the global
  `ApplicationFrame` instance to make it publicly available and avoid too many imports).
  Then observe the values to trigger rerendering or manual DOM updates as deep in the DOM
  as possible.

  Why as deep in the DOM as possible? To minimize costly DOM access. Rerendering a small
  component that simply wraps a value is usually cheaper (e.g the `<book-title` which
  essentially is just a `<span>`) then rerendering a larger composite component (like the
  `<application-header>` or even the whole `<application-frame>`).

  To support this pattern, a intermediate class called `TonicComponent` has been developed,
  that extends the basic `Tonic` class but adds book-keeping for the observables.

* Routing can be as easy or complex as you want, but generally URL hash based routing using
  the `hashchange` event is a good approach. This allows to host the application on all servers
  without special consideration and is quite easy to handle client-side.

  Unlike frameworks like React, that use a virtual DOM, building a router component, that
  based on the URL simply decides whether to render its children or not, can be done for
  special use cases. But for an app-wide routing this is most-likely not ideal, as the
  router component will remain in the DOM between the parent and the actual content.
  This must be considered in the stylesheets.

  For this reason we use a different, probably less clean, approach here. The router class
  simple executes callback methods from the `ApplicationFrame` component that trigger
  conditional rerendering.