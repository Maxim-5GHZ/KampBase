import React from "react";
import { Article } from "../utils/types";
import { Trash2, BookOpen, Clock } from "lucide-react";

interface MyArticlesProps {
  articles: Article[];
  onDelete: (id: number) => void;
}

const MyArticles: React.FC<MyArticlesProps> = ({ articles, onDelete }) => {
  return (
    <div className="p-4">
      <h2 className="text-center text-2xl sm:text-3xl font-bold mb-6 text-custom-main">
        Ваши статьи в Wiki
      </h2>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-custom-bg-secondary rounded-card shadow-md p-6 flex flex-col border border-custom-secondary/10 group hover:border-custom-accent transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-custom-accent/10 rounded-2xl text-custom-accent">
                  <BookOpen size={24} />
                </div>
                <button
                  onClick={() => onDelete(article.id)}
                  className="text-custom-secondary hover:text-red-500 p-2 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <h3 className="text-lg font-bold text-custom-main mb-2 line-clamp-2">
                {article.title}
              </h3>

              <p className="text-custom-secondary text-sm line-clamp-3 mb-6 flex-grow">
                {article.about}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-custom-secondary/10 text-xs text-custom-secondary">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>5 мин чтения</span>
                </div>
                <span className="bg-custom-bg-main px-2 py-1 rounded-md uppercase font-mono tracking-wider">
                  {article.format}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-custom-bg-secondary/50 rounded-card border-2 border-dashed border-custom-secondary/20">
          <p className="text-custom-secondary">
            У вас пока нет опубликованных статей.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyArticles;
