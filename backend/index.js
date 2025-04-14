const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

dotenv.config();

// Connect to database
connectDB();

const app = express();

const corsOptions = {
  origin: [
    'https://frontend-azure-omega-21.vercel.app', 
    'http://localhost:3000'
  ],
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

const eventRoutes = require('./src/routes/events');
const goalRoutes = require('./src/routes/goals');
const taskRoutes = require('./src/routes/tasks');

app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/goals', goalRoutes);   
app.use('/api/v1/tasks', taskRoutes);   

// Root route
app.get('/', (req, res) => {
  res.send('Calendar API is running...');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!  Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Export for serverless
module.exports = app;