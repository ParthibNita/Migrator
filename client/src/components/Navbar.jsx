import { AvatarFallback, Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useAuthStore from '../store/AuthStore.jsx';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User, Settings, Bird, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  if (!user) return null;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className=" backdrop-blur-xl px-6 py-3 flex justify-between items-center sticky top-0 z-50"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => navigate('/')}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-green-500/20 transition-shadow">
          <Bird className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span
            to="/"
            className="text-xl font-bold bg-gradient-to-r from-green-400 to-red-400 bg-clip-text text-transparent"
          >
            Migrator
          </span>
        </div>
      </motion.div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-12 rounded-full p-1 border border-neutral-700/50 hover:border-green-500/30 hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border-2 border-neutral-600 group-hover:border-green-400 transition-colors">
                <AvatarImage
                  src={user.images?.[0]?.url}
                  alt={user.displayName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-green-600 to-red-600 text-white font-semibold">
                  {user.displayName?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">
                  {user.displayName}
                </p>
                <p className="text-xs text-neutral-400">
                  {user.followers?.total || 0} followers
                </p>
              </div>

              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ring-2 ring-green-500/20" />
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-64 bg-neutral-900/95 backdrop-blur-xl border border-neutral-800/50 rounded-xl p-2"
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-green-500/20">
                <AvatarImage
                  src={user.images?.[0]?.url}
                  alt={user.displayName}
                />
                <AvatarFallback className="bg-gradient-to-br from-green-600 to-red-600 text-white text-lg font-bold">
                  {user.displayName?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user.displayName}
                </p>
                <p className="text-xs text-neutral-400 truncate">
                  {user.email || 'Premium User'}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-yellow-400">Pro Plan</span>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-neutral-800/50" />

          <DropdownMenuItem className="flex items-center gap-3 p-3 text-neutral-300 hover:bg-white/5 hover:text-white cursor-pointer rounded-lg transition-colors">
            <User className="w-4 h-4 text-green-400" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 p-3 text-neutral-300 hover:bg-white/5 hover:text-white cursor-pointer rounded-lg transition-colors">
            <Settings className="w-4 h-4 text-blue-400" />
            <span>Settings</span>
          </DropdownMenuItem>

          <div className="px-3 py-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-2 bg-white/5 rounded-lg">
                <div className="text-green-400 font-semibold">
                  {user.followers?.total || 0}
                </div>
                <div className="text-neutral-400">Followers</div>
              </div>
              <div className="text-center p-2 bg-white/5 rounded-lg">
                <div className="text-red-400 font-semibold">
                  {user.following?.total || 0}
                </div>
                <div className="text-neutral-400">Following</div>
              </div>
            </div>
          </div>

          <DropdownMenuSeparator className="bg-neutral-800/50" />

          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer rounded-lg transition-colors group"
          >
            <LogOut className="w-4 h-4 group-hover:animate-pulse" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.nav>
  );
};

export default Navbar;
