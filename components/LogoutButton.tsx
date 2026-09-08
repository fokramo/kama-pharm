"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton({ endpoint = "/api/account/logout", to = "/" }: { endpoint?: string; to?: string }) {
  const router = useRouter();
  async function logout() {
    await fetch(endpoint, { method: "POST" });
    router.push(to);
    router.refresh();
  }
  return (
    <button className="btn btn-ghost" onClick={logout} style={{ gap: 6 }}>
      <LogOut size={16} /> התנתק
    </button>
  );
}
