/**
 * API 설정 및 환경 구성
 */

// Mock API 사용 여부 (true: 로컬스토리지, false: 실제 백엔드)
export const USE_MOCK_API = true;

// API Base URL (백엔드 연동 시 사용)
// 브라우저 환경에서는 직접 URL을 설정하거나, 빌드 시 환경변수를 주입해야 합니다
export const API_BASE_URL = 'http://localhost:3001/api';

// Supabase URL (나중에 사용)
export const SUPABASE_URL = '';
export const SUPABASE_ANON_KEY = '';

// 로컬스토리지 키
export const STORAGE_KEYS = {
  RESTAURANTS: 'restaurants',
  BOOKINGS: 'bookings',
  CURRENT_USER: 'currentUser',
  USERS: 'users', // 모든 회원 정보 저장
  AVAILABILITY: 'availability',
  SETTINGS: 'restaurant_settings', // 매장 예약 설정
} as const;

// API 타임아웃 (ms)
export const API_TIMEOUT = 10000;