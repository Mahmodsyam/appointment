const fs = require('fs');
const path = require('path');
const cfg = require('./config.js');

console.log('--- Running Deep Logic & State Simulation ---');

// Mock localStorage
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

// Create mock state
function createInitialState() {
  return {
    currentStep: 0,
    city: null,
    food: null,
    dessert: null,
    day: null,
    time: null,
    addons: [],
    note: ''
  };
}

let state = createInitialState();

// Test City Switch Logic
console.log('Simulation 1: Testing City Switch Resets Food and Dessert...');
const deir = cfg.cities.find(c => c.name === 'دير البلح');
const ky = cfg.cities.find(c => c.name === 'خان يونس');

// Select Deir Al Balah and choices
state.city = deir;
state.food = deir.foodPlaces[0]; // الباشا
state.dessert = deir.dessertPlaces[0]; // دهب

if (state.food.name !== 'الباشا' || state.dessert.name !== 'دهب') {
  throw new Error('Initial selection failed');
}

// Switch city to Khan Younis
function selectCity(newCity) {
  if (state.city && state.city.id !== newCity.id) {
    state.food = null;
    state.dessert = null;
  }
  state.city = newCity;
}

selectCity(ky);
if (state.city.name !== 'خان يونس') throw new Error('City did not switch');
if (state.food !== null) throw new Error('Food was not reset when switching city');
if (state.dessert !== null) throw new Error('Dessert was not reset when switching city');
console.log('✓ City change correctly resets food and dessert.');

// Test Validation Logic
console.log('Simulation 2: Testing Step-by-Step Validation...');
function canAdvance(step, stateObj) {
  if (step === 1 && !stateObj.city) return false;
  if (step === 2 && !stateObj.food) return false;
  if (step === 3 && !stateObj.dessert) return false;
  if (step === 4 && !stateObj.day) return false;
  if (step === 5 && !stateObj.time) return false;
  return true;
}

state = createInitialState();
if (canAdvance(1, state)) throw new Error('Should block Step 1 when city is null');
state.city = ky;
if (!canAdvance(1, state)) throw new Error('Should allow Step 1 when city is selected');

if (canAdvance(2, state)) throw new Error('Should block Step 2 when food is null');
state.food = ky.foodPlaces[1]; // الهنا
if (!canAdvance(2, state)) throw new Error('Should allow Step 2 when food is selected');

if (canAdvance(3, state)) throw new Error('Should block Step 3 when dessert is null');
state.dessert = ky.dessertPlaces[1]; // قصر الدى
if (!canAdvance(3, state)) throw new Error('Should allow Step 3 when dessert is selected');

console.log('✓ Step-by-step validation verified.');

// Test WhatsApp Message Generation
console.log('Simulation 3: Testing WhatsApp message formatting...');
state.day = { fullTitle: 'الجمعة، 10 أكتوبر' };
state.time = { label: '٥:٠٠ مساءً' };
state.addons = ['coffee', 'photos'];
state.note = 'مشتاقة لشوفتك يا روحي 💛';

function generateAppointmentMessage(s) {
  const cityName = s.city ? s.city.name : 'غير محدد';
  const foodName = s.food ? s.food.name : 'غير محدد';
  const dessertName = s.dessert ? s.dessert.name : 'غير محدد';
  const dayName = s.day ? s.day.fullTitle : 'غير محدد';
  const timeLabel = s.time ? s.time.label : 'غير محدد';

  let addonsText = 'بدون إضافات';
  if (s.addons && s.addons.length > 0) {
    addonsText = s.addons.map(id => {
      const item = cfg.addons.find(a => a.id === id);
      return item ? `${item.label} ${item.icon}` : id;
    }).join(' ، ');
  }

  let text = `محمود 💛 اخترت تفاصيل طلعتنا (عبر روبوتك الذكي 🤖):\n\n` +
    `📍 المدينة: ${cityName}\n` +
    `😋 محل الأكل: ${foodName}\n` +
    `🍰 محل التحلاية: ${dessertName}\n` +
    `🗓️ اليوم والتاريخ: ${dayName}\n` +
    `🕓 الساعة: ${timeLabel}\n` +
    `✨ الإضافات: ${addonsText}\n`;

  if (s.note && s.note.trim().length > 0) {
    text += `💌 ملاحظة شروق: ${s.note.trim()}\n`;
  }

  text += `\nأحلى تفصيل بالدنيا كلها إنك معي 💛 — م. محمود صيام`;
  return text;
}

const msg = generateAppointmentMessage(state);
console.log('Generated Message:\n' + msg);

if (!msg.includes('محمود 💛 اخترت تفاصيل طلعتنا')) throw new Error('Header missing');
if (!msg.includes('📍 المدينة: خان يونس')) throw new Error('City missing');
if (!msg.includes('😋 محل الأكل: الهنا')) throw new Error('Food missing');
if (!msg.includes('🍰 محل التحلاية: قصر الدى')) throw new Error('Dessert missing');
if (!msg.includes('🗓️ اليوم والتاريخ: الجمعة، 10 أكتوبر')) throw new Error('Day missing');
if (!msg.includes('🕓 الساعة: ٥:٠٠ مساءً')) throw new Error('Time missing');
if (!msg.includes('قهوة سوا ☕')) throw new Error('Addon coffee missing');
if (!msg.includes('نتصوّر صور حلوة 📸')) throw new Error('Addon photos missing');
if (!msg.includes('مشتاقة لشوفتك يا روحي 💛')) throw new Error('Note missing');
if (!msg.includes('م. محمود صيام')) throw new Error('Developer signature missing');

console.log('✓ WhatsApp Message correctly constructed.');

// Test Runaway phrases
console.log('Simulation 4: Testing Runaway Phrases Sequence...');
const phrases = cfg.invitation.noEscapePhrases;
for (let i = 0; i < 10; i++) {
  const phrase = phrases[i % phrases.length];
  if (!phrase) throw new Error(`Dodge index ${i} yielded null`);
}
console.log('✓ Dodge phrase cycling verified.');

// Test Custom Time Formatting
console.log('Simulation 5: Testing Custom Time selection and formatting...');
state.time = { label: '١:٤٥ ظهرًا (موعد مخصص ⏱️)', isCustom: true };
const customMsg = generateAppointmentMessage(state);
if (!customMsg.includes('🕓 الساعة: ١:٤٥ ظهرًا (موعد مخصص ⏱️)')) {
  throw new Error('Custom time did not format in WhatsApp message');
}
console.log('✓ Custom time selection properly handled.');

// Test Blocked Days logic
console.log('Simulation 6: Testing Blocked Days comedy comments...');
function getBlockedDayComment(dayName) {
  if (!dayName || !cfg.blockedDaysComments) return null;
  const clean = dayName.replace(/[\u0625\u0623\u0622]/g, 'ا');
  if (clean.includes('سبت')) return cfg.blockedDaysComments['السبت'];
  if (clean.includes('احد')) return cfg.blockedDaysComments['الأحد'];
  if (clean.includes('اثنين')) return cfg.blockedDaysComments['الإثنين'];
  if (clean.includes('خميس')) return cfg.blockedDaysComments['الخميس'];
  return null;
}

const satComment = getBlockedDayComment('السبت');
if (!satComment || !satComment.includes('اليوم هذاك خلص ما بنفع')) throw new Error('Saturday block comment missing');

const sunComment = getBlockedDayComment('الأحد');
if (!sunComment || !sunComment.includes('عليا تحضير ومش هقدر')) throw new Error('Sunday block comment missing');

const monComment = getBlockedDayComment('الإثنين');
if (!monComment || !monComment.includes('عندي محاضرة في غزة')) throw new Error('Monday block comment missing');

const thuComment = getBlockedDayComment('الخميس');
if (!thuComment || !thuComment.includes('بجيكم عمر')) throw new Error('Thursday block comment missing');

if (getBlockedDayComment('الثلاثاء') !== null) throw new Error('Tuesday should not be blocked');
if (getBlockedDayComment('الأربعاء') !== null) throw new Error('Wednesday should not be blocked');
if (getBlockedDayComment('الجمعة') !== null) throw new Error('Friday should not be blocked');
console.log('✓ Blocked days correctly validated with playful remarks.');

// Test Home Visit Path and Gift Message
console.log('Simulation 7: Testing Home Visit path and gift message...');
const homeState = {
  meetType: 'home',
  day: { fullTitle: 'الثلاثاء، 13 أكتوبر' },
  time: { label: '٦:٠٠ مساءً' },
  gift: 'بوكيه ورد جوري أحمر 💐',
  note: 'مجهزة فنجان قهوة وحلى طيب ☕'
};

function generateAppointmentMessageAll(s) {
  const dayName = s.day ? s.day.fullTitle : 'غير محدد';
  const timeLabel = s.time ? s.time.label : 'غير محدد';

  if (s.meetType === 'home') {
    let text = `محمود 💛 اخترت تفاصيل طلعتنا (عبر روبوتك الذكي 🤖):\n\n` +
      `🏡 نوع الموعد: تيجي عندي بالبيت يا روحي 🏡💛\n` +
      `🗓️ اليوم والتاريخ: ${dayName}\n` +
      `🕓 الساعة: ${timeLabel}\n`;

    if (s.gift && s.gift.trim().length > 0) {
      text += `🎁 الهدية اللي عبالي تجيبها معك: ${s.gift.trim()}\n`;
    } else {
      text += `🎁 الهدية: مفاجأة حلوة على ذوق محمود 🎀\n`;
    }

    if (s.note && s.note.trim().length > 0) {
      text += `💌 ملاحظة شروق: ${s.note.trim()}\n`;
    }

    text += `\nأحلى تفصيل بالدنيا كلها إنك معي 💛 — م. محمود صيام`;
    return text;
  }

  return generateAppointmentMessage(s);
}

const homeMsg = generateAppointmentMessageAll(homeState);
console.log('Generated Home Visit Message:\n' + homeMsg);
if (!homeMsg.includes('🏡 نوع الموعد: تيجي عندي بالبيت يا روحي 🏡💛')) throw new Error('Home meet type missing');
if (!homeMsg.includes('🎁 الهدية اللي عبالي تجيبها معك: بوكيه ورد جوري أحمر 💐')) throw new Error('Home gift missing');
if (!homeMsg.includes('💌 ملاحظة شروق: مجهزة فنجان قهوة وحلى طيب ☕')) throw new Error('Home note missing');
if (homeMsg.includes('📍 المدينة')) throw new Error('City should not appear in home visit message');
console.log('✓ Home Visit message properly generated with gift and custom fields.');

console.log('\n🌟 ALL SIMULATION TESTS PASSED! 🌟');
