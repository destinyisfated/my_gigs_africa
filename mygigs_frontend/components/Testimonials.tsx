import React from "react";

// Placeholder data for testimonials
const testimonials = [
  {
    text: "MyGigs helped me land my first major freelance project. The platform is incredibly easy to use and the support is fantastic!",
    author: "Jane Muthoni",
    role: "Freelance Graphic Designer",
  },
  {
    text: "Finding skilled freelancers in Africa used to be a challenge. MyGigs simplified the process and connected me with top talent instantly.",
    author: "Kwame Nkrumah",
    role: "Startup Founder",
  },
  {
    text: "The subscription fee is a small price to pay for the opportunities I've received. I highly recommend this platform to all my peers.",
    author: "Sarah Akinyi",
    role: "Web Developer",
  },
];

export function Testimonials() {
  return (
    <section className="bg-gray-300 py-5 md:py-10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-12">
          What Our Users Are Saying
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-200 p-8 rounded-xl shadow-lg h-full flex flex-col justify-between transform transition-transform duration-300 hover:scale-[1.02]"
            >
              <p className="text-gray-700 text-lg italic mb-6">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div>
                <h4 className="font-semibold text-gray-800">
                  {testimonial.author}
                </h4>
                <p className="text-sm text-blue-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
