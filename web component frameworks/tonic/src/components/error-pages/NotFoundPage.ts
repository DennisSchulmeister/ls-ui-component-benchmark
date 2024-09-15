import { TonicComponent } from "../../utils/TonicComponent.js";
import { _ }              from "../../utils/i18n.js";

import "./NotFoundPage.less";

type NotFoundPageProperties = {
    url: string;
};

/**
 * Simple 404 not found page
 */
export class NotFoundPage extends TonicComponent<NotFoundPageProperties> {
    render() {
        return this.html`
            <h1>${_("404-Page/Title")}</h1>
            <p>
                ${this.html(_("404-Page/Message1", this.props))}
            </p>
            <p>
                ${this.html(_("404-Page/Message2"))}
            </p>
            <img src="img/page-not-found.png" alt="">
        `;
    }
}

TonicComponent.add(NotFoundPage);