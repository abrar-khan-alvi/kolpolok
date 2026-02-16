
import { Business, Product, Ad } from './types';

export const CATEGORIES = [
  'Grocery', 'Pharmacy', 'Restaurant', 'Tailor', 'Salon', 'Electronics', 'Stationery'
];

export const MOCK_BUSINESSES: Business[] = [
  {
    id: '1',
    name: 'Kolpolok Fresh Mart',
    logo: 'https://picsum.photos/seed/freshmart/100/100',
    picture: 'https://picsum.photos/seed/mart-shop/600/400',
    category: 'Grocery',
    phone: '01711223344',
    address: 'Block A, Road 2, Kolpolok R/A',
    description: 'Fresh vegetables and daily essentials delivered right to your doorstep.',
    isTrending: true,
    isVerified: true,
    isTrusted: true,
    isSponsored: true,
    rankingPriority: 10,
  },
  {
    id: '2',
    name: 'HealthCare Pharma',
    logo: 'https://picsum.photos/seed/pharma/100/100',
    picture: 'https://picsum.photos/seed/pharmacy/600/400',
    category: 'Pharmacy',
    phone: '01811223344',
    address: 'Block C, Main Road, Kolpolok R/A',
    description: '24/7 medicine delivery within the society.',
    isTrending: false,
    isVerified: true,
    isTrusted: true,
    isSponsored: false,
    rankingPriority: 5,
  },
  {
    id: '3',
    name: 'Unity Tailors',
    logo: 'https://picsum.photos/seed/tailor/100/100',
    picture: 'https://picsum.photos/seed/tailor-shop/600/400',
    category: 'Tailor',
    phone: '01911223344',
    address: 'Block B, Road 5, Kolpolok R/A',
    description: 'Expert tailoring for men and women. Custom fittings available.',
    isTrending: true,
    isVerified: false,
    isTrusted: true,
    isSponsored: false,
    rankingPriority: 3,
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Premium Basmati Rice (5kg)',
    images: ['https://picsum.photos/seed/rice1/400/400', 'https://picsum.photos/seed/rice2/400/400', 'https://picsum.photos/seed/rice3/400/400'],
    price: 650,
    description: 'Long grain aromatic basmati rice for your perfect biryani.',
    stockStatus: 'In Stock'
  },
  {
    id: 'p2',
    name: 'Organic Honey (500g)',
    images: ['https://picsum.photos/seed/honey1/400/400', 'https://picsum.photos/seed/honey2/400/400', 'https://picsum.photos/seed/honey3/400/400'],
    price: 450,
    description: '100% pure organic honey sourced from local farms.',
    stockStatus: 'Low Stock'
  }
];

export const MOCK_ADS: Ad[] = [
  {
    id: 'ad1',
    placement: 'Homepage',
    image: 'https://picsum.photos/seed/banner1/800/200',
    link: '#',
    startDate: '2023-01-01',
    endDate: '2025-12-31'
  },
  {
    id: 'ad2',
    placement: 'Popup',
    image: 'https://picsum.photos/seed/popup1/500/500',
    link: '#',
    startDate: '2023-01-01',
    endDate: '2025-12-31'
  }
];
