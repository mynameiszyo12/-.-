// data.js
// 게임에 사용되는 물건, 정리 위치, 난이도 정보를 정의합니다.
// 이미지 파일 경로 오류를 줄이기 위해 기본 버전은 이모지를 사용합니다.

const ITEM_DATA = [
  {
    id: "milk",
    name: "우유",
    emoji: "🥛",
    category: "food",
    correctZone: "fridge"
  },
  {
    id: "apple",
    name: "사과",
    emoji: "🍎",
    category: "fruit",
    correctZone: "fruitBasket"
  },
  {
    id: "egg",
    name: "계란",
    emoji: "🥚",
    category: "food",
    correctZone: "fridge"
  },
  {
    id: "bread",
    name: "빵",
    emoji: "🍞",
    category: "food",
    correctZone: "pantry"
  },
  {
    id: "medicine",
    name: "약",
    emoji: "💊",
    category: "health",
    correctZone: "medicineBox"
  },
  {
    id: "cup",
    name: "컵",
    emoji: "🥤",
    category: "kitchen",
    correctZone: "table"
  },
  {
    id: "banana",
    name: "바나나",
    emoji: "🍌",
    category: "fruit",
    correctZone: "fruitBasket"
  },
  {
    id: "fish",
    name: "생선",
    emoji: "🐟",
    category: "food",
    correctZone: "fridge"
  },
  {
    id: "soap",
    name: "비누",
    emoji: "🧼",
    category: "daily",
    correctZone: "bathroomShelf"
  },
  {
    id: "spoon",
    name: "숟가락",
    emoji: "🥄",
    category: "kitchen",
    correctZone: "drawer"
  },
  {
    id: "water",
    name: "물",
    emoji: "💧",
    category: "drink",
    correctZone: "fridge"
  },
  {
    id: "towel",
    name: "수건",
    emoji: "🧺",
    category: "daily",
    correctZone: "bathroomShelf"
  }
];

const ZONE_DATA = [
  {
    id: "fridge",
    name: "냉장고",
    emoji: "🧊"
  },
  {
    id: "fruitBasket",
    name: "과일 바구니",
    emoji: "🧺"
  },
  {
    id: "medicineBox",
    name: "약 상자",
    emoji: "🩹"
  },
  {
    id: "table",
    name: "식탁",
    emoji: "🍽️"
  },
  {
    id: "pantry",
    name: "식품 보관함",
    emoji: "🗄️"
  },
  {
    id: "bathroomShelf",
    name: "욕실 선반",
    emoji: "🧴"
  },
  {
    id: "drawer",
    name: "서랍",
    emoji: "🗃️"
  }
];

const DIFFICULTY_CONFIG = {
  1: {
    targetCount: 2,
    distractorCount: 2,
    memorySeconds: 8,
    timeLimitSeconds: 0,
    maxHints: 99
  },
  2: {
    targetCount: 3,
    distractorCount: 3,
    memorySeconds: 7,
    timeLimitSeconds: 60,
    maxHints: 99
  },
  3: {
    targetCount: 4,
    distractorCount: 4,
    memorySeconds: 6,
    timeLimitSeconds: 50,
    maxHints: 99
  },
  4: {
    targetCount: 5,
    distractorCount: 5,
    memorySeconds: 5,
    timeLimitSeconds: 40,
    maxHints: 2
  },
  5: {
    targetCount: 6,
    distractorCount: 6,
    memorySeconds: 4,
    timeLimitSeconds: 30,
    maxHints: 1
  }
};

const STORAGE_KEY = "aiShoppingRehabGameResults";

window.ITEM_DATA = ITEM_DATA;
window.ZONE_DATA = ZONE_DATA;
window.DIFFICULTY_CONFIG = DIFFICULTY_CONFIG;
window.STORAGE_KEY = STORAGE_KEY;
