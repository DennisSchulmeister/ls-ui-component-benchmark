import { TonicComponent }      from "../../utils/TonicComponent.js";
import { getApplicationFrame } from "../ApplicationFrame.js";
import { ApplicationFrame }    from "../ApplicationFrame.js";

import "./BookTitle.less";

/**
 * Simple component to render the current book title.
 */
export class BookTitle extends TonicComponent {
    #app: ApplicationFrame = getApplicationFrame();

    constructor() {
        super();
        this.bindFunction(this.#app.book.title, this.reRender.bind(this));
    }

    render() {
        return this.html`${this.#app.book.title.value}`;
    }
}

TonicComponent.add(BookTitle);