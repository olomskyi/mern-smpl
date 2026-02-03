
import prisma from '../prisma/prisma-client.js';

class CommentController {

    // POST /comments
    async addComment(req, res)
    {
        const { postId, content } = req.body;
        const userId = req.user.id; // Assuming user ID is available in req.user

        if (!postId || !content) {
            return res.status(400).json({ error: 'Post ID and content are required' });
        }

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const newComment = await prisma.comment.create({data: {postId, userId, content}});
            res.status(201).json(newComment);
        } catch (error) {
            res.status(500).json({ error: 'Failed to add comment' });
        }
    }

    // PUT /comments/:commentId
    async updateComment(req, res)
    {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user.id; // Assuming user ID is available in req.user
        if (!content || !commentId) {
            return res.status(400).json({ error: 'Content is required' });
        }
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const comment = await prisma.comment.findUnique({ where: { id: commentId } });
            if (!comment) {
                return res.status(404).json({ error: 'Comment not found' });
            }
            if (comment.userId !== userId) {
                return res.status(403).json({ error: 'Not authorized to update this comment' });
            }

            const updatedComment = await prisma.comment.update({
                where: { id: commentId, userId },
                data: { content }
            });
            if (updatedComment) {
                res.status(200).json(updatedComment);
            } else {
                res.status(403).json({ error: 'Failed to update comment' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update comment' });
        }
    }

    // GET /comments/:postId
    async getComments(req, res)
    {
        const { postId } = req.params;
        if (!postId) {
            return res.status(400).json({ error: 'Post ID is required' });
        }

        try {
            const comments = await prisma.comment.findMany({ where: { postId } });

            if (!comments || comments.length === 0) {
                return res.status(404).json({ error: 'No comments found for this post' });
            }

            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve comments' });
        }
    }

    // DELETE /comments/:commentId
    async deleteComment(req, res)
    {
        const { commentId } = req.params;
        const userId = req.user.id; // Assuming user ID is available in req.user
        if (!commentId) {
            return res.status(400).json({ error: 'Comment ID is required' });
        }
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const comment = await prisma.comment.findUnique({ where: { id: commentId } });
            if (!comment) {
                return res.status(404).json({ error: 'Comment not found' });
            }
            if (comment.userId !== userId) {
                return res.status(403).json({ error: 'Not authorized to delete this comment' });
            }
            await prisma.comment.delete({ where: { id: comment.id } });
            res.status(200).json({ message: 'Comment deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete comment' });
        }
    }
}

export default new CommentController();