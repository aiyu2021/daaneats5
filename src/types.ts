export type UserRole = "customer" | "restaurant" | "driver" | "admin";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  address: string;
  phone: string;
  imageUrl: string;
  rating: number;
  isActive: boolean;
  ownerId: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  restaurantId: string; // Keep relation clear
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export type OrderStatus = "pending" | "accepted" | "preparing" | "delivering" | "completed" | "cancelled";

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  restaurantId: string;
  restaurantName: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  deliveryAddress: string;
  notes?: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
}
