import { BadRequestError, NotFoundError } from "../errors/errors";
import { IBank } from "../models/bank.model";
import { banksRepository } from "../repositories/banks.repository";
import { removeUndefinedValuesFromObject } from "../utils/utils";
import {
	CreateBankBodyData,
	UpdateBankBodyData,
} from "../validators/bank.validators";

export class BanksService {
	async createNewBank(bank: CreateBankBodyData) {
		const newBank: IBank = {
			country: bank.country,
			type: bank.type,
			name: bank.name,
			logo: bank.logo,
			status: "enabled",
			cards: [],
		};

		const bankExists = await banksRepository.findByName(newBank.name);

		if (bankExists) {
			throw new BadRequestError("Bank already exists");
		}

		return banksRepository.create(newBank);
	}
	async updateBank(id: string, bank: UpdateBankBodyData) {
		const bankExists = await banksRepository.findById(id);
		if (!bankExists) {
			throw new NotFoundError("Bank not found");
		}
		const patchData = removeUndefinedValuesFromObject<Partial<IBank>>({
			country: bank.country,
			type: bank.type,
			name: bank.name,
			logo: bank.logo,
			status: bank.status,
		});

		banksRepository.update(id, patchData);
	}
}

export const banksService = new BanksService();
