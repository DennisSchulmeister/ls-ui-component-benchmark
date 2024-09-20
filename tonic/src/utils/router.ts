export type RouteMatchedCallback = (matches: RegExpMatchArray|null, oldHash: string, newHash: string) => void;

export type Route = {
    url: string|RegExp;
    show: RouteMatchedCallback|RouteMatchedCallback[];
};

/**
 * This is a very basic single page router based on the `hashchange` event.
 * Therefor only the hash-part of the URL is used for the routing, which makes
 * it easy to deploy the application on any static webserver.
 * 
 * Routes are simple regular expressions with optional match groups. When a
 * route matches, one ore more callback functions receiving the matched values
 * will be called. It is the responsibility of these callbacks to update the
 * application state and/or trigger necessary re-renderings.
 * 
 * Another advantage is that plain links `<a href="#..."></a>` can be used
 * for navigation. No black magic needed at all.
 */
export class Router {
    #routes: Route[];
    #started = false;

    /**
     * Constructor. In the parameter `routes` a list of the existing URL routes of
     * the app must be passed. The list must have the following format:
     *
     *      [
     *          {
     *              url: "^/$"              // Regular expression for the URL
     *              show: matches => {...}  // Function to display the content
     *          }, {
     *              url: "^/Details/(.*)$"  // Regular expression for the URL
     *              show: [...]             // This can also be an array
     *          },
     *          ...
     *      ]
     *
     * @param routes Route definitions
     */
    constructor(routes: Route[]) {
        this.#routes = routes;

        window.addEventListener("hashchange", this.#handleRouting.bind(this));
    }

    /**
     * Enable routing and immediately call the first route.
     */
    start() {
        this.#started = true;
        this.#handleRouting();
    }

    /**
     * Stop or pause routing so that the router doesn't react anymore when the
     * URL changes. Routing can later be restarted with the `start()` method.
     */
    stop() {
        this.#started = false;
    }

    /**
     * The actual routing algorithm. Simple, isn't it? :-)
     */
    #handleRouting(event?: HashChangeEvent) {
        if (!this.#started) return;

        let newHash = location.hash.slice(1);
        if (newHash.length === 0) newHash = "/";

        let oldHash = event?.oldURL.slice(event.oldURL.indexOf("#") + 1) || "";

        let matches:RegExpMatchArray|null = null;
        let route = this.#routes.find(p => matches = newHash.match(p.url));

        if (!route) {
            console.error(`No route for '${newHash}' found!`);
            return;
        }

        if (Array.isArray(route.show)) {
            for (let callback of route.show) {
                callback(matches, oldHash, newHash);
            }
        } else {
            route.show(matches, oldHash, newHash);
        }
    }
}
