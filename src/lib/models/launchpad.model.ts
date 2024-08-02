export class LaunchpadModel {
    initialised: boolean = false;
    collections: Array<CollectionModel> = [];
}

export class CollectionModel {
    id: string = '';
    singular_name: string = '';
    plural_name: string = '';
    description: string = '';
    artist_name: string = '';
    item_digits: number = 0;
    social_twitter: string = '';
    social_discord: string = '';
    seller_market_share: number = 0;
    artist_market_share: number = 0;
    admin_market_share: number = 0;
    rename_price: number = 0;
    rename_admin_share: number = 0;
    rename_treasury_share: number = 0;
    rename_burner_share: number = 0;
    params: Array<ParamModel> = [];
    items: Array<ItemModel> = [];
    platform_asset_id: number = 0;
    stats_count: number = 0;
    stats_owners: number = 0;
    stats_listed: number = 0;
    contracts: any = {};
}

export class ItemModel {
    id: number = 0;
    score: number = 0;
    rank: number = 0;
    image: string = '';
    params: Array<ParamModel> = [];
    platform_asset_id: number = 0;
    item_asset_id: number = 0;
    rewards: number = 0;
    price: number = 0;
    seller: string = '';
    owner: string = '';
    name: string = '';
    application_id: number = 0;
    application_address: string = '';
    score_display: number = 0;
    id_text: string = '';
    url: string = '';
    is_listed: boolean = false;
}

export class ParamModel {
    name: string = '';
    values: Array<string> = [];
}