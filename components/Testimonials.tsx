const testimonials = [
    {
      quote: "This Brat Generator is everything! I use it daily for my Instagram stories. The Charli XCX inspired templates are perfect.",
      author: "Jamie L.",
      role: "Social Media Influencer"
    },
    {
      quote: "As a small artist, this free brat generator helps me create professional-looking covers without design skills.",
      author: "Alex T.",
      role: "Independent Musician"
    },
    {
      quote: "I've tried many brat text generators, but this one has the best fonts and customization options by far.",
      author: "Sam K.",
      role: "Graphic Designer"
    }
  ];
  
  export default function Testimonials() {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">What People Say About Our Brat Generator</h2>
          <p className="mt-4 text-lg text-gray-600">
            Join thousands of creators using our tool daily
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <blockquote className="text-lg italic text-gray-700">
                {testimonial.quote}
              </blockquote>
              <div className="mt-6">
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }