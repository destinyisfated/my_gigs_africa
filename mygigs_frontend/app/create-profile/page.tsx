"use client";

// Import necessary hooks and icons
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, X, User } from "lucide-react";

const FreelancerCreatePage = () => {
    // State for form fields
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [primaryCategory, setPrimaryCategory] = useState("");
    const [profession, setProfession] = useState("");
    const [skillInput, setSkillInput] = useState("");
    const [skills, setSkills] = useState([]);
    const [years_of_experience, setYearsOfExperience] = useState("");
    const [availability, setAvailability] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [phone_number, setPhoneNumber] = useState("");
    const [portfolio, setPortfolio] = useState("");

    // State for the profile photo
    const [profile_image, setProfileImage] = useState(null);
    const [profileFile, setProfileFile] = useState(null); // State to hold the actual file

    // State for UI feedback
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Hook to handle client-side routing
    const router = useRouter();

    const handleAddSkill = () => {
        if (skillInput.trim() !== "" && !skills.includes(skillInput.trim())) {
            setSkills([...skills, skillInput.trim()]);
            setSkillInput("");
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSkills(skills.filter((skill) => skill !== skillToRemove));
    };

    // Function to handle file upload and preview
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileFile(file); // Store the file itself
            setProfileImage(URL.createObjectURL(file)); // Create URL for preview
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Create a FormData object to handle text and file data
        const formPayload = new FormData();
        
        // Append all fields to the FormData object
        formPayload.append("name", name);
        formPayload.append("bio", bio);
        formPayload.append("profession", profession);
        formPayload.append("skills", skills.join(", "));
        formPayload.append("years_of_experience", years_of_experience);
        formPayload.append("availability", availability);
        formPayload.append("city", city);
        formPayload.append("country", country);
        formPayload.append("phone_number", phone_number);

        if (profileFile) {
            formPayload.append("profile_image", profileFile);
        }
        if (primaryCategory) {
            formPayload.append("primary_category", primaryCategory);
        }
        if (portfolio) {
            formPayload.append("portfolio", portfolio);
        }

        try {
            const response = await fetch("http://localhost:8000/core/freelancers1/", {
                method: 'POST',
                body: formPayload,
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Freelancer profile created successfully!' });
                setTimeout(() => {
                    router.push('/freelancer-dashboard');
                }, 2000);
            } else {
                const errorData = await response.json();
                setMessage({ type: 'error', text: 'Failed to create profile. ' + JSON.stringify(errorData) });
            }
        } catch (error) {
            console.error('Network error:', error);
            setMessage({ type: 'error', text: 'A network error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

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

            <div className="w-full max-w-2xl mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information Section */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                        <h2 className="text-2xl font-bold mb-4 border-b pb-2 border-gray-200 flex items-center gap-2">
                            <User size={24} />
                            Personal Information
                        </h2>
                        <div className="flex items-center gap-6 mb-6">
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 overflow-hidden">
                                {profile_image ? (
                                    <img
                                        src={profile_image}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={40} />
                                )}
                            </div>
                            <label htmlFor="photo-upload" className="cursor-pointer">
                                <input
                                    type="file"
                                    id="photo-upload"
                                    name="profile_image"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                />
                                <div className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-md border border-gray-300 transition-colors duration-200">
                                    Upload Photo
                                </div>
                            </label>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Jane Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 mt-1"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="profession"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Professional Title
                                </label>
                                <input
                                    type="text"
                                    id="profession"
                                    name="profession"
                                    placeholder="Full Stack Developer"
                                    value={profession}
                                    onChange={(e) => setProfession(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 mt-1"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="bio"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Professional Bio
                                </label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    placeholder="Tell us about your professional background and unique skills..."
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 mt-1 resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Skills & Expertise Section */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                        <h2 className="text-2xl font-bold mb-4 border-b pb-2 border-gray-200">
                            Skills & Expertise
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label
                                    htmlFor="primaryCategory"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Primary Category
                                </label>
                                <div className="relative mt-1">
                                    <select
                                        id="primaryCategory"
                                        name="primaryCategory"
                                        value={primaryCategory}
                                        onChange={(e) => setPrimaryCategory(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">Select your main category</option>
                                        <option value="Web Development">Web Development</option>
                                        <option value="Graphic Design">Graphic Design</option>
                                        <option value="Content Writing">Content Writing</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="skills"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Skills
                                </label>
                                <div className="flex items-center gap-2 mt-1">
                                    <input
                                        type="text"
                                        id="skills"
                                        name="skillInput"
                                        placeholder="Add a skill"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleAddSkill();
                                            }
                                        }}
                                        className="flex-grow px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddSkill}
                                        className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-md"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M5 12h14" />
                                            <path d="M12 5v14" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSkill(skill)}
                                                className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="experience"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Years of Experience
                                </label>
                                <div className="relative mt-1">
                                    <select
                                        id="experience"
                                        name="years_of_experience"
                                        value={years_of_experience}
                                        onChange={(e) => setYearsOfExperience(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">Select experience level</option>
                                        <option value="0-2 years">0-2 years</option>
                                        <option value="2-5 years">2-5 years</option>
                                        <option value="5+ years">5+ years</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label
                                        htmlFor="availability"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Availability
                                    </label>
                                    <div className="relative mt-1">
                                        <select
                                            id="availability"
                                            name="availability"
                                            value={availability}
                                            onChange={(e) => setAvailability(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                            <option value="">Select availability</option>
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Project-based">Project-based</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                        <h2 className="text-2xl font-bold mb-4 border-b pb-2 border-gray-200">
                            Contact Information
                        </h2>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="city"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        placeholder="Nairobi"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 mt-1"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="country"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        id="country"
                                        name="country"
                                        placeholder="Kenya"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 mt-1"
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="phone_number"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone_number"
                                    name="phone_number"
                                    placeholder="+254712345678"
                                    value={phone_number}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 mt-1"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="portfolio"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Portfolio Website (Optional)
                                </label>
                                <input
                                    type="url"
                                    id="portfolio"
                                    name="portfolio"
                                    placeholder="https://yourportfolio.com"
                                    value={portfolio}
                                    onChange={(e) => setPortfolio(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 mt-1"
                                />
                            </div>
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
                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 disabled:opacity-50"
                        >
                            {loading ? "Completing Profile..." : "Complete Profile"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FreelancerCreatePage;
