import type { TonicTemplate } from "@socketsupply/tonic";
import type { Properties}     from "@socketsupply/tonic";
import type { LanguageCode }  from "../utils/i18n.js";

import { TonicComponent }     from "../utils/TonicComponent.js";
import { Observable }         from "../utils/observable.js";
import { Router }             from "../utils/router.js"
import { _ }                  from "../utils/i18n.js";
import * as i18n              from "../utils/i18n.js";

import "./ApplicationFrame.less";

/**
 * @returns The global application instance
 */
export function getApplicationFrame(): ApplicationFrame {
    let app = document.getElementById("app") as unknown;
    return app as ApplicationFrame;
}

type PageNames = "BookContentPage" | "NotFoundPage";

/**
 * Root component of the application. It defines a very basic UI for this practical test,
 * consisting of an application header, a page preview and two buttons to navigate within
 * the simulated currently open study book.
 */
export class ApplicationFrame extends TonicComponent {
    /**
     * Global application state with a simulated study book
     */
    readonly book = {
        title:       new Observable<string>(_("StudyBook/Title")),
        currentPage: new Observable<number>(1),
        totalPages:  new Observable<number>(10),

        /**
         * Go to the given study book page and update URL accordingly. Can either be called
         * from anywhere in the app to change the current page or from the SPA router to call
         * up the page from the current URL.
         */
        gotoPage(page: any) {
            let pageNumber = parseInt(page);
            let pageUrl    = `#/book/page/${page}`;

            if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > this.totalPages.value) {
                console.error(`Unknown page: ${page}`);
                return;
            }

            if (location.hash !== pageUrl) location.hash = pageUrl;
            if (this.currentPage.value !== pageNumber) this.currentPage.value = pageNumber;
        },

        /**
         * Navigate to the next study book page.
         */
        gotoNextPage() {
            if (this.currentPage.value < this.totalPages.value) {
                this.gotoPage(this.currentPage.value + 1);
            }
        },
    
        /**
         * Navigate to the previous study book page.
         */
        gotoPreviousPage() {
            if (this.currentPage.value > 1) {
                this.gotoPage(this.currentPage.value - 1);
            }
        },
    };

    // Public export of the i18n module so that study book authors
    // can access and extend the translations
    i18n = i18n;
    language = new Observable<LanguageCode>("");

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

        // Rerender on changed language code
        this.language.value = i18n.getCurrentLanguages()[0];

        this.language.bindFunction((newValue) => {
            i18n.setCurrentLanguages(newValue, "en");
            this.book.title.value = _("StudyBook/Title");
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

TonicComponent.add(ApplicationFrame);