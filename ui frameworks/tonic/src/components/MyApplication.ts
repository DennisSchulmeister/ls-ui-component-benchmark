import { Observable } from "../utils/observable.js";

import Tonic from "@socketsupply/tonic";
import "./MyApplication.less";

/**
 * @returns The global application instance
 */
export function getApplication(): MyApplication {
    let app = document.getElementById("app") as unknown;
    return app as MyApplication;
}

/**
 * Root component of the application. It defines a very basic UI for this practical test,
 * consisting of an application header, a page preview and two buttons to navigate within
 * the simulated currently open study book.
 */
export class MyApplication extends Tonic {
    // Global application state with a simulaed study book
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
            <my-application-header></my-application-header>
            <my-book-content-page></my-book-content-page>
        `;
    }
}

Tonic.add(MyApplication);