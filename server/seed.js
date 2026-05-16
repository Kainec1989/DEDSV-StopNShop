import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcryptjs from "bcryptjs";
import Product from "./models/Product.js";
import PromoCode from "./models/promoCode.js";
import User from "./models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const products = [
  // ===== MALE (20 products) =====
  {
    product: "Classic White Shirt",
    price: 29.99,
    description: "A timeless classic white shirt crafted from premium cotton for effortless elegance.",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80",
    category: "male",
    sizes: [{ size: "S", countInStock: 12 }, { size: "M", countInStock: 18 }, { size: "L", countInStock: 10 }, { size: "XL", countInStock: 6 }]
  },
  {
    product: "Slim Fit Chinos",
    price: 54.99,
    description: "Sophisticated slim fit chinos tailored for the modern gentleman.",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80",
    category: "male",
    sizes: [{ size: "30", countInStock: 8 }, { size: "32", countInStock: 14 }, { size: "34", countInStock: 9 }, { size: "36", countInStock: 5 }]
  },
  {
    product: "Leather Jacket",
    price: 149.99,
    description: "A premium full-grain leather jacket that exudes luxury and bold confidence.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
    category: "male",
    sizes: [{ size: "S", countInStock: 4 }, { size: "M", countInStock: 7 }, { size: "L", countInStock: 5 }, { size: "XL", countInStock: 3 }]
  },
  {
    product: "Denim Jeans",
    price: 64.99,
    description: "Expertly crafted denim jeans combining comfort and refined style.",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80",
    category: "male",
    sizes: [{ size: "30", countInStock: 10 }, { size: "32", countInStock: 15 }, { size: "34", countInStock: 8 }, { size: "36", countInStock: 4 }]
  },
  {
    product: "Wool Sweater",
    price: 79.99,
    description: "Luxuriously soft merino wool sweater perfect for sophisticated casual wear.",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80",
    category: "male",
    sizes: [{ size: "S", countInStock: 6 }, { size: "M", countInStock: 11 }, { size: "L", countInStock: 8 }, { size: "XL", countInStock: 4 }]
  },
  {
    product: "Formal Suit",
    price: 299.99,
    description: "An impeccably tailored formal suit crafted for the discerning gentleman.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
    category: "male",
    sizes: [{ size: "S", countInStock: 3 }, { size: "M", countInStock: 5 }, { size: "L", countInStock: 4 }, { size: "XL", countInStock: 2 }]
  },
  {
    product: "Polo Shirt",
    price: 34.99,
    description: "A refined polo shirt made from breathable pique cotton for elevated casual style.",
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&auto=format&fit=crop&q=80",
    category: "male",
    sizes: [{ size: "S", countInStock: 14 }, { size: "M", countInStock: 20 }, { size: "L", countInStock: 12 }, { size: "XL", countInStock: 7 }]
  },
  {
    product: "Cargo Pants",
    price: 59.99,
    description: "Utility meets luxury in these premium cargo pants with a modern tailored fit.",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
    category: "male",
    sizes: [{ size: "30", countInStock: 9 }, { size: "32", countInStock: 13 }, { size: "34", countInStock: 7 }, { size: "36", countInStock: 3 }]
  },
  {
    product: "Trench Coat",
    price: 189.99,
    description: "A classic luxury trench coat with clean lines and exceptional craftsmanship.",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&auto=format&fit=crop&q=80",
    category: "male",
    sizes: [{ size: "S", countInStock: 5 }, { size: "M", countInStock: 8 }, { size: "L", countInStock: 6 }, { size: "XL", countInStock: 3 }]
  },
  {
    product: "Graphic Tee",
    price: 24.99,
    description: "A premium cotton graphic tee featuring exclusive artistic designs.",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80",
    category: "male",
    sizes: [{ size: "S", countInStock: 16 }, { size: "M", countInStock: 22 }, { size: "L", countInStock: 14 }, { size: "XL", countInStock: 8 }]
  },
  {
    product: "Linen Shirt",
    price: 44.99,
    description: "Lightweight luxury linen shirt ideal for warm weather elegance.",
    image: "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=800&auto=format&fit=crop&q=80",
    category: "male",
    sizes: [{ size: "S", countInStock: 10 }, { size: "M", countInStock: 15 }, { size: "L", countInStock: 9 }, { size: "XL", countInStock: 5 }]
  },
  {
    product: "Bomber Jacket",
    price: 129.99,
    description: "A sleek premium bomber jacket blending street style with luxury detailing.",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80",
    category: "male",
    sizes: [{ size: "S", countInStock: 6 }, { size: "M", countInStock: 9 }, { size: "L", countInStock: 7 }, { size: "XL", countInStock: 4 }]
  },
  {
    product: "Tracksuit",
    price: 89.99,
    description: "A luxury athleisure tracksuit crafted for both performance and style.",
    image: "https://images.unsplash.com/photo-1556906781-9a412961a28c?w=800&auto=format&fit=crop&q=80",
    category: "male",
    sizes: [{ size: "S", countInStock: 8 }, { size: "M", countInStock: 12 }, { size: "L", countInStock: 9 }, { size: "XL", countInStock: 5 }]
  },
  {
    product: "Swim Shorts",
    price: 34.99,
    description: "Premium quick-dry swim shorts with a refined fit for the luxury beach experience.",
    image: "https://images.unsplash.com/photo-1565693413579-8ff3fdc1b03b?w=800&auto=format&fit=crop&q=80",
    category: "male",
    sizes: [{ size: "S", countInStock: 11 }, { size: "M", countInStock: 16 }, { size: "L", countInStock: 10 }, { size: "XL", countInStock: 6 }]
  },
  {
    product: "Turtleneck Sweater",
    price: 69.99,
    description: "A sophisticated turtleneck sweater in fine knit for effortless winter luxury.",
    image: "https://images.unsplash.com/photo-1608744882201-52a7f7f3dd60?w=800&auto=format&fit=crop&q=80",
    category: "male",
    sizes: [{ size: "S", countInStock: 7 }, { size: "M", countInStock: 10 }, { size: "L", countInStock: 8 }, { size: "XL", countInStock: 4 }]
  },
  {
    product: "Windbreaker",
    price: 99.99,
    description: "A sleek lightweight windbreaker with premium finish for active luxury living.",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80",
    category: "male",
    sizes: [{ size: "S", countInStock: 5 }, { size: "M", countInStock: 8 }, { size: "L", countInStock: 6 }, { size: "XL", countInStock: 3 }]
  },
  {
    product: "Dress Shirt",
    price: 49.99,
    description: "A finely woven dress shirt designed for formal occasions and business elegance.",
    image: "https://images.unsplash.com/photo-1563630423918-b58f07336ac9?w=800&auto=format&fit=crop&q=80",
    category: "male",
    sizes: [{ size: "S", countInStock: 9 }, { size: "M", countInStock: 14 }, { size: "L", countInStock: 10 }, { size: "XL", countInStock: 5 }]
  },
  {
    product: "Shorts",
    price: 29.99,
    description: "Tailored premium shorts crafted for relaxed yet polished warm weather style.",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=800&auto=format&fit=crop&q=80",
    category: "male",
    sizes: [{ size: "S", countInStock: 12 }, { size: "M", countInStock: 18 }, { size: "L", countInStock: 11 }, { size: "XL", countInStock: 6 }]
  },
  {
    product: "Puffer Jacket",
    price: 159.99,
    description: "A high-end puffer jacket offering superior warmth with a luxurious silhouette.",
    image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&auto=format&fit=crop&q=80",
    category: "male",
    sizes: [{ size: "S", countInStock: 4 }, { size: "M", countInStock: 7 }, { size: "L", countInStock: 5 }, { size: "XL", countInStock: 3 }]
  },
  {
    product: "Casual Blazer",
    price: 119.99,
    description: "A refined casual blazer that effortlessly elevates any smart casual ensemble.",
    image: "https://images.unsplash.com/photo-1555069519-127aadedf1ee?w=800&auto=format&fit=crop&q=80",
    category: "male",
    sizes: [{ size: "S", countInStock: 5 }, { size: "M", countInStock: 8 }, { size: "L", countInStock: 6 }, { size: "XL", countInStock: 3 }]
  },

  // ===== FEMALE (20 products) =====
  {
    product: "Floral Maxi Dress",
    price: 79.99,
    description: "An elegant floral maxi dress crafted from flowing fabric for effortless feminine luxury.",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
    category: "female",
    sizes: [{ size: "XS", countInStock: 7 }, { size: "S", countInStock: 12 }, { size: "M", countInStock: 9 }, { size: "L", countInStock: 5 }]
  },
  {
    product: "Skinny Jeans",
    price: 59.99,
    description: "Premium stretch denim skinny jeans designed to flatter every silhouette.",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
    category: "female",
    sizes: [{ size: "XS", countInStock: 8 }, { size: "S", countInStock: 14 }, { size: "M", countInStock: 10 }, { size: "L", countInStock: 6 }]
  },
  {
    product: "Silk Blouse",
    price: 69.99,
    description: "A luxurious pure silk blouse with a fluid drape for understated elegance.",
    image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&auto=format&fit=crop&q=80",
    category: "female",
    sizes: [{ size: "XS", countInStock: 6 }, { size: "S", countInStock: 11 }, { size: "M", countInStock: 8 }, { size: "L", countInStock: 4 }]
  },
  {
    product: "Mini Skirt",
    price: 44.99,
    description: "A chic premium mini skirt that pairs effortlessly with any luxury wardrobe.",
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&auto=format&fit=crop&q=80",
    category: "female",
    sizes: [{ size: "XS", countInStock: 9 }, { size: "S", countInStock: 13 }, { size: "M", countInStock: 10 }, { size: "L", countInStock: 5 }]
  },
  {
    product: "Wrap Dress",
    price: 64.99,
    description: "A beautifully draped wrap dress that accentuates the figure with timeless grace.",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80",
    category: "female",
    sizes: [{ size: "XS", countInStock: 7 }, { size: "S", countInStock: 12 }, { size: "M", countInStock: 9 }, { size: "L", countInStock: 5 }]
  },
  {
    product: "Crop Top",
    price: 29.99,
    description: "A sleek premium crop top crafted for effortless modern femininity.",
    image: "https://images.unsplash.com/photo-1561344640-2453889cde5b?w=800&auto=format&fit=crop&q=80",
    category: "female",
    sizes: [{ size: "XS", countInStock: 14 }, { size: "S", countInStock: 19 }, { size: "M", countInStock: 13 }, { size: "L", countInStock: 7 }]
  },
  {
    product: "Wide Leg Trousers",
    price: 74.99,
    description: "Flowing wide leg trousers in luxury fabric for a powerful yet graceful silhouette.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
    category: "female",
    sizes: [{ size: "XS", countInStock: 6 }, { size: "S", countInStock: 10 }, { size: "M", countInStock: 8 }, { size: "L", countInStock: 4 }]
  },
  {
    product: "Trench Coat",
    price: 199.99,
    description: "An iconic luxury trench coat tailored to perfection for the modern woman.",
    image: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=800&auto=format&fit=crop&q=80",
    category: "female",
    sizes: [{ size: "XS", countInStock: 4 }, { size: "S", countInStock: 7 }, { size: "M", countInStock: 5 }, { size: "L", countInStock: 3 }]
  },
  {
    product: "Bodycon Dress",
    price: 54.99,
    description: "A stunning bodycon dress that hugs every curve with sophisticated confidence.",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80",
    category: "female",
    sizes: [{ size: "XS", countInStock: 8 }, { size: "S", countInStock: 13 }, { size: "M", countInStock: 10 }, { size: "L", countInStock: 5 }]
  },
  {
    product: "Knit Cardigan",
    price: 84.99,
    description: "A sumptuously soft knit cardigan for effortless layered luxury.",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80",
    category: "female",
    sizes: [{ size: "XS", countInStock: 7 }, { size: "S", countInStock: 11 }, { size: "M", countInStock: 8 }, { size: "L", countInStock: 4 }]
  },
  {
    product: "Pleated Skirt",
    price: 49.99,
    description: "An elegantly pleated skirt in premium fabric that moves beautifully with every step.",
    image: "https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=800&auto=format&fit=crop&q=80",
    category: "female",
    sizes: [{ size: "XS", countInStock: 9 }, { size: "S", countInStock: 14 }, { size: "M", countInStock: 11 }, { size: "L", countInStock: 6 }]
  },
  {
    product: "Off Shoulder Top",
    price: 39.99,
    description: "A sensual off shoulder top crafted from premium fabric for effortless allure.",
    image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=800&auto=format&fit=crop&q=80",
    category: "female",
    sizes: [{ size: "XS", countInStock: 10 }, { size: "S", countInStock: 15 }, { size: "M", countInStock: 11 }, { size: "L", countInStock: 6 }]
  },
  {
    product: "Leather Leggings",
    price: 89.99,
    description: "Sleek luxury leather leggings that combine edge with sophisticated femininity.",
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop&q=80",
    category: "female",
    sizes: [{ size: "XS", countInStock: 6 }, { size: "S", countInStock: 10 }, { size: "M", countInStock: 8 }, { size: "L", countInStock: 4 }]
  },
  {
    product: "Puffer Coat",
    price: 169.99,
    description: "A statement luxury puffer coat offering unmatched warmth with refined style.",
    image: "https://images.unsplash.com/photo-1548778052-311f4bc2b502?w=800&auto=format&fit=crop&q=80",
    category: "female",
    sizes: [{ size: "XS", countInStock: 4 }, { size: "S", countInStock: 7 }, { size: "M", countInStock: 5 }, { size: "L", countInStock: 3 }]
  },
  {
    product: "Satin Slip Dress",
    price: 94.99,
    description: "A glamorous satin slip dress with a liquid finish for effortless evening luxury.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80",
    category: "female",
    sizes: [{ size: "XS", countInStock: 6 }, { size: "S", countInStock: 10 }, { size: "M", countInStock: 7 }, { size: "L", countInStock: 4 }]
  },
  {
    product: "Denim Jacket",
    price: 109.99,
    description: "A premium denim jacket with luxury detailing for elevated casual style.",
    image: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=800&auto=format&fit=crop&q=80",
    category: "female",
    sizes: [{ size: "XS", countInStock: 5 }, { size: "S", countInStock: 9 }, { size: "M", countInStock: 7 }, { size: "L", countInStock: 4 }]
  },
  {
    product: "Blazer Dress",
    price: 119.99,
    description: "A power dressing blazer dress combining sharp tailoring with feminine grace.",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80",
    category: "female",
    sizes: [{ size: "XS", countInStock: 5 }, { size: "S", countInStock: 8 }, { size: "M", countInStock: 6 }, { size: "L", countInStock: 3 }]
  },
  {
    product: "Ruffle Blouse",
    price: 44.99,
    description: "A romantic ruffle blouse in delicate premium fabric for feminine elegance.",
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&auto=format&fit=crop&q=80",
    category: "female",
    sizes: [{ size: "XS", countInStock: 8 }, { size: "S", countInStock: 13 }, { size: "M", countInStock: 10 }, { size: "L", countInStock: 5 }]
  },
  {
    product: "Jogger Pants",
    price: 54.99,
    description: "Luxurious jogger pants crafted for effortless comfort without compromising style.",
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&auto=format&fit=crop&q=80",
    category: "female",
    sizes: [{ size: "XS", countInStock: 9 }, { size: "S", countInStock: 14 }, { size: "M", countInStock: 11 }, { size: "L", countInStock: 6 }]
  },
  {
    product: "Cashmere Sweater",
    price: 139.99,
    description: "An indulgently soft cashmere sweater offering the pinnacle of cosy luxury.",
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&auto=format&fit=crop&q=80",
    category: "female",
    sizes: [{ size: "XS", countInStock: 5 }, { size: "S", countInStock: 8 }, { size: "M", countInStock: 6 }, { size: "L", countInStock: 3 }]
  },

  // ===== JEWELLERY (20 products) =====
  { product: "Diamond Stud Earrings", price: 199.99, description: "Brilliant cut diamond stud earrings set in 18k white gold for timeless elegance.", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80", category: "jewerely", sizes: [{ size: "One Size", countInStock: 15 }] },
  { product: "Pearl Necklace", price: 149.99, description: "A classic strand of lustrous pearls embodying timeless sophistication.", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80", category: "jewerely", sizes: [{ size: "One Size", countInStock: 12 }] },
  { product: "Gold Bangle", price: 89.99, description: "A sleek polished gold bangle crafted for understated everyday luxury.", image: "https://images.unsplash.com/photo-1573408301185-9519f94f0af4?w=800&auto=format&fit=crop&q=80", category: "jewerely", sizes: [{ size: "One Size", countInStock: 18 }] },
  { product: "Silver Ring", price: 49.99, description: "A minimalist sterling silver ring with refined detailing for effortless style.", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80", category: "jewerely", sizes: [{ size: "One Size", countInStock: 25 }] },
  { product: "Rose Gold Bracelet", price: 119.99, description: "A delicate rose gold bracelet radiating warmth and feminine luxury.", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop&q=80", category: "jewerely", sizes: [{ size: "One Size", countInStock: 14 }] },
  { product: "Sapphire Pendant", price: 249.99, description: "A stunning sapphire pendant set in platinum for breathtaking luxury.", image: "https://images.unsplash.com/photo-1596944924591-b8543de9a949?w=800&auto=format&fit=crop&q=80", category: "jewerely", sizes: [{ size: "One Size", countInStock: 8 }] },
  { product: "Hoop Earrings", price: 59.99, description: "Classic gold hoop earrings that effortlessly elevate any outfit.", image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80", category: "jewerely", sizes: [{ size: "One Size", countInStock: 22 }] },
  { product: "Tennis Bracelet", price: 299.99, description: "An exquisite diamond tennis bracelet set in 18k gold for ultimate glamour.", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80", category: "jewerely", sizes: [{ size: "One Size", countInStock: 7 }] },
  { product: "Charm Bracelet", price: 79.99, description: "A beautifully crafted charm bracelet telling your unique story in gold.", image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop&q=80", category: "jewerely", sizes: [{ size: "One Size", countInStock: 16 }] },
  { product: "Gold Chain Necklace", price: 179.99, description: "A bold yet refined gold chain necklace that commands attention.", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&auto=format&fit=crop&q=80", category: "jewerely", sizes: [{ size: "One Size", countInStock: 11 }] },
  { product: "Emerald Ring", price: 349.99, description: "A magnificent emerald ring set in 18k gold radiating rare luxury.", image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&auto=format&fit=crop&q=80", category: "jewerely", sizes: [{ size: "One Size", countInStock: 6 }] },
  { product: "Silver Anklet", price: 39.99, description: "A dainty sterling silver anklet adding subtle elegance to every step.", image: "https://images.unsplash.com/photo-1619119069152-a2b331eb392a?w=800&auto=format&fit=crop&q=80", category: "jewerely", sizes: [{ size: "One Size", countInStock: 20 }] },
  { product: "Ruby Pendant", price: 279.99, description: "A captivating ruby pendant in 18k gold evoking passion and luxury.", image: "https://images.unsplash.com/photo-1589207212797-f5b8e4c5c68b?w=800&auto=format&fit=crop&q=80", category: "jewerely", sizes: [{ size: "One Size", countInStock: 7 }] },
  { product: "Crystal Earrings", price: 44.99, description: "Sparkling crystal drop earrings that catch the light beautifully.", image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&auto=format&fit=crop&q=80", category: "jewerely", sizes: [{ size: "One Size", countInStock: 24 }] },
  { product: "Layered Necklace", price: 69.99, description: "A stunning layered necklace set creating effortless bohemian luxury.", image: "https://images.unsplash.com/photo-1561828995-aa79a2db86dd?w=800&auto=format&fit=crop&q=80", category: "jewerely", sizes: [{ size: "One Size", countInStock: 17 }] },
  { product: "Cuff Bracelet", price: 94.99, description: "A bold sculptural cuff bracelet making a powerful luxury statement.", image: "https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&auto=format&fit=crop&q=80", category: "jewerely", sizes: [{ size: "One Size", countInStock: 13 }] },
  { product: "Drop Earrings", price: 54.99, description: "Elegant drop earrings in gold with delicate detailing for refined glamour.", image: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=800&auto=format&fit=crop&q=80", category: "jewerely", sizes: [{ size: "One Size", countInStock: 19 }] },
  { product: "Infinity Ring", price: 64.99, description: "A symbolic infinity ring in polished gold representing eternal luxury.", image: "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=800&auto=format&fit=crop&q=80", category: "jewerely", sizes: [{ size: "One Size", countInStock: 21 }] },
  { product: "Birthstone Necklace", price: 129.99, description: "A personalised birthstone necklace crafted in gold for meaningful luxury.", image: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&auto=format&fit=crop&q=80", category: "jewerely", sizes: [{ size: "One Size", countInStock: 10 }] },
  { product: "Statement Ring", price: 74.99, description: "A bold statement ring in premium gold that demands to be noticed.", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80", category: "jewerely", sizes: [{ size: "One Size", countInStock: 15 }] }
];

const promoCodes = [
  { code: "WELCOME10", discount: 10 },
  { code: "LOCAL20", discount: 20 },
];

/**
 * Creates or replaces the local admin user used for a fresh development database.
 *
 * @returns {Promise<void>}
 */
async function seedAdminUser() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@localhost.test";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin12345!";
  const adminName = process.env.SEED_ADMIN_NAME || "Local Admin";

  const hashedPassword = await bcryptjs.hash(adminPassword, 12);
  await User.findOneAndUpdate(
    { email: adminEmail },
    {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      verificationToken: undefined,
      verificationTokenExpireAt: undefined,
      resetPasswordToken: undefined,
      resetPasswordExpireAt: undefined,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  console.log(`Admin user ready: ${adminEmail}`);
}

const seedDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is required. Set it in server/.env before seeding.");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to:", mongoose.connection.host);

    await Product.deleteMany({});
    console.log("Existing products cleared...");
    await Product.insertMany(products);
    console.log(`${products.length} products seeded successfully! ✅`);

    await PromoCode.deleteMany({});
    await PromoCode.insertMany(promoCodes);
    console.log(`${promoCodes.length} promo codes seeded successfully! ✅`);

    await seedAdminUser();

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
