-- OLUDAX CONCEPT Seed Data

-- 1. Categories
INSERT INTO categories (id, name, slug, description, product_count, icon) VALUES ('cat-1', 'Personalized Gifts', 'personalized-gifts', 'Unique gifts with a personal touch', 12, '🎁') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, slug, description, product_count, icon) VALUES ('cat-2', 'Gift Boxes', 'gift-boxes', 'Beautifully curated gift box sets', 8, '📦') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, slug, description, product_count, icon) VALUES ('cat-3', 'Flowers', 'flowers', 'Fresh flower bouquets and arrangements', 10, '💐') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, slug, description, product_count, icon) VALUES ('cat-4', 'Customized Mugs', 'customized-mugs', 'Mugs with your own design or text', 15, '☕') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, slug, description, product_count, icon) VALUES ('cat-5', 'Apparel', 'apparel', 'Custom printed clothing items', 9, '👕') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, slug, description, product_count, icon) VALUES ('cat-6', 'Accessories', 'accessories', 'Personalized accessories and jewelry', 11, '💍') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, slug, description, product_count, icon) VALUES ('cat-7', 'Birthday Gifts', 'birthday-gifts', 'Perfect gifts for birthday celebrations', 14, '🎂') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, slug, description, product_count, icon) VALUES ('cat-8', 'Anniversary Gifts', 'anniversary-gifts', 'Celebrate love with special gifts', 7, '💕') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, slug, description, product_count, icon) VALUES ('cat-9', 'Corporate Gifts', 'corporate-gifts', 'Professional gifts for business occasions', 6, '💼') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, slug, description, product_count, icon) VALUES ('cat-10', 'Celebration Packages', 'celebration-packages', 'Complete celebration setup packages', 5, '🎉') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 2. Products
INSERT INTO products (
  id, name, slug, price, compare_at_price, primary_image, images,
  description, short_description, category, category_slug, tags,
  in_stock, stock_count, rating, review_count, customizable,
  customization_options, featured, new_arrival, best_seller,
  specifications, delivery_info, is_sample
) VALUES (
  'prod-1', 'Personalized Ceramic Mug', 'personalized-mug', 8000, 10000, '/images/products/sample-mug.jpg', '["/images/products/sample-mug.jpg","/images/products/sample-mug-side.jpg","/images/products/sample-mug-box.jpg"]'::jsonb,
  'A high-quality ceramic mug, customizable with your name, favourite quote or design. Perfect for daily use or as a thoughtful gift. Each mug is carefully printed using heat-press technology for lasting colour and durability.', 'Custom ceramic mug with your name or artwork', 'Customized Mugs', 'customized-mugs', '{"mug","personalized","gift","custom","ceramic"}',
  true, 50, 4.8, 124, true,
  '{"allowName":true,"namePrompt":"Enter name or initials","nameMaxLength":25,"allowMessage":true,"messagePrompt":"Personal quote or message","messageMaxLength":100,"allowColor":true,"colors":["#F42E91","#171016","#FFFFFF","#FF75B5","#6B21A8"],"allowDesign":true,"designs":["Classic Script","Modern Sans","Floral Frame","Minimalist Monogram","Crown Crest"],"allowImage":true,"imagePrompt":"Upload reference photo or logo","instructionsHelpText":"Final design placement will be reviewed before heat pressing."}'::jsonb, true, false, true,
  '{"Material":"Premium Ceramic","Capacity":"350ml (11 oz)","Print Method":"Heat Press / Sublimation","Dishwasher Safe":"Yes (top rack recommended)","Finish":"Glossy White Base"}'::jsonb, 'Ships within 2-3 business days after customization approval.', true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO products (
  id, name, slug, price, compare_at_price, primary_image, images,
  description, short_description, category, category_slug, tags,
  in_stock, stock_count, rating, review_count, customizable,
  customization_options, featured, new_arrival, best_seller,
  specifications, delivery_info, is_sample
) VALUES (
  'prod-2', 'Luxury Fresh Flower Bouquet', 'luxury-flower-bouquet', 20000, 25000, '/images/products/sample-flowers.jpg', '["/images/products/sample-flowers.jpg","/images/products/sample-flowers-wrap.jpg"]'::jsonb,
  'A stunning arrangement of fresh, hand-picked seasonal flowers wrapped in premium tissue and kraft paper. Lovingly assembled with a complimentary gift card for your heartfelt message.', 'Hand-picked fresh floral bouquet with ribbon wrapping', 'Flowers', 'flowers', '{"flowers","bouquet","luxury","fresh","roses"}',
  true, 20, 4.9, 89, true,
  '{"allowMessage":true,"messagePrompt":"Gift card note for the recipient","messageMaxLength":180,"allowColor":true,"colors":["#F42E91","#FF0000","#FFFFFF","#FFD700","#FF69B4"],"instructionsHelpText":"Let us know your preferred ribbon shade or delivery notes."}'::jsonb, true, true, true,
  '{"Flower Stems":"12-15 fresh seasonal stems","Wrapping":"Double-layered premium kraft with satin ribbon","Freshness":"5-7 days with recommended water care","Includes":"Care instructions card and floral nutrient pack"}'::jsonb, 'Same-day delivery available for orders confirmed before 12:00 PM.', true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO products (
  id, name, slug, price, compare_at_price, primary_image, images,
  description, short_description, category, category_slug, tags,
  in_stock, stock_count, rating, review_count, customizable,
  customization_options, featured, new_arrival, best_seller,
  specifications, delivery_info, is_sample
) VALUES (
  'prod-3', 'Custom Curated Gift Box', 'custom-gift-box', 15000, 18000, '/images/products/sample-giftbox.jpg', '["/images/products/sample-giftbox.jpg","/images/products/sample-giftbox-open.jpg"]'::jsonb,
  'A beautifully presented rigid gift box filled with hand-selected treats, scented items, and custom keepsakes. Tied with an elegant silk ribbon and custom gift tag.', 'Curated gift box filled with treats and bespoke items', 'Gift Boxes', 'gift-boxes', '{"gift box","curated","personalized","luxury","hampers"}',
  true, 30, 4.7, 67, true,
  '{"allowName":true,"namePrompt":"Recipient name for outer box lid","nameMaxLength":30,"allowMessage":true,"messagePrompt":"Personal greeting card note","messageMaxLength":200,"allowDesign":true,"designs":["Classic Elegance","Celebration Confetti","Modern Minimalist","Romantic Pastel"],"instructionsHelpText":"Indicate dietary restrictions or special packaging requests."}'::jsonb, true, false, true,
  '{"Dimensions":"30cm x 25cm x 12cm","Box Type":"Rigid board with magnetic snap closure","Contents":"4-6 curated lifestyle and treat items","Finishing":"Satin bow with embossed gift tag"}'::jsonb, 'Ships within 1-2 business days across Nigeria.', true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO products (
  id, name, slug, price, compare_at_price, primary_image, images,
  description, short_description, category, category_slug, tags,
  in_stock, stock_count, rating, review_count, customizable,
  customization_options, featured, new_arrival, best_seller,
  specifications, delivery_info, is_sample
) VALUES (
  'prod-4', 'Plush Companion Teddy Bear', 'cute-teddy-bear', 12000, 14000, '/images/products/sample-teddy.jpg', '["/images/products/sample-teddy.jpg"]'::jsonb,
  'An ultra-soft cuddly companion teddy bear with a satin bow. Ideal on its own or paired with flowers and a personalized message ribbon.', 'Ultra-soft plush teddy bear with decorative ribbon', 'Personalized Gifts', 'personalized-gifts', '{"teddy","plush","soft toy","gift","companion"}',
  true, 40, 4.6, 53, true,
  '{"allowName":true,"namePrompt":"Name to print on ribbon tag","nameMaxLength":20,"allowMessage":true,"messagePrompt":"Short message for bear tag","messageMaxLength":60,"allowColor":true,"colors":["#F42E91","#8B4513","#FFFFFF","#FFB6C1","#DEB887"]}'::jsonb, false, true, true,
  '{"Height":"30cm sitting height","Material":"Hypoallergenic plush with polyester filling","Safety":"Tested for all ages with securely stitched eyes"}'::jsonb, 'Ships within 1-2 business days.', true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO products (
  id, name, slug, price, compare_at_price, primary_image, images,
  description, short_description, category, category_slug, tags,
  in_stock, stock_count, rating, review_count, customizable,
  customization_options, featured, new_arrival, best_seller,
  specifications, delivery_info, is_sample
) VALUES (
  'prod-5', 'Custom Embroidered Hoodie', 'custom-hoodie', 25000, 30000, '/images/products/sample-hoodie.jpg', '["/images/products/sample-hoodie.jpg","/images/products/sample-hoodie-back.jpg"]'::jsonb,
  'Heavyweight cotton fleece hoodie tailored for comfort and durability. Add custom chest embroidery, back print, or your personalized initials.', 'Heavyweight fleece hoodie with custom print or embroidery', 'Apparel', 'apparel', '{"hoodie","custom","apparel","clothing","embroidered"}',
  true, 25, 4.5, 38, true,
  '{"allowName":true,"namePrompt":"Name or text to embroider/print","nameMaxLength":25,"allowColor":true,"colors":["#171016","#FFFFFF","#F42E91","#1F2937","#7C3AED"],"allowDesign":true,"designs":["Center Chest","Left Chest Minimal","Full Back Graphic","Sleeve Monogram"],"allowImage":true,"imagePrompt":"Upload logo or graphic vector/image","clothingSizes":["S","M","L","XL","XXL"],"instructionsHelpText":"Specify embroidery thread color or font preference."}'::jsonb, true, true, false,
  '{"Fabric":"320gsm 80% Cotton, 20% Polyester fleece","Fit":"Unisex regular fit","Pocket":"Front kangaroo pouch","Care":"Machine wash cold inside-out, tumble dry low"}'::jsonb, 'Ships within 3-5 business days after artwork approval.', true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO products (
  id, name, slug, price, compare_at_price, primary_image, images,
  description, short_description, category, category_slug, tags,
  in_stock, stock_count, rating, review_count, customizable,
  customization_options, featured, new_arrival, best_seller,
  specifications, delivery_info, is_sample
) VALUES (
  'prod-6', 'Organic Canvas Tote Bag', 'personalized-tote-bag', 10000, 12000, '/images/products/sample-tote.jpg', '["/images/products/sample-tote.jpg"]'::jsonb,
  'Eco-friendly 100% organic cotton canvas tote. Durable, spacious, and customized with your preferred graphic, phrase, or personalized monogram.', 'Reinforced organic canvas tote bag with custom print', 'Accessories', 'accessories', '{"tote","bag","custom","eco-friendly","canvas"}',
  true, 60, 4.4, 42, true,
  '{"allowName":true,"namePrompt":"Monogram or custom headline","nameMaxLength":24,"allowImage":true,"imagePrompt":"Upload illustration or custom artwork","allowColor":true,"colors":["#FFFFFF","#F5F5DC","#171016","#F42E91"]}'::jsonb, false, false, false,
  '{"Material":"100% Certified Organic Cotton Canvas (12 oz)","Dimensions":"38cm x 42cm with 25cm drop handles","Capacity":"Approx. 15 Litres"}'::jsonb, 'Ships within 2-3 business days.', true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO products (
  id, name, slug, price, compare_at_price, primary_image, images,
  description, short_description, category, category_slug, tags,
  in_stock, stock_count, rating, review_count, customizable,
  customization_options, featured, new_arrival, best_seller,
  specifications, delivery_info, is_sample
) VALUES (
  'prod-7', 'Celebration Package - Gold Tier', 'celebration-package-gold', 45000, 55000, '/images/products/sample-celebration.jpg', '["/images/products/sample-celebration.jpg"]'::jsonb,
  'All-in-one celebration bundle containing a custom backdrop banner, balloon garland components, cake topper, and commemorative keepsake box.', 'Complete celebration party kit with personalized banner', 'Celebration Packages', 'celebration-packages', '{"celebration","party","package","birthday","anniversary"}',
  true, 10, 4.9, 31, true,
  '{"allowName":true,"namePrompt":"Celebrant name / Couple names","nameMaxLength":35,"allowMessage":true,"messagePrompt":"Banner subtitle (e.g. ''Happy 30th Birthday'')","messageMaxLength":80,"allowColor":true,"colors":["#FFD700","#F42E91","#C0C0C0","#FF69B4"],"allowDesign":true,"designs":["Birthday Milestone","Anniversary Elegance","Graduation Salute","Bridal Glow"]}'::jsonb, true, true, false,
  '{"Includes":"Personalized banner (1.5m), 24 latex balloons, acrylic cake topper, confetti","Setup":"Step-by-step assembly guide included"}'::jsonb, 'Order at least 4 business days before your scheduled celebration.', true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO products (
  id, name, slug, price, compare_at_price, primary_image, images,
  description, short_description, category, category_slug, tags,
  in_stock, stock_count, rating, review_count, customizable,
  customization_options, featured, new_arrival, best_seller,
  specifications, delivery_info, is_sample
) VALUES (
  'prod-8', 'Custom Protective Phone Case', 'custom-phone-case', 7000, 9000, '/images/products/sample-phonecase.jpg', '["/images/products/sample-phonecase.jpg"]'::jsonb,
  'Shockproof polycarbonate phone case with raised camera bevel and UV-cured scratch-resistant printing. Personalize with your picture, initials, or monogram art.', 'Impact-absorbing custom printed phone case', 'Accessories', 'accessories', '{"phone case","custom","accessories","tech","iphone","samsung"}',
  true, 70, 4.3, 56, true,
  '{"allowName":true,"namePrompt":"Initials or name on case","nameMaxLength":18,"allowImage":true,"imagePrompt":"Upload high-resolution photo for print","allowDesign":true,"designs":["Full Photo Wrap","Typography Minimal","Marble Pattern","Couples Portrait"],"phoneModels":["iPhone 13","iPhone 13 Pro","iPhone 14","iPhone 14 Pro","iPhone 15","iPhone 15 Pro","Samsung Galaxy S22","Samsung Galaxy S23","Samsung Galaxy S24"],"instructionsHelpText":"Please confirm your exact phone model to guarantee port alignment."}'::jsonb, false, true, false,
  '{"Material":"Dual-layer TPU bumper + Polycarbonate hard back","DropProtection":"Tested for drops up to 1.5 metres","WirelessCharging":"Compatible with Qi chargers"}'::jsonb, 'Ships within 2-3 business days.', true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO products (
  id, name, slug, price, compare_at_price, primary_image, images,
  description, short_description, category, category_slug, tags,
  in_stock, stock_count, rating, review_count, customizable,
  customization_options, featured, new_arrival, best_seller,
  specifications, delivery_info, is_sample
) VALUES (
  'prod-9', 'Executive Corporate Gift Set', 'corporate-gift-set', 35000, 40000, '/images/products/sample-corporate.jpg', '["/images/products/sample-corporate.jpg"]'::jsonb,
  'Prestigious executive gift set featuring an A5 faux-leather notebook, matte metal ballpoint pen, stainless business card case, and thermal coaster.', 'Branded executive desk accessory and notebook set', 'Corporate Gifts', 'corporate-gifts', '{"corporate","business","professional","branded","executive"}',
  true, 15, 4.7, 22, true,
  '{"allowName":true,"namePrompt":"Executive name or title to engrave","nameMaxLength":30,"allowMessage":true,"messagePrompt":"Corporate message on inside card","messageMaxLength":150,"allowImage":true,"imagePrompt":"Upload company logo vector or PNG","allowDesign":true,"designs":["Laser Engraved","Gold Foil Embossed","Silver Foil Embossed","Debossed"],"instructionsHelpText":"Contact sales team for orders above 20 sets."}'::jsonb, true, false, false,
  '{"Includes":"A5 Hardcover Notebook (192 pages), Metal Pen, Card Case, Luxury Gift Box","Branding":"Laser engraving or foil stamping available"}'::jsonb, 'Ships within 3-5 business days.', true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO products (
  id, name, slug, price, compare_at_price, primary_image, images,
  description, short_description, category, category_slug, tags,
  in_stock, stock_count, rating, review_count, customizable,
  customization_options, featured, new_arrival, best_seller,
  specifications, delivery_info, is_sample
) VALUES (
  'prod-10', 'Rose Gold Name Bracelet', 'rose-gold-bracelet', 15000, 18000, '/images/products/sample-bracelet.jpg', '["/images/products/sample-bracelet.jpg"]'::jsonb,
  'Tarnish-resistant stainless steel bracelet finished in high-polish 18K rose gold plating. Features a dainty name bar with precision laser engraving.', '18K rose gold plated bar bracelet with custom engraving', 'Accessories', 'accessories', '{"bracelet","jewelry","rose gold","engraved","accessories"}',
  true, 35, 4.8, 44, true,
  '{"allowName":true,"namePrompt":"Name to engrave on bar plate","nameMaxLength":12,"allowMessage":true,"messagePrompt":"Secret message on back of bar (optional)","messageMaxLength":15}'::jsonb, false, true, true,
  '{"Metal":"316L Surgical-Grade Stainless Steel","Plating":"18K Rose Gold PVD vacuum coating (hypoallergenic)","ChainLength":"16cm + 4cm extension link"}'::jsonb, 'Ships within 2-3 business days in a velvet gift pouch.', true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO products (
  id, name, slug, price, compare_at_price, primary_image, images,
  description, short_description, category, category_slug, tags,
  in_stock, stock_count, rating, review_count, customizable,
  customization_options, featured, new_arrival, best_seller,
  specifications, delivery_info, is_sample
) VALUES (
  'prod-11', 'Custom Screen-Printed T-Shirt', 'custom-t-shirt', 12000, 15000, '/images/products/sample-tshirt.jpg', '["/images/products/sample-tshirt.jpg"]'::jsonb,
  '100% combed cotton jersey t-shirt with soft-touch feel and reinforced double-needle seams. Suitable for single bespoke prints or event batches.', 'Combed cotton crewneck t-shirt with custom print', 'Apparel', 'apparel', '{"t-shirt","custom","apparel","printed","cotton"}',
  true, 45, 4.5, 61, true,
  '{"allowName":true,"namePrompt":"Name or custom text line","nameMaxLength":25,"allowColor":true,"colors":["#FFFFFF","#171016","#F42E91","#1F2937","#DC2626"],"allowDesign":true,"designs":["Center Chest","Pocket Crest","Large Back Graphic"],"allowImage":true,"imagePrompt":"Upload graphic illustration or photo","clothingSizes":["S","M","L","XL","XXL"]}'::jsonb, false, false, false,
  '{"Fabric":"100% Combed Ringspun Cotton (180 GSM)","Collar":"Seamless rib-knit collar with taped neck and shoulders","Care":"Machine wash warm inside out, non-chlorine bleach only"}'::jsonb, 'Ships within 3-5 business days.', true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO products (
  id, name, slug, price, compare_at_price, primary_image, images,
  description, short_description, category, category_slug, tags,
  in_stock, stock_count, rating, review_count, customizable,
  customization_options, featured, new_arrival, best_seller,
  specifications, delivery_info, is_sample
) VALUES (
  'prod-12', 'Deluxe Birthday Celebration Hamper', 'birthday-hamper-deluxe', 30000, 38000, '/images/products/sample-hamper.jpg', '["/images/products/sample-hamper.jpg"]'::jsonb,
  'Richly appointed birthday celebration hamper with personalized ceramic mug, artisanal scented candle, gourmet chocolates, and personalized birthday card.', 'Curated celebration hamper with treats and keepsake mug', 'Birthday Gifts', 'birthday-gifts', '{"birthday","hamper","gift set","celebration","luxury"}',
  true, 12, 4.9, 73, true,
  '{"allowName":true,"namePrompt":"Birthday celebrant name for mug & tag","nameMaxLength":25,"allowMessage":true,"messagePrompt":"Birthday greeting card text","messageMaxLength":180,"allowColor":true,"colors":["#F42E91","#FFD700","#FF69B4","#6B21A8"]}'::jsonb, true, false, true,
  '{"HamperBasket":"Handwoven natural wicker basket with fabric lining","Contents":"Personalized 350ml mug, soy candle (200g), assorted chocolates (180g), greeting card","SafetyNote":"Chocolates may contain dairy, soy, and nut traces"}'::jsonb, 'Ships within 1-2 business days across Nigeria.', true
) ON CONFLICT (id) DO NOTHING;
