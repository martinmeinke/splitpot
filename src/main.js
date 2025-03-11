// OLD STYLE (Svelte 3/4):
// import App from './App.svelte';
// const app = new App({ target: document.getElementById('app') });
// export default app;

// NEW STYLE (Svelte 5):
import { mount } from 'svelte';
import App from './App.svelte';

// No 'new' keyword in Svelte 5
const app = mount(App, { target: document.getElementById('app') });

export default app;