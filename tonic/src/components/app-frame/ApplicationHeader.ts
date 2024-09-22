import type { TonicTemplate } from "@socketsupply/tonic";
import { TonicComponent }     from "../../utils/TonicComponent.js";
import * as i18n              from "../../stores/i18n.js";

import "./ApplicationHeader.css";

/**
 * Application header that is permanently visible at the top of the screen. Shows the
 * title of the currently open study book, the page numbers and a progress bar.
 */
export class ApplicationHeader extends TonicComponent {
    render() {
        return this.html`
            <progress-bar></progress-bar>

            <div class="main-area">
                <book-title></book-title>

                <div class="side-by-side">
                    ${this.renderLanguageButtons()}
                    <a href="#/unknown-page" class="link">${i18n.i18n.Error404.TriggerLink}</a>
                    <page-numbers></page-numbers>
                </div>
            </div>
        `;
    }

    renderLanguageButtons(): TonicTemplate[] {
        let result = [];

        for (let language of i18n.languages) {
            let disabled = "";
            if (language == i18n.language.value) disabled = "true";

            result.push(this.html`
                <simple-button attributes=${{dataLanguage: language}} disabled=${disabled}>
                    <span>${language}</span>
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

        i18n.language.value = button.dataset.language;
    }
}

TonicComponent.add(ApplicationHeader);