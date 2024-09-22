<script lang="ts">
    type parameters = {pageNumber?: number};
    export let params:parameters = {};

    $: pageNumber = params.pageNumber || 1;

    import {i18n, language} from "../../../i18n.js";
</script>

<div>
    <p>
        {$i18n.StudyBook.Title}
    </p>
    <p>
        Book page: {pageNumber}
    </p>

    <button on:click={() => $language = "de"}>de</button>
    <button on:click={() => $language = "en"}>en</button>
</div>

<style>
    p {
        color: blueviolet;
    }
</style>