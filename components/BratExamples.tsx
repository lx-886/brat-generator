import Image from "next/image";

const examples = [
  {
    title: "Brat Text Generator Example",
    description: "Create bold, bratty text for your social media posts",
    image: "/imgs/text.jpeg",
    alt: "Brat text generator example output"
  },
  {
    title: "Charli XCX Inspired Design",
    description: "Generate designs inspired by the Brat pop aesthetic",
    image: "/imgs/charlie.jpg",
    alt: "Charli XCX brat generator example"
  },
  {
    title: "Brat Cover Generator",
    description: "Make custom brat style album or playlist covers",
    image: "/imgs/cover.webp",
    alt: "Brat cover generator example"
  }
];

export default function BratExamples() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">Brat Generator Examples</h2>
        <p className="mt-4 text-lg text-gray-600">
          See what you can create with our free Brat Generator tool
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {examples.map((example, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
            <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden">
              <Image 
                src={example.image}
                alt={example.alt}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{example.title}</h3>
            <p className="mt-2 text-gray-600">{example.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}