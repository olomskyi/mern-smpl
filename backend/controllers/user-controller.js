
import prisma from '../prisma/prisma-client.js';
import bcrypt from 'bcrypt';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import * as jdenticon from 'jdenticon';

class UserController {

  // POST /register
  async register(req, res)
  {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send("All fields are required.");
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).send("User with this email already exists.");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const avatar = jdenticon.toPng(name, 200); // Generate avatar based on name
        const avatarName = `${name}-${Date.now()}-avatar.png`;
        const avatarPath = `./uploads/${avatarName}`;
        fs.writeFileSync(avatarPath, avatar);

        const newUser = await prisma.user.create({
            data: { name, email, password: hashedPassword, avatarUrl: avatarPath }
        });
        
        res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email });
    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).send("Internal server error.");
    }
  }

  // POST /login
  async login(req, res)
  {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required.");
    }

    try {
        const user = await prisma.user.findUnique({where: { email }});
        if (!user) {
            return res.status(400).send("Invalid email.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send("Invalid password.");
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '3h' });
        res.setHeader('Authorization', `Bearer ${token}`);
        res.setHeader("Access-Control-Expose-Headers", "Authorization");
        res.status(200).json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
        console.error("Error during user login:", error);
        res.status(500).send("Internal server error.");
    }
  }

  // GET /user/:id
  async getUserById(req, res)
  {
    const id = req.params.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
              followers: true,
              following: true
            }
        });

        if (!user) {
            return res.status(404).send("User not found.");
        }

        const { password, ...userWithoutPassword } = user;
        const isFollowing = await prisma.follows.findFirst({
            where: {
              AND: [
                { followerId: id },
                { followingId: id }
              ]
            }
        });

        res.status(200).json({ ...userWithoutPassword, isFollowing: isFollowing });

    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).send("Internal server error while get User By Id.");
    }
  }

  // PUT /user/:id
  async updateUser(req, res)
  {
    const id = req.params.id;
    const { name, email, dateOfBirth, bio, location } = req.body;

    // Handle file upload if present
    let filePath = null;
    if (req.file && req.file.path) {
      filePath = req.file.path;
    }

    if (id !== req.user.id) {
      return res.status(403).send("You can only update your own profile.");
    }

    try {
      // Check if email is being updated and if it's already taken
      if (email) {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser && existingUser.id !== id) {
          return res.status(400).send("Email is already in use by another account.");
        }
      }

      const user = await prisma.user.update({
        where: { id },
        data: {
          name: name || undefined,
          email: email || undefined,
          bio: bio || undefined,
          location: location || undefined,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          avatarUrl: filePath ? filePath : undefined
        }
      });

      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);

    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).send("Internal server error while update User.");
    }
  }

  // GET /current
  async currentUser(req, res)
  {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          followers: { include: { follower: true } },
          following: { include: { following: true } }
        }
      });

      if (!user) {
        return res.status(404).send("User not found.");
      }

      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).send("Internal server error while get current User.");
    }
  }
};

export default new UserController();