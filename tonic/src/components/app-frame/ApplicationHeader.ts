import type { TonicTemplate }    from "@socketsupply/tonic";

import { TonicComponent }        from "../../utils/TonicComponent.js";
import { getApplicationFrame }   from "../ApplicationFrame.js";
import { ApplicationFrame }      from "../ApplicationFrame.js";
import { _ }                     from "../../utils/i18n.js";
import { getAvailableLanguages } from "../../utils/i18n.js";

import "./ApplicationHeader.css";

/**
 * Application header that is permanently visible at the top of the screen. Shows the
 * title of the currently open study book, the page numbers and a progress bar.
 */
export class ApplicationHeader extends TonicComponent {
    #app: ApplicationFrame = getApplicationFrame();

    render() {
        return this.html`
            <progress-bar></progress-bar>

            <div class="main-area">
                <book-title></book-title>

                <div class="side-by-side">
                    ${this.renderLanguageButtons()}
                    <a href="#/unknown-page" class="link">${_("404-Page/TriggerLink")}</a>
                    <page-numbers></page-numbers>
                </div>
            </div>
        `;
    }

    renderLanguageButtons(): TonicTemplate[] {
        let result = [];

        for (let languageCode of getAvailableLanguages()) {
            let disabled = "";
            if (languageCode == this.#app.language.value) disabled = "true";

            result.push(this.html`
                <simple-button attributes=${{dataLanguage: languageCode}} disabled=${disabled}>
                    <span>${languageCode}</span>
                </simple-button>
            `);
        }

        return result;
    }

    /**
     * Switch UI language
     */
    click(e: MouseEvent) {
        const button = TonicComponent.match(e.target, "[data-language]");
        if (!button) return;

        this.#app.language.value = button.dataset.language;
    }
}

TonicComponent.add(ApplicationHeader);