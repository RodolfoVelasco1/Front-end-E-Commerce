import { IBase } from "./IBase";
import { ITalle } from "./ITalle";

export interface IStock extends IBase {
  stock: number;
  talle: ITalle;
}