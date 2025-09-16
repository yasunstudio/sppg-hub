"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ChefHat, Users, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Selamat Datang, {session.user.name}!
        </h1>
        <p className="text-muted-foreground">
          Dashboard SPPG Hub Kabupaten Purwakarta, Jawa Barat
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SPPG</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Aktif di Purwakarta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menu Lokal</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Menu khas Purwakarta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Staff aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performa</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">
              Efisiensi sistem
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Aksi cepat untuk mengelola SPPG
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-3 rounded-md border hover:bg-accent hover:text-accent-foreground transition-colors">
              🍽️ Kelola Menu
            </button>
            <button className="w-full text-left p-3 rounded-md border hover:bg-accent hover:text-accent-foreground transition-colors">
              📊 Lihat Laporan
            </button>
            <button className="w-full text-left p-3 rounded-md border hover:bg-accent hover:text-accent-foreground transition-colors">
              👥 Kelola User
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Info SPPG Anda</CardTitle>
            <CardDescription>
              Detail SPPG yang sedang Anda kelola
            </CardDescription>
          </CardHeader>
          <CardContent>
            {session.user.sppgName ? (
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>SPPG:</strong> {session.user.sppgName}
                </p>
                {session.user.mitraName && (
                  <p className="text-sm">
                    <strong>Mitra:</strong> {session.user.mitraName}
                  </p>
                )}
                <p className="text-sm">
                  <strong>Role:</strong> {session.user.role}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Anda belum ditugaskan ke SPPG tertentu
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}