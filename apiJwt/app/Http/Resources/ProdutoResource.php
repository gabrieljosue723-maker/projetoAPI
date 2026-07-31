<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProdutoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
   public function toArray($request)
{
    return [
        'id' => $this->id,
        'nome' => $this->nome,
        'descricao' => $this->descricao,
        'preco' => $this->preco,
        'imagem' => $this->imagem ? url('storage/' . $this->imagem) : null,
        'telefone' => $this->telefone,
        'whatsapp' => $this->whatsapp,
        'facebook' => $this->facebook,
        'user' => [
            'id' => $this->user->id,
            'name' => $this->user->name,
        ],
        'created_at' => $this->created_at,
    ];
}
}
