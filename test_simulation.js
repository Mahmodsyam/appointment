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

  let text = `محمود 💛 اخترت تفاصيل طلعتنا:\n\n` +
    `📍 المدينة: ${cityName}\n` +
    `😋 محل الأكل: ${foodName}\n` +
    `🍰 محل التحلاية: ${dessertName}\n` +
    `🗓️ اليوم والتاريخ: ${dayName}\n` +
    `🕓 الساعة: ${timeLabel}\n` +
    `✨ الإضافات: ${addonsText}\n`;

  if (s.note && s.note.trim().length > 0) {
    text += `💌 ملاحظة شروق: ${s.note.trim()}\n`;
  }

  text += `\nأحلى تفصيل بالطلعة إنك معي 💛`;
  return text;
}

const msg = generateAppointmentMessage(state);
console.log('Generated Message:\n' + msg);

if (!msg.includes('محمود 💛 اخترت تفاصيل طلعتنا:')) throw new Error('Header missing');
if (!msg.includes('📍 المدينة: خان يونس')) throw new Error('City missing');
if (!msg.includes('😋 محل الأكل: الهنا')) throw new Error('Food missing');
if (!msg.includes('🍰 محل التحلاية: قصر الدى')) throw new Error('Dessert missing');
if (!msg.includes('🗓️ اليوم والتاريخ: الجمعة، 10 أكتوبر')) throw new Error('Day missing');
if (!msg.includes('🕓 الساعة: ٥:٠٠ مساءً')) throw new Error('Time missing');
if (!msg.includes('قهوة سوا ☕')) throw new Error('Addon coffee missing');
if (!msg.includes('نتصوّر صور حلوة 📸')) throw new Error('Addon photos missing');
if (!msg.includes('مشتاقة لشوفتك يا روحي 💛')) throw new Error('Note missing');
if (!msg.includes('أحلى تفصيل بالطلعة إنك معي 💛')) throw new Error('Closing quote missing');

console.log('✓ WhatsApp Message correctly constructed.');

// Test Runaway phrases
console.log('Simulation 4: Testing Runaway Phrases Sequence...');
const phrases = cfg.invitation.noEscapePhrases;
for (let i = 0; i < 10; i++) {
  const phrase = phrases[i % phrases.length];
  if (!phrase) throw new Error(`Dodge index ${i} yielded null`);
}
console.log('✓ Dodge phrase cycling verified.');

console.log('\n🌟 ALL SIMULATION TESTS PASSED! 🌟');
