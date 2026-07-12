import type { FailureType } from "../e2e/crawler/crawlRoute";

export type R3FailureType =
  | FailureType
  | "dead-link"
  | "dead-control"
  | "infinite-redirect"
  | "unreachable-route"
  | "denylist-violation"
  | "failed-api-call";

export type R3Failure = {
  type: R3FailureType;
  route: string;
  signature: string;
  detail: string;
  action?: string;
};

export type R3VisitedRoute = {
  path: string;
  source: string;
  actions: string[];
  failures: R3Failure[];
};

export type R3RunResult = {
  ok: boolean;
  baseURL: string;
  ranAt: string;
  seed: string;
  limits: {
    maxPages: number;
    maxActions: number;
    maxActionsPerPage: number;
    maxDurationMs: number;
  };
  visited: R3VisitedRoute[];
  failures: R3Failure[];
  skipped: Array<{ path: string; reason: string }>;
};
