import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const AnimatedSplash: React.FC = () => {
  const [complete, setComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setComplete(true);
      // Check onboarding status
      const onboardingSeen = localStorage.getItem("onboarding_seen");
      if (!onboardingSeen) {
        navigate("/onboarding");
      } else {
        navigate("/");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center">
      <div className="relative">
        {/* Sword icon with draw animation */}
        <motion.svg
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M12 2L12 20M12 20L8 16M12 20L16 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </motion.svg>

        {/* Glow pulse */}
        <motion.div
          className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* App name */}
      <motion.div
        className="absolute bottom-1/3 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tight">Mercy Blade</h1>
        <p className="text-muted-foreground mt-2">Sharpen Your Mind</p>
      </motion.div>
    </div>
  );
};
