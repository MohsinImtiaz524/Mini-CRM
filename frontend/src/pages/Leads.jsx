import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', status: 'new', assignedTo: '' });
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { search, status } = filters;
      const { page } = pagination;
      const response = await api.get(`/leads?page=${page}&limit=10&search=${search}&status=${status}`);
      setLeads(response.data.leads);
      
      const totalPages = response.data.totalPages || 1;
      setPagination(prev => {
        // Step back to the max page if current page becomes empty/out-of-bounds (e.g., after deletion)
        const nextPage = prev.page > totalPages ? totalPages : prev.page;
        return { ...prev, totalPages, page: nextPage };
      });
    } catch (err) {
      addToast('Failed to fetch leads', 'error');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters, addToast]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get('/auth/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  }, []);

  useEffect(() => {
    fetchLeads();
    fetchUsers();
  }, [fetchLeads, fetchUsers]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/leads/${id}`, { status: newStatus });
      addToast('Status updated successfully');
      fetchLeads();
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      addToast('Lead deleted successfully');
      fetchLeads();
    } catch (err) {
      addToast('Failed to delete lead', 'error');
    }
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/leads', formData);
      addToast('Lead added successfully');
      setIsModalOpen(false);
      setFormData({ name: '', email: '', phone: '', status: 'new', assignedTo: '' });
      setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 to see the new lead at the top
      fetchLeads();
    } catch (err) {
      // Handle express-validator errors
      const errorMsg = err.response?.data?.errors
        ? err.response.data.errors[0].msg
        : (err.response?.data?.message || 'Failed to add lead');
      addToast(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return { bg: '#eff6ff', text: '#3b82f6' };
      case 'contacted': return { bg: '#fffbeb', text: '#f59e0b' };
      case 'converted': return { bg: '#ecfdf5', text: '#10b981' };
      default: return { bg: '#f9fafb', text: '#6b7280' };
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-text-main">Leads Manager</h1>
          <p className="text-text-subtle text-sm mt-1">View and manage your customer pipeline</p>
        </div>
        <button
          className="btn btn-primary w-full sm:w-auto"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Lead
        </button>
      </div>

      <div className="card mb-6 p-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="flex-1">
          <input
            type="text"
            className="input-field !mt-0"
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={(e) => {
              setFilters({ ...filters, search: e.target.value });
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
          />
        </div>
        <select
          className="input-field !mt-0 w-full sm:w-[200px]"
          value={filters.status}
          onChange={(e) => {
            setFilters({ ...filters, status: e.target.value });
            setPagination(prev => ({ ...prev, page: 1 }));
          }}
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg-subtle border-b border-border">
                <th className="p-4 text-xs font-semibold text-text-subtle uppercase">Name</th>
                <th className="p-4 text-xs font-semibold text-text-subtle uppercase">Contact</th>
                <th className="p-4 text-xs font-semibold text-text-subtle uppercase">Status</th>
                <th className="p-4 text-xs font-semibold text-text-subtle uppercase">Assigned To</th>
                <th className="p-4 text-xs font-semibold text-text-subtle uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-10 text-center text-text-subtle">Loading leads...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan="5" className="p-10 text-center text-text-subtle">No leads found.</td></tr>
              ) : leads.map(lead => (
                <tr key={lead._id} className="border-b border-border last:border-0 hover:bg-bg-subtle/50 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-sm text-text-main">{lead.name}</p>
                    <p className="text-[11px] text-text-subtle">{new Date(lead.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-text-main">{lead.email}</p>
                    <p className="text-xs text-text-subtle">{lead.phone}</p>
                  </td>
                  <td className="p-4">
                    <span 
                      className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                      style={{ 
                        backgroundColor: getStatusColor(lead.status).bg,
                        color: getStatusColor(lead.status).text 
                      }}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-border text-[10px] flex items-center justify-center font-bold text-text-subtle uppercase">
                        {lead.assignedTo?.charAt(0)}
                      </div>
                      <span className="text-[13px] text-text-main">{lead.assignedTo}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusUpdate(lead._id, e.target.value)}
                        className="px-2 py-1 rounded-md border border-border text-xs bg-bg-main text-text-main focus:outline-none focus:border-primary"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                      </select>
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="px-2 py-1 rounded-md border border-red-100 text-red-600 bg-red-50 hover:bg-red-100 text-xs transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex justify-between items-center border-t border-border">
          <p className="text-sm text-text-subtle">
            Page {pagination.page} of {Math.max(pagination.totalPages, 1)}
          </p>
          <div className="flex gap-2">
            <button
              className="btn px-3 py-1.5 border border-border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bg-subtle"
              disabled={pagination.page === 1}
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            >
              Previous
            </button>
            <button
              className="btn px-3 py-1.5 border border-border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bg-subtle"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Lead"
      >
        <form onSubmit={handleAddLead} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input
              type="text"
              className="input-field"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input-field"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input
              type="text"
              className="input-field"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Assign To</label>
            <select
              className="input-field"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            >
              <option value="">Current User (Me)</option>
              {users.map(u => (
                <option key={u._id} value={u.username}>{u.username}</option>
              ))}
            </select>
          </div>
          <div className="pb-2">
            <label className="label">Status</label>
            <select
              className="input-field"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={submitting}
          >
            {submitting ? 'Adding...' : 'Add Lead'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Leads;
