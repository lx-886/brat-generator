"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function CopyButton({ 
  text, 
  className 
}: { 
  text: string 
  className?: string 
}) {
  const [isCopied, setIsCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            aria-label="Copy to clipboard"
            className={cn(
              "transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800",
              "hover:scale-105 active:scale-95",
              className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-500 animate-in fade-in" />
            ) : (
              <Copy className={cn(
                "h-4 w-4",
                isHovered ? "text-primary scale-110" : "text-muted-foreground"
              )} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          {isCopied ? "Copied!" : "Copy to clipboard"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}