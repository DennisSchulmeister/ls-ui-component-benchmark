import "./index.css";
import "./global.js";

import ApplicationFrame from "./components/ApplicationFrame.svelte";
import {mount}          from 'svelte';

mount(ApplicationFrame, {target: document.body});
