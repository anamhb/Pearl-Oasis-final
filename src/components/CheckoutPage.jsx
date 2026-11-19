import React, { useMemo, useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  ShoppingBag, 
  Minus, 
  Plus, 
  Trash2, 
  Navigation, 
  Info, 
  AlertCircle,
  Check,
  MessageSquare,
  X
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData.js';

const RESTAURANT_WHATSAPP = (
  import.meta.env.VITE_WHATSAPP_NUMBER ||
  RESTAURANT_INFO.whatsapp ||
  '+923327515538'
).replace(/[^0-9]/g, '');

function buildOrderDateOptions() {
  const base = new Date();
  base.setHours(0, 0, 0, 0);

  const day0 = new Date(base);
  const day1 = new Date(base);
  day1.setDate(day1.getDate() + 1);
  const day2 = new Date(base);
  day2.setDate(day2.getDate() + 2);

  const formatShort = (d) => {
    const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    return `${weekday}, ${dayNum} ${month}`;
  };

  const formatNextDay = (d) => {
    const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
    const dayNum = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    return `${weekday} (${dayNum} ${month})`;
  };

  return [
    { value: `Today (${formatShort(day0)})`, label: `Today (${formatShort(day0)})` },
    { value: `Tomorrow (${formatShort(day1)})`, label: `Tomorrow (${formatShort(day1)})` },
    { value: formatNextDay(day2), label: formatNextDay(day2) },
  ];
}

export default function CheckoutPage({
  orderItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearOrder,
  onBackToMenu,
  onBackToHome
}) {
  const dateOptions = useMemo(() => buildOrderDateOptions(), []);
  const [fulfillmentType, setFulfillmentType] = useState('pickup'); // 'pickup' | 'delivery'
  const [selectedDate, setSelectedDate] = useState(() => dateOptions[0].value);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('ASAP (30–45 mins)');
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Delivery Specific Address Fields (Screenshot 3)
  const [streetAddress, setStreetAddress] = useState('');
  const [floor, setFloor] = useState('');
  const [doorbellName, setDoorbellName] = useState('');
  const [postalCode, setPostalCode] = useState('26000');
  const [city, setCity] = useState('Kohat');

  // Geolocation state
  const [isLocating, setIsLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');

  // Validation errors
  const [errors, setErrors] = useState({});

  const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = fulfillmentType === 'delivery' ? 150 : 0;
  const grandTotal = subtotal + deliveryFee;

  // Handle "Use Current Location"
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationMessage('Detecting current coordinates in Kohat...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);
        setStreetAddress((prev) => prev ? prev : `Pinned via GPS (${lat}, ${lng}) - Near KDA Sector`);
        setCity('Kohat');
        setPostalCode('26000');
        setLocationMessage(`GPS coordinates pinned (${lat}, ${lng}). You can add specific landmarks.`);
        // Clear address error if any
        setErrors((prev) => ({ ...prev, streetAddress: null }));
      },
      (err) => {
        setIsLocating(false);
        setLocationMessage('Could not retrieve GPS automatically. Please enter your street address.');
      },
      { timeout: 8000 }
    );
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!customerName.trim()) {
      newErrors.customerName = 'Please enter your full name.';
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Please enter your phone number.';
    } else if (phoneNumber.trim().length < 8) {
      newErrors.phoneNumber = 'Please enter a valid contact number.';
    }

    if (fulfillmentType === 'delivery') {
      if (!streetAddress.trim()) {
        newErrors.streetAddress = 'Street address is required for delivery.';
      }
      if (!postalCode.trim()) {
        newErrors.postalCode = 'Postal code is required.';
      }
      if (!city.trim()) {
        newErrors.city = 'Town / City is required.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Order Placement via Backend Sequential Reference API
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitError('');

    if (!validateForm()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    const orderPayload = {
      displayDate: selectedDate,
      displayTime: selectedTimeSlot,
      fulfillmentType,
      customer: {
        name: customerName.trim(),
        phone: phoneNumber.trim(),
        notes: orderNotes.trim(),
        ...(fulfillmentType === 'delivery' && {
          address: {
            street: streetAddress.trim(),
            floor: floor.trim(),
            doorbell: doorbellName.trim(),
            postalCode: postalCode.trim(),
            city: city.trim(),
          }
        })
      },
      items: [...orderItems],
      subtotal,
      deliveryFee,
      grandTotal,
    };

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const result = await response.json();
      if (!response.ok || !result?.order) {
        throw new Error(result?.error || 'Could not place your order. Please try again.');
      }

      const newOrder = result.order;

      // Save to localStorage for local history while preserving any existing legacy records
      try {
        const existingHistory = JSON.parse(localStorage.getItem('pearl_oasis_orders') || '[]');
        existingHistory.unshift(newOrder);
        localStorage.setItem('pearl_oasis_orders', JSON.stringify(existingHistory));
      } catch (err) {
        console.warn('Could not save to localStorage', err);
      }

      const encoded = generateWhatsAppConfirmation(newOrder);
      const whatsappUrl = `https://wa.me/${RESTAURANT_WHATSAPP}?text=${encoded}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      setConfirmedOrder({
        ...newOrder,
        whatsappUrl,
        itemCount: orderItems.reduce((sum, item) => sum + item.quantity, 0),
      });

      if (onClearOrder) {
        onClearOrder();
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Unable to place order right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate WhatsApp message for instant dispatch
  const generateWhatsAppConfirmation = (order) => {
    let msg = `*Pearl Oasis Kohat — Order ${order.orderId}*\n\n`;
    msg += `*Customer:* ${order.customer.name}\n`;
    msg += `*Contact:* ${order.customer.phone}\n`;
    msg += `*Fulfillment:* ${order.fulfillmentType === 'pickup' ? 'Pickup' : 'Cash on Delivery (COD)'}\n`;
    msg += `*Scheduled:* ${order.displayDate} · ${order.displayTime}\n`;

    if (order.fulfillmentType === 'delivery' && order.customer.address) {
      msg += `*Delivery Address:*\n${order.customer.address.street}`;
      if (order.customer.address.floor) msg += `, Floor: ${order.customer.address.floor}`;
      if (order.customer.address.doorbell) msg += `, Doorbell: ${order.customer.address.doorbell}`;
      msg += `\n${order.customer.address.city} (${order.customer.address.postalCode})\n`;
    }

    msg += `\n*Order Items:*\n`;
    order.items.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.name}`;
      if (item.variation) msg += ` (${item.variation})`;
      msg += ` x ${item.quantity} = Rs. ${item.totalPrice.toLocaleString()}\n`;
      if (item.specialNotes) msg += `   _Note: ${item.specialNotes}_\n`;
    });

    msg += `\n*Subtotal:* Rs. ${order.subtotal.toLocaleString()}`;
    if (order.deliveryFee > 0) {
      msg += `\n*Delivery Fee:* Rs. ${order.deliveryFee.toLocaleString()}`;
    }
    msg += `\n*Grand Total:* Rs. ${order.grandTotal.toLocaleString()}\n`;

    if (order.customer.notes) {
      msg += `\n*Special Instructions:* ${order.customer.notes}\n`;
    }

    msg += `\nStatus: Confirmed via Pearl Oasis Online Portal`;
    return encodeURIComponent(msg);
  };

  // Active Checkout Form View (matching Screenshot 2 and Screenshot 3)
  return (
    <div className="min-h-screen bg-[#0B0708] text-[#F8F3E8] flex flex-col font-sans selection:bg-[#C02636] selection:text-white">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#140608]/95 backdrop-blur-md border-b border-[#381017] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button
            onClick={onBackToMenu}
            className="p-2 rounded-full bg-[#18080B] border border-[#381017] hover:border-[#F5C369] text-[#F5C369] hover:text-white transition-all cursor-pointer shadow-xs"
            aria-label="Back to Menu"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <h1 className="font-serif-heading text-xl sm:text-2xl text-[#F8F3E8] leading-none">
              Your order
            </h1>
            <p className="text-[11px] text-[#D8C5B8] mt-1 line-clamp-1 font-light">
              Pearl Oasis · Where Pakistani Heritage Meets Exceptional Flavors · Kohat City Centre
            </p>
          </div>
        </div>
      </header>

      {/* Main Checkout Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {orderItems.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-20 space-y-4">
            <ShoppingBag className="w-12 h-12 text-[#F5C369] mx-auto" />
            <h2 className="font-serif-heading text-2xl text-[#F8F3E8]">No items in your order</h2>
            <p className="text-xs text-[#D8C5B8]">
              Please return to the full menu to select your desired dishes.
            </p>
            <button
              onClick={onBackToMenu}
              className="px-6 py-2.5 bg-gradient-to-r from-[#8A1826] to-[#C02636] hover:from-[#A81E2E] hover:to-[#D43446] text-[#F8F3E8] font-bold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer shadow-lg"
            >
              Browse Full Menu
            </button>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Fulfillment, Schedule, Contact, Address Form */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Card 1: How would you like to receive your order? */}
              <div className="bg-[#140608] rounded-2xl border border-[#381017] p-5 sm:p-6 shadow-xl space-y-4">
                <h2 className="font-serif-heading text-lg sm:text-xl text-[#F8F3E8]">
                  How would you like to receive your order?
                </h2>

                <div className="space-y-3">
                  {/* Option 1: Pickup */}
                  <label
                    className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                      fulfillmentType === 'pickup'
                        ? 'bg-[#18080B] border-[#C9A45C] shadow-md ring-1 ring-[#F5C369]/50'
                        : 'bg-[#18080B]/60 border-[#381017] hover:border-[#C9A45C]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-sm font-semibold text-[#F8F3E8] block">
                          Pickup
                        </span>
                        <p className="text-xs text-[#D8C5B8] leading-relaxed">
                          {RESTAURANT_INFO.address}
                        </p>
                      </div>
                      <input
                        type="radio"
                        name="fulfillment"
                        checked={fulfillmentType === 'pickup'}
                        onChange={() => setFulfillmentType('pickup')}
                        className="mt-1 w-4 h-4 accent-[#C02636] cursor-pointer"
                      />
                    </div>
                  </label>

                  {/* Option 2: Cash on Delivery (COD) */}
                  <label
                    className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                      fulfillmentType === 'delivery'
                        ? 'bg-[#18080B] border-[#C9A45C] shadow-md ring-1 ring-[#F5C369]/50'
                        : 'bg-[#18080B]/60 border-[#381017] hover:border-[#C9A45C]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-sm font-semibold text-[#F8F3E8] block">
                          Cash on Delivery (COD)
                        </span>
                        <p className="text-xs text-[#D8C5B8]">
                          Prompt delivery across Kohat City Centre, KDA, and surrounding areas.
                        </p>
                      </div>
                      <input
                        type="radio"
                        name="fulfillment"
                        checked={fulfillmentType === 'delivery'}
                        onChange={() => setFulfillmentType('delivery')}
                        className="mt-1 w-4 h-4 accent-[#C02636] cursor-pointer"
                      />
                    </div>
                  </label>
                </div>
              </div>

              {/* Card 2: When would you like to receive your order? */}
              <div className="bg-[#140608] rounded-2xl border border-[#381017] p-5 sm:p-6 shadow-xl space-y-4">
                <h2 className="font-serif-heading text-lg sm:text-xl text-[#F8F3E8]">
                  When would you like to receive your order?
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Date Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#F5C369] font-semibold">
                      Date
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-[#F5C369] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#120709] border border-[#381017] rounded-xl text-xs text-[#F8F3E8] focus:outline-none focus:border-[#F5C369] appearance-none cursor-pointer"
                      >
                        {dateOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Time Window Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#F5C369] font-semibold">
                      Time Window
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-[#F5C369] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={selectedTimeSlot}
                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#120709] border border-[#381017] rounded-xl text-xs text-[#F8F3E8] focus:outline-none focus:border-[#F5C369] appearance-none cursor-pointer"
                      >
                        <option value="ASAP (30–45 mins)">ASAP (30–45 mins)</option>
                        <option value="19:30 - 20:00">19:30 - 20:00</option>
                        <option value="20:00 - 20:30">20:00 - 20:30</option>
                        <option value="20:30 - 21:00">20:30 - 21:00</option>
                        <option value="21:00 - 21:30">21:00 - 21:30</option>
                        <option value="21:30 - 22:00">21:30 - 22:00</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Your Information */}
              <div className="bg-[#140608] rounded-2xl border border-[#381017] p-5 sm:p-6 shadow-xl space-y-4">
                <h2 className="font-serif-heading text-lg sm:text-xl text-[#F8F3E8]">
                  Your Information
                </h2>

                <div className="space-y-4">
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-[#F5C369] font-semibold">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tariq Khattak"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: null }));
                      }}
                      className={`w-full px-4 py-2.5 bg-[#120709] border rounded-xl text-xs text-[#F8F3E8] placeholder-[#D8C5B8]/40 focus:outline-none ${
                        errors.customerName
                          ? 'border-red-400 focus:border-red-400 ring-1 ring-red-400/40'
                          : 'border-[#381017] focus:border-[#F5C369]'
                      }`}
                    />
                    {errors.customerName && (
                      <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.customerName}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone number field */}
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-[#F5C369] font-semibold">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 0300 1234567 or +92 300 1234567"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: null }));
                      }}
                      className={`w-full px-4 py-2.5 bg-[#120709] border rounded-xl text-xs text-[#F8F3E8] placeholder-[#D8C5B8]/40 focus:outline-none ${
                        errors.phoneNumber
                          ? 'border-red-400 focus:border-red-400 ring-1 ring-red-400/40'
                          : 'border-[#381017] focus:border-[#F5C369]'
                      }`}
                    />
                    {errors.phoneNumber && (
                      <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.phoneNumber}</span>
                      </p>
                    )}
                  </div>

                  {/* Special note field */}
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-[#F5C369] font-semibold">
                      Special Note <span className="text-[#D8C5B8] font-normal lowercase">(optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Add any instructions for your order or delivery..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#120709] border border-[#381017] rounded-xl text-xs text-[#F8F3E8] placeholder-[#D8C5B8]/40 focus:outline-none focus:border-[#F5C369] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Card 4: Delivery Address (Only displayed when Delivery is selected) */}
              {fulfillmentType === 'delivery' && (
                <div className="bg-[#140608] rounded-2xl border border-[#381017] p-4 sm:p-6 shadow-xl space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h2 className="font-serif-heading text-lg sm:text-xl text-[#F8F3E8]">
                      Your Address
                    </h2>

                    {/* "Use Current Location" Button */}
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      disabled={isLocating}
                      className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#F8F3E8] bg-gradient-to-r from-[#8A1826] to-[#C02636] hover:from-[#A81E2E] hover:to-[#D43446] transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                      <span>{isLocating ? 'Locating...' : 'Use Current Location'}</span>
                      <Info className="w-3.5 h-3.5 text-[#F8F3E8]/80" />
                    </button>
                  </div>

                  {locationMessage && (
                    <p className="text-[11px] text-[#D8C5B8] bg-[#18080B] px-3 py-2 rounded-lg border border-[#381017]">
                      {locationMessage}
                    </p>
                  )}

                  <div className="space-y-4">
                    {/* Street Address */}
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-wider text-[#F5C369] font-semibold">
                        Street Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="House / Plaza number, Street name, Sector / Area"
                        value={streetAddress}
                        onChange={(e) => {
                          setStreetAddress(e.target.value);
                          if (errors.streetAddress) setErrors((prev) => ({ ...prev, streetAddress: null }));
                        }}
                        className={`w-full px-4 py-2.5 bg-[#120709] border rounded-xl text-xs text-[#F8F3E8] placeholder-[#D8C5B8]/40 focus:outline-none ${
                          errors.streetAddress
                            ? 'border-red-400 focus:border-red-400 ring-1 ring-red-400/40'
                            : 'border-[#381017] focus:border-[#F5C369]'
                        }`}
                      />
                      {errors.streetAddress && (
                        <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.streetAddress}</span>
                        </p>
                      )}
                    </div>

                    {/* Floor and Doorbell Name in 2 columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-[#F5C369] font-semibold">
                          Floor <span className="text-[#D8C5B8] font-normal lowercase">(optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 1st Floor / Ground"
                          value={floor}
                          onChange={(e) => setFloor(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#120709] border border-[#381017] rounded-xl text-xs text-[#F8F3E8] placeholder-[#D8C5B8]/40 focus:outline-none focus:border-[#F5C369]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-[#F5C369] font-semibold">
                          Name on Doorbell <span className="text-[#D8C5B8] font-normal lowercase">(optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Khattak Residence"
                          value={doorbellName}
                          onChange={(e) => setDoorbellName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#120709] border border-[#381017] rounded-xl text-xs text-[#F8F3E8] placeholder-[#D8C5B8]/40 focus:outline-none focus:border-[#F5C369]"
                        />
                      </div>
                    </div>

                    {/* Zip/Postal code and Town/City in 2 columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-[#F5C369] font-semibold">
                          Zip / Postal Code <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={postalCode}
                          onChange={(e) => {
                            setPostalCode(e.target.value);
                            if (errors.postalCode) setErrors((prev) => ({ ...prev, postalCode: null }));
                          }}
                          className={`w-full px-4 py-2.5 bg-[#120709] border rounded-xl text-xs text-[#F8F3E8] focus:outline-none ${
                            errors.postalCode
                              ? 'border-red-400 focus:border-red-400 ring-1 ring-red-400/40'
                              : 'border-[#381017] focus:border-[#F5C369]'
                          }`}
                        />
                        {errors.postalCode && (
                          <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.postalCode}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs uppercase tracking-wider text-[#F5C369] font-semibold">
                          Town / City <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => {
                            setCity(e.target.value);
                            if (errors.city) setErrors((prev) => ({ ...prev, city: null }));
                          }}
                          className={`w-full px-4 py-2.5 bg-[#120709] border rounded-xl text-xs text-[#F8F3E8] focus:outline-none ${
                            errors.city
                              ? 'border-red-400 focus:border-red-400 ring-1 ring-red-400/40'
                              : 'border-[#381017] focus:border-[#F5C369]'
                          }`}
                        />
                        {errors.city && (
                          <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.city}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: "Your items" summary & Place Order button */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="bg-[#140608] rounded-2xl border border-[#381017] shadow-2xl overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className="p-5 bg-[#18080B] border-b border-[#381017] flex items-center justify-between">
                  <h2 className="font-serif-heading text-xl sm:text-2xl text-[#F5C369] font-bold">
                    Your items
                  </h2>
                  <span className="text-xs sm:text-sm font-medium text-[#D8C5B8] bg-[#240C11] px-3 py-1 rounded-full border border-[#381017]">
                    {orderItems.reduce((s, i) => s + i.quantity, 0)} items
                  </span>
                </div>

                {/* Items List */}
                <div className="p-5 space-y-4 max-h-[50vh] overflow-y-auto">
                  {orderItems.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="bg-[#18080B]/95 p-4 sm:p-4.5 rounded-xl border border-[#381017] hover:border-[#C9A45C]/40 transition-colors space-y-2.5 shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg font-bold text-[#F8F3E8] leading-snug">
                            {item.name}
                          </h3>
                          {item.variation && (
                            <span className="inline-block text-xs sm:text-sm font-semibold text-[#F5C369] bg-[#240C11] px-2.5 py-0.5 rounded-md mt-1 border border-[#C9A45C]/30">
                              {item.variation}
                            </span>
                          )}
                          {item.specialNotes && (
                            <p className="text-xs sm:text-sm text-[#D8C5B8] italic mt-1 line-clamp-2">
                              Note: {item.specialNotes}
                            </p>
                          )}
                        </div>
                        <span className="font-serif-heading text-base sm:text-lg text-[#F5C369] font-bold shrink-0">
                          Rs. {item.totalPrice.toLocaleString()}
                        </span>
                      </div>

                      {/* Quantity controls inside checkout */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#381017]">
                        <span className="text-xs sm:text-sm font-medium text-[#D8C5B8]">
                          Rs. {item.unitPrice.toLocaleString()} each
                        </span>

                        <div className="flex items-center gap-2.5">
                          <div className="flex items-center gap-2 bg-[#240C11] px-2.5 py-1 rounded-full border border-[#C9A45C]/30">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                              className="text-[#F5C369] hover:text-white p-0.5 cursor-pointer transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-sm sm:text-base font-bold text-[#F8F3E8] w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                              className="text-[#F5C369] hover:text-white p-0.5 cursor-pointer transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.cartItemId)}
                            className="p-1.5 text-[#D8C5B8] hover:text-red-400 hover:bg-[#240C11] rounded-lg transition-colors cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals & Place an Order CTA */}
                <div className="p-5 bg-[#18080B] border-t border-[#381017] space-y-4">
                  <div className="space-y-2 text-sm sm:text-base">
                    <div className="flex items-center justify-between text-[#D8C5B8]">
                      <span>Subtotal</span>
                      <span className="text-[#F8F3E8] font-bold text-base">Rs. {subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between text-[#D8C5B8]">
                      <span>Fulfillment</span>
                      <span className="text-[#F8F3E8] font-semibold">
                        {fulfillmentType === 'pickup' ? 'Free (Pickup)' : `Rs. ${deliveryFee.toLocaleString()} (COD)`}
                      </span>
                    </div>

                    <div className="border-t border-[#381017] pt-2.5 flex items-center justify-between text-base font-bold text-[#F8F3E8]">
                      <span className="text-lg">Total</span>
                      <span className="font-serif-heading text-2xl sm:text-3xl text-[#F5C369] font-bold">
                        Rs. {grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {submitError && (
                    <p className="text-xs text-red-400 bg-red-950/40 border border-red-400/40 rounded-lg px-3 py-2 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{submitError}</span>
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-[#8A1826] via-[#A81E2E] to-[#C02636] hover:from-[#A81E2E] hover:to-[#D43446] text-[#F8F3E8] font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_25px_rgba(186,37,53,0.45)] flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span>{isSubmitting ? 'Assigning Order Reference...' : 'Place an Order'}</span>
                    {!isSubmitting && (
                      <>
                        <span>•</span>
                        <span>Rs. {grandTotal.toLocaleString()}</span>
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-[#D8C5B8] font-light">
                    Pay via cash or card upon delivery/pickup. Opens your order confirmation & WhatsApp summary.
                  </p>
                </div>

              </div>
            </div>

          </form>
        )}

      </div>

      {/* ================= ORDER CONFIRMATION MODAL DIALOG ================= */}
      {confirmedOrder && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-confirmation-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setConfirmedOrder(null)}
        >
          <div
            className="max-w-lg w-full bg-[#140608] border border-[#C9A45C]/50 rounded-2xl p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.92)] relative text-center space-y-5 animate-in zoom-in-95 duration-300 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setConfirmedOrder(null)}
              className="absolute top-3.5 right-3.5 text-[#D8C5B8] hover:text-[#F5C369] bg-[#18080B] p-1.5 rounded-full border border-[#C9A45C]/30 transition-colors cursor-pointer"
              aria-label="Close order confirmation modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#240C11] to-[#381017] border-2 border-[#F5C369] flex items-center justify-center mx-auto text-[#F5C369] shadow-xl">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#F5C369] font-semibold block">
                ORDER CONFIRMATION
              </span>
              <h2
                id="order-confirmation-title"
                className="font-serif-heading text-2xl sm:text-3xl text-[#F8F3E8]"
              >
                Thank You, {confirmedOrder.customer.name}!
              </h2>
              <p className="text-xs sm:text-sm text-[#D8C5B8] max-w-md mx-auto leading-relaxed font-light">
                Your{' '}
                <strong>
                  {confirmedOrder.fulfillmentType === 'pickup' ? 'pickup' : 'cash on delivery'}
                </strong>{' '}
                order for <strong>{confirmedOrder.itemCount} {confirmedOrder.itemCount === 1 ? 'item' : 'items'}</strong> has been prepared for the Pearl Oasis kitchen desk.
              </p>
              <div className="inline-flex items-center gap-2 bg-[#18080B] px-3.5 py-1 rounded-full border border-[#C9A45C]/35 text-xs font-mono text-[#F5C369] mt-1">
                <span>Reference: {confirmedOrder.orderId}</span>
              </div>
            </div>

            <div className="bg-[#18080B] rounded-xl border border-[#C9A45C]/35 p-4 text-left max-w-md mx-auto space-y-2.5 text-xs">
              <div className="flex justify-between gap-3 border-b border-[#381017] pb-2">
                <span className="text-[#D8C5B8]">Date</span>
                <span className="text-[#F8F3E8] font-medium text-right">{confirmedOrder.displayDate}</span>
              </div>
              <div className="flex justify-between gap-3 border-b border-[#381017] pb-2">
                <span className="text-[#D8C5B8]">Time</span>
                <span className="text-[#F8F3E8] font-medium text-right">{confirmedOrder.displayTime}</span>
              </div>
              <div className="flex justify-between gap-3 border-b border-[#381017] pb-2">
                <span className="text-[#D8C5B8]">Order Type</span>
                <span className="text-[#F8F3E8] font-medium text-right">
                  {confirmedOrder.fulfillmentType === 'pickup' ? 'Pickup' : 'Cash on Delivery (COD)'}
                </span>
              </div>
              {confirmedOrder.fulfillmentType === 'delivery' && confirmedOrder.customer.address && (
                <div className="flex justify-between gap-3 border-b border-[#381017] pb-2">
                  <span className="text-[#D8C5B8] shrink-0">Address</span>
                  <span className="text-[#F8F3E8] font-medium text-right">
                    {confirmedOrder.customer.address.street}, {confirmedOrder.customer.address.city}
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-3 border-b border-[#381017] pb-2">
                <span className="text-[#D8C5B8]">Total Amount</span>
                <span className="text-[#F8F3E8] font-semibold text-right">
                  Rs. {confirmedOrder.grandTotal.toLocaleString()} ({confirmedOrder.itemCount} {confirmedOrder.itemCount === 1 ? 'item' : 'items'})
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[#D8C5B8]">Contact</span>
                <span className="text-[#F5C369] font-medium font-mono tabular-nums text-right">
                  {confirmedOrder.customer.phone}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#D8C5B8] max-w-md mx-auto leading-relaxed italic">
              Our kitchen team will reply via WhatsApp or phone call to confirm your order.
            </p>

            <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={confirmedOrder.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-[#240C11] hover:bg-[#381017] text-[#25D366] border border-[#25D366]/40 hover:border-[#25D366] text-xs font-semibold uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open WhatsApp Again</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setConfirmedOrder(null);
                  onBackToHome();
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#8A1826] via-[#A81E2E] to-[#C02636] hover:brightness-110 text-[#F8F3E8] text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-md cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
