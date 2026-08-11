<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class HomeController extends Controller
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

    public function getFeed(Request $request)
    {
        try {
            $banners = DB::table('home_banners')
                ->where('is_active', true)
                ->orderBy('sort_order', 'asc')
                ->get();

            $menCollections = DB::table('home_collections')
                ->where('is_active', true)
                ->where('gender', 'Men')
                ->get();

            $womenCollections = DB::table('home_collections')
                ->where('is_active', true)
                ->where('gender', 'Women')
                ->get();

            $kidsCollections = DB::table('home_collections')
                ->where('is_active', true)
                ->where('gender', 'Kids')
                ->get();

            $dynamicSections = DB::table('home_dynamic_sections')
                ->where('is_active', true)
                ->orderBy('sort_order', 'asc')
                ->get();

            return $this->sendResponse(true, 200, 'Home feed fetched successfully', [
                'hero_banners' => $banners,
                'gender_collections' => [
                    'women' => $womenCollections,
                    'men' => $menCollections,
                    'kids' => $kidsCollections,
                ],
                'dynamic_sections' => $dynamicSections,
            ]);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error fetching home feed', null, ['exception' => $e->getMessage()]);
        }
    }

    public function getCollections(Request $request)
    {
        try {
            $gender = $request->query('gender');

            $query = DB::table('home_collections')->where('is_active', true);
            if ($gender) {
                $query->where('gender', ucfirst(strtolower($gender)));
            }

            $collections = $query->orderBy('sort_order', 'asc')->get();

            return $this->sendResponse(true, 200, 'Collections fetched successfully', $collections);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error fetching collections', null, ['exception' => $e->getMessage()]);
        }
    }
}
