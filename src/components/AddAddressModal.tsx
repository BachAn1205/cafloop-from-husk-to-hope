import { useState, useEffect, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, ChevronDown } from 'lucide-react';

export interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  province: { code: number; name: string };
  district: { code: number; name: string };
  street: string;
  fullAddress: string;
}

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAddress: (newAddr: SavedAddress) => void;
}

function SearchableDropdown({ options, value, onChange, placeholder, disabled }: {
  options: { value: number; label: string }[];
  value: number | '';
  onChange: (value: number) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);
  const filteredOptions = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={`relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`} ref={dropdownRef}>
      <div 
        className="w-full text-xs md:text-sm px-3.5 py-2.5 rounded-xl bg-[#F6F6EE] border border-[#335C33]/25 flex justify-between items-center cursor-pointer text-[#335C33]"
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setSearch('');
          }
        }}
      >
        <span className={selectedOption ? "text-[#335C33] font-medium" : "text-[#8C5A35]"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute z-50 w-full bottom-full mb-1 bg-[#F6F6EE] border border-[#335C33]/25 rounded-xl shadow-lg max-h-60 overflow-hidden flex flex-col"
          >
            <div className="p-2 border-b border-[#335C33]/15 bg-white/50">
              <input 
                type="text"
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full text-xs md:text-sm px-3 py-1.5 rounded-lg bg-white border border-[#335C33]/20 focus:outline-none focus:border-[#335C33]"
              />
            </div>
            <div className="overflow-y-auto p-1 bg-[#F6F6EE]">
              {filteredOptions.length > 0 ? filteredOptions.map(opt => (
                <div 
                  key={opt.value}
                  className={`px-3 py-2 text-xs md:text-sm rounded-lg cursor-pointer hover:bg-[#E3EDD3] ${opt.value === value ? 'bg-[#335C33] text-white font-bold' : 'text-[#2C2E2B]'}`}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                >
                  {opt.label}
                </div>
              )) : (
                <div className="p-3 text-center text-xs text-gray-500">Không tìm thấy</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AddAddressModal({ isOpen, onClose, onSaveAddress }: AddAddressModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<{code: number, name: string} | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<{code: number, name: string} | null>(null);
  const [street, setStreet] = useState('');

  // Fetch provinces
  useEffect(() => {
    if (!isOpen) return;
    fetch('https://provinces.open-api.vn/api/v2/p/')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const sorted = [...data].sort((a, b) => {
            if (a.code === 1 || a.code === 79) {
              if (b.code !== 1 && b.code !== 79) return -1;
              return a.code === 1 ? -1 : 1;
            }
            if (b.code === 1 || b.code === 79) return 1;
            return a.name.localeCompare(b.name, 'vi');
          });
          setProvinces(sorted);
        }
      })
      .catch((err) => console.error('Failed to fetch provinces', err));
  }, [isOpen]);

  const handleProvinceChange = (codeStr: string) => {
    const code = parseInt(codeStr, 10);
    const p = provinces.find(x => x.code === code);
    setSelectedProvince(p || null);
    setSelectedDistrict(null);
    setDistricts([]);
    if (p) {
      fetch(`https://provinces.open-api.vn/api/v2/p/${code}?depth=2`)
        .then(r => r.json())
        .then(data => {
          const arr = data.districts || data.wards || [];
          const getPriority = (n: string) => {
            const name = n.toLowerCase();
            if (name.startsWith('phường')) return 1;
            if (name.startsWith('thị trấn')) return 2;
            if (name.startsWith('xã')) return 3;
            return 4;
          };
          const sorted = [...arr].sort((a, b) => {
            const pA = getPriority(a.name);
            const pB = getPriority(b.name);
            if (pA !== pB) return pA - pB;
            return a.name.localeCompare(b.name, 'vi');
          });
          setDistricts(sorted);
        })
        .catch(err => console.error(err));
    }
  };

  const handleDistrictChange = (codeStr: string) => {
    const code = parseInt(codeStr, 10);
    const d = districts.find(x => x.code === code);
    setSelectedDistrict(d || null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (!/^0\d{9}$/.test(cleanPhone)) {
      alert('Vui lòng nhập số điện thoại hợp lệ (đủ 10 chữ số, bắt đầu bằng 0)');
      return;
    }
    if (!selectedProvince || !selectedDistrict || !street.trim()) {
      alert('Vui lòng điền đầy đủ Tỉnh/Thành, Quận/Huyện và Tên đường');
      return;
    }

    const fullAddress = `${street.trim()}, ${selectedDistrict.name}, ${selectedProvince.name}`;
    const newAddr: SavedAddress = {
      id: `addr_${Date.now()}`,
      name: name.trim(),
      phone: cleanPhone,
      province: selectedProvince,
      district: selectedDistrict,
      street: street.trim(),
      fullAddress,
    };

    onSaveAddress(newAddr);
    handleReset();
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setStreet('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleReset}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-50 w-full max-w-[440px] bg-[#F6F6EE] rounded-3xl p-6 md:p-7 shadow-2xl border border-[#335C33]/20 max-h-[90vh] overflow-y-auto"
        >
          <button
            type="button"
            onClick={handleReset}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#E3EDD3] text-[#335C33] hover:bg-[#d6e3c2] transition-colors cursor-pointer shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-[#335C33] font-bold text-lg mb-1 font-serif">
            <MapPin className="w-5 h-5 text-[#8C5A35]" />
            <span>Thêm Địa Chỉ Nhận Hàng</span>
          </div>
          <p className="text-xs text-[#8C5A35] mb-4">
            Nhập thông tin người nhận và địa chỉ giao hàng của bạn
          </p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#335C33] mb-1">
                Họ và tên người nhận *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ và tên..."
                className="w-full text-xs md:text-sm px-3.5 py-2.5 rounded-xl bg-[#F6F6EE] border border-[#335C33]/25 focus:outline-none focus:border-[#335C33] focus:ring-1 focus:ring-[#335C33] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#335C33] mb-1">
                Số điện thoại * (10 chữ số)
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="0987654321..."
                className="w-full text-xs md:text-sm px-3.5 py-2.5 rounded-xl bg-[#F6F6EE] border border-[#335C33]/25 focus:outline-none focus:border-[#335C33] focus:ring-1 focus:ring-[#335C33] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#335C33] mb-1">
                Tỉnh / Thành phố *
              </label>
              <SearchableDropdown
                placeholder="Chọn Tỉnh/Thành phố"
                options={provinces.map(p => ({ value: p.code, label: p.name }))}
                value={selectedProvince?.code || ''}
                onChange={(val) => handleProvinceChange(val.toString())}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#335C33] mb-1">
                Quận / Huyện / Phường / Xã *
              </label>
              <SearchableDropdown
                placeholder="Chọn Quận/Huyện/Phường/Xã"
                options={districts.map(d => ({ value: d.code, label: d.name }))}
                value={selectedDistrict?.code || ''}
                onChange={(val) => handleDistrictChange(val.toString())}
                disabled={!selectedProvince}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#335C33] mb-1">
                Số nhà, Tên đường *
              </label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="VD: Số 123 Đường Nguyễn Trãi..."
                className="w-full text-xs md:text-sm px-3.5 py-2.5 rounded-xl bg-[#F6F6EE] border border-[#335C33]/25 focus:outline-none focus:border-[#335C33] focus:ring-1 focus:ring-[#335C33] transition-all"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-3 rounded-xl border border-[#335C33]/20 text-[#8C5A35] font-semibold text-xs hover:bg-[#E3EDD3]/50 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-[#335C33] text-[#F6F6EE] font-bold text-xs hover:bg-[#284828] transition-colors shadow-md cursor-pointer"
              >
                Lưu Địa Chỉ
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
