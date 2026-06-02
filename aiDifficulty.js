// aiDifficulty.js
// 대상자의 수행 결과를 바탕으로 다음 회기 난이도를 추천합니다.
// 이 기능은 실제 머신러닝 모델이 아니라 규칙 기반 AI 난이도 조절입니다.

function clampDifficulty(level) {
  if (level < 1) return 1;
  if (level > 5) return 5;
  return level;
}

function adjustDifficulty(result) {
  let nextDifficulty = Number(result.currentDifficulty || result.difficulty || 1);

  const accuracy = Number(result.accuracy || 0);
  const averageReactionTime = Number(result.averageReactionTime || 0);
  const hintCount = Number(result.hintCount || 0);
  const fatigueLevel = Number(result.fatigueLevel || 1);
  const wrongCount = Number(result.wrongCount || 0);

  if (accuracy >= 0.8 && averageReactionTime <= 5 && hintCount <= 1 && fatigueLevel <= 3) {
    nextDifficulty += 1;
  }

  if (accuracy < 0.6 || hintCount >= 3 || fatigueLevel >= 4 || wrongCount >= 4) {
    nextDifficulty -= 1;
  }

  return clampDifficulty(nextDifficulty);
}

function calculateScore(result) {
  const correctCount = Number(result.correctCount || 0);
  const wrongCount = Number(result.wrongCount || 0);
  const hintCount = Number(result.hintCount || 0);
  const averageReactionTime = Number(result.averageReactionTime || 0);
  const accuracy = Number(result.accuracy || 0);

  let score = 0;
  score += correctCount * 15;
  score -= wrongCount * 5;
  score -= hintCount * 3;
  score += Math.round(accuracy * 40);

  const timeBonus = Math.max(0, 20 - averageReactionTime);
  score += Math.round(timeBonus);

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  return score;
}

function analyzeNeglectTraining(leftSearchCount, rightSearchCount) {
  const left = Number(leftSearchCount || 0);
  const right = Number(rightSearchCount || 0);

  if (left + right === 0) {
    return {
      message: "좌우 탐색 데이터가 충분하지 않습니다.",
      increaseLeftTargets: false,
      increaseRightTargets: false
    };
  }

  if (left < right * 0.5) {
    return {
      message: "왼쪽 화면 탐색이 상대적으로 적게 나타났습니다. 다음 회기에는 왼쪽 화면 탐색 과제를 늘리는 것이 좋습니다.",
      increaseLeftTargets: true,
      increaseRightTargets: false
    };
  }

  if (right < left * 0.5) {
    return {
      message: "오른쪽 화면 탐색이 상대적으로 적게 나타났습니다. 다음 회기에는 오른쪽 화면 탐색 과제를 늘리는 것이 좋습니다.",
      increaseLeftTargets: false,
      increaseRightTargets: true
    };
  }

  return {
    message: "좌우 탐색이 비교적 균형적으로 나타났습니다.",
    increaseLeftTargets: false,
    increaseRightTargets: false
  };
}

window.adjustDifficulty = adjustDifficulty;
window.calculateScore = calculateScore;
window.analyzeNeglectTraining = analyzeNeglectTraining;
