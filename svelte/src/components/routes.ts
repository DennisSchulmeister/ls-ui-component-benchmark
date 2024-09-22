import BookContentPage from "./pages/book-content/BookContentPage.svelte";
import NotFoundPage    from "./pages/errors/NotFoundPage.svelte";

export default {
    "/": BookContentPage,
    "*": NotFoundPage,
};