"use client";

import { createContext, useContext, type ReactNode } from "react";

export type WorkshopJoinScheduleValue = {
  displayDate: string;
  displayTime: string;
  workshopSlug: string;
};

const WorkshopJoinScheduleContext = createContext<WorkshopJoinScheduleValue | null>(
  null
);

export function WorkshopJoinScheduleProvider({
  value,
  children,
}: {
  value: WorkshopJoinScheduleValue;
  children: ReactNode;
}) {
  return (
    <WorkshopJoinScheduleContext.Provider value={value}>
      {children}
    </WorkshopJoinScheduleContext.Provider>
  );
}

export function useWorkshopJoinSchedule() {
  return useContext(WorkshopJoinScheduleContext);
}
