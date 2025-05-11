"use client";

import { showToast } from "@/app/providers";
import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { useState } from "react";
import { Button } from "../ui/button";
import { Check, Link2 } from "lucide-react";

export function ShareButton({ type, id }: { type: string; id: string }) {
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
    <Button
      onClick={handleClick}
      className="h-12 px-4 bg-primary rounded-md hover:scale-105 hover:shadow-lg transition-all text-base"
    >
      {copied ? <Check /> : <Link2 className="w-10 h-10" />}
    </Button>
  );
}
