'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";

export default function CreateArticlePage() {
  const [article, setArticle] = useState({
    title: '',
    description: '',
    content: '',
    slug: ''  // 用作文章的 Markdown 文件名
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticle(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/articles/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create article');
      }

      router.push('/admin/articles');
    } catch (error) {
      console.error('Error creating article:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Article</h1>
        <Link href="/admin/articles">
          <Button variant="outline">Back to Articles</Button>
        </Link>
      </div>

      {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}

      <div className="space-y-6">
        {/* 文章标题 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Title
            <span className="text-red-500 ml-1">*</span>
            <span className="text-gray-500 text-xs ml-2">(Required)</span>
          </label>
          <Input
            name="title"
            value={article.title}
            onChange={handleInputChange}
            placeholder="Enter article title"
            required
          />
        </div>

        {/* 文章描述 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Description
            <span className="text-gray-500 text-xs ml-2">(A brief summary of your article)</span>
          </label>
          <Textarea
            name="description"
            value={article.description}
            onChange={handleInputChange}
            placeholder="Enter article description"
            rows={3}
          />
        </div>

        {/* 文件名 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            File Name
            <span className="text-red-500 ml-1">*</span>
            <span className="text-gray-500 text-xs ml-2">(Will be used as the .md file name)</span>
          </label>
          <Input
            name="slug"
            value={article.slug}
            onChange={handleInputChange}
            placeholder="e.g., getting-started-with-lemobook"
            required
          />
        </div>

        {/* 文章内容 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Content
            <span className="text-red-500 ml-1">*</span>
            <span className="text-gray-500 text-xs ml-2">(Markdown format supported)</span>
          </label>
          <Textarea
            name="content"
            value={article.content}
            onChange={handleInputChange}
            placeholder="Write your article content here (Markdown supported)"
            rows={20}
            className="font-mono"
            required
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className={isLoading ? 'opacity-50' : ''}
          >
            {isLoading ? 'Creating...' : 'Create Article'}
          </Button>
        </div>
      </div>
    </div>
  );
}