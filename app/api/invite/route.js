import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  const { candidatEmail, candidatName, offreTitle, invitationToken } = await request.json()

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://talentlink-git-main-maxime-lafond-s-projects.vercel.app'

  try {
    await resend.emails.send({
      from: 'TalentLink <onboarding@resend.dev>',
      to: candidatEmail,
      subject: `Invitation à passer un test — ${offreTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: #2563EB; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
            <span style="color: white; font-weight: bold; font-size: 16px;">TL</span>
          </div>
          <h1 style="font-size: 24px; font-weight: bold; color: #111827; margin-bottom: 8px;">Bonjour ${candidatName} !</h1>
          <p style="color: #6B7280; margin-bottom: 24px;">Un recruteur vous a invité à passer un test de compétences pour le poste de <strong style="color: #111827">${offreTitle}</strong>.</p>
          <div style="background: #F9FAFB; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="color: #6B7280; font-size: 14px; margin: 0 0 8px;">Ce test comprend :</p>
            <ul style="color: #374151; font-size: 14px; margin: 0; padding-left: 20px;">
              <li>Des questions techniques</li>
              <li>Des questions de soft skills</li>
              <li>Un chronomètre par question</li>
              <li>Un certificat si vous êtes admis</li>
            </ul>
          </div>
          <a href="${baseUrl}/candidat?token=${invitationToken}" 
             style="display: block; background: #2563EB; color: white; text-align: center; padding: 14px; border-radius: 12px; text-decoration: none; font-weight: 500; margin-bottom: 16px;">
            Accepter l'invitation et passer le test →
          </a>
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">Ce lien est valable 5 jours · Usage unique</p>
        </div>
      `
    })
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
