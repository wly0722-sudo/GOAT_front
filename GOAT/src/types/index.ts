// 공통 타입 정의

export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  reviews?: number;
  address: string;
  distance?: string;
  hours: string | {
    weekday: string;
    weekend: string;
    sunday: string;
  };
  priceRange: string;
  capacity: number;
  image: string;
  phone?: string;
  website?: string;
  description?: string;
}

export interface Booking {
  id: string;
  userId: string; // 🆕 예약한 사용자 ID
  restaurantId: number;
  restaurantName: string;
  date: string;
  time: string;
  partySize: number;
  guestName: string;
  guestPhone: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'rejected'; // ✅ rejected 추가
  mode: 'instant' | 'scheduled';
  createdAt: string;
  confirmationNumber?: string;
}

export interface User {
  id: string;
  userId: string; // 로그인용 아이디
  email: string;
  name: string;
  phone?: string;
  role: 'customer' | 'restaurant_owner';
  restaurantId?: number; // 매장 사장인 경우
  createdAt?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface RestaurantAvailability {
  [restaurantId: number]: {
    [date: string]: string[];
  };
}

// 매장 예약 설정 (날짜별 수용 인원 및 휴무일)
export interface RestaurantSettings {
  restaurantId: number;
  unavailableDates: string[]; // 예약 불가 날짜 (휴무일)
  dailyCapacity: {
    [date: string]: number; // 날짜별 수용 가능 인원 (설정하지 않으면 매장 기본 capacity 사용)
  };
  availableTimeSlots?: {
    [date: string]: string[]; // 날짜별 예약 가능 시간대 (설정하지 않으면 기본 시간대 사용)
  };
}