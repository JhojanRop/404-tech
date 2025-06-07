import React from 'react';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Ventas Totales',
      value: '$45,230',
      change: '+12%',
      icon: DollarSign,
      trend: 'up'
    },
    {
      title: 'Productos',
      value: '234',
      change: '+5%',
      icon: Package,
      trend: 'up'
    },
    {
      title: 'Pedidos',
      value: '89',
      change: '+18%',
      icon: ShoppingCart,
      trend: 'up'
    },
    {
      title: 'Usuarios',
      value: '1,245',
      change: '+8%',
      icon: Users,
      trend: 'up'
    }
  ];

  const recentOrders = [
    { id: '#001', customer: 'Juan Pérez', product: 'iPhone 14', amount: '$999', status: 'Completado' },
    { id: '#002', customer: 'María García', product: 'MacBook Pro', amount: '$1,999', status: 'Pendiente' },
    { id: '#003', customer: 'Carlos López', product: 'AirPods Pro', amount: '$249', status: 'Enviado' },
    { id: '#004', customer: 'Ana Martínez', product: 'iPad Air', amount: '$599', status: 'Completado' },
  ];

  const topProducts = [
    { name: 'iPhone 14 Pro', sales: 45, revenue: '$44,550' },
    { name: 'MacBook Air M2', sales: 32, revenue: '$38,400' },
    { name: 'AirPods Pro', sales: 67, revenue: '$16,675' },
    { name: 'Apple Watch Series 8', sales: 28, revenue: '$11,200' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">¡Bienvenido de vuelta!</h1>
            <p className="text-green-100">Aquí tienes un resumen de tu tienda hoy</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <Activity className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-500 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Pedidos Recientes</h2>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                Ver todos
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.product}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{order.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'Completado' ? 'bg-green-100 text-green-700' :
                      order.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Productos Más Vendidos</h2>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} ventas</p>
                    </div>
                  </div>
                  <p className="font-semibold text-green-600">{product.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all group">
            <Package className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Agregar Producto</p>
              <p className="text-sm text-gray-500">Añadir nuevo producto al inventario</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all group">
            <Eye className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Ver Pedidos</p>
              <p className="text-sm text-gray-500">Gestionar pedidos pendientes</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all group">
            <Users className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Gestionar Usuarios</p>
              <p className="text-sm text-gray-500">Ver y editar usuarios</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;