# BitSecure

BitSecure is a React and Vite password manager prototype with local encrypted storage,
Tailwind-based UI, username + master-password authentication, and modular vault management.

## Current feature set

- Username + master-password login
- Master-password reset with vault re-encryption
- Encrypted browser storage for account metadata and entries
- Open, edit, delete, and inspect password entries
- Search, filter, and sort vault entries
- Password visibility toggle and copy-to-clipboard action
- Random password generation in the entry editor
- Creation and modification timestamps

## Project structure

- `src/components/auth`: authentication-specific UI
- `src/components/ui`: shared visual primitives
- `src/components/vault`: dashboard and vault panels
- `src/hooks`: state orchestration for auth and vault behavior
- `src/services`: auth, entry, crypto, and storage logic
- `src/utils`: small reusable helpers

## Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run test
npm run build
```
