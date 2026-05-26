// src/lib/__tests__/routeHelper.test.ts
import { describe, it, expect } from "vitest";
import {
  ROUTES,
  normalizeRoomId,
  stripRoomAccessSuffix,
  isSafeInternalPath,
  sanitizeReturnTo,
  withReturnTo,
  readReturnTo,
  roomPath,
  classifyRoute,
  extractRoomIdFromPath,
} from "@/lib/routeHelper";

describe("routeHelper", () => {
  describe("normalizeRoomId", () => {
    it("trims and removes leading/trailing slashes", () => {
      expect(normalizeRoomId("  /abc/  ")).toBe("abc");
      expect(normalizeRoomId("///abc///")).toBe("abc");
    });

    it("returns empty string for empty input", () => {
      expect(normalizeRoomId("")).toBe("");
      expect(normalizeRoomId("   ")).toBe("");
    });
  });

  describe("stripRoomAccessSuffix", () => {
    it("strips _vip and _free suffixes", () => {
      expect(stripRoomAccessSuffix("room_one_vip")).toBe("room_one");
      expect(stripRoomAccessSuffix("room_one_free")).toBe("room_one");
      expect(stripRoomAccessSuffix("room_one_VIP")).toBe("room_one");
    });

    it("leaves other ids untouched", () => {
      expect(stripRoomAccessSuffix("room_one")).toBe("room_one");
      expect(stripRoomAccessSuffix("room_vipness")).toBe("room_vipness");
    });
  });

  describe("isSafeInternalPath", () => {
    it("accepts normal internal paths", () => {
      expect(isSafeInternalPath("/")).toBe(true);
      expect(isSafeInternalPath("/room/abc")).toBe(true);
      expect(isSafeInternalPath("/signin?x=1")).toBe(true);
    });

    it("rejects non-internal or dangerous paths", () => {
      expect(isSafeInternalPath("http://evil.com")).toBe(false);
      expect(isSafeInternalPath("//evil.com")).toBe(false);
      expect(isSafeInternalPath("javascript:alert(1)")).toBe(false);
      expect(isSafeInternalPath("room/abc")).toBe(false); // must start with /
      expect(isSafeInternalPath("/\n/admin")).toBe(false);
    });
  });

  describe("sanitizeReturnTo", () => {
    it("returns fallback when unsafe", () => {
      expect(sanitizeReturnTo("http://evil.com", "/x")).toBe("/x");
      expect(sanitizeReturnTo("//evil.com", "/x")).toBe("/x");
      expect(sanitizeReturnTo("javascript:1", "/x")).toBe("/x");
      expect(sanitizeReturnTo("room/abc", "/x")).toBe("/x");
    });

    it("returns path when safe", () => {
      expect(sanitizeReturnTo("/room/abc", "/x")).toBe("/room/abc");
      expect(sanitizeReturnTo("/", "/x")).toBe("/");
    });
  });

  describe("withReturnTo / readReturnTo", () => {
    it("adds encoded returnTo param", () => {
      const url = withReturnTo("/signin", "/room/abc?x=1");
      expect(url.startsWith("/signin?returnTo=")).toBe(true);
      expect(url).toContain(encodeURIComponent("/room/abc?x=1"));
    });

    it("reads returnTo safely from params", () => {
      const params = new URLSearchParams("returnTo=%2Froom%2Fabc");
      expect(readReturnTo(params, "/fallback")).toBe("/room/abc");

      const bad = new URLSearchParams("returnTo=http%3A%2F%2Fevil.com");
      expect(readReturnTo(bad, "/fallback")).toBe("/fallback");
    });
  });

  describe("roomPath", () => {
    it("builds /room/:roomId", () => {
      expect(roomPath("abc")).toBe("/room/abc");
      expect(roomPath("/abc/")).toBe("/room/abc");
    });
  });

  describe("classifyRoute", () => {
    it("classifies basic routes", () => {
      expect(classifyRoute("/")).toBe("home");
      expect(classifyRoute("/signin")).toBe("signin");
      expect(classifyRoute("/admin")).toBe("admin");
      expect(classifyRoute("/tiers")).toBe("tiers");
      expect(classifyRoute("/room/abc")).toBe("room");
    });

    it("treats unknown as home (safe default)", () => {
      expect(classifyRoute("/something-else")).toBe("home");
    });
  });

  describe("extractRoomIdFromPath", () => {
    it("extracts roomId from /room/:id", () => {
      expect(extractRoomIdFromPath("/room/abc")).toBe("abc");
      expect(extractRoomIdFromPath("/room/abc/extra")).toBe("abc");
    });

    it("decodes encoded ids", () => {
      expect(extractRoomIdFromPath("/room/a%20b")).toBe("a b");
    });

    it("returns empty for non-room routes", () => {
      expect(extractRoomIdFromPath("/tiers")).toBe("");
      expect(extractRoomIdFromPath("/")).toBe("");
    });
  });

  describe("ROUTES", () => {
    it("has stable base routes", () => {
      expect(ROUTES.home).toBe("/");
      expect(ROUTES.signin).toBe("/signin");
      expect(ROUTES.admin).toBe("/admin");
      expect(ROUTES.tiers).toBe("/tiers");
      expect(ROUTES.room("abc")).toBe("/room/abc");
    });
  });
});
