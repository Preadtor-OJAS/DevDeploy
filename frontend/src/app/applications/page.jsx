"use client";

import { useQuery } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { api } from '../../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, GitBranch } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

export default function ApplicationsPage() {
  const { user } = useUser();
  const applications = useQuery(api.applications.get, user?.id ? { userId: user.id } : "skip") || [];
  const isLoading = applications === undefined || !user;

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
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
          <p className="text-muted-foreground mt-2">Manage your deployed applications</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Link href="/deploy">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Application
            </Button>
          </Link>
        </motion.div>
      </div>

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
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-12 border border-dashed rounded-lg bg-card"
        >
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <GitBranch className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No applications found</h3>
          <p className="text-muted-foreground mb-4">Get started by deploying your first application.</p>
          <Link href="/deploy">
            <Button variant="outline">Deploy Application</Button>
          </Link>
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
                <Card className="flex flex-col group hover:border-primary/50 transition-colors h-full shadow-lg hover:shadow-primary/20">
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
                    <div className="space-y-2 text-sm border-t pt-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Branch</span>
                        <span className="font-medium bg-muted px-2 py-0.5 rounded-md">{app.branch}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Repository</span>
                        <span className="font-medium truncate max-w-[140px]" title={app.repositoryUrl}>
                          {app.repositoryUrl.replace('https://github.com/', '')}
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
    </div>
  );
}
