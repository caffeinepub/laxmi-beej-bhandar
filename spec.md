# Laxmi Beej Bhandar

## Current State
The app has a complete Motoko backend (`main.mo`) with stable storage for all data entities: users, customers, suppliers, stock items, bills, monthly sales, and seed catalog. However, the frontend generated bindings (`backend.did.js`, `backend.did.d.ts`, `backend.ts`) are **empty** — they were never regenerated from the Motoko code. As a result, `DataContext.tsx` uses only in-memory React `useState` and `AuthContext.tsx` uses only `localStorage`. All data (customers, suppliers, stock, bills, seed catalog) is lost on page refresh.

## Requested Changes (Diff)

### Add
- Wire `DataContext` to call the Motoko backend for all data operations (create, read, update, delete) for customers, suppliers, stock items, bills, and seed catalog.
- Add loading state to `DataContext` so the UI can show a spinner while data loads from the canister.
- On app load, fetch all data from the backend and populate local state.
- Every mutation (add/update/delete) calls the backend first, then updates local state on success.

### Modify
- Regenerate Motoko backend to produce correct frontend bindings (`backend.did.js`, `backend.did.d.ts`, `backend.ts`).
- `DataContext.tsx`: replace pure in-memory state with backend-backed state. Keep the same context API so no page components need to change.
- `App.tsx`: pass the backend actor to `DataProvider`.
- Remove hardcoded `INITIAL_DATA` (sample data) from the live app — after backend wiring, data comes from the canister.

### Remove
- In-memory-only state management from `DataContext`.
- Seeding `useState` with `INITIAL_DATA` (mock data).

## Implementation Plan
1. Regenerate Motoko backend to get correct bindings with all service methods.
2. Rewrite `DataContext.tsx` to:
   - Accept the backend actor as a prop (or via context/hook).
   - On mount, call `getAllCustomers`, `getAllSuppliers`, `getAllStockItems`, `getAllBills`, `getAllSeedCatalog` from the backend and store in state.
   - Each mutation method calls the corresponding backend method and updates local state on success.
   - Expose `isLoading` boolean.
3. Update `App.tsx` to wire the actor into `DataProvider`.
4. Validate and deploy.
