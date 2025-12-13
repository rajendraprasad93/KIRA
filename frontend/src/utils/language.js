
export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' }
];

export const TRANSLATIONS = {
  en: {
    title: "GrievanceGenie",
    tagline: "Fix Your City in Minutes",
    login: "Login",
    signup: "Sign Up",
    fullName: "Full Name",
    phone: "Phone Number",
    email: "Email",
    ward: "Ward",
    detectWard: "Detect my ward",
    voiceSignup: "Voice Signup",
    continue: "Continue",
    or: "OR",
    alreadyAccount: "Already have account? Login",
    newUser: "New user? Sign up in 30 seconds",
    privacy: "Privacy Protected | 100% Secure",
    sendOTP: "Send OTP",
    enterOTP: "Enter OTP",
    resendOTP: "Resend OTP",
    welcome: "Welcome",
    loginSuccess: "Welcome back!",
    signupSuccess: "Account created successfully",
    errors: {
      phoneRequired: "Phone number is required",
      phoneInvalid: "Invalid phone number format",
      nameRequired: "Name is required",
      wardRequired: "Ward selection is required",
      otpInvalid: "Invalid OTP"
    }
  },
  // Add other languages as needed, defaulting to English for now to avoid errors
};

export const getTranslation = (lang, key) => {
  const keys = key.split('.');
  let current = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  
  for (const k of keys) {
    if (current[k] === undefined) {
      return key; // Return key if translation missing
    }
    current = current[k];
  }
  return current;
};
