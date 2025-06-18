const API_BASE = "http://localhost:4000/api";

export async function generateVhdl(description: string) {
  const res = await fetch(`${API_BASE}/generate-vhdl`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });

  if (!res.ok) throw new Error("Failed to generate VHDL");
  return await res.json();
}

export async function generateAndTestVhdl(
  description: string,
  testbench: string,
  topEntity: string
) {
  const res = await fetch(`${API_BASE}/generate-and-test-vhdl`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description, testbench, topEntity }),
  });

  if (!res.ok) throw new Error("Failed to generate and test VHDL");
  return await res.json();
}
