<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Models\Product;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::orderBy('name')->get();
        return inertia('Supplier/Index', [
            'suppliers' => $suppliers,
            'success' => session('success'),
        ]);
    }

    public function create()
    {
        return inertia('Supplier/Create', [
            'products' => Product::orderBy('name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'payment_terms' => 'nullable|string|max:100',
            'is_active' => 'required|boolean',
            'products' => 'nullable|array',
            'products.*' => 'exists:products,id'
        ]);

        $supplier = Supplier::create($validated);

        if (!empty($validated['products'])) {
            $supplier->products()->sync($validated['products']);
        }

        return redirect()->route('supplier.index')->with('success', 'Supplier created successfully.');
    }

    public function show(Supplier $supplier)
    {
        $supplier->load(['products', 'purchaseOrders.items', 'purchaseOrders' => function ($q) {
            $q->orderBy('created_at', 'desc')->take(10);
        }]);

        return inertia('Supplier/Show', [
            'supplier' => $supplier,
        ]);
    }

    public function edit(Supplier $supplier)
    {
        $supplier->load('products');
        return inertia('Supplier/Edit', [
            'supplier' => $supplier,
            'products' => Product::orderBy('name')->get(),
            'linkedProductIds' => $supplier->products->pluck('id')->toArray()
        ]);
    }

    public function update(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'payment_terms' => 'nullable|string|max:100',
            'is_active' => 'required|boolean',
            'products' => 'nullable|array',
            'products.*' => 'exists:products,id'
        ]);

        $supplier->update($validated);

        if (isset($validated['products'])) {
            $supplier->products()->sync($validated['products']);
        } else {
            $supplier->products()->detach();
        }

        return redirect()->route('supplier.index')->with('success', 'Supplier updated successfully.');
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->products()->detach();
        $supplier->delete();
        return redirect()->route('supplier.index')->with('success', 'Supplier deleted successfully.');
    }
}
