
export interface Business {
  id: string;
  name: string;
  logo: string;
  picture: string;
  category: string;
  phone: string;
  address: string;
  description: string;
  isTrending: boolean;
  isVerified: boolean;
  isTrusted: boolean;
  isSponsored: boolean;
  rankingPriority: number;
}

export interface Product {
  id: string;
  name: string;
  images: string[];
  price: number;
  description: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  productId: string;
  productName: string;
  status: 'New' | 'Contacted' | 'Completed';
  createdAt: string;
}

export interface Ad {
  id: string;
  placement: 'Homepage' | 'Category' | 'Popup';
  image: string;
  link: string;
  startDate: string;
  endDate: string;
}

export interface User {
  name: string;
  phone: string;
  isLoggedIn: boolean;
}
