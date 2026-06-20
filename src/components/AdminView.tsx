import React, { useState } from "react";
import { Restaurant, Order, OrderStatus } from "../types";
import { ShieldCheck, Plus, Check, RefreshCw, ClipboardList, CheckCircle, ShieldAlert } from "lucide-react";

interface AdminViewProps {
  restaurants: Restaurant[];
  orders: Order[];
  onToggleRestaurantActive: (restaurantId: string, currentActive: boolean) => Promise<void>;
  onCreateRestaurant: (restaurant: Omit<Restaurant, "id" | "rating" | "ownerId">) => Promise<void>;
  onResetDatabaseState: () => Promise<void>;
  onForceUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  currentNav: "dashboard" | "admin-restaurants" | "admin-orders";
}

export default function AdminView({
  restaurants,
  orders,
  onToggleRestaurantActive,
  onCreateRestaurant,
  onResetDatabaseState,
  onForceUpdateOrderStatus,
  currentNav,
}: AdminViewProps) {
  // Add restaurant form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [restName, setRestName] = useState("");
  const [restCuisine, setRestCuisine] = useState("台灣傳統小吃");
  const [restAddress, setRestAddress] = useState("");
  const [restPhone, setRestPhone] = useState("");
  const [restImg, setRestImg] = useState("");
  const [restDesc, setRestDesc] = useState("");

  const [isResetting, setIsResetting] = useState(false);

  // Stats calculation
  const totalCompletedSales = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalOrdersCount = orders.length;
  const totalRestaurantsCount = restaurants.length;
  const activeRestaurantsCount = restaurants.filter((r) => r.isActive).length;

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restName || !restAddress) return;
    try {
      await onCreateRestaurant({
        name: restName,
        cuisine: restCuisine,
        address: restAddress,
        phone: restPhone || "02-2735-0000",
        imageUrl: restImg || "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=600",
        description: restDesc || "DaanEats 在地合作特色美食，誠摯為您奉上暖胃餐食。",
        isActive: true,
      });

      // Clear fields
      setRestName("");
      setRestAddress("");
      setRestPhone("");
      setRestImg("");
      setRestDesc("");
      setShowAddForm(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm("您確定要將資料庫重製為預設的大安美食數據嗎？這會清除目前的客製資料！")) return;
    setIsResetting(true);
    try {
      await onResetDatabaseState();
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="py-6 animate-fade-in" id="admin-view-container">
      {/* Upper system header */}
      <div className="bg-[#0D3B3F] text-white rounded-xl p-6 md:p-8 mb-8 text-left relative overflow-hidden border border-[#0D3B3F]/30 shadow-xs">
        <div className="relative z-10 max-w-xl">
          <span className="bg-white/10 backdrop-blur-md text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-sm border border-white/20 flex items-center gap-1.5 w-fit">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF5C00]" />
            DaanEats 平台最高管理模組
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-4 uppercase">
            全站數據監理與核心資源調度
          </h1>
          <p className="text-gray-200 text-xs md:text-sm mt-2 leading-relaxed opacity-90">
            提供平台專屬的實時系統管理、手動對接加盟商家、調整訂單生命週期狀態、以及一鍵異步重置資料數據。
          </p>
        </div>

        {/* Floating background graphic outline */}
        <div className="absolute right-6 bottom-[-20px] opacity-10 hidden md:block">
          <ShieldAlert className="w-48 h-48" />
        </div>
      </div>

      {currentNav === "dashboard" && (
        <div className="text-left animate-fade-in">
          {/* Quick diagnostics grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-5">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">全站累計交易額</span>
              <h3 className="text-xl font-black text-[#FF5C00] font-mono mt-1">${totalCompletedSales} TWD</h3>
            </div>
            
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-5">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">實作點餐總案件</span>
              <h3 className="text-xl font-black text-[#0D3B3F] font-mono mt-1">{totalOrdersCount} 筆</h3>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-xl p-5">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">加盟特約商規模</span>
              <h3 className="text-xl font-black text-gray-800 font-mono mt-1">{totalRestaurantsCount} 間店</h3>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-xl p-5">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">在線對外營業中</span>
              <h3 className="text-xl font-black text-emerald-600 font-mono mt-1">{activeRestaurantsCount} 間活躍</h3>
            </div>
          </div>

          {/* Quick debug utilities */}
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 text-left">
            <h3 className="font-extrabold text-[#1A1A1A] text-sm mb-2 uppercase tracking-wide">⚙️ 資料庫一鍵重設與沙盒初始化</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4 font-medium">
              在您新增菜色、管理商鋪和隨意測試點餐、外送騎手配送後，您可以隨時點選下方重置。本重置按鈕將清除並快速將資料庫中的美食、菜單、訂單重設回系統最初最完美的四大加盟店狀態。
            </p>
            <button
              id="btn-reset-db"
              onClick={handleResetData}
              disabled={isResetting}
              className="bg-[#FF5C00] hover:bg-[#FF5C00]/95 disabled:bg-gray-300 text-white font-black text-xs px-5 py-3 rounded-sm transition-all cursor-pointer flex items-center gap-2 uppercase tracking-wider"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`} />
              {isResetting ? "正在清除並覆建 Firebase..." : "安全重置 Firebase 為預設大安美食資料"}
            </button>
          </div>
        </div>
      )}

      {currentNav === "admin-restaurants" && (
        <div className="text-left animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg font-black text-[#1A1A1A] flex items-center gap-2 uppercase tracking-wide">
                <span className="w-2.5 h-5 bg-[#FF5C00] block"></span>
                合約美食商家管理看板 ({totalRestaurantsCount} 家)
              </h2>
              <p className="text-xs text-gray-500 mt-1">管理各特約餐廳，可隨時將不遵守合約的商家封禁或加盟上線新店鋪。</p>
            </div>

            <button
              id="btn-admin-show-add-rest"
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#0D3B3F] hover:bg-[#0D3B3F]/90 text-white rounded-sm text-xs font-black px-4 py-2.5 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" /> 簽約加開新店
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleCreateRestaurant} className="bg-white border border-[#E5E5E5] rounded-xl p-6 mb-8 text-xs font-semibold animate-fade-in text-left">
              <h3 className="font-extrabold text-[#1A1A1A] text-sm mb-4 uppercase tracking-wider">🏪 簽訂新加盟合作合約</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 font-sans">餐廳名稱 *</label>
                    <input
                      id="input-rest-name"
                      type="text"
                      required
                      placeholder="例如：科技大樓阿嬤手工肉卷便當"
                      value={restName}
                      onChange={(e) => setRestName(e.target.value)}
                      className="w-full bg-[#F3F3F3] border border-[#E5E5E5] rounded-sm p-3 text-xs outline-none focus:border-[#FF5C00] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 font-sans">菜系分組</label>
                    <input
                      id="input-rest-cuisine"
                      type="text"
                      required
                      placeholder="例如：台灣傳統小吃、日式拉麵"
                      value={restCuisine}
                      onChange={(e) => setRestCuisine(e.target.value)}
                      className="w-full bg-[#F3F3F3] border border-[#E5E5E5] rounded-sm p-3 text-xs outline-none focus:border-[#FF5C00] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 font-sans">店面聯絡電話</label>
                    <input
                      id="input-rest-phone"
                      type="text"
                      placeholder="02-2735-XXXX"
                      value={restPhone}
                      onChange={(e) => setRestPhone(e.target.value)}
                      className="w-full bg-[#F3F3F3] border border-[#E5E5E5] rounded-sm p-3 text-xs outline-none focus:border-[#FF5600] font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 font-sans">店址 *</label>
                    <input
                      id="input-rest-address"
                      type="text"
                      required
                      placeholder="臺北市大安區和平東路二段..."
                      value={restAddress}
                      onChange={(e) => setRestAddress(e.target.value)}
                      className="w-full bg-[#F3F3F3] border border-[#E5E5E5] rounded-sm p-3 text-xs outline-none focus:border-[#FF5600] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 font-sans">大圖連結 (Unsplash)</label>
                    <input
                      id="input-rest-img"
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={restImg}
                      onChange={(e) => setRestImg(e.target.value)}
                      className="w-full bg-[#F3F3F3] border border-[#E5E5E5] rounded-sm p-3 text-xs outline-none focus:border-[#FF5600] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 font-sans">餐廳簡介</label>
                    <input
                      id="input-rest-desc"
                      type="text"
                      placeholder="傳承三代的手工鮮味..."
                      value={restDesc}
                      onChange={(e) => setRestDesc(e.target.value)}
                      className="w-full bg-[#F3F3F3] border border-[#E5E5E5] rounded-sm p-3 text-xs outline-none focus:border-[#FF5600] font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-gray-150 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-white border border-[#E5E5E5] text-gray-600 rounded-sm px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer text-xs font-black"
                >
                  取消
                </button>
                <button
                  id="btn-confirm-add-rest"
                  type="submit"
                  className="bg-[#0D3B3F] text-white rounded-sm px-5 py-2 hover:bg-[#0D3B3F]/95 transition-colors font-black cursor-pointer text-xs uppercase"
                >
                  確認上線新店舖
                </button>
              </div>
            </form>
          )}

          {/* Restaurant management table list */}
          <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F3F3F3] text-gray-500 uppercase tracking-widest font-black border-b border-[#E5E5E5]">
                  <tr>
                    <th className="p-4">商店頭像 & 名稱</th>
                    <th className="p-4">主營菜分類</th>
                    <th className="p-4">地址門市</th>
                    <th className="p-4">系統狀態</th>
                    <th className="p-4 text-center">關鍵操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold">
                  {restaurants.map((rest) => (
                    <tr key={rest.id} className="hover:bg-gray-50/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={rest.imageUrl}
                            alt={rest.name}
                            className="w-10 h-10 rounded-sm object-cover bg-gray-100 border border-gray-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-extrabold text-[#1A1A1A]">{rest.name}</p>
                            <p className="text-[9px] text-gray-400 font-mono">ID: {rest.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-[#0D3B3F]/10 text-[#0D3B3F] border border-[#0D3B3F]/15 px-2 py-0.5 rounded-sm font-black">
                          {rest.cuisine}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 max-w-xs truncate">{rest.address}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 font-black ${rest.isActive ? "text-emerald-700" : "text-gray-400"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${rest.isActive ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`}></span>
                          {rest.isActive ? "對外公開中" : "暫停封停"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          id={`btn-toggle-rest-active-${rest.id}`}
                          onClick={() => onToggleRestaurantActive(rest.id, rest.isActive)}
                          className={`text-[9px] font-black px-3 py-1.5 rounded-sm transition-all cursor-pointer uppercase ${
                            rest.isActive
                              ? "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"
                              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-650 border border-emerald-250"
                          }`}
                        >
                          {rest.isActive ? "封鎖下架" : "解除重啟"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {currentNav === "admin-orders" && (
        <div className="text-left animate-fade-in">
          <h2 className="text-lg font-black text-[#1A1A1A] mb-6 flex items-center gap-2 uppercase tracking-wide">
            <span className="w-2.5 h-5 bg-[#FF5C00] block"></span>
            DaanEats 全站實時訂單數據看板 ({orders.length} 筆)
          </h2>

          <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden shadow-xs">
            <div className="overflow-x-auto font-semibold">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F3F3F3] text-gray-500 uppercase tracking-widest font-black border-b border-[#E5E5E5]">
                  <tr>
                    <th className="p-4">訂單細節 & 時間</th>
                    <th className="p-4">餐廳與顧客</th>
                    <th className="p-4">點餐細節明細</th>
                    <th className="p-4">外送地址</th>
                    <th className="p-4">實收金額</th>
                    <th className="p-4">進度</th>
                    <th className="p-4">操作介入</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-400 font-bold">
                        DaanEats 目前全平台外送管線尙未形成任何交易單量。
                      </td>
                    </tr>
                  ) : (
                    orders
                      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                      .map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50">
                          <td className="p-4 font-semibold">
                            <span className="font-extrabold text-[#1A1A1A] block font-mono">#{order.id}</span>
                            <span className="text-[9px] text-gray-400 block font-mono">{new Date(order.createdAt).toLocaleTimeString()}</span>
                          </td>
                          <td className="p-4">
                            <p className="font-black text-[#1A1A1A] text-[11px]">{order.restaurantName}</p>
                            <p className="text-[9px] text-gray-400 mt-0.5">買家: {order.customerName}</p>
                          </td>
                          <td className="p-4 max-w-xs">
                            <p className="font-bold text-gray-500 line-clamp-1 text-[11px]">
                              {order.items.map((it) => `${it.name} x${it.quantity}`).join(", ")}
                            </p>
                          </td>
                          <td className="p-4 text-gray-400 max-w-xs truncate">{order.deliveryAddress}</td>
                          <td className="p-4 font-black font-mono text-[#FF5C00] text-sm">${order.totalAmount}</td>
                          <td className="p-4">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider ${
                              order.status === "pending" ? "bg-amber-100 text-amber-850" :
                              order.status === "accepted" ? "bg-blue-150 text-blue-800" :
                              order.status === "preparing" ? "bg-cyan-50 text-cyan-850 border border-cyan-150" :
                              order.status === "delivering" ? "bg-indigo-50 text-indigo-850" :
                              order.status === "completed" ? "bg-emerald-50 text-emerald-850" :
                              "bg-rose-50 text-rose-850"
                            }`}>
                              {order.status === "pending" ? "等待中" :
                               order.status === "accepted" ? "已受理" :
                               order.status === "preparing" ? "製作中" :
                               order.status === "delivering" ? "配送中" :
                               order.status === "completed" ? "SUCCESS" :
                               "CANCELLED"}
                            </span>
                          </td>
                          <td className="p-4">
                            <select
                              id={`select-status-tune-${order.id}`}
                              value={order.status}
                              onChange={(e) => onForceUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                              className="bg-white border border-[#E5E5E5] text-[10px] font-black rounded-sm p-1.5 text-gray-700 outline-none cursor-pointer"
                            >
                              <option value="pending">待受理</option>
                              <option value="accepted">已接單 (待自製)</option>
                              <option value="preparing">廚房備料製作中</option>
                              <option value="delivering">開始配送中</option>
                              <option value="completed">平台判定已送達</option>
                              <option value="cancelled">強制退款取消交易</option>
                            </select>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
