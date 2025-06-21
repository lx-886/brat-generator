import Link from "next/link";
import { Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Brat Generator</h3>
            <p className="text-gray-400">
              The ultimate free online tool for creating brat aesthetic designs, text, and images inspired by Charli XCX and pop culture.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="#generator" className="text-gray-400 hover:text-white">Brat Generator</Link></li>
              <li><Link href="#examples" className="text-gray-400 hover:text-white">Examples</Link></li>
              <li><Link href="#features" className="text-gray-400 hover:text-white">Features</Link></li>
              <li><Link href="#trending" className="text-gray-400 hover:text-white">Trending</Link></li>
              <li><Link href="#faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white">Brat Aesthetic Blog</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Tutorials</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Charli XCX Inspiration</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Brat Fonts</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} bratgenerators.org. All rights reserved.</p>
          <div className="mt-2 text-sm">
            <Link href="#" className="hover:text-white">Privacy Policy</Link> | 
            <Link href="#" className="hover:text-white ml-2">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}