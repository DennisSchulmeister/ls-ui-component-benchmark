import { TonicComponent } from "../../TonicComponent.js";
import { Observable }     from "../../observable.js";

type Properties = {
    route?: string;
    rerender?: boolean;
};

/**
 * TODO: Docstring
 */
export class HashRouter extends TonicComponent<Properties> {
    #enabled: boolean = false;
    #matched?: boolean;

    connected() {
        this.#enabled = true;
    }

    disconnected() {
        this.#enabled = false;
    }

    /**
     * Called when the URL hash has changed to match its contained path and rerender
     * content of this instance, if needed. A rerendering occurs,
     * 
     *  * if no route matches (to clear the visible content)
     *  * or the route matches for this first time after another route
     *  * or the route matches and the rerender property is `undefined` or `true`.
     * 
     * @param path Current URL path 
     */
    match(path: string): boolean {
        if (!this.props.route) return false;
        if (this.props.rerender === undefined) this.props.rerender = true;
        
        let matchedBefore = this.#matched;
        let matched = this.#matchRoute(path);
        
        if (!this.#matched) {
            this.reRender();
        } else if (!matchedBefore || this.props.rerender) {
            this.reRender();
        }

        this.#matched = undefined;
        return matched;
    }

    /**
     * Actual implementation of the path matching. Split into its own function as it is
     * needed when a "hashchange" event occurs but also when a `<hash-router>` instance
     * is rendering. Simply, because nested routers might rerender their content which
     * would create new `<hash-router>` instances that also must match the url.
     * 
     * If `this.#matched` is `true` or `false` we assume the path has already been checked.
     * Only, if `this.#matched` is `undefined` a new check will be performed.
     * 
     * @param path Current URL path
     * @returns Flag, if the path matches
     */
    #matchRoute(path: string): boolean {
        if (this.#matched !== undefined) return this.#matched;
        return false; // TODO: Check path, then test (including nested routers)
    }

    /**
     * Render children, if the route matches or nothing otherwise.
     */
    render() {
        let path = getPath();
        let routeMatched = this.#matchRoute(path);
        this.#matched = undefined;

        return routeMatched ? this.html`${this.children}` : this.html``;
    }
}

function getPath() {
    let result = location.hash.slice(1);
    if (result.length === 0) result = "/";
    return result;
}

/**
 * Singular event handler for the hash change event. This determines the path from the
 * URL hash, lets all `HashRouter` instances match the path and triggers rendering of
 * the fallback, if no router accepts the path.
 */
function hashChanged() {
    // Get path
    let path = getPath();

    // Let the routers match the path and rerender
    let routeMatched = false;
    let hashRouters  = Array.from(document.querySelectorAll("hash-router")) as HashRouter[];
    hashRouters.reverse();

    for (let hashRouter of hashRouters) {
        routeMatched = hashRouter.match(path) || routeMatched;
    }

    // Render fallback when no router accepted the path
    if (!routeMatched) {
        for (let hashRouter of hashRouters) {
            if (!hashRouter.props.route) {
                hashRouter.reRender();
            }
        }
    }
}

window.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("hashchange", hashChanged);
    hashChanged();
});

TonicComponent.add(HashRouter);