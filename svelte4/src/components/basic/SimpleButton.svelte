<!--
@component
A simple button component. Renders a simple styled button.
-->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    type ButtonType = "" | "primary";

    export let type:ButtonType   = "";
    export let disabled:boolean  = false;
    export let attributes:object = {};

    function handleClick(event: MouseEvent) {
        if (!disabled) dispatch("click", event);
    }
</script>

<button
    class:primary  = {type === "primary"}
    class:disabled = {disabled}
    on:click       = {handleClick}
    {...attributes}
>
    <slot></slot>
</button>

<style>
    :global(:root) {
        /* Regular button */
        --simple-button-normal-background:   rgb(220, 220, 220);
        --simple-button-normal-color:        rgb(107, 107, 107);
        --simple-button-hover-background:    rgb(235, 235, 235);
        --simple-button-disabled-background: rgb(230, 230, 230);
        --simple-button-disabled-color:      rgb(170, 170, 170);
    }

    button {
        border:        none;
        padding:       1em;
        border-radius: 0.5em;

        background:    var(--simple-button-normal-background);
        color:         var(--simple-button-normal-color);
    }

    button:hover {
        background: var(--simple-button-hover-background);
        cursor:     pointer;
    }

    button.disabled,
    button.disabled:hover {
        background: var(--simple-button-disabled-background);
        color:      var(--simple-button-disabled-color);
        cursor:     not-allowed;
    }

    /* Primary button */
    button.primary {
        --simple-button-normal-background:   rgb(14, 111, 180);
        --simple-button-normal-color:        rgb(255, 255, 255);
        --simple-button-hover-background:    rgb(70, 162, 227);
        --simple-button-disabled-background: rgb(136, 161, 180);
        --simple-button-disabled-color:      rgb(72, 96, 117);
    }
</style>