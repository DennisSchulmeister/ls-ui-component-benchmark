import { Observable } from "../utils/observable.js";

import Tonic from "@socketsupply/tonic";
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
export class ApplicationFrame extends Tonic {
    // Global application state with a simulated study book
    readonly book = {
        title:       new Observable<string>("Simulated Study Book"),
        currentPage: new Observable<number>(1),
        totalPages:  new Observable<number>(10),

        /**
         * Navigate to the next study book page.
         */
        gotoNextPage() {
            if (this.currentPage.value < this.totalPages.value) {
                this.currentPage.value += 1;
            }
        },
    
        /**
         * Navigate to the previous study book page.
         */
        gotoPreviousPage() {
            if (this.currentPage.value > 1) {
                this.currentPage.value -= 1;
            }
        },
    };

    render() {
        return this.html`
            <application-header></application-header>
            <book-content-page></book-content-page>
        `;
    }
}

Tonic.add(ApplicationFrame);