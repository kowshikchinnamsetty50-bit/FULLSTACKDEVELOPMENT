/**
 * SipStreak – HydroHero Hunt
 * Core Application Logic, Reactive State Management & LocalStorage Persistence
 */

// ============================================================================
// 1. DATA MODELS & INITIAL REALISTIC SAMPLE DATA
// ============================================================================

const STORAGE_KEYS = {
  CURRENT_USER: 'sipstreak_current_user',
  USERS: 'sipstreak_users',
  TEAMS: 'sipstreak_teams',
  LOGS: 'sipstreak_water_logs'
};

// SVG Circle circumference for radius 82: 2 * Math.PI * 82 = 515.221
const CIRCLE_CIRCUMFERENCE = 515.22;

/**
 * Initial Realistic Seed Data
 * Seeded with 5 realistic teams (4–8 members each) and authentic hydration data
 */
const DEFAULT_SAMPLE_TEAMS = [
  {
    id: 'team-aqua',
    name: 'Aqua Avengers',
    code: 'AQUA-2041',
    members: [
      { id: 'usr-alex', name: 'Alex Rivers', email: 'alex@hydrohero.com', weight: 70, consumed: 1750, isDemoUser: true },
      { id: 'usr-maya', name: 'Maya Chen', email: 'maya@hydrohero.com', weight: 60, consumed: 2100 },
      { id: 'usr-liam', name: 'Liam Davis', email: 'liam@hydrohero.com', weight: 80, consumed: 2500 },
      { id: 'usr-zoe', name: 'Zoe Patel', email: 'zoe@hydrohero.com', weight: 55, consumed: 1800 },
      { id: 'usr-marcus', name: 'Marcus Vance', email: 'marcus@hydrohero.com', weight: 75, consumed: 2100 }
    ]
  },
  {
    id: 'team-hype',
    name: 'Hydro Hype',
    code: 'HYPE-3092',
    members: [
      { id: 'usr-elena', name: 'Elena Rostova', email: 'elena@hydrohero.com', weight: 65, consumed: 2275, isDemoUser: true },
      { id: 'usr-sam', name: 'Sam Miller', email: 'sam@hydrohero.com', weight: 78, consumed: 2600 },
      { id: 'usr-priya', name: 'Priya Sharma', email: 'priya@hydrohero.com', weight: 58, consumed: 2030 },
      { id: 'usr-jordan', name: 'Jordan Lee', email: 'jordan@hydrohero.com', weight: 72, consumed: 2350 },
      { id: 'usr-carlos', name: 'Carlos Diaz', email: 'carlos@hydrohero.com', weight: 82, consumed: 2500 },
      { id: 'usr-aisha', name: 'Aisha Khan', email: 'aisha@hydrohero.com', weight: 62, consumed: 2170 }
    ]
  },
  {
    id: 'team-hero',
    name: 'H2O Heroes',
    code: 'HERO-5510',
    members: [
      { id: 'usr-david', name: 'David Kim', email: 'david@hydrohero.com', weight: 74, consumed: 2050, isDemoUser: true },
      { id: 'usr-sarah', name: 'Sarah Jenkins', email: 'sarah@hydrohero.com', weight: 63, consumed: 1850 },
      { id: 'usr-lucas', name: 'Lucas Brown', email: 'lucas@hydrohero.com', weight: 85, consumed: 2200 },
      { id: 'usr-chloe', name: 'Chloe Taylor', email: 'chloe@hydrohero.com', weight: 54, consumed: 1550 }
    ]
  },
  {
    id: 'team-wave',
    name: 'Wave Warriors',
    code: 'WAVE-8844',
    members: [
      { id: 'usr-tyler', name: 'Tyler Wood', email: 'tyler@hydrohero.com', weight: 70, consumed: 1600 },
      { id: 'usr-nina', name: 'Nina Gomez', email: 'nina@hydrohero.com', weight: 56, consumed: 1400 },
      { id: 'usr-oliver', name: 'Oliver Wright', email: 'oliver@hydrohero.com', weight: 80, consumed: 1900 },
      { id: 'usr-sophie', name: 'Sophie Martin', email: 'sophie@hydrohero.com', weight: 60, consumed: 1500 },
      { id: 'usr-kevin', name: 'Kevin Chen', email: 'kevin@hydrohero.com', weight: 75, consumed: 1750 }
    ]
  },
  {
    id: 'team-tide',
    name: 'Tidal Titans',
    code: 'TIDE-6219',
    members: [
      { id: 'usr-emma', name: 'Emma Watson', email: 'emma@hydrohero.com', weight: 58, consumed: 1200 },
      { id: 'usr-noah', name: 'Noah Miller', email: 'noah@hydrohero.com', weight: 76, consumed: 1600 },
      { id: 'usr-mia', name: 'Mia Tanaka', email: 'mia@hydrohero.com', weight: 52, consumed: 1100 },
      { id: 'usr-dan', name: 'Daniel Rossi', email: 'dan@hydrohero.com', weight: 82, consumed: 1700 }
    ]
  }
];

const DEFAULT_SAMPLE_USERS = [
  {
    id: 'usr-alex',
    name: 'Alex Rivers',
    email: 'alex@hydrohero.com',
    password: 'password123',
    weight: 70,
    teamId: 'team-aqua',
    isDemoUser: true
  },
  {
    id: 'usr-elena',
    name: 'Elena Rostova',
    email: 'elena@hydrohero.com',
    password: 'password123',
    weight: 65,
    teamId: 'team-hype',
    isDemoUser: true
  },
  {
    id: 'usr-david',
    name: 'David Kim',
    email: 'david@hydrohero.com',
    password: 'password123',
    weight: 74,
    teamId: 'team-hero',
    isDemoUser: true
  }
];

// Seed logs for Alex
const DEFAULT_SAMPLE_LOGS = {
  'usr-alex': [
    { amount: 500, time: '08:30 AM' },
    { amount: 500, time: '11:15 AM' },
    { amount: 250, time: '01:45 PM' },
    { amount: 500, time: '04:20 PM' }
  ]
};

// ============================================================================
// 2. STATE INITIALIZATION & LOCALSTORAGE HELPERS
// ============================================================================

let currentUser = null;
let appUsers = [];
let appTeams = [];
let appLogs = {};
let authMode = 'login'; // 'login' or 'signup'

/**
 * Initialize application state from LocalStorage or seed defaults
 */
function initAppState() {
  try {
    // Teams
    const storedTeams = localStorage.getItem(STORAGE_KEYS.TEAMS);
    if (storedTeams) {
      appTeams = JSON.parse(storedTeams);
    } else {
      appTeams = DEFAULT_SAMPLE_TEAMS;
      localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(appTeams));
    }

    // Users
    const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    if (storedUsers) {
      appUsers = JSON.parse(storedUsers);
    } else {
      appUsers = DEFAULT_SAMPLE_USERS;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(appUsers));
    }

    // Logs
    const storedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (storedLogs) {
      appLogs = JSON.parse(storedLogs);
    } else {
      appLogs = DEFAULT_SAMPLE_LOGS;
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(appLogs));
    }

    // Current Session User
    const storedCurrent = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (storedCurrent) {
      const parsed = JSON.parse(storedCurrent);
      // Validate that user still exists in users list
      const liveUser = appUsers.find(u => u.id === parsed.id || u.email === parsed.email);
      if (liveUser) {
        currentUser = liveUser;
      } else {
        currentUser = null;
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    }
  } catch (err) {
    console.error('Error initializing state from LocalStorage:', err);
    appTeams = DEFAULT_SAMPLE_TEAMS;
    appUsers = DEFAULT_SAMPLE_USERS;
    appLogs = DEFAULT_SAMPLE_LOGS;
    currentUser = null;
  }
}

/**
 * Save current state slices back to LocalStorage
 */
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(appTeams));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(appUsers));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(appLogs));
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (e) {
    console.error('Error saving state to LocalStorage:', e);
  }
}

// ============================================================================
// 3. CORE HYDRATION FORMULAS
// ============================================================================

/**
 * Requirement 2: Calculate daily water target using Weight × 35ml
 * @param {number} weightInKg - user weight in kg
 * @returns {number} target in ml
 */
function calculateWaterTarget(weightInKg) {
  const w = parseFloat(weightInKg) || 70;
  return Math.round(w * 35);
}

/**
 * Get user's today consumed water in ml
 */
function getUserConsumed(userId) {
  // Look up in team member entries first for consistency
  for (const team of appTeams) {
    const mem = team.members.find(m => m.id === userId);
    if (mem && typeof mem.consumed === 'number') {
      return mem.consumed;
    }
  }
  // Fallback to logs array sum
  const userLogs = appLogs[userId] || [];
  return userLogs.reduce((acc, log) => acc + (log.amount || 0), 0);
}

/**
 * Get user's percentage of hydration target achieved
 */
function getUserPercentage(user) {
  const target = calculateWaterTarget(user.weight);
  const consumed = getUserConsumed(user.id);
  if (target <= 0) return 0;
  const pct = Math.round((consumed / target) * 100);
  return pct;
}

// ============================================================================
// 4. AUTHENTICATION & DEMO LOGIN (FEATURE 1)
// ============================================================================

/**
 * Switch between Login and Signup tabs
 */
function switchAuthMode(mode) {
  authMode = mode;
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const fieldName = document.getElementById('field-group-name');
  const fieldWeight = document.getElementById('field-group-weight');
  const submitText = document.getElementById('btn-auth-text');
  const inputName = document.getElementById('input-name');

  if (mode === 'signup') {
    tabSignup.classList.add('active');
    tabSignup.setAttribute('aria-selected', 'true');
    tabLogin.classList.remove('active');
    tabLogin.setAttribute('aria-selected', 'false');

    fieldName.classList.remove('hidden');
    fieldWeight.classList.remove('hidden');
    inputName.setAttribute('required', 'required');
    submitText.textContent = 'Create HydroHero Account';
  } else {
    tabLogin.classList.add('active');
    tabLogin.setAttribute('aria-selected', 'true');
    tabSignup.classList.remove('active');
    tabSignup.setAttribute('aria-selected', 'false');

    fieldName.classList.add('hidden');
    fieldWeight.classList.add('hidden');
    inputName.removeAttribute('required');
    submitText.textContent = 'Login to Dashboard';
  }
}

/**
 * Handle Auth Form Submit (Login or Signup)
 */
function handleAuthSubmit(event) {
  event.preventDefault();

  const emailInput = document.getElementById('input-email');
  const passwordInput = document.getElementById('input-password');
  const nameInput = document.getElementById('input-name');
  const weightInput = document.getElementById('input-weight');

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showToast('Missing Fields', 'Please enter both email and password.', 'error');
    return;
  }

  if (authMode === 'signup') {
    const name = nameInput.value.trim();
    const weight = parseFloat(weightInput.value) || 70;

    if (!name) {
      showToast('Name Required', 'Please enter your full name to sign up.', 'error');
      return;
    }

    // Check if email already registered
    const existing = appUsers.find(u => u.email === email);
    if (existing) {
      showToast('Account Exists', 'An account with this email already exists. Please log in.', 'error');
      switchAuthMode('login');
      return;
    }

    // Assign to a starting team with room (or default to Aqua Avengers if room, else lowest member count)
    let assignedTeam = appTeams.find(t => t.members.length < 8) || appTeams[0];

    const newUser = {
      id: 'usr-' + Date.now(),
      name: name,
      email: email,
      password: password,
      weight: weight,
      teamId: assignedTeam.id,
      isDemoUser: false
    };

    appUsers.push(newUser);

    // Add member into assigned team
    assignedTeam.members.push({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      weight: newUser.weight,
      consumed: 0
    });

    currentUser = newUser;
    appLogs[newUser.id] = [];

    saveState();
    showToast('Welcome HydroHero! 🎉', `Account created successfully! Assigned to squad ${assignedTeam.name}.`, 'success');
    redirectToDashboard();

  } else {
    // Login Mode
    const user = appUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      showToast('Login Failed', 'Invalid email or password. You can also use quick demo login below!', 'error');
      return;
    }

    currentUser = user;
    saveState();
    showToast('Welcome back! 💧', `Logged in as ${currentUser.name}.`, 'success');
    redirectToDashboard();
  }
}

/**
 * Instant Demo Login with a pre-seeded HydroHero
 */
function quickDemoLogin(userId) {
  const user = appUsers.find(u => u.id === userId);
  if (!user) {
    showToast('Demo User Not Found', 'Could not locate sample user.', 'error');
    return;
  }

  currentUser = user;
  saveState();
  showToast('Demo Mode Activated', `Switched to ${user.name}!`, 'info');
  redirectToDashboard();
}

/**
 * Handle user logout and return to login screen
 */
function handleLogout() {
  currentUser = null;
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  document.getElementById('auth-screen').classList.add('active');
  document.getElementById('main-app').classList.add('hidden');
  showToast('Logged Out', 'You have been safely logged out.', 'info');
}

/**
 * Redirect user to the hydration dashboard
 */
function redirectToDashboard() {
  document.getElementById('auth-screen').classList.remove('active');
  document.getElementById('main-app').classList.remove('hidden');

  // Synchronize and render all 5 feature views
  renderAllViews();

  // Scroll to top of dashboard
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Populate demo user switch pills on auth page
 */
function renderDemoPills() {
  const container = document.getElementById('demo-user-pills');
  if (!container) return;

  const demoUsers = appUsers.filter(u => u.isDemoUser);
  container.innerHTML = demoUsers.map(user => {
    const team = appTeams.find(t => t.id === user.teamId);
    const initials = getInitials(user.name);
    return `
      <button type="button" class="demo-user-pill" onclick="quickDemoLogin('${user.id}')">
        <div class="demo-pill-user">
          <div class="demo-avatar">${initials}</div>
          <span class="demo-name">${user.name}</span>
        </div>
        <div class="demo-meta">
          <span class="demo-team-tag">${team ? team.name : 'Hydro Squad'}</span>
          <span class="demo-quick-arrow">➜</span>
        </div>
      </button>
    `;
  }).join('');
}

// ============================================================================
// 5. HYDRATION DASHBOARD & LOGGING (FEATURES 2 & 3)
// ============================================================================

/**
 * Render the Personal Hydration Dashboard
 */
function renderHydrationDashboard() {
  if (!currentUser) return;

  const targetMl = calculateWaterTarget(currentUser.weight);
  const consumedMl = getUserConsumed(currentUser.id);
  const remainingMl = Math.max(0, targetMl - consumedMl);
  const progressPct = targetMl > 0 ? Math.round((consumedMl / targetMl) * 100) : 0;

  // Header and Greeting
  const userFirstName = currentUser.name.split(' ')[0];
  const userTeam = appTeams.find(t => t.id === currentUser.teamId);

  setText('header-user-name', currentUser.name);
  setText('header-user-team', userTeam ? userTeam.name : 'Free Agent');
  setText('header-user-avatar', getInitials(currentUser.name));
  setText('dash-user-name-banner', userFirstName);

  // Weight & Target Display
  setText('gauge-user-weight', currentUser.weight);
  setText('stat-consumed-ml', formatNumber(consumedMl));
  setText('stat-target-ml', formatNumber(targetMl));

  // Circular Hydration Progress Indicator
  const circleBar = document.getElementById('progress-circle-bar');
  const pctText = document.getElementById('gauge-percentage-text');
  const statusBadge = document.getElementById('gauge-status-badge');

  if (circleBar && pctText) {
    pctText.textContent = `${progressPct}%`;

    // Cap the visual circle arc at 100% (515.22 - (Math.min(100, progressPct) / 100) * 515.22)
    const visualPct = Math.min(100, Math.max(0, progressPct));
    const offset = CIRCLE_CIRCUMFERENCE - (visualPct / 100) * CIRCLE_CIRCUMFERENCE;
    circleBar.style.strokeDashoffset = offset;

    if (progressPct >= 100) {
      statusBadge.textContent = 'Goal Achieved! 🏆';
      statusBadge.className = 'gauge-status-label achieved';
    } else if (progressPct >= 75) {
      statusBadge.textContent = 'Almost There! 💧';
      statusBadge.className = 'gauge-status-label';
    } else if (progressPct >= 40) {
      statusBadge.textContent = 'Good Hydration 🌊';
      statusBadge.className = 'gauge-status-label';
    } else {
      statusBadge.textContent = 'Keep Sipping 🚰';
      statusBadge.className = 'gauge-status-label';
    }
  }

  // Remaining Water Banner
  const remainingCard = document.getElementById('remaining-water-card');
  const remainingText = document.getElementById('stat-remaining-ml');
  const remainingIcon = document.getElementById('remaining-icon');

  if (remainingCard && remainingText) {
    if (remainingMl <= 0) {
      remainingCard.className = 'remaining-water-card goal-met';
      remainingText.textContent = `Goal Met! +${formatNumber(consumedMl - targetMl)} ml Bonus Hydration! 🌟`;
      remainingIcon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    } else {
      remainingCard.className = 'remaining-water-card';
      remainingText.textContent = `${formatNumber(remainingMl)} ml required to reach goal`;
      remainingIcon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
    }
  }

  // Render Recent Activity Logs Tray
  renderRecentLogs();
}

/**
 * Requirement 3: Add functional buttons for +250ml, +500ml and +750ml
 * Update hydration progress immediately after clicking and save to LocalStorage
 */
function logWater(amount) {
  if (!currentUser) return;

  const validAmount = parseInt(amount, 10);
  if (isNaN(validAmount) || validAmount <= 0) {
    showToast('Invalid Amount', 'Please specify a positive water amount.', 'error');
    return;
  }

  // Record into logs
  if (!appLogs[currentUser.id]) {
    appLogs[currentUser.id] = [];
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  appLogs[currentUser.id].unshift({
    amount: validAmount,
    time: timeStr
  });

  // Keep last 15 entries for performance
  if (appLogs[currentUser.id].length > 15) {
    appLogs[currentUser.id] = appLogs[currentUser.id].slice(0, 15);
  }

  // Update current user's team member record so the team and leaderboard update immediately
  updateMemberConsumption(currentUser.id, validAmount);

  // Save to LocalStorage
  saveState();

  // Trigger immediate reactive UI update
  renderHydrationDashboard();
  renderTeamView();
  renderLeaderboard();

  // Celebration Toast
  showToast(
    `+${validAmount}ml Logged! 💧`,
    `Great job! Hydration updated immediately for you and your team.`,
    'success'
  );

  // Trigger droplet pulse effect on gauge
  triggerGaugePulse();
}

/**
 * Handle custom water quantity logging
 */
function handleCustomWaterLog(event) {
  event.preventDefault();
  const input = document.getElementById('custom-water-input');
  const amount = parseInt(input.value, 10);

  if (isNaN(amount) || amount <= 0) {
    showToast('Invalid Amount', 'Please enter a valid amount between 10ml and 3,000ml.', 'error');
    return;
  }

  logWater(amount);
  input.value = '';
}

/**
 * Reset today's water intake for testing convenience
 */
function resetTodaysWater() {
  if (!currentUser) return;

  if (!confirm('Are you sure you want to reset your logged water for today to 0ml?')) {
    return;
  }

  appLogs[currentUser.id] = [];

  // Reset in member object
  for (const team of appTeams) {
    const mem = team.members.find(m => m.id === currentUser.id);
    if (mem) {
      mem.consumed = 0;
      break;
    }
  }

  saveState();
  renderHydrationDashboard();
  renderTeamView();
  renderLeaderboard();
  showToast('Reset Complete', 'Your daily water consumption has been reset to 0 ml.', 'info');
}

/**
 * Render today's recent logs chips
 */
function renderRecentLogs() {
  const container = document.getElementById('recent-logs-list');
  if (!container || !currentUser) return;

  const logs = appLogs[currentUser.id] || [];

  if (logs.length === 0) {
    container.innerHTML = '<span class="empty-logs-msg">No water logged yet today. Click a button above!</span>';
    return;
  }

  container.innerHTML = logs.slice(0, 5).map(log => `
    <span class="log-chip">
      <span>💧 +${log.amount}ml</span>
      <span class="chip-time">${log.time}</span>
    </span>
  `).join('');
}

/**
 * Helper to update consumption in the team members array
 */
function updateMemberConsumption(userId, deltaAmount) {
  for (const team of appTeams) {
    const mem = team.members.find(m => m.id === userId);
    if (mem) {
      mem.consumed = Math.max(0, (mem.consumed || 0) + deltaAmount);
      return;
    }
  }

  // If user was not yet in their team's member list, insert them
  const currentTeam = appTeams.find(t => t.id === currentUser.teamId);
  if (currentTeam) {
    currentTeam.members.push({
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      weight: currentUser.weight,
      consumed: Math.max(0, deltaAmount)
    });
  }
}

/**
 * Visual pulse animation trigger on circular gauge
 */
function triggerGaugePulse() {
  const gauge = document.querySelector('.circular-progress-container');
  if (!gauge) return;
  gauge.classList.remove('pulse-active');
  void gauge.offsetWidth; // trigger reflow
  gauge.classList.add('pulse-active');
}

// ============================================================================
// 6. TEAM CREATION & JOINING (FEATURE 4)
// ============================================================================

/**
 * Generate a unique, readable Team Code (e.g., SQUAD-4912)
 */
function generateUniqueTeamCode(prefix = 'HYDRO') {
  let code = '';
  let attempts = 0;
  do {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    code = `${prefix.toUpperCase().slice(0, 5)}-${randomDigits}`;
    attempts++;
  } while (appTeams.some(t => t.code === code) && attempts < 100);
  return code;
}

/**
 * Render Active Team View
 * Supports 4–8 members per team with total team water calculation
 */
function renderTeamView() {
  const container = document.getElementById('current-team-view');
  if (!container || !currentUser) return;

  const currentTeam = appTeams.find(t => t.id === currentUser.teamId);

  if (!currentTeam) {
    container.innerHTML = `
      <div class="card text-center" style="padding: 40px 20px;">
        <div style="font-size: 3rem; margin-bottom: 12px;">🛡️</div>
        <h4 style="font-size: 1.3rem; margin-bottom: 6px;">You are not in a team yet</h4>
        <p style="color: var(--text-muted); max-width: 450px; margin: 0 auto 20px;">
          Create a squad or enter a team code to collaborate with 4–8 teammates and compete on the live leaderboard!
        </p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="openCreateTeamModal()">Create New Team</button>
          <button class="btn btn-outline-primary" onclick="openJoinTeamModal()">Join with Code</button>
        </div>
      </div>
    `;
    return;
  }

  // Calculate team total water consumption
  const totalWater = currentTeam.members.reduce((acc, m) => acc + (m.consumed || 0), 0);
  
  // Calculate team average percentage of individual hydration targets achieved
  const avgPct = calculateTeamAveragePercentage(currentTeam);

  // Check 4-8 member capacity status
  const memberCount = currentTeam.members.length;
  const isOptimalCapacity = memberCount >= 4 && memberCount <= 8;
  const isFull = memberCount >= 8;

  container.innerHTML = `
    <div class="team-card-container">
      <!-- Team Banner & Summary -->
      <div class="team-banner-card">
        <div class="team-banner-main">
          <div class="team-emblem-wrap">
            <span>💧</span>
          </div>
          <div>
            <h4 class="team-name-title">${currentTeam.name}</h4>
            <div class="team-code-badge-wrap">
              <span class="team-code-pill">Code: <strong>${currentTeam.code}</strong></span>
              <button class="btn-copy-code" onclick="copyTeamCode('${currentTeam.code}')" title="Copy code to share with friends">
                📋 Copy Code
              </button>
              <span class="team-capacity-pill ${isOptimalCapacity ? 'valid' : 'warning'}">
                ${memberCount}/8 Members ${isOptimalCapacity ? '(Active Squad)' : '(Needs 4–8 Members)'}
              </span>
              ${isFull ? '<span class="team-capacity-pill warning">Squad Full</span>' : ''}
            </div>
          </div>
        </div>

        <div class="team-banner-stats">
          <div class="team-hero-stat">
            <span class="team-hero-stat-label">Squad Total Water</span>
            <div class="team-hero-stat-val">
              <span>${formatNumber(totalWater)}</span>
              <span class="unit">ml</span>
            </div>
          </div>
          <div class="team-hero-stat">
            <span class="team-hero-stat-label">Hydration Score</span>
            <div class="team-hero-stat-val" style="color: var(--primary-600)">
              <span>${avgPct}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Members Grid (4–8 members) -->
      <div class="card card-team-members">
        <div class="members-card-header">
          <div>
            <h4 class="card-title">Squad Members (${memberCount} of max 8)</h4>
            <p class="card-subtitle">Every member's individual hydration goal fuels the team leaderboard rank</p>
          </div>
          ${!isFull ? `
            <button class="btn btn-outline-light btn-sm" onclick="openJoinTeamModal()">
              Switch Team
            </button>
          ` : ''}
        </div>

        <div class="members-grid">
          ${currentTeam.members.map(member => {
            const isUser = member.id === currentUser.id;
            const target = calculateWaterTarget(member.weight);
            const consumed = member.consumed || 0;
            const pct = target > 0 ? Math.round((consumed / target) * 100) : 0;
            const visualWidth = Math.min(100, pct);
            const initials = getInitials(member.name);

            return `
              <div class="member-card ${isUser ? 'is-current-user' : ''}">
                <div class="member-card-header">
                  <div class="member-info-group">
                    <div class="member-avatar">${initials}</div>
                    <div>
                      <span class="member-name">
                        ${member.name}
                        ${isUser ? '<span class="you-tag">You</span>' : ''}
                      </span>
                      <span class="member-weight-note">${member.weight}kg • Target: ${formatNumber(target)}ml</span>
                    </div>
                  </div>
                  <span class="member-pct-badge">${pct}%</span>
                </div>

                <div class="member-progress-track">
                  <div class="member-progress-fill ${pct >= 100 ? 'full' : ''}" style="width: ${visualWidth}%;"></div>
                </div>

                <div class="member-stats-footer">
                  <span>Consumed: <strong>${formatNumber(consumed)} ml</strong></span>
                  <span>Goal: <strong>${formatNumber(target)} ml</strong></span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

/**
 * Handle Team Creation Form Submit
 */
function handleCreateTeamSubmit(event) {
  event.preventDefault();
  if (!currentUser) return;

  const nameInput = document.getElementById('input-team-name');
  const teamName = nameInput.value.trim();

  if (!teamName) {
    showToast('Name Required', 'Please enter a team name.', 'error');
    return;
  }

  // Remove user from previous team
  removeUserFromAllTeams(currentUser.id);

  const cleanPrefix = teamName.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4) || 'SQUAD';
  const newTeamCode = generateUniqueTeamCode(cleanPrefix);

  const newTeam = {
    id: 'team-' + Date.now(),
    name: teamName,
    code: newTeamCode,
    members: [
      {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        weight: currentUser.weight,
        consumed: getUserConsumed(currentUser.id)
      }
    ]
  };

  appTeams.push(newTeam);
  currentUser.teamId = newTeam.id;

  // Also update user record in appUsers
  const u = appUsers.find(x => x.id === currentUser.id);
  if (u) u.teamId = newTeam.id;

  saveState();
  closeModal('modal-create-team');
  nameInput.value = '';

  renderAllViews();
  showToast(
    'Team Created! 🚀',
    `Squad "${newTeam.name}" formed with code ${newTeam.code}. Invite 3-7 more members!`,
    'success'
  );
}

/**
 * Handle Joining an Existing Team by Unique Team Code
 * Enforces 4–8 members capacity constraint
 */
function handleJoinTeamSubmit(event) {
  event.preventDefault();
  if (!currentUser) return;

  const codeInput = document.getElementById('input-team-code');
  const enteredCode = codeInput.value.trim().toUpperCase();

  if (!enteredCode) {
    showToast('Code Required', 'Please enter a unique team code.', 'error');
    return;
  }

  // Find target team by unique code
  const targetTeam = appTeams.find(t => t.code.toUpperCase() === enteredCode);

  if (!targetTeam) {
    showToast('Team Not Found', `No team found with code "${enteredCode}". Please check and try again.`, 'error');
    return;
  }

  // Check if user is already in this team
  if (targetTeam.id === currentUser.teamId) {
    showToast('Already a Member', `You are already in ${targetTeam.name}!`, 'info');
    closeModal('modal-join-team');
    return;
  }

  // Support teams with 4–8 members: Validate capacity
  if (targetTeam.members.length >= 8) {
    showToast(
      'Team Full (Max 8 Members)',
      `Sorry, "${targetTeam.name}" has reached the maximum capacity of 8 members.`,
      'error'
    );
    return;
  }

  // Remove from old team
  removeUserFromAllTeams(currentUser.id);

  // Add to new team
  targetTeam.members.push({
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    weight: currentUser.weight,
    consumed: getUserConsumed(currentUser.id)
  });

  currentUser.teamId = targetTeam.id;
  const u = appUsers.find(x => x.id === currentUser.id);
  if (u) u.teamId = targetTeam.id;

  saveState();
  closeModal('modal-join-team');
  codeInput.value = '';

  renderAllViews();
  showToast(
    'Joined Squad! 🌊',
    `You are now a proud member of ${targetTeam.name}! (${targetTeam.members.length}/8 members)`,
    'success'
  );
}

/**
 * Helper to remove user from all teams when switching or creating
 */
function removeUserFromAllTeams(userId) {
  for (const team of appTeams) {
    team.members = team.members.filter(m => m.id !== userId);
  }
}

/**
 * Copy team code to clipboard
 */
function copyTeamCode(code) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      showToast('Code Copied! 📋', `Team Code ${code} copied to clipboard.`, 'success');
    }).catch(() => {
      fallbackCopy(code);
    });
  } else {
    fallbackCopy(code);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  showToast('Code Copied! 📋', `Team Code ${text} copied to clipboard.`, 'success');
}

// ============================================================================
// 7. LIVE TEAM LEADERBOARD (FEATURE 5)
// ============================================================================

/**
 * Requirement 5: Calculate team hydration score based on average percentage of individual hydration goals achieved
 * @param {Object} team
 * @returns {number} average percentage rounded to 1 decimal place
 */
function calculateTeamAveragePercentage(team) {
  if (!team || !team.members || team.members.length === 0) return 0;

  let totalPctSum = 0;

  for (const member of team.members) {
    const target = calculateWaterTarget(member.weight);
    const consumed = member.consumed || 0;
    // Calculate individual percentage achieved
    const memberPct = target > 0 ? (consumed / target) * 100 : 0;
    totalPctSum += memberPct;
  }

  const avgPct = totalPctSum / team.members.length;
  return Math.round(avgPct * 10) / 10;
}

/**
 * Render Live Team Leaderboard
 * Automatically ranks teams by average % and highlights positions 1, 2, 3
 */
function renderLeaderboard() {
  const podiumContainer = document.getElementById('leaderboard-podium');
  const tbodyContainer = document.getElementById('leaderboard-tbody');

  if (!tbodyContainer) return;

  // Compute stats and ranking for all teams
  const rankedTeams = appTeams.map(team => {
    const avgScore = calculateTeamAveragePercentage(team);
    const totalWater = team.members.reduce((acc, m) => acc + (m.consumed || 0), 0);
    return {
      ...team,
      score: avgScore,
      totalWater: totalWater,
      memberCount: team.members.length,
      isUserTeam: currentUser && team.id === currentUser.teamId
    };
  });

  // Sort descending by hydration score (average %)
  // Tie-breaker: total water consumed
  rankedTeams.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.totalWater - a.totalWater;
  });

  // Render Top 3 Podium Showcase (Highlights 1st, 2nd, 3rd positions)
  if (podiumContainer) {
    const top3 = rankedTeams.slice(0, 3);
    const first = top3[0];
    const second = top3[1];
    const third = top3[2];

    // Podium layout: 2nd on left, 1st in center (elevated), 3rd on right
    let podiumHtml = '';

    // 2nd Place Silver
    if (second) {
      podiumHtml += renderPodiumCard(second, 2, '🥈', 'Silver');
    }

    // 1st Place Gold
    if (first) {
      podiumHtml += renderPodiumCard(first, 1, '🥇', 'Gold');
    }

    // 3rd Place Bronze
    if (third) {
      podiumHtml += renderPodiumCard(third, 3, '🥉', 'Bronze');
    }

    podiumContainer.innerHTML = podiumHtml;
  }

  // Render Full Leaderboard Table
  tbodyContainer.innerHTML = rankedTeams.map((team, index) => {
    const rank = index + 1;
    let rankBadgeClass = '';
    let medalEmoji = '';

    if (rank === 1) {
      rankBadgeClass = 'gold';
      medalEmoji = '🥇 ';
    } else if (rank === 2) {
      rankBadgeClass = 'silver';
      medalEmoji = '🥈 ';
    } else if (rank === 3) {
      rankBadgeClass = 'bronze';
      medalEmoji = '🥉 ';
    }

    const visualBarWidth = Math.min(100, Math.round(team.score));

    return `
      <tr class="${team.isUserTeam ? 'user-team-row' : ''}">
        <td class="td-rank">
          <div class="rank-badge-cell ${rankBadgeClass}">
            ${rank <= 3 ? medalEmoji : rank}
          </div>
        </td>
        <td>
          <div class="table-team-cell">
            <div>
              <div class="table-team-title">
                ${team.name}
                ${team.isUserTeam ? '<span class="your-team-pill">Your Squad</span>' : ''}
              </div>
              <span class="table-team-code">Code: ${team.code}</span>
            </div>
          </div>
        </td>
        <td>
          <strong>${team.memberCount}</strong> / 8 members
        </td>
        <td>
          <strong>${formatNumber(team.totalWater)}</strong> ml
        </td>
        <td>
          <div class="score-cell-wrap">
            <span class="score-pct-text">${team.score}%</span>
            <div class="score-bar-bg">
              <div class="score-bar-fill" style="width: ${visualBarWidth}%;"></div>
            </div>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Render single podium card for top 3
 */
function renderPodiumCard(team, rank, medal, medalName) {
  return `
    <div class="podium-card rank-${rank}">
      <div class="podium-medal-badge">${medal}</div>
      <span class="podium-rank-tag">${medalName} • #${rank} Rank</span>
      <h4 class="podium-team-name">${team.name}</h4>
      <span class="podium-team-code">Code: ${team.code}</span>
      
      <div class="podium-score-pill">
        <span class="podium-score-label">Hydration Score</span>
        <span class="podium-score-num">${team.score}%</span>
      </div>

      <span class="podium-members-note">
        ${team.memberCount} members • ${formatNumber(team.totalWater)} ml logged
      </span>

      ${team.isUserTeam ? '<span class="your-team-pill" style="margin-top: 4px;">Your Squad</span>' : ''}
    </div>
  `;
}

// ============================================================================
// 8. BODY WEIGHT UPDATE MODAL
// ============================================================================

function openWeightModal() {
  if (!currentUser) return;
  const input = document.getElementById('input-edit-weight');
  input.value = currentUser.weight;
  updateModalTargetPreview(currentUser.weight);

  input.oninput = (e) => {
    updateModalTargetPreview(e.target.value);
  };

  openModal('modal-weight');
}

function updateModalTargetPreview(weight) {
  const target = calculateWaterTarget(weight);
  setText('modal-target-preview', `${formatNumber(target)} ml`);
}

function handleUpdateWeightSubmit(event) {
  event.preventDefault();
  if (!currentUser) return;

  const input = document.getElementById('input-edit-weight');
  const newWeight = parseFloat(input.value);

  if (isNaN(newWeight) || newWeight < 30 || newWeight > 250) {
    showToast('Invalid Weight', 'Please enter a valid weight between 30kg and 250kg.', 'error');
    return;
  }

  currentUser.weight = newWeight;

  // Update in appUsers
  const u = appUsers.find(x => x.id === currentUser.id);
  if (u) u.weight = newWeight;

  // Update in team members
  for (const team of appTeams) {
    const mem = team.members.find(m => m.id === currentUser.id);
    if (mem) {
      mem.weight = newWeight;
      break;
    }
  }

  saveState();
  closeModal('modal-weight');
  renderAllViews();

  const newTarget = calculateWaterTarget(newWeight);
  showToast(
    'Target Updated 💧',
    `New daily hydration target is ${formatNumber(newTarget)} ml (${newWeight}kg × 35ml).`,
    'success'
  );
}

// ============================================================================
// 9. MODALS, NOTIFICATIONS & UI UTILITIES
// ============================================================================

function openCreateTeamModal() {
  openModal('modal-create-team');
}

function openJoinTeamModal() {
  openModal('modal-join-team');
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    const firstInput = modal.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('hidden');
}

function handleBackdropClick(event, modalId) {
  if (event.target.id === modalId) {
    closeModal(modalId);
  }
}

/**
 * Toast Notification System
 */
function showToast(title, message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconEmoji = '💧';
  if (type === 'success') iconEmoji = '✨';
  if (type === 'error') iconEmoji = '⚠️';

  toast.innerHTML = `
    <div class="toast-icon">${iconEmoji}</div>
    <div class="toast-text-wrap">
      <span class="toast-title">${title}</span>
      <span class="toast-msg">${message}</span>
    </div>
  `;

  container.appendChild(toast);

  // Auto-remove after 3.8s
  setTimeout(() => {
    toast.classList.add('toast-hide');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 400);
  }, 3800);
}

/**
 * Smooth scrolling to navigation sections
 */
function scrollToSection(sectionId, event) {
  if (event) event.preventDefault();
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    // Update active nav-tab styling
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    if (event && event.currentTarget) {
      event.currentTarget.classList.add('active');
    }
  }
}

function getInitials(name) {
  if (!name) return 'HH';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatNumber(num) {
  return Number(num || 0).toLocaleString();
}

function setText(elementId, text) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = text;
}

/**
 * Synchronize and render all 5 application views
 */
function renderAllViews() {
  renderHydrationDashboard();
  renderTeamView();
  renderLeaderboard();
}

// Live calculation preview in signup weight input
document.addEventListener('DOMContentLoaded', () => {
  initAppState();

  const weightInput = document.getElementById('input-weight');
  const previewSpan = document.getElementById('weight-preview-calc');
  if (weightInput && previewSpan) {
    weightInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) || 70;
      previewSpan.textContent = `${formatNumber(calculateWaterTarget(val))} ml`;
    });
  }

  // Populate date
  const dateDisplay = document.getElementById('current-date-display');
  if (dateDisplay) {
    const today = new Date();
    dateDisplay.textContent = today.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  // Populate demo login pills on auth screen
  renderDemoPills();

  // If user is already stored and valid in LocalStorage, auto-load dashboard
  if (currentUser) {
    redirectToDashboard();
  } else {
    // Show login page
    document.getElementById('auth-screen').classList.add('active');
    document.getElementById('main-app').classList.add('hidden');
  }
});
