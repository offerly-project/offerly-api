export interface IObserver {
	url: string;
	getDeltaOffers(): Promise<string[]>;
}
