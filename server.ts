import express from 'express';
import crypto from 'crypto';
import path from 'path';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_BESPOKE_REQUESTS, DEFAULT_BRANDING_IMAGES, MOCK_CONTACT_MESSAGES, DEFAULT_STUDIO_CATEGORIES, MOCK_STUDIO_IMAGES, CURRENCY_RATES } from './src/data/mockData';
import { Product, Order, BespokeRequest, BrandingImages, ContactMessage, StudioCategory, StudioImage } from './src/types';

const app = express();
const PORT = 3000;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

export interface AdminUserRecord {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'Super Admin' | 'Store Manager' | 'Inventory Specialist' | 'Customer Support';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLoginAt?: string;
  passwordHash: string;
  securityQuestion?: string;
  securityAnswerHash?: string;
}

// In-memory admin user store initialized with default super admin
let adminUsersDb: AdminUserRecord[] = [
  {
    id: 'adm-01',
    username: ADMIN_USERNAME.toLowerCase(),
    email: 'admin@yaredtibeb.com',
    fullName: 'Yared Studio Administrator',
    role: 'Super Admin',
    status: 'active',
    createdAt: new Date().toISOString(),
    passwordHash: bcrypt.hashSync(ADMIN_PASSWORD, 10),
    securityQuestion: 'What is the founding heritage city of Yared Tibeb?',
    securityAnswerHash: bcrypt.hashSync('gondar', 10)
  }
];

interface AdminSessionInfo {
  userId: string;
  expiresAt: number;
}
const adminSessions = new Map<string, AdminSessionInfo>();

function parseCookies(req: express.Request): Record<string, string> {
  const header = req.headers.cookie || '';
  return header.split(';').reduce<Record<string, string>>((acc, part) => {
    const [rawName, ...rawValue] = part.split('=');
    const name = rawName?.trim();
    if (!name) return acc;
    acc[name] = decodeURIComponent(rawValue.join('=') || '');
    return acc;
  }, {});
}

function getAuthenticatedAdminUser(req: express.Request): AdminUserRecord | null {
  const cookies = parseCookies(req);
  let token = cookies.admin_session;

  // Also allow Bearer token header if present
  const authHeader = req.headers.authorization;
  if (!token && authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token) return null;

  const session = adminSessions.get(token);
  if (!session) return null;

  if (session.expiresAt < Date.now()) {
    adminSessions.delete(token);
    return null;
  }

  const user = adminUsersDb.find(u => u.id === session.userId);
  if (!user || user.status !== 'active') return null;

  return user;
}

function isAdminAuthenticated(req: express.Request): boolean {
  return getAuthenticatedAdminUser(req) !== null;
}

function createAdminSession(res: express.Response, userId: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  adminSessions.set(token, { userId, expiresAt: Date.now() + ADMIN_SESSION_TTL_MS });
  res.setHeader('Set-Cookie', [
    `admin_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(ADMIN_SESSION_TTL_MS / 1000)}`
  ]);
  return token;
}

function sanitizeAdminUser(u: AdminUserRecord) {
  const { passwordHash, securityAnswerHash, ...safeUser } = u;
  return safeUser;
}

function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const requestPath = req.path || '';

  // Public authentication endpoints
  if (
    requestPath === '/admin/login' ||
    requestPath === '/api/admin/login' ||
    requestPath === '/api/admin/logout' ||
    requestPath === '/api/admin/me' ||
    requestPath.startsWith('/api/admin/forgot-password')
  ) {
    return next();
  }

  if (isAdminAuthenticated(req)) {
    return next();
  }

  if (requestPath.startsWith('/api/admin')) {
    return res.status(401).json({ error: 'Admin authentication required.' });
  }

  if (requestPath.startsWith('/admin')) {
    // Pass to SPA router so React renders the luxury Admin Login screen
    return next();
  }

  if (requestPath.startsWith('/api/products')) {
    if (req.method === 'GET') return next();
    return res.status(401).json({ error: 'Admin authentication required.' });
  }

  if (requestPath.startsWith('/api/orders')) {
    if (req.method === 'GET' || req.method === 'POST') return next();
    return res.status(401).json({ error: 'Admin authentication required.' });
  }

  if (requestPath.startsWith('/api/bespoke-fittings')) {
    if (req.method === 'GET' || req.method === 'POST') return next();
    return res.status(401).json({ error: 'Admin authentication required.' });
  }

  if (requestPath.startsWith('/api/contact-messages')) {
    if (req.method === 'POST') return next();
    return res.status(401).json({ error: 'Admin authentication required.' });
  }

  if (requestPath.startsWith('/api/studio')) {
    if (req.method !== 'GET') {
      return res.status(401).json({ error: 'Admin authentication required.' });
    }

    if (req.query.includeHidden === 'true') {
      return res.status(401).json({ error: 'Admin authentication required.' });
    }

    return next();
  }

  return next();
}

app.use(requireAdminAuth);

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// In-memory data state initialized with mock records
let productsDb: Product[] = [...MOCK_PRODUCTS];
let ordersDb: Order[] = [...MOCK_ORDERS];
let bespokeDb: BespokeRequest[] = [...MOCK_BESPOKE_REQUESTS];
let brandingDb: BrandingImages = { ...DEFAULT_BRANDING_IMAGES };
let contactMessagesDb: ContactMessage[] = [...MOCK_CONTACT_MESSAGES];
let studioCategoriesDb: StudioCategory[] = [...DEFAULT_STUDIO_CATEGORIES];
let studioImagesDb: StudioImage[] = [...MOCK_STUDIO_IMAGES];
let currencyRatesDb = { ...CURRENCY_RATES };

// ==================== ADMIN AUTH ROUTES ==================== //

// Check current admin user session
app.get('/api/admin/me', (req, res) => {
  const user = getAuthenticatedAdminUser(req);
  if (!user) {
    return res.status(401).json({ authenticated: false, error: 'Not authenticated' });
  }

  return res.json({
    authenticated: true,
    user: sanitizeAdminUser(user)
  });
});

// Admin Login endpoint
app.post('/api/admin/login', (req, res) => {
  const usernameOrEmail = String(req.body?.username || req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '').trim();

  if (!usernameOrEmail || !password) {
    if (req.accepts('json')) {
      return res.status(400).json({ error: 'Please enter both username/email and password.' });
    }
    return res.redirect('/admin/login');
  }

  // Look up user by username or email
  const user = adminUsersDb.find(u => 
    u.username.toLowerCase() === usernameOrEmail || u.email.toLowerCase() === usernameOrEmail
  );

  if (!user) {
    if (req.accepts('json')) {
      return res.status(401).json({ error: 'Invalid username/email or password.' });
    }
    return res.status(401).type('html').send(`<!DOCTYPE html><html><body><h1>Invalid credentials</h1><p><a href="/admin">Try again</a></p></body></html>`);
  }

  if (user.status !== 'active') {
    if (req.accepts('json')) {
      return res.status(403).json({ error: 'This admin account is currently deactivated.' });
    }
    return res.status(403).type('html').send(`<!DOCTYPE html><html><body><h1>Account Deactivated</h1><p>Contact system administrator.</p></body></html>`);
  }

  // Verify password using bcrypt
  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    if (req.accepts('json')) {
      return res.status(401).json({ error: 'Invalid username/email or password.' });
    }
    return res.status(401).type('html').send(`<!DOCTYPE html><html><body><h1>Invalid credentials</h1><p><a href="/admin">Try again</a></p></body></html>`);
  }

  // Update last login
  user.lastLoginAt = new Date().toISOString();

  // Create session token and cookie
  const token = createAdminSession(res, user.id);

  if (req.accepts('json')) {
    return res.json({
      message: 'Login successful',
      token,
      user: sanitizeAdminUser(user)
    });
  }

  return res.redirect('/admin');
});

// Admin Logout endpoint
app.post('/api/admin/logout', (req, res) => {
  const cookies = parseCookies(req);
  const token = cookies.admin_session;
  if (token) adminSessions.delete(token);

  res.setHeader('Set-Cookie', ['admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0']);
  res.json({ message: 'Logged out successfully' });
});

// Initiate Forgot Password (lookup security question)
app.post('/api/admin/forgot-password/initiate', (req, res) => {
  const usernameOrEmail = String(req.body?.usernameOrEmail || '').trim().toLowerCase();

  if (!usernameOrEmail) {
    return res.status(400).json({ error: 'Please enter your username or email address.' });
  }

  const user = adminUsersDb.find(u => 
    u.username.toLowerCase() === usernameOrEmail || u.email.toLowerCase() === usernameOrEmail
  );

  if (!user || user.status !== 'active') {
    return res.status(404).json({ success: false, error: 'No active admin account found with those credentials.' });
  }

  return res.json({
    success: true,
    username: user.username,
    securityQuestion: user.securityQuestion || 'What is the founding heritage city of Yared Tibeb?'
  });
});

// Reset Password with Security Answer or Master Code
app.post('/api/admin/forgot-password/reset', (req, res) => {
  const usernameOrEmail = String(req.body?.usernameOrEmail || '').trim().toLowerCase();
  const securityAnswer = String(req.body?.securityAnswer || '').trim().toLowerCase();
  const newPassword = String(req.body?.newPassword || '').trim();

  if (!usernameOrEmail || !securityAnswer || !newPassword) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
  }

  const user = adminUsersDb.find(u => 
    u.username.toLowerCase() === usernameOrEmail || u.email.toLowerCase() === usernameOrEmail
  );

  if (!user || user.status !== 'active') {
    return res.status(404).json({ error: 'Account not found or inactive.' });
  }

  // Master recovery code override
  const isMasterKey = securityAnswer === 'yared-gold-2026' || securityAnswer === 'gondar';
  let isAnswerCorrect = isMasterKey;

  if (!isAnswerCorrect && user.securityAnswerHash) {
    isAnswerCorrect = bcrypt.compareSync(securityAnswer, user.securityAnswerHash);
  }

  if (!isAnswerCorrect) {
    return res.status(401).json({ error: 'Incorrect security verification answer.' });
  }

  // Update password hash
  user.passwordHash = bcrypt.hashSync(newPassword, 10);

  // Clear existing active sessions for this user for security
  for (const [sToken, sInfo] of adminSessions.entries()) {
    if (sInfo.userId === user.id) {
      adminSessions.delete(sToken);
    }
  }

  return res.json({
    success: true,
    message: 'Password reset successfully. Please log in with your new password.'
  });
});

// ==================== ADMIN USER MANAGEMENT ROUTES ==================== //

// Get all admin users
app.get('/api/admin/users', (req, res) => {
  res.json({
    users: adminUsersDb.map(sanitizeAdminUser)
  });
});

// Create new admin user
app.post('/api/admin/users', (req, res) => {
  const username = String(req.body?.username || '').trim().toLowerCase();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const fullName = String(req.body?.fullName || '').trim();
  const role = req.body?.role || 'Store Manager';
  const password = String(req.body?.password || '').trim();
  const securityQuestion = String(req.body?.securityQuestion || 'What is the founding heritage city of Yared Tibeb?').trim();
  const securityAnswer = String(req.body?.securityAnswer || 'Gondar').trim().toLowerCase();

  if (!username || !email || !fullName || !password) {
    return res.status(400).json({ error: 'Username, email, full name, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  // Check duplicate username or email
  if (adminUsersDb.some(u => u.username.toLowerCase() === username)) {
    return res.status(400).json({ error: `Username @${username} is already taken.` });
  }
  if (adminUsersDb.some(u => u.email.toLowerCase() === email)) {
    return res.status(400).json({ error: `Email ${email} is already registered.` });
  }

  const newUser: AdminUserRecord = {
    id: `adm-${Date.now()}`,
    username,
    email,
    fullName,
    role,
    status: 'active',
    createdAt: new Date().toISOString(),
    passwordHash: bcrypt.hashSync(password, 10),
    securityQuestion,
    securityAnswerHash: bcrypt.hashSync(securityAnswer, 10)
  };

  adminUsersDb.push(newUser);

  return res.status(201).json({
    message: 'Admin account created successfully',
    user: sanitizeAdminUser(newUser)
  });
});

// Update admin user profile
app.put('/api/admin/users/:id', (req, res) => {
  const { id } = req.params;
  const user = adminUsersDb.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: 'Admin account not found.' });
  }

  const username = String(req.body?.username || user.username).trim().toLowerCase();
  const email = String(req.body?.email || user.email).trim().toLowerCase();
  const fullName = String(req.body?.fullName || user.fullName).trim();
  const role = req.body?.role || user.role;

  // Check collision
  if (username !== user.username && adminUsersDb.some(u => u.id !== id && u.username.toLowerCase() === username)) {
    return res.status(400).json({ error: `Username @${username} is already taken.` });
  }
  if (email !== user.email && adminUsersDb.some(u => u.id !== id && u.email.toLowerCase() === email)) {
    return res.status(400).json({ error: `Email ${email} is already taken.` });
  }

  user.username = username;
  user.email = email;
  user.fullName = fullName;
  user.role = role;

  return res.json({
    message: 'Admin account updated',
    user: sanitizeAdminUser(user)
  });
});

// Change admin user password
app.put('/api/admin/users/:id/password', (req, res) => {
  const { id } = req.params;
  const newPassword = String(req.body?.newPassword || '').trim();

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const user = adminUsersDb.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'Admin account not found.' });
  }

  user.passwordHash = bcrypt.hashSync(newPassword, 10);

  // Invalidate user sessions
  for (const [sToken, sInfo] of adminSessions.entries()) {
    if (sInfo.userId === user.id) {
      adminSessions.delete(sToken);
    }
  }

  return res.json({
    message: 'Password updated successfully'
  });
});

// Toggle admin user status
app.patch('/api/admin/users/:id/status', (req, res) => {
  const { id } = req.params;
  const currentUser = getAuthenticatedAdminUser(req);

  if (currentUser && currentUser.id === id) {
    return res.status(400).json({ error: 'You cannot deactivate your own logged-in account.' });
  }

  const user = adminUsersDb.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'Admin account not found.' });
  }

  const nextStatus = req.body?.status === 'inactive' ? 'inactive' : 'active';

  // Safeguard: ensure at least 1 active Super Admin remains
  if (nextStatus === 'inactive' && user.role === 'Super Admin') {
    const activeSuperAdmins = adminUsersDb.filter(u => u.status === 'active' && u.role === 'Super Admin' && u.id !== id);
    if (activeSuperAdmins.length === 0) {
      return res.status(400).json({ error: 'Cannot deactivate the sole active Super Admin account.' });
    }
  }

  user.status = nextStatus;

  // Clear sessions if deactivated
  if (nextStatus === 'inactive') {
    for (const [sToken, sInfo] of adminSessions.entries()) {
      if (sInfo.userId === user.id) {
        adminSessions.delete(sToken);
      }
    }
  }

  return res.json({
    message: `Account status set to ${nextStatus}`,
    user: sanitizeAdminUser(user)
  });
});

// Delete admin user
app.delete('/api/admin/users/:id', (req, res) => {
  const { id } = req.params;
  const currentUser = getAuthenticatedAdminUser(req);

  if (currentUser && currentUser.id === id) {
    return res.status(400).json({ error: 'You cannot delete your own logged-in account.' });
  }

  const userIndex = adminUsersDb.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Admin account not found.' });
  }

  const targetUser = adminUsersDb[userIndex];

  // Safeguard: ensure at least 1 active Super Admin remains
  if (targetUser.role === 'Super Admin') {
    const activeSuperAdmins = adminUsersDb.filter(u => u.status === 'active' && u.role === 'Super Admin' && u.id !== id);
    if (activeSuperAdmins.length === 0) {
      return res.status(400).json({ error: 'Cannot delete the sole remaining Super Admin account.' });
    }
  }

  // Clear sessions
  for (const [sToken, sInfo] of adminSessions.entries()) {
    if (sInfo.userId === targetUser.id) {
      adminSessions.delete(sToken);
    }
  }

  adminUsersDb.splice(userIndex, 1);

  return res.json({ message: 'Admin account deleted successfully.' });
});

// ==================== API ENDPOINTS ==================== //

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'Habesha Couture', timestamp: new Date().toISOString() });
});

// GET Branding Images
app.get('/api/branding', (req, res) => {
  try {
    res.json(brandingDb);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve branding' });
  }
});

// PUT Update Branding Images
app.put('/api/branding', (req, res) => {
  try {
    brandingDb = {
      ...brandingDb,
      ...(req.body || {})
    };
    res.json({ message: 'Branding images updated successfully', branding: brandingDb });
  } catch (err) {
    console.error('Error updating branding:', err);
    res.status(500).json({ error: 'Failed to update branding' });
  }
});

// GET Currency Rates
app.get('/api/currency-rates', (req, res) => {
  try {
    res.json(currencyRatesDb);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve currency rates' });
  }
});

// PUT Update Currency Rates
app.put('/api/currency-rates', (req, res) => {
  try {
    currencyRatesDb = {
      ...currencyRatesDb,
      ...(req.body || {})
    };
    res.json({ message: 'Currency rates updated successfully', currencyRates: currencyRatesDb });
  } catch (err) {
    console.error('Error updating currency rates:', err);
    res.status(500).json({ error: 'Failed to update currency rates' });
  }
});

// GET products
app.get('/api/products', (req, res) => {
  const { category, search, featured } = req.query;
  let filtered = [...productsDb];

  const getIsStudio = (p: Product) => Boolean(p.studioCategory && p.studioCategory.trim() !== '') || 
                     (p.collections && (p.collections.includes('studio') || p.collections.includes('studio-only'))) || 
                     p.category === 'studio';
  const getIsLiveshow = (p: Product) => Boolean(p.collections && p.collections.includes('liveshow'));

  if (category && typeof category === 'string' && category !== 'all') {
    const target = category.toLowerCase().replace(/['’\s-]/g, '');
    if (target === 'studio') {
      filtered = filtered.filter(p => getIsStudio(p));
    } else if (target === 'liveshow') {
      filtered = filtered.filter(p => getIsLiveshow(p));
    } else {
      filtered = filtered.filter(p => {
        if (getIsStudio(p) || getIsLiveshow(p)) return false;
        const mainCat = (p.category || '').toLowerCase().replace(/['’\s-]/g, '');
        if (mainCat === target || mainCat.includes(target) || target.includes(mainCat)) return true;
        if (p.collections && Array.isArray(p.collections)) {
          return p.collections.some(c => {
            const norm = c.toLowerCase().replace(/['’\s-]/g, '');
            if (norm === 'liveshow' || norm === 'studio' || norm === 'studioonly') return false;
            return norm === target || norm.includes(target) || target.includes(norm);
          });
        }
        return false;
      });
    }
  } else {
    // Default GET without specific category excludes studio and liveshow
    filtered = filtered.filter(p => !getIsStudio(p) && !getIsLiveshow(p));
  }

  if (featured === 'true') {
    filtered = filtered.filter(p => p.isFeatured);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.amharicName && p.amharicName.includes(q)) ||
      p.description.toLowerCase().includes(q) ||
      p.tibebPattern.toLowerCase().includes(q)
    );
  }

  res.json({ products: filtered, count: filtered.length });
});

// GET product by ID
app.get('/api/products/:id', (req, res) => {
  const product = productsDb.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// POST new product (Admin CRUD)
app.post('/api/products', (req, res) => {
  const isLiveshowUpload = req.body.collections && req.body.collections.includes('liveshow');
  const isStudioUpload = req.body.collections && req.body.collections.includes('studio') || Boolean(req.body.studioCategory);
  
  let finalCollections = req.body.collections && Array.isArray(req.body.collections) && req.body.collections.length > 0 
    ? req.body.collections 
    : [req.body.category || 'wedding'];

  if (isLiveshowUpload) {
    finalCollections = ['liveshow'];
  } else if (isStudioUpload) {
    if (!finalCollections.includes('studio')) finalCollections.push('studio');
    finalCollections = finalCollections.filter((c: string) => c !== 'liveshow');
  } else {
    finalCollections = finalCollections.filter((c: string) => c !== 'studio' && c !== 'liveshow');
  }

  const newProduct: Product = {
    id: `hk-${Date.now()}`,
    name: req.body.name || 'New Custom Kemis',
    amharicName: req.body.amharicName || '',
    category: isLiveshowUpload ? 'wedding' : (req.body.category || 'wedding'),
    collections: finalCollections,
    priceUSD: Number(req.body.priceUSD) || 500,
    originalPriceUSD: req.body.originalPriceUSD ? Number(req.body.originalPriceUSD) : undefined,
    rating: 5.0,
    reviewsCount: 1,
    inStock: true,
    stockQuantity: Number(req.body.stockQuantity) || 10,
    isFeatured: isLiveshowUpload ? true : Boolean(req.body.isFeatured),
    isNewArrival: true,
    isBespokeAvailable: Boolean(req.body.isBespokeAvailable),
    tibebPattern: req.body.tibebPattern || '',
    fabric: req.body.fabric || '',
    weaverRegion: req.body.weaverRegion || '',
    images: req.body.images && req.body.images.length > 0 ? req.body.images : [],
    description: req.body.description || '',
    details: req.body.details || [],
    sizes: req.body.sizes || [],
    colors: req.body.colors || [],
    weavingDays: Number(req.body.weavingDays) || 10,
    studioCategory: isStudioUpload ? (req.body.studioCategory || req.body.category) : ''
  };

  productsDb.unshift(newProduct);
  res.status(201).json({ message: 'Product created successfully', product: newProduct });
});

// PUT update product (Admin CRUD)
app.put('/api/products/:id', (req, res) => {
  const index = productsDb.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const isLiveshowUpload = req.body.collections && req.body.collections.includes('liveshow');
  const isStudioUpload = req.body.collections && req.body.collections.includes('studio') || Boolean(req.body.studioCategory);
  
  let finalCollections = req.body.collections && Array.isArray(req.body.collections) 
    ? req.body.collections 
    : productsDb[index].collections;

  if (isLiveshowUpload) {
    finalCollections = ['liveshow'];
  } else if (isStudioUpload) {
    if (!finalCollections.includes('studio')) finalCollections.push('studio');
    finalCollections = finalCollections.filter((c: string) => c !== 'liveshow');
  } else {
    finalCollections = finalCollections.filter((c: string) => c !== 'studio' && c !== 'liveshow');
  }

  const updated: Product = {
    ...productsDb[index],
    ...req.body,
    collections: finalCollections,
    isFeatured: isLiveshowUpload ? true : (req.body.isFeatured !== undefined ? Boolean(req.body.isFeatured) : productsDb[index].isFeatured),
    studioCategory: isStudioUpload ? (req.body.studioCategory || req.body.category || productsDb[index].studioCategory) : ''
  };

  productsDb[index] = updated;
  res.json({ message: 'Product updated', product: updated });
});

// DELETE product (Admin CRUD)
app.delete('/api/products/:id', (req, res) => {
  productsDb = productsDb.filter(p => p.id !== req.params.id);
  res.json({ message: 'Product deleted' });
});

// GET orders
app.get('/api/orders', (req, res) => {
  res.json({ orders: ordersDb });
});

// POST create order
app.post('/api/orders', (req, res) => {
  const firstName = req.body.firstName || req.body.customerName?.split(' ')[0] || 'Valued';
  const lastName = req.body.lastName || req.body.customerName?.split(' ').slice(1).join(' ') || 'Guest';
  const customerName = req.body.customerName || `${firstName} ${lastName}`.trim();

  const newOrder: Order = {
    id: `YT-ETH-${Math.floor(100000 + Math.random() * 900000)}`,
    firstName,
    lastName,
    customerName,
    companyName: req.body.companyName || '',
    email: req.body.email || 'customer@yaredtibeb.com',
    phone: req.body.phone || '+251 90 000 0000',
    address: req.body.address || 'Addis Ababa',
    apartment: req.body.apartment || '',
    city: req.body.city || 'Addis Ababa',
    postcode: req.body.postcode || '',
    country: req.body.country || 'Ethiopia',
    orderNotes: req.body.orderNotes || '',
    items: req.body.items || [],
    totalUSD: req.body.totalUSD || 0,
    currency: 'ETB',
    totalInCurrency: req.body.totalInCurrency || req.body.totalUSD || 0,
    paymentMethod: req.body.paymentMethod || 'TeleBirr / CBE Birr',
    status: req.body.status || 'Pending',
    createdAt: new Date().toISOString().split('T')[0],
    trackingNumber: `YT-EXP-${Math.floor(100000 + Math.random() * 900000)}`
  };

  // Stock Reduction Logic
  if (Array.isArray(req.body.items)) {
    for (const item of req.body.items) {
      if (item.product?.id) {
        const prod = productsDb.find(p => p.id === item.product.id);
        if (prod) {
          prod.stockQuantity = Math.max(0, prod.stockQuantity - (item.quantity || 1));
          if (prod.stockQuantity === 0) {
            prod.inStock = false;
          }
        }
      }
    }
  }

  ordersDb.unshift(newOrder);
  res.status(201).json({ 
    message: 'Order placed successfully', 
    order: newOrder, 
    updatedProducts: productsDb 
  });
});

// GET single order
app.get('/api/orders/:id', (req, res) => {
  const order = ordersDb.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ order });
});

// PATCH / PUT update order details on backend
app.patch('/api/orders/:id', (req, res) => {
  const index = ordersDb.findIndex(o => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const existingOrder = ordersDb[index];
  const updatedOrder: Order = {
    ...existingOrder,
    ...req.body,
    id: existingOrder.id // Preserve ID
  };

  ordersDb[index] = updatedOrder;
  res.json({ message: 'Order updated successfully', order: updatedOrder });
});

app.put('/api/orders/:id', (req, res) => {
  const index = ordersDb.findIndex(o => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const existingOrder = ordersDb[index];
  const updatedOrder: Order = {
    ...existingOrder,
    ...req.body,
    id: existingOrder.id // Preserve ID
  };

  ordersDb[index] = updatedOrder;
  res.json({ message: 'Order updated successfully', order: updatedOrder });
});

// PATCH / PUT update order status
app.patch('/api/orders/:id/status', (req, res) => {
  const index = ordersDb.findIndex(o => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (req.body.status) {
    ordersDb[index].status = req.body.status;
  }

  res.json({ message: 'Order status updated successfully', order: ordersDb[index] });
});

// GET bespoke fitting requests
app.get('/api/bespoke-fittings', (req, res) => {
  res.json({ requests: bespokeDb });
});

// POST bespoke fitting request
app.post('/api/bespoke-fittings', (req, res) => {
  const newBespoke: BespokeRequest = {
    id: `BSP-2026-${String(bespokeDb.length + 1).padStart(3, '0')}`,
    customerName: req.body.customerName || 'Anonymous',
    email: req.body.email || 'contact@client.com',
    phone: req.body.phone || '',
    garmentType: req.body.garmentType || 'Custom Royal Kemis',
    fabricGrade: req.body.fabricGrade || 'Superfine Hand-spun Cotton',
    tibebPatternColor: req.body.tibebPatternColor || 'Gold & Crimson',
    measurements: req.body.measurements || {
      bustChest: '36 in',
      waist: '28 in',
      hips: '38 in',
      shoulderToFloor: '58 in',
      sleeveLength: '24 in'
    },
    eventDate: req.body.eventDate || '',
    specialNotes: req.body.specialNotes || '',
    status: 'Pending Review',
    createdAt: new Date().toISOString().split('T')[0],
    estimatedCompletion: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignedWeaverId: 'w-1'
  };

  bespokeDb.unshift(newBespoke);
  res.status(201).json({ message: 'Bespoke consultation submitted', request: newBespoke });
});

// PATCH update bespoke fitting status (Admin)
app.patch('/api/bespoke-fittings/:id', (req, res) => {
  const index = bespokeDb.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Request not found' });
  }

  if (req.body.status) bespokeDb[index].status = req.body.status;
  if (req.body.assignedWeaverId) bespokeDb[index].assignedWeaverId = req.body.assignedWeaverId;

  res.json({ message: 'Status updated', request: bespokeDb[index] });
});

// ==================== CONTACT MESSAGES API ==================== //

// GET contact messages
app.get('/api/contact-messages', (req, res) => {
  res.json({ messages: contactMessagesDb });
});

// POST submit new contact message
app.post('/api/contact-messages', (req, res) => {
  const { fullName, subject, email, phone, message } = req.body;
  if (!fullName || !subject || !email || !message) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  const newMessage: ContactMessage = {
    id: `msg-${Date.now()}`,
    fullName: String(fullName).trim(),
    subject: String(subject).trim(),
    email: String(email).trim(),
    phone: phone ? String(phone).trim() : undefined,
    message: String(message).trim(),
    createdAt: new Date().toISOString(),
    read: false
  };

  contactMessagesDb.unshift(newMessage);
  res.status(201).json({ message: 'Contact message submitted successfully', contactMessage: newMessage });
});

// PATCH update contact message read status
app.patch('/api/contact-messages/:id', (req, res) => {
  const msg = contactMessagesDb.find(m => m.id === req.params.id);
  if (!msg) {
    return res.status(404).json({ error: 'Message not found' });
  }

  if (typeof req.body.read === 'boolean') {
    msg.read = req.body.read;
  }

  res.json({ message: 'Contact message updated', contactMessage: msg });
});

// DELETE contact message
app.delete('/api/contact-messages/:id', (req, res) => {
  contactMessagesDb = contactMessagesDb.filter(m => m.id !== req.params.id);
  res.json({ message: 'Contact message deleted successfully' });
});

// ==================== STUDIO GALLERY API ==================== //

// GET Studio Categories
app.get('/api/studio/categories', (req, res) => {
  res.json({ categories: studioCategoriesDb });
});

// POST Create Studio Category
app.post('/api/studio/categories', (req, res) => {
  const { name, description } = req.body;
  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const slug = String(name).toLowerCase().trim().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const existing = studioCategoriesDb.find(c => c.slug === slug || c.name.toLowerCase() === String(name).toLowerCase().trim());
  if (existing) {
    return res.status(400).json({ error: 'Category with this name or slug already exists' });
  }

  const newCat: StudioCategory = {
    id: `sc-${Date.now()}`,
    name: String(name).trim(),
    slug: slug || `cat-${Date.now()}`,
    description: description ? String(description).trim() : ''
  };

  studioCategoriesDb.push(newCat);
  res.status(201).json({ message: 'Studio category created', category: newCat });
});

// PUT Edit Studio Category
app.put('/api/studio/categories/:id', (req, res) => {
  const cat = studioCategoriesDb.find(c => c.id === req.params.id || c.slug === req.params.id);
  if (!cat) {
    return res.status(404).json({ error: 'Studio category not found' });
  }

  if (req.body.name) {
    cat.name = String(req.body.name).trim();
    cat.slug = cat.name.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  if (typeof req.body.description === 'string') {
    cat.description = String(req.body.description).trim();
  }

  res.json({ message: 'Studio category updated', category: cat });
});

// DELETE Studio Category
app.delete('/api/studio/categories/:id', (req, res) => {
  const catId = req.params.id;
  const cat = studioCategoriesDb.find(c => c.id === catId || c.slug === catId);
  if (!cat) {
    return res.status(404).json({ error: 'Studio category not found' });
  }

  const slug = cat.slug;
  studioCategoriesDb = studioCategoriesDb.filter(c => c.id !== catId && c.slug !== catId);

  // Remove category from images or reassign
  studioImagesDb.forEach(img => {
    img.categories = img.categories.filter(c => c !== slug && c !== catId && c !== cat.name.toLowerCase());
    if (img.categories.length === 0) {
      img.categories = ['traditional-dresses'];
    }
  });

  res.json({ message: 'Studio category deleted successfully' });
});

// GET Studio Images
app.get('/api/studio/images', (req, res) => {
  const { category, search, sort, includeHidden } = req.query;
  let filtered = [...studioImagesDb];

  // Filter out hidden images unless includeHidden=true (Admin mode)
  if (includeHidden !== 'true') {
    filtered = filtered.filter(img => !img.isHidden);
  }

  // Filter by category
  if (category && typeof category === 'string' && category !== 'all') {
    const catTarget = category.toLowerCase().trim().replace(/['’\s-]/g, '');
    filtered = filtered.filter(img => {
      if (!img.categories || img.categories.length === 0) return false;
      return img.categories.some(c => {
        const norm = c.toLowerCase().replace(/['’\s-]/g, '');
        return norm === catTarget || norm.includes(catTarget) || catTarget.includes(norm);
      });
    });
  }

  // Filter by search query (Title, Category, Tags)
  if (search && typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(img => {
      const matchTitle = img.title.toLowerCase().includes(q);
      const matchDesc = img.description.toLowerCase().includes(q);
      const matchCats = img.categories.some(c => c.toLowerCase().includes(q));
      const matchTags = img.tags.some(t => t.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchCats || matchTags;
    });
  }

  // Sort menu options: Featured, Newest, Oldest, A-Z
  const sortOption = (sort && typeof sort === 'string') ? sort : 'featured';
  filtered.sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortOption === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortOption === 'a-z' || sortOption === 'title-asc') {
      return a.title.localeCompare(b.title);
    }
    if (sortOption === 'z-a' || sortOption === 'title-desc') {
      return b.title.localeCompare(a.title);
    }
    // Default 'featured': Featured items first, then by orderIndex, then newest
    if (a.isFeatured !== b.isFeatured) {
      return a.isFeatured ? -1 : 1;
    }
    if (a.orderIndex !== b.orderIndex) {
      return a.orderIndex - b.orderIndex;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  res.json({ images: filtered, count: filtered.length });
});

// POST Add new Studio Image
app.post('/api/studio/images', (req, res) => {
  const { title, description, imageUrl, categories, tags, isFeatured, isHidden, orderIndex, productIds } = req.body;
  if (!imageUrl || !title) {
    return res.status(400).json({ error: 'Image URL and Title are required' });
  }

  const parsedCats = Array.isArray(categories) 
    ? categories 
    : (typeof categories === 'string' ? categories.split(',').map(s => s.trim()).filter(Boolean) : ['traditional-dresses']);

  const parsedTags = Array.isArray(tags)
    ? tags
    : (typeof tags === 'string' ? tags.split(',').map(s => s.trim()).filter(Boolean) : []);

  const newImg: StudioImage = {
    id: `st-${Date.now()}`,
    title: String(title).trim(),
    description: description ? String(description).trim() : '',
    imageUrl: String(imageUrl).trim(),
    categories: parsedCats.length > 0 ? parsedCats : ['traditional-dresses'],
    tags: parsedTags,
    isFeatured: Boolean(isFeatured),
    isHidden: Boolean(isHidden),
    orderIndex: typeof orderIndex === 'number' ? orderIndex : studioImagesDb.length + 1,
    createdAt: new Date().toISOString(),
    productIds: Array.isArray(productIds) ? productIds : []
  };

  studioImagesDb.unshift(newImg);
  res.status(201).json({ message: 'Studio image added successfully', image: newImg });
});

// PUT Edit Studio Image
app.put('/api/studio/images/:id', (req, res) => {
  const imgIndex = studioImagesDb.findIndex(i => i.id === req.params.id);
  if (imgIndex === -1) {
    return res.status(404).json({ error: 'Studio image not found' });
  }

  const current = studioImagesDb[imgIndex];
  const { title, description, imageUrl, categories, tags, isFeatured, isHidden, orderIndex, productIds } = req.body;

  const parsedCats = categories !== undefined 
    ? (Array.isArray(categories) ? categories : String(categories).split(',').map(s => s.trim()).filter(Boolean))
    : current.categories;

  const parsedTags = tags !== undefined
    ? (Array.isArray(tags) ? tags : String(tags).split(',').map(s => s.trim()).filter(Boolean))
    : current.tags;

  const updatedImg: StudioImage = {
    ...current,
    title: title !== undefined ? String(title).trim() : current.title,
    description: description !== undefined ? String(description).trim() : current.description,
    imageUrl: imageUrl !== undefined ? String(imageUrl).trim() : current.imageUrl,
    categories: parsedCats,
    tags: parsedTags,
    isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : current.isFeatured,
    isHidden: isHidden !== undefined ? Boolean(isHidden) : current.isHidden,
    orderIndex: typeof orderIndex === 'number' ? orderIndex : current.orderIndex,
    productIds: productIds !== undefined ? (Array.isArray(productIds) ? productIds : []) : current.productIds
  };

  studioImagesDb[imgIndex] = updatedImg;
  res.json({ message: 'Studio image updated successfully', image: updatedImg });
});

// DELETE Studio Image
app.delete('/api/studio/images/:id', (req, res) => {
  const id = req.params.id;
  const initialCount = studioImagesDb.length;
  studioImagesDb = studioImagesDb.filter(i => i.id !== id);
  if (studioImagesDb.length === initialCount) {
    return res.status(404).json({ error: 'Studio image not found' });
  }
  res.json({ message: 'Studio image deleted successfully' });
});

// POST Reorder Studio Images
app.post('/api/studio/images/reorder', (req, res) => {
  const { items } = req.body; // Array of { id: string, orderIndex: number }
  if (Array.isArray(items)) {
    items.forEach(({ id, orderIndex }) => {
      const img = studioImagesDb.find(i => i.id === id);
      if (img && typeof orderIndex === 'number') {
        img.orderIndex = orderIndex;
      }
    });
  }
  res.json({ message: 'Studio images reordered successfully', images: studioImagesDb });
});

// GET Admin Analytics
app.get('/api/admin/analytics', (req, res) => {
  const totalRevUSD = ordersDb.reduce((acc, o) => acc + (o.totalUSD || 0), 0);
  const totalRevETB = ordersDb.reduce((acc, o) => acc + (o.totalInCurrency || o.totalUSD || 0), 0);
  const completedOrdersCount = ordersDb.filter(o => o.status === 'Completed' || o.status === 'Delivered').length;

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyMapUSD: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

  ordersDb.forEach(o => {
    if (o.createdAt) {
      const d = new Date(o.createdAt);
      if (!isNaN(d.getTime())) {
        const dayName = daysOfWeek[d.getDay()];
        weeklyMapUSD[dayName] = (weeklyMapUSD[dayName] || 0) + (o.totalUSD || o.totalInCurrency || 0);
      }
    }
  });

  const weeklyRevenue = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
    day,
    amountUSD: weeklyMapUSD[day] || 0
  }));

  res.json({
    totalRevenueUSD: totalRevUSD,
    totalRevenueETB: totalRevETB,
    totalOrders: ordersDb.length,
    completedOrders: completedOrdersCount,
    pendingBespoke: bespokeDb.filter(b => b.status === 'Pending Review' || b.status === 'Artisan Assigned').length,
    garmentsCount: productsDb.length,
    recentOrders: ordersDb,
    weeklyRevenue
  });
});

// ==================== VITE / STATIC SERVING ==================== //

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Habesha Couture] Server running on http://localhost:${PORT}`);
  });
}

startServer();
