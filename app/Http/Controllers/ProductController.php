<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Http\Resources\TransactionResource;
use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Product::query();
        $sortFields = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'desc');

        if (request("name")) {
            $query->where("name", "like", "%" . request('name') . "%");
        }
        // Assuming 'status' is not a field in the Product model and thus removing this condition

        $products = $query->orderBy($sortFields, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia("Product/Index", [
            "products" => ProductResource::collection($products),
            "queryParams" => request()->query() ?: null,
            "success" => session("success"),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("Product/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $data =  $request->validated();
        /** @var $image \illuminate\Http\UploadedFile */
        $image = $data['image'] ?? null;
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();
        if ($image) {
            $data['image_path'] = $image->store('product/' . Str::random(), 'public');
        }
        Product::create($data);

        return to_route('product.index')
            ->with('success', __('The product was successfully created'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $query = $product->transactions(); // Assuming $product is your product model instance
        $sortFields = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'desc');

        if (request("name")) {
            $query = $query->where("name", "like", "%" . request('name') . "%");
        }
        if (request("status")) {
            $query = $query->where("status", request("status"));
        }

        $transactions = $query->orderBy($sortFields, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia(
            "Product/Show",
            [
                "product" => new ProductResource($product),
                "transactions" => TransactionResource::collection($transactions),
                "queryParams" => request()->query() ?: null,
            ]
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        return inertia('Product/Edit', [
            'product' => new ProductResource($product),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->validated();
        $image = $data['image'] ?? null;
        $data['updated_by'] = Auth::id();

        if ($image) {
            if ($product->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($product->image_path));
            }
            $data['image_path'] = $image->store('product/' . Str::random(), 'public');
        }

        $product->update($data);

        return redirect()->route('product.index')->with('success', __('Product ' . $product->name . ' was updated successfully'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $name = $product->name;
        $product->delete();
        if ($product->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($product->image_path));
        }
        return to_route('product.index')->with('success', __(' Product ') . $name . ' was deleted');
    }
}
