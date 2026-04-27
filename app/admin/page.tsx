'use client';

import { useAuth } from '@/lib/auth-context';
import { useOrders } from '@/lib/orders-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const { orders } = useOrders();
  const router = useRouter();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    stock: '',
    image: '/products/headphones.jpg',
  });
  const [products, setProducts] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const savedProducts = localStorage.getItem('cartify_custom_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) {
      alert('Please fill in all required fields');
      return;
    }

    const newProduct = {
      id: `custom_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock),
      image: formData.image,
      rating: 4.5,
      reviewCount: 0,
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('cartify_custom_products', JSON.stringify(updatedProducts));
    
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Electronics',
      stock: '',
      image: '/products/headphones.jpg',
    });
    setShowAddProduct(false);
    setSuccessMessage('Product added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem('cartify_custom_products', JSON.stringify(updatedProducts));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const processingOrders = orders.filter(o => o.status === 'Processing');
  const shippedOrders = orders.filter(o => o.status === 'Shipped');
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage orders and update shipment status</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setShowAddProduct(false)}
            className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium"
          >
            Order Management
          </button>
          <button
            onClick={() => setShowAddProduct(true)}
            className="px-4 py-2 border-b-2 border-transparent text-gray-600 hover:text-blue-600 font-medium"
          >
            Product Management
          </button>
        </div>

        {/* Product Management Section */}
        {showAddProduct && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Product
                </CardTitle>
                <CardDescription>Add a new item to the store inventory</CardDescription>
              </CardHeader>
              <CardContent>
                {successMessage && (
                  <div className="mb-4 p-3 bg-green-100 text-green-800 rounded text-sm">
                    {successMessage}
                  </div>
                )}
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Product Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Premium Headphones"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option>Electronics</option>
                        <option>Clothing</option>
                        <option>Books</option>
                        <option>Home & Garden</option>
                        <option>Sports & Outdoors</option>
                        <option>Toys & Games</option>
                        <option>Beauty & Personal Care</option>
                        <option>Kitchen & Dining</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price ($) *</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="99.99"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Stock Quantity *</label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        placeholder="50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Product details and features"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Product Image URL</label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/products/headphones.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Add Product
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddProduct(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Products List */}
            {products.length > 0 && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Custom Products ({products.length})</CardTitle>
                  <CardDescription>Products added by administrators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Product Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Category</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Price</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Stock</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium text-gray-900">{product.name}</td>
                            <td className="py-3 px-4 text-gray-600">{product.category}</td>
                            <td className="py-3 px-4 font-semibold">${product.price.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                product.stock > 20 ? 'bg-green-100 text-green-800' :
                                product.stock > 5 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {product.stock} units
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Stats Cards */}
        {!showAddProduct && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Processing Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{processingOrders.length}</div>
              <p className="text-xs text-gray-600 mt-2">Awaiting shipment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Shipped Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{shippedOrders.length}</div>
              <p className="text-xs text-gray-600 mt-2">In transit</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Delivered Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{deliveredOrders.length}</div>
              <p className="text-xs text-gray-600 mt-2">Completed</p>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Orders Table */}
        {!showAddProduct && (
        <Card>
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
            <CardDescription>Manage and update order statuses</CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-center text-gray-600 py-8">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Order ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Total</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline font-mono text-xs">
                            {order.id}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{order.userId}</td>
                        <td className="py-3 px-4 font-semibold">${order.total.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Button size="sm" variant="outline">
                              Manage
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        )}
      </main>
    </div>
  );
}
