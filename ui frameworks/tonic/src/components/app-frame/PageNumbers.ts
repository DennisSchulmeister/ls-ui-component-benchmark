import { getApplicationFrame } from "../ApplicationFrame.js";
import { ApplicationFrame }    from "../ApplicationFrame.js";

import Tonic from "@socketsupply/tonic";
import "./PageNumbers.less";

/**
 * Small component to display the current page number and total number of pages.
 * Similar to this: 1 / 3
 */
export class PageNumbers extends Tonic {
    #app: ApplicationFrame;

    constructor() {
        super();
        this.#app = getApplicationFrame();

        this.#app.book.currentPage.bindFunction(() => this.reRender());
        this.#app.book.totalPages.bindFunction(() => this.reRender());
    }

    render() {
        return this.html`${this.#app.book.currentPage.value.toString()} / ${this.#app.book.totalPages.value.toString()}`;
    }
}

Tonic.add(PageNumbers);