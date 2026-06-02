// report.js
// 회기 결과 리포트와 치료적 피드백 문장을 생성합니다.

function toPercent(value) {
  return `${Math.round(Number(value || 0) * 100)}%`;
}

function generateTherapeuticFeedback(result) {
  const accuracy = Number(result.accuracy || 0);
  const hintCount = Number(result.hintCount || 0);
  const fatigueLevel = Number(result.fatigueLevel || 1);

  if (fatigueLevel >= 4) {
    return "훈련 후 피로도가 높게 보고되었습니다. 다음 회기에는 과제 수를 줄이거나 휴식 시간을 충분히 제공하는 것이 적절합니다.";
  }

  if (accuracy >= 0.8 && hintCount <= 1) {
    return "목표 물건을 기억하고 선택하는 수행이 비교적 안정적으로 나타났습니다. 다음 회기에는 현재 수준을 유지하거나 난이도를 소폭 높일 수 있습니다.";
  }

  if (accuracy >= 0.6) {
    return "일부 과제는 정확하게 수행하였으나, 기억 유지와 주의 집중이 추가로 필요합니다. 현재 난이도를 유지하면서 반복 훈련하는 것이 적절합니다.";
  }

  return "목표 물건을 기억하고 선택하는 과정에서 어려움이 나타났습니다. 다음 회기에는 물건 수를 줄이고 힌트를 제공하는 방식으로 진행하는 것이 적절합니다.";
}

function generateReport(result) {
  const neglect = analyzeNeglectTraining(result.leftSearchCount, result.rightSearchCount);
  const feedback = generateTherapeuticFeedback(result);

  return `${result.userName}님의 오늘 훈련 결과입니다.

총 ${result.totalItems}개 목표 물건 중 ${result.correctCount}개를 정확히 선택하였습니다.
정답률은 ${toPercent(result.accuracy)}입니다.
평균 반응시간은 ${Number(result.averageReactionTime || 0).toFixed(1)}초입니다.
힌트는 총 ${result.hintCount}회 사용하였습니다.
좌측 탐색 횟수는 ${result.leftSearchCount}회, 우측 탐색 횟수는 ${result.rightSearchCount}회입니다.
훈련 후 피로도는 ${result.fatigueLevel}점으로 기록되었습니다.

다음 회기 권장 난이도는 ${result.nextDifficulty}단계입니다.

치료적 피드백:
${feedback}

좌우 탐색 피드백:
${neglect.message}

주의:
본 결과는 게임 수행 기록이며, 의학적 진단이나 표준화 평가를 대체하지 않습니다.`;
}

function resultCardsHtml(result) {
  const cards = [
    ["점수", `${result.score}점`],
    ["정답률", toPercent(result.accuracy)],
    ["평균 반응시간", `${Number(result.averageReactionTime || 0).toFixed(1)}초`],
    ["힌트 사용", `${result.hintCount}회`],
    ["좌측/우측 탐색", `${result.leftSearchCount}회 / ${result.rightSearchCount}회`],
    ["다음 난이도", `${result.nextDifficulty}단계`]
  ];

  return `
    <div class="result-grid">
      ${cards.map(([label, value]) => `
        <div class="result-card">
          <strong>${label}</strong>
          <span>${value}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function historyTableHtml(history) {
  if (!history.length) {
    return `<div class="empty">아직 저장된 회기 기록이 없습니다.</div>`;
  }

  return `
    <div class="history-table-wrap">
      <table>
        <thead>
          <tr>
            <th>날짜</th>
            <th>대상자</th>
            <th>난이도</th>
            <th>정답률</th>
            <th>반응시간</th>
            <th>힌트</th>
            <th>피로도</th>
            <th>다음 난이도</th>
            <th>점수</th>
          </tr>
        </thead>
        <tbody>
          ${history.map(row => `
            <tr>
              <td>${row.date}</td>
              <td>${row.userName}</td>
              <td>${row.difficulty}</td>
              <td>${toPercent(row.accuracy)}</td>
              <td>${Number(row.averageReactionTime || 0).toFixed(1)}초</td>
              <td>${row.hintCount}</td>
              <td>${row.fatigueLevel}</td>
              <td>${row.nextDifficulty}</td>
              <td>${row.score}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

window.generateReport = generateReport;
window.generateTherapeuticFeedback = generateTherapeuticFeedback;
window.resultCardsHtml = resultCardsHtml;
window.historyTableHtml = historyTableHtml;
