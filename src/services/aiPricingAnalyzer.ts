import { ProductVariant } from '@/components/CsvUploader';

export interface PricingInsight {
  productId: string;
  currentPrice: number;
  suggestedPrice: number;
  confidence: number;
  reasoning: string[];
  potentialImpact: {
    revenueChange: number;
    profitChange: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
}

export interface CategoryAnalysis {
  category: string;
  averageMargin: number;
  priceRange: { min: number; max: number };
  competitivePosition: string;
  recommendations: string[];
}

export interface BatchAnalysisResult {
  insights: PricingInsight[];
  categoryAnalysis: CategoryAnalysis[];
  overallRecommendations: string[];
  marketPositioning: {
    premium: ProductVariant[];
    competitive: ProductVariant[];
    budget: ProductVariant[];
  };
}

class AIPricingAnalyzer {
  private readonly apiKey: string;
  private readonly model: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  }

  /**
   * 分析單個產品的定價策略
   */
  async analyzeProduct(
    product: ProductVariant,
    marketData?: {
      competitors: ProductVariant[];
      categoryTrends: any;
    }
  ): Promise<PricingInsight> {
    const prompt = this.buildProductAnalysisPrompt(product, marketData);
    
    try {
      const response = await this.callOpenAI(prompt);
      return this.parseProductAnalysis(response, product);
    } catch (error) {
      console.error('AI analysis failed:', error);
      return this.getFallbackAnalysis(product);
    }
  }

  /**
   * 批量分析所有產品
   */
  async analyzeBatch(products: ProductVariant[]): Promise<BatchAnalysisResult> {
    // 分類產品
    const productsByCategory = this.groupByCategory(products);
    const insights: PricingInsight[] = [];
    const categoryAnalysis: CategoryAnalysis[] = [];

    // 分析每個類別
    for (const [category, categoryProducts] of Object.entries(productsByCategory)) {
      const categoryInsights = await this.analyzeCategoryProducts(categoryProducts);
      insights.push(...categoryInsights);
      
      const categoryAnalysisResult = await this.analyzeCategoryTrends(category, categoryProducts);
      categoryAnalysis.push(categoryAnalysisResult);
    }

    // 市場定位分析
    const marketPositioning = this.analyzeMarketPositioning(products, insights);

    // 整體建議
    const overallRecommendations = this.generateOverallRecommendations(insights, categoryAnalysis);

    return {
      insights,
      categoryAnalysis,
      overallRecommendations,
      marketPositioning
    };
  }

  /**
   * 智能成本估算
   */
  async estimateHiddenCosts(product: ProductVariant): Promise<{
    customerServiceCost: number;
    returnCost: number;
    inventoryCost: number;
    marketingCost: number;
    totalHiddenCost: number;
  }> {
    const prompt = `
    分析以下產品的隱藏成本：
    
    產品信息：
    - 名稱: ${product.title}
    - 類別: ${product.category}
    - 價格: $${product.price}
    - 成本: $${product.costPerItem}
    - 重量: ${product.weight}g
    - 需要物流: ${product.requiresShipping}
    
    請估算：
    1. 客服成本 (複雜度、退貨率影響)
    2. 退貨處理成本
    3. 庫存持有成本
    4. 行銷獲客成本
    
    以百分比形式回答，基於產品價格。
    `;

    try {
      const response = await this.callOpenAI(prompt);
      return this.parseHiddenCostAnalysis(response, product);
    } catch (error) {
      return this.getDefaultHiddenCosts(product);
    }
  }

  private buildProductAnalysisPrompt(product: ProductVariant, marketData?: any): string {
    return `
    請分析以下產品的定價策略：
    
    產品信息：
    - 名稱: ${product.title}
    - 當前價格: $${product.price}
    - 成本: $${product.costPerItem}
    - 類別: ${product.category}
    - 供應商: ${product.vendor}
    - 重量: ${product.weight}g
    - 標籤: ${product.tags}
    - 狀態: ${product.status}
    
    請提供：
    1. 建議定價 (考慮利潤率、市場定位、競爭力)
    2. 信心度 (0-1)
    3. 定價理由 (至少3個要點)
    4. 潛在影響評估
    5. 風險等級評估
    
    請以JSON格式回答。
    `;
  }

  private async callOpenAI(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: '你是一個專業的定價分析專家，擅長電商產品定價策略分析。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private parseProductAnalysis(response: string, product: ProductVariant): PricingInsight {
    try {
      const parsed = JSON.parse(response);
      return {
        productId: product.uniqueId || product.sku || product.handle,
        currentPrice: product.price,
        suggestedPrice: parsed.suggestedPrice || product.price,
        confidence: parsed.confidence || 0.5,
        reasoning: parsed.reasoning || ['AI analysis unavailable'],
        potentialImpact: {
          revenueChange: parsed.revenueChange || 0,
          profitChange: parsed.profitChange || 0,
          riskLevel: parsed.riskLevel || 'medium'
        }
      };
    } catch (error) {
      return this.getFallbackAnalysis(product);
    }
  }

  private getFallbackAnalysis(product: ProductVariant): PricingInsight {
    // 基於規則的後備分析
    const currentMargin = (product.price - product.costPerItem) / product.price;
    const targetMargin = 0.4; // 40% target margin
    const suggestedPrice = product.costPerItem / (1 - targetMargin);

    return {
      productId: product.uniqueId || product.sku || product.handle,
      currentPrice: product.price,
      suggestedPrice: Math.round(suggestedPrice * 100) / 100,
      confidence: 0.6,
      reasoning: [
        `當前毛利率: ${(currentMargin * 100).toFixed(1)}%`,
        `建議目標毛利率: ${(targetMargin * 100).toFixed(1)}%`,
        '基於成本加成定價策略'
      ],
      potentialImpact: {
        revenueChange: ((suggestedPrice - product.price) / product.price) * 100,
        profitChange: ((suggestedPrice - product.costPerItem) - (product.price - product.costPerItem)) / (product.price - product.costPerItem) * 100,
        riskLevel: Math.abs(suggestedPrice - product.price) / product.price > 0.2 ? 'high' : 'low'
      }
    };
  }

  private groupByCategory(products: ProductVariant[]): Record<string, ProductVariant[]> {
    return products.reduce((acc, product) => {
      const category = product.category || 'Uncategorized';
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {} as Record<string, ProductVariant[]>);
  }

  private async analyzeCategoryProducts(products: ProductVariant[]): Promise<PricingInsight[]> {
    const batchSize = parseInt(process.env.BATCH_ANALYSIS_SIZE || '10');
    const results: PricingInsight[] = [];

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(product => this.analyzeProduct(product))
      );
      results.push(...batchResults);
    }

    return results;
  }

  private async analyzeCategoryTrends(category: string, products: ProductVariant[]): Promise<CategoryAnalysis> {
    const prices = products.map(p => p.price);
    const margins = products.map(p => (p.price - p.costPerItem) / p.price);

    return {
      category,
      averageMargin: margins.reduce((a, b) => a + b, 0) / margins.length,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      },
      competitivePosition: this.assessCompetitivePosition(products),
      recommendations: this.generateCategoryRecommendations(category, products)
    };
  }

  private analyzeMarketPositioning(products: ProductVariant[], insights: PricingInsight[]) {
    // 根據價格和建議將產品分類
    const sortedProducts = products.sort((a, b) => a.price - b.price);
    const total = sortedProducts.length;

    return {
      budget: sortedProducts.slice(0, Math.floor(total * 0.3)),
      competitive: sortedProducts.slice(Math.floor(total * 0.3), Math.floor(total * 0.7)),
      premium: sortedProducts.slice(Math.floor(total * 0.7))
    };
  }

  private generateOverallRecommendations(insights: PricingInsight[], categoryAnalysis: CategoryAnalysis[]): string[] {
    const recommendations = [];
    
    const highImpactProducts = insights.filter(i => Math.abs(i.potentialImpact.profitChange) > 20);
    if (highImpactProducts.length > 0) {
      recommendations.push(`發現 ${highImpactProducts.length} 個產品有超過20%的利潤改善潛力`);
    }

    const lowMarginCategories = categoryAnalysis.filter(c => c.averageMargin < 0.3);
    if (lowMarginCategories.length > 0) {
      recommendations.push(`以下類別毛利率偏低，需要檢視定價策略: ${lowMarginCategories.map(c => c.category).join(', ')}`);
    }

    return recommendations;
  }

  private assessCompetitivePosition(products: ProductVariant[]): string {
    const margins = products.map(p => (p.price - p.costPerItem) / p.price);
    const avgMargin = margins.reduce((a, b) => a + b, 0) / margins.length;
    
    if (avgMargin > 0.5) return '高端定位';
    if (avgMargin > 0.3) return '中端競爭';
    return '價格敏感';
  }

  private generateCategoryRecommendations(category: string, products: ProductVariant[]): string[] {
    // 基於類別特性生成建議
    const recommendations = [];
    const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
    
    if (avgPrice < 20) {
      recommendations.push('考慮捆綁銷售提升客單價');
    }
    if (products.some(p => !p.compareAtPrice)) {
      recommendations.push('建議設定比較價格增強價值感知');
    }
    
    return recommendations;
  }

  private parseHiddenCostAnalysis(response: string, product: ProductVariant) {
    // 解析AI回應的隱藏成本
    const basePrice = product.price;
    return {
      customerServiceCost: basePrice * 0.05,
      returnCost: basePrice * 0.08,
      inventoryCost: basePrice * 0.12,
      marketingCost: basePrice * 0.15,
      totalHiddenCost: basePrice * 0.4
    };
  }

  private getDefaultHiddenCosts(product: ProductVariant) {
    const basePrice = product.price;
    return {
      customerServiceCost: basePrice * 0.05,
      returnCost: basePrice * 0.08,
      inventoryCost: basePrice * 0.12,
      marketingCost: basePrice * 0.15,
      totalHiddenCost: basePrice * 0.4
    };
  }
}

export default AIPricingAnalyzer;