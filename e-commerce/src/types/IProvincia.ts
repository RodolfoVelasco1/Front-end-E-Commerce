import { IBase } from "./IBase";
import { IPais } from "./IPais";

export interface IProvincia extends IBase {
  nombre: string;
  pais: IPais;
}