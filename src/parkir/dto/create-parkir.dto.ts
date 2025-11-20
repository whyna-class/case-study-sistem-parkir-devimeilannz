// src/parkir/dto/create-parkir.dto.ts
import { IsNotEmpty, IsIn, IsNumber, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { jenisKendaraan } from '@prisma/client';

export class CreateParkirDto {
  @IsString({ message: 'platNomor harus berupa teks.' })
  @IsNotEmpty({ message: 'platNomor tidak boleh kosong.' }) 
  platNomor: string; // Diubah: plat_nomor -> platNomor

  @IsString({ message: 'jenisKendaraan harus berupa teks.' })
  @IsIn(['RODA2', 'RODA4'], { message: 'jenisKendaraan hanya boleh "roda2" atau "roda4".' }) 
  jenisKendaraan: jenisKendaraan; // Diubah: jenis_kendaraan -> jenisKendaraan

  @Type(() => Number)
  @IsNumber({}, { message: 'durasi harus berupa angka.' })
  @Min(1, { message: 'durasi harus lebih dari 0.' }) 
  durasi: number;
}