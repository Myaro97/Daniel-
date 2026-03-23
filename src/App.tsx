import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  Truck, 
  Plus, 
  AlertTriangle, 
  History,
  DollarSign,
  Box,
  X,
  CheckCircle2,
  Clock,
  Users,
  Settings,
  Tag,
  BarChart3,
  Trees,
  LogOut,
  Download,
  Upload,
  Share2,
  ShoppingBag,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { format, subDays, isSameDay, parseISO, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { WoodStock, Sale, Delivery, Expense, Employee, Production, Client } from './types';

// --- Types & Defaults ---

const INITIAL_STOCKS: WoodStock[] = [
  { id: 'p1-14', type: '1er Planche de 14', quantity: 436, buyPrice: 4000, sellPrice: 5000, minThreshold: 50 },
  { id: 'p2-14', type: '2ème Planche de 14', quantity: 100, buyPrice: 3000, sellPrice: 3500, minThreshold: 50 },
  { id: 'p1-12', type: '1er Planche de 12', quantity: 330, buyPrice: 3500, sellPrice: 4200, minThreshold: 50 },
  { id: 'p2-12', type: '2ème Planche de 12', quantity: 317, buyPrice: 3700, sellPrice: 4500, minThreshold: 50 },
  { id: 'triangle', type: 'Triangle', quantity: 50, buyPrice: 800, sellPrice: 1200, minThreshold: 20 },
  { id: 'dosy-misy', type: 'Dosy Misy Odiny', quantity: 20, buyPrice: 1000, sellPrice: 1500, minThreshold: 20 },
  { id: 'dosy-tsisy', type: 'Dosy Tsisy Odiny', quantity: 15, buyPrice: 500, sellPrice: 800, minThreshold: 20 },
  { id: 'carree-6', type: 'Carrée 6', quantity: 80, buyPrice: 6000, sellPrice: 9375, minThreshold: 20 },
  { id: 'carree-5', type: 'Carrée 5', quantity: 120, buyPrice: 5000, sellPrice: 7500, minThreshold: 20 },
  { id: 'hazo-tapaka', type: 'Hazo Tapaka', quantity: 200, buyPrice: 2000, sellPrice: 3500, minThreshold: 50 },
];

const INITIAL_SALES: Sale[] = [
  { id: 's1', woodId: 'p1-14', woodType: 'Planche 1er', quantity: 150, price: 8000, total: 1200000, date: '2024-04-22T10:00:00Z', paymentStatus: 'paid' },
  { id: 's2', woodId: 'carree-6', woodType: 'Carrée 6', quantity: 80, price: 9375, total: 750000, date: '2024-04-20T14:30:00Z', paymentStatus: 'paid' },
  { id: 's3', woodId: 'p2-14', woodType: 'Planche 2em', quantity: 100, price: 6000, total: 600000, date: '2024-04-18T09:15:00Z', paymentStatus: 'paid' },
];

const INITIAL_EXPENSES: Expense[] = [
  { id: 'e1', description: 'Frais Transport', amount: 300000, date: '2024-04-22T08:00:00Z', category: 'transport' },
  { id: 'e2', description: 'Karama Mpiasa', amount: 500000, date: '2024-04-20T17:00:00Z', category: 'autre' },
  { id: 'e3', description: 'Fitaovana', amount: 400000, date: '2024-04-18T11:00:00Z', category: 'autre' },
];

const INITIAL_PRODUCTIONS: Production[] = [
  { id: 'pr1', woodType: '1er Planche de 14', quantity: 200, source: 'Ala', destination: 'Tanana', date: '2024-04-21T07:00:00Z' },
  { id: 'pr2', woodType: 'Carrée 6', quantity: 120, source: 'Ala', destination: 'Tanana', date: '2024-04-19T07:00:00Z' },
];

const INITIAL_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Alain', role: 'Mpiasa', salary: 450000, status: 'actif' },
  { id: '2', name: 'Ceril', role: 'Mpiasa', salary: 350000, status: 'actif' },
];

// --- Components ---

const Logo = ({ size = 40, className = "", showText = true, variant = "plank" }: { size?: number, className?: string, showText?: boolean, variant?: "plank" | "clean" }) => (
  <div 
    className={`relative flex items-center justify-center overflow-hidden ${variant === "plank" ? "rounded-md shadow-xl border-b-4 border-r-4 border-amber-950/60" : ""} ${className}`} 
    style={{ 
      width: showText ? size * 4 : size, 
      height: size,
      background: variant === "plank" ? "#78350f" : "transparent"
    }}
  >
    {variant === "plank" && (
      <>
        {/* Wood Texture Background */}
        <div 
          className="absolute inset-0 opacity-80"
          style={{ 
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")',
            backgroundSize: 'cover'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 via-transparent to-black/60"></div>
        {/* Plank Lines */}
        <div className="absolute inset-0 flex flex-col justify-between opacity-20">
          <div className="h-px bg-black w-full mt-[25%]"></div>
          <div className="h-px bg-black w-full mb-[25%]"></div>
        </div>
      </>
    )}
    
    <div className={`relative flex items-center gap-3 px-4 w-full h-full ${variant === "clean" ? "bg-white/90 rounded-xl p-2 shadow-sm" : ""}`}>
      {/* SVG Icon part */}
      <div className="flex-shrink-0" style={{ width: size * 0.8, height: size * 0.8 }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
          {/* Wood Planks Stacked */}
          <rect x="10" y="20" width="80" height="15" rx="2" fill="#92400e" />
          <rect x="10" y="40" width="80" height="15" rx="2" fill="#b45309" />
          <rect x="10" y="60" width="80" height="15" rx="2" fill="#d97706" />
          
          {/* Wood Grain Details */}
          <path d="M20 27 H40 M60 27 H80" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />
          <path d="M15 47 H35 M55 47 H75" stroke="#92400e" strokeWidth="1" strokeLinecap="round" />
          <path d="M25 67 H45 M65 67 H85" stroke="#b45309" strokeWidth="1" strokeLinecap="round" />
          
          {/* Circular Saw Blade (Accent) */}
          <circle cx="80" cy="80" r="15" fill="#475569" />
          <path d="M68 80 L92 80 M80 68 L80 92 M71 71 L89 89 M71 89 L89 71" stroke="#1e293b" strokeWidth="2" />
        </svg>
      </div>
      
      {showText && (
        <div className={`flex flex-col justify-center ${variant === "plank" ? "border-l border-white/10 pl-3" : "pl-1"}`}>
          <span className={`${variant === "plank" ? "text-white/80" : "text-emerald-800/60"} font-bold text-[10px] leading-none tracking-[0.2em] uppercase`}>Société</span>
          <span className={`${variant === "plank" ? "text-emerald-400" : "text-emerald-900"} font-black text-2xl leading-none tracking-tighter drop-shadow-xl`}>SOAVA</span>
          <span className={`${variant === "plank" ? "text-amber-200/40" : "text-emerald-700/60"} text-[7px] font-bold uppercase tracking-widest mt-1 whitespace-nowrap`}>Vente de bois et produits dérivés</span>
        </div>
      )}
    </div>
  </div>
);

const StatCard = ({ title, value, unit, icon: Icon, colorClass }: any) => (
  <div className="glass-card flex flex-col gap-1">
    <div className="flex justify-between items-start mb-2">
      <span className="stat-label">{title}</span>
      <div className={`p-1.5 rounded-lg ${colorClass}`}>
        <Icon size={16} className="text-white" />
      </div>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="stat-value">{value.toLocaleString()}</span>
      <span className="text-xs text-slate-400 font-medium">{unit}</span>
    </div>
  </div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all cursor-pointer group relative ${
      active 
        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 shadow-lg' 
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <Icon size={20} className={active ? 'text-emerald-400' : 'text-slate-500 group-hover:text-white'} />
    <span className="text-sm font-bold tracking-tight">{label}</span>
    {active && (
      <motion.div 
        layoutId="sidebar-active"
        className="absolute left-0 w-1.5 h-8 bg-emerald-500 rounded-r-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
      />
    )}
  </div>
);

const PlankDiagram = ({ type }: { type: string }) => {
  const isTriangle = type.toLowerCase().includes('triangle');
  const isSquare = type.toLowerCase().includes('carrée');
  
  return (
    <div className="w-full h-32 bg-amber-900/10 rounded-xl flex items-center justify-center relative overflow-hidden border border-white/5 group-hover:border-amber-500/30 transition-colors">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 11px)' }}></div>
      {isTriangle ? (
        <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
          <path d="M40 10L70 50H10L40 10Z" fill="#92400e" stroke="#451a03" strokeWidth="2"/>
        </svg>
      ) : isSquare ? (
        <div className="w-16 h-16 bg-amber-800 border-2 border-amber-950 rounded-sm shadow-2xl transform rotate-12"></div>
      ) : (
        <div className="w-40 h-10 bg-amber-800 border-2 border-amber-950 rounded-sm shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  // --- State ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('soava_auth') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [accessCode, setAccessCode] = useState('');
  const [savedAccessCode, setSavedAccessCode] = useState(() => {
    try {
      return localStorage.getItem('soava_access_code') || 'SOAVA.com';
    } catch (e) {
      return 'SOAVA.com';
    }
  });
  const [loginError, setLoginError] = useState(false);

  const [stocks, setStocks] = useState<WoodStock[]>(() => {
    try {
      const saved = localStorage.getItem('wood_stocks');
      const existing: WoodStock[] = saved ? JSON.parse(saved) : [];
      
      // If no saved data, use INITIAL_STOCKS
      if (existing.length === 0) return INITIAL_STOCKS;

      // Merge: Add items from INITIAL_STOCKS that don't exist, or update prices if they do
      let merged = [...existing];
      
      // Filter out removed products (Chêne, Hêtre, Sapin)
      const removedTypes = ["Chêne", "Hêtre", "Sapin"];
      merged = merged.filter(m => !removedTypes.includes(m.type));

      INITIAL_STOCKS.forEach(newItem => {
        const index = merged.findIndex(m => m.type === newItem.type);
        if (index === -1) {
          merged.push(newItem);
        } else {
          // Update prices from the new data (Excel images)
          merged[index].sellPrice = newItem.sellPrice;
          merged[index].buyPrice = newItem.buyPrice;
        }
      });
      return merged;
    } catch (e) {
      return INITIAL_STOCKS;
    }
  });
  
  const [sales, setSales] = useState<Sale[]>(() => {
    try {
      const saved = localStorage.getItem('wood_sales');
      return saved ? JSON.parse(saved) : INITIAL_SALES;
    } catch (e) {
      return INITIAL_SALES;
    }
  });

  const [deliveries, setDeliveries] = useState<Delivery[]>(() => {
    try {
      const saved = localStorage.getItem('wood_deliveries');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem('wood_expenses');
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch (e) {
      return INITIAL_EXPENSES;
    }
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem('wood_employees');
      return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    } catch (e) {
      return INITIAL_EMPLOYEES;
    }
  });

  const [productions, setProductions] = useState<Production[]>(() => {
    try {
      const saved = localStorage.getItem('wood_productions');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTIONS;
    } catch (e) {
      return INITIAL_PRODUCTIONS;
    }
  });

  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem('wood_clients');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'shop' | 'stock' | 'production' | 'finance' | 'employees' | 'clients' | 'prices' | 'settings'>('shop');
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [selectedProductForSale, setSelectedProductForSale] = useState<string | null>(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showProductionModal, setShowProductionModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedClientForHistory, setSelectedClientForHistory] = useState<Client | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // --- Persistence ---
  useEffect(() => {
    // Ensure exactly one Alain and one Ceril are in the list
    const allowedNames = ['alain', 'ceril'];
    
    // Create a map to keep only the first occurrence of each allowed name
    const uniqueEmployeesMap = new Map<string, Employee>();
    
    employees.forEach(e => {
      const nameLower = e.name.toLowerCase();
      if (allowedNames.includes(nameLower) && !uniqueEmployeesMap.has(nameLower)) {
        uniqueEmployeesMap.set(nameLower, e);
      }
    });

    // Ensure Alain and Ceril are present
    if (!uniqueEmployeesMap.has('alain')) {
      uniqueEmployeesMap.set('alain', { id: 'alain-auto', name: 'Alain', role: 'Mpiasa', salary: 450000, status: 'actif' });
    }
    if (!uniqueEmployeesMap.has('ceril')) {
      uniqueEmployeesMap.set('ceril', { id: 'ceril-auto', name: 'Ceril', role: 'Mpiasa', salary: 350000, status: 'actif' });
    }

    const finalEmployees = Array.from(uniqueEmployeesMap.values());

    // Only update if the list has changed (different length or different IDs/names)
    const currentIds = employees.map(e => e.id).sort().join(',');
    const finalIds = finalEmployees.map(e => e.id).sort().join(',');

    if (currentIds !== finalIds || employees.length !== finalEmployees.length) {
      setEmployees(finalEmployees);
    }
  }, []);

  useEffect(() => {
    // Ensure stocks are unique by type to avoid duplicates
    const uniqueStocksMap = new Map<string, WoodStock>();
    stocks.forEach(s => {
      if (!uniqueStocksMap.has(s.type)) {
        uniqueStocksMap.set(s.type, s);
      }
    });
    
    if (uniqueStocksMap.size !== stocks.length) {
      setStocks(Array.from(uniqueStocksMap.values()));
    }
  }, [stocks]);

  useEffect(() => {
    try { localStorage.setItem('wood_stocks', JSON.stringify(stocks)); } catch (e) {}
  }, [stocks]);
  useEffect(() => {
    try { localStorage.setItem('wood_sales', JSON.stringify(sales)); } catch (e) {}
  }, [sales]);
  useEffect(() => {
    try { localStorage.setItem('wood_deliveries', JSON.stringify(deliveries)); } catch (e) {}
  }, [deliveries]);
  useEffect(() => {
    try { localStorage.setItem('wood_expenses', JSON.stringify(expenses)); } catch (e) {}
  }, [expenses]);
  useEffect(() => {
    try { localStorage.setItem('wood_employees', JSON.stringify(employees)); } catch (e) {}
  }, [employees]);
  useEffect(() => {
    try { localStorage.setItem('wood_productions', JSON.stringify(productions)); } catch (e) {}
  }, [productions]);
  useEffect(() => {
    try { localStorage.setItem('wood_clients', JSON.stringify(clients)); } catch (e) {}
  }, [clients]);

  // --- Computed Stats ---
  const stats = useMemo(() => {
    const today = startOfDay(new Date());
    const todaySales = sales.filter(s => isSameDay(parseISO(s.date), today));
    
    const todayRevenue = todaySales.reduce((acc, s) => acc + s.total, 0);
    const todayCash = todaySales.filter(s => s.paymentStatus === 'paid').reduce((acc, s) => acc + s.total, 0);
    const todayVolume = todaySales.reduce((acc, s) => acc + s.quantity, 0);
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(today, 6 - i);
      const daySales = sales.filter(s => isSameDay(parseISO(s.date), d));
      return {
        date: format(d, 'EEE', { locale: fr }),
        total: daySales.reduce((acc, s) => acc + s.total, 0)
      };
    });

    const totalStock = stocks.reduce((acc, s) => acc + s.quantity, 0);
    const criticalStocks = stocks.filter(s => s.quantity <= s.minThreshold);

    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);
    const totalCash = sales.filter(s => s.paymentStatus === 'paid').reduce((acc, s) => acc + s.total, 0) - totalExpenses;
    const totalDebt = clients.reduce((acc, c) => acc + (c.debt || 0), 0);

    const pieData = stocks.map(s => ({ name: s.type, value: s.quantity }));
    const stockBarData = stocks.map(s => ({ 
      name: s.type, 
      quantité: s.quantity, 
      seuil: s.minThreshold 
    }));

    const financeChartData = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(today, 6 - i);
      const daySales = sales.filter(s => isSameDay(parseISO(s.date), d));
      const dayExpenses = expenses.filter(e => isSameDay(parseISO(e.date), d));
      
      const revenue = daySales.reduce((acc, s) => acc + s.total, 0);
      const expense = dayExpenses.reduce((acc, e) => acc + e.amount, 0);
      
      return {
        date: format(d, 'dd/MM'),
        revenue,
        expense,
        profit: revenue - expense
      };
    });

    // Calculate most profitable wood
    const woodProfits = stocks.map(s => {
      const margin = s.sellPrice - s.buyPrice;
      const soldQuantity = sales.filter(sale => sale.woodType === s.type).reduce((acc, sale) => acc + sale.quantity, 0);
      return {
        type: s.type,
        profit: margin * soldQuantity
      };
    }).sort((a, b) => b.profit - a.profit);

    return { 
      todayRevenue, 
      todayCash,
      todayVolume, 
      last7Days, 
      criticalStocks, 
      totalStock, 
      pieData, 
      stockBarData, 
      financeChartData, 
      totalExpenses, 
      totalRevenue,
      totalCash,
      totalDebt,
      mostProfitable: woodProfits[0]
    };
  }, [sales, stocks, expenses]);

  // --- Handlers ---
  const handleAddSale = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const woodId = formData.get('woodId') as string;
    const quantity = Number(formData.get('quantity'));
    const clientId = formData.get('clientId') as string;
    const clientName = formData.get('clientName') as string;
    const saleDate = formData.get('date') as string;
    const paymentStatus = formData.get('paymentStatus') as 'paid' | 'credit';

    const wood = stocks.find(s => s.id === woodId);
    if (!wood || wood.quantity < quantity) {
      alert("Stock insuffisant !");
      return;
    }

    const total = wood.sellPrice * quantity;
    const saleId = Math.random().toString(36).substring(2, 9);

    const newSale: Sale = {
      id: saleId,
      woodId,
      woodType: wood.type,
      quantity,
      price: wood.sellPrice,
      total,
      clientId: clientId || undefined,
      clientName: clientName || undefined,
      date: saleDate ? new Date(saleDate).toISOString() : new Date().toISOString(),
      paymentStatus
    };

    setSales([newSale, ...sales]);
    setStocks(stocks.map(s => s.id === woodId ? { ...s, quantity: s.quantity - quantity } : s));

    // Update client stats if linked
    if (clientId) {
      setClients(clients.map(c => c.id === clientId ? {
        ...c,
        totalPurchases: c.totalPurchases + newSale.total,
        lastPurchaseDate: newSale.date,
        debt: paymentStatus === 'credit' ? (c.debt || 0) + total : (c.debt || 0)
      } : c));
    }

    // Create delivery if needed (e.g., if destination is provided)
    const destination = formData.get('destination') as string;
    if (destination) {
      const newDelivery: Delivery = {
        id: Math.random().toString(36).substring(2, 9),
        saleId,
        clientName: clientName || 'Client Comptant',
        destination,
        status: 'en attente',
        date: new Date().toISOString()
      };
      setDeliveries([newDelivery, ...deliveries]);
    }

    setShowSaleModal(false);
    setSelectedProductForSale(null);
  };

  const handleAddClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const notes = formData.get('notes') as string;

    const newClient: Client = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      phone,
      address,
      notes,
      totalPurchases: 0,
      debt: 0
    };

    setClients([newClient, ...clients]);
    setShowClientModal(false);
  };

  const handleAddStock = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const type = formData.get('type') as string;
    const quantity = Number(formData.get('quantity'));
    const buyPrice = Number(formData.get('buyPrice'));
    const sellPrice = Number(formData.get('sellPrice'));

    const existing = stocks.find(s => s.type.toLowerCase() === type.toLowerCase());
    if (existing) {
      setStocks(stocks.map(s => s.id === existing.id ? { 
        ...s, 
        quantity: s.quantity + quantity,
        buyPrice,
        sellPrice
      } : s));
    } else {
      setStocks([...stocks, {
        id: Math.random().toString(36).substring(2, 9),
        type,
        quantity,
        buyPrice,
        sellPrice,
        minThreshold: 20
      }]);
    }
    setShowStockModal(false);
  };

  const handleAddExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newExpense: Expense = {
      id: Math.random().toString(36).substring(2, 9),
      description: formData.get('description') as string,
      amount: Number(formData.get('amount')),
      category: formData.get('category') as any,
      date: new Date().toISOString()
    };
    setExpenses([newExpense, ...expenses]);
    setShowExpenseModal(false);
  };

  const handleAddEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newEmployee: Employee = {
      id: Math.random().toString(36).substring(2, 9),
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      salary: Number(formData.get('salary')),
      status: 'actif'
    };
    setEmployees([...employees, newEmployee]);
    setShowEmployeeModal(false);
  };

  const handleAddProduction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const woodType = formData.get('woodType') as string;
    const quantity = Number(formData.get('quantity'));

    const newProd: Production = {
      id: Math.random().toString(36).substring(2, 9),
      woodType,
      quantity,
      source: formData.get('source') as string,
      destination: formData.get('destination') as string,
      date: new Date().toISOString()
    };

    setProductions([newProd, ...productions]);
    
    // Update stock automatically when production is recorded
    const existing = stocks.find(s => s.type === woodType);
    if (existing) {
      setStocks(stocks.map(s => s.id === existing.id ? { ...s, quantity: s.quantity + quantity } : s));
    }

    setShowProductionModal(false);
  };

  const handleUpdateDeliveryStatus = (id: string, status: 'en attente' | 'livré') => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, status } : d));
  };

  const handleMarkAsPaid = (saleId: string) => {
    const sale = sales.find(s => s.id === saleId);
    if (!sale || sale.paymentStatus === 'paid') return;

    setSales(sales.map(s => s.id === saleId ? { ...s, paymentStatus: 'paid' } : s));
    
    if (sale.clientId) {
      setClients(clients.map(c => c.id === sale.clientId ? {
        ...c,
        debt: Math.max(0, (c.debt || 0) - sale.total)
      } : c));
    }
  };

  const COLORS = ['#059669', '#10b981', '#34d399', '#d97706', '#b45309', '#451a03'];

  // --- Renderers ---

  const renderDashboard = () => (
    <div className="space-y-8 pb-20">
      {/* Quick Action Bar */}
      <div className="flex flex-wrap gap-4">
        <button 
          onClick={() => setShowSaleModal(true)} 
          className="flex-1 min-w-[150px] bg-emerald-600 hover:bg-emerald-500 text-white p-6 rounded-3xl shadow-xl shadow-emerald-900/20 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Plus size={24} strokeWidth={3} />
          </div>
          <span className="font-black text-sm uppercase tracking-widest">Vente Rapide</span>
        </button>
        
        <button 
          onClick={() => setShowStockModal(true)} 
          className="flex-1 min-w-[150px] bg-slate-800 hover:bg-slate-700 text-white p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Package size={24} className="text-emerald-400" />
          </div>
          <span className="font-black text-sm uppercase tracking-widest">Ajouter Stock</span>
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-8 flex flex-col justify-between border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <DollarSign size={20} className="text-emerald-400" />
            </div>
            <span className="text-xs font-black text-emerald-500/70 uppercase tracking-widest">Argent Encaissé</span>
          </div>
          <div>
            <div className="text-4xl font-black text-white mb-1">
              {stats.todayCash.toLocaleString()} <span className="text-lg text-emerald-500/50">Ar</span>
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Aujourd'hui (Payé)</p>
          </div>
        </div>

        <div className="glass-card p-8 flex flex-col justify-between border-blue-500/20 bg-blue-500/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Package size={20} className="text-blue-400" />
            </div>
            <span className="text-xs font-black text-blue-500/70 uppercase tracking-widest">Bois Vendu</span>
          </div>
          <div>
            <div className="text-4xl font-black text-white mb-1">
              {stats.todayVolume.toLocaleString()} <span className="text-lg text-blue-500/50">m</span>
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Aujourd'hui</p>
          </div>
        </div>

        <div className="glass-card p-8 flex flex-col justify-between border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-400" />
            </div>
            <span className="text-xs font-black text-red-500/70 uppercase tracking-widest">Stock Critique</span>
          </div>
          <div>
            <div className="text-4xl font-black text-white mb-1">
              {stats.criticalStocks.length} <span className="text-lg text-red-500/50">Alertes</span>
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Action requise</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Graph */}
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              Évolution des Ventes (7j)
            </h3>
          </div>
          <div className="p-6 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.last7Days}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Critical Stock List */}
        <div className="glass-card flex flex-col">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-400" />
              Alertes Stock
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[300px]">
            {stats.criticalStocks.map(s => (
              <div key={s.id} className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center justify-between group hover:bg-red-500/10 transition-all">
                <div>
                  <h4 className="text-sm font-bold text-white">{s.type}</h4>
                  <p className="text-[10px] text-red-400 font-black uppercase tracking-tighter">Reste: {s.quantity} m</p>
                </div>
                <button 
                  onClick={() => {
                    // Pre-fill stock modal logic could go here
                    setShowStockModal(true);
                  }}
                  className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform"
                >
                  <Plus size={16} />
                </button>
              </div>
            ))}
            {stats.criticalStocks.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 py-10">
                <CheckCircle size={32} className="text-emerald-500/30 mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">Tout est OK</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Deliveries */}
        <div className="glass-card flex flex-col">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              Bois le plus Rentable
            </h3>
          </div>
          <div className="p-8 flex flex-col items-center justify-center text-center flex-1">
            {stats.mostProfitable ? (
              <>
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
                  <Trees size={40} className="text-emerald-400" />
                </div>
                <h4 className="text-2xl font-black text-white mb-1">{stats.mostProfitable.type}</h4>
                <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest">
                  Tombony: {stats.mostProfitable.profit.toLocaleString()} Ar
                </p>
              </>
            ) : (
              <p className="text-slate-500 italic text-sm">Pas encore de données</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Deliveries */}
        <div className="glass-card">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Truck size={16} className="text-blue-400" />
              Livraisons en cours
            </h3>
            <button onClick={() => setActiveTab('stock')} className="text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:underline">Voir tout</button>
          </div>
          <div className="p-4 space-y-3">
            {deliveries.filter(d => d.status === 'en attente').slice(0, 4).map(d => (
              <div key={d.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Package size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{d.clientName}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{d.destination}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button 
                    onClick={() => handleUpdateDeliveryStatus(d.id, 'livré')}
                    className="px-2 py-1 bg-amber-500/20 text-amber-400 text-[8px] font-black uppercase rounded-full hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors"
                  >
                    En attente
                  </button>
                  <span className="text-[10px] text-slate-500">{format(parseISO(d.date), 'dd MMM')}</span>
                </div>
              </div>
            ))}
            {deliveries.filter(d => d.status === 'en attente').length === 0 && (
              <div className="py-10 text-center text-slate-500 italic text-sm">Aucune livraison en attente</div>
            )}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="glass-card">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <ShoppingBag size={16} className="text-emerald-400" />
              Ventes Récentes
            </h3>
            <button onClick={() => setActiveTab('finance')} className="text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:underline">Voir tout</button>
          </div>
          <div className="p-4 space-y-3">
            {sales.slice(0, 4).map(s => (
              <div key={s.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <DollarSign size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{s.woodType}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{s.clientName || 'Client Comptant'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-emerald-400">+{s.total.toLocaleString()} Ar</div>
                  <div className="text-[10px] text-slate-500">{format(parseISO(s.date), 'dd MMM')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderShop = () => (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold text-white">Vente en Ligne - Boutique SOAVA</h3>
        <p className="text-slate-400 text-sm">Sélectionnez vos produits et commandez directement.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stocks.map(s => (
          <motion.div 
            key={s.id} 
            whileHover={{ y: -5 }}
            className="glass-card group flex flex-col h-full border-white/5 hover:border-emerald-500/30 transition-all duration-300"
          >
            <PlankDiagram type={s.type} />
            
            <div className="mt-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-white text-lg leading-tight">{s.type}</h4>
                {s.quantity <= s.minThreshold && (
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded uppercase">Rupture</span>
                )}
              </div>
              
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-black text-emerald-400">{s.sellPrice.toLocaleString()}</span>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Ar / Unité</span>
              </div>

              <div className="mt-auto space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Disponibilité:</span>
                  <span className={`font-bold ${s.quantity > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {s.quantity > 0 ? `${s.quantity} en stock` : 'Indisponible'}
                  </span>
                </div>
                
                <button 
                  disabled={s.quantity <= 0}
                  onClick={() => {
                    setSelectedProductForSale(s.id);
                    setShowSaleModal(true);
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    s.quantity > 0 
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag size={18} />
                  Commander
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderStock = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Package size={24} className="text-emerald-400" />
          Fitantanana Stock
        </h3>
        <button onClick={() => setShowStockModal(true)} className="btn-primary">
          <Plus size={18} />
          Hampiditra Stock
        </button>
      </div>

      {/* Stock Graph Section */}
      <div className="glass-card">
        <h3 className="text-sm font-bold text-slate-300 mb-6 flex items-center gap-2">
          <BarChart3 size={16} className="text-emerald-400" />
          Sary an-tsary ny Stock (Graphique)
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.stockBarData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10 }} 
                angle={-45}
                textAnchor="end"
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px' }} />
              <Bar dataKey="quantité" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} name="Quantité Actuelle" />
              <Bar dataKey="seuil" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} name="Seuil Critique" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stocks.map(s => (
          <div key={s.id} className="glass-card relative overflow-hidden">
            {/* Visual Indicator Bar */}
            <div 
              className={`absolute top-0 left-0 h-1 transition-all duration-500 ${
                s.quantity <= s.minThreshold ? 'bg-red-500 w-full' : 
                s.quantity <= s.minThreshold * 2 ? 'bg-amber-500 w-2/3' : 'bg-emerald-500 w-1/3'
              }`} 
            />
            
            <div className="flex justify-between items-center mb-4 mt-2">
              <span className="text-lg font-bold text-white">{s.type}</span>
              <Package className={s.quantity <= s.minThreshold ? "text-red-500" : "text-emerald-500"} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Quantité:</span>
                <span className="text-white font-bold">{s.quantity} m</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Prix Achat:</span>
                <span className="text-slate-300 font-medium">{s.buyPrice.toLocaleString()} Ar</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Prix Vente:</span>
                <span className="text-emerald-400 font-bold">{s.sellPrice.toLocaleString()} Ar</span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-white/5">
                <span className="text-slate-500 italic">Marge:</span>
                <span className="text-emerald-500/70 font-bold">{(s.sellPrice - s.buyPrice).toLocaleString()} Ar</span>
              </div>
              {s.quantity <= s.minThreshold && (
                <div className="flex items-center gap-2 text-xs text-red-400 mt-2 bg-red-400/10 p-2 rounded-lg">
                  <AlertTriangle size={12} />
                  Stock ambany dia ambany!
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProduction = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Production Anaty Ala</h3>
        <button onClick={() => setShowProductionModal(true)} className="btn-primary">
          <Plus size={18} />
          Hampiditra Production
        </button>
      </div>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-500 border-b border-white/5">
              <th className="pb-4">Daty</th>
              <th className="pb-4">Produit</th>
              <th className="pb-4">Quantité</th>
              <th className="pb-4">Loharano</th>
              <th className="pb-4">Tanjona</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {productions.map(p => (
              <tr key={p.id} className="text-slate-300">
                <td className="py-4">{format(parseISO(p.date), 'dd/MM/yyyy HH:mm')}</td>
                <td className="py-4 font-bold">{p.woodType}</td>
                <td className="py-4">{p.quantity} m³</td>
                <td className="py-4">{p.source}</td>
                <td className="py-4">{p.destination}</td>
              </tr>
            ))}
            {productions.length === 0 && (
              <tr><td colSpan={5} className="py-20 text-center text-slate-500 italic">Aucune production enregistrée</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFinance = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Miditra" value={stats.totalRevenue} unit="Ar" icon={DollarSign} colorClass="bg-emerald-600" />
        <StatCard title="Total Mivoaka" value={stats.totalExpenses} unit="Ar" icon={TrendingUp} colorClass="bg-red-600" />
        <StatCard title="Total Cash (Balance)" value={stats.totalCash} unit="Ar" icon={DollarSign} colorClass="bg-emerald-600" />
        <StatCard title="Dette Client (Crédit)" value={stats.totalDebt} unit="Ar" icon={AlertTriangle} colorClass="bg-amber-600" />
      </div>

      {/* Profitability Chart */}
      <div className="glass-card">
        <h3 className="text-sm font-bold text-slate-300 mb-6 flex items-center gap-2">
          <TrendingUp size={16} className="text-emerald-400" />
          Fivoaran'ny Tombony (Rentabilité)
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.financeChartData}>
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                formatter={(value: number) => [`${value.toLocaleString()} Ar`, '']}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorProfit)" 
                name="Miditra (Revenue)"
              />
              <Area 
                type="monotone" 
                dataKey="expense" 
                stroke="#ef4444" 
                fillOpacity={1} 
                fill="url(#colorExpense)" 
                name="Mivoaka (Expenses)"
              />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stroke="#3b82f6" 
                fill="transparent" 
                name="Tombony (Profit)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Dépenses (Vola Mivoaka)</h3>
        <button onClick={() => setShowExpenseModal(true)} className="btn-primary">
          <Plus size={18} />
          Hampiditra Dépense
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-500 border-b border-white/5">
              <th className="pb-4">Daty</th>
              <th className="pb-4">Description</th>
              <th className="pb-4">Catégorie</th>
              <th className="pb-4 text-right">Sanda</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {expenses.map(e => (
              <tr key={e.id} className="text-slate-300">
                <td className="py-4">{format(parseISO(e.date), 'dd/MM/yyyy')}</td>
                <td className="py-4">{e.description}</td>
                <td className="py-4 capitalize">{e.category}</td>
                <td className="py-4 text-right font-bold text-red-400">{e.amount.toLocaleString()} Ar</td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr><td colSpan={4} className="py-8 text-center text-slate-500 italic">Aucune dépense</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center pt-6">
        <h3 className="text-xl font-bold text-white">Ventes (Vola Miditra)</h3>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-500 border-b border-white/5">
              <th className="pb-4">Daty</th>
              <th className="pb-4">Produit</th>
              <th className="pb-4">Quantité</th>
              <th className="pb-4">Client</th>
              <th className="pb-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sales.map(s => (
              <tr key={s.id} className="text-slate-300">
                <td className="py-4">{format(parseISO(s.date), 'dd/MM/yyyy')}</td>
                <td className="py-4 font-bold">{s.woodType}</td>
                <td className="py-4">{s.quantity}</td>
                <td className="py-4">{s.clientName || '-'}</td>
                <td className="py-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-emerald-400">{s.total.toLocaleString()} Ar</span>
                    {s.paymentStatus === 'credit' ? (
                      <button 
                        onClick={() => handleMarkAsPaid(s.id)}
                        className="text-[8px] font-black text-red-400 uppercase tracking-widest hover:text-emerald-400 transition-colors"
                      >
                        Marquer comme payé
                      </button>
                    ) : (
                      <span className="text-[8px] font-black text-emerald-500/50 uppercase tracking-widest">Payé</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr><td colSpan={5} className="py-8 text-center text-slate-500 italic">Aucune vente</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Fitantanana Client</h3>
        <button onClick={() => setShowClientModal(true)} className="btn-primary">
          <Plus size={18} />
          Hampiditra Client
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map(c => (
          <div key={c.id} className="glass-card flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/10 p-3 rounded-full">
                  <Users className="text-emerald-400" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white">{c.name}</h4>
                  <p className="text-xs text-slate-400">{c.phone || 'Pas de téléphone'}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedClientForHistory(c)}
                className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors"
              >
                <History size={18} />
              </button>
            </div>
            
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Total Achats:</span>
                <span className="text-emerald-400 font-bold">{c.totalPurchases.toLocaleString()} Ar</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Dette (Crédit):</span>
                <span className={`font-bold ${c.debt > 0 ? 'text-red-400' : 'text-slate-400'}`}>{c.debt?.toLocaleString() || 0} Ar</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Dernier Achat:</span>
                <span className="text-slate-300">{c.lastPurchaseDate ? format(parseISO(c.lastPurchaseDate), 'dd/MM/yyyy') : 'Aucun'}</span>
              </div>
            </div>
            
            {c.notes && (
              <div className="bg-white/5 p-3 rounded-xl">
                <p className="text-[10px] text-slate-400 italic">"{c.notes}"</p>
              </div>
            )}
          </div>
        ))}
        {clients.length === 0 && (
          <div className="col-span-full py-20 text-center glass-card border-dashed">
            <Users size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500 italic">Aucun client enregistré. Commencez par en ajouter un !</p>
          </div>
        )}
      </div>

      {/* Client Purchase History Modal */}
      <AnimatePresence>
        {selectedClientForHistory && (
          <Modal title={`Historique: ${selectedClientForHistory.name}`} onClose={() => setSelectedClientForHistory(null)}>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {sales.filter(s => s.clientId === selectedClientForHistory.id).length > 0 ? (
                sales.filter(s => s.clientId === selectedClientForHistory.id).map(s => (
                  <div key={s.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-500">{format(parseISO(s.date), 'dd/MM/yyyy')}</p>
                      <p className="font-bold text-white">{s.woodType}</p>
                      <p className="text-xs text-slate-400">{s.quantity} Planches</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-emerald-400">{s.total.toLocaleString()} Ar</p>
                      <p className={`text-[8px] font-black uppercase tracking-widest ${s.paymentStatus === 'credit' ? 'text-red-400' : 'text-emerald-500/50'}`}>
                        {s.paymentStatus === 'credit' ? 'Crédit' : 'Payé'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-10 text-slate-500 italic">Aucun achat trouvé pour ce client.</p>
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );

  const renderEmployees = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Fitantanana Mpiasa</h3>
        <button onClick={() => setShowEmployeeModal(true)} className="btn-primary">
          <Plus size={18} />
          Hampiditra Mpiasa
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map(e => (
          <div key={e.id} className="glass-card flex items-center gap-4">
            <div className="bg-white/5 p-3 rounded-full">
              <Users className="text-blue-400" size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white">{e.name}</h4>
              <p className="text-xs text-slate-400">{e.role}</p>
              <p className="text-sm font-bold text-emerald-400 mt-1">{e.salary.toLocaleString()} Ar / volana</p>
            </div>
            <div className={`w-2 h-2 rounded-full ${e.status === 'actif' ? 'bg-emerald-500' : 'bg-red-500'}`} />
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrices = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Lisitry ny Vidiny</h3>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-500 border-b border-white/5">
              <th className="pb-4">Produit</th>
              <th className="pb-4">Vidiny Vidiana</th>
              <th className="pb-4">Vidiny Amidy</th>
              <th className="pb-4">Tombony</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {stocks.map(s => (
              <tr key={s.id} className="text-slate-300">
                <td className="py-4 font-bold">{s.type}</td>
                <td className="py-4">{s.buyPrice.toLocaleString()} Ar</td>
                <td className="py-4 text-emerald-400 font-bold">{s.sellPrice.toLocaleString()} Ar</td>
                <td className="py-4 text-blue-400">{(s.sellPrice - s.buyPrice).toLocaleString()} Ar</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8 max-w-2xl">
      <div className="glass-card space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Settings size={20} className="text-blue-400" />
          Sécurité & Accès
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Code d'accès actuel</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={savedAccessCode}
                onChange={(e) => {
                  const newCode = e.target.value;
                  setSavedAccessCode(newCode);
                  localStorage.setItem('soava_access_code', newCode);
                }}
                className="input-field font-mono tracking-widest"
                placeholder="Nouveau code"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-2 italic">
              Attention: Ce code sera demandé lors de la prochaine connexion.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Share2 size={20} className="text-purple-400" />
          Partage de l'Application
        </h3>
        <p className="text-sm text-slate-400">
          Partagez ce lien avec vos amis ou collaborateurs pour qu'ils puissent accéder à l'application.
        </p>
        <button 
          onClick={handleShare}
          className="flex items-center justify-center gap-3 w-full p-4 bg-purple-600/10 border border-purple-600/20 rounded-2xl text-purple-400 hover:bg-purple-600/20 transition-all"
        >
          <Share2 size={20} />
          <div className="text-left">
            <div className="font-bold text-sm">Partager le lien</div>
            <div className="text-[10px] opacity-70">Copier ou envoyer le lien public</div>
          </div>
        </button>
      </div>

      <div className="glass-card space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={handleBackup}
            className="flex items-center justify-center gap-3 p-4 bg-blue-600/10 border border-blue-600/20 rounded-2xl text-blue-400 hover:bg-blue-600/20 transition-all"
          >
            <Download size={20} />
            <div className="text-left">
              <div className="font-bold text-sm">Exporter (Backup)</div>
              <div className="text-[10px] opacity-70">Télécharger les données .json</div>
            </div>
          </button>
          
          <label className="flex items-center justify-center gap-3 p-4 bg-emerald-600/10 border border-emerald-600/20 rounded-2xl text-emerald-400 hover:bg-emerald-600/20 transition-all cursor-pointer">
            <Upload size={20} />
            <div className="text-left">
              <div className="font-bold text-sm">Importer (Restore)</div>
              <div className="text-[10px] opacity-70">Restaurer depuis un fichier</div>
            </div>
            <input type="file" accept=".json" onChange={handleRestore} className="hidden" />
          </label>
        </div>
      </div>

      <div className="glass-card border-red-500/20 bg-red-500/5">
        <h3 className="text-lg font-bold text-red-400 flex items-center gap-2 mb-4">
          <AlertTriangle size={20} />
          Zone de Danger
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          La réinitialisation supprimera définitivement toutes les données (stocks, ventes, dépenses, employés). Cette action est irréversible.
        </p>
        <button 
          onClick={() => setShowResetConfirm(true)}
          className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all"
        >
          Réinitialiser l'Application
        </button>
      </div>

      <div className="text-center pt-4">
        <p className="text-[10px] text-emerald-900/40 uppercase tracking-[0.3em] font-black">SOCIÉTÉ SOAVA - Gestion Forestière v2.1</p>
      </div>
    </div>
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === savedAccessCode) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('soava_auth', 'true');
      } catch (e) {
        // Ignore if storage is blocked
      }
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleBackup = () => {
    const data = {
      stocks,
      sales,
      deliveries,
      expenses,
      employees,
      productions,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_soava_${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareUrl = "https://ais-pre-5w3yrrwqma423suquepmwm-685192775212.europe-west2.run.app";
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'SOCIÉTÉ SOAVA',
          text: 'Gestion de Stock & Finance - SOCIÉTÉ SOAVA',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Lien copié dans le presse-papiers !");
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.stocks) setStocks(data.stocks);
        if (data.sales) setSales(data.sales);
        if (data.deliveries) setDeliveries(data.deliveries);
        if (data.expenses) setExpenses(data.expenses);
        if (data.employees) setEmployees(data.employees);
        if (data.productions) setProductions(data.productions);
        // Use custom modal instead of alert if possible, but for now alert is fine for simplicity
        // Actually, I'll just use a state to show success
      } catch (err) {
        console.error('Restore error:', err);
      }
    };
    reader.readAsText(file);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6 relative overflow-hidden">
        {/* Background Image from Photo Atmosphere */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/soava-forest-bg/1920/1080" 
            alt="Forest Background" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-emerald-900/20"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card w-full max-w-md p-8 text-center space-y-8 relative z-10"
        >
          <div className="flex flex-col items-center gap-6">
            <Logo size={120} showText={true} variant="clean" className="shadow-2xl" />
            <p className="text-slate-500 text-sm font-medium">Ampidiro ny kaody hidirana amin'ny application</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <input 
                type="password" 
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Kaody d'accès" 
                className={`input-field text-center text-lg tracking-widest ${loginError ? 'border-red-500/50 bg-red-500/5' : ''}`}
                required
              />
              {loginError && (
                <p className="text-red-400 text-xs font-medium">Kaody diso! Avereno indray azafady.</p>
              )}
            </div>
            <button type="submit" className="btn-primary w-full py-4 text-lg font-bold">
              Hiditra
            </button>
          </form>

          <div className="pt-4 border-t border-white/5">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Gestion de Stock & Finance v2.0</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black/40 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-6">
        <Logo size={32} showText={true} />
        <div className="flex items-center gap-2">
          <button 
            onClick={handleBackup}
            className="text-blue-400 p-2"
          >
            <Download size={20} />
          </button>
          <button 
            onClick={() => {
              sessionStorage.removeItem('soava_auth');
              setIsAuthenticated(false);
            }}
            className="text-slate-400 p-2"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-64 bg-emerald-950/40 backdrop-blur-xl border-r border-white/5 p-6 hidden md:flex flex-col gap-8 relative overflow-hidden">
        {/* Subtle wood texture overlay for sidebar */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ 
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")',
            backgroundSize: 'cover'
          }}
        ></div>
        
        <div className="flex justify-center relative z-10">
          <Logo size={48} showText={true} />
        </div>

        <nav className="flex flex-col gap-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={ShoppingBag} label="Boutique" active={activeTab === 'shop'} onClick={() => setActiveTab('shop')} />
          <SidebarItem icon={Package} label="Stock" active={activeTab === 'stock'} onClick={() => setActiveTab('stock')} />
          <SidebarItem icon={BarChart3} label="Production" active={activeTab === 'production'} onClick={() => setActiveTab('production')} />
          <SidebarItem icon={DollarSign} label="Finance" active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} />
          <SidebarItem icon={Users} label="Clients" active={activeTab === 'clients'} onClick={() => setActiveTab('clients')} />
          <SidebarItem icon={Users} label="Employés" active={activeTab === 'employees'} onClick={() => setActiveTab('employees')} />
          <SidebarItem icon={Tag} label="Produits & Prix" active={activeTab === 'prices'} onClick={() => setActiveTab('prices')} />
          <SidebarItem icon={Settings} label="Paramètres" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="mt-auto space-y-2">
          <button 
            onClick={handleBackup}
            className="sidebar-item w-full text-emerald-400 hover:bg-emerald-400/10"
          >
            <Download size={20} />
            <span className="text-sm font-medium">Sauvegarde (Backup)</span>
          </button>
          <label className="sidebar-item w-full text-emerald-400 hover:bg-emerald-400/10 cursor-pointer">
            <Upload size={20} />
            <span className="text-sm font-medium">Restaurer (Import)</span>
            <input 
              type="file" 
              accept=".json" 
              onChange={handleRestore} 
              className="hidden" 
            />
          </label>
          <button 
            onClick={() => {
              sessionStorage.removeItem('soava_auth');
              setIsAuthenticated(false);
            }}
            className="sidebar-item w-full text-red-400 hover:bg-red-400/10"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Hivoaka</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto pt-24 md:pt-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {activeTab === 'dashboard' && 'Tableau de Bord'}
              {activeTab === 'shop' && 'Boutique en Ligne'}
              {activeTab === 'stock' && 'Fitantanana Stock'}
              {activeTab === 'production' && 'Production Anaty Ala'}
              {activeTab === 'finance' && 'Fitantanana Vola'}
              {activeTab === 'clients' && 'Fitantanana Client'}
              {activeTab === 'employees' && 'Fitantanana Mpiasa'}
              {activeTab === 'prices' && 'Vidiny & Produits'}
              {activeTab === 'settings' && 'Paramètres Système'}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-emerald-500/50 font-black uppercase tracking-wider">SOCIÉTÉ SOAVA</span>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="flex items-center gap-3 mr-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Directeur Général</span>
                <span className="text-sm font-bold text-white">Fanoh</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black">
                F
              </div>
            </div>
            <button onClick={() => setShowSaleModal(true)} className="btn-primary flex-1 md:flex-none justify-center">
              <Plus size={18} />
              Vente Rapide
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'shop' && renderShop()}
        {activeTab === 'stock' && renderStock()}
        {activeTab === 'production' && renderProduction()}
        {activeTab === 'finance' && renderFinance()}
        {activeTab === 'clients' && renderClients()}
        {activeTab === 'employees' && renderEmployees()}
        {activeTab === 'prices' && renderPrices()}
        {activeTab === 'settings' && renderSettings()}
      </main>

      {/* Mobile Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-t border-white/5 z-50 flex items-center justify-around px-2">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-emerald-500' : 'text-slate-500'}`}>
          <LayoutDashboard size={20} />
          <span className="text-[10px]">Home</span>
        </button>
        <button onClick={() => setActiveTab('shop')} className={`flex flex-col items-center gap-1 ${activeTab === 'shop' ? 'text-emerald-500' : 'text-slate-500'}`}>
          <ShoppingBag size={20} />
          <span className="text-[10px]">Boutique</span>
        </button>
        <button onClick={() => setActiveTab('stock')} className={`flex flex-col items-center gap-1 ${activeTab === 'stock' ? 'text-emerald-500' : 'text-slate-500'}`}>
          <Package size={20} />
          <span className="text-[10px]">Stock</span>
        </button>
        <button onClick={() => setActiveTab('finance')} className={`flex flex-col items-center gap-1 ${activeTab === 'finance' ? 'text-emerald-500' : 'text-slate-500'}`}>
          <DollarSign size={20} />
          <span className="text-[10px]">Vola</span>
        </button>
        <button onClick={() => setActiveTab('clients')} className={`flex flex-col items-center gap-1 ${activeTab === 'clients' ? 'text-emerald-500' : 'text-slate-500'}`}>
          <Users size={20} />
          <span className="text-[10px]">Clients</span>
        </button>
      </nav>

      {/* Sale Modal */}
      <AnimatePresence>
        {showSaleModal && (
          <Modal title="Nouvelle Vente" onClose={() => { setShowSaleModal(false); setSelectedProductForSale(null); }}>
            <form onSubmit={handleAddSale} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Produit</label>
                <select name="woodId" className="input-field" required defaultValue={selectedProductForSale || ""}>
                  <option value="" disabled>Sélectionner un produit</option>
                  {stocks.map(s => (
                    <option key={s.id} value={s.id} className="bg-[#1e293b]">{s.type} ({s.quantity} dispo)</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Quantité</label>
                  <input name="quantity" type="number" className="input-field" placeholder="0" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Date</label>
                  <input name="date" type="date" className="input-field" defaultValue={new Date().toISOString().split('T')[0]} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Statut Paiement</label>
                  <select name="paymentStatus" className="input-field" required>
                    <option value="paid" className="bg-[#1e293b]">Payé (Cash)</option>
                    <option value="credit" className="bg-[#1e293b]">Crédit (Dette)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Livraison (Optionnel)</label>
                  <input name="destination" type="text" className="input-field" placeholder="Destination" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Client</label>
                <div className="flex gap-2">
                  <select name="clientId" className="input-field flex-1" onChange={(e) => {
                    const client = clients.find(c => c.id === e.target.value);
                    if (client) {
                      const nameInput = document.querySelector('input[name="clientName"]') as HTMLInputElement;
                      if (nameInput) nameInput.value = client.name;
                    }
                  }}>
                    <option value="">Nouveau / Anonyme</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id} className="bg-[#1e293b]">{c.name}</option>
                    ))}
                  </select>
                  <input name="clientName" type="text" className="input-field flex-1" placeholder="Nom du client" />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-3 mt-4">
                Enregistrer la vente
              </button>
            </form>
          </Modal>
        )}

        {showStockModal && (
          <Modal title="Hampiditra Stock" onClose={() => setShowStockModal(false)}>
            <form onSubmit={handleAddStock} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Type de Bois</label>
                <input name="type" type="text" className="input-field" placeholder="Ex: Planche 1er" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Quantité</label>
                  <input name="quantity" type="number" className="input-field" placeholder="0" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Seuil Alerte</label>
                  <input name="minThreshold" type="number" className="input-field" defaultValue="20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Prix Achat (Ar)</label>
                  <input name="buyPrice" type="number" className="input-field" placeholder="0" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Prix Vente (Ar)</label>
                  <input name="sellPrice" type="number" className="input-field" placeholder="0" required />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-3 mt-4">
                Hampiditra ao amin'ny Stock
              </button>
            </form>
          </Modal>
        )}

        {showExpenseModal && (
          <Modal title="Hampiditra Dépense" onClose={() => setShowExpenseModal(false)}>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Description</label>
                <input name="description" type="text" className="input-field" placeholder="Ex: Frais Transport" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Sanda (Ar)</label>
                  <input name="amount" type="number" className="input-field" placeholder="0" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Catégorie</label>
                  <select name="category" className="input-field">
                    <option value="achat" className="bg-[#1e293b]">Achat</option>
                    <option value="transport" className="bg-[#1e293b]">Transport</option>
                    <option value="autre" className="bg-[#1e293b]">Autre</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-3 mt-4">
                Enregistrer la dépense
              </button>
            </form>
          </Modal>
        )}

        {showEmployeeModal && (
          <Modal title="Hampiditra Mpiasa" onClose={() => setShowEmployeeModal(false)}>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Anarana</label>
                <input name="name" type="text" className="input-field" placeholder="Anarana feno" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Andraikitra (Role)</label>
                <input name="role" type="text" className="input-field" placeholder="Ex: Scieur" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Karama (Ar / volana)</label>
                <input name="salary" type="number" className="input-field" placeholder="0" required />
              </div>
              <button type="submit" className="btn-primary w-full py-3 mt-4">
                Hampiditra Mpiasa
              </button>
            </form>
          </Modal>
        )}

        {showClientModal && (
          <Modal title="Hampiditra Client" onClose={() => setShowClientModal(false)}>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Anarana</label>
                <input name="name" type="text" className="input-field" placeholder="Anarana feno" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Téléphone</label>
                <input name="phone" type="text" className="input-field" placeholder="Laharana finday" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Addresse</label>
                <input name="address" type="text" className="input-field" placeholder="Addresse" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Fanamarihana (Notes)</label>
                <textarea name="notes" className="input-field h-24 resize-none" placeholder="Special notes..."></textarea>
              </div>
              <button type="submit" className="btn-primary w-full py-3 mt-4">
                Hampiditra Client
              </button>
            </form>
          </Modal>
        )}

        {showProductionModal && (
          <Modal title="Hampiditra Production" onClose={() => setShowProductionModal(false)}>
            <form onSubmit={handleAddProduction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Type de Bois</label>
                <select name="woodType" className="input-field" required>
                  {stocks.map(s => (
                    <option key={s.id} value={s.type} className="bg-[#1e293b]">{s.type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Quantité (m³)</label>
                <input name="quantity" type="number" className="input-field" placeholder="0" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Loharano (Source)</label>
                  <input name="source" type="text" className="input-field" placeholder="Ala" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Tanjona (Dest.)</label>
                  <input name="destination" type="text" className="input-field" placeholder="Tanana" required />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-3 mt-4">
                Enregistrer la production
              </button>
            </form>
          </Modal>
        )}

        {showResetConfirm && (
          <Modal title="Confirmation" onClose={() => setShowResetConfirm(false)}>
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="p-4 bg-red-500/10 rounded-full text-red-500">
                  <AlertTriangle size={40} />
                </div>
                <p className="text-slate-300">
                  Êtes-vous absolument sûr de vouloir supprimer toutes les données ? Cette action est définitive.
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3 bg-white/5 text-slate-300 rounded-xl font-bold hover:bg-white/10 transition-all"
                >
                  Annuler
                </button>
                <button 
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
                >
                  Oui, Supprimer
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Helper Components ---

const Modal = ({ title, children, onClose }: any) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
  >
    <motion.div 
      initial={{ y: 100, scale: 0.95 }}
      animate={{ y: 0, scale: 1 }}
      exit={{ y: 100, scale: 0.95 }}
      className="bg-[#1e293b] w-full max-w-md rounded-[32px] p-6 shadow-2xl border border-white/10"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-slate-400">
          <X size={20} />
        </button>
      </div>
      {children}
    </motion.div>
  </motion.div>
);
