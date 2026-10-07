/**
 * ====================================================================
 * موعدنا 💛 — محمود وشروق | ملف المنطق البرمجي والتفاعلي JavaScript
 * ====================================================================
 */

(function () {
  'use strict';

  // ------------------------------------------------------------------
  // 1. حالة التطبيق (State Management)
  // ------------------------------------------------------------------
  const STORAGE_KEY = 'mahmoud_shorouq_appointment_draft_v1';

  let state = {
    currentStep: 0, // 0: شاشة الدعوة، 1: المدينة، 2: الأكل، 3: التحلاية، 4: اليوم، 5: الساعة، 6: الإضافات، 7: الملخص
    city: null,      // كائن المدينة المختارة
    food: null,      // كائن محل الأكل
    dessert: null,   // كائن محل التحلاية
    day: null,       // كائن اليوم والتاريخ
    time: null,      // كائن الساعة
    addons: [],      // مصفوفة معرّفات الإضافات المختارة
    note: ''         // الملاحظة الشخصية
  };

  let dodgeCount = 0;
  let isDodgeAnimating = false;

  // عناصر DOM الأساسية
  const elements = {
    mainContent: document.getElementById('mainContent'),
    headerTitle: document.getElementById('headerTitle'),
    progressSection: document.getElementById('progressSection'),
    progressStepName: document.getElementById('progressStepName'),
    progressCounter: document.getElementById('progressCounter'),
    progressBarFill: document.getElementById('progressBarFill'),
    stepPills: document.querySelectorAll('.step-pill'),
    
    // شاشة البداية
    step0: document.getElementById('step-0'),
    invitationBadge: document.getElementById('invitationBadge'),
    invitationQuestion: document.getElementById('invitationQuestion'),
    invitationSubtitle: document.getElementById('invitationSubtitle'),
    invitationArena: document.getElementById('invitationArena'),
    dodgeSpeechBubble: document.getElementById('dodgeSpeechBubble'),
    buttonsRow: document.getElementById('buttonsRow'),
    btnYes: document.getElementById('btnYes'),
    btnYesText: document.getElementById('btnYesText'),
    btnNo: document.getElementById('btnNo'),
    btnNoText: document.getElementById('btnNoText'),
    
    // خطوات الاختيار
    step1: document.getElementById('step-1'),
    cityOptionsGrid: document.getElementById('cityOptionsGrid'),
    
    step2: document.getElementById('step-2'),
    foodOptionsGrid: document.getElementById('foodOptionsGrid'),
    
    step3: document.getElementById('step-3'),
    dessertOptionsGrid: document.getElementById('dessertOptionsGrid'),
    
    step4: document.getElementById('step-4'),
    daysOptionsGrid: document.getElementById('daysOptionsGrid'),
    btnToggleCustomDate: document.getElementById('btnToggleCustomDate'),
    customDatePickerBox: document.getElementById('customDatePickerBox'),
    customDateInput: document.getElementById('customDateInput'),
    
    step5: document.getElementById('step-5'),
    timeOptionsList: document.getElementById('timeOptionsList'),
    
    step6: document.getElementById('step-6'),
    addonsGrid: document.getElementById('addonsGrid'),
    btnSkipAddons: document.getElementById('btnSkipAddons'),
    personalNoteInput: document.getElementById('personalNoteInput'),
    noteInputLabel: document.getElementById('noteInputLabel'),
    
    // الملخص
    step7: document.getElementById('step-7'),
    summaryTitle: document.getElementById('summaryTitle'),
    summaryCityVal: document.getElementById('summaryCityVal'),
    summaryFoodVal: document.getElementById('summaryFoodVal'),
    summaryDessertVal: document.getElementById('summaryDessertVal'),
    summaryDayVal: document.getElementById('summaryDayVal'),
    summaryTimeVal: document.getElementById('summaryTimeVal'),
    summaryAddonsVal: document.getElementById('summaryAddonsVal'),
    summaryNoteBox: document.getElementById('summaryNoteBox'),
    summaryNoteVal: document.getElementById('summaryNoteVal'),
    summaryLoveQuote: document.getElementById('summaryLoveQuote'),
    btnSendWhatsApp: document.getElementById('btnSendWhatsApp'),
    btnCopyDetails: document.getElementById('btnCopyDetails'),
    btnEditChoices: document.getElementById('btnEditChoices'),
    btnResetApp: document.getElementById('btnResetApp'),
    
    // شريط التنقل
    navigationBar: document.getElementById('navigationBar'),
    btnNext: document.getElementById('btnNext'),
    btnPrev: document.getElementById('btnPrev'),
    
    // التذييل
    footerText: document.getElementById('footerText'),
    
    // النوافذ المنبثقة والإشعارات
    celebrationModal: document.getElementById('celebrationModal'),
    modalTitle: document.getElementById('modalTitle'),
    btnStartPlanning: document.getElementById('btnStartPlanning'),
    
    confirmResetModal: document.getElementById('confirmResetModal'),
    btnConfirmReset: document.getElementById('btnConfirmReset'),
    btnCancelReset: document.getElementById('btnCancelReset'),
    
    toastAlert: document.getElementById('toastAlert'),
    toastIcon: document.getElementById('toastIcon'),
    toastMessage: document.getElementById('toastMessage'),
    
    // كانفاس الاحتفال وخلفية القلوب
    confettiCanvas: document.getElementById('confettiCanvas'),
    heartsBackground: document.getElementById('heartsBackground')
  };

  // ------------------------------------------------------------------
  // 2. التهيئة الأولية عند تحميل الصفحة
  // ------------------------------------------------------------------
  function initApp() {
    applyConfigTexts();
    setupRunawayNoButton();
    setupFloatingHearts();
    setupNavigationEvents();
    setupCustomDatePicker();
    setupAddonsEvents();
    setupSummaryActions();
    loadDraftFromStorage();
  }

  // تطبيق النصوص المخصصة من ملف الإعدادات
  function applyConfigTexts() {
    if (!window.APP_CONFIG) return;
    const cfg = window.APP_CONFIG;

    document.title = cfg.uiTexts.siteTitle || document.title;
    elements.headerTitle.textContent = cfg.uiTexts.siteTitle;
    
    // شاشة الدعوة
    elements.invitationBadge.textContent = cfg.invitation.badge;
    elements.invitationQuestion.textContent = cfg.invitation.question;
    elements.invitationSubtitle.textContent = cfg.invitation.subtitle;
    elements.btnYesText.textContent = cfg.invitation.yesBtn;
    elements.btnNoText.textContent = cfg.invitation.noBtn;
    
    // عناوين الخطوات
    document.getElementById('step1Title').textContent = cfg.uiTexts.stepTitles.city;
    document.getElementById('step2Title').textContent = cfg.uiTexts.stepTitles.food;
    document.getElementById('step3Title').textContent = cfg.uiTexts.stepTitles.dessert;
    document.getElementById('step4Title').textContent = cfg.uiTexts.stepTitles.day;
    document.getElementById('step5Title').textContent = cfg.uiTexts.stepTitles.time;
    document.getElementById('step6Title').textContent = cfg.uiTexts.stepTitles.addons;
    elements.summaryTitle.textContent = cfg.uiTexts.stepTitles.summary;
    
    // نصوص الإضافات والملاحظة
    elements.noteInputLabel.textContent = cfg.uiTexts.noteLabel;
    elements.personalNoteInput.placeholder = cfg.uiTexts.notePlaceholder;
    elements.summaryLoveQuote.textContent = cfg.uiTexts.summaryLoveQuote;
    
    // التذييل
    elements.footerText.innerHTML = `${cfg.uiTexts.footerText} <span class="footer-heart">💛</span>`;
  }

  // ------------------------------------------------------------------
  // 3. سلوك زر «لا» الهارب (Runaway "No" Button)
  // ------------------------------------------------------------------
  // تتبع إزاحة زر «لا» الحالية
  let currentDodgeX = 0;
  let currentDodgeY = 0;

  // إعادة ضبط موضع زر «لا» الهارب
  function resetNoButtonPosition() {
    const btnNo = elements.btnNo;
    if (!btnNo) return;
    currentDodgeX = 0;
    currentDodgeY = 0;
    btnNo.classList.remove('escaped');
    btnNo.style.transform = '';
  }

  // ------------------------------------------------------------------
  // 3. سلوك زر «لا» الهارب المعتدل داخل ساحة الدعوة (Runaway "No" Button)
  // ------------------------------------------------------------------
  function setupRunawayNoButton() {
    const btnNo = elements.btnNo;
    const btnYes = elements.btnYes;
    const arena = elements.invitationArena;
    const bubble = elements.dodgeSpeechBubble;
    const phrases = APP_CONFIG.invitation.noEscapePhrases;

    // دالة هروب الزر بحركة معتدلة ومرحة وثابتة داخل البطاقة تمنع اختفاءه إطلاقًا
    function dodge() {
      if (state.currentStep !== 0) return;
      if (isDodgeAnimating) return;
      isDodgeAnimating = true;

      const arenaRect = arena.getBoundingClientRect();
      const btnYesRect = btnYes.getBoundingClientRect();
      const btnNoRect = btnNo.getBoundingClientRect();

      // الموضع الأساسي للزر بدون الإزاحة الحالية
      const baseLeft = btnNoRect.left - currentDodgeX;
      const baseTop = btnNoRect.top - currentDodgeY;
      const baseRight = btnNoRect.right - currentDodgeX;
      const baseBottom = btnNoRect.bottom - currentDodgeY;

      // حدود الأمان القصوى للإزاحة لضمان البقاء داخل الساحة 100%
      const padding = 15;
      const minDx = (arenaRect.left + padding) - baseLeft;
      const maxDx = (arenaRect.right - padding) - baseRight;
      const minDy = (arenaRect.top + 45) - baseTop; // مساحة لفقاعة الكلام بالأعلى
      const maxDy = (arenaRect.bottom - padding) - baseBottom;

      const candidates = [];
      const angles = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4];

      for (let i = 0; i < angles.length; i++) {
        const angle = angles[i] + (Math.random() - 0.5) * 0.4;
        const jumpDist = 65 + Math.random() * 40; // مسافة قفزة معتدلة ولطيفة (65 إلى 105 بكسل)

        let testDx = currentDodgeX + Math.cos(angle) * jumpDist;
        let testDy = currentDodgeY + Math.sin(angle) * jumpDist;

        // قيد الإزاحة داخل حدود الساحة بدقة مطلقة
        testDx = Math.max(minDx, Math.min(maxDx, testDx));
        testDy = Math.max(minDy, Math.min(maxDy, testDy));

        // حساب الموضع الفعلي المرتقب للزر
        const candidateLeft = baseLeft + testDx;
        const candidateRight = baseRight + testDx;
        const candidateTop = baseTop + testDy;
        const candidateBottom = baseBottom + testDy;

        // التحقق من عدم التداخل مع زر «نعم»
        const overlapYes = !(
          candidateRight < btnYesRect.left - 15 ||
          candidateLeft > btnYesRect.right + 15 ||
          candidateBottom < btnYesRect.top - 10 ||
          candidateTop > btnYesRect.bottom + 10
        );

        // التحقق من أن القفزة محسوسة
        const actualMove = Math.hypot(testDx - currentDodgeX, testDy - currentDodgeY);

        if (!overlapYes && actualMove >= 45) {
          candidates.push({ dx: testDx, dy: testDy, move: actualMove });
        }
      }

      let chosenDx = currentDodgeX;
      let chosenDy = currentDodgeY;

      if (candidates.length > 0) {
        // اختيار إحدى القفزات الصالحة عشوائيًا
        const picked = candidates[Math.floor(Math.random() * candidates.length)];
        chosenDx = Math.round(picked.dx);
        chosenDy = Math.round(picked.dy);
      } else {
        // خيار احتياطي آمن: عكس الاتجاه الرأسي
        chosenDy = currentDodgeY <= 0 ? Math.round(maxDy - 10) : Math.round(minDy + 10);
        chosenDx = Math.round(Math.max(minDx, Math.min(maxDx, -currentDodgeX)));
      }

      currentDodgeX = chosenDx;
      currentDodgeY = chosenDy;

      // تطبيق الحركة عبر transform بسلاسة وسرعة
      const randomTilt = (Math.random() - 0.5) * 16;
      btnNo.classList.add('escaped');
      btnNo.style.transform = `translate(${currentDodgeX}px, ${currentDodgeY}px) rotate(${randomTilt}deg)`;

      setTimeout(() => {
        isDodgeAnimating = false;
      }, 220);

      // إظهار العبارة الطريفة بالتتابع
      showDodgePhrase();
    }

    function showDodgePhrase() {
      const phrase = phrases[dodgeCount % phrases.length];
      dodgeCount++;
      bubble.textContent = phrase;
      bubble.classList.add('show');

      clearTimeout(bubble._timer);
      bubble._timer = setTimeout(() => {
        bubble.classList.remove('show');
      }, 2500);
    }

    // استشعار اقتراب مؤشر الفأرة داخل ساحة الدعوة
    arena.addEventListener('mousemove', function (e) {
      if (state.currentStep !== 0) return;
      if (isDodgeAnimating) return;

      const rect = btnNo.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);

      // يهرب عندما يقترب المؤشر لمسافة 50 بكسل
      if (distance < 50) {
        dodge();
      }
    });

    // على الكمبيوتر: عند محاولة دخول الزر مباشرة
    btnNo.addEventListener('mouseenter', function (e) {
      e.preventDefault();
      dodge();
    });

    // على الهاتف: عند لمسه (touchstart / pointerdown)
    btnNo.addEventListener('touchstart', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dodge();
    }, { passive: false });

    btnNo.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dodge();
    });

    // منع أي نقرة متبقية من تفعيل أي خيار أو نقل لأي خطوة
    btnNo.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dodge();
    });

    // سلوك زر «نعم 😍»
    elements.btnYes.addEventListener('click', function () {
      handleAcceptInvitation();
    });
  }

  // معالجة قبول الدعوة عند الضغط على «نعم 😍»
  function handleAcceptInvitation() {
    // إطلاق القلوب والكونفيتي الاحتفالي
    launchConfetti();
    launchFloatingHeartsBurst();

    // إظهار نافذة الاحتفال
    elements.modalTitle.textContent = APP_CONFIG.invitation.acceptedTitle;
    elements.celebrationModal.classList.add('show');

    elements.btnStartPlanning.onclick = function () {
      elements.celebrationModal.classList.remove('show');
      goToStep(1);
    };

    // الانتقال التلقائي السلس بعد 2.5 ثانية إن لم تضغط
    setTimeout(() => {
      if (elements.celebrationModal.classList.contains('show')) {
        elements.celebrationModal.classList.remove('show');
        if (state.currentStep === 0) {
          goToStep(1);
        }
      }
    }, 2800);
  }

  // ------------------------------------------------------------------
  // 4. بناء الخيارات لكل خطوة (Step Renderers)
  // ------------------------------------------------------------------

  // الخطوة ١: المدينة
  function renderCityStep() {
    const grid = elements.cityOptionsGrid;
    grid.innerHTML = '';

    APP_CONFIG.cities.forEach(city => {
      const card = document.createElement('div');
      card.className = `option-card ${state.city && state.city.id === city.id ? 'selected' : ''}`;
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', state.city && state.city.id === city.id ? 'true' : 'false');
      card.tabIndex = 0;

      card.innerHTML = `
        <div class="check-badge" aria-hidden="true">✓</div>
        <div class="option-card-icon">${city.icon}</div>
        <div class="option-card-title">${city.name}</div>
        <div class="option-card-desc">${city.description}</div>
      `;

      card.addEventListener('click', () => {
        selectCity(city);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectCity(city);
        }
      });

      grid.appendChild(card);
    });
  }

  function selectCity(city) {
    // إذا تغيرت المدينة، امسح اختيارات الأكل والتحلاية السابقة
    if (state.city && state.city.id !== city.id) {
      state.food = null;
      state.dessert = null;
    }

    state.city = city;
    saveDraftToStorage();
    renderCityStep();
  }

  // الخطوة ٢: محل الأكل (فقط للمدينة المختارة)
  function renderFoodStep() {
    const grid = elements.foodOptionsGrid;
    grid.innerHTML = '';

    if (!state.city) {
      grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);grid-column:1/-1;">يرجى اختيار المدينة أولاً 🌸</p>';
      return;
    }

    const currentCity = APP_CONFIG.cities.find(c => c.id === state.city.id);
    if (!currentCity || !currentCity.foodPlaces) return;

    currentCity.foodPlaces.forEach(place => {
      const card = document.createElement('div');
      card.className = `option-card ${state.food && state.food.id === place.id ? 'selected' : ''}`;
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', state.food && state.food.id === place.id ? 'true' : 'false');
      card.tabIndex = 0;

      card.innerHTML = `
        <div class="check-badge" aria-hidden="true">✓</div>
        <div class="option-card-icon">🍽️</div>
        <div class="option-card-title">${place.name}</div>
        <div class="option-card-desc">${place.tag}</div>
      `;

      card.addEventListener('click', () => {
        state.food = place;
        saveDraftToStorage();
        renderFoodStep();
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          state.food = place;
          saveDraftToStorage();
          renderFoodStep();
        }
      });

      grid.appendChild(card);
    });
  }

  // الخطوة ٣: محل التحلاية (فقط للمدينة المختارة)
  function renderDessertStep() {
    const grid = elements.dessertOptionsGrid;
    grid.innerHTML = '';

    if (!state.city) {
      grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);grid-column:1/-1;">يرجى اختيار المدينة أولاً 🌸</p>';
      return;
    }

    const currentCity = APP_CONFIG.cities.find(c => c.id === state.city.id);
    if (!currentCity || !currentCity.dessertPlaces) return;

    currentCity.dessertPlaces.forEach(place => {
      const card = document.createElement('div');
      card.className = `option-card ${state.dessert && state.dessert.id === place.id ? 'selected' : ''}`;
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', state.dessert && state.dessert.id === place.id ? 'true' : 'false');
      card.tabIndex = 0;

      card.innerHTML = `
        <div class="check-badge" aria-hidden="true">✓</div>
        <div class="option-card-icon">🍰</div>
        <div class="option-card-title">${place.name}</div>
        <div class="option-card-desc">${place.tag}</div>
      `;

      card.addEventListener('click', () => {
        state.dessert = place;
        saveDraftToStorage();
        renderDessertStep();
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          state.dessert = place;
          saveDraftToStorage();
          renderDessertStep();
        }
      });

      grid.appendChild(card);
    });
  }

  // الخطوة ٤: اختيار اليوم (وفق النطاق الزمني المحدد أو الأيام القادمة)
  function generateUpcomingDays() {
    const days = [];
    const arabicDays = APP_CONFIG.daysConfig.arabicDayNames;
    const arabicMonths = APP_CONFIG.daysConfig.arabicMonthNames;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateRange = APP_CONFIG.daysConfig.dateRange;

    // إذا كان النطاق الزمني محددًا ومفعلًا (مثل: من السبت 10 أكتوبر إلى السبت 17 أكتوبر)
    if (dateRange && dateRange.enabled && dateRange.startDate && dateRange.endDate) {
      const [sy, sm, sd] = dateRange.startDate.split('-').map(Number);
      const [ey, em, ed] = dateRange.endDate.split('-').map(Number);

      const start = new Date(sy, sm - 1, sd);
      const end = new Date(ey, em - 1, ed);

      let cur = new Date(start);
      while (cur <= end) {
        const dName = arabicDays[cur.getDay()];
        const dNum = cur.getDate();
        const mName = arabicMonths[cur.getMonth()];
        const iso = cur.getFullYear() + '-' + String(cur.getMonth() + 1).padStart(2, '0') + '-' + String(dNum).padStart(2, '0');

        let label = dName;
        const curCompare = new Date(cur);
        curCompare.setHours(0, 0, 0, 0);
        if (curCompare.getTime() === today.getTime()) {
          label = `اليوم (${dName})`;
        }

        days.push({
          id: `day_${iso}`,
          isoDate: iso,
          dayName: dName,
          displayName: label,
          dateFormatted: `${dNum} ${mName}`,
          fullTitle: `${dName}، ${dNum} ${mName}`
        });

        cur.setDate(cur.getDate() + 1);
      }

      return days;
    }

    // الوضع التلقائي للأيام القادمة
    const count = APP_CONFIG.daysConfig.numberOfUpcomingDays || 8;
    for (let i = 0; i < count; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      const dayName = arabicDays[d.getDay()];
      const dayNum = d.getDate();
      const monthName = arabicMonths[d.getMonth()];
      const iso = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(dayNum).padStart(2, '0');

      let label = dayName;
      if (i === 0) label = `اليوم (${dayName})`;
      else if (i === 1) label = `بكرة (${dayName})`;

      days.push({
        id: `day_${iso}`,
        isoDate: iso,
        dayName: dayName,
        displayName: label,
        dateFormatted: `${dayNum} ${monthName}`,
        fullTitle: `${dayName}، ${dayNum} ${monthName}`
      });
    }

    return days;
  }

  function renderDaysStep() {
    const grid = elements.daysOptionsGrid;
    grid.innerHTML = '';
    const days = generateUpcomingDays();

    // إعداد نمط الأعمدة حسب حجم الشاشة
    grid.className = 'options-grid two-cols';

    days.forEach(dayItem => {
      const isSelected = state.day && state.day.isoDate === dayItem.isoDate;
      const card = document.createElement('div');
      card.className = `date-pill-card ${isSelected ? 'selected' : ''}`;
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      card.tabIndex = 0;

      card.innerHTML = `
        <div class="check-badge" style="top:8px;left:8px;" aria-hidden="true">${isSelected ? '✓' : ''}</div>
        <div class="date-day-name">${dayItem.displayName}</div>
        <div class="date-day-date">📅 ${dayItem.dateFormatted}</div>
      `;

      card.addEventListener('click', () => {
        selectDay(dayItem);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectDay(dayItem);
        }
      });

      grid.appendChild(card);
    });

    // ضبط الحد الأدنى للتاريخ في حقل التاريخ المخصص
    if (APP_CONFIG.daysConfig.dateRange && APP_CONFIG.daysConfig.dateRange.enabled) {
      elements.customDateInput.min = APP_CONFIG.daysConfig.dateRange.startDate;
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      elements.customDateInput.min = tomorrow.toISOString().split('T')[0];
    }
  }

  function selectDay(dayItem) {
    state.day = dayItem;
    // التحقق من توافق الساعة المختارة سابقاً مع اليوم الجديد
    validateTimeForDay();
    saveDraftToStorage();
    renderDaysStep();
    elements.customDatePickerBox.style.display = 'none';
  }

  function setupCustomDatePicker() {
    elements.btnToggleCustomDate.addEventListener('click', () => {
      const box = elements.customDatePickerBox;
      const isHidden = box.style.display === 'none';
      box.style.display = isHidden ? 'flex' : 'none';
      if (isHidden) {
        elements.customDateInput.focus();
      }
    });

    elements.customDateInput.addEventListener('change', (e) => {
      const val = e.target.value;
      if (!val) return;

      const pickedDate = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (pickedDate < today) {
        showToast('⚠️ لا يمكن اختيار تاريخ مضى يا شروق، اختاري تاريخًا قادمًا 🌸');
        return;
      }

      const arabicDays = APP_CONFIG.daysConfig.arabicDayNames;
      const arabicMonths = APP_CONFIG.daysConfig.arabicMonthNames;

      const dayName = arabicDays[pickedDate.getDay()];
      const dayNum = pickedDate.getDate();
      const monthName = arabicMonths[pickedDate.getMonth()];

      const customDayItem = {
        id: `custom_${val}`,
        isoDate: val,
        dayName: dayName,
        displayName: dayName,
        dateFormatted: `${dayNum} ${monthName}`,
        fullTitle: `${dayName}، ${dayNum} ${monthName}`
      };

      selectDay(customDayItem);
      showToast(`تم اختيار: ${customDayItem.fullTitle} 🗓️`);
    });
  }

  // التحقق من توفر الساعة مع اليوم
  function validateTimeForDay() {
    if (!state.day || !state.time) return;

    const availableSlots = getAvailableTimeSlotsForCurrentDay();
    const isStillAvailable = availableSlots.some(s => s.id === state.time.id || s.label === state.time.label);

    if (!isStillAvailable) {
      state.time = null;
      showToast('يرجى اختيار ساعة جديدة تناسب هذا اليوم ⏰');
    }
  }

  function getAvailableTimeSlotsForCurrentDay() {
    if (!state.day) return APP_CONFIG.defaultTimeSlots;

    const dayName = state.day.dayName;
    const customSlots = APP_CONFIG.daysConfig.customDaySlots;

    if (customSlots && customSlots[dayName] && Array.isArray(customSlots[dayName])) {
      return customSlots[dayName].map((slotLabel, idx) => ({
        id: `slot_${idx}`,
        label: slotLabel,
        sub: 'وقت مخصص لهذا اليوم'
      }));
    }

    return APP_CONFIG.defaultTimeSlots;
  }

  // الخطوة ٥: اختيار الساعة
  function renderTimeStep() {
    const list = elements.timeOptionsList;
    list.innerHTML = '';

    const slots = getAvailableTimeSlotsForCurrentDay();

    slots.forEach(slot => {
      const isSelected = state.time && (state.time.id === slot.id || state.time.label === slot.label);
      const card = document.createElement('div');
      card.className = `time-slot-card ${isSelected ? 'selected' : ''}`;
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      card.tabIndex = 0;

      card.innerHTML = `
        <div class="time-slot-main">
          <div class="time-icon">⏰</div>
          <div>
            <div class="time-label">${slot.label}</div>
            <div class="time-sub">${slot.sub}</div>
          </div>
        </div>
        <div class="check-badge" style="position:static;" aria-hidden="true">${isSelected ? '✓' : ''}</div>
      `;

      card.addEventListener('click', () => {
        state.time = slot;
        saveDraftToStorage();
        renderTimeStep();
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          state.time = slot;
          saveDraftToStorage();
          renderTimeStep();
        }
      });

      list.appendChild(card);
    });
  }

  // الخطوة ٦: الإضافات الاختيارية والملاحظة
  function renderAddonsStep() {
    const grid = elements.addonsGrid;
    grid.innerHTML = '';

    APP_CONFIG.addons.forEach(addon => {
      const isSelected = state.addons.includes(addon.id);
      const card = document.createElement('div');
      card.className = `addon-card ${isSelected ? 'selected' : ''}`;
      card.setAttribute('role', 'checkbox');
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      card.tabIndex = 0;

      card.innerHTML = `
        <div class="addon-icon">${addon.icon}</div>
        <div class="addon-info">
          <div class="addon-title">${addon.label}</div>
          <div class="addon-sub">${addon.note}</div>
        </div>
        <div class="check-badge" aria-hidden="true">${isSelected ? '✓' : ''}</div>
      `;

      card.addEventListener('click', () => {
        toggleAddon(addon.id);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleAddon(addon.id);
        }
      });

      grid.appendChild(card);
    });

    elements.personalNoteInput.value = state.note || '';
  }

  function toggleAddon(addonId) {
    const index = state.addons.indexOf(addonId);
    if (index > -1) {
      state.addons.splice(index, 1);
    } else {
      state.addons.push(addonId);
    }
    saveDraftToStorage();
    renderAddonsStep();
  }

  function setupAddonsEvents() {
    // زر تخطي الإضافات
    elements.btnSkipAddons.addEventListener('click', () => {
      state.addons = [];
      saveDraftToStorage();
      goToStep(7);
    });

    // تحديث الملاحظة في الحالة
    elements.personalNoteInput.addEventListener('input', (e) => {
      state.note = e.target.value.trim();
      saveDraftToStorage();
    });
  }

  // الخطوة ٧: بطاقة ملخص الموعد
  function renderSummaryStep() {
    // المدينة
    elements.summaryCityVal.textContent = state.city ? `${state.city.name} ${state.city.icon || ''}` : '-';

    // محل الأكل
    elements.summaryFoodVal.textContent = state.food ? state.food.name : '-';

    // محل التحلاية
    elements.summaryDessertVal.textContent = state.dessert ? state.dessert.name : '-';

    // اليوم والتاريخ
    elements.summaryDayVal.textContent = state.day ? state.day.fullTitle : '-';

    // الساعة
    elements.summaryTimeVal.textContent = state.time ? state.time.label : '-';

    // الإضافات
    if (state.addons && state.addons.length > 0) {
      const addonLabels = state.addons.map(id => {
        const item = APP_CONFIG.addons.find(a => a.id === id);
        return item ? `${item.label} ${item.icon}` : id;
      });
      elements.summaryAddonsVal.textContent = addonLabels.join(' ، ');
    } else {
      elements.summaryAddonsVal.textContent = 'بدون إضافات';
    }

    // الملاحظة الشخصية
    if (state.note && state.note.length > 0) {
      elements.summaryNoteBox.style.display = 'block';
      elements.summaryNoteVal.textContent = state.note;
    } else {
      elements.summaryNoteBox.style.display = 'none';
    }
  }

  // ------------------------------------------------------------------
  // 5. رسالة الواتساب ونسخ التفاصيل
  // ------------------------------------------------------------------
  function generateAppointmentMessage() {
    const cityName = state.city ? state.city.name : 'غير محدد';
    const foodName = state.food ? state.food.name : 'غير محدد';
    const dessertName = state.dessert ? state.dessert.name : 'غير محدد';
    const dayName = state.day ? state.day.fullTitle : 'غير محدد';
    const timeLabel = state.time ? state.time.label : 'غير محدد';

    let addonsText = 'بدون إضافات';
    if (state.addons && state.addons.length > 0) {
      addonsText = state.addons.map(id => {
        const item = APP_CONFIG.addons.find(a => a.id === id);
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

    if (state.note && state.note.trim().length > 0) {
      text += `💌 ملاحظة شروق: ${state.note.trim()}\n`;
    }

    text += `\nأحلى تفصيل بالطلعة إنك معي 💛`;
    return text;
  }

  function setupSummaryActions() {
    // 1. زر إرسال على واتساب
    elements.btnSendWhatsApp.addEventListener('click', () => {
      const msg = generateAppointmentMessage();
      const phone = (APP_CONFIG.whatsappNumber || '').replace(/[^0-9]/g, '');

      if (!phone) {
        // رقم الواتساب غير محدد في ملف الإعدادات
        copyToClipboard(msg);
        showToast('رقم واتساب غير محدد بالإعدادات. تم نسخ التفاصيل لمشاركتها مع محمود! 💌');
        // فتح واتساب بالرسالة دون رقم محدد حتى تتمكن من اختيار المحادثة
        setTimeout(() => {
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
        }, 600);
        return;
      }

      // فتح محادثة محمود مع الرسالة الجاهزة
      // تنبيه صريح: يجب الضغط على إرسال بنفسها داخل واتساب
      showToast('جارِ فتح واتساب... اضغطي زر الإرسال داخل التطبيق 💌');
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, '_blank');
    });

    // 2. زر نسخ تفاصيل الموعد
    elements.btnCopyDetails.addEventListener('click', () => {
      const msg = generateAppointmentMessage();
      copyToClipboard(msg);
      showToast(APP_CONFIG.uiTexts.summaryActions.copiedSuccess || 'تم نسخ تفاصيل الموعد بنجاح! 💛');
    });

    // 3. زر تعديل اختياراتي
    elements.btnEditChoices.addEventListener('click', () => {
      goToStep(1);
    });

    // 4. زر بدء من جديد
    elements.btnResetApp.addEventListener('click', () => {
      elements.confirmResetModal.classList.add('show');
    });

    elements.btnConfirmReset.addEventListener('click', () => {
      elements.confirmResetModal.classList.remove('show');
      resetAllData();
      goToStep(0);
      showToast('تمت إعادة ضبط الاختيارات للبدء من جديد 🌸');
    });

    elements.btnCancelReset.addEventListener('click', () => {
      elements.confirmResetModal.classList.remove('show');
    });
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.warn('Copy command failed', err);
    }
    document.body.removeChild(textArea);
  }

  // ------------------------------------------------------------------
  // 6. التنقل بين الخطوات والتحقق اللطيف (Wizard Flow & Validation)
  // ------------------------------------------------------------------
  function setupNavigationEvents() {
    elements.btnNext.addEventListener('click', () => {
      handleNextStep();
    });

    elements.btnPrev.addEventListener('click', () => {
      handlePrevStep();
    });
  }

  function handleNextStep() {
    const step = state.currentStep;
    const alerts = APP_CONFIG.uiTexts.validationAlerts;

    // التحقق من تعبئة الخطوات الإلزامية
    if (step === 1 && !state.city) {
      showToast(alerts.city || 'اختاري وين حابّة نطلع يا شروق 💛');
      shakeCurrentStep();
      return;
    }

    if (step === 2 && !state.food) {
      showToast(alerts.food || 'اختاري محل الأكل يا غالية 😋');
      shakeCurrentStep();
      return;
    }

    if (step === 3 && !state.dessert) {
      showToast(alerts.dessert || 'اختاري محل التحلاية يا سكر 🍰');
      shakeCurrentStep();
      return;
    }

    if (step === 4 && !state.day) {
      showToast(alerts.day || 'حددي اليوم اللي بناسبك 🗓️');
      shakeCurrentStep();
      return;
    }

    if (step === 5 && !state.time) {
      showToast(alerts.time || 'اختاري الساعة اللي بتريحك 🕓');
      shakeCurrentStep();
      return;
    }

    // الانتقال للخطوة التالية
    if (step < 7) {
      goToStep(step + 1);
    }
  }

  function handlePrevStep() {
    if (state.currentStep > 1) {
      goToStep(state.currentStep - 1);
    } else if (state.currentStep === 1) {
      goToStep(0);
    }
  }

  function goToStep(stepIndex) {
    state.currentStep = stepIndex;
    saveDraftToStorage();

    // إخفاء جميع الحاويات
    for (let i = 0; i <= 7; i++) {
      const container = document.getElementById(`step-${i}`);
      if (container) container.style.display = 'none';
    }

    // إظهار الحاوية المطلوبة
    const activeContainer = document.getElementById(`step-${stepIndex}`);
    if (activeContainer) {
      activeContainer.style.display = 'block';
    }

    // إعادة ضبط موضع زر لا إن لم نكن في شاشة الدعوة
    if (stepIndex !== 0) {
      resetNoButtonPosition();
    }

    // إدارة شريط التقدم وشريط التنقل
    if (stepIndex === 0) {
      // شاشة الدعوة
      elements.progressSection.style.display = 'none';
      elements.navigationBar.style.display = 'none';
    } else if (stepIndex >= 1 && stepIndex <= 6) {
      // خطوات التخطيط
      elements.progressSection.style.display = 'block';
      elements.navigationBar.style.display = 'flex';
      updateProgressUI(stepIndex);
    } else if (stepIndex === 7) {
      // بطاقة الملخص
      elements.progressSection.style.display = 'none';
      elements.navigationBar.style.display = 'none';
      renderSummaryStep();
      launchConfetti(); // احتفال بسيط بالملخص
    }

    // تصيير محتوى الخطوة المطلوبة
    switch (stepIndex) {
      case 1: renderCityStep(); break;
      case 2: renderFoodStep(); break;
      case 3: renderDessertStep(); break;
      case 4: renderDaysStep(); break;
      case 5: renderTimeStep(); break;
      case 6: renderAddonsStep(); break;
      case 7: renderSummaryStep(); break;
    }

    // التمرير السلس لأعلى البطاقة
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateProgressUI(step) {
    const stepNames = [
      '',
      'اختيار المدينة 📍',
      'محل الأكل 🍽️',
      'محل التحلاية 🍰',
      'اختيار اليوم 🗓️',
      'اختيار الساعة ⏰',
      'إضافات ولمسات ✨'
    ];

    elements.progressStepName.textContent = stepNames[step] || '';
    elements.progressCounter.textContent = `الخطوة ${toArabicNumerals(step)} من ٦`;

    // نسبة التقدم
    const percent = Math.round((step / 6) * 100);
    elements.progressBarFill.style.width = `${percent}%`;

    // تحديث نقاط التقدم (Pills)
    elements.stepPills.forEach((pill, idx) => {
      const pillStep = idx + 1;
      pill.classList.remove('active', 'completed');
      if (pillStep === step) {
        pill.classList.add('active');
      } else if (pillStep < step) {
        pill.classList.add('completed');
      }
    });
  }

  function toArabicNumerals(num) {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/[0-9]/g, d => arabicDigits[d]);
  }

  function shakeCurrentStep() {
    const active = document.getElementById(`step-${state.currentStep}`);
    if (active) {
      active.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-8px)' },
        { transform: 'translateX(8px)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(0)' }
      ], {
        duration: 400,
        easing: 'ease-in-out'
      });
    }
  }

  // ------------------------------------------------------------------
  // 7. إدارة التخزين المحلي (LocalStorage Draft Persistence)
  // ------------------------------------------------------------------
  function saveDraftToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  function loadDraftFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          state = Object.assign(state, parsed);
          // إذا كانت في خطوة متقدمة، استعد الخطوة
          if (state.currentStep > 0) {
            goToStep(state.currentStep);
            return;
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage parse error:', e);
    }
    // البدء من شاشة الدعوة
    goToStep(0);
  }

  function resetAllData() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}

    state = {
      currentStep: 0,
      city: null,
      food: null,
      dessert: null,
      day: null,
      time: null,
      addons: [],
      note: ''
    };
    dodgeCount = 0;
    resetNoButtonPosition();
  }

  // ------------------------------------------------------------------
  // 8. إشعار التنبيه اللطيف (Sweet Toast)
  // ------------------------------------------------------------------
  let toastTimer = null;
  function showToast(message, icon = '🌸') {
    const toast = elements.toastAlert;
    elements.toastMessage.textContent = message;
    elements.toastIcon.textContent = icon;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // ------------------------------------------------------------------
  // 9. مؤثرات القلوب والكونفيتي (Hearts & Confetti Effects)
  // ------------------------------------------------------------------
  function setupFloatingHearts() {
    const container = elements.heartsBackground;
    const icons = ['💛', '💖', '🌸', '✨', '🤍'];
    const count = 14;

    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = icons[Math.floor(Math.random() * icons.length)];
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.animationDuration = `${8 + Math.random() * 10}s`;
      heart.style.animationDelay = `${Math.random() * 8}s`;
      heart.style.fontSize = `${14 + Math.random() * 20}px`;
      container.appendChild(heart);
    }
  }

  function launchFloatingHeartsBurst() {
    const container = elements.heartsBackground;
    const icons = ['💛', '💖', '🥰', '✨'];

    for (let i = 0; i < 20; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = icons[Math.floor(Math.random() * icons.length)];
      heart.style.left = `${20 + Math.random() * 60}%`;
      heart.style.animationDuration = `${3 + Math.random() * 3}s`;
      heart.style.fontSize = `${20 + Math.random() * 26}px`;
      heart.style.opacity = '0.9';
      container.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 5000);
    }
  }

  // محرك كونفيتي خفيف واحترافي باستخدام Canvas بدون أي مكتبات خارجية
  function launchConfetti() {
    const canvas = elements.confettiCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#f43f5e', '#fb7185', '#f59e0b', '#fbbf24', '#fda4af', '#f472b6'];

    for (let i = 0; i < 80; i++) {
      pieces.push({
        x: canvas.width / 2,
        y: canvas.height / 2 + 50,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 1.2) * 16,
        size: 5 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.35,
        opacity: 1
      });
    }

    let animationFrame;
    const startTime = Date.now();

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = Date.now() - startTime;

      let alive = false;
      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotSpeed;

        if (elapsed > 1800) {
          p.opacity -= 0.02;
        }

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
          ctx.restore();
        }
      });

      if (alive && elapsed < 3500) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }

    render();
  }

  // ------------------------------------------------------------------
  // 10. بدء تشغيل التطبيق عند اكتمال تحميل المستند
  // ------------------------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
