import { Palette, Type, PictureInPicture, Download, Sparkles, Music } from 'lucide-react';

const featuresList = [
  {
    icon: <Type className="w-8 h-8 text-gray-900" />,
    title: "Brat Text Generator",
    description: "Create unique brat aesthetic text with our specialized fonts and styles"
  },
  {
    icon: <Palette className="w-8 h-8 text-gray-900" />,
    title: "Brat Color Palettes",
    description: "Access curated color schemes inspired by Charli XCX and pop culture"
  },
  {
    icon: <PictureInPicture className="w-8 h-8 text-gray-900" />,
    title: "Brat Cover Generator",
    description: "Design perfect album, playlist, or social media covers"
  },
  {
    icon: <Download className="w-8 h-8 text-gray-900" />,
    title: "Free Downloads",
    description: "Export your designs as PNG, JPEG, or WebP with no watermarks"
  },
  {
    icon: <Sparkles className="w-8 h-8 text-gray-900" />,
    title: "Brat Effects",
    description: "Add glitter, sparkles, and other brat aesthetic effects"
  },
  {
    icon: <Music className="w-8 h-8 text-gray-900" />,
    title: "Charli XCX Templates",
    description: "Pre-made designs inspired by the Brat pop icon"
  }
];

export default function Features() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">Brat Generator Features</h2>
        <p className="mt-4 text-lg text-gray-600">
          Everything you need to create perfect brat aesthetic designs
        </p>
      </div>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {featuresList.map((feature) => (
          <div key={feature.title} className="text-center bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gray-100 mx-auto mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
            <p className="mt-2 text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}