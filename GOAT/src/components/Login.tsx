import { useState } from "react";
import svgPaths from "../imports/svg-8v4mfggej5";
import { useApp } from "../context/AppContext";
import { authService } from "../services";

interface LoginProps {
  onLogin: (accountType: "customer" | "restaurant") => void;
  onSignupClick: () => void;
}

export function Login({ onLogin, onSignupClick }: LoginProps) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setCurrentUser } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      
      // authService를 통해 로그인
      const user = await authService.login(userId, password);
      
      // Context에 사용자 정보 저장
      setCurrentUser(user);
      
      // User의 role에 따라 자동으로 accountType 결정
      const accountType = user.role === 'customer' ? 'customer' : 'restaurant';
      onLogin(accountType);
      
    } catch (error) {
      console.error("로그인 실패:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen overflow-auto relative w-full"
      style={{
        backgroundImage:
          "linear-gradient(rgb(240, 244, 255) 0%, rgb(255, 255, 255) 50%, rgb(232, 239, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)",
      }}
    >
      {/* 배경 장식 요소 */}
      <div className="absolute bg-[#4a6cf7] blur-3xl filter right-0 opacity-5 rounded-full size-[500px] top-0 pointer-events-none" />
      <div className="absolute bg-[#3451d9] blur-3xl filter left-0 opacity-5 rounded-full size-[500px] top-[400px] pointer-events-none" />

      {/* 헤더 */}
      <header className="sticky top-0 bg-[rgba(255,255,255,0.8)] backdrop-blur-sm border-b border-[#d4e1ff] z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-b from-[#5570f1] to-[#4a6cf7] rounded-2xl shadow-lg p-2.5">
                <svg className="size-6" fill="none" viewBox="0 0 24 24">
                  <g>
                    <path d="M8 22H16" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <path d="M7 10H17" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <path d="M12 15V22" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <path d={svgPaths.p28adc680} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </g>
                </svg>
              </div>
              <span className="font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold text-xl text-[#4a6cf7]">
                후문 한잔
              </span>
            </div>
            <button
              onClick={onSignupClick}
              className="bg-gradient-to-b from-[#5570f1] to-[#4a6cf7] hover:from-[#4a6cf7] hover:to-[#3451d9] transition-all rounded-full shadow-lg px-5 py-2.5 flex items-center gap-2"
            >
              <span className="font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] text-sm text-white">
                회원가입
              </span>
              <svg className="size-4" fill="none" viewBox="0 0 16 16">
                <g>
                  <path d="M3.33333 8H12.6667" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  <path d={svgPaths.p1d405500} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                </g>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* 왼쪽 소개 섹션 */}
          <div className="space-y-7">
            {/* 상단 배지 */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-b from-[#e8efff] to-[#ffffff] border border-[#d4e1ff] rounded-full px-4 py-2.5 shadow-sm">
              <svg className="size-4" fill="none" viewBox="0 0 16 16">
                <g clipPath="url(#clip0_login_badge)">
                  <path d={svgPaths.p304cf800} stroke="#4A6CF7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  <path d="M13.3333 1.33333V4" stroke="#4A6CF7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  <path d="M14.6667 2.66667H12" stroke="#4A6CF7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  <path d={svgPaths.p22966600} stroke="#4A6CF7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                </g>
                <defs>
                  <clipPath id="clip0_login_badge">
                    <rect fill="white" height="16" width="16" />
                  </clipPath>
                </defs>
              </svg>
              <span className="font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] text-sm text-[#5570f1]">
                인하대학교 후문 술집 예약 서비스
              </span>
            </div>

            {/* 로고와 제목 */}
            <div className="flex items-center gap-5">
              <div className="bg-gradient-to-b from-[#5570f1] to-[#4a6cf7] rounded-3xl shadow-2xl p-5">
                <svg className="size-12" fill="none" viewBox="0 0 56 56">
                  <g>
                    <path d="M18.6667 51.3333H37.3333" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.66667" />
                    <path d="M16.3333 23.3333H39.6667" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.66667" />
                    <path d="M28 35V51.3333" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.66667" />
                    <path d={svgPaths.p38c16d00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.66667" />
                  </g>
                </svg>
              </div>
              <h1 className="font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold text-5xl text-[#4a6cf7]">
                후문 한잔
              </h1>
            </div>

            {/* 설명 텍스트 */}
            <p className="font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] text-lg text-[#8b9dc3] leading-relaxed">
              예약 스트레스 없이 후문 술집을{" "}
              <span className="font-bold text-[#5570f1]">간편하게</span> 예약하세요
            </p>

            {/* 기능 카드들 */}
            <div className="space-y-3">
              {/* 간편한 예약 */}
              <div className="bg-gradient-to-b from-[#e8efff] to-[#ffffff] border border-[#d4e1ff] rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-start gap-3.5 relative z-10">
                  <div className="bg-gradient-to-b from-[#5570f1] to-[#4a6cf7] rounded-xl shadow-lg p-3 shrink-0">
                    <svg className="size-6" fill="none" viewBox="0 0 28 28">
                      <g>
                        <path d="M9.33333 25.6667H18.6667" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
                        <path d="M8.16667 11.6667H19.8333" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
                        <path d="M14 17.5V25.6667" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
                        <path d={svgPaths.p128a9f40} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
                      </g>
                    </svg>
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <h3 className="font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold text-sm text-[#5570f1]">
                      간편한 예약
                    </h3>
                    <p className="font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] text-xs text-[#8b9dc3] leading-relaxed">
                      몇 번의 클릭으로 원하는 술집 예약 완료
                    </p>
                  </div>
                </div>
                <div className="absolute -right-6 -top-6 bg-[#4a6cf7] opacity-5 rounded-full size-20" />
              </div>

              {/* 실시간 확인 */}
              <div className="bg-gradient-to-b from-[#e8efff] to-[#ffffff] border border-[#d4e1ff] rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-start gap-3.5 relative z-10">
                  <div className="bg-gradient-to-b from-[#5570f1] to-[#4a6cf7] rounded-xl shadow-lg p-3 shrink-0">
                    <svg className="size-6" fill="none" viewBox="0 0 28 28">
                      <g>
                        <path d="M14 7V14L18.6667 16.3333" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
                        <path d={svgPaths.p1fa66600} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33333" />
                      </g>
                    </svg>
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <h3 className="font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold text-sm text-[#5570f1]">
                      실시간 확인
                    </h3>
                    <p className="font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] text-xs text-[#8b9dc3] leading-relaxed">
                      예약 가능 여부를 실시간으로 확인하세요
                    </p>
                  </div>
                </div>
                <div className="absolute -right-6 -top-6 bg-[#4a6cf7] opacity-5 rounded-full size-20" />
              </div>
            </div>
          </div>

          {/* 오른쪽 로그인 카드 */}
          <div className="w-full max-w-lg mx-auto lg:mt-0">
            <div className="bg-[rgba(255,255,255,0.95)] backdrop-blur-sm border border-[#d4e1ff] rounded-3xl shadow-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 헤더 */}
                <div className="text-center space-y-1.5">
                  <h2 className="font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold text-2xl text-[#4a6cf7]">
                    환영합니다
                  </h2>
                  <p className="font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] text-sm text-[#8b9dc3]">
                    로그인하여 시작하세요
                  </p>
                </div>

                {/* 폼 필드 */}
                <div className="space-y-4">
                  {/* 아이디 */}
                  <div className="space-y-2">
                    <label className="font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold text-sm text-[#5570f1]">
                      아이디
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="아이디를 입력하세요"
                        className="w-full h-12 px-4 bg-white border-2 border-[#d4e1ff] rounded-xl font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] text-sm outline-none focus:border-[#5570f1] transition-colors placeholder:text-[#c3cfe5]"
                      />
                    </div>
                  </div>

                  {/* 비밀번호 */}
                  <div className="space-y-2">
                    <label className="font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold text-sm text-[#5570f1]">
                      비밀번호
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호를 입력하세요"
                        className="w-full h-12 px-4 bg-white border-2 border-[#d4e1ff] rounded-xl font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] text-sm outline-none focus:border-[#5570f1] transition-colors placeholder:text-[#c3cfe5]"
                      />
                    </div>
                  </div>

                  {/* 로그인 버튼 */}
                  <button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-b from-[#5570f1] to-[#4a6cf7] hover:from-[#4a6cf7] hover:to-[#3451d9] transition-all rounded-xl shadow-lg flex items-center justify-center gap-2 mt-2"
                  >
                    <span className="font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold text-sm text-white">
                      로그인
                    </span>
                    <svg className="size-4" fill="none" viewBox="0 0 16 16">
                      <g>
                        <path d="M3.33333 8H12.6667" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        <path d={svgPaths.p1d405500} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      </g>
                    </svg>
                  </button>
                </div>

                {/* 구분선 */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4e1ff] to-transparent" />
                  <svg className="size-4 opacity-50" fill="none" viewBox="0 0 16 16">
                    <g clipPath="url(#clip0_login_divider)">
                      <path d={svgPaths.p1a8ec300} stroke="#4A6CF7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      <path d="M13.3333 1.33333V4" stroke="#4A6CF7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      <path d="M14.6667 2.66667H12" stroke="#4A6CF7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      <path d={svgPaths.p22966600} stroke="#4A6CF7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    </g>
                    <defs>
                      <clipPath id="clip0_login_divider">
                        <rect fill="white" height="16" width="16" />
                      </clipPath>
                    </defs>
                  </svg>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4e1ff] to-transparent" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}