import { TonicComponent } from "../../TonicComponent.js";
import "./PagePreview.less";

type Properties = {
    page: number;
};

/**
 * Dummy component to simulate the display of a book page. Simply shows the
 * number of the current page prominently in the middle of the screen.
 */
export class PagePreview extends TonicComponent<Properties> {
    render() {
        return this.html`
            <div>${this.props.page.toString()}</div>
        `;
    }
}

TonicComponent.add(PagePreview);