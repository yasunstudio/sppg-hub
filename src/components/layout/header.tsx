"use client";

import { useSession } from "next-auth/react";
import { UserMenu } from "@/components/auth/user-menu";

export function Header() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-foreground">
            SPPG Hub Purwakarta
          </h1>
          <div className="hidden md:flex items-center space-x-1 text-sm text-muted-foreground">
            <span>•</span>
            <span>Kabupaten Purwakarta, Jawa Barat</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}