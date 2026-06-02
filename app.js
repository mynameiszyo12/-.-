// app.js
// AI 장보기·주방 정리 재활게임의 핵심 로직입니다.

const gameState = {
  userName: "",
  sessionDate: "",
  difficulty: 1,
  timerEnabled: false,
  soundEnabled: true,

  targetItems: [],
  displayedItems: [],
  selectedItems: [],
  organizedItemIds: [],
  selectedOrganizeItemId: null,

  correctCount: 0,
  wrongCount: 0,
  hintCount: 0,

  shoppingStartTime: null,
  reactionTimes: [],

  leftSearchCount: 0,
  rightSearchCount: 0,

  fatigueLevel: 2,
  nextDifficulty: 1,
  score: 0,

  memoryTimerId: null,
  shoppingTimerId: null,
  timeRemaining: 0
};

function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return Array.from(document.querySelectorAll(selector));
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function getItemById(id) {
  return ITEM_DATA.find(item => item.id === id);
}

function getZoneById(id) {
  return ZONE_DATA.find(zone => zone.id === id);
}

function showScreen(screenId) {
  $all(".screen").forEach(screen => screen.classList.remove("active"));
  $(`#${screenId}`).classList.add("active");
}

function clearTimers() {
  if (gameState.memoryTimerId) {
    clearInterval(gameState.memoryTimerId);
    gameState.memoryTimerId = null;
  }

  if (gameState.shoppingTimerId) {
    clearInterval(gameState.shoppingTimerId);
    gameState.shoppingTimerId = null;
  }
}

function playTone(type) {
  if (!gameState.soundEnabled) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = type === "correct" ? 720 : type === "success" ? 880 : 220;
    gain.gain.value = 0.06;

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();

    setTimeout(() => {
      oscillator.stop();
      context.close();
    }, 120);
  } catch (error) {
    // 브라우저 정책상 오디오가 막혀도 게임 진행에는 영향이 없도록 처리합니다.
  }
}

function resetGame() {
  clearTimers();

  gameState.targetItems = [];
  gameState.displayedItems = [];
  gameState.selectedItems = [];
  gameState.organizedItemIds = [];
  gameState.selectedOrganizeItemId = null;

  gameState.correctCount = 0;
  gameState.wrongCount = 0;
  gameState.hintCount = 0;
  gameState.shoppingStartTime = null;
  gameState.reactionTimes = [];
  gameState.leftSearchCount = 0;
  gameState.rightSearchCount = 0;
  gameState.fatigueLevel = 2;
  gameState.nextDifficulty = gameState.difficulty;
  gameState.score = 0;
  gameState.timeRemaining = 0;

  $("#result-content").hidden = true;
  $("#fatigue-box").hidden = false;
  $("#restart-btn").hidden = true;
  $("#result-history-btn").hidden = true;
}

function initGame() {
  $("#start-btn").addEventListener("click", startGame);
  $("#history-btn").addEventListener("click", showHistoryScreen);
  $("#skip-memory-btn").addEventListener("click", showShoppingScreen);
  $("#hint-btn").addEventListener("click", showHint);
  $("#to-organize-btn").addEventListener("click", showOrganizeScreen);
  $("#finish-btn").addEventListener("click", showResultScreen);
  $("#generate-result-btn").addEventListener("click", finalizeResult);
  $("#restart-btn").addEventListener("click", () => {
    showScreen("start-screen");
  });
  $("#result-history-btn").addEventListener("click", showHistoryScreen);
  $("#clear-history-btn").addEventListener("click", clearHistory);

  $all("[data-action='go-home']").forEach(button => {
    button.addEventListener("click", () => {
      clearTimers();
      showScreen("start-screen");
    });
  });

  renderHistory();
}

function startGame() {
  resetGame();

  const nameValue = $("#user-name").value.trim();
  gameState.userName = nameValue || "대상자";
  gameState.sessionDate = new Date().toLocaleString("ko-KR");
  gameState.difficulty = Number($("#difficulty-select").value);
  gameState.timerEnabled = $("#timer-enabled").checked;
  gameState.soundEnabled = $("#sound-enabled").checked;

  setDifficulty(gameState.difficulty);
  generateTargetItems();
  showMemoryScreen();
}

function setDifficulty(level) {
  gameState.difficulty = Math.max(1, Math.min(5, Number(level || 1)));
  gameState.nextDifficulty = gameState.difficulty;
}

function generateTargetItems() {
  const config = DIFFICULTY_CONFIG[gameState.difficulty];

  const shuffledItems = shuffle(ITEM_DATA);
  const targetItems = shuffledItems.slice(0, config.targetCount);
  const remainingItems = shuffledItems.filter(item => !targetItems.some(target => target.id === item.id));
  const distractors = remainingItems.slice(0, config.distractorCount);

  gameState.targetItems = targetItems;
  gameState.displayedItems = shuffle([...targetItems, ...distractors]).map((item, index) => ({
    ...item,
    side: index % 2 === 0 ? "left" : "right"
  }));
}

function showMemoryScreen() {
  showScreen("memory-screen");

  const config = DIFFICULTY_CONFIG[gameState.difficulty];
  let remainingSeconds = config.memorySeconds;

  $("#memory-status").textContent = `${gameState.difficulty}단계 · ${gameState.targetItems.length}개 기억`;
  $("#memory-countdown").textContent = remainingSeconds;

  $("#memory-list").innerHTML = gameState.targetItems.map(item => `
    <div class="memory-card">
      <div class="item-emoji">${item.emoji}</div>
      <div>${item.name}</div>
    </div>
  `).join("");

  clearTimers();
  gameState.memoryTimerId = setInterval(() => {
    remainingSeconds -= 1;
    $("#memory-countdown").textContent = remainingSeconds;

    if (remainingSeconds <= 0) {
      clearInterval(gameState.memoryTimerId);
      gameState.memoryTimerId = null;
      showShoppingScreen();
    }
  }, 1000);
}

function showShoppingScreen() {
  clearTimers();
  showScreen("shopping-screen");

  gameState.shoppingStartTime = Date.now();

  $("#shopping-difficulty").textContent = `${gameState.difficulty}단계`;
  $("#shopping-score").textContent = `정답 ${gameState.correctCount}/${gameState.targetItems.length}`;
  $("#target-summary").textContent = `기억한 물건 ${gameState.targetItems.length}개를 찾아 선택하세요.`;
  $("#shopping-feedback").textContent = "목표 물건을 선택하면 초록색으로 표시됩니다.";
  $("#shopping-feedback").className = "feedback";
  $("#to-organize-btn").disabled = true;

  renderShoppingGrid();
  startShoppingTimer();
}

function startShoppingTimer() {
  const config = DIFFICULTY_CONFIG[gameState.difficulty];

  if (!gameState.timerEnabled || config.timeLimitSeconds <= 0) {
    $("#shopping-timer").textContent = "시간 제한 없음";
    return;
  }

  gameState.timeRemaining = config.timeLimitSeconds;
  $("#shopping-timer").textContent = `남은 시간 ${gameState.timeRemaining}초`;

  gameState.shoppingTimerId = setInterval(() => {
    gameState.timeRemaining -= 1;
    $("#shopping-timer").textContent = `남은 시간 ${gameState.timeRemaining}초`;

    if (gameState.timeRemaining <= 0) {
      clearInterval(gameState.shoppingTimerId);
      gameState.shoppingTimerId = null;
      $("#shopping-feedback").textContent = "제한시간이 종료되었습니다. 선택한 물건으로 정리 단계로 이동할 수 있습니다.";
      $("#shopping-feedback").className = "feedback error";
      $("#to-organize-btn").disabled = false;
    }
  }, 1000);
}

function renderShoppingGrid() {
  $("#shopping-grid").innerHTML = gameState.displayedItems.map(item => {
    const isSelected = gameState.selectedItems.some(selected => selected.id === item.id);
    const className = isSelected ? "item-card correct" : "item-card";
    return `
      <button 
        class="${className}" 
        data-item-id="${item.id}" 
        data-side="${item.side}"
        aria-label="${item.name} 선택"
      >
        <span class="item-emoji">${item.emoji}</span>
        <span>${item.name}</span>
      </button>
    `;
  }).join("");

  $all("#shopping-grid .item-card").forEach(card => {
    card.addEventListener("click", () => {
      selectItem(card.dataset.itemId, card.dataset.side, card);
    });
  });
}

function selectItem(itemId, side, cardElement) {
  const alreadyCorrect = gameState.selectedItems.some(item => item.id === itemId);
  if (alreadyCorrect) return;

  if (side === "left") {
    gameState.leftSearchCount += 1;
  } else {
    gameState.rightSearchCount += 1;
  }

  const reactionTime = (Date.now() - gameState.shoppingStartTime) / 1000;
  gameState.reactionTimes.push(reactionTime);

  const isCorrect = checkAnswer(itemId);

  if (isCorrect) {
    const item = getItemById(itemId);
    gameState.selectedItems.push(item);
    gameState.correctCount += 1;
    cardElement.classList.add("correct");
    $("#shopping-feedback").textContent = `정답입니다. ${item.name}을/를 찾았습니다.`;
    $("#shopping-feedback").className = "feedback success";
    playTone("correct");
  } else {
    gameState.wrongCount += 1;
    cardElement.classList.add("wrong");
    $("#shopping-feedback").textContent = "목표 물건이 아닙니다. 다시 찾아보세요.";
    $("#shopping-feedback").className = "feedback error";
    playTone("wrong");
  }

  $("#shopping-score").textContent = `정답 ${gameState.correctCount}/${gameState.targetItems.length}`;

  if (gameState.correctCount >= gameState.targetItems.length) {
    $("#to-organize-btn").disabled = false;
    $("#shopping-feedback").textContent = "목표 물건을 모두 찾았습니다. 정리 단계로 이동하세요.";
    $("#shopping-feedback").className = "feedback success";
    playTone("success");
    clearTimers();
  }
}

function checkAnswer(itemId) {
  return gameState.targetItems.some(item => item.id === itemId);
}

function showHint() {
  const config = DIFFICULTY_CONFIG[gameState.difficulty];

  if (gameState.hintCount >= config.maxHints) {
    $("#shopping-feedback").textContent = "현재 난이도에서 사용할 수 있는 힌트를 모두 사용했습니다.";
    $("#shopping-feedback").className = "feedback error";
    return;
  }

  const missingTargets = gameState.targetItems.filter(target => {
    return !gameState.selectedItems.some(selected => selected.id === target.id);
  });

  if (!missingTargets.length) {
    $("#shopping-feedback").textContent = "이미 모든 목표 물건을 찾았습니다.";
    $("#shopping-feedback").className = "feedback success";
    return;
  }

  const hintItem = missingTargets[0];
  gameState.hintCount += 1;

  const hintCard = $(`[data-item-id="${hintItem.id}"]`);
  if (hintCard) {
    hintCard.classList.add("hint");
    setTimeout(() => hintCard.classList.remove("hint"), 2500);
  }

  $("#shopping-feedback").textContent = `힌트: ${hintItem.name}을/를 찾아보세요.`;
  $("#shopping-feedback").className = "feedback";
}

function showOrganizeScreen() {
  clearTimers();
  showScreen("organize-screen");

  gameState.selectedOrganizeItemId = null;
  gameState.organizedItemIds = [];

  $("#organize-status").textContent = `정리할 물건 ${gameState.selectedItems.length}개`;
  $("#finish-btn").disabled = gameState.selectedItems.length > 0;
  $("#organize-feedback").textContent = "물건을 알맞은 위치로 옮겨 주세요.";
  $("#organize-feedback").className = "feedback";

  renderSelectedItemsTray();
  renderDropZones();
}

function renderSelectedItemsTray() {
  const tray = $("#selected-items-tray");

  if (!gameState.selectedItems.length) {
    tray.innerHTML = `<div class="empty">선택한 정답 물건이 없습니다. 결과를 확인할 수 있습니다.</div>`;
    $("#finish-btn").disabled = false;
    return;
  }

  tray.innerHTML = gameState.selectedItems.map(item => `
    <div 
      class="organize-card" 
      draggable="true"
      data-item-id="${item.id}"
      tabindex="0"
      role="button"
      aria-label="${item.name} 정리하기"
    >
      <div class="item-emoji">${item.emoji}</div>
      <div>${item.name}</div>
    </div>
  `).join("");

  $all("#selected-items-tray .organize-card").forEach(card => {
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("click", () => selectOrganizeCard(card.dataset.itemId));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectOrganizeCard(card.dataset.itemId);
      }
    });
  });
}

function renderDropZones() {
  const usedZoneIds = [...new Set(gameState.targetItems.map(item => item.correctZone))];
  const zones = ZONE_DATA.filter(zone => usedZoneIds.includes(zone.id));

  $("#drop-zones").innerHTML = zones.map(zone => `
    <div 
      class="drop-zone" 
      data-zone-id="${zone.id}"
      tabindex="0"
      role="button"
      aria-label="${zone.name}에 정리"
    >
      <div class="zone-title">${zone.emoji} ${zone.name}</div>
      <div class="zone-items" data-zone-items="${zone.id}"></div>
    </div>
  `).join("");

  $all(".drop-zone").forEach(zone => {
    zone.addEventListener("dragover", event => {
      event.preventDefault();
      zone.classList.add("drag-over");
    });

    zone.addEventListener("dragleave", () => {
      zone.classList.remove("drag-over");
    });

    zone.addEventListener("drop", handleDrop);

    zone.addEventListener("click", () => {
      if (gameState.selectedOrganizeItemId) {
        tryPlaceItem(gameState.selectedOrganizeItemId, zone.dataset.zoneId);
      }
    });

    zone.addEventListener("keydown", event => {
      if ((event.key === "Enter" || event.key === " ") && gameState.selectedOrganizeItemId) {
        event.preventDefault();
        tryPlaceItem(gameState.selectedOrganizeItemId, zone.dataset.zoneId);
      }
    });
  });
}

function selectOrganizeCard(itemId) {
  if (gameState.organizedItemIds.includes(itemId)) return;

  gameState.selectedOrganizeItemId = itemId;

  $all("#selected-items-tray .organize-card").forEach(card => {
    card.classList.toggle("selected", card.dataset.itemId === itemId);
  });

  const item = getItemById(itemId);
  $("#organize-feedback").textContent = `${item.name}을/를 선택했습니다. 알맞은 정리 위치를 클릭하세요.`;
  $("#organize-feedback").className = "feedback";
}

function handleDragStart(event) {
  event.dataTransfer.setData("text/plain", event.currentTarget.dataset.itemId);
}

function handleDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove("drag-over");

  const itemId = event.dataTransfer.getData("text/plain");
  const zoneId = event.currentTarget.dataset.zoneId;

  tryPlaceItem(itemId, zoneId);
}

function tryPlaceItem(itemId, zoneId) {
  const item = getItemById(itemId);
  const zone = getZoneById(zoneId);

  if (!item || !zone || gameState.organizedItemIds.includes(itemId)) return;

  if (item.correctZone === zoneId) {
    gameState.organizedItemIds.push(itemId);
    gameState.selectedOrganizeItemId = null;

    const zoneItems = $(`[data-zone-items="${zoneId}"]`);
    zoneItems.insertAdjacentHTML("beforeend", `<span title="${item.name}">${item.emoji}</span>`);

    const card = $(`#selected-items-tray [data-item-id="${itemId}"]`);
    if (card) card.remove();

    $("#organize-feedback").textContent = `정답입니다. ${item.name}을/를 ${zone.name}에 정리했습니다.`;
    $("#organize-feedback").className = "feedback success";
    playTone("correct");

    if (gameState.organizedItemIds.length >= gameState.selectedItems.length) {
      $("#finish-btn").disabled = false;
      $("#organize-feedback").textContent = "모든 물건을 정리했습니다. 결과를 확인하세요.";
      $("#organize-feedback").className = "feedback success";
      playTone("success");
    }
  } else {
    gameState.wrongCount += 1;
    $("#organize-feedback").textContent = `${item.name}의 위치가 알맞지 않습니다. 다시 시도해 보세요.`;
    $("#organize-feedback").className = "feedback error";
    playTone("wrong");
  }
}

function calculateAccuracy() {
  const totalTargets = gameState.targetItems.length;
  if (totalTargets === 0) return 0;
  return gameState.correctCount / totalTargets;
}

function calculateAverageReactionTime() {
  if (!gameState.reactionTimes.length) return 0;
  const sum = gameState.reactionTimes.reduce((acc, value) => acc + value, 0);
  return sum / gameState.reactionTimes.length;
}

function buildResult() {
  const accuracy = calculateAccuracy();
  const averageReactionTime = calculateAverageReactionTime();

  const baseResult = {
    userName: gameState.userName,
    date: gameState.sessionDate,
    difficulty: gameState.difficulty,
    currentDifficulty: gameState.difficulty,
    totalItems: gameState.targetItems.length,
    correctCount: gameState.correctCount,
    wrongCount: gameState.wrongCount,
    accuracy,
    averageReactionTime,
    hintCount: gameState.hintCount,
    leftSearchCount: gameState.leftSearchCount,
    rightSearchCount: gameState.rightSearchCount,
    fatigueLevel: gameState.fatigueLevel
  };

  const nextDifficulty = adjustDifficulty(baseResult);
  const score = calculateScore({ ...baseResult, nextDifficulty });

  return {
    ...baseResult,
    nextDifficulty,
    score
  };
}

function showResultScreen() {
  showScreen("result-screen");
  $("#fatigue-box").hidden = false;
  $("#result-content").hidden = true;
  $("#restart-btn").hidden = true;
  $("#result-history-btn").hidden = true;
}

function finalizeResult() {
  gameState.fatigueLevel = Number($("#fatigue-select").value || 2);

  const result = buildResult();
  gameState.nextDifficulty = result.nextDifficulty;
  gameState.score = result.score;

  saveSessionResult(result);

  const report = generateReport(result);

  $("#result-content").innerHTML = `
    ${resultCardsHtml(result)}
    <div class="report-box">${escapeHtml(report)}</div>
  `;

  $("#fatigue-box").hidden = true;
  $("#result-content").hidden = false;
  $("#restart-btn").hidden = false;
  $("#result-history-btn").hidden = false;
}

function saveSessionResult(result) {
  const history = loadSessionHistory();
  history.unshift(result);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 50)));
}

function loadSessionHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function renderHistory() {
  const history = loadSessionHistory();
  $("#history-content").innerHTML = historyTableHtml(history);
}

function showHistoryScreen() {
  renderHistory();
  showScreen("history-screen");
}

function clearHistory() {
  const confirmed = confirm("저장된 회기 기록을 모두 삭제할까요?");
  if (!confirmed) return;

  localStorage.removeItem(STORAGE_KEY);
  renderHistory();
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

window.initGame = initGame;
window.startGame = startGame;
window.setDifficulty = setDifficulty;
window.generateTargetItems = generateTargetItems;
window.showMemoryScreen = showMemoryScreen;
window.showShoppingScreen = showShoppingScreen;
window.selectItem = selectItem;
window.checkAnswer = checkAnswer;
window.showOrganizeScreen = showOrganizeScreen;
window.handleDragStart = handleDragStart;
window.handleDrop = handleDrop;
window.calculateAccuracy = calculateAccuracy;
window.calculateAverageReactionTime = calculateAverageReactionTime;
window.adjustDifficulty = window.adjustDifficulty;
window.saveSessionResult = saveSessionResult;
window.loadSessionHistory = loadSessionHistory;
window.generateReport = window.generateReport;
window.showResultScreen = showResultScreen;
window.resetGame = resetGame;

document.addEventListener("DOMContentLoaded", initGame);
