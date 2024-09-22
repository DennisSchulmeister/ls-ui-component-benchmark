import {Observable} from "../utils/observable.js";
import {i18n}       from "./i18n.js";

export const title       = new Observable<string>(i18n.StudyBook.Title);
export const currentPage = new Observable<number>(1);
export const totalPages  = new Observable<number>(10);

/**
 * Go to the given study book page and update URL accordingly. Can either be called
 * from anywhere in the app to change the current page or from the SPA router to call
 * up the page from the current URL.
 */
export function gotoPage(page: any) {
    let pageNumber = parseInt(page);
    let pageUrl    = `#/book/page/${page}`;

    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages.value) {
        console.error(`Unknown page: ${page}`);
        return;
    }

    if (location.hash !== pageUrl) location.hash = pageUrl;
    if (currentPage.value !== pageNumber) currentPage.value = pageNumber;
}

/**
 * Navigate to the next study book page.
 */
export function gotoNextPage() {
    if (currentPage.value < totalPages.value) {
        gotoPage(currentPage.value + 1);
    }
}

/**
 * Navigate to the previous study book page.
 */
export function gotoPreviousPage() {
    if (currentPage.value > 1) {
        gotoPage(currentPage.value - 1);
    }
}
