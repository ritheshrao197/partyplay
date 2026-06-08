import { test, expect } from '@playwright/test';

test.describe('Room Creation and Lobby', () => {
  test('should allow host to create a room and player to join and ready up', async ({ browser }) => {
    // Host Context
    const hostContext = await browser.newContext();
    const hostPage = await hostContext.newPage();
    
    // Player Context
    const playerContext = await browser.newContext();
    const playerPage = await playerContext.newPage();

    // 1. Host Login
    await hostPage.goto('/login');
    await hostPage.getByPlaceholder('Enter your display name').fill('HostUser');
    await hostPage.getByRole('button', { name: /Join the Party/i }).click();
    await expect(hostPage).toHaveURL('/');

    // 2. Host Creates Room
    // Click the first game card ("Find The Imposter")
    await hostPage.locator('text=Find The Imposter').first().click();
    
    // Wait for the modal and click Create Room
    await hostPage.getByRole('button', { name: 'Create Room' }).click();

    // Verify host is in Lobby
    await expect(hostPage.getByText('Room Code:')).toBeVisible();
    
    // Get Room Code from the button next to it
    const roomCodeButton = hostPage.locator('button', { hasText: /^[A-Z0-9]{6}$/ });
    const roomCode = await roomCodeButton.textContent();
    expect(roomCode).toBeTruthy();

    // 3. Player Login
    await playerPage.goto('/login');
    await playerPage.getByPlaceholder('Enter your display name').fill('PlayerUser');
    await playerPage.getByRole('button', { name: /Join the Party/i }).click();
    await expect(playerPage).toHaveURL('/');

    // 4. Player Joins Room
    await playerPage.getByRole('link', { name: 'Rooms' }).click();
    await expect(playerPage).toHaveURL('/rooms');
    
    // Click 'Join by Code' to open the modal
    await playerPage.getByRole('button', { name: 'Join by Code' }).click();
    
    await playerPage.locator('input[placeholder="Enter 6-letter code"]').fill(roomCode!);
    await playerPage.getByRole('button', { name: 'Join Room' }).click();

    // Verify Player is in Lobby
    await expect(playerPage.locator('button', { hasText: roomCode! })).toBeVisible();

    // Verify Host sees Player (players length >= 2)
    await expect(hostPage.getByText('Players (2/')).toBeVisible();
    
    // 5. Player Clicks Ready
    const readyButton = playerPage.getByRole('button', { name: 'Ready' });
    await readyButton.click();

    // Verify Player button changes to "Not Ready"
    await expect(playerPage.getByRole('button', { name: 'Not Ready' })).toBeVisible();

    // 6. Host Start Game button becomes enabled
    const startButton = hostPage.getByRole('button', { name: /Start Game/i });
    // Text should change from "(Waiting...)" to just "Start Game" or it should be enabled
    await expect(startButton).toBeEnabled();
    await expect(startButton).not.toContainText('Waiting');

    // Clean up
    await hostContext.close();
    await playerContext.close();
  });
});
