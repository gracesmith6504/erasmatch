
import { Link } from "react-router-dom";

export const HomeFooter = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Helping Erasmus students feel connected, wherever they go.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          <Link to="/about" className="text-gray-500 hover:text-blue-600 transition-colors">About</Link>
          <Link to="/blog" className="text-gray-500 hover:text-blue-600 transition-colors">Blog</Link>
          <Link to="/faq" className="text-gray-500 hover:text-blue-600 transition-colors">FAQ</Link>
          <Link to="/contact" className="text-gray-500 hover:text-blue-600 transition-colors">Contact</Link>
          <a href="https://instagram.com/erasmatch" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">Instagram</a>
        </div>
      </div>
    </section>
  );
};
