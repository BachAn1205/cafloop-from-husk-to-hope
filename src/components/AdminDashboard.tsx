import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Lock,
  RefreshCw,
  Search,
  Heart,
  Coffee,
  CreditCard,
  Users,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import { getSepayTransactions, type SepayTransaction } from '../utils/sepay';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DonationRecord {
  id: string;
  donation_code: string;
  amount: number;
  status: string;
  created_at: string;
  customers?: {
    full_name: string;
    phone: string;
  } | null;
}

interface OrderRecord {
  id: string;
  order_code: string;
  total_amount: number;
  shipping_address: string;
  status: string;
  note?: string;
  created_at: string;
  customers?: {
    full_name: string;
    phone: string;
  } | null;
}

interface CustomerRecord {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  created_at: string;
}

const DEFAULT_PIN = '2026';

export function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('cafloop_admin_authed') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<'overview' | 'donations' | 'orders' | 'transactions' | 'customers'>('overview');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Data states
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [sepayTxs, setSepayTxs] = useState<SepayTransaction[]>([]);

  // Authenticate PIN
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === DEFAULT_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('cafloop_admin_authed', 'true');
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleLock = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('cafloop_admin_authed');
  };

  // Fetch all dashboard data from Supabase & SePay
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Donations
      const { data: donationsData } = await supabase
        .from('donations')
        .select('*, customers(full_name, phone)')
        .order('created_at', { ascending: false });

      if (donationsData) setDonations(donationsData as DonationRecord[]);

      // 2. Fetch Orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, customers(full_name, phone)')
        .order('created_at', { ascending: false });

      if (ordersData) setOrders(ordersData as OrderRecord[]);

      // 3. Fetch Customers
      const { data: customersData } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (customersData) setCustomers(customersData as CustomerRecord[]);

      // 4. Fetch SePay Live Transactions
      const txs = await getSepayTransactions({ limit: 30, transferType: 'in' });
      setSepayTxs(txs);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu Admin:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchAllData();
    }
  }, [isOpen, isAuthenticated, fetchAllData]);

  if (!isOpen) return null;

  // Calculating stats
  const totalDonationAmount = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const totalOrderAmount = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const totalDonors = donations.length;
  const totalOrders = orders.length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-6xl bg-[#F6F6EE] text-[#2C2E2B] rounded-3xl shadow-2xl border border-[#335C33]/20 max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* PIN Lock Screen if not authenticated */}
          {!isAuthenticated ? (
            <div className="p-8 md:p-12 text-center max-w-md mx-auto my-auto flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[#E3EDD3] text-[#335C33] flex items-center justify-center mb-6 border border-[#335C33]/20 shadow-md">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold font-serif mb-2 text-[#335C33]">Trạm Quản Lý CAFLOOP</h2>
              <p className="text-xs text-[#2C2E2B]/75 mb-6">
                Nhập mã PIN xác thực Admin để truy cập bảng quản trị khách hàng và quyên góp.
              </p>

              <form onSubmit={handlePinSubmit} className="w-full space-y-4">
                <div>
                  <input
                    type="password"
                    maxLength={6}
                    autoFocus
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setPinError(false);
                    }}
                    placeholder="Nhập mã PIN (Mặc định: 2026)"
                    className={`w-full text-center text-lg font-mono tracking-widest px-4 py-3 rounded-xl bg-white text-[#335C33] border-2 ${
                      pinError ? 'border-red-500 text-red-600' : 'border-[#335C33]/25 focus:border-[#335C33]'
                    } focus:outline-none transition-all shadow-xs`}
                  />
                  {pinError && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center justify-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Mã PIN không chính xác!
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#335C33] hover:bg-[#284828] text-[#F6F6EE] font-bold text-sm transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#E3EDD3]" />
                  <span>Xác Nhận Mở Khóa</span>
                </button>
              </form>

              <button
                onClick={onClose}
                className="mt-6 text-xs text-[#335C33]/70 hover:text-[#335C33] font-medium transition-colors cursor-pointer"
              >
                Trở về trang chủ
              </button>
            </div>
          ) : (
            /* Authenticated Admin Dashboard Layout */
            <>
              {/* Header */}
              <div className="p-4 md:p-6 bg-[#E3EDD3]/80 border-b border-[#335C33]/15 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#335C33] text-[#F6F6EE] shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold font-serif text-[#335C33] flex items-center gap-2">
                      CAFLOOP Admin Console
                      <span className="text-[10px] font-sans font-semibold bg-[#335C33] text-[#F6F6EE] px-2.5 py-0.5 rounded-full shadow-xs">
                        LIVE
                      </span>
                    </h2>
                    <p className="text-[11px] text-[#335C33]/75 font-medium">Quản lý Đơn trà, Quyên góp & Lịch sử SePay</p>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchAllData}
                    disabled={loading}
                    className="p-2.5 rounded-xl bg-white hover:bg-[#F6F6EE] text-[#335C33] transition-colors cursor-pointer border border-[#335C33]/20 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                    title="Tải lại dữ liệu"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Làm mới</span>
                  </button>

                  <button
                    onClick={handleLock}
                    className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 transition-colors cursor-pointer border border-red-200 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                    title="Khóa điều khiển"
                  >
                    <Lock className="w-4 h-4" />
                    <span className="hidden sm:inline">Khóa PIN</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="p-2.5 rounded-xl bg-white hover:bg-[#F6F6EE] text-[#335C33] border border-[#335C33]/20 transition-colors cursor-pointer shadow-xs"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs & Search */}
              <div className="px-4 md:px-6 pt-3 bg-[#E3EDD3]/40 border-b border-[#335C33]/15 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2">
                  {[
                    { id: 'overview', label: 'Tổng Quan', icon: TrendingUp },
                    { id: 'donations', label: `Quyên Góp (${donations.length})`, icon: Heart },
                    { id: 'orders', label: `Đơn Trà (${orders.length})`, icon: Coffee },
                    { id: 'transactions', label: `Ngân Hàng SePay (${sepayTxs.length})`, icon: CreditCard },
                    { id: 'customers', label: `Khách Hàng (${customers.length})`, icon: Users },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                          isActive
                            ? 'bg-[#335C33] text-[#F6F6EE] shadow-sm'
                            : 'text-[#335C33]/80 hover:text-[#335C33] hover:bg-[#E3EDD3]/70'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Search Bar */}
                <div className="relative mb-2 w-full sm:w-auto">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#335C33]/60" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm tên, SĐT, mã..."
                    className="w-full sm:w-48 text-xs px-3 py-1.5 pl-8 rounded-lg bg-white border border-[#335C33]/20 focus:outline-none focus:border-[#335C33] text-[#335C33] placeholder-[#335C33]/40 shadow-xs"
                  />
                </div>
              </div>

              {/* Main Content Area */}
              <div className="p-4 md:p-6 overflow-y-auto flex-1 bg-[#F4F7F0]">
                {/* TAB 1: OVERVIEW */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Summary Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 md:p-5 rounded-2xl bg-white border border-[#335C33]/15 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-[#335C33]/70">Tổng Tiền Quyên Góp</span>
                          <div className="p-2 rounded-lg bg-[#8C5A35]/15 text-[#8C5A35]">
                            <Heart className="w-4 h-4" />
                          </div>
                        </div>
                        <p className="text-xl md:text-2xl font-bold text-[#8C5A35] font-mono">
                          {totalDonationAmount.toLocaleString('vi-VN')} đ
                        </p>
                        <span className="text-[11px] text-[#2C2E2B]/60 mt-1 block">Từ {totalDonors} lượt ủng hộ</span>
                      </div>

                      <div className="p-4 md:p-5 rounded-2xl bg-white border border-[#335C33]/15 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-[#335C33]/70">Doanh Thu Đơn Trà</span>
                          <div className="p-2 rounded-lg bg-[#335C33]/15 text-[#335C33]">
                            <Coffee className="w-4 h-4" />
                          </div>
                        </div>
                        <p className="text-xl md:text-2xl font-bold text-[#335C33] font-mono">
                          {totalOrderAmount.toLocaleString('vi-VN')} đ
                        </p>
                        <span className="text-[11px] text-[#2C2E2B]/60 mt-1 block">Từ {totalOrders} đơn đặt hàng</span>
                      </div>

                      <div className="p-4 md:p-5 rounded-2xl bg-white border border-[#335C33]/15 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-[#335C33]/70">Tổng Khách Hàng</span>
                          <div className="p-2 rounded-lg bg-blue-100 text-blue-800">
                            <Users className="w-4 h-4" />
                          </div>
                        </div>
                        <p className="text-xl md:text-2xl font-bold text-[#2C2E2B] font-mono">
                          {customers.length}
                        </p>
                        <span className="text-[11px] text-[#2C2E2B]/60 mt-1 block">Đã lưu trong Supabase DB</span>
                      </div>

                      <div className="p-4 md:p-5 rounded-2xl bg-white border border-[#335C33]/15 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-[#335C33]/70">Giao Dịch SePay Live</span>
                          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                            <CreditCard className="w-4 h-4" />
                          </div>
                        </div>
                        <p className="text-xl md:text-2xl font-bold text-emerald-800 font-mono">
                          {sepayTxs.length}
                        </p>
                        <span className="text-[11px] text-[#2C2E2B]/60 mt-1 block">MB Bank 2666627122005</span>
                      </div>
                    </div>

                    {/* Recent Activity Lists */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Recent Donations */}
                      <div className="p-4 md:p-5 rounded-2xl bg-white border border-[#335C33]/15 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold text-[#335C33] flex items-center gap-2">
                            <Heart className="w-4 h-4 text-[#8C5A35]" /> Quyên Góp Mới Nhất
                          </h3>
                          <button
                            onClick={() => setActiveTab('donations')}
                            className="text-xs font-semibold text-[#8C5A35] hover:text-[#335C33] cursor-pointer"
                          >
                            Xem tất cả →
                          </button>
                        </div>
                        <div className="space-y-2.5">
                          {donations.slice(0, 5).map((d) => (
                            <div key={d.id} className="p-3 rounded-xl bg-[#F6F6EE] flex items-center justify-between border border-[#335C33]/10 text-xs">
                              <div>
                                <p className="font-bold text-[#335C33]">{d.customers?.full_name || 'Nhà Hảo Tâm'}</p>
                                <p className="text-[11px] text-[#2C2E2B]/60">{d.customers?.phone || 'Chưa có SĐT'} • {new Date(d.created_at).toLocaleDateString('vi-VN')}</p>
                              </div>
                              <span className="font-mono font-bold text-[#8C5A35]">+{(Number(d.amount) || 0).toLocaleString('vi-VN')} đ</span>
                            </div>
                          ))}
                          {donations.length === 0 && <p className="text-xs text-[#2C2E2B]/50 text-center py-4">Chưa có lượt quyên góp nào.</p>}
                        </div>
                      </div>

                      {/* Recent Orders */}
                      <div className="p-4 md:p-5 rounded-2xl bg-white border border-[#335C33]/15 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold text-[#335C33] flex items-center gap-2">
                            <Coffee className="w-4 h-4 text-[#335C33]" /> Đơn Hàng Mới Nhất
                          </h3>
                          <button
                            onClick={() => setActiveTab('orders')}
                            className="text-xs font-semibold text-[#335C33] hover:text-[#284828] cursor-pointer"
                          >
                            Xem tất cả →
                          </button>
                        </div>
                        <div className="space-y-2.5">
                          {orders.slice(0, 5).map((o) => (
                            <div key={o.id} className="p-3 rounded-xl bg-[#F6F6EE] flex items-center justify-between border border-[#335C33]/10 text-xs">
                              <div>
                                <p className="font-bold text-[#335C33]">{o.customers?.full_name || 'Khách hàng'}</p>
                                <p className="text-[11px] text-[#2C2E2B]/60">{o.order_code} • {o.customers?.phone || ''}</p>
                              </div>
                              <span className="font-mono font-bold text-[#335C33]">{(Number(o.total_amount) || 0).toLocaleString('vi-VN')} đ</span>
                            </div>
                          ))}
                          {orders.length === 0 && <p className="text-xs text-[#2C2E2B]/50 text-center py-4">Chưa có đơn hàng nào.</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: DONATIONS */}
                {activeTab === 'donations' && (
                  <div className="bg-white rounded-2xl p-4 md:p-5 border border-[#335C33]/15 shadow-sm overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#335C33]/15 text-[#335C33]/70 bg-[#F6F6EE]/60">
                          <th className="pb-3 pt-1 px-2 font-semibold">Mã Quyên Góp</th>
                          <th className="pb-3 pt-1 px-2 font-semibold">Nhà Hảo Tâm</th>
                          <th className="pb-3 pt-1 px-2 font-semibold">Số Điện Thoại</th>
                          <th className="pb-3 pt-1 px-2 font-semibold text-right">Số Tiền (VNĐ)</th>
                          <th className="pb-3 pt-1 px-2 font-semibold text-center">Trạng Thái</th>
                          <th className="pb-3 pt-1 px-2 font-semibold text-right">Thời Gian</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#335C33]/10">
                        {donations
                          .filter((d) => {
                            const term = searchTerm.toLowerCase();
                            return (
                              d.donation_code.toLowerCase().includes(term) ||
                              (d.customers?.full_name || '').toLowerCase().includes(term) ||
                              (d.customers?.phone || '').includes(term)
                            );
                          })
                          .map((d) => (
                            <tr key={d.id} className="hover:bg-[#F4F7F0] transition-colors">
                              <td className="py-3 px-2 font-mono font-semibold text-[#335C33]">{d.donation_code}</td>
                              <td className="py-3 px-2 font-bold text-[#2C2E2B]">{d.customers?.full_name || 'Khô danh'}</td>
                              <td className="py-3 px-2 font-mono text-[#2C2E2B]/80">{d.customers?.phone || '—'}</td>
                              <td className="py-3 px-2 font-mono font-bold text-right text-[#8C5A35]">
                                +{(Number(d.amount) || 0).toLocaleString('vi-VN')} đ
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  <CheckCircle className="w-3 h-3" /> Đã nhận
                                </span>
                              </td>
                              <td className="py-3 px-2 text-right text-[#2C2E2B]/60 font-mono">
                                {new Date(d.created_at).toLocaleString('vi-VN')}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* TAB 3: ORDERS */}
                {activeTab === 'orders' && (
                  <div className="bg-white rounded-2xl p-4 md:p-5 border border-[#335C33]/15 shadow-sm overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#335C33]/15 text-[#335C33]/70 bg-[#F6F6EE]/60">
                          <th className="pb-3 pt-1 px-2 font-semibold">Mã Đơn</th>
                          <th className="pb-3 pt-1 px-2 font-semibold">Khách Hàng</th>
                          <th className="pb-3 pt-1 px-2 font-semibold">SĐT / Địa Chỉ</th>
                          <th className="pb-3 pt-1 px-2 font-semibold text-right">Tổng Tiền</th>
                          <th className="pb-3 pt-1 px-2 font-semibold text-center">Trạng Thái</th>
                          <th className="pb-3 pt-1 px-2 font-semibold text-right">Thời Gian</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#335C33]/10">
                        {orders
                          .filter((o) => {
                            const term = searchTerm.toLowerCase();
                            return (
                              o.order_code.toLowerCase().includes(term) ||
                              (o.customers?.full_name || '').toLowerCase().includes(term) ||
                              (o.customers?.phone || '').includes(term)
                            );
                          })
                          .map((o) => (
                            <tr key={o.id} className="hover:bg-[#F4F7F0] transition-colors">
                              <td className="py-3 px-2 font-mono font-semibold text-[#335C33]">{o.order_code}</td>
                              <td className="py-3 px-2 font-bold text-[#2C2E2B]">{o.customers?.full_name || 'Khách hàng'}</td>
                              <td className="py-3 px-2 text-[#2C2E2B]/80">
                                <span className="font-mono block text-[#335C33] font-semibold">{o.customers?.phone || '—'}</span>
                                <span className="text-[11px] text-[#2C2E2B]/60 truncate max-w-xs block">{o.shipping_address}</span>
                              </td>
                              <td className="py-3 px-2 font-mono font-bold text-right text-[#335C33]">
                                {(Number(o.total_amount) || 0).toLocaleString('vi-VN')} đ
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                  <Clock className="w-3 h-3" /> {o.status || 'Chờ đối soát'}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-right text-[#2C2E2B]/60 font-mono">
                                {new Date(o.created_at).toLocaleString('vi-VN')}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* TAB 4: SEPAY TRANSACTIONS */}
                {activeTab === 'transactions' && (
                  <div className="bg-white rounded-2xl p-4 md:p-5 border border-[#335C33]/15 shadow-sm overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#335C33]/15 text-[#335C33]/70 bg-[#F6F6EE]/60">
                          <th className="pb-3 pt-1 px-2 font-semibold">SePay ID</th>
                          <th className="pb-3 pt-1 px-2 font-semibold">Ngân Hàng / Số TK</th>
                          <th className="pb-3 pt-1 px-2 font-semibold">Nội Dung Chuyển Khoản</th>
                          <th className="pb-3 pt-1 px-2 font-semibold text-right">Số Tiền Vào</th>
                          <th className="pb-3 pt-1 px-2 font-semibold text-right">Thời Gian Thực</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#335C33]/10">
                        {sepayTxs
                          .filter((t) => {
                            const term = searchTerm.toLowerCase();
                            return (
                              t.id.toString().includes(term) ||
                              t.transaction_content.toLowerCase().includes(term)
                            );
                          })
                          .map((tx) => (
                            <tr key={tx.id} className="hover:bg-[#F4F7F0] transition-colors">
                              <td className="py-3 px-2 font-mono font-semibold text-[#335C33]">{tx.id}</td>
                              <td className="py-3 px-2 font-bold text-[#2C2E2B]">
                                {tx.bank_brand_name} • <span className="font-mono font-normal text-[#2C2E2B]/80">{tx.account_number}</span>
                              </td>
                              <td className="py-3 px-2 text-[#2C2E2B] font-mono text-[11px] max-w-sm break-words">
                                {tx.transaction_content}
                              </td>
                              <td className="py-3 px-2 font-mono font-bold text-right text-emerald-700">
                                +{parseFloat(tx.amount_in || '0').toLocaleString('vi-VN')} đ
                              </td>
                              <td className="py-3 px-2 text-right text-[#2C2E2B]/60 font-mono">
                                {tx.transaction_date}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* TAB 5: CUSTOMERS */}
                {activeTab === 'customers' && (
                  <div className="bg-white rounded-2xl p-4 md:p-5 border border-[#335C33]/15 shadow-sm overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#335C33]/15 text-[#335C33]/70 bg-[#F6F6EE]/60">
                          <th className="pb-3 pt-1 px-2 font-semibold">Họ và Tên</th>
                          <th className="pb-3 pt-1 px-2 font-semibold">Số Điện Thoại</th>
                          <th className="pb-3 pt-1 px-2 font-semibold">Email</th>
                          <th className="pb-3 pt-1 px-2 font-semibold text-right">Ngày Đăng Ký</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#335C33]/10">
                        {customers
                          .filter((c) => {
                            const term = searchTerm.toLowerCase();
                            return (
                              c.full_name.toLowerCase().includes(term) ||
                              c.phone.includes(term)
                            );
                          })
                          .map((c) => (
                            <tr key={c.id} className="hover:bg-[#F4F7F0] transition-colors">
                              <td className="py-3 px-2 font-bold text-[#335C33]">{c.full_name}</td>
                              <td className="py-3 px-2 font-mono font-semibold text-[#2C2E2B]">{c.phone}</td>
                              <td className="py-3 px-2 text-[#2C2E2B]/80">{c.email || '—'}</td>
                              <td className="py-3 px-2 text-right text-[#2C2E2B]/60 font-mono">
                                {new Date(c.created_at).toLocaleDateString('vi-VN')}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
