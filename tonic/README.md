UI Component Benchmark: Tonic
=============================

1. [Summary](#summary)
    1. [Basic Component Definition](#basic-component-definition)
    1. [Property Declaration](#property-declaration)
    1. [Nested Components](#nested-components)
    1. [Reactive Rendering](#reactive-rendering)
    1. [DOM Event Handling](#dom-event-handling)
    1. [Routing](#routing)
    1. [Translations](#translations)
1. [Thoughts and Learnings](#thoughts-and-learnings)
1. [Conclusion](#conclusion)

This is a minimal project based on the esbuild + TypeScript template in the same
repository. It uses the @socketsupply/tonic Tonic Framework, which is a very
lightweight web component wrapper.

Steps how this project was set up:

1. Copy the esbuild + TypeScript template
2. Run `npm add -D @socketsupply/tonic`

Summary
-------

### Basic Component Definition

Components are classes or functions that return a HTML template string.
The method `Tonic.add()` wraps them as native web components:

```ts
import { TonicComponent } from "../../utils/TonicComponent.js";

class MyGreeting extends TonicComponent {
  render () {
    return this.html`<div>Hello, World.</div>`
  }
}

TonicComponent.add(MyGreeting);
```

When rendered, the HTML string will be placed inside the element:

```html
<my-greeting>
    <div>Hello, World.</div>
</my-greeting>
```

### Property Declaration

Properties are passed as HTML attributes that can be accessed via `this.props`.
To make TypeScript happy, a custom type must be defined. Properties will always
be serialized as strings and strange results will occur, when they are not strings
to begin with.

```ts
import type { Properties } from "@socketsupply/tonic";
import { TonicComponent }  from "../../utils/TonicComponent.js";
import "./SimpleButton.css";

type SimpleButtonProperties = {
    type?: "" | "primary";
    disabled?: "true"|"false";
    attributes?: Properties
};

export class SimpleButton extends TonicComponent<SimpleButtonProperties> {
    render() {
        return this.html`
            <Button ...${this.props.attributes || {}}>${this.children}</Button>
        `;
    }
}

TonicComponent.add(SimpleButton);
```

Note, that `this.props.attributes` in this example is not coming from Tonic. It is
a deliberate API choice of this component to allow setting arbitrary HTML attributes
of the rendered `<button>`.

### Nested Components

Other components can simply be used like any web component in the HTML template
of a parent component. `this.children` is used here to wrap the own children with
`<another-component>`. Properties can be passed to children as HTML attributes,
but only as strings.

```ts
class ParentComponent extends TonicComponent {
  render () {
    return this.html`
      <div class="parent">
        <another-component>
          ${this.children}
        </another-component>
      </div>
    `
  }
}

TonicComponent.add(ParentComponent)

class ChildComponent extends TonicComponent {
  render () {
    return this.html`
      <div class="child">
        ${this.props.value}
      </div>
    `
  }
}

TonicComponent.add(ChildComponent)
```

### Reactive Rendering

Tonic has no built-in rerendering when a component's properties change, or any other kind
of "reactive updates". Instead, either `this.reRender(newProps?)` must be called to manually
rerender a component or the DOM must be manually updated. This is to keep the framework simple
and avoid the complexity of a true reactive model and virtual DOM:

```ts
this.reRender();                            // Rerender with the same properties
this.reRender({greeting="Hello"});          // Rerender with new properties
anotherComponent.reRender();                // Rerender e.g. a child component
```

Using our own `Observable` and a bit of boiler-plate in our own `TonicComponent` to handle
de-registration when a component is destroyed, a reactive-like model can be achieved: 

```ts
// Simple component, as deep in the DOM as possible, rerendering when one of
// its observed values change. "As deep in the DOM as possible" to only rerender
// the small and cheap components, not the huge composites.
export class PageNumbers extends TonicComponent {
    constructor() {
        super();

        this.bindFunction(book.currentPage, this.reRender.bind(this));
        this.bindFunction(book.totalPages, this.reRender.bind(this));
    }

    render() {
        return this.html`${book.currentPage.value.toString()} / ${book.totalPages.value.toString()}`;
    }
}

// Another component that will be rerendered with its parent
export class PagePreview extends TonicComponent<PagePreviewProperties> {
    render() {
        return this.html`
            <div>${this.props.page}</div>
        `;
    }
}

// Parent with custom rerendering
export class BookContentPage extends TonicComponent {
    constructor() {
        super();

        // Trigger rerendering, when the page number changes
        this.bindFunction(book.currentPage, this.reRender.bind(this));
    }

    render() {
        return this.html`
            <page-preview page=${book.currentPage.value.toString()}></page-preview>
            ...
        `;
    }
}
```

### DOM Event Handling

DOM events are usually captured via special methods provided by Tonic. It is recommended
to catch events at the level of the web component instead of its individual rendered children.
This optimizes memory and execution time, since the child nodes will be destroyed with every
rerender. Also much less event listeners need to be created.

```ts
export class BookContentPage extends TonicComponent {
    // Custom handling for events not covered by Tonic
    constructor() {
        this.keyUp = this.keyUp.bind(this);
        window.addEventListener("keyup", this.keyUp);
    }

    disconnected() {
        window.removeEventListener("keyup", this.keyUp);
    }

    render() {
        return this.html`
          <simple-button> ...  </simple-button>
          <simple-button> ...  </simple-button>
        `;
    }
    
    click(e: MouseEvent) {
        const button = TonicComponent.match(e.target, "[data-action]");
        /* ... */
    }

    keyUp(e: KeyboardEvent) {
        /* ... */
    }
}

TonicComponent.add(BookContentPage);
```

### Routing

This is not handled by the framework, since it is only concerned with building web components.
We roll our own simple `hashchange` based router here, that executes callback functions of the
main `ApplicationFrame`:

```ts
type PageNames = "BookContentPage" | "NotFoundPage";

export class ApplicationFrame extends TonicComponent {
    #router: Router;
    #pageTemplate?: TonicTemplate;
    #pageName: string = "";

    constructor() {
        super();

        /**
         * Routing rules
         */
        this.#router = new Router([{
            // Redirect to the first page
            url: "^/$",
            show: () => this.book.gotoPage(1),
        }, {
            // Show requested book page
            url: "^/book/page/(.*)$",
            show: (matches) => this.#gotoPage("BookContentPage", {page: matches?.[1]}),
        }, {
            // Show 404 page
            url: ".*",
            show: () => this.#gotoPage("NotFoundPage", {url: location.hash.slice(1)}),
        }]);

        this.#router.start();
    }

    #gotoPage(pageName: PageNames, properties?: Properties) {
        let rerender = false;

        switch (pageName) {
            case "BookContentPage":
                this.#pageTemplate = this.html`<book-content-page></book-content-page>`;
                if (properties?.page) this.book.gotoPage(properties.page);
                break;

            case "NotFoundPage":
                this.#pageTemplate = this.html`<not-found-page ...${properties}></not-found-page>`;
                rerender = true;
                break;
            
            default:
                console.error(`This should not happen! Unknown page: ${pageName}`);
        }

        if (this.#pageName !== pageName || rerender) {
            this.#pageName = pageName;
            this.reRender();
        }
    }

    render() {
        return this.html`
            <application-header></application-header>
            ${this.#pageTemplate || ""}
        `;
    }
}
```

Not as clean and simple as a `Router` component, but it doesn't polute the DOM
and is very flexible.

### Translations

Neither handled by the framework. Here we roll our own solution based on our own
`Observable` class (to "observe" the currently set language) and a bit of custom
code in `stores/i18n.ts`:

```ts
// Accessing translations
import { i18n }           from "../../../stores/i18n.js";
import { _ }              from "../../../stores/i18n.js";

export class NotFoundPage extends TonicComponent<NotFoundPageProperties> {
    render() {
        return this.html`
            <h1>${i18n.Error404.Title}</h1>
            <p>
                <!-- With placeholder replacement and no HTML escaping -->
                ${this.html(_(i18n.Error404.Message1, this.props))}
            </p>
            ...
        `;
    }
}

// Rerender the whole UI when the language changes
export class ApplicationFrame extends TonicComponent {
    constructor() {
        // Rerender on changed language code
        language.bindFunction((newValue) => {
            book.title.value = i18n.StudyBook.Title;
            this.reRender();
        });
    }
}
```

Components don't need to watch the currently set language. The root components
simply rerenders the whole UI, when the language changes. Since this occurs
rather seldomly but affects the whole UI, anyway, this is a good choice.

Thoughts and Learnings
----------------------

* When working in Visual Studio Code, the [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html)
  extension adds nice syntax highlighting to the HTML templates.

* Element properties (`props`) are always serialized to HTML properties as strings.
  So we cannot pass callback functions etc. from a parent component to its children.
  Passing javascript data objects is possible but somewhat expensive due to the
  JSON marshalling.

  Also weird things happen, when property values are not strings. Especially when
  passed in HTML template strings they often get converted to strange `value__type`
  strings. The safest thing to do is to always pass properties as strings.
  
* Components can manage their own state using plain object attributes. It is not
  necessary to use Tonic's `this.state` object which is just a key/value-pair on
  the `Tonic` class using the element's ID, that must be manually cleaned up.

  The only reason to use this would probably be to update the state of an element
  from outside the element.

* How to handle global state that needs to update many components deep in the DOM tree?
  Thats what "stores" are for in other frameworks. But we can achieve the same with our
  own `Observable` class, which basically is a store on steroids.

  Collect the global states in `stores/*.ts` files and export `Observable` objects there.
  Then observe these values as deep in the DOM as possible to update the UI or simply
  rerender components. By doing this near the leaf-nodes in the DOM this is cheap.
  Rerendering destroy and recreates the DOM nodes, but since we are not dealing with
  large composite elements here, this is okay.

  To support this pattern, a intermediate class called `TonicComponent` has been developed,
  that extends the basic `Tonic` class but adds book-keeping for the observables.

* Routing can be as easy or complex as you want, but generally URL hash based routing using
  the `hashchange` event is a good approach. This allows to host the application on all servers
  without special consideration and is quite easy to handle client-side.

  Building a router component, that simply decides whether to render some of its children
  of dynamically creates components, can be done. But since every component is a full
  web component this would leave intermediate elements like `<Router>` in the DOM, which
  is inconvenient for styling.
  
  For this reason we use a different, probably less clean, approach here. The router class
  simply executes callback methods from the `ApplicationFrame` component that trigger
  conditional rerendering.

Conclusion
----------

By itself, Tonic is a bit too bare-bone for a whole application. But once the missing
pieces are in place (`utils` directory), it works rather well. It definitely has the
least footprint from all alternatives and the least risk of breaking dependencies.
If needed, it can simply be forked and maintained as part of the application.

The missing reactive model makes the code more verbose at some places, but all in all
it remains manageable. And not automatically rerendering is actually a plus, as it
allows precise control on DOM updates, where it is needed. e.g. in the `ProgressBar`
that uses manual DOM updates to keep the CSS transition working.