import { IBase } from "./IBase";
import { IRol } from "./IRol";
import { IDireccion } from "./IDireccion";

export interface IUsuario extends IBase {
  nombre: string;
  apellido: string;
  password?: string; // Opcional en el frontend
  dni: number;
  username: string;
  rol: IRol;
  direccion: IDireccion;
}