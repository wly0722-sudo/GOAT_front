// 개발용 도구 - 데이터 확인 및 초기화
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RefreshCw, Database, Users, Calendar } from "lucide-react";
import { Label } from "./ui/label";

export function DevTools() {
  const { restaurants, bookings, resetData, currentUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = () => {
    if (confirm("모든 데이터를 초기화하시겠습니까?")) {
      resetData();
      alert("데이터가 초기화되었습니다.");
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-yellow-100 border-yellow-300 hover:bg-yellow-200"
      >
        <Database className="w-4 h-4 mr-2" />
        Dev Tools
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] overflow-auto shadow-2xl">
      <CardHeader className="bg-yellow-50 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            개발자 도구
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* 현재 사용자 */}
        <div>
          <h3 className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4" />
            현재 사용자
          </h3>
          {currentUser ? (
            <div className="p-3 bg-gray-50 rounded text-sm">
              <div>이름: {currentUser.name}</div>
              <div>타입: {currentUser.type}</div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">로그인 안 됨</div>
          )}
        </div>

        {/* 레스토랑 통계 */}
        <div>
          <h3 className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4" />
            레스토랑 통계
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>전체 레스토랑:</span>
              <span className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-800">{restaurants.length}개</span>
            </div>
            <div className="p-2 bg-gray-50 rounded text-xs max-h-32 overflow-y-auto">
              {restaurants.map((r) => (
                <div key={r.id} className="py-1">
                  {r.id}. {r.name} (수용: {r.capacity}명)
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 예약 데이터 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>예약 데이터</Label>
            <span className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-800">{bookings.upcoming.length + bookings.past.length}개</span>
          </div>
          <div className="bg-gray-900 rounded p-3 max-h-64 overflow-y-auto">
            <pre className="text-xs text-green-400 whitespace-pre-wrap break-all">
              {JSON.stringify(bookings, null, 2)}
            </pre>
          </div>
        </div>

        {/* 로컬스토리지 정보 */}
        <div>
          <h3 className="mb-2">로컬스토리지</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span>restaurants:</span>
              <span className="text-gray-600">
                {localStorage.getItem("restaurants")?.length || 0} bytes
              </span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span>bookings:</span>
              <span className="text-gray-600">
                {localStorage.getItem("bookings")?.length || 0} bytes
              </span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span>currentUser:</span>
              <span className="text-gray-600">
                {localStorage.getItem("currentUser")?.length || 0} bytes
              </span>
            </div>
          </div>
        </div>

        {/* 데이터 초기화 */}
        <Button
          onClick={handleReset}
          variant="destructive"
          size="sm"
          className="w-full"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          데이터 초기화
        </Button>

        <div className="text-xs text-gray-500 text-center">
          이 도구는 개발용입니다. 프로덕션에서는 제거하세요.
        </div>
      </CardContent>
    </Card>
  );
}