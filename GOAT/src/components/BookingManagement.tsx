import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Phone,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useApp } from "../context/AppContext";
import { formatKoreanDate } from "../services";

export function BookingManagement() {
  // Context에서 데이터 가져오기
  const {
    bookings,
    restaurants,
    deleteBooking,
    currentUser,
    getBookingsByUser,
  } = useApp();

  // 🔍 현재 사용자의 예약만 필터링
  const userBookings = {
    upcoming: currentUser
      ? bookings.upcoming.filter(
          (b) => b.userId === currentUser.id,
        ) // ✅ userId로 필터링
      : [],
    past: currentUser
      ? bookings.past.filter((b) => b.userId === currentUser.id) // ✅ userId로 필터링
      : [],
  };

  // 🔍 디버깅 로그
  console.log("=== BookingManagement 디버깅 ===");
  console.log("현재 사용자:", currentUser);
  console.log(
    "전체 예약 (upcoming):",
    bookings.upcoming.length,
  );
  console.log(
    "내 예약 (upcoming):",
    userBookings.upcoming.length,
  );
  console.log(
    "내 예약 목록:",
    userBookings.upcoming.map((b) => ({
      id: b.id,
      userId: b.userId, // ✅ userId 출력
      restaurant: b.restaurantName,
      date: b.date,
      guestName: b.guestName,
      guestPhone: b.guestPhone,
    })),
  );

  // 예약된 레스토랑 정보 찾기
  const getRestaurantInfo = (restaurantId: number) => {
    return restaurants.find((r) => r.id === restaurantId);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        label: string;
        className: string;
      }
    > = {
      confirmed: {
        label: "예약 확정",
        className:
          "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium bg-gradient-to-b from-[#10b981] to-[#059669] text-white",
      },
      pending: {
        label: "승인 대기",
        className:
          "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium bg-gradient-to-b from-[#fbbf24] to-[#f59e0b] text-white",
      },
      completed: {
        label: "완료됨",
        className:
          "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium border border-[#d4e1ff] text-[#4a6cf7]",
      },
      cancelled: {
        label: "취소됨",
        className:
          "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium bg-red-500 text-white",
      },
      rejected: {
        label: "승인 거절",
        className:
          "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium bg-gradient-to-b from-[#ef4444] to-[#dc2626] text-white",
      },
    };

    const config = variants[status] || variants.confirmed;
    return (
      <span className={config.className}>{config.label}</span>
    );
  };

  return (
    <div className="space-y-8">
      {/* 예약 목록 */}
      <div className="space-y-6">
        {/* 예약 리스트 */}
        <div className="space-y-4">
          {userBookings.upcoming.map((booking) => {
            const restaurantInfo = getRestaurantInfo(
              booking.restaurantId,
            );
            if (!restaurantInfo) return null;
            return (
              <Card
                key={booking.id}
                className="shadow-lg hover:shadow-xl transition-shadow border-2 border-[#d4e1ff] hover:border-[#4a6cf7]"
              >
                <CardHeader className="border-b border-[#d4e1ff] bg-gradient-to-r from-[#f0f4ff] to-white">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle>
                          {restaurantInfo.name}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-sm">
                        예약 번호:{" "}
                        <span className="font-mono">
                          {booking.confirmationNumber}
                        </span>
                      </CardDescription>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="mb-3 pb-2 border-b">
                        예약 정보
                      </h4>
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#f0f4ff] to-white rounded-lg border border-[#d4e1ff]">
                        <Calendar className="w-5 h-5 text-[#4a6cf7]" />
                        <div>
                          <p className="text-sm text-gray-500">
                            날짜
                          </p>
                          <p className="font-medium">
                            {formatKoreanDate(booking.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#f0f4ff] to-white rounded-lg border border-[#d4e1ff]">
                        <Clock className="w-5 h-5 text-[#5570f1]" />
                        <div>
                          <p className="text-sm text-gray-500">
                            시간
                          </p>
                          <p className="font-medium">
                            {booking.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#f0f4ff] to-white rounded-lg border border-[#d4e1ff]">
                        <Users className="w-5 h-5 text-[#4a6cf7]" />
                        <div>
                          <p className="text-sm text-gray-500">
                            인원
                          </p>
                          <p className="font-medium">
                            {booking.partySize}명
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="mb-3 pb-2 border-b">
                        레스토랑 정보
                      </h4>
                      <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-[#f0f4ff] to-white rounded-lg border border-[#d4e1ff]">
                        <MapPin className="w-5 h-5 text-[#4a6cf7] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">
                            주소
                          </p>
                          <p className="font-medium">
                            {restaurantInfo.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#f0f4ff] to-white rounded-lg border border-[#d4e1ff]">
                        <Phone className="w-5 h-5 text-[#5570f1]" />
                        <div>
                          <p className="text-sm text-gray-500">
                            전화번호
                          </p>
                          <p className="font-medium">
                            {restaurantInfo.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ✅ 상태별 안내 메시지 */}
                  {booking.status === "pending" && (
                    <div className="bg-gradient-to-r from-[#fef3c7] to-[#fef9e6] border-2 border-[#fbbf24] rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-b from-[#fbbf24] to-[#f59e0b] rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-[#92400e] mb-1">
                            승인 대기 중
                          </h4>
                          <p className="text-sm text-[#92400e]">
                            매장에서 예약을 확인하고 있습니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {booking.status === "confirmed" && (
                    <div className="bg-gradient-to-r from-[#d1fae5] to-[#ecfdf5] border-2 border-[#10b981] rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-b from-[#10b981] to-[#059669] rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-[#065f46] mb-1">
                            예약 확정 완료
                          </h4>
                          <p className="text-sm text-[#065f46]">
                            매장에서 예약을 승인했습니다. 방문 시간을 지켜주세요.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {booking.status === "rejected" && (
                    <div className="bg-gradient-to-r from-[#fee2e2] to-[#fef2f2] border-2 border-[#ef4444] rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-b from-[#ef4444] to-[#dc2626] rounded-full flex items-center justify-center flex-shrink-0">
                          <XCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-[#991b1b] mb-1">
                            예약이 거절되었습니다
                          </h4>
                          <p className="text-sm text-[#991b1b]">
                            죄송합니다. 매장 사정으로 예약을 받을 수 없습니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ✅ 액션 버튼 - 상태에 따라 조건부 표시 */}
                  {(booking.status === "pending" || booking.status === "confirmed") && (
                    <div className="pt-4 border-t border-[#d4e1ff]">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="lg"
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            예약 취소
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              예약을 취소하시겠습니까?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              이 작업은 되돌릴 수 없습니다.
                              예약이 완전히 삭제됩니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              취소
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                try {
                                  await deleteBooking(
                                    booking.id,
                                  );
                                } catch (error) {
                                  console.error(
                                    "예약 삭제 실패:",
                                    error,
                                  );
                                  alert(
                                    "예약 취소 중 오류가 발생했습니다.",
                                  );
                                }
                              }}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              예약 취소
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}

                  {/* ✅ rejected 상태일 때는 삭제 버튼만 표시 */}
                  {booking.status === "rejected" && (
                    <div className="pt-4 border-t border-[#d4e1ff]">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="lg"
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            예약 기록 삭제
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              예약 기록을 삭제하시겠습니까?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              거절된 예약 기록이 완전히 삭제됩니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              취소
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                try {
                                  await deleteBooking(booking.id);
                                } catch (error) {
                                  console.error("예약 삭제 실패:", error);
                                  alert("예약 삭제 중 오류가 발생했습니다.");
                                }
                              }}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              삭제
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {userBookings.upcoming.length === 0 && (
            <Card className="shadow-lg border-[#d4e1ff]">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#f0f4ff] to-[#e8efff] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-[#4a6cf7]" />
                </div>
                <h3 className="mb-2">예정된 예약이 없습니다</h3>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}