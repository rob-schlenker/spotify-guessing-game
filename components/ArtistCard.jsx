"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ArtistCard({ artist, onClick }) {
  const [clicked, setClicked] = useState(false);

  function handleClick(e) {
    if (clicked) return;
    setClicked(true);
    if (typeof onClick === "function") onClick(e);
  }

  return (
    <motion.div
      className={`group w-60 text-center transition-transform ${
        clicked ? "opacity-60 pointer-events-none" : "cursor-pointer hover:scale-105"
      }`}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Outer frame / border */}
      <div
        className="
          relative rounded-xl
          p-[6px]
          bg-gradient-to-br from-[#c2b93b] via-[#1c8983] to-[#324267]
          shadow-[0_0_20px_rgba(0,0,0,0.4)]
        "
      >
        {/* Inner metallic frame bevel */}
        <div
          className="
            bg-[linear-gradient(145deg,#5b3d3d_0%,#324267_50%,#0d5e77_100%)]
            rounded-lg p-[3px]
            shadow-inner
          "
        >
          {/* Image container, consistent ratio */}
          <div
            className="
              aspect-[1/1]
              overflow-hidden
              rounded-md
              bg-[#0d0d0d]
            "
          >
                <img
                  src={artist.images?.[0]?.url}
                  alt={artist.name}
                  className="
                    h-full w-full object-cover
                    transition-transform duration-300
                    group-hover:scale-105
                  "
                />
          </div>
        </div>
      </div>

      {/* Text overlay */}
      <h2 className="mt-3 text-lg font-semibold text-white drop-shadow-md tracking-wide">
        {artist.name}
      </h2>
    </motion.div>
  );
}