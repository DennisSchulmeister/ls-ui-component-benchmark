import { TonicComponent } from "../../../utils/TonicComponent.js";
import { i18n }           from "../../../stores/i18n.js";
import { _ }              from "../../../stores/i18n.js";

import "./NotFoundPage.css";

type NotFoundPageProperties = {
    url: string;
};

/**
 * Simple 404 not found page
 */
export class NotFoundPage extends TonicComponent<NotFoundPageProperties> {
    render() {
        return this.html`
            <h1>${i18n.Error404.Title}</h1>
            <p>
                ${this.html(_(i18n.Error404.Message1, this.props))}
            </p>
            <p>
                ${this.html(i18n.Error404.Message2)}
            </p>
            <img src="page-not-found.png" alt="">
        `;
    }
}

TonicComponent.add(NotFoundPage);
