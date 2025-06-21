import Image from "next/image";

const trendingDesigns = [
  {
    title: "Brat Summer Text",
    description: "The most popular brat text style this season",
    image: "/imgs/summer-text.png",
    tags: ["brat text", "trending", "summer"]
  },
  {
    title: "Charli XCX Tour Style",
    description: "Inspired by the latest Brat tour visuals",
    image: "/imgs/tour-style.jpg",
    tags: ["Charli XCX", "tour", "brat aesthetic"]
  },
  {
    title: "Brat Playlist Cover",
    description: "Perfect for your hyperpop playlists",
    image: "/imgs/playlist-cover.png",
    tags: ["cover", "playlist", "music"]
  }
];

export default function TrendingDesigns() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">Trending Brat Designs</h2>
        <p className="mt-4 text-lg text-gray-600">
          Get inspired by the most popular brat aesthetic creations
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {trendingDesigns.map((design, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
            <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden">
              <Image 
                src={design.image}
                alt={design.title}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{design.title}</h3>
            <p className="mt-2 text-gray-600">{design.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {design.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}