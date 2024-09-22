<script lang="ts">
    type parameters = {pageNumber?: number};
    export let params:parameters = {};

    $: pageNumber = params.pageNumber || 1;
</script>
<p>
    Book page: {pageNumber}
</p>

<style>
    p {
        color: blueviolet;
    }
</style>