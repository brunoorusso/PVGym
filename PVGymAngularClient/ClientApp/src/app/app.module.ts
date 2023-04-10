import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { PlanosComponent } from './planos/planos.component';
import { PlanComponent } from './plan/plan.component';
import { WorkoutComponent } from './workout/workout.component';
import { PhysicalEvaluationComponent } from './physical-evaluation/physical-evaluation.component';
import { PhysicalEvaluationCreateComponent } from './physical-evaluation-create/physical-evaluation-create.component';
import { PhysicalEvaluationDetailsComponent } from './physical-evaluation-details/physical-evaluation-details.component';
import { ModalComponent } from './modal/modal.component';
import { NotificationComponent } from './notification/notification.component';
import { NotificationDetailsComponent } from './notification-details/notification-details.component';
import { AulasComponent } from './aulas/aulas.component';

import { TreinosService } from './treinos.service';
import { AulasDisponiveisComponent } from './aulas-disponiveis/aulas-disponiveis.component';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { ProfileComponent } from './profile/profile.component';
import { InfoModalComponent } from './info-modal/info-modal.component';
import { AulaDescricaoComponent } from './aula-descricao/aula-descricao.component';


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
    WorkoutComponent,
    PhysicalEvaluationComponent,
    PhysicalEvaluationCreateComponent,
    PhysicalEvaluationDetailsComponent,
    ModalComponent,
    NotificationComponent,
    NotificationDetailsComponent,
    LoginComponent,
    RegisterComponent,
    AddStaffComponent,
    ProfileComponent,
    AulasComponent,
    AulasDisponiveisComponent,
    AulaDescricaoComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'treinos', component: TreinosComponent },
      { path: 'physicalEvaluation', component: PhysicalEvaluationComponent },
      { path: 'notification', component: NotificationComponent },
      { path: 'planos', component: PlanosComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'add-staff', component: AddStaffComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'aulas', component: AulasComponent },
      { path: 'aulasDisponiveis', component: AulasDisponiveisComponent },
    ]),
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
