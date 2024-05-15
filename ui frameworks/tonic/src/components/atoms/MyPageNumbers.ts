import Tonic from "@socketsupply/tonic";
import "./MyPageNumbers.less";

/**
 * Small component to display the current page number and total number of pages.
 * Similar to this: 1 / 3
 */
export class MyPageNumbers extends Tonic {
    render() {
        return this.html``;
    }
}

Tonic.add(MyPageNumbers);