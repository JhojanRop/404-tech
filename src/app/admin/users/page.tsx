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
  Users,
  UserCheck,
  UserX,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Shield,
  Ban,
} from "lucide-react";
import { useState, useMemo } from "react";

export default function UsersAdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all-roles");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const usersData = [
    {
      id: 1,
      name: "Juan Carlos Pérez",
      email: "juan.perez@email.com",
      phone: "+1 (555) 123-4567",
      status: "active",
      role: "customer",
      joinDate: "2024-01-15",
      lastLogin: "2025-05-30",
      totalOrders: 12,
      totalSpent: "$2,450.00",
      totalSpentNumber: 2450,
      avatar: "JP",
    },
    {
      id: 2,
      name: "María González",
      email: "maria.gonzalez@email.com",
      phone: "+1 (555) 234-5678",
      status: "active",
      role: "customer",
      joinDate: "2024-02-20",
      lastLogin: "2025-05-29",
      totalOrders: 8,
      totalSpent: "$1,200.00",
      totalSpentNumber: 1200,
      avatar: "MG",
    },
    {
      id: 3,
      name: "Carlos Rodriguez",
      email: "carlos.rodriguez@email.com",
      phone: "+1 (555) 345-6789",
      status: "inactive",
      role: "customer",
      joinDate: "2024-03-10",
      lastLogin: "2025-04-15",
      totalOrders: 3,
      totalSpent: "$850.00",
      totalSpentNumber: 850,
      avatar: "CR",
    },
    {
      id: 4,
      name: "Ana Martínez",
      email: "ana.martinez@email.com",
      phone: "+1 (555) 456-7890",
      status: "active",
      role: "admin",
      joinDate: "2023-12-01",
      lastLogin: "2025-05-31",
      totalOrders: 0,
      totalSpent: "$0.00",
      totalSpentNumber: 0,
      avatar: "AM",
    },
    {
      id: 5,
      name: "Pedro Sánchez",
      email: "pedro.sanchez@email.com",
      phone: "+1 (555) 567-8901",
      status: "suspended",
      role: "customer",
      joinDate: "2024-04-05",
      lastLogin: "2025-05-20",
      totalOrders: 15,
      totalSpent: "$3,200.00",
      totalSpentNumber: 3200,
      avatar: "PS",
    },
    {
      id: 6,
      name: "Laura Torres",
      email: "laura.torres@email.com",
      phone: "+1 (555) 678-9012",
      status: "active",
      role: "customer",
      joinDate: "2024-05-12",
      lastLogin: "2025-05-31",
      totalOrders: 6,
      totalSpent: "$950.00",
      totalSpentNumber: 950,
      avatar: "LT",
    },
    {
      id: 7,
      name: "Roberto López",
      email: "roberto.lopez@email.com",
      phone: "+1 (555) 789-0123",
      status: "active",
      role: "moderator",
      joinDate: "2024-01-30",
      lastLogin: "2025-05-30",
      totalOrders: 2,
      totalSpent: "$500.00",
      totalSpentNumber: 500,
      avatar: "RL",
    },
  ];

  // Función para filtrar y ordenar usuarios
  const filteredAndSortedUsers = useMemo(() => {
    const filtered = usersData.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      const matchesRole =
        roleFilter === "all-roles" || user.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "email":
          return a.email.localeCompare(b.email);
        case "joinDate":
          return (
            new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
          );
        case "lastLogin":
          return (
            new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime()
          );
        case "totalSpent":
          return b.totalSpentNumber - a.totalSpentNumber;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, roleFilter, sortBy]);

  // Paginación
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const paginatedUsers = filteredAndSortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Estadísticas dinámicas
  const totalUsers = usersData.length;
  const activeUsers = usersData.filter((u) => u.status === "active").length;
  const inactiveUsers = usersData.filter((u) => u.status === "inactive").length;
  const suspendedUsers = usersData.filter(
    (u) => u.status === "suspended"
  ).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
      case "moderator":
        return <Badge className="bg-blue-100 text-blue-800">Moderator</Badge>;
      case "customer":
        return <Badge className="bg-gray-100 text-gray-800">Customer</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">User</Badge>;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUserAction = (action: string, user: any) => {
    console.log(`Action: ${action} for user:`, user);
    // Aquí puedes implementar las acciones reales
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="text-sm text-gray-500 mb-1">User Management</div>
          <h1 className="text-3xl font-bold text-gray-900">Users Dashboard</h1>
          <p className="text-gray-600">Manage and monitor all user accounts</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeUsers}</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <UserX className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{inactiveUsers}</div>
                <div className="text-sm text-gray-600">Inactive Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Ban className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{suspendedUsers}</div>
                <div className="text-sm text-gray-600">Suspended Users</div>
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
                  placeholder="Search users by name, email, or phone..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page when searching
                  }}
                />
              </div>
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={roleFilter}
              onValueChange={(value) => {
                setRoleFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-40">
                <Shield className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-roles">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              Users List ({filteredAndSortedUsers.length}{" "}
              {filteredAndSortedUsers.length === 1 ? "user" : "users"})
            </CardTitle>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="joinDate">Join Date</SelectItem>
                <SelectItem value="lastLogin">Last Login</SelectItem>
                <SelectItem value="totalSpent">Total Spent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="w-3 h-3 mr-1 text-gray-400" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-3 h-3 mr-1 text-gray-400" />
                        {user.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                      {user.joinDate}
                    </div>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-semibold">{user.totalOrders}</div>
                      <div className="text-xs text-gray-500">orders</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-green-600">
                      {user.totalSpent}
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
                          onClick={() => handleUserAction("view", user)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUserAction("edit", user)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUserAction("message", user)}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Send Message
                        </DropdownMenuItem>
                        {user.status === "active" ? (
                          <DropdownMenuItem
                            className="text-yellow-600"
                            onClick={() => handleUserAction("suspend", user)}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-green-600"
                            onClick={() => handleUserAction("activate", user)}
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activate User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleUserAction("delete", user)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
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
                filteredAndSortedUsers.length
              )}{" "}
              of {filteredAndSortedUsers.length} users
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

              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index + 1}
                  variant="outline"
                  size="sm"
                  className={
                    currentPage === index + 1 ? "bg-blue-600 text-white" : ""
                  }
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}

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
