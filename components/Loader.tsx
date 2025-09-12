import React from 'react';
import { motion, Variants } from 'framer-motion';

const sketchingVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => {
    const delay = i * 0.2;
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
        opacity: { delay, duration: 0.01 },
      },
    };
  },
};

const messages = [
    "Brewing creativity...",
    "Sketching panels...",
    "Inking dialogues...",
    "Coloring the story...",
    "Assembling the comic...",
];

interface LoaderProps {
    theme: 'light' | 'dark';
}

export const Loader: React.FC<LoaderProps> = ({ theme }) => {
    const [messageIndex, setMessageIndex] = React.useState(0);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);


  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <motion.svg
        width="100"
        height="100"
        viewBox="0 0 24 24"
        className={`stroke-current ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}
      >
        <motion.path
          d="M14 2a2 2 0 0 1 2 2v10l-4-3-4 3V4a2 2 0 0 1 2-2z"
          variants={sketchingVariants} initial="hidden" animate="visible" custom={1}
        />
        <motion.path d="M22 6h-6" variants={sketchingVariants} initial="hidden" animate="visible" custom={2}/>
        <motion.path d="M22 10h-6" variants={sketchingVariants} initial="hidden" animate="visible" custom={3}/>
        <motion.path d="M22 14h-6" variants={sketchingVariants} initial="hidden" animate="visible" custom={4}/>
        <motion.path d="M22 18h-6" variants={sketchingVariants} initial="hidden" animate="visible" custom={5}/>
        <motion.path
            d="M2 6h8"
            variants={sketchingVariants} initial="hidden" animate="visible" custom={2.5}
        />
        <motion.path d="M2 10h8" variants={sketchingVariants} initial="hidden" animate="visible" custom={3.5}/>
        <motion.path d="M2 14h8" variants={sketchingVariants} initial="hidden" animate="visible" custom={4.5}/>
        <motion.path d="M2 18h8" variants={sketchingVariants} initial="hidden" animate="visible" custom={5.5}/>

      </motion.svg>
      <p className={`text-3xl animate-pulse ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{messages[messageIndex]}</p>
      <p className={`text-slate-500 text-center text-xl`}>This can take up to a minute. Please wait.</p>
    </div>
  );
};