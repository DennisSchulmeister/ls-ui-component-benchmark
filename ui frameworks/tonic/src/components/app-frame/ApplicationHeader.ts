import { TonicComponent } from "../../TonicComponent.js";
import "./ApplicationHeader.less";

/**
 * Application header that is permanently visible at the top of the screen. Shows the
 * title of the currently open study book, the page numbers and a progress bar.
 */
export class ApplicationHeader extends TonicComponent {
    render() {
        return this.html`
            <progress-bar></progress-bar>

            <div class="main-area">
                <book-title></book-title>

                <div>
                    <a href="#/unknown-page" class="link">Trigger 404 Page</a>
                    <page-numbers></page-numbers>
                </div>
            </div>
        `;
    }
}

TonicComponent.add(ApplicationHeader);