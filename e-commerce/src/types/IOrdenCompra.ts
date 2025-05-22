import { IBase } from "./IBase";
import { IUsuario } from "./IUsuario";

export interface IOrdenCompra extends IBase {
  usuario: IUsuario;
  fecha_compra: string; // ISO date string
  total: number;
}