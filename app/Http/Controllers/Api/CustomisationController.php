<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Throwable;

class CustomisationController extends Controller
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

    public function getStudios(Request $request)
    {
        try {
            $studios = DB::table('customisation_studios')
                ->where('is_active', true)
                ->get();

            return $this->sendResponse(true, 200, 'Customisation studios fetched successfully', $studios);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error fetching customisation studios', null, ['exception' => $e->getMessage()]);
        }
    }

    public function getOptions(Request $request)
    {
        try {
            $options = DB::table('customisation_options')
                ->where('is_active', true)
                ->get()
                ->groupBy('type');

            return $this->sendResponse(true, 200, 'Customisation options fetched successfully', [
                'brands' => $options->get('brand', []),
                'fabrics' => $options->get('fabric', []),
                'color_swatches' => $options->get('color_swatch', []),
            ]);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error fetching customisation options', null, ['exception' => $e->getMessage()]);
        }
    }

    public function submitRequest(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return $this->sendResponse(false, 401, 'Unauthenticated. Please login first.');
            }

            $validator = Validator::make($request->all(), [
                'itemName' => 'required|string|max:150',
                'brand' => 'nullable|string|max:100',
                'fabric' => 'nullable|string|max:100',
                'color' => 'nullable|string|max:50',
                'measurements' => 'nullable|array',
                'specialNotes' => 'nullable|string|max:1000',
                'appointmentDate' => 'nullable|date',
            ]);

            if ($validator->fails()) {
                return $this->sendResponse(false, 422, 'Validation Error', null, $validator->errors());
            }

            // Check if active pending request already exists for this item to prevent duplicate spam
            $existingRequest = DB::table('customisation_requests')
                ->where('user_id', $user->id)
                ->where('item_name', $request->itemName)
                ->whereIn('status', ['Pending', 'Tailoring in Progress'])
                ->first();

            if ($existingRequest) {
                return $this->sendResponse(false, 400, 'Business Failure: You already have an active tailoring request in progress for this item.', [
                    'active_order_id' => $existingRequest->id,
                    'status' => $existingRequest->status
                ]);
            }

            $requestId = DB::table('customisation_requests')->insertGetId([
                'user_id' => $user->id,
                'item_name' => $request->itemName,
                'brand' => $request->brand,
                'fabric' => $request->fabric,
                'color' => $request->color,
                'measurements' => json_encode($request->measurements ?? []),
                'special_notes' => $request->specialNotes,
                'appointment_date' => $request->appointmentDate ? Carbon::parse($request->appointmentDate) : null,
                'status' => 'Pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return $this->sendResponse(true, 201, 'Customisation request submitted successfully', [
                'id' => $requestId,
                'item_name' => $request->itemName,
                'status' => 'Pending',
                'date' => now()->format('d M Y')
            ]);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error submitting customisation request', null, ['exception' => $e->getMessage()]);
        }
    }

    public function getOrders(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return $this->sendResponse(false, 401, 'Unauthenticated. Please login first.');
            }

            $orders = DB::table('customisation_requests')
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();

            return $this->sendResponse(true, 200, 'Bespoke tailoring orders fetched successfully', $orders);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error fetching bespoke orders', null, ['exception' => $e->getMessage()]);
        }
    }
}
