import { supabase } from './supabase';
import type { SepayTransaction } from './sepay';

// Import product images
import teaZip50g from '../../assets/image/tea_50g.jpg';
import teaZip100g from '../../assets/image/teaZip_100g.jpg';
import teaCtn50g from '../../assets/image/teaCtn_50g.jpg';
import teaCtn100g from '../../assets/image/teaCtn_100g.jpg';
import bag from '../../assets/image/bag.jpg';
import tuithom from '../../assets/image/tuithom.jpg';
import combo130k from '../../assets/image/combo130k.jpg';
import combo250k from '../../assets/image/combo250k.PNG';

export interface ProductItem {
  id?: string;
  sku: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  image?: string;
}

export const PRODUCTS_LIST: ProductItem[] = [
  {
    sku: 'CASCARA-ZIP-50G',
    name: 'Trà Vỏ Cà Phê Cascara - Túi Zip (50g)',
    price: 60000,
    unit: 'túi',
    description: 'Vị trái cây nhẹ, ít caffeine.',
    image: teaZip50g,
  },
  {
    sku: 'CASCARA-ZIP-100G',
    name: 'Trà Vỏ Cà Phê Cascara - Túi Zip (100g)',
    price: 80000,
    unit: 'túi',
    description: 'Vị trái cây nhẹ, ít caffeine.',
    image: teaZip100g,
  },
  {
    sku: 'CASCARA-JAR-50G',
    name: 'Trà Vỏ Cà Phê Cascara - Hũ Nhựa (50g)',
    price: 60000,
    unit: 'hũ',
    description: 'Vị trái cây nhẹ, ít caffeine.',
    image: teaCtn50g,
  },
  {
    sku: 'CASCARA-JAR-100G',
    name: 'Trà Vỏ Cà Phê Cascara - Hũ Nhựa (100g)',
    price: 80000,
    unit: 'hũ',
    description: 'Vị trái cây nhẹ, ít caffeine.',
    image: teaCtn100g,
  },
  {
    sku: 'GIFT-BROCADE',
    name: 'Túi Thổ Cẩm Tây Nguyên',
    price: 150000,
    unit: 'túi',
    description: 'Handmade - Tiện dùng, bền - Phong cách văn hóa đậm bản sắc.',
    image: bag,
  },
  {
    sku: 'GIFT-SCENT',
    name: 'Túi Thơm Cà Phê',
    price: 50000,
    unit: 'túi',
    description: 'Hương tự nhiên - Khử mùi hiệu quả - Dùng decor, tủ quần áo, xe hơi.',
    image: tuithom,
  },
  {
    sku: 'COMBO-130K',
    name: 'Combo Quà Tặng 130k',
    price: 130000,
    unit: 'combo',
    description: 'Gồm: Hũ trà vỏ cà phê + Túi thơm cà phê.',
    image: combo130k,
  },
  {
    sku: 'COMBO-250K',
    name: 'Combo Quà Tặng 250k',
    price: 250000,
    unit: 'combo',
    description: 'Gồm: Hũ trà vỏ cà phê + Túi thơm cà phê + Túi thổ cẩm.',
    image: combo250k,
  }
];

const IMAGE_MAP: Record<string, string> = {
  'CASCARA-ZIP-50G': teaZip50g,
  'CASCARA-ZIP-100G': teaZip100g,
  'CASCARA-JAR-50G': teaCtn50g,
  'CASCARA-JAR-100G': teaCtn100g,
  'GIFT-BROCADE': bag,
  'GIFT-SCENT': tuithom,
  'COMBO-130K': combo130k,
  'COMBO-250K': combo250k,
};

export async function seedProductsToSupabase() {
  try {
    for (const p of PRODUCTS_LIST) {
      await supabase.from('products').upsert(
        {
          sku: p.sku,
          name: p.name,
          price: p.price,
          unit: p.unit,
          description: p.description,
          is_active: true,
        },
        { onConflict: 'sku' }
      );
    }
    console.log('✅ Đã đồng bộ 8 sản phẩm lên bảng products của Supabase!');
  } catch (e) {
    console.error('Lỗi seed sản phẩm lên Supabase:', e);
  }
}

export async function fetchProductsFromSupabase(): Promise<ProductItem[]> {
  try {
    // Tự động đồng bộ sản phẩm nếu chưa có
    await seedProductsToSupabase();

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (error || !data || data.length === 0) {
      console.warn('Lấy sản phẩm từ Supabase thất bại hoặc trống, dùng danh sách dự phòng:', error?.message);
      return PRODUCTS_LIST;
    }

    return data.map((item) => ({
      id: item.id,
      sku: item.sku,
      name: item.name,
      price: Number(item.price),
      unit: item.unit || 'sản phẩm',
      description: item.description || '',
      image: IMAGE_MAP[item.sku] || teaZip50g,
    }));
  } catch (err) {
    console.error('Lỗi khi fetch sản phẩm:', err);
    return PRODUCTS_LIST;
  }
}

export interface SaveDonationParams {
  name: string;
  phone: string;
  amount: number;
  donationCode?: string;
  sepayTransaction?: SepayTransaction | null;
}

export interface OrderCartItem {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface SaveOrderParams {
  name: string;
  phone: string;
  address: string;
  totalAmount: number;
  orderCode?: string;
  items?: OrderCartItem[];
  quantity?: number;
  productSku?: string;
  productName?: string;
  sepayTransaction?: SepayTransaction | null;
}

export async function saveDonationToSupabase(params: SaveDonationParams) {
  try {
    const cleanPhone = params.phone.replace(/\D/g, '');
    const cleanName = params.name.trim() || 'Nhà Hảo Tâm';
    const donationCode = params.donationCode || `DON-${cleanPhone.slice(-4)}-${Date.now().toString().slice(-6)}`;

    // 0. Idempotency Check: Chống Replay / Race Condition
    const { data: existingDonation } = await supabase
      .from('donations')
      .select('id')
      .eq('donation_code', donationCode)
      .maybeSingle();

    if (existingDonation) {
      console.log('✅ Đơn quyên góp đã tồn tại (Idempotent):', donationCode);
      return true;
    }

    // 1. Lưu hoặc lấy Khách hàng (Customer) dựa trên Số điện thoại
    let customerId: string | null = null;
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .upsert(
        { full_name: cleanName, phone: cleanPhone },
        { onConflict: 'phone' }
      )
      .select('id')
      .single();

    if (customerError) {
      console.warn('Lỗi upsert customer:', customerError.message);
    } else if (customerData) {
      customerId = customerData.id;
    }

    // 2. Lưu Đơn Quyên Góp (Donations)
    const { error: donationError } = await supabase.from('donations').insert({
      donation_code: donationCode,
      customer_id: customerId,
      amount: params.amount,
      status: 'completed',
    });

    if (donationError) {
      console.error('Lỗi lưu đơn quyên góp vào Supabase:', donationError.message);
    } else {
      console.log('✅ Đã lưu đơn quyên góp vào Supabase thành công!');
    }

    // 3. Nếu có dữ liệu SePay Transaction thực tế, lưu vào bảng Transactions (Unique sepay_id)
    if (params.sepayTransaction) {
      const sepayId = params.sepayTransaction.id;
      const { error: txError } = await supabase.from('transactions').upsert(
        {
          sepay_id: sepayId,
          gateway: params.sepayTransaction.bank_brand_name || 'MBBank',
          account_number: params.sepayTransaction.account_number || '',
          amount: parseFloat(params.sepayTransaction.amount_in || '0'),
          content: params.sepayTransaction.transaction_content || '',
          code: params.sepayTransaction.code || donationCode,
          transaction_date: params.sepayTransaction.transaction_date || new Date().toISOString(),
          raw_data: params.sepayTransaction,
        },
        { onConflict: 'sepay_id' }
      );

      if (txError) {
        console.warn('Lỗi lưu SePay transaction (kiểm tra RLS Policy trên Supabase):', txError.message);
      } else {
        console.log('✅ Đã lưu SePay transaction vào Supabase thành công!');
      }
    }

    return true;
  } catch (error) {
    console.error('Lỗi khi ghi dữ liệu vào Supabase:', error);
    return false;
  }
}

export async function saveOrderToSupabase(params: SaveOrderParams) {
  try {
    const cleanPhone = params.phone.replace(/\D/g, '');
    const cleanName = params.name.trim() || 'Khách hàng';
    const orderCode = params.orderCode || `CAF-${cleanPhone.slice(-4)}-${Date.now().toString().slice(-6)}`;

    // 0. Idempotency Check: Chống Replay Attack & Duplicate order
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('order_code', orderCode)
      .maybeSingle();

    if (existingOrder) {
      console.log('✅ Đơn hàng đã được lưu trước đó (Idempotent):', orderCode);
      return true;
    }

    // 1. Upsert Customer
    let customerId: string | null = null;
    const { data: customerData } = await supabase
      .from('customers')
      .upsert(
        { full_name: cleanName, phone: cleanPhone, address: params.address },
        { onConflict: 'phone' }
      )
      .select('id')
      .single();

    if (customerData) {
      customerId = customerData.id;
    }

    // 2. Determine order items
    const itemsList: OrderCartItem[] = params.items && params.items.length > 0
      ? params.items
      : [
          {
            sku: params.productSku || 'CASCARA-ZIP-50G',
            name: params.productName || 'Trà Cascara',
            quantity: params.quantity || 1,
            unitPrice: Math.round(params.totalAmount / (params.quantity || 1)),
          },
        ];

    const noteSummary = itemsList.map((i) => `${i.quantity}x ${i.name}`).join(', ');

    // 3. Insert Order with exact unique code and status
    const initialStatus = params.sepayTransaction ? 'paid' : 'pending';
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_code: orderCode,
        customer_id: customerId,
        total_amount: params.totalAmount,
        shipping_address: params.address,
        status: initialStatus,
        note: `Đặt ${noteSummary}`,
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('Lỗi lưu đơn hàng:', orderError.message);
      return false;
    }

    // 4. Insert Order Items & Ensure Products exist
    if (orderData) {
      for (const item of itemsList) {
        let productId: string | null = null;
        const { data: existingProduct } = await supabase
          .from('products')
          .select('id')
          .eq('sku', item.sku)
          .single();

        if (existingProduct) {
          productId = existingProduct.id;
        } else {
          const itemInfo = PRODUCTS_LIST.find((p) => p.sku === item.sku);
          const { data: newProd } = await supabase
            .from('products')
            .insert({
              name: item.name,
              sku: item.sku,
              price: item.unitPrice,
              unit: itemInfo ? itemInfo.unit : 'sản phẩm',
              description: itemInfo ? itemInfo.description : '',
            })
            .select('id')
            .single();

          if (newProd) productId = newProd.id;
        }

        if (productId) {
          await supabase.from('order_items').insert({
            order_id: orderData.id,
            product_id: productId,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            subtotal: item.quantity * item.unitPrice,
          });
        }
      }
    }

    // 5. Nếu có giao dịch SePay, lưu vào bảng transactions với onConflict sepay_id
    if (params.sepayTransaction) {
      const sepayId = params.sepayTransaction.id;
      await supabase.from('transactions').upsert(
        {
          sepay_id: sepayId,
          gateway: params.sepayTransaction.bank_brand_name || 'MBBank',
          account_number: params.sepayTransaction.account_number || '',
          amount: parseFloat(params.sepayTransaction.amount_in || '0'),
          content: params.sepayTransaction.transaction_content || '',
          code: orderCode,
          transaction_date: params.sepayTransaction.transaction_date || new Date().toISOString(),
          raw_data: params.sepayTransaction,
        },
        { onConflict: 'sepay_id' }
      );
    }

    console.log('✅ Đã lưu đơn hàng vào Supabase thành công! Mã đơn:', orderCode);
    return true;
  } catch (error) {
    console.error('Lỗi khi lưu đơn hàng:', error);
    return false;
  }
}
