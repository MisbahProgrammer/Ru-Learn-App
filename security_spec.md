# Security Specification

## Data Invariants
- A user profile must have a valid UID matching the authenticated user.
- Trial start date must be a valid ISO string.
- Premium status must be boolean.
- Users can only read and write their own profile.

## The Dirty Dozen Payloads
- P1: Create profile for another user's UID.
- P2: Update `isPremium` status without being an admin (actually the app allows self-update for now? Wait, no, usually that should be restricted).
- P3: Inject 1MB string into `displayName`.
- P4: Modify `uid` field after creation.
- P5: Set `trialStartDate` to a future date manually (not easily preventable with strings, but we check types).
- P6: Access another user's profile via `get`.
- P7: List all users.
- P8: Create profile with missing `email`.
- P9: Update `email` to someone else's.
- P10: Add "isVerified" fake field.
- P11: Create profile without being signed in.
- P12: Inject script tag in `displayName`.

## Test Runner (Logic Check)
- `get` /users/UID as UID -> ALLOW
- `get` /users/UID as attacker -> DENY
- `create` /users/UID with valid data as UID -> ALLOW
- `update` /users/UID changing `displayName` as UID -> ALLOW
- `update` /users/UID changing `uid` as UID -> DENY
- `update` /users/UID with extra field as UID -> DENY (via hasOnly)
