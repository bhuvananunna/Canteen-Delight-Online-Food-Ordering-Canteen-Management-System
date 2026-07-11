export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  walletBalance: number;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'mains' | 'snacks' | 'beverages' | 'desserts' | 'breakfast';
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
  prepTime: number; // in minutes
  rating: number;
  spiceLevels?: string[];
  addons?: { name: string; price: number }[];
}

export interface CartItem {
  id: string; // Unique id for cart entry (combines item id + selected options)
  menuItem: MenuItem;
  quantity: number;
  selectedSpice?: string;
  selectedAddons: { name: string; price: number }[];
  specialInstructions?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: {
    menuItem: {
      id: string;
      name: string;
      price: number;
      isVeg: boolean;
    };
    quantity: number;
    selectedSpice?: string;
    selectedAddons: { name: string; price: number }[];
    specialInstructions?: string;
  }[];
  total: number;
  status: OrderStatus;
  type: 'takeaway' | 'dinein';
  scheduledTime: string; // e.g. "Immediate" or a specific HH:MM time
  specialInstructions?: string;
  createdAt: string;
  orderNumber: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  createdAt: string;
}
