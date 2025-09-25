export type MylarProduct = {
  id: string;
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
    id: "mylar-1-design",
    name: "1 Design",
    description: "Custom mylar bag design service for 1 unique design",
    basePrice: 40,
    image: "/products/td-bomber-black.jpg", // Placeholder - using existing image
    category: "Mylar Bags",
    active: true,
    hasQuantityOptions: false
  },
  {
    id: "mylar-2-designs",
    name: "2 Designs",
    description: "Custom mylar bag design service for 2 unique designs",
    basePrice: 60,
    image: "/products/WHITE BOMBER.png", // Placeholder - using existing image
    category: "Mylar Bags",
    active: true,
    hasQuantityOptions: false
  },
  {
    id: "mylar-3-designs",
    name: "3 Designs",
    description: "Custom mylar bag design service for 3 unique designs",
    basePrice: 85,
    image: "/products/BLACK TD STUDIOS FRIDAY 13TH HOODIE.png", // Placeholder - using existing image
    category: "Mylar Bags",
    active: true,
    hasQuantityOptions: false
  },
  {
    id: "mylar-4plus-designs",
    name: "4+ Designs",
    description: "Custom mylar bag design service for 4 or more unique designs",
    basePrice: 100,
    image: "/lovable-uploads/bff2ab24-8836-4dfa-836d-bff37b607cfa.png", // Placeholder - using logo
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