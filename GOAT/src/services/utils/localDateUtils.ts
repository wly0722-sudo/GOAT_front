/**
 * 로컬 타임존 날짜 유틸리티
 * UTC가 아닌 로컬 타임존 기준으로 날짜를 처리합니다.
 */

/**
 * 현재 날짜를 YYYY-MM-DD 형식으로 반환 (로컬 타임존)
 */
export function getTodayLocalDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Date 객체를 YYYY-MM-DD 형식으로 변환 (로컬 타임존)
 */
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 내일 날짜를 YYYY-MM-DD 형식으로 반환 (로컬 타임존)
 */
export function getTomorrowLocalDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatLocalDate(tomorrow);
}

/**
 * N일 후 날짜를 YYYY-MM-DD 형식으로 반환 (로컬 타임존)
 */
export function getDateAfterDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatLocalDate(date);
}

/**
 * 현재 시간을 HH:MM 형식으로 반환
 */
export function getCurrentTimeString(): string {
  const now = new Date();
  return now.toTimeString().substring(0, 5);
}
