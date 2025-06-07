// components/EditProductModal.js
'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Plus, Minus, Save } from 'lucide-react';

export default function EditProductModal({ isOpen, onClose, product, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    category: [],
    description: '',
    price: '',
    discount: '',
    rating: 5,
    stock: '',
    images: [],
    specs: [],
    usage: ''
  });

  const [imageUrls, setImageUrls] = useState(['']);
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);

  const categories = [
    'Gaming & VR',
    'Gaming Desktop PC',
    'Gaming PCs',
    'Computer Systems',
    'Computer Peripherals',
    'Input Device',
    'Monitor'
  ];

  // Cargar datos del producto cuando se abre el modal
  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        name: product.name || '',
        category: product.category || [],
        description: product.description || '',
        price: product.price?.toString().replace('$', '') || '',
        discount: product.discount?.toString() || '',
        rating: product.rating || 5,
        stock: product.stock?.toString() || '',
        images: product.images || [],
        specs: product.specs || [],
        usage: product.usage || ''
      });

      // Configurar URLs de imágenes
      const urls = product.images && product.images.length > 0 ? product.images : [''];
      setImageUrls(urls);

      // Configurar especificaciones
      if (product.specs && product.specs.length > 0) {
        // Si specs es un array de objetos con key/value
        if (typeof product.specs[0] === 'object') {
          setSpecs(product.specs);
        } else {
          // Si specs es un array de strings, convertir a formato key/value
          const specsArray = product.specs.map(spec => {
            const parts = spec.split(':');
            return {
              key: parts[0]?.trim() || '',
              value: parts[1]?.trim() || spec
            };
          });
          setSpecs(specsArray);
        }
      } else {
        setSpecs([{ key: '', value: '' }]);
      }
    }
  }, [isOpen, product]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(cat => cat !== category)
        : [...prev.category, category]
    }));
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrl = (index) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    setFormData(prev => ({
      ...prev,
      images: newUrls.filter(url => url.trim() !== '')
    }));
  };

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
    setFormData(prev => ({
      ...prev,
      images: newUrls.filter(url => url.trim() !== '')
    }));
  };

  const addSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const removeSpec = (index) => {
    const newSpecs = specs.filter((_, i) => i !== index);
    setSpecs(newSpecs);
    setFormData(prev => ({
      ...prev,
      specs: newSpecs.filter(spec => spec.key.trim() !== '' && spec.value.trim() !== '')
    }));
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
    setFormData(prev => ({
      ...prev,
      specs: newSpecs.filter(spec => spec.key.trim() !== '' && spec.value.trim() !== '')
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Preparar datos finales
    const finalData = {
      ...formData,
      price: parseFloat(formData.price),
      discount: formData.discount ? parseInt(formData.discount) : 0,
      stock: parseInt(formData.stock),
      rating: parseInt(formData.rating)
    };

    console.log('Datos actualizados:', finalData);

    // Llamar a la función onSave del componente padre
    if (onSave) {
      await onSave(product.id, finalData);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky z-10 top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Editar Producto</h2>
            <p className="text-gray-600">Modifica la información del producto</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Básica */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descuento (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  value={formData.discount}
                  onChange={(e) => handleInputChange('discount', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating (1-5)
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', parseInt(e.target.value))}
                >
                  <option value={1}>1 Estrella</option>
                  <option value={2}>2 Estrellas</option>
                  <option value={3}>3 Estrellas</option>
                  <option value={4}>4 Estrellas</option>
                  <option value={5}>5 Estrellas</option>
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Uso/Aplicación
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  value={formData.usage}
                  onChange={(e) => handleInputChange('usage', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Categorías */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorías</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    checked={formData.category.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <span className="text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Imágenes */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Imágenes del Producto</h3>
              <button
                type="button"
                onClick={addImageUrl}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            </div>

            <div className="space-y-2">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1 relative">
                    <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="url"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      value={url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                    />
                  </div>
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageUrl(index)}
                      className="px-2 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Especificaciones */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Especificaciones Técnicas</h3>
              <button
                type="button"
                onClick={addSpec}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            </div>

            <div className="space-y-2">
              {specs.map((spec, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Característica"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Valor"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                    />
                    {specs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpec(index)}
                        className="px-2 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 -mx-6 -mb-6 rounded-b-xl">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
              >
                <Save className="w-4 h-4" />
                Guardar Cambios
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}