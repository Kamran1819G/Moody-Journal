"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import supabase from "@/utils/supabase";

export default function Home() {
  const [href, setHref] = useState("");

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setHref(user ? "/journal" : "/new-user");
    }
    checkUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-3xl mx-auto text-center"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
          The best Journal app, period.
        </h1>
        <p className="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed">
          Track your mood and thoughts throughout your life journey. All you
          have to do is be honest with yourself.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href={href}>
            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1">
              Get Started
            </button>
          </Link>
        </motion.div>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {["Reflect", "Grow", "Thrive"].map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gray-800 bg-opacity-50 rounded-lg p-6 text-center"
          >
            <h2 className="text-2xl font-semibold text-white mb-2">{item}</h2>
            <p className="text-gray-400">Discover the power of journaling</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
