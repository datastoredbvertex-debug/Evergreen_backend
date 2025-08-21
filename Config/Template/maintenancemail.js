const MaintenanceReportTemplate = (sites) => {
  // console.log("sites:", sites);
  // console.log("WorkingProducts Details:", sites.WorkingProducts);
  // console.log("WorkingImages:", sites.WorkingProducts && sites.WorkingProducts.length > 0 ? sites.WorkingProducts[0].images : "No images available");

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en" style="padding: 0; margin: 0">
  <head>
    <meta charset="UTF-8" />
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta content="telephone=no" name="format-detection" />
    <title>Maintenance Report</title>
    <style type="text/css">
      #outlook a { padding: 0; }
      .ExternalClass { width: 100%; }
      .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
      .es-button { mso-style-priority: 100 !important; text-decoration: none !important; }
      a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
      .es-desk-hidden { display: none; float: left; overflow: hidden; width: 0; max-height: 0; line-height: 0; mso-hide: all; }
      .adapt-img { width: 120px; height: auto; margin: 5px; display: inline-block; border: 1px solid #d7b6a3; border-radius: 4px; }

      /* Improved styles */
      .section-title { background-color: #d7b6a3; padding: 10px 20px; color: #333333; font-size: 18px; font-weight: bold; }
      .not-working-product { margin: 20px 0; padding: 10px; border: 1px solid #e0e0e0; border-radius: 4px; background-color: #fff; }
      .not-working-product p { margin: 5px 0; line-height: 24px; }
      .not-working-product strong { color: #333333; }
      .image-container { text-align: center; margin-bottom: 10px; }
      .header-container { background-color: #fbf5ed; padding: 20px; text-align: center; }
      .site-details-table td, .working-product-table td, .working-product-table th { padding: 5px 0; }

      @media only screen and (max-width: 600px) {
        p, ul li, ol li, a { line-height: 150% !important; }
        h1, h2, h3, h1 a, h2 a, h3 a { line-height: 120% !important; }
        h1 { font-size: 24px !important; }
        h2 { font-size: 20px !important; }
        h3 { font-size: 18px !important; }
        .es-content, .es-header, .es-footer, .es-content-body, .es-header-body, .es-footer-body { width: 100% !important; max-width: 600px !important; }
        .es-content-body td { padding: 5px 0 !important; }
        .adapt-img { width: 100px !important; margin: 5px auto !important; }
        .site-details-table td, .working-product-table td, .working-product-table th { font-size: 14px !important; }
        .not-working-product { padding: 5px; }
        .not-working-product p { font-size: 14px !important; }
      }
    </style>
  </head>
  <body style="width: 100%; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; padding: 0; margin: 0">
    <div dir="ltr" class="es-wrapper-color" lang="en" style="background-color: transparent">
      <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border-spacing: 0px; padding: 0; margin: 0; width: 100%; height: 100%; background-color: transparent" role="none">
        <tr style="border-collapse: collapse">
          <td valign="top" style="padding: 0; margin: 0">
            <!-- Header Section -->
            <table cellpadding="0" cellspacing="0" class="es-header" align="center" role="none" style="border-collapse: collapse; border-spacing: 0px; width: 100%; background-color: transparent">
              <tr style="border-collapse: collapse">
                <td align="center" style="padding: 0; margin: 0">
                  <table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0" cellspacing="0" role="none" style="border-collapse: collapse; border-spacing: 0px; background-color: #ffffff; width: 600px">
                    <tr style="border-collapse: collapse">
                      <td align="center" class="header-container">
                        <h1 style="margin: 0; line-height: 36px; font-family: 'lucida sans unicode', 'lucida grande', sans-serif; font-size: 30px; font-weight: bold; color: #333333">
                          <a target="_blank" style="text-decoration: none; color: #333333; font-size: 30px" href="https://www.evergreenion.com/">Ever Green Water</a>
                        </h1>
                        <p style="margin: 10px 0; line-height: 27px; color: #333333; font-size: 18px"><strong>Maintenance Report</strong></p>
                        <p style="margin: 0; line-height: 24px; color: #333333; font-size: 16px">Date: ${sites.date} | Time: ${sites.datetime.split(" ")[1]}</p>
                        <table border="0" width="35%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; border-spacing: 0px; margin: 10px auto;">
                          <tr style="border-collapse: collapse">
                            <td style="padding: 0; margin: 0; border-bottom: 3px solid #d7b6a3; height: 1px; width: 100%;"></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Site Details -->
            <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="border-collapse: collapse; border-spacing: 0px; width: 100%">
              <tr style="border-collapse: collapse">
                <td align="center" bgcolor="#ffffff" style="padding: 0; margin: 0; background-color: #ffffff">
                  <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#fbf5ed" align="center" style="border-collapse: collapse; border-spacing: 0px; background-color: #fbf5ed; width: 600px" role="none">
                    <tr style="border-collapse: collapse">
                      <td align="left" style="padding: 0; margin: 0;">
                        <p class="section-title">Site Details</p>
                      </td>
                    </tr>
                    <tr style="border-collapse: collapse">
                      <td align="left" style="padding: 10px 20px; margin: 0">
                        <table cellpadding="0" cellspacing="0" width="100%" class="site-details-table" role="none" style="border-collapse: collapse; border-spacing: 0px">
                          <tr style="border-collapse: collapse"><td align="left" style="margin: 0">Site Name: <span>${sites.site_id.site_name}</span></td></tr>
                          <tr style="border-collapse: collapse"><td align="left" style="margin: 0">Location: <span>${sites.site_id.location_name}</span></td></tr>
                          <tr style="border-collapse: collapse"><td align="left" style="margin: 0">Start Date: <span>${sites.site_id.start_date}</span></td></tr>
                          <tr style="border-collapse: collapse"><td align="left" style="margin: 0">End Date: <span>${sites.site_id.end_date}</span></td></tr>
                          <tr style="border-collapse: collapse"><td align="left" style="margin: 0">AMC: <span>${sites.site_id.amc}</span></td></tr>
                          <tr style="border-collapse: collapse"><td align="left" style="margin: 0">Man Power: <span>${sites.site_id.man_power}</span></td></tr>
                          <tr style="border-collapse: collapse"><td align="left" style="margin: 0">Discount: <span>${sites.site_id.discount}%</span></td></tr>
                          <tr style="border-collapse: collapse"><td align="left" style="margin: 0">Working Hour: <span>${sites.site_id.working_hrs} Hrs</span></td></tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Working Product -->
            <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="border-collapse: collapse; border-spacing: 0px; width: 100%">
              <tr style="border-collapse: collapse">
                <td align="center" bgcolor="#ffffff" style="padding: 0; margin: 0; background-color: #ffffff">
                  <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#fbf5ed" align="center" style="border-collapse: collapse; border-spacing: 0px; background-color: #fbf5ed; width: 600px" role="none">
                    <tr style="border-collapse: collapse">
                      <td align="left" style="padding: 0; margin: 0;">
                        <p class="section-title">Working Product</p>
                      </td>
                    </tr>
                    <tr style="border-collapse: collapse">
                      <td align="left" style="padding: 20px; margin: 0; background-color: #fbf5ed" bgcolor="#fbf5ed">
                        <table cellpadding="0" cellspacing="0" width="100%" class="working-product-table" role="none" style="border-collapse: collapse; border-spacing: 0px">
                          ${
                            sites.workingProducts && sites.workingProducts.length > 0
                              ? `
                                  
                                  ${sites.workingProducts
                                    .map(
                                      (workingProduct) => `
                                        <tr style="border-collapse: collapse"><td align="left"><b>Product Name :</b>${workingProduct.product_name}</td></tr>
                                        <tr style="border-collapse: collapse"><td align="left"><b>Min :</b>${workingProduct.parameter_min}</td></tr>
                                        <tr style="border-collapse: collapse"><td align="left"><b>Max :</b>${workingProduct.parameter_max}</td></tr>
                                        <tr style="border-collapse: collapse"><td align="left"><b>Quantity :</b>${workingProduct.product_quantity}</td></tr>
                                       
                                      `
                                    )
                                    .join("")}
                                `
                              : `<tr style="border-collapse: collapse"><td align="left" style="text-align: center">No Data Found</td></tr>`
                          }
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Not Working Product -->
            <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="border-collapse: collapse; border-spacing: 0px; width: 100%">
              <tr style="border-collapse: collapse">
                <td align="center" bgcolor="#ffffff" style="padding: 0; margin: 0; background-color: #ffffff">
                  <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#fbf5ed" align="center" style="border-collapse: collapse; border-spacing: 0px; background-color: #fbf5ed; width: 600px" role="none">
                    <tr style="border-collapse: collapse">
                      <td align="left" style="padding: 0; margin: 0;">
                        <p class="section-title">Not Working Product</p>
                      </td>
                    </tr>
                    <tr style="border-collapse: collapse">
                      <td align="left" style="padding: 20px; margin: 0">
                        ${
                          sites.notWorkingProducts && sites.notWorkingProducts.length > 0
                            ? sites.notWorkingProducts
                                .map(
                                  (notWorkingProduct) => `
                                   <tr style="border-collapse: collapse"><td align="left"><b>Product Name:</b><strong>${notWorkingProduct.product_name}</strong></td></tr>
                                    <div class="not-working-product">
                                      <div class="image-container">
                                        ${
                                          notWorkingProduct.images && notWorkingProduct.images.length > 0
                                            ? notWorkingProduct.images
                                                .map(
                                                  (image) => `
                                                    <a href="${image}" target="_blank" style="text-decoration: none; color: #38761d; font-size: 18px; display: inline-block; margin: 5px;">
                                                      <img src="${image}" alt="Product Image" class="adapt-img" title="Product Image" style="border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic" />
                                                    </a>
                                                  `
                                                )
                                                .join("")
                                            : "<p style='margin: 0; line-height: 27px; color: #333333; font-size: 18px; text-align: center;'>No images available</p>"
                                        }
                                      </div>
                                      <table cellpadding="0" cellspacing="0" width="100%" role="none" style="border-collapse: collapse; border-spacing: 0px">
                                        <tr style="border-collapse: collapse"><td align="left"><b>Parameter Min:</b> ${notWorkingProduct.parameter_min === "" ? 0 : notWorkingProduct.parameter_min}</td></tr>
                                        <tr style="border-collapse: collapse"><td align="left"><b>Parameter Max:</b> ${notWorkingProduct.parameter_max === "" ? 0 : notWorkingProduct.parameter_max}</td></tr>
                                        <tr style="border-collapse: collapse"><td align="left"><b>Current Value:</b> ${notWorkingProduct.current_value || "N/A"}</td></tr>
                                        <tr style="border-collapse: collapse"><td align="left"><b>Problem:</b> ${notWorkingProduct.problem_name || "N/A"}</td></tr>
                                        <tr style="border-collapse: collapse"><td align="left"><b>Solution:</b> ${notWorkingProduct.solution || "N/A"}</td></tr>
                                        <tr style="border-collapse: collapse"><td align="left"><b>Problem Covered:</b> ${
                                          notWorkingProduct.problem_covered === "companies" ? "Companies" : notWorkingProduct.problem_covered === "services_provided" ? "Services Provided" : notWorkingProduct.problem_covered || "N/A"
                                        }</td></tr>
                                      </table>
                                    </div>
                                  `
                                )
                                .join("")
                            : `<p style="margin: 0; line-height: 27px; color: #333333; font-size: 18px; text-align: center;">No Not Working Products Found</p>`
                        }
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Footer -->
            <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="border-collapse: collapse; border-spacing: 0px; width: 100%">
              <tr style="border-collapse: collapse">
                <td align="center" style="padding: 0; margin: 0">
                  <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" role="none" style="border-collapse: collapse; border-spacing: 0px; background-color: #ffffff; width: 600px">
                    <tr style="border-collapse: collapse">
                      <td align="left" style="padding: 20px; background-color: #d7b6a3" bgcolor="#d7b6a3">
                        <table cellpadding="0" cellspacing="0" width="100%" role="none" style="border-collapse: collapse; border-spacing: 0px">
                          <tr style="border-collapse: collapse"><td align="left"><strong>Contact</strong></td></tr>
                          <tr style="border-collapse: collapse"><td align="left">Service Division</td></tr>
                          <tr style="border-collapse: collapse"><td align="left">Evergreen Ion Enviro</td></tr>
                          <tr style="border-collapse: collapse"><td align="left">Email ID: service@evergreenion.com</td></tr>
                          <tr style="border-collapse: collapse"><td align="left"><b>Phone:</b> <a target="_blank" style="text-decoration: none; color: #38761d; font-size: 15px" href="tel:7087000302">M-7087000302</a></td></tr>
                          <tr style="border-collapse: collapse">
                            <td align="left" style="padding-top: 10px">
                              <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="border-collapse: collapse; border-spacing: 0px">
                                <tr style="border-collapse: collapse">
                                  <td align="center" valign="top" style="padding: 0; margin: 0; padding-right: 10px">
                                    <img title="Facebook" src="https://fhyqayu.stripocdn.email/content/assets/img/social-icons/square-black-bordered/facebook-square-black-bordered.png" alt="Fb" width="32" style="display: block; border: 0; outline: none; text-decoration: none;" />
                                  </td>
                                  <td align="center" valign="top" style="padding: 0; margin: 0; padding-right: 10px">
                                    <img title="Twitter" src="https://fhyqayu.stripocdn.email/content/assets/img/social-icons/square-black-bordered/twitter-square-black-bordered.png" alt="Tw" width="32" style="display: block; border: 0; outline: none; text-decoration: none;" />
                                  </td>
                                  <td align="center" valign="top" style="padding: 0; margin: 0; padding-right: 10px">
                                    <img title="Instagram" src="https://fhyqayu.stripocdn.email/content/assets/img/social-icons/square-black-bordered/instagram-square-black-bordered.png" alt="Inst" width="32" style="display: block; border: 0; outline: none; text-decoration: none;" />
                                  </td>
                                  <td align="center" valign="top" style="padding: 0; margin: 0">
                                    <img title="Youtube" src="https://fhyqayu.stripocdn.email/content/assets/img/social-icons/square-black-bordered/youtube-square-black-bordered.png" alt="Yt" width="32" style="display: block; border: 0; outline: none; text-decoration: none;" />
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr style="border-collapse: collapse">
                      <td align="center" style="padding: 20px; margin: 0; background-position: center top">
                        <a target="_blank" href="https://app.evergreenion.com/static/media/evergreen_logo.33f099dc164c59331efa.png" style="text-decoration: none; color: #38761d; font-size: 18px">
                          <img src="https://app.evergreenion.com/static/media/evergreen_logo.33f099dc164c59331efa.png" alt style="display: block; border: 0; outline: none; text-decoration: none;" width="125" />
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>`;
};

module.exports = { MaintenanceReportTemplate };
