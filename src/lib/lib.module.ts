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
    Tags.CollectionTag,
    Tags.ItemImageTag,
    Tags.ItemInfoTag,
    Tags.ItemOwnerTag,
    Tags.LoaderTag,
    Tags.PagerTag,
    Tags.PlayerTag,
    Tags.PrimeBadgesTag,
    Tags.PrimeBoxesTag,
    Tags.PrimeInfoTag,
    Tags.PrimeOwnerTag,
    Tags.PrimeSkinsTag,
    Tags.PrimeSkinsGenOneTag0,
    Tags.PrimeSkinsGenOneTag1,
    Tags.PrimeSkinsGenOneTag2,
    Tags.PrimeSkinsGenTwoTag0,
    Tags.PrimeSkinsGenTwoTag1,
    Tags.PrimeSkinsGenTwoTag2,
    Pipes.AmountPipe,
    Pipes.ApplicationPipe,
    Pipes.AssetPipe,
    Pipes.IdentityPipe,
    Pipes.TransactionPipe,
    Pipes.TruncatePipe,
  ],
  exports: [
    Tags.ChipTag,
    Tags.CollectionTag,
    Tags.ItemImageTag,
    Tags.ItemInfoTag,
    Tags.ItemOwnerTag,
    Tags.LoaderTag,
    Tags.PagerTag,
    Tags.PlayerTag,
    Tags.PrimeBadgesTag,
    Tags.PrimeBoxesTag,
    Tags.PrimeInfoTag,
    Tags.PrimeOwnerTag,
    Tags.PrimeSkinsTag,
    Tags.PrimeSkinsGenOneTag0,
    Tags.PrimeSkinsGenOneTag1,
    Tags.PrimeSkinsGenOneTag2,
    Tags.PrimeSkinsGenTwoTag0,
    Tags.PrimeSkinsGenTwoTag1,
    Tags.PrimeSkinsGenTwoTag2,
    Pipes.AmountPipe,
    Pipes.ApplicationPipe,
    Pipes.AssetPipe,
    Pipes.IdentityPipe,
    Pipes.TransactionPipe,
    Pipes.TruncatePipe,
  ]
})
export class LibModule { }