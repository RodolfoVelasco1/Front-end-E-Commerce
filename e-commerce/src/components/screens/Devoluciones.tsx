import { useState } from "react";
import Navbar from "../ui/Navbar/Navbar";
import Footer from "../ui/Footer/Footer";
import styles from './Devoluciones.module.css';

const Devoluciones= () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [compra, setCompra] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (nombre.trim() === "" || mensaje.trim() === "") {
      alert("Por favor, completa todos los campos.");
      return;
    }

    console.log("Devolución registrada:", { nombre, mensaje });
    setEnviado(true);
    setNombre("");
    setCorreo("");
    setCompra("");
    setMensaje("");
  };

  return (
    <div className={styles.returnContainer}>
        <Navbar />
        <div className={styles.returnFormContainer}>
        <h2>Devoluciones</h2>
        {enviado && <p style={{ color: "green" }}>¡Su devolución se registró correctamente! ¡Pronto nos comunicaremos con usted!</p>}
        <form className={styles.returnForm} onSubmit={handleSubmit}>
            <label>
            Nombre:
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </label>
            <br />
            <label>
            Correo Electrónico:
            <input type="text" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
            </label>
            <br />
            <label>
            Ingrese la información de su compra y su producto:
            <input type="text" value={compra} onChange={(e) => setCompra(e.target.value)} required />
            </label>
            <br />
            <label>
            Razón de la devolución:
            <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} required />
            </label>
            <br />
            <button type="submit">Enviar Queja</button>
        </form>
        </div>
        <Footer />
    </div>
    
  );
};

export default Devoluciones;