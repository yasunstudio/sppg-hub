import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedRecipes(menus: any[]) {
  console.log('🌱 Seeding recipes...');

  const recipes = [
    // Recipe untuk Menu TK - Ayam & Sayur
    {
      menuId: menus[0]?.id,
      instructions: `1. Cuci bersih ayam fillet, potong dadu kecil
2. Tumis bawang putih dan bawang merah hingga harum
3. Masukkan ayam fillet, masak hingga berubah warna
4. Tambahkan sayuran (wortel, bayam) dan bumbu
5. Masak hingga sayuran matang dan bumbu meresap
6. Sajikan dengan nasi putih hangat
7. Pastikan tekstur sesuai untuk anak TK`,
      servingSize: 10,
      prepTime: 30,
      cookTime: 25,
    },
    
    // Recipe untuk Menu TK - Ikan & Tempe  
    {
      menuId: menus[1]?.id,
      instructions: `1. Bersihkan ikan lele, potong sesuai porsi anak
2. Goreng ikan dengan minyak sedikit hingga matang
3. Potong tempe, goreng hingga kecokelatan
4. Tumis kangkung dengan bawang putih
5. Bumbui dengan garam dan sedikit gula
6. Tata di piring dengan nasi putih
7. Pastikan tidak ada duri ikan yang tertinggal`,
      servingSize: 10,
      prepTime: 35,
      cookTime: 30,
    },

    // Recipe untuk Menu SD - Ayam Fillet & Sayur Campur
    {
      menuId: menus[2]?.id,
      instructions: `1. Marinasi ayam fillet dengan bumbu halus
2. Panaskan minyak, tumis bumbu hingga wangi
3. Masukkan ayam fillet, masak hingga matang
4. Siapkan sayur campur: wortel, kacang panjang, bayam
5. Tumis sayuran dengan urutan tingkat kematangan
6. Campur ayam dengan sayuran, bumbui
7. Koreksi rasa, sajikan dengan nasi putih`,
      servingSize: 15,
      prepTime: 40,
      cookTime: 35,
    },

    // Recipe untuk Menu SD - Telur & Tahu
    {
      menuId: menus[3]?.id,
      instructions: `1. Kocok telur, bumbui dengan garam dan merica
2. Buat telur dadar, potong kotak-kotak
3. Goreng tahu hingga kuning kecokelatan
4. Tumis sayuran dengan bawang putih
5. Campur telur dadar dan tahu dengan sayuran
6. Bumbui dengan kecap dan garam
7. Masak hingga bumbu meresap, sajikan hangat`,
      servingSize: 15,
      prepTime: 30,
      cookTime: 25,
    },

    // Recipe untuk Menu SMP - Ayam & Ubi Jalar
    {
      menuId: menus[4]?.id,
      instructions: `1. Potong ayam fillet ukuran sedang
2. Kupas dan potong ubi jalar, kukus hingga empuk
3. Tumis bumbu halus hingga harum
4. Masukkan ayam, masak hingga matang
5. Tambahkan ubi jalar kukus dan sayuran
6. Bumbui dengan lengkap, masak hingga bumbu meresap
7. Koreksi rasa, sajikan dengan porsi yang cukup`,
      servingSize: 20,
      prepTime: 45,
      cookTime: 40,
    },

    // Recipe untuk Menu SMP - Ikan & Mie
    {
      menuId: menus[5]?.id,
      instructions: `1. Bersihkan ikan lele, potong sesuai selera
2. Lumuri ikan dengan bumbu, diamkan 15 menit
3. Goreng ikan hingga matang dan garing
4. Rebus mie telur hingga aldente
5. Tumis sayuran dengan bumbu lengkap
6. Campur mie dengan sayuran dan ikan
7. Aduk rata, koreksi rasa, sajikan panas`,
      servingSize: 20,
      prepTime: 35,
      cookTime: 30,
    },
  ];

  // Create recipes
  const createdRecipes = [];
  for (let i = 0; i < recipes.length; i++) {
    const recipeData = recipes[i];
    
    if (!recipeData.menuId) {
      console.log(`⚠️  Skipping recipe ${i + 1} - no menu ID`);
      continue;
    }

    try {
      const existing = await prisma.recipe.findFirst({
        where: { 
          menuId: recipeData.menuId 
        }
      });

      if (!existing) {
        const recipe = await prisma.recipe.create({
          data: recipeData,
        });
        createdRecipes.push(recipe);
        console.log(`✅ Created recipe for menu ${i + 1}`);
      } else {
        createdRecipes.push(existing);
        console.log(`⚠️  Recipe already exists for menu ${i + 1}`);
      }
    } catch (error) {
      console.error(`❌ Error creating recipe ${i + 1}:`, error);
    }
  }

  console.log(`🎉 Recipe seeding completed! Created ${createdRecipes.length} recipes.`);
  return createdRecipes;
}

// Export function to run independently if needed
if (require.main === module) {
  seedRecipes([])
    .catch((e) => {
      console.error('Error in recipe seeding:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}