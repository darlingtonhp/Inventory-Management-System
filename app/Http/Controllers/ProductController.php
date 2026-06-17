<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Category;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        $query = Product::with(['category', 'inventory']);
        $sortFields = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'desc');

        if (request("name")) {
            $query->where("name", "like", "%" . request('name') . "%");
        }
        if (request("sku")) {
            $query->where("sku", "like", "%" . request('sku') . "%");
        }
        if (request("category_id")) {
            $query->where("category_id", request("category_id"));
        }
        if (request("status")) {
            $query->where("status", request("status"));
        }

        $products = $query->orderBy($sortFields, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia("Product/Index", [
            "products" => ProductResource::collection($products),
            "categories" => Category::all(),
            "queryParams" => request()->query() ?: null,
            "success" => session("success"),
        ]);
    }

    public function create()
    {
        return inertia("Product/Create", [
            'categories' => Category::all()
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();
        
        // Auto-generate unique SKU if not provided (SRS 3.2.2)
        if (empty($data['sku'])) {
            $count = Product::withTrashed()->count() + 1;
            $data['sku'] = 'PRD-' . strtoupper(Str::random(3)) . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
        }

        /** @var $image \Illuminate\Http\UploadedFile */
        $image = $data['image'] ?? null;
        if ($image) {
            $data['image_path'] = $image->store('product/' . Str::random(), 'public');
        }

        // Create product
        $product = Product::create($data);

        // Initialize Inventory record with 0 items (SRS 5)
        $product->inventory()->create([
            'quantity_on_hand' => 0,
            'quantity_reserved' => 0,
            'last_updated' => now()
        ]);

        return redirect()->route('product.index')
            ->with('success', __('Product was successfully created'));
    }

    public function show(Product $product)
    {
        $movements = $product->stockMovements()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->onEachSide(1);

        return inertia("Product/Show", [
            "product" => new ProductResource($product),
            "movements" => $movements,
            "queryParams" => request()->query() ?: null,
        ]);
    }

    public function edit(Product $product)
    {
        return inertia('Product/Edit', [
            'product' => new ProductResource($product),
            'categories' => Category::all()
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->validated();
        $image = $data['image'] ?? null;

        if ($image) {
            if ($product->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($product->image_path));
            }
            $data['image_path'] = $image->store('product/' . Str::random(), 'public');
        }

        $product->update($data);

        return redirect()->route('product.index')
            ->with('success', __('Product ' . $product->name . ' was updated successfully'));
    }

    public function destroy(Product $product)
    {
        $name = $product->name;
        
        // Soft delete the product (SRS 3.2.2)
        $product->delete();

        return redirect()->route('product.index')
            ->with('success', __('Product ') . $name . ' was successfully deleted');
    }
}
