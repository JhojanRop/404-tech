"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Package,
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import { useState, useMemo } from "react";

export default function ProductsAdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const productsData = [
    {
      id: 1,
      name: "Laptop Gaming MSI GF63",
      category: "Laptops",
      price: 899.99,
      stock: 15,
      sold: 45,
      status: "active",
      image: "/api/placeholder/60/60",
      sku: "MSI-GF63-001",
      brand: "MSI",
      rating: 4.5,
      lowStockThreshold: 10,
    },
    {
      id: 2,
      name: "PC Escritorio AMD Ryzen 7",
      category: "Desktop PCs",
      price: 1299.99,
      stock: 8,
      sold: 32,
      status: "active",
      image: "/api/placeholder/60/60",
      sku: "PC-AMD-R7-001",
      brand: "Custom Build",
      rating: 4.7,
      lowStockThreshold: 5,
    },
    {
      id: 3,
      name: 'Monitor Samsung 4K 27"',
      category: "Monitors",
      price: 349.99,
      stock: 3,
      sold: 28,
      status: "low-stock",
      image: "/api/placeholder/60/60",
      sku: "SAM-27-4K-001",
      brand: "Samsung",
      rating: 4.6,
      lowStockThreshold: 5,
    },
    {
      id: 4,
      name: "Teclado Mecánico RGB",
      category: "Accessories",
      price: 89.99,
      stock: 25,
      sold: 67,
      status: "active",
      image: "/api/placeholder/60/60",
      sku: "KEY-RGB-001",
      brand: "Corsair",
      rating: 4.3,
      lowStockThreshold: 10,
    },
    {
      id: 5,
      name: "Mouse Gaming Logitech",
      category: "Accessories",
      price: 49.99,
      stock: 0,
      sold: 89,
      status: "out-of-stock",
      image: "/api/placeholder/60/60",
      sku: "LOG-MOUSE-001",
      brand: "Logitech",
      rating: 4.4,
      lowStockThreshold: 15,
    },
    {
      id: 6,
      name: "SSD NVMe 1TB Samsung",
      category: "Storage",
      price: 129.99,
      stock: 20,
      sold: 156,
      status: "active",
      image: "/api/placeholder/60/60",
      sku: "SAM-SSD-1TB-001",
      brand: "Samsung",
      rating: 4.8,
      lowStockThreshold: 10,
    },
    {
      id: 7,
      name: "RAM DDR4 16GB Corsair",
      category: "Components",
      price: 79.99,
      stock: 12,
      sold: 78,
      status: "active",
      image: "/api/placeholder/60/60",
      sku: "COR-RAM-16GB-001",
      brand: "Corsair",
      rating: 4.5,
      lowStockThreshold: 8,
    },
    {
      id: 8,
      name: "Tarjeta Gráfica RTX 4060",
      category: "Components",
      price: 599.99,
      stock: 7,
      sold: 23,
      status: "active",
      image: "/api/placeholder/60/60",
      sku: "RTX-4060-001",
      brand: "NVIDIA",
      rating: 4.9,
      lowStockThreshold: 5,
    },
    {
      id: 9,
      name: "Webcam HD 1080p",
      category: "Accessories",
      price: 39.99,
      stock: 0,
      sold: 134,
      status: "out-of-stock",
      image: "/api/placeholder/60/60",
      sku: "WEB-HD-001",
      brand: "Logitech",
      rating: 4.2,
      lowStockThreshold: 20,
    },
    {
      id: 10,
      name: "Auriculares Gaming Steel",
      category: "Accessories",
      price: 79.99,
      stock: 18,
      sold: 92,
      status: "active",
      image: "/api/placeholder/60/60",
      sku: "AUR-STEEL-001",
      brand: "SteelSeries",
      rating: 4.4,
      lowStockThreshold: 15,
    },
  ];

  // Función para filtrar, ordenar y paginar productos
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = productsData.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      let matchesStatus = true;
      if (statusFilter !== "all") {
        if (statusFilter === "active") {
          matchesStatus = product.stock > product.lowStockThreshold;
        } else if (statusFilter === "low-stock") {
          matchesStatus =
            product.stock > 0 && product.stock <= product.lowStockThreshold;
        } else if (statusFilter === "out-of-stock") {
          matchesStatus = product.stock === 0;
        }
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Ordenar
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "stock":
          comparison = a.stock - b.stock;
          break;
        case "sold":
          comparison = a.sold - b.sold;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "rating":
          comparison = a.rating - b.rating;
          break;
        case "brand":
          comparison = a.brand.localeCompare(b.brand);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [searchTerm, categoryFilter, statusFilter, sortBy, sortOrder]);

  // Paginación
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Estadísticas dinámicas
  const totalProducts = productsData.length;
  const inStockProducts = productsData.filter(
    (p) => p.stock > p.lowStockThreshold
  ).length;
  const lowStockProducts = productsData.filter(
    (p) => p.stock > 0 && p.stock <= p.lowStockThreshold
  ).length;
  const outOfStockProducts = productsData.filter((p) => p.stock === 0).length;
  const totalValue = productsData.reduce(
    (sum, p) => sum + p.price * p.stock,
    0
  );

  const getStatusBadge = (
    status: string,
    stock: number,
    lowStockThreshold: number
  ) => {
    if (stock === 0) {
      return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>;
    } else if (stock <= lowStockThreshold) {
      return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleProductAction = (action: string, product: any) => {
    console.log(`Action: ${action} for product:`, product);
    // Aquí puedes implementar las acciones reales
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="text-sm text-gray-500 mb-1">Inventory Management</div>
          <h1 className="text-3xl font-bold text-gray-900">
            Products Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your tech inventory and track stock levels
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalProducts}</div>
                <div className="text-sm text-gray-600">Total Products</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{inStockProducts}</div>
                <div className="text-sm text-gray-600">In Stock</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{lowStockProducts}</div>
                <div className="text-sm text-gray-600">Low Stock</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{outOfStockProducts}</div>
                <div className="text-sm text-gray-600">Out of Stock</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  ${totalValue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Inventory Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products by name, SKU, or brand..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Laptops">Laptops</SelectItem>
                <SelectItem value="Desktop PCs">Desktop PCs</SelectItem>
                <SelectItem value="Monitors">Monitors</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
                <SelectItem value="Components">Components</SelectItem>
                <SelectItem value="Storage">Storage</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              Products Inventory ({filteredAndSortedProducts.length}{" "}
              {filteredAndSortedProducts.length === 1 ? "product" : "products"})
            </CardTitle>
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50 select-none"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Product</span>
                    <ArrowUpDown className="w-4 h-4" />
                    {sortBy === "name" && (
                      <span className="text-blue-600">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead>SKU</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50 select-none"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Category</span>
                    <ArrowUpDown className="w-4 h-4" />
                    {sortBy === "category" && (
                      <span className="text-blue-600">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50 select-none"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Price</span>
                    <ArrowUpDown className="w-4 h-4" />
                    {sortBy === "price" && (
                      <span className="text-blue-600">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50 select-none"
                  onClick={() => handleSort("stock")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Stock</span>
                    <ArrowUpDown className="w-4 h-4" />
                    {sortBy === "stock" && (
                      <span className="text-blue-600">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50 select-none"
                  onClick={() => handleSort("sold")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Sold</span>
                    <ArrowUpDown className="w-4 h-4" />
                    {sortBy === "sold" && (
                      <span className="text-blue-600">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50 select-none"
                  onClick={() => handleSort("rating")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Rating</span>
                    <ArrowUpDown className="w-4 h-4" />
                    {sortBy === "rating" && (
                      <span className="text-blue-600">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">
                          {product.brand}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-sm">{product.sku}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">${product.price}</div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`font-semibold ${
                        product.stock === 0
                          ? "text-red-600"
                          : product.stock <= product.lowStockThreshold
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {product.stock}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-semibold">{product.sold}</div>
                      <div className="text-xs text-gray-500">units</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(
                      product.status,
                      product.stock,
                      product.lowStockThreshold
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1">{product.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleProductAction("view", product)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleProductAction("edit", product)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleProductAction("stock", product)}
                        >
                          <Package className="mr-2 h-4 w-4" />
                          Update Stock
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleProductAction("analytics", product)
                          }
                        >
                          <TrendingUp className="mr-2 h-4 w-4" />
                          View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleProductAction("delete", product)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(
                currentPage * itemsPerPage,
                filteredAndSortedProducts.length
              )}{" "}
              of {filteredAndSortedProducts.length} products
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              {/* Page Numbers */}
              {[...Array(totalPages)]
                .slice(
                  Math.max(0, currentPage - 3),
                  Math.min(totalPages, currentPage + 2)
                )
                .map((_, index) => {
                  const pageNumber = Math.max(1, currentPage - 2) + index;
                  return (
                    <Button
                      key={pageNumber}
                      variant="outline"
                      size="sm"
                      className={
                        currentPage === pageNumber
                          ? "bg-blue-600 text-white"
                          : ""
                      }
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRight className="w-4 h-4" />
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
