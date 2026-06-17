<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory, Auditable;

    protected $table = 'inventory';

    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'quantity_on_hand',
        'quantity_reserved',
        'last_updated'
    ];

    protected $casts = [
        'last_updated' => 'datetime',
        'quantity_on_hand' => 'integer',
        'quantity_reserved' => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    protected static function booted()
    {
        static::updated(function ($inventory) {
            $product = $inventory->product;
            if ($product && $inventory->quantity_on_hand <= $product->reorder_level) {
                try {
                    \Illuminate\Support\Facades\Mail::raw(
                        "Low stock alert: Product '{$product->name}' (SKU: {$product->sku}) is running low. " .
                        "Current quantity on hand: {$inventory->quantity_on_hand} {$product->unit} (Reorder level: {$product->reorder_level}).",
                        function ($message) use ($product) {
                            $message->to('admin@user.com')
                                ->subject("Low Stock Alert: {$product->sku}");
                        }
                    );
                } catch (\Exception $e) {
                    logger()->error("Failed to send low stock alert email: " . $e->getMessage());
                }
            }
        });
    }
}
