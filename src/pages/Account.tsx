// FILE: src/pages/Account.tsx
// PURPOSE: Legacy compatibility shim.
// - Some older imports may reference "@/pages/Account".
// - The real route uses AccountPage (see AppRouter.tsx).
// - Keep this file so legacy imports don’t resolve to an empty module.

import AccountPage from "@/pages/AccountPage";

export default AccountPage;
export { AccountPage };