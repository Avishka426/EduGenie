# 🔧 Network Connection Troubleshooting Guide

## The Problem
You're getting the error: `Network request failed` when trying to connect to your backend server.

## ✅ Quick Solutions

### 1. **Check if Backend is Running**
```bash
# Navigate to your backend folder and start the server
cd path/to/your/backend
npm start
# or
node server.js
# or
npm run dev
```

### 2. **Verify Backend URL**
- Your backend should be running on: `http://localhost:3000`
- Test in browser: Open `http://localhost:3000` in your browser
- Should show your API or a welcome message

### 3. **Test API Endpoint**
```bash
# Test with curl (in command prompt/terminal)
curl -X POST http://localhost:3000/api/gpt/recommendations ^
-H "Content-Type: application/json" ^
-d "{\"prompt\": \"I want to learn web development\"}"
```

### 4. **Platform-Specific Fixes**

#### 🌐 **If running on Web Browser (localhost:19006)**
- Use: `http://localhost:3000`
- Make sure CORS is enabled in your backend

#### 📱 **If running on Physical Device (Expo Go)**
- Find your computer's IP address:
  ```bash
  ipconfig
  # Look for "Wireless LAN adapter Wi-Fi" -> "IPv4 Address"
  ```
- Update in `config/api.ts`:
  ```typescript
  export const API_BASE_URL_OVERRIDE = 'http://YOUR_IP_ADDRESS:3000';
  ```

#### 🤖 **If running on Android Emulator**
- Use: `http://10.0.2.2:3000`
- Update in `config/api.ts`:
  ```typescript
  export const API_BASE_URL_OVERRIDE = 'http://10.0.2.2:3000';
  ```

### 5. **Backend CORS Configuration**
Your backend needs CORS headers. Add this to your backend:

```javascript
// For Express.js
const cors = require('cors');
app.use(cors({
  origin: [
    'http://localhost:19006',  // Expo web
    'http://localhost:3000',   // Local development
    'exp://192.168.43.66:8081' // Expo Go (replace with your IP)
  ]
}));
```

## 🧪 **Testing Steps**

1. **Test Backend Health Check**:
   ```bash
   node test-backend.js
   ```

2. **Use the "Test API" button** in the AI Recommendations screen

3. **Check Browser Console** (F12 → Console) for detailed error messages

## 🔍 **Common Issues & Solutions**

| Error | Solution |
|-------|----------|
| `Network request failed` | Backend not running or wrong URL |
| `CORS error` | Add CORS headers to backend |
| `Connection refused` | Wrong port or IP address |
| `Timeout` | Backend is slow or not responding |

## 📝 **Current Configuration**

Your app is configured to use:
- **Override URL**: `http://localhost:3000`
- **Platform Detection**: Automatic (with manual override)
- **Timeout**: 5 seconds

## 🚀 **Final Checklist**

- [ ] Backend server is running on port 3000
- [ ] Can access `http://localhost:3000` in browser
- [ ] CORS is configured in backend
- [ ] Correct API endpoint (`/api/gpt/recommendations`) exists
- [ ] Frontend uses correct URL for your platform
- [ ] No firewall blocking port 3000

## 💡 **Still Having Issues?**

1. **Check the browser console** for detailed error messages
2. **Use the Test API button** to diagnose connection issues  
3. **Try different URLs** in the API configuration
4. **Restart both frontend and backend** servers
5. **Check if another app is using port 3000**

## 📞 **Need Help?**

Run these commands and share the output:
```bash
# Check if port 3000 is in use
netstat -an | findstr :3000

# Test backend connection
node test-backend.js

# Check your IP address
ipconfig
```
