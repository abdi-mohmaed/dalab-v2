'use client';

import { useEffect, useState } from 'react';

export default function DebugSession() {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/auth/session')
            .then(res => res.json())
            .then(data => {
                setSession(data.user);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Session Debug</h1>
            <pre>{JSON.stringify(session, null, 2)}</pre>
            {!session && <p style={{ color: 'red' }}>No session found. Please log in.</p>}
            {session && (
                <div>
                    <p>Role: <strong>{session.role}</strong></p>
                    {(session.role === 'ADMIN' || session.role === 'CASHIER') ?
                        <p style={{ color: 'green' }}>✅ You have permission to upload.</p> :
                        <p style={{ color: 'red' }}>❌ You do NOT have permission to upload (Admin/Cashier required).</p>
                    }
                </div>
            )}
        </div>
    );
}
