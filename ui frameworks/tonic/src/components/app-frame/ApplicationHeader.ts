import Tonic from "@socketsupply/tonic";
import "./ApplicationHeader.less";

/**
 * Application header that is permanently visible at the top of the screen. Shows the
 * title of the currently open study book, the page numbers and a progress bar.
 */
export class ApplicationHeader extends Tonic {
    render() {
        return this.html`
            <progress-bar></progress-bar>

            <div class="main-area">
                <book-title></book-title>
                <page-numbers></page-numbers>
            </div>
        `;
    }
}

Tonic.add(ApplicationHeader);