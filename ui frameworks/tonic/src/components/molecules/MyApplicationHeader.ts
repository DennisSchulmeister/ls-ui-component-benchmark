import Tonic from "@socketsupply/tonic";
import "./MyApplicationHeader.less";

/**
 * Application header that is permanently visible at the top of the screen. Shows the
 * title of the currently open study book, the page numbers and a progress bar.
 */
export class MyApplicationHeader extends Tonic {
    render() {
        return this.html``;
    }
}

Tonic.add(MyApplicationHeader);