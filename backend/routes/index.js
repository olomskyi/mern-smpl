import express from 'express';
import multer from 'multer';
import UserController from '../controllers/user-controller.js';
import authenticateToken from '../middle/auth.js';

var router = express.Router();

// Images uplooad storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename:  (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage }); // Crete multer storage instance

/* GET home page. */
router.get('/', (req, res) => {
  res.send('Hello from the home API page!');
});

// UserController routes

// Registration route
router.post('/register', UserController.register);

// Login route
router.post('/login', UserController.login);

// Update user by ID route
router.put('/user/:id', authenticateToken, UserController.updateUser);

// Get user by ID route
router.get('/user/:id', authenticateToken, UserController.getUserById);

// Current user route
router.get('/current-user', authenticateToken, UserController.currentUser);

export default router;