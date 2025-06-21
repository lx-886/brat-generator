import { Wand2, Palette, Download } from 'lucide-react';

const steps = [
  {
    icon: <Wand2 className="w-8 h-8 text-gray-900" />,
    title: "Choose Your Style",
    description: "Select from our brat aesthetic templates or start from scratch"
  },
  {
    icon: <Palette className="w-8 h-8 text-gray-900" />,
    title: "Customize Design",
    description: "Adjust colors, text, and effects to match your brat style"
  },
  {
    icon: <Download className="w-8 h-8 text-gray-900" />,
    title: "Download or Share",
    description: "Save your creation or share directly to social media"
  }
];

export default function HowItWorks() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">How Our Brat Generator Works</h2>
        <p className="mt-4 text-lg text-gray-600">
          Create stunning brat aesthetic designs in just 3 easy steps
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gray-100 mx-auto mb-4">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
            <p className="mt-2 text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}