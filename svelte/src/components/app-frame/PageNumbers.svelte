<!--
Small component to display the current page number and total number of pages.
-->
<script lang="ts">
    export let currentPage = 0;
    export let totalPages  = 0;
</script>

<div>
    {currentPage} / {totalPages}
</div>