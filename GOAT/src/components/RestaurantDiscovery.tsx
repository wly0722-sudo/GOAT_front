import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { Calendar } from "./ui/calendar";
import {
  Star,
  Clock,
  Users,
  MapPin,
  CalendarIcon,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useApp } from "../context/AppContext";
import { settingsService, formatDateKey, generateDefaultTimeSlots, getCurrentTime, findNextAvailableTime } from "../services";
import { RestaurantSettings } from "../types";

interface RestaurantDiscoveryProps {
  onRestaurantSelect?: (
    restaurantId: number,
    bookingInfo: {
      mode: "instant" | "scheduled";
      date?: Date;
      time?: string;
      partySize: string;
    },
  ) => void;
}

export function RestaurantDiscovery({
  onRestaurantSelect,
}: RestaurantDiscoveryProps) {
  // Context에서 레스토랑 데이터 가져오기
  const { restaurants, bookings, getAvailableCapacity } = useApp();
  
  const [selectedDate, setSelectedDate] = useState<
    Date | undefined
  >(undefined);

  // 🆕 매장별 설정 데이터 저장
  const [restaurantSettings, setRestaurantSettings] = useState<{
    [restaurantId: number]: RestaurantSettings;
  }>({});

  // 🆕 매장별 남은 수용 인원 저장 (실시간 업데이트)
  const [availableCapacities, setAvailableCapacities] = useState<{
    [key: string]: number; // key: "restaurantId-date"
  }>({});

  // 🆕 매장 설정 데이터 로드
  useEffect(() => {
    const loadSettings = async () => {
      const settingsMap: { [restaurantId: number]: RestaurantSettings } = {};
      
      for (const restaurant of restaurants) {
        try {
          const settings = await settingsService.getByRestaurantId(restaurant.id);
          settingsMap[restaurant.id] = settings;
        } catch (error) {
          console.error(`매장 ${restaurant.id} 설정 로드 실패:`, error);
        }
      }
      
      setRestaurantSettings(settingsMap);
    };
    
    loadSettings();
  }, [restaurants]);

  // 🆕 예약 변경 시 남은 수용 인원 재계산 (실시간 동기화)
  useEffect(() => {
    const loadCapacities = async () => {
      const capacitiesMap: { [key: string]: number } = {};
      
      for (const restaurant of restaurants) {
        // 오늘 날짜 계산 (실시간 예약용)
        const today = formatDateKey(new Date());
        const keyToday = `${restaurant.id}-${today}`;
        
        try {
          const available = await getAvailableCapacity(restaurant.id, today);
          capacitiesMap[keyToday] = available;
        } catch (error) {
          console.error(`매장 ${restaurant.id} 수용 인원 계산 실패:`, error);
        }
        
        // 선택된 날짜가 있으면 해당 날짜도 계산
        if (selectedDate) {
          const dateKey = formatDateKey(selectedDate);
          const keySelected = `${restaurant.id}-${dateKey}`;
          
          try {
            const available = await getAvailableCapacity(restaurant.id, dateKey);
            capacitiesMap[keySelected] = available;
          } catch (error) {
            console.error(`매장 ${restaurant.id} 수용 인원 계산 실패:`, error);
          }
        }
      }
      
      setAvailableCapacities(capacitiesMap);
    };
    
    loadCapacities();
  }, [restaurants, bookings, selectedDate, getAvailableCapacity]); // bookings 변경 시 자동 재계산!

  // ✅ settingsService를 사용하도록 수정 (날짜별 예약 가능 여부 체크 포함)
  const getNextAvailableSlot = (restaurantId: number) => {
    const settings = restaurantSettings[restaurantId];
    if (!settings) return null;

    const dateKey = formatDateKey(new Date());
    
    // ✅ 오늘 날짜가 예약 불가 날짜인지 확인
    if (settings.unavailableDates?.includes(dateKey)) {
      return null; // 예약 불가 날짜면 null 반환
    }
    
    const slots = settings.availableTimeSlots?.[dateKey] || generateDefaultTimeSlots();
    
    if (slots.length === 0) return null;

    // 현재 시간 이후의 첫 번째 예약 가능 시간 반환
    const currentTime = getCurrentTime();
    const nextTime = findNextAvailableTime(currentTime, slots);
    
    return nextTime || slots[0];
  };

  // ✅ settingsService를 사용하도록 수정 (날짜별 예약 가능 여부 체크 포함)
  const getAvailableSlots = (
    restaurantId: number,
    date: Date | undefined,
  ) => {
    if (!date) return [];
    
    const settings = restaurantSettings[restaurantId];
    if (!settings) return [];
    
    const dateKey = formatDateKey(date);
    
    // ✅ 해당 날짜가 예약 불가 날짜인지 확인
    if (settings.unavailableDates?.includes(dateKey)) {
      return []; // 예약 불가 날짜면 빈 배열 반환
    }
    
    return settings.availableTimeSlots?.[dateKey] || [];
  };

  // 🆕 날짜별 남은 수용 인원 가져오기 (실시간 계산)
  const getDisplayCapacity = (
    restaurantId: number,
    date: Date | undefined,
    defaultCapacity: number,
  ): number => {
    if (!date) {
      date = new Date();
    }
    
    const dateKey = formatDateKey(date);
    const key = `${restaurantId}-${dateKey}`;
    
    // 실시간 계산된 남은 수용 인원 반환
    const available = availableCapacities[key];
    
    if (available !== undefined) {
      return available;
    }
    
    // 계산되지 않았으면 기본값 반환
    const settings = restaurantSettings[restaurantId];
    if (settings?.dailyCapacity?.[dateKey] !== undefined) {
      return settings.dailyCapacity[dateKey];
    }
    
    return defaultCapacity;
  };

  // 🆕 날짜별 예약 탭: 시간대 + 수용 인원 필터링
  const filteredRestaurantsByDate = selectedDate
    ? restaurants.filter((restaurant) => {
        const slots = getAvailableSlots(
          restaurant.id,
          selectedDate,
        );
        
        // 시간대가 없으면 제외
        if (slots.length === 0) return false;
        
        // 🆕 남은 수용 인원이 0이면 제외
        const capacity = getDisplayCapacity(
          restaurant.id,
          selectedDate,
          restaurant.capacity,
        );
        
        return capacity > 0;
      })
    : [];

  // 🆕 실시간 예약 탭: 수용 인원 필터링
  const filteredRestaurantsForInstant = restaurants.filter((restaurant) => {
    // 다음 예약 가능 시간이 없으면 제외
    const nextSlot = getNextAvailableSlot(restaurant.id);
    if (!nextSlot) return false;
    
    // 🆕 남은 수용 인원이 0이면 제외
    const capacity = getDisplayCapacity(
      restaurant.id,
      new Date(),
      restaurant.capacity,
    );
    
    return capacity > 0;
  });

  const renderRestaurantCard = (
    restaurant: any,
    mode: "instant" | "scheduled",
    availableSlots?: string[],
  ) => {
    const nextSlot =
      mode === "instant"
        ? getNextAvailableSlot(restaurant.id)
        : availableSlots?.[0];

    // 🆕 날짜별 남은 수용 인원 가져오기 (실시간)
    const targetDate = mode === "scheduled" ? selectedDate : new Date();
    const availableCapacity = getDisplayCapacity(
      restaurant.id,
      targetDate,
      restaurant.capacity,
    );

    return (
      <Card
        key={restaurant.id}
        className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300"
      >
        <div className="flex flex-col md:flex-row">
          {/* 레스토랑 이미지 */}
          <div className="md:w-64 md:flex-shrink-0">
            <ImageWithFallback
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-48 md:h-64 object-cover"
            />
          </div>

          {/* 레스토랑 정보 */}
          <div className="flex-1 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4">
              <div className="mb-3 lg:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <h2>{restaurant.name}</h2>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm">
                  {restaurant.address}
                </span>
              </div>
            </div>

            {/* 수용 인원 정보 - 실시간 업데이트 */}
            <div className={`bg-gradient-to-r rounded-xl px-4 py-3 mb-4 border-2 ${
              availableCapacity > 10 
                ? 'from-green-50 to-emerald-50 border-green-300' 
                : availableCapacity > 5
                ? 'from-yellow-50 to-amber-50 border-yellow-300'
                : 'from-red-50 to-rose-50 border-red-300'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Users className={`w-5 h-5 ${
                    availableCapacity > 10 
                      ? 'text-green-600' 
                      : availableCapacity > 5
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`} />
                  <span className={
                    availableCapacity > 10 
                      ? 'text-green-900' 
                      : availableCapacity > 5
                      ? 'text-yellow-900'
                      : 'text-red-900'
                  }>
                    남은 수용 인원:{" "}
                    <strong className="text-lg">
                      {availableCapacity}명
                    </strong>
                    {availableCapacity === 0 && (
                      <span className="ml-2 text-sm">(예약 마감)</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t">
              <div className="flex items-center gap-3"></div>
              <Button
                size="lg"
                className="w-full sm:w-auto"
                disabled={availableCapacity === 0}
                onClick={() =>
                  onRestaurantSelect?.(restaurant.id, {
                    mode: mode,
                    date:
                      mode === "scheduled"
                        ? selectedDate
                        : undefined,
                    time: nextSlot || undefined,
                    partySize: "2명",
                  })
                }
              >
                {availableCapacity === 0 ? "예약 마감" : "보기 및 예약하기"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <Tabs defaultValue="instant" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="instant">
                실시간 예약
              </TabsTrigger>
              <TabsTrigger value="scheduled">
                날짜별 예약
              </TabsTrigger>
            </TabsList>

            {/* 실시간 예약 탭 */}
            <TabsContent value="instant" className="space-y-4">
              {filteredRestaurantsForInstant.length > 0 ? (
                <div className="space-y-4">
                  {filteredRestaurantsForInstant.map((restaurant) =>
                    renderRestaurantCard(restaurant, "instant"),
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="mb-2">
                    현재 예약 가능한 매장이 없습니다
                  </h3>
                  <p className="text-gray-600">
                    모든 매장이 예약 마감되었습니다. 잠시 후 다시 확인해주세요.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* 날짜별 예약 탭 */}
            <TabsContent
              value="scheduled"
              className="space-y-4"
            >
              <div className="mb-6">
                <div className="flex flex-col items-center">
                  <div className="mb-4 text-center">
                    <h3 className="mb-2">
                      예약 날짜를 선택하세요
                    </h3>
                    <p className="text-gray-600">
                      선택한 날짜에 예약 가능한 레스토랑이
                      표시됩니다
                    </p>
                  </div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border shadow"
                    disabled={(date) =>
                      date <
                      new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                  {selectedDate && (
                    <p className="mt-4 text-gray-700">
                      선택한 날짜:{" "}
                      <strong>
                        {selectedDate.toLocaleDateString(
                          "ko-KR",
                        )}
                      </strong>
                    </p>
                  )}
                </div>
              </div>

              {selectedDate ? (
                filteredRestaurantsByDate.length > 0 ? (
                  <div className="space-y-4">
                    {filteredRestaurantsByDate.map(
                      (restaurant) => {
                        const availableSlots =
                          getAvailableSlots(
                            restaurant.id,
                            selectedDate,
                          );
                        return renderRestaurantCard(
                          restaurant,
                          "scheduled",
                          availableSlots,
                        );
                      },
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="mb-2">
                      예약 가능한 매장이 없습니다
                    </h3>
                    <p className="text-gray-600">
                      다른 날짜를 선택해주세요
                    </p>
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="mb-2">날짜를 선택해주세요</h3>
                  <p className="text-gray-600">
                    위 달력에서 예약 날짜를 선택하시면 예약
                    가능한 매장이 표시됩니다
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}