import React, { useState } from 'react';
import { Search, Download, Star, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const AIAppStore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const apps = [
    {
      name: 'ChatGPT',
      description: '由OpenAI开发的强大AI聊天助手',
      rating: 4.8,
      downloads: '1000万+',
      icon: '🤖',
      size: '156MB'
    },
    {
      name: 'Claude',
      description: 'Anthropic开发的智能AI助手',
      rating: 4.9,
      downloads: '500万+',
      icon: '🎯',
      size: '142MB'
    },
    {
      name: 'Midjourney',
      description: 'AI艺术创作和图像生成工具',
      rating: 4.7,
      downloads: '300万+',
      icon: '🎨',
      size: '225MB'
    }
  ];

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI 应用商店</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="搜索AI应用..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredApps.map((app) => (
          <Card key={app.name} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{app.icon}</div>
                <div>
                  <CardTitle>{app.name}</CardTitle>
                  <CardDescription>{app.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="fill-yellow-400 text-yellow-400" size={20} />
                  <span>{app.rating}</span>
                  <span className="text-gray-500">· {app.downloads} 下载</span>
                  <span className="text-gray-500">· {app.size}</span>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600">
                  <Download size={20} />
                  安装
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIAppStore;
