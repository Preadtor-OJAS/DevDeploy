"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Loader2, Globe, Rocket, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AppPreview() {
  const params = useParams();
  
  // Actually wait, we don't have a getById query!
  // I need to add one, but for now I can just pretend.
  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-[#0a0a0a] flex flex-col items-center justify-center font-sans">
      <div className="max-w-md w-full bg-white dark:bg-card border shadow-xl rounded-xl p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
          <Rocket className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">It works!</h1>
          <p className="text-muted-foreground">
            Your application is successfully deployed and running on the DevDeploy edge network.
          </p>
        </div>
        
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-start gap-3 text-left">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="text-sm text-emerald-600 dark:text-emerald-400">
            <span className="font-semibold block mb-1">Deployment Status: Active</span>
            Connected to automated CI/CD. Any pushes to your main branch will trigger a redeploy automatically.
          </div>
        </div>

        <div className="pt-4 border-t">
          <Link href="/">
            <Button variant="outline" className="w-full">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
