import React, { useMemo, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import cafeLogo from './assets/cafe_logo.png';

const initialMenuItems = [
  // --- VEG ITEMS (24) ---
  {
    id: 2,
    name: 'Cloud Cappuccino',
    category: 'Coffee',
    price: 145,
    rating: 4.9,
    time: '5 min',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80',
    description: 'Double shot espresso with velvety milk and cocoa dust.',
    type: 'veg'
  },
  {
    id: 3,
    name: 'Garden Pesto Pasta',
    category: 'Lunch',
    price: 295,
    rating: 4.7,
    time: '16 min',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80',
    description: 'Basil pesto, cherry tomatoes, parmesan, toasted seeds, and greens.',
    type: 'veg'
  },
  {
    id: 4,
    name: 'Belgian Cocoa Waffle',
    category: 'Dessert',
    price: 235,
    rating: 4.8,
    time: '12 min',
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=900&q=80',
    description: 'Warm waffle, dark chocolate, berries, and vanilla cream.',
    type: 'veg'
  },
  {
    id: 5,
    name: 'Iced Saffron Latte',
    category: 'Coffee',
    price: 165,
    rating: 4.7,
    time: '6 min',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80',
    description: 'Cold espresso, saffron milk, cardamom foam, and ice.',
    type: 'veg'
  },
  {
    id: 6,
    name: 'Avocado Smash Toast',
    category: 'Breakfast',
    price: 245,
    rating: 4.8,
    time: '8 min',
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=900&q=80',
    description: 'Crushed avocado, cherry tomatoes, feta, and pumpkin seeds on sourdough.',
    type: 'veg'
  },
  {
    id: 7,
    name: 'Spinach Corn Quesadilla',
    category: 'Lunch',
    price: 210,
    rating: 4.6,
    time: '12 min',
    image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=900&q=80',
    description: 'Tortilla stuffed with creamy spinach, sweet corn, and melted mozzarella.',
    type: 'veg'
  },
  {
    id: 8,
    name: 'Cinnamon Swirl Roll',
    category: 'Dessert',
    price: 165,
    rating: 4.9,
    time: '4 min',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
    description: 'Freshly baked cinnamon roll topped with cream cheese frosting.',
    type: 'veg'
  },
  {
    id: 9,
    name: 'Classic Macchiato',
    category: 'Coffee',
    price: 125,
    rating: 4.5,
    time: '3 min',
    image: 'https://images.unsplash.com/photo-1485808191679-5f63bbd02105?auto=format&fit=crop&w=900&q=80',
    description: 'Espresso marked with a small dollop of foamed milk.',
    type: 'veg'
  },
  {
    id: 10,
    name: 'Paneer Tikka Wrap',
    category: 'Lunch',
    price: 225,
    rating: 4.8,
    time: '11 min',
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=900&q=80',
    description: 'Spiced paneer cubes, mint chutney, bell peppers, and onions in a flatbread.',
    type: 'veg'
  },
  {
    id: 11,
    name: 'Truffle Parmesan Fries',
    category: 'Lunch',
    price: 195,
    rating: 4.7,
    time: '7 min',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80',
    description: 'Crispy golden fries tossed in white truffle oil and grated parmesan.',
    type: 'veg'
  },
  {
    id: 12,
    name: 'Loaded Nacho Platter',
    category: 'Lunch',
    price: 240,
    rating: 4.6,
    time: '9 min',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=900&q=80',
    description: 'Corn tortilla chips, warm cheese sauce, black beans, jalapenos, and salsa.',
    type: 'veg'
  },
  {
    id: 13,
    name: 'Mediterranean Hummus Bowl',
    category: 'Lunch',
    price: 280,
    rating: 4.7,
    time: '10 min',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80',
    description: 'Creamy hummus, falafel, cucumber tomato salad, olives, and pita bread.',
    type: 'veg'
  },
  {
    id: 14,
    name: 'Blueberry Cheese Danish',
    category: 'Dessert',
    price: 185,
    rating: 4.8,
    time: '5 min',
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=900&q=80',
    description: 'Flaky puff pastry filled with sweet cream cheese and wild blueberry compote.',
    type: 'veg'
  },
  {
    id: 15,
    name: 'Matcha Latte',
    category: 'Coffee',
    price: 175,
    rating: 4.6,
    time: '5 min',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=900&q=80',
    description: 'Ceremonial grade matcha green tea whisked with creamy steamed milk.',
    type: 'veg'
  },
  {
    id: 16,
    name: 'Classic Margherita Pizza',
    category: 'Lunch',
    price: 340,
    rating: 4.9,
    time: '15 min',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80',
    description: 'San Marzano tomato sauce, fresh mozzarella, sweet basil, and olive oil.',
    type: 'veg'
  },
  {
    id: 17,
    name: 'Honey Lemon Iced Tea',
    category: 'Coffee',
    price: 120,
    rating: 4.4,
    time: '4 min',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=900&q=80',
    description: 'Chilled black tea infused with raw honey and fresh lemon juice.',
    type: 'veg'
  },
  {
    id: 18,
    name: 'Strawberry Banana Smoothie',
    category: 'Coffee',
    price: 165,
    rating: 4.6,
    time: '6 min',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=900&q=80',
    description: 'Creamy blend of fresh strawberries, ripe bananas, greek yogurt, and honey.',
    type: 'veg'
  },
  {
    id: 19,
    name: 'Grilled Cheese Sandwich',
    category: 'Breakfast',
    price: 160,
    rating: 4.7,
    time: '8 min',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80',
    description: 'Golden, buttery toasted sourdough with melted cheddar and mozzarella.',
    type: 'veg'
  },
  {
    id: 20,
    name: 'Mango Chia Pudding',
    category: 'Breakfast',
    price: 190,
    rating: 4.7,
    time: '5 min',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80',
    description: 'Chia seeds soaked in coconut milk, layered with fresh mango puree.',
    type: 'veg'
  },
  {
    id: 21,
    name: 'Red Velvet Pastry',
    category: 'Dessert',
    price: 195,
    rating: 4.8,
    time: '3 min',
    image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=900&q=80',
    description: 'Moist red velvet sponge layers with smooth vanilla cream cheese frosting.',
    type: 'veg'
  },
  {
    id: 22,
    name: 'Hot Butter Croissant',
    category: 'Breakfast',
    price: 130,
    rating: 4.9,
    time: '4 min',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80',
    description: 'Flaky, buttery laminated French pastry served warm.',
    type: 'veg'
  },
  {
    id: 23,
    name: 'Rose & Cardamom Bun',
    category: 'Dessert',
    price: 150,
    rating: 4.8,
    time: '5 min',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80',
    description: 'Swedish-style cardamom bun infused with organic rose water glaze.',
    type: 'veg'
  },
  {
    id: 24,
    name: 'Mushroom Stroganoff',
    category: 'Lunch',
    price: 310,
    rating: 4.6,
    time: '14 min',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
    description: 'Sauteed mushrooms in a rich sour cream sauce, served over buttered rice.',
    type: 'veg'
  },
  {
    id: 25,
    name: 'Rose Lemonade',
    category: 'Coffee',
    price: 140,
    rating: 4.5,
    time: '4 min',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80',
    description: 'Chilled sparkling lemonade infused with delicate rose petal extract.',
    type: 'veg'
  },
  {
    id: 51,
    name: 'Irish Cream Cold Brew',
    category: 'Coffee',
    price: 175,
    rating: 4.8,
    time: '4 min',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80',
    description: 'Cold brew coffee topped with sweet Irish cream cold foam.',
    type: 'veg'
  },
  {
    id: 52,
    name: 'Caramel Macchiato',
    category: 'Coffee',
    price: 155,
    rating: 4.7,
    time: '5 min',
    image: 'https://images.unsplash.com/photo-1485808191679-5f63bbd02105?auto=format&fit=crop&w=900&q=80',
    description: 'Freshly steamed milk with vanilla-flavored syrup, marked with espresso and caramel drizzle.',
    type: 'veg'
  },
  {
    id: 53,
    name: 'Masala Chai',
    category: 'Tea',
    price: 95,
    rating: 4.9,
    time: '6 min',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80',
    description: 'Brewed black tea with a mixture of aromatic Indian spices and milk.',
    type: 'veg'
  },
  {
    id: 54,
    name: 'Matcha Green Tea Latte',
    category: 'Tea',
    price: 185,
    rating: 4.6,
    time: '5 min',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=900&q=80',
    description: 'Pure Japanese matcha whisked with hot milk and organic honey.',
    type: 'veg'
  },
  {
    id: 55,
    name: 'Darjeeling Earl Grey',
    category: 'Tea',
    price: 125,
    rating: 4.5,
    time: '4 min',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=900&q=80',
    description: 'Fine Darjeeling black tea scented with oil of bergamot orange.',
    type: 'veg'
  },
  {
    id: 56,
    name: 'Mango Lassi',
    category: 'Drinks',
    price: 120,
    rating: 4.9,
    time: '4 min',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=900&q=80',
    description: 'Traditional sweet yogurt drink blended with fresh Alphonso mango pulp.',
    type: 'veg'
  },
  {
    id: 57,
    name: 'Fresh Mint Mojito',
    category: 'Drinks',
    price: 135,
    rating: 4.7,
    time: '5 min',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80',
    description: 'Refreshing mocktail with muddled fresh mint leaves, lime juice, and soda.',
    type: 'veg'
  },
  {
    id: 58,
    name: 'Rose Thandai',
    category: 'Drinks',
    price: 150,
    rating: 4.8,
    time: '6 min',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80',
    description: 'Traditional chilled milk drink with almonds, fennel seeds, rose petals, and saffron.',
    type: 'veg'
  },
  {
    id: 59,
    name: 'Paneer Butter Masala Naan',
    category: 'Indian',
    price: 260,
    rating: 4.9,
    time: '15 min',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80',
    description: 'Cubes of fresh paneer in a rich tomato-butter gravy, served with hot garlic butter naan.',
    type: 'veg'
  },
  {
    id: 60,
    name: 'Samosa Chaat',
    category: 'Indian',
    price: 145,
    rating: 4.8,
    time: '10 min',
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=900&q=80',
    description: 'Crispy samosas crushed and topped with warm chickpea curry, sweetened yogurt, chutneys, and sev.',
    type: 'veg'
  },
  {
    id: 61,
    name: 'Amritsari Paneer Kulcha',
    category: 'Indian',
    price: 195,
    rating: 4.8,
    time: '12 min',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
    description: 'Crispy, clay-oven baked bread stuffed with spiced paneer, served with chole and white butter.',
    type: 'veg'
  },

  // --- NON-VEG ITEMS (25) ---
  {
    id: 26,
    name: 'Chicken Tikka Panini',
    category: 'Lunch',
    price: 265,
    rating: 4.8,
    time: '12 min',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80',
    description: 'Spiced chicken tikka, smoked gouda, mint mayo, and red onion on sourdough.',
    type: 'non-veg'
  },
  {
    id: 27,
    name: 'Smoked Salmon Bagel',
    category: 'Breakfast',
    price: 345,
    rating: 4.9,
    time: '8 min',
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=900&q=80',
    description: 'Toasted bagel with smoked salmon, cream cheese, capers, dill, and red onion.',
    type: 'non-veg'
  },
  {
    id: 28,
    name: 'Classic Benedict Eggs',
    category: 'Breakfast',
    price: 240,
    rating: 4.7,
    time: '10 min',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80',
    description: 'Poached eggs, smoked ham, and velvety hollandaise sauce on English muffins.',
    type: 'non-veg'
  },
  {
    id: 29,
    name: 'Spicy Chicken Ramen',
    category: 'Lunch',
    price: 325,
    rating: 4.8,
    time: '15 min',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80',
    description: 'Ramen noodles, spicy chicken broth, grilled chicken breast, soft boiled egg, and scallions.',
    type: 'non-veg'
  },
  {
    id: 30,
    name: 'Crispy Chicken Tenders',
    category: 'Lunch',
    price: 220,
    rating: 4.6,
    time: '9 min',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=80',
    description: 'Golden fried panko-crusted chicken strips served with honey mustard.',
    type: 'non-veg'
  },
  {
    id: 31,
    name: 'Bacon & Cheddar Omelette',
    category: 'Breakfast',
    price: 210,
    rating: 4.7,
    time: '7 min',
    image: 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&w=900&q=80',
    description: 'Three-egg fluffy omelette stuffed with crispy bacon bits and sharp cheddar.',
    type: 'non-veg'
  },
  {
    id: 32,
    name: 'BBQ Pulled Chicken Burger',
    category: 'Lunch',
    price: 340,
    rating: 4.8,
    time: '13 min',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
    description: 'Slow-cooked hickory pulled chicken, cream coleslaw, and pickle slices in brioche.',
    type: 'non-veg'
  },
  {
    id: 33,
    name: 'Butter Chicken Croissant',
    category: 'Breakfast',
    price: 195,
    rating: 4.9,
    time: '6 min',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80',
    description: 'Flaky warm croissant stuffed with creamy butter chicken gravy and shredded chicken.',
    type: 'non-veg'
  },
  {
    id: 34,
    name: 'Prawn Tempura Basket',
    category: 'Lunch',
    price: 310,
    rating: 4.7,
    time: '10 min',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80',
    description: 'Crispy batter-fried Japanese prawns served with light tempura dipping sauce.',
    type: 'non-veg'
  },
  {
    id: 35,
    name: 'Turkey Club Sandwich',
    category: 'Lunch',
    price: 275,
    rating: 4.7,
    time: '10 min',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80',
    description: 'Triple-decker bread, smoked turkey, crispy bacon, lettuce, tomatoes, and mayo.',
    type: 'non-veg'
  },
  {
    id: 36,
    name: 'Lemon Garlic Shrimp Pasta',
    category: 'Lunch',
    price: 380,
    rating: 4.8,
    time: '14 min',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80',
    description: 'Spaghetti tossed with sauteed prawns, fresh lemon juice, garlic, parsley, and olive oil.',
    type: 'non-veg'
  },
  {
    id: 37,
    name: 'Shakshuka with Sausage',
    category: 'Breakfast',
    price: 260,
    rating: 4.7,
    time: '12 min',
    image: 'https://images.unsplash.com/photo-1590412200988-a436bb705300?auto=format&fit=crop&w=900&q=80',
    description: 'Two poached eggs in a simmering spiced tomato sauce with chicken sausages and feta.',
    type: 'non-veg'
  },
  {
    id: 38,
    name: 'Buffalo Chicken Wings',
    category: 'Lunch',
    price: 250,
    rating: 4.6,
    time: '11 min',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=900&q=80',
    description: 'Tender chicken wings fried and coated in tangy Buffalo hot sauce with blue cheese dip.',
    type: 'non-veg'
  },
  {
    id: 39,
    name: 'Beef Sliders Trio',
    category: 'Lunch',
    price: 290,
    rating: 4.8,
    time: '12 min',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
    description: 'Three mini beef burgers with cheddar cheese, caramelized onions, and garlic aioli.',
    type: 'non-veg'
  },
  {
    id: 40,
    name: 'Chicken & Waffle Tower',
    category: 'Breakfast',
    price: 295,
    rating: 4.7,
    time: '12 min',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80',
    description: 'Sweet Belgian waffle topped with crispy fried chicken and maple syrup drizzle.',
    type: 'non-veg'
  },
  {
    id: 41,
    name: 'Fish and Chips Basket',
    category: 'Lunch',
    price: 310,
    rating: 4.7,
    time: '13 min',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=900&q=80',
    description: 'Crispy beer-battered fish fillets served with steak fries and tartar sauce.',
    type: 'non-veg'
  },
  {
    id: 42,
    name: 'Keema Pav Platter',
    category: 'Breakfast',
    price: 245,
    rating: 4.9,
    time: '10 min',
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=900&q=80',
    description: 'Spiced minced lamb cooked with peas, served with butter-toasted soft pav buns.',
    type: 'non-veg'
  },
  {
    id: 43,
    name: 'Thai Chilli Prawn Salad',
    category: 'Lunch',
    price: 340,
    rating: 4.6,
    time: '9 min',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80',
    description: 'Grilled shrimp over greens with mango, bell peppers, peanuts, and Thai chilli lime dressing.',
    type: 'non-veg'
  },
  {
    id: 44,
    name: 'Chicken Club Wrap',
    category: 'Lunch',
    price: 235,
    rating: 4.7,
    time: '9 min',
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=900&q=80',
    description: 'Grilled chicken, crisp bacon, avocado, lettuce, and ranch dressing in a tortilla.',
    type: 'non-veg'
  },
  {
    id: 45,
    name: 'Pepperoni Flatbread',
    category: 'Lunch',
    price: 360,
    rating: 4.8,
    time: '11 min',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80',
    description: 'Artisan flatbread topped with spicy pepperoni, mozzarella, and marinara sauce.',
    type: 'non-veg'
  },
  {
    id: 46,
    name: 'Baked Meatball skillet',
    category: 'Lunch',
    price: 250,
    rating: 4.7,
    time: '14 min',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
    description: 'Homemade pork-beef meatballs baked in rich tomato marinara, topped with melted mozzarella.',
    type: 'non-veg'
  },
  {
    id: 47,
    name: 'Crab Cakes with Garlic Dip',
    category: 'Lunch',
    price: 380,
    rating: 4.8,
    time: '12 min',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80',
    description: 'Pan-fried seasoned blue crab patties served with creamy garlic herb dipping sauce.',
    type: 'non-veg'
  },
  {
    id: 48,
    name: 'Pulled Pork Tacos',
    category: 'Lunch',
    price: 290,
    rating: 4.7,
    time: '10 min',
    image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=900&q=80',
    description: 'Three soft corn tortillas with slow-smoked pulled pork, pickled onions, and cilantro.',
    type: 'non-veg'
  },
  {
    id: 49,
    name: 'Sausage Egg McMuffin',
    category: 'Breakfast',
    price: 180,
    rating: 4.6,
    time: '6 min',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80',
    description: 'English muffin with savory pork sausage patty, fried egg, and cheddar cheese.',
    type: 'non-veg'
  },
  {
    id: 50,
    name: 'Lamb Kofta Wrap',
    category: 'Lunch',
    price: 320,
    rating: 4.8,
    time: '12 min',
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=900&q=80',
    description: 'Spiced minced lamb skewers, Tzatziki sauce, cucumber, and onions in flatbread.',
    type: 'non-veg'
  },
  {
    id: 62,
    name: 'Chicken Biryani',
    category: 'Indian',
    price: 295,
    rating: 4.9,
    time: '18 min',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80',
    description: 'Fragrant Basmati rice slow-cooked with tender spiced chicken, fresh mint, and saffron.',
    type: 'non-veg'
  },
  {
    id: 63,
    name: 'Butter Chicken Naan Roll',
    category: 'Indian',
    price: 275,
    rating: 4.8,
    time: '14 min',
    image: 'https://images.unsplash.com/photo-1601856389534-916b4c122b24?auto=format&fit=crop&w=900&q=80',
    description: 'Shredded tandoori chicken cooked in creamy tomato butter sauce, rolled in a warm butter naan.',
    type: 'non-veg'
  },
  {
    id: 64,
    name: 'Mutton Rogan Josh Rice',
    category: 'Indian',
    price: 380,
    rating: 4.9,
    time: '20 min',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    description: 'Tender mutton slow-cooked in a traditional Kashmiri red gravy, served with steamed basmati rice.',
    type: 'non-veg'
  },
  {
    id: 65,
    name: 'Tandoori Chicken Wings',
    category: 'Indian',
    price: 245,
    rating: 4.7,
    time: '15 min',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=900&q=80',
    description: 'Juicy chicken wings marinated in yogurt and tandoori spices, char-grilled to perfection.',
    type: 'non-veg'
  },
  {
    id: 66,
    name: 'Chicken Keema Pav',
    category: 'Indian',
    price: 210,
    rating: 4.8,
    time: '12 min',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=900&q=80',
    description: 'Spiced minced chicken cooked with green peas and onions, served with toasted buttered pav buns.',
    type: 'non-veg'
  }
];

// categories is computed dynamically inside App now

const cookingStepsText = [
  "Grinding fresh Arabica coffee beans... ☕",
  "Kneading the sourdough and butter naan... 🌾",
  "Simmering the rich butter gravy... 🍲",
  "Garnishing with aromatic spices... ✨",
  "Plating hot & fresh! Bon appétit! 👨‍🍳"
];

const initialReviews = [
  {
    name: "Aarav Mehta",
    rating: 5,
    comment: "The Butter Chicken Naan Roll and Masala Chai are a match made in heaven! Incredible atmosphere and super fast pickup service. Highly recommend!",
    date: "2 days ago"
  },
  {
    name: "Priya Sharma",
    rating: 5,
    comment: "Cloud Cappuccino is simply divine. It's my go-to study spot in Greater Noida. Love the warm and cozy vibes.",
    date: "5 days ago"
  },
  {
    name: "Rohan Das",
    rating: 4,
    comment: "Great Paneer Tikka Wrap! The rating and feedback system is smooth. The Samosa Chaat is very flavorful.",
    date: "1 week ago"
  }
];

function App() {
  const [activePage, setActivePage] = useState('home');

  const navigateTo = (page) => {
    if (!document.startViewTransition) {
      setActivePage(page);
      window.scrollTo(0, 0);
    } else {
      document.startViewTransition(() => {
        setActivePage(page);
        window.scrollTo(0, 0);
      });
    }
  };

  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'signup'
  const [isFirstOrder, setIsFirstOrder] = useState(true);

  // Auth form states
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'cash'

  const [activeCategory, setActiveCategory] = useState('All');
  const [dietPreference, setDietPreference] = useState('all'); // 'all' | 'veg' | 'non-veg'
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Profile Drawer history states
  const [userOrders, setUserOrders] = useState([]);
  const [userReservations, setUserReservations] = useState([]);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  const categories = useMemo(() => {
    return ['All', ...new Set(menuItems.map((item) => item.category))];
  }, [menuItems]);

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) {
      return ['Paneer', 'Coffee', 'Chicken', 'Pizza', 'Mocktail', 'Dessert'];
    }
    const query = searchQuery.toLowerCase();
    const matches = menuItems
      .filter(item => item.name.toLowerCase().includes(query))
      .map(item => item.name);
    return [...new Set(matches)].slice(0, 5);
  }, [searchQuery, menuItems]);

  const [cart, setCart] = useState([]);
  const [reservation, setReservation] = useState({ name: '', email: '', guests: 2, date: '', time: '19:00', notes: '' });
  const [bookingMessage, setBookingMessage] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [checkoutMessage, setCheckoutMessage] = useState('');

  // Contact form states
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactMessage, setContactMessage] = useState('');

  // Cooking Animation states
  const [isCooking, setIsCooking] = useState(false);
  const [cookingStep, setCookingStep] = useState(0);

  // Reviews states
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [reviewMessage, setReviewMessage] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  // Initial Load effect
  useEffect(() => {
    // Fetch menu
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        setMenuItems(data);
      })
      .catch(err => {
        console.error('Error fetching menu:', err);
        setMenuItems(initialMenuItems);
      });

    // Fetch reviews
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        setReviews(data);
      })
      .catch(err => {
        console.error('Error fetching reviews:', err);
        setReviews(initialReviews);
      });

    // Auto-login
    const token = localStorage.getItem('cafe_token');
    if (token) {
      fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error('Token invalid');
          return res.json();
        })
        .then(data => {
          setCurrentUser(data.user);
        })
        .catch(err => {
          console.error('Auto-login failed:', err);
          localStorage.removeItem('cafe_token');
        });
    }
  }, []);

  // Fetch orders and reservations when currentUser changes
  const fetchUserData = () => {
    const token = localStorage.getItem('cafe_token');
    if (!token) return;

    fetch('/api/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setUserOrders(data))
      .catch(err => console.error('Error fetching orders:', err));

    fetch('/api/reservations', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setUserReservations(data))
      .catch(err => console.error('Error fetching reservations:', err));
  };

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
      // Sync reservation name & email
      setReservation(r => ({
        ...r,
        name: currentUser.name,
        email: currentUser.email
      }));
    } else {
      setUserOrders([]);
      setUserReservations([]);
    }
  }, [currentUser]);

  const availableCoupons = useMemo(() => {
    const list = [
      { code: 'WELCOME50', discountType: 'flat', value: 50, minOrder: 200, description: 'Rs. 50 off on orders above Rs. 200' },
      { code: 'COFFEE20', discountType: 'category-percentage', category: 'Coffee', value: 20, minOrder: 0, description: '20% off on all Coffee items' },
      { code: 'FEAST100', discountType: 'flat', value: 100, minOrder: 500, description: 'Rs. 100 off on orders above Rs. 500' }
    ];
    if (isFirstOrder) {
      list.unshift({
        code: 'MYFIRSTORDER',
        discountType: 'percentage',
        value: 50,
        minOrder: 150,
        maxDiscount: 250,
        description: '50% off on your first order (up to Rs. 250)',
        requiresAuth: true
      });
    }
    return list;
  }, [isFirstOrder]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesDiet = dietPreference === 'all' || item.type === dietPreference;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesDiet && matchesSearch;
    });
  }, [activeCategory, dietPreference, searchQuery]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (total < appliedCoupon.minOrder) return 0;
    if (appliedCoupon.requiresAuth && !currentUser) return 0;

    if (appliedCoupon.discountType === 'flat') {
      return Math.min(appliedCoupon.value, total);
    }
    if (appliedCoupon.discountType === 'category-percentage') {
      const eligibleTotal = cart.reduce((sum, item) => {
        if (item.category === appliedCoupon.category) {
          return sum + item.price * item.quantity;
        }
        return sum;
      }, 0);
      return Math.round(eligibleTotal * (appliedCoupon.value / 100));
    }
    if (appliedCoupon.discountType === 'percentage') {
      const calculated = Math.round(total * (appliedCoupon.value / 100));
      if (appliedCoupon.maxDiscount) {
        return Math.min(calculated, appliedCoupon.maxDiscount);
      }
      return calculated;
    }
    return 0;
  }, [appliedCoupon, total, cart, currentUser]);

  const finalTotal = Math.max(0, total - discount);

  function applyCouponCode() {
    if (!couponCode.trim()) return;
    const found = availableCoupons.find((c) => c.code === couponCode.toUpperCase());
    if (!found) {
      setCouponError('Invalid coupon code.');
      setCouponSuccess('');
      return;
    }
    if (found.requiresAuth && !currentUser) {
      setCouponError('Please Sign In to apply this coupon.');
      setCouponSuccess('');
      setAuthTab('login');
      setIsAuthModalOpen(true);
      return;
    }
    if (total < found.minOrder) {
      setCouponError(`Min order value of Rs. ${found.minOrder} required.`);
      setCouponSuccess('');
      return;
    }
    setAppliedCoupon(found);
    setCouponError('');
    setCouponSuccess(`Coupon code "${found.code}" applied successfully!`);
  }

  function applyCouponDirectly(coupon) {
    if (coupon.requiresAuth && !currentUser) {
      setCouponError('Please Sign In to unlock this offer.');
      setCouponSuccess('');
      setAuthTab('signup');
      setIsAuthModalOpen(true);
      return;
    }
    if (total < coupon.minOrder) {
      setCouponError(`Min order value of Rs. ${coupon.minOrder} required.`);
      setCouponSuccess('');
      return;
    }
    setAppliedCoupon(coupon);
    setCouponCode(coupon.code);
    setCouponError('');
    setCouponSuccess(`Coupon code "${coupon.code}" applied successfully!`);
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    setCouponSuccess('');
  }

  function addToCart(item) {
    setCart((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return current.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
  }

  function removeFromCart(id) {
    setCart((current) => {
      const updated = current
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0);
      if (updated.length === 0) {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
        setCouponSuccess('');
      }
      return updated;
    });
  }

  function handleReservation(event) {
    event.preventDefault();
    if (!reservation.name.trim() || !reservation.date) {
      setBookingMessage('Please add your name and preferred date.');
      return;
    }
    const emailToUse = currentUser ? currentUser.email : (reservation.email || 'guest@example.com');
    
    fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: reservation.name,
        email: emailToUse,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests,
        notes: reservation.notes || ''
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Booking failed');
        return res.json();
      })
      .then(data => {
        setBookingMessage(
          `Table booked for ${reservation.name} - ${reservation.guests} guest${reservation.guests > 1 ? 's' : ''} at ${reservation.time}.`
        );
        setReservation(r => ({
          name: currentUser ? currentUser.name : '',
          email: currentUser ? currentUser.email : '',
          guests: 2,
          date: '',
          time: '19:00',
          notes: ''
        }));
        if (currentUser) fetchUserData();
      })
      .catch(err => {
        console.error(err);
        setBookingMessage('Failed to reserve table. Please try again.');
      });
  }

  function handleContactSubmit(event) {
    event.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      return;
    }
    setContactMessage(`Thank you, ${contactForm.name}! Your message has been sent successfully. We will get back to you at ${contactForm.email} shortly.`);
    setContactForm({ name: '', email: '', message: '' });
    setTimeout(() => {
      setContactMessage('');
    }, 6000);
  }

  function handleSearchChange(e) {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim() !== '') {
      navigateTo('menu');
    }
  }

  function triggerCookingAnimation(e) {
    e.preventDefault();
    if (isCooking) return;
    setIsCooking(true);
    setCookingStep(0);
    
    const interval = setInterval(() => {
      setCookingStep((prev) => prev + 1);
    }, 800);

    setTimeout(() => {
      clearInterval(interval);
      setIsCooking(false);
      navigateTo('menu');
    }, 4000);
  }

  function handleReviewSubmit(e) {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) return;
    
    fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newReview.name,
        rating: newReview.rating,
        comment: newReview.comment
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to post review');
        return res.json();
      })
      .then(added => {
        setReviews(current => [added, ...current]);
        setNewReview({ name: '', rating: 5, comment: '' });
        setReviewMessage('Thank you! Your review has been posted successfully.');
        setTimeout(() => {
          setReviewMessage('');
        }, 5000);
      })
      .catch(err => {
        console.error(err);
        setReviewMessage('Failed to post review. Please try again.');
      });
  }

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return Number((total / reviews.length).toFixed(1));
  }, [reviews]);

  function renderStars(rating) {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'star-gold' : 'star-muted'}>
        ★
      </span>
    ));
  }

  function handleAuthSubmit(e) {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Please fill in all fields.');
      return;
    }
    if (authTab === 'signup' && !authName.trim()) {
      setAuthError('Please enter your full name.');
      return;
    }
    if (authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    const endpoint = authTab === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = authTab === 'login' 
      ? { email: authEmail, password: authPassword }
      : { name: authName, email: authEmail, password: authPassword };

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(errData => {
            throw new Error(errData.error || 'Authentication failed');
          });
        }
        return res.json();
      })
      .then(data => {
        setCurrentUser(data.user);
        localStorage.setItem('cafe_token', data.token);
        
        if (authTab === 'signup') {
          setIsFirstOrder(true);
        }

        setAuthName('');
        setAuthEmail('');
        setAuthPassword('');
        setAuthError('');
        setAuthMessage('');
        setIsAuthModalOpen(false);
      })
      .catch(err => {
        console.error(err);
        setAuthError(err.message);
      });
  }

  function handleLogout() {
    setCurrentUser(null);
    localStorage.removeItem('cafe_token');
    removeCoupon();
  }

  function handlePlaceOrder() {
    if (!currentUser) {
      setAuthMessage('Please Sign In or Create an Account to place your order.');
      setAuthTab('login');
      setIsAuthModalOpen(true);
      return;
    }

    const paymentLabel = 
      paymentMethod === 'upi' ? 'UPI' : 
      paymentMethod === 'card' ? 'Credit/Debit Card' : 'Pay at Cafe Counter';

    fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: currentUser.id,
        userName: currentUser.name,
        items: cart,
        total: total,
        discount: discount,
        finalTotal: finalTotal,
        paymentMethod: paymentLabel
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Order placement failed');
        return res.json();
      })
      .then(data => {
        setCart([]);
        setCheckoutMessage(`🎉 Order placed successfully! Paid Rs. ${finalTotal} via ${paymentLabel}. Thank you!`);
        if (appliedCoupon && appliedCoupon.code === 'MYFIRSTORDER') {
          setIsFirstOrder(false);
        }
        removeCoupon();
        fetchUserData(); // reload order history in drawer
        setTimeout(() => {
          setCheckoutMessage('');
        }, 6000);
      })
      .catch(err => {
        console.error(err);
        setCheckoutMessage('Failed to place order. Please try again.');
      });
  }

  return (
    <main>
      <header className="nav-header">
        <nav className="nav">
          <a className="brand" href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} title="Go to Home">
            <img src={cafeLogo} alt="Akash's Cafe Logo" className="brand-logo" />
            Akash's Cafe
          </a>
          <div className="nav-search-container">
            <span className="nav-search-icon">🔍</span>
            <input
              type="text"
              className="nav-search-input"
              placeholder="Search food..."
              value={searchQuery}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button className="nav-clear-search-btn" onClick={() => setSearchQuery('')} aria-label="Clear search">
                ✕
              </button>
            )}
            {showSuggestions && (
              <div className="search-suggestions-dropdown">
                <div className="suggestions-header">
                  {searchQuery ? 'Matching Dishes' : 'Popular Searches'}
                </div>
                <ul className="suggestions-list">
                  {searchSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="suggestion-item"
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevents input blur before selection
                        setSearchQuery(suggestion);
                        setShowSuggestions(false);
                        navigateTo('menu');
                      }}
                    >
                      <span className="suggestion-icon">🔍</span>
                      <span className="suggestion-text">{suggestion}</span>
                    </li>
                  ))}
                  {searchQuery && searchSuggestions.length === 0 && (
                    <li className="no-suggestions-item">No dishes found</li>
                  )}
                </ul>
              </div>
            )}
          </div>
          <div className="nav-links">
            <a href="#home" className={activePage === 'home' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a>
            <a href="#menu" className={activePage === 'menu' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('menu'); }}>Menu</a>
            <a href="#cart" className={activePage === 'cart' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('cart'); }}>Cart</a>
            <a href="#reserve" className={activePage === 'reserve' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('reserve'); }}>Reserve</a>
            <a href="#reviews" className={activePage === 'reviews' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('reviews'); }}>Reviews</a>
            <a href="#contact" className={activePage === 'contact' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}>Contact</a>
          </div>
          <div className="nav-actions">
            {currentUser ? (
              <div className="user-profile" onClick={() => setIsProfileDrawerOpen(true)} style={{ cursor: 'pointer' }} title="View Profile & Orders">
                <span className="user-name">Hi, {currentUser.name} 👋</span>
              </div>
            ) : (
              <button className="login-btn" onClick={() => { setAuthTab('login'); setAuthMessage(''); setIsAuthModalOpen(true); }}>
                Sign In
              </button>
            )}
            <a href="#cart" className="cart-pill" onClick={(e) => { e.preventDefault(); navigateTo('cart'); }}>{itemCount} items</a>
          </div>
        </nav>
      </header>

      {activePage === 'home' && (
        <>
          <section className="hero" id="home">
            <div className="hero-content">
              <p className="eyebrow">Open today 8 AM - 11 PM</p>
              <h1 onClick={triggerCookingAnimation} style={{ cursor: 'pointer' }} title="Click to view virtual kitchen!">
                Akash's Cafe
              </h1>
              <p className="hero-copy">
                Fresh coffee, bright brunch plates, and calm evening bites made for unhurried conversations.
              </p>
              <div className="hero-actions">
                <a className="primary-button" href="#menu" onClick={(e) => { e.preventDefault(); navigateTo('menu'); }}>Order now</a>
                <a className="secondary-button" href="#reserve" onClick={(e) => { e.preventDefault(); navigateTo('reserve'); }}>Book a table</a>
              </div>
            </div>
          </section>

          <section className="quick-stats" aria-label="Cafe highlights">
            <div>
              <strong>4.8</strong>
              <span>Guest rating</span>
            </div>
            <div>
              <strong>49</strong>
              <span>Fresh dishes</span>
            </div>
            <div>
              <strong>18 min</strong>
              <span>Avg. pickup</span>
            </div>
          </section>
        </>
      )}

      {/* Menu Section */}
      {activePage === 'menu' && (
        <section className="menu-section" id="menu">
          <div className="section-heading">
            <p className="eyebrow">Chef picks</p>
            <h2>Order from our live menu</h2>
          </div>

          {/* Diet Toggles */}
          <div className="diet-tabs" aria-label="Dietary preferences">
            <button
              className={dietPreference === 'all' ? 'active' : ''}
              onClick={() => setDietPreference('all')}
            >
              All Dishes
            </button>
            <button
              className={dietPreference === 'veg' ? 'active veg-tab' : ''}
              onClick={() => setDietPreference('veg')}
            >
              <span className="diet-indicator-dot veg"></span> Veg Only
            </button>
            <button
              className={dietPreference === 'non-veg' ? 'active non-veg-tab' : ''}
              onClick={() => setDietPreference('non-veg')}
            >
              <span className="diet-indicator-dot non-veg"></span> Non-Veg Only
            </button>
          </div>

          {/* Category Tabs */}
          <div className="category-tabs" aria-label="Menu categories">
            {categories.map((category) => (
              <button
                className={activeCategory === category ? 'active' : ''}
                key={category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="menu-grid">
            {filteredItems.length === 0 ? (
              <div className="no-results">
                <h3>No dishes found</h3>
                <p>We couldn't find any dishes matching "{searchQuery}". Try adjusting your filters or search term!</p>
                <button className="reset-search-btn" onClick={() => { setSearchQuery(''); setActiveCategory('All'); setDietPreference('all'); }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredItems.map((item) => (
                <article className="menu-card" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="menu-card-body">
                    <div className="menu-card-top">
                      <span className="category-wrapper">
                        <span className={`diet-indicator ${item.type}`} title={item.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}></span>
                        {item.category}
                      </span>
                      <span>★ {item.rating} / 5</span>
                    </div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="menu-card-bottom">
                      <strong>Rs. {item.price}</strong>
                      <small>{item.time}</small>
                      {(() => {
                        const cartItem = cart.find((ci) => ci.id === item.id);
                        const qty = cartItem ? cartItem.quantity : 0;
                        if (qty > 0) {
                          return (
                            <div className="menu-card-qty-control">
                              <button onClick={() => removeFromCart(item.id)} aria-label="Decrease quantity">-</button>
                              <span className="menu-card-qty">{qty}</span>
                              <button onClick={() => addToCart(item)} aria-label="Increase quantity">+</button>
                            </div>
                          );
                        }
                        return <button onClick={() => addToCart(item)}>Add</button>;
                      })()}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      )}

      {/* Cart Section */}
      {activePage === 'cart' && (
        <section className="cart-section" id="cart">
          <div className="section-heading">
            <p className="eyebrow">Your Selection</p>
            <h2>Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</h2>
          </div>

          {checkoutMessage ? (
            <div className="checkout-message-success">{checkoutMessage}</div>
          ) : cart.length === 0 ? (
            <div className="empty-cart-view">
              <div className="empty-cart-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything to your cart yet. Head over to our menu and pick some tasty treats!</p>
              <button className="primary-button" onClick={() => navigateTo('menu')}>Browse Menu</button>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-items-column">
                <div className="cart-items-table">
                  {cart.map((item) => (
                    <div className="cart-item-row" key={item.id}>
                      <img src={item.image} alt={item.name} className="cart-item-img" />
                      <div className="cart-item-details">
                        <div className="cart-item-name-type">
                          <strong>{item.name}</strong>
                          <span className={`diet-indicator ${item.type}`} title={item.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}></span>
                        </div>
                        <span className="cart-item-cat">{item.category}</span>
                      </div>
                      <div className="cart-item-qty">
                        <button onClick={() => removeFromCart(item.id)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => addToCart(item)}>+</button>
                      </div>
                      <div className="cart-item-price-total">
                        <strong>Rs. {item.price * item.quantity}</strong>
                        <small>Rs. {item.price} each</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cart-summary-column">
                <div className="summary-card">
                  <h3>Order Summary</h3>
                  
                  {/* Coupon section */}
                  <div className="coupon-section">
                    <label>Have a coupon code?</label>
                    <div className="coupon-input-wrapper">
                      <input 
                        type="text" 
                        placeholder="ENTER CODE" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <button className="coupon-apply-btn" onClick={applyCouponCode}>Apply</button>
                    </div>
                    {couponError && <p className="coupon-message error">❌ {couponError}</p>}
                    {couponSuccess && <p className="coupon-message success">✨ {couponSuccess}</p>}
                    
                    {appliedCoupon && (
                      <div className="active-coupon-badge">
                        <span>🏷️ {appliedCoupon.code}</span>
                        <button onClick={removeCoupon} title="Remove coupon">✕</button>
                      </div>
                    )}

                    <div className="available-coupons">
                      <span>Available Offers</span>
                      <div className="coupons-list">
                        {availableCoupons.map((coupon) => {
                          const isLocked = coupon.requiresAuth && !currentUser;
                          const hasMinOrder = total >= coupon.minOrder;
                          const isApplied = appliedCoupon && appliedCoupon.code === coupon.code;
                          
                          return (
                            <div key={coupon.code} className={`coupon-item ${isLocked || !hasMinOrder ? 'locked' : ''}`}>
                              <div className="coupon-info">
                                <strong>
                                  {coupon.code}
                                  {isLocked && <span className="lock-badge">🔒 Sign In</span>}
                                  {!hasMinOrder && total > 0 && <span className="lock-badge">Min Rs. {coupon.minOrder}</span>}
                                </strong>
                                <p>{coupon.description}</p>
                              </div>
                              <button 
                                className={`coupon-action-btn ${isLocked || !hasMinOrder ? 'lock-btn' : ''}`}
                                onClick={() => {
                                  if (isLocked || !hasMinOrder) {
                                    applyCouponDirectly(coupon);
                                  } else if (isApplied) {
                                    removeCoupon();
                                  } else {
                                    applyCouponDirectly(coupon);
                                  }
                                }}
                                disabled={isApplied}
                              >
                                {isApplied ? 'Applied' : isLocked ? 'Unlock' : 'Apply'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="payment-section">
                    <h4>Select Payment Method</h4>
                    <div className="payment-options">
                      <label className={`payment-option-card ${paymentMethod === 'upi' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="payment" 
                          value="upi" 
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                        />
                        <span className="payment-icon">📱</span>
                        <div className="payment-label">
                          <strong>UPI</strong>
                          <span>Google Pay, PhonePe, Paytm</span>
                        </div>
                      </label>
                      
                      <label className={`payment-option-card ${paymentMethod === 'card' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="payment" 
                          value="card" 
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                        />
                        <span className="payment-icon">💳</span>
                        <div className="payment-label">
                          <strong>Credit / Debit Card</strong>
                          <span>Visa, Mastercard, RuPay</span>
                        </div>
                      </label>

                      <label className={`payment-option-card ${paymentMethod === 'cash' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="payment" 
                          value="cash" 
                          checked={paymentMethod === 'cash'}
                          onChange={() => setPaymentMethod('cash')}
                        />
                        <span className="payment-icon">💵</span>
                        <div className="payment-label">
                          <strong>Pay at Cafe Counter</strong>
                          <span>Cash or card on pickup</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="pricing-breakdown">
                    <div className="order-summary-row">
                      <span>Subtotal</span>
                      <span>Rs. {total}</span>
                    </div>
                    {discount > 0 && (
                      <div className="order-summary-row discount">
                        <span>Discount</span>
                        <span>- Rs. {discount}</span>
                      </div>
                    )}
                    {appliedCoupon && total < appliedCoupon.minOrder && (
                      <div className="coupon-message error" style={{ marginBottom: '8px' }}>
                        Add Rs. {appliedCoupon.minOrder - total} more to activate.
                      </div>
                    )}
                    {appliedCoupon && appliedCoupon.requiresAuth && !currentUser && (
                      <div className="coupon-message error" style={{ marginBottom: '8px' }}>
                        Sign In to activate discount.
                      </div>
                    )}
                    <div className="order-summary-row final-total">
                      <span>Total Payable</span>
                      <span>Rs. {finalTotal}</span>
                    </div>
                  </div>

                  <button className="checkout-button" onClick={handlePlaceOrder} disabled={cart.length === 0}>
                    Place order
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Reservation Section */}
      {activePage === 'reserve' && (
        <section className="reserve-section" id="reserve">
          <div className="reserve-copy">
            <p className="eyebrow">Reservations</p>
            <h2>Save your favorite corner</h2>
            <p>
              Plan a breakfast meet, a study session, or a relaxed dinner. Choose your guest count and time,
              and we will hold a table for you.
            </p>
          </div>

          <form className="booking-form" onSubmit={handleReservation}>
            <label>
              Name
              <input
                value={reservation.name}
                onChange={(event) => setReservation({ ...reservation, name: event.target.value })}
                placeholder="Your name"
              />
            </label>
            <label>
              Guests
              <input
                min="1"
                max="12"
                type="number"
                value={reservation.guests}
                onChange={(event) => setReservation({ ...reservation, guests: Number(event.target.value) })}
              />
            </label>
            <label>
              Date
              <input
                type="date"
                value={reservation.date}
                onChange={(event) => setReservation({ ...reservation, date: event.target.value })}
              />
            </label>
            <label>
              Time
              <select
                value={reservation.time}
                onChange={(event) => setReservation({ ...reservation, time: event.target.value })}
              >
                <option>09:00</option>
                <option>12:30</option>
                <option>16:00</option>
                <option>19:00</option>
                <option>21:00</option>
              </select>
            </label>
            <button type="submit">Reserve table</button>
            {bookingMessage && <p className="booking-message">{bookingMessage}</p>}
          </form>
        </section>
      )}

      {/* Ratings & Feedback Section */}
      {activePage === 'reviews' && (
        <section className="reviews-section" id="reviews">
          <div className="section-heading">
            <p className="eyebrow">Customer Voices</p>
            <h2>Guest Ratings & Reviews</h2>
          </div>

          <div className="reviews-grid">
            {/* Left Column: Summary and Form */}
            <div className="reviews-summary-column">
              <div className="rating-summary-card">
                <div className="average-rating-display">
                  <span className="rating-number">{avgRating}</span>
                  <div className="stars-row">
                    {renderStars(Math.round(avgRating))}
                  </div>
                  <span className="rating-count">Based on {reviews.length} reviews</span>
                </div>
                
                <div className="star-bars-list">
                  {[5, 4, 3, 2, 1].map((starNum) => {
                    const count = reviews.filter(r => r.rating === starNum).length;
                    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return (
                      <div key={starNum} className="star-bar-row">
                        <span className="star-label">{starNum} ★</span>
                        <div className="star-bar-bg">
                          <div className="star-bar-fill" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <span className="star-count">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Write a Review form */}
              <form className="review-form" onSubmit={handleReviewSubmit}>
                <h3>Share Your Experience</h3>
                
                <div className="rating-selector-group">
                  <label>Your Rating</label>
                  <div className="star-selector">
                    {[1, 2, 3, 4, 5].map((starNum) => (
                      <button
                        key={starNum}
                        type="button"
                        className={`star-select-btn ${(hoveredStar || newReview.rating) >= starNum ? 'active' : ''}`}
                        onClick={() => setNewReview({ ...newReview, rating: starNum })}
                        onMouseEnter={() => setHoveredStar(starNum)}
                        onMouseLeave={() => setHoveredStar(0)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <label>
                  Name
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  />
                </label>

                <label>
                  Review Comment
                  <textarea
                    required
                    rows="3"
                    placeholder="Tell us what you liked..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  ></textarea>
                </label>

                <button type="submit" className="primary-button">Submit Review</button>
                {reviewMessage && <p className="review-success-msg">✨ {reviewMessage}</p>}
              </form>
            </div>

            {/* Right Column: Reviews List */}
            <div className="reviews-list-column">
              <div className="reviews-scroll-container">
                {reviews.map((rev, index) => (
                  <div key={index} className="review-card">
                    <div className="review-card-header">
                      <strong>{rev.name}</strong>
                      <span className="review-stars">{renderStars(rev.rating)}</span>
                    </div>
                    <p className="review-comment">"{rev.comment}"</p>
                    <span className="review-date">{rev.date || 'Just now'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Visit & Contact Section */}
      {activePage === 'contact' && (
        <section className="visit-contact-section">
          <div className="visit-contact-grid">
            <div className="visit-column" id="visit">
              <div className="card-header-group">
                <span className="eyebrow">Find Us</span>
                <h2>Visit the Cafe</h2>
              </div>
              <p className="visit-lead">
                Nestled in the heart of Greater Noida, our cafe is a peaceful sanctuary from the bustling city. Come for the coffee, stay for the cozy atmosphere.
              </p>
              <div className="visit-info-list">
                <div className="visit-info-item">
                  <span className="visit-info-icon">📍</span>
                  <div>
                    <strong>Address</strong>
                    <span>Alpha 2, Greater Noida, Uttar Pradesh 201308</span>
                  </div>
                </div>
                <div className="visit-info-item">
                  <span className="visit-info-icon">🕒</span>
                  <div>
                    <strong>Opening Hours</strong>
                    <span>8 AM - 11 PM daily</span>
                  </div>
                </div>
              </div>
              {/* Styled Map card */}
              <div className="map-wrapper" style={{ height: '220px' }}>
                <iframe
                  src="https://maps.google.com/maps?q=Alpha%202,%20Greater%20Noida,%20Uttar%20Pradesh%20201308&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Map location of Akash's Cafe in Alpha 2, Greater Noida"
                ></iframe>
              </div>
            </div>

            <div className="contact-column" id="contact">
              <div className="card-header-group">
                <span className="eyebrow">Get in Touch</span>
                <h2>Contact Us</h2>
              </div>
              <p className="contact-lead">
                Have questions, feedback, or hosting an event? Drop us a line and we'll get back to you shortly.
              </p>
              <div className="contact-quick-info">
                <div className="contact-pill-item">
                  <span className="contact-pill-icon">📞</span>
                  <div>
                    <small>Call Us</small>
                    <strong><a href="tel:+919555193023">+91 9555193023</a></strong>
                  </div>
                </div>
                <div className="contact-pill-item">
                  <span className="contact-pill-icon">✉️</span>
                  <div>
                    <small>Email Us</small>
                    <strong><a href="mailto:akashcafes@gmail.com">akashcafes@gmail.com</a></strong>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <form className="contact-form" onSubmit={handleContactSubmit}>
                <div className="form-row">
                  <label>
                    Name
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    />
                  </label>
                  <label>
                    Email Address
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    />
                  </label>
                </div>
                <label>
                  Message
                  <textarea
                    required
                    rows="4"
                    placeholder="How can we help you?"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  ></textarea>
                </label>
                <button type="submit" className="primary-button">Send Message</button>
                {contactMessage && <p className="contact-success-msg">✨ {contactMessage}</p>}
              </form>
            </div>
          </div>
        </section>
      )}

      <footer>
        <div className="footer-bottom">
          <div className="footer-brand">
            <img src={cafeLogo} alt="Akash's Cafe Logo" className="footer-logo" />
            <strong>Akash's Cafe</strong>
          </div>
          <span>&copy; {new Date().getFullYear()} Akash's Cafe. All rights reserved.</span>
        </div>
      </footer>

      {/* Auth Modal Overlay */}
      {isAuthModalOpen && (
        <div className="auth-overlay" onClick={() => setIsAuthModalOpen(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setIsAuthModalOpen(false)} aria-label="Close modal">✕</button>
            
            {authMessage && (
              <div className="auth-alert-message">
                🔑 {authMessage}
              </div>
            )}

            <div className="auth-tabs">
              <button
                className={authTab === 'login' ? 'active' : ''}
                onClick={() => { setAuthTab('login'); setAuthError(''); }}
              >
                Sign In
              </button>
              <button
                className={authTab === 'signup' ? 'active' : ''}
                onClick={() => { setAuthTab('signup'); setAuthError(''); }}
              >
                Create Account
              </button>
            </div>
            
            <form onSubmit={handleAuthSubmit} className="auth-form">
              {authError && <p className="auth-form-error">{authError}</p>}
              
              {authTab === 'signup' && (
                <label>
                  Full Name
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    required
                  />
                </label>
              )}
              
              <label>
                Email Address
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                />
              </label>
              
              <label>
                Password
                <input
                  type="password"
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                />
              </label>
              
              <button type="submit" className="auth-submit-btn">
                {authTab === 'login' ? 'Sign In' : 'Register & Log In'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Cooking Animation Overlay */}
      {isCooking && (
        <div className="cooking-overlay">
          <div className="cooking-container">
            <div className="cooking-illustration">
              <div className="steam-wrapper">
                <span className="steam-line steam-1">~</span>
                <span className="steam-line steam-2">~</span>
                <span className="steam-line steam-3">~</span>
              </div>
              <div className="cooking-pot">
                <div className="pot-lid"></div>
                <div className="pot-body"></div>
                <div className="pot-handle handle-left"></div>
                <div className="pot-handle handle-right"></div>
              </div>
              <div className="cooking-fire">
                <span className="flame flame-1"></span>
                <span className="flame flame-2"></span>
                <span className="flame flame-3"></span>
              </div>
              {/* Floating Ingredients */}
              <span className="floating-item ingredient-bean">☕</span>
              <span className="floating-item ingredient-leaf">🍃</span>
              <span className="floating-item ingredient-chili">🌶️</span>
              <span className="floating-item ingredient-bread">🍞</span>
              <span className="floating-item ingredient-tomato">🍅</span>
            </div>

            <h2>Preparing Tasty Food...</h2>
            <div className="cooking-step-box">
              <p className="cooking-step-text">
                {cookingStepsText[Math.min(cookingStep, cookingStepsText.length - 1)]}
              </p>
            </div>
            
            <div className="cooking-progress-bar">
              <div className="cooking-progress-fill" style={{ width: `${(cookingStep + 1) * 20}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Drawer */}
      {isProfileDrawerOpen && currentUser && (
        <div className="profile-drawer-overlay" onClick={() => setIsProfileDrawerOpen(false)}>
          <div className="profile-drawer" onClick={(e) => e.stopPropagation()}>
            <button className="close-drawer-btn" onClick={() => setIsProfileDrawerOpen(false)} aria-label="Close profile">✕</button>
            
            <div className="drawer-header">
              <h2>My Profile</h2>
              <p className="drawer-user-email">{currentUser.email}</p>
            </div>
            
            <div className="drawer-body">
              {/* Order History */}
              <div className="drawer-section">
                <h3>Order History</h3>
                {userOrders.length === 0 ? (
                  <p className="empty-drawer-text">No orders placed yet. Start ordering your favorite bites!</p>
                ) : (
                  <div className="history-list">
                    {userOrders.map((order) => (
                      <div key={order.id} className="history-card">
                        <div className="history-card-header">
                          <strong>Order #{order.id}</strong>
                          <span className="history-date">
                            {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="history-items">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="history-item-row">
                              <span>{item.name} x {item.quantity}</span>
                              <span>Rs. {item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className="history-card-footer">
                          <span>Via {order.payment_method}</span>
                          <strong>Rs. {order.final_total}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Reservation Logs */}
              <div className="drawer-section">
                <h3>Table Reservations</h3>
                {userReservations.length === 0 ? (
                  <p className="empty-drawer-text">No active reservations. Book your table below!</p>
                ) : (
                  <div className="history-list">
                    {userReservations.map((res) => (
                      <div key={res.id} className="history-card reservation-card">
                        <div className="history-card-header">
                          <strong>Table for {res.guests}</strong>
                          <span className="history-status-badge">Confirmed</span>
                        </div>
                        <div className="reservation-details">
                          <p>📅 <strong>Date:</strong> {res.date}</p>
                          <p>🕒 <strong>Time:</strong> {res.time}</p>
                          {res.notes && <p>✍️ <strong>Notes:</strong> "{res.notes}"</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="drawer-footer">
              <button className="logout-btn-full" onClick={() => { handleLogout(); setIsProfileDrawerOpen(false); }}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
