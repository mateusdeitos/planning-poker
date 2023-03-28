import { NextApiRequest, NextApiResponse } from "next";
import { isUser } from "../../../models/User";
import { unVote } from "../../../services/firebase/room-services";
import { withAuth } from "../../../withAuth";

export default withAuth(async (req, res) => {
	if (req.method !== "POST") {
		return res.status(405).end();
	}

	const { user } = req.body;
	const { roomId } = req.query;

	if (!isUser(user)) {
		return res.status(400).send("Missing user");
	}

	if (!roomId) {
		return res.status(400).send("Missing roomId or memberName");
	}

	if (req.uid != user.uid) {
		return res.status(401).send("Not authorized");
	}

	try {
		await unVote(Array.isArray(roomId) ? roomId[0] : roomId, user.uid);

		return res.status(200).send("Joined room");
	} catch (e) {
		return res.status(500).send(e.message);
	}

});