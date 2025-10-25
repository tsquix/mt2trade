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

  return threads.map((thread) => ({
    _id: thread.id,
    offerType: 'dc',
    title: thread.thread?.name || '',
    tags: thread.thread?.tags || [],
    messageCount: thread.stats.totalMessageCount || [],
    ownerMessages: thread.ownerMessages || [],
    createdAt: thread.thread?.createdAt || '',
    seller: thread.thread?.owner || {},
    starterMessage: thread.thread.starterMessage.content,
  }));
};

export default convertToOfferObject;
