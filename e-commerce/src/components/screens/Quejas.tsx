import { useState } from "react";
import Navbar from "../ui/Navbar/Navbar";
import Footer from "../ui/Footer/Footer";
import styles from './Quejas.module.css';

const Quejas = () => {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (nombre.trim() === "" || mensaje.trim() === "") {
      alert("Por favor, completa todos los campos.");
      return;
    }

    console.log("Queja enviada:", { nombre, mensaje });
    setEnviado(true);
    setNombre("");
    setMensaje("");
  };

  return (
    <div className={styles.complainsContainer}>
        <Navbar />
        <div className={styles.complainsFormContainer}>
        <h2>Libro de Quejas</h2>
        {enviado && <p style={{ color: "green" }}>¡Queja enviada correctamente!</p>}
        <form className={styles.complainsForm} onSubmit={handleSubmit}>
            <label>
            Nombre:
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </label>
            <br />
            <label>
            Escribe tu queja:
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

export default Quejas;