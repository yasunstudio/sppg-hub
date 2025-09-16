import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedRecipeIngredients(recipes: any[], ingredients: any[]) {
  console.log('🌱 Seeding recipe ingredients...');

  // Helper function to find ingredient by name
  const findIngredient = (name: string) => {
    return ingredients.find(ing => ing.name === name);
  };

  const recipeIngredients = [
    // Recipe 1: Menu TK - Ayam & Sayur
    ...(recipes[0] ? [
      {
        recipeId: recipes[0].id,
        ingredientId: findIngredient('Ayam Fillet')?.id,
        quantity: 1.5,
        unit: 'kg',
        notes: 'Potong dadu kecil sesuai usia anak TK',
      },
      {
        recipeId: recipes[0].id,
        ingredientId: findIngredient('Beras Premium')?.id,
        quantity: 2,
        unit: 'kg',
        notes: 'Untuk nasi putih',
      },
      {
        recipeId: recipes[0].id,
        ingredientId: findIngredient('Wortel')?.id,
        quantity: 0.5,
        unit: 'kg',
        notes: 'Potong dadu kecil',
      },
      {
        recipeId: recipes[0].id,
        ingredientId: findIngredient('Bayam')?.id,
        quantity: 0.8,
        unit: 'kg',
        notes: 'Cuci bersih, potong kasar',
      },
      {
        recipeId: recipes[0].id,
        ingredientId: findIngredient('Bawang Putih')?.id,
        quantity: 0.1,
        unit: 'kg',
        notes: 'Haluskan',
      },
      {
        recipeId: recipes[0].id,
        ingredientId: findIngredient('Bawang Merah')?.id,
        quantity: 0.15,
        unit: 'kg',
        notes: 'Haluskan',
      },
      {
        recipeId: recipes[0].id,
        ingredientId: findIngredient('Minyak Goreng')?.id,
        quantity: 0.2,
        unit: 'liter',
        notes: 'Untuk menumis',
      },
      {
        recipeId: recipes[0].id,
        ingredientId: findIngredient('Garam')?.id,
        quantity: 0.05,
        unit: 'kg',
        notes: 'Secukupnya',
      },
    ] : []),

    // Recipe 2: Menu TK - Ikan & Tempe
    ...(recipes[1] ? [
      {
        recipeId: recipes[1].id,
        ingredientId: findIngredient('Ikan Lele')?.id,
        quantity: 1.8,
        unit: 'kg',
        notes: 'Bersihkan, potong sesuai porsi anak',
      },
      {
        recipeId: recipes[1].id,
        ingredientId: findIngredient('Tempe')?.id,
        quantity: 5,
        unit: 'papan',
        notes: 'Potong kotak-kotak',
      },
      {
        recipeId: recipes[1].id,
        ingredientId: findIngredient('Kangkung')?.id,
        quantity: 1,
        unit: 'kg',
        notes: 'Pilih yang muda dan segar',
      },
      {
        recipeId: recipes[1].id,
        ingredientId: findIngredient('Beras Premium')?.id,
        quantity: 2,
        unit: 'kg',
        notes: 'Untuk nasi putih',
      },
      {
        recipeId: recipes[1].id,
        ingredientId: findIngredient('Bawang Putih')?.id,
        quantity: 0.1,
        unit: 'kg',
        notes: 'Iris halus',
      },
      {
        recipeId: recipes[1].id,
        ingredientId: findIngredient('Minyak Goreng')?.id,
        quantity: 0.3,
        unit: 'liter',
        notes: 'Untuk menggoreng dan menumis',
      },
      {
        recipeId: recipes[1].id,
        ingredientId: findIngredient('Garam')?.id,
        quantity: 0.05,
        unit: 'kg',
        notes: 'Secukupnya',
      },
    ] : []),

    // Recipe 3: Menu SD - Ayam Fillet & Sayur Campur
    ...(recipes[2] ? [
      {
        recipeId: recipes[2].id,
        ingredientId: findIngredient('Ayam Fillet')?.id,
        quantity: 2.5,
        unit: 'kg',
        notes: 'Potong sesuai ukuran untuk anak SD',
      },
      {
        recipeId: recipes[2].id,
        ingredientId: findIngredient('Beras Premium')?.id,
        quantity: 3,
        unit: 'kg',
        notes: 'Untuk nasi putih',
      },
      {
        recipeId: recipes[2].id,
        ingredientId: findIngredient('Wortel')?.id,
        quantity: 0.8,
        unit: 'kg',
        notes: 'Potong bulat atau kotak',
      },
      {
        recipeId: recipes[2].id,
        ingredientId: findIngredient('Kacang Panjang')?.id,
        quantity: 0.7,
        unit: 'kg',
        notes: 'Potong 2-3 cm',
      },
      {
        recipeId: recipes[2].id,
        ingredientId: findIngredient('Bayam')?.id,
        quantity: 1,
        unit: 'kg',
        notes: 'Cuci bersih',
      },
      {
        recipeId: recipes[2].id,
        ingredientId: findIngredient('Bawang Putih')?.id,
        quantity: 0.15,
        unit: 'kg',
        notes: 'Haluskan',
      },
      {
        recipeId: recipes[2].id,
        ingredientId: findIngredient('Bawang Merah')?.id,
        quantity: 0.2,
        unit: 'kg',
        notes: 'Haluskan',
      },
      {
        recipeId: recipes[2].id,
        ingredientId: findIngredient('Minyak Goreng')?.id,
        quantity: 0.3,
        unit: 'liter',
        notes: 'Untuk menumis',
      },
      {
        recipeId: recipes[2].id,
        ingredientId: findIngredient('Garam')?.id,
        quantity: 0.08,
        unit: 'kg',
        notes: 'Sesuai selera',
      },
    ] : []),

    // Recipe 4: Menu SD - Telur & Tahu
    ...(recipes[3] ? [
      {
        recipeId: recipes[3].id,
        ingredientId: findIngredient('Telur Ayam')?.id,
        quantity: 20,
        unit: 'butir',
        notes: 'Untuk telur dadar',
      },
      {
        recipeId: recipes[3].id,
        ingredientId: findIngredient('Tahu')?.id,
        quantity: 6,
        unit: 'papan',
        notes: 'Potong kotak, goreng',
      },
      {
        recipeId: recipes[3].id,
        ingredientId: findIngredient('Beras Premium')?.id,
        quantity: 3,
        unit: 'kg',
        notes: 'Untuk nasi putih',
      },
      {
        recipeId: recipes[3].id,
        ingredientId: findIngredient('Kangkung')?.id,
        quantity: 1.2,
        unit: 'kg',
        notes: 'Sayuran pelengkap',
      },
      {
        recipeId: recipes[3].id,
        ingredientId: findIngredient('Wortel')?.id,
        quantity: 0.5,
        unit: 'kg',
        notes: 'Potong julienne',
      },
      {
        recipeId: recipes[3].id,
        ingredientId: findIngredient('Bawang Putih')?.id,
        quantity: 0.12,
        unit: 'kg',
        notes: 'Iris halus',
      },
      {
        recipeId: recipes[3].id,
        ingredientId: findIngredient('Minyak Goreng')?.id,
        quantity: 0.4,
        unit: 'liter',
        notes: 'Untuk menggoreng dan menumis',
      },
      {
        recipeId: recipes[3].id,
        ingredientId: findIngredient('Garam')?.id,
        quantity: 0.07,
        unit: 'kg',
        notes: 'Secukupnya',
      },
    ] : []),

    // Recipe 5: Menu SMP - Ayam & Ubi Jalar
    ...(recipes[4] ? [
      {
        recipeId: recipes[4].id,
        ingredientId: findIngredient('Ayam Fillet')?.id,
        quantity: 3,
        unit: 'kg',
        notes: 'Potong ukuran sedang',
      },
      {
        recipeId: recipes[4].id,
        ingredientId: findIngredient('Ubi Jalar')?.id,
        quantity: 2,
        unit: 'kg',
        notes: 'Kupas, potong, kukus',
      },
      {
        recipeId: recipes[4].id,
        ingredientId: findIngredient('Bayam')?.id,
        quantity: 1.5,
        unit: 'kg',
        notes: 'Sayuran hijau',
      },
      {
        recipeId: recipes[4].id,
        ingredientId: findIngredient('Wortel')?.id,
        quantity: 1,
        unit: 'kg',
        notes: 'Potong sesuai selera',
      },
      {
        recipeId: recipes[4].id,
        ingredientId: findIngredient('Bawang Putih')?.id,
        quantity: 0.18,
        unit: 'kg',
        notes: 'Haluskan untuk bumbu',
      },
      {
        recipeId: recipes[4].id,
        ingredientId: findIngredient('Bawang Merah')?.id,
        quantity: 0.25,
        unit: 'kg',
        notes: 'Haluskan untuk bumbu',
      },
      {
        recipeId: recipes[4].id,
        ingredientId: findIngredient('Minyak Goreng')?.id,
        quantity: 0.4,
        unit: 'liter',
        notes: 'Untuk menumis',
      },
      {
        recipeId: recipes[4].id,
        ingredientId: findIngredient('Garam')?.id,
        quantity: 0.1,
        unit: 'kg',
        notes: 'Sesuai selera',
      },
    ] : []),

    // Recipe 6: Menu SMP - Ikan & Mie
    ...(recipes[5] ? [
      {
        recipeId: recipes[5].id,
        ingredientId: findIngredient('Ikan Lele')?.id,
        quantity: 3.5,
        unit: 'kg',
        notes: 'Bersihkan, marinasi',
      },
      {
        recipeId: recipes[5].id,
        ingredientId: findIngredient('Mie Telur')?.id,
        quantity: 2,
        unit: 'kg',
        notes: 'Rebus hingga aldente',
      },
      {
        recipeId: recipes[5].id,
        ingredientId: findIngredient('Kacang Panjang')?.id,
        quantity: 1,
        unit: 'kg',
        notes: 'Potong 3-4 cm',
      },
      {
        recipeId: recipes[5].id,
        ingredientId: findIngredient('Wortel')?.id,
        quantity: 0.8,
        unit: 'kg',
        notes: 'Julienne',
      },
      {
        recipeId: recipes[5].id,
        ingredientId: findIngredient('Kangkung')?.id,
        quantity: 1,
        unit: 'kg',
        notes: 'Potong sesuai ukuran',
      },
      {
        recipeId: recipes[5].id,
        ingredientId: findIngredient('Bawang Putih')?.id,
        quantity: 0.15,
        unit: 'kg',
        notes: 'Haluskan',
      },
      {
        recipeId: recipes[5].id,
        ingredientId: findIngredient('Bawang Merah')?.id,
        quantity: 0.2,
        unit: 'kg',
        notes: 'Haluskan',
      },
      {
        recipeId: recipes[5].id,
        ingredientId: findIngredient('Minyak Goreng')?.id,
        quantity: 0.5,
        unit: 'liter',
        notes: 'Untuk menggoreng dan menumis',
      },
      {
        recipeId: recipes[5].id,
        ingredientId: findIngredient('Garam')?.id,
        quantity: 0.1,
        unit: 'kg',
        notes: 'Sesuai selera',
      },
    ] : []),
  ];

  // Filter out recipe ingredients with missing IDs
  const validRecipeIngredients = recipeIngredients.filter(ri => ri.recipeId && ri.ingredientId);

  // Create recipe ingredients
  let createdCount = 0;
  for (const recipeIngredientData of validRecipeIngredients) {
    try {
      const existing = await prisma.recipeIngredient.findFirst({
        where: { 
          recipeId: recipeIngredientData.recipeId,
          ingredientId: recipeIngredientData.ingredientId 
        }
      });

      if (!existing) {
        await prisma.recipeIngredient.create({
          data: recipeIngredientData,
        });
        createdCount++;
        console.log(`✅ Created recipe ingredient connection`);
      } else {
        console.log(`⚠️  Recipe ingredient already exists`);
      }
    } catch (error) {
      console.error(`❌ Error creating recipe ingredient:`, error);
    }
  }

  console.log(`🎉 Recipe ingredient seeding completed! Created ${createdCount} connections.`);
  console.log(`   From ${validRecipeIngredients.length} valid recipe-ingredient combinations.`);
}

// Export function to run independently if needed
if (require.main === module) {
  seedRecipeIngredients([], [])
    .catch((e) => {
      console.error('Error in recipe ingredient seeding:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}