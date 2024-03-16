import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import * as Pipes from '@lib/pipes';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [
    Pipes.AmountPipe,
    Pipes.AssetPipe,
    Pipes.IdentityPipe,
    Pipes.TransactionPipe,
    Pipes.TruncatePipe,
  ],
  exports: [
    Pipes.AmountPipe,
    Pipes.AssetPipe,
    Pipes.IdentityPipe,
    Pipes.TransactionPipe,
    Pipes.TruncatePipe,
  ]
})
export class LibModule { }