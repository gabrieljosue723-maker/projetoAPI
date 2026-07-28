<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Produto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Produto>
 */
class ProdutoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'nome' => $this->faker->title(),
            'descricao' => $this->faker->text(),
            'preco' => $this->faker->numberBetween(1000, 100000),
            'imagem' => $this->faker->imageUrl(),
        ];
    }
}
