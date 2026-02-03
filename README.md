Fullstack Social Media Platform (MERN + Prisma)
A robust social media application featuring real-time interactions, secure authentication, and a scalable NoSQL architecture.

Tech Stack  
Frontend: React, TypeScript, Redux Toolkit  
Backend: Node.js, Express.js  
Database: MongoDB (via Prisma ORM)  
Security: JSON Web Tokens (JWT), Bcrypt  


Key Features  
Authentication: Secure registration and login flow.  
Social Feed: Create, update, and delete posts.  
Interactions: Like/Unlike posts and threaded comments.  
Networking: Follow and unfollow system to build a social graph.  
Profile: Managed user profiles with metadata (bio, location, avatar).  


Database Schema (Prisma)  
The application uses Prisma with a MongoDB connector. The schema includes:  
User: Core profile data and relations.  
Follows: Explicit pivot model for the follower/following system.  
Post: User-generated content.  
Like & Comment: Engagement models linked to users and posts.  


----------------------------------------------

API Documentation  

User & Auth  
Method	Endpoint	Description  
POST	/register	Register a new user  
POST	/login	Authenticate and get token  
GET	/current-user	Get logged-in user data  
GET	/user/:id	Get public profile by ID  
PUT	/user/:id	Update profile information  


Posts  
Method	Endpoint	Description  
GET	/posts	Fetch all posts  
GET	/posts/:id	Fetch single post details  
POST	/posts	Create a new post  
PUT	/posts/:id	Edit an existing post  
DELETE	/posts/:id	Remove a post  


Engagement (Comments, Likes & Follows)  
Method	Endpoint	Description  
POST	/comments	Add a comment to a post  
GET	/comments/:postId	Get all comments for a post  
POST	/likes	Like a post  
DELETE	/likes/:postId	Unlike a post  
POST	/follow	Follow a user  
DELETE	/unfollow/:followingId	Unfollow a user  


----------------------------------------------

Database Models (Prisma Schema)  

The database is structured using MongoDB. Below are the key data models defined in schema.prisma:  
  
User  
Represents the core user entity and their profile information.  
  
id: unique identifier (MongoDB ObjectId).  
email: unique string for authentication.  
password: hashed security string.  
name: display name of the user.  
avatarUrl: link to the profile image.  
bio / location: profile metadata.  
dateOfBirth: user's birthday for age calculation.  
posts / likes / comments: relations to user's activity.  
followers / following: self-relation to the Follows model.  
  
Post  
Contains the content shared by users.  
  
id: unique identifier.  
content: the main text of the post.  
authorId: reference to the User who created the post.  
createdAt: timestamp of publication.  
  
Follows (Social Graph)  
A pivot model to manage the relationship between followers and following users.  
  
followerId: ID of the user who is following.  
followingId: ID of the user being followed.  
  
Like  
Tracks user engagement on posts.  
  
userId: ID of the user who liked the post.  
postId: ID of the post being liked.  
  
Comment  
Stores feedback on specific posts.  
  
id: unique identifier.  
content: the comment text.  
userId: reference to the commenter.  
postId: reference to the related post.  
  
----------------------------------------------

Installation  
Clone the repo:  
git clone https://github.com/olomskyi/mern-smpl.git  


Backend Setup:  
Navigate to /backend  
Run npm install  
Configure .env with DATABASE_URL (MongoDB Connection String) and JWT_SECRET  
Run npx prisma generate  
Start: npm run dev  
  
Frontend Setup: (IN DEVELOPMENT)  
Navigate to /frontend  
Run npm install  
Start: npm start  
