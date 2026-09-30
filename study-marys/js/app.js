// Aplicação Principal - MaryStudy Hub
document.addEventListener("DOMContentLoaded", () => {
  // 1. Estado e Carregamento do LocalStorage
  const STORAGE_KEY = "MARIA_RODRIGUES_STUDY_STATE_V3";
  let state = loadState();

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.profile.name = "Maria Rodrigues";
        parsed.profile.heroImage = "assets/images/maria-rodrigues.jpg";
        parsed.profile.avatar = "assets/images/avatar-maria.jpg";
        return parsed;
      }
    } catch (e) {
      console.error("Erro ao carregar estado:", e);
    }
    const def = JSON.parse(JSON.stringify(DEFAULT_STUDY_DATA));
    def.profile.name = "Maria Rodrigues";
    def.profile.heroImage = "assets/images/maria-rodrigues.jpg";
    def.profile.avatar = "assets/images/avatar-maria.jpg";
    return def;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Erro ao salvar estado:", e);
    }
  }

  // 2. Elementos DOM
  const elements = {
    // Header & Nav
    navToggle: document.getElementById("navToggle"),
    navMenu: document.getElementById("navMenu"),
    navDrawer: document.getElementById("navDrawer"),
    navDrawerOverlay: document.getElementById("navDrawerOverlay"),
    btnCloseDrawer: document.getElementById("btnCloseDrawer"),
    themeToggleBtn: document.getElementById("themeToggleBtn"),
    ambientToggleBtn: document.getElementById("ambientToggleBtn"),
    ambientPanel: document.getElementById("ambientPanel"),
    ambientPreset: document.getElementById("ambientPreset"),
    ambientVolume: document.getElementById("ambientVolume"),
    
    // Hero Stats
    statStudyHours: document.getElementById("statStudyHours"),
    statActiveSubjects: document.getElementById("statActiveSubjects"),
    statStreakDays: document.getElementById("statStreakDays"),
    statCompletionRate: document.getElementById("statCompletionRate"),
    statPomodoros: document.getElementById("statPomodoros"),

    // Áreas de Estudo
    areasContainer: document.getElementById("areasContainer"),
    areaFilterBtns: document.querySelectorAll(".area-filter-btn"),
    subjectsGrid: document.getElementById("subjectsGrid"),
    subjectSearchInput: document.getElementById("subjectSearchInput"),
    
    // Certificações & Metas
    certificationsList: document.getElementById("certificationsList"),

    // Projetos
    projectsGrid: document.getElementById("projectsGrid"),

    // Pomodoro
    pomodoroTimeDisplay: document.getElementById("pomodoroTimeDisplay"),
    pomodoroModeTitle: document.getElementById("pomodoroModeTitle"),
    pomodoroSubjectSelect: document.getElementById("pomodoroSubjectSelect"),
    pomodoroToggleBtn: document.getElementById("pomodoroToggleBtn"),
    pomodoroResetBtn: document.getElementById("pomodoroResetBtn"),
    pomodoroModeBtns: document.querySelectorAll(".pomo-tab-btn"),
    pomodoroProgressCircle: document.getElementById("pomodoroProgressCircle"),

    // Flashcards
    flashcardContainer: document.getElementById("flashcardContainer"),
    flashcardQuestion: document.getElementById("flashcardQuestion"),
    flashcardAnswer: document.getElementById("flashcardAnswer"),
    flashcardAreaTag: document.getElementById("flashcardAreaTag"),
    flashcardIndex: document.getElementById("flashcardIndex"),
    flashcardPrevBtn: document.getElementById("flashcardPrevBtn"),
    flashcardNextBtn: document.getElementById("flashcardNextBtn"),
    flashcardFlipBtn: document.getElementById("flashcardFlipBtn"),
    flashcardFilterSelect: document.getElementById("flashcardFilterSelect"),
    btnKnownFlashcard: document.getElementById("btnKnownFlashcard"),
    btnReviewFlashcard: document.getElementById("btnReviewFlashcard"),

    // Kanban / Tarefas
    todoColumn: document.getElementById("tasksTodo"),
    inProgressColumn: document.getElementById("tasksInProgress"),
    doneColumn: document.getElementById("tasksDone"),
    btnOpenTaskModal: document.getElementById("btnOpenTaskModal"),
    taskModal: document.getElementById("taskModal"),
    taskForm: document.getElementById("taskForm"),
    btnCloseTaskModal: document.getElementById("btnCloseTaskModal"),

    // Modais adicionais
    btnAddSubjectModal: document.getElementById("btnAddSubjectModal"),
    subjectModal: document.getElementById("subjectModal"),
    subjectForm: document.getElementById("subjectForm"),
    btnCloseSubjectModal: document.getElementById("btnCloseSubjectModal"),

    btnAddFlashcardModal: document.getElementById("btnAddFlashcardModal"),
    flashcardModal: document.getElementById("flashcardModal"),
    flashcardForm: document.getElementById("flashcardForm"),
    btnCloseFlashcardModal: document.getElementById("btnCloseFlashcardModal"),

    // Toasts
    toastContainer: document.getElementById("toastContainer")
  };

  // Instâncias dos Módulos
  const ambientSound = new AmbientSoundGenerator();
  let currentCardIndex = 0;
  let filteredCards = [...state.flashcards];

  // 3. Inicializar Pomodoro Timer
  const circleRadius = 110;
  const circleCircumference = 2 * Math.PI * circleRadius;
  if (elements.pomodoroProgressCircle) {
    elements.pomodoroProgressCircle.style.strokeDasharray = `${circleCircumference} ${circleCircumference}`;
    elements.pomodoroProgressCircle.style.strokeDashoffset = "0";
  }

  const pomodoro = new PomodoroTimer({
    onTick: (formattedTime, percent) => {
      if (elements.pomodoroTimeDisplay) {
        elements.pomodoroTimeDisplay.textContent = formattedTime;
      }
      if (elements.pomodoroProgressCircle) {
        const offset = circleCircumference - (percent / 100) * circleCircumference;
        elements.pomodoroProgressCircle.style.strokeDashoffset = offset;
      }
      document.title = `(${formattedTime}) ${pomodoro.modes[pomodoro.currentMode].name} | MaryStudy`;
    },
    onComplete: (sessionData) => {
      state.profile.stats.pomodorosCompleted += 1;
      // Adicionar ~25min (0.4h) às horas de estudo
      state.profile.stats.studyHours = Math.round((state.profile.stats.studyHours + (sessionData.minutes / 60)) * 10) / 10;
      saveState();
      renderStats();
      triggerConfetti();
      showToast(`🎉 Parabéns! Sessão de ${sessionData.minutes}min concluída com sucesso!`, "success");
      updatePomodoroPlayButton(false);
    },
    onModeChange: (modeKey, modeData) => {
      if (elements.pomodoroModeTitle) {
        elements.pomodoroModeTitle.textContent = modeData.name;
      }
      elements.pomodoroModeBtns.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.mode === modeKey);
      });
      if (elements.pomodoroProgressCircle) {
        elements.pomodoroProgressCircle.style.strokeDashoffset = "0";
      }
      updatePomodoroPlayButton(false);
    }
  });

  function updatePomodoroPlayButton(isRunning) {
    if (!elements.pomodoroToggleBtn) return;
    if (isRunning) {
      elements.pomodoroToggleBtn.innerHTML = `<i class="fa-solid fa-pause"></i> Pausar`;
      elements.pomodoroToggleBtn.classList.add("btn-warning");
      elements.pomodoroToggleBtn.classList.remove("btn-primary");
    } else {
      elements.pomodoroToggleBtn.innerHTML = `<i class="fa-solid fa-play"></i> Iniciar Foco`;
      elements.pomodoroToggleBtn.classList.remove("btn-warning");
      elements.pomodoroToggleBtn.classList.add("btn-primary");
    }
  }

  // 4. Renderizações
  function renderStats() {
    const s = state.profile.stats;
    if (elements.statStudyHours) elements.statStudyHours.textContent = `${s.studyHours}h`;
    if (elements.statActiveSubjects) elements.statActiveSubjects.textContent = state.subjects.length;
    if (elements.statStreakDays) elements.statStreakDays.textContent = `${s.streakDays}d`;
    if (elements.statCompletionRate) elements.statCompletionRate.textContent = `${s.completionRate}%`;
    if (elements.statPomodoros) elements.statPomodoros.textContent = s.pomodorosCompleted;

    const drawerStreak = document.getElementById("drawerStreakVal");
    const drawerHours = document.getElementById("drawerHoursVal");
    const drawerPomo = document.getElementById("drawerPomoVal");
    if (drawerStreak) drawerStreak.textContent = `${s.streakDays}d`;
    if (drawerHours) drawerHours.textContent = `${s.studyHours}h`;
    if (drawerPomo) drawerPomo.textContent = s.pomodorosCompleted;
  }

  function renderAreas() {
    if (!elements.areasContainer) return;
    elements.areasContainer.innerHTML = state.areas.map(area => {
      const areaSubjects = state.subjects.filter(s => s.area === area.id);
      const avgProgress = areaSubjects.length 
        ? Math.round(areaSubjects.reduce((acc, cur) => acc + cur.progress, 0) / areaSubjects.length)
        : area.progress;

      return `
        <div class="area-card glass-panel" data-area="${area.id}">
          <div class="area-card-header">
            <div class="area-icon-pill" style="--accent-color: ${area.color};">
              <i class="fa-solid ${area.icon}"></i>
            </div>
            <span class="area-badge" style="color: ${area.color}; border-color: ${area.color}40; background: ${area.color}15;">
              ${area.badge}
            </span>
          </div>
          <h3 class="area-title">${area.name}</h3>
          <p class="area-desc">${area.desc}</p>
          
          <div class="area-progress-wrapper">
            <div class="area-progress-meta">
              <span>Progresso geral</span>
              <strong style="color: ${area.color};">${avgProgress}%</strong>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${avgProgress}%; background: linear-gradient(90deg, ${area.color}, #c084fc);"></div>
            </div>
          </div>

          <div class="area-card-footer">
            <span class="subjects-count"><i class="fa-solid fa-layer-group"></i> ${areaSubjects.length} disciplinas</span>
            <button class="btn-text-glow view-area-btn" data-area-id="${area.id}">Explorar <i class="fa-solid fa-arrow-right"></i></button>
          </div>
        </div>
      `;
    }).join("");

    // Adicionar eventos aos botões de explorar
    document.querySelectorAll(".view-area-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const areaId = btn.dataset.areaId;
        filterSubjectsByArea(areaId);
        const section = document.getElementById("disciplinas");
        if (section) section.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  function renderSubjects(selectedArea = "all", searchQuery = "") {
    if (!elements.subjectsGrid) return;
    
    let list = state.subjects;
    if (selectedArea !== "all") {
      list = list.filter(s => s.area === selectedArea);
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.nextTask.toLowerCase().includes(q));
    }

    if (list.length === 0) {
      elements.subjectsGrid.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-magnifying-glass"></i>
          <p>Nenhuma disciplina encontrada para esta categoria ou busca.</p>
        </div>
      `;
      return;
    }

    elements.subjectsGrid.innerHTML = list.map(sub => {
      const areaObj = state.areas.find(a => a.id === sub.area) || { color: "#8b5cf6", name: "Estudo" };
      return `
        <div class="subject-card glass-panel" data-id="${sub.id}">
          <div class="subject-card-top">
            <div class="subject-icon-box" style="background: ${sub.color || areaObj.color}20; color: ${sub.color || areaObj.color};">
              <i class="fa-solid ${sub.icon || 'fa-book'}"></i>
            </div>
            <span class="subject-level-badge">${sub.level}</span>
          </div>
          
          <h4 class="subject-name">${sub.name}</h4>
          
          <div class="subject-meta-row">
            <span><i class="fa-regular fa-clock"></i> ${sub.hours}h acumuladas</span>
            <span class="subject-progress-pct" style="color: ${sub.color || areaObj.color};">${sub.progress}%</span>
          </div>

          <div class="progress-bar-bg small">
            <div class="progress-bar-fill" style="width: ${sub.progress}%; background: ${sub.color || areaObj.color};"></div>
          </div>

          <div class="subject-next-action">
            <span class="next-label">Próxima meta:</span>
            <p class="next-task-text"><i class="fa-solid fa-bullseye"></i> ${sub.nextTask}</p>
          </div>

          <div class="subject-card-actions">
            <button class="btn-card-action study-now-btn" data-name="${sub.name}" title="Iniciar Pomodoro para esta matéria">
              <i class="fa-solid fa-play"></i> Focar
            </button>
            <button class="btn-card-action btn-adjust-progress" data-id="${sub.id}" title="Atualizar Progresso">
              <i class="fa-solid fa-sliders"></i> + Progresso
            </button>
          </div>
        </div>
      `;
    }).join("");

    // Adicionar eventos para iniciar foco direto da matéria
    elements.subjectsGrid.querySelectorAll(".study-now-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const subName = btn.dataset.name;
        if (elements.pomodoroSubjectSelect) {
          elements.pomodoroSubjectSelect.value = subName;
          pomodoro.selectedSubject = subName;
        }
        const pomodoroSection = document.getElementById("pomodoro");
        if (pomodoroSection) {
          pomodoroSection.scrollIntoView({ behavior: "smooth" });
          showToast(`Sessão de foco direcionada para: ${subName}`, "info");
        }
      });
    });

    // Ajustar progresso rápido
    elements.subjectsGrid.querySelectorAll(".btn-adjust-progress").forEach(btn => {
      btn.addEventListener("click", () => {
        const subId = btn.dataset.id;
        const target = state.subjects.find(s => s.id === subId);
        if (target) {
          target.progress = Math.min(100, target.progress + 5);
          target.hours += 1;
          saveState();
          renderSubjects(getActiveAreaFilter(), elements.subjectSearchInput ? elements.subjectSearchInput.value : "");
          renderAreas();
          showToast(`Progresso de "${target.name}" atualizado para ${target.progress}%!`, "success");
        }
      });
    });
  }

  function getActiveAreaFilter() {
    const activeBtn = document.querySelector(".area-filter-btn.active");
    return activeBtn ? activeBtn.dataset.filter : "all";
  }

  function filterSubjectsByArea(areaId) {
    elements.areaFilterBtns.forEach(b => {
      b.classList.toggle("active", b.dataset.filter === areaId);
    });
    renderSubjects(areaId, elements.subjectSearchInput ? elements.subjectSearchInput.value : "");
  }

  function populateSubjectSelect() {
    if (!elements.pomodoroSubjectSelect) return;
    elements.pomodoroSubjectSelect.innerHTML = `
      <option value="Geral">Foco Geral / Revisão</option>
      ${state.subjects.map(s => `<option value="${s.name}">${s.name} (${s.area})</option>`).join("")}
    `;
  }

  function renderCertifications() {
    if (!elements.certificationsList) return;
    elements.certificationsList.innerHTML = state.certifications.map(cert => `
      <div class="cert-item glass-panel">
        <div class="cert-icon-circle" style="background: ${cert.color}20; color: ${cert.color}; border: 1px solid ${cert.color}40;">
          <i class="fa-solid ${cert.icon}"></i>
        </div>
        <div class="cert-info">
          <div class="cert-header-line">
            <h4 class="cert-title">${cert.title}</h4>
            <span class="cert-verified-pill"><i class="fa-solid fa-circle-check"></i> ${cert.status}</span>
          </div>
          <p class="cert-issuer">${cert.issuer}</p>
          <div class="cert-date"><i class="fa-regular fa-calendar"></i> ${cert.date} · <span class="cert-tag">${cert.area}</span></div>
        </div>
      </div>
    `).join("");
  }

  function renderProjects() {
    if (!elements.projectsGrid) return;
    elements.projectsGrid.innerHTML = state.projects.map(proj => `
      <div class="project-card glass-panel">
        <div class="project-card-header">
          <div class="project-icon-box" style="background: ${proj.color}20; color: ${proj.color};">
            <i class="fa-solid ${proj.icon}"></i>
          </div>
          <span class="project-status-pill" style="color: ${proj.color}; border-color: ${proj.color}40; background: ${proj.color}15;">
            ${proj.status}
          </span>
        </div>
        
        <h4 class="project-title">${proj.title}</h4>
        <span class="project-cat">${proj.category}</span>
        <p class="project-desc">${proj.desc}</p>
        
        <div class="project-tags">
          ${proj.tags.map(t => `<span class="proj-tag">#${t}</span>`).join("")}
        </div>

        <div class="project-progress-box">
          <div class="proj-progress-meta">
            <span>Conclusão</span>
            <strong>${proj.progress}%</strong>
          </div>
          <div class="progress-bar-bg small">
            <div class="progress-bar-fill" style="width: ${proj.progress}%; background: ${proj.color};"></div>
          </div>
        </div>
      </div>
    `).join("");
  }

  // 5. Flashcards
  function updateFlashcardDisplay() {
    if (filteredCards.length === 0) {
      if (elements.flashcardQuestion) elements.flashcardQuestion.textContent = "Nenhum flashcard nesta categoria.";
      if (elements.flashcardAnswer) elements.flashcardAnswer.textContent = "Clique em 'Criar Flashcard' para adicionar novos cartões.";
      if (elements.flashcardIndex) elements.flashcardIndex.textContent = "0 / 0";
      return;
    }

    if (currentCardIndex >= filteredCards.length) currentCardIndex = 0;
    if (currentCardIndex < 0) currentCardIndex = filteredCards.length - 1;

    const card = filteredCards[currentCardIndex];
    if (elements.flashcardQuestion) elements.flashcardQuestion.textContent = card.question;
    if (elements.flashcardAnswer) elements.flashcardAnswer.textContent = card.answer;
    if (elements.flashcardAreaTag) {
      elements.flashcardAreaTag.textContent = `${card.area.toUpperCase()} · ${card.tags.join(", ")}`;
    }
    if (elements.flashcardIndex) {
      elements.flashcardIndex.textContent = `${currentCardIndex + 1} / ${filteredCards.length}`;
    }

    // Resetar rotação
    if (elements.flashcardContainer) {
      elements.flashcardContainer.classList.remove("is-flipped");
    }
  }

  function filterFlashcards(area) {
    if (area === "all") {
      filteredCards = [...state.flashcards];
    } else {
      filteredCards = state.flashcards.filter(c => c.area === area);
    }
    currentCardIndex = 0;
    updateFlashcardDisplay();
  }

  // 6. Kanban / Ciclo de Tarefas
  function renderTasks() {
    if (!elements.todoColumn || !elements.inProgressColumn || !elements.doneColumn) return;

    elements.todoColumn.innerHTML = "";
    elements.inProgressColumn.innerHTML = "";
    elements.doneColumn.innerHTML = "";

    state.tasks.forEach(task => {
      const areaObj = state.areas.find(a => a.id === task.area) || { name: "Geral", color: "#8b5cf6" };
      const cardEl = document.createElement("div");
      cardEl.className = `task-card priority-${task.priority}`;
      cardEl.draggable = true;
      cardEl.dataset.taskId = task.id;

      cardEl.innerHTML = `
        <div class="task-card-top">
          <span class="task-area-pill" style="color: ${areaObj.color}; border: 1px solid ${areaObj.color}40; background: ${areaObj.color}15;">
            ${areaObj.name}
          </span>
          <span class="task-priority-tag ${task.priority}">${task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}</span>
        </div>
        <p class="task-card-title">${task.title}</p>
        <div class="task-card-footer">
          <span class="task-date"><i class="fa-regular fa-clock"></i> ${task.date}</span>
          <div class="task-actions">
            ${task.status !== 'todo' ? `<button class="btn-task-move" data-move="todo" title="Mover para A Fazer"><i class="fa-solid fa-arrow-left"></i></button>` : ''}
            ${task.status !== 'in-progress' ? `<button class="btn-task-move" data-move="in-progress" title="Mover para Em Andamento"><i class="fa-solid fa-play"></i></button>` : ''}
            ${task.status !== 'done' ? `<button class="btn-task-move" data-move="done" title="Concluir Tarefa"><i class="fa-solid fa-check"></i></button>` : ''}
            <button class="btn-task-delete" data-id="${task.id}" title="Excluir"><i class="fa-regular fa-trash-can"></i></button>
          </div>
        </div>
      `;

      // Eventos de mover tarefa
      cardEl.querySelectorAll(".btn-task-move").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const targetStatus = btn.dataset.move;
          task.status = targetStatus;
          if (targetStatus === 'done') {
            triggerConfetti();
            showToast(`🎉 Tarefa "${task.title}" concluída com êxito!`, "success");
          }
          saveState();
          renderTasks();
        });
      });

      // Evento de excluir
      cardEl.querySelector(".btn-task-delete").addEventListener("click", (e) => {
        e.stopPropagation();
        state.tasks = state.tasks.filter(t => t.id !== task.id);
        saveState();
        renderTasks();
        showToast("Tarefa removida.", "info");
      });

      // Adicionar à coluna correta
      if (task.status === "todo") {
        elements.todoColumn.appendChild(cardEl);
      } else if (task.status === "in-progress") {
        elements.inProgressColumn.appendChild(cardEl);
      } else if (task.status === "done") {
        elements.doneColumn.appendChild(cardEl);
      }
    });

    // Contadores
    document.getElementById("countTodo").textContent = state.tasks.filter(t => t.status === "todo").length;
    document.getElementById("countInProgress").textContent = state.tasks.filter(t => t.status === "in-progress").length;
    document.getElementById("countDone").textContent = state.tasks.filter(t => t.status === "done").length;
  }

  // 7. Toasts e Notificações
  function showToast(message, type = "info") {
    if (!elements.toastContainer) return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    const icon = type === "success" ? "fa-circle-check" : type === "warning" ? "fa-triangle-exclamation" : "fa-bell";
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    
    elements.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // Efeito Confete Simples em Canvas Dinâmico
  function triggerConfetti() {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ["#8b5cf6", "#3b82f6", "#06b6d4", "#ec4899", "#fbbf24", "#10b981"];

    for (let i = 0; i < 90; i++) {
      pieces.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.8) * 14,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 12,
        opacity: 1
      });
    }

    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravidade
        p.rotation += p.vr;
        p.opacity -= 0.012;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      frame++;
      if (frame < 90) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    }
    animate();
  }

  // 8. Event Listeners & Menu Responsivo
  function openDrawer() {
    if (elements.navDrawer) elements.navDrawer.classList.add("open");
    if (elements.navDrawerOverlay) elements.navDrawerOverlay.classList.add("open");
    if (elements.navToggle) elements.navToggle.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (elements.navDrawer) elements.navDrawer.classList.remove("open");
    if (elements.navDrawerOverlay) elements.navDrawerOverlay.classList.remove("open");
    if (elements.navToggle) elements.navToggle.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (elements.navToggle) {
    elements.navToggle.addEventListener("click", () => {
      if (elements.navDrawer && elements.navDrawer.classList.contains("open")) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (elements.btnCloseDrawer) {
    elements.btnCloseDrawer.addEventListener("click", closeDrawer);
  }

  if (elements.navDrawerOverlay) {
    elements.navDrawerOverlay.addEventListener("click", closeDrawer);
  }

  // Fechar drawer com tecla ESC
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDrawer();
      if (elements.ambientPanel) elements.ambientPanel.classList.remove("open");
    }
  });

  // Fechar gaveta ao clicar em qualquer link da gaveta
  document.querySelectorAll(".drawer-nav-link, .nav-link").forEach(link => {
    link.addEventListener("click", () => {
      closeDrawer();
    });
  });

  // ScrollSpy para destacar item ativo na navegação
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll(`.nav-link[href*="${sectionId}"], .drawer-nav-link[href*="${sectionId}"]`).forEach(el => {
          el.classList.add("active");
        });
      } else {
        document.querySelectorAll(`.nav-link[href*="${sectionId}"], .drawer-nav-link[href*="${sectionId}"]`).forEach(el => {
          el.classList.remove("active");
        });
      }
    });
  }, { passive: true });

  // Pomodoro Controls
  if (elements.pomodoroToggleBtn) {
    elements.pomodoroToggleBtn.addEventListener("click", () => {
      const isRunning = pomodoro.toggle();
      updatePomodoroPlayButton(isRunning);
      if (isRunning) {
        showToast("⏱️ Sessão Pomodoro em andamento. Mantenha o foco!", "info");
      }
    });
  }

  if (elements.pomodoroResetBtn) {
    elements.pomodoroResetBtn.addEventListener("click", () => {
      pomodoro.reset();
      updatePomodoroPlayButton(false);
      showToast("Timer reiniciado.", "info");
    });
  }

  if (elements.pomodoroModeBtns) {
    elements.pomodoroModeBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.mode;
        pomodoro.setMode(mode);
      });
    });
  }

  if (elements.pomodoroSubjectSelect) {
    elements.pomodoroSubjectSelect.addEventListener("change", (e) => {
      pomodoro.selectedSubject = e.target.value;
    });
  }

  // Som Ambiente
  if (elements.ambientToggleBtn) {
    elements.ambientToggleBtn.addEventListener("click", () => {
      const isPlaying = ambientSound.toggle(elements.ambientPreset ? elements.ambientPreset.value : "rain");
      elements.ambientToggleBtn.classList.toggle("active", isPlaying);
      if (elements.ambientPanel) {
        elements.ambientPanel.classList.toggle("open", isPlaying);
      }
      showToast(isPlaying ? "🎧 Som ambiente ativado para foco profundo!" : "Som ambiente desativado.", "info");
    });
  }

  if (elements.ambientPreset) {
    elements.ambientPreset.addEventListener("change", (e) => {
      if (ambientSound.isPlaying) {
        ambientSound.start(e.target.value);
      }
    });
  }

  if (elements.ambientVolume) {
    elements.ambientVolume.addEventListener("input", (e) => {
      ambientSound.setVolume(parseFloat(e.target.value));
    });
  }

  // Filtros de Áreas
  if (elements.areaFilterBtns) {
    elements.areaFilterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        elements.areaFilterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderSubjects(btn.dataset.filter, elements.subjectSearchInput ? elements.subjectSearchInput.value : "");
      });
    });
  }

  if (elements.subjectSearchInput) {
    elements.subjectSearchInput.addEventListener("input", (e) => {
      renderSubjects(getActiveAreaFilter(), e.target.value);
    });
  }

  // Flashcards Controls
  if (elements.flashcardContainer) {
    elements.flashcardContainer.addEventListener("click", () => {
      elements.flashcardContainer.classList.toggle("is-flipped");
    });
  }

  if (elements.flashcardFlipBtn) {
    elements.flashcardFlipBtn.addEventListener("click", () => {
      if (elements.flashcardContainer) {
        elements.flashcardContainer.classList.toggle("is-flipped");
      }
    });
  }

  if (elements.flashcardNextBtn) {
    elements.flashcardNextBtn.addEventListener("click", () => {
      currentCardIndex++;
      updateFlashcardDisplay();
    });
  }

  if (elements.flashcardPrevBtn) {
    elements.flashcardPrevBtn.addEventListener("click", () => {
      currentCardIndex--;
      updateFlashcardDisplay();
    });
  }

  if (elements.flashcardFilterSelect) {
    elements.flashcardFilterSelect.addEventListener("change", (e) => {
      filterFlashcards(e.target.value);
    });
  }

  if (elements.btnKnownFlashcard) {
    elements.btnKnownFlashcard.addEventListener("click", () => {
      triggerConfetti();
      showToast("Excelente! Flashcard marcado como dominado.", "success");
      currentCardIndex++;
      updateFlashcardDisplay();
    });
  }

  if (elements.btnReviewFlashcard) {
    elements.btnReviewFlashcard.addEventListener("click", () => {
      showToast("Marcado para revisão espaçada nos próximos ciclos.", "warning");
      currentCardIndex++;
      updateFlashcardDisplay();
    });
  }

  // Modais de Criação
  // 1) Tarefa
  if (elements.btnOpenTaskModal && elements.taskModal) {
    elements.btnOpenTaskModal.addEventListener("click", () => {
      elements.taskModal.classList.add("active");
    });
  }

  if (elements.btnCloseTaskModal && elements.taskModal) {
    elements.btnCloseTaskModal.addEventListener("click", () => {
      elements.taskModal.classList.remove("active");
    });
  }

  if (elements.taskForm) {
    elements.taskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("taskTitleInput").value.trim();
      const area = document.getElementById("taskAreaSelect").value;
      const priority = document.getElementById("taskPrioritySelect").value;
      const date = document.getElementById("taskDateInput").value.trim() || "Hoje";

      if (!title) return;

      const newTask = {
        id: "task-" + Date.now(),
        title,
        area,
        status: "todo",
        priority,
        date
      };

      state.tasks.unshift(newTask);
      saveState();
      renderTasks();
      elements.taskForm.reset();
      elements.taskModal.classList.remove("active");
      showToast("Nova tarefa adicionada ao seu ciclo!", "success");
    });
  }

  // 2) Disciplina / Matéria
  if (elements.btnAddSubjectModal && elements.subjectModal) {
    elements.btnAddSubjectModal.addEventListener("click", () => {
      elements.subjectModal.classList.add("active");
    });
  }

  if (elements.btnCloseSubjectModal && elements.subjectModal) {
    elements.btnCloseSubjectModal.addEventListener("click", () => {
      elements.subjectModal.classList.remove("active");
    });
  }

  if (elements.subjectForm) {
    elements.subjectForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("subNameInput").value.trim();
      const area = document.getElementById("subAreaSelect").value;
      const level = document.getElementById("subLevelSelect").value;
      const nextTask = document.getElementById("subTaskInput").value.trim() || "Iniciar leitura do capítulo 1";
      const hours = parseInt(document.getElementById("subHoursInput").value) || 0;

      if (!name) return;

      const areaObj = state.areas.find(a => a.id === area) || { color: "#8b5cf6" };

      const newSubject = {
        id: "sub-" + Date.now(),
        area,
        name,
        icon: "fa-book",
        progress: 10,
        level,
        hours,
        nextTask,
        color: areaObj.color
      };

      state.subjects.push(newSubject);
      saveState();
      populateSubjectSelect();
      renderSubjects(getActiveAreaFilter());
      renderAreas();
      renderStats();
      elements.subjectForm.reset();
      elements.subjectModal.classList.remove("active");
      showToast(`Disciplina "${name}" cadastrada com sucesso!`, "success");
    });
  }

  // 3) Flashcard
  if (elements.btnAddFlashcardModal && elements.flashcardModal) {
    elements.btnAddFlashcardModal.addEventListener("click", () => {
      elements.flashcardModal.classList.add("active");
    });
  }

  if (elements.btnCloseFlashcardModal && elements.flashcardModal) {
    elements.btnCloseFlashcardModal.addEventListener("click", () => {
      elements.flashcardModal.classList.remove("active");
    });
  }

  if (elements.flashcardForm) {
    elements.flashcardForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const area = document.getElementById("fcAreaSelect").value;
      const question = document.getElementById("fcQuestionInput").value.trim();
      const answer = document.getElementById("fcAnswerInput").value.trim();
      const tag = document.getElementById("fcTagInput").value.trim() || "Revisão";

      if (!question || !answer) return;

      const newFc = {
        id: "fc-" + Date.now(),
        area,
        question,
        answer,
        tags: [tag]
      };

      state.flashcards.push(newFc);
      saveState();
      filterFlashcards(elements.flashcardFilterSelect ? elements.flashcardFilterSelect.value : "all");
      elements.flashcardForm.reset();
      elements.flashcardModal.classList.remove("active");
      showToast("Novo flashcard salvo no seu baralho de estudos!", "success");
    });
  }

  // Fechar modais ao clicar no backdrop escuro
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      e.target.classList.remove("active");
    }
  });

  // Inicialização Geral
  renderStats();
  renderAreas();
  renderSubjects();
  populateSubjectSelect();
  renderCertifications();
  renderProjects();
  filterFlashcards("all");
  renderTasks();
});
