<script>
  import { onMount, onDestroy } from "svelte";
  import { io } from "socket.io-client";
  import JoinRoom from "./lib/JoinRoom.svelte";
  import PokerRoom from "./lib/PokerRoom.svelte";

  // Get the initialRoomId prop from main.js (URL parameter)
  const { initialRoomId } = $props();

  // Reactive state using Svelte 5 Runes
  let socket = $state(null);
  let connected = $state(false);
  let connectionError = $state("");
  let roomId = $state("");
  let userName = $state("");
  let inRoom = $state(false);
  let room = $state({
    users: [],
    revealed: false,
  });

  // State to pass to JoinRoom component
  let joinRoomId = $state(initialRoomId || "");

  // Card values
  const cardValues = ["1", "2", "3", "5", "8", "13", "21", "34", "?"];

  function connectSocket() {
    // Make sure to disconnect any existing connection
    if (socket) {
      socket.disconnect();
    }

    console.log("Attempting to connect to Socket.io server...");
    connectionError = "";

    // More resilient backend URL handling
    let backendUrl;

    if (import.meta.env.PROD) {
      // In production, use the explicit backend URL or fall back to default
      backendUrl =
        import.meta.env.VITE_BACKEND_URL || "https://splitpot.fly.dev";
    } else {
      // In development, use the Vite proxy
      backendUrl = "/";
    }

    console.log("Environment:", import.meta.env.MODE);
    console.log("Connecting to backend:", backendUrl);

    // Create connection to the backend
    socket = io(backendUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    socket.on("connect", () => {
      connected = true;
      connectionError = "";
      console.log("Connected to server!", socket.id);
    });

    socket.on("connect_error", (error) => {
      connected = false;
      connectionError = `Connection error: ${error.message}`;
      console.error("Connection error:", error);
    });

    socket.on("connect_timeout", () => {
      connected = false;
      connectionError = "Connection timeout";
      console.error("Connection timeout");
    });

    socket.on("updateRoom", (updatedRoom) => {
      room = updatedRoom;
      console.log("Room updated:", updatedRoom);
    });

    socket.on("disconnect", () => {
      connected = false;
      inRoom = false;
      console.log("Disconnected from server");
    });
  }

  onMount(() => {
    connectSocket();
  });

  onDestroy(() => {
    if (socket) {
      socket.disconnect();
    }
  });

  function joinRoom(event) {
    roomId = event.detail.roomId;
    userName = event.detail.userName;

    socket.emit("joinRoom", { roomId, userName });
    inRoom = true;
  }

  function submitVote(vote) {
    socket.emit("submitVote", { roomId, vote });
  }

  function revealVotes() {
    socket.emit("revealVotes", roomId);
  }

  function resetVotes() {
    socket.emit("resetVotes", roomId);
  }

  function leaveRoom() {
    inRoom = false;
    roomId = "";
    userName = "";
  }
</script>

<main class="container py-4">
  <h1 class="text-center mb-4">Split Pot</h1>

  {#if !connected}
    <div class="alert alert-warning text-center">
      Connecting to server...
      {#if connectionError}
        <div class="mt-2 text-danger">
          {connectionError}
          <button class="btn btn-sm btn-primary mt-2" onclick={connectSocket}
            >Try Again</button
          >
        </div>
      {/if}
    </div>
  {:else if !inRoom}
    <JoinRoom on:join={joinRoom} initialRoomId={joinRoomId} />
  {:else}
    <PokerRoom
      {room}
      {userName}
      {roomId}
      {cardValues}
      on:vote={(e) => submitVote(e.detail)}
      on:reveal={revealVotes}
      on:reset={resetVotes}
      on:leave={leaveRoom}
    />
  {/if}

  <div class="text-center mt-4">
    <a href="https://github.com/martinmeinke/splitpot" target="_blank">
      <img
        src="https://img.shields.io/github/stars/martinmeinke/splitpot?style=social"
        alt="GitHub Repo"
      />
    </a>
  </div>
</main>
