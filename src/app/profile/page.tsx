"use client";

import { useState, useEffect } from "react";
import { UserIcon, ShoppingBagIcon, ClockIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getOrders } from "@/services/orders";
import { getUserById } from "@/services/users";
import { logout } from "@/services/auth";
import { Order } from "@/types/order";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  preferences: {
    usage: string;
    budget: number;
  };
  totalOrders: number;
  totalSpent: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "text-green-600 bg-green-50";
    case "pending":
      return "text-yellow-600 bg-yellow-50";
    case "cancelled":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "paid":
      return "Paid";
    case "pending":
      return "Pending";
    case "cancelled":
      return "Cancelled";
    default:
      return "Unknown";
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case "admin":
      return "text-purple-600 bg-purple-50 border-purple-200";
    case "user":
      return "text-viridian-600 bg-viridian-50 border-viridian-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

const getRoleText = (role: string) => {
  switch (role) {
    case "admin":
      return "Administrator";
    case "user":
      return "User";
    default:
      return role;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatJoinDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("info");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      logout();
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      // Esperar a que useAuth termine de cargar
      if (authLoading) {
        return;
      }

      // Si no hay usuario en localStorage, redirect to login
      if (!user?.id) {
        setError("User not found. Please log in.");
        setLoading(false);
        return;
      }

      console.log('User from localStorage:', user);

      try {
        setLoading(true);

        // Fetch fresh user details and orders from API using the ID from localStorage
        const [userDetails, userOrdersResponse] = await Promise.all([
          getUserById(user.id),
          getOrders(user.id)
        ]);

        console.log('Fresh user details from API:', userDetails);
        console.log('User orders response from API:', userOrdersResponse);

        // Handle different possible response structures for orders
        let userOrders: Order[] = [];

        if (Array.isArray(userOrdersResponse)) {
          userOrders = userOrdersResponse;
        } else if (userOrdersResponse && typeof userOrdersResponse === 'object') {
          type OrdersResponse =
            | { data: Order[] }
            | { orders: Order[] }
            | { results: Order[] }
            | Record<string, unknown>;

          const ordersResp = userOrdersResponse as OrdersResponse;

          if (
            typeof ordersResp === "object" &&
            ordersResp !== null &&
            "data" in ordersResp &&
            Array.isArray((ordersResp as { data: Order[] }).data)
          ) {
            userOrders = (ordersResp as { data: Order[] }).data;
          } else if (
            typeof ordersResp === "object" &&
            ordersResp !== null &&
            "orders" in ordersResp &&
            Array.isArray((ordersResp as { orders: Order[] }).orders)
          ) {
            userOrders = (ordersResp as { orders: Order[] }).orders;
          } else if (
            typeof ordersResp === "object" &&
            ordersResp !== null &&
            "results" in ordersResp &&
            Array.isArray((ordersResp as { results: Order[] }).results)
          ) {
            userOrders = (ordersResp as { results: Order[] }).results;
          } else {
            console.warn('Orders response is not an array:', userOrdersResponse);
            userOrders = [];
          }
        } else {
          console.warn('Unexpected orders response format:', userOrdersResponse);
          userOrders = [];
        }

        console.log('Processed user orders:', userOrders);

        // Calculate totals from orders
        const totalOrders = userOrders.length;
        const totalSpent = userOrders.reduce((sum, order) => {
          const orderTotal = Number(order.total) || 0;
          return sum + orderTotal;
        }, 0);

        console.log('Calculated totals:', { totalOrders, totalSpent });

        // Combine localStorage data with fresh API data
        const typedUserDetails = userDetails as UserData;
        setUserData({
          id: typedUserDetails.id,
          name: typedUserDetails.name,
          email: typedUserDetails.email,
          role: typedUserDetails.role,
          createdAt: typedUserDetails.createdAt,
          updatedAt: typedUserDetails.updatedAt,
          preferences: typedUserDetails.preferences,
          totalOrders,
          totalSpent,
        });

        setOrders(userOrders);
        setError(null);
      } catch (error) {
        console.error("Error fetching user data:", error);

        // If API fails, use localStorage data as fallback
        if (user) {
          console.log('Using localStorage user data as fallback');
          setUserData({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt.toString(),
            updatedAt: user.updatedAt.toString(),
            preferences: {
              ...user.preferences,
              budget: Number(user.preferences?.budget) || 0,
            },
            totalOrders: 0,
            totalSpent: 0,
          });
          setOrders([]);
          setError("Could not load latest data, showing cached information");
        } else {
          setError("Failed to load user data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, authLoading]);

  // Show loading while auth is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="animate-pulse">
              <div className="flex items-center space-x-6">
                <div className="h-24 w-24 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-64 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to view your profile</p>
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-viridian-600 hover:bg-viridian-700"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-x-4">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-viridian-600 hover:bg-viridian-700"
              >
                Go Home
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error message banner if there's a non-critical error */}
        {error && userData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header del perfil */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 bg-viridian-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-12 w-12 text-viridian-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {userData?.name || user.name}
                  </h1>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(userData?.role || user.role)}`}>
                    {getRoleText(userData?.role || user.role)}
                  </span>
                </div>
                <p className="text-gray-600">{userData?.email || user.email}</p>
                <p className="text-sm text-gray-500">
                  Member since {formatJoinDate(userData?.createdAt || user.createdAt.toString())}
                </p>
              </div>
            </div>

            {/* Stats and Logout Section */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="grid grid-cols-1 gap-2">
                  <div className="bg-viridian-50 px-4 py-2 rounded-lg">
                    <p className="text-sm text-gray-600">Total spent</p>
                    <p className="text-xl font-bold text-viridian-600">
                      {formatCurrency(userData?.totalSpent || 0)}
                    </p>
                  </div>
                  <div className="bg-gray-50 px-4 py-2 rounded-lg">
                    <p className="text-sm text-gray-600">Orders placed</p>
                    <p className="text-xl font-bold text-gray-900">
                      {userData?.totalOrders || 0}
                    </p>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>

        {/* Navegación de pestañas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("info")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "info"
                  ? "border-viridian-500 text-viridian-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <UserIcon className="h-5 w-5 inline-block mr-2" />
                Personal Information
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "orders"
                  ? "border-viridian-500 text-viridian-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <ShoppingBagIcon className="h-5 w-5 inline-block mr-2" />
                My Orders ({userData?.totalOrders || 0})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "info" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {userData?.name || user.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {userData?.email || user.email}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Account Role
                      </label>
                      <p className={`mt-1 text-sm px-3 py-2 rounded-md border ${getRoleColor(userData?.role || user.role)}`}>
                        {getRoleText(userData?.role || user.role)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Account Status
                      </label>
                      <p className="mt-1 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md flex items-center">
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                        Active
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Registration Date
                      </label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {formatDate(userData?.createdAt || user.createdAt.toString())}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Last Updated
                      </label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {formatDate(userData?.updatedAt || user.updatedAt.toString())}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preferences Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    User Preferences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Budget Preference
                      </label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {(userData?.preferences?.budget || user.preferences?.budget) && Number(userData?.preferences?.budget || user.preferences?.budget) > 0
                          ? formatCurrency(Number(userData?.preferences?.budget || user.preferences?.budget))
                          : "Not specified"
                        }
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Usage Preference
                      </label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {userData?.preferences?.usage || user.preferences?.usage || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Order History
                  </h3>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">
                              Order #{order.id}
                            </h4>
                            <div className="flex items-center space-x-4 mt-1">
                              <p className="text-sm text-gray-600 flex items-center">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                {formatDate(order.createdAt || "")}
                              </p>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getStatusText(order.status)}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              {formatCurrency(order.total)}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="text-sm font-medium text-gray-900 mb-2">
                                Products
                              </h5>
                              <div className="space-y-2">
                                {order.products.map((product, index) => (
                                  <div
                                    key={index}
                                    className="text-sm text-gray-600"
                                  >
                                    <span>Product ID: {product.productID}</span>
                                    <span className="mx-2">•</span>
                                    <span>Quantity: {product.quantity}</span>
                                    <span className="mx-2">•</span>
                                    <span>{formatCurrency(product.price)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h5 className="text-sm font-medium text-gray-900 mb-2">
                                Shipping Address
                              </h5>
                              <div className="text-sm text-gray-600">
                                <p>{order.shipping.address}</p>
                                <p>
                                  {order.shipping.city}, {order.shipping.state}
                                </p>
                                <p>{order.shipping.zipcode}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <Link
                            href={`/order/${order.id}`}
                            className="text-viridian-600 hover:text-viridian-700 text-sm font-medium"
                          >
                            View order details →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {orders.length === 0 && (
                  <div className="text-center py-12">
                    <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No orders yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Explore our catalog and make your first purchase!
                    </p>
                    <Link
                      href="/catalog"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-viridian-600 hover:bg-viridian-700"
                    >
                      Go to catalog
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <div className="w-full flex flex-col items-end space-y-2">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-fit inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging out...
              </>
            ) : (
              <>
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                Sign Out
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}