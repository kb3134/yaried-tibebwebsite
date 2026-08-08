import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      quote: "The Royal Axumite Zuria Kemis surpassed all my expectations for my sister's wedding in Washington DC. The weight of the Shemma and the sparkle of the gold Tibeb threads are breathtaking. Truly heirloom quality!",
      author: "Bethlehem Tassew",
      purchase: "Verified Purchase: Royal Axumite Zuria Kemis",
      date: "2 weeks ago",
      stars: 5,
    },
    {
      id: 2,
      quote: "Ordering from Yared Tibeb was seamless. The Emperor's Tibeb Suit fit perfectly out of the box. You can feel the decades of artisan craftsmanship in every stitch of the Tilf embroidery.",
      author: "Dr. Yosef Alemu",
      purchase: "Verified Purchase: Emperor's Tibeb Suit & Netela",
      date: "1 month ago",
      stars: 5,
    },
    {
      id: 3,
      quote: "YARED TIBEB brings authentic Habesha luxury to the global stage. The Enkutatash dress felt comfortable yet extremely elegant. Highly recommend!",
      author: "Saba Hailu",
      purchase: "Verified Purchase: Enkutatash Gold Heritage Dress",
      date: "3 weeks ago",
      stars: 5,
    },
  ];

  return (
    <section className="bg-white py-16 lg:py-24 border-t border-b border-[#D4AF37]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <p className="text-xs font-serif uppercase tracking-[0.25em] text-[#C5A028] font-bold">
            GLOBAL CUSTOMER ACCLAIM
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181310]">
            Voices of Heritage
          </h2>
          <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto mt-2" />
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E6D9C0] hover:border-[#D4AF37] rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(item.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="font-serif text-sm text-[#1A1817]/90 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-serif font-bold text-[#1A1817]">{item.author}</h4>
                  <p className="text-[11px] text-[#C5A059] font-sans mt-0.5">{item.purchase}</p>
                </div>
                <span className="text-[10px] text-gray-400 font-sans">{item.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
