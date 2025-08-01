import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
    {
        question: "Is the Brat Generator really free to use?",
        answer: "Yes, our Brat Generator is 100% free with no hidden costs. You can create unlimited brat aesthetic designs, text, and images without paying anything."
    },
    {
        question: "Can I use the Brat Generator for Charli XCX fan art?",
        answer: "Absolutely! Our tool includes templates specifically inspired by Charli XCX's Brat aesthetic. Many fans use it to create tour posters, album covers, and social media content."
    },
    {
        question: "What makes your brat text generator different?",
        answer: "Our Brat Text Generator features specialized fonts and effects that capture the brat aesthetic perfectly. You won't find these unique styles in standard text generators."
    },
    {
        question: "How do I create a brat cover with your generator?",
        answer: "Simply select our 'Cover Generator' option, choose a template or start blank, customize with your text and colors, then download your perfect brat-style cover."
    },
    {
        question: "Can I use generated images commercially?",
        answer: "Yes, all images created with our Brat Generator are royalty-free and can be used for both personal and commercial projects."
    },
    {
        question: "What's the maximum resolution for generated images?",
        answer: "You can export images up to 1200x1200 pixels, ensuring high-quality results for print and digital use."
    },
    {
        question: "Do you offer premium brat generator features?",
        answer: "Currently all features are completely free. We may introduce premium options in the future, but the core Brat Generator will always remain free to use."
    }
];

export default function FAQ() {
    return (
        <div className="container mx-auto max-w-3xl px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">Brat Generator FAQs</h2>
                <p className="mt-4 text-lg text-gray-600">
                    Everything you need to know about creating brat aesthetic designs
                </p>
            </div>
            <Accordion type="single" collapsible className="w-full bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index + 1}`}>
                        <AccordionTrigger className="text-left hover:text-gray-900 text-lg font-medium">{item.question}</AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}