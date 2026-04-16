export interface PublicHoliday {
  id: string;
  holidayName: string;
  holidayDate: string;
  description: string;
  isHalfDay: boolean;
  startTime: string;
  endTime: string;
  creatorId: string;
  creationTime: string;
  lastModifierId: string;
  lastModificationTime: string;
  deleterId: string;
  deletionTime: string;
  isDeleted: boolean;
}
