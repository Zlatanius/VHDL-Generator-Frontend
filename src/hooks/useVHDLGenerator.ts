import { useState } from "react";
import { generateVhdl, generateAndTestVhdl } from "@/api/generateVhdlApi";

const useVHDLGenerator = () => {
  const [generatedCode, setGeneratedCode] = useState("");
  const [simulationOutput, setSimulationOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const resetOutput = () => {
    setGeneratedCode("");
    setSimulationOutput("");
  };

  const generateCode = async (description: string) => {
    setLoading(true);
    resetOutput();
    try {
      const data = await generateVhdl(description);
      setGeneratedCode(data.code ?? "No code returned.");
    } catch (err) {
      setGeneratedCode(`Error generating code. Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const generateWithTestbench = async (
    description: string,
    testbench: string,
    topEntity: string
  ) => {
    setLoading(true);
    resetOutput();
    try {
      const data = await generateAndTestVhdl(description, testbench, topEntity);
      setGeneratedCode(data.design ?? "No design returned.");
      setSimulationOutput(
        data.simulation_output ?? data.simulation_error ?? "No output returned."
      );
    } catch (err) {
      setGeneratedCode(`Error generating or simulating. ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    generatedCode,
    simulationOutput,
    generateCode,
    generateWithTestbench,
    loading,
  };
};

export default useVHDLGenerator;
