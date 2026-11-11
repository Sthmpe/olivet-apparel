/**
 * Free email delivery for booking requests through FormSubmit (formsubmit.co).
 * No account or API key: the first request sends an activation email to the
 * address, and after one click every request arrives in that inbox.
 * Runs in the browser, because FormSubmit expects requests from a web page.
 */
export async function emailRequest(to: string, subject: string, body: string, replyTo?: string | null): Promise<boolean> {
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: subject,
        _template: "box",
        _captcha: "false",
        ...(replyTo ? { _replyto: replyTo } : {}),
        message: body,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export function mailtoLink(to: string, subject: string, body: string): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
