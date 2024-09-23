import { TonicComponent }      from "../../../utils/TonicComponent.js";
import * as book               from "../../../stores/book.js";
import { i18n }                from "../../../stores/i18n.js";

import "./BookContentPage.css";

/**
 * Main content area component to render the currently visible page of a study book.
 * Also handles keyboard shortcuts to navigate between pages.
 */
export class BookContentPage extends TonicComponent {
    constructor() {
        super();

        this.bindFunction(book.currentPage, this.reRender.bind(this));

        this.keyUp = this.keyUp.bind(this);
        window.addEventListener("keyup", this.keyUp);
    }

    disconnected() {
        window.removeEventListener("keyup", this.keyUp);
    }

    render() {
        let prevDisabled = !(book.currentPage.value > 1);
        let nextDisabled = !(book.currentPage.value < book.totalPages.value);

        return this.html`
            <div class="main-area">
                <page-preview page=${book.currentPage.value.toString()}></page-preview>
            </div>
            
            <div class="button-row">
                <simple-button data-action="prev-page" type="primary" disabled="${prevDisabled.toString()}">
                    <span>${i18n.BookContentPage.Button.Prev}</span>
                </simple-button>

                <simple-button data-action="next-page" type="primary" disabled="${nextDisabled.toString()}">
                    <span>${i18n.BookContentPage.Button.Next}</span>
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
            book.gotoPreviousPage();
        } else if (button.dataset.action === "next-page") {
            book.gotoNextPage();
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
                book.gotoNextPage();
                break;
            case "ArrowLeft":
                book.gotoPreviousPage();
                break;
        }
    }
}

TonicComponent.add(BookContentPage);