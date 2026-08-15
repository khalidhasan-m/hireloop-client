import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#121212] text-gray-400 py-12 px-6 flex justify-center border-t border-white/10">
      <div className="w-full max-w-6xl flex flex-col justify-between gap-12">
        
        {/* Top Section: Brand + Links Columns */}
        <div className="flex flex-col md:flex-row justify-between gap-10">
          
          {/* Left: Logo & Tagline */}
          <div className="flex flex-col gap-4 max-w-xs">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-black tracking-tight text-white">
                hire<span className="text-blue-500">l</span><span className="text-orange-500">oop</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              The AI-native career platform. Built for people who take their work seriously.
            </p>
          </div>

          {/* Right: Navigation Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            
            {/* Column 1: Product */}
            <div className="flex flex-col gap-3">
              <h3 className="text-blue-500 font-semibold tracking-wider">Product</h3>
              <Link href="/jobs" className="hover:text-white transition-colors">Job discovery</Link>
              <Link href="/worker-ai" className="hover:text-white transition-colors">Worker AI</Link>
              <Link href="/companies" className="hover:text-white transition-colors">Companies</Link>
              <Link href="/salary-data" className="hover:text-white transition-colors">Salary data</Link>
            </div>

            {/* Column 2: Navigations */}
            <div className="flex flex-col gap-3">
              <h3 className="text-blue-500 font-semibold tracking-wider">Navigations</h3>
              <Link href="/help" className="hover:text-white transition-colors">Help center</Link>
              <Link href="/career-library" className="hover:text-white transition-colors">Career library</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>

            {/* Column 3: Resources */}
            <div className="flex flex-col gap-3">
              <h3 className="text-blue-500 font-semibold tracking-wider">Resources</h3>
              <Link href="/brand-guideline" className="hover:text-white transition-colors">Brand Guideline</Link>
              <Link href="/newsroom" className="hover:text-white transition-colors">Newsroom</Link>
            </div>

          </div>
        </div>

        {/* Bottom Section: Social Icons & Legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5">
          
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {/* Facebook */}
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-[#1c1c1e] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            {/* Pinterest */}
            <a 
              href="https://pinterest.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-[#1c1c1e] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Pinterest"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.223 7.462-1.214 0-2.352-.63-2.74-1.379l-.749 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-[#1c1c1e] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>

          {/* Copyright & Policies */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-gray-500">
            <span>Copyright 2026 — Hire Loop</span>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-700" />
            <div className="flex gap-4">
              <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms & Policy</Link>
              <span>-</span>
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Guideline</Link>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}