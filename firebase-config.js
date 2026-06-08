/**
 * ROYAL FURNITURE — Firebase Configuration
 * ==========================================
 * SETUP INSTRUCTIONS (do this once, takes 5 minutes):
 *
 * 1. Go to https://console.firebase.google.com
 * 2. Click "Add project" → name it "royal-furniture" → Continue
 * 3. Click the </> (Web) icon to add a web app → name it "Royal Furniture"
 * 4. Copy the firebaseConfig object and PASTE it below (replace the placeholder values)
 * 5. In Firebase Console → Authentication → Get Started
 *    → Enable "Email/Password" provider
 *    → Enable "Google" provider
 * 6. In Firebase Console → Firestore Database → Create database → Start in test mode
 * 7. Done! Your auth and database are live.
 */

// ══════════════════════════════════════════════════
//  PASTE YOUR FIREBASE CONFIG HERE (step 4 above)
// ══════════════════════════════════════════════════
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyAl09i7_4rePAvnsIxHwzq6S_1L87kVgoo" ,
  authDomain:        "royal-furniture-37cca.firebaseapp.com",
  projectId:         "royal-furniture-37cca",
  storageBucket:     "royal-furniture-37cca.firebasestorage.app",
  messagingSenderId: "1003091327592",
  appId:             "1:1003091327592:web:29821b346858b8573999dd"
};
// ══════════════════════════════════════════════════

// Make config available globally
window.ROYAL_FIREBASE_CONFIG = FIREBASE_CONFIG;
