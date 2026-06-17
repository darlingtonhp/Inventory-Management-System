<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('parent')
            ->withCount('products')
            ->orderBy('name')
            ->get();

        return inertia('Category/Index', [
            'categories' => $categories,
            'parentCategories' => Category::whereNull('parent_id')->get(),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        Category::create($validated);

        return redirect()->route('category.index')->with('success', 'Category created successfully.');
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id|different:id',
        ]);

        $category->update($validated);

        return redirect()->route('category.index')->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        // SRS 3.2.1: A category cannot be deleted if it contains active products.
        if ($category->products()->where('status', 'Active')->exists()) {
            return redirect()->route('category.index')->with('error', 'Cannot delete category containing active products.');
        }

        $category->delete();

        return redirect()->route('category.index')->with('success', 'Category deleted successfully.');
    }
}
