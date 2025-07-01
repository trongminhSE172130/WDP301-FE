# 🔄 Refresh Token System Demo

## Hệ thống Refresh Token hoạt động như thế nào?

### 📊 **Flow diagram:**
```
User Login → Get Token + Refresh Token → Store in SessionManager
     ↓
Make API Call → Add Bearer Token to Header
     ↓
Token Expired (401) → Auto-refresh with Refresh Token
     ↓
Get New Token + New Refresh Token → Update SessionManager
     ↓
Retry Original Request → Success!
```

### 🔧 **Implementation Details:**

#### 1. **Login Response Structure:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "role": "admin",
    "full_name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### 2. **SessionManager Storage:**
```typescript
// Lưu trữ
localStorage.setItem('token', access_token);
localStorage.setItem('refresh_token', refresh_token);
localStorage.setItem('session_info', {
  token,
  user,
  refreshToken,
  loginTime: Date.now(),
  expiryTime: Date.now() + 30*60*1000, // 30 phút
  isAdminRole: true,
  userRole: 'admin'
});
```

#### 3. **Auto-Refresh Process:**
```typescript
// Khi gặp 401 Unauthorized
if (error.response.status === 401 && !originalRequest._retry) {
  const refreshToken = SessionManager.getRefreshToken();
  
  if (refreshToken) {
    // 1. Call refresh API
    const response = await apiClient.post('/auth/refresh', {
      refresh_token: refreshToken
    });
    
    // 2. Update session với token mới
    SessionManager.saveSession(
      response.data.token, 
      userInfo, 
      response.data.refresh_token
    );
    
    // 3. Retry original request
    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    return apiClient(originalRequest);
  }
}
```

### 🧪 **Test Cases:**

#### **Case 1: Normal API Call**
```typescript
// User makes API call
const response = await apiClient.get('/admin/users');
// ✅ Success: Token valid, request goes through
```

#### **Case 2: Expired Token**
```typescript
// User makes API call with expired token
const response = await apiClient.get('/admin/users');
// ❌ 401 Unauthorized
// 🔄 Auto-refresh: Get new token
// ✅ Retry: Original request succeeds with new token
```

#### **Case 3: Expired Refresh Token**
```typescript
// User makes API call, both tokens expired
const response = await apiClient.get('/admin/users');
// ❌ 401 Unauthorized
// ❌ Refresh fails: Refresh token also expired
// 🚪 Auto-logout: Redirect to login page
```

### 🔒 **Security Features:**

1. **Infinite Loop Protection:**
   - `isRefreshing` flag prevents multiple refresh attempts
   - Failed requests are queued and processed after refresh

2. **Token Rotation:**
   - Each refresh returns new access_token + new refresh_token
   - Old tokens are invalidated

3. **Graceful Degradation:**
   - If refresh fails → Auto logout
   - Clear all session data
   - Redirect to appropriate login page

### 📈 **Benefits:**

1. **User Experience:**
   - ✅ No interrupted workflows
   - ✅ Seamless token renewal
   - ✅ No forced logouts during work

2. **Security:**
   - ✅ Short-lived access tokens (30 min)
   - ✅ Refresh token rotation
   - ✅ Automatic cleanup on failure

3. **Developer Experience:**
   - ✅ Transparent to application code
   - ✅ Centralized token management
   - ✅ Automatic error handling

### 🚀 **Usage Examples:**

#### **Making API Calls (No change needed):**
```typescript
// Code như bình thường, refresh tự động
const users = await getAllUsers();
const services = await getAllServices();
const appointments = await getAppointments();
```

#### **Manual Refresh (If needed):**
```typescript
import { refreshToken } from '../service/api/authApi';

try {
  const newTokens = await refreshToken();
  console.log('Refreshed successfully:', newTokens);
} catch (error) {
  console.log('Refresh failed, user needs to login');
}
```

### 📝 **Configuration:**

#### **Timeout Settings:**
```typescript
// Admin/Consultant: 30 phút
private static readonly ADMIN_SESSION_TIMEOUT = 30 * 60 * 1000;

// User thường: 24 giờ  
private static readonly USER_SESSION_TIMEOUT = 24 * 60 * 60 * 1000;
```

#### **API Endpoints:**
```typescript
POST /auth/login     // Get initial tokens
POST /auth/refresh   // Refresh expired token
POST /auth/logout    // Invalidate tokens
```

---

## 🎯 **Kết luận:**

**✅ Refresh Token System hoàn toàn hoạt động!**

- Tự động refresh khi token hết hạn
- Không gián đoạn user experience  
- Bảo mật cao với token rotation
- Transparent với application logic

**🔒 User không bao giờ bị logout đột ngột nữa!** 