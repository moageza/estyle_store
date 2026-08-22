import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { adminFetchOrders, adminUpdateOrderStatus } from '@/lib/api';
import type { DbOrder } from '@/lib/api';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export function OrdersPage() {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminFetchOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await adminUpdateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cream-dark border-t-accent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-ink">Orders ({orders.length})</h2>
        <button
          onClick={load}
          className="flex items-center gap-2 rounded-full border border-cream-dark px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-ink hover:text-ink"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-cream-dark bg-white py-16 text-center">
          <p className="text-ink-muted">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-cream-dark bg-white shadow-card"
            >
              {/* Order header */}
              <div
                className="flex cursor-pointer flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div className="flex flex-wrap items-center gap-4">
                  <p className="font-medium text-ink" dir="ltr">{order.id}</p>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="text-sm text-ink-muted">
                    {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-ink">{order.total.toLocaleString()} SAR</span>
                  <span className="text-sm text-ink-muted">{order.customer_name}</span>
                </div>
              </div>

              {/* Expanded details */}
              {expandedId === order.id && (
                <div className="border-t border-cream-dark px-6 py-4">
                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Customer info */}
                    <div>
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Customer</h4>
                      <div className="space-y-1 text-sm text-ink-soft">
                        <p><span className="text-ink-muted">Name:</span> {order.customer_name}</p>
                        <p><span className="text-ink-muted">Phone:</span> <span dir="ltr">{order.customer_phone}</span></p>
                        <p><span className="text-ink-muted">Email:</span> {order.customer_email}</p>
                        <p><span className="text-ink-muted">Address:</span> {order.customer_address}, {order.customer_city}</p>
                        {order.notes && <p><span className="text-ink-muted">Notes:</span> {order.notes}</p>}
                      </div>
                    </div>

                    {/* Order items */}
                    <div>
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Items</h4>
                      <div className="space-y-1 text-sm text-ink-soft">
                        {(() => {
                          const items = order.items as Array<{ productId: number; quantity: number; size: string; color: string }>;
                          return items.map((item, i) => (
                            <p key={i}>
                              Product #{item.productId} — {item.quantity}× {item.size} / {item.color}
                            </p>
                          ));
                        })()}
                      </div>
                      <div className="mt-3 space-y-1 border-t border-cream-dark pt-3 text-sm">
                        <p className="flex justify-between"><span className="text-ink-muted">Subtotal</span> <span>{order.subtotal.toLocaleString()} SAR</span></p>
                        <p className="flex justify-between"><span className="text-ink-muted">Shipping</span> <span>{order.shipping === 0 ? 'Free' : `${order.shipping} SAR`}</span></p>
                        <p className="flex justify-between font-semibold"><span>Total</span> <span>{order.total.toLocaleString()} SAR</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Status change */}
                  <div className="mt-6 flex items-center gap-3 border-t border-cream-dark pt-4">
                    <span className="text-sm font-medium text-ink-soft">Update status:</span>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_OPTIONS.map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(order.id, status)}
                          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                            order.status === status
                              ? 'bg-ink text-cream'
                              : 'border border-cream-dark text-ink-soft hover:border-ink hover:text-ink'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
