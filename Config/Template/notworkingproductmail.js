const NotWrokingReportTemplate = (sites) => {
      console.log(sites);
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en" style="padding: 0; margin: 0">
  <head>
    <meta charset="UTF-8" />
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta content="telephone=no" name="format-detection" />
    <title>New Template</title>
    <!--[if (mso 16)]>
      <style type="text/css">
        a {
          text-decoration: none;
        }
      </style>
    <![endif]-->
    <!--[if gte mso 9]>
      <style>
        sup {
          font-size: 100% !important;
        }
      </style>
    <![endif]-->
    <!--[if gte mso 9]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG></o:AllowPNG>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    <![endif]-->
    <style type="text/css">
      #outlook a {
        padding: 0;
      }
      .ExternalClass {
        width: 100%;
      }
      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }
      .es-button {
        mso-style-priority: 100 !important;
        text-decoration: none !important;
      }
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }
      .es-desk-hidden {
        display: none;
        float: left;
        overflow: hidden;
        width: 0;
        max-height: 0;
        line-height: 0;
        mso-hide: all;
      }
      .es-button-border:hover {
        border-color: #c7997f #c7997f #c7997f #c7997f !important;
        background: #fce5cd !important;
      }
      .es-button-border:hover a.es-button,
      .es-button-border:hover button.es-button {
        background: #fce5cd !important;
        color: #28495c !important;
      }
      td .es-button-border:hover a.es-button-1563183272218 {
        background: #fce5cd !important;
        border-color: #fce5cd !important;
        color: #28495c !important;
      }
      td .es-button-border-1563183272251:hover {
        background: #fce5cd !important;
      }
      @media only screen and (max-width: 600px) {
        p,
        ul li,
        ol li,
        a {
          line-height: 150% !important;
        }
        h1,
        h2,
        h3,
        h1 a,
        h2 a,
        h3 a {
          line-height: 120% !important;
        }
        h1 {
          font-size: 30px !important;
          text-align: center;
        }
        h2 {
          font-size: 26px !important;
          text-align: center;
        }
        h3 {
          font-size: 20px !important;
          text-align: center;
        }
        .es-header-body h1 a,
        .es-content-body h1 a,
        .es-footer-body h1 a {
          font-size: 30px !important;
        }
        .es-header-body h2 a,
        .es-content-body h2 a,
        .es-footer-body h2 a {
          font-size: 26px !important;
        }
        .es-header-body h3 a,
        .es-content-body h3 a,
        .es-footer-body h3 a {
          font-size: 20px !important;
        }
        .es-menu td a {
          font-size: 16px !important;
        }
        .es-header-body p,
        .es-header-body ul li,
        .es-header-body ol li,
        .es-header-body a {
          font-size: 16px !important;
        }
        .es-content-body p,
        .es-content-body ul li,
        .es-content-body ol li,
        .es-content-body a {
          font-size: 16px !important;
        }
        .es-footer-body p,
        .es-footer-body ul li,
        .es-footer-body ol li,
        .es-footer-body a {
          font-size: 16px !important;
        }
        .es-infoblock p,
        .es-infoblock ul li,
        .es-infoblock ol li,
        .es-infoblock a {
          font-size: 12px !important;
        }
        *[class="gmail-fix"] {
          display: none !important;
        }
        .es-m-txt-c,
        .es-m-txt-c h1,
        .es-m-txt-c h2,
        .es-m-txt-c h3 {
          text-align: center !important;
        }
        .es-m-txt-r,
        .es-m-txt-r h1,
        .es-m-txt-r h2,
        .es-m-txt-r h3 {
          text-align: right !important;
        }
        .es-m-txt-l,
        .es-m-txt-l h1,
        .es-m-txt-l h2,
        .es-m-txt-l h3 {
          text-align: left !important;
        }
        .es-m-txt-r img,
        .es-m-txt-c img,
        .es-m-txt-l img {
          display: inline !important;
        }
        .es-button-border {
          display: block !important;
        }
        a.es-button,
        button.es-button {
          font-size: 14px !important;
          display: block !important;
          border-left-width: 0px !important;
          border-right-width: 0px !important;
        }
        .es-btn-fw {
          border-width: 10px 0px !important;
          text-align: center !important;
        }
        .es-adaptive table,
        .es-btn-fw,
        .es-btn-fw-brdr,
        .es-left,
        .es-right {
          width: 100% !important;
        }
        .es-content table,
        .es-header table,
        .es-footer table,
        .es-content,
        .es-footer,
        .es-header {
          width: 100% !important;
          max-width: 600px !important;
        }
        .es-adapt-td {
          display: block !important;
          width: 100% !important;
        }
        .adapt-img {
          width: 100% !important;
          height: auto !important;
        }
        .es-m-p0 {
          padding: 0px !important;
        }
        .es-m-p0r {
          padding-right: 0px !important;
        }
        .es-m-p0l {
          padding-left: 0px !important;
        }
        .es-m-p0t {
          padding-top: 0px !important;
        }
        .es-m-p0b {
          padding-bottom: 0 !important;
        }
        .es-m-p20b {
          padding-bottom: 20px !important;
        }
        .es-mobile-hidden,
        .es-hidden {
          display: none !important;
        }
        tr.es-desk-hidden,
        td.es-desk-hidden,
        table.es-desk-hidden {
          width: auto !important;
          overflow: visible !important;
          float: none !important;
          max-height: inherit !important;
          line-height: inherit !important;
        }
        tr.es-desk-hidden {
          display: table-row !important;
        }
        table.es-desk-hidden {
          display: table !important;
        }
        td.es-desk-menu-hidden {
          display: table-cell !important;
        }
        .es-menu td {
          width: 1% !important;
        }
        table.es-table-not-adapt,
        .esd-block-html table {
          width: auto !important;
        }
        table.es-social {
          display: inline-block !important;
        }
        table.es-social td {
          display: inline-block !important;
        }
        .es-desk-hidden {
          display: table-row !important;
          width: auto !important;
          overflow: visible !important;
          max-height: inherit !important;
        }
      }
      @media screen and (max-width: 9999px) {
        .cboxcheck:checked + input + * .thumb-carousel {
          height: auto !important;
          max-height: none !important;
          max-width: none !important;
          line-height: 0;
        }
        .thumb-carousel span {
          font-size: 0;
          line-height: 0;
        }
        .cboxcheck:checked + input + * .thumb-carousel .car-content {
          display: none;
          max-height: 0px;
          overflow: hidden;
        }
        .cbox0:checked + * .content-1,
        .thumb-carousel .cbox1:checked + span .content-1,
        .thumb-carousel .cbox2:checked + span .content-2,
        .thumb-carousel .cbox3:checked + span .content-3,
        .thumb-carousel .cbox4:checked + span .content-4,
        .thumb-carousel .cbox5:checked + span .content-5,
        .thumb-carousel .cbox6:checked + span .content-6 {
          display: block !important;
          max-height: none !important;
          overflow: visible !important;
        }
        .thumb-carousel .thumb {
          cursor: pointer;
          display: inline-block !important;
          width: 14.6%;
          margin: 2% 0.61%;
          border: 1px solid rgb(215, 182, 163);
        }
        .moz-text-html .thumb {
          display: none !important;
        }
        .thumb-carousel .thumb:hover {
          border: 1px solid rgb(68, 68, 68);
        }
        .cbox0:checked + * .thumb-1,
        .thumb-carousel .cbox1:checked + span .thumb-1,
        .thumb-carousel .cbox2:checked + span .thumb-2,
        .thumb-carousel .cbox3:checked + span .thumb-3,
        .thumb-carousel .cbox4:checked + span .thumb-4,
        .thumb-carousel .cbox5:checked + span .thumb-5,
        .thumb-carousel .cbox6:checked + span .content-6 {
          border-color: rgb(162, 136, 120);
        }
        .thumb-carousel .thumb img {
          width: 100%;
          height: auto;
        }
        .thumb-carousel img {
          max-height: none !important;
        }
        .cboxcheck:checked + input + * .fallback {
          display: none !important;
          display: none;
          max-height: 0px;
          height: 0px;
          overflow: hidden;
        }
      }
      @media screen and (max-width: 600px) {
        .car-table.responsive,
        .car-table.responsive .thumb-carousel,
        .car-table.responsive .thumb-carousel .car-content img,
        .car-table.responsive .fallback .car-content img {
          width: 100% !important;
          height: auto;
        }
      }
      @media screen {
      }
      @media screen and (max-width: 384px) {
        .mail-message-content {
          width: 414px !important;
        }
      }
    </style>
  </head>
  <body style="width: 100%; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; padding: 0; margin: 0">
    <div dir="ltr" class="es-wrapper-color" lang="en" style="background-color: transparent">
      <!--[if gte mso 9]>
        <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
          <v:fill type="tile" color="transparent"></v:fill>
        </v:background>
      <![endif]-->
      <table
        class="es-wrapper"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px; padding: 0; margin: 0; width: 100%; height: 100%; background-repeat: repeat; background-position: right top; background-color: transparent"
        role="none"
      >
        <tr style="border-collapse: collapse">
          <td valign="top" style="padding: 0; margin: 0">
            <table
              cellpadding="0"
              cellspacing="0"
              class="es-header"
              align="center"
              role="none"
              style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px; table-layout: fixed !important; width: 100%; background-color: transparent; background-repeat: repeat; background-position: center top"
            >
              <tr style="border-collapse: collapse">
                <td align="center" style="padding: 0; margin: 0">
                  <table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px; background-color: #ffffff; width: 600px">
                    <tr style="border-collapse: collapse">
                      <td align="left" style="padding: 0; margin: 0; padding-top: 20px; padding-left: 20px; padding-right: 20px; background-position: left top">
                        <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                          <tr style="border-collapse: collapse">
                            <td align="center" valign="top" style="padding: 0; margin: 0; width: 560px">
                              <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                                <tr style="border-collapse: collapse">
                                  <td align="center" style="padding: 0; margin: 0; padding-top: 20px">
                                    <h1 style="margin: 0; line-height: 36px; mso-line-height-rule: exactly; font-family: 'lucida sans unicode', 'lucida grande', sans-serif; font-size: 30px; font-style: normal; font-weight: bold; color: #333333">
                                      <a target="_blank" style="-webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; text-decoration: none; color: #333333; font-size: 30px" href="https://www.evergreenion.com/">Evergreen Ion Enviro</a>
                                    </h1>
                                  </td>
                                </tr>
                                <tr style="border-collapse: collapse">
                                  <td align="center" style="margin: 0; padding-top: 5px; padding-bottom: 10px; padding-left: 20px; padding-right: 20px; font-size: 0">
                                    <table border="0" width="35%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                                      <tr style="border-collapse: collapse">
                                        <td style="padding: 0; margin: 0; border-bottom: 3px solid #d7b6a3; background: none; height: 1px; width: 100%; margin: 0px"></td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr style="border-collapse: collapse">
                      <td align="left" style="padding: 0; margin: 0; padding-left: 20px; padding-right: 20px; background-position: left top">
                        <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                          <tr style="border-collapse: collapse">
                            <td align="center" valign="top" style="padding: 0; margin: 0; width: 560px">
                              <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                                <tr style="border-collapse: collapse">
                                  <td style="padding: 0; margin: 0">
                                    <table cellpadding="0" cellspacing="0" width="100%" class="es-menu" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                                      <tr class="links" style="border-collapse: collapse">
                                        <td align="center" valign="top" width="33.33%" style="margin: 0; padding-left: 5px; padding-right: 5px; padding-top: 10px; padding-bottom: 10px; border: 0">
                                          <a
                                            target="_blank"
                                            href="https://www.evergreenion.com/"
                                            style="-webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; text-decoration: none; display: block; font-family: 'lucida sans unicode', 'lucida grande', sans-serif; color: #333333; font-size: 18px"
                                            >Report</a
                                          >
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px; table-layout: fixed !important; width: 100%">
              <tr style="border-collapse: collapse">
                <td align="center" bgcolor="#ffffff" style="padding: 0; margin: 0; background-color: #ffffff">
                  <table bgcolor="#fbf5ed" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px; background-color: #fbf5ed; width: 600px" role="none">
                    <tr style="border-collapse: collapse">
                      <td align="left" style="padding: 0; margin: 0; padding-top: 20px; padding-left: 20px; padding-right: 20px; background-position: center center; background-color: transparent" bgcolor="transparent">
                        <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                          <tr style="border-collapse: collapse">
                            <td align="center" valign="top" style="padding: 0; margin: 0; width: 560px">
                              <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                                <tr style="border-collapse: collapse">
                                  <td align="center" style="padding: 0; margin: 0; padding-top: 10px; padding-left: 10px; padding-right: 10px">
                                    <h1 style="margin: 0; line-height: 36px; mso-line-height-rule: exactly; font-family: 'lucida sans unicode', 'lucida grande', sans-serif; font-size: 30px; font-style: normal; font-weight: bold; color: #333333">
                                      Product Report Update!
                                    </h1>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr style="border-collapse: collapse">
                      <td align="left" style="margin: 0; padding-top: 10px; padding-bottom: 10px; padding-left: 20px; padding-right: 20px">
                        <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                          <tr style="border-collapse: collapse">
                            <td align="center" valign="top" style="padding: 0; margin: 0; width: 560px">
                              <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                                <tr style="border-collapse: collapse">
                                  <td align="center" style="padding: 0; margin: 0">
                                    <p style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">

                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px; table-layout: fixed !important; width: 100%">
              <tr style="border-collapse: collapse">
                <td align="center" bgcolor="#ffffff" style="padding: 0; margin: 0; background-color: #ffffff">
                  <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#fbf5ed" align="center" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px; background-color: #fbf5ed; width: 600px" role="none">
                    <tr style="border-collapse: collapse">
                      <td align="left" style="padding: 0; margin: 0; padding-left: 20px; padding-right: 20px; background-color: #d7b6a3" bgcolor="#d7b6a3">
                        <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                          <tr style="border-collapse: collapse">
                            <td align="center" valign="top" style="padding: 0; margin: 0; width: 560px">
                              <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                                <tr style="border-collapse: collapse">
                                  <td align="left" style="padding: 0; margin: 0">
                                    <p style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                      <strong>Site Details</strong>
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr style="border-collapse: collapse">
                      <td align="right" style="text-align-last: start; margin: 0; padding-top: 10px; padding-bottom: 10px; padding-left: 20px; padding-right: 20px">
                        <!--[if mso]>
                                                  <table style="width:560px" cellpadding="0" cellspacing="0">
                                                     <tr>
                                                        <td style="width:470px" valign="top">
                                                           <![endif]-->
                        <table cellpadding="0" cellspacing="0" class="es-left" align="right" role="none" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px; float: left; width: 100%">
                          <tr style="border-collapse: collapse">
                            <td class="es-m-p20b" align="right" style="padding: 0; margin: 0; width: 235px">
                              <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                                <tr style="border-collapse: collapse">
                                  <td align="right" style="padding: 0; margin: 0">
                                    <p style="margin: 0;  text-align: left; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                      Site Name:
                                      <span style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                        ${sites.site_id.site_name}
                                      </span>
                                    </p>
                                  </td>
                                </tr>
                                <tr style="border-collapse: collapse">
                                  <td align="right" style="padding: 0; margin: 0">
                                    <p style="margin: 0;  text-align: left; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                      Start Date:
                                      <span style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                        ${sites.site_id.start_date}
                                      </span>
                                    </p>
                                  </td>
                                </tr>
                                <tr style="border-collapse: collapse">
                                  <td align="right" style="padding: 0; margin: 0">
                                    <p style="margin: 0;  text-align: left; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                      AMC:
                                      <span style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                        ${sites.site_id.amc}
                                      </span>
                                    </p>
                                  </td>
                                </tr>
                                <tr style="border-collapse: collapse">
                                  <td align="right" style="padding: 0; margin: 0">
                                    <p style="margin: 0;  text-align: left; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                      Man Power:
                                      <span style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                        ${sites.site_id.man_power}
                                      </span>
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td class="es-m-p20b" align="right" style="padding: 0; margin: 0; width: 235px; text-align-last: end">
                              <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                                <tr style="border-collapse: collapse">
                                  <td align="right" style="padding: 0; margin: 0">
                                    <p style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                      Location:
                                      <span style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                        ${sites.site_id.location_name}
                                      </span>
                                    </p>
                                  </td>
                                </tr>
                                <tr style="border-collapse: collapse">
                                  <td align="right" style="padding: 0; margin: 0">
                                    <p style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                      End Date:
                                      <span style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                        ${sites.site_id.end_date}
                                      </span>
                                    </p>
                                  </td>
                                </tr>
                                <tr style="border-collapse: collapse">
                                  <td align="right" style="padding: 0; margin: 0">
                                    <p style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                      Discount:
                                      <span style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                        ${sites.site_id.discount}%
                                      </span>
                                    </p>
                                  </td>
                                </tr>
                                <tr style="border-collapse: collapse">
                                  <td align="right" style="padding: 0; margin: 0">
                                    <p style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                      Working Hour:
                                      <span style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                        ${sites.site_id.working_hrs} Hrs
                                      </span>
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!--[if mso]>
                                                        </td>
                                                     </tr>
                                                  </table>
                                                  <![endif]-->
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!--  Not Working Product -->
            <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px; table-layout: fixed !important; width: 100%">
              <tr style="border-collapse: collapse">
                <td align="center" bgcolor="#ffff" style="padding: 0; margin: 0; background-color: #ffff">
                  <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#fbf5ed" align="center" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px; background-color: #fbf5ed; width: 600px" role="none">
                    <tr style="border-collapse: collapse">
                      <td align="left" style="padding: 0; margin: 0; padding-left: 20px; padding-right: 20px">
                        <table width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                          <tr style="border-collapse: collapse">
                            <td valign="top" align="center" style="padding: 0; margin: 0; width: 560px">
                              <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                                <tr style="border-collapse: collapse">
                                  <td align="center" style="padding: 0; margin: 0; padding-bottom: 10px; font-size: 0">
                                    <table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                                      <tr style="border-collapse: collapse">
                                        <td style="padding: 0; margin: 0; border-bottom: 1px solid #efefef; background: #ffffff none repeat scroll 0% 0%; height: 1px; width: 100%; margin: 0px"></td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr style="border-collapse: collapse">
                      <td align="left" style="padding: 0; margin: 0; padding-left: 20px; padding-right: 20px; background-color: #d7b6a3" bgcolor="#d7b6a3">
                        <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                          <tr style="border-collapse: collapse">
                            <td align="center" valign="top" style="padding: 0; margin: 0; width: 560px">
                              <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                                <tr style="border-collapse: collapse">
                                  <td align="left" style="padding: 0; margin: 0">
                                    <p style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                      <strong>Not Working Product</strong>
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr style="border-collapse: collapse">
                     ${sites.notWorkingProducts.map(
                       (notWorkingProduct) => `
                         <td align="left" style="margin: 0; padding-top: 20px; padding-bottom: 20px; padding-left: 20px; padding-right: 20px">
                        <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:100%" valign="top"><![endif]-->
                        <table cellpadding="0" cellspacing="0" class="es-left" align="left" role="none" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px; float: left">
                          <tr style="border-collapse: collapse">
                            <td class="es-m-p20b" align="left" style="padding: 0; margin: 0; width: 100%">
                              <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                                <tr style="border-collapse: collapse">
                                  <td style="padding: 0; margin: 0; font-size: 0; text-align: center; white-space: nowrap">
                                    ${notWorkingProduct.images.map(
                                      (image) => `
                                    <a href="${image.images}" target="_blank" style="-webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; text-decoration: none; color: #38761d; font-size: 18px; display: inline-block; margin: 15px"
                                      ><img
                                        src="${image.images}"
                                        alt="${image.images}"
                                        class="adapt-img"
                                        title="${image.images}"
                                        style="display: inline-block; border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic"
                                        width="150"
                                    /></a>
                                    `
                                    )}
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!--[if mso]></td><td style="width:20px"></td><td style="width:100%" valign="top"><![endif]-->
                        <table cellpadding="0" cellspacing="0" class="es-right" align="left" role="none" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px; float: left">
                          <tr style="border-collapse: collapse">
                            <td align="left" style="padding: 0; margin: 0; width: 100%">
                              <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                                <tr style="border-collapse: collapse">
                                  <td align="left" style="padding: 0; margin: 0">
                                    <p style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                      <strong>${notWorkingProduct.product_name}</strong>
                                    </p>
                                  </td>
                                </tr>
                                <tr style="border-collapse: collapse">
                                  <td align="center" height="10" style="padding: 0; margin: 0"></td>
                                </tr>
                                <tr style="border-collapse: collapse">
                                  <td align="left" style="padding: 0; margin: 0">
                                    <p style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                      <b>Parameter Min: </b> ${notWorkingProduct.parameter_min === "" ? 0 : notWorkingProduct.parameter_min}
                                    </p>
                                  </td>
                                </tr>
                                <tr style="border-collapse: collapse">
                                  <td align="left" style="padding: 0; margin: 0">
                                    <p style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                      <b>Parameter Max: </b> ${notWorkingProduct.parameter_max === "" ? 0 : notWorkingProduct.parameter_max}
                                    </p>
                                  </td>
                                </tr>
                                <tr style="border-collapse: collapse">
                                  <td align="left" style="padding: 0; margin: 0">
                                    <p style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                      <b>current_value</b> ${notWorkingProduct.current_value}
                                    </p>
                                  </td>
                                </tr>
                                <tr style="border-collapse: collapse">
                                  <td align="left" style="padding: 0; margin: 0">
                                    <p style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                      <b>Problem</b> ${notWorkingProduct.problem_name}
                                    </p>
                                  </td>
                                </tr>
                                <tr style="border-collapse: collapse">
                                  <td align="left" style="padding: 0; margin: 0">
                                    <p style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                      <b>Solution</b> ${notWorkingProduct.solution}
                                    </p>
                                  </td>
                                </tr>
                                <tr style="border-collapse: collapse">
                                  <td align="left" style="padding: 0; margin: 0">
                                    <p style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 27px; color: #333333; font-size: 18px">
                                      <b>Problem Covered: </b>${notWorkingProduct.problem_covered === "client" ? "Client" : notWorkingProduct.problem_covered === "evergreen_ion" ? "Ever Green Ion" : notWorkingProduct.problem_covered}
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!--[if mso]></td></tr></table><![endif]-->
                          `
                     )}
                         </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px; table-layout: fixed !important; width: 100%">
              <tr style="border-collapse: collapse">
                <td align="center" style="padding: 0; margin: 0">
                  <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px; background-color: #ffffff; width: 600px">
                    <tr style="border-collapse: collapse">
                      <td align="left" style="margin: 0; padding-top: 20px; padding-bottom: 20px; padding-left: 20px; padding-right: 20px; background-position: left top; background-color: #d7b6a3" bgcolor="#d7b6a3">
                        <!--[if mso]>
                                                  <table style="width:560px" cellpadding="0" cellspacing="0">
                                                     <tr>
                                                        <td style="width:270px" valign="top">
                                                           <![endif]-->
                        <table cellpadding="0" cellspacing="0" class="es-left" align="left" role="none" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px; float: left">
                          <tr style="border-collapse: collapse">
                            <td class="es-m-p20b" align="left" style="padding: 0; margin: 0; width: 270px">
                              <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                                <tr style="border-collapse: collapse">
                                  <td align="left" style="padding: 0; margin: 0; font-size: 0">
                                    <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                                      <tr style="border-collapse: collapse">
                                        <td align="center" valign="top" style="padding: 0; margin: 0; padding-right: 10px">
                                          <img
                                            title="Facebook"
                                            src="https://fhyqayu.stripocdn.email/content/assets/img/social-icons/square-black-bordered/facebook-square-black-bordered.png"
                                            alt="Fb"
                                            width="32"
                                            style="display: block; border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic"
                                          />
                                        </td>
                                        <td align="center" valign="top" style="padding: 0; margin: 0; padding-right: 10px">
                                          <img
                                            title="Twitter"
                                            src="https://fhyqayu.stripocdn.email/content/assets/img/social-icons/square-black-bordered/twitter-square-black-bordered.png"
                                            alt="Tw"
                                            width="32"
                                            style="display: block; border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic"
                                          />
                                        </td>
                                        <td align="center" valign="top" style="padding: 0; margin: 0; padding-right: 10px">
                                          <img
                                            title="Instagram"
                                            src="https://fhyqayu.stripocdn.email/content/assets/img/social-icons/square-black-bordered/instagram-square-black-bordered.png"
                                            alt="Inst"
                                            width="32"
                                            style="display: block; border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic"
                                          />
                                        </td>
                                        <td align="center" valign="top" style="padding: 0; margin: 0">
                                          <img
                                            title="Youtube"
                                            src="https://fhyqayu.stripocdn.email/content/assets/img/social-icons/square-black-bordered/youtube-square-black-bordered.png"
                                            alt="Yt"
                                            width="32"
                                            style="display: block; border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic"
                                          />
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                                <tr style="border-collapse: collapse">
                                  <td align="left" style="margin: 0; padding-left: 5px; padding-right: 5px; padding-top: 10px; padding-bottom: 10px">
                                    <p style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 24px; color: #333333; font-size: 16px">
                                      <strong>Сontact</strong>
                                    </p>
                                  </td>
                                </tr>
                                <tr style="border-collapse: collapse">
                                  <td align="left" style="padding: 0; margin: 0; padding-top: 5px; padding-left: 5px; padding-right: 5px">
                                    <p style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 23px; color: #333333; font-size: 15px">
                                      Service Division
                                      Evergreen Ion Enviro 
                                    </p>
                                    <p style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 23px; color: #333333; font-size: 15px">
                                      Email ID service@evergreenion.com
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!--[if mso]>
                                                        </td>
                                                        <td style="width:20px"></td>
                                                        <td style="width:270px" valign="top">
                                                           <![endif]-->
                        <table cellpadding="0" cellspacing="0" class="es-right" align="right" role="none" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px; float: right">
                          <tr style="border-collapse: collapse">
                            <td align="left" style="padding: 0; margin: 0; width: 270px">
                              <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                                <tr style="border-collapse: collapse">
                                  <td align="right" style="padding: 0; margin: 0; padding-left: 5px; padding-right: 5px">
                                    <p style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 24px; color: #333333; font-size: 16px">
                                      <b>Phone:</b>
                                    </p>
                                  </td>
                                </tr>
                                <tr style="border-collapse: collapse">
                                  <td align="right" style="padding: 0; margin: 0; padding-left: 5px; padding-right: 5px">
                                    <p style="margin: 0; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace; line-height: 23px; color: #333333; font-size: 15px">
                                      <a target="_blank" style="-webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; text-decoration: none; color: #38761d; font-size: 15px" href="tel:7087000302">M-7087000302</a>
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!--[if mso]>
                                                        </td>
                                                     </tr>
                                                  </table>
                                                  <![endif]-->
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px; table-layout: fixed !important; width: 100%">
              <tr style="border-collapse: collapse">
                <td align="center" style="padding: 0; margin: 0">
                  <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px; background-color: #ffffff; width: 600px" role="none">
                    <tr style="border-collapse: collapse">
                      <td align="left" style="margin: 0; padding-left: 20px; padding-right: 20px; padding-top: 40px; padding-bottom: 40px; background-position: center top">
                        <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                          <tr style="border-collapse: collapse">
                            <td align="center" valign="top" style="padding: 0; margin: 0; width: 560px">
                              <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px">
                                <tr style="border-collapse: collapse">
                                  <td align="center" class="made_with" style="padding: 0; margin: 0; font-size: 0">
                                    <a target="_blank" href="https://app.evergreenion.com/static/media/evergreen_logo.33f099dc164c59331efa.png" style="-webkit-text-size-adjust: none; -ms-text-size-adjust: none; mso-line-height-rule: exactly; text-decoration: none; color: #38761d; font-size: 18px"
                                      ><img src="https://app.evergreenion.com/static/media/evergreen_logo.33f099dc164c59331efa.png" alt style="display: block; border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic" width="125"
                                    /></a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
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
</html>
`;
};
module.exports = { NotWrokingReportTemplate };
