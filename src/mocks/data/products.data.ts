import { AgeGroup, type Product, type ProductImage, type ProductVariant } from "@/types/product.types";
import { getOrCreateGlobalSingleton } from "@/mocks/data/global-store";
import { createSeededRandom, pickInt } from "@/mocks/data/seeded-random.util";

interface ColorOption {
  name: string;
  hex: string;
}

const COLOR_PALETTE: Record<string, ColorOption> = {
  black: { name: "Black", hex: "#111111" },
  white: { name: "White", hex: "#F5F5F5" },
  navy: { name: "Navy", hex: "#1B2A4A" },
  red: { name: "Red", hex: "#C8102E" },
  royalBlue: { name: "Royal Blue", hex: "#0057B8" },
  grey: { name: "Heather Grey", hex: "#6B7280" },
  green: { name: "Forest Green", hex: "#1E7A34" },
  orange: { name: "Ignite Orange", hex: "#F2622E" },
};

const ADULT_APPAREL_SIZES = ["S", "M", "L", "XL", "XXL"];
const KIDS_APPAREL_SIZES = ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"];
const SOCK_SIZES = ["S (UK 3-5)", "M (UK 6-8)", "L (UK 9-11)"];
const ADULT_SHOE_SIZES = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"];
const KIDS_SHOE_SIZES = ["UK 10", "UK 11", "UK 12", "UK 13", "UK 1", "UK 2"];

type Brand =
  | "Stridewear"
  | "ProCourt"
  | "Trailhawk"
  | "VeloFit"
  | "Ironclad Sports"
  | "Apex Athletics"
  | "Kinetic"
  | "Rangefield";

interface ProductBlueprint {
  key: string;
  categoryId: string;
  name: string;
  brand: Brand;
  ageGroup: AgeGroup;
  basePrice: number;
  sizes: readonly string[];
  colorKeys: (keyof typeof COLOR_PALETTE)[];
  shortDescription: string;
  description: string;
  sizeGuide: string;
  isFeatured: boolean;
  hasDiscount: boolean;
}

const BLUEPRINTS: ProductBlueprint[] = [
  // Track Suits
  {
    key: "velocity-full-zip-track-suit",
    categoryId: "cat-track-suits",
    name: "Velocity Full-Zip Track Suit",
    brand: "Stridewear",
    ageGroup: AgeGroup.ADULT,
    basePrice: 2999,
    sizes: ADULT_APPAREL_SIZES,
    colorKeys: ["black", "navy", "royalBlue"],
    shortDescription: "Lightweight full-zip track suit for warm-ups and travel.",
    description:
      "A two-piece full-zip track suit in brushed-back tricot fabric. Ribbed cuffs and hem lock in warmth during warm-ups, and the tapered jogger pairs with a relaxed jacket fit for all-day comfort on and off the field.",
    sizeGuide: "Runs true to size. Size up for a relaxed, layered fit.",
    isFeatured: true,
    hasDiscount: true,
  },
  {
    key: "thermogrid-pullover-track-suit",
    categoryId: "cat-track-suits",
    name: "ThermoGrid Pullover Track Suit",
    brand: "Apex Athletics",
    ageGroup: AgeGroup.ADULT,
    basePrice: 3299,
    sizes: ADULT_APPAREL_SIZES,
    colorKeys: ["grey", "black"],
    shortDescription: "Brushed-fleece pullover set built for cold-weather training.",
    description:
      "A grid-fleece pullover hoodie and matching jogger designed for early-morning sessions. Thumbhole cuffs and a kangaroo pocket keep hands warm between reps.",
    sizeGuide: "Fits true to size with room for a base layer underneath.",
    isFeatured: false,
    hasDiscount: false,
  },
  {
    key: "trailblazer-lightweight-track-suit",
    categoryId: "cat-track-suits",
    name: "Trailblazer Lightweight Track Suit",
    brand: "Trailhawk",
    ageGroup: AgeGroup.ADULT,
    basePrice: 2599,
    sizes: ADULT_APPAREL_SIZES,
    colorKeys: ["green", "black", "grey"],
    shortDescription: "Breathable woven track suit for tempo runs and travel days.",
    description:
      "Woven ripstop fabric with mesh underarm gussets keeps this set breathable on tempo runs, while snap-button ankles let you throw it on over trainers without untying laces.",
    sizeGuide: "Slim through the body — size up for a relaxed fit.",
    isFeatured: false,
    hasDiscount: true,
  },
  {
    key: "ironclad-heavyweight-track-suit",
    categoryId: "cat-track-suits",
    name: "Ironclad Heavyweight Track Suit",
    brand: "Ironclad Sports",
    ageGroup: AgeGroup.ADULT,
    basePrice: 3499,
    sizes: ADULT_APPAREL_SIZES,
    colorKeys: ["black", "red"],
    shortDescription: "Heavyweight fleece track suit for sideline and street wear.",
    description:
      "A heavier 320gsm fleece build made for standing around after practice as much as warming up before it. Ribbed collar and cuffs hold their shape wash after wash.",
    sizeGuide: "True to size, tailored fit.",
    isFeatured: false,
    hasDiscount: false,
  },
  {
    key: "kinetic-colorblock-track-suit",
    categoryId: "cat-track-suits",
    name: "Kinetic Colorblock Track Suit",
    brand: "Kinetic",
    ageGroup: AgeGroup.ADULT,
    basePrice: 2799,
    sizes: ADULT_APPAREL_SIZES,
    colorKeys: ["royalBlue", "orange"],
    shortDescription: "Colorblocked track suit with reflective trim for low-light runs.",
    description:
      "Bold colorblocking meets function — reflective piping along the sleeves and ankle cuffs improves visibility on early or late runs without sacrificing style.",
    sizeGuide: "Runs true to size.",
    isFeatured: true,
    hasDiscount: true,
  },
  {
    key: "rangefield-classic-track-suit",
    categoryId: "cat-track-suits",
    name: "Rangefield Classic Track Suit",
    brand: "Rangefield",
    ageGroup: AgeGroup.ADULT,
    basePrice: 2499,
    sizes: ADULT_APPAREL_SIZES,
    colorKeys: ["navy", "white"],
    shortDescription: "Classic tricot track suit with side-stripe detailing.",
    description:
      "A wardrobe staple with a classic tricot shell, satin-taped side stripes, and an elastic waistband with internal drawcord for a secure, adjustable fit.",
    sizeGuide: "Runs true to size.",
    isFeatured: false,
    hasDiscount: false,
  },

  // Jerseys & T-Shirts
  {
    key: "dryflow-training-tee",
    categoryId: "cat-jerseys-tshirts",
    name: "DryFlow Training Tee",
    brand: "Stridewear",
    ageGroup: AgeGroup.ADULT,
    basePrice: 899,
    sizes: ADULT_APPAREL_SIZES,
    colorKeys: ["black", "white", "grey", "royalBlue"],
    shortDescription: "Moisture-wicking training tee with a relaxed athletic fit.",
    description:
      "Quick-dry mesh fabric with flatlock seams to prevent chafing on long training days. A relaxed athletic cut moves with you through every drill.",
    sizeGuide: "Runs true to size.",
    isFeatured: true,
    hasDiscount: true,
  },
  {
    key: "matchday-replica-jersey",
    categoryId: "cat-jerseys-tshirts",
    name: "Matchday Replica Jersey",
    brand: "ProCourt",
    ageGroup: AgeGroup.ADULT,
    basePrice: 1499,
    sizes: ADULT_APPAREL_SIZES,
    colorKeys: ["red", "royalBlue", "white"],
    shortDescription: "Lightweight replica jersey with breathable side panels.",
    description:
      "Match-inspired jersey cut for full range of motion, with laser-cut ventilation panels under the arms and a soft woven crest at the chest.",
    sizeGuide: "Fits true to size; athletes between sizes should size up.",
    isFeatured: false,
    hasDiscount: false,
  },
  {
    key: "apex-long-sleeve-compression-top",
    categoryId: "cat-jerseys-tshirts",
    name: "Apex Long-Sleeve Compression Top",
    brand: "Apex Athletics",
    ageGroup: AgeGroup.ADULT,
    basePrice: 1199,
    sizes: ADULT_APPAREL_SIZES,
    colorKeys: ["black", "navy"],
    shortDescription: "Four-way stretch compression top for base-layer warmth.",
    description:
      "A snug, four-way stretch base layer that supports muscles on cold-weather sessions. Flat seams sit smooth under a jersey or track suit.",
    sizeGuide: "Designed for a snug, compression fit — size up for a relaxed feel.",
    isFeatured: false,
    hasDiscount: true,
  },
  {
    key: "trailhawk-sleeveless-running-tee",
    categoryId: "cat-jerseys-tshirts",
    name: "Trailhawk Sleeveless Running Tee",
    brand: "Trailhawk",
    ageGroup: AgeGroup.ADULT,
    basePrice: 799,
    sizes: ADULT_APPAREL_SIZES,
    colorKeys: ["grey", "orange", "black"],
    shortDescription: "Sleeveless singlet with drop-tail hem for distance running.",
    description:
      "Ultra-light singlet built for hot-weather distance running, with a drop-tail hem and reflective logo for dusk visibility.",
    sizeGuide: "Runs true to size.",
    isFeatured: false,
    hasDiscount: false,
  },
  {
    key: "kinetic-graphic-tee",
    categoryId: "cat-jerseys-tshirts",
    name: "Kinetic Graphic Training Tee",
    brand: "Kinetic",
    ageGroup: AgeGroup.ADULT,
    basePrice: 749,
    sizes: ADULT_APPAREL_SIZES,
    colorKeys: ["white", "black"],
    shortDescription: "Cotton-blend graphic tee for rest-day and street wear.",
    description:
      "A soft cotton-poly blend tee with a printed back graphic — built for recovery days, coffee runs, and everything in between.",
    sizeGuide: "Runs true to size, relaxed fit.",
    isFeatured: false,
    hasDiscount: false,
  },
  {
    key: "ironclad-rugby-jersey",
    categoryId: "cat-jerseys-tshirts",
    name: "Ironclad Rugby Jersey",
    brand: "Ironclad Sports",
    ageGroup: AgeGroup.ADULT,
    basePrice: 1699,
    sizes: ADULT_APPAREL_SIZES,
    colorKeys: ["navy", "red"],
    shortDescription: "Durable ripstop rugby jersey with reinforced collar.",
    description:
      "Heavyweight ripstop knit resists tackling and turf alike, with a reinforced collar and tape-sealed shoulder seams for contact-sport durability.",
    sizeGuide: "True to size, athletic fit.",
    isFeatured: true,
    hasDiscount: false,
  },

  // Shorts & Bottoms
  {
    key: "sprint-running-shorts",
    categoryId: "cat-shorts-bottoms",
    name: "Sprint 5-Inch Running Shorts",
    brand: "Stridewear",
    ageGroup: AgeGroup.ADULT,
    basePrice: 799,
    sizes: ADULT_APPAREL_SIZES,
    colorKeys: ["black", "navy", "orange"],
    shortDescription: "Lined running shorts with a zip pocket for essentials.",
    description:
      "Built-in brief lining and a hidden waistband zip pocket make this the go-to short for tempo runs and race day alike.",
    sizeGuide: "Runs true to size.",
    isFeatured: true,
    hasDiscount: true,
  },
  {
    key: "procourt-basketball-shorts",
    categoryId: "cat-shorts-bottoms",
    name: "ProCourt Basketball Shorts",
    brand: "ProCourt",
    ageGroup: AgeGroup.ADULT,
    basePrice: 999,
    sizes: ADULT_APPAREL_SIZES,
    colorKeys: ["black", "red", "royalBlue"],
    shortDescription: "Wide-leg basketball shorts with mesh side panels.",
    description:
      "A longer, wide-leg cut with mesh side panels for on-court airflow and an elastic drawcord waist for a locked-in fit through every drive.",
    sizeGuide: "Runs true to size, relaxed fit.",
    isFeatured: false,
    hasDiscount: false,
  },
  {
    key: "kinetic-training-joggers",
    categoryId: "cat-shorts-bottoms",
    name: "Kinetic Tapered Training Joggers",
    brand: "Kinetic",
    ageGroup: AgeGroup.ADULT,
    basePrice: 1399,
    sizes: ADULT_APPAREL_SIZES,
    colorKeys: ["grey", "black"],
    shortDescription: "Tapered joggers with zip pockets for gym and travel.",
    description:
      "Tapered through the leg with a ribbed cuff, zip hand pockets, and a soft brushed interior for warmth between sets.",
    sizeGuide: "Runs true to size.",
    isFeatured: false,
    hasDiscount: true,
  },
  {
    key: "apex-compression-tights",
    categoryId: "cat-shorts-bottoms",
    name: "Apex Compression Tights",
    brand: "Apex Athletics",
    ageGroup: AgeGroup.ADULT,
    basePrice: 1299,
    sizes: ADULT_APPAREL_SIZES,
    colorKeys: ["black", "navy"],
    shortDescription: "Full-length compression tights for recovery and training.",
    description:
      "Graduated compression supports muscles during high-intensity sessions and speeds recovery afterward. Flatlock seams eliminate chafe points.",
    sizeGuide: "Designed for a snug, compression fit.",
    isFeatured: false,
    hasDiscount: false,
  },
  {
    key: "trailhawk-hiking-shorts",
    categoryId: "cat-shorts-bottoms",
    name: "Trailhawk Trail Shorts",
    brand: "Trailhawk",
    ageGroup: AgeGroup.ADULT,
    basePrice: 899,
    sizes: ADULT_APPAREL_SIZES,
    colorKeys: ["green", "grey"],
    shortDescription: "Rugged stretch-woven shorts built for trail and gym.",
    description:
      "Stretch-woven fabric with a durable water-repellent finish handles trail dust and gym sweat equally well, with two zip security pockets.",
    sizeGuide: "Runs true to size.",
    isFeatured: false,
    hasDiscount: false,
  },
  {
    key: "rangefield-cotton-shorts",
    categoryId: "cat-shorts-bottoms",
    name: "Rangefield Cotton Gym Shorts",
    brand: "Rangefield",
    ageGroup: AgeGroup.ADULT,
    basePrice: 599,
    sizes: ADULT_APPAREL_SIZES,
    colorKeys: ["black", "white", "grey"],
    shortDescription: "Everyday cotton-blend shorts for warm-ups and lounging.",
    description:
      "A soft cotton-blend short with an elastic drawcord waist — equally at home warming up in the gym or relaxing at home.",
    sizeGuide: "Runs true to size, relaxed fit.",
    isFeatured: false,
    hasDiscount: true,
  },

  // Socks
  {
    key: "cushion-run-crew-socks-3pk",
    categoryId: "cat-socks",
    name: "Cushion Run Crew Socks (3-Pack)",
    brand: "Stridewear",
    ageGroup: AgeGroup.ADULT,
    basePrice: 399,
    sizes: SOCK_SIZES,
    colorKeys: ["black", "white", "grey"],
    shortDescription: "Cushioned crew socks with arch support, sold as a 3-pack.",
    description:
      "Terry-cushioned footbeds and an arch-hugging band keep these crew socks locked in mile after mile. Reinforced heel and toe extend wear life.",
    sizeGuide: "Sized by UK shoe size — check the size chart before ordering.",
    isFeatured: true,
    hasDiscount: true,
  },
  {
    key: "no-show-training-socks-5pk",
    categoryId: "cat-socks",
    name: "No-Show Training Socks (5-Pack)",
    brand: "Kinetic",
    ageGroup: AgeGroup.ADULT,
    basePrice: 499,
    sizes: SOCK_SIZES,
    colorKeys: ["white", "black"],
    shortDescription: "Low-cut moisture-wicking socks for training and running shoes.",
    description:
      "A silicone heel grip keeps these no-show socks in place through sprints and direction changes, while mesh venting keeps feet cool.",
    sizeGuide: "Sized by UK shoe size — check the size chart before ordering.",
    isFeatured: false,
    hasDiscount: false,
  },
  {
    key: "procourt-football-socks",
    categoryId: "cat-socks",
    name: "ProCourt Football Socks",
    brand: "ProCourt",
    ageGroup: AgeGroup.ADULT,
    basePrice: 349,
    sizes: SOCK_SIZES,
    colorKeys: ["red", "royalBlue", "black"],
    shortDescription: "Over-the-calf football socks with shin guard compatibility.",
    description:
      "Extra-long over-the-calf fit holds shin guards securely in place, with targeted cushioning across the foot for 90 minutes of comfort.",
    sizeGuide: "Sized by UK shoe size — check the size chart before ordering.",
    isFeatured: false,
    hasDiscount: false,
  },
  {
    key: "thermogrid-wool-blend-socks",
    categoryId: "cat-socks",
    name: "ThermoGrid Wool-Blend Socks",
    brand: "Apex Athletics",
    ageGroup: AgeGroup.ADULT,
    basePrice: 449,
    sizes: SOCK_SIZES,
    colorKeys: ["grey", "navy"],
    shortDescription: "Merino wool-blend socks for cold-weather training.",
    description:
      "A merino wool blend regulates temperature and resists odor on long, cold training sessions where cotton socks fall short.",
    sizeGuide: "Sized by UK shoe size — check the size chart before ordering.",
    isFeatured: false,
    hasDiscount: true,
  },

  // Footwear
  {
    key: "stridewear-pulse-running-shoe",
    categoryId: "cat-footwear",
    name: "Pulse Running Shoe",
    brand: "Stridewear",
    ageGroup: AgeGroup.ADULT,
    basePrice: 4999,
    sizes: ADULT_SHOE_SIZES,
    colorKeys: ["black", "white", "orange"],
    shortDescription: "Responsive daily-trainer with breathable knit upper.",
    description:
      "A dual-density midsole balances cushioning and energy return for daily miles, while the engineered knit upper flexes with the foot's natural motion.",
    sizeGuide: "Runs half a size small — order up if you're between sizes.",
    isFeatured: true,
    hasDiscount: true,
  },
  {
    key: "procourt-attack-football-boot",
    categoryId: "cat-footwear",
    name: "Attack Firm-Ground Football Boot",
    brand: "ProCourt",
    ageGroup: AgeGroup.ADULT,
    basePrice: 5999,
    sizes: ADULT_SHOE_SIZES,
    colorKeys: ["black", "royalBlue"],
    shortDescription: "Firm-ground football boot with a textured strike zone.",
    description:
      "A textured forefoot strike zone improves ball grip on passes and shots, paired with conical firm-ground studs for explosive direction changes.",
    sizeGuide: "Runs true to size.",
    isFeatured: false,
    hasDiscount: false,
  },
  {
    key: "trailhawk-ridge-trail-runner",
    categoryId: "cat-footwear",
    name: "Ridge Trail Runner",
    brand: "Trailhawk",
    ageGroup: AgeGroup.ADULT,
    basePrice: 6499,
    sizes: ADULT_SHOE_SIZES,
    colorKeys: ["green", "grey"],
    shortDescription: "Aggressive-lug trail shoe with a rock plate for protection.",
    description:
      "Multi-directional lugs bite into loose terrain while an internal rock plate protects the forefoot from sharp trail debris.",
    sizeGuide: "Runs true to size; consider half a size up for thicker socks.",
    isFeatured: false,
    hasDiscount: true,
  },
  {
    key: "kinetic-court-trainer",
    categoryId: "cat-footwear",
    name: "Kinetic Court Trainer",
    brand: "Kinetic",
    ageGroup: AgeGroup.ADULT,
    basePrice: 4499,
    sizes: ADULT_SHOE_SIZES,
    colorKeys: ["white", "black"],
    shortDescription: "Low-top court trainer with lateral support for quick cuts.",
    description:
      "A wide, stable base and reinforced lateral cage support hard cuts and pivots on the court, backed by a cushioned sockliner for all-day comfort.",
    sizeGuide: "Runs true to size.",
    isFeatured: false,
    hasDiscount: false,
  },
  {
    key: "ironclad-crosstrain-shoe",
    categoryId: "cat-footwear",
    name: "Ironclad CrossTrain Shoe",
    brand: "Ironclad Sports",
    ageGroup: AgeGroup.ADULT,
    basePrice: 5499,
    sizes: ADULT_SHOE_SIZES,
    colorKeys: ["black", "red"],
    shortDescription: "Flat, stable training shoe for lifting and HIIT.",
    description:
      "A wide, flat heel platform improves stability under load, while a flexible forefoot supports explosive movement during HIIT circuits.",
    sizeGuide: "Runs true to size.",
    isFeatured: true,
    hasDiscount: false,
  },

  // Sports Equipment
  {
    key: "matchplay-football-size5",
    categoryId: "cat-equipment",
    name: "MatchPlay Training Football",
    brand: "ProCourt",
    ageGroup: AgeGroup.ADULT,
    basePrice: 1299,
    sizes: ["Size 3", "Size 4", "Size 5"],
    colorKeys: ["white", "orange"],
    shortDescription: "Machine-stitched training football with a textured panel grip.",
    description:
      "A machine-stitched, water-resistant casing keeps this ball's weight consistent from the first kick to the last, with textured panels for touch and control.",
    sizeGuide: "Size 3 for kids, Size 4 for youth, Size 5 for adult play.",
    isFeatured: false,
    hasDiscount: false,
  },
  {
    key: "apex-adjustable-dumbbell-set",
    categoryId: "cat-equipment",
    name: "Apex Adjustable Dumbbell Set",
    brand: "Apex Athletics",
    ageGroup: AgeGroup.ADULT,
    basePrice: 4999,
    sizes: ["5-25kg pair"],
    colorKeys: ["black"],
    shortDescription: "Space-saving adjustable dumbbells for home training.",
    description:
      "A quick-dial weight selector swaps plates in seconds, replacing a full rack of fixed dumbbells with one compact adjustable pair.",
    sizeGuide: "One size — adjustable from 5kg to 25kg per dumbbell.",
    isFeatured: true,
    hasDiscount: true,
  },
  {
    key: "kinetic-yoga-mat",
    categoryId: "cat-equipment",
    name: "Kinetic Pro-Grip Yoga Mat",
    brand: "Kinetic",
    ageGroup: AgeGroup.ADULT,
    basePrice: 899,
    sizes: ["6mm", "4mm"],
    colorKeys: ["green", "grey", "navy"],
    shortDescription: "Non-slip yoga and stretching mat with alignment guides.",
    description:
      "A textured, non-slip surface holds its grip through hot, sweaty sessions, with printed alignment guides to help square up every pose.",
    sizeGuide: "6mm for extra cushioning, 4mm for a more portable, travel-friendly mat.",
    isFeatured: false,
    hasDiscount: false,
  },
  {
    key: "procourt-badminton-racket",
    categoryId: "cat-equipment",
    name: "ProCourt Carbon Badminton Racket",
    brand: "ProCourt",
    ageGroup: AgeGroup.ADULT,
    basePrice: 1999,
    sizes: ["One Size"],
    colorKeys: ["royalBlue", "red"],
    shortDescription: "Full-carbon racket balancing power and control.",
    description:
      "A full-carbon shaft transfers energy efficiently into every smash, while a balanced head weight keeps net play sharp and controlled.",
    sizeGuide: "One size, standard adult grip.",
    isFeatured: false,
    hasDiscount: true,
  },
  {
    key: "rangefield-resistance-band-set",
    categoryId: "cat-equipment",
    name: "Rangefield Resistance Band Set",
    brand: "Rangefield",
    ageGroup: AgeGroup.ADULT,
    basePrice: 699,
    sizes: ["Light-Medium-Heavy Set"],
    colorKeys: ["orange", "green", "black"],
    shortDescription: "Three-band resistance set for mobility and strength work.",
    description:
      "Three graduated resistance bands cover mobility warm-ups, accessory strength work, and assisted stretching in one compact carry pouch.",
    sizeGuide: "One size, fits all resistance levels included in the set.",
    isFeatured: false,
    hasDiscount: false,
  },
  {
    key: "trailhawk-hydration-pack",
    categoryId: "cat-equipment",
    name: "Trailhawk 2L Hydration Pack",
    brand: "Trailhawk",
    ageGroup: AgeGroup.ADULT,
    basePrice: 2499,
    sizes: ["One Size"],
    colorKeys: ["green", "black"],
    shortDescription: "Lightweight running vest with a 2L hydration bladder.",
    description:
      "A leak-proof 2L bladder and four stash pockets let you carry water, gels, and a phone hands-free on long trail runs.",
    sizeGuide: "One size, adjustable chest and waist straps.",
    isFeatured: false,
    hasDiscount: false,
  },

  // Kids Sportswear
  {
    key: "junior-velocity-track-suit",
    categoryId: "cat-kids-sportswear",
    name: "Junior Velocity Track Suit",
    brand: "Stridewear",
    ageGroup: AgeGroup.KIDS,
    basePrice: 1899,
    sizes: KIDS_APPAREL_SIZES,
    colorKeys: ["royalBlue", "orange", "black"],
    shortDescription: "Kids' full-zip track suit sized down from the adult Velocity.",
    description:
      "The same brushed-tricot warm-up set young athletes love in an adult version, cut for growing bodies with a roomier fit through the shoulders.",
    sizeGuide: "Sized by age — check height and chest measurements in the size chart.",
    isFeatured: true,
    hasDiscount: true,
  },
  {
    key: "junior-matchday-jersey",
    categoryId: "cat-kids-sportswear",
    name: "Junior Matchday Jersey",
    brand: "ProCourt",
    ageGroup: AgeGroup.KIDS,
    basePrice: 999,
    sizes: KIDS_APPAREL_SIZES,
    colorKeys: ["red", "royalBlue"],
    shortDescription: "Lightweight kids' jersey for training and match day.",
    description:
      "A lighter-weight build of our adult replica jersey with a slightly looser cut for freedom of movement during PE and weekend matches.",
    sizeGuide: "Sized by age — check height and chest measurements in the size chart.",
    isFeatured: false,
    hasDiscount: false,
  },
  {
    key: "junior-court-trainer",
    categoryId: "cat-kids-sportswear",
    name: "Junior Court Trainer",
    brand: "Kinetic",
    ageGroup: AgeGroup.KIDS,
    basePrice: 2799,
    sizes: KIDS_SHOE_SIZES,
    colorKeys: ["white", "royalBlue"],
    shortDescription: "Durable kids' court shoe with a reinforced toe cap.",
    description:
      "A reinforced toe cap stands up to scuffs on the playground and court alike, with a padded collar for a secure, comfortable fit.",
    sizeGuide: "Sized by UK kids' shoe size — check the size chart before ordering.",
    isFeatured: false,
    hasDiscount: true,
  },
  {
    key: "junior-training-shorts",
    categoryId: "cat-kids-sportswear",
    name: "Junior Training Shorts",
    brand: "Kinetic",
    ageGroup: AgeGroup.KIDS,
    basePrice: 599,
    sizes: KIDS_APPAREL_SIZES,
    colorKeys: ["black", "royalBlue", "orange"],
    shortDescription: "Breathable kids' shorts for PE and weekend sport.",
    description:
      "A soft, breathable short with an adjustable elastic waistband that grows with an active kid through a full sports season.",
    sizeGuide: "Sized by age — check height and waist measurements in the size chart.",
    isFeatured: false,
    hasDiscount: false,
  },
  {
    key: "junior-crew-socks-3pk",
    categoryId: "cat-kids-sportswear",
    name: "Junior Cushion Crew Socks (3-Pack)",
    brand: "Stridewear",
    ageGroup: AgeGroup.KIDS,
    basePrice: 349,
    sizes: SOCK_SIZES,
    colorKeys: ["white", "black"],
    shortDescription: "Cushioned kids' crew socks, sold as a 3-pack.",
    description:
      "The same cushioned footbed as our adult running socks, sized down for smaller feet and sold in a durable 3-pack.",
    sizeGuide: "Sized by UK kids' shoe size — check the size chart before ordering.",
    isFeatured: false,
    hasDiscount: false,
  },
];

function buildImages(productKey: string): ProductImage[] {
  const imageCount = 4;
  return Array.from({ length: imageCount }, (_, index) => ({
    id: `${productKey}-img-${index + 1}`,
    url: `https://picsum.photos/seed/${productKey}-${index + 1}/1200/1200`,
    alt: `Product photo ${index + 1}`,
    sortOrder: index,
  }));
}

function buildVariants(
  blueprint: ProductBlueprint,
  random: () => number,
): ProductVariant[] {
  const variants: ProductVariant[] = [];
  let variantIndex = 0;

  for (const colorKey of blueprint.colorKeys) {
    const color = COLOR_PALETTE[colorKey];
    for (const size of blueprint.sizes) {
      variantIndex += 1;
      const priceJitter = pickInt(random, -100, 150);
      const price = Math.max(199, blueprint.basePrice + priceJitter);
      const compareAtPrice = blueprint.hasDiscount
        ? Math.round(price * (1 + pickInt(random, 15, 40) / 100))
        : null;
      const stockQuantity = pickInt(random, 0, 60);

      variants.push({
        id: `${blueprint.key}-v${variantIndex}`,
        sku: `${blueprint.key.toUpperCase().slice(0, 12)}-${colorKey.toUpperCase().slice(0, 3)}-${size}`.replace(/\s+/g, ""),
        size,
        color: color.name,
        colorHex: color.hex,
        ageGroup: blueprint.ageGroup,
        price,
        compareAtPrice,
        stockQuantity,
        reorderThreshold: 8,
        isActive: true,
      });
    }
  }

  return variants;
}

function buildProduct(blueprint: ProductBlueprint, seed: number): Product {
  const random = createSeededRandom(seed);
  const variants = buildVariants(blueprint, random);
  const rating = Math.round((3.5 + random() * 1.5) * 10) / 10;
  const reviewCount = pickInt(random, 4, 210);

  return {
    id: `prod-${blueprint.key}`,
    slug: blueprint.key,
    name: blueprint.name,
    brand: blueprint.brand,
    categoryId: blueprint.categoryId,
    shortDescription: blueprint.shortDescription,
    description: blueprint.description,
    sizeGuide: blueprint.sizeGuide,
    images: buildImages(blueprint.key),
    variants,
    rating,
    reviewCount,
    isFeatured: blueprint.isFeatured,
    isActive: true,
    createdAt: new Date(2025, pickInt(random, 0, 11), pickInt(random, 1, 28)).toISOString(),
  };
}

export const PRODUCTS: Product[] = getOrCreateGlobalSingleton("products", () =>
  BLUEPRINTS.map((blueprint, index) => buildProduct(blueprint, 1000 + index * 37)),
);
