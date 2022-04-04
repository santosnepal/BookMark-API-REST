import {
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class editUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsString()
  @IsOptional()
  firstname?: string;
  @IsString()
  @IsOptional()
  lastname?: string;
}
