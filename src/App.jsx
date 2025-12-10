import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signInWithCustomToken
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  onSnapshot,
  deleteDoc,
  addDoc
} from 'firebase/firestore';
import {
  Plane,
  MapPin,
  Calendar,
  DollarSign,
  CheckSquare,
  Trash2,
  Plus,
  Minus,
  Edit3,
  RefreshCw,
  Sun,
  BedDouble,
  Search,
  PieChart,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Building,
  Home,
  Train,
  Car,
  AlertTriangle,
  MessageSquare,
  ThumbsUp,
  X
} from 'lucide-react';

// --- ⚠️ 重要：GitHub 部署專用設定區 ---
// 請到 Firebase Console -> 專案設定 -> 複製您的設定貼在下面
const firebaseConfig = {
  apiKey: "AIzaSyA62-FtygzqoVWIIghD6s2Qm9PrBj07YKg",
  authDomain: "trip-32785.firebaseapp.com",
  projectId: "trip-32785",
  storageBucket: "trip-32785.firebasestorage.app",
  messagingSenderId: "680098556698",
  appId: "1:680098556698:web:05ff8c022d013011bc9aa3",
  measurementId: "G-C57B5EH1S2"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 設定一個固定的 ID 來儲存您的行程 (您可以隨意更改這個名稱)
const appId = 'my-trip-2027';

// --- Toast Notification Component ---
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-gray-800 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  return (
    <div className={`fixed bottom-4 right-4 ${bgColors[type] || bgColors.info} px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-fade-in-up`}>
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onClose} className="hover:opacity-75"><X className="w-4 h-4" /></button>
    </div>
  );
};

// --- Default Data for 2027 Trip ---
const DEFAULT_ITINERARY = [
  // --- NORWAY (3月底) ---
  {
    day: 1, country: 'Norway', location: '奧斯陸 (Oslo)', title: '抵達奧斯陸',
    content: '抵達奧斯陸機場(OSL)，搭乘 Flytoget至市區。參觀歌劇院、卡爾約翰斯大道。',
    transportType: 'Flight', transportDetail: 'TPE -> OSL', transportCost: 0,
    stayName: 'Comfort Hotel Xpress', stayCost: 2500,
    activityCost: 1500, booked: false
  },
  {
    day: 2, country: 'Norway', location: '奧斯陸 -> 特羅姆瑟', title: '飛往北極圈',
    content: '上午參觀孟克博物館。下午搭機前往極光之都特羅姆瑟。',
    transportType: 'Flight', transportDetail: 'OSL -> TOS', transportCost: 4500,
    stayName: 'Smarthotel Tromsø', stayCost: 3500,
    activityCost: 2000, booked: false
  },
  {
    day: 3, country: 'Norway', location: '特羅姆瑟 (Tromsø)', title: '極光纜車與雪景',
    content: '搭乘 Fjellheisen 纜車俯瞰夜景。晚上參加極光團 (3月底最後機會)。',
    transportType: 'None', transportDetail: '', transportCost: 0,
    stayName: 'Smarthotel Tromsø', stayCost: 3500,
    activityCost: 5500, booked: false
  },
  {
    day: 4, country: 'Norway', location: '特羅姆瑟 -> 卑爾根', title: '前進峽灣門戶',
    content: '飛往卑爾根。遊覽布呂根 (Bryggen) 彩色木屋群與魚市場。',
    transportType: 'Flight', transportDetail: 'TOS -> BGO', transportCost: 6000,
    stayName: 'Zander K Hotel', stayCost: 3000,
    activityCost: 2000, booked: false
  },
  {
    day: 5, country: 'Norway', location: '卑爾根 (Bergen)', title: '挪威縮影一日遊',
    content: '經典行程：火車 -> 峽灣遊船 -> 高山火車。這天住同一間飯店省行李移動。',
    transportType: 'Train/Boat', transportDetail: 'Nutshell Pass', transportCost: 8500,
    stayName: 'Zander K Hotel', stayCost: 3000,
    activityCost: 1500, booked: false
  },
  {
    day: 6, country: 'Norway', location: '卑爾根 -> 冰島', title: '告別挪威，飛往冰島',
    content: '下午搭機飛往冰島雷克雅維克 (KEF)。機場取車，準備開始環島之旅。',
    transportType: 'Flight', transportDetail: 'BGO -> KEF', transportCost: 6500,
    stayName: '雷克雅維克市區', stayCost: 3000,
    activityCost: 1500, booked: false
  },

  // --- ICELAND (UPDATED 9 DAYS) ---
  {
    day: 7, country: 'Iceland', location: '雷克雅維克 -> 斯奈山半島', title: '斯奈山半島一日遊',
    content: '景點：彩虹街、哈爾格林姆教堂、太陽航海者、海豹海灘、Ingjalshóll教堂、Kissing bench、教會山(Kirkjufell)、峽灣大橋。晚餐：Skar Restaurant。',
    transportType: 'Car', transportDetail: '租車自駕', transportCost: 2500,
    stayName: 'Kirkjufell View Cottages I', stayCost: 4000,
    activityCost: 1000, booked: false
  },
  {
    day: 8, country: 'Iceland', location: '斯奈山 -> 阿克雷里', title: '前進北部之都',
    content: '景點：教會山(補拍)、Kolgrafarfjörður峽灣、巨人峽谷、現代風教堂(Blönduóskirkja)、阿克雷里教堂、N66 outlet、Brynja冰淇淋、阿克雷里觀景點。',
    transportType: 'Car', transportDetail: '租車自駕', transportCost: 2000,
    stayName: 'Hörgársveit Akureyri', stayCost: 3500,
    activityCost: 1000, booked: false
  },
  {
    day: 9, country: 'Iceland', location: '阿克雷里 -> 米湖', title: '鑽石圈與地熱',
    content: '景點：眾神瀑布、婚紗瀑布、地洞溫泉、Hverir地熱谷、Krafla火口湖、黑色城堡、惠爾山。體驗：米湖溫泉。晚餐：Vogafjós Farm。',
    transportType: 'Car', transportDetail: '租車自駕', transportCost: 1500,
    stayName: 'Sel Hotel Mývatn', stayCost: 4500,
    activityCost: 3500, booked: false
  },
  {
    day: 10, country: 'Iceland', location: '米湖 -> Egilsstaðir', title: '峽谷與東部',
    content: '景點：偽火山口、黛提瀑布(Dettifoss)、馬蹄峽谷、玄武岩峽谷(Stuðlagil)、小男孩峽谷、彩虹步道教堂。',
    transportType: 'Car', transportDetail: '租車自駕', transportCost: 2000,
    stayName: 'Cozy apartment in Egilsstaðir', stayCost: 3000,
    activityCost: 1000, booked: false
  },
  {
    day: 11, country: 'Iceland', location: 'Egilsstaðir -> 霍芬', title: '金字塔山與龍蝦',
    content: '景點：紅條紋亨吉瀑布、939公路、金字塔聖山、蛋蛋港口、古老紅屋、蝙蝠山(倒影山)。晚餐：Pakkhús 龍蝦餐廳。',
    transportType: 'Car', transportDetail: '租車自駕', transportCost: 2000,
    stayName: 'Brunnhóll Country Guesthouse', stayCost: 3500,
    activityCost: 3000, booked: false
  },
  {
    day: 12, country: 'Iceland', location: '冰河湖區', title: '藍冰洞與鑽石沙灘',
    content: '活動：藍冰洞探險、傑古沙龍冰河湖遊船(Jökulsárlón)。景點：鑽石沙灘、小冰河湖、大羽毛峽谷。',
    transportType: 'Car', transportDetail: '租車自駕', transportCost: 1500,
    stayName: 'Hörgsland cottages', stayCost: 4000,
    activityCost: 6000, booked: false
  },
  {
    day: 13, country: 'Iceland', location: '冰河湖 -> Vík', title: '冰川健行與黑沙灘',
    content: '活動：冰川健行(Skaftafell)。景點：玄武岩瀑布(Svartifoss)、羽毛峽谷、苔原(Eldhraun)、尤達洞穴、黑沙灘(Reynisfjara)。',
    transportType: 'Car', transportDetail: '租車自駕', transportCost: 1500,
    stayName: 'The Gilitrutt apartment (Vík)', stayCost: 3500,
    activityCost: 4500, booked: false
  },
  {
    day: 14, country: 'Iceland', location: 'Vík -> 雷克雅維克', title: '南岸瀑布巡禮',
    content: '景點：彩虹瀑布(Skógafoss)、水簾洞(Seljalandsfoss)、古佛斯瀑布(Gullfoss)、間歇泉、藍色秘境瀑布、火口湖(Kerið)。午餐：蕃茄農場。',
    transportType: 'Car', transportDetail: '租車自駕', transportCost: 1500,
    stayName: 'ÖÖD Hekla Horizon', stayCost: 5000,
    activityCost: 2000, booked: false
  },
  {
    day: 15, country: 'Iceland', location: '黃金圈 -> 機場', title: '國家公園與藍湖',
    content: '景點：辛格韋德利國家公園(Þingvellir)、板塊裂縫浮潛、Öxarárfoss。放鬆：藍湖溫泉(Blue Lagoon)。入住機場附近。',
    transportType: 'Car', transportDetail: '租車/還車', transportCost: 1000,
    stayName: 'House in the Garden (KEF)', stayCost: 3000,
    activityCost: 5000, booked: false
  },

  // --- NETHERLANDS (4月中) ---
  {
    day: 16, country: 'Netherlands', location: '冰島 -> 荷蘭', title: '飛往鬱金香國度',
    content: '清晨搭機飛往阿姆斯特丹 (AMS)。入住方便前往花田的區域。',
    transportType: 'Flight', transportDetail: 'KEF -> AMS', transportCost: 5500,
    stayName: 'Hotel Casa Amsterdam', stayCost: 3000,
    activityCost: 1500, booked: false
  },
  {
    day: 17, country: 'Netherlands', location: '庫肯霍夫 (Keukenhof)', title: '鬱金香花季',
    content: '整天在花園賞花。租腳踏車遊花田。',
    transportType: 'Bus', transportDetail: 'Bus', transportCost: 1000,
    stayName: 'Hotel Casa Amsterdam', stayCost: 3000,
    activityCost: 2500, booked: false
  },
  {
    day: 18, country: 'Netherlands', location: '阿姆斯特丹', title: '博物館日',
    content: '國家博物館、梵谷博物館。運河遊船。',
    transportType: 'Tram', transportDetail: 'GVB', transportCost: 500,
    stayName: 'Hotel Casa Amsterdam', stayCost: 3000,
    activityCost: 3000, booked: false
  },
  {
    day: 19, country: 'Netherlands', location: '羊角村 (Giethoorn)', title: '童話小鎮',
    content: '火車轉公車。租電動船。',
    transportType: 'Train', transportDetail: 'Train', transportCost: 1800,
    stayName: 'Hotel Casa Amsterdam', stayCost: 3000,
    activityCost: 1500, booked: false
  },
  {
    day: 20, country: 'Netherlands', location: '鹿特丹/風車村', title: '現代與傳統',
    content: '方塊屋、Markthal 市場。',
    transportType: 'Train', transportDetail: 'Train', transportCost: 1200,
    stayName: 'Hotel Casa Amsterdam', stayCost: 3000,
    activityCost: 1500, booked: false
  },
  {
    day: 21, country: 'Netherlands', location: '阿姆斯特丹 -> 返程', title: '滿載而歸',
    content: '最後採買。前往史基浦機場搭機。',
    transportType: 'Train', transportDetail: 'To Airport', transportCost: 500,
    stayName: 'Home', stayCost: 0,
    activityCost: 2000, booked: false
  },
];

// --- Sub-Components ---

const FlightCard = ({ flight, onDelete, onUpdate, onSync, days }) => {
  const getGoogleFlightsLink = () => {
    const query = encodeURIComponent(`flights ${flight.origin || ''} to ${flight.destination || ''}`);
    return `https://www.google.com/search?q=${query}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 relative overflow-hidden group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 flex items-center px-2 py-1 rounded">
            <span className="text-gray-500 text-xs font-bold mr-1">DAY</span>
            <input
              type="number"
              min="1"
              className="w-8 bg-transparent text-xs font-bold outline-none text-gray-700 text-center"
              value={flight.day}
              onChange={(e) => onUpdate(flight.id, { day: parseInt(e.target.value) || 1 })}
            />
          </div>

          <a
            href={getGoogleFlightsLink()}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 text-xs font-bold flex items-center gap-1 hover:underline ml-2"
          >
            Google Flights <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <button onClick={() => onDelete(flight.id)} className="text-gray-300 hover:text-red-400">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <input
            className="font-bold text-lg text-gray-800 w-1/3 border-b border-dashed border-gray-300 focus:border-blue-500 outline-none placeholder-gray-300 bg-transparent"
            placeholder="起點 (如: TPE)"
            value={flight.origin}
            onChange={(e) => onUpdate(flight.id, { origin: e.target.value })}
          />
          <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            className="font-bold text-lg text-gray-800 w-1/3 border-b border-dashed border-gray-300 focus:border-blue-500 outline-none placeholder-gray-300 bg-transparent"
            placeholder="終點 (如: OSL)"
            value={flight.destination}
            onChange={(e) => onUpdate(flight.id, { destination: e.target.value })}
          />
        </div>
        <input
          type="text"
          placeholder="航班備註 (如: 華航 CI074...)"
          className="w-full mt-2 p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
          value={flight.details || ''}
          onChange={(e) => onUpdate(flight.id, { details: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-2 bg-blue-50/50 p-2 rounded-lg">
        <div className="flex items-center gap-2 flex-1 bg-white border border-gray-200 rounded px-2 py-1">
          <span className="text-gray-400 text-sm">價格:</span>
          <input
            type="number"
            className="w-full outline-none text-gray-700 font-bold"
            placeholder="0"
            value={flight.price || ''}
            onChange={(e) => onUpdate(flight.id, { price: e.target.value })}
          />
        </div>
        <button
          onClick={() => onSync(flight)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1 whitespace-nowrap"
        >
          <RefreshCw className="w-3 h-3" /> 同步至行程表
        </button>
      </div>
    </div>
  );
};

const AccommodationCard = ({ stay, onDelete, onUpdate, onSync }) => {
  const getSearchLink = (platform) => {
    const query = encodeURIComponent(stay.location || 'hotel');
    if (platform === 'airbnb') return `https://www.airbnb.com/s/${query}/homes`;
    if (platform === 'booking') return `https://www.booking.com/searchresults.html?ss=${query}`;
    return '#';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 relative overflow-hidden group">
      <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-2">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 flex items-center px-2 py-1 rounded">
            <span className="text-gray-500 text-xs font-bold mr-1">DAY</span>
            <input
              type="number"
              min="1"
              className="w-8 bg-transparent text-xs font-bold outline-none text-gray-700 text-center"
              value={stay.day}
              onChange={(e) => onUpdate(stay.id, { day: parseInt(e.target.value) || 1 })}
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-pink-500 bg-pink-50 px-2 py-1 rounded-full">
            <button
              onClick={() => onUpdate(stay.id, { nights: Math.max(1, (stay.nights || 1) - 1) })}
              className="hover:bg-pink-100 rounded-full w-4 h-4 flex items-center justify-center"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span>{stay.nights || 1} 晚</span>
            <button
              onClick={() => onUpdate(stay.id, { nights: (stay.nights || 1) + 1 })}
              className="hover:bg-pink-100 rounded-full w-4 h-4 flex items-center justify-center"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
        <button onClick={() => onDelete(stay.id)} className="text-gray-300 hover:text-red-400">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-4">
        <input
          className="font-bold text-xl text-gray-800 w-full border-none focus:ring-0 outline-none placeholder-gray-300 mb-1"
          placeholder="輸入地點 (如: Oslo, Norway)"
          value={stay.location}
          onChange={(e) => onUpdate(stay.id, { location: e.target.value })}
        />
        <div className="flex gap-3 text-xs">
          <a href={getSearchLink('airbnb')} target="_blank" rel="noreferrer" className="text-pink-500 font-bold hover:underline flex items-center gap-1">
            <Search className="w-3 h-3" /> 在 Airbnb 搜尋
          </a>
          <a href={getSearchLink('booking')} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline flex items-center gap-1">
            <Search className="w-3 h-3" /> 在 Booking.com 搜尋
          </a>
        </div>
      </div>

      <div className="mb-4 bg-gray-50 p-2 rounded-lg border border-gray-100">
        <input
          type="text"
          placeholder="輸入住宿名稱或連結 (如: City Apartment...)"
          className="w-full bg-transparent text-sm focus:outline-none text-gray-700"
          value={stay.name || ''}
          onChange={(e) => onUpdate(stay.id, { name: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1 border border-gray-200 rounded-lg px-3 py-2">
          <span className="text-gray-400 text-sm font-medium">總價:</span>
          <input
            type="number"
            className="w-full outline-none text-gray-800 font-bold"
            placeholder="0"
            value={stay.price || ''}
            onChange={(e) => onUpdate(stay.id, { price: e.target.value })}
          />
        </div>
        <button
          onClick={() => onSync(stay)}
          className="bg-gray-800 hover:bg-black text-white text-sm font-bold px-6 py-2 rounded-lg shadow-sm transition flex items-center gap-1 whitespace-nowrap"
        >
          同步至行程與預算
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [tripId, setTripId] = useState('TRIP-458LLH');
  const [activeTab, setActiveTab] = useState('itinerary');
  const [days, setDays] = useState([]);
  const [todos, setTodos] = useState([]);
  const [flights, setFlights] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDay, setEditingDay] = useState(null);
  const [newTodo, setNewTodo] = useState('');
  const [editForm, setEditForm] = useState({});
  const [deletingDayId, setDeletingDayId] = useState(null);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    const initAuth = async () => {
      // 部署到 GitHub 時，使用標準匿名登入
      // 因為我們已經假設您會在上方填寫了正確的 firebaseConfig
      await signInAnonymously(auth);
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !tripId) return;
    setLoading(true);

    // 使用標準 collection 路徑
    const itineraryRef = collection(db, 'artifacts', appId, 'users', user.uid, `${tripId}_itinerary`);
    const unsubItinerary = onSnapshot(itineraryRef, (snapshot) => {
      const loadedDays = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      loadedDays.sort((a, b) => a.day - b.day);
      setDays(loadedDays);
      setLoading(false);
    }, (error) => console.error("Error fetching itinerary:", error));

    const todoRef = collection(db, 'artifacts', appId, 'users', user.uid, `${tripId}_todos`);
    const unsubTodos = onSnapshot(todoRef, (snapshot) => {
      const loadedTodos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTodos(loadedTodos);
    }, (error) => console.error("Error fetching todos:", error));

    const flightRef = collection(db, 'artifacts', appId, 'users', user.uid, `${tripId}_flights`);
    const unsubFlights = onSnapshot(flightRef, (snapshot) => {
      const loadedFlights = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      loadedFlights.sort((a, b) => a.day - b.day);
      setFlights(loadedFlights);
    }, (error) => console.error("Error fetching flights:", error));

    const stayRef = collection(db, 'artifacts', appId, 'users', user.uid, `${tripId}_accommodations`);
    const unsubStays = onSnapshot(stayRef, (snapshot) => {
      const loadedStays = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      loadedStays.sort((a, b) => a.day - b.day);
      setAccommodations(loadedStays);
    }, (error) => console.error("Error fetching stays:", error));

    return () => {
      unsubItinerary();
      unsubTodos();
      unsubFlights();
      unsubStays();
    };
  }, [user, tripId]);

  const initializeData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const deletePromises = days.map(d =>
        deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, `${tripId}_itinerary`, d.id))
      );
      await Promise.all(deletePromises);

      const addPromises = DEFAULT_ITINERARY.map(item =>
        addDoc(collection(db, 'artifacts', appId, 'users', user.uid, `${tripId}_itinerary`), item)
      );
      await Promise.all(addPromises);
      showToast("行程已成功重置！", "success");
    } catch (error) {
      console.error("Init Error", error);
      showToast("重置失敗，請稍後再試。", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDay = async () => {
    if (!editingDay) return;
    const ref = doc(db, 'artifacts', appId, 'users', user.uid, `${tripId}_itinerary`, editingDay.id);
    const cleanData = {
      ...editForm,
      day: Number(editForm.day) || days.length + 1,
      transportCost: Number(editForm.transportCost) || 0,
      stayCost: Number(editForm.stayCost) || 0,
      activityCost: Number(editForm.activityCost) || 0,
    };
    await setDoc(ref, cleanData);
    setEditingDay(null);
    showToast("行程更新成功！", "success");
  };

  const handleAddDay = async () => {
    const nextDayNum = days.length > 0 ? Math.max(...days.map(d => d.day)) + 1 : 1;
    const newDay = {
      day: nextDayNum,
      country: 'Norway',
      location: '新地點',
      title: '新行程',
      content: '請點擊編輯輸入行程內容...',
      transportType: 'None',
      transportCost: 0,
      stayCost: 0,
      activityCost: 0,
      booked: false
    };
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, `${tripId}_itinerary`), newDay);
    showToast("已新增一天行程", "success");
  };

  const executeDeleteDay = async (id) => {
    await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, `${tripId}_itinerary`, id));
    setEditingDay(null);
    setDeletingDayId(null);
    showToast("已刪除該日行程", "info");
  };

  const handleAddFlight = async () => {
    const ref = collection(db, 'artifacts', appId, 'users', user.uid, `${tripId}_flights`);
    await addDoc(ref, { day: 1, origin: '', destination: '', details: '', price: 0, createdAt: Date.now() });
    showToast("已新增航班卡片", "success");
  };
  const handleUpdateFlight = async (id, data) => {
    const ref = doc(db, 'artifacts', appId, 'users', user.uid, `${tripId}_flights`, id);
    await setDoc(ref, data, { merge: true });
  };
  const handleDeleteFlight = async (id) => {
    const ref = doc(db, 'artifacts', appId, 'users', user.uid, `${tripId}_flights`, id);
    await deleteDoc(ref);
    showToast("已刪除航班卡片", "info");
  };
  const handleSyncFlight = async (flight) => {
    const targetDay = days.find(d => d.day === parseInt(flight.day));
    if (!targetDay) {
      showToast(`找不到 Day ${flight.day} 的行程！`, "error");
      return;
    }
    const ref = doc(db, 'artifacts', appId, 'users', user.uid, `${tripId}_itinerary`, targetDay.id);
    await setDoc(ref, {
      transportType: 'Flight',
      transportDetail: flight.details || `${flight.origin} -> ${flight.destination}`,
      transportCost: Number(flight.price) || 0
    }, { merge: true });
    showToast(`同步成功！Day ${flight.day} 交通資訊已更新。`, "success");
  };

  const handleAddAccommodation = async () => {
    const ref = collection(db, 'artifacts', appId, 'users', user.uid, `${tripId}_accommodations`);
    await addDoc(ref, { day: 1, nights: 1, location: '', name: '', price: 0, createdAt: Date.now() });
    showToast("已新增住宿卡片", "success");
  };
  const handleUpdateAccommodation = async (id, data) => {
    const ref = doc(db, 'artifacts', appId, 'users', user.uid, `${tripId}_accommodations`, id);
    await setDoc(ref, data, { merge: true });
  };
  const handleDeleteAccommodation = async (id) => {
    const ref = doc(db, 'artifacts', appId, 'users', user.uid, `${tripId}_accommodations`, id);
    await deleteDoc(ref);
    showToast("已刪除住宿卡片", "info");
  };
  const handleSyncAccommodation = async (stay) => {
    const startDay = parseInt(stay.day);
    const nights = parseInt(stay.nights) || 1;
    const costPerNight = (Number(stay.price) || 0) / nights;
    let updatedCount = 0;

    for (let i = 0; i < nights; i++) {
      const targetDayNum = startDay + i;
      const targetDay = days.find(d => d.day === targetDayNum);
      if (targetDay) {
        const ref = doc(db, 'artifacts', appId, 'users', user.uid, `${tripId}_itinerary`, targetDay.id);
        await setDoc(ref, {
          stayName: stay.name || '已預訂住宿',
          stayCost: Math.round(costPerNight)
        }, { merge: true });
        updatedCount++;
      }
    }
    if (updatedCount > 0) {
      showToast(`同步成功！已更新 ${updatedCount} 天的住宿資訊。`, "success");
    } else {
      showToast(`找不到對應的行程天數。`, "error");
    }
  };

  const costs = useMemo(() => {
    let stay = 0, transport = 0, activity = 0;
    days.forEach(d => {
      stay += Number(d.stayCost) || 0;
      transport += Number(d.transportCost) || 0;
      activity += Number(d.activityCost) || 0;
    });
    return { stay, transport, activity, total: stay + transport + activity };
  }, [days]);

  if (!user) return <div className="flex items-center justify-center h-screen text-gray-400">Loading trip planner...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-20">
      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* 1. Header Area - Gradient Background */}
      <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 text-white px-6 py-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <Plane className="w-8 h-8 fill-white" />
          北歐追光之旅 2027
        </h1>
        <p className="text-cyan-100 text-sm mb-8 pl-1 flex items-center gap-2">
          <Sun className="w-4 h-4" />
          挪威峽灣・冰島環島・荷蘭花季
        </p>

        {/* TRIP CODE and TOTAL BUDGET Box */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between border border-white/30">
          <div className="flex items-center gap-3">
            <span className="text-cyan-100 font-medium text-sm uppercase tracking-wide">TRIP CODE</span>
            <input
              type="text"
              value={tripId}
              onChange={(e) => setTripId(e.target.value.toUpperCase())}
              className="bg-transparent font-mono font-bold text-white text-lg w-32 focus:outline-none uppercase placeholder-white/50"
              placeholder="TRIP-2027"
            />
          </div>
          <div className="text-right">
            <p className="text-cyan-100 text-xs uppercase tracking-wide">TOTAL BUDGET</p>
            <p className="text-2xl font-bold">${costs.total.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* 2. Tabs Navigation - Pill Style */}
      <div className="bg-white sticky top-0 z-20 px-6 py-3 flex justify-center">
        <div className="bg-gray-100 rounded-full p-1 flex gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`flex items-center gap-2 py-2 px-4 rounded-full transition font-medium text-sm whitespace-nowrap ${activeTab === 'itinerary' ? 'bg-slate-800 text-white shadow-md' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <Calendar className="w-4 h-4" /> 行程表
          </button>
          <button
            onClick={() => setActiveTab('flight')}
            className={`flex items-center gap-2 py-2 px-4 rounded-full transition font-medium text-sm whitespace-nowrap ${activeTab === 'flight' ? 'bg-slate-800 text-white shadow-md' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <Plane className="w-4 h-4" /> 機票
          </button>
          <button
            onClick={() => setActiveTab('stay')}
            className={`flex items-center gap-2 py-2 px-4 rounded-full transition font-medium text-sm whitespace-nowrap ${activeTab === 'stay' ? 'bg-slate-800 text-white shadow-md' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <BedDouble className="w-4 h-4" /> 住宿
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`flex items-center gap-2 py-2 px-4 rounded-full transition font-medium text-sm whitespace-nowrap ${activeTab === 'budget' ? 'bg-slate-800 text-white shadow-md' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <PieChart className="w-4 h-4" /> 預算
          </button>
          <button
            onClick={() => setActiveTab('todo')}
            className={`flex items-center gap-2 py-2 px-4 rounded-full transition font-medium text-sm whitespace-nowrap ${activeTab === 'todo' ? 'bg-slate-800 text-white shadow-md' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <CheckSquare className="w-4 h-4" /> 清單
          </button>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="bg-gray-50 px-6 py-6 min-h-[500px]">

        {days.length === 0 && !loading && (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm max-w-lg mx-auto mt-8">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plane className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl text-gray-800 font-bold mb-3">開啟您的旅程</h3>
            <p className="text-gray-400 text-sm mb-2">目前還沒有行程資料。</p>
            <p className="text-blue-500 text-sm mb-8">您可以輸入上方的代碼，或載入範本。</p>
            <button
              onClick={initializeData}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold transition shadow-lg shadow-blue-200"
            >
              載入 21 天完整行程
            </button>
          </div>
        )}

        {/* Itinerary List */}
        {activeTab === 'itinerary' && (
          <div className="space-y-4 pb-10">
            <div className="flex justify-end">
              <button onClick={initializeData} className="text-xs text-gray-300 hover:text-red-400 flex items-center gap-1"><RefreshCw className="w-3 h-3" /> 重置</button>
            </div>

            {days.length > 0 && days.map((day) => (
              <div key={day.id} className="flex gap-4 items-start">
                <div className="flex flex-col items-center pt-2 min-w-[3rem]">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">DAY</span>
                  <span className="text-2xl font-black text-gray-700">{day.day}</span>
                </div>

                {editingDay?.id === day.id ? (
                  <div className="flex-1 bg-white rounded-2xl shadow-lg p-5 border-2 border-blue-100 z-10">
                    <div className="mb-4">
                      <label className="text-xs font-bold text-gray-400 block mb-1">日期天數 (Day)</label>
                      <input className="w-20 font-black text-xl border-b border-gray-200 focus:border-blue-500 outline-none py-1" type="number" value={editForm.day} onChange={e => setEditForm({ ...editForm, day: e.target.value })} />
                    </div>
                    <div className="mb-4">
                      <label className="text-xs font-bold text-gray-400">標題</label>
                      <input className="w-full text-lg font-bold border-b border-gray-200 focus:border-blue-500 outline-none py-1" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                    </div>
                    <div className="mb-4">
                      <label className="text-xs font-bold text-gray-400">地點</label>
                      <input className="w-full text-sm border-b border-gray-200 focus:border-blue-500 outline-none py-1" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} />
                    </div>
                    <div className="mb-4">
                      <label className="text-xs font-bold text-gray-400">內容</label>
                      <textarea className="w-full text-sm border rounded p-2 mt-1 h-20" value={editForm.content} onChange={e => setEditForm({ ...editForm, content: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400">住宿費</label>
                        <input type="number" className="w-full border rounded p-1 text-sm" value={editForm.stayCost} onChange={e => setEditForm({ ...editForm, stayCost: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400">交通費</label>
                        <input type="number" className="w-full border rounded p-1 text-sm" value={editForm.transportCost} onChange={e => setEditForm({ ...editForm, transportCost: e.target.value })} />
                      </div>
                    </div>

                    {/* Delete Confirmation UI */}
                    <div className="flex justify-between items-center mt-2 border-t border-gray-100 pt-3">
                      {deletingDayId === day.id ? (
                        <div className="flex items-center gap-2 bg-red-50 px-2 py-1 rounded">
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                          <span className="text-xs text-red-600 font-bold">確定刪除此日?</span>
                          <button
                            onClick={() => executeDeleteDay(day.id)}
                            className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600 transition"
                          >
                            確定
                          </button>
                          <button
                            onClick={() => setDeletingDayId(null)}
                            className="bg-white text-gray-500 text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
                          >
                            取消
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setDeletingDayId(day.id)} className="text-red-400 text-xs flex items-center gap-1 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition">
                          <Trash2 className="w-3 h-3" /> 刪除此日
                        </button>
                      )}

                      <div className="flex gap-2">
                        <button onClick={() => setEditingDay(null)} className="px-4 py-2 text-gray-500 text-sm hover:bg-gray-100 rounded-lg">取消</button>
                        <button onClick={handleUpdateDay} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-md">儲存</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex-1 bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition cursor-pointer"
                    onClick={() => { setEditingDay(day); setEditForm(day); }}
                  >
                    {/* Country Tag and Location */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs font-bold text-white px-2 py-1 rounded uppercase ${day.country === 'Norway' ? 'bg-blue-500' :
                        day.country === 'Iceland' ? 'bg-cyan-500' : 'bg-orange-500'
                        }`}>
                        {day.country === 'Norway' ? 'NORWAY' : day.country === 'Iceland' ? 'ICELAND' : 'NETHERLANDS'}
                      </span>
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {day.location.split(' ')[0]}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-blue-600 mb-2">{day.title}</h3>

                    {/* Content */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {day.content}
                    </p>

                    {/* Hotel and Transport Info */}
                    <div className="flex items-center gap-4 mb-3">
                      {day.stayName && (
                        <div className="flex items-center gap-2 text-gray-500 text-sm bg-gray-50 px-3 py-1.5 rounded-lg">
                          <BedDouble className="w-4 h-4 text-gray-400" />
                          <span className="truncate max-w-[120px]">{day.stayName}</span>
                        </div>
                      )}
                      {day.transportDetail && (
                        <div className="flex items-center gap-2 text-gray-500 text-sm bg-gray-50 px-3 py-1.5 rounded-lg">
                          <Plane className="w-4 h-4 text-gray-400" />
                          <span>{day.transportDetail}</span>
                        </div>
                      )}
                    </div>

                    {/* Daily Total */}
                    <div className="flex justify-end pt-3 border-t border-gray-100">
                      <span className="text-gray-400 text-xs uppercase tracking-wide mr-2">DAILY TOTAL</span>
                      <span className="font-bold text-gray-700">
                        ${(Number(day.stayCost || 0) + Number(day.transportCost || 0) + Number(day.activityCost || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={handleAddDay}
              className="w-full border-2 border-dashed border-blue-200 text-blue-500 font-bold rounded-xl py-4 hover:bg-blue-50 transition flex items-center justify-center gap-2 mt-4"
            >
              <Plus className="w-5 h-5" /> 新增一天行程
            </button>
          </div>
        )}

        {/* Flight Search Tab */}
        {activeTab === 'flight' && (
          <div className="pb-10">
            {flights.map(flight => (
              <FlightCard
                key={flight.id}
                flight={flight}
                days={days}
                onDelete={handleDeleteFlight}
                onUpdate={handleUpdateFlight}
                onSync={handleSyncFlight}
              />
            ))}
            <button onClick={handleAddFlight} className="w-full border-2 border-dashed border-blue-200 text-blue-500 font-bold rounded-xl py-4 hover:bg-blue-50 transition flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> 新增航班計畫
            </button>
          </div>
        )}

        {/* Accommodation Search Tab */}
        {activeTab === 'stay' && (
          <div className="pb-10">
            {accommodations.map(stay => (
              <AccommodationCard
                key={stay.id}
                stay={stay}
                onDelete={handleDeleteAccommodation}
                onUpdate={handleUpdateAccommodation}
                onSync={handleSyncAccommodation}
              />
            ))}
            <button onClick={handleAddAccommodation} className="w-full border-2 border-dashed border-gray-300 text-gray-500 font-bold rounded-xl py-4 hover:bg-gray-50 transition flex items-center justify-center gap-2">
              <Building className="w-5 h-5" /> 新增住宿計畫
            </button>
          </div>
        )}

        {/* Budget List */}
        {activeTab === 'budget' && (
          <div className="space-y-4">
            {/* Budget Dashboard Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm text-center">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BedDouble className="w-5 h-5 text-pink-500" />
                </div>
                <div className="text-xs text-gray-400 mb-1">住宿</div>
                <div className="font-bold text-pink-500 text-xl">${costs.stay.toLocaleString()}</div>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plane className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-xs text-gray-400 mb-1">交通</div>
                <div className="font-bold text-blue-500 text-xl">${costs.transport.toLocaleString()}</div>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm text-center">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sun className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-xs text-gray-400 mb-1">活動</div>
                <div className="font-bold text-orange-500 text-xl">${costs.activity.toLocaleString()}</div>
              </div>
            </div>

            {/* Total Cost Card - Dark */}
            <div className="bg-slate-800 rounded-2xl p-8 text-center text-white">
              <p className="text-gray-300 text-xs uppercase tracking-wider mb-2">TOTAL ESTIMATED COST</p>
              <p className="text-4xl font-bold">${costs.total.toLocaleString()}</p>
            </div>

            {/* Daily Breakdown */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 font-medium text-gray-600 flex items-center gap-2">
                <PieChart className="w-4 h-4" /> 每日明細
              </div>
              {days.map(day => {
                const dayTotal = Number(day.stayCost || 0) + Number(day.transportCost || 0) + Number(day.activityCost || 0);
                if (dayTotal === 0) return null;
                return (
                  <div key={day.id} className="flex justify-between px-4 py-3 border-t border-gray-50 text-sm items-center">
                    <div className="flex gap-3 items-center">
                      <span className="font-bold text-gray-400 bg-gray-100 rounded px-2 py-1 text-xs">D{day.day}</span>
                      <div className="flex flex-col">
                        <span className="text-gray-700 font-medium">{day.title}</span>
                        <div className="flex gap-2 text-xs mt-1">
                          {day.stayCost > 0 && <span className="text-pink-500 bg-pink-50 px-1.5 py-0.5 rounded">住</span>}
                          {day.transportCost > 0 && <span className="text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">行</span>}
                          {day.activityCost > 0 && <span className="text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">樂</span>}
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-gray-800">${dayTotal.toLocaleString()}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Todo List */}
        {activeTab === 'todo' && (
          <div>
            {/* Add Todo Input */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newTodo.trim()) return;
                addDoc(collection(db, 'artifacts', appId, 'users', user.uid, `${tripId}_todos`), { text: newTodo, completed: false, createdAt: Date.now() });
                setNewTodo('');
                showToast("已新增待辦事項", "success");
              }} className="flex gap-3">
                <input
                  type="text"
                  placeholder="新增待辦事項 (如: 買網卡、換歐元)..."
                  className="flex-1 bg-gray-50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 border border-gray-100"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                />
                <button type="submit" className="bg-slate-800 text-white p-3 rounded-lg hover:bg-slate-700 transition">
                  <Plus className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Empty State */}
            {todos.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckSquare className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-400 text-sm">目前沒有待辦事項</p>
              </div>
            )}

            {/* Todo Items */}
            {todos.map(todo => (
              <div key={todo.id} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm mb-3">
                <button
                  onClick={() => setDoc(doc(db, 'artifacts', appId, 'users', user.uid, `${tripId}_todos`, todo.id), { completed: !todo.completed }, { merge: true })}
                  className={`p-1 rounded-full transition ${todo.completed ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'}`}
                >
                  <CheckCircle2 className="w-6 h-6" fill={todo.completed ? "currentColor" : "none"} />
                </button>
                <span className={`flex-1 ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  {todo.text}
                </span>
                <button onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, `${tripId}_todos`, todo.id))} className="text-gray-300 hover:text-red-500 p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}