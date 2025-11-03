import React, { useState } from 'react';

//   const [correctSchemaThread, setCorrectSchemaThread] = useState([
//     {
//       id: '',
//       title: '',
//       messageCount: '',
//       createdAt: '',
//       seller: {},
//       attachments: '',
//     },
//   ]);
const convertToOfferObject = (threads) => {
  if (!Array.isArray(threads)) return [];

  return threads
    .map((thread) => ({
      _id: thread.id,
      offerType: 'dc',
      title: thread.thread.name,
      tags: thread.thread.tags,
      messageCount: thread.messageCount,
      ownerMessages: thread.ownerMessages,
      createdAt: thread.createdAt,
      lastActivity: thread.lastActivity,
      seller: thread.thread.owner,
      starterMessage: thread.starterMessage?.content,
      starterMessageEdited: thread.starterMessage?.editedAt,
    }))
    .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
};

export default convertToOfferObject;
