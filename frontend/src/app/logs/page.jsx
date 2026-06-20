"use client";

import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { api } from '../../../convex/_generated/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function LogsPage() {
  const { user } = useUser();
  const applications = useQuery(api.applications.get, user?.id ? { userId: user.id } : "skip") || [];
  const [selectedAppId, setSelectedAppId] = useState("");

  // Auto-select the first app when applications load
  useEffect(() => {
    if (applications.length > 0 && !selectedAppId) {
      setSelectedAppId(applications[0]._id);
    }
  }, [applications, selectedAppId]);

  const logs = useQuery(api.logs.getByApplication, selectedAppId ? { applicationId: selectedAppId } : "skip") || [];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Logs</h2>
          <p className="text-muted-foreground mt-2">View real-time deployment logs</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedAppId} onValueChange={setSelectedAppId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Application" />
            </SelectTrigger>
            <SelectContent>
              {applications.map((app) => (
                <SelectItem key={app._id} value={app._id}>{app.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="py-3 px-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search logs..." className="pl-9 bg-muted/50 border-0" />
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden">
          <ScrollArea className="h-[600px] w-full rounded-md bg-[#0a0a0a] p-4">
            <div className="font-mono text-sm space-y-2">
              {logs.length === 0 ? (
                <div className="text-muted-foreground text-center pt-10">
                  {selectedAppId ? "Waiting for deployment logs..." : "Select an application to view logs"}
                </div>
              ) : (
                logs.map((log) => {
                  const date = new Date(log.timestamp);
                  const timeString = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                  
                  return (
                    <div key={log._id} className="flex gap-4">
                      <span className="text-muted-foreground min-w-[150px]">{timeString}</span>
                      <span className={log.level === 'SUCCESS' ? 'text-emerald-500 font-bold w-[70px]' : 'text-blue-400 font-bold w-[70px]'}>
                        [{log.level}]
                      </span>
                      <span className={log.level === 'SUCCESS' ? 'text-emerald-500' : 'text-gray-300'}>
                        {log.message}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}