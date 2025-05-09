var push = require('web-push');

let vapidKeys = {
  publicKey:
    'BEy9M0NM8txQ1yRYTHXFYL5588f3pR1u-em5StnrvXLaLLW-EKzyWKjinlEe7CGij5WfJ75dyC9rKXB8NDBDCRI',
  privateKey: 'YDg0QmSK4XKWm8DGKHWIBdh154cTyvKN7O6nzVJFo14',
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
