/**
 * Settings Service - 매장 예약 설정 관리
 */

import { RestaurantSettings } from "../../types";
import { USE_MOCK_API, STORAGE_KEYS } from "../config";
import { apiClient } from "../apiClient";
import {
  generateDateRange,
  generateDefaultTimeSlots,
} from "../utils/timeSlots";

// ============================================
// Mock API (로컬스토리지 사용)
// ============================================

const mockSettingsService = {
  /**
   * 매장 설정 조회 (자동으로 날짜 업데이트)
   */
  async getByRestaurantId(
    restaurantId: number,
  ): Promise<RestaurantSettings> {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const allSettings: RestaurantSettings[] = saved
      ? JSON.parse(saved)
      : [];

    const settings = allSettings.find(
      (s) => s.restaurantId === restaurantId,
    );

    // 설정이 없으면 기본값 반환
    if (!settings) {
      return {
        restaurantId,
        unavailableDates: [],
        dailyCapacity: {},
        availableTimeSlots: {},
      };
    }

    // ✨ 날짜 자동 업데이트: 오늘부터 14일간 유지
    const today = new Date();
    const requiredDates = generateDateRange(today, 14); // 오늘부터 14일
    const defaultTimeSlots = generateDefaultTimeSlots();

    const currentTimeSlots = settings.availableTimeSlots || {};
    const updatedTimeSlots: { [date: string]: string[] } = {};

    // 1️⃣ 필요한 날짜만 유지 (지난 날짜 자동 제거)
    requiredDates.forEach((date) => {
      // 기존 설정이 있으면 유지, 없으면 기본값 사용
      updatedTimeSlots[date] = currentTimeSlots[date] || [
        ...defaultTimeSlots,
      ];
    });

    // 2️⃣ 업데이트된 설정 저장 (자동으로 DB 동기화)
    const updatedSettings = {
      ...settings,
      availableTimeSlots: updatedTimeSlots,
    };

    // 로컬스토리지에 즉시 반영
    const index = allSettings.findIndex(
      (s) => s.restaurantId === restaurantId,
    );
    if (index !== -1) {
      allSettings[index] = updatedSettings;
      localStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(allSettings),
      );
    }

    return updatedSettings;
  },

  /**
   * 매장 설정 업데이트
   */
  async update(
    restaurantId: number,
    updates: Partial<Omit<RestaurantSettings, "restaurantId">>,
  ): Promise<RestaurantSettings> {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const allSettings: RestaurantSettings[] = saved
      ? JSON.parse(saved)
      : [];

    const index = allSettings.findIndex(
      (s) => s.restaurantId === restaurantId,
    );

    let updatedSettings: RestaurantSettings;

    if (index === -1) {
      // 설정이 없으면 새로 생성
      updatedSettings = {
        restaurantId,
        unavailableDates: updates.unavailableDates || [],
        dailyCapacity: updates.dailyCapacity || {},
        availableTimeSlots: updates.availableTimeSlots || {},
      };
      allSettings.push(updatedSettings);
    } else {
      // 기존 설정 업데이트
      updatedSettings = {
        ...allSettings[index],
        ...updates,
      };
      allSettings[index] = updatedSettings;
    }

    localStorage.setItem(
      STORAGE_KEYS.SETTINGS,
      JSON.stringify(allSettings),
    );
    return updatedSettings;
  },

  /**
   * 특정 날짜 예약 가능 상태 토글
   */
  async toggleDateAvailability(
    restaurantId: number,
    date: string,
  ): Promise<RestaurantSettings> {
    const settings = await this.getByRestaurantId(restaurantId);

    const unavailableDates = settings.unavailableDates || [];
    const index = unavailableDates.indexOf(date);

    let newUnavailableDates: string[];

    if (index === -1) {
      // 현재 가능 → 불가능으로 변경
      newUnavailableDates = [...unavailableDates, date];
    } else {
      // 현재 불가능 → 가능으로 변경
      newUnavailableDates = unavailableDates.filter(
        (d) => d !== date,
      );
    }

    return this.update(restaurantId, {
      unavailableDates: newUnavailableDates,
    });
  },

  /**
   * 특정 날짜 수용 인원 설정
   */
  async setDailyCapacity(
    restaurantId: number,
    date: string,
    capacity: number,
  ): Promise<RestaurantSettings> {
    const settings = await this.getByRestaurantId(restaurantId);

    return this.update(restaurantId, {
      dailyCapacity: {
        ...settings.dailyCapacity,
        [date]: capacity,
      },
    });
  },

  /**
   * 특정 날짜가 예약 가능한지 확인
   */
  async isDateAvailable(
    restaurantId: number,
    date: string,
  ): Promise<boolean> {
    const settings = await this.getByRestaurantId(restaurantId);
    return !(settings.unavailableDates || []).includes(date);
  },
};

// ============================================
// Real API (백엔드 서버 호출)
// ============================================

const realSettingsService = {
  async getByRestaurantId(
    restaurantId: number,
  ): Promise<RestaurantSettings> {
    return apiClient<RestaurantSettings>(
      `/settings/restaurant/${restaurantId}`,
    );
  },

  async update(
    restaurantId: number,
    updates: Partial<Omit<RestaurantSettings, "restaurantId">>,
  ): Promise<RestaurantSettings> {
    return apiClient<RestaurantSettings>(
      `/settings/restaurant/${restaurantId}`,
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      },
    );
  },

  async toggleDateAvailability(
    restaurantId: number,
    date: string,
  ): Promise<RestaurantSettings> {
    return apiClient<RestaurantSettings>(
      `/settings/restaurant/${restaurantId}/toggle-date`,
      {
        method: "POST",
        body: JSON.stringify({ date }),
      },
    );
  },

  async setDailyCapacity(
    restaurantId: number,
    date: string,
    capacity: number,
  ): Promise<RestaurantSettings> {
    return apiClient<RestaurantSettings>(
      `/settings/restaurant/${restaurantId}/daily-capacity`,
      {
        method: "POST",
        body: JSON.stringify({ date, capacity }),
      },
    );
  },

  async isDateAvailable(
    restaurantId: number,
    date: string,
  ): Promise<boolean> {
    const response = await apiClient<{ available: boolean }>(
      `/settings/restaurant/${restaurantId}/date/${date}/available`,
    );
    return response.available;
  },
};

// ============================================
// Export - Mock/Real 자동 선택
// ============================================

export const settingsService = USE_MOCK_API
  ? mockSettingsService
  : realSettingsService;