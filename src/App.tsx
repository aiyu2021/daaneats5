import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc, setDoc, deleteDoc, writeBatch, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { seedDatabaseIfEmpty, SEED_RESTAURANTS, SEED_MENU_ITEMS } from "./dbSeed";
import { Restaurant, MenuItem, Order, CartItem, UserProfile, UserRole, OrderStatus } from "./types";
import Navbar from "./components/Navbar";
import CustomerView from "./components/CustomerView";
import RestaurantView from "./components/RestaurantView";
import DriverView from "./components/DriverView";
import AdminView from "./components/AdminView";

// Emulated Profiles
const PROFILE_CONFIGS: { [key in UserRole]: UserProfile } = {
  customer: {
    uid: "user_customer_lindatsao",
    name: "學生",
    email: "lindatsao0910@gmail.com",
    role: "customer",
    phone: "0912-345-678",
    address: "臺北市大安區和平東路二段94號(國立臺北教育大學附設實驗國民小學)",
    createdAt: new Date().toISOString()
  },
  restaurant: {
    uid: "user_restaurant_chef",
    name: "陳老闆 ",
    email: "owner@daaneats.com",
    role: "restaurant",
    phone: "02-2735-8888",
    address: "臺北市大安區和平東路二段118巷20號",
    createdAt: new Date().toISOString()
  },
  driver: {
    uid: "user_driver_fast",
    name: "張快遞 🛵",
    email: "driver@daaneats.com",
    role: "driver",
    phone: "0988-777-666",
    address: "大安區配送機動點",
    createdAt: new Date().toISOString()
  },
  admin: {
    uid: "user_admin_supreme",
    name: "大安總管 📊",
    email: "admin@daaneats.com",
    role: "admin",
    phone: "02-2700-1111",
    address: "DaanEats 平台營運中心",
    createdAt: new Date().toISOString()
  }
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(PROFILE_CONFIGS.customer);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(SEED_RESTAURANTS);
  const [menuItemsByRest, setMenuItemsByRest] = useState<{ [restId: string]: MenuItem[] }>(SEED_MENU_ITEMS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Compute menuItems flat list
  const menuItems: MenuItem[] = Object.values(menuItemsByRest).flat() as MenuItem[];

  // Compact Navigation State for multiple roles
  // "browse" / "cart" / "orders" (Customer)
  // "dashboard" / "menu" (Restaurant)
  // "driver-jobs" / "driver-my" (Driver)
  // "dashboard" / "admin-restaurants" / "admin-orders" (Admin)
  const [currentNav, setCurrentNav] = useState<string>("browse");

  // 1. Initial Seeding and continuous sync
  useEffect(() => {
    const initializeAndSync = async () => {
      // Seed if necessary
      await seedDatabaseIfEmpty();

      // Sync Restaurants real-time
      const unsubRestaurants = onSnapshot(collection(db, "restaurants"), (snapshot) => {
        const restList: Restaurant[] = [];
        snapshot.forEach((docSnap) => {
          restList.push(docSnap.data() as Restaurant);
        });

        // Ensure School Lunch is always present
        const hasSchoolLunch = restList.some((r) => r.id === "rest_school_lunch");
        if (!hasSchoolLunch) {
          const schoolLunchSeed = SEED_RESTAURANTS.find((r) => r.id === "rest_school_lunch");
          if (schoolLunchSeed) {
            restList.push(schoolLunchSeed);
          }
        }

        setRestaurants(restList);
      });

      // Sync Orders real-time
      const unsubOrders = onSnapshot(collection(db, "orders"), (snapshot) => {
        const orderList: Order[] = [];
        snapshot.forEach((docSnap) => {
          orderList.push(docSnap.data() as Order);
        });
        setOrders(orderList);
      });

      return () => {
        unsubRestaurants();
        unsubOrders();
      };
    };

    initializeAndSync();
  }, []);

  // 2. Fetch menu items for all loaded restaurants
  // We keep a separate effect listening to menu items for all active restaurants
  useEffect(() => {
    if (restaurants.length === 0) return;

    const unsubs: (() => void)[] = [];

    restaurants.forEach((rest) => {
      const menuCol = collection(db, "restaurants", rest.id, "menuItems");
      const unsubMenu = onSnapshot(menuCol, (snapshot) => {
        const items: MenuItem[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as MenuItem);
        });

        // Ensure school lunch menu items are hydrated
        if (rest.id === "rest_school_lunch") {
          const lunchSeeds = SEED_MENU_ITEMS["rest_school_lunch"];
          if (lunchSeeds) {
            lunchSeeds.forEach((item) => {
              if (!items.some((it) => it.id === item.id)) {
                items.push(item);
              }
            });
          }
        }

        setMenuItemsByRest((prev) => ({
          ...prev,
          [rest.id]: items,
        }));
      });
      unsubs.push(unsubMenu);
    });

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [restaurants]);

  // Load shopping cart from localStorage on init
  useEffect(() => {
    const savedCart = localStorage.getItem("daaneats_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart items:", e);
      }
    }
  }, []);

  // Sync cart to localStorage on change
  const saveCartToLocalStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("daaneats_cart", JSON.stringify(newCart));
  };

  // Role switching controller
  const handleChangeRole = (role: UserRole) => {
    const nextUser = PROFILE_CONFIGS[role];
    setCurrentUser(nextUser);
    
    // Set default navigation for the selected role
    if (role === "customer") {
      setCurrentNav("browse");
    } else if (role === "restaurant") {
      setCurrentNav("dashboard");
    } else if (role === "driver") {
      setCurrentNav("driver-jobs");
    } else {
      setCurrentNav("dashboard");
    }
  };

  // --- CART OPERATIONS ---
  const handleAddToCart = (item: MenuItem) => {
    const existing = cart.find((c) => c.menuItem.id === item.id);
    if (existing) {
      const updated = cart.map((c) =>
        c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
      );
      saveCartToLocalStorage(updated);
    } else {
      // Check if trying to add from a different restaurant - notify
      if (cart.length > 0 && cart[0].menuItem.restaurantId !== item.restaurantId) {
        if (!window.confirm("購物車內含有其他餐廳的美食。是否清空購物車，重新加入此款美食？")) {
          return;
        }
        saveCartToLocalStorage([{ menuItem: item, quantity: 1 }]);
        return;
      }
      saveCartToLocalStorage([...cart, { menuItem: item, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    const updated = cart.filter((c) => c.menuItem.id !== itemId);
    saveCartToLocalStorage(updated);
  };

  const handleUpdateCartQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }
    const updated = cart.map((c) =>
      c.menuItem.id === itemId ? { ...c, quantity: qty } : c
    );
    saveCartToLocalStorage(updated);
  };

  const handleClearCart = () => {
    saveCartToLocalStorage([]);
  };

  // --- FIREBASE ORDER OPERATIONS (顧客前台) ---
  const handleCreateOrder = async (address: string, notes: string) => {
    if (cart.length === 0) return;
    const orderId = "order_" + Math.random().toString(36).substring(2, 11).toUpperCase();
    const cartTotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

    const firstItem = cart[0].menuItem;
    // Find restaurant name
    const restaurantObj = restaurants.find((r) => r.id === firstItem.restaurantId);
    const restaurantName = restaurantObj ? restaurantObj.name : "大安美味廚房";

    const newOrder: Order = {
      id: orderId,
      customerId: currentUser.uid,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      restaurantId: firstItem.restaurantId,
      restaurantName,
      items: cart.map((c) => ({
        id: c.menuItem.id,
        name: c.menuItem.name,
        price: c.menuItem.price,
        quantity: c.quantity,
      })),
      totalAmount: cartTotal + 35, // Including 35 TWD service charge
      status: "pending",
      createdAt: new Date().toISOString(),
      deliveryAddress: address,
      notes,
    };

    // Save order strictly to Firestore
    await setDoc(doc(db, "orders", orderId), newOrder);
  };

  // --- FIREBASE ORDER STATUS OPERATIONS (商家/外送/管理) ---
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status });
  };

  const handleClaimOrder = async (orderId: string, driverId: string, driverName: string) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      driverId,
      driverName,
      driverPhone: "0988-777-666",
      status: "delivering"
    });
  };

  const handleCompleteDelivery = async (orderId: string) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: "completed" });
  };

  // --- ADMINISTRATIVE FUNCTIONS ---
  const handleToggleRestaurantActive = async (restaurantId: string, currentActive: boolean) => {
    const restRef = doc(db, "restaurants", restaurantId);
    await updateDoc(restRef, { isActive: !currentActive });
  };

  const handleCreateRestaurant = async (restData: Omit<Restaurant, "id" | "rating" | "ownerId">) => {
    const newId = "rest_" + Math.random().toString(36).substring(2, 9);
    const newRest: Restaurant = {
      ...restData,
      id: newId,
      rating: 4.8,
      ownerId: "owner_" + newId,
    };
    await setDoc(doc(db, "restaurants", newId), newRest);
  };

  const handleAddMenuItem = async (restaurantId: string, itemData: Omit<MenuItem, "id" | "restaurantId">) => {
    const newId = "menu_" + Math.random().toString(36).substring(2, 9);
    const newItem: MenuItem = {
      ...itemData,
      id: newId,
      restaurantId,
    };
    await setDoc(doc(db, "restaurants", restaurantId, "menuItems", newId), newItem);
  };

  const handleUpdateMenuItemAvailability = async (restaurantId: string, itemId: string, isAvailable: boolean) => {
    const menuRef = doc(db, "restaurants", restaurantId, "menuItems", itemId);
    await updateDoc(menuRef, { isAvailable });
  };

  const handleDeleteMenuItem = async (restaurantId: string, itemId: string) => {
    const menuRef = doc(db, "restaurants", restaurantId, "menuItems", itemId);
    await deleteDoc(menuRef);
  };

  const handleResetDatabaseState = async () => {
    // Purge current documents using direct write batches
    const restDocs = await getDocs(collection(db, "restaurants"));
    const orderDocs = await getDocs(collection(db, "orders"));

    const batch = writeBatch(db);

    restDocs.forEach((rDoc) => {
      batch.delete(rDoc.ref);
    });

    orderDocs.forEach((oDoc) => {
      batch.delete(oDoc.ref);
    });

    await batch.commit();

    // Re-seed original restaurants & subcollection menu items
    await seedDatabaseIfEmpty();
  };

  const handleForceUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await handleUpdateOrderStatus(orderId, status);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F7F4F3] flex flex-col font-sans antialiased text-[#2D2D2D]">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        onChangeRole={handleChangeRole}
        cartCount={cartCount}
        onNavigate={(view: any) => setCurrentNav(view)}
        currentNav={currentNav}
      />

      {/* Main Responsive Body Canvas */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {currentUser.role === "customer" && (
          <CustomerView
            restaurants={restaurants}
            menuItems={menuItems}
            orders={orders}
            currentUser={currentUser}
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateCartQuantity={handleUpdateCartQuantity}
            onClearCart={handleClearCart}
            onCreateOrder={handleCreateOrder}
            currentNav={currentNav as any}
            onNavigate={(nav: any) => setCurrentNav(nav)}
          />
        )}

        {currentUser.role === "restaurant" && (
          <RestaurantView
            restaurants={restaurants}
            menuItems={menuItems}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddMenuItem={handleAddMenuItem}
            onUpdateMenuItemAvailability={handleUpdateMenuItemAvailability}
            onDeleteMenuItem={handleDeleteMenuItem}
            currentNav={currentNav as any}
          />
        )}

        {currentUser.role === "driver" && (
          <DriverView
            orders={orders}
            currentUser={currentUser}
            onClaimOrder={handleClaimOrder}
            onCompleteDelivery={handleCompleteDelivery}
            currentNav={currentNav as any}
          />
        )}

        {currentUser.role === "admin" && (
          <AdminView
            restaurants={restaurants}
            orders={orders}
            onToggleRestaurantActive={handleToggleRestaurantActive}
            onCreateRestaurant={handleCreateRestaurant}
            onResetDatabaseState={handleResetDatabaseState}
            onForceUpdateOrderStatus={handleForceUpdateOrderStatus}
            currentNav={currentNav as any}
          />
        )}
      </main>

      {/* Humble Footer */}
      <footer className="bg-white border-t border-[#E5E5E5] py-8 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-bold">© 2026 DaanEats 大安美食外送速捷平台 | 服務範圍：國立臺北教育大學、台灣大學及其周邊精選</p>
          <p className="mt-1.5 opacity-75 font-mono text-[10px] tracking-wider uppercase">Powered by Google Cloud Run Container & Real-time Firestore Sync Engine</p>
        </div>
      </footer>
    </div>
  );
}
