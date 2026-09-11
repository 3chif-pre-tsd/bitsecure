# BitSecure

BitSecure is a React and Vite password manager prototype with local encrypted storage, a Tailwind-based UI, username and master-password authentication, and modular vault management.

## Project context

BitSecure was developed as a school team project by three students at HTL Spengergasse during the 2025/26 school year.

The project was created as part of Project Development and combined software development with project planning, documentation and collaborative development.

## Current feature set

* Username + master-password login
* Master-password reset with vault re-encryption
* Encrypted browser storage for account metadata and entries
* Open, edit, delete, and inspect password entries
* Search, filter, and sort vault entries
* Password visibility toggle and copy-to-clipboard action
* Random password generation in the entry editor
* Creation and modification timestamps

## Project structure

* `bitsecure/src/components/auth`: authentication-specific UI
* `bitsecure/src/components/ui`: shared visual primitives
* `bitsecure/src/components/vault`: dashboard and vault panels
* `bitsecure/src/hooks`: state orchestration for auth and vault behavior
* `bitsecure/src/services`: auth, entry, crypto, and storage logic
* `bitsecure/src/utils`: small reusable helpers

## Development

```bash
cd bitsecure
npm install
npm run dev
```

## Validation

```bash
cd bitsecure
npm run lint
npm run test
npm run build
```
