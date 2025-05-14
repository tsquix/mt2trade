import webpush from 'web-push';

const vapidKeys = {
  publicKey: 'BEy9M0NM8txQ1yRYTHXFYL5588f3pR1u-em5StnrvXLaLLW-EKzyWKjinlEe7CGij5WfJ75dyC9rKXB8NDBDCRI',
  privateKey: 'YDg0QmSK4XKWm8DGKHWIBdh154cTyvKN7O6nzVJFo14'
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
    const subscription = req.body;
    
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'New Notification',
        body: 'This is a test notification',
        icon: '/icon.png' // Add your icon path
      })
    );

    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Error sending notification' });
  }
}