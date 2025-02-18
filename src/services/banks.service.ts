import { ObjectId } from "mongodb";
import { ConflictError, NotFoundError } from "../errors/errors";
import { ErrorCodes } from "../errors/errors.codes";
import { IBank } from "../models/bank.model";
import { banksRepository } from "../repositories/banks.repository";
import { countriesRepository } from "../repositories/countries.repository";
import { removeUndefinedValuesFromObject } from "../utils/utils";
import {
	CreateBankBodyData,
	UpdateBankBodyData,
} from "../validators/bank.validators";

export class BanksService {
	async createNewBank(bank: CreateBankBodyData) {
		const bankExists = await banksRepository.bankNameExists(bank.name);

		if (bankExists) {
			throw new ConflictError(
				"Bank already exists",
				ErrorCodes.BANK_ALREADY_EXISTS
			);
		}

		const countryExists = await countriesRepository.countryExists(bank.country);

		if (!countryExists) {
			throw new NotFoundError(
				"Country not found",
				ErrorCodes.COUNTRY_NOT_FOUND
			);
		}

		const newBank: IBank = {
			country: new ObjectId(bank.country),
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
			throw new NotFoundError("Bank not found", ErrorCodes.BANK_NOT_FOUND);
		}

		if (bank.name) {
			const foundBank = await banksRepository.findByName(bank.name);
			if (foundBank && foundBank._id.toString() !== id) {
				throw new ConflictError(
					"Bank name already exists",
					ErrorCodes.BANK_ALREADY_EXISTS
				);
			}
		}

		const patchData = removeUndefinedValuesFromObject<Partial<IBank>>({
			country: bank.country ? new ObjectId(bank.country) : undefined,
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

	async getUserBanks() {
		return banksRepository.getUserBanks();
	}

	async getBank(id: string) {
		const bank = await banksRepository.findById(id);
		if (!bank) {
			throw new NotFoundError("Bank not found", ErrorCodes.BANK_NOT_FOUND);
		}
		return bank;
	}
	async getBankCardsById(id: string) {
		return banksRepository.getCardsByBankId(id);
	}
}

export const banksService = new BanksService();
