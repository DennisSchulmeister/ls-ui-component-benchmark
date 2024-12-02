UI Component Benchmark: Svelte
==============================

1. [Project Setup](#project-setup)
1. [Summary](#summary)
    1. [Basic Component Definition](#basic-component-definition)
    1. [Logic Blocks](#logic-blocks)
    1. [Reactive Rendering](#reactive-rendering)
    1. [Property Declaration](#property-declaration)
    1. [Nested Components](#nested-components)
    1. [DOM Event Handling](#dom-event-handling)
    1. [Routing](#routing)
    1. [Translations](#translations)
1. [Thoughts and Learnings](#thoughts-and-learnings)
1. [Conclusion](#conclusion)

This is a minimal project based on the Svelte framework, using our esbuild template
and `esbuild-svelte` instead of `SvelteKit`.

Project Setup
-------------

Steps how this project was set up:

1. Copy the esbuild + TypeScript template

2. Run `npm add -D svelte sv svelte-check esbuild-svelte @tsconfig/svelte`

3. Modify scripts in `bin/` according to the README of esbuild-svelte

   ```js
   import sveltePlugin from "esbuild-svelte";


   ...
   format: "esm",
   mainFields: ["svelte", "browser", "module", "main"],
   conditions: ["svelte", "browser"],
   plugins: [sveltePlugin()],
   ```

   ```html
   <script type="module" src="_bundle.js"></script>
   ```

4. Add `svelte-check` to `npm run check` in `package.json`:

   ```json
   "check": "tsc && svelte-check --tsconfig tsconfig.json --fail-on-warnings",
   ```

5. Extend `tsconfig.json`:

  ```json
    {
        "extends": "@tsconfig/svelte/tsconfig.json",
        ...
        "compilerOptions": {
            ...
            // Specify type package names to be included without being referenced in a source file
            "types": [
                "svelte"
            ]
        },
    }
  ```

Without `SvelteKit` we need a SPA router (or roll our own, which is easy, actually).
Let`s integrate `svelte-spa-router` for this, which is a hash-based router.

1. Run `npm add -D svelte-spa-router`
2. Define some routes in `src/components/routes.ts`
3. Instantiate router in `src/components/ApplicationFrame.svelte`

See [https://github.com/ItalyPaleAle/svelte-spa-router] for full documentation.

Summary
-------

### Basic Component Definition

Components are defined in `.svelte` files that mix HTML, CSS and JavaScript/TypeScript.
Lowercase tags like `<div>` are regular HTML tags. Capitalized tags like `<Widget>`
are components. The filename doesn't define the component name, as the name of a component
can be chosen when it is imported (see [Nested Components](#nested-components)).

```svelte
<!-- Initialization -->
<script>
    let {count = 0} = $props();

    function increaseCountBy(n: number) {
        count += n;
    }
</script>

<!-- HTML template -->
Count: {count}
<button onclick={() => increaseCountBy(2)}>+2</button>

<!-- Scoped style -->
<style>
    button {
        background: white;
        color: crimson;
    }
</style>
```

Here is a quick cheat cheat based on https://svelte.dev/docs/svelte/overview.

```svelte
<script module lang="ts">
    // Module level code running once, when the module first evaluates.
    // Here you can export functions and variables, but variables won't be reactive
    // and you cannot use the default export (that is the component itself).
    let totalComponents = 0;

    export function getTotal() {
        return totalComponents;
    }
</script>

<script lang="ts">
    // Component level code running each time, when a new component instance is created.
    // Think of this as the constructor of the component.
    totalComponents += 1;

    // Variables using the $state() rune are reactive (trigger rerendering)
    let count    = $state(0);
    let allNames = $state([]);

    // $props() is used to read properties set by the consumers of the component.
    // Typing is optional but recommended for anything but simple properties.
    // In this example we would get away without the explicit typing. :-)
    interface Props {
        name?:  string,
        title?: string,
    }

    let {
        name  = "Default name",
        title = "Kitchen sink component",
    } = $props();

    // Functions can also be exported
    export function greet(name1: string) {
        alert(`Hello, ${name1}`);

        // Assignment triggers rerendering
        name = name1;

        // Arrays and objects support "deep reactivity". This will rerender.
        allNames.push(name);
    }

    // Derived reactive values (will be recalculated when the referenced value changes)
    let title1 = $derived(title.toUpperCase());


    // Side-effects (run last on construction and then when the references values change)
    $effect(() => {
        document.title = title; 
    });

    $effect(() => {
        console.log("The title has changed.");
        console.log(`The new title is ${title}`);
    });
</script>

<!--
@component
Here's some documentation for this component. It will show up on hover.
Use markdown to format the comment.
-->
Hello, {name}!

<style>
    /* CSS Code, automatically prefixed for this component */
    p {
        /* All <p> belonging to this component */
    }

    :global(h1) {
        /* All <h1> in the DOM */
    }

    div :global(strong) {
        /* All <strong> somewhere inside this component, even when they are part of a nested component */
    }

    p:global(.red) {
        /* All <p class="red"> of this component, even then class is set dynamically */
    }

    @keyframes my-animation {
        /* Keyframe animation "my-animation" accessible in this component only */
    }

    @keyframes -global-my-animation1 {
        /* Keyframe animation "my-animation1" accessible anywhere in the DOM */
    }
</style>
```

### Logic Blocks

HTML templates can use `{#if}`, `{#each}` etc. for conditional logic:

```svelte
{#if expression}...{:else if expression}...{/if}

{#each expression as name}...{:else}...{/each}
{#each expression as name, index}...{/each}
{#each expression as name (key)}...{/each}
{#each expression as name, index (key)}...{/each}

{#await expression}...{:then name}...{:catch name}...{/await}

{#key expression}...{/key}
```

Conditionals:

```svelte
{#if answer === 42}
	<p>what was the question?</p>
{/if}

{#if porridge.temperature > 100}
	<p>too hot!</p>
{:else if 80 > porridge.temperature}
	<p>too cold!</p>
{:else}
	<p>just right!</p>
{/if}
```

Awaiting promises:

```svelte
{#await promise}
	<!-- promise is pending -->
	<p>waiting for the promise to resolve...</p>
{:then value}
	<!-- promise was fulfilled or not a Promise -->
	<p>The value is {value}</p>
{:catch error}
	<!-- promise was rejected -->
	<p>Something went wrong: {error.message}</p>
{/await}
```

If you don't care about the pending state, you can also omit the initial block.
Similarly, if you only want to show the error state, you can omit the then block.

```svelte
{#await promise then value}
	<p>The value is {value}</p>
{/await}

{#await promise catch error}
	<p>The error is {error}</p>
{/await}
```

Key blocks destroy and recreate their contents when the value of an expression changes.
This is useful if you want an element to play its transition whenever a value changes.
When used around components, this will cause them to be re-instantiated and re-initialized.

```svelte
{#key value}
	<div transition:fade>{value}</div>
{/key}

{#key value}
	<Component />
{/key}
```

### Reactive Rendering

Reactive variables are declared with the `$state` rune. Properties with `$props`.
They are basically simple values with a transparent proxy object that triggers
re-rendering whenever they change. This also includes "deep reactivity" for arrays
and plain objects, meaning that they also trigger re-rendering when their elements
change. However, for maps and sets the special implementations from Svelte must be used.

```svelte
<script lang="ts">
    let count  = $state(0);
    let values = $state([]);

    function appendValue() {
        count++;

        values.push(count);
    }

    Count: {count}
    Values: {#each values as value} value {/each}
</script>
```

`$derived` can be used to declare calculated values that depend upon other reactive
values. `$effect` can be used to cause side-effects when a reactive value changes.
But be careful. Here be dragons! Side effects do not immediately run when they are
declared.

```svelte
<script lang="ts">
    // Side-effects (run last on construction and then when the references values change)
    $effect(() => {
        document.title = title;
        console.log("The title has changed.");
        console.log(`The new title is ${title}`);
    });

    // This will be executed first!
    let title  = $state("Dummy title");
    let title2 = $derived(title.toUpperCase());
</script>

The title is: {title}
```

### Property Declaration

Properties are declared with `$props` using object decomposition.
Typing is optional but needed if it cannot be deduced from the default value.

```svelte
<script lang="ts">
    interface Props {
        count?: number;
    }

    let {count = 0}: Props = $props();
</script>

<button onclick={count++}>{count}</button>
```

Example consumer:

```svelte
<script lang="ts">
    import CountingButton from "./CountingButton.svelte";
</script>

<CountingButton count={5} />
```

### Nested Components

Components can import other components and use them like regular HTML elements:

```svelte
<script lang="ts">
    import ChildComponent from "./ChildComponent.svelte";
</script>

<div>
    <ChildComponent />
</div>
```

Lowercased elements are HTML elements, capitalized names like `<Something>` are components.
Properties set on a child component may _contain_ JavaScript or _be_ JavaScript:

```svelte
<script lang="ts">
    let n = $state(1);
    function onClick() { ... }
</script>

<ChildComponent page="Page {n}" onclick={onClick}>
```

JavaScript may be quoted to fix syntax-highlighting in some cases:

```svelte
<ChildComponent "onclick={onClick}">
```

Curly braces can be output e.g. with `&lbrace;` and `&rbrace;`.

The usual "data down, events up" from React et all is not quite true for Svelte.
While still being recommended to pass data mostly down only, a child component
can use `$bindable` to declare properties that a parent can bind to, to have data
flow upwards.

```svelte
<script lang="ts">
    let {prop1, prop2 = $bindable(815), ...props} = $props();
</script>
```

```svelte
<ChildComponent prop1={42} bind:prop2={myVar} {prop3} {...moreProps}>
```

* Here the value 42 is passed down to `prop1`.

* The variable `myVar` is bound to `prop2`. Whenever `prop2` of the child component changes,
  `myVar` changes, too.

* The property `prop3` is set from the same-named local property or variable.

* The spread operator is used to pass additional properties from a fictional `moreProps` object.

Data flowing up is especially useful for form elements:

```svelte
<input bind:value />
<textarea bind:value={text} />
<input type="checkbox" bind:checked={yes} />
```

Ordering is important:

```svelte
<input
	oninput={() => console.log('Old value:', value)}
	bind:value
	oninput={() => console.log('New value:', value)}
/>
```

Functions are valid property values. The child component can therefor define a property
that has a function as default value and receive a callback function from its parent.

```svelte
<script lang="ts">
    let {format = (n) => n.toFixed(2)} = $props();
</script>
```

With `bind:this` a reference to the component can be get:

```svelte
<script lang="ts">
    let childComponent;
</script>

<ChildComponent bind:this={childComponent}>
```

This can be useful to call functions exported by the child component:

```svelte
<!-- button.svelte -->
<script>
	let count = $state(0);
	
	export function reset() {
		count = 0;	
	}
</script>

<button onclick={() => count++}>{count}</button>
```

```svelte
<!-- Parent component -->
 <script>
	import Button from "./button.svelte";
	let button;
</script>

<Button bind:this={button}></Button>
<button onclick={() => button.reset()}>Reset Counter</button>
```

The same holds true for constants, thought it might make more sense to export them
from the module instead of the component.

```svelte
<script context="module" lang="ts">
    export const BUTTON_TYPES = ["primary", "secondary", "danger"];
    // import MyButton, { BUTTON_TYPES} from "./Button.svelte";
</script>
```

Passing child components:

```svelte
<!-- Widget.svelte -->
<div>
    {#if children}
        {@render children()}
    {:else}
        <p>
            This fallback content will be rendered when no content is provided, like in the first example
        </p>
    {/if}
</div>

<!-- App.svelte -->
<Widget />
<!-- this component will render the default content -->

<Widget>
	<p>This is some child content that will overwrite the default slot content</p>
</Widget>
```

Named snippets:

```svelte
<!-- Widget.svelte -->
<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        header: Snippet;
        footer: Snippet;
    };

    let {header, footer}: Props = $props();
</script>

<div>
	{@render header?.()}
	<p>Some content between header and footer</p>
	{@render footer?.()}
</div>

<!-- App.svelte -->
<Widget>
    {#snippet header()}
	    <h1>Hello</h1>
    {/snippet}

    {#snippet footer()}
	    <p>Copyright (c) 2019 Svelte Industries</p>
    {/snippet}
</Widget>
```

### DOM Event Handling

JavaScript functions can be bound to events with the `onevent` syntax.

```svelte
<button onclick={onButtonClick}>Click here</button>
<button onclick={() => count++}>+1</button>
```

Since Svelte 5 event listeners are ordinary properties with callback functions.
It's possible to have multiple event listeners for the same event.

### Custom Events

Prior to Svelte 5, components could raise events that the parents listen for.
Nowadays the recommendation is simply to pass callback functions down.

### Routing

This would typically be handled by SvelteKit in a full-stack application, crossing the
boundary between client and server with:

* Filesystem based routes
* Server-side rendering of the initial request
* Client-side rendering of the follow-up requests
* Server-side data loading
* Server-side API endpoints
* ...

By default SvelteKit is a server-side framework going hand in hand with Svelte in the
frontend, adding server side rendering, hydration and many more. But it can also be
used to export pre-rendered static pages and create Single Page Apps. But the SPAs don't
use hash routing, meaning they need special server configuration. Let's use a simpler
approach then. This mock application uses
[svelte-spa-router](https://github.com/ItalyPaleAle/svelte-spa-router), which is a
very complete hash-based router. This allows to deploy the final application on any static
webserver without special configuration.

Defining routes is very simple. The gist of it is do add a route in `src/components/routes.ts`
and instantiate the `<Router>` in the main app frame:

```ts
export default {
    "/": wrap({
        component: BookContentPage,
        conditions: [setPageNumber],
    }),
  
    "*": NotFoundPage,
};
```

```svelte
<script lang="ts">
    import Router from 'svelte-spa-router'
    import routes from "./routes.js";
</script>

<Router {routes} />
```

That's basically it.

### Translations

Similar to Tonic, Svelte does not cover this. So we are rolling the same solution as with
Tonic to define a "store" file that dynamically loads and manages the translation texts.
Unlike Tonic however, changing the current language does **not** rerender the whole world.
Instead, Svelte is smart enough to just update the texts in the DOM.

```svelte
<script lang="ts">
    import {i18n, _}  from "../../../stores/i18n.js";
    import {location} from 'svelte-spa-router'
</script>

<div>
    <h1>{$i18n.Error404.Title}</h1>
    <p>
        {@html _($i18n.Error404.Message1, {url: $location})}
    </p>
    ...
</div>
```

Thoughts and Learnings
----------------------

* For VS Code the **Svelte for VS Code** extension from the Svelte team should be
  installed. Otherwise there will be no syntax-highlighting for `*.svelte` files.

* `npm create svelte@latest` enables SvelteKit. Be careful. :-)

* There is no need in Svelte to push rerendering to "leaf" components. In Tonic this
  was required to minimize the rendering costs, because rerendering a component simply
  destroy and recreates it.
  
  Svelte in contrast mutates the DOM, in which case it is better to have "dead simple"
  leaf nodes that simple render out their property values. The more complex composite
  elements can instead subscribe to a global store and pass the value to the inner
  components. This keeps the inner components atomic and fully self-contained.

* Rerendering mutates the DOM without deleting the elements, so CSS transitions work
  out of the box. e.g. for the progress bar where the CSS width property is bound
  to the current page.

* DOM debugging is a bit harder in Svelte because the Svelte components cannot be seen
  in the browser`s DOM inspector. Only their rendered output is visible.

* Svelte components can be wrapped in web components. This could be in interesting
  option to provide custom elements to study book authors. There are some caveats
  though, that need to be investigated then.

Conclusion
----------

Even though its documentation is refreshingly compact, the learning curve for Svelte is
a bit steep. Coming from either traditional DOM programming (including web components)
or other frameworks, getting used to some concepts in Svelte takes some time. There are
good examples and an interactive tutorial on the website though, which make it easy to
get started. Porting the Tonic application to Svelte took me under 3 days, without
knowing Svelte at all before.

In direct comparison with Tonic, Svelte has 100 times more code: 45k instead of 450.
But the bundle size is okay for both: 14 kB for Tonic vs. 50 kB for Svelte (considering
only the `_bundle/index.js` file). Svelte is more complete in the following sense:

* TypeScript typings out of the box
* Smarter event handling with automatic deregistration
* Store implementation tightly integrated with the HTML template syntax
* Several SPA routers available: SvelteKit, svelte-spa-router, ...

Therefor no additional code must be maintained in the application. Though, to be fair,
the amount would be manageable. It is only around 300 lines of code in the `utils` directory
of the Tonic version.

Writing components with Svelte requires much less ceremony. The Svelte compiler automates
many things that need to be hand-written in Tonic. They are small things, but they add up
in larger components. And, more importantly, the Svelte HTML template syntax is much easier
to read than all the JSX variants. The logic of conditional rendering is much easier to grasp.

All in all Svelte seems like a reasonable alternative to Tonic, when the improved "developer
experience" (comfort) outweighs the additional complexity that it brings.