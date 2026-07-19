"use client";

import { Button } from "@/components/ui/button";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative">
      <div className="relative overflow-hidden">
        <GridPattern
          squares={[
            [2, 2],
            [4, 3],
            [6, 2],
            [8, 4],
            [10, 2],
            [12, 3],
            [14, 2],
            [16, 4],
          ]}
          className={cn(
            "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-45%] h-[200%] skew-y-12"
          )}
        />

        <div className="container relative">
          <div className="flex min-h-screen flex-col items-center justify-center py-20">
            {/* Main Content */}
            <div className="relative z-10 flex w-full flex-col items-center gap-8 px-4">
              {/* 404 Text */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative space-y-6 text-center"
              >
                <motion.div
                  className="relative mx-auto max-w-[900px] text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <span className="relative z-10 bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-8xl font-bold text-transparent sm:text-9xl">
                    404
                  </span>
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-4 w-full bg-primary/20"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </motion.div>

                <motion.h2
                  className="text-2xl font-bold sm:text-3xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Page Not Found
                </motion.h2>

                <motion.p
                  className="mx-auto max-w-2xl text-lg text-foreground/60 sm:text-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Oops! The page you&apos;re looking for seems to have vanished
                  into the digital void. Let&apos;s get you back on track.
                </motion.p>
              </motion.div>

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Link href="/">
                  <Button
                    size="lg"
                    className="group h-14 gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-8 text-base hover:opacity-90"
                  >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
