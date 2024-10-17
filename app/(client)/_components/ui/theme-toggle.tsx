"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Settings, Sun } from "lucide-react";

import { Button } from "@/app/(client)/_components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/(client)/_components/ui/tooltip";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <div className="flex space-x-2 items-center my-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme("light")}
          >
            <Sun className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Light Theme</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme("dark")}
          >
            <Moon className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Dark Theme</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme("system")}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>System Default Theme</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
