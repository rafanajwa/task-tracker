import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TaskForm from "@/components/TaskForm";

// Mock Next.js navigation
const mockPush = vi.fn();
const mockBack = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    refresh: mockRefresh,
  }),
}));

// Mock fetch
global.fetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe("TaskForm - Create", () => {
  it("renders all fields", () => {
    render(<TaskForm />);
    expect(screen.getByPlaceholderText("What needs to be done?")).toBeDefined();
    expect(screen.getByPlaceholderText("Add more details...")).toBeDefined();
    expect(screen.getByText("Create Task")).toBeDefined();
  });

  it("shows error when title is empty and submitted", async () => {
    render(<TaskForm />);
    const submitBtn = screen.getByText("Create Task");
    fireEvent.click(submitBtn);
    // HTML5 required validation prevents submit - fetch should not be called
    expect(fetch).not.toHaveBeenCalled();
  });

  it("calls POST /api/tasks on valid submit", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "new-id", title: "New Task" }),
    } as Response);

    render(<TaskForm />);

    fireEvent.change(screen.getByPlaceholderText("What needs to be done?"), {
      target: { value: "New Task" },
    });

    fireEvent.submit(screen.getByText("Create Task").closest("form")!);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/tasks", expect.objectContaining({ method: "POST" }));
    });
  });

  it("displays server error message on failure", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Something went wrong" }),
    } as Response);

    render(<TaskForm />);
    fireEvent.change(screen.getByPlaceholderText("What needs to be done?"), {
      target: { value: "Test" },
    });
    fireEvent.submit(screen.getByText("Create Task").closest("form")!);

    await waitFor(() => {
      expect(screen.getByText("Something went wrong")).toBeDefined();
    });
  });
});

describe("TaskForm - Edit", () => {
  const mockTask = {
    id: "task-1",
    title: "Existing Task",
    description: "Existing description",
    status: "IN_PROGRESS" as const,
    priority: "HIGH" as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  it("pre-fills form with task data", () => {
    render(<TaskForm task={mockTask} />);
    const titleInput = screen.getByPlaceholderText("What needs to be done?") as HTMLInputElement;
    expect(titleInput.value).toBe("Existing Task");
    expect(screen.getByText("Save Changes")).toBeDefined();
  });

  it("calls PATCH /api/tasks/:id on submit", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTask,
    } as Response);

    render(<TaskForm task={mockTask} />);
    fireEvent.submit(screen.getByText("Save Changes").closest("form")!);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `/api/tasks/${mockTask.id}`,
        expect.objectContaining({ method: "PATCH" })
      );
    });
  });
});