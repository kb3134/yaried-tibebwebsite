import React from 'react';
import { Upload, Sparkles, Eye, ShoppingBag, Crown, Shield } from 'lucide-react';
import { Product, Currency } from '../types';
import { CURRENCY_RATES } from '../data/mockData';

interface RecentUploadsShowcaseProps {
  products: Product[];
  currency: Currency;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onOpenUploadModal?: () => void;
}

export const RecentUploadsShowcase: React.FC<RecentUploadsShowcaseProps> = ({
  products,
  currency,
  onQuickView,
  onAddToCart,
  onOpenUploadModal,
}) => {
  const rateObj = CURRENCY_RATES[currency];
  const symbol = rateObj?.symbol || 'ETB';
  const rateToUSD = rateObj?.rateToUSD || 120;
  // Filter exclusively for Live Showcase products
  const liveshowProducts = products.filter(p => {
    const isStudio = Boolean(p.studioCategory && p.studioCategory.trim() !== '') || 
                     (p.collections && p.collections.includes('studio')) ||
                     p.category === 'studio';
    const isLiveshow = Boolean(p.collections && p.collections.includes('liveshow'));
    return isLiveshow && !isStudio;
  });
  const recentProducts = liveshowProducts.slice(0, 4);

  if (recentProducts.length === 0) return null;

  return (
    <section className="relative py-12 bg-gradient-to-b from-[#181310] via-[#211B17] to-[#181310] border-y border-[#D4AF37]/20 text-white overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#D4AF37] text-[#181310] text-[10px] font-bold uppercase tracking-widest rounded-md font-serif">
                LIVE HOME SHOWCASE
              </span>
              <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5D77F]">
              Featured Atelier & Collection Masterpieces
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/80 font-sans max-w-2xl">
              Freshly crafted Habesha Kemis, Men's Kuta suits, and bespoke bridal ensembles added directly from the Yared Tibeb Atelier.
            </p>
          </div>
        </div>

        {/* Uploaded Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentProducts.map((p) => {
            const displayImg = p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1000';
            return (
              <div
                key={p.id}
                className="group relative bg-[#14100D] rounded-2xl overflow-hidden border border-[#D4AF37]/25 hover:border-[#D4AF37] transition-all duration-300 shadow-xl flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#1A1410]">
                  <img
                    src={displayImg}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md text-[#D4AF37] text-[10px] font-serif font-bold uppercase tracking-wider rounded border border-[#D4AF37]/30">
                    Live Upload
                  </span>
                  {p.isNew && (
                    <span className="px-2 py-0.5 bg-[#8B0000] text-white text-[9px] font-bold uppercase tracking-wider rounded border border-red-500/30">
                      NEW
                    </span>
                  )}
                </div>

                {/* Quick actions overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
                  <button
                    onClick={() => onQuickView(p)}
                    className="p-3 bg-white/90 hover:bg-white text-black rounded-full shadow-lg transition transform hover:scale-110 cursor-pointer"
                    title="Quick View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onAddToCart(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Gold')}
                    className="p-3 bg-[#D4AF37] hover:bg-[#F3C85C] text-[#181310] rounded-full shadow-lg transition transform hover:scale-110 cursor-pointer"
                    title="Add to Bag"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-serif uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
                    {p.amharicName || 'Habesha Kemis'}
                  </p>
                  <h3 className="font-serif font-bold text-sm text-amber-100 line-clamp-1 group-hover:text-[#F5D77F] transition">
                    {p.name}
                  </h3>
                </div>

                <div className="mt-3 pt-3 border-t border-[#D4AF37]/15 flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-[#F5D77F]">
                    {symbol} {Math.round(p.priceUSD * rateToUSD).toLocaleString()}
                  </span>
                  <button
                    onClick={() => onQuickView(p)}
                    className="text-[11px] font-serif font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
                  >
                    <span>View Design</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
};
