"use client";

// Import necessary hooks from React and Next.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// The main component for creating a freelancer profile
export default function FreelancerCreatePage() {
    // State to hold the form data. 'profile_image' is for the file, the rest are for text inputs.
    const [formData, setFormData] = useState({
        profile_image: null,
        name: '', // New field for the freelancer's name
        profession: '',
        bio: '',
        skills: '',
        years_of_experience: '',
        availability: '',
        phone_number: '',
        city: '',
        country: '',
    });
    // State to store the temporary URL for the image preview
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    // State to manage messages shown to the user (e.g., success or error)
    const [message, setMessage] = useState(null);
    // State to show a loading indicator while the form is submitting
    const [loading, setLoading] = useState(false);
    // Hook to handle client-side routing, used for redirection after submission
    const router = useRouter();

    // Event handler for all form input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        // Check if the input is the file upload field
        if (name === 'profile_image') {
            const file = files[0];
            setFormData({ ...formData, profile_image: file });
            // Create a temporary URL for the file to show a preview
            if (file) {
                setProfileImagePreview(URL.createObjectURL(file));
            } else {
                setProfileImagePreview(null);
            }
        } else {
            // For all other inputs, update the corresponding state value
            setFormData({ ...formData, [name]: value });
        }
    };

    // Handler to remove the selected image
    const handleRemoveImage = () => {
        setFormData({ ...formData, profile_image: null });
        setProfileImagePreview(null);
    };

    // Event handler for form submission
    const handleSubmit = async (e) => {
        // Prevent the default form submission behavior which reloads the page
        e.preventDefault();
        // Set loading state to true to disable the button and show an indicator
        setLoading(true);
        // Clear any previous messages
        setMessage(null);

        // Create a new FormData object to handle both text and file data
        const formPayload = new FormData();
        // Append each key-value pair from the state to the FormData object
        for (const key in formData) {
            formPayload.append(key, formData[key]);
        }
        
        try {
            // Send a POST request to the Django backend API endpoint
            const response = await fetch('http://localhost:8000/core/freelancers1/', {
                method: 'POST',
                body: formPayload, // Send the FormData object as the request body
            });

            // Check if the response was successful (status code 200-299)
            if (response.ok) {
                // Display a success message
                setMessage({ type: 'success', text: 'Freelancer profile created successfully!' });
                // Reset the form fields to their initial empty state
                setFormData({
                    profile_image: null,
                    name: '',
                    profession: '',
                    bio: '',
                    skills: '',
                    years_of_experience: '',
                    availability: '',
                    phone_number: '',
                    city: '',
                    country: '',
                });
                setProfileImagePreview(null); // Clear the image preview as well
                // Redirect the user to the freelancers list page after a 2-second delay
                setTimeout(() => {
                    router.push('/freelancers');
                }, 2000);
            } else {
                // If the response was not okay, parse the error data from the backend
                const errorData = await response.json();
                // Display an error message with details from the backend
                setMessage({ type: 'error', text: 'Failed to create profile. ' + JSON.stringify(errorData) });
            }
        } catch (error) {
            // Catch any network-related errors (e.g., server is down)
            console.error('Network error:', error);
            // Display a generic network error message
            setMessage({ type: 'error', text: 'A network error occurred. Please try again.' });
        } finally {
            // This block always runs, so we set loading to false whether the request succeeded or failed
            setLoading(false);
        }
    };

    // The component's JSX for rendering the form
    return (
        // Container for the whole page with Tailwind CSS classes for styling
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-inter">
            {/* The form card with padding, rounded corners, and a shadow */}
            <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-2xl shadow-xl">
                <h1 className="text-4xl font-extrabold text-center text-gray-800">Create Freelancer Profile</h1>

                {/* The main form element */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                        {profileImagePreview ? (
                            // Display the image preview if a file has been selected
                            <div className="mt-2 flex items-center justify-center space-x-4">
                                <img src={profileImagePreview} alt="Profile preview" className="h-24 w-24 rounded-full object-cover shadow-md" />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                                >
                                    Remove Photo
                                </button>
                            </div>
                        ) : (
                            // Show the drag-and-drop box if no file is selected
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    {/* SVG icon for the file upload area */}
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        {/* The label that acts as the file upload button */}
                                        <label
                                            htmlFor="profile-image-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                        >
                                            <span>Upload a file</span>
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        )}
                        {/* The actual hidden file input */}
                        <input
                            id="profile-image-upload"
                            name="profile_image"
                            type="file"
                            className="sr-only"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Text Inputs section with a grid layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name input field - New field */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        {/* Profession input field */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700">Profession</label>
                            <input
                                type="text"
                                name="profession"
                                value={formData.profession}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        {/* Years of Experience input field */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                            <input
                                type="number"
                                name="years_of_experience"
                                value={formData.years_of_experience}
                                onChange={handleChange}
                                required
                                min="0"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        {/* Availability input field */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700">Availability</label>
                            <input
                                type="text"
                                name="availability"
                                value={formData.availability}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="e.g., Full-time, Part-time"
                            />
                        </div>
                        {/* Phone Number input field */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="tel"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="e.g., +254712345678"
                            />
                        </div>
                        {/* City input field */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        {/* Country input field */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        {/* Skills input field (full width) */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="e.g., Python, Django, React, CSS"
                            />
                        </div>
                        {/* Bio textarea (full width) */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            ></textarea>
                        </div>
                    </div>

                    {/* Submission button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading} // Disable the button while loading
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Create Profile'}
                        </button>
                    </div>
                </form>

                {/* Conditional rendering for success or error messages */}
                {message && (
                    <div className={`mt-4 p-4 rounded-lg text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        <p className="font-medium">{message.text}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
