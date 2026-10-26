# ZOX — Premium Clothing Sales & Rental Management System

A production-ready full-stack store management system built for **ZOX**, an offline clothing store that sells clothing and rents premium suits and dresses.

The system is designed for fast offline transaction recording, accurate invoicing, WhatsApp click-to-chat delivery, and automatic return date tracking based on the **Asia/Kolkata** time zone.

---

## 🎨 Premium Design System

Inspired by luxury fashion brands and modern business suites:
- **Obsidian Black (`#0A0A0A`)**: High-contrast brand headers and focused accents.
- **Charcoal (`#171717`)**: Structured navigation sidebar, drawer, and dark controls.
- **Warm Off-White (`#F5F3EE` / `#FAF8F5`)**: Readable, light transaction workspace for rapid data entry without eye fatigue.
- **Champagne Gold (`#C6AD83`)**: Elegant highlights, active indicators, and action triggers.
- **Muted Grey (`#A3A3A3`)**: Subtle secondary metadata and borders.
- **Typography:** Refined serifs (*Cormorant Garamond*) paired with architectural sans-serifs (*Plus Jakarta Sans* & *Montserrat*).

---

## 🚀 Key Modules & Capabilities

### 1. Main Dashboard
- **Store Welcome Header:** "Welcome to ZOX" — "Manage your sales, rentals, invoices, and customer returns."
- **Four Compact Statistics:**
  1. **Today's Sales:** Total amount and payments received today.
  2. **Active Rentals:** Suits and dresses currently out with clients.
  3. **Returns Due Today:** Clothing scheduled for return today (amber highlighted).
  4. **Pending Rental Returns:** Overdue unreturned garments (red alert badge).
- **Today's Important Activities List:**
  - Priority action banners for Overdue Returns and Returns Due Today with one-click WhatsApp reminder triggers.
  - Recent offline rentals with customer, duration, and status.
  - Recent in-store clothing sales with purchased items and payment status.
  - Recent invoices table with quick view links.

### 2. Rentals Module (Suits & Dresses)
- **`+ New Rental` Fast Entry:**
  - **Customer Details:** Customer name, mobile number with country code, optional address. Auto-populates existing customer profile when typing mobile number.
  - **Clothing Details:** Dress/suit name, category (Suit, Tuxedo, 3-Piece, Blazer, Dress, Ethnic), size, quantity, rental price, security deposit, and additional charges. Fast pick dropdown from store catalog.
  - **Rental Period:** Start date (defaults to today in Kolkata time), expected return date (calendar picker). Validates return date $\ge$ start date and automatically calculates rental duration in days.
  - **Payment Details:** Total rental amount, amount paid, pending amount ($= \text{Total} - \text{Paid}$), refundable security deposit (kept strictly separate from rental revenue), payment method (Cash, UPI, Card, Net Banking). Allows partial payments.
  - **Three Direct Actions:**
    1. *Save Rental*
    2. *Save & Generate Invoice*
    3. *Save & Send Invoice on WhatsApp*

### 3. Return Reminders (Dedicated Tracking Page)
- **Automatic Due-Date Detection (Asia/Kolkata):**
  - **Due Today:** Amber highlight with days remaining $= 0$.
  - **Due Tomorrow:** Friendly reminder stage.
  - **Upcoming Returns:** Scheduled future returns.
  - **Overdue Returns:** Restrained red indicator with overdue days counter.
  - **Returned:** Historical records marked returned.
- **One-Click WhatsApp Reminders:**
  - Generates personalized WhatsApp click-to-chat links:
    - *Due Today / Friendly:* `"Hello [Customer Name], this is ZOX. This is a friendly reminder that your rented [Suit/Dress Name] is due to be returned on [Return Date]. Please contact us if you need any assistance. Thank you for choosing ZOX."`
    - *Overdue Alert:* `"Hello [Customer Name], this is ZOX. Our records show that your rented [Suit/Dress Name] was due for return on [Return Date]. Please contact us to arrange its return. Thank you."`
- **Return Confirmation Dialog:**
  - Click **"Mark as Returned"** to record: Actual return date, clothing condition (Good, Minor cleaning needed, Alteration required, Damaged), damage/cleaning notes, approved additional charges, security deposit settlement (Full Refund, Retain/Forfeit, Partial).
  - Once confirmed, marked as *Returned* and automatically removed from outstanding lists.

### 4. Buyers Module (Offline Clothing Sales)
- **`+ New Sale` Fast Entry:**
  - **Customer Details:** Customer name, mobile number with country code, optional address.
  - **Multi-Item Line Entry:** Add multiple products to the same invoice.
  - **Separate Original Price & Offer Price:**
    - Product name, category, size, quantity.
    - Original price vs. Offer price.
    - Automatic discount calculation: $\text{Discount} = (\text{Original Price} - \text{Offer Price}) \times \text{Quantity}$.
    - Automatic line total: $\text{Line Total} = \text{Offer Price} \times \text{Quantity}$.
  - **Payment Details:**
    - Final invoice amount, amount received, pending balance ($= \text{Final} - \text{Received}$), payment method.
    - Status badges: *Paid*, *Partially Paid*, *Pending*.
  - **Three Direct Actions:**
    1. *Save Sale*
    2. *Save & Generate Invoice*
    3. *Save & Send Invoice on WhatsApp*

### 5. Reusable Invoice System
- Safe sequential unique invoice numbers:
  - Rentals: `ZOX-RENT-0001`, `ZOX-RENT-0002`...
  - Sales: `ZOX-SALE-0001`, `ZOX-SALE-0002`...
- **Professional Invoice Sheet:**
  - ZOX wordmark and store contact info.
  - Invoice #, invoice date, and customer details.
  - Itemized table with original price, offer price, discount, and line total.
  - Clearly distinguishes rental charges from refundable security deposit.
  - Payment summary: amount paid, remaining balance, and thank-you footer.
  - Printable layout (`window.print()` / PDF export).
  - WhatsApp share button with status tracker (*Invoice Generated* $\rightarrow$ *WhatsApp Opened* $\rightarrow$ *Confirmed Shared*).

### 6. Customer Management
- Shared customer database across physical rentals and clothing sales.
- Profile view displaying: Previous purchases, previous rentals, invoice history, outstanding balances, and rental return history.
- Add customer or edit customer records.
- Direct WhatsApp chat link.

### 7. Settings & Configuration
- Store name, store address, contact number, WhatsApp number, store email.
- Currency symbol (default `₹`).
- Time zone (default `Asia/Kolkata`).
- Invoice prefix format (`ZOX-RENT` and `ZOX-SALE`).
- Invoice footer text and return policy.
- Customizable WhatsApp reminder message templates.

---

## 💻 Tech Stack & Architecture

- **Backend:** Node.js, Express, pure-JS persistent database (`zox_store.json`) with atomic sync writes and thread-safe sequential invoice counters.
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, Date-fns.
- **Port:** Unified server running on port `5000` (serves both REST API and React client).

---

## 🏃 Running the Application

### 1. Unified Server (Recommended)
```bash
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

### 2. Development Mode
```bash
# Terminal 1: Backend API
npm run dev:server

# Terminal 2: Vite Client (Port 3000)
npm run dev:client
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Staff Access
- **Default PIN:** `8888` (or click the one-click quick unlock button).
- **Username / Password:** `admin` / `zox@admin2024`.
- Change credentials or store details anytime in **Settings**.
