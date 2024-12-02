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

2. Run `npm add -D svelte svelte-check svelte-preprocess esbuild-svelte @tsconfig/svelte`

3. Modify scripts in `bin/` according to the README of esbuild-svelte

   ```js
   import sveltePlugin from "esbuild-svelte";
   import sveltePreprocess from "svelte-preprocess";

   ...
   format: "esm",
   mainFields: ["svelte", "browser", "module", "main"],
   conditions: ["svelte", "browser"],
   plugins: [sveltePlugin({
        preprocess: sveltePreprocess(),
   })],
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
    export let count = 0;

    function increaseCountBy(n: number) {
        count += n;
    }
</script>

<!-- HTML template -->
Count: {count}
<button on:click={() => increaseCountBy(2)}>+2</button>

<!-- Scoped style -->
<style>
    button {
        background: white;
        color: crimson;
    }
</style>
```

Here is a quick cheat cheat based on https://svelte.dev/docs/svelte-components.
More details can be found in the other sections.

```svelte
<script context="module" lang="ts">
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

    // Variables are automatically reactive (trigger rerendering)
    let count = 0;
    let allNames = [];

    // export defines properties that are accessible to consumers of the component
    export let name  = "Default name";
    export let title = "Kitchen sink component";

    // Functions can also be exported
    export function greet(name1: string) {
        alert(`Hello, ${name1}`);

        // Assignment triggers rerendering
        name = name1;

        allNames.push(name);
        allNames = allNames;    // Needed to trigger rerendering
    }

    // Read-only properties
    export const youCannotChangeThis = "Consumers cannot change this";

    // Reactive blocks (run last on construction and then when the references values change)
    $: document.title = title;

    $: {
        console.log("The title has changed.");
        console.log(`The new title is ${title}`);
    }
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

Variables and properties are reactive by default. Value assignment triggers rerendering.
Be careful with arrays and objects. When the array content or object properties change,
the variable must be reassigned to trigger rerendering.

```svelte
<script lang="ts">
    let count = 0;
    let values = [];

    function appendValue() {
        count++;

        values.push(count);
        values = values;
    }

    Count: {count}
    Values: {#each values as value} value {/each}
</script>
```

`$:` can be used to mark reactive statements and reactive code blocks. They will be
re-executed when one of the references variables change. But be careful. Here be dragons!

 * Reactive statements / code blocks are executed after all other statements, no
   matter where they appear inside a `<script>`

 * Static code analysis is used to find the variables, but only variables directly used
   in the analyzed statement or code block are considered. Variables used in the function
   body of a function called in the reactive statement/block are not found.

```svelte
<script lang="ts">
    // Reactive blocks (run last on construction and then when the references values change)
    $: document.title = title;

    $: {
        console.log("The title has changed.");
        console.log(`The new title is ${title}`);
    }

    // This will be executed first!
    let title = "Dummy title";
</script>

The title is: {title}
```

### Property Declaration

Normal variables are only accessible within a component:

```svelte
<script lang="ts">
    let count = 0;
</script>


<button on:click={count++}>{count}</button>
```

Exported variables are exposed as properties, that can be accessed by consumers
of a component:

```svelte
<script lang="ts">
    export let count = 0;
</script>


<button on:click={count++}>{count}</button>
```

Example consumer:

```svelte
<script lang="ts">
    import CountingButton from "./CountingButton.svelte";
</script>

<CountingButton count={5} />
```

Exported constants are read-only for the consumers and functions can also be exported.

```svelte
<script lang="ts">
    // export defines properties that are accessible to consumers of the component
    export let name  = "Default name";
    export let title = "Kitchen sink component";

    // Functions can also be exported
    export function greet(name1: string) {
        alert(`Hello, ${name1}`);

        // Assignment triggers rerendering
        name = name1;

        allNames.push(name);
        allNames = allNames;    // Needed to trigger rerendering
    }

    // Read-only properties
    export const youCannotChangeThis = "Consumers cannot change this";
</script>
```

ChatGPT explains the use cases like this: In Svelte, you can export variables, constants, and
functions from a component to expose them to the parent or other consumers of the component.
Here are the use cases for each:

- **Variables (`let`)**: Used for reactive data that can be passed as props, enabling two-way data binding.

- **Constants (`const`)**: Used to expose static, non-reactive data such as configurations, enums, or constants.

- **Functions**: Used to expose specific functionality or methods that can be triggered by the parent component,
  allowing direct control over the child component's behavior.

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
    let n = 1;
    function onClick() { ... }
</script>

<ChildComponent page="Page {n}" on:click={onClick}>
```

JavaScript may be quoted to fix syntax-highlighting in some cases:

```svelte
<ChildComponent "on:click={onClick}">
```

Curly braces can be output e.g. with `&lbrace;` and `&rbrace;`.

The usual "data down, events up" from React et all is not quite true for Svelte.
While still being recommended to pass data mostly down only, a parent component
can bind local variables/properties to child properties to have data flow up.

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
	on:input={() => console.log('Old value:', value)}
	bind:value
	on:input={() => console.log('New value:', value)}
/>
```

Functions are valid property values. The child component can therefor define a property
that has a function as default value and receive a callback function from its parent.

```svelte
<script lang="ts">
    export let format = (n) => n.toFixed(2);
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
	let count = 0;
	
	export function reset() {
		count = 0;	
	}
</script>

<button on:click={() => count++}>{count}</button>
```

```svelte
<!-- Parent component -->
 <script>
	import Button from "./button.svelte";
	let button;
</script>

<Button bind:this={button}></Button>
<button on:click={() => button.reset()}>Reset Counter</button>
```

The same holds true for constants, thought it might make more sense to export them
from the module instead of the component.

```svelte
<script context="module" lang="ts">
    export const BUTTON_TYPES = ["primary", "secondary", "danger"];
    // import MyButton, { BUTTON_TYPES} from "./Button.svelte";
</script>
```

Unnamed Slot:

```svelte
<!-- Widget.svelte -->
<div>
	<slot>
		this fallback content will be rendered when no content is provided, like in the first example
	</slot>
</div>

<!-- App.svelte -->
<Widget />
<!-- this component will render the default content -->

<Widget>
	<p>this is some child content that will overwrite the default slot content</p>
</Widget>
```

Named slots:

```svelte
<!-- Widget.svelte -->
<div>
	<slot name="header">No header was provided</slot>
	<p>Some content between header and footer</p>
	<slot name="footer" />
</div>

<!-- App.svelte -->
<Widget>
	<h1 slot="header">Hello</h1>
	<p slot="footer">Copyright (c) 2019 Svelte Industries</p>
</Widget>

<Widget>
	<h1 slot="header">Hello</h1>

    <!-- Filling the slot without an intermediate DOM element -->
	<svelte:fragment slot="footer">
		<p>All rights reserved.</p>
		<p>Copyright (c) 2019 Svelte Industries</p>
	</svelte:fragment>
</Widget>
```

### DOM Event Handling

JavaScript functions can be bound to events with the `on:event|modifier` syntax.

```svelte
<button on:click={onButtonClick}>Click here</button>
<button on:click={() => count++}>+1</button>
```

Modifiers are:

* `preventDefault`
* `stopPropagation`
* `stopImmediatePropagation`
* `passive`
* `once`
* ...

Modifiers can be chained together, e.g. `on:click|once|capture={...}`.

If the `on:` directive is used without a value, the component will forward the event.

```svelte
<button on:click> The component itself will emit the click event </button>
```

It's possible to have multiple event listeners for the same event.

### Custom Events

Components can raise events that parents can listen for.

```svelte
<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function sendMessage() {
        dispatch('message', { text: 'Hello from Child!' });
    }
</script>

<button on:click={sendMessage}>Send Message</button>
```

Events can be typed with `createEventDispatcher`:

```svelte
<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		event: null; // does not accept a payload
		click: string; // has a required string payload
		type: string | null; // has an optional string payload
	}>();

	function handleClick() {
		dispatch('event');
		dispatch('click', 'hello');
	}

	function handleType() {
		dispatch('event');
		dispatch('type', Math.random() > 0.5 ? 'world' : null);
	}
</script>

<button on:click={handleClick} on:keydown={handleType}>Click</button>
```

Full answer from ChatGPT: Yes, a Svelte component can raise (or dispatch) custom events
that a parent component can listen to using the built-in `dispatch` function from `svelte`.
This mechanism allows child components to communicate with their parent components in a
structured way, similar to how native DOM events work. The parent can then bind a listener
to these custom events.

#### How to Raise (Dispatch) an Event in Svelte

1. **Use `createEventDispatcher` in the child component** to dispatch custom events.
2. **Listen for the event in the parent component** using `on:eventName`.

##### Example of Raising a Custom Event in a Child Component:

**Child Component (`Child.svelte`)**:
```svelte
<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function sendMessage() {
        dispatch('message', { text: 'Hello from Child!' });
    }
</script>

<button on:click={sendMessage}>Send Message</button>
```

**Parent Component (`Parent.svelte`)**:

```svelte
<script>
    function handleMessage(event) {
        console.log(event.detail.text); // "Hello from Child!"
    }
</script>

<Child on:message={handleMessage} />
```

#### Use Cases for Raising Events

Raising events is useful when a **child component** needs to **communicate back to the parent**
without relying on direct prop binding or state changes. Here are the common use cases:

##### 1. **Handling User Actions (Click, Input, Submit, etc.)**

   - **Use case**: A child component (e.g., a button, form, or input field) triggers some
     action based on user interaction, and the parent component needs to handle it.

   - **Example**: A custom button component dispatches an event when clicked, so the parent
     can perform the appropriate action (e.g., submitting data, opening a modal).

```svelte
<!-- Child.svelte -->
<button on:click={() => dispatch('clicked')}>Click me</button>

<!-- Parent.svelte -->
<Child on:clicked={handleClick} />
```

##### 2. **Component Lifecycle Events**

   - **Use case**: A child component might need to notify its parent when certain lifecycle
     events occur, such as when it's initialized, destroyed, or some background process completes.

   - **Example**: A data-fetching component dispatches an event when it has finished fetching data,
     allowing the parent to update the UI accordingly.

```svelte
<!-- Child.svelte -->
<script>
    import { onMount } from 'svelte';
    const dispatch = createEventDispatcher();

    onMount(() => {
        dispatch('loaded', { data: 'some data' });
    });
</script>

<!-- Parent.svelte -->
<Child on:loaded={handleDataLoaded} />
```

##### 3. **Form or Input Validation**

   - **Use case**: A child form or input component can raise an event to indicate its validity
     or to send back the form's data to the parent.

   - **Example**: A custom form component can dispatch a `submit` event when the form is submitted,
     sending the form data back to the parent for further processing.

```svelte
<!-- Child.svelte -->
<form on:submit|preventDefault={() => dispatch('submit', { data: formData })}>
    <input bind:value={formData.name} />
    <button type="submit">Submit</button>
</form>

<!-- Parent.svelte -->
<Child on:submit={handleFormSubmit} />
```

##### 4. **Modal or Dropdown Close Events**

   - **Use case**: A modal or dropdown component may need to notify the parent when it has been
     closed or an item has been selected.

   - **Example**: A dropdown component dispatches an event when an item is selected, allowing the
     parent to handle the selection.

```svelte
<!-- Child.svelte -->
<script>
    function selectItem(item) {
        dispatch('select', { item });
    }
</script>

<!-- Parent.svelte -->
<Child on:select={handleSelection} />
```

##### 5. **Component-Specific State Updates**

   - **Use case**: Sometimes, a child component manages its own internal state but needs to notify
     the parent when that state changes (e.g., toggling a checkbox or switching tabs).

   - **Example**: A toggle component can dispatch an event whenever its state changes, and the parent
     can react accordingly.

   ```svelte
   <!-- Child.svelte -->
   <script>
       let checked = false;
       function toggle() {
           checked = !checked;
           dispatch('change', { checked });
       }
   </script>

   <button on:click={toggle}>{checked ? 'On' : 'Off'}</button>

   <!-- Parent.svelte -->
   <Child on:change={handleToggleChange} />
   ```

##### 6. **Delegating Complex Logic**

   - **Use case**: A child component might handle complex logic internally but dispatch events to
     delegate part of the logic to the parent. This keeps components decoupled while allowing the
     parent to respond to specific actions.

   - **Example**: A video player component dispatches events such as `play`, `pause`, or `end`, and
     the parent component can log these events or take other actions.

```svelte
<!-- Child.svelte -->
<video on:play={() => dispatch('play')} on:pause={() => dispatch('pause')}></video>

<!-- Parent.svelte -->
<Child on:play={handlePlay} on:pause={handlePause} />
```

##### 7. **Communication Between Sibling Components via Parent**

   - **Use case**: Events raised by one child component can be captured by the parent and passed
     down as props to another sibling, enabling indirect communication between siblings.

   - **Example**: A list component dispatches an event when an item is selected, and the parent
     passes this information to a details component.

```svelte
<!-- Parent.svelte -->
<script>
    let selectedItem;
    function handleSelection(event) {
        selectedItem = event.detail.item;
    }
</script>

<ItemList on:select={handleSelection} />
<ItemDetails {selectedItem} />
```

#### When to Use Events:

- **Decoupling logic**: Events are a great way to decouple child and parent components.
  Instead of the parent needing to know how the child works, it just listens for specific
  events.

- **Communication**: Events are useful when you need to pass data or notify the parent of
  something that happened inside the child, without direct prop changes or binding.

- **Component autonomy**: If a component needs to manage its own state but still inform
  the parent of important changes, events provide a clean way to do that.

### Routing

This would typically be handled by SvelteKit in a full-stack application, crossing the
boundary between client and server with:

* Filesystem based routes
* Server-side rendering of the initial request
* Client-side rendering of the follow-up requests
* Server-side data loading
* Server-side API endpoints
* ...

But this requires to write the backend in JavaScript, too. Instead, this mock application
uses [svelte-spa-router](https://github.com/ItalyPaleAle/svelte-spa-router), which is a
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

* `npm create svelte@latest` enables SvelteKit, which is very powerful but also a
  JavaScript **server** backend (with hydration). But `lecture-slides.js` in its current
  form must remain servable from a static webserver and shall later get an optional
  Django backend.

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
But the bundle size is okay for both: 14 kB for Tonic vs. 25 kB for Svelte (considering
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