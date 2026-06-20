import React, { useState } from "react";
import { Restaurant, MenuItem, CartItem, Order, UserProfile, OrderStatus } from "../types";
import { Search, MapPin, Phone, Star, ShoppingBag, Plus, Minus, Trash2, CheckCircle2, ShoppingCart, Clock } from "lucide-react";

const getDishImage = (dishName: string): string => {
  const normalized = dishName.trim();
  switch (normalized) {
    // 主食
    case "糙米飯":
      return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300";
    case "有機白米飯":
    case "白米飯":
      return "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300";
    case "海苔飯":
      return "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=300";
    case "玉米炒飯":
      return "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=300";

    // 主菜
    case "茄汁雞肉":
      return "https://images.unsplash.com/photo-1626700051175-6518c4793f0b?auto=format&fit=crop&q=80&w=300";
    case "咖哩豬肉":
      return "https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&q=80&w=300";
    case "糖醋魚":
      return "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=300";
    case "鹽燒豬肉":
      return "https://images.unsplash.com/photo-1602404077122-2940b362ad03?auto=format&fit=crop&q=80&w=300";
    case "香滷雞腿":
      return "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=300";

    // 副菜 / 蔬菜 / 附餐
    case "菜脯炒蛋":
      return "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=300";
    case "有機小白菜":
    case "小白菜":
      return "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&q=80&w=300";
    case "玉米餅":
    case "玉米餅X1":
      return "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=300";
    case "有機黑木耳小松菜":
      return "https://images.unsplash.com/photo-1515003844-1098154e7f14?auto=format&fit=crop&q=80&w=300";
    case "小番茄":
      return "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=300";
    case "鐵板燒豬":
      return "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=300";
    case "油菜":
      return "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=300";
    case "雞絲高麗":
      return "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=300";
    case "有機青江菜":
      return "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=300";
    case "珍菇炒蛋":
      return "https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&q=80&w=300";

    // 湯品
    case "榨菜肉絲湯":
      return "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=300";
    case "綠豆麥片":
      return "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=300";
    case "海芽蔬菜湯":
      return "https://images.unsplash.com/photo-1547592165-e1d17fed6006?auto=format&fit=crop&q=80&w=300";
    case "玉米蔬菜湯":
      return "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=300";
    case "好彩頭雞湯":
      return "https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?auto=format&fit=crop&q=80&w=300";

    default:
      return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300";
  }
};

interface CustomerViewProps {
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  orders: Order[];
  currentUser: UserProfile;
  cart: CartItem[];
  onAddToCart: (item: MenuItem) => void;
  onRemoveFromCart: (itemId: string) => void;
  onUpdateCartQuantity: (itemId: string, qty: number) => void;
  onClearCart: () => void;
  onCreateOrder: (address: string, notes: string) => Promise<void>;
  currentNav: "browse" | "cart" | "orders";
  onNavigate: (view: "browse" | "cart" | "orders") => void;
}

export default function CustomerView({
  restaurants,
  menuItems,
  orders,
  currentUser,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onUpdateCartQuantity,
  onClearCart,
  onCreateOrder,
  currentNav,
  onNavigate,
}: CustomerViewProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("全部");
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser.address || "臺北市大安區和平東路二段94號(國立臺北教育大學附設實驗國民小學)");
  const [notes, setNotes] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedSchoolLunchDay, setSelectedSchoolLunchDay] = useState<string>("星期一 (Monday)");

  const WEEKDAYS = [
    "星期一 (Monday)",
    "星期二 (Tuesday)",
    "星期三 (Wednesday)",
    "星期四 (Thursday)",
    "星期五 (Friday)"
  ];

  // Filter cuisines list
  const cuisines = ["全部", ...Array.from(new Set(restaurants.map((r) => r.cuisine)))];

  // Filter restaurants and guarantee School Lunch sits at the absolute top
  const filteredRestaurants = restaurants
    .filter((r) => {
      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            r.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCuisine = selectedCuisine === "全部" || r.cuisine === selectedCuisine;
      return matchesSearch && matchesCuisine && r.isActive;
    })
    .sort((a, b) => {
      if (a.id === "rest_school_lunch") return -1;
      if (b.id === "rest_school_lunch") return 1;
      return 0;
    });

  const cartTotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsOrdering(true);
    try {
      await onCreateOrder(deliveryAddress, notes);
      setOrderSuccess(true);
      onClearCart();
      setNotes("");
      setTimeout(() => {
        setOrderSuccess(false);
        onNavigate("orders");
      }, 2500);
    } catch (error) {
      console.error(error);
    } finally {
      setIsOrdering(false);
    }
  };

  // Status mapping
  const getStatusBadge = (status: OrderStatus) => {
    const map: { [key in OrderStatus]: { text: string; color: string } } = {
      pending: { text: "待受理", color: "bg-amber-100 text-amber-800 border border-amber-200" },
      accepted: { text: "已接單", color: "bg-blue-100 text-blue-800 border border-blue-200" },
      preparing: { text: "製作中", color: "bg-cyan-100 text-cyan-800 border border-cyan-200" },
      delivering: { text: "外送中", color: "bg-indigo-100 text-indigo-800 border border-indigo-200" },
      completed: { text: "已送達", color: "bg-emerald-100 text-emerald-800 border border-emerald-200" },
      cancelled: { text: "已取消", color: "bg-rose-100 text-rose-800 border border-rose-200" },
    };
    return map[status] || { text: status, color: "bg-gray-100 text-gray-800" };
  };

  const getStepProgressIndex = (status: OrderStatus) => {
    const steps: OrderStatus[] = ["pending", "accepted", "preparing", "delivering", "completed"];
    return steps.indexOf(status);
  };

  // Filter user orders
  const customerOrders = orders
    .filter((o) => o.customerId === currentUser.uid)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="py-6" id="customer-view-container">
      {orderSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-sm text-center shadow-2xl border border-rose-100 mx-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">訂單已成功送出！</h3>
            <p className="text-gray-500 text-sm">您的餐點已經通知商家製作中。正在為您轉跳至訂單追蹤頁面...</p>
          </div>
        </div>
      )}

      {currentNav === "browse" && (
        <>
          {!selectedRestaurant ? (
            <div>
              {/* Hero Promo Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8" id="geom-hero-section">
                <div className="lg:col-span-8 bg-[#0D3B3F] min-h-[220px] rounded-xl relative overflow-hidden flex items-center p-8 md:px-12">
                  <div className="z-10">
                    <span className="px-3 py-1 bg-[#FFB800] text-black text-[10px] font-black rounded-sm uppercase mb-4 inline-block tracking-wider">
                      大安限定 • 獨家企劃
                    </span>
                    <h1 className="text-2xl md:text-4xl font-black text-white mb-2 leading-tight">
                      首兩筆訂單 5 折優惠 🛵
                    </h1>
                    <p className="text-white/75 text-xs md:text-sm font-medium">
                      輸入優惠折扣代碼：<span className="font-mono text-white underline font-extrabold bg-[#FF5C00]/40 px-1 rounded-sm">DAANNEW50</span>
                    </p>
                  </div>
                  <div className="absolute right-[-20px] bottom-[-20px] w-64 h-64 bg-[#FF5C00] opacity-20 rotate-12"></div>
                  <div className="absolute right-[40px] top-[20px] w-32 h-32 border-4 border-white/10 rounded-full"></div>
                </div>
                <div className="lg:col-span-3 bg-white border border-[#E5E5E5] rounded-xl p-6 flex flex-col justify-center">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">系統狀態</p>
                  <h3 className="text-lg font-black mb-3 text-[#1A1A1A]">Firebase 即時對接</h3>
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">平台同步狀態</span>
                      <span className="font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-sm border border-emerald-100 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        ONLINE
                      </span>
                    </div>
                    <div className="w-full h-1 bg-[#F3F3F3] rounded-sm overflow-hidden">
                      <div className="w-[85%] h-full bg-[#FF5C00]"></div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold leading-relaxed">
                      提示：本點餐系統所有訂單與菜單變更均與雲端數據庫實時同步。
                    </p>
                  </div>
                </div>
              </div>

              {/* Special School Lunch Highlight Banner */}
              {(() => {
                const schoolLunch = restaurants.find((r) => r.id === "rest_school_lunch");
                if (!schoolLunch) return null;
                return (
                  <div
                    id="school-lunch-promo-card"
                    onClick={() => setSelectedRestaurant(schoolLunch)}
                    className="relative bg-gradient-to-r from-[#0D3B3F] to-[#124B50] rounded-xl p-6 mb-8 border border-[#FF5C00]/30 shadow-xs cursor-pointer hover:border-[#FF5C00] transition-all overflow-hidden text-left flex flex-col md:flex-row md:items-center md:justify-between gap-4 group"
                  >
                    <div className="absolute -right-12 -top-12 w-36 h-36 bg-[#FF5C00]/10 rounded-full blur-xl group-hover:bg-[#FF5C00]/15 transition-colors"></div>
                    <div className="z-10 flex items-start gap-4">
                      <div className="bg-[#FAEFE8] text-[#FF5C00] p-4.5 rounded-lg font-black text-2xl shrink-0 flex items-center justify-center border border-[#FF5C00]/20 shadow-xs">
                        🍱
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="px-2 py-0.5 bg-[#FF5C00] text-white text-[9px] font-black tracking-widest rounded-xs font-mono">
                            SPECIAL SCHOOL LUNCH
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-black tracking-wider rounded-xs font-bold flex items-center gap-1">
                            <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping"></span>
                            今日正常供餐 (週一至週五)
                          </span>
                        </div>
                        <h2 className="text-white font-black text-base md:text-lg group-hover:text-[#FFB800] transition-colors leading-tight">
                          國立臺北教育大學附設實驗國民小學營養午餐
                        </h2>
                        <p className="text-white/70 text-xs mt-1 max-w-2xl font-medium leading-relaxed">
                          專為國校、師生及家長設計的週一至週五精緻膳食！點擊此處立即進入，看每天有哪些美味、安全的營養菜色與配菜。
                        </p>
                      </div>
                    </div>
                    <div className="z-10 shrink-0 text-right md:-mt-1">
                      <span className="inline-flex items-center gap-1.5 bg-[#FF5C00] hover:bg-[#FF5C00]/95 text-white text-xs font-black px-4.5 py-2.5 rounded-sm transition-transform duration-200 group-hover:translate-x-1">
                        <span>點選進入查看每日菜色</span>
                        <span className="text-sm leading-none font-sans">→</span>
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
                {/* Search Inputs */}
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="flex w-full md:max-w-md shadow-xs rounded-sm overflow-hidden"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="restaurant-search"
                      type="text"
                      placeholder="搜尋大安區美食、珍珠奶茶、拉麵..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#F3F3F3] border border-[#E5E5E5] rounded-l-sm py-3 pl-10 pr-4 text-sm text-[#2D2D2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/20 focus:border-[#FF5C00] transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    id="search-submit-btn"
                    className="bg-[#FF5C00] hover:bg-[#FF5C00]/95 text-white text-xs font-black px-6 border-y border-r border-[#FF5C00] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-98"
                  >
                    <span>搜尋</span>
                  </button>
                </form>

                {/* Cuisine Filter Tags */}
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
                  {cuisines.map((cuisine) => (
                    <button
                      key={cuisine}
                      id={`cuisine-filter-${cuisine}`}
                      onClick={() => setSelectedCuisine(cuisine)}
                      className={`px-4 py-2 rounded-sm text-xs font-black transition-all whitespace-nowrap border ${
                        selectedCuisine === cuisine
                          ? "bg-[#FF5C00] text-white border-[#FF5C00] shadow-xs"
                          : "bg-white text-gray-600 border-[#E5E5E5] hover:bg-[#F3F3F3]"
                      }`}
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
              </div>

              {/* Restaurant List Grid */}
              <h2 className="text-xl font-black text-[#1A1A1A] mb-6 flex items-center gap-2 uppercase tracking-wide">
                <span className="w-2.5 h-5 bg-[#FF5C00] block"></span>
                大安區熱門餐廳 ({filteredRestaurants.length} 間)
              </h2>

              {filteredRestaurants.length === 0 ? (
                <div className="bg-white rounded-xl py-16 text-center border border-[#E5E5E5] shadow-xs">
                  <p className="text-gray-400 mb-2 text-sm">找不到符合條件的美味商家</p>
                  <button onClick={() => { setSearchQuery(""); setSelectedCuisine("全部"); }} className="text-[#FF5C00] font-black text-xs hover:underline">
                    清除篩選條件
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRestaurants.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      id={`restaurant-card-${restaurant.id}`}
                      onClick={() => setSelectedRestaurant(restaurant)}
                      className="group bg-white rounded-xl border border-[#E5E5E5] overflow-hidden hover:border-[#FF5C00] hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
                    >
                      {/* Image Banner */}
                      <div className="h-44 w-full bg-gray-100 overflow-hidden relative">
                        <img
                          src={restaurant.imageUrl}
                          alt={restaurant.name}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-555"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-sm text-[10px] font-black text-[#FF5C00] shadow-xs border border-[#FF5C00]/20">
                          {restaurant.cuisine}
                        </div>
                      </div>

                      {/* Info body */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h3 className="font-bold text-[#1A1A1A] group-hover:text-[#FF5C00] transition-colors line-clamp-1">
                              {restaurant.name}
                            </h3>
                            <div className="flex items-center text-[#FFB800] text-xs font-black shrink-0 bg-amber-50 px-2 py-0.5 rounded-sm border border-amber-100">
                              <Star className="w-3.5 h-3.5 fill-[#FFB800] mr-0.5" />
                              <span>{restaurant.rating}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2 mb-4 h-8 leading-relaxed">
                            {restaurant.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-[#E5E5E5] text-[11px] text-gray-500 flex flex-col gap-1 font-medium">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">{restaurant.address}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{restaurant.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Selected Restaurant Menu Details */
            <div>
              <button
                id="back-to-list"
                onClick={() => setSelectedRestaurant(null)}
                className="mb-6 flex items-center text-xs font-black text-[#FF5C00] hover:translate-x-[-2px] transition-all"
              >
                ← 返回所有餐廳
              </button>

              {/* Restaurant Banner Cover */}
              <div className="relative rounded-xl overflow-hidden h-64 md:h-80 mb-8 border border-[#E5E5E5] shadow-xs">
                <img
                  src={selectedRestaurant.imageUrl}
                  alt={selectedRestaurant.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                  <span className="inline-block bg-[#FF5C00] text-[10px] font-black px-2.5 py-1 rounded-sm mb-2">
                    {selectedRestaurant.cuisine}
                  </span>
                  <h1 className="text-2xl md:text-4xl font-black mb-2">{selectedRestaurant.name}</h1>
                  <p className="text-xs md:text-sm text-gray-300 max-w-2xl opacity-90 leading-relaxed mb-4 font-medium">
                    {selectedRestaurant.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-300 pt-3 border-t border-white/15">
                    <span className="flex items-center gap-1 text-[#FFB800] font-extrabold">
                      <Star className="w-4 h-4 fill-[#FFB800]" />
                      {selectedRestaurant.rating} 評分
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-[#FF5C00]" />
                      {selectedRestaurant.address}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4 text-cyan-400" />
                      {selectedRestaurant.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu and Shopping Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Menu list */}
                <div className="lg:col-span-2">
                  {selectedRestaurant.id === "rest_school_lunch" ? (
                    <div>
                      {/* School Lunch Header */}
                      <div className="bg-[#0D3B3F]/5 border border-[#0D3B3F]/15 rounded-xl p-6 mb-6 text-left">
                        <h3 className="text-base font-black text-[#0D3B3F] mb-1 flex items-center gap-2">
                          <span className="w-2 h-4 bg-[#FF5C00] rounded-xs"></span>
                          國北教大實小學童 • 營養午餐日曆
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                          精心把關每位學童的膳食均衡，嚴選有機履歷、低油鹽健康食材。請點擊下方星期頁籤，查看當日所供應之主菜、副時蔬、主食及湯品。
                        </p>
                      </div>

                      {/* Weekday Tab Selector Row */}
                      <div className="grid grid-cols-5 gap-2 mb-8" id="school-lunch-tabs">
                        {WEEKDAYS.map((day) => {
                          const isSelected = selectedSchoolLunchDay === day;
                          const shortDay = day.split(" ")[0]; // "星期一"
                          const englishDay = day.split(" ")[1]?.replace("(", "")?.replace(")", "") || ""; // "Monday"
                          
                          return (
                            <button
                              key={day}
                              id={`tab-${shortDay}`}
                              onClick={() => setSelectedSchoolLunchDay(day)}
                              className={`p-3 rounded-lg border text-center transition-all flex flex-col justify-between items-center ${
                                isSelected
                                  ? "bg-white border-[#FF5C00] shadow-sm ring-1 ring-[#FF5C00]"
                                  : "bg-[#FBFBFB] border-[#E5E5E5] hover:bg-white hover:border-gray-400"
                              }`}
                            >
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">
                                {englishDay.substring(0, 3)}
                              </span>
                              <span className={`text-xs font-black mt-1 ${isSelected ? "text-[#FF5C00]" : "text-gray-700"}`}>
                                {shortDay}
                              </span>
                              <div className={`w-1.5 h-1.5 rounded-full mt-2 ${isSelected ? "bg-[#FF5C00]" : "bg-transparent"}`}></div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Active Day Menu Board */}
                      {(() => {
                        const item = menuItems.find(
                          (m) => m.restaurantId === selectedRestaurant.id && m.category === selectedSchoolLunchDay
                        );

                        if (!item) {
                          return (
                            <div className="bg-white rounded-xl py-12 border border-[#E5E5E5] text-center text-gray-400 text-xs">
                              未尋獲 {selectedSchoolLunchDay.split(" ")[0]} 的特約精美餐點。可能尚在籌備中或今日為學校休假。
                            </div>
                          );
                        }

                        // Parse school lunch details with new regex parser
                        const getVal = (tag: string) => {
                          const regex = new RegExp(`${tag}[-：:]([^、,|。|\\|]+)`);
                          const match = item.description.match(regex);
                          return match ? match[1].trim() : "";
                        };

                        const mainPart = getVal("主菜") || "精選主菜";
                        const subPart = getVal("副菜") || "美味副菜";
                        const vegPart = getVal("蔬菜") || "有機時蔬";
                        const soupPart = getVal("湯品") || "時令湯品";
                        const ricePart = getVal("主食") || "健康米食";
                        const accessoryPart = getVal("附餐");

                        // Dynamically generate dietetic note based on day
                        const nutritionNote = "優先選用三章一Q食材，透過多樣化食材與料理方式，讓學生接觸不同口味，嚴格把關食材來源、保存與製作流程，確保衛生安全，讓學生吃得放心。吃得健康、吃得均衡、吃得安心，同時培養良好的飲食習慣。";

                        const getMainPartEmoji = (p: string) => {
                          if (p.includes("雞")) return "🍗 ";
                          if (p.includes("魚")) return "🐟 ";
                          if (p.includes("豬") || p.includes("肉")) return "🥩 ";
                          return "🍛 ";
                        };

                        const getSubPartEmoji = (p: string) => {
                          if (p.includes("蛋")) return "🍳 ";
                          if (p.includes("豬") || p.includes("肉") || p.includes("鐵板")) return "🍖 ";
                          if (p.includes("菇") || p.includes("珍菇")) return "🍄 ";
                          if (p.includes("菜")) return "🥗 ";
                          if (p.includes("餅")) return "🥞 ";
                          return "🥘 ";
                        };

                        const getVegPartEmoji = (p: string) => {
                          return "🥬 ";
                        };

                        const quantityInCart = cart.find((c) => c.menuItem.id === item.id)?.quantity || 0;

                        return (
                          <div className="space-y-6" id="school-lunch-detail-panel">
                            {/* Visual Bento tray */}
                            <div className="bg-[#FAEFE8] rounded-2xl border-2 border-[#DDA888]/30 p-6 shadow-md relative text-left">
                              <div className="absolute top-4 right-4 bg-[#FF5C00] text-white text-[9px] font-black px-2 py-0.5 rounded-xs uppercase tracking-widest font-mono">
                                ECO BENTO TRAY
                              </div>

                              <h4 className="text-sm font-black text-[#5C3218] mb-4 flex items-center gap-1.5">
                                🍱 國北教大實小營養午餐菜色
                              </h4>

                              {/* Bento compartment grid */}
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                {/* Component - Left Big MAIN COMPARTMENT */}
                                <div className="md:col-span-7 bg-white rounded-xl p-4 border border-[#DDA888]/20 shadow-xs flex flex-col justify-between min-h-[140px] hover:border-[#FF5600]/40 transition-colors group text-left">
                                  <div>
                                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-sm inline-block tracking-wider mb-2">
                                      當日主菜 / MAIN COURSE
                                    </span>
                                    <h5 className="text-base md:text-lg font-black text-gray-900 leading-snug">
                                      {getMainPartEmoji(mainPart)}{mainPart}
                                    </h5>
                                  </div>
                                  <p className="text-[11px] text-gray-400 mt-2">學童成長必備之優質高鐵、高蛋白質核心營養來源。</p>
                                </div>

                                {/* Component - Right Top VEG COMPARTMENTS (Stacked elegantly) */}
                                <div className="md:col-span-5 flex flex-col gap-3 justify-between text-left">
                                  {/* Sub Part Card */}
                                  <div className="bg-white rounded-xl p-3 border border-[#DDA888]/20 shadow-xs flex flex-col justify-center hover:border-emerald-500/40 transition-colors group flex-1 text-left">
                                    <div className="text-left pr-2">
                                      <span className="text-[10px] font-bold text-[#FF5C00] bg-[#FF5C00]/5 px-2 py-0.5 rounded-sm inline-block tracking-wider mb-1">
                                        特選副菜 / SIDE DISH
                                      </span>
                                      <h6 className="text-sm font-extrabold text-gray-800">
                                        {getSubPartEmoji(subPart)}{subPart}
                                      </h6>
                                    </div>
                                  </div>

                                  {/* Vegetable Part Card */}
                                  <div className="bg-white rounded-xl p-3 border border-[#DDA888]/20 shadow-xs flex flex-col justify-center hover:border-emerald-500/40 transition-colors group flex-1 text-left">
                                    <div className="text-left pr-2">
                                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm inline-block tracking-wider mb-1">
                                        履歷時蔬菜 / VEGETABLE
                                      </span>
                                      <h6 className="text-sm font-extrabold text-gray-800">
                                        {getVegPartEmoji(vegPart)}{vegPart}
                                      </h6>
                                    </div>
                                  </div>
                                </div>

                                {/* Component - Bottom Left STAPLE COMPARTMENT */}
                                <div className={`${accessoryPart ? "md:col-span-4" : "md:col-span-6"} bg-white rounded-xl p-4 border border-[#DDA888]/20 shadow-xs flex flex-col justify-between min-h-[100px] hover:border-amber-500/40 transition-colors group text-left`}>
                                  <div>
                                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-sm inline-block tracking-wider mb-2">
                                      美味主食 / STAPLE
                                    </span>
                                    <h6 className="text-sm font-extrabold text-gray-800">
                                      🌾 {ricePart}
                                    </h6>
                                  </div>
                                  <p className="text-[10px] text-gray-400 mt-1">精選好米、緩釋能。</p>
                                </div>

                                {/* Component - Bottom Right SOUP COMPARTMENT */}
                                <div className={`${accessoryPart ? "md:col-span-4" : "md:col-span-6"} bg-white rounded-xl p-4 border border-[#DDA888]/20 shadow-xs flex flex-col justify-between min-h-[100px] hover:border-cyan-500/40 transition-colors group text-left`}>
                                  <div>
                                    <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-sm inline-block tracking-wider mb-2">
                                      每日例湯 / HOT SOUP
                                    </span>
                                    <h6 className="text-sm font-extrabold text-gray-800">
                                      🥣 {soupPart}
                                    </h6>
                                  </div>
                                  <p className="text-[10px] text-gray-400 mt-1">醇厚高湯，溫潤可口。</p>
                                </div>

                                {/* Component - Optional ACCESSORY COMPARTMENT (e.g. Tuesday Cherry Tomatoes) */}
                                {accessoryPart && (
                                  <div className="md:col-span-4 bg-white rounded-xl p-4 border border-[#DDA888]/20 shadow-xs flex flex-col justify-between min-h-[100px] hover:border-rose-500/40 transition-colors group text-left">
                                    <div>
                                      <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-sm inline-block tracking-wider mb-2">
                                        精緻附餐 / ACCESSORY
                                      </span>
                                      <h6 className="text-sm font-extrabold text-[#FF5C00] font-sans">
                                        🍒 {accessoryPart}
                                      </h6>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">富含維他命與天然酵素。</p>
                                  </div>
                                )}
                              </div>

                              {/* Chef Note */}
                              <div className="mt-4 pt-4 border-t border-[#DDA888]/25 text-xs text-[#5C3218] flex items-start gap-2 italic leading-relaxed font-semibold">
                                <span className="bg-[#FF5C00]/10 text-[#FF5C00] rounded px-1.5 py-0.5 text-[9px] font-black shrink-0 not-italic">
                                  營養師精析
                                </span>
                                <span>“ {nutritionNote} ”</span>
                              </div>
                            </div>

                            {/* Sticky Order Action Row */}
                            <div className="bg-[#0D3B3F]/5 border border-[#0D3B3F]/15 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-left">
                              <div>
                                <h5 className="font-black text-gray-900 text-sm">
                                  是否訂取今日營養午餐？
                                </h5>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">
                                  單人盒平價回饋師生，特惠價：<span className="font-mono text-[#FF5C00] font-black">${item.price} 元</span>
                                </p>
                              </div>

                              {quantityInCart > 0 ? (
                                <div className="flex items-center bg-[#FF5C00] text-white rounded-sm shadow-xs overflow-hidden">
                                  <button
                                    id={`lunch-minus-${item.id}`}
                                    onClick={() => onUpdateCartQuantity(item.id, quantityInCart - 1)}
                                    className="p-2 px-4 font-black hover:bg-black/10 transition-colors text-xs"
                                  >
                                    <Minus className="w-3.5 h-3.5 text-white" />
                                  </button>
                                  <span className="px-4 text-xs font-black font-mono">
                                    {quantityInCart} 份
                                  </span>
                                  <button
                                    id={`lunch-plus-${item.id}`}
                                    onClick={() => onUpdateCartQuantity(item.id, quantityInCart + 1)}
                                    className="p-2 px-4 font-black hover:bg-black/10 transition-colors text-xs"
                                  >
                                    <Plus className="w-3.5 h-3.5 text-white" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  id={`add-lunch-${item.id}`}
                                  onClick={() => onAddToCart(item)}
                                  disabled={!item.isAvailable}
                                  className={`px-6 py-2.5 rounded-sm font-black text-xs flex items-center gap-1.5 transition-colors ${
                                    item.isAvailable
                                      ? "bg-[#FF5C00] hover:bg-[#FF5C00]/95 text-white shadow-xs"
                                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  }`}
                                >
                                  <Plus className="w-4 h-4" />
                                  <span>立即加入購物車 (${item.price} 元)</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-lg font-black text-[#1A1A1A] mb-6 flex items-center gap-2">
                        <span className="w-2.5 h-5 bg-[#0D3B3F] block"></span>
                        精選美味餐點
                      </h2>

                      {/* Menu Items */}
                      <div className="space-y-4">
                        {menuItems.filter((m) => m.restaurantId === selectedRestaurant.id).length === 0 ? (
                          <div className="bg-white rounded-xl py-12 border border-[#E5E5E5] text-center text-gray-400 text-xs">
                            目前該商家尚未上線任何精緻菜單項目
                          </div>
                        ) : (
                          menuItems
                            .filter((m) => m.restaurantId === selectedRestaurant.id)
                            .map((item) => {
                              const quantityInCart = cart.find((c) => c.menuItem.id === item.id)?.quantity || 0;
                              return (
                                <div
                                  key={item.id}
                                  id={`menu-item-${item.id}`}
                                  className="bg-white rounded-xl border border-[#E5E5E5] p-4 flex items-start gap-4 hover:border-[#FF5C00] transition-colors"
                                >
                                  {/* Item Thumb */}
                                  {item.imageUrl && (
                                    <img
                                      src={item.imageUrl}
                                      alt={item.name}
                                      className="w-20 h-20 rounded-sm object-cover bg-gray-50 shrink-0"
                                      referrerPolicy="no-referrer"
                                    />
                                  )}
                                  {/* Item detail text */}
                                  <div className="flex-1 min-w-0 text-left">
                                    <span className="text-[10px] font-bold text-[#0D3B3F] bg-[#0D3B3F]/5 px-2 py-0.5 rounded-sm inline-block mb-1 font-mono uppercase tracking-wider">
                                      {item.category || "主食點心"}
                                    </span>
                                    <h4 className="font-bold text-gray-900 text-sm md:text-base">
                                      {item.name}
                                    </h4>
                                    <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                                      {item.description}
                                    </p>
                                    <div className="mt-3 flex items-center justify-between">
                                      <span className="text-[#FF5C00] font-extrabold text-sm md:text-base font-mono">
                                        ${item.price}
                                      </span>

                                      {/* Add button / Quantity controls */}
                                      {quantityInCart > 0 ? (
                                        <div className="flex items-center bg-[#FF5C00]/10 text-[#FF5C00] rounded-sm border border-[#FF5C00]/20">
                                          <button
                                            id={`minus-item-${item.id}`}
                                            onClick={() => onUpdateCartQuantity(item.id, quantityInCart - 1)}
                                            className="p-1 px-2.5 font-black hover:bg-[#FF5C00]/25 transition-colors text-xs"
                                          >
                                            <Minus className="w-3 h-3 text-[#FF5C00]" />
                                          </button>
                                          <span className="px-3 text-xs font-black font-mono">
                                            {quantityInCart}
                                          </span>
                                          <button
                                            id={`plus-item-${item.id}`}
                                            onClick={() => onUpdateCartQuantity(item.id, quantityInCart + 1)}
                                            className="p-1 px-2.5 font-black hover:bg-[#FF5C00]/25 transition-colors text-xs"
                                          >
                                            <Plus className="w-3 h-3 text-[#FF5C00]" />
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          id={`add-to-cart-${item.id}`}
                                          onClick={() => onAddToCart(item)}
                                          disabled={!item.isAvailable}
                                          className={`text-[11px] font-black px-3.5 py-1.5 rounded-sm flex items-center gap-1 transition-colors ${
                                            item.isAvailable
                                              ? "bg-[#FF5C00] hover:bg-[#FF5C00]/90 text-white"
                                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                          }`}
                                        >
                                          <Plus className="w-3 h-3" />
                                          <span>{item.isAvailable ? "加入購物車" : "售完"}</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar Sticky Cart panel */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 sticky top-24">
                    <h3 className="font-black text-gray-900 border-b border-[#E5E5E5] pb-3 flex items-center justify-between mb-4">
                      <span className="flex items-center gap-1.5 text-sm">
                        <ShoppingCart className="w-4 h-4 text-[#FF5C00] animate-pulse" />
                        購物車內容
                      </span>
                      <span className="text-[10px] text-[#FF5C00] bg-[#FF5C00]/10 border border-[#FF5C00]/25 px-2 py-0.5 rounded-sm font-black font-mono">
                        {cart.length} ITEMS
                      </span>
                    </h3>

                    {cart.length === 0 ? (
                      <div className="py-12 text-center text-gray-400 text-xs font-semibold">
                        購物車還是空的，快把美食加入吧！
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                          {cart.map((c) => (
                            <div key={c.menuItem.id} className="flex justify-between items-center text-xs border-b border-gray-50 pb-2">
                              <div className="text-left">
                                <p className="font-extrabold text-gray-800">{c.menuItem.name}</p>
                                <p className="text-gray-400 font-mono">${c.menuItem.price} x {c.quantity}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-black font-mono text-gray-700">${c.menuItem.price * c.quantity}</span>
                                <button
                                  onClick={() => onRemoveFromCart(c.menuItem.id)}
                                  className="text-gray-400 hover:text-[#FF5C00] transition-colors p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-[#E5E5E5] pt-4 flex justify-between text-sm font-black mb-4">
                          <span className="text-gray-500">小計總額</span>
                          <span className="text-[#FF5C00] text-base font-black font-mono">${cartTotal}</span>
                        </div>

                        <button
                          onClick={() => onNavigate("cart")}
                          className="w-full bg-[#FF5C00] hover:bg-[#FF5C00]/95 text-white rounded-sm py-3 text-xs font-black transition-all text-center block"
                        >
                          前往付款結帳 (${cartTotal} 元)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {currentNav === "cart" && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 text-left uppercase tracking-wide">
            <span className="w-2.5 h-6 bg-[#FF5C00] block"></span>
            結帳配送資訊 (前台結帳)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Left: Cart Items summary */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 md:col-span-3">
              <h3 className="font-extrabold text-sm text-[#1A1A1A] border-b border-[#E5E5E5] pb-3 mb-4 text-left">
                訂購餐點明細
              </h3>

              {cart.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-xs">
                  目前購物車內無商品，
                  <button onClick={() => onNavigate("browse")} className="text-[#FF5C00] font-black ml-1 hover:underline">
                    立即去選購美味！
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((c) => (
                    <div key={c.menuItem.id} className="flex items-center justify-between text-xs pb-3 border-b border-gray-100">
                      <div className="text-left flex-1">
                        <p className="font-extrabold text-gray-800">{c.menuItem.name}</p>
                        <p className="text-gray-400 text-[11px] mt-0.5 font-mono">單價：${c.menuItem.price}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center text-gray-600 rounded-sm border border-[#E5E5E5] bg-[#F3F3F3]">
                          <button
                            onClick={() => onUpdateCartQuantity(c.menuItem.id, c.quantity - 1)}
                            className="p-1 px-2.5 hover:bg-gray-200 transition-colors font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="px-2 font-black font-mono text-xs">{c.quantity}</span>
                          <button
                            onClick={() => onUpdateCartQuantity(c.menuItem.id, c.quantity + 1)}
                            className="p-1 px-2.5 hover:bg-gray-200 transition-colors font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-black font-mono text-[#1A1A1A] w-16 text-right">${c.menuItem.price * c.quantity}</span>
                      </div>
                    </div>
                  ))}

                  <div className="pt-3 flex justify-between text-xs text-gray-500 font-medium">
                    <span>外送服務費</span>
                    <span className="font-mono">$30</span>
                  </div>

                  <div className="pt-2 flex justify-between text-xs text-gray-500 font-medium">
                    <span>平台維護費</span>
                    <span className="font-mono">$5</span>
                  </div>

                  <div className="border-t border-[#E5E5E5] pt-4 flex justify-between items-center text-sm font-black text-[#1A1A1A]">
                    <span>應付總金額</span>
                    <span className="text-[#FF5C00] text-xl font-black font-mono">${cartTotal + 35}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Checkout Address form */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 md:col-span-2 text-left">
              <h3 className="font-extrabold text-sm text-[#1A1A1A] border-b border-[#E5E5E5] pb-3 mb-4">
                外送配送詳情
              </h3>

              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                    外送地址
                  </label>
                  <textarea
                    id="checkout-address"
                    required
                    rows={2}
                    placeholder="請輸入詳細的外送大樓名稱與路段房號..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-[#F3F3F3] border border-[#E5E5E5] rounded-sm p-3 text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/20 focus:border-[#FF5C00] transition-all leading-relaxed font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                    給外送員 / 廚房備註 (選填)
                  </label>
                  <input
                    id="checkout-notes"
                    type="text"
                    placeholder="例如：不加洋蔥、送達放一樓..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#F3F3F3] border border-[#E5E5E5] rounded-sm p-3 text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/20 focus:border-[#FF5C00] transition-all"
                  />
                </div>

                <div className="bg-[#0D3B3F]/5 rounded-sm p-3.5 border border-[#0D3B3F]/15 text-[11px] text-[#0D3B3F] leading-relaxed font-medium">
                  <p>💡 <b>DAANEATS HIGH-SYNC：</b> 臺北大安區在線即時訂餐，採用 Firestore 高規格雙向實時同步引擎，秒級更新！</p>
                </div>

                <button
                  id="btn-place-order"
                  type="submit"
                  disabled={cart.length === 0 || isOrdering}
                  className="w-full bg-[#FF5C00] hover:bg-[#FF5C00]/90 text-white rounded-sm py-4 text-xs font-black transition-all cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed mt-2 uppercase tracking-wider"
                >
                  {isOrdering ? "處理訂單中..." : `確認下單：$${cartTotal + 35} 元`}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {currentNav === "orders" && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 text-left uppercase tracking-wide">
            <span className="w-2.5 h-6 bg-[#FF5C00] block"></span>
            我的訂單歷史與實時追蹤
          </h2>

          {customerOrders.length === 0 ? (
            <div className="bg-white rounded-xl py-16 border border-[#E5E5E5] text-center">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-xs mb-4">您目前在平台還沒有任何下單紀錄</p>
              <button
                onClick={() => onNavigate("browse")}
                className="bg-[#FF5C00] hover:bg-[#FF5C00]/90 text-white rounded-sm px-5 py-2.5 text-xs font-black transition-all shadow-xs"
              >
                探索大安推薦美食
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {customerOrders.map((order) => {
                const currentStepIndex = getStepProgressIndex(order.status);
                const isCancelled = order.status === "cancelled";

                return (
                  <div
                    key={order.id}
                    id={`order-card-${order.id}`}
                    className="bg-white rounded-xl border border-[#E5E5E5] p-6 text-left"
                  >
                    {/* Upper block */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100 mb-5">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h3 className="font-extrabold text-gray-900 text-base">
                            {order.restaurantName}
                          </h3>
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-sm uppercase tracking-wider ${getStatusBadge(order.status).color}`}>
                            {getStatusBadge(order.status).text}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono mt-1">
                          訂單編號 #{order.id} | 時間：{new Date(order.createdAt).toLocaleString("zh-TW")}
                        </p>
                      </div>

                      <div className="text-right sm:text-right shrink-0">
                        <span className="text-[10px] font-bold text-gray-400 block mb-0.5 uppercase tracking-wider">實付餐額</span>
                        <span className="font-black text-[#FF5C00] text-lg font-mono">${order.totalAmount} 元</span>
                      </div>
                    </div>

                    {/* Left details + Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5 text-xs">
                      <div>
                        <p className="font-bold text-[#1A1A1A] mb-2 uppercase tracking-wide">點購美食內容</p>
                        <div className="bg-[#F3F3F3] rounded-sm p-3.5 space-y-2 border border-[#E5E5E5]">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[11px]">
                              <span className="text-gray-700 font-semibold">
                                {it.name} <span className="font-black font-mono text-gray-400">x{it.quantity}</span>
                              </span>
                              <span className="font-bold font-mono text-gray-600">${it.price * it.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="font-bold text-[#1A1A1A] mb-1 uppercase tracking-wide">外送地址</p>
                          <p className="text-gray-800 bg-[#F3F3F3] p-2.5 rounded-sm border border-[#E5E5E5] leading-relaxed">{order.deliveryAddress}</p>
                        </div>
                        {order.notes && (
                          <div>
                            <p className="font-bold text-gray-400 mb-1">備註資訊</p>
                            <p className="text-gray-500 italic">「{order.notes}」</p>
                          </div>
                        )}
                        {order.driverName && (
                          <div className="flex items-center gap-2 bg-[#0D3B3F]/5 text-[#0D3B3F] p-2.5 rounded-sm border border-[#0D3B3F]/15">
                            <Clock className="w-4 h-4 text-[#0D3B3F] shrink-0" />
                            <div>
                              <p className="font-black text-[11px]">特派外送司機：{order.driverName}</p>
                              {order.driverPhone && <p className="text-[10px] opacity-80">聯絡電話：{order.driverPhone}</p>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress tracker bar */}
                    {!isCancelled && (
                      <div className="pt-4 border-t border-gray-150">
                        <p className="text-xs font-black text-gray-400 mb-4 text-center sm:text-left uppercase tracking-wider">訂單進度即時更新</p>
                        <div className="relative flex flex-col sm:flex-row justify-between items-center gap-y-4 sm:gap-x-2">
                          {["pending", "accepted", "preparing", "delivering", "completed"].map((step, idx) => {
                            const stepsZH: { [key: string]: string } = {
                                pending: "提出委託",
                                accepted: "店家接單",
                                preparing: "烹製餐點",
                                delivering: "騎手送餐",
                                completed: "快遞送達",
                            };
                            
                            const isDone = currentStepIndex >= idx;
                            const isCurrent = currentStepIndex === idx;

                            return (
                              <div key={step} className="flex flex-row sm:flex-col items-center gap-3 sm:gap-1.5 z-10 flex-1 w-full sm:w-auto">
                                {/* Dot */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                                  isDone
                                    ? "bg-[#FF5C00] text-white shadow-xs"
                                    : "bg-gray-100 text-gray-400 border border-gray-200"
                                } ${isCurrent ? "scale-110 ring-4 ring-[#FF5C00]/15" : ""}`}>
                                  {isDone && !isCurrent ? "✓" : idx + 1}
                                </div>
                                {/* Label */}
                                <div className="text-left sm:text-center">
                                  <p className={`text-[11px] font-black ${isDone ? "text-[#FF5C00]" : "text-gray-400"}`}>
                                    {stepsZH[step]}
                                  </p>
                                  {isCurrent && (
                                    <span className="text-[9px] bg-[#FF5C00]/15 text-[#FF5C00] border border-[#FF5C00]/20 px-1.5 py-0.5 rounded-sm inline-block animate-pulse font-sans mt-0.5">
                                      實時狀態
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          {/* Line background */}
                          <div className="absolute top-4 left-10 right-10 h-0.5 bg-gray-100 -z-10 hidden sm:block">
                            <div
                              className="h-full bg-[#FF5C00] transition-all duration-500"
                              style={{ width: `${(Math.max(0, currentStepIndex) / 4) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
