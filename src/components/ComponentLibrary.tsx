import { useEffect, useState } from "react";
import { Library, View } from "lucide-react";
import type { VHDLComponent } from "@/types/component";
import { fetchVHDLComponents } from "@/api/huggingFaceApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ComponentLibraryProps {
  onComponentSelect: (component: VHDLComponent) => void;
}

export function ComponentLibrary({ onComponentSelect }: ComponentLibraryProps) {
  const [components, setComponents] = useState<VHDLComponent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>();

  useEffect(() => {
    const loadComponents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchVHDLComponents();
        setComponents(data);
      } catch (err) {
        setError("Failed to load components");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadComponents();
  }, []);

  function extractComponentOverview(text: string): string | null {
    const lines = text.split(/\r?\n/);
    const startIndex = lines.findIndex(
      (line) => line.trim().toLowerCase() === "component overview"
    );

    if (startIndex === -1 || startIndex === lines.length - 1) {
      return null; // "Component Overview" not found or no content after it
    }

    let overviewLines: string[] = [];
    for (let i = startIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === "" || /^[A-Z][A-Za-z\s]+$/.test(line)) {
        // Stop at empty line or new section title
        break;
      }
      overviewLines.push(line);
    }

    return overviewLines.length > 0 ? overviewLines.join(" ") : null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-4 right-4">
          <Library className="h-5 w-5" />
          <span className="sr-only">Open Component Library</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Component Library</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && <p className="text-center">Loading components...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          <div className="grid gap-4">
            {components.map((component) => (
              <div
                key={component.index}
                className="p-4 border rounded-lg cursor-pointer hover:bg-accent"
                onClick={() => {
                  onComponentSelect(component);
                  setOpen(false);
                }}
              >
                <h3 className="font-medium mb-2">{component.component_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {extractComponentOverview(component.description)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
