'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, User, LogOut, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

const links = [
  { name: 'Journals', href: '/journal' },
  { name: 'History', href: '/history' },
]

const UserButton = ({ user, signOut }) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const handleSignOutClick = () => {
    setIsAlertOpen(true)
  }

  const handleSignOutConfirm = () => {
    signOut()
    setIsAlertOpen(false)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
          <Avatar>
            <AvatarImage src={user.profileImageUrl} alt={user.name} />
            <AvatarFallback> {'KK'} </AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm hidden md:inline text-gray-300">
            {user.name}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-gray-800 text-gray-300"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-gray-400">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem className="hover:bg-gray-700">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-700">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem
          onSelect={handleSignOutClick}
          className="hover:bg-gray-700"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to sign out?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You will be redirected to the login page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOutConfirm}>
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  )
}

const DashboardLayout = ({ children }) => {
  const { user, loading, signOut } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex justify-center items-center">
        Loading...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex justify-center items-center text-white">
        Please sign in to access this page.
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition duration-200 ease-in-out`}
      >
        <nav>
          <div className="flex items-center justify-between mb-6 px-4">
            <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Moody Journal
            </span>
            <button onClick={toggleSidebar} className="md:hidden">
              <X size={24} />
            </button>
          </div>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between lg:justify-end">
              <button
                onClick={toggleSidebar}
                className="text-gray-300 focus:outline-none focus:text-gray-100 md:hidden"
              >
                <Menu size={24} />
              </button>
              <div className="flex items-center">
                <UserButton user={user} signOut={signOut} />
              </div>
            </div>
          </div>
        </header>
        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
