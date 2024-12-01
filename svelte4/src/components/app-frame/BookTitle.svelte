<!--
@component
Simple component to render the current book title.
-->
<script lang="ts">
    export let title = "";
</script>

<div>{title}</div>

<style>
    div {
        font-family: "booktitle";
        font-weight: bold;
    }
</style>