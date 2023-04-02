import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { TabsComponent } from './tabs/tabs.component';
import { TabComponent } from './tabs/tab.component';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { TreinosComponent } from './treinos/treinos.component';
import { FooterComponent } from './footer/footer.component';
import { ExerciseComponent } from './exercise/exercise.component';

import { TreinosService } from './treinos.service';
import { PlanosComponent } from './planos/planos.component';
import { PlanComponent } from './plan/plan.component';
import { WorkoutComponent } from './workout/workout.component';
import { PhysicalEvaluationComponent } from './physical-evaluation/physical-evaluation.component';
import { PhysicalEvaluationCreateComponent } from './physical-evaluation-create/physical-evaluation-create.component';
import { PhysicalEvaluationDetailsComponent } from './physical-evaluation-details/physical-evaluation-details.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    TreinosComponent,
    FooterComponent,
    TabComponent,
    TabsComponent,
    ExerciseComponent,
    PlanosComponent,
    PlanComponent,
    WorkoutComponent
    ExerciseComponent,
    PhysicalEvaluationComponent,
    PhysicalEvaluationCreateComponent,
    PhysicalEvaluationDetailsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'treinos', component: TreinosComponent },
      { path: 'physicalEvaluation', component: PhysicalEvaluationComponent },
      { path: 'physicalEvaluation/create', component: PhysicalEvaluationCreateComponent },
      { path: 'physicalEvaluation/details/:id', component: PhysicalEvaluationDetailsComponent },
      { path: 'planos', component: PlanosComponent },
    ]),
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
