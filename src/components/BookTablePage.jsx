import React, { useState, useMemo } from 'react';
import { RESTAURANT_INFO } from '../data/restaurantData.js';
import {
  Users,
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  MessageSquare,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  ClipboardCheck,
  ArrowLeft,
  ArrowRight,
  X,
  AlertCircle,
  Pencil,
  Sunrise,
  CalendarDays
} from 'lucide-react';

// Configurable WhatsApp number from environment or restaurant config
const RESTAURANT_WHATSAPP = (
  import.meta.env.VITE_WHATSAPP_NUMBER ||
  RESTAURANT_INFO.whatsapp ||
  '+923327515538'
).replace(/[^0-9]/g, '');

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MAX_TOTAL_GUESTS = 30;

// Reservation time slots (12:00 PM to 10:00 PM)
const ALL_TIME_SLOTS = [
  // Lunch & Afternoon
  { id: '12:00', label: '12:00 PM', period: 'lunch', hour: 12, minute: 0 },
  { id: '12:30', label: '12:30 PM', period: 'lunch', hour: 12, minute: 30 },
  { id: '13:00', label: '1:00 PM', period: 'lunch', hour: 13, minute: 0, isFridayBreak: true },
  { id: '13:30', label: '1:30 PM', period: 'lunch', hour: 13, minute: 30, isFridayBreak: true },
  { id: '14:00', label: '2:00 PM', period: 'lunch', hour: 14, minute: 0, isFridayBreak: true },
  { id: '14:30', label: '2:30 PM', period: 'lunch', hour: 14, minute: 30 },
  { id: '15:00', label: '3:00 PM', period: 'lunch', hour: 15, minute: 0 },
  { id: '15:30', label: '3:30 PM', period: 'lunch', hour: 15, minute: 30 },
  { id: '16:00', label: '4:00 PM', period: 'lunch', hour: 16, minute: 0 },
  { id: '16:30', label: '4:30 PM', period: 'lunch', hour: 16, minute: 30 },

  // Dinner & Evening
  { id: '17:00', label: '5:00 PM', period: 'dinner', hour: 17, minute: 0 },
  { id: '17:30', label: '5:30 PM', period: 'dinner', hour: 17, minute: 30 },
  { id: '18:00', label: '6:00 PM', period: 'dinner', hour: 18, minute: 0 },
  { id: '18:30', label: '6:30 PM', period: 'dinner', hour: 18, minute: 30 },
  { id: '19:00', label: '7:00 PM', period: 'dinner', hour: 19, minute: 0 },
  { id: '19:30', label: '7:30 PM', period: 'dinner', hour: 19, minute: 30 },
  { id: '20:00', label: '8:00 PM', period: 'dinner', hour: 20, minute: 0 },
  { id: '20:30', label: '8:30 PM', period: 'dinner', hour: 20, minute: 30 },
  { id: '21:00', label: '9:00 PM', period: 'dinner', hour: 21, minute: 0 },
  { id: '21:30', label: '9:30 PM', period: 'dinner', hour: 21, minute: 30 },
  { id: '22:00', label: '10:00 PM', period: 'dinner', hour: 22, minute: 0 }
];

function formatShortDate(date) {
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}

function formatFullDate(date) {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export default function BookTablePage({ onBackToHome }) {
  // Multistep state (1: People, 2: Date, 3: Time, 4: Details, 5: Submit)
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Direct Guest Composition (default 0)
  const [composition, setComposition] = useState({
    kids: 0,
    male: 0,
    female: 0
  });

  const totalGuests = composition.kids + composition.male + composition.female;

  // Step 2: Date & Calendar / Time Popups (default today)
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const tomorrow = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return d;
  }, [today]);

  const [selectedDate, setSelectedDate] = useState(() => new Date(today));

  const [calendarViewDate, setCalendarViewDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);

  // Step 3: Time (no default time selected)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  // Step 4: Customer Details (Seating preference removed)
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    specialRequests: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Submission Status
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSubmitError, setBookingSubmitError] = useState('');

  const goToStep = (step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 90, behavior: 'smooth' });
  };

  // Direct Guest Composition Adjustments
  const handleAdjustComposition = (category, delta) => {
    setComposition((prev) => {
      const nextVal = prev[category] + delta;
      if (nextVal < 0) return prev;
      const currentTotal = prev.kids + prev.male + prev.female;
      if (delta > 0 && currentTotal >= MAX_TOTAL_GUESTS) return prev;
      return {
        ...prev,
        [category]: nextVal
      };
    });
  };

  // Check if slot is available given a date and current clock time
  const isSlotAvailableForDate = (slot, targetDate) => {
    if (!targetDate) return false;

    // Friday prayer break (1:00 PM – 2:30 PM)
    if (targetDate.getDay() === 5 && slot.isFridayBreak) {
      return false;
    }

    // If selected date is today, disallow slots earlier than now + 30 mins
    const now = new Date();
    if (targetDate.toDateString() === now.toDateString()) {
      const slotTime = new Date();
      slotTime.setHours(slot.hour, slot.minute, 0, 0);
      if (slotTime.getTime() <= now.getTime() + 30 * 60 * 1000) {
        return false;
      }
    }

    return true;
  };

  const isSlotAvailable = (slot) => isSlotAvailableForDate(slot, selectedDate);

  // Selecting a date opens the Time Selection popup immediately
  const handleChooseDate = (dateObj) => {
    const normalized = new Date(dateObj);
    normalized.setHours(0, 0, 0, 0);
    setSelectedDate(normalized);

    // Clear previously chosen time if it is unavailable for the newly selected date
    if (selectedTimeSlot) {
      const currentSlotObj = ALL_TIME_SLOTS.find((s) => s.id === selectedTimeSlot);
      if (!currentSlotObj || !isSlotAvailableForDate(currentSlotObj, normalized)) {
        setSelectedTimeSlot('');
      }
    }

    setIsCalendarModalOpen(false);
    setIsTimeModalOpen(true);
  };

  const handleSelectTimeFromPopup = (slotId) => {
    setSelectedTimeSlot(slotId);
    setIsTimeModalOpen(false);
    goToStep(4);
  };

  // Calendar calculations
  const calendarDays = useMemo(() => {
    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 90);

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: null, isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      dateObj.setHours(0, 0, 0, 0);
      const isPast = dateObj < today || dateObj > maxDate;
      const isSelected = selectedDate && dateObj.getTime() === selectedDate.getTime();
      const isFriday = dateObj.getDay() === 5;

      days.push({
        dayNumber: day,
        dateObj,
        isCurrentMonth: true,
        isPast,
        isSelected,
        isFriday
      });
    }

    return days;
  }, [calendarViewDate, selectedDate, today]);

  const isPrevMonthDisabled = useMemo(() => {
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return calendarViewDate <= thisMonth;
  }, [calendarViewDate, today]);

  const isNextMonthDisabled = useMemo(() => {
    const maxMonth = new Date(today.getFullYear(), today.getMonth() + 3, 1);
    return calendarViewDate >= maxMonth;
  }, [calendarViewDate, today]);

  const handlePrevMonth = () => {
    if (isPrevMonthDisabled) return;
    setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    if (isNextMonthDisabled) return;
    setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 1));
  };

  // Details Validation
  const validateDetails = () => {
    const errors = {};
    if (!customerDetails.name.trim() || customerDetails.name.trim().length < 2) {
      errors.name = 'Please provide your full name.';
    }

    const cleanPhone = customerDetails.phone.replace(/[\s\-()]/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      errors.phone = 'Please provide a valid phone number (at least 9–11 digits).';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const selectedSlotObject = ALL_TIME_SLOTS.find((s) => s.id === selectedTimeSlot);
  const formattedTimeWithPeriod = selectedSlotObject
    ? `${selectedSlotObject.label} (${selectedSlotObject.period === 'lunch' ? 'Lunch' : 'Dinner'})`
    : selectedTimeSlot || 'Not selected';

  // WhatsApp Message Generator
  const generateWhatsAppMessage = (refId) => {
    const dateStr = selectedDate ? formatFullDate(selectedDate) : 'Not specified';

    let msg = `Hello! I would like to request a table reservation.\n\n`;
    msg += `Booking Details (Ref: ${refId}):\n`;
    msg += `- Guests: ${totalGuests}\n`;
    msg += `- Kids: ${composition.kids}\n`;
    msg += `- Male: ${composition.male}\n`;
    msg += `- Female: ${composition.female}\n`;
    msg += `- Date: ${dateStr}\n`;
    msg += `- Time: ${formattedTimeWithPeriod}\n\n`;
    msg += `Customer Details:\n`;
    msg += `- Name: ${customerDetails.name}\n`;
    msg += `- Phone: ${customerDetails.phone}\n`;

    if (customerDetails.specialRequests.trim()) {
      msg += `\nSpecial Requests:\n${customerDetails.specialRequests.trim()}\n`;
    }

    msg += `\nThank you!`;
    return msg;
  };

  const handleSendViaWhatsApp = async () => {
    if (isSubmittingBooking) return;
    setBookingSubmitError('');

    if (totalGuests < 1) {
      goToStep(1);
      return;
    }
    if (!selectedTimeSlot) {
      goToStep(3);
      return;
    }
    if (!validateDetails()) {
      goToStep(4);
      return;
    }

    setIsSubmittingBooking(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingDate: selectedDate ? formatFullDate(selectedDate) : 'Not specified',
          displayTime: formattedTimeWithPeriod,
          totalGuests,
          composition,
          customer: {
            name: customerDetails.name.trim(),
            phone: customerDetails.phone.trim(),
            specialRequests: customerDetails.specialRequests.trim(),
          },
          source: 'book-a-table',
        }),
      });
      const result = await response.json();
      if (!response.ok || !result?.booking?.referenceNumber) {
        throw new Error(result?.error || 'Could not confirm booking reference. Please try again.');
      }

      const ref = result.booking.referenceNumber;
      setBookingReference(ref);
      setIsSubmitted(true);

      const message = generateWhatsAppMessage(ref);
      const whatsappUrl = `https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } catch (err) {
      setBookingSubmitError(
        err instanceof Error ? err.message : 'Unable to submit booking right now. Please try again.'
      );
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const isTodaySelected = selectedDate.getTime() === today.getTime();
  const isTomorrowSelected = selectedDate.getTime() === tomorrow.getTime();
  const isCustomDateSelected = !isTodaySelected && !isTomorrowSelected;

  const hasAvailableSlotsOnSelectedDate = ALL_TIME_SLOTS.some((slot) => isSlotAvailable(slot));

  // Stepper definition (ClipboardCheck icon on final step instead of star/Sparkles)
  const steps = [
    { number: 1, label: 'People', icon: Users },
    { number: 2, label: 'Date', icon: CalendarIcon },
    { number: 3, label: 'Time', icon: Clock },
    { number: 4, label: 'Details', icon: User },
    { number: 5, label: 'Submit', icon: ClipboardCheck }
  ];

  return (
    <div className="min-h-screen bg-[#0B0708] text-[#F8F3E8] flex flex-col font-sans selection:bg-[#C02636] selection:text-[#F8F3E8]">
      {/* 1. Compact Header Banner */}
      <section className="relative pt-24 pb-6 sm:pt-28 sm:pb-7 border-b border-[#C9A45C]/25 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(138,24,38,0.35)_0%,rgba(11,7,8,0.95)_75%)] pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-5 text-center flex flex-col items-center">
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C9A45C] to-transparent mb-2.5" />

          <span className="text-[11px] uppercase tracking-[0.28em] text-[#F5C369] font-semibold mb-1">
            TABLE RESERVATION
          </span>

          <h1 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl text-[#F8F3E8] font-normal leading-tight">
            Book A Table
          </h1>

          <p className="font-sans text-xs sm:text-sm text-[#D8C5B8] max-w-lg mt-2 font-light leading-relaxed">
            Book a table in our main dining hall or private family rooms. Complete the quick steps below to send your request.
          </p>
        </div>
      </section>

      {/* 2. External Stepper Timeline + Compact Booking Card */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-5 sm:py-7">
        {/* Stepper Timeline Placed Outside the Card */}
        {!isSubmitted && (
          <div className="mb-5 sm:mb-6 px-2 sm:px-4">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-[18px] sm:top-5 h-[2px] bg-[#381017] z-0" />
              <div
                className="absolute left-0 top-[18px] sm:top-5 h-[2px] bg-gradient-to-r from-[#8A1826] via-[#C9A45C] to-[#F5C369] transition-all duration-500 z-0"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />

              {steps.map((s) => {
                const Icon = s.icon;
                const isCompleted = currentStep > s.number;
                const isActive = currentStep === s.number;

                return (
                  <button
                    key={s.number}
                    type="button"
                    onClick={() => {
                      if (isCompleted) {
                        goToStep(s.number);
                      }
                    }}
                    className={`relative z-10 flex flex-col items-center group focus:outline-none ${
                      isCompleted ? 'cursor-pointer' : isActive ? 'cursor-default' : 'cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-md ${
                        isActive
                          ? 'bg-gradient-to-br from-[#8A1826] to-[#C02636] border-2 border-[#F5C369] text-[#F8F3E8] shadow-[0_0_14px_rgba(245,195,105,0.45)] scale-105'
                          : isCompleted
                          ? 'bg-[#18080B] border-2 border-[#C9A45C] text-[#F5C369] group-hover:scale-105'
                          : 'bg-[#18080B] border border-[#381017] text-[#D8C5B8]'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
                    </div>

                    <span
                      className={`text-[9px] sm:text-[11px] font-semibold tracking-wider uppercase mt-1.5 transition-colors ${
                        isActive ? 'text-[#F5C369]' : isCompleted ? 'text-[#F8F3E8]' : 'text-[#D8C5B8]/60'
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Booking Card (Compact Width & Height; Step 1 even more compact) */}
        <div
          className={`bg-[#140608] border border-[#C9A45C]/35 rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.85)] relative overflow-hidden transition-all ${
            currentStep === 1 && !isSubmitted
              ? 'max-w-md mx-auto p-4 sm:p-5'
              : 'p-4 sm:p-6 md:p-7'
          }`}
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-[radial-gradient(circle_at_top_right,rgba(245,195,105,0.08)_0%,transparent_70%)] pointer-events-none" />

          {/* ================= STEP 1: GUEST COMPOSITION ================= */}
          {currentStep === 1 && !isSubmitted && (
            <div className="space-y-3 animate-in fade-in duration-300">
              <div className="border-b border-[#381017] pb-2.5">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#F5C369] font-semibold">
                  STEP 1 OF 5
                </span>
                <h2 className="font-serif-heading text-lg sm:text-xl text-[#F8F3E8] mt-0.5">
                  Guest Composition
                </h2>
                <p className="text-xs text-[#D8C5B8] mt-0.5 font-light">
                  Set the number of kids, male, and female guests.
                </p>
              </div>

              {/* Direct Guest Composition Rows */}
              <div className="space-y-2">
                {/* Total Guests Summary Row */}
                <div className="bg-[#18080B] px-3.5 py-2 rounded-xl border border-[#C9A45C]/35 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D8C5B8]">
                    TOTAL GUESTS
                  </span>
                  <span className="font-serif-heading text-lg sm:text-xl font-bold text-[#F5C369] tabular-nums">
                    {totalGuests}
                  </span>
                </div>

                {/* Category Rows: Kids, Male, Female */}
                {[
                  { key: 'kids', label: 'KIDS', sub: 'Under 12 years' },
                  { key: 'male', label: 'MALE', sub: 'Adult male guests' },
                  { key: 'female', label: 'FEMALE', sub: 'Adult female guests' }
                ].map((cat) => {
                  const count = composition[cat.key];
                  return (
                    <div
                      key={cat.key}
                      className="bg-[#18080B] px-3.5 py-2 rounded-xl border border-[#C9A45C]/25 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#F8F3E8] block">
                          {cat.label}
                        </span>
                        <span className="text-[11px] text-[#D8C5B8]/75 font-light">{cat.sub}</span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleAdjustComposition(cat.key, -1)}
                          disabled={count <= 0}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#C9A45C]/40 flex items-center justify-center transition-all ${
                            count <= 0
                              ? 'opacity-30 cursor-not-allowed bg-[#140608] text-[#D8C5B8]'
                              : 'bg-[#240C11] hover:bg-[#381017] text-[#F5C369] cursor-pointer active:scale-95'
                          }`}
                          aria-label={`Decrease ${cat.label.toLowerCase()} count`}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <span className="w-6 text-center font-serif-heading text-base font-bold text-[#F8F3E8] tabular-nums">
                          {count}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleAdjustComposition(cat.key, 1)}
                          disabled={totalGuests >= MAX_TOTAL_GUESTS}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#C9A45C]/40 flex items-center justify-center transition-all ${
                            totalGuests >= MAX_TOTAL_GUESTS
                              ? 'opacity-30 cursor-not-allowed bg-[#140608] text-[#D8C5B8]'
                              : 'bg-[#240C11] hover:bg-[#381017] text-[#F5C369] cursor-pointer active:scale-95'
                          }`}
                          aria-label={`Increase ${cat.label.toLowerCase()} count`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalGuests < 1 && (
                <p className="text-[11px] text-[#D8C5B8]/80 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-[#F5C369] shrink-0" />
                  <span>Add at least 1 guest to continue.</span>
                </p>
              )}

              {/* Step 1 Actions */}
              <div className="pt-2.5 flex items-center justify-between border-t border-[#381017]">
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#D8C5B8] hover:text-white border border-[#381017] hover:border-[#C9A45C]/40 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>

                <button
                  type="button"
                  disabled={totalGuests < 1}
                  onClick={() => goToStep(2)}
                  className={`inline-flex items-center gap-1.5 px-5 py-2 font-bold text-xs uppercase tracking-wider rounded-full transition-all ${
                    totalGuests < 1
                      ? 'bg-[#240C11] text-[#D8C5B8]/40 border border-[#381017] cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#8A1826] via-[#A81E2E] to-[#C02636] hover:brightness-110 text-[#F8F3E8] shadow-[0_4px_18px_rgba(186,37,53,0.45)] cursor-pointer active:scale-95'
                  }`}
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: CHOOSE YOUR DATE ================= */}
          {currentStep === 2 && !isSubmitted && (
            <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-300">
              <div className="border-b border-[#381017] pb-3">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#F5C369] font-semibold">
                  STEP 2 OF 5
                </span>
                <h2 className="font-serif-heading text-xl sm:text-2xl text-[#F8F3E8] mt-0.5">
                  Choose Your Date
                </h2>
                <p className="text-xs sm:text-sm text-[#D8C5B8] mt-1 font-light">
                  Pick today, tomorrow, or choose another date from the calendar. Past dates are not available.
                </p>
              </div>

              {/* 3-Card Quick Date Picker (Today, Tomorrow, Choose Another Date) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* Today Card */}
                <button
                  type="button"
                  onClick={() => handleChooseDate(today)}
                  className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer select-none ${
                    isTodaySelected
                      ? 'bg-[#240C11] border-[#F5C369] ring-1 ring-[#F5C369]/50 shadow-[0_0_16px_rgba(245,195,105,0.2)]'
                      : 'bg-[#18080B] border-[#381017] hover:border-[#C9A45C]/50 hover:bg-[#1F0A0E]'
                  }`}
                >
                  <span className={isTodaySelected ? 'text-[#F5C369]' : 'text-[#D8C5B8]'}>
                    {isTodaySelected ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Sunrise className="w-4 h-4" />}
                  </span>
                  <span className={`text-xs font-bold uppercase tracking-[0.18em] ${isTodaySelected ? 'text-[#F8F3E8]' : 'text-[#D8C5B8]'}`}>
                    TODAY
                  </span>
                  <span className="text-xs text-[#D8C5B8]/80 font-light">
                    {formatShortDate(today)}
                  </span>
                </button>

                {/* Tomorrow Card */}
                <button
                  type="button"
                  onClick={() => handleChooseDate(tomorrow)}
                  className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer select-none ${
                    isTomorrowSelected
                      ? 'bg-[#240C11] border-[#F5C369] ring-1 ring-[#F5C369]/50 shadow-[0_0_16px_rgba(245,195,105,0.2)]'
                      : 'bg-[#18080B] border-[#381017] hover:border-[#C9A45C]/50 hover:bg-[#1F0A0E]'
                  }`}
                >
                  <span className={isTomorrowSelected ? 'text-[#F5C369]' : 'text-[#D8C5B8]'}>
                    {isTomorrowSelected ? <Check className="w-4 h-4 stroke-[2.5]" /> : <CalendarDays className="w-4 h-4" />}
                  </span>
                  <span className={`text-xs font-bold uppercase tracking-[0.18em] ${isTomorrowSelected ? 'text-[#F8F3E8]' : 'text-[#D8C5B8]'}`}>
                    TOMORROW
                  </span>
                  <span className="text-xs text-[#D8C5B8]/80 font-light">
                    {formatShortDate(tomorrow)}
                  </span>
                </button>

                {/* Choose Another Date Card */}
                <button
                  type="button"
                  onClick={() => setIsCalendarModalOpen(true)}
                  className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer select-none ${
                    isCustomDateSelected
                      ? 'bg-[#240C11] border-[#F5C369] ring-1 ring-[#F5C369]/50 shadow-[0_0_16px_rgba(245,195,105,0.2)]'
                      : 'bg-[#18080B] border-[#381017] hover:border-[#C9A45C]/50 hover:bg-[#1F0A0E]'
                  }`}
                >
                  <span className={isCustomDateSelected ? 'text-[#F5C369]' : 'text-[#D8C5B8]'}>
                    {isCustomDateSelected ? <Check className="w-4 h-4 stroke-[2.5]" /> : <CalendarIcon className="w-4 h-4" />}
                  </span>
                  <span className={`text-xs font-bold uppercase tracking-[0.15em] ${isCustomDateSelected ? 'text-[#F8F3E8]' : 'text-[#D8C5B8]'}`}>
                    CHOOSE ANOTHER DATE
                  </span>
                  <span className="text-xs text-[#D8C5B8]/80 font-light">
                    {isCustomDateSelected ? formatShortDate(selectedDate) : 'Open calendar'}
                  </span>
                </button>
              </div>

              {/* Selected Date Readout */}
              <div className="text-center pt-1">
                <p className="text-xs sm:text-sm text-[#D8C5B8]">
                  Selected date:{' '}
                  <span className="text-[#F5C369] font-medium">
                    {formatFullDate(selectedDate)}
                  </span>
                </p>
              </div>

              {/* Step 2 Actions */}
              <div className="pt-3 flex items-center justify-between border-t border-[#381017]">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#D8C5B8] hover:text-white border border-[#381017] hover:border-[#C9A45C]/40 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsTimeModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#8A1826] via-[#A81E2E] to-[#C02636] hover:brightness-110 text-[#F8F3E8] font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-[0_4px_18px_rgba(186,37,53,0.45)] cursor-pointer active:scale-95"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: TIME (Accessible via Stepper / Back) ================= */}
          {currentStep === 3 && !isSubmitted && (
            <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-300">
              <div className="border-b border-[#381017] pb-3">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#F5C369] font-semibold">
                  STEP 3 OF 5
                </span>
                <h2 className="font-serif-heading text-xl sm:text-2xl text-[#F8F3E8] mt-0.5">
                  Select a Reservation Time
                </h2>
                <p className="text-xs sm:text-sm text-[#D8C5B8] mt-1 font-light">
                  {formatFullDate(selectedDate)}
                  {selectedDate.getDay() === 5 && (
                    <span className="text-[#F5C369] ml-1.5 font-medium">
                      (Friday break: 1:00 PM – 2:30 PM)
                    </span>
                  )}
                </p>
              </div>

              {!hasAvailableSlotsOnSelectedDate ? (
                <div className="p-4 rounded-xl bg-[#18080B] border border-[#C9A45C]/30 text-center space-y-2">
                  <p className="text-xs sm:text-sm text-[#D8C5B8]">
                    No remaining time slots are available for today. Please go back and pick tomorrow or another date.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Lunch Slots */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C9A45C] block">
                      Lunch & Afternoon (12:00 PM – 4:30 PM)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {ALL_TIME_SLOTS.filter((s) => s.period === 'lunch').map((slot) => {
                        const available = isSlotAvailable(slot);
                        const isSelected = selectedTimeSlot === slot.id;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            disabled={!available}
                            onClick={() => setSelectedTimeSlot(slot.id)}
                            className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all flex flex-col items-center justify-center select-none ${
                              !available
                                ? 'bg-[#18080B]/40 border border-[#381017]/40 text-[#D8C5B8]/30 cursor-not-allowed line-through'
                                : isSelected
                                ? 'bg-gradient-to-r from-[#8A1826] to-[#C02636] border border-[#F5C369] text-[#F8F3E8] shadow-[0_0_12px_rgba(245,195,105,0.35)] font-bold cursor-pointer'
                                : 'bg-[#18080B] hover:bg-[#240C11] border border-[#C9A45C]/30 text-[#F8F3E8] hover:border-[#F5C369] cursor-pointer active:scale-95'
                            }`}
                          >
                            <span>{slot.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dinner Slots */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C9A45C] block">
                      Dinner & Evening (5:00 PM – 10:00 PM)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {ALL_TIME_SLOTS.filter((s) => s.period === 'dinner').map((slot) => {
                        const available = isSlotAvailable(slot);
                        const isSelected = selectedTimeSlot === slot.id;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            disabled={!available}
                            onClick={() => setSelectedTimeSlot(slot.id)}
                            className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all flex flex-col items-center justify-center select-none ${
                              !available
                                ? 'bg-[#18080B]/40 border border-[#381017]/40 text-[#D8C5B8]/30 cursor-not-allowed line-through'
                                : isSelected
                                ? 'bg-gradient-to-r from-[#8A1826] to-[#C02636] border border-[#F5C369] text-[#F8F3E8] shadow-[0_0_12px_rgba(245,195,105,0.35)] font-bold cursor-pointer'
                                : 'bg-[#18080B] hover:bg-[#240C11] border border-[#C9A45C]/30 text-[#F8F3E8] hover:border-[#F5C369] cursor-pointer active:scale-95'
                            }`}
                          >
                            <span>{slot.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 Actions */}
              <div className="pt-3 flex items-center justify-between border-t border-[#381017]">
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#D8C5B8] hover:text-white border border-[#381017] hover:border-[#C9A45C]/40 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  disabled={!selectedTimeSlot || !hasAvailableSlotsOnSelectedDate}
                  onClick={() => goToStep(4)}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 font-bold text-xs uppercase tracking-wider rounded-full transition-all ${
                    !selectedTimeSlot || !hasAvailableSlotsOnSelectedDate
                      ? 'bg-[#240C11] text-[#D8C5B8]/40 border border-[#381017] cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#8A1826] via-[#A81E2E] to-[#C02636] hover:brightness-110 text-[#F8F3E8] shadow-[0_4px_18px_rgba(186,37,53,0.45)] cursor-pointer active:scale-95'
                  }`}
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: GUEST DETAILS (NO SEATING AREA SELECTOR) ================= */}
          {currentStep === 4 && !isSubmitted && (
            <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-300">
              <div className="border-b border-[#381017] pb-3">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#F5C369] font-semibold">
                  STEP 4 OF 5
                </span>
                <h2 className="font-serif-heading text-xl sm:text-2xl text-[#F8F3E8] mt-0.5">
                  Guest Details
                </h2>
                <p className="text-xs sm:text-sm text-[#D8C5B8] mt-1 font-light">
                  Enter your name and phone number so our reservations desk can confirm your booking.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#C9A45C] block">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#C9A45C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={customerDetails.name}
                        onChange={(e) => {
                          setCustomerDetails({ ...customerDetails, name: e.target.value });
                          if (formErrors.name) setFormErrors({ ...formErrors, name: null });
                        }}
                        placeholder="e.g. Asad Khattak"
                        className={`w-full pl-10 pr-3.5 py-2.5 bg-[#18080B] rounded-xl text-xs sm:text-sm text-[#F8F3E8] placeholder-[#D8C5B8]/50 focus:outline-none transition-colors ${
                          formErrors.name
                            ? 'border-2 border-red-500'
                            : 'border border-[#C9A45C]/35 focus:border-[#F5C369]'
                        }`}
                      />
                    </div>
                    {formErrors.name && (
                      <p className="text-[11px] text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#C9A45C] block">
                      Phone / WhatsApp Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#C9A45C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        value={customerDetails.phone}
                        onChange={(e) => {
                          setCustomerDetails({ ...customerDetails, phone: e.target.value });
                          if (formErrors.phone) setFormErrors({ ...formErrors, phone: null });
                        }}
                        placeholder="e.g. 0332 7515538"
                        className={`w-full pl-10 pr-3.5 py-2.5 bg-[#18080B] rounded-xl text-xs sm:text-sm text-[#F8F3E8] placeholder-[#D8C5B8]/50 focus:outline-none transition-colors ${
                          formErrors.phone
                            ? 'border-2 border-red-500'
                            : 'border border-[#C9A45C]/35 focus:border-[#F5C369]'
                        }`}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-[11px] text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Special Requests */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#C9A45C] block">
                      Special Requests (Optional)
                    </label>
                    <span className="text-[11px] text-[#D8C5B8]/60">Optional</span>
                  </div>
                  <textarea
                    rows={2}
                    value={customerDetails.specialRequests}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, specialRequests: e.target.value })}
                    placeholder="e.g. Birthday setup, high chair for kids, quiet table..."
                    className="w-full p-3 bg-[#18080B] border border-[#C9A45C]/35 rounded-xl text-xs sm:text-sm text-[#F8F3E8] placeholder-[#D8C5B8]/50 focus:outline-none focus:border-[#F5C369] transition-colors leading-relaxed"
                  />
                </div>
              </div>

              {/* Step 4 Actions */}
              <div className="pt-3 flex items-center justify-between border-t border-[#381017]">
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#D8C5B8] hover:text-white border border-[#381017] hover:border-[#C9A45C]/40 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (validateDetails()) {
                      goToStep(5);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#8A1826] via-[#A81E2E] to-[#C02636] hover:brightness-110 text-[#F8F3E8] font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-[0_4px_18px_rgba(186,37,53,0.45)] cursor-pointer active:scale-95"
                >
                  <span>Review & Submit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 5: REVIEW & SUBMIT ================= */}
          {currentStep === 5 && !isSubmitted && (
            <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-300">
              <div className="border-b border-[#381017] pb-3">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#F5C369] font-semibold">
                  STEP 5 OF 5
                </span>
                <h2 className="font-serif-heading text-xl sm:text-2xl text-[#F8F3E8] mt-0.5">
                  Review & Submit
                </h2>
                <p className="text-xs sm:text-sm text-[#D8C5B8] mt-1 font-light">
                  Check every detail below, then send your request on WhatsApp.
                </p>
              </div>

              {/* Two-Column Party & Reservation Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                {/* YOUR PARTY */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F5C369]">
                      YOUR PARTY
                    </span>
                    <button
                      type="button"
                      onClick={() => goToStep(1)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#C9A45C] hover:text-[#F5C369] transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>EDIT</span>
                    </button>
                  </div>

                  <div className="bg-[#18080B] border border-[#C9A45C]/30 rounded-xl divide-y divide-[#381017] text-xs">
                    <div className="flex items-center justify-between px-3.5 py-2.5">
                      <span className="text-[#D8C5B8]">Total Guests</span>
                      <span className="font-bold text-[#F8F3E8] tabular-nums">{totalGuests}</span>
                    </div>
                    <div className="flex items-center justify-between px-3.5 py-2.5">
                      <span className="text-[#D8C5B8]">Kids</span>
                      <span className="font-bold text-[#F8F3E8] tabular-nums">{composition.kids}</span>
                    </div>
                    <div className="flex items-center justify-between px-3.5 py-2.5">
                      <span className="text-[#D8C5B8]">Male</span>
                      <span className="font-bold text-[#F8F3E8] tabular-nums">{composition.male}</span>
                    </div>
                    <div className="flex items-center justify-between px-3.5 py-2.5">
                      <span className="text-[#D8C5B8]">Female</span>
                      <span className="font-bold text-[#F8F3E8] tabular-nums">{composition.female}</span>
                    </div>
                  </div>
                </div>

                {/* RESERVATION */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F5C369]">
                      RESERVATION
                    </span>
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#C9A45C] hover:text-[#F5C369] transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>EDIT</span>
                    </button>
                  </div>

                  <div className="bg-[#18080B] border border-[#C9A45C]/30 rounded-xl divide-y divide-[#381017] text-xs">
                    <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                      <span className="text-[#D8C5B8] shrink-0">Date</span>
                      <span className="font-semibold text-[#F8F3E8] text-right">
                        {formatFullDate(selectedDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                      <span className="text-[#D8C5B8] shrink-0">Seating Time</span>
                      <span className="font-semibold text-[#F8F3E8] text-right">
                        {formattedTimeWithPeriod}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* GUEST DETAILS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F5C369]">
                    GUEST DETAILS
                  </span>
                  <button
                    type="button"
                    onClick={() => goToStep(4)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#C9A45C] hover:text-[#F5C369] transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>EDIT</span>
                  </button>
                </div>

                <div className="bg-[#18080B] border border-[#C9A45C]/30 rounded-xl divide-y divide-[#381017] text-xs">
                  <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                    <span className="text-[#D8C5B8]">Name</span>
                    <span className="font-semibold text-[#F8F3E8]">{customerDetails.name}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                    <span className="text-[#D8C5B8]">Phone Number</span>
                    <span className="font-semibold text-[#F8F3E8] font-mono tabular-nums">
                      {customerDetails.phone}
                    </span>
                  </div>
                  {customerDetails.specialRequests.trim() && (
                    <div className="flex items-start justify-between gap-4 px-3.5 py-2.5">
                      <span className="text-[#D8C5B8] shrink-0">Special Requests</span>
                      <span className="text-[#F8F3E8] text-right italic">
                        {customerDetails.specialRequests.trim()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* WhatsApp Confirmation Disclaimer */}
              <div className="p-3.5 rounded-xl bg-[#1C0A0E] border border-[#C9A45C]/35 flex items-start gap-2.5 text-xs text-[#D8C5B8] leading-relaxed">
                <AlertCircle className="w-4 h-4 text-[#F5C369] shrink-0 mt-0.5" />
                <p>
                  Confirming sends a booking <strong className="text-[#F8F3E8]">request</strong> through WhatsApp — your table is not confirmed until our reservations team replies with availability.
                </p>
              </div>

              {/* Step 5 Footer Row */}
              <div className="pt-3 border-t border-[#381017] space-y-2.5">
                {bookingSubmitError && (
                  <p className="text-xs text-red-400 bg-red-950/40 border border-red-400/40 rounded-lg px-3 py-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{bookingSubmitError}</span>
                  </p>
                )}

                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => goToStep(4)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#D8C5B8] hover:text-white border border-[#381017] hover:border-[#C9A45C]/40 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmittingBooking}
                    onClick={handleSendViaWhatsApp}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#8A1826] via-[#A81E2E] to-[#C02636] hover:brightness-110 text-[#F8F3E8] font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-[0_6px_20px_rgba(186,37,53,0.45)] cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{isSubmittingBooking ? 'Assigning Reference...' : 'Confirm Table Request'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-[#D8C5B8]/65">
                  * Cancellation policy: 24 hours complimentary notice.
                </p>
              </div>
            </div>
          )}

          {/* ================= REQUEST DISPATCHED RECEIPT ================= */}
          {isSubmitted && (
            <div className="py-5 sm:py-6 text-center space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#240C11] to-[#381017] border-2 border-[#F5C369] flex items-center justify-center mx-auto text-[#F5C369] shadow-xl">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#F5C369] font-semibold">
                  BOOKING REQUEST SENT
                </span>
                <h2 className="font-serif-heading text-2xl sm:text-3xl text-[#F8F3E8]">
                  Thank You, {customerDetails.name}!
                </h2>
                <p className="text-xs sm:text-sm text-[#D8C5B8] max-w-md mx-auto leading-relaxed font-light">
                  Your table request for <strong>{totalGuests} guests</strong> has been prepared for the Pearl Oasis reservations desk.
                </p>
                <div className="inline-flex items-center gap-2 bg-[#18080B] px-3.5 py-1 rounded-full border border-[#C9A45C]/35 text-xs font-mono text-[#F5C369] mt-1">
                  <span>Reference: {bookingReference}</span>
                </div>
              </div>

              <div className="bg-[#18080B] rounded-xl border border-[#C9A45C]/35 p-4 text-left max-w-md mx-auto space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-[#381017] pb-2">
                  <span className="text-[#D8C5B8]">Date</span>
                  <span className="text-[#F8F3E8] font-medium">{formatFullDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between border-b border-[#381017] pb-2">
                  <span className="text-[#D8C5B8]">Time</span>
                  <span className="text-[#F8F3E8] font-medium">{formattedTimeWithPeriod}</span>
                </div>
                <div className="flex justify-between border-b border-[#381017] pb-2">
                  <span className="text-[#D8C5B8]">Party Size</span>
                  <span className="text-[#F8F3E8] font-medium">
                    {totalGuests} Guests ({composition.kids}K · {composition.male}M · {composition.female}F)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#D8C5B8]">Contact</span>
                  <span className="text-[#F5C369] font-medium font-mono tabular-nums">{customerDetails.phone}</span>
                </div>
              </div>

              <p className="text-xs text-[#D8C5B8] max-w-md mx-auto leading-relaxed italic">
                Our reservations team will reply via WhatsApp or phone call to confirm availability.
              </p>

              <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const message = generateWhatsAppMessage(bookingReference);
                    const whatsappUrl = `https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#240C11] hover:bg-[#381017] text-[#25D366] border border-[#25D366]/40 hover:border-[#25D366] text-xs font-semibold uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open WhatsApp Again</span>
                </button>

                <button
                  type="button"
                  onClick={onBackToHome}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#8A1826] via-[#A81E2E] to-[#C02636] hover:brightness-110 text-[#F8F3E8] text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-md cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= CALENDAR POPUP MODAL (CHOOSE ANOTHER DATE) ================= */}
      {isCalendarModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsCalendarModalOpen(false)}
        >
          <div
            className="max-w-sm w-full bg-[#140608] border border-[#C9A45C]/60 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsCalendarModalOpen(false)}
              className="absolute top-3.5 right-3.5 text-[#D8C5B8] hover:text-[#F5C369] bg-[#18080B] p-1.5 rounded-full border border-[#C9A45C]/30 transition-colors cursor-pointer"
              aria-label="Close calendar"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4 pr-8">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#F5C369] font-semibold">
                SELECT DATE
              </span>
              <h3 className="font-serif-heading text-lg text-[#F8F3E8]">
                Choose a Date
              </h3>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={isPrevMonthDisabled}
                className={`p-1.5 rounded-full border border-[#C9A45C]/30 text-[#F5C369] hover:bg-[#240C11] transition-all ${
                  isPrevMonthDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer active:scale-95'
                }`}
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-serif-heading text-base font-bold text-[#F8F3E8]">
                {MONTH_NAMES[calendarViewDate.getMonth()]} {calendarViewDate.getFullYear()}
              </span>

              <button
                type="button"
                onClick={handleNextMonth}
                disabled={isNextMonthDisabled}
                className={`p-1.5 rounded-full border border-[#C9A45C]/30 text-[#F5C369] hover:bg-[#240C11] transition-all ${
                  isNextMonthDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer active:scale-95'
                }`}
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#C9A45C] pb-1.5 border-b border-[#381017]">
              {DAYS_OF_WEEK.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 pt-2">
              {calendarDays.map((item, idx) => {
                if (!item.isCurrentMonth) {
                  return <div key={`empty-${idx}`} className="h-9" />;
                }

                return (
                  <button
                    key={`day-${item.dayNumber}`}
                    type="button"
                    disabled={item.isPast}
                    onClick={() => handleChooseDate(item.dateObj)}
                    className={`h-9 rounded-lg text-xs font-semibold flex flex-col items-center justify-center transition-all relative select-none ${
                      item.isPast
                        ? 'text-[#D8C5B8]/25 cursor-not-allowed line-through'
                        : item.isSelected
                        ? 'bg-gradient-to-br from-[#8A1826] to-[#C02636] border border-[#F5C369] text-[#F8F3E8] font-bold cursor-pointer'
                        : 'bg-[#18080B] hover:bg-[#240C11] text-[#F8F3E8] hover:text-[#F5C369] border border-[#381017] hover:border-[#C9A45C]/50 cursor-pointer'
                    }`}
                  >
                    <span>{item.dayNumber}</span>
                    {item.isFriday && !item.isPast && !item.isSelected && (
                      <span className="w-1 h-1 rounded-full bg-[#C9A45C]/70 absolute bottom-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-[#D8C5B8]/70 mt-3 pt-2.5 border-t border-[#381017] text-center">
              Friday prayer break: 1:00 PM – 2:30 PM
            </p>
          </div>
        </div>
      )}

      {/* ================= TIME SELECTION POPUP MODAL ================= */}
      {isTimeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsTimeModalOpen(false)}
        >
          <div
            className="max-w-md w-full bg-[#140608] border border-[#C9A45C]/60 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsTimeModalOpen(false)}
              className="absolute top-3.5 right-3.5 text-[#D8C5B8] hover:text-[#F5C369] bg-[#18080B] p-1.5 rounded-full border border-[#C9A45C]/30 transition-colors cursor-pointer"
              aria-label="Close time selection"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 mb-4 border-b border-[#381017] pb-3 pr-8">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#F5C369] font-semibold">
                STEP 3 OF 5 · SELECT TIME
              </span>
              <h3 className="font-serif-heading text-lg sm:text-xl text-[#F8F3E8]">
                Choose a Time
              </h3>
              <p className="text-xs text-[#D8C5B8] font-light">
                {formatFullDate(selectedDate)}
                {selectedDate.getDay() === 5 && (
                  <span className="text-[#F5C369] ml-1">(Friday break: 1:00–2:30 PM)</span>
                )}
              </p>
            </div>

            {!hasAvailableSlotsOnSelectedDate ? (
              <div className="py-4 text-center space-y-3">
                <p className="text-xs sm:text-sm text-[#D8C5B8]">
                  No remaining time slots are available for today. Please select Tomorrow or choose another date.
                </p>
                <button
                  type="button"
                  onClick={() => setIsTimeModalOpen(false)}
                  className="px-5 py-2 rounded-full bg-[#240C11] border border-[#C9A45C]/40 text-xs font-semibold text-[#F5C369] hover:text-white cursor-pointer"
                >
                  Choose Another Date
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Lunch Slots */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C9A45C] block">
                    Lunch & Afternoon (12:00 PM – 4:30 PM)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ALL_TIME_SLOTS.filter((s) => s.period === 'lunch').map((slot) => {
                      const available = isSlotAvailable(slot);
                      const isSelected = selectedTimeSlot === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={!available}
                          onClick={() => handleSelectTimeFromPopup(slot.id)}
                          className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all select-none ${
                            !available
                              ? 'bg-[#18080B]/40 border border-[#381017]/40 text-[#D8C5B8]/30 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-gradient-to-r from-[#8A1826] to-[#C02636] border border-[#F5C369] text-[#F8F3E8] shadow-[0_0_12px_rgba(245,195,105,0.35)] font-bold cursor-pointer'
                              : 'bg-[#18080B] hover:bg-[#240C11] border border-[#C9A45C]/30 text-[#F8F3E8] hover:border-[#F5C369] cursor-pointer active:scale-95'
                          }`}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dinner Slots */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C9A45C] block">
                    Dinner & Evening (5:00 PM – 10:00 PM)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ALL_TIME_SLOTS.filter((s) => s.period === 'dinner').map((slot) => {
                      const available = isSlotAvailable(slot);
                      const isSelected = selectedTimeSlot === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={!available}
                          onClick={() => handleSelectTimeFromPopup(slot.id)}
                          className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all select-none ${
                            !available
                              ? 'bg-[#18080B]/40 border border-[#381017]/40 text-[#D8C5B8]/30 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-gradient-to-r from-[#8A1826] to-[#C02636] border border-[#F5C369] text-[#F8F3E8] shadow-[0_0_12px_rgba(245,195,105,0.35)] font-bold cursor-pointer'
                              : 'bg-[#18080B] hover:bg-[#240C11] border border-[#C9A45C]/30 text-[#F8F3E8] hover:border-[#F5C369] cursor-pointer active:scale-95'
                          }`}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
