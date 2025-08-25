"use client";

import { useRouter } from "next/navigation";

export function StartPairingButton() {
  const router = useRouter();

  function onClick() {
    // Use Web Crypto on the client; trim to keep URLs short
    const id = crypto.randomUUID().slice(0, 8);
    router.push(`/r/${id}/prejoin`);
  }

  return (
    <button className="btn" onClick={onClick}>
      Start pairing
    </button>
  );
}

export default StartPairingButton;