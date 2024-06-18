import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class TowingRequestCreateDto {
  @IsString()
  @IsNotEmpty()
  pickupLocation: string;

  @IsString()
  @IsNotEmpty()
  destinationLocation: string;

  @IsString()
  @IsOptional()
  additionalInfo?: string;
}

export class TowingRequestUpdateDto {
  @IsString()
  @IsOptional()
  pickupLocation?: string;

  @IsString()
  @IsOptional()
  destinationLocation?: string;

  @IsString()
  @IsOptional()
  additionalInfo?: string;
}