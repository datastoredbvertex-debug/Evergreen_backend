const Site = require("../Models/Site.model");
const Product = require("../Models/Product.model");

exports.Createsite = async (req, res) => {
  const { client_id } = req.body;
  if (!client_id.client_id || !client_id.site_name || !client_id.location_name || !client_id.start_date || !client_id.end_date || !client_id.start_date || !client_id.end_date || !client_id.sv_visit || !client_id.working_hrs || !client_id.man_power || !client_id.productdata || !client_id.amc) {
    return res.status(404).json({
      message: "Please enter all the required fields.",
      status: false,
    });
  }

  const client_ids = client_id.client_id;
  const site_name = client_id.site_name;
  const location_name = client_id.location_name;
  const start_date = client_id.start_date;
  const end_date = client_id.end_date;
  const sv_visit = client_id.sv_visit;
  const working_hrs = client_id.working_hrs;
  const man_power = client_id.man_power;
  const imageFiles = client_id.imageFiles;
  const amc = client_id.amc;
  const product = client_id.productdata;
  const amc_description = client_id.amc_descriptions;
  try {
    const productIdNames = product.map((p) => p.product_id);
    const productIdQuantity = product.map((p) => p.product_quantity);
    console.log(productIdNames);

    // Utpadak kollection ko dhoondhna
    const products = await Product.find({
      product_name: { $in: productIdNames },
    });
    console.log(products);

    // Utpadak ke naam aur maatra ko map mein store karna
    const productMap = new Map(products.map((p) => [p.product_name, { _id: p._id, product_quantity: p.product_quantity }]));

    for (const p of product) {
      const productDetails = productMap.get(p.product_id);
      const productQuantity = parseInt(p.product_quantity, 10);

      if (productDetails) {
        const newQuantity = productDetails.product_quantity - productQuantity;
        // Utpadak maatra ko kollection mein update karna
        await Product.updateOne({ _id: productDetails._id }, { $set: { product_quantity: newQuantity } });
      }
    }

    // Aakhri sthiti ko log karne ke liye (tarkikta ke liye)
    const updatedProductDetails = product.map(({ product_id, product_quantity }) => {
      const productDetails = productMap.get(product_id);

      return { _id: productDetails._id, product_quantity };
    });

    const formattedStartDate = new Date(start_date).toLocaleDateString("en-IN");
    const formattedEndDate = new Date(end_date).toLocaleDateString("en-IN");

    const sites = await Site.create({
      client_id: client_ids,
      location_name,
      site_name,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      contractfile: imageFiles,
      sv_visit,
      working_hrs,
      man_power,
      amc,
      product: updatedProductDetails,
      amc_description,
    });

    if (sites) {
      return res.status(201).json({
        sites: sites,
        status: true,
      });
    } else {
      return res.status(200).json({
        message: "Sites Not Created.",
        status: false,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
