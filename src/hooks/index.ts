"use client";

import { useEffect, useRef, useState, useCallback, RefObject } from "react";

/** Hook to detect when an element enters the viewport */
export function useScrollAnimation(
  threshold = 0.1
): [RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}

/** Hook for contact form submission */
export function useContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitForm = useCallback(
    async (data: {
      name: string;
      email: string;
      subject: string;
      body: string;
    }) => {
      setIsSubmitting(true);
      setError(null);
      setIsSuccess(false);

      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Failed to send message");
        }

        setIsSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  return { submitForm, isSubmitting, isSuccess, error };
}

/** Hook to fetch projects from API */
export function useProjects(category?: string) {
  const [projects, setProjects] = useState<
    Array<{
      _id: string;
      title: string;
      description: string;
      thumbnail: string;
      techStack: string[];
      category: string;
      liveUrl: string;
      githubUrl: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const params = category && category !== "all" ? `?category=${category}` : "";
        const res = await fetch(`/api/projects${params}`);
        const json = await res.json();
        if (json.success) {
          setProjects(json.data);
        }
      } catch {
        console.error("Failed to fetch projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [category]);

  return { projects, isLoading };
}

/** Hook to log analytics */
export function useAnalytics() {
  const logView = useCallback(async (page: string) => {
    try {
      await fetch("/api/analytics/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, referrer: document.referrer }),
      });
    } catch {
      // Silently fail for analytics
    }
  }, []);

  const logClick = useCallback(async (projectId: string) => {
    try {
      await fetch("/api/analytics/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, referrer: document.referrer }),
      });
    } catch {
      // Silently fail for analytics
    }
  }, []);

  return { logView, logClick };
}
