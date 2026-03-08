export interface ArticleCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  articles_count: number;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  body: string;
  excerpt: string | null;
  category: ArticleCategory | null;
  views_count: number;
  helpful_count: number;
  not_helpful_count: number;
  related_articles: ArticleSummary[];
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  category: ArticleCategory | null;
  views_count: number;
  published_at: string;
}

export interface ArticleFilters {
  search?: string;
  category_id?: number;
  page?: number;
}
