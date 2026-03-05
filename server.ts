import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("shanghai_travel.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS spots (
    id TEXT PRIMARY KEY,
    name_ko TEXT NOT NULL,
    name_zh TEXT,
    name_en TEXT,
    category TEXT,
    lat REAL,
    lng REAL,
    address TEXT,
    hours TEXT,
    price TEXT,
    tips TEXT,
    booking_type TEXT,
    booking_info TEXT,
    image_url TEXT,
    tags TEXT,
    recommended_menu TEXT
  );

  CREATE TABLE IF NOT EXISTS itinerary_days (
    day_index INTEGER PRIMARY KEY,
    title TEXT,
    spot_ids TEXT,
    route_notes TEXT
  );
`);

// Seed Data Function
function seedData() {
  const spotCount = db.prepare("SELECT COUNT(*) as count FROM spots").get() as { count: number };
  if (spotCount.count > 0) return;

  const spots = [
    // Day 1
    { id: 'pvg', name_ko: '푸동 국제공항', name_zh: '浦东国际机场', name_en: 'Pudong International Airport', category: 'transport', lat: 31.1443, lng: 121.8083, address: 'Pudong New Area, Shanghai', hours: '24h', price: '무료', tips: '마그레브(Maglev)를 타면 시내까지 8분 만에 도착합니다. 알리페이 내 교통카드를 미리 등록해두면 편리합니다.', booking_type: 'none', booking_info: '', image_url: 'https://loremflickr.com/800/600/shanghai,airport', tags: '공항,입국,마그레브', recommended_menu: '' },
    { id: 'hotel', name_ko: '진장 메트로폴로 호텔 신천지', name_zh: '锦江都城经典酒店', name_en: 'Jinjiang Metropolo Hotel Xintiandi', category: 'hotel', lat: 31.2155, lng: 121.4745, address: 'No. 18, Middle Huaihai Road, Huangpu District', hours: 'Check-in 14:00', price: '약 15만원~', tips: '신천지 역과 매우 가까워 이동이 편리합니다. 조식이 깔끔하고 주변에 맛집이 많습니다.', booking_type: 'officialSite', booking_info: '트립닷컴 또는 공식 앱 예약', image_url: 'https://loremflickr.com/800/600/shanghai,hotel', tags: '숙소,신천지,가성비', recommended_menu: '' },
    { id: 'dimsum', name_ko: '점도덕 (딤섬)', name_zh: '点都德', name_en: 'Dian Dou De', category: 'food', lat: 31.2235, lng: 121.4755, address: 'Xintiandi, Huangpu District', hours: '09:00-22:00', price: '1인 100-150위안', tips: '위챗 미니프로그램으로 미리 번호표를 뽑으면 대기 시간을 줄일 수 있습니다.', booking_type: 'wechat', booking_info: '위챗 미니프로그램 "点도德"에서 원격 웨이팅', image_url: 'https://loremflickr.com/800/600/dimsum,shanghai', tags: '맛집,딤섬,신천지', recommended_menu: '금사해우장분(창펀), 하가우, 닭발, 구운 우유 타르트' },
    { id: 'milktea', name_ko: '아마수작 (밀크티)', name_zh: '阿嬷手作', name_en: 'A Ma Shou Zuo', category: 'cafe', lat: 31.2215, lng: 121.4735, address: 'Xintiandi Style II, Huangpu District', hours: '10:00-22:00', price: '30-40위안', tips: '대기가 매우 길기로 유명하니 신천지에 도착하자마자 위챗으로 주문부터 하세요.', booking_type: 'wechat', booking_info: '위챗 미니프로그램 주문 필수', image_url: 'https://loremflickr.com/800/600/milktea,shanghai', tags: '카페,밀크티,웨이팅', recommended_menu: '타로 밀크티(Taro Milk Tea), 쌀 아이스크림' },
    { id: 'gov', name_ko: '대한민국 임시정부 유적지', name_zh: '大韩民国临时政府旧址', name_en: 'Provisional Government of Korea', category: 'attraction', lat: 31.2185, lng: 121.4748, address: '306 Madang Rd, Huangpu District', hours: '09:00-17:00', price: '20위안', tips: '한국인이라면 꼭 들러야 할 곳입니다. 내부 사진 촬영은 금지되어 있으니 주의하세요. (점심시간 11:30-13:30 관람 불가)', booking_type: 'none', booking_info: '현장 무인 발권기 이용', image_url: 'https://loremflickr.com/800/600/shanghai,history', tags: '역사,명소,애국', recommended_menu: '' },
    { id: 'wukang', name_ko: '우캉루/용캉루/안푸루', name_zh: '武康路/永康路/安福路', name_en: 'Wukang Rd / Yongkang Rd / Anfu Rd', category: 'attraction', lat: 31.2095, lng: 121.4395, address: 'Xuhui District', hours: '24h', price: '무료', tips: '상하이의 유럽풍 거리를 느낄 수 있습니다. 우캉맨션(Wukang Mansion) 앞에서 인증샷은 필수! 예쁜 카페가 많습니다.', booking_type: 'none', booking_info: '', image_url: 'https://loremflickr.com/800/600/shanghai,street', tags: '산책,인생샷,유럽풍', recommended_menu: '' },
    { id: 'dongbe', name_ko: '동북사계교자왕', name_zh: '东北四季饺子王', name_en: 'Northeast Seasons Dumplings', category: 'food', lat: 31.2355, lng: 121.4805, address: 'Nanjing East Road District', hours: '10:30-23:00', price: '1인 80-100위안', tips: '양이 꽤 많으니 인원수보다 적게 시키는 것을 추천합니다.', booking_type: 'walkin', booking_info: '현장 대기', image_url: 'https://loremflickr.com/800/600/dumplings,shanghai', tags: '맛집,꿔바로우,가성비', recommended_menu: '꿔바로우, 지삼선, 부추계란만두, 토마토계란볶음' },
    { id: 'huoguo', name_ko: '라오지우예 (훠궈)', name_zh: '老九爷', name_en: 'Lao Jiu Ye', category: 'food', lat: 31.2385, lng: 121.4855, address: 'Near The Bund, Huangpu District', hours: '11:00-02:00', price: '1인 150-200위안', tips: '백탕은 약재 맛이 강할 수 있으니 참고하세요. 야식으로도 좋습니다.', booking_type: 'dianping', booking_info: '따종디엔핑 예약 또는 현장 대기', image_url: 'https://loremflickr.com/800/600/hotpot,shanghai', tags: '맛집,훠궈,야식', recommended_menu: '홍탕/백탕 반반, 소고기, 새우완자, 천엽' },
    { id: 'bund', name_ko: '와이탄 야경', name_zh: '外滩', name_en: 'The Bund', category: 'attraction', lat: 31.2415, lng: 121.4915, address: 'Zhongshan East 1st Rd', hours: '조명 19:00-22:00', price: '무료', tips: '황푸강 건너편 푸동의 고층 빌딩 숲을 감상할 수 있는 최고의 장소입니다. 사람이 매우 많으니 소지품 주의하세요.', booking_type: 'none', booking_info: '', image_url: 'https://loremflickr.com/800/600/shanghai,bund', tags: '야경,랜드마크,필수코스', recommended_menu: '' },

    // Day 2
    { id: 'lujiazui', name_ko: '루자주이', name_zh: '陆家嘴', name_en: 'Lujiazui', category: 'attraction', lat: 31.2395, lng: 121.5015, address: 'Pudong New Area', hours: '24h', price: '무료', tips: '동방명주, 상하이타워, 세계금융센터가 모여있는 금융 중심지입니다. 육교 위에서 찍는 사진이 잘 나옵니다.', booking_type: 'none', booking_info: '', image_url: 'https://loremflickr.com/800/600/shanghai,pudong', tags: '랜드마크,고층빌딩,푸동', recommended_menu: '' },
    { id: 'shengjian', name_ko: '샤오양셩지엔', name_zh: '小杨生煎', name_en: 'Yang\'s Dumplings', category: 'food', lat: 31.2375, lng: 121.5035, address: 'Lujiazui Ring Rd, Pudong', hours: '08:00-21:00', price: '20-30위안', tips: '한 입 베어 물 때 뜨거운 육즙이 튈 수 있으니 조심해서 드세요.', booking_type: 'walkin', booking_info: '현장 주문', image_url: 'https://loremflickr.com/800/600/shengjian,shanghai', tags: '맛집,성지엔,로컬푸드', recommended_menu: '오리지널 셩지엔, 새우 셩지엔, 피피샤(딱새우) 셩지엔' },
    { id: 'luckin', name_ko: '루이싱커피', name_zh: '瑞幸咖啡', name_en: 'Luckin Coffee', category: 'cafe', lat: 31.2405, lng: 121.5055, address: '상하이 전역', hours: '08:00-20:00', price: '15-25위안', tips: '앱으로 주문하면 할인이 많이 되지만, 위챗 미니프로그램으로도 충분히 저렴합니다.', booking_type: 'wechat', booking_info: '위챗 미니프로그램 "luckincoffee" 주문', image_url: 'https://loremflickr.com/800/600/coffee,shanghai', tags: '카페,가성비,코코넛라떼', recommended_menu: '생코코넛 라떼(Raw Coconut Latte), 민트 라떼' },
    { id: 'bookstore', name_ko: '도운서점 (상하이타워 52층)', name_zh: '朵云书院', name_en: 'Duoyun Books', category: 'attraction', lat: 31.2355, lng: 121.5015, address: 'Shanghai Tower 52F', hours: '10:00-21:00', price: '1인 1음료 (약 50위안)', tips: '전망대 대신 가기 좋은 곳입니다. 위챗으로 미리 예약해야 입장 가능하며, 창가 자리는 경쟁이 치열합니다.', booking_type: 'wechat', booking_info: '위챗에서 "朵云书院" 검색 후 예약 시스템 이용', image_url: 'https://loremflickr.com/800/600/shanghai,tower', tags: '전망,서점,상하이타워', recommended_menu: '시그니처 라떼, 말차 라떼' },
    { id: 'ferry', name_ko: '황푸강 페리', name_zh: '黄浦江轮渡', name_en: 'Huangpu River Ferry', category: 'transport', lat: 31.2385, lng: 121.4955, address: 'Dongchang Road Ferry Terminal', hours: '07:00-22:00', price: '2위안', tips: '단돈 2위안으로 황푸강을 건너며 와이탄과 푸동의 야경을 동시에 즐길 수 있는 최고의 가성비 코스입니다.', booking_type: 'none', booking_info: '알리페이 교통카드 스캔', image_url: 'https://loremflickr.com/800/600/shanghai,ferry', tags: '교통,야경,가성비', recommended_menu: '' },
    { id: 'crab', name_ko: '리바이시에 (게살국수)', name_zh: '里白蟹', name_en: 'Li Bai Xie', category: 'food', lat: 31.2325, lng: 121.4885, address: 'Near The Bund, Huangpu District', hours: '11:00-21:30', price: '1인 120-150위안', tips: '게살이 듬뿍 들어가 풍미가 일품입니다. 식초를 살짝 곁들이면 더 맛있습니다.', booking_type: 'walkin', booking_info: '현장 대기', image_url: 'https://loremflickr.com/800/600/crab,shanghai', tags: '맛집,게살국수,와이탄', recommended_menu: '게살 비빔국수(Crab Meat Noodle), 게살 만두' },
    { id: 'hema', name_ko: '허마선생 (슈퍼마켓)', name_zh: '盒马鲜生', name_en: 'Hema Fresh', category: 'shopping', lat: 31.2305, lng: 121.4855, address: '상하이 전역', hours: '09:00-22:00', price: '다양', tips: '알리바바에서 운영하는 신선 마트입니다. 해산물을 즉석에서 요리해주기도 하며, 간식 선물 사기에 좋습니다.', booking_type: 'none', booking_info: '알리페이 결제 필수', image_url: 'https://loremflickr.com/800/600/shanghai,market', tags: '쇼핑,마트,해산물', recommended_menu: '랍스터 요리, 대왕 요구르트, 허마 자체 브랜드 간식' },
    { id: 'lamb', name_ko: '하프어드링크 (양꼬치)', name_zh: 'Half a Drink', name_en: 'Half a Drink', category: 'food', lat: 31.2285, lng: 121.4825, address: 'Xintiandi Area', hours: '17:00-02:00', price: '1인 100-150위안', tips: '힙한 분위기에서 양꼬치와 맥주를 즐길 수 있는 곳입니다. 늦은 밤까지 영업합니다.', booking_type: 'walkin', booking_info: '현장 대기', image_url: 'https://loremflickr.com/800/600/shanghai,lamb', tags: '맛집,양꼬치,맥주', recommended_menu: '양꼬치, 소고기 꼬치, 구운 부추, 수제 맥주' },

    // Day 3
    { id: 'jianbing', name_ko: '지엔빙 (아침)', name_zh: '煎饼', name_en: 'Jianbing', category: 'food', lat: 31.2185, lng: 121.4725, address: 'Street Stalls', hours: '07:00-10:00', price: '10-15위안', tips: '상하이 사람들의 소울 푸드 아침 메뉴입니다. 바삭한 과자와 계란, 소스의 조화가 훌륭합니다.', booking_type: 'none', booking_info: '현장 구매 (알리페이)', image_url: 'https://loremflickr.com/800/600/jianbing,shanghai', tags: '아침,현지식,길거리음식', recommended_menu: '지엔빙궈즈(Jianbing Guozi)' },
    { id: 'manner', name_ko: '매너커피', name_zh: 'Manner Coffee', name_en: 'Manner Coffee', category: 'cafe', lat: 31.2195, lng: 121.4735, address: '상하이 전역', hours: '08:00-20:00', price: '15-25위안', tips: '텀블러를 가져가면 5위안 할인을 해주는 친환경 브랜드로 유명합니다.', booking_type: 'wechat', booking_info: '위챗 미니프로그램 주문 가능', image_url: 'https://loremflickr.com/800/600/manner,coffee', tags: '카페,커피,친환경', recommended_menu: '플랫 화이트(Flat White), 더티 커피' },
    { id: 'lillian', name_ko: '릴리안 베이커리', name_zh: '莉莲蛋挞', name_en: 'Lillian Bakery', category: 'food', lat: 31.2205, lng: 121.4745, address: 'Subway Stations / Malls', hours: '09:00-22:00', price: '6-10위안', tips: '상하이에 오면 꼭 먹어야 할 인생 에그타르트로 꼽힙니다.', booking_type: 'none', booking_info: '현장 구매', image_url: 'https://loremflickr.com/800/600/eggtart,shanghai', tags: '디저트,에그타르트,필수', recommended_menu: '에그타르트, 치즈타르트' },
    { id: 'tianzifang', name_ko: '티엔즈팡', name_zh: '田子坊', name_en: 'Tianzifang', category: 'attraction', lat: 31.2085, lng: 121.4685, address: '210 Taikang Rd, Huangpu District', hours: '10:00-21:00', price: '무료', tips: '미로 같은 골목길에 아기자기한 상점과 갤러리가 가득합니다. 누가 캔디, 차(tea) 등 기념품 사기에 좋습니다.', booking_type: 'none', booking_info: '', image_url: 'https://loremflickr.com/800/600/shanghai,alley', tags: '쇼핑,예술,골목투어', recommended_menu: '' },
    { id: 'mamajia', name_ko: '마마지아 (가정식)', name_zh: '妈妈家', name_en: 'Mama Jia', category: 'food', lat: 31.2105, lng: 121.4695, address: 'Near Tianzifang', hours: '11:00-21:30', price: '1인 80-120위안', tips: '집밥 같은 따뜻한 상하이 가정식을 맛볼 수 있습니다.', booking_type: 'walkin', booking_info: '현장 대기', image_url: 'https://loremflickr.com/800/600/shanghai,cooking', tags: '맛집,가정식,홍샤오러우', recommended_menu: '홍샤오러우(동파육 스타일), 마파두부, 게살 두부' },
    { id: 'nail', name_ko: '젤네일 (따종 할인)', name_zh: '美甲', name_en: 'Nail Art', category: 'shopping', lat: 31.2125, lng: 121.4715, address: 'Shopping Malls', hours: '10:00-21:00', price: '50-150위안', tips: '따종디엔핑에서 "美甲"를 검색해 첫 방문 할인을 받으면 매우 저렴하게 고퀄리티 네일을 받을 수 있습니다.', booking_type: 'dianping', booking_info: '따종디엔핑 앱에서 쿠폰 구매 후 예약', image_url: 'https://loremflickr.com/800/600/nail,art', tags: '뷰티,할인,가성비', recommended_menu: '' },
  ];

  const insertSpot = db.prepare(`
    INSERT INTO spots (id, name_ko, name_zh, name_en, category, lat, lng, address, hours, price, tips, booking_type, booking_info, image_url, tags, recommended_menu)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const spot of spots) {
    insertSpot.run(spot.id, spot.name_ko, spot.name_zh, spot.name_en, spot.category, spot.lat, spot.lng, spot.address, spot.hours, spot.price, spot.tips, spot.booking_type, spot.booking_info, spot.image_url, spot.tags, spot.recommended_menu);
  }

  const days = [
    { day_index: 1, title: 'Day 1: 상하이 입성 및 신천지 산책', spot_ids: JSON.stringify(['pvg', 'hotel', 'dimsum', 'milktea', 'gov', 'wukang', 'dongbe', 'huoguo', 'bund']), route_notes: '공항에서 숙소 이동 후 신천지 주변을 여유롭게 둘러보세요.' },
    { day_index: 2, title: 'Day 2: 푸동 랜드마크와 와이탄 야경', spot_ids: JSON.stringify(['lujiazui', 'shengjian', 'luckin', 'bookstore', 'ferry', 'crab', 'hema', 'lamb']), route_notes: '푸동의 고층 빌딩 숲을 구경하고 페리를 타고 강을 건너보세요.' },
    { day_index: 3, title: 'Day 3: 현지인 아침과 기념품 쇼핑', spot_ids: JSON.stringify(['jianbing', 'manner', 'lillian', 'tianzifang', 'mamajia', 'nail', 'pvg']), route_notes: '마지막 날은 티엔즈팡에서 기념품을 사고 공항으로 이동합니다.' },
  ];

  const insertDay = db.prepare(`
    INSERT INTO itinerary_days (day_index, title, spot_ids, route_notes)
    VALUES (?, ?, ?, ?)
  `);

  for (const day of days) {
    insertDay.run(day.day_index, day.title, day.spot_ids, day.route_notes);
  }
}

seedData();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/itinerary", (req, res) => {
    const days = db.prepare("SELECT * FROM itinerary_days ORDER BY day_index").all();
    res.json(days.map((d: any) => ({ ...d, spot_ids: JSON.parse(d.spot_ids) })));
  });

  app.get("/api/spots", (req, res) => {
    const spots = db.prepare("SELECT * FROM spots").all();
    res.json(spots);
  });

  app.get("/api/spots/:id", (req, res) => {
    const spot = db.prepare("SELECT * FROM spots WHERE id = ?").get(req.params.id);
    if (spot) {
      res.json(spot);
    } else {
      res.status(404).json({ error: "Spot not found" });
    }
  });

  // Admin API
  app.post("/api/admin/spots", (req, res) => {
    const { id, name_ko, name_zh, name_en, category, lat, lng, address, hours, price, tips, booking_type, booking_info, image_url, tags } = req.body;
    try {
      db.prepare(`
        INSERT OR REPLACE INTO spots (id, name_ko, name_zh, name_en, category, lat, lng, address, hours, price, tips, booking_type, booking_info, image_url, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id || Math.random().toString(36).substr(2, 9), name_ko, name_zh, name_en, category, lat, lng, address, hours, price, tips, booking_type, booking_info, image_url, tags);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
