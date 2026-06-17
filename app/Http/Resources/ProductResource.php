<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductResource extends JsonResource
{
    public static  $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'sku' => $this->sku,
            'unit' => $this->unit,
            'cost_price' => (float)$this->cost_price,
            'selling_price' => (float)$this->selling_price,
            'reorder_level' => (int)$this->reorder_level,
            'max_level' => (int)$this->max_level,
            'status' => $this->status,
            'image_path' => $this->image_path ? Storage::url($this->image_path) : '',
            'category_id' => $this->category_id,
            'category_name' => $this->category?->name,
            'quantity' => $this->inventory ? (int)$this->inventory->quantity_on_hand : 0,
            'created_at' => $this->created_at->format('Y-m-d'),
            'updated_at' => $this->updated_at->format('Y-m-d'),
        ];
    }
}
