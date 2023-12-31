// External dependencies
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutComponent } from './layout/layout.component';
import { MaterialModule } from './shared/material/material.module';
import { SharedModule } from './shared/shared.module';
import { CategoriesComponent } from './components/categories.component';
import { RecipeCreateComponent } from './components/recipe-create/recipe-create.component';
import { RecipesListComponent } from './recipes-list/recipes-list.component';
import { RecipeViewComponent } from './recipe-view/recipe-view.component';
import { RecipeEditComponent } from './components/recipe-edit/recipe-edit.component';
import { IngredientDeleteConfirmComponent } from './components/ingredient-delete-confirm/ingredient-delete-confirm.component';
import { StepDeleteConfirmComponent } from './components/step-delete-confirm/step-delete-confirm.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    CategoriesComponent,
    RecipeCreateComponent,
    RecipesListComponent,
    RecipeViewComponent,
    RecipeEditComponent,
    IngredientDeleteConfirmComponent,
    StepDeleteConfirmComponent,
  ],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
