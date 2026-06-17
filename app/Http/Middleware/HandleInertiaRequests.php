<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        
        $lowStockCount = 0;
        $lowStockItems = [];

        if ($user) {
            $lowStockQuery = \App\Models\Product::whereHas('inventory', function ($q) {
                $q->whereRaw('inventory.quantity_on_hand <= products.reorder_level');
            });
            
            $lowStockCount = $lowStockQuery->count();
            $lowStockItems = $lowStockQuery->with('inventory')->take(5)->get()->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'sku' => $p->sku,
                    'on_hand' => $p->inventory ? $p->inventory->quantity_on_hand : 0,
                    'reorder_level' => $p->reorder_level,
                    'unit' => $p->unit,
                ];
            })->toArray();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'lowStockCount' => $lowStockCount,
            'lowStockItems' => $lowStockItems,
        ];
    }
}
