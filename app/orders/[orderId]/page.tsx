'use client';

import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useOrders } from '@/lib/orders-context';
import { Navbar } from '@/components/navbar';
import { OrderStatusBadge, OrderTimeline } from '@/components/order-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download } from 'lucide-react';
import { useEffect } from 'react';
import jsPDF from 'jspdf';

export default function OrderDetailPage() {
  const { user, isLoading } = useAuth();
  const { getOrderById } = useOrders();
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

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

  const order = getOrderById(orderId);

  if (!order || order.userId !== user.id) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-gray-600">Order not found.</p>
          <Button onClick={() => router.push('/orders')} className="mt-4">
            Back to Orders
          </Button>
        </main>
      </div>
    );
  }

  const generateInvoice = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPosition = margin;

    // Header
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235); // Blue
    doc.text('CARTIFY', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Invoice Date: ${new Date(order.createdAt).toLocaleDateString()}`, margin, yPosition);
    yPosition += 7;
    doc.text(`Order ID: ${order.id}`, margin, yPosition);
    yPosition += 7;
    doc.text(`Status: ${order.status}`, margin, yPosition);
    yPosition += 15;

    // Customer Info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Bill To:', margin, yPosition);
    yPosition += 7;
    doc.setFontSize(10);
    doc.text(user.name, margin + 5, yPosition);
    yPosition += 5;
    doc.text(user.email, margin + 5, yPosition);
    yPosition += 15;

    // Items Table
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Items:', margin, yPosition);
    yPosition += 10;

    // Table headers
    doc.setFontSize(9);
    doc.setFillColor(230, 230, 230);
    const col1 = margin;
    const col2 = pageWidth - margin - 60;
    const col3 = pageWidth - margin - 40;
    const col4 = pageWidth - margin;

    doc.text('Description', col1, yPosition);
    doc.text('Qty', col2, yPosition);
    doc.text('Price', col3, yPosition);
    doc.text('Total', col4, yPosition, { align: 'right' });
    yPosition += 8;

    // Items
    order.items.forEach((item) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text(item.name, col1, yPosition);
      doc.text(item.quantity.toString(), col2, yPosition);
      doc.text(`$${item.price.toFixed(2)}`, col3, yPosition);
      doc.text(`$${(item.price * item.quantity).toFixed(2)}`, col4, yPosition, { align: 'right' });
      yPosition += 7;
    });

    yPosition += 10;

    // Summary
    const subtotal = order.total / 1.08;
    const tax = order.total - subtotal;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Subtotal:', col3, yPosition);
    doc.text(`$${subtotal.toFixed(2)}`, col4, yPosition, { align: 'right' });
    yPosition += 7;

    doc.text('Tax (8%):', col3, yPosition);
    doc.text(`$${tax.toFixed(2)}`, col4, yPosition, { align: 'right' });
    yPosition += 10;

    // Total
    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235);
    doc.setFont(undefined, 'bold');
    doc.text('Total:', col3, yPosition);
    doc.text(`$${order.total.toFixed(2)}`, col4, yPosition, { align: 'right' });

    // Save
    doc.save(`cartify-invoice-${order.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/orders')}
          className="gap-2 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order {order.id.substring(0, 8)}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {/* Timeline */}
                <OrderTimeline
                  status={order.status}
                  createdAt={order.createdAt}
                  updatedAt={order.updatedAt}
                />

                {/* Items */}
                <div className="mt-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Items in Order</h3>
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start pb-4 border-b last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Quantity: <span className="font-medium">{item.quantity}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Unit Price: <span className="font-medium">${item.price.toFixed(2)}</span>
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${(order.total / 1.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span>${(order.total - order.total / 1.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total</span>
                  <span className="text-blue-600">${order.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Download Invoice */}
            <Button
              onClick={generateInvoice}
              className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
            >
              <Download className="w-4 h-4" />
              Download Invoice
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
