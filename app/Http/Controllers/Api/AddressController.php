<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Throwable;

class AddressController extends Controller
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

            $addresses = DB::table('user_addresses')
                ->where('user_id', $user->id)
                ->orderBy('is_default', 'desc')
                ->get();

            return $this->sendResponse(true, 200, 'User addresses fetched successfully', $addresses);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error fetching user addresses', null, ['exception' => $e->getMessage()]);
        }
    }

    public function store(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return $this->sendResponse(false, 401, 'Unauthenticated. Please login first.');
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:100',
                'phoneNumber' => 'required|string|min:10|max:15',
                'streetAddress' => 'required|string|max:255',
                'city' => 'required|string|max:100',
                'state' => 'required|string|max:100',
                'pincode' => 'required|string|max:10',
            ]);

            if ($validator->fails()) {
                return $this->sendResponse(false, 422, 'Validation Error', null, $validator->errors());
            }

            $addressId = DB::table('user_addresses')->insertGetId([
                'user_id' => $user->id,
                'name' => $request->name,
                'phone_number' => $request->phoneNumber ?? $request->phone,
                'street_address' => $request->streetAddress ?? $request->street,
                'city' => $request->city,
                'state' => $request->state,
                'pincode' => $request->pincode,
                'is_default' => $request->isDefault ?? false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return $this->sendResponse(true, 201, 'Address saved successfully', ['id' => $addressId]);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error saving address', null, ['exception' => $e->getMessage()]);
        }
    }
}
