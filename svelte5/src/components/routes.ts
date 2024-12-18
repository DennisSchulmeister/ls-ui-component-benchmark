import type {RouteDetail} from "svelte-spa-router";

import {wrap}             from "svelte-spa-router/wrap";
import BookContentPage    from "./pages/book-content/BookContentPage.svelte";
import NotFoundPage       from "./pages/errors/NotFoundPage.svelte";
import {currentPage}      from "../stores/book.js";

/**
 * Update page number in the global store before the router renders the
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
        // @ts-ignore: Temporary silence type error, until svelte-spa-router adds official Svelte 5 support.
        // Issue: https://github.com/ItalyPaleAle/svelte-spa-router/issues/318
        component: BookContentPage,
        conditions: [setPageNumber],
    }),
    
    "/book/page/:pageNumber": wrap({
        // @ts-ignore: Temporary silence type error, until svelte-spa-router adds official Svelte 5 support.
        // Issue: https://github.com/ItalyPaleAle/svelte-spa-router/issues/318
        component: BookContentPage,
        conditions: [setPageNumber],
    }),

    "*": NotFoundPage,
};
