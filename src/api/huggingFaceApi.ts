import type { VHDLComponent } from "@/types/component";

const DATASET_ID = "amujalo1%2FVHDL_ETF_shortened";
const HF_API_URL = `https://datasets-server.huggingface.co/rows`;

export async function fetchVHDLComponents(): Promise<VHDLComponent[]> {
  try {
    const response = await fetch(
      `${HF_API_URL}?dataset=${DATASET_ID}&config=default&split=train&offset=0&length=100`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch components");
    }

    const data = await response.json();

    // Transform the response data into our VHDLComponent format
    return data.rows.map((row: any) => ({
      index: row.row_idx,
      description: row.row.description,
      testbench: row.row.testbench,
      output: row.row.output,
      testbench_name: row.row["testbench name"],
      component_name: row.row["component name"],
    }));
  } catch (error) {
    console.error("Error fetching VHDL components:", error);
    throw error;
  }
}
