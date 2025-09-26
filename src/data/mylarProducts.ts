export type MylarProduct = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  basePrice: number;
  image: string;
  category: string;
  active?: boolean;
  hasQuantityOptions?: boolean;
  quantityOptions?: {
    quantity: number;
    price: number;
  }[];
};

export const MYLAR_PRODUCTS: MylarProduct[] = [
  {
    id: "logo-revamp",
    slug: "logo-revamp",
    name: "Logo/Logo Revamp",
    description: "Professional logo design or complete logo revamp service",
    basePrice: 75,
    image: "/products/rich-off-candy.PNG",
    category: "Design Services",
    active: true,
    hasQuantityOptions: false
  },
  {
    id: "link-page",
    slug: "link-page",
    name: "Link Page",
    description: "Custom link-in-bio page design and setup",
    basePrice: 100,
    image: "/products/link-page-sample.jpg",
    category: "Design Services",
    active: true,
    hasQuantityOptions: false
  },
  {
    id: "social-media-content",
    slug: "social-media-content",
    name: "Social Media Content",
    description: "Custom social media content creation - Message for pricing",
    basePrice: 0,
    image: "/candyman-social-media.png",
    category: "Design Services",
    active: true,
    hasQuantityOptions: false
  },
  {
    id: "mylar-1-design",
    slug: "1design",
    name: "1 Design",
    description: "Custom mylar bag design service for 1 unique design",
    basePrice: 40,
    image: "/products/td-dunk-mylar.jpg",
    category: "Mylar Bags",
    active: true,
    hasQuantityOptions: false
  },
  {
    id: "mylar-2-designs",
    slug: "2designs",
    name: "2 Designs",
    description: "Custom mylar bag design service for 2 unique designs",
    basePrice: 60,
    image: "/products/td-mistic-mylar.jpg",
    category: "Mylar Bags",
    active: true,
    hasQuantityOptions: false
  },
  {
    id: "mylar-3-designs",
    slug: "3designs",
    name: "3 Designs",
    description: "Custom mylar bag design service for 3 unique designs",
    basePrice: 85,
    image: "/products/td-kitkat-mylar.jpg",
    category: "Mylar Bags",
    active: true,
    hasQuantityOptions: false
  },
  {
    id: "mylar-4plus-designs",
    slug: "4designs",
    name: "4+ Designs",
    description: "Custom mylar bag design service for 4 or more unique designs",
    basePrice: 100,
    image: "/products/td-hershey-mylar.jpg",
    category: "Mylar Bags",
    active: true,
    hasQuantityOptions: true,
    quantityOptions: [
      { quantity: 4, price: 100 },
      { quantity: 5, price: 125 },
      { quantity: 6, price: 150 },
      { quantity: 7, price: 175 },
      { quantity: 8, price: 200 },
      { quantity: 9, price: 225 },
      { quantity: 10, price: 250 },
      { quantity: 11, price: 275 },
      { quantity: 12, price: 300 },
      { quantity: 13, price: 325 },
      { quantity: 14, price: 350 },
      { quantity: 15, price: 375 },
      { quantity: 16, price: 400 },
      { quantity: 17, price: 425 },
      { quantity: 18, price: 450 },
      { quantity: 19, price: 475 },
      { quantity: 20, price: 500 }
    ]
  }
];

export const MYLAR_CATEGORIES = ["All", ...Array.from(new Set(MYLAR_PRODUCTS.map(p => p.category)))];
