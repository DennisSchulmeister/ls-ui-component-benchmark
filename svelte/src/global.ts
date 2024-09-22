import * as i18n from "./i18n.js";

declare global {
    interface Window {
        /**
         * Public exports for usage in the study books
         */
        StudyBook: {
            /**
             * Get translated texts or customize the translations
             */
            i18n: typeof i18n;
        }
    }
}

window.StudyBook = {i18n};