import { useState, useEffect } from 'react';
import PageContainer from '@/hr360-app/components/shared/layout/PageContainer';
import StatusBadge from '@/hr360-app/components/shared/ui/StatusBadge';
import { SkeletonTable } from '@/hr360-app/components/shared/ui/Skeleton';
import EmptyState from '@/hr360-app/components/shared/ui/EmptyState';
import { getLeaveRequests, updateLeaveRequestStatus } from '@/hr360-app/services/leaveService';
import { Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LeaveRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    setIsLoading(true);
    const data = await getLeaveRequests();
    setRequests(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRequests();
    
    // Auto-refresh every 10 seconds to fetch new requests
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (req) => {
    const success = await updateLeaveRequestStatus(req.id, 'approved', req);
    if (success) {
      toast.success('Leave request approved!');
      fetchRequests();
    } else {
      toast.error('Failed to approve request.');
    }
  };

  const handleReject = async (req) => {
    const success = await updateLeaveRequestStatus(req.id, 'rejected', req);
    if (success) {
      toast.success('Leave request rejected!');
      fetchRequests();
    } else {
      toast.error('Failed to reject request.');
    }
  };

  return (
    <PageContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: 'var(--color-text)' }}>Leave Requests</h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Review and manage employee time-off requests.</p>
        </div>

        {isLoading ? (
          <SkeletonTable rows={5} cols={6} />
        ) : requests.length === 0 ? (
          <EmptyState title="No leave requests" description="There are no pending or past leave requests." />
        ) : (
          <div style={{ backgroundColor: 'var(--color-bg-alt)', borderRadius: '12px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                  <th style={{ padding: '16px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Employee</th>
                  <th style={{ padding: '16px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Start Date</th>
                  <th style={{ padding: '16px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>End Date</th>
                  <th style={{ padding: '16px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Reason</th>
                  <th style={{ padding: '16px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Status</th>
                  <th style={{ padding: '16px', color: 'var(--color-text-secondary)', fontWeight: 500, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '16px', fontWeight: 500, color: 'var(--color-text)' }}>
                      {req.employee_name}
                    </td>
                    <td style={{ padding: '16px', color: 'var(--color-text-secondary)' }}>
                      {req.start_date}
                    </td>
                    <td style={{ padding: '16px', color: 'var(--color-text-secondary)' }}>
                      {req.end_date}
                    </td>
                    <td style={{ padding: '16px', color: 'var(--color-text-secondary)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={req.reason}>
                      {req.reason}
                    </td>
                    <td style={{ padding: '16px' }}>
                      {req.status === 'approved' ? (
                        <StatusBadge status="success">Approved</StatusBadge>
                      ) : req.status === 'rejected' ? (
                        <StatusBadge status="inactive">Rejected</StatusBadge>
                      ) : (
                        <StatusBadge status="danger">Pending</StatusBadge>
                      )}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      {req.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button 
                            onClick={() => handleApprove(req)}
                            style={{
                              background: 'var(--color-success-soft)', border: 'none', color: 'var(--color-success)',
                              cursor: 'pointer', padding: '6px', borderRadius: '4px', display: 'flex', alignItems: 'center'
                            }}
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            onClick={() => handleReject(req)}
                            style={{
                              background: 'var(--color-danger-soft)', border: 'none', color: 'var(--color-danger)',
                              cursor: 'pointer', padding: '6px', borderRadius: '4px', display: 'flex', alignItems: 'center'
                            }}
                            title="Reject"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
