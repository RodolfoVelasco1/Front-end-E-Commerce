import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
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
  direccion: {
    domicilio: string;
    casa: string;
    localidad: string;
    codigoPostal: number;
    provincia: string;
    pais: string;
  };
}

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<EditFormData>({
    nombre: '',
    apellido: '',
    dni: 0,
    username: '',
    email: '',
    direccion: {
      domicilio: '',
      casa: '',
      localidad: '',
      codigoPostal: 0,
      provincia: '',
      pais: ''
    }
  });

  useEffect(() => {
    const currentUserData = localStorage.getItem('currentUser');
    
    if (!currentUserData) {
      navigate('/account');
      return;
    }

    try {
      const userData = JSON.parse(currentUserData);
      setUser(userData);
      
      // Inicializar el formulario con los datos actuales
      setFormData({
        nombre: userData.nombre || '',
        apellido: userData.apellido || '',
        dni: userData.dni || 0,
        username: userData.username || '',
        email: userData.email || '',
        direccion: {
          domicilio: userData.direccion?.domicilio || '',
          casa: userData.direccion?.casa || '',
          localidad: userData.direccion?.localidad?.nombre || '',
          codigoPostal: userData.direccion?.localidad?.codigoPostal || 0,
          provincia: userData.direccion?.localidad?.provincia?.nombre || '',
          pais: userData.direccion?.localidad?.provincia?.pais?.nombre || ''
        }
      });
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/account');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('direccion.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        direccion: {
          ...prev.direccion,
          [field]: type === 'number' ? Number(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Validaciones básicas
      if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.email.trim()) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor completa todos los campos obligatorios'
        });
        setIsSaving(false);
        return;
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor ingresa un email válido'
        });
        setIsSaving(false);
        return;
      }

      // Simular actualización en el servidor
      // En una aplicación real, aquí harías una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Crear el objeto usuario actualizado
      const updatedUser: User = {
        ...user!,
        nombre: formData.nombre,
        apellido: formData.apellido,
        dni: formData.dni,
        username: formData.username,
        email: formData.email,
        direccion: formData.direccion.domicilio ? {
          id: user?.direccion?.id || Date.now(),
          domicilio: formData.direccion.domicilio,
          casa: formData.direccion.casa,
          localidad: {
            id: user?.direccion?.localidad?.id || Date.now(),
            nombre: formData.direccion.localidad,
            codigoPostal: formData.direccion.codigoPostal,
            provincia: {
              id: user?.direccion?.localidad?.provincia?.id || Date.now(),
              nombre: formData.direccion.provincia,
              pais: {
                id: user?.direccion?.localidad?.provincia?.pais?.id || Date.now(),
                nombre: formData.direccion.pais
              }
            }
          }
        } : null
      };

      // Actualizar localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);

      Swal.fire({
        icon: 'success',
        title: '¡Perfil actualizado!',
        text: 'Tu información ha sido guardada correctamente',
        timer: 2000,
        showConfirmButton: false
      });

      // Regresar al dashboard después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar tu perfil. Inténtalo de nuevo.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
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
          <h1 style={{ 
            color: '#333',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            Editar Perfil
          </h1>

          <form onSubmit={handleSubmit}>
            {/* Información Personal */}
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #e9ecef',
              marginBottom: '1.5rem'
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
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: 'bold',
                    color: '#495057'
                  }}>
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: 'bold',
                    color: '#495057'
                  }}>
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: 'bold',
                    color: '#495057'
                  }}>
                    DNI
                  </label>
                  <input
                    type="number"
                    name="dni"
                    value={formData.dni || ''}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: 'bold',
                    color: '#495057'
                  }}>
                    Usuario
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: 'bold',
                    color: '#495057'
                  }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Información de Dirección */}
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              border: '1px solid #e9ecef',
              marginBottom: '2rem'
            }}>
              <h2 style={{ 
                color: '#495057',
                marginBottom: '1rem',
                fontSize: '1.25rem'
              }}>
                Dirección
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: 'bold',
                    color: '#495057'
                  }}>
                    Domicilio
                  </label>
                  <input
                    type="text"
                    name="direccion.domicilio"
                    value={formData.direccion.domicilio}
                    onChange={handleInputChange}
                    placeholder="Ej: Av. San Martín 1234"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: 'bold',
                    color: '#495057'
                  }}>
                    Casa/Depto
                  </label>
                  <input
                    type="text"
                    name="direccion.casa"
                    value={formData.direccion.casa}
                    onChange={handleInputChange}
                    placeholder="Ej: Casa 5, Depto 2B"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: 'bold',
                    color: '#495057'
                  }}>
                    Localidad
                  </label>
                  <input
                    type="text"
                    name="direccion.localidad"
                    value={formData.direccion.localidad}
                    onChange={handleInputChange}
                    placeholder="Ej: Ciudad"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: 'bold',
                    color: '#495057'
                  }}>
                    Código Postal
                  </label>
                  <input
                    type="number"
                    name="direccion.codigoPostal"
                    value={formData.direccion.codigoPostal || ''}
                    onChange={handleInputChange}
                    placeholder="Ej: 5500"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: 'bold',
                    color: '#495057'
                  }}>
                    Provincia
                  </label>
                  <input
                    type="text"
                    name="direccion.provincia"
                    value={formData.direccion.provincia}
                    onChange={handleInputChange}
                    placeholder="Ej: Mendoza"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: 'bold',
                    color: '#495057'
                  }}>
                    País
                  </label>
                  <input
                    type="text"
                    name="direccion.pais"
                    value={formData.direccion.pais}
                    onChange={handleInputChange}
                    placeholder="Ej: Argentina"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  opacity: isSaving ? 0.6 : 1
                }}
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSaving}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  opacity: isSaving ? 0.6 : 1
                }}
              >
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EditProfile;