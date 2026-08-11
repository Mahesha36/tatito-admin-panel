<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Throwable;

class OrderController extends Controller
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

            $orders = DB::table('orders')
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();

            foreach ($orders as $order) {
                $order->items = DB::table('order_items')->where('order_id', $order->id)->get();
            }

            return $this->sendResponse(true, 200, 'Orders fetched successfully', $orders);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error fetching orders', null, ['exception' => $e->getMessage()]);
        }
    }

    public function checkout(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return $this->sendResponse(false, 401, 'Unauthenticated. Please login first.');
            }

            $cartItems = DB::table('cart_items')
                ->join('products', 'cart_items.product_id', '=', 'products.id')
                ->where('cart_items.user_id', $user->id)
                ->select(
                    'cart_items.*',
                    'products.name as product_name',
                    'products.price'
                )
                ->get();

            // Business Failure Check: Empty Cart
            if ($cartItems->isEmpty()) {
                return $this->sendResponse(false, 400, 'Business Failure: Your cart is empty. Add products before placing an order.');
            }

            $subtotal = 0;
            foreach ($cartItems as $item) {
                $subtotal += ($item->price * $item->quantity);
            }

            $orderNumber = 'TATITO-' . strtoupper(uniqid());

            $orderId = DB::transaction(function () use ($user, $cartItems, $subtotal, $orderNumber, $request) {
                $orderId = DB::table('orders')->insertGetId([
                    'user_id' => $user->id,
                    'order_number' => $orderNumber,
                    'subtotal' => $subtotal,
                    'discount_amount' => 0.00,
                    'total_amount' => $subtotal,
                    'status' => 'Placed',
                    'payment_method' => $request->paymentMethod ?? 'COD',
                    'shipping_address' => json_encode($request->shippingAddress ?? [
                        'name' => $user->name,
                        'phone' => $user->phone_number
                    ]),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                foreach ($cartItems as $item) {
                    DB::table('order_items')->insert([
                        'order_id' => $orderId,
                        'product_id' => $item->product_id,
                        'product_name' => $item->product_name,
                        'size' => $item->size,
                        'color' => $item->color,
                        'quantity' => $item->quantity,
                        'unit_price' => $item->price,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                // Empty user cart after successful checkout
                DB::table('cart_items')->where('user_id', $user->id)->delete();

                return $orderId;
            });

            return $this->sendResponse(true, 201, 'Order placed successfully', [
                'order_id' => $orderId,
                'order_number' => $orderNumber,
                'total_amount' => $subtotal,
                'status' => 'Placed'
            ]);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error during order checkout', null, ['exception' => $e->getMessage()]);
        }
    }
}
