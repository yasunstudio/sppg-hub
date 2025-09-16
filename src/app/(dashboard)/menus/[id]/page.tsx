'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MenuDetailsView } from '@/modules/menu-planning/components/menu-details/menu-details-view'
import { LoadingSkeleton } from '@/modules/menu-planning/components/shared/loading-skeleton'
import type { MenuWithRelations } from '@/modules/menu-planning/types/menu.types'

export default function MenuDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [menu, setMenu] = useState<MenuWithRelations | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'loading' || !session) {
      return
    }

    const fetchMenu = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/menus/${params.id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Menu tidak ditemukan')
          } else if (response.status === 403) {
            setError('Anda tidak memiliki akses ke menu ini')
          } else {
            setError('Gagal memuat data menu')
          }
          return
        }
        
        const menuData = await response.json()
        setMenu(menuData)
      } catch (error) {
        console.error('Failed to fetch menu:', error)
        setError('Terjadi kesalahan saat memuat menu')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchMenu()
    }
  }, [params.id, session, status, router])

  const handleEdit = () => {
    router.push(`/menus/${params.id}/edit`)
  }

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/menus/${params.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Gagal menghapus menu')
      }

      // Redirect to menus list after successful deletion
      router.push('/menus')
    } catch (error) {
      console.error('Failed to delete menu:', error)
      alert('Gagal menghapus menu. Silakan coba lagi.')
    }
  }

  const handleDuplicate = async () => {
    try {
      const response = await fetch(`/api/menus/${params.id}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ namePrefix: 'Copy of' })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to duplicate menu')
      }

      const duplicatedMenu = await response.json()
      console.log('Menu duplicated successfully:', duplicatedMenu.name)
      
      // Navigate back to menus list
      router.push('/menus')
    } catch (error) {
      console.error('Failed to duplicate menu:', error)
      alert('Gagal menduplikat menu. Silakan coba lagi.')
    }
  }

  const handleBack = () => {
    router.push('/menus')
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (!menu) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Menu Not Found</h1>
          <p className="text-muted-foreground mb-4">The menu you&apos;re looking for doesn&apos;t exist.</p>
          <Button
            onClick={handleBack}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back to menus
          </Button>
        </div>
      </div>
    )
  }

  return (
    <MenuDetailsView
      menu={menu}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onDuplicate={handleDuplicate}
      onBack={handleBack}
    />
  )
}