import Tonic from "@socketsupply/tonic";
import "./MyPagePreview.less";

type Properties = {
    page: number;
};

/**
 * Dummy component to simulate the display of a book page. Simply shows the
 * number of the current page prominently in the middle of the screen.
 */
export class MyPagePreview extends Tonic<Properties> {
    render() {
        return this.html`
            <div>${this.props.page.toString()}</div>
        `;
    }
}

Tonic.add(MyPagePreview);