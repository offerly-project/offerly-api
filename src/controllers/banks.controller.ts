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

export const banksController = {
	createBankHandler,
	updateBankHandler,
};
