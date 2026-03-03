import express from 'express';
import { Webhook } from 'svix';
import User from '../models/user.model.js';

const router = express.Router();

router.post(
  '/',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    const wh = new Webhook(secret);

    let event;
    try {
      event = wh.verify(req.body, {
        'svix-id': req.headers['svix-id'],
        'svix-timestamp': req.headers['svix-timestamp'],
        'svix-signature': req.headers['svix-signature'],
      });
    } catch (err) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    if (event.type === 'user.created') {
      const { id, email_addresses, first_name, last_name } = event.data;

      // Guard: skip if test webhook has no real email data
      if (!email_addresses || email_addresses.length === 0) {
        return res
          .status(200)
          .json({ received: true, note: 'Test event skipped' });
      }

      await User.create({
        clerkId: id,
        email: email_addresses[0].email_address,
        firstName: first_name || '',
        lastName: last_name || '',
      });
    }

    if (event.type === 'user.deleted') {
      await User.findOneAndDelete({ clerkId: event.data.id });
    }

    res.status(200).json({ received: true });
  },
);

export default router;
