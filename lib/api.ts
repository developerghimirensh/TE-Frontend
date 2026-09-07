const API_BASE_URL =
  "http://localhost:8000/api";


// ============================================================
// TYPES
// ============================================================

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}


export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterData {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
}


export interface LoginData {
  username: string;
  password: string;
}

export interface Trade {
  id: number;
  user: number;

  entry_time: string;
  exit_time: string | null;

  symbol: string;

  direction: "LONG" | "SHORT";

  lots: string;

  entry_price: string;
  take_profit: string | null;
  stop_loss: string | null;
  exit_price: string | null;

  pnl: string;
  fees: string;

  setup: string;
  lesson: string;

  score: number | null;

  created_at: string;
  updated_at: string;
}

export interface TradeInput {
  entry_time: string;
  exit_time?: string | null;

  symbol: string;

  direction: "LONG" | "SHORT";

  lots: string | number;

  entry_price: string | number;

  take_profit?: string | number | null;
  stop_loss?: string | number | null;
  exit_price?: string | number | null;

  pnl?: string | number;
  fees?: string | number;

  setup?: string;
  lesson?: string;

  score?: number | null;
}


// ============================================================
// ANALYTICS TYPES
// ============================================================

export interface EquityPoint {
  trade_id: number;
  date: string;

  pnl: string;
  fees: string;
  net_pnl: string;

  equity: string;
  drawdown: string;
}

export interface PeriodPnL {
  period: string;
  pnl: string;
}

export interface CalendarPnL {
  date: string;
  pnl: string;
}

export interface Performance {
  name: string;

  trades: number;
  winning_trades: number;
  losing_trades: number;
  breakeven_trades: number;

  win_rate: number;

  net_pnl: string;
  average_pnl: string;
}

export interface DirectionPerformance {
  trades: number;
  winning_trades: number;
  losing_trades: number;
  breakeven_trades: number;

  win_rate: number;

  net_pnl: string;
  average_pnl: string;
}

export interface LongVsShort {
  long: DirectionPerformance;
  short: DirectionPerformance;
}

export interface RMultiplePoint {
  trade_id: number;
  symbol: string;
  direction: "LONG" | "SHORT";
  r: string;
  date: string;
}

export interface RMultipleAnalysis {
  average_r: string | null;
  largest_r: string | null;
  smallest_r: string | null;
  trades_with_r: number;

  distribution: RMultiplePoint[];
}

export interface TradingDay {
  date: string;
  pnl: string;
}

export interface TradeFrequency {
  total_trades: number;
  trading_days: number;

  average_trades_per_day: number;
  trades_per_week: number;
  trades_per_month: number;
}

export interface AverageHoldingTime {
  average_seconds: number;
  average_minutes: number;
  average_hours: number;
}

export interface Analytics {
  // Basic statistics
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  breakeven_trades: number;

  win_rate: number;

  gross_pnl: string;
  net_pnl: string;

  gross_profit: string;
  gross_loss: string;

  profit_factor: string | null;

  average_win: string;
  average_loss: string;

  expectancy: string;

  largest_win: string;
  largest_loss: string;

  total_fees: string;

  // Drawdown
  maximum_drawdown: string;
  current_drawdown: string;

  // Equity
  equity_curve: EquityPoint[];

  // Time-based P/L
  daily_pnl: PeriodPnL[];
  weekly_pnl: PeriodPnL[];
  monthly_pnl: PeriodPnL[];
  yearly_pnl: PeriodPnL[];

  // Direction
  long_vs_short: LongVsShort;

  // Symbol / strategy
  symbol_performance: Performance[];
  strategy_performance: Performance[];

  // Risk / reward
  average_rr: string | null;
  r_multiple_analysis: RMultipleAnalysis;

  // Streaks
  winning_streak: number;
  losing_streak: number;

  // Best / worst day
  best_trading_day: TradingDay | null;
  worst_trading_day: TradingDay | null;

  // Calendar
  calendar_pnl: CalendarPnL[];

  // Frequency
  trade_frequency: TradeFrequency;

  // Holding time
  average_holding_time: AverageHoldingTime;

  // Best / worst symbol
  best_performing_symbol: Performance | null;
  worst_performing_symbol: Performance | null;
}


// ============================================================
// TOKEN STORAGE
// ============================================================

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";


export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(ACCESS_TOKEN_KEY);
}


export function getRefreshToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(REFRESH_TOKEN_KEY);
}


export function getStoredUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  const user = localStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}


export function saveAuth(data: AuthResponse): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    ACCESS_TOKEN_KEY,
    data.access
  );

  localStorage.setItem(
    REFRESH_TOKEN_KEY,
    data.refresh
  );

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(data.user)
  );
}


export function clearAuth(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    ACCESS_TOKEN_KEY
  );

  localStorage.removeItem(
    REFRESH_TOKEN_KEY
  );

  localStorage.removeItem(
    USER_KEY
  );
}


// ============================================================
// BASE REQUEST
// ============================================================

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  authenticated = true
): Promise<T> {

  const headers = new Headers(
    options.headers
  );

  headers.set(
    "Content-Type",
    "application/json"
  );

  if (authenticated) {
    const token = getAccessToken();

    if (token) {
      headers.set(
        "Authorization",
        `Bearer ${token}`
      );
    }
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  const contentType =
    response.headers.get(
      "content-type"
    );

  let data: any = null;

  if (
    contentType?.includes(
      "application/json"
    )
  ) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const error = new Error(
      getErrorMessage(data)
    );

    (
      error as Error & {
        status?: number;
        data?: unknown;
      }
    ).status = response.status;

    (
      error as Error & {
        status?: number;
        data?: unknown;
      }
    ).data = data;

    throw error;
  }

  return data as T;
}


// ============================================================
// ERROR HANDLING
// ============================================================

function getErrorMessage(
  data: any
): string {

  if (!data) {
    return "Request failed.";
  }

  if (typeof data === "string") {
    return data;
  }

  if (data.detail) {
    return data.detail;
  }

  if (data.message) {
    return data.message;
  }

  // Django / DRF validation errors
  if (typeof data === "object") {

    const messages: string[] = [];

    for (const [
      field,
      value,
    ] of Object.entries(data)) {

      if (Array.isArray(value)) {
        messages.push(
          `${field}: ${value.join(", ")}`
        );
      } else {
        messages.push(
          `${field}: ${String(value)}`
        );
      }
    }

    if (messages.length) {
      return messages.join("\n");
    }
  }

  return "Request failed.";
}


// ============================================================
// AUTH API
// ============================================================

export async function register(
  data: RegisterData
): Promise<User> {

  return request<User>(
    "/accounts/register/",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    false
  );
}


export async function login(
  data: LoginData
): Promise<AuthResponse> {

  const response =
    await request<AuthResponse>(
      "/accounts/login/",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      false
    );

  saveAuth(response);

  return response;
}


export async function refreshAccessToken(): Promise<string> {

  const refresh =
    getRefreshToken();

  if (!refresh) {
    throw new Error(
      "No refresh token available."
    );
  }

  const response =
    await request<{
      access: string;
    }>(
      "/accounts/refresh/",
      {
        method: "POST",
        body: JSON.stringify({
          refresh,
        }),
      },
      false
    );

  if (
    typeof window !== "undefined"
  ) {
    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      response.access
    );
  }

  return response.access;
}


export async function testAuth(): Promise<{
  message: string;
  user: User;
}> {

  return request(
    "/accounts/test/",
    {
      method: "GET",
    }
  );
}


export function logout(): void {
  clearAuth();
}


// ============================================================
// TRADES API
// ============================================================

export async function getTrades(): Promise<Trade[]> {

  return request<Trade[]>(
    "/trades/",
    {
      method: "GET",
    }
  );
}


export async function getTrade(
  id: number
): Promise<Trade> {

  return request<Trade>(
    `/trades/${id}/`,
    {
      method: "GET",
    }
  );
}


export async function createTrade(
  data: TradeInput
): Promise<Trade> {

  return request<Trade>(
    "/trades/",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}


export async function updateTrade(
  id: number,
  data: Partial<TradeInput>
): Promise<Trade> {

  return request<Trade>(
    `/trades/${id}/`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}


export async function patchTrade(
  id: number,
  data: Partial<TradeInput>
): Promise<Trade> {

  return request<Trade>(
    `/trades/${id}/`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}


export async function deleteTrade(
  id: number
): Promise<void> {

  await request(
    `/trades/${id}/`,
    {
      method: "DELETE",
    }
  );
}


// ============================================================
// ANALYTICS API
// ============================================================

export async function getAnalytics(): Promise<Analytics> {

  return request<Analytics>(
    "/analytics/",
    {
      method: "GET",
    }
  );
}