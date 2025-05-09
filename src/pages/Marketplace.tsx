// src/pages/Marketplace.tsx
import React, { useEffect, useState } from "react";
import { Link }                        from "react-router-dom";
import { db, auth }                    from "../firebase";
import { collection, onSnapshot, doc, updateDoc, arrayUnion } from "firebase/firestore";

export default function Marketplace() {
  const [agents, setAgents] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "agents"), snap => {
      setAgents(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    });
    return unsub;
  }, []);

  const handlePurchase = async (agentId: string) => {
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { purchasedAgents: arrayUnion(agentId) });
  };

  return (
    <div className="marketplace-container">
      <div className="marketplace-header">
        <h1>Marketplace</h1>
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
      </div>
      {agents.map(agent => (
        <div key={agent.id} className="agent-row">
          <span>{agent.name}</span>
          <button className="purchase-button" onClick={() => handlePurchase(agent.id)}>
            Purchase
          </button>
        </div>
      ))}
    </div>
  );
}
