# AI Daily Shopping Rehab Game

AI 기반 뇌졸중 환자용 장보기·주방 정리 재활게임입니다.

## 실행 방법

로컬에서 실행:

```bash
python -m http.server 5500
```

브라우저에서 접속:

```txt
http://localhost:5500
```

## Vercel 배포

1. 이 폴더를 GitHub repository에 업로드합니다.
2. Vercel에서 `Add New Project`를 선택합니다.
3. GitHub repository를 연결합니다.
4. Framework Preset은 `Other`로 설정합니다.
5. Build Command는 비워둡니다.
6. Output Directory는 `.` 또는 비워둡니다.
7. Deploy를 누릅니다.

## 파일 구성

```txt
index.html
style.css
data.js
aiDifficulty.js
report.js
app.js
README.md
```

## 기능

- 구매 목록 기억하기
- 물건 찾기
- 드래그 앤 드롭 주방 정리
- 정답률 계산
- 평균 반응시간 계산
- 힌트 사용 횟수 저장
- 좌우 탐색 횟수 저장
- 피로도 기록
- 다음 회기 난이도 자동 추천
- localStorage 회기 기록 저장

## 주의

본 게임은 재활훈련 보조 도구이며, 의학적 진단이나 표준화 평가를 대체하지 않습니다.
