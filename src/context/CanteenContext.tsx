import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, MenuItem, CartItem, Order, OrderStatus, Transaction } from '../types';
import { auth, db, useSimulatedDB, localDB } from '../lib/firebase';
import { INITIAL_MENU_ITEMS } from '../data/menuItems';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as fbSignOut,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  addDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';

interface CanteenContextType {
  currentUser: UserProfile | null;
  isLoading: boolean;
  menuItems: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  transactions: Transaction[];
  activeView: 'menu' | 'tracker' | 'wallet' | 'admin';
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  isFirebaseMode: boolean;
  
  // Auth actions
  loginWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  simulateLogin: (role: 'customer' | 'admin') => void;
  logout: () => Promise<void>;
  toggleUserRole: () => void;
  promoteToAdmin: () => Promise<boolean>;
  
  // Cart actions
  addToCart: (item: MenuItem, quantity: number, spice?: string, addons?: { name: string; price: number }[], notes?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  
  // Order actions
  placeOrder: (type: 'takeaway' | 'dinein', scheduledTime: string, notes?: string) => Promise<boolean>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  
  // Wallet actions
  addFunds: (amount: number) => Promise<void>;
  
  // Menu admin actions
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (item: MenuItem) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  
  // Notification helper
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  setActiveView: (view: 'menu' | 'tracker' | 'wallet' | 'admin') => void;
}

const removeUndefined = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => removeUndefined(v));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc: any, key) => {
      const value = obj[key];
      if (value !== undefined) {
        acc[key] = removeUndefined(value);
      }
      return acc;
    }, {});
  }
  return obj;
};

const CanteenContext = createContext<CanteenContextType | undefined>(undefined);

export const CanteenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeView, setActiveView] = useState<'menu' | 'tracker' | 'wallet' | 'admin'>('menu');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isFirebaseMode, setIsFirebaseMode] = useState(!useSimulatedDB && auth !== null);

  // Load custom toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev?.message === message ? null : prev);
    }, 4000);
  };

  const hideToast = () => setToast(null);

  // Initialize data (Dual-engine: Real Firebase or LocalStorage)
  useEffect(() => {
    let unsubscribeAuth: () => void = () => {};
    let unsubscribeMenu: () => void = () => {};
    let unsubscribeUserDoc: () => void = () => {};
    let unsubscribeTransactions: () => void = () => {};

    const initializeSimulatedMode = () => {
      setIsFirebaseMode(false);
      // Load mock items and sync default items cleanly without wiping user added dishes
      const localMenu: MenuItem[] = localDB.get('menu_items', INITIAL_MENU_ITEMS);
      const initialMap = new Map(INITIAL_MENU_ITEMS.map(i => [i.id, i]));
      
      const syncedMenu = localMenu.map(stored => {
        const initMatch = initialMap.get(stored.id) || INITIAL_MENU_ITEMS.find(i => i.name.toLowerCase() === stored.name.toLowerCase());
        if (initMatch) {
          return {
            ...stored,
            image: initMatch.image,
            name: initMatch.name,
            description: stored.description || initMatch.description,
          };
        }
        return stored;
      });

      // Ensure all INITIAL_MENU_ITEMS are present
      const existingIds = new Set(syncedMenu.map(i => i.id));
      for (const initItem of INITIAL_MENU_ITEMS) {
        if (!existingIds.has(initItem.id)) {
          syncedMenu.push(initItem);
        }
      }

      setMenuItems(syncedMenu);
      localDB.set('menu_items', syncedMenu);

      // Load active user
      const savedUser = localDB.get('user_profile', {
        uid: 'sim_customer_123',
        name: 'Alex CanteenLover',
        email: 'alex.student@university.edu',
        role: 'customer',
        walletBalance: 25.00,
        createdAt: new Date().toISOString()
      });
      setCurrentUser(savedUser);

      // Load cart
      const savedCart = localDB.get('cart', []);
      setCart(savedCart);

      // Load mock orders
      const savedOrders = localDB.get('orders', []);
      setOrders(savedOrders);

      // Load mock transactions
      const savedTransactions = localDB.get('transactions', [
        {
          id: 'tx_init',
          userId: 'sim_customer_123',
          amount: 25.00,
          type: 'credit',
          description: 'Welcome Bonus Credits',
          createdAt: new Date().toISOString()
        }
      ]);
      setTransactions(savedTransactions);
      setIsLoading(false);
    };

    if (isFirebaseMode && auth && db) {
      try {
        // Subscribe to auth state
        unsubscribeAuth = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
          setIsLoading(true);

          // Always clean up previous user doc & transactions listeners before creating new ones or signing out
          if (unsubscribeUserDoc) {
            try {
              unsubscribeUserDoc();
            } catch (e) {}
            unsubscribeUserDoc = () => {};
          }
          if (unsubscribeTransactions) {
            try {
              unsubscribeTransactions();
            } catch (e) {}
            unsubscribeTransactions = () => {};
          }

          if (fbUser) {
            try {
              // Check if user has profile in firestore
              const userRef = doc(db, 'users', fbUser.uid);
              let userSnap = await getDoc(userRef);
              
              let profileData: UserProfile;
              const pendingAdminUpgrade = localStorage.getItem("foodcanteen_pending_admin") === "true";
              const pendingName = localStorage.getItem("foodcanteen_pending_name");

              if (userSnap.exists()) {
                profileData = userSnap.data() as UserProfile;
                const isSpecialAdmin = fbUser.email === 'bhuvana.nunna0724@gmail.com' || fbUser.email?.includes('admin');
                if ((pendingAdminUpgrade || isSpecialAdmin) && profileData.role !== 'admin') {
                  profileData.role = 'admin';
                  await updateDoc(userRef, { role: 'admin' });
                }
              } else {
                // Create user profile
                profileData = {
                  uid: fbUser.uid,
                  name: pendingName || fbUser.displayName || 'Anonymous Canteen Guest',
                  email: fbUser.email || '',
                  role: fbUser.email?.includes('admin') || fbUser.email === 'bhuvana.nunna0724@gmail.com' || pendingAdminUpgrade ? 'admin' : 'customer',
                  walletBalance: 20.00, // starting gift balance
                  createdAt: new Date().toISOString()
                };
                await setDoc(userRef, profileData);
                showToast(`Welcome! Added $20.00 welcome gift to your digital canteen wallet!`, 'success');
                
                // Add a transaction log
                await addDoc(collection(db, 'transactions'), {
                  userId: fbUser.uid,
                  amount: 20.00,
                  type: 'credit',
                  description: 'Welcome Gift Balance',
                  createdAt: new Date().toISOString()
                });
              }

              if (pendingAdminUpgrade) {
                localStorage.removeItem("foodcanteen_pending_admin");
              }
              if (pendingName) {
                localStorage.removeItem("foodcanteen_pending_name");
              }

              setCurrentUser(profileData);

              // Subscribe to real-time changes on user's doc
              unsubscribeUserDoc = onSnapshot(userRef, (snap) => {
                if (snap.exists()) {
                  setCurrentUser(snap.data() as UserProfile);
                }
              }, (err) => {
                console.warn("User doc subscription warn (safe during sign-out transitions):", err);
              });

              // Subscribe to transaction logs
              const txQuery = query(
                collection(db, 'transactions'),
                where('userId', '==', fbUser.uid)
              );
              unsubscribeTransactions = onSnapshot(txQuery, (snap) => {
                const txs: Transaction[] = [];
                snap.forEach((doc) => {
                  txs.push({ id: doc.id, ...doc.data() } as Transaction);
                });
                // Sort client-side by createdAt desc to bypass missing index requirements
                txs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setTransactions(txs);
              }, (err) => {
                console.warn("Failed to subscribe transactions (safe during sign-out transitions):", err);
              });
            } catch (err) {
              console.error("Error loading user profile in auth callback:", err);
            }

          } else {
            setCurrentUser(null);
            setOrders([]);
            setTransactions([]);
          }
          setIsLoading(false);
        });

        // Subscribe to Menu
        const menuCollection = collection(db, 'menu');
        unsubscribeMenu = onSnapshot(menuCollection, (snap) => {
          if (snap.empty) {
            setMenuItems(INITIAL_MENU_ITEMS);
          } else {
            const items: MenuItem[] = [];
            snap.forEach((doc) => {
              items.push({ id: doc.id, ...doc.data() } as MenuItem);
            });
            const initialMap = new Map(INITIAL_MENU_ITEMS.map(i => [i.id, i]));
            const syncedItems = items.map(item => {
              const initMatch = initialMap.get(item.id) || INITIAL_MENU_ITEMS.find(i => i.name.toLowerCase() === item.name.toLowerCase());
              if (initMatch) {
                return {
                  ...item,
                  image: initMatch.image,
                  name: item.name || initMatch.name,
                  description: item.description || initMatch.description,
                };
              }
              return item;
            });

            // Ensure missing default items are present
            const existingIds = new Set(syncedItems.map(i => i.id));
            for (const initItem of INITIAL_MENU_ITEMS) {
              if (!existingIds.has(initItem.id)) {
                syncedItems.push(initItem);
              }
            }

            setMenuItems(syncedItems);
          }
        }, (err) => {
          console.error("Menu subscription error:", err);
          // Fallback to local default items if subscription fails
          setMenuItems(INITIAL_MENU_ITEMS);
        });

      } catch (err) {
        console.error("Firebase subscription initialization failed. Switching to Local Sim.", err);
        initializeSimulatedMode();
      }
    } else {
      initializeSimulatedMode();
    }

    return () => {
      unsubscribeAuth();
      unsubscribeMenu();
      unsubscribeUserDoc();
      unsubscribeTransactions();
    };
  }, [isFirebaseMode]);

  // Reactive Orders Subscription for Firebase Mode
  useEffect(() => {
    if (!isFirebaseMode || !auth || !db || !currentUser) {
      return;
    }

    let ordersQuery;
    if (currentUser.role === 'admin') {
      // Admin gets all orders - single-field order does not require composite index
      ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    } else {
      // Customer gets only their orders
      ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', currentUser.uid)
      );
    }

    const unsubscribe = onSnapshot(ordersQuery, (snap) => {
      const ords: Order[] = [];
      snap.forEach((doc) => {
        ords.push({ id: doc.id, ...doc.data() } as Order);
      });
      // Sort client-side by createdAt desc to bypass missing index requirements
      ords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(ords);
    }, (err) => {
      console.warn("Order subscription warn (safe during sign-out transitions):", err);
    });

    return () => {
      unsubscribe();
    };
  }, [isFirebaseMode, currentUser?.uid, currentUser?.role, db]);

  // Automatic Order Status Progression (Every 5 minutes)
  useEffect(() => {
    const checkInterval = setInterval(async () => {
      const now = new Date().getTime();
      let hasUpdates = false;

      const updatedOrders = await Promise.all(
        orders.map(async (order) => {
          if (order.status === 'completed' || order.status === 'cancelled') {
            return order;
          }

          const createdAtTime = new Date(order.createdAt).getTime();
          const elapsedMinutes = (now - createdAtTime) / (60 * 1000);

          let targetStatus: OrderStatus = order.status;
          if (elapsedMinutes >= 15) {
            targetStatus = 'completed';
          } else if (elapsedMinutes >= 10) {
            targetStatus = 'ready';
          } else if (elapsedMinutes >= 5) {
            targetStatus = 'preparing';
          }

          if (targetStatus !== order.status) {
            hasUpdates = true;
            if (isFirebaseMode && db) {
              try {
                const orderRef = doc(db, 'orders', order.id);
                await updateDoc(orderRef, { status: targetStatus });
              } catch (e) {
                console.error("Failed to auto-progress order in Firebase:", e);
              }
            }
            return { ...order, status: targetStatus };
          }

          return order;
        })
      );

      if (hasUpdates && !isFirebaseMode) {
        setOrders(updatedOrders);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkInterval);
  }, [orders, isFirebaseMode, db]);

  // Reactive Menu Seeding for Firebase (Only seed when empty)
  useEffect(() => {
    if (isFirebaseMode && db) {
      const checkAndSeedMenu = async () => {
        try {
          const menuCollection = collection(db, 'menu');
          const snap = await getDocs(menuCollection);
          if (snap.empty) {
            console.log("Seeding Firestore menu...");
            for (const item of INITIAL_MENU_ITEMS) {
              const itemRef = doc(db, 'menu', item.id);
              await setDoc(itemRef, removeUndefined(item));
            }
          }
        } catch (err) {
          console.warn("Seeding menu failed on trigger:", err);
        }
      };
      checkAndSeedMenu();
    }
  }, [isFirebaseMode, db]);

  // Keep simulated states updated in local storage when they change
  useEffect(() => {
    if (!isFirebaseMode && currentUser) {
      localDB.set('user_profile', currentUser);
    }
  }, [currentUser, isFirebaseMode]);

  useEffect(() => {
    if (!isFirebaseMode) {
      localDB.set('menu_items', menuItems);
    }
  }, [menuItems, isFirebaseMode]);

  useEffect(() => {
    if (!isFirebaseMode) {
      localDB.set('orders', orders);
    }
  }, [orders, isFirebaseMode]);

  useEffect(() => {
    if (!isFirebaseMode) {
      localDB.set('transactions', transactions);
    }
  }, [transactions, isFirebaseMode]);

  // --- ACTIONS ---

  // Auth: Real Google Login
  const loginWithGoogle = async () => {
    if (!auth) {
      showToast("Firebase Auth not initialized.", "error");
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setIsFirebaseMode(true);
      showToast("Signed in successfully with Google!", "success");
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user') {
        console.warn("Firebase auth warning (popup closed by user):", error);
        showToast("Sign-in window closed before finishing. Please try again!", "info");
      } else {
        console.error("Firebase auth error:", error);
        if (error?.code === 'auth/unauthorized-domain') {
          showToast(
            "Domain Unauthorized: Please add this preview URL to your 'Authorized Domains' list in the Firebase Console (Auth > Settings).",
            "error"
          );
        } else if (error?.code === 'auth/popup-blocked') {
          showToast("Popup blocked by browser. Please allow popups for this site and retry!", "error");
        } else {
          showToast(`Auth failed: ${error?.message || 'Check Firebase setup or use Simulated Mode!'}`, "error");
        }
      }
    }
  };

  // Auth: Email/Password login
  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) {
      showToast("Firebase Auth not initialized.", "error");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsFirebaseMode(true);
      showToast("Signed in successfully with Email!", "success");
    } catch (error: any) {
      console.warn("Email sign in warning:", error);
      let errMsg = error?.message || "Please check your credentials.";
      if (error?.code === 'auth/wrong-password' || error?.code === 'auth/user-not-found' || error?.code === 'auth/invalid-credential') {
        errMsg = "Invalid email or password. Please try again.";
      } else if (error?.code === 'auth/invalid-email') {
        errMsg = "Invalid email address format.";
      }
      showToast(errMsg, "error");
      throw new Error(errMsg);
    }
  };

  // Auth: Email/Password registration
  const signUpWithEmail = async (email: string, password: string, name: string) => {
    if (!auth) {
      showToast("Firebase Auth not initialized.", "error");
      return;
    }
    try {
      // Store the pending name in localStorage so the auth state observer uses it
      localStorage.setItem("foodcanteen_pending_name", name);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user profile with the display name as well
      await updateProfile(userCredential.user, { displayName: name });
      
      setIsFirebaseMode(true);
      showToast("Account created successfully with Email!", "success");
    } catch (error: any) {
      console.warn("Email sign up warning:", error);
      let errMsg = error?.message || "Could not create account.";
      if (error?.code === 'auth/email-already-in-use') {
        errMsg = "This email is already registered. Please sign in instead.";
      } else if (error?.code === 'auth/weak-password') {
        errMsg = "Password is too weak. Must be at least 6 characters.";
      } else if (error?.code === 'auth/invalid-email') {
        errMsg = "Invalid email address format.";
      }
      showToast(errMsg, "error");
      throw new Error(errMsg);
    }
  };

  // Auth: Simulated account login
  const simulateLogin = (role: 'customer' | 'admin') => {
    setIsFirebaseMode(false);
    const mockUser: UserProfile = {
      uid: role === 'admin' ? 'sim_admin_999' : 'sim_customer_123',
      name: role === 'admin' ? 'Chef Margaret (Manager)' : 'Alex CanteenLover',
      email: role === 'admin' ? 'admin.margaret@canteen.com' : 'alex.student@university.edu',
      role: role,
      walletBalance: role === 'admin' ? 0.00 : (currentUser?.walletBalance || 25.00),
      createdAt: new Date().toISOString()
    };
    setCurrentUser(mockUser);
    
    // Change view appropriately
    setActiveView(role === 'admin' ? 'admin' : 'menu');
    showToast(`Logged into simulated ${role.toUpperCase()} account!`, 'success');
  };

  const logout = async () => {
    if (isFirebaseMode && auth) {
      await fbSignOut(auth);
    }
    setCurrentUser(null);
    setCart([]);
    setActiveView('menu');
    showToast("Signed out successfully.", "info");
  };

  const toggleUserRole = () => {
    if (!currentUser) return;
    const newRole = currentUser.role === 'admin' ? 'customer' : 'admin';
    
    if (isFirebaseMode && db) {
      // Update real Firebase profile
      const userRef = doc(db, 'users', currentUser.uid);
      updateDoc(userRef, { role: newRole })
        .then(() => {
          showToast(`Switched role to ${newRole}!`, 'success');
          setActiveView(newRole === 'admin' ? 'admin' : 'menu');
        })
        .catch(err => {
          showToast("Failed to switch database role.", "error");
        });
    } else {
      // Update local profile
      setCurrentUser(prev => prev ? { ...prev, role: newRole } : null);
      setActiveView(newRole === 'admin' ? 'admin' : 'menu');
      showToast(`Switched role to ${newRole}!`, 'success');
    }
  };

  const promoteToAdmin = async (): Promise<boolean> => {
    if (isFirebaseMode && auth?.currentUser && db) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      try {
        await updateDoc(userRef, { role: 'admin' });
        setCurrentUser(prev => prev ? { ...prev, role: 'admin' } : null);
        setActiveView('admin');
        showToast("Manager role unlocked successfully via Google Account!", "success");
        return true;
      } catch (err) {
        console.error("Failed to promote user to admin in Firestore:", err);
        showToast("Error updating database. Please try again.", "error");
        return false;
      }
    } else {
      simulateLogin('admin');
      return true;
    }
  };

  // Cart actions
  const addToCart = (
    item: MenuItem, 
    quantity: number, 
    spice?: string, 
    addons?: { name: string; price: number }[],
    notes?: string
  ) => {
    const selectedAddons = addons || [];
    // Generate unique ID for this specific customization combo
    const optionString = `${spice || ''}-${selectedAddons.map(a => a.name).join(',')}`;
    const cartItemId = `${item.id}-${optionString}`;

    setCart(prev => {
      const existingIdx = prev.findIndex(ci => ci.id === cartItemId);
      let updatedCart;
      
      if (existingIdx > -1) {
        updatedCart = [...prev];
        updatedCart[existingIdx].quantity += quantity;
      } else {
        updatedCart = [...prev, {
          id: cartItemId,
          menuItem: item,
          quantity,
          selectedSpice: spice,
          selectedAddons,
          specialInstructions: notes
        }];
      }
      
      if (!isFirebaseMode) {
        localDB.set('cart', updatedCart);
      }
      return updatedCart;
    });

    showToast(`Added ${quantity}x ${item.name} to cart!`, 'success');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => {
      const updated = prev.filter(ci => ci.id !== cartItemId);
      if (!isFirebaseMode) {
        localDB.set('cart', updated);
      }
      return updated;
    });
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => {
      const updated = prev.map(ci => ci.id === cartItemId ? { ...ci, quantity: newQty } : ci);
      if (!isFirebaseMode) {
        localDB.set('cart', updated);
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    if (!isFirebaseMode) {
      localDB.set('cart', []);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, ci) => {
      const basePrice = ci.menuItem.price;
      const addonsPrice = ci.selectedAddons.reduce((sum, add) => sum + add.price, 0);
      return total + ((basePrice + addonsPrice) * ci.quantity);
    }, 0);
  };

  // Place Order
  const placeOrder = async (type: 'takeaway' | 'dinein', scheduledTime: string, notes?: string): Promise<boolean> => {
    if (!currentUser) {
      showToast("You must sign in to place an order.", "error");
      return false;
    }

    const orderTotal = getCartTotal();
    if (currentUser.walletBalance < orderTotal) {
      showToast(`Insufficient balance! Your total is $${orderTotal.toFixed(2)}, but you only have $${currentUser.walletBalance.toFixed(2)}.`, "error");
      return false;
    }

    const orderNumber = `C-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: Omit<Order, 'id'> = {
      userId: currentUser.uid,
      userName: currentUser.name,
      userEmail: currentUser.email,
      items: cart.map(ci => ({
        menuItem: {
          id: ci.menuItem.id,
          name: ci.menuItem.name,
          price: ci.menuItem.price,
          isVeg: ci.menuItem.isVeg
        },
        quantity: ci.quantity,
        selectedSpice: ci.selectedSpice,
        selectedAddons: ci.selectedAddons,
        specialInstructions: ci.specialInstructions
      })),
      total: orderTotal,
      status: 'pending',
      type,
      scheduledTime,
      specialInstructions: notes,
      createdAt: new Date().toISOString(),
      orderNumber
    };

    const newBalance = Number((currentUser.walletBalance - orderTotal).toFixed(2));

    try {
      if (isFirebaseMode && db) {
        // Create order doc
        const orderRef = await addDoc(collection(db, 'orders'), removeUndefined(newOrder));
        
        // Update user balance
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, { walletBalance: newBalance });

        // Add a transaction log
        await addDoc(collection(db, 'transactions'), {
          userId: currentUser.uid,
          amount: orderTotal,
          type: 'debit',
          description: `Ordered Lunch (Ref: ${orderNumber})`,
          createdAt: new Date().toISOString()
        });
      } else {
        // Simulated local execution
        const orderId = `ord_${Date.now()}`;
        const placedOrder: Order = { id: orderId, ...newOrder };
        
        // Update local orders list
        setOrders(prev => [placedOrder, ...prev]);
        
        // Update local balance
        setCurrentUser(prev => prev ? { ...prev, walletBalance: newBalance } : null);

        // Update transaction list
        const newTx: Transaction = {
          id: `tx_${Date.now()}`,
          userId: currentUser.uid,
          amount: orderTotal,
          type: 'debit',
          description: `Ordered Lunch (Ref: ${orderNumber})`,
          createdAt: new Date().toISOString()
        };
        setTransactions(prev => [newTx, ...prev]);
      }

      setCart([]);
      if (!isFirebaseMode) {
        localDB.set('cart', []);
      }

      showToast(`Order ${orderNumber} placed successfully! Check active orders tab.`, "success");
      setActiveView('tracker');
      return true;
    } catch (err) {
      console.error("Failed to place order:", err);
      showToast("Something went wrong while placing your order. Please try again.", "error");
      return false;
    }
  };

  // Update Order Status (Admin action)
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    // Optimistically update React state immediately
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    try {
      if (isFirebaseMode && db) {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { status: newStatus });
      }
      showToast(`Order status updated to: ${newStatus.toUpperCase()}`, "success");
    } catch (err) {
      console.warn("Order status sync warning (local state preserved):", err);
      showToast(`Order status updated to: ${newStatus.toUpperCase()}`, "success");
    }
  };

  // Add Wallet Funds
  const addFunds = async (amount: number) => {
    if (!currentUser) return;
    const newBalance = Number((currentUser.walletBalance + amount).toFixed(2));

    try {
      if (isFirebaseMode && db) {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, { walletBalance: newBalance });

        await addDoc(collection(db, 'transactions'), {
          userId: currentUser.uid,
          amount: amount,
          type: 'credit',
          description: `Topped Up Digital Wallet`,
          createdAt: new Date().toISOString()
        });
      } else {
        // Simulated
        setCurrentUser(prev => prev ? { ...prev, walletBalance: newBalance } : null);
        
        const newTx: Transaction = {
          id: `tx_${Date.now()}`,
          userId: currentUser.uid,
          amount,
          type: 'credit',
          description: `Topped Up Digital Wallet`,
          createdAt: new Date().toISOString()
        };
        setTransactions(prev => [newTx, ...prev]);
      }
      showToast(`Successfully added $${amount.toFixed(2)} to your canteen wallet!`, "success");
    } catch (err) {
      console.error("Wallet update failed:", err);
      showToast("Failed to add funds. Try again.", "error");
    }
  };

  // Menu Admin CRUD: Add
  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    const newId = `item_${Date.now()}`;
    const fullItem: MenuItem = { id: newId, ...item };

    try {
      if (isFirebaseMode && db) {
        await setDoc(doc(db, 'menu', newId), removeUndefined(fullItem));
      } else {
        setMenuItems(prev => [...prev, fullItem]);
      }
      showToast(`Successfully added new dish: ${item.name}`, "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to add new item.", "error");
    }
  };

  // Menu Admin CRUD: Update
  const updateMenuItem = async (item: MenuItem) => {
    try {
      if (isFirebaseMode && db) {
        await setDoc(doc(db, 'menu', item.id), removeUndefined(item));
      } else {
        setMenuItems(prev => prev.map(i => i.id === item.id ? item : i));
      }
      showToast(`Successfully updated ${item.name}`, "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update item.", "error");
    }
  };

  // Menu Admin CRUD: Delete
  const deleteMenuItem = async (id: string) => {
    try {
      const itemToDelete = menuItems.find(i => i.id === id);
      if (isFirebaseMode && db) {
        await deleteDoc(doc(db, 'menu', id));
      } else {
        setMenuItems(prev => prev.filter(i => i.id !== id));
      }
      showToast(`Successfully removed dish: ${itemToDelete?.name || id}`, "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete item.", "error");
    }
  };

  return (
    <CanteenContext.Provider value={{
      currentUser,
      isLoading,
      menuItems,
      cart,
      orders,
      transactions,
      activeView,
      toast,
      isFirebaseMode,
      
      loginWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      simulateLogin,
      logout,
      toggleUserRole,
      promoteToAdmin,
      
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      getCartTotal,
      
      placeOrder,
      updateOrderStatus,
      
      addFunds,
      
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      
      showToast,
      hideToast,
      setActiveView
    }}>
      {children}
    </CanteenContext.Provider>
  );
};

export const useCanteen = () => {
  const context = useContext(CanteenContext);
  if (context === undefined) {
    throw new Error('useCanteen must be used within a CanteenProvider');
  }
  return context;
};
