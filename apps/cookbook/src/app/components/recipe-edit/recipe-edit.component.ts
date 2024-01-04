import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryType, RecipeModel } from '@cookbook/models';
import { RecipeService } from '../../shared/recipes/recipe.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { IngredientDeleteConfirmComponent } from '../ingredient-delete-confirm/ingredient-delete-confirm.component';
import { StepDeleteConfirmComponent } from '../step-delete-confirm/step-delete-confirm.component';
import { StepService } from '../../shared/steps/step.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.scss',
})
export class RecipeEditComponent implements OnInit {
  public loading = true;
  public recipe!: RecipeModel;
  public categories = Object.values(CategoryType);

  public disableDeleteStepButton = false;
  public stepConfirmButton = false;
  public disableMoveStepButton = false;

  public addNumber: number = 0;

  private recipeId!: string;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private readonly recipeService: RecipeService,
    private readonly stepService: StepService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog,
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

  ngOnInit(): void {
    this.recipeId = this.route.snapshot.params['recipeId'];

    const sub = this.recipeService.view(this.recipeId).subscribe({
      next: (recipe) => {
        // fill the form with the recipe data
        this.recipeForm.patchValue({
          title: recipe.title,
          duration: recipe.duration,
        });

        // fill the form with the recipe.ingredient data
        recipe.ingredients.forEach((ingredient) => {
          this.ingredients.push(
            this.fb.group({
              name: this.fb.nonNullable.control<string>(
                ingredient.name,
                Validators.required,
              ),
              quantity: this.fb.nonNullable.control<string>(
                ingredient.quantity,
                Validators.required,
              ),
            }),
          );
        });

        // fill the form with the recipe.steps data
        recipe.steps.forEach((step) => {
          this.steps.push(
            this.fb.group({
              description: this.fb.control<string>(
                step.description,
                Validators.required,
              ),
              sort: this.fb.control<number>(step.sort, Validators.required),
            }),
          );
        });

        // fill the form with the recipe.categories data
        this.recipeForm.patchValue({
          categories: recipe.categories[0].type,
        });
        this.recipe = recipe;
        this.loading = false;
        console.log(recipe);
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      },
    });
    this.subscriptions.push(sub);
  }

  edit() {
    const recipe = this.recipeForm.value;
    const sub = this.recipeService
      .update(
        this.recipeId,
        recipe.title!,
        recipe.duration!,
        recipe.ingredients!,
        recipe.steps!,
        recipe.categories!,
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/recipes', this.recipeId]);
        },
        error: (error) => {
          console.log(error);
        },
      });
    this.subscriptions.push(sub);
  }

  // Added
  addIngredient() {
    this.ingredients.push(
      this.fb.group({
        name: this.fb.nonNullable.control<string>('', Validators.required),
        quantity: this.fb.nonNullable.control<string>('', Validators.required),
      }),
    );
  }

  addStep() {
    this.stepConfirmButton = true;
    this.disableDeleteStepButton = true;
    this.disableMoveStepButton = true;

    this.addNumber = this.addNumber + 1;
    console.log(this.steps.length);
    this.steps.push(
      this.fb.group({
        description: this.fb.control<string>('', Validators.required),
        sort: this.fb.control<number>(
          this.steps.length + 1,
          Validators.required,
        ),
      }),
    );
  }

  // Delete ingredient
  public deleteIngredient(index: number): void {
    const dialogRef = this.dialog.open(IngredientDeleteConfirmComponent, {
      data: this.recipe.ingredients[index],
    });

    dialogRef.afterClosed().subscribe((ingredient) => {
      if (ingredient) {
        this.router.navigate(['/recipes', this.recipeId]);
      }
    });
  }

  public deleteStep(index: number): void {
    const dialogRef = this.dialog.open(StepDeleteConfirmComponent, {
      data: this.recipe.steps[index],
    });
    dialogRef.afterClosed().subscribe((step) => {
      if (step) {
        this.router.navigate(['/recipes', this.recipeId]);
      }
    });
  }

  // Move
  public moveUp(formArray: FormArray, index: number): void {
    this.recipeForm.get;
    if (index <= 0) {
      return;
    }
    this.stepConfirmButton = true;
    this.disableDeleteStepButton = true;

    const step = formArray.controls[index].value;
    const previousStep = formArray.controls[index - 1].value;

    formArray.controls[index].patchValue({ ...previousStep, sort: step.sort });
    formArray.controls[index - 1].patchValue({
      ...step,
      sort: previousStep.sort,
    });
  }

  public moveDown(formArray: FormArray, index: number): void {
    if (index >= formArray.length - 1) {
      return;
    }
    this.stepConfirmButton = true;
    this.disableDeleteStepButton = true;

    const step = formArray.controls[index].value;
    const nextStep = formArray.controls[index + 1].value;

    formArray.controls[index].patchValue({ ...nextStep, sort: step.sort });
    formArray.controls[index + 1].patchValue({
      ...step,
      sort: nextStep.sort,
    });
  }

  // Validation
  public stepsValidated(): void {
    this.stepConfirmButton = false;
    this.disableDeleteStepButton = false;
    this.disableMoveStepButton = false;
    this.addNumber = 0;

    const steps = this.recipeForm.value.steps;

    const sub = this.stepService.update(this.recipeId, steps!).subscribe({
      next: (steps) => {
        this.recipe.steps = steps;

        this.recipeForm.patchValue({
          steps: steps,
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
    this.subscriptions.push(sub);
  }

  // cancel
  public cancel(): void {
    this.stepConfirmButton = false;
    this.disableDeleteStepButton = false;
    this.disableMoveStepButton = false;

    for (let i = 0; i < this.addNumber; i++) {
      this.steps.removeAt(this.steps.length - 1);
    }
    this.recipeForm.patchValue({
      steps: this.recipe.steps,
    });
    this.addNumber = 0;
  }
}
