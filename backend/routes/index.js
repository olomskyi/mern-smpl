
import express from 'express';
import multer from 'multer';
import UserController from '../controllers/user-controller.js';
import PostController from '../controllers/post-controller.js';
import authenticateToken from '../middle/auth.js';

var router = express.Router();

// Images upload storage configuration
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

// PostController routes

// Get a post by ID
router.get('/posts/:id', PostController.getPostById);

// Get all posts
router.get('/posts', authenticateToken, PostController.getAllPosts);

// Create a new post
router.post('/posts', authenticateToken, PostController.createPost);

// Update a post by ID
router.put('/posts/:id', authenticateToken, PostController.updatePost);

// Delete a post by ID
router.delete('/posts/:id', authenticateToken, PostController.deletePost);

export default router;