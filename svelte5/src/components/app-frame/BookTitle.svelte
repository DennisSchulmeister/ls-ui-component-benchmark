<!--
@component
Simple component to render the current book title.
-->
<script lang="ts">
    let {title = ""} = $props();
</script>

<div>{title}</div>

<style>
    div {
        font-family: "booktitle";
        font-weight: bold;
    }
</style>