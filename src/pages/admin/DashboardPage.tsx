import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { adminFetchAllProducts, adminFetchOrders } from '@/lib/api';
import type { DbOrder } from '@/lib/api';

export function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [products, orders] = await Promise.all([
          adminFetchAllProducts(),
          adminFetchOrders(),
        ]);
        setStats({
          totalProducts: products.length,
          activeProducts: products.filter((p) => p.is_active).length,
          totalOrders: orders.length,
          pendingOrders: orders.filter((o) => o.status === 'pending').length,
          totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
        });
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cream-dark border-t-accent" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      sub: `${stats.activeProducts} active`,
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      sub: `${stats.pendingOrders} pending`,
      icon: ShoppingCart,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Revenue',
      value: `${stats.totalRevenue.toLocaleString()} SAR`,
      sub: 'All time',
      icon: DollarSign,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders,
      sub: 'Needs attention',
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div>
      <h2 className="mb-6 font-serif text-2xl font-bold text-ink">Dashboard</h2>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-cream-dark bg-white p-5 shadow-card"
          >
            <div className="flex items-center gap-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
                <card.icon size={20} />
              </span>
              <div>
                <p className="text-xs text-ink-muted">{card.label}</p>
                <p className="text-xl font-bold text-ink">{card.value}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-ink-muted">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border border-cream-dark bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-cream-dark px-6 py-4">
          <h3 className="font-serif text-lg font-semibold text-ink">Recent Orders</h3>
          <Link
            to="/admin/orders"
            className="text-sm font-medium text-accent hover:underline"
          >
            View All
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-ink-muted">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-dark text-left text-xs text-ink-muted">
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-cream-dark last:border-0">
                    <td className="px-6 py-3 font-medium text-ink" dir="ltr">{order.id}</td>
                    <td className="px-6 py-3 text-ink-soft">{order.customer_name}</td>
                    <td className="px-6 py-3 font-medium text-ink">{order.total.toLocaleString()} SAR</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-3 text-ink-muted">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] ?? 'bg-gray-100 text-gray-700'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
