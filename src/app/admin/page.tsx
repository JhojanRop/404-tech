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
import {
  CheckCircle,
  Users,
  DollarSign,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminDashboard() {
  const sweepstakesData = [
    {
      id: 1,
      name: "404 TECH COMPUTADORES",
      offerTitle: "Compra $500.00",
      offerDescription: "",
      startingDate: "May 7, 2025",
      endingDate: "May 15, 2025",
    },
    {
      id: 2,
      name: "TechMax Compra Laptop y Recibe Descuento",
      offerTitle: "Cashback en Laptops",
      offerDescription: "",
      startingDate: "April 27, 2025",
      endingDate: "May 8, 2025",
    },
    {
      id: 3,
      name: "Computadoras de Escritorio Descuento",
      offerTitle: "Cash Back de $50.00",
      offerDescription: "",
      startingDate: "April 20, 2025",
      endingDate: "May 9, 2025",
    },
    {
      id: 4,
      name: "Compra ACCESORIOS GAMING",
      offerTitle: "$100.00 en Gaming y Recibe $20.00",
      offerDescription: "",
      startingDate: "April 6, 2025",
      endingDate: "April 14, 2025",
    },
    {
      id: 5,
      name: "Compra $800.00 y Recibe $100.00",
      offerTitle: "Con $800.00 Tienes $100.00",
      offerDescription: "",
      startingDate: "April 6, 2025",
      endingDate: "April 14, 2025",
    },
    {
      id: 6,
      name: "Compra $1500.00 y Recibe $200.00",
      offerTitle: "Con $1500.00 son $200.00 de Cashback",
      offerDescription: "",
      startingDate: "April 6, 2025",
      endingDate: "April 14, 2025",
    },
    {
      id: 7,
      name: "TechMax Hardware",
      offerTitle: "Compra $300.00 Recibe $30.00",
      offerDescription: "",
      startingDate: "April 6, 2025",
      endingDate: "April 29, 2025",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="text-sm text-gray-500 mb-1">Sweepstakes</div>
            <h1 className="text-3xl font-bold text-gray-900">
              Sweepstake Dashboard
            </h1>
            <p className="text-gray-600">
              Overview of sweepstakes created and awarded
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">Create</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-gray-600">
                    Active Sweepstakes
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">76</div>
                  <div className="text-sm text-gray-600">Submissions Total</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">76</div>
                  <div className="text-sm text-gray-600">
                    Unique users participating
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">$0</div>
                  <div className="text-sm text-gray-600">
                    Total Rewards Offered
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sweepstakes List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Sweepstakes List</CardTitle>
              <Select defaultValue="date">
                <SelectTrigger className="w-40">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Sort by</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sweepstake</TableHead>
                  <TableHead>Offer Title</TableHead>
                  <TableHead>Offer Description</TableHead>
                  <TableHead>Starting Date</TableHead>
                  <TableHead>Ending Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sweepstakesData.map((sweepstake) => (
                  <TableRow key={sweepstake.id}>
                    <TableCell className="font-medium">
                      {sweepstake.name}
                    </TableCell>
                    <TableCell>{sweepstake.offerTitle}</TableCell>
                    <TableCell>{sweepstake.offerDescription}</TableCell>
                    <TableCell>{sweepstake.startingDate}</TableCell>
                    <TableCell>{sweepstake.endingDate}</TableCell>
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
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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
                Showing 7 of 20 entries
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-600 text-white"
                >
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="w-4 h-4" />
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
