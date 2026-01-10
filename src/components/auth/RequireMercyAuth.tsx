// FILE: src/components/auth/RequireMercyAuth.tsx
import React, { useEffect, useState } from "react";
import { getMercyUserId, redirectToMercyLogin } from "../../lib/mercyAuth";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode; // optional loading UI
};

export default function RequireMercyAuth({ children, fallback = null }: Props) {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      const userId = await getMercyUserId();
      if (!alive) return;

      if (!userId) {
        redirectToMercyLogin(window.location.href);
        return;
      }

      setOk(true);
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (ok === null) return <>{fallback}</>;
  if (ok === false) return null; // will have redirected
  return <>{children}</>;
}
