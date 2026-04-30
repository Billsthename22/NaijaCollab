"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-white text-gray-900">

      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-br from-green-600 to-green-800 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Connect. Create. Collaborate.
        </h1>
        <p className="max-w-2xl text-lg md:text-xl mb-6">
          Naija Collab is where Nigerian creatives meet, build projects, and bring ideas to life.
        </p>
        <div className="flex gap-4">
          <button className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
            Join Now
          </button>
          <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-green-700 transition">
            Explore
          </button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {[
            {
              title: "Create Profile",
              desc: "Showcase your skills and what you bring to the table.",
            },
            {
              title: "Find Creatives",
              desc: "Discover talented people across Nigeria.",
            },
            {
              title: "Start Collaborating",
              desc: "Work together and build amazing projects.",
            },
          ].map((item, i) => (
            <div key={i} className="p-6 border rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 px-6 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-12">Who It's For</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {["Musicians", "Designers", "Developers", "Videographers", "Writers"].map(
            (cat, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <p className="font-semibold">{cat}</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">Why Naija Collab?</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          {[
            "Find creatives near you",
            "Build real-world projects",
            "Grow your network",
            "Showcase your portfolio",
          ].map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✔</span>
              <p>{feature}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-6 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-12">What Creatives Say</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              name: "Tobi, Music Producer",
              text: "I found my current team on Naija Collab. Game changer.",
            },
            {
              name: "Ada, Designer",
              text: "Finally a platform that understands Nigerian creatives.",
            },
            {
              name: "Emeka, Developer",
              text: "I've built 3 projects already with people I met here.",
            },
          ].map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow">
              <p className="italic mb-4">"{t.text}"</p>
              <h4 className="font-semibold">{t.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-6 text-center bg-green-700 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Your next big collaboration starts here
        </h2>
        <p className="mb-6">
          Join thousands of Nigerian creatives building the future together.
        </p>
        <button className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
          Get Started
        </button>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Naija Collab. All rights reserved.
      </footer>

    </main>
  );
}