"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SolveRequest, SolveResult } from "@/types/solver";

const TIMEOUT_MS = 12000;

type State = { status: "idle" } | { status: "solving" } | { status: "done"; result: SolveResult; request: SolveRequest };
type Pending = { id: number; timer: ReturnType<typeof setTimeout>; finish: (result: SolveResult) => void };

/** Sends problems to a Web Worker (created on first use) and enforces a time limit. */
export function useSolver() {
  const workerRef = useRef<Worker | null>(null);
  const pending = useRef<Pending | null>(null);
  const nextId = useRef(1);
  const [state, setState] = useState<State>({ status: "idle" });

  useEffect(() => () => workerRef.current?.terminate(), []);

  /** Returns the shared worker, creating it (with its listeners) if needed; null if workers are unavailable. */
  const getWorker = useCallback((): Worker | null => {
    if (workerRef.current) return workerRef.current;
    if (typeof Worker === "undefined") return null;
    let worker: Worker;
    try {
      worker = new Worker(new URL("../../lib/math/solver.worker.ts", import.meta.url), { type: "module" });
    } catch {
      return null;
    }
    worker.addEventListener("message", (e: MessageEvent<{ id: number; result: SolveResult }>) => {
      if (pending.current?.id === e.data.id) pending.current.finish(e.data.result);
    });
    worker.addEventListener("error", () => {
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
      pending.current?.finish({ ok: false, error: "The solver stopped unexpectedly.", hint: "Please try again." });
    });
    workerRef.current = worker;
    return worker;
  }, []);

  const solve = useCallback(
    (request: SolveRequest) => {
      const id = nextId.current++;
      if (pending.current) clearTimeout(pending.current.timer);
      setState({ status: "solving" });

      const finish = (result: SolveResult) => {
        if (pending.current?.id !== id) return;
        clearTimeout(pending.current.timer);
        pending.current = null;
        setState({ status: "done", result, request });
      };
      const timer = setTimeout(() => {
        workerRef.current?.terminate();
        workerRef.current = null;
        finish({ ok: false, error: "This problem took too long to solve.", hint: "Try a simpler expression, a lower order, or a smaller interval." });
      }, TIMEOUT_MS);
      pending.current = { id, timer, finish };

      const worker = getWorker();
      if (worker) {
        worker.postMessage({ id, request });
      } else {
        // Fallback for browsers without module workers: solve on the main thread.
        import("@/lib/math/solve").then(({ solve: run }) => run(request)).then(finish);
      }
    },
    [getWorker],
  );

  /** Starts the worker ahead of time (e.g. when the browser is idle) so the first solve is instant. */
  const warm = useCallback(() => {
    getWorker();
  }, [getWorker]);

  const reset = useCallback(() => {
    if (pending.current) clearTimeout(pending.current.timer);
    pending.current = null;
    setState({ status: "idle" });
  }, []);

  return { state, solve, reset, warm };
}
