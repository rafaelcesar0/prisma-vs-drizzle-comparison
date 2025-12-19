import { codeToHtml } from 'shiki'

export async function highlightCode(code: string, lang: string) {
  try {
    const html = await codeToHtml(code, {
      lang,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    })

    // Remove inline background to let the container style control it.
    return html.replace(/background-color:\s*#[0-9a-fA-F]{3,8};?/g, '')
  } catch (err) {
    console.error('highlightCode failed', err)
    return undefined
  }
}
