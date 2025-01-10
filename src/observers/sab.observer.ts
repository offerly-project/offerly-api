import { IObserver } from "./observers";

export class SabObserver implements IObserver {
	url =
		"https://www.sab.com/en/personal/compare-credit-cards/credit-card-special-offers/shopping/?selected=all";

	async getDeltaOffers() {
		return [];
	}
}
