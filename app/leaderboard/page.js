"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LeaderboardPage() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // read saved highscores
    const stored = JSON.parse(localStorage.getItem("spotify-highscores") || "[]");
    setScores(stored);
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <motion.div
        className="max-w-lg w-full bg-gray-800 rounded-lg p-6 text-center shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-extrabold mb-6">🏆 Leaderboard</h1>

        {scores.length === 0 ? (
          <p className="text-gray-400 text-sm mb-6">
            You haven’t played yet! Go back and try a game.
          </p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-700 text-gray-300">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Score</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((entry, i) => (
                  <tr key={i} className="border-b border-gray-700">
                    <td className="px-4 py-2 font-medium">{i + 1}</td>
                    <td className="px-4 py-2">{entry.score}/10</td>
                    <td className="px-4 py-2">{entry.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Link href="/">
          <motion.button
            className="mt-8 px-6 py-3 bg-white text-gray-900 rounded font-semibold hover:scale-105 transition-transform"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Game
          </motion.button>
        </Link>
      </motion.div>
    </main>
  );
}