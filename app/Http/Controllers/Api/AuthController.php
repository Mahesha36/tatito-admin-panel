<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Otp;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Standardized JSON Response Helper.
     * Includes 'success', 'code', 'message', 'data', and 'errors'.
     */
    private function sendResponse(bool $success, int $code, string $message, $data = null, $errors = null)
    {
        $response = [
            'success' => $success,
            'code' => $code,
            'message' => $message,
        ];

        if ($data !== null) {
            $response['data'] = $data;
        }

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    /**
     * Format standardized user profile payload.
     */
    private function formatUserProfile($user)
    {
        if (!$user) return null;

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone_number' => $user->phone_number,
            'gender' => $user->gender,
            'date_of_birth' => $user->date_of_birth,
        ];
    }

    // ===========================
    // Send OTP
    // ===========================
    public function sendOtp(Request $request)
    {
        $phoneNumber = $request->phoneNumber ?? $request->phone ?? $request->phone_number;

        $validator = Validator::make(['phoneNumber' => $phoneNumber], [
            'phoneNumber' => 'required|string|min:10|max:15',
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 422, 'Validation Error', null, $validator->errors());
        }

        $otp = rand(100000, 999999);

        Otp::updateOrCreate(
            ['phone_number' => $phoneNumber],
            [
                'otp' => $otp,
                'expires_at' => Carbon::now()->addMinutes(5),
                'attempts' => 0
            ]
        );

        return $this->sendResponse(true, 200, 'OTP sent successfully', ['otp' => $otp]);
    }

    // ===========================
    // Verify OTP
    // ===========================
    public function verifyOtp(Request $request)
    {
        $phoneNumber = $request->phoneNumber ?? $request->phone ?? $request->phone_number;
        $otp = $request->otp ?? $request->code;

        $validator = Validator::make([
            'phoneNumber' => $phoneNumber,
            'otp' => $otp
        ], [
            'phoneNumber' => 'required',
            'otp' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 422, 'Validation Error', null, $validator->errors());
        }

        $otpData = Otp::where('phone_number', $phoneNumber)->first();

        if (!$otpData) {
            return $this->sendResponse(false, 400, 'OTP not found');
        }

        if (Carbon::now()->gt($otpData->expires_at)) {
            return $this->sendResponse(false, 400, 'OTP expired');
        }

        if ($otpData->otp != $otp) {
            $otpData->increment('attempts');
            return $this->sendResponse(false, 400, 'Invalid OTP');
        }

        $user = User::where('phone_number', $phoneNumber)->first();

        if ($user) {
            $token = $user->createToken('auth_token')->accessToken;

            return $this->sendResponse(true, 200, 'OTP Verified Successfully', [
                'is_new_user' => false,
                'token' => $token,
                'refreshToken' => null,
                'user' => $this->formatUserProfile($user)
            ]);
        }

        return $this->sendResponse(true, 200, 'OTP Verified. Please complete registration.', [
            'is_new_user' => true,
            'token' => null,
            'refreshToken' => null
        ]);
    }

    // ===========================
    // Register
    // ===========================
    public function register(Request $request)
    {
        $phoneNumber = $request->phoneNumber ?? $request->phone ?? $request->phone_number;
        $name = $request->name ?? $request->fullName ?? $request->full_name;
        $email = $request->email;
        $gender = $request->gender;
        $dob = $request->dateOfBirth ?? $request->date_of_birth ?? $request->dob;

        $validator = Validator::make([
            'name' => $name,
            'email' => $email,
            'phoneNumber' => $phoneNumber,
            'gender' => $gender,
        ], [
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'phoneNumber' => 'required|unique:users,phone_number',
            'gender' => 'nullable|string|in:Male,Female,Other',
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 422, 'Validation Error', null, $validator->errors());
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'phone_number' => $phoneNumber,
            'gender' => $gender ?? 'Male',
            'date_of_birth' => $dob,
            'password' => Hash::make('123456')
        ]);

        $token = $user->createToken('auth_token')->accessToken;

        return $this->sendResponse(true, 201, 'User Registered Successfully', [
            'is_new_user' => false,
            'token' => $token,
            'refreshToken' => null,
            'user' => $this->formatUserProfile($user)
        ]);
    }

    // ===========================
    // Login
    // ===========================
    public function login(Request $request)
    {
        $phoneNumber = $request->phoneNumber ?? $request->phone ?? $request->phone_number;
        $otp = $request->otp ?? $request->code;

        $validator = Validator::make([
            'phoneNumber' => $phoneNumber,
            'otp' => $otp
        ], [
            'phoneNumber' => 'required|string|min:10|max:15',
            'otp' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 422, 'Validation Error', null, $validator->errors());
        }

        $otpData = Otp::where('phone_number', $phoneNumber)->first();

        if (!$otpData) {
            return $this->sendResponse(false, 400, 'OTP not found');
        }

        if (Carbon::now()->gt($otpData->expires_at)) {
            return $this->sendResponse(false, 400, 'OTP expired');
        }

        if ($otpData->otp != $otp) {
            $otpData->increment('attempts');
            return $this->sendResponse(false, 400, 'Invalid OTP');
        }

        $user = User::where('phone_number', $phoneNumber)->first();

        if (!$user) {
            return $this->sendResponse(false, 404, 'User not found. Please register first.');
        }

        $otpData->delete();

        $token = $user->createToken('auth_token')->accessToken;

        return $this->sendResponse(true, 200, 'Login Successful', [
            'is_new_user' => false,
            'token' => $token,
            'refreshToken' => null,
            'user' => $this->formatUserProfile($user)
        ]);
    }
}