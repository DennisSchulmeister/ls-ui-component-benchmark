import { getApplicationFrame } from "../ApplicationFrame.js";
import { ApplicationFrame }    from "../ApplicationFrame.js";

import Tonic from "@socketsupply/tonic";
import "./BookContentPage.less";

/**
 * Main content area component to render the currently visible page of a study book.
 */
export class BookContentPage extends Tonic {
    #app: ApplicationFrame;

    constructor() {
        super();
        this.#app = getApplicationFrame();

        this.#app.book.currentPage.bindFunction(() => this.reRender());
    }

    click(e: MouseEvent) {
        const button = Tonic.match(e.target, "[data-action]");

        if (button.dataset.action === "prev-page") {
            this.#app.book.gotoPreviousPage();
            this.reRender();
        } else if (button.dataset.action === "next-page") {
            this.#app.book.gotoNextPage();
            this.reRender();
        }
    }

    render() {
        let prevDisabled = !(this.#app.book.currentPage.value > 1);
        let nextDisabled = !(this.#app.book.currentPage.value < this.#app.book.totalPages.value);

        return this.html`
            <div class="main-area">
                <page-preview page=${this.#app.book.currentPage.value}></page-preview>
            </div>
            
            <div class="button-row">
                <simple-button data-action="prev-page" type="primary" disabled="${prevDisabled.toString()}">
                    <span>Zurück</span>
                </simple-button>

                <simple-button data-action="next-page" type="primary" disabled="${nextDisabled.toString()}">
                    <span>Weiter</span>
                </simple-button>
            </div>
        `;
    }
}

Tonic.add(BookContentPage);