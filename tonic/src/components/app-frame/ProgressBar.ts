import { TonicComponent } from "../../utils/TonicComponent.js";
import * as book          from "../../stores/book.js";

import "./ProgressBar.css";

/**
 * Progress bar the grows wider the more the current page reaches the end of the
 * currently open study book.
 */
export class ProgressBar extends TonicComponent {
    constructor() {
        super();

        this.bindFunction(book.currentPage, this.updateWidth.bind(this));
        this.bindFunction(book.totalPages, this.updateWidth.bind(this));
    }

    #calcWidth(): number {
        return 100.0 * book.currentPage.value / book.totalPages.value;
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