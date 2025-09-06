import heroImage from "../public/hero-image.jpg";

// data/gigsData.ts

// Define the type for a single gig object
export interface Gig {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number;
  profession: string;
  location: string;
}

export const gigsData: Gig[] = [
  {
    id: "gig1",
    image: heroImage,
    title: "Professional Logo Design",
    description:
      "I will create a stunning and unique logo for your business that captures your brand identity.",
    price: 150,
    profession: "Graphic Design",
    location: "Nairobi, Kenya",
  },
  {
    id: "gig2",
    image: heroImage,
    title: "Responsive Next.js Website",
    description:
      "Building a fast and modern website using Next.js and Tailwind CSS for optimal performance.",
    price: 500,
    profession: "Web Development",
    location: "Accra, Ghana",
  },
  {
    id: "gig3",
    image: heroImage,
    title: "High-Quality Article Writing",
    description:
      "Crafting engaging and SEO-friendly articles on any topic to boost your content marketing efforts.",
    price: 80,
    profession: "Content Writing",
    location: "Lagos, Nigeria",
  },
  {
    id: "gig4",
    image: heroImage,
    title: "4K Video Editing Services",
    description:
      "Transform your raw footage into a professional and cinematic video with smooth transitions and effects.",
    price: 300,
    profession: "Video Production",
    location: "Cape Town, South Africa",
  },
  {
    id: "gig5",
    image: heroImage,
    title: "SEO Audit & Optimization",
    description:
      "Comprehensive analysis of your website to identify and fix SEO issues, helping you rank higher on search engines.",
    price: 250,
    profession: "Marketing",
    location: "Nairobi, Kenya",
  },
  {
    id: "gig6",
    image: heroImage,
    title: "Custom Mobile App Development",
    description:
      "I will develop a custom mobile application for iOS and Android platforms, tailored to your business needs.",
    price: 1200,
    profession: "Mobile Development",
    location: "Lagos, Nigeria",
  },
  {
    id: "gig7",
    image: heroImage,
    title: "Custom Mobile App Development",
    description:
      "I will develop a custom mobile application for iOS and Android platforms, tailored to your business needs.",
    price: 1200,
    profession: "Mobile Development",
    location: "Lagos, Nigeria",
  },
  {
    id: "gig8",
    image: heroImage,
    title: "Custom Mobile App Development",
    description:
      "I will develop a custom mobile application for iOS and Android platforms, tailored to your business needs.",
    price: 1200,
    profession: "Mobile Development",
    location: "Lagos, Nigeria",
  },
  {
    id: "gig9",
    image: heroImage,
    title: "Custom Mobile App Development",
    description:
      "I will develop a custom mobile application for iOS and Android platforms, tailored to your business needs.",
    price: 1200,
    profession: "Mobile Development",
    location: "Lagos, Nigeria",
  },
];
