'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Patient, Token, Visit, UserRole, ClinicLog, TokenStatus } from '@/lib/types';

// Mock Data
const MOCK_PATIENTS: Patient[] = [
    { id: 'p_1', name: 'John Doe', age: 45, gender: 'Male', contact: '123-456-7890' },
    { id: 'p_2', name: 'Jane Smith', age: 32, gender: 'Female', contact: '234-567-8901' },
    { id: 'p_3', name: 'Peter Jones', age: 67, gender: 'Male', contact: '345-678-9012' },
];

const MOCK_TOKENS: Token[] = [
    { id: 't_1', tokenNumber: 1, patientId: 'p_1', patientName: 'John Doe', status: 'completed', issuedAt: new Date(Date.now() - 20*60000).toISOString(), consultingDoctor: 'Dr. Anya Sharma' },
    { id: 't_2', tokenNumber: 2, patientId: 'p_2', patientName: 'Jane Smith', status: 'in-progress', issuedAt: new Date(Date.now() - 10*60000).toISOString(), consultingDoctor: 'Dr. Ben Carter' },
    { id: 't_3', tokenNumber: 3, patientId: 'p_3', patientName: 'Peter Jones', status: 'waiting', issuedAt: new Date(Date.now() - 5*60000).toISOString() },
];

const MOCK_VISITS: Visit[] = [
    { id: 'v_1', patientId: 'p_1', tokenNumber: 1, date: new Date(Date.now() - 20*60000).toISOString(), symptoms: 'Fever, cough', diagnosis: 'Viral Infection', prescription: 'Rest and fluids', consultationFee: 500, doctorName: 'Dr. Anya Sharma' }
]

const MOCK_LOGS: ClinicLog[] = [
    { id: 'l_1', timestamp: new Date(Date.now() - 30*60000).toISOString(), role: 'receptionist', action: 'System Start', details: 'Application initialized.' },
];

interface ClinicState {
  patients: Patient[];
  tokens: Token[];
  visits: Visit[];
  logs: ClinicLog[];
  userRole: UserRole | null;
  userName: string | null;
  hydrated: boolean;

  // Actions
  setHydrated: () => void;
  login: (role: UserRole, email: string) => void;
  logout: () => void;
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  issueToken: (patientId: string) => Token | undefined;
  updateTokenStatus: (tokenId: string, status: TokenStatus) => void;
  addVisit: (visit: Omit<Visit, 'id'>) => void;
  addLog: (entry: Omit<ClinicLog, 'id' | 'timestamp'>) => void;
  getNextTokenNumber: () => number;
}

const useClinicStore = create<ClinicState>()(
  persist(
    (set, get) => ({
      patients: MOCK_PATIENTS,
      tokens: MOCK_TOKENS,
      visits: MOCK_VISITS,
      logs: MOCK_LOGS,
      userRole: null,
      userName: null,
      hydrated: false,

      setHydrated: () => set({ hydrated: true }),

      login: (role, email) => {
        const name = email.split('@')[0];
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
        set({ userRole: role, userName: formattedName });
        get().addLog({ role, action: 'User Login', details: `${formattedName} (${role}) logged in.` });
      },
      logout: () => {
        const role = get().userRole;
        if(role) {
            get().addLog({ role, action: 'User Logout', details: `${get().userName} (${role}) logged out.` });
        }
        set({ userRole: null, userName: null });
      },

      addPatient: (patientData) => {
        const newPatient: Patient = {
          id: `p_${'ID' + Date.now()}`,
          ...patientData,
        };
        set((state) => ({ patients: [...state.patients, newPatient] }));
        get().addLog({ role: 'receptionist', action: 'Patient Registered', details: `Registered new patient: ${newPatient.name}` });
      },

      getNextTokenNumber: () => {
        const tokens = get().tokens;
        if (tokens.length === 0) return 1;
        const maxToken = Math.max(...tokens.map(t => t.tokenNumber));
        return maxToken + 1;
      },

      issueToken: (patientId) => {
        const patient = get().patients.find((p) => p.id === patientId);
        if (!patient) return undefined;

        const existingToken = get().tokens.find(t => t.patientId === patientId && t.status !== 'completed');
        if (existingToken) return existingToken;

        const newToken: Token = {
          id: `t_${Date.now()}`,
          tokenNumber: get().getNextTokenNumber(),
          patientId: patient.id,
          patientName: patient.name,
          status: 'waiting',
          issuedAt: new Date().toISOString(),
        };
        set((state) => ({ tokens: [...state.tokens, newToken] }));
        get().addLog({ role: 'receptionist', action: 'Token Issued', details: `Token #${newToken.tokenNumber} issued to ${patient.name}` });
        return newToken;
      },

      updateTokenStatus: (tokenId, status) => {
        const doctorName = get().userName;
        set((state) => ({
          tokens: state.tokens.map((token) => {
            if (token.id === tokenId) {
                const updatedToken = { ...token, status };
                if (status === 'in-progress' && doctorName) {
                    updatedToken.consultingDoctor = `Dr. ${doctorName}`;
                }
                return updatedToken;
            }
            return token;
          }),
        }));
        if(status === 'in-progress') {
            const token = get().tokens.find(t => t.id === tokenId);
            if (token) get().addLog({ role: 'doctor', action: 'Consultation Started', details: `Dr. ${doctorName} started consultation for token #${token.tokenNumber} (${token.patientName})` });
        }
      },

      addVisit: (visitData) => {
        const newVisit: Visit = { id: `v_${Date.now()}`, ...visitData };
        set((state) => ({ visits: [...state.visits, newVisit] }));
        set((state) => ({
          tokens: state.tokens.map((token) =>
            token.tokenNumber === visitData.tokenNumber ? { ...token, status: 'completed' } : token
          ),
        }));
        const patient = get().patients.find(p => p.id === newVisit.patientId);
        if(patient) {
            get().addLog({ role: 'doctor', action: 'Consultation Completed', details: `Consultation for ${patient.name} by ${newVisit.doctorName} completed. Bill amount: $${newVisit.consultationFee}` });
        }
      },
      
      addLog: (entry) => {
        const newLog: ClinicLog = {
            id: `l_${Date.now()}`,
            timestamp: new Date().toISOString(),
            ...entry,
        };
        set((state) => ({ logs: [newLog, ...state.logs]}));
      },
    }),
    {
      name: 'clinic-flow-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if(state) state.setHydrated();
      }
    }
  )
);

// Custom hook to access the store
export const useClinic = useClinicStore;
