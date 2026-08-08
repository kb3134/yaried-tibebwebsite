import { Product, Weaver, Order, BespokeRequest, CurrencyRate, BrandingImages, ContactMessage, StudioCategory, StudioImage } from '../types';

export const CURRENCY_RATES: Record<string, CurrencyRate> = {
  ETB: { code: 'ETB', symbol: 'ETB ', rateToUSD: 1 },
};

// Relative paths to our generated high-res luxury Ethiopian fashion hero images
export const HERO_IMAGE_PRIMARY = '/src/assets/images/ethiopian_luxury_hero_1785390172994.jpg';
export const HERO_IMAGE_CAMPAIGN = '/src/assets/images/ethiopian_couture_campaign_1785390186014.jpg';
export const HABESHA_KEMIS_IMAGE = '/src/assets/images/ethiopian_habesha_kemis_1785527313511.jpg';
export const MENS_ATTIRE_IMAGE = '/src/assets/images/ethiopian_mens_attire_1785527326767.jpg';
export const BRIDAL_COUTURE_IMAGE = '/src/assets/images/ethiopian_bridal_couture_1785527342813.jpg';
export const OROMO_DRESS_IMAGE = '/src/assets/images/ethiopian_oromo_dress_1785527355539.jpg';

export const GOLD_JEWELRY_IMAGE = '/src/assets/images/ethiopian_gold_jewelry_1785752459004.jpg';
export const FAMILY_KEMIS_IMAGE = '/src/assets/images/ethiopian_family_kemis_1785752474519.jpg';
export const NETELA_SCARF_IMAGE = '/src/assets/images/ethiopian_netela_scarf_1785752485820.jpg';

export const DEFAULT_LOGO_IMAGE = '/src/assets/images/yared_official_logo_1786147555847.jpg';

export const DEFAULT_BRANDING_IMAGES: BrandingImages = {
  logoUrl: DEFAULT_LOGO_IMAGE,
  heroBannerUrl: HERO_IMAGE_PRIMARY,
  heroSecondaryUrl: HERO_IMAGE_CAMPAIGN,
  heroTertiaryUrl: HABESHA_KEMIS_IMAGE,
  aboutUsUrl: HABESHA_KEMIS_IMAGE,
  craftsmanshipUrl: MENS_ATTIRE_IMAGE,
  promotionalBannerUrl: BRIDAL_COUTURE_IMAGE,
  lookbookUrls: [
    HERO_IMAGE_PRIMARY,
    HERO_IMAGE_CAMPAIGN,
    HABESHA_KEMIS_IMAGE,
    BRIDAL_COUTURE_IMAGE
  ],
  socialLinks: {
    facebook: 'https://www.facebook.com/share/1FvXdXCEnC/',
    instagram: 'https://www.instagram.com/yared_tibeb?igsh=MW5hNXI5NXQyd3Q4NA==',
    tiktok: 'https://www.tiktok.com/@yared_tibeb_',
    telegram: 'https://t.me/+251923095380'
  },
  heroBannerBadge: '100% ROYAL HERITAGE',
  heroBannerTitle: 'Master Handwoven Shemma',
  heroBannerSubtitle: 'Pure Cotton & Metallic Gold Thread · Addis Ababa Weavers',
  heroSecondaryBadge: 'EMPRESS COUTURE',
  heroSecondaryTitle: 'Royal AXUM Chevron Design',
  heroSecondarySubtitle: 'Hand-embroidered Tibeb Motifs · Custom Atelier Fitting',
  heroTertiaryBadge: 'BESPOKE BRIDAL',
  heroTertiaryTitle: 'Hand-crafted Kemis Gowns',
  heroTertiarySubtitle: '35+ Years of Loom Legacy & Tradition'
};

export const MOCK_WEAVERS: Weaver[] = [
  {
    id: 'w-1',
    name: 'Ato Kassahun Tadesse',
    amharicTitle: 'የሸማ ጥበብ መምህር ካሳሁን',
    region: 'Shiro Meda, Addis Ababa',
    experienceYears: 32,
    specialty: 'Royal Gold Leaf Tibeb & Axum Geometric Weaving',
    activeLooms: 3,
    rating: 4.98,
    photoUrl: MENS_ATTIRE_IMAGE,
    bio: 'Third-generation master weaver from Chencha, Gamo highlands. Renowned for crafting bespoke royal Kemis for diplomatic banquets and state events.'
  },
  {
    id: 'w-2',
    name: 'Woyzero Genet Tesfaye',
    amharicTitle: 'እመቤት ገነት ተስፋዬ',
    region: 'Gondar Heritage Atelier',
    experienceYears: 24,
    specialty: 'Silk-Thread Embroidery & Empress Zewditu Motif',
    activeLooms: 2,
    rating: 4.95,
    photoUrl: HABESHA_KEMIS_IMAGE,
    bio: 'Specializes in double-sided hand spinning fine Ethiopian cotton with pure silk accents for luxury wedding attire.'
  },
  {
    id: 'w-3',
    name: 'Ato Yonas Assefa',
    amharicTitle: 'ዮናስ አሰፋ - የወንዶች ኩቱር',
    region: 'Dorze Highland Weavers Guild',
    experienceYears: 19,
    specialty: 'Heavy Shemma Draped Kuta & Ceremonial Men Suits',
    activeLooms: 4,
    rating: 4.92,
    photoUrl: HERO_IMAGE_CAMPAIGN,
    bio: 'Pioneer of contemporary Ethiopian menswear, blending traditional Dorze loom textures with sharp Parisian tailoring.'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Empress Taytu Royal Bridal Kemis',
    amharicName: 'እመቤት ጣይቱ የሙሽራ ቀሚስ',
    category: 'wedding',
    collections: ['Royal Imperial 2026', 'Bridal Heritage', 'Best Sellers'],
    priceUSD: 1850,
    originalPriceUSD: 2100,
    rating: 5.0,
    reviewsCount: 42,
    inStock: true,
    stockQuantity: 12,
    isFeatured: true,
    isNewArrival: true,
    isBespokeAvailable: true,
    tibebPattern: '24k Axum Gold Leaf & Royal Blue Silk',
    fabric: '100% Fine Hand-spun Ethiopian Cotton',
    weaverRegion: 'Shiro Meda, Addis Ababa',
    images: [BRIDAL_COUTURE_IMAGE, HABESHA_KEMIS_IMAGE],
    description: 'Masterpiece bridal Habesha Kemis hand-woven with 24K gold metallic thread across a multi-paneled Axum geometric border. Accompanied by a matching sheer gold-trimmed Netela.',
    details: [
      'Hand-woven by Master Kassahun Tadesse',
      'Double-sided silk thread embroidery',
      'Includes matching luxury gold Netela shawl',
      'Custom bespoke sizing available upon order'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Fit'],
    colors: ['Royal White & Gold', 'Ivory & Crimson', 'Champagne Gold'],
    weavingDays: 28,
    studioCategory: 'wedding'
  },
  {
    id: 'prod-002',
    name: 'Emperor Menelik Royal Kuta & Suit',
    amharicName: 'ዳግማዊ ምኒልክ የክብር ኩታ እና ሱፍ',
    category: 'mens',
    collections: ['Royal Imperial 2026', 'Highland Menswear'],
    priceUSD: 1450,
    originalPriceUSD: 1650,
    rating: 4.9,
    reviewsCount: 28,
    inStock: true,
    stockQuantity: 8,
    isFeatured: true,
    isNewArrival: false,
    isBespokeAvailable: true,
    tibebPattern: 'Imperial Axum Cross & Ebony Onyx',
    fabric: 'Heavy Shemma Cotton & Tailored Cashmere Blend',
    weaverRegion: 'Dorze Highland Guild',
    images: [MENS_ATTIRE_IMAGE, HERO_IMAGE_CAMPAIGN],
    description: 'Distinguished male ceremonial ensemble featuring a heavy-loomed gold Kuta shawl paired with bespoke imperial trousers and embroidered high-neck tunic.',
    details: [
      'Artisan loomed Kuta shawl included',
      'Hand-stitched gold neck & cuff embroidery',
      'Tailored for diplomatic and gala banquets'
    ],
    sizes: ['38R', '40R', '42R', '44L', 'Custom Measurement'],
    colors: ['White & Gold', 'Onyx & Imperial Gold'],
    weavingDays: 21,
    studioCategory: 'mens'
  },
  {
    id: 'prod-003',
    name: 'Gondar Queen Zewditu Habesha Kemis',
    amharicName: 'የጎንደር ንግሥት ዘውዲቱ ቀሚስ',
    category: 'womens',
    collections: ['Bridal Heritage', 'Gondar Atelier'],
    priceUSD: 1280,
    rating: 4.95,
    reviewsCount: 35,
    inStock: true,
    stockQuantity: 15,
    isFeatured: true,
    isNewArrival: false,
    isBespokeAvailable: true,
    tibebPattern: 'Floral Rosette & Double Axum Lattice',
    fabric: 'Fine Sheer Ethiopian Cotton & Natural Silk',
    weaverRegion: 'Gondar Heritage Atelier',
    images: [HABESHA_KEMIS_IMAGE, BRIDAL_COUTURE_IMAGE],
    description: 'Classic Gondar style Kemis with intricate ruby red and emerald green silk thread borders. Elegant floor-length drape with scalloped sleeve hem.',
    details: [
      'Hand-spun 100% organic cotton yarn',
      'Stained with natural highland vegetable dyes',
      'Includes wide matching Netela wrap'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Traditional White & Ruby', 'Pure Ivory & Gold'],
    weavingDays: 18,
    studioCategory: 'womens'
  },
  {
    id: 'prod-004',
    name: 'Oromia Queen Siinqee Heritage Dress',
    amharicName: 'የኦሮሚያ ሲንቄ ባህላዊ አልባሳት',
    category: 'Oromia Traditional Dress',
    collections: ['Contemporary Runway', 'Cultural Heritage'],
    priceUSD: 1150,
    originalPriceUSD: 1350,
    rating: 4.92,
    reviewsCount: 19,
    inStock: true,
    stockQuantity: 10,
    isFeatured: true,
    isNewArrival: true,
    isBespokeAvailable: true,
    tibebPattern: 'Oromo Geometric Beadwork & Red-Black Thread',
    fabric: 'Hand-woven White Cotton & Beaded Leather Accents',
    weaverRegion: 'Wollega & Shiro Meda Guilds',
    images: [OROMO_DRESS_IMAGE, HABESHA_KEMIS_IMAGE],
    description: 'Vibrant traditional Oromo luxury dress adorned with hand-beaded geometric necklines, deep red woven bands, and custom ceremonial accessories.',
    details: [
      'Handcrafted traditional Siinqee bead embroidery',
      'Lightweight breathable cotton weave',
      'Includes matching headscarf and sash'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Crimson & Black', 'Gold & Emerald'],
    weavingDays: 16,
    studioCategory: 'traditional-dresses'
  },
  {
    id: 'prod-005',
    name: 'Axumite 24K Gold Filigree Jewelry Set',
    amharicName: 'የአክሱም 24k ወርቅ የጌጣጌጥ ስብስብ',
    category: 'Jewelry',
    collections: ['Artisanal Accessories', 'Royal Imperial 2026'],
    priceUSD: 680,
    rating: 4.98,
    reviewsCount: 54,
    inStock: true,
    stockQuantity: 25,
    isFeatured: true,
    isNewArrival: true,
    isBespokeAvailable: false,
    tibebPattern: 'Axumite Sun & Meskel Filigree',
    fabric: '24K Gold-Plated Brass & Hand-Carved Silver',
    weaverRegion: 'Axum Goldsmith Guild',
    images: [GOLD_JEWELRY_IMAGE],
    description: 'Exquisite handcrafted Ethiopian gold filigree jewelry set including an iconic Meskel cross necklace, drop earrings, and adjustable cuff bracelet.',
    details: [
      '24K heavy gold-plated anti-tarnish finish',
      'Authentic Axumite heirloom motif design',
      'Comes in velvet luxury Yared Tibeb box'
    ],
    sizes: ['One Size Fits All'],
    colors: ['24K Antique Gold'],
    weavingDays: 7,
    studioCategory: 'jewelry'
  },
  {
    id: 'prod-006',
    name: 'Imperial Family Matching Habesha Kemis Set',
    amharicName: 'የቤተሰብ ባህላዊ አልባሳት ስብስብ',
    category: 'family',
    collections: ['Family Keepsakes', 'Best Sellers'],
    priceUSD: 2400,
    originalPriceUSD: 2800,
    rating: 4.99,
    reviewsCount: 16,
    inStock: true,
    stockQuantity: 6,
    isFeatured: true,
    isNewArrival: false,
    isBespokeAvailable: true,
    tibebPattern: 'Unified Gold Leaf & Sapphire Ribbons',
    fabric: 'Superfine Ethiopian Loomed Cotton',
    weaverRegion: 'Shiro Meda Atelier',
    images: [FAMILY_KEMIS_IMAGE],
    description: 'Matching bespoke luxury ensemble for parents and children. Includes mother Gown, father Kuta & tunic, and children matching Habesha outfits.',
    details: [
      'Includes 4 complete custom outfits (Mother, Father, Son, Daughter)',
      'Custom measurement fitting per family member',
      'Woven on synchronized looms for color match'
    ],
    sizes: ['Custom Family Package'],
    colors: ['Royal White & Gold', 'Cream & Emerald'],
    weavingDays: 30,
    studioCategory: 'family'
  },
  {
    id: 'prod-007',
    name: 'Royal Axum Gold Thread Netela Scarf',
    amharicName: 'የወርቅ ዘርፍ ነጠላ እና ጋቢ',
    category: 'Scarves',
    collections: ['Artisanal Accessories', 'Highland Menswear'],
    priceUSD: 380,
    rating: 4.88,
    reviewsCount: 62,
    inStock: true,
    stockQuantity: 30,
    isFeatured: false,
    isNewArrival: true,
    isBespokeAvailable: false,
    tibebPattern: 'Geometric Axum Gold Grid',
    fabric: '100% Hand-spun Gauze Cotton & Gold Lurex',
    weaverRegion: 'Dorze Highland Weavers',
    images: [NETELA_SCARF_IMAGE],
    description: 'Lightweight yet warm hand-loomed Netela shawl featuring 4-inch wide gold silk thread woven borders. Perfect accessory for church, weddings, and formal galas.',
    details: [
      'Ultra-soft hand-spun cotton',
      'Hand-knotted fringe edges',
      'Generous 90in x 45in wrap dimension'
    ],
    sizes: ['Standard Wrap (90" x 45")'],
    colors: ['White & Gold', 'Off-White & Bronze'],
    weavingDays: 5,
    studioCategory: 'scarves'
  },
  {
    id: 'prod-008',
    name: 'Prince Lalibela Infant & Kids Kemis Set',
    amharicName: 'የህፃናት ባህላዊ አልባሳት',
    category: 'baby',
    collections: ['Family Keepsakes'],
    priceUSD: 320,
    rating: 4.90,
    reviewsCount: 21,
    inStock: true,
    stockQuantity: 20,
    isFeatured: false,
    isNewArrival: false,
    isBespokeAvailable: true,
    tibebPattern: 'Lalibela Cross Miniature',
    fabric: '100% Organic Soft Baby Cotton',
    weaverRegion: 'Shiro Meda Atelier',
    images: [FAMILY_KEMIS_IMAGE],
    description: 'Delicate, hypoallergenic traditional Habesha Kemis outfit for infants and children, woven with gentle soft cotton yarns.',
    details: [
      'Extra soft non-scratchy seams',
      'Easy velcro/snap collar closure',
      'Includes mini Netela wrap'
    ],
    sizes: ['0-6M', '6-12M', '2T-3T', '4T-5T', '6T-8T'],
    colors: ['Pure White & Gold', 'White & Soft Pink'],
    weavingDays: 6,
    studioCategory: 'baby'
  },
  {
    id: 'prod-009',
    name: 'Shewa Modern Runway Kemis Gown',
    amharicName: 'ዘመናዊ የሸዋ ባህላዊ ቀሚስ',
    category: 'Modern Traditional Dress',
    collections: ['Contemporary Runway'],
    priceUSD: 1390,
    rating: 4.93,
    reviewsCount: 31,
    inStock: true,
    stockQuantity: 9,
    isFeatured: true,
    isNewArrival: true,
    isBespokeAvailable: true,
    tibebPattern: 'Geometric Modern Axum Wave',
    fabric: 'Hand-spun Cotton & Silk Satin Underlay',
    weaverRegion: 'Shiro Meda Modern Studio',
    images: [HERO_IMAGE_CAMPAIGN, HERO_IMAGE_PRIMARY],
    description: 'Contemporary haute couture Kemis gown featuring a tailored corset bodice, high side slit, and traditional hand-woven gold Tibeb trailing cape.',
    details: [
      'Featured in Addis Fashion Week 2026',
      'Structured inner bustier support',
      'Flowing loomed cape extension'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Champagne Gold', 'Onyx Black & Gold'],
    weavingDays: 22,
    studioCategory: 'modern-traditional'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2026-8812',
    customerName: 'Saba Hailu',
    email: 'saba.hailu@luxuryboutique.com',
    phone: '+251 91 123 4567',
    address: 'Bole Atlas, Villa 45',
    city: 'Addis Ababa',
    country: 'Ethiopia',
    items: [],
    totalUSD: 1450,
    currency: 'ETB',
    totalInCurrency: 1450,
    paymentMethod: 'Credit Card',
    status: 'In Loom Weaving',
    createdAt: '2026-07-28',
    trackingNumber: 'DHL-ETH-992184'
  },
  {
    id: 'ORD-2026-8813',
    customerName: 'Marcus Sterling',
    email: 'marcus.sterling@fashionweekly.co.uk',
    phone: '+44 7700 900077',
    address: '14 Mayfair Square',
    city: 'London',
    country: 'United Kingdom',
    items: [],
    totalUSD: 2120,
    currency: 'ETB',
    totalInCurrency: 2120,
    paymentMethod: 'Credit Card',
    status: 'Quality Control',
    createdAt: '2026-07-26',
    trackingNumber: 'DHL-UK-441092'
  }
];

export const MOCK_BESPOKE_REQUESTS: BespokeRequest[] = [
  {
    id: 'BSP-2026-004',
    customerName: 'Helina Kebede',
    email: 'helina.k@gmail.com',
    phone: '+1 202 555 0199',
    garmentType: 'Empress Taytu Bridal Couture Gown',
    fabricGrade: 'Superfine Hand-spun Cotton',
    tibebPatternColor: '24k Axum Gold with Deep Crimson Leaf',
    measurements: {
      bustChest: '36 in',
      waist: '28 in',
      hips: '39 in',
      shoulderToFloor: '58 in',
      sleeveLength: '24 in'
    },
    eventDate: '2026-09-15',
    specialNotes: 'Wedding ceremony at Holy Trinity Cathedral, Addis Ababa. Requesting extra long Netela drape.',
    status: 'Artisan Assigned',
    createdAt: '2026-07-27',
    estimatedCompletion: '2026-08-20',
    assignedWeaverId: 'w-1'
  },
  {
    id: 'BSP-2026-005',
    customerName: 'Dr. Tedros Berhanu',
    email: 'tedros.b@ethiopianembassy.org',
    phone: '+251 91 888 7766',
    garmentType: 'Menelik Royal Embroidered Kuta & Suit',
    fabricGrade: 'Heavy Gold Thread Shemma',
    tibebPatternColor: 'Imperial Gold & Onyx Black',
    measurements: {
      bustChest: '44 in',
      waist: '36 in',
      hips: '42 in',
      shoulderToFloor: '61 in',
      sleeveLength: '26 in'
    },
    eventDate: '2026-08-30',
    specialNotes: 'State Banquet at National Palace.',
    status: 'In Loom Weaving',
    createdAt: '2026-07-25',
    estimatedCompletion: '2026-08-15',
    assignedWeaverId: 'w-3'
  }
];

export const LOOKBOOK_HOTSPOTS = [
  {
    id: 'lb-1',
    title: 'Imperial Gala 2026 Collection',
    tagline: 'Hand-loomed in Shiro Meda, worn worldwide.',
    imageUrl: HERO_IMAGE_PRIMARY,
    products: [
      { id: 'prod-001', name: 'Empress Taytu Royal Bridal Kemis', price: 1850, x: 35, y: 45 },
      { id: 'prod-005', name: 'Axumite 24K Gold Filigree Jewelry Set', price: 680, x: 50, y: 30 }
    ]
  },
  {
    id: 'lb-2',
    title: 'The Modern Menswear Atelier',
    tagline: 'Precision tailoring with 3,000 years of Ethiopian heritage.',
    imageUrl: HERO_IMAGE_CAMPAIGN,
    products: [
      { id: 'prod-002', name: 'Emperor Menelik Royal Kuta & Suit', price: 1450, x: 40, y: 50 },
      { id: 'prod-007', name: 'Royal Axum Gold Thread Netela Scarf', price: 380, x: 65, y: 35 }
    ]
  }
];

export const MOCK_CONTACT_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-101',
    fullName: 'Solomon Tekle',
    subject: 'Bespoke Wedding Kemis Inquiry for November Ceremony',
    email: 'solomon.t@gmail.com',
    phone: '+251 91 123 4567',
    message: 'Greetings! I would like to inquire about ordering 4 matching bespoke traditional Habesha dresses for an upcoming wedding in Addis Ababa. Do you support international DHL delivery or studio fitting?',
    createdAt: '2026-07-30T10:15:00Z',
    read: false
  },
  {
    id: 'msg-102',
    fullName: 'Hannah Birhanu',
    subject: 'Custom Axumite Gold Thread Male Suit Sizing',
    email: 'hannah.birhanu@yahoo.com',
    phone: '+1 202 555 0192',
    message: 'Hello Yared Tibeb team, I am based in Washington DC and would like to order the Axumite Emperor Suit for my husband. How do we submit accurate shoulder and arm length measurements online?',
    createdAt: '2026-07-29T14:40:00Z',
    read: true
  },
  {
    id: 'msg-103',
    fullName: 'Dr. Meron Assefa',
    subject: 'Cultural Exhibition & Diplomatic Gala Partnership',
    email: 'meron.a@addis-art.org',
    phone: '+251 92 888 7766',
    message: 'We are organizing an Ethiopian Heritage & Textile Couture Gala at the Sheraton Addis next month. We would love to discuss featuring Yared Tibeb loom craftsmanship in our runway showcase.',
    createdAt: '2026-07-28T09:20:00Z',
    read: false
  }
];

export const DEFAULT_STUDIO_CATEGORIES: StudioCategory[] = [
  { id: 'sc-wedding', name: 'Wedding', slug: 'wedding', description: 'Royal Habesha bridal and groom wedding attire' },
  { id: 'sc-mens', name: "Men's", slug: 'mens', description: 'Bespoke Men’s Kuta, suits, and ceremonial wear' },
  { id: 'sc-womens', name: "Women's", slug: 'womens', description: 'Handmade luxury Habesha Kemis gowns' },
  { id: 'sc-family', name: 'Family', slug: 'family', description: 'Matching family traditional ensemble sets' },
  { id: 'sc-baby', name: 'Baby', slug: 'baby', description: 'Artisanal traditional wear for children & infants' },
  { id: 'sc-traditional-dresses', name: 'Traditional Dresses', slug: 'traditional-dresses', description: 'Heritage Ethiopian hand-woven dresses & robes' },
  { id: 'sc-modern-traditional', name: 'Modern Traditional Wear', slug: 'modern-traditional-wear', description: 'Contemporary runway Ethiopian fashion blends' },
  { id: 'sc-accessories', name: 'Accessories', slug: 'accessories', description: 'Traditional Meskel crosses, Lemat baskets & leather crafts' },
  { id: 'sc-jewelry', name: 'Jewelry', slug: 'jewelry', description: '24K gold-plated Ethiopian filigree jewelry sets' },
  { id: 'sc-scarves', name: 'Scarves', slug: 'scarves', description: 'Hand-woven Netela and Gabi scarves & shawls' },
  { id: 'sc-cultural-events', name: 'Cultural Events', slug: 'cultural-events', description: 'Enkutatash, Genna, Meskel & Timkat festival couture' },
  { id: 'sc-behind-the-scenes', name: 'Behind the Scenes', slug: 'behind-the-scenes', description: 'Shiro Meda Master Weavers at work on the looms' }
];

export const MOCK_STUDIO_IMAGES: StudioImage[] = [
  {
    id: 'st-001',
    title: 'Empress Taytu Royal Bridal Kemis Lookbook',
    description: 'Highland hand-loomed white cotton gown with multi-paneled 24K gold leaf Axum geometric border',
    imageUrl: BRIDAL_COUTURE_IMAGE,
    categories: ['wedding', 'womens', 'traditional-dresses'],
    tags: ['bridal', 'gold-thread', 'habesha-kemis', 'shiro-meda'],
    isFeatured: true,
    isHidden: false,
    orderIndex: 1,
    createdAt: '2026-07-20',
    productIds: ['prod-001']
  },
  {
    id: 'st-002',
    title: 'Emperor Menelik Diplomatic Kuta & Suit',
    description: 'Bespoke male ceremonial outfit pairing heavy gold thread Kuta shawl with tailored high-neck tunic',
    imageUrl: MENS_ATTIRE_IMAGE,
    categories: ['mens', 'cultural-events'],
    tags: ['menswear', 'kuta', 'gold-embroidery', 'royal'],
    isFeatured: true,
    isHidden: false,
    orderIndex: 2,
    createdAt: '2026-07-21',
    productIds: ['prod-002']
  },
  {
    id: 'st-003',
    title: 'Gondar Heritage Queen Zewditu Silk Gown',
    description: 'Double-sided silk thread embroidery with classic Gondar rosette motifs on pure organic white cotton',
    imageUrl: HABESHA_KEMIS_IMAGE,
    categories: ['womens', 'traditional-dresses'],
    tags: ['gondar', 'silk-embroidery', 'kemis-gown'],
    isFeatured: true,
    isHidden: false,
    orderIndex: 3,
    createdAt: '2026-07-22',
    productIds: ['prod-003']
  },
  {
    id: 'st-004',
    title: 'Oromia Queen Siinqee Traditional Ceremonial Couture',
    description: 'Vibrant hand-beaded geometric necklines and deep red woven bands with ceremonial accessory set',
    imageUrl: OROMO_DRESS_IMAGE,
    categories: ['womens', 'traditional-dresses', 'cultural-events'],
    tags: ['oromo', 'siinqee', 'beadwork', 'heritage'],
    isFeatured: true,
    isHidden: false,
    orderIndex: 4,
    createdAt: '2026-07-23',
    productIds: ['prod-004']
  },
  {
    id: 'st-005',
    title: '24K Gold Filigree Axumite Jewelry Set',
    description: 'Authentic handcrafted Ethiopian gold filigree Meskel cross necklace and matching drop earrings',
    imageUrl: GOLD_JEWELRY_IMAGE,
    categories: ['jewelry', 'accessories'],
    tags: ['gold', 'jewelry', 'meskel-cross', 'axum'],
    isFeatured: true,
    isHidden: false,
    orderIndex: 5,
    createdAt: '2026-07-24',
    productIds: ['prod-005']
  },
  {
    id: 'st-006',
    title: 'Imperial Family Matching Ensemble Set',
    description: 'Bespoke synchronized family Habesha Kemis & Kuta outfits for weddings and cultural celebrations',
    imageUrl: FAMILY_KEMIS_IMAGE,
    categories: ['family', 'wedding', 'baby'],
    tags: ['family-set', 'matching', 'habesha', 'wedding'],
    isFeatured: true,
    isHidden: false,
    orderIndex: 6,
    createdAt: '2026-07-25',
    productIds: ['prod-006', 'prod-008']
  },
  {
    id: 'st-007',
    title: 'Hand-Woven Royal Netela Shawl Studio Collection',
    description: 'Lightweight hand-spun gauze cotton shawl with 4-inch wide gold silk thread woven borders',
    imageUrl: NETELA_SCARF_IMAGE,
    categories: ['scarves', 'accessories', 'mens'],
    tags: ['netela', 'shawl', 'gold-thread', 'hand-loomed'],
    isFeatured: false,
    isHidden: false,
    orderIndex: 7,
    createdAt: '2026-07-26',
    productIds: ['prod-007']
  },
  {
    id: 'st-008',
    title: 'Addis Ababa Haute Couture Runway Kemis Gown',
    description: 'Contemporary runway fashion Kemis featuring a tailored corset bodice and flowing loomed gold Tibeb cape',
    imageUrl: HERO_IMAGE_CAMPAIGN,
    categories: ['modern-traditional', 'womens'],
    tags: ['runway', 'couture', 'haute-fashion', 'modern'],
    isFeatured: true,
    isHidden: false,
    orderIndex: 8,
    createdAt: '2026-07-27',
    productIds: ['prod-009']
  },
  {
    id: 'st-009',
    title: 'Shiro Meda Master Weavers Loom Artistry',
    description: 'Behind-the-scenes portrait of master weavers crafting double-sided 24K gold thread Habesha Kemis',
    imageUrl: HERO_IMAGE_PRIMARY,
    categories: ['behind-the-scenes', 'traditional-dresses'],
    tags: ['artisan', 'master-weaver', 'shiro-meda', 'loom'],
    isFeatured: false,
    isHidden: false,
    orderIndex: 9,
    createdAt: '2026-07-28',
    productIds: []
  }
];

