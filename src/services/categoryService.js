import api from './authService';

let cachedCategories = null;

export const categoryService = {
  getCategories: async (forceRefresh = false) => {
    if (cachedCategories && !forceRefresh) {
      return cachedCategories;
    }
    try {
      const response = await api.get('/category');
      cachedCategories = response.data.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        imageUrl: cat.imageUrl,
        productCount: cat.productCount,
        slug: cat.slug || cat.name?.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and').replace(/---/g, '-').replace(/--/g, '-') || ''
      }));
      return cachedCategories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }
};
