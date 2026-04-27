'use client';

import { Order } from '@/lib/types';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: Order['status'];
  showIcon?: boolean;
}

export function OrderStatusBadge({ status, showIcon = true }: OrderStatusBadgeProps) {
  const statusConfig = {
    Processing: {
      color: 'bg-yellow-100 text-yellow-800',
      icon: Clock,
      label: 'Processing',
    },
    Shipped: {
      color: 'bg-blue-100 text-blue-800',
      icon: Truck,
      label: 'Shipped',
    },
    Delivered: {
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle,
      label: 'Delivered',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      {showIcon && <Icon className="w-4 h-4" />}
      {config.label}
    </div>
  );
}

interface OrderTimelineProps {
  status: Order['status'];
  createdAt: string;
  updatedAt: string;
}

export function OrderTimeline({ status, createdAt, updatedAt }: OrderTimelineProps) {
  const steps = ['Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = steps.indexOf(status);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center flex-1">
            {/* Circle */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                index <= currentStepIndex
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index <= currentStepIndex ? '✓' : index + 1}
            </div>

            {/* Label */}
            <p className={`text-sm mt-2 font-medium ${
              index <= currentStepIndex ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {step}
            </p>

            {/* Line */}
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mt-4 transition-colors ${
                  index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                style={{ width: '100%', minWidth: '40px' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Timeline Info */}
      <div className="mt-8 space-y-2 text-sm">
        <p className="text-gray-600">
          <span className="font-medium">Order Placed:</span> {formatDate(createdAt)}
        </p>
        {status !== 'Processing' && (
          <p className="text-gray-600">
            <span className="font-medium">Last Updated:</span> {formatDate(updatedAt)}
          </p>
        )}
      </div>
    </div>
  );
}
