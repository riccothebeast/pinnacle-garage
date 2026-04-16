<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        // Optional filtering
        if ($request->has('brand')) {
            $query->where('brand', $request->brand);
        }
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }

    public function store(Request $request)
    {
        // Admin only (assuming logic applies later via middleware)
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|in:Jaguar,BMW,Range Rover',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'stock' => 'integer',
            'year' => 'nullable|string',
            'model' => 'nullable|string',
        ]);

        $product = Product::create($validatedData);

        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validatedData = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'brand'       => 'sometimes|in:Jaguar,BMW,Range Rover',
            'price'       => 'sometimes|numeric',
            'description' => 'nullable|string',
            'image'       => 'nullable|string',
            'stock'       => 'sometimes|integer',
            'year'        => 'nullable|string',
            'model'       => 'nullable|string',
        ]);

        $product->update($validatedData);

        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Product deleted']);
    }
}
