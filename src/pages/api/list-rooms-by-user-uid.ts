import { listRoomsByUserUid } from "../../services/firebase/room-services";
import { withAuth } from "../../withAuth";

export default withAuth(async (req, res) => {
	if (req.method !== "GET") {
		return res.status(405).end();
	}

	try {
		const rooms = await listRoomsByUserUid(req.uid);

		return res.status(200).json(rooms);
	} catch (e) {
		return res.status(500).send(e.message);
	}

});