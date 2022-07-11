const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const dotenv = require('dotenv');
const UserRoutes = require('./routes/UserRoutes');

// parsing the environment variables
dotenv.config('.env');

const app = express();

// CORS policy
app.use(cors());
// activating json
app.use(express.json());

// connecting to database
db.connect(process.env.DB_URL);

// loading routes
app.use("/api/v1/user", UserRoutes);

// root route
app.get('/', (req, res) => {
  return res.status(200).send({
    status: 'success',
    message: 'Request Successful!'
  });
});

app.listen(process.env.PORT || 5002, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT || 5002}`);
});
