import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../ui/Navbar/Navbar';
import Footer from '../ui/Footer/Footer';
import Swal from 'sweetalert2';

interface User {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  username: string;
  email: string;
  rol: string;
  direccion?: {
    id: number;
    domicilio: string;
    casa: string;
    localidad: {
      id: number;
      nombre: string;
      codigoPostal: number;
      provincia: {
        id: number;
        nombre: string;
        pais: {
          id: number;
          nombre: string;
        };
      };
    };
  } | null;
}

interface EditFormData {
  nombre: string;
  apellido: string;
  dni: number;
  username: string;
  email: string;
  domicilio: string;
  casa: string;
  localidad: string;
  codigoPostal: number;
  provincia: string;
  pais: string;
}

const AccountDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<EditFormData>({
    nombre: '',
    apellido: '',
    dni: 0,
    username: '',
    email: '',
    domicilio: '',
    casa: '',
    localidad: '',
    codigoPostal: 0,
    provincia: '',
    pais: ''
  });

  useEffect(() => {
    // Verificar si hay un usuario logueado
    const currentUserData = localStorage.getItem('currentUser');
    
    if (!currentUserData) {
      // Si no hay usuario logueado, redirigir al login
      navigate('/account');
      return;
    }

    try {
      const userData = JSON.parse(currentUserData);
      setUser(userData);
      
      // Inicializar formulario con datos del usuario
      setEditForm({
        nombre: userData.nombre || '',
        apellido: userData.apellido || '',
        dni: userData.dni || 0,
        username: userData.username || '',
        email: userData.email || '',
        domicilio: userData.direccion?.domicilio || '',
        casa: userData.direccion?.casa || '',
        localidad: userData.direccion?.localidad?.nombre || '',
        codigoPostal: userData.direccion?.localidad?.codigoPostal || 0,
        provincia: userData.direccion?.localidad?.provincia?.nombre || '',
        pais: userData.direccion?.localidad?.provincia?.pais?.nombre || ''
      });
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/account');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    // Restaurar datos originales
    if (user) {
      setEditForm({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        dni: user.dni || 0,
        username: user.username || '',
        email: user.email || '',
        domicilio: user.direccion?.domicilio || '',
        casa: user.direccion?.casa || '',
        localidad: user.direccion?.localidad?.nombre || '',
        codigoPostal: user.direccion?.localidad?.codigoPostal || 0,
        provincia: user.direccion?.localidad?.provincia?.nombre || '',
        pais: user.direccion?.localidad?.provincia?.pais?.nombre || ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'dni' || name === 'codigoPostal' ? parseInt(value) || 0 : value
    }));
  };

  const handleSaveChanges = () => {
    // Validaciones básicas
    if (!editForm.nombre || !editForm.apellido || !editForm.email || !editForm.username) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos obligatorios'
      });
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editForm.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingresa un email válido'
      });
      return;
    }

    // Crear usuario actualizado
    const updatedUser: User = {
      ...user!,
      nombre: editForm.nombre,
      apellido: editForm.apellido,
      dni: editForm.dni,
      username: editForm.username,
      email: editForm.email,
      direccion: editForm.domicilio ? {
        id: user?.direccion?.id || 0,
        domicilio: editForm.domicilio,
        casa: editForm.casa,
        localidad: {
          id: user?.direccion?.localidad?.id || 0,
          nombre: editForm.localidad,
          codigoPostal: editForm.codigoPostal,
          provincia: {
            id: user?.direccion?.localidad?.provincia?.id || 0,
            nombre: editForm.provincia,
            pais: {
              id: user?.direccion?.localidad?.provincia?.pais?.id || 0,
              nombre: editForm.pais
            }
          }
        }
      } : null
    };

    // Actualizar el estado y localStorage
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Cerrar modal y mostrar mensaje de éxito
    setShowEditModal(false);
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'Perfil actualizado correctamente'
    });
  };

  const handleAdminPanel = () => {
    navigate('/admin');
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <Navbar />
      
      <div style={{
        minHeight: '80vh',
        padding: '2rem',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <h1 style={{ 
              color: '#333',
              marginBottom: '0'
            }}>
              Mi Cuenta
            </h1>
            
            {/* Mostrar botón de administración solo para usuarios ADMIN */}
            {user.rol === 'ADMIN' && (
              <button
                onClick={handleAdminPanel}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Administrar Productos
              </button>
            )}
          </div>

          <div style={{
            display: 'grid',
            gap: '1.5rem'
          }}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #e9ecef'
            }}>
              <h2 style={{ 
                color: '#495057',
                marginBottom: '1rem',
                fontSize: '1.25rem'
              }}>
                Información Personal
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <strong>Nombre:</strong>
                  <div>{user.nombre} {user.apellido}</div>
                </div>
                <div>
                  <strong>Usuario:</strong>
                  <div>{user.username}</div>
                </div>
                <div>
                  <strong>DNI:</strong>
                  <div>{user.dni}</div>
                </div>
                <div>
                  <strong>Email:</strong>
                  <div>{user.email}</div>
                </div>
                <div>
                  <strong>Rol:</strong>
                  <div style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: user.rol === 'ADMIN' ? '#28a745' : '#007bff',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '0.875rem'
                  }}>
                    {user.rol}
                  </div>
                </div>
              </div>
            </div>

            {/* Información de Dirección */}
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #e9ecef'
            }}>
              <h2 style={{ 
                color: '#495057',
                marginBottom: '1rem',
                fontSize: '1.25rem'
              }}>
                Dirección
              </h2>
              
              {user.direccion ? (
                <div style={{
                  display: 'grid',
                  gap: '0.5rem'
                }}>
                  <div>
                    <strong>Domicilio:</strong> {user.direccion.domicilio}
                  </div>
                  <div>
                    <strong>Casa/Depto:</strong> {user.direccion.casa}
                  </div>
                  <div>
                    <strong>Localidad:</strong> {user.direccion.localidad.nombre}
                  </div>
                  <div>
                    <strong>Código Postal:</strong> {user.direccion.localidad.codigoPostal}
                  </div>
                  <div>
                    <strong>Provincia:</strong> {user.direccion.localidad.provincia.nombre}
                  </div>
                  <div>
                    <strong>País:</strong> {user.direccion.localidad.provincia.pais.nombre}
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#fff3cd',
                  border: '1px solid #ffeaa7',
                  borderRadius: '4px',
                  color: '#856404'
                }}>
                  No tienes una dirección registrada. 
                  <button
                    onClick={handleEditProfile}
                    style={{
                      marginLeft: '0.5rem',
                      color: '#007bff',
                      background: 'none',
                      border: 'none',
                      textDecoration: 'underline',
                      cursor: 'pointer'
                    }}
                  >
                    Agregar dirección
                  </button>
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              marginTop: '1rem'
            }}>
              <button
                onClick={handleEditProfile}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Editar Perfil
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      {showEditModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ margin: 0, color: '#333' }}>Editar Perfil</h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div style={{
                display: 'grid',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>Información Personal</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={editForm.nombre}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Apellido *
                    </label>
                    <input
                      type="text"
                      name="apellido"
                      value={editForm.apellido}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      DNI
                    </label>
                    <input
                      type="number"
                      name="dni"
                      value={editForm.dni || ''}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Usuario *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={editForm.username}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                    required
                  />
                </div>

                <h3 style={{ margin: '1rem 0 0.5rem 0', color: '#495057' }}>Dirección</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Domicilio
                    </label>
                    <input
                      type="text"
                      name="domicilio"
                      value={editForm.domicilio}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Casa/Depto
                    </label>
                    <input
                      type="text"
                      name="casa"
                      value={editForm.casa}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Localidad
                    </label>
                    <input
                      type="text"
                      name="localidad"
                      value={editForm.localidad}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Código Postal
                    </label>
                    <input
                      type="number"
                      name="codigoPostal"
                      value={editForm.codigoPostal || ''}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Provincia
                    </label>
                    <input
                      type="text"
                      name="provincia"
                      value={editForm.provincia}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      País
                    </label>
                    <input
                      type="text"
                      name="pais"
                      value={editForm.pais}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AccountDashboard;