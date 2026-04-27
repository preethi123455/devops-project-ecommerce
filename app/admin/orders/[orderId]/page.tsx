'use client';

import { useAuth } from '@/lib/auth-context';
import { useOrders } from '@/lib/orders-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/navbar';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, Truck } from 'lucide-react';

export default function AdminOrderPage() {
  const { user, isLoading } = useAuth();
  const { getOrderById, updateOrderStatus } = useOrders();
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const order = getOrderById(orderId);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-gray-600">Order not found</p>
        </main>
      </div>
    );
  }

  const handleStatusUpdate = (newStatus: 'Processing' | 'Shipped' | 'Delivered') => {
    updateOrderStatus(orderId, newStatus);
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Processing':
        return <Clock className="w-5 h-5" />;
      case 'Shipped':
        return <Truck className="w-5 h-5" />;
      case 'Delivered':
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/admin" className="flex items-center gap-2 text-blue-600 hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {updateSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            Order status updated successfully!
          </div>
        )}

        <div className="grid gap-6">
          {/* Order Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Order {order.id}</CardTitle>
                  <CardDescription>Created on {new Date(order.createdAt).toLocaleDateString()}</CardDescription>
                </div>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                  order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </div>
            </CardHeader>
          </Card>

          {/* Status Update Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Update Order Status</CardTitle>
              <CardDescription>Click a button to update the order status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => handleStatusUpdate('Processing')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    order.status === 'Processing'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Processing</span>
                  </div>
                  <p className="text-sm text-gray-600">Order received and processing</p>
                  <Button 
                    size="sm" 
                    className="mt-3 w-full"
                    variant={order.status === 'Processing' ? 'default' : 'outline'}
                    onClick={(e) => {
                      e.preventDefault();
                      handleStatusUpdate('Processing');
                    }}
                  >
                    {order.status === 'Processing' ? 'Current Status' : 'Set to Processing'}
                  </Button>
                </button>

                <button
                  onClick={() => handleStatusUpdate('Shipped')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    order.status === 'Shipped'
                      ? 'border-yellow-600 bg-yellow-50'
                      : 'border-gray-200 hover:border-yellow-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Truck className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-gray-900">Shipped</span>
                  </div>
                  <p className="text-sm text-gray-600">Order is in transit</p>
                  <Button 
                    size="sm" 
                    className="mt-3 w-full"
                    variant={order.status === 'Shipped' ? 'default' : 'outline'}
                    onClick={(e) => {
                      e.preventDefault();
                      handleStatusUpdate('Shipped');
                    }}
                  >
                    {order.status === 'Shipped' ? 'Current Status' : 'Mark as Shipped'}
                  </Button>
                </button>

                <button
                  onClick={() => handleStatusUpdate('Delivered')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    order.status === 'Delivered'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-900">Delivered</span>
                  </div>
                  <p className="text-sm text-gray-600">Order delivered successfully</p>
                  <Button 
                    size="sm" 
                    className="mt-3 w-full"
                    variant={order.status === 'Delivered' ? 'default' : 'outline'}
                    onClick={(e) => {
                      e.preventDefault();
                      handleStatusUpdate('Delivered');
                    }}
                  >
                    {order.status === 'Delivered' ? 'Current Status' : 'Mark as Delivered'}
                  </Button>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${order.total.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-blue-600">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
