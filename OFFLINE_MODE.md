# Offline Mode & Server Fallback

WorldFeel now includes a comprehensive offline mode that ensures users get a full experience even when the backend server is down or spinning up.

## Overview

When the backend server is unavailable (e.g., during Render's free tier spin-up period), the app automatically switches to offline mode and provides:

- **Randomized mock data** for the results page
- **Functional emotion dropdown** with mock suggestions
- **Working submit functionality** that simulates successful submissions
- **Automatic submission queuing** for when server comes back online
- **Console logging** for debugging and development (users see no visual indicators)

## How It Works

### 1. Server Status Detection

The app continuously monitors server health and automatically detects when the backend is unavailable.

### 2. Automatic Fallback

When server requests fail, the API client automatically:

- Generates realistic mock data
- Maintains app functionality
- Queues submissions for later submission
- Provides console logging for debugging

### 3. User Experience

Users see:

- **No visual indicators** of offline mode (seamless experience)
- Full app functionality with randomized data
- No error messages or broken features
- Submissions are automatically sent when server returns

### 4. Automatic Submission Recovery

When the server comes back online:

- Pending submissions are automatically submitted
- Users don't need to resubmit their words
- Console logs show submission status

## Console Logging

When in offline mode, the browser console shows helpful debugging information (only visible to developers):

```
🌐 [WorldFeel] Server offline - using fallback data for /stats
🌐 [WorldFeel] Last server check: 45s ago
🌐 [WorldFeel] Server likely spinning up - estimated 25s remaining
🌐 [WorldFeel] Server back online - submitting 3 pending submissions
🌐 [WorldFeel] Successfully submitted pending word: happy
```

## Mock Data Features

### Randomized Results

- Different emotion words each time
- Realistic count distributions
- Varied color palettes
- Personalized stats when user has submitted a word

### Emotion Search

- Filtered results based on user input
- Realistic emotion word suggestions
- Maintains dropdown functionality

## Technical Implementation

### Files Modified

- `apps/web/src/lib/apiClient.ts` - Enhanced with fallback logic and submission queuing
- `apps/web/src/lib/mockData.ts` - Mock data generation
- `apps/web/src/hooks/useStats.ts` - Updated to handle fallback data
- `apps/web/src/features/HomePage.tsx` - Ensures dropdown works offline
- `apps/web/src/features/ResultsPage.tsx` - Handles fallback data display
- `apps/web/src/components/ServerStatusIndicator.tsx` - Background monitoring only

### Key Components

#### Mock Data Generator

```typescript
// Generates realistic, randomized stats
const stats = generateMockStats('happy');

// Provides emotion search results (client-side, always available)
const suggestions = searchEmotions('hap');
```

#### Enhanced API Client with Submission Queuing

```typescript
// Automatically falls back to mock data on server errors
const response = await apiClient.submitWord({ word: 'happy' });
// Queues submission if server is down, submits when server returns

// Check pending submissions (for debugging)
const pendingCount = apiClient.getPendingSubmissionsCount();
```

#### Server Status Tracking

```typescript
// Tracks server status and spin-up timing
const status = apiClient.getServerStatus();
// { isOnline: false, lastCheck: 1234567890, spinUpTime: 70000 }
```

## Development Benefits

### For Developers

- **Easy debugging**: Console logs show exactly what's happening
- **No broken features**: All functionality works regardless of server status
- **Realistic testing**: Mock data provides realistic app behavior
- **Submission tracking**: See pending submissions in console

### For Users

- **Seamless experience**: No waiting for server spin-up
- **Full functionality**: Can use all app features immediately
- **No visual indicators**: App appears to work normally
- **Automatic recovery**: Submissions sent when server returns

## Configuration

### Spin-up Time Estimation

The app estimates a 70-second spin-up time for Render's free tier. This can be adjusted in `apiClient.ts`:

```typescript
let serverStatus = {
  isOnline: true,
  lastCheck: 0,
  spinUpTime: 70000, // Adjust this value as needed
};
```

### Health Check Frequency

Server health is checked every 30 seconds. This can be modified in `ServerStatusIndicator.tsx`:

```typescript
// Check every 30 seconds
const interval = setInterval(checkServerStatus, 30000);
```

## Testing Offline Mode

### Simulate Server Down

1. Stop the backend server
2. Refresh the web app
3. Try using all features - they should work with mock data
4. Submit a word - it will be queued
5. Check console for offline mode logs
6. Start the server - pending submissions will be sent automatically

### Verify Randomization

1. Submit the same emotion multiple times
2. Check that results are different each time
3. Verify emotion search provides varied suggestions

### Test Submission Recovery

1. Submit a word while server is down
2. Check console for "pending submissions" message
3. Start the server
4. Check console for "Server back online" and submission success messages

## Future Enhancements

- **Persistent offline data**: Cache real data for offline use
- **Offline analytics**: Track offline usage patterns
- **Custom mock data**: Allow developers to customize fallback data
- **Submission retry logic**: More sophisticated retry mechanisms
