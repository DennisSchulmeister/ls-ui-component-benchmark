import { TonicComponent } from "../../utils/TonicComponent.js";
import { title }          from "../../stores/book.js";

import "./BookTitle.css";

/**
 * Simple component to render the current book title.
 */
export class BookTitle extends TonicComponent {
    constructor() {
        super();
        this.bindFunction(title, this.reRender.bind(this));
    }

    render() {
        return this.html`${title.value}`;
    }
}

TonicComponent.add(BookTitle);