import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Только POST-запросы разрешены" });
  }

  const { name, phone, email, datetime, guests } = req.body;

  if (!name || !phone || !datetime || !guests) {
    return res.status(400).json({ message: "Обязательные поля не заполнены" });
  }

  // Настройка SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // HTML для администратора
  const adminHtml = `
    <div style="font-family:Arial,sans-serif; color:#333; padding:20px;">
      <h2 style="color:#007bff;">Новая бронь WiB.fd</h2>
      <table style="width:100%; border-collapse:collapse;">
        <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Имя</strong></td><td style="padding:8px; border:1px solid #ddd;">${name}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Телефон</strong></td><td style="padding:8px; border:1px solid #ddd;">${phone}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd;"><strong>E-mail</strong></td><td style="padding:8px; border:1px solid #ddd;">${email}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Дата и время</strong></td><td style="padding:8px; border:1px solid #ddd;">${datetime}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Гостей</strong></td><td style="padding:8px; border:1px solid #ddd;">${guests}</td></tr>
      </table>
    </div>
  `;

  // HTML для клиента
  const clientHtml = `
    <div style="font-family:Arial,sans-serif; color:#333; padding:20px; background:#f9f9f9;">
      <h2 style="color:#007bff;">Подтверждение брони WiB.fd</h2>
      <p>Здравствуйте, ${name}!</p>
      <p>Вы успешно забронировали стол:</p>
      <ul>
        <li><strong>Дата и время:</strong> ${datetime}</li>
        <li><strong>Гостей:</strong> ${guests}</li>
      </ul>
      <p>Мы свяжемся с вами для подтверждения.</p>
      <p>Спасибо за бронирование!</p>
    </div>
  `;

  try {
    // Письмо админу
    await transporter.sendMail({
      from: `"Бронирование IV Bar" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Админ
      subject: `Новая бронь от ${name}`,
      html: adminHtml
    });

    // Письмо клиенту (если указан email)
    if (email) {
      await transporter.sendMail({
        from: `"IV Bar" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Подтверждение вашей брони WiB.fd",
        html: clientHtml
      });
    }

    res.status(200).json({ message: "Бронь успешно отправлена!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось отправить бронь", error: err.toString() });
  }
}
