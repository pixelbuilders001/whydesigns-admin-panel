"use client";
import { useToast } from "@/components/ui/use-toast";

type ToastVariant = "default" | "destructive" | "success" | "warning";

export const useToastAlert = () => {
  const { toast } = useToast();

  const showToast = (
    message: string,
    variant: ToastVariant = "default",
    title?: string
  ) => {
    const configMap: Record<ToastVariant, { title: string; className?: string }> = {
      default: { title: title || "Notice" },
      success: {
        title: title || "Success",
        className: "bg-green-100 text-green-900 border-green-300",
      },
      destructive: {
        title: title || "Error",
        className: "bg-red-100 text-red-900 border-red-300",
      },
      warning: {
        title: title || "Warning",
        className: "bg-yellow-100 text-yellow-900 border-yellow-300",
      },
    };

    const config = configMap[variant];

    toast({
      title: config.title,
      description: message,
      className: config.className,
    });
  };

  return { showToast };
};
