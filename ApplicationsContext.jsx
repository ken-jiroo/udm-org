import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ApplicationsContext = createContext();

const DATA_VERSION = "apps_v3"; // <- bump this whenever you change SAMPLE_APPS

const SAMPLE_APPS = [
  {
    id: crypto.randomUUID(),
    name: "Angel Libang",
    studentNo: "23-22-1",
    email: "angel@cute.com",
    status: "Pending",               // "Pending" | "Approved" | "Rejected"
    // A tiny placeholder PNG (data URL). Replace with real uploads later.
    idAttachment:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsSAAALEgHS3X78AAABFElEQVR4nO3XwQnCMBRE0Ti4d3oQmS7kC1V0bEnrF2pJQY6l3zE6j7yC1n2rEu1w+J8QkAAACAZu6hV2g1X8Q4q7N4J3kV3q7m7sQv2t0Y1Q6C0s8hX9k5wW4h9Ew8o0nC6zI6m0+6y4Q1L4G8e4g0k6y4m0c8p0nC6zI6m0+6y4Q1L4G8e4g0k6y4m0c8p0nC6zI6m0+6y4Q1L4G8e4g0k6y4m0c8p9kqjz4c8k3oAAAAAABJRU5ErkJggg==",
  },
  {
    id: crypto.randomUUID(),
    name: "John Carlo",
    studentNo: "23-22-2",
    email: "Jc@redflag.com",
    status: "Pending",
    idAttachment: null, // none (shows a message)
  },
  {
    id: crypto.randomUUID(),
    name: "Mark Adrian",
    studentNo: "23-22-3",
    email: "mark@tahimiklang.com",
    status: "Approved",
    idAttachment: null,
  },
];

export function ApplicationsProvider({ children }) {
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem("applications");
    const version = localStorage.getItem("applications_version");

    if (!saved || version !== DATA_VERSION) {
      // seed with fresh sample + write version
      localStorage.setItem("applications_version", DATA_VERSION);
      return SAMPLE_APPS;
    }

    try {
      return JSON.parse(saved);
    } catch {
      // in case old storage is corrupted
      localStorage.setItem("applications_version", DATA_VERSION);
      return SAMPLE_APPS;
    }
  });

  useEffect(() => {
    localStorage.setItem("applications", JSON.stringify(applications));
    localStorage.setItem("applications_version", DATA_VERSION);
  }, [applications]);

  const api = useMemo(
    () => ({
      applications,
      approve(id) {
        setApplications((list) =>
          list.map((a) => (a.id === id ? { ...a, status: "Approved" } : a))
        );
      },
      reject(id) {
        setApplications((list) =>
          list.map((a) => (a.id === id ? { ...a, status: "Rejected" } : a))
        );
      },
      // optional helper to manually reseed samples
      resetAll() {
        setApplications(SAMPLE_APPS);
        localStorage.setItem("applications_version", DATA_VERSION);
      },
    }),
    [applications]
  );

  return (
    <ApplicationsContext.Provider value={api}>
      {children}
    </ApplicationsContext.Provider>
  );
}

export function useApplications() {
  return useContext(ApplicationsContext);
}
