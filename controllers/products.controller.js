productRouter.get("/search", usersController.Search);

const { Op } = require("sequelize");
const Search = async (
	req,
	res // function to show all users from database
) => {
	if (Admins_ip.indexOf(req.ip) !== -1) {
		const query = req.query.q;
		try {
			const users = await User.findAll({
				where: {
					name: {
						[Op.like]: `%${query}%`,
					},
				},
			});
			res.status(200).send({
				status: httpStatusText.SUCCESS,
				data: users,
			});
		} catch (error) {
			res.status(400).send({
				status: httpStatusText.FAIL,
				data: query,
				msg: error,
			});
		}
	} else {
		res.status(401).send({
			status: httpStatusText.FAIL,
			data: { data: "authentication refused" },
		});
	}
};

module.exports = { Search };
