import React, { useState, useEffect } from 'react';
import { CityBlog } from '@/data/cities';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Users, 
  CloudSnow, 
  Sun, 
  GraduationCap, 
  Compass, 
  Train, 
  Coins, 
  Utensils, 
  Lightbulb, 
  ChevronLeft, 
  ChevronRight, 
  Building,
  DollarSign,
  Heart
} from 'lucide-react';

interface CityBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: CityBlog | null;
}

export function CityBlogModal({ isOpen, onClose, city }: CityBlogModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'universities' | 'sights' | 'budget' | 'transport'>('overview');

  // Reset active image and tab when city changes
  useEffect(() => {
    setActiveImageIndex(0);
    setActiveTab('overview');
  }, [city]);

  if (!city) return null;

  // Combine cover image and gallery images into a single 4-photo array
  const allImages = [city.coverImage, ...city.galleryImages];

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[95vh] md:max-h-[88vh] overflow-y-auto p-0 rounded-2xl md:rounded-3xl border-none shadow-2xl bg-white focus:outline-none">
        
        {/* Header Hero Section */}
        <div className="relative h-72 sm:h-80 md:h-96 w-full overflow-hidden">
          <img 
            src={allImages[activeImageIndex]} 
            alt={city.name} 
            className="w-full h-full object-cover transition-all duration-700 ease-in-out" 
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
          
          {/* Gallery navigation controls on hero */}
          <div className="absolute inset-x-2 sm:inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10">
            <Button 
              size="icon" 
              variant="secondary" 
              onClick={handlePrevImage}
              className="w-8 h-8 sm:w-10 h-10 rounded-full bg-black/35 hover:bg-black/55 sm:bg-white/20 sm:backdrop-blur-md sm:hover:bg-white/45 border-none text-white pointer-events-auto transition-all shadow-md"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 h-6" />
            </Button>
            <Button 
              size="icon" 
              variant="secondary" 
              onClick={handleNextImage}
              className="w-8 h-8 sm:w-10 h-10 rounded-full bg-black/35 hover:bg-black/55 sm:bg-white/20 sm:backdrop-blur-md sm:hover:bg-white/45 border-none text-white pointer-events-auto transition-all shadow-md"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 h-6" />
            </Button>
          </div>

          {/* Overlay titles */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white z-10">
            <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-2">
              <Badge className="bg-orange-500 hover:bg-orange-600 border-none text-white font-bold tracking-wider uppercase text-[8px] sm:text-[10px] px-2 py-0.5 shadow-sm">
                {city.category}
              </Badge>
              <span className="text-white/60 text-[10px] font-mono">Photo {activeImageIndex + 1} of {allImages.length}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight flex flex-wrap items-baseline gap-1.5">
              <span className="font-semibold">{city.name}</span>
              <span className="font-serif italic text-orange-400 text-base sm:text-xl md:text-2xl">{city.russianName}</span>
            </h2>
            <p className="text-white/85 text-[11px] sm:text-xs md:text-sm mt-1 max-w-2xl font-light leading-relaxed line-clamp-3 sm:line-clamp-none">
              {city.description}
            </p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Area: Navigation Tabs and Content (Col Span 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Horizontal Tabs List */}
            <div className="flex border-b border-neutral-100 overflow-x-auto pb-1 gap-2 scrollbar-none">
              {[
                { id: 'overview', label: 'Overview', icon: Compass },
                { id: 'universities', label: '🎓 Academics', icon: GraduationCap },
                { id: 'sights', label: '🏰 Attractions', icon: MapPin },
                { id: 'budget', label: '💵 Budget & Vibe', icon: Coins },
                { id: 'transport', label: '🚌 Getting Around', icon: Train }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer border ${
                      isActive 
                        ? 'bg-neutral-900 border-neutral-900 text-white shadow-xs' 
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-500 border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content Display */}
            <div className="min-h-[220px] bg-neutral-50/45 p-5 rounded-2xl border border-neutral-100/60">
              
              {/* Tab: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-orange-500" /> City Overview
                  </h4>
                  <p className="text-neutral-600 text-sm leading-relaxed font-light">
                    {city.overview}
                  </p>
                  <div className="border-t border-neutral-100 pt-4 mt-2">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">Primary Academic Focus</span>
                    <p className="text-neutral-700 text-xs font-semibold bg-white p-3 rounded-xl border border-neutral-100 shadow-xs inline-flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-emerald-500" /> {city.stats.bestFor}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab: Universities */}
              {activeTab === 'universities' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-orange-500" /> Top Scholar Universities
                  </h4>
                  <div className="space-y-3">
                    {city.universities.map((uni, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-neutral-100 shadow-2xs space-y-1 hover:border-orange-200 transition-all">
                        <div className="flex justify-between items-start gap-2">
                          <h5 className="font-bold text-xs text-neutral-800 leading-tight">{uni.name}</h5>
                          <Badge variant="outline" className="text-[9px] font-mono border-orange-200 text-orange-600 bg-orange-50/30 shrink-0">
                            {uni.abbreviation}
                          </Badge>
                        </div>
                        <p className="text-neutral-500 text-[11px] font-light leading-relaxed">
                          {uni.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Attractions */}
              {activeTab === 'sights' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" /> Must-See Landmarks
                  </h4>
                  <div className="space-y-3">
                    {city.attractions.map((sight, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-neutral-100 shadow-2xs flex gap-3 hover:border-orange-200 transition-all">
                        <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-xs text-neutral-600 shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-bold text-xs text-neutral-800">{sight.title}</h5>
                          <p className="text-neutral-500 text-[11px] font-light leading-relaxed">
                            {sight.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Budget */}
              {activeTab === 'budget' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-orange-500" /> Student Cost & Lifestyle
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-2xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-blue-500" /> Rent Estimate
                      </span>
                      <p className="text-neutral-800 text-xs font-bold">{city.studentLife.rentEstimate}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-2xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
                        <Utensils className="w-3.5 h-3.5 text-orange-500" /> Meal Estimate
                      </span>
                      <p className="text-neutral-800 text-xs font-bold">{city.studentLife.mealEstimate}</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-2xs space-y-2 mt-2">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-red-500" /> Student Vibe
                    </span>
                    <p className="text-neutral-600 text-xs leading-relaxed font-light">
                      {city.studentLife.vibe}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab: Transport */}
              {activeTab === 'transport' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <Train className="w-4 h-4 text-orange-500" /> Getting Around
                  </h4>
                  <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-2xs space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {city.transport.types.map((type, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border-none font-medium text-[10px] px-2 py-0.5">
                          {type}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-neutral-600 text-xs leading-relaxed font-light">
                      {city.transport.guide}
                    </p>
                    <div className="border-t border-neutral-100 pt-3 mt-1 space-y-1">
                      <span className="text-[9px] uppercase font-bold text-neutral-400">Monthly Student Cost</span>
                      <p className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                        💰 {city.transport.studentCost}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Area: Thumbnails, Quick Stats & Scholar Tip (Col Span 4) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Clickable Image Gallery Thumbnails */}
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2.5">Real Photos</span>
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((imgUrl, idx) => {
                  const isActive = idx === activeImageIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-square rounded-lg overflow-hidden transition-all border-2 cursor-pointer ${
                        isActive 
                          ? 'border-orange-500 ring-2 ring-orange-100 scale-95 shadow-md' 
                          : 'border-transparent hover:border-neutral-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats Panel */}
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 space-y-3">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Quick Facts</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                <div className="bg-white p-3 rounded-xl border border-neutral-100/80 shadow-3xs flex items-start gap-2.5">
                  <Users className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-neutral-400 block font-bold uppercase tracking-wider">Population</span>
                    <span className="text-xs text-neutral-800 font-bold leading-normal block break-words">{city.stats.population}</span>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-xl border border-neutral-100/80 shadow-3xs flex items-start gap-2.5">
                  <Coins className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-neutral-400 block font-bold uppercase tracking-wider">Cost</span>
                    <span className={`text-xs font-bold leading-normal block break-words ${
                      city.stats.costOfLiving === 'Very High' 
                        ? 'text-red-600' 
                        : city.stats.costOfLiving === 'High' 
                          ? 'text-orange-600' 
                          : 'text-emerald-600'
                    }`}>{city.stats.costOfLiving}</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-neutral-100/80 shadow-3xs flex items-start gap-2.5">
                  <CloudSnow className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-neutral-400 block font-bold uppercase tracking-wider">Jan Temp</span>
                    <span className="text-xs text-neutral-700 font-bold leading-normal block break-words">{city.stats.avgTempWinter}</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-neutral-100/80 shadow-3xs flex items-start gap-2.5">
                  <Sun className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-neutral-400 block font-bold uppercase tracking-wider">July Temp</span>
                    <span className="text-xs text-neutral-700 font-bold leading-normal block break-words">{city.stats.avgTempSummer}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scholar Tip Box */}
            <div className="bg-amber-50/70 border border-amber-100 p-4 rounded-2xl space-y-2 relative shadow-xs">
              <div className="absolute -top-2 -right-2 bg-amber-100 text-amber-700 rounded-full p-1.5 border border-amber-200">
                <Lightbulb className="w-3.5 h-3.5 fill-amber-300" />
              </div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block">Scholar Tip</span>
              <p className="text-amber-900 text-[11px] leading-relaxed font-light">
                {city.scholarTip}
              </p>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-neutral-100 px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center bg-neutral-50/50 gap-3">
          <span className="text-[10px] text-neutral-400 hidden sm:inline">Pursuing Russian Universities Entrance Exams • Discover Cities Guide</span>
          <span className="text-[10px] text-neutral-400 inline sm:hidden">Discover Cities Guide</span>
          <Button 
            onClick={onClose}
            className="rounded-xl px-4 sm:px-5 py-1.5 sm:py-2 bg-neutral-900 hover:bg-black text-white font-bold text-xs shadow-xs cursor-pointer w-full sm:w-auto"
          >
            Close Guide
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
