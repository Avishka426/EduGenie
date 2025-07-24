# 📱💻 Multi-Device Testing Guide

## 🎯 **Perfect! Now You Can Test Both Simultaneously**

Your app now **automatically detects** the platform and uses the correct API URL:

### 🔄 **Auto-Detection Logic:**
- **📱 Mobile Phone (Expo Go)** → `http://192.168.43.66:3000`
- **💻 Web Browser** → `http://localhost:3000`
- **📱 iOS Simulator** → `http://localhost:3000`
- **🤖 Android Emulator** → `http://10.0.2.2:3000`

## 🚀 **How to Test Both Devices:**

### **Step 1: Start Your Backend**
```bash
npm run dev
```
Backend will be available on:
- Localhost: `http://localhost:3000`
- Wi-Fi Network: `http://192.168.43.66:3000`

### **Step 2: Start Frontend**
```bash
expo start
```

### **Step 3: Test on Multiple Devices**

#### **🌐 Web Browser (Laptop):**
1. Press `w` in the terminal or click "Open in web browser"
2. Goes to: `http://localhost:3000` ✅
3. Debug info shows: "🔗 API: http://localhost:3000"

#### **📱 Mobile Phone (Expo Go):**
1. Scan QR code with Expo Go app
2. Goes to: `http://192.168.43.66:3000` ✅  
3. Debug info shows: "🔗 API: http://192.168.43.66:3000"

#### **📱 iOS Simulator:**
1. Press `i` in terminal
2. Goes to: `http://localhost:3000` ✅
3. Debug info shows: "🔗 API: http://localhost:3000"

#### **🤖 Android Emulator:**
1. Press `a` in terminal  
2. Goes to: `http://10.0.2.2:3000` ✅
3. Debug info shows: "🔗 API: http://10.0.2.2:3000"

## 🔍 **Debug Information**

Each device now shows debug info on the login screen:
```
🔗 API: http://[detected-url]:3000
📱 Platform: [platform] (Dev)
```

This helps you verify the correct URL is being used.

## 🧪 **Testing Scenarios:**

### **Scenario 1: Both Laptop Browser + Mobile Phone**
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend  
expo start
# Press 'w' for web
# Scan QR for mobile
```

**Result:** Both work simultaneously! 🎉

### **Scenario 2: All Platforms**
```bash
expo start
# Press 'w' for web browser
# Press 'i' for iOS simulator  
# Press 'a' for Android emulator
# Scan QR for physical device
```

**Result:** All 4 platforms work at once! 🚀

## 🔧 **Manual Override (If Needed):**

If auto-detection doesn't work, you can force a specific URL in `config/api.ts`:

```typescript
// Uncomment to force specific URL:
export const API_BASE_URL = 'http://localhost:3000'; // For web/simulator
// export const API_BASE_URL = 'http://192.168.43.66:3000'; // For mobile
```

## 🛠️ **Troubleshooting Multi-Device:**

### **Mobile phone can't connect:**
- ✅ Check both devices on same Wi-Fi
- ✅ Update Wi-Fi IP if changed: `ipconfig`
- ✅ Check Windows Firewall allows port 3000

### **Web browser can't connect:**
- ✅ Make sure backend is running: `npm run dev`
- ✅ Test: `http://localhost:3000/health`

### **Wrong URL detected:**
- ✅ Check debug info on login screen
- ✅ Manually override in `config/api.ts` if needed

## 🎯 **Test Your Login Flow:**

### **Test Credentials:**
- Email: `avishka66@example.com`
- Password: `password123`  
- Role: `instructor`

### **Expected Results:**
1. **Mobile Phone:** Login → Instructor Dashboard ✅
2. **Web Browser:** Login → Instructor Dashboard ✅
3. **Both show:** "Welcome, John Doe - Instructor Dashboard"

## 📊 **Current Setup Summary:**

- **Backend:** Running on `localhost:3000`
- **Wi-Fi IP:** `192.168.43.66`
- **Auto-detection:** ✅ Enabled
- **Debug info:** ✅ Visible on login screen
- **Multi-device:** ✅ Ready

---

**🎉 You can now test login on laptop browser and mobile phone simultaneously!**

Both will use the correct API endpoint automatically and show the same user data and dashboard after login.
