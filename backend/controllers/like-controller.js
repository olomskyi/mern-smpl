
import prisma from '../prisma/prisma-client.js';

class LikeController {

    // POST /likes
    async likePost(req, res) {
        const { postId } = req.body;
        const userId = req.user.id; // Assuming user ID is available in req.user
        if (!postId) {
            return res.status(400).json({ error: 'Post ID is required' });
        }
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            // Check if the like already exists
            const existingLike = await prisma.like.findFirst({ where: { userId, postId } });
            if (existingLike) {
                return res.status(400).json({ error: 'Post already liked' });
            }

            const like = await prisma.like.create({ data: { userId, postId }});
            res.status(201).json(like);
        } catch (error) {
            res.status(500).json({ error: 'Failed to like post' });
        }
    }

    // DELETE /likes/:postId
    async unlikePost(req, res) {
        const { postId } = req.params;
        const userId = req.user.id; // Assuming user ID is available in req.user
        if (!postId) {
            return res.status(400).json({ error: 'Post ID is required' });
        }
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const existingLike = await prisma.like.findFirst({ where: { userId, postId } });
            if (!existingLike) {
                return res.status(404).json({ error: 'Like not found' });
            }

            await prisma.like.delete({ where: { id: existingLike.id }});
            res.status(200).json(existingLike);
        } catch (error) {
            res.status(500).json({ error: 'Failed to unlike post' });
        }
    }
}

export default new LikeController();