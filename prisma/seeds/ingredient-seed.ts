import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedIngredients() {
  console.log('🌱 Seeding ingredients...');

  const ingredients = [
    // PROTEINS
    {
      name: 'Ayam Fillet',
      category: 'Protein',
      unit: 'kg',
      caloriesPer100g: 165,
      proteinPer100g: 31,
      carbsPer100g: 0,
      fatPer100g: 3.6,
      fiberPer100g: 0,
      sodiumPer100g: 74,
      shelfLife: 3,
      storageTemp: 'cold',
    },
    {
      name: 'Ikan Lele',
      category: 'Protein',
      unit: 'kg',
      caloriesPer100g: 132,
      proteinPer100g: 17.7,
      carbsPer100g: 0,
      fatPer100g: 6.2,
      fiberPer100g: 0,
      sodiumPer100g: 45,
      shelfLife: 2,
      storageTemp: 'cold',
    },
    {
      name: 'Telur Ayam',
      category: 'Protein',
      unit: 'butir',
      caloriesPer100g: 155,
      proteinPer100g: 13,
      carbsPer100g: 1.1,
      fatPer100g: 11,
      fiberPer100g: 0,
      sodiumPer100g: 124,
      shelfLife: 14,
      storageTemp: 'room',
    },
    {
      name: 'Tempe',
      category: 'Protein',
      unit: 'papan',
      caloriesPer100g: 193,
      proteinPer100g: 20.3,
      carbsPer100g: 7.5,
      fatPer100g: 8.8,
      fiberPer100g: 1.4,
      sodiumPer100g: 9,
      shelfLife: 3,
      storageTemp: 'room',
    },
    {
      name: 'Tahu',
      category: 'Protein',
      unit: 'papan',
      caloriesPer100g: 76,
      proteinPer100g: 8,
      carbsPer100g: 1.9,
      fatPer100g: 4.8,
      fiberPer100g: 0.4,
      sodiumPer100g: 7,
      shelfLife: 2,
      storageTemp: 'cold',
    },

    // CARBOHYDRATES
    {
      name: 'Beras Premium',
      category: 'Carbohydrates',
      unit: 'kg',
      caloriesPer100g: 130,
      proteinPer100g: 2.7,
      carbsPer100g: 28,
      fatPer100g: 0.3,
      fiberPer100g: 0.4,
      sodiumPer100g: 1,
      shelfLife: 365,
      storageTemp: 'room',
    },
    {
      name: 'Mie Telur',
      category: 'Carbohydrates',
      unit: 'kg',
      caloriesPer100g: 138,
      proteinPer100g: 4.5,
      carbsPer100g: 25,
      fatPer100g: 2.1,
      fiberPer100g: 1.8,
      sodiumPer100g: 16,
      shelfLife: 180,
      storageTemp: 'room',
    },
    {
      name: 'Ubi Jalar',
      category: 'Carbohydrates',
      unit: 'kg',
      caloriesPer100g: 86,
      proteinPer100g: 1.6,
      carbsPer100g: 20,
      fatPer100g: 0.1,
      fiberPer100g: 3,
      sodiumPer100g: 4,
      shelfLife: 7,
      storageTemp: 'room',
    },

    // VEGETABLES
    {
      name: 'Bayam',
      category: 'Vegetables',
      unit: 'kg',
      caloriesPer100g: 23,
      proteinPer100g: 2.9,
      carbsPer100g: 3.6,
      fatPer100g: 0.4,
      fiberPer100g: 2.2,
      sodiumPer100g: 79,
      shelfLife: 3,
      storageTemp: 'cold',
    },
    {
      name: 'Kangkung',
      category: 'Vegetables',
      unit: 'kg',
      caloriesPer100g: 16,
      proteinPer100g: 1.8,
      carbsPer100g: 2.6,
      fatPer100g: 0.2,
      fiberPer100g: 1.2,
      sodiumPer100g: 52,
      shelfLife: 2,
      storageTemp: 'cold',
    },
    {
      name: 'Wortel',
      category: 'Vegetables',
      unit: 'kg',
      caloriesPer100g: 41,
      proteinPer100g: 0.9,
      carbsPer100g: 9.6,
      fatPer100g: 0.2,
      fiberPer100g: 2.8,
      sodiumPer100g: 69,
      shelfLife: 14,
      storageTemp: 'cold',
    },
    {
      name: 'Kacang Panjang',
      category: 'Vegetables',
      unit: 'kg',
      caloriesPer100g: 47,
      proteinPer100g: 2.8,
      carbsPer100g: 8,
      fatPer100g: 0.4,
      fiberPer100g: 2.7,
      sodiumPer100g: 4,
      shelfLife: 5,
      storageTemp: 'cold',
    },

    // SEASONINGS & OTHERS
    {
      name: 'Bawang Putih',
      category: 'Seasonings',
      unit: 'kg',
      caloriesPer100g: 149,
      proteinPer100g: 6.4,
      carbsPer100g: 33,
      fatPer100g: 0.5,
      fiberPer100g: 2.1,
      sodiumPer100g: 17,
      shelfLife: 30,
      storageTemp: 'room',
    },
    {
      name: 'Bawang Merah',
      category: 'Seasonings',
      unit: 'kg',
      caloriesPer100g: 40,
      proteinPer100g: 1.1,
      carbsPer100g: 9.3,
      fatPer100g: 0.1,
      fiberPer100g: 1.7,
      sodiumPer100g: 4,
      shelfLife: 21,
      storageTemp: 'room',
    },
    {
      name: 'Minyak Goreng',
      category: 'Oil & Fat',
      unit: 'liter',
      caloriesPer100g: 884,
      proteinPer100g: 0,
      carbsPer100g: 0,
      fatPer100g: 100,
      fiberPer100g: 0,
      sodiumPer100g: 0,
      shelfLife: 365,
      storageTemp: 'room',
    },
    {
      name: 'Garam',
      category: 'Seasonings',
      unit: 'kg',
      caloriesPer100g: 0,
      proteinPer100g: 0,
      carbsPer100g: 0,
      fatPer100g: 0,
      fiberPer100g: 0,
      sodiumPer100g: 38758,
      shelfLife: 730,
      storageTemp: 'room',
    },
  ];

  // Create ingredients
  for (const ingredientData of ingredients) {
    try {
      const existing = await prisma.ingredient.findFirst({
        where: { name: ingredientData.name }
      });

      if (!existing) {
        await prisma.ingredient.create({
          data: ingredientData,
        });
        console.log(`✅ Created ingredient: ${ingredientData.name}`);
      } else {
        console.log(`⚠️  Ingredient already exists: ${ingredientData.name}`);
      }
    } catch (error) {
      console.error(`❌ Error creating ingredient ${ingredientData.name}:`, error);
    }
  }

  console.log(`🎉 Ingredient seeding completed! Created ${ingredients.length} ingredients.`);
}

// Export function to run independently if needed
if (require.main === module) {
  seedIngredients()
    .catch((e) => {
      console.error('Error in ingredient seeding:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}