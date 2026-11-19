/**
 * Pearl Oasis — Emerald Elegance (Kohat, Pakistan)
 * Luxury hospitality data structured with verified details and verified menu categories.
 */

import karahiImg from '../assets/images/opt/dish-mutton-karahi.webp';
import kungPaoImg from '../assets/images/opt/chicken-fried-rice.webp';
import burgerImg from '../assets/images/opt/dish-oasis-burger.webp';
import malaiBotiImg from '../assets/images/opt/malai-boti.webp';
import feastImg from '../assets/images/opt/hero-oasis-feast.webp';
import chowmeinImg from '../assets/images/opt/chowmen.webp';
import interiorImg from '../assets/images/opt/warm-modern-interior.webp';
import diningHallImg from '../assets/images/opt/second-section.webp';
import entranceImg from '../assets/images/opt/hero-emerald-entrance.webp';

export const RESTAURANT_INFO = {
  name: "Pearl Oasis",
  tagline: "Where Pakistani Heritage Meets Exceptional Flavors",
  city: "Kohat",
  region: "Khyber Pakhtunkhwa, Pakistan",
  address: "Kohat City Centre, near KDA Gate No. 1, Kohat, Pakistan",
  phone: "+92 332 7515538",
  whatsapp: "+923327515538",
  email: "reservations@pearloasis.pk",
  openingHours: {
    days: "Monday – Sunday",
    hours: "11:00 AM – 11:00 PM",
    fridayBreak: "1:00 PM – 2:30 PM",
  },
  mapsUrl: "https://maps.app.goo.gl/LeJogix9azNPMHiq7",
  status: "Open Daily: 11:00 AM – 11:00 PM"
};

export const SIGNATURE_DISHES_LIST = [
  {
    id: "sig-karahi",
    name: "Desi Chicken Karahi",
    category: "Pakistani Specialty",
    categoryKey: "pakistani",
    tagline: "Simmered over high flame in an iron wok with fresh ginger slivers & green chilies",
    description: "Tender chicken cooked with ripe vine tomatoes, hand-crushed black peppercorns, julienned ginger, and aromatic green chilies. Served piping hot with tandoori naan.",
    portion: "Full Karahi (Serves 3-4) · Half Karahi (Serves 2)",
    prepTime: "25 mins",
    image: karahiImg,
  },
  {
    id: "sig-kungpao",
    name: "Szechuan Kung Pao Chicken",
    category: "Chinese Wok Craft",
    categoryKey: "chinese",
    tagline: "High-heat flash-seared chicken with dry roasted red chilies & golden peanuts",
    description: "Tender chicken breast seared in a raging wok, coated in a sweet-tangy Szechuan reduction with crisp peppers, scallions, and toasted peanuts.",
    portion: "Sharing Bowl · Ideal with Egg Fried Rice",
    prepTime: "15 mins",
    image: kungPaoImg,
  },
  {
    id: "sig-zinger",
    name: "Crispy Firecracker Zinger",
    category: "Artisan Fast Food",
    categoryKey: "fastfood",
    tagline: "Golden double-dredged chicken fillet with jalapeño aioli on buttered brioche",
    description: "Twenty-four-hour buttermilk marinated chicken thigh crisped to a golden crunch, layered with sharp cheddar, crisp iceberg, and house sauce.",
    portion: "Deluxe Combo with Crinkle Fries & Chilled Dip",
    prepTime: "12 mins",
    image: burgerImg,
  },
  {
    id: "sig-seekh",
    name: "Charcoal Seekh & Malai Boti",
    category: "BBQ & Hearth",
    categoryKey: "bbq",
    tagline: "Flame-grilled skewers basted with fresh dairy cream, cardamom & green herb glaze",
    description: "Succulent boneless chicken morsels marinated in pure cream, cardamom, and gentle green chili paste, char-grilled over live embers.",
    portion: "Skewer Platter with Mint Raita & Fresh Salad",
    prepTime: "20 mins",
    image: malaiBotiImg,
  }
];

export const MENU_CATEGORIES = [
  {
    id: "pakistani",
    title: "PAKISTANI KARAHI",
    subtitle: "Heritage Hearth & Clay Pots",
    description: "Ancestral Shinwari karahis, aromatic handis, and freshly baked clay tandoor naans cooked with unadulterated spices.",
    image: karahiImg,
    items: [
      { name: "Mutton Karahi", portion: "Half & Full Karahi", heat: "Balanced Spice", price: "Half: Rs. 1,890 | Full: Rs. 3,790", desc: "Tender bone-in mutton slow-cooked to perfection in an authentic iron wok with ripe vine tomatoes, julienned ginger, and freshly cracked black pepper.", image: karahiImg },
      { name: "Murgh Makhni Handi (Boneless)", portion: "Clay Pot (Serves 2-3)", heat: "Mild & Creamy", desc: "Boneless chicken simmered with dairy cream, fenugreek and cardamom.", image: feastImg },
      { name: "Kohati Chapli Kabab Platter", portion: "Platter of 3 large kababs", heat: "Medium", desc: "Coarse hand-minced beef blended with anardana, coriander and charred tomato.", image: malaiBotiImg },
      { name: "Tandoori Roghani & Sesame Naan", portion: "Basket of 2 warm naans", heat: "Clay Oven", desc: "Soft leavened flatbread brushed with desi ghee and toasted sesame.", image: feastImg }
    ]
  },
  {
    id: "chinese",
    title: "Chinese Cuisine",
    subtitle: "High-Heat Wok Specialties",
    description: "Authentic wok tossing locking in crisp textures, balanced glazes, and savory aromatics.",
    image: kungPaoImg,
    items: [
      { name: "Chicken Manchurian with Rice", portion: "Single Serving with Rice", heat: "Sweet & Tangy", price: "Rs. 1,250", desc: "Succulent crispy chicken bites simmered in a luscious sweet and zesty ginger-garlic sauce, served alongside fragrant wok-tossed egg fried rice.", image: kungPaoImg },
      { name: "Pearl Special Dragon Chow Mein", portion: "Wok Skillet Portion", heat: "Mild Savory", desc: "Stir-fried noodles with shredded chicken, carrots, cabbage and dark soy.", image: chowmeinImg },
      { name: "Szechuan Kung Pao Chicken", portion: "Deep Sharing Bowl", heat: "Lively & Zesty", desc: "Wok-seared diced chicken, roasted dry chilies, peanuts and scallions.", image: kungPaoImg },
      { name: "Traditional Hot & Sour Silk Soup", portion: "Tureen or Single Bowl", heat: "Peppery Tang", desc: "Simmering chicken broth, bamboo shoots, egg ribbons, and cracked pepper.", image: feastImg }
    ]
  },
  {
    id: "fastfood",
    title: "Fast Food",
    subtitle: "Handcrafted Modern Classics",
    description: "Freshly smashed patties, golden brioche buns, and gourmet sides crafted with attention to texture.",
    image: burgerImg,
    items: [
      { name: "Classic Chicken Burger", portion: "Single Burger", heat: "Gentle", price: "Rs. 600", desc: "Tender seasoned grilled chicken patty nestled in a soft toasted sesame bun with crisp iceberg lettuce, ripe tomatoes, and rich creamy garlic mayo.", image: burgerImg },
      { name: "The Oasis Smash Supreme", portion: "Double Burger with Seasoned Fries", heat: "Savory Mild", desc: "Double pure beef smashed patties with crispy lacy edges, cheddar and caramelized relish.", image: burgerImg },
      { name: "Crispy Firecracker Zinger", portion: "Deluxe Combo with Crinkle Fries", heat: "Spicy", desc: "Buttermilk fried chicken breast, fiery jalapeno aioli, lettuce on sesame brioche.", image: burgerImg },
      { name: "Loaded Oasis Overdrive Fries", portion: "Family Sharing Tray", heat: "Medium", desc: "Crisp skin-on fries smothered in cheddar sauce, minced beef and scallions.", image: burgerImg }
    ]
  },
  {
    id: "bbq",
    title: "Traditional BBQ",
    subtitle: "Live Charcoal Hearth",
    description: "Skewered prime cuts char-broiled over sheesham embers for intoxicating smokiness.",
    image: malaiBotiImg,
    items: [
      { name: "Chicken Malai Boti", portion: "10 pcs Skewers", heat: "Mild & Creamy", price: "Rs. 1,450", desc: "Melt-in-your-mouth boneless chicken cubes marinated in fresh heavy cream, mild aromatic spices, and green cardamoms, grilled gently over live charcoal.", image: malaiBotiImg },
      { name: "Reshmi Malai Boti Platter", portion: "6 Skewered Pieces", heat: "Mild & Creamy", desc: "Tender boneless chicken marinated in cream, green chilies and mild herbs.", image: malaiBotiImg },
      { name: "Live Charcoal Mutton Tikka", portion: "Skewer Platter with Chutney", heat: "Natural Salt Grill", desc: "Prime mountain mutton cubes grilled with pure fat cushions over glowing coals.", image: malaiBotiImg },
      { name: "Smoky Beef Seekh Kebabs", portion: "4 Long Skewers", heat: "Medium Spice", desc: "Fine minced beef spiced with roasted cumin, mint, and crushed coriander seeds.", image: malaiBotiImg }
    ]
  }
];

export const GALLERY_ITEMS = [
  {
    id: "g1",
    title: "Grand Restaurant Entrance",
    category: "Architecture",
    image: entranceImg,
    span: "col-span-1 sm:col-span-2 row-span-2 aspect-[16/10] sm:aspect-auto"
  },
  {
    id: "g2",
    title: "Desi Chicken Karahi",
    category: "Pakistani Specialty",
    image: karahiImg,
    span: "col-span-1 row-span-1 aspect-square"
  },
  {
    id: "g3",
    title: "Emerald Dining Hall",
    category: "Interior",
    image: diningHallImg,
    span: "col-span-1 row-span-1 aspect-square"
  },
  {
    id: "g4",
    title: "Chandelier Ambiance",
    category: "Ambiance",
    image: interiorImg,
    span: "col-span-1 sm:col-span-2 row-span-1 aspect-[16/9]"
  },
  {
    id: "g5",
    title: "Dragon Chow Mein",
    category: "Chinese Wok",
    image: chowmeinImg,
    span: "col-span-1 row-span-1 aspect-square"
  },
  {
    id: "g6",
    title: "Charcoal Malai Boti",
    category: "BBQ Hearth",
    image: malaiBotiImg,
    span: "col-span-1 row-span-1 aspect-square"
  }
];

export const ROW_ONE_TESTIMONIALS = [
  {
    id: "rev-1",
    name: "Qaiser Shah",
    tag: "Local Guide",
    rating: 5,
    quote: "It was amazing...1st talk about food. I ordered burgers and ice creme. Within 10 to 15mins the order was on our table, i will give taste 10/10. Ice creem was served later but that was not good ...i would say average. Dnt know other items bcz didnt tasted. Atmosphere was great, staff was professional. Neat and clean. Service and atmosphere was excellent."
  },
  {
    id: "rev-2",
    name: "Muhammad Waseem Akhtar",
    tag: "Verified Customer",
    rating: 5,
    quote: "both the environment and food were amazing.. Firstly the prices seemed a little high but when I get my food it was really price worthy. so 10/10"
  },
  {
    id: "rev-3",
    name: "Momin",
    tag: "Local Guide",
    rating: 5,
    quote: "Pearls Oasis, located in the KDA area of Kohat, is renowned for its exceptional ambiance and top-notch cuisine. The restaurant offers a diverse menu that caters to various tastes, ensuring a memorable dining experience for all patrons. Whether you're planning a family dinner, a romantic evening, or a gathering with friends, Pearls Oasis provides the perfect setting to enjoy delicious food in a welcoming atmosphere."
  },
  {
    id: "rev-4",
    name: "Fiaza Moin",
    tag: "Verified Customer",
    rating: 5,
    quote: "We had a party for my cousin and had a great time. Food was fantastic as always. We ordered 4 person platter , Dhaka Chicken, Egg Fried Rice with cold beverages . Every single item was made on point. Perfectly flavored and well balanced spices. Latif served us our meal. He was very friendly and courteous. Pearl Oasis will always be on our highly recommended places,"
  },
  {
    id: "rev-5",
    name: "Muhammad Usman",
    tag: "Local Guide",
    rating: 5,
    quote: "Great & memorable experience Food is great and so is service & aroma Must visit with family"
  }
];

export const ROW_TWO_TESTIMONIALS = [
  {
    id: "rev-6",
    name: "Ozair Paracha",
    tag: "Verified Customer",
    rating: 5,
    quote: "Dear Pearl Oasis Restaurant Team, I am writing to express my sincere appreciation for the exceptional dining experience my family and I had during our recent visit. Your staff's warm hospitality, attentive service, and dedication to excellence made our evening truly unforgettable. Thank you for your hard work and commitment to providing outstanding service. Best regards, Ozair Paracha."
  },
  {
    id: "rev-7",
    name: "RAJA SAAD",
    tag: "Local Guide",
    rating: 5,
    quote: "Best food here I love this place atmosphere is very nice staff is good Everyone try food this resturent and specially try Chinese item its Amazing"
  },
  {
    id: "rev-8",
    name: "M Israr",
    tag: "Verified Customer",
    rating: 5,
    quote: "Extremely high quality of food in kohat. Best for high budget travelers"
  },
  {
    id: "rev-9",
    name: "Arslan Afridi",
    tag: "Local Guide",
    rating: 5,
    quote: "The customer service was outstanding, and the food was expertly prepared, ensuring that both quality and portion sizes were highly satisfactory."
  },
  {
    id: "rev-10",
    name: "Haider Ali",
    tag: "Local Guide",
    rating: 5,
    quote: "I recently had the pleasure of dining at Pearl Oasis, and I must say, it was an unforgettable experience from start to finish. This restaurant truly lives up to its name, offering a serene and luxurious escape that feels like discovering a hidden gem."
  }
];

export const TESTIMONIALS_LIST = [...ROW_ONE_TESTIMONIALS, ...ROW_TWO_TESTIMONIALS];
