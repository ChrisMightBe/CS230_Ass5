const express = require('express');
const cors = require('cors');
require('dotenv').config();

const journeyPlanRoutes = require('./routes/journeyPlanRoutes');
const userRoutes = require('./routes/userRoutes');
const travelLogRoutes = require('./routes/travelLogsRoutes');

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/travel-logs', travelLogRoutes);
app.use('/api/journey-plans', journeyPlanRoutes);



app.listen(3001, () => {
    console.log("Server running on port 3001");
});

