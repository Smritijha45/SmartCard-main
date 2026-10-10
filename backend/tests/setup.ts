process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test_access_secret_super_secure_key_12345';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_super_secure_key_12345';
process.env.RAZORPAY_KEY_ID = 'rzp_test_testkey123';
process.env.RAZORPAY_KEY_SECRET = 'rzp_test_secret1234567890';
process.env.RAZORPAY_WEBHOOK_SECRET = 'rzp_test_webhook_secret_xyz';

// Silence console logs during testing
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});
