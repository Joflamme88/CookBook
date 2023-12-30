import { Component, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryType } from '@cookbook/models';
import { RecipeService } from '../../shared/recipes/recipe.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrl: './recipe-create.component.scss',
})
export class RecipeCreateComponent implements OnDestroy {
  public categories = Object.values(CategoryType);

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private readonly recipeService: RecipeService,
  ) {}

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get steps(): FormArray {
    return this.recipeForm.get('steps') as FormArray;
  }

  public recipeForm = this.fb.group({
    title: this.fb.nonNullable.control<string>('', Validators.required),
    duration: this.fb.nonNullable.control<string>('', Validators.required),
    categories: this.fb.nonNullable.control<CategoryType>(
      CategoryType.Apero,
      Validators.required,
    ),
    ingredients: this.fb.array<FormGroup>([]),
    steps: this.fb.array<FormGroup>([]),
  });

  addIngredient() {
    this.ingredients.push(
      this.fb.group({
        name: this.fb.nonNullable.control<string>('', Validators.required),
        quantity: this.fb.nonNullable.control<string>('', Validators.required),
      }),
    );
  }

  addStep() {
    this.steps.push(
      this.fb.group({
        description: this.fb.control<string>('', Validators.required),
      }),
    );
  }

  public addRecipe() {
    const recipe = this.recipeForm.value;

    const sub = this.recipeService
      .create(
        recipe.title!,
        recipe.duration!,
        recipe.ingredients!,
        recipe.steps!,
        recipe.categories!,
      )
      .subscribe({
        next: (Recipe) => {
          console.log(Recipe);
        },
        error: (error) => {
          console.log(error);
        },
      });
    this.subscriptions.push(sub);
  }

  public ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub?.unsubscribe());
  }
}