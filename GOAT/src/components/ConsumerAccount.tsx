import { useState } from "react";
import { useApp } from "../context/AppContext";
import { authService } from "../services";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { RestaurantDiscovery } from "./RestaurantDiscovery";
import { RestaurantProfile } from "./RestaurantProfile";
import { BookingManagement } from "./BookingManagement";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
  User,
  MapPin,
  Bell,
  CreditCard,
  Heart,
  Settings,
  Search,
  Calendar,
  Star,
  Award,
} from "lucide-react";

export function ConsumerAccount() {
  const { currentUser, setCurrentUser } = useApp();
  const [activeTab, setActiveTab] = useState("discovery");
  const [selectedRestaurantId, setSelectedRestaurantId] =
    useState<number | null>(null);
  const [bookingInfo, setBookingInfo] = useState<{
    mode: "instant" | "scheduled";
    date?: Date;
    time?: string;
    partySize: string;
  } | null>(null);

  // 설정 탭 - 개인 정보 state
  const [profileName, setProfileName] = useState(currentUser?.name || "");
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || "");
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRestaurantSelect = (
    restaurantId: number,
    info: {
      mode: "instant" | "scheduled";
      date?: Date;
      time?: string;
      partySize: string;
    },
  ) => {
    setSelectedRestaurantId(restaurantId);
    setBookingInfo(info);
  };

  const handleBackToDiscovery = () => {
    setSelectedRestaurantId(null);
    setBookingInfo(null);
  };

  const handleBookingComplete = () => {
    setSelectedRestaurantId(null);
    setBookingInfo(null);
    setActiveTab("bookings");
  };

  const handleUpdateProfile = async () => {
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!profileName || !profileEmail) {
      alert("이름과 이메일은 필수 입력 항목입니다.");
      return;
    }

    try {
      setIsUpdating(true);

      const updatedUser = await authService.updateProfile({
        name: profileName,
        email: profileEmail,
        phone: profilePhone,
      });

      setCurrentUser(updatedUser);
      alert("개인 정보가 성공적으로 업데이트되었습니다!");
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("개인 정보 업데이트 중 오류가 발생했습니다.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 프로필 헤더 */}
      <Card className="shadow-lg overflow-hidden border-[#d4e1ff]">
        <div className="bg-gradient-to-r from-[#5570f1] to-[#4a6cf7] h-32"></div>
        <CardContent className="-mt-16 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
              <AvatarImage src="" alt="사용자" />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-[#5570f1] to-[#4a6cf7] text-white">
                {currentUser?.name?.substring(0, 2) || "사용자"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <div className="mb-2">
                <h1 className="text-gray-900 drop-shadow-lg">
                  {currentUser?.name || "사용자"}
                </h1>
              </div>
              <div className="space-y-1">
                <p className="text-gray-600">
                  {currentUser?.email || "이메일 없음"}
                </p>
                {currentUser?.phone && (
                  <p className="text-gray-500">{currentUser.phone}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 메인 탭 네비게이션 */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="bg-white rounded-lg shadow-sm p-1 border border-[#d4e1ff]">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 h-auto">
            <TabsTrigger
              value="discovery"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#5570f1] data-[state=active]:to-[#4a6cf7] data-[state=active]:text-white"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">
                매장 찾기
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#5570f1] data-[state=active]:to-[#4a6cf7] data-[state=active]:text-white"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">내 예약</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#5570f1] data-[state=active]:to-[#4a6cf7] data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">설정</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="discovery">
          {selectedRestaurantId && bookingInfo ? (
            <RestaurantProfile
              restaurantId={selectedRestaurantId}
              bookingInfo={bookingInfo}
              onBack={handleBackToDiscovery}
              onBookingComplete={handleBookingComplete}
            />
          ) : (
            <RestaurantDiscovery
              onRestaurantSelect={handleRestaurantSelect}
            />
          )}
        </TabsContent>

        <TabsContent value="bookings">
          <BookingManagement />
        </TabsContent>

        <TabsContent value="settings">
          <div className="max-w-2xl mx-auto">
            {/* 개인 정보 */}
            <Card className="shadow-lg border-[#d4e1ff]">
              <CardHeader className="border-b border-[#d4e1ff] bg-gradient-to-r from-[#f0f4ff] to-white">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#4a6cf7]" />
                  개인 정보
                </CardTitle>
                <CardDescription>
                  계정 정보를 관리하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    className="border-[#d4e1ff] focus:border-[#4a6cf7] focus:ring-[#4a6cf7]"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    className="border-[#d4e1ff] focus:border-[#4a6cf7] focus:ring-[#4a6cf7]"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">전화번호</Label>
                  <Input
                    id="phone"
                    type="tel"
                    className="border-[#d4e1ff] focus:border-[#4a6cf7] focus:ring-[#4a6cf7]"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full bg-gradient-to-b from-[#5570f1] to-[#4a6cf7] hover:from-[#4a6cf7] hover:to-[#3451d9]"
                  size="lg"
                  onClick={handleUpdateProfile}
                  disabled={isUpdating}
                >
                  {isUpdating ? "업데이트 중..." : "정보 업데이트"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}