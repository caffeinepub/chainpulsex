import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";

export interface UserState {
  isLoggedIn: boolean;
  username: string;
  email: string;
  role: "user" | "admin";
  points: number;
  streak: number;
  lastLoginDate: string | null;
  claimedToday: boolean;
  referralCode: string;
  totalEarned: number;
  dailyEarned: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  category: string;
}

export interface DepositRequest {
  id: string;
  userId: string;
  network: string;
  amount: number;
  txHash: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  referenceId: string;
  createdAt: string;
}

export interface WithdrawRequest {
  id: string;
  userId: string;
  amount: number;
  walletAddress: string;
  network: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

interface AppContextType {
  user: UserState;
  tasks: Task[];
  deposits: DepositRequest[];
  withdrawals: WithdrawRequest[];
  login: (username: string, role?: "user" | "admin") => void;
  logout: () => void;
  claimDailyReward: () => number;
  completeTask: (taskId: string) => void;
  addDeposit: (
    deposit: Omit<DepositRequest, "id" | "userId" | "createdAt">,
  ) => void;
  addWithdrawal: (
    withdrawal: Omit<WithdrawRequest, "id" | "userId" | "createdAt">,
  ) => void;
  approveDeposit: (id: string) => void;
  rejectDeposit: (id: string) => void;
  approveWithdrawal: (id: string) => void;
  rejectWithdrawal: (id: string) => void;
}

const defaultTasks: Task[] = [
  {
    id: "t1",
    title: "Verify Email",
    description: "Confirm your email address",
    points: 100,
    completed: false,
    category: "profile",
  },
  {
    id: "t2",
    title: "Complete Profile",
    description: "Fill in all profile details",
    points: 50,
    completed: false,
    category: "profile",
  },
  {
    id: "t3",
    title: "Explore 5 Tokens",
    description: "View details of 5 different tokens",
    points: 30,
    completed: false,
    category: "activity",
  },
  {
    id: "t4",
    title: "Add to Watchlist",
    description: "Add a token to your watchlist",
    points: 20,
    completed: false,
    category: "activity",
  },
  {
    id: "t5",
    title: "View Charts",
    description: "Open the charts page",
    points: 15,
    completed: false,
    category: "activity",
  },
  {
    id: "t6",
    title: "Make First Deposit",
    description: "Complete your first deposit",
    points: 200,
    completed: false,
    category: "finance",
  },
];

const defaultDeposits: DepositRequest[] = [
  {
    id: "d1",
    userId: "user1",
    network: "TRC20",
    amount: 50,
    txHash: "abc123xyz",
    status: "PENDING",
    referenceId: "CPX12345678",
    createdAt: "2026-03-20T10:00:00Z",
  },
  {
    id: "d2",
    userId: "user2",
    network: "BEP20",
    amount: 100,
    txHash: "def456uvw",
    status: "CONFIRMED",
    referenceId: "CPX87654321",
    createdAt: "2026-03-21T15:00:00Z",
  },
];

const defaultWithdrawals: WithdrawRequest[] = [
  {
    id: "w1",
    userId: "user1",
    amount: 10,
    walletAddress: "THS4eZw4...zRH",
    network: "TRC20",
    status: "PENDING",
    createdAt: "2026-03-22T09:00:00Z",
  },
];

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserState>({
    isLoggedIn: false,
    username: "",
    email: "",
    role: "user",
    points: 0,
    streak: 0,
    lastLoginDate: null,
    claimedToday: false,
    referralCode: "",
    totalEarned: 0,
    dailyEarned: 0,
  });

  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [deposits, setDeposits] = useState<DepositRequest[]>(defaultDeposits);
  const [withdrawals, setWithdrawals] =
    useState<WithdrawRequest[]>(defaultWithdrawals);

  const login = useCallback(
    (username: string, role: "user" | "admin" = "user") => {
      const code = `CPX${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setUser({
        isLoggedIn: true,
        username,
        email: `${username.toLowerCase()}@example.com`,
        role,
        points: role === "admin" ? 99999 : 1250,
        streak: 5,
        lastLoginDate: null,
        claimedToday: false,
        referralCode: code,
        totalEarned: role === "admin" ? 99999 : 1250,
        dailyEarned: 0,
      });
    },
    [],
  );

  const logout = useCallback(() => {
    setUser({
      isLoggedIn: false,
      username: "",
      email: "",
      role: "user",
      points: 0,
      streak: 0,
      lastLoginDate: null,
      claimedToday: false,
      referralCode: "",
      totalEarned: 0,
      dailyEarned: 0,
    });
    setTasks(defaultTasks);
  }, []);

  const claimDailyReward = useCallback(() => {
    const reward = Math.floor(Math.random() * 130) + 20;
    setUser((prev) => ({
      ...prev,
      points: prev.points + reward,
      totalEarned: prev.totalEarned + reward,
      dailyEarned: prev.dailyEarned + reward,
      claimedToday: true,
      streak: prev.streak + 1,
      lastLoginDate: new Date().toDateString(),
    }));
    return reward;
  }, []);

  const completeTask = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task && !task.completed) {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t)),
        );
        setUser((prev) => ({
          ...prev,
          points: prev.points + task.points,
          totalEarned: prev.totalEarned + task.points,
          dailyEarned: prev.dailyEarned + task.points,
        }));
      }
    },
    [tasks],
  );

  const addDeposit = useCallback(
    (deposit: Omit<DepositRequest, "id" | "userId" | "createdAt">) => {
      const newDeposit: DepositRequest = {
        ...deposit,
        id: `d${Date.now()}`,
        userId: user.username,
        createdAt: new Date().toISOString(),
      };
      setDeposits((prev) => [newDeposit, ...prev]);
    },
    [user.username],
  );

  const addWithdrawal = useCallback(
    (withdrawal: Omit<WithdrawRequest, "id" | "userId" | "createdAt">) => {
      const newWithdrawal: WithdrawRequest = {
        ...withdrawal,
        id: `w${Date.now()}`,
        userId: user.username,
        createdAt: new Date().toISOString(),
      };
      setWithdrawals((prev) => [newWithdrawal, ...prev]);
    },
    [user.username],
  );

  const approveDeposit = useCallback((id: string) => {
    setDeposits((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "CONFIRMED" } : d)),
    );
  }, []);

  const rejectDeposit = useCallback((id: string) => {
    setDeposits((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "REJECTED" } : d)),
    );
  }, []);

  const approveWithdrawal = useCallback((id: string) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: "APPROVED" } : w)),
    );
  }, []);

  const rejectWithdrawal = useCallback((id: string) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: "REJECTED" } : w)),
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        tasks,
        deposits,
        withdrawals,
        login,
        logout,
        claimDailyReward,
        completeTask,
        addDeposit,
        addWithdrawal,
        approveDeposit,
        rejectDeposit,
        approveWithdrawal,
        rejectWithdrawal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
