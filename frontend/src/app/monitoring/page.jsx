"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';

export default function MonitoringPage() {
  const [cpuData, setCpuData] = useState([]);
  const [memData, setMemData] = useState([]);
  const [currentCpu, setCurrentCpu] = useState(24);
  const [currentMem, setCurrentMem] = useState(512);

  // Initialize with some data
  useEffect(() => {
    const initialCpu = Array.from({ length: 24 }).map((_, i) => ({
      time: `${i}:00`,
      usage: Math.floor(Math.random() * 40) + 10
    }));
    const initialMem = Array.from({ length: 24 }).map((_, i) => ({
      time: `${i}:00`,
      usage: Math.floor(Math.random() * 200) + 300
    }));
    setCpuData(initialCpu);
    setMemData(initialMem);

    // Live update interval
    const interval = setInterval(() => {
      setCpuData(prev => {
        const nextVal = Math.floor(Math.random() * 40) + 10;
        setCurrentCpu(nextVal);
        return [...prev.slice(1), { time: new Date().toLocaleTimeString(), usage: nextVal }];
      });
      setMemData(prev => {
        const nextVal = Math.floor(Math.random() * 200) + 300;
        setCurrentMem(nextVal);
        return [...prev.slice(1), { time: new Date().toLocaleTimeString(), usage: nextVal }];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-3xl font-bold tracking-tight">Monitoring</h2>
          <p className="text-muted-foreground mt-2">Real-time metrics and performance</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
          <Select defaultValue="1h">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last 1 hour</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Refresh</Button>
        </motion.div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentCpu}%</div>
            <div className="h-[40px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cpuData.slice(-10)}>
                  <Line type="monotone" dataKey="usage" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMem} MB</div>
            <div className="h-[40px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={memData.slice(-10)}>
                  <Line type="monotone" dataKey="usage" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Network I/O</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2 MB/s</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Requests/min</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>CPU Usage (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cpuData}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis dataKey="time" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={value => `${value}%`} />
                  <Tooltip contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none'
                }} />
                  <Area type="monotone" dataKey="usage" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorCpu)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Memory Usage (MB)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={memData}>
                  <defs>
                    <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis dataKey="time" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none'
                }} />
                  <Area type="monotone" dataKey="usage" stroke="#eab308" fillOpacity={1} fill="url(#colorMem)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>;
}