# 🚨 EXPO GO EMERGENCY FIX

## The Problem
Expo Go won't open - likely due to AuthContext making API calls on startup.

## 🔧 IMMEDIATE FIX - Step by Step

### Step 1: Disable Auth API Calls Temporarily
Replace the AuthContext useEffect with this minimal version:

```tsx
// In context/AuthContext.tsx - replace the useEffect with:
useEffect(() => {
  // TEMPORARY: Skip all API calls during startup
  console.log('⚠️ Auth disabled for debugging');
  setIsLoading(false);
}, []);
```

### Step 2: Use Emergency API Config
1. Open `services/api.ts`
2. Replace the import at the top:
```tsx
// Replace this:
import { API_ENDPOINTS, FINAL_API_BASE_URL } from '@/config/api';

// With this:
import { EMERGENCY_API_BASE_URL as FINAL_API_BASE_URL } from '@/config/emergency-api';
import { API_ENDPOINTS } from '@/config/api';
```

### Step 3: Test Expo Go
```bash
npx expo start --clear
```

If Expo Go opens successfully, the problem was the AuthContext API calls.

## 🔄 GRADUAL RE-ENABLE

Once Expo Go works:

### Step 1: Re-enable Auth (but safer)
```tsx
useEffect(() => {
  const initializeAuth = async () => {
    // Wait for app to fully load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      console.log('🔄 Starting delayed auth initialization...');
      // Only check local storage first
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        console.log('Found token, will validate later');
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  initializeAuth();
}, []);
```

### Step 2: Test Again
If still working, gradually add back the API calls one by one.

## 🚨 NUCLEAR OPTION

If nothing works, create a completely new minimal AuthContext:

```tsx
// Minimal AuthContext - no API calls
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Always false

  const login = async (email: string, password: string) => {
    // TODO: Implement later
    return { success: false, error: 'Login disabled for debugging' };
  };

  const register = async (userData: any) => {
    // TODO: Implement later  
    return { success: false, error: 'Register disabled for debugging' };
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, 
      isAuthenticated: false, 
      isLoading, 
      login, 
      register, 
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## ✅ SUCCESS INDICATORS

When Expo Go works, you should see:
- QR code appears in terminal
- Expo Go scans successfully  
- App loads to welcome screen
- No "Unable to connect" errors

## 📝 Debug Log

When you run `npx expo start --clear`, look for these logs:
- `🌐 API Service initialized with base URL: http://192.168.43.66:3000`
- `⚠️ Auth disabled for debugging`
- NO red error messages about network or imports

Try Step 1 first - just disable the auth calls temporarily and see if Expo Go opens!
