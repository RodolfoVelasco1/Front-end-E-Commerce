import { IBase } from "./IBase";
import { IProducto } from "./IProducto";
import { IDescuento } from "./IDescuento";
import { IImagen } from "./IImagen";
import { IStock } from "./IStock";

export interface IDetalleProducto extends IBase {
  color: string;
  activo: boolean;
  producto: IProducto;
  descuento: IDescuento | null;
  imagenes: IImagen[];
  stocks: IStock[];
}