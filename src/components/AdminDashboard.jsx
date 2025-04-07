// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  // Simple authentication for demo purposes
  const adminPassword = 'green123'; // In a real app, use proper authentication

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === adminPassword) {
      setAuthenticated(true);
      fetchAppointments();
    } else {
      setError('Invalid password');
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.getAppointments();
      setAppointments(response);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments');
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (!authenticated) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Appointment Dashboard</h2>
        <button
          onClick={() => setAuthenticated(false)}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p className="text-center py-4">Loading appointments...</p>
      ) : appointments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Time</th>
                <th className="py-2 px-4 text-left">Service</th>
                <th className="py-2 px-4 text-left">Customer</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-t">
                  <td className="py-2 px-4">{formatDate(appointment.date)}</td>
                  <td className="py-2 px-4">{appointment.timeSlot}</td>
                  <td className="py-2 px-4">{appointment.serviceType}</td>
                  <td className="py-2 px-4">{appointment.customerName}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        appointment.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : appointment.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center py-4">No appointments found.</p>
      )}
    </div>
  );
};

export default AdminDashboard;