<!--
@component
Dummy component to simulate the display of a book page. Simply shows the
number of the current page prominently in the middle of the screen.
-->
<script lang="ts">
    export let page = 1;
</script>

<div>{page}</div>

<style>
    div {
        font-family: 'display';
        font-size: 50vh;
    }
</style>