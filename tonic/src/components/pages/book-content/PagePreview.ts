import { TonicComponent } from "../../../utils/TonicComponent.js";
import "./PagePreview.css";

type PagePreviewProperties = {
    page: string;
};

/**
 * Dummy component to simulate the display of a book page. Simply shows the
 * number of the current page prominently in the middle of the screen.
 */
export class PagePreview extends TonicComponent<PagePreviewProperties> {
    render() {
        return this.html`
            <div>${this.props.page}</div>
        `;
    }
}

TonicComponent.add(PagePreview);