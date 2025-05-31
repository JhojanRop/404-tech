"use client";

import { useState, useMemo } from "react";
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
  Users,
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  Eye,
  MoreHorizontal,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MapPin,
  Star,
} from "lucide-react";

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [refreshing, setRefreshing] = useState(false);
  const [salesFilter, setSalesFilter] = useState("all");

  // Datos simulados pero realistas
  const dashboardData = {
    overview: {
      totalRevenue: 127430,
      totalOrders: 1247,
      totalCustomers: 892,
      totalProducts: 156,
      revenueChange: 12.5,
      ordersChange: -3.2,
      customersChange: 8.1,
      productsChange: 2.4,
    },
    recentSales: [
      {
        id: "ORD-001",
        customer: "Juan Pérez",
        email: "juan@email.com",
        amount: 299.99,
        status: "completed",
        date: "2025-05-31",
        products: 2,
        location: "Lima, Perú",
      },
      {
        id: "ORD-002",
        customer: "María González",
        email: "maria@email.com",
        amount: 1599.5,
        status: "pending",
        date: "2025-05-31",
        products: 1,
        location: "Arequipa, Perú",
      },
      {
        id: "ORD-003",
        customer: "Carlos Rodríguez",
        email: "carlos@email.com",
        amount: 89.99,
        status: "completed",
        date: "2025-05-30",
        products: 3,
        location: "Cusco, Perú",
      },
      {
        id: "ORD-004",
        customer: "Ana López",
        email: "ana@email.com",
        amount: 450.0,
        status: "shipping",
        date: "2025-05-30",
        products: 1,
        location: "Trujillo, Perú",
      },
      {
        id: "ORD-005",
        customer: "Pedro Martín",
        email: "pedro@email.com",
        amount: 1299.99,
        status: "completed",
        date: "2025-05-29",
        products: 1,
        location: "Chiclayo, Perú",
      },
    ],
    topProducts: [
      {
        id: 1,
        name: "Laptop Gaming MSI",
        sales: 45,
        revenue: 40455,
        change: 15.2,
        stock: 12,
        rating: 4.8,
      },
      {
        id: 2,
        name: "Monitor 4K Samsung",
        sales: 32,
        revenue: 11200,
        change: -5.1,
        stock: 8,
        rating: 4.6,
      },
      {
        id: 3,
        name: "Teclado RGB Corsair",
        sales: 67,
        revenue: 6030,
        change: 22.3,
        stock: 25,
        rating: 4.4,
      },
      {
        id: 4,
        name: "Mouse Gaming Logitech",
        sales: 89,
        revenue: 4449,
        change: 8.7,
        stock: 0,
        rating: 4.5,
      },
    ],
    notifications: [
      {
        id: 1,
        type: "warning",
        message: "5 productos con stock bajo",
        time: "Hace 2 min",
      },
      {
        id: 2,
        type: "success",
        message: "Nueva venta de $1,599.50",
        time: "Hace 5 min",
      },
      {
        id: 3,
        type: "info",
        message: "Reporte mensual generado",
        time: "Hace 1 hora",
      },
    ],
    salesByCategory: [
      { category: "Laptops", amount: 45600, percentage: 35.8 },
      { category: "Desktop PCs", amount: 32400, percentage: 25.4 },
      { category: "Accessories", amount: 28900, percentage: 22.7 },
      { category: "Components", amount: 20530, percentage: 16.1 },
    ],
  };

  const filteredSales = useMemo(() => {
    if (salesFilter === "all") return dashboardData.recentSales;
    return dashboardData.recentSales.filter(
      (sale) => sale.status === salesFilter
    );
  }, [salesFilter]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      completed: { label: "Completed", class: "bg-green-100 text-green-800" },
      pending: { label: "Pending", class: "bg-yellow-100 text-yellow-800" },
      shipping: { label: "Shipping", class: "bg-blue-100 text-blue-800" },
      cancelled: { label: "Cancelled", class: "bg-red-100 text-red-800" },
    };

    const statusInfo =
      statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge className={statusInfo.class}>{statusInfo.label}</Badge>;
  };

  const getChangeIndicator = (change: number) => {
    const isPositive = change > 0;
    return (
      <div
        className={`flex items-center ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        {isPositive ? (
          <ArrowUpRight className="w-4 h-4 mr-1" />
        ) : (
          <ArrowDownRight className="w-4 h-4 mr-1" />
        )}
        <span className="text-sm font-medium">{Math.abs(change)}%</span>
      </div>
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simular carga de datos
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const handleExport = () => {
    console.log("Exporting dashboard data...");
    // Implementar lógica de exportación
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-500 mb-1">
            <Calendar className="w-4 h-4 inline mr-1" />
            Dashboard Overview
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor your business performance and key metrics
          </p>
        </div>
        <div className="flex space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${dashboardData.overview.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              {getChangeIndicator(dashboardData.overview.revenueChange)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.overview.totalOrders.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              {getChangeIndicator(dashboardData.overview.ordersChange)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Customers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.overview.totalCustomers}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              {getChangeIndicator(dashboardData.overview.customersChange)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.overview.totalProducts}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              {getChangeIndicator(dashboardData.overview.productsChange)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.salesByCategory.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        index === 0
                          ? "bg-blue-500"
                          : index === 1
                          ? "bg-green-500"
                          : index === 2
                          ? "bg-yellow-500"
                          : "bg-purple-500"
                      }`}
                    />
                    <span className="text-sm font-medium">
                      {category.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      ${category.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {category.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.topProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span>{product.sales} sold</span>
                      <span className="flex items-center">
                        <Star className="w-3 h-3 mr-1 text-yellow-500" />
                        {product.rating}
                      </span>
                      <span
                        className={`${
                          product.stock === 0
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      ${product.revenue.toLocaleString()}
                    </div>
                    {getChangeIndicator(product.change)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === "warning"
                        ? "bg-yellow-500"
                        : notification.type === "success"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Sales</CardTitle>
            <div className="flex space-x-2">
              <Select value={salesFilter} onValueChange={setSalesFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shipping">Shipping</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{sale.customer}</div>
                      <div className="text-sm text-gray-500">{sale.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                      {sale.location}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${sale.amount}
                  </TableCell>
                  <TableCell className="text-center">{sale.products}</TableCell>
                  <TableCell>{getStatusBadge(sale.status)}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Package className="mr-2 h-4 w-4" />
                          Track Order
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download Invoice
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
