import { ObjectId } from "mongodb";
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
		const bankExists = await banksRepository.bankNameExists(bank.name);

		if (bankExists) {
			throw new BadRequestError("Bank already exists");
		}

		const newBank: IBank = {
			country: bank.country,
			type: bank.type,
			name: bank.name,
			logo: bank.logo,
			status: "enabled",
			cards: [],
		};

		return banksRepository.add(newBank);
	}
	async updateBank(id: string, bank: UpdateBankBodyData) {
		const bankExists = await banksRepository.findById(id);
		if (!bankExists) {
			throw new NotFoundError("Bank not found");
		}

		if (bank.name) {
			const bankNameExists = await banksRepository.bankNameExists(bank.name);
			if (bankNameExists) {
				throw new BadRequestError("Bank name already exists");
			}
		}

		const patchData = removeUndefinedValuesFromObject<Partial<IBank>>({
			country: bank.country,
			type: bank.type,
			name: bank.name,
			logo: bank.logo,
			status: bank.status,
			cards: bank.cards?.map((card) => new ObjectId(card)),
		});

		banksRepository.update(id, patchData);
	}

	async getBanks() {
		return banksRepository.getAll();
	}

	async getBank(id: string) {
		const bank = await banksRepository.findById(id);
		if (!bank) {
			throw new NotFoundError("Bank not found");
		}
		return bank;
	}
}

export const banksService = new BanksService();
