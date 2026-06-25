// ═══════════════════════════════════════════════════════════════════
//  CHEF & CAPTAIN AUTH FIX — chef-captain-auth-fix.js
//
//  PROBLEM JO YE FIX KARTA HAI:
//  billing.js mein chef/captain create karte waqt sirf Firestore mein
//  data save hota tha — Firebase Auth mein account NAHI banta tha.
//  Isliye chef/captain apne email+password se login nahi kar pa rahe the.
//
//  YE FILE KO BILLING.JS KE BAAD LOAD KARO:
//  <script src="auth-guard.js"></script>
//  <script src="multi-restaurant-fix.js"></script>
//  <script src="billing.js"></script>
//  <script src="chef-captain-auth-fix.js"></script>  ← YE ADD KARO
// ═══════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  // ── Firebase Auth helper — Secondary App use karta hai ────────────
  // IMPORTANT: Hum secondary Firebase app use karte hain taaki
  // chef/captain create karne se owner ka apna login session DISTURB na ho.
  // createUserWithEmailAndPassword normally current user ko replace kar deta hai.

  var FIREBASE_CONFIG = {
    apiKey: "AIzaSyBsRxWD2R1GkSEM-duLwQe3jAi7yw5vvvM",
    authDomain: "restaurant-system-beec1.firebaseapp.com",
    projectId: "restaurant-system-beec1",
    storageBucket: "restaurant-system-beec1.firebasestorage.app",
    messagingSenderId: "106757122327",
    appId: "1:106757122327:web:723d8dacbba3087b686f52"
  };

  // Firebase Auth mein account banana (secondary app ke through)
  async function createFirebaseAuthAccount(email, password) {
    try {
      var authMod = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
      var appMod  = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');

      var { initializeApp, getApps, deleteApp } = appMod;
      var { getAuth, createUserWithEmailAndPassword } = authMod;

      // Secondary app banao — owner ka session safe rahega
      var secondaryAppName = 'sip-secondary-' + Date.now();
      var secondaryApp = initializeApp(FIREBASE_CONFIG, secondaryAppName);
      var secondaryAuth = getAuth(secondaryApp);

      var userCred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      var uid = userCred.user.uid;

      // Secondary app delete karo — zarurat nahi ab
      await deleteApp(secondaryApp);

      console.log('[AuthFix] ✅ Firebase Auth account bana:', email, '| UID:', uid);
      return { success: true, uid: uid };

    } catch (err) {
      var code = err.code || '';
      if (code === 'auth/email-already-in-use') {
        // Account pehle se hai — ye theek hai, sirf UID fetch karo
        console.log('[AuthFix] ℹ️ Account pehle se exist karta hai:', email);
        return { success: true, alreadyExists: true };
      }
      console.error('[AuthFix] ❌ Auth account create error:', err.message);
      return { success: false, error: err.message, code: code };
    }
  }

  // ── Firestore mein bhi users/{uid} document banao ─────────────────
  // Taaki auth-guard.js usse restaurantId se map kar sake
  async function saveUserToFirestore(uid, email, role, restaurantId, name) {
    try {
      var db = window.__fbDb;
      if (!db) return;
      var docRef = window.__doc(db, 'users', uid);
      await window.__setDoc(docRef, {
        uid          : uid,
        email        : email,
        role         : role,
        restaurantId : restaurantId,
        name         : name || '',
        createdAt    : Date.now()
      }, { merge: true });
      console.log('[AuthFix] ✅ users/' + uid + ' Firestore mein save hua');
    } catch (e) {
      console.warn('[AuthFix] Firestore users save warning:', e.message);
    }
  }


  // ════════════════════════════════════════════════════════════════
  //  CHEF ADD FUNCTION PATCH
  // ════════════════════════════════════════════════════════════════

  function patchCpAddChef() {
    if (!window.cpAddChef || window.cpAddChef._authPatched) return;

    var originalCpAddChef = window.cpAddChef;

    window.cpAddChef = async function () {
      // Input values pehle padho (original function clear kar deta hai)
      var nameEl  = document.getElementById('cp-add-name');
      var emailEl = document.getElementById('cp-add-email');
      var pwEl    = document.getElementById('cp-add-password');
      var errEl   = document.getElementById('cp-add-error');

      var name     = (nameEl  && nameEl.value  || '').trim();
      var email    = (emailEl && emailEl.value || '').trim();
      var password = (pwEl    && pwEl.value    || '').trim();

      // Basic validation (original se duplicate, safety ke liye)
      if (!name || !email || !password) return originalCpAddChef();
      if (password.length < 4) return originalCpAddChef();

      // Button disable karo wait ke liye
      var addBtn = document.querySelector('#page-chefpanel .btn-green, #cp-add-btn, [onclick="cpAddChef()"]');
      if (addBtn) { addBtn.disabled = true; addBtn.textContent = '⏳ Creating...'; }

      // ── Step 1: Firebase Auth mein account banao ──────────────
      var authResult = await createFirebaseAuthAccount(email, password);

      if (!authResult.success) {
        if (errEl) {
          if (authResult.code === 'auth/invalid-email') {
            errEl.textContent = '❌ Email format sahi nahi';
          } else if (authResult.code === 'auth/weak-password') {
            errEl.textContent = '❌ Password kam se kam 6 characters ka hona chahiye';
          } else {
            errEl.textContent = '❌ Auth error: ' + authResult.error;
          }
        }
        if (addBtn) { addBtn.disabled = false; addBtn.textContent = '+ Add Chef'; }
        return;
      }

      // ── Step 2: Original chef add function chalao ─────────────
      originalCpAddChef();

      // ── Step 3: Firestore mein users/{uid} save karo ──────────
      if (authResult.uid) {
        var rid = window._sip_restaurantId || 'norestaurant';
        await saveUserToFirestore(authResult.uid, email, 'chef', rid, name);
      }

      if (addBtn) { addBtn.disabled = false; addBtn.textContent = '+ Add Chef'; }

      // Success toast
      if (typeof showToast === 'function') {
        if (authResult.alreadyExists) {
          showToast('✅ Chef added! (Auth account pehle se tha)', 'success');
        } else {
          showToast('✅ Chef "' + name + '" add hua — Login bhi activate ho gaya!', 'success');
        }
      }
    };

    window.cpAddChef._authPatched = true;
    console.log('[AuthFix] ✅ cpAddChef patched — Firebase Auth account auto-create ON');
  }


  // ════════════════════════════════════════════════════════════════
  //  CAPTAIN ADD FUNCTION PATCH
  // ════════════════════════════════════════════════════════════════

  function patchCcAddCaptain() {
    if (!window.ccAddCaptain || window.ccAddCaptain._authPatched) return;

    var originalCcAddCaptain = window.ccAddCaptain;

    window.ccAddCaptain = async function () {
      var nameEl     = document.getElementById('cc-new-cap-name');
      var usernameEl = document.getElementById('cc-new-cap-username');
      var passwordEl = document.getElementById('cc-new-cap-password');

      var name     = (nameEl     && nameEl.value     || '').trim();
      var username = (usernameEl && usernameEl.value || '').trim();
      var password = (passwordEl && passwordEl.value || '').trim();

      if (!name || !username || !password) return originalCcAddCaptain();

      // Captain ka "email" banate hain username se —
      // kyunki Firebase Auth ko email chahiye hota hai
      // Format: username@siplora-captain.local
      // LEKIN — agar username mein "@" already hai to seedha use karo
      var captainEmail = username.includes('@')
        ? username
        : (username.toLowerCase().replace(/[^a-z0-9]/g, '') + '@siplora-captain.local');

      var addBtn = document.querySelector('[onclick="ccAddCaptain()"], #cc-add-cap-btn');
      if (addBtn) { addBtn.disabled = true; addBtn.textContent = '⏳ Creating...'; }

      // ── Step 1: Firebase Auth mein account banao ──────────────
      var authResult = await createFirebaseAuthAccount(captainEmail, password);

      if (!authResult.success) {
        if (typeof showToast === 'function') {
          showToast('⚠️ Captain add hua lekin login activate nahi hua: ' + authResult.error, 'warning');
        }
        // Phir bhi original function chalao — captain Firestore mein to save ho
        originalCcAddCaptain();
        if (addBtn) { addBtn.disabled = false; addBtn.textContent = '+ Add Captain'; }
        return;
      }

      // ── Step 2: Original captain add chalao ───────────────────
      originalCcAddCaptain();

      // ── Step 3: Firestore mein users/{uid} save karo ──────────
      if (authResult.uid) {
        var rid = window._sip_restaurantId || 'norestaurant';
        await saveUserToFirestore(authResult.uid, captainEmail, 'captain', rid, name);
      }

      if (addBtn) { addBtn.disabled = false; addBtn.textContent = '+ Add Captain'; }

      if (typeof showToast === 'function') {
        showToast('✅ Captain "' + name + '" add hua — Login activate!', 'success');
      }
    };

    window.ccAddCaptain._authPatched = true;
    console.log('[AuthFix] ✅ ccAddCaptain patched — Firebase Auth account auto-create ON');
  }


  // ════════════════════════════════════════════════════════════════
  //  EXISTING CHEFS/CAPTAINS KO FIX KARO (One-time migration)
  //
  //  Agar pehle se kuch chefs/captains add kiye hain jinke
  //  Firebase Auth accounts nahi bane, to ye tool use karo.
  //
  //  BROWSER CONSOLE MEIN RUN KARO:
  //    await window.sipCreateMissingAuthAccounts()
  // ════════════════════════════════════════════════════════════════
  window.sipCreateMissingAuthAccounts = async function () {
    console.log('[AuthFix Migration] Start...');
    var db = window.__fbDb;
    if (!db) { console.error('Firebase DB nahi mila — pehle login karo'); return; }

    var rid = window._sip_restaurantId;
    if (!rid) { console.error('restaurantId nahi mila'); return; }

    var totalChefs    = 0, totalCaptains = 0;
    var successCount  = 0, failCount     = 0;

    // ── Chefs ──────────────────────────────────────────────────
    try {
      var chefSnap = await window.__getDocs(window._sipCol(db, 'cc_chefs'));
      console.log('[AuthFix Migration] Chefs found:', chefSnap.size);

      for (var i = 0; i < chefSnap.docs.length; i++) {
        var chef = chefSnap.docs[i].data();
        if (!chef.email || !chef.password) { console.log('Skip (no email/password):', chef.name); continue; }
        totalChefs++;
        var res = await createFirebaseAuthAccount(chef.email, chef.password);
        if (res.success) {
          successCount++;
          if (res.uid) await saveUserToFirestore(res.uid, chef.email, 'chef', rid, chef.name);
          console.log('✅ Chef:', chef.name, chef.email, res.alreadyExists ? '(pehle se tha)' : '(naya)');
        } else {
          failCount++;
          console.warn('❌ Chef failed:', chef.name, res.error);
        }
      }
    } catch (e) { console.error('Chefs migration error:', e.message); }

    // ── Captains ───────────────────────────────────────────────
    try {
      var capSnap = await window.__getDocs(window._sipCol(db, 'captains'));
      console.log('[AuthFix Migration] Captains found:', capSnap.size);

      for (var j = 0; j < capSnap.docs.length; j++) {
        var cap = capSnap.docs[j].data();
        if (!cap.username || !cap.password) { console.log('Skip (no username/password):', cap.name); continue; }
        totalCaptains++;
        var capEmail = cap.username.includes('@')
          ? cap.username
          : (cap.username.toLowerCase().replace(/[^a-z0-9]/g, '') + '@siplora-captain.local');
        var capRes = await createFirebaseAuthAccount(capEmail, cap.password);
        if (capRes.success) {
          successCount++;
          if (capRes.uid) await saveUserToFirestore(capRes.uid, capEmail, 'captain', rid, cap.name);
          console.log('✅ Captain:', cap.name, capEmail, capRes.alreadyExists ? '(pehle se tha)' : '(naya)');
        } else {
          failCount++;
          console.warn('❌ Captain failed:', cap.name, capRes.error);
        }
      }
    } catch (e) { console.error('Captains migration error:', e.message); }

    console.log('══════════════════════════════════════════');
    console.log('[AuthFix Migration] COMPLETE!');
    console.log('Chefs processed:', totalChefs, '| Captains processed:', totalCaptains);
    console.log('Success:', successCount, '| Failed:', failCount);
    console.log('══════════════════════════════════════════');
    return { chefs: totalChefs, captains: totalCaptains, success: successCount, failed: failCount };
  };


  // ── Apply patches — billing.js load hone ke baad ─────────────────
  function applyPatches() {
    patchCpAddChef();
    patchCcAddCaptain();
  }

  // Polling — billing.js ke functions available hone tak wait karo
  var poll = setInterval(function () {
    if (window.cpAddChef && window.ccAddCaptain) {
      applyPatches();
      if (window.cpAddChef._authPatched && window.ccAddCaptain._authPatched) {
        clearInterval(poll);
      }
    }
  }, 500);

  // 20 second baad stop karo
  setTimeout(function () { clearInterval(poll); }, 20000);

  console.log('[AuthFix] Loaded — chef/captain Firebase Auth fix ready');
  console.log('[AuthFix] Purane accounts fix karne ke liye console mein run karo:');
  console.log('  await window.sipCreateMissingAuthAccounts()');

})();