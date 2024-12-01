import {derived}  from "svelte/store";
import {writable} from "svelte/store";
import {readable} from "svelte/store";
import {get}      from "svelte/store";
import {i18n}     from "./i18n.js";

/**
 * Title of the current study book. In this dummy implementation this is
 * just a translated dummy title that changes each time the current language
 * is changed.
 */
export const title = derived(i18n, $i18n => $i18n.StudyBook.Title);

/**
 * Total number of book pages.
 */
export const totalPages = readable(10);

const _currentPage = writable(1);

/**
 * The current book page. Also contains methods to go to another page or
 * go to the previous or next page.
 */
export const currentPage = {
    subscribe: _currentPage.subscribe,
    set:       _currentPage.set,
    update:    _currentPage.update,

    get value() {
        return get(_currentPage);
    },

    set value(value) {
        _currentPage.set(value);
    },

    /**
     * Go to the given study book page by changing the URL accordingly.
     * @param page New page number
     */
    goto(page: any) {
        let pageNumber = parseInt(page);
        let pageUrl    = `#/book/page/${page}`;
    
        if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > get(totalPages)) {
            console.error(`Unknown page: ${page}`);
            return;
        }
    
        if (location.hash !== pageUrl) location.hash = pageUrl;
    },

    /**
     * Navigate to the next study book page.
     */
    next() {
        let page = this.value + 1;
        if (page <= get(totalPages)) this.goto(page);
    },

    /**
     * Navigate to the previous study book page.
     */
    prev() {
        let page = this.value - 1;
        if (page >= 1) this.goto(page);
    },
};

currentPage.goto = currentPage.goto.bind(currentPage);
currentPage.next = currentPage.next.bind(currentPage);
currentPage.prev = currentPage.prev.bind(currentPage);