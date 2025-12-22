export const resetPasswordEmail = ({ name, resetUrl }) => `
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8" />
  <title>Скидання пароля</title>
</head>
<body style="margin:0; padding:0; background-color:#f6f6f6; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:30px 15px;">
        <table width="100%" max-width="600" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#f5f1e8; padding:20px; text-align:center;">
              <h1 style="color:#000000; margin:0; font-size:24px;">
                 <img alt="logo" src="./logo_header.jpg"> Lavanda Dreamer
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:30px; color:#111827;">
              <p style="font-size:16px;">
                Привіт${name ? `, <b>${name}</b>` : ""} 👋
              </p>

              <p style="font-size:16px; line-height:1.5;">
                Ми отримали запит на скидання пароля для вашого акаунту.
              </p>

              <p style="font-size:16px; line-height:1.5;">
                Натисніть кнопку нижче, щоб встановити новий пароль:
              </p>

              <!-- Button -->
              <div style="text-align:center; margin:30px 0;">
                <a href="${resetUrl}"
                   style="
                     background:#111827;
                     color:#ffffff;
                     text-decoration:none;
                     padding:14px 28px;
                     border-radius:6px;
                     font-size:16px;
                     display:inline-block;
                   ">
                  🔐 Скинути пароль
                </a>
              </div>

              <p style="font-size:14px; color:#6b7280;">
                Посилання дійсне протягом <b>15 хвилин</b>.
              </p>

              <p style="font-size:14px; color:#6b7280;">
                Якщо кнопка не працює, скопіюйте це посилання:
              </p>

              <p style="font-size:13px; word-break:break-all; color:#2563eb;">
                ${resetUrl}
              </p>

              <hr style="margin:30px 0; border:none; border-top:1px solid #e5e7eb;" />

              <p style="font-size:13px; color:#9ca3af;">
                Якщо ви не запитували скидання пароля — просто проігноруйте цей лист.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; padding:15px; text-align:center;">
              <p style="font-size:12px; color:#6b7280; margin:0;">
                © ${new Date().getFullYear()} BedLinen. Всі права захищено.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
