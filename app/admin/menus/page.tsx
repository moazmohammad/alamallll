"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BookOpen, ArrowLeft, Plus, Edit, Trash2, Menu, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { getMenus, saveMenus as storeMenus } from "@/lib/store"

interface MenuItem {
  id: number
  name: string
  url: string
  parentId?: number
  order: number
  isActive: boolean
}

export default function MenusManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [menus, setMenus] = useState<MenuItem[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    parentId: "",
    order: "1",
    isActive: true,
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = localStorage.getItem("adminLoggedIn")
      if (!loggedIn) {
        router.push("/admin")
      } else {
        setIsAuthenticated(true)
        loadMenus()
      }
    }
  }, [router])

  const loadMenus = () => {
    try {
      const savedMenus = getMenus()
      setMenus(savedMenus)
    } catch (error) {
      console.error('Failed to load menus:', error)
      // استخدام القوائم الافتراضية في حالة الفشل
      const defaultMenus: MenuItem[] = [
        { id: 1, name: "الرئيسية", url: "/", order: 1, isActive: true },
        { id: 2, name: "المنتجات", url: "/products", order: 2, isActive: true },
        { id: 3, name: "الكتب", url: "/products?category=كتب", parentId: 2, order: 1, isActive: true },
        { id: 4, name: "الألعاب", url: "/products?category=ألعاب", parentId: 2, order: 2, isActive: true },
        { id: 5, name: "أدوات مكتبية", url: "/products?category=أدوات مكتبية", parentId: 2, order: 3, isActive: true },
        { id: 6, name: "اتصل بنا", url: "/contact", order: 3, isActive: true },
        { id: 7, name: "المنتدى", url: "/forum", order: 4, isActive: true },
      ]
      setMenus(defaultMenus)
    }
  }

  const saveMenusData = (updatedMenus: MenuItem[]) => {
    setMenus(updatedMenus)
    
    try {
      storeMenus(updatedMenus)
    } catch (error) {
      console.error("Failed to save menus:", error)
      // حفظ محلي كبديل
      if (typeof window !== "undefined") {
        localStorage.setItem("menus", JSON.stringify(updatedMenus))
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newMenu: MenuItem = {
      id: editingMenu ? editingMenu.id : Math.max(...menus.map(m => m.id), 0) + 1,
      name: formData.name,
      url: formData.url,
      parentId: formData.parentId ? Number(formData.parentId) : undefined,
      order: Number(formData.order),
      isActive: formData.isActive,
    }

    let updatedMenus: MenuItem[]
    if (editingMenu) {
      updatedMenus = menus.map(m => m.id === editingMenu.id ? newMenu : m)
      toast({
        title: "تم بنجاح ✅",
        description: "تم تحديث القائمة بنجاح",
        variant: "success",
      })
    } else {
      updatedMenus = [...menus, newMenu]
      toast({
        title: "تم بنجاح ✅",
        description: "تم إضافة القائمة بنجاح",
        variant: "success",
      })
    }

    saveMenusData(updatedMenus)
    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (menu: MenuItem) => {
    setEditingMenu(menu)
    setFormData({
      name: menu.name,
      url: menu.url,
      parentId: menu.parentId?.toString() || "",
      order: menu.order.toString(),
      isActive: menu.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (menuId: number) => {
    if (confirm("هل أنت متأكد من حذف هذه القائمة؟")) {
      // حذف القائمة والقوائم الفرعية التابعة لها
      const updatedMenus = menus.filter(m => m.id !== menuId && m.parentId !== menuId)
      saveMenusData(updatedMenus)
      toast({
        title: "تم بنجاح ✅",
        description: "تم حذف القائمة بنجاح",
        variant: "success",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      url: "",
      parentId: "",
      order: "1",
      isActive: true,
    })
    setEditingMenu(null)
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // تجميع القوائم حسب الهيكل الهرمي
  const mainMenus = menus.filter(m => !m.parentId).sort((a, b) => a.order - b.order)
  const getSubMenus = (parentId: number) => 
    menus.filter(m => m.parentId === parentId).sort((a, b) => a.order - b.order)

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
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 ml-2" />
                  العودة
                </Button>
              </Link>
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">إدارة القوائم</h1>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة قائمة جديدة
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingMenu ? "تعديل القائمة" : "إضافة قائمة جديدة"}</DialogTitle>
                  <DialogDescription>
                    {editingMenu ? "قم بتحديث بيانات القائمة" : "أدخل بيانات القائمة الجديدة"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسم القائمة *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="text-right"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url">الرابط *</Label>
                    <Input
                      id="url"
                      value={formData.url}
                      onChange={(e) => handleChange("url", e.target.value)}
                      className="text-right"
                      placeholder="/products"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parentId">القائمة الرئيسية</Label>
                    <Select value={formData.parentId} onValueChange={(value) => handleChange("parentId", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر القائمة الرئيسية (اختياري)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">لا يوجد (قائمة رئيسية)</SelectItem>
                        {mainMenus.map((menu) => (
                          <SelectItem key={menu.id} value={menu.id.toString()}>
                            {menu.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order">ترتيب العرض *</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => handleChange("order", e.target.value)}
                      className="text-right"
                      min="1"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      id="isActive"
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => handleChange("isActive", e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="isActive">نشط</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      إلغاء
                    </Button>
                    <Button type="submit">
                      {editingMenu ? "تحديث" : "إضافة"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Menu className="h-5 w-5" />
              قائمة القوائم
            </CardTitle>
            <CardDescription>
              إدارة القوائم الرئيسية والفرعية للموقع
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">اسم القائمة</TableHead>
                    <TableHead className="text-right">الرابط</TableHead>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">الترتيب</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mainMenus.map((menu) => (
                    <React.Fragment key={menu.id}>
                      <TableRow>
                        <TableCell className="font-medium text-right">{menu.name}</TableCell>
                        <TableCell className="text-right text-sm text-gray-600">{menu.url}</TableCell>
                        <TableCell className="text-right">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            قائمة رئيسية
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{menu.order}</TableCell>
                        <TableCell className="text-right">
                          <span className={`text-xs px-2 py-1 rounded ${
                            menu.isActive 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {menu.isActive ? "نشط" : "غير نشط"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(menu)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(menu.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {getSubMenus(menu.id).map((subMenu) => (
                        <TableRow key={subMenu.id} className="bg-gray-50">
                          <TableCell className="text-right pl-8">
                            <div className="flex items-center gap-2">
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                              {subMenu.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-sm text-gray-600">{subMenu.url}</TableCell>
                          <TableCell className="text-right">
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                              قائمة فرعية
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{subMenu.order}</TableCell>
                          <TableCell className="text-right">
                            <span className={`text-xs px-2 py-1 rounded ${
                              subMenu.isActive 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {subMenu.isActive ? "نشط" : "غير نشط"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(subMenu)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(subMenu.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

