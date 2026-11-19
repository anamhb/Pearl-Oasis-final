import React, { useState } from 'react';
import { X, Check, Calendar, Users, Clock } from 'lucide-react';

export default function ReservationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '20:00',
    guests: '4',
    hallPreference: 'Family Hall',
    specialNotes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!formData.name || !formData.phone) return;
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const guestNum = parseInt(formData.guests, 10) || 4;
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingDate: formData.date || 'Flexible Date',
          displayTime: formData.time,
          totalGuests: guestNum,
          hallPreference: formData.hallPreference,
          customer: {
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            specialRequests: formData.specialNotes.trim(),
          },
          source: 'reservation-modal',
        }),
      });
      const result = await response.json();
      if (!response.ok || !result?.booking?.referenceNumber) {
        throw new Error(result?.error || 'Could not submit reservation. Please try again.');
      }
      setBookingReference(result.booking.referenceNumber);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Unable to submit reservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#140608] text-[#F8F3E8] rounded-xl max-w-lg w-full p-6 sm:p-8 border border-[#C9A45C]/40 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 text-[#F5C369] hover:text-white rounded-full border border-[#C9A45C]/30 hover:border-[#F5C369] transition-colors cursor-pointer"
          aria-label="Close Reservation Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 mb-6 border-b border-[#381017] pb-4">
          <div className="text-[10px] uppercase tracking-[0.25em] text-[#F5C369] font-semibold">
            PEARL OASIS · KOHAT CITY CENTRE
          </div>
          <h3 className="font-serif-heading text-2xl sm:text-3xl text-[#F8F3E8]">
            Table Reservation
          </h3>
          <p className="text-xs text-[#D8C5B8] font-light">
            Reserve seating in our main chandelier hall or dedicated private family chambers.
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4 bg-[#18080B] rounded-xl p-6 border border-[#C9A45C]/40">
            <div className="w-12 h-12 rounded-full bg-[#F5C369] text-[#18080B] flex items-center justify-center mx-auto shadow-lg">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h4 className="font-serif-heading text-2xl text-[#F5C369]">
              Reservation Request Received
            </h4>
            {bookingReference && (
              <div className="inline-flex items-center gap-2 bg-[#140608] px-3.5 py-1 rounded-full border border-[#C9A45C]/35 text-xs font-mono text-[#F5C369]">
                <span>Reference: {bookingReference}</span>
              </div>
            )}
            <p className="text-xs text-[#F8F3E8]/80 leading-relaxed max-w-sm mx-auto font-light">
              Thank you, <strong>{formData.name}</strong>. Our front desk has noted your booking for <strong>{formData.guests} guests</strong>. We will confirm via message or call shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-7 py-2.5 bg-gradient-to-r from-[#8A1826] via-[#A81E2E] to-[#C02636] hover:brightness-110 text-[#F8F3E8] text-xs uppercase tracking-wider font-bold rounded-full transition-all cursor-pointer shadow-md"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-[#C9A45C] font-medium">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Khattak"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#18080B] border border-[#C9A45C]/30 rounded-lg text-xs text-[#F8F3E8] focus:outline-none focus:border-[#F5C369]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-[#C9A45C] font-medium">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+92 300 0000000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#18080B] border border-[#C9A45C]/30 rounded-lg text-xs text-[#F8F3E8] focus:outline-none focus:border-[#F5C369]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-[#C9A45C] font-medium">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-[#18080B] border border-[#C9A45C]/30 rounded-lg text-xs text-[#F8F3E8] focus:outline-none focus:border-[#F5C369]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-[#C9A45C] font-medium">
                  Time
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-2 py-2 bg-[#18080B] border border-[#C9A45C]/30 rounded-lg text-xs text-[#F8F3E8] focus:outline-none focus:border-[#F5C369]"
                >
                  <option value="14:00" className="bg-[#18080B]">2:00 PM</option>
                  <option value="15:30" className="bg-[#18080B]">3:30 PM</option>
                  <option value="19:00" className="bg-[#18080B]">7:00 PM</option>
                  <option value="20:00" className="bg-[#18080B]">8:00 PM</option>
                  <option value="21:30" className="bg-[#18080B]">9:30 PM</option>
                  <option value="22:30" className="bg-[#18080B]">10:30 PM</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-[#C9A45C] font-medium">
                  Guests
                </label>
                <select
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className="w-full px-2 py-2 bg-[#18080B] border border-[#C9A45C]/30 rounded-lg text-xs text-[#F8F3E8] focus:outline-none focus:border-[#F5C369]"
                >
                  <option value="2" className="bg-[#18080B]">2 Guests</option>
                  <option value="4" className="bg-[#18080B]">4 Guests</option>
                  <option value="6" className="bg-[#18080B]">6 Guests</option>
                  <option value="8" className="bg-[#18080B]">8 Guests</option>
                  <option value="12+" className="bg-[#18080B]">12+ Guests</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[#C9A45C] font-medium">
                Preferred Seating
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Family Hall', 'Main Dining Hall'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, hallPreference: type })}
                    className={`py-2 px-3 text-xs rounded-lg transition-all cursor-pointer ${
                      formData.hallPreference === type
                        ? 'bg-gradient-to-r from-[#8A1826] to-[#C02636] text-[#F8F3E8] font-semibold'
                        : 'bg-[#18080B] border border-[#C9A45C]/30 text-[#D8C5B8] hover:border-[#F5C369]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {submitError && (
              <p className="text-xs text-red-400 bg-red-950/40 border border-red-400/40 rounded-lg px-3 py-2">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#8A1826] via-[#A81E2E] to-[#C02636] hover:from-[#9B1C28] hover:to-[#D12B3D] hover:brightness-110 text-[#F8F3E8] text-xs uppercase tracking-wider font-bold rounded-full transition-all cursor-pointer shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Assigning Reference...' : 'Confirm Reservation Request'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
