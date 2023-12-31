import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RecipeModel } from '@cookbook/models';
import { CategoryEntity } from '../categories/category.entity';
import { StepEntity } from '../steps/step.entity';
import { IngredientEntity } from '../ingredients/ingredient.entity';
import { UserEntity } from '../users/user.entity';

@Entity({ name: 'recipe' })
export class RecipeEntity implements RecipeModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  duration: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.recipes, { onDelete: 'CASCADE' })
  user: UserEntity;

  @OneToMany(() => IngredientEntity, (ingredient) => ingredient.recipe, {
    cascade: true,
  })
  ingredients: IngredientEntity[];

  @OneToMany(() => StepEntity, (step) => step.recipe, {
    cascade: true,
  })
  steps: StepEntity[];

  @OneToMany(() => CategoryEntity, (category) => category.recipe, {
    cascade: true,
  })
  categories: CategoryEntity[];
}
