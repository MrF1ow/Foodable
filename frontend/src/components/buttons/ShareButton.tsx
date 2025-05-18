"use client";

import { showToast } from "@/app/providers";
import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { useState } from "react";
import { Button } from "../ui/button";
import { Check, Link2 } from "lucide-react";

export function ShareButton({
  type,
  id,
  children,
  className = "",
}: {
  type: string;
  id: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const url = `${window.location.origin}/shared/${type}/${id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    showToast(
      TOAST_SEVERITY.SUCCESS,
      "Link copied to clipboard!",
      `/shared/${type}/${id}`,
      3000
    );
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 w-full px-2 py-1.5 hover:bg-accent rounded-sm"
      data-testid="share-grocery-list-button"
    >
      {copied ? <Check /> : <Link2 />}
      {children}
    </button>
  );
}
