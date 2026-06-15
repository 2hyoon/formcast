# UI 디자인 가이드

## 디자인 원칙
1. 도구처럼 보여야 한다. 마케팅 페이지가 아니라 매일 쓰는 개발자 대시보드.
2. 고밀도·좌측 정렬. 여백으로 채우지 말고 정보를 보여준다.
3. 입력(스키마)과 결과(폼)의 인과를 한눈에 — 좌우 분할로 즉시 비교 가능하게.

## AI 슬롭 안티패턴 — 하지 마라
| 금지 사항 | 이유 |
|-----------|------|
| backdrop-filter: blur() | glass morphism은 AI 템플릿의 가장 흔한 징후 |
| gradient-text (배경 그라데이션 텍스트) | AI가 만든 SaaS 랜딩의 1번 특징 |
| "Powered by AI" 배지 | 기능이 아니라 장식. 사용자에게 가치 없음 |
| box-shadow 글로우 애니메이션 | 네온 글로우 = AI 슬롭 |
| 보라/인디고 브랜드 색상 | "AI = 보라색" 클리셰 |
| 모든 카드에 동일한 rounded-2xl | 균일한 둥근 모서리는 템플릿 느낌 |
| 배경 gradient orb (blur-3xl 원형) | 모든 AI 랜딩 페이지에 있는 장식 |

## 색상
### 배경
| 용도 | 값 |
|------|------|
| 페이지 | #0a0a0a |
| 패널/카드 | #141414 |
| 입력 필드 | #0f0f0f |

### 텍스트
| 용도 | 값 |
|------|------|
| 주 텍스트 | text-neutral-100 |
| 본문 | text-neutral-300 |
| 보조/라벨 | text-neutral-400 |
| 비활성/힌트 | text-neutral-500 |

### 데이터/시맨틱 색상
| 용도 | 값 |
|------|------|
| 유효/성공 | #22c55e |
| 에러/검증 실패 | #ef4444 |
| 중립/경계선 | #262626 |

## 컴포넌트
### 패널 (좌/우)
```
rounded-lg bg-[#141414] border border-neutral-800 p-4
```

### 버튼
```
Primary (복사 등): rounded-md bg-white text-black hover:bg-neutral-200 text-sm px-3 py-1.5
Preset (프리셋):    rounded-md border border-neutral-800 text-neutral-300 hover:border-neutral-600 text-sm px-3 py-1.5
```

### 입력 필드
```
rounded-md bg-[#0f0f0f] border border-neutral-800 px-3 py-2 text-sm
focus: border-neutral-600
에러: border-[#ef4444]
```

### 에러 메시지
```
text-xs text-[#ef4444] mt-1
```

## 레이아웃
- 전체: 좌우 2분할 (왼쪽 스키마 / 오른쪽 폼). 데스크탑 기준 50:50.
- 정렬: 좌측 정렬 기본. 중앙 정렬 금지.
- 간격: 필드 간 space-y-3, 섹션 간 space-y-6.
- 코드(스키마) 영역은 monospace (font-mono).

## 타이포그래피
| 용도 | 스타일 |
|------|--------|
| 앱 제목 | text-base font-semibold text-neutral-100 |
| 패널 헤더 | text-xs font-medium uppercase tracking-wide text-neutral-500 |
| 필드 라벨 | text-sm text-neutral-300 |
| 본문/힌트 | text-xs text-neutral-500 |

## 애니메이션
- 허용: 없음 (즉각 반응이 핵심인 도구). 상태 전환은 즉시.
- 그 외 모든 글로우·플로팅·페이드 애니메이션 금지.

## 아이콘
- SVG 인라인, strokeWidth 1.5.
- 아이콘 컨테이너(둥근 배경 박스)로 감싸지 않는다.
