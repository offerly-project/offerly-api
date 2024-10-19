import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { banksService } from "../services/banks.service";
import {
	CreateBankBodyData,
	UpdateBankBodyData,
} from "../validators/bank.validators";

const createBankHandler = async (
	req: Request<{}, {}, CreateBankBodyData>,
	res: Response,
	next: NextFunction
) => {
	try {
		const bankData = req.body;
		const id = await banksService.createNewBank(bankData);

		res.status(StatusCodes.OK).json({ id });
	} catch (e) {
		next(e);
	}
};

const updateBankHandler = async (
	req: Request<{ id: string }, {}, UpdateBankBodyData>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const bankData = req.body;
		await banksService.updateBank(id, bankData);

		res.status(StatusCodes.OK).json({ message: "bank details updated" });
	} catch (e) {
		next(e);
	}
};

const getBanksHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const banks = await banksService.getBanks();
		res.status(StatusCodes.OK).json(banks);
	} catch (e) {
		next(e);
	}
};

const getBankHandler = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const banks = await banksService.getBank(req.params.id);
		res.status(StatusCodes.OK).json(banks);
	} catch (e) {
		next(e);
	}
};

export const banksController = {
	createBankHandler,
	updateBankHandler,
	getBanksHandler,
	getBankHandler,
};