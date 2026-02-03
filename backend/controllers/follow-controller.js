
import prisma from '../prisma/prisma-client.js';

class FollowController {

    // Post /follow
    async followUser(req, res)
    {
        const { followingId } = req.body;
        const userId = req.user.id; // Assuming user ID is available in req.user

        if (!followingId ) {
            return res.status(400).json({ error: 'Following ID is required' });
        }
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (followingId === userId) {
            return res.status(500).json({ error: 'Unable to follow yourself'})
        }

        try {
            const existingFollowing = await prisma.follows.findFirst({
                 where: {AND: [{ followerId: userId }, { followingId }]}
                })
            if (existingFollowing) {
                return res.status(400).json({ error: "No subscriptions"});
            }

            await prisma.follows.create({
                data: {
                    follower: { connect: { id: userId }},
                    following: { connect: { id: followingId}}
            }});
            res.status(201).json({ message: 'Successfully subscribed'});
        } catch (error) {
            res.status(500).json({ error: 'Failed to follow' });
        }
    }

    // Delete /unfollow/:id
    async unfollowUser(req, res)
    {
        const { followingId } = req.params;
        const userId = req.user.id; // Assuming user ID is available in req.user

        if (!followingId ) {
            return res.status(400).json({ error: 'Following ID is required' });
        }
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (followingId === userId) {
            return res.status(500).json({ error: 'Unable to follow yourself'})
        }

        try {
            const existingFollowing = await prisma.follows.findFirst({
                 where: {AND: [{ followerId: userId }, { followingId }]}
                })
            if (!existingFollowing) {
                return res.status(404).json({ error: "No subscriptions found"});
            }

            await prisma.follows.delete({ where: { id: existingFollowing.id }});
            res.status(201).json({ message: 'Successfully deleted'});
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete subscription' });
        }
    }
}

export default new FollowController();