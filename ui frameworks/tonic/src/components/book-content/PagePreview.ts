import Tonic from "@socketsupply/tonic";
import "./PagePreview.less";

type Properties = {
    page: number;
};

/**
 * Dummy component to simulate the display of a book page. Simply shows the
 * number of the current page prominently in the middle of the screen.
 */
export class PagePreview extends Tonic<Properties> {
    render() {
        return this.html`
            <div>${this.props.page.toString()}</div>
        `;
    }
}

Tonic.add(PagePreview);