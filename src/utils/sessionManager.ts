export class SessionManager {
  private static readonly TOKEN_KEY = 'token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly USER_KEY = 'user';
  private static readonly SESSION_INFO_KEY = 'session_info';
  
  // Thời gian timeout cho admin/consultant: 30 phút
  private static readonly ADMIN_SESSION_TIMEOUT = 30 * 60 * 1000;
  // Thời gian timeout cho user thường: 24 giờ
  private static readonly USER_SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

  /**
   * Lưu session với timestamp và thông tin expiry
   */
  static saveSession(token: string, user: { role?: string; [key: string]: unknown }, refreshToken?: string) {
    const userRole = user.role?.toLowerCase() || 'user';
    const isAdminRole = ['admin', 'consultant', 'manager', 'staff'].includes(userRole);
    
    const sessionData = {
      token,
      user,
      refreshToken,
      loginTime: Date.now(),
      expiryTime: Date.now() + (isAdminRole ? this.ADMIN_SESSION_TIMEOUT : this.USER_SESSION_TIMEOUT),
      isAdminRole,
      userRole
    };
    
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
    localStorage.setItem(this.SESSION_INFO_KEY, JSON.stringify(sessionData));
    
    console.log(`Session saved for ${userRole}, expires in ${isAdminRole ? '30 minutes' : '24 hours'}`);
  }

  /**
   * Kiểm tra session có hợp lệ không
   */
  static isSessionValid(): boolean {
    try {
      const sessionInfo = localStorage.getItem(this.SESSION_INFO_KEY);
      const token = localStorage.getItem(this.TOKEN_KEY);
      
      if (!sessionInfo || !token) {
        return false;
      }

      const session = JSON.parse(sessionInfo);
      const currentTime = Date.now();

      // Kiểm tra session đã hết hạn chưa
      if (currentTime > session.expiryTime) {
        console.log('Session expired, clearing...');
        this.clearSession();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking session validity:', error);
      this.clearSession();
      return false;
    }
  }

  /**
   * Kiểm tra có phải admin session không
   */
  static isAdminSession(): boolean {
    try {
      const sessionInfo = localStorage.getItem(this.SESSION_INFO_KEY);
      if (!sessionInfo) return false;

      const session = JSON.parse(sessionInfo);
      return session.isAdminRole === true;
    } catch {
      return false;
    }
  }

  /**
   * Lấy user role từ session
   */
  static getUserRole(): string | null {
    try {
      const sessionInfo = localStorage.getItem(this.SESSION_INFO_KEY);
      if (!sessionInfo) return null;

      const session = JSON.parse(sessionInfo);
      return session.userRole || null;
    } catch {
      return null;
    }
  }

  /**
   * Lấy thông tin user từ session
   */
  static getUserInfo(): { role?: string; [key: string]: unknown } | null {
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      if (!userStr) return null;

      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Lấy token từ session
   */
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Lấy refresh token từ session
   */
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Xóa session hoàn toàn
   */
  static clearSession() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.SESSION_INFO_KEY);
    console.log('Session cleared');
  }

  /**
   * Gia hạn session (refresh expiry time)
   */
  static extendSession(): boolean {
    try {
      const sessionInfo = localStorage.getItem(this.SESSION_INFO_KEY);
      if (!sessionInfo) return false;

      const session = JSON.parse(sessionInfo);
      const newExpiryTime = Date.now() + (session.isAdminRole ? this.ADMIN_SESSION_TIMEOUT : this.USER_SESSION_TIMEOUT);
      
      session.expiryTime = newExpiryTime;
      localStorage.setItem(this.SESSION_INFO_KEY, JSON.stringify(session));
      
      return true;
    } catch (error) {
      console.error('Error extending session:', error);
      return false;
    }
  }

  /**
   * Lấy thời gian còn lại của session (ms)
   */
  static getTimeRemaining(): number {
    try {
      const sessionInfo = localStorage.getItem(this.SESSION_INFO_KEY);
      if (!sessionInfo) return 0;

      const session = JSON.parse(sessionInfo);
      const remaining = session.expiryTime - Date.now();
      
      return Math.max(0, remaining);
    } catch {
      return 0;
    }
  }

  /**
   * Kiểm tra session sắp hết hạn (còn < 5 phút)
   */
  static isSessionExpiringSoon(): boolean {
    const remaining = this.getTimeRemaining();
    return remaining > 0 && remaining < (5 * 60 * 1000); // 5 phút
  }
} 