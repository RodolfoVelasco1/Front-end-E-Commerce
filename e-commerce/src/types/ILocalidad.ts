import { IBase } from "./IBase";
import { IProvincia } from "./IProvincia.ts";

export interface ILocalidad extends IBase {
  nombre: string;
  codigoPostal: number;
  provincia: IProvincia;
}