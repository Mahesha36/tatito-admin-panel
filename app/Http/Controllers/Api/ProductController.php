<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class ProductController extends Controller
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
            $search = $request->query('search');
            $categoryId = $request->query('category_id');
            $gender = $request->query('gender');

            $query = DB::table('products')->where('is_active', true);

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('brand', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            if ($categoryId) {
                if (is_numeric($categoryId)) {
                    $query->where('category_id', $categoryId);
                } else {
                    $cat = DB::table('categories')->where('slug', $categoryId)->first();
                    if ($cat) {
                        $query->where('category_id', $cat->id);
                    }
                }
            }


            if ($gender) {
                $query->whereIn('gender', [ucfirst(strtolower($gender)), 'Unisex']);
            }

            $products = $query->orderBy('created_at', 'desc')->get();

            return $this->sendResponse(true, 200, 'Products fetched successfully', $products);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error fetching products', null, ['exception' => $e->getMessage()]);
        }
    }

    public function show($id)
    {
        try {
            $product = DB::table('products')->where('id', $id)->where('is_active', true)->first();

            if (!$product) {
                return $this->sendResponse(false, 404, 'Product not found.');
            }

            return $this->sendResponse(true, 200, 'Product details fetched successfully', $product);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error fetching product detail', null, ['exception' => $e->getMessage()]);
        }
    }

    public function categories()
    {
        try {
            $categories = DB::table('categories')->get();
            return $this->sendResponse(true, 200, 'Categories fetched successfully', $categories);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error fetching categories', null, ['exception' => $e->getMessage()]);
        }
    }
}

