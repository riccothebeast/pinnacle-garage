<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MpesaController extends Controller
{
    private function getAccessToken()
    {
        $consumerKey = env('MPESA_CONSUMER_KEY');
        $consumerSecret = env('MPESA_CONSUMER_SECRET');
        $env = env('MPESA_ENV', 'sandbox');

        $url = ($env === 'live')
            ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
            : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

        $response = Http::withBasicAuth($consumerKey, $consumerSecret)->get($url);

        return $response->json()['access_token'] ?? null;
    }

    public function stkPush(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'amount' => 'required|numeric|min:1',
            'reference' => 'required|string'
        ]);

        $phone = $request->phone;
        // Format phone number to start with 254
        if (str_starts_with($phone, '0')) {
            $phone = '254' . substr($phone, 1);
        } else if (str_starts_with($phone, '+')) {
            $phone = substr($phone, 1);
        }

        $token = $this->getAccessToken();
        if (!$token) {
            return response()->json(['error' => 'Failed to get access token'], 500);
        }

        $env = env('MPESA_ENV', 'sandbox');
        $url = ($env === 'live')
            ? 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
            : 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

        $shortCode = env('MPESA_SHORTCODE');
        $passkey = env('MPESA_PASSKEY');
        $timestamp = date('YmdHis');
        $password = base64_encode($shortCode . $passkey . $timestamp);

        $payload = [
            'BusinessShortCode' => $shortCode,
            'Password' => $password,
            'Timestamp' => $timestamp,
            'TransactionType' => 'CustomerPayBillOnline',
            'Amount' => round($request->amount), // M-Pesa requires integer amount
            'PartyA' => $phone,
            'PartyB' => $shortCode,
            'PhoneNumber' => $phone,
            'CallBackURL' => env('MPESA_CALLBACK_URL'),
            'AccountReference' => substr($request->reference, 0, 12),
            'TransactionDesc' => 'Payment for Auto Parts'
        ];

        $response = Http::withToken($token)->post($url, $payload);

        if ($response->successful()) {
            return response()->json($response->json());
        }

        Log::error('M-Pesa STK Push Error', $response->json());
        return response()->json(['error' => 'STK Push Failed', 'details' => $response->json()], 500);
    }
}
