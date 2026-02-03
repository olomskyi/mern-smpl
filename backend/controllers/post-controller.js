
import prisma from '../prisma/prisma-client.js';

class PostController {

    // POST /posts
    async createPost(req, res) {
        const { content } = req.body;
        const authorId = req.user.id; // Get authorId from authenticated user

        if (!content) {
            return res.status(400).send("All fields are required.");
        }
        if (!authorId) {
            return res.status(400).send("Author ID is not provided.");
        }

        try {
            const newPost = await prisma.post.create({ data: { content, authorId }});

            res.status(201).json(newPost);
        } catch (error) {
            console.error("Error creating post:", error);
            res.status(500).send("Internal server error while creating post.");
        }
    }
    
    // GET /posts
    async getAllPosts(req, res) {
        if (!req.user || !req.user.id) {
            return res.status(401).send("Unauthorized: User information is missing.");
        }

        const authorId = req.user.id;
        try {
            const posts = await prisma.post.findMany({
                include: {
                    author: true,
                    likes: true,
                    comments: true
                },
                orderBy: { createdAt: 'desc' }
            });

            const postWithLikeInfo = posts.map(post => ({
                ...post,
                likesByUser: post.likes.some(like => like.userId === authorId)
            }));

            res.status(200).json(postWithLikeInfo);
        } catch (error) {
            console.error("Error fetching all posts:", error);
            res.status(500).send("Internal server error while fetching posts.");
        }
    }

    // GET /posts/:id
    async getPostById(req, res) {
        const { id } = req.params;

        try {
            const post = await prisma.post.findUnique({
                where: { id },
                include: {
                    comments: {include: { user: true }},
                    likes: true,
                    author: true
                }
            });

            if (!post) {
                return res.status(404).send("Post not found.");
            }

            // Delete password from author object before sending response
            if (post.author && post.author.password) {
                delete post.author.password;
            }

            if (req.user && req.user.id) {
                const userId = req.user.id;
                const postWithLikeInfo = {
                    ...post,
                    likesByUser: post.likes.some(like => like.userId === userId)
                };
                res.status(200).json(postWithLikeInfo);
            } else {
                console.log("User not authenticated, returning post without like info.");
                res.status(200).json(post);
            }

        } catch (error) {
            console.error("Error fetching post by ID:", error);
            res.status(500).send("Internal server error while fetching post.");
        }
    }

    // PUT /posts/:id
    async updatePost(req, res) {
        const { id } = req.params;
        const { content } = req.body;
        if (!content) {
            return res.status(400).send("Content is required.");
        }

        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) {
            return res.status(404).send("Post not found.");
        }

        if (post.authorId !== req.user.id) {
            return res.status(403).send("You are not authorized to update this post.");
        }

        try {
            const updatedPost = await prisma.post.update({
                where: { id },
                data: { content }
            });
            console.log("Post updated successfully:", updatedPost);
            res.status(200).json(updatedPost);
        } catch (error) {
            console.error("Error updating post:", error);
            res.status(500).send("Internal server error while updating post.");
        }
    }

    // DELETE /posts/:id
    async deletePost(req, res) {
        const { id } = req.params;

        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) {
            return res.status(404).send("Post not found.");
        }

        if (post.authorId !== req.user.id) {
            return res.status(403).send("You are not authorized to delete this post.");
        }

        try {
            const transaction = await prisma.$transaction([
                prisma.like.deleteMany({ where: { postId: id } }),
                prisma.comment.deleteMany({ where: { postId: id } }),
                prisma.post.delete({ where: { id } })
            ]);

            console.log("Transaction result:", transaction);
            res.status(200).json({ message: "Post deleted successfully." });
        } catch (error) {
            console.error("Error deleting post:", error);
            res.status(500).send("Internal server error while deleting post.");
        }
    }
}

export default new PostController();