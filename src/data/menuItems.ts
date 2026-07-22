import { MenuItem } from '../types';
import idliSambarImg from '../assets/images/idli_sambar_plate_1784732300647.jpg';
import springRollsImg from '../assets/images/spring_rolls_plate_1784732319247.jpg';
import gulabJamunImg from '../assets/images/gulab_jamun_dessert_1784732333565.jpg';
import gobiManchurianImg from '../assets/images/gobi_manchurian_dish_1784732346620.jpg';
import cheesyGarlicBreadImg from '../assets/images/cheesy_garlic_bread_1784732358754.jpg';
import choleBhatureImg from '../assets/images/chole_bhature_platter_1784733117108.jpg';
import belgianWaffleImg from '../assets/images/belgian_chocolate_waffle_1784733133059.jpg';
import maharajaThaliImg from '../assets/images/maharaja_veg_thali_1784733147396.jpg';
import lemonHerbSalmonImg from '../assets/images/lemon_herb_salmon_1784733160330.jpg';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // BREAKFAST
  {
    id: 'b1',
    name: 'Masala Dosa',
    description: 'Crispy rice and lentil crepe stuffed with spiced potato mash, served with coconut chutney and piping hot sambar.',
    price: 3.99,
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    prepTime: 10,
    rating: 4.8,
    spiceLevels: ['Mild', 'Medium', 'Spicy'],
    addons: [
      { name: 'Extra Butter', price: 0.50 },
      { name: 'Cheese Slice', price: 0.75 }
    ]
  },
  {
    id: 'b2',
    name: 'Classic Fluffy Pancakes',
    description: 'Three tall fluffy buttermilk pancakes served with maple syrup, whipped cream, and fresh berries.',
    price: 4.49,
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    prepTime: 12,
    rating: 4.6,
    addons: [
      { name: 'Extra Maple Syrup', price: 0.40 },
      { name: 'Chocolate Chips', price: 0.60 }
    ]
  },
  {
    id: 'b3',
    name: 'Idli Sambar (3 Pcs)',
    description: 'Soft steamed rice cakes served with aromatic sambar and refreshing coconut and tomato chutneys.',
    price: 2.99,
    category: 'breakfast',
    image: idliSambarImg,
    isVeg: true,
    isAvailable: true,
    prepTime: 8,
    rating: 4.7
  },
  {
    id: 'b4',
    name: 'Avocado Toast with Poached Egg',
    description: 'Toasted artisanal sourdough bread topped with creamy crushed avocado, a perfectly poached egg, chili flakes, and microgreens.',
    price: 4.99,
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    prepTime: 10,
    rating: 4.7,
    addons: [
      { name: 'Extra Poached Egg', price: 0.80 },
      { name: 'Crumbled Feta Cheese', price: 0.60 }
    ]
  },
  {
    id: 'b5',
    name: 'Chole Bhature Platter',
    description: 'Fluffy, oversized fried leavened breads served with rich, spicy chickpea curry, pickled onions, green chilies, and tangy mint chutney.',
    price: 4.99,
    category: 'breakfast',
    image: choleBhatureImg,
    isVeg: true,
    isAvailable: true,
    prepTime: 12,
    rating: 4.9,
    spiceLevels: ['Medium', 'Spicy'],
    addons: [
      { name: 'Extra Bhatura', price: 1.00 }
    ]
  },
  {
    id: 'b6',
    name: 'Belgian Chocolate Waffle',
    description: 'Crispy, warm golden Belgian waffle smothered with premium dark and white chocolate sauces, topped with chocolate curls and sliced fresh strawberries.',
    price: 4.79,
    category: 'breakfast',
    image: belgianWaffleImg,
    isVeg: true,
    isAvailable: true,
    prepTime: 10,
    rating: 4.8,
    addons: [
      { name: 'Scoop Vanilla Ice Cream', price: 0.80 },
      { name: 'Extra Whipped Cream', price: 0.50 }
    ]
  },

  // STARTERS & SNACKS (Category: snacks)
  {
    id: 's1',
    name: 'Crispy Samosa (2 Pcs)',
    description: 'Flaky golden pastry cones filled with spiced potato and pea mash, served with tangy sweet tamarind and spicy mint chutneys.',
    price: 1.49,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    prepTime: 5,
    rating: 4.9,
    addons: [
      { name: 'Extra Chutney', price: 0.20 }
    ]
  },
  {
    id: 's2',
    name: 'Cheesy Veg Burger',
    description: 'Golden-fried crispy vegetable patty placed in toasted sesame buns with fresh lettuce, sliced tomatoes, onions, and melted cheese.',
    price: 3.49,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    prepTime: 10,
    rating: 4.4,
    addons: [
      { name: 'Extra Cheese Slice', price: 0.50 },
      { name: 'Double Patty', price: 1.20 }
    ]
  },
  {
    id: 's3',
    name: 'Piping Hot Loaded Fries',
    description: 'Crispy golden french fries loaded with melted cheddar cheese sauce, jalapeño rings, and fresh parsley sprinkles.',
    price: 2.99,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    prepTime: 7,
    rating: 4.7,
    addons: [
      { name: 'Extra Cheese Sauce', price: 0.60 }
    ]
  },
  {
    id: 's4',
    name: 'Crispy Gobi Manchurian',
    description: 'Crispy batter-fried cauliflower florets tossed in a sweet, savory, and tangy soy-garlic sauce with spring onions.',
    price: 4.99,
    category: 'snacks',
    image: gobiManchurianImg,
    isVeg: true,
    isAvailable: true,
    prepTime: 10,
    rating: 4.8,
    spiceLevels: ['Mild', 'Medium', 'Spicy']
  },
  {
    id: 's5',
    name: 'Tandoori Paneer Tikka',
    description: 'Soft chunks of cottage cheese marinated in spiced yogurt and grilled to smoky perfection in our clay oven with bell peppers.',
    price: 6.49,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    prepTime: 12,
    rating: 4.9,
    spiceLevels: ['Mild', 'Medium', 'Spicy']
  },
  {
    id: 's6',
    name: 'Golden Spring Rolls (4 Pcs)',
    description: 'Crispy paper-thin pastry rolls packed with stir-fried cabbage, carrots, and glass noodles. Served with sweet chili dipping sauce.',
    price: 3.99,
    category: 'snacks',
    image: springRollsImg,
    isVeg: true,
    isAvailable: true,
    prepTime: 8,
    rating: 4.6
  },
  {
    id: 's7',
    name: 'Cheesy Garlic Bread',
    description: 'Oven-baked crusty baguette slices loaded with dynamic garlic butter, melted premium mozzarella, and Italian herbs.',
    price: 4.29,
    category: 'snacks',
    image: cheesyGarlicBreadImg,
    isVeg: true,
    isAvailable: true,
    prepTime: 7,
    rating: 4.7,
    addons: [
      { name: 'Add Jalapeños', price: 0.40 },
      { name: 'Extra Mozzarella', price: 0.85 }
    ]
  },
  {
    id: 's8',
    name: 'Supreme Cheesy Loaded Nachos',
    description: 'Crispy corn tortilla chips piled high with creamy warm cheddar cheese sauce, black beans, tangy jalapeños, Pico de Gallo, fresh guacamole, and sour cream.',
    price: 4.49,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    prepTime: 8,
    rating: 4.7,
    addons: [
      { name: 'Add Extra Cheese Sauce', price: 0.60 },
      { name: 'Add Grilled Chicken Cubes', price: 1.50 }
    ]
  },

  // MAIN COURSE (Category: mains)
  {
    id: 'm1',
    name: 'Aromatic Chicken Biryani',
    description: 'Fragrant basmati rice layered with succulent chicken pieces, rich spices, saffron, and fresh mint. Served with cucumber raita.',
    price: 7.99,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600',
    isVeg: false,
    isAvailable: true,
    prepTime: 15,
    rating: 4.9,
    spiceLevels: ['Medium', 'Spicy', 'Extra Hot'],
    addons: [
      { name: 'Double Chicken', price: 2.00 },
      { name: 'Boiled Egg', price: 0.50 }
    ]
  },
  {
    id: 'm2',
    name: 'Creamy Paneer Butter Masala',
    description: 'Cottage cheese cubes simmered in a velvety, rich tomato-butter gravy with aromatic Indian herbs. Served with hot butter naan.',
    price: 6.99,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    prepTime: 14,
    rating: 4.8,
    spiceLevels: ['Mild', 'Medium', 'Spicy'],
    addons: [
      { name: 'Extra Paneer Chunks', price: 1.50 },
      { name: 'Extra Butter Naan', price: 1.00 }
    ]
  },
  {
    id: 'm3',
    name: 'Alfredo Pasta with Grilled Veggies',
    description: 'Penne pasta tossed in a creamy, rich Parmesan white sauce loaded with roasted bell peppers, zucchini, and baby corn.',
    price: 5.99,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    prepTime: 12,
    rating: 4.5,
    addons: [
      { name: 'Add Grilled Chicken', price: 1.50 },
      { name: 'Extra Cheese', price: 0.80 }
    ]
  },
  {
    id: 'm4',
    name: 'Butter Chicken with Butter Naan',
    description: 'Tender chicken pieces simmered in a smooth, butter-laced, lightly sweetened rich tomato sauce. Paired with freshly baked naan.',
    price: 8.49,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=600',
    isVeg: false,
    isAvailable: true,
    prepTime: 15,
    rating: 4.9,
    spiceLevels: ['Mild', 'Medium', 'Spicy'],
    addons: [
      { name: 'Double Chicken Portion', price: 2.50 },
      { name: 'Extra Butter Naan', price: 1.00 }
    ]
  },
  {
    id: 'm5',
    name: 'Slow-Cooked Dal Makhani with Rice',
    description: 'Classic rich black lentils slow-cooked overnight with spices, milk cream, and butter, served with fluffy basmati jeera rice.',
    price: 6.49,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    prepTime: 12,
    rating: 4.8
  },
  {
    id: 'm6',
    name: 'Wok-Tossed Veg Hakka Noodles',
    description: 'Long wheat noodles tossed on high flame in a wok with thin strips of crunchy carrots, cabbage, capsicum, and soy-based garlic seasoning.',
    price: 5.49,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    prepTime: 10,
    rating: 4.6,
    spiceLevels: ['Mild', 'Medium', 'Spicy']
  },
  {
    id: 'm7',
    name: 'Royal Maharaja Veg Thali',
    description: 'A complete campus feast featuring Paneer Butter Masala, slow-cooked Dal Makhani, mixed vegetable dry curry, aromatic Jeera rice, butter paratha, papad, salad, and a gulab jamun.',
    price: 8.99,
    category: 'mains',
    image: maharajaThaliImg,
    isVeg: true,
    isAvailable: true,
    prepTime: 18,
    rating: 4.9,
    spiceLevels: ['Medium', 'Spicy'],
    addons: [
      { name: 'Extra Butter Paratha', price: 1.00 },
      { name: 'Extra Sweet Jamun', price: 0.75 }
    ]
  },
  {
    id: 'm8',
    name: 'Grilled Lemon Herb Salmon',
    description: 'Perfectly pan-seared fresh salmon fillet glazed with lemon-herb butter. Served alongside charred asparagus, broccoli, and garlic-infused mashed potatoes.',
    price: 11.99,
    category: 'mains',
    image: lemonHerbSalmonImg,
    isVeg: false,
    isAvailable: true,
    prepTime: 15,
    rating: 4.9,
    addons: [
      { name: 'Extra Salmon Fillet', price: 4.50 },
      { name: 'Extra Garlic Butter Mash', price: 1.50 }
    ]
  },

  // DRINKS & BEVERAGES (Category: beverages)
  {
    id: 'v1',
    name: 'Mango Lassi Royale',
    description: 'Refreshing thick yogurt drink blended with sweet Alphonso mango pulp, flavored with green cardamom and saffron.',
    price: 1.99,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    prepTime: 4,
    rating: 4.9
  },
  {
    id: 'v2',
    name: 'Premium Cold Coffee',
    description: 'Creamy, rich blended iced coffee topped with a dark chocolate syrup drizzle and a scoop of vanilla ice cream.',
    price: 2.49,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    prepTime: 5,
    rating: 4.7,
    addons: [
      { name: 'Add Whipped Cream', price: 0.50 },
      { name: 'Extra Shot Espresso', price: 0.75 }
    ]
  },
  {
    id: 'v3',
    name: 'Cutting Masala Chai',
    description: 'Strong, rich tea leaves brewed with crushed fresh ginger, lemongrass, green cardamom, cloves, and milk.',
    price: 0.99,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    prepTime: 5,
    rating: 4.8
  },
  {
    id: 'v4',
    name: 'Zesty Fresh Lime Soda',
    description: 'Super refreshing freshly squeezed sweet and salty lime juice topped with sparkling soda and a pinch of black salt.',
    price: 1.49,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    prepTime: 3,
    rating: 4.6
  },
  {
    id: 'v5',
    name: 'Iced Peach & Mint Tea',
    description: 'Crisp brewed organic black tea blended with premium sweet peach nectar syrup and muddled garden-fresh mint leaves.',
    price: 1.99,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    prepTime: 4,
    rating: 4.7
  },
  {
    id: 'v6',
    name: 'Classic Hot Cappuccino',
    description: 'Rich freshly ground dark espresso shot combined with warm steamed milk, crowned with a thick layer of silky milk microfoam.',
    price: 2.29,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    prepTime: 5,
    rating: 4.6
  },

  // DESSERTS (Category: desserts)
  {
    id: 'd1',
    name: 'Molten Chocolate Lava Cake',
    description: 'Decadent chocolate cake with a rich liquid warm chocolate core, dusted with powdered sugar. Served warm.',
    price: 3.49,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    prepTime: 8,
    rating: 4.9,
    addons: [
      { name: 'Scoop Vanilla Ice Cream', price: 0.80 }
    ]
  },
  {
    id: 'd2',
    name: 'Fresh Fruit Parfait',
    description: 'Chilled greek yogurt layered with crunchy granola, mixed fresh berries, honey drizzle, and mint garnish.',
    price: 2.99,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    prepTime: 6,
    rating: 4.5
  },
  {
    id: 'd3',
    name: 'Gulab Jamun with Ice Cream',
    description: 'Two soft and sweet milk-solid spheres dipped in deep aromatic sugar syrup flavored with rosewater, paired with vanilla ice cream.',
    price: 3.29,
    category: 'desserts',
    image: gulabJamunImg,
    isVeg: true,
    isAvailable: true,
    prepTime: 5,
    rating: 4.8
  },
  {
    id: 'd4',
    name: 'New York Cheesecake',
    description: 'Rich, dense and incredibly creamy slice of classic baked cheesecake layered over a buttery graham cracker crumb crust.',
    price: 4.49,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    prepTime: 5,
    rating: 4.8
  },
  {
    id: 'd5',
    name: 'Sizzling Walnut Brownie',
    description: 'A decadent, warm eggless chocolate walnut brownie served on a piping hot sizzling cast-iron skillet, topped with a scoop of cold vanilla ice cream and an overflowing cascade of hot chocolate fudge.',
    price: 4.99,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isAvailable: true,
    prepTime: 8,
    rating: 4.9,
    addons: [
      { name: 'Extra Hot Chocolate Fudge', price: 0.50 },
      { name: 'Add Sliced Almonds', price: 0.40 }
    ]
  }
];

