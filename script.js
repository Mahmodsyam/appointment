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
    currentStep: 0,        // 0 / 'step-0' أو معرف الخطوة
    currentStepId: 'step-0',
    meetType: 'outing',    // 'outing' (طشة برة) أو 'home' (تيجي عندي بالبيت)
    city: null,            // كائن المدينة المختارة
    food: null,            // كائن محل الأكل
    dessert: null,         // كائن محل التحلاية
    day: null,             // كائن اليوم والتاريخ
    time: null,            // كائن الساعة
    addons: [],            // مصفوفة معرّفات الإضافات المختارة (لطشة)
    gift: '',              // الهدية المطلوبة (لقعدة البيت)
    note: ''               // الملاحظة الشخصية
  };

  let dodgeCount = 0;
  let isDodgeAnimating = false;
  let pendingBlockedDay = null;

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
    programmerWelcomeBadge: document.getElementById('programmerWelcomeBadge'),
    programmerWelcomeText: document.getElementById('programmerWelcomeText'),
    programmerWelcomeSub: document.getElementById('programmerWelcomeSub'),
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
    
    // خطوة نوع اللقاء (طشة أو بيت)
    stepMeetType: document.getElementById('step-meet-type'),
    meetTypeTitle: document.getElementById('meetTypeTitle'),
    meetTypeSubtitle: document.getElementById('meetTypeSubtitle'),
    meetTypeOptionsGrid: document.getElementById('meetTypeOptionsGrid'),

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
    btnToggleCustomTime: document.getElementById('btnToggleCustomTime'),
    customTimePickerBox: document.getElementById('customTimePickerBox'),
    customTimeInput: document.getElementById('customTimeInput'),

    // خطوة الهدية (لقعدة البيت)
    stepGift: document.getElementById('step-gift'),
    giftTitle: document.getElementById('giftTitle'),
    giftSubtitle: document.getElementById('giftSubtitle'),
    giftSuggestionsList: document.getElementById('giftSuggestionsList'),
    giftInput: document.getElementById('giftInput'),
    giftInputLabel: document.getElementById('giftInputLabel'),
    homeNoteInput: document.getElementById('homeNoteInput'),
    homeNoteInputLabel: document.getElementById('homeNoteInputLabel'),
    
    step6: document.getElementById('step-6'),
    addonsGrid: document.getElementById('addonsGrid'),
    btnSkipAddons: document.getElementById('btnSkipAddons'),
    personalNoteInput: document.getElementById('personalNoteInput'),
    noteInputLabel: document.getElementById('noteInputLabel'),
    
    // الملخص
    step7: document.getElementById('step-7'),
    summaryTitle: document.getElementById('summaryTitle'),
    summarySub: document.getElementById('summarySub'),
    summaryMeetTypeRow: document.getElementById('summaryMeetTypeRow'),
    summaryMeetTypeVal: document.getElementById('summaryMeetTypeVal'),
    summaryCityRow: document.getElementById('summaryCityRow'),
    summaryCityVal: document.getElementById('summaryCityVal'),
    summaryFoodRow: document.getElementById('summaryFoodRow'),
    summaryFoodVal: document.getElementById('summaryFoodVal'),
    summaryDessertRow: document.getElementById('summaryDessertRow'),
    summaryDessertVal: document.getElementById('summaryDessertVal'),
    summaryDayRow: document.getElementById('summaryDayRow'),
    summaryDayVal: document.getElementById('summaryDayVal'),
    summaryTimeRow: document.getElementById('summaryTimeRow'),
    summaryTimeVal: document.getElementById('summaryTimeVal'),
    summaryGiftRow: document.getElementById('summaryGiftRow'),
    summaryGiftVal: document.getElementById('summaryGiftVal'),
    summaryAddonsRow: document.getElementById('summaryAddonsRow'),
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
    blockedDayModal: document.getElementById('blockedDayModal'),
    blockedDayMessage: document.getElementById('blockedDayMessage'),
    btnAckBlockedDay: document.getElementById('btnAckBlockedDay'),
    btnConfirmBlockedDay: document.getElementById('btnConfirmBlockedDay'),

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
    setupCustomTimePicker();
    setupGiftEvents();
    setupAddonsEvents();
    setupSummaryActions();
    setupBlockedDayModalEvents();
    loadDraftFromStorage();
  }

  // تطبيق النصوص المخصصة من ملف الإعدادات
  function applyConfigTexts() {
    if (!window.APP_CONFIG) return;
    const cfg = window.APP_CONFIG;

    document.title = cfg.uiTexts.siteTitle || document.title;
    elements.headerTitle.textContent = cfg.uiTexts.siteTitle;
    
    // شاشة الدعوة والترحيب
    if (elements.programmerWelcomeText && cfg.welcome) {
      elements.programmerWelcomeText.textContent = cfg.welcome.title;
      elements.programmerWelcomeSub.textContent = cfg.welcome.subtitle;
    }

    elements.invitationBadge.textContent = cfg.invitation.badge;
    elements.invitationQuestion.textContent = cfg.invitation.question;
    elements.invitationSubtitle.textContent = cfg.invitation.subtitle;
    elements.btnYesText.textContent = cfg.invitation.yesBtn;
    elements.btnNoText.textContent = cfg.invitation.noBtn;
    
    // عناوين الخطوات
    if (elements.meetTypeTitle && cfg.meetTypeConfig) {
      elements.meetTypeTitle.textContent = cfg.meetTypeConfig.title;
      elements.meetTypeSubtitle.textContent = cfg.meetTypeConfig.subtitle;
    }
    document.getElementById('step1Title').textContent = cfg.uiTexts.stepTitles.city;
    document.getElementById('step2Title').textContent = cfg.uiTexts.stepTitles.food;
    document.getElementById('step3Title').textContent = cfg.uiTexts.stepTitles.dessert;
    document.getElementById('step4Title').textContent = cfg.uiTexts.stepTitles.day;
    document.getElementById('step5Title').textContent = cfg.uiTexts.stepTitles.time;

    // خطوة الهدية
    if (elements.giftTitle && cfg.giftConfig) {
      elements.giftTitle.textContent = cfg.giftConfig.title;
      elements.giftSubtitle.textContent = cfg.giftConfig.subtitle;
      elements.giftInputLabel.textContent = cfg.giftConfig.giftInputLabel;
      elements.giftInput.placeholder = cfg.giftConfig.giftPlaceholder;
      elements.homeNoteInputLabel.textContent = cfg.giftConfig.noteLabel;
      elements.homeNoteInput.placeholder = cfg.giftConfig.notePlaceholder;
    }

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
      goToStep('step-meet-type');
    };

    // الانتقال التلقائي السلس بعد 1.8 ثانية إن لم تضغط
    setTimeout(() => {
      if (elements.celebrationModal.classList.contains('show')) {
        elements.celebrationModal.classList.remove('show');
        if (state.currentStepId === 'step-0' || state.currentStep === 0) {
          goToStep('step-meet-type');
        }
      }
    }, 1800);
  }

  // ------------------------------------------------------------------
  // 4. بناء الخيارات لكل خطوة (Step Renderers)
  // ------------------------------------------------------------------

  // خطوة نوع اللقاء (طشة برة أو تيجي عندي بالبيت)
  function renderMeetTypeStep() {
    const grid = elements.meetTypeOptionsGrid;
    if (!grid) return;
    grid.innerHTML = '';

    const options = (APP_CONFIG.meetTypeConfig && APP_CONFIG.meetTypeConfig.options) ? APP_CONFIG.meetTypeConfig.options : [
      { id: 'outing', icon: '🚗✨', title: 'طشة برة سوا', subtitle: 'نطلع مشوار رايق مع محمود وأكل وتحلاية وأحلى أجواء' },
      { id: 'home', icon: '🏡💛', title: 'أجي عندك بالبيت', subtitle: 'محمود ييجي لعندك بالبيت، قعدة دافية مع فنجان قهوة وهدية حلوة بيجيبها لعيونك' }
    ];

    options.forEach(opt => {
      const isSelected = state.meetType === opt.id;
      const card = document.createElement('div');
      card.className = `option-card ${isSelected ? 'selected' : ''}`;
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      card.tabIndex = 0;

      card.innerHTML = `
        <div class="check-badge" aria-hidden="true">${isSelected ? '✓' : ''}</div>
        <div class="option-card-icon">${opt.icon}</div>
        <div class="option-card-title">${opt.title}</div>
        <div class="option-card-desc">${opt.subtitle}</div>
      `;

      card.addEventListener('click', () => {
        selectMeetType(opt.id);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectMeetType(opt.id);
        }
      });

      grid.appendChild(card);
    });
  }

  function selectMeetType(typeId) {
    state.meetType = typeId;
    saveDraftToStorage();
    renderMeetTypeStep();
    setTimeout(() => {
      handleNextStep();
    }, 320);
  }

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
    setTimeout(() => {
      handleNextStep();
    }, 320);
  }

  // الخطوة ٢: محل الأكل (فقط للمدينة المختارة)
  function renderFoodStep() {
    const grid = elements.foodOptionsGrid;
    grid.innerHTML = '';

    if (!state.city) {
      state.city = APP_CONFIG.cities[0];
    }

    const currentCity = APP_CONFIG.cities.find(c => c.id === state.city.id) || APP_CONFIG.cities[0];
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
        setTimeout(() => {
          handleNextStep();
        }, 320);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          state.food = place;
          saveDraftToStorage();
          renderFoodStep();
          setTimeout(() => {
            handleNextStep();
          }, 320);
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
      state.city = APP_CONFIG.cities[0];
    }

    const currentCity = APP_CONFIG.cities.find(c => c.id === state.city.id) || APP_CONFIG.cities[0];
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
        setTimeout(() => {
          handleNextStep();
        }, 320);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          state.dessert = place;
          saveDraftToStorage();
          renderDessertStep();
          setTimeout(() => {
            handleNextStep();
          }, 320);
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

  // ------------------------------------------------------------------
  // الردود الفكاهية المانعة على الأيام المحددة
  // ------------------------------------------------------------------
  function getBlockedDayComment(dayName) {
    if (!dayName || !APP_CONFIG.blockedDaysComments) return null;
    const clean = dayName.replace(/[\u0625\u0623\u0622]/g, 'ا');
    if (clean.includes('سبت')) return APP_CONFIG.blockedDaysComments['السبت'];
    if (clean.includes('احد')) return APP_CONFIG.blockedDaysComments['الأحد'];
    if (clean.includes('اثنين')) return APP_CONFIG.blockedDaysComments['الإثنين'];
    if (clean.includes('خميس')) return APP_CONFIG.blockedDaysComments['الخميس'];
    return null;
  }

  function showBlockedDayModal(message, dayItem) {
    if (!elements.blockedDayModal || !elements.blockedDayMessage) return;
    pendingBlockedDay = dayItem || null;
    elements.blockedDayMessage.textContent = message;
    elements.blockedDayModal.classList.add('show');
  }

  function setupBlockedDayModalEvents() {
    if (elements.btnAckBlockedDay && elements.blockedDayModal) {
      elements.btnAckBlockedDay.addEventListener('click', () => {
        elements.blockedDayModal.classList.remove('show');
        pendingBlockedDay = null;
      });
    }

    if (elements.btnConfirmBlockedDay && elements.blockedDayModal) {
      elements.btnConfirmBlockedDay.addEventListener('click', () => {
        elements.blockedDayModal.classList.remove('show');
        if (pendingBlockedDay) {
          const chosen = pendingBlockedDay;
          pendingBlockedDay = null;
          selectDay(chosen, true);
          showToast(`لعيون شروق بهون كل إشي! تم اعتماد: ${chosen.fullTitle} 💛✨`);
        }
      });
    }
  }

  function renderDaysStep() {
    const grid = elements.daysOptionsGrid;
    grid.innerHTML = '';
    const days = generateUpcomingDays();

    // إعداد نمط الأعمدة حسب حجم الشاشة
    grid.className = 'options-grid two-cols';

    days.forEach(dayItem => {
      const isSelected = state.day && state.day.isoDate === dayItem.isoDate;
      const blockedComment = getBlockedDayComment(dayItem.dayName);
      const isBlocked = !!blockedComment;

      const card = document.createElement('div');
      card.className = `date-pill-card ${isSelected ? 'selected' : ''} ${isBlocked ? 'blocked-day-card' : ''}`;
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      card.tabIndex = 0;

      const badgeHtml = isSelected ? '✓' : '';
      const hintTag = isBlocked ? `<div class="blocked-day-hint-tag">حجة محمود 🙈</div>` : '';

      card.innerHTML = `
        <div class="check-badge" style="top:8px;left:8px;" aria-hidden="true">${badgeHtml}</div>
        <div class="date-day-name">${dayItem.displayName}</div>
        <div class="date-day-date">📅 ${dayItem.dateFormatted}</div>
        ${hintTag}
      `;

      function handleCardClick() {
        if (isBlocked) {
          card.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-7px)' },
            { transform: 'translateX(7px)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(0)' }
          ], { duration: 320 });
          showBlockedDayModal(blockedComment, dayItem);
          return;
        }
        selectDay(dayItem, true);
      }

      card.addEventListener('click', handleCardClick);

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
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

  function selectDay(dayItem, autoAdvance = false) {
    state.day = dayItem;
    // التحقق من توافق الساعة المختارة سابقاً مع اليوم الجديد
    validateTimeForDay();
    saveDraftToStorage();
    renderDaysStep();
    if (elements.customDatePickerBox) {
      elements.customDatePickerBox.style.display = 'none';
    }
    if (autoAdvance) {
      setTimeout(() => {
        handleNextStep();
      }, 350);
    }
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

      const blockedComment = getBlockedDayComment(dayName);
      if (blockedComment) {
        showBlockedDayModal(blockedComment, customDayItem);
        return;
      }

      selectDay(customDayItem, true);
      showToast(`تم اختيار: ${customDayItem.fullTitle} 🗓️`);
    });
  }

  // التحقق من توفر الساعة مع اليوم
  function validateTimeForDay() {
    if (!state.day || !state.time) return;
    if (state.time.isCustom) return; // الموعد المخصص صالح دائمًا لأي يوم

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

  // تحويل الأرقام إلى الأرقام العربية الشرقية (٠، ١، ٢، ...)
  function toArabicNumerals(num) {
    if (num === null || num === undefined) return '';
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/[0-9]/g, d => arabicDigits[Number(d)]);
  }

  // تنسيق الوقت المخصص المختار عبر حقل الوقت
  function formatCustomTime(timeStr) {
    if (!timeStr) return '';
    const [hStr, mStr] = timeStr.split(':');
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);

    let period = 'مساءً';
    if (h < 12) {
      period = 'صباحًا';
    } else if (h === 12) {
      period = 'ظهرًا';
    } else if (h < 16) {
      period = 'ظهرًا';
    } else if (h < 18) {
      period = 'عصرًا';
    } else {
      period = 'مساءً';
    }

    const h12 = h % 12 || 12;
    const mStrPad = m < 10 ? '0' + m : String(m);

    const arabicH = toArabicNumerals(h12);
    const arabicM = toArabicNumerals(mStrPad);

    return `${arabicH}:${arabicM} ${period}`;
  }

  // إعداد حقل وزر الموعد المخصص
  function setupCustomTimePicker() {
    if (!elements.btnToggleCustomTime || !elements.customTimeInput) return;

    elements.btnToggleCustomTime.addEventListener('click', () => {
      const box = elements.customTimePickerBox;
      const isHidden = box.style.display === 'none';
      box.style.display = isHidden ? 'flex' : 'none';
      if (isHidden) {
        elements.customTimeInput.focus();
      }
    });

    elements.customTimeInput.addEventListener('change', (e) => {
      const val = e.target.value;
      if (!val) return;

      const formattedLabel = formatCustomTime(val);
      state.time = {
        id: `custom_${val}`,
        label: formattedLabel,
        sub: 'موعد مخصص حسب اختيارك ⏱️',
        isCustom: true,
        rawTime: val
      };

      saveDraftToStorage();
      renderTimeStep();
      showToast(`تم اختيار الموعد المخصص: ${formattedLabel} ⏱️`);
      setTimeout(() => {
        handleNextStep();
      }, 400);
    });
  }

  // الخطوة ٥: اختيار الساعة
  function renderTimeStep() {
    const list = elements.timeOptionsList;
    list.innerHTML = '';

    const slots = getAvailableTimeSlotsForCurrentDay();

    slots.forEach(slot => {
      const isSelected = state.time && !state.time.isCustom && (state.time.id === slot.id || state.time.label === slot.label);
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
        if (elements.customTimePickerBox) {
          elements.customTimePickerBox.style.display = 'none';
        }
        setTimeout(() => {
          handleNextStep();
        }, 320);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          state.time = slot;
          saveDraftToStorage();
          renderTimeStep();
          if (elements.customTimePickerBox) {
            elements.customTimePickerBox.style.display = 'none';
          }
          setTimeout(() => {
            handleNextStep();
          }, 320);
        }
      });

      list.appendChild(card);
    });

    // إذا تم اختيار موعد مخصص، اعرضه كبطاقة محددة أسفل القائمة
    if (state.time && state.time.isCustom) {
      const customCard = document.createElement('div');
      customCard.className = 'time-slot-card selected';
      customCard.setAttribute('role', 'radio');
      customCard.setAttribute('aria-checked', 'true');
      customCard.tabIndex = 0;

      customCard.innerHTML = `
        <div class="time-slot-main">
          <div class="time-icon">⏱️</div>
          <div>
            <div class="time-label">${state.time.label}</div>
            <div class="time-sub">${state.time.sub}</div>
          </div>
        </div>
        <div class="check-badge" style="position:static;" aria-hidden="true">✓</div>
      `;

      list.appendChild(customCard);
    }
  }

  // ------------------------------------------------------------------
  // خطوة الهدية الخاصة بزيارة البيت
  // ------------------------------------------------------------------
  function renderGiftStep() {
    const list = elements.giftSuggestionsList;
    if (!list) return;
    list.innerHTML = '';

    const suggestions = (APP_CONFIG.giftConfig && APP_CONFIG.giftConfig.quickSuggestions) ? APP_CONFIG.giftConfig.quickSuggestions : [];
    suggestions.forEach(s => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `gift-pill ${state.gift === s.label ? 'active' : ''}`;
      pill.textContent = s.label;

      pill.addEventListener('click', () => {
        state.gift = s.label;
        if (elements.giftInput) {
          elements.giftInput.value = s.label;
        }
        saveDraftToStorage();
        renderGiftStep();
      });

      list.appendChild(pill);
    });

    if (elements.giftInput) {
      elements.giftInput.value = state.gift || '';
    }
    if (elements.homeNoteInput) {
      elements.homeNoteInput.value = state.note || '';
    }
  }

  function setupGiftEvents() {
    if (elements.giftInput) {
      elements.giftInput.addEventListener('input', (e) => {
        state.gift = e.target.value;
        saveDraftToStorage();
        const pills = elements.giftSuggestionsList ? elements.giftSuggestionsList.querySelectorAll('.gift-pill') : [];
        pills.forEach(p => {
          if (p.textContent === state.gift) {
            p.classList.add('active');
          } else {
            p.classList.remove('active');
          }
        });
      });
    }

    if (elements.homeNoteInput) {
      elements.homeNoteInput.addEventListener('input', (e) => {
        state.note = e.target.value.trim();
        saveDraftToStorage();
      });
    }
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
      goToStep('step-7');
    });

    // تحديث الملاحظة في الحالة
    elements.personalNoteInput.addEventListener('input', (e) => {
      state.note = e.target.value.trim();
      saveDraftToStorage();
    });
  }

  // الخطوة ٧: بطاقة ملخص الموعد
  function renderSummaryStep() {
    if (state.meetType === 'home') {
      if (elements.summaryMeetTypeVal) elements.summaryMeetTypeVal.textContent = 'أجي عندك بالبيت 🏡💛';
      if (elements.summaryCityRow) elements.summaryCityRow.style.display = 'none';
      if (elements.summaryFoodRow) elements.summaryFoodRow.style.display = 'none';
      if (elements.summaryDessertRow) elements.summaryDessertRow.style.display = 'none';
      if (elements.summaryAddonsRow) elements.summaryAddonsRow.style.display = 'none';
      if (elements.summaryGiftRow) {
        elements.summaryGiftRow.style.display = 'flex';
        elements.summaryGiftVal.textContent = (state.gift && state.gift.trim()) ? state.gift : 'هدية حلوة على ذوق محمود 🎀';
      }
    } else {
      if (elements.summaryMeetTypeVal) elements.summaryMeetTypeVal.textContent = 'طشة برة سوا 🚗✨';
      if (elements.summaryCityRow) elements.summaryCityRow.style.display = 'flex';
      if (elements.summaryFoodRow) elements.summaryFoodRow.style.display = 'flex';
      if (elements.summaryDessertRow) elements.summaryDessertRow.style.display = 'flex';
      if (elements.summaryAddonsRow) elements.summaryAddonsRow.style.display = 'flex';
      if (elements.summaryGiftRow) elements.summaryGiftRow.style.display = 'none';

      elements.summaryCityVal.textContent = state.city ? `${state.city.name} ${state.city.icon || ''}` : '-';
      elements.summaryFoodVal.textContent = state.food ? state.food.name : '-';
      elements.summaryDessertVal.textContent = state.dessert ? state.dessert.name : '-';

      if (state.addons && state.addons.length > 0) {
        const addonLabels = state.addons.map(id => {
          const item = APP_CONFIG.addons.find(a => a.id === id);
          return item ? `${item.label} ${item.icon}` : id;
        });
        elements.summaryAddonsVal.textContent = addonLabels.join(' ، ');
      } else {
        elements.summaryAddonsVal.textContent = 'بدون إضافات';
      }
    }

    elements.summaryDayVal.textContent = state.day ? state.day.fullTitle : '-';
    elements.summaryTimeVal.textContent = state.time ? state.time.label : '-';

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
    const dayName = state.day ? state.day.fullTitle : 'غير محدد';
    const timeLabel = state.time ? state.time.label : 'غير محدد';

    if (state.meetType === 'home') {
      let text = `محمود 💛 اخترت تفاصيل طلعتنا (عبر روبوتك الذكي 🤖):\n\n` +
        `🏡 نوع الموعد: تيجي عندي بالبيت يا روحي 🏡💛\n` +
        `🗓️ اليوم والتاريخ: ${dayName}\n` +
        `🕓 الساعة: ${timeLabel}\n`;

      if (state.gift && state.gift.trim().length > 0) {
        text += `🎁 الهدية اللي عبالي تجيبها معك: ${state.gift.trim()}\n`;
      } else {
        text += `🎁 الهدية: مفاجأة حلوة على ذوق محمود 🎀\n`;
      }

      if (state.note && state.note.trim().length > 0) {
        text += `💌 ملاحظة شروق: ${state.note.trim()}\n`;
      }

      text += `\nأحلى تفصيل بالدنيا كلها إنك معي 💛 — م. محمود صيام`;
      return text;
    }

    const cityName = state.city ? state.city.name : 'غير محدد';
    const foodName = state.food ? state.food.name : 'غير محدد';
    const dessertName = state.dessert ? state.dessert.name : 'غير محدد';

    let addonsText = 'بدون إضافات';
    if (state.addons && state.addons.length > 0) {
      addonsText = state.addons.map(id => {
        const item = APP_CONFIG.addons.find(a => a.id === id);
        return item ? `${item.label} ${item.icon}` : id;
      }).join(' ، ');
    }

    let text = `محمود 💛 اخترت تفاصيل طلعتنا (عبر روبوتك الذكي 🤖):\n\n` +
      `🚗 نوع الموعد: طشة برة سوا\n` +
      `📍 المدينة: ${cityName}\n` +
      `😋 محل الأكل: ${foodName}\n` +
      `🍰 محل التحلاية: ${dessertName}\n` +
      `🗓️ اليوم والتاريخ: ${dayName}\n` +
      `🕓 الساعة: ${timeLabel}\n` +
      `✨ الإضافات: ${addonsText}\n`;

    if (state.note && state.note.trim().length > 0) {
      text += `💌 ملاحظة شروق: ${state.note.trim()}\n`;
    }

    text += `\nأحلى تفصيل بالدنيا كلها إنك معي 💛 — م. محمود صيام`;
    return text;
  }

  function setupSummaryActions() {
    // 1. زر إرسال على واتساب
    elements.btnSendWhatsApp.addEventListener('click', () => {
      const msg = generateAppointmentMessage();
      const phone = (APP_CONFIG.whatsappNumber || '').replace(/[^0-9]/g, '');

      if (!phone) {
        copyToClipboard(msg);
        showToast('رقم واتساب غير محدد بالإعدادات. تم نسخ التفاصيل لمشاركتها مع محمود! 💌');
        setTimeout(() => {
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
        }, 600);
        return;
      }

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
      goToStep('step-meet-type');
    });

    // 4. زر بدء من جديد
    elements.btnResetApp.addEventListener('click', () => {
      elements.confirmResetModal.classList.add('show');
    });

    elements.btnConfirmReset.addEventListener('click', () => {
      elements.confirmResetModal.classList.remove('show');
      resetAllData();
      goToStep('step-0');
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
  // 6. مسار الخطوات والتنقل والتحقق اللطيف (Wizard Flow & Validation)
  // ------------------------------------------------------------------
  function getCurrentFlow() {
    if (state.meetType === 'home') {
      return ['step-meet-type', 'step-4', 'step-5', 'step-gift', 'step-7'];
    }
    return ['step-meet-type', 'step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7'];
  }

  function normalizeStepId(step) {
    if (step === 0 || step === '0' || step === 'step-0') return 'step-0';
    if (step === 'meet-type' || step === 'step-meet-type') return 'step-meet-type';
    if (step === 1 || step === '1' || step === 'step-1') return 'step-1';
    if (step === 2 || step === '2' || step === 'step-2') return 'step-2';
    if (step === 3 || step === '3' || step === 'step-3') return 'step-3';
    if (step === 4 || step === '4' || step === 'step-4') return 'step-4';
    if (step === 5 || step === '5' || step === 'step-5') return 'step-5';
    if (step === 'gift' || step === 'step-gift') return 'step-gift';
    if (step === 6 || step === '6' || step === 'step-6') return 'step-6';
    if (step === 7 || step === '7' || step === 'step-7') return 'step-7';
    return step;
  }

  function setupNavigationEvents() {
    elements.btnNext.addEventListener('click', () => {
      handleNextStep();
    });

    elements.btnPrev.addEventListener('click', () => {
      handlePrevStep();
    });
  }

  function handleNextStep() {
    const currentId = state.currentStepId || 'step-0';
    const alerts = APP_CONFIG.uiTexts.validationAlerts;
    const flow = getCurrentFlow();

    if (currentId === 'step-meet-type' && !state.meetType) {
      showToast(alerts.meetType || 'اختاري نوع اللقاء يا روحي 💛');
      shakeCurrentStep();
      return;
    }

    if (currentId === 'step-1' && !state.city) {
      showToast(alerts.city || 'اختاري وين حابّة نطلع يا شروق 💛');
      shakeCurrentStep();
      return;
    }

    if (currentId === 'step-2' && !state.food) {
      showToast(alerts.food || 'اختاري محل الأكل يا غالية 😋');
      shakeCurrentStep();
      return;
    }

    if (currentId === 'step-3' && !state.dessert) {
      showToast(alerts.dessert || 'اختاري محل التحلاية يا سكر 🍰');
      shakeCurrentStep();
      return;
    }

    if (currentId === 'step-4' && !state.day) {
      showToast(alerts.day || 'حددي اليوم اللي بناسبك 🗓️');
      shakeCurrentStep();
      return;
    }

    if (currentId === 'step-5' && !state.time) {
      showToast(alerts.time || 'اختاري الساعة اللي بتريحك 🕓');
      shakeCurrentStep();
      return;
    }

    if (currentId === 'step-gift') {
      if (!state.gift || !state.gift.trim()) {
        state.gift = 'مفاجأة حلوة على ذوق محمود 🎀';
      }
    }

    const idx = flow.indexOf(currentId);
    if (idx !== -1 && idx < flow.length - 1) {
      goToStep(flow[idx + 1]);
    }
  }

  function handlePrevStep() {
    const currentId = state.currentStepId || 'step-0';
    const flow = getCurrentFlow();
    const idx = flow.indexOf(currentId);

    if (idx === 0) {
      goToStep('step-0');
    } else if (idx > 0) {
      goToStep(flow[idx - 1]);
    }
  }

  function goToStep(step) {
    const stepId = normalizeStepId(step);
    state.currentStepId = stepId;
    state.currentStep = (stepId === 'step-0' ? 0 : (stepId === 'step-7' ? 7 : stepId));
    saveDraftToStorage();

    const ALL_STEPS = ['step-0', 'step-meet-type', 'step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-gift', 'step-6', 'step-7'];
    ALL_STEPS.forEach(id => {
      const container = document.getElementById(id);
      if (container) container.style.display = 'none';
    });

    const activeContainer = document.getElementById(stepId);
    if (activeContainer) {
      activeContainer.style.display = 'block';
    }

    if (stepId !== 'step-0') {
      resetNoButtonPosition();
    }

    if (stepId === 'step-0') {
      elements.progressSection.style.display = 'none';
      elements.navigationBar.style.display = 'none';
    } else if (stepId === 'step-7') {
      elements.progressSection.style.display = 'none';
      elements.navigationBar.style.display = 'none';
      renderSummaryStep();
      launchConfetti();
    } else {
      elements.progressSection.style.display = 'block';
      elements.navigationBar.style.display = 'flex';
      updateProgressUI(stepId);
    }

    switch (stepId) {
      case 'step-meet-type': renderMeetTypeStep(); break;
      case 'step-1': renderCityStep(); break;
      case 'step-2': renderFoodStep(); break;
      case 'step-3': renderDessertStep(); break;
      case 'step-4': renderDaysStep(); break;
      case 'step-5': renderTimeStep(); break;
      case 'step-gift': renderGiftStep(); break;
      case 'step-6': renderAddonsStep(); break;
      case 'step-7': renderSummaryStep(); break;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateProgressUI(stepId) {
    const flow = getCurrentFlow();
    const planningFlow = flow.slice(0, flow.length - 1);
    const totalSteps = planningFlow.length;
    const currentIndex = planningFlow.indexOf(stepId);
    const stepNumber = currentIndex !== -1 ? currentIndex + 1 : 1;

    const stepTitlesMap = {
      'step-meet-type': 'نوع اللقاء ✨',
      'step-1': 'اختيار المدينة 📍',
      'step-2': 'محل الأكل 🍽️',
      'step-3': 'محل التحلاية 🍰',
      'step-4': 'اختيار اليوم 🗓️',
      'step-5': 'اختيار الساعة ⏰',
      'step-gift': 'الهدية لعيونك 🎁',
      'step-6': 'إضافات ولمسات ✨'
    };

    elements.progressStepName.textContent = stepTitlesMap[stepId] || '';
    elements.progressCounter.textContent = `الخطوة ${toArabicNumerals(stepNumber)} من ${toArabicNumerals(totalSteps)}`;

    const percent = Math.round((stepNumber / totalSteps) * 100);
    elements.progressBarFill.style.width = `${percent}%`;

    const stepPillsContainer = document.getElementById('stepPills');
    if (stepPillsContainer) {
      stepPillsContainer.innerHTML = '';
      for (let i = 0; i < totalSteps; i++) {
        const pill = document.createElement('div');
        pill.className = 'step-pill';
        if (i === currentIndex) {
          pill.classList.add('active');
        } else if (i < currentIndex) {
          pill.classList.add('completed');
        }
        stepPillsContainer.appendChild(pill);
      }
    }
  }

  function shakeCurrentStep() {
    const active = document.getElementById(state.currentStepId || `step-${state.currentStep}`);
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
          if (state.currentStepId && state.currentStepId !== 'step-0') {
            goToStep(state.currentStepId);
            return;
          } else if (state.currentStep && state.currentStep !== 0) {
            goToStep(state.currentStep);
            return;
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage parse error:', e);
    }
    goToStep('step-0');
  }

  function resetAllData() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}

    state = {
      currentStep: 0,
      currentStepId: 'step-0',
      meetType: 'outing',
      city: null,
      food: null,
      dessert: null,
      day: null,
      time: null,
      addons: [],
      gift: '',
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
