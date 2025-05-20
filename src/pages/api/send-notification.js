import webpush from 'web-push';

const vapidKeys = {
  publicKey:
    'BEy9M0NM8txQ1yRYTHXFYL5588f3pR1u-em5StnrvXLaLLW-EKzyWKjinlEe7CGij5WfJ75dyC9rKXB8NDBDCRI',
  privateKey: 'YDg0QmSK4XKWm8DGKHWIBdh154cTyvKN7O6nzVJFo14',
};

webpush.setVapidDetails(
  'mailto:test@code.co.co',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { endpoint, keys, message } = req.body;

    if (!endpoint || !keys) {
      return res.status(400).json({ message: 'Invalid subscription data' });
    }

    const subscription = {
      endpoint,
      keys,
    };

    await webpush.sendNotification(subscription, JSON.stringify(message));

    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}
