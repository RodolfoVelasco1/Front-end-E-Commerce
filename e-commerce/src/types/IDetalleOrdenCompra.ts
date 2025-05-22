import { IBase } from "./IBase";
import { IDetalleProducto } from "./IDetalleProducto";
import { IOrdenCompra } from "./IOrdenCompra";

export interface IDetalleOrdenCompra extends IBase {
  detalleProducto: IDetalleProducto;
  ordenCompra: IOrdenCompra;
  cantidad: number;
}