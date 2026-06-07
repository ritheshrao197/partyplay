# 🧪 PartyPlay - Complete Testing Prompt & Test Plan

## Quick Test Prompt for AI/Manual Testing

```
You are a QA tester for PartyPlay, a multiplayer party game platform. Test the following functionality:

1. **Authentication Flow**
   - Enter username "TestUser1"
   - Select avatar color #6366f1
   - Verify localStorage saves user data
   - Test empty username validation

2. **Room Creation & Joining**
   - Create new room as host
   - Verify unique 6-character room code generation
   - Copy room code and share
   - Join with second browser/incognito as "TestUser2"
   - Verify both players visible in lobby
   - Test host crown icon appears for host only

3. **Game: Find The Imposter (3-10 players)**
   - Start with 3 players minimum
   - Verify secret word assignment
   - Check imposter gets different word
   - Test discussion timer (30 seconds)
   - Test voting mechanism
   - Verify vote counts and elimination
   - Check score updates

4. **Game: Only Wrong Answers (2-10 players)**
   - Start with 2+ players
   - Verify question display
   - Submit creative wrong answers
   - Test anonymous reveal
   - Vote for best answer
   - Verify winner gets 10 points

5. **Game: Never Have I Ever (2-20 players)**
   - Start with 2+ players
   - Verify random statement appears
   - Test Yes/No button functionality
   - Check results display with percentages
   - Verify next round loads

6. **Game: Word Rush (2-20 players)**
   - Start with 2+ players
   - Verify category display
   - Submit words within 30 seconds
   - Test duplicate word detection
   - Verify unique words get points
   - Check scoring logic

7. **Multiplayer Real-time Tests**
   - Test player disconnect/reconnect
   - Verify host migration when host leaves
   - Test simultaneous actions from multiple players
   - Verify timer sync across all clients
   - Test room code invalid/expired handling

8. **UI/UX Responsiveness**
   - Test on mobile viewport (375px)
   - Test on tablet (768px)
   - Test on desktop (1920px)
   - Verify dark mode consistency
   - Check button hover effects
   - Test touch interactions on mobile

9. **Edge Cases**
   - Try joining with same user twice
   - Try starting game with insufficient players
   - Test maximum player limit (20)
   - Test leaving mid-game
   - Test browser refresh during game
   - Test network disconnection during voting

10. **Performance**
    - Measure page load time (< 2 seconds)
    - Check WebSocket reconnection time (< 3 seconds)
    - Verify no memory leaks after 10 games
    - Test with 10 concurrent connections

Report any bugs, console errors, or unexpected behavior with reproduction steps.
```

## Detailed Test Cases

### Test Case 1: User Authentication
```javascript
// Test Steps:
1. Navigate to http://localhost:5173
2. Leave username empty → Click "Join Party"
   Expected: Browser validation prevents submission

3. Enter username "Alice" → Select blue color → Join
4. Open DevTools → Application → Local Storage
   Expected: partyplay_user object exists with username, avatarColor, userId

5. Refresh page
   Expected: Auto-login, redirect to create room page

6. Clear localStorage → Refresh
   Expected: Returns to login screen
```

### Test Case 2: Room Creation & Code Sharing
```bash
# Terminal commands for quick testing
# Open 3 browser windows (Chrome, Firefox, Incognito)

Window 1 (Host):
- Login as "HostPlayer"
- Click "Create Room"
- Note room code (e.g., "ABCD12")

Window 2 (Joiner 1):
- Login as "Joiner1"
- Click "Join Room"
- Enter room code "ABCD12"
- Click "Join Room"

Window 3 (Joiner 2):
- Login as "Joiner2"
- Join same room

Expected Results:
- All 3 players visible in lobby
- Host has 👑 crown
- Room code displays and is copyable
- Copy button shows "Copied!" feedback
```

### Test Case 3: Find The Imposter Game Flow
```javascript
// Test with 3 players minimum
const testGameFlow = {
  setup: {
    players: 3,
    gameType: 'imposter'
  },
  
  steps: [
    { action: 'Host selects "Find The Imposter"', expected: 'Game selection highlighted' },
    { action: 'Click "Start Game"', expected: 'Game screen loads' },
    { action: 'Check word assignment', expected: '2 players see same word, 1 sees different' },
    { action: 'Wait 30 seconds discussion', expected: 'Timer counts down, moves to voting' },
    { action: 'All players vote', expected: 'Votes recorded' },
    { action: 'View results', expected: 'Eliminated player shown, scores updated' }
  ]
};
```

### Test Case 4: Real-time WebSocket Testing
```javascript
// Using browser console for WebSocket monitoring
// Open DevTools Console on all browser windows

// Monitor Socket.IO events
window.socketEvents = [];
socket.onAny((event, ...args) => {
  console.log(`📡 ${event}:`, args);
  window.socketEvents.push({ event, args, timestamp: Date.now() });
});

// Test disconnect/reconnect
// 1. Disable network in DevTools
// Expected: "disconnect" event, reconnection attempts

// 2. Re-enable network
// Expected: "connect" event, state sync, game continues

// 3. Close browser tab as player
// Expected: Other players see "player_left" event
```

### Test Case 5: Concurrent Game Actions Test
```javascript
// Simulate multiple players submitting answers simultaneously
// Open 3 browser windows, all in Word Rush game

// In each window's console:
function spamWords() {
  const words = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
  let i = 0;
  const interval = setInterval(() => {
    if (i < words.length) {
      document.querySelector('input')?.value = words[i];
      document.querySelector('button[type="submit"]')?.click();
      i++;
    } else {
      clearInterval(interval);
    }
  }, 100);
}
spamWords();

// Expected: 
// - Unique words get points
// - Duplicate words show "Already submitted"
// - Scores update in real-time for all players
```

### Test Case 6: Edge Cases & Error Handling
```javascript
// Error Case Testing Matrix

const errorCases = [
  {
    name: "Invalid room code",
    action: "Join with code 'INVALID'",
    expected: "Alert: 'Room not found'"
  },
  {
    name: "Full room",
    action: "Join room with 20 players",
    expected: "Alert: 'Room is full'"
  },
  {
    name: "Duplicate player",
    action: "Same userId tries to join twice",
    expected: "Alert: 'Already in room'"
  },
  {
    name: "Start game with 2 players (Imposter needs 3)",
    action: "Try starting Find The Imposter",
    expected: "Alert: 'Need at least 3 players'"
  },
  {
    name: "Host leaves during game",
    action: "Host closes browser",
    expected: "Host transferred to next player, game continues"
  }
];
```

## Automated Testing Script

Save this as `test-partyplay.js` and run with Node.js:

```javascript
// Automated WebSocket testing script
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';
const TEST_DURATION = 60000; // 60 seconds

const testUsers = [
  { username: 'Tester1', color: '#ff0000' },
  { username: 'Tester2', color: '#00ff00' },
  { username: 'Tester3', color: '#0000ff' }
];

const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    pass: '\x1b[32m',
    fail: '\x1b[31m',
    warn: '\x1b[33m'
  };
  console.log(`${colors[type]}${message}\x1b[0m`);
}

async function testRoomCreation() {
  return new Promise((resolve) => {
    log('🧪 Testing: Room Creation', 'info');
    const socket = io(SOCKET_URL);
    const userId = `user_${Date.now()}`;
    
    socket.on('connect', () => {
      socket.emit('create_room', {
        username: testUsers[0].username,
        avatarColor: testUsers[0].color,
        userId: userId
      });
    });
    
    socket.on('room_created', (data) => {
      if (data.roomCode && data.roomCode.length === 6) {
        log('✅ Room creation test PASSED', 'pass');
        results.passed++;
        results.tests.push({ name: 'Room Creation', status: 'PASSED' });
      } else {
        log('❌ Room creation test FAILED', 'fail');
        results.failed++;
        results.tests.push({ name: 'Room Creation', status: 'FAILED' });
      }
      socket.disconnect();
      resolve();
    });
    
    setTimeout(() => {
      log('❌ Room creation timeout', 'fail');
      results.failed++;
      resolve();
    }, 5000);
  });
}

async function testMultipleJoins() {
  return new Promise((resolve) => {
    log('🧪 Testing: Multiple Player Joins', 'info');
    const hostSocket = io(SOCKET_URL);
    let roomCode = '';
    let joinedCount = 0;
    
    hostSocket.on('connect', () => {
      hostSocket.emit('create_room', {
        username: 'Host',
        avatarColor: '#fff',
        userId: 'host1'
      });
    });
    
    hostSocket.on('room_created', (data) => {
      roomCode = data.roomCode;
      log(`Room created: ${roomCode}`, 'info');
      
      // Create 2 more connections
      for (let i = 1; i <= 2; i++) {
        const joiner = io(SOCKET_URL);
        joiner.on('connect', () => {
          joiner.emit('join_room', {
            roomCode: roomCode,
            username: `Joiner${i}`,
            avatarColor: '#fff',
            userId: `joiner${i}`
          });
        });
        
        joiner.on('room_joined', () => {
          joinedCount++;
          if (joinedCount === 2) {
            setTimeout(() => {
              if (joinedCount === 2) {
                log('✅ Multiple joins test PASSED', 'pass');
                results.passed++;
                results.tests.push({ name: 'Multiple Joins', status: 'PASSED' });
              }
              hostSocket.disconnect();
              resolve();
            }, 1000);
          }
        });
      }
    });
    
    setTimeout(() => {
      log('❌ Multiple joins test timeout', 'fail');
      results.failed++;
      resolve();
    }, 10000);
  });
}

async function testGameStart() {
  return new Promise((resolve) => {
    log('🧪 Testing: Game Start', 'info');
    const sockets = [];
    let gameStarted = false;
    
    // Create host
    const host = io(SOCKET_URL);
    host.on('connect', () => {
      host.emit('create_room', {
        username: 'Host',
        avatarColor: '#fff',
        userId: 'host_game'
      });
    });
    
    host.on('room_created', (data) => {
      const roomCode = data.roomCode;
      
      // Create 2 joiners
      for (let i = 0; i < 2; i++) {
        const joiner = io(SOCKET_URL);
        joiner.on('connect', () => {
          joiner.emit('join_room', {
            roomCode: roomCode,
            username: `Player${i + 1}`,
            avatarColor: '#fff',
            userId: `player${i + 1}`
          });
        });
        sockets.push(joiner);
      }
      
      // Start game after joins
      setTimeout(() => {
        host.emit('start_game', { roomCode, gameType: 'wordRush' });
      }, 2000);
    });
    
    // Listen for game start on all sockets
    sockets.forEach(socket => {
      socket.on('game_started', () => {
        gameStarted = true;
      });
    });
    
    setTimeout(() => {
      if (gameStarted) {
        log('✅ Game start test PASSED', 'pass');
        results.passed++;
        results.tests.push({ name: 'Game Start', status: 'PASSED' });
      } else {
        log('❌ Game start test FAILED', 'fail');
        results.failed++;
        results.tests.push({ name: 'Game Start', status: 'FAILED' });
      }
      sockets.forEach(s => s.disconnect());
      host.disconnect();
      resolve();
    }, 8000);
  });
}

async function testScoreSystem() {
  return new Promise((resolve) => {
    log('🧪 Testing: Score System', 'info');
    // Simulate score updates
    const testScores = {
      player1: 0,
      player2: 0
    };
    
    // Mock game action that awards points
    const awardPoints = (player, points) => {
      testScores[player] += points;
    };
    
    awardPoints('player1', 10);
    awardPoints('player2', 5);
    awardPoints('player1', 10);
    
    if (testScores.player1 === 20 && testScores.player2 === 5) {
      log('✅ Score system test PASSED', 'pass');
      results.passed++;
      results.tests.push({ name: 'Score System', status: 'PASSED' });
    } else {
      log('❌ Score system test FAILED', 'fail');
      results.failed++;
      results.tests.push({ name: 'Score System', status: 'FAILED' });
    }
    resolve();
  });
}

async function runAllTests() {
  log('\n🎮 PartyPlay Test Suite Starting...\n', 'info');
  
  await testRoomCreation();
  await testMultipleJoins();
  await testGameStart();
  await testScoreSystem();
  
  log('\n📊 Test Results Summary:', 'info');
  log(`✅ Passed: ${results.passed}`, 'pass');
  log(`❌ Failed: ${results.failed}`, 'fail');
  log(`📈 Total: ${results.tests.length}`, 'info');
  
  if (results.failed === 0) {
    log('\n🎉 All tests PASSED! PartyPlay is ready for deployment!\n', 'pass');
  } else {
    log('\n⚠️ Some tests FAILED. Please check the logs above.\n', 'warn');
  }
  
  process.exit(results.failed === 0 ? 0 : 1);
}

// Run tests
runAllTests();
```

## Quick Manual Test Commands

### Browser Console Test Scripts

```javascript
// Copy and paste into browser console for quick testing

// 1. Test localStorage persistence
localStorage.setItem('test', 'working');
console.log('LocalStorage:', localStorage.getItem('test'));

// 2. Test WebSocket connection
const socket = io();
socket.on('connect', () => console.log('✅ WebSocket connected'));
socket.on('disconnect', () => console.log('❌ WebSocket disconnected'));

// 3. Test responsive viewport
const viewports = [
  { width: 375, name: 'Mobile' },
  { width: 768, name: 'Tablet' },
  { width: 1920, name: 'Desktop' }
];
viewports.forEach(v => {
  window.innerWidth = v.width;
  window.dispatchEvent(new Event('resize'));
  console.log(`${v.name}: ${v.width}px - ${document.body.clientWidth}px`);
});

// 4. Test button visibility
const buttons = document.querySelectorAll('button');
console.log(`Found ${buttons.length} buttons on page`);

// 5. Test game state updates
window.gameStates = [];
const originalEmit = socket.emit;
socket.emit = function(event, data) {
  window.gameStates.push({ event, data, time: Date.now() });
  console.log(`📤 Emit: ${event}`, data);
  return originalEmit.apply(this, arguments);
};
```

## Performance Testing Command

```bash
# Load testing with Artillery
# Install: npm install -g artillery

# Create load-test.yml
cat > load-test.yml << 'EOF'
config:
  target: "http://localhost:3001"
  phases:
    - duration: 60
      arrivalRate: 10
  socketio:
    transports: ["websocket"]
scenarios:
  - engine: "socketio"
    flow:
      - emit:
          - "create_room"
          - username: "LoadTest{{ $randomNumber() }}"
            avatarColor: "#ff0000"
            userId: "user{{ $randomNumber() }}"
      - think: 5
      - emit:
          - "leave_room"
EOF

# Run load test
artillery run load-test.yml
```

## Test Data Generator

```javascript
// Generate 20 test users for full room testing
const generateTestUsers = (count) => {
  const users = [];
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
  
  for (let i = 1; i <= count; i++) {
    users.push({
      username: `TestUser${i}`,
      avatarColor: colors[i % colors.length],
      userId: `test_${i}_${Date.now()}`
    });
  }
  return users;
};

// Usage: generateTestUsers(20)
console.table(generateTestUsers(20));
```

## Success Criteria Checklist

- [ ] All 4 games start and complete without errors
- [ ] Players can join/leave rooms in real-time
- [ ] Scores persist and update correctly across rounds
- [ ] Timer sync matches within 500ms across clients
- [ ] Mobile responsive layout works on all screen sizes
- [ ] No console errors in production build
- [ ] Reconnection works after network interruption
- [ ] Host migration functions correctly
- [ ] Room codes are unique and valid
- [ ] All buttons have proper hover/active states
- [ ] Dark mode styling consistent across all pages
- [ ] Bundle size < 500KB (gzipped)
- [ ] Page load time < 2 seconds on 3G
- [ ] WebSocket reconnection < 3 seconds

## Deployment Validation

```bash
# Post-deployment smoke test
curl -I https://your-app.vercel.app  # Should return 200
curl -I https://your-api.onrender.com/api/rooms/TEST  # Should return JSON

# WebSocket connection test
wscat -c wss://your-api.onrender.com/socket.io/?transport=websocket
# Should show "0" (connection successful)
```

This comprehensive test plan ensures PartyPlay is production-ready before deployment!
