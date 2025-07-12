"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // بيانات الدخول المحددة
    if (credentials.username === "admin" && credentials.password === "admin123") {
      // حفظ حالة تسجيل الدخول
      localStorage.setItem("adminLoggedIn", "true")
      router.push("/admin/dashboard")
    } else {
      setError("بيانات الدخول غير صحيحة")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold">مكتبة الأمل</h1>
          </div>
          <CardTitle className="flex items-center justify-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>لوحة التحكم الإدارية</span>
          </CardTitle>
          <CardDescription>قم بتسجيل الدخول للوصول إلى لوحة التحكم</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input
                id="username"
                type="text"
                placeholder="أدخل اسم المستخدم"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="text-right"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="text-right"
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full">
              تسجيل الدخول
            </Button>
          </form>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">بيانات الدخول التجريبية:</h4>
            <p className="text-sm text-gray-600">اسم المستخدم: admin</p>
            <p className="text-sm text-gray-600">كلمة المرور: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
