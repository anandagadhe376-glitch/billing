// ═══════════════════════════════════════════════════════════════
//  auth-guard.js — Billing Panel Security (Module version)
//  Compat library conflict fix — seedha fetch use karta hai
// ═══════════════════════════════════════════════════════════════

(function () {

  var FIREBASE_CONFIG = {
    apiKey: "AIzaSyBsRxWD2R1GkSEM-duLwQe3jAi7yw5vvvM",
    authDomain: "restaurant-system-beec1.firebaseapp.com",
    projectId: "restaurant-system-beec1",
    storageBucket: "restaurant-system-beec1.firebasestorage.app",
    messagingSenderId: "106757122327",
    appId: "1:106757122327:web:723d8dacbba3087b686f52"
  };

  // Page hide karo jab tak check na ho
  document.documentElement.style.visibility = 'hidden';

  // ── SAFETY NET: billing.js localStorage mein bina restaurantId tag ke
  // data save karta hai (lum_tables, lum_orders, lum_menu, etc.).
  // Isliye yahan ek "lum_active_restaurant" tag rakhte hain — agar wo
  // tag current restaurant se mismatch kare (same browser, doosra
  // restaurant login hua), to purana cached data turant clear kar do.
  function clearStaleRestaurantCache(newRestaurantId) {
    var lastRid = null;
    try { lastRid = localStorage.getItem('lum_active_restaurant'); } catch(e) {}
    if (lastRid && lastRid !== newRestaurantId) {
      Object.keys(localStorage).forEach(function (k) {
        if (k.indexOf('lum_') === 0 || k.indexOf('es_') === 0 || k === 'smStaff') {
          localStorage.removeItem(k);
        }
      });
      console.warn('[AuthGuard] Restaurant change detect hua — purana cache clear:', lastRid, '->', newRestaurantId);
    }
    try { localStorage.setItem('lum_active_restaurant', newRestaurantId); } catch(e) {}
  }

  // ── CRITICAL FIX: Firebase Firestore ko request.auth chahiye hota hai
  // server-side rule verification ke liye. Sirf localStorage se variables
  // set karne se Firebase SDK ka apna internal Auth state populate NAHI
  // hota — isliye Firestore queries "permission-denied" deti thi chahe
  // rules kitni bhi loose ho. Ye function background me Firebase Auth ka
  // persisted session (IndexedDB se) restore karta hai, taaki request.auth
  // hamesha sahi se set ho — chahe fast-path se UI turant dikh jaye.
  var _firebaseAuthConfirmed = false;
  function ensureFirebaseAuthRestored() {
    function waitForFirebase(cb) {
      if (window.__firebaseModules && window.__firebaseModules.getAuth) {
        cb(window.__firebaseModules);
      } else {
        document.addEventListener('firebaseModulesReady', function() {
          import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js')
            .then(function(authMod) { cb(authMod); });
        }, { once: true });
      }
    }
    waitForFirebase(function(authMod) {
      try {
        var app = window.__fbApp;
        if (!app) {
          var { initializeApp, getApps } = authMod;
          app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
          window.__fbApp = app;
        }
        var auth = authMod.getAuth ? authMod.getAuth(app) : null;
        if (!auth) return;
        authMod.onAuthStateChanged(auth, function(user) {
          if (user) {
            _firebaseAuthConfirmed = true;
            console.log('[AuthGuard] ✅ Firebase Auth state confirmed (request.auth ab populated hai) — UID:', user.uid);
          } else {
            // Firebase ko khud lagta hai koi logged-in user nahi —
            // matlab persisted session expire/missing hai. Login pe bhejo,
            // chahe localStorage me purana sip_session pada ho.
            console.warn('[AuthGuard] ⚠️ Firebase Auth: koi user nahi mila — localStorage session ke bawajood. Login pe redirect.');
            localStorage.removeItem('sip_session');
            window.location.href = 'login.html';
          }
        });
      } catch(e) {
        console.error('[AuthGuard] ensureFirebaseAuthRestored error:', e);
      }
    });
  }

  // ── Pehle localStorage session check karo (fast path) ──────────
  var session = null;
  try { session = JSON.parse(localStorage.getItem('sip_session') || 'null'); } catch(e) {}

  if (session && session.uid && session.restaurantId && session.loginAt) {
    var SESSION_TTL = 12 * 60 * 60 * 1000; // 12 ghante
    if ((Date.now() - session.loginAt) < SESSION_TTL) {
      // Valid session — UI turant dikhao (fast path), LEKIN saath hi
      // background me Firebase ka apna Auth state bhi confirm karo —
      // warna Firestore reads silently fail honge.
      clearStaleRestaurantCache(session.restaurantId);
      window._sip_restaurantId   = session.restaurantId;
      window._sip_userRole       = session.role || 'owner';
      window._sip_uid            = session.uid;
      window._sip_userEmail      = session.email || '';
      window._sip_restaurantName = session.restaurantName || '';
      console.log('[AuthGuard] ✅ Session valid — Restaurant:', session.restaurantId);
      document.documentElement.style.visibility = 'visible';
      ensureFirebaseAuthRestored(); // 🔑 ye line missing thi pehle
      return;
    }
  }

  // ── Session nahi mila — Firebase Auth REST API se verify karo ──
  // Firebase module load hone ka wait karo
  function waitForFirebase(cb) {
    if (window.__firebaseModules && window.__firebaseModules.getAuth) {
      cb(window.__firebaseModules);
    } else {
      document.addEventListener('firebaseModulesReady', function() {
        // getAuth import karo separately
        import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js')
          .then(function(authMod) {
            import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
              .then(function(fsMod) {
                cb({ authMod: authMod, fsMod: fsMod });
              });
          });
      });
    }
  }

  waitForFirebase(function(mods) {
    try {
      var authMod = mods.authMod || mods;
      var fsMod   = mods.fsMod  || mods;

      // Firebase app already initialized by billing.js
      var app  = window.__fbApp;
      if (!app) {
        // Fallback — apna init karo
        var { initializeApp, getApps } = mods;
        app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
      }

      var auth = authMod.getAuth ? authMod.getAuth(app) : null;
      var db   = window.__fbDb;

      if (!auth) {
        console.warn('[AuthGuard] Auth module nahi mila — session se proceed');
        document.documentElement.style.visibility = 'visible';
        return;
      }

      authMod.onAuthStateChanged(auth, function(user) {
        if (!user) {
          console.warn('[AuthGuard] No user — login pe redirect');
          localStorage.removeItem('sip_session');
          window.location.href = 'login.html';
          return;
        }

        var uid = user.uid;

        // Firestore se restaurantId dhundo
        if (!db) db = window.__fbDb;

        var usersRef = fsMod.doc ? fsMod.doc(db, 'users', uid) : null;

        if (usersRef) {
          fsMod.getDoc(usersRef).then(function(snap) {
            if (snap.exists() && snap.data().restaurantId) {
              var d = snap.data();
              _setSession(uid, user.email, d.restaurantId, d.role || 'owner', d.name || '');
            } else {
              // restaurants collection mein check karo
              var q = fsMod.query(
                fsMod.collection(db, 'restaurants'),
                fsMod.where('ownerUid', '==', uid)
              );
              fsMod.getDocs(q).then(function(rSnap) {
                if (!rSnap.empty) {
                  var rd  = rSnap.docs[0].data();
                  var rid = rd.restaurantId || rSnap.docs[0].id;
                  _setSession(uid, user.email, rid, 'owner', rd.ownerName || rd.name || '');
                } else {
                  console.error('[AuthGuard] Restaurant nahi mila');
                  alert('Restaurant account nahi mila — admin se contact karo');
                  window.location.href = 'login.html';
                }
              });
            }
          }).catch(function(err) {
            console.error('[AuthGuard] Firestore error:', err);
            document.documentElement.style.visibility = 'visible';
          });
        } else {
          document.documentElement.style.visibility = 'visible';
        }
      });

    } catch(e) {
      console.error('[AuthGuard] Error:', e);
      document.documentElement.style.visibility = 'visible';
    }
  });

  function _setSession(uid, email, restaurantId, role, name) {
    clearStaleRestaurantCache(restaurantId);
    _firebaseAuthConfirmed = true;
    window._sip_restaurantId   = restaurantId;
    window._sip_userRole       = role;
    window._sip_uid            = uid;
    window._sip_userEmail      = email;
    window._sip_restaurantName = name;

    localStorage.setItem('sip_session', JSON.stringify({
      restaurantId  : restaurantId,
      uid           : uid,
      email         : email,
      role          : role,
      restaurantName: name,
      loginAt       : Date.now()
    }));

    console.log('[AuthGuard] ✅ Auth OK — Restaurant:', restaurantId, '| Role:', role);
    document.documentElement.style.visibility = 'visible';
  }

})();