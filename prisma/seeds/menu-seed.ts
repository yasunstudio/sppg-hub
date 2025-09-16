import { PrismaClient, TargetLevel, MealType, MenuStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedMenus(sppgId: string) {
  console.log('🌱 Seeding menus...');

  const menus = [
    // MENU TK (Taman Kanak-Kanak)
    {
      sppgId,
      name: 'Paket Sehat TK - Ayam & Sayur',
      description: 'Menu bergizi untuk anak TK dengan ayam, nasi, dan sayuran segar',
      targetLevel: TargetLevel.TK,
      mealType: MealType.LUNCH,
      status: MenuStatus.ACTIVE,
      servingDate: new Date('2025-01-20'),
      
      // Nutrition info sesuai AKG TK
      calories: 380,
      protein: 18,
      carbs: 45,
      fat: 12,
      fiber: 8,
      sodium: 420,
      sugar: 8,
      calcium: 180,
      iron: 4.2,

      // Cost info (dalam Rupiah)
      costPerPortion: 6500,
      ingredientCost: 4200,
      laborCost: 1500,
      overheadCost: 800,

      // Serving info
      servingSize: 200,
      estimatedPrepTime: 45,
      prepTime: 30,
      cookTime: 25,
    },
    
    {
      sppgId,
      name: 'Paket Sehat TK - Ikan & Tempe',
      description: 'Menu protein tinggi dengan ikan lele, tempe, dan sayuran hijau',
      targetLevel: TargetLevel.TK,
      mealType: MealType.LUNCH,
      status: MenuStatus.ACTIVE,
      servingDate: new Date('2025-01-21'),
      
      calories: 395,
      protein: 20,
      carbs: 42,
      fat: 14,
      fiber: 9,
      sodium: 380,
      sugar: 6,
      calcium: 200,
      iron: 5.1,

      costPerPortion: 7000,
      ingredientCost: 4500,
      laborCost: 1600,
      overheadCost: 900,

      servingSize: 210,
      estimatedPrepTime: 50,
      prepTime: 35,
      cookTime: 30,
    },

    // MENU SD (Sekolah Dasar)
    {
      sppgId,
      name: 'Paket Bergizi SD - Ayam Fillet & Sayur Campur',
      description: 'Menu lengkap untuk anak SD dengan ayam fillet, nasi, dan aneka sayuran',
      targetLevel: TargetLevel.SD,
      mealType: MealType.LUNCH,
      status: MenuStatus.ACTIVE,
      servingDate: new Date('2025-01-22'),
      
      calories: 450,
      protein: 22,
      carbs: 52,
      fat: 15,
      fiber: 10,
      sodium: 480,
      sugar: 9,
      calcium: 220,
      iron: 6.2,

      costPerPortion: 8000,
      ingredientCost: 5200,
      laborCost: 1800,
      overheadCost: 1000,

      servingSize: 250,
      estimatedPrepTime: 60,
      prepTime: 40,
      cookTime: 35,
    },

    {
      sppgId,
      name: 'Paket Bergizi SD - Telur & Tahu',
      description: 'Menu ekonomis namun bergizi dengan telur, tahu, dan sayuran',
      targetLevel: TargetLevel.SD,
      mealType: MealType.LUNCH,
      status: MenuStatus.ACTIVE,
      servingDate: new Date('2025-01-23'),
      
      calories: 420,
      protein: 19,
      carbs: 48,
      fat: 16,
      fiber: 8,
      sodium: 450,
      sugar: 7,
      calcium: 180,
      iron: 5.8,

      costPerPortion: 6500,
      ingredientCost: 4000,
      laborCost: 1600,
      overheadCost: 900,

      servingSize: 240,
      estimatedPrepTime: 45,
      prepTime: 30,
      cookTime: 25,
    },

    // MENU SMP (Sekolah Menengah Pertama)
    {
      sppgId,
      name: 'Paket Energi SMP - Ayam & Ubi Jalar',
      description: 'Menu berenergi tinggi untuk remaja dengan ayam, ubi jalar, dan sayuran',
      targetLevel: TargetLevel.SMP,
      mealType: MealType.LUNCH,
      status: MenuStatus.ACTIVE,
      servingDate: new Date('2025-01-24'),
      
      calories: 520,
      protein: 26,
      carbs: 58,
      fat: 18,
      fiber: 12,
      sodium: 520,
      sugar: 12,
      calcium: 250,
      iron: 7.5,

      costPerPortion: 9500,
      ingredientCost: 6200,
      laborCost: 2000,
      overheadCost: 1300,

      servingSize: 300,
      estimatedPrepTime: 70,
      prepTime: 45,
      cookTime: 40,
    },

    {
      sppgId,
      name: 'Paket Energi SMP - Ikan & Mie',
      description: 'Menu variatif dengan ikan lele, mie telur, dan sayuran segar',
      targetLevel: TargetLevel.SMP,
      mealType: MealType.LUNCH,
      status: MenuStatus.ACTIVE,
      servingDate: new Date('2025-01-25'),
      
      calories: 480,
      protein: 24,
      carbs: 54,
      fat: 17,
      fiber: 9,
      sodium: 490,
      sugar: 8,
      calcium: 200,
      iron: 6.8,

      costPerPortion: 8500,
      ingredientCost: 5500,
      laborCost: 1800,
      overheadCost: 1200,

      servingSize: 280,
      estimatedPrepTime: 55,
      prepTime: 35,
      cookTime: 30,
    },
  ];

  // Create menus
  const createdMenus = [];
  for (const menuData of menus) {
    try {
      const existing = await prisma.menu.findFirst({
        where: { 
          name: menuData.name,
          sppgId: menuData.sppgId 
        }
      });

      if (!existing) {
        const menu = await prisma.menu.create({
          data: menuData,
        });
        createdMenus.push(menu);
        console.log(`✅ Created menu: ${menuData.name}`);
      } else {
        createdMenus.push(existing);
        console.log(`⚠️  Menu already exists: ${menuData.name}`);
      }
    } catch (error) {
      console.error(`❌ Error creating menu ${menuData.name}:`, error);
    }
  }

  console.log(`🎉 Menu seeding completed! Created ${menus.length} menus for Purwakarta SPPG.`);
  return createdMenus;
}

// Export function to run independently if needed
if (require.main === module) {
  // For standalone testing, create a dummy sppg ID
  const dummySppgId = 'dummy-sppg-id';
  seedMenus(dummySppgId)
    .catch((e) => {
      console.error('Error in menu seeding:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}