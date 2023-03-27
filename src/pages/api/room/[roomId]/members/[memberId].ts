import { NextApiRequest, NextApiResponse } from "next";
import { getData } from "../../../../../services/firebase";
import { App } from "../../../../../types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "GET") {
		return res.status(405).end();
	}

	let { roomId, memberId } = req.query;

	if (!roomId) {
		return res.status(400).send("Missing roomId");
	}

	roomId = Array.isArray(roomId) ? roomId[0] : roomId;
	memberId = Array.isArray(memberId) ? memberId[0] : memberId;

	try {
		const response = await getData<App.User | null>(`rooms/${roomId}/members/${memberId}`);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(500).send(e.message);
	}

}