const fs = require('fs');
const path = require('path');
const cfg = require('./config.js');

console.log('--- Starting Verification Suite ---');

// 1. Verify Configuration & Names
function testConfig() {
  console.log('Test 1: Testing Names and Texts...');
  if (cfg.fianceeName !== 'شروق') throw new Error(`fianceeName should be شروق, got ${cfg.fianceeName}`);
  if (cfg.fianceName !== 'محمود') throw new Error(`fianceName should be محمود, got ${cfg.fianceName}`);
  
  if (!cfg.invitation.question.includes('بدّك نطلع سوا؟')) throw new Error('Invitation question mismatch');
  if (!cfg.invitation.subtitle.includes('عندي موعد مع أحلى إنسانة')) throw new Error('Invitation subtitle mismatch');
  if (!cfg.invitation.yesBtn.includes('نعم')) throw new Error('Yes button text mismatch');
  if (!cfg.invitation.noBtn.includes('لا')) throw new Error('No button text mismatch');
  
  // Verify Escape phrases
  const expectedPhrases = [
    'متأكدة يا شروق؟ 🥺',
    'شكله الزر مش موافق 😂',
    'طيب فكّري كمان شوي 🙈',
    'جرّبي الزر الثاني، شكله ألطف 😍'
  ];
  for (const p of expectedPhrases) {
    if (!cfg.invitation.noEscapePhrases.includes(p)) {
      throw new Error(`Missing expected dodge phrase: ${p}`);
    }
  }

  // Acceptance messages
  if (!cfg.invitation.acceptedTitle.includes('كنت عارف إنك رح توافقي يا شروق')) {
    throw new Error('Accepted title mismatch');
  }
  if (!cfg.invitation.acceptedSubtitle.includes('يلا نختار تفاصيل طلعتنا')) {
    throw new Error('Accepted subtitle mismatch');
  }

  console.log('✓ Names and invitation texts verified.');

  // 2. Cities & Shops Exact Names
  console.log('Test 2: Testing Cities & Places exact names...');
  const deir = cfg.cities.find(c => c.name === 'دير البلح');
  if (!deir) throw new Error('Missing city: دير البلح');
  const deirFood = deir.foodPlaces.map(p => p.name);
  const expectedDeirFood = ['الباشا', 'حدوتة', 'العمدة', 'شاورما الكحلوت', 'شاورما نصار'];
  if (JSON.stringify(deirFood.sort()) !== JSON.stringify(expectedDeirFood.sort())) {
    throw new Error(`Deir food mismatch: expected ${expectedDeirFood}, got ${deirFood}`);
  }
  const deirDessert = deir.dessertPlaces.map(p => p.name);
  const expectedDeirDessert = ['دهب', 'القاضي', 'ساقالله', 'فستق حلب'];
  if (JSON.stringify(deirDessert.sort()) !== JSON.stringify(expectedDeirDessert.sort())) {
    throw new Error(`Deir dessert mismatch: expected ${expectedDeirDessert}, got ${deirDessert}`);
  }

  const ky = cfg.cities.find(c => c.name === 'خان يونس');
  if (!ky) throw new Error('Missing city: خان يونس');
  const kyFood = ky.foodPlaces.map(p => p.name);
  const expectedKyFood = ['أمجد', 'الهنا', 'سنابل', 'الساند بيتش', 'كرزة'];
  if (JSON.stringify(kyFood.sort()) !== JSON.stringify(expectedKyFood.sort())) {
    throw new Error(`Khan Younis food mismatch: expected ${expectedKyFood}, got ${kyFood}`);
  }
  const kyDessert = ky.dessertPlaces.map(p => p.name);
  const expectedKyDessert = ['دهب', 'قصر الدى', 'محلات النص'];
  if (JSON.stringify(kyDessert.sort()) !== JSON.stringify(expectedKyDessert.sort())) {
    throw new Error(`Khan Younis dessert mismatch: expected ${expectedKyDessert}, got ${kyDessert}`);
  }

  console.log('✓ Cities and exact shop names verified.');

  // 3. Days & Times Config
  console.log('Test 3: Testing Days and Times config...');
  if (cfg.daysConfig.dateRange && cfg.daysConfig.dateRange.enabled) {
    if (cfg.daysConfig.dateRange.startDate !== '2026-10-10' || cfg.daysConfig.dateRange.endDate !== '2026-10-17') {
      throw new Error('Date range should be 2026-10-10 to 2026-10-17');
    }
  }
  if (cfg.defaultTimeSlots.length < 3) {
    throw new Error('Default time slots must have at least 3 times');
  }
  const timeLabels = cfg.defaultTimeSlots.map(t => t.label);
  ['١٢:٠٠ ظهرًا', '١:٣٠ ظهرًا', '٣:٠٠ عصرًا'].forEach(t => {
    if (!timeLabels.includes(t)) throw new Error(`Missing default time: ${t}`);
  });

  console.log('✓ Days and Times config verified.');

  // 4. Addons
  console.log('Test 4: Testing Add-ons...');
  const addonLabels = cfg.addons.map(a => a.label);
  ['قهوة سوا', 'تمشاية', 'نتصوّر صور حلوة', 'مفاجأة من محمود'].forEach(a => {
    if (!addonLabels.includes(a)) throw new Error(`Missing add-on: ${a}`);
  });

  console.log('✓ Addons verified.');

  // 5. Footer & Quote
  console.log('Test 5: Testing Footer and Quote...');
  if (!cfg.uiTexts.footerText.includes('صُمّم وطُوّر بكل حب بواسطة محمود، خطيب شروق')) {
    throw new Error('Footer text mismatch');
  }
  if (!cfg.uiTexts.summaryLoveQuote.includes('أحلى تفصيل بالطلعة إنك معي 💛 — محمود')) {
    throw new Error('Summary love quote mismatch');
  }
  console.log('✓ Footer and love quote verified.');
}

// 6. Verify HTML content
function testHtml() {
  console.log('Test 6: Testing HTML markup...');
  const html = fs.readFileSync(path.join(__dirname, './index.html'), 'utf-8');
  
  if (!html.includes('lang="ar"')) throw new Error('HTML must specify lang="ar"');
  if (!html.includes('dir="rtl"')) throw new Error('HTML must specify dir="rtl"');
  if (!html.includes('btnNo')) throw new Error('HTML must contain btnNo');
  if (!html.includes('btnYes')) throw new Error('HTML must contain btnYes');
  if (!html.includes('invitationArena')) throw new Error('HTML must contain invitationArena');
  if (!html.includes('dodgeSpeechBubble')) throw new Error('HTML must contain dodgeSpeechBubble');
  if (!html.includes('btnSendWhatsApp')) throw new Error('HTML must contain btnSendWhatsApp');
  if (!html.includes('btnCopyDetails')) throw new Error('HTML must contain btnCopyDetails');
  if (!html.includes('btnEditChoices')) throw new Error('HTML must contain btnEditChoices');
  if (!html.includes('btnResetApp')) throw new Error('HTML must contain btnResetApp');
  if (!html.includes('btnSkipAddons')) throw new Error('HTML must contain btnSkipAddons');
  if (!html.includes('personalNoteInput')) throw new Error('HTML must contain personalNoteInput');
  if (!html.includes('customDateInput')) throw new Error('HTML must contain customDateInput');
  if (!html.includes('btnToggleCustomTime')) throw new Error('HTML must contain btnToggleCustomTime');
  if (!html.includes('customTimeInput')) throw new Error('HTML must contain customTimeInput');
  if (!html.includes('customTimePickerBox')) throw new Error('HTML must contain customTimePickerBox');

  console.log('✓ HTML semantic and interactive markup verified.');
}

// 7. Verify CSS
function testCss() {
  console.log('Test 7: Testing CSS styles...');
  const css = fs.readFileSync(path.join(__dirname, './style.css'), 'utf-8');
  
  if (!css.includes('direction: rtl')) throw new Error('CSS must set RTL direction');
  if (!css.includes('--primary-rose')) throw new Error('CSS must have romantic rose palette');
  if (!css.includes('invitation-arena')) throw new Error('CSS must style invitation arena');
  if (!css.includes('overflow-x: hidden')) throw new Error('CSS must prevent horizontal scroll');
  if (!css.includes('@media (max-width: 480px)')) throw new Error('CSS must have mobile media queries');

  console.log('✓ CSS responsive and romantic styling verified.');
}

try {
  testConfig();
  testHtml();
  testCss();
  console.log('\n🌟 ALL AUTOMATED VERIFICATION CHECKS PASSED SUCCESSFULLY! 🌟');
} catch (err) {
  console.error('\n❌ Verification Failed:', err.message);
  process.exit(1);
}
