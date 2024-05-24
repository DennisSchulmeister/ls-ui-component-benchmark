import { getApplicationFrame } from "../ApplicationFrame.js";
import { ApplicationFrame }    from "../ApplicationFrame.js";

import Tonic from "@socketsupply/tonic";
import "./BookTitle.less";

/**
 * Simple component to render the current book title.
 */
export class BookTitle extends Tonic {
    #app: ApplicationFrame;

    constructor() {
        super();
        this.#app = getApplicationFrame();

        this.#app.book.title.bindFunction(() => this.reRender());
    }

    render() {
        return this.html`${this.#app.book.title.value}`;
    }
}

Tonic.add(BookTitle);