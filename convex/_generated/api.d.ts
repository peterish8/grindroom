/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as leaderboard from "../leaderboard.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_rateLimit from "../lib/rateLimit.js";
import type * as lib_validation from "../lib/validation.js";
import type * as rooms from "../rooms.js";
import type * as snapshots from "../snapshots.js";
import type * as users from "../users.js";
import type * as workoutLogs from "../workoutLogs.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  crons: typeof crons;
  http: typeof http;
  leaderboard: typeof leaderboard;
  "lib/auth": typeof lib_auth;
  "lib/rateLimit": typeof lib_rateLimit;
  "lib/validation": typeof lib_validation;
  rooms: typeof rooms;
  snapshots: typeof snapshots;
  users: typeof users;
  workoutLogs: typeof workoutLogs;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
