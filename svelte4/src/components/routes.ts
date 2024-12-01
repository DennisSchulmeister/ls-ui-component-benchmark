import type {RouteDetail} from "svelte-spa-router";

import {wrap}             from "svelte-spa-router/wrap";
import BookContentPage    from "./pages/book-content/BookContentPage.svelte";
import NotFoundPage       from "./pages/errors/NotFoundPage.svelte";
import {currentPage}      from "../stores/book.js";

/**
 * Update page number in the global store before the router renters the
 * next page. This makes sure that all components, not just the one chosen
 * by the router, receive the updated page number.
 */
function setPageNumber(detail:RouteDetail): boolean {
    let page = parseInt(detail?.params?.pageNumber || "1");
    currentPage.set(page);
    return true;
}

export default {
    "/": wrap({
        component: BookContentPage,
        conditions: [setPageNumber],
    }),
    
    "/book/page/:pageNumber": wrap({
        component: BookContentPage,
        conditions: [setPageNumber],
    }),

    "*": NotFoundPage,
};