"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
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
  RotateCcw,
  Inbox,
} from "lucide-react";

export default function DashboardMessagesPage() {
  const { data: response, isLoading, isError, refetch } = useDashboardMessages();
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
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Messages</h1>
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

      {/* Two sections side by side with identical height */}
      <div className="grid lg:grid-cols-5 gap-6 lg:h-[calc(100vh-14rem)] lg:min-h-[520px] lg:max-h-[720px]">
        {/* Section 1: Message List (3 columns) */}
        <div className="lg:col-span-3 h-full min-h-[340px]">
          <Card className="bg-dash-card border-white/[0.06] flex flex-col h-full overflow-hidden">
            {/* Inbox Panel Header */}
            <div className="px-4 py-3.5 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.01] flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <Inbox className="h-4 w-4 text-brand-primary" />
                <span className="text-sm font-semibold text-foreground">Inbox</span>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {messages.length} {messages.length === 1 ? "message" : "messages"}
              </span>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))
              ) : isError ? (
                <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-base font-semibold">Could not load messages</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">
                    There was an issue fetching your messages.
                  </p>
                  <Button size="sm" variant="outline" onClick={() => refetch()}>
                    <RotateCcw className="mr-2 h-3.5 w-3.5" /> Retry
                  </Button>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3 text-muted-foreground">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-semibold">No messages yet</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    Messages from your contact form will appear here.
                  </p>
                </div>
              ) : (
                messages.map((message) => {
                  const isSelected = selected?._id === message._id;
                  return (
                    <div
                      key={message._id}
                      onClick={() => {
                        setSelected(message);
                        if (!message.isRead) handleMarkRead(message._id);
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-surface-elevated border-brand-primary/60 ring-1 ring-brand-primary/40 shadow-sm"
                          : message.isRead
                          ? "bg-surface-subtle/30 border-white/[0.04] hover:bg-surface-subtle hover:border-white/[0.08]"
                          : "bg-surface-subtle/80 border-white/[0.08] hover:bg-surface-subtle hover:border-white/[0.12]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Unread indicator */}
                        <div className="pt-1.5 flex-shrink-0">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              message.isRead ? "bg-transparent" : "bg-brand-primary"
                            }`}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`text-sm truncate ${
                                !message.isRead
                                  ? "text-foreground font-semibold"
                                  : "text-muted-foreground font-medium"
                              }`}
                            >
                              {message.name}
                            </p>
                            <span className="text-[11px] font-mono text-muted-foreground flex-shrink-0">
                              {timeAgo(message.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-foreground truncate mt-0.5">
                            {message.subject}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-1 line-clamp-1">
                            {message.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Section 2: Message Detail Panel (2 columns) */}
        <div className="lg:col-span-2 h-full min-h-[340px]">
          <Card className="bg-dash-card border-white/[0.06] flex flex-col h-full overflow-hidden">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col h-full"
                >
                  {/* Header */}
                  <div className="p-4 sm:p-5 border-b border-white/[0.06] flex items-start justify-between gap-3 bg-white/[0.01] flex-shrink-0">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-foreground leading-snug break-words">
                        {selected.subject}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={selected.isRead ? "secondary" : "default"}
                          className="text-[11px] font-medium"
                        >
                          {selected.isRead ? "Read" : "Unread"}
                        </Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      className="rounded-lg p-1.5 hover:bg-surface-elevated text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                      title="Close details"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                    <div className="space-y-2 p-3.5 rounded-lg bg-surface-subtle/50 border border-white/[0.04] text-xs">
                      <div className="flex items-center gap-2.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="font-semibold text-foreground text-sm">{selected.name}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <a
                          href={`mailto:${selected.email}`}
                          className="text-brand-primary hover:underline font-mono text-xs"
                        >
                          {selected.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2.5 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{new Date(selected.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="h-px bg-white/[0.06]" />

                    <div className="text-sm leading-relaxed whitespace-pre-wrap text-text-body font-normal">
                      {selected.body}
                    </div>
                  </div>

                  {/* Footer Action Button */}
                  <div className="p-4 sm:p-5 border-t border-white/[0.06] bg-white/[0.01] flex-shrink-0">
                    <Button
                      variant="outline"
                      size="default"
                      className="w-full h-10 font-medium hover:border-brand-primary hover:text-brand-primary transition-colors"
                      asChild
                    >
                      <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}>
                        <Mail className="mr-2 h-4 w-4" /> Reply via Email
                      </a>
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full flex flex-col items-center justify-center p-8 text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3 text-muted-foreground">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">No message selected</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    Choose a message from the inbox on the left to read its contents and reply.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </div>
  );
}
