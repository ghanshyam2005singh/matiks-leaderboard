import axios from 'axios';

const getApiUrl = () => {
    const PRODUCTION_API = 'https://your-app-name.up.railway.app/api';
    
    if (typeof window !== 'undefined') {
        if (window.location.hostname !== 'localhost') {
            return PRODUCTION_API;
        }
        return 'http://localhost:8080/api';
    }
    return 'http://10.210.140.137:8080/api';
}

const API_URL = getApiUrl();

// Add timeout and better error handling
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json',
    }
});

console.log('🔗 API Base URL:', API_URL);

export interface User {
  id: number;
  username: string;
  rating: number;
  rank: number;
  created_at: string;
}

export interface LeaderboardResponse {
  users: User[];
  total: number;
  page: number;
  total_pages: number;
}

// Helper to handle errors
const handleApiError = (error: any, operation: string) => {
    console.error(`❌ ${operation} failed:`, error);
    
    if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - server not responding');
    } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        throw new Error('Cannot connect to server. Make sure:\n1. Backend is running\n2. Phone and laptop on same WiFi\n3. Firewall allows port 8080');
    } else if (error.response) {
        throw new Error(`Server error: ${error.response.status}`);
    } else {
        throw new Error('Unknown error occurred');
    }
};

// get leaderboard with pagination
export const getLeaderboard = async (page: number = 1): Promise<LeaderboardResponse> => {
    try {
        console.log(`📊 Fetching leaderboard page ${page} from ${API_URL}/leaderboard`);
        const response = await api.get<LeaderboardResponse>(`/leaderboard?page=${page}`);
        console.log('✅ Leaderboard loaded:', response.data.users?.length, 'users');
        return response.data;
    } catch (error: any) {
        handleApiError(error, 'Get leaderboard');
        throw error;
    }
};

// search users by username
export const searchUsers = async (query: string): Promise<User[]> => {
    try {
        console.log(`🔍 Searching for: ${query}`);
        const response = await api.get<User[]>(`/search?q=${query}`);
        console.log('✅ Found', response.data?.length, 'users');
        return response.data;
    } catch (error: any) {
        handleApiError(error, 'Search users');
        throw error;
    }
};

// seed database with 10k users
export const seedDatabase = async (): Promise<{ message: string; total: number }> => {
    try {
        console.log('🌱 Seeding database...');
        const response = await api.post(`/seed`);
        console.log('✅ Database seeded!', response.data);
        return response.data;
    } catch (error: any) {
        handleApiError(error, 'Seed database');
        throw error;
    }
};