import { TonicComponent } from "../TonicComponent.js";
import { Observable }     from "../observable.js";
import { Router }         from "../router.js"

import "./ApplicationFrame.less";

/**
 * @returns The global application instance
 */
export function getApplicationFrame(): ApplicationFrame {
    let app = document.getElementById("app") as unknown;
    return app as ApplicationFrame;
}

/**
 * Root component of the application. It defines a very basic UI for this practical test,
 * consisting of an application header, a page preview and two buttons to navigate within
 * the simulated currently open study book.
 */
export class ApplicationFrame extends TonicComponent {
    // Global application state with a simulated study book
    readonly book = {
        title:       new Observable<string>("Title of the study book"),
        currentPage: new Observable<number>(1),
        totalPages:  new Observable<number>(10),

        /**
         * Go to the first study book page.
         */
        gotoPage(page: number, fromRoute?: boolean) {
            if (page >= 1 && page <= this.totalPages.value) {
                if (fromRoute) {
                    this.currentPage.value = page;
                } else {
                    location.hash = `/book/page/${page}`;
                }
            } else {
                console.error(`Unknown page: ${page}`);
            }
        },

        /**
         * Navigate to the next study book page.
         */
        gotoNextPage() {
            if (this.currentPage.value < this.totalPages.value) {
                location.hash = `/book/page/${this.currentPage.value + 1}`;
            }
        },
    
        /**
         * Navigate to the previous study book page.
         */
        gotoPreviousPage() {
            if (this.currentPage.value > 1) {
                location.hash = `/book/page/${this.currentPage.value - 1}`;
            }
        },
    };

    #router: Router;
    #unknownUrl = true;

    constructor() {
        super();

        this.#router = new Router([{
            // Redirect to the first page
            url: "^/$",
            show: () => this.book.gotoPage(1),
        }, {
            // Show requested book page
            url: "^/book/page/(.*)$",
            show: this.#gotoBookPage.bind(this),
        }, {
            // Show 404 page
            url: ".*",
            show: this.#gotoNotFoundPage.bind(this),
        }]);

        this.#router.start();
    }

    /**
     * Update application state to reflect the new page from the URL.
     * Trigger a rerendering if the previous URL pointed to another type of page.
     */
    #gotoBookPage(matches: RegExpMatchArray|null, oldHash: string) {
        let number = parseInt(matches?.[1] || "");

        if (isNaN(number)) {
            console.error(`Invalid page number: ${number}`);
            return;
        }

        this.book.gotoPage(number, true);

        if (this.#unknownUrl || !oldHash.startsWith("/book/page/")) {
            this.#unknownUrl = false;
            this.reRender();
        };

    }

    /**
     * Update application state to show a "404 not found" page.
     */
    #gotoNotFoundPage() {
        this.#unknownUrl = true;
        this.reRender();
    }

    render() {
        return this.html`
            <application-header></application-header>
            ${
                this.#unknownUrl
                    ? this.html`<not-found-page url="${location.hash.slice(1)}"></not-found-page>`
                    : this.html`<book-content-page></book-content-page>`
            }
        `;
    }
}

TonicComponent.add(ApplicationFrame);