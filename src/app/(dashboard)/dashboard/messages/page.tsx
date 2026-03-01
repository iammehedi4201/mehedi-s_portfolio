"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardMessages, useMarkMessageRead } from "@/hooks/dashboard/useMessages";
import { timeAgo } from "@/lib/utils";
import type { Message } from "@/types";
import {
  MessageSquare,
  Mail,
  X,
  CheckCheck,
  User,
  Clock,
} from "lucide-react";

export default function DashboardMessagesPage() {
  const { data: response, isLoading } = useDashboardMessages();
  const markReadMutation = useMarkMessageRead();
  const [selected, setSelected] = useState<Message | null>(null);

  const messages = response?.data || [];

  const handleMarkRead = async (id: string) => {
    try {
      await markReadMutation.mutateAsync(id);
      toast.success("Marked as read");
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleBulkMarkRead = async () => {
    const unread = messages.filter((m) => !m.isRead);
    try {
      await Promise.all(unread.map((m) => markReadMutation.mutateAsync(m._id)));
      toast.success(`${unread.length} messages marked as read`);
    } catch {
      toast.error("Failed to update some messages");
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Messages</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`
              : "All messages read"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkMarkRead}
            disabled={markReadMutation.isPending}
          >
            <CheckCheck className="mr-2 h-4 w-4" /> Mark All Read
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Message List */}
        <div className="lg:col-span-3 space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))
          ) : messages.length === 0 ? (
            <Card className="bg-dash-card border-white/[0.06]">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No messages yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Messages from your contact form will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            messages.map((message, i) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className={`bg-dash-card border-white/[0.06] cursor-pointer hover:border-white/[0.12] transition-all ${
                    selected?._id === message._id ? "ring-1 ring-violet" : ""
                  }`}
                  onClick={() => {
                    setSelected(message);
                    if (!message.isRead) handleMarkRead(message._id);
                  }}
                >
                  <CardContent className="p-4 flex items-start gap-3">
                    {/* Unread indicator */}
                    <div className="pt-1.5">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          message.isRead ? "bg-transparent" : "bg-electric"
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-medium truncate ${
                          !message.isRead ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {message.name}
                        </p>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {timeAgo(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground truncate mt-0.5">
                        {message.subject}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {message.body}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Message Detail Panel */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="bg-dash-card border-white/[0.06] sticky top-6">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{selected.subject}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">{selected.isRead ? "Read" : "Unread"}</Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      className="rounded-md p-1 hover:bg-white/[0.06] text-muted-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{selected.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <a
                          href={`mailto:${selected.email}`}
                          className="text-electric hover:underline"
                        >
                          {selected.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{new Date(selected.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="h-px bg-white/[0.06]" />

                    <div className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                      {selected.body}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}>
                        <Mail className="mr-2 h-3.5 w-3.5" /> Reply via Email
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className="bg-dash-card border-white/[0.06]">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <Mail className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Select a message to view details
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
