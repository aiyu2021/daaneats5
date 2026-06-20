import React from "react";
import { UserProfile, UserRole } from "../types";
import { ListOrdered, ShieldAlert, Bike, Store, User, Compass, ShoppingBag } from "lucide-react";

interface NavbarProps {
  currentUser: UserProfile;
  onChangeRole: (role: UserRole) => void;
  cartCount: number;
  onNavigate: (view: "browse" | "cart" | "orders" | "dashboard" | "menu" | "driver-jobs" | "driver-my" | "admin-restaurants" | "admin-orders") => void;
  currentNav: string;
}

export default function Navbar({
  currentUser,
  onChangeRole,
  cartCount,
  onNavigate,
  currentNav,
}: NavbarProps) {
  const roles: { id: UserRole; name: string; icon: React.ReactNode; color: string }[] = [
    { id: "customer", name: "顧客前台", icon: <Compass className="w-4 h-4" />, color: "bg-[#FF5C00]" },
    { id: "restaurant", name: "餐廳後台", icon: <Store className="w-4 h-4" />, color: "bg-[#0D3B3F]" },
    { id: "driver", name: "司機配送", icon: <Bike className="w-4 h-4" />, color: "bg-[#1A1A1A]" },
    { id: "admin", name: "系統管理", icon: <ShieldAlert className="w-4 h-4" />, color: "bg-slate-700" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E5E5E5] shadow-xs" id="header-daaneats">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate(currentUser.role === "customer" ? "browse" : "dashboard")}>
            <div className="w-9 h-9 bg-[#FF5C00] rounded-sm flex items-center justify-center text-white font-black text-xl shadow-xs transition-transform hover:scale-102">
              D
            </div>
            <div>
              <span className="text-xl font-black tracking-tighter uppercase text-[#1A1A1A]">
                DAANEATS <span className="font-medium text-xs tracking-normal text-gray-500 block sm:inline-block sm:ml-1 font-mono">大安外送</span>
              </span>
            </div>
          </div>

          {/* Quick Role Emulator & User Stats */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex bg-[#F3F3F3] p-1 rounded-sm border border-[#E5E5E5]">
              {roles.map((r) => {
                const isActive = currentUser.role === r.id;
                return (
                  <button
                    key={r.id}
                    id={`btn-role-${r.id}`}
                    onClick={() => onChangeRole(r.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-sm text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#1A1A1A] text-white shadow-xs font-black"
                        : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                    }`}
                  >
                    <span className={isActive ? "text-[#FF5C00]" : "text-gray-400"}>
                      {r.icon}
                    </span>
                    <span>{r.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile / Compact Role Select dropdown */}
            <div className="lg:hidden flex items-center bg-[#F3F3F3] rounded-sm px-2.5 py-1.5 border border-[#E5E5E5]">
              <select
                id="select-role-mobile"
                value={currentUser.role}
                onChange={(e) => onChangeRole(e.target.value as UserRole)}
                className="bg-transparent text-xs font-bold text-[#1A1A1A] outline-none cursor-pointer"
              >
                <option value="customer">⬥ 顧客前台</option>
                <option value="restaurant">⬥ 餐廳後台</option>
                <option value="driver">⬥ 司機配送</option>
                <option value="admin">⬥ 系統管理</option>
              </select>
            </div>

            {/* User Avatar & Navigation links based on role */}
            <div className="flex items-center space-x-3 border-l border-[#E5E5E5] pl-4">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-bold text-[#2D2D2D] flex items-center justify-end space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00]"></span>
                  <span>{currentUser.name}</span>
                </div>
                <div className="text-[10px] text-gray-400 font-bold tracking-widest font-mono uppercase">
                  {currentUser.role}
                </div>
              </div>
              
              <div className="w-9 h-9 rounded-sm bg-[#FF5C00]/10 flex items-center justify-center text-[#FF5C00] font-black border border-[#FF5C00]/20">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Role-specific Navigation Bar */}
        <div className="flex space-x-3 border-t border-[#E5E5E5] py-2 overflow-x-auto text-xs font-bold no-scrollbar">
          {currentUser.role === "customer" && (
            <>
              <button
                id="nav-customer-browse"
                onClick={() => onNavigate("browse")}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-sm transition-all ${
                  currentNav === "browse" ? "bg-[#FF5C00] text-white" : "text-[#2D2D2D] hover:bg-[#F3F3F3] border border-transparent"
                }`}
              >
                <span className="text-xs">⬥</span>
                <span>探索美食</span>
              </button>
              <button
                id="nav-customer-cart"
                onClick={() => onNavigate("cart")}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-sm transition-all relative ${
                  currentNav === "cart" ? "bg-[#FF5C00] text-white" : "text-[#2D2D2D] hover:bg-[#F3F3F3] border border-transparent"
                }`}
              >
                <span className="text-xs">⬦</span>
                <span>購物車</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-sm bg-[#0D3B3F] text-[9px] font-black text-[#FFB800] ring-1 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                id="nav-customer-orders"
                onClick={() => onNavigate("orders")}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-sm transition-all ${
                  currentNav === "orders" ? "bg-[#FF5C00] text-white" : "text-[#2D2D2D] hover:bg-[#F3F3F3] border border-transparent"
                }`}
              >
                <span className="text-xs">⬦</span>
                <span>追蹤訂單</span>
              </button>
            </>
          )}

          {currentUser.role === "restaurant" && (
            <>
              <button
                id="nav-restaurant-orders"
                onClick={() => onNavigate("dashboard")}
                className={`px-3.5 py-2 rounded-sm transition-all ${
                  currentNav === "dashboard" ? "bg-[#0D3B3F] text-white" : "text-[#2D2D2D] hover:bg-[#F3F3F3]"
                }`}
              >
                ⬥ 訂單管理
              </button>
              <button
                id="nav-restaurant-menu"
                onClick={() => onNavigate("menu")}
                className={`px-3.5 py-2 rounded-sm transition-all ${
                  currentNav === "menu" ? "bg-[#0D3B3F] text-white" : "text-[#2D2D2D] hover:bg-[#F3F3F3]"
                }`}
              >
                ⬦ 菜單更新
              </button>
            </>
          )}

          {currentUser.role === "driver" && (
            <>
              <button
                id="nav-driver-jobs"
                onClick={() => onNavigate("driver-jobs")}
                className={`px-3.5 py-2 rounded-sm transition-all ${
                  currentNav === "driver-jobs" ? "bg-[#1A1A1A] text-white" : "text-[#2D2D2D] hover:bg-[#F3F3F3]"
                }`}
              >
                ⬥ 搶單大廳
              </button>
              <button
                id="nav-driver-my"
                onClick={() => onNavigate("driver-my")}
                className={`px-3.5 py-2 rounded-sm transition-all ${
                  currentNav === "driver-my" ? "bg-[#1A1A1A] text-white" : "text-[#2D2D2D] hover:bg-[#F3F3F3]"
                }`}
              >
                ⬦ 配送任務
              </button>
            </>
          )}

          {currentUser.role === "admin" && (
            <>
              <button
                id="nav-admin-dashboard"
                onClick={() => onNavigate("dashboard")}
                className={`px-3.5 py-2 rounded-sm transition-all ${
                  currentNav === "dashboard" ? "bg-[#2D2D2D] text-white" : "text-[#2D2D2D] hover:bg-[#F3F3F3]"
                }`}
              >
                ⬥ 數據指標
              </button>
              <button
                id="nav-admin-restaurants"
                onClick={() => onNavigate("admin-restaurants")}
                className={`px-3.5 py-2 rounded-sm transition-all ${
                  currentNav === "admin-restaurants" ? "bg-[#2D2D2D] text-white" : "text-[#2D2D2D] hover:bg-[#F3F3F3]"
                }`}
              >
                ⬦ 商家管理
              </button>
              <button
                id="nav-admin-orders"
                onClick={() => onNavigate("admin-orders")}
                className={`px-3.5 py-2 rounded-sm transition-all ${
                  currentNav === "admin-orders" ? "bg-[#2D2D2D] text-white" : "text-[#2D2D2D] hover:bg-[#F3F3F3]"
                }`}
              >
                ⬦ 全站訂單
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
