"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { createUser } from "@/lib/api/users"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [overAllBudget, setOverAllBudget] = useState("")

  const [emailError, setEmailError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setEmailError(null)

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      })
      return
    }

    const parsedBudget = Number.parseFloat(overAllBudget)
    if (isNaN(parsedBudget) || parsedBudget < 0) {
      toast({
        title: "Invalid budget",
        description: "Overall budget must be zero or positive",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await createUser({
        name,
        email,
        password,
        overAllBudget: parsedBudget,
      })

      if (response?.id) {
        localStorage.setItem("userId", response.id.toString())
      } else {
        console.warn("User ID not returned after registration")
      }

      toast({
        title: "Registration successful",
        description: "Your account has been created successfully",
      })

      router.push("/dashboard") // or "/login" if you prefer to log in afterward
    } catch (error: any) {
      if (error?.message?.toLowerCase().includes("email")) {
        setEmailError(error.message)
      }

      toast({
        title: "Registration failed",
        description: error?.message || "There was an error creating your account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={emailError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
              />
              {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Overall Budget</Label>
              <Input
                id="budget"
                type="number"
                value={overAllBudget}
                onChange={(e) => setOverAllBudget(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Register"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
