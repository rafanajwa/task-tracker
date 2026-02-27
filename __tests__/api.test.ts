import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the DB module
vi.mock("@/lib/db", () => ({
  sql: vi.fn(),
}));

import { sql } from "@/lib/db";
import { getAllTasks, getTaskById, createTask, deleteTask } from "@/lib/tasks";

const mockTask = {
  id: "abc-123",
  title: "Test Task",
  description: "A description",
  status: "TODO",
  priority: "MEDIUM",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getAllTasks", () => {
  it("returns all tasks", async () => {
    vi.mocked(sql).mockResolvedValueOnce([mockTask]);
    const tasks = await getAllTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe("Test Task");
  });

  it("passes status filter to query", async () => {
    vi.mocked(sql).mockResolvedValueOnce([]);
    await getAllTasks({ status: "DONE" });
    const [query, params] = vi.mocked(sql).mock.calls[0] as [string, unknown[]];
    expect(query).toContain("status = $");
    expect(params).toContain("DONE");
  });
});

describe("getTaskById", () => {
  it("returns task when found", async () => {
    vi.mocked(sql).mockResolvedValueOnce([mockTask]);
    const task = await getTaskById("abc-123");
    expect(task).not.toBeNull();
    expect(task?.id).toBe("abc-123");
  });

  it("returns null when not found", async () => {
    vi.mocked(sql).mockResolvedValueOnce([]);
    const task = await getTaskById("nonexistent");
    expect(task).toBeNull();
  });
});

describe("createTask", () => {
  it("creates a task with defaults", async () => {
    vi.mocked(sql).mockResolvedValueOnce([mockTask]);
    const task = await createTask({ title: "Test Task" });
    const [, params] = vi.mocked(sql).mock.calls[0] as [string, unknown[]];
    expect(params).toContain("TODO");
    expect(params).toContain("MEDIUM");
    expect(task.title).toBe("Test Task");
  });
});

describe("deleteTask", () => {
  it("returns true when task deleted", async () => {
    vi.mocked(sql).mockResolvedValueOnce([{ id: "abc-123" }]);
    const result = await deleteTask("abc-123");
    expect(result).toBe(true);
  });

  it("returns false when task not found", async () => {
    vi.mocked(sql).mockResolvedValueOnce([]);
    const result = await deleteTask("nonexistent");
    expect(result).toBe(false);
  });
});