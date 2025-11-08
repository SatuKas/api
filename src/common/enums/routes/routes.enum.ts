export enum Routes {
  // Health check
  HEALTH = 'health',

  // Auth
  AUTH = 'auth',
  AUTH_REGISTER = 'register',
  AUTH_LOGIN = 'login',
  AUTH_REFRESH_TOKEN = 'refresh-token',
  AUTH_LOGOUT = 'logout',
  AUTH_LOGOUT_BY_DEVICE_ID = 'logout/device/:device_id',
  AUTH_EMAIL_VERIFY = 'verify-email',
  AUTH_RESEND_VERIFICATION = 'resend-verification',
  AUTH_FORGOT_PASSWORD = 'forgot-password',
  AUTH_VERIFY_EMAIL_FROM_LINK = 'verify-email/:token',
  AUTH_RESET_PASSWORD = 'reset-password',

  // User
  USER = 'user',
  USER_CURRENT_INFO = 'me',

  // Book
  BOOK = 'books',
  BOOK_SHARED = 'shared',
  BOOK_DETAIL = ':book_id',
  BOOK_DELETE = ':book_id',

  // COA
  COA = 'accounts',

  // Transaction
  TRANSACTION = 'transactions',
  TRANSACTION_ENTRY = 'entry',

  // Journal
  JOURNAL = 'journals',
  JOURNAL_DETAIL = ':journal_id',
  JOURNAL_DELETE = ':journal_id',
}
