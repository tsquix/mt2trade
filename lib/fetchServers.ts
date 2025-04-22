import axios from 'axios';

// This function works for both client-side and server-side
export const fetchServerList = async (baseUrl = '') => {
  try {
    // Use baseUrl if provided (for server-side), otherwise use relative URL (for client-side)
    const url = `${baseUrl}/api/server`;
    const response = await axios.get(url);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching servers:', error);
    return [];
  }
};

// Example usage in getStaticProps:
// import { fetchServerList } from "@/lib/fetchServers";
// 
// export async function getStaticProps() {
//   const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
//   const servers = await fetchServerList(baseUrl);
//   return { props: { servers }, revalidate: 86400 };
// }
