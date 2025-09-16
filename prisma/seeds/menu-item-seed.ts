import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedMenuItems(menus: any[]) {
  console.log('🌱 Seeding menu items...');

  const menuItems = [
    // Menu items untuk Menu TK - Ayam & Sayur
    ...(menus[0] ? [
      {
        menuId: menus[0].id,
        name: 'Nasi Putih',
        category: 'Main',
        quantity: 1,
      },
      {
        menuId: menus[0].id,
        name: 'Ayam Fillet Tumis',
        category: 'Main',
        quantity: 1,
      },
      {
        menuId: menus[0].id,
        name: 'Sayur Wortel Bayam',
        category: 'Side',
        quantity: 1,
      },
      {
        menuId: menus[0].id,
        name: 'Air Putih',
        category: 'Drink',
        quantity: 1,
      },
    ] : []),

    // Menu items untuk Menu TK - Ikan & Tempe
    ...(menus[1] ? [
      {
        menuId: menus[1].id,
        name: 'Nasi Putih',
        category: 'Main',
        quantity: 1,
      },
      {
        menuId: menus[1].id,
        name: 'Ikan Lele Goreng',
        category: 'Main',
        quantity: 1,
      },
      {
        menuId: menus[1].id,
        name: 'Tempe Goreng',
        category: 'Side',
        quantity: 2,
      },
      {
        menuId: menus[1].id,
        name: 'Kangkung Tumis',
        category: 'Side',
        quantity: 1,
      },
      {
        menuId: menus[1].id,
        name: 'Air Putih',
        category: 'Drink',
        quantity: 1,
      },
    ] : []),

    // Menu items untuk Menu SD - Ayam Fillet & Sayur Campur
    ...(menus[2] ? [
      {
        menuId: menus[2].id,
        name: 'Nasi Putih',
        category: 'Main',
        quantity: 1,
      },
      {
        menuId: menus[2].id,
        name: 'Ayam Fillet Bumbu',
        category: 'Main',
        quantity: 1,
      },
      {
        menuId: menus[2].id,
        name: 'Sayur Campur (Wortel, Kacang Panjang, Bayam)',
        category: 'Side',
        quantity: 1,
      },
      {
        menuId: menus[2].id,
        name: 'Air Putih',
        category: 'Drink',
        quantity: 1,
      },
    ] : []),

    // Menu items untuk Menu SD - Telur & Tahu
    ...(menus[3] ? [
      {
        menuId: menus[3].id,
        name: 'Nasi Putih',
        category: 'Main',
        quantity: 1,
      },
      {
        menuId: menus[3].id,
        name: 'Telur Dadar',
        category: 'Main',
        quantity: 1,
      },
      {
        menuId: menus[3].id,
        name: 'Tahu Goreng',
        category: 'Side',
        quantity: 2,
      },
      {
        menuId: menus[3].id,
        name: 'Sayur Kangkung Wortel',
        category: 'Side',
        quantity: 1,
      },
      {
        menuId: menus[3].id,
        name: 'Air Putih',
        category: 'Drink',
        quantity: 1,
      },
    ] : []),

    // Menu items untuk Menu SMP - Ayam & Ubi Jalar
    ...(menus[4] ? [
      {
        menuId: menus[4].id,
        name: 'Ubi Jalar Kukus',
        category: 'Main',
        quantity: 1,
      },
      {
        menuId: menus[4].id,
        name: 'Ayam Fillet Bumbu Lengkap',
        category: 'Main',
        quantity: 1,
      },
      {
        menuId: menus[4].id,
        name: 'Sayur Bayam Wortel',
        category: 'Side',
        quantity: 1,
      },
      {
        menuId: menus[4].id,
        name: 'Air Putih',
        category: 'Drink',
        quantity: 1,
      },
    ] : []),

    // Menu items untuk Menu SMP - Ikan & Mie
    ...(menus[5] ? [
      {
        menuId: menus[5].id,
        name: 'Mie Telur Rebus',
        category: 'Main',
        quantity: 1,
      },
      {
        menuId: menus[5].id,
        name: 'Ikan Lele Bumbu',
        category: 'Main',
        quantity: 1,
      },
      {
        menuId: menus[5].id,
        name: 'Sayur Campur (Kacang Panjang, Wortel, Kangkung)',
        category: 'Side',
        quantity: 1,
      },
      {
        menuId: menus[5].id,
        name: 'Air Putih',
        category: 'Drink',
        quantity: 1,
      },
    ] : []),
  ];

  // Filter out menu items with missing menu IDs
  const validMenuItems = menuItems.filter(item => item.menuId);

  // Create menu items
  let createdCount = 0;
  for (const menuItemData of validMenuItems) {
    try {
      const existing = await prisma.menuItem.findFirst({
        where: { 
          menuId: menuItemData.menuId,
          name: menuItemData.name 
        }
      });

      if (!existing) {
        await prisma.menuItem.create({
          data: menuItemData,
        });
        createdCount++;
        console.log(`✅ Created menu item: ${menuItemData.name}`);
      } else {
        console.log(`⚠️  Menu item already exists: ${menuItemData.name}`);
      }
    } catch (error) {
      console.error(`❌ Error creating menu item ${menuItemData.name}:`, error);
    }
  }

  console.log(`🎉 Menu item seeding completed! Created ${createdCount} menu items.`);
  console.log(`   From ${validMenuItems.length} valid menu items.`);
}

// Export function to run independently if needed
if (require.main === module) {
  seedMenuItems([])
    .catch((e) => {
      console.error('Error in menu item seeding:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}