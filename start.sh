set -e

echo "Rodando migrations..."
php artisan migrate --force

echo "Iniciando servidor..."
exec php artisan serve --host=0.0.0.0 --port=10000