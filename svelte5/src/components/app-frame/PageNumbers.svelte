<!--
@component
Small component to display the current page number and total number of pages.
-->
<script lang="ts">
    let {currentPage = 0, totalPages = 0} = $props();
</script>

<div>
    {currentPage} / {totalPages}
</div>