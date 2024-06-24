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
    Tags.ChipTag,
    Tags.PagerTag,
    Tags.PrimeBadgesTag,
    Tags.PrimeBoxesTag,
    Tags.PrimeInfoTag,
    Tags.PrimeOwnerTag,
    Tags.PrimeSkinsTag,
    Tags.PrimeSkinsGenOneZeroTag,
    Tags.PrimeSkinsGenTwoZeroTag,
    Pipes.AmountPipe,
    Pipes.ApplicationPipe,
    Pipes.AssetPipe,
    Pipes.IdentityPipe,
    Pipes.TransactionPipe,
    Pipes.TruncatePipe,
  ],
  exports: [
    Tags.ChipTag,
    Tags.PagerTag,
    Tags.PrimeBadgesTag,
    Tags.PrimeBoxesTag,
    Tags.PrimeInfoTag,
    Tags.PrimeOwnerTag,
    Tags.PrimeSkinsTag,
    Tags.PrimeSkinsGenOneZeroTag,
    Tags.PrimeSkinsGenTwoZeroTag,
    Pipes.AmountPipe,
    Pipes.ApplicationPipe,
    Pipes.AssetPipe,
    Pipes.IdentityPipe,
    Pipes.TransactionPipe,
    Pipes.TruncatePipe,
  ]
})
export class LibModule { }