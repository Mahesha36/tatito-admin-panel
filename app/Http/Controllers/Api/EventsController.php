<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Throwable;

class EventsController extends Controller
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

    public function getEvents(Request $request)
    {
        try {
            $events = DB::table('events')
                ->where('is_active', true)
                ->orderBy('created_at', 'asc')
                ->get();

            return $this->sendResponse(true, 200, 'Events fetched successfully', $events);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error fetching events', null, ['exception' => $e->getMessage()]);
        }
    }

    public function rsvp(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return $this->sendResponse(false, 401, 'Unauthenticated. Please login first.');
            }

            $validator = Validator::make($request->all(), [
                'eventId' => 'required',
            ]);

            if ($validator->fails()) {
                return $this->sendResponse(false, 422, 'Validation Error', null, $validator->errors());
            }

            $event = DB::table('events')->where('id', $request->eventId)->first();
            if (!$event) {
                return $this->sendResponse(false, 404, 'Event not found.');
            }

            // Business Failure Check 1: Seat Availability
            if ($event->available_seats <= 0) {
                return $this->sendResponse(false, 400, 'Business Failure: All VIP ticket passes for this event are sold out.');
            }

            // Business Failure Check 2: Duplicate RSVP
            $existingRsvp = DB::table('event_rsvps')
                ->where('event_id', $event->id)
                ->where('user_id', $user->id)
                ->first();

            if ($existingRsvp) {
                return $this->sendResponse(false, 400, 'Business Failure: You have already reserved a VIP pass for this event.', [
                    'pass_code' => $existingRsvp->pass_code,
                    'status' => $existingRsvp->status
                ]);
            }

            $passCode = ($event->ticket_prefix ?? 'TT-VIP') . '-' . rand(1000, 9999);

            DB::transaction(function () use ($event, $user, $passCode) {
                DB::table('event_rsvps')->insert([
                    'event_id' => $event->id,
                    'user_id' => $user->id,
                    'pass_code' => $passCode,
                    'status' => 'Confirmed',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                DB::table('events')->where('id', $event->id)->decrement('available_seats');
            });

            return $this->sendResponse(true, 200, 'VIP Ticket Pass reserved successfully', [
                'event_id' => $event->id,
                'event_title' => $event->title,
                'pass_code' => $passCode,
                'status' => 'Confirmed'
            ]);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error reserving event pass', null, ['exception' => $e->getMessage()]);
        }
    }

    public function getMyPasses(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return $this->sendResponse(false, 401, 'Unauthenticated. Please login first.');
            }

            $passes = DB::table('event_rsvps')
                ->join('events', 'event_rsvps.event_id', '=', 'events.id')
                ->where('event_rsvps.user_id', $user->id)
                ->select(
                    'event_rsvps.id as rsvp_id',
                    'event_rsvps.pass_code',
                    'event_rsvps.status',
                    'events.title',
                    'events.category',
                    'events.day',
                    'events.month',
                    'events.time',
                    'events.location',
                    'events.host'
                )
                ->get();

            return $this->sendResponse(true, 200, 'User VIP passes fetched successfully', $passes);
        } catch (Throwable $e) {
            return $this->sendResponse(false, 500, 'Server error fetching user passes', null, ['exception' => $e->getMessage()]);
        }
    }
}
