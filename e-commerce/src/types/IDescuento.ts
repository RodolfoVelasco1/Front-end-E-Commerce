import { IBase } from "./IBase";

export interface IDescuento extends IBase {
  nombre: string;
  fechaInicio: string; // ISO date string
  fechaFin: string; // ISO date string
  porcentaje: number;
}