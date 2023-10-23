import { IsUrl, MaxLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @MaxLength(250)
  name: string;

  @Column()
  @IsUrl()
  image: string;

  @OneToOne(() => User)
  @JoinColumn()
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  @Column()
  @MaxLength(1500)
  description: string;
}
