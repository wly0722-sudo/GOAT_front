# 후문한잔 프로젝트 요약

> **최종 업데이트:** 2025-11-14  
> **상태:** ✅ MVP 완성 및 리팩터링 완료

---

## 🎯 프로젝트 개요

**후문한잔**은 인하대학교 후문 술집 예약을 위한 MVP 웹 애플리케이션입니다.

### 핵심 목표
- ✅ 사용자가 **3분 이내**에 테이블을 찾고 예약
- ✅ 실시간 예약 및 날짜별 예약 지원
- ✅ 매장 사장님을 위한 예약 관리 대시보드

---

## 📚 주요 문서

### 개발 관련
- **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - 전체 개발 가이드 (필수)
  - 프로젝트 구조
  - 핵심 기능 설명
  - API 서비스 레이어
  - 데이터 모델
  - 개발 참고사항

### 리팩터링 기록
- **[REFACTORING_2025_11_14.md](./REFACTORING_2025_11_14.md)** - 최근 리팩터링 상세 내역
  - 코드 정리 및 최적화
  - 문서 통합
  - 유틸리티 함수 개선

### 기타
- **[README.md](./README.md)** - 프로젝트 소개
- **[Attributions.md](./Attributions.md)** - 라이선스 및 크레딧

---

## 🚀 빠른 시작

### 1. 프로젝트 실행
```bash
npm install
npm run dev
```

### 2. 테스트 계정

#### 소비자 계정
```
ID: test
PW: test123
```

#### 매장 계정
```
ID: restaurant1
PW: rest123
```

### 3. 주요 기능 테스트

1. **실시간 예약**
   - 소비자로 로그인
   - "실시간 예약" 탭 선택
   - 매장 선택 후 즉시 예약

2. **날짜별 예약**
   - "날짜별 예약" 탭 선택
   - 원하는 날짜와 시간 선택
   - 예약 신청

3. **예약 관리**
   - 매장으로 로그인
   - "예약 관리" 탭에서 승인/거절

---

## 🏗️ 기술 스택

### Frontend
- React 18 + TypeScript
- Tailwind CSS v4.0
- Lucide React (Icons)
- Sonner (Toast Notifications)

### State Management
- React Context API
- Local Storage (Mock Data)

### Architecture
- Service Layer Pattern
- Mock/Real API 전환 가능

---

## 📁 프로젝트 구조

```
/
├── components/              # React 컴포넌트
│   ├── ConsumerAccount.tsx  # 고객 화면
│   ├── RestaurantAccount.tsx # 매장 화면
│   ├── Login.tsx           # 로그인
│   ├── Signup.tsx          # 회원가입
│   └── ...
├── context/
│   └── AppContext.tsx      # 전역 상태 관리
├── services/
│   ├── api/                # API 서비스
│   │   ├── authService.ts
│   │   ├── bookingService.ts
│   │   ├── restaurantService.ts
│   │   └── settingsService.ts
│   └── utils/              # 유틸리티 함수
│       ├── dateUtils.ts
│       ├── localDateUtils.ts
│       └── timeSlots.ts
├── types/
│   └── index.ts            # TypeScript 타입
└── styles/
    └── globals.css         # 글로벌 스타일
```

---

## ✨ 핵심 기능

### 1. 실시간 예약
- 예약 시점에서 가장 가까운 시간에 자동 배정
- capacity가 0인 매장 자동 필터링
- 16:00 ~ 다음날 04:00 운영

### 2. 날짜별 예약
- 최대 10일 후까지 예약 가능
- 날짜별 예약 가능/불가능 설정
- 날짜별 수용 인원 조정

### 3. 예약 승인 시스템
- 모든 예약 pending 상태로 시작
- 매장 사장이 승인/거절 처리
- 상태별 자동 분류 (upcoming/past)

### 4. 매장 관리
- 운영 시간 설정
- 날짜별 예약 차단
- 좌석 수 조정 (5명 단위)

---

## 🔧 개발 참고사항

### 타임존 처리
```typescript
// ❌ 잘못된 예
const today = new Date().toISOString().split('T')[0]; // UTC

// ✅ 올바른 예
import { getTodayLocalDate } from "./services";
const today = getTodayLocalDate(); // 로컬 타임존
```

### API 전환
```typescript
// /services/config.ts
export const USE_MOCK_API = true; // false로 변경 시 Real API
```

### 데이터 초기화
```typescript
// DevTools 컴포넌트 사용 또는
localStorage.clear();
window.location.reload();
```

---

## 📊 최근 업데이트

### 2025-11-14
- ✅ 코드베이스 리팩터링 완료
- ✅ 문서 통합 (14개 → 4개)
- ✅ 유틸리티 함수 개선
- ✅ Login 컴포넌트 간소화 (82 lines 감소)
- ✅ 중복 코드 제거 (145+ lines 감소)

### 이전 업데이트
- ✅ 특별 요청 기능 제거
- ✅ 예약 수정 기능 제거
- ✅ 좌석 수 5명 단위 조정
- ✅ Capacity 0 매장 필터링
- ✅ 날짜별 예약 가능 여부
- ✅ 예약 거절 시스템
- ✅ 타임존 버그 수정

---

## 🐛 알려진 이슈

현재 알려진 이슈 없음 ✅

---

## 🚀 향후 계획

### 단기 (1-2주)
- [ ] Custom Hooks 도입
- [ ] Error Boundary 추가
- [ ] Loading States 개선

### 중기 (1개월)
- [ ] 컴포넌트 분리
- [ ] Unit Tests 작성
- [ ] Storybook 도입

### 장기 (2-3개월)
- [ ] 백엔드 연동
- [ ] 결제 시스템
- [ ] 이메일/SMS 알림
- [ ] 모바일 앱

---

