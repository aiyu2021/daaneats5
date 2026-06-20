import React, { useState } from "react";
import { Restaurant, MenuItem, Order, OrderStatus } from "../types";
import { Plus, Trash2, Check, AlertCircle, ToggleLeft, ToggleRight, DollarSign, ClipboardList, CheckCircle } from "lucide-react";

interface RestaurantViewProps {
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onAddMenuItem: (restaurantId: string, item: Omit<MenuItem, "id" | "restaurantId">) => Promise<void>;
  onUpdateMenuItemAvailability: (restaurantId: string, itemId: string, isAvailable: boolean) => Promise<void>;
  onDeleteMenuItem: (restaurantId: string, itemId: string) => Promise<void>;
  currentNav: "dashboard" | "menu";
}

export default function RestaurantView({
  restaurants,
  menuItems,
  orders,
  onUpdateOrderStatus,
  onAddMenuItem,
  onUpdateMenuItemAvailability,
  onDeleteMenuItem,
  currentNav,
}: RestaurantViewProps) {
  // Select active restaurant
  const [activeRestaurantId, setActiveRestaurantId] = useState<string>("rest_beef_noodles");
  
  // Add item form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("熱銷美食");
  const [newItemImg, setNewItemImg] = useState("");

  const currentRest = restaurants.find((r) => r.id === activeRestaurantId) || restaurants[0];

  if (!currentRest) {
    return (
      <div className="py-12 text-center" id="restaurant-view-no-restaurants">
        <p className="text-gray-400">目前平台還未建立多端商家資料，請先按系統管理或種子資料初始化。</p>
      </div>
    );
  }

  // Filter orders for active restaurant
  const restaurantOrders = orders
    .filter((o) => o.restaurantId === currentRest.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  // Filter menu items for active restaurant
  const restaurantMenuItems = menuItems.filter((m) => m.restaurantId === currentRest.id);

  // Stats calculation
  const pendingOrdersCount = restaurantOrders.filter((o) => o.status === "pending").length;
  const preparingOrdersCount = restaurantOrders.filter((o) => o.status === "preparing" || o.status === "accepted").length;
  const completedAmount = restaurantOrders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const handleAddNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    const priceVal = parseFloat(newItemPrice);
    if (isNaN(priceVal)) return;

    try {
      await onAddMenuItem(currentRest.id, {
        name: newItemName,
        description: newItemDesc,
        price: priceVal,
        category: newItemCategory,
        imageUrl: newItemImg || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300",
        isAvailable: true,
      });
      // Clear inputs
      setNewItemName("");
      setNewItemPrice("");
      setNewItemDesc("");
      setNewItemCategory("熱銷美食");
      setNewItemImg("");
      setShowAddForm(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="py-6" id="restaurant-view-container">
      {/* Selector of restaurant for demonstration ease */}
      <div className="bg-[#0D3B3F]/5 border border-[#0D3B3F]/20 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 text-left">
        <div className="flex-1">
          <h4 className="text-sm font-black text-[#0D3B3F] flex items-center gap-1.5 uppercase tracking-wide">
            🔑 商家後台模擬切換器
          </h4>
          <p className="text-[11px] text-[#0D3B3F]/80 leading-relaxed mt-0.5 font-medium">
            模擬多端商家權限：您可以即刻切換至大安區任一特約餐廳的後端，進行即刻接單、廚房備餐或管理菜單。
          </p>
        </div>

        <select
          id="select-restaurant-owner"
          value={activeRestaurantId}
          onChange={(e) => setActiveRestaurantId(e.target.value)}
          className="bg-white border border-[#E5E5E5] text-xs font-black text-gray-700 rounded-sm px-4 py-2.5 outline-none cursor-pointer focus:border-[#FF5600]"
        >
          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>
              🍳 {r.name}
            </option>
          ))}
        </select>
      </div>

      {currentNav === "dashboard" && (
        <div className="animate-fade-in">
          {/* Header Dashboard Banner */}
          <div className="bg-white rounded-xl p-6 border border-[#E5E5E5] mb-8 text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-sm overflow-hidden shadow-xs shrink-0 bg-gray-50 border border-gray-150">
                <img src={currentRest.imageUrl} alt={currentRest.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <span className="text-[9px] bg-[#FF5C00]/10 text-[#FF5C00] font-black px-2 py-0.5 rounded-sm border border-[#FF5C00]/25 uppercase tracking-widest">
                  大安合作特約商
                </span>
                <h1 className="text-xl font-black text-[#1A1A1A] mt-1">{currentRest.name}</h1>
                <p className="text-xs text-gray-500 mt-0.5 font-mono">地址：{currentRest.address} | 電話碼：{currentRest.phone}</p>
              </div>
            </div>

            <div className="flex gap-2 items-center bg-[#F3F3F3] px-3.5 py-1.5 rounded-sm border border-[#E5E5E5]">
              <span className={`w-2 h-2 rounded-full ${currentRest.isActive ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`}></span>
              <span className="text-xs font-bold text-gray-750">
                營業狀態：{currentRest.isActive ? "對外公開營業中" : "暫停前台顯示"}
              </span>
            </div>
          </div>

          {/* Metrics grids */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-1">待處理新單</p>
                <h3 className="text-2xl font-black text-[#FF5C00] font-mono">{pendingOrdersCount} 件</h3>
              </div>
              <div className="w-12 h-12 bg-[#FF5C00]/10 border border-[#FF5C00]/15 rounded-sm flex items-center justify-center text-[#FF5C00]">
                <ClipboardList className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E5E5] p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-1">廚房備餐與配送中</p>
                <h3 className="text-2xl font-black text-[#0D3B3F] font-mono">{preparingOrdersCount} 件</h3>
              </div>
              <div className="w-12 h-12 bg-[#0D3B3F]/10 border border-[#0D3B3F]/15 rounded-sm flex items-center justify-center text-[#0D3B3F]">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E5E5] p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-1">已交付結算營收</p>
                <h3 className="text-2xl font-black text-emerald-600 font-mono">${completedAmount} 元</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-sm flex items-center justify-center text-emerald-600">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Order list control board */}
          <h2 className="text-lg font-black text-[#1A1A1A] mb-6 flex items-center gap-2 text-left uppercase tracking-wide">
            <span className="w-2.5 h-5 bg-[#FF5C00] block"></span>
            商家實時定單看板 ({restaurantOrders.length} 筆)
          </h2>

          {restaurantOrders.length === 0 ? (
            <div className="bg-white rounded-xl py-12 border border-[#E5E5E5] text-center text-gray-400 text-xs">
              目前該商家尙無任何點餐外送訂單紀錄
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {restaurantOrders.map((order) => {
                return (
                  <div
                    key={order.id}
                    id={`restaurant-order-${order.id}`}
                    className="bg-white rounded-xl border border-[#E5E5E5] hover:border-gray-300 p-5 text-left"
                  >
                    {/* Top status header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-gray-150 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[#1A1A1A] text-sm font-mono">
                            訂單：#{order.id}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {new Date(order.createdAt).toLocaleString("zh-TW")}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-relaxed mt-1">
                          顧客：{order.customerName} | 外送目的地：{order.deliveryAddress}
                        </p>
                      </div>

                      {/* Current Status Badge */}
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-sm uppercase tracking-wider ${
                        order.status === "pending" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                        order.status === "accepted" ? "bg-blue-100 text-blue-800 border border-blue-200" :
                        order.status === "preparing" ? "bg-cyan-150 text-cyan-850 border border-cyan-200 bg-cyan-50" :
                        order.status === "delivering" ? "bg-indigo-50 text-indigo-800 border border-indigo-200" :
                        order.status === "completed" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" :
                        "bg-rose-50 text-rose-800 border border-rose-200"
                      }`}>
                        {order.status === "pending" ? "待確認接單" :
                         order.status === "accepted" ? "已接單待烹飪" :
                         order.status === "preparing" ? "廚房備餐製作中" :
                         order.status === "delivering" ? "司機快遞配送中" :
                         order.status === "completed" ? "SUCCESS 已完成" :
                         "✓ 已取消/退款"}
                      </span>
                    </div>

                    {/* Middle: Items detail */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4 text-xs font-medium">
                      <div>
                        <p className="font-black text-gray-400 mb-1.5 uppercase tracking-wide text-[10px]">烹飪指示</p>
                        <ul className="space-y-1 bg-[#F3F3F3] p-3.5 rounded-sm border border-[#E5E5E5] font-semibold text-[11px]">
                          {order.items.map((it, idx) => (
                            <li key={idx} className="flex justify-between text-gray-700">
                              <span>
                                {it.name} <span className="font-black text-gray-400 font-mono">x{it.quantity}</span>
                              </span>
                              <span className="font-mono text-gray-500">${it.price * it.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex flex-col justify-between">
                        <div>
                          <p className="font-black text-gray-400 mb-1 uppercase tracking-wide text-[10px]">買家廚房備註說明</p>
                          <p className="text-gray-600 bg-amber-50/50 p-3 rounded-sm border border-amber-100 italic font-medium leading-relaxed">
                            「{order.notes || "消費者未指定特別備註"}」
                          </p>
                        </div>
                        <div className="mt-2 text-right">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">平台結算回匯商家</span>
                          <span className="text-lg font-black text-[#FF5C00] font-mono">${order.totalAmount} 元</span>
                        </div>
                      </div>
                    </div>

                    {/* Action controls */}
                    <div className="flex flex-wrap gap-2 justify-end pt-3 border-t border-gray-100">
                      {order.status === "pending" && (
                        <>
                          <button
                            id={`btn-cancel-order-${order.id}`}
                            onClick={() => onUpdateOrderStatus(order.id, "cancelled")}
                            className="bg-white border border-[#E5E5E5] text-rose-600 hover:bg-rose-50 text-[11px] font-black px-4 py-2 rounded-sm transition-colors cursor-pointer"
                          >
                            不接此單 (退回消費者)
                          </button>
                          <button
                            id={`btn-accept-order-${order.id}`}
                            onClick={() => onUpdateOrderStatus(order.id, "accepted")}
                            className="bg-[#FF5C00] hover:bg-[#FF5C00]/90 text-white text-[11px] font-black px-4 py-2 rounded-sm transition-all cursor-pointer flex items-center gap-1 uppercase tracking-wider"
                          >
                            <Check className="w-3.5 h-3.5" /> 接受訂單
                          </button>
                        </>
                      )}

                      {order.status === "accepted" && (
                        <button
                          id={`btn-prepare-order-${order.id}`}
                          onClick={() => onUpdateOrderStatus(order.id, "preparing")}
                          className="bg-[#0D3B3F] hover:bg-[#0D3B3F]/90 text-white text-[11px] font-black px-5 py-2.5 rounded-sm transition-colors cursor-pointer flex items-center gap-1 uppercase tracking-wider"
                        >
                          🍳 確認下廚 (傳送給炒鍋)
                        </button>
                      )}

                      {order.status === "preparing" && (
                        <div className="flex items-center gap-1.5 text-[11px] text-[#0D3B3F] bg-[#0D3B3F]/5 border border-[#0D3B3F]/15 px-3 py-1.5 rounded-sm">
                          <AlertCircle className="w-4 h-4 shrink-0 animate-pulse" />
                          <span>廚房火速烹製中（等待附近騎手搶單並到店取餐...）</span>
                        </div>
                      )}

                      {order.status === "delivering" && (
                        <div className="flex items-center gap-1.5 text-[11px] text-[#FF5C00] bg-[#FF5C00]/5 border border-[#FF5C00]/15 px-3 py-1.5 rounded-sm">
                          <span>🛵 特約騎手選手「{order.driverName}」正在快馬加鞭運送中</span>
                        </div>
                      )}

                      {order.status === "completed" && (
                        <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-sm font-black uppercase tracking-wide">
                          ✓ 該筆訂單配送圓滿成功
                        </div>
                      )}

                      {order.status === "cancelled" && (
                        <div className="text-[11px] text-gray-500 bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-sm font-black uppercase tracking-wide">
                          ✕ 交易拒絕 / 已完成款項退還
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {currentNav === "menu" && (
        <div className="text-left animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg font-black text-[#1A1A1A] flex items-center gap-2 uppercase tracking-wide">
                <span className="w-2.5 h-5 bg-[#FF5C00] block"></span>
                美味自主菜單管理項目 ({restaurantMenuItems.length} 件)
              </h2>
              <p className="text-xs text-gray-500 mt-1">您可以隨時手動上架新菜、調整餐點售價、或宣告商品沽清一鍵下架。</p>
            </div>

            <button
              id="btn-show-add-item-form"
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#0D3B3F] hover:bg-[#0D3B3F]/90 text-white rounded-sm text-xs font-black px-4 py-2.5 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" /> 新增主食餐點
            </button>
          </div>

          {/* Add Item form */}
          {showAddForm && (
            <form onSubmit={handleAddNewItem} className="bg-white border border-[#E5E5E5] rounded-xl p-6 mb-8 text-xs font-semibold animate-fade-in text-left">
              <h3 className="font-extrabold text-[#1A1A1A] text-sm mb-4 uppercase tracking-wider">🆕 建立全新美味品項</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">商品名稱 *</label>
                    <input
                      id="input-item-name"
                      type="text"
                      required
                      placeholder="例如：主廚厚切豬排咖哩飯"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full bg-[#F3F3F3] border border-[#E5E5E5] rounded-sm p-3 text-xs outline-none focus:border-[#FF5C00] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">餐點定價 (TWD) *</label>
                    <input
                      id="input-item-price"
                      type="number"
                      required
                      placeholder="150"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      className="w-full bg-[#F3F3F3] border border-[#E5E5E5] rounded-sm p-3 text-xs outline-none focus:border-[#FF5C00] font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">美食分組群</label>
                    <input
                      id="input-item-category"
                      type="text"
                      placeholder="例如：主食、經典配菜、甜品冷飲"
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      className="w-full bg-[#F3F3F3] border border-[#E5E5E5] rounded-sm p-3 text-xs outline-none focus:border-[#FF5C00] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">餐品大圖網址 (Unsplash 連結)</label>
                    <input
                      id="input-item-url"
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={newItemImg}
                      onChange={(e) => setNewItemImg(e.target.value)}
                      className="w-full bg-[#F3F3F3] border border-[#E5E5E5] rounded-sm p-3 text-xs outline-none focus:border-[#FF5C00] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">商品描述描述 (健康與食材說明 *選填*)</label>
                  <textarea
                    id="input-item-desc"
                    rows={4}
                    placeholder="精選頂級大麥豬後腿肉，裹上粗粒麵包屑炸至酥脆，配上香濃咖哩中藥醬底..."
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    className="w-full bg-[#F3F3F3] border border-[#E5E5E5] rounded-sm p-2.5 text-xs outline-none focus:border-[#FF5C00] resize-none font-medium h-[116px]"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-gray-150 mt-6 md:mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-white border border-[#E5E5E5] text-gray-600 rounded-sm px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer text-xs font-black"
                >
                  取消
                </button>
                <button
                  id="btn-confirm-add-item"
                  type="submit"
                  className="bg-[#FF5C00] text-white rounded-sm px-5 py-2 hover:bg-[#FF5C00]/95 transition-colors font-black cursor-pointer text-xs uppercase"
                >
                  確認發佈菜單
                </button>
              </div>
            </form>
          )}

          {/* Menu items list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {restaurantMenuItems.length === 0 ? (
              <div className="bg-white rounded-xl py-12 border border-[#E5E5E5] text-center text-gray-400 text-xs md:col-span-2 shadow-xs">
                目前該店尚未在 DaanEats 上架任何商品。快點選上方「新增特色美食」！
              </div>
            ) : (
              restaurantMenuItems.map((item) => (
                <div
                  key={item.id}
                  id={`editable-menu-item-${item.id}`}
                  className="bg-white rounded-xl border border-[#E5E5E5] hover:border-[#FF5C00] p-4 flex gap-4 transition-colors"
                >
                  <div className="w-16 h-16 rounded-sm bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>

                  <div className="flex-1 my-auto text-left">
                    <div className="flex items-start justify-between gap-1.5">
                      <div>
                        <span className="text-[9px] text-[#0D3B3F] bg-[#0D3B3F]/5 font-black px-1.5 py-0.5 rounded-sm font-mono uppercase tracking-wider">
                          {item.category}
                        </span>
                        <h4 className="font-extrabold text-gray-900 text-sm mt-1">{item.name}</h4>
                      </div>
                      <span className="font-mono text-[#FF5C00] font-black">${item.price}</span>
                    </div>

                    <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{item.description || "店家尚未撰寫食材特別簡介"}</p>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-3">
                      <div className="flex items-center gap-1 cursor-pointer" onClick={() => onUpdateMenuItemAvailability(currentRest.id, item.id, !item.isAvailable)}>
                        {item.isAvailable ? (
                          <ToggleRight className="w-6 h-6 text-emerald-500 shrink-0" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-gray-300 shrink-0" />
                        )}
                        <span className={`text-[10px] font-black uppercase tracking-wider ${item.isAvailable ? "text-emerald-700" : "text-gray-400"}`}>
                          {item.isAvailable ? "供應中" : "已估清/下架"}
                        </span>
                      </div>

                      <button
                        id={`btn-delete-item-${item.id}`}
                        onClick={() => onDeleteMenuItem(currentRest.id, item.id)}
                        className="text-gray-400 hover:text-rose-550 transition-colors p-1 cursor-pointer"
                        title="下架刪除"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
