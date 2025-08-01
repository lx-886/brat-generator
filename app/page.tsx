// app/page.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BratGenerator from "@/components/BratGenerator";
import Features from "@/components/Features";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";
import BratExamples from "@/components/BratExamples";
import HowItWorks from "@/components/HowItWorks";
import TrendingDesigns from "@/components/TrendingDesigns";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-white">
      <Header />
      <main className="flex-1">
        {/* 第一屏：核心工具 */}
        <section id="generator" className="min-h-screen flex items-center justify-center bg-gray-50 py-12 w-full">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 text-gray-900">Brat Generator</h1>
            <p className="text-center text-xl mb-12 text-gray-700 max-w-3xl mx-auto">
              Create unique brat aesthetic designs, text, and images inspired by Charli XCX and pop culture. Our free Brat Generator tool helps you express your brat style effortlessly.
            </p>
            <BratGenerator />
          </div>
        </section>

        {/* 第二屏：示例展示 */}
        <section id="examples" className="py-16 md:py-24 bg-white">
          <BratExamples />
        </section>

        {/* 第三屏：功能介绍 */}
        <section id="features" className="py-16 md:py-24 bg-gray-50">
          <Features />
        </section>

        {/* 第四屏：使用教程 */}
        <section id="how-it-works" className="py-16 md:py-24 bg-white">
          <HowItWorks />
        </section>

        {/* 第五屏：流行设计 */}
        <section id="trending" className="py-16 md:py-24 bg-gray-50">
          <TrendingDesigns />
        </section>

        {/* 第六屏：用户评价 */}
        <section id="testimonials" className="py-16 md:py-24 bg-white">
          <Testimonials />
        </section>

        {/* 第七屏：FAQ */}
        <section id="faq" className="py-16 md:py-24 bg-gray-50">
          <FAQ />
        </section>
      </main>
      <Footer />
    </div>
  );
}