import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedMitra() {
  console.log('🌱 Seeding mitra...');

  const mitraData = {
    name: 'Yayasan Gizi Sejahtera Purwakarta',
    province: 'Jawa Barat',
    address: 'Jl. Veteran No. 15, Purwakarta, Jawa Barat 41113',
    phone: '0264-123456',
    email: 'info@ygspurwakarta.org',
    licenseNumber: 'YS-PWK-2024-001',
    contactPerson: 'Budi Santoso',
    isActive: true,
  };

  try {
    const existing = await prisma.mitra.findFirst({
      where: { name: mitraData.name }
    });

    if (!existing) {
      const mitra = await prisma.mitra.create({
        data: mitraData,
      });
      console.log(`✅ Created mitra: ${mitraData.name}`);
      return mitra;
    } else {
      console.log(`⚠️  Mitra already exists: ${mitraData.name}`);
      return existing;
    }
  } catch (error) {
    console.error(`❌ Error creating mitra ${mitraData.name}:`, error);
    throw error;
  }
}

// Export function to run independently if needed
if (require.main === module) {
  seedMitra()
    .catch((e) => {
      console.error('Error in mitra seeding:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}