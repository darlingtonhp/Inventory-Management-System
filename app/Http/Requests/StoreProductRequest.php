<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => ['required', 'max:255'],
            "category_id" => ['required', 'exists:categories,id'],
            "sku" => ['nullable', 'string', 'unique:products,sku'],
            "unit" => ['required', 'string', 'max:50'],
            "cost_price" => ['required', 'numeric', 'min:0'],
            "selling_price" => ['required', 'numeric', 'min:0'],
            "reorder_level" => ['required', 'integer', 'min:0'],
            "max_level" => ['nullable', 'integer', 'min:0'],
            "status" => ['required', 'string', 'in:Active,Inactive'],
            "image" => ['nullable', 'image'],
        ];
    }
}
