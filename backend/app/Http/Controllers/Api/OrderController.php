<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_email' => 'required|email',
            'user_phone' => 'required|string',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
        ]);

        try {
            DB::beginTransaction();

            $total = 0;
            foreach ($validatedData['items'] as $item) {
                $product = \App\Models\Product::find($item['product_id']);
                
                if (!$product || $product->stock < $item['quantity']) {
                    throw new \Exception("Product '{$product->name}' is out of stock or insufficient quantity.");
                }

                $total += $item['quantity'] * $item['price'];
            }

            $order = Order::create([
                'user_email' => $validatedData['user_email'],
                'user_phone' => $validatedData['user_phone'],
                'total_amount' => $total,
                'status' => 'pending'
            ]);

            foreach ($validatedData['items'] as $item) {
                // Create order item
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price']
                ]);

                // Reduce stock
                $product = \App\Models\Product::find($item['product_id']);
                $product->decrement('stock', $item['quantity']);
            }

            DB::commit();

            return response()->json(['message' => 'Order created successfully!', 'order_id' => $order->id], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Order failed to process.', 'error' => $e->getMessage()], 500);
        }
    }
}
