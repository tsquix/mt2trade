# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Metin2 Trading Marketplace Platform** built with Next.js 15. It enables buying/selling in-game currency and items with features including:
- User authentication with NextAuth (credentials-based)
- Marketplace for creating/managing offers (traditional + Discord-scraped offers)
- Real-time order management with Socket.io
- Admin panel for content/user management
- AWS S3 file uploads
- Web Push notifications
- Support ticket system

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Development server (Next.js with Turbopack)
npm run dev
# Runs on http://localhost:3000

# Socket.io server (MUST run separately for real-time features)
node server.js
# Runs on http://localhost:4001

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint

# Format code
npm run format

# Mock JSON server (if needed)
npm run json-server

# Code Review Agent (AI-powered code analysis)
npm run review <file-path>
# Example: npm run review src/pages/api/offer.js
```

### Key Development Notes
- **Two servers required**: Next.js dev server (port 3000) + Socket.io server (port 4001)
- Socket.io server must be running for real-time order updates to work
- Uses Turbopack for faster dev builds

### Code Review Agent
This project includes an AI-powered code review agent built with Anthropic Claude API:
- **Usage**: `node review-agent.js <file-path>` or `npm run review <file-path>`
- **Features**: Detects bugs, security issues, anti-patterns, suggests optimizations and refactoring
- **Requirements**: Set `ANTHROPIC_API_KEY` in `.env` (get from https://console.anthropic.com/)
- **Documentation**: See `README-AGENT.md` for full documentation
- **Model**: Uses Claude 3.5 Sonnet for comprehensive code analysis

## Architecture Overview

### Technology Stack
- **Frontend**: Next.js 15.5 (Pages Router), React 18, TailwindCSS
- **Backend**: Next.js API routes
- **Database**: MongoDB 6.11 with Mongoose ODM
- **Real-time**: Socket.io 4.8 (separate server on port 4001)
- **Auth**: NextAuth 4.24 with Credentials provider + bcryptjs
- **File Storage**: AWS S3 (bucket: `mt2trade`, region: `eu-north-1`)
- **Notifications**: Web Push API

### Directory Structure
```
src/
├── pages/
│   ├── api/                    # API routes
│   │   ├── auth/[...nextauth].ts   # NextAuth config + admin helpers
│   │   ├── offer.js                # Offer CRUD
│   │   ├── buyOrder.js             # Order management + notifications
│   │   ├── dcOffers.js             # Discord offers management
│   │   ├── server.js               # Server CRUD (admin)
│   │   ├── upload.js               # S3 file uploads
│   │   ├── user/                   # User endpoints
│   │   ├── messages.js             # Contact form
│   │   ├── ticket.js               # Support tickets
│   │   └── admin/                  # Admin-only endpoints
│   ├── admin/                  # Admin pages (role-protected)
│   ├── marketplace/            # Public marketplace pages
│   ├── orders/                 # User order management
│   ├── profile/                # User profiles
│   ├── login.js / sign-up.js
│   └── _app.js                 # SessionProvider wrapper
├── components/                 # React components
│   ├── layout/                 # Layout, Header, Footer, AdminNav
│   ├── marketplace/            # Marketplace-specific components
│   ├── orders/                 # Order display components
│   └── ui/                     # Reusable UI components
├── contexts/                   # React Context
│   ├── OrdersContext.js        # Order state + Socket.io integration
│   └── OffersContext.js        # Offers state
└── notification/               # Push notification utilities

models/                         # Mongoose schemas
├── User.ts                     # User + login history + pushSubscription
├── Offer.js                    # Traditional marketplace offers
├── BuyOrder.js                 # Purchase orders
├── DcOffer.js                  # Discord-scraped offers (complex schema)
├── Server.js                   # Game servers
├── Message.js                  # Contact messages
└── Ticket.js                   # Support tickets

lib/                            # Utilities
├── mongoose.js                 # MongoDB connection (singleton pattern)
├── adminAuth.js                # requireAdminAuth() page-level helper
├── offers.js                   # Offer counting utilities
└── fetchServers.ts             # Server list fetching

server.js                       # Socket.io server (port 4001)
public/
├── socket.js                   # Socket.io client config
├── push.js                     # Push notification initialization
└── sw.js                       # Service worker
```

## Authentication System

**Location**: `src/pages/api/auth/[...nextauth].ts`

### Implementation Details
- **Provider**: Credentials (email/password)
- **Password Hashing**: bcryptjs with 10 salt rounds
- **Session**: JWT-based with custom callbacks
- **Login Tracking**: Records IP, browser, timestamp, geolocation (ip-api.com), device type
- **Admin Check**: Role-based (`user.role === 'admin'`)

### Key Functions
- `authorize()`: Validates credentials, tracks login history
- `isAdminRequest()`: API-level admin authorization check
- JWT callback: Injects `user.id` and `user.role` into token
- Session callback: Passes token data to session object

### Registration Flow
- Endpoint: `POST /api/register`
- Validates unique email/username
- Hashes password with bcryptjs
- Creates User document in MongoDB

## Database Models & Relationships

### User.ts
```typescript
{
  name: string (unique)
  email: string (unique)
  password: string (hashed)
  role: 'user' | 'admin'
  userRating: number (0-5)
  ratingCount: number
  transactionCount: number
  prefPayment: 'BLIK' | 'przelew' | 'revolut' | 'paypal'
  verified: boolean (manual admin verification)
  avatar: string (S3 URL)
  pushSubscription: { endpoint, keys: { p256dh, auth } }
  loginHistory: [{ ip, browser, timestamp, success, location, deviceType }]
  sensData: { ipHistory: string[] }
  createdAt: Date
}
```

### Offer.js (Traditional marketplace)
```javascript
{
  seller: ObjectId (ref User)
  serverName: string
  currencyAmount: number
  currencyType: string
  pricePLN: number
  title: string
  slug: string (unique, auto-generated)
  description: string
  createdAt/updatedAt: Date
}
```

**Slug Generation Logic**:
1. Base: lowercase, trim, replace spaces/underscores with hyphens
2. If exists: append last 4 digits of timestamp
3. If still exists (after 10 attempts): append 6-digit timestamp + random number

### BuyOrder.js (Purchase orders)
```javascript
{
  offer: ObjectId (ref Offer)
  buyer: ObjectId (ref User)
  seller: ObjectId (ref User)
  currencyAmount: number
  orderStatus: 'pending' | 'accepted' | 'rejected' | 'finalized'
  rated: 'yes' | 'reported' | 'no' | 'skipped'
  currencyUpdated: boolean
  seen: boolean
  createdAt: Date
}
```

### DcOffer.js (Discord-scraped offers)
```javascript
{
  id: string (unique)
  serverName: string
  serverId: ObjectId (ref Server)
  thread: {
    name: string
    tags: string[]
    createdAt: Date
    owner: { id, name, displayName, bot, avatar }
  }
  starterMessage: { content, editedAt }
  messageCount: number
  ownerMessages: [{ id, content, timestamp, editedAt, attachments }]
  status: 'active' | 'sold' | 'closed' | 'archived'
  isActive: boolean
  lastActivity/createdAt/scrapedAt: Date
}
```

**Virtual Properties**:
- `title` → `thread.name`
- `seller` → `thread.owner`

**Instance Methods**:
- `markAsSold()`, `updateActivity()`

**Static Methods**:
- `getRecentOffers(limit)`
- `getOffersBySeller(sellerId)`
- `getOffersByTag(tagName)`
- `getOffersByServer(serverName)`
- `searchOffers(searchText)` - regex search on title/content

**Indexes**: lastActivity, thread.owner.id, thread.tags.name, status, serverName

### Server.js
```javascript
{
  name: string (required)
  slug: string (required)
  nameAlias: string[] (alternative names)
  img: string (URL)
}
```

### Message.js (Contact form)
```javascript
{
  email: string
  topic: string
  message: string
  createdAt: Date
}
```

### Ticket.js (Support tickets)
```javascript
{
  buyOrder: ObjectId (ref BuyOrder, required)
  description: string
  images: string[] (S3 URLs)
  createdAt: Date
}
```

### Data Relationships
```
User
├── owns many Offer (seller field)
├── creates many BuyOrder (buyer/seller fields)
└── has pushSubscription for notifications

Offer
├── references User (seller)
└── referenced by many BuyOrder

BuyOrder
├── references Offer
├── references User (buyer & seller)
└── referenced by Ticket

Server
└── referenced by DcOffer

DcOffer
└── references Server (optional)

Ticket
└── references BuyOrder
```

## API Routes

### Authentication
- `POST /api/register` - User registration

### Offers
- `GET /api/offer?server=X&userId=Y` - Fetch offers (optional filters)
- `POST /api/offer` - Create offer (auto-generates unique slug)
- `PUT /api/offer` - Update offer currency or full data
- `GET /api/dcOffers?server=X` - Fetch Discord offers
- `DELETE /api/dcOffers?id=X` - Delete DC offer(s) (admin)

### Orders
- `GET /api/buyOrder` - Fetch user's buy/sell orders
- `POST /api/buyOrder` - Create order (triggers push notification to seller)
- `PUT /api/buyOrder` - Update order status/flags
- `DELETE /api/buyOrder` - Delete order

### Servers
- `GET /api/server?id=X` - Fetch all servers or by ID
- `POST /api/server` - Create server (admin only)
- `PUT /api/server` - Full update (admin only)
- `PATCH /api/server` - Partial update (admin only)
- `DELETE /api/server` - Delete server (admin only)

### File Upload
- `POST /api/upload` - Upload to S3 (multipart form)
  - Uses `multiparty` for parsing
  - Uploads to `mt2trade` bucket in `eu-north-1`
  - Returns array of public S3 URLs
  - Used for: ticket images, user avatars

### Users
- `GET /api/user` - List all users (lightweight: _id, name, avatar)
- `GET /api/user/[username]` - Get user profile
- `GET /api/admin/users` - Get all users with full data (admin only)
- `DELETE /api/admin/users?userId=X` - Delete user (admin only)

### Messages & Tickets
- `GET /api/messages` - Fetch contact messages
- `POST /api/messages` - Submit contact form
- `DELETE /api/messages?id=X` - Delete message
- `GET /api/ticket` - Fetch support tickets (populated with buyOrder/users)
- `POST /api/ticket` - Create support ticket
- `DELETE /api/ticket?id=X` - Delete ticket

### Push Notifications
- `POST /api/push-subscription` - Save Web Push subscription
- `POST /api/send-notification` - Send push notification

## Real-Time Features (Socket.io)

**Server**: `server.js` (port 4001)
**Client**: `public/socket.js`

### Setup
```javascript
// Server
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

// Client
export const socket = io('http://localhost:4001', { autoConnect: false });
```

### Events
1. **`join-order-room`** - Client joins rooms for multiple order IDs
2. **`new-purchase-request`** - Broadcast new order to seller's room
3. **`order-status-updated`** - Emit order status changes to orderId room
4. **`disconnect`** - Handle client disconnect

### Integration
- `OrdersContext.js` emits Socket events on status changes
- Components listen for `order-updated` and `new-purchase` events
- Used for real-time order notifications between buyers/sellers

## Admin Authorization Pattern

### Page-Level Protection
```javascript
// lib/adminAuth.js
import { requireAdminAuth } from '@/lib/adminAuth';

export const getServerSideProps = requireAdminAuth(async (context) => {
  // Your page logic here
});
```

### API-Level Protection
```javascript
// src/pages/api/auth/[...nextauth].ts
import { isAdminRequest } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req, res) {
  const adminCheck = await isAdminRequest(req);
  if (!adminCheck.isAdmin) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  // Admin-only logic
}
```

### Role Checking
- User model stores `role: 'user' | 'admin'`
- Session includes `session.user.role`
- JWT token includes `token.role`

## State Management (React Context)

### OrdersContext (`src/contexts/OrdersContext.js`)
**State**:
```javascript
{
  view: 'buy' | 'sell',
  orders: { buyOrders: [], sellOrders: [] },
  pendingOffers: { buyOffersId: [], sellOffersId: [] },
  userOffers: [],
  serverOffers: [],
  selectedOffer: {},
  isLoading: boolean,
  isOfferSold: boolean
}
```

**Key Functions**:
- `handleStatusChange(status, orderId)` - Updates order status via API + emits Socket event
- `handleUpdateOffer(order)` - Deducts currency from offer when order accepted
- `deleteOrder(orderId)` - Removes order
- `fetchBuyOrders()` - Gets user's buy/sell orders
- `fetchUserOffers()` - Gets user's created offers
- `fetchServerOffers(server)` - Gets offers for specific server

**Socket Integration**: Listens for `order-updated` events and updates state

### OffersContext (`src/contexts/OffersContext.js`)
Simple state for offer lists with pagination (`visibleCount: 3`)

## Key Business Logic Patterns

### Order Workflow
1. **Creation**: `POST /api/buyOrder` → creates BuyOrder → sends push notification to seller
2. **Status Flow**: `pending` → `accepted`/`rejected` → `finalized`
3. **Currency Update**: When order accepted, `currencyAmount` deducted from Offer
4. **Real-time Updates**: Status changes emit Socket.io events to both parties
5. **Rating**: After finalization, buyer can rate (`rated: 'yes' | 'reported' | 'no' | 'skipped'`)

### Offer Management
1. **Slug Generation**: Unique slug auto-generated (see "Slug Generation Logic" above)
2. **Currency Tracking**: When BuyOrder created, offer's `currencyAmount` decremented
3. **Seller Authorization**: Only offer creator can update their offers

### Discord Offers (dcOffers)
- Scraped from Discord threads (external system)
- Rich metadata: thread info, owner, messages, attachments
- Multiple search capabilities: by server, tags, seller, regex text search
- Status tracking: active/sold/closed/archived

### Support Tickets
- Associated with specific BuyOrder
- Includes multiple images (uploaded to S3)
- Admin reviews in `/admin/ticket` page

## Environment Variables

Required in `.env`:
```bash
NEXTAUTH_URL=http://localhost:3000
BASE_URL=http://localhost:3000
NEXTAUTH_SECRET=<JWT secret>
MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<Web Push public key>
VAPID_PRIVATE_KEY=<Web Push private key>
S3_ACCESS_KEY=<AWS access key>
S3_SECRET_ACCESS_KEY=<AWS secret>
```

## Database Connection

**Location**: `lib/mongoose.js`

### Pattern: Singleton with Ready State Check
```javascript
let isConnected = false;

export async function connectMongoDB() {
  if (isConnected) {
    console.log('Already connected to MongoDB');
    return;
  }
  // Connect with 15s timeout
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 15000
  });
  isConnected = mongoose.connection.readyState === 1;
}
```

**Important**: Always call `connectMongoDB()` before database operations in API routes to ensure connection in serverless environment.

## Styling

### TailwindCSS Configuration
- Custom colors: `mainBg`, `brighterBg`, `darkGreen`, `lightGreen`, `lightGray`
- Custom animations: fade-in variants, slide animations, reveal animations
- Animation delay utilities: `.animation-delay-{0-3900}`
- Fluid spacing: `clamp(1rem, 4vw, 11rem)`

### Image Optimization
Next.js image domains configured in `next.config.mjs` for:
- S3 bucket: `mt2trade.s3.amazonaws.com`, `mt2trade.s3.eu-north-1.amazonaws.com`
- External sources: imgur, unsplash, google, etc.

## Common Development Tasks

### Adding a New Offer Type
1. Create Mongoose schema in `models/`
2. Add API route in `src/pages/api/`
3. Create context provider in `src/contexts/` if complex state needed
4. Build UI components in `src/components/`
5. Add pages in `src/pages/marketplace/`

### Adding Admin Feature
1. Create API endpoint with `isAdminRequest()` check
2. Add page in `src/pages/admin/` with `requireAdminAuth()` wrapper
3. Update `AdminNav` component if needed

### Debugging Real-Time Issues
1. Verify Socket.io server is running on port 4001
2. Check browser console for Socket connection status
3. Check `server.js` console logs for room joins/events
4. Verify `OrdersContext` is emitting correct events

### Working with S3 Uploads
1. Files uploaded via `POST /api/upload`
2. Uses `multiparty` for multipart form parsing
3. Returns array of public S3 URLs: `https://mt2trade.s3.amazonaws.com/{filename}`
4. Filename format: `{Date.now()}.{extension}`
5. ACL set to `public-read`

## Testing Notes

### Manual Testing Checklist
- User registration/login flow
- Offer creation with slug uniqueness
- Order creation with push notifications
- Real-time order updates (requires Socket.io server)
- Admin CRUD operations with role checks
- File uploads to S3
- Discord offer search/filtering

### Key Edge Cases
- Slug collision handling (retries with timestamps)
- Offer currency reaching zero
- Concurrent order updates
- Socket.io reconnection
- MongoDB connection in serverless environment (singleton pattern)
