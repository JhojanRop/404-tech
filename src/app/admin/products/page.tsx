'use client';
import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Star,
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import EditProductModal from '@/components/editproductmodal';

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'iPhone 14 Pro',
      category: ['Smartphones'],
      price: 999,
      stock: 25,
      sales: 145,
      rating: 4.8,
      status: 'active',
      image: '/api/placeholder/60/60',
      description: 'El iPhone 14 Pro cuenta con el revolucionario chip A16 Bionic y un sistema de cámaras pro avanzado.',
      discount: 0,
      images: ['/api/placeholder/60/60'],
      specs: [
        { key: 'Pantalla', value: '6.1 pulgadas Super Retina XDR' },
        { key: 'Procesador', value: 'A16 Bionic' },
        { key: 'Cámara', value: '48MP Principal + 12MP Ultra Wide' }
      ],
      usage: 'Fotografía profesional, gaming, productividad'
    },
    {
      id: 2,
      name: 'MacBook Air M2',
      category: ['Laptops'],
      price: 1199,
      stock: 12,
      sales: 89,
      rating: 4.9,
      status: 'active',
      image: '/api/placeholder/60/60',
      description: 'MacBook Air con chip M2, diseño ultraligero y potencia increíble para el trabajo y entretenimiento.',
      discount: 10,
      images: ['/api/placeholder/60/60'],
      specs: [
        { key: 'Procesador', value: 'Apple M2' },
        { key: 'Memoria RAM', value: '8GB' },
        { key: 'Almacenamiento', value: '256GB SSD' },
        { key: 'Pantalla', value: '13.6 pulgadas Liquid Retina' }
      ],
      usage: 'Trabajo, diseño, programación'
    },
    {
      id: 3,
      name: 'AirPods Pro',
      category: ['Audio'],
      price: 249,
      stock: 0,
      sales: 234,
      rating: 4.7,
      status: 'out_of_stock',
      image: '/api/placeholder/60/60',
      description: 'AirPods Pro con cancelación activa de ruido y audio espacial personalizado.',
      discount: 5,
      images: ['/api/placeholder/60/60'],
      specs: [
        { key: 'Cancelación de ruido', value: 'Activa' },
        { key: 'Batería', value: 'Hasta 6 horas' },
        { key: 'Resistencia', value: 'IPX4' }
      ],
      usage: 'Música, llamadas, ejercicio'
    },
    {
      id: 4,
      name: 'iPad Air',
      category: ['Tablets'],
      price: 599,
      stock: 8,
      sales: 67,
      rating: 4.6,
      status: 'low_stock',
      image: '/api/placeholder/60/60',
      description: 'iPad Air con chip M1, compatible con Apple Pencil y Magic Keyboard.',
      discount: 0,
      images: ['/api/placeholder/60/60'],
      specs: [
        { key: 'Procesador', value: 'Apple M1' },
        { key: 'Pantalla', value: '10.9 pulgadas Liquid Retina' },
        { key: 'Almacenamiento', value: '64GB' }
      ],
      usage: 'Creatividad, productividad, entretenimiento'
    },
    {
      id: 5,
      name: 'Apple Watch Series 8',
      category: ['Wearables'],
      price: 399,
      stock: 18,
      sales: 156,
      rating: 4.5,
      status: 'active',
      image: '/api/placeholder/60/60',
      description: 'Apple Watch Series 8 con sensor de temperatura y detección de accidentes.',
      discount: 15,
      images: ['/api/placeholder/60/60'],
      specs: [
        { key: 'Pantalla', value: 'Always-On Retina' },
        { key: 'Resistencia', value: 'WR50' },
        { key: 'Sensores', value: 'Temperatura, ECG, SpO2' }
      ],
      usage: 'Fitness, salud, notificaciones'
    }
  ]);

  const categories = ['all', 'Smartphones', 'Laptops', 'Audio', 'Tablets', 'Wearables'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'out_of_stock': return 'bg-red-100 text-red-700';
      case 'low_stock': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'out_of_stock': return 'Sin Stock';
      case 'low_stock': return 'Stock Bajo';
      default: return 'Desconocido';
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleSaveProduct = async (productId, updatedData) => {
    try {
      // Actualizar el producto en el estado local
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === productId
            ? {
              ...product,
              ...updatedData,
              // Actualizar el status basado en el stock
              status: updatedData.stock === 0 ? 'out_of_stock' :
                updatedData.stock < 10 ? 'low_stock' : 'active'
            }
            : product
        )
      );

      console.log('Producto actualizado exitosamente:', updatedData);

      // Aquí podrías hacer una llamada a la API para guardar en el servidor
      // await updateProduct(productId, updatedData);

    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      // Aquí podrías mostrar una notificación de error
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' ||
      (Array.isArray(product.category)
        ? product.category.includes(selectedCategory)
        : product.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Productos</h1>
            <p className="text-green-100">Administra tu inventario y catálogo de productos</p>
          </div>
          <button className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{products.length}</h3>
          <p className="text-gray-500 text-sm">Total Productos</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">691</h3>
          <p className="text-gray-500 text-sm">Ventas Totales</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">2</h3>
          <p className="text-gray-500 text-sm">Stock Bajo</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">$3,445</h3>
          <p className="text-gray-500 text-sm">Valor Inventario</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Todas las categorías' : category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Producto</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Categoría</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Precio</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Stock</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Ventas</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Rating</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Estado</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {Array.isArray(product.category) ? product.category[0] : product.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-lg font-semibold text-gray-900">${product.price}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-medium ${product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-yellow-600' : 'text-gray-900'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900">{product.sales}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-gray-900">{product.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {getStatusText(product.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando {filteredProducts.length} de {products.length} productos
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              Anterior
            </button>
            <button className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg">
              1
            </button>
            <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              2
            </button>
            <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product={selectedProduct}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

export default ProductsPage;