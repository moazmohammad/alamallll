"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, BookOpen, Heart, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const allProducts = [
  {
    id: 1,
    name: "مجموعة أقلام ملونة فاخرة",
    price: 45,
    originalPrice: 60,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    category: "أدوات مكتبية",
    badge: "خصم 25%",
    description: "مجموعة من الأقلام الملونة عالية الجودة مناسبة للرسم والكتابة",
    inStock: true,
    reviews: 124,
  },
  {
    id: 2,
    name: "كتاب الأدب العربي الحديث",
    price: 35,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.9,
    category: "كتب",
    badge: "الأكثر مبيعاً",
    description: "كتاب شامل عن الأدب العربي الحديث ومدارسه المختلفة",
    inStock: true,
    reviews: 89,
  },
  {
    id: 3,
    name: "لعبة الشطرنج الخشبية",
    price: 120,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    category: "ألعاب",
    badge: "جديد",
    description: "لعبة شطرنج خشبية فاخرة مع قطع منحوتة يدوياً",
    inStock: true,
    reviews: 45,
  },
  {
    id: 4,
    name: "دفتر ملاحظات جلدي",
    price: 25,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.6,
    category: "أدوات مكتبية",
    description: "دفتر ملاحظات أنيق بغلاف جلدي طبيعي",
    inStock: true,
    reviews: 67,
  },
  {
    id: 5,
    name: "مجموعة كتب الأطفال",
    price: 85,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    category: "كتب",
    description: "مجموعة من القصص التعليمية للأطفال مع رسوم ملونة",
    inStock: true,
    reviews: 156,
  },
  {
    id: 6,
    name: "لعبة الألغاز التعليمية",
    price: 65,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.5,
    category: "ألعاب",
    description: "لعبة ألغاز تعليمية تنمي مهارات التفكير والإبداع",
    inStock: false,
    reviews: 32,
  },
  {
    id: 7,
    name: "آلة حاسبة علمية",
    price: 55,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.4,
    category: "أدوات مكتبية",
    description: "آلة حاسبة علمية متقدمة للطلاب والمهندسين",
    inStock: true,
    reviews: 78,
  },
  {
    id: 8,
    name: "موسوعة العلوم",
    price: 95,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.9,
    category: "كتب",
    badge: "مميز",
    description: "موسوعة شاملة للعلوم الطبيعية والفيزياء والكيمياء",
    inStock: true,
    reviews: 203,
  },
]

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [favoriteProducts, setFavoriteProducts] = useState<typeof allProducts>([])

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      const favoriteIds = JSON.parse(savedFavorites)
      setFavorites(favoriteIds)
      setFavoriteProducts(allProducts.filter((product) => favoriteIds.includes(product.id)))
    }
  }, [])

  // Remove from favorites
  const removeFromFavorites = (productId: number) => {
    const newFavorites = favorites.filter((id) => id !== productId)
    setFavorites(newFavorites)
    setFavoriteProducts(allProducts.filter((product) => newFavorites.includes(product.id)))
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
  }

  // Clear all favorites
  const clearAllFavorites = () => {
    setFavorites([])
    setFavoriteProducts([])
    localStorage.removeItem("favorites")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">مكتبة الأمل</h1>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/products">
                <Button variant="outline" size="sm">
                  تصفح المنتجات
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <ShoppingCart className="h-4 w-4 ml-2" />
                السلة (0)
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">المنتجات المفضلة</h2>
            <p className="text-gray-600">
              {favoriteProducts.length === 0
                ? "لا توجد منتجات في قائمة المفضلة"
                : `لديك ${favoriteProducts.length} منتج في قائمة المفضلة`}
            </p>
          </div>
          {favoriteProducts.length > 0 && (
            <Button variant="outline" onClick={clearAllFavorites}>
              <Trash2 className="h-4 w-4 ml-2" />
              مسح الكل
            </Button>
          )}
        </div>

        {/* Favorites Grid */}
        {favoriteProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">قائمة المفضلة فارغة</h3>
            <p className="text-gray-600 mb-6">ابدأ بإضافة المنتجات التي تعجبك إلى قائمة المفضلة</p>
            <Link href="/products">
              <Button>تصفح المنتجات</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {product.badge && <Badge className="absolute top-2 right-2 bg-red-500">{product.badge}</Badge>}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-lg">
                        <span className="text-white font-semibold">غير متوفر</span>
                      </div>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 left-2"
                      onClick={() => removeFromFavorites(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-sm text-gray-500 mb-1">{product.category}</div>
                  <h4 className="font-semibold mb-2 text-right">{product.name}</h4>
                  <p className="text-sm text-gray-600 mb-3 text-right line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600 mr-1">{product.rating}</span>
                      <span className="text-xs text-gray-500 mr-1">({product.reviews})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-blue-600">{product.price} ج.م</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through mr-2">{product.originalPrice} ج.م</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm" disabled={!product.inStock}>
                      <ShoppingCart className="h-4 w-4 ml-2" />
                      {product.inStock ? "أضف للسلة" : "غير متوفر"}
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="px-3"
                      onClick={() => removeFromFavorites(product.id)}
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
