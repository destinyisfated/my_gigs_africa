"use client";

import JoinModal from "@/components/JoinModal";
import { motion } from "framer-motion";
import { Users, Globe2, Target, Rocket, Linkedin } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const team = [
    {
      name: "Lewis Muturi",
      role: "Founder & CEO",
      linkedin: "https://linkedin.com",
    },
    {
      name: "Joshua Munyoki",
      role: "Co-Founder",
      linkedin: "https://linkedin.com",
    },
    {
      name: "Team Allegiance",
      role: "Dev",
      linkedin: "https://linkedin.com",
    },
    {
      name: "Elijah Odongo",
      role: "Dev",
      linkedin: "https://linkedin.com",
    },
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: "easeOut" },
    },
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-gradient-to-b from-white via-slate-50 to-white text-gray-800"
    >
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-8 text-center">
        <motion.h1
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-3 bg-gradient-to-r from-blue-800 via-purple-900 to-cyan-500 bg-clip-text text-transparent"
        >
          Empowering Africa’s Freelance Future
        </motion.h1>

        <motion.p
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
        >
          MyGigs Africa is redefining the freelance economy — connecting
          exceptional African talent to global opportunities through innovation,
          transparency, and trust.
        </motion.p>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-6 py-6 md:py-8 grid md:grid-cols-2 gap-8 items-start">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-5"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-500">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed text-base md:text-lg">
            We’re building a platform that empowers African freelancers to
            thrive — helping them access both local and global opportunities.
            Every gig represents empowerment, creativity, and financial
            independence.
          </p>
          <p className="text-gray-500 italic text-sm">
            “Our goal is simple — unlock Africa’s freelance potential.”
          </p>
        </motion.div>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200"
        >
          <h3 className="text-xl font-semibold mb-4 text-blue-500">
            Our Core Principles
          </h3>
          <ul className="space-y-3 text-gray-600 text-base">
            <li>🌍 Propagating local talent to global scales</li>
            <li>💼 Fair pay and professional growth</li>
            <li>🚀 Access to global opportunities</li>
            <li>🤝 Building relations through technology</li>
          </ul>
        </motion.div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gradient-to-b from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-blue-500 mb-14"
          >
            Our Core Values
          </motion.h2>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Users className="h-9 w-9 text-blue-500 mx-auto mb-3" />,
                title: "Community",
                desc: "Empowering freelancers and clients through collaboration.",
              },
              {
                icon: <Globe2 className="h-9 w-9 text-blue-500 mx-auto mb-3" />,
                title: "Innovation",
                desc: "Solving Africa’s challenges with scalable and affordable solutions.",
              },
              {
                icon: <Target className="h-9 w-9 text-blue-500 mx-auto mb-3" />,
                title: "Integrity",
                desc: "We lead with transparency and ethical work practices.",
              },
              {
                icon: <Rocket className="h-9 w-9 text-blue-500 mx-auto mb-3" />,
                title: "Growth",
                desc: "Creating an ecosystem for long-term professional success.",
              },
            ].map((val, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-200 p-8 transition-all duration-300 hover:-translate-y-1"
              >
                {val.icon}
                <h3 className="text-lg font-semibold text-blue-500 mb-2">
                  {val.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-blue-500 mb-14"
          >
            Meet Our Team
          </motion.h2>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-b from-white to-slate-50 rounded-xl shadow-sm hover:shadow-md border border-slate-200 p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="text-lg font-semibold text-blue-500 mb-1">
                  {member.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{member.role}</p>
                <Link
                  href={member.linkedin}
                  target="_blank"
                  className="inline-flex items-center justify-center gap-1 text-blue-500 hover:text-blue-700 font-medium transition-colors text-sm"
                >
                  <Linkedin className="w-4 h-4" /> Connect
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 text-center bg-gradient-to-r from-purple-700 to-indigo-900 text-white"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-5">How it works:</h2>
        <p className="text-white/90 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
          MyGigsAfrica offers a platform where freelancers can enjoy our premium
          services and post their gigs just by paying a fee of Ksh. 250 annualy
          and clients can view and apply for the gigs for free. You can also be
          a part of this by clicking become a freelancer.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <JoinModal />
        </div>
      </motion.section>
    </motion.main>
  );
}
