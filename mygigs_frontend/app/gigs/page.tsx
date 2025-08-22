import Image from "next/image";

async function getGigs() {
  const res = await fetch("http://127.0.0.1:8000/api/gigs/");
  if (!res.ok) {
    throw new Error("Failed to fetch gigs");
  }
  return res.json();
}

export default async function page() {
  const gigs = await getGigs();

  return (
    <main className="p-8 ">
      <h1>You can view and post gigs here</h1>
      <h1 className="text-2xl font-bold mb-4">Available Gigs</h1>
      <ul className="grid grid-cols-3 gap-2">
        {gigs.map((gig) => (
          <li key={gig.id} className="border p-4 mb-2 rounded-md">
            <Image src="/gig.jpg" alt="logo" width={100} height={100} />
            <h2 className="font-semibold text-lg">{gig.title}</h2>
            <p className="text-gray-600">Client: {gig.client}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
