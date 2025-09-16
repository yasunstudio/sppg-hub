import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seedUsers(mitraId?: string, sppgId?: string) {
  console.log('🌱 Seeding users...');

  // Hash password for development (password123)
  const passwordHash = await bcrypt.hash('password123', 12);

  const users = [
    // MITRA_ADMIN for Purwakarta
    {
      email: 'admin.purwakarta@sppg.id',
      passwordHash,
      role: UserRole.MITRA_ADMIN,
      firstName: 'Budi',
      lastName: 'Santoso',
      phone: '08123456789',
      status: UserStatus.ACTIVE,
      mitraId,
    },
    // SPPG_MANAGER
    {
      email: 'manager.purwakarta@sppg.id',
      passwordHash,
      role: UserRole.SPPG_MANAGER,
      firstName: 'Sari',
      lastName: 'Dewi',
      phone: '08129876543',
      status: UserStatus.ACTIVE,
      mitraId,
      sppgId,
    },
    // AHLI_GIZI
    {
      email: 'gizi.purwakarta@sppg.id',
      passwordHash,
      role: UserRole.AHLI_GIZI,
      firstName: 'Dr. Andi',
      lastName: 'Nugroho',
      phone: '08134567890',
      status: UserStatus.ACTIVE,
      mitraId,
      sppgId,
    },
    // CHEF
    {
      email: 'chef.purwakarta@sppg.id',
      passwordHash,
      role: UserRole.CHEF,
      firstName: 'Ibu',
      lastName: 'Kartini',
      phone: '08145678901',
      status: UserStatus.ACTIVE,
      mitraId,
      sppgId,
    },
    // FINANCE_OFFICER
    {
      email: 'finance.purwakarta@sppg.id',
      passwordHash,
      role: UserRole.FINANCE_OFFICER,
      firstName: 'Rudi',
      lastName: 'Hermawan',
      phone: '08156789012',
      status: UserStatus.ACTIVE,
      mitraId,
      sppgId,
    },
    // WAREHOUSE_STAFF
    {
      email: 'warehouse.purwakarta@sppg.id',
      passwordHash,
      role: UserRole.WAREHOUSE_STAFF,
      firstName: 'Joko',
      lastName: 'Supriyadi',
      phone: '08167890123',
      status: UserStatus.ACTIVE,
      mitraId,
      sppgId,
    },
    // DRIVER
    {
      email: 'driver.purwakarta@sppg.id',
      passwordHash,
      role: UserRole.DRIVER,
      firstName: 'Agus',
      lastName: 'Setiawan',
      phone: '08178901234',
      status: UserStatus.ACTIVE,
      mitraId,
      sppgId,
    },
    // HR_STAFF
    {
      email: 'hr.purwakarta@sppg.id',
      passwordHash,
      role: UserRole.HR_STAFF,
      firstName: 'Maya',
      lastName: 'Salsabila',
      phone: '08189012345',
      status: UserStatus.ACTIVE,
      mitraId,
      sppgId,
    }
  ];

  // Create or update users with hashed passwords
  for (const userData of users) {
    try {
      const existing = await prisma.user.findFirst({
        where: { email: userData.email }
      });

      if (!existing) {
        await prisma.user.create({
          data: userData,
        });
        console.log(`✅ Created user: ${userData.email}`);
      } else {
        // Update existing user with hashed password
        await prisma.user.update({
          where: { id: existing.id },
          data: {
            ...userData,
            passwordHash, // Ensure we update with the hashed password
          },
        });
        console.log(`🔄 Updated user with hashed password: ${userData.email}`);
      }
    } catch (error) {
      console.error(`❌ Error creating/updating user ${userData.email}:`, error);
    }
  }

  console.log(`🎉 User seeding completed! Created ${users.length} users for Purwakarta region.`);
}

// Export function to run independently if needed
if (require.main === module) {
  seedUsers()
    .catch((e) => {
      console.error('Error in user seeding:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}