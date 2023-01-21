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
                <img alt="UMIC Brasil" src="https://qrcomer-api.herokuapp.com/uploads/thumbnail_umic_logo_8ac3b9fd09.jpg?width=200&height=200" width="42" height="42" style="display:block;outline:none;border:none;text-decoration:none;border-radius:21px;width:42px;height:42px" />
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
                <p style="font-size:15px;line-height:1.4;margin:0 0 15px;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif;color:#3c4149">
                  Em breve receberá um email para preenchimento dos nomes dos participantes.
                </p>
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
                <img alt="UMIC Brasil" src="https://qrcomer-api.herokuapp.com/uploads/thumbnail_umic_logo_8ac3b9fd09.jpg?width=200&height=200" width="42" height="42" style="display:block;outline:none;border:none;text-decoration:none;border-radius:21px;width:42px;height:42px" />
                <p style="font-size:24px;line-height:1.3;margin:16px 0;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif;letter-spacing:-0.5px;font-weight:400;color:#484848;padding:17px 0 0">Confirmação de compra - COMIC 2023</p>
                <p style="font-size:15px;line-height:1.4;margin:0 0 15px;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif;color:#3c4149">
                  A compra do(s) seu(s) ingresso(s) foi iniciada com sucesso. Para concluir a compra, faça o pagamento acessando o link a seguir:
                </p>
                <table style="width:100%" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                  <tbody>
                    <tr>
                      <td><code style="font-family:monospace;font-weight:700;padding:1px 4px;background-color:#dfe1e4;letter-spacing:-0.3px;font-size:16px;border-radius:4px;color:#3c4149">
                      ${preference?.init_point}
                      </code></td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <p style="font-size:15px;line-height:1.4;margin:0 0 15px;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif;color:#3c4149">
                  Em breve receberá um email para preenchimento dos nomes dos participantes.
                </p>
                <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#dfe1e4;margin:42px 0 26px" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </html>
  `
}