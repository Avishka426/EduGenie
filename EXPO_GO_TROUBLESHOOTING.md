# 🚨 Expo Go Not Opening - Troubleshooting Guide

## Your Network Status: ✅ WORKING
- ✅ Backend accessible on localhost:3000 (web browser)
- ✅ Backend accessible on 192.168.43.66:3000 (mobile network)
- ✅ Network connectivity is fine

## Likely Issues & Solutions

### 1. **Cache Issues** 
```bash
# Clear all caches and restart
npx expo start --clear
```

### 2. **API Configuration Error**
I've switched your API to use the network IP for Expo Go:
```typescript
// Now configured for Expo Go
export const API_BASE_URL_OVERRIDE = 'http://192.168.43.66:3000';
```

### 3. **Metro Bundler Issues**
```bash
# Kill any existing Metro processes
taskkill /f /im node.exe
# Then restart
npx expo start --clear
```

### 4. **Expo Go App Issues**
- **Force close** Expo Go app completely
- **Clear Expo Go cache** in phone settings
- **Restart your phone** (sometimes needed)
- **Update Expo Go** to latest version

### 5. **Firewall/Network Issues**
```bash
# Test if Windows Firewall is blocking
netsh advfirewall firewall add rule name="Node.js" dir=in action=allow program="%ProgramFiles%\nodejs\node.exe"
```

### 6. **Platform Detection Errors**
If you see errors about Constants or Platform:
```bash
# Reinstall expo dependencies
npm install expo-constants@latest
```

## Quick Fix Steps:

1. **Force close everything**:
   - Close Expo Go app
   - Kill Metro bundler (Ctrl+C)
   - Close any VS Code terminals

2. **Clear all caches**:
   ```bash
   npx expo start --clear
   ```

3. **In Expo Go app**:
   - Open Expo Go
   - Scan the QR code OR
   - Enter the URL manually: `exp://192.168.43.66:8081`

4. **If still failing, try tunnel mode**:
   ```bash
   npx expo start --tunnel
   ```

## Common Error Messages:

| Error | Solution |
|-------|----------|
| "Unable to connect to Metro" | Clear cache, restart |
| "Network request failed" | Check API config |
| "Something went wrong" | Clear Expo Go cache |
| "Couldn't connect to packager" | Restart Metro bundler |

## Debug Steps:

1. Check what shows in your terminal when you run `npx expo start`
2. Look for any red error messages
3. Try opening the web version first: press 'w' in terminal
4. If web works, then try Expo Go

## Alternative: Development Build
If Expo Go keeps failing, consider creating a development build:
```bash
npx expo install expo-dev-client
npx expo run:android
# or
npx expo run:ios
```
