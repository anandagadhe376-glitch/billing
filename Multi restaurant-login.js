// ═══════════════════════════════════════════════════════════════════
//  SIPLORA — MULTI-RESTAURANT LOGIN SYSTEM
//  Is file ko billing.js se PEHLE HTML mein load karo
//  <script src="multi-restaurant-login.js"></script>
// ═══════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ── CSS Styles ──────────────────────────────────────────────────
  var styles = `
    #sip-login-overlay {
      position: fixed; inset: 0; z-index: 99999;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1208 50%, #0d0d0d 100%);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Segoe UI', sans-serif;
    }
    #sip-login-overlay.sip-hidden { display: none !important; }

    .sip-login-box {
      background: rgba(20,16,8,0.95);
      border: 1px solid rgba(201,168,76,0.25);
      border-radius: 18px;
      padding: 40px 36px 32px;
      width: 100%; max-width: 420px;
      box-shadow: 0 0 60px rgba(201,168,76,0.08), 0 24px 48px rgba(0,0,0,0.6);
      position: relative;
    }
    .sip-login-logo {
      text-align: center; margin-bottom: 28px;
    }
    .sip-login-logo .sip-brand {
      font-size: 28px; font-weight: 800;
      letter-spacing: 6px; color: #c9a84c;
      text-transform: uppercase;
    }
    .sip-login-logo .sip-tagline {
      font-size: 10px; color: rgba(201,168,76,0.45);
      letter-spacing: 3px; margin-top: 4px;
      text-transform: uppercase;
    }
    .sip-divider {
      height: 1px; background: linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent);
      margin: 0 0 28px;
    }
    .sip-field { margin-bottom: 16px; }
    .sip-field label {
      display: block; font-size: 10px; letter-spacing: 2px;
      color: rgba(201,168,76,0.6); text-transform: uppercase; margin-bottom: 7px;
    }
    .sip-field input, .sip-field select {
      width: 100%; background: rgba(255,255,255,0.04);
      border: 1px solid rgba(201,168,76,0.2);
      border-radius: 9px; padding: 12px 14px;
      color: rgba(245,240,232,0.9); font-size: 14px;
      outline: none; transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
      -webkit-appearance: none; appearance: none;
    }
    .sip-field select {
      cursor: pointer;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23c9a84c' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 12px center;
      padding-right: 36px;
    }
    .sip-field select option {
      background: #1a1208; color: rgba(245,240,232,0.9);
    }
    .sip-field input:focus, .sip-field select:focus {
      border-color: rgba(201,168,76,0.55);
      box-shadow: 0 0 0 3px rgba(201,168,76,0.08);
    }
    .sip-pw-wrap { position: relative; }
    .sip-pw-wrap input { padding-right: 44px; }
    .sip-pw-toggle {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer;
      color: rgba(201,168,76,0.5); font-size: 16px; padding: 4px;
    }
    .sip-pw-toggle:hover { color: #c9a84c; }
    .sip-btn-login {
      width: 100%; padding: 14px;
      background: linear-gradient(135deg, #c9a84c 0%, #e8c96e 50%, #c9a84c 100%);
      border: none; border-radius: 10px; cursor: pointer;
      font-size: 13px; font-weight: 700; letter-spacing: 3px;
      color: #1a1208; text-transform: uppercase;
      margin-top: 8px; transition: opacity 0.2s, transform 0.1s;
    }
    .sip-btn-login:hover { opacity: 0.92; transform: translateY(-1px); }
    .sip-btn-login:active { transform: translateY(0); }
    .sip-error {
      font-size: 12px; color: #e74c3c; text-align: center;
      margin-top: 12px; min-height: 18px; letter-spacing: 0.5px;
    }
    .sip-footer {
      text-align: center; margin-top: 24px;
      font-size: 9px; color: rgba(201,168,76,0.25);
      letter-spacing: 2px; text-transform: uppercase;
    }
    @keyframes sipShake {
      0%,100%{ transform: translateX(0); }
      20%{ transform: translateX(-8px); }
      40%{ transform: translateX(8px); }
      60%{ transform: translateX(-5px); }
      80%{ transform: translateX(5px); }
    }
    .sip-shake { animation: sipShake 0.4s ease; }
  `;

  // ── Inject CSS ───────────────────────────────────────────────────
  var styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // ── Restaurant Config ─────────────────────────────────────────────
  // Firestore mein 'restaurants' collection mein har restaurant ka document hona chahiye
  // Har document mein ye fields honge:
  //   name, addr, phone, gst, fssai, gstRate, service
  //   Aur is document ka ID hi restaurantId hoga
  //
  // CREDENTIALS FORMAT (Firestore 'restaurants/{id}/settings/auth' document mein):
  //   { users: [ { email: "owner@abc.com", password: "pass123", role: "owner" }, ... ] }
  //
  // YA: Neeche hardcode karo multiple restaurants
  //
  // ── YAHAN APNE RESTAURANTS ADD KARO ──────────────────────────────
  var RESTAURANTS = [
    {
      id: 'restaurant_001',          // Firestore mein document ID
      name: 'Siplora restaurant',                // Display name (login screen pe)
    },
    {
      id: 'restaurant_002',
      name: 'Siplora Koregaon Park',
    },
    {
      id: 'restaurant_003',
      name: 'poonam',
    },
    // Aur restaurants yahan add karo...
  ];
  // ─────────────────────────────────────────────────────────────────

  // ── Storage helpers ──────────────────────────────────────────────
  function sipStore(key, val) {
    try { localStorage.setItem('sip_' + key, JSON.stringify(val)); } catch(e) {}
  }
  function sipLoad(key, def) {
    try {
      var v = localStorage.getItem('sip_' + key);
      return v !== null ? JSON.parse(v) : def;
    } catch(e) { return def; }
  }

  // ── Build Login UI ───────────────────────────────────────────────
  function buildLoginOverlay() {
    var overlay = document.createElement('div');
    overlay.id = 'sip-login-overlay';

    var restaurantOptions = RESTAURANTS.map(function(r) {
      return '<option value="' + r.id + '">' + r.name + '</option>';
    }).join('');

    overlay.innerHTML = `
      <div class="sip-login-box" id="sip-login-box">
        <div class="sip-login-logo">
          <div class="sip-brand">Siplora</div>
          <div class="sip-tagline">Restaurant Management System</div>
        </div>
        <div class="sip-divider"></div>

        <div class="sip-field">
          <label>Restaurant Select Karo</label>
          <select id="sip-restaurant-sel">
            ${restaurantOptions}
          </select>
        </div>

        <div class="sip-field">
          <label>Email / Username</label>
          <input type="email" id="sip-email" placeholder="owner@restaurant.com"
            autocomplete="username" />
        </div>

        <div class="sip-field">
          <label>Password</label>
          <div class="sip-pw-wrap">
            <input type="password" id="sip-password" placeholder="••••••••"
              autocomplete="current-password" />
            <button class="sip-pw-toggle" onclick="window._sipTogglePw()" type="button">👁</button>
          </div>
        </div>

        <button class="sip-btn-login" onclick="window._sipDoLogin()">
          Login &rarr;
        </button>

        <div class="sip-error" id="sip-err"></div>

        <div class="sip-footer">Powered by Siplora &middot; Secure Login</div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  // ── Toggle password visibility ───────────────────────────────────
  window._sipTogglePw = function() {
    var inp = document.getElementById('sip-password');
    if (!inp) return;
    inp.type = inp.type === 'password' ? 'text' : 'password';
  };

  // ── Login Logic ──────────────────────────────────────────────────
  window._sipDoLogin = async function() {
    var selectedRestaurantId = (document.getElementById('sip-restaurant-sel') || {}).value || '';
    var email = ((document.getElementById('sip-email') || {}).value || '').trim();
    var password = ((document.getElementById('sip-password') || {}).value || '').trim();
    var errEl = document.getElementById('sip-err');
    var box = document.getElementById('sip-login-box');

    if (errEl) errEl.textContent = '';

    if (!selectedRestaurantId) { showErr('Restaurant select karo'); return; }
    if (!email) { showErr('Email daalo'); return; }
    if (!password) { showErr('Password daalo'); return; }

    var btn = document.querySelector('.sip-btn-login');
    if (btn) { btn.textContent = 'Checking...'; btn.disabled = true; }

    function showErr(msg) {
      if (errEl) errEl.textContent = msg;
      if (btn) { btn.textContent = 'Login →'; btn.disabled = false; }
    }

    try {
      // ── Step 1: Firebase modules load hone ka wait karo ──────────
      if (!window._siploraFirebaseLoad) {
        showErr('App abhi load ho rahi hai, ek second baad try karo');
        return;
      }
      var db = await window._siploraFirebaseLoad();

      // ── Step 2: Firebase Auth se signIn karo ─────────────────────
      // Firebase Auth module import karo (CDN se)
      var authMod;
      try {
        authMod = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
      } catch(e) {
        console.error('[Siplora] Firebase Auth import failed:', e);
        showErr('Auth module load nahi hua — internet check karo');
        return;
      }

      var { getAuth, signInWithEmailAndPassword } = authMod;
      var auth = getAuth();

      var userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch(authErr) {
        // Firebase Auth error codes
        var errCode = authErr.code || '';
        if (errCode === 'auth/user-not-found' || errCode === 'auth/wrong-password' || errCode === 'auth/invalid-credential') {
          showErr('❌ Galat email ya password');
        } else if (errCode === 'auth/invalid-email') {
          showErr('❌ Email format galat hai');
        } else if (errCode === 'auth/too-many-requests') {
          showErr('❌ Bahut zyada attempts — kuch der baad try karo');
        } else {
          showErr('❌ Login error: ' + (authErr.message || errCode));
        }
        if (box) { box.classList.add('sip-shake'); setTimeout(function(){ box.classList.remove('sip-shake'); }, 450); }
        return;
      }

      // ── Step 3: Firebase Auth success — ab Firestore se verify karo ──
      // Check karo ke ye user is restaurantId ka hi authorized user hai
      var uid = userCredential.user.uid;

      // window.__getDoc set karo agar nahi hai
      if (!window.__getDoc && window.__firebaseModules) {
        window.__getDoc = window.__firebaseModules.getDoc;
      }
      // Agar getDoc abhi bhi nahi hai to import karo
      if (!window.__getDoc) {
        var fsModForGet = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
        window.__getDoc = fsModForGet.getDoc;
      }

      // Firestore mein 'restaurants/{restaurantId}' document dhundho
      // Verify karo ke is user ka uid ya email match karta hai
      var restaurantDocRef = window.__doc(db, 'restaurants', selectedRestaurantId);
      var restaurantSnap = await window.__getDoc(restaurantDocRef);

      if (!restaurantSnap.exists()) {
        // Restaurant document hi nahi mila — sign out karo
        try { await auth.signOut(); } catch(e) {}
        showErr('❌ Ye restaurant system mein registered nahi hai');
        if (box) { box.classList.add('sip-shake'); setTimeout(function(){ box.classList.remove('sip-shake'); }, 450); }
        return;
      }

      var restaurantData = restaurantSnap.data();

      // Verify: restaurant document mein uid ya email match karo
      // Tumhare document mein uid, email fields hain — dono check karo
      var docUid   = restaurantData.uid   || '';
      var docEmail = (restaurantData.email || '').toLowerCase();
      var loginEmail = email.toLowerCase();

      var isAuthorized = (docUid && docUid === uid) || (docEmail && docEmail === loginEmail);

      if (!isAuthorized) {
        // Ye user dusre restaurant ka hai — access band karo
        try { await auth.signOut(); } catch(e) {}
        showErr('❌ Aap is restaurant ke authorized user nahi hain');
        if (box) { box.classList.add('sip-shake'); setTimeout(function(){ box.classList.remove('sip-shake'); }, 450); }
        return;
      }

      // ── Step 4: LOGIN SUCCESS ─────────────────────────────────────
      var userRole = restaurantData.role || 'owner';
      var restaurantName = restaurantData.name || restaurantData.restaurantName || selectedRestaurantId;

      window._sip_restaurantId   = selectedRestaurantId;
      window._sip_userRole       = userRole;
      window._sip_restaurantName = restaurantName;
      window._sip_uid            = uid;
      window._sip_userEmail      = email;

      // Session save karo (12 ghante valid)
      sipStore('session', {
        restaurantId:   selectedRestaurantId,
        role:           userRole,
        email:          email,
        uid:            uid,
        restaurantName: restaurantName,
        loginAt:        Date.now()
      });

      // Restaurant settings RS object mein update karo (billing.js ke liye)
      await _sipLoadRestaurantSettings(selectedRestaurantId);

      // Login overlay hatao
      var overlay = document.getElementById('sip-login-overlay');
      if (overlay) overlay.classList.add('sip-hidden');

      console.log('[Siplora] ✅ Login success — Restaurant:', selectedRestaurantId, '| Role:', userRole, '| UID:', uid);

    } catch(e) {
      showErr('Connection error — internet check karo ya baad mein try karo');
      console.error('[Siplora] Login error:', e);
    }
  };

  // ── Load Restaurant Settings from Firestore ──────────────────────
  async function _sipLoadRestaurantSettings(restaurantId) {
    try {
      if (!window._siploraFirebaseLoad) return;
      var db = await window._siploraFirebaseLoad();
      if (!db || !window.__doc || !window.__getDoc) return;

      var settingsRef = window.__doc(db, 'restaurants', restaurantId, 'settings', 'info');
      var snap = await window.__getDoc(settingsRef);
      if (snap.exists && snap.exists()) {
        var data = snap.data();
        // RS (Restaurant Settings) update karo jo billing.js use karta hai
        if (window.RS) {
          if (data.name)    window.RS.name    = data.name;
          if (data.addr)    window.RS.addr    = data.addr;
          if (data.phone)   window.RS.phone   = data.phone;
          if (data.gst)     window.RS.gst     = data.gst;
          if (data.fssai)   window.RS.fssai   = data.fssai;
          if (data.gstRate) window.RS.gstRate = data.gstRate;
          if (data.service) window.RS.service = data.service;

          // UI mein restaurant name update karo
          document.querySelectorAll('#rs-name').forEach(function(e) {
            e.textContent = window.RS.name;
          });
        }
        // localStorage mein bhi save karo (billing.js ka load() use karta hai)
        try {
          var existing = JSON.parse(localStorage.getItem('settings') || '{}');
          var merged = Object.assign({}, existing, data);
          localStorage.setItem('settings', JSON.stringify(merged));
        } catch(e) {}

        console.log('[Siplora] Restaurant settings loaded:', data.name || restaurantId);
      }
    } catch(e) {
      console.warn('[Siplora] Settings load failed (offline ho sakta hai):', e.message);
    }
  }

  // ── Enter key se login ───────────────────────────────────────────
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      var overlay = document.getElementById('sip-login-overlay');
      if (overlay && !overlay.classList.contains('sip-hidden')) {
        window._sipDoLogin();
      }
    }
  });

  // ── Session restore (page refresh pe auto-login) ─────────────────
  async function _sipRestoreSession() {
    var session = sipLoad('session', null);
    if (!session) return false;

    // Session 12 ghante tak valid hai
    var SESSION_TTL = 12 * 60 * 60 * 1000;
    if (!session.loginAt || (Date.now() - session.loginAt) > SESSION_TTL) {
      sipStore('session', null);
      return false;
    }

    // Firebase Auth se bhi check karo ke user abhi bhi logged in hai
    try {
      var authMod = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
      var { getAuth } = authMod;
      var auth = getAuth();
      // getCurrentUser — agar null hai to session invalidate karo
      await new Promise(function(resolve) {
        var unsubscribe = auth.onAuthStateChanged(function(user) {
          unsubscribe();
          if (!user) {
            // Firebase session expire ho gayi
            sipStore('session', null);
            session = null;
          }
          resolve();
        });
        // 3 second timeout
        setTimeout(resolve, 3000);
      });
      if (!session) return false;
    } catch(e) {
      console.warn('[Siplora] Auth state check failed, session se proceed karo:', e.message);
    }

    // Valid session — restore karo
    window._sip_restaurantId   = session.restaurantId;
    window._sip_userRole       = session.role || 'owner';
    window._sip_restaurantName = session.restaurantName || session.restaurantId;
    window._sip_uid            = session.uid || '';
    window._sip_userEmail      = session.email || '';

    console.log('[Siplora] Session restored — Restaurant:', session.restaurantId);
    return true;
  }

  // ── Logout function (kahin se call kar sakte ho) ─────────────────
  window.sipLogout = function() {
    sipStore('session', null);
    window._sip_restaurantId = null;
    window._sip_restaurantName = null;
    // Page reload se fresh login screen aayega
    location.reload();
  };

  // ── getDoc import (agar __getDoc nahi hai to add karo) ──────────
  // billing.js mein __getDoc nahi tha, is function se fix karo
  document.addEventListener('firebaseModulesReady', function() {
    if (!window.__getDoc && window.__firebaseModules && window.__firebaseModules.getDoc) {
      window.__getDoc = window.__firebaseModules.getDoc;
    }
  });

  // ── INIT ─────────────────────────────────────────────────────────
  async function sipInit() {
    // Pehle session check karo (async — Firebase Auth verify karta hai)
    var hasSession = await _sipRestoreSession();

    if (hasSession) {
      // Session valid hai — settings background mein load karo
      if (window._sip_restaurantId) {
        var settingsTimer = setInterval(function() {
          if (window._siploraFirebaseLoad) {
            clearInterval(settingsTimer);
            _sipLoadRestaurantSettings(window._sip_restaurantId);
          }
        }, 300);
      }
    } else {
      // Login screen dikhao
      buildLoginOverlay();
    }
  }

  // DOM ready hone pe init karo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sipInit);
  } else {
    sipInit();
  }

})();