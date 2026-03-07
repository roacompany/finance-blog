import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

// Gmail SMTP — GMAIL_USER + GMAIL_APP_PASSWORD 환경변수 설정 시 활성화
const mailer = (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    })
  : null;

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}));

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: '유효한 이메일을 입력해주세요.' }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const db = await getDb();
    // INSERT OR IGNORE: atomic — rowsAffected=1 means newly inserted, 0 means already existed
    const insertResult = await db.execute({
      sql: `INSERT OR IGNORE INTO members (id, email, active, source) VALUES (?, ?, 1, 'web')`,
      args: [uuidv4(), normalizedEmail],
    });
    const isNew = insertResult.rowsAffected === 1;

    // 기존 멤버 재가입 시 active 복원
    if (!isNew) {
      await db.execute({
        sql: 'UPDATE members SET active = 1 WHERE email = ?',
        args: [normalizedEmail],
      });
    }

    if (isNew && mailer) {
      await mailer.sendMail({
        from: `"ROA Finance" <${process.env.GMAIL_USER}>`,
        to: normalizedEmail,
        subject: 'ROA Finance 멤버가 되셨어요',
        html: WELCOME_EMAIL_HTML,
      }).catch((err: unknown) => {
        console.error('[membership] Gmail SMTP error:', err);
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[membership] DB error:', error);
    return NextResponse.json({ error: '가입 처리 중 오류가 발생했어요.' }, { status: 500 });
  }
}

const WELCOME_EMAIL_HTML = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>ROA Finance에 오신 것을 환영해요</title>
</head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#F5F5F5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:48px 24px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- 상단 골드 라인 -->
          <tr><td height="3" style="background:#E8D5B0;"></td></tr>

          <!-- 본문 -->
          <tr>
            <td style="background:#111;padding:48px 40px;border:1px solid rgba(255,255,255,0.07);">

              <!-- 브랜드 -->
              <p style="margin:0 0 32px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#E8D5B0;font-weight:600;">ROA Finance</p>

              <!-- 헤드라인 -->
              <h1 style="margin:0 0 20px;font-size:26px;font-weight:700;line-height:1.3;letter-spacing:-0.02em;color:#F5F5F5;">
                멤버가 되셨어요.
              </h1>

              <!-- 본문 -->
              <p style="margin:0 0 16px;font-size:15px;line-height:1.75;color:rgba(255,255,255,0.75);">
                이제 모든 아카이브 글을 자유롭게 읽을 수 있어요.<br />
                금융을 깊이 이해하는 사람들을 위한 인사이트를 매일 전달할게요.
              </p>

              <p style="margin:0 0 36px;font-size:15px;line-height:1.75;color:rgba(255,255,255,0.75);">
                오늘의 노트는 당일 자정까지 누구나 무료로 읽을 수 있어요.<br />
                지나간 글들은 이제 멤버인 당신만 읽을 수 있어요.
              </p>

              <!-- CTA 버튼 -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#E8D5B0;border-radius:999px;padding:0;">
                    <a href="https://www.roafinance.me" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:600;color:#0A0A0A;text-decoration:none;letter-spacing:-0.01em;">
                      아카이브 읽으러 가기 →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- 푸터 -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.3);line-height:1.6;">
                ROA Finance · 언제든 탈퇴 가능<br />
                <a href="https://www.roafinance.me" style="color:rgba(255,255,255,0.3);">roafinance.me</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

