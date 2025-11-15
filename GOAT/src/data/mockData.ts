import { Restaurant, RestaurantAvailability } from "../types";

// 레스토랑 목데이터 (모든 컴포넌트에서 공통으로 사용)
export const mockRestaurants: Restaurant[] = [
  {
    id: 1,
    name: "벨라비스타",
    cuisine: "이탈리안",
    rating: 4.5,
    reviews: 324,
    address: "서울시 강남구 테헤란로 123",
    distance: "0.8km",
    hours: "오후 10:00까지 영업",
    priceRange: "₩₩₩",
    capacity: 50,
    phone: "02-1234-5678",
    website: "www.bellavista.kr",
    description:
      "정통 이탈리안 요리와 우아한 분위기를 경험하세요. 우리 셰프는 토스카나의 전통 레시피에 현대적인 감각을 더했습니다. 로맨틱한 저녁 식사와 특별한 기념일에 완벽한 장소입니다.",
    image:
      "https://images.unsplash.com/photo-1722587561829-8a53e1935e20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDF8fHx8MTc2MjMxMTQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 2,
    name: "사쿠라 스시",
    cuisine: "일식",
    rating: 4.7,
    reviews: 567,
    address: "서울시 강남구 논현로 456",
    distance: "1.9km",
    hours: "오후 11:00까지 영업",
    priceRange: "₩₩₩₩",
    capacity: 30,
    phone: "02-2345-6789",
    website: "www.sakurasushi.kr",
    description:
      "신선한 재료로 만드는 정통 일본 스시를 맛보세요. 숙련된 스시 장인이 직접 준비하는 오마카세 코스를 즐기실 수 있습니다.",
    image:
      "https://images.unsplash.com/photo-1639650538773-ffe1d8ad9d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHN1c2hpJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjIzMDc4MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 3,
    name: "타코 피에스타",
    cuisine: "멕시칸",
    rating: 4.3,
    reviews: 198,
    address: "서울시 마포구 양화로 789",
    distance: "3.4km",
    hours: "오후 9:00까지 영업",
    priceRange: "₩₩",
    capacity: 40,
    phone: "02-3456-7890",
    website: "www.tacofiesta.kr",
    description:
      "활기찬 분위기에서 즐기는 정통 멕시칸 음식. 신선한 재료로 만든 타코와 부리또, 그리고 다양한 칵테일을 제공합니다.",
    image:
      "https://images.unsplash.com/photo-1665541719551-655b587161e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwcmVzdGF1cmFudCUyMHRhY29zfGVufDF8fHx8MTc2MjI5NDA4Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 4,
    name: "한옥마을",
    cuisine: "한식",
    rating: 4.6,
    reviews: 412,
    address: "서울시 종로구 북촌로 234",
    distance: "2.1km",
    hours: "오후 10:00까지 영업",
    priceRange: "₩₩₩",
    capacity: 45,
    phone: "02-4567-8901",
    website: "www.hanokvillage.kr",
    description:
      "전통 한옥에서 즐기는 정갈한 한식 코스 요리. 계절의 맛을 담은 한정식과 특선 메뉴를 제공합니다.",
    image:
      "https://images.unsplash.com/photo-1761824197809-9f1a3b33266c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYyMjQ3MTMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 5,
    name: "르 셰프",
    cuisine: "프렌치",
    rating: 4.8,
    reviews: 289,
    address: "서울시 강남구 청담동 567",
    distance: "1.5km",
    hours: "오후 11:00까지 영업",
    priceRange: "₩₩₩₩",
    capacity: 35,
    phone: "02-5678-9012",
    website: "www.lechef.kr",
    description:
      "미슐랭 스타 셰프가 선보이는 현대적인 프렌치 파인 다이닝. 계절의 신선한 식재료로 만드는 코스 요리를 경험하세요.",
    image:
      "https://images.unsplash.com/photo-1530800089-e0f33f51d5ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjBmaW5lJTIwZGluaW5nfGVufDF8fHx8MTc2MjMxMzgzMHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

// 동적으로 날짜 생성 (오늘부터 7일)
const generateDateKeys = (days: number = 7): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // ✅ 로컬 날짜로 변환 (UTC 아님!)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    dates.push(dateKey);
  }
  
  return dates;
};

const dateKeys = generateDateKeys(7);

// 레스토랑 예약 가용성 데이터
export const restaurantAvailability: RestaurantAvailability = {
  1: {
    // 벨라비스타
    [dateKeys[0]]: [
      "17:00",
      "17:30",
      "18:00",
      "19:00",
      "19:30",
      "20:00",
      "20:30",
      "21:00",
    ],
    [dateKeys[1]]: ["18:00", "18:30", "19:00", "20:00", "20:30"],
    [dateKeys[2]]: ["17:00", "18:00", "19:00", "19:30", "20:00", "21:00"],
    [dateKeys[3]]: ["17:00", "17:30", "18:00", "18:30", "19:00", "20:00"],
    [dateKeys[4]]: ["18:00", "19:00", "20:00", "21:00"],
    [dateKeys[5]]: ["17:30", "18:30", "19:30", "20:30"],
    [dateKeys[6]]: ["17:00", "18:00", "19:00", "20:00"],
  },
  2: {
    // 사쿠라 스시
    [dateKeys[0]]: ["18:00", "19:00", "20:00", "21:00"],
    [dateKeys[1]]: ["18:30", "19:30", "20:30"],
    [dateKeys[2]]: ["18:00", "19:00", "20:00"],
    [dateKeys[3]]: ["17:30", "18:30", "19:30", "20:30"],
    [dateKeys[4]]: ["18:00", "19:00", "20:00", "21:00"],
    [dateKeys[5]]: ["18:30", "19:30", "20:30"],
    [dateKeys[6]]: ["18:00", "19:00", "20:00"],
  },
  3: {
    // 타코 피에스타
    [dateKeys[0]]: ["12:00", "13:00", "18:00", "19:00", "20:00"],
    [dateKeys[1]]: ["12:00", "12:30", "18:30", "19:30"],
    [dateKeys[2]]: ["11:30", "12:30", "18:00", "19:00"],
    [dateKeys[3]]: ["12:00", "13:00", "18:00", "19:00", "20:00"],
    [dateKeys[4]]: ["12:00", "13:00", "18:00", "19:00", "20:00"],
    [dateKeys[5]]: ["12:00", "12:30", "18:30", "19:30"],
    [dateKeys[6]]: ["11:30", "12:30", "18:00", "19:00"],
  },
  4: {
    // 한옥마을
    [dateKeys[0]]: ["12:00", "13:00", "18:00", "19:00", "20:00"],
    [dateKeys[1]]: ["12:30", "13:30", "18:30", "19:30"],
    [dateKeys[2]]: ["12:00", "13:00", "18:00", "19:00"],
    [dateKeys[3]]: ["12:00", "12:30", "18:00", "19:00", "20:00"],
    [dateKeys[4]]: ["12:00", "13:00", "18:00", "19:00", "20:00"],
    [dateKeys[5]]: ["12:30", "13:30", "18:30", "19:30"],
    [dateKeys[6]]: ["12:00", "13:00", "18:00", "19:00"],
  },
  5: {
    // 르 셰프
    [dateKeys[0]]: ["18:00", "19:00", "20:00", "21:00"],
    [dateKeys[1]]: ["18:30", "19:30", "20:30"],
    [dateKeys[2]]: ["18:00", "19:00", "20:00"],
    [dateKeys[3]]: ["18:00", "19:00", "20:00", "21:00"],
    [dateKeys[4]]: ["18:00", "19:00", "20:00", "21:00"],
    [dateKeys[5]]: ["18:30", "19:30", "20:30"],
    [dateKeys[6]]: ["18:00", "19:00", "20:00"],
  },
};