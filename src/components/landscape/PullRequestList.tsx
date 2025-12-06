'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitPullRequest, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

interface PullRequest {
  id: number;
  html_url: string;
  title: string;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  state: 'open' | 'closed';
}

const REPO_OWNER = 'facebook';
const REPO_NAME = 'react';

export function PullRequestList() {
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPullRequests() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pulls?state=all&per_page=10`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch pull requests from GitHub API.');
        }
        const data: PullRequest[] = await response.json();
        setPullRequests(data);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    }

    fetchPullRequests();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-red-500 min-h-[300px]">
          <AlertCircle className="w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold">Failed to load data</h3>
          <p className="text-sm">{error}</p>
        </div>
      );
    }

    if (pullRequests.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[300px]">
          <GitPullRequest className="w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold">No Pull Requests Found</h3>
          <p>There are no pull requests to display for this repository.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {pullRequests.map((pr, index) => (
          <motion.div
            key={pr.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <a
              href={pr.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="hover:border-primary/50 transition-colors duration-300">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {pr.state === 'open' ? (
                      <GitPullRequest className="w-6 h-6 text-green-500" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 text-purple-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold text-foreground line-clamp-1">{pr.title}</p>
                    <p className="text-sm text-muted-foreground">
                      by {pr.user.login} •{' '}
                      {formatDistanceToNow(new Date(pr.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <Badge variant={pr.state === 'open' ? 'default' : 'secondary'} className={pr.state === 'open' ? 'bg-green-600' : 'bg-purple-600'}>
                    {pr.state}
                  </Badge>
                </CardContent>
              </Card>
            </a>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <section>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitPullRequest />
              GitHub Pull Requests
            </CardTitle>
            <CardDescription>
              Showing latest pull requests from{' '}
              <a
                href={`https://github.com/${REPO_OWNER}/${REPO_NAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                {REPO_OWNER}/{REPO_NAME}
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent>{renderContent()}</CardContent>
        </Card>
      </div>
    </section>
  );
}
