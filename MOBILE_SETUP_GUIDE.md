# 📱 Mobile Device Connectivity Guide

## ✅ **Configuration Updated!**

Your API is now configured for mobile device access:
```typescript
export const API_BASE_URL = 'http://192.168.43.66:3000';
```

## 🔧 **Steps to Fix Mobile Connection:**

### 1. **Verify Your Setup:**
- ✅ Backend running on: `http://localhost:3000`
- ✅ Backend accessible on Wi-Fi: `http://192.168.43.66:3000`
- ✅ Frontend configured for: `http://192.168.43.66:3000`

### 2. **Ensure Same Network:**
- ✅ **Computer** and **Mobile phone** must be on the **same Wi-Fi network**
- ✅ Check your phone's Wi-Fi settings
- ✅ Make sure both devices are connected to the same router

### 3. **Check Windows Firewall:**
Windows might be blocking incoming connections. Run this command as Administrator:

```cmd
netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow protocol=TCP localport=3000
```

Or temporarily disable Windows Firewall for testing.

### 4. **Test Mobile Connectivity:**

#### Option A: Test from mobile browser
Open your phone's browser and go to:
```
http://192.168.43.66:3000/health
```
You should see: `{"message":"EduGenie Backend is running!"...}`

#### Option B: Use the test button in app
1. Open Expo Go app on your phone
2. Scan QR code from `expo start`
3. Go to login screen
4. Tap "🔧 Test Backend Connection"
5. Check if it succeeds

### 5. **Common Issues & Solutions:**

#### **"Network request failed"**
- ❌ Different Wi-Fi networks → Connect both to same network
- ❌ Windows Firewall blocking → Allow port 3000
- ❌ Router blocking → Check router settings

#### **"Connection timeout"**
- ❌ Backend not running → Start with `npm run dev`
- ❌ Wrong IP address → Get current IP with `ipconfig`
- ❌ Port blocked → Try different port

#### **"Cannot connect to server"**
- ❌ VPN interference → Disable VPN temporarily
- ❌ Antivirus blocking → Check antivirus settings
- ❌ Corporate network → Try mobile hotspot

## 🔄 **Quick Test Commands:**

### On your computer:
```bash
# Check if backend is running
curl http://localhost:3000/health

# Check if backend is accessible on Wi-Fi IP
curl http://192.168.43.66:3000/health

# Get current IP address
ipconfig
```

### On your mobile browser:
```
http://192.168.43.66:3000/health
```

## 🛠️ **If IP Address Changes:**

Your Wi-Fi IP might change. If the app stops working:

1. **Get new IP address:**
   ```cmd
   ipconfig
   ```

2. **Update config/api.ts:**
   ```typescript
   export const API_BASE_URL = 'http://NEW_IP_ADDRESS:3000';
   ```

3. **Restart Expo:**
   ```bash
   # Stop expo (Ctrl+C)
   # Start again
   expo start
   ```

## 📋 **Current Network Info:**

- **Computer Wi-Fi IP:** `192.168.43.66`
- **Backend URL:** `http://192.168.43.66:3000`
- **Frontend configured for:** Mobile device access
- **Test URL:** `http://192.168.43.66:3000/health`

## 🎯 **Next Steps:**

1. **Test mobile browser** - Go to health URL
2. **Test Expo Go app** - Use test button
3. **Try login** with your credentials
4. **Check console logs** in Expo for detailed errors

---

**🎉 Your app should now work on your mobile phone via Expo Go!**
