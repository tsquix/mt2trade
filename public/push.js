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

let sub = {};
push.sendNotification(subscribe, 'testmessage');
