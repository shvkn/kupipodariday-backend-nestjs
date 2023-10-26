import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { IsString, IsUrl, Length } from 'class-validator';
import { JoinTable } from 'typeorm';

@Entity()
export class Wishlist {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiProperty()
  @Column()
  @IsUrl()
  image: string;

  @OneToOne(() => User)
  @JoinColumn()
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
