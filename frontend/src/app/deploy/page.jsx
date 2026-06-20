"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { api } from '../../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GitBranch, Rocket, Loader2 } from 'lucide-react';

export default function DeployPage() {
  const router = useRouter();
  const { user } = useUser();
  const createApplication = useMutation(api.applications.create);
  const [name, setName] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !repositoryUrl) {
      setError('Name and Repository URL are required');
      return;
    }
    if (!user) {
      setError('You must be logged in to deploy');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await createApplication({
        name,
        repositoryUrl,
        branch,
        userId: user.id
      });
      // Redirect back to dashboard upon success
      router.push('/');
    } catch (err) {
      setError(err.message || 'Failed to create application');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">New Deployment</h2>
        <p className="text-muted-foreground mt-2">Deploy your application from GitHub</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Repository Configuration</CardTitle>
          <CardDescription>Select the repository and branch you want to deploy.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="appName">Application Name</Label>
              <Input 
                id="appName" 
                placeholder="my-awesome-app" 
                value={name}
                onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                required
              />
              <p className="text-xs text-muted-foreground">Only lowercase letters, numbers, and hyphens.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="repo">GitHub Repository URL</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <GitBranch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="repo" 
                    placeholder="https://github.com/username/repo" 
                    className="pl-9" 
                    value={repositoryUrl}
                    onChange={(e) => setRepositoryUrl(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Branch</Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">main</SelectItem>
                  <SelectItem value="master">master</SelectItem>
                  <SelectItem value="dev">dev</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Rocket className="mr-2 h-4 w-4" />
                )}
                Deploy Application
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}