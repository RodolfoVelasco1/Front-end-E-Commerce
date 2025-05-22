import { IBase } from "./IBase";
import { ILocalidad } from "./ILocalidad";

export interface IDireccion extends IBase {
  domicilio: string;
  casa: string;
  localidad: ILocalidad;
}