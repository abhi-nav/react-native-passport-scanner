import { ResultFields } from "mrz";

export interface UserPassport {
	id: string;
	details: Partial<ResultFields>;
	serverDBId: number | undefined;
	passportImage: string;
	signatureImage: string;
	highlandImage: string;
	highlandId: string;
	iccid: string;
	simNumber: string;
	status: "pending" | "success" | "failed";
}
