import Tonic from "@socketsupply/tonic";
import "./MyProgressBar.less";

/**
 * Progress bar the grows wider the more the current page reaches the end of the
 * currently open study book.
 */
export class MyProgressBar extends Tonic {
    render() {
        return this.html``;
    }
}

Tonic.add(MyProgressBar);