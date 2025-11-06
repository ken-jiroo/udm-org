import { createContext, useContext, useEffect, useMemo, useState } from "react";

const EventsContext = createContext();

const DEFAULT_EVENTS = [
  {
    id: crypto.randomUUID(),
    title: "bday ni Angel",
    date: "2025-10-30",
    time: "10:30",
    location: "bahay ni Angel",
    description: "bday ni angel hahahahahahaha",
  },
  {
    id: crypto.randomUUID(),
    title: "bday ni Jei",
    date: "2025-11-03",
    time: "10:30",
    location: "bahay ni Jei",
    description: "bday ni jei hahahahahaha",
  },
  {
    id: crypto.randomUUID(),
    title: "bday ni Mark",
    date: "2025-11-04",
    time: "10:30",
    location: "bahay ni Mark",
    description: "bday ni mark hahahahahahahaha",
  },
];

export function EventsProvider({ children }) {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("events");
    return saved ? JSON.parse(saved) : DEFAULT_EVENTS;
  });

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const api = useMemo(
    () => ({
      events,
      create(evt) {
        setEvents((cur) => [
    { ...evt, id: crypto.randomUUID(), image: evt.image || "" },
    ...cur,
  ]);
      },
      update(id, patch) {
  setEvents((cur) =>
    cur.map((e) =>
      e.id === id ? { ...e, ...patch, image: patch.image ?? e.image } : e
    )
  );
},
      remove(id) {
        setEvents((cur) => cur.filter((e) => e.id !== id));
      },
    }),
    [events]
  );

  return <EventsContext.Provider value={api}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  return useContext(EventsContext);
}
