import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData.js';

export default function OrderTrayDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearTray,
  onProceedToCheckout,
  onBrowseFullMenu
}) {
  const [orderType, setOrderType] = useState('Dine-In');
  const [customerName, setCustomerName] = useState('');
  const [tableOrPhone, setTableOrPhone] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (!isOpen) return null;

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const orderTotal = items.reduce(
    (sum, item) => sum + (item.totalPrice || (item.unitPrice ? item.unitPrice * item.quantity : 0)),
    0
  );

  const generateWhatsAppMessage = () => {
    let msg = `*Pearl Oasis Kohat — Order Inquiry*\n\n`;
    msg += `*Order Type:* ${orderType}\n`;
    if (customerName) msg += `*Guest Name:* ${customerName}\n`;
    if (tableOrPhone) msg += `*Table / Contact:* ${tableOrPhone}\n`;
    msg += `\n*Selected Items:*\n`;

    items.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.name} (${item.portion}) x ${item.quantity}\n`;
    });

    if (specialInstructions) {
      msg += `\n*Special Notes:* ${specialInstructions}\n`;
    }

    msg += `\nSent via Pearl Oasis Kohat`;
    return encodeURIComponent(msg);
  };

  const handleSendToWhatsApp = () => {
    const encoded = generateWhatsAppMessage();
    const url = `https://wa.me/${RESTAURANT_INFO.whatsapp.replace('+', '')}?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-[#140608] h-full shadow-2xl flex flex-col justify-between border-l border-[#C9A45C]/35">
        
        {/* Drawer Header */}
        <div className="p-6 bg-[#18080B] text-[#F8F3E8] flex items-center justify-between border-b border-[#C9A45C]/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#240C11] border border-[#C9A45C] flex items-center justify-center text-[#F5C369]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-heading text-lg text-[#F5C369]">Order Tray</h3>
              <p className="text-[11px] text-[#D8C5B8]">{totalItemsCount} items selected</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#F5C369] hover:text-white rounded transition-colors cursor-pointer"
            aria-label="Close Order Tray"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#18080B] border border-[#C9A45C]/40 flex items-center justify-center mx-auto text-[#C9A45C]">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-serif-heading text-[#F8F3E8]">Your tray is empty</h4>
              <p className="text-xs text-[#D8C5B8] max-w-xs mx-auto font-light">
                Select items from our signature dishes or kitchen menu to build your order.
              </p>
              <button
                onClick={() => {
                  onClose();
                  if (onBrowseFullMenu) onBrowseFullMenu();
                }}
                className="mt-3 px-6 py-2.5 bg-gradient-to-r from-[#8A1826] via-[#A81E2E] to-[#C02636] hover:brightness-110 text-[#F8F3E8] rounded-full text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-md"
              >
                Browse Full Menu
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#F5C369] pb-1 border-b border-[#381017]">
                  <span>Items</span>
                  <button
                    onClick={onClearTray}
                    className="text-[#D8C5B8] hover:text-white hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#18080B]/90 p-4 rounded-lg border border-[#C9A45C]/25 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-[#F8F3E8] truncate">{item.name}</h4>
                      <div className="text-[10px] text-[#D8C5B8] truncate">{item.portion}</div>
                      {(item.totalPrice || item.unitPrice) && (
                        <div className="text-[11px] font-serif-heading text-[#F5C369] font-semibold mt-0.5">
                          Rs. {(item.totalPrice || item.unitPrice * item.quantity).toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 shrink-0 bg-[#240C11] px-2.5 py-1 rounded-full border border-[#C9A45C]/30 text-[#F8F3E8]">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-0.5 text-[#C9A45C] hover:text-white transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-0.5 text-[#C9A45C] hover:text-white transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 text-[#D8C5B8] hover:text-[#F5C369] transition-colors cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Order Details Form */}
              <div className="space-y-3 pt-3 border-t border-[#381017]">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#C9A45C] font-medium">
                    Order Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Dine-In', 'Takeaway'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setOrderType(type)}
                        className={`py-2 px-3 text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                          orderType === type
                            ? 'bg-gradient-to-r from-[#8A1826] to-[#C02636] text-[#F8F3E8] font-semibold shadow-sm'
                            : 'bg-[#18080B] text-[#D8C5B8] border border-[#C9A45C]/30 hover:border-[#F5C369]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#C9A45C] font-medium">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tariq"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#18080B] border border-[#C9A45C]/30 rounded-lg text-xs text-[#F8F3E8] focus:outline-none focus:border-[#F5C369]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#C9A45C] font-medium">
                      Table / Phone
                    </label>
                    <input
                      type="text"
                      placeholder="Table 4 / Mobile"
                      value={tableOrPhone}
                      onChange={(e) => setTableOrPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-[#18080B] border border-[#C9A45C]/30 rounded-lg text-xs text-[#F8F3E8] focus:outline-none focus:border-[#F5C369]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#C9A45C] font-medium">
                    Special Cooking Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Extra ginger, mild spice..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full px-3 py-2 bg-[#18080B] border border-[#C9A45C]/30 rounded-lg text-xs text-[#F8F3E8] focus:outline-none focus:border-[#F5C369]"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer Actions */}
        {items.length > 0 && (
          <div className="p-6 bg-[#18080B] border-t border-[#C9A45C]/30 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#381017] text-sm">
              <span className="text-xs uppercase tracking-wider text-[#D8C5B8]">Cart Total</span>
              <span className="font-serif-heading text-xl text-[#F5C369] font-bold">
                Rs. {orderTotal.toLocaleString()}
              </span>
            </div>

            {onProceedToCheckout && (
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#8A1826] via-[#A81E2E] to-[#C02636] hover:from-[#9B1C28] hover:to-[#D12B3D] hover:brightness-110 text-[#F8F3E8] text-xs uppercase tracking-wider font-bold rounded-full transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleSendToWhatsApp}
              className="w-full py-2.5 px-4 bg-[#240C11] hover:bg-[#381017] text-[#F5C369] border border-[#C9A45C]/40 text-xs uppercase tracking-wider font-semibold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Quick Send via WhatsApp</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
