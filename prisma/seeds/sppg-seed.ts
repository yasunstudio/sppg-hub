import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedSppg(mitraId: string) {
  console.log('🌱 Seeding sppg...');

  const sppgData = {
    mitraId,
    name: 'SPPG Purwakarta Utama',
    code: 'SPPG-PWK-001',
    address: 'Jl. Raya Purwakarta-Subang KM 5, Purwakarta, Jawa Barat',
    capacity: 500, // Daily serving capacity
    operatingHours: '06:00-17:00',
    latitude: -6.5569,
    longitude: 107.4431,
    facilities: {
      kitchen: true,
      storage: true,
      freezer: true,
      washingArea: true,
      packagingArea: true,
      deliveryVehicle: 2,
      staffCapacity: 15
    },
    isActive: true,
  };

  try {
    const existing = await prisma.sppg.findFirst({
      where: { code: sppgData.code }
    });

    if (!existing) {
      const sppg = await prisma.sppg.create({
        data: sppgData,
      });
      console.log(`✅ Created SPPG: ${sppgData.name}`);
      return sppg;
    } else {
      console.log(`⚠️  SPPG already exists: ${sppgData.name}`);
      return existing;
    }
  } catch (error) {
    console.error(`❌ Error creating SPPG ${sppgData.name}:`, error);
    throw error;
  }
}

// Export function to run independently if needed
if (require.main === module) {
  // For standalone testing, create a dummy mitra ID
  const dummyMitraId = 'dummy-mitra-id';
  seedSppg(dummyMitraId)
    .catch((e) => {
      console.error('Error in sppg seeding:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}