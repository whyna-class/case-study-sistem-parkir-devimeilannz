// src/parkir/parkir.controller.ts
import { 
    Controller, Get, Post, Body, Patch, Param, Delete, 
    ParseIntPipe, HttpCode, HttpStatus, 
    Query, DefaultValuePipe // <--- Wajib di-import
} from '@nestjs/common';
import { ParkirService } from './parkir.service';
import { CreateParkirDto } from './dto/create-parkir.dto';
import { UpdateParkirDto } from './dto/update-parkir.dto';
import { jenisKendaraan, Parkir } from '@prisma/client';

@Controller('parkir') 
export class ParkirController {
  constructor(private readonly parkirService: ParkirService) {}

  @Post() // Rute: POST /parkir
  create(@Body() createParkirDto: CreateParkirDto): Promise<Parkir> {
    return this.parkirService.create(createParkirDto);
  }
  
  // Rute: GET /parkir/total
  @Get('total') 
  getTotalPendapatan(): Promise<{ totalPendapatan: number }> {
    return this.parkirService.getTotalPendapatan();
  }

  // GET /parkir (DIUBAH: Menambahkan Query Parameters)
  // Contoh penggunaan: /parkir?page=1&limit=5&search=B 123&jenisKendaraan=roda4
  @Get() 
  findAll(
    @Query('search') search?: string,
    @Query('jenisKendaraan') jeniskendaraan?: jenisKendaraan,
    // Gunakan DefaultValuePipe dan ParseIntPipe untuk pagination
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return this.parkirService.findAll({ search, jeniskendaraan, page, limit });
  }

  @Get(':id') // Rute: GET /parkir/:id
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Parkir> {
    return this.parkirService.findOne(id);
  }

  @Patch(':id') // Rute: PATCH /parkir/:id
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateParkirDto: UpdateParkirDto,
  ): Promise<Parkir> {
    return this.parkirService.update(id, updateParkirDto);
  }

  @Delete(':id') // Rute: DELETE /parkir/:id
  @HttpCode(HttpStatus.NO_CONTENT) 
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.parkirService.remove(id);
  }
}