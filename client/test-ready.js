import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000';

async function getAuthToken() {
  const res = await fetch(`http://localhost:4000/api/auth/guest`, { method: 'POST' });
  const data = await res.json();
  return { token: data.token, user: data.user };
}

async function testReady() {
  console.log('Authenticating Host...');
  const hostAuth = await getAuthToken();
  const hostSocket = io(SOCKET_URL, { auth: { token: hostAuth.token } });

  let roomCode;

  hostSocket.on('connect', () => {
    console.log('Host connected. Creating room...');
    hostSocket.emit('room:create', { gameType: 'imposter', isPublic: true });
  });

  hostSocket.on('room:created', async (room) => {
    roomCode = room.roomCode;
    console.log('Room created:', roomCode);

    console.log('Authenticating Player...');
    const playerAuth = await getAuthToken();
    const playerSocket = io(SOCKET_URL, { auth: { token: playerAuth.token } });

    playerSocket.on('connect', () => {
      console.log('Player connected. Joining room...');
      playerSocket.emit('room:join', { roomCode });
    });

    hostSocket.on('room:state', (state) => {
      console.log('[HOST] Received room:state update:', state.players.map(p => ({ user: p.username, ready: p.isReady })));
      const host = state.players.find(p => p.userId === hostAuth.user.id);
      const hostCanStart = host?.isHost && state.players.filter(p => !p.isHost).every(p => p.isReady) && state.players.length >= 2;
      console.log('[HOST] Can Start?', hostCanStart);
      if (hostCanStart) {
        process.exit(0);
      }
    });

    let stateCount = 0;
    playerSocket.on('room:state', (state) => {
      stateCount++;
      console.log(`[PLAYER] Received room:state update #${stateCount}`);
      if (stateCount === 1) {
        console.log('Player sending ready...');
        playerSocket.emit('room:ready', { ready: true });
      }
    });
  });
}

testReady();
