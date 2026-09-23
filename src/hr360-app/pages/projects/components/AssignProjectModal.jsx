import React, { useState, useEffect } from 'react';
import { getEmployees } from '@/hr360-app/services/employeeService';
import { X } from 'lucide-react';

export default function AssignProjectModal({ isOpen, onClose, onAssign }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    if (isOpen) {
      getEmployees().then(data => setEmployees(data || []));
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const toggleEmployee = (emp) => {
    const isSelected = selectedEmployees.find(e => e.id === emp.id);
    if (isSelected) {
      setSelectedEmployees(selectedEmployees.filter(e => e.id !== emp.id));
    } else {
      setSelectedEmployees([...selectedEmployees, emp]);
    }
    setSearchQuery('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedEmployees.length === 0 || !name || !deadline) return;
    
    onAssign({
      selectedEmployees,
      name,
      description,
      deadline: new Date(deadline).toISOString()
    });
    
    setSelectedEmployees([]);
    setSearchQuery('');
    setName('');
    setDescription('');
    setDeadline('');
    onClose();
  };

  const unselectedEmployees = employees.filter(emp => !selectedEmployees.find(se => se.id === emp.id));
  const filteredEmployees = unselectedEmployees.filter(emp => emp.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'var(--color-bg)', padding: '24px', borderRadius: '12px',
        width: '100%', maxWidth: '500px', border: '1px solid var(--color-border)'
      }}>
        <h2 style={{ marginTop: 0, color: 'var(--color-text)' }}>Assign Team Project/Task</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>Assign To (Multiple)</label>
            
            {/* Selected Employee Chips */}
            {selectedEmployees.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                {selectedEmployees.map(emp => (
                  <div key={emp.id} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    backgroundColor: 'var(--color-brand)', color: 'white',
                    padding: '4px 8px', borderRadius: '16px', fontSize: '12px'
                  }}>
                    {emp.name}
                    <X 
                      size={14} 
                      style={{ cursor: 'pointer' }} 
                      onClick={() => toggleEmployee(emp)} 
                    />
                  </div>
                ))}
              </div>
            )}

            <input 
              type="text"
              placeholder="Search and add employees..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              style={{
                width: '100%', padding: '10px', borderRadius: '6px',
                border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-alt)',
                color: 'var(--color-text)'
              }}
            />
            {isDropdownOpen && (
              <ul style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                maxHeight: '200px', overflowY: 'auto', backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)', borderRadius: '6px',
                marginTop: '4px', zIndex: 10, padding: 0, listStyle: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                {filteredEmployees.map(emp => (
                  <li 
                    key={emp.id}
                    onClick={() => {
                      toggleEmployee(emp);
                    }}
                    style={{
                      padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid var(--color-border)',
                      backgroundColor: 'transparent',
                      color: 'var(--color-text)'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-bg-alt)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    {emp.name} <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>({emp.department})</span>
                  </li>
                ))}
                {filteredEmployees.length === 0 && (
                  <li style={{ padding: '10px 12px', color: 'var(--color-text-secondary)' }}>No other employees found</li>
                )}
              </ul>
            )}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>Project Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required
              style={{
                width: '100%', padding: '10px', borderRadius: '6px',
                border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-alt)',
                color: 'var(--color-text)'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>Description (Optional)</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              rows={3}
              style={{
                width: '100%', padding: '10px', borderRadius: '6px',
                border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-alt)',
                color: 'var(--color-text)', resize: 'vertical'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>Deadline</label>
            <input 
              type="datetime-local" 
              value={deadline} 
              onChange={e => setDeadline(e.target.value)} 
              required
              style={{
                width: '100%', padding: '10px', borderRadius: '6px',
                border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-alt)',
                color: 'var(--color-text)'
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{
                padding: '10px 16px', borderRadius: '6px', border: '1px solid var(--color-border)',
                backgroundColor: 'transparent', color: 'var(--color-text)', cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={selectedEmployees.length === 0}
              style={{
                padding: '10px 16px', borderRadius: '6px', border: 'none',
                backgroundColor: selectedEmployees.length > 0 ? 'var(--color-brand)' : 'var(--color-border)', 
                color: 'white', cursor: selectedEmployees.length > 0 ? 'pointer' : 'not-allowed'
              }}
            >
              Assign Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
