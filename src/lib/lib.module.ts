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
    Tags.GenOneBadgesTag,
    Tags.GenOneBoxesTag,
    Tags.GenOneInfoTag,
    Tags.GenOneOwnerTag,
    Tags.GenOneSkinsTag,
    Tags.GenOneSkinsArmsTag,
    Tags.GenTwoBadgesTag,
    Tags.GenTwoBoxesTag,
    Tags.GenTwoInfoTag,
    Tags.GenTwoOwnerTag,
    Tags.GenTwoSkinsTag,
    Tags.GenTwoSkinsArmsTag,
    Pipes.AmountPipe,
    Pipes.AssetPipe,
    Pipes.IdentityPipe,
    Pipes.TransactionPipe,
    Pipes.TruncatePipe,
  ],
  exports: [
    Tags.PagerTag,
    Tags.GenOneBadgesTag,
    Tags.GenOneBoxesTag,
    Tags.GenOneInfoTag,
    Tags.GenOneOwnerTag,
    Tags.GenOneSkinsTag,
    Tags.GenOneSkinsArmsTag,
    Tags.GenTwoBadgesTag,
    Tags.GenTwoBoxesTag,
    Tags.GenTwoInfoTag,
    Tags.GenTwoOwnerTag,
    Tags.GenTwoSkinsTag,
    Tags.GenTwoSkinsArmsTag,
    Pipes.AmountPipe,
    Pipes.AssetPipe,
    Pipes.IdentityPipe,
    Pipes.TransactionPipe,
    Pipes.TruncatePipe,
  ]
})
export class LibModule { }