function MaintenanceAlertTemplate(productDetails) {
    // console.log("prdd", productDetails)
  const {
    site_name,
    location,
    working_status,
    maintenance_alert,
    remaining_quantity,
    product_min_quantity,
    productName,
    maintenance_date = [],
    already_maintenance = [],
  } = productDetails;

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #d9534f;">🚨 Maintenance Alert</h2>
      <p><strong>Site Name:</strong> ${site_name}</p>
      <p><strong>Product Name:</strong> ${productName}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Working Status:</strong> ${working_status}</p>
      <p><strong>Maintenance Alert:</strong> ${maintenance_alert}</p>
      <p><strong>Remaining Quantity:</strong> ${remaining_quantity}</p>
      <p><strong>Minimum Required Quantity:</strong> ${product_min_quantity}</p>

      ${
        maintenance_date.length
          ? `<p><strong>Upcoming Maintenance Dates:</strong> ${maintenance_date.join(", ")}</p>`
          : ""
      }

      ${
        already_maintenance.length
          ? `<p><strong>Past Maintenance Done:</strong> ${already_maintenance.join(", ")}</p>`
          : ""
      }

      <p style="margin-top: 20px;">Please take necessary actions as per the maintenance schedule.</p>
    </div>
  `;
}

module.exports = MaintenanceAlertTemplate;
