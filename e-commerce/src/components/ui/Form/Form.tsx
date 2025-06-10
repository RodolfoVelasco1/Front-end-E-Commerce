import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import styles from './Form.module.css';
import useStore from '../../../store/store'; // Ajusta la ruta según tu estructura

// Esquemas de validación
const registerSchema = yup.object().shape({
  nombre: yup
    .string()
    .required('El nombre es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  apellido: yup
    .string()
    .required('El apellido es obligatorio')
    .min(2, 'El apellido debe tener al menos 2 caracteres'),
  dni: yup
    .number()
    .required('El DNI es obligatorio')
    .positive('El DNI debe ser un número positivo')
    .integer('El DNI debe ser un número entero'),
  username: yup
    .string()
    .required('El nombre de usuario es obligatorio')
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  email: yup
    .string()
    .email('Ingrese un correo electrónico válido')
    .required('El correo electrónico es obligatorio'),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Por favor confirme su contraseña')
});

const loginSchema = yup.object().shape({
  username: yup.string().required('El nombre de usuario es obligatorio'),
  password: yup.string().required('La contraseña es obligatoria')
});

type RegisterFormData = yup.InferType<typeof registerSchema>;
type LoginFormData = yup.InferType<typeof loginSchema>;
type FormType = 'register' | 'login';

const Form = () => {
  const navigate = useNavigate();
  const login = useStore(state => state.login); // Hook del store
  const [formType, setFormType] = useState<FormType>('login');
  const [isLoading, setIsLoading] = useState(false);

  const initialRegisterValues: RegisterFormData = {
    nombre: '',
    apellido: '',
    dni: 0,
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  const initialLoginValues: LoginFormData = {
    username: '',
    password: ''
  };

  const [registerData, setRegisterData] = useState<RegisterFormData>(initialRegisterValues);
  const [loginData, setLoginData] = useState<LoginFormData>(initialLoginValues);
  const [registerErrors, setRegisterErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [loginErrors, setLoginErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});

  const validateField = async (name: string, value: string | number) => {
    try {
      if (formType === 'register') {
        await registerSchema.validateAt(name, { ...registerData, [name]: value });
        setRegisterErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name as keyof RegisterFormData];
          return newErrors;
        });
      } else {
        await loginSchema.validateAt(name, { ...loginData, [name]: value });
        setLoginErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name as keyof LoginFormData];
          return newErrors;
        });
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        if (formType === 'register') {
          setRegisterErrors(prev => ({
            ...prev,
            [name as keyof RegisterFormData]: error.message
          }));
        } else {
          setLoginErrors(prev => ({
            ...prev,
            [name as keyof LoginFormData]: error.message
          }));
        }
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const processedValue = name === 'dni' ? Number(value) : value;

    if (formType === 'register') {
      setRegisterData(prev => ({ ...prev, [name]: processedValue }));
    } else {
      setLoginData(prev => ({ ...prev, [name]: processedValue }));
    }

    validateField(name, processedValue);
  };

  const checkUsernameExists = async (username: string): Promise<boolean> => {
    try {
      const response = await fetch(`http://localhost:3001/usuarios?username=${username}`);
      const users = await response.json();
      return users.length > 0;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(`http://localhost:3001/usuarios?email=${email}`);
      const users = await response.json();
      return users.length > 0;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const registerUser = async (userData: RegisterFormData) => {
    const usernameExists = await checkUsernameExists(userData.username);
    if (usernameExists) throw new Error('El nombre de usuario ya está en uso');

    const emailExists = await checkEmailExists(userData.email);
    if (emailExists) throw new Error('El correo electrónico ya está registrado');

    const usersResponse = await fetch('http://localhost:3001/usuarios');
    const users = await usersResponse.json();
    const newId = users.length > 0 ? Math.max(...users.map((u: any) => u.id)) + 1 : 1;

    const newUser = {
      id: newId,
      nombre: userData.nombre,
      apellido: userData.apellido,
      dni: userData.dni,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      rol: 'USER',
      direccion: null
    };

    const response = await fetch('http://localhost:3001/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });

    if (!response.ok) throw new Error('Error al crear la cuenta');

    return newUser;
  };

  const loginUser = async (credentials: LoginFormData) => {
    const response = await fetch(
      `http://localhost:3001/usuarios?username=${credentials.username}&password=${credentials.password}`
    );
    const users = await response.json();
    if (users.length === 0) throw new Error('Credenciales incorrectas');
    return users[0];
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formType === 'register') {
        await registerSchema.validate(registerData, { abortEarly: false });
        const newUser = await registerUser(registerData);
        login(newUser); // Usar el método del store
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Cuenta creada exitosamente',
          confirmButtonColor: '#4a90e2'
        }).then(() => navigate('/usuario'));
      } else {
        await loginSchema.validate(loginData, { abortEarly: false });
        const user = await loginUser(loginData);
        login(user); // Usar el método del store
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido de vuelta!',
          text: `Hola ${user.nombre}`,
          confirmButtonColor: '#4a90e2'
        }).then(() => navigate('/usuario'));
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors: any = {};
        error.inner.forEach(err => {
          if (err.path) newErrors[err.path] = err.message;
        });
        if (formType === 'register') setRegisterErrors(newErrors);
        else setLoginErrors(newErrors);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error instanceof Error ? error.message : 'Ocurrió un error inesperado',
          confirmButtonColor: '#e74c3c'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchFormType = (type: FormType) => {
    setFormType(type);
    setRegisterErrors({});
    setLoginErrors({});
  };

  const renderRegisterForm = () => (
    <>
      {['nombre', 'apellido', 'dni', 'username', 'email', 'password', 'confirmPassword'].map(field => (
        <div key={field} className={styles.inputContainer}>
          <label htmlFor={field}>
            {field === 'password' ? 'Contraseña' :
            field === 'confirmPassword' ? 'Confirmar Contraseña' :
            field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            type={field.includes('password') ? 'password' :
                  field === 'email' ? 'email' :
                  'text'}
            name={field}
            id={field}
            placeholder={field === 'password' ? 'Contraseña' :
                        field === 'confirmPassword' ? 'Confirmar Contraseña' :
                        field.charAt(0).toUpperCase() + field.slice(1)}
            value={registerData[field as keyof RegisterFormData]}
            onChange={handleChange}
          />
          {registerErrors[field as keyof RegisterFormData] && (
            <div className={styles.error}>{registerErrors[field as keyof RegisterFormData]}</div>
          )}
        </div>
      ))}
    </>
  );

  const fieldLabels: Record<string, string> = {
    username: 'Nombre de usuario',
    password: 'Contraseña',
  };

  const renderLoginForm = () => (
    <>
      {['username', 'password'].map(field => (
        <div key={field} className={styles.inputContainer}>
          <label htmlFor={field}>{fieldLabels[field]}</label>
          <input
            id={field}
            type={field === 'password' ? 'password' : 'text'}
            name={field}
            placeholder={fieldLabels[field]}
            value={loginData[field as keyof LoginFormData]}
            onChange={handleChange}
          />
          {loginErrors[field as keyof LoginFormData] && (
            <div className={styles.error}>{loginErrors[field as keyof LoginFormData]}</div>
          )}
        </div>
      ))}
    </>
  );

  return (
    <div>
      <div className={styles.pageContainer}>
        <div className={styles.formContainer}>
          <div className={styles.tabContainer}>
            <button
              className={`${styles.tabButton} ${formType === 'register' ? styles.activeTab : ''}`}
              onClick={() => switchFormType('register')}
            >
              Registro
            </button>
            <button
              className={`${styles.tabButton} ${formType === 'login' ? styles.activeTab : ''}`}
              onClick={() => switchFormType('login')}
            >
              Iniciar Sesión
            </button>
          </div>
          <h1 className={styles.formTitle}>
            {formType === 'register' ? 'Registro de Usuario' : 'Iniciar Sesión'}
          </h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            {formType === 'register' ? renderRegisterForm() : renderLoginForm()}
            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? 'Cargando...' : formType === 'register' ? 'Registrarse' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;