import { TonicComponent } from "../../utils/TonicComponent.js";
import * as book          from "../../stores/book.js";


/**
 * Small component to display the current page number and total number of pages.
 * Similar to this: 1 / 3
 */
export class PageNumbers extends TonicComponent {
    constructor() {
        super();

        this.bindFunction(book.currentPage, this.reRender.bind(this));
        this.bindFunction(book.totalPages, this.reRender.bind(this));
    }

    render() {
        return this.html`${book.currentPage.value.toString()} / ${book.totalPages.value.toString()}`;
    }
}

TonicComponent.add(PageNumbers);