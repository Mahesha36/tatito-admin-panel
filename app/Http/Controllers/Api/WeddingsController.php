<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Throwable;

class WeddingsController extends Controller
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
            $gender = $request->query('gender');

            $banner = [
                'tagline' => 'ROYAL WEDDING EDITION',
                'title' => 'The Grand Bridal Couture',
                'subtitle' => 'Explore bespoke wedding ensembles handcrafted for your unforgettable moments.',
                'image_path' => 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
                'video_url' => 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-on-a-runway-41275-large.mp4',
            ];

            $query = DB::table('wedding_collections')->where('is_active', true);
            if ($gender) {
                $query->where('gender', ucfirst(strtolower($gender)));
            }
            $collections = $query->orderBy('sort_order', 'asc')->get();

            $featuredProducts = DB::table('products')
                ->where('is_active', true)
                ->where('is_featured', true)
                ->get();

            return $this->sendResponse(true, 200, 'Weddings hub data fetched successfully', [
                'banner' => $banner,
                'collections' => $collections,
                'featured_products' => $featuredProducts
            ]);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error fetching weddings hub', null, ['exception' => $e->getMessage()]);
        }
    }

    public function bookConsultation(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return $this->sendResponse(false, 401, 'Unauthenticated. Please login first.');
            }

            $validator = Validator::make($request->all(), [
                'serviceType' => 'nullable|string|max:100',
                'bookingDate' => 'required|date',
                'notes' => 'nullable|string|max:500',
            ]);

            if ($validator->fails()) {
                return $this->sendResponse(false, 422, 'Validation Error', null, $validator->errors());
            }

            $bookingDate = Carbon::parse($request->bookingDate);
            if ($bookingDate->isPast()) {
                return $this->sendResponse(false, 400, 'Business Failure: Consultation appointment date must be in the future.');
            }

            $bookingId = DB::table('stylist_bookings')->insertGetId([
                'user_id' => $user->id,
                'service_type' => $request->serviceType ?? 'Bridal Consultation',
                'notes' => $request->notes,
                'booking_date' => $bookingDate,
                'status' => 'Pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return $this->sendResponse(true, 201, 'Wedding stylist consultation booked successfully', [
                'booking_id' => $bookingId,
                'booking_date' => $bookingDate->toDateTimeString(),
                'status' => 'Pending'
            ]);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error booking consultation', null, ['exception' => $e->getMessage()]);
        }
    }
}
