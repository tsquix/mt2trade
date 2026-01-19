import { useState, useEffect } from 'react';
import axios from 'axios';

export const useDiscordOffers = (serverSlug) => {
  const [discordThreads, setDiscordThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!serverSlug) return;

    const fetchDiscordOffers = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/api/dcOffers?server=${serverSlug}`);
        setDiscordThreads(res.data.data || []);
      } catch (error) {
        console.error('Error fetching Discord offers:', error);
        setDiscordThreads([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscordOffers();
  }, [serverSlug]);

  return { discordThreads, isLoading };
};
