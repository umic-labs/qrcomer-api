'use strict';

const mercadopago = require("mercadopago")
/**
 * purchase service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::purchase.purchase', ({ strapi }) => ({
  async create(params) {
    
    const preference = await strapi.service('api::purchase.purchase').createPreference(params)

    const result = await super.create({
      data: {
        ...params.data,
        preference,
        preferenceId: preference.id
      }
    });
  
    return result;
  },

  async createPreference(params) {
    const { email, cpf, name, items, phoneNumber } = params.data
    const firstName = name.split(' ')[0]
    const surname = name.split(firstName)[1]

    const url = `${process.env.FRONT_END_APP_URL}/feedback-payment`

    let preference = {
      items,
      payer: {
        email,
        name: firstName,
        surname,
        identification: {
          type: "CPF",
          number: cpf,
        },
        phone: {
          area_code: phoneNumber?.substring(0,2),
          number: Number(phoneNumber),
        },
      },
      back_urls: {
        "success": url,
        "failure": url,
        "pending": url
      },
      auto_return: "approved",
    };

    mercadopago.configure({
      access_token: process.env.ACCESS_TOKEN
    });

    const responsePreference = await mercadopago.preferences.create(preference)
      .then((response)  => {
        return response.body
      }).catch(function (error) {
        console.log(error);
		});

    return responsePreference
  },

  async findByPreference(preferenceId) {  
    const result = await strapi.db.query('api::purchase.purchase')
      .findOne({
        where: {
          preferenceId: preferenceId
        },
        populate: ['attendees']
      });

    return result
  },

  async feedback({ preferenceId, status }) {
    const isValid = await strapi.query('api::purchase.purchase').findOne({
      where: {
        preferenceId,
      } 
    })

    if (!isValid) return null

    const purchase = await strapi.query('api::purchase.purchase')
      .update({
        where: {
          preferenceId,
        }, 
        data: { status },
      })

    return purchase;
  },

  async sendConfirmationEmail({ to, preferenceId }) {
    const html = composeConfirmationEmail({ preferenceId })

    const email = await strapi.plugins['email'].services.email.send({
      to,
      subject: 'Confirmação de inscrição - COMIC 2023',
      html
    })

    return email
  },

  async sendNotificationEmail({ to, preference }) {
    const html = composeNotificationEmail({ preference })

    const email = await strapi.plugins['email'].services.email.send({
      to,
      subject: 'Inscrição iniciada - COMIC 2023',
      html
    })

    return email
  },

  async generageAttendees({ purchase }) {
    if (!purchase || !purchase['attendees_data']) return null

    const attendeeDatas = purchase['attendees_data']

    const attendee = attendeeDatas.map(async (attendeeData) => {
      const data = {
        church: attendeeData.church,
        city: attendeeData.city,
        name: attendeeData.name,
        phone: attendeeData.phone,
        ticket: attendeeData.ticket,
        purchase: purchase.id
      }

      return await strapi.query('api::attendee.attendee').create({ data })
    })

    return attendee
  }
}));


function composeConfirmationEmail({ preferenceId }){
  return `
    <!DOCTYPE htmlPUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html lang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      </head>
      <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
        Confirmação de compra - COMIC 2023
      </div>
      <table style="width:100%;background-color:#ffffff" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation">
        <tbody>
          <tr>
            <td>
              <div style="max-width:37.5em;margin:0 auto;padding:20px 0 48px;width:560px">
                <img alt="UMIC Brasil" src="https://imgur.com/xvrtwEi" width="42" height="42" style="display:block;outline:none;border:none;text-decoration:none;border-radius:21px;width:42px;height:42px" />
                <p style="font-size:24px;line-height:1.3;margin:16px 0;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif;letter-spacing:-0.5px;font-weight:400;color:#484848;padding:17px 0 0">Confirmação de compra - COMIC 2023</p>
                <p style="font-size:15px;line-height:1.4;margin:0 0 15px;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif;color:#3c4149">
                  A compra do(s) seu(s) ingresso(s) foi realizada com sucesso. Guarde o código de confirmação de sua compra:
                </p>
                <table style="width:100%" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                  <tbody>
                    <tr>
                      <td><code style="font-family:monospace;font-weight:700;padding:1px 4px;background-color:#dfe1e4;letter-spacing:-0.3px;font-size:16px;border-radius:4px;color:#3c4149">
                      ${preferenceId}
                      </code></td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#dfe1e4;margin:42px 0 26px" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </html>
  `
}

function composeNotificationEmail({ preference }){
  return `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Seus ingressos te esperam - COMIC 2023</title>
      <style>
    @media only screen and (max-width: 620px) {
      table[class=body] h1 {
        font-size: 28px !important;
        margin-bottom: 10px !important;
      }

      table[class=body] p,
    table[class=body] ul,
    table[class=body] ol,
    table[class=body] td,
    table[class=body] span,
    table[class=body] a {
        font-size: 16px !important;
      }

      table[class=body] .wrapper,
    table[class=body] .article {
        padding: 10px !important;
      }

      table[class=body] .content {
        padding: 0 !important;
      }

      table[class=body] .container {
        padding: 0 !important;
        width: 100% !important;
      }

      table[class=body] .main {
        border-left-width: 0 !important;
        border-radius: 0 !important;
        border-right-width: 0 !important;
      }

      table[class=body] .btn table {
        width: 100% !important;
      }

      table[class=body] .btn a {
        width: 100% !important;
      }

      table[class=body] .img-responsive {
        height: auto !important;
        max-width: 100% !important;
        width: auto !important;
      }
    }
    @media all {
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

      .apple-link a {
        color: inherit !important;
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        text-decoration: none !important;
      }

      .btn-primary table td:hover {
        background-color: #d5075d !important;
      }

      .btn-primary a:hover {
        background-color: #d5075d !important;
        border-color: #d5075d !important;
      }
    }
    </style></head>
      <body class style="background-color: #eaebed; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; background-color: #eaebed; width: 100%;" width="100%" bgcolor="#eaebed">
          <tr>
            <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
            <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; Margin: 0 auto;" width="580" valign="top">
              <div class="header" style="padding: 20px 0;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;">
                  <tr>
                    <td class="align-center" width="100%" style="font-family: sans-serif; font-size: 14px; vertical-align: top; text-align: center;" valign="top" align="center">
                      <p class="logo" style="margin: 0; margin-bottom: 15px; font-size: 30px; font-weight: bold; font-family: Arial, Helvetica, sans-serif;">COMIC 2023 - Morrinhos</p>
                    </td>
                  </tr>
                </table>
              </div>
              <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">

                <!-- START CENTERED WHITE CONTAINER -->
                <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; background: #ffffff; border-radius: 3px; width: 100%;" width="100%">

                  <!-- START MAIN CONTENT AREA -->
                  <tr>
                    <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
                        <tr>
                          <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">
                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">A compra do(s) seu(s) ingresso(s) foi iniciada.</p>
                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Para concluir sua inscrição, faça o pagamento:</p>
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; box-sizing: border-box; width: 100%;" width="100%">
                              <tbody>
                                <tr>
                                  <td align="center" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" valign="top">
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: auto; width: auto;">
                                      <tbody>
                                        <tr>
                                          <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center; background-color: #ec0867;" valign="top" align="center" bgcolor="#ec0867"> <a href="${preference?.init_point}" target="_blank" style="border: solid 1px #ec0867; border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize; background-color: #ec0867; border-color: #ec0867; color: #ffffff;">Realizar pagamento</a> </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                <!-- END MAIN CONTENT AREA -->
                </table>

                <!-- START FOOTER -->
                <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
                    <tr>
                      <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #9a9ea6; font-size: 12px; text-align: center;" valign="top" align="center">
                        <span class="apple-link" style="color: #9a9ea6; font-size: 12px; text-align: center;">UMIC BRASIL</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #9a9ea6; font-size: 12px; text-align: center;" valign="top" align="center">
                        Caso tenha alguma dúvida, entre em contato em <em>umicbrasil@gmail.com</em>
                      </td>
                    </tr>
                  </table>
                </div>
                <!-- END FOOTER -->

              <!-- END CENTERED WHITE CONTAINER -->
              </div>
            </td>
            <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
          </tr>
        </table>
      </body>
    </html>
  `
}