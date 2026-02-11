
import prisma from '../prisma/prisma-client.js';

class CommentController {

    // POST /comments
    async addComment(req, res)
    {
        const { postId, content } = req.body;
        const userId = req.user.id; // Current user ID

        if (!postId || !content) {
            return res.status(400).json({ error: 'addComment: Post ID and content are required' });
        }

        if (!userId) {
            return res.status(401).json({ error: 'addComment: Unauthorized' });
        }

        try {
            const newComment = await prisma.comment.create({data: {postId, userId, content}});
            res.status(201).json(newComment);
        } catch (error) {
            res.status(500).json({ error: 'addComment: Failed to add comment' });
        }
    }

    // PUT /comments/:commentId
    async updateComment(req, res)
    {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user.id; // Current user ID
        if (!content || !commentId) {
            return res.status(400).json({ error: 'updateComment: Content is required' });
        }
        if (!userId) {
            return res.status(401).json({ error: 'updateComment: Unauthorized' });
        }

        try {
            const comment = await prisma.comment.findUnique({ where: { id: commentId } });
            if (!comment) {
                return res.status(404).json({ error: 'updateComment: Comment not found' });
            }
            if (comment.userId !== userId) {
                return res.status(403).json({ error: 'updateComment: Not authorized to update this comment' });
            }

            const updatedComment = await prisma.comment.update({
                where: { id: commentId, userId },
                data: { content }
            });

            if (updatedComment) {
                res.status(200).json(updatedComment);
            } else {
                res.status(403).json({ error: 'updateComment: Comment was not updated' });
            }
        } catch (error) {
            res.status(500).json({ error: 'updateComment: Failed to update comment' });
        }
    }

    // GET /comments/:postId
    async getComments(req, res)
    {
        const { postId } = req.params;
        if (!postId) {
            return res.status(400).json({ error: 'getComments: Post ID is required' });
        }

        try {
            const comments = await prisma.comment.findMany({ where: { postId } });

            if (!comments || comments.length === 0) {
                return res.status(404).json({ error: 'getComments: No comments found for this post' });
            }

            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ error: 'getComments: Failed to retrieve comments' });
        }
    }

    // DELETE /comments/:commentId
    async deleteComment(req, res)
    {
        const { commentId } = req.params;
        const userId = req.user.id; // Current user ID
        if (!commentId) {
            return res.status(400).json({ error: 'deleteComment: Comment ID is required' });
        }
        if (!userId) {
            return res.status(401).json({ error: 'deleteComment: Unauthorized' });
        }

        try {
            const comment = await prisma.comment.findUnique({ where: { id: commentId } });
            if (!comment) {
                return res.status(404).json({ error: 'deleteComment: Comment not found' });
            }
            if (comment.userId !== userId) {
                return res.status(403).json({ error: 'deleteComment: Not authorized to delete this comment' });
            }
            await prisma.comment.delete({ where: { id: comment.id } });
            res.status(200).json({ message: 'Comment deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'deleteComment: Failed to delete comment' });
        }
    }
}

export default new CommentController();