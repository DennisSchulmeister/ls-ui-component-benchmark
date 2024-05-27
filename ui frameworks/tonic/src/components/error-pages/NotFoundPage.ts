import { TonicComponent } from "../../TonicComponent.js";
import "./NotFoundPage.less";

type Properties = {
    url: string;
};

/**
 * Simple 404 not found page
 */
export class NotFoundPage extends TonicComponent<Properties> {
    render() {
        return this.html`
            <h1>Page not found</h1>
            <p>
                We are terribly sorry, but the requested page <b>${this.props.url}</b> cannot be found.
            </p>
            <p>
                Maybe go back to the <a href="#/">home page</a> and grab some other cheese, instead?
            </p>
            <img src="img/page-not-found.png" alt="">
        `;
    }
}

TonicComponent.add(NotFoundPage);