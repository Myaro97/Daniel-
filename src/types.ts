export enum WoodType {
  PIN = "Pin",
  FRÊNE = "Frêne",
  AUTRE = "Autre"
}

export interface WoodStock {
  id: string;
  type: string;
  quantity: number; // in m3
  buyPrice: number; // per m3
  sellPrice: number; // per m3
  minThreshold: number; // for alerts
}

export interface Sale {
  id: string;
  woodId: string;
  woodType: string;
  quantity: number;
  price: number;
  total: number;
  clientId?: string;
  clientName?: string;
  date: string; // ISO string
  paymentStatus: 'paid' | 'credit';
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: 'achat' | 'transport' | 'autre';
}

export interface Delivery {
  id: string;
  saleId: string;
  clientName: string;
  destination: string;
  status: 'en attente' | 'livré';
  date: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  salary: number;
  status: 'actif' | 'conge' | 'parti';
}

export interface Production {
  id: string;
  woodType: string;
  quantity: number;
  source: string; // e.g., "Ala" (Forest)
  destination: string; // e.g., "Tanana" (Yard)
  date: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  notes: string;
  totalPurchases: number;
  lastPurchaseDate?: string;
  debt: number;
}

export interface DashboardStats {
  todayRevenue: number;
  todayVolume: number;
  last7DaysSales: { date: string; total: number }[];
  criticalStocks: WoodStock[];
}
