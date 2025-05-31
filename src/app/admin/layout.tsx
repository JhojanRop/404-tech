"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-purple-800 to-purple-900 text-white">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
              <span className="text-purple-800 font-bold text-xl">
                404 Tech
              </span>
            </div>
          </div>

          <nav className="space-y-2">
            <div className="text-sm text-purple-300 mb-4">Main Menu</div>

            <Link
              href="/admin/dashboard"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive("/admin")
                  ? "bg-purple-700 text-white border-l-4 border-green-400"
                  : "text-purple-200 hover:bg-purple-700"
              }`}
            >
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/products"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive("/admin/products")
                  ? "bg-purple-700 text-white border-l-4 border-green-400"
                  : "text-purple-200 hover:bg-purple-700"
              }`}
            >
              <span>Products</span>
            </Link>

            <Link
              href="/admin/analytics"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive("/admin/analytics")
                  ? "bg-purple-700 text-white border-l-4 border-green-400"
                  : "text-purple-200 hover:bg-purple-700"
              }`}
            >
              <span>Analytics</span>
            </Link>

            <Link
              href="/admin/users"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive("/admin/users")
                  ? "bg-purple-700 text-white border-l-4 border-green-400"
                  : "text-purple-200 hover:bg-purple-700"
              }`}
            >
              <span>Users</span>
            </Link>
          </nav>
        </div>

        <div className="absolute bottom-0 w-64 p-6">
          <div className="border-t border-purple-700 pt-4">
            <Link
              href="/admin/settings"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-purple-200 hover:bg-purple-700 transition-colors"
            >
              <span>Settings</span>
            </Link>
            <button
              onClick={() => {
                // Aquí puedes agregar la lógica de logout
                console.log("Logging out...");
                // window.location.href = "/login"; // o tu ruta de login
              }}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-purple-200 hover:bg-purple-700 transition-colors w-full text-left mt-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
          <div className="flex items-center space-x-2 mt-4 text-sm text-purple-300">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-xs">G</span>
            </div>
            <span>Teocorrea299.com</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
