import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Minus, Plus, Heart, Share2, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartContext } from '../App';

// Mock product data - in a real app, this would come from an API
const productData = {
  id: 'eid-1',
  name: 'GEOMETRIC LED STAR LIGHT',
  price: 79.99,
  description: 'Transform your space with this stunning geometric LED star light. Perfect for creating a magical atmosphere during Ramadan and Eid celebrations. The intricate patterns cast beautiful shadows, while the energy-efficient LED provides a warm, welcoming glow.',
  images: [
    'https://images.unsplash.com/photo-1564507592333-c60657eea523',
    'https://images.unsplash.com/photo-1577127294256-5f0e3c3e8d8c',
    'https://images.unsplash.com/photo-1576158674803-56f6be5662eb',
    'https://images.unsplash.com/photo-1632923057155-dd35366509c6'
  ],
  details: [
    {
      title: 'Product Details',
      content: 'Handcrafted from premium materials, this LED star light features adjustable brightness settings and a timer function. The geometric design is inspired by traditional Islamic patterns, making it a perfect blend of modern technology and cultural artistry.'
    },
    {
      title: 'Dimensions & Specifications',
      content: 'Size: 12" x 12" x 12"\nMaterial: Brass-plated steel and acrylic\nPower: LED, 5W\nComes with remote control\nBattery backup available'
    },
    {
      title: 'Care Instructions',
      content: 'Dust with a soft, dry cloth. Avoid using harsh cleaning agents. Keep away from direct sunlight when not in use. Store in the original packaging to prevent damage.'
    }
  ]
};

const ProductPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { openCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart({
      id: productData.id,
      name: productData.name,
      price: productData.price,
      image: productData.images[0]
    });
    openCart();
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="pt-24 pb-16 bg-gradient-to-br from-[#fdfbf6] via-white to-[#fdfbf6] 
      dark:from-dark dark:via-dark-lighter dark:to-dark min-h-screen transition-colors duration-300">
      {/* Decorative elements */}
      <div className="absolute inset-0 dark:bg-[radial-gradient(circle_at_top_right,_rgba(234,179,8,0.15),transparent_70%),radial-gradient(circle_at_bottom_left,_rgba(234,179,8,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-yellow-500/5 dark:via-transparent dark:to-yellow-500/5 dark:animate-shimmer pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden bg-white dark:bg-dark-lighter rounded-2xl
              shadow-lg dark:shadow-yellow-500/10 border border-neutral-100 dark:border-yellow-500/20
              group hover:shadow-xl dark:hover:shadow-yellow-500/20 transition-all duration-300">
              <img
                src={productData.images[selectedImage]}
                alt={productData.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnail Grid */}
            <div className="grid grid-cols-5 gap-2">
              {productData.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg transition-all duration-300 ${
                    selectedImage === index
                      ? 'ring-2 ring-yellow-500 dark:ring-yellow-500'
                      : 'ring-1 ring-neutral-200 dark:ring-yellow-500/20 hover:ring-yellow-500/50 dark:hover:ring-yellow-500/50'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Product view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:pl-8 relative">
            {/* Glowing background effect for dark mode */}
            <div className="absolute -inset-4 dark:bg-yellow-500/5 dark:blur-xl opacity-0 group-hover:opacity-100 
              transition-opacity duration-500 pointer-events-none" />
            
            <div className="sticky top-24">
              {/* Product Title and Price */}
              <h1 className="text-3xl font-light mb-4 text-neutral-900 dark:text-white/90">{productData.name}</h1>
              <p className="text-2xl mb-6 text-yellow-600 dark:text-yellow-500">${productData.price}</p>

              {/* Description */}
              <p className="text-neutral-600 dark:text-neutral-400 mb-8">{productData.description}</p>

              {/* Quantity Selector */}
              <div className="flex items-center mb-8">
                <span className="mr-4 text-neutral-600 dark:text-neutral-400">Quantity</span>
                <div className="flex items-center border border-neutral-200 dark:border-yellow-500/20 rounded-full
                  bg-white dark:bg-dark-lighter">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-dark-light rounded-l-full
                      text-neutral-600 dark:text-neutral-400"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-neutral-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-dark-light rounded-r-full
                      text-neutral-600 dark:text-neutral-400"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart and Wishlist */}
              <div className="flex gap-4 mb-12">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-yellow-500 text-white py-4 rounded-full hover:bg-yellow-400 
                    transition-all duration-300 transform hover:scale-[1.02] relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                    translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  <span className="relative z-10">
                  Add to Cart
                  </span>
                </button>
                <button className="p-4 border border-neutral-200 dark:border-yellow-500/20 rounded-full 
                  hover:bg-neutral-50 dark:hover:bg-dark-light transition-colors
                  text-neutral-600 dark:text-neutral-400">
                  <Heart className="w-6 h-6" />
                </button>
                <button className="p-4 border border-neutral-200 dark:border-yellow-500/20 rounded-full 
                  hover:bg-neutral-50 dark:hover:bg-dark-light transition-colors
                  text-neutral-600 dark:text-neutral-400">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              {/* Accordion Sections */}
              <div className="border-t border-neutral-200 dark:border-yellow-500/20">
                {productData.details.map((section) => (
                  <div key={section.title} className="border-b border-neutral-200 dark:border-yellow-500/20">
                    <button
                      onClick={() =>
                        setOpenSection(
                          openSection === section.title ? null : section.title
                        )
                      }
                      className="w-full py-4 flex items-center justify-between text-left group"
                    >
                      <span className="font-medium text-neutral-900 dark:text-white/90 
                        group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors">
                        {section.title}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          openSection === section.title ? 'rotate-180' : ''
                        } text-neutral-400 dark:text-neutral-500 group-hover:text-yellow-500`}
                      />
                    </button>
                    {openSection === section.title && (
                      <div className="pb-4 text-neutral-600 dark:text-neutral-400 whitespace-pre-line">
                        {section.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage