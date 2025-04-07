import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import api from '../services/api';

const LawnCareScheduler = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    lotSize: 'medium',
    serviceType: 'mowing',
    date: '',
    timeSlot: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Available default time slots (before API check)
  const defaultTimeSlots = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'];
  
  // Fetch available time slots when date changes
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (formData.date) {
        try {
          setLoading(true);
          const slots = await api.getAvailableSlots(formData.date);
          setAvailableTimeSlots(slots);
          // Clear selected time slot if no longer available
          if (formData.timeSlot && !slots.includes(formData.timeSlot)) {
            setFormData(prev => ({ ...prev, timeSlot: '' }));
          }
        } catch (err) {
          console.error("Failed to fetch available slots:", err);
          setError("Unable to load available time slots. Please try again.");
          setAvailableTimeSlots(defaultTimeSlots);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAvailableSlots();
  }, [formData.date]);

  // Mock available dates (next 14 days excluding Sundays)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      // Skip Sundays (0 is Sunday in getDay())
      if (date.getDay() !== 0) {
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        });
      }
    }
    return dates;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.createAppointment(formData);
      console.log("Appointment created:", response);
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to create appointment:", err);
      if (err.response && err.response.status === 409) {
        setError("This time slot is no longer available. Please select another time.");
      } else {
        setError("Failed to book your appointment. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setError(null);
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setError(null);
    setStep(step - 1);
  };

  const renderServiceDetails = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Service Details</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Property Size</label>
        <select 
          name="lotSize" 
          value={formData.lotSize} 
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="small">Small (Less than 5,000 sq ft)</option>
          <option value="medium">Medium (5,000 - 10,000 sq ft)</option>
          <option value="large">Large (Over 10,000 sq ft)</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Service Type</label>
        <select 
          name="serviceType" 
          value={formData.serviceType} 
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="mowing">Lawn Mowing</option>
          <option value="edging">Edging & Trimming</option>
          <option value="fertilization">Fertilization</option>
          <option value="cleanup">Yard Cleanup</option>
          <option value="aeration">Lawn Aeration</option>
        </select>
      </div>
      
      <div className="flex justify-between mt-6">
        <button 
          onClick={prevStep} 
          className="px-6 py-2 border rounded-lg hover:bg-gray-100"
          disabled={loading}
        >
          Back
        </button>
        <button 
          onClick={nextStep} 
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          disabled={loading}
        >
          Next: Schedule Time
        </button>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Full Name</label>
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Phone Number</label>
        <input 
          type="tel" 
          name="phone" 
          value={formData.phone} 
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          placeholder="(555) 555-5555"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Email Address</label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Property Address</label>
        <input 
          type="text" 
          name="address" 
          value={formData.address} 
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <button 
          type="button"
          className="px-6 py-2 border rounded-lg"
          disabled={true}
        >
          Back
        </button>
        <button 
          onClick={nextStep} 
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          disabled={!formData.name || !formData.phone || !formData.email || !formData.address || loading}
        >
          Next: Select Service
        </button>
      </div>
    </div>
  );

  const renderDateSelection = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Select Date & Time</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Preferred Date</label>
        <select 
          name="date" 
          value={formData.date} 
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a date</option>
          {getAvailableDates().map(date => (
            <option key={date.value} value={date.value}>{date.label}</option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Preferred Time</label>
        {loading ? (
          <div className="flex justify-center py-4">
            <span className="text-gray-500">Loading available times...</span>
          </div>
        ) : (
          <>
            {availableTimeSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
                {availableTimeSlots.map(time => (
                  <button
                    key={time}
                    type="button"
                    className={`p-2 border rounded ${formData.timeSlot === time ? 'bg-green-100 border-green-600' : 'hover:bg-gray-100'}`}
                    onClick={() => setFormData({...formData, timeSlot: time})}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-amber-600">
                No available time slots for this date. Please select another date.
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Special Instructions</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full p-2 border rounded h-24"
          placeholder="Any gates to access? Pets in yard? Special areas to focus on?"
        ></textarea>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <button 
          onClick={prevStep} 
          className="px-6 py-2 border rounded-lg hover:bg-gray-100"
          disabled={loading}
        >
          Back
        </button>
        <button 
          onClick={handleSubmit} 
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          disabled={!formData.date || !formData.timeSlot || loading}
        >
          {loading ? 'Booking...' : 'Complete Booking'}
        </button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold mb-2">Booking Confirmed!</h2>
      <p className="text-gray-600 mb-6">
        Thank you for scheduling with Green Horizons Lawn Care. We'll see you on {new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {formData.timeSlot}.
      </p>
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="font-medium mb-2">Booking Details:</h3>
        <p><strong>Service:</strong> {formData.serviceType.replace(/^\w/, c => c.toUpperCase())}</p>
        <p><strong>Address:</strong> {formData.address}</p>
        <p><strong>Contact:</strong> {formData.phone}</p>
      </div>
      <p className="text-sm text-gray-500 mb-2">
        You'll receive a confirmation text message shortly. Reply "CONFIRM" to confirm your appointment.
      </p>
      <p className="text-sm text-gray-500">
        Need to make changes? Call us at (555) 123-4567
      </p>
      <button 
        onClick={() => {
          setSubmitted(false);
          setStep(1);
          setFormData({
            name: '',
            phone: '',
            email: '',
            address: '',
            lotSize: 'medium',
            serviceType: 'mowing',
            date: '',
            timeSlot: '',
            notes: ''
          });
        }} 
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
      >
        Book Another Service
      </button>
    </div>
  );

  return (
    <div className="bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Calendar className="h-6 w-6 text-green-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Green Horizons Lawn Care</h1>
        </div>
        
        {!submitted ? (
          <>
            <div className="mb-6">
              <div className="flex items-center">
                {[1, 2, 3].map(i => (
                  <React.Fragment key={i}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= i ? 'bg-green-600 text-white' : 'bg-gray-300'
                    }`}>
                      {i}
                    </div>
                    {i < 3 && (
                      <div className={`h-1 flex-1 ${step > i ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span>Your Info</span>
                <span>Service Details</span>
                <span>Schedule</span>
              </div>
            </div>

            {step === 1 && renderContactInfo()}
            {step === 2 && renderServiceDetails()}
            {step === 3 && renderDateSelection()}
          </>
        ) : renderConfirmation()}
      </div>
    </div>
  );
};

export default LawnCareScheduler;