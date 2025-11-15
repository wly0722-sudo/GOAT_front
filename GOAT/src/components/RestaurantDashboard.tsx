import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  CalendarCheck,
  Settings,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { useApp } from "../context/AppContext";
import { toast } from "sonner@2.0.3";
import { formatKoreanDate } from "../services";

export function RestaurantDashboard() {
  // Context에서 데이터 가져오기
  const {
    bookings,
    updateBooking,
    deleteBooking,
    rejectBooking, // ✅ 추가
    currentUser,
    getRestaurant,
    getRestaurantSettings,
    updateRestaurantSettings,
    setDailyCapacity,
    getAvailableCapacity,
  } = useApp();

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedCapacity, setSelectedCapacity] = useState<number>(0);
  const [isDateAvailable, setIsDateAvailable] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 현재 매장 정보 가져오기
  const restaurant = currentUser?.restaurantId
    ? getRestaurant(currentUser.restaurantId)
    : null;

  // 🆕 매장의 최대 수용 인원 (날짜별 설정 반영)
  const [maxCapacity, setMaxCapacity] = useState<number>(restaurant?.capacity || 50);

  // 🆕 매장의 기본 최대 수용 인원 (변하지 않음)
  const baseCapacity = restaurant?.capacity || 50;

  // 동적 수용 인원 탭 생성 (5명 단위) - 기본 매장 수용 인원 기준
  const capacityOptions = Array.from(
    { length: Math.ceil(baseCapacity / 5) },
    (_, i) => (i + 1) * 5
  );

  // 매장별 필터링: 현재 로그인한 매장 사장의 레스토랑 예약만 필터링
  const myRestaurantBookings = {
    upcoming: currentUser?.restaurantId
      ? bookings.upcoming.filter(
          (b) => b.restaurantId === currentUser.restaurantId
        )
      : [],
    past: currentUser?.restaurantId
      ? bookings.past.filter((b) => b.restaurantId === currentUser.restaurantId)
      : [],
  };

  // 🔍 디버깅 정보 출력
  useEffect(() => {
    if (currentUser?.restaurantId) {
      console.log('=== 매장 대시보드 디버깅 ===');
      console.log('내 매장 ID:', currentUser.restaurantId);
      console.log('내 매장 정보:', restaurant);
      console.log('전체 예약 (upcoming):', bookings.upcoming.length, '개');
      console.log('내 매장 예약 (upcoming):', myRestaurantBookings.upcoming.length, '개');
      console.log('전체 예약 상세:');
      bookings.upcoming.forEach(b => {
        console.log(`  - [${b.restaurantId === currentUser.restaurantId ? '✅ 내 매장' : '❌ 다른 매장'}] ${b.restaurantName}(ID: ${b.restaurantId}) - ${b.date} ${b.time} - ${b.guestName}`);
      });
    }
  }, [currentUser, bookings, restaurant, myRestaurantBookings]);

  // 선택된 날짜의 예약 총 인원 계산 (취소되지 않은 예약만)
  const todayBookings = myRestaurantBookings.upcoming.filter(
    (b) => b.date === selectedDate && b.status !== "cancelled"
  );
  const bookedCapacity = todayBookings.reduce(
    (sum, b) => sum + b.partySize,
    0
  );

  // 현재 수용 가능 인원 = 최대 수용 인원 - 예약된 총 인원
  const availableCapacity = Math.max(0, maxCapacity - bookedCapacity);

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        label: string;
        className: string;
      }
    > = {
      confirmed: {
        label: "확정",
        className: "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium bg-gradient-to-b from-[#10b981] to-[#059669] text-white",
      },
      pending: {
        label: "대기중",
        className: "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium bg-gradient-to-b from-[#fbbf24] to-[#f59e0b] text-white",
      },
      cancelled: { 
        label: "취소됨",
        className: "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium bg-red-500 text-white"
      },
      rejected: { 
        label: "거절됨",
        className: "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium bg-red-500 text-white"
      },
    };

    const config = variants[status] || variants.confirmed;
    return (
      <span className={config.className}>
        {config.label}
      </span>
    );
  };

  useEffect(() => {
    const loadSettings = async () => {
      if (restaurant && currentUser?.restaurantId) {
        try {
          const settings = await getRestaurantSettings(currentUser.restaurantId);
          // 선택된 날짜의 예약 가능 상태 확인
          const isAvailable = !settings.unavailableDates.includes(selectedDate);
          setIsDateAvailable(isAvailable);
          
          // 🆕 선택된 날짜의 수용 인원 설정 (없으면 기본 매장 수용 인원 사용)
          const dailyCap = settings.dailyCapacity[selectedDate];
          const baseCapacity = restaurant.capacity || 50;
          
          if (dailyCap !== undefined) {
            setSelectedCapacity(dailyCap);
            setMaxCapacity(dailyCap); // 🆕 날짜별 설정 반영
            console.log(`📅 ${selectedDate} 수용 인원: ${dailyCap}명 (매장 대시보드 설정)`);
          } else {
            setSelectedCapacity(baseCapacity);
            setMaxCapacity(baseCapacity); // 🆕 기본값 사용
            console.log(`📅 ${selectedDate} 수용 인원: ${baseCapacity}명 (기본값)`);
          }
        } catch (error) {
          console.error("설정 로드 실패:", error);
        }
      }
    };

    loadSettings();
  }, [restaurant, currentUser, selectedDate, getRestaurantSettings]);

  const handleSaveSettings = async () => {
    if (!currentUser?.restaurantId) return;
    
    setIsSaving(true);
    try {
      // 먼저 현재 설정을 가져옴
      const settings = await getRestaurantSettings(currentUser.restaurantId);
      
      // 날짜 예약 가능 상태 업데이트
      let unavailableDates = [...settings.unavailableDates];
      const dateIndex = unavailableDates.indexOf(selectedDate);
      
      if (isDateAvailable) {
        // 예약 가능하게 만들기 (목록에서 제거)
        if (dateIndex !== -1) {
          unavailableDates = unavailableDates.filter(d => d !== selectedDate);
        }
      } else {
        // 예약 불가능하게 만들기 (목록에 추가)
        if (dateIndex === -1) {
          unavailableDates.push(selectedDate);
        }
      }
      
      // 날짜별 수용 인원 업데이트
      const dailyCapacity = {
        ...settings.dailyCapacity,
        [selectedDate]: selectedCapacity,
      };
      
      // 설정 저장
      await updateRestaurantSettings(currentUser.restaurantId, {
        unavailableDates,
        dailyCapacity,
      });
      
      toast.success("변경되었습니다");
    } catch (error) {
      console.error("설정 저장 실패:", error);
      toast.error("설정 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 메인 탭 */}
      <Tabs defaultValue="bookings" className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-1 border border-[#d4e1ff]">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger
              value="bookings"
              className="py-3 data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#5570f1] data-[state=active]:to-[#4a6cf7] data-[state=active]:text-white"
            >
              <CalendarCheck className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">
                예약 관리
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="availability"
              className="py-3 data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#5570f1] data-[state=active]:to-[#4a6cf7] data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">
                예약 설정
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 예약 관리 탭 */}
        <TabsContent value="bookings" className="space-y-4">
          <Card className="shadow-lg border-[#d4e1ff]">
            <CardHeader className="border-b border-[#d4e1ff] bg-gradient-to-r from-[#f0f4ff] to-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>예약 목록</CardTitle>
                  <CardDescription>
                    예약을 확인하고 관리하세요
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>고객</TableHead>
                      <TableHead>연락처</TableHead>
                      <TableHead>날짜 & 시간</TableHead>
                      <TableHead>인원</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myRestaurantBookings.upcoming.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-64">
                          <div className="flex flex-col items-center justify-center text-center py-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                              <CalendarCheck className="w-10 h-10 text-[#4a6cf7]" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-900">
                              예약이 없습니다
                            </h3>
                            <p className="text-gray-600 mb-4 max-w-md">
                              아직 접수된 예약이 없습니다. 
                              {restaurant && (
                                <>
                                  <br />
                                  <span className="font-medium text-[#4a6cf7]">"{restaurant.name}"</span> 매장으로 예약이 들어오면 여기에 표시됩니다.
                                </>
                              )}
                            </p>
                            {currentUser?.restaurantId && (
                              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 max-w-md">
                                <p className="text-sm text-green-900 font-medium mb-1">
                                  💡 테스트 방법
                                </p>
                                <p className="text-sm text-green-700">
                                  소비자 계정으로 로그인 → <strong>"{restaurant?.name}"</strong> 매장 찾기 → 예약하기
                                  <br />
                                  <span className="text-xs text-green-600 mt-1 block">
                                    (매장 ID: {currentUser.restaurantId})
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      myRestaurantBookings.upcoming.map((booking) => (
                        <TableRow
                          key={booking.id}
                          className="hover:bg-gray-50"
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {booking.guestName}
                              </p>
                              <p className="text-sm text-gray-500">
                                예약 #{booking.id}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600">
                              <p>{booking.guestPhone}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {formatKoreanDate(booking.date)}
                              </p>
                              <p className="text-sm text-gray-600">
                                {booking.time}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">
                                {booking.partySize}명
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(booking.status)}
                          </TableCell>
                          <TableCell>
                            {booking.status === "pending" && (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-[#10b981] hover:bg-green-50 border-green-300"
                                  onClick={async () => {
                                    try {
                                      await updateBooking(booking.id, { status: "confirmed" });
                                      
                                      // 🆕 남은 수용 인원 확인 및 표시
                                      const remainingCapacity = await getAvailableCapacity(
                                        booking.restaurantId,
                                        booking.date
                                      );
                                      
                                      toast.success(
                                        `${booking.guestName}님의 예약이 승인되었습니다.\n남은 수용 인원: ${remainingCapacity}명`
                                      );
                                    } catch (error) {
                                      console.error("예약 확정 실패:", error);
                                      toast.error("예약 확정 중 오류가 발생했습니다.");
                                    }
                                  }}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:bg-red-50 border-red-300"
                                  onClick={async () => {
                                    try {
                                      await rejectBooking(booking.id); // ✅ rejectBooking 메서드 사용
                                      toast.success(`${booking.guestName}님의 예약이 거절되었습니다.`);
                                    } catch (error) {
                                      console.error("예약 거절 실패:", error);
                                      toast.error("예약 거절 중 오류가 발생했습니다.");
                                    }
                                  }}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 설정 탭 */}
        <TabsContent value="availability" className="space-y-6">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg border-[#d4e1ff]">
              <CardHeader className="border-b border-[#d4e1ff] bg-gradient-to-r from-[#f0f4ff] to-white">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#4a6cf7]" />
                  테이블 수용 인원
                </CardTitle>
                <CardDescription>
                  좌석 및 수용 인원을 설정하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>날짜 선택</Label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border-[#d4e1ff]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#f0f4ff] to-white rounded-lg border border-[#d4e1ff]">
                    <div className="space-y-0.5">
                      <Label>예약 가능 상태</Label>
                      <p className="text-sm text-gray-500">
                        {formatKoreanDate(selectedDate)} 예약 받기
                      </p>
                    </div>
                    <Switch
                      checked={isDateAvailable}
                      onCheckedChange={setIsDateAvailable}
                    />
                  </div>
                </div>

                {/* 수용 인원 정보 표시 */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">선택한 날짜 수용인원</span>
                    <span className="font-semibold text-[#4a6cf7]">{maxCapacity}명</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">선택한 날짜 예약된 인원</span>
                    <span className="font-semibold text-orange-600">{bookedCapacity}명</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                    <span className="text-sm">현재 수용 가능 인원</span>
                    <span className="font-semibold text-green-600">{availableCapacity}명</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>수용 인원 설정</Label>
                  <p className="text-sm text-gray-500 mb-2">
                    예약 가능한 최대 인원을 설정하세요
                  </p>
                  <div className="grid grid-cols-5 gap-2 p-1">
                    {capacityOptions.map((capacity) => (
                      <Button
                        key={capacity}
                        variant={
                          selectedCapacity === capacity
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedCapacity(capacity)}
                        className={
                          selectedCapacity === capacity
                            ? "bg-gradient-to-b from-[#5570f1] to-[#4a6cf7]"
                            : "border-[#d4e1ff] text-[#4a6cf7] hover:bg-[#f0f4ff]"
                        }
                      >
                        {capacity}명
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-b from-[#5570f1] to-[#4a6cf7] hover:from-[#4a6cf7] hover:to-[#3451d9]"
                  size="lg"
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                >
                  {isSaving ? "저장 중..." : "저장"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}