'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, Star, ShoppingCart, Heart } from 'lucide-react';
import { getStoredToken, getStoredUser } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface FormData {
  usage: string;
  budget: string;
  experience: string;
  priority: string;
  portability: string;
  gaming: string;
  software: string[];
}

interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  specs: string[];
  rating: number;
  matchPercentage: number;
  whyRecommended: string[];
}

const mockRecommendations: RecommendedProduct[] = [
  {
    id: '1',
    name: 'MSI GeForce RTX 4060 Gaming Laptop',
    price: 959.99,
    originalPrice: 1199.99,
    image: '/api/placeholder/300/200',
    specs: ['Intel Core i5-12450H', '16GB RAM', 'RTX 4060', '512GB SSD'],
    rating: 4.7,
    matchPercentage: 95,
    whyRecommended: [
      'Perfecto para gaming y trabajo',
      'Excelente relación precio-rendimiento',
      'Portátil y potente'
    ]
  },
  {
    id: '2',
    name: 'iBUYPOWER Slate 9 Gaming Desktop',
    price: 1799.99,
    originalPrice: 2199.99,
    image: '/api/placeholder/300/200',
    specs: ['AMD Ryzen 7', '32GB RAM', 'RTX 4070', '1TB NVMe SSD'],
    rating: 4.8,
    matchPercentage: 88,
    whyRecommended: [
      'Alto rendimiento para gaming',
      'Fácil actualización futura',
      'RGB personalizable'
    ]
  }
];

const API_BASE = 'http://localhost:3000';
// const token = 'your_jwt_token_here'; // Reemplaza por el token real

export default function RecommendationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    usage: '',
    budget: '',
    experience: '',
    priority: '',
    portability: '',
    gaming: '',
    software: []
  });
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
  const router = useRouter();
  const { dispatch } = useCart();

  const totalSteps = 7;

  async function fetchRecommendations() {
    setLoading(true);
    setError(null);
    try {
      const token = getStoredToken();
      const user = getStoredUser();
      if (!token || !user?.id) {
        throw new Error("Usuario no autenticado. Por favor inicia sesión.");
      }
      const response = await fetch(`${API_BASE}/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: user.id,
          ...formData
        })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Error al obtener recomendaciones');
      }
      const data = await response.json();
      setRecommendations(data.products || []);
      setShowResults(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      fetchRecommendations();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOptionSelect = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelect = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: Array.isArray(prev[field])
        ? (prev[field] as string[]).includes(value)
          ? (prev[field] as string[]).filter(item => item !== value)
          : [...(prev[field] as string[]), value]
        : [value]
    }));
  };

  const resetForm = () => {
    setCurrentStep(1);
    setShowResults(false);
    setFormData({
      usage: '',
      budget: '',
      experience: '',
      priority: '',
      portability: '',
      gaming: '',
      software: []
    });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return !!formData.usage;
      case 2: return !!formData.budget;
      case 3: return !!formData.experience;
      case 4: return !!formData.priority;
      case 5: return !!formData.portability;
      case 6: return !!formData.gaming;
      case 7: return formData.software.length > 0;
      default: return false;
    }
  };

  if (showResults) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🎯 Tus Recomendaciones Personalizadas
            </h1>
            <p className="text-gray-600 text-lg">
              Basado en tus respuestas, hemos encontrado las mejores opciones para ti
            </p>
          </div>

          <div className="grid gap-8 mb-8">
            {(recommendations.length > 0 ? recommendations : mockRecommendations).map((product, index) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg border p-6">
                <div className="flex flex-col lg:flex-row items-start gap-6">
                  <div className="relative cursor-pointer" onClick={() => router.push(`/product/${product.id}`)}>
                    <span className="absolute -top-2 -left-2 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <img
                      src={product.images ? product.images[0] : product.image}
                      alt={product.name}
                      className="w-48 h-36 object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3
                          className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:underline"
                          onClick={() => router.push(`/product/${product.id}`)}
                        >
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="ml-1 text-sm text-gray-600">({product.rating})</span>
                          </div>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                            {product.matchPercentage}% Match
                          </span>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Heart className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Especificaciones:</h4>
                        <ul className="space-y-1">
                          {Array.isArray(product.specs)
                            ? product.specs.map((spec, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                                {spec}
                              </li>
                            ))
                            : product.specs && typeof product.specs === 'object'
                              ? Object.entries(product.specs).map(([key, value], idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-center">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                                  {key}{value ? `: ${value}` : ''}
                                </li>
                              ))
                              : null}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">¿Por qué lo recomendamos?</h4>
                        <ul className="space-y-1">
                          {product.whyRecommended.map((reason, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-center">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t gap-4">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-lg text-gray-500 line-through ml-2">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                        onClick={() => dispatch({ type: "ADD_TO_CART", product: { ...product, images: product.images || [product.image] } })}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Agregar al Carrito
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={resetForm}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Hacer Nueva Consulta
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="text-lg font-semibold text-gray-700 mb-4">Generando recomendaciones...</span>
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="text-lg font-semibold text-red-600 mb-4">{error}</span>
        <button
          onClick={resetForm}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Volver a intentar
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Sistema de Recomendación Personalizada
          </h1>
          <p className="text-gray-600">
            Responde algunas preguntas para encontrar el computador perfecto para ti
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Paso {currentStep} de {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% completado</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Steps */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                ¿Para qué vas a usar principalmente tu computador?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'gaming', label: '🎮 Gaming y entretenimiento', desc: 'Juegos, streaming, multimedia' },
                  { value: 'work', label: '💼 Trabajo y productividad', desc: 'Oficina, programación, diseño' },
                  { value: 'study', label: '📚 Estudios', desc: 'Investigación, tareas, proyectos' },
                  { value: 'mixed', label: '🔄 Uso mixto', desc: 'Combinación de trabajo y entretenimiento' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect('usage', option.value)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${formData.usage === option.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                ¿Cuál es tu presupuesto aproximado?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'low', label: '💰 Económico', desc: 'Hasta $500 USD' },
                  { value: 'medium', label: '💳 Intermedio', desc: '$500 - $1,200 USD' },
                  { value: 'high', label: '💎 Premium', desc: '$1,200 - $2,500 USD' },
                  { value: 'unlimited', label: '🚀 Sin límite', desc: 'Más de $2,500 USD' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect('budget', option.value)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${formData.budget === option.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                ¿Cuál es tu nivel de experiencia con computadores?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'beginner', label: '🌱 Principiante', desc: 'Uso básico, necesito algo simple' },
                  { value: 'intermediate', label: '🔧 Intermedio', desc: 'Conozco lo básico, puedo aprender' },
                  { value: 'advanced', label: '⚡ Avanzado', desc: 'Experto, busco especificaciones técnicas' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect('experience', option.value)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${formData.experience === option.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                ¿Qué es más importante para ti?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'performance', label: '🚀 Rendimiento', desc: 'Velocidad y potencia máxima' },
                  { value: 'price', label: '💰 Precio', desc: 'La mejor relación calidad-precio' },
                  { value: 'design', label: '🎨 Diseño', desc: 'Apariencia y estética' },
                  { value: 'reliability', label: '🛡️ Confiabilidad', desc: 'Durabilidad y estabilidad' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect('priority', option.value)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${formData.priority === option.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                ¿Necesitas que sea portátil?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'desktop', label: '🖥️ Desktop', desc: 'Solo para usar en casa/oficina' },
                  { value: 'laptop', label: '💻 Laptop', desc: 'Necesito llevarlo a diferentes lugares' },
                  { value: 'either', label: '🤔 Cualquiera', desc: 'Me adapto a ambas opciones' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect('portability', option.value)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${formData.portability === option.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                ¿Qué tan importante es el gaming para ti?
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'not-important', label: '❌ No me interesa', desc: 'No juego videojuegos' },
                  { value: 'casual', label: '🎲 Casual', desc: 'Juegos simples ocasionalmente' },
                  { value: 'regular', label: '🎮 Regular', desc: 'Juego con frecuencia, varios géneros' },
                  { value: 'hardcore', label: '🔥 Hardcore', desc: 'Gaming es mi prioridad principal' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect('gaming', option.value)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${formData.gaming === option.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                ¿Qué software planeas usar? (Selecciona todos los que apliquen)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: 'office', label: '📄 Office/Documentos' },
                  { value: 'design', label: '🎨 Diseño Gráfico' },
                  { value: 'video', label: '🎬 Edición de Video' },
                  { value: 'programming', label: '💻 Programación' },
                  { value: '3d', label: '🧊 Modelado 3D' },
                  { value: 'streaming', label: '📺 Streaming' },
                  { value: 'music', label: '🎵 Producción Musical' },
                  { value: 'web', label: '🌐 Navegación Web' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleMultiSelect('software', option.value)}
                    className={`text-left p-3 rounded-lg border-2 transition-colors ${formData.software.includes(option.value)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="font-semibold text-sm">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-500 hover:bg-gray-600 text-white'
                }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${!isStepValid()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
            >
              {currentStep === totalSteps ? 'Ver Recomendaciones' : 'Siguiente'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${i + 1 <= currentStep ? 'bg-green-500' : 'bg-gray-300'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}