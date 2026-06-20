import { Order, UserProfile } from "../types";
import { Bike, MapPin, AlertCircle, Clock, CheckCircle } from "lucide-react";

interface DriverViewProps {
  orders: Order[];
  currentUser: UserProfile;
  onClaimOrder: (orderId: string, driverId: string, driverName: string) => Promise<void>;
  onCompleteDelivery: (orderId: string) => Promise<void>;
  currentNav: "driver-jobs" | "driver-my";
}

export default function DriverView({
  orders,
  currentUser,
  onClaimOrder,
  onCompleteDelivery,
  currentNav,
}: DriverViewProps) {
  // Available jobs (Status: preparing/accepted, no driverId)
  const availableOrders = orders.filter(
    (o) => (o.status === "preparing" || o.status === "accepted") && !o.driverId
  );

  // Driver active assignments
  const activeDeliveries = orders.filter(
    (o) => o.driverId === currentUser.uid && o.status === "delivering"
  );

  // Completed assignments
  const completedDeliveries = orders.filter(
    (o) => o.driverId === currentUser.uid && o.status === "completed"
  );

  // Earning formula: $100 per delivery
  const totalEarnings = completedDeliveries.length * 100;

  return (
    <div className="py-6" id="driver-view-container">
      {/* Upper metrics segment */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E5E5] mb-8 text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#0D3B3F] rounded-sm flex items-center justify-center text-white shrink-0">
            <Bike className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] bg-[#FF5C00]/10 text-[#FF5C00] font-black px-2.5 py-0.5 rounded-sm border border-[#FF5C00]/25 uppercase tracking-widest">
              大安區金牌速遞員
            </span>
            <h1 className="text-xl font-black text-[#1A1A1A] mt-1">
              DaanEats 特約騎手：{currentUser.name}
            </h1>
            <p className="text-xs text-gray-500 font-mono mt-0.5">車牌登記：臺北大安 Gogoro 3E-298</p>
          </div>
        </div>

        <div className="bg-white border-2 border-dashed border-[#FF5C00] rounded-sm px-5 py-3 text-left md:text-right w-full md:w-auto">
          <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">今日累計已領外送金</span>
          <span className="text-2xl font-black text-[#FF5C00] font-mono leading-tight">${totalEarnings} 元</span>
          <span className="text-[10px] text-[#0D3B3F] block font-bold mt-1">
            基準：完成了 {completedDeliveries.length} 件 | 佣金 $100/單
          </span>
        </div>
      </div>

      {currentNav === "driver-jobs" && (
        <div className="text-left animate-fade-in">
          <h2 className="text-lg font-black text-[#1A1A1A] mb-6 flex items-center gap-2 uppercase tracking-wide">
            <span className="w-2.5 h-5 bg-[#FF5C00] block"></span>
            待取貨訂單大廳 ({availableOrders.length} 件)
          </h2>

          {availableOrders.length === 0 ? (
            <div className="bg-white rounded-xl py-16 border border-[#E5E5E5] text-center text-gray-400 text-xs">
              <AlertCircle className="w-12 h-12 text-[#FF5C00]/40 mx-auto mb-3" />
              <p className="font-extrabold text-[#1A1A1A] mb-1">目前大安區暫無待搶外送案件</p>
              <p className="text-gray-400">提示：您可以點擊導覽列「切換消費者前台」下單，或進入「商家後台」開始製作！</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableOrders.map((order) => {
                const totalItemsQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

                return (
                  <div
                    key={order.id}
                    id={`available-order-${order.id}`}
                    className="bg-white border border-[#E5E5E5] rounded-xl p-5 hover:border-[#FF5C00] transition-colors flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-mono font-bold text-gray-400">ORDER #{order.id}</span>
                        <span className="bg-[#0D3B3F] text-white text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider">
                          餐點已備妥
                        </span>
                      </div>

                      {/* Route specs */}
                      <div className="space-y-3.5 mb-5 text-xs">
                        <div className="flex items-start gap-2.5">
                          <div className="w-5 h-5 rounded-sm bg-[#0D3B3F] text-white font-black text-[10px] flex items-center justify-center shrink-0">
                            起
                          </div>
                          <div>
                            <p className="font-extrabold text-[#1A1A1A]">{order.restaurantName}</p>
                            <p className="text-gray-400 text-[10px] truncate max-w-xs">{order.deliveryAddress}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <div className="w-5 h-5 rounded-sm bg-[#FF5C00] text-white font-black text-[10px] flex items-center justify-center shrink-0">
                            訖
                          </div>
                          <div>
                            <p className="font-extrabold text-[#2D2D2D]">大安區送達地</p>
                            <p className="text-xs text-gray-800 font-bold leading-relaxed bg-[#F3F3F3] p-2 mt-1 rounded-sm border border-[#E5E5E5]">
                              {order.deliveryAddress}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Meta stats */}
                      <div className="bg-[#F3F3F3] rounded-sm p-3.5 border border-[#E5E5E5] flex justify-between text-xs mb-4">
                        <div className="text-left">
                          <span className="text-gray-400 block text-[9px] font-bold uppercase tracking-wider">餐盒數量</span>
                          <span className="font-bold text-gray-800">{totalItemsQty} 件餐點</span>
                        </div>
                        <div className="text-center">
                          <span className="text-gray-400 block text-[9px] font-bold uppercase tracking-wider">配送佣金</span>
                          <span className="font-mono font-black text-[#FF5C00]">+$100 元</span>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-400 block text-[9px] font-bold uppercase tracking-wider">支付類別</span>
                          <span className="font-bold text-gray-500">線上刷卡已付</span>
                        </div>
                      </div>
                    </div>

                    <button
                      id={`btn-claim-order-${order.id}`}
                      onClick={() => onClaimOrder(order.id, currentUser.uid, currentUser.name)}
                      className="w-full bg-[#FF5C00] hover:bg-[#FF5C00]/95 text-white rounded-sm py-3 text-xs font-black transition-all cursor-pointer text-center uppercase tracking-wider"
                    >
                      接單派送 (佣金 $100)
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {currentNav === "driver-my" && (
        <div className="text-left animate-fade-in">
          {/* Active claim task */}
          <h2 className="text-lg font-black text-[#1A1A1A] mb-6 flex items-center gap-2 uppercase tracking-wide">
            <span className="w-2.5 h-5 bg-[#FF5C00] block"></span>
            我正在配送的案件 ({activeDeliveries.length})
          </h2>

          {activeDeliveries.length === 0 ? (
            <div className="bg-white rounded-xl py-12 border border-[#E5E5E5] text-center text-gray-500 text-xs mb-8">
              目前您沒有進行中的配送項目。快去「搶單大廳」挑選新案件吧！
            </div>
          ) : (
            <div className="space-y-6 mb-8">
              {activeDeliveries.map((order) => {
                return (
                  <div
                    key={order.id}
                    id={`active-delivery-${order.id}`}
                    className="bg-white border border-[#E5E5E5] rounded-xl p-6 text-left"
                  >
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
                      <span className="text-xs font-bold font-mono text-gray-400">ORDER ID: #{order.id}</span>
                      <span className="bg-[#FF5C00] text-white text-[10px] font-black px-2.5 py-0.5 rounded-sm animate-pulse tracking-widest">
                        DELIVERING
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4 text-xs">
                        <div className="flex gap-2.5">
                          <MapPin className="w-4 h-4 text-[#0D3B3F] shrink-0" />
                          <div>
                            <p className="font-extrabold text-gray-400">餐廳來源地</p>
                            <p className="text-gray-900 font-extrabold text-sm">{order.restaurantName}</p>
                          </div>
                        </div>

                        <div className="flex gap-2.5">
                          <MapPin className="w-4 h-4 text-[#FF5C00] shrink-0" />
                          <div>
                            <p className="font-extrabold text-gray-400">消費者目的地</p>
                            <p className="text-gray-900 font-black text-sm">{order.deliveryAddress}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#F3F3F3] p-4 rounded-sm border border-[#E5E5E5] text-xs flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 font-bold block uppercase text-[10px]">餐點內容</span>
                            <span className="font-bold text-gray-700">{order.items.length} 樣餐品</span>
                          </div>
                          <ul className="space-y-1 text-xs text-gray-650 font-medium pl-3 list-disc">
                            {order.items.map((it, idx) => (
                              <li key={idx}>
                                {it.name} <span className="font-mono text-gray-400">x{it.quantity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {order.notes && (
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <p className="text-[10px] text-red-600 font-bold">買家指定備註：【{order.notes}】</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      id={`btn-complete-delivery-${order.id}`}
                      onClick={() => onCompleteDelivery(order.id)}
                      className="w-full bg-[#0D3B3F] hover:bg-[#0D3B3F]/90 text-white rounded-sm py-4 text-xs font-black transition-all cursor-pointer text-center uppercase tracking-widest"
                    >
                      ✓ 安全送達目的地 (確認解卡)
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Past completed records */}
          <h2 className="text-lg font-black text-[#1A1A1A] mb-4 flex items-center gap-2 uppercase tracking-wide">
            <span className="w-2.5 h-5 bg-gray-400 block animate-none"></span>
            今日歷史配送明細 ({completedDeliveries.length})
          </h2>

          {completedDeliveries.length === 0 ? (
            <div className="bg-white rounded-xl py-8 border border-[#E5E5E5] text-center text-gray-400 text-xs shadow-xs">
              您今天尚未交付過任何外送。
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E5E5E5] divide-y divide-gray-100 overflow-hidden shadow-xs">
              {completedDeliveries.map((order) => {
                return (
                  <div key={order.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs bg-white hover:bg-gray-50 transition-colors">
                    <div className="text-left">
                      <p className="font-black text-gray-800">{order.restaurantName} ➔ 買家住址</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                        案號 #{order.id} | 地址：{order.deliveryAddress}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono font-black text-emerald-600 font-bold">佣金已入帳：+$100</span>
                      <span className="bg-[#0D3B3F]/15 text-[#0D3B3F] font-black text-[9px] px-2 py-0.5 rounded-sm border border-[#0D3B3F]/20">
                        SUCCESS
                      </span>
                    </div>
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
