import { IBank } from "../models/bank.model";
import { banksRepository } from "../repositories/banks.repository";
import { CreateBankBodyData } from "../schemas/bank.schemas";

export class BanksService {
	createNewBank(bank: CreateBankBodyData) {
		const newBank: IBank = {
			country: bank.country,
			type: bank.type,
			name: bank.name,
			logo: bank.logo,
			status: "enabled",
			cards: [],
		};
		return banksRepository.create(newBank);
	}
}

export const banksService = new BanksService();
