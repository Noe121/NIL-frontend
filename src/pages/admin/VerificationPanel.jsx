import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

export default function VerificationPanel() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [verifyNotes, setVerifyNotes] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [usersRes, statsRes] = await Promise.all([
        authService.getPendingVerifications(),
        authService.getVerificationStats()
      ]);

      setPendingUsers(usersRes);
      setStats(statsRes);
      setError('');
    } catch (err) {
      if (err.message?.includes('401') || err.message?.includes('403')) {
        navigate('/auth');
      } else {
        setError(err.message || 'Failed to load verification data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId, approved) => {
    if (!selectedUser || selectedUser.id !== userId) {
      setSelectedUser(pendingUsers.find(u => u.id === userId));
      return;
    }

    try {
      setProcessingId(userId);

      await authService.verifyUser(userId, approved, verifyNotes || null);

      // Refresh data
      await fetchData();
      setSelectedUser(null);
      setVerifyNotes('');
      setProcessingId(null);
    } catch (err) {
      setError(err.message || 'Failed to process verification');
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading verification data...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>User Verification Panel</h1>

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: 6,
          marginBottom: '1rem',
          color: '#c00'
        }}>
          {error}
        </div>
      )}

      {/* Stats Dashboard */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <StatCard label="Pending" value={stats.pending_count} color="#fbbf24" />
          <StatCard label="Approved" value={stats.approved_count} color="#10b981" />
          <StatCard label="Rejected" value={stats.rejected_count} color="#ef4444" />
          <StatCard label="Total" value={stats.total_requiring_verification} color="#3b82f6" />
        </div>
      )}

      {/* Pending Users List */}
      <h2 style={{ marginBottom: '1rem' }}>Pending Verifications ({pendingUsers.length})</h2>

      {pendingUsers.length === 0 ? (
        <div style={{
          padding: '3rem',
          textAlign: 'center',
          backgroundColor: '#f9fafb',
          borderRadius: 8,
          color: '#666'
        }}>
          <p style={{ fontSize: '1.1rem' }}>No pending verifications</p>
          <p>All verification requests have been processed.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pendingUsers.map(user => (
            <UserCard
              key={user.id}
              user={user}
              selected={selectedUser?.id === user.id}
              processing={processingId === user.id}
              notes={verifyNotes}
              onNotesChange={setVerifyNotes}
              onSelect={() => setSelectedUser(user)}
              onApprove={() => handleVerify(user.id, true)}
              onReject={() => handleVerify(user.id, false)}
              onCancel={() => {
                setSelectedUser(null);
                setVerifyNotes('');
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color }}>
        {value}
      </div>
    </div>
  );
}

function UserCard({
  user,
  selected,
  processing,
  notes,
  onNotesChange,
  onSelect,
  onApprove,
  onReject,
  onCancel
}) {
  const getRoleDisplayName = (role) => {
    const roleNames = {
      'school_admin': 'School Representative',
      'admin': 'Platform Administrator',
      'athlete': 'Athlete',
      'influencer': 'Influencer',
      'sponsor': 'Sponsor',
      'agency': 'Agency',
      'fan': 'Fan'
    };
    return roleNames[role] || role;
  };

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: 'white',
      border: selected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
      borderRadius: 8,
      boxShadow: selected ? '0 4px 6px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
            {user.name}
          </h3>
          <p style={{ margin: 0, color: '#666' }}>{user.email}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            backgroundColor: '#f3f4f6',
            borderRadius: 999,
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            {getRoleDisplayName(user.role)}
          </span>
          <p style={{ margin: '0.5rem 0 0 0', color: '#999', fontSize: '0.875rem' }}>
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* User Metadata */}
      {user.metadata && Object.keys(user.metadata).length > 0 && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#f9fafb',
          borderRadius: 6,
          marginBottom: '1rem'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#666' }}>
            Registration Details:
          </h4>
          {Object.entries(user.metadata).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>
              <strong>{key.replace(/_/g, ' ')}:</strong> {value}
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      {!selected ? (
        <button
          onClick={onSelect}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Review & Verify
        </button>
      ) : (
        <div>
          <textarea
            placeholder="Add notes about this verification decision (optional)..."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              border: '1px solid #d0d0d0',
              borderRadius: 6,
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={onApprove}
              disabled={processing}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: processing ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                fontSize: '1rem',
                fontWeight: 600,
                cursor: processing ? 'not-allowed' : 'pointer'
              }}
            >
              {processing ? 'Processing...' : '✓ Approve'}
            </button>
            <button
              onClick={onReject}
              disabled={processing}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: processing ? '#9ca3af' : '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                fontSize: '1rem',
                fontWeight: 600,
                cursor: processing ? 'not-allowed' : 'pointer'
              }}
            >
              {processing ? 'Processing...' : '✗ Reject'}
            </button>
            <button
              onClick={onCancel}
              disabled={processing}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'white',
                color: '#666',
                border: '1px solid #d0d0d0',
                borderRadius: 6,
                fontSize: '1rem',
                cursor: processing ? 'not-allowed' : 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
