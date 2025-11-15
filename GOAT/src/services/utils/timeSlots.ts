/**
 * 시간대 관련 유틸리티 함수
 */

/**
 * 기본 운영 시간대 생성 (16:00 ~ 익일 04:00, 30분 간격)
 */
export function generateDefaultTimeSlots(): string[] {
  const slots: string[] = [];
  
  // 16:00 ~ 23:30
  for (let hour = 16; hour < 24; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  
  // 00:00 ~ 04:00
  for (let hour = 0; hour <= 4; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 4) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  
  return slots;
}

/**
 * 날짜 문자열 배열 생성 (오늘부터 N일)
 */
export function generateDateRange(startDate: Date, days: number): string[] {
  const dates: string[] = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    // ✅ 로컬 날짜로 변환 (UTC 아님!)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  
  return dates;
}

/**
 * 현재 시간 기준으로 가장 가까운 다음 예약 가능 시간 찾기
 * @param currentTime 현재 시간 (HH:MM 형식)
 * @param availableSlots 예약 가능한 시간대 배열
 * @returns 가장 가까운 다음 시간대 또는 null
 */
export function findNextAvailableTime(currentTime: string, availableSlots: string[]): string | null {
  const [currentHour, currentMinute] = currentTime.split(':').map(Number);
  let currentTotalMinutes = currentHour * 60 + currentMinute;
  
  // ✅ 현재 시간도 익일 새벽 시간대면 다음날로 계산 (00:00 ~ 04:00)
  if (currentHour >= 0 && currentHour <= 4) {
    currentTotalMinutes += 24 * 60;
  }
  
  // 사용 가능한 시간대를 분으로 변환하여 정렬
  const slotsWithMinutes = availableSlots.map(slot => {
    const [hour, minute] = slot.split(':').map(Number);
    let totalMinutes = hour * 60 + minute;
    
    // 익일 새벽 시간대 처리 (00:00 ~ 04:00)
    if (hour >= 0 && hour <= 4) {
      totalMinutes += 24 * 60; // 다음날로 계산
    }
    
    return { slot, totalMinutes };
  }).sort((a, b) => a.totalMinutes - b.totalMinutes);
  
  // 현재 시간보다 나중인 가장 가까운 시간 찾기
  for (const { slot, totalMinutes } of slotsWithMinutes) {
    if (totalMinutes > currentTotalMinutes) {
      return slot;
    }
  }
  
  // 오늘 가능한 시간이 없으면 null 반환 (호출하는 쪽에서 내일로 처리)
  return null;
}

/**
 * 현재 시각을 HH:MM 형식으로 반환
 */
export function getCurrentTime(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * 날짜와 시간이 현재 시각 이후인지 확인
 */
export function isFutureDateTime(date: string, time: string): boolean {
  const now = new Date();
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  
  const targetDate = new Date(year, month - 1, day, hour, minute);
  
  return targetDate > now;
}