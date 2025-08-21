const ClientModel = require('../Models/Client.model');

exports.getAllClientName = async (req, res) => {
  try {
    const users = await ClientModel.find({}).select('_id clientName').sort({ clientName: 1 }); // Sort clientName in ascending order

    const totalCount = await ClientModel.countDocuments({});

    res.json({
      totalCount: totalCount,
      clients: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
      status: false
    });
  }
};
