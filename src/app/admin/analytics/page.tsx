import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  Eye,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function AnalyticsDashboard() {
  const salesData = [
    { month: "Ene", sales: 45000, users: 120 },
    { month: "Feb", sales: 52000, users: 150 },
    { month: "Mar", sales: 48000, users: 140 },
    { month: "Abr", sales: 61000, users: 180 },
    { month: "May", sales: 55000, users: 165 },
    { month: "Jun", sales: 67000, users: 200 },
  ];

  const topProducts = [
    { name: "Laptop Gaming MSI", sales: 45, revenue: "$22,500" },
    { name: "PC Escritorio AMD", sales: 32, revenue: "$16,000" },
    { name: "Monitor 4K Samsung", sales: 28, revenue: "$8,400" },
    { name: "Teclado Mecánico", sales: 67, revenue: "$6,700" },
    { name: "Mouse Gaming", sales: 89, revenue: "$4,450" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="text-sm text-gray-500 mb-1">Analytics</div>
            <h1 className="text-3xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Monitor your sales performance and customer insights
            </p>
          </div>
          <div className="flex space-x-3">
            <Select defaultValue="30days">
              <SelectTrigger className="w-40">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="year">This year</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">$328,500</div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                  <div className="flex items-center mt-2 text-green-600">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    <span className="text-sm">+12.5%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">1,245</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                  <div className="flex items-center mt-2 text-green-600">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    <span className="text-sm">+8.2%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">8,942</div>
                  <div className="text-sm text-gray-600">Total Visitors</div>
                  <div className="flex items-center mt-2 text-red-600">
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                    <span className="text-sm">-2.1%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">14.3%</div>
                  <div className="text-sm text-gray-600">Conversion Rate</div>
                  <div className="flex items-center mt-2 text-green-600">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    <span className="text-sm">+1.8%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Sales Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 text-sm font-medium">
                        {item.month}
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(item.sales / 70000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        ${item.sales.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.users} users
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
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">
                          {product.sales} sales
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        {product.revenue}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border-l-4 border-green-500 bg-green-50">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium">New customer registration</div>
                    <div className="text-sm text-gray-500">
                      Juan Carlos registered 5 minutes ago
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">5 min ago</div>
              </div>

              <div className="flex items-center justify-between p-4 border-l-4 border-blue-500 bg-blue-50">
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Large order completed</div>
                    <div className="text-sm text-gray-500">
                      Order #1234 - $2,450.00
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">12 min ago</div>
              </div>

              <div className="flex items-center justify-between p-4 border-l-4 border-orange-500 bg-orange-50">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="font-medium">Sales target reached</div>
                    <div className="text-sm text-gray-500">
                      Monthly goal of $300K achieved
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">1 hour ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
