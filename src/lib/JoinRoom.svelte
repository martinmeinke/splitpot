<script>
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher();
  
  // Get the initial roomId from URL parameter passed from App.svelte
  const { initialRoomId } = $props();
  
  // State variables using Svelte 5 runes
  let roomId = $state(initialRoomId || '');
  let userName = $state('');
  let error = $state('');

  function handleSubmit() {
    error = '';
    
    if (!roomId.trim()) {
      error = 'Room ID is required';
      return;
    }
    
    if (!userName.trim()) {
      error = 'Your name is required';
      return;
    }
    
    dispatch('join', { roomId, userName });
  }

  function generateRandomRoomId() {
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    roomId = randomId;
  }
</script>

<div class="row justify-content-center">
  <div class="col-md-6">
    <div class="card shadow">
      <div class="card-header bg-primary text-white">
        <h5 class="card-title mb-0">Join a Poker Room</h5>
      </div>
      <div class="card-body">
        {#if error}
          <div class="alert alert-danger">
            {error}
          </div>
        {/if}
        
        <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div class="mb-3">
            <label for="roomId" class="form-label">Room ID</label>
            <div class="input-group">
              <input 
                type="text" 
                class="form-control" 
                id="roomId" 
                bind:value={roomId} 
                placeholder="Enter room ID" 
                required
              />
              <button type="button" class="btn btn-outline-secondary" onclick={generateRandomRoomId}>
                Generate
              </button>
            </div>
            <div class="form-text">Enter an existing room ID or create a new one.</div>
          </div>
          
          <div class="mb-3">
            <label for="userName" class="form-label">Your Name</label>
            <input 
              type="text" 
              class="form-control" 
              id="userName" 
              bind:value={userName} 
              placeholder="Enter your name" 
              required
            />
          </div>
          
          <button type="submit" class="btn btn-primary w-100">
            Join Room
          </button>
        </form>
      </div>
    </div>
  </div>
</div>