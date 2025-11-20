// src/parkir/dto/update-parkir.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateParkirDto } from './create-parkir.dto';
import { IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { $Enums, jenisKendaraan } from '@prisma/client';

// Mewarisi properti opsional dari CreateParkirDto
export class UpdateParkirDto extends PartialType(CreateParkirDto) {
    static jenisKendaraan(jenisKendaraan: any, durasi: number) {
      throw new Error('Method not implemented.');
    }

    @Type(() => Number)
    @IsNumber({}, { message: 'durasi harus berupa angka.' })
    @Min(1, { message: 'durasi harus lebih dari 0.' })
    @IsOptional() // Tambahkan IsOptional karena ini DTO untuk PATCH
    durasi: number;
    jenisKendaraan?: jenisKendaraan
    static durasi: number;
}

