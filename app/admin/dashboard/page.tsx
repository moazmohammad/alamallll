"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BookOpen,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  DollarSign,
  Eye,
  Plus,
  LogOut,
  BarChart3,
  Edit,
  UserPlus,
  Bell,
  Settings,
  Percent,
  UsersIcon,
  Menu,
} from "lucide-react"
import Link from "next/link"
import { getOrders, getProducts, getCurrentUser, setCurrentUser, getNotifications, initializeSync } from "@/lib/store"

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [orders, setOrders] = useState(getOrders())
  const [products, setProducts] = useState(getProducts())
  const [notifications, setNotifications] = useState(getNotifications())
  const currentUser = getCurrentUser()

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn")
    if (!loggedIn || !currentUser) {
      router.push("/admin")
    } else {
      setIsAuthenticated(true)
      // تهيئة نظام التزامن
      initializeSync()
    }

    // تحديث البيانات عند تغييرها
    const handleOrdersUpdate = () => setOrders(getOrders())
    const handleProductsUpdate = () => setProducts(getProducts())

    window.addEventListener("ordersUpdated", handleOrdersUpdate)
    window.addEventListener("productsUpdated", handleProductsUpdate)

    return () => {
      window.removeEventListener("ordersUpdated", handleOrdersUpdate)
      window.removeEventListener("productsUpdated", handleProductsUpdate)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    setCurrentUser(null)
    router.push("/")
  }

  // حساب الإحصائيات الحقيقية
  const totalSales = Math.round(orders.reduce((sum, order) => sum + order.total, 0))
  const totalOrders = orders.length
  const totalProducts = products.length
  const totalCustomers = new Set(orders.map((order) => order.customer)).size
  const recentOrders = orders.slice(-5).reverse()
  const unreadNotifications = notifications.filter((n) => !n.isRead).length
  const topProducts = products
    .sort((a, b) => (b.sales || 0) - (a.sales || 0))
    .slice(0, 4)
    .map((product) => ({
      name: product.name,
      sales: product.sales || 0,
      revenue: Math.round((product.sales || 0) * product.price),
    }))

  const stats = [
    {
      title: "إجمالي المبيعات",
      value: `${totalSales} ج.م`,
      change: "+12%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "عدد الطلبات",
      value: totalOrders.toString(),
      change: "+8%",
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "المنتجات",
      value: totalProducts.toString(),
      change: "+5%",
      icon: Package,
      color: "text-purple-600",
    },
    {
      title: "العملاء",
      value: totalCustomers.toString(),
      change: "+15%",
      icon: Users,
      color: "text-orange-600",
    },
  ]

  if (!isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">جاري التحميل...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">لوحة التحكم - مكتبة الأمل</h1>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <span className="text-sm text-gray-600 hidden lg:block">مرحباً {currentUser?.name}</span>

              {/* Notifications */}
              <Link href="/admin/notifications">
                <Button variant="outline" size="sm" className="relative bg-transparent">
                  <Bell className="h-4 w-4" />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </Link>

              <Link href="/">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 ml-2" />
                  <span className="hidden sm:inline">عرض المتجر</span>
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 ml-2" />
                <span className="hidden sm:inline">تسجيل الخروج</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 ml-1" />
                  {stat.change} من الشهر الماضي
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>الطلبات الأخيرة</CardTitle>
              <CardDescription>آخر الطلبات المستلمة</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">لا توجد طلبات حتى الآن</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">رقم الطلب</TableHead>
                        <TableHead className="text-right hidden sm:table-cell">العميل</TableHead>
                        <TableHead className="text-right">المبلغ</TableHead>
                        <TableHead className="text-right hidden md:table-cell">الحالة</TableHead>
                        <TableHead className="text-right">إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div>
                              <div className="font-medium">{order.customer}</div>
                              <div className="text-sm text-gray-500">{order.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>{Math.round(order.total)} ج.م</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge
                              variant={
                                order.status === "مكتمل"
                                  ? "default"
                                  : order.status === "مشحون"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Link href={`/admin/orders`}>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </Link>
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>المنتجات الأكثر مبيعاً</CardTitle>
              <CardDescription>أفضل المنتجات أداءً هذا الشهر</CardDescription>
            </CardHeader>
            <CardContent>
              {topProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">لا توجد مبيعات حتى الآن</p>
              ) : (
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sales} مبيعة</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{product.revenue} ج.م</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
            <CardDescription>الإجراءات الأكثر استخداماً</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9 gap-3 md:gap-4">
              <Link href="/admin/products/add">
                <Button className="h-16 md:h-20 flex flex-col space-y-2 w-full text-xs md:text-sm">
                  <Plus className="h-5 w-5 md:h-6 md:w-6" />
                  <span>إضافة منتج</span>
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button
                  variant="outline"
                  className="h-16 md:h-20 flex flex-col space-y-2 w-full bg-transparent text-xs md:text-sm"
                >
                  <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
                  <span>الطلبات</span>
                </Button>
              </Link>
              <Link href="/admin/products">
                <Button
                  variant="outline"
                  className="h-16 md:h-20 flex flex-col space-y-2 w-full bg-transparent text-xs md:text-sm"
                >
                  <Package className="h-5 w-5 md:h-6 md:w-6" />
                  <span>المنتجات</span>
                </Button>
              </Link>
              <Link href="/admin/menus">
                <Button
                  variant="outline"
                  className="h-16 md:h-20 flex flex-col space-y-2 w-full bg-transparent text-xs md:text-sm"
                >
                  <Menu className="h-5 w-5 md:h-6 md:w-6" />
                  <span>إدارة القوائم</span>
                </Button>
              </Link>
              <Link href="/admin/customers">
                <Button
                  variant="outline"
                  className="h-16 md:h-20 flex flex-col space-y-2 w-full bg-transparent text-xs md:text-sm"
                >
                  <UsersIcon className="h-5 w-5 md:h-6 md:w-6" />
                  <span>العملاء</span>
                </Button>
              </Link>
              <Link href="/admin/reports">
                <Button
                  variant="outline"
                  className="h-16 md:h-20 flex flex-col space-y-2 w-full bg-transparent text-xs md:text-sm"
                >
                  <BarChart3 className="h-5 w-5 md:h-6 md:w-6" />
                  <span>التقارير</span>
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button
                  variant="outline"
                  className="h-16 md:h-20 flex flex-col space-y-2 w-full bg-transparent text-xs md:text-sm"
                >
                  <UserPlus className="h-5 w-5 md:h-6 md:w-6" />
                  <span>المستخدمين</span>
                </Button>
              </Link>
              <Link href="/admin/coupons">
                <Button
                  variant="outline"
                  className="h-16 md:h-20 flex flex-col space-y-2 w-full bg-transparent text-xs md:text-sm"
                >
                  <Percent className="h-5 w-5 md:h-6 md:w-6" />
                  <span>أكواد الخصم</span>
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button
                  variant="outline"
                  className="h-16 md:h-20 flex flex-col space-y-2 w-full bg-transparent text-xs md:text-sm"
                >
                  <Settings className="h-5 w-5 md:h-6 md:w-6" />
                  <span>الإعدادات</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
