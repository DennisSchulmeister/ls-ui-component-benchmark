import { TonicComponent }      from "../../utils/TonicComponent.js";
import { getApplicationFrame } from "../ApplicationFrame.js";
import { ApplicationFrame }    from "../ApplicationFrame.js";
import { _ }                   from "../../utils/i18n.js";

import "./BookContentPage.less";

/**
 * Main content area component to render the currently visible page of a study book.
 */
export class BookContentPage extends TonicComponent {
    #app: ApplicationFrame = getApplicationFrame();

    constructor() {
        super();

        this.bindFunction(this.#app.book.currentPage, this.reRender.bind(this));

        this.keyUp = this.keyUp.bind(this);
        window.addEventListener("keyup", this.keyUp);
    }

    disconnected() {
        window.removeEventListener("keyup", this.keyUp);
    }

    render() {
        let prevDisabled = !(this.#app.book.currentPage.value > 1);
        let nextDisabled = !(this.#app.book.currentPage.value < this.#app.book.totalPages.value);

        return this.html`
            <div class="main-area">
                <page-preview page=${this.#app.book.currentPage.value.toString()}></page-preview>
            </div>
            
            <div class="button-row">
                <simple-button data-action="prev-page" type="primary" disabled="${prevDisabled.toString()}">
                    <span>${_("BookContentPage/Button/Previous")}</span>
                </simple-button>

                <simple-button data-action="next-page" type="primary" disabled="${nextDisabled.toString()}">
                    <span>${_("BookContentPage/Button/Next")}</span>
                </simple-button>
            </div>
        `;
    }
    
    /**
     * Handle button clicks
     */
    click(e: MouseEvent) {
        const button = TonicComponent.match(e.target, "[data-action]");
        if (!button) return;

        if (button.dataset.action === "prev-page") {
            this.#app.book.gotoPreviousPage();
        } else if (button.dataset.action === "next-page") {
            this.#app.book.gotoNextPage();
        }
    }

    /**
     * Handle keyboard navigation
     */
    keyUp(e: KeyboardEvent) {
        if (e.target !== document.body) return;

        switch (e.key) {
            case "ArrowRight":
            case "Enter":
            case " ":
                this.#app.book.gotoNextPage();
                break;
            case "ArrowLeft":
                this.#app.book.gotoPreviousPage();
                break;
        }
    }
}

TonicComponent.add(BookContentPage);