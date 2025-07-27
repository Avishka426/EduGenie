# 📱 Expo Go Connection Fix

## The Problem
When running on **Expo Go** (physical device), the app cannot connect to `localhost:3000` because `localhost` refers to the phone, not your computer.

## ✅ Solution Applied
I've updated the API configuration to automatically detect the platform and use the correct URL:

- **Web Browser**: `http://localhost:3000` ✅ (works)
- **Expo Go (Physical Device)**: `http://192.168.43.66:3000` ✅ (should work now)
- **Android Emulator**: `http://10.0.2.2:3000`
- **iOS Simulator**: `http://localhost:3000`

## 🔧 Backend Configuration Required

Your backend server also needs to be configured to accept connections from your network (not just localhost).

### If using Express.js:
```javascript
// Instead of:
app.listen(3000, 'localhost', () => {
  console.log('Server running on localhost:3000');
});

// Use this (listen on all interfaces):
app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on 0.0.0.0:3000');
  console.log('Web access: http://localhost:3000');
  console.log('Mobile access: http://192.168.43.66:3000');
});
```

### If using Node.js http server:
```javascript
const server = http.createServer(app);
server.listen(3000, '0.0.0.0', () => {
  console.log('Server listening on all interfaces');
});
```

## 🔍 Verify Your IP Address

Make sure `192.168.43.66` is your current IP address:

```cmd
# Windows
ipconfig

# Look for "Wireless LAN adapter Wi-Fi"
# IPv4 Address should be 192.168.43.66
```

If your IP address changed, update `COMPUTER_WIFI_IP` in `config/api.ts`.

## 🧪 Test the Connection

1. **Update your backend** to listen on `0.0.0.0:3000`
2. **Restart your backend server**
3. **Test in browser**: `http://localhost:3000` (should still work)
4. **Test on phone**: Open Expo Go app and try the API

## 🔥 Quick Test Commands

```bash
# Test from your computer (should work)
curl http://localhost:3000/api/health

# Test from your network (should work after backend update)
curl http://192.168.43.66:3000/api/health
```

## 🚨 Firewall Check

If it still doesn't work, check Windows Firewall:
1. Go to Windows Defender Firewall
2. Allow Node.js through firewall for both Private and Public networks

## 💡 Alternative: Tunnel Service

If the above doesn't work, you can use ngrok as a tunnel:
```bash
# Install ngrok
npm install -g ngrok

# In your backend folder, after starting your server:
ngrok http 3000

# Use the ngrok URL in your app (like https://abc123.ngrok.io)
```
