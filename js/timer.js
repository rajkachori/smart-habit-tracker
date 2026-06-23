(() => {
    const WORK_TIME = 25 * 60;
    const BREAK_TIME = 5 * 60;

    let timeLeft = WORK_TIME;
    let totalTime = WORK_TIME;
    let timerId = null;
    let isRunning = false;
    let isWorkMode = true;

    const display = document.getElementById('time-display');
    const circle = document.getElementById('timer-circle');
    const btnStart = document.getElementById('btn-start');
    const btnReset = document.getElementById('btn-reset');
    const modeWork = document.getElementById('mode-work');
    const modeBreak = document.getElementById('mode-break');
    const timerPanel = document.getElementById('timer-panel');

    const overlay = document.getElementById('timer-overlay');
    const displayExpanded = document.getElementById('time-display-expanded');
    const circleExpanded = document.getElementById('timer-circle-expanded');
    const btnStartExpanded = document.getElementById('btn-start-expanded');
    const btnResetExpanded = document.getElementById('btn-reset-expanded');
    const modeWorkExp = document.getElementById('mode-work-expanded');
    const modeBreakExp = document.getElementById('mode-break-expanded');
    const closeBtn = document.getElementById('timer-overlay-close');
    const statusEl = document.getElementById('timer-modal-status');

    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;

    const radiusExp = circleExpanded.r.baseVal.value;
    const circumferenceExp = 2 * Math.PI * radiusExp;
    circleExpanded.style.strokeDasharray = `${circumferenceExp} ${circumferenceExp}`;

    const bellSound = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const label = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        display.textContent = label;
        const progress = timeLeft / totalTime;
        const dashoffset = circumference - progress * circumference;
        circle.style.strokeDashoffset = dashoffset;

        displayExpanded.textContent = label;
        const dashoffsetExp = circumferenceExp - progress * circumferenceExp;
        circleExpanded.style.strokeDashoffset = dashoffsetExp;

        if (statusEl) {
            if (isRunning) {
                statusEl.textContent = isWorkMode ? '🔥 Deep work mode — stay focused.' : '☕ Break time — breathe.';
            } else if (timeLeft === 0) {
                statusEl.textContent = '✅ Session complete! Great work.';
            } else {
                statusEl.textContent = 'Ready when you are.';
            }
        }

        document.title = isRunning ? `${label} — Focus Timer` : 'Smart Habit Tracker';
    }

    function syncModeButtons() {
        if (isWorkMode) {
            modeWork.classList.add('active');
            modeBreak.classList.remove('active');
            modeWorkExp.classList.add('active');
            modeBreakExp.classList.remove('active');
        } else {
            modeBreak.classList.add('active');
            modeWork.classList.remove('active');
            modeBreakExp.classList.add('active');
            modeWorkExp.classList.remove('active');
        }
    }

    function syncStartButtons() {
        const label = isRunning ? 'Pause' : 'Start';
        btnStart.textContent = label;
        btnStartExpanded.textContent = label;
    }

    function tick() {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timerId);
            isRunning = false;
            syncStartButtons();
            updateDisplay();
            bellSound.play().catch(() => { });
        }
    }

    function toggleTimer() {
        if (isRunning) {
            clearInterval(timerId);
        } else {
            timerId = setInterval(tick, 1000);
        }
        isRunning = !isRunning;
        syncStartButtons();
        updateDisplay();
    }

    function resetTimer() {
        clearInterval(timerId);
        isRunning = false;
        timeLeft = isWorkMode ? WORK_TIME : BREAK_TIME;
        syncStartButtons();
        updateDisplay();
    }

    function setMode(toWorkMode) {
        isWorkMode = toWorkMode;
        totalTime = isWorkMode ? WORK_TIME : BREAK_TIME;
        syncModeButtons();
        resetTimer();
    }

    // =============================================
    //  OVERLAY OPEN / CLOSE
    // =============================================
    function openOverlay() {
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    }

    function closeOverlay() {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    timerPanel.addEventListener('click', (e) => {
        // Don't trigger if the user clicked a button inside the panel
        if (e.target.closest('button')) return;
        openOverlay();
    });

    closeBtn.addEventListener('click', closeOverlay);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeOverlay();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
            closeOverlay();
        }
    });

    // =============================================
    //  EVENT LISTENERS — small panel
    // =============================================
    btnStart.addEventListener('click', toggleTimer);
    btnReset.addEventListener('click', resetTimer);
    modeWork.addEventListener('click', () => setMode(true));
    modeBreak.addEventListener('click', () => setMode(false));

    // =============================================
    //  EVENT LISTENERS — expanded overlay
    // =============================================
    btnStartExpanded.addEventListener('click', toggleTimer);
    btnResetExpanded.addEventListener('click', resetTimer);
    modeWorkExp.addEventListener('click', () => setMode(true));
    modeBreakExp.addEventListener('click', () => setMode(false));

    // =============================================
    //  INIT
    // =============================================
    updateDisplay();
})();