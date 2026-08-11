<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Categories & Products
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('image_path')->nullable();
            $table->enum('gender', ['Men', 'Women', 'Kids', 'Unisex'])->default('Unisex');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->string('name');
            $table->string('brand')->default('Tatito Atelier');
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->integer('discount_percentage')->default(0);
            $table->decimal('rating', 2, 1)->default(5.0);
            $table->integer('stock_quantity')->default(50);
            $table->string('thumbnail');
            $table->enum('gender', ['Men', 'Women', 'Kids', 'Unisex'])->default('Unisex');
            $table->text('description')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Home Screen & Dynamic Feeds
        Schema::create('home_banners', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('image_path');
            $table->string('video_url')->nullable();
            $table->string('cta_text')->default('Shop Collection');
            $table->string('cta_link')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('home_collections', function (Blueprint $table) {
            $table->id();
            $table->enum('target_module', ['fashions', 'weddings', 'jewellery'])->default('fashions');
            $table->enum('gender', ['Men', 'Women', 'Kids'])->default('Women');
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('count_badge')->nullable();
            $table->string('image_path');
            $table->string('video_url')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('home_dynamic_sections', function (Blueprint $table) {
            $table->id();
            $table->string('section_title');
            $table->string('section_subtitle')->nullable();
            $table->enum('layout_type', ['banner', 'card_ui', 'video', 'category_grid'])->default('card_ui');
            $table->enum('media_type', ['image', 'video'])->default('image');
            $table->string('image_path')->nullable();
            $table->string('video_url')->nullable();
            $table->string('cta_label')->nullable();
            $table->string('cta_target_route')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. Weddings Hub
        Schema::create('wedding_collections', function (Blueprint $table) {
            $table->id();
            $table->enum('gender', ['Men', 'Women', 'Kids'])->default('Women');
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('count_badge')->nullable();
            $table->string('image_path');
            $table->string('video_url')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 4. Customisation Atelier
        Schema::create('customisation_studios', function (Blueprint $table) {
            $table->id();
            $table->string('studio_key')->unique(); // 'men', 'women', 'jewellery'
            $table->string('category_name');
            $table->string('subtitle')->nullable();
            $table->string('icon_name')->default('cut-outline');
            $table->string('badge_text')->default('MASTER TAILORED');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('customisation_options', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['brand', 'fabric', 'color_swatch']);
            $table->string('name');
            $table->string('hex_code')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('customisation_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('item_name');
            $table->string('brand')->nullable();
            $table->string('fabric')->nullable();
            $table->string('color')->nullable();
            $table->json('measurements')->nullable();
            $table->text('special_notes')->nullable();
            $table->date('appointment_date')->nullable();
            $table->enum('status', ['Pending', 'Tailoring in Progress', 'Ready for Fitting', 'Completed', 'Cancelled'])->default('Pending');
            $table->timestamps();
        });

        // 5. High Jewellery Vault
        Schema::create('jewellery_categories', function (Blueprint $table) {
            $table->id();
            $table->string('category_key')->unique();
            $table->string('name');
            $table->string('icon')->default('diamond-outline');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('jewellery_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jewellery_category_id')->nullable()->constrained('jewellery_categories')->onDelete('set null');
            $table->enum('gender', ['Men', 'Women', 'Unisex'])->default('Women');
            $table->string('name');
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->string('purity_tag');
            $table->string('badge_tag')->nullable();
            $table->decimal('rating', 2, 1)->default(5.0);
            $table->string('image_path');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 6. Events & VIP Passbook
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category')->default('Runway Premiere');
            $table->string('day', 2);
            $table->string('month', 3);
            $table->string('time');
            $table->string('location');
            $table->string('host');
            $table->string('pass_type')->default('FRONT ROW RUNWAY');
            $table->string('ticket_prefix')->default('TT-VIP');
            $table->string('price')->default('Complimentary VIP Pass');
            $table->integer('available_seats')->default(10);
            $table->string('image_path');
            $table->string('video_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('event_rsvps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('pass_code')->unique();
            $table->enum('status', ['Confirmed', 'Attended', 'Cancelled'])->default('Confirmed');
            $table->timestamps();
            $table->unique(['event_id', 'user_id']); // Prevent duplicate RSVP
        });

        // 7. Stylist Bookings
        Schema::create('stylist_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('service_type');
            $table->text('notes')->nullable();
            $table->dateTime('booking_date');
            $table->enum('status', ['Pending', 'Confirmed', 'Completed', 'Cancelled'])->default('Pending');
            $table->timestamps();
        });

        // 8. Cart, Wishlists, Orders & Addresses
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('size')->nullable();
            $table->string('color')->nullable();
            $table->integer('quantity')->default(1);
            $table->timestamps();
        });

        Schema::create('wishlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['user_id', 'product_id']);
        });

        Schema::create('user_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->string('phone_number');
            $table->string('street_address');
            $table->string('city');
            $table->string('state');
            $table->string('pincode');
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('order_number')->unique();
            $table->decimal('subtotal', 10, 2);
            $table->decimal('discount_amount', 10, 2)->default(0.00);
            $table->decimal('total_amount', 10, 2);
            $table->enum('status', ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'])->default('Placed');
            $table->string('payment_method')->default('COD');
            $table->json('shipping_address');
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('product_name');
            $table->string('size')->nullable();
            $table->string('color')->nullable();
            $table->integer('quantity');
            $table->decimal('unit_price', 10, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('user_addresses');
        Schema::dropIfExists('wishlists');
        Schema::dropIfExists('cart_items');
        Schema::dropIfExists('stylist_bookings');
        Schema::dropIfExists('event_rsvps');
        Schema::dropIfExists('events');
        Schema::dropIfExists('jewellery_products');
        Schema::dropIfExists('jewellery_categories');
        Schema::dropIfExists('customisation_requests');
        Schema::dropIfExists('customisation_options');
        Schema::dropIfExists('customisation_studios');
        Schema::dropIfExists('wedding_collections');
        Schema::dropIfExists('home_dynamic_sections');
        Schema::dropIfExists('home_collections');
        Schema::dropIfExists('home_banners');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
    }
};
