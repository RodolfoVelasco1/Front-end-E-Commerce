import { useState, FormEvent, ChangeEvent } from 'react';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import styles from './Form.module.css';

// Esquemas de validación
const registerSchema = yup.object().shape({
  nombre: yup
    .string()
    .required('El nombre es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
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
  email: yup
    .string()
    .email('Ingrese un correo electrónico válido')
    .required('El correo electrónico es obligatorio'),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
});

// Tipos de datos para los formularios
type RegisterFormData = yup.InferType<typeof registerSchema>;
type LoginFormData = yup.InferType<typeof loginSchema>;
type FormType = 'register' | 'login';

const Form = () => {
  const [formType, setFormType] = useState<FormType>('register');
  
  // Estados iniciales
  const initialRegisterValues: RegisterFormData = {
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  
  const initialLoginValues: LoginFormData = {
    email: '',
    password: ''
  };
  
  const [registerData, setRegisterData] = useState<RegisterFormData>(initialRegisterValues);
  const [loginData, setLoginData] = useState<LoginFormData>(initialLoginValues);
  const [registerErrors, setRegisterErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [loginErrors, setLoginErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});

  // Obtener los datos y errores según el tipo de formulario activo

  const errors = formType === 'register' ? registerErrors : loginErrors;
  
  
  // Validación de campo individual
  const validateField = async (name: string, value: string) => {
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

  // Manejo de cambios en los inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (formType === 'register') {
      setRegisterData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setLoginData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    validateField(name, value);
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      if (formType === 'register') {
        await registerSchema.validate(registerData, { abortEarly: false });
        
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Registro completado correctamente',
          confirmButtonColor: '#4a90e2'
        });
        
        setRegisterData(initialRegisterValues);
        setRegisterErrors({});
      } else {
        await loginSchema.validate(loginData, { abortEarly: false });
        
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Inicio de sesión exitoso',
          confirmButtonColor: '#4a90e2'
        });
        
        setLoginData(initialLoginValues);
        setLoginErrors({});
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors: any = {};
        error.inner.forEach(err => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
        
        if (formType === 'register') {
          setRegisterErrors(newErrors);
        } else {
          setLoginErrors(newErrors);
        }
      }
    }
  };

  // Verificar si hay errores para deshabilitar el botón
  const hasErrors = Object.keys(errors).length > 0;

  // Cambiar entre los tipos de formulario
  const switchFormType = (type: FormType) => {
    setFormType(type);
  };

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
          {formType === 'register' && (
            <div className={styles.inputContainer}>
              <label htmlFor="nombre" className={styles.label}>
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={registerData.nombre}
                onChange={handleChange}
                className={`${styles.input} ${registerErrors.nombre ? styles.inputError : ''}`}
              />
              {registerErrors.nombre && (
                <span className={styles.errorText}>{registerErrors.nombre}</span>
              )}
            </div>
          )}
          
          <div className={styles.inputContainer}>
            <label htmlFor="email" className={styles.label}>
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formType === 'register' ? registerData.email : loginData.email}
              onChange={handleChange}
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>
          
          <div className={styles.inputContainer}>
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formType === 'register' ? registerData.password : loginData.password}
              onChange={handleChange}
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
            />
            {errors.password && (
              <span className={styles.errorText}>{errors.password}</span>
            )}
          </div>
          
          {formType === 'register' && (
            <div className={styles.inputContainer}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={registerData.confirmPassword}
                onChange={handleChange}
                className={`${styles.input} ${registerErrors.confirmPassword ? styles.inputError : ''}`}
              />
              {registerErrors.confirmPassword && (
                <span className={styles.errorText}>{registerErrors.confirmPassword}</span>
              )}
            </div>
          )}
          
          <div className={styles.buttonContainer}>
            <button 
              type="submit" 
              disabled={hasErrors}
              className={`${styles.button} ${hasErrors ? styles.disabled : ''}`}
            >
              {formType === 'register' ? 'Registrarme' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
    
  );
};

export default Form;