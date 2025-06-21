import Link from "next/link";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          Brat<span className="text-gray-600">Generator</span>
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link href="#generator" className="text-gray-900 hover:text-gray-600 font-medium">Generator</Link>
          <Link href="#examples" className="text-gray-900 hover:text-gray-600 font-medium">Examples</Link>
          <Link href="#features" className="text-gray-900 hover:text-gray-600 font-medium">Features</Link>
          <Link href="#trending" className="text-gray-900 hover:text-gray-600 font-medium">Trending</Link>
          <Link href="#faq" className="text-gray-900 hover:text-gray-600 font-medium">FAQ</Link>
        </nav>
        
        <button className="md:hidden text-gray-900">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}