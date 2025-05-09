import React, { useEffect, useState } from "react";
import { Link }                       from "react-router-dom";
import { auth, db }                   from "../firebase";          // both from firebase.ts
import { signOut }                    from "firebase/auth";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot as onUserSnapshot
} from "firebase/firestore";

import { setDoc } from "firebase/firestore";


import { useAuth } from "../contexts/AuthContext";



export default function Dashboard() {
  
  const { user } = useAuth();  // this comes from onAuthStateChanged in your AuthProvider
  const [allAgents,    setAllAgents]    = useState<{id:string;name:string}[]>([]);
  const [purchased,    setPurchased]    = useState<string[]>([]);
  const [activeAgents, setActiveAgents] = useState<string[]>([]);

  
  if (!user) return <p>Loading…</p>;

  

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "agents"), snap => {
      setAllAgents(
        snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
      );
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
  
    const unsubUser = onUserSnapshot(userRef, snap => {
      if (!snap.exists()) {
        // create the doc with empty arrays
        setDoc(userRef, { purchasedAgents: [], activeAgents: [] }, { merge: true });
      } else {
        const data = snap.data() as any;
        setPurchased(data.purchasedAgents || []);
        setActiveAgents(data.activeAgents   || []);
      }
    });
    return unsubUser;
  }, [user]);
  
  // 5) Toggle active/inactive for a purchased agent
  const toggleActive = async (agentId: string) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);

    if (activeAgents.includes(agentId)) {
      await updateDoc(userRef, { activeAgents: arrayRemove(agentId) });
    } else {
      await updateDoc(userRef, { activeAgents: arrayUnion(agentId) });
    }
  };

  const purchaseAgent = async (agentId: string) => {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { purchasedAgents: arrayUnion(agentId) });
  };


  const handleLogout = () => {
    signOut(auth);
  };


  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>AI Agent Dashboard</h2>
        <div>
          <Link to="/marketplace" className="back-link">Marketplace</Link>
          &nbsp;|&nbsp;
          <button onClick={() => signOut(auth)} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-body">
        <div className="left-pane">
          <h3>Your Library</h3>
          {purchased.length === 0 && <p>No agents purchased.</p>}
          {purchased.map(id => {
            const agent = allAgents.find(a => a.id === id);
            const isActive = activeAgents.includes(id);
            return (
              <div
                key={id}
                onClick={() => toggleActive(id)}
                style={{
                  padding: "0.5rem",
                  marginBottom: "0.25rem",
                  cursor: "pointer",
                  background: isActive ? "#4CAF50" : "#eee",
                  color:    isActive ? "white"    : "black"
                }}
              >
                {agent?.name} {isActive ? "(Active)" : "(Inactive)"}
              </div>
            );
          })}
        </div>

        <div className="right-pane">
          <h3>Active Agents</h3>
          {activeAgents.length === 0 && <p>No agents active.</p>}
          {activeAgents.map(id => {
            const agent = allAgents.find(a => a.id === id);
            return (
              <div key={id} style={{ padding: "0.5rem" }}>
                {agent?.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}



 