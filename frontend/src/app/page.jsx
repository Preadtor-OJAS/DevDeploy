"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Tilt from "react-parallax-tilt";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowRight, GitBranch, Activity, Terminal, Cloud, Zap, Shield, ChevronRight } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

export default function LandingPage() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <span className="text-primary-foreground font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold tracking-tight">DevDeploy</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isSignedIn ? (
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/sign-in">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative container mx-auto px-6 pt-40 pb-24 text-center">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
            <Zap className="w-4 h-4" />
            Deploy straight from GitHub
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            The smartest way to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              deploy applications
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Push code to your repository and watch it go live instantly. DevDeploy gives you a complete control plane with real-time logs, live monitoring, and instant rollbacks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
              <Button size="lg" className="h-14 px-8 text-lg rounded-full group">
                {isSignedIn ? "Open Dashboard" : "Start Deploying Free"}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full">
                See How It Works
              </Button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-6 py-24 border-t border-border/40">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Everything you need to ship faster</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our platform provides enterprise-grade tools designed for modern developer workflows.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Cloud className="w-8 h-8 text-blue-500" />,
              title: "Instant Previews",
              desc: "Every pull request gets its own preview URL automatically. Test changes before merging to production."
            },
            {
              icon: <Terminal className="w-8 h-8 text-emerald-500" />,
              title: "Live Log Streaming",
              desc: "Watch your builds and application logs stream in real-time. No more refreshing the terminal."
            },
            {
              icon: <Activity className="w-8 h-8 text-purple-500" />,
              title: "Performance Monitoring",
              desc: "Track CPU, Memory, and Network I/O with interactive, granular charts right from your dashboard."
            },
            {
              icon: <GitBranch className="w-8 h-8 text-gray-400" />,
              title: "Deep GitHub Integration",
              desc: "Connect your repositories in seconds. We listen for webhooks and trigger deployments automatically."
            },
            {
              icon: <Shield className="w-8 h-8 text-rose-500" />,
              title: "Secure by Default",
              desc: "Automatic SSL certificates, DDoS protection, and isolated container environments for every app."
            },
            {
              icon: <Zap className="w-8 h-8 text-yellow-500" />,
              title: "Zero-Downtime Deploys",
              desc: "We route traffic to your new application only after the health checks pass. Users never see an error."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="h-full"
            >
              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} gyroscope={true} className="h-full">
                <Card className="h-full bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors shadow-lg hover:shadow-primary/20">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="container mx-auto px-6 py-24 border-t border-border/40">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium">
            How It Works
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Deploying has never been easier</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Follow three simple steps to get your application running on the internet.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-border via-primary/50 to-border -z-10" />
          
          {[
            { step: 1, title: "Connect Repo", desc: "Link your GitHub account and select a repository. We automatically detect your framework." },
            { step: 2, title: "Configure & Build", desc: "Set your environment variables and branch. We handle the containerization and build process." },
            { step: 3, title: "Go Live & Monitor", desc: "Your app is deployed with a secure URL. Watch live logs and resource metrics from the dashboard." }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative text-center space-y-6"
            >
              <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} scale={1.1} transitionSpeed={2000} className="w-16 h-16 mx-auto mb-6">
                <div className="w-full h-full bg-background border-2 border-primary text-primary rounded-full flex items-center justify-center text-2xl font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  {item.step}
                </div>
              </Tilt>
              <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05} transitionSpeed={2000}>
                <div className="space-y-3 bg-card p-6 rounded-2xl border border-border/50 shadow-lg hover:shadow-primary/20 transition-shadow h-full">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-6 py-32 text-center space-y-8">
          <h2 className="text-4xl font-bold tracking-tight">Ready to simplify application hosting?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of developers who have made the switch to stress-free deployments.
          </p>
          <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
            <Button size="lg" className="h-14 px-10 text-lg rounded-full group mt-4">
              Get Started Now
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        <div className="py-6 text-center text-sm text-muted-foreground border-t border-border/40">
          © {new Date().getFullYear()} DevDeploy Platform. All rights reserved.
        </div>
      </section>
    </div>
  );
}
