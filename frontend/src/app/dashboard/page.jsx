"use client";

import { useQuery, useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { api } from '../../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Server, Activity, ArrowUpRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

export default function Dashboard() {
  const { user } = useUser();
  const fixOldApps = useMutation(api.fix.fixOldApps);
  
  useEffect(() => {
    // Automatically fix any old apps that were created before the simulation engine
    fixOldApps().catch(console.error);
  }, [fixOldApps]);

  const applications = useQuery(api.applications.get, user?.id ? { userId: user.id } : "skip") || [];
  const isLoading = applications === undefined || !user;

  const totalDeployments = applications.reduce((sum, app) => sum + (app.deployments?.length || 0), 0);
  const activePods = applications.length; // Simplified for MVP

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold tracking-tight">Dashboard</motion.h2>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={item}>
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05} transitionSpeed={2000} gyroscope={true}>
            <Card className="shadow-md hover:shadow-primary/20 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <Package className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : applications.length}
                </div>
              </CardContent>
            </Card>
          </Tilt>
        </motion.div>
        
        <motion.div variants={item}>
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05} transitionSpeed={2000} gyroscope={true}>
            <Card className="shadow-md hover:shadow-primary/20 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Running Pods</CardTitle>
                <Server className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : activePods}
                </div>
              </CardContent>
            </Card>
          </Tilt>
        </motion.div>

        <motion.div variants={item}>
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05} transitionSpeed={2000} gyroscope={true}>
            <Card className="shadow-md hover:shadow-primary/20 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <Activity className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.9%</div>
              </CardContent>
            </Card>
          </Tilt>
        </motion.div>

        <motion.div variants={item}>
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05} transitionSpeed={2000} gyroscope={true}>
            <Card className="shadow-md hover:shadow-primary/20 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Deployments</CardTitle>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : totalDeployments}
                </div>
              </CardContent>
            </Card>
          </Tilt>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-4">
        <h3 className="text-xl font-bold">Your Applications</h3>
        
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="flex flex-col animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="space-y-2 pt-2">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-12 border border-dashed rounded-lg bg-card">
            <p className="text-muted-foreground mb-4">You don't have any applications yet.</p>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {applications.map((app, i) => (
              <motion.div 
                key={app._id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 24 }}
              >
              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} gyroscope={true}>
              <Card className="flex flex-col h-full shadow-lg hover:shadow-primary/20 transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold">{app.name}</CardTitle>
                  <Badge 
                    variant="secondary" 
                    className={`border-0 ${app.status === 'Building' 
                      ? 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 animate-pulse' 
                      : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
                  >
                    {app.status || "Active"}
                  </Badge>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <Link href={`/preview/${app._id}`} className="text-sm text-blue-500 hover:text-blue-400 hover:underline flex items-center gap-1 transition-colors">
                    https://{app.name}.devdeploy.local
                  </Link>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Branch</span>
                      <span className="font-medium">{app.branch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Repository</span>
                      <span className="font-medium truncate max-w-[120px]" title={app.repositoryUrl}>
                        {app.repositoryUrl.split('/').pop()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deployments</span>
                      <span className="font-medium">{app.deployments?.length || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </Tilt>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}