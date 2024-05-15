import { getApplication } from "../MyApplication.js";
import { MyApplication }  from "../MyApplication.js";

import Tonic from "@socketsupply/tonic";
import "./MyBookContentPage.less";

/**
 * Main content area component to render the currently visible page of a study book.
 */
export class MyBookContentPage extends Tonic {
    #app: MyApplication;

    constructor() {
        super();
        this.#app = getApplication();

        this.#app.book.currentPage.bindFunction(() => {
            this.reRender();
        });
    }

    render() {
        return this.html`
            <my-page-preview page=${this.#app.book.currentPage.value}></my-page-preview>
        `;
    }
}

Tonic.add(MyBookContentPage);