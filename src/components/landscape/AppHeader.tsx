
'use client';
import { MountainSnow, LogIn, LogOut, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  getAuth,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { app } from '@/firebase/client';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

const auth = getAuth(app);

function UserButton() {
  const [user, loading] = useAuthState(auth);

  const handleLogin = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with GitHub', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />;
  }

  if (!user) {
    return (
      <Button onClick={handleLogin} variant="outline">
        <Github className="mr-2" />
        Login com GitHub
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
          <AvatarFallback>
            {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <p>Logado como</p>
          <p className="font-medium truncate">{user.displayName || user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-500">
          <LogOut className="mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border/80 bg-background/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="container mx-auto flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5"
        >
          <MountainSnow className="h-6 w-6 text-primary" />
          <h1 className="font-headline text-xl font-bold tracking-tight text-foreground">
            AI Landscape Generator
          </h1>
        </motion.div>
        <div>
          <UserButton />
        </div>
      </div>
    </header>
  );
}
