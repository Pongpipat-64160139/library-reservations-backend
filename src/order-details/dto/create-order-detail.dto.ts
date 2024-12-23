import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOrderDetailDto {
  @IsString()
  @IsNotEmpty()
  Serve_Time: string;

  @IsString()
  @IsNotEmpty()
  Serve_Name: string;

  @IsString()
  @IsNotEmpty()
  Serve_Categories: string;

  @IsNumber()
  @IsNotEmpty()
  Quantity: number;

  @IsNumber()
  @IsNotEmpty()
  CostPerson: number;

  @IsNumber()
  @IsNotEmpty()
  srb_Id: number;
}
