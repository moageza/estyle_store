import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { signOut, getCurrentUser } from '@/lib/api';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [email, setEmail] = useState('');
  const location = useLocation();

  useEffect(() => {
    getCurrentUser().then((u) => setEmail(u?.email ?? ''));
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/admin/login';
  };

  return (
    <div className="flex min-h-screen bg-cream-dark">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-ink text-cream">
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sand text-ink">
            <Sparkles size={16} />
          </span>
          <span className="font-serif text-lg font-bold">eStyle Admin</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <p className="mb-3 truncate text-xs text-white/50">{email}</p>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 start-0 flex w-72 flex-col bg-ink text-cream">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
              <span className="font-serif text-lg font-bold">eStyle Admin</span>
              <button onClick={() => setSidebarOpen(false)} className="text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="border-t border-white/10 p-4">
              <p className="mb-3 truncate text-xs text-white/50">{email}</p>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b border-cream-dark bg-white px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-cream-dark lg:hidden"
          >
            <Menu size={20} />
          </button>
          <h1 className="font-serif text-lg font-semibold text-ink">Admin Dashboard</h1>
          <div className="ms-auto">
            <Link
              to="/"
              target="_blank"
              className="rounded-full border border-cream-dark px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-ink hover:text-ink"
            >
              View Store ↗
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
