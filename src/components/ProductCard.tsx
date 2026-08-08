import React, { useState } from 'react';
import { Product, Currency } from '../types';
import { CURRENCY_RATES } from '../data/mockData';
import { Heart, Eye, ShoppingBag, Scissors, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onQuickView: (p: Product) => void;
  onAddToCart: (p: Product, size: string, color: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const selectedSize = product.sizes[0] || 'Standard';

  // Convert price from USD to active currency rate
  const rateObj = CURRENCY_RATES[currency] || { code: 'ETB' as any, symbol: 'ETB ', rateToUSD: 1 };
  const convertedPrice = Math.round(product.priceUSD * rateObj.rateToUSD);
  const originalPriceConverted = product.originalPriceUSD 
    ? Math.round(product.originalPriceUSD * rateObj.rateToUSD) 
    : null;

  const hasDiscount = Boolean(originalPriceConverted && originalPriceConverted > convertedPrice);
  const discountPercent = hasDiscount && originalPriceConverted ? Math.round(((originalPriceConverted - convertedPrice) / originalPriceConverted) * 100) : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize, product.colors[0] || 'Original');
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div 
      onClick={() => onQuickView(product)}
      className="group cursor-pointer bg-white rounded-2xl border border-[#E6D9C0] hover:border-[#D4AF37] shadow-xs hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden relative"
    >
      
      {/* Top Floating Badges */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {hasDiscount && (
            <span className="bg-[#8B0000] text-[#FFD700] text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-[#D4AF37]/40 shadow-md animate-pulse">
              {discountPercent}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-[#1F1510] text-[#E5D3AC] text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-[#D4AF37]/40 shadow-md">
              Imperial Edition
            </span>
          )}
          {product.isNewArrival && !product.isFeatured && (
            <span className="bg-[#8B0000] text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-md">
              New Atelier
            </span>
          )}
          {product.isBespokeAvailable && (
            <span className="bg-[#FAF0D7] text-[#5C3A10] border border-[#E5D3AC] text-[10px] font-serif font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Scissors className="w-3 h-3 text-[#8B0000]" />
              <span>Bespoke Fit</span>
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`p-2 rounded-full backdrop-blur-md transition-all pointer-events-auto shadow-md ${
            isWishlisted 
              ? 'bg-[#8B0000] text-white' 
              : 'bg-white/80 text-[#1F1510] hover:text-[#8B0000] hover:bg-white'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Product Image Frame with Hover Secondary Preview */}
      <div className="relative aspect-[1/0.92] sm:aspect-square bg-[#F7F3E9] overflow-hidden">
        <img
          src={product.images[activeImageIndex] || product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
          onMouseEnter={() => {
            if (product.images.length > 1) setActiveImageIndex(1);
          }}
          onMouseLeave={() => setActiveImageIndex(0)}
        />

        {/* Hover Quick Action Layer */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-2 bg-[#1F1510]/90 backdrop-blur-md text-[#E5D3AC] hover:bg-[#8B0000] hover:text-white transition font-serif text-[10px] font-semibold uppercase tracking-wider rounded-full flex items-center justify-center gap-1.5 shadow-lg border border-[#D4AF37]/30"
          >
            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Details</span>
          </button>
        </div>
      </div>

      {/* Product Info Section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5 bg-white">
        
        <div>
          {/* Amharic Title & Category */}
          <div className="flex items-center justify-between text-xs text-[#7A6952]">
            {product.amharicName ? (
              <span className="font-serif italic text-amber-900/90 font-bold">{product.amharicName}</span>
            ) : (
              <span className="text-[10px] tracking-wide font-medium uppercase text-gray-500">{product.category}</span>
            )}
          </div>

          {/* Product Main Title */}
          <h3 className="font-serif text-base font-bold text-[#1F1510] group-hover:text-[#8B0000] transition-colors line-clamp-1 mt-1">
            {product.name}
          </h3>

          {/* Stock Status Badge */}
          <div className="flex items-center justify-between mt-1">
            {/* Stock Status Indicator */}
            {product.inStock && product.stockQuantity > 0 ? (
              <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                In Stock ({product.stockQuantity})
              </span>
            ) : (
              <span className="inline-block text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Price & Add to Bag Row */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-lg font-bold text-[#1F1510]">
                {rateObj.symbol}{convertedPrice.toLocaleString()}
              </span>
              {originalPriceConverted && (
                <span className="text-xs text-[#9E8E7C] line-through">
                  {rateObj.symbol}{originalPriceConverted.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock || product.stockQuantity <= 0}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm ${
              !product.inStock || product.stockQuantity <= 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : addedAnimation 
                  ? 'bg-emerald-700 text-white' 
                  : 'bg-[#1F1510] text-[#E5D3AC] hover:bg-[#8B0000] hover:text-white'
            }`}
          >
            {!product.inStock || product.stockQuantity <= 0 ? (
              <span>Out of Stock</span>
            ) : addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};

