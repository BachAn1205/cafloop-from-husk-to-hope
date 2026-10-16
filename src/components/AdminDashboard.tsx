import { useState, useEffect, useCallback, useMemo } from 'react';
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
  AlertCircle,
  Database,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import {
  getSepayTransactions,
  extractDonationsFromSepay,
  type SepayTransaction,
} from '../utils/sepay';
import {
  getLocalDonations,
  getLocalOrders,
  syncSepayTransactionsToSupabase,
} from '../utils/supabaseDonation';

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

  // Status states
  const [dbStatus, setDbStatus] = useState<'connected' | 'error' | 'checking'>('checking');
  const [dbErrorMessage, setDbErrorMessage] = useState('');
  const [sepayStatus, setSepayStatus] = useState<'connected' | 'error' | 'checking'>('checking');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResultMsg, setSyncResultMsg] = useState('');
  const [txTypeFilter, setTxTypeFilter] = useState<'in' | 'all'>('in');

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

  // Fetch all dashboard data from Supabase & SePay độc lập
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setSyncResultMsg('');
    try {
      // 1. Chạy song song độc lập: Lỗi ở Supabase KHÔNG làm crash việc lấy giao dịch SePay!
      const [donationsRes, ordersRes, customersRes, sepayRes] = await Promise.allSettled([
        supabase.from('donations').select('*, customers(full_name, phone)').order('created_at', { ascending: false }),
        supabase.from('orders').select('*, customers(full_name, phone)').order('created_at', { ascending: false }),
        supabase.from('customers').select('*').order('created_at', { ascending: false }),
        getSepayTransactions({ limit: 100, transferType: 'all' }),
      ]);

      // Xử lý dữ liệu SePay Live
      let fetchedSepayTxs: SepayTransaction[] = [];
      if (sepayRes.status === 'fulfilled' && Array.isArray(sepayRes.value) && sepayRes.value.length > 0) {
        fetchedSepayTxs = sepayRes.value;
        setSepayTxs(fetchedSepayTxs);
        setSepayStatus('connected');
      } else {
        setSepayStatus(sepayRes.status === 'fulfilled' ? 'connected' : 'error');
      }

      // Xử lý dữ liệu Supabase
      let fetchedDonations: DonationRecord[] = [];
      let fetchedOrders: OrderRecord[] = [];
      let fetchedCustomers: CustomerRecord[] = [];
      let isDbOk = true;
      let dbErr = '';

      if (donationsRes.status === 'fulfilled') {
        if (donationsRes.value.error) {
          isDbOk = false;
          dbErr = donationsRes.value.error.message;
        } else if (donationsRes.value.data) {
          fetchedDonations = donationsRes.value.data as DonationRecord[];
        }
      } else {
        isDbOk = false;
        dbErr = donationsRes.reason?.message || 'Không thể kết nối máy chủ Supabase';
      }

      if (ordersRes.status === 'fulfilled' && !ordersRes.value.error && ordersRes.value.data) {
        fetchedOrders = ordersRes.value.data as OrderRecord[];
      }
      if (customersRes.status === 'fulfilled' && !customersRes.value.error && customersRes.value.data) {
        fetchedCustomers = customersRes.value.data as CustomerRecord[];
      }

      setDbStatus(isDbOk ? 'connected' : 'error');
      if (dbErr) setDbErrorMessage(dbErr);

      // 3. Fallback thông minh:
      // Nếu Supabase rỗng hoặc gặp lỗi kết nối, tự động trích xuất các đơn quyên góp thực tế từ SePay Live + LocalStorage
      const localDonations = getLocalDonations();
      const localOrders = getLocalOrders();

      if (fetchedDonations.length === 0) {
        // Tự động suy ra quyên góp từ 10 giao dịch SePay (khớp DON...)
        const derived = extractDonationsFromSepay(fetchedSepayTxs);
        const merged = [...derived];
        for (const loc of localDonations) {
          if (!merged.some((m) => m.donation_code === loc.donation_code)) {
            merged.push(loc);
          }
        }
        setDonations(merged);
      } else {
        const merged = [...fetchedDonations];
        for (const loc of localDonations) {
          if (!merged.some((m) => m.donation_code === loc.donation_code)) {
            merged.push(loc);
          }
        }
        setDonations(merged);
      }

      if (fetchedOrders.length === 0 && localOrders.length > 0) {
        setOrders(localOrders);
      } else {
        setOrders(fetchedOrders);
      }

      setCustomers(fetchedCustomers);
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

  // Đồng bộ giao dịch SePay vào Database khi người dùng bấm nút
  const handleSyncSepay = async () => {
    if (isSyncing || sepayTxs.length === 0) return;
    setIsSyncing(true);
    setSyncResultMsg('');
    try {
      const res = await syncSepayTransactionsToSupabase(sepayTxs);
      setSyncResultMsg(`✅ Đã đồng bộ ${res.success} giao dịch vào Database! (${res.failed} lỗi)`);
      fetchAllData();
    } catch (e: any) {
      setSyncResultMsg(`⚠️ Lỗi đồng bộ: ${e.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Filter SePay transactions
  const filteredSepayTxs = useMemo(() => {
    let list = sepayTxs;
    if (txTypeFilter === 'in') {
      list = list.filter((t) => parseFloat(t.amount_in || '0') > 0);
    }
    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(
      (t) =>
        t.id.toString().includes(term) ||
        (t.transaction_content || '').toLowerCase().includes(term) ||
        (t.account_number || '').includes(term) ||
        (t.code || '').toLowerCase().includes(term)
    );
  }, [sepayTxs, txTypeFilter, searchTerm]);

  if (!isOpen) return null;

  // Calculating stats
  const totalDonationAmount = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const totalOrderAmount = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const totalDonors = donations.length;
  const totalOrders = orders.length;

  // Giao dịch tiền vào thực tế trên SePay
  const sepayInCount = sepayTxs.filter((t) => parseFloat(t.amount_in || '0') > 0).length;

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
                    placeholder="Nhập mã PIN"
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

              {/* Status Bar */}
              <div className="px-4 md:px-6 py-2 bg-[#E3EDD3]/50 border-b border-[#335C33]/15 flex flex-wrap items-center justify-between text-xs gap-2">
                <div className="flex flex-wrap items-center gap-4">
                  {/* SePay Status */}
                  <div className="flex items-center gap-1.5 font-medium">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        sepayStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                      }`}
                    />
                    <span className="text-[#335C33]">
                      SePay Live:{' '}
                      <strong className="text-emerald-800">
                        MB 0972582580 ({sepayInCount} GD tiền vào)
                      </strong>
                    </span>
                  </div>

                  {/* Supabase Status */}
                  <div className="flex items-center gap-1.5 font-medium">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        dbStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    <span className="text-[#335C33]">
                      Supabase DB:{' '}
                      <strong className={dbStatus === 'connected' ? 'text-emerald-800' : 'text-amber-800'}>
                        {dbStatus === 'connected'
                          ? 'Đã kết nối'
                          : 'Đang offline / Tạm ngưng (Dùng dữ liệu SePay Live)'}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Sync Action */}
                <div className="flex items-center gap-2">
                  {syncResultMsg && (
                    <span className="text-[11px] font-semibold text-[#335C33]">{syncResultMsg}</span>
                  )}
                  {sepayTxs.length > 0 && dbStatus === 'connected' && (
                    <button
                      onClick={handleSyncSepay}
                      disabled={isSyncing}
                      className="px-2.5 py-1 rounded-lg bg-[#335C33] hover:bg-[#284828] text-white text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      {isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ SePay vào DB'}
                    </button>
                  )}
                </div>
              </div>

              {/* Informative Alert when Supabase is not connected */}
              {dbStatus === 'error' && (
                <div className="px-4 md:px-6 py-2.5 bg-amber-50/90 border-b border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      <strong>Lưu ý:</strong> Database Supabase chưa phản hồi ({dbErrorMessage || 'Domain không hợp lệ hoặc dự án Supabase đang bị tạm ngưng trên gói Free'}). Hệ thống đang tự động <strong>hiển thị trực tiếp dữ liệu Live từ SePay</strong>!
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation Tabs & Search */}
              <div className="px-4 md:px-6 pt-3 bg-[#E3EDD3]/40 border-b border-[#335C33]/15 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2">
                  {[
                    { id: 'overview', label: 'Tổng Quan', icon: TrendingUp },
                    { id: 'donations', label: `Quyên Góp (${donations.length})`, icon: Heart },
                    { id: 'orders', label: `Đơn Trà (${orders.length})`, icon: Coffee },
                    { id: 'transactions', label: `Ngân Hàng SePay (${sepayInCount})`, icon: CreditCard },
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
                      {/* Tổng tiền quyên góp */}
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
                        <span className="text-[11px] text-[#2C2E2B]/60 mt-1 block">
                          Từ {totalDonors} lượt ủng hộ {dbStatus === 'error' ? '(Nguồn SePay)' : ''}
                        </span>
                      </div>

                      {/* Doanh thu đơn trà */}
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
                        <span className="text-[11px] text-[#2C2E2B]/60 mt-1 block">
                          Từ {totalOrders} đơn đặt hàng
                        </span>
                      </div>

                      {/* Tổng khách hàng */}
                      <div className="p-4 md:p-5 rounded-2xl bg-white border border-[#335C33]/15 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-[#335C33]/70">Tổng Khách Hàng</span>
                          <div className="p-2 rounded-lg bg-blue-100 text-blue-800">
                            <Users className="w-4 h-4" />
                          </div>
                        </div>
                        <p className="text-xl md:text-2xl font-bold text-[#2C2E2B] font-mono">
                          {customers.length > 0 ? customers.length : totalDonors}
                        </p>
                        <span className="text-[11px] text-[#2C2E2B]/60 mt-1 block">
                          {customers.length > 0 ? 'Đã lưu trong Supabase DB' : 'Người ủng hộ qua SePay'}
                        </span>
                      </div>

                      {/* Giao dịch SePay Live */}
                      <div className="p-4 md:p-5 rounded-2xl bg-white border border-[#335C33]/15 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-[#335C33]/70">Giao Dịch SePay Live</span>
                          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                            <CreditCard className="w-4 h-4" />
                          </div>
                        </div>
                        <p className="text-xl md:text-2xl font-bold text-emerald-800 font-mono">
                          {sepayInCount}
                        </p>
                        <span className="text-[11px] text-[#2C2E2B]/60 mt-1 block">MB Bank 0972582580</span>
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
                            Xem tất cả ({donations.length}) →
                          </button>
                        </div>
                        <div className="space-y-2.5">
                          {donations.slice(0, 5).map((d) => (
                            <div
                              key={d.id}
                              className="p-3 rounded-xl bg-[#F6F6EE] flex items-center justify-between border border-[#335C33]/10 text-xs"
                            >
                              <div>
                                <p className="font-bold text-[#335C33]">
                                  {d.customers?.full_name || 'Nhà Hảo Tâm'}
                                </p>
                                <p className="text-[11px] text-[#2C2E2B]/60 font-mono">
                                  {d.donation_code} • {new Date(d.created_at).toLocaleDateString('vi-VN')}
                                </p>
                              </div>
                              <span className="font-mono font-bold text-[#8C5A35]">
                                +{(Number(d.amount) || 0).toLocaleString('vi-VN')} đ
                              </span>
                            </div>
                          ))}
                          {donations.length === 0 && (
                            <p className="text-xs text-[#2C2E2B]/50 text-center py-4">
                              Chưa có lượt quyên góp nào.
                            </p>
                          )}
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
                            Xem tất cả ({orders.length}) →
                          </button>
                        </div>
                        <div className="space-y-2.5">
                          {orders.slice(0, 5).map((o) => (
                            <div
                              key={o.id}
                              className="p-3 rounded-xl bg-[#F6F6EE] flex items-center justify-between border border-[#335C33]/10 text-xs"
                            >
                              <div>
                                <p className="font-bold text-[#335C33]">
                                  {o.customers?.full_name || 'Khách hàng'}
                                </p>
                                <p className="text-[11px] text-[#2C2E2B]/60 font-mono">
                                  {o.order_code} • {o.customers?.phone || ''}
                                </p>
                              </div>
                              <span className="font-mono font-bold text-[#335C33]">
                                {(Number(o.total_amount) || 0).toLocaleString('vi-VN')} đ
                              </span>
                            </div>
                          ))}
                          {orders.length === 0 && (
                            <p className="text-xs text-[#2C2E2B]/50 text-center py-4">
                              Chưa có đơn hàng nào.
                            </p>
                          )}
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
                          <th className="pb-3 pt-1 px-2 font-semibold">Nguồn / SĐT</th>
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
                              <td className="py-3 px-2 font-mono font-semibold text-[#8C5A35]">
                                {d.donation_code}
                              </td>
                              <td className="py-3 px-2 font-bold text-[#2C2E2B]">
                                {d.customers?.full_name || 'Nhà Hảo Tâm'}
                              </td>
                              <td className="py-3 px-2 font-mono text-[#2C2E2B]/80">
                                {d.customers?.phone || 'MB Bank 0972582580'}
                              </td>
                              <td className="py-3 px-2 font-mono font-bold text-right text-[#8C5A35]">
                                +{(Number(d.amount) || 0).toLocaleString('vi-VN')} đ
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  <CheckCircle className="w-3 h-3" /> Thành công
                                </span>
                              </td>
                              <td className="py-3 px-2 text-right text-[#2C2E2B]/60 font-mono">
                                {new Date(d.created_at).toLocaleString('vi-VN')}
                              </td>
                            </tr>
                          ))}
                        {donations.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-[#2C2E2B]/50">
                              Chưa có dữ liệu quyên góp.
                            </td>
                          </tr>
                        )}
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
                              <td className="py-3 px-2 font-mono font-semibold text-[#335C33]">
                                {o.order_code}
                              </td>
                              <td className="py-3 px-2 font-bold text-[#2C2E2B]">
                                {o.customers?.full_name || 'Khách hàng'}
                              </td>
                              <td className="py-3 px-2 text-[#2C2E2B]/80">
                                <span className="font-mono block text-[#335C33] font-semibold">
                                  {o.customers?.phone || '—'}
                                </span>
                                <span className="text-[11px] text-[#2C2E2B]/60 truncate max-w-xs block">
                                  {o.shipping_address}
                                </span>
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
                        {orders.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-[#2C2E2B]/50">
                              Chưa có đơn hàng nào.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* TAB 4: SEPAY TRANSACTIONS */}
                {activeTab === 'transactions' && (
                  <div className="space-y-4">
                    {/* Filter and stats banner */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#335C33]/15 text-xs shadow-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setTxTypeFilter('in')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                            txTypeFilter === 'in'
                              ? 'bg-emerald-700 text-white'
                              : 'bg-[#F6F6EE] text-[#335C33] hover:bg-[#E3EDD3]'
                          }`}
                        >
                          Chỉ Tiền Vào ({sepayInCount})
                        </button>
                        <button
                          onClick={() => setTxTypeFilter('all')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                            txTypeFilter === 'all'
                              ? 'bg-[#335C33] text-white'
                              : 'bg-[#F6F6EE] text-[#335C33] hover:bg-[#E3EDD3]'
                          }`}
                        >
                          Tất Cả ({sepayTxs.length})
                        </button>
                      </div>

                      <div className="text-[11px] text-[#2C2E2B]/70">
                        Đang kết nối SePay Gateway: <strong>MBBank (0972582580 & 2666627122005)</strong>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 md:p-5 border border-[#335C33]/15 shadow-sm overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#335C33]/15 text-[#335C33]/70 bg-[#F6F6EE]/60">
                            <th className="pb-3 pt-1 px-2 font-semibold">SePay ID</th>
                            <th className="pb-3 pt-1 px-2 font-semibold">Phân Loại</th>
                            <th className="pb-3 pt-1 px-2 font-semibold">Ngân Hàng / Số TK</th>
                            <th className="pb-3 pt-1 px-2 font-semibold">Nội Dung Chuyển Khoản</th>
                            <th className="pb-3 pt-1 px-2 font-semibold text-right">Số Tiền (VNĐ)</th>
                            <th className="pb-3 pt-1 px-2 font-semibold text-right">Thời Gian Thực</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#335C33]/10">
                          {filteredSepayTxs.map((tx) => {
                            const isIncoming = parseFloat(tx.amount_in || '0') > 0;
                            const amount = isIncoming
                              ? parseFloat(tx.amount_in || '0')
                              : parseFloat(tx.amount_out || '0');
                            const content = tx.transaction_content || '';
                            const isDonation = /DON[A-Z0-9]{4,10}/i.test(content);
                            const isOrder = /CAF[A-Z0-9]{4,10}/i.test(content);

                            return (
                              <tr key={tx.id} className="hover:bg-[#F4F7F0] transition-colors">
                                <td className="py-3 px-2 font-mono font-semibold text-[#335C33]">
                                  {tx.id}
                                </td>
                                <td className="py-3 px-2">
                                  {isDonation ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8C5A35]/15 text-[#8C5A35] border border-[#8C5A35]/30">
                                      <Heart className="w-2.5 h-2.5" /> Quyên góp
                                    </span>
                                  ) : isOrder ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#335C33]/15 text-[#335C33] border border-[#335C33]/30">
                                      <Coffee className="w-2.5 h-2.5" /> Đơn hàng
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700">
                                      Khác
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-2 font-bold text-[#2C2E2B]">
                                  {tx.bank_brand_name} •{' '}
                                  <span className="font-mono font-normal text-[#2C2E2B]/80">
                                    {tx.account_number}
                                  </span>
                                </td>
                                <td className="py-3 px-2 text-[#2C2E2B] font-mono text-[11px] max-w-sm break-words">
                                  {tx.transaction_content}
                                </td>
                                <td
                                  className={`py-3 px-2 font-mono font-bold text-right ${
                                    isIncoming ? 'text-emerald-700' : 'text-red-600'
                                  }`}
                                >
                                  {isIncoming ? '+' : '-'}
                                  {amount.toLocaleString('vi-VN')} đ
                                </td>
                                <td className="py-3 px-2 text-right text-[#2C2E2B]/60 font-mono">
                                  {tx.transaction_date}
                                </td>
                              </tr>
                            );
                          })}
                          {filteredSepayTxs.length === 0 && (
                            <tr>
                              <td colSpan={6} className="text-center py-8 text-[#2C2E2B]/50">
                                Không tìm thấy giao dịch SePay nào.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
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
                        {customers.length === 0 && (
                          <tr>
                            <td colSpan={4} className="text-center py-8 text-[#2C2E2B]/50">
                              {dbStatus === 'error'
                                ? 'Chưa kết nối được Supabase Database để tải danh sách khách hàng.'
                                : 'Chưa có thông tin khách hàng nào được lưu.'}
                            </td>
                          </tr>
                        )}
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
