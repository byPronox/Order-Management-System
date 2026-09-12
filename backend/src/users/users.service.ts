import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(dto: CreateUserDto) {
    const existing = await this.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: dto.role,
    });
    return this.usersRepository.save(user);
  }
}