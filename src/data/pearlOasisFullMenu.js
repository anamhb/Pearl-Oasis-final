/**
 * Pearl Oasis Restaurant — Complete Food & Beverage Menu
 * Source of Truth: pearl_oasis_restaurant_menu.txt
 * 
 * Strict compliance with all 16 categories, dish names, exact prices,
 * and variations (Half/Full, Chicken/Beef, Small/Med/Large/Family, Half kg/1kg, 1L/1.5L).
 */

import burgerImg from '../assets/images/opt/dish-oasis-burger.webp';
import malaiBotiImg from '../assets/images/opt/malai-boti.webp';
import feastImg from '../assets/images/opt/hero-oasis-feast.webp';
import chowmeinImg from '../assets/images/opt/chowmen.webp';
import oasisSpecialSoupImg from '../assets/Menu_images/pearl oasis special soup.webp';
import hotAndSourSoupImg from '../assets/Menu_images/hot and sour soup.webp';
import chickenCornSoupImg from '../assets/Menu_images/chicken corn soup.webp';
import vegetableSoupImg from '../assets/images/opt/vegetable-soup.webp';
import chickenManchurianImg from '../assets/Menu_images/chicken manchurain with rice.jpg';
import chickenChiliDryImg from '../assets/Menu_images/chicken chili dry with rice.webp';
import chickenShashlikImg from '../assets/Menu_images/chicken shashlik with rice.jpg';
import chickenChowMeinImg from '../assets/Menu_images/chicken chowmen.webp';
import chickenFriedRiceImg from '../assets/Menu_images/chicken fried rice.jpg';
import vegetableFriedRiceImg from '../assets/Menu_images/vegetable fried rice.jpg';
import oasisKabliPulaoImg from '../assets/Menu_images/oasis kabli pulao.jpg';
import sadaPulaoImg from '../assets/Menu_images/sada pulao.jpg';
import chickenAchariKarahiImg from '../assets/Menu_images/chicken achari karahi.webp';
import chickenBlackPepperKarahiImg from '../assets/Menu_images/chicken black pepper karahi.webp';
import chickenKarahiImg from '../assets/Menu_images/chicken karahi.jpg';
import chickenWhiteKarahiImg from '../assets/Menu_images/chicken white karahi.webp';
import muttonBlackPepperKarahiImg from '../assets/Menu_images/mutton black peeper karahi.webp';
import muttonKarahiImg from '../assets/Menu_images/mutton karahi.jpg';
import muttonWhiteKarahiImg from '../assets/Menu_images/mutton white karahi.jpg';
import chickenAchariHandiImg from '../assets/Menu_images/chicken achari handi.webp';
import chickenBlackPepperHandiImg from '../assets/Menu_images/chicken black pepper handi.jpg';
import chickenHandiImg from '../assets/Menu_images/chicken handi.jpg';
import chickenMughlaiHandiImg from '../assets/Menu_images/chicken mughalai handi.webp';
import chickenWhiteHandiImg from '../assets/Menu_images/chicken white handi.webp';
import chickenBotiImg from '../assets/Menu_images/chicken boti.jpg';
import chickenMalaiBotiImg from '../assets/Menu_images/chicken malai boti.webp';
import chickenTikkaLegImg from '../assets/Menu_images/chicken tikka leg.webp';
import chickenTikkaChestImg from '../assets/Menu_images/chicken tikka chest.webp';
import muttonTikkaBotiImg from '../assets/Menu_images/mtton tikka boti.webp';
import chickenReshamiKababImg from '../assets/Menu_images/chicken reshami kabab.webp';
import batairImg from '../assets/Menu_images/batair.webp';
import bonelessFishHalfKgImg from '../assets/Menu_images/boneless fish half kg.jpg';
import bonelessFish1KgImg from '../assets/Menu_images/boneless fish 1 kg.jpg';
import oasisBbqPlatter2PersonsImg from '../assets/Menu_images/oasis BBQ platter 2 persons.jpg';
import oasisBbqPlatter3To4PersonsImg from '../assets/Menu_images/oasis BBQ platter 3 to 4 persons.jpg';
import oasisBbqPlatter5To6PersonsImg from '../assets/Menu_images/oasis BBQ platter 5 to 6 persons.jpg';
import cheeseNaanImg from '../assets/Menu_images/cheese naan.webp';
import garlicNaanImg from '../assets/Menu_images/garlic naan.webp';
import kalwanjiNaanImg from '../assets/Menu_images/kalwanji naan.webp';
import plainNaanImg from '../assets/Menu_images/plain naan.webp';
import roghniNaanImg from '../assets/Menu_images/roghni naan.webp';
import blueLagoonImg from '../assets/Menu_images/blue lagoon.jpg';
import freshLemonadeImg from '../assets/Menu_images/fresh lemonade.webp';
import freshLimeImg from '../assets/Menu_images/fresh lime.jpg';
import hotCoffeeImg from '../assets/Menu_images/hot coffee.webp';
import hotTeaImg from '../assets/Menu_images/hot tea.webp';
import mintMargaritaImg from '../assets/Menu_images/mint margritta.webp';
import softDrinkCanImg from '../assets/Menu_images/soft drink can.webp';
import softDrinkImg from '../assets/Menu_images/soft drink.jpg';
import waterImg from '../assets/Menu_images/water.jpg';
import russianSaladImg from '../assets/Menu_images/russian salad.jpg';
import freshSaladImg from '../assets/Menu_images/fresh salad.webp';
import zeeraRaitaImg from '../assets/Menu_images/zeera raita.webp';
import mintSauceImg from '../assets/Menu_images/mint sauce.jpg';
import mixIceCreamImg from '../assets/Menu_images/mix ice-cream 2 scoops.jpg';
import specialIceCreamImg from '../assets/Menu_images/special ice-cream 2 scoops.jpg';
import fishAndChipsImg from '../assets/Menu_images/fish and chips.jpg';
import crispyFingerFishImg from '../assets/Menu_images/crispy finger fish.jpg';
import plainFriesImg from '../assets/Menu_images/plain fries.webp';
import supremeLoadedFriesImg from '../assets/Menu_images/supreme loaded fries.webp';
import hotWingsImg from '../assets/Menu_images/hot wings.jpg';
import nuggetsImg from '../assets/Menu_images/nuggets.jpg';
import classicChickenBurgerImg from '../assets/Menu_images/classic chicken burger.jpg';
import classicBeefBurgerImg from '../assets/Menu_images/classic beef burger.jpg';
import crunchyZingerBurgerImg from '../assets/Menu_images/crunchy zinger burger.webp';
import americanSmashedBeefBurgerImg from '../assets/Menu_images/american smashed beef burger.jpg';
import jalapenoGrilledChickenBurgerImg from '../assets/Menu_images/jalapeño grilled chicken burger.jpg';
import mexicanSteakImg from '../assets/Menu_images/mexican steak.webp';
import mushroomSteakImg from '../assets/Menu_images/mushroom steak.webp';
import alfredoPastaImg from '../assets/Menu_images/alfredo pasta.webp';
import lasagnaPastaImg from '../assets/Menu_images/lasagna pasta.jpg';
import mexicanWrapImg from '../assets/Menu_images/mexicon wrap.jpg';
import lebaneseWrapImg from '../assets/Menu_images/labenese wrap.jpg';
import bbqPizzaImg from '../assets/Menu_images/BBQ.webp';
import chickenSupremePizzaImg from '../assets/Menu_images/chicken supreme.jpg';
import crownCrustPizzaImg from '../assets/Menu_images/crown crust.webp';
import fajitaPizzaImg from '../assets/Menu_images/fajita.webp';
import oasisStarPizzaImg from '../assets/Menu_images/oasis star pizza.webp';
import tikkaPizzaImg from '../assets/Menu_images/tikka.webp';

export const FULL_MENU_DATA = [
  {
    id: "soups",
    name: "Soups",
    badge: "Serves 2 Persons",
    description: "Hearty, aromatic slow-simmered broths served fresh for two persons.",
    items: [
      {
        id: "soup-special",
        name: "Oasis Special Soup",
        portion: "Serves 2 Persons",
        price: 950,
        formattedPrice: "Rs. 950",
        description: "Chef's signature rich broth featuring tender chicken, fresh garden vegetables, and delicate egg threads.",
        image: oasisSpecialSoupImg,
      },
      {
        id: "soup-hot-sour",
        name: "Hot & Sour Soup",
        portion: "Serves 2 Persons",
        price: 850,
        formattedPrice: "Rs. 850",
        description: "Traditional spicy and tangy peppery broth infused with shredded chicken, bamboo shoots, and black pepper.",
        image: hotAndSourSoupImg,
      },
      {
        id: "soup-chicken-corn",
        name: "Chicken Corn Soup",
        portion: "Serves 2 Persons",
        price: 850,
        formattedPrice: "Rs. 850",
        description: "Classic velvety broth with golden sweet corn ribbons and hand-shredded chicken breast.",
        image: chickenCornSoupImg,
      },
      {
        id: "soup-vegetable",
        name: "Vegetable Soup",
        portion: "Serves 2 Persons",
        price: 850,
        formattedPrice: "Rs. 850",
        description: "Light, clear garden vegetable broth simmered with seasonal greens and aromatic white pepper.",
        image: vegetableSoupImg,
      }
    ]
  },
  {
    id: "chinese",
    name: "Chinese Cuisine",
    badge: "Wok Craft",
    description: "High-heat flash-seared wok specialties served piping hot.",
    items: [
      {
        id: "chinese-manchurian",
        name: "Chicken Manchurian with Rice (Single)",
        portion: "Single Serving with Rice",
        price: 1250,
        formattedPrice: "Rs. 1,250",
        description: "Crispy chicken cubes tossed in ginger-garlic and mild chili glaze, served alongside egg fried rice.",
        image: chickenManchurianImg,
      },
      {
        id: "chinese-chili-dry",
        name: "Chicken Chili Dry with Rice (Single)",
        portion: "Single Serving with Rice",
        price: 1250,
        formattedPrice: "Rs. 1,250",
        description: "Sliced chicken flash-fried with fresh slit green chilies and dark soy reduction, served with egg rice.",
        image: chickenChiliDryImg,
      },
      {
        id: "chinese-shashlik",
        name: "Chicken Shashlik with Rice (Single)",
        portion: "Single Serving with Rice",
        price: 1250,
        formattedPrice: "Rs. 1,250",
        description: "Tender chicken skewers with sweet bell peppers and onions in a tangy tomato glaze with rice.",
        image: chickenShashlikImg,
      },
      {
        id: "chinese-chow-mein",
        name: "Chicken Chow Mein",
        portion: "Wok Skillet Portion",
        price: 990,
        formattedPrice: "Rs. 990",
        description: "Stir-fried noodles with shredded chicken, crisp cabbage, spring onions, and savory seasoning.",
        image: chickenChowMeinImg,
      }
    ]
  },
  {
    id: "rice",
    name: "Oasis Rice",
    badge: "Aromatic Grains",
    description: "Long-grain basmati selections and house-special pilafs.",
    items: [
      {
        id: "rice-chicken-fried",
        name: "Chicken Fried Rice",
        portion: "Sharing Plate",
        price: 990,
        formattedPrice: "Rs. 990",
        description: "Fragrant wok-tossed basmati with diced chicken, golden egg flakes, and scallions.",
        image: chickenFriedRiceImg,
      },
      {
        id: "rice-veg-fried",
        name: "Vegetable Fried Rice",
        portion: "Sharing Plate",
        price: 990,
        formattedPrice: "Rs. 990",
        description: "Tossed long-grain basmati with diced garden carrots, sweet peas, and cabbage.",
        image: vegetableFriedRiceImg,
      },
      {
        id: "rice-kabuli-pulao",
        name: "Oasis Kabuli Pulao",
        portion: "Generous Platter",
        price: 1350,
        formattedPrice: "Rs. 1,350",
        description: "Traditional Afghan-style fragrant rice garnished with caramelized carrots, raisins, and roasted almonds.",
        image: oasisKabliPulaoImg,
      },
      {
        id: "rice-sada-pulao",
        name: "Sada Pulao",
        portion: "Regular Bowl",
        price: 750,
        formattedPrice: "Rs. 750",
        description: "Aromatic basmati rice tempered with whole cumin and whole spices.",
        image: sadaPulaoImg,
      }
    ]
  },
  {
    id: "karahi",
    name: "Pakistani Karahi",
    badge: "Half / Full Options",
    description: "Cooked fresh to order in seasoned iron woks over high open fire.",
    items: [
      {
        id: "karahi-chicken",
        name: "Chicken Karahi",
        hasVariations: true,
        variationName: "Size",
        variations: [
          { name: "Half", price: 1190, formattedPrice: "Rs. 1,190" },
          { name: "Full", price: 2090, formattedPrice: "Rs. 2,090" }
        ],
        price: 1190,
        formattedPrice: "Half: Rs. 1,190 | Full: Rs. 2,090",
        description: "Tender bone-in chicken simmered with ripe vine tomatoes, hand-crushed black pepper, and julienned ginger.",
        image: chickenKarahiImg,
      },
      {
        id: "karahi-chicken-black-pepper",
        name: "Chicken Black Pepper Karahi",
        hasVariations: true,
        variationName: "Size",
        variations: [
          { name: "Half", price: 1290, formattedPrice: "Rs. 1,290" },
          { name: "Full", price: 2390, formattedPrice: "Rs. 2,390" }
        ],
        price: 1290,
        formattedPrice: "Half: Rs. 1,290 | Full: Rs. 2,390",
        description: "Chicken wok-tossed with freshly crushed black peppercorns, green chilies, and clarified butter.",
        image: chickenBlackPepperKarahiImg,
      },
      {
        id: "karahi-chicken-white",
        name: "Chicken White Karahi",
        hasVariations: true,
        variationName: "Size",
        variations: [
          { name: "Half", price: 1290, formattedPrice: "Rs. 1,290" },
          { name: "Full", price: 2390, formattedPrice: "Rs. 2,390" }
        ],
        price: 1290,
        formattedPrice: "Half: Rs. 1,290 | Full: Rs. 2,390",
        description: "Velvety karahi prepared with fresh dairy cream, yogurt, white pepper, and fragrant green cardamoms.",
        image: chickenWhiteKarahiImg,
      },
      {
        id: "karahi-chicken-achari",
        name: "Chicken Achari Karahi",
        hasVariations: true,
        variationName: "Size",
        variations: [
          { name: "Half", price: 1290, formattedPrice: "Rs. 1,290" },
          { name: "Full", price: 2390, formattedPrice: "Rs. 2,390" }
        ],
        price: 1290,
        formattedPrice: "Half: Rs. 1,290 | Full: Rs. 2,390",
        description: "Infused with traditional pickling spices including mustard seeds, kalonji, and fenugreek seeds.",
        image: chickenAchariKarahiImg,
      },
      {
        id: "karahi-mutton",
        name: "Mutton Karahi",
        hasVariations: true,
        variationName: "Size",
        variations: [
          { name: "Half", price: 1890, formattedPrice: "Rs. 1,890" },
          { name: "Full", price: 3790, formattedPrice: "Rs. 3,790" }
        ],
        price: 1890,
        formattedPrice: "Half: Rs. 1,890 | Full: Rs. 3,790",
        description: "Prime mountain mutton rendered in pure tallow, ripe plum tomatoes, and ginger slivers.",
        image: muttonKarahiImg,
      },
      {
        id: "karahi-mutton-white",
        name: "Mutton White Karahi",
        hasVariations: true,
        variationName: "Size",
        variations: [
          { name: "Half", price: 1990, formattedPrice: "Rs. 1,990" },
          { name: "Full", price: 3990, formattedPrice: "Rs. 3,990" }
        ],
        price: 1990,
        formattedPrice: "Half: Rs. 1,990 | Full: Rs. 3,990",
        description: "Tender slow-cooked mutton enriched with pure cream, yogurt, and aromatic white spices.",
        image: muttonWhiteKarahiImg,
      },
      {
        id: "karahi-mutton-black-pepper",
        name: "Mutton Black Pepper Karahi",
        hasVariations: true,
        variationName: "Size",
        variations: [
          { name: "Half", price: 1990, formattedPrice: "Rs. 1,990" },
          { name: "Full", price: 3990, formattedPrice: "Rs. 3,990" }
        ],
        price: 1990,
        formattedPrice: "Half: Rs. 1,990 | Full: Rs. 3,990",
        description: "Succulent mutton cooked on high flame with cracked Tellicherry black pepper and coriander.",
        image: muttonBlackPepperKarahiImg,
      }
    ]
  },
  {
    id: "handi",
    name: "Traditional Handi",
    badge: "Clay Pot Delicacies",
    description: "Boneless chicken delicacies slow-simmered in earthen clay handis.",
    items: [
      {
        id: "handi-chicken",
        name: "Chicken Handi",
        hasVariations: true,
        variationName: "Size",
        variations: [
          { name: "Half", price: 1450, formattedPrice: "Rs. 1,450" },
          { name: "Full", price: 2550, formattedPrice: "Rs. 2,550" }
        ],
        price: 1450,
        formattedPrice: "Half: Rs. 1,450 | Full: Rs. 2,550",
        description: "Boneless chicken chunks stewed with brown onion gravy, tomato butter glaze, and garam masala.",
        image: chickenHandiImg,
      },
      {
        id: "handi-chicken-black-pepper",
        name: "Chicken Black Pepper Handi",
        hasVariations: true,
        variationName: "Size",
        variations: [
          { name: "Half", price: 1450, formattedPrice: "Rs. 1,450" },
          { name: "Full", price: 2550, formattedPrice: "Rs. 2,550" }
        ],
        price: 1450,
        formattedPrice: "Half: Rs. 1,450 | Full: Rs. 2,550",
        description: "Boneless pieces slow-cooked with fresh cracked black pepper and rich dairy cream.",
        image: chickenBlackPepperHandiImg,
      },
      {
        id: "handi-chicken-white",
        name: "Chicken White Handi",
        hasVariations: true,
        variationName: "Size",
        variations: [
          { name: "Half", price: 1450, formattedPrice: "Rs. 1,450" },
          { name: "Full", price: 2550, formattedPrice: "Rs. 2,550" }
        ],
        price: 1450,
        formattedPrice: "Half: Rs. 1,450 | Full: Rs. 2,550",
        description: "Mild boneless curry prepared with pure heavy cream, cashew paste, and fenugreek leaves.",
        image: chickenWhiteHandiImg,
      },
      {
        id: "handi-chicken-mughlai",
        name: "Chicken Mughlai Handi",
        hasVariations: true,
        variationName: "Size",
        variations: [
          { name: "Half", price: 1450, formattedPrice: "Rs. 1,450" },
          { name: "Full", price: 2550, formattedPrice: "Rs. 2,550" }
        ],
        price: 1450,
        formattedPrice: "Half: Rs. 1,450 | Full: Rs. 2,550",
        description: "Royal gravy enriched with almond butter, saffron, boiled egg ribbons, and cardamom.",
        image: chickenMughlaiHandiImg,
      },
      {
        id: "handi-chicken-achari",
        name: "Chicken Achari Handi",
        hasVariations: true,
        variationName: "Size",
        variations: [
          { name: "Half", price: 1450, formattedPrice: "Rs. 1,450" },
          { name: "Full", price: 2550, formattedPrice: "Rs. 2,550" }
        ],
        price: 1450,
        formattedPrice: "Half: Rs. 1,450 | Full: Rs. 2,550",
        description: "Boneless chicken simmered with tart spices and sun-dried mango pickle oil.",
        image: chickenAchariHandiImg,
      }
    ]
  },
  {
    id: "bbq",
    name: "Traditional BBQ",
    badge: "Charcoal Embers",
    description: "Skewered meats char-broiled over sheesham coals.",
    items: [
      {
        id: "bbq-chicken-boti",
        name: "Chicken Boti (10 pcs)",
        portion: "10 pcs",
        price: 1050,
        formattedPrice: "Rs. 1,050",
        description: "Boneless cubes marinated in yogurt, raw papaya, and red chilies grilled on skewers.",
        image: chickenBotiImg,
      },
      {
        id: "bbq-malai-boti",
        name: "Chicken Malai Boti (10 pcs)",
        portion: "10 pcs",
        price: 1450,
        formattedPrice: "Rs. 1,450",
        description: "Melt-in-mouth chicken pieces steeped in dairy cream, green chili paste, and cardamom.",
        image: chickenMalaiBotiImg,
      },
      {
        id: "bbq-tikka-leg",
        name: "Chicken Tikka Leg",
        portion: "1 Leg Piece",
        price: 350,
        formattedPrice: "Rs. 350",
        description: "Juicy chicken leg piece basted with spices and char-grilled over live embers.",
        image: chickenTikkaLegImg,
      },
      {
        id: "bbq-tikka-chest",
        name: "Chicken Tikka Chest",
        portion: "1 Chest Piece",
        price: 390,
        formattedPrice: "Rs. 390",
        description: "Meaty chicken breast cut with deep slashes, infused with lemon and tandoori masala.",
        image: chickenTikkaChestImg,
      },
      {
        id: "bbq-mutton-tikka",
        name: "Mutton Tikka Boti (1 kg)",
        portion: "1 kg",
        price: 3800,
        formattedPrice: "Rs. 3,800",
        description: "One kilogram of tender pasture-raised mutton cubes char-grilled with natural sea salt and suet.",
        image: muttonTikkaBotiImg,
      },
      {
        id: "bbq-reshmi-kabab",
        name: "Chicken Reshmi Kabab (4 pcs)",
        portion: "4 pcs",
        price: 1190,
        formattedPrice: "Rs. 1,190",
        description: "Delicate chicken mince blended with butter, white pepper, and fresh coriander.",
        image: chickenReshamiKababImg,
      },
      {
        id: "bbq-batair",
        name: "Batair (6 pcs)",
        portion: "6 pcs",
        price: 990,
        formattedPrice: "Rs. 990",
        description: "Charcoal-grilled whole quail marinated in spicy mustard oil and ground coriander.",
        image: batairImg,
      },
      {
        id: "bbq-boneless-fish",
        name: "Boneless Fish",
        hasVariations: true,
        variationName: "Weight",
        variations: [
          { name: "Half kg", price: 1800, formattedPrice: "Rs. 1,800" },
          { name: "1 kg", price: 3200, formattedPrice: "Rs. 3,200" }
        ],
        price: 1800,
        formattedPrice: "Half kg: Rs. 1,800 | 1 kg: Rs. 3,200",
        description: "Fresh boneless river fish fillets seasoned with carom seeds and lemon, char-grilled or crisped.",
        image: bonelessFish1KgImg,
      }
    ]
  },
  {
    id: "platters",
    name: "BBQ Platters",
    badge: "Grand Feasts",
    description: "Elaborate sharing platters served with hot pulao and beverages.",
    items: [
      {
        id: "platter-oasis",
        name: "Oasis BBQ Platter (2 Persons)",
        portion: "Serves 2 Persons",
        price: 2400,
        formattedPrice: "Rs. 2,400",
        description: "Includes: 4 Chicken Boti, 4 Chicken Malai Boti, 2 Chicken Reshmi Kabab, 1 Chicken Tikka Piece, Special Pulao & 1 Ltr Drink",
        image: oasisBbqPlatter2PersonsImg,
      },
      {
        id: "platter-shahi",
        name: "Shahi Platter (3 to 4 Persons)",
        portion: "Serves 3 to 4 Persons",
        price: 5200,
        formattedPrice: "Rs. 5,200",
        description: "Includes: 6 Chicken Boti, 6 Chicken Malai Boti, 2 Pcs Chicken Tikka, 4 Chicken Reshmi Kabab, 6 Batair, Special Pulao & 1.5 Ltr Drink",
        image: oasisBbqPlatter3To4PersonsImg,
      },
      {
        id: "platter-shah-jahan",
        name: "Shah Jahan Platter (5 to 6 Persons)",
        portion: "Serves 5 to 6 Persons",
        price: 7200,
        formattedPrice: "Rs. 7,200",
        description: "Includes: 8 Chicken Boti, 8 Chicken Malai Boti, 3 Pcs Chicken Tikka, 6 Chicken Kabab, 8 Batair, Special Pulao & 1.5 Ltr Drink",
        image: oasisBbqPlatter5To6PersonsImg,
      }
    ]
  },
  {
    id: "tandoor",
    name: "Traditional Tandoor",
    badge: "Fresh Baked",
    description: "Clay-oven baked flatbreads served straight from the fire.",
    items: [
      {
        id: "tandoor-plain",
        name: "Plain Naan",
        portion: "1 pc",
        price: 50,
        formattedPrice: "Rs. 50",
        description: "Traditional soft leavened white flour flatbread baked on the clay wall.",
        image: plainNaanImg,
      },
      {
        id: "tandoor-roghni",
        name: "Roghni Naan",
        portion: "1 pc",
        price: 150,
        formattedPrice: "Rs. 150",
        description: "Rich layered naan brushed with desi ghee, egg wash, and toasted white sesame.",
        image: roghniNaanImg,
      },
      {
        id: "tandoor-garlic",
        name: "Garlic Naan",
        portion: "1 pc",
        price: 150,
        formattedPrice: "Rs. 150",
        description: "Clay-baked naan studded with minced roasted garlic and fresh coriander butter.",
        image: garlicNaanImg,
      },
      {
        id: "tandoor-kalwanji",
        name: "Kalwanji Naan",
        portion: "1 pc",
        price: 150,
        formattedPrice: "Rs. 150",
        description: "Crusted with aromatic nigella seeds (kalonji) and butter glaze.",
        image: kalwanjiNaanImg,
      },
      {
        id: "tandoor-cheese",
        name: "Cheese Naan",
        portion: "1 pc",
        price: 650,
        formattedPrice: "Rs. 650",
        description: "Stuffed with melted mozzarella and cheddar cheese blend with herbs.",
        image: cheeseNaanImg,
      }
    ]
  },
  {
    id: "beverages",
    name: "Beverages",
    badge: "Hot & Cold",
    description: "Chilled mocktails, soft drinks, fresh citrus coolers, and freshly brewed teas & coffee.",
    items: [
      {
        id: "bev-soft-drink-can",
        name: "Soft Drink Can",
        portion: "Chilled Can",
        price: 160,
        formattedPrice: "Rs. 160",
        description: "Ice-cold assorted carbonated soft drink served in a chilled can.",
        image: softDrinkCanImg,
      },
      {
        id: "bev-soft-drink-bottle",
        name: "Soft Drink 1.5 / 1L",
        hasVariations: true,
        variationName: "Size",
        variations: [
          { name: "1L", price: 230, formattedPrice: "Rs. 230" },
          { name: "1.5L", price: 280, formattedPrice: "Rs. 280" }
        ],
        price: 230,
        formattedPrice: "1L: Rs. 230 | 1.5L: Rs. 280",
        description: "Chilled sharing-size soft drink bottle available in 1L and 1.5L options.",
        image: softDrinkImg,
      },
      {
        id: "bev-mint-margarita",
        name: "Mint Margarita",
        portion: "Chilled Glass",
        price: 350,
        formattedPrice: "Rs. 350",
        description: "Refreshing blended fresh garden mint leaves, zesty lime juice, black salt, and crushed ice.",
        image: mintMargaritaImg,
      },
      {
        id: "bev-fresh-lime",
        name: "Fresh Lime",
        portion: "Chilled Glass",
        price: 250,
        formattedPrice: "Rs. 250",
        description: "Crisp hand-squeezed fresh lime cooler served chilled with ice.",
        image: freshLimeImg,
      },
      {
        id: "bev-fresh-lemonade",
        name: "Fresh Lemonade",
        portion: "Chilled Glass",
        price: 250,
        formattedPrice: "Rs. 250",
        description: "Classic house-made tangy sweet lemonade prepared fresh to order.",
        image: freshLemonadeImg,
      },
      {
        id: "bev-blue-lagoon",
        name: "Blue Lagoon",
        portion: "Chilled Glass",
        price: 350,
        formattedPrice: "Rs. 350",
        description: "Vibrant citrus blue mocktail layered with sparkling fizz and chilled lemon.",
        image: blueLagoonImg,
      },
      {
        id: "bev-hot-tea",
        name: "Hot Tea",
        portion: "1 Cup",
        price: 150,
        formattedPrice: "Rs. 150",
        description: "Rich traditional doodh patti chai brewed fresh with aromatic black tea leaves.",
        image: hotTeaImg,
      },
      {
        id: "bev-green-tea",
        name: "Green Tea",
        portion: "1 Cup",
        price: 120,
        formattedPrice: "Rs. 120",
        description: "Fragrant traditional Peshawari kahwa infused with green cardamom.",
        image: hotTeaImg,
      },
      {
        id: "bev-hot-coffee",
        name: "Hot Coffee",
        portion: "1 Cup",
        price: 280,
        formattedPrice: "Rs. 280",
        description: "Warm creamy whipped hot coffee served freshly brewed.",
        image: hotCoffeeImg,
      },
      {
        id: "bev-water-large",
        name: "Water (L)",
        portion: "Large Bottle",
        price: 180,
        formattedPrice: "Rs. 180",
        description: "Chilled large sealed mineral water bottle.",
        image: waterImg,
      }
    ]
  },
  {
    id: "salads",
    name: "Salads",
    badge: "Fresh Sides",
    description: "Crisp garden salads, creamy Russian salad, and traditional cooling accompaniments.",
    items: [
      {
        id: "salad-russian",
        name: "Russian Salad",
        portion: "Sharing Bowl",
        price: 650,
        formattedPrice: "Rs. 650",
        description: "Creamy chilled medley of diced fruits, garden vegetables, and sweet cream dressing.",
        image: russianSaladImg,
      },
      {
        id: "salad-fresh",
        name: "Fresh Salad",
        portion: "Regular Plate",
        price: 200,
        formattedPrice: "Rs. 200",
        description: "Crisp sliced cucumbers, tomatoes, red onions, cabbage, and fresh lemon wedges.",
        image: freshSaladImg,
      },
      {
        id: "salad-zeera-raita",
        name: "Zeera Raita",
        portion: "Regular Bowl",
        price: 220,
        formattedPrice: "Rs. 220",
        description: "Smooth whisked yogurt seasoned with roasted cumin seeds and mild spices.",
        image: zeeraRaitaImg,
      },
      {
        id: "salad-mint-sauce",
        name: "Mint Sauce",
        portion: "Regular Bowl",
        price: 220,
        formattedPrice: "Rs. 220",
        description: "Freshly ground green mint and coriander chutney blended into cool yogurt.",
        image: mintSauceImg,
      }
    ]
  },
  {
    id: "ice-cream-parlor",
    name: "Ice Cream Parlor",
    badge: "Sweet Finishes",
    description: "Creamy hand-scooped ice cream selections served chilled.",
    items: [
      {
        id: "icecream-mix",
        name: "Mix Ice Cream 2 Scoops",
        portion: "2 Scoops",
        price: 350,
        formattedPrice: "Rs. 350",
        description: "Two generous chilled scoops of classic mixed house ice cream flavors.",
        image: mixIceCreamImg,
      },
      {
        id: "icecream-special",
        name: "Special Ice Cream 2 Scoops",
        portion: "2 Scoops",
        price: 450,
        formattedPrice: "Rs. 450",
        description: "Two signature rich scoops of Pearl Oasis special ice cream.",
        image: specialIceCreamImg,
      }
    ]
  },
  {
    id: "appetizers",
    name: "Fast Food - Appetizers",
    badge: "Crispy Starters",
    description: "Golden fried seafood, wings, and signature seasoned fries.",
    items: [
      {
        id: "app-fish-chips",
        name: "Fish and Chips (4 Pcs)",
        portion: "4 Pcs",
        price: 1250,
        formattedPrice: "Rs. 1,250",
        description: "Golden battered crispy fish fillets served with steakhouse fries and tartar sauce.",
        image: fishAndChipsImg,
      },
      {
        id: "app-finger-fish",
        name: "Crispy Finger Fish (6 Pcs)",
        portion: "6 Pcs",
        price: 1650,
        formattedPrice: "Rs. 1,650",
        description: "Crunchy crumb-coated fish fingers served with spicy cocktail sauce.",
        image: crispyFingerFishImg,
      },
      {
        id: "app-plain-fries",
        name: "Plain Fries",
        portion: "Regular Box",
        price: 290,
        formattedPrice: "Rs. 290",
        description: "Crispy salted potato fries served with ketchup.",
        image: plainFriesImg,
      },
      {
        id: "app-supreme-fries",
        name: "Supreme Loaded Fries",
        portion: "Sharing Tray",
        price: 800,
        formattedPrice: "Rs. 800",
        description: "Fries smothered in warm melted cheddar cheese sauce, chicken chunks, and jalapeños.",
        image: supremeLoadedFriesImg,
      },
      {
        id: "app-hot-wings",
        name: "Hot Wings (6 pcs)",
        portion: "6 pcs",
        price: 800,
        formattedPrice: "Rs. 800",
        description: "Crispy crumbed chicken wings tossed in zesty buffalo hot sauce.",
        image: hotWingsImg,
      },
      {
        id: "app-nuggets",
        name: "Nuggets (6 pcs)",
        portion: "6 pcs",
        price: 700,
        formattedPrice: "Rs. 700",
        description: "Tender golden fried chicken nuggets served with house dip.",
        image: nuggetsImg,
      }
    ]
  },
  {
    id: "burgers",
    name: "Burgers",
    badge: "Artisan Patties",
    description: "Grilled and smashed burgers served on toasted brioche buns.",
    items: [
      {
        id: "burger-classic-chicken",
        name: "Classic Chicken Burger",
        portion: "Single Burger",
        price: 600,
        formattedPrice: "Rs. 600",
        description: "Seasoned grilled chicken patty with fresh lettuce, tomato, and garlic mayo.",
        image: classicChickenBurgerImg,
      },
      {
        id: "burger-classic-beef",
        name: "Classic Beef Burger",
        portion: "Single Burger",
        price: 800,
        formattedPrice: "Rs. 800",
        description: "Char-grilled beef patty layered with melted cheese, gherkins, and house sauce.",
        image: classicBeefBurgerImg,
      },
      {
        id: "burger-crunchy-zinger",
        name: "Crunchy Zinger Burger",
        portion: "Single Burger",
        price: 550,
        formattedPrice: "Rs. 550",
        description: "Spicy crisp fried chicken breast with crunch slaw and chili mayo on sesame bun.",
        image: crunchyZingerBurgerImg,
      },
      {
        id: "burger-smash-beef",
        name: "American Smash Beef Burger",
        portion: "Double Smash",
        price: 850,
        formattedPrice: "Rs. 850",
        description: "Double smashed pure beef patties with crispy lacy crust, American cheddar, and relish.",
        image: americanSmashedBeefBurgerImg,
      },
      {
        id: "burger-jalapeno-chicken",
        name: "Jalapeno Grilled Chicken Burger",
        portion: "Single Burger",
        price: 700,
        formattedPrice: "Rs. 700",
        description: "Flame-grilled chicken breast with sliced pickled jalapeños and pepper jack sauce.",
        image: jalapenoGrilledChickenBurgerImg,
      }
    ]
  },
  {
    id: "steaks",
    name: "Steaks",
    badge: "Chicken / Beef Choice",
    description: "Sizzling cut served with mashed potatoes and sautéed vegetables.",
    items: [
      {
        id: "steak-mexican",
        name: "Mexican Steak",
        hasVariations: true,
        variationName: "Meat",
        variations: [
          { name: "Chicken", price: 1850, formattedPrice: "Rs. 1,850" },
          { name: "Beef", price: 2550, formattedPrice: "Rs. 2,550" }
        ],
        price: 1850,
        formattedPrice: "Chicken: Rs. 1,850 | Beef: Rs. 2,550",
        description: "Pan-seared cut topped with spicy Mexican salsa, jalapeño sauce, and sweet corn.",
        image: mexicanSteakImg,
      },
      {
        id: "steak-mushroom",
        name: "Mushroom Steak",
        hasVariations: true,
        variationName: "Meat",
        variations: [
          { name: "Chicken", price: 1850, formattedPrice: "Rs. 1,850" },
          { name: "Beef", price: 2550, formattedPrice: "Rs. 2,550" }
        ],
        price: 1850,
        formattedPrice: "Chicken: Rs. 1,850 | Beef: Rs. 2,550",
        description: "Tender seared meat ladled with velvety wild button mushroom demi-glace cream.",
        image: mushroomSteakImg,
      }
    ]
  },
  {
    id: "pasta-wraps",
    name: "Pasta & Wraps",
    badge: "Continental",
    description: "Italian pastas and Mediterranean wrapped specialties.",
    items: [
      {
        id: "pasta-alfredo",
        name: "Alfredo Pasta",
        portion: "Pasta Bowl",
        price: 1250,
        formattedPrice: "Rs. 1,250",
        description: "Fettuccine ribbons tossed in heavy parmesan cream, butter, and grilled chicken slices.",
        image: alfredoPastaImg,
      },
      {
        id: "pasta-lasagna",
        name: "Lasagna Pasta",
        portion: "Baked Dish",
        price: 1250,
        formattedPrice: "Rs. 1,250",
        description: "Oven-baked layers of pasta sheets, minced meat ragù, creamy béchamel, and melted cheese.",
        image: lasagnaPastaImg,
      },
      {
        id: "wrap-mexican",
        name: "Mexican Wrap",
        portion: "Single Wrap",
        price: 650,
        formattedPrice: "Rs. 650",
        description: "Toasted flour tortilla stuffed with spiced chicken, bell peppers, beans, and salsa.",
        image: mexicanWrapImg,
      },
      {
        id: "wrap-lebanese",
        name: "Lebanese Wrap",
        portion: "Single Wrap",
        price: 650,
        formattedPrice: "Rs. 650",
        description: "Pita wrap loaded with marinated chicken shawarma strips, pickled turnip, and garlic toum.",
        image: lebaneseWrapImg,
      }
    ]
  },
  {
    id: "pizza",
    name: "Chef Special Pizza Section",
    badge: "Hand Tossed",
    description: "Stone-baked pizzas loaded with premium mozzarella and signature toppings.",
    items: [
      {
        id: "pizza-fajita",
        name: "Fajita",
        hasVariations: true,
        variationName: "Size",
        variations: [
          { name: "Small", price: 790, formattedPrice: "Rs. 790" },
          { name: "Med", price: 1390, formattedPrice: "Rs. 1,390" },
          { name: "Large", price: 2090, formattedPrice: "Rs. 2,090" },
          { name: "Family", price: 2790, formattedPrice: "Rs. 2,790" }
        ],
        price: 790,
        formattedPrice: "Small: Rs. 790 | Med: Rs. 1,390 | Large: Rs. 2,090 | Family: Rs. 2,790",
        description: "Fajita spiced chicken strips, bell peppers, onions, and rich mozzarella cheese.",
        image: fajitaPizzaImg,
      },
      {
        id: "pizza-bbq",
        name: "BBQ",
        hasVariations: true,
        variationName: "Size",
        variations: [
          { name: "Small", price: 790, formattedPrice: "Rs. 790" },
          { name: "Med", price: 1390, formattedPrice: "Rs. 1,390" },
          { name: "Large", price: 2090, formattedPrice: "Rs. 2,090" },
          { name: "Family", price: 2790, formattedPrice: "Rs. 2,790" }
        ],
        price: 790,
        formattedPrice: "Small: Rs. 790 | Med: Rs. 1,390 | Large: Rs. 2,090 | Family: Rs. 2,790",
        description: "Smoky BBQ chicken chunks, caramelized onions, mozzarella, and smokey drizzle.",
        image: bbqPizzaImg,
      },
      {
        id: "pizza-tikka",
        name: "Tikka",
        hasVariations: true,
        variationName: "Size",
        variations: [
          { name: "Small", price: 790, formattedPrice: "Rs. 790" },
          { name: "Med", price: 1390, formattedPrice: "Rs. 1,390" },
          { name: "Large", price: 2090, formattedPrice: "Rs. 2,090" },
          { name: "Family", price: 2790, formattedPrice: "Rs. 2,790" }
        ],
        price: 790,
        formattedPrice: "Small: Rs. 790 | Med: Rs. 1,390 | Large: Rs. 2,090 | Family: Rs. 2,790",
        description: "Traditional tandoori chicken tikka cubes, onions, and lots of mozzarella cheese.",
        image: tikkaPizzaImg,
      },
      {
        id: "pizza-supreme",
        name: "Chicken Supreme",
        hasVariations: true,
        variationName: "Size",
        variations: [
          { name: "Small", price: 890, formattedPrice: "Rs. 890" },
          { name: "Med", price: 1450, formattedPrice: "Rs. 1,450" },
          { name: "Large", price: 2350, formattedPrice: "Rs. 2,350" },
          { name: "Family", price: 2950, formattedPrice: "Rs. 2,950" }
        ],
        price: 890,
        formattedPrice: "Small: Rs. 890 | Med: Rs. 1,450 | Large: Rs. 2,350 | Family: Rs. 2,950",
        description: "Spicy chicken, smoked chicken slices, mushrooms, black olives, bell peppers, and onions.",
        image: chickenSupremePizzaImg,
      },
      {
        id: "pizza-crown-crust",
        name: "Crown Crust",
        hasVariations: true,
        variationName: "Size",
        variations: [
          { name: "Large", price: 2290, formattedPrice: "Rs. 2,290" },
          { name: "Family", price: 2950, formattedPrice: "Rs. 2,950" }
        ],
        price: 2290,
        formattedPrice: "Large: Rs. 2,290 | Family: Rs. 2,950",
        description: "Crown pastry pockets stuffed with seasoned chicken and cream cheese around the crust edge.",
        image: crownCrustPizzaImg,
      },
      {
        id: "pizza-oasis-star",
        name: "Oasis Star Pizza",
        hasVariations: true,
        variationName: "Size",
        variations: [
          { name: "Large", price: 2250, formattedPrice: "Rs. 2,250" },
          { name: "Family", price: 2950, formattedPrice: "Rs. 2,950" }
        ],
        price: 2250,
        formattedPrice: "Large: Rs. 2,250 | Family: Rs. 2,950",
        description: "Chef's star-shaped folded crust bursting with four cheeses, loaded meat, and garlic butter.",
        image: oasisStarPizzaImg,
      }
    ]
  }
];
