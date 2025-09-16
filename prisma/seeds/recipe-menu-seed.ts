import { PrismaClient, TargetLevel, MealType, MenuStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedRecipeMenus(sppgId: string) {
  console.log('🌱 Seeding recipe menus...');

  const recipeMenus = [
    // Menu untuk Recipe Selection - SD Level
    {
      sppgId,
      name: 'Nasi Gudeg Yogya',
      description: 'Nasi putih dengan gudeg khas Yogyakarta, ayam kampung, dan sambal krecek',
      targetLevel: TargetLevel.SD,
      mealType: MealType.LUNCH,
      status: MenuStatus.APPROVED,
      
      // Nutrition info sesuai AKG SD
      calories: 450,
      protein: 25,
      carbs: 55,
      fat: 15,
      fiber: 8,
      sodium: 380,
      sugar: 6,
      calcium: 120,
      iron: 3.5,

      // Cost info (dalam Rupiah)
      costPerPortion: 12000,
      ingredientCost: 8000,
      laborCost: 2500,
      overheadCost: 1500,

      // Serving info
      servingSize: 250, // grams
      estimatedPrepTime: 45,
      prepTime: 30,
      cookTime: 45,

      isActive: true,
    },
    {
      sppgId,
      name: 'Sayur Lodeh',
      description: 'Sayur berkuah santan dengan labu siam, kacang panjang, dan tahu tempe',
      targetLevel: TargetLevel.SD,
      mealType: MealType.LUNCH,
      status: MenuStatus.APPROVED,
      
      calories: 180,
      protein: 8,
      carbs: 20,
      fat: 10,
      fiber: 6,
      sodium: 320,
      sugar: 4,
      calcium: 80,
      iron: 2.1,

      costPerPortion: 7000,
      ingredientCost: 5000,
      laborCost: 1200,
      overheadCost: 800,

      servingSize: 200,
      estimatedPrepTime: 30,
      prepTime: 20,
      cookTime: 30,

      isActive: true,
    },
    {
      sppgId,
      name: 'Ayam Bakar Bumbu Rujak',
      description: 'Ayam bakar dengan bumbu rujak yang pedas manis',
      targetLevel: TargetLevel.SMP,
      mealType: MealType.LUNCH,
      status: MenuStatus.APPROVED,
      
      calories: 320,
      protein: 35,
      carbs: 8,
      fat: 18,
      fiber: 2,
      sodium: 450,
      sugar: 5,
      calcium: 45,
      iron: 2.8,

      costPerPortion: 15000,
      ingredientCost: 10000,
      laborCost: 3500,
      overheadCost: 1500,

      servingSize: 180,
      estimatedPrepTime: 60,
      prepTime: 30,
      cookTime: 60,

      isActive: true,
    },
    {
      sppgId,
      name: 'Jus Wortel Jeruk',
      description: 'Minuman segar dari perasan wortel dan jeruk manis',
      targetLevel: TargetLevel.SD,
      mealType: MealType.SNACK,
      status: MenuStatus.APPROVED,
      
      calories: 85,
      protein: 2,
      carbs: 20,
      fat: 0.5,
      fiber: 3,
      sodium: 15,
      sugar: 18,
      calcium: 30,
      iron: 0.8,

      costPerPortion: 5000,
      ingredientCost: 3500,
      laborCost: 1000,
      overheadCost: 500,

      servingSize: 250, // ml
      estimatedPrepTime: 10,
      prepTime: 5,
      cookTime: 10,

      isActive: true,
    },
    {
      sppgId,
      name: 'Tumis Kangkung Belacan',
      description: 'Kangkung segar ditumis dengan belacan dan cabai',
      targetLevel: TargetLevel.SD,
      mealType: MealType.LUNCH,
      status: MenuStatus.APPROVED,
      
      calories: 95,
      protein: 4,
      carbs: 12,
      fat: 4,
      fiber: 5,
      sodium: 280,
      sugar: 3,
      calcium: 90,
      iron: 2.5,

      costPerPortion: 4000,
      ingredientCost: 2800,
      laborCost: 800,
      overheadCost: 400,

      servingSize: 150,
      estimatedPrepTime: 15,
      prepTime: 10,
      cookTime: 15,

      isActive: true,
    },
    // Menu untuk TK
    {
      sppgId,
      name: 'Bubur Ayam Mini',
      description: 'Bubur ayam lembut dengan potongan ayam kecil dan sayuran',
      targetLevel: TargetLevel.TK,
      mealType: MealType.BREAKFAST,
      status: MenuStatus.APPROVED,
      
      calories: 220,
      protein: 12,
      carbs: 35,
      fat: 6,
      fiber: 4,
      sodium: 250,
      sugar: 2,
      calcium: 65,
      iron: 1.8,

      costPerPortion: 6000,
      ingredientCost: 4200,
      laborCost: 1200,
      overheadCost: 600,

      servingSize: 200,
      estimatedPrepTime: 25,
      prepTime: 15,
      cookTime: 25,

      isActive: true,
    },
    // Menu untuk SMA
    {
      sppgId,
      name: 'Nasi Padang Mini',
      description: 'Nasi dengan rendang, gulai tahu, dan sambal hijau',
      targetLevel: TargetLevel.SMA,
      mealType: MealType.LUNCH,
      status: MenuStatus.APPROVED,
      
      calories: 580,
      protein: 28,
      carbs: 65,
      fat: 22,
      fiber: 10,
      sodium: 520,
      sugar: 8,
      calcium: 150,
      iron: 4.2,

      costPerPortion: 18000,
      ingredientCost: 12000,
      laborCost: 4000,
      overheadCost: 2000,

      servingSize: 300,
      estimatedPrepTime: 75,
      prepTime: 45,
      cookTime: 75,

      isActive: true,
    },
    {
      sppgId,
      name: 'Es Teh Manis',
      description: 'Teh manis segar dengan es batu',
      targetLevel: TargetLevel.SMA,
      mealType: MealType.SNACK,
      status: MenuStatus.APPROVED,
      
      calories: 60,
      protein: 0,
      carbs: 15,
      fat: 0,
      fiber: 0,
      sodium: 5,
      sugar: 15,
      calcium: 8,
      iron: 0.1,

      costPerPortion: 2000,
      ingredientCost: 1200,
      laborCost: 500,
      overheadCost: 300,

      servingSize: 200, // ml
      estimatedPrepTime: 5,
      prepTime: 3,
      cookTime: 5,

      isActive: true,
    }
  ];

  const createdMenus = [];
  
  for (const menuData of recipeMenus) {
    try {
      // Check if menu with same name already exists for this SPPG
      const existingMenu = await prisma.menu.findFirst({
        where: {
          name: menuData.name,
          sppgId: menuData.sppgId
        }
      });

      if (existingMenu) {
        console.log(`⚠️  Menu "${menuData.name}" already exists, skipping...`);
        continue;
      }

      const menu = await prisma.menu.create({
        data: menuData
      });
      
      createdMenus.push(menu);
      console.log(`✅ Created menu: ${menu.name} (${menu.id})`);
    } catch (error) {
      console.error(`❌ Error creating menu "${menuData.name}":`, error);
    }
  }

  console.log(`✅ Recipe menus seeded successfully! Created ${createdMenus.length} menus.`);
  return createdMenus;
}