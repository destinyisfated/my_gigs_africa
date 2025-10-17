"use client"; // Ensure this is a Client Component (Next.js 13+ App Router)

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation"; // For redirect after success

export default function PostGigForm() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = await getToken({ template: "default" }); // Use backend template
      if (!token) {
        throw new Error("No authentication token available. Please log in.");
      }

      console.log("Sending request:", { title, description, token });

      const response = await axios.post(
        "http://localhost:8000/core/gigs/", // Use full URL in dev if no proxy
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Gig posted successfully!");
      console.log("Gig posted:", response.data);

      // Reset form
      setTitle("");
      setDescription("");

      // Optional: Redirect to gigs list
      router.push("/gigs");
    } catch (error) {
      console.error("Error posting gig:", error);
      setError(
        error.response?.data?.detail ||
          error.message ||
          "Failed to post gig. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Gig Title"
            className="w-full border p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your gig"
            className="w-full border p-2"
            rows="5"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Gig"}
        </button>
      </form>
    </div>
  );
}
