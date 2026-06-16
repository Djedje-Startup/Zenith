// types/index.ts

// ========== UTILISATEURS ==========
export type UserRole = 'PARENT' | 'ELEVE' | 'PROFESSEUR' | 'ADMIN';

export interface User {
  id: string;
  nom: string;
  prenoms: string;
  email: string;
  telephone: string;
  role: UserRole;
  photo?: string;
  dateCreation: string;
}

// ========== ÉCOLES ==========
export interface School {
  id: string;
  nom: string;
  logo?: string;
  ville: string;
  pays: string;
  statut: 'ACTIF' | 'INACTIF';
  anneeScolaire?: string;
}

export interface Campus {
  id: string;
  nom: string;
  adresse: string;
  ville: string;
  telephone?: string;
  coordonnees?: { latitude: number; longitude: number };
}

export interface Classe {
  id: string;
  nom: string;
  niveau: string;
  effectif: number;
  capaciteMax: number;
  cycle: string;
}

// ========== ENFANTS ==========
export interface Child {
  id: string;
  nom: string;
  prenoms: string;
  photo?: string;
  dateNaissance: string;
  matricule: string;
  classe: string;
  classeId: string;
  cycle: string;
  niveau: string;
  schoolId: string;
  schoolName: string;
  moyenneGenerale?: number;
  rang?: number;
  effectifClasse?: number;
  nbAbsences: number;
  nbRetards: number;
  statut: 'ACTIF' | 'INACTIF' | 'SUSPENDU';
}

// ========== NOTES ET BULLETINS ==========
export type Mention = 'EXCELLENT' | 'TRES_BIEN' | 'BIEN' | 'ASSEZ_BIEN' | 'PASSABLE' | 'INSUFFISANT';

export interface Grade {
  id: string;
  matiere: string;
  moyenne: number;
  coefficient: number;
  appreciation?: string;
  rang?: number;
}

export interface ReportCard {
  id: string;
  numero: string;
  periode: string;
  dateEmission: string;
  moyenneGenerale: number;
  mention: Mention;
  rang: number;
  effectifClasse: number;
  appreciation?: string;
  matieres: Grade[];
  fileUrl?: string;
}

export interface GradeStats {
  moyenneGenerale: number;
  meilleureMatiere: { nom: string; note: number };
  matiereFaible: { nom: string; note: number };
  progression: number;
  classement: { rang: number; total: number };
}

// ========== EMPLOI DU TEMPS ==========
export interface TimetableEntry {
  id: string;
  heureDebut: string;
  heureFin: string;
  matiere: string;
  professeur: string;
  salle: string;
  type?: 'CM' | 'TD' | 'TP';
}

export interface TimetableDay {
  jour: string;
  date: string;
  cours: TimetableEntry[];
}

export interface WeekTimetable {
  semaine: number;
  annee: number;
  dateDebut: string;
  dateFin: string;
  jours: TimetableDay[];
}

// ========== PRÉSENCES ==========
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'RETARD' | 'EXCUSE';

export interface AttendanceRecord {
  date: string;
  statut: AttendanceStatus;
  heureArrivee?: string;
  retardMinutes?: number;
  motif?: string;
}

export interface AttendanceStats {
  totalJours: number;
  presents: number;
  absents: number;
  retards: number;
  excuses: number;
  tauxPresence: number;
}

export interface AttendanceHistory {
  mois: string;
  annee: number;
  statistiques: AttendanceStats;
  details: AttendanceRecord[];
}

// ========== CLUBS ==========
export interface Club {
  id: string;
  nom: string;
  description: string;
  logo?: string;
  couleur: string;
  nbMembres: number;
  isMember?: boolean;
  role?: 'RESPONSABLE' | 'ENCADRANT' | 'MEMBRE';
  prochainEvent?: { id: string; titre: string; date: string };
}

export interface ClubEvent {
  id: string;
  titre: string;
  description: string;
  date: string;
  lieu: string;
  participants: number;
  maxParticipants?: number;
}

// ========== PAIEMENTS ==========
export interface Invoice {
  id: string;
  numero: string;
  libelle: string;
  description?: string;
  montant: number;
  montantPaye: number;
  solde: number;
  dateEmission: string;
  dateEcheance: string;
  statut: 'PAYEE' | 'PARTIELLE' | 'EN_RETARD' | 'EMISE' | 'ANNULEE';
}

export interface Payment {
  id: string;
  reference: string;
  montant: number;
  date: string;
  mode: string;
  statut: 'VALIDE' | 'EN_ATTENTE' | 'ECHOUE';
  factureId: string;
  factureNumero: string;
  receiptUrl?: string;
}

// ========== NOTIFICATIONS ==========
export interface Notification {
  id: string;
  titre: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  date: string;
  lien?: string;
}

// ========== API RÉPONSES ==========
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}