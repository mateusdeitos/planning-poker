import { NextApiRequest, NextApiResponse } from "next";
import { isUser } from "../../../models/User";
import { changeState } from "../../../services/firebase/room-services";
import { App } from "../../../types";
import { withAuth } from "../../../withAuth";

export default withAuth(async (req, res) => {
	if (req.method !== "POST") {
		return res.status(405).end();
	}

	const { user, phase } = req.body;
	const { roomId } = req.query;

	if (!isUser(user)) {
		return res.status(400).send("Missing user");
	}

	const validPhases: App.Room["votingState"][] = ["revealing", "finished", "voting"]

	if (!validPhases.includes(phase)) {
		return res.status(400).send("Invalid phase");
	}

	if (!roomId) {
		return res.status(400).send("Missing roomId or memberName");
	}

	try {
		await changeState(Array.isArray(roomId) ? roomId[0] : roomId, phase);

		return res.status(200).send("Joined room");
	} catch (e) {
		return res.status(500).send(e.message);
	}

});