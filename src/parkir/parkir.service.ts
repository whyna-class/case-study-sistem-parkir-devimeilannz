// src/parkir/parkir.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateParkirDto } from './dto/create-parkir.dto';
import { UpdateParkirDto } from './dto/update-parkir.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Parkir, Prisma , jenisKendaraan} from '@prisma/client'; // Import 'Prisma' untuk tipe where input

// Definisikan interface untuk query yang masuk
interface ParkirQuery {
  search?: string;
  jeniskendaraan?: jenisKendaraan;
  page?: number;
  limit?: number;
}

@Injectable()
export class ParkirService {
  constructor(private prisma: PrismaService) {}

  // Logika Perhitungan Tarif (Tidak diubah)
  private hitungTotalBiaya(jenisKendaraan: jenisKendaraan, durasi: number): number {
    let tarifJamPertama: number;
    let tarifJamBerikutnya: number;

    if (jenisKendaraan === 'RODA2') {
      tarifJamPertama = 3000;
      tarifJamBerikutnya = 2000;
    } else if (jenisKendaraan === 'RODA4') {
      tarifJamPertama = 6000;
      tarifJamBerikutnya = 4000;
    } else {
      throw new Error('Jenis kendaraan tidak valid.');
    }

    if (durasi <= 1) {
      return tarifJamPertama;
    } else {
      const totalTambahan = (durasi - 1) * tarifJamBerikutnya;
      return tarifJamPertama + totalTambahan;
    }
  }

  // POST /parkir (Tidak diubah)
  async create(createParkirDto: CreateParkirDto): Promise<Parkir> {
    const { jenisKendaraan, durasi, platNomor } = createParkirDto;
    const total = this.hitungTotalBiaya(jenisKendaraan, durasi);

    return this.prisma.parkir.create({
      data: {
        platNomor,
        jenisKendaraan,
        durasi,
        total,
      },
    });
  }

  // GET /parkir (DIUBAH TOTAL: Menambahkan Search, Filter, Pagination)
  async findAll(query: ParkirQuery): Promise<{ data: Parkir[], totalData: number, totalPages: number }> {
    // 1. Pagination Setup
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ParkirWhereInput = {};

    // 2. Search Logic (Berdasarkan platNomor)
    if (query.search) {
      where.platNomor = {
        contains: query.search,
      };
    }

    // 3. Filter Logic (Berdasarkan jenisKendaraan)
    if (query.jeniskendaraan) {
      where.jenisKendaraan = query.jeniskendaraan;
    }

    // Hitung total data yang sesuai dengan filter
    const totalData = await this.prisma.parkir.count({ where });

    // Ambil data dengan pagination
    const data = await this.prisma.parkir.findMany({
      where,
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: 'desc', // Urutkan dari yang terbaru
      },
    });

    const totalPages = Math.ceil(totalData / limit);

    return { 
      data, 
      totalData, 
      totalPages,
    };
  }

  // GET /parkir/:id (Tidak diubah)
  async findOne(id: number): Promise<Parkir> {
    const parkir = await this.prisma.parkir.findUnique({
      where: { id },
    });

    if (!parkir) {
      throw new NotFoundException(`Data parkir dengan ID ${id} tidak ditemukan.`);
    }
    return parkir;
  }

  // GET /parkir/total (Tidak diubah)
  async getTotalPendapatan(): Promise<{ totalPendapatan: number }> {
    const result = await this.prisma.parkir.aggregate({
      _sum: {
        total: true,
      },
    });

    const totalPendapatan = result._sum.total || 0;
    return { totalPendapatan };
  }

  // PATCH /parkir/:id (Tidak diubah)
  async update(id: number, updateParkirDto: UpdateParkirDto): Promise<Parkir> {
    const existingParkir = await this.findOne(id);
    
    const totalBaru = this.hitungTotalBiaya(existingParkir.jenisKendaraan, existingParkir.durasi);

    return this.prisma.parkir.update({
      where: { id },
      data: {
        durasi: updateParkirDto.durasi,
        total: totalBaru,
      },
    });
  }
  
  // DELETE /parkir/:id (Tidak diubah)
  async remove(id: number): Promise<void> {
    try {
      await this.prisma.parkir.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Data parkir dengan ID ${id} tidak ditemukan.`);
    }
  }
}