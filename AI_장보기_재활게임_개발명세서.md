# AI 기반 뇌졸중 환자용 장보기·주방 정리 재활게임 개발 명세서

## 0. 이 문서의 사용 목적

이 문서는 **AI 코딩툴(Claude Code, Cursor, ChatGPT, Copilot 등)**에 그대로 입력하여  
JavaScript 기반 웹게임을 만들기 위한 개발 명세서이다.

목표는 뇌졸중 환자의 **인지기능, 시각탐색 능력, 실행기능, 기억력, 상지 움직임**을 훈련할 수 있는  
**AI 기반 일상생활형 재활게임**을 제작하는 것이다.

---

# 1. 게임 제목

## AI Daily Shopping Rehab Game  
### AI 기반 일상 장보기·주방 정리 재활게임

---

# 2. 게임 핵심 개념

이 게임은 뇌졸중 환자가 화면에 제시된 구매 목록을 기억하고,  
마트 또는 주방 화면에서 필요한 물건을 찾아 선택한 뒤,  
알맞은 위치에 정리하는 방식으로 진행된다.

게임은 대상자의 수행 결과를 분석하여 다음 과제의 난이도를 자동으로 조절한다.

---

# 3. 게임 목적

본 게임의 목적은 뇌졸중 환자의 다음 기능을 훈련하는 것이다.

| 훈련 영역 | 게임 속 구현 방식 |
|---|---|
| 기억력 | 구매 목록을 일정 시간 보고 기억하기 |
| 주의력 | 여러 물건 중 목표 물건 찾기 |
| 실행기능 | 물건을 정해진 순서와 위치에 배치하기 |
| 시각탐색 | 화면 좌우에 배치된 물건을 탐색하기 |
| 편측무시 보상 | 왼쪽 또는 오른쪽 탐색 부족 시 해당 방향 과제 증가 |
| 상지기능 | 클릭, 드래그, 손동작 인식, 팔 뻗기 동작 |
| 일상생활 수행 | 장보기, 냉장고 정리, 약 복용 준비, 주방 정리 |

---

# 4. 대상자 설정

| 항목 | 내용 |
|---|---|
| 주요 대상자 | 뇌졸중 후 인지기능 저하가 있는 성인 |
| 적용 수준 | 경도~중등도 인지장애 |
| 사용 환경 | 병원, 재활센터, 가정, 노트북, 태블릿 |
| 조작 방식 | 마우스 클릭, 터치, 드래그, 추후 손동작 인식 |
| 치료적 초점 | 인지재활 + 상지활동 + ADL/IADL 기반 과제 |

---

# 5. 개발 목표

## 1차 개발 목표

우선 카메라 AI 없이도 실행 가능한 웹게임을 만든다.

필수 기능:

1. 시작 화면
2. 난이도 선택
3. 구매 목록 기억하기
4. 물건 찾기
5. 물건 정리하기
6. 정답률 계산
7. 반응시간 측정
8. 힌트 기능
9. 난이도 자동 조절
10. 결과 리포트 출력
11. 회기별 기록 저장

---

## 2차 개발 목표

1차 기능이 완성되면 AI 기능을 확장한다.

확장 기능:

1. MediaPipe를 활용한 손동작 인식
2. TensorFlow.js MoveNet을 활용한 팔 움직임 추적
3. ChatGPT API 또는 Gemini API를 활용한 자동 피드백 생성
4. Firebase를 활용한 사용자별 데이터 저장
5. 회기별 그래프 시각화
6. 편측무시 탐색 패턴 분석

---

# 6. 기술 스택

| 구분 | 사용 기술 |
|---|---|
| 화면 구조 | HTML |
| 디자인 | CSS |
| 게임 로직 | JavaScript |
| 게임 화면 | HTML Canvas 또는 DOM |
| 데이터 저장 | localStorage |
| 그래프 | Chart.js |
| 손동작 인식 | MediaPipe Gesture Recognizer |
| 자세 인식 | TensorFlow.js MoveNet |
| AI 피드백 | ChatGPT API 또는 Gemini API |
| 배포 | GitHub Pages, Netlify, Vercel |

---

# 7. 폴더 구조

다음 구조로 프로젝트를 생성한다.

```txt
ai-shopping-rehab-game/
│
├── index.html
├── style.css
├── app.js
├── data.js
├── report.js
├── aiDifficulty.js
├── README.md
│
├── assets/
│   ├── images/
│   │   ├── milk.png
│   │   ├── apple.png
│   │   ├── egg.png
│   │   ├── bread.png
│   │   ├── medicine.png
│   │   ├── cup.png
│   │   └── banana.png
│   │
│   └── sounds/
│       ├── correct.mp3
│       ├── wrong.mp3
│       └── success.mp3
│
└── docs/
    └── intervention-plan.md
```

---

# 8. 게임 화면 구성

## 8.1 시작 화면

필수 요소:

- 게임 제목
- 대상자 이름 입력
- 난이도 선택
- 시작 버튼
- 사용 안내

화면 문구 예시:

```txt
AI 장보기 재활게임

오늘의 미션을 기억하고 필요한 물건을 찾아보세요.
천천히 해도 괜찮습니다.
정확하게 찾는 것이 가장 중요합니다.
```

---

## 8.2 구매 목록 기억 화면

일정 시간 동안 구매 목록을 보여준다.

예시:

```txt
오늘 사야 할 물건을 기억하세요.

우유
사과
계란
```

난이도별 제시 시간:

| 난이도 | 물건 개수 | 제시 시간 |
|---|---:|---:|
| 1 | 2개 | 8초 |
| 2 | 3개 | 7초 |
| 3 | 4개 | 6초 |
| 4 | 5개 | 5초 |
| 5 | 6개 | 4초 |

---

## 8.3 물건 찾기 화면

여러 물건이 화면에 섞여 나온다.

대상자는 기억한 물건을 선택해야 한다.

필수 기능:

- 정답 물건 클릭 시 초록색 표시
- 오답 물건 클릭 시 빨간색 표시
- 정답/오답 소리
- 힌트 버튼
- 남은 시간 표시
- 현재 점수 표시

---

## 8.4 주방 정리 화면

선택한 물건을 알맞은 위치로 드래그한다.

예시:

| 물건 | 정답 위치 |
|---|---|
| 우유 | 냉장고 |
| 사과 | 과일 바구니 |
| 계란 | 냉장고 |
| 약 | 약 상자 |
| 컵 | 식탁 |
| 빵 | 식품 보관함 |

필수 기능:

- 드래그 앤 드롭
- 정답 위치에 놓으면 점수 증가
- 틀린 위치에 놓으면 다시 이동
- 필요 시 힌트 제공

---

## 8.5 결과 화면

회기 종료 후 다음 정보를 보여준다.

| 결과 항목 | 설명 |
|---|---|
| 총 과제 수 | 전체 물건 수 |
| 정답 수 | 올바르게 선택한 물건 수 |
| 오답 수 | 잘못 선택한 물건 수 |
| 정답률 | 정답 수 / 총 과제 수 |
| 평균 반응시간 | 물건 선택까지 걸린 평균 시간 |
| 힌트 사용 횟수 | 도움 요청 횟수 |
| 좌측 선택 수 | 화면 왼쪽 물건 선택 횟수 |
| 우측 선택 수 | 화면 오른쪽 물건 선택 횟수 |
| 다음 난이도 | 자동 조절 결과 |

---

# 9. 핵심 게임 데이터 구조

```javascript
const gameState = {
  userName: "",
  sessionDate: "",
  difficulty: 1,

  targetItems: [],
  displayedItems: [],
  selectedItems: [],

  correctCount: 0,
  wrongCount: 0,
  hintCount: 0,

  startTime: null,
  reactionTimes: [],

  leftSearchCount: 0,
  rightSearchCount: 0,

  fatigueLevel: 0,
  nextDifficulty: 1
};
```

---

# 10. 물건 데이터 구조

```javascript
const itemData = [
  {
    id: "milk",
    name: "우유",
    category: "food",
    correctZone: "fridge",
    image: "assets/images/milk.png"
  },
  {
    id: "apple",
    name: "사과",
    category: "fruit",
    correctZone: "fruitBasket",
    image: "assets/images/apple.png"
  },
  {
    id: "egg",
    name: "계란",
    category: "food",
    correctZone: "fridge",
    image: "assets/images/egg.png"
  },
  {
    id: "medicine",
    name: "약",
    category: "health",
    correctZone: "medicineBox",
    image: "assets/images/medicine.png"
  },
  {
    id: "cup",
    name: "컵",
    category: "kitchen",
    correctZone: "table",
    image: "assets/images/cup.png"
  }
];
```

---

# 11. 난이도 자동 조절 알고리즘

## 11.1 수집 데이터

| 데이터 | 의미 |
|---|---|
| accuracy | 정답률 |
| averageReactionTime | 평균 반응시간 |
| hintCount | 힌트 사용 횟수 |
| wrongCount | 오답 수 |
| leftSearchCount | 왼쪽 탐색 횟수 |
| rightSearchCount | 오른쪽 탐색 횟수 |
| fatigueLevel | 주관적 피로도 |

---

## 11.2 난이도 조절 기준

```javascript
function adjustDifficulty(result) {
  let nextDifficulty = result.currentDifficulty;

  if (
    result.accuracy >= 0.8 &&
    result.averageReactionTime <= 5 &&
    result.hintCount <= 1
  ) {
    nextDifficulty += 1;
  }

  if (
    result.accuracy < 0.6 ||
    result.hintCount >= 3 ||
    result.fatigueLevel >= 4
  ) {
    nextDifficulty -= 1;
  }

  if (nextDifficulty < 1) nextDifficulty = 1;
  if (nextDifficulty > 5) nextDifficulty = 5;

  return nextDifficulty;
}
```

---

## 11.3 난이도별 변화

| 난이도 | 물건 개수 | 방해 물건 | 제한시간 | 힌트 |
|---|---:|---:|---:|---|
| 1 | 2개 | 2개 | 없음 | 항상 가능 |
| 2 | 3개 | 3개 | 60초 | 가능 |
| 3 | 4개 | 4개 | 50초 | 가능 |
| 4 | 5개 | 5개 | 40초 | 2회 |
| 5 | 6개 | 6개 | 30초 | 1회 |

---

# 12. 편측무시 보상 로직

뇌졸중 환자의 시각탐색 문제를 고려하여 좌우 탐색 데이터를 저장한다.

```javascript
function checkScreenSide(xPosition, screenWidth) {
  if (xPosition < screenWidth / 2) {
    gameState.leftSearchCount += 1;
    return "left";
  } else {
    gameState.rightSearchCount += 1;
    return "right";
  }
}
```

## 좌측 탐색 부족 시 조절 예시

```javascript
function adjustNeglectTraining(leftCount, rightCount) {
  if (leftCount < rightCount * 0.5) {
    return {
      message: "다음 회기에는 왼쪽 화면 탐색 과제를 늘립니다.",
      increaseLeftTargets: true
    };
  }

  return {
    message: "좌우 탐색이 비교적 균형적입니다.",
    increaseLeftTargets: false
  };
}
```

---

# 13. 점수 계산 방식

```javascript
function calculateScore(result) {
  let score = 0;

  score += result.correctCount * 10;
  score -= result.wrongCount * 5;
  score -= result.hintCount * 3;

  const timeBonus = Math.max(0, 30 - result.averageReactionTime);
  score += timeBonus;

  if (score < 0) score = 0;

  return Math.round(score);
}
```

---

# 14. 결과 리포트 생성

게임 종료 후 자동으로 결과 문장을 생성한다.

```javascript
function generateReport(result) {
  return `
${result.userName}님의 오늘 훈련 결과입니다.

총 ${result.totalItems}개 과제 중 ${result.correctCount}개를 정확히 수행하였습니다.
정답률은 ${Math.round(result.accuracy * 100)}%입니다.
평균 반응시간은 ${result.averageReactionTime.toFixed(1)}초입니다.
힌트는 총 ${result.hintCount}회 사용하였습니다.

다음 회기 권장 난이도는 ${result.nextDifficulty}단계입니다.
`;
}
```

---

# 15. 치료적 피드백 문장 예시

```javascript
function generateTherapeuticFeedback(result) {
  if (result.accuracy >= 0.8) {
    return "목표 물건을 정확하게 기억하고 선택하는 능력이 양호하게 나타났습니다.";
  }

  if (result.accuracy >= 0.6) {
    return "일부 물건을 정확하게 선택하였으나, 기억 유지와 주의 집중이 추가로 필요합니다.";
  }

  return "목표 물건을 기억하고 선택하는 과정에서 어려움이 나타났습니다. 다음 회기에는 물건 수를 줄이고 힌트를 제공하는 방식으로 진행하는 것이 적절합니다.";
}
```

---

# 16. AI 피드백 확장 기능

ChatGPT API 또는 Gemini API를 사용할 경우 다음 프롬프트를 사용한다.

```txt
너는 작업치료 재활게임의 치료 피드백을 작성하는 보조 AI이다.

다음 수행 데이터를 바탕으로 뇌졸중 환자에게 제공할 회기별 피드백을 작성하라.

조건:
1. 과장된 표현을 사용하지 않는다.
2. 의학적 진단을 새로 내리지 않는다.
3. 수행 결과를 바탕으로 관찰 가능한 내용만 작성한다.
4. 다음 회기 난이도 조절 제안을 포함한다.
5. 보호자와 치료자가 이해하기 쉬운 문장으로 작성한다.

수행 데이터:
- 정답률: {{accuracy}}
- 평균 반응시간: {{averageReactionTime}}
- 힌트 사용 횟수: {{hintCount}}
- 좌측 탐색 횟수: {{leftSearchCount}}
- 우측 탐색 횟수: {{rightSearchCount}}
- 피로도: {{fatigueLevel}}
- 현재 난이도: {{currentDifficulty}}
- 다음 권장 난이도: {{nextDifficulty}}
```

---

# 17. 화면 디자인 요구사항

## 17.1 접근성

뇌졸중 환자가 사용할 수 있도록 다음 조건을 반영한다.

1. 글씨 크기는 크게 설정한다.
2. 버튼 크기를 크게 만든다.
3. 색 대비를 높인다.
4. 제한시간은 끄고 켤 수 있게 한다.
5. 힌트 기능을 제공한다.
6. 한 화면에 너무 많은 정보를 넣지 않는다.
7. 성공/실패 피드백은 시각적·청각적으로 제공한다.

---

## 17.2 기본 디자인

| 요소 | 요구사항 |
|---|---|
| 배경 | 밝고 단순한 색상 |
| 버튼 | 크고 둥근 버튼 |
| 글씨 | 최소 20px 이상 |
| 물건 이미지 | 최소 80px 이상 |
| 성공 표시 | 초록색 테두리 |
| 실패 표시 | 빨간색 테두리 |
| 힌트 표시 | 노란색 강조 |
| 결과 화면 | 표와 문장 함께 제공 |

---

# 18. HTML 기본 구조 요구사항

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI 장보기 재활게임</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <main id="app">
    <section id="start-screen" class="screen active"></section>
    <section id="memory-screen" class="screen"></section>
    <section id="shopping-screen" class="screen"></section>
    <section id="organize-screen" class="screen"></section>
    <section id="result-screen" class="screen"></section>
  </main>

  <script src="data.js"></script>
  <script src="aiDifficulty.js"></script>
  <script src="report.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

---

# 19. CSS 기본 요구사항

```css
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f7f7f7;
  color: #222;
}

.screen {
  display: none;
  min-height: 100vh;
  padding: 32px;
  box-sizing: border-box;
}

.screen.active {
  display: block;
}

button {
  font-size: 22px;
  padding: 16px 28px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
}

.item-card {
  width: 120px;
  height: 140px;
  font-size: 20px;
  border: 3px solid #ddd;
  border-radius: 16px;
  background: white;
}

.item-card.correct {
  border-color: green;
}

.item-card.wrong {
  border-color: red;
}
```

---

# 20. JavaScript 주요 함수 목록

반드시 다음 함수를 구현한다.

```javascript
function initGame() {}
function startGame() {}
function setDifficulty(level) {}
function generateTargetItems() {}
function showMemoryScreen() {}
function showShoppingScreen() {}
function selectItem(itemId, xPosition) {}
function checkAnswer(itemId) {}
function showOrganizeScreen() {}
function handleDragStart(event) {}
function handleDrop(event) {}
function calculateAccuracy() {}
function calculateAverageReactionTime() {}
function adjustDifficulty(result) {}
function saveSessionResult(result) {}
function loadSessionHistory() {}
function generateReport(result) {}
function showResultScreen() {}
function resetGame() {}
```

---

# 21. localStorage 저장 형식

```javascript
const sessionResult = {
  userName: "대상자1",
  date: "2026-06-02",
  difficulty: 2,
  totalItems: 3,
  correctCount: 2,
  wrongCount: 1,
  accuracy: 0.67,
  averageReactionTime: 5.4,
  hintCount: 1,
  leftSearchCount: 2,
  rightSearchCount: 4,
  fatigueLevel: 2,
  nextDifficulty: 2,
  score: 72
};

localStorage.setItem("rehabGameResults", JSON.stringify([sessionResult]));
```

---

# 22. 회기별 결과 그래프

Chart.js를 사용하여 다음 그래프를 만든다.

1. 회기별 정답률 변화
2. 회기별 평균 반응시간 변화
3. 회기별 난이도 변화
4. 회기별 힌트 사용 횟수 변화

---

# 23. 치료자용 결과 해석 기준

| 결과 | 해석 |
|---|---|
| 정답률 증가 | 기억력 및 주의력 향상 가능성 |
| 반응시간 감소 | 처리속도 및 시각탐색 능력 향상 가능성 |
| 힌트 사용 감소 | 독립적 과제 수행 능력 향상 가능성 |
| 좌우 탐색 균형 향상 | 시각탐색 범위 개선 가능성 |
| 난이도 상승 유지 | 과제 수행 능력 향상 가능성 |

주의: 본 게임 결과는 임상적 진단을 대체하지 않는다.  
치료자는 표준화 평가도구 결과와 함께 참고자료로 활용한다.

---

# 24. 논문과 연결할 평가도구

| 평가 영역 | 평가도구 |
|---|---|
| 전반적 인지기능 | MMSE, MoCA |
| 주의력 | TMT-A |
| 실행기능 | TMT-B |
| 작업기억 | Digit Span |
| 일상생활 수행 | K-MBI, MBI |
| 주관적 수행 만족도 | COPM |
| 사용성 | SUS, 만족도 설문 |

---

# 25. 논문용 중재 설명

본 게임은 뇌졸중 환자의 인지기능과 상지기능을 함께 훈련하기 위한 AI 기반 일상생활형 재활게임이다.  
대상자는 화면에 제시된 구매 목록을 기억한 뒤, 마트 또는 주방 화면에서 필요한 물건을 선택하고 알맞은 위치에 정리한다.  
게임은 정답률, 평균 반응시간, 힌트 사용 횟수, 좌우 탐색 비율을 분석하여 다음 회기의 난이도를 자동으로 조절한다.  
이를 통해 주의력, 기억력, 실행기능, 시각탐색 능력 및 일상생활 과제 수행 능력 향상을 목표로 한다.

---

# 26. 개발 시 주의사항

1. 의학적 진단을 내리는 기능을 넣지 않는다.
2. 게임 결과를 치료 효과로 단정하지 않는다.
3. 피드백은 관찰 가능한 수행 결과 중심으로 작성한다.
4. 대상자가 실패감을 느끼지 않도록 부드러운 문장을 사용한다.
5. 난이도는 급격히 올리지 않는다.
6. 피로도 체크 기능을 포함한다.
7. 보호자 또는 치료자가 옆에서 사용할 수 있는 화면 구성을 만든다.

---

# 27. AI 코딩툴에 넣을 최종 프롬프트

아래 프롬프트를 Claude Code, Cursor, ChatGPT, Copilot 등에 입력하여 게임 제작을 시작한다.

```txt
너는 작업치료 재활게임을 개발하는 풀스택 개발자이다.

JavaScript, HTML, CSS만 사용해서 브라우저에서 실행 가능한 
AI 기반 뇌졸중 환자용 장보기·주방 정리 재활게임을 만들어라.

게임 목적:
- 뇌졸중 환자의 기억력, 주의력, 실행기능, 시각탐색 능력, 상지 움직임을 훈련한다.
- 장보기, 냉장고 정리, 약 복용 준비 등 일상생활 과제를 게임으로 구성한다.
- 정답률, 반응시간, 힌트 사용 횟수, 좌우 탐색 비율을 분석하여 난이도를 자동 조절한다.

필수 화면:
1. 시작 화면
2. 구매 목록 기억 화면
3. 물건 찾기 화면
4. 주방 정리 화면
5. 결과 리포트 화면
6. 회기별 기록 화면

필수 기능:
1. 대상자 이름 입력
2. 난이도 선택
3. 난이도별 물건 개수 조절
4. 구매 목록 일정 시간 제시
5. 물건 선택 정답/오답 판정
6. 드래그 앤 드롭 정리 과제
7. 정답률 계산
8. 평균 반응시간 계산
9. 힌트 사용 횟수 저장
10. 좌우 탐색 횟수 저장
11. 피로도 입력
12. 다음 회기 난이도 자동 추천
13. localStorage에 회기 결과 저장
14. 결과 리포트 자동 생성
15. 회기별 결과 표 출력

파일 구조:
- index.html
- style.css
- data.js
- aiDifficulty.js
- report.js
- app.js
- README.md

디자인 조건:
- 글씨와 버튼을 크게 만든다.
- 뇌졸중 환자가 사용하기 쉽게 단순한 화면으로 구성한다.
- 색 대비를 높인다.
- 성공/실패 피드백을 명확하게 제공한다.
- 제한시간은 선택적으로 적용한다.
- 힌트 버튼을 제공한다.

주의사항:
- 의학적 진단 기능은 넣지 않는다.
- 치료 효과를 단정하는 문장은 사용하지 않는다.
- 결과는 수행 기록과 참고자료로 제시한다.
- 모든 코드는 주석을 포함한다.
- 외부 서버 없이 로컬 브라우저에서 실행 가능하게 만든다.

먼저 전체 파일 구조를 만들고, 각 파일의 전체 코드를 작성하라.
```

---

# 28. 개발 순서

## 1단계: 기본 게임 완성

- HTML 화면 구성
- CSS 디자인
- JavaScript 게임 로직
- 클릭 기반 물건 선택
- 드래그 앤 드롭 정리
- 결과 화면 출력

## 2단계: 데이터 저장

- localStorage 저장
- 회기별 기록 표시
- 결과 표 생성
- 정답률 변화 확인

## 3단계: AI 난이도 조절

- 정답률 기반 난이도 조절
- 반응시간 기반 난이도 조절
- 힌트 사용 기반 난이도 조절
- 좌우 탐색 기반 과제 배치 조절

## 4단계: AI 도구 확장

- MediaPipe 손동작 인식
- TensorFlow.js MoveNet 팔 움직임 분석
- ChatGPT API 또는 Gemini API 피드백 문장 생성
- Chart.js 그래프 시각화

---

# 29. README.md에 들어갈 소개 문장

```md
# AI Daily Shopping Rehab Game

AI Daily Shopping Rehab Game은 뇌졸중 환자의 인지기능과 상지기능 훈련을 목적으로 제작된 JavaScript 기반 웹 재활게임입니다.

대상자는 구매 목록을 기억하고, 화면 속 물건을 찾고, 알맞은 위치에 정리하는 과제를 수행합니다.  
게임은 정답률, 반응시간, 힌트 사용 횟수, 좌우 탐색 비율을 기록하고, 수행 결과에 따라 다음 회기의 난이도를 자동으로 조절합니다.

본 게임은 작업치료 기반의 일상생활 과제를 활용하며, 기억력, 주의력, 실행기능, 시각탐색 능력 및 상지 움직임 훈련을 목표로 합니다.
```

---

# 30. 최종 구현 방향 요약

이 게임은 처음에는 **클릭 기반 JavaScript 웹게임**으로 구현한다.  
이후 MediaPipe와 TensorFlow.js를 활용하여 손동작 및 팔 움직임 인식 기능을 추가한다.  
게임은 수행 데이터를 저장하고 분석하여 대상자의 정답률, 반응시간, 힌트 사용, 좌우 탐색 비율을 확인한다.  
AI 난이도 조절 기능을 통해 대상자의 수행 수준에 맞는 과제를 제공하며, 치료자는 회기별 결과를 참고하여 중재 계획을 조정할 수 있다.

