<!--
Progress bar that grows wider the more the current page reaches the end of the
currently open study book.
-->
<script lang="ts">
    export let progress = 0.0;
    $: width = `${100 * progress}%`;
</script>

<div class="indicator" style:width={width}></div>

<style>
    .indicator {
        height: 3px;
        background-color: rgb(154, 190, 228);
        transition: width 0.5s;
    }
</style>