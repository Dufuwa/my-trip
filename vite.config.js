import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/my-trip/', // 這裡填您的 GitHub Repository 名稱，前後要有斜線
})

// --- Default Data for 2027 Trip ---
export const DEFAULT_ITINERARY = [
  // --- NORWAY (5天) ---
  {
    day: 1, country: 'Norway', location: '奧斯陸(Oslo)', title: '抵達奧斯陸',
    content: '抵達奧斯陸加登莫恩機場(OSL)，搭乘Flytoget快線前往市區，入住飯店後探索卡爾約翰大道',
    transportType: 'Flight', transportDetail: 'TPE -> OSL', transportCost: 0,
    stayName: 'Comfort Hotel Xpress', stayCost: 2500,
    activityCost: 1500, booked: false
  },
  {
    day: 2, country: 'Norway', location: '奧斯陸 -> 特羅姆瑟', title: '飛往北極',
    content: '早上參觀歌劇院與博物館，下午搭機飛往北極圈內的特羅姆瑟',
    transportType: 'Flight', transportDetail: 'OSL -> TOS', transportCost: 4500,
    stayName: 'Smarthotel Tromsø', stayCost: 3500,
    activityCost: 2000, booked: false
  },
  {
    day: 3, country: 'Norway', location: '特羅姆瑟 (Tromsø)', title: '北極光之城',
    content: '搭乘 Fjellheisen 纜車俯瞰峽灣，晚上參加極光團 (3小時以上尋光之旅)',
    transportType: 'None', transportDetail: '', transportCost: 0,
    stayName: 'Smarthotel Tromsø', stayCost: 3500,
    activityCost: 5500, booked: false
  },
  {
    day: 4, country: 'Norway', location: '特羅姆瑟 -> 卑爾根', title: '前往卑爾根',
    content: '飛往挪威西岸明珠卑爾根，漫步世界遺產布呂根(Bryggen)老木屋區並品嚐海鮮',
    transportType: 'Flight', transportDetail: 'TOS -> BGO', transportCost: 6000,
    stayName: 'Zander K Hotel', stayCost: 3000,
    activityCost: 2000, booked: false
  },
  {
    day: 5, country: 'Norway', location: '卑爾根(Bergen)', title: '挪威縮影峽灣一日',
    content: '搭乘挪威縮影：火車-> 渡輪 -> 高山火車一日遊感受壯觀峽灣美景',
    transportType: 'Train/Boat', transportDetail: 'Nutshell Pass', transportCost: 8500,
    stayName: 'Zander K Hotel', stayCost: 3000,
    activityCost: 1500, booked: false
  },
  {
    day: 6, country: 'Norway', location: '卑爾根-> 冰島', title: '告別挪威、飛往冰島',
    content: '早上自由活動，下午飛往冰島凱夫拉維克國際機場(KEF)，接駁巴士前往首都雷克雅維克住宿',
    transportType: 'Flight', transportDetail: 'BGO -> KEF', transportCost: 6500,
    stayName: '凱夫拉維克民宿', stayCost: 3000,
    activityCost: 1500, booked: false
  },

  // --- ICELAND (9天) ---
  {
    day: 7, country: 'Iceland', location: '凱夫拉維克 -> 斯奈山半島', title: '斯奈山半島探險',
    content: '取車後開始環島：德爾達圖赫菲溫泉、熔岩瀑布、阿納斯塔皮、Lóndrangar、Djúpalónssandur黑沙灘、教會山(Kirkjufell)拍攝冰島最經典景點、晚餐推薦Skar Restaurant',
    transportType: 'Car', transportDetail: '租車自駕', transportCost: 2500,
    stayName: 'Kirkjufell View Cottages I', stayCost: 4000,
    activityCost: 1000, booked: false
  },
  {
    day: 8, country: 'Iceland', location: '斯奈山 -> 阿克雷里', title: '西北峽灣之旅',
    content: '取車後：教會山(日出)、Kolgrafarfjörður海豹區、隱藏人雕像、綠頂教堂(Blöndúóskirkja)、午餐66 outlet、Brynja冰淇淋、夜宿北部首都阿克雷里',
    transportType: 'Car', transportDetail: '租車自駕', transportCost: 2000,
    stayName: 'Hörgsársveit Akureyri', stayCost: 3500,
    activityCost: 1000, booked: false
  },
  {
    day: 9, country: 'Iceland', location: '阿克雷里 -> 米湖', title: '眾神瀑布與地熱',
    content: '取車後：眾神瀑布、地熱噴泉Hverir、克拉夫啦火山口、米湖溫泉SPA、晚餐推薦Vogafjós Farm',
    transportType: 'Car', transportDetail: '租車自駕', transportCost: 1500,
    stayName: 'Sel Hotel Mývatn', stayCost: 4500,
    activityCost: 3500, booked: false
  },
  {
    day: 10, country: 'Iceland', location: '米湖 -> Egilsstaðir', title: '東峽灣冒險',
    content: '取車後：黛提瀑布(Dettifoss)力量之泉、隱藏峽谷(Stuðlagil)玄武岩柱峽谷、東部峽灣風光海岸線',
    transportType: 'Car', transportDetail: '租車自駕', transportCost: 2000,
    stayName: 'Cozy apartment in Egilsstaðir', stayCost: 3000,
    activityCost: 1000, booked: false
  },
  {
    day: 11, country: 'Iceland', location: 'Egilsstaðir -> 赫本', title: '維京村與冰河',
    content: '取車後：東部39號公路經過維京村、午餐選擇赫本龍蝦餐廳、冰川健行推薦選擇(自駕導遊)、晚餐推薦Pakkhús 餐廳',
    transportType: 'Car', transportDetail: '租車自駕', transportCost: 2000,
    stayName: 'Brunnhóll Country Guesthouse', stayCost: 3500,
    activityCost: 3000, booked: false
  },
  {
    day: 12, country: 'Iceland', location: '傑古沙龍冰河湖', title: '鑽石沙灘冰河湖',
    content: '早餐後：傑古沙龍冰河湖搭船探險、鑽石沙灘欣賞冰塊、傑古沙龍冰河健行團',
    transportType: 'Car', transportDetail: '租車自駕', transportCost: 1500,
    stayName: 'Hörgsland cottages', stayCost: 4000,
    activityCost: 6000, booked: false
  },
  {
    day: 13, country: 'Iceland', location: '傑古沙龍 -> Vík', title: '南岸黑沙灘與冰河',
    content: '早餐後：斯卡夫塔山(Skaftafell)國家公園、黑瀑布(Svartifoss)健行、熔岩苔原(Eldhraun)、黑沙灘(Reynisfjara)',
    transportType: 'Car', transportDetail: '租車自駕', transportCost: 1500,
    stayName: 'The Gilitrutt apartment (Vík)', stayCost: 3500,
    activityCost: 4500, booked: false
  },
  {
    day: 14, country: 'Iceland', location: 'Vík -> 凱夫拉維克', title: '黃金圈巡禮',
    content: '取車後：塞里雅蘭瀑布(Seljalandsfoss)、彩虹瀑布(Skógafoss)、黃金瀑布(Gullfoss)、間歇泉、法西、凱瑞斯火山口(Kerið)、晚餐推薦美食街',
    transportType: 'Car', transportDetail: '租車自駕', transportCost: 1500,
    stayName: '民宿 D Hekla Horizon', stayCost: 5000,
    activityCost: 2000, booked: false
  },
  {
    day: 15, country: 'Iceland', location: '雷克雅維克 -> 機場', title: '辛格維爾與藍湖溫泉',
    content: '取車後：聯合國世界遺產辛格維爾(Þingvellir)國家公園、Öxarárfoss瀑布、下午藍湖溫泉(Blue Lagoon)放鬆、還車返回',
    transportType: 'Car', transportDetail: '租車/還車', transportCost: 1000,
    stayName: 'House in the Garden (KEF)', stayCost: 3000,
    activityCost: 5000, booked: false
  },

  // --- NETHERLANDS (4天) ---
  {
    day: 16, country: 'Netherlands', location: '冰島 -> 荷蘭', title: '飛往鬱金香國度',
    content: '早上自由活動，傍晚飛往阿姆斯特丹史基浦機場(AMS)，晚上入住市區飯店休息',
    transportType: 'Flight', transportDetail: 'KEF -> AMS', transportCost: 5500,
    stayName: 'Hotel Casa Amsterdam', stayCost: 3000,
    activityCost: 1500, booked: false
  },
  {
    day: 17, country: 'Netherlands', location: '庫肯霍夫 (Keukenhof)', title: '鬱金香花園',
    content: '全日暢遊世界最大的鬱金香花園，賞花拍照休息',
    transportType: 'Bus', transportDetail: 'Bus', transportCost: 1000,
    stayName: 'Hotel Casa Amsterdam', stayCost: 3000,
    activityCost: 2500, booked: false
  },
  {
    day: 18, country: 'Netherlands', location: '阿姆斯特丹', title: '運河遊船',
    content: '博物館參觀、運河遊船、購物行程',
    transportType: 'Tram', transportDetail: 'GVB', transportCost: 500,
    stayName: 'Hotel Casa Amsterdam', stayCost: 3000,
    activityCost: 3000, booked: false
  },
  {
    day: 19, country: 'Netherlands', location: '羊角村(Giethoorn)', title: '威尼斯之旅',
    content: '搭船遊覽荷蘭威尼斯、美食探訪',
    transportType: 'Train', transportDetail: 'Train', transportCost: 1800,
    stayName: 'Hotel Casa Amsterdam', stayCost: 3000,
    activityCost: 1500, booked: false
  },
  {
    day: 20, country: 'Netherlands', location: '鹿特丹與海牙', title: '現代建築之旅',
    content: '參觀Markthal 市集、現代建築群',
    transportType: 'Train', transportDetail: 'Train', transportCost: 1200,
    stayName: 'Hotel Casa Amsterdam', stayCost: 3000,
    activityCost: 1500, booked: false
  },
  {
    day: 21, country: 'Netherlands', location: '阿姆斯特丹 -> 台北', title: '返回溫暖的家',
    content: '前往機場、搭機返回台灣',
    transportType: 'Train', transportDetail: 'To Airport', transportCost: 500,
    stayName: 'Home', stayCost: 0,
    activityCost: 2000, booked: false
  },
];
