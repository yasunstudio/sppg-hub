import { PrismaClient } from '@prisma/client';
import { seedMitra } from './seeds/mitra-seed';
import { seedSppg } from './seeds/sppg-seed';
import { seedUsers } from './seeds/user-seed';
import { seedIngredients } from './seeds/ingredient-seed';
import { seedMenus } from './seeds/menu-seed';
import { seedRecipeMenus } from './seeds/recipe-menu-seed';
import { seedRecipes } from './seeds/recipe-seed';
import { seedRecipeIngredients } from './seeds/recipe-ingredient-seed';
import { seedMenuItems } from './seeds/menu-item-seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting database seeding for Purwakarta region...\n');

  try {
    // Step 1: Create Mitra (Parent organization)
    console.log('📋 Step 1: Creating Mitra...');
    const mitra = await seedMitra();
    
    if (!mitra) {
      throw new Error('Failed to create or find Mitra');
    }

    // Step 2: Create SPPG (Child organization)
    console.log('\n📋 Step 2: Creating SPPG...');
    const sppg = await seedSppg(mitra.id);
    
    if (!sppg) {
      throw new Error('Failed to create or find SPPG');
    }

    // Step 3: Create Users with proper tenant relationships
    console.log('\n📋 Step 3: Creating Users...');
    await seedUsers(mitra.id, sppg.id);

    // Step 4: Create Ingredients (independent of tenant)
    console.log('\n📋 Step 4: Creating Ingredients...');
    await seedIngredients();
    
    // Get all ingredients for later use
    const ingredients = await prisma.ingredient.findMany();

    // Step 5: Create Menus for the SPPG
    console.log('\n📋 Step 5: Creating Menus...');
    const menus = await seedMenus(sppg.id);

    // Step 5.1: Create Recipe Menus (for recipe selection)
    console.log('\n📋 Step 5.1: Creating Recipe Menus...');
    await seedRecipeMenus(sppg.id);

    // Step 6: Create Recipes for the Menus
    console.log('\n📋 Step 6: Creating Recipes...');
    const recipes = await seedRecipes(menus);

    // Step 7: Create Recipe-Ingredient connections
    console.log('\n📋 Step 7: Creating Recipe Ingredients...');
    await seedRecipeIngredients(recipes, ingredients);

    // Step 8: Create Menu Items for detailed planning
    console.log('\n📋 Step 8: Creating Menu Items...');
    await seedMenuItems(menus);

    // Final summary
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    
    const counts = await Promise.all([
      prisma.mitra.count(),
      prisma.sppg.count(),
      prisma.user.count(),
      prisma.ingredient.count(),
      prisma.menu.count(),
      prisma.recipe.count(),
      prisma.recipeIngredient.count(),
      prisma.menuItem.count(),
    ]);

    console.log(`   🏢 Mitra: ${counts[0]}`);
    console.log(`   🏭 SPPG: ${counts[1]}`);
    console.log(`   👥 Users: ${counts[2]}`);
    console.log(`   🥕 Ingredients: ${counts[3]}`);
    console.log(`   🍽️  Menus: ${counts[4]}`);
    console.log(`   📝 Recipes: ${counts[5]}`);
    console.log(`   🔗 Recipe Ingredients: ${counts[6]}`);
    console.log(`   📋 Menu Items: ${counts[7]}`);

    console.log('\n✅ All seed data for Purwakarta region has been created!');
    console.log('🔑 Login credentials for testing:');
    console.log('   • admin.purwakarta@sppg.id / password123 (MITRA_ADMIN)');
    console.log('   • manager.purwakarta@sppg.id / password123 (SPPG_MANAGER)');
    console.log('   • gizi.purwakarta@sppg.id / password123 (AHLI_GIZI)');
    console.log('   • chef.purwakarta@sppg.id / password123 (CHEF)');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

// Run the seeding
main()
  .catch((e) => {
    console.error('💥 Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });