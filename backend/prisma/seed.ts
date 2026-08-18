import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Admin Superuser
  const adminPasswordHash = await bcrypt.hash('AdminPassword123!', 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@picklejar.com' },
    update: {
      passwordHash: adminPasswordHash,
      isActive: true,
    },
    create: {
      email: 'admin@picklejar.com',
      passwordHash: adminPasswordHash,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // 2. Seed Categories
  const categories = [
    {
      name: 'Veg Pickles',
      slug: 'veg-pickles',
      description: 'Handcrafted traditional vegetarian pickles made with cold-pressed gingelly oil and stone-ground spices.',
      imageUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Non-Veg Pickles',
      slug: 'non-veg-pickles',
      description: 'Rich, spicy, slow-cooked non-vegetarian pickles prepared with fresh meat and aromatic spices.',
      imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Ceramic Jars & Accessories',
      slug: 'ceramic-jars-accessories',
      description: 'Traditional handcrafted ceramic achar barnis and airtight glass jars designed for long pickle preservation.',
      imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Gift Packs',
      slug: 'gift-packs',
      description: 'Curated artisanal gift boxes filled with assorted homemade pickles and traditional jars.',
      imageUrl: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const categoryRecords: Record<string, string> = {};
  for (const cat of categories) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryRecords[cat.slug] = record.id;
    console.log(`✅ Category created: ${record.name}`);
  }

  // 3. Seed Products
  const products = [
    {
      categoryId: categoryRecords['veg-pickles'],
      name: 'Authentic Andhra Avakaya Mango Pickle',
      slug: 'andhra-avakaya-mango-pickle',
      description: 'Grandma’s recipe Avakaya made from raw cut mangoes, pure cold-pressed gingelly oil, yellow mustard powder, red chilli powder, and fenugreek. No added preservatives or artificial colors.',
      ingredients: 'Raw Cut Mangoes, Cold-Pressed Gingelly Oil, Red Chilli Powder, Yellow Mustard Powder, Turmeric, Salt, Fenugreek Seeds',
      weightGram: 500,
      price: 349.00,
      comparePrice: 399.00,
      stockQuantity: 50,
      isFeatured: true,
      isBestSeller: true,
      imageUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800&auto=format&fit=crop&q=80',
    },
    {
      categoryId: categoryRecords['veg-pickles'],
      name: 'Traditional Tangy Lemon Pickle',
      slug: 'traditional-tangy-lemon-pickle',
      description: 'Sun-ripened organic juicy lemons fermented naturally with salt, roasted spices, and sesame oil. Spicy, sour, and digestively refreshing.',
      ingredients: 'Fresh Lemons, Sesame Oil, Chilli Powder, Asafoetida, Mustard Seeds, Salt',
      weightGram: 300,
      price: 199.00,
      comparePrice: 249.00,
      stockQuantity: 40,
      isFeatured: false,
      isBestSeller: true,
      imageUrl: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&auto=format&fit=crop&q=80',
    },
    {
      categoryId: categoryRecords['veg-pickles'],
      name: 'Spicy Garlic & Chilli Pickle',
      slug: 'spicy-garlic-chilli-pickle',
      description: 'Whole peeled country garlic cloves marinated in rich mustard oil and coarse hand-ground red chilli flakes. Bursting with robust pungent flavor.',
      ingredients: 'Peeled Garlic Cloves, Mustard Oil, Red Chilli Flakes, Vinegar, Nigella Seeds, Salt',
      weightGram: 350,
      price: 279.00,
      comparePrice: 320.00,
      stockQuantity: 35,
      isFeatured: true,
      isBestSeller: false,
      imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
    },
    {
      categoryId: categoryRecords['non-veg-pickles'],
      name: 'Boneless Andhra Chicken Pickle',
      slug: 'boneless-andhra-chicken-pickle',
      description: 'Tender boneless chicken breast chunks deep-fried in spices and marinated in homemade garam masala and aromatic sesame oil.',
      ingredients: 'Boneless Chicken Chunks, Ginger Garlic Paste, Chilli Powder, Whole Spices, Gingelly Oil, Lemon Juice, Salt',
      weightGram: 500,
      price: 599.00,
      comparePrice: 699.00,
      stockQuantity: 30,
      isFeatured: true,
      isBestSeller: true,
      imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
    },
    {
      categoryId: categoryRecords['ceramic-jars-accessories'],
      name: 'Handcrafted Vintage Ceramic Achar Barni (1 Liter)',
      slug: 'handcrafted-vintage-ceramic-achar-barni-1l',
      description: 'Authentic glazed white and brown clay ceramic jar designed to preserve pickles naturally without reacting to acid or vinegar.',
      ingredients: 'Natural Clay, Lead-Free Food-Safe Ceramic Glaze',
      weightGram: 1200,
      price: 499.00,
      comparePrice: 599.00,
      stockQuantity: 25,
      isFeatured: false,
      isBestSeller: true,
      imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
    },
    {
      categoryId: categoryRecords['gift-packs'],
      name: 'Grandma Heritage Pickle Gift Box (3 Jars Combo)',
      slug: 'grandma-heritage-pickle-gift-box',
      description: 'A luxurious wooden gift box containing 3 top-selling 250g pickles (Mango Avakaya, Tangy Lemon, Spicy Garlic) wrapped in festive eco-packaging.',
      ingredients: 'Assorted Pickles (3x250g), Wooden Gift Box, Eco Jute Ties',
      weightGram: 1800,
      price: 899.00,
      comparePrice: 1099.00,
      stockQuantity: 20,
      isFeatured: true,
      isBestSeller: true,
      imageUrl: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80',
    },
  ];

  for (const prod of products) {
    const { imageUrl, ...prodData } = prod;
    await prisma.product.upsert({
      where: { slug: prodData.slug },
      update: {
        price: prodData.price,
        stockQuantity: prodData.stockQuantity,
      },
      create: {
        ...prodData,
        images: {
          create: [
            {
              imageUrl,
              isPrimary: true,
              sortOrder: 0,
            },
          ],
        },
        inventoryLogs: {
          create: {
            changeType: 'RESTOCK',
            quantity: prodData.stockQuantity,
            previousStock: 0,
            newStock: prodData.stockQuantity,
            notes: 'Initial seed stock',
            createdBy: admin.id,
          },
        },
      },
    });
    console.log(`✅ Product created: ${prod.name}`);
  }

  // 4. Seed Coupons
  const coupons = [
    {
      code: 'WELCOME10',
      description: 'Get 10% discount on your first order',
      discountType: 'PERCENTAGE',
      discountValue: 10.00,
      minOrderAmount: 299.00,
      maxDiscountAmount: 150.00,
      isActive: true,
    },
    {
      code: 'FLAT50',
      description: 'Flat Rs. 50 off on orders above Rs. 499',
      discountType: 'FIXED',
      discountValue: 50.00,
      minOrderAmount: 499.00,
      isActive: true,
    },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: coupon,
    });
    console.log(`✅ Coupon created: ${coupon.code}`);
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
