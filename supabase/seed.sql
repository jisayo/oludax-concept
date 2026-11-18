-- OLUDAX CONCEPT Seed Data (21 Verified Official Products)

-- Products
INSERT INTO products (
  id, name, slug, price, primary_image, description, category, category_slug,
  in_stock, stock_count, rating, customizable, is_sample
) VALUES (
  'prod-custom-mug', 'Customized Ceramic Mug (Normal / Mirror / Magic)', 'customized-mugs', 5500, '/images/products/custom-mug.png', 'Signature Oludax Concept customized mug. Choose between our Normal Ceramic Mug (₦5,500), Mirror Finish Mug (₦6,500), or Magic Heat-Revealing Mug (₦7,500) that magically reveals your personalized picture and love quote when hot beverage is poured.', 'Mugs & Bottles', 'mugs-bottles',
  true, 50, 4.9, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  primary_image = EXCLUDED.primary_image,
  description = EXCLUDED.description;

INSERT INTO products (
  id, name, slug, price, primary_image, description, category, category_slug,
  in_stock, stock_count, rating, customizable, is_sample
) VALUES (
  'prod-phone-pouch', 'Customized Photo Phone Case (Android & iPhone)', 'customized-phone-pouch', 5000, '/images/products/phone-pouch.png', 'Shockproof custom phone case with your high-definition portrait, romantic couples photo, or aesthetic artwork printed with scratch-resistant gloss finish. Android models: ₦5,000 | iPhone models: ₦6,000.', 'Jewelry & Accessories', 'jewelry-accessories',
  true, 50, 4.9, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  primary_image = EXCLUDED.primary_image,
  description = EXCLUDED.description;

INSERT INTO products (
  id, name, slug, price, primary_image, description, category, category_slug,
  in_stock, stock_count, rating, customizable, is_sample
) VALUES (
  'prod-custom-headwears', 'Customized Headwears & Satin Hair Bonnet', 'customized-headwears-bonnet', 3000, '/images/products/custom-headwears.png', 'Personalized headwear collection. Headband: ₦3,000 | Mulberry Satin Hair Bonnet: ₦4,000 | Custom Foam Trucker Hat: ₦6,000 | Custom Snapback: ₦8,000. Customized with your name, street moniker, or custom slogan.', 'Headwears & Apparel', 'headwears-apparel',
  true, 50, 4.9, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  primary_image = EXCLUDED.primary_image,
  description = EXCLUDED.description;

INSERT INTO products (
  id, name, slug, price, primary_image, description, category, category_slug,
  in_stock, stock_count, rating, customizable, is_sample
) VALUES (
  'prod-borderless-frame', 'Custom Borderless Photo Frame (5/7 to 12/16)', 'borderless-photo-frame', 4000, '/images/products/borderless-frame.png', 'Sleek borderless mounted photo frame. Your photo printed edge-to-edge on high-grade photographic paper sealed with anti-scratch UV protective lamination. Sizes: 5/7 (₦4,000) | 8/10 (₦5,000) | 10/12 (₦6,500) | 12/16 (₦8,500).', 'Frames & Wall Art', 'frames',
  true, 50, 4.9, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  primary_image = EXCLUDED.primary_image,
  description = EXCLUDED.description;

INSERT INTO products (
  id, name, slug, price, primary_image, description, category, category_slug,
  in_stock, stock_count, rating, customizable, is_sample
) VALUES (
  'prod-border-frame', 'Custom Classic Border Photo Frame (8/10 to 12/16)', 'border-photo-frame', 8500, '/images/products/border-frame.png', 'Prestigious bordered frame with high-grade molding in Classic Black, Royal Gold, or Elegant Silver. Protected by clear glass face. Sizes: 8/10 (₦8,500) | 10/12 (₦11,000) | 12/16 (₦15,000).', 'Frames & Wall Art', 'frames',
  true, 50, 4.9, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  primary_image = EXCLUDED.primary_image,
  description = EXCLUDED.description;

INSERT INTO products (
  id, name, slug, price, primary_image, description, category, category_slug,
  in_stock, stock_count, rating, customizable, is_sample
) VALUES (
  'prod-custom-jewelry', 'Custom Engraved Jewelry (Necklace, Bracelet, Wristwatch)', 'customized-jewelry', 11000, '/images/products/custom-jewelry.png', 'Luxury personalized jewelry piece. Bar / Nameplate Necklace: ₦11,000 | Engraved ID Link Bracelet: ₦13,000 | Custom Engraved Wristwatch: ₦20,000. Precision laser engraved with names or initials (e.g. ''King ❤️'', ''Queen ❤️'').', 'Jewelry & Accessories', 'jewelry-accessories',
  true, 50, 4.9, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  primary_image = EXCLUDED.primary_image,
  description = EXCLUDED.description;

INSERT INTO products (
  id, name, slug, price, primary_image, description, category, category_slug,
  in_stock, stock_count, rating, customizable, is_sample
) VALUES (
  'prod-throw-pillow', 'Customized Photo Throw Pillow (Normal / Royal / Royalxx)', 'customized-throw-pillow', 10000, '/images/products/throw-pillow.png', 'Plush customized throw pillow. Normal Print Pillow: ₦10,000 | Royal (with vintage ornate gold frame pattern): ₦15,000 | Royalxx (luxury double-sided velvet): ₦18,000. Features rich color sublimation with fiber insert.', 'Jewelry & Accessories', 'jewelry-accessories',
  true, 50, 4.9, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  primary_image = EXCLUDED.primary_image,
  description = EXCLUDED.description;

INSERT INTO products (
  id, name, slug, price, primary_image, description, category, category_slug,
  in_stock, stock_count, rating, customizable, is_sample
) VALUES (
  'prod-custom-journal', 'Customized Executive Journal & Notebook', 'customized-journal', 5500, '/images/products/custom-journal.png', 'A5 faux-leather notebook with debossed/engraved name. Elastic Holder: ₦5,500 | Buckle Magnetic Holder: ₦6,000 | With Magnetic Pen: ₦7,500 | With Customized Engraved Pen: ₦8,000. Available in Sky Blue, Crimson Red, Slate Grey, and Royal Purple.', 'Journals & Stationery', 'stationery',
  true, 50, 4.9, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  primary_image = EXCLUDED.primary_image,
  description = EXCLUDED.description;

INSERT INTO products (
  id, name, slug, price, primary_image, description, category, category_slug,
  in_stock, stock_count, rating, customizable, is_sample
) VALUES (
  'prod-custom-bottles', 'Customized Water Bottles & Insulated Flask Set', 'customized-bottles-flask', 4000, '/images/products/custom-bottles.png', 'Custom branded drinkware. Candy Bottle: ₦4,000 | Smart Temperature LED Bottle: ₦7,000 | Thermal Flask + 2 Cups Gift Set: ₦8,000 | Matte Luxury Vacuum Bottle: ₦10,000. Laser engraved or vinyl printed with custom names.', 'Mugs & Bottles', 'mugs-bottles',
  true, 50, 4.9, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  primary_image = EXCLUDED.primary_image,
  description = EXCLUDED.description;

INSERT INTO products (
  id, name, slug, price, primary_image, description, category, category_slug,
  in_stock, stock_count, rating, customizable, is_sample
) VALUES (
  'prod-custom-towel', 'Custom Embroidered Towel (Face / Body / Bath)', 'customized-towel', 5500, '/images/products/custom-towel.png', '100% combed cotton towel with custom name or monogram embroidery. Face Towel: ₦5,500 | Body Towel: ₦10,000 | Large Bath Towel: ₦12,000. Plush, absorbent, and skin-friendly.', 'Headwears & Apparel', 'headwears-apparel',
  true, 50, 4.9, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  primary_image = EXCLUDED.primary_image,
  description = EXCLUDED.description;

INSERT INTO products (
  id, name, slug, price, primary_image, description, category, category_slug,
  in_stock, stock_count, rating, customizable, is_sample
) VALUES (
  'prod-custom-tshirt', 'Customized Printed T-Shirt (Basic / Normal / Complex)', 'customized-tshirt', 8500, '/images/products/custom-tshirt.png', 'Premium 220gsm cotton t-shirt with DTF or screen printing. Basic (pocket logo/monogram): ₦8,500 | Normal (large front graphic): ₦10,000 | Complex (multi-side + QR codes): ₦12,000.', 'Headwears & Apparel', 'headwears-apparel',
  true, 50, 4.9, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  primary_image = EXCLUDED.primary_image,
  description = EXCLUDED.description;

INSERT INTO products (
  id, name, slug, price, primary_image, description, category, category_slug,
  in_stock, stock_count, rating, customizable, is_sample
) VALUES (
  'prod-personalized-items', 'Personalized Souvenirs (Key Holder, Pen, Hand Fan)', 'personalized-souvenirs', 1200, '/images/products/personalized-items.png', 'Everyday personalized keepsakes and wedding/event souvenirs. Clear Acrylic Photo Key Holder: ₦1,200 | Custom Engraved Metallic Pen: ₦2,000 | Personalized Celebration Hand Fan: ₦2,000.', 'Jewelry & Accessories', 'jewelry-accessories',
  true, 50, 4.9, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  primary_image = EXCLUDED.primary_image,
  description = EXCLUDED.description;

INSERT INTO products (
  id, name, slug, price, primary_image, description, category, category_slug,
  in_stock, stock_count, rating, customizable, is_sample
) VALUES (
  'prod-custom-cards', 'Custom Celebration Cards & Booklets', 'custom-cards-booklets', 1500, '/images/products/custom-cards.png', 'Handcrafted milestone greeting cards. Ready-made Card: ₦1,500 | Personalized Name Card: ₦2,000 | Mini Booklet Card: ₦2,500 | Full Booklet Card: ₦4,500. Created with bows, glitter embossing, and custom lettering.', 'Prints, Cards & Magazines', 'prints-cards',
  true, 50, 4.9, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  primary_image = EXCLUDED.primary_image,
  description = EXCLUDED.description;

INSERT INTO products (
  id, name, slug, price, primary_image, description, category, category_slug,
  in_stock, stock_count, rating, customizable, is_sample
) VALUES (
  'prod-magazine', 'Personalized Milestone Magazine (6 / 10 / 14 Pages)', 'personalized-magazine', 6500, '/images/products/magazine.png', 'Turn your celebrant into a Vogue-style magazine cover star! 6 Pages Edition: ₦6,500 | 10 Pages Edition: ₦8,500 | 14 Pages Luxury Edition: ₦11,000. Features glossy cover, birthday interview, photo galleries, and heartfelt tributes.', 'Prints, Cards & Magazines', 'prints-cards',
  true, 50, 4.9, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  primary_image = EXCLUDED.primary_image,
  description = EXCLUDED.description;

INSERT INTO products (
  id, name, slug, price, primary_image, description, category, category_slug,
  in_stock, stock_count, rating, customizable, is_sample
) VALUES (
  'prod-wall-collage', 'Aesthetic Wall Photo Collages & Pinterest Frames', 'wall-photo-collages', 3000, '/images/products/wall-collage.png', 'Aesthetic wall gallery prints for bedrooms, living rooms, and dorms. Ready-made Set (10 pcs): ₦3,000 | Pinterest Frames: ₦3,500 | Personalized Collage (12 pcs): ₦4,000.', 'Frames & Wall Art', 'frames',
  true, 50, 4.9, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  primary_image = EXCLUDED.primary_image,
  description = EXCLUDED.description;

INSERT INTO products (
  id, name, slug, price, primary_image, description, category, category_slug,
  in_stock, stock_count, rating, customizable, is_sample
) VALUES (
  'prod-brand-stickers', 'Brand Logo Stickers (Round / Square / Rectangle)', 'brand-logo-stickers', 4000, '/images/products/stickers-round.png', 'Waterproof die-cut business logo stickers. Round (3x3 in): 50 pcs (₦4,000) / 100 pcs (₦7,500) | Square (3x3 in): 50 pcs (₦4,000) / 100 pcs (₦7,500) | Rectangle (3.5x5 in): 50 pcs (₦5,000) / 100 pcs (₦9,000).', 'Packaging & Stickers', 'packaging-stickers',
  true, 50, 4.9, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  primary_image = EXCLUDED.primary_image,
  description = EXCLUDED.description;

INSERT INTO products (
  id, name, slug, price, primary_image, description, category, category_slug,
  in_stock, stock_count, rating, customizable, is_sample
) VALUES (
  'prod-custom-nylons', 'Customized Carrier Nylons (Small / Medium / Large)', 'customized-carrier-nylons', 10000, '/images/products/nylons-small.png', 'Branded shopping carrier bags for boutiques, perfumes, clothing, and food brands. Small: 50 pcs (₦10,000) / 100 pcs (₦16,000) | Medium: 50 pcs (₦14,000) / 100 pcs (₦19,000) | Large: 50 pcs (₦19,500) / 100 pcs (₦28,000).', 'Packaging & Stickers', 'packaging-stickers',
  true, 50, 4.9, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  primary_image = EXCLUDED.primary_image,
  description = EXCLUDED.description;

INSERT INTO products (
  id, name, slug, price, primary_image, description, category, category_slug,
  in_stock, stock_count, rating, customizable, is_sample
) VALUES (
  'prod-thankyou-cards', 'Custom Luxury Thank You Cards (50 / 100 pcs)', 'thank-you-cards', 4000, '/images/products/thankyou-cards.png', 'Deep wine / berry floral thank-you cards for client packages. 50 pcs (Single side): ₦4,000 | 100 pcs (Single side): ₦7,000 | 50 pcs (Front & Back): ₦6,000. Features soft-touch silk matte lamination.', 'Prints, Cards & Magazines', 'prints-cards',
  true, 50, 4.9, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  primary_image = EXCLUDED.primary_image,
  description = EXCLUDED.description;

INSERT INTO products (
  id, name, slug, price, primary_image, description, category, category_slug,
  in_stock, stock_count, rating, customizable, is_sample
) VALUES (
  'prod-business-cards', 'Custom Luxury Business Cards (50 / 100 pcs)', 'business-cards', 6500, '/images/products/business-cards.png', 'Executive business cards with high impact presentation. 50 pcs (Single side): ₦6,500 | 100 pcs (Single side): ₦11,000 | 50 pcs (Front & Back): ₦8,000. Printed on heavy 400gsm cardstock.', 'Prints, Cards & Magazines', 'prints-cards',
  true, 50, 4.9, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  primary_image = EXCLUDED.primary_image,
  description = EXCLUDED.description;

INSERT INTO products (
  id, name, slug, price, primary_image, description, category, category_slug,
  in_stock, stock_count, rating, customizable, is_sample
) VALUES (
  'prod-flyers', 'Custom Promotional Paper Flyers (A5 & A4)', 'paper-flyers', 5000, '/images/products/paper-flyers.png', 'Vibrant full-color promotional flyers. A5 Size: 50 pcs (₦5,000) / 100 pcs (₦9,500) | A4 Size: 50 pcs (₦8,000) / 100 pcs (₦15,000). High gloss 150gsm paper for crystal clear images and QR codes.', 'Prints, Cards & Magazines', 'prints-cards',
  true, 50, 4.9, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  primary_image = EXCLUDED.primary_image,
  description = EXCLUDED.description;

INSERT INTO products (
  id, name, slug, price, primary_image, description, category, category_slug,
  in_stock, stock_count, rating, customizable, is_sample
) VALUES (
  'prod-giftbox-luxury', 'Oludax Concept Curated Luxury Celebration Hamper', 'luxury-celebration-hamper', 25000, '/images/products/giftbox-luxury.png', 'All-in-one celebration hamper curated by Oludax Concept. Contains a custom ceramic mug, personalized journal, stainless pen, scented candle, and luxury greeting card enclosed in a rigid keepsake box tied with satin ribbon.', 'Curated Gift Hampers', 'gift-boxes',
  true, 50, 4.9, true, false
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  primary_image = EXCLUDED.primary_image,
  description = EXCLUDED.description;

