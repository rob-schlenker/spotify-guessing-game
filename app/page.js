"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Confetti from "react-confetti";
import ArtistCard from "@/components/ArtistCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { OBSCURE_ARTISTS } from "@/data/obscureArtists";
import { popular_artists } from "@/data/popularArtists";
import Dither from "@/components/ui/background.jsx";

export default function GamePage() {
  const [artists, setArtists] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [recap, setRecap] = useState([]);
  const [highScores, setHighScores] = useState([]);
  const [windowSize, setWindow] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resize = () =>
      setWindow({ width: window.innerWidth, height: window.innerHeight });
    resize();
    window.addEventListener("resize", resize);
    const stored = JSON.parse(
      localStorage.getItem("spotify-highscores") || "[]"
    );
    setHighScores(stored);
    return () => window.removeEventListener("resize", resize);
  }, []);

  async function fetchArtist(id) {
    const res = await fetch(`/api/artist?artistId=${id}`);
    return res.json();
  }

  // const [artistPool, setArtistPool] = useState([...OBSCURE_ARTISTS]);
  const [artistPool, setArtistPool] = useState([...popular_artists]);

  async function startRound() {
    if (artistPool.length < 2) {
      setGameOver(true);
      return;
    }
    setLoading(true);
    setMessage("");

    // shuffle
    const shuffled = [...artistPool].sort(() => 0.5 - Math.random());
    const [first, second, ...rest] = shuffled;

    // remove these two from pool for next round
    setArtistPool(rest);

    const a = await fetchArtist(first.id);
    const b = await fetchArtist(second.id);

    setArtists([a, b]);
    setLoading(false);
  }

  useEffect(() => {
    startRound();
  }, []);

  function handleGuess(choice) {
    const [a, b] = artists;
    const correct =
      (choice === "a" && a.followers.total > b.followers.total) ||
      (choice === "b" && b.followers.total > a.followers.total);

    setRecap((prev) => [
      ...prev,
      {
        round,
        a: { name: a.name, listeners: a.followers.total },
        b: { name: b.name, listeners: b.followers.total },
        correct,
      },
    ]);

    if (correct) {
      setScore((s) => s + 1);
      setMessage("✅ Correct!");
    } else {
      setMessage("❌ Wrong!");
    }

    if (round < 10) {
      setTimeout(() => {
        setRound((r) => r + 1);
        startRound();
      }, 1300);
    } else {
      setTimeout(() => setGameOver(true), 800);
    }
  }

  // When game ends, save high score
  useEffect(() => {
    if (gameOver) {
      const stored =
        JSON.parse(localStorage.getItem("spotify-highscores") || "[]") || [];
      const newScore = {
        score,
        date: new Date().toLocaleDateString(),
      };
      const updated = [newScore, ...stored]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      localStorage.setItem("spotify-highscores", JSON.stringify(updated));
      setHighScores(updated);
      setMessage(`🎉 Game Over — Final Score: ${score}/10`);
    }
  }, [gameOver]);

  // Restart game
  function resetGame() {
    setRound(1);
    setScore(0);
    setMessage("");
    setRecap([]);
    setGameOver(false);
    startRound();
  }

  return (
    <main className="relative min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 select-none overflow-x-auto">
      <div style={{ width: "100%", height: "100%", position: "absolute" }}>
        <Dither
          waveColor={[0.7, 0.5, 0.5]}
          disableAnimation={false}
          enableMouseInteraction={false}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.03}
        />
      </div>
      {gameOver && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}

      <div className="z-10 w-full max-w-4xl flex flex-col items-center justify-center min-h-[750px] relative">
        <h1 className="text-4xl font-extrabold mb-4 text-center">
          Who Has More Listeners?
        </h1>

        <Progress
          value={(round / 10) * 100}
          className="w-full mb-3 h-3 bg-gray-800"
        />
        <p
          className="text-lg font-medium mb-4
             bg-[#1C898355] px-4 py-1 rounded-full
             text-white tracking-wide shadow-[0_0_10px_rgba(255,255,255,0.8)]"
        >
          Round {round} / 10 — Score: {score}
        </p>

        {!gameOver && (
          <>
            {loading ? (
              <div className="flex items-center justify-center min-h-[280px]">
                <LoadingSpinner />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={round}
                  className="flex flex-wrap justify-center gap-10 min-h-[280px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {artists.map((artist, i) => (
                    <ArtistCard
                      key={artist.id ?? i}
                      artist={artist}
                      onClick={() => handleGuess(i === 0 ? "a" : "b")}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </>
        )}

        <div className="h-10 flex items-center justify-center mt-6">
          <AnimatePresence mode="wait">
            {message && (
              <motion.span
                key={message}
                className={`text-2xl font-medium ${
                  message.includes("✅")
                    ? "text-green-400"
                    : message.includes("❌")
                    ? "text-red-400"
                    : "text-yellow-300"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {message}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* {gameOver && (
          <div className="flex justify-center mt-4 mb-10">
            <motion.button
              onClick={resetGame}
              className="px-8 py-4 rounded-lg font-orbitron text-lg
                 bg-gradient-to-r from-[#5B3D3D] via-[#1C8983] to-[#C2B93B]
                 text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]
                 hover:scale-105 transition-transform"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              ▶  Start New Game
            </motion.button>
          </div>
        )} */}

        {gameOver && (
          <motion.div
            className="relative mt-10 w-full rounded-lg p-[3px] bg-gradient-to-r from-[#5B3D3D] via-[#1C8983] to-[#C2B93B] 
                animate-gradient shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-gray-800 w-full h-full rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-3 text-center">Recap</h2>
              <div className="overflow-x-auto text-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-700 text-gray-300">
                    <tr>
                      <th className="px-3 py-2">#</th>
                      <th className="px-3 py-2">Artist</th>
                      <th className="px-3 py-2">Listeners</th>
                      <th className="px-3 py-2">Artist</th>
                      <th className="px-3 py-2">Listeners</th>
                      <th className="px-3 py-2">Correct?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recap.map((r) => (
                      <tr key={r.round} className="border-b border-gray-700">
                        <td className="px-3 py-2">{r.round}</td>
                        <td className="px-3 py-2">{r.a.name}</td>
                        <td className="px-3 py-2">
                          {r.a.listeners.toLocaleString()}
                        </td>
                        <td className="px-3 py-2">{r.b.name}</td>
                        <td className="px-3 py-2">
                          {r.b.listeners.toLocaleString()}
                        </td>
                        <td className="px-3 py-2">{r.correct ? "✅" : "❌"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold mt-6 mb-2 text-center">
                Leaderboard (Top 5)
              </h2>
              <ul className="text-center text-sm space-y-1">
                {highScores.map((h, i) => (
                  <li key={i}>
                    #{i + 1} — {h.score}/10 ({h.date})
                  </li>
                ))}
              </ul>

              <div className="flex justify-center mt-8">
                <motion.button
                  onClick={resetGame}
                  className="bg-white text-gray-900 font-semibold px-6 py-3 rounded hover:scale-105 transition-transform"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  Play Again
                </motion.button>
              </div>
              <div className="flex justify-center mt-4">
                <Link
                  href="/leaderboard"
                  className="text-sm text-gray-400 hover:text-gray-200"
                >
                  View Full Leaderboard →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
