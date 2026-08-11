<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing data cleanly
        DB::table('order_items')->truncate();
        DB::table('orders')->truncate();
        DB::table('user_addresses')->truncate();
        DB::table('wishlists')->truncate();
        DB::table('cart_items')->truncate();
        DB::table('stylist_bookings')->truncate();
        DB::table('event_rsvps')->truncate();
        DB::table('events')->truncate();
        DB::table('jewellery_products')->truncate();
        DB::table('jewellery_categories')->truncate();
        DB::table('customisation_requests')->truncate();
        DB::table('customisation_options')->truncate();
        DB::table('customisation_studios')->truncate();
        DB::table('wedding_collections')->truncate();
        DB::table('home_dynamic_sections')->truncate();
        DB::table('home_collections')->truncate();
        DB::table('home_banners')->truncate();
        DB::table('products')->truncate();
        DB::table('categories')->truncate();

        // 1. Categories
        DB::table('categories')->insert([
            ['id' => 1, 'name' => 'Royal Lehengas', 'slug' => 'lehenga', 'gender' => 'Women', 'image_path' => 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'Sherwanis & Suits', 'slug' => 'sherwani', 'gender' => 'Men', 'image_path' => 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'High Jewellery', 'slug' => 'jewellery', 'gender' => 'Women', 'image_path' => 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'name' => 'Couture Sarees', 'slug' => 'saree', 'gender' => 'Women', 'image_path' => 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'name' => 'Italian Trousers', 'slug' => 'pants', 'gender' => 'Men', 'image_path' => 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 6, 'name' => 'Bespoke Shirts', 'slug' => 'shirts', 'gender' => 'Men', 'image_path' => 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 7, 'name' => 'Junior Festive', 'slug' => 'kids-ethnic', 'gender' => 'Kids', 'image_path' => 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 8, 'name' => 'Polki Diamond', 'slug' => 'polki', 'gender' => 'Women', 'image_path' => 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80', 'created_at' => now(), 'updated_at' => now()],
        ]);


        // 2. Products
        DB::table('products')->insert([
            [
                'id' => 1,
                'category_id' => 1,
                'name' => 'Royal Crimson Velvet Bridal Lehenga',
                'brand' => 'Sabyasachi',
                'price' => 285000.00,
                'original_price' => 315000.00,
                'discount_percentage' => 10,
                'rating' => 4.9,
                'stock_quantity' => 5,
                'thumbnail' => 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
                'gender' => 'Women',
                'description' => 'Handcrafted zari & velvet couture featuring dabka and gota patti embroidery.',
                'is_featured' => true,
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'id' => 2,
                'category_id' => 2,
                'name' => 'Zardozi Embroidered Raw Silk Sherwani',
                'brand' => 'Manish Malhotra',
                'price' => 165000.00,
                'original_price' => 195000.00,
                'discount_percentage' => 15,
                'rating' => 4.8,
                'stock_quantity' => 8,
                'thumbnail' => 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
                'gender' => 'Men',
                'description' => 'Raw silk sherwani with gold tilla zardozi work and custom pearl buttons.',
                'is_featured' => true,
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'id' => 3,
                'category_id' => 1,
                'name' => 'Gold Tissue Kanjeevaram Silk Saree',
                'brand' => 'Anita Dongre',
                'price' => 95000.00,
                'original_price' => 100000.00,
                'discount_percentage' => 5,
                'rating' => 5.0,
                'stock_quantity' => 12,
                'thumbnail' => 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
                'gender' => 'Women',
                'description' => 'Pure Katan silk woven with pure zari border.',
                'is_featured' => true,
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'id' => 4,
                'category_id' => 2,
                'name' => 'Italian Superfine Wool Trousers & Pants',
                'brand' => 'Raymond Atelier',
                'price' => 24500.00,
                'original_price' => 28000.00,
                'discount_percentage' => 12,
                'rating' => 4.7,
                'stock_quantity' => 15,
                'thumbnail' => 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
                'gender' => 'Men',
                'description' => 'Italian wool flat-front trousers with satin side piping and tailored fit.',
                'is_featured' => true,
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'id' => 5,
                'category_id' => 2,
                'name' => 'Bespoke Pure Linen Formal Shirt',
                'brand' => 'Tatito Signature',
                'price' => 12500.00,
                'original_price' => 15000.00,
                'discount_percentage' => 15,
                'rating' => 4.9,
                'stock_quantity' => 20,
                'thumbnail' => 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80',
                'gender' => 'Men',
                'description' => 'Handcrafted pure linen shirt with mother of pearl buttons.',
                'is_featured' => true,
                'created_at' => now(), 'updated_at' => now()
            ]
        ]);


        // 3. Home Banners
        DB::table('home_banners')->insert([
            [
                'id' => 1,
                'title' => 'Summer Royal Haute Couture 2026',
                'subtitle' => 'Handcrafted Luxury Outfits & Fine Jewellery',
                'image_path' => 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
                'video_url' => 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-on-a-runway-41275-large.mp4',
                'cta_text' => 'Shop Royal Collection',
                'cta_link' => null,
                'sort_order' => 1,
                'created_at' => now(), 'updated_at' => now()
            ]
        ]);

        // 4. Home Gender Collections
        DB::table('home_collections')->insert([
            ['target_module' => 'fashions', 'gender' => 'Women', 'title' => "Women's Royal Heritage", 'subtitle' => 'Bridal Lehengas & Sarees', 'count_badge' => '250+ Designs', 'image_path' => 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80', 'video_url' => null, 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['target_module' => 'fashions', 'gender' => 'Men', 'title' => "Men's Couture Atelier", 'subtitle' => 'Sherwanis & Tuxedos', 'count_badge' => '140+ Designs', 'image_path' => 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80', 'video_url' => null, 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['target_module' => 'fashions', 'gender' => 'Kids', 'title' => 'Junior Festive Edition', 'subtitle' => 'Heritage Kurta Sets & Gowns', 'count_badge' => '80+ Designs', 'image_path' => 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80', 'video_url' => null, 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 5. Wedding Collections
        DB::table('wedding_collections')->insert([
            ['gender' => 'Women', 'title' => 'Royal Bridal Lehengas', 'subtitle' => 'Handcrafted zari & velvet couture', 'count_badge' => '120+ Outfits', 'image_path' => 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80', 'video_url' => null, 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['gender' => 'Men', 'title' => 'Groom Couture & Sherwanis', 'subtitle' => 'Regal silk & embroidery', 'count_badge' => '85+ Outfits', 'image_path' => 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80', 'video_url' => null, 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['gender' => 'Women', 'title' => 'Trousseau & Festive Sarees', 'subtitle' => 'Heritage Banarasi & Kanjeevaram', 'count_badge' => '200+ Sarees', 'image_path' => 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80', 'video_url' => null, 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['gender' => 'Kids', 'title' => 'Junior Royal Wedding Sets', 'subtitle' => 'Custom ethnic wear for kids', 'count_badge' => '50+ Outfits', 'image_path' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', 'video_url' => null, 'sort_order' => 4, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 6. Customisation Studios & Options
        DB::table('customisation_studios')->insert([
            ['studio_key' => 'men', 'category_name' => "Men's Couture Atelier", 'subtitle' => 'Sherwanis, Bandhgalas, Tuxedos & Bespoke Suits', 'icon_name' => 'man-outline', 'badge_text' => 'MASTER TAILORED', 'created_at' => now(), 'updated_at' => now()],
            ['studio_key' => 'women', 'category_name' => "Bridal & Women's Couture", 'subtitle' => 'Royal Lehengas, Anarkalis & Hand-Woven Sarees', 'icon_name' => 'woman-outline', 'badge_text' => 'ROYAL HERITAGE', 'created_at' => now(), 'updated_at' => now()],
            ['studio_key' => 'jewellery', 'category_name' => 'High Jewellery Crafting', 'subtitle' => 'Polki, Kundan, Solitaires & Custom Engraving', 'icon_name' => 'diamond-outline', 'badge_text' => 'BIS 22K GOLD', 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('customisation_options')->insert([
            ['type' => 'brand', 'name' => 'Tatito Atelier (Signature)', 'hex_code' => null, 'created_at' => now(), 'updated_at' => now()],
            ['type' => 'brand', 'name' => 'Sabyasachi Fabrics & Zari', 'hex_code' => null, 'created_at' => now(), 'updated_at' => now()],
            ['type' => 'brand', 'name' => 'Raymond Fine Wool & Suiting', 'hex_code' => null, 'created_at' => now(), 'updated_at' => now()],
            ['type' => 'fabric', 'name' => 'Pure Italian Silk', 'hex_code' => null, 'created_at' => now(), 'updated_at' => now()],
            ['type' => 'fabric', 'name' => 'Hand-Woven Zardozi Velvet', 'hex_code' => null, 'created_at' => now(), 'updated_at' => now()],
            ['type' => 'fabric', 'name' => 'Egyptian Giza Cotton', 'hex_code' => null, 'created_at' => now(), 'updated_at' => now()],
            ['type' => 'color_swatch', 'name' => 'Royal Crimson Red', 'hex_code' => '#801B1B', 'created_at' => now(), 'updated_at' => now()],
            ['type' => 'color_swatch', 'name' => 'Emerald Green', 'hex_code' => '#1B4D3E', 'created_at' => now(), 'updated_at' => now()],
            ['type' => 'color_swatch', 'name' => 'Royal Gold', 'hex_code' => '#C49A45', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 7. Jewellery Categories & Products
        DB::table('jewellery_categories')->insert([
            ['id' => 1, 'category_key' => 'cat_polki', 'name' => 'Polki & Kundan', 'icon' => 'sparkles-outline', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'category_key' => 'cat_solitaire', 'name' => 'Solitaires', 'icon' => 'ribbon-outline', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'category_key' => 'cat_gold', 'name' => '22K Gold', 'icon' => 'ellipse-outline', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'category_key' => 'cat_bridal', 'name' => 'Bridal Sets', 'icon' => 'rose-outline', 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('jewellery_products')->insert([
            [
                'id' => 1,
                'jewellery_category_id' => 1,
                'gender' => 'Women',
                'name' => 'Royal Heritage Polki Choker',
                'price' => 485000.00,
                'original_price' => 550000.00,
                'purity_tag' => '22K BIS Gold · Uncut Diamonds',
                'badge_tag' => 'ROYAL HERITAGE',
                'rating' => 4.9,
                'image_path' => 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'id' => 2,
                'jewellery_category_id' => 2,
                'gender' => 'Women',
                'name' => 'Eternal Solitaire Diamond Ring',
                'price' => 220000.00,
                'original_price' => 260000.00,
                'purity_tag' => '18K White Gold · 2.1 Carat VVS1',
                'badge_tag' => 'IGI CERTIFIED',
                'rating' => 5.0,
                'image_path' => 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'id' => 3,
                'jewellery_category_id' => 3,
                'gender' => 'Men',
                'name' => 'Royal Imperial Gold Chain & Crest',
                'price' => 310000.00,
                'original_price' => 340000.00,
                'purity_tag' => '22K BIS Hallmarked Yellow Gold',
                'badge_tag' => 'HANDCRAFTED',
                'rating' => 4.9,
                'image_path' => 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
                'created_at' => now(), 'updated_at' => now()
            ]
        ]);

        // 8. Events
        DB::table('events')->insert([
            [
                'id' => 1,
                'title' => 'The Royal Couture Week 2026',
                'category' => 'Runway Premiere',
                'day' => '15',
                'month' => 'AUG',
                'time' => '07:00 PM IST',
                'location' => 'Taj Palace, New Delhi',
                'host' => 'Sabyasachi x Tatito Atelier',
                'pass_type' => 'FRONT ROW RUNWAY',
                'ticket_prefix' => 'TT-VIP-9941',
                'price' => 'Complimentary VIP Pass',
                'available_seats' => 5,
                'image_path' => 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
                'video_url' => 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-on-a-runway-41275-large.mp4',
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'id' => 2,
                'title' => 'Bridal Heritage Trunk Exhibition',
                'category' => 'Trunk Show',
                'day' => '28',
                'month' => 'AUG',
                'time' => '11:00 AM - 08:00 PM',
                'location' => 'The St. Regis, Mumbai',
                'host' => 'Tatito Bridal Atelier',
                'pass_type' => 'PRIVATE TRUNK SHOW',
                'ticket_prefix' => 'TT-VIP-8832',
                'price' => 'RSVP Required',
                'available_seats' => 12,
                'image_path' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
                'video_url' => null,
                'created_at' => now(), 'updated_at' => now()
            ]
        ]);
    }
}
