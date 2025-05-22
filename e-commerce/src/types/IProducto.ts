import { IBase } from "./IBase";
import { ISexo } from "./ISexo";
import { ITipoProducto } from "./ITipoProducto";
import { ICategoria } from "./ICategoria";

export interface IProducto extends IBase {
  nombre: string;
  sexo: ISexo;
  precio_compra: number;
  precio_venta: number;
  tipoProducto: ITipoProducto;
  categorias: ICategoria[];
}