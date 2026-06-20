'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from './ui/scroll-area';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Deployment Successful',
      description: 'Your Node.js app "api-service" is now live.',
      time: '2m ago',
      read: false,
      type: 'success'
    },
    {
      id: 2,
      title: 'Warning: High CPU',
      description: 'Pod "worker-xyz" is experiencing high CPU usage.',
      time: '1hr ago',
      read: false,
      type: 'warning'
    },
    {
      id: 3,
      title: 'Cluster Update',
      description: 'Kubernetes version 1.28 update is available.',
      time: '1d ago',
      read: true,
      type: 'info'
    }
  ]);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background animate-pulse" />
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-80 bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b flex items-center justify-between bg-muted/30">
              <div>
                <h3 className="font-semibold text-sm">Notifications</h3>
                <p className="text-xs text-muted-foreground">You have {unreadCount} unread messages</p>
              </div>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs text-primary hover:text-primary/80 px-2">
                  <CheckCheck className="w-3 h-3 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
            
            <ScrollArea className="h-[300px]">
              <div className="flex flex-col">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center justify-center h-full">
                    <Bell className="w-8 h-8 mb-2 opacity-20" />
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer flex gap-3 ${!notification.read ? 'bg-primary/5' : ''}`}
                      onClick={() => {
                        setNotifications(notifications.map(n => n.id === notification.id ? { ...n, read: true } : n));
                      }}
                    >
                      <div className="mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium leading-none ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">{notification.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.description}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
            
            <div className="p-2 border-t bg-muted/20">
              <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-foreground">
                View all notifications
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
