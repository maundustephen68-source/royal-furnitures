/**
 * ROYAL FURNITURE — Authentication Module (auth.js)
 * Handles: Sign Up, Login, Google Sign-In, Email Verification,
 *          Password Reset, Session Management, Logout
 *
 * Requires: firebase-config.js loaded before this file
 * Uses:     Firebase v9 (modular SDK via CDN compat build)
 */

// ─── Firebase SDK (loaded via CDN in HTML) ─────────────────────────────────
// We use the compat (v8-style) SDK for simplicity in plain HTML projects.

let _auth = null;
let _db   = null;
let _googleProvider = null;

/**
 * Initialise Firebase once. Safe to call multiple times.
 */
function rfInitFirebase() {
  if (_auth) return; // already initialised

  const cfg = window.ROYAL_FIREBASE_CONFIG;
  if (!cfg || cfg.apiKey === 'YOUR_API_KEY') {
    console.warn('[Royal Furniture] Firebase not configured. Open firebase-config.js and add your project credentials.');
    return;
  }

  firebase.initializeApp(cfg);
  _auth           = firebase.auth();
  _db             = firebase.firestore();
  _googleProvider = new firebase.auth.GoogleAuthProvider();
  _googleProvider.addScope('email');
  _googleProvider.addScope('profile');

  // Persist session across browser tabs
  _auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  // Listen for auth state changes → update nav on every page
  _auth.onAuthStateChanged(function (user) {
    rfUpdateNav(user);
    if (typeof window.rfOnAuthStateChanged === 'function') {
      window.rfOnAuthStateChanged(user);
    }
  });
}

// ─── NAV UPDATE ────────────────────────────────────────────────────────────
function rfUpdateNav(user) {
  const loginLink   = document.getElementById('nav-login-link');
  const logoutLink  = document.getElementById('nav-logout-link');
  const trackLink   = document.getElementById('nav-track-link');
  const userDisplay = document.getElementById('nav-user-display');

  if (user) {
    if (loginLink)   loginLink.style.display   = 'none';
    if (logoutLink)  logoutLink.style.display   = 'inline-block';
    if (trackLink)   trackLink.style.display    = 'inline-block';
    if (userDisplay) {
      const name = user.displayName ? user.displayName.split(' ')[0] : user.email.split('@')[0];
      userDisplay.textContent = `👤 ${name}`;
      userDisplay.style.display = 'inline-block';
    }
  } else {
    if (loginLink)   loginLink.style.display   = 'inline-block';
    if (logoutLink)  logoutLink.style.display   = 'none';
    if (trackLink)   trackLink.style.display    = 'none';
    if (userDisplay) userDisplay.style.display  = 'none';
  }
}

// ─── SIGN UP WITH EMAIL + PASSWORD ─────────────────────────────────────────
async function rfSignUp(fullName, email, password) {
  if (!_auth) throw new Error('Firebase not configured.');

  // Create account
  const cred = await _auth.createUserWithEmailAndPassword(email, password);
  const user  = cred.user;

  // Set display name
  await user.updateProfile({ displayName: fullName });

  // Send email verification
  await user.sendEmailVerification({
    url: window.location.origin + '/Home.html',
  });

  // Save user profile to Firestore
  await _db.collection('users').doc(user.uid).set({
    uid:       user.uid,
    fullName:  fullName,
    email:     email,
    provider:  'email',
    verified:  false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    orders:    []
  });

  return user;
}

// ─── LOGIN WITH EMAIL + PASSWORD ───────────────────────────────────────────
async function rfLogin(email, password) {
  if (!_auth) throw new Error('Firebase not configured.');
  const cred = await _auth.signInWithEmailAndPassword(email, password);
  return cred.user;
}

// ─── GOOGLE SIGN-IN ────────────────────────────────────────────────────────
async function rfGoogleSignIn() {
  if (!_auth) throw new Error('Firebase not configured.');

  const result = await _auth.signInWithPopup(_googleProvider);
  const user   = result.user;
  const isNew  = result.additionalUserInfo.isNewUser;

  if (isNew) {
    // Save new Google user to Firestore
    await _db.collection('users').doc(user.uid).set({
      uid:       user.uid,
      fullName:  user.displayName || '',
      email:     user.email,
      photo:     user.photoURL || '',
      provider:  'google',
      verified:  true,   // Google accounts are pre-verified
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      orders:    []
    });
  }

  return { user, isNew };
}

// ─── LOGOUT ────────────────────────────────────────────────────────────────
async function rfLogout() {
  if (!_auth) return;
  await _auth.signOut();
  window.location.href = 'Home.html';
}

// ─── PASSWORD RESET EMAIL ──────────────────────────────────────────────────
async function rfResetPassword(email) {
  if (!_auth) throw new Error('Firebase not configured.');
  await _auth.sendPasswordResetEmail(email, {
    url: window.location.origin + '/login.html',
  });
}

// ─── GET CURRENT USER ──────────────────────────────────────────────────────
function rfCurrentUser() {
  return _auth ? _auth.currentUser : null;
}

// ─── SAVE ORDER TO FIRESTORE ───────────────────────────────────────────────
async function rfSaveOrder(orderData) {
  if (!_auth || !_db) throw new Error('Firebase not configured.');
  const user = _auth.currentUser;
  if (!user) throw new Error('You must be logged in to place an order.');

  const orderId = 'RF-' + Date.now();
  const order   = {
    orderId:    orderId,
    userId:     user.uid,
    userEmail:  user.email,
    userName:   user.displayName || user.email,
    items:      orderData.items,
    total:      orderData.total,
    status:     'Confirmed',
    statusHistory: [
      { status: 'Order Placed',  time: new Date().toISOString() },
      { status: 'Confirmed',     time: new Date().toISOString() }
    ],
    placedAt:   firebase.firestore.FieldValue.serverTimestamp(),
    delivery: {
      address:  orderData.address || '',
      phone:    orderData.phone   || '',
      notes:    orderData.notes   || ''
    },
    estimatedDelivery: rfEstimatedDelivery()
  };

  await _db.collection('orders').doc(orderId).set(order);

  // Also push orderId to user's document
  await _db.collection('users').doc(user.uid).update({
    orders: firebase.firestore.FieldValue.arrayUnion(orderId)
  });

  return orderId;
}

// ─── GET ORDERS FOR CURRENT USER ──────────────────────────────────────────
async function rfGetMyOrders() {
  if (!_auth || !_db) throw new Error('Firebase not configured.');
  const user = _auth.currentUser;
  if (!user) throw new Error('Not logged in.');

  const snap = await _db.collection('orders')
    .where('userId', '==', user.uid)
    .orderBy('placedAt', 'desc')
    .get();

  return snap.docs.map(doc => doc.data());
}

// ─── GET SINGLE ORDER BY ID ────────────────────────────────────────────────
async function rfGetOrder(orderId) {
  if (!_db) throw new Error('Firebase not configured.');
  const doc = await _db.collection('orders').doc(orderId).get();
  if (!doc.exists) throw new Error('Order not found.');
  return doc.data();
}

// ─── HELPERS ───────────────────────────────────────────────────────────────
function rfEstimatedDelivery() {
  const d = new Date();
  d.setDate(d.getDate() + 5); // 5 business days
  return d.toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function rfFriendlyError(code) {
  const map = {
    'auth/email-already-in-use':    'This email is already registered. Please log in.',
    'auth/invalid-email':           'Please enter a valid email address.',
    'auth/weak-password':           'Password must be at least 6 characters.',
    'auth/user-not-found':          'No account found with this email.',
    'auth/wrong-password':          'Incorrect password. Please try again.',
    'auth/too-many-requests':       'Too many attempts. Please wait a few minutes.',
    'auth/network-request-failed':  'Network error. Check your internet connection.',
    'auth/popup-closed-by-user':    'Google sign-in was cancelled.',
    'auth/cancelled-popup-request': 'Google sign-in was cancelled.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}

// ─── PASSWORD STRENGTH CHECKER ─────────────────────────────────────────────
function rfPasswordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8)            score++;
  if (/[A-Z]/.test(pwd))         score++;
  if (/[0-9]/.test(pwd))         score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (pwd.length >= 12)           score++;
  if (score <= 1) return { label: 'Weak',   color: '#e74c3c', pct: 25  };
  if (score <= 2) return { label: 'Fair',   color: '#f39c12', pct: 50  };
  if (score <= 3) return { label: 'Good',   color: '#2980b9', pct: 75  };
  return               { label: 'Strong', color: '#27ae60', pct: 100 };
}

// ─── AUTO-INIT ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', rfInitFirebase);
