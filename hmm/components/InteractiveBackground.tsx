import { motion } from "motion/react";

interface InteractiveBackgroundProps {
  variant?: 'auth' | 'app';
}

export function InteractiveBackground({ variant = 'app' }: InteractiveBackgroundProps) {

  const financeColors = [
    'from-blue-400/40 to-cyan-400/40',     // Banking blue
    'from-indigo-400/40 to-purple-400/40', // Premium purple
    'from-amber-400/40 to-yellow-400/40',  // Gold/coin yellow
    'from-slate-400/40 to-gray-400/40',    // Neutral gray
    'from-teal-400/40 to-cyan-400/40',     // Professional teal
    'from-violet-400/40 to-indigo-400/40', // Premium violet
  ];

  const currencySymbols = ['$', '€', '£', '¥', '₹', '₿'];
  const financeNumbers = ['100', '250', '500', '1K', '2.5K', '10K'];
  const trendIndicators = ['↗', '↘', '→', '⤴', '⤵'];
  
  const colors = financeColors;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated Gradient Background */}
      <div className={`absolute inset-0 opacity-60 ${
        variant === 'auth' 
          ? 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50' 
          : 'bg-gradient-to-br from-orange-50 to-amber-100'
      }`}>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/40 to-transparent"
          animate={{
            x: [-50, 50, -50],
            y: [-30, 30, -30],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating Currency Symbols */}
      {currencySymbols.map((symbol, i) => {
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;
        const duration = Math.random() * 10 + 15;
        const delay = i * 2;
        
        return (
          <motion.div
            key={`currency-${i}`}
            className={`absolute text-4xl font-bold bg-gradient-to-br ${colors[i % colors.length]} 
                       bg-clip-text text-transparent opacity-60 select-none`}
            style={{
              left: `${initialX}%`,
              top: `${initialY}%`,
            }}
            animate={{
              x: [0, Math.sin(i) * 80, Math.cos(i) * 60, 0],
              y: [0, Math.cos(i) * 80, Math.sin(i) * 60, 0],
              scale: [1, 1.3, 0.8, 1],
              rotate: [0, 20, -20, 0],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay,
            }}
          >
            {symbol}
          </motion.div>
        );
      })}

      {/* Floating Financial Numbers */}
      {financeNumbers.map((number, i) => {
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;
        const duration = Math.random() * 8 + 12;
        const delay = i * 1.5;
        
        return (
          <motion.div
            key={`number-${i}`}
            className="absolute text-2xl font-semibold text-blue-600/50 select-none"
            style={{
              left: `${initialX}%`,
              top: `${initialY}%`,
            }}
            animate={{
              x: [0, Math.sin(i * 0.7) * 60, Math.cos(i * 0.5) * 40, 0],
              y: [0, Math.cos(i * 0.7) * 60, Math.sin(i * 0.5) * 40, 0],
              opacity: [0.4, 0.7, 0.3, 0.4],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay,
            }}
          >
            ${number}
          </motion.div>
        );
      })}

      {/* Trend Indicators */}
      {trendIndicators.map((trend, i) => {
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;
        const duration = Math.random() * 6 + 10;
        const delay = i * 1;
        
        return (
          <motion.div
            key={`trend-${i}`}
            className={`absolute text-3xl select-none ${
              trend === '↗' || trend === '⤴' ? 'text-blue-500/60' : 
              trend === '↘' || trend === '⤵' ? 'text-red-500/60' : 
              'text-indigo-500/60'
            }`}
            style={{
              left: `${initialX}%`,
              top: `${initialY}%`,
            }}
            animate={{
              x: [0, Math.sin(i * 0.8) * 50, Math.cos(i * 0.6) * 30, 0],
              y: [0, Math.cos(i * 0.8) * 50, Math.sin(i * 0.6) * 30, 0],
              opacity: [0.5, 0.8, 0.4, 0.5],
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay,
            }}
          >
            {trend}
          </motion.div>
        );
      })}



      {/* Stock Chart Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-35">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        {Array.from({ length: 3 }).map((_, i) => {
          // Create stock chart-like paths
          const points = Array.from({ length: 8 }, (_, j) => {
            const x = (j / 7) * 100;
            const y = 30 + Math.sin(j * 0.5 + i) * 20 + i * 15;
            return `${x},${y}`;
          }).join(' ');
          
          return (
            <motion.polyline
              key={`chart-${i}`}
              points={points}
              stroke="url(#chartGradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 12 + i * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 2,
              }}
            />
          );
        })}
      </svg>

      {/* Credit Card Shapes */}
      {Array.from({ length: 3 }).map((_, i) => {
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;
        const duration = 25 + i * 5;
        const delay = i * 4;
        
        return (
          <motion.div
            key={`card-${i}`}
            className={`absolute w-20 h-12 rounded-lg bg-gradient-to-r ${colors[i % colors.length]} 
                       opacity-35 shadow-lg`}
            style={{
              left: `${initialX}%`,
              top: `${initialY}%`,
            }}
            animate={{
              x: [0, Math.sin(i) * 100, Math.cos(i) * 80, 0],
              y: [0, Math.cos(i) * 100, Math.sin(i) * 80, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay,
            }}
          >
            {/* Card details */}
            <div className="p-1">
              <div className="w-4 h-2 bg-white/60 rounded mb-1" />
              <div className="w-8 h-1 bg-white/50 rounded" />
            </div>
          </motion.div>
        );
      })}

      {/* Financial Grid Pattern */}
      <div className="absolute inset-0 opacity-15">
        <motion.div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(251, 191, 36, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(251, 191, 36, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Large Background Orbs */}
      {Array.from({ length: 3 }).map((_, i) => {
        const size = Math.random() * 200 + 300;
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;
        const duration = 30 + i * 10;
        const delay = i * 5;
        
        return (
          <motion.div
            key={`bg-orb-${i}`}
            className={`absolute rounded-full ${
              variant === 'auth' ? 'bg-orange-300/25' : 'bg-amber-300/20'
            } blur-3xl`}
            style={{
              width: size,
              height: size,
              left: `${initialX}%`,
              top: `${initialY}%`,
            }}
            animate={{
              scale: [1, 1.4, 0.6, 1],
              opacity: [0.2, 0.5, 0.1, 0.2],
              x: [0, Math.sin(i) * 200, Math.cos(i) * 150, 0],
              y: [0, Math.cos(i) * 200, Math.sin(i) * 150, 0],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay,
            }}
          />
        );
      })}
    </div>
  );
}