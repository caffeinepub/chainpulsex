# ChainPulseX

## Current State
New project, no existing application.

## Requested Changes (Diff)

### Add
- Full crypto analytics + earning platform
- Live token prices via HTTP outcalls (CoinGecko API)
- Trending tokens, market overview, token search
- User earning system: daily login rewards, task rewards, referral points
- Points economy: 1000 points = $1, daily cap $0.5-$1
- Deposit system: TRC20, BEP20 wallet addresses + Bybit Pay QR
- Withdrawal requests (manual approval flow)
- Admin dashboard: user management, deposit approval, reward settings, fraud flags
- Role-based access (user vs admin)
- Dark-themed glassmorphism UI

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Backend: user profiles, earning records, daily login tracking, task completion, deposit requests, withdrawal requests, admin controls
2. HTTP outcalls: fetch live prices from CoinGecko for top tokens
3. Frontend pages: Home (trending), Dashboard (earnings), Deposit, Withdraw, Admin Panel
4. Authorization component for login/roles
5. QR code display for deposit addresses including Bybit Pay image
