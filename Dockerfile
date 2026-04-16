FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev zip \
    && docker-php-ext-install zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy ONLY Laravel backend
COPY backend/ .

# Ensure required Laravel directories exist
RUN mkdir -p storage bootstrap/cache

# Set proper permissions
RUN chmod -R 775 storage bootstrap/cache

# Install Laravel dependencies
RUN composer install --no-interaction --prefer-dist

# Setup environment
RUN cp .env.example .env || true
RUN php artisan key:generate || true

# Expose Render port
EXPOSE 10000

# Start Laravel server
CMD php artisan serve --host=0.0.0.0 --port=10000