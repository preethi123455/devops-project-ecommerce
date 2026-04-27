export const categories = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports & Outdoors',
  'Toys & Games',
  'Beauty & Personal Care',
  'Kitchen & Dining',
] as const;

export const categoryDescriptions: { [key: string]: string } = {
  'Electronics': 'Gadgets, phones, computers, and accessories',
  'Clothing': 'Fashion, apparel, and footwear',
  'Books': 'Ebooks, audiobooks, and printed books',
  'Home & Garden': 'Furniture, decor, and gardening supplies',
  'Sports & Outdoors': 'Athletic gear and outdoor equipment',
  'Toys & Games': 'Toys, games, and collectibles',
  'Beauty & Personal Care': 'Cosmetics, skincare, and grooming',
  'Kitchen & Dining': 'Kitchenware and dining products',
};

export const categoryIcons: { [key: string]: string } = {
  'Electronics': '📱',
  'Clothing': '👕',
  'Books': '📚',
  'Home & Garden': '🏡',
  'Sports & Outdoors': '⛹️',
  'Toys & Games': '🎮',
  'Beauty & Personal Care': '💄',
  'Kitchen & Dining': '🍳',
};

export const getRandomRating = (): number => {
  return Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0 to 5.0
};

export const getRandomReviewCount = (): number => {
  return Math.floor(Math.random() * 450) + 50; // 50 to 500 reviews
};
