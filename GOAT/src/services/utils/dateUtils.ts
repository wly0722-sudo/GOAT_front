/**
 * Date Utilities - 날짜 관련 공통 유틸리티 함수
 */

/**
 * Date 객체를 YYYY-MM-DD 형식으로 변환
 * @param date - 변환할 Date 객체
 * @returns YYYY-MM-DD 형식의 문자열 (예: "2025-11-14")
 */
export const formatDateKey = (date: Date | undefined): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * YYYY-MM-DD 형식의 문자열을 한글 날짜로 변환
 * @param dateString - YYYY-MM-DD 형식의 날짜 문자열
 * @returns 한글 형식 날짜 (예: "2025년 11월 14일 (목)")
 */
export const formatKoreanDate = (dateString: string): string => {
  // 로컬 날짜 파싱 (UTC 타임존 문제 해결)
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const dayOfWeek = [
    "일",
    "월",
    "화",
    "수",
    "목",
    "금",
    "토",
  ][date.getDay()];
  
  return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
};

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 * @returns 오늘 날짜 문자열
 */
export const getTodayDateKey = (): string => {
  return formatDateKey(new Date());
};

/**
 * 특정 날짜가 오늘인지 확인
 * @param dateString - YYYY-MM-DD 형식의 날짜 문자열
 * @returns 오늘이면 true, 아니면 false
 */
export const isToday = (dateString: string): boolean => {
  return dateString === getTodayDateKey();
};

/**
 * 특정 날짜가 과거인지 확인
 * @param dateString - YYYY-MM-DD 형식의 날짜 문자열
 * @returns 과거면 true, 아니면 false
 */
export const isPast = (dateString: string): boolean => {
  const [year, month, day] = dateString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return targetDate < today;
};

/**
 * 두 날짜 문자열을 비교
 * @param date1 - YYYY-MM-DD 형식의 날짜 문자열
 * @param date2 - YYYY-MM-DD 형식의 날짜 문자열
 * @returns date1이 더 이르면 -1, 같으면 0, date1이 더 늦으면 1
 */
export const compareDateStrings = (date1: string, date2: string): number => {
  if (date1 < date2) return -1;
  if (date1 > date2) return 1;
  return 0;
};
