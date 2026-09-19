import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ArticleView from '@/components/journal/ArticleView';
import { getArticle } from '@/data/journal';

// /journal/:slug — looks the article up and hands it to ArticleView. How an
// article is presented (block types, layout options) lives in
// src/components/journal/ and src/data/journalTypes.ts.
const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticle(slug ?? '');
  return article ? <ArticleView article={article} /> : <Navigate to="/journal" replace />;
};

export default ArticlePage;
