<script>
  import { createEventDispatcher } from 'svelte';
  
  const { room, userName, roomId, cardValues } = $props();
  
  const dispatch = createEventDispatcher();
  
  // State using Svelte 5 runes
  let selectedValue = $state(null);
  
  // Derived state using Svelte 5 syntax
  let currentUser = $derived(room.users.find(user => user.name === userName));
  let hasVoted = $derived(currentUser && currentUser.vote !== null);
  let allVoted = $derived(room.users.length > 0 && room.users.every(user => user.vote !== null));
  let averageVote = $derived(calculateAverage());
  
  // Watch for changes to room.revealed, reset selectedValue when votes are reset
  $effect(() => {
    // If votes are reset (revealed changes from true to false)
    if (!room.revealed) {
      // Reset the selected card in the UI
      selectedValue = null;
    }
  });
  
  function calculateAverage() {
    if (!room.revealed || room.users.length === 0) return null;
    
    const numericVotes = room.users
      .map(user => user.vote)
      .filter(vote => !isNaN(parseInt(vote)));
    
    if (numericVotes.length === 0) return null;
    
    const sum = numericVotes.reduce((total, vote) => total + parseInt(vote), 0);
    return (sum / numericVotes.length).toFixed(1);
  }
  
  function selectCard(value) {
    if (room.revealed) return;
    
    if (selectedValue === value) {
      selectedValue = null;
      dispatch('vote', null);
    } else {
      selectedValue = value;
      dispatch('vote', value);
    }
  }
</script>

<div class="row">
  <div class="col-md-12">
    <div class="card shadow mb-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-0">Room: {roomId}</h5>
          <small>Participants: {room.users.length}</small>
        </div>
        <div>
          <button class="btn btn-outline-danger btn-sm" onclick={() => dispatch('leave')}>
            Leave Room
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="mb-4 text-center">
          <h6>Select your story point estimate:</h6>
          <div class="d-flex flex-wrap justify-content-center my-3">
            {#each cardValues as value}
              <button 
                type="button"
                class="poker-card bg-white border {selectedValue === value ? 'card-selected' : ''}"
                onclick={() => selectCard(value)}
                onkeydown={(e) => e.key === 'Enter' && selectCard(value)}
              >
                {value}
              </button>
            {/each}
          </div>
          
          <div class="mb-3">
            <button 
              class="btn btn-primary me-2" 
              onclick={() => {
                dispatch('reveal');
              }}
              disabled={room.revealed}
            >
              Reveal Votes
            </button>
            <button 
              class="btn btn-secondary" 
              onclick={() => {
                dispatch('reset');
              }}
              disabled={!room.revealed}
            >
              Reset Votes
            </button>
          </div>
        </div>
        
        <hr>
        
        <div class="row">
          <div class="col-md-12">
            <h6>Participants:</h6>
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th class="text-center">Vote</th>
                  </tr>
                </thead>
                <tbody>
                  {#each room.users as user}
                    <tr>
                      <td>{user.name} {user.name === userName ? '(You)' : ''}</td>
                      <td class="text-center">
                        {#if user.vote !== null}
                          {#if room.revealed}
                            <span class="badge bg-success">{user.vote}</span>
                          {:else}
                            <span class="badge bg-secondary">Voted</span>
                          {/if}
                        {:else}
                          <span class="badge bg-light text-dark">Not voted</span>
                        {/if}
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {#if room.revealed && averageVote !== null}
          <div class="alert alert-info mt-3">
            <strong>Average vote: {averageVote}</strong>
          </div>
        {/if}
        
        {#if allVoted && !room.revealed}
          <div class="alert alert-success mt-3">
            Everyone has voted! You can now reveal the votes.
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>