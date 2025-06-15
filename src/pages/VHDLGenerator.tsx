import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Main component for VHDL code generation UI
export default function VHDLGenerator() {
  // State to hold user input description
  const [description, setDescription] = useState("");
  // State to hold the generated VHDL code from the API
  const [generatedCode, setGeneratedCode] = useState("");
  // Loading state to show a spinner/text during request
  const [loading, setLoading] = useState(false);

  // Function to send the description to the backend and retrieve VHDL code
  const generateCode = async () => {
    setLoading(true); // Show loading state
    setGeneratedCode(""); // Clear previous output

    try {
      // Send POST request to the backend API
      const response = await fetch("http://localhost:5000/api/generate-vhdl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }), // Send user input as JSON
      });

      // Parse the response and extract code
      const data = await response.json();
      setGeneratedCode(data.code || "No code returned.");
    } catch (error) {
      // Handle any errors during fetch
      setGeneratedCode("Error generating code.");
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Card for input section */}
      <Card>
        <CardContent className="space-y-4">
          <Label htmlFor="description">Component Description</Label>
          {/* Textarea where user types the component spec */}
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., A 4-bit counter with enable and reset..."
            rows={6}
          />
          {/* Button to trigger VHDL code generation */}
          <Button onClick={generateCode} disabled={loading}>
            {loading ? "Generating..." : "Generate VHDL Code"}
          </Button>
        </CardContent>
      </Card>

      {/* Card for output section, shown only if code is returned */}
      {generatedCode && (
        <Card>
          <CardContent>
            <Label>Generated VHDL Code</Label>
            {/* Read-only textarea to display generated code */}
            <Textarea value={generatedCode} readOnly rows={10} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
