export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;      // put images under /public/products/
  category: string;
  active?: boolean;
};

export const PRODUCTS: Product[] = [
  { id: "td-bomber-black", name: "TD BOMBER (Black)", price: 120, image: "/products/td-bomber-black.jpg", category: "Outerwear", active: true },
  { id: "td-bomber-white", name: "TD BOMBER (White)", price: 120, image: "/products/WHITE BOMBER.png", category: "Outerwear", active: true },
  { id: "td-hoodie-black", name: "TD HOODIE (Black)", price: 100, image: "/products/BLACK TD STUDIOS FRIDAY 13TH HOODIE.png", category: "Outerwear", active: true },
  { id: "td-beanie", name: "TD STUDIOS BEANIE", price: 40, image: "/TD STUDIOS BEANIE.png", category: "Hats", active: true },
  { id: "td-championship-hat-black", name: "TD STUDIOS CHAMPIONSHIP HAT (Black)", price: 40, image: "/products/td-studios-championship-hat-black.png", category: "Hats", active: true },
  { id: "td-championship-hat-white", name: "TD STUDIOS CHAMPIONSHIP HAT (White)", price: 40, image: "/products/td-studios-championship-hat-white.png", category: "Hats", active: true },
  { id: "serious-inquiries-only-black", name: "SERIOUS INQUIRIES ONLY (Black)", price: 45, image: "https://i.imgur.com/FwVQ6Je.png", category: "Hats", active: true },
  { id: "serious-inquiries-only-white", name: "SERIOUS INQUIRIES ONLY (White)", price: 45, image: "https://i.imgur.com/MkwrtAB.png", category: "Hats", active: true },
];

export const CATEGORIES = ["All", ...Array.from(new Set(PRODUCTS.map(p => p.category)))];