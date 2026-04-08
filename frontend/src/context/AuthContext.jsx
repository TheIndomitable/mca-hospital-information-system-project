import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('his_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const login = (role) => {
    const userData = {
      id: Date.now(),
      name: role === 'patient' ? 'Ashutosh Sharma' : 
            role === 'doctor' ? 'Dr. Priya Verma' :
            role === 'admin' ? 'Admin - MANIT Hospital' : 'Lab Technician',
      role: role,
      email: `${role}@manit.edu.in`
    };
    setUser(userData);
    localStorage.setItem('his_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('his_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);