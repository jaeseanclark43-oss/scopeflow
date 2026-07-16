// Application State
let appState = {
  currentStep: 1,
  theme: 'dark',
  projectTitle: '',
  problemStatement: '',
  businessGoals: '',
  targetAudience: '',
  features: [],
  actions: [],
  designTheme: 'Modern Tech',
  lookFeelDescription: '',
  screens: [],
  metrics: [],
  qualityStandards: ['Mobile Responsiveness', 'Accessibility Compliance (WCAG)', 'Secure User Data Handling'],
  projectSummary: ''
};

// DOM Elements
const form = document.getElementById('brd-form');
const panels = document.querySelectorAll('.step-panel');
const stepNodes = document.querySelectorAll('.step-node');
const dotGroup = document.getElementById('dot-navigation-group');
const progressBarFill = document.getElementById('progress-bar-fill');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const themeToggle = document.getElementById('theme-toggle');
const resetBtn = document.getElementById('reset-btn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// Dynamic List inputs
const featureTitleInput = document.getElementById('feature-title-input');
const featureDescInput = document.getElementById('feature-desc-input');
const featurePriorityInput = document.getElementById('feature-priority-input');
const addFeatureBtn = document.getElementById('add-feature-btn');
const featuresDisplayList = document.getElementById('features-display-list');
const featuresError = document.getElementById('features-list-error');

const actionActorInput = document.getElementById('action-actor-input');
const actionBehaviorInput = document.getElementById('action-behavior-input');
const addActionBtn = document.getElementById('add-action-btn');
const actionsDisplayList = document.getElementById('actions-display-list');
const actionsError = document.getElementById('actions-list-error');

const screenNameInput = document.getElementById('screen-name-input');
const screenDescInput = document.getElementById('screen-desc-input');
const addScreenBtn = document.getElementById('add-screen-btn');
const screensDisplayList = document.getElementById('screens-display-list');
const screensError = document.getElementById('screens-list-error');

const metricNameInput = document.getElementById('metric-name-input');
const metricTargetInput = document.getElementById('metric-target-input');
const addMetricBtn = document.getElementById('add-metric-btn');
const metricsDisplayList = document.getElementById('metrics-display-list');
const metricsError = document.getElementById('metrics-list-error');

// Textareas and Character Counters
const problemTextarea = document.getElementById('problem-statement');
const goalsTextarea = document.getElementById('business-goals');
const summaryTextarea = document.getElementById('project-summary');

const problemCharCount = document.getElementById('problem-char-count');
const goalsCharCount = document.getElementById('goals-char-count');
const summaryCharCount = document.getElementById('summary-char-count');

// Export Elements
const copyMarkdownBtn = document.getElementById('copy-markdown-btn');
const downloadMarkdownBtn = document.getElementById('download-markdown-btn');
const printPdfBtn = document.getElementById('print-pdf-btn');
const previewBox = document.getElementById('document-preview-box');
const printContainer = document.getElementById('print-document-container');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initTheme();
  setupEventListeners();
  renderDotNavigation();
  updateStepUI();
  updateCharacterCounters();
});

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('brd-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  appState.theme = savedTheme;
}

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('brd-theme', newTheme);
  appState.theme = newTheme;
  showToast(`Switched to ${newTheme} mode`);
});

// Toast Helper
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// State Persistence
function saveState() {
  // Read scalar values from form inputs
  appState.projectTitle = document.getElementById('project-title').value;
  appState.problemStatement = problemTextarea.value;
  appState.businessGoals = goalsTextarea.value;
  appState.targetAudience = document.getElementById('target-audience').value;
  appState.lookFeelDescription = document.getElementById('look-feel-description').value;
  
  // Theme Presets
  const checkedThemeRadio = document.querySelector('input[name="designTheme"]:checked');
  if (checkedThemeRadio) {
    appState.designTheme = checkedThemeRadio.value;
  }

  // Quality standards checkboxes
  const selectedStandards = [];
  document.querySelectorAll('input[name="qualityStandards"]:checked').forEach(checkbox => {
    selectedStandards.push(checkbox.value);
  });
  appState.qualityStandards = selectedStandards;

  appState.projectSummary = summaryTextarea.value;

  localStorage.setItem('brd-builder-state', JSON.stringify(appState));
}

function loadState() {
  const saved = localStorage.getItem('brd-builder-state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      appState = { ...appState, ...parsed };
      
      // Pre-fill fields
      document.getElementById('project-title').value = appState.projectTitle || '';
      problemTextarea.value = appState.problemStatement || '';
      goalsTextarea.value = appState.businessGoals || '';
      document.getElementById('target-audience').value = appState.targetAudience || '';
      document.getElementById('look-feel-description').value = appState.lookFeelDescription || '';
      summaryTextarea.value = appState.projectSummary || '';

      // Design Theme Radio
      const radio = document.querySelector(`input[name="designTheme"][value="${appState.designTheme}"]`);
      if (radio) radio.checked = true;

      // Quality standards Checkboxes
      document.querySelectorAll('input[name="qualityStandards"]').forEach(checkbox => {
        checkbox.checked = appState.qualityStandards.includes(checkbox.value);
      });

      // Redraw Dynamic Lists
      refreshFeaturesList();
      refreshActionsList();
      refreshScreensList();
      refreshMetricsList();
    } catch (e) {
      console.error("Failed to parse state", e);
    }
  }
}

// Reset Form Handler
resetBtn.addEventListener('click', () => {
  if (confirm("Are you sure you want to clear the entire form? All unsaved progress will be permanently lost.")) {
    localStorage.removeItem('brd-builder-state');
    location.reload();
  }
});

// Character Counters
function updateCharacterCounters() {
  problemCharCount.textContent = problemTextarea.value.length;
  goalsCharCount.textContent = goalsTextarea.value.length;
  summaryCharCount.textContent = summaryTextarea.value.length;
}

[problemTextarea, goalsTextarea, summaryTextarea].forEach(textarea => {
  textarea.addEventListener('input', () => {
    updateCharacterCounters();
    saveState();
  });
});

// Event Listeners for Scalar Input Fields
const scalarInputs = ['project-title', 'target-audience', 'look-feel-description'];
scalarInputs.forEach(id => {
  document.getElementById(id).addEventListener('input', saveState);
});

document.querySelectorAll('input[name="designTheme"]').forEach(radio => {
  radio.addEventListener('change', saveState);
});

document.querySelectorAll('input[name="qualityStandards"]').forEach(cb => {
  cb.addEventListener('change', saveState);
});

// Step Navigation Logic
function renderDotNavigation() {
  dotGroup.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `dot-nav-item ${i === appState.currentStep ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Navigate to Step ${i}`);
    dot.addEventListener('click', () => {
      if (validateStepTransition(i)) {
        goToStep(i);
      }
    });
    dotGroup.appendChild(dot);
  }
}

function updateStepUI() {
  // Update panels display
  panels.forEach((panel, idx) => {
    if (idx + 1 === appState.currentStep) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  // Update Stepper circles
  stepNodes.forEach((node, idx) => {
    const stepNum = idx + 1;
    node.className = 'step-node';
    if (stepNum === appState.currentStep) {
      node.classList.add('active');
    } else if (stepNum < appState.currentStep) {
      node.classList.add('completed');
    }
  });

  // Fill Progress Line
  const percentage = ((appState.currentStep - 1) / 4) * 100;
  progressBarFill.style.width = `${percentage}%`;

  // Buttons disabled state
  prevBtn.disabled = appState.currentStep === 1;
  
  if (appState.currentStep === 5) {
    nextBtn.innerHTML = `Finish & Compile <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 5 7 7-7 7"/><path d="M5 12h14"/></svg>`;
  } else {
    nextBtn.innerHTML = `Next Step <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;
  }

  // Update Dot Classes
  const dots = dotGroup.querySelectorAll('.dot-nav-item');
  dots.forEach((dot, idx) => {
    if (idx + 1 === appState.currentStep) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  // If Step 5 (Preview), render markdown compilation
  if (appState.currentStep === 5) {
    updateCompiledOutput();
  }
}

function goToStep(stepNum) {
  appState.currentStep = stepNum;
  updateStepUI();
  saveState();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStepTransition(targetStep) {
  // If moving backwards, always allow it
  if (targetStep < appState.currentStep) return true;

  // Validate incremental progression steps
  for (let s = appState.currentStep; s < targetStep; s++) {
    if (!validateSingleStep(s)) return false;
  }
  return true;
}

function validateSingleStep(stepNum) {
  return true;
  let isValid = true;
  
  if (stepNum === 1) {
    const projTitle = document.getElementById('project-title');
    const problem = problemTextarea;
    const goals = goalsTextarea;

    if (!projTitle.value.trim()) {
      projTitle.reportValidity();
      isValid = false;
    } else if (!problem.value.trim()) {
      problem.reportValidity();
      isValid = false;
    } else if (!goals.value.trim()) {
      goals.reportValidity();
      isValid = false;
    }
  } 
  else if (stepNum === 2) {
    featuresError.style.display = 'none';
    actionsError.style.display = 'none';

    if (appState.features.length === 0) {
      featuresError.style.display = 'block';
      featuresError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      isValid = false;
    } else if (appState.actions.length === 0) {
      actionsError.style.display = 'block';
      actionsError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      isValid = false;
    }
  } 
  else if (stepNum === 3) {
    const narrative = document.getElementById('look-feel-description');
    screensError.style.display = 'none';

    if (!narrative.value.trim()) {
      narrative.reportValidity();
      isValid = false;
    } else if (appState.screens.length === 0) {
      screensError.style.display = 'block';
      screensError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      isValid = false;
    }
  } 
  else if (stepNum === 4) {
    metricsError.style.display = 'none';

    if (appState.metrics.length === 0) {
      metricsError.style.display = 'block';
      metricsError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      isValid = false;
    }
  }

  return isValid;
}

// Navigation Buttons Trigger
prevBtn.addEventListener('click', () => {
  if (appState.currentStep > 1) {
    goToStep(appState.currentStep - 1);
  }
});

nextBtn.addEventListener('click', () => {
  if (appState.currentStep < 5) {
    if (validateSingleStep(appState.currentStep)) {
      goToStep(appState.currentStep + 1);
    }
  } else {
    // Finished step 5
    if (validateSingleStep(5)) {
      showToast("BRD Compilation Completed! Choose an export option below.");
    }
  }
});

// Clickable Stepper Nodes Event
stepNodes.forEach(node => {
  node.addEventListener('click', () => {
    const step = parseInt(node.getAttribute('data-step'));
    if (validateStepTransition(step)) {
      goToStep(step);
    }
  });
});

// LIST BUILDER 1: FEATURES
addFeatureBtn.addEventListener('click', () => {
  const title = featureTitleInput.value.trim();
  const desc = featureDescInput.value.trim();
  const priority = featurePriorityInput.value;

  if (!title) {
    featureTitleInput.focus();
    return;
  }

  const featureItem = {
    id: 'feat_' + Date.now(),
    title,
    desc: desc || 'No description provided.',
    priority
  };

  appState.features.push(featureItem);
  saveState();
  refreshFeaturesList();
  
  // Clear inputs
  featureTitleInput.value = '';
  featureDescInput.value = '';
  featureTitleInput.focus();
  featuresError.style.display = 'none';
  showToast("Feature added successfully!");
});

function refreshFeaturesList() {
  featuresDisplayList.innerHTML = '';
  if (appState.features.length === 0) {
    featuresDisplayList.innerHTML = `
      <div class="empty-state-list">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>
        <span>No features added yet. Add your first feature above!</span>
      </div>`;
    return;
  }

  appState.features.forEach(item => {
    const priorityClass = item.priority.toLowerCase().replace(' ', '-');
    const card = document.createElement('div');
    card.className = 'builder-item-card';
    card.innerHTML = `
      <div class="item-content-left">
        <div class="item-badge-row">
          <span class="item-title">${escapeHTML(item.title)}</span>
          <span class="priority-tag ${priorityClass}">${item.priority}</span>
        </div>
        <div class="item-desc">${escapeHTML(item.desc)}</div>
      </div>
      <button type="button" class="btn-remove" data-id="${item.id}" aria-label="Remove feature">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;
    
    card.querySelector('.btn-remove').addEventListener('click', () => {
      appState.features = appState.features.filter(f => f.id !== item.id);
      saveState();
      refreshFeaturesList();
    });

    featuresDisplayList.appendChild(card);
  });
}

// LIST BUILDER 2: USER ACTIONS
addActionBtn.addEventListener('click', () => {
  const actor = actionActorInput.value.trim();
  const behavior = actionBehaviorInput.value.trim();

  if (!actor) {
    actionActorInput.focus();
    return;
  }
  if (!behavior) {
    actionBehaviorInput.focus();
    return;
  }

  const actionItem = {
    id: 'act_' + Date.now(),
    actor,
    behavior
  };

  appState.actions.push(actionItem);
  saveState();
  refreshActionsList();

  actionActorInput.value = '';
  actionBehaviorInput.value = '';
  actionActorInput.focus();
  actionsError.style.display = 'none';
  showToast("User action added!");
});

function refreshActionsList() {
  actionsDisplayList.innerHTML = '';
  if (appState.actions.length === 0) {
    actionsDisplayList.innerHTML = `
      <div class="empty-state-list">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <span>No user actions added yet. Describe an action above!</span>
      </div>`;
    return;
  }

  appState.actions.forEach(item => {
    const card = document.createElement('div');
    card.className = 'builder-item-card';
    card.innerHTML = `
      <div class="item-content-left">
        <div class="item-badge-row">
          <span class="item-actor">As a ${escapeHTML(item.actor)}</span>
          <span class="item-title">I can...</span>
        </div>
        <div class="item-desc">${escapeHTML(item.behavior)}</div>
      </div>
      <button type="button" class="btn-remove" data-id="${item.id}" aria-label="Remove action">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    card.querySelector('.btn-remove').addEventListener('click', () => {
      appState.actions = appState.actions.filter(a => a.id !== item.id);
      saveState();
      refreshActionsList();
    });

    actionsDisplayList.appendChild(card);
  });
}

// LIST BUILDER 3: SCREENS
addScreenBtn.addEventListener('click', () => {
  const name = screenNameInput.value.trim();
  const desc = screenDescInput.value.trim();

  if (!name) {
    screenNameInput.focus();
    return;
  }

  const screenItem = {
    id: 'scr_' + Date.now(),
    name,
    desc: desc || 'Visual rendering of system controls and details.'
  };

  appState.screens.push(screenItem);
  saveState();
  refreshScreensList();

  screenNameInput.value = '';
  screenDescInput.value = '';
  screenNameInput.focus();
  screensError.style.display = 'none';
  showToast("Screen design layout added!");
});

function refreshScreensList() {
  screensDisplayList.innerHTML = '';
  if (appState.screens.length === 0) {
    screensDisplayList.innerHTML = `
      <div class="empty-state-list">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        <span>No screen layouts added yet. Define a key screen above!</span>
      </div>`;
    return;
  }

  appState.screens.forEach(item => {
    const card = document.createElement('div');
    card.className = 'builder-item-card';
    card.innerHTML = `
      <div class="item-content-left">
        <div class="item-title">${escapeHTML(item.name)}</div>
        <div class="item-desc">${escapeHTML(item.desc)}</div>
      </div>
      <button type="button" class="btn-remove" data-id="${item.id}" aria-label="Remove screen">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    card.querySelector('.btn-remove').addEventListener('click', () => {
      appState.screens = appState.screens.filter(s => s.id !== item.id);
      saveState();
      refreshScreensList();
    });

    screensDisplayList.appendChild(card);
  });
}

// LIST BUILDER 4: SUCCESS METRICS
addMetricBtn.addEventListener('click', () => {
  const name = metricNameInput.value.trim();
  const target = metricTargetInput.value.trim();

  if (!name) {
    metricNameInput.focus();
    return;
  }
  if (!target) {
    metricTargetInput.focus();
    return;
  }

  const metricItem = {
    id: 'met_' + Date.now(),
    name,
    target
  };

  appState.metrics.push(metricItem);
  saveState();
  refreshMetricsList();

  metricNameInput.value = '';
  metricTargetInput.value = '';
  metricNameInput.focus();
  metricsError.style.display = 'none';
  showToast("Success KPI added!");
});

function refreshMetricsList() {
  metricsDisplayList.innerHTML = '';
  if (appState.metrics.length === 0) {
    metricsDisplayList.innerHTML = `
      <div class="empty-state-list">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        <span>No success metrics added yet. Define a metric above!</span>
      </div>`;
    return;
  }

  appState.metrics.forEach(item => {
    const card = document.createElement('div');
    card.className = 'builder-item-card';
    card.innerHTML = `
      <div class="item-content-left">
        <div class="item-badge-row">
          <span class="item-title">${escapeHTML(item.name)}</span>
          <span class="metric-target-text">Target: ${escapeHTML(item.target)}</span>
        </div>
      </div>
      <button type="button" class="btn-remove" data-id="${item.id}" aria-label="Remove metric">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    card.querySelector('.btn-remove').addEventListener('click', () => {
      appState.metrics = appState.metrics.filter(m => m.id !== item.id);
      saveState();
      refreshMetricsList();
    });

    metricsDisplayList.appendChild(card);
  });
}

// Markdown and HTML Compilation Engine
function compileMarkdown() {
  const timestamp = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  let md = `# Business Requirements Document (BRD)\n`;
  md += `**Project Name:** ${appState.projectTitle || 'Unnamed Project'}\n`;
  md += `**Date Created:** ${timestamp}\n\n`;

  md += `## 1. Project Summary\n`;
  md += `${appState.projectSummary || 'No summary specified.'}\n\n`;

  md += `## 2. Business Requirements\n`;
  md += `### 2.1 Problem Statement\n`;
  md += `${appState.problemStatement || 'No problem statement specified.'}\n\n`;
  md += `### 2.2 Goals & Objectives\n`;
  md += `${appState.businessGoals || 'No business goals specified.'}\n\n`;
  if (appState.targetAudience) {
    md += `### 2.3 Target Audience\n`;
    md += `${appState.targetAudience}\n\n`;
  }

  md += `## 3. Functional Requirements\n`;
  md += `### 3.1 System Features\n`;
  if (appState.features.length > 0) {
    md += `| Feature Name | Description | Priority |\n`;
    md += `| :--- | :--- | :--- |\n`;
    appState.features.forEach(f => {
      md += `| **${f.title}** | ${f.desc} | *${f.priority}* |\n`;
    });
  } else {
    md += `No key system features added.\n`;
  }
  md += `\n`;

  md += `### 3.2 User Actions & Scenarios\n`;
  if (appState.actions.length > 0) {
    appState.actions.forEach(a => {
      md += `- **As a** ${a.actor}, **I can** ${a.behavior}.\n`;
    });
  } else {
    md += `No user actions specified.\n`;
  }
  md += `\n`;

  md += `## 4. Design & Visual Requirements\n`;
  md += `**Core Theme Preset:** ${appState.designTheme}\n\n`;
  md += `### 4.1 Look and Feel Narrative\n`;
  md += `${appState.lookFeelDescription || 'No description specified.'}\n\n`;
  md += `### 4.2 Key Screens & Interface Views\n`;
  if (appState.screens.length > 0) {
    md += `| Screen Name | Layout / Content Description |\n`;
    md += `| :--- | :--- |\n`;
    appState.screens.forEach(s => {
      md += `| **${s.name}** | ${s.desc} |\n`;
    });
  } else {
    md += `No page design details outlined.\n`;
  }
  md += `\n`;

  md += `## 5. Success Criteria & Quality Standards\n`;
  md += `### 5.1 Success Metrics (KPIs)\n`;
  if (appState.metrics.length > 0) {
    md += `| Performance Indicator | Success Target Standard |\n`;
    md += `| :--- | :--- |\n`;
    appState.metrics.forEach(m => {
      md += `| **${m.name}** | ${m.target} |\n`;
    });
  } else {
    md += `No specific performance indicators added.\n`;
  }
  md += `\n`;

  md += `### 5.2 Quality Standards & Definition of Done\n`;
  if (appState.qualityStandards.length > 0) {
    appState.qualityStandards.forEach(q => {
      md += `- [x] **${q}** compliance achieved.\n`;
    });
  } else {
    md += `No technical standards checklist selected.\n`;
  }
  md += `\n`;

  return md;
}

function updateCompiledOutput() {
  const markdown = compileMarkdown();
  
  // Convert markdown structure to visual HTML preview elements
  const timestamp = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  let html = `<div class="doc-title">${escapeHTML(appState.projectTitle || 'Unnamed Project')}</div>`;
  html += `<div class="doc-meta"><span><strong>Document:</strong> Business Requirements (BRD)</span><span><strong>Created:</strong> ${timestamp}</span></div>`;

  html += `<div class="doc-section-title">1. Project Summary</div>`;
  html += `<div class="doc-text">${escapeParagraphs(appState.projectSummary || 'No summary specified.')}</div>`;

  html += `<div class="doc-section-title">2. Business Requirements</div>`;
  html += `<div class="doc-text"><strong>2.1 Problem Statement</strong></div>`;
  html += `<div class="doc-text">${escapeParagraphs(appState.problemStatement || 'No problem statement specified.')}</div>`;
  html += `<div class="doc-text"><strong>2.2 Goals & Objectives</strong></div>`;
  html += `<div class="doc-text">${escapeParagraphs(appState.businessGoals || 'No business goals specified.')}</div>`;
  
  if (appState.targetAudience) {
    html += `<div class="doc-text"><strong>2.3 Target Audience</strong></div>`;
    html += `<div class="doc-text">${escapeHTML(appState.targetAudience)}</div>`;
  }

  html += `<div class="doc-section-title">3. Functional Requirements</div>`;
  html += `<div class="doc-text"><strong>3.1 System Features</strong></div>`;
  
  if (appState.features.length > 0) {
    html += `<table class="doc-table"><thead><tr><th>Feature Name</th><th>Description</th><th>Priority</th></tr></thead><tbody>`;
    appState.features.forEach(f => {
      html += `<tr><td><strong>${escapeHTML(f.title)}</strong></td><td>${escapeHTML(f.desc)}</td><td><em>${escapeHTML(f.priority)}</em></td></tr>`;
    });
    html += `</tbody></table>`;
  } else {
    html += `<div class="doc-text">No key system features defined.</div>`;
  }

  html += `<div class="doc-text"><strong>3.2 User Actions & Scenarios</strong></div>`;
  if (appState.actions.length > 0) {
    html += `<ul class="doc-bullet-list">`;
    appState.actions.forEach(a => {
      html += `<li><strong>As a</strong> ${escapeHTML(a.actor)}, <strong>I can</strong> ${escapeHTML(a.behavior)}.</li>`;
    });
    html += `</ul>`;
  } else {
    html += `<div class="doc-text">No user actions defined.</div>`;
  }

  html += `<div class="doc-section-title">4. Design & Visual Requirements</div>`;
  html += `<div class="doc-text"><strong>Aesthetic Theme Vibe:</strong> ${escapeHTML(appState.designTheme)}</div>`;
  html += `<div class="doc-text"><strong>4.1 Look and Feel Narrative</strong></div>`;
  html += `<div class="doc-text">${escapeParagraphs(appState.lookFeelDescription || 'No description specified.')}</div>`;

  html += `<div class="doc-text"><strong>4.2 Key Screens & Interface Views</strong></div>`;
  if (appState.screens.length > 0) {
    html += `<table class="doc-table"><thead><tr><th>Screen Name</th><th>Layout / Description</th></tr></thead><tbody>`;
    appState.screens.forEach(s => {
      html += `<tr><td><strong>${escapeHTML(s.name)}</strong></td><td>${escapeHTML(s.desc)}</td></tr>`;
    });
    html += `</tbody></table>`;
  } else {
    html += `<div class="doc-text">No page designs defined.</div>`;
  }

  html += `<div class="doc-section-title">5. Success Criteria & Quality Standards</div>`;
  html += `<div class="doc-text"><strong>5.1 Success Metrics (KPIs)</strong></div>`;
  if (appState.metrics.length > 0) {
    html += `<table class="doc-table"><thead><tr><th>Performance Indicator</th><th>Success Target Standard</th></tr></thead><tbody>`;
    appState.metrics.forEach(m => {
      html += `<tr><td><strong>${escapeHTML(m.name)}</strong></td><td>${escapeHTML(m.target)}</td></tr>`;
    });
    html += `</tbody></table>`;
  } else {
    html += `<div class="doc-text">No success metrics defined.</div>`;
  }

  html += `<div class="doc-text"><strong>5.2 Quality Standards Checklist</strong></div>`;
  if (appState.qualityStandards.length > 0) {
    html += `<ul class="doc-bullet-list">`;
    appState.qualityStandards.forEach(q => {
      html += `<li>[✓] <strong>${escapeHTML(q)}</strong> compliance achieved.</li>`;
    });
    html += `</ul>`;
  } else {
    html += `<div class="doc-text">No technical standards checkboxes marked.</div>`;
  }

  previewBox.innerHTML = html;
  
  // Populates print document view container as well
  printContainer.innerHTML = html;
}

// Copy Markdown Action
copyMarkdownBtn.addEventListener('click', () => {
  const mdContent = compileMarkdown();
  navigator.clipboard.writeText(mdContent).then(() => {
    showToast("Markdown text copied to clipboard!");
  }).catch(err => {
    console.error('Failed to copy', err);
    showToast("Failed to copy automatically.");
  });
});

// Download MD Action
downloadMarkdownBtn.addEventListener('click', () => {
  const mdContent = compileMarkdown();
  const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
  
  // Format filename cleanly
  const titleSlug = (appState.projectTitle || 'business-requirements')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const filename = `${titleSlug}-brd.md`;

  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Markdown download triggered!");
  }
});

// Print/PDF Action
printPdfBtn.addEventListener('click', () => {
  window.print();
});

// Helper Escapes
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeParagraphs(str) {
  return escapeHTML(str)
    .split('\n')
    .filter(p => p.trim() !== '')
    .map(p => `<p>${p}</p>`)
    .join('');
}

// Setup Event Listeners for Validation and Transitions
function setupEventListeners() {
  // Prevent form submission on enter keys globally except inside textareas
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
    }
  });
}
