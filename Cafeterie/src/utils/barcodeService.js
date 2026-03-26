// Service pour interroger l'API Open Food Facts à partir d'un code-barres
// Respecte SOLID : chaque responsabilité est séparée, dépendances injectables

const fetch = require('node-fetch');

class BarcodeApiClient {
  constructor(apiBaseUrl = 'https://world.openfoodfacts.org/api/v0/product/') {
    this.apiBaseUrl = apiBaseUrl;
  }

  async fetchProduct(barcode) {
    if (!barcode) throw new Error('Barcode is required');
    const url = `${this.apiBaseUrl}${barcode}.json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('API error');
    return response.json();
  }
}

class ProductInfoService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async getProductInfo(barcode) {
    const data = await this.apiClient.fetchProduct(barcode);
    if (data.status !== 1) throw new Error('Produit non trouvé');
    // On extrait les infos utiles
    return {
      code: data.code,
      name: data.product.product_name,
      brand: data.product.brands,
      image: data.product.image_url,
      categories: data.product.categories,
    };
  }
}

// Export prêt à l’emploi
const apiClient = new BarcodeApiClient();
const productInfoService = new ProductInfoService(apiClient);

module.exports = {
  BarcodeApiClient,
  ProductInfoService,
  productInfoService,
};
