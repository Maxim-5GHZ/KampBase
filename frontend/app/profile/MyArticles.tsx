
import React from "react";
import { Article } from "../utils/types";
import { Trash2 } from "lucide-react";

interface MyArticlesProps {
  articles: Article[];
  onDelete: (id: number) => void;
}

const MyArticles: React.FC<MyArticlesProps> = ({ articles, onDelete }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">My Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-bold">{article.title}</h3>
            <p className="text-gray-500">{article.about}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => onDelete(article.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyArticles;
