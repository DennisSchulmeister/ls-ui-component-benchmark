<!--
Root component of the application. It defines a very basic UI for this practical test,
consisting of an application header, a page preview and two buttons to navigate within
the simulated currently open study book.
-->
<script lang="ts">
    import ApplicationHeader from "./app-frame/ApplicationHeader.svelte";
    import Router            from 'svelte-spa-router'
    import routes            from "./routes.js";
</script>

<ApplicationHeader />

<main>
    <Router {routes} />
</main>

<style>
    main {
        flex: 1;

        display: flex;
        flex-direction: column;
    }
</style>