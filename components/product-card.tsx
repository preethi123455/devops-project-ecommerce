'use client';

import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string, quantity: number, price: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity, product.price);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="w-full h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
          priority={false}
        />
      </div>

      <CardHeader className="flex-1">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
            <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap">
              {product.category}
            </span>
          </div>
          
          {/* Rating Section */}
          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating!)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
              {product.reviewCount && (
                <span className="text-xs text-gray-500">({product.reviewCount})</span>
              )}
            </div>
          )}
          
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <span className="text-xs text-gray-500">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        {product.stock > 0 && (
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
            <button
              onClick={decrementQuantity}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="flex-1 text-center font-medium">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`w-full gap-2 transition-all ${
            isAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {isAdded ? 'Added!' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
