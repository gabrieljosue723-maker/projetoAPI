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
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => [
                'foto' => $this->user->foto ? Storage::disk('public')->url($this->user->foto) : null,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ],
            'nome' => $this->nome,
            'descricao' => $this->descricao,
            'preco' => $this->preco,
            'imagem' => $this->imagem ? Storage::disk('public')->url($this->imagem) : null,
        ];
    }
}
