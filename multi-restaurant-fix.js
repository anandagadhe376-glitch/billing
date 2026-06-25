// ═══════════════════════════════════════════════════════════════════
//  MULTI-RESTAURANT DATA FIX — multi-restaurant-fix.js
//  Is file ko billing.js se PEHLE aur auth-guard.js ke BAAD load karo:
//
//  <script src="auth-guard.js"></script>
//  <script src="multi-restaurant-fix.js"></script>  ← YE ADD KARO
//  <script src="billing.js"></script>
//
//  YE FIX KYA KARTA HAI:
//  1. Har Firestore write (addDoc/setDoc) mein restaurantId auto-inject
//  2. Staff save mein restaurantId fix
//  3. Menu migration setDoc mein restaurantId fix
//  4. Firestore mein purane documents (bina restaurantId ke) ko
//     batch update karne ka ek-baar migration tool
// ═══════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  // ── 1. __addDoc WRAPPER — restaurantId auto-inject ─────────────────
  // Har window.__addDoc call ke baad yeh wrapper baith jaata hai.
  // billing.js jab bhi addDoc kare, restaurantId automatically lagegi.
  function patchAddDoc() {
    var original = window.__addDoc;
    if (!original || original._sipPatched) return;

    window.__addDoc = function (colRef, data) {
      var rid = window._sip_restaurantId || 'norestaurant';
      var patched = Object.assign({}, data, { restaurantId: rid });
      return original(colRef, patched);
    };
    window.__addDoc._sipPatched = true;
    console.log('[MultiRestFix] ✅ __addDoc patched — restaurantId auto-inject ON');
  }

  // ── 2. __setDoc WRAPPER — restaurantId auto-inject ─────────────────
  // setDoc ke liye bhi same — staff, suppliers, quotations, etc.
  // EXCEPT: app_data, es_data, ai_data collections ko skip karo
  //         (yeh shared/singleton documents hain)
  var SKIP_COLLECTIONS = ['app_data', 'es_data', 'ai_data'];

  function _getColName(docRef) {
    // Firestore DocumentReference ka path hota hai: "colName/docId"
    try {
      var path = docRef.path || (docRef._key && docRef._key.path && docRef._key.path.segments && docRef._key.path.segments.join('/')) || '';
      return path.split('/')[0] || '';
    } catch (e) { return ''; }
  }

  function patchSetDoc() {
    var original = window.__setDoc;
    if (!original || original._sipPatched) return;

    window.__setDoc = function (docRef, data, opts) {
      var colName = _getColName(docRef);
      if (SKIP_COLLECTIONS.indexOf(colName) === -1) {
        var rid = window._sip_restaurantId || 'norestaurant';
        data = Object.assign({}, data, { restaurantId: rid });
      }
      return opts ? original(docRef, data, opts) : original(docRef, data);
    };
    window.__setDoc._sipPatched = true;
    console.log('[MultiRestFix] ✅ __setDoc patched — restaurantId auto-inject ON');
  }

  // ── 3. fbSetDoc / fbAddDoc aliases bhi patch karo ──────────────────
  // billing.js kuch jagah window.__fbSetDoc / window.__fbAddDoc
  // use karta hai — yeh bhi patch karo
  function patchFbAliases() {
    if (window.__fbSetDoc && !window.__fbSetDoc._sipPatched) {
      window.__fbSetDoc = window.__setDoc;
      window.__fbSetDoc._sipPatched = true;
    }
    if (window.__fbAddDoc && !window.__fbAddDoc._sipPatched) {
      window.__fbAddDoc = window.__addDoc;
      window.__fbAddDoc._sipPatched = true;
    }
  }

  // ── 4. Staff save fix ───────────────────────────────────────────────
  // smSaveToFirebase — staffObj mein restaurantId nahi hoti, yahan patch
  // karo taaki staff bhi sahi restaurant ke under save ho.
  // billing.js mein smSaveToFirebase override karo.
  function patchStaffSave() {
    if (window._smSavePatched) return;

    var origInterval = setInterval(function () {
      if (typeof window.smSaveToFirebase === 'function' && !window._smSavePatched) {
        clearInterval(origInterval);
        var origFn = window.smSaveToFirebase;
        window.smSaveToFirebase = async function (staffObj) {
          var rid = window._sip_restaurantId || 'norestaurant';
          var patched = Object.assign({}, staffObj, { restaurantId: rid });
          return origFn(patched);
        };
        window._smSavePatched = true;
        console.log('[MultiRestFix] ✅ smSaveToFirebase patched — restaurantId inject ON');
      }
    }, 300);

    // 10 second timeout
    setTimeout(function () { clearInterval(origInterval); }, 10000);
  }

  // ── 5. Firebase ready hone par patches apply karo ──────────────────
  function applyPatches() {
    patchAddDoc();
    patchSetDoc();
    patchFbAliases();
    patchStaffSave();
  }

  // Firebase modules ready hone ke baad apply karo
  document.addEventListener('firebaseModulesReady', function () {
    setTimeout(applyPatches, 100); // thoda wait — billing.js sab assign kare
  });

  // Agar already ready hai
  if (window.__addDoc) applyPatches();

  // Firebase Extra init ke baad bhi check karo (aliasing ke liye)
  window.addEventListener('firebaseReady', function () {
    setTimeout(applyPatches, 100);
  });

  // Polling fallback — har 500ms check karo
  var patchPoll = setInterval(function () {
    if (window.__addDoc && window.__setDoc) {
      applyPatches();
      if (window.__addDoc._sipPatched && window.__setDoc._sipPatched) {
        clearInterval(patchPoll);
      }
    }
  }, 500);
  setTimeout(function () { clearInterval(patchPoll); }, 15000);


  // ═══════════════════════════════════════════════════════════════════
  //  ONE-TIME MIGRATION TOOL
  //  Purane Firestore documents jisme restaurantId nahi hai unhe fix karo.
  //
  //  BROWSER CONSOLE MEIN CHALAO (sirf ek baar):
  //    await window.sipFixOldDocuments('restaurant_001')
  //
  //  YA — alag alag restaurants ke liye:
  //    await window.sipFixOldDocuments('restaurant_001')
  //    await window.sipFixOldDocuments('restaurant_002')
  // ═══════════════════════════════════════════════════════════════════
  window.sipFixOldDocuments = async function (restaurantId) {
    if (!restaurantId) {
      console.error('[Migration] restaurantId dijiye! e.g. sipFixOldDocuments("restaurant_001")');
      return;
    }

    var db = window.__fbDb || window.__db;
    if (!db) {
      console.error('[Migration] Firebase DB nahi mila — pehle login karo');
      return;
    }

    var collections = [
      'tables', 'orders', 'menuItems', 'customers', 'suppliers',
      'staff', 'tasks', 'reservations', 'quotations', 'payments',
      'complaints', 'captains', 'cc_chefs', 'captainBills', 'coupons',
      'stock', 'deliveryOrders'
    ];

    console.log('[Migration] Start — Restaurant:', restaurantId);
    console.log('[Migration] Collections check karenge:', collections.join(', '));

    var totalFixed = 0;
    var totalSkipped = 0;

    for (var i = 0; i < collections.length; i++) {
      var colName = collections[i];
      try {
        var colRef = window.__col(db, colName);
        var snap = await window.__getDocs(colRef);
        var batch = window.__writeBatch(db);
        var batchCount = 0;

        snap.forEach(function (docSnap) {
          var data = docSnap.data();
          // Sirf woh documents fix karo jinme restaurantId nahi hai
          if (!data.restaurantId) {
            var docRef = window.__doc(db, colName, docSnap.id);
            batch.update(docRef, { restaurantId: restaurantId });
            batchCount++;
            totalFixed++;
          } else {
            totalSkipped++;
          }
        });

        if (batchCount > 0) {
          await batch.commit();
          console.log('[Migration] ✅', colName, '—', batchCount, 'documents fix kiye');
        } else {
          console.log('[Migration] ⏭', colName, '— sab already tagged hain');
        }
      } catch (e) {
        console.warn('[Migration] ⚠️', colName, 'error:', e.message);
      }
    }

    console.log('══════════════════════════════════════════');
    console.log('[Migration] COMPLETE!');
    console.log('[Migration] Fixed:', totalFixed, '| Already OK:', totalSkipped);
    console.log('[Migration] Restaurant:', restaurantId);
    console.log('══════════════════════════════════════════');

    return { fixed: totalFixed, skipped: totalSkipped };
  };

  console.log('[MultiRestFix] Loaded — patches wait kar rahe hain Firebase ke liye');
  console.log('[MultiRestFix] Migration tool ready: await window.sipFixOldDocuments("restaurant_001")');

})();

// ═══════════════════════════════════════════════════════════════════
//  DASHBOARD CACHE FIX
//  Jab restaurant change ho — dashboard cache clear karo aur reload karo
// ═══════════════════════════════════════════════════════════════════
(function() {
  var _lastKnownRid = null;

  function clearDashCacheAndReload(newRid) {
    if (_lastKnownRid === newRid) return; // same restaurant — skip
    _lastKnownRid = newRid;

    // Dashboard cache reset karo
    if (window._fbDashCache) {
      window._fbDashCache.orders    = null;
      window._fbDashCache.customers = null;
      window._fbDashCache.staff     = null;
      window._fbDashCache.stock     = null;
      window._fbDashCache.loadedAt  = 0;
    }

    // Firebase listeners reset karo — purane restaurant ke listeners band karo
    if (typeof window._fbTablesUnsub === 'function') {
      window._fbTablesUnsub();
      window._fbTablesUnsub = null;
    }
    if (typeof window._fbOrdersUnsub === 'function') {
      window._fbOrdersUnsub();
      window._fbOrdersUnsub = null;
    }
    if (typeof window._fbMenuUnsub === 'function') {
      window._fbMenuUnsub();
      window._fbMenuUnsub = null;
    }

    // Sync flags reset karo — taaki nayi restaurant ke liye fresh sync ho
    window._fbTablesSyncInited = false;
    window._fbOrdersSyncInited = false;
    window._fbMenuInited       = false;

    console.log('[MultiRestFix] 🔄 Restaurant change detected:', newRid, '— cache + listeners reset');

    // Thodi der baad fresh data load karo
    setTimeout(function() {
      if (typeof initFirebaseTablesSync === 'function') initFirebaseTablesSync();
      if (typeof initFirebaseOrdersSync === 'function') initFirebaseOrdersSync();
      if (typeof initFirebaseMenuSync   === 'function') initFirebaseMenuSync();
      if (typeof loadFirebaseDashData   === 'function') loadFirebaseDashData(true).then(function() {
        if (typeof updateDashboardKPIs        === 'function') updateDashboardKPIs();
        if (typeof initPOSDashboardCharts     === 'function') initPOSDashboardCharts();
        if (typeof _dashUpdateIncomeGauge     === 'function') _dashUpdateIncomeGauge();
        if (typeof _dashUpdateTopDishes       === 'function') _dashUpdateTopDishes();
        if (typeof _dashUpdateOrderStatusBars === 'function') _dashUpdateOrderStatusBars();
      });
    }, 300);
  }

  // sipRestaurantReady event — auth-guard fire karta hai
  window.addEventListener('sipRestaurantReady', function(e) {
    var rid = e.detail && e.detail.restaurantId;
    if (rid) clearDashCacheAndReload(rid);
  });

  // Polling fallback — agar event miss ho gaya
  var pollCount = 0;
  var poll = setInterval(function() {
    pollCount++;
    var rid = window._sip_restaurantId;
    if (rid && rid !== 'norestaurant') {
      clearDashCacheAndReload(rid);
    }
    if (pollCount > 30) clearInterval(poll); // 15 second baad stop
  }, 500);

})();