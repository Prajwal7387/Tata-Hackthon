import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Machine from '../server/models/Machine.js';
import Ticket from '../server/models/Ticket.js';
import Incident from '../server/models/Incident.js';

dotenv.config({ path: '../server/.env' });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/voiceedge';

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Database connected.');

    // Clear existing collections
    await Machine.deleteMany({});
    await Ticket.deleteMany({});
    await Incident.deleteMany({});
    console.log('Cleared existing collections.');

    // Seed Machines
    const machines = [
      {
        name: 'Conveyor Belt C-101',
        type: 'Mechanical Drive',
        status: 'Operational',
        temperature: 38.4,
        pressure: 1.2,
        vibration: 2.1,
        efficiency: 98,
        operator: 'H. Miller',
      },
      {
        name: 'Hydraulic Press H-202',
        type: 'Fluid Mechanics',
        status: 'Maintenance',
        temperature: 55.2,
        pressure: 120.5,
        vibration: 5.6,
        efficiency: 85,
        operator: 'A. Patel',
      },
      {
        name: 'Rotary Kiln R-303',
        type: 'Thermal Furnace',
        status: 'Operational',
        temperature: 850.0,
        pressure: 0.8,
        vibration: 1.8,
        efficiency: 94,
        operator: 'R. Davis',
      },
      {
        name: 'Cooling Tower T-404',
        type: 'Heat Exchange',
        status: 'Offline',
        temperature: 15.1,
        pressure: 0.2,
        vibration: 12.4,
        efficiency: 0,
        operator: 'Unassigned',
      },
      {
        name: 'Steam Boiler B-505',
        type: 'Thermal Boiler',
        status: 'Operational',
        temperature: 195.8,
        pressure: 15.4,
        vibration: 2.9,
        efficiency: 91,
        operator: 'S. Kovich',
      },
    ];
    await Machine.insertMany(machines);
    console.log('Seeded machines database.');

    // Seed Tickets
    const tickets = [
      {
        title: 'Vibration Anomaly Inspection',
        description: 'Vibration index on Cooling Tower T-404 exceeds threshold limit (10.0 mm/s). Inspect turbine blade balance.',
        machine: 'Cooling Tower T-404',
        severity: 'High',
        status: 'Open',
      },
      {
        title: 'Seal Replacement H-202',
        description: 'Hydraulic oil weep at main cylinder seal. Schedule gasket replacement package.',
        machine: 'Hydraulic Press H-202',
        severity: 'Medium',
        status: 'In Progress',
      },
      {
        title: 'Calibrate Kiln Temp Sensors',
        description: 'Re-zero thermocouple sensors during scheduled downtime shift.',
        machine: 'Rotary Kiln R-303',
        severity: 'Low',
        status: 'Open',
      },
    ];
    await Ticket.insertMany(tickets);
    console.log('Seeded maintenance tickets.');

    // Seed Incident Safety Logs
    const incidents = [
      {
        title: 'Hydraulic Fluid Fluid Leakage',
        description: 'Minor hydraulic pool formed near H-202 foundation. Absorbent cleanup pad applied. Hazard area taped.',
        machine: 'Hydraulic Press H-202',
        severity: 'Medium',
        status: 'Reported',
        loggedBy: 'A. Patel',
      },
      {
        title: 'Emergency Override Trip',
        description: 'Belt C-101 stop cord pulled accidentally during logistics loading. Verified clear and reset manually.',
        machine: 'Conveyor Belt C-101',
        severity: 'Low',
        status: 'Resolved',
        loggedBy: 'H. Miller',
      },
    ];
    await Incident.insertMany(incidents);
    console.log('Seeded safety incident logs.');

    console.log('Database seeding successfully finished!');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Seeding database failed:', error);
    process.exit(1);
  }
};

seedData();
