// src/context/ApplicationsContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ApplicationsContext = createContext();

const SEED = [
  { id: crypto.randomUUID(), name: "Juan Dela Cruz",  studentNo: "2025-00001", email: "juan@example.com", status: "Pending" },
  { id: crypto.randomUUID(), name: "Maria Santos",    studentNo: "2025-00002", email: "maria@example.com", status: "Pending" },
  { id: crypto.randomUUID(), name: "Mark Adrian",     studentNo: "2025-00003", email: "mark@example.com",  status: "Pending" },
  { id: crypto.randomUUID(), name: "Angela Libang",   studentNo: "2025-00004", email: "angela@example.com",status: "Pending" },
  { id: crypto.randomUUID(), name: "John Carlo Villanueva", studentNo: "2025-00005", email: "john@example.com", status: "Pending" },
  { id: crypto.randomUUID(), name: "Ella Mae Cruz",   studentNo: "2025-00006", email: "ella@example.com",  status: "Pending" },
  { id: crypto.randomUUID(), name: "Ralph Reyes",     studentNo: "2025-00007", email: "ralph@example.com", status: "Pending" },
  { id: crypto.randomUUID(), name: "Bianca Tolentino",studentNo: "2025-00008", email: "bianca@example.com",status: "Pending" },
  { id: crypto.randomUUID(), name: "James Tan",       studentNo: "2025-00009", email: "james@example.com", status: "Pending" },
  { id: crypto.randomUUID(), name: "Sofia Cruz",      studentNo: "2025-00010", email: "sofia@example.com", status: "Pending" },
  { id: crypto.randomUUID(), name: "Liam Dizon",      studentNo: "2025-00011", email: "liam@example.com",  status: "Pending" },
  { id: crypto.randomUUID(), name: "Ava Santos",      studentNo: "2025-00012", email: "ava@example.com",   status: "Pending" },
  { id: crypto.randomUUID(), name: "Noah Garcia",     studentNo: "2025-00013", email: "noah@example.com",  status: "Pending" },
];

export function ApplicationsProvider({ children }) {
  const [apps, setApps] = useState([]);

  useEffect(() => {
  const raw = localStorage.getItem("apps");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      // Only accept a non-empty array
      if (Array.isArray(parsed) && parsed.length > 0) {
        setApps(parsed);
        return;
      }
    } catch {
      // fall through to seeding
    }
  }
  // Seed when missing, invalid, or empty
  setApps(SEED);
  localStorage.setItem("apps", JSON.stringify(SEED));
}, []);


 useEffect(() => {
  if (Array.isArray(apps)) {
    localStorage.setItem("apps", JSON.stringify(apps));
  }
}, [apps]);


  function approve(id) {
    setApps(prev =>
      prev.map(a => (a.id === id ? { ...a, status: "Approved" } : a))
    );
  }

  function reject(id) {
    setApps(prev =>
      prev.map(a => (a.id === id ? { ...a, status: "Rejected" } : a))
    );
  }

  // Optional: send back to pending
  function revert(id) {
    setApps(prev =>
      prev.map(a => (a.id === id ? { ...a, status: "Pending" } : a))
    );
  }

  function remove(id) {
    setApps(prev => prev.filter(a => a.id !== id));
  }

  return (
    <ApplicationsContext.Provider
      value={{ apps, approve, reject, revert, remove }}
    >
      {children}
    </ApplicationsContext.Provider>
  );
}

export function useApplications() {
  return useContext(ApplicationsContext);
}
