<!--
@component
Main content area component to render the currently visible page of a study book.
Also handles keyboard shortcuts to navigate between pages.
-->
<script lang="ts">
    import PagePreview   from "./PagePreview.svelte";
    import SimpleButton  from "../../basic/SimpleButton.svelte";

    import {i18n}        from "../../../stores/i18n.js";
    import {currentPage} from "../../../stores/book.js";
    import {totalPages}  from "../../../stores/book.js";

    /**
     * Handle keyboard navigation
     */
    function onKeyUp(e: KeyboardEvent) {
        if (e.target !== document.body) return;

        switch (e.key) {
            case "ArrowRight":
            case "Enter":
            case " ":
                currentPage.next();
                break;
            case "ArrowLeft":
                currentPage.prev();
                break;
        }
    }
</script>

<svelte:window onkeyup={onKeyUp} />

<div class="book-content-page">
    <div class="main-area">
        <PagePreview page={$currentPage} />
    </div>
    
    <div class="button-row">
        <SimpleButton type="primary" disabled={$currentPage <= 1} onclick={currentPage.prev}>
            {$i18n.BookContentPage.Button.Prev}
        </SimpleButton>

        <SimpleButton type="primary" disabled={$currentPage >= $totalPages} onclick={currentPage.next}>
            {$i18n.BookContentPage.Button.Next}
        </SimpleButton>
    </div>
</div>

<style>
    .book-content-page {
        /* Fill complete main area */
        flex: 1;
        align-self: stretch;

        /* Center content on screen */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        margin: 2em;
    }

    .main-area {
        flex: 1;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .button-row {
        align-self: stretch;
        display: flex;
        justify-content: space-between;
    }
</style>