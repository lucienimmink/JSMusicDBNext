import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LettersRoutingModule } from './letters-routing.module';
import { LettersComponent } from './letters/letters.component';

@NgModule({
  declarations: [LettersComponent],
  imports: [
    CommonModule,
    LettersRoutingModule
  ]
})
export class LettersModule { }
