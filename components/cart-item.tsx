'use client';

import { CartItem as CartItemType } from '@/lib/types';
import { products } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

interface CartItemProps {
  item: CartItemType;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const product = products.find((p) => p.id === item.productId);

  if (!product) {
    return null;
  }

  const decrementQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.productId, item.quantity - 1);
    }
  };

  const incrementQuantity = () => {
    if (item.quantity < product.stock) {
      onUpdateQuantity(item.productId, item.quantity + 1);
    }
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className="flex gap-4 py-6 border-b border-gray-200">
      {/* Product Image */}
      <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          width={80}
          height={80}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1">${item.price.toFixed(2)} each</p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-3 bg-gray-100 rounded-lg w-fit p-2">
          <button
            onClick={decrementQuantity}
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded transition text-sm"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
          <button
            onClick={incrementQuantity}
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded transition text-sm"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Price and Remove */}
      <div className="text-right flex flex-col justify-between">
        <div>
          <p className="text-lg font-bold text-gray-900">${subtotal.toFixed(2)}</p>
          <p className="text-xs text-gray-500">Subtotal</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.productId)}
          className="text-red-600 hover:bg-red-50 hover:text-red-700 gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Remove
        </Button>
      </div>
    </div>
  );
}
