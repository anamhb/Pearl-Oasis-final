import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';

export default function DishCustomizationModal({ dish, isOpen, onClose, onAddToCart }) {
  if (!isOpen || !dish) return null;

  // Selected variation
  const defaultVariation = dish.hasVariations && dish.variations && dish.variations.length > 0
    ? dish.variations[0]
    : null;

  const [selectedVariation, setSelectedVariation] = useState(defaultVariation);
  const [quantity, setQuantity] = useState(1);
  const [specialNotes, setSpecialNotes] = useState('');

  // Reset when dish changes
  useEffect(() => {
    if (dish) {
      setSelectedVariation(
        dish.hasVariations && dish.variations && dish.variations.length > 0
          ? dish.variations[0]
          : null
      );
      setQuantity(1);
      setSpecialNotes('');
    }
  }, [dish]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const unitPrice = selectedVariation ? selectedVariation.price : (dish.price || 0);
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const cartItemId = `${dish.id}-${selectedVariation ? selectedVariation.name.toLowerCase() : 'standard'}-${Date.now()}`;
    const orderItem = {
      cartItemId,
      dishId: dish.id,
      name: dish.name,
      category: dish.category || '',
      variation: selectedVariation ? selectedVariation.name : null,
      unitPrice,
      quantity,
      specialNotes: specialNotes.trim(),
      totalPrice,
      portion: selectedVariation ? selectedVariation.name : (dish.portion || ''),
      image: dish.image,
    };
    onAddToCart(orderItem);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dish-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#140608] border border-[#381017] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Floating Top-Right */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-[#18080B]/90 hover:bg-[#240C11] text-[#F5C369] hover:text-white border border-[#C9A45C]/30 flex items-center justify-center transition-colors shadow-md cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dish Image Banner (if available) */}
        {dish.image && (
          <div className="relative w-full h-48 sm:h-56 bg-[#120709] overflow-hidden shrink-0">
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140608] via-transparent to-black/40" />
            {dish.portion && (
              <div className="absolute bottom-3 left-4 bg-[#18080B]/90 backdrop-blur-xs px-2.5 py-1 rounded text-xs text-[#F5C369] border border-[#C9A45C]/30 font-medium">
                {dish.portion}
              </div>
            )}
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Header & Title */}
          <div>
            <h3 id="dish-modal-title" className="font-serif-heading text-2xl sm:text-3xl text-[#F8F3E8] leading-snug">
              {dish.name}
            </h3>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="font-serif-heading text-xl text-[#F5C369] font-semibold">
                Rs. {unitPrice.toLocaleString()}
              </span>
              {selectedVariation && (
                <span className="text-xs text-[#D8C5B8]">
                  ({selectedVariation.name})
                </span>
              )}
            </div>
            {dish.description && (
              <p className="text-xs sm:text-sm text-[#D8C5B8]/85 font-light mt-2.5 leading-relaxed">
                {dish.description}
              </p>
            )}
          </div>

          {/* Size / Variation Selection */}
          {dish.hasVariations && dish.variations && (
            <div className="space-y-2.5 pt-2 border-t border-[#381017]">
              <label className="block text-xs uppercase tracking-wider text-[#F5C369] font-semibold">
                Select {dish.variationName || 'Option'} <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {dish.variations.map((v) => {
                  const isSelected = selectedVariation?.name === v.name;
                  return (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => setSelectedVariation(v)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#8A1826] to-[#C02636] text-[#F8F3E8] border-[#E24A58] font-medium shadow-[0_4px_16px_rgba(186,37,53,0.35)]'
                          : 'bg-[#18080B] text-[#D8C5B8] border-[#381017] hover:border-[#C9A45C]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-semibold">{v.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span className={`text-xs mt-1 ${isSelected ? 'text-[#F8F3E8]' : 'text-[#F5C369]'}`}>
                        {v.formattedPrice}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Notes Field */}
          <div className="space-y-1.5 pt-2 border-t border-[#381017]">
            <label htmlFor="dish-notes" className="block text-xs uppercase tracking-wider text-[#F5C369] font-semibold">
              Special Notes / Instructions
            </label>
            <textarea
              id="dish-notes"
              rows={2}
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="e.g. Mild spice, extra raita, no onions, food allergies..."
              className="w-full px-3.5 py-2.5 bg-[#18080B] border border-[#381017] rounded-xl text-xs text-[#F8F3E8] placeholder-[#D8C5B8]/40 focus:outline-none focus:border-[#F5C369] resize-none"
            />
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-[#381017]">
            <span className="text-xs uppercase tracking-wider text-[#F5C369] font-semibold">
              Quantity
            </span>
            <div className="flex items-center gap-3 bg-[#18080B] px-3 py-1.5 rounded-full border border-[#381017]">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-7 h-7 rounded-full bg-[#240C11] text-[#F5C369] hover:bg-[#8A1826] hover:text-white flex items-center justify-center disabled:opacity-40 transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold text-[#F8F3E8] w-6 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-full bg-[#240C11] text-[#F5C369] hover:bg-[#8A1826] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-5 bg-[#18080B] border-t border-[#381017] flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-[#D8C5B8]">Item Total</span>
            <span className="font-serif-heading text-lg sm:text-xl text-[#F5C369] font-bold">
              Rs. {totalPrice.toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-wider font-bold text-[#F8F3E8] bg-gradient-to-r from-[#8A1826] via-[#A81E2E] to-[#C02636] hover:from-[#A81E2E] hover:to-[#D43446] transition-all shadow-[0_4px_20px_rgba(186,37,53,0.45)] active:scale-95 cursor-pointer"
          >
            <span>Add to Your Order</span>
            <span>•</span>
            <span>Rs. {totalPrice.toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
