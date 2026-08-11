<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class WishlistController extends Controller
{
    private function sendResponse(bool $success, int $code, string $message, $data = null, $errors = null)
    {
        $response = [
            'success' => $success,
            'code' => $code,
            'message' => $message,
        ];
        if ($data !== null) $response['data'] = $data;
        if ($errors !== null) $response['errors'] = $errors;
        return response()->json($response, $code);
    }

    public function index(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return $this->sendResponse(false, 401, 'Unauthenticated. Please login first.');
            }

            $wishlist = DB::table('wishlists')
                ->join('products', 'wishlists.product_id', '=', 'products.id')
                ->where('wishlists.user_id', $user->id)
                ->select('products.*')
                ->get();

            return $this->sendResponse(true, 200, 'Wishlist fetched successfully', $wishlist);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error fetching wishlist', null, ['exception' => $e->getMessage()]);
        }
    }

    public function toggle(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return $this->sendResponse(false, 401, 'Unauthenticated. Please login first.');
            }

            $productId = $request->input('productId');
            if (!$productId) {
                return $this->sendResponse(false, 422, 'Validation Error', null, ['productId' => ['Product ID is required.']]);
            }

            $existing = DB::table('wishlists')
                ->where('user_id', $user->id)
                ->where('product_id', $productId)
                ->first();

            if ($existing) {
                DB::table('wishlists')->where('id', $existing->id)->delete();
                return $this->sendResponse(true, 200, 'Product removed from wishlist', ['inWishlist' => false]);
            }

            DB::table('wishlists')->insert([
                'user_id' => $user->id,
                'product_id' => $productId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return $this->sendResponse(true, 200, 'Product added to wishlist', ['inWishlist' => true]);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error toggling wishlist', null, ['exception' => $e->getMessage()]);
        }
    }
}
