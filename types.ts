export interface Lead {
  id: string;
  name: string;
  source: 'WhatsApp' | 'Instagram' | 'Website' | 'Referral' | 'TikTok';
  message: string;
  timestamp: string;
  avatar: string;
  status: 'New' | 'Follow Up' | 'Won' | 'Lost';
}

export interface Property {
  id: string;
  name: string;
  image: string;
  images?: string[];
  price: string;
  address: string;
  description?: string;
  specs: {
    lt: number;
    lb: number;
    rooms: number;
    toilets: number;
  };
}

export interface Task {
  id: string;
  title: string;
  due: string;
  source: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

export interface Post {
  id: string;
  handle: string;
  content: string;
  image: string;
  metrics: {
    likes: number;
    comments: number;
  };
  time: string;
}