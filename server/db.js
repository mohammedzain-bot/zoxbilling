import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

const INITIAL_SUITS = [
  {
    id: "suit-01",
    title: "The Obsidian Peak Tuxedo",
    subtitle: "Black Tie Signature Edition",
    sku: "ZOX-TX-001",
    category: "Tuxedo",
    occasion: "Black Tie & Gala",
    fit: "Tailored Slim",
    color: "Obsidian Black",
    hexColor: "#090909",
    fabric: "Super 150s Australian Merino Wool & Pure Silk Satin",
    lapel: "Peak Lapel (Silk Satin)",
    pieces: "2-Piece (Jacket & Trouser with Satin Stripe)",
    description: "The pinnacle of formal eveningwear. Handcrafted from Super 150s Australian merino wool with hand-basted silk satin peak lapels. Designed with clean architectural shoulders, a suppressed waist, and jetted pockets for an elongated, statuesque silhouette.",
    editorialQuote: "Architectural perfection crafted for the grandest red carpets and black-tie galas of the world.",
    rentalPricing: {
      "3days": 190,
      "5days": 250,
      "7days": 310
    },
    securityDeposit: 100,
    sizes: [
      { size: "38R", totalStock: 3, availableStock: 2 },
      { size: "40R", totalStock: 5, availableStock: 4 },
      { size: "40L", totalStock: 2, availableStock: 1 },
      { size: "42R", totalStock: 4, availableStock: 3 },
      { size: "44R", totalStock: 3, availableStock: 2 },
      { size: "46L", totalStock: 2, availableStock: 2 }
    ],
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=85"
    ],
    features: [
      "Hand-basted canvas chest piece that molds to your physique",
      "Duchess silk satin lapels and pocket welts",
      "Natural horn buttons with hand-sewn buttonholes",
      "Trousers with side tab adjusters and continuous silk side braid",
      "Breathable Bemberg cupro interior lining"
    ],
    isFeatured: true,
    rating: 4.98,
    reviewsCount: 42
  },
  {
    id: "suit-02",
    title: "The Windsor Royal Navy 3-Piece",
    subtitle: "Heritage Groom & Gala Collection",
    sku: "ZOX-3P-002",
    category: "3-Piece",
    occasion: "Royal Wedding & Groom",
    fit: "Modern Tailored",
    color: "Imperial Midnight Navy",
    hexColor: "#0b1528",
    fabric: "Super 140s Italian Wool Worsted by Vitale Barberis Canonico",
    lapel: "Notch Lapel (High Stance)",
    pieces: "3-Piece (Jacket, Scoop Waistcoat, Flat-Front Trousers)",
    description: "Impeccably tailored for the groom who demands effortless majesty. Includes our signature horseshoe scoop vest that beautifully frames a crisp tie or luxury cravat, finished in rich midnight navy that photographs flawlessly across all lighting conditions.",
    editorialQuote: "A celebration of British tailoring discipline combined with Italian softness and modern contouring.",
    rentalPricing: {
      "3days": 210,
      "5days": 275,
      "7days": 340
    },
    securityDeposit: 100,
    sizes: [
      { size: "38R", totalStock: 3, availableStock: 3 },
      { size: "40R", totalStock: 4, availableStock: 2 },
      { size: "42R", totalStock: 4, availableStock: 3 },
      { size: "44R", totalStock: 2, availableStock: 1 },
      { size: "46R", totalStock: 2, availableStock: 2 }
    ],
    images: [
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=85"
    ],
    features: [
      "Double-breasted horseshoe vest with tonal back buckle",
      "Soft shoulder construction with subtle roped sleeve head",
      "Mother-of-pearl buttons with custom monogram etching",
      "Dual side vents for fluid movement during ceremonies",
      "Crease-resistant high-twist wool weave"
    ],
    isFeatured: true,
    rating: 4.95,
    reviewsCount: 38
  },
  {
    id: "suit-03",
    title: "The Emerald Sovereign Velvet Tuxedo",
    subtitle: "Avant-Garde Eveningwear Edition",
    sku: "ZOX-VL-003",
    category: "Tuxedo",
    occasion: "Red Carpet & Gala",
    fit: "Slim Fit",
    color: "Deep Forest Emerald",
    hexColor: "#08281a",
    fabric: "100% Italian Cotton Velvet with Grosgrain Accents",
    lapel: "Shawl Lapel (Black Grosgrain Silk)",
    pieces: "2-Piece (Velvet Jacket & Obsidian Black Trousers)",
    description: "Designed for those who set the tone of the room. Plush deep emerald Italian velvet captivates under evening chandeliers, framed by a tactile black silk grosgrain shawl collar and accompanied by razor-sharp obsidian trousers.",
    editorialQuote: "Daring luxury that balances commanding confidence with romantic old-world charm.",
    rentalPricing: {
      "3days": 230,
      "5days": 295,
      "7days": 360
    },
    securityDeposit: 120,
    sizes: [
      { size: "38R", totalStock: 2, availableStock: 1 },
      { size: "40R", totalStock: 3, availableStock: 2 },
      { size: "42R", totalStock: 3, availableStock: 2 },
      { size: "44R", totalStock: 2, availableStock: 2 }
    ],
    images: [
      "https://images.unsplash.com/photo-1585914924626-15adac1e6a02?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600091106733-146607bd9b21?auto=format&fit=crop&w=1200&q=85"
    ],
    features: [
      "Heavyweight plush Italian cotton velvet with rich pile depth",
      "Contrasting matte black grosgrain shawl collar",
      "Single-button closure with covered velvet button",
      "Paired with tailored obsidian black wool trousers",
      "Satin-piped interior pockets"
    ],
    isFeatured: true,
    rating: 4.97,
    reviewsCount: 29
  },
  {
    id: "suit-04",
    title: "The Côte d'Azur Ivory Shawl Tuxedo",
    subtitle: "Riviera Summer & Destination Black Tie",
    sku: "ZOX-IV-004",
    category: "Tuxedo",
    occasion: "Royal Wedding & Groom",
    fit: "Tailored Fit",
    color: "Warm Ivory & Obsidian",
    hexColor: "#f7f4ea",
    fabric: "Tropical High-Twist Wool & Mulberry Silk",
    lapel: "Curved Shawl Lapel (Self-Fabric Ivory)",
    pieces: "2-Piece (Ivory Dinner Jacket & Black Barathea Trousers)",
    description: "Classic Hollywood elegance re-engineered for tropical soirées and summer ceremonies. The warm ivory dinner jacket features gentle natural shoulder lines and is paired with midnight black tuxedo trousers.",
    editorialQuote: "Pure Humphrey Bogart in Casablanca, updated with razor-sharp modern silhouettes.",
    rentalPricing: {
      "3days": 200,
      "5days": 260,
      "7days": 320
    },
    securityDeposit: 100,
    sizes: [
      { size: "38R", totalStock: 2, availableStock: 2 },
      { size: "40R", totalStock: 4, availableStock: 3 },
      { size: "42R", totalStock: 3, availableStock: 1 },
      { size: "44R", totalStock: 2, availableStock: 2 }
    ],
    images: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=85"
    ],
    features: [
      "Featherweight tropical wool-silk blend for breathable comfort",
      "Sculpted continuous shawl lapel",
      "Single button front with matched silk thread buttonholes",
      "Black barathea wool trousers with matching satin side stripe",
      "Anti-crease natural fiber composition"
    ],
    isFeatured: true,
    rating: 4.92,
    reviewsCount: 31
  },
  {
    id: "suit-05",
    title: "The Milano Chalkstripe Double-Breasted",
    subtitle: "High-Finance & Evening Power Statement",
    sku: "ZOX-DB-005",
    category: "Double-Breasted",
    occasion: "Corporate Executive",
    fit: "Modern Slim",
    color: "Charcoal Chalkstripe",
    hexColor: "#222222",
    fabric: "Super 130s English Flannel Worsted",
    lapel: "Wide 4.5\" Italian Peak Lapel",
    pieces: "2-Piece (6x2 Double-Breasted Jacket & Cuffed Trousers)",
    description: "A commanding double-breasted silhouette with subtle chalk stripes running through deep charcoal English wool. Exudes authoritative refinement at executive galas, board meetings, and high-stakes dinners.",
    editorialQuote: "Power dressing refined into high art. Broad lapels and precision waist taper.",
    rentalPricing: {
      "3days": 185,
      "5days": 240,
      "7days": 295
    },
    securityDeposit: 100,
    sizes: [
      { size: "38R", totalStock: 2, availableStock: 2 },
      { size: "40R", totalStock: 3, availableStock: 2 },
      { size: "42R", totalStock: 3, availableStock: 3 },
      { size: "44R", totalStock: 2, availableStock: 1 }
    ],
    images: [
      "https://images.unsplash.com/photo-1555069519-127aadedf1ee?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85"
    ],
    features: [
      "Classic 6x2 button stance with rolled upper lapel",
      "Hand-padded chest canvas for commanding structure",
      "Trousers feature 1.75\" cuffs and double forward pleats",
      "Water-repellent nanotech yarn coating",
      "Bespoke matte horn buttons"
    ],
    isFeatured: false,
    rating: 4.89,
    reviewsCount: 22
  },
  {
    id: "suit-06",
    title: "The Burgundy Baratheon Tuxedo",
    subtitle: "Avant-Garde Red Carpet & Premieres",
    sku: "ZOX-TX-006",
    category: "Tuxedo",
    occasion: "Red Carpet & Gala",
    fit: "Tailored Slim",
    color: "Deep Bordeaux Burgundy",
    hexColor: "#3b0c17",
    fabric: "Super 160s Merino Wool with Silk Brocade Accent",
    lapel: "Peak Lapel (Midnight Black Silk)",
    pieces: "2-Piece (Burgundy Jacket & Midnight Black Trousers)",
    description: "Rich, saturated bordeaux burgundy designed to stand out under camera flashes. Paired with obsidian black silk lapels and trousers, this suit offers an alluring alternative to traditional black tie.",
    editorialQuote: "Rich saturation, cinematic intensity, and uncompromising modern elegance.",
    rentalPricing: {
      "3days": 220,
      "5days": 285,
      "7days": 350
    },
    securityDeposit: 110,
    sizes: [
      { size: "38R", totalStock: 2, availableStock: 1 },
      { size: "40R", totalStock: 3, availableStock: 2 },
      { size: "42R", totalStock: 2, availableStock: 2 },
      { size: "44R", totalStock: 2, availableStock: 1 }
    ],
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1592860955938-202a35368a5c?auto=format&fit=crop&w=1200&q=85"
    ],
    features: [
      "High-contrast obsidian black silk satin lapel",
      "Rich deep red yarn dye that shifts under lighting",
      "Precision cut for a flattering hourglass silhouette",
      "Tapered ankle finish trousers with side tensioners",
      "Hand-finished Milanese lapel boutonniere buttonhole"
    ],
    isFeatured: true,
    rating: 4.96,
    reviewsCount: 27
  }
];

const INITIAL_ACCESSORIES = [
  {
    id: "acc-01",
    name: "Pure Silk Midnight Self-Tie Bowtie",
    category: "Bowtie",
    rentalPrice: 20,
    deposit: 15,
    image: "https://images.unsplash.com/photo-1589756823695-278bc923f962?auto=format&fit=crop&w=600&q=80",
    description: "100% heavy silk barathea bowtie with adjustable neck sizing."
  },
  {
    id: "acc-02",
    name: "Onyx & Sterling Silver Stud & Cufflink Set",
    category: "Cufflinks",
    rentalPrice: 35,
    deposit: 30,
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=600&q=80",
    description: "Solid 925 sterling silver with genuine hand-cut black onyx cabochons."
  },
  {
    id: "acc-03",
    name: "Italian Patent Leather Wholecut Oxfords",
    category: "Shoes",
    rentalPrice: 55,
    deposit: 50,
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80",
    description: "Calfskin patent leather wholecut shoes handcrafted in Florence, Italy."
  },
  {
    id: "acc-04",
    name: "Duchess Silk Pleated Cummerbund",
    category: "Cummerbund",
    rentalPrice: 25,
    deposit: 20,
    image: "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=600&q=80",
    description: "Classic upward pleating in silk satin, designed to cover the trouser waistband."
  },
  {
    id: "acc-05",
    name: "Hand-Rolled Mulberry Silk Pocket Square",
    category: "Pocket Square",
    rentalPrice: 15,
    deposit: 10,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80",
    description: "Crisp white Italian silk with hand-rolled edges for the presidential or puff fold."
  }
];

const INITIAL_CUSTOMERS = [
  {
    id: "cust-01",
    name: "Alexander Vance",
    phone: "+1 (555) 349-8812",
    email: "alexander.vance@vancemedia.com",
    address: "740 Park Avenue, Apt 11B, New York, NY",
    vipStatus: true,
    rentalCount: 4,
    notes: "Prefers 1/2 inch shirt cuff display. Always requests garment bag with wooden hanger.",
    measurements: {
      chest: "40",
      shoulder: "18.5",
      sleeveLength: "33.5",
      jacketLength: "30",
      waist: "32",
      hip: "38",
      inseam: "31.5",
      outseam: "41",
      neck: "16",
      height: "6'0\"",
      weight: "175 lbs"
    },
    createdAt: "2026-01-15T10:00:00Z"
  },
  {
    id: "cust-02",
    name: "Julian Moreau",
    phone: "+1 (555) 782-9901",
    email: "j.moreau@atelier-lux.fr",
    address: "120 Central Park South, New York, NY",
    vipStatus: true,
    rentalCount: 2,
    notes: "Gala regular. Prefers velvet and peak lapels.",
    measurements: {
      chest: "42",
      shoulder: "19",
      sleeveLength: "34",
      jacketLength: "30.5",
      waist: "34",
      hip: "40",
      inseam: "32",
      outseam: "42",
      neck: "16.5",
      height: "6'1\"",
      weight: "188 lbs"
    },
    createdAt: "2026-02-10T14:30:00Z"
  },
  {
    id: "cust-03",
    name: "Marcus Sterling",
    phone: "+1 (555) 910-4421",
    email: "marcus.sterling@sterlingcap.com",
    address: "55 Wall Street, Residence 4A, New York, NY",
    vipStatus: false,
    rentalCount: 1,
    notes: "First time groom. Wedding date coming up in October.",
    measurements: {
      chest: "38",
      shoulder: "17.75",
      sleeveLength: "32.5",
      jacketLength: "29",
      waist: "31",
      hip: "37",
      inseam: "30",
      outseam: "39.5",
      neck: "15.5",
      height: "5'10\"",
      weight: "162 lbs"
    },
    createdAt: "2026-03-01T09:15:00Z"
  }
];

const INITIAL_RENTALS = [
  {
    id: "rent-01",
    rentalCode: "ZOX-2026-9041",
    customerId: "cust-01",
    customerName: "Alexander Vance",
    customerPhone: "+1 (555) 349-8812",
    customerEmail: "alexander.vance@vancemedia.com",
    suitId: "suit-01",
    suitTitle: "The Obsidian Peak Tuxedo",
    suitSku: "ZOX-TX-001",
    size: "40R",
    accessories: ["Onyx & Sterling Silver Stud & Cufflink Set", "Pure Silk Midnight Self-Tie Bowtie"],
    startDate: "2026-10-25",
    eventDate: "2026-10-27",
    returnDate: "2026-10-29",
    status: "collected",
    pricing: {
      rentalFee: 190,
      accessoriesFee: 55,
      securityDeposit: 100,
      damageWaiver: 15,
      discount: 0,
      total: 360,
      paidAmount: 360,
      pendingBalance: 0
    },
    paymentStatus: "fully_paid",
    notes: "Collected in store on Oct 25. Tailored cuff length confirmed. Scheduled return Oct 29.",
    inspectionNotes: {
      seamsIntact: true,
      noStains: true,
      accessoriesReturned: false,
      notes: "Garment in pristine shape upon collection."
    },
    createdAt: "2026-10-20T11:20:00Z",
    updatedAt: "2026-10-25T15:00:00Z"
  },
  {
    id: "rent-02",
    rentalCode: "ZOX-2026-9042",
    customerId: "cust-02",
    customerName: "Julian Moreau",
    customerPhone: "+1 (555) 782-9901",
    customerEmail: "j.moreau@atelier-lux.fr",
    suitId: "suit-03",
    suitTitle: "The Emerald Sovereign Velvet Tuxedo",
    suitSku: "ZOX-VL-003",
    size: "42R",
    accessories: ["Italian Patent Leather Wholecut Oxfords"],
    startDate: "2026-10-27",
    eventDate: "2026-10-28",
    returnDate: "2026-10-31",
    status: "confirmed",
    pricing: {
      rentalFee: 230,
      accessoriesFee: 55,
      securityDeposit: 120,
      damageWaiver: 20,
      discount: 0,
      total: 425,
      paidAmount: 200,
      pendingBalance: 225
    },
    paymentStatus: "deposit_paid",
    notes: "Collection scheduled for tomorrow at 2:00 PM. Suit freshly pressed and steamed.",
    inspectionNotes: {
      seamsIntact: true,
      noStains: true,
      accessoriesReturned: false,
      notes: ""
    },
    createdAt: "2026-10-22T16:45:00Z",
    updatedAt: "2026-10-22T16:45:00Z"
  },
  {
    id: "rent-03",
    rentalCode: "ZOX-2026-9038",
    customerId: "cust-03",
    customerName: "Marcus Sterling",
    customerPhone: "+1 (555) 910-4421",
    customerEmail: "marcus.sterling@sterlingcap.com",
    suitId: "suit-02",
    suitTitle: "The Windsor Royal Navy 3-Piece",
    suitSku: "ZOX-3P-002",
    size: "38R",
    accessories: ["Hand-Rolled Mulberry Silk Pocket Square"],
    startDate: "2026-10-20",
    eventDate: "2026-10-22",
    returnDate: "2026-10-24",
    status: "overdue",
    pricing: {
      rentalFee: 210,
      accessoriesFee: 15,
      securityDeposit: 100,
      damageWaiver: 15,
      discount: 0,
      total: 340,
      paidAmount: 340,
      pendingBalance: 0
    },
    paymentStatus: "fully_paid",
    notes: "Return was due on Oct 24. Sent polite WhatsApp reminder. Client stated returning this evening.",
    inspectionNotes: {
      seamsIntact: true,
      noStains: true,
      accessoriesReturned: false,
      notes: "Awaiting garment return for deposit release."
    },
    createdAt: "2026-10-15T14:10:00Z",
    updatedAt: "2026-10-25T09:00:00Z"
  }
];

const INITIAL_SETTINGS = {
  storeName: "ZOX Men's Atelier & Suit Rentals",
  tagline: "Haute Couture & Formalwear For Unforgettable Evenings",
  phone: "+1 (555) 890-7629",
  whatsappNumber: "15558907629",
  email: "concierge@zoxrentals.com",
  currency: "$",
  address: "442 Madison Avenue, 8th Floor Atelier, New York, NY 10022",
  openingHours: "Mon - Sat: 10:00 AM - 7:30 PM | Sun: By Appointment Only",
  depositPolicy: "Refundable security deposit is processed within 24 hours after inspection.",
  lateFeePerDay: 45,
  adminPin: "8888" // Simple fast admin PIN authorization
};

export function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      suits: INITIAL_SUITS,
      accessories: INITIAL_ACCESSORIES,
      customers: INITIAL_CUSTOMERS,
      rentals: INITIAL_RENTALS,
      settings: INITIAL_SETTINGS
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading DB file, recreating...", err);
    const initialData = {
      suits: INITIAL_SUITS,
      accessories: INITIAL_ACCESSORIES,
      customers: INITIAL_CUSTOMERS,
      rentals: INITIAL_RENTALS,
      settings: INITIAL_SETTINGS
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

export function getDb() {
  return initDb();
}

export function saveDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error("Error saving DB:", err);
    return false;
  }
}
