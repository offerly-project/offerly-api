import { NextFunction, Request, Response } from "express";
import STATUS from "http-status-codes";
import { CreateBankBodyData } from "../schemas/bank.schemas";
import { banksService } from "../services/banks.service";

const createBankHandler = async (
	req: Request<{}, {}, CreateBankBodyData>,
	res: Response,
	next: NextFunction
) => {
	try {
		const bankData = req.body;
		const id = await banksService.createNewBank(bankData);

		res.status(STATUS.OK).json({ id });
	} catch (e) {
		next(e);
	}
};

export const banksController = {
	createBankHandler,
};
