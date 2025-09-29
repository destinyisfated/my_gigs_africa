'use client';

import { useState } from "react";
import { ChevronDown, Briefcase, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const CreateGigPage = ({ onBack }) => {
    const [gigData, setGigData] = useState({
        title: "",
        description: "",
        category: "",
        price: "",
        location: "",
        contact_email: "",
        contact_phone: "",
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGigData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const requiredFields = ["title", "description", "category", "price", "location", "contact_email"];
        const missingFields = requiredFields.filter(field => !gigData[field]);

        if (missingFields.length > 0 || !imageFile) {
            setMessage({ type: "error", text: "Please fill in all required fields and upload an image." });
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("title", gigData.title);
        formData.append("description", gigData.description);
        formData.append("category", gigData.category);
        formData.append("price", gigData.price);
        formData.append("location", gigData.location);
        formData.append("contact_email", gigData.contact_email);
        formData.append("contact_phone", gigData.contact_phone);
        formData.append("image", imageFile);

        try {
            const response = await fetch("http://localhost:8000/core/gigs1/", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage({
                    type: "success",
                    text: "Gig created successfully! Redirecting...",
                });
                setGigData({
                    title: "",
                    description: "",
                    category: "",
                    price: "",
                    location: "",
                    contact_email: "",
                    contact_phone: "",
                });
                setImageFile(null);
                setImagePreview(null);
                setShowPreview(false);
                
                setTimeout(() => {
                    onBack();
                }, 1500);
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.detail || "Failed to create gig.";
                setMessage({ type: "error", text: errorMessage });
            }
        } catch (error) {
            console.error("Network error:", error);
            setMessage({
                type: "error",
                text: "A network error occurred. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return <div>Loading user data...</div>;
  }

  // Access the user's email address
  const userEmail = user?.emailAddresses[0]?.emailAddress;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <style>
                {`
                @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
                body {
                    font-family: "Inter", sans-serif;
                }
                .appearance-none::-ms-expand {
                    display: none;
                }
                .appearance-none {
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                }
                `}
            </style>
            
            <div className="w-full max-w-lg mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={onBack}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        &larr; Back
                    </button>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Briefcase size={24} />
                        Create a New Gig
                    </h1>
                </div>
                <div className="text-center mb-6">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center justify-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                    >
                        {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
                        {showPreview ? "Hide Preview" : "Show Preview"}
                    </button>
                </div>
                {showPreview && (
                    <div className="border border-gray-300 rounded-lg p-4 mb-6 transition-all duration-300 ease-in-out">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Live Preview</h2>
                        <div className="bg-gray-100 rounded-md overflow-hidden shadow-sm">
                            {imagePreview && (
                                <img src={imagePreview} alt="Gig Preview" className="w-full h-48 object-cover" />
                            )}
                            {!imagePreview && (
                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                                    <ImageIcon size={48} />
                                </div>
                            )}
                            <div className="p-4 space-y-2">
                                <h3 className="text-lg font-semibold text-gray-900">{gigData.title || "Gig Title"}</h3>
                                <p className="text-sm text-gray-600">{gigData.description || "Gig Description"}</p>
                                <p className="text-md font-bold text-orange-600">${gigData.price || "0.00"}</p>
                                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                    <span className="bg-orange-200 text-orange-800 rounded-full px-2 py-1">{gigData.category || "Category"}</span>
                                    <span>{gigData.location || "Location"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Gig Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="e.g., I will design a modern logo for your brand"
                            value={gigData.title}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Gig Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Describe your gig in detail..."
                            value={gigData.description}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                            required
                        ></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="category"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Category
                            </label>
                            <div className="relative">
                                <select
                                    id="category"
                                    name="category"
                                    value={gigData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    <option value="Web Development">Web Development</option>
                                    <option value="Graphic Design">Graphic Design</option>
                                    <option value="Content Writing">Content Writing</option>
                                    <option value="Digital Marketing">Digital Marketing</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="price"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Price (USD)
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                placeholder="e.g., 50.00"
                                value={gigData.price}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="location"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            placeholder="e.g., Nairobi, Kenya"
                            value={gigData.location}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="contact_email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Contact Email
                            </label>
                            <input
                                type="email"
                                id="contact_email"
                                name="contact_email"
                                placeholder="e.g., email@example.com"
                                value={userEmail}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="contact_phone"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Contact Phone (Optional)
                            </label>
                            <input
                                type="tel"
                                id="contact_phone"
                                name="contact_phone"
                                placeholder="e.g., +254 712 345 678"
                                value={gigData.contact_phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="image-upload"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Gig Image
                        </label>
                        <div className="flex items-center gap-4">
                            <label htmlFor="image-upload" className="cursor-pointer">
                                <input
                                    type="file"
                                    id="image-upload"
                                    name="image"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    required
                                />
                                <div className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-md border border-gray-300 transition-colors duration-200">
                                    Upload Image
                                </div>
                            </label>
                            {imagePreview && (
                                <div className="w-20 h-20 overflow-hidden rounded-lg border border-gray-300 flex-shrink-0">
                                    <img src={imagePreview} alt="Gig Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-md text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message.text}
                        </div>
                    )}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 disabled:opacity-50"
                        >
                            {loading ? "Creating Gig..." : "Create Gig"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGigPage;
