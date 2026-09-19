# 🌿 CAFLOOP DESIGN SYSTEM SPECIFICATION
> **Hệ thống Thiết kế Toàn diện cho Web: Tự nhiên, Bền vững & Hiện đại**  
> *Phong cách: Organic Sustainability, Eco-Modernism, Earthy Warmth & Editorial Elegance*

---

## 📑 Mục Lục
1. [Triết Lý & Nguyên Tắc Thiết Kế (Design Philosophy)](#1-triết-lý--nguyên-tắc-thiết-kế-design-philosophy)
2. [Bảng Màu Chuẩn Xác (Color Palette & Semantic Tokens)](#2-bảng-màu-chuẩn-xác-color-palette--semantic-tokens)
3. [Hệ Thống Typography (Kiểu Chữ & Cỡ Chữ)](#3-hệ-thống-typography-kiểu-chữ--cỡ-chữ)
4. [Hệ Thống Không Gian, Bo Góc & Đổ Bóng (Spacing, Radius & Shadows)](#4-hệ-thống-không-gian-bo-góc--đổ-bóng-spacing-radius--shadows)
5. [File Cấu Hình CSS & Tailwind (`index.css`)](#5-file-cấu-hình-css--tailwind-indexcss)
6. [Thư Viện UI Components Chuẩn Mẫu](#6-thư-viện-ui-components-chuẩn-mẫu)
   - [6.1 Section Badge (Thẻ Danh Mục)](#61-section-badge-thẻ-danh-mục)
   - [6.2 Section Header & Subtitle](#62-section-header--subtitle)
   - [6.3 Hệ Thống Nút Bấm (Button Variants)](#63-hệ-thống-nút-bấm-button-variants)
   - [6.4 Thẻ Thống Kê / Bento Grid Metric Card](#64-thẻ-thống-kê--bento-grid-metric-card)
   - [6.5 Thanh Tiến Trình (Progress Bar with Shimmer)](#65-thanh-tiến-trình-progress-bar-with-shimmer)
   - [6.6 Ô Nhập Liệu Form (Inputs & Selects)](#66-ô-nhập-liệu-form-inputs--selects)
   - [6.7 Hộp Thoại Modal (Modal Pattern)](#67-hộp-thoại-modal-modal-pattern)
   - [6.8 Sóng Âm Thanh & Điều Khiển Media (Audio Wave)](#68-sóng-âm-thanh--điều-khiển-media-audio-wave)
7. [Chuyển Động & Vi Tương Tác (Micro-interactions & Motion)](#7-chuyển-động--vi-tương-tác-micro-interactions--motion)
8. [Cấu Hình JSON & Token Nhanh (Design Tokens JSON)](#8-cấu-hình-json--token-nhanh-design-tokens-json)

---

## 1. Triết Lý & Nguyên Tắc Thiết Kế (Design Philosophy)

- **Cảm hứng Tự nhiên & Tuần hoàn (Circular & Organic Nature):** Sử dụng các tông màu đất ấm, màu nâu vỏ cà phê rang, màu xanh lá đậm của rừng nhiệt đới và màu kem dịu mắt. Tránh dùng màu trắng tinh khiết (`#FFFFFF`) cho background lớn để chống mỏi mắt và tăng tính ấm áp.
- **Tương phản Thanh lịch (Editorial Serif vs Humanist Sans):** Phối hợp tiêu đề có chân trang trọng cổ điển (*Lora*) với phần thân chữ không chân hình học hiện đại (*Plus Jakarta Sans / Raleway*), tạo cảm giác uy tín, chuyên nghiệp và có chiều sâu nội dung.
- **Micro-interactions Mượt mà:** Tương tác chạm, bấm đều có phản hồi xúc giác thị giác nhẹ (`scale: 0.96 - 0.98`), chuyển động mượt với đường cong chuyển động tự nhiên (`EASE_NATURAL`).
- **Khả năng tiếp cận (Accessibility & Anti-fatigue):** Độ tương phản cao giữa chữ than chì (`#2C2E2B`) trên nền kem (`#F6F6EE`), hỗ trợ Lining Numbers & Tabular Numbers cho tất cả số liệu tiền tệ, ngân hàng, thống kê.

---

## 2. Bảng Màu Chuẩn Xác (Color Palette & Semantic Tokens)

### 2.1 Bảng Màu Cơ Bản (Core Colors)

| Tên Token | Mã HEX | RGB | Mục Đích Sử Dụng |
| :--- | :--- | :--- | :--- |
| **`bg-cream`** | `#F6F6EE` | `rgb(246, 246, 238)` | Nền toàn trang, nền modal chính, nền input |
| **`surface-light`** | `#FAF9F2` | `rgb(250, 249, 242)` | Nền thẻ Bento, card nổi, khu vực thông tin phụ |
| **`surface-card-alt`**| `#FDFCF7` | `rgb(253, 252, 247)` | Bề mặt khung ảnh, viền sáng card |
| **`forest-green`** | `#335C33` | `rgb(51, 92, 51)` | Màu thương hiệu chủ đạo, tiêu đề H1/H2, nút chính, icon chính |
| **`forest-hover`** | `#284828` | `rgb(40, 72, 40)` | Trạng thái hover cho nút chính xanh rừng |
| **`matcha-light`** | `#E3EDD3` | `rgb(227, 237, 211)` | Nền badge tag, nền nút phụ, track thanh tiến trình |
| **`matcha-hover`** | `#D5E3C0` | `rgb(213, 227, 192)` | Trạng thái hover cho nút phụ matcha |
| **`terracotta-brown`**| `#8C5A35` | `rgb(140, 90, 53)` | Subtitle, nhãn phân loại, icon trái tim/quyên góp, điểm nhấn ấm |
| **`charcoal-text`** | `#2C2E2B` | `rgb(44, 46, 43)` | Màu chữ đọc nội dung chính (100%, 80%, 75%, 60% opacity) |

### 2.2 Dải Gradient Đặc Trưng

```css
/* Gradient thanh tiến trình (Eco Growth) */
background: linear-gradient(to right, #335C33, #4A7F4A);

/* Gradient viền rực rỡ / Aura sáng lập (Warm Earth Aura) */
background: linear-gradient(to top right, #335C33, #8C5A35);

/* Gradient nền thẻ mềm mại (Soft Gradient Card) */
background: linear-gradient(to bottom right, #FAF9F2, rgba(234, 239, 228, 0.7));

/* Gradient làm mờ chân trang Hero (Hero Bottom Blend) */
background: linear-gradient(to bottom, transparent, transparent, #F6F6EE);
```

---

## 3. Hệ Thống Typography (Kiểu Chữ & Cỡ Chữ)

### 3.1 Nhúng Google Fonts
Đặt đoạn mã sau vào thẻ `<head>` của `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Raleway:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### 3.2 Phân Cấp Kiểu Chữ (Type Scale & Usage)

| Phân Loại | Font Family | Trọng Lượng (Weight) | Letter Spacing | Sử Dụng Cho |
| :--- | :--- | :--- | :--- | :--- |
| **Display / H1** | `'Lora', serif` | `800 (Extrabold)` | `-0.02em` | Hero Headline, Tiêu đề lớn nhất (32px - 64px) |
| **H2 / Section Title** | `'Lora', serif` | `700 (Bold)` | `-0.02em` | Tiêu đề từng Section (24px - 48px) |
| **H3 / Card Title** | `'Lora', serif` | `700 (Bold)` | `-0.01em` | Tiêu đề khối / Bento card (18px - 28px) |
| **Section Subtitle** | `'Plus Jakarta Sans'` | `500 (Medium)` | Bình thường | Phụ đề dưới Header, màu `#8C5A35` (14px - 18px) |
| **Badge Tag** | `'Plus Jakarta Sans'` | `700 (Bold)` | `+0.05em` | Huy hiệu, thẻ trạng thái (12px - 13px UPPERCASE) |
| **Body Text** | `'Plus Jakarta Sans'` | `400 / 500` | Bình thường | Nội dung đoạn văn, line-height 1.6 (14px - 16px) |
| **Numbers & Counters** | `'Plus Jakarta Sans'` | `700 / 800` | `lining-nums, tnum` | Đồng hồ, số tiền VNĐ, phần trăm (Tránh nhảy layout) |

---

## 4. Hệ Thống Không Gian, Bo Góc & Đổ Bóng (Spacing, Radius & Shadows)

### 4.1 Bo Góc (Border Radius)
- **Huy hiệu / Badge / Capsule:** `rounded-full` (`9999px`)
- **Nút bấm (Button):** `rounded-xl` (`12px`) trên mobile, `rounded-2xl` (`16px`) trên desktop
- **Thẻ nội dung (Card / Box):** `rounded-2xl` (`16px`) đến `rounded-3xl` (`24px`)
- **Modal Popup:** `rounded-3xl` (`24px`)
- **Ô nhập liệu (Input field):** `rounded-xl` (`12px`)

### 4.2 Viền & Đổ Bóng (Borders & Elevation)
- **Đường viền mặc định:** `border border-[#335C33]/15` hoặc `border border-[#335C33]/10`
- **Đường viền nhấn mạnh:** `border-2 border-[#335C33]/20` hoặc `border-2 border-[#E3EDD3]`
- **Bóng mờ nhẹ (Shadow-xs / Shadow-sm):** `box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.04)`
- **Bóng mờ nổi bật (Shadow-md / Shadow-lg):** Dành cho thẻ khi hover hoặc Button chính
- **Bóng mờ Modal (Shadow-2xl):** Dành cho popup hộp thoại nổi trên nền đen mờ

---

## 5. File Cấu Hình CSS & Tailwind (`index.css`)

Sao chép toàn bộ nội dung sau vào file `src/index.css` của dự án mới:

```css
@import "tailwindcss";

/* ─── CAFLOOP DESIGN SYSTEM ────────────────────────────────── */
@layer base {
  :root {
    --font-heading: 'Lora', Georgia, serif;
    --font-body: 'Plus Jakarta Sans', 'Raleway', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    
    --color-bg-cream: #F6F6EE;
    --color-surface-light: #FAF9F2;
    --color-forest-green: #335C33;
    --color-forest-hover: #284828;
    --color-matcha-light: #E3EDD3;
    --color-matcha-hover: #D5E3C0;
    --color-terracotta: #8C5A35;
    --color-charcoal: #2C2E2B;
  }

  *,
  *::before,
  *::after {
    font-variant-numeric: lining-nums proportional-nums;
    -moz-font-feature-settings: "lnum" 1, "pnum" 1;
    -webkit-font-feature-settings: "lnum" 1, "pnum" 1;
    font-feature-settings: "lnum" 1, "pnum" 1;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background-color: var(--color-bg-cream);
    color: var(--color-charcoal);
    font-family: var(--font-body);
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  input,
  textarea,
  select,
  button {
    font-family: inherit;
    font-variant-numeric: lining-nums proportional-nums;
    font-feature-settings: "lnum" 1, "pnum" 1;
  }

  /* Headings & Serif Titles */
  h1, h2, h3, h4, h5, h6, .font-serif {
    font-family: var(--font-heading) !important;
    font-variant-numeric: lining-nums proportional-nums;
    font-feature-settings: "lnum" 1, "pnum" 1;
    word-spacing: -0.02em;
    letter-spacing: -0.02em;
  }

  /* Standard Unified Section Title Badge */
  .section-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.85rem;
    border-radius: 9999px;
    background-color: var(--color-matcha-light);
    color: var(--color-forest-green);
    border: 1px solid rgba(51, 92, 51, 0.15);
    font-family: var(--font-body) !important;
    font-size: 0.75rem; /* 12px */
    line-height: 1.25;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.04);
  }

  @media (min-width: 768px) {
    .section-badge {
      gap: 0.5rem;
      padding: 0.4rem 1rem;
      font-size: 0.8125rem; /* 13px */
    }
  }

  .section-badge svg {
    width: 0.9375rem; /* 15px */
    height: 0.9375rem;
    flex-shrink: 0;
  }

  @media (min-width: 768px) {
    .section-badge svg {
      width: 1.05rem; /* 17px */
      height: 1.05rem;
    }
  }

  /* Standard Unified Section Subtitle */
  .section-subtitle {
    color: var(--color-terracotta) !important;
    font-family: var(--font-body) !important;
    font-size: 0.875rem; /* 14px */
    font-weight: 500;
    line-height: 1.6;
  }

  @media (min-width: 768px) {
    .section-subtitle {
      font-size: 1rem; /* 16px */
    }
  }

  @media (min-width: 1024px) {
    .section-subtitle {
      font-size: 1.125rem; /* 18px */
    }
  }

  /* Tabular Numbers */
  .tabular-nums, .font-mono {
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: "lnum" 1, "tnum" 1;
  }

  /* Custom Thin Elegant Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(227, 237, 211, 0.3);
    border-radius: 9999px;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(51, 92, 51, 0.3);
    border-radius: 9999px;
    min-height: 60px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(51, 92, 51, 0.55);
  }
  ::-webkit-scrollbar-button {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(51, 92, 51, 0.3) rgba(227, 237, 211, 0.2);
  }

  /* Shimmer Animation Keyframe */
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
}
```

---

## 6. Thư Viện UI Components Chuẩn Mẫu

### 6.1 Section Badge (Thẻ Danh Mục)
```jsx
<div className="section-badge mb-3 md:mb-4">
  <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#8C5A35]" />
  <span>GIẢI PHÁP TUẦN HOÀN</span>
</div>
```

---

### 6.2 Section Header & Subtitle
```jsx
<div className="text-center max-w-3xl mx-auto space-y-3 mb-10 md:mb-14">
  <div className="section-badge mb-3">
    <Leaf className="text-[#335C33]" />
    <span>TÁC ĐỘNG XÃ HỘI</span>
  </div>
  <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#335C33] font-serif tracking-tight">
    Từ Vỏ Cà Phê Đến Cơ Hội Đến Trường
  </h2>
  <p className="section-subtitle mt-2.5">
    100% lợi nhuận sẽ được chuyển hoá thành phương tiện và học cụ cho các em nhỏ vùng cao
  </p>
</div>
```

---

### 6.3 Hệ Thống Nút Bấm (Button Variants)

#### 🟢 Primary Button (Nút Chính Rừng Nhiệt Đới):
```jsx
<button
  className="flex items-center justify-center gap-2 py-3.5 md:py-4 px-6 md:px-8 rounded-xl md:rounded-2xl bg-[#335C33] text-[#F6F6EE] font-semibold text-sm md:text-base shadow-md hover:bg-[#284828] active:scale-95 transition-all duration-200 cursor-pointer"
>
  <Coffee className="w-4 h-4 md:w-5 md:h-5 text-[#E3EDD3]" />
  <span>Đặt Trà Ngay</span>
</button>
```

#### 🌿 Secondary Pill Button (Nút Phụ Matcha):
```jsx
<button
  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#E3EDD3] text-[#335C33] hover:bg-[#D5E3C0] text-xs md:text-sm font-bold border border-[#335C33]/15 transition-colors shadow-xs cursor-pointer active:scale-95"
>
  <span>Tìm Hiểu Thêm</span>
</button>
```

#### ⚪ Glass / Light Button (Nút Kính Mờ):
```jsx
<button
  className="flex items-center justify-center gap-2 py-3 md:py-4 px-5 md:px-8 rounded-xl md:rounded-2xl bg-white/70 backdrop-blur-sm text-[#335C33] border border-[#335C33]/25 font-semibold text-sm md:text-base hover:bg-[#E3EDD3]/70 transition-all duration-200 cursor-pointer"
>
  <HeartHandshake className="w-4 h-4 md:w-5 md:h-5 text-[#8C5A35]" />
  <span>Xem Câu Chuyện</span>
</button>
```

---

### 6.4 Thẻ Thống Kê / Bento Grid Metric Card
```jsx
<div className="bg-[#E3EDD3] rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-xs border border-[#335C33]/15 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden group cursor-default">
  {/* Trang trí vòng tròn mờ */}
  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#335C33]/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
  
  <div>
    <div className="mb-4">
      <div className="w-11 h-11 rounded-xl bg-[#335C33] text-[#F6F6EE] flex items-center justify-center shadow-xs">
        <Recycle className="w-5 h-5 text-[#E3EDD3]" />
      </div>
    </div>
    <p className="text-xs md:text-sm font-bold text-[#335C33] leading-snug mb-2">
      Khối lượng vỏ cà phê tái chế
    </p>
  </div>

  <div className="relative z-10 mt-2">
    <div className="flex items-baseline gap-1.5">
      <span className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#335C33] tracking-tight font-serif tabular-nums">
        500
      </span>
      <span className="text-base md:text-lg font-bold text-[#8C5A35]">kg</span>
    </div>
    <p className="text-[11px] md:text-xs text-[#2C2E2B]/75 mt-2 leading-relaxed">
      Thu gom từ các nông hộ Đắk Lắk và chế biến theo quy trình an toàn.
    </p>
  </div>
</div>
```

---

### 6.5 Thanh Tiến Trình (Progress Bar with Shimmer)
```jsx
<div className="bg-[#F6F6EE] border-2 border-[#335C33]/20 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-md">
  {/* Header */}
  <div className="flex items-center justify-between mb-2">
    <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-[#8C5A35] flex items-center gap-1.5">
      <Sparkles className="w-3.5 h-3.5 text-[#8C5A35]" />
      Tiến độ gây quỹ
    </span>
    <span className="text-xs md:text-sm font-bold text-[#335C33] bg-[#E3EDD3] px-3 py-1 rounded-full">
      Giai đoạn 1
    </span>
  </div>

  <h3 className="text-base md:text-lg font-bold text-[#335C33] mb-4">
    Mục tiêu 77 Xe Đạp & 2 Smart TV
  </h3>

  {/* Progress Track */}
  <div className="relative w-full h-5 md:h-6 bg-[#E3EDD3] rounded-full overflow-hidden mb-3 shadow-inner">
    <div
      className="h-full bg-gradient-to-r from-[#335C33] to-[#4A7F4A] rounded-full relative overflow-hidden transition-all duration-1000"
      style={{ width: '100%' }}
    >
      <div className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
  </div>

  {/* Footnote */}
  <div className="flex items-center justify-between text-xs md:text-sm font-semibold">
    <span className="text-[#335C33] font-bold flex items-center gap-1.5">
      <CheckCircle2 className="w-4 h-4 text-[#335C33]" />
      <span>Đã đạt 100% mục tiêu</span>
    </span>
    <span className="text-[#8C5A35]">Hoàn thành vào 10/2026</span>
  </div>
</div>
```

---

### 6.6 Ô Nhập Liệu Form (Inputs & Selects)
```jsx
<div className="space-y-4">
  <div>
    <label className="block text-xs md:text-sm font-semibold text-[#335C33] mb-1.5">
      Họ và tên của bạn
    </label>
    <input
      type="text"
      placeholder="Nhập họ và tên..."
      className="w-full text-xs md:text-sm px-3.5 py-2.5 md:px-4 md:py-3 rounded-xl bg-[#F6F6EE] border border-[#335C33]/25 focus:outline-none focus:border-[#335C33] focus:ring-1 focus:ring-[#335C33] transition-all"
    />
  </div>

  <div>
    <label className="block text-xs md:text-sm font-semibold text-[#335C33] mb-1.5">
      Số tiền quyên góp
    </label>
    <div className="relative">
      <input
        type="text"
        placeholder="100.000"
        className="w-full text-base md:text-lg font-bold text-[#335C33] px-3.5 py-3 rounded-xl bg-[#F6F6EE] border-2 border-[#335C33]/20 focus:outline-none focus:border-[#335C33] focus:ring-1 focus:ring-[#335C33] pr-14"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C5A35] font-bold text-sm">
        VNĐ
      </span>
    </div>
  </div>
</div>
```

---

### 6.7 Hộp Thoại Modal (Modal Pattern)
```jsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
  {/* Backdrop */}
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

  {/* Modal Card */}
  <div className="relative z-10 w-full max-w-[420px] md:max-w-md bg-[#F6F6EE] rounded-3xl p-6 md:p-8 shadow-2xl border border-[#335C33]/20 max-h-[90vh] overflow-y-auto">
    {/* Close button */}
    <button className="absolute top-4 right-4 p-2 rounded-full bg-[#E3EDD3] text-[#335C33] hover:bg-[#D5E3C0] transition-colors cursor-pointer shadow-xs">
      <X className="w-4 h-4" />
    </button>

    <div className="section-badge mb-2">
      <Sparkles className="text-[#8C5A35]" />
      <span>HÀNH ĐỘNG</span>
    </div>

    <h3 className="text-xl md:text-2xl font-bold text-[#335C33] font-serif mb-1.5">
      Xác Nhận Quyên Góp
    </h3>
    <p className="text-xs md:text-sm text-[#8C5A35] mb-6">
      Mỗi sự đóng góp đều mang lại giá trị thiết thực.
    </p>

    {/* Form contents */}
  </div>
</div>
```

---

### 6.8 Sóng Âm Thanh & Điều Khiển Media (Audio Wave)
```jsx
<button className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-[#335C33] text-[#F6F6EE] text-xs md:text-sm font-medium shadow-sm ring-2 ring-[#335C33]/20">
  <Volume2 className="w-4 h-4 text-[#E3EDD3]" />
  <span className="font-semibold text-xs">Đang phát</span>
  
  {/* Thanh sóng nhạc động */}
  <span className="flex gap-0.5 items-end h-3.5 ml-1">
    {[0.5, 1, 0.65, 0.85, 0.45, 0.9].map((h, i) => (
      <span
        key={i}
        className="w-0.5 bg-[#E3EDD3] rounded-full animate-pulse"
        style={{ height: `${h * 100}%` }}
      />
    ))}
  </span>
</button>
```

---

## 7. Chuyển Động & Vi Tương Tác (Micro-interactions & Motion)

Nếu bạn sử dụng thư viện `motion` (hoặc `framer-motion`):

```typescript
// Đường cong easing tự nhiên mô phỏng chuyển động vật lý hữu cơ
export const EASE_NATURAL = [0.25, 0.46, 0.45, 0.94] as const;

// Preset xuất hiện từ dưới lên khi cuộn trang (Fade Up)
export const fadeInUpVariants = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-30px' },
  transition: { duration: 0.5, ease: EASE_NATURAL }
};

// Preset Scale cho Dialog Modal
export const modalSpringVariants = {
  initial: { opacity: 0, scale: 0.92, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.92, y: 20 },
  transition: { type: 'spring', damping: 25, stiffness: 300 }
};

// Preset nút bấm tương tác
export const buttonTapInteraction = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: { duration: 0.15 }
};
```

---

## 8. Cấu Hình JSON & Token Nhanh (Design Tokens JSON)

Bạn có thể import trực tiếp cấu hình JSON này vào theme của `Tailwind`, `Figma Variables` hoặc `Chakra UI / Style Dictionary`:

```json
{
  "name": "Cafloop Design System",
  "version": "1.0.0",
  "theme": {
    "colors": {
      "background": {
        "primary": "#F6F6EE",
        "surface": "#FAF9F2",
        "surfaceAlt": "#FDFCF7"
      },
      "brand": {
        "forestGreen": "#335C33",
        "forestGreenHover": "#284828",
        "matchaLight": "#E3EDD3",
        "matchaLightHover": "#D5E3C0",
        "terracottaBrown": "#8C5A35"
      },
      "text": {
        "primary": "#2C2E2B",
        "secondary": "#8C5A35",
        "muted": "rgba(44, 46, 43, 0.75)",
        "inverted": "#F6F6EE"
      },
      "border": {
        "subtle": "rgba(51, 92, 51, 0.15)",
        "focus": "#335C33"
      }
    },
    "typography": {
      "fontHeading": "'Lora', Georgia, serif",
      "fontBody": "'Plus Jakarta Sans', 'Raleway', sans-serif",
      "letterSpacingHeading": "-0.02em",
      "letterSpacingBadge": "0.05em"
    },
    "borderRadius": {
      "badge": "9999px",
      "button": "12px",
      "card": "24px",
      "modal": "24px",
      "input": "12px"
    },
    "shadows": {
      "card": "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
      "cardHover": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      "modal": "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
    }
  }
}
```
