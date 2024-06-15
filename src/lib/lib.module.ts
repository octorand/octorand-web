import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import * as Tags from '@lib/tags';
import * as Pipes from '@lib/pipes';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [
    Tags.PagerTag,
    Tags.PrimeBadgesTag,
    Tags.PrimeBoxesTag,
    Tags.PrimeInfoTag,
    Tags.PrimeOwnerTag,
    Tags.PrimeSkinsTag,
    Tags.PrimeSkinsGenOneArmsTag,
    Tags.PrimeSkinsGenTwoArmsTag,
    Pipes.AmountPipe,
    Pipes.AssetPipe,
    Pipes.IdentityPipe,
    Pipes.TransactionPipe,
    Pipes.TruncatePipe,
  ],
  exports: [
    Tags.PagerTag,
    Tags.PrimeBadgesTag,
    Tags.PrimeBoxesTag,
    Tags.PrimeInfoTag,
    Tags.PrimeOwnerTag,
    Tags.PrimeSkinsTag,
    Tags.PrimeSkinsGenOneArmsTag,
    Tags.PrimeSkinsGenTwoArmsTag,
    Pipes.AmountPipe,
    Pipes.AssetPipe,
    Pipes.IdentityPipe,
    Pipes.TransactionPipe,
    Pipes.TruncatePipe,
  ]
})
export class LibModule { }