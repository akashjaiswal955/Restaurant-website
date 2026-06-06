const express = require('express');
const cors = require('cors');
const { DatabaseSync } = require('node:sqlite');
const crypto = require('node:crypto');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbFile = path.join(__dirname, '../cafe.db');
const db = new DatabaseSync(dbFile);

// Create SQLite tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    rating REAL NOT NULL,
    time TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    user_name TEXT,
    items TEXT NOT NULL,
    total REAL NOT NULL,
    discount REAL NOT NULL,
    final_total REAL NOT NULL,
    payment_method TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    guests INTEGER NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Pure-Node JWT Implementation
const JWT_SECRET = 'akashs_cafe_super_secret_key_12345';

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

function generateToken(user) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  })).toString('base64url');
  
  const signature = crypto.createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');
    
  return `${header}.${payload}.${signature}`;
}

function verifyToken(token) {
  try {
    const [header, payload, signature] = token.split('.');
    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');
      
    if (signature !== expectedSignature) return null;
    
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (decodedPayload.exp < Date.now()) return null; // expired
    
    return decodedPayload;
  } catch (e) {
    return null;
  }
}

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access token required' });
  
  const decoded = verifyToken(token);
  if (!decoded) return res.status(403).json({ error: 'Invalid or expired token' });
  
  req.user = decoded;
  next();
}

// Initial Menu Items (Seed Data)
const initialMenuItems = [
  // --- VEG ITEMS (24) ---
  { id: 2, name: 'Cloud Cappuccino', category: 'Coffee', price: 145, rating: 4.9, time: '5 min', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80', description: 'Double shot espresso with velvety milk and cocoa dust.', type: 'veg' },
  { id: 3, name: 'Garden Pesto Pasta', category: 'Lunch', price: 295, rating: 4.7, time: '16 min', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80', description: 'Basil pesto, cherry tomatoes, parmesan, toasted seeds, and greens.', type: 'veg' },
  { id: 4, name: 'Belgian Cocoa Waffle', category: 'Dessert', price: 235, rating: 4.8, time: '12 min', image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=900&q=80', description: 'Warm waffle, dark chocolate, berries, and vanilla cream.', type: 'veg' },
  { id: 5, name: 'Iced Saffron Latte', category: 'Coffee', price: 165, rating: 4.7, time: '6 min', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80', description: 'Cold espresso, saffron milk, cardamom foam, and ice.', type: 'veg' },
  { id: 6, name: 'Avocado Smash Toast', category: 'Breakfast', price: 245, rating: 4.8, time: '8 min', image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=900&q=80', description: 'Crushed avocado, cherry tomatoes, feta, and pumpkin seeds on sourdough.', type: 'veg' },
  { id: 7, name: 'Spinach Corn Quesadilla', category: 'Lunch', price: 210, rating: 4.6, time: '12 min', image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=900&q=80', description: 'Tortilla stuffed with creamy spinach, sweet corn, and melted mozzarella.', type: 'veg' },
  { id: 8, name: 'Cinnamon Swirl Roll', category: 'Dessert', price: 165, rating: 4.9, time: '4 min', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80', description: 'Freshly baked cinnamon roll topped with cream cheese frosting.', type: 'veg' },
  { id: 9, name: 'Classic Macchiato', category: 'Coffee', price: 125, rating: 4.5, time: '3 min', image: 'https://images.unsplash.com/photo-1485808191679-5f63bbd02105?auto=format&fit=crop&w=900&q=80', description: 'Espresso marked with a small dollop of foamed milk.', type: 'veg' },
  { id: 10, name: 'Paneer Tikka Wrap', category: 'Lunch', price: 225, rating: 4.8, time: '11 min', image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=900&q=80', description: 'Spiced paneer cubes, mint chutney, bell peppers, and onions in a flatbread.', type: 'veg' },
  { id: 11, name: 'Truffle Parmesan Fries', category: 'Lunch', price: 195, rating: 4.7, time: '7 min', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80', description: 'Crispy golden fries tossed in white truffle oil and grated parmesan.', type: 'veg' },
  { id: 12, name: 'Loaded Nacho Platter', category: 'Lunch', price: 240, rating: 4.6, time: '9 min', image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=900&q=80', description: 'Corn tortilla chips, warm cheese sauce, black beans, jalapenos, and salsa.', type: 'veg' },
  { id: 13, name: 'Mediterranean Hummus Bowl', category: 'Lunch', price: 280, rating: 4.7, time: '10 min', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80', description: 'Creamy hummus, falafel, cucumber tomato salad, olives, and pita bread.', type: 'veg' },
  { id: 14, name: 'Blueberry Cheese Danish', category: 'Dessert', price: 185, rating: 4.8, time: '5 min', image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=900&q=80', description: 'Flaky puff pastry filled with sweet cream cheese and wild blueberry compote.', type: 'veg' },
  { id: 15, name: 'Matcha Latte', category: 'Coffee', price: 175, rating: 4.6, time: '5 min', image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=900&q=80', description: 'Ceremonial grade matcha green tea whisked with creamy steamed milk.', type: 'veg' },
  { id: 16, name: 'Classic Margherita Pizza', category: 'Lunch', price: 340, rating: 4.9, time: '15 min', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80', description: 'San Marzano tomato sauce, fresh mozzarella, sweet basil, and olive oil.', type: 'veg' },
  { id: 17, name: 'Honey Lemon Iced Tea', category: 'Coffee', price: 120, rating: 4.4, time: '4 min', image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=900&q=80', description: 'Chilled black tea infused with raw honey and fresh lemon juice.', type: 'veg' },
  { id: 18, name: 'Strawberry Banana Smoothie', category: 'Coffee', price: 165, rating: 4.6, time: '6 min', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=900&q=80', description: 'Creamy blend of fresh strawberries, ripe bananas, greek yogurt, and honey.', type: 'veg' },
  { id: 19, name: 'Grilled Cheese Sandwich', category: 'Breakfast', price: 160, rating: 4.7, time: '8 min', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80', description: 'Golden, buttery toasted sourdough with melted cheddar and mozzarella.', type: 'veg' },
  { id: 20, name: 'Mango Chia Pudding', category: 'Breakfast', price: 190, rating: 4.7, time: '5 min', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80', description: 'Chia seeds soaked in coconut milk, layered with fresh mango puree.', type: 'veg' },
  { id: 21, name: 'Red Velvet Pastry', category: 'Dessert', price: 195, rating: 4.8, time: '3 min', image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=900&q=80', description: 'Moist red velvet sponge layers with smooth vanilla cream cheese frosting.', type: 'veg' },
  { id: 22, name: 'Hot Butter Croissant', category: 'Breakfast', price: 130, rating: 4.9, time: '4 min', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80', description: 'Flaky, buttery laminated French pastry served warm.', type: 'veg' },
  { id: 23, name: 'Rose & Cardamom Bun', category: 'Dessert', price: 150, rating: 4.8, time: '5 min', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80', description: 'Swedish-style cardamom bun infused with organic rose water glaze.', type: 'veg' },
  { id: 24, name: 'Mushroom Stroganoff', category: 'Lunch', price: 310, rating: 4.6, time: '14 min', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80', description: 'Sauteed mushrooms in a rich sour cream sauce, served over buttered rice.', type: 'veg' },
  { id: 25, name: 'Rose Lemonade', category: 'Coffee', price: 140, rating: 4.5, time: '4 min', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80', description: 'Chilled sparkling lemonade infused with delicate rose petal extract.', type: 'veg' },
  { id: 51, name: 'Irish Cream Cold Brew', category: 'Coffee', price: 175, rating: 4.8, time: '4 min', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80', description: 'Cold brew coffee topped with sweet Irish cream cold foam.', type: 'veg' },
  { id: 52, name: 'Caramel Macchiato', category: 'Coffee', price: 155, rating: 4.7, time: '5 min', image: 'https://images.unsplash.com/photo-1485808191679-5f63bbd02105?auto=format&fit=crop&w=900&q=80', description: 'Freshly steamed milk with vanilla-flavored syrup, marked with espresso and caramel drizzle.', type: 'veg' },
  { id: 53, name: 'Masala Chai', category: 'Tea', price: 95, rating: 4.9, time: '6 min', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80', description: 'Brewed black tea with a mixture of aromatic Indian spices and milk.', type: 'veg' },
  { id: 54, name: 'Matcha Green Tea Latte', category: 'Tea', price: 185, rating: 4.6, time: '5 min', image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=900&q=80', description: 'Pure Japanese matcha whisked with hot milk and organic honey.', type: 'veg' },
  { id: 55, name: 'Darjeeling Earl Grey', category: 'Tea', price: 125, rating: 4.5, time: '4 min', image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=900&q=80', description: 'Fine Darjeeling black tea scented with oil of bergamot orange.', type: 'veg' },
  { id: 56, name: 'Mango Lassi', category: 'Drinks', price: 120, rating: 4.9, time: '4 min', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=900&q=80', description: 'Traditional sweet yogurt drink blended with fresh Alphonso mango pulp.', type: 'veg' },
  { id: 57, name: 'Fresh Mint Mojito', category: 'Drinks', price: 135, rating: 4.7, time: '5 min', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80', description: 'Refreshing mocktail with muddled fresh mint leaves, lime juice, and soda.', type: 'veg' },
  { id: 58, name: 'Rose Thandai', category: 'Drinks', price: 150, rating: 4.8, time: '6 min', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80', description: 'Traditional chilled milk drink with almonds, fennel seeds, rose petals, and saffron.', type: 'veg' },
  { id: 59, name: 'Paneer Butter Masala Naan', category: 'Indian', price: 260, rating: 4.9, time: '15 min', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80', description: 'Cubes of fresh paneer in a rich tomato-butter gravy, served with hot garlic butter naan.', type: 'veg' },
  { id: 60, name: 'Samosa Chaat', category: 'Indian', price: 145, rating: 4.8, time: '10 min', image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=900&q=80', description: 'Crispy samosas crushed and topped with warm chickpea curry, sweetened yogurt, chutneys, and sev.', type: 'veg' },
  { id: 61, name: 'Amritsari Paneer Kulcha', category: 'Indian', price: 195, rating: 4.8, time: '12 min', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80', description: 'Crispy, clay-oven baked bread stuffed with spiced paneer, served with chole and white butter.', type: 'veg' },

  // --- NON-VEG ITEMS (25) ---
  { id: 26, name: 'Chicken Tikka Panini', category: 'Lunch', price: 265, rating: 4.8, time: '12 min', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80', description: 'Spiced chicken tikka, smoked gouda, mint mayo, and red onion on sourdough.', type: 'non-veg' },
  { id: 27, name: 'Smoked Salmon Bagel', category: 'Breakfast', price: 345, rating: 4.9, time: '8 min', image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=900&q=80', description: 'Toasted bagel with smoked salmon, cream cheese, capers, dill, and red onion.', type: 'non-veg' },
  { id: 28, name: 'Classic Benedict Eggs', category: 'Breakfast', price: 240, rating: 4.7, time: '10 min', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80', description: 'Poached eggs, smoked ham, and velvety hollandaise sauce on English muffins.', type: 'non-veg' },
  { id: 29, name: 'Spicy Chicken Ramen', category: 'Lunch', price: 325, rating: 4.8, time: '15 min', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80', description: 'Ramen noodles, spicy chicken broth, grilled chicken breast, soft boiled egg, and scallions.', type: 'non-veg' },
  { id: 30, name: 'Crispy Chicken Tenders', category: 'Lunch', price: 220, rating: 4.6, time: '9 min', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=80', description: 'Golden fried panko-crusted chicken strips served with honey mustard.', type: 'non-veg' },
  { id: 31, name: 'Bacon & Cheddar Omelette', category: 'Breakfast', price: 210, rating: 4.7, time: '7 min', image: 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&w=900&q=80', description: 'Three-egg fluffy omelette stuffed with crispy bacon bits and sharp cheddar.', type: 'non-veg' },
  { id: 32, name: 'BBQ Pulled Chicken Burger', category: 'Lunch', price: 340, rating: 4.8, time: '13 min', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80', description: 'Slow-cooked hickory pulled chicken, cream coleslaw, and pickle slices in brioche.', type: 'non-veg' },
  { id: 33, name: 'Butter Chicken Croissant', category: 'Breakfast', price: 195, rating: 4.9, time: '6 min', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80', description: 'Flaky warm croissant stuffed with creamy butter chicken gravy and shredded chicken.', type: 'non-veg' },
  { id: 34, name: 'Prawn Tempura Basket', category: 'Lunch', price: 310, rating: 4.7, time: '10 min', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80', description: 'Crispy batter-fried Japanese prawns served with light tempura dipping sauce.', type: 'non-veg' },
  { id: 35, name: 'Turkey Club Sandwich', category: 'Lunch', price: 275, rating: 4.7, time: '10 min', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80', description: 'Triple-decker bread, smoked turkey, crispy bacon, lettuce, tomatoes, and mayo.', type: 'non-veg' },
  { id: 36, name: 'Lemon Garlic Shrimp Pasta', category: 'Lunch', price: 380, rating: 4.8, time: '14 min', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80', description: 'Spaghetti tossed with sauteed prawns, fresh lemon juice, garlic, parsley, and olive oil.', type: 'non-veg' },
  { id: 37, name: 'Shakshuka with Sausage', category: 'Breakfast', price: 260, rating: 4.7, time: '12 min', image: 'https://images.unsplash.com/photo-1590412200988-a436bb705300?auto=format&fit=crop&w=900&q=80', description: 'Two poached eggs in a simmering spiced tomato sauce with chicken sausages and feta.', type: 'non-veg' },
  { id: 38, name: 'Buffalo Chicken Wings', category: 'Lunch', price: 250, rating: 4.6, time: '11 min', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=900&q=80', description: 'Tender chicken wings fried and coated in tangy Buffalo hot sauce with blue cheese dip.', type: 'non-veg' },
  { id: 39, name: 'Beef Sliders Trio', category: 'Lunch', price: 290, rating: 4.8, time: '12 min', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80', description: 'Three mini beef burgers with cheddar cheese, caramelized onions, and garlic aioli.', type: 'non-veg' },
  { id: 40, name: 'Chicken & Waffle Tower', category: 'Breakfast', price: 295, rating: 4.7, time: '12 min', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80', description: 'Sweet Belgian waffle topped with crispy fried chicken and maple syrup drizzle.', type: 'non-veg' },
  { id: 41, name: 'Fish and Chips Basket', category: 'Lunch', price: 310, rating: 4.7, time: '13 min', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=900&q=80', description: 'Crispy beer-battered fish fillets served with steak fries and tartar sauce.', type: 'non-veg' },
  { id: 42, name: 'Keema Pav Platter', category: 'Breakfast', price: 245, rating: 4.9, time: '10 min', image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=900&q=80', description: 'Spiced minced lamb cooked with peas, served with butter-toasted soft pav buns.', type: 'non-veg' },
  { id: 43, name: 'Thai Chilli Prawn Salad', category: 'Lunch', price: 340, rating: 4.6, time: '9 min', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80', description: 'Grilled shrimp over greens with mango, bell peppers, peanuts, and Thai chilli lime dressing.', type: 'non-veg' },
  { id: 44, name: 'Chicken Club Wrap', category: 'Lunch', price: 235, rating: 4.7, time: '9 min', image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=900&q=80', description: 'Grilled chicken, crisp bacon, avocado, lettuce, and ranch dressing in a tortilla.', type: 'non-veg' },
  { id: 45, name: 'Pepperoni Flatbread', category: 'Lunch', price: 360, rating: 4.8, time: '11 min', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80', description: 'Artisan flatbread topped with spicy pepperoni, mozzarella, and marinara sauce.', type: 'non-veg' },
  { id: 46, name: 'Baked Meatball skillet', category: 'Lunch', price: 250, rating: 4.7, time: '14 min', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80', description: 'Homemade pork-beef meatballs baked in rich tomato marinara, topped with melted mozzarella.', type: 'non-veg' },
  { id: 47, name: 'Crab Cakes with Garlic Dip', category: 'Lunch', price: 380, rating: 4.8, time: '12 min', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80', description: 'Pan-fried seasoned blue crab patties served with creamy garlic herb dipping sauce.', type: 'non-veg' },
  { id: 48, name: 'Pulled Pork Tacos', category: 'Lunch', price: 290, rating: 4.7, time: '10 min', image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=900&q=80', description: 'Three soft corn tortillas with slow-smoked pulled pork, pickled onions, and cilantro.', type: 'non-veg' },
  { id: 49, name: 'Sausage Egg McMuffin', category: 'Breakfast', price: 180, rating: 4.6, time: '6 min', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80', description: 'English muffin with savory pork sausage patty, fried egg, and cheddar cheese.', type: 'non-veg' },
  { id: 50, name: 'Lamb Kofta Wrap', category: 'Lunch', price: 320, rating: 4.8, time: '12 min', image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=900&q=80', description: 'Spiced minced lamb skewers, Tzatziki sauce, cucumber, and onions in flatbread.', type: 'non-veg' },
  { id: 62, name: 'Chicken Biryani', category: 'Indian', price: 295, rating: 4.9, time: '18 min', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80', description: 'Fragrant Basmati rice slow-cooked with tender spiced chicken, fresh mint, and saffron.', type: 'non-veg' },
  { id: 63, name: 'Butter Chicken Naan Roll', category: 'Indian', price: 275, rating: 4.8, time: '14 min', image: 'https://images.unsplash.com/photo-1601856389534-916b4c122b24?auto=format&fit=crop&w=900&q=80', description: 'Shredded tandoori chicken cooked in creamy tomato butter sauce, rolled in a warm butter naan.', type: 'non-veg' },
  { id: 64, name: 'Mutton Rogan Josh Rice', category: 'Indian', price: 380, rating: 4.9, time: '20 min', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80', description: 'Tender mutton slow-cooked in a traditional Kashmiri red gravy, served with steamed basmati rice.', type: 'non-veg' },
  { id: 65, name: 'Tandoori Chicken Wings', category: 'Indian', price: 245, rating: 4.7, time: '15 min', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=900&q=80', description: 'Juicy chicken wings marinated in yogurt and tandoori spices, char-grilled to perfection.', type: 'non-veg' },
  { id: 66, name: 'Chicken Keema Pav', category: 'Indian', price: 210, rating: 4.8, time: '12 min', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=900&q=80', description: 'Spiced minced chicken cooked with green peas and onions, served with toasted buttered pav buns.', type: 'non-veg' }
];

const initialReviews = [
  { name: 'Aarav Mehta', rating: 5, comment: 'The Butter Chicken Naan Roll and Masala Chai are a match made in heaven! Incredible atmosphere and super fast pickup service. Highly recommend!', date: '2 days ago' },
  { name: 'Priya Sharma', rating: 5, comment: "Cloud Cappuccino is simply divine. It's my go-to study spot in Greater Noida. Love the warm and cozy vibes.", date: '5 days ago' },
  { name: 'Rohan Das', rating: 4, comment: 'Great Paneer Tikka Wrap! The rating and feedback system is smooth. The Samosa Chaat is very flavorful.', date: '1 week ago' }
];

// Seed Menu Items
const countMenu = db.prepare('SELECT COUNT(*) as count FROM menu_items').get().count;
if (countMenu === 0) {
  const insertMenu = db.prepare(`
    INSERT INTO menu_items (id, name, category, price, rating, time, image, description, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const item of initialMenuItems) {
    insertMenu.run(item.id, item.name, item.category, item.price, item.rating, item.time, item.image, item.description, item.type);
  }
  console.log(`Seeded ${initialMenuItems.length} menu items.`);
}

// Seed Reviews
const countReviews = db.prepare('SELECT COUNT(*) as count FROM reviews').get().count;
if (countReviews === 0) {
  const insertReview = db.prepare(`
    INSERT INTO reviews (name, rating, comment, date)
    VALUES (?, ?, ?, ?)
  `);
  for (const rev of initialReviews) {
    insertReview.run(rev.name, rev.rating, rev.comment, rev.date);
  }
  console.log(`Seeded ${initialReviews.length} initial reviews.`);
}

// --- API ROUTES ---

// 1. Menu Items API
app.get('/api/menu', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM menu_items').all();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu items', details: err.message });
  }
});

// 2. Reviews API
app.get('/api/reviews', (req, res) => {
  try {
    const reviews = db.prepare('SELECT * FROM reviews ORDER BY id DESC').all();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews', details: err.message });
  }
});

app.post('/api/reviews', (req, res) => {
  const { name, rating, comment } = req.body;
  if (!name || !rating || !comment) {
    return res.status(400).json({ error: 'Name, rating, and comment are required' });
  }
  try {
    const stmt = db.prepare(`
      INSERT INTO reviews (name, rating, comment, date)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(name, rating, comment, 'Just now');
    const newReview = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save review', details: err.message });
  }
});

// 3. User Authentication APIs
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  try {
    // Check if user already exists
    const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);

    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, salt)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(name, email, hashedPassword, salt);
    const newUser = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(result.lastInsertRowid);
    const token = generateToken(newUser);

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const hashedPassword = hashPassword(password, user.salt);
    if (hashedPassword !== user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userProfile = { id: user.id, name: user.name, email: user.email };
    const token = generateToken(userProfile);

    res.json({ user: userProfile, token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// Verify active session token
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// 4. Orders APIs
app.post('/api/orders', (req, res) => {
  const { userId, userName, items, total, discount, finalTotal, paymentMethod } = req.body;
  if (!items || !total || finalTotal === undefined || !paymentMethod) {
    return res.status(400).json({ error: 'Missing order details' });
  }
  try {
    const stmt = db.prepare(`
      INSERT INTO orders (user_id, user_name, items, total, discount, final_total, payment_method)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(userId || null, userName || 'Guest', JSON.stringify(items), total, discount, finalTotal, paymentMethod);
    res.status(201).json({ message: 'Order placed successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to place order', details: err.message });
  }
});

app.get('/api/orders', authenticateToken, (req, res) => {
  try {
    const userOrders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC').all(req.user.id);
    const parsedOrders = userOrders.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }));
    res.json(parsedOrders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order history', details: err.message });
  }
});

// 5. Reservations APIs
app.post('/api/reservations', (req, res) => {
  const { name, email, date, time, guests, notes } = req.body;
  if (!name || !email || !date || !time || !guests) {
    return res.status(400).json({ error: 'Missing reservation details' });
  }
  try {
    const stmt = db.prepare(`
      INSERT INTO reservations (name, email, date, time, guests, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(name, email, date, time, guests, notes || '');
    res.status(201).json({ message: 'Table reserved successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to book reservation', details: err.message });
  }
});

app.get('/api/reservations', authenticateToken, (req, res) => {
  try {
    const userReservations = db.prepare('SELECT * FROM reservations WHERE email = ? ORDER BY id DESC').all(req.user.email);
    res.json(userReservations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reservations', details: err.message });
  }
});

// Serve frontend in production environment
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*all', (req, res) => {
    // Only serve index.html for page routes (not /api)
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    } else {
      res.status(404).json({ error: 'API route not found' });
    }
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
