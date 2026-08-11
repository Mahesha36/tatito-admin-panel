<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Throwable;

class CartController extends Controller
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

            $items = DB::table('cart_items')
                ->join('products', 'cart_items.product_id', '=', 'products.id')
                ->where('cart_items.user_id', $user->id)
                ->select(
                    'cart_items.id',
                    'cart_items.product_id',
                    'cart_items.size',
                    'cart_items.color',
                    'cart_items.quantity',
                    'products.name as product_name',
                    'products.brand',
                    'products.price',
                    'products.thumbnail'
                )
                ->get();

            $subtotal = 0;
            foreach ($items as $item) {
                $subtotal += ($item->price * $item->quantity);
            }

            return $this->sendResponse(true, 200, 'Cart fetched successfully', [
                'items' => $items,
                'subtotal' => $subtotal,
                'shipping_fee' => $subtotal > 0 ? 0 : 0,
                'total' => $subtotal
            ]);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error fetching cart', null, ['exception' => $e->getMessage()]);
        }
    }

    public function add(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return $this->sendResponse(false, 401, 'Unauthenticated. Please login first.');
            }

            $validator = Validator::make($request->all(), [
                'productId' => 'required',
                'quantity' => 'integer|min:1',
                'size' => 'nullable|string',
                'color' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return $this->sendResponse(false, 422, 'Validation Error', null, $validator->errors());
            }

            $product = DB::table('products')->where('id', $request->productId)->first();
            if (!$product) {
                return $this->sendResponse(false, 404, 'Product not found.');
            }

            // Business Failure Check: Out of stock
            if ($product->stock_quantity <= 0) {
                return $this->sendResponse(false, 400, 'Business Failure: Requested product is currently out of stock.');
            }

            $quantity = $request->quantity ?? 1;

            $existing = DB::table('cart_items')
                ->where('user_id', $user->id)
                ->where('product_id', $product->id)
                ->where('size', $request->size)
                ->where('color', $request->color)
                ->first();

            if ($existing) {
                DB::table('cart_items')->where('id', $existing->id)->increment('quantity', $quantity);
            } else {
                DB::table('cart_items')->insert([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                    'size' => $request->size,
                    'color' => $request->color,
                    'quantity' => $quantity,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            return $this->sendResponse(true, 200, 'Item added to cart successfully');
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error adding to cart', null, ['exception' => $e->getMessage()]);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return $this->sendResponse(false, 401, 'Unauthenticated. Please login first.');
            }

            $quantity = $request->input('quantity');
            if ($quantity <= 0) {
                DB::table('cart_items')->where('id', $id)->where('user_id', $user->id)->delete();
                return $this->sendResponse(true, 200, 'Item removed from cart');
            }

            DB::table('cart_items')->where('id', $id)->where('user_id', $user->id)->update(['quantity' => $quantity, 'updated_at' => now()]);

            return $this->sendResponse(true, 200, 'Cart item quantity updated successfully');
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error updating cart item', null, ['exception' => $e->getMessage()]);
        }
    }

    public function remove(Request $request, $id)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return $this->sendResponse(false, 401, 'Unauthenticated. Please login first.');
            }

            DB::table('cart_items')->where('id', $id)->where('user_id', $user->id)->delete();

            return $this->sendResponse(true, 200, 'Item removed from cart successfully');
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error removing cart item', null, ['exception' => $e->getMessage()]);
        }
    }
}
