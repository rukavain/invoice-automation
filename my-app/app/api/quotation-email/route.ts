import { z } from "zod";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string().optional(),
  products: z.array(
    z.object({
      quantity: z.number().default(1),
      product_name: z.string().default("N/A"),
      price: z.number().default(0),
      description: z.string().optional(),
      image: z.string().optional(),
    })
  ),
  address: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.parse(body);

    const { name, email, message = "", products, address = "N/A" } = parsed;

    const items = [];
    let subtotal = 0;

    for (const p of products) {
      const quantity = p.quantity;
      const productName = p.product_name;
      const unitPrice = p.price;
      const amount = quantity * unitPrice;
      subtotal += amount;

      items.push({
        quantity,
        name: productName,
        unit_price: `₱${unitPrice.toLocaleString(undefined, {
          minimumFractionDigits: 2,
        })}`,
        amount: `₱${amount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
        })}`,
        description: p.description || "",
        image: p.image || "",
      });
    }

    const total = subtotal;
    const now = new Date();
    const quoteNumber = `Q${now
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 14)}`;
    const quoteDate = now.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const dueDate = new Date(
      now.getTime() + 7 * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const transporter = nodemailer.createTransport({
      host: (process.env.EMAIL_HOST as string) || "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_HOST_USER as string,
      to: email,
      subject: "Quotation",
      html: `
      <div
        style="font-family: sans-serif; color: #4b5563; background-color: white; margin: 0.5rem; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); max-width: 900px; margin: auto;"
      >
        <div style="width: 100%; position: relative; margin: 15px 0">
          <img
            src="https://easemart.ph/web/image/website/1/logo/Easemart?unique=2fba680"
            alt="Logo"
            height="100"
            style="position: absolute; min-width: 100px; min-height: 100px"
          />
          <p style="text-align: left; font-size: 3rem; position: absolute; right: 0; font-weight: bold; margin: 3.5rem 0;">
            QUOTE
          </p>
        </div>
      
        <div style="width: 100%">
          <p style="font-weight: 600; margin-bottom: 0.75rem; font-size: 1.25rem;">Bill to:</p>
          <div>
            <p style="font-size: 1.25rem; margin: 0">${name}</p>
          </div>
          <div style="font-size: 0.875rem">
            <div style="margin: 10px 0">
              <p style="margin: 0; font-weight: bold">Quote #</p>
              <p style="margin: 0">${quoteNumber}</p>
            </div>
            <div style="margin: 10px 0">
              <p style="margin: 0; font-weight: bold">Quote date</p>
              <p style="margin: 0">${quoteDate}</p>
            </div>
            <div style="margin: 10px 0">
              <p style="margin: 0; font-weight: bold">Due date</p>
              <p style="margin: 0">${dueDate}</p>
            </div>
          </div>
        </div>
      
        <div style="width: 100%; margin-top: 2rem; margin-bottom: 2rem">
          <table style="width: 100%; border-collapse: collapse">
            <thead>
              <tr style="text-align: left; background-color: #60a5fa; color: white; font-size: 1.25rem;">
                <th style="padding: 0.5rem">QTY</th>
                <th style="padding: 0.5rem">Name</th>
                <th style="padding: 0.5rem">Price</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item) => `
                <tr>
                  <td style="padding: 0.5rem">${item.quantity}</td>
                  <td style="padding: 0.5rem">${item.name}</td>
                  <td style="padding: 0.5rem">${item.unit_price}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
      
          <hr style="width: 100%; margin: 1rem 0" />
      
          <div style="display: flex; flex-direction: column; gap: 0.5rem; justify-content: end; align-items: center;">
            <div style="display: flex; justify-content: space-between; align-items: center; align-self: flex-end; width: 100%; max-width: 400px; border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 1rem 0; font-weight: bold;">
              <p style="margin: 0">Total</p>
              <p style="margin: 0">₱${total.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}</p>
            </div>
          </div>
        </div>
      
        <footer style="padding: 2rem 1rem; text-align: center; background-color: #60a5fa; color: white;">
          <img
            src="https://easemart.ph/web/image/website/1/logo/Easemart?unique=2fba680"
            alt="Logo"
            height="40"
            style="position: absolute; min-width: 100px; min-height: 100px"
          />
          <address itemscope itemtype="http://schema.org/Organization" style="display: inline-block; text-align: center">
            <div>
              <span itemprop="name" style="font-weight: bold; font-size: 1.2rem">Easemart</span>
              <div itemprop="address" itemscope itemtype="http://schema.org/PostalAddress" style="margin-top: 0.5rem">
                <div style="display: flex; align-items: baseline; gap: 0.5rem">
                  <div itemprop="streetAddress">
                    Unit No. 204, 2nd Floor KACC Philmade Building,<br />
                    Lot 1 &amp; 2 corner Jose Abad Santos Avenue and E. Quirino St.<br />
                    Clark Freeport Zone PH-PAM 2023, Philippines
                  </div>
                </div>
                <div style="margin-top: 0.5rem">
                  <span itemprop="telephone">(045) 499-8151 | 0917-328-0901</span>
                </div>
                <div style="margin-top: 0.5rem">
                  <span itemprop="email">web_master@geoproglobal.com</span>
                </div>
              </div>
            </div>
            <div style="margin-top: 1rem">
              <a
                target="_blank"
                href="https://maps.google.com/maps?q=Unit+No.+204%2C+2nd+Floor+KACC+Philmade+Building%2C+Lot+1+%26+2+corner+Jose+Abad+Santos+Avenue+and+E.+Quirino+st.%2C+Clark+Freeport+Zone+2023%2C+Philippines&amp;z=8"
                style="margin-left: 0.25rem; text-decoration: none; color: #007bff"
              >Google Maps</a>
            </div>
          </address>
          <div style="background-color: #444444; width: 100%; color: white; margin: 10px 0; padding: 5px;">
            <span>Copyright ©</span>
            <span itemprop="name">Easemart</span>
          </div>
        </footer>
      </div>
      `,
    });
    return NextResponse.json(
      {
        message: "Success",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed",
        error,
      },
      {
        status: 400,
      }
    );
  }
}
