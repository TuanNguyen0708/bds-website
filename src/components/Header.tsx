'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Menu, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { getAllProjects, ProjectData } from '@/lib/projectService'

const Header = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [projectsLoading, setProjectsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const allProjects = await getAllProjects()
        setProjects(allProjects)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setProjectsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  // Check if we're on a project page
  const isProjectPage = pathname?.startsWith('/projects')

  // Helper function to get navigation href
  const getNavHref = (hash: string) => {
    return isProjectPage ? `/${hash}` : hash
  }

  const navigation = [
    { name: 'Trang chủ', href: '#home' },
    { name: 'Vị trí', href: '#location' },
    { name: 'Tiện ích', href: '#amenities' },
    { name: 'Giá & Chính sách', href: '#pricing' },
    { name: 'Về chúng tôi', href: '#about' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-600">Phu Nguyen Land</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={getNavHref(item.href)}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </a>
            ))}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium data-[state=open]:text-blue-600">
                    Dự án
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4">
                      {projectsLoading ? (
                        <p className="text-sm text-gray-500 py-4 text-center">Đang tải...</p>
                      ) : projects.length === 0 ? (
                        <p className="text-sm text-gray-500 py-4 text-center">Không có dự án</p>
                      ) : (
                        <div className="grid gap-2 max-h-[400px] overflow-y-auto">
                          {projects.map((project) => (
                            <NavigationMenuLink key={project.id} asChild>
                              <Link
                                href={`/projects/${project.id}`}
                                className="block p-3 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                              >
                                <div className="font-medium text-sm text-gray-900">{project.projectName}</div>
                                {project.slogan && (
                                  <div className="text-xs text-gray-500 mt-1 line-clamp-1">{project.slogan}</div>
                                )}
                                <div className="text-xs text-gray-400 mt-1">{project.location.district}, {project.location.city}</div>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      )}
                      <div className="mt-4 pt-4 border-t">
                        <NavigationMenuLink asChild>
                          <Link
                            href="/projects"
                            className="block p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer text-center text-sm font-medium text-blue-600"
                          >
                            Xem tất cả dự án →
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden md:flex">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <a href={getNavHref('#contact')}>Liên hệ ngay</a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <div className="flex flex-col space-y-6 mt-8">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={getNavHref(item.href)}
                      className="text-gray-700 hover:text-blue-600 px-3 py-3 text-lg font-medium transition-colors border-b border-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                  {/* Projects Dropdown in Mobile */}
                  <div className="border-b border-gray-100 pb-4">
                    <div className="flex items-center justify-between px-3 py-3">
                      <span className="text-gray-700 text-lg font-medium">Dự án</span>
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="pl-4 space-y-2 max-h-[300px] overflow-y-auto">
                      {projectsLoading ? (
                        <p className="text-sm text-gray-500 py-2">Đang tải...</p>
                      ) : projects.length === 0 ? (
                        <p className="text-sm text-gray-500 py-2">Không có dự án</p>
                      ) : (
                        <>
                          {projects.map((project) => (
                            <Link
                              key={project.id}
                              href={`/projects/${project.id}`}
                              className="block py-2 text-gray-600 hover:text-blue-600 transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              <div className="font-medium text-sm">{project.projectName}</div>
                              {project.slogan && (
                                <div className="text-xs text-gray-400 mt-1 line-clamp-1">{project.slogan}</div>
                              )}
                            </Link>
                          ))}
                          <Link
                            href="/projects"
                            className="block py-2 text-blue-600 font-medium text-sm"
                            onClick={() => setIsOpen(false)}
                          >
                            Xem tất cả dự án →
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setIsOpen(false)}>
                      <a href={getNavHref('#contact')}>Liên hệ ngay</a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
