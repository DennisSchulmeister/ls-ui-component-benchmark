import { getApplicationFrame } from "../ApplicationFrame.js";
import { ApplicationFrame }    from "../ApplicationFrame.js";

import Tonic from "@socketsupply/tonic";
import "./ProgressBar.less";

/**
 * Progress bar the grows wider the more the current page reaches the end of the
 * currently open study book.
 */
export class ProgressBar extends Tonic {
    #app: ApplicationFrame;

    constructor() {
        super();
        this.#app = getApplicationFrame();

        this.#app.book.currentPage.bindFunction(() => this.updateWidth());
        this.#app.book.totalPages.bindFunction(() => this.updateWidth());
    }

    #calcWidth(): number {
        return 100.0 * this.#app.book.currentPage.value / this.#app.book.totalPages.value;
    }

    render() {
        return this.html`
            <div class="indicator" style="width: ${this.#calcWidth().toString()}%"></div>
        `;
    }

    updateWidth() {
        let indicator = this.querySelector(".indicator") as HTMLElement;
        if (!indicator) return;

        indicator.style.width = `${this.#calcWidth().toString()}%`;
    }
}

Tonic.add(ProgressBar);