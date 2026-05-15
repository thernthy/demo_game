
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const requests = [
  {
    id: 1,
    text: "GET /home",
    malicious: false,
  },
  {
    id: 2,
    text: "<script>alert('xss')</script>",
    malicious: true,
  },
  {
    id: 3,
    text: "GET /products",
    malicious: false,
  },
  {
    id: 4,
    text: "UNION SELECT password FROM users",
    malicious: true,
  },
  {
    id: 5,
    text: "POST /login",
    malicious: false,
  },
  {
    id: 6,
    text: "../../../etc/passwd",
    malicious: true,
  },
];

export default function App() {
  const [current, setCurrent] = useState(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  // Random request
  const nextRequest = () => {
    const random =
      requests[Math.floor(Math.random() * requests.length)];
    setCurrent(random);
  };

  // Start
  useEffect(() => {
    nextRequest();
  }, []);

  // Timer
  useEffect(() => {
    if (gameOver) return;

    if (time <= 0) {
      setGameOver(true);
      return;
    }

    const timer = setTimeout(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [time, gameOver]);

  // Handle answer
  const handleChoice = (block) => {
    if (!current) return;

    const correct =
      (block && current.malicious) ||
      (!block && !current.malicious);

    if (correct) {
      setScore((prev) => prev + 10);

      setMessage(
        current.malicious
          ? "🚫 Attack Blocked!"
          : "✅ Safe Traffic Allowed!"
      );
    } else {
      setScore((prev) => Math.max(prev - 5, 0));

      setMessage(
        current.malicious
          ? "❌ Hacker Passed Through!"
          : "❌ Legit User Blocked!"
      );
    }

    setTimeout(() => {
      setMessage("");
      nextRequest();
    }, 700);
  };

  // Restart
  const restartGame = () => {
    setScore(0);
    setTime(30);
    setGameOver(false);
    nextRequest();
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative flex flex-col items-center justify-center px-4">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-green-900/20" />

      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl md:text-7xl font-extrabold mb-4 text-center z-10"
      >
        FASTLY WAF DEFENDER
      </motion.h1>

      <p className="text-gray-400 text-xl mb-8 z-10">
        Block attacks before they hit the server
      </p>

      {/* Score + Timer */}
      <div className="flex gap-8 mb-8 z-10">
        <div className="bg-gray-900 border border-green-500 px-6 py-4 rounded-2xl text-2xl">
          Score: {score}
        </div>

        <div className="bg-gray-900 border border-red-500 px-6 py-4 rounded-2xl text-2xl">
          Time: {time}s
        </div>
      </div>

      {/* Game Over */}
      {gameOver ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="z-10 text-center"
        >
          <h2 className="text-6xl font-bold mb-4">
            GAME OVER
          </h2>

          <p className="text-3xl mb-6">
            Final Score: {score}
          </p>

          <button
            onClick={restartGame}
            className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-xl text-2xl transition"
          >
            PLAY AGAIN
          </button>
        </motion.div>
      ) : (
        <>
          {/* Request Card */}
          <AnimatePresence mode="wait">
            {current && (
              <motion.div
                key={current.text}
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -80 }}
                transition={{ duration: 0.3 }}
                className="z-10 bg-gray-900 border border-cyan-500 rounded-3xl p-8 max-w-3xl w-full shadow-2xl"
              >
                <div className="text-sm text-cyan-400 mb-2">
                  Incoming Request
                </div>

                <div className="text-2xl md:text-4xl font-mono break-words">
                  {current.text}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buttons */}
          <div className="flex gap-6 mt-10 z-10">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleChoice(true)}
              className="bg-red-600 hover:bg-red-500 px-10 py-5 rounded-2xl text-3xl font-bold shadow-xl"
            >
              🚫 BLOCK
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleChoice(false)}
              className="bg-green-600 hover:bg-green-500 px-10 py-5 rounded-2xl text-3xl font-bold shadow-xl"
            >
              ✅ ALLOW
            </motion.button>
          </div>

          {/* Message */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-8 text-4xl font-bold z-10"
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}