import { TonicComponent }      from "../../TonicComponent.js";
import { getApplicationFrame } from "../ApplicationFrame.js";
import { ApplicationFrame }    from "../ApplicationFrame.js";

import "./ProgressBar.less";

/**
 * Progress bar the grows wider the more the current page reaches the end of the
 * currently open study book.
 */
export class ProgressBar extends TonicComponent {
    #app: ApplicationFrame = getApplicationFrame();
    
    constructor() {
        super();

        this.bindFunction(this.#app.book.currentPage, this.updateWidth.bind(this));
        this.bindFunction(this.#app.book.totalPages, this.updateWidth.bind(this));
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

TonicComponent.add(ProgressBar);