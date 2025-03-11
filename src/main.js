// OLD STYLE (Svelte 3/4):
// import App from './App.svelte';
// const app = new App({ target: document.getElementById('app') });
// export default app;

// NEW STYLE (Svelte 5):
import { mount } from 'svelte';
import App from './App.svelte';

// Get room ID from URL parameters if present
const urlParams = new URLSearchParams(window.location.search);
const roomIdFromUrl = urlParams.get('room');

// Pass initial data to the App component
const app = mount(App, { 
  target: document.getElementById('app'),
  props: {
    initialRoomId: roomIdFromUrl || ''
  }
});

export default app;