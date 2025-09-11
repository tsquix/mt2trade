var push = require('web-push');

let vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

push.setVapidDetails(
  'mailto:test@code.co.co',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

let sub = {
  endpoint:
    'https://fcm.googleapis.com/fcm/send/d5CD8lmYstg:APA91bFRhHcLMWZFyOjeKwjfuFqnu7SlcPXEKlEPlkdC1jG_AByg1V1kdxGvABzhJ_u9wMvLAUiE36xCPiIs_vfB_AKkD6qeV9oo_bPC6_oJWicYWhdRfkSlDgib-WkhJ_T3vXiYhpjf',
  expirationTime: null,
  keys: {
    p256dh:
      'BNn_AYsrUIYS_gQ2gjd7lVpA-uMV6KwKRyYVDdDSR8a54vAVJkl_-F4mOEOLzorWfTJCBV7E2QPD_RCVtdqHQus',
    auth: '7KB2b5MnpGNqcnXfoXUKzw',
  },
};
push.sendNotification(sub, 'testmessage');
