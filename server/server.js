const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Twilio setup
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Data storage paths
const appointmentsPath = path.join(__dirname, 'data', 'appointments.json');
const customersPath = path.join(__dirname, 'data', 'customers.json');

async function ensureDataDirectoryExists() {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.access(dataDir);
  } catch (error) {
    await fs.mkdir(dataDir, { recursive: true });
    console.log('Created data directory');
  }
}

// Initialize data files if they don't exist
async function initializeDataFiles() {
  try {
    await fs.access(appointmentsPath);
  } catch (error) {
    await fs.writeFile(appointmentsPath, '[]');
  }
  
  try {
    await fs.access(customersPath);
  } catch (error) {
    await fs.writeFile(customersPath, '[]');
  }
}

// Function to send SMS notification
async function sendSMSConfirmation(phoneNumber, appointment, customerName) {
  try {
    const message = await twilioClient.messages.create({
      body: `Hi ${customerName}, your lawn care service is scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.timeSlot}. Reply CONFIRM to confirm. - Green Horizons Lawn Care`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    
    console.log(`SMS sent: ${message.sid}`);
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Get all appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const data = await fs.readFile(appointmentsPath, 'utf8');
    const appointments = JSON.parse(data);
    res.json(appointments);
  } catch (error) {
    console.error('Error reading appointments:', error);
    res.status(500).json({ error: 'Failed to retrieve appointments' });
  }
});

// Create a new appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const { name, email, phone, address, lotSize, serviceType, date, timeSlot, notes } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !address || !serviceType || !date || !timeSlot) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Format phone number (strip non-digits)
    const formattedPhone = phone.replace(/\D/g, '');
    
    // Save customer
    const customer = {
      id: Date.now(),
      name,
      email,
      phone: formattedPhone,
      address,
      createdAt: new Date().toISOString()
    };
    
    // Get existing customers
    const customersData = await fs.readFile(customersPath, 'utf8');
    const customers = JSON.parse(customersData);
    customers.push(customer);
    await fs.writeFile(customersPath, JSON.stringify(customers, null, 2));
    
    // Create appointment
    const appointment = {
      id: Date.now() + 1,
      customerId: customer.id,
      serviceType,
      lotSize,
      date,
      timeSlot,
      notes,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    
    // Get existing appointments
    const appointmentsData = await fs.readFile(appointmentsPath, 'utf8');
    const appointments = JSON.parse(appointmentsData);
    
    // Check for conflicts
    const conflictingAppointment = appointments.find(
      app => app.date === date && app.timeSlot === timeSlot && app.status !== 'cancelled'
    );
    
    if (conflictingAppointment) {
      return res.status(409).json({ error: 'This time slot is no longer available' });
    }
    
    // Save the appointment
    appointments.push(appointment);
    await fs.writeFile(appointmentsPath, JSON.stringify(appointments, null, 2));
    
    // Send SMS confirmation
    const smsSent = await sendSMSConfirmation(formattedPhone, appointment, name);
    
    res.status(201).json({
      message: 'Appointment created successfully',
      appointment,
      customer,
      smsSent
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Check available time slots
app.get('/api/available-slots', async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }
    
    // Get existing appointments
    const appointmentsData = await fs.readFile(appointmentsPath, 'utf8');
    const appointments = JSON.parse(appointmentsData);
    
    // Find booked slots for the requested date
    const bookedSlots = appointments
      .filter(app => app.date === date && app.status !== 'cancelled')
      .map(app => app.timeSlot);
    
    // All possible time slots
    const allSlots = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'];
    
    // Available slots are those not booked
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
    
    res.json({ date, availableSlots });
  } catch (error) {
    console.error('Error checking available slots:', error);
    res.status(500).json({ error: 'Failed to check available slots' });
  }
});

// Cancel an appointment
app.put('/api/appointments/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get existing appointments
    const appointmentsData = await fs.readFile(appointmentsPath, 'utf8');
    const appointments = JSON.parse(appointmentsData);
    
    // Find the appointment
    const appointmentIndex = appointments.findIndex(app => app.id.toString() === id);
    
    if (appointmentIndex === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // Update status
    appointments[appointmentIndex].status = 'cancelled';
    appointments[appointmentIndex].updatedAt = new Date().toISOString();
    
    // Save updated appointments
    await fs.writeFile(appointmentsPath, JSON.stringify(appointments, null, 2));
    
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

// Webhook for SMS responses
app.post('/api/sms-webhook', (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();
  
  // Get the incoming message
  const incomingMsg = req.body.Body.trim().toUpperCase();
  const fromPhone = req.body.From;
  
  // Process the response
  if (incomingMsg === 'CONFIRM') {
    twiml.message('Thank you for confirming your appointment with Green Horizons Lawn Care! We look forward to serving you.');
    // You could update the appointment status here
  } else if (incomingMsg === 'CANCEL') {
    twiml.message('We have received your cancellation request. Someone will contact you shortly to reschedule.');
    // You could update the appointment status here
  } else {
    twiml.message('Please reply with CONFIRM to confirm your appointment or CANCEL to cancel it.');
  }
  
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


async function initialize() {
  await ensureDataDirectoryExists();
  await initializeDataFiles();
}

// Update the server startup
initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`SMS webhook endpoint: http://localhost:${PORT}/api/sms-webhook`);
  });
});