<!--
@component
Application header that is permanently visible at the top of the screen. Shows the
title of the currently open study book, the page numbers and a progress bar.
-->
<script lang="ts">
    import BookTitle     from "./BookTitle.svelte";
    import PageNumbers   from "./PageNumbers.svelte";
    import ProgressBar   from "./ProgressBar.svelte";
    import SimpleButton  from "../basic/SimpleButton.svelte";
    
    import {title}       from "../../stores/book.js";
    import {currentPage} from "../../stores/book.js";
    import {totalPages}  from "../../stores/book.js";
    import {i18n}        from "../../stores/i18n.js";
    import {languages}   from "../../stores/i18n.js";
    import {language}    from "../../stores/i18n.js";
    
    let progress = $derived($currentPage / $totalPages);
</script>

<header>
    <ProgressBar {progress} />

    <div class="main-area">
        <BookTitle title={$title} />

        <div class="side-by-side">
            {#each languages as availableLanguage}
                <SimpleButton onclick={() => $language = availableLanguage} disabled={$language === availableLanguage}>
                    <span>{availableLanguage}</span>
                </SimpleButton>
            {/each}

            <a href="#/unknown-page" class="link">{$i18n.Error404.TriggerLink}</a>

            <PageNumbers currentPage={$currentPage} totalPages={$totalPages} />
        </div>
    </div>
</header>

<style>
    header {
        background: rgb(235, 235, 235);
    }

    .main-area {
        padding: 0.5em;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .side-by-side {
        display: flex;
        align-items: center;
        gap: 1em;
    }

    @media all and (width < 700px) {
        .side-by-side {
            flex-direction: column;
        }
    }
</style>