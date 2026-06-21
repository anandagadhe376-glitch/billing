/* ════════════════════════════════════════════════════════
   SIPLORA FEATURE GATE v2
   - Apna khud ka Firebase load karta hai (compat SDK)
   - billing.js par depend nahi karta
   - Disabled features: dim + red lock icon
════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var FIREBASE_CONFIG = {
    apiKey: "AIzaSyBsRxWD2R1GkSEM-duLwQe3jAi7yw5vvvM",
    authDomain: "restaurant-system-beec1.firebaseapp.com",
    projectId: "restaurant-system-beec1",
    storageBucket: "restaurant-system-beec1.firebasestorage.app",
    messagingSenderId: "106757122327",
    appId: "1:106757122327:web:723d8dacbba3087b686f52"
  };

  var RESTAURANTS_COL = "restaurants";
  var FEATURES_COL    = "admin_restaurant_features";
  var RID_KEY         = "siplora_restaurant_id";
  var DEFAULT_RID     = "rest-001";

  var FEATURE_KEYS = [
    "dashboard","analytics","reports",
    "billing","tables","qr-tables","menu","orders","kds","inventory",
    "staff","attendance","tasks","customers","customer-history","loyalty",
    "ai","security","events","tax","settings",
    "quotation","supplier","delivery","birthday","captain","ai-assist",
    "esalary","daily-owner-report","staff-performance","smart-reorder",
    "qr-feedback","recipe-cost","order-desk",
    "ai-forecast","smart-upsell","daily-pl",
    "reservation","online-payment","todays-offer","rekruters","terms"
  ];

  var currentFeatures = {};
  var db = null;

  /* ── Restaurant ID ── */
  function getRestaurantId() {
    // Auth guard ka set kiya hua restaurantId use karo
    if (window._sip_restaurantId) return window._sip_restaurantId;
    try {
      var session = JSON.parse(localStorage.getItem('sip_session') || 'null');
      if (session && session.restaurantId) return session.restaurantId;
    } catch(e) {}
    return DEFAULT_RID;
  }

  /* ── Lock overlay (full account disabled) ── */
  function showLockOverlay(msg) {
    hideLockOverlay();
    var o = document.createElement("div");
    o.id = "fg-lock-overlay";
    o.style.cssText = "position:fixed;inset:0;z-index:999998;background:rgba(5,3,15,0.97);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px)";
    o.innerHTML = '<div style="text-align:center;max-width:420px;padding:32px;font-family:Montserrat,Arial,sans-serif"><div style="margin-bottom:16px"><svg xmlns=\'http://www.w3.org/2000/svg\' width=\'48\' height=\'48\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'#e74c3c\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><rect x=\'3\' y=\'11\' width=\'18\' height=\'11\' rx=\'2\' ry=\'2\'/><path d=\'M7 11V7a5 5 0 0 1 10 0v4\'/></svg></div><div style="font-size:22px;color:#f5f0e8;margin-bottom:10px">Access Disabled</div><div style="font-size:13px;color:rgba(245,240,232,0.6);line-height:1.8">' + msg + '</div></div>';
    document.body.appendChild(o);
  }
  function hideLockOverlay() {
    var el = document.getElementById("fg-lock-overlay");
    if (el) el.remove();
  }

  /* ── Nav item finder ── */
  function findNavEl(pid) {
    if (pid === "captain") return document.getElementById("nav-captain");
    var items = document.querySelectorAll(".nav-item");
    for (var i = 0; i < items.length; i++) {
      var oc = items[i].getAttribute("onclick") || "";
      if (oc.indexOf("showPage('" + pid + "'") === 0) return items[i];
    }
    return null;
  }

  /* ── Lock SVG ── */
  var LOCK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';

  /* ── Apply flags to UI ── */
  function applyFlags() {
    FEATURE_KEYS.forEach(function(pid) {
      var el = findNavEl(pid);
      if (!el) return;
      var enabled = currentFeatures[pid] !== false;

      if (!enabled) {
        el.style.opacity = "0.38";
        el.style.filter = "grayscale(1)";
        el.style.cursor = "not-allowed";
        el.style.display = "";
        if (!el.querySelector(".fg-lock-icon")) {
          var iconWrap = document.createElement("span");
          iconWrap.className = "fg-lock-icon";
          iconWrap.style.cssText = "display:inline-flex;align-items:center;margin-left:auto;padding-left:4px";
          iconWrap.innerHTML = LOCK_SVG;
          el.style.display = "flex";
          el.style.alignItems = "center";
          el.appendChild(iconWrap);
        }
      } else {
        el.style.opacity = "";
        el.style.filter = "";
        el.style.cursor = "";
        el.style.display = "";
        var lockEl = el.querySelector(".fg-lock-icon");
        if (lockEl) lockEl.remove();
      }
    });

    /* Agar current page disable ho gaya to dashboard par bhejo */
    var active = document.querySelector(".page.active");
    if (active) {
      var pid = active.id.replace("page-", "");
      if (currentFeatures[pid] === false) {
        if (typeof window._origShowPage === "function") window._origShowPage("dashboard");
        else if (typeof window.showPage === "function") window.showPage("dashboard");
      }
    }
  }

  /* ── Guard showPage & showCaptainCommand ── */
  function guardNav() {
    if (window._fgGuarded) return;
    window._fgGuarded = true;

    var origShow = window.showPage;
    window._origShowPage = origShow;
    window.showPage = function(id, el) {
      if (currentFeatures[id] === false) {
        if (typeof window.showToast === "function")
          window.showToast("Ye feature admin dwara disable hai", "error");
        return;
      }
      return origShow.apply(this, arguments);
    };

    if (typeof window.showCaptainCommand === "function") {
      var origCap = window.showCaptainCommand;
      window.showCaptainCommand = function(navEl) {
        if (currentFeatures["captain"] === false) {
          if (typeof window.showToast === "function")
            window.showToast("Ye feature admin dwara disable hai", "error");
          return;
        }
        return origCap.apply(this, arguments);
      };
    }
  }

  /* ── Firebase compat scripts load karo ── */
  function loadScript(src) {
    return new Promise(function(resolve, reject) {
      if (document.querySelector('script[src="'+src+'"]')) { resolve(); return; }
      var s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  /* ── Main init ── */
  async function init() {
    var rid = getRestaurantId();
    window.__siploraRestaurantId = rid;

    try {
      await loadScript("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
      await loadScript("https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js");
    } catch(e) {
      console.error("Feature gate: Firebase load fail", e);
      return;
    }

    var fbApp;
    try { fbApp = firebase.app("fg-app"); }
    catch(e) { fbApp = firebase.initializeApp(FIREBASE_CONFIG, "fg-app"); }
    db = firebase.firestore(fbApp);

    guardNav();

    /* Master restaurant ON/OFF */
    db.collection(RESTAURANTS_COL).doc(rid).onSnapshot(function(snap) {
      if (!snap.exists) { hideLockOverlay(); return; }
      var active = snap.data().active !== false;
      if (!active) {
        showLockOverlay("Aapka account admin dwara band kar diya gaya hai.<br>Support: 9021758399");
      } else {
        hideLockOverlay();
      }
    }, function(err){ 
      // Permission error ignore karo — restaurant collection auth se protected hai
      console.warn("FG master: permission issue — ignore");
    });

    /* Feature flags */
    db.collection(FEATURES_COL).doc(rid).onSnapshot(function(snap) {
      currentFeatures = snap.exists ? snap.data() : {};
      applyFlags();
    }, function(err){ console.warn("FG features: permission issue — ignore"); currentFeatures = {}; applyFlags(); });
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(init, 500);
  } else {
    document.addEventListener("DOMContentLoaded", function(){ setTimeout(init, 500); });
  }
})();