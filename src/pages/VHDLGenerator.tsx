import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useVHDLGenerator from "@/hooks/useVHDLGenerator";

export default function VHDLGenerator() {
  const [description, setDescription] = useState("");
  const [testbenchEnabled, setTestbenchEnabled] = useState(false);
  const [testbench, setTestbench] = useState("");
  const [topEntity, setTopEntity] = useState("");

  const {
    generatedCode,
    simulationOutput,
    generateCode,
    generateWithTestbench,
    loading,
  } = useVHDLGenerator();

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <Label htmlFor="description">Component Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., A 4-bit counter with enable and reset..."
            rows={6}
          />

          <div className="flex items-center space-x-4">
            <Label htmlFor="enableTestbench">Include Testbench</Label>
            <Switch
              id="enableTestbench"
              checked={testbenchEnabled}
              onCheckedChange={setTestbenchEnabled}
            />
          </div>

          {testbenchEnabled && (
            <>
              <Label htmlFor="topEntity">Top-Level Entity Name</Label>
              <Textarea
                id="topEntity"
                value={topEntity}
                onChange={(e) => setTopEntity(e.target.value)}
                placeholder="e.g., tb_my_component"
              />
              <Label htmlFor="testbench">Testbench Code</Label>
              <Textarea
                id="testbench"
                value={testbench}
                onChange={(e) => setTestbench(e.target.value)}
                placeholder="Paste your testbench code here..."
                rows={6}
              />
            </>
          )}

          <Button
            onClick={
              testbenchEnabled
                ? () => generateWithTestbench(description, testbench, topEntity)
                : () => generateCode(description)
            }
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate VHDL Code"}
          </Button>
        </CardContent>
      </Card>

      {generatedCode && (
        <Card>
          <CardContent className="space-y-2">
            <Label>Generated VHDL Code</Label>
            <Textarea value={generatedCode} readOnly rows={10} />
          </CardContent>
        </Card>
      )}

      {testbenchEnabled && simulationOutput && (
        <Card>
          <CardContent className="space-y-2">
            <Label>Simulation Output</Label>
            <Textarea value={simulationOutput} readOnly rows={10} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
