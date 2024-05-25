import { TonicComponent }      from "../../TonicComponent.js";
import { getApplicationFrame } from "../ApplicationFrame.js";
import { ApplicationFrame }    from "../ApplicationFrame.js";


/**
 * Small component to display the current page number and total number of pages.
 * Similar to this: 1 / 3
 */
export class PageNumbers extends TonicComponent {
    #app: ApplicationFrame = getApplicationFrame();;

    constructor() {
        super();

        this.bindFunction(this.#app.book.currentPage, this.reRender.bind(this));
        this.bindFunction(this.#app.book.totalPages, this.reRender.bind(this));
    }

    render() {
        return this.html`${this.#app.book.currentPage.value.toString()} / ${this.#app.book.totalPages.value.toString()}`;
    }
}

TonicComponent.add(PageNumbers);