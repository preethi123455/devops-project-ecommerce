'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { products } from '@/lib/products';
import { Navbar } from '@/components/navbar';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function Home() {
  const { user, isLoading } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const categories = Array.from(new Set(products.map((p) => p.category))).sort();
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Electronics': '📱',
      'Clothing': '👕',
      'Books': '📚',
      'Home & Garden': '🏡',
      'Sports & Outdoors': '⛹️',
      'Toys & Games': '🎮',
      'Beauty & Personal Care': '💄',
      'Kitchen & Dining': '🍳',
    };
    return icons[category] || '🛍️';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="w-full">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Welcome to Cartify (Staging)</h1>
            <p className="text-lg sm:text-xl text-blue-100">Shop everything from electronics to fashion, books, home & garden, and more</p>
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className={`p-6 rounded-lg border-2 transition-all cursor-pointer text-center ${
                  selectedCategory === category
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="text-4xl mb-2">{getCategoryIcon(category)}</div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base">{category}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {products.filter(p => p.category === category).length} items
                </div>
              </button>
            ))}
          </div>

          {/* Quick Filter Bar */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(null)}
              className="whitespace-nowrap"
              size="sm"
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap text-xs sm:text-sm"
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Products Section Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
            </h2>
            <p className="text-gray-600 mt-1">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found in this category</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
