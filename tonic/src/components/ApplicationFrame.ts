import type { TonicTemplate } from "@socketsupply/tonic";
import type { Properties}     from "@socketsupply/tonic";

import { TonicComponent }     from "../utils/TonicComponent.js";
import { Router }             from "../utils/router.js"
import * as book              from "../stores/book.js";
import { language }           from "../stores/i18n.js";
import { i18n }               from "../stores/i18n.js";

import "./ApplicationFrame.css";

type PageNames = "BookContentPage" | "NotFoundPage";

/**
 * Root component of the application. It defines a very basic UI for this practical test,
 * consisting of an application header, a page preview and two buttons to navigate within
 * the simulated currently open study book.
 */
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
            show: () => book.gotoPage(1),
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

        // Rerender on changed language code
        language.bindFunction((newValue) => {
            book.title.value = i18n.StudyBook.Title;
            this.reRender();
        });
    }

    /**
     * Helper function called by the SPA router to instantiate the correct HTML template
     * for the given URL and trigger re-rendering, if necessary. This is called by the
     * router and not by the `render()` method to allow some flexibility when to actually
     * re-render or not. Because some pages, when the type of page didn't change, just need
     * the observables with the application state to be updated.
     * 
     * @param pageName Name of the requested page
     * @param properties HTML attributes or other data extracted from the URL
     */
    #gotoPage(pageName: PageNames, properties?: Properties) {
        let rerender = false;

        switch (pageName) {
            case "BookContentPage":
                this.#pageTemplate = this.html`<book-content-page></book-content-page>`;
                if (properties?.page) book.gotoPage(properties.page);
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

TonicComponent.add(ApplicationFrame);