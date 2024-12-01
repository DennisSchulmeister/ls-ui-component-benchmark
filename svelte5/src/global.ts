import * as i18n from "./stores/i18n.js";
import * as book from "./stores/book.js";

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

            /**
             * Get information about and control display of the current study book
             */
            book: typeof book;
        }
    }
}

window.StudyBook = {i18n, book};