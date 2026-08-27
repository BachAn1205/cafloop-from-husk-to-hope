import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PRODUCTS_LIST = [
  {
    sku: 'CASCARA-ZIP-50G',
    name: 'Trà Vỏ Cà Phê Cascara - Túi Zip (50g)',
    price: 60000,
    unit: 'túi',
    description: '100% tự nhiên - Từ nông trại Đắk Lắk. Vị trái cây nhẹ, ít caffeine.',
  },
  {
    sku: 'CASCARA-ZIP-100G',
    name: 'Trà Vỏ Cà Phê Cascara - Túi Zip (100g)',
    price: 80000,
    unit: 'túi',
    description: '100% tự nhiên - Từ nông trại Đắk Lắk. Vị trái cây nhẹ, ít caffeine.',
  },
  {
    sku: 'CASCARA-JAR-50G',
    name: 'Trà Vỏ Cà Phê Cascara - Hũ Nhựa (50g)',
    price: 60000,
    unit: 'hũ',
    description: '100% tự nhiên - Từ nông trại Đắk Lắk. Vị trái cây nhẹ, ít caffeine.',
  },
  {
    sku: 'CASCARA-JAR-100G',
    name: 'Trà Vỏ Cà Phê Cascara - Hũ Nhựa (100g)',
    price: 80000,
    unit: 'hũ',
    description: '100% tự nhiên - Từ nông trại Đắk Lắk. Vị trái cây nhẹ, ít caffeine.',
  },
  {
    sku: 'GIFT-BROCADE',
    name: 'Túi Thổ Cẩm Tây Nguyên',
    price: 150000,
    unit: 'túi',
    description: 'Handmade - Tiện dùng, bền - Phong cách văn hóa đậm bản sắc.',
  },
  {
    sku: 'GIFT-SCENT',
    name: 'Túi Thơm Cà Phê',
    price: 50000,
    unit: 'túi',
    description: 'Hương tự nhiên - Khử mùi hiệu quả - Dùng decor, tủ quần áo, xe hơi.',
  },
  {
    sku: 'COMBO-130K',
    name: 'Combo Quà Tặng 130k',
    price: 130000,
    unit: 'combo',
    description: 'Gồm: Hũ trà vỏ cà phê + Túi thơm cà phê.',
  },
  {
    sku: 'COMBO-250K',
    name: 'Combo Quà Tặng 250k',
    price: 250000,
    unit: 'combo',
    description: 'Gồm: Hũ trà vỏ cà phê + Túi thơm cà phê + Túi thổ cẩm.',
  },
];

async function main() {
  console.log('🌱 Seeding 8 products into database...');
  for (const item of PRODUCTS_LIST) {
    await prisma.products.upsert({
      where: { sku: item.sku },
      update: {
        name: item.name,
        price: BigInt(item.price),
        unit: item.unit,
        description: item.description,
        is_active: true,
      },
      create: {
        sku: item.sku,
        name: item.name,
        price: BigInt(item.price),
        unit: item.unit,
        description: item.description,
        is_active: true,
      },
    });
  }
  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
