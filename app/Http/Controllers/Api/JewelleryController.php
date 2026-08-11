<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class JewelleryController extends Controller
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

    public function getHub(Request $request)
    {
        try {
            $vaultBanner = [
                'title' => 'High Jewellery Atelier',
                'subtitle' => 'Bespoke Nizam Polki, Certified Solitaires & 22K BIS Hallmarked Gold Ornaments.',
                'image_path' => 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80',
            ];

            $categories = DB::table('jewellery_categories')
                ->where('is_active', true)
                ->get();

            $products = DB::table('jewellery_products')
                ->where('is_active', true)
                ->get();

            return $this->sendResponse(true, 200, 'Jewellery hub fetched successfully', [
                'vault_banner' => $vaultBanner,
                'categories' => $categories,
                'products' => $products
            ]);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error fetching jewellery hub', null, ['exception' => $e->getMessage()]);
        }
    }

    public function getProducts(Request $request)
    {
        try {
            $gender = $request->query('gender');
            $categoryKey = $request->query('category');

            $query = DB::table('jewellery_products')->where('is_active', true);

            if ($gender) {
                $query->whereIn('gender', [ucfirst(strtolower($gender)), 'Unisex']);
            }

            if ($categoryKey && $categoryKey !== 'cat_all') {
                $categoryObj = DB::table('jewellery_categories')->where('category_key', $categoryKey)->first();
                if ($categoryObj) {
                    $query->where('jewellery_category_id', $categoryObj->id);
                } else {
                    return $this->sendResponse(true, 200, 'No products found for this category', []);
                }
            }

            $products = $query->get();

            return $this->sendResponse(true, 200, 'Jewellery products fetched successfully', $products);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error fetching jewellery products', null, ['exception' => $e->getMessage()]);
        }
    }
}
