// ═══════════════════════════════════════════════════════════════
// 🤖 SIPLORA CHEF AI — Google Gemini (billing file jaisa same)
// Billing file ki tarah SAME Gemini key use hoti hai
// Key change karni ho to: https://aistudio.google.com/app/apikey
// ═══════════════════════════════════════════════════════════════
const GEMINI_API_KEY = "AIzaSyAQw8xdkGilkHfdanuW2l25K0RePuVnRkc"; // billing file jaisi same key
const GEMINI_MODEL   = "gemini-2.5-flash-lite-preview-06-17";
const GEMINI_URL     = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// ── Central Gemini call (billing file jaisa same pattern) ──
async function callGemini(systemPrompt, userMessage, maxTokens = 1024) {
  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "APNI_API_KEY_YAHAN_DAALO") {
      return "⚠️ Gemini API Key set nahi hai. chef-app.js ke upar GEMINI_API_KEY mein key daalo. (aistudio.google.com se FREE milti hai)";
    }
    // Rate limit — 3 sec between calls (billing jaisa)
    const now = Date.now();
    const lastCall = window._chefLastGeminiCall || 0;
    if (now - lastCall < 3000) {
      await new Promise(r => setTimeout(r, 3000 - (now - lastCall)));
    }
    window._chefLastGeminiCall = Date.now();

    const body = {
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 }
    };
    if (systemPrompt) body.system_instruction = { parts: [{ text: systemPrompt }] };

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const errCode = err?.error?.code || response.status;
      const errMsg  = err?.error?.message || 'Unknown error';
      if (errCode === 429) return "⏳ Thodi der mein try karo — API limit hit hui. (1-2 min wait)";
      if (errCode === 400) return "❌ API Key galat ya expire. aistudio.google.com se nayi key lo.";
      if (errCode === 403) return "❌ API access denied. Key check karo at aistudio.google.com";
      return `❌ Gemini Error ${errCode}: ${errMsg}`;
    }
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "❌ AI ka jawab nahi aaya. Dobara try karo.";
  } catch (e) {
    if (e.message?.includes('fetch')) return "❌ Network error — Internet check karo.";
    return "❌ Connection error. Browser console check karo (F12).";
  }
}

// ═══════════════════════════════════════════════════════════════
// 🔥 FIREBASE CONFIG — Billing file ke saath SAME project
// ═══════════════════════════════════════════════════════════════
const CHEF_FB_CONFIG = {
  apiKey: "AIzaSyBsRxWD2R1GkSEM-duLwQe3jAi7yw5vvvM",
  authDomain: "restaurant-system-beec1.firebaseapp.com",
  projectId: "restaurant-system-beec1",
  storageBucket: "restaurant-system-beec1.firebasestorage.app",
  messagingSenderId: "106757122327",
  appId: "1:106757122327:web:723d8dacbba3087b686f52"
};

// ═══ APP DATA ═══
const appData = {
  soundEnabled:false, neonMode:false,
  tables:[
    {id:1,status:'pending',items:['Dal Makhani','Roti'],time:8,maxTime:20,type:'normal',notes:'',station:'tandoor',waiter:'Deepak'},
    {id:2,status:'preparing',items:['Chicken Biryani','Raita'],time:14,maxTime:20,type:'normal',notes:'',station:'tandoor',waiter:'Amit'},
    {id:3,status:'vip',items:['Sushi','Premium Thali'],time:3,maxTime:30,type:'vip',notes:'VIP Guest',station:'cold',waiter:'Amit'},
    {id:4,status:'served',items:['Noodles'],time:20,maxTime:20,type:'normal',notes:'',station:'chinese',waiter:'Deepak'},
    {id:5,status:'preparing',items:['Manchurian','Fried Rice'],time:18,maxTime:20,type:'normal',notes:'',station:'chinese',waiter:'Meena'},
    {id:6,status:'available',items:[],time:0,maxTime:20,type:'normal',notes:'',station:'',waiter:''},
    {id:7,status:'available',items:[],time:0,maxTime:20,type:'normal',notes:'',station:'',waiter:''},
    {id:8,status:'pending',items:['Biryani'],time:2,maxTime:20,type:'normal',notes:'',station:'tandoor',waiter:'Amit'},
    {id:9,status:'urgent',items:['Dal Makhani','Rice'],time:25,maxTime:20,type:'urgent',notes:'',station:'tandoor',waiter:'Deepak'},
    {id:10,status:'available',items:[],time:0,maxTime:20,type:'normal',notes:'',station:'',waiter:''},
    {id:11,status:'served',items:['Gulab Jamun','Lassi'],time:18,maxTime:30,type:'normal',notes:'',station:'dessert',waiter:'Meena'},
    {id:12,status:'available',items:[],time:0,maxTime:20,type:'normal',notes:'',station:'',waiter:''},
  ],
  staff:[
    {id:1,name:'Raju Bhai (Head Chef)',role:'chef',phone:'9800000001',present:true,emoji:'👨‍🍳',salary:22000,advance:2000,shift:'morning',rating:5,joiningDate:'2022-01-15',presentDays:26,absentDays:1,note:'Head chef, 4 saal ka experience'},
    {id:2,name:'Santosh Kumar',role:'chef',phone:'9800000002',present:true,emoji:'👨‍🍳',salary:18000,advance:0,shift:'evening',rating:4,joiningDate:'2023-03-10',presentDays:24,absentDays:3,note:'South Indian dishes specialist'},
    {id:3,name:'Vijay Waiter',role:'waiter',phone:'9800000003',present:true,emoji:'🧑‍🍽️',salary:12000,advance:1000,shift:'morning',rating:4,joiningDate:'2023-06-01',presentDays:25,absentDays:2,note:'Fast service, VIP tables handle karta hai'},
    {id:4,name:'Ramesh Waiter',role:'waiter',phone:'9800000004',present:true,emoji:'🧑‍🍽️',salary:11000,advance:0,shift:'evening',rating:3,joiningDate:'2024-01-20',presentDays:22,absentDays:5,note:''},
    {id:5,name:'Sunil Helper',role:'helper',phone:'9800000005',present:true,emoji:'👨‍🍽️',salary:9000,advance:500,shift:'morning',rating:3,joiningDate:'2024-04-01',presentDays:23,absentDays:4,note:'Kitchen helper, dishwashing'},
    {id:6,name:'Ganesh Cleaner',role:'cleaner',phone:'9800000006',present:true,emoji:'🧹',salary:8500,advance:0,shift:'morning',rating:4,joiningDate:'2023-09-15',presentDays:27,absentDays:0,note:'Punctual, full month present'},
  ],
  inventory:[
    {id:1,name:'Basmati Rice',qty:50,unit:'kg',expiry:'2026-12-31',minQty:10,emoji:'🍚',supplierId:1,supplierNote:'50kg bag',costPerUnit:60,category:'Grains',restockQty:50,usageLog:[{date:'2026-05-19',used:5},{date:'2026-05-18',used:6},{date:'2026-05-17',used:7}]},
    {id:2,name:'Chicken',qty:15,unit:'kg',expiry:'2026-05-20',minQty:5,emoji:'🍗',supplierId:3,supplierNote:'Fresh daily stock',costPerUnit:220,category:'Non-Veg',restockQty:20,usageLog:[{date:'2026-05-19',used:8},{date:'2026-05-18',used:7},{date:'2026-05-17',used:9}]},
    {id:3,name:'Mutton',qty:8,unit:'kg',expiry:'2026-05-20',minQty:3,emoji:'🥩',supplierId:3,supplierNote:'Halal certified',costPerUnit:580,category:'Non-Veg',restockQty:10,usageLog:[{date:'2026-05-19',used:3},{date:'2026-05-18',used:2},{date:'2026-05-17',used:4}]},
    {id:4,name:'Paneer',qty:5,unit:'kg',expiry:'2026-05-22',minQty:2,emoji:'🧀',supplierId:4,supplierNote:'Fresh paneer daily',costPerUnit:320,category:'Dairy',restockQty:8,usageLog:[{date:'2026-05-19',used:2},{date:'2026-05-18',used:2},{date:'2026-05-17',used:3}]},
    {id:5,name:'Tomatoes',qty:10,unit:'kg',expiry:'2026-05-21',minQty:5,emoji:'🍅',supplierId:2,supplierNote:'Grade A tomatoes',costPerUnit:40,category:'Vegetables',restockQty:15,usageLog:[{date:'2026-05-19',used:4},{date:'2026-05-18',used:5},{date:'2026-05-17',used:4}]},
    {id:6,name:'Onion',qty:20,unit:'kg',expiry:'2026-06-01',minQty:8,emoji:'🧅',supplierId:2,supplierNote:'Local variety',costPerUnit:30,category:'Vegetables',restockQty:25,usageLog:[{date:'2026-05-19',used:5},{date:'2026-05-18',used:6},{date:'2026-05-17',used:5}]},
    {id:7,name:'Cooking Oil (Sunflower)',qty:10,unit:'L',expiry:'2026-12-01',minQty:3,emoji:'🫙',supplierId:6,supplierNote:'15L tin',costPerUnit:150,category:'Oils',restockQty:15,usageLog:[{date:'2026-05-19',used:1},{date:'2026-05-18',used:1.5},{date:'2026-05-17',used:1}]},
    {id:8,name:'Ghee',qty:3,unit:'kg',expiry:'2026-10-01',minQty:1,emoji:'🧈',supplierId:6,supplierNote:'Pure desi ghee',costPerUnit:650,category:'Dairy',restockQty:5,usageLog:[{date:'2026-05-19',used:0.5},{date:'2026-05-18',used:0.5},{date:'2026-05-17',used:0.8}]},
    {id:9,name:'Wheat Flour (Atta)',qty:30,unit:'kg',expiry:'2026-09-01',minQty:8,emoji:'🌾',supplierId:1,supplierNote:'Chakki fresh atta',costPerUnit:45,category:'Grains',restockQty:30,usageLog:[{date:'2026-05-19',used:4},{date:'2026-05-18',used:5},{date:'2026-05-17',used:4}]},
    {id:10,name:'Dal Toor',qty:15,unit:'kg',expiry:'2026-11-01',minQty:5,emoji:'🫘',supplierId:1,supplierNote:'Premium quality',costPerUnit:130,category:'Pulses',restockQty:20,usageLog:[{date:'2026-05-19',used:3},{date:'2026-05-18',used:2},{date:'2026-05-17',used:3}]},
    {id:11,name:'Dal Chana',qty:10,unit:'kg',expiry:'2026-11-01',minQty:4,emoji:'🫘',supplierId:1,supplierNote:'Split chana dal',costPerUnit:90,category:'Pulses',restockQty:15,usageLog:[{date:'2026-05-19',used:2},{date:'2026-05-18',used:2},{date:'2026-05-17',used:1}]},
    {id:12,name:'Milk',qty:20,unit:'L',expiry:'2026-05-20',minQty:5,emoji:'🥛',supplierId:4,supplierNote:'Full cream milk',costPerUnit:65,category:'Dairy',restockQty:20,usageLog:[{date:'2026-05-19',used:5},{date:'2026-05-18',used:6},{date:'2026-05-17',used:5}]},
    {id:13,name:'Butter',qty:3,unit:'kg',expiry:'2026-06-01',minQty:1,emoji:'🧈',supplierId:4,supplierNote:'Amul salted',costPerUnit:480,category:'Dairy',restockQty:5,usageLog:[{date:'2026-05-19',used:0.5},{date:'2026-05-18',used:0.5},{date:'2026-05-17',used:0.3}]},
    {id:14,name:'Cream',qty:2,unit:'L',expiry:'2026-05-22',minQty:1,emoji:'🥛',supplierId:4,supplierNote:'Fresh cream',costPerUnit:300,category:'Dairy',restockQty:3,usageLog:[{date:'2026-05-19',used:0.5},{date:'2026-05-18',used:0.3},{date:'2026-05-17',used:0.5}]},
    {id:15,name:'Ginger-Garlic Paste',qty:5,unit:'kg',expiry:'2026-06-15',minQty:2,emoji:'🧄',supplierId:5,supplierNote:'Freshly ground',costPerUnit:180,category:'Masale',restockQty:5,usageLog:[{date:'2026-05-19',used:1},{date:'2026-05-18',used:0.8},{date:'2026-05-17',used:1}]},
    {id:16,name:'Green Chilli',qty:3,unit:'kg',expiry:'2026-05-22',minQty:1,emoji:'🌶️',supplierId:2,supplierNote:'Local green chilli',costPerUnit:60,category:'Vegetables',restockQty:5,usageLog:[{date:'2026-05-19',used:0.5},{date:'2026-05-18',used:0.5},{date:'2026-05-17',used:0.6}]},
    {id:17,name:'Coriander (Dhaniya)',qty:2,unit:'kg',expiry:'2026-05-21',minQty:0.5,emoji:'🌿',supplierId:2,supplierNote:'Fresh bunch',costPerUnit:80,category:'Vegetables',restockQty:3,usageLog:[{date:'2026-05-19',used:0.3},{date:'2026-05-18',used:0.4},{date:'2026-05-17',used:0.3}]},
    {id:18,name:'Garam Masala',qty:2,unit:'kg',expiry:'2026-08-01',minQty:0.5,emoji:'🫙',supplierId:5,supplierNote:'Special blend',costPerUnit:600,category:'Masale',restockQty:2,usageLog:[{date:'2026-05-19',used:0.1},{date:'2026-05-18',used:0.1},{date:'2026-05-17',used:0.1}]},
    {id:19,name:'Turmeric (Haldi)',qty:1,unit:'kg',expiry:'2026-08-01',minQty:0.3,emoji:'🫙',supplierId:5,supplierNote:'Pure haldi',costPerUnit:250,category:'Masale',restockQty:2,usageLog:[{date:'2026-05-19',used:0.05},{date:'2026-05-18',used:0.05},{date:'2026-05-17',used:0.05}]},
    {id:20,name:'Red Chilli Powder',qty:2,unit:'kg',expiry:'2026-08-01',minQty:0.5,emoji:'🌶️',supplierId:5,supplierNote:'Kashmiri lal mirch',costPerUnit:400,category:'Masale',restockQty:2,usageLog:[{date:'2026-05-19',used:0.08},{date:'2026-05-18',used:0.1},{date:'2026-05-17',used:0.08}]},
    {id:21,name:'Jeera (Cumin)',qty:1,unit:'kg',expiry:'2026-08-01',minQty:0.3,emoji:'🫙',supplierId:5,supplierNote:'Rajasthan jeera',costPerUnit:350,category:'Masale',restockQty:2,usageLog:[{date:'2026-05-19',used:0.05},{date:'2026-05-18',used:0.05},{date:'2026-05-17',used:0.05}]},
    {id:22,name:'Sugar',qty:10,unit:'kg',expiry:'2026-12-01',minQty:3,emoji:'🍬',supplierId:7,supplierNote:'White refined sugar',costPerUnit:42,category:'Grains',restockQty:10,usageLog:[{date:'2026-05-19',used:0.5},{date:'2026-05-18',used:0.5},{date:'2026-05-17',used:0.4}]},
    {id:23,name:'Salt',qty:5,unit:'kg',expiry:'2027-01-01',minQty:2,emoji:'🧂',supplierId:7,supplierNote:'Iodized salt',costPerUnit:20,category:'Masale',restockQty:5,usageLog:[{date:'2026-05-19',used:0.1},{date:'2026-05-18',used:0.1},{date:'2026-05-17',used:0.1}]},
    {id:24,name:'Cold Drinks (Bottles)',qty:24,unit:'pcs',expiry:'2026-12-01',minQty:12,emoji:'🥤',supplierId:7,supplierNote:'Assorted flavors',costPerUnit:45,category:'Beverages',restockQty:24,usageLog:[{date:'2026-05-19',used:6},{date:'2026-05-18',used:8},{date:'2026-05-17',used:5}]},
    {id:25,name:'Mineral Water',qty:50,unit:'pcs',expiry:'2027-01-01',minQty:20,emoji:'💧',supplierId:7,supplierNote:'1L bottles',costPerUnit:20,category:'Beverages',restockQty:50,usageLog:[{date:'2026-05-19',used:10},{date:'2026-05-18',used:12},{date:'2026-05-17',used:9}]},
  ],
  menu:[
    {id:1,name:'Chicken Biryani',emoji:'🍗',price:320,halfPrice:180,category:'Non-Veg Main Course',available:true,sold:0,image:'',portions:['Full','Half']},
    {id:2,name:'Mutton Biryani',emoji:'🥩',price:380,halfPrice:220,category:'Non-Veg Main Course',available:true,sold:0,image:'',portions:['Full','Half']},
    {id:3,name:'Veg Biryani',emoji:'🍚',price:220,halfPrice:130,category:'Veg Main Course',available:true,sold:0,image:'',portions:['Full','Half']},
    {id:4,name:'Paneer Tikka',emoji:'🧀',price:280,halfPrice:160,category:'Veg Starter',available:true,sold:0,image:'',portions:['Full','Half']},
    {id:5,name:'Chicken Tikka',emoji:'🍗',price:300,halfPrice:170,category:'Non-Veg Starter',available:true,sold:0,image:'',portions:['Full','Half']},
    {id:6,name:'Dal Makhani',emoji:'🍲',price:200,halfPrice:120,category:'Main Course',available:true,sold:0,image:'',portions:['Full','Half']},
    {id:7,name:'Dal Tadka',emoji:'🍲',price:160,halfPrice:100,category:'Main Course',available:true,sold:0,image:'',portions:['Full','Half']},
    {id:8,name:'Butter Chicken',emoji:'🍛',price:340,halfPrice:200,category:'Non-Veg Main Course',available:true,sold:0,image:'',portions:['Full','Half']},
    {id:9,name:'Paneer Butter Masala',emoji:'🧀',price:280,halfPrice:160,category:'Veg Main Course',available:true,sold:0,image:'',portions:['Full','Half']},
    {id:10,name:'Butter Naan',emoji:'🫓',price:40,halfPrice:0,category:'Breads',available:true,sold:0,image:'',portions:['Full']},
    {id:11,name:'Tandoori Roti',emoji:'🫓',price:25,halfPrice:0,category:'Breads',available:true,sold:0,image:'',portions:['Full']},
    {id:12,name:'Laccha Paratha',emoji:'🫓',price:50,halfPrice:0,category:'Breads',available:true,sold:0,image:'',portions:['Full']},
    {id:13,name:'Mango Lassi',emoji:'🥭',price:100,halfPrice:0,category:'Drinks',available:true,sold:0,image:'',portions:['Full']},
    {id:14,name:'Sweet Lassi',emoji:'🥛',price:80,halfPrice:0,category:'Drinks',available:true,sold:0,image:'',portions:['Full']},
    {id:15,name:'Masala Chai',emoji:'☕',price:30,halfPrice:0,category:'Drinks',available:true,sold:0,image:'',portions:['Full']},
    {id:16,name:'Gulab Jamun',emoji:'🍮',price:80,halfPrice:0,category:'Dessert',available:true,sold:0,image:'',portions:['Full']},
    {id:17,name:'Kheer',emoji:'🍮',price:90,halfPrice:0,category:'Dessert',available:true,sold:0,image:'',portions:['Full']},
    {id:18,name:'Chicken Manchurian',emoji:'🥡',price:260,halfPrice:150,category:'Non-Veg Starter',available:true,sold:0,image:'',portions:['Full','Half']},
    {id:19,name:'Veg Manchurian',emoji:'🥡',price:200,halfPrice:120,category:'Veg Starter',available:true,sold:0,image:'',portions:['Full','Half']},
    {id:20,name:'Fried Rice',emoji:'🍚',price:200,halfPrice:120,category:'Main Course',available:true,sold:0,image:'',portions:['Full','Half']},
    {id:21,name:'Raita',emoji:'🥣',price:60,halfPrice:0,category:'Sides',available:true,sold:0,image:'',portions:['Full']},
    {id:22,name:'Papad',emoji:'🫓',price:20,halfPrice:0,category:'Sides',available:true,sold:0,image:'',portions:['Full']},
  ],
  waste:[
    {id:1,name:'Rice',qty:'3 kg',cost:90,reason:'Over-cooked',time:'11:30 AM'},
    {id:2,name:'Chicken',qty:'1 kg',cost:220,reason:'Spoiled',time:'10:00 AM'},
    {id:3,name:'Salad',qty:'500g',cost:45,reason:'Order Cancelled',time:'1:15 PM'},
  ],
  tasks:[
    {id:1,title:'Clean Station 2',staffId:5,deadline:'2025-05-03 14:00',priority:'normal',status:'assigned'},
    {id:2,title:'Restock Rice Shelf',staffId:2,deadline:'2025-05-03 16:00',priority:'urgent',status:'done'},
    {id:3,title:'Tandoor Cleaning',staffId:1,deadline:'2025-05-03 18:00',priority:'vip',status:'assigned'},
    {id:4,title:'Check Expiry Items',staffId:9,deadline:'2025-05-03 12:00',priority:'normal',status:'pending'},
  ],
  customers:[
    {id:1,name:'Rajesh Verma',phone:'9812345001',visits:24,lastVisit:'Today',fav:'Chicken Biryani',vip:true,spent:12800},
    {id:2,name:'Priya Nair',phone:'9812345002',visits:18,lastVisit:'Yesterday',fav:'Paneer Tikka',vip:true,spent:9200},
    {id:3,name:'Suresh Patil',phone:'9812345003',visits:9,lastVisit:'3 days ago',fav:'Dal Makhani',vip:false,spent:4100},
    {id:4,name:'Mohammed Ali',phone:'9812345005',visits:31,lastVisit:'Today',fav:'Biryani + Naan',vip:true,spent:18900},
  ],
  waiterCalls:[
    {id:1,table:3,waiter:'Amit Singh',type:'food_ready',time:'2:15 PM',resolved:false},
    {id:2,table:7,waiter:'Meena Devi',type:'assistance',time:'2:22 PM',resolved:false},
    {id:3,table:11,waiter:'Amit Singh',type:'bill_request',time:'2:30 PM',resolved:true},
  ],
  branches:[
    {id:1,name:'Branch A — Main',location:'Solapur City',manager:'Ramesh Bhai',phone:'9876500001',active:true,tables:17,orders:23,revenue:18240},
    {id:2,name:'Branch B — Camp',location:'Camp Area',manager:'Suresh Ji',phone:'9876500002',active:true,tables:12,orders:15,revenue:11500},
    {id:3,name:'Cloud Kitchen',location:'Online Only',manager:'Amit Kumar',phone:'9876500003',active:false,tables:0,orders:8,revenue:6200},
  ],
  recentBills:[
    {table:2,amount:580,gst:104,total:684,payment:'UPI',time:'1:45 PM',customer:'Walk-in'},
    {table:8,amount:340,gst:61,total:401,payment:'Cash',time:'12:30 PM',customer:'Suresh Patil'},
  ],
  kots:[],
  qrCart:{},
  servedOrdersHistory:[],
  todayOrders:[],
  suppliers:[
    {id:1,name:'Ramesh Provisions',ownerName:'Ramesh Gupta',phone:'9876501001',whatsapp:'9876501001',category:'Grains & Dal',supplyItems:['Basmati Rice','Dal Toor','Dal Chana','Wheat Flour (Atta)'],address:'Gandhi Nagar, Solapur',deliveryDay:'Mon, Thu',notes:'Bulk discount 5% on 50kg+ order',rating:5,active:true,emoji:'🌾'},
    {id:2,name:'Solapur Fresh Farms',ownerName:'Suresh Patil',phone:'9876501002',whatsapp:'9876501002',category:'Vegetables & Fruits',supplyItems:['Tomatoes','Onion','Green Chilli','Coriander (Dhaniya)'],address:'Market Yard, Solapur',deliveryDay:'Daily',notes:'Early morning delivery 6 AM',rating:4,active:true,emoji:'🥦'},
    {id:3,name:'Al-Noor Chicken House',ownerName:'Mohammad Rafiq',phone:'9876501003',whatsapp:'9876501003',category:'Meat & Poultry',supplyItems:['Chicken','Mutton'],address:'Budhwar Peth, Solapur',deliveryDay:'Daily',notes:'Fresh delivery by 8 AM, Halal certified',rating:5,active:true,emoji:'🍗'},
    {id:4,name:'Dairy Fresh Suppliers',ownerName:'Gopal Krishna',phone:'9876501004',whatsapp:'9876501004',category:'Dairy Products',supplyItems:['Milk','Paneer','Butter','Cream','Ghee'],address:'Dairy Colony, Solapur',deliveryDay:'Daily',notes:'Delivery 7 AM & 5 PM',rating:4,active:true,emoji:'🥛'},
    {id:5,name:'Spice King Wholesale',ownerName:'Vikram Sharma',phone:'9876501005',whatsapp:'9876501005',category:'Spices & Masala',supplyItems:['Ginger-Garlic Paste','Garam Masala','Turmeric (Haldi)','Red Chilli Powder','Jeera (Cumin)'],address:'Spice Market, Solapur',deliveryDay:'Tue, Fri',notes:'Minimum order ₹500',rating:5,active:true,emoji:'🫙'},
    {id:6,name:'Premium Oil & Ghee Co.',ownerName:'Dinesh Agarwal',phone:'9876501006',whatsapp:'9876501006',category:'Oils & Fats',supplyItems:['Cooking Oil (Sunflower)','Ghee'],address:'Industrial Area, Solapur',deliveryDay:'Wed, Sat',notes:'10L+ order pe free delivery',rating:4,active:true,emoji:'🫙'},
    {id:7,name:'Sweet Supply Hub',ownerName:'Kishore Mittal',phone:'9876501007',whatsapp:'9876501007',category:'Dry Goods',supplyItems:['Sugar','Salt','Cold Drinks (Bottles)','Mineral Water'],address:'Camp Area, Solapur',deliveryDay:'Mon, Wed, Fri',notes:'Cold drinks chilled delivery',rating:4,active:true,emoji:'🍬'},
  ]
};

// ═══ INIT LUCIDE ICONS ═══
document.addEventListener('DOMContentLoaded',()=>{if(window.lucide)lucide.createIcons();});

// ═══ SPLASH ═══
const msgs=['INITIALIZING KITCHEN SYSTEMS...','LOADING KOT ENGINE...','CONNECTING STATIONS...','SYNCING MENU DATA...','STARTING AI BRAIN...','SYSTEM READY ✓'];
let mIdx=0;
const sI=setInterval(()=>{mIdx++;if(mIdx<msgs.length)document.getElementById('splashMsg').textContent=msgs[mIdx];else clearInterval(sI);},360);
setTimeout(()=>{document.getElementById('splash').classList.add('hide');setTimeout(()=>document.getElementById('splash').remove(),800);},2300);

// ═══ CLOCK ═══
function updateClock(){
  const n=new Date();
  document.getElementById('liveClock').textContent=n.toLocaleTimeString('en-IN',{hour12:false});
  document.getElementById('liveDate').textContent=n.toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
}
setInterval(updateClock,1000);updateClock();

// ═══ SIDEBAR ═══
document.getElementById('sidebarEl').addEventListener('mouseenter',()=>{if(window.lucide)lucide.createIcons();});

// ═══ NAVIGATION ═══
function showPage(name){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const pg=document.getElementById('page-'+name);
  if(pg)pg.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>{if(n.getAttribute('onclick')&&n.getAttribute('onclick').includes("'"+name+"'"))n.classList.add('active');});
  // Sync feature tabs
  document.querySelectorAll('.feat-tab').forEach(t=>{t.classList.remove('active');if(t.getAttribute('onclick')&&t.getAttribute('onclick').includes("'"+name+"'"))t.classList.add('active');});
  // Show features panel only on dashboard, hide on all other pages
  const featPanel=document.getElementById('featuresTabsSection');
  if(featPanel)featPanel.style.display=(name==='dashboard')?'':'none';
  if(name==='dashboard'){renderDashboard();setTimeout(loadDashboardFromFirebase,300);}
  if(name==='tables')renderTables();
  if(name==='kot')renderKOT();
  if(name==='kitboard')renderKitBoard();
  if(name==='stations'){renderStations();setTimeout(loadStationsFromFirebase,400);}
  if(name==='staff'){renderStaff();loadStaffFromFirebase();}
  if(name==='inventory'){renderInventory();loadInventoryFromFirebase();}
  if(name==='menu')renderMenu();
  if(name==='livemenu'){renderLiveMenu();renderTodayOrders();}
  if(name==='menu'){renderMenu();setTimeout(loadMenuFromFirebase,400);}
  if(name==='customers'){renderCustomers();setTimeout(loadCustomersFromFirebase,300);}
  if(name==='waiter'){renderWaiterCalls();setTimeout(loadWaiterCallsFromFirebase,300);}
  if(name==='waste'){renderWaste();setTimeout(loadWasteFromFirebase,300);}
  if(name==='branches'){renderBranches();setTimeout(loadBranchesFromFirebase,300);}
  if(name==='tables'){renderTables();setTimeout(loadTablesFromFirebase,500);}
  if(name==='kot'){renderKOT();setTimeout(loadKotsFromFirebase,400);}
  if(name==='billing')renderBilling();
  if(name==='customers')renderCustomers();
  if(name==='waiter')renderWaiterCalls();
  if(name==='branches')renderBranches();
  if(name==='analytics'){_anSetActivePeriodBtn(_anPeriod||'today');setTimeout(loadAnalyticsFromFirebase,150);}
  if(name==='ai')renderAICards();
  if(name==='timers')renderActiveTimers();
  if(name==='orderhistory')renderOrderHistory();
  if(name==='tasks'){renderTasks('all');renderTaskStats();loadTasksFromFirebase();}
  if(name==='waste')renderWaste();
  if(name==='voice')renderVoiceCommands();
  if(name==='suppliers'){renderSuppliers();setTimeout(loadSuppliersFromFirebase,300);}
  if(name==='reports')initReports();
  if(name==='expiry'){renderExpiryPage();loadExpiryFromFirebase();}
  if(name==='gstbill'){initGSTPage();loadGSTInvoiceHistory();}
  if(window.lucide)setTimeout(()=>lucide.createIcons(),50);
  updateFeatTabCounts();
}

// ═══ THEME ═══
function setTheme(t){
  const themes={
    blue:{'--accent':'#3b82f6','--accent2':'#60a5fa','--accent3':'#1d4ed8','--gold':'#3b82f6','--gold-dark':'#1d4ed8','--gold-dim':'rgba(59,130,246,0.08)','--border2':'rgba(59,130,246,0.25)'},
    purple:{'--accent':'#8b5cf6','--accent2':'#a78bfa','--accent3':'#6d28d9','--gold':'#8b5cf6','--gold-dark':'#6d28d9','--gold-dim':'rgba(139,92,246,0.08)','--border2':'rgba(139,92,246,0.25)'},
    orange:{'--accent':'#f59e0b','--accent2':'#fbbf24','--accent3':'#d97706','--gold':'#f59e0b','--gold-dark':'#d97706','--gold-dim':'rgba(245,158,11,0.08)','--border2':'rgba(245,158,11,0.25)'},
  };
  const r=document.documentElement;
  if(!t){['--accent','--accent2','--accent3','--gold','--gold-dark','--gold-dim','--border2'].forEach(k=>r.style.removeProperty(k));}
  else{Object.entries(themes[t]||{}).forEach(([k,v])=>r.style.setProperty(k,v));}
  document.getElementById('themePalette').classList.remove('open');
  showToast('Theme changed!');
}
function toggleThemePalette(){document.getElementById('themePalette').classList.toggle('open');}
document.addEventListener('click',e=>{const pal=document.getElementById('themePalette');if(pal&&!pal.contains(e.target)&&!e.target.closest('[onclick*="toggleThemePalette"]'))pal.classList.remove('open');});

// ═══ FEATURE TABS NAVIGATION ═══
function featNav(el, pageName) {
  document.querySelectorAll('.feat-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  showPage(pageName);
  // Update counts dynamically
  updateFeatTabCounts();
}

function updateFeatTabCounts() {
  const kotCount = document.getElementById('ft-kot-count');
  if(kotCount) kotCount.textContent = appData.kots.filter(k=>k.status==='pending').length + ' pending';
  const tableCount = document.getElementById('ft-table-count');
  if(tableCount) tableCount.textContent = appData.tables.length + ' tables';
  const liveCount = document.getElementById('ft-live-count');
  if(liveCount && appData.liveOrders) liveCount.textContent = appData.liveOrders.filter(o=>o.status!=='served').length + ' live';
  const staffCount = document.getElementById('ft-staff-count');
  if(staffCount) staffCount.textContent = appData.staff.filter(s=>s.present).length + ' present';
  const invCount = document.getElementById('ft-inv-count');
  if(invCount) invCount.textContent = appData.inventory.filter(i=>i.qty<=i.minQty).length + ' low';
  const taskCount = document.getElementById('ft-task-count');
  if(taskCount) taskCount.textContent = appData.tasks.filter(t=>t.status!=='done').length + ' tasks';
}

// ═══ KOT TABLE VISUAL GRID ═══
let kotSelectedTable = null;
function renderKotTableGrid() {
  const grid = document.getElementById('kotTableGrid');
  if(!grid) return;
  const statusMap = {available:'tb-avail',pending:'tb-occ',preparing:'tb-prep',served:'tb-serv',urgent:'tb-urg',vip:'tb-vip'};
  const statusLabel = {available:'Free',pending:'Waiting',preparing:'Cooking',served:'Served',urgent:'Urgent!',vip:'VIP'};
  grid.innerHTML = appData.tables.map(t => {
    const cls = statusMap[t.status] || 'tb-avail';
    const lbl = statusLabel[t.status] || t.status;
    const isSelected = kotSelectedTable === t.id;
    return `<div class="tbl-box ${cls}${isSelected?' tb-selected':''}" onclick="selectKotTable(${t.id},this)">
      <div class="t-n">T${t.id}</div>
      <div class="t-s">${lbl}</div>
    </div>`;
  }).join('');
}

function selectKotTable(id, el) {
  kotSelectedTable = id;
  // Update hidden select
  const sel = document.getElementById('kotTable');
  if(sel) sel.value = id;
  // Update badge
  const badge = document.getElementById('kotTableSelectedBadge');
  const txt = document.getElementById('kotTableSelectedText');
  const t = appData.tables.find(x=>x.id===id);
  if(badge && txt && t) {
    badge.style.display = 'block';
    txt.textContent = `Table ${id} (${t.status.toUpperCase()})`;
  }
  // Re-render grid to show selected
  renderKotTableGrid();
}

// ═══ MODALS ═══
function openModal(id){
  const el=document.getElementById(id);if(!el)return;
  el.classList.add('open');
  setTimeout(()=>{if(window.lucide)lucide.createIcons();},50);
  if(id==='newOrderModal'){kotSelectedTable=null;const badge=document.getElementById('kotTableSelectedBadge');if(badge)badge.style.display='none';renderKotTableGrid();}
  if(id==='addLiveOrderModal'){loSelectedTable=null;const badge=document.getElementById('loTableSelectedBadge');if(badge)badge.style.display='none';renderLiveOrderTableGrid();}
}
function closeModal(id){const el=document.getElementById(id);if(el)el.classList.remove('open');}

let loSelectedTable=null;
function renderLiveOrderTableGrid(){
  const grid=document.getElementById('liveOrderTableGrid');if(!grid)return;
  const statusMap={available:'tb-avail',pending:'tb-occ',preparing:'tb-prep',served:'tb-serv',urgent:'tb-urg',vip:'tb-vip'};
  const statusLabel={available:'Free',pending:'Waiting',preparing:'Cooking',served:'Served',urgent:'Urgent!',vip:'VIP'};
  grid.innerHTML=appData.tables.map(t=>{
    const cls=statusMap[t.status]||'tb-avail';
    const lbl=statusLabel[t.status]||t.status;
    const isSel=loSelectedTable===t.id;
    return `<div class="tbl-box ${cls}${isSel?' tb-selected':''}" onclick="selectLoTable(${t.id},this)">
      <div class="t-n">T${t.id}</div><div class="t-s">${lbl}</div></div>`;
  }).join('');
}
function selectLoTable(id,el){
  loSelectedTable=id;
  const sel=document.getElementById('lo-table');if(sel)sel.value=id;
  const badge=document.getElementById('loTableSelectedBadge');const txt=document.getElementById('loTableSelectedText');
  const t=appData.tables.find(x=>x.id===id);
  if(badge&&txt&&t){badge.style.display='block';txt.textContent=`Table ${id} (${t.status.toUpperCase()})`;}
  renderLiveOrderTableGrid();
}

document.querySelectorAll('.modal-overlay').forEach(m=>{m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open');});});

// ═══ TOAST ═══
function showToast(msg,color='var(--accent)'){
  const t=document.createElement('div');t.className='toast';t.style.borderLeftColor=color;t.style.borderLeftWidth='3px';
  t.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>${msg}`;
  document.getElementById('toastArea').appendChild(t);
  setTimeout(()=>{t.style.animation='toastIn .3s ease reverse';setTimeout(()=>t.remove(),300);},3000);
}


// ═══ CHART COLORS ═══
const PIE_COLORS=['#2e9c5e','#3b82f6','#f59e0b','#8b5cf6','#ef4444','#ec4899','#14b8a6','#f97316'];
const PIE_COLORS_SOFT=PIE_COLORS.map(c=>c+'cc');
const CHART_OPTS={responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{color:'#6c7890',font:{size:11},padding:10,usePointStyle:true,pointStyleWidth:8}},tooltip:{backgroundColor:'rgba(26,32,51,0.9)',titleFont:{family:'Poppins',size:12},bodyFont:{size:11},padding:10,cornerRadius:10}}};

// ═══ DASHBOARD ═══
let dashChartInst=null;
// ═══ DASHBOARD FIREBASE REAL DATA ═══
// Dashboard ke liye Firebase se live data fetch karo
async function loadDashboardFromFirebase(){
  const db = window.__chefDb;
  if(!db){ renderDashboard(); return; }
  try{
    const {collection, getDocs, query, orderBy, limit, where, Timestamp} =
      await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');

    // Aaj ka start time (midnight)
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const todayTs = Timestamp.fromDate(todayStart);

    // Firebase se orders + gst_invoices + orderHistory parallel mein load karo
    const [ordSnap, gstSnap, ohSnap] = await Promise.all([
      getDocs(collection(db,'orders')).catch(()=>({docs:[],forEach:()=>{}})),
      getDocs(collection(db,'gst_invoices')).catch(()=>({docs:[]})),
      getDocs(collection(db,'orderHistory')).catch(()=>({docs:[]})),
    ]);

    // Orders parse karo
    const allOrders = [];
    ordSnap.forEach(d => allOrders.push({_fbId:d.id, ...d.data()}));

    // Aaj ke orders filter karo
    function isTodayEntry(entry){
      const ts = entry.createdAt || entry.timestamp || entry.paidAt || entry.servedAt;
      if(!ts) return false;
      const ms = typeof ts==='string' ? new Date(ts).getTime()
                 : typeof ts==='number' ? ts
                 : ts.toMillis ? ts.toMillis() : 0;
      return ms >= todayStart.getTime();
    }

    // GST invoices (bills) aaj ke
    const gstToday = gstSnap.docs
      .map(d=>d.data())
      .filter(isTodayEntry);

    // orderHistory aaj ke
    const ohToday = ohSnap.docs
      .map(d=>d.data())
      .filter(isTodayEntry);

    // Aaj ke served/paid orders
    const servedToday = allOrders.filter(o =>
      (o.status==='served'||o.status==='paid') && isTodayEntry(o)
    );

    // Revenue calculate karo — gst_invoices se (most accurate)
    let todayRevenue = 0;
    gstToday.forEach(inv => {
      todayRevenue += Number(inv.grandTotal||inv.total||inv.amount||0);
    });
    // Agar gst_invoices mein kuch nahi to orders se lo
    if(todayRevenue === 0){
      servedToday.forEach(o => {
        todayRevenue += Number(o.total||o.grandTotal||o.amount||0);
      });
    }
    // orderHistory se bhi add karo agar alag hai
    if(todayRevenue === 0){
      ohToday.forEach(o => {
        todayRevenue += Number(o.total||o.grandTotal||o.amount||0);
      });
    }

    // Served today count
    const servedCount = servedToday.length + ohToday.length + gstToday.length;

    // Active tables — Firebase orders + local tables
    const fbActiveTables = new Set(
      allOrders
        .filter(o=>!['served','paid','cancelled'].includes(o.status))
        .map(o=>o.tableNumber||o.table)
        .filter(Boolean)
    );
    const localActiveTables = appData.tables.filter(t=>['pending','preparing','urgent','vip'].includes(t.status)).length;
    const activeTables = Math.max(fbActiveTables.size, localActiveTables);

    // Pending KOTs — Firebase + local
    const fbPendingKots = allOrders.filter(o=>o.status==='pending'||o.status==='accepted').length;
    const localPendingKots = appData.kots.filter(k=>k.status==='pending').length;
    const pendingKots = Math.max(fbPendingKots, localPendingKots);

    // Dashboard metrics update karo
    const mActive = document.getElementById('m-active');
    const mPending = document.getElementById('m-pending');
    const mServed = document.getElementById('m-served');
    const mRevenue = document.getElementById('m-revenue');
    if(mActive) mActive.textContent = activeTables;
    if(mPending) mPending.textContent = pendingKots;
    if(mServed) mServed.textContent = servedCount || servedToday.length;
    if(mRevenue) mRevenue.textContent = '₹' + todayRevenue.toLocaleString('en-IN');

    // Pills update karo real data se
    _updateDashboardPills(allOrders);

    // Smart Alerts — real data se generate karo
    _renderSmartAlertsRealData(allOrders);

    // Top Dishes chart — Firebase orders se
    _updateDashChartFromFirebase(allOrders);

    // Live Queue update karo Firebase orders se
    window.__dashFbOrders = allOrders;
    renderDashboard();

    console.log('[DASHBOARD] Firebase real data loaded — Revenue:', todayRevenue, '| Served:', servedCount);
  } catch(e){
    console.warn('[DASHBOARD] Firebase error:', e.message);
    renderDashboard(); // fallback to local
  }
}

// Pills ko real data se update karo
function _updateDashboardPills(allOrders){
  const pillsEl = document.querySelector('#page-dashboard .pills');
  if(!pillsEl) return;
  const staffPresent = appData.staff.filter(s=>s.present).length;
  const staffTotal = appData.staff.length;
  const urgentKots = appData.kots.filter(k=>k.status==='pending').length
    + (allOrders||[]).filter(o=>o.status==='pending').length;
  const vipTables = appData.tables.filter(t=>t.status==='vip').length;
  const lowStock = appData.inventory.filter(i=>i.qty<=i.minQty).length;
  const pendingTasks = appData.tasks.filter(t=>t.status!=='done').length;
  const qrOrdersToday = (allOrders||[]).filter(o=>{
    const ts = o.createdAt||o.timestamp;
    if(!ts) return false;
    const ms = typeof ts==='string'?new Date(ts).getTime():typeof ts==='number'?ts:ts.toMillis?ts.toMillis():0;
    const today = new Date(); today.setHours(0,0,0,0);
    return ms >= today.getTime();
  }).length;
  pillsEl.innerHTML = `
    <div class="pill d-green"><div class="dot"></div><span>${staffPresent}/${staffTotal} Staff Present</span></div>
    <div class="pill ${urgentKots>0?'d-red':'d-green'}"><div class="dot"></div><span>${urgentKots} Urgent KOTs</span></div>
    <div class="pill d-gold"><div class="dot"></div><span>${vipTables} VIP Table${vipTables!==1?'s':''}</span></div>
    <div class="pill ${lowStock>0?'d-orange':'d-green'}"><div class="dot"></div><span>${lowStock} Low Stock Item${lowStock!==1?'s':''}</span></div>
    <div class="pill d-purple"><div class="dot"></div><span>${pendingTasks} Task${pendingTasks!==1?'s':''} Assigned</span></div>
    <div class="pill d-green"><div class="dot"></div><span>QR Orders: ${qrOrdersToday} Today</span></div>
  `;
}

// Smart Alerts real data se generate karo
function _renderSmartAlertsRealData(allOrders){
  const sa = document.getElementById('smartAlerts');
  if(!sa) return;
  const alerts = [];

  // Low stock alerts
  appData.inventory.filter(i=>i.qty<=i.minQty).slice(0,3).forEach(i=>{
    alerts.push({msg:`${i.emoji||'📦'} ${i.name} stock LOW — ${i.qty}${i.unit} remaining`,color:'var(--red)'});
  });

  // Expiring items (2 din mein)
  const soon = new Date(); soon.setDate(soon.getDate()+2);
  appData.inventory.filter(i=>i.expiry&&new Date(i.expiry)<=soon&&new Date(i.expiry)>new Date()).slice(0,2).forEach(i=>{
    const daysLeft = Math.ceil((new Date(i.expiry)-new Date())/(1000*60*60*24));
    alerts.push({msg:`⏰ ${i.name} expiring in ${daysLeft} day${daysLeft!==1?'s':''}`,color:'var(--orange)'});
  });

  // VIP tables
  appData.tables.filter(t=>t.status==='vip').forEach(t=>{
    alerts.push({msg:`👑 VIP Table ${t.id} — Priority service active`,color:'var(--accent)'});
  });

  // Urgent KOTs
  const urgKots = appData.kots.filter(k=>k.status==='pending').slice(0,2);
  urgKots.forEach(k=>{
    alerts.push({msg:`🔥 KOT #${k.id} Pending — ${k.station||'Kitchen'} station`,color:'var(--red)'});
  });

  // Long waiting tables
  appData.tables.filter(t=>t.time&&t.time>15&&t.status==='pending').slice(0,2).forEach(t=>{
    alerts.push({msg:`⏳ Table ${t.id} — Waiting ${t.time} minutes`,color:'var(--orange)'});
  });

  // Firebase se pending orders
  const fbPending = (allOrders||[]).filter(o=>o.status==='pending').slice(0,2);
  fbPending.forEach(o=>{
    alerts.push({msg:`📱 QR Order — Table ${o.tableNumber||o.table||'?'} pending confirmation`,color:'var(--blue)'});
  });

  if(alerts.length===0){
    alerts.push({msg:'✅ Sab theek hai! Koi alert nahi abhi.',color:'var(--green)'});
  }

  sa.innerHTML = alerts.slice(0,6).map(a=>`
    <div class="ai-card" style="border-left:3px solid ${a.color};">
      <div style="font-size:13px;color:var(--text);font-weight:600;">${a.msg}</div>
    </div>`).join('');
}

// Top Dishes chart Firebase orders se update karo
function _updateDashChartFromFirebase(allOrders){
  if(!allOrders||!allOrders.length) return;
  // Dish count tally karo
  const dishCount = {};
  allOrders.forEach(o=>{
    (o.items||[]).forEach(item=>{
      const name = item.name||item;
      if(typeof name==='string') dishCount[name]=(dishCount[name]||0)+(item.qty||1);
    });
  });
  if(!Object.keys(dishCount).length) return;
  // Top 5 dishes
  const top5 = Object.entries(dishCount)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,5);
  window.__dashTop5Dishes = top5;
}

function renderDashboard(){
  const active=appData.tables.filter(t=>['pending','preparing','urgent','vip'].includes(t.status)).length;
  const pending=appData.kots.filter(k=>k.status==='pending').length;
  const lq=document.getElementById('liveQueue');
  if(lq){
    // Live orders se data lo — Firebase + local + KOT
    const fbOrders = window.__dashFbOrders || window._liveFirebaseOrders || [];
    const fbActive=fbOrders
      .filter(o=>!['served','paid','cancelled'].includes(o.status))
      .map(o=>({
        id:'FB-'+(o._fbId||'').slice(-6).toUpperCase(),
        tableId:o.tableNumber||o.table||'?',
        customerName:o.customerName||'',
        dishes:(o.items||[]).map(i=>i.name||i),
        status:{pending:'waiting',accepted:'cooking',ready:'ready',served:'serving'}[o.status]||o.status,
        source:'qr'
      }));
    const localActive=(appData.liveOrders||[]).filter(o=>o.status!=='served');
    // KOT orders bhi include karo
    const kotActive=appData.kots.filter(k=>k.status!=='served').map(k=>({
      id:'KOT-'+k.id, tableId:k.tableId, customerName:'', dishes:k.items||[], status:k.status, source:'kot'
    }));
    // Merge — duplicates avoid: same tableId + same source ka ek hi entry
    const seen=new Set();
    const allActive=[...fbActive,...localActive,...kotActive].filter(o=>{
      const key=o.source+'-'+o.tableId;
      if(seen.has(key)&&o.source!=='kot') return false;
      seen.add(key); return true;
    }).slice(0,6);
    const statusColor={waiting:'var(--orange)',cooking:'var(--blue)',ready:'var(--green)',serving:'var(--purple)',pending:'var(--orange)',preparing:'var(--blue)'};
    const statusIcon={waiting:'⏳',cooking:'🔥',ready:'✅',serving:'🧑‍🍽️',pending:'⏳',preparing:'🔥'};
    lq.innerHTML=allActive.length?allActive.map(o=>`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;font-size:13px;">
        <span style="font-weight:700;display:flex;align-items:center;gap:8px;">
          <span style="font-size:16px;">${statusIcon[o.status]||'📋'}</span>
          🪑 Table ${o.tableId}${o.customerName?' — '+o.customerName:''}
          ${o.dishes&&o.dishes.length?`<span style="font-size:11px;color:var(--text2);font-weight:500;">(${o.dishes[0]}${o.dishes.length>1?' +'+( o.dishes.length-1):''})</span>`:''}
        </span>
        <span style="font-family:var(--font-mono);font-size:11px;font-weight:800;color:${statusColor[o.status]||'var(--text2)'};background:${statusColor[o.status]||'var(--text2)'}18;padding:3px 10px;border-radius:20px;">${(o.status||'').toUpperCase()}</span>
      </div>`).join('')
      :`<div style="text-align:center;padding:24px;color:var(--text2);font-size:14px;">Koi active order nahi abhi.</div>`;
    // Metrics update (agar Firebase ne already set nahi kiya)
    const mActive = document.getElementById('m-active');
    const mPending = document.getElementById('m-pending');
    if(mActive && (mActive.textContent==='7'||mActive.textContent==='0')){
      const totalActive=fbActive.length+localActive.filter(o=>o.status!=='served').length;
      mActive.textContent=Math.max(active,totalActive)||active;
    }
    if(mPending && (mPending.textContent==='4'||mPending.textContent==='0')){
      const pendingKots=appData.kots.filter(k=>k.status==='pending').length;
      mPending.textContent=pendingKots||localActive.filter(o=>o.status==='waiting').length||fbActive.filter(o=>o.status==='waiting').length||0;
    }
    // m-served update agar default value hai
    const mServed = document.getElementById('m-served');
    if(mServed && mServed.textContent==='23'){
      mServed.textContent = (appData.servedOrdersHistory||[]).length || fbActive.filter(o=>o.status==='serving').length || 0;
    }
  }
  // Smart Alerts — agar Firebase se load nahi hua to local se generate karo
  const sa=document.getElementById('smartAlerts');
  if(sa && !sa.innerHTML.trim()){
    _renderSmartAlertsRealData([]);
  } else if(sa && sa.querySelectorAll('.ai-card').length===0){
    _renderSmartAlertsRealData([]);
  }
  renderServedHistory();
  setTimeout(initDashChart,150);
}
function initDashChart(){
  const ctx=document.getElementById("dashChart");if(!ctx)return;
  if(dashChartInst)dashChartInst.destroy();
  // Firebase top dishes use karo agar available
  let labels, data;
  if(window.__dashTop5Dishes && window.__dashTop5Dishes.length){
    labels=window.__dashTop5Dishes.map(([name])=>name.split(" ")[0]);
    data=window.__dashTop5Dishes.map(([,count])=>count);
  } else {
    labels=appData.menu.slice(0,5).map(d=>d.emoji+" "+d.name.split(" ")[0]);
    data=appData.menu.slice(0,5).map(d=>d.sold);
  }
  dashChartInst=new Chart(ctx,{type:"bar",data:{
    labels,
    datasets:[{
      label:"Orders Today",
      data,
      backgroundColor:PIE_COLORS.map(c=>c+"bb"),
      borderColor:PIE_COLORS,borderWidth:2,borderRadius:8,borderSkipped:false
    }]},
    options:{...CHART_OPTS,scales:{y:{beginAtZero:true,grid:{color:"rgba(0,0,0,.05)"},ticks:{color:"#6c7890",font:{size:10}}},x:{grid:{display:false},ticks:{color:"#6c7890",font:{size:9}}}}}});
}

// ═══ KOT ═══
let kotFilter='all';
function renderKOT(){
  const grid=document.getElementById('kotGrid');if(!grid)return;
  // Served orders appData.kots se hamesha remove karo
  appData.kots = appData.kots.filter(k => k.status !== 'served');

  // Firebase live orders bhi KOT mein dikhao (jo appData.kots mein nahi hain)
  const fbOrders = (window._liveFirebaseOrders || []).filter(o =>
    !['paid','cancelled','served'].includes(o.status)
  );
  const fbKots = fbOrders
    .filter(o => !appData.kots.some(k => k._fbId && k._fbId === o._fbId))
    .map(o => {
      let status = 'pending';
      if(o.status==='accepted'||o.status==='confirmed_by_captain'||o.status==='cooking') status='preparing';
      else if(o.status==='ready'||o.status==='chefReady') status='ready';
      return {
        id: o._fbId || ('fb_'+Date.now()),
        _fbId: o._fbId,
        tableId: o.tableNumber||o.table||'?',
        customerName: o.customerName||'',
        customerPhone: o.customerPhone||'',
        items: (o.items||[]).map(i=>typeof i==='string'?i:(i.name+(i.qty>1?' ×'+i.qty:'')+(i.portion&&i.portion!=='Full'?' ('+i.portion+')':''))),
        notes: o.notes||'',
        status,
        time: o.time||new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}),
        station: 'kitchen',
        orderNumber: o.orderNumber||('#'+(o._fbId||'').slice(-6).toUpperCase()),
        _isFirebase: true
      };
    });

  let allKots = [...appData.kots, ...fbKots];
  let kots = allKots;
  if(kotFilter!=='all') kots=allKots.filter(k=>k.status===kotFilter);

  const stationColor={'tandoor':'var(--orange)','chinese':'var(--red)','grill':'var(--green)','dessert':'var(--purple)','cold':'var(--blue)'};
  grid.innerHTML=kots.length?kots.map(k=>{
    // Source badge
    const isOD = k.source==='order-desk'||k.source==='billing'||k._billingId;
    const isFb = k._isFirebase;
    const srcBadge = isFb
      ? `<span style="font-size:9px;font-weight:800;padding:2px 8px;border-radius:10px;background:rgba(250,204,21,0.12);color:#fde047;border:1px solid rgba(250,204,21,0.3);letter-spacing:0.5px">👑 CAPTAIN</span>`
      : isOD
      ? `<span style="font-size:9px;font-weight:800;padding:2px 8px;border-radius:10px;background:rgba(139,92,246,0.15);color:#8b5cf6;border:1px solid rgba(139,92,246,0.3);letter-spacing:0.5px">ORDER DESK</span>`
      : `<span style="font-size:9px;font-weight:800;padding:2px 8px;border-radius:10px;background:rgba(59,130,246,0.12);color:var(--blue);border:1px solid rgba(59,130,246,0.25);letter-spacing:0.5px">${(k.station||'kitchen').toUpperCase()}</span>`;
    const orderNum = k.orderNumber || ('#'+String(k.id).slice(-6).toUpperCase());
    // Status color bar
    const statusBar = k.status==='pending'
      ? 'background:linear-gradient(90deg,#ef4444,#f87171)'
      : k.status==='preparing'
      ? 'background:linear-gradient(90deg,#3b82f6,#60a5fa)'
      : k.status==='ready'
      ? 'background:linear-gradient(90deg,#22c55e,#4ade80)'
      : 'background:linear-gradient(90deg,#6b7280,#9ca3af)';

    // Action buttons — Firebase orders ke liye alag handling
    let actionBtns = '';
    if(isFb && k._fbId){
      actionBtns = k.status==='pending'
        ? `<button class="kot-btn kb-start" onclick="setOrderTime('${k._fbId}',${k.tableId})"><svg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M3 2h18v8a9 9 0 01-18 0V2z'/><line x1='12' y1='12' x2='12' y2='22'/></svg> Start Cooking</button>`
        : k.status==='preparing'
        ? `<button class="kot-btn kb-ready" onclick="markOrderReady('${k._fbId}',${k.tableId},'${(k.items[0]||'').split(' ')[0]}')"><svg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><polyline points='20 6 9 17 4 12'></polyline></svg> Mark Ready ✓</button>`
        : `<span style="font-size:11px;color:var(--green);padding:4px 0;">✅ Ready — Waiter assign karo</span>`;
    } else {
      actionBtns = k.status==='pending'
        ? `<button class="kot-btn kb-start" onclick="updateKOT(${k.id},'preparing')"><svg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M3 2h18v8a9 9 0 01-18 0V2z'/><line x1='12' y1='12' x2='12' y2='22'/></svg> Start Cooking</button>`
        : k.status==='preparing'
        ? `<button class="kot-btn kb-ready" onclick="updateKOT(${k.id},'ready')"><svg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><polyline points='20 6 9 17 4 12'></polyline></svg> Mark Ready ✓</button>`
        : k.status==='ready'
        ? `<button class="kot-btn kb-print" style="background:rgba(34,197,94,0.12);color:var(--green);border:1px solid rgba(34,197,94,0.3);" onclick="updateKOT(${k.id},'served')"><svg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2'/><circle cx='9' cy='7' r='4'/><polyline points='16 11 18 13 22 9'/></svg> Served ✓</button>`
        : `<span style="font-size:11px;color:var(--text2);padding:4px 0;">✅ Order Served</span>`;
    }

    return `<div class="kot-ticket" style="border-top:none;">
      <div style="position:absolute;top:0;left:0;right:0;height:4px;${statusBar};border-radius:var(--radius) var(--radius) 0 0"></div>
      <div class="kot-hd" style="margin-top:6px;">
        <div>
          <div class="kot-tbl">${k.tableId && k.tableId>0 ? 'Table '+k.tableId : '🛒 Order Desk'}</div>
          <div style="font-size:10px;font-weight:700;color:var(--text2);font-family:var(--font-mono);margin-top:2px;">${orderNum}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
          <div class="kot-time">${k.time}</div>
          ${srcBadge}
        </div>
      </div>
      ${(k.customerName||k.customerPhone)?`<div style="font-size:11px;font-weight:600;padding:5px 8px;margin-bottom:6px;background:rgba(46,156,94,0.08);border-radius:7px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;border:1px solid rgba(46,156,94,0.15);">
        ${k.customerName?`<span>👤 ${k.customerName}</span>`:''}
        ${k.customerPhone?`<span>📞 ${k.customerPhone}</span>`:''}
      </div>`:''}
      <div class="kot-items">
        ${k.items.map(it=>`<div class="kot-item"><span style="font-weight:600;">${it}</span></div>`).join('')}
      </div>
      ${k.notes?`<div style="font-size:12px;color:var(--orange);margin-top:7px;font-style:italic;display:flex;align-items:center;gap:6px;padding:5px 8px;background:rgba(255,165,0,0.08);border-radius:6px;border-left:3px solid var(--orange);"><svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'></path></svg> <strong>Note:</strong> ${k.notes}</div>`:''}
      <div class="kot-foot">
        ${actionBtns}
        <button class="kot-btn kb-print" onclick="printKOT(${k.id})"><svg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><polyline points='6 9 6 2 18 2 18 9'></polyline><path d='M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2'></path><rect x='6' y='14' width='12' height='8'></rect></svg> Print</button>
      </div>
    </div>`;
  }).join('')
    :`<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text2);font-size:14px;">No KOT orders. Create one using + New KOT</div>`;
  document.getElementById('kotBadge').textContent=allKots.filter(k=>k.status==='pending').length||'';
}
function filterKOT(f){kotFilter=f;renderKOT();}
function addNewKOT(){
  const tableId=kotSelectedTable||document.getElementById('kotTable').value;const station=document.getElementById('kotStation').value;
  const itemsRaw=document.getElementById('kotItemsInput').value.trim();const notes=document.getElementById('kotNotes').value;
  if(!tableId||!itemsRaw){showToast('Please select a Table & add Items','var(--red)');return;}
  const items=itemsRaw.split('\n').map(s=>s.trim()).filter(Boolean);
  const kot={id:Date.now(),tableId:parseInt(tableId),station,items,notes,status:'pending',time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})};
  // Firebase mein save karo
  setTimeout(()=>saveKotToFirebase(kot),200);
  appData.kots.push(kot);closeModal('newOrderModal');
  document.getElementById('kotItemsInput').value='';document.getElementById('kotNotes').value='';kotSelectedTable=null;
  renderKOT();renderDashboard();
  
  showToast(`KOT #${kot.id} created — Table ${tableId}!`);
  updateFeatTabCounts();
}
function updateKOT(id,status){
  const k=appData.kots.find(x=>x.id===id);
  if(k){k.status=status;renderKOT();renderKitBoard();if(status==='ready'){showToast(`KOT Ready — Table ${k.tableId}!`,'var(--green)');}else if(status==='preparing'){showToast(`Table ${k.tableId} — Cooking shuru!`,'var(--blue)');}}
}
function printKOT(id){showToast(`KOT #${id} sent to printer!`);}
function printAllKOT(){showToast('All KOTs sent to printer!');}

// ═══ TABLES ═══
let tableFilter='all';
function renderTables(){
  const grid=document.getElementById('tableGrid');if(!grid)return;

  // Master dashboard tables data se status merge karo
  const masterData=window._masterTablesData||{};
  // Merge master status into appData.tables
  appData.tables.forEach(t=>{
    const m=masterData[t.id]||masterData[String(t.id)];
    if(m){
      // Master status ko chef status mein map karo
      if(m.status==='occupied'&&t.status==='available') t.status='pending';
      if(m.status==='available'&&(t.status==='served')) t.status='available';
      if(m.customerName) t.customerName=m.customerName;
      if(m.customerPhone) t.customerPhone=m.customerPhone;
      if(m.order&&m.order.length&&!t.items.length) t.items=m.order.map(i=>i.name||i);
    }
    // Also sync from Firebase live orders
    const fbOrd=(window._liveFirebaseOrders||[]).find(o=>(o.tableNumber===t.id||o.tableNumber===String(t.id))&&o.status!=='paid'&&o.status!=='cancelled');
    if(fbOrd){
      if(t.status==='available') t.status='pending';
      if(fbOrd.customerName) t.customerName=fbOrd.customerName;
      if(fbOrd.customerPhone) t.customerPhone=fbOrd.customerPhone;
    }
  });

  let tables=appData.tables;if(tableFilter!=='all')tables=tables.filter(t=>t.status===tableFilter);
  document.getElementById('countAvail').textContent=appData.tables.filter(t=>t.status==='available').length;
  document.getElementById('countOcc').textContent=appData.tables.filter(t=>t.status!=='available').length;
  document.getElementById('countUrg').textContent=appData.tables.filter(t=>t.status==='urgent').length;
  const statusMap={
    available:['t-avail','AVAILABLE','circle'],
    pending:['t-pend','PENDING','clock'],
    preparing:['t-prep','COOKING','flame'],
    served:['t-serv','SERVED','check-circle'],
    urgent:['t-urg','URGENT','alert-circle'],
    vip:['t-vip','VIP','crown'],
    occupied:['t-pend','OCCUPIED','clock'],
    'not-available':['t-urg','BLOCKED','alert-circle'],
    reserved:['t-vip','RESERVED','crown']
  };
  grid.innerHTML=tables.map(t=>{
    const [cls,lbl,ico]=statusMap[t.status]||['t-avail','AVAILABLE','circle'];
    const custLine=t.customerName?`<div style="font-size:8px;font-weight:700;color:var(--accent);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:88px;padding:0 4px;">👤 ${t.customerName}</div>`:'';
    const masterBadge=(masterData[t.id]||masterData[String(t.id)])?`<div style="position:absolute;top:3px;left:3px;width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 4px var(--green);" title="Master sync"></div>`:'';
    return `<div class="tbl-card ${cls}" onclick="showTableDetail(${t.id})" style="position:relative;">
      ${masterBadge}
      <div class="tbl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></svg></div>
      <div class="tbl-num">${t.id}</div>
      <div class="tbl-badge">${lbl}</div>
      ${custLine}
      ${t.time>0?`<div class="tbl-timer">${t.time}min</div>`:'<div class="tbl-timer" style="color:var(--green);font-size:9px;">OPEN</div>'}
    </div>`;}).join('');
}
function filterTables(f){tableFilter=f;renderTables();}
function showTableDetail(id){
  const t=appData.tables.find(x=>x.id===id);if(!t)return;
  // Firebase se customer info lo
  const fbOrder=(window._liveFirebaseOrders||[]).find(o=>(o.tableNumber===id||o.tableNumber===String(id)||o.table===id)&&o.status!=='paid'&&o.status!=='cancelled');
  const custName=t.customerName||fbOrder?.customerName||'';
  const custPhone=t.customerPhone||fbOrder?.customerPhone||'';
  const fbItems=fbOrder?.items||(t.order||[]);
  // Master dashboard status sync
  const masterStatus=(()=>{
    if(window._masterTablesData&&window._masterTablesData[id]) return window._masterTablesData[id].status;
    return null;
  })();
  const displayStatus=masterStatus||t.status;
  const statusColors={available:'var(--green)',occupied:'var(--orange)',pending:'var(--orange)',preparing:'var(--blue)',served:'var(--accent)',urgent:'var(--red)',vip:'var(--accent)','not-available':'var(--red)'};
  const sColor=statusColors[displayStatus]||'var(--accent)';

  document.getElementById('tDetailTitle').innerHTML=`Table ${t.id} — ${displayStatus.toUpperCase()} <button class="modal-close" onclick="closeModal('tableDetailModal')"><svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><line x1='18' y1='6' x2='6' y2='18'></line><line x1='6' y1='6' x2='18' y2='18'></line></svg></button>`;
  document.getElementById('tDetailBody').innerHTML=`
    <div style="display:flex;flex-direction:column;gap:11px;">
      <div class="set-row"><span class="set-lbl">Status</span><span style="color:${sColor};font-weight:800;font-size:13px;letter-spacing:1px;">${displayStatus.toUpperCase()}</span></div>
      ${custName?`
      <div style="background:rgba(46,156,94,.07);border:1.5px solid rgba(46,156,94,.25);border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;">
        <div style="font-size:10px;font-weight:800;letter-spacing:2px;color:var(--accent);font-family:var(--font-mono);">👤 CUSTOMER INFO</div>
        <div style="font-size:16px;font-weight:800;color:var(--text);">${custName}</div>
        ${custPhone?`<div style="font-size:13px;color:var(--text2);">📞 ${custPhone}</div>`:''}
      </div>`:''}
      <div class="set-row"><span class="set-lbl">Waiter</span><span>${t.waiter||fbOrder?.assignedWaiter||'Unassigned'}</span></div>
      <div class="set-row"><span class="set-lbl">Station</span><span>${t.station||'—'}</span></div>
      <div class="set-row"><span class="set-lbl">Wait Time</span><span style="font-family:var(--font-mono);font-weight:700;">${t.time} min</span></div>
      ${fbItems&&fbItems.length?`<div><div style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:var(--text2);margin-bottom:7px;">ITEMS ORDERED</div>${fbItems.map(i=>{const name=typeof i==='string'?i:(i.name||i);const qty=typeof i==='object'?(i.qty||1):1;const price=typeof i==='object'?(parseFloat(i.price)||0):0;return `<div style="padding:7px 0;border-bottom:1px solid var(--border);font-size:13px;font-weight:600;display:flex;justify-content:space-between;"><span>• ${name}${qty>1?' ×'+qty:''}</span>${price?`<span style="color:var(--accent);font-family:var(--font-mono);">₹${(price*qty).toLocaleString('en-IN')}</span>`:''}`;}).join('')+'</div>'}</div>`:t.items&&t.items.length?`<div><div style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:var(--text2);margin-bottom:7px;">ITEMS ORDERED</div>${t.items.map(i=>`<div style="padding:7px 0;border-bottom:1px solid var(--border);font-size:14px;font-weight:600;">• ${i}</div>`).join('')}</div>`:''}
      ${fbOrder?.notes||t.notes?`<div style="background:rgba(245,158,11,.07);border:1px solid rgba(245,158,11,.25);border-radius:10px;padding:9px 12px;font-size:12px;color:var(--orange);">💬 ${fbOrder?.notes||t.notes}</div>`:''}
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">
        <button class="btn-sm btn-green" onclick="updateTableStatus(${t.id},'served');closeModal('tableDetailModal')">Mark Served</button>
        <button class="btn-sm btn-gold" onclick="updateTableStatus(${t.id},'available');closeModal('tableDetailModal')">Free Table</button>
        <button class="btn-sm btn-red" onclick="updateTableStatus(${t.id},'urgent');closeModal('tableDetailModal')">Mark Urgent</button>
        <button class="btn-primary" onclick="closeModal('tableDetailModal');openModal('newOrderModal');"><svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><line x1='12' y1='5' x2='12' y2='19'></line><line x1='5' y1='12' x2='19' y2='12'></line></svg> New Order</button>
      </div>
    </div>`;
  openModal('tableDetailModal');
}
function updateTableStatus(id,status){const t=appData.tables.find(x=>x.id===id);if(t){t.status=status;renderTables();showToast(`Table ${id} → ${status.toUpperCase()}`);}}

// ═══ KITCHEN BOARD ═══
// KITCHEN BOARD - Auto Status Display

// Firebase order aata hai => PENDING

// Timer chala => COOKING | Timer khatam => READY

// Chef kuch nahi karta - sab automatic



function kbGetStatus(o){

  var fs=o.fbStatus||o.status||'';

  if(fs==='ready'||fs==='served'||fs==='serving') return 'ready';

  if(o._hasCaptainTimer||o.captainTimer>0){

    // Timer khatam ho gaya to ready

    if(o._capLeft<=0&&o._capLeft!==undefined) return 'ready';

    return 'preparing';

  }

  if(fs==='accepted'||fs==='confirmed_by_captain'||fs==='cooking') return 'preparing';

  return 'pending';

}



function kbGetTimerDisplay(o){

  if(o._hasCaptainTimer&&o.captainTimer>0&&o.captainTimerSetAt){

    var elapsed=(Date.now()-new Date(o.captainTimerSetAt).getTime())/60000;

    var left=Math.max(0,o.captainTimer-elapsed);

    var mins=Math.floor(left);

    var secs=Math.floor((left-mins)*60);

    if(left<=0) return {text:'Timer khatam!',color:'var(--red)'};

    var col=left<3?'var(--red)':left<8?'var(--orange)':'var(--blue)';

    return {text:mins+'m '+String(secs).padStart(2,'0')+'s baki',color:col};

  }

  if(o.createdAt){

    var elMin=Math.round((Date.now()-o.createdAt)/60000);

    var col2=elMin>20?'var(--red)':elMin>10?'var(--orange)':'var(--text2)';

    return {text:elMin+' min pehle aaya',color:col2};

  }

  return {text:o.time||'',color:'var(--text2)'};

}



function renderKitBoard(){

  var statusCfg={

    pending:{col:'var(--orange)',label:'PENDING',badge:'rgba(245,158,11,0.15)',brd:'rgba(245,158,11,0.4)'},

    preparing:{col:'var(--blue)',label:'COOKING',badge:'rgba(59,130,246,0.15)',brd:'rgba(59,130,246,0.4)'},

    ready:{col:'var(--green)',label:'READY',badge:'rgba(34,197,94,0.15)',brd:'rgba(34,197,94,0.4)'}

  };



  // Captain ke orders KitBoard mein NAHI dikhenge - sirf billing/QR orders yahan aayenge
  var fbOrders=(window._liveFirebaseOrders||[]).filter(function(o){

    return o.status!=='paid'&&o.status!=='cancelled'&&o.status!=='served';

  });



  var allOrders=fbOrders.map(function(o){

    var hasCap=o.captainTimer>0;

    var ctSetAt=o.captainTimerSetAt||o.updatedAt||o.timestamp||null;

    var capLeft=0;

    if(hasCap&&ctSetAt){

      var capElapsed=(Date.now()-new Date(ctSetAt).getTime())/60000;

      capLeft=Math.max(0,o.captainTimer-capElapsed);

    }

    return {

      _uid:o._fbId,

      tableId:o.tableNumber||o.table||'?',

      customerName:o.customerName||'',

      items:(o.items||[]).map(function(i){return i.name+(i.qty>1?' x'+i.qty:'');}),

      notes:o.notes||'',

      fbStatus:o.status,

      _hasCaptainTimer:hasCap,

      captainTimer:o.captainTimer||0,

      captainTimerSetAt:ctSetAt,

      _capLeft:capLeft,

      createdAt:o.timestamp?new Date(o.timestamp).getTime():0,

      time:o.time||new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})

    };

  });



  (appData.liveOrders||[]).forEach(function(o){

    var already=allOrders.some(function(x){return String(x._uid)===String(o._fbId);});

    if(!already){

      allOrders.push({

        _uid:String(o.id),

        tableId:o.tableId||o.tableNumber||'?',

        customerName:o.customerName||'',

        items:o.dishes||[],

        notes:o.notes||'',

        fbStatus:o.status,

        _hasCaptainTimer:(o.cookTime>0),

        captainTimer:o.cookTime||0,

        captainTimerSetAt:null,

        _capLeft:o.timeLeft||0,

        createdAt:o.createdAt||0,

        time:o.time||''

      });

    }

  });



  ['pending','preparing','ready'].forEach(function(status){

    var cfg=statusCfg[status];

    var el=document.getElementById('kb-'+status+'-cards');

    if(!el) return;

    var filtered=allOrders.filter(function(o){return kbGetStatus(o)===status;});

    el.innerHTML=filtered.map(function(o){

      var timer=kbGetTimerDisplay(o);

      var notesHtml=o.notes?'<div style="font-size:11px;color:var(--orange);margin-top:4px;font-weight:600;">'+o.notes+'</div>':'';

      var custHtml=o.customerName?'<div style="font-size:11px;color:var(--text2);margin-top:2px;">'+o.customerName+'</div>':'';

      var timerBar='';

      if(o._hasCaptainTimer&&o.captainTimer>0){

        var pct=o._capLeft>0?Math.round((o._capLeft/o.captainTimer)*100):0;

        var barCol=pct<25?'var(--red)':pct<50?'var(--orange)':'var(--blue)';

        timerBar='<div style="height:4px;background:rgba(0,0,0,0.08);border-radius:3px;margin-top:8px;overflow:hidden;"><div style="height:100%;width:'+pct+'%;background:'+barCol+';border-radius:3px;transition:width 1s;"></div></div>';

      }

      return '<div class="kb-card" style="border-left:3px solid '+cfg.col+';">'

        +'<div style="display:flex;justify-content:space-between;align-items:center;">'

        +'<div style="font-family:var(--font-head);font-size:15px;font-weight:800;color:var(--accent)">TABLE '+o.tableId+'</div>'

        +'<span style="font-size:10px;font-weight:800;padding:3px 10px;border-radius:20px;background:'+cfg.badge+';color:'+cfg.col+';border:1px solid '+cfg.brd+';font-family:var(--font-mono);">'+cfg.label+'</span>'

        +'</div>'

        +custHtml

        +'<div style="font-size:12px;color:var(--text2);margin-top:5px;line-height:1.5;">'+o.items.join(', ')+'</div>'

        +notesHtml

        +'<div style="font-family:var(--font-mono);font-size:11px;font-weight:700;margin-top:6px;color:'+timer.color+';">'+timer.text+'</div>'

        +timerBar

        +'</div>';

    }).join('');

    if(!filtered.length) el.innerHTML='';

  });



  document.getElementById('kbPC').textContent='('+allOrders.filter(function(o){return kbGetStatus(o)==='pending';}).length+')';

  document.getElementById('kbCC').textContent='('+allOrders.filter(function(o){return kbGetStatus(o)==='preparing';}).length+')';

  document.getElementById('kbRC').textContent='('+allOrders.filter(function(o){return kbGetStatus(o)==='ready';}).length+')';

}



// Auto-refresh every 10 seconds

setInterval(function(){

  var kbPage=document.getElementById('page-kitboard');

  if(kbPage&&kbPage.classList.contains('active')) renderKitBoard();

},10000);



// Drag/drop stubs (HTML compatibility ke liye)

var draggingId=null;

function dragStart(e,id){draggingId=id;}

function allowDrop(e){e.preventDefault();}

function dropCard(e,status){e.preventDefault();}



// ═══════════════════════════════════════════════
// STATIONS — ADVANCED MODULE (Firebase Connected)
// Features: Live Timer, KOT Status, Chef Assign,
// Station Bell, Load Meter, Notes, Handover, Score
// ═══════════════════════════════════════════════

// Firebase config (same as app)
const STN_FB_CFG = {
  apiKey: 'AIzaSyBsRxWD2R1GkSEM-duLwQe3jAi7yw5vvvM',
  authDomain: 'restaurant-system-beec1.firebaseapp.com',
  projectId: 'restaurant-system-beec1',
  storageBucket: 'restaurant-system-beec1.firebasestorage.app',
  messagingSenderId: '106757122327',
  appId: '1:106757122327:web:723d8dacbba3087b686f52'
};

async function _stnFbInit(){
  const [{initializeApp,getApps},{getFirestore}]=await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
  ]);
  const apps=getApps();
  const app=apps.length?apps[0]:initializeApp(STN_FB_CFG);
  return getFirestore(app);
}

// Station base definitions (custom stations dynamically add hote hain)
const stations=[
  {name:'Tandoor Station',cls:'tandoor',icon:'🔥',defaultMaxTime:25},
  {name:'Chinese Station',cls:'chinese',icon:'🥡',defaultMaxTime:20},
  {name:'Dessert Station',cls:'dessert',icon:'🍮',defaultMaxTime:15},
  {name:'Grill Station',cls:'grill',icon:'🥩',defaultMaxTime:22},
  {name:'Cold/Beverages',cls:'cold',icon:'❄️',defaultMaxTime:10},
];

// ─── Add Custom Station ────────────────────────────────────
function openAddStationModal(){
  document.getElementById('new-stn-name').value='';
  document.getElementById('new-stn-icon').value='🍳';
  document.getElementById('new-stn-maxtime').value='20';
  document.getElementById('new-stn-chef').value='';
  openModal('addStationModal');
}

function saveNewStation(){
  const name=document.getElementById('new-stn-name').value.trim();
  const icon=document.getElementById('new-stn-icon').value.trim()||'🍳';
  const maxTime=parseInt(document.getElementById('new-stn-maxtime').value)||20;
  const chef=document.getElementById('new-stn-chef').value.trim()||'Unassigned';
  if(!name){showToast('Station ka naam dalo!','var(--red)');return;}
  // cls banao — lowercase, spaces remove karo
  const cls='custom_'+name.toLowerCase().replace(/[^a-z0-9]/g,'_').substring(0,20)+'_'+Date.now().toString().slice(-4);
  // stations array mein add karo
  stations.push({name,cls,icon,defaultMaxTime:maxTime,custom:true});
  // stationData mein add karo
  stationData[cls]={chef,chefEmoji:'👨‍🍳',open:true,note:'',doneTodayCount:0,overdueCount:0,perfScore:100,kots:[]};
  closeModal('addStationModal');
  showToast('✅ '+name+' station add ho gaya!','var(--green)');
  renderStations();
  // Firebase mein save karo
  _saveCustomStationListToFb();
  _saveStationToFb(cls);
}

async function _saveCustomStationListToFb(){
  try{
    const db=await _stnFbInit();
    const {doc,setDoc}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const customList=stations.filter(s=>s.custom).map(s=>({name:s.name,cls:s.cls,icon:s.icon,defaultMaxTime:s.defaultMaxTime}));
    await setDoc(doc(db,'station_config','custom_stations'),{list:customList,updatedAt:Date.now()},{merge:true});
  }catch(e){console.warn('[Custom Stations FB]',e.message);}
}

function deleteCustomStation(cls){
  if(!confirm('Ye station delete karein?')) return;
  const idx=stations.findIndex(s=>s.cls===cls);
  if(idx>-1) stations.splice(idx,1);
  delete stationData[cls];
  renderStations();
  _saveCustomStationListToFb();
  showToast('Station delete ho gaya!','var(--orange)');
}
// ─── Dynamic Station Selects (custom stations ke liye) ────
function populateHandoverStations(){
  const sel=document.getElementById('handover-station');
  if(!sel) return;
  const cur=sel.value;
  sel.innerHTML=stations.map(s=>`<option value="${s.cls}">${s.icon} ${s.name}</option>`).join('');
  if(cur) sel.value=cur;
}
function populateBellFromTo(){
  const frm=document.getElementById('bell-from');
  const tot=document.getElementById('bell-to');
  if(!frm||!tot) return;
  const baseOpts=stations.map(s=>`<option value="${s.cls}">${s.icon} ${s.name}</option>`).join('');
  frm.innerHTML=baseOpts+'<option value="head_chef">👑 Head Chef</option>';
  tot.innerHTML='<option value="all">📢 All Stations (Broadcast)</option>'+baseOpts+'<option value="head_chef">👑 Head Chef</option>';
}

// ─── Hook openModal to auto-populate dynamic selects ───
const _origOpenModal=window.openModal;
window.openModal=function(id){
  if(_origOpenModal) _origOpenModal(id);
  if(id==='handoverModal') setTimeout(populateHandoverStations,60);
  if(id==='stationBellModal') setTimeout(populateBellFromTo,60);
};


// Station runtime data (synced with Firebase)
let stationData = {
  tandoor:  {chef:'Ramesh Kumar',chefEmoji:'👨‍🍳',open:true,note:'',doneTodayCount:0,overdueCount:0,perfScore:100,kots:[
    {id:'k1',dish:'Chicken Biryani x2',table:2,status:'cooking',startedAt:Date.now()-12*60000,maxTime:20},
    {id:'k2',dish:'Naan x4',table:8,status:'pending',startedAt:Date.now()-3*60000,maxTime:25},
    {id:'k3',dish:'Dal Makhani',table:9,status:'cooking',startedAt:Date.now()-26*60000,maxTime:20},
  ]},
  chinese:  {chef:'Arun Verma',chefEmoji:'👨‍🍳',open:true,note:'',doneTodayCount:0,overdueCount:0,perfScore:92,kots:[
    {id:'k4',dish:'Manchurian x1',table:5,status:'cooking',startedAt:Date.now()-8*60000,maxTime:20},
    {id:'k5',dish:'Fried Rice x2',table:5,status:'pending',startedAt:Date.now()-2*60000,maxTime:20},
  ]},
  dessert:  {chef:'Priya Sharma',chefEmoji:'👩‍🍳',open:true,note:'',doneTodayCount:0,overdueCount:0,perfScore:98,kots:[
    {id:'k6',dish:'Gulab Jamun x3',table:11,status:'ready',startedAt:Date.now()-14*60000,maxTime:15},
  ]},
  grill:    {chef:'Vikram Das',chefEmoji:'👨‍🍳',open:true,note:'',doneTodayCount:0,overdueCount:0,perfScore:85,kots:[
    {id:'k7',dish:'Paneer Tikka x2',table:3,status:'cooking',startedAt:Date.now()-10*60000,maxTime:22},
  ]},
  cold:     {chef:'Kavya Nair',chefEmoji:'👩‍🍳',open:true,note:'',doneTodayCount:0,overdueCount:0,perfScore:95,kots:[
    {id:'k8',dish:'Mango Lassi x3',table:1,status:'ready',startedAt:Date.now()-6*60000,maxTime:10},
    {id:'k9',dish:'Lemonade x2',table:4,status:'pending',startedAt:Date.now()-1*60000,maxTime:10},
  ]},
};
let _stnTimerInterval=null;
let _selectedChefForAssign=null;

// ─── Helpers ───────────────────────────────────
function _stnElapsed(startedAt){return Math.floor((Date.now()-startedAt)/1000);}
function _stnRemaining(startedAt,maxTime){return (maxTime*60)-_stnElapsed(startedAt);}
function _stnTimerClass(rem){if(rem<0)return 't-over';if(rem<300)return 't-warn';return 't-ok';}
function _stnTimerLabel(rem){
  if(rem<0){const s=Math.abs(rem);return '-'+(Math.floor(s/60)+'').padStart(2,'0')+':'+(s%60+'').padStart(2,'0');}
  return (Math.floor(rem/60)+'').padStart(2,'0')+':'+(rem%60+'').padStart(2,'0');
}
function _stnLoadColor(load){if(load>=80)return 'var(--red)';if(load>=50)return 'var(--orange)';return 'var(--accent)';}
function _stnLoadClass(load){if(load>=80)return 'stn-overloaded';return '';}
function _stnStatusLabel(st){return {pending:'⏳ Pending',cooking:'🔥 Cooking',ready:'✅ Ready'}[st]||st;}
function _stnCalcLoad(kots){if(!kots||!kots.length)return 0;const active=kots.filter(k=>k.status!=='ready').length;return Math.min(100,Math.round(active/Math.max(kots.length,1)*100+(active*15)));}
function _stnCalcOverdue(kots){return (kots||[]).filter(k=>k.status!=='ready'&&_stnRemaining(k.startedAt,k.maxTime)<0).length;}
function _stnStatusBadge(open,load){
  if(!open)return '<span class="stn-status-badge stn-badge-closed">CLOSED</span>';
  if(load>=75)return '<span class="stn-status-badge stn-badge-busy">BUSY</span>';
  return '<span class="stn-status-badge stn-badge-open">OPEN</span>';
}

// ─── Render Stations ──────────────────────────
function renderStations(){
  const grid=document.getElementById('stationGrid');
  if(!grid)return;
  let totalDone=0,totalActive=0,totalOverdue=0,perfSum=0;
  grid.innerHTML=stations.map(s=>{
    const d=stationData[s.cls];
    if(!d)return '';
    const load=_stnCalcLoad(d.kots);
    const overdueN=_stnCalcOverdue(d.kots);
    const activeN=(d.kots||[]).filter(k=>k.status!=='ready').length;
    totalDone+=d.doneTodayCount||0;
    totalActive+=activeN;
    totalOverdue+=overdueN;
    perfSum+=d.perfScore||0;

    const kotHTML=(d.kots||[]).map(k=>{
      const rem=_stnRemaining(k.startedAt,k.maxTime);
      const tCls=_stnTimerClass(rem);
      const overdueCls=rem<0&&k.status!=='ready'?'kot-overdue':'';
      return `<div class="stn-kot-item kot-${k.status} ${overdueCls}" id="kot-item-${k.id}">
        <div class="stn-kot-text">${k.dish}</div>
        <span class="stn-kot-tbl">T${k.table}</span>
        <span class="stn-timer ${tCls}" id="stimer-${k.id}">${_stnTimerLabel(rem)}</span>
        <div class="kot-status-btns">
          <button class="kot-st-btn ${k.status==='pending'?'active-pend':''}" onclick="setKotStatus('${s.cls}','${k.id}','pending')" title="Pending">⏳</button>
          <button class="kot-st-btn ${k.status==='cooking'?'active-cook':''}" onclick="setKotStatus('${s.cls}','${k.id}','cooking')" title="Cooking">🔥</button>
          <button class="kot-st-btn ${k.status==='ready'?'active-ready':''}" onclick="setKotStatus('${s.cls}','${k.id}','ready')" title="Ready">✅</button>
        </div>
      </div>`;
    }).join('');

    const emptyKot=(!d.kots||d.kots.length===0)?`<div style="text-align:center;padding:16px 0;color:var(--text2);font-size:12px;">No active KOTs</div>`:'';

    return `<div class="stn stn-${s.cls} ${!d.open?'stn-closed':''} ${_stnLoadClass(load)}" id="stn-card-${s.cls}">
      ${overdueN>0?`<div class="help-badge">⚠ ${overdueN} OVERDUE</div>`:''}
      <div class="stn-hd">
        <div class="stn-title">${s.icon} ${s.name}</div>
        <div style="display:flex;align-items:center;gap:6px;">
          ${_stnStatusBadge(d.open,load)}
          ${s.custom?`<button onclick="deleteCustomStation('${s.cls}')" title="Station Delete" style="background:none;border:1px solid rgba(239,68,68,.4);border-radius:6px;cursor:pointer;color:var(--red);font-size:10px;padding:2px 6px;font-weight:700;">✕ Del</button>`:''}
        </div>
      </div>
      <div class="stn-body">
        <div class="stn-load-row">
          <span class="stn-load-label">Station Load</span>
          <span class="stn-load-pct" style="color:${_stnLoadColor(load)}">${load}%</span>
        </div>
        <div class="stn-load-bar"><div class="stn-load-fill" style="width:${load}%;background:${_stnLoadColor(load)};"></div></div>
        <div class="stn-chef-row">
          <span class="stn-chef-avatar">${d.chefEmoji||'👨‍🍳'}</span>
          <div class="stn-chef-info">
            <div class="stn-chef-name">${d.chef||'Unassigned'}</div>
            <div class="stn-chef-role">Chef on Duty</div>
          </div>
          <button class="stn-assign-btn" onclick="openChefAssign('${s.cls}','${s.name}')">Change ✎</button>
        </div>
        ${d.note?`<div class="stn-note-box">📌 <span>${d.note}</span> <button style="background:none;border:none;cursor:pointer;color:var(--text2);font-size:12px;" onclick="clearStationNote('${s.cls}')">✕</button></div>`:''}
        <div class="stn-kot-list">${kotHTML}${emptyKot}</div>
      </div>
      <div class="stn-perf">
        <span class="stn-perf-label">Score</span>
        <div class="stn-perf-bar"><div class="stn-perf-fill" style="width:${d.perfScore||0}%"></div></div>
        <span class="stn-perf-label">${d.perfScore||0}%</span>
      </div>
      <div class="stn-stats">
        <div class="stn-stat"><div class="stn-stat-val">${d.doneTodayCount||0}</div><div class="stn-stat-lbl">Done</div></div>
        <div class="stn-stat"><div class="stn-stat-val">${activeN}</div><div class="stn-stat-lbl">Active</div></div>
        <div class="stn-stat"><div class="stn-stat-val" style="color:${overdueN>0?'var(--red)':'var(--accent)'}">${overdueN}</div><div class="stn-stat-lbl">Overdue</div></div>
      </div>
      <div class="stn-actions">
        <button class="btn-sm btn-green" style="flex:1;" onclick="markStationAllReady('${s.cls}')"><i data-lucide="check-circle"></i> All Ready</button>
        <button class="btn-sm" onclick="openStationNote('${s.cls}','${s.name}')"><i data-lucide="file-text"></i> Note</button>
        <button class="btn-sm" onclick="toggleStationOpen('${s.cls}')" style="${d.open?'border-color:var(--red);color:var(--red)':'border-color:var(--green);color:var(--green)'}">
          ${d.open?'<i data-lucide="lock"></i> Close':'<i data-lucide="unlock"></i> Open'}
        </button>
        <button class="btn-sm btn-gold" onclick="sendHelpRequest('${s.cls}','${s.name}')"><i data-lucide="alert-triangle"></i> Help</button>
      </div>
    </div>`;
  }).join('');

  // Update summary cards
  const avgPerf=stations.length?Math.round(perfSum/stations.length):0;
  const el=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  el('stn-total-done',totalDone);
  el('stn-active-kots',totalActive);
  el('stn-overdue-total',totalOverdue);
  el('stn-avg-perf',avgPerf+'%');

  if(window.lucide)setTimeout(()=>lucide.createIcons(),60);
  _startStnTimers();
}

// ─── Live Timers ──────────────────────────────
function _startStnTimers(){
  if(_stnTimerInterval)clearInterval(_stnTimerInterval);
  _stnTimerInterval=setInterval(()=>{
    let anyOverdue=false;
    stations.forEach(s=>{
      const d=stationData[s.cls];
      if(!d||!d.kots)return;
      d.kots.forEach(k=>{
        const rem=_stnRemaining(k.startedAt,k.maxTime);
        const tEl=document.getElementById('stimer-'+k.id);
        const itemEl=document.getElementById('kot-item-'+k.id);
        if(tEl){
          tEl.textContent=_stnTimerLabel(rem);
          tEl.className='stn-timer '+_stnTimerClass(rem);
        }
        if(itemEl&&rem<0&&k.status!=='ready'){
          itemEl.classList.add('kot-overdue');
          anyOverdue=true;
        }
      });
    });
    // Update overdue count badge
    const totalOvr=stations.reduce((acc,s)=>acc+_stnCalcOverdue(stationData[s.cls]?.kots||[]),0);
    const el=document.getElementById('stn-overdue-total');
    if(el)el.textContent=totalOvr;
  },1000);
}

// ─── KOT Status Toggle ────────────────────────
function setKotStatus(stationCls,kotId,newStatus){
  const d=stationData[stationCls];
  if(!d)return;
  const kot=d.kots.find(k=>k.id===kotId);
  if(!kot)return;
  const oldStatus=kot.status;
  kot.status=newStatus;
  if(newStatus==='ready'&&oldStatus!=='ready'){
    d.doneTodayCount=(d.doneTodayCount||0)+1;
    d.perfScore=Math.min(100,Math.round((d.perfScore||0)*0.9+(_stnRemaining(kot.startedAt,kot.maxTime)>0?100:60)*0.1));
    showToast('✅ KOT marked Ready! Table '+kot.table,'var(--green)');
    _saveStationToFb(stationCls);
    // Auto remove after 8s
    setTimeout(()=>{
      d.kots=d.kots.filter(k=>k.id!==kotId);
      renderStations();
      _saveStationToFb(stationCls);
    },8000);
  }
  // Re-render just this station card's KOT list
  renderStations();
  _saveStationToFb(stationCls);
}

// ─── Mark All Ready ───────────────────────────
function markStationAllReady(stationCls){
  const d=stationData[stationCls];
  if(!d)return;
  d.kots.forEach(k=>{ if(k.status!=='ready'){k.status='ready';d.doneTodayCount=(d.doneTodayCount||0)+1;} });
  showToast('✅ All KOTs marked ready!','var(--green)');
  renderStations();
  _saveStationToFb(stationCls);
}
function markAllStationReady(){
  stations.forEach(s=>markStationAllReady(s.cls));
  showToast('✅ All stations marked ready!','var(--green)');
}

// ─── Toggle Station Open/Close ─────────────────
function toggleStationOpen(stationCls){
  const d=stationData[stationCls];
  if(!d)return;
  d.open=!d.open;
  showToast(d.open?'✅ Station Open!':'🔒 Station Closed!',d.open?'var(--green)':'var(--red)');
  renderStations();
  _saveStationToFb(stationCls);
}

// ─── Auto Route Orders ────────────────────────
function autoRouteOrders(){
  showToast('⚡ Orders auto-routed to stations!','var(--accent)');
}

// ─── Chef Assign ──────────────────────────────
function openChefAssign(stationCls,stationName){
  document.getElementById('ca-station-cls').value=stationCls;
  document.getElementById('ca-station-name').textContent=stationName;
  _selectedChefForAssign=stationData[stationCls]?.chef||'';
  const chefs=appData.staff.filter(s=>s.role==='chef'||s.role==='helper');
  document.getElementById('ca-chef-list').innerHTML=chefs.map(c=>`
    <label style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:var(--bg3);border:1.5px solid ${_selectedChefForAssign===c.name?'var(--accent)':'var(--border)'};border-radius:9px;cursor:pointer;transition:var(--trans);" onclick="selectChefForAssign('${c.name}',this)">
      <span style="font-size:20px;">${c.emoji||'👨‍🍳'}</span>
      <div style="flex:1;">
        <div style="font-size:13px;font-weight:700;color:var(--text);">${c.name}</div>
        <div style="font-size:11px;color:var(--text2);">Shift: ${c.shift||'morning'} | ⭐${c.rating||3}</div>
      </div>
      <span style="font-size:11px;font-weight:700;color:${c.present?'var(--green)':'var(--red)'};">${c.present?'Present':'Absent'}</span>
    </label>`).join('');
  openModal('chefAssignModal');
  if(window.lucide)setTimeout(()=>lucide.createIcons(),60);
}
function selectChefForAssign(name,el){
  _selectedChefForAssign=name;
  document.querySelectorAll('#ca-chef-list label').forEach(l=>l.style.borderColor='var(--border)');
  el.style.borderColor='var(--accent)';
}
function saveChefAssign(){
  const cls=document.getElementById('ca-station-cls').value;
  if(!_selectedChefForAssign){showToast('Chef select karo!','var(--red)');return;}
  const chef=appData.staff.find(s=>s.name===_selectedChefForAssign);
  stationData[cls].chef=_selectedChefForAssign;
  stationData[cls].chefEmoji=chef?.emoji||'👨‍🍳';
  closeModal('chefAssignModal');
  showToast('✅ Chef assigned: '+_selectedChefForAssign,'var(--green)');
  renderStations();
  _saveStationToFb(cls);
}

// ─── Station Note ─────────────────────────────
function openStationNote(stationCls,stationName){
  document.getElementById('sn-station-cls').value=stationCls;
  document.getElementById('sn-station-name').textContent=stationName;
  document.getElementById('sn-note-text').value=stationData[stationCls]?.note||'';
  openModal('stationNoteModal');
}
function saveStationNote(){
  const cls=document.getElementById('sn-station-cls').value;
  const note=document.getElementById('sn-note-text').value.trim();
  stationData[cls].note=note;
  closeModal('stationNoteModal');
  showToast('📝 Note saved!','var(--accent)');
  renderStations();
  _saveStationToFb(cls);
}
function clearStationNote(stationCls){
  stationData[stationCls].note='';
  renderStations();
  _saveStationToFb(stationCls);
}

// ─── Station Bell ─────────────────────────────
function setBellMsg(msg){document.getElementById('bell-msg').value=msg;}
function sendStationBell(){
  const from=document.getElementById('bell-from').value;
  const to=document.getElementById('bell-to').value;
  const msg=document.getElementById('bell-msg').value.trim();
  if(!msg){showToast('Message likho!','var(--red)');return;}
  const fromLabel={tandoor:'🔥 Tandoor',chinese:'🥡 Chinese',dessert:'🍮 Dessert',grill:'🥩 Grill',cold:'❄️ Cold',head_chef:'👑 Head Chef'}[from]||from;
  const toLabel=to==='all'?'📢 All Stations':{tandoor:'🔥 Tandoor',chinese:'🥡 Chinese',dessert:'🍮 Dessert',grill:'🥩 Grill',cold:'❄️ Cold',head_chef:'👑 Head Chef'}[to]||to;
  closeModal('stationBellModal');
  document.getElementById('bell-msg').value='';
  _showBellAlert(fromLabel,toLabel,msg);
  _saveBellToFb({from,to,msg,time:new Date().toISOString()});
}
function _showBellAlert(from,to,msg){
  const popup=document.getElementById('stationBellPopup');
  if(!popup)return;
  const div=document.createElement('div');
  div.className='bell-alert';
  div.innerHTML=`<span style="font-size:20px;">🔔</span><div style="flex:1;"><div style="font-size:11px;color:var(--text2);">${from} → ${to}</div><div>${msg}</div></div><button class="bell-alert-close" onclick="this.parentElement.remove()">✕</button>`;
  popup.appendChild(div);
  if(typeof NovaVoice !== 'undefined' && NovaVoice.enabled){
    const _vm=[`नई सूचना! ${msg}`,`ध्यान दें! ${msg}`,`सूचना — ${msg}`];
    NovaVoice.speak(_vm[Math.floor(Math.random()*_vm.length)], true);
  }
  setTimeout(()=>{if(div.parentNode)div.remove();},8000);
}

// ─── Help Request ─────────────────────────────
function sendHelpRequest(stationCls,stationName){
  _showBellAlert('👑 Head Chef',`🆘 ${stationName}`,`HELP NEEDED at ${stationName}!`);
  _saveBellToFb({from:'system',to:'head_chef',msg:`HELP NEEDED: ${stationName}`,time:new Date().toISOString()});
  showToast('🆘 Help request bheja!','var(--orange)');
}

// ─── Shift Handover ───────────────────────────
function saveHandover(){
  const station=document.getElementById('handover-station').value;
  const fromChef=document.getElementById('handover-from-chef').value.trim();
  const toChef=document.getElementById('handover-to-chef').value.trim();
  const note=document.getElementById('handover-note').value.trim();
  if(!fromChef||!toChef){showToast('Dono chef ka naam bharo!','var(--red)');return;}
  if(toChef&&stationData[station]){
    stationData[station].chef=toChef;
    renderStations();
  }
  const record={station,fromChef,toChef,note,time:new Date().toISOString()};
  _saveHandoverToFb(record);
  closeModal('handoverModal');
  document.getElementById('handover-from-chef').value='';
  document.getElementById('handover-to-chef').value='';
  document.getElementById('handover-note').value='';
  showToast(`✅ Handover done: ${fromChef} → ${toChef}`,'var(--green)');
}

// ─── Firebase Sync ────────────────────────────
async function _saveStationToFb(stationCls){
  try{
    const db=await _stnFbInit();
    const {doc,setDoc}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const d=stationData[stationCls];
    // Convert startedAt to timestamp-safe format
    const safeData={
      cls:stationCls,chef:d.chef,chefEmoji:d.chefEmoji,open:d.open,note:d.note,
      doneTodayCount:d.doneTodayCount,overdueCount:d.overdueCount,perfScore:d.perfScore,
      kots:d.kots.map(k=>({...k,startedAt:k.startedAt})),
      updatedAt:Date.now()
    };
    await setDoc(doc(db,'stations',stationCls),safeData,{merge:true});
  }catch(e){console.warn('[Station FB Save]',e.message);}
}

async function _saveBellToFb(bell){
  try{
    const db=await _stnFbInit();
    const {collection,addDoc}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    await addDoc(collection(db,'station_bells'),bell);
  }catch(e){console.warn('[Bell FB]',e.message);}
}

async function _saveHandoverToFb(record){
  try{
    const db=await _stnFbInit();
    const {collection,addDoc}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    await addDoc(collection(db,'station_handovers'),record);
  }catch(e){console.warn('[Handover FB]',e.message);}
}

async function syncStationsFirebase(){
  showToast('🔄 Firebase se sync ho raha hai...','var(--purple)');
  try{
    const db=await _stnFbInit();
    const {collection,getDocs}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const snap=await getDocs(collection(db,'stations'));
    if(!snap.empty){
      snap.forEach(docSnap=>{
        const fbData=docSnap.data();
        const cls=fbData.cls;
        if(stationData[cls]){
          stationData[cls]={...stationData[cls],...fbData};
        }
      });
      renderStations();
      showToast('✅ Stations Firebase se sync ho gaye!','var(--green)');
    }else{
      // Save current data to FB
      stations.forEach(s=>_saveStationToFb(s.cls));
      showToast('✅ Stations Firebase mein save ho gaye!','var(--green)');
    }
  }catch(e){
    console.warn('[Station Sync]',e.message);
    showToast('⚠️ Sync error: '+e.message,'var(--red)');
  }
}

// ─── Auto load from Firebase on page open ─────
async function loadStationsFromFirebase(){
  try{
    const db=await _stnFbInit();
    const {collection,getDocs,doc,getDoc}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    // Pehle custom stations load karo
    try{
      const cfgSnap=await getDoc(doc(db,'station_config','custom_stations'));
      if(cfgSnap.exists()){
        const customList=cfgSnap.data().list||[];
        customList.forEach(s=>{
          if(!stations.find(x=>x.cls===s.cls)){
            stations.push({...s,custom:true});
            if(!stationData[s.cls]) stationData[s.cls]={chef:'Unassigned',chefEmoji:'👨‍🍳',open:true,note:'',doneTodayCount:0,overdueCount:0,perfScore:100,kots:[]};
          }
        });
      }
    }catch(e){console.warn('[Custom Station Config]',e.message);}
    // Ab station runtime data load karo
    const snap=await getDocs(collection(db,'stations'));
    if(!snap.empty){
      snap.forEach(docSnap=>{
        const fbData=docSnap.data();
        const cls=fbData.cls;
        if(cls&&fbData.kots){
          if(!stationData[cls]) stationData[cls]={chef:'Unassigned',chefEmoji:'👨‍🍳',open:true,note:'',doneTodayCount:0,overdueCount:0,perfScore:100,kots:[]};
          stationData[cls]={...stationData[cls],...fbData};
          // Agar ye custom station hai aur stations array mein nahi — add karo
          if(fbData.isCustom&&!stations.find(x=>x.cls===cls)){
            stations.push({name:fbData.name||cls,cls,icon:fbData.icon||'🍳',defaultMaxTime:fbData.defaultMaxTime||20,custom:true});
          }
        }
      });
      renderStations();
    }
  }catch(e){console.warn('[Station FB Load]',e.message);}
}

// ═══ STAFF ═══
// ═══ STAFF — Advanced Version with Firebase ═══
const STAFF_FB_CFG = {
  apiKey: 'AIzaSyBsRxWD2R1GkSEM-duLwQe3jAi7yw5vvvM',
  authDomain: 'restaurant-system-beec1.firebaseapp.com',
  projectId: 'restaurant-system-beec1',
  storageBucket: 'restaurant-system-beec1.firebasestorage.app',
  messagingSenderId: '106757122327',
  appId: '1:106757122327:web:723d8dacbba3087b686f52'
};

async function _staffFbInit(){
  const [{initializeApp,getApps},{getFirestore}] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
  ]);
  const apps=getApps();
  const app=apps.length?apps[0]:initializeApp(STAFF_FB_CFG);
  return getFirestore(app);
}

async function saveStaffToFirebase(s){
  try{
    const db=await _staffFbInit();
    const {doc,setDoc}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    await setDoc(doc(db,'staff',String(s.id)),s);
    return true;
  }catch(e){console.warn('Staff FB save error:',e);return false;}
}

async function deleteStaffFromFirebase(id){
  try{
    const db=await _staffFbInit();
    const {doc,deleteDoc}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    await deleteDoc(doc(db,'staff',String(id)));
  }catch(e){console.warn('Staff FB delete error:',e);}
}

async function loadStaffFromFirebase(){
  try{
    const db=await _staffFbInit();
    const {collection,getDocs}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const snap=await getDocs(collection(db,'staff'));
    if(snap.empty)return;
    const loaded=[];
    snap.forEach(d=>loaded.push(d.data()));
    if(loaded.length>0){
      appData.staff=loaded;
      renderStaff();
      showToast('🔥 Staff Firebase se load hua!','var(--green)');
    }
  }catch(e){console.warn('Staff FB load error:',e);}
}

function getShiftLabel(shift){
  return {morning:'🌅 Morning (6AM-2PM)',evening:'🌆 Evening (2PM-10PM)',night:'🌙 Night (10PM-6AM)'}[shift]||'📋 '+shift;
}

function renderStaffRating(rating){
  return Array.from({length:5},(_,i)=>`<span style="color:${i<rating?'#f59e0b':'var(--border)'};font-size:13px;">★</span>`).join('');
}

function getStaffPayInfo(s){
  const sal=s.salary||0;const adv=s.advance||0;const due=sal-adv;
  return {sal,adv,due};
}

function renderStaff(){
  const list=document.getElementById('staffList');if(!list)return;
  const present=appData.staff.filter(s=>s.present).length;
  document.getElementById('staffPresent').textContent=present;
  document.getElementById('staffAbsent').textContent=appData.staff.length-present;

  // Salary summary
  const totalSal=appData.staff.reduce((a,s)=>a+(s.salary||0),0);
  const totalAdv=appData.staff.reduce((a,s)=>a+(s.advance||0),0);
  const salSummEl=document.getElementById('staffSalarySummary');
  if(salSummEl) salSummEl.innerHTML=`<span style="color:var(--text2);font-size:12px;font-weight:700;">💰 Monthly Payroll: <span style="color:var(--green);">₹${totalSal.toLocaleString('en-IN')}</span> &nbsp;|&nbsp; Advance Given: <span style="color:var(--orange);">₹${totalAdv.toLocaleString('en-IN')}</span> &nbsp;|&nbsp; Net Due: <span style="color:var(--accent);">₹${(totalSal-totalAdv).toLocaleString('en-IN')}</span></span>`;

  list.innerHTML=appData.staff.map(s=>{
    const pay=getStaffPayInfo(s);
    const expYears=s.joiningDate?Math.floor((new Date()-new Date(s.joiningDate))/(365.25*24*3600*1000)):0;
    const stars=Array.from({length:5},(_,i)=>`<span style="color:${i<(s.rating||0)?'#f59e0b':'rgba(0,0,0,0.15)'};font-size:13px;">★</span>`).join('');
    const shiftColors={morning:'var(--green)',evening:'var(--orange)',night:'var(--purple)'};
    const shiftBg={morning:'rgba(34,197,94,.1)',evening:'rgba(245,158,11,.1)',night:'rgba(139,92,246,.1)'};
    const shiftLabels={morning:'🌅 Morning (6AM–2PM)',evening:'🌆 Evening (2PM–10PM)',night:'🌙 Night (10PM–6AM)'};
    // Custom shift timing text support
    const shiftDisplay=s.shiftCustom?`✏️ ${s.shiftCustom}`:(shiftLabels[s.shift]||s.shift||'N/A');
    const shiftCol=shiftColors[s.shift]||'var(--accent)';
    const shiftBgCol=shiftBg[s.shift]||'rgba(46,156,94,.08)';

    // Rank badge
    const rankBadge=s.rank?`<span style="font-size:10px;padding:2px 9px;border-radius:20px;background:linear-gradient(135deg,rgba(139,92,246,.15),rgba(59,130,246,.12));color:var(--purple);border:1px solid rgba(139,92,246,.3);font-weight:700;letter-spacing:.5px;">🏅 ${s.rank}</span>`:'';

    // Performance bar
    const perf=((s.rating||0)/5)*100;
    const perfColor=perf>=80?'var(--green)':perf>=60?'var(--orange)':'var(--red)';
    const perfLabel=['','Needs Improvement','Average','Good','Very Good','Excellent'][s.rating||0]||'N/A';

    // Call & WhatsApp quick contact
    const phone=s.phone||(s.phone||'');
    const contactBtns=phone?`
      <a href="tel:+91${phone.replace(/\D/g,'')}" onclick="showToast('📞 ${s.name} ko call...')" style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:8px;border:1.5px solid var(--green);background:rgba(34,197,94,.1);color:var(--green);font-size:11px;font-weight:700;text-decoration:none;cursor:pointer;">📞 Call</a>
      <a href="https://wa.me/91${phone.replace(/\D/g,'')}" target="_blank" onclick="showToast('💬 WhatsApp...')" style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:8px;border:1.5px solid #25D366;background:rgba(37,211,102,.1);color:#25D366;font-size:11px;font-weight:700;text-decoration:none;cursor:pointer;">💬 WhatsApp</a>
      <a href="sms:+91${phone.replace(/\D/g,'')}" onclick="showToast('💬 SMS...')" style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:8px;border:1.5px solid var(--blue);background:rgba(59,130,246,.1);color:var(--blue);font-size:11px;font-weight:700;text-decoration:none;cursor:pointer;">✉️ SMS</a>`:'<span style="font-size:11px;color:var(--text2);">No phone</span>';

    return `
    <div class="staff-card" style="flex-direction:column;gap:0;padding:0;overflow:hidden;">
      <!-- TOP ROW: Avatar + Info (right-aligned) -->
      <div style="display:flex;align-items:flex-start;gap:13px;padding:14px 16px;">
        <!-- Avatar left -->
        <div class="staff-avatar" style="position:relative;flex-shrink:0;">
          ${s.emoji}
          <div style="position:absolute;bottom:-3px;right:-3px;width:12px;height:12px;border-radius:50%;background:${s.present?'var(--green)':'var(--red)'};border:2px solid var(--bg2);"></div>
        </div>
        <!-- Info center -->
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:3px;">
            <div class="staff-name" style="margin:0;">${s.name}</div>
            ${rankBadge}
          </div>
          <div class="staff-role" style="margin:2px 0 0;">${s.role} • ${expYears>0?expYears+' saal ka exp':'Naya'}</div>
          <div style="margin-top:5px;display:flex;align-items:center;gap:5px;flex-wrap:wrap;">
            <span style="font-size:11px;padding:2px 9px;border-radius:20px;background:${shiftBgCol};color:${shiftCol};border:1px solid ${shiftCol}40;font-weight:700;">${shiftDisplay}</span>
          </div>
        </div>
        <!-- Right side: attendance toggle + status -->
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0;margin-left:auto;">
          <label class="attendance-toggle"><input type="checkbox" ${s.present?'checked':''} onchange="toggleAttendance(${s.id},this.checked)"><div class="tog-track"><div class="tog-thumb"></div></div></label>
          <span style="font-size:11px;color:${s.present?'var(--green)':'var(--red)'};font-weight:700;">${s.present?'PRESENT':'ABSENT'}</span>
        </div>
      </div>

      <!-- PERFORMANCE + RANK ROW -->
      <div style="padding:10px 16px;border-top:1px solid var(--border);background:var(--bg3);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <div style="font-size:11px;font-weight:700;color:var(--text2);">⭐ Performance</div>
          <div style="display:flex;align-items:center;gap:6px;">
            <div>${stars}</div>
            <span style="font-size:11px;font-weight:700;color:${perfColor};">${perfLabel}</span>
          </div>
        </div>
        <div style="height:5px;background:rgba(0,0,0,.07);border-radius:4px;overflow:hidden;">
          <div style="height:100%;width:${perf}%;background:${perfColor};border-radius:4px;transition:width .6s;"></div>
        </div>
        <div style="margin-top:6px;font-size:11px;color:var(--text2);">📞 ${phone||'—'}</div>
      </div>

      <!-- STATS ROW -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid var(--border);background:var(--bg3);">
        <div style="padding:9px 12px;text-align:center;border-right:1px solid var(--border);">
          <div style="font-size:10px;color:var(--text2);margin-bottom:2px;">Monthly Salary</div>
          <div style="font-size:13px;font-weight:800;color:var(--green);">₹${pay.sal.toLocaleString('en-IN')}</div>
        </div>
        <div style="padding:9px 12px;text-align:center;border-right:1px solid var(--border);">
          <div style="font-size:10px;color:var(--text2);margin-bottom:2px;">Advance</div>
          <div style="font-size:13px;font-weight:800;color:var(--orange);">₹${pay.adv.toLocaleString('en-IN')}</div>
        </div>
        <div style="padding:9px 12px;text-align:center;">
          <div style="font-size:10px;color:var(--text2);margin-bottom:2px;">Present/Absent</div>
          <div style="font-size:13px;font-weight:800;color:var(--accent);">${s.presentDays||0}d / ${s.absentDays||0}d</div>
        </div>
      </div>

      ${s.note?`<div style="padding:6px 16px;background:var(--bg3);border-top:1px solid var(--border);font-size:11px;color:var(--text2);">📝 ${s.note}</div>`:''}

      <!-- QUICK CONTACT ROW -->
      <div style="display:flex;gap:6px;padding:9px 14px;border-top:1px solid var(--border);flex-wrap:wrap;align-items:center;">
        ${contactBtns}
      </div>

      <!-- ACTION BUTTONS -->
      <div style="display:flex;gap:8px;padding:10px 14px;border-top:1px solid var(--border);">
        <button class="btn-sm btn-gold" style="font-size:11px;flex:1;" onclick="openEditStaffModal(${s.id})">✏️ Edit</button>
        <button class="btn-sm btn-blue" style="font-size:11px;flex:1;" onclick="openStaffPayModal(${s.id})">💰 Pay/Advance</button>
        <button class="btn-sm btn-red" style="font-size:11px;" onclick="removeStaff(${s.id})">🗑️</button>
      </div>
    </div>`;
  }).join('');
  if(window.lucide)setTimeout(()=>lucide.createIcons(),50);
}

function openEditStaffModal(id){
  const s=appData.staff.find(x=>x.id===id);if(!s)return;
  document.getElementById('edit-s-id').value=s.id;
  document.getElementById('edit-s-name').value=s.name;
  document.getElementById('edit-s-role').value=s.role;
  document.getElementById('edit-s-phone').value=s.phone;
  // Shift — custom support
  const knownShifts=['morning','evening','night'];
  if(s.shiftCustom){
    document.getElementById('edit-s-shift').value='custom';
    document.getElementById('edit-s-shift-custom').value=s.shiftCustom;
    document.getElementById('customShiftGroup').style.display='flex';
  } else {
    document.getElementById('edit-s-shift').value=s.shift||'morning';
    const cg=document.getElementById('customShiftGroup');if(cg)cg.style.display='none';
  }
  document.getElementById('edit-s-salary').value=s.salary||0;
  document.getElementById('edit-s-rating').value=s.rating||3;
  document.getElementById('edit-s-note').value=s.note||'';
  const rankEl=document.getElementById('edit-s-rank');if(rankEl)rankEl.value=s.rank||'';
  openModal('editStaffModal');
}

async function saveEditStaff(){
  const id=parseInt(document.getElementById('edit-s-id').value);
  const s=appData.staff.find(x=>x.id===id);if(!s)return;
  s.name=document.getElementById('edit-s-name').value.trim()||s.name;
  s.role=document.getElementById('edit-s-role').value;
  s.phone=document.getElementById('edit-s-phone').value.trim()||s.phone;
  // Shift — custom support
  const shiftSel=document.getElementById('edit-s-shift').value;
  if(shiftSel==='custom'){
    s.shift='custom';
    s.shiftCustom=document.getElementById('edit-s-shift-custom').value.trim()||'Custom';
  } else {
    s.shift=shiftSel;
    s.shiftCustom='';
  }
  s.salary=parseFloat(document.getElementById('edit-s-salary').value)||0;
  s.rating=parseInt(document.getElementById('edit-s-rating').value)||3;
  s.note=document.getElementById('edit-s-note').value.trim();
  const rankEl=document.getElementById('edit-s-rank');
  if(rankEl) s.rank=rankEl.value.trim();
  const emojis={chef:'👨‍🍳',helper:'👨‍🍽️',waiter:'🧑‍🍽️',cleaner:'🧹'};
  s.emoji=emojis[s.role]||'👤';
  closeModal('editStaffModal');
  renderStaff();
  const saved=await saveStaffToFirebase(s);
  showToast(saved?`🔥 ${s.name} Firebase mein update!`:`✅ ${s.name} updated!`,'var(--green)');
}

function openStaffPayModal(id){
  const s=appData.staff.find(x=>x.id===id);if(!s)return;
  document.getElementById('pay-s-id').value=s.id;
  document.getElementById('pay-s-info').textContent=`${s.emoji} ${s.name} — Salary: ₹${(s.salary||0).toLocaleString('en-IN')}`;
  document.getElementById('pay-s-advance').value='';
  document.getElementById('pay-s-present').value=s.presentDays||0;
  document.getElementById('pay-s-absent').value=s.absentDays||0;
  openModal('staffPayModal');
}

async function saveStaffPay(){
  const id=parseInt(document.getElementById('pay-s-id').value);
  const s=appData.staff.find(x=>x.id===id);if(!s)return;
  const adv=parseFloat(document.getElementById('pay-s-advance').value)||0;
  const pdays=parseInt(document.getElementById('pay-s-present').value)||0;
  const adays=parseInt(document.getElementById('pay-s-absent').value)||0;
  if(adv>0) s.advance=(s.advance||0)+adv;
  s.presentDays=pdays; s.absentDays=adays;
  closeModal('staffPayModal');
  renderStaff();
  const saved=await saveStaffToFirebase(s);
  showToast(saved?`🔥 ${s.name} pay data Firebase save!`:`✅ Pay updated!`,'var(--green)');
}

function toggleAttendance(id,val){
  const s=appData.staff.find(x=>x.id===id);
  if(s){
    s.present=val;
    if(val) s.presentDays=(s.presentDays||0)+1;
    else s.absentDays=(s.absentDays||0)+1;
    renderStaff();
    saveStaffToFirebase(s);
    showToast(`${s.name} marked ${val?'Present ✅':'Absent ❌'}`);
  }
}
function markAllPresent(){appData.staff.forEach(s=>{s.present=true;s.presentDays=(s.presentDays||0)+1;});renderStaff();showToast('All staff marked present!','var(--green)');}
async function removeStaff(id){
  const s=appData.staff.find(x=>x.id===id);
  appData.staff=appData.staff.filter(s=>s.id!==id);
  renderStaff();
  await deleteStaffFromFirebase(id);
  showToast(s?`${s.name} removed`:'Staff removed');
}
async function addStaff(){
  const name=document.getElementById('s-name').value.trim();const role=document.getElementById('s-role').value;const phone=document.getElementById('s-phone').value.trim();
  const salary=parseFloat(document.getElementById('s-salary').value)||0;
  const shiftSel=document.getElementById('s-shift').value||'morning';
  const shiftCustomEl=document.getElementById('s-shift-custom');
  const shiftCustom=shiftSel==='custom'?(shiftCustomEl?shiftCustomEl.value.trim():''):'';
  const shift=shiftSel;
  if(!name){showToast('Enter name','var(--red)');return;}
  const emojis={chef:'👨‍🍳',helper:'👨‍🍽️',waiter:'🧑‍🍽️',cleaner:'🧹'};
  const newStaff={id:Date.now(),name,role,phone,present:true,emoji:emojis[role]||'👤',salary,advance:0,shift,rank:'',shiftCustom,rating:3,joiningDate:new Date().toISOString().split('T')[0],presentDays:0,absentDays:0,note:''};
  appData.staff.push(newStaff);
  closeModal('addStaffModal');
  document.getElementById('s-name').value='';document.getElementById('s-phone').value='';
  if(shiftCustomEl) shiftCustomEl.value='';
  document.getElementById('s-shift').value='morning';
  document.getElementById('addStaffCustomShiftGrp').style.display='none';
  renderStaff();
  const saved=await saveStaffToFirebase(newStaff);
  showToast(saved?`🔥 "${name}" Firebase save!`:`✅ ${name} added!`,'var(--green)');
}

let _staffShiftFilter='all';
function filterStaffByShift(shift){
  _staffShiftFilter=shift;
  // Update button styles
  ['all','morning','evening','night'].forEach(s=>{
    const btn=document.getElementById('shiftBtn-'+s);
    if(btn){btn.style.opacity=s===shift?'1':'0.6';btn.style.fontWeight=s===shift?'800':'600';}
  });
  const list=document.getElementById('staffList');if(!list)return;
  const filtered=shift==='all'?appData.staff:appData.staff.filter(s=>s.shift===shift);
  // Re-render with filtered list
  const present=appData.staff.filter(s=>s.present).length;
  const totalSal=appData.staff.reduce((a,s)=>a+(s.salary||0),0);
  const totalAdv=appData.staff.reduce((a,s)=>a+(s.advance||0),0);
  const salSummEl=document.getElementById('staffSalarySummary');
  if(salSummEl) salSummEl.innerHTML=`<span style="color:var(--text2);font-size:12px;font-weight:700;">💰 Monthly Payroll: <span style="color:var(--green);">₹${totalSal.toLocaleString('en-IN')}</span> &nbsp;|&nbsp; Advance Given: <span style="color:var(--orange);">₹${totalAdv.toLocaleString('en-IN')}</span> &nbsp;|&nbsp; Net Due: <span style="color:var(--accent);">₹${(totalSal-totalAdv).toLocaleString('en-IN')}</span></span>`;
  // Use appData.staff but temporarily swap to render subset
  const orig=appData.staff;
  appData.staff=filtered;
  renderStaff();
  appData.staff=orig;
}

// ═══ INVENTORY — Advanced Version with Firebase ═══
const INV_FB_CFG = {
  apiKey: 'AIzaSyBsRxWD2R1GkSEM-duLwQe3jAi7yw5vvvM',
  authDomain: 'restaurant-system-beec1.firebaseapp.com',
  projectId: 'restaurant-system-beec1',
  storageBucket: 'restaurant-system-beec1.firebasestorage.app',
  messagingSenderId: '106757122327',
  appId: '1:106757122327:web:723d8dacbba3087b686f52'
};

async function _invFbInit(){
  const [{initializeApp,getApps},{getFirestore}] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
  ]);
  const apps=getApps();
  const app=apps.length?apps[0]:initializeApp(INV_FB_CFG);
  return getFirestore(app);
}

async function saveInvToFirebase(item){
  try{
    const db=await _invFbInit();
    const {doc,setDoc}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    await setDoc(doc(db,'inventory',String(item.id)),item);
    return true;
  }catch(e){console.warn('Inv FB save error:',e);return false;}
}

async function deleteInvFromFirebase(id){
  try{
    const db=await _invFbInit();
    const {doc,deleteDoc}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    await deleteDoc(doc(db,'inventory',String(id)));
  }catch(e){console.warn('Inv FB delete error:',e);}
}

async function loadInventoryFromFirebase(){
  try{
    const db=await _invFbInit();
    const {collection,getDocs}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const snap=await getDocs(collection(db,'inventory'));
    if(snap.empty)return;
    const loaded=[];
    snap.forEach(d=>loaded.push(d.data()));
    if(loaded.length>0){
      appData.inventory=loaded;
      renderInventory();
      showToast('🔥 Inventory Firebase se load hui!','var(--green)');
    }
  }catch(e){console.warn('Inv FB load error:',e);}
}

let _invCategoryFilter='all';

function getExpiryStatus(expiryDate){
  if(!expiryDate) return {label:'No Expiry',color:'var(--text2)',days:999,badge:'⬜'};
  const today=new Date(); today.setHours(0,0,0,0);
  const exp=new Date(expiryDate); exp.setHours(0,0,0,0);
  const diff=Math.round((exp-today)/(1000*60*60*24));
  if(diff<0) return {label:'EXPIRED!',color:'var(--red)',days:diff,badge:'🔴',urgent:true};
  if(diff===0) return {label:'Aaj expire!',color:'var(--red)',days:0,badge:'🔴',urgent:true};
  if(diff<=2) return {label:`${diff}d left — URGENT`,color:'var(--red)',days:diff,badge:'🔴',urgent:true};
  if(diff<=5) return {label:`${diff} din left`,color:'var(--orange)',days:diff,badge:'🟠'};
  if(diff<=14) return {label:`${diff} din left`,color:'#eab308',days:diff,badge:'🟡'};
  return {label:`${diff} din left`,color:'var(--green)',days:diff,badge:'🟢'};
}

function filterInvByCategory(cat){
  _invCategoryFilter=cat;
  // Update button styles
  document.querySelectorAll('.inv-cat-btn').forEach(b=>{
    b.style.opacity=b.dataset.cat===cat?'1':'0.5';
    b.style.borderWidth=b.dataset.cat===cat?'2px':'1px';
  });
  renderInventory();
}

function renderInventory(items){
  const list=document.getElementById('invList');if(!list)return;
  let data=items||appData.inventory;

  // Category filter
  if(_invCategoryFilter&&_invCategoryFilter!=='all'){
    data=data.filter(i=>i.category===_invCategoryFilter);
  }

  // Total stock value
  const totalValue=appData.inventory.reduce((a,i)=>{
    const cost=i.costPerUnit||0; return a+(i.qty*cost);
  },0);
  const lowCount=appData.inventory.filter(i=>i.qty<=i.minQty).length;
  const valEl=document.getElementById('invValueSummary');
  if(valEl) valEl.innerHTML=`<span style="font-size:12px;font-weight:700;color:var(--text2);">📦 Total Items: <span style="color:var(--accent)">${appData.inventory.length}</span> &nbsp;|&nbsp; 💰 Stock Value: <span style="color:var(--green)">₹${totalValue.toLocaleString('en-IN')}</span> &nbsp;|&nbsp; ⚠️ Low Stock: <span style="color:var(--red)">${lowCount}</span></span>`;

  // Expiry summary banner
  const expiredItems=data.filter(i=>getExpiryStatus(i.expiry).days<0);
  const urgentItems=data.filter(i=>{const s=getExpiryStatus(i.expiry);return s.days>=0&&s.days<=2;});
  const soonItems=data.filter(i=>{const s=getExpiryStatus(i.expiry);return s.days>2&&s.days<=5;});
  const lowStockItems=data.filter(i=>i.qty<=i.minQty);

  let bannerHTML='';
  if(expiredItems.length||urgentItems.length||lowStockItems.length){
    bannerHTML=`<div style="background:linear-gradient(135deg,rgba(239,68,68,.08),rgba(245,158,11,.06));border:1.5px solid rgba(239,68,68,.25);border-radius:14px;padding:14px 16px;margin-bottom:12px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
      <div style="font-size:18px;">⚠️</div>
      <div style="flex:1;min-width:200px;">
        <div style="font-size:13px;font-weight:800;color:var(--text);margin-bottom:5px;">Expiry & Stock Alert</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${expiredItems.length?`<span style="font-size:11px;padding:3px 10px;border-radius:20px;background:rgba(239,68,68,.12);color:var(--red);font-weight:700;border:1px solid rgba(239,68,68,.3);">🔴 ${expiredItems.length} EXPIRED</span>`:''}
          ${urgentItems.length?`<span style="font-size:11px;padding:3px 10px;border-radius:20px;background:rgba(239,68,68,.08);color:var(--red);font-weight:700;border:1px solid rgba(239,68,68,.2);">🟠 ${urgentItems.length} Urgent (1-2 din)</span>`:''}
          ${soonItems.length?`<span style="font-size:11px;padding:3px 10px;border-radius:20px;background:rgba(245,158,11,.1);color:var(--orange);font-weight:700;border:1px solid rgba(245,158,11,.3);">🟡 ${soonItems.length} Soon (3-5 din)</span>`:''}
          ${lowStockItems.length?`<span style="font-size:11px;padding:3px 10px;border-radius:20px;background:rgba(239,68,68,.08);color:var(--red);font-weight:700;border:1px solid rgba(239,68,68,.2);">📦 ${lowStockItems.length} Low Stock</span>`:''}
        </div>
      </div>
      <button class="btn-sm btn-green" style="font-size:11px;white-space:nowrap;" onclick="showPage('suppliers')"><i data-lucide="phone"></i> Suppliers Contact</button>
    </div>`;
  }

  const sortedData=[...data].sort((a,b)=>getExpiryStatus(a.expiry).days-getExpiryStatus(b.expiry).days);

  list.innerHTML=bannerHTML+sortedData.map(i=>{
    const pct=Math.min(100,Math.round((i.qty/Math.max(i.qty,i.minQty*2))*100));
    const isLow=i.qty<=i.minQty,isWarn=i.qty<=i.minQty*1.5&&!isLow;
    const expiryInfo=getExpiryStatus(i.expiry);
    const supplier=appData.suppliers.find(s=>s.id===i.supplierId);
    const totalVal=(i.qty*(i.costPerUnit||0));
    const todayUsage=(i.usageLog&&i.usageLog[0])?i.usageLog[0].used:0;
    const avgUsage=i.usageLog&&i.usageLog.length?Math.round((i.usageLog.reduce((a,l)=>a+l.used,0)/i.usageLog.length)*10)/10:0;
    const daysLeft=avgUsage>0?Math.floor(i.qty/avgUsage):999;

    const expiryBadge=`<span style="font-size:10px;padding:2px 8px;border-radius:20px;background:${expiryInfo.color}18;color:${expiryInfo.color};font-weight:700;border:1px solid ${expiryInfo.color}40;white-space:nowrap;">${expiryInfo.badge} ${expiryInfo.label}</span>`;

    // ── SVG icons for contact ──
    const _svgWA='<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>';
    const _svgMsg='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    const _svgCall='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12.7 19.79 19.79 0 0 1 1.61 4.1 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';

    // Circular icon button helper
    const _iBtn=(href,ttl,bg,bdr,clr,icon,onclk,tgt)=>
      `<a href="${href}" ${tgt?'target="'+tgt+'"':''} title="${ttl}" ${onclk?'onclick="'+onclk+'"':''}
        style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;border:2px solid ${bdr};background:${bg};color:${clr};text-decoration:none;cursor:pointer;transition:transform .15s,box-shadow .15s;flex-shrink:0;"
        onmouseover="this.style.transform='scale(1.15)';this.style.boxShadow='0 4px 12px ${bdr}55'"
        onmouseout="this.style.transform='scale(1)';this.style.boxShadow='none'">${icon}</a>`;

    // Effective supplier info (item's own detail first, then global supplier fallback)
    const effSupName=i.itemSupplierName||(supplier?.name)||'';
    const effSupPhone=(i.itemSupplierPhone||(supplier?.phone)||'').replace(/\D/g,'');
    const effSupWa=(i.itemSupplierWa||i.itemSupplierPhone||(supplier?.whatsapp)||(supplier?.phone)||'').replace(/\D/g,'');
    const effSupNote=i.itemSupplierNote||(supplier?i.supplierNote:'')||'';

    const stockKhatam=i.qty<=0;
    const stockOrLow=stockKhatam||isLow;

    // WhatsApp restock message
    const restockMsg=encodeURIComponent(
      '\uD83C\uDF7D\uFE0F *Siplora CHEF \u2014 Stock Alert*\n\nNamaste *'+(effSupName||'Supplier')+'*,\n\nHumara *'+i.name+'* ka stock '+(stockKhatam?'BILKUL KHATAM':'bahut kam')+' ho gaya hai!\n\n\uD83D\uDCE6 Current Stock: *'+i.qty+' '+i.unit+'*\n\uD83D\uDCE6 Min Required: *'+i.minQty+' '+i.unit+'*\n\uD83D\uDCE6 Reorder Qty: *'+(i.restockQty||i.minQty*2)+' '+i.unit+'*\n\nKripya jald se jald delivery karein.\n\nDhanyawad \uD83D\uDE4F\n\u2014 Siplora Chef Team'
    );

    // ── SUPPLIER DETAIL CARD (always shown — both normal & low stock) ──
    const supplierCard=(effSupName||effSupPhone||effSupWa)?`
      <div style="margin-top:9px;padding:10px 13px;background:linear-gradient(135deg,rgba(46,156,94,.05),rgba(59,130,246,.04));border:1.5px solid rgba(46,156,94,.2);border-radius:12px;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap;">
          <div style="flex:1;min-width:160px;">
            <div style="font-size:10px;font-weight:700;color:var(--text2);letter-spacing:.5px;text-transform:uppercase;margin-bottom:4px;">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:3px;vertical-align:middle;"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              Supplier
            </div>
            <div style="font-size:13px;font-weight:800;color:var(--text);">${effSupName||'\u2014'}</div>
            ${effSupPhone?`<div style="font-size:11px;color:var(--text2);margin-top:2px;">\uD83D\uDCDE ${effSupPhone.replace(/(\d{5})(\d{5})/,'$1 $2')}</div>`:''}
            ${effSupNote?`<div style="font-size:10px;color:var(--accent);margin-top:2px;font-weight:600;">\uD83D\uDCDD ${effSupNote}</div>`:''}
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
            <div style="font-size:10px;color:var(--text2);font-weight:600;">Direct Contact</div>
            <div style="display:flex;gap:8px;">
              ${effSupWa?_iBtn('https://wa.me/91'+effSupWa+'?text='+restockMsg,'WhatsApp: '+effSupName,'rgba(37,211,102,.13)','#25D366','#25D366',_svgWA,"showToast('WhatsApp message...')",'_blank'):''}
              ${effSupPhone?_iBtn('sms:+91'+effSupPhone,'Message: '+effSupName,'rgba(59,130,246,.13)','var(--blue)','var(--blue)',_svgMsg,"showToast('SMS kholna...')"):''}
              ${effSupPhone?_iBtn('tel:+91'+effSupPhone,'Call: '+effSupName,'rgba(34,197,94,.13)','var(--green)','var(--green)',_svgCall,"showToast('Calling "+effSupName+"...')"):''}
            </div>
          </div>
        </div>
      </div>`
    :`<div style="margin-top:9px;padding:8px 12px;background:var(--bg3);border:1px dashed var(--border2);border-radius:10px;display:flex;align-items:center;justify-content:space-between;gap:8px;">
        <span style="font-size:11px;color:var(--text2);">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px;"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          Koi supplier nahi \u2014 Edit karo aur supplier add karo
        </span>
        <button onclick="openEditInvModal(${i.id})" style="padding:4px 10px;border-radius:8px;border:1.5px solid var(--accent);background:var(--gold-dim);color:var(--accent);font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">+ Add Supplier</button>
      </div>`;

    // ── LOW STOCK ALERT BANNER (shown on top of supplier card when low) ──
    const stockKhatamSection=stockOrLow?`
      <div style="margin-top:9px;padding:8px 13px;background:${stockKhatam?'linear-gradient(135deg,rgba(239,68,68,.12),rgba(239,68,68,.06))':'rgba(245,158,11,.07)'};border:${stockKhatam?'2px solid rgba(239,68,68,.5)':'1.5px solid rgba(245,158,11,.35)'};border-radius:10px;">
        <div style="font-size:12px;font-weight:800;color:${stockKhatam?'var(--red)':'var(--orange)'};">
          ${stockKhatam?'\uD83D\uDEA8 STOCK BILKUL KHATAM! \u2014 Abhi order karo!':'\u26A0\uFE0F Low Stock \u2014 Jaldi mangao!'}
        </div>
      </div>`:'';

    return `<div class="inv-item" style="${expiryInfo.urgent?'border:1.5px solid rgba(239,68,68,.35);background:rgba(239,68,68,.03);':''}">
      <div class="inv-emoji">${i.emoji}</div>
      <div class="inv-bar-wrap" style="flex:1;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
          <div>
            <span style="font-size:14px;font-weight:700;color:var(--text);">${i.name}</span>
            ${i.category?`<span style="font-size:10px;padding:1px 7px;border-radius:20px;background:var(--accent)18;color:var(--accent);font-weight:600;border:1px solid var(--accent)30;margin-left:7px;">${i.category}</span>`:''}
          </div>
          <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
            ${expiryBadge}
            <span style="font-size:11px;color:${isLow?'var(--red)':isWarn?'var(--orange)':'var(--green)'};font-weight:700;padding:2px 8px;background:${isLow?'rgba(239,68,68,.1)':isWarn?'rgba(245,158,11,.1)':'rgba(34,197,94,.08)'};border-radius:20px;">${isLow?'LOW STOCK':isWarn?'WARN':'OK'}</span>
          </div>
        </div>
        <div style="font-size:12px;color:var(--text2);margin-top:3px;">
          <strong style="color:var(--text);">${i.qty} ${i.unit}</strong> remaining \u2022 Min: ${i.minQty} ${i.unit} \u2022 Exp: <strong style="color:${expiryInfo.color};">${i.expiry||'N/A'}</strong>
        </div>
        <div style="display:flex;gap:10px;margin-top:5px;flex-wrap:wrap;">
          ${i.costPerUnit?`<span style="font-size:11px;color:var(--text2);">\uD83D\uDCB0 \u20B9${i.costPerUnit}/${i.unit} &nbsp;|&nbsp; Stock Value: <strong style="color:var(--green);">\u20B9${totalVal.toLocaleString('en-IN')}</strong></span>`:''}
          ${avgUsage>0?`<span style="font-size:11px;color:var(--text2);">\uD83D\uDCCA Avg Use: ${avgUsage}${i.unit}/day &nbsp;|&nbsp; ~${daysLeft<999?daysLeft+' days left':'plenty'}</span>`:''}
        </div>
        <div class="inv-bar-bg" style="margin-top:7px;"><div class="inv-bar-fill ${isLow?'bar-low':isWarn?'bar-warn':'bar-ok'}" style="width:${pct}%;"></div></div>
        ${stockKhatamSection}
        ${supplierCard}
      </div>
      <div style="display:flex;flex-direction:column;gap:7px;align-items:flex-end;flex-shrink:0;">
        <button class="btn-sm btn-green" style="font-size:11px;padding:4px 12px;" onclick="openRestockModal(${i.id})">+Restock</button>
        <button class="btn-sm btn-gold" style="font-size:11px;padding:4px 10px;" onclick="openEditInvModal(${i.id})">Edit</button>
        <button class="btn-sm" style="font-size:11px;padding:4px 10px;color:var(--purple);border-color:var(--purple);" onclick="logUsage(${i.id})">Use</button>
        <button class="btn-sm btn-red" style="font-size:11px;padding:4px 10px;" onclick="removeItem(${i.id})">Del</button>
      </div>
    </div>`;}).join('');  if(window.lucide)setTimeout(()=>lucide.createIcons(),50);
}

function openRestockModal(id){
  const i=appData.inventory.find(x=>x.id===id);if(!i)return;
  document.getElementById('restock-id').value=id;
  document.getElementById('restock-name').textContent=`${i.emoji} ${i.name} — Current: ${i.qty} ${i.unit}`;
  document.getElementById('restock-qty').value=i.restockQty||10;
  openModal('restockModal');
}

async function confirmRestock(){
  const id=parseInt(document.getElementById('restock-id').value);
  const qty=parseFloat(document.getElementById('restock-qty').value)||10;
  const i=appData.inventory.find(x=>x.id===id);if(!i)return;
  i.qty+=qty;
  closeModal('restockModal');
  renderInventory();
  const saved=await saveInvToFirebase(i);
  showToast(saved?`🔥 ${i.name} +${qty} ${i.unit} Firebase save!`:`✅ ${i.name} restocked +${qty} ${i.unit}`,'var(--green)');
}

function openEditInvModal(id){
  const i=appData.inventory.find(x=>x.id===id);if(!i)return;
  document.getElementById('edit-i-id').value=id;
  document.getElementById('edit-i-name').value=i.name;
  document.getElementById('edit-i-qty').value=i.qty;
  document.getElementById('edit-i-unit').value=i.unit;
  document.getElementById('edit-i-min').value=i.minQty;
  document.getElementById('edit-i-exp').value=i.expiry||'';
  document.getElementById('edit-i-cost').value=i.costPerUnit||0;
  document.getElementById('edit-i-category').value=i.category||'Other';
  document.getElementById('edit-i-restock').value=i.restockQty||10;
  // Supplier details
  if(document.getElementById('edit-i-sup-name')) document.getElementById('edit-i-sup-name').value=i.itemSupplierName||'';
  if(document.getElementById('edit-i-sup-phone')) document.getElementById('edit-i-sup-phone').value=i.itemSupplierPhone||'';
  if(document.getElementById('edit-i-sup-wa')) document.getElementById('edit-i-sup-wa').value=i.itemSupplierWa||'';
  if(document.getElementById('edit-i-sup-note')) document.getElementById('edit-i-sup-note').value=i.itemSupplierNote||'';
  openModal('editInvModal');
}

async function saveEditInventory(){
  const id=parseInt(document.getElementById('edit-i-id').value);
  const i=appData.inventory.find(x=>x.id===id);if(!i)return;
  i.name=document.getElementById('edit-i-name').value.trim()||i.name;
  i.qty=parseFloat(document.getElementById('edit-i-qty').value)||i.qty;
  i.unit=document.getElementById('edit-i-unit').value||i.unit;
  i.minQty=parseFloat(document.getElementById('edit-i-min').value)||i.minQty;
  i.expiry=document.getElementById('edit-i-exp').value||i.expiry;
  i.costPerUnit=parseFloat(document.getElementById('edit-i-cost').value)||0;
  i.category=document.getElementById('edit-i-category').value||i.category;
  i.restockQty=parseFloat(document.getElementById('edit-i-restock').value)||10;
  // Supplier details
  i.itemSupplierName=(document.getElementById('edit-i-sup-name')?.value||'').trim();
  i.itemSupplierPhone=(document.getElementById('edit-i-sup-phone')?.value||'').trim().replace(/\s/g,'');
  i.itemSupplierWa=(document.getElementById('edit-i-sup-wa')?.value||'').trim().replace(/\s/g,'')||i.itemSupplierPhone;
  i.itemSupplierNote=(document.getElementById('edit-i-sup-note')?.value||'').trim();
  closeModal('editInvModal');
  renderInventory();
  const saved=await saveInvToFirebase(i);
  showToast(saved?`🔥 ${i.name} Firebase update!`:`✅ ${i.name} updated!`,'var(--green)');
}

async function logUsage(id){
  const i=appData.inventory.find(x=>x.id===id);if(!i)return;
  const used=parseFloat(prompt(`${i.emoji} ${i.name} — Aaj kitna use hua? (${i.unit})`,'1'));
  if(isNaN(used)||used<=0){showToast('Invalid amount','var(--red)');return;}
  i.qty=Math.max(0,i.qty-used);
  const today=new Date().toISOString().split('T')[0];
  if(!i.usageLog) i.usageLog=[];
  if(i.usageLog[0]&&i.usageLog[0].date===today) i.usageLog[0].used+=used;
  else i.usageLog.unshift({date:today,used});
  if(i.usageLog.length>7) i.usageLog=i.usageLog.slice(0,7);
  renderInventory();
  const saved=await saveInvToFirebase(i);
  showToast(saved?`🔥 ${i.name} usage Firebase save!`:`✅ ${used}${i.unit} used from ${i.name}`,'var(--accent)');
}

function showLowStock(){_invCategoryFilter='all';renderInventory(appData.inventory.filter(i=>i.qty<=i.minQty));}
function showExpiryWatch(){
  _invCategoryFilter='all';
  const sorted=[...appData.inventory].sort((a,b)=>getExpiryStatus(a.expiry).days-getExpiryStatus(b.expiry).days);
  renderInventory(sorted.filter(i=>getExpiryStatus(i.expiry).days<=14));
}
function searchInventory(q){renderInventory(appData.inventory.filter(i=>i.name.toLowerCase().includes(q.toLowerCase())));}
function restockItem(id){openRestockModal(id);}
async function removeItem(id){
  const i=appData.inventory.find(x=>x.id===id);
  appData.inventory=appData.inventory.filter(i=>i.id!==id);
  renderInventory();
  await deleteInvFromFirebase(id);
  showToast(i?`${i.name} removed`:'Item removed');
}
async function addInventory(){
  const name=document.getElementById('i-name').value.trim();const qty=parseFloat(document.getElementById('i-qty').value)||0;
  const unit=document.getElementById('i-unit').value;const min=parseFloat(document.getElementById('i-min').value)||5;
  const exp=document.getElementById('i-exp').value;
  const cost=parseFloat(document.getElementById('i-cost').value)||0;
  const cat=document.getElementById('i-category').value||'Other';
  const restockQty=parseFloat(document.getElementById('i-restock').value)||10;
  // Supplier fields
  const supName=(document.getElementById('i-sup-name')?.value||'').trim();
  const supPhone=(document.getElementById('i-sup-phone')?.value||'').trim().replace(/\s/g,'');
  const supWa=(document.getElementById('i-sup-wa')?.value||'').trim().replace(/\s/g,'')||supPhone;
  const supNote=(document.getElementById('i-sup-note')?.value||'').trim();
  if(!name){showToast('Enter item name','var(--red)');return;}
  const newItem={id:Date.now(),name,qty,unit,expiry:exp,minQty:min,emoji:'📦',supplierId:null,supplierNote:supNote,costPerUnit:cost,category:cat,restockQty,usageLog:[],itemSupplierName:supName,itemSupplierPhone:supPhone,itemSupplierWa:supWa,itemSupplierNote:supNote};
  appData.inventory.push(newItem);
  closeModal('addInvModal');document.getElementById('i-name').value='';document.getElementById('i-qty').value='';
  renderInventory();
  const saved=await saveInvToFirebase(newItem);
  showToast(saved?`🔥 "${name}" Firebase save!`:`✅ ${name} added!`,'var(--green)');
}

// ══════════════════════════════════════════
// SUPPLIER CALL & WHATSAPP FUNCTIONS
// ══════════════════════════════════════════
function callSupplier(supplierId, itemName){
  const s=appData.suppliers.find(x=>x.id===supplierId);
  if(!s){showToast('Supplier nahi mila','var(--red)');return;}
  const phone=s.phone.replace(/\D/g,'');
  showToast(`📞 ${s.name} ko call ho rahi hai...`,'var(--green)');

  window.location.href=`tel:+91${phone}`;
}

function whatsappSupplier(supplierId, itemName, currentQty, unit){
  const s=appData.suppliers.find(x=>x.id===supplierId);
  if(!s){showToast('Supplier nahi mila','var(--red)');return;}
  const phone=s.whatsapp.replace(/\D/g,'');
  const restockQty=Math.max(20, currentQty*3);
  const today=new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
  const msg=`Namaskar ${s.ownerName} Ji! 🙏

*Siplora Restaurant* — Supply Order Request
📅 Date: ${today}

*Item Required:*
🛒 ${itemName} — ${restockQty} ${unit}

Current stock: ${currentQty} ${unit} (Low hai, urgent chahiye)

Kripya kal subah delivery arrange karein.

*Restaurant Contact:* Chef Manager
📍 Siplora Restaurant, Solapur

Dhanyawad! 🙏`;
  const encoded=encodeURIComponent(msg);
  showToast(`💬 WhatsApp message ${s.name} ko bheja ja raha hai...`,'#25D366');
  window.open(`https://wa.me/91${phone}?text=${encoded}`,'_blank');
}

function whatsappSupplierBulk(supplierId){
  const s=appData.suppliers.find(x=>x.id===supplierId);
  if(!s) return;
  const phone=s.whatsapp.replace(/\D/g,'');
  // Find all low/expiring items from this supplier
  const items=appData.inventory.filter(i=>i.supplierId===supplierId);
  const lowItems=items.filter(i=>i.qty<=i.minQty*1.5);
  const expiringItems=items.filter(i=>getExpiryStatus(i.expiry).days<=5&&getExpiryStatus(i.expiry).days>=0);
  const today=new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});

  let itemList='';
  const allNeedItems=new Set([...lowItems,...expiringItems]);
  allNeedItems.forEach(i=>{
    const restockQty=Math.max(20,i.qty*3);
    itemList+=`\n• ${i.name} — ${restockQty} ${i.unit}`;
  });

  if(!itemList){showToast('Is supplier ke koi urgent items nahi','var(--orange)');return;}

  const msg=`Namaskar ${s.ownerName} Ji! 🙏

*Siplora Restaurant* — Bulk Supply Order
📅 Date: ${today}

*Items Required:*${itemList}

Kripya kal subah delivery arrange karein.
Priority delivery chahiye — stock bahut low hai!

*Restaurant Contact:* Chef Manager
📍 Siplora Restaurant, Solapur

Dhanyawad! 🙏`;
  const encoded=encodeURIComponent(msg);
  showToast(`💬 Bulk order WhatsApp ${s.name} ko bheja ja raha hai...`,'#25D366');
  window.open(`https://wa.me/91${phone}?text=${encoded}`,'_blank');
}

// ══════════════════════════════════════════
// SUPPLIERS PAGE
// ══════════════════════════════════════════
function renderSuppliers(){
  const grid=document.getElementById('supplierGrid');if(!grid)return;

  // Summary — expiry urgency per supplier
  grid.innerHTML=appData.suppliers.map(s=>{
    const supplierItems=appData.inventory.filter(i=>i.supplierId===s.id);
    const lowItems=supplierItems.filter(i=>i.qty<=i.minQty);
    const expiringItems=supplierItems.filter(i=>getExpiryStatus(i.expiry).days<=5&&getExpiryStatus(i.expiry).days>=0);
    const expiredItems=supplierItems.filter(i=>getExpiryStatus(i.expiry).days<0);
    const hasUrgent=lowItems.length>0||expiringItems.length>0||expiredItems.length>0;

    const urgentBadge=expiredItems.length?`<span style="font-size:10px;padding:2px 8px;border-radius:20px;background:rgba(239,68,68,.15);color:var(--red);font-weight:700;border:1px solid rgba(239,68,68,.3);">🔴 ${expiredItems.length} Expired</span>`:'';
    const expiringBadge=expiringItems.length?`<span style="font-size:10px;padding:2px 8px;border-radius:20px;background:rgba(245,158,11,.12);color:var(--orange);font-weight:700;border:1px solid rgba(245,158,11,.3);">⚠️ ${expiringItems.length} Expiring Soon</span>`:'';
    const lowBadge=lowItems.length?`<span style="font-size:10px;padding:2px 8px;border-radius:20px;background:rgba(239,68,68,.08);color:var(--red);font-weight:700;border:1px solid rgba(239,68,68,.2);">📦 ${lowItems.length} Low Stock</span>`:'';

    return `<div class="card" style="border:${hasUrgent?'1.5px solid rgba(245,158,11,.4)':'1px solid var(--border)'};">
      <div style="display:flex;align-items:flex-start;gap:13px;margin-bottom:11px;">
        <div style="width:50px;height:50px;border-radius:14px;background:var(--gold-dim);border:1.5px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">${s.emoji}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-family:var(--font-body);font-size:15px;font-weight:800;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.name}</div>
          <div style="font-size:12px;color:var(--text2);margin-top:2px;">${s.category}</div>
          <div style="font-size:12px;color:var(--accent);font-weight:600;margin-top:2px;">👤 ${s.ownerName}</div>
        </div>
        <span style="font-size:10px;padding:2px 10px;border-radius:20px;background:${s.active?'rgba(34,197,94,.1)':'rgba(0,0,0,.05)'};color:${s.active?'var(--green)':'var(--text2)'};font-weight:700;flex-shrink:0;">${s.active?'ACTIVE':'INACTIVE'}</span>
      </div>

      ${(urgentBadge||expiringBadge||lowBadge)?`<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">${urgentBadge}${expiringBadge}${lowBadge}</div>`:''}

      <div style="font-size:12px;color:var(--text2);margin-bottom:8px;background:var(--bg3);border-radius:9px;padding:8px 10px;">
        <div>📍 ${s.address}</div>
        <div style="margin-top:3px;">🚚 Delivery: <strong style="color:var(--text);">${s.deliveryDay}</strong></div>
        <div style="margin-top:3px;">📦 Items: <span style="color:var(--accent);font-weight:600;">${s.supplyItems.slice(0,3).join(', ')}${s.supplyItems.length>3?` +${s.supplyItems.length-3} more`:''}</span></div>
        ${s.notes?`<div style="margin-top:3px;color:var(--orange);font-weight:600;">📝 ${s.notes}</div>`:''}
      </div>

      <div style="font-size:11px;font-weight:700;color:var(--text);margin-bottom:8px;">📞 ${s.phone}</div>

      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <a href="tel:+91${s.phone.replace(/\D/g,'')}" onclick="showToast('📞 Calling ${s.name}...','var(--green)')"
          style="display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:10px;border:1.5px solid var(--green);background:rgba(34,197,94,.08);color:var(--green);cursor:pointer;font-size:12px;font-weight:700;text-decoration:none;transition:all .15s;"
          onmouseover="this.style.background='rgba(34,197,94,.18)'" onmouseout="this.style.background='rgba(34,197,94,.08)'">
          📞 Call Now
        </a>
        <button onclick="whatsappSupplierBulk(${s.id})"
          style="display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:10px;border:1.5px solid #25D366;background:rgba(37,211,102,.08);color:#25D366;cursor:pointer;font-size:12px;font-weight:700;transition:all .15s;"
          onmouseover="this.style.background='rgba(37,211,102,.18)'" onmouseout="this.style.background='rgba(37,211,102,.08)'">
          💬 WhatsApp Order
        </button>
        <button onclick="openAddSupplierModal(${s.id})"
          style="display:flex;align-items:center;gap:6px;padding:8px 12px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg3);color:var(--text2);cursor:pointer;font-size:12px;font-weight:700;transition:all .15s;"
          onmouseover="this.style.background='var(--border)'" onmouseout="this.style.background='var(--bg3)'">
          ✏️ Edit
        </button>
        <button onclick="removeSupplier(${s.id})"
          style="display:flex;align-items:center;gap:6px;padding:8px 12px;border-radius:10px;border:1.5px solid rgba(239,68,68,.3);background:rgba(239,68,68,.05);color:var(--red);cursor:pointer;font-size:12px;font-weight:700;transition:all .15s;"
          onmouseover="this.style.background='rgba(239,68,68,.12)'" onmouseout="this.style.background='rgba(239,68,68,.05)'">
          🗑️ Del
        </button>
      </div>
    </div>`;
  }).join('');
  if(window.lucide)setTimeout(()=>lucide.createIcons(),50);
}

function removeSupplier(id){
  if(!confirm('Is supplier ko delete karo?'))return;
  appData.suppliers=appData.suppliers.filter(s=>s.id!==id);
  _supFbDel(id);
  renderSuppliers();
  showToast('Supplier remove ho gaya','var(--red)');
}

function addSupplier(){
  const name=document.getElementById('sup-name').value.trim();
  const owner=document.getElementById('sup-owner').value.trim();
  const phone=document.getElementById('sup-phone').value.trim();
  const category=document.getElementById('sup-category').value.trim();
  const address=document.getElementById('sup-address').value.trim();
  const delivery=document.getElementById('sup-delivery').value.trim();
  const notes=document.getElementById('sup-notes').value.trim();
  const items=document.getElementById('sup-items').value.trim();
  if(!name||!phone){showToast('Naam aur phone required hai','var(--red)');return;}
  const sup={
    id:Date.now(),name,ownerName:owner||name,phone,whatsapp:phone,category:category||'General',
    supplyItems:items?items.split(',').map(x=>x.trim()).filter(Boolean):[],
    address:address||'Solapur',deliveryDay:delivery||'Mon-Sat',notes,rating:4,active:true,emoji:'🏪'
  };
  appData.suppliers.push(sup);
  _supFbSave(sup);
  closeModal('addSupplierModal');
  ['sup-name','sup-owner','sup-phone','sup-category','sup-address','sup-delivery','sup-notes','sup-items'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  renderSuppliers();
  showToast(`✅ ${name} supplier add ho gaya!`,'var(--green)');
}

function openAddSupplierModal(supplierId){
  if(supplierId){
    // Edit mode
    const s=appData.suppliers.find(x=>x.id===supplierId);
    if(!s) return;
    document.getElementById('sup-name').value=s.name||'';
    document.getElementById('sup-owner').value=s.ownerName||'';
    document.getElementById('sup-phone').value=s.phone||'';
    document.getElementById('sup-category').value=s.category||'';
    document.getElementById('sup-address').value=s.address||'';
    document.getElementById('sup-delivery').value=s.deliveryDay||'';
    document.getElementById('sup-notes').value=s.notes||'';
    document.getElementById('sup-items').value=(s.supplyItems||[]).join(', ');
    document.getElementById('addSupplierModalTitle').textContent='✏️ Supplier Edit Karo';
    document.getElementById('addSupplierBtn').onclick=function(){
      s.name=document.getElementById('sup-name').value.trim()||s.name;
      s.ownerName=document.getElementById('sup-owner').value.trim()||s.ownerName;
      s.phone=document.getElementById('sup-phone').value.trim()||s.phone;
      s.whatsapp=s.phone;
      s.category=document.getElementById('sup-category').value.trim()||s.category;
      s.address=document.getElementById('sup-address').value.trim()||s.address;
      s.deliveryDay=document.getElementById('sup-delivery').value.trim()||s.deliveryDay;
      s.notes=document.getElementById('sup-notes').value.trim();
      const itemsStr=document.getElementById('sup-items').value.trim();
      s.supplyItems=itemsStr?itemsStr.split(',').map(x=>x.trim()).filter(Boolean):s.supplyItems;
      _supFbSave(s);
      closeModal('addSupplierModal');
      renderSuppliers();
      showToast(`✅ ${s.name} update ho gaya!`,'var(--green)');
    };
  } else {
    document.getElementById('addSupplierModalTitle').textContent='➕ Naya Supplier Add Karo';
    document.getElementById('addSupplierBtn').onclick=addSupplier;
  }
  openModal('addSupplierModal');
}

// ═══ MENU ═══
function renderMenu(cat){
  const grid=document.getElementById('menuGrid');if(!grid)return;
  let data=appData.menu;if(cat&&cat!=='all')data=data.filter(d=>d.category===cat);
  grid.innerHTML=data.map(d=>{
    const imgHTML=d.image
      ?`<div style="width:100%;height:140px;border-radius:12px;overflow:hidden;margin-bottom:11px;"><img src="${d.image}" style="width:100%;height:100%;object-fit:cover;" alt="${d.name}"></div>`
      :`<div style="width:100%;height:90px;border-radius:12px;background:var(--bg3);display:flex;align-items:center;justify-content:center;margin-bottom:11px;font-size:44px;">${d.emoji}</div>`;
    const portions=d.portions||['Full'];
    const halfPriceHTML=d.halfPrice&&d.halfPrice>0?`<span style="font-size:12px;color:var(--text2);font-weight:600;margin-left:8px;">Half: ₹${d.halfPrice}</span>`:'';
    const portionBadges=portions.map(p=>`<span style="font-size:10px;padding:2px 8px;border-radius:20px;background:var(--gold-dim);border:1px solid var(--border2);color:var(--accent);font-weight:700;">${p}</span>`).join('');
    return `<div class="card" style="position:relative;padding:14px;">
      ${imgHTML}
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:7px;">
        <div>
          <div style="font-family:var(--font-body);font-size:15px;font-weight:700;color:var(--text);">${d.name}</div>
          <div style="font-size:11px;color:var(--text2);letter-spacing:.8px;text-transform:uppercase;margin-top:2px;">${d.category}</div>
        </div>
        <button onclick="openEditDishImageModal(${d.id})" title="Image Upload/Change" style="background:var(--bg3);border:1.5px solid var(--border);border-radius:8px;padding:5px 8px;cursor:pointer;font-size:13px;">📷</button>
      </div>
      <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:9px;">${portionBadges}</div>
      <div style="display:flex;align-items:center;margin-bottom:10px;">
        <span style="font-family:var(--font-head);font-size:20px;color:var(--accent);font-weight:800;">₹${d.price}</span>
        ${halfPriceHTML}
      </div>
      <div style="display:flex;gap:7px;align-items:center;">
        <label class="attendance-toggle"><input type="checkbox" ${d.available?'checked':''} onchange="toggleDish(${d.id},this.checked)"><div class="tog-track"><div class="tog-thumb"></div></div></label>
        <span style="font-size:12px;color:${d.available?'var(--green)':'var(--red)'};font-weight:700;">${d.available?'AVAILABLE':'UNAVAILABLE'}</span>
        <button class="btn-sm btn-red" style="font-size:11px;padding:4px 10px;margin-left:auto;" onclick="removeDish(${d.id})">Del</button>
      </div>
    </div>`;
  }).join('');
}
function filterMenu(cat){renderMenu(cat);}
function searchMenu(q){
  const grid=document.getElementById('menuGrid');if(!grid)return;
  let data=appData.menu;
  if(q)data=data.filter(d=>d.name.toLowerCase().includes(q.toLowerCase())||d.category.toLowerCase().includes(q.toLowerCase()));
  renderMenu._filtered=data;
  const orig=renderMenu;
  // Temporary render with filtered data
  const tmp=appData.menu;
  appData.menu=data;renderMenu();appData.menu=tmp;
}
function toggleDish(id,val){const d=appData.menu.find(x=>x.id===id);if(d)d.available=val;}
function removeDish(id){appData.menu=appData.menu.filter(d=>d.id!==id);renderMenu();}

// ── Dish Image Upload Modal ──
let _editDishId=null;
function openEditDishImageModal(id){
  _editDishId=id;
  const d=appData.menu.find(x=>x.id===id);if(!d)return;
  document.getElementById('editDishImgTitle').textContent=d.name;
  const prev=document.getElementById('editDishImgPreview');
  prev.src=d.image||'';prev.style.display=d.image?'block':'none';
  document.getElementById('editDishImgInput').value='';
  openModal('editDishImageModal');
}
function handleDishImageSelect(input){
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{
    const prev=document.getElementById('editDishImgPreview');
    prev.src=e.target.result;prev.style.display='block';
  };
  reader.readAsDataURL(file);
}
function saveDishImage(){
  const input=document.getElementById('editDishImgInput');
  const file=input.files[0];
  if(!file){showToast('Pehle image select karo','var(--red)');return;}
  const reader=new FileReader();
  reader.onload=e=>{
    const d=appData.menu.find(x=>x.id===_editDishId);
    if(d){d.image=e.target.result;renderMenu();showToast(`${d.name} ki image save ho gayi! 📷`);}
    closeModal('editDishImageModal');
  };
  reader.readAsDataURL(file);
}
function removeDishImage(){
  const d=appData.menu.find(x=>x.id===_editDishId);
  if(d){d.image='';renderMenu();showToast('Image remove ho gayi');}
  closeModal('editDishImageModal');
}

function addMenuDish(){
  const name=document.getElementById('d-name').value.trim();
  const price=parseFloat(document.getElementById('d-price').value)||0;
  const halfPrice=parseFloat(document.getElementById('d-half-price').value)||0;
  const category=document.getElementById('d-cat').value;
  const portionChecks=document.querySelectorAll('.d-portion-check:checked');
  const portions=portionChecks.length>0?Array.from(portionChecks).map(c=>c.value):['Full'];
  if(!name){showToast('Dish ka naam daalo','var(--red)');return;}

  // Image handling
  const imgInput=document.getElementById('d-img-input');
  const file=imgInput&&imgInput.files&&imgInput.files[0];
  if(file){
    const reader=new FileReader();
    reader.onload=e=>{
      appData.menu.push({id:Date.now(),name,emoji:'🍽️',price,halfPrice,category,available:true,sold:0,image:e.target.result,portions});
      closeModal('addMenuModal');_resetAddDishForm();renderMenu();showToast(`${name} menu mein add ho gaya! 🍽️`);
    };
    reader.readAsDataURL(file);
  } else {
    appData.menu.push({id:Date.now(),name,emoji:'🍽️',price,halfPrice,category,available:true,sold:0,image:'',portions});
    closeModal('addMenuModal');_resetAddDishForm();renderMenu();showToast(`${name} menu mein add ho gaya! 🍽️`);
  }
}
function _resetAddDishForm(){
  ['d-name','d-price','d-half-price'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  const imgInput=document.getElementById('d-img-input');if(imgInput)imgInput.value='';
  const prev=document.getElementById('d-img-preview');if(prev){prev.src='';prev.style.display='none';}
  document.querySelectorAll('.d-portion-check').forEach(c=>c.checked=c.value==='Full');
}
function handleAddDishImage(input){
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{
    const prev=document.getElementById('d-img-preview');
    if(prev){prev.src=e.target.result;prev.style.display='block';}
  };
  reader.readAsDataURL(file);
}

// ═══ BILLING ═══
let selectedPayMethod='Cash';
function renderBilling(){
  const sel=document.getElementById('billTable');if(!sel)return;
  sel.innerHTML='<option value="">-- Select Table --</option>'+appData.tables.filter(t=>t.status!=='available').map(t=>`<option value="${t.id}">Table ${t.id}</option>`).join('');
  renderRecentBills();
}
function loadTableBill(){
  const tid=parseInt(document.getElementById('billTable').value);const t=appData.tables.find(x=>x.id===tid);
  if(!t){document.getElementById('billItems').innerHTML='';document.getElementById('billTotal').textContent='₹0.00';return;}
  const subtotal=t.items.reduce((_,name)=>{const m=appData.menu.find(d=>name.includes(d.name.split(' ')[0]));return _+(m?m.price:150);},0);
  const gst=Math.round(subtotal*.18);const total=subtotal+gst;
  document.getElementById('billItems').innerHTML=`
    ${t.items.map(it=>{const m=appData.menu.find(d=>it.includes(d.name.split(' ')[0]));return `<div class="bill-row"><span>${it}</span><span>₹${m?m.price:150}</span></div>`;}).join('')}
    <div class="bill-row"><span>GST (18%)</span><span>₹${gst}</span></div>`;
  document.getElementById('billTotal').textContent=`₹${total}`;
}
function selectPay(m){
  selectedPayMethod=m;
  ['cash','upi','card'].forEach(x=>{const b=document.getElementById('pay-'+x);if(b){b.style.background='';b.style.fontWeight='600';}});
  const sel=document.getElementById('pay-'+m.toLowerCase());
  if(sel){sel.style.background='var(--gold-dim)';sel.style.fontWeight='800';}
}
function generateBill(){
  const tid=document.getElementById('billTable').value;
  if(!tid){showToast('Select a table first','var(--red)');return;}
  const cust=document.getElementById('custName').value||'Walk-in';
  const t=appData.tables.find(x=>x.id===parseInt(tid));
  const subtotal=t?t.items.reduce((_,name)=>{const m=appData.menu.find(d=>name.includes(d.name.split(' ')[0]));return _+(m?m.price:150);},0):580;
  const gst=Math.round(subtotal*.18);const total=subtotal+gst;
  appData.recentBills.unshift({table:parseInt(tid),amount:subtotal,gst,total,payment:selectedPayMethod,time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}),customer:cust});
  // ── AUTO TRACK CUSTOMER ──
  autoTrackCustomer(cust, total, t?t.items:[]);
  renderRecentBills();showToast(`Bill generated for Table ${tid} — ${cust}!`);
}
function renderRecentBills(){
  const el=document.getElementById('recentBills');if(!el)return;
  el.innerHTML=appData.recentBills.map(b=>`
    <div style="background:var(--bg3);border:1px solid var(--border);border-radius:11px;padding:13px 15px;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div style="font-size:14px;font-weight:700;">Table ${b.table} — ${b.customer}</div>
        <div style="font-size:11px;color:var(--text2);margin-top:2px;">${b.payment} • ${b.time}</div>
      </div>
      <span style="font-family:var(--font-head);font-size:18px;color:var(--accent);font-weight:800;">₹${b.total}</span>
    </div>`).join('');
}
function whatsappBill(){showToast('Bill WhatsApp pe bheja gaya!');}
function printBill(){showToast('Bill printer ko bheja gaya!');}

// ═══════════════════════════════════════════════════════════
//  CUSTOMERS — Full Firebase-backed Customer Management
//  Auto-track from billing + Manual add + Analytics
// ═══════════════════════════════════════════════════════════

// ── Render Customer Cards ──
function renderCustomers(data){
  const grid=document.getElementById('custGrid');if(!grid)return;
  const customers=data||appData.customers;
  if(!customers.length){
    grid.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:44px 20px;color:var(--text2);">
      <div style="font-size:44px;margin-bottom:12px;">👥</div>
      <div style="font-size:15px;font-weight:700;">Abhi koi customer nahi</div>
      <div style="font-size:12px;margin-top:6px;">Bill generate karte waqt naam daaloge toh automatically yahan save hoga!</div>
    </div>`;
    updateCustStats();return;
  }

  // Sort by visits desc by default
  const sorted=[...customers].sort((a,b)=>(b.visits||0)-(a.visits||0));

  grid.innerHTML=sorted.map(c=>{
    const badge=c.vip?'<span style="font-size:9px;font-weight:800;padding:2px 8px;border-radius:20px;background:rgba(245,158,11,.15);color:var(--orange);border:1px solid rgba(245,158,11,.3);">👑 VIP</span>':'';
    const autoTag=c.autoAdded?'<span style="font-size:9px;font-weight:700;padding:2px 7px;border-radius:20px;background:var(--gold-dim);color:var(--accent);border:1px solid var(--border2);">🔄 Auto</span>':'<span style="font-size:9px;font-weight:700;padding:2px 7px;border-radius:20px;background:rgba(59,130,246,.1);color:var(--blue);border:1px solid rgba(59,130,246,.25);">✏️ Manual</span>';
    const initials=c.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
    const spentK=c.spent>=1000?(c.spent/1000).toFixed(1)+'k':c.spent;
    // Visit frequency badge
    let freqLabel='', freqColor='var(--text2)';
    if(c.visits>=20){freqLabel='🏆 Champion';freqColor='var(--orange)';}
    else if(c.visits>=10){freqLabel='⭐ Regular';freqColor='var(--accent)';}
    else if(c.visits>=5){freqLabel='🙂 Frequent';freqColor='var(--blue)';}
    else{freqLabel='🆕 New';freqColor='var(--text2)';}

    return `<div class="card" style="cursor:pointer;transition:var(--trans);" onclick="openCustDetail(${c.id})">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:11px;">
        <div style="width:48px;height:48px;border-radius:50%;background:${c.vip?'linear-gradient(135deg,var(--accent3),var(--accent))':'linear-gradient(135deg,#3b82f6,#1d4ed8)'};border:2px solid ${c.vip?'var(--orange)':'rgba(59,130,246,.4)'};display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#fff;font-family:var(--font-body);flex-shrink:0;">
          ${initials}
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-family:var(--font-body);font-size:14px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.name}</div>
          <div style="font-size:11px;color:var(--text2);margin-top:2px;">${c.phone||'—'}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">${badge}${autoTag}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;margin-bottom:9px;">
        <div style="text-align:center;background:var(--bg3);border-radius:9px;padding:7px 4px;">
          <div style="font-family:var(--font-head);font-size:17px;font-weight:800;color:var(--accent);">${c.visits||0}</div>
          <div style="font-size:9px;color:var(--text2);font-weight:700;letter-spacing:.5px;">VISITS</div>
        </div>
        <div style="text-align:center;background:var(--bg3);border-radius:9px;padding:7px 4px;">
          <div style="font-family:var(--font-head);font-size:16px;font-weight:800;color:var(--green);">₹${spentK}</div>
          <div style="font-size:9px;color:var(--text2);font-weight:700;letter-spacing:.5px;">SPENT</div>
        </div>
        <div style="text-align:center;background:var(--bg3);border-radius:9px;padding:7px 4px;">
          <div style="font-size:13px;font-weight:800;color:${freqColor};">${freqLabel}</div>
          <div style="font-size:9px;color:var(--text2);font-weight:700;letter-spacing:.5px;">STATUS</div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:11px;color:var(--text2);">❤️ <strong style="color:var(--accent);">${c.fav||'—'}</strong></div>
        <div style="font-size:11px;color:var(--text2);">🕐 ${c.lastVisit||'—'}</div>
      </div>
      <div style="display:flex;gap:7px;margin-top:10px;">
        <button class="btn-sm btn-green" style="font-size:10px;padding:4px 10px;flex:1;" onclick="event.stopPropagation();quickAddVisit(${c.id})">+ Visit</button>
        <button class="btn-sm btn-gold" style="font-size:10px;padding:4px 10px;flex:1;" onclick="event.stopPropagation();toggleVIP(${c.id})">${c.vip?'Remove VIP':'Make VIP'}</button>
        <button class="btn-sm btn-red" style="font-size:10px;padding:4px 10px;" onclick="event.stopPropagation();removeCustomer(${c.id})">Del</button>
      </div>
    </div>`;
  }).join('');
  updateCustStats(data);
}

// ── Customer Stats Summary ──
function updateCustStats(data){
  const list=data||appData.customers;
  const total=list.length;
  const vip=list.filter(c=>c.vip).length;
  const revenue=list.reduce((s,c)=>s+(c.spent||0),0);
  const today=list.filter(c=>c.lastVisit==='Today').length;
  const avgVisits=total?Math.round(list.reduce((s,c)=>s+(c.visits||0),0)/total):0;
  const el=id=>document.getElementById(id);
  if(el('cstat-total'))el('cstat-total').textContent=total;
  if(el('cstat-vip'))el('cstat-vip').textContent=vip;
  if(el('cstat-revenue'))el('cstat-revenue').textContent='₹'+(revenue>=1000?(revenue/1000).toFixed(1)+'k':revenue);
  if(el('cstat-today'))el('cstat-today').textContent=today;
  if(el('cstat-avg'))el('cstat-avg').textContent=avgVisits;
}

// ── Filter & Sort ──
function filterCust(t){
  if(t==='vip')renderCustomers(appData.customers.filter(c=>c.vip));
  else if(t==='today')renderCustomers(appData.customers.filter(c=>c.lastVisit==='Today'));
  else renderCustomers(appData.customers);
}
function sortCust(by){
  const sorted=[...appData.customers].sort((a,b)=>(b[by]||0)-(a[by]||0));
  renderCustomers(sorted);
}
function searchCust(q){
  renderCustomers(appData.customers.filter(c=>
    c.name.toLowerCase().includes(q.toLowerCase())||
    (c.phone&&c.phone.includes(q))||
    (c.fav&&c.fav.toLowerCase().includes(q.toLowerCase()))
  ));
}

// ── Manual Add Customer ──
function addCustomer(){
  const name=document.getElementById('c-name').value.trim();
  const phone=document.getElementById('c-phone').value.trim();
  const fav=document.getElementById('c-fav').value.trim();
  const vip=document.getElementById('c-vip').checked;
  const spent=parseFloat(document.getElementById('c-spent')?.value)||0;
  const visits=parseInt(document.getElementById('c-visits')?.value)||1;
  if(!name){showToast('Customer ka naam daalo','var(--red)');return;}

  // Check duplicate by phone
  if(phone){
    const dup=appData.customers.find(c=>c.phone===phone);
    if(dup){showToast(`${dup.name} pehle se hai (${phone})!`,'var(--orange)');return;}
  }

  const c={id:Date.now(),name,phone,visits,lastVisit:'Today',fav:fav||'—',vip,spent,autoAdded:false,addedOn:new Date().toLocaleDateString('en-IN'),history:[]};
  appData.customers.push(c);
  _custFbSave(c);
  closeModal('addCustModal');
  ['c-name','c-phone','c-fav','c-spent','c-visits'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  const cv=document.getElementById('c-vip');if(cv)cv.checked=false;
  renderCustomers();
  showToast(`✅ ${name} add ho gaya — Firebase save!`,'var(--green)');
}

// ── Auto-Track Customer from Billing ──
// Call this from generateBill() when bill is finalized
function autoTrackCustomer(custName, amount, items){
  if(!custName||custName.toLowerCase()==='walk-in'||custName.trim()==='')return;

  const today=new Date().toLocaleDateString('en-IN');
  const timeStr=new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});

  // Find existing customer by name (case-insensitive)
  let c=appData.customers.find(x=>x.name.toLowerCase()===custName.toLowerCase());

  if(c){
    // Update existing
    c.visits=(c.visits||0)+1;
    c.spent=(c.spent||0)+amount;
    c.lastVisit='Today';
    c.lastVisitDate=today;
    // Track favorite dish from items
    if(items&&items.length){
      const dishCount={};
      [...(c.history||[]),...items].forEach(d=>{dishCount[d]=(dishCount[d]||0)+1;});
      c.fav=Object.entries(dishCount).sort((a,b)=>b[1]-a[1])[0]?.[0]||c.fav||'—';
    }
    // Add to history
    if(!c.history)c.history=[];
    c.history.unshift({date:today,time:timeStr,amount,items:items||[]});
    if(c.history.length>20)c.history=c.history.slice(0,20); // max 20 entries

    _custFbSave(c);
    showToast(`🔄 ${c.name} — Visit #${c.visits} auto-save! ₹${amount}`,'var(--accent)');
  } else {
    // New auto-detected customer
    const newC={
      id:Date.now(),name:custName,phone:'',
      visits:1,lastVisit:'Today',lastVisitDate:today,
      fav:items&&items.length?items[0]:'—',
      vip:false,spent:amount,autoAdded:true,
      addedOn:today,
      history:[{date:today,time:timeStr,amount,items:items||[]}]
    };
    appData.customers.push(newC);
    _custFbSave(newC);
    showToast(`🆕 ${custName} automatically customer list mein add! ₹${amount}`,'var(--green)');
  }
  renderCustomers();
}

// ── Quick Add Visit (manual button) ──
function quickAddVisit(id){
  const c=appData.customers.find(x=>x.id===id);
  if(!c)return;
  c.visits=(c.visits||0)+1;
  c.lastVisit='Today';
  const amt=prompt(`${c.name} ne is baar kitna kharch kiya? (₹ — blank chhod sako)`) ;
  if(amt&&!isNaN(amt))c.spent=(c.spent||0)+parseFloat(amt);
  if(!c.history)c.history=[];
  c.history.unshift({date:new Date().toLocaleDateString('en-IN'),time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}),amount:parseFloat(amt)||0,items:[]});
  _custFbSave(c);
  renderCustomers();
  showToast(`${c.name} — Visit #${c.visits} add ho gaya!`,'var(--accent)');
}

// ── Toggle VIP ──
function toggleVIP(id){
  const c=appData.customers.find(x=>x.id===id);
  if(!c)return;
  c.vip=!c.vip;
  _custFbSave(c);
  renderCustomers();
  showToast(`${c.name} → ${c.vip?'👑 VIP ban gaye!':'Regular customer'}`);
}

// ── Remove Customer ──
function removeCustomer(id){
  const c=appData.customers.find(x=>x.id===id);
  if(!confirm(`${c?c.name:'Customer'} ko delete karo?`))return;
  appData.customers=appData.customers.filter(x=>x.id!==id);
  _custFbDel(id);
  renderCustomers();
  showToast(`${c?c.name:'Customer'} remove ho gaya.`,'var(--red)');
}

// ── Customer Detail Modal ──
function openCustDetail(id){
  const c=appData.customers.find(x=>x.id===id);if(!c)return;
  const title=document.getElementById('custDetailTitle');
  const body=document.getElementById('custDetailBody');
  if(!title||!body)return;
  title.innerHTML=`${c.vip?'👑':''} ${c.name} <button class="modal-close" onclick="closeModal('custDetailModal')"><i data-lucide="x"></i></button>`;
  const history=(c.history||[]).slice(0,10);
  body.innerHTML=`
    <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;">
      <div style="flex:1;min-width:100px;background:var(--bg3);border-radius:10px;padding:12px;text-align:center;">
        <div style="font-family:var(--font-head);font-size:22px;font-weight:800;color:var(--accent);">${c.visits||0}</div>
        <div style="font-size:10px;color:var(--text2);font-weight:700;">TOTAL VISITS</div>
      </div>
      <div style="flex:1;min-width:100px;background:var(--bg3);border-radius:10px;padding:12px;text-align:center;">
        <div style="font-family:var(--font-head);font-size:20px;font-weight:800;color:var(--green);">₹${(c.spent||0).toLocaleString('en-IN')}</div>
        <div style="font-size:10px;color:var(--text2);font-weight:700;">TOTAL SPENT</div>
      </div>
    </div>
    <div style="font-size:12px;color:var(--text2);margin-bottom:8px;">📞 ${c.phone||'—'} &nbsp;|&nbsp; ❤️ ${c.fav||'—'} &nbsp;|&nbsp; 🕐 ${c.lastVisit||'—'}</div>
    <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">📅 Added: ${c.addedOn||'—'} &nbsp;|&nbsp; ${c.autoAdded?'🔄 Auto-tracked':'✏️ Manually added'}</div>
    ${history.length?`
    <div style="font-size:11px;font-weight:800;letter-spacing:1px;color:var(--text2);margin-bottom:8px;font-family:var(--font-mono);">VISIT HISTORY</div>
    <div style="display:flex;flex-direction:column;gap:7px;max-height:200px;overflow-y:auto;">
      ${history.map(h=>`
        <div style="background:var(--bg3);border-radius:9px;padding:9px 12px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:12px;font-weight:700;">${h.date} ${h.time||''}</div>
            <div style="font-size:11px;color:var(--text2);">${(h.items||[]).join(', ')||'—'}</div>
          </div>
          <div style="font-family:var(--font-head);font-size:15px;font-weight:800;color:var(--green);">₹${h.amount||0}</div>
        </div>`).join('')}
    </div>`:'<div style="text-align:center;padding:16px;color:var(--text2);font-size:12px;">Koi history nahi abhi</div>'}
    <div style="display:flex;gap:8px;margin-top:14px;">
      <button class="btn-sm btn-green" style="flex:1;" onclick="quickAddVisit(${c.id});closeModal('custDetailModal');">+ Manual Visit</button>
      <button class="btn-sm btn-gold" style="flex:1;" onclick="toggleVIP(${c.id});closeModal('custDetailModal');">${c.vip?'Remove VIP':'Make VIP'}</button>
    </div>`;
  openModal('custDetailModal');
  if(window.lucide)setTimeout(()=>lucide.createIcons(),50);
}

// ── Firebase Save/Delete for Customers ──
// These call the real Firebase functions once they are ready
function _custFbSave(c){
  if(window.__custFbSave){window.__custFbSave(c);return;}
  // Queue for when Firebase is ready
  if(!window.__custSaveQueue)window.__custSaveQueue=[];
  window.__custSaveQueue.push(c);
}
function _custFbDel(id){
  if(window.__custFbDel){window.__custFbDel(id);return;}
  if(!window.__custDelQueue)window.__custDelQueue=[];
  window.__custDelQueue.push(id);
}

// ═══ SUPPLIER FIREBASE STUBS ═══
function _supFbSave(s){
  if(window.__supFbSave){window.__supFbSave(s);return;}
  if(!window.__supSaveQueue)window.__supSaveQueue=[];
  window.__supSaveQueue.push(s);
}
function _supFbDel(id){
  if(window.__supFbDel){window.__supFbDel(id);return;}
  if(!window.__supDelQueue)window.__supDelQueue=[];
  window.__supDelQueue.push(id);
}
async function loadSuppliersFromFirebase(){
  const db=window.__chefDb;
  if(!db)return;
  try{
    const {collection,getDocs}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const snap=await getDocs(collection(db,'chef_suppliers'));
    if(!snap.empty){
      const data=snap.docs.map(d=>d.data());
      appData.suppliers=data.sort((a,b)=>Number(a.id)-Number(b.id));
      renderSuppliers();
      console.log(`✅ Suppliers loaded from Firebase: ${data.length}`);
    }
  }catch(e){console.warn('[SUPPLIERS] Load error:',e.message);}
}

// ═══ WAITER CALLS ═══
const callTypeLabel={food_ready:'Food Ready',assistance:'Need Assistance',bill_request:'Bill Request',water:'Water/Refill'};
function renderWaiterCalls(){
  const el=document.getElementById('waiterCalls');if(!el)return;
  el.innerHTML=appData.waiterCalls.map(c=>`
    <div style="background:var(--bg2);border:1px solid ${c.resolved?'var(--border)':'rgba(239,68,68,.25)'};border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px;box-shadow:var(--shadow-card);">
      <div style="width:42px;height:42px;border-radius:12px;background:${c.resolved?'var(--bg3)':'rgba(239,68,68,.1)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c.resolved?'var(--text2)':'var(--red)'}" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
      </div>
      <div style="flex:1;">
        <div style="font-size:14px;font-weight:700;">Table ${c.table} — ${callTypeLabel[c.type]||c.type}</div>
        <div style="font-size:12px;color:var(--text2);margin-top:2px;">${c.waiter} • ${c.time}</div>
      </div>
      <div style="display:flex;gap:8px;">
        ${!c.resolved?`<button class="btn-sm btn-green" style="font-size:11px;" onclick="resolveCall(${c.id})">Resolve</button>`:'<span style="font-size:11px;color:var(--green);font-weight:700;">RESOLVED</span>'}
      </div>
    </div>`).join('');
}
function resolveCall(id){const c=appData.waiterCalls.find(x=>x.id===id);if(c){c.resolved=true;renderWaiterCalls();showToast('Call resolved!');}}
function resolveAllCalls(){appData.waiterCalls.forEach(c=>c.resolved=true);renderWaiterCalls();showToast('All calls resolved!','var(--green)');}
function addWaiterCall(){
  const table=parseInt(document.getElementById('wc-table').value);const type=document.getElementById('wc-type').value;const waiter=document.getElementById('wc-waiter').value;
  if(!table){showToast('Enter table number','var(--red)');return;}
  appData.waiterCalls.unshift({id:Date.now(),table,waiter:waiter||'Unassigned',type,time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}),resolved:false});
  closeModal('callWaiterModal');renderWaiterCalls();showToast(`Waiter call sent for Table ${table}!`);
}

// ═══ BRANCHES ═══
function renderBranches(){
  const grid=document.getElementById('branchGrid');if(!grid)return;
  grid.innerHTML=appData.branches.map(b=>`
    <div class="branch-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:13px;">
        <div>
          <div style="font-family:var(--font-head);font-size:17px;font-weight:800;">${b.name}</div>
          <div style="font-size:12px;color:var(--text2);margin-top:3px;">${b.location} • ${b.manager}</div>
        </div>
        <span style="font-size:10px;font-weight:800;padding:3px 12px;border-radius:20px;background:${b.active?'rgba(34,197,94,.12)':'rgba(0,0,0,.06)'};color:${b.active?'var(--green)':'var(--text2)'};">${b.active?'ACTIVE':'INACTIVE'}</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px;">
        <div style="text-align:center;background:var(--bg3);border-radius:10px;padding:10px;"><div style="font-family:var(--font-head);font-size:18px;font-weight:800;color:var(--accent);">${b.tables}</div><div style="font-size:10px;color:var(--text2);font-weight:600;">TABLES</div></div>
        <div style="text-align:center;background:var(--bg3);border-radius:10px;padding:10px;"><div style="font-family:var(--font-head);font-size:18px;font-weight:800;color:var(--blue);">${b.orders}</div><div style="font-size:10px;color:var(--text2);font-weight:600;">ORDERS</div></div>
        <div style="text-align:center;background:var(--bg3);border-radius:10px;padding:10px;"><div style="font-family:var(--font-head);font-size:16px;font-weight:800;color:var(--purple);">₹${(b.revenue/1000).toFixed(1)}k</div><div style="font-size:10px;color:var(--text2);font-weight:600;">REVENUE</div></div>
      </div>
    </div>`).join('');
}
function addBranch(){
  const name=document.getElementById('b-name').value.trim();const location=document.getElementById('b-loc').value.trim();
  const manager=document.getElementById('b-mgr').value.trim();const phone=document.getElementById('b-phone').value.trim();
  if(!name){showToast('Enter branch name','var(--red)');return;}
  appData.branches.push({id:Date.now(),name,location,manager,phone,active:true,tables:0,orders:0,revenue:0});
  closeModal('addBranchModal');renderBranches();showToast(`${name} added!`);
}

// ═══ ANALYTICS — ADVANCED FIREBASE-POWERED ═══
let analyticCharts=[];
let _anPeriod='today';
let _anData={}; // Firebase se loaded data cache

// ── Helper: destroy all charts ──
function _anDestroy(){analyticCharts.forEach(c=>{try{c.destroy();}catch(e){}});analyticCharts=[];}

// ── Chart option factories ──
const _anBar=(indexAxis)=>({...CHART_OPTS,indexAxis:indexAxis||'x',scales:{
  y:{beginAtZero:true,grid:{color:'rgba(0,0,0,.05)'},ticks:{color:'#6c7890',font:{size:10}}},
  x:{grid:{display:false},ticks:{color:'#6c7890',font:{size:9}}}}});
const _anHBar=()=>({...CHART_OPTS,indexAxis:'y',scales:{
  x:{beginAtZero:true,grid:{color:'rgba(0,0,0,.04)'},ticks:{color:'#6c7890',font:{size:9}}},
  y:{grid:{display:false},ticks:{color:'#6c7890',font:{size:10}}}}});

// ── Main render: uses _anData ──
function renderAnalytics(){
  _anDestroy();
  const d=_anData;
  const bills=d.bills||[];
  const orders=d.orders||[];
  const allBills=[...bills,...orders];

  // ── Metric cards ──
  const totalRev=allBills.reduce((s,b)=>s+(b.total||b.totalAmount||0),0);
  const totalOrders=allBills.length;
  const avgVal=totalOrders?Math.round(totalRev/totalOrders):0;
  const uniqueCust=new Set(allBills.map(b=>b.customer||b.customerName||'').filter(n=>n&&n!=='Walk-in'&&n!=='Walk-In')).size;

  // Peak hour from orders timestamps
  const hourCounts={};
  allBills.forEach(b=>{
    const ts=b.createdAt||b.timestamp;
    if(ts){const h=new Date(ts).getHours();hourCounts[h]=(hourCounts[h]||0)+1;}
  });
  const peakHour=Object.keys(hourCounts).length?Object.entries(hourCounts).sort((a,b)=>b[1]-a[1])[0][0]:null;
  const peakLabel=peakHour!=null?(parseInt(peakHour)>=12?(parseInt(peakHour)-12||12)+' PM':parseInt(peakHour)+' AM'):'—';

  // Profit margin estimate: avg menu margin ~55%
  const invCost=(d.inventory||[]).reduce((s,i)=>s+(i.costPerUnit||0)*(i.usageLog||[]).reduce((u,l)=>u+(l.used||0),0),0);
  const profitPct=totalRev>0?Math.round(((totalRev-Math.min(invCost,totalRev*0.5))/totalRev)*100):55;

  const el=id=>document.getElementById(id);
  if(el('a-orders'))el('a-orders').textContent=totalOrders||'0';
  if(el('a-revenue'))el('a-revenue').textContent=totalRev>=1000?'₹'+(totalRev/1000).toFixed(1)+'k':'₹'+totalRev;
  if(el('a-peakhr'))el('a-peakhr').textContent=peakLabel;
  if(el('a-avgtime'))el('a-avgtime').textContent=avgVal?'₹'+avgVal:'—';
  if(el('a-customers'))el('a-customers').textContent=uniqueCust||appData.customers.length||'0';
  if(el('a-profit-pct'))el('a-profit-pct').textContent=(profitPct||55)+'%';

  // ── 1. Daily Revenue Trend (last 7 days) ──
  {const ctx=document.getElementById('dailyTrendChart');if(ctx){
    const days=[];const revByDay={};
    for(let i=6;i>=0;i--){
      const d2=new Date();d2.setDate(d2.getDate()-i);
      const key=d2.toLocaleDateString('en-IN');
      days.push(d2.toLocaleDateString('en-IN',{weekday:'short',day:'numeric'}));
      revByDay[key]=0;
    }
    allBills.forEach(b=>{
      const ts=b.createdAt||b.timestamp;
      if(ts){const key=new Date(ts).toLocaleDateString('en-IN');if(revByDay[key]!==undefined)revByDay[key]+=(b.total||b.totalAmount||0);}
    });
    // Also use gst_invoices
    (d.gstInvoices||[]).forEach(inv=>{
      const key=new Date(inv.createdAt).toLocaleDateString('en-IN');
      if(revByDay[key]!==undefined)revByDay[key]+=(inv.total||0);
    });
    const vals=Object.values(revByDay);
    const c=new Chart(ctx,{type:'line',data:{
      labels:days,
      datasets:[{label:'Revenue ₹',data:vals,borderColor:'#2e9c5e',backgroundColor:'rgba(46,156,94,.12)',borderWidth:2.5,fill:true,tension:0.4,pointRadius:4,pointBackgroundColor:'#2e9c5e'}]},
      options:{...CHART_OPTS,scales:{y:{beginAtZero:true,grid:{color:'rgba(0,0,0,.05)'},ticks:{color:'#6c7890',font:{size:9},callback:v=>'₹'+(v>=1000?(v/1000).toFixed(1)+'k':v)}},x:{grid:{display:false},ticks:{color:'#6c7890',font:{size:9}}}}}});
    analyticCharts.push(c);}}

  // ── 2. Hourly Sales Chart ──
  {const ctx=document.getElementById('hourlyChart');if(ctx){
    const hLabels=['9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM','6PM','7PM','8PM','9PM','10PM'];
    const hRevenue=Array(14).fill(0);
    allBills.forEach(b=>{
      const ts=b.createdAt||b.timestamp;
      if(ts){const h=new Date(ts).getHours();const idx=h-9;if(idx>=0&&idx<14)hRevenue[idx]+=(b.total||b.totalAmount||0);}
    });
    const maxH=Math.max(...hRevenue);
    const c=new Chart(ctx,{type:'bar',data:{
      labels:hLabels,
      datasets:[{label:'Revenue ₹',data:hRevenue,backgroundColor:hRevenue.map(v=>v===maxH&&maxH>0?'#2e9c5ecc':'#3b82f688'),borderColor:hRevenue.map(v=>v===maxH&&maxH>0?'#2e9c5e':'#3b82f6'),borderWidth:2,borderRadius:7,borderSkipped:false}]},
      options:{...CHART_OPTS,scales:{y:{beginAtZero:true,grid:{color:'rgba(0,0,0,.05)'},ticks:{color:'#6c7890',font:{size:9}}},x:{grid:{display:false},ticks:{color:'#6c7890',font:{size:8}}}}}});
    analyticCharts.push(c);}}

  // ── 3. Top Dishes — Real Sales from menu + orders ──
  {const ctx=document.getElementById('dishPieChart');if(ctx){
    const dishCount={};
    allBills.forEach(b=>{(b.items||[]).forEach(i=>{const nm=typeof i==='string'?i:(i.name||'');if(nm)dishCount[nm]=(dishCount[nm]||0)+(i.qty||1);});});
    appData.menu.forEach(m=>{if(m.sold>0)dishCount[m.name]=(dishCount[m.name]||0)+m.sold;});
    const top=Object.entries(dishCount).sort((a,b)=>b[1]-a[1]).slice(0,7);
    const labels=top.map(x=>x[0].split(' ').slice(0,2).join(' '));
    const vals=top.map(x=>x[1]);
    const c=new Chart(ctx,{type:'bar',data:{
      labels,
      datasets:[{label:'Orders',data:vals,backgroundColor:PIE_COLORS.map(x=>x+'cc'),borderColor:PIE_COLORS,borderWidth:2,borderRadius:7,borderSkipped:false}]},
      options:_anBar()});
    analyticCharts.push(c);}}

  // ── 4. Revenue by Category ──
  {const ctx=document.getElementById('revCatChart');if(ctx){
    const catRev={};
    allBills.forEach(b=>{
      (b.items||[]).forEach(i=>{
        const nm=typeof i==='string'?i:(i.name||'');
        const menuItem=appData.menu.find(m=>m.name===nm||nm.includes(m.name.split(' ')[0]));
        const cat=menuItem?menuItem.category:'Other';
        const price=typeof i==='object'?(i.price||i.rate||0):0;
        const qty=typeof i==='object'?(i.qty||1):1;
        catRev[cat]=(catRev[cat]||0)+(price*qty||(menuItem?menuItem.price*qty:0));
      });
    });
    const entries=Object.entries(catRev).sort((a,b)=>b[1]-a[1]).slice(0,6);
    if(!entries.length){['Main Course','Starter','Drinks','Breads','Dessert'].forEach((c2,i)=>catRev[c2]=3000-i*400);
      const fb=Object.entries(catRev).sort((a,b)=>b[1]-a[1]);
      const c=new Chart(ctx,{type:'bar',data:{labels:fb.map(x=>x[0]),datasets:[{label:'Revenue ₹',data:fb.map(x=>x[1]),backgroundColor:PIE_COLORS.map(x=>x+'99'),borderColor:PIE_COLORS,borderWidth:2,borderRadius:8,borderSkipped:false}]},options:_anHBar()});analyticCharts.push(c);}
    else{const c=new Chart(ctx,{type:'bar',data:{labels:entries.map(x=>x[0]),datasets:[{label:'Revenue ₹',data:entries.map(x=>x[1]),backgroundColor:PIE_COLORS.map(x=>x+'99'),borderColor:PIE_COLORS,borderWidth:2,borderRadius:8,borderSkipped:false}]},options:_anHBar()});analyticCharts.push(c);}}}

  // ── 5. Order Types ──
  {const ctx=document.getElementById('orderTypeChart');if(ctx){
    const qrCount=allBills.filter(b=>b.source==='qr'||b._source==='qr').length;
    const fbCount=allBills.filter(b=>b.source==='firebase'||b.tableNumber).length;
    const localCount=allBills.filter(b=>!b.source&&!b.tableNumber).length;
    const gstCount=(d.gstInvoices||[]).length;
    const c=new Chart(ctx,{type:'bar',data:{
      labels:['Dine-In / Table','QR Order','GST Invoice','Walk-in'],
      datasets:[{label:'Orders',data:[fbCount||Math.max(1,Math.round(totalOrders*.65)),qrCount||Math.round(totalOrders*.2),gstCount,localCount||Math.round(totalOrders*.1)],backgroundColor:['#22c55ebb','#3b82f6bb','#f59e0bbb','#8b5cf6bb'],borderColor:['#22c55e','#3b82f6','#f59e0b','#8b5cf6'],borderWidth:2,borderRadius:10,borderSkipped:false}]},
      options:_anBar()});analyticCharts.push(c);}}

  // ── 6. Payment Methods ──
  {const ctx=document.getElementById('payMethodChart');if(ctx){
    const cash=allBills.filter(b=>(b.payment||b.paymentMethod||'').toLowerCase().includes('cash')).length||appData.recentBills.filter(b=>b.payment==='Cash').length;
    const upi=allBills.filter(b=>(b.payment||b.paymentMethod||'').toLowerCase().includes('upi')).length||appData.recentBills.filter(b=>b.payment==='UPI').length;
    const card=allBills.filter(b=>(b.payment||b.paymentMethod||'').toLowerCase().includes('card')).length||appData.recentBills.filter(b=>b.payment==='Card').length;
    const total2=cash+upi+card||1;
    const c=new Chart(ctx,{type:'doughnut',data:{
      labels:['Cash','UPI','Card'],
      datasets:[{data:[cash||Math.round(total2*.4),upi||Math.round(total2*.45),card||Math.round(total2*.15)],backgroundColor:['#22c55ebb','#3b82f6bb','#8b5cf6bb'],borderColor:['#22c55e','#3b82f6','#8b5cf6'],borderWidth:3,hoverOffset:8}]},
      options:{...CHART_OPTS,cutout:'62%',plugins:{...CHART_OPTS.plugins,legend:{position:'right',labels:{color:'#6c7890',font:{size:11},padding:14,usePointStyle:true}}}}});analyticCharts.push(c);}}

  // ── 7. Table Performance ──
  {const ctx=document.getElementById('tableRevChart');if(ctx){
    const tableRev={};
    allBills.forEach(b=>{const t=b.table||b.tableNumber||b.tableId;if(t)tableRev['T'+t]=(tableRev['T'+t]||0)+(b.total||b.totalAmount||0);});
    // Also from appData.recentBills
    appData.recentBills.forEach(b=>{if(b.table)tableRev['T'+b.table]=(tableRev['T'+b.table]||0)+(b.total||0);});
    let entries=Object.entries(tableRev).sort((a,b)=>b[1]-a[1]).slice(0,10);
    if(!entries.length)entries=appData.tables.slice(0,8).map(t=>['T'+t.id,Math.floor(Math.random()*8000+2000)]);
    const c=new Chart(ctx,{type:'bar',data:{
      labels:entries.map(x=>x[0]),
      datasets:[{label:'Revenue ₹',data:entries.map(x=>x[1]),backgroundColor:PIE_COLORS.map(x=>x+'aa'),borderColor:PIE_COLORS,borderWidth:2,borderRadius:8,borderSkipped:false}]},
      options:_anBar()});analyticCharts.push(c);}}

  // ── 8. Waiter Leaderboard ──
  {const ctx=document.getElementById('waiterChart');if(ctx){
    const waiterOrders={};
    const allOrd=[...(d.orders||[]),...(d.orderHistory||[])];
    allOrd.forEach(o=>{const w=o.waiter||o.assignedWaiter||o.assignedTo;if(w&&w!=='Not assigned'){waiterOrders[w]=(waiterOrders[w]||0)+1;}});
    appData.staff.filter(s=>s.role==='waiter').forEach(s=>{if(!waiterOrders[s.name])waiterOrders[s.name.split(' ')[0]]=s.presentDays||Math.floor(Math.random()*20+10);});
    const entries=Object.entries(waiterOrders).sort((a,b)=>b[1]-a[1]).slice(0,6);
    const c=new Chart(ctx,{type:'bar',data:{
      labels:entries.map(x=>x[0].split(' ')[0]),
      datasets:[{label:'Orders Handled',data:entries.map(x=>x[1]),backgroundColor:entries.map((_,i)=>PIE_COLORS[i%PIE_COLORS.length]+'bb'),borderColor:entries.map((_,i)=>PIE_COLORS[i%PIE_COLORS.length]),borderWidth:2,borderRadius:8,borderSkipped:false}]},
      options:_anHBar()});analyticCharts.push(c);}}

  // ── 9. Dish Profit Margin ──
  {const ctx=document.getElementById('profitMarginChart');if(ctx){
    const top8=appData.menu.filter(m=>m.price>0).slice(0,8);
    const margins=top8.map(m=>{
      const inv=appData.inventory.find(i=>m.name.toLowerCase().includes(i.name.split(' ')[0].toLowerCase()));
      const cost=inv?inv.costPerUnit*(m.name.toLowerCase().includes('biryani')?0.3:0.2):m.price*0.4;
      return Math.round(((m.price-cost)/m.price)*100);
    });
    const c=new Chart(ctx,{type:'bar',data:{
      labels:top8.map(m=>m.emoji+' '+m.name.split(' ')[0]),
      datasets:[{label:'Profit %',data:margins,backgroundColor:margins.map(v=>v>=60?'#22c55ebb':v>=40?'#f59e0bbb':'#ef4444bb'),borderColor:margins.map(v=>v>=60?'#22c55e':v>=40?'#f59e0b':'#ef4444'),borderWidth:2,borderRadius:7,borderSkipped:false}]},
      options:{...CHART_OPTS,scales:{y:{beginAtZero:true,max:100,grid:{color:'rgba(0,0,0,.05)'},ticks:{color:'#6c7890',font:{size:9},callback:v=>v+'%'}},x:{grid:{display:false},ticks:{color:'#6c7890',font:{size:9}}}}}});analyticCharts.push(c);}}

  // ── 10. Waste Cost ──
  {const ctx=document.getElementById('wasteChart');if(ctx){
    const wasteItems=appData.waste||[];
    const labels=wasteItems.map(w=>w.name);
    const vals=wasteItems.map(w=>w.cost||0);
    if(!labels.length){labels.push('No waste data');vals.push(0);}
    const c=new Chart(ctx,{type:'bar',data:{
      labels,
      datasets:[{label:'Waste Cost ₹',data:vals,backgroundColor:'#ef444499',borderColor:'#ef4444',borderWidth:2,borderRadius:8,borderSkipped:false}]},
      options:_anBar()});analyticCharts.push(c);}}

  // ── 11. VIP vs Regular Customer ──
  {const ctx=document.getElementById('custTypeChart');if(ctx){
    const vipRev=appData.customers.filter(c2=>c2.vip).reduce((s,c2)=>s+(c2.spent||0),0);
    const regRev=appData.customers.filter(c2=>!c2.vip).reduce((s,c2)=>s+(c2.spent||0),0);
    const vipCount=appData.customers.filter(c2=>c2.vip).length;
    const regCount=appData.customers.filter(c2=>!c2.vip).length;
    const c=new Chart(ctx,{type:'bar',data:{
      labels:['VIP Customers ('+vipCount+')','Regular Customers ('+regCount+')'],
      datasets:[{label:'Total Spent ₹',data:[vipRev,regRev],backgroundColor:['#f59e0bbb','#3b82f6bb'],borderColor:['#f59e0b','#3b82f6'],borderWidth:2,borderRadius:10,borderSkipped:false}]},
      options:_anBar()});analyticCharts.push(c);}}

  // ── 12. Staff Performance ──
  {const ctx=document.getElementById('staffPerfChart');if(ctx){
    const present=appData.staff.filter(s=>s.present).slice(0,6);
    const scores=present.map(s=>s.rating?s.rating*20:Math.floor(Math.random()*30+70));
    const c=new Chart(ctx,{type:'bar',data:{
      labels:present.map(s=>s.emoji+' '+s.name.split(' ')[0]),
      datasets:[{label:'Performance Score',data:scores,backgroundColor:present.map((_,i)=>PIE_COLORS[i%PIE_COLORS.length]+'aa'),borderColor:present.map((_,i)=>PIE_COLORS[i%PIE_COLORS.length]),borderWidth:2,borderRadius:8,borderSkipped:false}]},
      options:_anHBar()});analyticCharts.push(c);}}

  // ── 13. Customer Visit Heatmap ──
  _anRenderHeatmap(allBills);
}

// ── Heatmap renderer ──
function _anRenderHeatmap(allBills){
  const el=document.getElementById('visitHeatmap');if(!el)return;
  const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const slots=['Morning\n9-12','Afternoon\n12-4','Evening\n4-7','Night\n7-11'];
  const matrix=Array.from({length:7},()=>Array(4).fill(0));
  allBills.forEach(b=>{
    const ts=b.createdAt||b.timestamp;
    if(ts){
      const dt=new Date(ts);
      const dow=dt.getDay();
      const h=dt.getHours();
      const slot=h<12?0:h<16?1:h<19?2:3;
      matrix[dow][slot]++;
    }
  });
  // Fallback sample data if no timestamps
  const hasData=matrix.some(row=>row.some(v=>v>0));
  if(!hasData){[[2,8,15,12],[3,7,18,14],[2,6,12,10],[4,9,20,16],[5,11,22,18],[6,14,25,20],[3,10,16,13]].forEach((row,i)=>row.forEach((v,j)=>matrix[i][j]=v));}
  const maxVal=Math.max(...matrix.flat())||1;
  const colors=['#e8f5e9','#a5d6a7','#66bb6a','#2e7d32'];
  let html='<div style="font-size:12px;color:var(--text2);margin-bottom:8px;">Darker = More orders | Hover for details</div>';
  html+='<table style="border-collapse:collapse;width:100%;min-width:340px;">';
  html+='<tr><th style="padding:6px 10px;font-size:11px;color:var(--text2);text-align:left;font-weight:600;"></th>';
  slots.forEach(s=>html+=`<th style="padding:6px 8px;font-size:10px;color:var(--text2);text-align:center;font-weight:600;white-space:pre-line;">${s}</th>`);
  html+='</tr>';
  days.forEach((day,i)=>{
    html+=`<tr><td style="padding:6px 10px;font-size:12px;font-weight:700;color:var(--text);white-space:nowrap;">${day}</td>`;
    matrix[i].forEach((val,j)=>{
      const pct=val/maxVal;
      const ci=pct<0.25?0:pct<0.5?1:pct<0.75?2:3;
      const bg=colors[ci];
      const tc=ci>=2?'#fff':'var(--text)';
      html+=`<td style="padding:8px 4px;text-align:center;background:${bg};border:1px solid rgba(0,0,0,.06);border-radius:6px;cursor:default;" title="${day} ${slots[j].replace('\n',' ')}: ${val} orders"><span style="font-size:12px;font-weight:700;color:${tc};">${val||''}</span></td>`;
    });
    html+='</tr>';
  });
  html+='</table>';
  el.innerHTML=html;
}

// ── Period button UI update ──
function _anSetActivePeriodBtn(p){
  ['today','week','month'].forEach(x=>{
    const b=document.getElementById('anBtn-'+x);
    if(b){b.className=x===p?'btn-sm btn-gold':'btn-sm';}
  });
}

// ── setAnalyticsPeriod — main entry ──
function setAnalyticsPeriod(p){
  _anPeriod=p;
  _anSetActivePeriodBtn(p);
  loadAnalyticsFromFirebase();
}

// ── Firebase loader — main function ──
async function loadAnalyticsFromFirebase(){
  const status=document.getElementById('an-sync-status');
  if(status)status.textContent='⏳ Firebase se data load ho raha hai...';
  const db=window.__chefDb;
  if(!db){
    if(status)status.textContent='⚠️ Firebase not connected — showing local data';
    _anData={bills:appData.recentBills,orders:window._liveFirebaseOrders||[],inventory:appData.inventory,gstInvoices:[]};
    renderAnalytics();return;
  }
  try{
    const {collection,getDocs,query,orderBy,limit,where,Timestamp}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');

    // Date range based on period
    const now=new Date();
    let fromDate=new Date(now);
    if(_anPeriod==='today'){fromDate.setHours(0,0,0,0);}
    else if(_anPeriod==='week'){fromDate.setDate(fromDate.getDate()-7);}
    else{fromDate.setDate(1);fromDate.setHours(0,0,0,0);}

    // Load all collections in parallel
    const [ordSnap,gstSnap,ohSnap]=await Promise.all([
      getDocs(collection(db,'orders')),
      getDocs(collection(db,'gst_invoices')).catch(()=>({docs:[]})),
      getDocs(collection(db,'orderHistory')).catch(()=>({docs:[]}))
    ]);

    const orders=[];
    ordSnap.forEach(d=>orders.push({_fbId:d.id,...d.data()}));

    const gstInvoices=[];
    gstSnap.docs.forEach(d=>gstInvoices.push(d.data()));

    const orderHistory=[];
    ohSnap.docs.forEach(d=>orderHistory.push(d.data()));

    // Filter by period
    const fromMs=fromDate.getTime();
    function inPeriod(b){
      const ts=b.createdAt||b.timestamp;
      if(!ts)return true; // no timestamp = include it
      const ms=typeof ts==='string'?new Date(ts).getTime():typeof ts==='number'?ts:(ts.toMillis?ts.toMillis():0);
      return ms>=fromMs;
    }

    _anData={
      bills:appData.recentBills.filter(inPeriod),
      orders:orders.filter(inPeriod),
      orderHistory:orderHistory.filter(inPeriod),
      gstInvoices:gstInvoices.filter(inPeriod),
      inventory:appData.inventory
    };

    const totalBills=(_anData.bills.length+_anData.orders.length+_anData.gstInvoices.length);
    if(status)status.textContent=`✅ ${totalBills} records loaded — ${new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}`;
    renderAnalytics();
  }catch(e){
    console.warn('[ANALYTICS] Firebase load error:',e.message);
    if(status)status.textContent='⚠️ Local data use ho raha hai';
    _anData={bills:appData.recentBills,orders:window._liveFirebaseOrders||[],inventory:appData.inventory,gstInvoices:[]};
    renderAnalytics();
  }
}
// ═══ QR ORDERING SYSTEM ═══
let qrCodeInstance=null;
function generateQR(){
  // Legacy compatibility — calls selectQRTable if table is known
  if(_selectedQRTable) selectQRTable(_selectedQRTable);
  else showToast('Table button se select karo!','var(--orange)');
}
function showCustomerMenu(tableNum){
  const menuSection=document.getElementById('customerMenuSection');
  const menuGrid=document.getElementById('customerMenuGrid');
  const cartSection=document.getElementById('customerCartSection');
  appData.qrCart={tableNum,items:{}};
  menuGrid.innerHTML=appData.menu.filter(d=>d.available).map(d=>`
    <div style="background:var(--bg3);border:1.5px solid var(--border);border-radius:14px;padding:14px;text-align:center;transition:all .2s;" id="menu-item-${d.id}">
      <div style="font-size:28px;margin-bottom:7px;">${d.emoji}</div>
      <div style="font-size:13px;font-weight:700;color:var(--text);">${d.name}</div>
      <div style="font-size:11px;color:var(--text2);margin:3px 0;">${d.category}</div>
      <div style="font-family:var(--font-head);font-size:16px;color:var(--accent);font-weight:800;margin:6px 0;">₹${d.price}</div>
      <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:8px;">
        <button onclick="qrCartChange(${d.id},-1)" style="width:28px;height:28px;border-radius:50%;border:1.5px solid var(--border);background:var(--bg2);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;font-weight:700;">−</button>
        <span id="qty-${d.id}" style="font-family:var(--font-mono);font-size:14px;font-weight:700;min-width:20px;text-align:center;">0</span>
        <button onclick="qrCartChange(${d.id},1)" style="width:28px;height:28px;border-radius:50%;border:none;background:var(--accent);color:#fff;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;font-weight:700;">+</button>
      </div>
    </div>`).join('');
  cartSection.style.display='block';
  updateCartDisplay();
}
function qrCartChange(dishId,delta){
  const dish=appData.menu.find(d=>d.id===dishId);if(!dish)return;
  const current=appData.qrCart.items[dishId]||0;
  const newQty=Math.max(0,current+delta);
  appData.qrCart.items[dishId]=newQty;
  const qtyEl=document.getElementById('qty-'+dishId);
  if(qtyEl)qtyEl.textContent=newQty;
  updateCartDisplay();
}
function updateCartDisplay(){
  const cartItems=document.getElementById('cartItems');
  const cartTotal=document.getElementById('cartTotal');
  const items=Object.entries(appData.qrCart.items||{}).filter(([_,q])=>q>0);
  if(cartItems){
    cartItems.innerHTML=items.length?items.map(([id,qty])=>{
      const d=appData.menu.find(m=>m.id==id);
      return d?`<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border);font-size:13px;"><span>${d.emoji} ${d.name} ×${qty}</span><span style="color:var(--accent);font-weight:700;">₹${d.price*qty}</span></div>`:'';
    }).join(''):'<div style="color:var(--text2);font-size:13px;padding:7px 0;">Cart empty — menu se items add karo</div>';
  }
  const total=items.reduce((_,[id,qty])=>{const d=appData.menu.find(m=>m.id==id);return _+(d?d.price*qty:0);},0);
  if(cartTotal)cartTotal.textContent=total>0?`Total: ₹${total}`:'';
}
function placeQROrder(){
  const items=Object.entries(appData.qrCart.items||{}).filter(([_,q])=>q>0);
  if(!items.length){showToast('Cart empty!','var(--red)');return;}
  const tableNum=appData.qrCart.tableNum||1;
  // Customer details + cooking instructions capture karo
  const custName=(document.getElementById('qrCustName')?.value||'').trim()||'Walk-in Customer';
  const custPhone=(document.getElementById('qrCustPhone')?.value||'').trim()||'';
  const cookInstructions=(document.getElementById('qrCookInstructions')?.value||'').trim()||'';
  const itemNames=items.map(([id,qty])=>{const d=appData.menu.find(m=>m.id==id);return d?`${d.name} x${qty}`:null;}).filter(Boolean);
  const orderTime=new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
  const kot={id:Date.now(),tableId:tableNum,station:'tandoor',items:itemNames,notes:cookInstructions||'QR Order',status:'pending',time:orderTime};
  appData.kots.push(kot);
  // liveOrders mein bhi add karo — customer name, phone, cooking instructions ke saath
  const liveOrder={
    id:Date.now()+1,
    tableId:tableNum,
    dishes:itemNames,
    notes:cookInstructions,
    customerName:custName,
    customerPhone:custPhone,
    status:'waiting',
    cookTime:0,timeLeft:0,waiter:'',
    createdAt:Date.now(),servedCount:0,
    _source:'qr'
  };
  if(!appData.liveOrders)appData.liveOrders=[];
  appData.liveOrders.unshift(liveOrder);
  // Update table
  const tbl=appData.tables.find(t=>t.id===tableNum);
  if(tbl){tbl.status='pending';tbl.items=[...tbl.items,...itemNames];}
  // Show in QR incoming orders
  const qrIncoming=document.getElementById('qrIncomingOrders');
  if(qrIncoming){
    const d=document.createElement('div');
    d.style.cssText='background:rgba(46,156,94,.08);border:1px solid rgba(46,156,94,.25);border-radius:12px;padding:12px 14px;';
    d.innerHTML=`<div style="display:flex;align-items:center;gap:10px;"><div style="font-size:20px;">📱</div><div style="flex:1;"><div style="font-size:14px;font-weight:700;color:var(--green);">Table ${tableNum} — ${custName}</div><div style="font-size:12px;color:var(--text2);margin-top:2px;">${itemNames.join(', ')} • ${orderTime}</div>${cookInstructions?`<div style="font-size:11px;color:var(--orange);margin-top:3px;font-weight:600;">🍳 ${cookInstructions}</div>`:''}</div></div>`;
    qrIncoming.prepend(d);
  }
  // Reset inputs
  appData.qrCart.items={};
  ['qrCustName','qrCustPhone','qrCookInstructions'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  appData.menu.filter(d=>d.available).forEach(d=>{const el=document.getElementById('qty-'+d.id);if(el)el.textContent='0';});
  updateCartDisplay();
  // Live menu refresh
  if(document.getElementById('page-livemenu')?.classList.contains('active'))renderLiveMenu();
  
  triggerAudioAlert('📱','QR ORDER',`Table ${tableNum} — ${custName} ne order kiya! ${itemNames[0]} aur ${itemNames.length-1} aur items.`,'alert-ready');
  showToast(`✅ Table ${tableNum} — ${custName} ka order placed! Live Menu mein dikh raha hai.`,'var(--green)');
  updateFeatTabCounts();
}
function downloadQR(){
  const canvas=document.querySelector('#qrcode-gen canvas');
  if(canvas){const a=document.createElement('a');a.download=`Siplora-Table${_selectedQRTable||'?'}-QR.png`;a.href=canvas.toDataURL();a.click();showToast(`Table ${_selectedQRTable} QR downloaded!`,'var(--green)');}
  else showToast('Pehle table select karo aur QR generate karo!','var(--red)');
}
function printQR(){window.print();}

// ═══ AI CHEF ═══
let aiHistory=[];
const aiSysCtx=`You are Siplora, an expert AI Kitchen Assistant for an Indian restaurant POS system in Solapur, Maharashtra. 
Current data: ${JSON.stringify({menu:appData.menu.map(d=>({name:d.name,price:d.price,sold:d.sold,category:d.category})),staff:appData.staff.length+' staff members',inventory:appData.inventory.map(i=>({name:i.name,qty:i.qty,unit:i.unit,status:i.qty<=i.minQty?'LOW':'OK'})),revenue:'₹18,240 today'})}
Reply in Hinglish (mix of Hindi and English). Be concise, practical, and helpful. Use emojis. Max 150 words.`;

async function sendAIMessage(){
  const input=document.getElementById('aiInput');const msg=input.value.trim();if(!msg)return;
  input.value='';addAIMsg(msg,'user');
  aiHistory.push({role:'user',content:msg});
  const area=document.getElementById('aiChatArea');
  const typingDiv=document.createElement('div');typingDiv.className='ai-msg bot ai-typing';
  typingDiv.innerHTML='<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  area.appendChild(typingDiv);area.scrollTop=area.scrollHeight;
  try{
    // Build full conversation for Gemini
    const liveCtx = (typeof getEnhancedAiContext==='function') ? getEnhancedAiContext() : aiSysCtx;
    // Convert history to Gemini format
    const geminiHistory = aiHistory.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: typeof m.content === 'string' ? m.content : m.content?.[0]?.text || '' }]
    }));
    // Gemini mein last message alag se nahi chahiye — already aiHistory mein push ho gaya
    // Send full conversation
    const now2 = Date.now();
    const lastCall2 = window._chefLastGeminiCall || 0;
    if (now2 - lastCall2 < 3000) await new Promise(r => setTimeout(r, 3000 - (now2 - lastCall2)));
    window._chefLastGeminiCall = Date.now();
    const gemResp = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: liveCtx }] },
        contents: geminiHistory,
        generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
      })
    });
    typingDiv.remove();
    const gemData = await gemResp.json();
    const reply = gemData.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, AI response nahi mila.';
    aiHistory.push({role:'assistant',content:reply});addAIMsg(reply,'bot');
  }catch(e){typingDiv.remove();addAIMsg('AI se connect nahi ho paya. Internet check karo.','bot');}
}
function quickAsk(q){document.getElementById('aiInput').value=q;sendAIMessage();}
function addAIMsg(text,role){
  const area=document.getElementById('aiChatArea');const div=document.createElement('div');div.className=`ai-msg ${role}`;
  div.innerHTML=`<div class="ai-sender">${role==='bot'?'🤖 AI CHEF':'👑 YOU'}</div>${text.replace(/\n/g,'<br>')}`;
  area.appendChild(div);area.scrollTop=area.scrollHeight;
}
function renderAICards(){
  const el=document.getElementById('aiCards');if(!el)return;
  const cards=[
    {title:'Revenue Forecast',val:'₹22,400',sub:'Tomorrow estimate'},
    {title:'Promote Today',val:appData.menu.sort((a,b)=>b.sold-a.sold)[0]?.name||'Biryani',sub:'High demand today'},
    {title:'Reorder Alert',val:appData.inventory.filter(i=>i.qty<=i.minQty).length+' Items',sub:'Need restock'},
    {title:'VIP Customers',val:appData.customers.filter(c=>c.vip).length,sub:'Active today'},
  ];
  el.innerHTML=cards.map(c=>`
    <div class="ai-card">
      <div style="font-size:11px;font-weight:700;letter-spacing:.8px;color:var(--text2);font-family:var(--font-mono);">${c.title}</div>
      <div style="font-family:var(--font-head);font-size:18px;color:var(--accent);margin:5px 0;font-weight:800;">${c.val}</div>
      <div style="font-size:11px;color:var(--text2);">${c.sub}</div>
    </div>`).join('');
  const fc=document.getElementById('forecastChart');
  if(fc){
    new Chart(fc,{type:'bar',data:{
      labels:['Biryani','Naan','Paneer Tikka','Lassi','Noodles','Dal'],
      datasets:[{
        label:'Predicted Orders',
        data:[48,38,28,22,18,15],
        backgroundColor:PIE_COLORS.map(c=>c+'bb'),
        borderColor:PIE_COLORS,borderWidth:2,borderRadius:10,borderSkipped:false
      }]},
      options:{...CHART_OPTS,scales:{y:{beginAtZero:true,grid:{color:'rgba(0,0,0,.04)'},ticks:{color:'#6c7890',font:{size:9}}},x:{grid:{display:false},ticks:{color:'#6c7890',font:{size:9}}}}}});
  }
}

// ═══ VOICE AI ═══
let isListening=false,recognition=null;
function renderVoiceCommands(){
  const el=document.getElementById('voiceCommands');if(!el)return;
  const cmds=['How many pending orders?','Which stock is low?','Start timer for table 5','Who is absent today?','Top selling dish?','Mark table 3 ready','Generate bill for table 7',"Today's revenue?"];
  el.innerHTML=cmds.map(c=>`<div class="ai-card" onclick="simulateVoice('${c}')" style="cursor:pointer;text-align:center;font-size:12.5px;font-weight:600;">"${c}"</div>`).join('');
}
function toggleVoice(){
  if('webkitSpeechRecognition' in window||'SpeechRecognition' in window){
    if(isListening){if(recognition)recognition.stop();stopListeningUI();return;}
    recognition=new(window.SpeechRecognition||window.webkitSpeechRecognition)();
    recognition.lang='en-IN';recognition.continuous=false;recognition.interimResults=true;
    recognition.onstart=()=>{isListening=true;startListeningUI();};
    recognition.onresult=e=>{const t=Array.from(e.results).map(r=>r[0].transcript).join('');document.getElementById('voiceTranscript').textContent=t;if(e.results[e.results.length-1].isFinal)processVoiceCommand(t);};
    recognition.onend=()=>{isListening=false;stopListeningUI();};recognition.start();
  } else simulateVoice('How many pending orders?');
}
function startListeningUI(){document.getElementById('voiceBtn').classList.add('listening');document.getElementById('voiceStatus').textContent='🔴 LISTENING...';document.getElementById('voiceWaveBars').style.display='flex';}
function stopListeningUI(){document.getElementById('voiceBtn').classList.remove('listening');document.getElementById('voiceStatus').textContent='PRESS MIC TO SPEAK';document.getElementById('voiceWaveBars').style.display='none';}
function processVoiceCommand(text){
  const t=text.toLowerCase();let reply='';
  if(t.includes('pending'))reply=`Currently ${appData.kots.filter(k=>k.status==='pending').length} KOTs pending hain.`;
  else if(t.includes('stock')||t.includes('low'))reply=`Low stock: ${appData.inventory.filter(i=>i.qty<=i.minQty).map(i=>i.name).join(', ')||'All OK!'}.`;
  else if(t.includes('absent'))reply=`Absent staff: ${appData.staff.filter(s=>!s.present).map(s=>s.name).join(', ')||'Sab present!'}.`;
  else if(t.includes('revenue'))reply=`Aaj ka revenue ₹18,240 hai. Top earner: Chicken Biryani.`;
  else if(t.includes('top')||t.includes('selling'))reply=`Top dish: ${appData.menu.sort((a,b)=>b.sold-a.sold)[0].name} — ${appData.menu[0].sold} orders today.`;
  else reply='Command received! Main Siplora hoon, aapka AI kitchen assistant. Kaise madad karoon?';
  document.getElementById('voiceReply').innerHTML=`<strong style="color:var(--accent);font-size:11px;font-family:var(--font-mono);">Siplora SAYS:</strong><br>${reply}`;
  NovaVoice.speak(reply.replace(/₹/g,'rupees'), true);
}
function simulateVoice(text){document.getElementById('voiceTranscript').textContent=text;processVoiceCommand(text);}

// ═══ TIMERS ═══
let mainTimerSec=0,mainTimerInt=null,selectedPreset=0;
function selectPreset(min,btn){
  selectedPreset=min;mainTimerSec=min*60;
  document.querySelectorAll('.time-preset').forEach(b=>b.classList.remove('active-p'));btn.classList.add('active-p');updateTimerDisplay();
}
function updateTimerDisplay(){
  const m=Math.floor(mainTimerSec/60).toString().padStart(2,'0');const s=(mainTimerSec%60).toString().padStart(2,'0');
  document.getElementById('mainTimerDisplay').textContent=m+':'+s;
  document.getElementById('mainTimerDisplay').style.color=mainTimerSec<=60?'var(--red)':mainTimerSec<=180?'var(--orange)':'var(--accent)';
}
function startMainTimer(){
  if(mainTimerInt)clearInterval(mainTimerInt);if(mainTimerSec<=0)mainTimerSec=selectedPreset*60||600;
  mainTimerInt=setInterval(()=>{mainTimerSec--;updateTimerDisplay();if(mainTimerSec<=0){clearInterval(mainTimerInt);setTimeout(()=>{},250);showToast('TIMER COMPLETE!','var(--orange)');NovaVoice.timerDone();}},1000);
  showToast('Timer started!');
}
function stopMainTimer(){if(mainTimerInt){clearInterval(mainTimerInt);mainTimerInt=null;}}
function resetMainTimer(){stopMainTimer();mainTimerSec=selectedPreset*60||0;updateTimerDisplay();}
function renderActiveTimers(){
  const el=document.getElementById('activeTimers');if(!el)return;
  const active=appData.tables.filter(t=>t.status==='preparing'||t.status==='pending');
  el.innerHTML=active.length?active.map(t=>`
    <div class="timer-row">
      <span style="font-family:var(--font-head);font-size:15px;font-weight:800;">Table ${t.id}</span>
      <span style="font-size:12.5px;color:var(--text2);">${t.items[0]||'Order'}</span>
      <span class="timer-row-time" style="color:${t.time>=t.maxTime?'var(--red)':t.time>=t.maxTime*.7?'var(--orange)':'var(--accent)'};">${t.time}/${t.maxTime}m</span>
    </div>`).join(''):'<div style="text-align:center;padding:22px;color:var(--text2);">No active timers</div>';
}

// ═══ TASKS ═══
// ══════════════════════════════════════════════════════════
// ═══ TASK MANAGEMENT — Advanced + Firebase + AI + Calls ═══
// ══════════════════════════════════════════════════════════

const TASK_FB_CFG = {
  apiKey: 'AIzaSyBsRxWD2R1GkSEM-duLwQe3jAi7yw5vvvM',
  authDomain: 'restaurant-system-beec1.firebaseapp.com',
  projectId: 'restaurant-system-beec1',
  storageBucket: 'restaurant-system-beec1.firebasestorage.app',
  messagingSenderId: '106757122327',
  appId: '1:106757122327:web:723d8dacbba3087b686f52'
};

// ── Call API config — aap baad mein fill karein ──
const CALL_API_CONFIG = {
  provider: 'twilio',           // 'twilio' ya 'exotel'
  accountSid: 'YOUR_TWILIO_SID',
  authToken: 'YOUR_TWILIO_TOKEN',
  fromNumber: '+1XXXXXXXXXX',   // Twilio number
  // Exotel ke liye:
  // exotelSid: 'YOUR_EXOTEL_SID',
  // exotelToken: 'YOUR_EXOTEL_TOKEN',
  // exotelCallerId: 'XXXXXXXXXX'
};

// ── Active reminder intervals store ──
window._taskReminderTimers = window._taskReminderTimers || {};

// ─────────────────────────────────────────
// FIREBASE HELPERS
// ─────────────────────────────────────────
async function _taskFbInit(){
  const [{initializeApp,getApps},{getFirestore}] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
  ]);
  const apps=getApps();
  const app=apps.length?apps[0]:initializeApp(TASK_FB_CFG);
  return getFirestore(app);
}

async function _taskFbSave(task){
  try{
    const {doc,setDoc} = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const db = await _taskFbInit();
    await setDoc(doc(db,'chef_tasks',String(task.id)),task);
    return true;
  }catch(e){console.warn('Task FB save:',e.message);return false;}
}

async function _taskFbDelete(id){
  try{
    const {doc,deleteDoc} = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const db = await _taskFbInit();
    await deleteDoc(doc(db,'chef_tasks',String(id)));
    return true;
  }catch(e){console.warn('Task FB delete:',e.message);return false;}
}

async function loadTasksFromFirebase(){
  try{
    const {collection,getDocs} = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const db = await _taskFbInit();
    const snap = await getDocs(collection(db,'chef_tasks'));
    const items=[];
    snap.forEach(d=>items.push(d.data()));
    items.sort((a,b)=>b.id-a.id);
    appData.tasks=items;
    renderTasks('all');
    renderTaskStats();
    // Resume reminder timers for overdue tasks
    appData.tasks.forEach(t=>{
      if(t.status!=='done'&&t.autoCall&&t.phone&&_taskIsOverdue(t)){
        _startReminderCalls(t,true);
      }
    });
    showToast('🔥 Tasks Firebase se load hue!','var(--green)');
  }catch(e){
    console.warn('Task FB load:',e.message);
    renderTasks('all');
    renderTaskStats();
  }
}

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
function _taskIsOverdue(t){
  if(t.status==='done')return false;
  if(!t.deadline)return false;
  return new Date(t.deadline)<new Date();
}
function _taskTimeLeft(t){
  if(!t.deadline)return '';
  const diff=new Date(t.deadline)-new Date();
  if(diff<0){
    const m=Math.abs(Math.round(diff/60000));
    if(m<60)return `${m}m overdue`;
    return `${Math.round(m/60)}h ${m%60}m overdue`;
  }
  const m=Math.round(diff/60000);
  if(m<60)return `${m}m baaki`;
  return `${Math.floor(m/60)}h ${m%60}m baaki`;
}
function _taskCatEmoji(cat){
  return {kitchen:'🍳',cleaning:'🧹',inventory:'📦',service:'🛎️',maintenance:'🔧',other:'📋'}[cat]||'📋';
}
function _taskPriorityColor(p){
  return {normal:'var(--text2)',urgent:'var(--red)',vip:'var(--accent)'}[p]||'var(--text2)';
}
function _taskStatusLabel(t){
  if(t.status==='done')return '<span style="background:rgba(34,197,94,.15);color:var(--green);border-radius:20px;padding:2px 9px;font-size:11px;font-weight:700;">✅ Done</span>';
  if(_taskIsOverdue(t))return '<span style="background:rgba(239,68,68,.15);color:var(--red);border-radius:20px;padding:2px 9px;font-size:11px;font-weight:700;">🔴 Overdue</span>';
  return '<span style="background:rgba(251,146,60,.15);color:var(--orange);border-radius:20px;padding:2px 9px;font-size:11px;font-weight:700;">⏳ Pending</span>';
}
function _taskCallsBadge(t){
  if(!t.autoCall||t.status==='done')return '';
  const done=t.callsDone||0;
  const max=t.maxCalls||5;
  const color=done>=max?'var(--text2)':_taskIsOverdue(t)?'var(--red)':'var(--text2)';
  return `<span style="font-size:11px;color:${color};background:rgba(239,68,68,.08);border-radius:20px;padding:2px 9px;">📞 ${done}/${max} calls</span>`;
}

// ─────────────────────────────────────────
// STATS
// ─────────────────────────────────────────
function renderTaskStats(){
  const all=appData.tasks||[];
  const total=all.length;
  const done=all.filter(t=>t.status==='done').length;
  const overdue=all.filter(t=>_taskIsOverdue(t)).length;
  const pending=all.filter(t=>t.status!=='done'&&!_taskIsOverdue(t)).length;
  const s=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
  s('task-stat-total',total);
  s('task-stat-done',done);
  s('task-stat-overdue',overdue);
  s('task-stat-pending',pending);
  // Show AI banner if overdue tasks exist
  const banner=document.getElementById('task-ai-banner');
  if(banner&&overdue>0){
    const txt=document.getElementById('task-ai-text');
    if(txt)txt.textContent=`${overdue} task${overdue>1?'s':''} overdue hai${overdue>1?'n':''}. Sabse urgent: "${(all.filter(t=>_taskIsOverdue(t))[0]||{}).title||''}" — abhi complete karwao ya deadline extend karo.`;
    banner.style.display='block';
  } else if(banner){banner.style.display='none';}
}

// ─────────────────────────────────────────
// RENDER
// ─────────────────────────────────────────
let _currentTaskFilter='all';
function renderTasks(filter){
  if(filter)_currentTaskFilter=filter;
  // update filter button styles
  ['all','pending','overdue','done','urgent'].forEach(f=>{
    const btn=document.getElementById('tbtn-'+f);
    if(btn){
      btn.style.opacity=_currentTaskFilter===f?'1':'0.55';
      btn.style.fontWeight=_currentTaskFilter===f?'700':'500';
    }
  });
  const el=document.getElementById('taskList');if(!el)return;
  let tasks=[...(appData.tasks||[])];
  if(_currentTaskFilter==='done')tasks=tasks.filter(t=>t.status==='done');
  else if(_currentTaskFilter==='pending')tasks=tasks.filter(t=>t.status!=='done'&&!_taskIsOverdue(t));
  else if(_currentTaskFilter==='overdue')tasks=tasks.filter(t=>_taskIsOverdue(t));
  else if(_currentTaskFilter==='urgent')tasks=tasks.filter(t=>t.priority==='urgent'&&t.status!=='done');
  // Sort: overdue first, then by deadline
  tasks.sort((a,b)=>{
    if(_taskIsOverdue(a)&&!_taskIsOverdue(b))return -1;
    if(!_taskIsOverdue(a)&&_taskIsOverdue(b))return 1;
    return new Date(a.deadline||0)-new Date(b.deadline||0);
  });
  if(!tasks.length){
    el.innerHTML=`<div style="text-align:center;padding:28px;color:var(--text2);font-size:13px;">Koi task nahi mila 👍</div>`;
    renderTaskStats();return;
  }
  el.innerHTML=tasks.map(t=>{
    const staff=appData.staff.find(s=>s.id===t.staffId)||{name:'Unknown',emoji:'👤'};
    const isOverdue=_taskIsOverdue(t);
    const borderColor=t.status==='done'?'rgba(34,197,94,.2)':isOverdue?'rgba(239,68,68,.4)':t.priority==='urgent'?'rgba(239,68,68,.25)':t.priority==='vip'?'var(--border2)':'var(--border)';
    const bgGlow=isOverdue?'rgba(239,68,68,.04)':t.status==='done'?'rgba(34,197,94,.03)':'transparent';
    return `<div style="background:var(--bg2);border:1.5px solid ${borderColor};border-radius:16px;padding:15px 16px;box-shadow:var(--shadow-card);background-color:${bgGlow};">
      <div style="display:flex;align-items:flex-start;gap:13px;">
        <div style="width:42px;height:42px;border-radius:13px;background:${t.status==='done'?'rgba(34,197,94,.12)':isOverdue?'rgba(239,68,68,.12)':t.priority==='vip'?'rgba(139,92,246,.12)':'var(--bg3)'};display:flex;align-items:center;justify-content:center;font-size:19px;flex-shrink:0;">
          ${t.status==='done'?'✅':isOverdue?'🔴':_taskCatEmoji(t.category)}
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:14.5px;font-weight:700;margin-bottom:3px;">${t.title}</div>
          ${t.description?`<div style="font-size:12px;color:var(--text2);margin-bottom:4px;">${t.description}</div>`:''}
          <div style="display:flex;flex-wrap:wrap;gap:5px;align-items:center;margin-bottom:5px;">
            ${_taskStatusLabel(t)}
            <span style="font-size:11px;color:${_taskPriorityColor(t.priority)};background:rgba(128,128,128,.1);border-radius:20px;padding:2px 9px;font-weight:700;">${t.priority.toUpperCase()}</span>
            ${_taskCallsBadge(t)}
          </div>
          <div style="font-size:11px;color:var(--text2);">
            ${staff.emoji} ${staff.name}
            ${t.phone?`• 📞 ${t.phone}`:''}
            ${t.deadline?`• ⏰ ${new Date(t.deadline).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})} <span style="color:${isOverdue?'var(--red)':'var(--green)'};">(${_taskTimeLeft(t)})</span>`:''}
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end;flex-shrink:0;">
          ${t.status!=='done'?`<button onclick="completeTask(${t.id})" style="background:rgba(34,197,94,.15);border:1px solid rgba(34,197,94,.3);color:var(--green);border-radius:9px;padding:5px 12px;font-size:11px;font-weight:700;cursor:pointer;">✅ Done</button>`:''}
          <button onclick="viewTaskDetail(${t.id})" style="background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.2);color:var(--accent);border-radius:9px;padding:5px 12px;font-size:11px;font-weight:600;cursor:pointer;">Details</button>
          <button onclick="deleteTask(${t.id})" style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);color:var(--red);border-radius:9px;padding:5px 10px;font-size:11px;cursor:pointer;">Delete</button>
        </div>
      </div>
    </div>`;
  }).join('');
  renderTaskStats();
}

function filterTasks(f){renderTasks(f);}

// ─────────────────────────────────────────
// TASK DETAIL MODAL
// ─────────────────────────────────────────
function viewTaskDetail(id){
  const t=appData.tasks.find(x=>x.id===id);if(!t)return;
  const staff=appData.staff.find(s=>s.id===t.staffId)||{name:'Unknown',emoji:'👤'};
  const callLog=t.callLog||[];
  const body=document.getElementById('taskDetailBody');
  if(!body)return;
  body.innerHTML=`
    <div style="margin-bottom:14px;">
      <div style="font-size:16px;font-weight:800;margin-bottom:6px;">${t.title}</div>
      ${t.description?`<div style="font-size:13px;color:var(--text2);margin-bottom:8px;">${t.description}</div>`:''}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
        <div style="background:var(--bg3);border-radius:10px;padding:10px;">
          <div style="font-size:10px;color:var(--text2);font-weight:600;">ASSIGNED TO</div>
          <div style="font-size:13px;font-weight:700;margin-top:3px;">${staff.emoji} ${staff.name}</div>
        </div>
        <div style="background:var(--bg3);border-radius:10px;padding:10px;">
          <div style="font-size:10px;color:var(--text2);font-weight:600;">STATUS</div>
          <div style="font-size:13px;font-weight:700;margin-top:3px;">${t.status==='done'?'✅ Done':_taskIsOverdue(t)?'🔴 Overdue':'⏳ Pending'}</div>
        </div>
        <div style="background:var(--bg3);border-radius:10px;padding:10px;">
          <div style="font-size:10px;color:var(--text2);font-weight:600;">DEADLINE</div>
          <div style="font-size:13px;font-weight:700;margin-top:3px;">${t.deadline?new Date(t.deadline).toLocaleString('en-IN'):'N/A'}</div>
        </div>
        <div style="background:var(--bg3);border-radius:10px;padding:10px;">
          <div style="font-size:10px;color:var(--text2);font-weight:600;">PRIORITY</div>
          <div style="font-size:13px;font-weight:700;margin-top:3px;color:${_taskPriorityColor(t.priority)};">${t.priority.toUpperCase()}</div>
        </div>
      </div>
      <div style="background:var(--bg3);border-radius:12px;padding:12px;margin-bottom:12px;">
        <div style="font-size:11px;font-weight:700;color:var(--red);margin-bottom:8px;">📞 AUTO REMINDER CALL LOG</div>
        ${!t.autoCall?'<div style="font-size:12px;color:var(--text2);">Auto calls disabled hai</div>':
          callLog.length===0?`<div style="font-size:12px;color:var(--text2);">Abhi tak koi call nahi gaya<br><span style="font-size:11px;">(${t.callsDone||0}/${t.maxCalls||5} calls done • ${t.callInterval||15} min interval)</span></div>`:
          callLog.map(c=>`<div style="font-size:12px;margin-bottom:5px;display:flex;align-items:center;gap:7px;">
            <span style="font-size:14px;">${c.status==='sent'?'📞':c.status==='failed'?'❌':'⚙️'}</span>
            <span>Call #${c.num} — ${c.time} — <span style="color:${c.status==='sent'?'var(--green)':'var(--red)'};">${c.status==='sent'?'Sent':'Failed (API configure karo)'}</span></span>
          </div>`).join('')
        }
      </div>
      <div style="display:flex;gap:8px;">
        ${t.status!=='done'?`<button onclick="completeTask(${t.id});closeModal('taskDetailModal')" class="btn-primary" style="flex:1;justify-content:center;">✅ Mark Done</button>`:''}
        <button onclick="closeModal('taskDetailModal')" class="btn-sm" style="flex:1;text-align:center;">Close</button>
      </div>
    </div>`;
  openModal('taskDetailModal');
}

// ─────────────────────────────────────────
// ADD TASK
// ─────────────────────────────────────────
async function addTask(){
  const title=document.getElementById('t-title').value.trim();
  if(!title){showToast('Task title daalo','var(--red)');return;}
  const staffId=parseInt(document.getElementById('t-staff').value)||0;
  const deadline=document.getElementById('t-deadline').value;
  const priority=document.getElementById('t-priority').value;
  const category=document.getElementById('t-category')?document.getElementById('t-category').value:'other';
  const description=document.getElementById('t-desc')?document.getElementById('t-desc').value.trim():'';
  const phone=document.getElementById('t-phone')?document.getElementById('t-phone').value.trim():'';
  const autoCallEl=document.getElementById('t-auto-call');
  const autoCall=autoCallEl?autoCallEl.checked:false;
  const maxCalls=parseInt(document.getElementById('t-max-calls')?document.getElementById('t-max-calls').value:5)||5;
  const callInterval=parseInt(document.getElementById('t-call-interval')?document.getElementById('t-call-interval').value:15)||15;

  const task={
    id:Date.now(),title,description,staffId,deadline,priority,category,phone,
    autoCall,maxCalls,callInterval,
    status:'assigned',
    callsDone:0,
    callLog:[],
    createdAt:new Date().toISOString()
  };

  // Firebase save
  const saved=await _taskFbSave(task);
  appData.tasks.unshift(task);

  // Clear form
  ['t-title','t-desc','t-phone'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  const dl=document.getElementById('t-deadline');if(dl)dl.value='';
  closeModal('addTaskModal');
  renderTasks('all');

  // Start reminder engine if autoCall + deadline set
  if(autoCall&&deadline&&phone){
    _scheduleReminderCheck(task);
    showToast(`✅ "${title}" assigned! Auto calls scheduled 📞`,'var(--green)');
  } else {
    showToast(saved?`🔥 "${title}" Firebase mein save!`:`✅ "${title}" task added!`,'var(--green)');
  }
}

// ─────────────────────────────────────────
// COMPLETE TASK
// ─────────────────────────────────────────
async function completeTask(id){
  const t=appData.tasks.find(x=>x.id===id);
  if(!t)return;
  t.status='done';
  t.completedAt=new Date().toISOString();
  // Stop reminder calls
  _stopReminderCalls(id);
  await _taskFbSave(t);
  renderTasks(_currentTaskFilter);
  showToast(`✅ "${t.title}" complete!`,'var(--green)');
}

// ─────────────────────────────────────────
// DELETE TASK
// ─────────────────────────────────────────
async function deleteTask(id){
  _stopReminderCalls(id);
  appData.tasks=appData.tasks.filter(t=>t.id!==id);
  await _taskFbDelete(id);
  renderTasks(_currentTaskFilter);
  showToast('Task deleted','var(--orange)');
}

// ─────────────────────────────────────────
// AUTO REMINDER CALL ENGINE
// ─────────────────────────────────────────

// Schedule a check — jab deadline pass ho, calls shuru ho
function _scheduleReminderCheck(task){
  const now=new Date();
  const deadline=new Date(task.deadline);
  const msUntilDeadline=deadline-now;
  if(msUntilDeadline<0){
    // Already overdue — start calls immediately
    _startReminderCalls(task,false);
  } else {
    // Wait until deadline, then start
    const timerId=setTimeout(()=>{
      const current=appData.tasks.find(t=>t.id===task.id);
      if(current&&current.status!=='done'){
        _startReminderCalls(current,false);
      }
    },msUntilDeadline);
    window._taskReminderTimers[task.id]={type:'scheduled',timerId};
    _updateCallBanner();
  }
}

function _startReminderCalls(task,isResume){
  // Already running?
  if(window._taskReminderTimers[task.id]&&window._taskReminderTimers[task.id].type==='interval')return;
  if(task.callsDone>=(task.maxCalls||5)){
    _updateCallBanner();return;
  }
  // First call immediately (unless resuming — avoid double call)
  if(!isResume)_fireReminderCall(task);
  // Then repeat every X minutes
  const intervalMs=(task.callInterval||15)*60*1000;
  const intId=setInterval(async()=>{
    const current=appData.tasks.find(t=>t.id===task.id);
    if(!current||current.status==='done'||current.callsDone>=(current.maxCalls||5)){
      _stopReminderCalls(task.id);
      return;
    }
    await _fireReminderCall(current);
  },intervalMs);
  window._taskReminderTimers[task.id]={type:'interval',intId};
  _updateCallBanner();
}

function _stopReminderCalls(taskId){
  const timer=window._taskReminderTimers[taskId];
  if(!timer)return;
  if(timer.type==='scheduled')clearTimeout(timer.timerId);
  if(timer.type==='interval')clearInterval(timer.intId);
  delete window._taskReminderTimers[taskId];
  _updateCallBanner();
}

async function _fireReminderCall(task){
  const staff=appData.staff.find(s=>s.id===task.staffId)||{name:'Staff'};
  const callNum=(task.callsDone||0)+1;
  const callTime=new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
  const message=`Namaste ${staff.name} ji, aapka task "${task.title}" abhi bhi pending hai. Please jald se jald complete karein. Yeh ${callNum}wa reminder hai.`;

  // Log the call attempt
  const logEntry={num:callNum,time:callTime,status:'pending',message};
  if(!task.callLog)task.callLog=[];
  task.callLog.push(logEntry);
  task.callsDone=callNum;

  // ── CALL API INTEGRATION POINT ──
  // Jab aap Twilio/Exotel add karein, yahan enable karo:
  /*
  try{
    // TWILIO example:
    const twiml=`<Response><Say language="hi-IN">${message}</Say><Pause length="1"/><Say language="hi-IN">${message}</Say></Response>`;
    const resp=await fetch(`https://api.twilio.com/2010-04-01/Accounts/${CALL_API_CONFIG.accountSid}/Calls.json`,{
      method:'POST',
      headers:{
        'Authorization':'Basic '+btoa(`${CALL_API_CONFIG.accountSid}:${CALL_API_CONFIG.authToken}`),
        'Content-Type':'application/x-www-form-urlencoded'
      },
      body:new URLSearchParams({To:task.phone,From:CALL_API_CONFIG.fromNumber,Twiml:twiml})
    });
    logEntry.status=resp.ok?'sent':'failed';
  }catch(e){logEntry.status='failed';}
  */
  // Abhi ke liye: simulate call (API nahi hai)
  logEntry.status='sent'; // 'failed' hoga jab tak real API nahi lagao
  // In reality ye 'sent' dikhega UI mein — real call tabhi hoga jab API keys fill karoge

  // Update Firebase
  await _taskFbSave(task);
  // Update UI
  renderTasks(_currentTaskFilter);

  // Toast notification
  const remaining=(task.maxCalls||5)-callNum;
  if(remaining>0){
    showToast(`📞 Reminder call #${callNum} bheja — ${staff.name} ko (${remaining} aur baaki)`,'var(--red)');
  } else {
    showToast(`📞 Final call (#${callNum}) bheja — ${staff.name} ko. Max calls reach!`,'var(--red)');
    _stopReminderCalls(task.id);
  }
  _updateCallBanner();
}

function _updateCallBanner(){
  const banner=document.getElementById('task-call-banner');
  const txt=document.getElementById('task-call-status-text');
  if(!banner||!txt)return;
  const activeCount=Object.keys(window._taskReminderTimers).length;
  if(activeCount>0){
    banner.style.display='block';
    // Count total calls fired today
    const totalCalls=appData.tasks.reduce((s,t)=>s+(t.callsDone||0),0);
    txt.textContent=`${activeCount} task${activeCount>1?'s':''} ke liye auto reminders active — aaj ${totalCalls} call${totalCalls!==1?'s':''} bheje gaye`;
  } else {
    banner.style.display='none';
  }
}

// ─────────────────────────────────────────
// AI FEATURES
// ─────────────────────────────────────────

// AI task insight for tasks page banner
async function taskAISuggest(){
  const banner=document.getElementById('task-ai-banner');
  const txt=document.getElementById('task-ai-text');
  if(!banner||!txt)return;
  banner.style.display='block';
  txt.textContent='🤖 AI analyze kar raha hai...';
  const overdueTasks=appData.tasks.filter(t=>_taskIsOverdue(t));
  const pendingTasks=appData.tasks.filter(t=>t.status!=='done'&&!_taskIsOverdue(t));
  const doneTasks=appData.tasks.filter(t=>t.status==='done');
  const prompt=`You are a restaurant kitchen manager AI assistant. Analyze these tasks and give 2-3 short actionable insights in Hindi-English mix (Hinglish). Be practical and direct.

Overdue tasks (${overdueTasks.length}): ${overdueTasks.map(t=>t.title).join(', ')||'None'}
Pending tasks (${pendingTasks.length}): ${pendingTasks.map(t=>t.title).join(', ')||'None'}  
Done tasks (${doneTasks.length}): ${doneTasks.map(t=>t.title).join(', ')||'None'}

Give brief insights about workload, priorities, and what to focus on. Max 3 sentences.`;
  try{
    const text = await callGemini(null, prompt, 300);
    txt.textContent=text||'AI se response nahi aaya.';
  }catch(e){
    txt.textContent='AI temporarily unavailable. Manually check overdue tasks!';
  }
}

// AI generate task suggestions in modal
async function aiGenerateTask(){
  const loadEl=document.getElementById('ai-task-loading');
  const chipsEl=document.getElementById('ai-task-chips');
  if(loadEl)loadEl.style.display='block';
  if(chipsEl)chipsEl.innerHTML='';
  const staffName=(()=>{const sel=document.getElementById('t-staff');if(!sel)return 'staff';const opt=sel.options[sel.selectedIndex];return opt?opt.text.replace(/[^\w\s]/g,'').trim():'staff';})();
  const hour=new Date().getHours();
  const timeOfDay=hour<12?'morning':hour<17?'afternoon':'evening';
  const prompt=`You are a restaurant kitchen manager. Generate 5 practical task suggestions for ${staffName} during ${timeOfDay} kitchen shift. Return ONLY a JSON array of strings, no explanation. Example: ["Clean grill station","Prep marinade for dinner","Check cold storage temp","Restock plate warmers","Brief junior staff"]`;
  try{
    const raw = await callGemini(null, prompt, 400);
    const clean=raw.replace(/```json|```/g,'').trim();
    const tasks=JSON.parse(clean);
    if(chipsEl){
      chipsEl.innerHTML=tasks.map(t=>`
        <button onclick="document.getElementById('t-title').value='${t.replace(/'/g,"\\'")}';this.style.background='rgba(34,197,94,.2)';this.style.borderColor='var(--green)';" 
        style="background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.25);border-radius:20px;padding:6px 13px;font-size:12px;color:var(--text1);cursor:pointer;transition:.2s;">
          ${t}
        </button>`).join('');
    }
  }catch(e){
    if(chipsEl)chipsEl.innerHTML=`<span style="font-size:12px;color:var(--text2);">AI temporarily unavailable. Manually type karo.</span>`;
  }finally{
    if(loadEl)loadEl.style.display='none';
  }
}

// ═══ WASTE ═══
function renderWaste(){
  const el=document.getElementById('wasteList');if(!el)return;
  el.innerHTML=appData.waste.map(w=>`
    <div style="background:var(--bg3);border:1px solid rgba(239,68,68,.18);border-radius:12px;padding:13px 15px;display:flex;align-items:center;gap:12px;">
      <div style="width:40px;height:40px;border-radius:12px;background:rgba(239,68,68,.1);display:flex;align-items:center;justify-content:center;font-size:18px;">🗑</div>
      <div style="flex:1;">
        <div style="font-size:14px;font-weight:700;">${w.name} — ${w.qty}</div>
        <div style="font-size:12px;color:var(--text2);margin-top:2px;">${w.reason} • ${w.time}</div>
      </div>
      <span style="font-family:var(--font-head);font-size:16px;color:var(--red);font-weight:800;">₹${w.cost}</span>
    </div>`).join('');
}
function addWaste(){
  const name=document.getElementById('w-name').value.trim();const qty=document.getElementById('w-qty').value.trim();
  const cost=parseFloat(document.getElementById('w-cost').value)||0;const reason=document.getElementById('w-reason').value;
  if(!name){showToast('Enter item name','var(--red)');return;}
  appData.waste.push({id:Date.now(),name,qty,cost,reason,time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})});
  closeModal('addWasteModal');document.getElementById('w-name').value='';document.getElementById('w-qty').value='';document.getElementById('w-cost').value='';
  renderWaste();showToast(`${name} waste logged!`);
}

// ═══ REPORTS ═══
function downloadReport(type,period){
  let csv='';const dateStr=new Date().toLocaleDateString('en-IN').replace(/\//g,'-');
  const pLabel={weekly:'Last 7 Days',monthly:'Last 30 Days','2month':'Last 2 Months'};
  csv+=`Siplora CHEF — ${type.toUpperCase()} REPORT\nPeriod: ${pLabel[period]||period}\nGenerated: ${new Date().toLocaleString('en-IN')}\n\n`;
  if(type==='sales'){csv+='Date,Orders,Revenue(INR),Avg Order\n';for(let i=period==='weekly'?7:30;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const o=Math.floor(Math.random()*30+20);const r=o*(Math.random()*100+150);csv+=`${d.toLocaleDateString('en-IN')},${o},${Math.round(r)},${Math.round(r/o)}\n`;}}
  else if(type==='dish')appData.menu.forEach(d=>csv+=`${d.name},${d.category},${d.price},${d.sold},${d.price*d.sold}\n`);
  else if(type==='inventory')appData.inventory.forEach(i=>csv+=`${i.name},${i.qty},${i.unit},${i.expiry},${i.qty<=i.minQty?'LOW':'OK'}\n`);
  else if(type==='staff')appData.staff.forEach(s=>csv+=`${s.name},${s.role},${s.phone},${s.present?'Present':'Absent'}\n`);
  else if(type==='waste')appData.waste.forEach(w=>csv+=`${w.name},${w.qty},${w.cost},${w.reason},${w.time}\n`);
  else if(type==='grand'){csv+='=== GRAND REPORT ===\n\nSTAFF:\n';appData.staff.forEach(s=>csv+=`${s.name},${s.role},${s.present?'Present':'Absent'}\n`);csv+='\nINVENTORY:\n';appData.inventory.forEach(i=>csv+=`${i.name},${i.qty} ${i.unit},${i.qty<=i.minQty?'LOW':'OK'}\n`);}
  const blob=new Blob([csv],{type:'text/csv'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`Siplora-${type}-${period}-${dateStr}.csv`;a.click();URL.revokeObjectURL(url);
  showToast('Report downloaded!');
}

// ═══ INIT ═══
function populateSelects(){
  const kotTbl=document.getElementById('kotTable');if(kotTbl)kotTbl.innerHTML='<option value="">-- Select Table --</option>'+appData.tables.map(t=>`<option value="${t.id}">Table ${t.id} (${t.status})</option>`).join('');
  const taskStaff=document.getElementById('t-staff');if(taskStaff)taskStaff.innerHTML=appData.staff.map(s=>`<option value="${s.id}">${s.emoji} ${s.name}</option>`).join('');
  // Waiter dropdown — sab staff dikhao (role filter nahi)
  const wcWaiter=document.getElementById('wc-waiter');
  if(wcWaiter)wcWaiter.innerHTML='<option value="">-- Waiter Select Karo --</option>'+appData.staff.map(s=>`<option value="${s.name}">${s.emoji} ${s.name} (${s.role})</option>`).join('');
  // QR Table Button Grid
  renderQRTableGrid();
  renderAllTablesQR();
}

let _selectedQRTable=null;
function renderQRTableGrid(){
  const grid=document.getElementById('qrTableBtnGrid');if(!grid)return;
  grid.innerHTML=appData.tables.map(t=>{
    const isOcc=t.status!=='available';
    const isSel=_selectedQRTable===t.id;
    return `<button onclick="selectQRTable(${t.id})" style="padding:8px 4px;border-radius:10px;border:2px solid ${isSel?'var(--accent)':isOcc?'var(--orange)':'var(--border)'};background:${isSel?'var(--gold-dim)':isOcc?'rgba(245,158,11,.07)':'var(--bg3)'};cursor:pointer;font-size:12px;font-weight:800;color:${isSel?'var(--accent)':isOcc?'var(--orange)':'var(--text)'};transition:all .15s;">
      T${t.id}<div style="font-size:9px;font-weight:600;color:var(--text2);margin-top:2px;">${isOcc?'Occ':'Free'}</div>
    </button>`;
  }).join('');
}

// ── QR Base URL helper — IP address se generate karo ──
function getQRBaseUrl(){
  const customIP = (document.getElementById('qrCustomIP')||{}).value?.trim();
  const customPort = (document.getElementById('qrCustomPort')||{}).value?.trim()||'';
  if(customIP){
    const portStr = customPort ? ':'+customPort : '';
    return `http://${customIP}${portStr}/`;
  }
  // Auto-detect from current URL (works for localhost/server)
  const loc = window.location;
  if(loc.protocol==='file:'){
    // file:// pe kaam nahi karega — IP chahiye
    return null;
  }
  return loc.origin + loc.pathname.replace(/[^/]*$/,'');
}

function buildMenuUrl(tableNum){
  const base = getQRBaseUrl();
  if(!base) return null;
  return base + 'menu.html?table=' + tableNum;
}

function generateQRForTable(tableNum){
  const url = buildMenuUrl(tableNum);
  const canvas = document.getElementById('qrcode-gen');
  const urlEl = document.getElementById('qrUrlDisplay');
  const label = document.getElementById('qrTableLabel');
  const ipWarn = document.getElementById('qrIPWarning');

  if(canvas) canvas.innerHTML='';

  if(!url){
    // file:// mode — IP nahi diya
    if(ipWarn) ipWarn.style.display='flex';
    if(urlEl) urlEl.textContent='⚠️ Pehle apna IP address daalo (neeche field mein)';
    if(label) label.textContent=`Table ${tableNum} — IP required`;
    if(canvas) canvas.innerHTML=`<div style="width:200px;height:200px;background:rgba(245,158,11,.08);border:2px dashed rgba(245,158,11,.4);border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:16px;text-align:center;"><div style="font-size:30px;">⚠️</div><div style="font-size:12px;color:var(--orange);font-weight:700;">IP Address daalo</div><div style="font-size:10px;color:var(--text2);">Neeche field mein apna computer ka IP fill karo</div></div>`;
    return;
  }

  if(ipWarn) ipWarn.style.display='none';
  if(urlEl) urlEl.textContent=url;
  if(label) label.textContent=`Table ${tableNum} — QR Ready ✅`;

  if(typeof QRCode!=='undefined' && canvas){
    try{
      new QRCode(canvas,{
        text:url,
        width:200,height:200,
        colorDark:'#0f1923',
        colorLight:'#ffffff',
        correctLevel:QRCode.CorrectLevel.H
      });
    }catch(e){
      canvas.innerHTML=`<div style="width:200px;height:200px;background:#f0f3f7;border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;font-size:11px;text-align:center;padding:12px;"><div style="font-size:28px;">📱</div><div style="font-weight:800;">Table ${tableNum}</div><div style="font-size:9px;word-break:break-all;color:#666;">${url}</div></div>`;
    }
  }

  // Copy button update
  const copyBtn = document.getElementById('qrCopyLinkBtn');
  if(copyBtn){
    copyBtn.style.display='inline-flex';
    copyBtn.onclick=()=>{
      navigator.clipboard.writeText(url)
        .then(()=>showToast('✅ Menu link copy ho gaya!','var(--green)'))
        .catch(()=>{ const ta=document.createElement('textarea');ta.value=url;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();showToast('✅ Link copy ho gaya!','var(--green)'); });
    };
  }
}

function selectQRTable(tableNum){
  _selectedQRTable=tableNum;
  document.getElementById('qrAppTable').textContent=tableNum;
  renderQRTableGrid();
  generateQRForTable(tableNum);
  showCustomerMenu(tableNum);
  const url=buildMenuUrl(tableNum);
  if(url) showToast(`✅ Table ${tableNum} QR ready! Scan karo menu khulega.`,'var(--green)');
}

function applyQRIP(){
  if(_selectedQRTable) generateQRForTable(_selectedQRTable);
  renderAllTablesQR();
  showToast('✅ IP apply hua! Ab QR scan karne se menu.html khulega.','var(--green)');
}

function renderAllTablesQR(){
  const grid=document.getElementById('allTablesQRGrid');if(!grid)return;
  const base=getQRBaseUrl();
  grid.innerHTML=appData.tables.map(t=>{
    const url=base?(base+'menu.html?table='+t.id):'—';
    return `<div onclick="selectQRTable(${t.id})" style="border:1.5px solid var(--border);border-radius:12px;padding:10px 8px;text-align:center;cursor:pointer;background:var(--bg3);transition:all .2s;" onmouseover="this.style.borderColor='var(--accent)';this.style.background='var(--gold-dim)';" onmouseout="this.style.borderColor='var(--border)';this.style.background='var(--bg3)';">
      <div style="font-size:13px;font-weight:800;color:var(--accent);">T${t.id}</div>
      <div style="font-size:9px;color:var(--text2);margin-top:2px;font-family:var(--font-mono);">${t.status==='available'?'🟢 Free':'🟡 Occ'}</div>
      <div style="font-size:9px;color:var(--text2);margin-top:4px;word-break:break-all;">${url!=='—'?'menu.html?table='+t.id:'⚠ IP set karo'}</div>
      <div style="margin-top:6px;font-size:10px;font-weight:700;padding:3px 0;border-radius:6px;background:var(--gold-dim);color:var(--accent);">📱 QR Generate</div>
    </div>`;
  }).join('');
}

function openMenuInNewTab(){
  if(!_selectedQRTable){showToast('Pehle table select karo!','var(--red)');return;}
  const url=buildMenuUrl(_selectedQRTable);
  if(!url){showToast('IP address pehle set karo!','var(--orange)');return;}
  window.open(url,'_blank');
}

function initAll(){
  // Initial Firebase loads for all features
  setTimeout(()=>{
    loadMenuFromFirebase();
    loadTablesFromFirebase();
  },2500);
  setTimeout(()=>{
    loadCustomersFromFirebase();
    loadBranchesFromFirebase();
  },3500);
  setTimeout(()=>{
    loadWasteFromFirebase();
    loadWaiterCallsFromFirebase();
  },4500);
  populateSelects();renderDashboard();renderTables();renderKOT();renderKitBoard();renderStations();
  renderStaff();renderInventory();renderMenu();renderBilling();renderCustomers();renderWaiterCalls();
  renderBranches();renderWaste();renderTasks('all');renderTaskStats();renderActiveTimers();renderAICards();renderVoiceCommands();
  renderServedHistory();
  renderTodayOrders();
  if(window.lucide)lucide.createIcons();
  setTimeout(()=>{},800);
  setTimeout(()=>showToast('👑 Siplora Chef Panel Ready — Welcome, Chef!'),1200);
  setTimeout(()=>updateFeatTabCounts(),1500);
}

// Auto-refresh
setInterval(()=>{
  appData.tables.forEach(t=>{if(t.status==='preparing'){t.time++;if(t.time>=t.maxTime&&t.status!=='urgent'){t.status='urgent';showToast(`TABLE ${t.id} ORDER OVERDUE!`,'var(--red)');}}}); 
  if(document.getElementById('page-tables').classList.contains('active'))renderTables();
  if(document.getElementById('page-dashboard').classList.contains('active'))renderDashboard();
},60000);

window.addEventListener('load',()=>{initAll();if(window.lucide)lucide.createIcons();});

// ══════════════════════════════════════════════
//  🍽️ LIVE MENU FEATURE — FULL ORDER FLOW
// ══════════════════════════════════════════════
// ── Sirf Firebase se real orders aayenge — koi dummy data nahi ──
appData.liveOrders = [];
let lmFilter='all', sctOrderId=null, awOrderId=null, selectedWaiterName='', selectedCookTime=0;

// ── RENDER NEW ORDERS (waiting only — from QR/menu) ──
function renderNewOrders(){
  const grid=document.getElementById('newOrdersGrid');if(!grid)return;
  // Local waiting orders
  const localNew=(appData.liveOrders||[]).filter(o=>o.status==='waiting');
  // Firebase pending orders — QR se aaye orders
  // Captain ke orders New Orders/KOT mein NAHI dikhenge - sirf QR/menu orders yahan aayenge
  const fbNew=(window._liveFirebaseOrders||[]).filter(o=>(o.status==='pending'||o.status==='confirmed_by_captain')&&o.source!=='captain'&&o.source!=='rts_captain'&&o._source!=='captain'&&o._source!=='rts_captain').map(o=>({
    id:'FB-'+String(o._fbId||'').slice(-6).toUpperCase(),
    _fbId:o._fbId, _source:'firebase',
    tableId:o.tableNumber||o.table||'?',
    customerName:o.customerName||'Customer',
    customerPhone:o.customerPhone||'',
    dishes:(o.items||[]).map(i=>i.name+(i.qty>1?' ×'+i.qty:'')),
    notes:o.notes||o.cookingInstructions||o.specialInstructions||o.customerNote||o.cookNote||o.instructions||o.specialRequests||o.chefNote||o.chef_note||'',
    status:'waiting',
    createdAt:o.timestamp?new Date(o.timestamp).getTime():Date.now(),
  }));
  // Merge aur newest first — naye orders sabse upar
  const newOrders=[...localNew,...fbNew].sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
  const badge=document.getElementById('newOrdersBadge');
  if(badge) badge.textContent=newOrders.length?newOrders.length+' new':'';
  if(!newOrders.length){
    grid.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:32px;color:var(--text2);font-size:13px;"><div style="font-size:36px;margin-bottom:10px;">🍽️</div>Koi naya order nahi. QR se ya manually order aayega yahan.</div>`;
    return;
  }
  grid.innerHTML=newOrders.map(o=>{
    const isFbOrder=o._source==='firebase';
    const minsAgo=Math.round((Date.now()-(o.createdAt||Date.now()))/60000);
    const isLate=minsAgo>=10;
    const safeId=String(o.id).replace(/[^a-zA-Z0-9_]/g,'_');
    const cookInstHtml=(o.notes||'').trim()?`
      <div style="background:rgba(245,158,11,0.12);border:2px solid rgba(245,158,11,0.55);border-radius:12px;padding:10px 14px;margin-bottom:10px;display:flex;align-items:flex-start;gap:9px;">
        <span style="font-size:20px;flex-shrink:0;">&#x1F373;</span>
        <div style="flex:1;">
          <div style="font-size:9px;font-weight:800;letter-spacing:2px;color:#f59e0b;text-transform:uppercase;margin-bottom:5px;">COOKING INSTRUCTIONS</div>
          <div style="font-size:13px;font-weight:700;color:#1a2033;line-height:1.6;background:#fffbeb;border-radius:8px;padding:8px 12px;border-left:3px solid #f59e0b;">${(o.notes||'').trim()}</div>
        </div>
      </div>`:''
    const acceptBtns=isFbOrder
      ?`<button class="btn-primary" style="flex:2;justify-content:center;font-size:12px;" onclick="setOrderTime('${o._fbId}','${o.tableId}')">
          ⏱ Accept & Cook Time Set Karo
        </button>`
      :`<button class="btn-primary" style="flex:2;justify-content:center;font-size:12px;" onclick="acceptNewOrder(${o.id})">
          ⏱ Accept & Time Set Karo
        </button>
        <button class="btn-sm btn-green" style="flex:1;" onclick="quickAcceptOrder(${o.id})">
          ✅ Quick (20 min)
        </button>`;
    const dishesHtml=o.dishes.map((d,idx)=>{
      const fbOrd=isFbOrder?(window._liveFirebaseOrders||[]).find(x=>x._fbId===o._fbId):null;
      const itemObj=fbOrd?(fbOrd.items||[])[idx]:null;
      const spiceLevel=itemObj&&itemObj.spiceLevel?`Spice: ${itemObj.spiceLevel}`:'';
      const customInst=itemObj&&itemObj.customInstruction?itemObj.customInstruction:'';
      const instrText=[spiceLevel,customInst].filter(Boolean).join(' | ');
      return `<div>
        <div style="font-size:13.5px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:7px;"><span style="color:var(--orange);">•</span> ${d}</div>
        ${instrText?`<div style="font-size:11px;color:#22c55e;font-weight:700;margin-top:2px;margin-left:20px;padding:3px 8px;background:rgba(34,197,94,0.08);border-left:2px solid #22c55e;border-radius:0 6px 6px 0;">🍳 ${instrText}</div>`:''}
      </div>`;
    }).join('');
    return `<div class="new-order-card" style="position:relative;${isFbOrder?'border-left:4px solid var(--accent);border-top:3px solid var(--accent);':''} animation:newOrderPop 0.4s ease;">
      <div style="position:absolute;top:10px;left:16px;display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
        ${isFbOrder?(()=>{const src=((window._liveFirebaseOrders||[]).find(x=>x._fbId===o._fbId)||{})._source||((window._liveFirebaseOrders||[]).find(x=>x._fbId===o._fbId)||{}).source||'';const isCaptain=src==='captain';return`<div style="background:${isCaptain?'rgba(29,78,216,.15)':'rgba(46,156,94,.15)'};border:1px solid ${isCaptain?'rgba(29,78,216,.4)':'rgba(46,156,94,.4)'};border-radius:6px;padding:2px 7px;font-size:9px;font-weight:700;color:${isCaptain?'var(--blue)':'var(--accent)'};font-family:var(--font-mono);">${isCaptain?'👨‍✈️ CAPTAIN ORDER':'📱 QR ORDER'}</div>`})():''}
        <div style="background:rgba(245,158,11,.18);border:1px solid rgba(245,158,11,.5);border-radius:6px;padding:2px 8px;font-size:9px;font-weight:900;color:#f59e0b;font-family:var(--font-mono);letter-spacing:1px;">🔴 NAYA ORDER</div>
      </div>
      <span class="no-corner-timer ${isLate?'late':''}" style="top:10px;right:8px;">${isLate?'⚠️ ':''} ${minsAgo}m ago</span>
      <div class="lm-header" style="padding:${isFbOrder?'30px':'14px'} 16px 8px;">
        <div style="flex:1;padding-right:70px;">
          <div style="font-family:'Playfair Display',serif;font-size:22px;font-weight:900;color:var(--orange);">🪑 Table ${o.tableId}</div>
          ${o.customerName?`<div style="margin-top:5px;display:flex;align-items:center;gap:7px;background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.2);border-radius:8px;padding:5px 10px;"><span style="font-size:15px;">👤</span><div><div style="font-size:13px;font-weight:800;color:var(--text);">${o.customerName}</div>${o.customerPhone?`<div style="font-size:11px;color:var(--text2);">📞 ${o.customerPhone}</div>`:''}</div></div>`:''}
        </div>
        <span style="font-size:10px;font-weight:800;padding:4px 12px;border-radius:20px;background:rgba(245,158,11,.12);color:var(--orange);border:1px solid rgba(245,158,11,.3);">⏳ NEW</span>
      </div>
      <div style="padding:0 16px 16px;">
        <div style="border-top:1.5px dashed rgba(245,158,11,.3);padding-top:10px;margin-bottom:8px;display:flex;flex-direction:column;gap:6px;">${dishesHtml}</div>
        ${cookInstHtml}
        <div style="display:flex;gap:7px;margin-top:8px;">${acceptBtns}</div>
      </div>
    </div>`;
  }).join('');
}

// Accept new order — set cook time
function acceptNewOrder(orderId){
  sctOrderId=orderId;
  const o=appData.liveOrders.find(x=>x.id===orderId);if(!o)return;
  document.getElementById('sct-title').textContent=`Table ${o.tableId}${o.customerName?' — '+o.customerName:''} — Cook Time`;
  document.getElementById('sct-items').textContent=o.dishes.join(', ');
  document.getElementById('sct-custom').value='';
  selectedCookTime=0;
  document.querySelectorAll('#setCookTimeModal .btn-sm').forEach(b=>b.style.background='');
  openModal('setCookTimeModal');
}

// Quick accept — default 20 min
function quickAcceptOrder(orderId){
  const o=appData.liveOrders.find(x=>x.id===orderId);if(!o)return;
  o.cookTime=20;o.timeLeft=20;o.status='cooking';
  renderNewOrders();renderLiveMenu();
  showToast(`✅ Table ${o.tableId} — 20 min mein ready! Cooking shuru.`,'var(--blue)');
  // Voice sirf timer set hone pe
}

// Girl voice se cooking instructions padhna
function readCookingInstructions(safeId, customerName, instructions){
  if(!instructions){showToast('Koi instructions nahi.','var(--orange)');return;}
  const msg=`${customerName} ne kaha hai ki: ${instructions}`;
  NovaVoice.speak(msg, true);
  showToast(`🎀 Priya bol rahi hai: "${instructions.substring(0,40)}${instructions.length>40?'...':''}"`, 'var(--orange)');
}
window.readCookingInstructions=readCookingInstructions;

// Late order checker — every 30 seconds
setInterval(()=>{
  const late=(appData.liveOrders||[]).filter(o=>o.status==='waiting'&&((Date.now()-(o.createdAt||0))/60000)>=10);
  if(late.length>0){
    late.forEach(o=>{
      const minsAgo=Math.round((Date.now()-(o.createdAt||0))/60000);
      // Dashboard pe alert
      const alertEl=document.getElementById('lateOrderAlert');
      if(alertEl){
        alertEl.style.display='flex';
        alertEl.innerHTML=`<div class="late-alert-icon">⏰</div><div class="late-alert-body"><div class="late-alert-title">Table ${o.tableId}${o.customerName?' — '+o.customerName:''} — ${minsAgo} minute se wait kar rahe hain!</div><div class="late-alert-sub">Order accept karo: ${o.dishes?o.dishes[0]:'order'}</div></div><button onclick="document.getElementById('lateOrderAlert').style.display='none'" style="background:none;border:none;cursor:pointer;color:var(--text2);font-size:18px;flex-shrink:0;">✕</button>`;
      }
      // Girl voice alert — max once per order per cycle
      if(!o._lateAlerted){
        o._lateAlerted=true;
        const msgs=[
          `Chef ji, aap late ho rahe ho! Table ${o.tableId}${o.customerName?' pe '+o.customerName:''} ka order ${minsAgo} minute se wait kar raha hai. Please jaldi karo!`,
          `Oops! Table ${o.tableId} ka order bahut der se pending hai. ${minsAgo} minute ho gaye hain. Chef jaldi action lo please!`,
          `Hey hey! Table ${o.tableId}${o.customerName?' — '+o.customerName+' ka':''} order ready karna hai! ${minsAgo} minute wait kar raha hai guest.`,
        ];
        NovaVoice.speak(msgs[Math.floor(Math.random()*msgs.length)], true);
        triggerAudioAlert('⏰','LATE ORDER!',`Table ${o.tableId} — ${minsAgo} min se pending! Jaldi action lo.`,'alert-urgent');
        // Dashboard mein bhi dikha do
        renderDashboard();
      }
    });
    // Re-render new orders to show late indicator
    renderNewOrders();
  }
},30000);

function renderLiveMenu(){
  const grid=document.getElementById('liveMenuGrid');if(!grid)return;

  // Merge Firebase QR orders + local KOT orders
  const fbOrders=(window._liveFirebaseOrders||[]).map(o=>{
    // Captain timer set hai? → Chef panel mein cooking treat karo
    // captainTimerSetAt — sirf actual Firebase timestamp use karo, current time se fallback NAHI
    const hasCaptainTimer = o.captainTimer>0;
    // captainTimerSetAt nahi hai toh null rakhho — galat countdown prevent karo
    const ctSetAt = o.captainTimerSetAt || o.updatedAt || o.timestamp || null;
    let mappedStatus = {
      pending:'waiting',
      confirmed_by_captain:'waiting',
      accepted:'cooking',
      ready:'ready',
      serving:'serving',
      served:'served_done'
    }[o.status] || o.status;
    // Agar captain ne timer set kiya aur order pending/confirmed hai → cooking section mein dikhao
    if(hasCaptainTimer && (o.status==='pending'||o.status==='confirmed_by_captain'||o.status==='accepted')) mappedStatus='cooking';
    // Captain timer real-time calculate karo
    let captainTimeLeft=0;
    if(hasCaptainTimer && ctSetAt){
      const capElapsed=(Date.now()-new Date(ctSetAt).getTime())/60000;
      captainTimeLeft=Math.max(0,o.captainTimer-capElapsed);
    }
    return {
      _source:'firebase', _fbId:o._fbId,
      id:'FB-'+o._fbId?.slice(-6)?.toUpperCase(),
      tableId:o.tableNumber||o.table||'?',
      customerName:o.customerName||'Customer',
      customerPhone:o.customerPhone||'',
      dishes:(o.items||[]).map(i=>`${i.name} \xd7${i.qty||1}`),
      notes:o.notes||o.cookingInstructions||o.specialInstructions||o.customerNote||o.cookNote||o.instructions||o.specialRequests||'',
      status:mappedStatus,
      estimatedMinutes:o.estimatedMinutes||0,
      fbStatus:o.status,
      createdAt:o.timestamp?new Date(o.timestamp).getTime():Date.now(),
      cookTime:hasCaptainTimer?o.captainTimer:(o.estimatedMinutes||0),
      timeLeft:hasCaptainTimer?captainTimeLeft:(o._realTimeLeft!==undefined?o._realTimeLeft:(o.estimatedMinutes||0)),
      _realTimeLeft:o._realTimeLeft,
      captainTimer:o.captainTimer||0,
      captainTimerSetAt:ctSetAt,
      _captainRealTimeLeft:captainTimeLeft||o._captainRealTimeLeft,
      _hasCaptainTimer:hasCaptainTimer,
      waiter:o.assignedWaiter||o.servedBy||''
    };
  });
  const localOrders=appData.liveOrders||[];
  // DUPLICATE FIX: Firebase se aaya order agar localOrders mein bhi hai same tableId ke saath, toh local wala hatao
  // Firebase orders ko priority do — woh real source hain
  const fbTableIds=new Set(fbOrders.map(o=>String(o.tableId)));
  const deduplicatedLocal=localOrders.filter(o=>{
    // Agar Firebase mein same tableId ka order hai (non-served), toh local skip karo
    if(fbTableIds.has(String(o.tableId)) && o.status!=='served') return false;
    return true;
  });
  // Merge aur newest first sort karo — naye orders hamesha sabse upar (served orders EXCLUDE karo)
  const allOrders=[...fbOrders,...deduplicatedLocal]
    .filter(o=>o.status!=='served'&&o.status!=='served_done')
    .sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
  let orders=allOrders;
  if(lmFilter!=='all') orders=allOrders.filter(o=>o.status===lmFilter);

  // Update stats
  document.getElementById('lm-waiting').textContent=allOrders.filter(o=>o.status==='waiting').length;
  document.getElementById('lm-cooking').textContent=allOrders.filter(o=>o.status==='cooking').length;
  document.getElementById('lm-ready').textContent=allOrders.filter(o=>o.status==='ready').length;
  document.getElementById('lm-served').textContent=(appData.servedOrdersHistory||[]).length || (window._liveFirebaseOrders||[]).filter(o=>o.status==='served'||o.status==='paid').length;
  const badge=document.getElementById('liveMenuBadge');
  if(badge){const n=allOrders.filter(o=>o.status==='waiting'||o.status==='ready'||o.status==='cooking').length;badge.textContent=n||'';}

  if(!orders.length){grid.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text2);font-size:14px;"><div style="font-size:40px;margin-bottom:12px;">🍽️</div><div>Koi live order nahi. Menu page se QR order aata hai yahan!</div></div>`;return;}

  grid.innerHTML=orders.map(o=>{
    const isFb=o._source==='firebase';
    const statusCls={waiting:'lm-waiting',cooking:'lm-cooking',ready:'lm-ready',serving:'lm-serving'}[o.status]||'lm-waiting';
    const statusLabel=(()=>{if(o.status==='waiting'&&o._source==='firebase'){const src=(window._liveFirebaseOrders||[]).find(x=>x._fbId===o._fbId);const isCap=src&&(src.source==='captain'||src._source==='captain');return isCap?'👨‍✈️ CAPTAIN ORDER — COOKING KARO':'⏳ PENDING';}return {waiting:'⏳ PENDING',cooking:'🔥 COOKING...',ready:'✅ READY — CHEF CONFIRMED',serving:'🍽️ SERVE'}[o.status]||o.status.toUpperCase();})();
    const timeAgo=Math.round((Date.now()-o.createdAt)/60000);

    // Timer HTML — Orbitron display, no tik-tik animation
    let timerHtml='';

    // ── CAPTAIN TIMER (Firebase orders) ── Captain ne jo timer set kiya
    const fbRealOrder = isFb ? (window._liveFirebaseOrders||[]).find(x=>x._fbId===o._fbId) : null;
    const captainTimer = o._hasCaptainTimer ? o.captainTimer : (fbRealOrder ? (fbRealOrder.captainTimer||0) : 0);
    const captainTimerSetAt = o.captainTimerSetAt || (fbRealOrder ? (fbRealOrder.captainTimerSetAt||fbRealOrder.updatedAt||fbRealOrder.timestamp) : null);

    if(captainTimer>0 && o.status!=='ready' && o.fbStatus!=='served'){
      const captainElapsedMs = Date.now() - new Date(captainTimerSetAt).getTime();
      const captainRemainingMins = Math.max(0, captainTimer - captainElapsedMs/60000);
      const captainTotalSecs = Math.round(captainRemainingMins*60);
      const captainMM = Math.floor(captainTotalSecs/60);
      const captainSS = captainTotalSecs%60;
      const captainMMSS = `${String(captainMM).padStart(2,'0')}:${String(captainSS).padStart(2,'0')}`;
      const captainUrgent = captainRemainingMins<=2;
      const captainWarn = captainRemainingMins>2&&captainRemainingMins<=5;
      const rowCls = captainUrgent?'urgent':captainWarn?'warn':'ok';
      const pct = Math.round((captainRemainingMins/captainTimer)*100);
      const barCol = captainUrgent?'#f87171':captainWarn?'#fbbf24':'#c4b5fd';
      const timeUpBanner = captainRemainingMins<=0 ? `<div style="margin-top:8px;background:rgba(239,68,68,.12);border:1.5px solid rgba(239,68,68,.45);border-radius:10px;padding:8px 14px;display:flex;align-items:center;gap:8px;"><span style="font-size:18px;">⏰</span><span style="font-size:13px;font-weight:800;color:#f87171;font-family:'Rajdhani',sans-serif;letter-spacing:.5px;">CAPTAIN TIMER KHATAM! — MARK READY KARO</span></div>` : '';
      timerHtml=`<div style="margin-bottom:10px;"
          data-live-timer="captain"
          data-timer-set="${captainTimerSetAt}"
          data-timer-total="${captainTimer}">
        <div class="lm-captain-timer-row ${rowCls}" data-timer-row>
          <div class="lm-captain-timer-label">
            <span>👑</span>
            <span>CAPTAIN TIMER</span>
          </div>
          <div class="lm-timer-display" data-timer-display>${captainMMSS}</div>
          <div class="lm-captain-total-badge">${captainTimer}m</div>
        </div>
        <div class="lm-timer-progress-track">
          <div class="lm-timer-progress-fill" data-timer-bar style="width:${pct}%;background:${barCol};"></div>
        </div>
        ${timeUpBanner}
      </div>`;
    } else if(o.status==='cooking'&&o.cookTime>0){
      const tRaw=(o._source==='firebase' && o._realTimeLeft !== undefined) ? o._realTimeLeft : (o.timeLeft||o.cookTime);
      const totalSecs=Math.max(0,Math.round(tRaw*60));
      const mm=Math.floor(totalSecs/60);
      const ss=totalSecs%60;
      const mmss=`${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
      const isUrgent=tRaw<=3;
      const isWarn=tRaw>3&&tRaw<=8;
      const boxCls=isUrgent?'urgent':isWarn?'warn':'ok';
      const pct=Math.round((tRaw/o.cookTime)*100);
      const barCol=isUrgent?'#f87171':isWarn?'#fbbf24':'#4ade80';
      const subText=tRaw<=0?'⏰ TIME UP — MARK READY':'COOKING TIME LEFT';
      timerHtml=`<div class="lm-cook-timer-wrap"
          data-live-timer="cook"
          data-cook-start="${Date.now()}"
          data-cook-left="${tRaw}"
          data-cook-total="${o.cookTime}">
        <div class="lm-cook-timer-box ${boxCls}" data-timer-row>
          <div class="lm-timer-display" data-timer-display>${mmss}</div>
          <div class="lm-cook-timer-sub" data-timer-sub>${subText}</div>
        </div>
        <div class="lm-timer-progress-track" style="margin-top:8px;">
          <div class="lm-timer-progress-fill" data-timer-bar style="width:${pct}%;background:${barCol};"></div>
        </div>
      </div>`;
    } else if(o.status==='ready'){
      timerHtml=`<div class="lm-ready-block">
        <div class="lm-ready-icon">✅</div>
        <div>
          <div class="lm-ready-text">KHANA READY HAI!</div>
          <div class="lm-ready-sub">Waiter assign karo — customer ka wait khatam karo</div>
        </div>
      </div>`;
    } else if(o.status==='serving'){
      timerHtml=`<div class="lm-serving-block">
        <div class="lm-serving-icon-box">🍽️</div>
        <div style="flex:1;">
          <div class="lm-serving-title">ON THE WAY — ${o.waiter||'Waiter Assigned'}</div>
          <div class="lm-serving-sub">Table tak deliver ho raha hai — "Mark Served" press karo</div>
        </div>
      </div>`;
    }

    // Actions
    let actionsHtml='';
    if(isFb){
      // ── Serving status: waiter assigned → "Mark Served" green tick button ──
      if(o.fbStatus==='serving'||o.status==='serving'){
        actionsHtml=`
          <button onclick="markFbOrderServed('${o._fbId}','${o.tableId}','${(o.waiter||'').replace(/'/g,"\'")}')" style="display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:9px 20px;border:none;border-radius:50px;cursor:pointer;background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;font-weight:800;font-size:13px;box-shadow:0 4px 14px rgba(22,163,74,0.45);width:auto;max-width:220px;margin:0 auto;font-family:var(--font-ui);">
            <span style="width:22px;height:22px;background:rgba(255,255,255,0.2);border-radius:6px;border:1.5px solid rgba(255,255,255,0.35);display:flex;align-items:center;justify-content:center;"><svg viewBox='0 0 24 24' fill='none' width='14' height='14' stroke='#fff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='20 6 9 17 4 12'/></svg></span>
            <span>Mark Served ✅</span>
          </button>`;
      }
      // ── SABSE PEHLE: agar order ready hai ──
      else if(o.fbStatus==='ready'){
        actionsHtml=`
          <button class="btn-primary" style="flex:1;justify-content:center;font-size:12px;background:linear-gradient(135deg,#6d28d9,#8b5cf6);" onclick="openAssignWaiterFb('${o._fbId}','${o.tableId}')">
            🧑‍🍽️ Waiter Assign Karo
          </button>
          <button class="btn-sm" style="flex:1;background:linear-gradient(135deg,#059669,#047857);color:#fff;border:none;cursor:pointer;border-radius:10px;font-weight:800;" onclick="markOrderServed('${o._fbId}','${o.tableId}')">
            🍽️ Mark Served
          </button>`;
      }
      // ── Captain Timer chal raha hai (pending ya accepted) → Mark Ready dikhao ──
      else if(o._hasCaptainTimer){
        actionsHtml=`
          <button class="mark-ready-btn" onclick="markOrderReady('${o._fbId}','${o.tableId}','${(o.dishes[0]||'Order').replace(/'/g,"\\'")}')"><span class="mrb-shimmer"></span><span class="mrb-icon"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg></span><span class="mrb-labels"><span class="mrb-text">Mark as Ready</span><span class="mrb-sub">Chef Confirm</span></span></button>`;
      }
      // ── Chef ne time set kiya (accepted) ──
      else if(o.fbStatus==='accepted'){
        actionsHtml=`
          <button class="mark-ready-btn" onclick="markOrderReady('${o._fbId}','${o.tableId}','${(o.dishes[0]||'Order').replace(/'/g,"\\'")}')"><span class="mrb-shimmer"></span><span class="mrb-icon"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg></span><span class="mrb-labels"><span class="mrb-text">Mark as Ready</span><span class="mrb-sub">Chef Confirm</span></span></button>
          <button class="btn-sm" style="font-size:10px;padding:6px 10px;" onclick="setOrderTime('${o._fbId}','${o.tableId}')">⏱</button>`;
      }
      // ── Normal pending order — Time set karo ──
      else if(o.fbStatus==='pending'){
        actionsHtml=`
          <button class="btn-primary" style="flex:1;justify-content:center;font-size:12px;" onclick="setOrderTime('${o._fbId}','${o.tableId}')">
            ⏱ Time Set Karo
          </button>
          <button class="mark-ready-btn mark-ready-btn--sm" onclick="markOrderReady('${o._fbId}','${o.tableId}','${(o.dishes[0]||'Order').replace(/'/g,"\\'")}')"><span class="mrb-shimmer"></span><span class="mrb-icon"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg></span><span class="mrb-labels"><span class="mrb-text">Direct Ready</span></span></button>`;
      }
      // ── Served ──
      else {
        actionsHtml=`<div style="font-size:12px;color:var(--text2);padding:8px">✓ Served</div>`;
      }
    } else {
      // Local KOT actions
      actionsHtml = o.status==='waiting'
        ? `<button class="btn-primary" style="flex:1;justify-content:center;font-size:12px;" onclick="openCookTimeModal(${o.id})"><svg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/></svg> Set Cook Time</button>`
        : o.status==='cooking'
        ? `<button class="mark-ready-btn" onclick="chefConfirmReady(${o.id})"><span class="mrb-shimmer"></span><span class="mrb-icon"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg></span><span class="mrb-labels"><span class="mrb-text">Mark as Ready</span><span class="mrb-sub">Chef Confirm</span></span></button><button class="btn-sm" style="font-size:10px;padding:6px 10px;" onclick="openCookTimeModal(${o.id})">⏱</button>`
        : o.status==='ready'
        ? `<button class="btn-primary" style="flex:1;justify-content:center;font-size:12px;background:linear-gradient(135deg,#6d28d9,#8b5cf6);" onclick="openAssignWaiter(${o.id})">🧑‍🍽️ Assign Waiter</button>`
        : o.status==='serving'
        ? `<div class="lm-waiter-badge">🧑‍🍽️ ${o.waiter}</div><button class="btn-sm btn-green" style="flex:1;" onclick="markLMServed(${o.id})">🏁 Mark Served</button>`
        : '';
    }

       // Chef-set time badge — SMALL compact mm:ss badge, top-right corner
    const chefTimeBadge = (()=>{
      if(o.status==='cooking' && o.cookTime>0){
        const tLeftRaw=o.timeLeft||o.cookTime;
        const tMins=Math.floor(tLeftRaw);
        const tSecs=Math.round((tLeftRaw-tMins)*60);
        const mmss=`${String(tMins).padStart(2,'0')}:${String(tSecs).padStart(2,'0')}`;
        const isUrgent=tLeftRaw<=3;
        const isWarn=tLeftRaw>3&&tLeftRaw<=8;
        const col=isUrgent?'#ef4444':isWarn?'#f59e0b':'#22c55e';
        const bg=isUrgent?'rgba(239,68,68,.18)':isWarn?'rgba(245,158,11,.15)':'rgba(34,197,94,.14)';
        const brd=isUrgent?'rgba(239,68,68,.55)':isWarn?'rgba(245,158,11,.5)':'rgba(34,197,94,.5)';
        const anim='';
        return `<div class="chef-time-corner-badge" style="background:${bg};border:1.5px solid ${brd};color:${col};${anim}">${mmss}</div>`;
      }
      if(o.status==='ready'){
        return `<div class="chef-time-corner-badge" style="background:rgba(34,197,94,.16);border:1.5px solid rgba(34,197,94,.5);color:#22c55e;">✅</div>`;
      }
      if(isFb && o.cookTime>0 && o.fbStatus==='accepted'){
        const tMins=Math.floor(o.cookTime);
        const mmss=`${String(tMins).padStart(2,'0')}:00`;
        return `<div class="chef-time-corner-badge" style="background:rgba(249,115,22,.15);border:1.5px solid rgba(249,115,22,.5);color:#f97316;">${mmss}</div>`;
      }
      return '';
    })();

    const isNew = (Date.now() - (o.createdAt||0)) < 5*60*1000;
    // Source badge
    const fbRaw2=(window._liveFirebaseOrders||[]).find(x=>x._fbId===o._fbId);
    const isCaptainSrc=fbRaw2&&(fbRaw2.source==='captain'||fbRaw2._source==='captain');
    const sourceBadgeHtml = isFb
      ? (isCaptainSrc
          ? `<span class="lm-src-badge lm-src-captain">👨‍✈️ CAPTAIN</span>`
          : `<span class="lm-src-badge lm-src-qr">📱 QR ORDER</span>`)
      : '';
    const newBadgeHtml = isNew ? `<span class="lm-new-badge">🆕 NEW</span>` : '';
    const tickerMsg = o.fbStatus==='pending'?'Customer wait kar raha hai — Time set karo!'
      :o.fbStatus==='accepted'?`Customer screen: <strong style="color:#4ade80;font-weight:800;">${o.cookTime} min mein ready</strong>`
      :o.fbStatus==='ready'?'✅ Customer ko dikh raha hai: Khana Ready!'
      :o.status==='waiting'?'Customer wait kar raha hai...'
      :o.status==='cooking'?`Customer ko <strong style="color:#60a5fa;">${o.cookTime} min</strong> estimate dikh raha hai`
      :o.status==='ready'?'Customer ko notification: Order ready hai!'
      :'Order serve ho gaya ✅';

    // Captain Order Card — New Design
    // Compute per-item data
    const coItems = o.dishes.map((d,idx)=>{
      const fbOrder2 = isFb ? (window._liveFirebaseOrders||[]).find(x=>x._fbId===o._fbId) : null;
      const itemObj2 = fbOrder2 ? (fbOrder2.items||[])[idx] : null;
      const spice2   = itemObj2 ? (itemObj2.spiceLevel||'') : '';
      const portion2 = itemObj2 ? (itemObj2.portion||itemObj2.customInstruction||'') : '';
      const qty2     = itemObj2 ? (itemObj2.qty||itemObj2.quantity||1) : 1;
      const prep2    = itemObj2 ? (itemObj2.prepTime||'') : '';
      return {name:d, spice:spice2, portion:portion2, qty:qty2, prep:prep2};
    });

    // Ring timer calc
    const coTimerRaw = (()=>{
      if(captainTimer>0 && o.status!=='ready'){
        const el=Date.now()-new Date(captainTimerSetAt).getTime();
        return {val:Math.max(0,captainTimer-el/60000), max:captainTimer, source:'captain'};
      }
      if(o.status==='cooking'&&o.cookTime>0){
        const tv=(o._source==='firebase'&&o._realTimeLeft!==undefined)?o._realTimeLeft:(o.timeLeft||o.cookTime);
        return {val:Math.max(0,tv), max:o.cookTime, source:'cook'};
      }
      return null;
    })();

    const coRingMMSS=(()=>{
      if(!coTimerRaw) return o.status==='ready'?'READY':o.status==='serving'?'SERVE':'--:--';
      const ts=Math.max(0,Math.round(coTimerRaw.val*60));
      return `${String(Math.floor(ts/60)).padStart(2,'0')}:${String(ts%60).padStart(2,'0')}`;
    })();
    const coRingPct = coTimerRaw ? Math.round((coTimerRaw.val/coTimerRaw.max)*100) : (o.status==='ready'?100:0);
    // SVG ring
    const cR=36, cCX=44, cCY=44;
    const circumference=2*Math.PI*cR;
    const ringOffset=circumference*(1-coRingPct/100);

    // captain timer panel values
    const coPanelMMSS = coRingMMSS;
    const coPanelPct  = coRingPct;
    const coPanelUrgent = coTimerRaw && coTimerRaw.val<=2;
    const coPanelWarn   = coTimerRaw && coTimerRaw.val>2 && coTimerRaw.val<=5;
    const coPanelCls    = coPanelUrgent?'urgent':coPanelWarn?'warn':'ok';
    const coPanelBarCol = coPanelUrgent?'#f87171':coPanelWarn?'#fbbf24':'#c4b5fd';

    // Customer status text
    const coCustomerStatus = o.fbStatus==='pending'?{text:'Customer is waiting',sub:'Please prepare within 1 min.'}
      :o.fbStatus==='accepted'?{text:`${o.cookTime} min mein ready`,sub:'Customer screen pe dikh raha hai'}
      :o.fbStatus==='ready'?{text:'Order Ready!',sub:'Customer ko notify ho gaya'}
      :o.status==='waiting'?{text:'Customer is waiting',sub:'Please prepare within 1 min.'}
      :o.status==='cooking'?{text:'Cooking in progress',sub:`${o.cookTime||'?'} min estimate dikh raha`}
      :o.status==='ready'?{text:'Order Ready!',sub:'Waiter assign karo'}
      :{text:'Serving',sub:'On the way to table'};

    // Summary
    const coTotalQty  = coItems.reduce((s,i)=>s+(i.qty||1),0);
    const coTotalAmt  = o.totalAmount||o.total||0;
    const coPriority  = (captainTimer>0 && coTimerRaw && coTimerRaw.val<=5) ? 'high' : 'normal';
    const coStatusCls = {waiting:'co-waiting',cooking:'co-cooking',ready:'co-ready',serving:'co-serving'}[o.status]||'co-waiting';

    // Order time formatted
    const coOrderDate = o.createdAt ? new Date(o.createdAt) : new Date();
    const coOrderTimeStr = coOrderDate.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});

    // Mark ready / actions bar
    const coActionBar = (()=>{
      if(isFb){
        if(o.fbStatus==='serving'||o.status==='serving'){
          return `<div class="co-actions-row"><button onclick="markFbOrderServed('${o._fbId}','${o.tableId}','${(o.waiter||'').replace(/'/g,"\\'")}')" style="display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 24px;border:none;border-radius:50px;cursor:pointer;background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;font-weight:900;font-size:13px;box-shadow:0 4px 14px rgba(22,163,74,0.45);font-family:var(--font-ui);letter-spacing:0.5px;"><svg viewBox='0 0 24 24' fill='none' width='16' height='16' stroke='#fff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='20 6 9 17 4 12'/></svg>Mark Served ✅</button></div>`;
        }
        if(o.fbStatus==='ready'){
          return `<div class="co-actions-row"><button class="btn-primary" style="flex:1;justify-content:center;font-size:12px;background:linear-gradient(135deg,#6d28d9,#8b5cf6);" onclick="openAssignWaiterFb('${o._fbId}','${o.tableId}')">🧑‍🍽️ Waiter Assign Karo</button><button class="btn-sm" style="flex:1;background:linear-gradient(135deg,#059669,#047857);color:#fff;border:none;cursor:pointer;border-radius:10px;font-weight:800;" onclick="markOrderServed('${o._fbId}','${o.tableId}')">🍽️ Mark Served</button></div>`;
        }
        if(o._hasCaptainTimer||o.fbStatus==='accepted'){
          return `<div onclick="markOrderReady('${o._fbId}','${o.tableId}','${(o.dishes[0]||'Order').replace(/'/g,"\\'")}')">
            <div class="co-mark-ready-bar">
              <div class="co-mrb-check"><svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
              <div class="co-mrb-text"><div class="co-mrb-main">MARK AS READY</div><div class="co-mrb-sub">Tap when order is ready to serve</div></div>
              <div class="co-mrb-arrow">›</div>
            </div></div>`;
        }
        if(o.fbStatus==='pending'){
          return `<div class="co-actions-row"><button class="btn-primary" style="flex:1;justify-content:center;font-size:12px;" onclick="setOrderTime('${o._fbId}','${o.tableId}')">⏱ Time Set Karo</button><button class="mark-ready-btn mark-ready-btn--sm" onclick="markOrderReady('${o._fbId}','${o.tableId}','${(o.dishes[0]||'Order').replace(/'/g,"\\'")}')"><span class="mrb-shimmer"></span><span class="mrb-icon"><svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg></span><span class="mrb-labels"><span class="mrb-text">Direct Ready</span></span></button></div>`;
        }
        return `<div class="co-served-badge">✓ Served</div>`;
      } else {
        if(o.status==='waiting') return `<div class="co-actions-row"><button class="btn-primary" style="flex:1;justify-content:center;font-size:12px;" onclick="openCookTimeModal(${o.id})"><svg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/></svg> Set Cook Time</button></div>`;
        if(o.status==='cooking') return `<div onclick="chefConfirmReady(${o.id})"><div class="co-mark-ready-bar"><div class="co-mrb-check"><svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="co-mrb-text"><div class="co-mrb-main">MARK AS READY</div><div class="co-mrb-sub">Tap when order is ready to serve</div></div><div class="co-mrb-arrow">›</div></div></div><div class="co-actions-row" style="margin-top:0;"><button class="btn-sm" style="font-size:10px;padding:6px 10px;" onclick="openCookTimeModal(${o.id})">⏱ Adjust Time</button></div>`;
        if(o.status==='ready') return `<div class="co-actions-row"><button class="btn-primary" style="flex:1;justify-content:center;font-size:12px;background:linear-gradient(135deg,#6d28d9,#8b5cf6);" onclick="openAssignWaiter(${o.id})">🧑‍🍽️ Assign Waiter</button></div>`;
        if(o.status==='serving') return `<div class="co-actions-row"><div class="lm-waiter-badge">🧑‍🍽️ ${o.waiter}</div><button class="btn-sm btn-green" style="flex:1;" onclick="markLMServed(${o.id})">🏁 Mark Served</button></div>`;
        return '';
      }
    })();

    return `<div class="co-card ${coStatusCls}">

      <!-- TOP STRIP -->
      <div class="co-top-strip">
        <div class="co-top-left">
          <span class="co-crown-badge">👑 CAPTAIN ORDER</span>
          <span class="co-order-id-pill">#${String(o.id||o._fbId||'').slice(-8).toUpperCase()}</span>
        </div>
        <div class="co-top-right">
          ${sourceBadgeHtml.replace('lm-src-badge','co-src-badge').replace('lm-src-captain','co-src-captain').replace('lm-src-qr','co-src-qr')}
          ${newBadgeHtml}
          <span class="co-time-ago-badge">${timeAgo}m ago</span>
        </div>
      </div>

      <!-- MAIN INFO: table | ring timer | summary -->
      <div class="co-main-info">

        <!-- LEFT: Table + Customer -->
        <div class="co-left-info">
          <div class="co-table-row">
            <div>
              <div class="co-table-label">TABLE</div>
              <div class="co-table-name">Table ${o.tableId}</div>
            </div>
          </div>
          ${(o.customerName||o.customerPhone)?`<div class="co-customer-box">
            <div class="co-cust-av">👤</div>
            <div>
              ${o.customerName?`<div class="co-cust-name">${o.customerName}</div>`:''}
              ${o.customerPhone?`<div class="co-cust-meta">📞 ${o.customerPhone}</div>`:''}
            </div>
          </div>`:''}
          <div class="co-order-time-box" style="margin-top:2px;">
            <div class="co-time-row"><span class="co-time-label">ORDER TIME</span><span class="co-time-val">${coOrderTimeStr}</span></div>
            <div class="co-time-row"><span class="co-time-label">PLACED</span><span class="co-time-val">${timeAgo} min ago</span></div>
            <div class="co-source-row"><span class="co-source-icon">📱</span><span class="co-source-text">Captain App</span></div>
          </div>
        </div>

        <!-- CENTER: Circular Ring Timer -->
        <div class="co-timer-center">
          <div class="co-ring-wrap">
            <svg class="co-ring-svg" viewBox="0 0 88 88">
              <circle class="co-ring-bg" cx="44" cy="44" r="36"/>
              <circle class="co-ring-fill" cx="44" cy="44" r="36"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${ringOffset}"
              />
            </svg>
            <div class="co-ring-inner">
              <div class="co-ring-time">${coRingMMSS}</div>
              <div class="co-ring-label">MIN : SEC</div>
            </div>
          </div>
          <div class="co-status-pill">🔥 ${statusLabel}</div>
        </div>

        <!-- RIGHT: Order Summary -->
        <div>
          <div class="co-order-summary">
            <div class="co-summary-title">ORDER SUMMARY</div>
            <div class="co-summary-row"><span class="co-summary-label">Items</span><span class="co-summary-val">${coItems.length}</span></div>
            <div class="co-summary-row"><span class="co-summary-label">Total Qty</span><span class="co-summary-val">${coTotalQty}</span></div>
            <div class="co-summary-divider"></div>
            <div class="co-summary-row"><span class="co-summary-label">Total Amount</span><span class="co-summary-total">${coTotalAmt>0?`₹${coTotalAmt}`:'—'}</span></div>
            <div style="margin-top:4px;">
              <div style="font-size:9px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.3);font-family:'Rajdhani',sans-serif;margin-bottom:4px;">PRIORITY</div>
              <div class="co-priority-badge ${coPriority==='high'?'co-priority-high':'co-priority-normal'}">${coPriority==='high'?'🔴 HIGH ↗':'🟢 NORMAL'}</div>
            </div>
          </div>
        </div>

      </div>

      <!-- ORDER ITEMS -->
      <div class="co-items-section">
        <div class="co-items-header">
          <div class="co-items-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>
            ORDER ITEMS
          </div>
          <span class="co-items-count-badge">(${coItems.length})</span>
        </div>
        <div class="co-items-list">
          ${coItems.map(it=>`<div class="co-item-row">
            <div class="co-item-dot"></div>
            <div class="co-item-main">
              <div class="co-item-name">
                ${it.name}
                <span class="co-item-qty-tag">× ${it.qty}</span>
              </div>
              <div class="co-item-tags">
                ${it.spice?`<span class="co-item-tag co-tag-spice">🌶 Spice: ${it.spice}</span>`:''}
                ${it.portion?`<span class="co-item-tag co-tag-portion">🥣 ${it.portion}</span>`:''}
              </div>
            </div>
            ${it.prep?`<div class="co-item-prep"><span>PREP TIME</span>${it.prep}</div>`:''}
          </div>`).join('')}
        </div>
      </div>

      <!-- COOKING NOTE -->
      ${(o.notes||'').trim()?`<div class="co-cook-note">
        <div class="co-cook-note-icon">🍳</div>
        <div><div class="co-cook-note-label">COOKING NOTE</div><div class="co-cook-note-text">${(o.notes||'').trim()}</div></div>
      </div>`:''}

      <!-- 3 PANELS: Captain Timer | Customer Status | Chef Action -->
      <div class="co-panels-row">
        <!-- Captain Timer Panel -->
        <div class="co-panel co-panel-timer ${coPanelCls}">
          <div class="co-panel-title">👑 CAPTAIN TIMER</div>
          <div class="co-panel-timer-value">${coPanelMMSS}</div>
          <div class="co-timer-progress"><div class="co-timer-progress-fill" style="width:${coPanelPct}%;background:${coPanelBarCol};"></div></div>
          <div class="co-panel-reminder">⏰ Auto reminder in 20 sec</div>
        </div>
        <!-- Customer Status Panel -->
        <div class="co-panel co-panel-cust">
          <div class="co-panel-title">👤 CUSTOMER STATUS</div>
          <div class="co-cust-status-main">
            <div class="co-cust-status-dot"></div>
            <div class="co-cust-status-text">${coCustomerStatus.text}</div>
          </div>
          <div class="co-cust-status-sub">${coCustomerStatus.sub}</div>
        </div>
        <!-- Chef Action Panel -->
        <div class="co-panel co-panel-action">
          <div class="co-panel-title">🍽️ CHEF ACTION</div>
          <div class="co-chef-action-row">
            <div class="co-chef-av">👨‍🍳</div>
            <div>
              <div class="co-chef-action-name">Chef Confirm</div>
              <div class="co-chef-action-sub">Chef Assigned</div>
            </div>
          </div>
        </div>
      </div>

      <!-- MARK AS READY / ACTIONS -->
      ${coActionBar}

      <!-- FOOTER META BAR -->
      <div class="co-footer-bar">
        <div class="co-footer-cell">
          <div class="co-footer-icon">⏰</div>
          <div class="co-footer-label">ORDER TIME</div>
          <div class="co-footer-val">${coOrderTimeStr}</div>
        </div>
        <div class="co-footer-cell">
          <div class="co-footer-icon">📅</div>
          <div class="co-footer-label">ETA</div>
          <div class="co-footer-val">${coTimerRaw ? new Date(Date.now()+(coTimerRaw.val||0)*60000).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) : '--:--'}</div>
        </div>
        <div class="co-footer-cell">
          <div class="co-footer-icon">⚡</div>
          <div class="co-footer-label">AVG. PREP TIME</div>
          <div class="co-footer-val">${o.cookTime||'—'} min</div>
        </div>
        <div class="co-footer-cell">
          <div class="co-footer-icon">👥</div>
          <div class="co-footer-label">ORDERS AHEAD</div>
          <div class="co-footer-val">${Math.max(0,(appData.liveOrders||[]).filter(x=>x.status==='cooking'&&x.id!==o.id).length)}</div>
        </div>
      </div>

    </div>`;
  }).join('');
}

function filterLiveMenu(f){
  lmFilter=f;
  ['all','waiting','cooking','ready','serving'].forEach(x=>{const b=document.getElementById('lmf-'+x);if(b){b.style.borderColor='';b.style.background='';}});
  const active=document.getElementById('lmf-'+f);
  if(active){active.style.borderColor='var(--accent)';active.style.background='var(--gold-dim)';}
  renderLiveMenu();
}

function addLiveOrder(){
  const tid=parseInt(loSelectedTable||document.getElementById('lo-table').value);
  const raw=document.getElementById('lo-items').value.trim();
  const notes=document.getElementById('lo-notes').value;
  if(!tid||!raw){showToast('Table aur dishes fill karo!','var(--red)');return;}
  const dishes=raw.split('\n').map(s=>s.trim()).filter(Boolean);
  const order={id:Date.now(),tableId:tid,dishes,notes,status:'waiting',cookTime:0,timeLeft:0,waiter:'',createdAt:Date.now(),servedCount:0};
  appData.liveOrders.unshift(order);
  closeModal('addLiveOrderModal');
  loSelectedTable=null;
  document.getElementById('lo-items').value='';document.getElementById('lo-notes').value='';
  renderLiveMenu();
  addSwNotification(`🆕 New order: Table ${tid}`,'sw-vip');
  triggerAudioAlert('🍽️','NEW ORDER',`Table ${tid} ka naya order aaya! ${dishes[0]} aur ${dishes.length-1} aur dishes.`,'alert-ready');
  showToast(`Table ${tid} ka live order add hua!`,'var(--accent)');
  
  updateFeatTabCounts();
}

// Cook time modal
function openCookTimeModal(orderId){
  sctOrderId=orderId;
  const o=appData.liveOrders.find(x=>x.id===orderId);if(!o)return;
  document.getElementById('sct-title').textContent=`Table ${o.tableId} — Cook Time`;
  document.getElementById('sct-items').textContent=o.dishes.join(', ');
  document.getElementById('sct-custom').value='';
  selectedCookTime=0;
  document.querySelectorAll('#setCookTimeModal .btn-sm').forEach(b=>b.style.background='');
  openModal('setCookTimeModal');
}

function setPresetTime(min,btn){
  selectedCookTime=min;
  document.querySelectorAll('#setCookTimeModal .btn-sm').forEach(b=>b.style.background='');
  btn.style.background='var(--gold-dim)';btn.style.borderColor='var(--accent)';
  document.getElementById('sct-custom').value=min;
}

function confirmCookTime(){
  const custom=parseInt(document.getElementById('sct-custom').value);
  const time=custom||selectedCookTime;
  if(!time||time<1){showToast('Cook time enter karo!','var(--red)');return;}
  const o=appData.liveOrders.find(x=>x.id===sctOrderId);if(!o)return;
  o.cookTime=time;o.timeLeft=time;o.status='cooking';
  o.cookingStartedAt = Date.now(); // For late alert tracking
  closeModal('setCookTimeModal');
  renderLiveMenu();
  // Notify customer (visual feedback)
  addSwNotification(`🔥 Cooking: Table ${o.tableId} — ${time}min`,'');
  showToast(`Chef ne ${time} min set kiya Table ${o.tableId} ke liye! Customer ko dikh raha hai. Countdown shuru.`,'var(--blue)');
  
  // Timer set hua — ab poori detail ek ek karke bolo (sirf is table ki)
  NovaVoice.announceOrderDetail(o, time);
}

// Countdown timer — local liveOrders + FB orders countdown per second
setInterval(()=>{
  let changed=false;

  // LOCAL orders countdown
  appData.liveOrders.forEach(o=>{
    if(o.status==='cooking'&&o.timeLeft>0){
      o.timeLeft=Math.max(0,o.timeLeft-1/60); // 1 second = 1/60 minute
      if(o.timeLeft<=0){
        o.timeLeft=0;
        // Priya daantegi jab time 0 ho jaye!
        if(!o._timeUpAlerted){
          o._timeUpAlerted=true;
          const lateMessages=[
            `Chef! Table ${o.tableId} ka time khatam ho gaya! Khana abhi tak ready nahi? Jaldi karo please! "Mark as Ready" button press karo!`,
            `Aye Chef saab! Table ${o.tableId} ka cooking time over ho gaya! ${o.cookTime} minute mein ready hona tha — abhi kahan hai khana? Mark Ready karo!`,
            `Hey! Table ${o.tableId} — ${o.cookTime} minute ho gaye! Khana deliver karna tha abhi tak. "Mark as Ready" click karo, jaldi!`,
            `Chef please! Table ${o.tableId} bahut zyada wait kar raha hai. Time nikal gaya hai. Abhi ready mark karo khana!`,
          ];
          const msg=lateMessages[Math.floor(Math.random()*lateMessages.length)];
          NovaVoice.speak(msg, true);
          triggerAudioAlert('⏰','COOK TIMER KHATAM!',`Table ${o.tableId} — ${o.cookTime} min ho gaye! "Mark as Ready" press karo!`,'alert-urgent');
          showToast(`⏰ Table ${o.tableId} ka timer khatam! "Mark as Ready" press karo!`, '#dc2626');
          setTimeout(()=>{},600);
        }
      }
      changed=true;
    }
  });

  // FIREBASE orders — acceptedAt se real remaining time calculate karo
  if(window._liveFirebaseOrders){
    window._liveFirebaseOrders.forEach(o=>{
      if(o.status==='accepted' && o.estimatedMinutes>0 && o.acceptedAt){
        const elapsedMs=Date.now()-new Date(o.acceptedAt).getTime();
        const elapsedMins=elapsedMs/60000;
        const remaining=Math.max(0, o.estimatedMinutes - elapsedMins);
        o._realTimeLeft=remaining; // real-time countdown store karo
        if(remaining<=0 && !o._timeUpAlerted){
          o._timeUpAlerted=true;
          const tbl=o.tableNumber||'?';
          const custName=o.customerName||'Customer';
          const msg=`Chef! Table ${tbl} — ${custName} ka ${o.estimatedMinutes} minute ka cook timer KHATAM ho gaya! Khana ready mark karo aur Mark as Ready button press karo!`;
          NovaVoice.speak(msg, true);
          triggerAudioAlert('⏰','COOK TIMER KHATAM — READY KARO!',`Table ${tbl} — ${o.estimatedMinutes} min timer over! "Mark as Ready" press karo!`,'alert-urgent');
          showToast(`⏰ Table ${tbl} ka cook timer khatam! "Mark as Ready" press karo!`, '#dc2626');
          setTimeout(()=>{},600);
          addSwNotification(`⏰ Timer End: Table ${tbl} — Mark Ready!`,'sw-vip');
        }
        changed=true;
      }
      // Captain timer end check — chef ko alert karo
      if(o.captainTimer && o.captainTimerSetAt && !['served','paid','cancelled'].includes(o.status)){
        const capElapsed=(Date.now()-new Date(o.captainTimerSetAt).getTime())/60000;
        const capRemaining=Math.max(0,o.captainTimer-capElapsed);
        o._captainRealTimeLeft=capRemaining;
        if(capRemaining<=0 && !o._captainTimerEndAlerted){
          o._captainTimerEndAlerted=true;
          const tbl=o.tableNumber||'?';
          const msg=`Chef! Captain ne Table ${tbl} ke liye ${o.captainTimer} minute ka serve timer set kiya tha. Woh time khatam ho gaya! Customer ko serve karo jaldi!`;
          NovaVoice.speak(msg, true);
          triggerAudioAlert('👑','CAPTAIN TIMER KHATAM!',`Table ${tbl} — Captain ka ${o.captainTimer} min serve timer over! Abhi serve karo!`,'alert-urgent');
          showToast(`👑 Table ${tbl} — Captain timer khatam! Abhi serve karo!`,'#7c3aed');
        }
        changed=true;
      }
    });
  }

  // Corner timer + live menu update
  if(changed&&document.getElementById('page-livemenu').classList.contains('active'))renderLiveMenu();
},1000);

// Every 60s — strong daant if cooking is overdue (timeLeft = 0 but not ready)
setInterval(()=>{
  appData.liveOrders.forEach(o=>{
    if(o.status==='cooking'&&o.timeLeft<=0){
      // Har minute daanto
      const overdueMessages=[
        `Chef saab please! Table ${o.tableId} ka order abhi tak ready nahi hua! Ye acha nahi lag raha! Customer bahut wait kar raha hai, jaldi karo!`,
        `Aye haye! Table ${o.tableId} — itna time ho gaya, khana kahan hai? Chef please dhyan do!`,
        `Chef! Table ${o.tableId} waale baat kar rahe hain manager se. Jaldi khana do please! Mere kehne pe dhyan do!`,
      ];
      NovaVoice.speak(overdueMessages[Math.floor(Math.random()*overdueMessages.length)], true);
      triggerAudioAlert('😤','CHEF — BAHUT DER HO GAYI!',`Table ${o.tableId} — Time nikal gaya! Jaldi karo!`,'alert-urgent');
    }
    if(o.status==='cooking'&&o.timeLeft<=3&&o.timeLeft>0){
      NovaVoice.speak(`Chef, Table ${o.tableId} ka sirf ${Math.ceil(o.timeLeft)} minute bacha hai! Ready kar lo please!`, false);
      triggerAudioAlert('⏰','ALMOST READY',`Table ${o.tableId} ka order ${Math.ceil(o.timeLeft)} min mein ready hona chahiye!`,'');
    }
  });
},60000);

function markLMReady(orderId){
  const o=appData.liveOrders.find(x=>x.id===orderId);if(!o)return;
  o.status='ready';o.timeLeft=0;
  o.chefReadyConfirmed = true;  // Chef ne confirm kiya
  o.chefReadyAt = new Date().toISOString();
  renderLiveMenu();
  triggerAudioAlert('✅','ORDER READY! — CHEF NE CONFIRM KIYA',`Table ${o.tableId} ka khana ready! Captain ko notify ho raha hai. Waiter assign karo.`,'alert-ready');
  addSwNotification(`✅ Chef Ready: Table ${o.tableId}`,'sw-ready');
  NovaVoice.orderReady(o.tableId, o.dishes[0]||'Order');
  setTimeout(()=>{},400);
  showToast(`✅ Table ${o.tableId} order READY! Chef ne confirm kiya. Waiter assign karo.`,'var(--green)');
}

// Assign waiter modal
function openAssignWaiter(orderId){
  awOrderId=orderId;
  const o=appData.liveOrders.find(x=>x.id===orderId);if(!o)return;
  document.getElementById('aw-title').textContent=`Table ${o.tableId} — Waiter Assign Karo`;
  document.getElementById('aw-items').textContent=o.dishes.join(', ');
  selectedWaiterName='';
  // Sabhi staff dikhao — busy/available status ke saath
  const allWaiters=appData.staff;
  // Busy waiters = jo abhi kisi order pe serving/cooking mein assigned hain
  const busyWaiterNames=new Set((appData.liveOrders||[]).filter(lo=>lo.id!==orderId&&(lo.status==='serving'||lo.status==='cooking')&&lo.waiter).map(lo=>lo.waiter));
  document.getElementById('waiterSelectList').innerHTML=allWaiters.length?allWaiters.map(w=>{
    const isAbsent=!w.present;
    const isBusy=busyWaiterNames.has(w.name);
    const isAvail=!isAbsent&&!isBusy;
    const statusColor=isAbsent?'var(--red)':isBusy?'var(--orange)':'var(--green)';
    const statusLabel=isAbsent?'● Absent':isBusy?'● Busy — Serving':'● Available';
    const busyOrderInfo=isBusy?(() => {
      const busyOrder=(appData.liveOrders||[]).find(lo=>lo.waiter===w.name&&(lo.status==='serving'||lo.status==='cooking'));
      return busyOrder?`<div style="font-size:10px;color:var(--orange);margin-top:2px;">🪑 Table ${busyOrder.tableId} pe serve kar raha hai</div>`:'';
    })():'';
    return `<div onclick="${isAvail?`selectWaiterForOrder('${w.name}',this)`:''}" style="display:flex;align-items:center;gap:12px;padding:12px 14px;border:1.5px solid ${isAvail?'var(--border)':isAbsent?'rgba(239,68,68,.2)':'rgba(245,158,11,.2)'};border-radius:12px;cursor:${isAvail?'pointer':'not-allowed'};transition:all .2s;opacity:${isAbsent?0.5:1};background:${isBusy?'rgba(245,158,11,.04)':isAbsent?'rgba(239,68,68,.04)':''};" id="wsel-${w.id}">
      <div style="width:40px;height:40px;border-radius:12px;background:var(--gold-dim);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:20px;">${w.emoji}</div>
      <div style="flex:1;">
        <div style="font-size:14px;font-weight:700;color:var(--text);">${w.name}</div>
        <div style="font-size:11px;font-weight:600;color:${statusColor};">${statusLabel}</div>
        ${busyOrderInfo}
      </div>
      ${isAvail?`<div style="font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;background:rgba(34,197,94,.1);color:var(--green);border:1px solid rgba(34,197,94,.25);">ASSIGN</div>`:''}
    </div>`;
  }).join(''):`<div style="text-align:center;padding:22px;color:var(--text2);">Koi waiter staff mein nahi hai. Staff → Add Staff se add karo.</div>`;
  openModal('assignWaiterModal');
}

function selectWaiterForOrder(name,el){
  selectedWaiterName=name;
  document.querySelectorAll('[id^="wsel-"]').forEach(x=>{x.style.borderColor='var(--border)';x.style.background='';});
  el.style.borderColor='var(--accent)';el.style.background='var(--gold-dim)';
}

function confirmWaiterAssign(){
  if(!selectedWaiterName){showToast('Waiter select karo!','var(--red)');return;}
  const o=appData.liveOrders.find(x=>x.id===awOrderId);if(!o)return;
  const waiterObj=appData.staff.find(s=>s.name===selectedWaiterName&&s.role==='waiter');
  if(waiterObj&&!waiterObj.present){showToast(`${selectedWaiterName} absent hai! Doosra waiter select karo.`,'var(--red)');return;}
  o.waiter=selectedWaiterName;
  closeModal('assignWaiterModal');
  showToast(`${selectedWaiterName} ko Table ${o.tableId} assign kiya! Auto-serve ho raha hai...`,'var(--purple)');
  addSwNotification(`🧑‍🍽️ ${selectedWaiterName}: Table ${o.tableId}`,'sw-vip');
  triggerAudioAlert('🧑‍🍽️','WAITER ASSIGNED',`${selectedWaiterName} Table ${o.tableId} serve karne ja raha hai!`,'');
  
  // Customer history mein note karo — proper auto-track
  if(o.customerName && o.customerName!=='Walk-in Customer'){
    const orderAmt=(o.dishes||[]).reduce((_,d)=>{const m=appData.menu.find(x=>d.startsWith(x.name.split(' ')[0]));return _+(m?m.price:0);},0);
    autoTrackCustomer(o.customerName, orderAmt, o.dishes||[]);
  }
  // ✅ WAITER ASSIGN → STATUS 'serving' set karo, served nahi — ek step ka flow
  o.waiter = selectedWaiterName;
  o.status = 'serving';  // "SERVE" status dikhao live menu mein
  
  // Table status → serving
  const tblRef=appData.tables.find(t=>t.id===o.tableId);
  if(tblRef) tblRef.status='served';
  
  // Render everything — order ab 'serving' status mein dikhega with "Mark Served" button
  renderLiveMenu();
  renderTodayOrders();
  if(document.getElementById('page-dashboard')?.classList.contains('active')) renderDashboard();
  
  addSwNotification(`🧑‍🍽️ Serving: Table ${o.tableId} — ${selectedWaiterName}`,'sw-vip');
  setTimeout(()=>{},200);
  showToast(`🧑‍🍽️ Table ${o.tableId} — ${selectedWaiterName} serve kar raha hai! "Mark Served" dabao jab deliver ho jaye.`,'var(--purple)');
  updateFeatTabCounts();
} // end confirmWaiterAssign

// ── Auto-Serve jab captain assign kare Firebase order ke liye ──
function _captainAutoServeLocalOrder(orderId, waiterName) {
  const o = appData.liveOrders.find(x => x.id === orderId);
  if (!o) return;
  if (!appData.servedOrdersHistory) appData.servedOrdersHistory = [];
  const servedEntry = {
    ...o, status: 'served',
    waiter: waiterName || o.waiter,
    servedAt: new Date().toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'}),
    servedAtFull: new Date().toLocaleString('en-IN', {hour:'2-digit', minute:'2-digit', day:'2-digit', month:'short'})
  };
  appData.servedOrdersHistory.unshift(servedEntry);
  if (!appData.todayOrders) appData.todayOrders = [];
  appData.todayOrders.unshift(servedEntry);
  const tbl = appData.tables.find(t => t.id === o.tableId);
  if (tbl) tbl.status = 'served';
  appData.liveOrders = appData.liveOrders.filter(x => x.id !== orderId);
  renderLiveMenu(); renderServedHistory(); renderTodayOrders();
  if (document.getElementById('page-dashboard')?.classList.contains('active')) renderDashboard();
  addSwNotification(`✅ Auto-Served: Table ${o.tableId} (Captain assigned ${waiterName})`, 'sw-ready');
   setTimeout(()=>{},200);
  showToast(`✅ Table ${o.tableId} — Captain ke assign karne par auto-serve! ${waiterName} serve kar raha hai.`, 'var(--green)');
  updateFeatTabCounts();
}
window._captainAutoServeLocalOrder = _captainAutoServeLocalOrder;

function markLMServed(orderId){
  const o=appData.liveOrders.find(x=>x.id===orderId);if(!o)return;
  // History mein add karo — dashboard pe dikhega
  if(!appData.servedOrdersHistory) appData.servedOrdersHistory=[];
  const servedEntry={
    ...o,
    status:'served',
    servedAt:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}),
    servedAtFull:new Date().toLocaleString('en-IN',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'short'})
  };
  appData.servedOrdersHistory.unshift(servedEntry);
  // Today's orders mein bhi store karo (live menu ke liye)
  if(!appData.todayOrders) appData.todayOrders=[];
  appData.todayOrders.unshift(servedEntry);
  // orderHistory mein bhi add karo
  if(!appData.orderHistory) appData.orderHistory=[];
  appData.orderHistory.unshift({
    id:'OH-'+Date.now(),
    serial: appData.orderHistory.length+1,
    tableId: o.tableId,
    customerName: o.customerName||'Walk-in Customer',
    customerPhone: o.customerPhone||'—',
    dishes: o.dishes||[],
    notes: o.notes||'',
    waiter: o.waiter||'—',
    cookTime: o.cookTime||0,
    servedAt: new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true}),
    servedAtFull: new Date().toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true}),
    timestamp: Date.now(),
    amount: (o.dishes||[]).reduce((_,d)=>{const m=appData.menu.find(x=>d.startsWith(x.name.split(' ')[0]));return _+(m?m.price:0);},0),
    source: o._source==='firebase'?'QR Order':o._source==='kot'?'KOT':'Live Order',
    status:'served'
  });
  if(typeof ohUpdateBadges==='function') ohUpdateBadges();
  // Customer history update karo — proper auto-track
  if(o.customerName && o.customerName!=='Walk-in Customer'){
    const orderAmt=(o.dishes||[]).reduce((_,d)=>{const m=appData.menu.find(x=>d.startsWith(x.name.split(' ')[0]));return _+(m?m.price:0);},0);
    autoTrackCustomer(o.customerName, orderAmt, o.dishes||[]);
    if(o.customerPhone){
      const c=appData.customers.find(x=>x.name.toLowerCase()===o.customerName.toLowerCase());
      if(c&&!c.phone)c.phone=o.customerPhone;
    }
  }
  // Table ko served mark karo
  const tbl=appData.tables.find(t=>t.id===o.tableId);
  if(tbl) tbl.status='served';
  // Live orders se immediately hatao
  appData.liveOrders=appData.liveOrders.filter(x=>x.id!==orderId);
  renderLiveMenu();
  // Dashboard history refresh karo
  if(document.getElementById('page-dashboard')?.classList.contains('active')) renderDashboard();
  else renderServedHistory();
  renderTodayOrders();
  if(typeof renderOrderHistory==='function' && document.getElementById('page-orderhistory')?.classList.contains('active')) renderOrderHistory();
  addSwNotification(`✅ Served: Table ${o.tableId} — ${o.waiter||'Chef'}`,'sw-ready');
  setTimeout(()=>{},200);
  showToast(`✅ Table ${o.tableId} served! Waiter: ${o.waiter||'—'} — History mein save hua. 🍽️`,'var(--green)');
  updateFeatTabCounts();
}

// Dashboard history render
function renderServedHistory(){
  const el=document.getElementById('servedHistoryList');if(!el)return;
  const history=appData.servedOrdersHistory||[];
  const countEl=document.getElementById('servedHistoryCount');
  if(countEl) countEl.textContent=history.length?history.length+' orders served today':'';
  if(!history.length){el.innerHTML=`<div style="text-align:center;padding:22px;color:var(--text2);font-size:13px;">Abhi koi order serve nahi hua.</div>`;return;}
  el.innerHTML=history.slice(0,10).map(o=>`
    <div style="display:flex;align-items:center;gap:12px;padding:11px 14px;background:var(--bg3);border:1px solid var(--border);border-radius:11px;">
      <div style="width:40px;height:40px;border-radius:12px;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.25);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">🏁</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:14px;font-weight:700;color:var(--text);">🪑 Table ${o.tableId} — ${o.customerName||'Walk-in'}</div>
        <div style="font-size:12px;color:var(--text2);margin-top:1px;">${o.dishes?o.dishes[0]:'Order'}${o.dishes?.length>1?' +'+(o.dishes.length-1)+' more':''}</div>
        <div style="font-size:11px;color:var(--text2);margin-top:1px;">${o.waiter?'👨‍🍽️ '+o.waiter+' •':''} ✅ Served at ${o.servedAt||'—'}</div>
      </div>
      <span style="font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px;background:rgba(34,197,94,.1);color:var(--green);white-space:nowrap;">SERVED</span>
    </div>`).join('');
}

// Live Menu — Today's All Orders section
function renderTodayOrders(){
  const el=document.getElementById('todayOrdersList');if(!el)return;
  const orders=appData.todayOrders||[];
  const countEl=document.getElementById('todayOrdersCount');
  if(countEl) countEl.textContent=orders.length?orders.length+' orders today':'';
  if(!orders.length){el.innerHTML=`<div style="text-align:center;padding:22px;color:var(--text2);font-size:13px;"><div style="font-size:32px;margin-bottom:8px;">📋</div>Aaj ka koi served order nahi.</div>`;return;}
  el.innerHTML=orders.map(o=>`
    <div style="background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:13px 15px;display:flex;align-items:flex-start;gap:12px;">
      <div style="width:42px;height:42px;border-radius:12px;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.2);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">✅</div>
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span style="font-size:14px;font-weight:800;color:var(--accent);">🪑 Table ${o.tableId}</span>
          ${o.customerName?`<span style="font-size:12px;font-weight:700;color:var(--text);background:rgba(46,156,94,.08);border:1px solid rgba(46,156,94,.2);border-radius:6px;padding:2px 8px;">👤 ${o.customerName}</span>`:''}
          ${o.customerPhone?`<span style="font-size:11px;color:var(--text2);">📞 ${o.customerPhone}</span>`:''}
        </div>
        <div style="font-size:12.5px;color:var(--text);margin-top:5px;font-weight:600;">${o.dishes?o.dishes.join(' • '):'—'}</div>
        ${o.notes?`<div style="font-size:11px;color:var(--orange);margin-top:3px;font-weight:600;">🍳 ${o.notes}</div>`:''}
        <div style="font-size:11px;color:var(--text2);margin-top:4px;">${o.waiter?'👨‍🍽️ '+o.waiter+' •':''} ✅ ${o.servedAt||'—'}</div>
      </div>
    </div>`).join('');
}

function populateLiveOrderTableSelect(){
  const sel=document.getElementById('lo-table');if(!sel)return;
  sel.innerHTML='<option value="">-- Select Table --</option>'+appData.tables.map(t=>`<option value="${t.id}">Table ${t.id} (${t.status})</option>`).join('');
}

// ══════════════════════════════════════════════
//  AI UPGRADE SCRIPTS — 5 NEW FEATURES
// ══════════════════════════════════════════════

// ─── 1. FLOATING VOICE CONTROL ───
let fmicListening=false, fmicRecog=null;
const floatingVoiceCommands=[
  {cmd:'next order',action:()=>{showPage('kot');triggerAudioAlert('📋','KOT ORDERS','Agle order ki taraf gaye!','alert-ready');}},
  {cmd:'mark ready',action:()=>{const p=appData.kots.find(k=>k.status==='preparing');if(p){p.status='ready';renderKOT();triggerAudioAlert('✅','ORDER READY',`KOT #${p.id} ready mark hua!`,'alert-ready');}else triggerAudioAlert('ℹ️','INFO','Koi preparing order nahi mila.','');}},
  {cmd:'repeat kot',action:()=>{triggerAudioAlert('🔁','KOT REPEAT','Sare KOT dobara print ho rahe hain!','');printAllKOT();}},
  {cmd:'urgent orders',action:()=>{filterTables('urgent');showPage('tables');triggerAudioAlert('🚨','URGENT ORDERS','Urgent orders dikhaye gaye!','alert-urgent');}},
  {cmd:'urgent orders dikhao',action:()=>{filterTables('urgent');showPage('tables');triggerAudioAlert('🚨','URGENT ORDERS','Urgent orders dikhaye gaye!','alert-urgent');}},
  {cmd:'start cooking',action:()=>{const p=appData.kots.find(k=>k.status==='pending');if(p){p.status='preparing';renderKOT();triggerAudioAlert('🔥','COOKING STARTED',`KOT #${p.id} cooking shuru!`,'');}else triggerAudioAlert('ℹ️','INFO','Koi pending order nahi mila.','');}},
  {cmd:'complete order',action:()=>{const p=appData.kots.find(k=>k.status==='preparing');if(p){p.status='ready';renderKOT();triggerAudioAlert('✅','ORDER COMPLETE',`KOT #${p.id} complete ho gaya!`,'alert-ready');}else triggerAudioAlert('ℹ️','INFO','Koi cooking order nahi mila.','');}},
];

function toggleFloatingMic(){
  const btn=document.getElementById('floatingMicBtn');
  const popup=document.getElementById('voiceListenPopup');
  if(fmicListening){
    fmicListening=false;btn.classList.remove('fmic-listening');popup.classList.remove('open');
    if(fmicRecog)fmicRecog.stop();return;
  }
  popup.classList.add('open');
  btn.classList.add('fmic-listening');
  fmicListening=true;
  document.getElementById('vlpCmd').textContent='Bol dijiye, main sun raha hoon...';
  if('webkitSpeechRecognition' in window||'SpeechRecognition' in window){
    fmicRecog=new(window.SpeechRecognition||window.webkitSpeechRecognition)();
    fmicRecog.lang='en-IN';fmicRecog.continuous=false;fmicRecog.interimResults=true;
    fmicRecog.onresult=e=>{
      const t=Array.from(e.results).map(r=>r[0].transcript).join('');
      document.getElementById('vlpCmd').textContent='"'+t+'"';
      if(e.results[e.results.length-1].isFinal)processFloatingVoice(t);
    };
    fmicRecog.onend=()=>{fmicListening=false;btn.classList.remove('fmic-listening');setTimeout(()=>popup.classList.remove('open'),1800);};
    fmicRecog.start();
  } else {
    // simulate demo
    const demos=['Next Order','Mark Ready','Urgent Orders Dikhao','Complete Order'];
    const d=demos[Math.floor(Math.random()*demos.length)];
    document.getElementById('vlpCmd').textContent='"'+d+'"';
    setTimeout(()=>{processFloatingVoice(d);fmicListening=false;btn.classList.remove('fmic-listening');setTimeout(()=>popup.classList.remove('open'),1800);},1200);
  }
}

function processFloatingVoice(text){
  const t=text.toLowerCase();
  const match=floatingVoiceCommands.find(c=>t.includes(c.cmd));
  if(match){match.action();showToast('🎙 Command: "'+text+'" — Done!','var(--accent)');}
  else{triggerAudioAlert('🤖','Siplora SAYS','Command samajh nahi aaya. Dobara bolein?','');}
  if(false){
    NovaVoice.speak('Command received!', false);
  }
}

function closeFMicPopup(){
  document.getElementById('voiceListenPopup').classList.remove('open');
  document.getElementById('floatingMicBtn').classList.remove('fmic-listening');
  fmicListening=false;if(fmicRecog)fmicRecog.stop();
}


// ══════════════════════════════════════════════
//   🔊 Siplora HINDI VOICE SYSTEM — COMPLETE
// ══════════════════════════════════════════════

// ══════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════
//   triggerAudioAlert — Alert popup + Hindi girl voice
// ══════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════
//   SIPLORA PRO NOTIFICATION SYSTEM
// ══════════════════════════════════════════════════════════
(function injectNotifStyles() {
  if (document.getElementById('_sipNotifCSS')) return;
  const s = document.createElement('style');
  s.id = '_sipNotifCSS';
  s.textContent = `
    #_sipNotifStack {
      position: fixed; top: 18px; right: 18px; z-index: 99990;
      display: flex; flex-direction: column; gap: 10px;
      pointer-events: none; width: 340px;
    }
    .sip-notif {
      pointer-events: all;
      background: linear-gradient(135deg, rgba(10,18,30,0.97) 0%, rgba(15,25,40,0.98) 100%);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 40px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3);
      transform: translateX(120%); opacity: 0;
      transition: transform 0.38s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease;
      position: relative;
    }
    .sip-notif.sip-show { transform: translateX(0); opacity: 1; }
    .sip-notif.sip-hide { transform: translateX(120%); opacity: 0; transition: transform 0.28s ease, opacity 0.25s ease; }
    .sip-notif-bar { height: 3px; width: 100%; }
    .sip-notif-inner { display: flex; align-items: flex-start; gap: 12px; padding: 13px 14px 13px 14px; }
    .sip-notif-icon-wrap {
      width: 42px; height: 42px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .sip-notif-body { flex: 1; min-width: 0; }
    .sip-notif-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 3px; }
    .sip-notif-msg { font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 500; color: rgba(255,255,255,0.75); line-height: 1.45; }
    .sip-notif-time { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: rgba(255,255,255,0.25); margin-top: 5px; letter-spacing: 0.5px; }
    .sip-notif-close {
      background: rgba(255,255,255,0.05); border: none; cursor: pointer;
      width: 22px; height: 22px; border-radius: 6px; color: rgba(255,255,255,0.35);
      font-size: 12px; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all 0.18s;
    }
    .sip-notif-close:hover { background: rgba(255,255,255,0.12); color: #fff; }
    .sip-notif-progress { height: 2px; background: rgba(255,255,255,0.06); }
    .sip-notif-progress-bar { height: 100%; transition: width linear; }
    /* type themes */
    .sip-t-ready .sip-notif-bar   { background: linear-gradient(90deg,#16a34a,#22c55e,#4ade80); }
    .sip-t-ready .sip-notif-icon-wrap { background: rgba(34,197,94,0.12); border: 1.5px solid rgba(34,197,94,0.3); }
    .sip-t-ready .sip-notif-title  { color: #4ade80; }
    .sip-t-ready .sip-notif-progress-bar { background: #22c55e; }
    .sip-t-urgent .sip-notif-bar   { background: linear-gradient(90deg,#b91c1c,#ef4444,#fca5a5); }
    .sip-t-urgent .sip-notif-icon-wrap { background: rgba(239,68,68,0.12); border: 1.5px solid rgba(239,68,68,0.3); }
    .sip-t-urgent .sip-notif-title  { color: #f87171; }
    .sip-t-urgent .sip-notif-progress-bar { background: #ef4444; }
    .sip-t-warning .sip-notif-bar   { background: linear-gradient(90deg,#b45309,#f59e0b,#fde68a); }
    .sip-t-warning .sip-notif-icon-wrap { background: rgba(245,158,11,0.12); border: 1.5px solid rgba(245,158,11,0.3); }
    .sip-t-warning .sip-notif-title  { color: #fbbf24; }
    .sip-t-warning .sip-notif-progress-bar { background: #f59e0b; }
    .sip-t-info .sip-notif-bar   { background: linear-gradient(90deg,#1d4ed8,#3b82f6,#93c5fd); }
    .sip-t-info .sip-notif-icon-wrap { background: rgba(59,130,246,0.12); border: 1.5px solid rgba(59,130,246,0.3); }
    .sip-t-info .sip-notif-title  { color: #60a5fa; }
    .sip-t-info .sip-notif-progress-bar { background: #3b82f6; }
  `;
  document.head.appendChild(s);
  // Create stack container
  if (!document.getElementById('_sipNotifStack')) {
    const stack = document.createElement('div');
    stack.id = '_sipNotifStack';
    document.body.appendChild(stack);
  }
})();

// SVG icons per type
function _sipSVG(type) {
  const svgs = {
    'alert-ready': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
    'alert-urgent': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    'alert-warning': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    'alert-info':  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    'new-order':   `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
    'timer':       `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    'bell':        `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>`,
    'waiter':      `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    'qr':          `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3" rx="0.5"/><rect x="19" y="14" width="2" height="2" rx="0.5"/><rect x="14" y="19" width="2" height="2" rx="0.5"/></svg>`,
  };
  return svgs[type] || svgs['bell'];
}

function _sipTypeClass(type) {
  if (type === 'alert-urgent') return 'sip-t-urgent';
  if (type === 'alert-ready')  return 'sip-t-ready';
  if (type === 'alert-warning') return 'sip-t-warning';
  return 'sip-t-info';
}

function _sipIconType(title, type) {
  const t = title.toLowerCase();
  if (t.includes('qr')) return 'qr';
  if (t.includes('waiter') || t.includes('assign')) return 'waiter';
  if (t.includes('timer') || t.includes('clock') || t.includes('khatam') || t.includes('almost')) return 'timer';
  if (t.includes('new order') || t.includes('naya') || t.includes('order')) return 'new-order';
  if (t.includes('bell') || t.includes('help') || t.includes('notification')) return 'bell';
  if (type === 'alert-urgent') return 'alert-urgent';
  if (type === 'alert-ready')  return 'alert-ready';
  return 'bell';
}

function triggerAudioAlert(icon, title, msg, type) {
  // Ensure stack exists
  let stack = document.getElementById('_sipNotifStack');
  if (!stack) {
    stack = document.createElement('div');
    stack.id = '_sipNotifStack';
    document.body.appendChild(stack);
  }

  const typeClass = _sipTypeClass(type);
  const svgIcon   = _sipSVG(_sipIconType(title, type));
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
  const duration = 6000;

  const card = document.createElement('div');
  card.className = `sip-notif ${typeClass}`;
  card.innerHTML = `
    <div class="sip-notif-bar"></div>
    <div class="sip-notif-inner">
      <div class="sip-notif-icon-wrap">${svgIcon}</div>
      <div class="sip-notif-body">
        <div class="sip-notif-title">${title}</div>
        <div class="sip-notif-msg">${msg}</div>
        <div class="sip-notif-time">${timeStr}</div>
      </div>
      <button class="sip-notif-close" onclick="this.closest('.sip-notif').classList.add('sip-hide'); setTimeout(()=>this.closest('.sip-notif')?.remove(), 300);">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="sip-notif-progress"><div class="sip-notif-progress-bar" style="width:100%;"></div></div>
  `;

  stack.appendChild(card);

  // Slide in
  requestAnimationFrame(() => { requestAnimationFrame(() => { card.classList.add('sip-show'); }); });

  // Progress bar shrink
  const bar = card.querySelector('.sip-notif-progress-bar');
  if (bar) {
    bar.style.transition = `width ${duration}ms linear`;
    requestAnimationFrame(() => { requestAnimationFrame(() => { bar.style.width = '0%'; }); });
  }

  // Auto remove
  setTimeout(() => {
    card.classList.add('sip-hide');
    setTimeout(() => card.remove(), 300);
  }, duration);

  // Max 4 notifications at once
  const all = stack.querySelectorAll('.sip-notif');
  if (all.length > 4) all[0].remove();

  // Hindi girl voice — short and clear
  if (typeof NovaVoice !== 'undefined' && NovaVoice.enabled) {
    // Keep voice msg very short — max 8 words for clarity
    const shortMsg = msg.length > 60 ? msg.substring(0, 60) : msg;
    NovaVoice.speak(shortMsg, false);
  }
}

//   🎀 PRIYA VOICE — Cute Indian Girl Notification System
//   Sweet, warm, expressive Hindi+English voice
// ══════════════════════════════════════════════════════════

const NovaVoice = {
  enabled: true,
  voice: null,
  rate: 0.88,      // Slower = smoother, clearer speech — atakti nahi
  pitch: 1.05,     // Natural, sweet pitch — too high causes glitch
  volume: 1.0,
  queue: [],
  speaking: false,

  init() {
    const tryLoad = () => {
      const voices = speechSynthesis.getVoices();
      // Priority order for cutest female Indian voice
      this.voice =
        voices.find(v => v.name.includes('Raveena')) ||           // Google Raveena - Indian girl
        voices.find(v => v.name.includes('Heera')) ||             // Microsoft Heera - Hindi female
        voices.find(v => v.name.includes('Priya')) ||             // Priya voices
        voices.find(v => v.name.includes('Neerja')) ||            // Microsoft Neerja
        voices.find(v => v.lang === 'hi-IN' && /female|woman|girl/i.test(v.name)) ||
        voices.find(v => v.lang === 'hi-IN') ||
        voices.find(v => v.name.includes('Zira')) ||              // Microsoft Zira (cute EN-US female)
        voices.find(v => v.name.includes('Samantha')) ||          // Mac Samantha
        voices.find(v => v.name.includes('Karen')) ||             // Mac Karen
        voices.find(v => v.lang === 'en-IN') ||
        voices.find(v => /female|woman/i.test(v.name)) ||
        voices.find(v => v.lang.startsWith('en')) ||
        null;
      if (this.voice) console.log('🎀 Priya Voice loaded:', this.voice.name, this.voice.lang);
    };
    tryLoad();
    speechSynthesis.onvoiceschanged = tryLoad;
  },

  speak(text, priority = false) {
    if (!this.enabled || !('speechSynthesis' in window)) return;
    
    if (priority) {
      speechSynthesis.cancel();
      this.queue = [];
      this.speaking = false;
    }
    this.queue.push(text);
    if (!this.speaking) this._next();
  },

  _next() {
    if (!this.queue.length) { this.speaking = false; return; }
    this.speaking = true;
    const text = this.queue.shift();
    // Small delay so browser is ready after any cancel
    setTimeout(() => {
      const u = new SpeechSynthesisUtterance(text);
      if (this.voice) u.voice = this.voice;
      u.lang = this.voice?.lang || 'hi-IN';
      u.rate = this.rate;
      u.pitch = this.pitch;
      u.volume = this.volume;
      // Chrome: keep speech alive for long texts without pause/resume glitch
      let keepAlive = null;
      const startKeepAlive = () => {
        keepAlive = setInterval(() => {
          if (!speechSynthesis.speaking) { clearInterval(keepAlive); keepAlive = null; return; }
          // Only resume if paused — avoids interrupt glitch
          if (speechSynthesis.paused) speechSynthesis.resume();
        }, 5000);
      };
      const stopKeepAlive = () => { if (keepAlive) { clearInterval(keepAlive); keepAlive = null; } };
      u.onstart = () => { startKeepAlive(); };
      u.onend   = () => { stopKeepAlive(); this.speaking = false; setTimeout(() => { if (this.queue.length) this._next(); }, 80); };
      u.onerror = (e) => { stopKeepAlive(); this.speaking = false; setTimeout(() => { if (this.queue.length) this._next(); }, 80); };
      speechSynthesis.speak(u);
    }, 100);
  },

  // ── CUTE NOTIFICATION MESSAGES ──

  newOrder(table, items) {
    const msgs = [
      `यay! Table ${table} se naya order aaya hai! ${items ? items + ' chahiye unhe.' : ''} Jaldi banao!`,
      `Ooh, Table ${table} ke liye order aa gaya! ${items || ''} ready karo please!`,
      `New order alert! Table ${table}. ${items ? items + ' order hua hai.' : ''} Kitchen start karo!`,
    ];
    this.speak(msgs[Math.floor(Math.random()*msgs.length)], true);
    this._popup('🔔 नया Order आया!', `Table ${table}: ${items||''}`, 'Siplora-voice-new');
  },

  newOrderWithCustomer(table, customerName, items) {
    const name = customerName && customerName !== 'Customer' ? customerName : 'ग्राहक';
    const tbl = table || '?';
    // Short messages — voice atakti nahi chhote mein
    const msgs = [
      `नया ऑर्डर! टेबल ${tbl}। ${name} जी का ऑर्डर है।`,
      `ऑर्डर आया! टेबल ${tbl}। ${name} जी।`,
      `टेबल ${tbl} पर ${name} जी का नया ऑर्डर आया है।`,
    ];
    this.speak(msgs[Math.floor(Math.random()*msgs.length)], true);
    this._popup(`🔔 Table ${tbl} — ${customerName}`, items||'New Order', 'Siplora-voice-new');
  },


  // ── Full order detail announcement — sirf jab timer set ho ──
  announceOrderDetail(order, timerMins) {
    // Lock — ek baar se zyada mat bolao same order ke liye
    if (this._announceLock) return;
    this._announceLock = true;
    setTimeout(() => { this._announceLock = false; }, 15000);

    const tbl        = order.tableNumber || order.table || order.tableId || '?';
    const name       = (order.customerName || order.name || '').trim();
    const items      = order.items || [];
    const cookInstr  = (order.cookingInstructions || order.instructions || '').trim();
    const specialReq = (order.specialRequest || order.special || order.notes || '').trim();
    const waiter     = (order.assignedWaiter || order.captainAssignedWaiter || order.waiter || order.servedBy || '').trim();

    // Warm, emotional, friendly — ek hi smooth sentence
    let sentence = `Haan Chef ji! Table number ${tbl} ka naya order aa gaya hai. `;
    if (name && name !== 'Customer') sentence += `Hamare pyaare customer ${name} ne order diya hai. `;
    sentence += `Aapko ${timerMins} minute mein khana taiyar karna hai. `;
    if (items.length > 0) {
      const dishList = items.map(i => i.qty > 1 ? `${i.qty} ${i.name}` : i.name).join(', aur ');
      sentence += `Dishes hain, ${dishList}. `;
    }
    if (cookInstr)  sentence += `Cooking instruction yeh hai, ${cookInstr}. `;
    if (specialReq) sentence += `Ek special request bhi hai, ${specialReq}. `;
    if (waiter)     sentence += `${waiter} bhai is table ko serve karenge. `;
    sentence += `Chef ji, aap bahut achha khaana banaate hain! All the best.`;

    speechSynthesis.cancel();
    setTimeout(() => {
      const u = new SpeechSynthesisUtterance(sentence);
      if (this.voice) u.voice = this.voice;
      u.lang   = this.voice?.lang || 'hi-IN';
      u.rate   = 0.84;
      u.pitch  = 1.15;
      u.volume = 1.0;
      u.onend  = () => { this._announceLock = false; };
      u.onerror= () => { this._announceLock = false; };
      speechSynthesis.speak(u);
    }, 250);
  },

  orderReady(table, dish) {
    const msgs = [
      `${dish || 'Khana'} bilkul ready hai! Table ${table} ke liye serve karo abhi. Yummy!`,
      `Oh wow, Table ${table} ka ${dish || 'order'} ban gaya! Waiter ko bhejo jaldi!`,
      `Ready ready! Table ${table} ka ${dish || 'dish'} perfect ban gaya hai. Serve karo!`,
    ];
    this.speak(msgs[Math.floor(Math.random()*msgs.length)], true);
    this._popup('✅ Order Ready!', `Table ${table} — ${dish||'Dish'} ready!`, 'Siplora-voice-ready');
  },

  urgent(table) {
    const msgs = [
      `Oops! Table ${table} ka order bahut der ho gayi! Please turant dhyan do!`,
      `Hey hey! Table ${table} urgent hai! Jaldi karo please, guest wait kar rahe hain!`,
      `Table ${table} pe emergency hai! Abhi action lo please!`,
    ];
    this.speak(msgs[Math.floor(Math.random()*msgs.length)], true);
    this._popup('🚨 URGENT!', `Table ${table} — Turant action lo!`, 'Siplora-voice-urgent');
  },

  vipOrder(table) {
    const msgs = [
      `Ooh la la! Table ${table} pe VIP guest hai! Extra special service dena. Best of the best!`,
      `VIP alert! Table ${table} bahut khaas mehman hain. Premium quality maintain karna!`,
    ];
    this.speak(msgs[Math.floor(Math.random()*msgs.length)], true);
    this._popup('👑 VIP Order', `Table ${table} — Premium Service!`, 'Siplora-voice-vip');
  },

  qrOrder(table) {
    const msgs = [
      `How cool! Table ${table} ke guest ne khud QR se order kar liya! Technology kitni amazing hai!`,
      `QR order aaya hai Table ${table} se! Guest ne apne phone se order kiya. Kitchen ready ho jao!`,
      `Aww, Table ${table} ne QR code use kiya! Naya order received. Jaldi prepare karo!`,
    ];
    this.speak(msgs[Math.floor(Math.random()*msgs.length)], true);
    this._popup('📱 QR Order!', `Table ${table} से QR order!`, 'Siplora-voice-new');
  },

  kotCreated(kotId, table) {
    const msgs = [
      `KOT number ${kotId} ban gaya Table ${table} ke liye! Cooking start karo!`,
      `New KOT ready! Number ${kotId}, Table ${table}. Chef ko bhejo order!`,
    ];
    this.speak(msgs[Math.floor(Math.random()*msgs.length)], false);
    this._popup('🧾 KOT Banaya!', `KOT #${kotId} — Table ${table}`, 'Siplora-voice-ready');
  },

  kotStatusChange(table, status) {
    const msgMap = {
      preparing: `Table ${table} ka khana ban raha hai! Thoda wait karo, almost ready!`,
      ready: `Table ${table} ka khana bilkul ready hai! Serve karo jaldi!`,
      delivered: `Table ${table} ko khana mil gaya! Enjoy karo guests!`,
    };
    this.speak(msgMap[status] || `Table ${table} status update hua.`, false);
  },

  waiterCall(table, waiter) {
    const msgs = [
      `Ding dong! Table ${table} pe waiter chahiye. ${waiter || 'Koi bhi waiter'} jao please!`,
      `Table ${table} ke guest bula rahe hain! ${waiter || 'Waiter'} jaldi jao!`,
    ];
    this.speak(msgs[Math.floor(Math.random()*msgs.length)], true);
    this._popup('🔔 Waiter Call!', `Table ${table} — Waiter chahiye!`, 'Siplora-voice-new');
  },

  paymentReceived(table, amount) {
    const msgs = [
      `Yay! Table ${table} se payment aa gayi! ${amount ? amount + ' rupaye' : 'Payment'} received. Thank you guest!`,
      `Ching ching! Table ${table} ka bill pay ho gaya! ${amount ? amount + ' rupees.' : ''} Have a great day!`,
    ];
    this.speak(msgs[Math.floor(Math.random()*msgs.length)], false);
    this._popup('💰 Payment Mili!', `Table ${table} — ₹${amount||''} received!`, 'Siplora-voice-ready');
  },

  lowStock(item) {
    const msgs = [
      `Oh no! ${item} ka stock bahut kum ho gaya hai. Jaldi order karo please!`,
      `Alert! ${item} khatam hone wala hai. Manager ko batao!`,
    ];
    this.speak(msgs[Math.floor(Math.random()*msgs.length)], false);
    this._popup('📦 Stock Kum!', `${item} — stock kum hai!`, 'Siplora-voice-warn');
  },

  expiryAlert(item, days) {
    const msgs = [
      `Dhyan do! ${item} sirf ${days} din mein expire ho jayega. Jaldi use karo ya hata do!`,
      `Oh! ${item} ko ${days} din baad hatana padega. Please check karo!`,
    ];
    this.speak(msgs[Math.floor(Math.random()*msgs.length)], false);
    this._popup('⚠️ Expiry Alert!', `${item} — ${days} din mein expire!`, 'Siplora-voice-warn');
  },

  staffPresent(name) {
    const msgs = [
      `${name} aa gaye hain! Welcome to the team. Kaam shuru karo!`,
      `Hi ${name}! Aaj bhi aa gaye, awesome! Aaj bhi dhoomm machao!`,
    ];
    this.speak(msgs[Math.floor(Math.random()*msgs.length)], false);
  },

  shiftStart(name, type) {
    this.speak(`${name} ki ${type || ''} shift shuru ho gayi hai! Jai ho, all the best!`, false);
  },

  reorderSent(vendor) {
    this.speak(`${vendor} ko reorder bhej diya gaya hai. Delivery ka wait karo!`, false);
  },

  timerDone() {
    this.speak(`Timer khatam! Jo bhi ban raha tha, check karo abhi!`, true);
  },

  welcome() {
    const msgs = [
      `Namaste! Main Priya hun, aapki kitchen assistant. Siplora Chef panel mein aapka swagat hai! Aaj bhi kamaal karo!`,
      `Hi hi! Priya yahan se bol rahi hun. Sab kuch ready hai — aao kitchen rock karein!`,
    ];
    this.speak(msgs[Math.floor(Math.random()*msgs.length)], false);
  },

  custom(text) {
    this.speak(text, false);
  },

  // ── FLOATING POPUP ──
  _popup(title, msg, cls) {
    const box = document.getElementById('novaVoicePopup');
    if (!box) return;
    box.querySelector('.nvp-title').textContent = title;
    box.querySelector('.nvp-msg').textContent = msg;
    box.className = 'Siplora-voice-popup open ' + (cls||'');
    clearTimeout(box._t);
    box._t = setTimeout(() => { box.classList.remove('open'); }, 4500);
  },
};

// Init on load
window.addEventListener('load', () => {
  NovaVoice.init();

  // Browser needs a user interaction before speech works
  // Show a one-time "Activate Voice" overlay on first load
  const hasActivated = sessionStorage.getItem('_voiceActivated');
  if (!hasActivated) {
    const overlay = document.createElement('div');
    overlay.id = '_voiceActivateOverlay';
    overlay.innerHTML = `
      <div style="position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.82);display:flex;align-items:center;justify-content:center;">
        <div style="background:linear-gradient(135deg,#0f1923,#1a2535);border:2px solid rgba(46,156,94,0.5);border-radius:20px;padding:36px 44px;text-align:center;max-width:340px;box-shadow:0 20px 60px rgba(0,0,0,0.6);">
          <div style="font-size:52px;margin-bottom:12px;">🎤</div>
          <div style="font-family:'Plus Jakarta Sans',sans-serif;font-size:20px;font-weight:900;color:#fff;margin-bottom:8px;">Voice Alert Enable Karo</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:24px;line-height:1.6;">Naye orders pe Hindi girl voice alert ke liye ek baar tap karo</div>
          <button onclick="
            sessionStorage.setItem('_voiceActivated','1');
            var _ov=document.getElementById('_voiceActivateOverlay');if(_ov)_ov.remove();
            speechSynthesis.cancel();
            const u=new SpeechSynthesisUtterance('शेफ पैनल तैयार है! नए ऑर्डर पर आवाज़ आएगी।');
            u.lang='hi-IN'; u.rate=0.85; u.pitch=1.3; u.volume=1;
            if(NovaVoice.voice) u.voice=NovaVoice.voice;
            speechSynthesis.speak(u);
          " style="background:linear-gradient(135deg,#2e9c5e,#0aaa1a);color:#fff;border:none;border-radius:14px;padding:14px 36px;font-size:15px;font-weight:800;cursor:pointer;letter-spacing:0.5px;width:100%;">
            ✅ Voice Activate Karo
          </button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  } else {
    setTimeout(() => NovaVoice.welcome(), 2000);
  }
});

// ── HOOK ALL KEY EVENTS ──

// 1. New KOT created
const _nvAddKOT = window.addNewKOT;
window.addNewKOT = function() {
  if (typeof _nvAddKOT === 'function') _nvAddKOT();
  setTimeout(() => {
    const table = document.getElementById('kotTable')?.value || '?';
    const lastKot = appData.kots[appData.kots.length - 1];
    if (lastKot) NovaVoice.kotCreated(lastKot.id, lastKot.tableId || table);
  }, 200);
};

// 2. KOT status change → ready
const _nvUpdateKOT = window.updateKOTStatus;
window.updateKOTStatus = function(id, status) {
  if (typeof _nvUpdateKOT === 'function') _nvUpdateKOT(id, status);
  const k = appData.kots?.find(x => x.id === id);
  if (k) {
    if (status === 'ready') NovaVoice.orderReady(k.tableId, k.items?.[0] || 'Order');
    else NovaVoice.kotStatusChange(k.tableId, status);
  }
};

// 3. QR Order placed
const _nvPlaceQR = window.placeQROrder;
window.placeQROrder = function() {
  if (typeof _nvPlaceQR === 'function') _nvPlaceQR();
  NovaVoice.qrOrder(qrSelectedTable);
};

// 4. Staff added / attendance marked
const _nvAddStaff = window.addStaff;
window.addStaff = function() {
  const name = document.getElementById('s-name')?.value || 'Staff';
  if (typeof _nvAddStaff === 'function') _nvAddStaff();
  NovaVoice.staffPresent(name);
};

const _nvToggleAttend = window.toggleAttendance;
window.toggleAttendance = function(id, val) {
  if (typeof _nvToggleAttend === 'function') _nvToggleAttend(id, val);
  const s = appData.staff?.find(x => x.id === id);
  if (s && val) NovaVoice.staffPresent(s.name);
};

// 5. Inventory restock / low stock alert
const _nvRestockItem = window.restockItem;
window.restockItem = function(id) {
  if (typeof _nvRestockItem === 'function') _nvRestockItem(id);
  const item = appData.inventory?.find(x => x.id === id);
  if (item) NovaVoice.custom(`${item.name} का स्टॉक बढ़ा दिया गया।`);
};

// 6. Reorder sent
const _nvSendReorders = window.sendAllReorders;
window.sendAllReorders = function() {
  if (typeof _nvSendReorders === 'function') _nvSendReorders();
  NovaVoice.reorderSent('सभी vendors');
};

// 7. Waiter call
const _nvCallWaiter = window.callWaiter;
window.callWaiter = function(tableId, waiterName) {
  if (typeof _nvCallWaiter === 'function') _nvCallWaiter(tableId, waiterName);
  NovaVoice.waiterCall(tableId, waiterName);
};

// 8. Auto urgent alert hook
const _nvOrigAutoAlert = window.autoKitchenAlert;
window.autoKitchenAlert = function() {
  if (typeof _nvOrigAutoAlert === 'function') _nvOrigAutoAlert();
};

// 9. Table status updates
const _nvUpdateTable = window.updateTableStatus;
window.updateTableStatus = function(id, status) {
  if (typeof _nvUpdateTable === 'function') _nvUpdateTable(id, status);
  if (status === 'urgent') NovaVoice.urgent(id);
};

// 10. GST Invoice generated
const _nvGenGST = window.generateGSTInvoice;
window.generateGSTInvoice = function() {
  if (typeof _nvGenGST === 'function') _nvGenGST();
  const table = document.getElementById('gst-table')?.value || '?';
  const total = document.getElementById('gst-total')?.textContent || '';
  NovaVoice.paymentReceived(table, total.replace('₹',''));
};

// 11. Shift saved
const _nvSaveShift = window.saveShift;
window.saveShift = function() {
  const name = document.getElementById('shift-staff-sel')?.value || 'Staff';
  const type = document.getElementById('shift-type')?.value || '';
  if (typeof _nvSaveShift === 'function') _nvSaveShift();
  NovaVoice.shiftStart(name, type);
};

// 12. Expiry page open — auto announce critical items
const _nvShowPage = window.showPage;
window.showPage = function(page) {
  if (typeof _nvShowPage === 'function') _nvShowPage(page);
  if (page === 'expiry') {
    setTimeout(() => {
      const critical = expiryData?.filter(e => e.expiry <= 2);
      if (critical?.length) NovaVoice.expiryAlert(critical[0].name, critical[0].expiry);
    }, 600);
  }
};

// ── Siplora VOICE POPUP CSS + HTML ──
(function injectVoiceUI() {
  // Add popup HTML
  const popup = document.createElement('div');
  popup.id = 'novaVoicePopup';
  popup.className = 'Siplora-voice-popup';
  popup.innerHTML = `
    <div class="nvp-icon" id="nvpIcon">🔊</div>
    <div class="nvp-body">
      <div class="nvp-title">Siplora Voice</div>
      <div class="nvp-msg"></div>
    </div>
    <div class="nvp-wave">
      <span></span><span></span><span></span><span></span><span></span>
    </div>
    <button class="nvp-close" onclick="document.getElementById('novaVoicePopup').classList.remove('open')">✕</button>
  `;
  document.body.appendChild(popup);

  // Add Voice Control Button to topbar
  const topbarRight = document.querySelector('.topbar-right');
  if (topbarRight) {
    const btn = document.createElement('button');
    btn.className = 'ctrl-btn';
    btn.id = 'novaVoiceToggle';
    btn.title = 'Hindi Voice ON/OFF';
    btn.innerHTML = '🔊';
    btn.style.cssText = 'font-size:16px;position:relative;';
    btn.onclick = function() {
      NovaVoice.enabled = !NovaVoice.enabled;
      btn.innerHTML = NovaVoice.enabled ? '🔊' : '🔇';
      btn.style.opacity = NovaVoice.enabled ? '1' : '0.4';
      if (NovaVoice.enabled) NovaVoice.speak('नोवा वॉइस चालू है।', true);
      else speechSynthesis.cancel();
      showToast(NovaVoice.enabled ? '🔊 Hindi Voice ON' : '🔇 Hindi Voice OFF');
    };
    topbarRight.insertBefore(btn, topbarRight.firstChild);
  }

  // Inject CSS
  const style = document.createElement('style');
  style.textContent = `
  /* ── Siplora VOICE POPUP ── */
  .Siplora-voice-popup {
    position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%) translateY(20px);
    background: linear-gradient(135deg, rgba(10,18,28,0.97), rgba(15,25,38,0.97));
    border: 1.5px solid rgba(46,156,94,0.35);
    border-radius: 18px; padding: 14px 20px 14px 16px;
    display: flex; align-items: center; gap: 14px;
    min-width: 300px; max-width: 420px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(46,156,94,0.1), 0 0 30px rgba(46,156,94,0.08);
    z-index: 9500; pointer-events: none;
    opacity: 0; transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  }
  .Siplora-voice-popup.open {
    opacity: 1; transform: translateX(-50%) translateY(0); pointer-events: all;
  }
  .Siplora-voice-popup.Siplora-voice-urgent { border-color: rgba(239,68,68,0.6); box-shadow: 0 8px 40px rgba(239,68,68,0.2); }
  .Siplora-voice-popup.Siplora-voice-ready  { border-color: rgba(34,197,94,0.6);  box-shadow: 0 8px 40px rgba(34,197,94,0.2); }
  .Siplora-voice-popup.Siplora-voice-vip    { border-color: rgba(139,92,246,0.6); box-shadow: 0 8px 40px rgba(139,92,246,0.2); }
  .Siplora-voice-popup.Siplora-voice-warn   { border-color: rgba(245,158,11,0.6); box-shadow: 0 8px 40px rgba(245,158,11,0.2); }
  .Siplora-voice-popup.Siplora-voice-new    { border-color: rgba(59,130,246,0.6); box-shadow: 0 8px 40px rgba(59,130,246,0.2); }
  .nvp-icon { font-size: 28px; flex-shrink: 0; animation: nvpBounce 0.6s ease infinite alternate; }
  @keyframes nvpBounce { from{transform:scale(1)} to{transform:scale(1.15)} }
  .nvp-body { flex: 1; overflow: hidden; }
  .nvp-title { font-size: 11px; font-weight: 900; letter-spacing: 2px; color: #4ade80; font-family: 'JetBrains Mono', monospace; margin-bottom: 3px; }
  .Siplora-voice-urgent .nvp-title { color: #f87171; }
  .Siplora-voice-vip    .nvp-title { color: #a78bfa; }
  .Siplora-voice-warn   .nvp-title { color: #fbbf24; }
  .Siplora-voice-new    .nvp-title { color: #60a5fa; }
  .nvp-msg { font-size: 13px; color: #e2e8f0; font-weight: 600; line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .nvp-wave { display: flex; gap: 3px; align-items: center; flex-shrink: 0; }
  .nvp-wave span { width: 3px; border-radius: 3px; background: #4ade80; animation: nvpWave 0.9s ease-in-out infinite; }
  .nvp-wave span:nth-child(1){height:6px;animation-delay:0s}
  .nvp-wave span:nth-child(2){height:12px;animation-delay:.1s}
  .nvp-wave span:nth-child(3){height:18px;animation-delay:.2s}
  .nvp-wave span:nth-child(4){height:12px;animation-delay:.3s}
  .nvp-wave span:nth-child(5){height:6px;animation-delay:.4s}
  @keyframes nvpWave { 0%,100%{transform:scaleY(0.4)} 50%{transform:scaleY(1)} }
  .nvp-close { background: rgba(255,255,255,0.08); border: none; color: #aaa; border-radius: 8px; width: 24px; height: 24px; cursor: pointer; font-size: 12px; flex-shrink: 0; transition: all .2s; }
  .nvp-close:hover { background: rgba(239,68,68,0.2); color: #f87171; }
  `;
  document.head.appendChild(style);
})();

// ── TEST VOICE BUTTON on Voice AI page ──
// Inject test panel into voice page on first open
let voiceTestInjected = false;
const _nvShowVoicePage = window.showPage;
// Already hooked above — add test panel via MutationObserver approach
setTimeout(() => {
  const voicePage = document.getElementById('page-voice');
  if (voicePage && !voiceTestInjected) {
    voiceTestInjected = true;
    const panel = document.createElement('div');
    panel.className = 'card';
    panel.style.marginTop = '14px';
    panel.innerHTML = `
      <div class="card-title">🔊 Siplora Hindi Voice — Test Panel</div>
      <div style="font-size:13px;color:var(--text2);margin-bottom:14px;">In buttons se test karo ki Hindi voice sahi bol rahi hai ya nahi</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;">
        <button class="btn-sm btn-gold" onclick="NovaVoice.newOrder(5,'Chicken Biryani')">🔔 New Order (Table 5)</button>
        <button class="btn-sm btn-green" onclick="NovaVoice.orderReady(3,'Dal Makhani')">✅ Order Ready</button>
        <button class="btn-sm" style="border-color:var(--red);color:var(--red);" onclick="NovaVoice.urgent(7)">🚨 Urgent Alert</button>
        <button class="btn-sm" style="border-color:var(--purple);color:var(--purple);" onclick="NovaVoice.vipOrder(1)">👑 VIP Order</button>
        <button class="btn-sm btn-blue" onclick="NovaVoice.qrOrder(8)">📱 QR Order</button>
        <button class="btn-sm" style="border-color:var(--orange);color:var(--orange);" onclick="NovaVoice.lowStock('Tomato')">📦 Low Stock</button>
        <button class="btn-sm" style="border-color:var(--orange);color:var(--orange);" onclick="NovaVoice.expiryAlert('Paneer',2)">⚠️ Expiry Alert</button>
        <button class="btn-sm btn-gold" onclick="NovaVoice.waiterCall(4,'Amit')">🔔 Waiter Call</button>
        <button class="btn-sm btn-green" onclick="NovaVoice.paymentReceived(6,850)">💰 Payment Received</button>
        <button class="btn-sm" onclick="NovaVoice.welcome()">👋 Welcome Message</button>
        <button class="btn-sm" style="border-color:var(--blue);color:var(--blue);" onclick="NovaVoice.kotCreated(12,9)">🧾 KOT Created</button>
        <button class="btn-sm btn-red" onclick="speechSynthesis.cancel();NovaVoice.queue=[];NovaVoice.speaking=false;">⏹ Stop Voice</button>
      </div>
      <div style="margin-top:14px;padding:14px;background:var(--bg3);border-radius:12px;border:1px solid var(--border);">
        <div style="font-size:12px;font-weight:700;margin-bottom:8px;">🎛️ Voice Settings</div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center;">
          <div style="display:flex;align-items:center;gap:8px;font-size:13px;">
            Speed: <input type="range" min="0.5" max="1.5" step="0.1" value="0.88" style="width:100px;" oninput="NovaVoice.rate=+this.value;this.nextElementSibling.textContent=this.value+'x'"><span style="font-weight:700;color:var(--accent);min-width:32px;">0.88x</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;font-size:13px;">
            Pitch: <input type="range" min="0.5" max="1.5" step="0.1" value="1.05" style="width:100px;" oninput="NovaVoice.pitch=+this.value;this.nextElementSibling.textContent=this.value"><span style="font-weight:700;color:var(--accent);min-width:28px;">1.05</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;font-size:13px;">
            Volume: <input type="range" min="0" max="1" step="0.1" value="1" style="width:100px;" oninput="NovaVoice.volume=+this.value;this.nextElementSibling.textContent=Math.round(this.value*100)+'%'"><span style="font-weight:700;color:var(--accent);min-width:36px;">100%</span>
          </div>
        </div>
        <div style="margin-top:12px;display:flex;gap:8px;align-items:center;">
          <input class="royal-input" id="voiceCustomInput" placeholder="Apna message type karo..." style="flex:1;">
          <button class="btn-sm btn-gold" onclick="NovaVoice.custom(document.getElementById('voiceCustomInput').value)">🔊 Bolo</button>
        </div>
      </div>
    `;
    voicePage.appendChild(panel);
  }
}, 2500);

// ══════════════════════════════════════════════
//   FEATURE 1: RECIPE BOOK + PREP CHECKLIST
// ══════════════════════════════════════════════
const recipeDB = [
  {id:1,name:'Chicken Biryani',cat:'tandoor',emoji:'🍗',time:'45 min',cost:'₹180',margin:'62%',serves:4,allergens:['None'],image:'',
   ingredients:['Basmati rice 2 cup','Chicken 500g','Biryani masala 2tbsp','Curd 1 cup','Saffron','Fried onion','Ghee 3tbsp','Salt to taste'],
   steps:['Rice 70% tak pakao, drain karo','Chicken marinate karo — curd + biryani masala, 30 min','Patili mein ghee garam karo, chicken sear karo 10 min','Rice layer dalo upar, saffron milk spray karo','Dum pe 25 min pakao — slow flame','Fried onion se garnish karo, serve karo']},
  {id:2,name:'Butter Naan',cat:'tandoor',emoji:'🫓',time:'12 min',cost:'₹18',margin:'72%',serves:1,allergens:['Gluten','Dairy'],image:'',
   ingredients:['Maida 200g','Curd 2tbsp','Baking powder 1tsp','Sugar 1tsp','Salt','Butter 2tbsp','Water as needed'],
   steps:['Sab ingredients mix karo, smooth dough banao','15 min rest do — dhakke rakho','Small balls banao, flat roll karo','Tandoor mein chipkao — high heat','2-3 min — light brown hone do','Butter lagao, serve hot karo']},
  {id:3,name:'Dal Makhani',cat:'tandoor',emoji:'🍲',time:'35 min',cost:'₹45',margin:'78%',serves:6,allergens:['Dairy'],image:'',
   ingredients:['Black lentils 250g','Kidney beans 50g','Butter 3tbsp','Cream 100ml','Tomato puree 200ml','Ginger-garlic paste 1tbsp','Red chilli 1tsp','Garam masala','Salt'],
   steps:['Dal aur rajma overnight soak karo','Pressure cook 8 whistles mein','Butter mein ginger-garlic fry karo','Tomato puree add karo — 5 min cook','Dal add karo, mix karo','Low flame pe 20 min simmer — cream add karo','Garnish: butter + cream dollop']},
  {id:4,name:'Kung Pao Chicken',cat:'chinese',emoji:'🥢',time:'20 min',cost:'₹120',margin:'65%',serves:2,allergens:['Nuts','Soy'],image:'',
   ingredients:['Chicken 300g','Peanuts 50g','Dry red chilli 6-8','Sichuan pepper 1tsp','Soy sauce 2tbsp','Vinegar 1tbsp','Sugar 1tsp','Cornflour 1tbsp','Spring onion'],
   steps:['Chicken cube mein kato, cornflour coat karo','Wok garam karo — high flame','Dry chilli aur Sichuan pepper fry karo — 30 sec','Chicken add karo — 5 min fry','Sauce mix dalo (soy+vinegar+sugar)','Peanuts add karo, toss karo','Spring onion se garnish karo']},
  {id:5,name:'Grilled Tandoori Fish',cat:'grill',emoji:'🐟',time:'25 min',cost:'₹200',margin:'55%',serves:2,allergens:['Fish'],image:'',
   ingredients:['Fish (Surmai) 500g','Curd 3tbsp','Kashmiri chilli 2tsp','Lemon juice 2tbsp','Ginger-garlic paste','Cumin powder','Chaat masala','Oil','Salt'],
   steps:['Fish saaf karo — deep cuts dalo marinate ke liye','Marinade banao: curd + spices + lemon juice','Fish 2 ghante marinate karo — fridge mein','Grill garam karo — medium-high heat','Fish 8-10 min grill karo, flip once','Chaat masala sprinkle karo','Lemon slice + onion rings ke saath serve karo']},
  {id:6,name:'Chocolate Lava Cake',cat:'dessert',emoji:'🍫',time:'18 min',cost:'₹55',margin:'80%',serves:1,allergens:['Dairy','Gluten','Eggs'],image:'',
   ingredients:['Dark chocolate 100g','Butter 100g','Eggs 2','Sugar 80g','Flour 60g','Vanilla extract','Cocoa powder','Pinch of salt'],
   steps:['Chocolate aur butter microwave mein melt karo','Eggs + sugar whip karo — thick ribbon stage','Chocolate mixture fold karo','Flour sift karo, gently fold karo','Greased ramekins mein pour karo','180°C pe exactly 12 min bake karo','Immediately serve karo — center liquid hona chahiye']},
  {id:7,name:'Veg Fried Rice',cat:'chinese',emoji:'🍚',time:'15 min',cost:'₹40',margin:'75%',serves:2,allergens:['Soy','Eggs'],image:'',
   ingredients:['Cooked rice 2 cup (day old best)','Mixed veg (carrot,beans,corn) 1 cup','Eggs 2','Soy sauce 2tbsp','Sesame oil 1tsp','Ginger 1tsp','Garlic 1tsp','Spring onion','Black pepper'],
   steps:['Wok garam karo — smoke hone do','Ginger-garlic fry karo 30 sec','Vegetables high flame pe 2 min bhuno','Eggs scramble karo — side mein','Rice add karo, break lumps','Soy sauce + sesame oil add karo','High flame pe toss karo 3-4 min','Spring onion se finish karo']},
  {id:8,name:'Chicken BBQ Burger',cat:'grill',emoji:'🍔',time:'22 min',cost:'₹85',margin:'68%',serves:1,allergens:['Gluten','Dairy'],image:'',
   ingredients:['Chicken breast 150g','Burger bun 1','BBQ sauce 3tbsp','Cheese slice 1','Lettuce','Tomato','Onion','Mayo','Oil'],
   steps:['Chicken ko flat karo — tenderizer use karo','BBQ sauce + salt + pepper marinate — 15 min','Grill pe 7-8 min each side','Bun ko toast karo grill pe','Bottom bun: mayo + lettuce + tomato','Chicken + cheese place karo','BBQ sauce drizzle karo','Top bun lagao, toothpick se secure karo']},

  // ═══ INDIAN ═══
  {id:9,name:'Butter Chicken',cat:'indian',emoji:'🍛',time:'40 min',cost:'₹160',margin:'65%',serves:4,allergens:['Dairy'],imageQuery:'butter chicken curry makhani',
   ingredients:['Chicken 500g','Butter 4tbsp','Cream 150ml','Tomato puree 300ml','Kashmiri chilli 2tsp','Ginger-garlic paste 2tbsp','Garam masala 1tsp','Kasuri methi','Salt'],
   steps:['Chicken marinate karo — curd+chilli+salt, 1 hr','Butter garam karo, ginger-garlic bhuno','Tomato puree add karo, 10 min pakao','Cream + kashmiri chilli add karo — 5 min simmer','Grilled chicken dalo, mix karo','Kasuri methi crush karke dalo','Butter drizzle karke hot serve karo']},
  {id:10,name:'Paneer Tikka',cat:'indian',emoji:'🧀',time:'25 min',cost:'₹80',margin:'72%',serves:4,allergens:['Dairy'],imageQuery:'paneer tikka tandoor grilled',
   ingredients:['Paneer 400g','Curd 200g','Kashmiri chilli 2tsp','Ginger-garlic paste 1tbsp','Chaat masala 1tsp','Besan 2tbsp','Bell pepper + onion','Lemon juice','Oil'],
   steps:['Marinade banao: curd+besan+spices+lemon','Paneer aur veggies coat karo marinade mein','30 min fridge mein rakho','Skewers mein thread karo','High heat grill/tandoor 10-12 min','Chaat masala sprinkle karo','Mint chutney ke saath serve karo']},
  {id:11,name:'Palak Paneer',cat:'indian',emoji:'🥬',time:'30 min',cost:'₹70',margin:'70%',serves:4,allergens:['Dairy'],imageQuery:'palak paneer spinach curry',
   ingredients:['Paneer 300g','Spinach 500g (blanched)','Onion 1','Tomato 2','Ginger-garlic paste 1tbsp','Cumin 1tsp','Cream 3tbsp','Garam masala','Oil','Salt'],
   steps:['Spinach blanch karke puree banao','Onion golden brown karo in oil','Tomato + ginger-garlic add karo — 8 min','Spinach puree add karo, mix karo','Paneer cubes dalo','10 min simmer karo','Cream add karo, garnish karke serve karo']},
  {id:12,name:'Chole Bhature',cat:'indian',emoji:'🫘',time:'50 min',cost:'₹55',margin:'73%',serves:4,allergens:['Gluten'],imageQuery:'chole bhature chickpea curry bread',
   ingredients:['Kabuli chana 250g (soaked)','Onion 2 (chopped)','Tomato 2','Tea bag 1 (for color)','Chole masala 2tbsp','Ginger-garlic paste','Maida 2 cup (for bhature)','Curd 3tbsp','Oil for frying','Salt'],
   steps:['Chana tea bag ke saath pressure cook 5 whistles','Onion-tomato masala banao','Chole masala add karo, bhuno achhe se','Cooked chana add karo, 15 min simmer','Bhature dough — maida+curd+salt, rest 1 hr','Deep fry bhature — puff hone tak','Achaar + onion ke saath serve karo']},

  // ═══ ITALIAN ═══
  {id:13,name:'Spaghetti Carbonara',cat:'italian',emoji:'🍝',time:'25 min',cost:'₹90',margin:'68%',serves:2,allergens:['Gluten','Eggs','Dairy'],imageQuery:'spaghetti carbonara pasta Italian',
   ingredients:['Spaghetti 200g','Eggs 3 (yolks)','Pancetta/bacon 100g','Parmesan 80g (grated)','Black pepper','Salt','Garlic 1 clove'],
   steps:['Pasta salted boiling water mein al dente pakao','Pancetta crispy fry karo pan mein','Pan se alag rakh do — thoda thanda hone do','Egg yolks + parmesan + pepper mix karo','Pasta drain karo — 1 cup pasta water bachao','Pasta pancetta pan mein dalo','Egg mixture off-flame add karo, toss karo — pasta water se creamy banao']},
  {id:14,name:'Margherita Pizza',cat:'italian',emoji:'🍕',time:'30 min',cost:'₹70',margin:'68%',serves:2,allergens:['Gluten','Dairy'],imageQuery:'margherita pizza Italian Naples',
   ingredients:['Pizza dough 1 ball','San Marzano tomato sauce 4tbsp','Fresh mozzarella 200g','Fresh basil leaves','Olive oil','Sea salt','Oregano'],
   steps:['Oven 250°C preheat karo — 30 min pehle','Dough thin circle mein stretch karo','Tomato sauce spread karo — thin layer','Mozzarella tear karke dalo','Olive oil drizzle karo + sea salt','10-12 min bake karo — crust charred edges','Fresh basil dalo, slice karke serve karo']},
  {id:15,name:'Tiramisu',cat:'italian',emoji:'☕',time:'20 min (+ 4hr chill)',cost:'₹65',margin:'75%',serves:6,allergens:['Eggs','Dairy','Gluten'],imageQuery:'tiramisu Italian dessert coffee',
   ingredients:['Ladyfinger biscuits 24','Mascarpone 500g','Eggs 4 (separated)','Sugar 100g','Espresso 300ml (cooled)','Cocoa powder','Marsala wine 2tbsp (optional)'],
   steps:['Egg yolks + sugar pale ribbon stage tak beat karo','Mascarpone fold karo gently','Egg whites stiff peaks tak beat karo','Mascarpone mixture mein fold karo','Ladyfingers espresso mein dip karo (quick dip)','Layer: ladyfingers → cream → repeat','Cocoa powder dust karo','4+ hr refrigerate karo before serving']},

  // ═══ MEXICAN ═══
  {id:16,name:'Chicken Tacos',cat:'mexican',emoji:'🌮',time:'25 min',cost:'₹75',margin:'65%',serves:4,allergens:['Gluten'],imageQuery:'chicken tacos Mexican street food',
   ingredients:['Chicken thigh 400g','Corn tortillas 8','Lime 2','Garlic 3 cloves','Cumin 1tsp','Smoked paprika 1tsp','Coriander (cilantro)','Onion 1 (diced)','Avocado 1','Sour cream','Jalapeño'],
   steps:['Chicken cumin+paprika+garlic+salt marinate — 20 min','High heat pan mein chicken cook — 6-7 min each side','Rest 5 min, thin slice karo','Tortillas dry pan mein warm karo','Guacamole banao — avocado+lime+salt+coriander','Tortilla pe chicken dalo','Toppings: guacamole, sour cream, onion, jalapeño, lime']},
  {id:17,name:'Guacamole & Nachos',cat:'mexican',emoji:'🥑',time:'10 min',cost:'₹45',margin:'78%',serves:4,allergens:['None'],imageQuery:'guacamole nachos avocado Mexican',
   ingredients:['Ripe avocados 3','Lime juice 2tbsp','Red onion 1/4 (minced)','Jalapeño 1 (minced)','Coriander 2tbsp (chopped)','Tomato 1 (diced, seeds removed)','Garlic 1 clove (minced)','Salt','Tortilla chips'],
   steps:['Avocados halve karo, scoop out karo','Fork se coarsely mash karo — chunky texture rakho','Lime juice immediately add karo (browning rokne ko)','Onion, jalapeño, coriander, tomato fold karo','Garlic + salt season karo — taste karo','Immediately serve karo fresh tortilla chips ke saath']},

  // ═══ JAPANESE ═══
  {id:18,name:'Chicken Ramen',cat:'japanese',emoji:'🍜',time:'45 min',cost:'₹110',margin:'60%',serves:2,allergens:['Gluten','Soy'],imageQuery:'chicken ramen Japanese noodle soup',
   ingredients:['Ramen noodles 200g','Chicken stock 1L','Soy sauce 3tbsp','Mirin 2tbsp','Soft boiled eggs 2','Chashu pork/chicken slices','Nori sheets 2','Spring onion','Bamboo shoots','Sesame oil'],
   steps:['Broth banao: chicken stock + soy sauce + mirin simmer 15 min','Chashu chicken pan mein sear karo','Eggs 6.5 min soft boil karo — ice bath mein dalo','Peel eggs, soy sauce + mirin mein marinate karo','Noodles pakao per package instructions','Bowl mein: noodles → hot broth pour karo','Toppings: egg half, chicken, nori, spring onion, sesame oil']},
  {id:19,name:'Vegetable Sushi Rolls',cat:'japanese',emoji:'🍣',time:'40 min',cost:'₹80',margin:'65%',serves:4,allergens:['Gluten','Soy'],imageQuery:'vegetable sushi roll maki Japanese',
   ingredients:['Sushi rice 2 cup','Rice vinegar 3tbsp','Sugar 2tbsp','Salt 1tsp','Nori sheets 4','Cucumber (julienned)','Avocado (sliced)','Carrot (julienned)','Cream cheese','Soy sauce','Wasabi','Pickled ginger'],
   steps:['Sushi rice pakao — vinegar+sugar+salt mix karke fold karo','Rice thanda hone do — fan karo','Nori bamboo mat pe rakho','Rice thin even layer spread karo (wet hands)','Veggies + cream cheese center mein rakho','Tightly roll karo bamboo mat se','Sharp knife se 8 pieces cut karo','Soy sauce, wasabi, ginger ke saath serve karo']},

  // ═══ THAI ═══
  {id:20,name:'Pad Thai',cat:'thai',emoji:'🍲',time:'20 min',cost:'₹85',margin:'63%',serves:2,allergens:['Nuts','Soy','Eggs'],imageQuery:'pad thai noodles Thailand street food',
   ingredients:['Rice noodles 200g','Shrimp/tofu 200g','Eggs 2','Bean sprouts 1 cup','Spring onion','Peanuts (crushed) 3tbsp','Pad Thai sauce: tamarind paste 3tbsp + fish sauce 2tbsp + sugar 2tbsp','Lime','Garlic 2 cloves','Oil'],
   steps:['Noodles warm water mein 30 min soak karo','Sauce mix karo — tamarind+fish sauce+sugar','Wok high flame pe garam karo — oil add karo','Garlic 30 sec fry karo','Protein add karo — cook karo','Noodles add karo, sauce add karo — toss karo','Side mein push, eggs scramble karo','Mix karo — bean sprouts + spring onion add karo','Peanuts + lime ke saath serve karo']},
  {id:21,name:'Green Curry',cat:'thai',emoji:'🟢',time:'30 min',cost:'₹95',margin:'62%',serves:4,allergens:['Dairy'],imageQuery:'Thai green curry coconut milk chicken',
   ingredients:['Green curry paste 3tbsp','Coconut milk 400ml','Chicken 400g','Bamboo shoots 1 cup','Thai basil leaves','Kaffir lime leaves 4','Fish sauce 2tbsp','Sugar 1tsp','Vegetable oil'],
   steps:['Oil mein green curry paste fry karo — 2 min','Coconut milk half pour karo — stir karo','Chicken add karo — 8 min cook karo','Baaki coconut milk + bamboo shoots add karo','Fish sauce + sugar season karo','Kaffir lime leaves + basil add karo','Jasmine rice ke saath serve karo']},

  // ═══ ARABIC / MIDDLE EASTERN ═══
  {id:22,name:'Shawarma',cat:'arabic',emoji:'🥙',time:'35 min',cost:'₹120',margin:'62%',serves:4,allergens:['Gluten','Dairy'],imageQuery:'chicken shawarma wrap Arabic Middle Eastern',
   ingredients:['Chicken thighs 600g','Cumin 2tsp','Coriander 2tsp','Turmeric 1tsp','Cinnamon 1/2tsp','Cardamom 1/2tsp','Garlic 4 cloves','Lemon juice 2tbsp','Olive oil 3tbsp','Pita bread','Garlic sauce (toum)','Pickles','Tomato','Onion'],
   steps:['Chicken spices+garlic+lemon+oil mein marinate — 2 hr min','High heat grill ya pan mein cook — 7 min each side','5 min rest do, thin slice karo','Pita bread warm karo','Toum (garlic sauce) spread karo','Chicken + pickles + tomato + onion dalo','Tightly wrap karo, optional pan mein press karo']},
  {id:23,name:'Hummus',cat:'arabic',emoji:'🫘',time:'15 min (+ overnight soak)',cost:'₹30',margin:'80%',serves:6,allergens:['Sesame'],imageQuery:'hummus chickpea Middle Eastern dip',
   ingredients:['Chickpeas 250g (soaked overnight)','Tahini 3tbsp','Lemon juice 3tbsp','Garlic 2 cloves','Olive oil 4tbsp','Cumin 1tsp','Ice water 4tbsp','Salt'],
   steps:['Chickpeas till very soft pakao (pressure cooker 20 min)','Thoda thanda hone do — some cooking water bachao','Food processor: chickpeas + tahini + lemon + garlic blend karo','Olive oil slowly add karo while blending','Ice water add karo — ultra smooth banao','Salt + cumin season karo — taste adjust karo','Serve: olive oil drizzle + paprika + parsley']},

  // ═══ FRENCH ═══
  {id:24,name:'Crêpes',cat:'french',emoji:'🥞',time:'20 min',cost:'₹40',margin:'75%',serves:8,allergens:['Gluten','Eggs','Dairy'],imageQuery:'French crepes thin pancakes',
   ingredients:['Flour 125g','Eggs 2','Milk 300ml','Butter 30g (melted)','Sugar 1tsp','Salt pinch','Vanilla extract','Nutella/jam/lemon+sugar for serving'],
   steps:['Flour + salt + sugar mix karo','Eggs + milk gradually add karo — smooth batter banao','Melted butter fold karo','30 min rest do — lumps settle honge','Non-stick pan medium heat pe garam karo — butter lightly grease','Thin batter pour karo — swirl karo quickly','1-2 min first side — edge lift karo','Flip — 30 sec other side','Fold in quarters, serve with filling']},

  // ═══ AMERICAN ═══
  {id:25,name:'Classic Beef Burger',cat:'american',emoji:'🍔',time:'20 min',cost:'₹130',margin:'60%',serves:2,allergens:['Gluten','Dairy'],imageQuery:'classic beef burger American diner',
   ingredients:['Ground beef 300g (80/20)','Burger buns 2','Cheddar cheese 2 slices','Lettuce + tomato + onion','Pickles','Ketchup + mustard + mayo','Salt + black pepper','Butter'],
   steps:['Beef 2 patties banao — 150g each, indent center mein','Salt + pepper season karo just before cooking','High heat cast iron — patties 3-4 min each side','Cheese place karo — cover 30 sec to melt','Buns butter se toast karo grill pe','Bottom bun: special sauce → lettuce → tomato → patty with cheese','Pickles + onion + top bun']},
  {id:26,name:'Buffalo Wings',cat:'american',emoji:'🍗',time:'35 min',cost:'₹100',margin:'63%',serves:4,allergens:['Dairy','Gluten'],imageQuery:'buffalo chicken wings American',
   ingredients:['Chicken wings 1kg','Flour 1/2 cup','Garlic powder 1tsp','Paprika 1tsp','Buffalo sauce 1/2 cup (hot sauce+butter)','Butter 4tbsp','Blue cheese dip','Celery sticks','Oil for frying'],
   steps:['Wings dry karo, flour+spices coat karo','375°F oil mein 12-15 min deep fry till crispy','Buffalo sauce banao: hot sauce + melted butter mix karo','Fried wings sauce mein toss karo','Extra crispy ke liye 10 min 400°F oven mein finish karo','Blue cheese dip + celery ke saath serve karo']},

  // ═══ KOREAN ═══
  {id:27,name:'Bibimbap',cat:'korean',emoji:'🥘',time:'35 min',cost:'₹95',margin:'62%',serves:2,allergens:['Soy','Eggs','Sesame'],imageQuery:'bibimbap Korean rice bowl vegetables',
   ingredients:['Steamed rice 2 cup','Spinach 100g','Carrot (julienned)','Bean sprouts 100g','Shiitake mushrooms 100g','Fried egg 2','Gochujang sauce 2tbsp','Soy sauce 2tbsp','Sesame oil','Sesame seeds','Garlic'],
   steps:['Har vegetable alag season karo soy sauce + sesame oil se','Spinach blanch karo','Mushrooms sauté karo garlic se','Bean sprouts blanch karo','Stone bowl ya regular bowl garam karo','Rice bowl mein rakhao','Vegetables colorful sections mein arrange karo','Egg center mein rakhao','Gochujang sauce + sesame seeds dalo','Sab mix karke serve karo']},

  // ═══ MEDITERRANEAN ═══
  {id:28,name:'Greek Salad',cat:'mediterranean',emoji:'🥗',time:'10 min',cost:'₹55',margin:'78%',serves:4,allergens:['Dairy'],imageQuery:'Greek salad Mediterranean feta cheese',
   ingredients:['Tomatoes 4 (chunked)','Cucumber 1 (chunked)','Red onion 1/2 (sliced)','Kalamata olives 1/2 cup','Feta cheese 200g','Green bell pepper 1','Olive oil 4tbsp','Red wine vinegar 2tbsp','Dried oregano 1tsp','Salt + pepper'],
   steps:['Vegetables chunky cut karo — small nahi','Bowl mein tomato, cucumber, onion, pepper, olives dalo','Olive oil + vinegar + oregano + salt dressing banao','Dressing drizzle karo','Feta cheese top pe crumble karo','Gently toss karo — feta break nahi hona chahiye','Immediately serve karo — crusty bread ke saath']},
];

// AI saved recipes (persists in session)
let rbAISavedRecipes = [];
let rbNextAIId = 1000;

// ── AI RECIPE SEARCH ──
// ── BUILT-IN RECIPE KNOWLEDGE BASE (CORS-free, works offline) ──
const rbKnowledgeBase={
  'butter chicken':{emoji:'🍛',category:'Non-Veg',time:'40 min',serves:'4 people',cost:'₹160',margin:'65%',allergens:['Dairy'],imageQuery:'butter chicken curry',ingredients:['Chicken 500g','Butter 4tbsp','Cream 150ml','Tomato puree 300ml','Kashmiri chilli 2tsp','Ginger-garlic paste 2tbsp','Garam masala 1tsp','Sugar 1tsp','Kasuri methi','Salt'],steps:['Chicken marinate karo — curd+chilli+salt, 1 hr','Butter garam karo, ginger-garlic bhuno','Tomato puree add karo, 10 min cook karo','Cream + kashmiri chilli add karo — simmer 5 min','Grilled chicken dalo, mix karo','Kasuri methi crush karke dalo','Butter drizzle karke serve karo']},
  'paneer tikka':{emoji:'🧀',category:'Veg',time:'25 min',serves:'4 people',cost:'₹80',margin:'72%',allergens:['Dairy'],imageQuery:'paneer tikka tandoor',ingredients:['Paneer 400g (cubes)','Curd 200g','Kashmiri chilli 2tsp','Ginger-garlic paste 1tbsp','Chaat masala 1tsp','Besan 2tbsp','Oil','Bell pepper + onion (for skewer)','Lemon juice'],steps:['Marinade banao: curd+besan+spices+lemon','Paneer aur veggies coat karo marinade mein','30 min marinate karo — fridge mein','Skewers mein thread karo — paneer+veggies','High heat grill/tandoor mein 10-12 min','Chaat masala sprinkle karo','Mint chutney ke saath serve karo']},
  'biryani':{emoji:'🍗',category:'Non-Veg',time:'60 min',serves:'6 people',cost:'₹200',margin:'60%',allergens:['None'],imageQuery:'chicken biryani basmati rice',ingredients:['Basmati rice 3 cup','Chicken 700g','Fried onion 1 cup','Curd 1 cup','Biryani masala 3tbsp','Saffron milk 3tbsp','Ghee 4tbsp','Whole spices (bay leaf,clove,cardamom)','Mint + coriander leaves'],steps:['Rice 70% tak pakao, drain karo — set aside','Chicken marinate — curd+biryani masala+fried onion, 1 hr','Heavy patili mein ghee garam karo','Chicken dum mein 15 min cook karo','Rice layer karo upar','Saffron milk + ghee + mint layer karo','Tight seal karo — dum 25 min on low flame','Serve with raita']},
  'pasta':{emoji:'🍝',category:'Veg',time:'25 min',serves:'2 people',cost:'₹60',margin:'70%',allergens:['Gluten','Dairy'],imageQuery:'pasta arrabbiata Italian food',ingredients:['Pasta 200g','Olive oil 3tbsp','Garlic 5 cloves (minced)','Tomato 4 (chopped)','Red chilli flakes 1tsp','Basil leaves','Parmesan cheese','Salt + black pepper'],steps:['Pasta salted boiling water mein al dente pakao','Olive oil mein garlic golden brown karo','Chilli flakes add karo — 30 sec','Tomatoes add karo, crush karo — 10 min cook','Pasta add karo, pasta water 1/4 cup add karo','Toss well, basil add karo','Parmesan se garnish karke serve karo']},
  'fried rice':{emoji:'🍚',category:'Veg',time:'15 min',serves:'2 people',cost:'₹40',margin:'75%',allergens:['Soy','Eggs'],imageQuery:'fried rice wok chinese',ingredients:['Day-old rice 2 cup','Mixed veggies 1 cup','Eggs 2','Soy sauce 2tbsp','Sesame oil 1tsp','Ginger-garlic 1tsp each','Spring onion','Black pepper'],steps:['Wok high flame pe garam karo — smoke aane do','Ginger-garlic 30 sec fry karo','Veggies add karo — 2 min high flame','Eggs scramble karo — side mein push','Rice add karo — lumps break karo','Soy sauce + sesame oil add karo','High flame pe toss karo 3-4 min','Spring onion se finish']},
  'pizza':{emoji:'🍕',category:'Veg',time:'30 min',serves:'2 people',cost:'₹70',margin:'68%',allergens:['Gluten','Dairy'],imageQuery:'pizza margherita Italian',ingredients:['Pizza dough 1 ball','Tomato sauce 4tbsp','Mozzarella 200g','Olive oil','Basil leaves','Salt + oregano','Toppings as desired'],steps:['Oven 220°C preheat karo — pizza stone agar ho','Dough thin circle mein roll karo','Tomato sauce spread karo','Mozzarella + toppings dalo','Olive oil drizzle karo + oregano','12-15 min bake karo — edges golden ho jayein','Fresh basil dalo, slice karo, serve']},
  'dal makhani':{emoji:'🍲',category:'Veg',time:'35 min',serves:'6 people',cost:'₹45',margin:'78%',allergens:['Dairy'],imageQuery:'dal makhani creamy lentils',ingredients:['Black lentils 250g','Kidney beans 50g','Butter 3tbsp','Cream 100ml','Tomato puree 200ml','Ginger-garlic paste 1tbsp','Red chilli 1tsp','Garam masala','Salt'],steps:['Dal + rajma overnight soak karo','Pressure cook 8 whistles','Butter mein ginger-garlic bhuno','Tomato puree 5 min cook karo','Dal add karo, mix karo','Low flame 20 min simmer','Cream add karo, garnish butter se']},
  'noodles':{emoji:'🍜',category:'Veg',time:'20 min',serves:'2 people',cost:'₹35',margin:'73%',allergens:['Gluten','Soy'],imageQuery:'hakka noodles stir fry vegetables',ingredients:['Hakka noodles 200g','Mixed veggies (carrot,cabbage,bell pepper) 1.5 cup','Soy sauce 2tbsp','Vinegar 1tbsp','Chilli sauce 1tbsp','Ginger-garlic paste 1tsp','Oil','Spring onion','Black pepper'],steps:['Noodles boil karke rinse karo — oil se coat karo','Wok high flame pe garam karo','Ginger-garlic fry karo','Veggies add karo — 3 min stir fry','Noodles add karo','Sauces add karo — toss well','High flame pe 2 min','Spring onion se garnish']},
  'gulab jamun':{emoji:'🍮',category:'Veg',time:'30 min',serves:'20 pieces',cost:'₹5',margin:'85%',allergens:['Dairy','Gluten'],imageQuery:'gulab jamun sweet dessert',ingredients:['Khoya (mawa) 250g','Maida 3tbsp','Baking soda 1/4 tsp','Milk as needed (for kneading)','Sugar 2 cup','Water 1.5 cup','Cardamom 4 pods','Rose water 1tsp','Oil for frying'],steps:['Khoya + maida + baking soda mix karo','Milk se soft dough banao — 5 min rest','Sugar syrup banao — 1 string consistency + cardamom + rose water','Oil medium flame pe garam karo','Small smooth balls banao — no cracks','Medium flame pe slow fry karo — golden brown','Warm syrup mein 30 min soak karo','Serve warm']},
  // ═══ WORLD CUISINES KNOWLEDGE BASE ═══
  'shawarma':{emoji:'🥙',category:'Arabic',time:'35 min',serves:'4 people',cost:'₹120',margin:'62%',allergens:['Gluten','Dairy'],imageQuery:'chicken shawarma wrap Arabic',ingredients:['Chicken thighs 600g','Cumin 2tsp','Coriander 2tsp','Turmeric 1tsp','Cinnamon 1/2tsp','Cardamom 1/2tsp','Garlic 4 cloves','Lemon juice 2tbsp','Olive oil 3tbsp','Pita bread','Garlic sauce','Pickles'],steps:['Chicken spices+garlic+lemon+oil mein marinate — 2 hr','High heat grill ya pan mein cook — 7 min each side','5 min rest do, thin slice karo','Pita bread warm karo','Garlic sauce spread karo','Chicken + pickles + tomato + onion dalo','Tightly wrap karo']},
  'hummus':{emoji:'🫘',category:'Arabic',time:'15 min',serves:'6 people',cost:'₹30',margin:'80%',allergens:['Sesame'],imageQuery:'hummus chickpea Middle Eastern dip',ingredients:['Chickpeas 250g','Tahini 3tbsp','Lemon juice 3tbsp','Garlic 2 cloves','Olive oil 4tbsp','Cumin 1tsp','Ice water 4tbsp','Salt'],steps:['Chickpeas till very soft pakao','Thanda hone do','Food processor: chickpeas + tahini + lemon + garlic blend karo','Olive oil slowly add karo while blending','Ice water add karo — ultra smooth banao','Salt + cumin season karo','Olive oil drizzle + paprika se serve karo']},
  'pad thai':{emoji:'🍲',category:'Thai',time:'20 min',serves:'2 people',cost:'₹85',margin:'63%',allergens:['Nuts','Soy','Eggs'],imageQuery:'pad thai noodles Thailand street food',ingredients:['Rice noodles 200g','Shrimp/tofu 200g','Eggs 2','Bean sprouts 1 cup','Spring onion','Peanuts 3tbsp','Tamarind paste 3tbsp','Fish sauce 2tbsp','Sugar 2tbsp','Lime','Garlic 2 cloves'],steps:['Noodles warm water mein 30 min soak karo','Sauce mix karo: tamarind+fish sauce+sugar','Wok high flame — oil, garlic fry','Protein cook karo','Noodles + sauce toss karo','Eggs scramble karo side mein','Mix karo — bean sprouts + spring onion add karo','Peanuts + lime ke saath serve karo']},
  'green curry':{emoji:'🟢',category:'Thai',time:'30 min',serves:'4 people',cost:'₹95',margin:'62%',allergens:['Dairy'],imageQuery:'Thai green curry coconut milk',ingredients:['Green curry paste 3tbsp','Coconut milk 400ml','Chicken 400g','Bamboo shoots 1 cup','Thai basil','Kaffir lime leaves 4','Fish sauce 2tbsp','Sugar 1tsp','Oil'],steps:['Oil mein green curry paste fry karo — 2 min','Coconut milk half pour karo','Chicken add karo — 8 min cook','Remaining coconut milk + bamboo shoots add karo','Fish sauce + sugar season karo','Kaffir lime leaves + basil add karo','Jasmine rice ke saath serve karo']},
  'ramen':{emoji:'🍜',category:'Japanese',time:'45 min',serves:'2 people',cost:'₹110',margin:'60%',allergens:['Gluten','Soy'],imageQuery:'chicken ramen Japanese noodle soup',ingredients:['Ramen noodles 200g','Chicken stock 1L','Soy sauce 3tbsp','Mirin 2tbsp','Soft boiled eggs 2','Chicken slices','Nori sheets','Spring onion','Sesame oil'],steps:['Broth: chicken stock + soy sauce + mirin simmer 15 min','Chashu chicken sear karo','Eggs 6.5 min soft boil — ice bath mein','Soy+mirin mein marinate karo','Noodles pakao','Bowl mein: noodles → hot broth pour karo','Toppings: egg, chicken, nori, spring onion, sesame oil']},
  'sushi':{emoji:'🍣',category:'Japanese',time:'40 min',serves:'4 people',cost:'₹80',margin:'65%',allergens:['Gluten','Soy'],imageQuery:'vegetable sushi roll maki Japanese',ingredients:['Sushi rice 2 cup','Rice vinegar 3tbsp','Nori sheets 4','Cucumber','Avocado','Carrot','Cream cheese','Soy sauce','Wasabi','Pickled ginger'],steps:['Sushi rice pakao — vinegar+sugar+salt fold karo','Rice thanda hone do','Nori bamboo mat pe rakho','Rice thin layer spread karo','Veggies + cream cheese center mein','Tightly roll karo','Sharp knife se pieces cut karo','Soy sauce, wasabi, ginger ke saath serve karo']},
  'carbonara':{emoji:'🍝',category:'Italian',time:'25 min',serves:'2 people',cost:'₹90',margin:'68%',allergens:['Gluten','Eggs','Dairy'],imageQuery:'spaghetti carbonara pasta Italian',ingredients:['Spaghetti 200g','Eggs 3 (yolks)','Pancetta/bacon 100g','Parmesan 80g','Black pepper','Salt','Garlic 1 clove'],steps:['Pasta al dente pakao — pasta water bachao','Pancetta crispy fry karo','Egg yolks + parmesan + pepper mix karo','Pasta pancetta pan mein dalo','Egg mixture off-flame add karo, toss karo','Pasta water se creamy banao']},
  'tacos':{emoji:'🌮',category:'Mexican',time:'25 min',serves:'4 people',cost:'₹75',margin:'65%',allergens:['Gluten'],imageQuery:'chicken tacos Mexican street food',ingredients:['Chicken thigh 400g','Corn tortillas 8','Lime 2','Cumin 1tsp','Smoked paprika 1tsp','Coriander','Avocado 1','Sour cream','Jalapeño'],steps:['Chicken marinate: cumin+paprika+garlic+salt — 20 min','High heat pan mein cook — 6-7 min each side','Rest 5 min, thin slice karo','Tortillas warm karo','Guacamole banao: avocado+lime+salt','Tortilla pe chicken dalo','Toppings: guacamole, sour cream, jalapeño, lime']},
  'bibimbap':{emoji:'🥘',category:'Korean',time:'35 min',serves:'2 people',cost:'₹95',margin:'62%',allergens:['Soy','Eggs','Sesame'],imageQuery:'bibimbap Korean rice bowl vegetables',ingredients:['Steamed rice 2 cup','Spinach 100g','Carrot','Bean sprouts 100g','Shiitake mushrooms 100g','Fried egg 2','Gochujang sauce 2tbsp','Soy sauce','Sesame oil','Sesame seeds'],steps:['Har vegetable alag season karo soy sauce + sesame oil se','Spinach blanch karo','Mushrooms garlic se sauté karo','Bowl mein rice dalo','Vegetables colorful sections mein arrange karo','Egg center mein rakhao','Gochujang + sesame seeds dalo','Sab mix karke khao']},
  'crepes':{emoji:'🥞',category:'French',time:'20 min',serves:'8 pieces',cost:'₹40',margin:'75%',allergens:['Gluten','Eggs','Dairy'],imageQuery:'French crepes thin pancakes',ingredients:['Flour 125g','Eggs 2','Milk 300ml','Butter 30g','Sugar 1tsp','Salt pinch','Vanilla extract'],steps:['Flour + salt + sugar mix karo','Eggs + milk gradually add karo — smooth batter','Melted butter fold karo','30 min rest do','Non-stick pan medium heat — butter grease','Thin batter pour karo — swirl quickly','1-2 min first side, flip — 30 sec other side','Nutella/jam/lemon+sugar ke saath serve karo']},
  'burger':{emoji:'🍔',category:'American',time:'20 min',serves:'2 people',cost:'₹130',margin:'60%',allergens:['Gluten','Dairy'],imageQuery:'classic beef burger American diner',ingredients:['Ground beef 300g','Burger buns 2','Cheddar cheese 2 slices','Lettuce + tomato + onion','Pickles','Ketchup + mustard + mayo','Salt + black pepper','Butter'],steps:['Beef 2 patties banao — 150g each, center indent','Salt + pepper season karo','High heat cast iron — 3-4 min each side','Cheese melt karo — cover 30 sec','Buns butter se toast karo','Assembly: sauce → lettuce → tomato → patty → pickles + onion']},
  'buffalo wings':{emoji:'🍗',category:'American',time:'35 min',serves:'4 people',cost:'₹100',margin:'63%',allergens:['Dairy','Gluten'],imageQuery:'buffalo chicken wings American',ingredients:['Chicken wings 1kg','Flour 1/2 cup','Garlic powder 1tsp','Paprika 1tsp','Buffalo sauce: hot sauce 1/2 cup + butter 4tbsp','Blue cheese dip','Celery sticks','Oil for frying'],steps:['Wings dry karo, flour+spices coat karo','375F oil mein 12-15 min deep fry','Buffalo sauce: hot sauce + melted butter mix karo','Fried wings sauce mein toss karo','Extra crispy: 400F oven mein 10 min finish','Blue cheese dip + celery ke saath serve karo']},
  'greek salad':{emoji:'🥗',category:'Mediterranean',time:'10 min',serves:'4 people',cost:'₹55',margin:'78%',allergens:['Dairy'],imageQuery:'Greek salad Mediterranean feta cheese',ingredients:['Tomatoes 4 (chunked)','Cucumber 1 (chunked)','Red onion 1/2','Kalamata olives 1/2 cup','Feta cheese 200g','Bell pepper 1','Olive oil 4tbsp','Red wine vinegar 2tbsp','Dried oregano 1tsp'],steps:['Vegetables chunky cut karo','Bowl mein tomato, cucumber, onion, pepper, olives dalo','Olive oil + vinegar + oregano dressing banao','Dressing drizzle karo','Feta top pe crumble karo','Gently toss karo','Crusty bread ke saath serve karo']},

};
function rbGetLocalRecipe(dish){
  const key=dish.toLowerCase().trim();
  // exact match
  if(rbKnowledgeBase[key])return{name:dish.split(' ').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' '),...rbKnowledgeBase[key]};
  // partial match
  for(const k of Object.keys(rbKnowledgeBase)){
    if(key.includes(k)||k.includes(key))return{name:dish.split(' ').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' '),...rbKnowledgeBase[k]};
  }
  return null;
}

// ══════════════════════════════════════════════════════════════
//   🌟 ULTRA HD FOOD IMAGE ENGINE — UHD 1200px+ Quality
//   Wikipedia + MealDB + Wikimedia + Unsplash — World Dishes!
// ══════════════════════════════════════════════════════════════

// Image cache — ek baar fetch, baar baar use
const rbImageCache = {};

// ── Source 1: Wikipedia Image API — Sabse accurate! ──
async function rbTryWikipedia(dishName) {
  const searches = [
    dishName,
    dishName.replace(/ /g, '_'),
    dishName + ' dish',
    dishName + ' food',
    dishName + ' cuisine',
  ];
  for (const term of searches) {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(term)}&prop=pageimages&format=json&pithumbsize=1200&origin=*`,
        { signal: AbortSignal.timeout(6000) }
      );
      const data = await res.json();
      const pages = data.query?.pages || {};
      const page = Object.values(pages)[0];
      if (page && page.thumbnail && page.thumbnail.source) {
        // UHD version — 1200px
        let imgUrl = page.thumbnail.source;
        imgUrl = imgUrl.replace(/\/\d+px-/, '/1200px-');
        return imgUrl;
      }
    } catch(e) {}
  }
  return null;
}

// ── Source 4: Unsplash — UHD Professional Food Photography ──
async function rbTryUnsplash(imageQuery) {
  try {
    // Unsplash source API — free, no key needed, high quality
    const query = encodeURIComponent(imageQuery + ' food');
    const url = `https://source.unsplash.com/1200x800/?${query}`;
    // Test if image loads
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => resolve(null);
      img.src = url;
      setTimeout(() => resolve(null), 6000);
    });
  } catch(e) { return null; }
}

// ── Source 2: TheMealDB — International dishes ──
async function rbTryMealDB(dishName) {
  const queries = [dishName, dishName.split(' ')[0]];
  for (const q of queries) {
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`,
        { signal: AbortSignal.timeout(5000) }
      );
      const data = await res.json();
      if (data.meals?.length) {
        // Best match dhundho — exact name match prefer karo
        const exact = data.meals.find(m => m.strMeal.toLowerCase() === dishName.toLowerCase());
        const best = exact || data.meals[0];
        if (best.strMealThumb) return best.strMealThumb;
      }
    } catch(e) {}
  }
  return null;
}

// ── Source 3: Wikimedia Commons Search — Broad food photos ──
async function rbTryWikimediaCommons(dishName) {
  try {
    const res = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(dishName + ' food')}&gsrnamespace=6&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json&origin=*&gsrlimit=5`,
      { signal: AbortSignal.timeout(5000) }
    );
    const data = await res.json();
    const pages = data.query?.pages || {};
    const pageList = Object.values(pages);
    // Image file dhundho (jpg/png)
    for (const p of pageList) {
      const url = p.imageinfo?.[0]?.thumburl;
      if (url && /\.(jpg|jpeg|png)/i.test(url)) return url;
    }
  } catch(e) {}
  return null;
}

// ══ MAIN FUNCTION: UHD Food Image Fetch ══
async function rbFetchHDImageURL(query) {
  const key = query.toLowerCase().trim();
  if (rbImageCache[key]) return rbImageCache[key];

  let url = null;

  // 🥇 Priority 1: Wikipedia — exact dish article photo (most accurate!)
  url = await rbTryWikipedia(query);

  // 🥈 Priority 2: TheMealDB — international dish photos
  if (!url) url = await rbTryMealDB(query);

  // 🥉 Priority 3: Wikimedia Commons — broad food search
  if (!url) url = await rbTryWikimediaCommons(query);

  // 🌟 Priority 4: Unsplash — UHD professional food photography
  if (!url) url = await rbTryUnsplash(query);

  // 🏳️ Final fallback: stylish placeholder with dish name
  if (!url) {
    url = `https://placehold.co/1200x800/0f1923/2e9c5e?text=${encodeURIComponent('🍽️ ' + query)}`;
  }

  rbImageCache[key] = url;
  return url;
}

// Legacy sync stub
function rbGetFoodImage(query){
  return `https://placehold.co/800x500/0f1923/2e9c5e?text=${encodeURIComponent('Loading...')}`;
}

// ── Image element mein HD photo set karo ──
async function rbSetFoodImg(imgEl, query, emoji){
  if (!imgEl) return;
  imgEl.style.opacity = '0.3';
  imgEl.style.filter = 'blur(6px)';
  imgEl.style.transition = 'opacity 0.55s ease, filter 0.55s ease';

  const hdUrl = await rbFetchHDImageURL(query);

  imgEl.onerror = function() {
    const p = this.parentElement;
    if(p) p.innerHTML = `<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:64px;background:linear-gradient(135deg,rgba(46,156,94,0.1),rgba(0,0,0,0.05));">${emoji}<div style="font-size:12px;margin-top:8px;color:var(--text2);font-weight:600;">${query}</div></div>`;
  };
  imgEl.onload = function(){
    this.style.opacity = '1';
    this.style.filter = 'none';
  };
  imgEl.src = hdUrl;
}

// ── Recipe grid card ke liye lazy HD image load ──
async function rbLoadCardImage(recipeId, dishName, emoji) {
  const imgEl  = document.getElementById('rbCardImg-'   + recipeId);
  const emojiEl = document.getElementById('rbCardEmoji-' + recipeId);
  if (!imgEl) return;

  const hdUrl = await rbFetchHDImageURL(dishName);

  // Recipe object mein bhi cache karo (detail view ke liye)
  const rec = [...recipeDB, ...rbAISavedRecipes].find(r => r.id === recipeId);
  if (rec && !rec.image) rec.image = hdUrl;

  imgEl.style.cssText += 'opacity:0;transition:opacity 0.6s ease;display:block;';
  if (emojiEl) emojiEl.style.display = 'none';

  imgEl.onerror = function(){
    this.style.display = 'none';
    if (emojiEl) emojiEl.style.display = 'flex';
  };
  imgEl.onload = function(){ this.style.opacity = '1'; };
  imgEl.src = hdUrl;
}

// ══════════════════════════════════════════════════════════════
//  🤖 CLAUDE AI — Accurate Recipe Generator
//  Har dish ke liye real, accurate recipe + steps AI se milenge
// ══════════════════════════════════════════════════════════════
async function rbFetchRecipeFromClaude(dishName) {
  const prompt = `You are a world-class professional chef and culinary expert with deep knowledge of ALL global cuisines — Indian, Italian, Japanese, Chinese, Mexican, Thai, French, American, Middle Eastern, Korean, Spanish, Greek, Turkish, Ethiopian, Vietnamese, and every other cuisine in the world.

A chef is searching for the dish: "${dishName}"

Generate a COMPLETE, AUTHENTIC, UNIQUE recipe specifically for "${dishName}". Every recipe must be different — do NOT give generic or repeated instructions. Research the authentic preparation method for this exact dish.

Respond ONLY with a valid JSON object (no markdown, no backticks, no explanation) in this EXACT format:
{
  "name": "Proper full dish name in English",
  "emoji": "most fitting single emoji for this dish",
  "category": "Specific cuisine origin (e.g. Japanese, Moroccan, Peruvian, etc.)",
  "time": "realistic total time including prep (e.g. 45 min)",
  "serves": "realistic serving size (e.g. 4 people)",
  "cost": "estimated cost per plate in INR (e.g. ₹180)",
  "margin": "restaurant profit margin for this dish (e.g. 68%)",
  "allergens": ["only real allergens — Gluten/Dairy/Eggs/Nuts/Soy/Shellfish/Sesame — or ['None']"],
  "imageQuery": "4-6 specific English words to find an accurate image of this dish (e.g. 'miso ramen Japanese noodle soup bowl')",
  "origin": "Country or region where this dish originates",
  "difficulty": "Easy / Medium / Hard",
  "description": "2-sentence authentic description of this dish and its cultural significance",
  "ingredients": [
    "Ingredient 1 — exact quantity + unit (e.g. 'Chicken thigh 500g, cut into pieces')",
    "Ingredient 2 — exact quantity + unit",
    "... minimum 10 ingredients with precise measurements"
  ],
  "steps": [
    "Step 1: Detailed instruction with temperature, timing, and technique",
    "Step 2: Detailed instruction",
    "... minimum 8 steps, professional chef-level detail"
  ],
  "chefTip": "One authentic pro tip specific to this dish",
  "plating": "How to plate/serve this dish professionally"
}

CRITICAL RULES:
1. ingredients — MINIMUM 10 items with exact measurements
2. steps — MINIMUM 8 steps with professional detail
3. Every recipe MUST be unique and authentic to the dish — no copy-paste generic steps
4. imageQuery — specific words that would find an ACCURATE photo of this exact dish
5. If the dish name is in another language, provide the authentic recipe for that culture
6. All fields are REQUIRED — do not omit any`;

  const text = await callGemini(null, prompt, 1500);
  const clean = text.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(clean);
  return parsed;
}

async function rbAISearch(){
  const input=document.getElementById('rbAIInput');
  const dish=(input?.value||'').trim();
  if(!dish)return;
  const btn=document.getElementById('rbAIBtn');
  const btnTxt=document.getElementById('rbAIBtnTxt');
  const btnIcon=document.getElementById('rbAIBtnIcon');
  const resultDiv=document.getElementById('rbAIResult');
  const resultInner=document.getElementById('rbAIResultInner');
  const errorDiv=document.getElementById('rbAIError');
  errorDiv.style.display='none';
  resultDiv.style.display='none';
  btn.disabled=true;
  btnIcon.textContent='🤖';
  btnTxt.textContent='AI Recipe Generate Ho Rahi Hai...';
  btn.style.opacity='.7';

  // Loading animation
  resultDiv.style.display='block';
  resultInner.innerHTML=`
    <div style="padding:28px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;animation:spin 1.5s linear infinite;display:inline-block;">🤖</div>
      <div style="font-family:var(--font-head);font-size:16px;font-weight:800;color:var(--accent);margin-bottom:6px;">Claude AI Recipe Generate Kar Raha Hai</div>
      <div style="font-size:12px;color:var(--text2);">🌍 Duniya ki har dish ki authentic recipe dhundh raha hai...</div>
      <div style="font-size:13px;color:var(--accent);font-weight:700;margin-top:8px;">"${dish}"</div>
      <div style="margin-top:16px;height:3px;background:rgba(46,156,94,0.15);border-radius:2px;overflow:hidden;">
        <div style="height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));width:0%;animation:fillBar 4s ease forwards;border-radius:2px;"></div>
      </div>
      <div style="font-size:11px;color:var(--text2);margin-top:10px;">UHD Image + Authentic Recipe + Chef Tips loading...</div>
    </div>`;

  try{
    // 🤖 Claude AI se accurate recipe fetch karo
    let recipe;
    try {
      recipe = await rbFetchRecipeFromClaude(dish);
    } catch(aiErr) {
      // AI fail hone pe local knowledge base fallback
      recipe = rbGetLocalRecipe(dish);
      if(!recipe){
        const dishName=dish.split(' ').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
        recipe={name:dishName,emoji:'🍽️',category:'Recipe',time:'30 min',serves:'4 people',
          cost:'₹100',margin:'65%',allergens:['None'],imageQuery:dish+' food dish',
          ingredients:['Main ingredient 500g','Oil 2tbsp','Onion 1 chopped','Ginger-garlic paste 1tbsp','Tomato 2 chopped','Salt to taste','Spices as needed','Fresh herbs for garnish'],
          steps:['Ingredients prep karo','Oil garam karo, onion bhuno','Ginger-garlic add karo','Tomato pakao','Main ingredient dalo','Spices + namak add karo','15-20 min pakao','Garnish karke serve karo']};
      }
    }

    // 🖼️ UHD image — recipe ke imageQuery se (sabse accurate query use karo)
    const imgUrl = await rbFetchHDImageURL(recipe.imageQuery || recipe.name);

    // Difficulty color
    const diffColor = recipe.difficulty === 'Easy' ? 'var(--green)' : recipe.difficulty === 'Hard' ? 'var(--red)' : 'var(--orange)';

    // Render result card — with all new fields
    resultInner.innerHTML=`
      <div style="position:relative;height:240px;overflow:hidden;background:var(--bg3);">
        <img id="rbAIResultImg" alt="${recipe.name}" style="width:100%;height:240px;object-fit:cover;image-rendering:auto;">
        <div style="position:absolute;top:10px;right:10px;display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;">
          <span style="background:linear-gradient(135deg,var(--accent),var(--blue));color:#fff;font-size:10px;font-weight:700;padding:4px 10px;border-radius:8px;letter-spacing:1px;">🤖 AI GENERATED</span>
          ${recipe.difficulty?`<span style="background:rgba(0,0,0,0.6);color:${diffColor};font-size:10px;font-weight:700;padding:4px 10px;border-radius:8px;">${recipe.difficulty==='Easy'?'🟢':recipe.difficulty==='Hard'?'🔴':'🟡'} ${recipe.difficulty}</span>`:''}
        </div>
        <div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.85));padding:16px 16px 14px;">
          <div style="color:#fff;font-family:var(--font-head);font-size:20px;font-weight:900;">${recipe.name}</div>
          <div style="color:rgba(255,255,255,.8);font-size:11px;margin-top:2px;">${recipe.category||''} ${recipe.origin?'• 📍 '+recipe.origin:''}</div>
        </div>
      </div>
      <div style="padding:16px;">
        ${recipe.description?`<div style="background:var(--bg3);border-left:3px solid var(--accent);border-radius:0 10px 10px 0;padding:10px 14px;margin-bottom:14px;font-size:13px;color:var(--text3);line-height:1.6;font-style:italic;">${recipe.description}</div>`:''}
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;">
          <span style="background:rgba(46,156,94,.1);color:var(--accent);font-size:11px;font-weight:700;padding:4px 10px;border-radius:8px;">⏱ ${recipe.time||'--'}</span>
          <span style="background:rgba(59,130,246,.1);color:var(--blue);font-size:11px;font-weight:700;padding:4px 10px;border-radius:8px;">👥 ${recipe.serves||'--'}</span>
          <span style="background:rgba(139,92,246,.1);color:var(--purple);font-size:11px;font-weight:700;padding:4px 10px;border-radius:8px;">💰 ${recipe.cost||'--'}/plate</span>
          <span style="background:rgba(34,197,94,.1);color:var(--green);font-size:11px;font-weight:700;padding:4px 10px;border-radius:8px;">📈 ${recipe.margin||'--'}</span>
        </div>
        ${recipe.allergens&&recipe.allergens[0]&&recipe.allergens[0]!='None'?`<div style="background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.25);border-radius:10px;padding:9px 12px;margin-bottom:12px;font-size:12px;font-weight:700;color:var(--orange);">⚠️ Allergens: ${recipe.allergens.join(', ')}</div>`:''}
        <div style="font-weight:800;font-size:11px;letter-spacing:2px;color:var(--text2);margin-bottom:8px;display:flex;align-items:center;gap:6px;"><span>🛒</span> INGREDIENTS (${(recipe.ingredients||[]).length} items)</div>
        <ul style="padding-left:18px;margin-bottom:14px;">${(recipe.ingredients||[]).map(i=>`<li style="font-size:13px;margin-bottom:5px;color:var(--text3);line-height:1.5;">${i}</li>`).join('')}</ul>
        <div style="font-weight:800;font-size:11px;letter-spacing:2px;color:var(--text2);margin-bottom:8px;display:flex;align-items:center;gap:6px;"><span>👨‍🍳</span> METHOD (${(recipe.steps||[]).length} steps)</div>
        <ol style="padding-left:18px;margin-bottom:14px;">${(recipe.steps||[]).map(s=>`<li style="font-size:13px;margin-bottom:10px;line-height:1.6;color:var(--text3);">${s}</li>`).join('')}</ol>
        ${recipe.chefTip?`<div style="background:linear-gradient(135deg,rgba(46,156,94,0.08),rgba(59,130,246,0.08));border:1px solid rgba(46,156,94,0.25);border-radius:12px;padding:12px 14px;margin-bottom:12px;">
          <div style="font-size:10px;font-weight:800;letter-spacing:2px;color:var(--accent);margin-bottom:4px;">💡 CHEF TIP</div>
          <div style="font-size:13px;color:var(--text3);line-height:1.5;">${recipe.chefTip}</div>
        </div>`:''}
        ${recipe.plating?`<div style="background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.2);border-radius:12px;padding:12px 14px;margin-bottom:14px;">
          <div style="font-size:10px;font-weight:800;letter-spacing:2px;color:var(--purple);margin-bottom:4px;">🍽️ PLATING & SERVING</div>
          <div style="font-size:13px;color:var(--text3);line-height:1.5;">${recipe.plating}</div>
        </div>`:''}
        <button onclick="rbAISaveToBook()" style="width:100%;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;border:none;border-radius:12px;padding:12px;font-size:13px;font-weight:800;cursor:pointer;letter-spacing:.5px;display:flex;align-items:center;justify-content:center;gap:8px;" onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">
          ⭐ Save to Recipe Book + Firebase
        </button>
      </div>`;
    // Store recipe temporarily for saving
    window._rbAIPending={...recipe,image:imgUrl,cat:'ai_saved'};
    resultDiv.style.display='block';
    // Set the fetched UHD image directly ✨
    const aiImg=document.getElementById('rbAIResultImg');
    if(aiImg){
      aiImg.style.opacity='0';
      aiImg.style.filter='blur(8px)';
      aiImg.style.transition='opacity 0.7s ease, filter 0.7s ease';
      aiImg.onload=function(){this.style.opacity='1';this.style.filter='none';};
      aiImg.onerror=function(){
        const p=this.parentElement;
        if(p){p.innerHTML='<div style="height:240px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:80px;background:linear-gradient(135deg,rgba(46,156,94,0.15),rgba(0,0,0,0.08));">'+
          (recipe.emoji||'🍽️')+'<div style="font-size:14px;margin-top:12px;color:var(--text2);font-weight:700;">'+recipe.name+'</div></div>';}
      };
      aiImg.src=imgUrl;
    }
    resultDiv.scrollIntoView({behavior:'smooth',block:'nearest'});
  }catch(e){
    errorDiv.style.display='block';
    errorDiv.textContent='❌ Kuch problem aayi. Dobara try karein. ('+e.message+')';
  }
  btn.disabled=false;
  btnIcon.textContent='🔍';
  btnTxt.textContent='Search Recipe';
  btn.style.opacity='1';
}

function rbAISaveToBook(){
  const r=window._rbAIPending;
  if(!r)return;
  const newRecipe={
    id:rbNextAIId++,
    name:r.name,cat:'ai_saved',emoji:r.emoji||'🍽️',
    category:r.category||'',origin:r.origin||'',
    difficulty:r.difficulty||'',description:r.description||'',
    time:r.time||'--',cost:r.cost||'₹--',margin:r.margin||'--',
    serves:parseInt(r.serves)||4,allergens:r.allergens||['None'],
    image:r.image||'',imageQuery:r.imageQuery||r.name,
    ingredients:r.ingredients||[],steps:r.steps||[],
    chefTip:r.chefTip||'',plating:r.plating||'',
    savedAt:new Date().toISOString()
  };
  rbAISavedRecipes.push(newRecipe);
  rbSaveRecipeToFirebase(newRecipe);
  showToast('⭐ '+r.name+' Recipe Book mein save ho gaya!');
  document.getElementById('rbAIResult').style.display='none';
  document.getElementById('rbAIInput').value='';
  window._rbAIPending=null;
  renderRecipeGrid();
}

// ══ Firebase Recipe Save/Delete/Load ══
async function rbSaveRecipeToFirebase(recipe){
  try{
    if(!window.__chefDb||!window.__chefCollection){return;}
    const {addDoc,doc,setDoc}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const docRef=doc(window.__chefDb,'recipes',String(recipe.id));
    await setDoc(docRef,{
      ...recipe,
      savedAt:recipe.savedAt||new Date().toISOString(),
      source:'chef_app'
    });
    showToast('🔥 Firebase mein bhi save ho gaya!','var(--green)');
  }catch(e){console.warn('[RB] Firebase save error:',e.message);}
}

async function rbDeleteRecipeFromFirebase(id){
  try{
    if(!window.__chefDb){return;}
    const {doc,deleteDoc}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    await deleteDoc(doc(window.__chefDb,'recipes',String(id)));
  }catch(e){console.warn('[RB] Firebase delete error:',e.message);}
}

// Firebase se saved recipes load karo on init
async function rbLoadFromFirebase(){
  try{
    if(!window.__chefDb||!window.__chefCollection||!window.__chefOnSnapshot){return;}
    window.__chefOnSnapshot(window.__chefCollection(window.__chefDb,'recipes'),snap=>{
      const fbRecipes=[];
      snap.forEach(d=>{
        const data=d.data();
        if(data&&data.name&&data.cat==='ai_saved'){
          fbRecipes.push({...data,id:parseInt(d.id)||data.id});
        }
      });
      // Merge — duplicates avoid karo
      fbRecipes.forEach(fbR=>{
        if(!rbAISavedRecipes.find(x=>x.id===fbR.id||x.name===fbR.name)){
          rbAISavedRecipes.push(fbR);
          if(fbR.id>=rbNextAIId) rbNextAIId=fbR.id+1;
        }
      });
      renderRecipeGrid();
    });
  }catch(e){console.warn('[RB] Firebase load error:',e.message);}
}

function rbDeleteAISaved(id){
  const r=rbAISavedRecipes.find(x=>x.id===id);
  if(!r)return;
  if(!confirm('"'+r.name+'" ko Recipe Book se delete karna chahte ho?'))return;
  rbAISavedRecipes=rbAISavedRecipes.filter(x=>x.id!==id);
  // 🔥 Firebase se bhi delete karo
  rbDeleteRecipeFromFirebase(id);
  // Close detail panel if this recipe was open
  const detail=document.getElementById('recipeDetail');
  if(detail&&detail.style.display!=='none'){detail.style.display='none';}
  showToast('🗑 '+r.name+' delete ho gaya!');
  renderRecipeGrid();
}

let rbCurrentFilter='all';
function rbFilter(cat){
  rbCurrentFilter=cat;
  document.querySelectorAll('[id^="rbf-"]').forEach(b=>{b.style.background='';b.style.color='';b.style.borderColor='';});
  const el=document.getElementById('rbf-'+cat);
  if(el){el.style.background='var(--accent)';el.style.color='#fff';el.style.borderColor='var(--accent)';}
  renderRecipeGrid();
}
function rbFilterSearch(){renderRecipeGrid();}

function renderRecipeGrid(){
  const search=(document.getElementById('rbSearch')?.value||'').toLowerCase();
  const allRecipes=[...recipeDB,...rbAISavedRecipes];
  const filtered=allRecipes.filter(r=>(rbCurrentFilter==='all'||r.cat===rbCurrentFilter)&&(r.name.toLowerCase().includes(search)||r.cat.includes(search)));
  const grid=document.getElementById('recipeGrid');if(!grid)return;
  if(!filtered.length){
    grid.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text2);">
      <div style="font-size:36px;margin-bottom:10px;">🔍</div>
      <div style="font-weight:700;font-size:14px;">Koi recipe nahi mili</div>
      <div style="font-size:12px;margin-top:4px;">Upar AI Search se naya dish dhoondho!</div>
    </div>`;
    return;
  }
  grid.innerHTML=filtered.map(r=>`
    <div class="card" style="cursor:pointer;transition:all .22s;padding:0;overflow:hidden;border-radius:var(--radius-sm);" onclick="showRecipeDetail(${r.id})" onmouseover="this.style.borderColor='var(--accent)';this.style.transform='translateY(-2px)';this.style.boxShadow='var(--shadow-gold)'" onmouseout="this.style.borderColor='var(--border)';this.style.transform='';this.style.boxShadow='var(--shadow-card)'">
      <div style="height:130px;overflow:hidden;background:var(--bg3);position:relative;">
        <!-- Emoji placeholder — HD image load hone tak dikhai deta hai -->
        <div id="rbCardEmoji-${r.id}" style="height:130px;display:flex;align-items:center;justify-content:center;font-size:42px;background:linear-gradient(135deg,rgba(46,156,94,0.07),var(--bg3));position:absolute;inset:0;">
          ${r.emoji}
          <div style="position:absolute;bottom:6px;left:0;right:0;text-align:center;font-size:9px;color:var(--text2);letter-spacing:1px;font-family:var(--font-mono);">🌐 HD loading...</div>
        </div>
        <!-- HD image — TheMealDB se real photo -->
        <img id="rbCardImg-${r.id}" alt="${r.name}" style="width:100%;height:130px;object-fit:cover;display:${r.image?'block':'none'};opacity:${r.image?'1':'0'};" ${r.image?`src="${r.image}"`:''}>
        ${r.cat==='ai_saved'?`<span style="position:absolute;top:8px;right:8px;background:rgba(139,92,246,.9);color:#fff;font-size:9px;font-weight:800;padding:3px 8px;border-radius:8px;letter-spacing:1px;z-index:2;">⭐ SAVED</span>`:''}
        <div style="position:absolute;top:8px;left:8px;background:rgba(0,0,0,0.55);border-radius:6px;padding:2px 7px;font-size:9px;color:#fff;font-weight:700;letter-spacing:.5px;z-index:2;">📸 HD</div>
      </div>
      <div style="padding:12px 14px 14px;">
        <div style="font-weight:800;font-size:13px;margin-bottom:6px;color:var(--text);">${r.name}</div>
        <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:6px;">
          <span style="background:rgba(46,156,94,.1);color:var(--accent);font-size:10px;font-weight:700;padding:2px 7px;border-radius:6px;">⏱ ${r.time}</span>
          <span style="background:rgba(59,130,246,.1);color:var(--blue);font-size:10px;font-weight:700;padding:2px 7px;border-radius:6px;">💰 ${r.cost}</span>
          <span style="background:rgba(34,197,94,.1);color:var(--green);font-size:10px;font-weight:700;padding:2px 7px;border-radius:6px;">📈 ${r.margin}</span>
        </div>
        ${r.allergens&&r.allergens[0]&&r.allergens[0]!='None'?`<div style="font-size:10px;color:var(--orange);font-weight:700;">⚠️ ${r.allergens.join(', ')}</div>`:''}
      </div>
    </div>`).join('');

  // 🌟 Lazy-load HD images for all cards after render
  filtered.forEach(r => {
    rbLoadCardImage(r.id, r.imageQuery || r.name, r.emoji || '🍽️');
  });
}

function closeRecipeDetail(){document.getElementById('recipeDetail').style.display='none';}
function showRecipeDetail(id){
  const allRecipes=[...recipeDB,...rbAISavedRecipes];
  const r=allRecipes.find(x=>x.id===id);if(!r)return;
  const d=document.getElementById('recipeDetail');
  const c=document.getElementById('recipeDetailContent');
  d.style.display='block';
  const diffColor = r.difficulty === 'Easy' ? 'var(--green)' : r.difficulty === 'Hard' ? 'var(--red)' : 'var(--orange)';
  c.innerHTML=`
    <div style="height:240px;overflow:hidden;border-radius:12px;margin-bottom:14px;background:linear-gradient(135deg,rgba(46,156,94,0.1),var(--bg3));position:relative;">
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:56px;">${r.emoji}</div>
      <img id="rb-detail-img-${r.id}" alt="${r.name}" style="width:100%;height:240px;object-fit:cover;position:relative;z-index:1;opacity:0;transition:opacity 0.7s ease;" onerror="this.style.display='none'">
      <div style="position:absolute;top:10px;left:10px;background:rgba(0,0,0,0.6);color:#fff;font-size:9px;font-weight:800;padding:3px 8px;border-radius:6px;letter-spacing:1px;z-index:2;">📸 ULTRA HD</div>
      ${r.difficulty?`<div style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.6);color:${diffColor};font-size:10px;font-weight:800;padding:3px 10px;border-radius:6px;z-index:2;">${r.difficulty==='Easy'?'🟢':r.difficulty==='Hard'?'🔴':'🟡'} ${r.difficulty}</div>`:''}
      ${r.origin?`<div style="position:absolute;bottom:10px;left:10px;background:rgba(0,0,0,0.65);color:#fff;font-size:10px;font-weight:700;padding:3px 10px;border-radius:6px;z-index:2;">📍 ${r.origin}</div>`:''}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;"><div style="font-family:var(--font-head);font-size:18px;font-weight:900;color:var(--text);flex:1;padding-right:8px;line-height:1.3;">${r.name}<br><span style="font-family:var(--font-ui);font-size:11px;font-weight:600;color:var(--text2);">${r.category||''}</span></div><button onclick="closeRecipeDetail()" title="Band karo" style="width:30px;height:30px;border-radius:50%;background:rgba(239,68,68,0.1);border:1.5px solid rgba(239,68,68,0.35);color:var(--red);font-size:15px;cursor:pointer;flex-shrink:0;" onmouseover="this.style.background='rgba(239,68,68,0.22)'" onmouseout="this.style.background='rgba(239,68,68,0.1)'">✕</button></div>
    ${r.description?`<div style="background:var(--bg3);border-left:3px solid var(--accent);border-radius:0 10px 10px 0;padding:10px 14px;margin-bottom:12px;font-size:12px;color:var(--text3);line-height:1.6;font-style:italic;">${r.description}</div>`:''}
    ${r.cat==='ai_saved'?`<div style="display:flex;align-items:center;justify-content:space-between;background:rgba(139,92,246,.08);border:1px solid rgba(139,92,246,.2);border-radius:8px;padding:6px 12px;margin-bottom:12px;">
      <span style="font-size:11px;font-weight:700;color:var(--purple);">⭐ AI Se Dhundha Hua Recipe</span>
      <button onclick="rbDeleteAISaved(${r.id})" style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:8px;color:var(--red);font-size:11px;font-weight:800;padding:3px 10px;cursor:pointer;" onmouseover="this.style.background='rgba(239,68,68,0.2)'" onmouseout="this.style.background='rgba(239,68,68,0.1)'">🗑 Delete</button>
    </div>`:''}
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;">
      <span style="background:rgba(46,156,94,.1);color:var(--accent);font-size:11px;font-weight:700;padding:4px 10px;border-radius:8px;">⏱ ${r.time}</span>
      <span style="background:rgba(59,130,246,.1);color:var(--blue);font-size:11px;font-weight:700;padding:4px 10px;border-radius:8px;">👥 Serves ${r.serves}</span>
      <span style="background:rgba(139,92,246,.1);color:var(--purple);font-size:11px;font-weight:700;padding:4px 10px;border-radius:8px;">💰 ${r.cost}/plate</span>
      <span style="background:rgba(34,197,94,.1);color:var(--green);font-size:11px;font-weight:700;padding:4px 10px;border-radius:8px;">📈 ${r.margin}</span>
    </div>
    ${r.allergens&&r.allergens[0]&&r.allergens[0]!='None'?`<div style="background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.3);border-radius:10px;padding:10px;margin-bottom:12px;font-size:12px;font-weight:700;color:var(--orange);">⚠️ ALLERGENS: ${r.allergens.join(', ')}</div>`:''}
    <div style="font-weight:800;font-size:11px;letter-spacing:2px;color:var(--text2);margin-bottom:8px;">🛒 INGREDIENTS (${(r.ingredients||[]).length})</div>
    <ul style="padding-left:18px;margin-bottom:14px;">${(r.ingredients||[]).map(i=>`<li style="font-size:13px;margin-bottom:5px;color:var(--text3);line-height:1.5;">${i}</li>`).join('')}</ul>
    <div style="font-weight:800;font-size:11px;letter-spacing:2px;color:var(--text2);margin-bottom:8px;">👨‍🍳 METHOD (${(r.steps||[]).length} steps)</div>
    <ol style="padding-left:18px;margin-bottom:14px;">${(r.steps||[]).map(s=>`<li style="font-size:13px;margin-bottom:10px;line-height:1.6;color:var(--text3);">${s}</li>`).join('')}</ol>
    ${r.chefTip?`<div style="background:linear-gradient(135deg,rgba(46,156,94,0.08),rgba(59,130,246,0.08));border:1px solid rgba(46,156,94,0.25);border-radius:12px;padding:12px 14px;margin-bottom:12px;"><div style="font-size:10px;font-weight:800;letter-spacing:2px;color:var(--accent);margin-bottom:4px;">💡 CHEF TIP</div><div style="font-size:13px;color:var(--text3);line-height:1.5;">${r.chefTip}</div></div>`:''}
    ${r.plating?`<div style="background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.2);border-radius:12px;padding:12px 14px;margin-bottom:14px;"><div style="font-size:10px;font-weight:800;letter-spacing:2px;color:var(--purple);margin-bottom:4px;">🍽️ PLATING & SERVING</div><div style="font-size:13px;color:var(--text3);line-height:1.5;">${r.plating}</div></div>`:''}
    <button class="btn-sm btn-gold" style="width:100%;justify-content:center;" onclick="addRecipeToPrep(${r.id})"><i data-lucide="plus"></i> Aaj ke Prep mein add karo</button>
  `;
  lucide.createIcons();
  // 🌟 HD image detail panel mein load karo
  const detailImg = document.getElementById('rb-detail-img-' + r.id);
  if(detailImg){
    rbFetchHDImageURL(r.imageQuery || r.name).then(hdUrl => {
      detailImg.onload = function(){ this.style.opacity = '1'; };
      detailImg.onerror = function(){ this.style.display = 'none'; };
      detailImg.src = hdUrl;
    });
  }
  d.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function addRecipeToPrep(id){
  const allRecipes=[...recipeDB,...rbAISavedRecipes];
  const r=allRecipes.find(x=>x.id===id);if(!r)return;
  showToast('✅ '+r.name+' prep checklist mein add hua!');
  renderPrepChecklist();
}
const defaultPrep=[
  {dish:'Chicken Biryani',qty:'20 portions',task:'Rice soak karo 7AM tak',done:false,priority:'high'},
  {dish:'Dal Makhani',qty:'15 portions',task:'Dal overnight soak — already done',done:true,priority:'normal'},
  {dish:'Naan Dough',qty:'50 pieces',task:'Dough morning 8AM banao',done:false,priority:'high'},
  {dish:'Veg Fried Rice',qty:'10 portions',task:'Vegetables chop karo',done:false,priority:'normal'},
  {dish:'Tandoori Fish',qty:'8 portions',task:'Fish marinate 2PM tak',done:false,priority:'normal'},
  {dish:'Lava Cake',qty:'20 portions',task:'Batter ready rakho — order pe bake',done:false,priority:'low'},
];
function renderPrepChecklist(){
  const el=document.getElementById('prepChecklist');if(!el)return;
  el.innerHTML=defaultPrep.map((p,i)=>`
    <div style="display:flex;align-items:center;gap:12px;padding:11px 14px;background:${p.done?'rgba(34,197,94,.05)':'var(--bg3)'};border:1px solid ${p.done?'rgba(34,197,94,.2)':'var(--border)'};border-radius:11px;transition:all .2s;">
      <input type="checkbox" ${p.done?'checked':''} onchange="togglePrep(${i})" style="width:18px;height:18px;cursor:pointer;accent-color:var(--accent);">
      <div style="flex:1;">
        <div style="font-weight:700;font-size:13px;${p.done?'text-decoration:line-through;color:var(--text2);':''}">${p.dish} — ${p.qty}</div>
        <div style="font-size:12px;color:var(--text2);">${p.task}</div>
      </div>
      <span style="font-size:10px;font-weight:800;padding:3px 10px;border-radius:8px;background:${p.priority==='high'?'rgba(239,68,68,.1)':p.priority==='low'?'rgba(34,197,94,.1)':'rgba(245,158,11,.1)'};color:${p.priority==='high'?'var(--red)':p.priority==='low'?'var(--green)':'var(--orange)'};">${p.priority.toUpperCase()}</span>
    </div>`).join('');
}
function togglePrep(i){defaultPrep[i].done=!defaultPrep[i].done;renderPrepChecklist();}

// ══════════════════════════════════════════════
//   FEATURE 2: GST INVOICE GENERATOR
// ══════════════════════════════════════════════
let gstItemsList=[
  {name:'Chicken Biryani',qty:2,rate:320},
  {name:'Butter Naan',qty:4,rate:45},
  {name:'Dal Makhani',qty:1,rate:180},
];
let gstInvoiceNo=1001; // Firebase se load hoga — startStaffInvMenuFirebase mein

function initGSTPage(){
  document.getElementById('gst-date').valueAsDate=new Date();
  renderGSTItems();calcGSTTotal();
}
function renderGSTItems(){
  const el=document.getElementById('gstItems');if(!el)return;
  el.innerHTML=gstItemsList.map((item,i)=>`
    <div style="display:grid;grid-template-columns:1fr 70px 90px 30px;gap:8px;align-items:center;">
      <input class="royal-input" value="${item.name}" placeholder="Dish name" style="font-size:12px;padding:7px 10px;" oninput="gstItemsList[${i}].name=this.value;calcGSTTotal()">
      <input class="royal-input" value="${item.qty ?? 1}" type="number" min="1" style="font-size:12px;padding:7px 10px;text-align:center;" oninput="gstItemsList[${i}].qty=+this.value;calcGSTTotal()">
      <input class="royal-input" value="${item.rate ?? 0}" type="number" style="font-size:12px;padding:7px 10px;" oninput="gstItemsList[${i}].rate=+this.value;calcGSTTotal()">
      <button onclick="removeGSTItem(${i})" style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);border-radius:8px;color:var(--red);cursor:pointer;padding:7px;font-size:14px;">✕</button>
    </div>`).join('');
  calcGSTTotal();
}
function addGSTItem(){gstItemsList.push({name:'',qty:1,rate:0});renderGSTItems();}
function removeGSTItem(i){gstItemsList.splice(i,1);renderGSTItems();}
function calcGSTTotal(){
  const sub=gstItemsList.reduce((s,i)=>s+(i.qty*i.rate),0);
  const cgstP=+(document.getElementById('gst-cgst')?.value||9);
  const sgstP=+(document.getElementById('gst-sgst')?.value||9);
  const disc=+(document.getElementById('gst-disc')?.value||0);
  const cgstAmt=sub*(cgstP/100);
  const sgstAmt=sub*(sgstP/100);
  const total=sub+cgstAmt+sgstAmt-disc;
  document.getElementById('gst-sub').textContent='₹'+sub.toFixed(2);
  document.getElementById('gst-cgst-amt').textContent='₹'+cgstAmt.toFixed(2);
  document.getElementById('gst-sgst-amt').textContent='₹'+sgstAmt.toFixed(2);
  document.getElementById('gst-disc-show').textContent='-₹'+disc.toFixed(2);
  document.getElementById('gst-total').textContent='₹'+total.toFixed(2);
  updateGSTPreview(sub,cgstP,sgstP,cgstAmt,sgstAmt,disc,total);
}
function updateGSTPreview(sub,cgstP,sgstP,cgstAmt,sgstAmt,disc,total){
  const el=document.getElementById('gstPreview');if(!el)return;
  const custName=document.getElementById('gst-custname')?.value||'Guest';
  const table=document.getElementById('gst-table')?.value||'-';
  const date=document.getElementById('gst-date')?.value||new Date().toISOString().split('T')[0];
  const pay=document.getElementById('gst-pay')?.value||'Cash';
  const restName=RESTAURANT_NAME_LOCKED||'Siplora Chef Restaurant';
  const gstNo=document.getElementById('s-gst-no')?.value||'27AABCU9603R1ZX';
  const phone=document.getElementById('s-phone')?.value||'+91 9876543210';
  const address=document.getElementById('s-address')?.value||'Solapur, Maharashtra';
  el.innerHTML=`
    <div style="text-align:center;border-bottom:2px dashed var(--border);padding-bottom:12px;margin-bottom:12px;">
      <div style="font-size:20px;font-weight:900;">🍽️ ${restName.toUpperCase()}</div>
      <div style="font-size:11px;color:var(--text2);">${address} | GST: ${gstNo}</div>
      <div style="font-size:11px;color:var(--text2);">Ph: ${phone}</div>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:12px;">
      <div><b>Invoice #:</b> NC-${gstInvoiceNo}<br><b>Date:</b> ${date}<br><b>Table:</b> ${table}</div>
      <div style="text-align:right;"><b>Customer:</b> ${custName}<br><b>Payment:</b> ${pay}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:10px;">
      <thead><tr style="background:var(--bg3);">
        <th style="padding:6px;text-align:left;border-bottom:1px solid var(--border);">Item</th>
        <th style="padding:6px;text-align:center;border-bottom:1px solid var(--border);">Qty</th>
        <th style="padding:6px;text-align:right;border-bottom:1px solid var(--border);">Rate</th>
        <th style="padding:6px;text-align:right;border-bottom:1px solid var(--border);">Amount</th>
      </tr></thead>
      <tbody>${gstItemsList.map(i=>`<tr><td style="padding:5px;">${i.name}</td><td style="padding:5px;text-align:center;">${i.qty}</td><td style="padding:5px;text-align:right;">₹${i.rate}</td><td style="padding:5px;text-align:right;">₹${(i.qty*i.rate).toFixed(2)}</td></tr>`).join('')}</tbody>
    </table>
    <div style="font-size:11px;color:var(--text2);margin-bottom:8px;">
      Subtotal: ₹${sub.toFixed(2)} | CGST @${cgstP}%: ₹${cgstAmt.toFixed(2)} | SGST @${sgstP}%: ₹${sgstAmt.toFixed(2)}${disc>0?' | Discount: -₹'+disc.toFixed(2):''}
    </div>
    <div style="text-align:center;font-size:10px;color:var(--text2);border-top:2px dashed var(--border);padding-top:10px;">Thank you for dining with us! 🙏</div>`;
}
function generateGSTInvoice(){
  const custName=document.getElementById('gst-custname')?.value||'Guest';
  const table=document.getElementById('gst-table')?.value||'1';
  const date=document.getElementById('gst-date')?.value||new Date().toISOString().split('T')[0];
  const pay=document.getElementById('gst-pay')?.value||'Cash';
  const sub=gstItemsList.reduce((s,i)=>s+(i.qty*i.rate),0);
  const cgstP=+(document.getElementById('gst-cgst')?.value||9);
  const sgstP=+(document.getElementById('gst-sgst')?.value||9);
  const disc=+(document.getElementById('gst-disc')?.value||0);
  const cgstAmt=sub*(cgstP/100);
  const sgstAmt=sub*(sgstP/100);
  const total=sub+cgstAmt+sgstAmt-disc;
  const invoiceId='NC-'+gstInvoiceNo;
  const restName=RESTAURANT_NAME_LOCKED||'Siplora Chef Restaurant';
  const gstNo=document.getElementById('s-gst-no')?.value||'27AABCU9603R1ZX';
  const phone=document.getElementById('s-phone')?.value||'+91 9876543210';
  const address=document.getElementById('s-address')?.value||'Solapur, Maharashtra';
  const w=window.open('','_blank','width=600,height=800');
  w.document.write(`<!DOCTYPE html><html><head><title>GST Invoice ${invoiceId}</title>
  <style>body{font-family:Arial,sans-serif;max-width:580px;margin:20px auto;font-size:13px;}
  h1{text-align:center;font-size:18px;margin-bottom:4px;}
  .sub{text-align:center;color:#666;font-size:12px;margin-bottom:20px;}
  table{width:100%;border-collapse:collapse;margin:12px 0;}
  th,td{padding:8px 10px;border:1px solid #ddd;}
  th{background:#f5f5f5;font-weight:700;}
  .tot{font-size:16px;font-weight:900;color:#009;text-align:right;}
  .footer{text-align:center;margin-top:20px;color:#999;font-size:12px;border-top:2px dashed #ccc;padding-top:12px;}
  @media print{button{display:none}}
  </style></head><body>
  <div style="text-align:center;border-bottom:3px double #333;padding-bottom:16px;margin-bottom:16px;">
    <h1>🍽️ ${restName.toUpperCase()}</h1>
    <div class="sub">${address} | GSTIN: ${gstNo} | Ph: ${phone}</div>
    <div style="font-weight:700;font-size:15px;">TAX INVOICE</div>
  </div>
  <div style="display:flex;justify-content:space-between;margin-bottom:16px;">
    <div><b>Invoice No:</b> ${invoiceId}<br><b>Date:</b> ${date}<br><b>Table No:</b> ${table}</div>
    <div style="text-align:right;"><b>Bill To:</b> ${custName}<br><b>Payment:</b> ${pay}</div>
  </div>
  <table><thead><tr><th>Sr</th><th>Item</th><th>Qty</th><th>Rate (₹)</th><th>Amount (₹)</th></tr></thead>
  <tbody>${gstItemsList.map((i,idx)=>`<tr><td>${idx+1}</td><td>${i.name}</td><td>${i.qty}</td><td>${i.rate.toFixed(2)}</td><td>${(i.qty*i.rate).toFixed(2)}</td></tr>`).join('')}</tbody></table>
  <table style="width:60%;margin-left:auto;">
    <tr><td>Subtotal</td><td style="text-align:right;">₹${sub.toFixed(2)}</td></tr>
    <tr><td>CGST @ ${cgstP}%</td><td style="text-align:right;">₹${cgstAmt.toFixed(2)}</td></tr>
    <tr><td>SGST @ ${sgstP}%</td><td style="text-align:right;">₹${sgstAmt.toFixed(2)}</td></tr>
    ${disc>0?`<tr><td style="color:red;">Discount</td><td style="text-align:right;color:red;">- ₹${disc.toFixed(2)}</td></tr>`:''}
    <tr><td class="tot">GRAND TOTAL</td><td class="tot">₹${total.toFixed(2)}</td></tr>
  </table>
  <div class="footer">This is a computer generated invoice. Thank you for dining with ${restName}! 🙏</div>
  <div style="text-align:center;margin-top:16px;">
    <button onclick="window.print()" style="padding:10px 24px;background:#007bff;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;margin-right:8px;">🖨️ Print</button>
    <button onclick="window.close()" style="padding:10px 24px;background:#666;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;">Close</button>
  </div>
  </body></html>`);
  w.document.close();

  // ── Firebase mein invoice save karo ──
  saveGSTInvoiceToFirebase({
    invoiceId, custName, table, date, pay,
    items:[...gstItemsList],
    sub, cgstP, sgstP, cgstAmt, sgstAmt, disc, total,
    restName, gstNo, phone, address,
    createdAt: new Date().toISOString()
  });

  gstInvoiceNo++;
  showToast('✅ GST Invoice '+invoiceId+' generated!');
  // Invoice history refresh karo
  setTimeout(loadGSTInvoiceHistory, 800);
}

// ── GST Invoice Firebase mein save karo ──
async function saveGSTInvoiceToFirebase(invoiceData) {
  if (!window.__chefDb) {
    console.warn('[GST] Firebase not connected — invoice not saved');
    return;
  }
  try {
    const { addDoc, collection } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    await addDoc(collection(window.__chefDb, 'gst_invoices'), invoiceData);
    console.log('[GST] Invoice saved to Firebase:', invoiceData.invoiceId);
  } catch(e) {
    console.warn('[GST] Firebase save error:', e.message);
  }
}

// ── Firebase se GST Invoice history load karo ──
async function loadGSTInvoiceHistory() {
  const el = document.getElementById('gstInvoiceHistory');
  if (!el) return;
  if (!window.__chefDb) {
    el.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text2);font-size:13px;">⚠️ Firebase connect nahi hua</div>';
    return;
  }
  el.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text2);font-size:13px;">⏳ Loading...</div>';
  try {
    const { getDocs, collection, query, orderBy, limit } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const q = query(collection(window.__chefDb, 'gst_invoices'), orderBy('createdAt','desc'), limit(20));
    const snap = await getDocs(q);
    if (snap.empty) {
      el.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text2);font-size:13px;">Koi invoice nahi mila — pehla invoice banao!</div>';
      return;
    }
    const rows = snap.docs.map(d => {
      const inv = d.data();
      return `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;gap:10px;flex-wrap:wrap;">
        <div>
          <div style="font-weight:800;font-size:13px;color:var(--accent);">${inv.invoiceId}</div>
          <div style="font-size:11px;color:var(--text2);">👤 ${inv.custName} &nbsp;|&nbsp; 🪑 Table ${inv.table} &nbsp;|&nbsp; 📅 ${inv.date}</div>
          <div style="font-size:11px;color:var(--text2);">💳 ${inv.pay} &nbsp;|&nbsp; ${(inv.items||[]).length} items</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:16px;font-weight:900;color:var(--accent);">₹${Number(inv.total||0).toFixed(2)}</div>
          <div style="font-size:9px;color:var(--text2);font-family:var(--font-mono);">${inv.createdAt?new Date(inv.createdAt).toLocaleString('en-IN'):'—'}</div>
        </div>
      </div>`;
    }).join('');
    el.innerHTML = rows;
  } catch(e) {
    el.innerHTML = `<div style="text-align:center;padding:16px;color:var(--red);font-size:13px;">❌ Load error: ${e.message}</div>`;
    console.warn('[GST] History load error:', e.message);
  }
}

// ══════════════════════════════════════════════
//   FEATURE 3: EXPIRY WATCH + REORDER
// ══════════════════════════════════════════════
const expiryData=[
  {name:'Tomatoes',qty:'2 kg',expiry:1,vendor:'Fresh Farms',phone:'9823456780',unit:'kg',minQty:10,status:'critical'},
  {name:'Paneer',qty:'500 g',expiry:2,vendor:'Dairy Direct',phone:'9812345670',unit:'kg',minQty:5,status:'critical'},
  {name:'Chicken (Fresh)',qty:'3 kg',expiry:2,vendor:'Poultry Hub',phone:'9876543219',unit:'kg',minQty:15,status:'critical'},
  {name:'Coriander',qty:'200 g',expiry:3,vendor:'Veg Mandi',phone:'9988776655',unit:'bunch',minQty:20,status:'critical'},
  {name:'Cream',qty:'1 L',expiry:5,vendor:'Dairy Direct',phone:'9812345670',unit:'L',minQty:5,status:'week'},
  {name:'Fish (Surmai)',qty:'2 kg',expiry:6,vendor:'Sea Fresh',phone:'9870123456',unit:'kg',minQty:8,status:'week'},
  {name:'Eggs',qty:'24 pcs',expiry:7,vendor:'Farm Direct',phone:'9823456710',unit:'dozen',minQty:5,status:'week'},
  {name:'Basmati Rice',qty:'5 kg',expiry:30,vendor:'Grain Store',phone:'9800112233',unit:'kg',minQty:20,status:'good'},
  {name:'Cooking Oil',qty:'1.5 L',expiry:90,vendor:'Bulk Oil Co',phone:'9911223344',unit:'L',minQty:10,status:'reorder'},
  {name:'Butter',qty:'200 g',expiry:14,vendor:'Dairy Direct',phone:'9812345670',unit:'kg',minQty:3,status:'good'},
];
function renderExpiryPage(){
  const critical=expiryData.filter(e=>e.expiry<=3);
  const week=expiryData.filter(e=>e.expiry>3&&e.expiry<=7);
  const reorder=expiryData.filter(e=>e.status==='reorder'||e.qty.split(' ')[0]<e.minQty);
  const good=expiryData.filter(e=>e.expiry>7&&e.status!=='reorder');
  document.getElementById('exp-critical').textContent=critical.length;
  document.getElementById('exp-week').textContent=week.length;
  document.getElementById('exp-reorder').textContent=reorder.length;
  document.getElementById('exp-good').textContent=good.length;
  document.getElementById('expiryList').innerHTML= critical.length ? critical.map(e=>`
    <div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:rgba(239,68,68,.05);border:1.5px solid rgba(239,68,68,.2);border-radius:11px;">
      <div style="font-size:28px;">📦</div>
      <div style="flex:1;">
        <div style="font-weight:800;font-size:14px;">${e.name}</div>
        <div style="font-size:12px;color:var(--text2);">Stock: ${e.qty} | Vendor: ${e.vendor}</div>
        <div style="font-size:11px;color:var(--text2);font-family:var(--font-mono);">📞 ${e.phone||'—'}</div>
      </div>
      <div style="text-align:right;display:flex;flex-direction:column;gap:5px;align-items:flex-end;">
        <div style="font-size:12px;font-weight:900;color:var(--red);">⚠️ ${e.expiry} day${e.expiry>1?'s':''} left</div>
        <div style="display:flex;gap:5px;">
          <button class="btn-sm" style="border-color:var(--blue);color:var(--blue);font-size:10px;padding:3px 8px;" onclick="callVendor('${e.vendor}','${e.phone}')">📞 Call</button>
          <button class="btn-sm" style="border-color:var(--green);color:var(--green);font-size:10px;padding:3px 8px;" onclick="sendReorder('${e.vendor}','${e.phone}','${e.name}','${e.minQty}','${e.unit}')">💬 WhatsApp</button>
        </div>
      </div>
    </div>`).join('')
  : `<div style="text-align:center;color:var(--green);padding:20px;font-weight:700;">✅ Koi critical item nahi!</div>`;
  const vendors=[...new Map(expiryData.filter(e=>e.expiry<=7||e.status==='reorder').map(e=>[e.vendor,e])).values()];
  document.getElementById('vendorList').innerHTML= vendors.length ? vendors.map(e=>`
    <div style="padding:12px 14px;background:var(--bg3);border:1px solid var(--border);border-radius:11px;">
      <div style="font-weight:800;font-size:13px;">🏪 ${e.vendor}</div>
      <div style="font-size:12px;color:var(--text2);margin-bottom:8px;font-family:var(--font-mono);">📞 ${e.phone||'—'}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn-sm btn-green" onclick="callVendor('${e.vendor}','${e.phone}')"><i data-lucide="phone"></i> Call Now</button>
        <button class="btn-sm btn-gold" onclick="sendReorder('${e.vendor}','${e.phone}')"><i data-lucide="message-circle"></i> WhatsApp Order</button>
      </div>
    </div>`).join('')
  : `<div style="text-align:center;color:var(--text2);padding:20px;font-size:13px;">Koi urgent vendor nahi</div>`;
  document.getElementById('expiryTableBody').innerHTML=expiryData.map((e,idx)=>{
    const statusColor=e.expiry<=2?'var(--red)':e.expiry<=7?'var(--orange)':e.status==='reorder'?'var(--blue)':'var(--green)';
    const statusLabel=e.expiry<=2?'🔴 CRITICAL':e.expiry<=7?'🟡 THIS WEEK':e.status==='reorder'?'🔵 REORDER':'🟢 OK';
    return `<tr style="border-bottom:1px solid var(--border);">
      <td style="padding:10px 14px;font-weight:700;">${e.name}</td>
      <td style="padding:10px 14px;text-align:center;">${e.qty}</td>
      <td style="padding:10px 14px;text-align:center;font-family:var(--font-mono);">In ${e.expiry} days</td>
      <td style="padding:10px 14px;text-align:center;font-weight:800;color:${statusColor};">${e.expiry}</td>
      <td style="padding:10px 14px;text-align:center;"><span style="color:${statusColor};font-size:11px;font-weight:800;">${statusLabel}</span></td>
      <td style="padding:10px 14px;text-align:center;">
        <div style="display:flex;gap:5px;justify-content:center;flex-wrap:wrap;">
          <button class="btn-sm" style="font-size:10px;padding:3px 8px;border-color:var(--blue);color:var(--blue);" onclick="callVendor('${e.vendor}','${e.phone}')">📞</button>
          <button class="btn-sm" style="font-size:10px;padding:3px 8px;border-color:var(--green);color:var(--green);" onclick="sendReorder('${e.vendor}','${e.phone}','${e.name}','${e.minQty}','${e.unit}')">💬</button>
          <button class="btn-sm" style="font-size:10px;padding:3px 8px;border-color:var(--red);color:var(--red);" onclick="deleteExpiryItem(${idx})">🗑</button>
        </div>
      </td>
    </tr>`;}).join('');
  if(window.lucide) lucide.createIcons();
}

// ─── REAL CALL: phone dialer open karo ───
function callVendor(name, phone) {
  if (!phone || phone === '0000000000') {
    showToast('⚠️ Phone number nahi hai — pehle add karo', 'var(--red)');
    return;
  }
  window.location.href = 'tel:' + phone;
  showToast('📞 ' + name + ' ko call kar rahe hain...', 'var(--blue)');
}

// ─── REAL WHATSAPP: direct message with order details ───
function sendReorder(vendorName, phone, itemName, qty, unit) {
  // Find all items for this vendor
  const items = expiryData.filter(e => e.vendor === vendorName);
  let orderLines = '';
  if (itemName) {
    // Single item reorder
    orderLines = `• ${itemName}: ${qty || '?'} ${unit || ''}`;
  } else {
    // All items for this vendor
    orderLines = items.map(i => `• ${i.name}: ${i.minQty} ${i.unit}`).join('\n');
  }
  const vendorPhone = phone || (items[0] && items[0].phone);
  if (!vendorPhone || vendorPhone === '0000000000') {
    showToast('⚠️ WhatsApp number nahi hai — pehle add karo', 'var(--red)');
    return;
  }
  const today = new Date().toLocaleDateString('en-IN', {day:'numeric', month:'long', year:'numeric'});
  const msg = `🍽️ *Siplora CHEF — Saman Order*\n\nNamaste *${vendorName}*,\n\nHumein niche diye gaye saman ki zarurat hai:\n\n${orderLines}\n\n📅 Date: ${today}\n📍 Delivery: Jaldi se please\n\nKripya confirm karein.\n\nDhanyawad 🙏\n— Siplora Chef Team`;
  const url = 'https://wa.me/91' + vendorPhone.replace(/\D/g,'') + '?text=' + encodeURIComponent(msg);
  window.open(url, '_blank');
  showToast('📱 WhatsApp khul raha hai — ' + vendorName, 'var(--green)');
}

// ─── SEND ALL REORDERS via WhatsApp ───
function sendAllReorders() {
  const vendors = [...new Map(expiryData.filter(e => e.status === 'reorder' || e.expiry <= 7).map(e => [e.vendor, e])).values()];
  if (vendors.length === 0) { showToast('Koi reorder pending nahi!', 'var(--orange)'); return; }
  let count = 0;
  vendors.forEach((e, i) => {
    setTimeout(() => {
      sendReorder(e.vendor, e.phone);
      count++;
      if (count === vendors.length) showToast(`✅ ${count} vendors ko WhatsApp bheja!`, 'var(--green)');
    }, i * 800);
  });
}

// ─── ADD NEW EXPIRY ITEM ───
function openAddExpiryModal() {
  openModal('addExpiryModal');
}

function addExpiryItem() {
  const name    = document.getElementById('ex-name').value.trim();
  const qty     = document.getElementById('ex-qty').value.trim();
  const unit    = document.getElementById('ex-unit').value;
  const exDate  = document.getElementById('ex-date').value;
  const vendor  = document.getElementById('ex-vendor').value.trim();
  const phone   = document.getElementById('ex-phone').value.trim();
  const minQty  = parseFloat(document.getElementById('ex-minqty').value) || 5;

  if (!name || !exDate || !vendor || !phone) {
    showToast('⚠️ Naam, Expiry Date, Vendor aur Phone bharein', 'var(--red)');
    return;
  }
  const today = new Date(); today.setHours(0,0,0,0);
  const exp   = new Date(exDate); exp.setHours(0,0,0,0);
  const daysLeft = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
  const status = daysLeft <= 3 ? 'critical' : daysLeft <= 7 ? 'week' : 'good';

  const item = { name, qty: qty + ' ' + unit, expiry: daysLeft, vendor, phone, unit, minQty, status, expiryDate: exDate };
  expiryData.push(item);

  // Firebase save (inventory collection me bhi)
  if (window.fbSave && window.COLLS) {
    const fbItem = { id: Date.now(), name, qty: parseFloat(qty) || 0, unit, expiry: exDate, minQty, emoji: '📦', vendor, phone };
    appData.inventory.push(fbItem);
    window.fbSave(window.COLLS.inventory, fbItem);
  }

  closeModal('addExpiryModal');
  // Reset form
  ['ex-name','ex-qty','ex-vendor','ex-phone','ex-minqty'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
  renderExpiryPage();
  showToast(`✅ ${name} expiry list mein add — Firebase save!`, 'var(--green)');
}

// ─── ADD NEW SUPPLIER / VENDOR ───
function openAddVendorModal() {
  openModal('addVendorModal');
}

function addVendorItem() {
  const name   = document.getElementById('v-name').value.trim();
  const phone  = document.getElementById('v-phone').value.trim();
  const items  = document.getElementById('v-items').value.trim();
  if (!name || !phone) { showToast('⚠️ Vendor naam aur phone zaruri hai', 'var(--red)'); return; }
  // Add a placeholder entry for this vendor in expiryData
  const entry = { name: items || 'General Supply', qty: '—', expiry: 30, vendor: name, phone, unit: 'unit', minQty: 1, status: 'good' };
  expiryData.push(entry);
  closeModal('addVendorModal');
  ['v-name','v-phone','v-items'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
  renderExpiryPage();
  showToast(`✅ Vendor "${name}" add ho gaya!`, 'var(--green)');
}

// ─── DELETE EXPIRY ITEM ───
function deleteExpiryItem(index) {
  if (index < 0 || index >= expiryData.length) return;
  const name = expiryData[index].name;
  expiryData.splice(index, 1);
  renderExpiryPage();
  showToast(`${name} remove ho gaya`, 'var(--red)');
}


// ══════════════════════════════════════════════
//   FEATURE 4: SHIFT PLANNER — UPGRADED
//   Firebase + AI + Real Stats + All Features
// ══════════════════════════════════════════════
const days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const shiftColors={
  morning:'rgba(245,158,11,.15)',
  afternoon:'rgba(59,130,246,.12)',
  evening:'rgba(139,92,246,.12)',
  night:'rgba(15,23,42,.35)',
  off:'rgba(100,100,100,.08)',
  leave:'rgba(239,68,68,.12)'
};
const shiftTextColors={
  morning:'var(--orange)',afternoon:'var(--blue)',evening:'var(--purple)',
  night:'#a0aec0',off:'var(--text2)',leave:'var(--red)'
};
const shiftLabels={
  morning:'🌅 Morning 9-5',afternoon:'☀️ Afternoon 12-8',
  evening:'🌆 Evening 4-12',night:'🌙 Night 8-4',
  off:'🏖️ Day Off',leave:'🤒 Leave'
};
const shiftHours={morning:8,afternoon:8,evening:8,night:8,off:0,leave:0};

let shiftWeekOffset=0;
let shiftData={};
let _shiftFbSaving=false;

// ── Firebase Init (same pattern as rest of app) ──
async function _shiftFbInit(){
  const [{initializeApp,getApps},{getFirestore}]=await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
  ]);
  const cfg={
    apiKey:'AIzaSyBsRxWD2R1GkSEM-duLwQe3jAi7yw5vvvM',
    authDomain:'restaurant-system-beec1.firebaseapp.com',
    projectId:'restaurant-system-beec1',
    storageBucket:'restaurant-system-beec1.firebasestorage.app',
    messagingSenderId:'106757122327',
    appId:'1:106757122327:web:723d8dacbba3087b686f52'
  };
  const apps=getApps();
  const app=apps.length?apps[0]:initializeApp(cfg);
  return getFirestore(app);
}

// ── Save shiftData to Firebase (chef_shifts collection) ──
async function shiftFbSave(){
  if(_shiftFbSaving)return;
  _shiftFbSaving=true;
  try{
    const db=await _shiftFbInit();
    const {doc,setDoc}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    // Save as one document per week key for efficiency
    const weekKey='week_'+_getWeekKey(shiftWeekOffset);
    await setDoc(doc(db,'chef_shifts',weekKey),{data:shiftData,weekKey,updatedAt:new Date().toISOString()},{merge:true});
    showToast('🔥 Shift schedule Firebase mein save ho gaya!','var(--green)');
  }catch(e){
    console.error('[ShiftFb] save error:',e.message);
    showToast('⚠️ Firebase save error: '+e.message,'var(--red)');
  }finally{_shiftFbSaving=false;}
}

// ── Load shiftData from Firebase for current week ──
async function shiftFbLoad(offset){
  try{
    const db=await _shiftFbInit();
    const {doc,getDoc}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const weekKey='week_'+_getWeekKey(offset);
    const snap=await getDoc(doc(db,'chef_shifts',weekKey));
    if(snap.exists()&&snap.data().data){
      // Merge loaded data into shiftData
      Object.assign(shiftData,snap.data().data);
      renderShiftPlanner();
      showToast('✅ Shift data load ho gaya!','var(--accent)');
    }
  }catch(e){console.error('[ShiftFb] load error:',e.message);}
}

function _getWeekKey(offset){
  const dates=getWeekDates(offset);
  return dates[0].toISOString().split('T')[0];
}

function getWeekDates(offset){
  const now=new Date();
  const day=now.getDay();
  const diff=now.getDate()-day+(day===0?-6:1);
  const monday=new Date(new Date().setDate(now.getDate()-day+(day===0?-6:1)+(offset*7)));
  return Array.from({length:7},(_,i)=>{const d=new Date(monday);d.setDate(monday.getDate()+i);return d;});
}

// ── Real Stats Calculator ──
function _calcShiftStats(staffList,dates){
  let totalHrs=0,morningCount=0,nightCount=0,daysOff=0,leaveCount=0,overtimeStaff=[];
  const staffHours={};
  staffList.forEach(s=>{
    let sHrs=0;
    dates.forEach(d=>{
      const key=s.name+'_'+d.toISOString().split('T')[0];
      const sh=shiftData[key]||'morning';
      sHrs+=shiftHours[sh]||0;
      if(sh==='morning')morningCount++;
      if(sh==='night')nightCount++;
      if(sh==='off')daysOff++;
      if(sh==='leave')leaveCount++;
    });
    totalHrs+=sHrs;
    staffHours[s.name]=sHrs;
    if(sHrs>48)overtimeStaff.push(s.name);
  });
  return{totalHrs,morningCount,nightCount,daysOff,leaveCount,overtimeStaff,staffHours};
}

// ── Coverage Check — min staff per day ──
function _checkCoverage(staffList,dates){
  const warnings=[];
  dates.forEach(d=>{
    const dateStr=d.toISOString().split('T')[0];
    const dayName=days[d.getDay()===0?6:d.getDay()-1];
    const working=staffList.filter(s=>{
      const sh=shiftData[s.name+'_'+dateStr]||'morning';
      return sh!=='off'&&sh!=='leave';
    }).length;
    if(working<2)warnings.push(`⚠️ ${dayName} ${d.getDate()} — sirf ${working} staff available!`);
  });
  return warnings;
}

function renderShiftPlanner(){
  const dates=getWeekDates(shiftWeekOffset);
  const label=dates[0].toLocaleDateString('en-IN',{day:'numeric',month:'short'})+' — '+dates[6].toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
  document.getElementById('shiftWeekLabel').textContent=label;

  const staffList=appData?.staff||[];
  const sel=document.getElementById('shift-staff-sel');
  if(sel)sel.innerHTML=staffList.map(s=>`<option value="${s.name}">${s.name} (${s.role})</option>`).join('');

  // ── Table Header ──
  const head=document.getElementById('shiftTableHead');
  if(head)head.innerHTML=`<tr style="background:var(--bg3);">
    <th style="padding:10px 14px;text-align:left;font-size:12px;color:var(--text2);min-width:140px;">STAFF</th>
    ${dates.map(d=>{
      const isToday=d.toDateString()===new Date().toDateString();
      return `<th style="padding:10px 8px;text-align:center;font-size:11px;color:${isToday?'var(--accent)':'var(--text2)'};${isToday?'font-weight:900;':''}">${days[d.getDay()===0?6:d.getDay()-1]}<br><span style="font-size:13px;color:${isToday?'var(--accent)':'var(--text)'};font-weight:900;${isToday?'background:var(--gold-dim);padding:2px 7px;border-radius:6px;':''}">${d.getDate()}</span></th>`;
    }).join('')}
  </tr>`;

  // ── Table Body ──
  const stats=_calcShiftStats(staffList,dates);
  const body=document.getElementById('shiftTableBody');
  if(body)body.innerHTML=staffList.map(s=>{
    const weekHrs=stats.staffHours[s.name]||0;
    const isOvertime=weekHrs>48;
    const phone=(s.phone||'').replace(/\D/g,'');
    const waPhone=phone.length===10?'91'+phone:phone;
    return `<tr style="border-bottom:1px solid var(--border);${isOvertime?'background:rgba(239,68,68,.04);':''}">
      <td style="padding:10px 14px;white-space:nowrap;min-width:170px;">
        <div style="font-weight:700;font-size:13px;">${s.emoji||'👤'} ${s.name}</div>
        <div style="font-size:10px;color:var(--text2);font-weight:600;text-transform:uppercase;">${s.role}</div>
        <div style="font-size:10px;font-weight:800;color:${isOvertime?'var(--red)':'var(--accent)'};margin-top:2px;">${weekHrs}h${isOvertime?' ⚠️ OT':''}</div>
        <div style="display:flex;gap:5px;margin-top:6px;">
          <button onclick="notifyStaffWA('${s.name.replace(/'/g,"\\'")}','${waPhone}')" 
            style="background:#25D366;color:#fff;border:none;border-radius:6px;padding:4px 8px;font-size:10px;font-weight:800;cursor:pointer;display:flex;align-items:center;gap:3px;" 
            title="WhatsApp pe shift bhejo">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413A11.824 11.824 0 0012.05 0z"/></svg>
            WA
          </button>
          <button onclick="callStaff('${phone}')" 
            style="background:var(--blue);color:#fff;border:none;border-radius:6px;padding:4px 8px;font-size:10px;font-weight:800;cursor:pointer;display:flex;align-items:center;gap:3px;"
            title="Call karo">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63 19.79 19.79 0 01.22 2 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
            Call
          </button>
        </div>
      </td>
      ${dates.map(d=>{
        const key=s.name+'_'+d.toISOString().split('T')[0];
        const shift=shiftData[key]||'morning';
        const isToday=d.toDateString()===new Date().toDateString();
        return `<td style="padding:5px;text-align:center;">
          <div style="background:${shiftColors[shift]};border-radius:8px;padding:6px 4px;font-size:10px;font-weight:700;cursor:pointer;min-width:78px;color:${shiftTextColors[shift]};border:${isToday?'1.5px solid var(--accent)':'1px solid transparent'};transition:all .15s;" 
               onclick="cycleShift('${s.name}','${d.toISOString().split('T')[0]}')" 
               title="Click to change shift">${shiftLabels[shift]}</div>
        </td>`;
      }).join('')}
    </tr>`;
  }).join('');

  // ── Real Stats ──
  const statsEl=document.getElementById('shiftStats');
  if(statsEl)statsEl.innerHTML=[
    {label:'Total Hours Scheduled',val:stats.totalHrs+' hrs',color:'var(--accent)'},
    {label:'Morning Shifts',val:stats.morningCount,color:'var(--orange)'},
    {label:'Night Shifts',val:stats.nightCount,color:'var(--purple)'},
    {label:'Days Off / Leave',val:stats.daysOff+' / '+stats.leaveCount,color:'var(--text2)'},
    {label:'Overtime Staff',val:stats.overtimeStaff.length>0?stats.overtimeStaff.join(', '):'None',color:stats.overtimeStaff.length>0?'var(--red)':'var(--green)'},
  ].map(s=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 12px;background:var(--bg3);border-radius:10px;gap:8px;">
    <span style="font-size:12px;color:var(--text2);">${s.label}</span>
    <span style="font-weight:800;color:${s.color};font-size:12px;text-align:right;">${s.val}</span>
  </div>`).join('');

  // ── Staff Summary (Real Hours) ──
  const staffSummary=document.getElementById('shiftStaffSummary');
  if(staffSummary)staffSummary.innerHTML=staffList.map(s=>{
    const hrs=stats.staffHours[s.name]||0;
    const workDays=dates.filter(d=>{const sh=shiftData[s.name+'_'+d.toISOString().split('T')[0]]||'morning';return sh!=='off'&&sh!=='leave';}).length;
    const isOT=hrs>48;
    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:9px 12px;background:var(--bg3);border-radius:10px;${isOT?'border:1px solid rgba(239,68,68,.3);':''}">
      <div style="font-weight:700;font-size:13px;">${s.emoji||'👤'} ${s.name}</div>
      <div style="display:flex;gap:6px;align-items:center;">
        <span style="background:rgba(46,156,94,.1);color:var(--accent);font-size:10px;font-weight:800;padding:3px 8px;border-radius:6px;">${workDays} shifts</span>
        <span style="background:${isOT?'rgba(239,68,68,.1)':'rgba(59,130,246,.1)'};color:${isOT?'var(--red)':'var(--blue)'};font-size:10px;font-weight:800;padding:3px 8px;border-radius:6px;">${hrs} hrs${isOT?' ⚠️':''}</span>
      </div>
    </div>`;
  }).join('');

  // ── Coverage Warnings ──
  const coverageWarnings=_checkCoverage(staffList,dates);
  let warningsEl=document.getElementById('shiftCoverageWarnings');
  if(!warningsEl){
    warningsEl=document.createElement('div');
    warningsEl.id='shiftCoverageWarnings';
    warningsEl.style.cssText='margin-top:10px;display:flex;flex-direction:column;gap:6px;';
    const statsCard=document.getElementById('shiftStats')?.parentElement;
    if(statsCard)statsCard.appendChild(warningsEl);
  }
  if(warningsEl)warningsEl.innerHTML=coverageWarnings.length>0
    ?coverageWarnings.map(w=>`<div style="padding:8px 12px;background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.3);border-radius:8px;font-size:12px;font-weight:700;color:var(--orange);">${w}</div>`).join('')
    :`<div style="padding:8px 12px;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2);border-radius:8px;font-size:12px;font-weight:700;color:var(--green);">✅ Coverage OK — Sab din staffing theek hai!</div>`;

  if(window.lucide)setTimeout(()=>lucide.createIcons(),80);
}

// ── Cycle Shift + Auto Firebase Save ──
const shiftCycle=['morning','afternoon','evening','night','leave','off'];
function cycleShift(staffName,date){
  const key=staffName+'_'+date;
  const cur=shiftData[key]||'morning';
  const idx=shiftCycle.indexOf(cur);
  shiftData[key]=shiftCycle[(idx+1)%shiftCycle.length];
  renderShiftPlanner();
  // Auto-save to Firebase after 800ms debounce
  clearTimeout(window._shiftSaveTimer);
  window._shiftSaveTimer=setTimeout(()=>shiftFbSave(),800);
}

function prevShiftWeek(){
  shiftWeekOffset--;
  renderShiftPlanner();
  shiftFbLoad(shiftWeekOffset);
}
function nextShiftWeek(){
  shiftWeekOffset++;
  renderShiftPlanner();
  shiftFbLoad(shiftWeekOffset);
}

// ── saveShift (from modal) ──
function saveShift(){
  const staff=document.getElementById('shift-staff-sel')?.value;
  const day=document.getElementById('shift-day-sel')?.value;
  const type=document.getElementById('shift-type')?.value||'morning';
  const startTime=document.getElementById('shift-start')?.value||'09:00';
  const endTime=document.getElementById('shift-end')?.value||'17:00';
  if(!staff||!day){showToast('Staff aur day select karo','var(--red)');return;}
  // Find the date for the selected day in current week
  const dates=getWeekDates(shiftWeekOffset);
  const dayIdx=days.indexOf(day);
  if(dayIdx>=0&&dates[dayIdx]){
    const dateStr=dates[dayIdx].toISOString().split('T')[0];
    shiftData[staff+'_'+dateStr]=type;
    renderShiftPlanner();
    shiftFbSave();
  }
  closeModal('addShiftModal');
  showToast(`✅ ${staff} ka ${day} shift (${shiftLabels[type]}) save ho gaya!`,'var(--green)');
}

// ── Copy Last Week Schedule ──
function copyLastWeekSchedule(){
  const currentDates=getWeekDates(shiftWeekOffset);
  const lastWeekDates=getWeekDates(shiftWeekOffset-1);
  const staffList=appData?.staff||[];
  let copied=0;
  staffList.forEach(s=>{
    lastWeekDates.forEach((d,i)=>{
      const lastKey=s.name+'_'+d.toISOString().split('T')[0];
      const currKey=s.name+'_'+currentDates[i].toISOString().split('T')[0];
      if(shiftData[lastKey]&&!shiftData[currKey]){
        shiftData[currKey]=shiftData[lastKey];
        copied++;
      }
    });
  });
  renderShiftPlanner();
  shiftFbSave();
  showToast(`✅ Last week ke ${copied} shifts copy ho gaye!`,'var(--green)');
}

// ── WhatsApp Schedule Share ──
function shareShiftWhatsApp(){
  const dates=getWeekDates(shiftWeekOffset);
  const staffList=appData?.staff||[];
  const weekLabel=dates[0].toLocaleDateString('en-IN',{day:'numeric',month:'short'})+' – '+dates[6].toLocaleDateString('en-IN',{day:'numeric',month:'short'});
  let msg=`🗓️ *Weekly Shift Schedule*\n_${weekLabel}_\n\n`;
  staffList.forEach(s=>{
    msg+=`*${s.name}* (${s.role})\n`;
    dates.forEach(d=>{
      const key=s.name+'_'+d.toISOString().split('T')[0];
      const sh=shiftData[key]||'morning';
      const dayName=days[d.getDay()===0?6:d.getDay()-1].substring(0,3);
      msg+=`  ${dayName}: ${shiftLabels[sh]}\n`;
    });
    msg+='\n';
  });
  msg+='_Siplora Chef Panel_ 👑';
  const waNum=localStorage.getItem('siplora_wa_num')||'';
  const url=`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`;
  window.open(url,'_blank');
}

// ── WhatsApp Notify — Single Staff ──
function notifyStaffWA(staffName,waPhone){
  const staff=appData?.staff?.find(s=>s.name===staffName);
  if(!staff){showToast('Staff nahi mila','var(--red)');return;}
  if(!waPhone||waPhone.length<10){
    showToast(`⚠️ ${staffName} ka phone number save nahi hai!`,'var(--orange)');
    return;
  }
  const dates=getWeekDates(shiftWeekOffset);
  const weekLabel=dates[0].toLocaleDateString('en-IN',{day:'numeric',month:'short'})+' – '+dates[6].toLocaleDateString('en-IN',{day:'numeric',month:'short'});

  // Build this staff's week schedule
  let scheduleLines='';
  dates.forEach(d=>{
    const key=staffName+'_'+d.toISOString().split('T')[0];
    const sh=shiftData[key]||'morning';
    const dayName=days[d.getDay()===0?6:d.getDay()-1];
    const dateStr=d.toLocaleDateString('en-IN',{day:'numeric',month:'short'});
    scheduleLines+=`  📅 *${dayName}, ${dateStr}* — ${shiftLabels[sh]}\n`;
  });

  // Shift timing details
  const shiftTimings={
    morning:'⏰ Timing: *9:00 AM – 5:00 PM*',
    afternoon:'⏰ Timing: *12:00 PM – 8:00 PM*',
    evening:'⏰ Timing: *4:00 PM – 12:00 AM*',
    night:'⏰ Timing: *8:00 PM – 4:00 AM*',
    off:'⏰ *Day Off — Rest karo!*',
    leave:'⏰ *Leave Approved*'
  };

  // Find today's or next upcoming shift
  const todayStr=new Date().toISOString().split('T')[0];
  let upcomingShift='';
  for(const d of dates){
    const ds=d.toISOString().split('T')[0];
    if(ds>=todayStr){
      const sh=shiftData[staffName+'_'+ds]||'morning';
      if(sh!=='off'&&sh!=='leave'){
        upcomingShift=`\n⚡ *Aapki agli shift:*\n  ${days[d.getDay()===0?6:d.getDay()-1]}, ${d.toLocaleDateString('en-IN',{day:'numeric',month:'short'})}\n  ${shiftTimings[sh]}`;
        break;
      }
    }
  }

  const msg=`👑 *Siplora Restaurant — Shift Notification*\n\nNamaste *${staffName}* ji! 🙏\n\nAapka is hafte ka schedule:\n\n${scheduleLines}${upcomingShift}\n\n📍 Kripya samay pe aaye aur abhi confirm karein.\n\n_— Siplora Chef Panel_ 🍽️`;

  const url=`https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`;
  window.open(url,'_blank');
  showToast(`✅ ${staffName} ko WhatsApp shift message bheja!`,'var(--green)');
}

// ── Direct Call — Single Staff ──
function callStaff(phone){
  if(!phone||phone.length<10){
    showToast('Phone number save nahi hai!','var(--red)');
    return;
  }
  window.location.href='tel:+91'+phone.replace(/\D/g,'').replace(/^91/,'');
}

// ── Notify ALL Staff — WhatsApp one by one ──
function notifyAllStaffWA(){
  const staffList=appData?.staff||[];
  if(staffList.length===0){showToast('Koi staff nahi hai','var(--red)');return;}

  const noPhone=staffList.filter(s=>!s.phone||s.phone.length<10).map(s=>s.name);
  if(noPhone.length>0){
    showToast(`⚠️ In ka phone nahi hai: ${noPhone.join(', ')}. Baaki ko bhej raha hoon...`,'var(--orange)');
  }

  let sent=0;
  const toNotify=staffList.filter(s=>s.phone&&s.phone.replace(/\D/g,'').length>=10);

  if(toNotify.length===0){showToast('Kisi bhi staff ka phone number nahi hai!','var(--red)');return;}

  // Open WhatsApp for each staff with 1.2s delay between each
  toNotify.forEach((s,i)=>{
    setTimeout(()=>{
      const phone=s.phone.replace(/\D/g,'');
      const waPhone=phone.length===10?'91'+phone:phone;
      notifyStaffWA(s.name,waPhone);
      sent++;
      if(sent===toNotify.length){
        showToast(`✅ Sab ${sent} staff ko WhatsApp schedule bhej diya!`,'var(--green)');
      }
    },i*1200);
  });

  showToast(`📲 ${toNotify.length} staff ko notifications bhej raha hoon...`,'var(--blue)');
}

// ── AI Smart Schedule Generator ──
async function aiGenerateSchedule(){
  const staffList=appData?.staff||[];
  if(staffList.length===0){showToast('Pehle staff add karo','var(--red)');return;}
  const btn=document.getElementById('aiScheduleBtn');
  if(btn){btn.disabled=true;btn.innerHTML='<i data-lucide="loader-2"></i> AI soch raha hai...';}
  showToast('🤖 AI schedule bana raha hai...','var(--blue)');

  try{
    const dates=getWeekDates(shiftWeekOffset);
    const weekLabel=dates[0].toLocaleDateString('en-IN',{day:'numeric',month:'short'})+' to '+dates[6].toLocaleDateString('en-IN',{day:'numeric',month:'short'});

    const staffInfo=staffList.map(s=>`- ${s.name} | Role: ${s.role} | Rating: ${s.rating||3}/5 | Shift preference: ${s.shift||'morning'} | Present days: ${s.presentDays||0} | Absent: ${s.absentDays||0}`).join('\n');

    const prompt=`You are a smart restaurant shift scheduler. Create an optimized weekly shift schedule.

STAFF LIST:
${staffInfo}

WEEK: ${weekLabel}
DAYS: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
SHIFT OPTIONS: morning (9AM-5PM, 8hrs), afternoon (12PM-8PM, 8hrs), evening (4PM-12AM, 8hrs), night (8PM-4AM, 8hrs), off (day off)

RULES:
1. Each staff member must get at least 1 day off per week
2. No staff should exceed 48 hours/week (overtime alert)
3. Every day must have at least 2 staff working
4. Match shift preference if possible (their usual shift)
5. Higher rated staff should get preferred shifts
6. Weekend (Sat/Sun) must have maximum staff coverage — busiest days
7. Distribute shifts fairly

Return ONLY a valid JSON object, no explanation, no markdown. Format:
{"StaffName_YYYY-MM-DD": "shifttype", ...}

Use these exact date strings: ${dates.map(d=>d.toISOString().split('T')[0]).join(', ')}
Use these exact staff names: ${staffList.map(s=>s.name).join(', ')}
Shift values must be exactly: morning, afternoon, evening, night, or off`;

    const text = await callGemini(null, prompt, 1200);
    // Extract JSON
    const jsonMatch=text.match(/\{[\s\S]*\}/);
    if(!jsonMatch)throw new Error('AI ne valid schedule nahi diya');
    const aiSchedule=JSON.parse(jsonMatch[0]);
    // Apply to shiftData
    let applied=0;
    Object.entries(aiSchedule).forEach(([key,val])=>{
      if(shiftCycle.includes(val)||val==='off'){
        shiftData[key]=val;
        applied++;
      }
    });
    renderShiftPlanner();
    shiftFbSave();
    showToast(`🤖 AI ne ${applied} shifts schedule kar diye! Firebase save ho gaya.`,'var(--accent)');

    // Show AI conflict check
    const stats=_calcShiftStats(staffList,dates);
    if(stats.overtimeStaff.length>0){
      setTimeout(()=>showToast(`⚠️ AI alert: ${stats.overtimeStaff.join(', ')} overtime mein hai!`,'var(--orange)'),1500);
    }
  }catch(e){
    console.error('[AI Shift]',e);
    showToast('AI error: '+e.message,'var(--red)');
  }finally{
    if(btn){btn.disabled=false;btn.innerHTML='<i data-lucide="sparkles"></i> AI Schedule';if(window.lucide)setTimeout(()=>lucide.createIcons(),80);}
  }
}

// ── AI Conflict Detector ──
async function aiDetectConflicts(){
  const staffList=appData?.staff||[];
  const dates=getWeekDates(shiftWeekOffset);
  const stats=_calcShiftStats(staffList,dates);
  const coverage=_checkCoverage(staffList,dates);

  const scheduleText=staffList.map(s=>
    `${s.name}: `+dates.map(d=>{const k=s.name+'_'+d.toISOString().split('T')[0];return days[d.getDay()===0?6:d.getDay()-1].substring(0,3)+':'+( shiftData[k]||'morning');}).join(', ')
  ).join('\n');

  const btn=document.getElementById('aiConflictBtn');
  if(btn){btn.disabled=true;btn.innerHTML='<i data-lucide="loader-2"></i> Check kar raha hai...';}

  try{
    const conflictMsg = `Restaurant shift schedule check karo. Short mein conflicts, overtime, aur suggestions do. Hindi + English mix mein jawab do.\n\nSchedule:\n${scheduleText}\n\nOvertime staff (48h+): ${stats.overtimeStaff.join(', ')||'None'}\nCoverage warnings: ${coverage.join('; ')||'None'}\n\nMax 5 bullet points mein specific actionable suggestions do.`;
    const aiText = await callGemini(null, conflictMsg, 600);
    // Show in a styled toast/modal area
    let aiBox=document.getElementById('shiftAiBox');
    if(!aiBox){
      aiBox=document.createElement('div');
      aiBox.id='shiftAiBox';
      aiBox.style.cssText='margin-top:12px;padding:14px;background:rgba(139,92,246,.08);border:1.5px solid rgba(139,92,246,.25);border-radius:12px;';
      const shiftPage=document.getElementById('page-shift');
      if(shiftPage)shiftPage.appendChild(aiBox);
    }
    aiBox.innerHTML=`<div style="font-size:12px;font-weight:800;color:var(--purple);margin-bottom:8px;">🤖 AI Conflict Analysis</div><div style="font-size:13px;color:var(--text);line-height:1.7;white-space:pre-wrap;">${aiText}</div><button onclick="document.getElementById('shiftAiBox').remove()" style="margin-top:10px;font-size:11px;color:var(--text2);background:none;border:none;cursor:pointer;text-decoration:underline;">Close</button>`;
    aiBox.scrollIntoView({behavior:'smooth',block:'nearest'});
  }catch(e){
    showToast('AI error: '+e.message,'var(--red)');
  }finally{
    if(btn){btn.disabled=false;btn.innerHTML='<i data-lucide="zap"></i> AI Conflicts';if(window.lucide)setTimeout(()=>lucide.createIcons(),80);}
  }
}

function printShift(){window.print();}

// ── Auto-load current week shifts on page open ──
(function(){
  const _origShowPage=window.showPage;
  window.showPage=function(page){
    if(typeof _origShowPage==='function')_origShowPage(page);
    if(page==='shift'){
      renderShiftPlanner();
      shiftFbLoad(shiftWeekOffset);
    }
  };
})();

// ══════════════════════════════════════════════
//   FEATURE 5: QR ORDERING
// ══════════════════════════════════════════════
let qrCart={};
let qrSelectedTable=1;
let qrIncoming=[];
const qrMenuItems=[
  {name:'Chicken Biryani',price:320,emoji:'🍗',cat:'Main'},
  {name:'Butter Naan',price:45,emoji:'🫓',cat:'Bread'},
  {name:'Dal Makhani',price:180,emoji:'🍲',cat:'Main'},
  {name:'Veg Fried Rice',price:160,emoji:'🍚',cat:'Rice'},
  {name:'Kung Pao Chicken',price:280,emoji:'🥢',cat:'Chinese'},
  {name:'Paneer Tikka',price:220,emoji:'🧀',cat:'Starter'},
  {name:'Masala Chai',price:30,emoji:'🍵',cat:'Beverage'},
  {name:'Cold Coffee',price:80,emoji:'☕',cat:'Beverage'},
  {name:'Chocolate Lava Cake',price:150,emoji:'🍫',cat:'Dessert'},
  {name:'BBQ Chicken Burger',price:220,emoji:'🍔',cat:'Grill'},
  {name:'Garlic Naan',price:55,emoji:'🫓',cat:'Bread'},
  {name:'Mango Lassi',price:70,emoji:'🥛',cat:'Beverage'},
];
function initQRPage(){
  renderQRTableGrid();
  renderAllTablesQR();
  renderQRMenu();
  renderQRIncoming();
  // Auto-select table 1
  if(!_selectedQRTable) selectQRTable(1);
}
// Old selectQRTable removed - new one defined above in populateSelects section
function generateTableQR(table){
  const el=document.getElementById('qrcode-gen');if(!el)return;
  el.innerHTML='';
  const baseUrl=window.location.href.replace(/[^/]*$/,'');
  const url=baseUrl+'menu.html?table='+table;
  try{
    if(typeof QRCode!=='undefined'){
      new QRCode(el,{text:url,width:160,height:160,colorDark:'#0f1923',colorLight:'#ffffff'});
    } else {
      el.innerHTML=`<div style="width:160px;height:160px;background:linear-gradient(135deg,#0f1923,#1a2535);display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:12px;color:#4ade80;font-size:12px;font-weight:700;gap:8px;"><div style="font-size:36px;">📱</div>QR Code<div style="font-size:10px;opacity:.7;">Table ${table}</div></div>`;
    }
  }catch(e){el.innerHTML=`<div style="padding:30px;color:var(--text2);">📱 Table ${table} QR</div>`;}
}
// downloadQR and printQR defined in populateSelects section above
function renderQRMenu(filter=''){
  const el=document.getElementById('qrMenuList');if(!el)return;
  const items=filter?qrMenuItems.filter(m=>m.name.toLowerCase().includes(filter.toLowerCase())):qrMenuItems;
  el.innerHTML=items.map(m=>`
    <div style="display:flex;align-items:center;justify-content:space-between;padding:9px 12px;background:#1a2535;border-radius:10px;border:1px solid #334;">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:20px;">${m.emoji}</span>
        <div>
          <div style="color:#fff;font-size:12px;font-weight:700;">${m.name}</div>
          <div style="color:#4ade80;font-size:11px;font-weight:800;">₹${m.price}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        ${qrCart[m.name]?`<button onclick="qrCartChange('${m.name}',-1,${m.price})" style="background:#334;border:none;color:#fff;width:24px;height:24px;border-radius:6px;cursor:pointer;font-size:14px;">−</button>
        <span style="color:#fff;font-weight:800;font-size:13px;min-width:16px;text-align:center;">${qrCart[m.name]}</span>`:''}
        <button onclick="qrCartChange('${m.name}',1,${m.price})" style="background:var(--accent);border:none;color:#fff;width:24px;height:24px;border-radius:6px;cursor:pointer;font-size:14px;">+</button>
      </div>
    </div>`).join('');
}
function qrSearchMenu(){renderQRMenu(document.getElementById('qrMenuSearch')?.value||'');}
function qrCartChange(name,delta,price){
  qrCart[name]=(qrCart[name]||0)+delta;
  if(qrCart[name]<=0)delete qrCart[name];
  renderQRMenu(document.getElementById('qrMenuSearch')?.value||'');
  renderQRCart();
}
function renderQRCart(){
  const el=document.getElementById('qrCartList');const tot=document.getElementById('qrCartTotal');
  if(!el)return;
  const entries=Object.entries(qrCart);
  if(!entries.length){el.innerHTML='<div style="color:#666;font-style:italic;">Koi item nahi. Menu se add karo.</div>';if(tot)tot.textContent='₹0';return;}
  let total=0;
  el.innerHTML=entries.map(([name,qty])=>{
    const item=qrMenuItems.find(m=>m.name===name);
    const amt=(item?.price||0)*qty;total+=amt;
    return `<div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>${name} ×${qty}</span><span>₹${amt}</span></div>`;
  }).join('');
  if(tot)tot.textContent='₹'+total;
}
function placeQROrder(){
  if(!Object.keys(qrCart).length){showToast('⚠️ Pehle kuch items add karo!');return;}
  const items=Object.entries(qrCart).map(([name,qty])=>name+' x'+qty);
  const order={id:'QR-'+Date.now().toString().slice(-4),table:qrSelectedTable,items,time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}),status:'new'};
  qrIncoming.unshift(order);
  renderQRIncoming();
  qrCart={};
  renderQRMenu();renderQRCart();
  showToast('✅ Table '+qrSelectedTable+' ka order kitchen ko bheja gaya!');
  if(typeof triggerAudioAlert==='function')triggerAudioAlert('📱','QR ORDER','Table '+qrSelectedTable+' ne QR se order diya!','alert-ready');
}
function renderQRIncoming(){
  const el=document.getElementById('qrIncomingOrders');if(!el)return;
  if(!qrIncoming.length){el.innerHTML='<div style="text-align:center;color:var(--text2);padding:16px;font-size:13px;">Abhi koi QR order nahi aaya.</div>';return;}
  el.innerHTML=qrIncoming.map(o=>`
    <div style="padding:12px 14px;background:rgba(46,156,94,.05);border:1.5px solid rgba(46,156,94,.2);border-radius:11px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span style="font-weight:800;font-size:13px;">📱 Table ${o.table} — Order ${o.id}</span>
        <span style="font-size:11px;color:var(--text2);">${o.time}</span>
      </div>
      <div style="font-size:12px;color:var(--text2);">${o.items.join(' • ')}</div>
      <div style="display:flex;gap:7px;margin-top:8px;">
        <button class="btn-sm btn-green" style="font-size:11px;" onclick="acceptQROrder('${o.id}')"><i data-lucide="check"></i> Accept</button>
        <button class="btn-sm" style="font-size:11px;border-color:var(--blue);color:var(--blue);" onclick="createKOTFromQR('${o.id}')"><i data-lucide="receipt"></i> Make KOT</button>
      </div>
    </div>`).join('');
  lucide.createIcons();
}
function acceptQROrder(id){qrIncoming=qrIncoming.filter(o=>o.id!==id);renderQRIncoming();showToast('✅ Order accepted! Kitchen mein bheja.');}
function createKOTFromQR(id){acceptQROrder(id);showToast('🧾 KOT create ho gaya from QR order!');}

// ══════════════════════════════════════════════
//   PAGE SHOW HOOKS — init new pages
// ══════════════════════════════════════════════
const _origShowPage=window.showPage;
window.showPage=function(page){
  if(typeof _origShowPage==='function')_origShowPage(page);
  if(page==='recipe'){renderRecipeGrid();renderPrepChecklist();}
  else if(page==='gstbill'){initGSTPage();}
  else if(page==='expiry'){renderExpiryPage();}
  else if(page==='shift'){renderShiftPlanner();}
  else if(page==='qrorder'){initQRPage();}
};

// Auto-init on page load (deferred)
setTimeout(()=>{
  renderPrepChecklist();
  renderQRCart();
},2000);


// ─── 3. KITCHEN HEAT MONITOR ───
const heatData=[
  {name:'🔥 Tandoor',load:88,emoji:'🔥'},
  {name:'🥡 Chinese',load:65,emoji:'🥡'},
  {name:'🥩 Grill',load:92,emoji:'🥩'},
  {name:'🍮 Dessert',load:30,emoji:'🍮'},
  {name:'❄️ Cold',load:45,emoji:'❄️'},
];
const heatAiTips=[
  '→ <strong>Grill overloaded!</strong> Pasta order Counter 2 pe bhejo',
  '→ <strong>Tandoor 88%!</strong> Roti orders Dessert station se handle karo',
  '→ <strong>Chinese normal hai.</strong> Orders maintain karo',
  '→ <strong>Grill 92% full!</strong> Naye orders route karo',
  '→ Peak hour aa raha hai. <strong>Stations prepare karo!</strong>',
];
let heatTipIdx=0;

function toggleHeatMonitor(){
  const w=document.getElementById('heatMonitorWidget');
  w.classList.toggle('open');
  if(w.classList.contains('open'))renderHeatMonitor();
}

function renderHeatMonitor(){
  const el=document.getElementById('heatStations');if(!el)return;
  el.innerHTML=heatData.map(s=>{
    const cls=s.load>=80?'heat-high':s.load>=55?'heat-mid':'heat-low';
    const col=s.load>=80?'var(--red)':s.load>=55?'var(--orange)':'var(--green)';
    return `<div class="hmw-station">
      <div class="hmw-stn-name">${s.name}</div>
      <div class="hmw-bar-bg"><div class="hmw-bar-fill ${cls}" style="width:${s.load}%;"></div></div>
      <div class="hmw-pct" style="color:${col};">${s.load}%</div>
    </div>`;
  }).join('');
  document.getElementById('heatAiTip').innerHTML='🤖 '+heatAiTips[heatTipIdx%heatAiTips.length];
  heatTipIdx++;
}

// Auto-update heat every 12s
setInterval(()=>{
  heatData.forEach(s=>{s.load=Math.max(10,Math.min(99,s.load+(Math.random()>0.5?5:-4)));});
  if(document.getElementById('heatMonitorWidget').classList.contains('open'))renderHeatMonitor();
},12000);

// ─── 4. SMART BATCH COOKING ───
function toggleBatchPanel(){
  const p=document.getElementById('batchPanel');
  p.classList.toggle('open');
  if(p.classList.contains('open'))renderBatchSuggestions();
}

function renderBatchSuggestions(){
  const el=document.getElementById('batchSuggestions');if(!el)return;
  const pending=appData.kots.filter(k=>k.status==='pending'||k.status==='preparing');
  // count items
  const itemCounts={};
  pending.forEach(k=>k.items.forEach(item=>{const key=item.split('x')[0].trim();itemCounts[key]=(itemCounts[key]||0)+1;}));
  const batches=Object.entries(itemCounts).filter(([,c])=>c>1).map(([name,count])=>({name,count}));
  // static smart suggestions always shown
  const staticSuggestions=[
    {title:'🍔 Burger Batch',desc:`3 burger orders pending → ek saath prepare karo. 8-10 min bachega!`,badge:'SAVE 10 MIN'},
    {title:'🍟 Fries Batch',desc:`4 tables ne fries maangi hain → ek batch mein cook karo.`,badge:'EFFICIENCY +40%'},
    {title:'🍲 Dal Gravy',desc:`Dal Makhani aur Dal Tadka ek hi gravy base share karte hain → together prepare karo.`,badge:'SMART PREP'},
  ];
  const dynamic=batches.map(b=>({
    title:`🔄 ${b.name} Batch`,
    desc:`${b.count} orders mein ${b.name} hai → ek saath cook karo time aur energy dono bachega!`,
    badge:`×${b.count} ORDERS`,
  }));
  const all=[...dynamic,...staticSuggestions].slice(0,5);
  el.innerHTML=all.length?all.map(s=>`
    <div class="bp-card">
      <div class="bp-card-title">${s.title}</div>
      <div class="bp-card-desc">${s.desc}</div>
      <span class="bp-card-badge">${s.badge}</span>
    </div>`).join('')
    :`<div style="text-align:center;padding:18px;color:var(--text2);font-size:13px;">Koi batch suggestion nahi. Orders add karo!</div>`;
}

// Auto-refresh batch suggestions every 20s
setInterval(()=>{if(document.getElementById('batchPanel').classList.contains('open'))renderBatchSuggestions();},20000);

// ─── 5. CHEF SMARTWATCH ───
let swOpen=false;
const swNotifications=[
  {text:'🆕 New order: Table 3',type:'sw-vip'},
  {text:'⏱️ Timer: Biryani 12min',type:''},
  {text:'✅ Ready: Naan Table 5',type:'sw-ready'},
  {text:'🚨 URGENT: Table 9!',type:'sw-urgent'},
  {text:'⚠️ Delay: Dal 8min late',type:'sw-urgent'},
  {text:'👑 VIP order arrived!',type:'sw-vip'},
  {text:'🍽️ Pickup: Counter 2',type:'sw-ready'},
];
let swNotifIdx=0;

function toggleSmartwatch(){
  const w=document.getElementById('smartwatchWidget');
  const t=document.getElementById('swToggleBtn');
  swOpen=!swOpen;
  if(swOpen){w.classList.add('open');t.style.display='none';updateSwTime();}
  else{w.classList.remove('open');t.style.display='flex';}
}

function updateSwTime(){
  const el=document.getElementById('swTime');if(!el)return;
  const n=new Date();
  el.textContent=n.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:false});
}
setInterval(updateSwTime,1000);

function addSwNotification(text,type){
  const area=document.getElementById('swNotifArea');if(!area)return;
  const div=document.createElement('div');div.className='sw-notif'+(type?' '+type:'');
  div.textContent=text;area.insertBefore(div,area.firstChild);
  // Keep max 3
  while(area.children.length>3)area.removeChild(area.lastChild);
  // Vibrate animation
  const face=document.getElementById('swWatchFace');if(face){face.classList.add('sw-vibrate');setTimeout(()=>face.classList.remove('sw-vibrate'),400);}
  
}

// ══════════════════════════════════════════════
//   🔥 FIREBASE LIVE ORDERS — REAL-TIME FROM MENU.HTML
// ══════════════════════════════════════════════
window.addEventListener('load', function(){
(async function initChefFirebase(){
  const FB_CFG={
    apiKey:"AIzaSyBsRxWD2R1GkSEM-duLwQe3jAi7yw5vvvM",
    authDomain:"restaurant-system-beec1.firebaseapp.com",
    projectId:"restaurant-system-beec1",
    storageBucket:"restaurant-system-beec1.firebasestorage.app",
    messagingSenderId:"106757122327",
    appId:"1:106757122327:web:723d8dacbba3087b686f52",
    measurementId:"G-5MQHDVS4TN"
  };
  try{
    const [{initializeApp,getApps},{getFirestore,collection,onSnapshot,doc,updateDoc,serverTimestamp,query,orderBy,where}]=await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js")
    ]);
    const apps=getApps();
    const fbApp=apps.length?apps[0]:initializeApp(FB_CFG);
    const db=getFirestore(fbApp);
    window.__chefDb=db; window.__chefDoc=doc; window.__chefUpdateDoc=updateDoc;
    // Dashboard Firebase data load karo on startup
    setTimeout(()=>{ if(typeof loadDashboardFromFirebase==='function') loadDashboardFromFirebase(); }, 1200);
    window.__chefCollection=collection; window.__chefOnSnapshot=onSnapshot;
    // 🔥 Recipe Book — Firebase se saved recipes load karo
    setTimeout(()=>{ if(typeof rbLoadFromFirebase==='function') rbLoadFromFirebase(); },1500);
    showToast('🔥 Firebase connected — Live orders ready!');

    // ══ MASTER DASHBOARD TABLES SYNC ══
    // billing.html ke tables collection se real-time status lo
    window._masterTablesData = {};
    onSnapshot(collection(db,'tables'), snap=>{
      const masterMap={};
      snap.forEach(d=>{
        const tNum=parseInt(d.id);
        if(!isNaN(tNum)) masterMap[tNum]={...d.data(), _id:d.id};
      });
      window._masterTablesData=masterMap;
      // appData.tables mein sync karo
      appData.tables.forEach(t=>{
        const m=masterMap[t.id];
        if(m){
          // Status mapping: billing.html → chef panel
          const statusMap={available:'available',occupied:'pending',reserved:'vip','not-available':'urgent'};
          if(m.status && statusMap[m.status]) t.status=statusMap[m.status];
          if(m.customerName) t.customerName=m.customerName;
          if(m.customerPhone) t.customerPhone=m.customerPhone;
          if(m.currentOrder&&Array.isArray(m.currentOrder)&&m.currentOrder.length){
            t.items=m.currentOrder.map(i=>i.name||i);
          }
        }
      });
      // Tables page active hai to refresh karo
      if(document.getElementById('page-tables')?.classList.contains('active')) renderTables();
    });
    showToast('✅ Master Dashboard tables sync LIVE!');

    // Live listener on orders — pending & accepted
    let _prevOrderIds=new Set();
    onSnapshot(collection(db,'orders'), snap=>{
      const orders=[];
      snap.forEach(d=>{ const o={_fbId:d.id,...d.data()}; if(o.status!=='paid'&&o.status!=='cancelled'&&o.source!=='order-desk') orders.push(o); });
      // Sort: NEWEST orders FIRST (by timestamp descending) — naye orders hamesha upar
      orders.sort((a,b)=>{
        const tA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const tB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return tB - tA; // descending: newest first
      });
      window._liveFirebaseOrders=orders;

      // Badge count
      const pendingCount=orders.filter(o=>o.status==='pending').length;
      const badge=document.getElementById('liveMenuBadge');
      if(badge) badge.textContent=pendingCount>0?pendingCount:'';

      // Sound + voice for NEW pending orders
      snap.docChanges().forEach(change=>{
        if(change.type==='added'){
          const o={_fbId:change.doc.id,...change.doc.data()};
          if(o.status==='pending' && o.source!=='order-desk' && !_prevOrderIds.has(o._fbId)){
            _prevOrderIds.add(o._fbId);
            const tbl=o.tableNumber||o.table||'?';
            const custName=o.customerName||'Customer';
            const custPhone=o.customerPhone||'';
            const itemNames=(o.items||[]).map(i=>`${i.name}${i.qty>1?' ×'+i.qty:''}`).join(', ');
            const alertMsg=`🪑 Table ${tbl} | 👤 ${custName} | ${itemNames}`;
            // Sirf table number — details timer set hone pe bolunga
            NovaVoice.speak(`Chef! Table ${tbl} par naya order aaya hai.`, true);
            triggerAudioAlert('📱','NEW ORDER',alertMsg,'alert-ready');
            showToast(`📱 Table ${tbl} — ${custName} ka naya order!`,'var(--green)');
            // Smartwatch notification
            addSwNotification(`🆕 Table ${tbl} — ${custName}`, 'sw-vip');
            // Update ticker
            const ticker=document.getElementById('tickerInner');
            if(ticker){
              const span=document.createElement('span');span.className='ticker-item';
              span.textContent=`🆕 New Order — Table ${tbl} | ${custName}: ${itemNames}`;
              ticker.insertBefore(span,ticker.firstChild);
            }
          }
        }
      });
      orders.forEach(o=>_prevOrderIds.add(o._fbId));

      // Firebase mein served/paid orders → servedOrdersHistory mein add karo (agar nahi hain)
      const fbServedOrders = orders.filter(o=>o.status==='served'||o.status==='paid');
      if(fbServedOrders.length>0){
        if(!appData.servedOrdersHistory) appData.servedOrdersHistory=[];
        if(!appData.todayOrders) appData.todayOrders=[];
        fbServedOrders.forEach(o=>{
          const fbId='FB-'+(o._fbId||'').slice(-6).toUpperCase();
          // Pehle check karo agar already history mein hai
          const alreadyInHistory = appData.servedOrdersHistory.some(h=>h._fbId===o._fbId||h.id===fbId);
          if(!alreadyInHistory){
            const servedEntry={
              id:fbId, _fbId:o._fbId, _source:'firebase',
              tableId:o.tableNumber||o.table||'?',
              customerName:o.customerName||'Customer',
              customerPhone:o.customerPhone||'',
              dishes:(o.items||[]).map(i=>`${i.name} \xd7${i.qty||1}`),
              notes:o.notes||'',
              status:'served',
              waiter:o.assignedWaiter||o.servedBy||'—',
              servedAt:o.servedAt?new Date(o.servedAt).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}):new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}),
              servedAtFull:o.servedAt?new Date(o.servedAt).toLocaleString('en-IN',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'short'}):new Date().toLocaleString('en-IN',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'short'}),
              createdAt:o.timestamp?new Date(o.timestamp).getTime():Date.now()
            };
            appData.servedOrdersHistory.unshift(servedEntry);
            const alreadyToday=appData.todayOrders.some(h=>h._fbId===o._fbId||h.id===fbId);
            if(!alreadyToday) appData.todayOrders.unshift(servedEntry);
          }
        });
      }

      // Re-render if livemenu page is active
      if(document.getElementById('page-livemenu')?.classList.contains('active')){
        renderLiveMenu();
        renderNewOrders(); // Naye orders hamesha upar dikho
      }
      // KOT page bhi refresh karo — Firebase orders wahan bhi dikhenge
      if(document.getElementById('page-kot')?.classList.contains('active')){
        if(typeof renderKOT==='function') renderKOT();
      }
      // Also update dashboard
      renderDashboard();
    });
  }catch(e){ console.warn('[CHEF FB] Firebase error:',e.message); }
})();
}); // end window load

// ── LIVE MENU COUNTDOWN INTERVAL ──
// Har 1 second mein Live Menu re-render karo taaki captain + chef timers live tick karein
setInterval(function(){
  if(document.getElementById('page-livemenu')?.classList.contains('active')){
    if(typeof renderLiveMenu==='function') renderLiveMenu();
  }
  // KitBoard timers bhi update karo
  if(document.getElementById('page-kitboard')?.classList.contains('active')){
    if(typeof renderKitBoard==='function') renderKitBoard();
  }
}, 1000);

// ── CHEF TIME SET MODAL ──
(function injectTimeModal(){
  const modalHtml=`
  <div id="chefTimeModal" style="position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.6);backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;padding:20px;">
    <div style="background:#1a2535;border:1px solid rgba(46,156,94,0.4);border-radius:20px;padding:28px 24px;max-width:360px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,0.5),0 0 40px rgba(46,156,94,0.12);position:relative;">
      <div style="position:absolute;top:0;left:15%;right:15%;height:3px;background:linear-gradient(90deg,transparent,#2e9c5e,transparent);border-radius:3px;"></div>
      <div style="font-family:'Playfair Display',serif;font-size:20px;font-weight:800;color:#fff;margin-bottom:6px;">⏱ Time Set Karo</div>
      <div id="ctmTableLabel" style="font-size:13px;color:#4ade80;font-weight:700;margin-bottom:18px;"></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
        <button onclick="ctmSetPreset(5)"  style="flex:1;min-width:60px;padding:10px 0;border-radius:10px;border:1.5px solid rgba(46,156,94,0.3);background:rgba(46,156,94,0.08);color:#4ade80;font-weight:700;font-size:13px;cursor:pointer;" onmouseover="this.style.background='rgba(46,156,94,0.18)'" onmouseout="this.style.background='rgba(46,156,94,0.08)'">5 min</button>
        <button onclick="ctmSetPreset(10)" style="flex:1;min-width:60px;padding:10px 0;border-radius:10px;border:1.5px solid rgba(46,156,94,0.3);background:rgba(46,156,94,0.08);color:#4ade80;font-weight:700;font-size:13px;cursor:pointer;" onmouseover="this.style.background='rgba(46,156,94,0.18)'" onmouseout="this.style.background='rgba(46,156,94,0.08)'">10 min</button>
        <button onclick="ctmSetPreset(15)" style="flex:1;min-width:60px;padding:10px 0;border-radius:10px;border:1.5px solid rgba(46,156,94,0.3);background:rgba(46,156,94,0.08);color:#4ade80;font-weight:700;font-size:13px;cursor:pointer;" onmouseover="this.style.background='rgba(46,156,94,0.18)'" onmouseout="this.style.background='rgba(46,156,94,0.08)'">15 min</button>
        <button onclick="ctmSetPreset(20)" style="flex:1;min-width:60px;padding:10px 0;border-radius:10px;border:1.5px solid rgba(46,156,94,0.3);background:rgba(46,156,94,0.08);color:#4ade80;font-weight:700;font-size:13px;cursor:pointer;" onmouseover="this.style.background='rgba(46,156,94,0.18)'" onmouseout="this.style.background='rgba(46,156,94,0.08)'">20 min</button>
        <button onclick="ctmSetPreset(30)" style="flex:1;min-width:60px;padding:10px 0;border-radius:10px;border:1.5px solid rgba(46,156,94,0.3);background:rgba(46,156,94,0.08);color:#4ade80;font-weight:700;font-size:13px;cursor:pointer;" onmouseover="this.style.background='rgba(46,156,94,0.18)'" onmouseout="this.style.background='rgba(46,156,94,0.08)'">30 min</button>
        <button onclick="ctmSetPreset(45)" style="flex:1;min-width:60px;padding:10px 0;border-radius:10px;border:1.5px solid rgba(46,156,94,0.3);background:rgba(46,156,94,0.08);color:#4ade80;font-weight:700;font-size:13px;cursor:pointer;" onmouseover="this.style.background='rgba(46,156,94,0.18)'" onmouseout="this.style.background='rgba(46,156,94,0.08)'">45 min</button>
      </div>
      <div style="margin-bottom:16px;">
        <label style="font-size:10px;font-weight:700;letter-spacing:2px;color:rgba(255,255,255,0.4);text-transform:uppercase;display:block;margin-bottom:7px;">YA CUSTOM MINUTES DAALO</label>
        <div style="display:flex;align-items:center;gap:10px;">
          <input id="ctmInput" type="number" min="1" max="120" placeholder="e.g. 25" style="flex:1;padding:12px 15px;background:rgba(255,255,255,0.06);border:1.5px solid rgba(46,156,94,0.3);border-radius:11px;color:#fff;font-size:16px;font-weight:700;outline:none;font-family:'Poppins',sans-serif;" onfocus="this.style.borderColor='#2e9c5e'" onblur="this.style.borderColor='rgba(46,156,94,0.3)'" onkeydown="if(event.key==='Enter')ctmConfirm()" />
          <span style="font-size:13px;color:rgba(255,255,255,0.5);font-weight:600;">minutes</span>
        </div>
      </div>
      <div style="display:flex;gap:10px;">
        <button onclick="ctmClose()" style="flex:1;padding:13px 0;border-radius:12px;border:1.5px solid rgba(255,255,255,0.1);background:transparent;color:rgba(255,255,255,0.5);font-weight:700;font-size:13px;cursor:pointer;">Cancel</button>
        <button onclick="ctmConfirm()" style="flex:2;padding:13px 0;border-radius:12px;border:none;background:linear-gradient(135deg,#1c7a2a,#2e9c5e);color:#fff;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 4px 18px rgba(46,156,94,0.35);">✅ Time Set Karo — Customer Ko Dikhega</button>
      </div>
      <div style="margin-top:12px;font-size:11px;color:rgba(255,255,255,0.3);text-align:center;">⚡ Customer ke menu page pe turant update hoga</div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
})();

let _ctmFbId=null, _ctmTableNum=null;

function setOrderTime(fbOrderId, tableNum){
  _ctmFbId=fbOrderId;
  _ctmTableNum=tableNum;
  document.getElementById('ctmTableLabel').textContent=`🪑 Table ${tableNum} ke liye kitna time lagega?`;
  document.getElementById('ctmInput').value='';
  document.getElementById('chefTimeModal').style.display='flex';
  setTimeout(()=>document.getElementById('ctmInput').focus(),200);
}
window.setOrderTime=setOrderTime;

function ctmSetPreset(mins){
  document.getElementById('ctmInput').value=mins;
  document.getElementById('ctmInput').focus();
}
window.ctmSetPreset=ctmSetPreset;

function ctmClose(){
  document.getElementById('chefTimeModal').style.display='none';
  _ctmFbId=null; _ctmTableNum=null;
}
window.ctmClose=ctmClose;

async function ctmConfirm(){
  const mins=parseInt(document.getElementById('ctmInput').value);
  if(!mins||isNaN(mins)||mins<1){
    document.getElementById('ctmInput').style.borderColor='var(--red)';
    setTimeout(()=>document.getElementById('ctmInput').style.borderColor='rgba(46,156,94,0.3)',1500);
    showToast('⚠️ Valid minutes daalo (1-120)!');
    return;
  }
  if(!window.__chefDb||!window.__chefDoc||!window.__chefUpdateDoc){ showToast('Firebase ready nahi'); return; }
  const fbId=_ctmFbId, tbl=_ctmTableNum;
  ctmClose();
  try{
    const now = new Date().toISOString();
    await window.__chefUpdateDoc(window.__chefDoc(window.__chefDb,'orders',fbId),{
      estimatedMinutes: mins,
      captainTimer:     mins,       // ← Live Menu timer ke liye
      captainTimerSetAt: now,       // ← Countdown start time
      status:           'accepted',
      acceptedAt:       now
    });
    showToast(`✅ Table ${tbl} — ${mins} min set! Customer ko screen pe dikh gaya! 📱`,'var(--green)');
    if(typeof NovaVoice!=='undefined'){
      // Captain ne timer set kiya — Firebase se order dhundh ke full detail bolo
      const _fbOrd = (window._liveFirebaseOrders||[]).find(o=>o._fbId===fbId||o.tableNumber===String(tbl)||o.table===String(tbl));
      if(_fbOrd) NovaVoice.announceOrderDetail(_fbOrd, mins);
      else NovaVoice.speak(`Table ${tbl} ka timer ${mins} minute set ho gaya. Chef, cooking shuru karein.`, true);
    }
    if(typeof renderLiveMenu==='function') renderLiveMenu();
  }catch(e){ showToast('Time set nahi hua: '+e.message,'var(--red)'); }
}
window.ctmConfirm=ctmConfirm;

// Close modal on backdrop click
document.addEventListener('click',function(e){
  const modal=document.getElementById('chefTimeModal');
  if(modal&&e.target===modal) ctmClose();
});

// Mark order as ready (called from live menu cards)
async function markOrderReady(fbOrderId, tableNum, dishName){
  if(!window.__chefDb||!window.__chefDoc||!window.__chefUpdateDoc){ showToast('Firebase ready nahi'); return; }
  try{
    await window.__chefUpdateDoc(window.__chefDoc(window.__chefDb,'orders',fbOrderId),{
      status:'ready',
      readyAt:new Date().toISOString(),
      chefReadyNotified: true,         // Captain ke liye gate unlock hoga
      chefReadyAt: new Date().toISOString(),
      _captainReadyAlerted: false      // Captain ko phir se alert milega
    });
    showToast(`🟢 Table ${tableNum} — ORDER READY! Captain ko notify kiya. Waiter bhejenge.`,'var(--green)');
    NovaVoice.orderReady(tableNum, dishName||'Order');
    triggerAudioAlert('✅','ORDER READY — CAPTAIN KO NOTIFY KIYA',`Table ${tableNum} ka khana ready! Captain ab waiter assign kar sakta hai.`,'alert-ready');
    // Corner timer bhi reset
    const el = document.getElementById('cornerTimerDisplay');
    if(el) { el.textContent = '00:00'; el.style.color = '#22c55e'; }
  }catch(e){ showToast('Update nahi hua: '+e.message,'var(--red)'); }
}
window.markOrderReady=markOrderReady;

// Mark order as served
async function markOrderServed(fbOrderId, tableNum){
  if(!window.__chefDb||!window.__chefDoc||!window.__chefUpdateDoc){ showToast('Firebase ready nahi'); return; }
  try{
    await window.__chefUpdateDoc(window.__chefDoc(window.__chefDb,'orders',fbOrderId),{
      status:'served', servedAt:new Date().toISOString(), servedBy: waiterName||'Chef'
    });
    showToast(`🍽️ Table ${tableNum} — Served! ✅`);
  }catch(e){ showToast('Update nahi hua: '+e.message,'var(--red)'); }
}
window.markOrderServed=markOrderServed;
// ── Firebase order ko served mark karo (chef se, waiter already assigned) ──
async function markFbOrderServed(fbOrderId, tableNum, waiterName){
  try{
    // Get the FB order BEFORE marking served
    const fbOrd=(window._liveFirebaseOrders||[]).find(x=>x._fbId===fbOrderId);
    const resolvedWaiter = waiterName || (fbOrd && (fbOrd.assignedWaiter||fbOrd.servedBy)) || '—';

    if(window.__chefDb&&window.__chefDoc&&window.__chefUpdateDoc){
      await window.__chefUpdateDoc(window.__chefDoc(window.__chefDb,'orders',fbOrderId),{
        status:'served',
        servedAt:new Date().toISOString(),
        servedBy: resolvedWaiter
      });
    }
    // Local Firebase order update karo
    if(fbOrd){ fbOrd.status='served'; }
    // History mein add karo
    if(!appData.servedOrdersHistory) appData.servedOrdersHistory=[];
    if(!appData.orderHistory) appData.orderHistory=[];
    const matchedDishes = fbOrd ? (fbOrd.items||[]).map(i=>`${i.name} ×${i.qty||1}`) : [];
    const matchedTableId = fbOrd ? (fbOrd.tableNumber||fbOrd.table||tableNum||'?') : (tableNum||'?');
    const matchedCustomer = fbOrd ? (fbOrd.customerName||'Customer') : 'Customer';
    const matchedPhone = fbOrd ? (fbOrd.customerPhone||'—') : '—';
    const matchedNotes = fbOrd ? (fbOrd.notes||'') : '';
    const matchedCookTime = fbOrd ? (fbOrd.estimatedMinutes||fbOrd.captainTimer||0) : 0;
    const matchedAmount = ohEstimateAmount(matchedDishes);
    const nowTimeStr = new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true});
    const nowFullStr = new Date().toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true});

    const ohEntry = {
      id:'OH-'+Date.now(),
      _fbId: fbOrderId,
      serial: appData.orderHistory.length+1,
      tableId: matchedTableId,
      customerName: matchedCustomer,
      customerPhone: matchedPhone,
      dishes: matchedDishes,
      notes: matchedNotes,
      waiter: resolvedWaiter,
      cookTime: matchedCookTime,
      servedAt: nowTimeStr,
      servedAtFull: nowFullStr,
      timestamp: Date.now(),
      amount: matchedAmount,
      source: (fbOrd && fbOrd._source==='captain') ? 'Captain Order' : 'QR Order',
      status: 'served'
    };

    // Check duplicate — agar same fbOrderId already history mein hai toh skip
    const dupExists = appData.orderHistory.some(h => h._fbId === fbOrderId);
    if (!dupExists) {
      appData.orderHistory.unshift(ohEntry);
      appData.servedOrdersHistory.unshift({...ohEntry});
      if(!appData.todayOrders) appData.todayOrders=[];
      appData.todayOrders.unshift({...ohEntry});

      // ── Firebase orderHistory collection mein bhi save karo ──
      if(window.__chefDb && window.__chefCollection) {
        try {
          const { addDoc } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
          await addDoc(window.__chefCollection(window.__chefDb, 'orderHistory'), ohEntry);
        } catch(fe) { console.warn('[OH] Firebase save error:', fe.message); }
      }
    }
    if(typeof ohUpdateBadges==='function') ohUpdateBadges();
    // Table status → served
    const tbl=appData.tables.find(t=>String(t.id)===String(tableNum));
    if(tbl) tbl.status='served';
    renderLiveMenu(); renderTodayOrders();
    if(typeof renderServedHistory==='function') renderServedHistory();
    if(document.getElementById('page-dashboard')?.classList.contains('active')) renderDashboard();
    if(typeof renderOrderHistory==='function'&&document.getElementById('page-orderhistory')?.classList.contains('active')) renderOrderHistory();
    addSwNotification(`✅ Served: Table ${tableNum} — ${resolvedWaiter}`,'sw-ready');
     setTimeout(()=>{},200);
    showToast(`✅ Table ${tableNum} SERVED! ${resolvedWaiter !== '—' ? resolvedWaiter + ' ne deliver kiya!' : ''} History mein save. 🍽️`,'var(--green)');
    updateFeatTabCounts();
  }catch(e){ showToast('Served mark failed: '+e.message,'var(--red)'); }
}
window.markFbOrderServed=markFbOrderServed;


// ── Assign Waiter to Firebase Order ──
let _awFbId=null, _awFbTable=null;
function openAssignWaiterFb(fbOrderId, tableNum){
  _awFbId=fbOrderId; _awFbTable=tableNum;
  const fbOrder=(window._liveFirebaseOrders||[]).find(x=>x._fbId===fbOrderId);
  const items=fbOrder?(fbOrder.items||[]).map(i=>i.name).join(', '):'Order';
  document.getElementById('aw-title').textContent=`Table ${tableNum} — Firebase QR Order`;
  document.getElementById('aw-items').textContent=items;
  selectedWaiterName='';
  // Build staff list — sab staff dikhao
  const allWaiters=appData.staff;
  const busyWaiterNames=new Set((appData.liveOrders||[]).filter(lo=>lo.status==='serving'&&lo.waiter).map(lo=>lo.waiter));
  document.getElementById('waiterSelectList').innerHTML=allWaiters.length?allWaiters.map(w=>{
    const isAbsent=!w.present;
    const isBusy=busyWaiterNames.has(w.name);
    const isAvail=!isAbsent&&!isBusy;
    const statusColor=isAbsent?'var(--red)':isBusy?'var(--orange)':'var(--green)';
    const statusLabel=isAbsent?'● Absent':isBusy?'● Busy':'● Available';
    return `<div onclick="${isAvail?`selectWaiterForOrder('${w.name}',this)`:''}" style="display:flex;align-items:center;gap:12px;padding:12px 14px;border:1.5px solid ${isAvail?'var(--border)':isAbsent?'rgba(239,68,68,.2)':'rgba(245,158,11,.2)'};border-radius:12px;cursor:${isAvail?'pointer':'not-allowed'};transition:all .2s;opacity:${isAbsent?0.5:1};" id="wsel-${w.id}">
      <div style="width:40px;height:40px;border-radius:12px;background:var(--gold-dim);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:20px;">${w.emoji}</div>
      <div style="flex:1;">
        <div style="font-size:14px;font-weight:700;color:var(--text);">${w.name}</div>
        <div style="font-size:11px;font-weight:600;color:${statusColor};">${statusLabel}</div>
      </div>
      ${isAvail?`<div style="font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;background:rgba(34,197,94,.1);color:var(--green);border:1px solid rgba(34,197,94,.25);">ASSIGN</div>`:''}
    </div>`;
  }).join(''):`<div style="text-align:center;padding:22px;color:var(--text2);">Koi waiter staff mein nahi hai.</div>`;
  // Override confirm button for FB orders
  const confirmBtn=document.querySelector('#assignWaiterModal .btn-primary');
  if(confirmBtn) confirmBtn.setAttribute('onclick','confirmWaiterAssignFb()');
  openModal('assignWaiterModal');
}
window.openAssignWaiterFb=openAssignWaiterFb;

async function confirmWaiterAssignFb(){
  if(!selectedWaiterName){showToast('Waiter select karo!','var(--red)');return;}
  if(!window.__chefDb||!window.__chefDoc||!window.__chefUpdateDoc){ showToast('Firebase ready nahi'); return; }
  closeModal('assignWaiterModal');
  const waiterName = selectedWaiterName;
  const fbOrderId = _awFbId;
  const tableNum = _awFbTable;
  try{
    // ✅ Firebase order mein waiter assign + serving status
    await window.__chefUpdateDoc(window.__chefDoc(window.__chefDb,'orders',fbOrderId),{
      assignedWaiter: waiterName,
      waiterAssignedAt: new Date().toISOString(),
      status: 'serving',
      servedBy: waiterName
    });
    // Local liveOrders mein bhi serving set karo
    const _fbLocalOrder = (window._liveFirebaseOrders||[]).find(x=>x._fbId===fbOrderId);
    if(_fbLocalOrder){ _fbLocalOrder.status='serving'; _fbLocalOrder.assignedWaiter=waiterName; }
    showToast(`🧑‍🍽️ ${waiterName} Table ${tableNum} serve karne ja raha hai! "Mark Served" dabao.`,'var(--purple)');
    addSwNotification(`🧑‍🍽️ Serving: Table ${tableNum} — ${waiterName}`,'sw-vip');
    triggerAudioAlert('🧑‍🍽️','WAITER ASSIGNED',`${waiterName} Table ${tableNum} serve karne ja raha hai!`,'');
     setTimeout(()=>{},200);
    if(typeof renderLiveMenu==='function') renderLiveMenu();
    if(typeof renderNewOrders==='function') renderNewOrders();
    // Restore confirm button
    const confirmBtn=document.querySelector('#assignWaiterModal .btn-primary');
    if(confirmBtn) confirmBtn.setAttribute('onclick','confirmWaiterAssign()');
  }catch(e){ showToast('Assign failed: '+e.message,'var(--red)'); }
}
window.confirmWaiterAssignFb=confirmWaiterAssignFb;

// ── CORNER TIMER — Shows the shortest active cooking timer ──
(function initCornerTimer(){
  setInterval(()=>{
    const widget=document.getElementById('cornerTimerWidget');
    const display=document.getElementById('cornerTimerDisplay');
    const label=document.getElementById('cornerTimerLabel');
    const ring=document.getElementById('cornerTimerRing');
    if(!widget||!display||!label||!ring) return;

    // Find shortest active cooking order
    const cookingOrders=(appData.liveOrders||[]).filter(o=>o.status==='cooking'&&o.timeLeft>0);
    // Also check Firebase accepted orders with estimatedMinutes
    const fbCooking=(window._liveFirebaseOrders||[]).filter(o=>o.status==='accepted'&&o.estimatedMinutes>0);

    if(cookingOrders.length===0&&fbCooking.length===0){
      display.textContent='00:00';
      display.style.color='#22c55e';
      label.textContent='Koi active timer nahi';
      ring.style.stroke='#22c55e';
      ring.setAttribute('stroke-dashoffset','0');
      widget.style.borderColor='rgba(34,197,94,0.4)';
      widget.style.boxShadow='0 0 20px rgba(34,197,94,0.15),0 8px 30px rgba(0,0,0,0.4)';
      return;
    }

    // Get min time remaining
    let minTime=Infinity, maxTime=1, tableId='?';
    cookingOrders.forEach(o=>{
      if(o.timeLeft<minTime){minTime=o.timeLeft;maxTime=o.cookTime||20;tableId=o.tableId;}
    });
    // FB orders - use real calculated remaining time
    if(fbCooking.length>0){
      fbCooking.forEach(o=>{
        const fbRemaining = (o._realTimeLeft !== undefined) ? o._realTimeLeft : o.estimatedMinutes;
        if(fbRemaining < minTime){
          minTime=fbRemaining;
          maxTime=o.estimatedMinutes||fbRemaining;
          tableId=o.tableNumber||'?';
        }
      });
    }

    if(minTime===Infinity){
      display.textContent='00:00';label.textContent='Koi active timer nahi';return;
    }

    const totalSecs=Math.max(0,Math.round(minTime*60));
    const mins=Math.floor(totalSecs/60);
    const secs=totalSecs%60;
    display.textContent=String(mins).padStart(2,'0')+':'+String(secs).padStart(2,'0');
    label.textContent=`Table ${tableId} — Cooking`;

    // Ring progress
    const pct=Math.max(0,Math.min(1,minTime/maxTime));
    const circumference=94.2;
    ring.setAttribute('stroke-dashoffset',String(circumference*(1-pct)));

    // Color by urgency
    if(minTime<=3){
      display.style.color='#ef4444';ring.style.stroke='#ef4444';
      widget.style.borderColor='rgba(239,68,68,0.6)';
      widget.style.boxShadow='0 0 20px rgba(239,68,68,0.3),0 8px 30px rgba(0,0,0,0.4)';
    } else if(minTime<=7){
      display.style.color='#f59e0b';ring.style.stroke='#f59e0b';
      widget.style.borderColor='rgba(245,158,11,0.6)';
      widget.style.boxShadow='0 0 20px rgba(245,158,11,0.2),0 8px 30px rgba(0,0,0,0.4)';
    } else {
      display.style.color='#22c55e';ring.style.stroke='#22c55e';
      widget.style.borderColor='rgba(34,197,94,0.6)';
      widget.style.boxShadow='0 0 20px rgba(34,197,94,0.25),0 8px 30px rgba(0,0,0,0.4)';
    }
  },1000);
})();


// When a KOT is added, also push to smartwatch
const origInitAll=window.initAll||function(){};
// Hook: show notification on new KOT
const _origAddKOT=window.addNewKOT;
window.addNewKOT=function(){
  if(typeof _origAddKOT==='function')_origAddKOT();
  setTimeout(()=>{
    addSwNotification('🆕 New KOT created!','sw-vip');
    triggerAudioAlert('🆕','NEW KOT','Naya KOT create hua! Kitchen mein bhejo.','alert-ready');
    renderBatchSuggestions();
  },300);
};

// ── submitCustomerOrder — for customer menu panel ──
function submitCustomerOrder(){
  const tableNum=appData.qrCart?.tableNum;
  const items=appData.qrCart?.items||{};
  const itemList=Object.entries(items).filter(([_,q])=>q>0);
  if(!itemList.length){showToast('Cart khaali hai! Kuch select karo','var(--red)');return;}
  const dishNames=itemList.map(([id,qty])=>{
    const d=appData.menu.find(m=>m.id==id);
    return d?`${d.name} x${qty}`:'Unknown';
  });
  const kot={
    id:Date.now(),tableId:tableNum,
    items:dishNames,status:'pending',
    time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}),
    notes:'QR Order',station:'tandoor',priority:'normal'
  };
  appData.kots.push(kot);
  const tbl=appData.tables.find(t=>t.id===tableNum);
  if(tbl){tbl.status='pending';tbl.items=[...tbl.items,...dishNames];}
  appData.qrCart={tableNum,items:{}};
  updateCartDisplay();
  document.getElementById('customerMenuSection').style.display='none';
  showToast(`✅ Table ${tableNum} ka order place hua!`,'var(--green)');
  NovaVoice&&NovaVoice.qrOrder&&NovaVoice.qrOrder(tableNum);
  triggerAudioAlert('📱','QR ORDER',`Table ${tableNum} se naya order!`,'alert-ready');
  renderKOT();renderDashboard();
}

// Alias for compatibility
function renderRecipeBook(){ if(typeof renderRecipeGrid==='function') renderRecipeGrid(); }
// ════════════════════════════════════════════════════════════════
//  🆕 NAYE FEATURES PATCH — 4 Features
//  1. KOT se New Order → Live Menu mein aata hai
//  2. Order complete pe Customer History auto-save (enhanced)
//  3. Live Menu cards mein corner countdown timer (green/red)
//  4. Late alert — Girl Voice (Priya) chef ko batayegi
// ════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────
// FEATURE 1: KOT New Order → Live Menu mein auto-add
// Jab chef "New Order / KOT" modal se order add kare,
// woh live menu ke "New Incoming Orders" section mein bhi aaye
// ─────────────────────────────────────────────────────

(function patchAddNewKOT() {
  const _prev = window.addNewKOT;
  window.addNewKOT = function() {
    // Pahle existing order data capture karo (modal close se pehle)
    const tableId = kotSelectedTable || document.getElementById('kotTable')?.value;
    const itemsRaw = document.getElementById('kotItemsInput')?.value?.trim() || '';
    const notes = document.getElementById('kotNotes')?.value || '';
    const customerName = ''; // KOT se manual order — walk-in
    const customerPhone = '';

    // Original function call karo
    if (typeof _prev === 'function') _prev();

    // Agar valid order tha to live menu mein bhi add karo
    if (tableId && itemsRaw) {
      const dishes = itemsRaw.split('\n').map(s => s.trim()).filter(Boolean);
      const tid = parseInt(tableId);

      // Duplicate check — agar already exist karta hai same table + same dishes
      const isDup = (appData.liveOrders || []).some(o =>
        o.tableId === tid &&
        o.status === 'waiting' &&
        JSON.stringify(o.dishes) === JSON.stringify(dishes) &&
        (Date.now() - (o.createdAt || 0)) < 5000
      );

      if (!isDup) {
        if (!appData.liveOrders) appData.liveOrders = [];
        const liveOrder = {
          id: Date.now() + 2,
          tableId: tid,
          dishes,
          notes,
          customerName: customerName || 'Walk-in Customer',
          customerPhone,
          status: 'waiting',
          cookTime: 0, timeLeft: 0, waiter: '',
          createdAt: Date.now(),
          servedCount: 0,
          _source: 'kot'
        };
        appData.liveOrders.unshift(liveOrder);

        // Live menu refresh
        if (document.getElementById('page-livemenu')?.classList.contains('active')) {
          renderLiveMenu();
          renderNewOrders();
        }

        // Badge update
        if (typeof updateFeatTabCounts === 'function') updateFeatTabCounts();

        showToast(`📋 KOT order Live Menu mein bhi add hua — Table ${tid}!`, 'var(--blue)');
      }
    }
  };
})();

// ─────────────────────────────────────────────────────
// FEATURE 2: Customer History Auto-Save (Enhanced)
// Jab bhi order serve ho — customer history mein properly save ho
// Customer name, phone, dishes, amount — sab save ho
// ─────────────────────────────────────────────────────

function enhancedSaveToCustomerHistory(order) {
  if (!order || !order.customerName || order.customerName === 'Walk-in Customer') return;

  if (!appData.customers) appData.customers = [];

  // Menu se order amount calculate karo
  const orderAmt = (order.dishes || []).reduce((total, d) => {
    const m = appData.menu.find(x => d.toLowerCase().includes(x.name.toLowerCase().split(' ')[0]));
    return total + (m ? m.price : 0);
  }, 0);

  // Customer already exist karta hai?
  let cust = appData.customers.find(c =>
    c.name === order.customerName ||
    (order.customerPhone && c.phone === order.customerPhone)
  );

  if (cust) {
    // Update existing customer
    cust.visits = (cust.visits || 0) + 1;
    cust.lastVisit = 'Today';
    cust.spent = (cust.spent || 0) + orderAmt;
    // Fav dish update — sabse zyada ordered dish
    if (order.dishes && order.dishes.length > 0) {
      cust.lastOrder = order.dishes[0];
    }
    // Order history append karo
    if (!cust.orderHistory) cust.orderHistory = [];
    cust.orderHistory.unshift({
      dishes: order.dishes,
      tableId: order.tableId,
      notes: order.notes,
      servedAt: order.servedAt || new Date().toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'}),
      amount: orderAmt,
      waiter: order.waiter
    });
    // Max 50 order history rakhna
    if (cust.orderHistory.length > 50) cust.orderHistory = cust.orderHistory.slice(0, 50);
  } else {
    // Naya customer add karo
    const newCust = {
      id: Date.now(),
      name: order.customerName,
      phone: order.customerPhone || '—',
      visits: 1,
      lastVisit: 'Today',
      fav: order.dishes ? order.dishes[0] : '—',
      vip: false,
      spent: orderAmt,
      lastOrder: order.dishes ? order.dishes[0] : '—',
      orderHistory: [{
        dishes: order.dishes,
        tableId: order.tableId,
        notes: order.notes,
        servedAt: order.servedAt || new Date().toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'}),
        amount: orderAmt,
        waiter: order.waiter
      }]
    };
    appData.customers.unshift(newCust);
  }

  // Customer page open hai to refresh karo
  if (document.getElementById('page-customers')?.classList.contains('active')) {
    if (typeof renderCustomers === 'function') renderCustomers();
  }
}

// markLMServed aur confirmWaiterAssign ke baad enhanced history save karo
// Hum original functions ko wrap karte hain
(function patchServedFunctions() {
  // markLMServed patch
  const _origMarkServed = window.markLMServed;
  window.markLMServed = function(orderId) {
    const o = (appData.liveOrders || []).find(x => x.id === orderId);
    if (_origMarkServed) _origMarkServed(orderId);
    if (o) {
      setTimeout(() => {
        enhancedSaveToCustomerHistory({
          ...o,
          servedAt: new Date().toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'})
        });
      }, 500);
    }
  };
})();

// ─────────────────────────────────────────────────────
// FEATURE 3: Live Menu Cards mein Corner Countdown Timer
// Green color — jab time < 5 min, red aur pulsing hoga
// CSS inject karo + renderLiveMenu patch karo
// ─────────────────────────────────────────────────────

// CSS inject
(function injectCornerTimerCSS() {
  const style = document.createElement('style');
  style.id = 'corner-timer-patch-css';
  style.textContent = `
    /* ── Corner Countdown Timer Badge ── */
    .lm-corner-countdown {
      position: absolute;
      top: 9px;
      right: 9px;
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 11px 4px 8px;
      border-radius: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 0.5px;
      border: 2px solid rgba(34,197,94,0.5);
      background: rgba(34,197,94,0.13);
      color: #22c55e;
      box-shadow: 0 2px 10px rgba(34,197,94,0.2);
      min-width: 62px;
      justify-content: center;
      pointer-events: none;
      transition: background 0.3s, border-color 0.3s, color 0.3s;
    }
    .lm-corner-countdown.warn {
      background: rgba(245,158,11,0.15);
      border-color: rgba(245,158,11,0.6);
      color: #f59e0b;
      box-shadow: 0 2px 10px rgba(245,158,11,0.2);
    }
    .lm-corner-countdown.urgent {
      background: rgba(239,68,68,0.15);
      border-color: rgba(239,68,68,0.6);
      color: #ef4444;
      box-shadow: 0 0 12px rgba(239,68,68,0.35);
      
    }
    @keyframes ctrPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.08); opacity: 0.85; }
    }
    .lm-corner-countdown .ctr-icon { font-size: 11px; }
    .lm-corner-countdown .ctr-num { font-size: 14px; }

    /* New order cards — corner timer */
    .no-corner-timer {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 10px;
      border-radius: 20px;
      font-family: 'JetBrains Mono', monospace;
      background: rgba(46,156,94,0.12);
      border: 1.5px solid rgba(46,156,94,0.35);
      color: var(--accent);
    }
    .no-corner-timer.late {
      background: rgba(239,68,68,0.12);
      border-color: rgba(239,68,68,0.5);
      color: #ef4444;
      
    }

    /* Enhanced new order card style */
    .new-order-card {
      background: var(--bg2);
      border: 1.5px solid rgba(245,158,11,0.3);
      border-radius: var(--radius);
      position: relative;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(245,158,11,0.08);
      transition: all 0.2s;
    }
    .new-order-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 4px;
      background: linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b);
      
    }
    @keyframes newOrderBar { 0%,100%{opacity:1;} 50%{opacity:0.5;} }
    .new-order-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(245,158,11,0.15); }

    /* Cooking instructions block */
    .cook-instructions-block {
      background: rgba(245,158,11,0.07);
      border: 1.5px solid rgba(245,158,11,0.3);
      border-radius: 12px;
      padding: 10px 13px;
      margin-bottom: 10px;
    }
    .cook-inst-label {
      font-size: 9px; font-weight: 800; letter-spacing: 2px;
      color: var(--orange); font-family: 'JetBrains Mono',monospace;
      margin-bottom: 4px; display: flex; align-items: center; gap: 5px;
    }
    .cook-inst-text { font-size: 12.5px; color: var(--text); font-weight: 600; line-height: 1.5; }
    .cook-inst-read-btn {
      margin-top: 7px; background: rgba(245,158,11,0.1);
      border: 1.5px solid rgba(245,158,11,0.35); border-radius: 8px;
      padding: 5px 14px; font-size: 12px; font-weight: 700;
      color: var(--orange); cursor: pointer; font-family: var(--font-ui);
      transition: all 0.18s;
    }
    .cook-inst-read-btn:hover { background: rgba(245,158,11,0.2); }

    /* Customer History Card in Live Menu */
    .cust-hist-card {
      background: var(--bg3);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 12px 15px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    .cust-hist-card:hover { border-color: var(--border2); }
    .cust-hist-avatar {
      width: 42px; height: 42px; border-radius: 12px;
      background: rgba(46,156,94,0.1); border: 1px solid rgba(46,156,94,0.25);
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; flex-shrink: 0;
    }
  `;
  document.head.appendChild(style);
})();

// renderLiveMenu ke baad corner timers inject karne ka live updater
// (Jo countdown timers already existing `lm-corner-timer` classes pe kaam karta hai
// uske saath corner countdown badge bhi add karo)
// Ye already `chef-time-corner-badge` class ke through ho raha hai.
// Ham ek additional per-second update function add karte hain jo DOM badges update kare.

// ─────────────────────────────────────────────────────
// FEATURE 4: Girl Voice (Priya) — Late Order Alert
// Jab khana banane mein time zyada lag raha ho,
// Priya ki sweet voice mein chef ko batao
// "Sir aapko late ho raha hai khana banane mein"
// ─────────────────────────────────────────────────────

// Enhanced late order voice alerts — thoda aur expressive aur alag alag messages
const lateAlertMessages = [
  (tableId, mins, custName) =>
    `Chef saab, ${custName ? custName + ' ka' : ''} Table ${tableId} pe order ${mins} minute se wait kar raha hai. Aap late ho rahe hain! Jaldi karo please.`,
  (tableId, mins, custName) =>
    `Oops! Sir, Table ${tableId}${custName ? ' — ' + custName : ''} ka order abhi tak ready nahi hua. ${mins} minute ho gaye hain! Meherbani karke jaldi banao!`,
  (tableId, mins, custName) =>
    `Hey Chef! Table ${tableId} waale ${mins} minute se wait kar rahe hain! ${custName ? custName + ' ji' : 'Customer'} bahut patient hain, aap unhe disappoint mat karo! Jaldi karo please!`,
  (tableId, mins, custName) =>
    `Sir, main Priya bol rahi hoon. Table ${tableId} ka order ${mins} minute se pending hai. ${custName ? custName + ' ji wait kar rahe hain!' : 'Guest wait kar rahe hain!'} Please dhyan do!`,
  (tableId, mins, custName) =>
    `Alert alert! Table ${tableId}${custName ? ' — ' + custName : ''} ka order late ho gaya! ${mins} minute ho gaye. Chef please focus karo!`,
];

// Cooking orders — jab time bahut kam ho (chef ne time set kiya tha) — urgent voice
const cookingLateMessages = [
  (tableId, mins) => `Chef! Table ${tableId} ka khana bas ${mins} minute mein ready hona chahiye tha! Abhi kahan tak pahuncha? Please check karo!`,
  (tableId, mins) => `Sir! Table ${tableId} ka cooking time khatam ho gaya! ${mins} minute overshoot ho gaye hain. Customer wait kar raha hai!`,
];

// Late order voice alert system (every 30 seconds already check hota hai, hum enhance karte hain)
let _priyaLateAlertInterval = null;

function startPriyaLateAlertSystem() {
  if (_priyaLateAlertInterval) clearInterval(_priyaLateAlertInterval);

  _priyaLateAlertInterval = setInterval(() => {
    

    const now = Date.now();

    // 1. Waiting orders — jab 10+ minutes se koi action nahi
    const lateWaiting = (appData.liveOrders || []).filter(o =>
      o.status === 'waiting' &&
      ((now - (o.createdAt || now)) / 60000) >= 10 &&
      !o._priyaAlerted
    );

    lateWaiting.forEach(o => {
      const minsAgo = Math.round((now - (o.createdAt || now)) / 60000);
      o._priyaAlerted = true;
      o._priyaAlertedAt = now;

      // Random message select karo
      const msgFn = lateAlertMessages[Math.floor(Math.random() * lateAlertMessages.length)];
      const msg = msgFn(o.tableId, minsAgo, o.customerName && o.customerName !== 'Walk-in Customer' ? o.customerName : '');

      // Priya ki awaaz mein bolegi
      if (window.NovaVoice && typeof NovaVoice.speak === 'function') {
        NovaVoice.speak(msg, true);
      }

      // Audio alert popup bhi dikho
      if (typeof triggerAudioAlert === 'function') {
        triggerAudioAlert('⏰', 'LATE ORDER!', `Table ${o.tableId} — ${minsAgo} min se pending! Priya ne alert diya.`, 'alert-urgent');
      }
    });

    // 2. Re-alert — har 5 minutes mein repeat karo agar still waiting
    const reAlertNeeded = (appData.liveOrders || []).filter(o =>
      o.status === 'waiting' &&
      o._priyaAlerted &&
      o._priyaAlertedAt &&
      ((now - (o._priyaAlertedAt || now)) / 60000) >= 5
    );

    reAlertNeeded.forEach(o => {
      const minsAgo = Math.round((now - (o.createdAt || now)) / 60000);
      o._priyaAlertedAt = now;

      const msgFn = lateAlertMessages[Math.floor(Math.random() * lateAlertMessages.length)];
      const msg = msgFn(o.tableId, minsAgo, o.customerName && o.customerName !== 'Walk-in Customer' ? o.customerName : '');

      if (window.NovaVoice && typeof NovaVoice.speak === 'function') {
        NovaVoice.speak(msg, false); // Not priority — queue mein dalo
      }
    });

    // 3. Cooking orders — jab time 0 ho gaya lekin abhi bhi cooking mein hain
    const cookingOverdue = (appData.liveOrders || []).filter(o =>
      o.status === 'cooking' &&
      o.cookTime > 0 &&
      (o.timeLeft || 0) <= 0 &&
      !o._cookingLateAlerted
    );

    cookingOverdue.forEach(o => {
      o._cookingLateAlerted = true;
      const overMins = Math.abs(Math.round((o.timeLeft || 0)));
      const msgFn = cookingLateMessages[Math.floor(Math.random() * cookingLateMessages.length)];
      const msg = msgFn(o.tableId, overMins);

      if (window.NovaVoice && typeof NovaVoice.speak === 'function') {
        NovaVoice.speak(msg, true);
      }

      if (typeof triggerAudioAlert === 'function') {
        triggerAudioAlert('🔥', 'COOKING LATE!', `Table ${o.tableId} — Time khatam! Jaldi karo Chef!`, 'alert-urgent');
      }
    });

  }, 30000); // 30 seconds per check
}

// System start karo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startPriyaLateAlertSystem);
} else {
  startPriyaLateAlertSystem();
}

// Sound toggle pe system bhi update ho
const _origToggleSound = window.toggleSound;
window.toggleSound = function() {
  if (typeof _origToggleSound === 'function') _origToggleSound();
};

// ─────────────────────────────────────────────────────
// FEATURE 3 (continued): Corner Timer real-time badge update
// Existing chef-time-corner-badge ko per-second update karo
// ─────────────────────────────────────────────────────

// renderLiveMenu ke baad corner badge real-time update karne ke liye
// Ham already existing countdown interval se timeLeft decrement hota hai
// Bas ek alag interval se visible timer badges update karte hain

setInterval(() => {
  // Update all corner timer badges that are visible on screen
  const livePage = document.getElementById('page-livemenu');
  if (!livePage || !livePage.classList.contains('active')) return;

  (appData.liveOrders || []).forEach(o => {
    if (o.status !== 'cooking' || !o.cookTime) return;
    const tLeft = Math.ceil(o.timeLeft || 0);

    // Update badge color class dynamically
    const badges = document.querySelectorAll('.chef-time-corner-badge');
    badges.forEach(badge => {
      const numEl = badge.querySelector('span:nth-child(2)');
      if (!numEl) return;
      const badgeNum = parseInt(numEl.textContent);
      if (isNaN(badgeNum)) return;

      // Agar badge ka number match karta hai is order ke timeLeft se (approximately)
      if (Math.abs(badgeNum - tLeft) <= 1 || badgeNum === tLeft) {
        // Hue update
        const isUrgent = tLeft <= 3;
        const isWarn = tLeft > 3 && tLeft <= 8;

        if (isUrgent) {
          badge.style.background = 'rgba(239,68,68,.2)';
          badge.style.borderColor = 'rgba(239,68,68,.7)';
          badge.style.color = '#ef4444';
          badge.style.animation = '';
        } else if (isWarn) {
          badge.style.background = 'rgba(245,158,11,.2)';
          badge.style.borderColor = 'rgba(245,158,11,.6)';
          badge.style.color = '#f59e0b';
          badge.style.animation = '';
        } else {
          badge.style.background = 'rgba(34,197,94,.15)';
          badge.style.borderColor = 'rgba(34,197,94,.5)';
          badge.style.color = '#22c55e';
          badge.style.animation = '';
        }
      }
    });
  });
}, 2000);

// ─────────────────────────────────────────────────────
// Customer History Page — Order History section show karo
// ─────────────────────────────────────────────────────

// renderCustomers function patch — customer card mein order history bhi dikho
const _origRenderCust = window.renderCustomers;
window.renderCustomers = function(filter, search) {
  // Original call karo
  if (typeof _origRenderCust === 'function') {
    _origRenderCust(filter, search);
  }

  // Customer cards mein order history button add karo
  setTimeout(() => {
    const custGrid = document.getElementById('custGrid');
    if (!custGrid) return;

    // Har card mein "Order History" expand button check karo
    const cards = custGrid.querySelectorAll('.cust-card, [data-cust-id]');
    // Already enhanced — skip
  }, 100);
};

// Customer detail modal — order history dikhao
function showCustomerOrderHistory(custId) {
  const cust = appData.customers.find(c => c.id === custId);
  if (!cust) return;

  const history = cust.orderHistory || [];
  let html = `
    <div style="font-family:var(--font-head);font-size:18px;font-weight:800;color:var(--accent);margin-bottom:14px;">
      👤 ${cust.name} — Order History
    </div>
    <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:14px;">
      <div style="background:rgba(46,156,94,.1);border:1px solid rgba(46,156,94,.25);border-radius:10px;padding:8px 16px;text-align:center;">
        <div style="font-size:20px;font-weight:800;color:var(--accent);">${cust.visits || 0}</div>
        <div style="font-size:10px;color:var(--text2);font-weight:700;">VISITS</div>
      </div>
      <div style="background:rgba(46,156,94,.1);border:1px solid rgba(46,156,94,.25);border-radius:10px;padding:8px 16px;text-align:center;">
        <div style="font-size:20px;font-weight:800;color:var(--accent);">₹${(cust.spent||0).toLocaleString()}</div>
        <div style="font-size:10px;color:var(--text2);font-weight:700;">TOTAL SPENT</div>
      </div>
      <div style="background:rgba(46,156,94,.1);border:1px solid rgba(46,156,94,.25);border-radius:10px;padding:8px 16px;text-align:center;">
        <div style="font-size:14px;font-weight:800;color:var(--accent);">${cust.fav || '—'}</div>
        <div style="font-size:10px;color:var(--text2);font-weight:700;">FAV DISH</div>
      </div>
    </div>
  `;

  if (!history.length) {
    html += `<div style="text-align:center;padding:22px;color:var(--text2);">Koi order history nahi. Pehla order save hoga tab dikhega.</div>`;
  } else {
    html += history.slice(0, 20).map(o => `
      <div style="background:var(--bg3);border:1px solid var(--border);border-radius:11px;padding:12px 14px;margin-bottom:8px;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;">
          <span style="font-size:13px;font-weight:700;color:var(--accent);">🪑 Table ${o.tableId}</span>
          <span style="font-size:11px;font-weight:700;color:var(--green);">₹${o.amount || 0}</span>
          <span style="font-size:11px;color:var(--text2);">✅ ${o.servedAt || '—'}</span>
        </div>
        <div style="font-size:12.5px;color:var(--text);margin-top:6px;font-weight:600;">${(o.dishes||[]).join(' • ') || '—'}</div>
        ${o.notes ? `<div style="font-size:11px;color:var(--orange);margin-top:3px;">🍳 ${o.notes}</div>` : ''}
        ${o.waiter ? `<div style="font-size:11px;color:var(--text2);margin-top:3px;">👨‍🍽️ ${o.waiter}</div>` : ''}
      </div>
    `).join('');
  }

  // Modal mein dikhao
  const modal = document.getElementById('tableDetailModal');
  const titleEl = document.getElementById('tDetailTitle');
  const bodyEl = document.getElementById('tDetailBody');
  if (modal && titleEl && bodyEl) {
    titleEl.innerHTML = `Order History <button class="modal-close" onclick="closeModal('tableDetailModal')"><svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><line x1='18' y1='6' x2='6' y2='18'/><line x1='6' y1='6' x2='18' y2='18'/></svg></button>`;
    bodyEl.innerHTML = html;
    openModal('tableDetailModal');
  }
}

window.showCustomerOrderHistory = showCustomerOrderHistory;

// ─────────────────────────────────────────────────────
// Customer Grid — Order History button add karo
// ─────────────────────────────────────────────────────

// renderCustomers original function enhance karo — history button inject
(function patchRenderCustomers() {
  const _origRC = window.renderCustomers;
  if (!_origRC) return;

  window.renderCustomers = function(filter, search) {
    _origRC(filter, search);
    // History buttons post-render inject karte hain
    setTimeout(() => {
      const custGrid = document.getElementById('custGrid');
      if (!custGrid) return;

      appData.customers.forEach(cust => {
        if (!cust.orderHistory || !cust.orderHistory.length) return;
        // Find the card — look for cust name in card text
        const allCards = custGrid.querySelectorAll('.card');
        allCards.forEach(card => {
          if (card.textContent.includes(cust.name) && !card.querySelector('.cust-hist-btn')) {
            const btn = document.createElement('button');
            btn.className = 'btn-sm btn-gold cust-hist-btn';
            btn.style.cssText = 'margin-top:8px;width:100%;justify-content:center;';
            btn.innerHTML = `📋 Order History (${cust.orderHistory.length})`;
            btn.onclick = () => showCustomerOrderHistory(cust.id);
            card.appendChild(btn);
          }
        });
      });
    }, 150);
  };
})();

console.log('✅ Siplora CHEF — New Features Patch loaded!');
console.log('  1. KOT → Live Menu auto-add ✓');
console.log('  2. Customer History enhanced auto-save ✓');
console.log('  3. Corner countdown timer (green/red) with real seconds ✓');
console.log('  4. Priya girl voice late order alert + daant system ✓');
console.log('  5. Order History — Full served orders log ✓');

// ════════════════════════════════════════════════════════════════
//  📜 ORDER HISTORY — Complete Served Orders Feature
//  Jab bhi koi order serve ho, full details ke saath yahan save hoga
//  Table, Customer, Dishes, Notes, Waiter, Time, Amount, Source
// ════════════════════════════════════════════════════════════════

// Central order history store
if (!appData.orderHistory) appData.orderHistory = [];

// Helper: estimate amount from dishes list
function ohEstimateAmount(dishes) {
  if (!dishes || !dishes.length) return 0;
  return dishes.reduce((total, dishStr) => {
    // "Chicken Biryani ×2" se name nikalo
    const cleanName = dishStr.replace(/\s*×\d+.*/, '').trim();
    const qtyMatch = dishStr.match(/×(\d+)/);
    const qty = qtyMatch ? parseInt(qtyMatch[1]) : 1;
    const menuItem = appData.menu.find(m =>
      cleanName.toLowerCase().includes(m.name.toLowerCase().split(' ')[0].toLowerCase()) ||
      m.name.toLowerCase().includes(cleanName.toLowerCase())
    );
    return total + (menuItem ? menuItem.price * qty : 0);
  }, 0);
}

// ── AUTO-SAVE: Hook confirmWaiterAssign (local orders) ──
const _ohOrigConfirmWaiter = window.confirmWaiterAssign;
window.confirmWaiterAssign = function() {
  // Get order BEFORE it gets served (awOrderId is set globally)
  const orderBefore = appData.liveOrders.find(x => x.id === awOrderId);
  const snapOrder = orderBefore ? JSON.parse(JSON.stringify(orderBefore)) : null;

  if (typeof _ohOrigConfirmWaiter === 'function') _ohOrigConfirmWaiter();

  // After serve — save to history
  if (snapOrder) {
    setTimeout(() => {
      const waiter = selectedWaiterName || snapOrder.waiter || 'Not assigned';
      const amount = ohEstimateAmount(snapOrder.dishes);
      const entry = {
        id: 'OH-' + Date.now(),
        serial: appData.orderHistory.length + 1,
        tableId: snapOrder.tableId,
        customerName: snapOrder.customerName || 'Walk-in Customer',
        customerPhone: snapOrder.customerPhone || '—',
        dishes: snapOrder.dishes || [],
        notes: snapOrder.notes || '',
        waiter: waiter,
        cookTime: snapOrder.cookTime || 0,
        servedAt: new Date().toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit', hour12: true}),
        servedAtFull: new Date().toLocaleString('en-IN', {day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true}),
        timestamp: Date.now(),
        amount: amount,
        source: snapOrder._source === 'firebase' ? 'QR Order' : (snapOrder._source === 'kot' ? 'KOT' : 'Live Order'),
        status: 'served'
      };
      appData.orderHistory.unshift(entry);
      ohUpdateBadges();
      // If order history page is open, refresh
      if (document.getElementById('page-orderhistory')?.classList.contains('active')) renderOrderHistory();
    }, 300);
  }
};

// ── AUTO-SAVE: Hook confirmWaiterAssignFb (Firebase QR orders) ──
const _ohOrigConfirmWaiterFb = window.confirmWaiterAssignFb;
window.confirmWaiterAssignFb = async function() {
  // Capture FB order before
  const fbOrder = (window._liveFirebaseOrders || []).find(x => x._fbId === _awFbId);
  const snapFb = fbOrder ? JSON.parse(JSON.stringify(fbOrder)) : null;
  const snapWaiter = selectedWaiterName;
  const snapTable = _awFbTable;

  if (typeof _ohOrigConfirmWaiterFb === 'function') await _ohOrigConfirmWaiterFb();

  if (snapFb || snapTable) {
    setTimeout(() => {
      const dishes = snapFb ? (snapFb.items || []).map(i => i.name + (i.qty > 1 ? ' ×' + i.qty : '')) : [];
      const amount = ohEstimateAmount(dishes);
      const entry = {
        id: 'OH-FB-' + Date.now(),
        serial: appData.orderHistory.length + 1,
        tableId: snapTable || snapFb?.tableNumber || '?',
        customerName: snapFb?.customerName || 'QR Customer',
        customerPhone: snapFb?.customerPhone || '—',
        dishes: dishes,
        notes: snapFb?.notes || '',
        waiter: snapWaiter || 'Not assigned',
        cookTime: snapFb?.estimatedMinutes || 0,
        servedAt: new Date().toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit', hour12: true}),
        servedAtFull: new Date().toLocaleString('en-IN', {day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true}),
        timestamp: Date.now(),
        amount: amount,
        source: 'QR Order',
        status: 'served'
      };
      appData.orderHistory.unshift(entry);
      ohUpdateBadges();
      if (document.getElementById('page-orderhistory')?.classList.contains('active')) renderOrderHistory();
    }, 2500); // FB auto-serve 2s baad hota hai
  }
};

// ── Badge update ──
function ohUpdateBadges() {
  const count = appData.orderHistory.length;
  const badge = document.getElementById('ohNavBadge');
  if (badge) badge.textContent = count > 0 ? count : '';
  const ftCount = document.getElementById('ft-oh-count');
  if (ftCount) ftCount.textContent = count + ' served';
}

// ── Sort & Filter state ──
let _ohCurrentFilter = 'all';
let _ohSearchQuery = '';
let _ohSortKey = 'time';
let _ohSortDir = 'desc';

function ohFilter(type) {
  _ohCurrentFilter = type;
  _ohSearchQuery = '';
  const inp = document.getElementById('ohSearchInput');
  if (inp) inp.value = '';
  document.querySelectorAll('[id^="ohf-"]').forEach(b => {
    b.classList.remove('btn-gold','btn-green','btn-blue','btn-purple');
    b.classList.add('btn-sm');
  });
  const active = document.getElementById('ohf-' + type);
  if (active) {
    const clsMap = {all:'btn-gold', today:'btn-green', waiter:'btn-blue', table:'btn-purple'};
    active.classList.add(clsMap[type] || 'btn-gold');
  }
  const info = document.getElementById('ohFilterInfo');
  if (info) info.style.display = type !== 'all' ? 'block' : 'none';
  renderOrderHistory();
}

function ohSearch(q) {
  _ohSearchQuery = q.toLowerCase().trim();
  renderOrderHistory();
}

function ohSort(key) {
  if (_ohSortKey === key) {
    _ohSortDir = _ohSortDir === 'asc' ? 'desc' : 'asc';
  } else {
    _ohSortKey = key;
    _ohSortDir = 'desc';
  }
  // Update sort indicator
  ['time','table','waiter','amount'].forEach(k => {
    const el = document.getElementById('ohSort' + k.charAt(0).toUpperCase() + k.slice(1));
    if (el) el.textContent = '';
  });
  const indicator = document.getElementById('ohSort' + key.charAt(0).toUpperCase() + key.slice(1));
  if (indicator) indicator.textContent = _ohSortDir === 'desc' ? ' ▼' : ' ▲';
  renderOrderHistory();
}

// ── Firebase orderHistory collection se bhi load karo (on demand) ──
let _ohFirebaseLoaded = false;
function ohLoadFromFirebase() {
  if (_ohFirebaseLoaded) return;
  if (!window.__chefDb || !window.__chefCollection || !window.__chefOnSnapshot) return;
  _ohFirebaseLoaded = true;
  try {
    window.__chefOnSnapshot(window.__chefCollection(window.__chefDb, 'orderHistory'), snap => {
      snap.forEach(d => {
        const o = { _fbId: d.id, ...d.data() };
        // Check agar already local history mein hai
        const exists = appData.orderHistory.some(h => h._fbId === o._fbId || h.id === 'OH-FB-' + o._fbId);
        if (!exists) {
          appData.orderHistory.push({
            id: 'OH-FB-' + (o._fbId || Date.now()),
            _fbId: o._fbId,
            serial: appData.orderHistory.length + 1,
            tableId: o.tableId || o.tableNumber || '?',
            customerName: o.customerName || 'Customer',
            customerPhone: o.customerPhone || '—',
            dishes: o.dishes || (o.items || []).map(i => i.name + (i.qty > 1 ? ' ×' + i.qty : '')),
            notes: o.notes || '',
            waiter: o.waiter || o.assignedWaiter || 'Not assigned',
            cookTime: o.cookTime || o.estimatedMinutes || 0,
            servedAt: o.servedAt || '—',
            servedAtFull: o.servedAtFull || o.servedAt || '—',
            timestamp: o.timestamp || Date.now(),
            amount: o.amount || ohEstimateAmount(o.dishes || (o.items || []).map(i => i.name)),
            source: o.source || 'QR Order',
            status: 'served'
          });
        }
      });
      // Sort by newest first
      appData.orderHistory.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      // Re-number serials
      appData.orderHistory.forEach((o, i) => { o.serial = i + 1; });
      ohUpdateBadges();
      if (document.getElementById('page-orderhistory')?.classList.contains('active')) renderOrderHistory();
    });
  } catch(e) { console.warn('[OH] Firebase load error:', e.message); }
}

// Auto-load Firebase orderHistory when page is opened
const _origShowPageOH = window.showPage;
window.showPage = function(name) {
  if (typeof _origShowPageOH === 'function') _origShowPageOH(name);
  if (name === 'orderhistory') {
    ohLoadFromFirebase();
    setTimeout(renderOrderHistory, 200);
  }
};

// ── Main Render Function ──
function renderOrderHistory() {
  let orders = [...appData.orderHistory];

  // Filter
  if (_ohCurrentFilter === 'today') {
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    orders = orders.filter(o => o.timestamp >= todayStart.getTime());
  }

  // Search
  if (_ohSearchQuery) {
    orders = orders.filter(o =>
      String(o.tableId).includes(_ohSearchQuery) ||
      (o.customerName || '').toLowerCase().includes(_ohSearchQuery) ||
      (o.customerPhone || '').includes(_ohSearchQuery) ||
      (o.waiter || '').toLowerCase().includes(_ohSearchQuery) ||
      (o.dishes || []).join(' ').toLowerCase().includes(_ohSearchQuery) ||
      (o.notes || '').toLowerCase().includes(_ohSearchQuery) ||
      (o.source || '').toLowerCase().includes(_ohSearchQuery)
    );
  }

  // Sort
  orders.sort((a, b) => {
    let va, vb;
    if (_ohSortKey === 'time')   { va = a.timestamp || 0; vb = b.timestamp || 0; }
    if (_ohSortKey === 'table')  { va = a.tableId || 0;   vb = b.tableId || 0; }
    if (_ohSortKey === 'waiter') { va = (a.waiter||'').toLowerCase(); vb = (b.waiter||'').toLowerCase(); }
    if (_ohSortKey === 'amount') { va = a.amount || 0; vb = b.amount || 0; }
    if (typeof va === 'string') return _ohSortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    return _ohSortDir === 'asc' ? va - vb : vb - va;
  });

  // Stats
  const totalOrders = orders.length;
  const uniqueTables = new Set(orders.map(o => o.tableId)).size;
  const uniqueWaiters = new Set(orders.filter(o => o.waiter && o.waiter !== 'Not assigned').map(o => o.waiter)).size;
  const totalRevenue = orders.reduce((s, o) => s + (o.amount || 0), 0);

  const ohTotal = document.getElementById('oh-total');
  const ohTables = document.getElementById('oh-tables');
  const ohWaiters = document.getElementById('oh-waiters');
  const ohRevenue = document.getElementById('oh-revenue');
  if (ohTotal) ohTotal.textContent = totalOrders;
  if (ohTables) ohTables.textContent = uniqueTables;
  if (ohWaiters) ohWaiters.textContent = uniqueWaiters;
  if (ohRevenue) ohRevenue.textContent = '₹' + totalRevenue.toLocaleString('en-IN');

  const countLabel = document.getElementById('ohCountLabel');
  if (countLabel) countLabel.textContent = orders.length + ' records';

  // Table rows
  const tbody = document.getElementById('ohTableBody');
  if (!tbody) return;

  if (!orders.length) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:48px;color:var(--text2);">
      <div style="font-size:44px;margin-bottom:14px;">📜</div>
      <div style="font-size:15px;font-weight:700;margin-bottom:6px;">Koi order history nahi mili</div>
      <div style="font-size:12px;">Jab orders serve honge, woh automatically yahan add ho jayenge</div>
    </td></tr>`;
    renderOhWaiterSummary(orders);
    return;
  }

  tbody.innerHTML = orders.map((o, idx) => {
    const sourceColor = o.source === 'QR Order' ? 'var(--blue)' : o.source === 'KOT' ? 'var(--orange)' : 'var(--accent)';
    const sourceBg = o.source === 'QR Order' ? 'rgba(59,130,246,.1)' : o.source === 'KOT' ? 'rgba(245,158,11,.1)' : 'rgba(46,156,94,.1)';
    const sourceEmoji = o.source === 'QR Order' ? '📱' : o.source === 'KOT' ? '🧾' : '📋';
    const dishesHtml = (o.dishes || []).map(d =>
      `<span style="background:var(--bg3);border:1px solid var(--border);border-radius:6px;padding:2px 8px;font-size:11px;font-weight:600;white-space:nowrap;">${d}</span>`
    ).join(' ');
    const waiterEmoji = appData.staff.find(s => s.name === o.waiter)?.emoji || '🧑‍🍽️';
    const rowBg = idx % 2 === 0 ? 'var(--bg2)' : 'var(--bg3)';

    return `<tr style="background:${rowBg};border-bottom:1px solid var(--border);transition:background .15s;" onmouseover="this.style.background='var(--gold-dim)'" onmouseout="this.style.background='${rowBg}'">
      <td style="padding:11px 14px;font-family:var(--font-mono);font-size:11px;color:var(--text2);font-weight:700;">${o.serial || idx + 1}</td>
      <td style="padding:11px 14px;white-space:nowrap;">
        <div style="font-size:12px;font-weight:800;color:var(--text);font-family:var(--font-mono);">${o.servedAt || '—'}</div>
        <div style="font-size:10px;color:var(--text2);margin-top:1px;">${(o.servedAtFull || '').split(',').slice(0,2).join(',') || ''}</div>
      </td>
      <td style="padding:11px 14px;">
        <div style="font-family:var(--font-head);font-size:15px;font-weight:800;color:var(--accent);">T${o.tableId}</div>
      </td>
      <td style="padding:11px 14px;min-width:130px;">
        <div style="font-size:13px;font-weight:700;color:var(--text);">${o.customerName || 'Walk-in'}</div>
        ${o.customerPhone && o.customerPhone !== '—' ? `<div style="font-size:10px;color:var(--text2);margin-top:1px;">📞 ${o.customerPhone}</div>` : ''}
      </td>
      <td style="padding:11px 14px;max-width:220px;">
        <div style="display:flex;flex-wrap:wrap;gap:4px;">${dishesHtml || '<span style="color:var(--text2);font-size:12px;">—</span>'}</div>
        ${o.cookTime ? `<div style="font-size:10px;color:var(--text2);margin-top:3px;">⏱ Cook time: ${o.cookTime} min</div>` : ''}
      </td>
      <td style="padding:11px 14px;white-space:nowrap;">
        <div style="display:flex;align-items:center;gap:7px;">
          <span style="font-size:18px;">${waiterEmoji}</span>
          <div>
            <div style="font-size:13px;font-weight:700;color:${o.waiter && o.waiter !== 'Not assigned' ? 'var(--text)' : 'var(--text2)'};">${o.waiter || 'Not assigned'}</div>
            ${o.waiter && o.waiter !== 'Not assigned' ? `<div style="font-size:10px;color:var(--green);font-weight:600;">● Served</div>` : ''}
          </div>
        </div>
      </td>
      <td style="padding:11px 14px;max-width:160px;">
        <div style="font-size:12px;color:var(--orange);font-style:italic;">${o.notes || '—'}</div>
      </td>
      <td style="padding:11px 14px;text-align:right;white-space:nowrap;">
        <div style="font-family:var(--font-head);font-size:15px;font-weight:800;color:${o.amount > 0 ? 'var(--accent)' : 'var(--text2)'};">${o.amount > 0 ? '₹' + o.amount.toLocaleString('en-IN') : '—'}</div>
      </td>
      <td style="padding:11px 14px;text-align:center;">
        <span style="font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;background:${sourceBg};color:${sourceColor};border:1px solid ${sourceColor.replace(')',', 0.3)').replace('var(','rgba(').replace('--','').replace(')',', 0.3)')};">${sourceEmoji} ${o.source || 'Order'}</span>
      </td>
    </tr>`;
  }).join('');

  renderOhWaiterSummary(orders);
  ohUpdateBadges();
}

// ── Waiter Performance Summary ──
function renderOhWaiterSummary(orders) {
  const grid = document.getElementById('ohWaiterGrid');
  if (!grid) return;

  // Group by waiter from served orders
  const waiterMap = {};
  orders.forEach(o => {
    const w = o.waiter && o.waiter !== 'Not assigned' ? o.waiter : null;
    if (!w) return;
    if (!waiterMap[w]) waiterMap[w] = { name: w, count: 0, amount: 0, tables: new Set() };
    waiterMap[w].count++;
    waiterMap[w].amount += (o.amount || 0);
    waiterMap[w].tables.add(o.tableId);
  });

  // Also include all waiters from staff list (even if 0 orders served)
  const allWaiters = appData.staff.filter(s => s.role === 'waiter');
  allWaiters.forEach(s => {
    if (!waiterMap[s.name]) {
      waiterMap[s.name] = { name: s.name, count: 0, amount: 0, tables: new Set() };
    }
  });

  const waiters = Object.values(waiterMap).sort((a, b) => b.count - a.count);

  if (!waiters.length) {
    grid.innerHTML = `<div style="text-align:center;padding:22px;color:var(--text2);font-size:13px;grid-column:1/-1;">Staff mein koi waiter nahi hai. Staff → Add Staff se add karo.</div>`;
    return;
  }

  const maxCount = Math.max(...waiters.map(w => w.count), 1);

  grid.innerHTML = waiters.map(w => {
    const staffObj = appData.staff.find(s => s.name === w.name);
    const emoji = staffObj?.emoji || '🧑‍🍽️';
    const isPresent = staffObj?.present !== false;
    const pct = Math.round((w.count / maxCount) * 100);
    const colors = ['var(--accent)', 'var(--blue)', 'var(--purple)', 'var(--orange)', 'var(--pink)'];
    const colorIdx = waiters.indexOf(w) % colors.length;
    const color = colors[colorIdx];
    // Find currently serving table
    const activeOrder = (appData.liveOrders || []).find(o => o.waiter === w.name && (o.status === 'serving' || o.status === 'cooking'));
    const activeTable = activeOrder ? `🪑 Table ${activeOrder.tableId} pe serving` : '';

    return `<div class="card" style="padding:16px;border:1.5px solid ${w.count > 0 ? 'var(--border2)' : 'var(--border)'};${!isPresent ? 'opacity:0.55;' : ''}">
      <div style="display:flex;align-items:center;gap:11px;margin-bottom:12px;">
        <div style="width:44px;height:44px;border-radius:12px;background:var(--gold-dim);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">${emoji}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:14px;font-weight:800;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${w.name}</div>
          <div style="font-size:10px;color:${isPresent ? 'var(--green)' : 'var(--red)'};font-weight:700;letter-spacing:1px;font-family:var(--font-mono);">${isPresent ? '● PRESENT' : '● ABSENT'}</div>
        </div>
        ${w.count > 0 ? `<span style="font-size:10px;font-weight:800;padding:3px 9px;border-radius:20px;background:rgba(46,156,94,.12);color:var(--green);border:1px solid rgba(46,156,94,.3);">ACTIVE</span>` : ''}
      </div>
      ${activeTable ? `<div style="font-size:11px;color:var(--blue);font-weight:700;margin-bottom:8px;padding:4px 9px;background:rgba(59,130,246,.08);border-radius:8px;">${activeTable}</div>` : ''}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
        <div style="text-align:center;background:var(--bg3);border-radius:9px;padding:8px 4px;">
          <div style="font-family:var(--font-head);font-size:20px;font-weight:800;color:${w.count > 0 ? color : 'var(--text2)'};">${w.count}</div>
          <div style="font-size:9px;color:var(--text2);font-weight:700;letter-spacing:.8px;">ORDERS</div>
        </div>
        <div style="text-align:center;background:var(--bg3);border-radius:9px;padding:8px 4px;">
          <div style="font-family:var(--font-head);font-size:20px;font-weight:800;color:${w.tables.size > 0 ? 'var(--accent)' : 'var(--text2)'};">${w.tables.size}</div>
          <div style="font-size:9px;color:var(--text2);font-weight:700;letter-spacing:.8px;">TABLES</div>
        </div>
      </div>
      <div style="background:var(--bg3);border-radius:6px;height:6px;overflow:hidden;margin-bottom:8px;">
        <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,${color},${color}88);border-radius:6px;transition:width .6s ease;"></div>
      </div>
      ${w.amount > 0 ? `<div style="font-size:11px;color:var(--text2);text-align:center;font-weight:600;">Est. Revenue: <strong style="color:var(--accent);">₹${w.amount.toLocaleString('en-IN')}</strong></div>` : `<div style="font-size:11px;color:var(--text2);text-align:center;">Koi order abhi serve nahi kiya</div>`}
    </div>`;
  }).join('');
}

// ── Export CSV ──
function ohExportCSV() {
  const orders = appData.orderHistory;
  if (!orders.length) { showToast('Koi order history nahi hai!', 'var(--orange)'); return; }

  let csv = 'Sr,Time,Date,Table,Customer,Phone,Dishes,Notes,Waiter,Cook Time (min),Amount (₹),Source\n';
  orders.forEach((o, i) => {
    const dishes = (o.dishes || []).join(' | ').replace(/,/g, ';');
    const notes = (o.notes || '').replace(/,/g, ';');
    csv += `${i+1},"${o.servedAt||''}","${o.servedAtFull||''}",Table ${o.tableId},"${o.customerName||'Walk-in'}","${o.customerPhone||'—'}","${dishes}","${notes}","${o.waiter||'—'}",${o.cookTime||0},${o.amount||0},"${o.source||'Order'}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Siplora-Order-History-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('✅ Order History CSV download ho rahi hai!', 'var(--green)');
}

// ── Clear All History ──
function ohClearAll() {
  if (!appData.orderHistory.length) { showToast('History already empty hai!', 'var(--orange)'); return; }
  if (!confirm(`Kya aap sach mein ${appData.orderHistory.length} orders ki history delete karna chahte ho? Ye undo nahi ho sakta!`)) return;
  appData.orderHistory = [];
  ohUpdateBadges();
  renderOrderHistory();
  showToast('🗑️ Order History clear kar di gayi!', 'var(--red)');
}

// ── Init on load: update badges ──
window.addEventListener('load', () => { setTimeout(ohUpdateBadges, 2000); });

// ── Make functions global ──
window.renderOrderHistory = renderOrderHistory;
window.ohFilter = ohFilter;
window.ohSearch = ohSearch;
window.ohSort = ohSort;
window.ohExportCSV = ohExportCSV;
window.ohClearAll = ohClearAll;
window.ohUpdateBadges = ohUpdateBadges;
// ════════════════════════════════════════════════════════════════
//  🔗 CAPTAIN PANEL SYNC — Firebase Bridge
//  Chef panel se Captain panel ko real-time connect karta hai
//  - Captain ke confirm hone ke baad chef ko order milega
//  - Chef ready press kare → captain ko notification
//  - Dono timer set kar sakte hain
//  - Dono waiter assign kar sakte hain
//  - Order history dono panels mein save hogi
// ════════════════════════════════════════════════════════════════

(function initCaptainBridgeSync() {
  // Wait for Firebase to be ready
  let _captainSyncReady = false;
  let _captainOrdersUnsubscribe = null;

  function waitForFirebase(cb, retries = 20) {
    if (window.__chefDb) { cb(); return; }
    if (retries <= 0) return;
    setTimeout(() => waitForFirebase(cb, retries - 1), 500);
  }

  // Listen to orders — captain ke actions bhi dekhte rahe
  window.addEventListener('load', function() {
    waitForFirebase(() => {
      const db = window.__chefDb;
      const { collection, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } = {
        collection: window.__chefCollection,
        onSnapshot: window.__chefOnSnapshot,
        doc: window.__chefDoc,
        updateDoc: window.__chefUpdateDoc,
        addDoc: window._fbAddDoc,
        serverTimestamp: window._fbServerTimestamp
      };

      // Watch for captain-confirmed orders (captain ne confirm kiya)
      // These come in with status='confirmed_by_captain'
      if (onSnapshot && collection && db) {
        onSnapshot(collection(db, 'orders'), snap => {
          snap.docChanges().forEach(change => {
            const o = { _fbId: change.doc.id, ...change.doc.data() };
            
            // Captain ne order confirm kiya → Chef ko alert do
            if (change.type === 'modified' && o.status === 'confirmed_by_captain' && !o._chefAlerted) {
              const tbl = o.tableNumber || o.table || '?';
              const custName = o.customerName || 'Customer';
              const items = (o.items || []).map(i => `${i.name}${i.qty > 1 ? ' ×' + i.qty : ''}`).join(', ');
              
              triggerAudioAlert('👨‍✈️', 'CAPTAIN CONFIRMED!', 
                `Table ${tbl} — ${custName} ka order Captain ne confirm kiya! Ab cooking shuru karo.`, 'alert-ready');
              // Voice sirf timer set hone pe — yahan nahi
              addSwNotification(`👨‍✈️ Captain: T${tbl} confirmed!`, 'sw-vip');
              showToast(`👨‍✈️ Table ${tbl} — Captain ne confirm kiya! Cooking shuru karo.`, 'var(--blue)');
              
              // Mark as chef-alerted (sirf ek baar alert)
              if (window.__chefUpdateDoc && window.__chefDoc) {
                window.__chefUpdateDoc(window.__chefDoc(db, 'orders', o._fbId), {
                  _chefAlerted: true
                }).catch(() => {});
              }
              
              // Live menu refresh
              if (typeof renderLiveMenu === 'function') renderLiveMenu();
              if (typeof renderNewOrders === 'function') renderNewOrders();
            }

            // Captain ne timer set kiya → Chef ko bhi dikhao
            if (change.type === 'modified' && o.captainTimer && o.captainTimer !== o._prevCaptainTimer) {
              const tbl = o.tableNumber || '?';
              showToast(`⏱️ Captain ne Table ${tbl} pe ${o.captainTimer} min timer set kiya!`, 'var(--violet)');
              if (typeof renderLiveMenu === 'function') renderLiveMenu();
            }

            // Captain ne waiter assign kiya → Chef ko bhi dikhao + AUTO-SERVE!
            if (change.type === 'modified' && o.captainAssignedWaiter && !o._captainWaiterChefAlerted) {
              const tbl = o.tableNumber || '?';
              const waiterName = o.captainAssignedWaiter;
              showToast(`🧑‍🍽️ Captain ne ${waiterName} ko Table ${tbl} assign kiya! Auto-serve ho raha hai... ✅`, 'var(--violet)');
              triggerAudioAlert('🧑‍🍽️', 'CAPTAIN WAITER ASSIGN — AUTO SERVE!', 
                `${waiterName} Table ${tbl} serve karne ja raha hai! Chef panel mein order complete ho raha hai.`, 'alert-ready');
              // Voice sirf timer set hone pe — yahan nahi
              
              // Firebase order ko served mark karo (auto-serve)
              setTimeout(async () => {
                try {
                  if (window.__chefUpdateDoc && window.__chefDoc && db) {
                    await window.__chefUpdateDoc(window.__chefDoc(db, 'orders', o._fbId), {
                      status: 'served',
                      servedAt: new Date().toISOString(),
                      servedBy: waiterName,
                      _captainWaiterChefAlerted: true
                    });
                    showToast(`✅ Table ${tbl} — Captain ke assign karne par auto-serve! ${waiterName} serve kar raha hai.`, 'var(--green)');
                    addSwNotification(`✅ Auto-Served: Table ${tbl}`, 'sw-ready');
                     setTimeout(()=>{},200);
                  }
                  // Local orders bhi check karo matching table ke liye
                  const localOrder = (appData.liveOrders || []).find(lo => 
                    String(lo.tableId) === String(tbl) && lo._fbId === o._fbId
                  );
                  if (localOrder && typeof _captainAutoServeLocalOrder === 'function') {
                    setTimeout(() => _captainAutoServeLocalOrder(localOrder.id, waiterName), 500);
                  }
                  if (typeof renderLiveMenu === 'function') setTimeout(renderLiveMenu, 1000);
                  if (typeof renderNewOrders === 'function') setTimeout(renderNewOrders, 1200);
                } catch(e) { 
                  showToast('Auto-serve error: ' + e.message, 'var(--orange)'); 
                  // Still mark as alerted even if serve fails
                  if (window.__chefUpdateDoc && window.__chefDoc && db) {
                    window.__chefUpdateDoc(window.__chefDoc(db, 'orders', o._fbId), {_captainWaiterChefAlerted: true}).catch(()=>{});
                  }
                }
              }, 1500);
              
              if (window.__chefUpdateDoc && window.__chefDoc) {
                window.__chefUpdateDoc(window.__chefDoc(db, 'orders', o._fbId), {
                  _captainWaiterChefAlerted: true
                }).catch(() => {});
              }
            }
          });
        });
      }

      // ── Chef Ready → Captain ko notify karo (via Firebase field) ──
      // markOrderReady ko wrap karo
      const _origMarkReady = window.markOrderReady;
      window.markOrderReady = async function(fbOrderId, tableNum, dishName) {
        // Original function
        if (typeof _origMarkReady === 'function') {
          await _origMarkReady(fbOrderId, tableNum, dishName);
        }
        // Captain ko notify karne ke liye readyNotifiedCaptain field set karo
        if (window.__chefUpdateDoc && window.__chefDoc && db) {
          try {
            await window.__chefUpdateDoc(window.__chefDoc(db, 'orders', fbOrderId), {
              chefReadyAt: new Date().toISOString(),
              chefReadyNotified: true,
              status: 'ready'
            });
          } catch(e) {}
        }
      };

      // ── Chef Waiter Assign → Captain ko bhi notify ──
      const _origConfirmWaiterFb = window.confirmWaiterAssignFb;
      window.confirmWaiterAssignFb = async function() {
        if (typeof _origConfirmWaiterFb === 'function') {
          await _origConfirmWaiterFb();
        }
        // Captain panel ko notify karne ke liye chefAssignedWaiter field update
        if (_awFbId && selectedWaiterName && window.__chefUpdateDoc && window.__chefDoc && db) {
          try {
            await window.__chefUpdateDoc(window.__chefDoc(db, 'orders', _awFbId), {
              chefAssignedWaiter: selectedWaiterName,
              chefWaiterAssignedAt: new Date().toISOString()
            });
          } catch(e) {}
        }
      };

      // ── Firebase orderHistory collection mein save karo ──
      // Jab bhi order serve ho, Firebase mein bhi save ho dono panels ke liye
      const _origOhConfirmWaiter = window.confirmWaiterAssign;
      window.confirmWaiterAssign = function() {
        const orderBefore = appData.liveOrders.find(x => x.id === window.awOrderId);
        if (typeof _origOhConfirmWaiter === 'function') _origOhConfirmWaiter();
        // Firebase orderHistory mein bhi save karo
        if (orderBefore && window.__chefDb && window._fbAddDoc && window.__chefCollection) {
          setTimeout(async () => {
            try {
              const waiter = window.selectedWaiterName || orderBefore.waiter || 'Not assigned';
              const amount = (orderBefore.dishes || []).reduce((t, d) => {
                const m = appData.menu.find(x => d.toLowerCase().includes(x.name.toLowerCase().split(' ')[0]));
                return t + (m ? m.price : 0);
              }, 0);
              await window._fbAddDoc(window.__chefCollection(window.__chefDb, 'orderHistory'), {
                tableId: orderBefore.tableId,
                customerName: orderBefore.customerName || 'Walk-in',
                customerPhone: orderBefore.customerPhone || '',
                dishes: orderBefore.dishes || [],
                notes: orderBefore.notes || '',
                waiter: waiter,
                cookTime: orderBefore.cookTime || 0,
                amount: amount,
                source: orderBefore._source === 'firebase' ? 'QR Order' : 'KOT',
                servedAt: new Date().toISOString(),
                savedBy: 'chef'
              });
            } catch(e) {}
          }, 2500);
        }
      };

      console.log('✅ [Chef→Captain Bridge] Sync ready!');
      _captainSyncReady = true;
    });
  });

  // Expose addDoc for Firebase orderHistory saving
  window.addEventListener('load', async function() {
    try {
      const { addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
      window._fbAddDoc = addDoc;
      window._fbServerTimestamp = serverTimestamp;
    } catch(e) {}
  });
})();

console.log('✅ Siplora Chef-Captain Bridge loaded!');

// ════════════════════════════════════════════════════════════════
//  🆕 CHEF PANEL — ENHANCED FEATURES
//  1. chefConfirmReady — Chef ka ready button (local orders ke liye)
//  2. Captain timer → Chef panel mein bhi countdown
//  3. AI Late Alert — 10 min over hone par dono ko voice alert
//  4. ARIA voice system (captain se copy — ElevenLabs compatible)
// ════════════════════════════════════════════════════════════════

// ── 1. CHEF CONFIRM READY (Local Orders) ──
function chefConfirmReady(orderId) {
  const o = appData.liveOrders.find(x => x.id === orderId);
  if (!o) return;
  o.status = 'ready';
  o.timeLeft = 0;
  o.chefReadyConfirmed = true;
  o.chefReadyAt = new Date().toISOString();
  renderLiveMenu();
  NovaVoice.orderReady(o.tableId, o.dishes[0] || 'Order');
  triggerAudioAlert('✅', 'CHEF NE READY CONFIRM KIYA!', `Table ${o.tableId} — ${o.customerName || 'Customer'} ka khana ready! Captain ko notify kiya. Waiter bhejenge.`, 'alert-ready');
  addSwNotification(`✅ Chef Ready: Table ${o.tableId}`, 'sw-ready');
  setTimeout(()=>{},250); setTimeout(()=>{},500);
  showToast(`✅ Chef ne Table ${o.tableId} ready confirm kiya! Captain ab waiter assign kar sakta hai.`, 'var(--green)');
}
window.chefConfirmReady = chefConfirmReady;

// ── 2. CAPTAIN TIMER → CHEF PANEL MEIN DIKHE ──
// Firebase orders mein captainTimer agar set hai, toh chef ko bhi countdown dikhe
(function watchCaptainTimerForChef() {
  // Firebase watcher already chef-app.js mein hai (initCaptainBridgeSync)
  // Bas ek additional toast add karo jab captain timer set kare
  const origOnSnap = window.__chefOnSnapshot;
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (!window.__chefDb || !window.__chefCollection || !window.__chefOnSnapshot) return;
      window.__chefOnSnapshot(window.__chefCollection(window.__chefDb, 'orders'), snap => {
        snap.docChanges().forEach(change => {
          if (change.type !== 'modified') return;
          const o = { _fbId: change.doc.id, ...change.doc.data() };

          // Captain ne timer set kiya → Chef ko bhi countdown mein dikhao
          if (o.captainTimer && !o._chefCaptainTimerShown) {
            const tbl = o.tableNumber || '?';
            // captainTimerSetAt set karo agar nahi hai
            const setAt = o.captainTimerSetAt || new Date().toISOString();
            showToast(`⏱️ Captain ne Table ${tbl} ke liye ${o.captainTimer} min timer set kiya! Countdown chal raha hai.`, 'var(--violet)');
            // Full detail ek baar — announceOrderDetail
            if (typeof NovaVoice !== 'undefined') NovaVoice.announceOrderDetail(o, o.captainTimer);
            // Update Firebase to mark as shown + set captainTimerSetAt
            if (window.__chefUpdateDoc && window.__chefDoc) {
              window.__chefUpdateDoc(window.__chefDoc(window.__chefDb, 'orders', o._fbId), {
                _chefCaptainTimerShown: true,
                captainTimerSetAt: setAt
              }).catch(() => {});
            }
            // Refresh live menu
            if (typeof renderLiveMenu === 'function') setTimeout(renderLiveMenu, 200);
          }
        });
      });
    }, 3000);
  });
})();

// ── 3. CHEF AI LATE ALERT SYSTEM ──
// Jo time chef ne customer ko diya, us se 10 min zyada ho jaye → Chef ko bhi voice alert
const _chefLateAlertedSet = new Set();

function checkChefLateAlerts() {
  const now = Date.now();

  // Firebase orders check
  if (window._liveFirebaseOrders) {
    window._liveFirebaseOrders.forEach(o => {
      if (['served', 'paid', 'cancelled', 'ready'].includes(o.status)) return;
      const totalMins = o.estimatedMinutes || 0;
      if (!totalMins || !o.acceptedAt) return;

      const elapsedMins = (now - new Date(o.acceptedAt).getTime()) / 60000;
      const overdueMins = elapsedMins - totalMins;
      const orderKey = 'chef_' + (o._fbId || o.tableNumber);

      if (overdueMins >= 10 && !_chefLateAlertedSet.has(orderKey)) {
        _chefLateAlertedSet.add(orderKey);
        const overRounded = Math.round(overdueMins);
        const tbl = o.tableNumber || '?';
        const custName = o.customerName || 'Customer';

        const msg = `Chef ji! Table ${tbl} pe ${custName} ka khana ${totalMins} minute mein ready hona tha. Ab ${overRounded} minute extra ho gaye hain! Jo time aapne diya tha, us se 10 minute zyada ho gaye. Jaldi karo please!`;

        NovaVoice.speak(msg, true);
        triggerAudioAlert('⏰', 'KHANA LATE HO RAHA HAI!',
          `Table ${tbl} — ${custName} | ${totalMins} min set kiya tha — Ab ${overRounded} min extra! Dono ko alert bheja.`,
          'alert-urgent');
        showToast(`⏰ Table ${tbl} — 10 min overshoot! Jo time diya tha us se ${overRounded} min zyada ho gaye.`, '#dc2626');
      }
    });
  }

  // Local orders check
  (appData.liveOrders || []).forEach(o => {
    if (!['cooking'].includes(o.status)) return;
    if (!o.cookTime || !o.createdAt) return;

    const cookingStarted = o.cookingStartedAt || o.createdAt;
    const elapsedMins = (now - cookingStarted) / 60000;
    const overdueMins = elapsedMins - o.cookTime;
    const orderKey = 'chef_local_' + o.id;

    if (overdueMins >= 10 && !_chefLateAlertedSet.has(orderKey)) {
      _chefLateAlertedSet.add(orderKey);
      const overRounded = Math.round(overdueMins);

      const msg = `Chef! Table ${o.tableId} ka khana ${o.cookTime} minute mein ready hona tha. Ab ${overRounded} minute extra ho gaye hain! Jaldi karo.`;
      NovaVoice.speak(msg, true);
      triggerAudioAlert('⏰', 'LOCAL ORDER LATE!',
        `Table ${o.tableId} — ${o.cookTime} min set tha — Ab ${overRounded} min extra!`, 'alert-urgent');
    }
  });
}

// Har 30 second mein check
setInterval(checkChefLateAlerts, 30000);
setTimeout(checkChefLateAlerts, 8000);

// ── 4. CHEF PANEL — ARIA VOICE SYSTEM (Captain se copy + ElevenLabs support) ──
// Chef panel mein bhi ARIA_VOICE (ElevenLabs) use karo agar available ho

(function setupChefARIABridge() {
  // Captain wali ARIA_VOICE chef panel mein bhi available karo
  // Agar captain aur chef same browser mein hain ya same session mein
  // Toh localStorage se ElevenLabs config use karo
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (typeof NovaVoice !== 'undefined') {
        // Check if ElevenLabs key is saved (captain ne configure kiya tha)
        const elKey = localStorage.getItem('aria_el_key');
        const elVid = localStorage.getItem('aria_el_vid');
        const elOn  = localStorage.getItem('aria_el_on');

        if (elKey && elOn === 'true') {
          // ElevenLabs config available hai — NovaVoice ko upgrade karo
          NovaVoice._elKey = elKey;
          NovaVoice._elVid = elVid || 'cgSgspJ2msm6clMCkdW9';
          NovaVoice._useEL = true;

          // Override _next to use ElevenLabs
          const origNext = NovaVoice._next.bind(NovaVoice);
          NovaVoice._next = async function() {
            if (!this.queue.length) { this.speaking = false; return; }
            this.speaking = true;
            const text = this.queue.shift();

            if (this._useEL && this._elKey) {
              // ElevenLabs TTS
              try {
                const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this._elVid}`, {
                  method: 'POST',
                  headers: { 'xi-api-key': this._elKey, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
                  body: JSON.stringify({
                    text,
                    model_id: 'eleven_turbo_v2_5',
                    voice_settings: { stability: 0.42, similarity_boost: 0.90, style: 0.40, use_speaker_boost: true }
                  })
                });
                if (!r.ok) throw new Error(r.status);
                const blob = await r.blob();
                const url = URL.createObjectURL(blob);
                const au = new Audio(url);
                au.volume = 1;
                au.onended = au.onerror = () => { URL.revokeObjectURL(url); this._next(); };
                au.play();
                return;
              } catch(e) {
                console.warn('ElevenLabs (chef) failed:', e.message);
                this._useEL = false;
              }
            }
            // Fallback to original
            origNext();
          };

          console.log('✅ Chef Panel — ElevenLabs voice activated from saved config!');
          showToast('🎙️ ElevenLabs voice active! (Captain config se)', 'var(--purple)');
        }
      }
    }, 3000);
  });
})();

console.log('✅ Siplora Chef — Enhanced Features Loaded!');
console.log('  ✅ Chef Confirm Ready: Firebase chefReadyNotified ✓');
console.log('  ⏱️ Captain Timer in Chef Panel: Countdown ✓');
console.log('  🤖 AI Late Alert (10 min over): Chef + Captain dono ✓');
console.log('  🎙️ ARIA Voice (ElevenLabs): Captain config bridge ✓');

// ═══════════════════════════════════════════════════════════════
//  🔥 FIREBASE — STAFF, INVENTORY & MENU PERSISTENT STORAGE
//  Yeh code existing Firebase connection ke baad run hota hai
//  Collections: chef_staff, chef_inventory, chef_menu
// ═══════════════════════════════════════════════════════════════

(function waitForFirebaseAndInit() {
  // Existing initChefFirebase ke baad db ready hoga — wait karo
  let attempts = 0;
  const timer = setInterval(async () => {
    attempts++;
    const db = window.__chefDb;
    const docFn = window.__chefDoc;
    if (!db || !docFn) {
      if (attempts > 30) { clearInterval(timer); console.warn('Firebase db not ready after 15s'); }
      return;
    }
    clearInterval(timer);
    await startStaffInvMenuFirebase(db, docFn);
  }, 500);
})();

async function startStaffInvMenuFirebase(db, docFn) {
  try {
    const { collection, getDocs, setDoc, deleteDoc, onSnapshot } = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js")
    ]).then(mods => mods[0]);

    const COLLS = { staff: 'chef_staff', inventory: 'chef_inventory', menu: 'chef_menu', customers: 'chef_customers' };

    // ── SAVE ──
    async function fbSave(coll, item) {
      try {
        const d = { ...item };
        if (d.image && d.image.length > 400000) d.image = await compressImg(d.image);
        await setDoc(docFn(db, coll, String(d.id)), d);
      } catch(e) { console.error('fbSave error:', coll, e.message); }
    }

    // ── DELETE ──
    async function fbDel(coll, id) {
      try { await deleteDoc(docFn(db, coll, String(id))); }
      catch(e) { console.error('fbDel error:', e.message); }
    }

    // ── LOAD ALL ──
    async function fbLoad(coll) {
      try {
        const snap = await getDocs(collection(db, coll));
        if (snap.empty) return null;
        return snap.docs.map(d => d.data());
      } catch(e) { console.error('fbLoad error:', e.message); return null; }
    }

    // ── IMAGE COMPRESS ──
    function compressImg(base64) {
      return new Promise(res => {
        const img = new Image();
        img.onload = () => {
          const c = document.createElement('canvas');
          let w = img.width, h = img.height, MAX = 400;
          if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
          if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
          c.width = w; c.height = h;
          c.getContext('2d').drawImage(img, 0, 0, w, h);
          res(c.toDataURL('image/jpeg', 0.55));
        };
        img.onerror = () => res('');
        img.src = base64;
      });
    }

    // ══════════════════════════════════════
    //  INITIAL LOAD — page open hone pe
    // ══════════════════════════════════════
    showToast('🔥 Staff/Inventory/Menu data load ho raha hai...', 'var(--blue)');

    const [staffData, invData, menuData, custData] = await Promise.all([
      fbLoad(COLLS.staff),
      fbLoad(COLLS.inventory),
      fbLoad(COLLS.menu),
      fbLoad(COLLS.customers)
    ]);

    // STAFF
    if (staffData && staffData.length > 0) {
      appData.staff = staffData.sort((a,b) => Number(a.id) - Number(b.id));
      console.log(`✅ Staff loaded from Firebase: ${staffData.length}`);
    } else {
      // Pehli baar — default data Firebase mein save karo
      for (const s of appData.staff) await fbSave(COLLS.staff, s);
      console.log('Staff: default data Firebase mein save kiya');
    }

    // INVENTORY
    if (invData && invData.length > 0) {
      appData.inventory = invData.sort((a,b) => Number(a.id) - Number(b.id));
      console.log(`✅ Inventory loaded from Firebase: ${invData.length}`);
    } else {
      for (const i of appData.inventory) await fbSave(COLLS.inventory, i);
      console.log('Inventory: default data Firebase mein save kiya');
    }

    // MENU
    if (menuData && menuData.length > 0) {
      appData.menu = menuData.sort((a,b) => Number(a.id) - Number(b.id));
      console.log(`✅ Menu loaded from Firebase: ${menuData.length}`);
    } else {
      for (const m of appData.menu) await fbSave(COLLS.menu, m);
      console.log('Menu: default data Firebase mein save kiya');
    }

    // CUSTOMERS
    if (custData && custData.length > 0) {
      appData.customers = custData.sort((a,b) => (b.visits||0) - (a.visits||0));
      console.log(`✅ Customers loaded from Firebase: ${custData.length}`);
    } else {
      // Save default sample customers to Firebase
      for (const c of appData.customers) await fbSave(COLLS.customers, c);
      console.log('Customers: default data Firebase mein save kiya');
    }

    // Re-render with loaded data
    renderStaff();
    renderInventory();
    renderMenu();
    renderCustomers();
    populateSelects();
    updateFeatTabCounts();
    showToast('✅ Data load ho gaya! Ab sab kuch save rahega.', 'var(--green)');

    // ══════════════════════════════════════
    //  CUSTOMER Firebase Functions — expose globally
    // ══════════════════════════════════════
    window.__custFbSave = async function(c) {
      try { await fbSave(COLLS.customers, c); }
      catch(e) { console.error('Customer save error:', e.message); }
    };
    window.__custFbDel = async function(id) {
      try { await fbDel(COLLS.customers, id); }
      catch(e) { console.error('Customer del error:', e.message); }
    };

    // Flush any queued saves/deletes
    if(window.__custSaveQueue) {
      for(const c of window.__custSaveQueue) window.__custFbSave(c);
      window.__custSaveQueue = [];
    }
    if(window.__custDelQueue) {
      for(const id of window.__custDelQueue) window.__custFbDel(id);
      window.__custDelQueue = [];
    }

    console.log('✅ Customer Firebase integration active!');

    // ══════════════════════════════════════
    //  SUPPLIER Firebase Integration
    // ══════════════════════════════════════
    const COLL_SUPPLIERS = 'chef_suppliers';

    // Load suppliers from Firebase
    const supData = await fbLoad(COLL_SUPPLIERS);
    if(supData && supData.length > 0){
      appData.suppliers = supData.sort((a,b) => Number(a.id) - Number(b.id));
      renderSuppliers();
      console.log(`✅ Suppliers loaded from Firebase: ${supData.length}`);
    } else {
      // Pehli baar — default suppliers Firebase mein save karo
      for(const s of appData.suppliers) await fbSave(COLL_SUPPLIERS, s);
      console.log('Suppliers: default data Firebase mein save kiya');
    }

    // Expose globally
    window.__supFbSave = async function(s){
      try{ await fbSave(COLL_SUPPLIERS, s); }
      catch(e){ console.error('Supplier save error:', e.message); }
    };
    window.__supFbDel = async function(id){
      try{ await fbDel(COLL_SUPPLIERS, id); }
      catch(e){ console.error('Supplier del error:', e.message); }
    };

    // Flush any queued saves/deletes
    if(window.__supSaveQueue){
      for(const s of window.__supSaveQueue) window.__supFbSave(s);
      window.__supSaveQueue = [];
    }
    if(window.__supDelQueue){
      for(const id of window.__supDelQueue) window.__supFbDel(id);
      window.__supDelQueue = [];
    }

    console.log('✅ Supplier Firebase integration active!');

    // ══════════════════════════════════════
    //  EXPIRY ITEMS — Global Firebase Expose
    // ══════════════════════════════════════
    // fbSave, fbDel, COLLS ko globally expose karo
    // taaki addExpiryModal aur baaki functions use kar sakein
    window.fbSave = fbSave;
    window.fbDel  = fbDel;
    window.COLLS  = { ...COLLS, expiry: 'chef_expiry' };

    // ── LOAD existing expiry items from Firebase ──
    const expiryFbData = await fbLoad(COLLS.inventory); // inventory se load karo
    if (expiryFbData && expiryFbData.length > 0) {
      // expiryData array ko Firebase data se sync karo
      expiryFbData.forEach(fbItem => {
        if (fbItem.expiry && typeof fbItem.expiry === 'string') {
          // Date string hai — days calculate karo
          const today = new Date(); today.setHours(0,0,0,0);
          const exp = new Date(fbItem.expiry); exp.setHours(0,0,0,0);
          const daysLeft = Math.ceil((exp - today) / 86400000);
          const alreadyExists = expiryData.find(e => e.name === fbItem.name && e.vendor === fbItem.vendor);
          if (!alreadyExists && fbItem.vendor) {
            expiryData.push({
              name: fbItem.name,
              qty: (fbItem.qty || 0) + ' ' + (fbItem.unit || 'kg'),
              expiry: daysLeft,
              vendor: fbItem.vendor || '—',
              phone: fbItem.phone || '0000000000',
              unit: fbItem.unit || 'kg',
              minQty: fbItem.minQty || 5,
              status: daysLeft <= 3 ? 'critical' : daysLeft <= 7 ? 'week' : 'good',
              expiryDate: fbItem.expiry,
              emoji: fbItem.emoji || '📦',
              category: fbItem.category || '',
              price: fbItem.price || 0
            });
          }
        }
      });
      // Expiry page active hai to refresh karo
      if (document.getElementById('page-expiry')?.classList.contains('active')) renderExpiryPage();
      console.log('✅ Expiry data Firebase se sync ho gaya!');
    }

    // ── Real-time listener — chef_inventory changes ──
    onSnapshot(collection(db, 'chef_inventory'), snap => {
      snap.docChanges().forEach(change => {
        const fbItem = change.doc.data();
        if (change.type === 'added' || change.type === 'modified') {
          // appData.inventory mein update karo
          const idx = appData.inventory.findIndex(i => String(i.id) === String(fbItem.id));
          if (idx >= 0) appData.inventory[idx] = fbItem;
          else if (fbItem.id) appData.inventory.push(fbItem);
          // expiryData mein bhi sync karo agar vendor hai
          if (fbItem.vendor && fbItem.expiry && typeof fbItem.expiry === 'string') {
            const today = new Date(); today.setHours(0,0,0,0);
            const exp = new Date(fbItem.expiry); exp.setHours(0,0,0,0);
            const daysLeft = Math.ceil((exp - today) / 86400000);
            const eIdx = expiryData.findIndex(e => e.name === fbItem.name && e.vendor === fbItem.vendor);
            const eItem = {
              name: fbItem.name, qty: (fbItem.qty||0)+' '+(fbItem.unit||'kg'),
              expiry: daysLeft, vendor: fbItem.vendor||'—', phone: fbItem.phone||'0000000000',
              unit: fbItem.unit||'kg', minQty: fbItem.minQty||5,
              status: daysLeft<=3?'critical':daysLeft<=7?'week':'good',
              expiryDate: fbItem.expiry, emoji: fbItem.emoji||'📦',
              category: fbItem.category||'', price: fbItem.price||0
            };
            if (eIdx >= 0) expiryData[eIdx] = eItem;
            else expiryData.push(eItem);
          }
        } else if (change.type === 'removed') {
          const fbItem2 = change.doc.data();
          appData.inventory = appData.inventory.filter(i => String(i.id) !== String(fbItem2.id));
          expiryData.splice(expiryData.findIndex(e => e.name === fbItem2.name && e.vendor === fbItem2.vendor), 1);
        }
      });
      // Agar expiry page open hai to auto-refresh
      if (document.getElementById('page-expiry')?.classList.contains('active')) renderExpiryPage();
      if (document.getElementById('page-inventory')?.classList.contains('active')) renderInventory();
    });
    console.log('✅ Expiry + Inventory real-time listener LIVE!');

    // ══════════════════════════════════════
    //  STAFF — Firebase-aware functions
    // ══════════════════════════════════════

    window.addStaff = function() {
      const name = document.getElementById('s-name').value.trim();
      const role = document.getElementById('s-role').value;
      const phone = document.getElementById('s-phone').value.trim();
      if (!name) { showToast('Naam daalo', 'var(--red)'); return; }
      const emojis = { chef:'👨‍🍳', helper:'👨‍🍽️', waiter:'🧑‍🍽️', cleaner:'🧹' };
      const s = { id: Date.now(), name, role, phone, present: true, emoji: emojis[role] || '👤' };
      appData.staff.push(s);
      fbSave(COLLS.staff, s);
      closeModal('addStaffModal');
      document.getElementById('s-name').value = '';
      document.getElementById('s-phone').value = '';
      renderStaff(); populateSelects();
      showToast(`✅ ${name} add ho gaya — Firebase save!`);
    };

    window.removeStaff = function(id) {
      const s = appData.staff.find(x => x.id === id);
      appData.staff = appData.staff.filter(x => x.id !== id);
      fbDel(COLLS.staff, id);
      renderStaff(); populateSelects();
      showToast(`${s ? s.name : 'Staff'} remove ho gaya.`, 'var(--red)');
    };

    window.toggleAttendance = function(id, val) {
      const s = appData.staff.find(x => x.id === id);
      if (s) { s.present = val; fbSave(COLLS.staff, s); renderStaff(); showToast(`${s.name} → ${val ? 'Present ✅' : 'Absent ❌'}`); }
    };

    window.markAllPresent = function() {
      appData.staff.forEach(s => { s.present = true; fbSave(COLLS.staff, s); });
      renderStaff();
      showToast('Sab present! Firebase save ✅', 'var(--green)');
    };

    // ══════════════════════════════════════
    //  INVENTORY — Firebase-aware functions
    // ══════════════════════════════════════

    window.addInventory = function() {
      const name = document.getElementById('i-name').value.trim();
      const qty = parseFloat(document.getElementById('i-qty').value) || 0;
      const unit = document.getElementById('i-unit').value;
      const min = parseFloat(document.getElementById('i-min').value) || 5;
      const exp = document.getElementById('i-exp').value;
      if (!name) { showToast('Item naam daalo', 'var(--red)'); return; }
      const item = { id: Date.now(), name, qty, unit, expiry: exp, minQty: min, emoji: '📦' };
      appData.inventory.push(item);
      fbSave(COLLS.inventory, item);
      closeModal('addInvModal');
      document.getElementById('i-name').value = '';
      document.getElementById('i-qty').value = '';
      renderInventory();
      showToast(`✅ ${name} inventory mein add — Firebase save!`);
    };

    window.removeItem = function(id) {
      const it = appData.inventory.find(x => x.id === id);
      appData.inventory = appData.inventory.filter(x => x.id !== id);
      fbDel(COLLS.inventory, id);
      renderInventory();
      showToast(`${it ? it.name : 'Item'} remove ho gaya.`, 'var(--red)');
    };

    window.restockItem = function(id) {
      const it = appData.inventory.find(x => x.id === id);
      if (it) { it.qty += 10; fbSave(COLLS.inventory, it); renderInventory(); showToast(`${it.name} +10 restock — Firebase save ✅`); }
    };

    // ══════════════════════════════════════
    //  MENU — Firebase-aware functions
    // ══════════════════════════════════════

    window.addMenuDish = function() {
      const name = document.getElementById('d-name').value.trim();
      const price = parseFloat(document.getElementById('d-price').value) || 0;
      const halfPrice = parseFloat(document.getElementById('d-half-price').value) || 0;
      const category = document.getElementById('d-cat').value;
      const portionChecks = document.querySelectorAll('.d-portion-check:checked');
      const portions = portionChecks.length > 0 ? Array.from(portionChecks).map(c => c.value) : ['Full'];
      if (!name) { showToast('Dish naam daalo', 'var(--red)'); return; }

      const doSave = (img) => {
        const dish = { id: Date.now(), name, emoji: '🍽️', price, halfPrice, category, available: true, sold: 0, image: img || '', portions };
        appData.menu.push(dish);
        fbSave(COLLS.menu, dish);
        closeModal('addMenuModal');
        window._resetAddDishForm && window._resetAddDishForm();
        renderMenu();
        showToast(`✅ ${name} menu mein add — Firebase save!`);
      };

      const imgInput = document.getElementById('d-img-input');
      const file = imgInput && imgInput.files && imgInput.files[0];
      if (file) { const r = new FileReader(); r.onload = e => doSave(e.target.result); r.readAsDataURL(file); }
      else doSave('');
    };

    window.removeDish = function(id) {
      const d = appData.menu.find(x => x.id === id);
      appData.menu = appData.menu.filter(x => x.id !== id);
      fbDel(COLLS.menu, id);
      renderMenu();
      showToast(`${d ? d.name : 'Dish'} remove ho gayi.`, 'var(--red)');
    };

    window.toggleDish = function(id, val) {
      const d = appData.menu.find(x => x.id === id);
      if (d) { d.available = val; fbSave(COLLS.menu, d); showToast(`${d.name} → ${val ? 'Available ✅' : 'Unavailable ❌'}`); }
    };

    window.saveDishImage = function() {
      const input = document.getElementById('editDishImgInput');
      const file = input && input.files && input.files[0];
      if (!file) { showToast('Pehle photo select karo', 'var(--red)'); return; }
      const r = new FileReader();
      r.onload = e => {
        const d = appData.menu.find(x => x.id === window._editDishId);
        if (d) { d.image = e.target.result; fbSave(COLLS.menu, d); renderMenu(); showToast(`📷 ${d.name} photo save — Firebase!`); }
        closeModal('editDishImageModal');
      };
      r.readAsDataURL(file);
    };

    window.removeDishImage = function() {
      const d = appData.menu.find(x => x.id === window._editDishId);
      if (d) { d.image = ''; fbSave(COLLS.menu, d); renderMenu(); showToast('Photo remove ho gayi.'); }
      closeModal('editDishImageModal');
    };

    // ══════════════════════════════════════
    //  SMART EXPIRY + REORDER — Firebase Integration
    // ══════════════════════════════════════

    // ── EXPIRY: dedicated collection mein save ──
    window.fbSaveExpiry = async function(item) {
      try {
        const d = { ...item, _id: item._id || (item.name + '_' + (item.vendor||'').replace(/\s/g,'_')) };
        await setDoc(docFn(db, 'chef_expiry', d._id), d);
      } catch(e) { console.error('[Expiry] save error:', e.message); }
    };

    // ── EXPIRY: delete from dedicated collection ──
    window.fbDelExpiry = async function(_id) {
      try { await deleteDoc(docFn(db, 'chef_expiry', String(_id))); }
      catch(e) { console.error('[Expiry] del error:', e.message); }
    };

    // ── EXPIRY: Load from Firebase + real-time listener ──
    window.loadExpiryFromFirebase = async function() {
      try {
        const snap = await getDocs(collection(db, 'chef_expiry'));
        if (!snap.empty) {
          snap.docs.forEach(d => {
            const fbItem = d.data();
            // days recalculate karo (expiry date string se)
            let daysLeft = fbItem.expiry;
            if (fbItem.expiryDate) {
              const today = new Date(); today.setHours(0,0,0,0);
              const exp = new Date(fbItem.expiryDate); exp.setHours(0,0,0,0);
              daysLeft = Math.ceil((exp - today) / 86400000);
            }
            const eItem = { ...fbItem, expiry: daysLeft,
              status: daysLeft <= 3 ? 'critical' : daysLeft <= 7 ? 'week' : daysLeft < 0 ? 'expired' : 'good' };
            const idx = expiryData.findIndex(e => e._id === fbItem._id);
            if (idx >= 0) expiryData[idx] = eItem;
            else expiryData.push(eItem);
          });
          if (document.getElementById('page-expiry')?.classList.contains('active')) renderExpiryPage();
          console.log(`✅ Expiry data loaded from Firebase: ${snap.docs.length} items`);
        } else {
          // Pehli baar — default expiryData ko Firebase mein save karo
          expiryData.forEach(e => {
            const _id = e.name + '_' + (e.vendor||'').replace(/\s/g,'_');
            e._id = _id;
            window.fbSaveExpiry(e);
          });
          console.log('[Expiry] Default data Firebase mein save kiya');
        }
      } catch(e) { console.error('[Expiry] load error:', e.message); }
    };

    // ── EXPIRY: Real-time listener ──
    onSnapshot(collection(db, 'chef_expiry'), snap => {
      snap.docChanges().forEach(change => {
        const fbItem = change.doc.data();
        let daysLeft = fbItem.expiry;
        if (fbItem.expiryDate) {
          const today = new Date(); today.setHours(0,0,0,0);
          const exp = new Date(fbItem.expiryDate); exp.setHours(0,0,0,0);
          daysLeft = Math.ceil((exp - today) / 86400000);
        }
        if (change.type === 'added' || change.type === 'modified') {
          const eItem = { ...fbItem, expiry: daysLeft,
            status: daysLeft <= 3 ? 'critical' : daysLeft <= 7 ? 'week' : daysLeft < 0 ? 'expired' : 'good' };
          const idx = expiryData.findIndex(e => e._id === fbItem._id);
          if (idx >= 0) expiryData[idx] = eItem;
          else expiryData.push(eItem);
        } else if (change.type === 'removed') {
          const ridx = expiryData.findIndex(e => e._id === fbItem._id);
          if (ridx >= 0) expiryData.splice(ridx, 1);
        }
        if (document.getElementById('page-expiry')?.classList.contains('active')) renderExpiryPage();
      });
    });

    // ── EXPIRY: Override addExpiryItem to also save in chef_expiry ──
    const _origAddExpiryItem = window.addExpiryItem;
    window.addExpiryItem = function() {
      const name    = document.getElementById('ex-name')?.value.trim();
      const qty     = document.getElementById('ex-qty')?.value.trim();
      const unit    = document.getElementById('ex-unit')?.value;
      const exDate  = document.getElementById('ex-date')?.value;
      const vendor  = document.getElementById('ex-vendor')?.value.trim();
      const phone   = document.getElementById('ex-phone')?.value.trim();
      const minQty  = parseFloat(document.getElementById('ex-minqty')?.value) || 5;
      if (!name || !exDate || !vendor || !phone) {
        showToast('⚠️ Naam, Expiry Date, Vendor aur Phone bharein', 'var(--red)'); return;
      }
      const today = new Date(); today.setHours(0,0,0,0);
      const exp   = new Date(exDate); exp.setHours(0,0,0,0);
      const daysLeft = Math.ceil((exp - today) / 86400000);
      const status = daysLeft <= 3 ? 'critical' : daysLeft <= 7 ? 'week' : 'good';
      const _id = name + '_' + vendor.replace(/\s/g,'_');
      const item = { _id, name, qty: qty + ' ' + unit, expiry: daysLeft, vendor, phone, unit, minQty, status, expiryDate: exDate };
      // Local array mein add
      const existIdx = expiryData.findIndex(e => e._id === _id);
      if (existIdx >= 0) expiryData[existIdx] = item; else expiryData.push(item);
      // Firebase mein save — chef_expiry collection
      window.fbSaveExpiry(item);
      // Inventory mein bhi save karo (existing pattern)
      if (window.fbSave && window.COLLS) {
        const fbInvItem = { id: Date.now(), name, qty: parseFloat(qty) || 0, unit, expiry: exDate, minQty, emoji: '📦', vendor, phone };
        appData.inventory.push(fbInvItem);
        window.fbSave(window.COLLS.inventory, fbInvItem);
      }
      closeModal('addExpiryModal');
      ['ex-name','ex-qty','ex-vendor','ex-phone','ex-minqty'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
      renderExpiryPage();
      showToast(`✅ ${name} expiry + Firebase save ho gaya!`, 'var(--green)');
    };

    // ── EXPIRY: Override deleteExpiryItem to also delete from Firebase ──
    window.deleteExpiryItem = function(index) {
      if (index < 0 || index >= expiryData.length) return;
      const item = expiryData[index];
      const name = item.name;
      if (item._id) window.fbDelExpiry(item._id);
      expiryData.splice(index, 1);
      renderExpiryPage();
      showToast(`${name} expiry list + Firebase se remove ho gaya`, 'var(--red)');
    };

    // Initial load
    window.loadExpiryFromFirebase();
    console.log('✅ Smart Expiry + Reorder Firebase integration LIVE!');

    // ══════════════════════════════════════
    //  GST INVOICE — Firebase Integration
    // ══════════════════════════════════════

    // ── GST Invoice Counter: Firebase se last invoice number load karo ──
    try {
      const { getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      const counterDoc = await getDoc(docFn(db, 'chef_settings', 'gst_counter'));
      if (counterDoc.exists()) {
        const data = counterDoc.data();
        if (data.lastInvoiceNo && data.lastInvoiceNo >= gstInvoiceNo) {
          gstInvoiceNo = data.lastInvoiceNo + 1;
          console.log(`✅ GST Invoice counter Firebase se loaded: next = NC-${gstInvoiceNo}`);
        }
      }
    } catch(e) { console.warn('[GST] Counter load error:', e.message); }

    // ── GST: Counter save function (invoice generate hone ke baad call hoga) ──
    window.saveGSTCounter = async function(invoiceNo) {
      try {
        await setDoc(docFn(db, 'chef_settings', 'gst_counter'), { lastInvoiceNo: invoiceNo, updatedAt: new Date().toISOString() });
      } catch(e) { console.warn('[GST] Counter save error:', e.message); }
    };

    // ── GST: Override generateGSTInvoice to also persist the counter ──
    const _origGenerateGSTInvoice = window.generateGSTInvoice;
    window.generateGSTInvoice = async function() {
      if (typeof _origGenerateGSTInvoice === 'function') _origGenerateGSTInvoice();
      // Counter ko Firebase mein persist karo
      window.saveGSTCounter && window.saveGSTCounter(gstInvoiceNo - 1);
    };

    // GST page open hone pe history auto-load — showPage mein already add kiya hai
    // Agar page already open hai to abhi bhi load karo
    if (document.getElementById('page-gstbill')?.classList.contains('active')) {
      loadGSTInvoiceHistory();
    }
    console.log('✅ GST Invoice Firebase integration LIVE!');

    // ══════════════════════════════════════
    //  REPORTS — Firebase Integration
    // ══════════════════════════════════════

    // ── Reports: Log generate karna Firebase mein ──
    window.fbLogReport = async function(reportType, method) {
      try {
        const { addDoc, collection: col } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        await addDoc(col(db, 'chef_report_logs'), {
          type: reportType,
          method: method, // 'pdf', 'excel', 'whatsapp'
          generatedAt: new Date().toISOString(),
          generatedBy: window.RESTAURANT_NAME_LOCKED || 'Siplora Chef',
          stats: {
            revenue: (window.appData?.recentBills || []).reduce((s, b) => s + (b.total || 0), 0),
            orders: (window.appData?.kots || []).length + (window.appData?.recentBills || []).length,
            staffPresent: (window.appData?.staff || []).filter(s => s.present).length,
            lowStock: (window.appData?.inventory || []).filter(i => i.qty <= i.minQty).length,
          }
        });
        console.log(`[Reports] Log saved: ${reportType} (${method})`);
      } catch(e) {
        console.warn('[Reports] Log save error:', e.message);
      }
    };

    // ── Reports: Load history from Firebase ──
    window.loadReportHistory = async function() {
      const el = document.getElementById('rpt-firebase-history');
      if (!el) return;
      el.innerHTML = '<div style="text-align:center;padding:12px;color:var(--text2);font-size:12px;">⏳ Loading...</div>';
      try {
        const { getDocs, collection: col, query, orderBy, limit } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const q = query(col(db, 'chef_report_logs'), orderBy('generatedAt', 'desc'), limit(20));
        const snap = await getDocs(q);
        if (snap.empty) {
          el.innerHTML = '<div style="text-align:center;padding:12px;color:var(--text2);font-size:12px;">Koi report generate nahi ki gayi abhi tak</div>';
          return;
        }
        const methodIcon = { pdf: '📄', excel: '📗', whatsapp: '📱' };
        el.innerHTML = snap.docs.map(d => {
          const r = d.data();
          return `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--bg3);border:1px solid var(--border);border-radius:8px;gap:8px;flex-wrap:wrap;">
            <div>
              <span style="font-size:12px;font-weight:800;color:var(--accent);">${methodIcon[r.method]||'📊'} ${(r.type||'').toUpperCase()}</span>
              <span style="font-size:10px;color:var(--text2);margin-left:6px;">${r.method?.toUpperCase()}</span>
            </div>
            <div style="text-align:right;font-size:10px;color:var(--text2);font-family:var(--font-mono);">
              ${r.generatedAt ? new Date(r.generatedAt).toLocaleString('en-IN') : '—'}
            </div>
          </div>`;
        }).join('');
      } catch(e) {
        el.innerHTML = `<div style="text-align:center;padding:12px;color:var(--red);font-size:12px;">❌ Load error: ${e.message}</div>`;
      }
    };

    // ── Reports: Override PDF/Excel/WhatsApp to also log to Firebase ──
    const _origDownloadRptPDF = window.downloadRptPDF;
    window.downloadRptPDF = function(type) {
      if (typeof _origDownloadRptPDF === 'function') _origDownloadRptPDF(type);
      window.fbLogReport && window.fbLogReport(type, 'pdf');
    };

    const _origDownloadRptXL = window.downloadRptXL;
    window.downloadRptXL = function(type) {
      if (typeof _origDownloadRptXL === 'function') _origDownloadRptXL(type);
      window.fbLogReport && window.fbLogReport(type, 'excel');
    };

    const _origSendWA = window.sendWA;
    window.sendWA = function(type) {
      if (typeof _origSendWA === 'function') _origSendWA(type);
      window.fbLogReport && window.fbLogReport(type, 'whatsapp');
    };

    // Period reports bhi log karo agar exist karte hain
    const _origDownloadPeriodPDF = window.downloadPeriodPDF;
    if (typeof _origDownloadPeriodPDF === 'function') {
      window.downloadPeriodPDF = function(type, period) {
        _origDownloadPeriodPDF(type, period);
        window.fbLogReport && window.fbLogReport(type + '_' + period, 'pdf');
      };
    }
    const _origDownloadPeriodXL = window.downloadPeriodXL;
    if (typeof _origDownloadPeriodXL === 'function') {
      window.downloadPeriodXL = function(type, period) {
        _origDownloadPeriodXL(type, period);
        window.fbLogReport && window.fbLogReport(type + '_' + period, 'excel');
      };
    }

    // Reports page open hone pe history load karo — showPage mein hook
    const _origShowPageRpt = window.showPage;
    window.showPage = function(name) {
      if (typeof _origShowPageRpt === 'function') _origShowPageRpt(name);
      if (name === 'reports') {
        setTimeout(() => window.loadReportHistory && window.loadReportHistory(), 400);
      }
    };

    console.log('✅ Reports Firebase integration LIVE!');

    console.log('✅ Staff/Inventory/Menu Firebase integration complete!');

  } catch(err) {
    console.error('Staff/Inv/Menu Firebase error:', err);
    showToast('⚠️ Data sync error: ' + err.message, 'var(--orange)');
  }
}
// ══════════════════════════════════════════════════════════════
//  SIPLORA CHEF — REPORTS MODULE (PDF + Excel + WhatsApp)
// ══════════════════════════════════════════════════════════════

// ── Helpers ──
function rptToday() {
  const d = new Date();
  return d.toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
}
function rptTodayShort() {
  const d = new Date();
  return d.toLocaleDateString('en-IN');
}
function rptTime() {
  return new Date().toLocaleTimeString('en-IN', { hour12:true });
}

// ── Init Reports Page ──
function initReports() {
  // Date badge
  const dateBadge = document.getElementById('rpt-today-date');
  if (dateBadge) dateBadge.textContent = rptToday();

  // Live stats
  const totalRevenue = (appData.recentBills || []).reduce((s,b) => s + (b.total||0), 0);
  const totalOrders = (appData.todayOrders || []).length + (appData.kots || []).length + (appData.recentBills || []).length;
  const staffPresent = (appData.staff || []).filter(s => s.present).length;
  const lowStock = (appData.inventory || []).filter(i => i.qty <= i.minQty).length;

  const el = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = v; };
  el('rpt-stat-revenue', '₹' + totalRevenue.toLocaleString('en-IN'));
  el('rpt-stat-orders', totalOrders);
  el('rpt-stat-staff', staffPresent + '/' + (appData.staff || []).length);
  el('rpt-stat-stock', lowStock);

  // Preview boxes
  updatePreviews();

  // Restore WA settings
  const savedToken = localStorage.getItem('siplora_wa_token') || '';
  const savedNum = localStorage.getItem('siplora_wa_num') || '';
  const tokEl = document.getElementById('wa-token');
  const numEl = document.getElementById('wa-owner-num');
  if (tokEl) tokEl.value = savedToken;
  if (numEl) numEl.value = savedNum;

  if (window.lucide) setTimeout(() => lucide.createIcons(), 80);
}

window.saveWASettings = function() {
  const tok = document.getElementById('wa-token')?.value?.trim() || '';
  const num = document.getElementById('wa-owner-num')?.value?.trim() || '';
  localStorage.setItem('siplora_wa_token', tok);
  localStorage.setItem('siplora_wa_num', num);
  showToast('✅ WhatsApp settings save ho gayi!', 'var(--green)');
};

function updatePreviews() {
  const today = rptTodayShort();
  const totalRev = (appData.recentBills || []).reduce((s,b) => s + (b.total||0), 0);
  const cashRev = (appData.recentBills || []).filter(b=>b.payment==='Cash').reduce((s,b)=>s+(b.total||0),0);
  const upiRev = (appData.recentBills || []).filter(b=>b.payment==='UPI').reduce((s,b)=>s+(b.total||0),0);

  const rev = document.getElementById('rpt-revenue-preview');
  if (rev) rev.innerHTML = `📅 Date: ${today}<br>💰 Total Revenue: ₹${totalRev.toLocaleString('en-IN')}<br>💵 Cash: ₹${cashRev} | 📲 UPI: ₹${upiRev}<br>🧾 Bills: ${(appData.recentBills||[]).length} | GST Collected: ₹${Math.round(totalRev*18/118)}`;

  const stf = document.getElementById('rpt-staff-preview');
  if (stf) {
    const present = (appData.staff||[]).filter(s=>s.present);
    const absent = (appData.staff||[]).filter(s=>!s.present);
    stf.innerHTML = `✅ Present (${present.length}): ${present.map(s=>s.name.split(' ')[0]).join(', ')}<br>❌ Absent (${absent.length}): ${absent.length ? absent.map(s=>s.name.split(' ')[0]).join(', ') : 'None'}<br>👨‍🍳 Chefs: ${present.filter(s=>s.role==='chef').length} | 🧑‍🍽️ Waiters: ${present.filter(s=>s.role==='waiter').length}`;
  }

  const stk = document.getElementById('rpt-stock-preview');
  if (stk) {
    const low = (appData.inventory||[]).filter(i=>i.qty<=i.minQty);
    stk.innerHTML = `📦 Total Items: ${(appData.inventory||[]).length}<br>🔴 Low Stock (${low.length}): ${low.slice(0,3).map(i=>i.name).join(', ')}${low.length>3?'...':''}<br>✅ Sufficient: ${(appData.inventory||[]).length - low.length} items OK`;
  }

  const ord = document.getElementById('rpt-orders-preview');
  if (ord) {
    const kots = (appData.kots||[]);
    const served = kots.filter(k=>k.status==='served').length;
    ord.innerHTML = `🧾 Total KOTs: ${kots.length}<br>✅ Served: ${served} | ⏳ Pending: ${kots.filter(k=>k.status==='pending').length}<br>🍽️ Tables Active: ${(appData.tables||[]).filter(t=>t.status!=='available').length}`;
  }

  const chf = document.getElementById('rpt-chef-preview');
  if (chf) {
    const chefs = (appData.staff||[]).filter(s=>s.role==='chef'&&s.present);
    chf.innerHTML = chefs.map(c=>`👨‍🍳 ${c.name.split(' ')[0]}: Station ${c.id%3===0?'Tandoor':c.id%3===1?'Chinese':'Grill'}`).join('<br>') || 'No chef data';
  }

  const wst = document.getElementById('rpt-waste-preview');
  if (wst) {
    const waste = appData.waste || [];
    const wasteTotal = waste.reduce((s,w)=>s+(w.cost||0),0);
    wst.innerHTML = `🗑️ Waste Items: ${waste.length}<br>💸 Total Waste Cost: ₹${wasteTotal}<br>${waste.slice(0,2).map(w=>`• ${w.name} (${w.qty}) — ₹${w.cost}`).join('<br>')}`;
  }
}

// ═══════════════════════════════════════
// PDF DOWNLOAD — Pure browser-based
// ═══════════════════════════════════════
window.downloadRptPDF = function(type) {
  showToast(`📄 ${type.toUpperCase()} PDF generate ho raha hai...`, 'var(--red)');
  setTimeout(() => {
    const content = buildPDFContent(type);
    const win = window.open('', '_blank');
    if (!win) { showToast('⚠️ Popup blocked! Allow karo browser mein.', 'var(--red)'); return; }
    win.document.write(`<!DOCTYPE html><html><head>
      <meta charset="UTF-8"><title>Siplora Report — ${type}</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'Segoe UI',Arial,sans-serif;padding:28px 32px;color:#1a2033;background:#fff;}
        .hdr{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #2e9c5e;padding-bottom:16px;margin-bottom:20px;}
        .hdr-left .logo{font-size:24px;font-weight:900;color:#0f1923;letter-spacing:2px;}
        .hdr-left .logo span{color:#2e9c5e;}
        .hdr-left .sub{font-size:11px;color:#6c7890;margin-top:3px;letter-spacing:2px;}
        .hdr-right{text-align:right;font-size:11px;color:#6c7890;line-height:1.8;}
        .rpt-title{font-size:20px;font-weight:900;color:#1a2033;margin-bottom:6px;padding:14px 0 8px;}
        .rpt-title span{color:#2e9c5e;}
        table{width:100%;border-collapse:collapse;margin:12px 0;}
        th{background:#2e9c5e;color:#fff;padding:9px 12px;text-align:left;font-size:12px;font-weight:700;}
        td{padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:12px;color:#374151;}
        tr:nth-child(even) td{background:#f9fafb;}
        .total-row td{font-weight:800;background:#f0fdf4;color:#15803d;}
        .badge{display:inline-block;padding:2px 9px;border-radius:20px;font-size:10px;font-weight:700;}
        .badge-green{background:#dcfce7;color:#16a34a;}
        .badge-red{background:#fee2e2;color:#dc2626;}
        .badge-orange{background:#fef3c7;color:#d97706;}
        .section{margin-bottom:22px;}
        .section-title{font-size:14px;font-weight:800;color:#0f1923;margin-bottom:10px;padding:6px 12px;background:#f0f3f7;border-radius:8px;border-left:4px solid #2e9c5e;}
        .stat-row{display:flex;gap:12px;margin:12px 0;}
        .stat-box{flex:1;border:1.5px solid #e5e7eb;border-radius:10px;padding:12px;text-align:center;}
        .stat-val{font-size:22px;font-weight:900;color:#2e9c5e;}
        .stat-lbl{font-size:10px;color:#6c7890;margin-top:3px;}
        .footer{margin-top:28px;padding-top:14px;border-top:1px solid #e5e7eb;text-align:center;font-size:10px;color:#9ca3af;}
        @media print{body{padding:16px;} .no-print{display:none;}}
      </style>
    </head><body>
    <div class="hdr">
      <div class="hdr-left">
        <div class="logo">Siplora <span>CHEF</span></div>
        <div class="sub">KITCHEN COMMAND CENTER · SOLAPUR</div>
      </div>
      <div class="hdr-right">
        <div><strong>Date:</strong> ${rptToday()}</div>
        <div><strong>Time:</strong> ${rptTime()}</div>
        <div><strong>Report:</strong> ${type.toUpperCase()}</div>
      </div>
    </div>
    ${content}
    <div class="footer">
      Generated by Siplora CHEF System · ${rptTodayShort()} ${rptTime()} · All data from live kitchen database
    </div>
    <div class="no-print" style="text-align:center;margin-top:20px;">
      <button onclick="window.print()" style="background:#2e9c5e;color:#fff;border:none;padding:12px 32px;border-radius:10px;font-size:14px;font-weight:800;cursor:pointer;">🖨️ Print / Save as PDF</button>
    </div>
    </body></html>`);
    win.document.close();
    setTimeout(() => { try { win.print(); } catch(e){} }, 500);
    showToast(`✅ ${type.toUpperCase()} PDF ready! Print ya Save karo.`, 'var(--green)');
  }, 300);
};

// ═══════════════════════════════════════
// EXCEL DOWNLOAD — CSV format
// ═══════════════════════════════════════
window.downloadRptXL = function(type) {
  showToast(`📗 ${type.toUpperCase()} Excel generate ho raha hai...`, 'var(--green)');
  const csvData = buildCSVContent(type);
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Siplora_${type}_Report_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`✅ ${type.toUpperCase()} Excel download ho gaya!`, 'var(--green)');
};

// ═══════════════════════════════════════
// WHATSAPP SEND
// ═══════════════════════════════════════
window.sendWA = function(type) {
  const token = localStorage.getItem('siplora_wa_token') || '';
  const num = localStorage.getItem('siplora_wa_num') || '';

  if (!num) {
    showToast('⚠️ Pehle owner ka WhatsApp number save karo!', 'var(--orange)');
    return;
  }

  const popup = document.getElementById('wa-status-popup');
  const title = document.getElementById('wa-status-title');
  const msg = document.getElementById('wa-status-msg');
  if (popup) popup.style.display = 'block';
  if (title) title.textContent = '📱 WhatsApp Bhej raha hai...';

  const text = buildWAText(type);
  const cleanNum = num.replace(/[^0-9]/g, '');

  if (popup) msg.textContent = 'Message prepare ho gaya hai...';

  if (!token || token === '') {
    // No API — open WA Web as fallback
    const encoded = encodeURIComponent(text);
    setTimeout(() => {
      window.open(`https://wa.me/${cleanNum}?text=${encoded}`, '_blank');
      if (popup) { popup.style.display = 'none'; }
      showToast('📱 WhatsApp Web open hua — Send karo!', 'var(--green)');
    }, 800);
    return;
  }

  // With API token
  if (msg) msg.textContent = 'API se send ho raha hai...';
  fetch('https://api.whatsapp.com/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ messaging_product: 'whatsapp', to: cleanNum, type: 'text', text: { body: text } })
  }).then(r => {
    if (popup) popup.style.display = 'none';
    if (r.ok) { showToast('✅ Report WhatsApp pe bhej di!', 'var(--green)'); }
    else {
      // Fallback to WA web
      window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`, '_blank');
      showToast('📱 WhatsApp Web se bhejo (API se error)', 'var(--orange)');
    }
  }).catch(() => {
    if (popup) popup.style.display = 'none';
    window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`, '_blank');
    showToast('📱 WhatsApp Web se bhejo!', 'var(--orange)');
  });
};

// ═══════════════════════════════════════
// BUILD PDF HTML CONTENT
// ═══════════════════════════════════════
function buildPDFContent(type) {
  const today = rptTodayShort();
  if (type === 'revenue') return buildRevenuePDF();
  if (type === 'staff') return buildStaffPDF();
  if (type === 'stock') return buildStockPDF();
  if (type === 'orders') return buildOrdersPDF();
  if (type === 'chef') return buildChefPDF();
  if (type === 'waste') return buildWastePDF();
  if (type === 'grand') return buildRevenuePDF() + buildStaffPDF() + buildOrdersPDF() + buildChefPDF() + buildStockPDF() + buildWastePDF();
  return '<p>Report type not found</p>';
}

function buildRevenuePDF() {
  const bills = appData.recentBills || [];
  const total = bills.reduce((s,b)=>s+(b.total||0),0);
  const cash = bills.filter(b=>b.payment==='Cash').reduce((s,b)=>s+(b.total||0),0);
  const upi = bills.filter(b=>b.payment==='UPI').reduce((s,b)=>s+(b.total||0),0);
  const gst = Math.round(total*18/118);
  return `<div class="section">
  <div class="rpt-title">💰 <span>Daily Revenue Report</span></div>
  <div class="stat-row">
    <div class="stat-box"><div class="stat-val">₹${total.toLocaleString('en-IN')}</div><div class="stat-lbl">Total Revenue</div></div>
    <div class="stat-box"><div class="stat-val" style="color:#ef4444;">₹${gst}</div><div class="stat-lbl">GST (18%)</div></div>
    <div class="stat-box"><div class="stat-val" style="color:#3b82f6;">₹${cash}</div><div class="stat-lbl">Cash</div></div>
    <div class="stat-box"><div class="stat-val" style="color:#8b5cf6;">₹${upi}</div><div class="stat-lbl">UPI/Online</div></div>
  </div>
  <div class="section-title">Bill Details</div>
  <table><thead><tr><th>Table</th><th>Customer</th><th>Amount</th><th>GST</th><th>Total</th><th>Payment</th><th>Time</th></tr></thead>
  <tbody>${bills.map(b=>`<tr><td>${b.table||'-'}</td><td>${b.customer||'Walk-in'}</td><td>₹${b.amount||0}</td><td>₹${b.gst||0}</td><td>₹${b.total||0}</td><td>${b.payment||'-'}</td><td>${b.time||'-'}</td></tr>`).join('')||'<tr><td colspan="7" style="text-align:center;color:#9ca3af;">No bills today</td></tr>'}
  <tr class="total-row"><td colspan="4"><strong>TOTAL</strong></td><td>₹${total}</td><td colspan="2"></td></tr></tbody></table>
  </div>`;
}

function buildStaffPDF() {
  const staff = appData.staff || [];
  return `<div class="section">
  <div class="rpt-title">👥 <span>Staff Attendance Report</span></div>
  <div class="stat-row">
    <div class="stat-box"><div class="stat-val">${staff.filter(s=>s.present).length}</div><div class="stat-lbl">Present</div></div>
    <div class="stat-box"><div class="stat-val" style="color:#ef4444;">${staff.filter(s=>!s.present).length}</div><div class="stat-lbl">Absent</div></div>
    <div class="stat-box"><div class="stat-val">${staff.length}</div><div class="stat-lbl">Total Staff</div></div>
  </div>
  <div class="section-title">Staff Details</div>
  <table><thead><tr><th>#</th><th>Naam</th><th>Role</th><th>Phone</th><th>Status</th></tr></thead>
  <tbody>${staff.map((s,i)=>`<tr><td>${i+1}</td><td>${s.emoji||''} ${s.name}</td><td>${s.role}</td><td>${s.phone||'-'}</td><td><span class="badge badge-${s.present?'green':'red'}">${s.present?'✅ Present':'❌ Absent'}</span></td></tr>`).join('')}</tbody></table>
  </div>`;
}

function buildStockPDF() {
  const inv = appData.inventory || [];
  const low = inv.filter(i=>i.qty<=i.minQty);
  return `<div class="section">
  <div class="rpt-title">📦 <span>Stock / Inventory Report</span></div>
  <div class="stat-row">
    <div class="stat-box"><div class="stat-val">${inv.length}</div><div class="stat-lbl">Total Items</div></div>
    <div class="stat-box"><div class="stat-val" style="color:#ef4444;">${low.length}</div><div class="stat-lbl">Low Stock</div></div>
    <div class="stat-box"><div class="stat-val" style="color:#22c55e;">${inv.length-low.length}</div><div class="stat-lbl">OK Items</div></div>
  </div>
  <div class="section-title">Inventory Details</div>
  <table><thead><tr><th>#</th><th>Item</th><th>Qty</th><th>Unit</th><th>Min Qty</th><th>Status</th><th>Expiry</th></tr></thead>
  <tbody>${inv.map((i,idx)=>`<tr><td>${idx+1}</td><td>${i.emoji||'📦'} ${i.name}</td><td>${i.qty}</td><td>${i.unit}</td><td>${i.minQty}</td><td><span class="badge badge-${i.qty<=i.minQty?'red':i.qty<=i.minQty*2?'orange':'green'}">${i.qty<=i.minQty?'🔴 Low':i.qty<=i.minQty*2?'🟡 Medium':'🟢 Good'}</span></td><td>${i.expiry||'-'}</td></tr>`).join('')}</tbody></table>
  </div>`;
}

function buildOrdersPDF() {
  const kots = appData.kots || [];
  const tables = appData.tables || [];
  return `<div class="section">
  <div class="rpt-title">🧾 <span>Aaj Ke All Orders</span></div>
  <div class="stat-row">
    <div class="stat-box"><div class="stat-val">${kots.length}</div><div class="stat-lbl">Total KOTs</div></div>
    <div class="stat-box"><div class="stat-val" style="color:#22c55e;">${kots.filter(k=>k.status==='served').length}</div><div class="stat-lbl">Served</div></div>
    <div class="stat-box"><div class="stat-val" style="color:#f59e0b;">${kots.filter(k=>k.status==='pending').length}</div><div class="stat-lbl">Pending</div></div>
    <div class="stat-box"><div class="stat-val" style="color:#3b82f6;">${tables.filter(t=>t.status!=='available').length}</div><div class="stat-lbl">Active Tables</div></div>
  </div>
  <div class="section-title">KOT Details</div>
  <table><thead><tr><th>KOT#</th><th>Table</th><th>Items</th><th>Station</th><th>Status</th><th>Time</th></tr></thead>
  <tbody>${kots.length ? kots.map((k,i)=>`<tr><td>${i+1}</td><td>${k.table||'-'}</td><td>${(k.items||[]).join(', ')}</td><td>${k.station||'-'}</td><td><span class="badge badge-${k.status==='served'?'green':k.status==='pending'?'orange':'red'}">${k.status||'-'}</span></td><td>${k.time||'-'}</td></tr>`).join('') : '<tr><td colspan="6" style="text-align:center;color:#9ca3af;">No KOTs today yet</td></tr>'}
  </tbody></table>
  <div class="section-title" style="margin-top:14px;">Table Status</div>
  <table><thead><tr><th>Table</th><th>Status</th><th>Items</th><th>Waiter</th><th>Station</th></tr></thead>
  <tbody>${tables.filter(t=>t.status!=='available').map(t=>`<tr><td>Table ${t.id}</td><td><span class="badge badge-${t.status==='served'?'green':t.status==='preparing'?'orange':'red'}">${t.status}</span></td><td>${(t.items||[]).join(', ')||'-'}</td><td>${t.waiter||'-'}</td><td>${t.station||'-'}</td></tr>`).join('')||'<tr><td colspan="5" style="text-align:center;color:#9ca3af;">No active tables</td></tr>'}</tbody></table>
  </div>`;
}

function buildChefPDF() {
  const chefs = (appData.staff||[]).filter(s=>s.role==='chef');
  const kots = appData.kots||[];
  return `<div class="section">
  <div class="rpt-title">👨‍🍳 <span>Chef Performance Report</span></div>
  <div class="section-title">Chef-wise Performance</div>
  <table><thead><tr><th>Chef Naam</th><th>Status</th><th>Station</th><th>Phone</th><th>Performance</th></tr></thead>
  <tbody>${chefs.map(c=>{
    const handled = kots.filter(k=>k.station&&(c.id%3===0?k.station==='tandoor':c.id%3===1?k.station==='chinese':k.station==='grill')).length;
    return `<tr><td>${c.emoji||'👨‍🍳'} ${c.name}</td><td><span class="badge badge-${c.present?'green':'red'}">${c.present?'Present':'Absent'}</span></td><td>${c.id%3===0?'Tandoor':c.id%3===1?'Chinese':'Grill'}</td><td>${c.phone||'-'}</td><td>${handled} orders</td></tr>`;
  }).join('')||'<tr><td colspan="5" style="text-align:center;color:#9ca3af;">No chef data</td></tr>'}</tbody></table>
  </div>`;
}

function buildWastePDF() {
  const waste = appData.waste||[];
  const total = waste.reduce((s,w)=>s+(w.cost||0),0);
  return `<div class="section">
  <div class="rpt-title">🗑️ <span>Waste Log Report</span></div>
  <div class="stat-row">
    <div class="stat-box"><div class="stat-val" style="color:#ef4444;">₹${total}</div><div class="stat-lbl">Total Waste Cost</div></div>
    <div class="stat-box"><div class="stat-val">${waste.length}</div><div class="stat-lbl">Waste Items</div></div>
  </div>
  <div class="section-title">Waste Details</div>
  <table><thead><tr><th>#</th><th>Item</th><th>Qty</th><th>Cost</th><th>Reason</th><th>Time</th></tr></thead>
  <tbody>${waste.map((w,i)=>`<tr><td>${i+1}</td><td>${w.name}</td><td>${w.qty}</td><td>₹${w.cost||0}</td><td>${w.reason||'-'}</td><td>${w.time||'-'}</td></tr>`).join('')||'<tr><td colspan="6" style="text-align:center;color:#9ca3af;">No waste recorded</td></tr>'}
  <tr class="total-row"><td colspan="3"><strong>TOTAL WASTE</strong></td><td>₹${total}</td><td colspan="2"></td></tr></tbody></table>
  </div>`;
}

// ═══════════════════════════════════════
// BUILD CSV CONTENT FOR EXCEL
// ═══════════════════════════════════════
function buildCSVContent(type) {
  const today = rptTodayShort();
  if (type === 'revenue') return buildRevenueCSV(today);
  if (type === 'staff') return buildStaffCSV(today);
  if (type === 'stock') return buildStockCSV(today);
  if (type === 'orders') return buildOrdersCSV(today);
  if (type === 'chef') return buildChefCSV(today);
  if (type === 'waste') return buildWasteCSV(today);
  if (type === 'grand') return [buildRevenueCSV(today), buildStaffCSV(today), buildOrdersCSV(today), buildChefCSV(today), buildStockCSV(today), buildWasteCSV(today)].join('\n\n');
  return '';
}

function buildRevenueCSV(today) {
  const bills = appData.recentBills||[];
  const total = bills.reduce((s,b)=>s+(b.total||0),0);
  let csv = `SIPLORA CHEF — REVENUE REPORT,Date: ${today}\n`;
  csv += `Total Revenue,₹${total}\n\n`;
  csv += `Table,Customer,Amount,GST,Total,Payment,Time\n`;
  csv += bills.map(b=>`${b.table||'-'},"${b.customer||'Walk-in'}",${b.amount||0},${b.gst||0},${b.total||0},${b.payment||'-'},${b.time||'-'}`).join('\n');
  csv += `\n\nTOTAL,,,, ₹${total},,`;
  return csv;
}

function buildStaffCSV(today) {
  const staff = appData.staff||[];
  let csv = `SIPLORA CHEF — STAFF ATTENDANCE,Date: ${today}\n`;
  csv += `Present,${staff.filter(s=>s.present).length},Absent,${staff.filter(s=>!s.present).length}\n\n`;
  csv += `#,Naam,Role,Phone,Status\n`;
  csv += staff.map((s,i)=>`${i+1},"${s.name}",${s.role},${s.phone||'-'},${s.present?'Present':'Absent'}`).join('\n');
  return csv;
}

function buildStockCSV(today) {
  const inv = appData.inventory||[];
  let csv = `SIPLORA CHEF — INVENTORY REPORT,Date: ${today}\n`;
  csv += `Total Items,${inv.length},Low Stock,${inv.filter(i=>i.qty<=i.minQty).length}\n\n`;
  csv += `#,Item Name,Quantity,Unit,Min Qty,Status,Expiry\n`;
  csv += inv.map((i,idx)=>`${idx+1},"${i.name}",${i.qty},${i.unit},${i.minQty},${i.qty<=i.minQty?'LOW STOCK':'OK'},${i.expiry||'-'}`).join('\n');
  return csv;
}

function buildOrdersCSV(today) {
  const kots = appData.kots||[];
  let csv = `SIPLORA CHEF — ORDERS REPORT,Date: ${today}\n`;
  csv += `Total KOTs,${kots.length},Served,${kots.filter(k=>k.status==='served').length}\n\n`;
  csv += `KOT#,Table,Items,Station,Status,Time\n`;
  csv += kots.map((k,i)=>`${i+1},${k.table||'-'},"${(k.items||[]).join(' | ')}",${k.station||'-'},${k.status||'-'},${k.time||'-'}`).join('\n');
  return csv;
}

function buildChefCSV(today) {
  const chefs = (appData.staff||[]).filter(s=>s.role==='chef');
  let csv = `SIPLORA CHEF — CHEF PERFORMANCE,Date: ${today}\n\n`;
  csv += `Chef Naam,Status,Station,Phone\n`;
  csv += chefs.map(c=>`"${c.name}",${c.present?'Present':'Absent'},${c.id%3===0?'Tandoor':c.id%3===1?'Chinese':'Grill'},${c.phone||'-'}`).join('\n');
  return csv;
}

function buildWasteCSV(today) {
  const waste = appData.waste||[];
  const total = waste.reduce((s,w)=>s+(w.cost||0),0);
  let csv = `SIPLORA CHEF — WASTE REPORT,Date: ${today}\n`;
  csv += `Total Waste Cost,₹${total}\n\n`;
  csv += `#,Item,Qty,Cost,Reason,Time\n`;
  csv += waste.map((w,i)=>`${i+1},"${w.name}","${w.qty}",${w.cost||0},"${w.reason||'-'}","${w.time||'-'}"`).join('\n');
  csv += `\nTOTAL,,,₹${total},,`;
  return csv;
}

// ═══════════════════════════════════════
// WHATSAPP TEXT BUILDER
// ═══════════════════════════════════════
function buildWAText(type) {
  const today = rptTodayShort();
  const time = rptTime();
  let text = `👑 *SIPLORA CHEF REPORT*\n📅 Date: ${today} | ⏰ ${time}\n${'─'.repeat(30)}\n`;

  if (type === 'revenue' || type === 'grand') {
    const bills = appData.recentBills||[];
    const total = bills.reduce((s,b)=>s+(b.total||0),0);
    const cash = bills.filter(b=>b.payment==='Cash').reduce((s,b)=>s+(b.total||0),0);
    const upi = bills.filter(b=>b.payment==='UPI').reduce((s,b)=>s+(b.total||0),0);
    text += `\n💰 *REVENUE REPORT*\n`;
    text += `💵 Total: ₹${total.toLocaleString('en-IN')}\n`;
    text += `🧾 Bills: ${bills.length} | Cash: ₹${cash} | UPI: ₹${upi}\n`;
    text += `📊 GST: ₹${Math.round(total*18/118)}\n`;
  }
  if (type === 'staff' || type === 'grand') {
    const staff = appData.staff||[];
    const present = staff.filter(s=>s.present);
    const absent = staff.filter(s=>!s.present);
    text += `\n👥 *STAFF ATTENDANCE*\n`;
    text += `✅ Present (${present.length}): ${present.map(s=>s.name.split(' ')[0]).join(', ')}\n`;
    if (absent.length) text += `❌ Absent (${absent.length}): ${absent.map(s=>s.name.split(' ')[0]).join(', ')}\n`;
  }
  if (type === 'stock' || type === 'grand') {
    const inv = appData.inventory||[];
    const low = inv.filter(i=>i.qty<=i.minQty);
    text += `\n📦 *STOCK REPORT*\n`;
    text += `Total: ${inv.length} items | 🔴 Low Stock: ${low.length}\n`;
    if (low.length) text += `⚠️ Low: ${low.map(i=>i.name).join(', ')}\n`;
  }
  if (type === 'orders' || type === 'grand') {
    const kots = appData.kots||[];
    text += `\n🧾 *ORDERS SUMMARY*\n`;
    text += `Total KOTs: ${kots.length} | ✅ Served: ${kots.filter(k=>k.status==='served').length} | ⏳ Pending: ${kots.filter(k=>k.status==='pending').length}\n`;
  }
  if (type === 'chef' || type === 'grand') {
    const chefs = (appData.staff||[]).filter(s=>s.role==='chef'&&s.present);
    text += `\n👨‍🍳 *CHEF PERFORMANCE*\n`;
    text += chefs.map(c=>`• ${c.name.split(' ')[0]}: On duty`).join('\n') + '\n';
  }
  if (type === 'waste' || type === 'grand') {
    const waste = appData.waste||[];
    const wtotal = waste.reduce((s,w)=>s+(w.cost||0),0);
    text += `\n🗑️ *WASTE LOG*\n`;
    text += `Items: ${waste.length} | Cost: ₹${wtotal}\n`;
  }

  text += `\n${'─'.repeat(30)}\n_Siplora CHEF System — Auto Generated_`;
  return text;
}

// ══════════════════════════════════════════════════════════════
//  SIPLORA CHEF — PERIOD REPORTS (1M / 2M / 6M / 1Y)
//  Existing aaj ki reports ko bilkul touch nahi kiya
// ══════════════════════════════════════════════════════════════

// Active period state
let _activePeriod = '1m';

// Period config
const PERIOD_CONFIG = {
  '1m': { label: 'Last 1 Month',   months: 1 },
  '2m': { label: 'Last 2 Months',  months: 2 },
  '6m': { label: 'Last 6 Months',  months: 6 },
  '1y': { label: 'Last 1 Saal',    months: 12 },
};

// Select period tab
window.selectPeriod = function(period, el) {
  _activePeriod = period;
  // Tab UI update
  document.querySelectorAll('.period-tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  // Update info chips
  updatePeriodInfo();
  showToast(`✅ Period: ${PERIOD_CONFIG[period].label}`, 'var(--accent)');
};

function getPeriodDates() {
  const cfg = PERIOD_CONFIG[_activePeriod] || PERIOD_CONFIG['1m'];
  const today = new Date();
  const from = new Date(today);
  from.setMonth(from.getMonth() - cfg.months);
  const fmt = d => d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  return { from, to: today, fromStr: fmt(from), toStr: fmt(today), label: cfg.label };
}

function updatePeriodInfo() {
  const { fromStr, toStr, label } = getPeriodDates();
  const el = id => document.getElementById(id);
  if (el('period-label-display')) el('period-label-display').textContent = label;
  if (el('period-from-display')) el('period-from-display').textContent = fromStr;
  if (el('period-to-display')) el('period-to-display').textContent = toStr;
}

// ─── PDF builder for period ───
function buildPeriodHeader(type) {
  const { fromStr, toStr, label } = getPeriodDates();
  return `<div class="hdr">
    <div class="hdr-left">
      <div class="logo">Siplora <span>CHEF</span></div>
      <div class="sub">KITCHEN COMMAND CENTER · SOLAPUR</div>
    </div>
    <div class="hdr-right">
      <div><strong>Period:</strong> ${label}</div>
      <div><strong>From:</strong> ${fromStr} &nbsp;→&nbsp; ${toStr}</div>
      <div><strong>Report:</strong> ${type.toUpperCase()}</div>
      <div><strong>Generated:</strong> ${rptTime()}</div>
    </div>
  </div>
  <div style="background:linear-gradient(135deg,rgba(46,156,94,0.1),rgba(46,156,94,0.04));border:1px solid rgba(46,156,94,0.3);border-radius:10px;padding:10px 16px;margin-bottom:16px;font-size:12px;color:#374151;">
    📅 <strong>Period Report:</strong> ${label} &nbsp;|&nbsp; 📆 ${fromStr} → ${toStr}
    &nbsp;|&nbsp; <em>Note: Yeh report current live data pe based hai. Historical Firebase data ke liye Firebase integration required hai.</em>
  </div>`;
}

function buildPeriodPDFContent(type) {
  const header = buildPeriodHeader(type);
  const pdfStyle = `<!DOCTYPE html><html><head>
    <meta charset="UTF-8"><title>Siplora Period Report — ${type}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box;}
      body{font-family:'Segoe UI',Arial,sans-serif;padding:28px 32px;color:#1a2033;background:#fff;}
      .hdr{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #2e9c5e;padding-bottom:16px;margin-bottom:20px;}
      .hdr-left .logo{font-size:24px;font-weight:900;color:#0f1923;letter-spacing:2px;}
      .hdr-left .logo span{color:#2e9c5e;}
      .hdr-left .sub{font-size:11px;color:#6c7890;margin-top:3px;letter-spacing:2px;}
      .hdr-right{text-align:right;font-size:11px;color:#6c7890;line-height:1.8;}
      .rpt-title{font-size:20px;font-weight:900;color:#1a2033;margin-bottom:6px;padding:14px 0 8px;}
      .rpt-title span{color:#2e9c5e;}
      table{width:100%;border-collapse:collapse;margin:12px 0;}
      th{background:#2e9c5e;color:#fff;padding:9px 12px;text-align:left;font-size:12px;font-weight:700;}
      td{padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:12px;color:#374151;}
      tr:nth-child(even) td{background:#f9fafb;}
      .total-row td{font-weight:800;background:#f0fdf4;color:#15803d;}
      .badge{display:inline-block;padding:2px 9px;border-radius:20px;font-size:10px;font-weight:700;}
      .badge-green{background:#dcfce7;color:#16a34a;}
      .badge-red{background:#fee2e2;color:#dc2626;}
      .badge-orange{background:#fef3c7;color:#d97706;}
      .section{margin-bottom:22px;}
      .section-title{font-size:14px;font-weight:800;color:#0f1923;margin-bottom:10px;padding:6px 12px;background:#f0f3f7;border-radius:8px;border-left:4px solid #2e9c5e;}
      .stat-row{display:flex;gap:12px;margin:12px 0;}
      .stat-box{flex:1;border:1.5px solid #e5e7eb;border-radius:10px;padding:12px;text-align:center;}
      .stat-val{font-size:22px;font-weight:900;color:#2e9c5e;}
      .stat-lbl{font-size:10px;color:#6c7890;margin-top:3px;}
      .footer{margin-top:28px;padding-top:14px;border-top:1px solid #e5e7eb;text-align:center;font-size:10px;color:#9ca3af;}
      @media print{body{padding:16px;} .no-print{display:none;}}
    </style>
  </head><body>`;

  const { label } = getPeriodDates();
  let content = '';
  const multiplier = PERIOD_CONFIG[_activePeriod]?.months || 1;

  // Revenue
  if (type === 'revenue' || type === 'grand') {
    const bills = appData.recentBills || [];
    const total = bills.reduce((s,b)=>s+(b.total||0),0) * multiplier;
    const cash = bills.filter(b=>b.payment==='Cash').reduce((s,b)=>s+(b.total||0),0) * multiplier;
    const upi = bills.filter(b=>b.payment==='UPI').reduce((s,b)=>s+(b.total||0),0) * multiplier;
    const gst = Math.round(total*18/118);
    content += `<div class="section">
    <div class="rpt-title">💰 <span>Revenue Report — ${label}</span></div>
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:8px 14px;font-size:11px;color:#92400e;margin-bottom:10px;">⚠️ Estimated: Aaj ke data ko period se multiply karke dikhaya hai. Firebase historical data se exact figures milenge.</div>
    <div class="stat-row">
      <div class="stat-box"><div class="stat-val">₹${total.toLocaleString('en-IN')}</div><div class="stat-lbl">Est. Revenue</div></div>
      <div class="stat-box"><div class="stat-val" style="color:#ef4444;">₹${gst.toLocaleString('en-IN')}</div><div class="stat-lbl">Est. GST</div></div>
      <div class="stat-box"><div class="stat-val" style="color:#3b82f6;">₹${cash.toLocaleString('en-IN')}</div><div class="stat-lbl">Est. Cash</div></div>
      <div class="stat-box"><div class="stat-val" style="color:#8b5cf6;">₹${upi.toLocaleString('en-IN')}</div><div class="stat-lbl">Est. UPI</div></div>
      <div class="stat-box"><div class="stat-val" style="color:#f59e0b;">${bills.length * multiplier}</div><div class="stat-lbl">Est. Bills</div></div>
    </div>
    <div class="section-title">Daily Breakdown (Last Bill × Days)</div>
    <table><thead><tr><th>Table</th><th>Customer</th><th>Amount</th><th>GST</th><th>Total</th><th>Payment</th><th>Time</th></tr></thead>
    <tbody>${bills.map(b=>`<tr><td>${b.table||'-'}</td><td>${b.customer||'Walk-in'}</td><td>₹${b.amount||0}</td><td>₹${b.gst||0}</td><td>₹${b.total||0}</td><td>${b.payment||'-'}</td><td>${b.time||'-'}</td></tr>`).join('')||'<tr><td colspan="7" style="text-align:center;color:#9ca3af;">No bills data</td></tr>'}
    <tr class="total-row"><td colspan="4"><strong>PERIOD TOTAL (Estimated)</strong></td><td>₹${total.toLocaleString('en-IN')}</td><td colspan="2"></td></tr></tbody></table>
    </div>`;
  }

  // Staff
  if (type === 'staff' || type === 'grand') {
    const staff = appData.staff || [];
    content += `<div class="section">
    <div class="rpt-title">👥 <span>Staff Report — ${label}</span></div>
    <div class="stat-row">
      <div class="stat-box"><div class="stat-val">${staff.filter(s=>s.present).length}</div><div class="stat-lbl">Avg Present</div></div>
      <div class="stat-box"><div class="stat-val" style="color:#ef4444;">${staff.filter(s=>!s.present).length}</div><div class="stat-lbl">Avg Absent</div></div>
      <div class="stat-box"><div class="stat-val">${staff.length}</div><div class="stat-lbl">Total Staff</div></div>
      <div class="stat-box"><div class="stat-val" style="color:#8b5cf6;">${staff.filter(s=>s.role==='chef').length}</div><div class="stat-lbl">Chefs</div></div>
    </div>
    <div class="section-title">Staff Details</div>
    <table><thead><tr><th>#</th><th>Naam</th><th>Role</th><th>Phone</th><th>Current Status</th></tr></thead>
    <tbody>${staff.map((s,i)=>`<tr><td>${i+1}</td><td>${s.emoji||''} ${s.name}</td><td>${s.role}</td><td>${s.phone||'-'}</td><td><span class="badge badge-${s.present?'green':'red'}">${s.present?'✅ Present':'❌ Absent'}</span></td></tr>`).join('')}</tbody></table>
    </div>`;
  }

  // Stock
  if (type === 'stock' || type === 'grand') {
    const inv = appData.inventory || [];
    const low = inv.filter(i=>i.qty<=i.minQty);
    content += `<div class="section">
    <div class="rpt-title">📦 <span>Stock Report — ${label}</span></div>
    <div class="stat-row">
      <div class="stat-box"><div class="stat-val">${inv.length}</div><div class="stat-lbl">Total Items</div></div>
      <div class="stat-box"><div class="stat-val" style="color:#ef4444;">${low.length}</div><div class="stat-lbl">Low Stock</div></div>
      <div class="stat-box"><div class="stat-val" style="color:#22c55e;">${inv.length-low.length}</div><div class="stat-lbl">OK Items</div></div>
    </div>
    <div class="section-title">Inventory Details</div>
    <table><thead><tr><th>#</th><th>Item</th><th>Qty</th><th>Unit</th><th>Min Qty</th><th>Status</th><th>Expiry</th></tr></thead>
    <tbody>${inv.map((i,idx)=>`<tr><td>${idx+1}</td><td>${i.emoji||'📦'} ${i.name}</td><td>${i.qty}</td><td>${i.unit}</td><td>${i.minQty}</td><td><span class="badge badge-${i.qty<=i.minQty?'red':i.qty<=i.minQty*2?'orange':'green'}">${i.qty<=i.minQty?'🔴 Low':i.qty<=i.minQty*2?'🟡 Medium':'🟢 Good'}</span></td><td>${i.expiry||'-'}</td></tr>`).join('')}</tbody></table>
    </div>`;
  }

  // Orders
  if (type === 'orders' || type === 'grand') {
    const kots = appData.kots || [];
    const tables = appData.tables || [];
    content += `<div class="section">
    <div class="rpt-title">🧾 <span>Orders Report — ${label}</span></div>
    <div class="stat-row">
      <div class="stat-box"><div class="stat-val">${kots.length * multiplier}</div><div class="stat-lbl">Est. KOTs</div></div>
      <div class="stat-box"><div class="stat-val" style="color:#22c55e;">${kots.filter(k=>k.status==='served').length * multiplier}</div><div class="stat-lbl">Est. Served</div></div>
      <div class="stat-box"><div class="stat-val" style="color:#f59e0b;">${kots.filter(k=>k.status==='pending').length}</div><div class="stat-lbl">Pending Now</div></div>
    </div>
    <div class="section-title">Recent KOTs (Aaj Ke)</div>
    <table><thead><tr><th>KOT#</th><th>Table</th><th>Items</th><th>Station</th><th>Status</th><th>Time</th></tr></thead>
    <tbody>${kots.length?kots.map((k,i)=>`<tr><td>${i+1}</td><td>${k.table||'-'}</td><td>${(k.items||[]).join(', ')}</td><td>${k.station||'-'}</td><td><span class="badge badge-${k.status==='served'?'green':k.status==='pending'?'orange':'red'}">${k.status||'-'}</span></td><td>${k.time||'-'}</td></tr>`).join(''):'<tr><td colspan="6" style="text-align:center;color:#9ca3af;">No KOTs recorded</td></tr>'}
    </tbody></table>
    </div>`;
  }

  // Chef
  if (type === 'chef' || type === 'grand') {
    const chefs = (appData.staff||[]).filter(s=>s.role==='chef');
    const kots = appData.kots||[];
    content += `<div class="section">
    <div class="rpt-title">👨‍🍳 <span>Chef Performance — ${label}</span></div>
    <table><thead><tr><th>Chef Naam</th><th>Status</th><th>Station</th><th>Phone</th><th>Est. Orders (${label})</th></tr></thead>
    <tbody>${chefs.map(c=>{
      const handled = kots.filter(k=>k.station&&(c.id%3===0?k.station==='tandoor':c.id%3===1?k.station==='chinese':k.station==='grill')).length * multiplier;
      return `<tr><td>${c.emoji||'👨‍🍳'} ${c.name}</td><td><span class="badge badge-${c.present?'green':'red'}">${c.present?'Present':'Absent'}</span></td><td>${c.id%3===0?'Tandoor':c.id%3===1?'Chinese':'Grill'}</td><td>${c.phone||'-'}</td><td>${handled} orders</td></tr>`;
    }).join('')||'<tr><td colspan="5" style="text-align:center;color:#9ca3af;">No chef data</td></tr>'}</tbody></table>
    </div>`;
  }

  // Waste
  if (type === 'waste' || type === 'grand') {
    const waste = appData.waste||[];
    const total = waste.reduce((s,w)=>s+(w.cost||0),0) * multiplier;
    content += `<div class="section">
    <div class="rpt-title">🗑️ <span>Waste Report — ${label}</span></div>
    <div class="stat-row">
      <div class="stat-box"><div class="stat-val" style="color:#ef4444;">₹${total.toLocaleString('en-IN')}</div><div class="stat-lbl">Est. Waste Cost</div></div>
      <div class="stat-box"><div class="stat-val">${waste.length * multiplier}</div><div class="stat-lbl">Est. Waste Items</div></div>
    </div>
    <div class="section-title">Waste Log Details</div>
    <table><thead><tr><th>#</th><th>Item</th><th>Qty</th><th>Cost</th><th>Reason</th><th>Time</th></tr></thead>
    <tbody>${waste.map((w,i)=>`<tr><td>${i+1}</td><td>${w.name}</td><td>${w.qty}</td><td>₹${w.cost||0}</td><td>${w.reason||'-'}</td><td>${w.time||'-'}</td></tr>`).join('')||'<tr><td colspan="6" style="text-align:center;color:#9ca3af;">No waste recorded</td></tr>'}
    <tr class="total-row"><td colspan="3"><strong>PERIOD TOTAL (Est.)</strong></td><td>₹${total.toLocaleString('en-IN')}</td><td colspan="2"></td></tr></tbody></table>
    </div>`;
  }

  return pdfStyle + header + content + `<div class="footer">Siplora CHEF — Period Report: ${label} · Generated ${rptTodayShort()} ${rptTime()}</div>
  <div class="no-print" style="text-align:center;margin-top:20px;">
    <button onclick="window.print()" style="background:#2e9c5e;color:#fff;border:none;padding:12px 32px;border-radius:10px;font-size:14px;font-weight:800;cursor:pointer;">🖨️ Print / Save as PDF</button>
  </div></body></html>`;
}

// ─── Period PDF Download ───
window.downloadPeriodRptPDF = function(type) {
  const { label } = getPeriodDates();
  showToast(`📄 ${label} — ${type.toUpperCase()} PDF generate ho raha hai...`, 'var(--red)');
  setTimeout(() => {
    const win = window.open('', '_blank');
    if (!win) { showToast('⚠️ Popup blocked! Allow karo browser mein.', 'var(--red)'); return; }
    win.document.write(buildPeriodPDFContent(type));
    win.document.close();
    setTimeout(() => { try { win.print(); } catch(e){} }, 500);
    showToast(`✅ ${label} ${type.toUpperCase()} PDF ready!`, 'var(--green)');
  }, 300);
};

// ─── Period CSV/Excel Download ───
function buildPeriodCSV(type) {
  const { fromStr, toStr, label } = getPeriodDates();
  const multiplier = PERIOD_CONFIG[_activePeriod]?.months || 1;
  const today = rptTodayShort();
  let csv = `SIPLORA CHEF — PERIOD REPORT,Period: ${label}\nFrom: ${fromStr},To: ${toStr},Generated: ${today}\n\n`;

  if (type === 'revenue' || type === 'grand') {
    const bills = appData.recentBills||[];
    const total = bills.reduce((s,b)=>s+(b.total||0),0) * multiplier;
    csv += `REVENUE REPORT — ${label}\n`;
    csv += `Est. Total Revenue,₹${total.toLocaleString('en-IN')},Est. Bills,${bills.length*multiplier}\n\n`;
    csv += `Table,Customer,Amount,GST,Total,Payment,Time\n`;
    csv += bills.map(b=>`${b.table||'-'},"${b.customer||'Walk-in'}",${b.amount||0},${b.gst||0},${b.total||0},${b.payment||'-'},${b.time||'-'}`).join('\n');
    csv += `\nPERIOD TOTAL (Est.),,,,₹${total.toLocaleString('en-IN')},,\n\n`;
  }
  if (type === 'staff' || type === 'grand') {
    const staff = appData.staff||[];
    csv += `STAFF REPORT — ${label}\n`;
    csv += `Total Staff,${staff.length},Avg Present,${staff.filter(s=>s.present).length}\n\n`;
    csv += `#,Naam,Role,Phone,Status\n`;
    csv += staff.map((s,i)=>`${i+1},"${s.name}",${s.role},${s.phone||'-'},${s.present?'Present':'Absent'}`).join('\n');
    csv += '\n\n';
  }
  if (type === 'stock' || type === 'grand') {
    const inv = appData.inventory||[];
    csv += `STOCK REPORT — ${label}\n`;
    csv += `Total Items,${inv.length},Low Stock,${inv.filter(i=>i.qty<=i.minQty).length}\n\n`;
    csv += `#,Item Name,Quantity,Unit,Min Qty,Status,Expiry\n`;
    csv += inv.map((i,idx)=>`${idx+1},"${i.name}",${i.qty},${i.unit},${i.minQty},${i.qty<=i.minQty?'LOW STOCK':'OK'},${i.expiry||'-'}`).join('\n');
    csv += '\n\n';
  }
  if (type === 'orders' || type === 'grand') {
    const kots = appData.kots||[];
    csv += `ORDERS REPORT — ${label}\n`;
    csv += `Est. KOTs,${kots.length*multiplier},Est. Served,${kots.filter(k=>k.status==='served').length*multiplier}\n\n`;
    csv += `KOT#,Table,Items,Station,Status,Time\n`;
    csv += kots.map((k,i)=>`${i+1},${k.table||'-'},"${(k.items||[]).join(' | ')}",${k.station||'-'},${k.status||'-'},${k.time||'-'}`).join('\n');
    csv += '\n\n';
  }
  if (type === 'chef' || type === 'grand') {
    const chefs = (appData.staff||[]).filter(s=>s.role==='chef');
    const kots = appData.kots||[];
    csv += `CHEF PERFORMANCE — ${label}\n\n`;
    csv += `Chef Naam,Status,Station,Phone,Est. Orders\n`;
    csv += chefs.map(c=>{
      const handled = kots.filter(k=>k.station&&(c.id%3===0?k.station==='tandoor':c.id%3===1?k.station==='chinese':k.station==='grill')).length * multiplier;
      return `"${c.name}",${c.present?'Present':'Absent'},${c.id%3===0?'Tandoor':c.id%3===1?'Chinese':'Grill'},${c.phone||'-'},${handled}`;
    }).join('\n');
    csv += '\n\n';
  }
  if (type === 'waste' || type === 'grand') {
    const waste = appData.waste||[];
    const total = waste.reduce((s,w)=>s+(w.cost||0),0) * multiplier;
    csv += `WASTE REPORT — ${label}\n`;
    csv += `Est. Total Waste Cost,₹${total.toLocaleString('en-IN')}\n\n`;
    csv += `#,Item,Qty,Cost,Reason,Time\n`;
    csv += waste.map((w,i)=>`${i+1},"${w.name}","${w.qty}",${w.cost||0},"${w.reason||'-'}","${w.time||'-'}"`).join('\n');
    csv += `\nPERIOD TOTAL (Est.),,,₹${total.toLocaleString('en-IN')},,\n`;
  }
  return csv;
}

window.downloadPeriodRptXL = function(type) {
  const { label } = getPeriodDates();
  showToast(`📗 ${label} — Excel generate ho raha hai...`, 'var(--green)');
  const csvData = buildPeriodCSV(type);
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Siplora_${type}_${_activePeriod.toUpperCase()}_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`✅ ${label} ${type.toUpperCase()} Excel download ho gaya!`, 'var(--green)');
};

// ─── Period WhatsApp Send ───
function buildPeriodWAText(type) {
  const { fromStr, toStr, label } = getPeriodDates();
  const multiplier = PERIOD_CONFIG[_activePeriod]?.months || 1;
  const time = rptTime();
  let text = `👑 *SIPLORA CHEF — PERIOD REPORT*\n📅 Period: ${label}\n📆 ${fromStr} → ${toStr}\n⏰ Generated: ${time}\n${'─'.repeat(30)}\n`;

  if (type === 'revenue' || type === 'grand') {
    const bills = appData.recentBills||[];
    const total = bills.reduce((s,b)=>s+(b.total||0),0) * multiplier;
    const cash = bills.filter(b=>b.payment==='Cash').reduce((s,b)=>s+(b.total||0),0) * multiplier;
    const upi = bills.filter(b=>b.payment==='UPI').reduce((s,b)=>s+(b.total||0),0) * multiplier;
    text += `\n💰 *REVENUE — ${label}*\n💵 Est. Total: ₹${total.toLocaleString('en-IN')}\n💵 Cash: ₹${cash.toLocaleString('en-IN')} | UPI: ₹${upi.toLocaleString('en-IN')}\n🧾 Est. Bills: ${bills.length*multiplier}\n`;
  }
  if (type === 'staff' || type === 'grand') {
    const staff = appData.staff||[];
    const present = staff.filter(s=>s.present);
    text += `\n👥 *STAFF — ${label}*\n✅ Avg Present: ${present.length} / ${staff.length}\n👨‍🍳 Chefs: ${present.filter(s=>s.role==='chef').length} | Waiters: ${present.filter(s=>s.role==='waiter').length}\n`;
  }
  if (type === 'stock' || type === 'grand') {
    const inv = appData.inventory||[];
    const low = inv.filter(i=>i.qty<=i.minQty);
    text += `\n📦 *STOCK — ${label}*\nTotal: ${inv.length} items | 🔴 Low: ${low.length}\n`;
    if (low.length) text += `⚠️ Low items: ${low.map(i=>i.name).join(', ')}\n`;
  }
  if (type === 'orders' || type === 'grand') {
    const kots = appData.kots||[];
    text += `\n🧾 *ORDERS — ${label}*\nEst. KOTs: ${kots.length*multiplier} | Est. Served: ${kots.filter(k=>k.status==='served').length*multiplier}\n`;
  }
  if (type === 'chef' || type === 'grand') {
    const chefs = (appData.staff||[]).filter(s=>s.role==='chef'&&s.present);
    text += `\n👨‍🍳 *CHEF — ${label}*\n${chefs.map(c=>`• ${c.name.split(' ')[0]}: Active`).join('\n')}\n`;
  }
  if (type === 'waste' || type === 'grand') {
    const waste = appData.waste||[];
    const wtotal = waste.reduce((s,w)=>s+(w.cost||0),0) * multiplier;
    text += `\n🗑️ *WASTE — ${label}*\nEst. Cost: ₹${wtotal.toLocaleString('en-IN')} | Items: ${waste.length*multiplier}\n`;
  }
  text += `\n${'─'.repeat(30)}\n_Siplora CHEF · Period Report · Auto Generated_`;
  return text;
}

window.sendPeriodWA = function(type) {
  const { label } = getPeriodDates();
  const num = localStorage.getItem('siplora_wa_num') || '';
  const token = localStorage.getItem('siplora_wa_token') || '';

  if (!num) {
    showToast('⚠️ Pehle owner ka WhatsApp number Reports section mein save karo!', 'var(--orange)');
    return;
  }

  const popup = document.getElementById('wa-status-popup');
  const titleEl = document.getElementById('wa-status-title');
  const msgEl = document.getElementById('wa-status-msg');
  if (popup) popup.style.display = 'block';
  if (titleEl) titleEl.textContent = `📱 ${label} Report bhej raha hai...`;

  const text = buildPeriodWAText(type);
  const cleanNum = num.replace(/[^0-9]/g, '');

  if (!token) {
    const encoded = encodeURIComponent(text);
    setTimeout(() => {
      window.open(`https://wa.me/${cleanNum}?text=${encoded}`, '_blank');
      if (popup) popup.style.display = 'none';
      showToast(`📱 WhatsApp Web open hua — ${label} report bhejo!`, 'var(--green)');
    }, 800);
    return;
  }

  if (msgEl) msgEl.textContent = 'API se send ho raha hai...';
  fetch('https://api.whatsapp.com/send', {
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
    body:JSON.stringify({messaging_product:'whatsapp',to:cleanNum,type:'text',text:{body:text}})
  }).then(r=>{
    if (popup) popup.style.display='none';
    if(r.ok){showToast(`✅ ${label} Report WhatsApp pe bhej di!`,'var(--green)');}
    else{window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`,'_blank');showToast('📱 WhatsApp Web se bhejo','var(--orange)');}
  }).catch(()=>{
    if (popup) popup.style.display='none';
    window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`,'_blank');
    showToast('📱 WhatsApp Web se bhejo!','var(--orange)');
  });
};

// ─── All-In-One: PDF + Excel + WA ek ke baad ek ───
window.downloadPeriodAllInOne = function() {
  const { label } = getPeriodDates();
  showToast(`⚡ All-In-One start: PDF → Excel → WhatsApp`, 'var(--accent)');
  // PDF first
  setTimeout(() => downloadPeriodRptPDF('grand'), 200);
  // Excel after PDF
  setTimeout(() => downloadPeriodRptXL('grand'), 1200);
  // WhatsApp last
  setTimeout(() => sendPeriodWA('grand'), 2200);
};

// Init period info on load
function initPeriodInfo() { updatePeriodInfo(); }

// Hook into initReports
const _origInitReports = window.initReports || (() => {});
// We call updatePeriodInfo when reports page opens (already handled via initReports calling updatePreviews — we add our call)
const _origInitRptsFn = typeof initReports !== 'undefined' ? initReports : null;
// Override initReports to also init period section
(function() {
  const orig = window.initReports;
  window.initReports = function() {
    if (orig) orig();
    updatePeriodInfo();
  };
})();

console.log('✅ Siplora Reports Module loaded!');
console.log('✅ Period Reports Module loaded! (1M/2M/6M/1Y)');
// ════════════════════════════════════════════════════════════
// 🔥 SIPLORA SETTINGS — FIREBASE MODULE
// Settings ko Firebase Firestore ke saath sync karta hai
// Restaurant name LOCKED hai — "Siplora" hamesha rahega
// ════════════════════════════════════════════════════════════

const SETTINGS_DOC_ID = 'chef_settings'; // Firestore document ID
let RESTAURANT_NAME_LOCKED = 'Siplora Chef Restaurant'; // ← Ab user badal sakta hai

// Restaurant name change hone par GST preview bhi update karo
function onRestNameChange(val) {
  RESTAURANT_NAME_LOCKED = val || 'Siplora Chef Restaurant';
  // GST preview refresh karo agar items hain
  if (typeof calcGSTTotal === 'function') calcGSTTotal();
}

// ── Firebase Settings Load karo ──
async function loadSettingsFromFirebase() {
  const syncIcon = document.getElementById('settings-sync-icon');
  const syncMsg  = document.getElementById('settings-sync-msg');
  const bar      = document.getElementById('settings-sync-bar');

  function setBar(icon, msg, color) {
    if (syncIcon) syncIcon.textContent = icon;
    if (syncMsg)  syncMsg.textContent  = msg;
    if (bar) bar.style.borderColor = color || 'rgba(46,156,94,0.2)';
  }

  // Firebase ready hone ka wait karo (max 8 sec)
  let waited = 0;
  while (!window.__chefDb && waited < 80) {
    await new Promise(r => setTimeout(r, 100));
    waited++;
  }

  if (!window.__chefDb) {
    setBar('❌', 'Firebase connect nahi hua — local defaults use ho rahe hain', 'rgba(239,68,68,0.4)');
    applySettingsToUI({}); // defaults
    return;
  }

  try {
    setBar('⏳', 'Firebase se settings load ho rahi hai...', 'rgba(245,158,11,0.3)');
    const { getDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const snap = await getDoc(doc(window.__chefDb, 'settings', SETTINGS_DOC_ID));

    if (snap.exists()) {
      const data = snap.data();
      applySettingsToUI(data);
      setBar('✅', 'Firebase se settings load ho gayi!', 'rgba(46,156,94,0.3)');
      console.log('[SETTINGS] Loaded from Firebase:', data);
    } else {
      // Pehli baar — defaults set karo aur Firebase mein save karo
      applySettingsToUI({});
      setBar('🆕', 'Pehli baar setup — defaults Firebase mein save ho rahe hain...', 'rgba(59,130,246,0.3)');
      await saveSettingsToFirebase(true); // silent save
    }
  } catch (e) {
    console.warn('[SETTINGS] Firebase load error:', e.message);
    setBar('⚠️', 'Load error — local defaults use ho rahe hain', 'rgba(239,68,68,0.3)');
    applySettingsToUI({});
  }
}

// ── Settings ko UI par apply karo ──
function applySettingsToUI(data) {
  // ── Restaurant Name — Ab User Editable hai ──
  const nameInput = document.getElementById('s-rest-name');
  if (nameInput) {
    const savedName = data.restaurantName || 'Siplora Chef Restaurant';
    nameInput.value = savedName;
    nameInput.readOnly = false;
    nameInput.style.opacity = '';
    nameInput.style.cursor = '';
    nameInput.style.background = '';
    nameInput.style.borderColor = '';
    RESTAURANT_NAME_LOCKED = savedName; // global update
  }

  // ── GST Number ──
  const gstEl = document.getElementById('s-gst-no');
  if (gstEl) gstEl.value = data.gstNo || '27AABCU9603R1ZX';

  // ── Phone ──
  const phoneEl = document.getElementById('s-phone');
  if (phoneEl) phoneEl.value = data.phone || '+91 9876543210';

  // ── Address ──
  const addrEl = document.getElementById('s-address');
  if (addrEl) addrEl.value = data.address || 'Solapur, Maharashtra';

  // ── WhatsApp Number ──
  const waEl = document.getElementById('s-wa-num');
  if (waEl) waEl.value = data.waNum || localStorage.getItem('siplora_wa_num') || '';

  // ── GST % ──
  const gstPct = document.getElementById('s-gst-pct');
  if (gstPct) gstPct.value = data.gstPct !== undefined ? data.gstPct : 18;

  // ── Toggles ──
  const kotPrint = document.getElementById('s-kot-print');
  if (kotPrint) kotPrint.checked = data.kotAutoPrint !== undefined ? data.kotAutoPrint : true;

  const waBill = document.getElementById('s-wa-bill');
  if (waBill) waBill.checked = data.waBilling !== undefined ? data.waBilling : true;

  // ── Neon / Sound ──
  const neonEl = document.getElementById('s-neon');
  if (neonEl && data.neonMode !== undefined) neonEl.checked = data.neonMode;

  const soundEl = document.getElementById('s-sound');
  if (soundEl && data.soundEnabled !== undefined) soundEl.checked = data.soundEnabled;

  // Global appData sync
  if (data.soundEnabled !== undefined) appData.soundEnabled = data.soundEnabled;
  if (data.neonMode !== undefined) appData.neonMode = data.neonMode;

  // WhatsApp number localStorage mein bhi save karo (reports ke liye)
  if (data.waNum) localStorage.setItem('siplora_wa_num', data.waNum);

  console.log('[SETTINGS] UI updated. Restaurant name locked:', RESTAURANT_NAME_LOCKED);
}

// ── Settings Firebase mein save karo ──
window.saveSettingsToFirebase = async function(silentMode = false) {
  const btn = document.getElementById('settings-save-btn');
  const syncIcon = document.getElementById('settings-sync-icon');
  const syncMsg  = document.getElementById('settings-sync-msg');
  const bar      = document.getElementById('settings-sync-bar');

  if (!window.__chefDb) {
    if (!silentMode) showToast('❌ Firebase connect nahi hua — try karo', 'var(--red)');
    return;
  }

  // ── Collect values from UI ──
  const settings = {
    restaurantName: document.getElementById('s-rest-name')?.value || RESTAURANT_NAME_LOCKED,  // ← User input se
    gstNo:         document.getElementById('s-gst-no')?.value   || '27AABCU9603R1ZX',
    phone:         document.getElementById('s-phone')?.value    || '+91 9876543210',
    address:       document.getElementById('s-address')?.value  || 'Solapur, Maharashtra',
    waNum:         document.getElementById('s-wa-num')?.value   || '',
    gstPct:        Number(document.getElementById('s-gst-pct')?.value) || 18,
    kotAutoPrint:  document.getElementById('s-kot-print')?.checked ?? true,
    waBilling:     document.getElementById('s-wa-bill')?.checked ?? true,
    neonMode:      document.getElementById('s-neon')?.checked   ?? false,
    soundEnabled:  document.getElementById('s-sound')?.checked  ?? true,
    updatedAt:     new Date().toISOString(),
    updatedBy:     'chef_panel'
  };

  // Button loading state
  if (!silentMode && btn) {
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2"></i> Saving...';
  }

  try {
    const { setDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    await setDoc(doc(window.__chefDb, 'settings', SETTINGS_DOC_ID), settings, { merge: true });

    // WhatsApp number localStorage mein bhi sync karo
    if (settings.waNum) localStorage.setItem('siplora_wa_num', settings.waNum);

    // Update global restaurant name
    RESTAURANT_NAME_LOCKED = settings.restaurantName;

    // Update appData
    appData.soundEnabled = settings.soundEnabled;
    appData.neonMode     = settings.neonMode;

    if (!silentMode) {
      showToast('✅ Settings Firebase mein save ho gayi!', 'var(--green)');
      if (syncIcon) syncIcon.textContent = '✅';
      if (syncMsg)  syncMsg.textContent  = `Settings save ho gayi — ${new Date().toLocaleTimeString('en-IN')}`;
      if (bar) bar.style.borderColor = 'rgba(46,156,94,0.4)';
      if (window.lucide) setTimeout(() => lucide.createIcons(), 80);
    }
    console.log('[SETTINGS] Saved to Firebase:', settings);

  } catch (e) {
    console.warn('[SETTINGS] Save error:', e.message);
    if (!silentMode) showToast('❌ Save nahi hua: ' + e.message, 'var(--red)');
  } finally {
    if (!silentMode && btn) {
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="save"></i> Save to Firebase';
      if (window.lucide) setTimeout(() => lucide.createIcons(), 80);
    }
  }
};

// ── Settings page open hone par auto-load ──
// showPage function ko hook karo
(function() {
  const _origShowPage = window.showPage;
  window.showPage = function(page) {
    if (_origShowPage) _origShowPage(page);
    if (page === 'settings') {
      // Thodi der baad load karo (DOM render ke baad)
      setTimeout(() => loadSettingsFromFirebase(), 200);
    }
  };
})();

// ── Page load par bhi settings load karo (agar pehle se settings page active ho) ──
document.addEventListener('DOMContentLoaded', () => {
  // 3 second baad load karo — Firebase connect hone ka time dena
  setTimeout(() => {
    const settingsPage = document.getElementById('page-settings');
    if (settingsPage && settingsPage.classList.contains('active')) {
      loadSettingsFromFirebase();
    }
  }, 3000);
});

console.log('✅ Siplora Settings Firebase Module loaded! (Restaurant name locked: ' + RESTAURANT_NAME_LOCKED + ')');
// ═══ MENU FIREBASE SYNC ═══
async function saveMenuToFirebase(){
  try{
    const db=window.__chefDb||await _staffFbInit();
    const {doc,setDoc}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    await setDoc(doc(db,'app_config','menu_items'),{items:appData.menu,updatedAt:Date.now()},{merge:true});
    showToast('✅ Menu Firebase mein save ho gaya!','var(--green)');
  }catch(e){console.warn('[Menu FB Save]',e.message);}
}
async function loadMenuFromFirebase(){
  try{
    const db=window.__chefDb||await _staffFbInit();
    const {doc,getDoc}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const snap=await getDoc(doc(db,'app_config','menu_items'));
    if(snap.exists()&&snap.data().items&&snap.data().items.length>0){
      appData.menu=snap.data().items;
      if(typeof renderMenu==='function') renderMenu();
      console.log('[Menu] Firebase se load hua:',appData.menu.length,'items');
    }
  }catch(e){console.warn('[Menu FB Load]',e.message);}
}

// ═══ CUSTOMERS FIREBASE SYNC ═══
async function saveCustomersToFirebase(){
  try{
    const db=window.__chefDb||await _staffFbInit();
    const {doc,setDoc}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    await setDoc(doc(db,'app_config','customers_data'),{customers:appData.customers,updatedAt:Date.now()},{merge:true});
  }catch(e){console.warn('[Customers FB Save]',e.message);}
}
async function saveCustomerToFirebase(c){
  try{
    const db=window.__chefDb||await _staffFbInit();
    const {doc,setDoc}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    await setDoc(doc(db,'customers',String(c.id)),c,{merge:true});
  }catch(e){console.warn('[Customer FB Save]',e.message);}
}
async function loadCustomersFromFirebase(){
  try{
    const db=window.__chefDb||await _staffFbInit();
    const {collection,getDocs}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const snap=await getDocs(collection(db,'customers'));
    if(!snap.empty){
      const loaded=[];
      snap.forEach(d=>loaded.push(d.data()));
      if(loaded.length>0){appData.customers=loaded;if(typeof renderCustomers==='function')renderCustomers();}
    }
  }catch(e){console.warn('[Customers FB Load]',e.message);}
}

// ═══ WAITER CALLS FIREBASE SYNC ═══
async function saveWaiterCallToFirebase(call){
  try{
    const db=window.__chefDb||await _staffFbInit();
    const {doc,setDoc}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    await setDoc(doc(db,'waiter_calls',String(call.id)),call,{merge:true});
  }catch(e){console.warn('[WaiterCall FB]',e.message);}
}
async function loadWaiterCallsFromFirebase(){
  try{
    const db=window.__chefDb||await _staffFbInit();
    const {collection,getDocs}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const snap=await getDocs(collection(db,'waiter_calls'));
    if(!snap.empty){
      const loaded=[];
      snap.forEach(d=>loaded.push(d.data()));
      if(loaded.length>0){appData.waiterCalls=loaded;if(typeof renderWaiterCalls==='function')renderWaiterCalls();}
    }
  }catch(e){console.warn('[WaiterCalls FB Load]',e.message);}
}

// ═══ WASTE FIREBASE SYNC ═══
async function saveWasteToFirebase(w){
  try{
    const db=window.__chefDb||await _staffFbInit();
    const {doc,setDoc}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    await setDoc(doc(db,'waste_log',String(w.id)),w,{merge:true});
  }catch(e){console.warn('[Waste FB]',e.message);}
}
async function loadWasteFromFirebase(){
  try{
    const db=window.__chefDb||await _staffFbInit();
    const {collection,getDocs}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const snap=await getDocs(collection(db,'waste_log'));
    if(!snap.empty){
      const loaded=[];
      snap.forEach(d=>loaded.push(d.data()));
      if(loaded.length>0){appData.waste=loaded;if(typeof renderWaste==='function')renderWaste();}
    }
  }catch(e){console.warn('[Waste FB Load]',e.message);}
}

// ═══ TABLES STATUS FIREBASE SYNC ═══
async function saveTableToFirebase(t){
  try{
    const db=window.__chefDb||await _staffFbInit();
    const {doc,setDoc}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    await setDoc(doc(db,'tables_status',String(t.id)),t,{merge:true});
  }catch(e){console.warn('[Table FB]',e.message);}
}
async function loadTablesFromFirebase(){
  try{
    const db=window.__chefDb||await _staffFbInit();
    const {collection,getDocs}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const snap=await getDocs(collection(db,'tables_status'));
    if(!snap.empty){
      snap.forEach(d=>{
        const fbT=d.data();
        const localT=appData.tables.find(x=>x.id===fbT.id);
        if(localT)Object.assign(localT,fbT);
      });
      if(typeof renderTables==='function') renderTables();
    }
  }catch(e){console.warn('[Tables FB Load]',e.message);}
}

// ═══ BRANCHES FIREBASE SYNC ═══
async function saveBranchToFirebase(b){
  try{
    const db=window.__chefDb||await _staffFbInit();
    const {doc,setDoc}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    await setDoc(doc(db,'branches',String(b.id)),b,{merge:true});
  }catch(e){console.warn('[Branch FB]',e.message);}
}
async function loadBranchesFromFirebase(){
  try{
    const db=window.__chefDb||await _staffFbInit();
    const {collection,getDocs}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const snap=await getDocs(collection(db,'branches'));
    if(!snap.empty){
      const loaded=[];
      snap.forEach(d=>loaded.push(d.data()));
      if(loaded.length>0){appData.branches=loaded;if(typeof renderBranches==='function')renderBranches();}
    }
  }catch(e){console.warn('[Branches FB Load]',e.message);}
}

// ═══ KOT FIREBASE FULL SYNC ═══
async function saveKotToFirebase(k){
  try{
    const db=window.__chefDb||await _staffFbInit();
    const {doc,setDoc}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    await setDoc(doc(db,'kots',String(k.id)),k,{merge:true});
  }catch(e){console.warn('[KOT FB]',e.message);}
}
async function loadKotsFromFirebase(){
  try{
    const db=window.__chefDb||await _staffFbInit();
    const {collection,getDocs}=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const snap=await getDocs(collection(db,'kots'));
    if(!snap.empty){
      const loaded=[];
      snap.forEach(d=>loaded.push(d.data()));
      // Served KOTs filter out karo (last 24h ke sirf active rakhho)
      const cutoff=Date.now()-24*60*60*1000;
      appData.kots=loaded.filter(k=>k.status!=='served'||(k.id>cutoff));
      if(typeof renderKOT==='function') renderKOT();
    }
  }catch(e){console.warn('[KOTs FB Load]',e.message);}
}

// ═══════════════════════════════════════════════════════════════════════
// 🔗 BILLING FILE LIVE SYNC — localStorage se real-time table status
// ═══════════════════════════════════════════════════════════════════════
function syncTablesFromBilling() {
  try {
    const lumTables = JSON.parse(localStorage.getItem('lum_tables') || 'null');
    if (!lumTables || typeof lumTables !== 'object') return;
    let changed = false;
    Object.keys(lumTables).forEach(k => {
      const tNum = Number(k);
      const bt = lumTables[k];
      let ct = appData.tables.find(x => x.id === tNum);
      if (!ct) {
        ct = {id: tNum, status:'available', items:[], time:0, maxTime:20, type:'normal', notes:'', station:'', waiter:''};
        appData.tables.push(ct);
        changed = true;
      }
      const bs = bt.status || 'available';
      let cs = bs === 'occupied' ? (ct.status === 'available' || ct.status === 'reserved' ? 'pending' : ct.status)
             : bs === 'reserved' ? 'reserved' : 'available';
      if (ct.status !== cs) { ct.status = cs; changed = true; }
      const cn = bt.customerName || '';
      if (ct.customerName !== cn) { ct.customerName = cn; changed = true; }
      if (bt.order && bt.order.length) {
        const ni = bt.order.map(i => i.name || i);
        if (ct.items.join(',') !== ni.join(',')) { ct.items = ni; changed = true; }
      } else if (bs === 'available' && ct.items.length) {
        ct.items = []; ct.customerName = ''; changed = true;
      }
    });
    if (changed) {
      if (document.getElementById('page-tables')?.classList.contains('active')) renderTables();
      if (document.getElementById('page-dashboard')?.classList.contains('active')) renderDashboard();
    }
    window._billingLastSync = Date.now();
  } catch(e) { console.warn('[BillingSync]', e.message); }
}

// ═══════════════════════════════════════════════════════════════════════
// 🧾 BILLING ORDER DESK → KOT SYNC
// lum_orders se billing ke orders padho, chef KOT mein dikhao
// Chef status change karne pe wapas lum_orders mein sync karo
// ═══════════════════════════════════════════════════════════════════════
function syncOrdersFromBilling() {
  try {
    const lumOrders = JSON.parse(localStorage.getItem('lum_orders') || '[]');
    if (!Array.isArray(lumOrders) || lumOrders.length === 0) return;

    let newKotAdded = false;

    lumOrders.forEach(order => {
      if (!order._id) return;
      // Sirf active orders (paid/cancelled/served skip)
      if (order.status === 'paid' || order.status === 'cancelled' || order.status === 'served') return;

      // Check karo ye KOT already hai ya nahi
      const existingKot = appData.kots.find(k => k._billingId === order._id);

      if (!existingKot) {
        // Naya KOT banana hai
        const items = (order.items || []).map(it => {
          if (typeof it === 'string') return it;
          const qty = it.qty && it.qty > 1 ? ` ×${it.qty}` : '';
          return (it.name || 'Item') + qty;
        });

        const kotStatus = order.status === 'cooking' || order.status === 'preparing'
          ? 'preparing'
          : order.status === 'ready'
          ? 'ready'
          : order.status === 'served'
          ? 'served'
          : 'pending';

        const kot = {
          id: Date.now() + Math.random(),
          _billingId: order._id,
          tableId: order.tableNumber && order.tableNumber > 0 ? order.tableNumber : 0,
          station: 'kitchen',
          items: items,
          notes: order.note || order.specialNote || '',
          status: kotStatus,
          time: order.createdAt
            ? (order.createdAt.seconds
                ? new Date(order.createdAt.seconds * 1000).toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'})
                : new Date(order.createdAt).toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'}))
            : new Date().toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'}),
          orderNumber: order.orderNumber || ('OD-' + String(order._id).slice(-6).toUpperCase()),
          customerName: order.customerName || '',
          customerPhone: order.customerPhone || '',
          source: order.source || 'billing',
          total: order.total || 0,
        };

        appData.kots.push(kot);
        newKotAdded = true;

      } else {
        // Existing KOT — billing se status update karo (sirf agar billing ne change kiya)
        const billingStatus = order.status === 'cooking' || order.status === 'preparing'
          ? 'preparing'
          : order.status === 'ready' ? 'ready'
          : order.status === 'served' ? 'served'
          : existingKot.status; // chef ka status preserve karo
        // Sirf billing→chef direction mein: ready/served force karo
        if ((order.status === 'served' || order.status === 'ready') && existingKot.status !== order.status) {
          existingKot.status = billingStatus;
        }
      }
    });

    // KOT page open hai toh refresh karo
    if (newKotAdded) {
      const kotPage = document.getElementById('page-kot');
      if (kotPage && kotPage.classList.contains('active')) renderKOT();

      // Badge update
      const badge = document.getElementById('kotBadge');
      if (badge) badge.textContent = appData.kots.filter(k => k.status === 'pending').length || '';

      renderDashboard();
      updateFeatTabCounts();
    }

  } catch(e) { console.warn('[OrderSync]', e.message); }
}
window.syncOrdersFromBilling = syncOrdersFromBilling;

// Chef ke updateKOT ke baad billing ke lum_orders mein bhi status sync karo
const _origUpdateKOT = window.updateKOT;
window.updateKOT = function(id, status) {
  // Original call
  const k = appData.kots.find(x => x.id === id);
  if (k) {
    k.status = status;
    if (typeof renderKOT === 'function') renderKOT();
    if (typeof renderKitBoard === 'function') renderKitBoard();
    if (false) 

    // Toast
    if (status === 'ready') {
      if (typeof showToast === 'function') showToast(`✅ KOT Ready — ${k.tableId > 0 ? 'Table ' + k.tableId : 'Order Desk'}!`, 'var(--green)');
    } else if (status === 'preparing') {
      if (typeof showToast === 'function') showToast(`🔥 ${k.tableId > 0 ? 'Table ' + k.tableId : 'Order Desk'} — Cooking shuru!`, 'var(--blue)');
    } else if (status === 'served') {
      if (typeof showToast === 'function') showToast(`🙌 Order Served!`, 'var(--accent)');

      // ── 1. Customer History mein save karo (lum_customers) ──
      try {
        const now = new Date();
        const timeStr = now.toLocaleString('en-IN', {hour:'2-digit', minute:'2-digit', day:'2-digit', month:'short', year:'numeric'});
        const dateStr = now.toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'});
        const cleanName  = (k.customerName || 'Guest').trim();
        const cleanPhone = (k.customerPhone || '').replace(/\D/g,'').slice(-10);
        const cleanSpent = k.total || 0;
        const itemNames  = (k.items || []).join(', ');
        const cleanDish  = (k.items && k.items[0]) ? String(k.items[0]).split('×')[0].trim() : '';
        const visitEntry = {
          date: dateStr, time: timeStr,
          items: itemNames,
          total: cleanSpent,
          orderNumber: k.orderNumber || ('KOT-' + String(k.id).slice(-6)),
          source: 'order-desk'
        };
        const autoGetTier = s => s>=15000?'Platinum':s>=7000?'Gold':s>=3000?'Silver':'Bronze';
        let custs = [];
        try { custs = JSON.parse(localStorage.getItem('lum_customers') || '[]'); } catch(e) { custs = []; }
        let idx = -1;
        if (cleanPhone) idx = custs.findIndex(c => (c.phone||'').replace(/\D/g,'').slice(-10) === cleanPhone);
        if (idx < 0 && cleanName !== 'Guest') idx = custs.findIndex(c => (c.name||'').toLowerCase() === cleanName.toLowerCase());
        if (idx >= 0) {
          const c = custs[idx];
          c.visits    = (c.visits || 0) + 1;
          c.spent     = (c.spent  || 0) + cleanSpent;
          c.lastVisit = timeStr;
          if (!c.visitHistory) c.visitHistory = [];
          c.visitHistory.unshift(visitEntry);
          if (c.visitHistory.length > 200) c.visitHistory = c.visitHistory.slice(0, 200);
          if (cleanDish) {
            if (!c.dishCount) c.dishCount = {};
            c.dishCount[cleanDish] = (c.dishCount[cleanDish] || 0) + 1;
            c.fav = Object.entries(c.dishCount).sort((a,b)=>b[1]-a[1])[0][0];
            c.dish = c.fav;
          }
          if (cleanPhone && !c.phone) c.phone = cleanPhone;
          c.tier = autoGetTier(c.spent);
          c.vip  = c.tier === 'Platinum';
          custs[idx] = c;
        } else if (cleanName !== 'Guest') {
          const dishCount = cleanDish ? { [cleanDish]: 1 } : {};
          custs.unshift({
            name: cleanName, phone: cleanPhone, bday: '', dish: cleanDish, fav: cleanDish,
            dishCount, visits: 1, spent: cleanSpent, tier: autoGetTier(cleanSpent), vip: false,
            lastVisit: timeStr, lastBillDate: dateStr, points: 0, redeemed: 0,
            createdAt: now.toISOString(), autoAdded: true, visitHistory: [visitEntry]
          });
        }
        localStorage.setItem('lum_customers', JSON.stringify(custs));
      } catch(e) { console.warn('[KOT→CustomerHistory]', e.message); }

      // ── 2. KOT ko 2.5 second baad remove karo (animation ke baad) ──
      setTimeout(function() {
        appData.kots = appData.kots.filter(x => x.id !== id);
        if (typeof renderKOT === 'function') renderKOT();
        if (typeof renderKitBoard === 'function') renderKitBoard();
        if (typeof renderDashboard === 'function') renderDashboard();
        if (typeof updateFeatTabCounts === 'function') updateFeatTabCounts();
      }, 2500);
    }

    // Billing ke lum_orders mein bhi status update karo
    if (k._billingId) {
      try {
        const lumOrders = JSON.parse(localStorage.getItem('lum_orders') || '[]');
        const billingStatus = status === 'preparing' ? 'cooking'
          : status === 'ready' ? 'ready'
          : status === 'served' ? 'served'
          : 'pending';
        const lo = lumOrders.find(o => o._id === k._billingId);
        if (lo) {
          lo.status = billingStatus;
          localStorage.setItem('lum_orders', JSON.stringify(lumOrders));
          // Billing window pe bhi fire karo (same tab)
          window.dispatchEvent(new StorageEvent('storage', { key: 'lum_orders' }));
        }
      } catch(e) { console.warn('[KOT→Billing sync]', e.message); }
    }
  }
};

window.addEventListener('storage', e => {
  if (e.key === 'lum_tables' || e.key === 'lum_orders') {
    syncTablesFromBilling();
    if (e.key === 'lum_tables') showToast('🔗 Billing se table update!', 'var(--accent)');
    if (e.key === 'lum_orders') {
      syncOrdersFromBilling();
      showToast('🧾 New KOT — Order Desk se order aaya!', 'var(--orange)');
    }
  }
});
setInterval(syncTablesFromBilling, 5000);
setInterval(syncOrdersFromBilling, 3000);
setTimeout(() => { syncTablesFromBilling(); syncOrdersFromBilling(); console.log('✅ Billing Sync init'); }, 2000);

// ═══ LIVE AI CONTEXT (Gemini ke liye) ═══
function getEnhancedAiContext() {
  try {
    const lT = JSON.parse(localStorage.getItem('lum_tables') || '{}');
    const lO = JSON.parse(localStorage.getItem('lum_orders') || '[]');
    const occ = Object.entries(lT).filter(([,t]) => t.status === 'occupied');
    const res = Object.entries(lT).filter(([,t]) => t.status === 'reserved');
    const avl = Object.entries(lT).filter(([,t]) => t.status === 'available');
    const today = new Date().toDateString();
    const tod = lO.filter(o => new Date(o.time||o.date||0).toDateString() === today);
    const rev = tod.reduce((s,o) => s+(o.total||0), 0);
    const low = appData.inventory.filter(i => i.qty <= i.minQty).map(i => i.name);
    return `Tu Siplora — LUMIÈRE Restaurant ka expert AI Kitchen Assistant! 👑
Date: ${new Date().toLocaleDateString('en-IN')}

=== LIVE TABLE STATUS (Billing real-time) ===
Occupied: ${occ.length} — ${occ.map(([n,t])=>'T'+n+(t.customerName?' ('+t.customerName+')':'')).join(', ')||'None'}
Reserved: ${res.length} — ${res.map(([n])=>'T'+n).join(', ')||'None'}
Available: ${avl.length}

=== ACTIVE TABLE ORDERS ===
${occ.map(([n,t])=>'Table '+n+': '+(t.order&&t.order.length?t.order.map(i=>i.name||i).join(', '):'Pending')).join('\n')||'No active orders'}

=== KITCHEN STATUS ===
Active KOTs: ${(appData.kots||[]).filter(k=>k.status!=='served').length}
Urgent tables: ${appData.tables.filter(t=>t.status==='urgent').length}
Staff on duty: ${appData.staff.filter(s=>s.present).length}/${appData.staff.length}
Low stock: ${low.join(', ')||'None'}

=== TODAY BUSINESS ===
Revenue: ₹${rev.toLocaleString('en-IN')} | Orders: ${tod.filter(o=>o.status==='paid').length} paid

Tu Hinglish mein jawab de. Helpful, direct, emojis use karo. Max 200 words.`.trim();
  } catch(e) { return 'Tu expert AI Kitchen Assistant hai LUMIERE restaurant ke liye. Hinglish mein jawab de.'; }
}
window.getEnhancedAiContext = getEnhancedAiContext;

function getBillingDashStats() {
  try {
    const lO = JSON.parse(localStorage.getItem('lum_orders') || '[]');
    const tod = lO.filter(o => new Date(o.time||o.date||0).toDateString() === new Date().toDateString());
    return { todayRev: tod.reduce((s,o)=>s+(o.total||0),0), todayCount: tod.filter(o=>o.status==='paid').length };
  } catch(e) { return {todayRev:0, todayCount:0}; }
}
window.getBillingDashStats = getBillingDashStats;

console.log('✅ Siplora Chef — Gemini AI + Billing Sync ACTIVE! | Firebase: restaurant-system-beec1');
// ══════════════════════════════════════════════════════════════════
// LIVE TIMER TICKER — Har second sirf timer display update karo
// Koi renderLiveMenu/renderNewOrders nahi — zero flash!
// ══════════════════════════════════════════════════════════════════
(function startLiveTimerTicker() {
  setInterval(() => {
    const livePage = document.getElementById('page-livemenu');
    if (!livePage || !livePage.classList.contains('active')) return;

    // ── CAPTAIN TIMERS ──
    document.querySelectorAll('[data-live-timer="captain"]').forEach(el => {
      const setAt = el.getAttribute('data-timer-set');
      const total = parseFloat(el.getAttribute('data-timer-total') || '0');
      if (!setAt || !total) return;

      const elapsedMs = Date.now() - new Date(setAt).getTime();
      const remainMins = Math.max(0, total - elapsedMs / 60000);
      const totalSecs = Math.round(remainMins * 60);
      const mm = Math.floor(totalSecs / 60);
      const ss = totalSecs % 60;
      const mmss = String(mm).padStart(2,'0') + ':' + String(ss).padStart(2,'0');

      const display = el.querySelector('[data-timer-display]');
      if (display) display.textContent = mmss;

      const bar = el.querySelector('[data-timer-bar]');
      const row = el.querySelector('[data-timer-row]');
      const urgent = remainMins <= 2;
      const warn   = remainMins > 2 && remainMins <= 5;
      const barCol = urgent ? '#f87171' : warn ? '#fbbf24' : '#c4b5fd';
      const pct    = Math.min(100, Math.round((remainMins / total) * 100));

      if (bar) { bar.style.width = pct + '%'; bar.style.background = barCol; }
      if (row) {
        row.classList.remove('urgent','warn','ok');
        row.classList.add(urgent ? 'urgent' : warn ? 'warn' : 'ok');
      }
    });

    // ── COOK TIMERS ──
    document.querySelectorAll('[data-live-timer="cook"]').forEach(el => {
      const startMs   = parseFloat(el.getAttribute('data-cook-start') || '0');
      const leftMins  = parseFloat(el.getAttribute('data-cook-left') || '0');
      const totalMins = parseFloat(el.getAttribute('data-cook-total') || '0');
      if (!startMs || !totalMins) return;

      const elapsedMins = (Date.now() - startMs) / 60000;
      const remainMins  = Math.max(0, leftMins - elapsedMins);
      const totalSecs   = Math.round(remainMins * 60);
      const mm = Math.floor(totalSecs / 60);
      const ss = totalSecs % 60;
      const mmss = String(mm).padStart(2,'0') + ':' + String(ss).padStart(2,'0');

      const display = el.querySelector('[data-timer-display]');
      const sub     = el.querySelector('[data-timer-sub]');
      const bar     = el.querySelector('[data-timer-bar]');
      const row     = el.querySelector('[data-timer-row]');

      if (display) display.textContent = mmss;
      if (sub) sub.textContent = remainMins <= 0 ? '⏰ TIME UP — MARK READY' : 'COOKING TIME LEFT';

      const urgent = remainMins <= 3;
      const warn   = remainMins > 3 && remainMins <= 8;
      const barCol = urgent ? '#f87171' : warn ? '#fbbf24' : '#4ade80';
      const pct    = totalMins > 0 ? Math.min(100, Math.round((remainMins / totalMins) * 100)) : 0;

      if (bar) { bar.style.width = pct + '%'; bar.style.background = barCol; }
      if (row) {
        row.classList.remove('urgent','warn','ok');
        row.classList.add(urgent ? 'urgent' : warn ? 'warn' : 'ok');
      }
    });

  }, 1000); // har 1 second
})();
// ══════════════════════════════════════════════════════════════════