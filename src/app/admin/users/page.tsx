// app/admin/users/page.js
'use client';

import { useState } from 'react';
import { Search, Filter, Eye, Users, UserPlus, Crown, Shield, User, Calendar, Mail, MapPin } from 'lucide-react';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Datos de ejemplo - reemplaza con datos reales
  const users = [
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      role: 'customer',
      status: 'active',
      avatar: null,
      orders: 12,
      totalSpent: '$2,450.00',
      location: 'Medellín, Colombia',
      joinDate: '2024-01-15',
      lastLogin: '2024-06-07'
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria.garcia@email.com',
      role: 'admin',
      status: 'active',
      avatar: null,
      orders: 0,
      totalSpent: '$0.00',
      location: 'Bogotá, Colombia',
      joinDate: '2023-08-20',
      lastLogin: '2024-06-07'
    },
    {
      id: 3,
      name: 'Carlos López',
      email: 'carlos.lopez@email.com',
      role: 'customer',
      status: 'active',
      avatar: null,
      orders: 8,
      totalSpent: '$1,890.00',
      location: 'Cali, Colombia',
      joinDate: '2024-03-10',
      lastLogin: '2024-06-06'
    },
    {
      id: 4,
      name: 'Ana Rodríguez',
      email: 'ana.rodriguez@email.com',
      role: 'moderator',
      status: 'inactive',
      avatar: null,
      orders: 5,
      totalSpent: '$750.00',
      location: 'Barranquilla, Colombia',
      joinDate: '2024-02-28',
      lastLogin: '2024-05-20'
    },
    {
      id: 5,
      name: 'Luis Martínez',
      email: 'luis.martinez@email.com',
      role: 'customer',
      status: 'active',
      avatar: null,
      orders: 25,
      totalSpent: '$4,200.00',
      location: 'Medellín, Colombia',
      joinDate: '2023-11-05',
      lastLogin: '2024-06-07'
    }
  ];

  const getRoleIcon = (role) => {
    const icons = {
      admin: <Crown className="w-4 h-4" />,
      moderator: <Shield className="w-4 h-4" />,
      customer: <User className="w-4 h-4" />
    };
    return icons[role];
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800 border-purple-200',
      moderator: 'bg-blue-100 text-blue-800 border-blue-200',
      customer: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[role];
  };

  const getRoleText = (role) => {
    const texts = {
      admin: 'Administrador',
      moderator: 'Moderador',
      customer: 'Cliente'
    };
    return texts[role];
  };

  const getStatusColor = (status) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status) => {
    return status === 'active' ? 'Activo' : 'Inactivo';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra y supervisa todos los usuarios de la plataforma</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">2,847</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nuevos (Este mes)</p>
                <p className="text-2xl font-bold text-green-600">184</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserPlus className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Administradores</p>
                <p className="text-2xl font-bold text-purple-600">8</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activos Hoy</p>
                <p className="text-2xl font-bold text-blue-600">1,203</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o ubicación..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white min-w-[160px]"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Todos los roles</option>
                <option value="admin">Administradores</option>
                <option value="moderator">Moderadores</option>
                <option value="customer">Clientes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              {/* User Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-700 font-semibold text-sm">
                      {getInitials(user.name)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                    {getRoleText(user.role)}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                    {getStatusText(user.status)}
                  </span>
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Miembro desde {new Date(user.joinDate).toLocaleDateString('es-ES')}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>Último acceso: {new Date(user.lastLogin).toLocaleDateString('es-ES')}</span>
                </div>
              </div>

              {/* User Stats */}
              {user.role === 'customer' && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-lg font-semibold text-gray-900">{user.orders}</p>
                    <p className="text-xs text-gray-500">Pedidos</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-lg font-semibold text-green-600">{user.totalSpent}</p>
                    <p className="text-xs text-gray-500">Total Gastado</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-gray-100">
                <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-green-700 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                  Ver Perfil Completo
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron usuarios</h3>
            <p className="text-gray-500">Ajusta los filtros de búsqueda para ver más resultados.</p>
          </div>
        )}
      </div>
    </div>
  );
}