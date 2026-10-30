// Runs the solver off the main thread so heavy problems never freeze the page.
import type { SolveRequest, SolveResult } from "@/types/solver";
import { preloadCas } from "./integral";
import { solve } from "./solve";

interface WorkerScope {
  addEventListener(type: "message", listener: (e: MessageEvent<{ id: number; request: SolveRequest }>) => void): void;
  postMessage(message: { id: number; result: SolveResult }): void;
}

const scope = self as unknown as WorkerScope;

// Fetch the computer algebra fallback shortly after start-up, so every feature works offline afterwards.
setTimeout(preloadCas, 3000);

scope.addEventListener("message", async (e) => {
  const result = await solve(e.data.request);
  scope.postMessage({ id: e.data.id, result });
});
