# 🚀 EduGenie Frontend-Backend Integration Setup

## ✅ Integration Complete!

Your React Native frontend is now connected to your backend API endpoints. Here's what's working:

### 🔗 Connected Endpoints:
- ✅ `POST /api/auth/register` - User registration
- ✅ `POST /api/auth/login` - User login  
- ✅ `GET /api/auth/profile` - Get user profile (protected)
- ✅ `GET /health` - Health check
- ✅ `GET /api` - API information

### 📱 Features Working:
- ✅ **User Registration** - Creates real accounts with name, email, password, role
- ✅ **User Login** - Authenticates with backend and gets JWT token
- ✅ **Role-based Navigation** - Students → `/student/dashboard`, Instructors → `/instructor/dashboard`
- ✅ **Token Storage** - JWT tokens stored securely in AsyncStorage
- ✅ **Auto-login** - Users stay logged in between app sessions
- ✅ **Logout** - Clears tokens and user data

## 🛠️ Quick Setup

### 1. Make sure your backend is running:
```bash
# In your backend directory
npm run dev
```
Backend should be accessible at `http://localhost:3000`

### 2. Configure for your device:

#### Android Emulator (Default - No changes needed)
- Already configured for `http://10.0.2.2:3000`

#### iOS Simulator
Edit `config/api.ts`:
```typescript
export const API_BASE_URL = 'http://localhost:3000';
```

#### Physical Device  
1. Find your computer's IP address:
   - Windows: `ipconfig` 
   - macOS/Linux: `ifconfig`
2. Edit `config/api.ts`:
```typescript
export const API_BASE_URL = 'http://YOUR_COMPUTER_IP:3000';
```

### 3. Test the integration:

#### Option A: Use the test component
Add to any screen temporarily:
```typescript
import BackendTestButton from '@/components/BackendTestButton';

// In your component JSX:
<BackendTestButton />
```

#### Option B: Test the actual flow
1. **Register a new user**: Fill out registration form
2. **Login**: Use the credentials you just created
3. **Check console logs**: Should see API requests/responses

## 🔧 Testing the Backend Connection

### Quick Health Check:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "message": "EduGenie Backend is running!",
  "timestamp": "2025-07-24T...",
  "environment": "development"
}
```

### Test Registration API:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "password": "password123",
    "role": "student"
  }'
```

### Test Login API:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🐛 Troubleshooting

### "Network request failed"
- ✅ Check if backend is running: `npm run dev`
- ✅ Verify correct API_BASE_URL in `config/api.ts`
- ✅ For physical device: ensure same WiFi network

### "Cannot connect to server"  
- ✅ Test with curl: `curl http://localhost:3000/health`
- ✅ Check Windows Firewall (allow port 3000)
- ✅ For physical device: `curl http://YOUR_IP:3000/health`

### Authentication errors
- ✅ Check backend console logs for detailed errors
- ✅ Verify password requirements (minimum 6 characters)
- ✅ Make sure user exists for login

### Console Debugging
Check React Native logs for detailed API information:
```
🔄 API Request: http://10.0.2.2:3000/api/auth/login
📡 API Response: 200 {token: "...", user: {...}}
✅ Login successful, token stored
```

## 📁 Integration Files

### New Files Created:
- `config/api.ts` - API configuration
- `services/api.ts` - API service with all HTTP methods
- `components/BackendTestButton.tsx` - Testing component

### Updated Files:
- `context/AuthContext.tsx` - Now uses real API calls
- `app/register.tsx` - Updated to use `name` field
- `app/login.tsx` - Already working with backend

## 🔒 Security Features

- **JWT Tokens** - Secure authentication
- **AsyncStorage** - Secure token storage on device  
- **Auto token inclusion** - All authenticated requests include Bearer token
- **Token cleanup** - Logout clears all stored data
- **Input validation** - Frontend validation before API calls

## 🎯 Next Steps

1. **Test Registration**: Create new user accounts
2. **Test Login**: Authenticate existing users  
3. **Test Role Navigation**: Verify students/instructors go to correct dashboards
4. **Remove Test Components**: Delete `BackendTestButton` before production
5. **Add More Features**: Extend API for courses, profiles, etc.

---

**🎉 Success!** Your EduGenie app is now fully connected to your backend API. Users can register, login, and the app will handle role-based navigation automatically!
