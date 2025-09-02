export type UserRole = 'receptionist' | 'doctor';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
}

export type TokenStatus = 'waiting' | 'in-progress' | 'completed';

export interface Token {
  id: string;
  tokenNumber: number;
  patientId: string;
  patientName: string;
  status: TokenStatus;
  issuedAt: string; // ISO string
  consultingDoctor?: string;
}

export interface Visit {
  id: string;
  patientId: string;
  tokenNumber: number;
  date: string; // ISO string
  symptoms: string;
  diagnosis: string;
  prescription: string;
  consultationFee: number;
  doctorName: string;
}

export type ClinicLog = {
  id: string;
  timestamp: string; // ISO string
  role: UserRole;
  action: string;
  details: string;
};
