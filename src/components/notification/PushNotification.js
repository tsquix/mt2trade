import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function PushNotification() {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    async function checkSubscription() {
      if (session) {
        try {
          const registration = await navigator.serviceWorker.ready;
          const existingSubscription = await registration.pushManager.getSubscription();
          
          if (existingSubscription) {
            setSubscription(existingSubscription);
            console.log('Existing subscription found');
          }
        } catch (error) {
          console.error('Error checking subscription:', error);
        }
      }
    }

    checkSubscription();
  }, [session]);

  const subscribeToNotifications = async () => {
    try {
      if (!session) {
        throw new Error('You must be logged in to subscribe to notifications');
      }
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permission not granted for notifications');
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Subscribe to push notifications
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BEy9M0NM8txQ1yRYTHXFYL5588f3pR1u-em5StnrvXLaLLW-EKzyWKjinlEe7CGij5WfJ75dyC9rKXB8NDBDCRI'
      });

      // Send subscription to backend
      // Updated fetch request with credentials
      const response = await fetch('/api/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(pushSubscription),
      });

      if (response.ok) {
        setSubscription(pushSubscription);
        console.log('Successfully subscribed to push notifications');
      }
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
    }
  };

  const sendNotification = async () => {
    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return (
    <div>
      <button 
        onClick={subscribeToNotifications}
        className="bg-brighterBg px-4 py-2 rounded-lg text-red-300 mr-2"
      >
        Subscribe to Notifications
      </button>
      {subscription && (
        <button 
          onClick={sendNotification}
          className="bg-brighterBg px-4 py-2 rounded-lg text-red-300"
        >
          Send Test Notification
        </button>
      )}
    </div>
  );
}