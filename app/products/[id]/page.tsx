
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, Heart, ArrowLeft, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import {
  getCart,
  saveCart,
  getFavorites,
  saveFavorites,
  type CartItem,
} from "@/lib/store"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Product } from "@/lib/products"
import { useToast } from "@/hooks/use-toast"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = parseInt(params.id as string)

  const [product, setProduct] = useState<Product | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [favorites, setFavorites] = useState<number[]>([])
  const [mainImage, setMainImage] = useState<string | undefined>(undefined)

  const { toast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      // Fetch product from Firestore
      const docRef = doc(db, "products", productId.toString());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const foundProduct = docSnap.data() as Product;
        setProduct(foundProduct);
        if (foundProduct.image) {
          setMainImage(foundProduct.image);
        }
      } else {
        setProduct(null);
      }
      setCart(getCart());
      setFavorites(getFavorites());
    };
    loadData();

    const handleCartUpdate = () => setCart(getCart());
    const handleFavoritesUpdate = () => setFavorites(getFavorites());
    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("favoritesUpdated", handleFavoritesUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate);
    };
  }, [productId]);

  const addToCart = (product: Product) => {
    if (!product.inStock) {
      toast({
        title: "غير متوفر",
        description: "هذا المنتج غير متوفر حالياً",
        variant: "destructive",
      })
      return
    }

    const existingItem = cart.find((item) => item.id === product.id)
    let newCart: CartItem[]

    if (existingItem) {
      newCart = cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      newCart = [
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image || "",
          quantity: 1,
        },
      ]
    }

    setCart(newCart)
    saveCart(newCart)

    toast({
      title: "تم الإضافة ✅",
      description: `تم إضافة ${product.name} إلى السلة بنجاح`,
      variant: "success",
    })
  }

  const toggleFavorite = (productId: number) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId]

    setFavorites(newFavorites)
    saveFavorites(newFavorites)
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">المنتج غير موجود.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">مكتبة الأمل</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/favorites">
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 ml-2" />
                  المفضلة ({favorites.length})
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="outline" size="sm">
                  <ShoppingCart className="h-4 w-4 ml-2" />
                  السلة ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => window.history.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 ml-2" />
          العودة للمنتجات
        </Button>

        <Card className="lg:flex">
          <div className="lg:w-1/2 p-4">
            <div className="relative mb-4">
              <Image
                src={mainImage || "/placeholder.svg"}
                alt={product.name}
                width={400}
                height={400}
                className="w-[400px] h-[400px] object-contain rounded-lg mx-auto"
              />
              {product.badge && <Badge className="absolute top-2 right-2 bg-red-500">{product.badge}</Badge>}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <span className="text-white font-semibold">غير متوفر</span>
                </div>
              )}
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.image && (
                <div
                  className={`relative w-24 h-24 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 ${mainImage === product.image ? "border-blue-500" : "border-transparent"}`}
                  onClick={() => setMainImage(product.image)}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={96}
                    height={96}
                    className="w-[96px] h-[96px] object-cover" />
                </div>
              )}
            </div>
          </div>
          <div className="lg:w-1/2 p-6">
            <div className="text-sm text-gray-500 mb-1">
              {product.category} {product.subcategory && `- ${product.subcategory}`}
            </div>
            <h2 className="text-3xl font-bold mb-3 text-right">{product.name}</h2>
            <p className="text-gray-700 mb-4 text-right">{product.description}</p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg text-gray-600 mr-1">{product.rating}</span>
                <span className="text-sm text-gray-500 mr-1">({product.reviews} مراجعات)</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-blue-600">{product.price} ج.م</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through mr-2">{product.originalPrice} ج.م</span>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 py-3 text-lg"
                disabled={!product.inStock}
                onClick={() => addToCart(product)}
              >
                <ShoppingCart className="h-5 w-5 ml-2" />
                {product.inStock ? "أضف للسلة" : "غير متوفر"}
              </Button>

            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}


