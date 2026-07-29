<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarrinhoItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'quantidade' => $this->quantidade,
            'produto' => new ProdutoResource($this->whenLoaded('produto', $this->produto)),
            'subtotal' => round($this->quantidade * $this->produto->preco, 2),
        ];
    }
}
