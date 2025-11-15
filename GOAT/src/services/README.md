# Service Layer Architecture

## 📋 개요

백엔드 연동을 쉽게 하기 위한 Service Layer 패턴으로 구조화되어 있습니다.
**현재는 Mock API(로컬스토리지)**를 사용하며, 백엔드 준비 시 **`config.ts`의 플래그 하나만 변경**하면 실제 API로 전환됩니다.

## 🏗️ 디렉토리 구조

```
/services
├── config.ts                 # 환경 설정 (Mock/Real 스위칭)
├── apiClient.ts             # Fetch wrapper (에러 핸들링, 타임아웃)
├── index.ts                 # 통합 export
└── /api
    ├── restaurantService.ts # 레스토랑 CRUD
    ├── bookingService.ts    # 예약 CRUD
    └── authService.ts       # 인증 (로그인, 회원가입)
```

## 🔧 사용 방법

### 1. Service Import

```tsx
import { restaurantService, bookingService, authService } from '../services';
```

### 2. Service 사용 예시

```tsx
// 레스토랑 목록 조회
const restaurants = await restaurantService.getAll();

// 예약 생성
const booking = await bookingService.create({
  restaurantId: 1,
  guestName: '홍길동',
  // ...
});

// 로그인
const user = await authService.login(email, password);
```

### 3. Context에서 사용

Context는 Service를 통해서만 데이터를 관리합니다:

```tsx
// /context/AppContext.tsx
import { restaurantService, bookingService } from '../services';

const addBooking = async (booking) => {
  const newBooking = await bookingService.create(booking);
  setAllBookings([...prev, newBooking]);
};
```

## 🔀 Mock ↔ Real API 전환

### 현재 상태: Mock API (로컬스토리지)

```typescript
// /services/config.ts
export const USE_MOCK_API = true; // ← 현재 Mock 사용 중
```

### 백엔드 연동 시: Real API

```typescript
// /services/config.ts
export const USE_MOCK_API = false; // ← 이것만 변경!
export const API_BASE_URL = 'https://api.humunhanjan.com/api';
```

**이게 전부입니다!** 다른 코드는 수정할 필요 없음.

## 📡 API Service 상세

### RestaurantService

```typescript
// 모든 레스토랑 조회
restaurantService.getAll(): Promise<Restaurant[]>

// ID로 조회
restaurantService.getById(id): Promise<Restaurant | null>

// 레스토랑 추가
restaurantService.create(restaurant): Promise<Restaurant>

// 레스토랑 수정
restaurantService.update(id, updates): Promise<Restaurant>

// 레스토랑 삭제
restaurantService.delete(id): Promise<void>

// 검색
restaurantService.search({ cuisine, priceRange, minRating }): Promise<Restaurant[]>
```

### BookingService

```typescript
// 모든 예약 조회
bookingService.getAll(): Promise<Booking[]>

// ID로 조회
bookingService.getById(id): Promise<Booking | null>

// 레스토랑별 예약
bookingService.getByRestaurant(restaurantId): Promise<Booking[]>

// 사용자별 예약
bookingService.getByUser(userId): Promise<Booking[]>

// 확인번호로 조회
bookingService.getByConfirmationNumber(confirmationNumber): Promise<Booking | null>

// 예약 생성
bookingService.create(data): Promise<Booking>

// 예약 수정
bookingService.update(id, updates): Promise<Booking>

// 예약 삭제
bookingService.delete(id): Promise<void>

// 예약 취소/확정
bookingService.cancel(id): Promise<Booking>
bookingService.confirm(id): Promise<Booking>

// 날짜별 조회
bookingService.getByDateRange(restaurantId, startDate, endDate): Promise<Booking[]>

// 🆕 확정된 예약 총 인원 계산
bookingService.getConfirmedPartySizeByDate(restaurantId, date): Promise<number>
```

### AuthService

```typescript
// 현재 사용자
authService.getCurrentUser(): Promise<User | null>

// 로그인
authService.login(email, password): Promise<User>

// 회원가입
authService.signup({ email, password, name, ... }): Promise<User>

// 레스토랑 사장 회원가입
authService.signupRestaurantOwner({ email, password, name, phone, restaurantName }): Promise<User>

// 로그아웃
authService.logout(): Promise<void>

// 프로필 수정
authService.updateProfile(updates): Promise<User>

// 비밀번호 변경
authService.changePassword(currentPassword, newPassword): Promise<void>

// 비밀번호 재설정
authService.resetPassword(email): Promise<void>
```

## 🎯 백엔드 연동 체크리스트

백엔드를 구축한 후 다음 순서로 진행하세요:

### 1. 환경 설정
- [ ] `.env` 파일 생성
- [ ] `NEXT_PUBLIC_API_URL` 설정

### 2. Config 수정
- [ ] `/services/config.ts`에서 `USE_MOCK_API = false` 변경
- [ ] `API_BASE_URL` 설정

### 3. 백엔드 API 엔드포인트 확인
각 Service의 Real API 섹션에서 엔드포인트가 백엔드와 일치하는지 확인:

```typescript
// /services/api/bookingService.ts - Real API 섹션
const realBookingService = {
  async create(data) {
    return apiClient<Booking>('/bookings', {  // ← 이 경로가 백엔드와 일치?
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
```

### 4. 인증 토큰 관리
`/services/apiClient.ts`에서 Authorization 헤더 추가:

```typescript
export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem('authToken'); // 토큰 가져오기
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }), // 토큰 추가
      ...options.headers,
    },
  });
  // ...
}
```

### 5. 테스트
- [ ] 레스토랑 조회 테스트
- [ ] 예약 생성 테스트
- [ ] 로그인/회원가입 테스트
- [ ] 에러 처리 확인

## 🚨 에러 처리

모든 Service 호출은 `try-catch`로 감싸야 합니다:

```tsx
const handleBooking = async () => {
  try {
    await bookingService.create(bookingData);
    setShowSuccess(true);
  } catch (error) {
    console.error("예약 실패:", error);
    alert("예약 처리 중 오류가 발생했습니다.");
  }
};
```

## 💡 장점

1. **쉬운 전환**: Mock ↔ Real API 전환이 플래그 하나로 가능
2. **중앙 집중화**: API 로직이 Service에만 존재
3. **테스트 용이**: Mock Service로 프론트엔드 독립 개발 가능
4. **타입 안전성**: TypeScript로 API 응답 타입 보장
5. **에러 처리**: apiClient에서 통합 에러 핸들링

## 📝 참고사항

- **현재는 Mock API만 구현**: `USE_MOCK_API = true`
- **로컬스토리지 사용**: 브라우저에만 데이터 저장
- **Real API는 껍데기만**: 백엔드 준비 시 연결할 코드 구조만 있음
- **백엔드 구축 후**: `/services/api/*.ts` 파일의 Real API 섹션 수정 필요
