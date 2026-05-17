const htmlExtra3 = [
  {
    "slug": "html-email",
    "title": "31. HTML Email (Table Layout, Inline CSS, Compatibilitate)",
    "order": 31,
    "theory": [
      {
        "order": 1,
        "title": "De ce email HTML e diferit de web HTML",
        "content": "Email HTML traieste intr-o lume aparte: clientii de email (Outlook, Gmail, Apple Mail) au propriile motoare de randare, deseori foarte vechi.\n\nPROBLEME SPECIFICE EMAIL:\n```\n- Outlook (Windows) foloseste Microsoft Word ca motor de randare HTML!\n  - Nu suporta: flexbox, grid, CSS background-image, border-radius, CSS transforms\n- Gmail taie email-urile > 102KB\n- Gmail mobil elimina <head> si <style> in unele versiuni\n- Apple Mail e cel mai bun: suporta aproape totul\n- Yahoo Mail are propriile limitari\n```\n\nREGULA DE AUR: Foloseste table-based layout.\n\nSCHELET EMAIL:\n```html\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\"\n  \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" lang=\"ro\">\n<head>\n  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Email Title</title>\n  <style>\n    /* Reset email */\n    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }\n    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }\n    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }\n    \n    /* Media query pentru mobile */\n    @media only screen and (max-width: 600px) {\n      .email-container { width: 100% !important; }\n      .mobile-center { text-align: center !important; }\n    }\n  </style>\n</head>\n<body style=\"margin: 0; padding: 0; background-color: #f4f4f4;\">\n  <!-- EMAIL CONTENT -->\n</body>\n</html>\n```\n\nLA INTERVIU: De ce nu folosesti div si flexbox in email? Outlook foloseste Microsoft Word rendering engine. Word nu suporta CSS modern. Table-based layout e singurul garantat sa functioneze cross-client."
      },
      {
        "order": 2,
        "title": "Table Layout pentru email — structura si exemple",
        "content": "STRUCTURA DE BAZA CU TABLE:\n```html\n<!-- Wrapper exterior (intreaga pagina) -->\n<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"\n       style=\"background-color: #f4f4f4;\">\n  <tr>\n    <td align=\"center\" style=\"padding: 20px 0;\">\n      \n      <!-- Container principal (600px latime standard) -->\n      <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\"\n             class=\"email-container\"\n             style=\"background-color: #ffffff; border-radius: 8px;\">\n        \n        <!-- HEADER -->\n        <tr>\n          <td style=\"background-color: #1a73e8; padding: 30px 40px;\">\n            <img src=\"https://firma.ro/logo.png\" alt=\"Logo Firma\"\n                 width=\"150\" height=\"auto\"\n                 style=\"display: block;\">\n          </td>\n        </tr>\n        \n        <!-- BODY -->\n        <tr>\n          <td style=\"padding: 40px;\">\n            <h1 style=\"margin: 0 0 20px; font-family: Arial, sans-serif;\n                       font-size: 24px; color: #333333;\">\n              Bun venit!\n            </h1>\n            <p style=\"margin: 0 0 20px; font-family: Arial, sans-serif;\n                      font-size: 16px; line-height: 1.6; color: #666666;\">\n              Bun venit pe platforma noastra. Contul tau a fost creat cu succes.\n            </p>\n            \n            <!-- BUTON CTA -->\n            <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n              <tr>\n                <td style=\"background-color: #1a73e8; border-radius: 4px;\">\n                  <a href=\"https://firma.ro/login\"\n                     style=\"display: inline-block; padding: 14px 32px;\n                            font-family: Arial, sans-serif; font-size: 16px;\n                            font-weight: bold; color: #ffffff;\n                            text-decoration: none;\">Intra in cont</a>\n                </td>\n              </tr>\n            </table>\n          </td>\n        </tr>\n        \n        <!-- FOOTER -->\n        <tr>\n          <td style=\"background-color: #f8f8f8; padding: 20px 40px;\n                     border-top: 1px solid #eeeeee;\">\n            <p style=\"margin: 0; font-family: Arial, sans-serif;\n                      font-size: 12px; color: #999999; text-align: center;\">\n              &copy; 2025 Firma SRL. Toate drepturile rezervate.<br>\n              <a href=\"https://firma.ro/unsubscribe?token=xxx\"\n                 style=\"color: #999999;\">Dezabonare</a>\n            </p>\n          </td>\n        </tr>\n        \n      </table>\n    </td>\n  </tr>\n</table>\n```\n\nREGULI TABLE EMAIL:\n- `border=\"0\" cellpadding=\"0\" cellspacing=\"0\"` intotdeauna!\n- `width` ca atribut HTML (nu numai CSS)\n- Evita `rowspan` si `colspan` complexe (Outlook le rupe)"
      },
      {
        "order": 3,
        "title": "Inline CSS si compatibilitate cross-client",
        "content": "INLINE CSS — obligatoriu pentru email:\n```html\n<!-- CSS in <style> poate fi eliminat de unii clienti de email.\n     Inline e singurul 100% sigur: -->\n\n<!-- GRESIT (poate fi ignorat): -->\n<style>.titlu { font-size: 24px; color: #333; }</style>\n<h1 class=\"titlu\">Salut</h1>\n\n<!-- CORECT (inline):\n<h1 style=\"font-size: 24px; color: #333; margin: 0;\">Salut</h1>\n\n<!-- IMAGINI IN EMAIL: -->\n<!-- IMPORTANT: hosted pe server extern, nu embedded -->\n<img src=\"https://cdn.firma.ro/email/banner.jpg\"\n     alt=\"Banner promotie\"  <!-- alt e critic - email poate bloca imaginile -->\n     width=\"600\"            <!-- latime explicita -->\n     height=\"200\"           <!-- inaltime explicita - evita reflow -->\n     style=\"display: block; max-width: 100%;\">\n\n<!-- MSO CONDITIONAL COMMENTS (Outlook specific): -->\n<!--[if mso]>\n  <table role=\"presentation\" style=\"width:600px\">\n    <tr><td>\n<![endif]-->\n<div class=\"email-container\">...</div>\n<!--[if mso]></td></tr></table><![endif]-->\n\n<!-- BUTON OUTLOOK-SAFE (VML): -->\n<!--[if mso]>\n<v:roundrect xmlns:v=\"urn:schemas-microsoft-com:vml\" style=\"height:48px;v-text-anchor:middle;width:200px;\"\n  arcsize=\"10%\" fillcolor=\"#1a73e8\" strokecolor=\"#1a73e8\">\n  <v:textbox style=\"mso-fit-shape-to-text:false;\" inset=\"0px,0px,0px,0px\">\n    <center><a href=\"URL\" style=\"color:white;text-decoration:none;\">Click Here</a></center>\n  </v:textbox>\n</v:roundrect>\n<![endif]-->\n<!--[if !mso]><!-->\n<a href=\"URL\" style=\"background:#1a73e8;color:white;padding:14px 30px;text-decoration:none;border-radius:4px;\">Click Here</a>\n<!--<![endif]-->```\n\nPROPRIETATI CSS SUPORTATE CROSS-CLIENT (sigure):\n- font-family, font-size, font-weight, font-style, color\n- background-color (dar NU background-image in Outlook!)\n- margin, padding (pe td, nu pe table direct in Outlook)\n- border, width, height (ca atribute preferabil)"
      },
      {
        "order": 4,
        "title": "Litmus Testing si Dark Mode Email",
        "content": "TESTARE EMAIL — WORKFLOW:\n```\n1. Development: --\n   - Email cu HTML in editor\n   - Preview in browser (nu e exact)\n\n2. Testing:\n   - Litmus.com — preview in 100+ clienti (paid)\n   - Email on Acid — similar\n   - Mail Tester (mail-tester.com) — spam score\n   - Testare manuala in Gmail, Outlook, Apple Mail\n\n3. Trimitere:\n   - SendGrid, Mailchimp, Amazon SES, Postmark\n   - NICIODATA de pe serverul tau direct (spam)\n```\n\nDARK MODE EMAIL:\n```html\n<style>\n  /* Suportat de Apple Mail, Outlook Mac, Gmail App (partial) */\n  @media (prefers-color-scheme: dark) {\n    .email-body {\n      background-color: #1a1a1a !important;\n    }\n    .email-container {\n      background-color: #2d2d2d !important;\n    }\n    .text-main {\n      color: #e0e0e0 !important;\n    }\n    .text-muted {\n      color: #a0a0a0 !important;\n    }\n  }\n  \n  /* Outlook dark mode (CSS class) */\n  [data-ogsc] .email-body {\n    background-color: #1a1a1a !important;\n  }\n</style>\n\n<!-- Logo pentru dark mode (versiune alba pe fundal inchis) -->\n<!--[if !mso]><!-->\n<picture>\n  <source srcset=\"logo-white.png\" media=\"(prefers-color-scheme: dark)\">\n  <img src=\"logo-dark.png\" alt=\"Logo\" width=\"150\">\n</picture>\n<!--<![endif]-->\n```\n\nCHECKLIST EMAIL PRODUCTION:\n```\n[x] Subject line max 50 caractere\n[x] Preheader text (text invizibil dupa subject in inbox)\n[x] Alt text pe toate imaginile\n[x] Link dezabonare (legal obligatoriu in Romania/EU — GDPR)\n[x] Testat in Gmail, Outlook, Apple Mail, mobil\n[x] Spam score < 3 (mail-tester.com)\n[x] DKIM si SPF configurate pe domeniu\n[x] Latime 600px standard\n```\n\nPREHEADER TEXT:\n```html\n<!-- Text ascuns vizual dar vizibil in inbox dupa subject: -->\n<div style=\"display:none; max-height:0; overflow:hidden;\n            mso-hide:all; visibility:hidden; opacity:0;\n            font-size:1px; color:#ffffff;\">\n  Promotie 30% reducere la toate produsele pana vineri!\n</div>```\n\nLA INTERVIU: Ce este preheader text? Textul ascuns de sub subject in inbox, vizibil in lista de emailuri. Creste rata de deschidere cu 30-40%. Trebuie ascuns in email (display:none cu multiple proprietati pentru toti clientii)."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "email table",
        "question": "De ce folosesti TABLE in loc de DIV pentru layout-ul emailurilor?",
        "options": [
          "TABLE e mai rapid",
          "Outlook foloseste Microsoft Word engine care nu suporta CSS modern (flexbox, grid). TABLE e universal suportat.",
          "TABLE e semantic",
          "TABLE e recomandat de W3C"
        ],
        "answer": "Outlook foloseste Microsoft Word engine care nu suporta CSS modern (flexbox, grid). TABLE e universal suportat.",
        "explanation": "Outlook 2013-2021 Windows: randare prin Word.exe. Asta inseamna ca CSS avansat nu functioneaza. TABLE e engine-agnostic.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "inline css email",
        "question": "De ce pui CSS inline in email si nu in tag-ul <style>?",
        "options": [
          "Inline e mai rapid",
          "Unii clienti de email (Gmail, unele versiuni) elimina <head> si <style> — inline CSS nu poate fi eliminat",
          "W3C recomanda",
          "E mai scurt"
        ],
        "answer": "Unii clienti de email (Gmail, unele versiuni) elimina <head> si <style> — inline CSS nu poate fi eliminat",
        "explanation": "CSS inline ramane pe element indiferent de procesarea clientului de email. Instrumentele ca MJML sau Maizzle fac inlining automat.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "cellspacing cellpadding",
        "question": "De ce adaugi `border='0' cellpadding='0' cellspacing='0'` pe fiecare table in email?",
        "options": [
          "Estetica",
          "Reseteaza spatiile implicite ale browser-ului pe tabele — email-urile ar arata diferit in fiecare client altfel",
          "SEO",
          "Validare HTML"
        ],
        "answer": "Reseteaza spatiile implicite ale browser-ului pe tabele — email-urile ar arata diferit in fiecare client altfel",
        "explanation": "Browser-ul adauga spatii implicite pe table. In email, vrei control total. border=0 cellpadding=0 cellspacing=0 = reset.",
        "difficulty": "easy"
      },
      {
        "number": 4,
        "name": "alt text imagini email",
        "question": "De ce este alt text-ul pe imagini critic in email?",
        "options": [
          "SEO",
          "Multi clienti blocheaza imaginile implicit — userul vede alt text in loc. Alt text absent = email neinteles",
          "Validare",
          "Accesibilitate"
        ],
        "answer": "Multi clienti blocheaza imaginile implicit — userul vede alt text in loc. Alt text absent = email neinteles",
        "explanation": "Outlook, Gmail (adesea) blocheaza imaginile pana userul apasa 'Afiseaza imaginile'. Email fara alt text = doar tabele goale.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "600px latime",
        "question": "De ce este 600px latimea standard pentru email-uri HTML?",
        "options": [
          "Standard W3C",
          "Functioneaza bine pe desktop (cat de lat e preview panel-ul) si se redimensioneaza OK pe mobil",
          "Outlook impune",
          "Gmail impune"
        ],
        "answer": "Functioneaza bine pe desktop (cat de lat e preview panel-ul) si se redimensioneaza OK pe mobil",
        "explanation": "Preview panel-urile Outlook/Gmail sunt in jur de 600-700px. Emailurile mai late necesita scroll orizontal. 600px e golden standard.",
        "difficulty": "easy"
      },
      {
        "number": 6,
        "name": "preheader text",
        "question": "Ce este preheader text-ul si cum il ascunzi vizual in email?",
        "options": [
          "Subject line",
          "Text ascuns cu display:none dupa <body>, vizibil in inbox dupa subject. Creste rata de deschidere.",
          "Footer text",
          "Alt text"
        ],
        "answer": "Text ascuns cu display:none dupa <body>, vizibil in inbox dupa subject. Creste rata de deschidere.",
        "explanation": "Inbox afiseaza: 'Subject - Preheader text...'. Cu preheader bun, rata de deschidere creste 30-40%. display:none singur nu e suficient — trebuie si max-height:0 overflow:hidden.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "mso conditional",
        "question": "Ce sunt comentariile MSO conditionale (`<!--[if mso]>`) in email HTML?",
        "options": [
          "Comentarii standard HTML",
          "Directive speciale citite NUMAI de Microsoft Outlook — permit cod alternativ pentru Outlook",
          "JavaScript",
          "CSS media queries"
        ],
        "answer": "Directive speciale citite NUMAI de Microsoft Outlook — permit cod alternativ pentru Outlook",
        "explanation": "Outlook executa codul din [if mso]. Alti clienti il ignora. Util pentru VML buttons si layout-uri specifice Outlook.",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "dark mode email",
        "question": "Cum adaptezi email-ul pentru dark mode?",
        "options": [
          "Nu se poate",
          "@media (prefers-color-scheme: dark) in <style> + !important pe culorile inversate",
          "JavaScript toggle",
          "Font alb"
        ],
        "answer": "@media (prefers-color-scheme: dark) in <style> + !important pe culorile inversate",
        "explanation": "Suportat de Apple Mail, Outlook Mac, Gmail App partial. Necesita !important deoarece inline CSS are specificitate mare.",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "litmus testing",
        "question": "Ce face Litmus.com in contextul email development?",
        "options": [
          "Trimite emailuri",
          "Previews email-ul in 100+ clienti simultan — Gmail, Outlook, Apple Mail, mobile",
          "Valideaza HTML",
          "Optimizeaza imagini"
        ],
        "answer": "Previews email-ul in 100+ clienti simultan — Gmail, Outlook, Apple Mail, mobile",
        "explanation": "Fara Litmus trebuie sa trimiti email real la conturi test in fiecare client. Litmus automatizeaza asta cu screenshot-uri.",
        "difficulty": "easy"
      },
      {
        "number": 10,
        "name": "dezabonare gdpr",
        "question": "De ce este OBLIGATORIU link-ul de dezabonare in email?",
        "options": [
          "Conventional",
          "Legal — GDPR (Romania/EU) si CAN-SPAM (SUA) impun. Fara el: amenda si blocarea domeniului de ESP.",
          "Tehnic",
          "Conventional de design"
        ],
        "answer": "Legal — GDPR (Romania/EU) si CAN-SPAM (SUA) impun. Fara el: amenda si blocarea domeniului de ESP.",
        "explanation": "ESP-urile (SendGrid, Mailchimp) suspenda conturi fara unsubscribe. GDPR: dreptul la stergere din lista. Amenda pana la 4% din cifra de afaceri.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "email width attribute",
        "question": "De ce definesti `width='600'` ca atribut HTML pe table, nu numai ca `style='width:600px'`?",
        "options": [
          "Atributul e mai rapid",
          "Outlook ignora adesea CSS width pe table dar respecta atributul HTML width",
          "E HTML5 standard",
          "Nu exista diferenta"
        ],
        "answer": "Outlook ignora adesea CSS width pe table dar respecta atributul HTML width",
        "explanation": "In email: folosesti AMANDOUA: width='600' style='width:600px'. Redundanta intentionata pentru compatibilitate maxima.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Email buton CTA",
        "question": "Scrie HTML pentru un buton email compatibil (fara VML, simplu): text 'Comanda acum', fundal #e53e3e, text alb, padding 14px 32px, border-radius 4px.",
        "options": [],
        "answer": "",
        "explanation": "<td style='background-color:#e53e3e;border-radius:4px;'><a href='#' style='display:inline-block;padding:14px 32px;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;'>Comanda acum</a></td>",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Email doua coloane",
        "question": "Scrie structura HTML pentru un email cu 2 coloane egale (300px fiecare) cu table-based layout.",
        "options": [],
        "answer": "",
        "explanation": "<td width='300' style='width:300px;padding:20px;vertical-align:top;'>Continut 1</td><td width='300' style='width:300px;padding:20px;vertical-align:top;'>Continut 2</td>",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "spam score",
        "question": "Care sunt 3 factori care cresc spam score-ul unui email?",
        "options": [
          "Imagini mari, text lung, multe linkuri",
          "Lipsa DKIM/SPF, prea multe majuscule in subject ('PROMOTIE GRATIS!!!'), ratio text/imagini dezechilibrat",
          "Font size mic, background color, border",
          "Multe tabele, CSS inline, width 600px"
        ],
        "answer": "Lipsa DKIM/SPF, prea multe majuscule in subject ('PROMOTIE GRATIS!!!'), ratio text/imagini dezechilibrat",
        "explanation": "DKIM si SPF autentifica domeniu. Spam filters detecteaza ALL CAPS. Email numai cu imagini (fara text) = spam flag.",
        "difficulty": "hard"
      },
      {
        "number": 15,
        "name": "email tools",
        "question": "Ce instrument transformi MJML in HTML email compatibil cu toti clientii?",
        "options": [
          "webpack",
          "mjml CLI sau mjml.io — compileaza sintaxa MJML simpla in HTML table-based complex",
          "sass",
          "postcss"
        ],
        "answer": "mjml CLI sau mjml.io — compileaza sintaxa MJML simpla in HTML table-based complex",
        "explanation": "MJML: scrii cod simplu (<mj-section><mj-column>), MJML genereaza HTML complex cu table-uri, MSO conditionals etc. Industry standard.",
        "difficulty": "easy"
      }
    ]
  },
  {
    "slug": "html-internalizare",
    "title": "32. Internalizare HTML (lang, dir, charset, hreflang)",
    "order": 32,
    "theory": [
      {
        "order": 1,
        "title": "Atributul lang si importanta sa",
        "content": "Atributul `lang` pe elementul `<html>` declara limba documentului. Crucial pentru accesibilitate, SEO si screen readers.\n\nLANG ATRIBUT:\n```html\n<!-- Pagina in romana: -->\n<html lang=\"ro\">\n\n<!-- Coduri de limba ISO 639-1: -->\n<!-- ro = romana, en = engleza, fr = franceza -->\n<!-- de = germana, es = spaniola, it = italiana -->\n<!-- Subtag pentru regiune (optional dar recomandat): -->\n<html lang=\"ro-RO\">  <!-- romana din Romania -->\n<html lang=\"en-US\">  <!-- engleza americana -->\n<html lang=\"en-GB\">  <!-- engleza britanica -->\n<html lang=\"fr-CA\">  <!-- franceza canadiana -->\n\n<!-- Lang pe elemente specifice (continut in alta limba): -->\n<html lang=\"ro\">\n  <body>\n    <p>Buna ziua!</p>\n    <p lang=\"en\">Hello, this is in English.</p>\n    <p lang=\"fr\">Bonjour le monde!</p>\n    <blockquote lang=\"de\" cite=\"https://example.com\">\n      Hallo Welt!\n    </blockquote>\n  </body>\n</html>\n```\n\nDE CE ESTE IMPORTANT:\n```\n1. Screen readers (NVDA, JAWS):\n   - Citesc cu vocea corecta pentru limba declarata\n   - lang='ro' = voce romaneasca\n   - lang='en' = voce engleza\n   \n2. SEO:\n   - Google foloseste lang pentru a intelege limba paginii\n   - Combina cu hreflang pentru versiuni multiple\n\n3. CSS unicode-bidi:\n   - Stil diferit pentru limbi RTL (araba, ebraica)\n\n4. Hyphenation automat:\n   - CSS hyphens: auto functioneaza corect cu lang declarat\n```\n\nVALIDARE BUN A CODULUI LANG:\n```html\n<!-- Bun: -->\n<html lang=\"ro\">\n<html lang=\"en-US\">\n\n<!-- De evitat: -->\n<html lang=\"romanian\"> <!-- GRESIT — nu e cod ISO -->\n<html lang=\"ROM\">      <!-- GRESIT — coduri ISO sunt lowercase -->\n<html>                 <!-- lipseste lang -->\n```\n\nLA INTERVIU: De ce este important atributul lang? Pentru accesibilitate (screen readers citesc corect), SEO (Google identifica limba), hyphenation CSS automat, si browser-ul poate oferi traducere automata corecta."
      },
      {
        "order": 2,
        "title": "Atributul dir si suport RTL",
        "content": "Atributul `dir` controleaza directia textului. Crucial pentru araba, ebraica, persana si alte limbi RTL.\n\nDIR ATRIBUT:\n```html\n<!-- Directii posibile: -->\n<html lang=\"ar\" dir=\"rtl\">  <!-- araba: right-to-left -->\n<html lang=\"he\" dir=\"rtl\">  <!-- ebraica -->\n<html lang=\"fa\" dir=\"rtl\">  <!-- persana -->\n<html lang=\"ro\" dir=\"ltr\">  <!-- romana: left-to-right (default) -->\n\n<!-- dir=\"auto\" lasa browserul sa detecteze: -->\n<p dir=\"auto\">This could be any language.</p>\n\n<!-- LTR text intr-o pagina RTL: -->\n<html lang=\"ar\" dir=\"rtl\">\n  <body>\n    <p>مرحبا بالعالم</p>  <!-- araba, corect RTL -->\n    <p><span dir=\"ltr\">email@example.com</span></p>  <!-- email LTR -->\n    <p><bdi>username</bdi></p>  <!-- bdi = bidirectional isolation -->\n  </body>\n</html>\n```\n\nCSS PENTRU RTL:\n```css\n/* Logice CSS — se adapteaza automat la dir: */\n.card {\n  /* In loc de margin-left, margin-right: */\n  margin-inline-start: 1rem;  /* start = left in LTR, right in RTL */\n  margin-inline-end: 1rem;\n  \n  padding-inline-start: 1rem;\n  padding-block-start: 0.5rem;  /* block = vertical */\n  \n  border-inline-start: 2px solid blue;  /* border-left in LTR */\n  \n  text-align: start;  /* left in LTR, right in RTL */\n}\n\n/* CSS :dir() pseudo-class: */\n:dir(rtl) .icon {\n  transform: scaleX(-1);  /* inversezi icoanele directionale -->\n}\n:dir(ltr) .arrow { content: '->'; }\n:dir(rtl) .arrow { content: '<-'; }\n```\n\nELEMENTUL BDI (Bidirectional Isolation):\n```html\n<!-- Cand afisezi username-uri din DB care pot fi orice limba: -->\n<p>Utilizator <bdi>ahmed_ali</bdi> a lasat un comentariu.</p>\n<p>Utilizator <bdi>יוסי</bdi> a lasat un comentariu.</p>\n<!-- fara bdi: textul arabesc/ebraic ar rupe directia paragrafului -->\n```"
      },
      {
        "order": 3,
        "title": "charset, meta accept-language si hreflang",
        "content": "CHARSET:\n```html\n<!-- OBLIGATORIU, primul tag in <head>: -->\n<meta charset=\"UTF-8\">\n\n<!-- UTF-8 suporta: -->\n<!-- - Toate alfabetele (latin, chirilic, arab, japonez, emoji) -->\n<!-- - 1.1 milioane caractere posibile -->\n<!-- - Standard universal web -->\n\n<!-- Legacy (de evitat): -->\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n<!-- Forma moderna (HTML5): <meta charset=\"UTF-8\"> -->\n\n<!-- Fisierul HTML trebuie SALVAT in UTF-8 in editor! -->\n<!-- VSCode: bottom-right corner, click pe encoding -->\n```\n\nHREFLANG — versiuni multiple ale paginii:\n```html\n<!-- Pagina ro.example.com/produse (in romana): -->\n<head>\n  <link rel=\"alternate\" hreflang=\"ro\" href=\"https://ro.example.com/produse\">\n  <link rel=\"alternate\" hreflang=\"en\" href=\"https://en.example.com/products\">\n  <link rel=\"alternate\" hreflang=\"de\" href=\"https://de.example.com/produkte\">\n  <!-- hreflang=\"x-default\" = versiunea default (fara match) -->\n  <link rel=\"alternate\" hreflang=\"x-default\" href=\"https://example.com/products\">\n</head>\n\n<!-- REGULI HREFLANG:\n  1. Fiecare versiune trebuie sa linkeze la TOATE celelalte\n  2. Codul de limba trebuie sa fie valid ISO 639-1\n  3. URL-urile trebuie sa fie absolute (cu https://)\n  4. Pagina trebuie sa existe si sa fie accesibila\n-->\n```\n\nMETA ACCEPT-LANGUAGE (mai putin folosit):\n```html\n<!-- Declara limbile disponibile (semantic, nu redirect automat): -->\n<meta http-equiv=\"content-language\" content=\"ro, en\">\n\n<!-- Detectare din server (PHP): -->\n<?php\n$acceptLang = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? 'ro';\n// 'ro-RO,ro;q=0.9,en-US;q=0.8,en;q=0.7'\n$lang = substr($acceptLang, 0, 2); // 'ro'\n?>\n```\n\nINTERNATIONALIZARE NUMERE SI DATE:\n```html\n<!-- Locale-aware cu JavaScript: -->\n<script>\n// Numar formatat pentru locale:\nconst num = 1234567.89;\nconsole.log(num.toLocaleString('ro-RO')); // '1.234.567,89'\nconsole.log(num.toLocaleString('en-US')); // '1,234,567.89'\nconsole.log(num.toLocaleString('de-DE')); // '1.234.567,89'\n\n// Data formatata:\nconst date = new Date('2025-01-15');\nconsole.log(date.toLocaleDateString('ro-RO')); // '15.01.2025'\nconsole.log(date.toLocaleDateString('en-US')); // '1/15/2025'\n</script>\n```"
      },
      {
        "order": 4,
        "title": "HTML si i18n — elemente si atribute pentru multilingvism",
        "content": "ELEMENTE HTML PENTRU I18N:\n```html\n<!-- <time> cu datetime standardizat (independent de locale): -->\n<time datetime=\"2025-01-15\">15 ianuarie 2025</time>    <!-- RO -->\n<time datetime=\"2025-01-15\">January 15, 2025</time>    <!-- EN -->\n<!-- datetime e ISO 8601, textul afisabil e in limba paginii -->\n\n<!-- <abbr> cu title pentru acronime: -->\n<abbr title=\"Organizatie Mondiala a Sanatatii\">OMS</abbr>\n<!-- In engleza: <abbr title=\"World Health Organization\">WHO</abbr> -->\n\n<!-- <q> pentru citate inline (ghilimelele variaza per lingua): -->\n<html lang=\"ro\">\n  <q>citat in romana</q>  <!-- Afiseaza cu ghilimele romanesti: <<citat>> -->\n<html lang=\"en\">\n  <q>english quote</q>   <!-- Afiseaza: \"english quote\" -->\n<html lang=\"fr\">\n  <q>citation francaise</q>  <!-- Afiseaza: <<citation francaise>> -->\n\n<!-- <ruby> pentru caractere asiatice cu pronuntie: -->\n<ruby>\n  漢 <rt>kan</rt>\n  字 <rt>ji</rt>\n</ruby>  <!-- Kanji cu furigana -->\n```\n\nFORMAT NUMERE IN HTML:\n```html\n<!-- Foloseste Intl API pentru formatare locale: -->\n<script>\nconst formatter = new Intl.NumberFormat('ro-RO', {\n  style: 'currency',\n  currency: 'RON',\n});\nconsole.log(formatter.format(1234.56)); // '1.234,56 RON'\n\nconst dateFormatter = new Intl.DateTimeFormat('ro-RO', {\n  day: '2-digit', month: 'long', year: 'numeric'\n});\nconsole.log(dateFormatter.format(new Date())); // '15 ianuarie 2025'\n\n// Pluralizare:\nconst pr = new Intl.PluralRules('ro-RO');\npr.select(1);  // 'one' -> '1 produs'\npr.select(5);  // 'few' -> '5 produse'\npr.select(20); // 'other' -> '20 de produse'\n</script>\n```\n\nCSS MULTILINGV:\n```css\n/* Font-uri care suporta multiple scripturi: */\nbody {\n  font-family: 'Noto Sans', /* Google Fonts — suporta 800+ limbi! */\n               Arial, sans-serif;\n}\n\n/* Diacritice romanesti — font care le suporta: */\n:lang(ro) {\n  font-family: 'Noto Sans', sans-serif;\n  /* t-cedilla (t,), s-cedilla (s,) sunt in Unicode: U+021B, U+0219 */\n}\n\n/* Hyphenation automat: */\np {\n  hyphens: auto;  /* Functioneaza corect cu <html lang='ro'> -->\n  overflow-wrap: break-word;\n}\n```\n\nLA INTERVIU: Diferenta i18n (internationalization) vs l10n (localization)? i18n = pregateste aplicatia sa suporte orice limba (cod Unicode, hreflang, Intl API). l10n = traducerea efectiva in fiecare limba (string-uri, formate de data, moneda)."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "lang ro",
        "question": "Cum declari corect o pagina HTML in limba romana?",
        "options": [
          "<html language='romanian'>",
          "<html lang='ro'>",
          "<html locale='ro-RO'>",
          "<meta lang='ro'>"
        ],
        "answer": "<html lang='ro'>",
        "explanation": "lang foloseste coduri ISO 639-1: ro, en, fr, de, es. Opzional cu subtag de regiune: lang='ro-RO'. Atribut pe <html>, nu <meta>.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "dir rtl",
        "question": "Cum setezi directia text right-to-left pentru o pagina in araba?",
        "options": [
          "<html direction='rtl'>",
          "<html lang='ar' dir='rtl'>",
          "text-direction: rtl in CSS",
          "<html rtl>"
        ],
        "answer": "<html lang='ar' dir='rtl'>",
        "explanation": "dir='rtl' pe <html> aplica RTL pe toata pagina. lang='ar' e necesar si pentru screen readers si hyphenation.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "charset UTF-8",
        "question": "De ce trebuie `<meta charset='UTF-8'>` sa fie PRIMUL tag din <head>?",
        "options": [
          "Conventional",
          "Browserul trebuie sa stie charset-ul inainte sa parseze orice alt continut — altfel diacriticele apar ca ???? sau simboluri ciudate",
          "SEO",
          "Validare HTML5"
        ],
        "answer": "Browserul trebuie sa stie charset-ul inainte sa parseze orice alt continut — altfel diacriticele apar ca ???? sau simboluri ciudate",
        "explanation": "Daca browserul incepe parsarea cu charset gresit, toate caracterele UTF-8 speciale (ă,î,â,ș,ț) sunt interpretate gresit.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "hreflang",
        "question": "Ce face `<link rel='alternate' hreflang='en' href='https://en.example.com/page'>`?",
        "options": [
          "Redirecteaza la pagina engleza",
          "Spune Google/motoare de cautare ca exista o versiune engleza a paginii la URL-ul respectiv",
          "Importa CSS englezesc",
          "Face link catre o pagina externa"
        ],
        "answer": "Spune Google/motoare de cautare ca exista o versiune engleza a paginii la URL-ul respectiv",
        "explanation": "hreflang nu redirecteaza automat — e un hint pentru SEO. Google afiseaza versiunea corecta per tara/limba in search results.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "hreflang x-default",
        "question": "Ce inseamna `hreflang='x-default'`?",
        "options": [
          "Engleza americana",
          "Versiunea default a paginii afisata cand nu exista match de limba/tara pentru userul respectiv",
          "Fallback la HTML vechi",
          "Prima versiune cronologic"
        ],
        "answer": "Versiunea default a paginii afisata cand nu exista match de limba/tara pentru userul respectiv",
        "explanation": "User din Japonia, nu ai versiune japaneza: x-default se afiseaza. De obicei engleza sau versiunea internationala.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "bdi element",
        "question": "Cand folosesti elementul `<bdi>`?",
        "options": [
          "Bold italic",
          "La afisarea continutului dinamic de directie necunoscuta (username-uri) intr-un text bidirectional",
          "Block display inline",
          "Background image"
        ],
        "answer": "La afisarea continutului dinamic de directie necunoscuta (username-uri) intr-un text bidirectional",
        "explanation": "Fara bdi: 'Utilizator ahmed a comentat' — daca ahmed e RTL, textul din jur se rupe. bdi izoleaza directia fragmentului.",
        "difficulty": "hard"
      },
      {
        "number": 7,
        "name": "toLocaleString",
        "question": "Cum afisezi numarul 1234567.89 formatat ca moneda RON romaneasca in JavaScript?",
        "options": [
          "(1234567.89).toFixed(2) + ' RON'",
          "new Intl.NumberFormat('ro-RO', {style:'currency', currency:'RON'}).format(1234567.89)",
          "parseFloat(1234567.89).format('RON')",
          "Number.format('ro', 1234567.89)"
        ],
        "answer": "new Intl.NumberFormat('ro-RO', {style:'currency', currency:'RON'}).format(1234567.89)",
        "explanation": "Intl.NumberFormat respecta conventiile locale: separator mii, separator zecimal, pozitia monedei. Rezultat: '1.234.567,89 RON'.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "lang pe element",
        "question": "Ai o pagina in romana cu un citat in engleza. Cum marchezi corect citatul?",
        "options": [
          "<p class='english'>quote</p>",
          "<p lang='en'>This is an English quote.</p>",
          "<p translate='en'>quote</p>",
          "<foreign>quote</foreign>"
        ],
        "answer": "<p lang='en'>This is an English quote.</p>",
        "explanation": "lang pe element individual suprascrie lang-ul parinte. Screen reader-ul va citi cu vocea engleza. CSS hyphens si font-ul vor fi cele pentru en.",
        "difficulty": "easy"
      },
      {
        "number": 9,
        "name": "time datetime",
        "question": "De ce folosesti `<time datetime='2025-01-15'>` cu atribut datetime?",
        "options": [
          "Obligatoriu HTML5",
          "Textul afisabil poate fi orice format cultural, dar datetime e ISO 8601 — masini si search engines il inteleg universal",
          "SEO direct",
          "Format mai rapid"
        ],
        "answer": "Textul afisabil poate fi orice format cultural, dar datetime e ISO 8601 — masini si search engines il inteleg universal",
        "explanation": "Poti scrie 15 ian 2025, January 15, 15. Januar — datetime='2025-01-15' e parsabil automat de robots.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "hyphens auto",
        "question": "Ce este necesar pentru ca `hyphens: auto` sa functioneze corect in CSS?",
        "options": [
          "overflow: hidden",
          "Atributul lang corect pe <html> — browserul foloseste regulile de despartire in silabe ale limbii respective",
          "font-size mare",
          "display: block"
        ],
        "answer": "Atributul lang corect pe <html> — browserul foloseste regulile de despartire in silabe ale limbii respective",
        "explanation": "Romanul desparte diferit decat engleza. hyphens: auto fara lang declarat = rezultate impredictibile sau nefunctionale.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "i18n vs l10n",
        "question": "Diferenta intre i18n (internationalization) si l10n (localization)?",
        "options": [
          "Identice",
          "i18n = pregatirea tehnica a codului (Unicode, Intl API, directii); l10n = traducerea si adaptarea culturala efectiva",
          "i18n = traducere, l10n = tehnic",
          "i18n e pentru imagini"
        ],
        "answer": "i18n = pregatirea tehnica a codului (Unicode, Intl API, directii); l10n = traducerea si adaptarea culturala efectiva",
        "explanation": "i18n: faci codul capabil sa suporte orice limba. l10n: implementezi o limba specifica (RO: traduceri, formate date, moneda RON).",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Pagina multilingva head",
        "question": "Scrie sectiunea <head> pentru o pagina cu versiuni in romana si engleza, cu hreflang corect.",
        "options": [],
        "answer": "",
        "explanation": "<meta charset='UTF-8'><title>Titlu</title><link rel='alternate' hreflang='ro' href='https://ex.com/ro/pagina'><link rel='alternate' hreflang='en' href='https://ex.com/en/page'><link rel='alternate' hreflang='x-default' href='https://ex.com/en/page'>",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "RTL pagina",
        "question": "Scrie structura HTML de baza pentru o pagina in araba cu directie RTL.",
        "options": [],
        "answer": "",
        "explanation": "<!DOCTYPE html><html lang='ar' dir='rtl'><head><meta charset='UTF-8'><title>صفحة عربية</title></head><body><p>مرحبا بالعالم</p></body></html>",
        "difficulty": "easy"
      },
      {
        "number": 14,
        "name": "Intl Date format",
        "question": "Scrie JavaScript care formateaza `new Date('2025-06-15')` in formatul romanesc '15 iunie 2025'.",
        "options": [],
        "answer": "",
        "explanation": "new Intl.DateTimeFormat('ro-RO', {day:'numeric', month:'long', year:'numeric'}).format(date)",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "q element ghilimele",
        "question": "Ce face elementul `<q>` in HTML si cum variaza aspectul sau per lingua?",
        "options": [
          "Nimic special, doar italic",
          "Adauga ghilimele automat via CSS content, adaptate stilului culturii din atributul lang al paginii",
          "Quote block",
          "Bold text"
        ],
        "answer": "Adauga ghilimele automat via CSS content, adaptate stilului culturii din atributul lang al paginii",
        "explanation": "Engleza: \"quote\". Romana/franceza: <<quote>>. Germana: 'quote'. Browserul foloseste lang pentru a alege stilul ghilimelelor.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "html-javascript-apis",
    "title": "33. HTML si JavaScript APIs (Clipboard, Geolocation, Notification)",
    "order": 33,
    "theory": [
      {
        "order": 1,
        "title": "Clipboard API — copiere si lipire programatica",
        "content": "Clipboard API permite citirea si scrierea in clipboard-ul sistemului, cu permisiune explicita.\n\nCLIPBOARD API MODERNA:\n```javascript\n// SCRIERE in clipboard (copiaza text):\nasync function copyText(text) {\n  try {\n    await navigator.clipboard.writeText(text);\n    console.log('Copiat cu succes!');\n  } catch (err) {\n    console.error('Eroare la copiere:', err);\n    // Fallback pentru browsere vechi:\n    legacyCopy(text);\n  }\n}\n\n// CITIRE din clipboard:\nasync function pasteText() {\n  try {\n    const text = await navigator.clipboard.readText();\n    console.log('Din clipboard:', text);\n    return text;\n  } catch (err) {\n    console.error('Permisiune refuzata sau eroare:', err);\n  }\n}\n\n// Exemplu: buton 'Copiaza codul'\ndocument.getElementById('btn-copy').addEventListener('click', async () => {\n  const code = document.getElementById('code-block').textContent;\n  await copyText(code);\n  btn.textContent = 'Copiat!';\n  setTimeout(() => btn.textContent = 'Copiaza', 2000);\n});\n\n// COPIERE IMAGINE (Clipboard Item):\nasync function copyImage(imageBlob) {\n  const item = new ClipboardItem({ 'image/png': imageBlob });\n  await navigator.clipboard.write([item]);\n}\n\n// FALLBACK CLASIC (pentru browsere fara Clipboard API):\nfunction legacyCopy(text) {\n  const ta = document.createElement('textarea');\n  ta.value = text;\n  ta.style.position = 'fixed';\n  ta.style.opacity = '0';\n  document.body.appendChild(ta);\n  ta.select();\n  document.execCommand('copy'); // deprecated dar inca functional\n  document.body.removeChild(ta);\n}\n```\n\nCLIPBOARD EVENTS:\n```javascript\n// Intercepteaza ctrl+v:\ndocument.addEventListener('paste', (e) => {\n  const text = e.clipboardData.getData('text/plain');\n  console.log('Lipit:', text);\n  e.preventDefault(); // previne comportamentul default\n});\n\n// Intercepteaza ctrl+c:\ndocument.addEventListener('copy', (e) => {\n  e.clipboardData.setData('text/plain', 'Text personalizat!');\n  e.preventDefault();\n});\n```"
      },
      {
        "order": 2,
        "title": "Geolocation API — locatie utilizator",
        "content": "Geolocation API ofera coordonatele GPS ale utilizatorului (cu permisiune explicita).\n\nGEOLOCATION API:\n```javascript\n// Verificare suport:\nif (!navigator.geolocation) {\n  alert('Browserul tau nu suporta Geolocation!');\n  return;\n}\n\n// Obtine pozitia o singura data:\nnavigator.geolocation.getCurrentPosition(\n  // Success callback:\n  (position) => {\n    const { latitude, longitude, accuracy } = position.coords;\n    console.log('Lat:', latitude);\n    console.log('Lng:', longitude);\n    console.log('Acuratete (metri):', accuracy);\n    console.log('Timestamp:', new Date(position.timestamp));\n    \n    // Afiseaza pe harta (Google Maps URL):\n    const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}`;\n    window.open(mapUrl);\n  },\n  // Error callback:\n  (error) => {\n    switch(error.code) {\n      case error.PERMISSION_DENIED:\n        console.log('Utilizatorul a refuzat permisiunea');\n        break;\n      case error.POSITION_UNAVAILABLE:\n        console.log('Locatia nu e disponibila (GPS off)');\n        break;\n      case error.TIMEOUT:\n        console.log('Timeout la obtinere locatie');\n        break;\n    }\n  },\n  // Options:\n  {\n    enableHighAccuracy: true,  // GPS precis (consuma baterie)\n    timeout: 10000,            // max 10 secunde\n    maximumAge: 300000         // cache locatia 5 minute\n  }\n);\n\n// Monitorizare continua (tracking):\nconst watchId = navigator.geolocation.watchPosition(\n  (position) => {\n    updateUserOnMap(position.coords);\n  },\n  handleError,\n  { enableHighAccuracy: true }\n);\n\n// Opreste tracking:\nnavigator.geolocation.clearWatch(watchId);\n```\n\nEXEMPLU REAL — Restaurante apropiate:\n```javascript\nasync function findNearby() {\n  const pos = await new Promise((resolve, reject) =>\n    navigator.geolocation.getCurrentPosition(resolve, reject)\n  );\n  const { latitude, longitude } = pos.coords;\n  const response = await fetch(\n    `/api/restaurants?lat=${latitude}&lng=${longitude}&radius=2`\n  );\n  return response.json();\n}\n```"
      },
      {
        "order": 3,
        "title": "Notification API — notificari de sistem",
        "content": "Notification API trimite notificari native OS (cu permisiune explicita).\n\nNOTIFICATION API:\n```javascript\n// Cerere permisiune (OBLIGATORIU din user gesture):\nasync function requestNotificationPermission() {\n  if (!('Notification' in window)) {\n    console.log('Browserul nu suporta notificari');\n    return;\n  }\n\n  if (Notification.permission === 'granted') {\n    sendNotification('Ai deja permisiunea!');\n  } else if (Notification.permission !== 'denied') {\n    // Cere permisiune (numai din user gesture - click!):\n    const permission = await Notification.requestPermission();\n    if (permission === 'granted') {\n      sendNotification('Notificari activate!');\n    }\n  }\n}\n\n// Trimite notificare:\nfunction sendNotification(title, options = {}) {\n  if (Notification.permission !== 'granted') return;\n  \n  const notification = new Notification(title, {\n    body: options.body || 'Mesaj notificare',\n    icon: options.icon || '/icon-192.png',\n    badge: '/badge.png',\n    tag: options.tag || 'default',       // ID unic — inlocuieste notificarea cu acelasi tag\n    requireInteraction: false,            // se inchide automat\n    data: { url: options.url || '/' },   // date personalizate\n  });\n\n  // Events pe notificare:\n  notification.onclick = () => {\n    window.focus();\n    window.location.href = notification.data.url;\n    notification.close();\n  };\n\n  notification.onclose = () => console.log('Notificarea a fost inchisa');\n\n  // Inchide dupa 5 secunde:\n  setTimeout(() => notification.close(), 5000);\n}\n\n// Exemplu de utilizare:\nsendNotification('Comanda confirmata!', {\n  body: 'Comanda #12345 a fost procesata si va fi livrata in 2-3 zile.',\n  icon: '/images/order-icon.png',\n  url: '/comenzi/12345',\n  tag: 'order-12345'\n});\n```\n\nSERVICE WORKER PUSH NOTIFICATIONS:\n```javascript\n// Push notifications (necesita Service Worker):\n// Mai avansate — vin chiar si cand tab-ul e inchis\n// Necesita: Service Worker + Push API + backend pentru trimitere\nconst registration = await navigator.serviceWorker.ready;\nconst subscription = await registration.pushManager.subscribe({\n  userVisibleOnly: true,\n  applicationServerKey: vapidPublicKey\n});\n// Trimite subscription la server\nawait fetch('/api/push-subscribe', {\n  method: 'POST',\n  body: JSON.stringify(subscription)\n});\n```"
      },
      {
        "order": 4,
        "title": "Vibration API si alte APIs HTML",
        "content": "VIBRATION API (mobil):\n```javascript\n// Vibratii pe dispozitive mobile:\nif ('vibrate' in navigator) {\n  // Vibratie simpla 200ms:\n  navigator.vibrate(200);\n\n  // Vibratie multipla: [vibra, pauza, vibra, pauza, vibra]\n  navigator.vibrate([100, 50, 100, 50, 300]);\n\n  // Opreste vibratia:\n  navigator.vibrate(0);\n  navigator.vibrate([]);\n}\n\n// Exemple uzuale:\n// Click confirmare:\nnavigator.vibrate(50);\n\n// Eroare (vibratii scurte multiple):\nnavigator.vibrate([100, 30, 100]);\n\n// Alarma:\nnavigator.vibrate([500, 200, 500, 200, 500]);\n```\n\nBATTERY API (deprecata in unele browsere):\n```javascript\nif ('getBattery' in navigator) {\n  const battery = await navigator.getBattery();\n  console.log('Nivel:', Math.round(battery.level * 100) + '%');\n  console.log('Se incarca:', battery.charging);\n  \n  battery.addEventListener('levelchange', () => {\n    if (battery.level < 0.20) {\n      alert('Baterie sub 20%! Conecteaza incarcatorul.');\n    }\n  });\n}\n```\n\nINTERSECTION OBSERVER:\n```javascript\n// Detecteaza cand un element intra in viewport:\nconst observer = new IntersectionObserver((entries) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      entry.target.classList.add('animate-in');\n      // Lazy load imagine:\n      if (entry.target.dataset.src) {\n        entry.target.src = entry.target.dataset.src;\n      }\n      observer.unobserve(entry.target); // opreste dupa prima aparitie\n    }\n  });\n}, { threshold: 0.1 }); // 10% vizibil\n\ndocument.querySelectorAll('.animate-on-scroll, img[data-src]')\n  .forEach(el => observer.observe(el));\n```\n\nWEB SHARE API:\n```javascript\n// Partajeaza nativ (ca share button pe mobil):\nasync function shareContent() {\n  if (navigator.share) {\n    await navigator.share({\n      title: 'Articol interesant',\n      text: 'Citeste acest articol!',\n      url: window.location.href,\n    });\n  } else {\n    // Fallback: copiaza URL-ul\n    await navigator.clipboard.writeText(window.location.href);\n    alert('URL copiat!');\n  }\n}\n```\n\nLA INTERVIU: Cum ceri permisiunea pentru Notification API? Cu Notification.requestPermission(), dar NUMAI din user gesture (click). Browserele blocheaza cererea automata la incarcarea paginii."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "clipboard writeText",
        "question": "Cum copiezi text in clipboard cu Clipboard API moderna?",
        "options": [
          "clipboard.copy(text)",
          "await navigator.clipboard.writeText(text)",
          "document.execCommand('copy', text)",
          "window.clipboard = text"
        ],
        "answer": "await navigator.clipboard.writeText(text)",
        "explanation": "navigator.clipboard.writeText() e async. Necesita HTTPS sau localhost. Returneaza Promise.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "geolocation permission",
        "question": "Ce cod de eroare primesti cand userul refuza permisiunea de Geolocation?",
        "options": [
          "error.code === 0",
          "error.code === error.PERMISSION_DENIED (valoare 1)",
          "error.status === 403",
          "GeolocationError.DENIED"
        ],
        "answer": "error.code === error.PERMISSION_DENIED (valoare 1)",
        "explanation": "3 coduri: PERMISSION_DENIED=1, POSITION_UNAVAILABLE=2, TIMEOUT=3. Tratezi fiecare caz diferit in error callback.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "notification permission",
        "question": "Cand poti apela `Notification.requestPermission()`?",
        "options": [
          "La orice moment",
          "Numai din user gesture (click, keypress) — browserele blocheaza cereile automate la load",
          "La DOMContentLoaded",
          "Periodic la 24h"
        ],
        "answer": "Numai din user gesture (click, keypress) — browserele blocheaza cereile automate la load",
        "explanation": "Cererea automata e considerata spam. Browserele (Chrome, Firefox) ignora requestPermission() dacaa nu e din user gesture.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "notification tag",
        "question": "Ce face optiunea `tag` la crearea unei Notification?",
        "options": [
          "Titlul notificarii",
          "ID unic — o noua notificare cu acelasi tag o inlocuieste pe cea existenta (nu se acumuleaza spam)",
          "Categorie",
          "Prioritate"
        ],
        "answer": "ID unic — o noua notificare cu acelasi tag o inlocuieste pe cea existenta (nu se acumuleaza spam)",
        "explanation": "Fara tag: 10 notificari ordine = 10 alerte. Cu tag='orders': fiecare noua comanda inlocuieste notificarea anterioara.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "vibrate array",
        "question": "Ce face `navigator.vibrate([100, 50, 100])`?",
        "options": [
          "Vibra de 3 ori",
          "Vibra 100ms, pauza 50ms, vibra 100ms — alternanta vibra/pauza",
          "Vibra cu intensitate 100",
          "Vibra 250ms total"
        ],
        "answer": "Vibra 100ms, pauza 50ms, vibra 100ms — alternanta vibra/pauza",
        "explanation": "Array la vibrate = alternanta [vibra, pauza, vibra, pauza...]. Numerele impare = vibratii, pare = pauze.",
        "difficulty": "easy"
      },
      {
        "number": 6,
        "name": "geolocation watch",
        "question": "Diferenta intre `getCurrentPosition` si `watchPosition`?",
        "options": [
          "Identice",
          "getCurrentPosition: pozitie o singura data; watchPosition: tracking continuu, callback la fiecare miscare",
          "watch e mai precis",
          "getCurrentPosition e async"
        ],
        "answer": "getCurrentPosition: pozitie o singura data; watchPosition: tracking continuu, callback la fiecare miscare",
        "explanation": "watchPosition e pentru aplicatii de navigatie, fitness. Consuma baterie. Opreste cu clearWatch(watchId).",
        "difficulty": "easy"
      },
      {
        "number": 7,
        "name": "clipboard paste event",
        "question": "Cum interceptezi paste (ctrl+v) si citesti textul din clipboard?",
        "options": [
          "onpaste()",
          "document.addEventListener('paste', e => { const text = e.clipboardData.getData('text/plain'); })",
          "document.onPasteEvent",
          "navigator.clipboard.onPaste"
        ],
        "answer": "document.addEventListener('paste', e => { const text = e.clipboardData.getData('text/plain'); })",
        "explanation": "Evenimentul paste are clipboardData. getData('text/plain') pentru text. Poti preveni comportamentul default cu e.preventDefault().",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "intersection observer",
        "question": "Ce face IntersectionObserver cu `threshold: 0.1`?",
        "options": [
          "Declanseaza cand elementul e 100% vizibil",
          "Declanseaza callback cand 10% din element e vizibil in viewport",
          "Apeleaza de 10 ori",
          "Declanseaza la 10px offset"
        ],
        "answer": "Declanseaza callback cand 10% din element e vizibil in viewport",
        "explanation": "threshold 0 = orice pixel vizibil. 1.0 = 100% vizibil. 0.1 = primul 10% din element intrat in viewport.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "web share api",
        "question": "Ce face `navigator.share({title, text, url})`?",
        "options": [
          "Posteaza pe social media",
          "Deschide dialogul nativ de partajare al sistemului de operare (ca butonul Share pe iPhone/Android)",
          "Trimite email",
          "Copiaza in clipboard"
        ],
        "answer": "Deschide dialogul nativ de partajare al sistemului de operare (ca butonul Share pe iPhone/Android)",
        "explanation": "Nativ OS share sheet: iOS (AirDrop, Messages, WhatsApp etc.), Android similar. Mai natural decat butoane custom per retea.",
        "difficulty": "easy"
      },
      {
        "number": 10,
        "name": "enableHighAccuracy",
        "question": "Ce face `enableHighAccuracy: true` in Geolocation options?",
        "options": [
          "Face request mai rapid",
          "Foloseste GPS hardware in loc de IP/WiFi triangulation — mai precis dar consuma mai multa baterie",
          "Dezactiveaza cache",
          "Trimite coordonate mai des"
        ],
        "answer": "Foloseste GPS hardware in loc de IP/WiFi triangulation — mai precis dar consuma mai multa baterie",
        "explanation": "false (default): WiFi/cell towers, rapid dar imprecis (100-1000m). true: GPS, precis la 1-10m dar lent si baterie.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "notification.onclick",
        "question": "Cum deschizi o pagina specifica cand userul da click pe o notificare?",
        "options": [
          "notification.href = url",
          "notification.onclick = () => { window.focus(); window.location.href = url; notification.close(); }",
          "Notificarile nu pot linka",
          "notification.data.url = url"
        ],
        "answer": "notification.onclick = () => { window.focus(); window.location.href = url; notification.close(); }",
        "explanation": "window.focus() aduce tab-ul in prim-plan. location.href navigheaza. close() inchide notificarea. data.url pentru URL stocat la creare.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Buton copiere cod",
        "question": "Scrie un buton 'Copiaza' care copiaza textul din elementul cu id='code' si schimba textul in 'Copiat!' timp de 2 secunde.",
        "options": [],
        "answer": "",
        "explanation": "await navigator.clipboard.writeText(code); btn.textContent = 'Copiat!'; setTimeout(() => btn.textContent = 'Copiaza', 2000);",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Geolocation cu Promise",
        "question": "Scrie o functie `getPosition()` care returneaza un Promise cu coordonatele utilizatorului.",
        "options": [],
        "answer": "",
        "explanation": "new Promise((resolve, reject) => { navigator.geolocation.getCurrentPosition(resolve, reject); })",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "Lazy load IntersectionObserver",
        "question": "Scrie codul care face lazy load pentru toate imaginile cu `data-src` folosind IntersectionObserver.",
        "options": [],
        "answer": "",
        "explanation": "const observer = new IntersectionObserver((entries) => { entries.forEach(e => { if(e.isIntersecting){ e.target.src = e.target.dataset.src; observer.unobserve(e.target); }}); }, {threshold: 0.1}); document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));",
        "difficulty": "hard"
      },
      {
        "number": 15,
        "name": "clipboard read permission",
        "question": "De ce `navigator.clipboard.readText()` poate esua chiar daca userul a dat permisiunea de clipboard?",
        "options": [
          "Bug in API",
          "Citirea din clipboard necesita permisiunea 'clipboard-read' explicit si e blocata in iframes cross-origin",
          "Nu e adevarat",
          "Necesita HTTPS"
        ],
        "answer": "Citirea din clipboard necesita permisiunea 'clipboard-read' explicit si e blocata in iframes cross-origin",
        "explanation": "writeText (copiere) e mai permisiva. readText (citire) necesita permisiune explicita de tip 'clipboard-read' si poate fi blocata din securitate.",
        "difficulty": "hard"
      }
    ]
  },
  {
    "slug": "html-custom-protocols",
    "title": "34. Custom Protocols si URL Schemes (mailto, tel, deep links)",
    "order": 34,
    "theory": [
      {
        "order": 1,
        "title": "mailto: si tel: — scheme de baza",
        "content": "URL Schemes permit legatura cu aplicatii native din browser. Cele mai comune: mailto:, tel:, sms:.\n\nMAILTO: SCHEMA:\n```html\n<!-- Email simplu: -->\n<a href=\"mailto:contact@firma.ro\">Trimite email</a>\n\n<!-- Cu subiect: -->\n<a href=\"mailto:support@firma.ro?subject=Problema%20tehnica\">Support</a>\n\n<!-- Cu subiect si corp: -->\n<a href=\"mailto:contact@firma.ro?subject=Comanda%20%23123&body=Buna%20ziua%2C%0A%0AVreau%20sa...\">\n  Email cu template\n</a>\n\n<!-- Multiple destinatari: -->\n<a href=\"mailto:ion@ex.com,maria@ex.com?cc=manager@ex.com&bcc=arhiva@ex.com&subject=Intalnire\">\n  Invitatie sedinta\n</a>\n```\n\nPARAMETRI MAILTO:\n```\nmailto:adresa@email.com\n  ?subject=  Subiect email (URL encoded)\n  &body=     Corp email (URL encoded, \\n pentru newline = %0A)\n  &cc=       Carbon Copy\n  &bcc=      Blind Carbon Copy\n  &to=       Destinatar suplimentar\n```\n\nTEL: SCHEMA:\n```html\n<!-- Numar de telefon: -->\n<a href=\"tel:+40721234567\">Suna acum</a>\n\n<!-- Format recomandat E.164 (cu prefix tara): -->\n<a href=\"tel:+40-721-234-567\">\n  <img src=\"phone-icon.svg\" alt=\"Telefon\">\n  0721 234 567\n</a>\n\n<!-- Pe desktop: deschide aplicatia de telefon (Skype, FaceTime) -->\n<!-- Pe mobil: initiaza apel direct -->\n\n<!-- BEST PRACTICE: format vizibil user-friendly, href E.164: -->\n<a href=\"tel:+40721234567\" aria-label=\"Suna la 0721 234 567\">\n  0721 234 567\n</a>\n```\n\nURL ENCODING in href:\n```javascript\n// Cand generezi dinamic:\nconst name = 'Ion Popescu';\nconst subject = encodeURIComponent('Buna ziua, ' + name);\nconst body = encodeURIComponent('Vreau sa...');\nconst mailto = `mailto:contact@ex.com?subject=${subject}&body=${body}`;\ndocument.getElementById('email-link').href = mailto;\n```"
      },
      {
        "order": 2,
        "title": "sms: si FaceTime — scheme pentru comunicatie",
        "content": "SMS: SCHEMA:\n```html\n<!-- SMS pe mobil: -->\n<a href=\"sms:+40721234567\">Trimite SMS</a>\n\n<!-- SMS cu mesaj precompletat: -->\n<!-- iOS: sms:numar&body=mesaj -->\n<!-- Android: sms:numar?body=mesaj -->\n\n<!-- Cross-platform (ambele): -->\n<a href=\"sms:+40721234567?body=Vreau%20informatii%20despre%20produs\">SMS Info</a>\n\n<!-- Shortcode SMS (ex: servicii abonament): -->\n<a href=\"sms:1234\">Trimite SMS la 1234</a>\n\n<!-- Multiple destinatari (iOS): -->\n<a href=\"sms:+40721234567,+40722345678\">SMS grup</a>\n```\n\nFACETIME SI ALTE SCHEME:\n```html\n<!-- FaceTime (numai Apple): -->\n<a href=\"facetime:+40721234567\">FaceTime</a>\n<a href=\"facetime-audio:+40721234567\">FaceTime Audio</a>\n\n<!-- WhatsApp deep link: -->\n<a href=\"https://wa.me/40721234567\">WhatsApp</a>\n<a href=\"https://wa.me/40721234567?text=Buna%20ziua%21\">WhatsApp cu mesaj</a>\n\n<!-- Telegram: -->\n<a href=\"https://t.me/username\">Telegram</a>\n<a href=\"tg://resolve?domain=username\">Telegram App (direct)</a>\n\n<!-- Maps: -->\n<a href=\"https://maps.google.com/maps?q=Strada+Florilor+5,+Bucuresti\">\n  Deschide in Google Maps\n</a>\n<a href=\"geo:44.4268,26.1025?q=Firma+SRL\">Geo URI</a>\n```\n\nDETECTIE MOBILE PENTRU SCHEME:\n```html\n<!-- Afiseaza numai pe mobile: -->\n<a href=\"tel:+40721234567\"\n   class=\"mobile-only\"\n   aria-label=\"Suna la 0721 234 567\">\n  Suna acum\n</a>\n\n<style>\n  .mobile-only { display: none; }\n  @media (hover: none) and (pointer: coarse) {\n    .mobile-only { display: inline-block; }\n  }\n</style>```"
      },
      {
        "order": 3,
        "title": "App Deep Links si Universal Links",
        "content": "Deep Links trimit userii direct in aplicatia nativa la o sectiune specifica.\n\nDEEP LINK URI SCHEMES:\n```html\n<!-- Instagram: -->\n<a href=\"instagram://user?username=firma\">Deschide in Instagram</a>\n\n<!-- Twitter/X: -->\n<a href=\"twitter://user?screen_name=firma\">Twitter App</a>\n\n<!-- YouTube: -->\n<a href=\"youtube://watch?v=ID_VIDEO\">YouTube App</a>\n\n<!-- Spotify: -->\n<a href=\"spotify://track/TRACK_ID\">Deschide in Spotify</a>\n\n<!-- PROBLEMA: Daca app nu e instalata, link-ul esueaza -->\n<!-- SOLUTIE: Universal Links (iOS) / App Links (Android) -->\n```\n\nUNIVERSAL LINKS (iOS) / APP LINKS (Android):\n```html\n<!-- Daca app e instalata: deschide direct in app\n     Daca nu: deschide pagina web normala -->\n\n<!-- META TAG pentru Apple App Site Association: -->\n<!-- Serverul trebuie sa serveasca: -->\n<!-- GET /.well-known/apple-app-site-association -->\n<!-- GET /.well-known/assetlinks.json -->\n\n<!-- Exemplu: spotify.com/track/123 -->\n<!-- Cu App instalata: deschide Spotify direct la track -->\n<!-- Fara App: afiseaza pagina web track -->\n```\n\nREGISTRARE PROTOCOL HANDLER CUSTOM:\n```javascript\n// Inregistreaza schema custom web+firma:\n// NUMAI din user gesture, la HTTPS:\nnavigator.registerProtocolHandler(\n  'web+firma',             // schema (trebuie sa inceapa cu web+)\n  'https://firma.ro/handler?url=%s', // %s = URL-ul complet\n  'Firma App'\n);\n\n// Acum linkul:\n<a href=\"web+firma://comanda/12345\">Deschide comanda</a>\n// Va deschide: https://firma.ro/handler?url=web+firma://comanda/12345\n\n// Exemple scheme web+ utilizate:\n// web+matrix: (Matrix chat protocol)\n// web+mastodon: (Mastodon social)\n// web+bitwarden: (Bitwarden password manager)\n```\n\nINTENT URL (Android Chrome):\n```html\n<!-- Android intent cu fallback la Play Store: -->\n<a href=\"intent://scan/#Intent;\n          scheme=firma;\n          package=ro.firma.app;\n          S.browser_fallback_url=https://play.google.com/...;\n          end\">\n  Deschide in Firma App\n</a>```"
      },
      {
        "order": 4,
        "title": "data: URI si alte scheme speciale",
        "content": "DATA: URI:\n```html\n<!-- data: permite continut inline (base64 sau text) -->\n\n<!-- Imagine SVG inline: -->\n<img src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucy...\" alt=\"Icon\">\n\n<!-- Imagine PNG inline (generat din canvas): -->\n<script>\nconst canvas = document.getElementById('myCanvas');\nconst dataUrl = canvas.toDataURL('image/png');\nconst link = document.createElement('a');\nlink.download = 'screenshot.png';\nlink.href = dataUrl;\nlink.click(); // Descarca imaginea!\n</script>\n\n<!-- CSV download inline: -->\n<a href=\"data:text/csv;charset=utf-8,Nume%2CEmail%0AIon%2Cion%40ex.com\"\n   download=\"export.csv\">\n  Descarca CSV\n</a>\n\n<!-- Generare blob URL pentru download: -->\n<script>\nconst csvContent = 'Nume,Email\\nIon,ion@ex.com\\nMaria,maria@ex.com';\nconst blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });\nconst url = URL.createObjectURL(blob);\nconst a = document.createElement('a');\na.href = url;\na.download = 'export.csv';\na.click();\nURL.revokeObjectURL(url); // elibereaza memoria!\n</script>\n```\n\nJAVASCRIPT: SCHEMA (de evitat!):\n```html\n<!-- EVITA! -->\n<a href=\"javascript:void(0)\">Click</a>     <!-- anti-pattern vechi -->\n<a href=\"javascript:alert('xss')\">Test</a> <!-- vulnerabilitate XSS! -->\n\n<!-- CORECT: -->\n<button type=\"button\" onclick=\"handleClick()\">Click</button>\n<a href=\"#\" onclick=\"event.preventDefault(); handleClick();\">Click</a>\n```\n\nATRIBUTUL DOWNLOAD:\n```html\n<!-- Forteaza download in loc de navigare: -->\n<a href=\"/files/raport.pdf\" download>Descarca PDF</a>\n<!-- Sau cu nume de fisier: -->\n<a href=\"/files/raport.pdf\" download=\"Raport-Lunar-Ian-2025.pdf\">Descarca</a>\n<a href=\"/export?format=csv\" download=\"export.csv\">Export CSV</a>\n\n<!-- Functioneaza si cu blob URLs si data: -->\n```\n\nLA INTERVIU: Diferenta deep links vs universal links? Deep link (custom scheme: instagram://) esueaza daca app-ul nu e instalat. Universal Link (https://instagram.com/...) merge si in browser si in app — iOS/Android detecteaza app-ul instalat si il deschid direct."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "mailto params",
        "question": "Cum creezi un link mailto cu subiect 'Cerere oferta' si destinatar sales@firma.ro?",
        "options": [
          "<a href='email:sales@firma.ro?subject=Cerere oferta'>",
          "<a href='mailto:sales@firma.ro?subject=Cerere%20oferta'>",
          "<a href='mail:sales@firma.ro&subject=Cerere oferta'>",
          "<a mail='sales@firma.ro'>"
        ],
        "answer": "<a href='mailto:sales@firma.ro?subject=Cerere%20oferta'>",
        "explanation": "Schema mailto: cu query params. Spatiile = %20 (URL encoded). Parametri: subject, body, cc, bcc.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "tel format",
        "question": "Care este formatul recomandat pentru href de tip tel:?",
        "options": [
          "tel:0721234567",
          "tel:+40721234567 (format E.164 cu prefix de tara)",
          "tel:0040721234567",
          "tel:(0721) 234-567"
        ],
        "answer": "tel:+40721234567 (format E.164 cu prefix de tara)",
        "explanation": "E.164: + prefix tara + numar fara 0 initial. +40721234567. Textul vizibil poate fi formatat frumos: 0721 234 567.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "download attr",
        "question": "Ce face atributul `download` pe un link: `<a href='/file.pdf' download='Raport.pdf'>`?",
        "options": [
          "Deschide PDF in tab nou",
          "Forteaza download-ul fisierului cu numele specificat in loc de navigare la URL",
          "Comprima fisierul",
          "Face link disabled"
        ],
        "answer": "Forteaza download-ul fisierului cu numele specificat in loc de navigare la URL",
        "explanation": "Fara download: browser deschide PDF. Cu download: prompt de salvare cu numele 'Raport.pdf'. Merge si cu blob: si data: URLs.",
        "difficulty": "easy"
      },
      {
        "number": 4,
        "name": "deep link problem",
        "question": "Ce se intampla cand userul da click pe un deep link (instagram://) si app-ul nu e instalat?",
        "options": [
          "Se deschide browser-ul la instagram.com",
          "Linkul esueaza (eroare sau nimic nu se intampla)",
          "Se instaleaza automat",
          "Se deschide App Store"
        ],
        "answer": "Linkul esueaza (eroare sau nimic nu se intampla)",
        "explanation": "Custom scheme deep links nu au fallback automat. Solutia: Universal Links (iOS) sau App Links (Android) — HTTPS URL normal cu asociere la app.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "registerProtocolHandler",
        "question": "Ce conditii trebuie indeplinite pentru `navigator.registerProtocolHandler()`?",
        "options": [
          "Oricand pe orice site",
          "Pagina trebuie sa fie pe HTTPS, schema sa inceapa cu 'web+', apelat din user gesture",
          "Numai pe Chrome",
          "Numai pe desktop"
        ],
        "answer": "Pagina trebuie sa fie pe HTTPS, schema sa inceapa cu 'web+', apelat din user gesture",
        "explanation": "Schema web+ e namespace-ul pentru custom web protocols. HTTPS pentru securitate. User gesture previne spam.",
        "difficulty": "hard"
      },
      {
        "number": 6,
        "name": "data uri download",
        "question": "Cum generezi si descarci un fisier CSV dinamic din JavaScript?",
        "options": [
          "fetch('/download?format=csv')",
          "Blob + URL.createObjectURL() + click pe <a download>",
          "window.print('csv')",
          "XMLHttpRequest download"
        ],
        "answer": "Blob + URL.createObjectURL() + click pe <a download>",
        "explanation": "new Blob([content], {type:'text/csv'}) -> URL.createObjectURL(blob) -> <a href=url download='file.csv'>.click(). URL.revokeObjectURL() dupa.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "whatsapp link",
        "question": "Cum creezi un link care deschide WhatsApp cu mesaj precompletat?",
        "options": [
          "whatsapp://send?phone=40721234567",
          "https://wa.me/40721234567?text=Buna%20ziua",
          "sms:+40721234567?app=whatsapp",
          "wa://chat?number=40721234567"
        ],
        "answer": "https://wa.me/40721234567?text=Buna%20ziua",
        "explanation": "wa.me e Universal Link-ul oficial WhatsApp. Fara 0 sau +. 40721234567 (prefix RO fara +). ?text= URL encoded.",
        "difficulty": "easy"
      },
      {
        "number": 8,
        "name": "tel mobile only",
        "question": "Cum ascunzi link-ul tel: pe desktop si il afisezi numai pe mobile?",
        "options": [
          "display:none pe desktop",
          "@media (hover: none) and (pointer: coarse) { display: inline-block; } initial: display: none",
          "JavaScript user agent detection",
          "feature-detection API"
        ],
        "answer": "@media (hover: none) and (pointer: coarse) { display: inline-block; } initial: display: none",
        "explanation": "hover:none + pointer:coarse detecteaza touch devices. Mai fiabil decat user-agent. Pe desktop tel: deschide Skype etc., nu intotdeauna util.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "mailto body newline",
        "question": "Cum adaugi un enter (newline) in body-ul unui link mailto?",
        "options": [
          "%20",
          "%0A (URL encoding pentru \\n)",
          "\\n",
          "+"
        ],
        "answer": "%0A (URL encoding pentru \\n)",
        "explanation": "%0A = carriage return/newline in URL encoding. %0D%0A pentru CRLF (Windows). encodeURIComponent('\\n') = '%0A'.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "javascript scheme",
        "question": "De ce trebuie sa eviti `<a href='javascript:void(0)'>`?",
        "options": [
          "E prea lung",
          "Anti-pattern: blocheaza navigarea tastatura, confuzeaza screen readers, href semantic gresit. Foloseste button.",
          "E deprecat in HTML5",
          "Nu merge pe mobile"
        ],
        "answer": "Anti-pattern: blocheaza navigarea tastatura, confuzeaza screen readers, href semantic gresit. Foloseste button.",
        "explanation": "<a> = navigare. <button> = actiune. Daca nu navighezi, e <button type='button'>. href='javascript:' e si risc XSS.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "canvas download",
        "question": "Cum descarci continutul unui <canvas> ca fisier PNG?",
        "options": [
          "canvas.save('file.png')",
          "const url = canvas.toDataURL('image/png'); const a = document.createElement('a'); a.href=url; a.download='img.png'; a.click()",
          "canvas.export('png')",
          "URL.createObjectURL(canvas)"
        ],
        "answer": "const url = canvas.toDataURL('image/png'); const a = document.createElement('a'); a.href=url; a.download='img.png'; a.click()",
        "explanation": "toDataURL() returneaza data: URL cu continutul canvas. <a download> cu click programatic = descarca fisierul.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Mailto dinamic",
        "question": "Scrie JavaScript care genereaza un href mailto dinamic cu subiect si body din variabile.",
        "options": [],
        "answer": "",
        "explanation": "const mailtoHref = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "CSV Download Blob",
        "question": "Scrie codul care descarca un array de obiecte ca fisier CSV: [{name:'Ion', email:'ion@ex.com'}].",
        "options": [],
        "answer": "",
        "explanation": "const csv = 'Name,Email\\n' + data.map(r => r.name+','+r.email).join('\\n'); const blob = new Blob([csv], {type:'text/csv'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='users.csv'; a.click(); URL.revokeObjectURL(url);",
        "difficulty": "hard"
      },
      {
        "number": 14,
        "name": "sms cross platform",
        "question": "De ce folosesti `sms:numar?body=mesaj` si nu `sms:numar&body=mesaj` pentru maxima compatibilitate?",
        "options": [
          "Nu exista diferenta",
          "iOS foloseste & (sms:numar&body=), Android foloseste ? (sms:numar?body=). ? e mai compatibil cross-platform.",
          "? e mai nou",
          "& e deprecated"
        ],
        "answer": "iOS foloseste & (sms:numar&body=), Android foloseste ? (sms:numar?body=). ? e mai compatibil cross-platform.",
        "explanation": "Inconsistenta istorica. ? functioneaza pe Android. Pe iOS mai noi, ? e acceptat. Alternativa: https://wa.me pentru WhatsApp universal.",
        "difficulty": "hard"
      },
      {
        "number": 15,
        "name": "universal vs custom",
        "question": "Care este avantajul principal al Universal Links fata de custom scheme deep links?",
        "options": [
          "Universal links sunt mai rapide",
          "Functioneaza si fara app instalata (deschide web ca fallback) spre deosebire de custom scheme care esueaza",
          "Universal links sunt gratuite",
          "Custom scheme e deprecat"
        ],
        "answer": "Functioneaza si fara app instalata (deschide web ca fallback) spre deosebire de custom scheme care esueaza",
        "explanation": "Universal Link = URL normal HTTPS. iOS/Android intercepteaza daca app e instalata. Altfel: deschide in browser ca link normal. Perfect UX.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "html-mini-proiect-newsletter",
    "title": "35. Mini Proiect HTML — Newsletter Template Profesional",
    "order": 35,
    "theory": [
      {
        "order": 1,
        "title": "Planificarea si structura template-ului de newsletter",
        "content": "Vom construi un newsletter template profesional, complet: header, hero, feature sections, CTA, footer.\n\nSTRUCTURA NEWSLETTERULUI:\n```\nNEWSLETTER FIRMA TECH\n\n[HEADER] Logo + Navigatie simpla\n[HERO] Imagine banner + Titlu principal + Subtitlu + Buton CTA principal\n[FEATURES] 3 sectiuni cu iconita, titlu, text scurt\n[PROMO] Sectiune cu fond colorat + oferta speciala\n[FOOTER] Info firma + Social links + Dezabonare\n```\n\nSTRATEGIA DE DESIGN:\n```\nLtime: 600px (standard universal)\nFonts: Arial, Helvetica, sans-serif (web-safe, fara import)\nCulori:\n  Primary:     #1a56db (albastru)\n  Secondary:   #ff6b35 (portocaliu CTA)\n  Background:  #f3f4f6 (gri deschis)\n  Card bg:     #ffffff\n  Text main:   #111827\n  Text muted:  #6b7280\nSpacing:\n  Padding card: 32px 40px\n  Gap sections: 24px\n```\n\nFISIERE NECESARE:\n```\nnewsletter/\n  index.html          # Template-ul final\n  newsletter.html     # Versiune cu toate sectiunile\n  test-send.html      # Trimitere test (HTML form)\n```\n\nTOOLS WORKFLOW:\n```bash\n# Testare locala in browser\n# Inlining CSS cu tools:\nnpx juice newsletter.html newsletter-inlined.html\n# SAU\nnpm install -g premailer\npremailer newsletter.html > newsletter-inlined.html\n\n# Testing: litmus.com sau email on acid\n# Trimitere: SendGrid, Mailchimp, Amazon SES\n```"
      },
      {
        "order": 2,
        "title": "Header si Hero Section",
        "content": "HEADER NEWSLETTER:\n```html\n<!--[if mso]>\n<table role=\"presentation\" width=\"600\" align=\"center\"><tr><td>\n<![endif]-->\n\n<!-- WRAPPER -->\n<table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"\n  style=\"background-color:#f3f4f6; padding: 20px 0;\">\n<tr><td align=\"center\">\n\n<!-- CONTAINER 600px -->\n<table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\"\n  style=\"background:#ffffff; border-radius:8px; overflow:hidden;\n         box-shadow:0 1px 3px rgba(0,0,0,0.1);\">\n\n  <!-- PREHEADER (ascuns) -->\n  <tr><td>\n    <div style=\"display:none;max-height:0;overflow:hidden;\n                mso-hide:all;font-size:1px;color:#f3f4f6;\">\n      Noutati din lumea tech + oferta speciala aceasta saptamana!\n    </div>\n  </td></tr>\n\n  <!-- HEADER BAR -->\n  <tr>\n    <td style=\"background-color:#1a56db; padding:24px 40px;\">\n      <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n        <tr>\n          <td>\n            <img src=\"https://via.placeholder.com/120x40?text=FIRMA\"\n                 alt=\"Firma Tech\" width=\"120\" height=\"40\"\n                 style=\"display:block;\">\n          </td>\n          <td align=\"right\" style=\"font-family:Arial,sans-serif;\n                                   font-size:14px;color:#bfdbfe;\">\n            <a href=\"#\" style=\"color:#bfdbfe;text-decoration:none;\">Web</a> &nbsp;|\n            <a href=\"#\" style=\"color:#bfdbfe;text-decoration:none;\"> Blog</a>\n          </td>\n        </tr>\n      </table>\n    </td>\n  </tr>\n\n  <!-- HERO SECTION -->\n  <tr>\n    <td style=\"padding:0;\">\n      <img src=\"https://via.placeholder.com/600x280/1a56db/ffffff?text=Newsletter+Tech\"\n           alt=\"Newsletter Firma Tech\" width=\"600\" height=\"280\"\n           style=\"display:block;max-width:100%;\">\n    </td>\n  </tr>\n  <tr>\n    <td style=\"padding:40px; text-align:center;\">\n      <h1 style=\"margin:0 0 16px;font-family:Arial,sans-serif;\n                 font-size:28px;font-weight:bold;color:#111827;line-height:1.3;\">\n        Noutati Tech &mdash; Editia Ianuarie 2025\n      </h1>\n      <p style=\"margin:0 0 28px;font-family:Arial,sans-serif;\n                font-size:16px;line-height:1.6;color:#6b7280;\">\n        Cele mai importante stiri din tech, tutoriale si resurse selectionate\n        special pentru tine aceasta saptamana.\n      </p>\n      <!-- Buton CTA principal -->\n      <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin:0 auto;\">\n        <tr>\n          <td style=\"background-color:#ff6b35;border-radius:6px;\">\n            <a href=\"https://firma.ro/blog\"\n               style=\"display:inline-block;padding:16px 40px;\n                      font-family:Arial,sans-serif;font-size:16px;\n                      font-weight:bold;color:#ffffff;text-decoration:none;\n                      letter-spacing:0.5px;\">Citeste Articolele</a>\n          </td>\n        </tr>\n      </table>\n    </td>\n  </tr>\n```"
      },
      {
        "order": 3,
        "title": "Feature Sections si Sectiunea Promo",
        "content": "FEATURES SECTION (3 COLOANE):\n```html\n  <!-- DIVIDER -->\n  <tr>\n    <td style=\"padding:0 40px;\">\n      <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n        <tr><td style=\"border-top:1px solid #e5e7eb; padding:0;\"></td></tr>\n      </table>\n    </td>\n  </tr>\n\n  <!-- SECTION HEADER -->\n  <tr>\n    <td style=\"padding:32px 40px 8px; text-align:center;\">\n      <h2 style=\"margin:0;font-family:Arial,sans-serif;\n                 font-size:22px;font-weight:bold;color:#111827;\">\n        De citit aceasta saptamana\n      </h2>\n    </td>\n  </tr>\n\n  <!-- 3 ARTICOLE (3 coloane) -->\n  <tr>\n    <td style=\"padding:16px 40px 32px;\">\n      <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n        <tr>\n          <!-- Articol 1 -->\n          <td width=\"160\" valign=\"top\"\n              style=\"padding:0 8px 0 0; vertical-align:top;\">\n            <img src=\"https://via.placeholder.com/160x100/e0e7ff/3730a3?text=React\"\n                 alt=\"React Tutorial\" width=\"160\" height=\"100\"\n                 style=\"display:block;border-radius:4px;\">\n            <h3 style=\"margin:12px 0 6px;font-family:Arial,sans-serif;\n                       font-size:14px;font-weight:bold;color:#111827;\">\n              React 19 Features\n            </h3>\n            <p style=\"margin:0 0 10px;font-family:Arial,sans-serif;\n                      font-size:12px;color:#6b7280;line-height:1.5;\">\n              Tot ce e nou in React 19 explicat simplu.\n            </p>\n            <a href=\"#\" style=\"font-family:Arial,sans-serif;font-size:12px;\n                               color:#1a56db;text-decoration:none;\n                               font-weight:bold;\">Citeste &rarr;</a>\n          </td>\n          <!-- Articol 2 -->\n          <td width=\"160\" valign=\"top\"\n              style=\"padding:0 8px; vertical-align:top;\">\n            <img src=\"https://via.placeholder.com/160x100/dcfce7/166534?text=Node.js\"\n                 alt=\"Node.js\" width=\"160\" height=\"100\"\n                 style=\"display:block;border-radius:4px;\">\n            <h3 style=\"margin:12px 0 6px;font-family:Arial,sans-serif;\n                       font-size:14px;font-weight:bold;color:#111827;\">\n              Node.js 22 LTS\n            </h3>\n            <p style=\"margin:0 0 10px;font-family:Arial,sans-serif;\n                      font-size:12px;color:#6b7280;line-height:1.5;\">\n              Noul LTS cu performante imbunatatite.\n            </p>\n            <a href=\"#\" style=\"font-family:Arial,sans-serif;font-size:12px;\n                               color:#1a56db;text-decoration:none;\n                               font-weight:bold;\">Citeste &rarr;</a>\n          </td>\n          <!-- Articol 3 -->\n          <td width=\"160\" valign=\"top\"\n              style=\"padding:0 0 0 8px; vertical-align:top;\">\n            <img src=\"https://via.placeholder.com/160x100/fef3c7/92400e?text=AI\"\n                 alt=\"AI Tools\" width=\"160\" height=\"100\"\n                 style=\"display:block;border-radius:4px;\">\n            <h3 style=\"margin:12px 0 6px;font-family:Arial,sans-serif;\n                       font-size:14px;font-weight:bold;color:#111827;\">\n              AI Tools 2025\n            </h3>\n            <p style=\"margin:0 0 10px;font-family:Arial,sans-serif;\n                      font-size:12px;color:#6b7280;line-height:1.5;\">\n              Top 10 tool-uri AI pentru developeri.\n            </p>\n            <a href=\"#\" style=\"font-family:Arial,sans-serif;font-size:12px;\n                               color:#1a56db;text-decoration:none;\n                               font-weight:bold;\">Citeste &rarr;</a>\n          </td>\n        </tr>\n      </table>\n    </td>\n  </tr>\n\n  <!-- PROMO BANNER (fundal colorat) -->\n  <tr>\n    <td style=\"background-color:#fef3c7;padding:32px 40px;text-align:center;\">\n      <p style=\"margin:0 0 4px;font-family:Arial,sans-serif;\n                font-size:12px;font-weight:bold;color:#92400e;\n                text-transform:uppercase;letter-spacing:1px;\">\n        Oferta speciala\n      </p>\n      <h2 style=\"margin:0 0 12px;font-family:Arial,sans-serif;\n                 font-size:24px;font-weight:bold;color:#78350f;\">\n        30% reducere la cursul nostru de JavaScript!\n      </h2>\n      <p style=\"margin:0 0 20px;font-family:Arial,sans-serif;\n                font-size:14px;color:#92400e;\">Valabil pana duminica 23:59.</p>\n      <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin:0 auto;\">\n        <tr><td style=\"background-color:#f59e0b;border-radius:6px;\">\n          <a href=\"#\" style=\"display:inline-block;padding:12px 28px;\n                             font-family:Arial,sans-serif;font-size:14px;\n                             font-weight:bold;color:#ffffff;text-decoration:none;\">Vreau reducerea!</a>\n        </td></tr>\n      </table>\n    </td>\n  </tr>\n```"
      },
      {
        "order": 4,
        "title": "Footer si considerente finale",
        "content": "FOOTER COMPLET:\n```html\n  <!-- FOOTER -->\n  <tr>\n    <td style=\"background-color:#f9fafb;border-top:1px solid #e5e7eb;\n               padding:32px 40px;\">\n      <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n        \n        <!-- Social links -->\n        <tr>\n          <td align=\"center\" style=\"padding-bottom:20px;\">\n            <a href=\"https://twitter.com/firma\"\n               style=\"display:inline-block;margin:0 6px;\">\n              <img src=\"https://via.placeholder.com/32x32/1a56db/ffffff?text=TW\"\n                   alt=\"Twitter\" width=\"32\" height=\"32\"\n                   style=\"border-radius:50%;\">\n            </a>\n            <a href=\"https://linkedin.com/company/firma\"\n               style=\"display:inline-block;margin:0 6px;\">\n              <img src=\"https://via.placeholder.com/32x32/1a56db/ffffff?text=LI\"\n                   alt=\"LinkedIn\" width=\"32\" height=\"32\"\n                   style=\"border-radius:50%;\">\n            </a>\n            <a href=\"https://github.com/firma\"\n               style=\"display:inline-block;margin:0 6px;\">\n              <img src=\"https://via.placeholder.com/32x32/1a56db/ffffff?text=GH\"\n                   alt=\"GitHub\" width=\"32\" height=\"32\"\n                   style=\"border-radius:50%;\">\n            </a>\n          </td>\n        </tr>\n        \n        <!-- Info firma -->\n        <tr>\n          <td style=\"text-align:center;\">\n            <p style=\"margin:0 0 8px;font-family:Arial,sans-serif;\n                      font-size:14px;font-weight:bold;color:#374151;\">\n              Firma Tech SRL\n            </p>\n            <p style=\"margin:0 0 16px;font-family:Arial,sans-serif;\n                      font-size:12px;color:#9ca3af;line-height:1.5;\">\n              Strada Florilor 5, Sector 1, Bucuresti 010101<br>\n              Tel: <a href=\"tel:+40212345678\"\n                      style=\"color:#9ca3af;text-decoration:none;\">0212 345 678</a>\n            </p>\n            <!-- Dezabonare OBLIGATORIE (GDPR!) -->\n            <p style=\"margin:0;font-family:Arial,sans-serif;font-size:11px;color:#9ca3af;\">\n              Primesti acest email deoarece esti abonat la newsletter-ul nostru.<br>\n              <a href=\"https://firma.ro/unsubscribe?token={{UNSUBSCRIBE_TOKEN}}\"\n                 style=\"color:#9ca3af;text-decoration:underline;\">Dezaboneaza-te</a> &nbsp;|&nbsp;\n              <a href=\"https://firma.ro/preferinte-email\"\n                 style=\"color:#9ca3af;text-decoration:underline;\">Preferinte email</a>\n            </p>\n          </td>\n        </tr>\n        \n      </table>\n    </td>\n  </tr>\n\n</table>\n<!-- END CONTAINER 600px -->\n\n</td></tr></table>\n<!-- END WRAPPER -->\n\n<!--[if mso]></td></tr></table><![endif]-->\n```\n\nCHECKLIST FINAL NEWSLETTER:\n```\n[x] charset UTF-8 in <head>\n[x] viewport meta tag\n[x] Preheader text\n[x] border=0 cellpadding=0 cellspacing=0 pe toate table-urile\n[x] width atribut HTML pe table-urile principale\n[x] Toate imaginile: src absolut, alt, width, height, display:block\n[x] CSS inline pe toate elementele importante\n[x] Buton CTA cu table wrapper\n[x] Alt text pe imaginile cu continut\n[x] Link dezabonare in footer\n[x] MSO conditional comments pentru Outlook\n[x] Testat in Gmail, Outlook, Apple Mail\n[x] Spam score verificat (mail-tester.com)\n```\n\nLA INTERVIU: Cum optimizezi un newsletter pentru rate de deschidere mare? 1. Subject line < 50 caractere, specific. 2. Preheader text relevant. 3. Send time: marti-joi 10-11am. 4. Personalizare (Buna, Ion!). 5. Mobile-first design. 6. Rata trimitere consistenta (nu spam masiv rar)."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "preheader obligatoriu",
        "question": "De ce adaugi preheader text in newsletter chiar daca e ascuns vizual cu display:none?",
        "options": [
          "Nu e necesar",
          "E vizibil in inbox ca text dupa subject line — creste rata de deschidere cu 30-40%",
          "E metadata SEO",
          "E cerinta GDPR"
        ],
        "answer": "E vizibil in inbox ca text dupa subject line — creste rata de deschidere cu 30-40%",
        "explanation": "Gmail, Outlook, Apple Mail afiseaza: 'Subject - preheader...' in lista de emailuri. Bun preheader = mai multi deschid.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "role presentation",
        "question": "De ce adaugi `role='presentation'` pe table-urile de layout in email?",
        "options": [
          "Decorativ",
          "Spune screen reader-elor ca table-ul e pentru layout, nu date tabulare — imbunatateste accesibilitatea",
          "Sare CSS",
          "Outlook specific"
        ],
        "answer": "Spune screen reader-elor ca table-ul e pentru layout, nu date tabulare — imbunatateste accesibilitatea",
        "explanation": "Screen reader-ele anunta 'table cu N coloane si M randuri' pentru tabele de date. role=presentation = 'ignora structura table, citeste continut'.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "absolute urls email",
        "question": "De ce toate URL-urile de imagini in email trebuie sa fie absolute (https://domain.com/img.jpg)?",
        "options": [
          "Nu exista diferenta",
          "Emailul e redat de clientul de email, nu de serverul tau — caile relative nu au context si imaginile nu se incarca",
          "SEO email",
          "Viteza de incarcare"
        ],
        "answer": "Emailul e redat de clientul de email, nu de serverul tau — caile relative nu au context si imaginile nu se incarca",
        "explanation": "src='/images/banner.jpg' = relativ la URL curent. In email reader, URL curent e undefined. Trebuie https://firma.ro/images/banner.jpg.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "cta table wrapper",
        "question": "De ce pui butonul CTA (link stilizat) intr-un table in email?",
        "options": [
          "Design mai bun",
          "Outlook nu suporta border-radius si display:inline-block pe <a> — table wrapper garanteaza butoane corecte cross-client",
          "Animatii",
          "Tracking clicks"
        ],
        "answer": "Outlook nu suporta border-radius si display:inline-block pe <a> — table wrapper garanteaza butoane corecte cross-client",
        "explanation": "Fara table: butonul arata bine in Gmail dar prost in Outlook. Cu table + td cu background-color: functioneaza peste tot.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "unsubscribe token",
        "question": "Ce este `{{UNSUBSCRIBE_TOKEN}}` in link-ul de dezabonare al newsletterului?",
        "options": [
          "Un placeholder HTML",
          "Token unic per abonat generat de ESP (SendGrid, Mailchimp) — identifica subscriberul la dezabonare",
          "Variable JavaScript",
          "Cookie"
        ],
        "answer": "Token unic per abonat generat de ESP (SendGrid, Mailchimp) — identifica subscriberul la dezabonare",
        "explanation": "ESP-urile inlocuiesc {{UNSUBSCRIBE_TOKEN}} cu un token unic per destinatar. Click pe link = dezabonare fara autentificare necesara.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "mobile newsletter",
        "question": "Cum faci newsletterul sa fie full-width pe mobile (< 600px)?",
        "options": [
          "width: 100% pe CSS",
          ".email-container { width: 100% !important; } in @media only screen and (max-width: 600px)",
          "responsive table",
          "viewport meta"
        ],
        "answer": ".email-container { width: 100% !important; } in @media only screen and (max-width: 600px)",
        "explanation": "!important necesar pentru a suprascrie width-ul inline (style='width:600px'). email-container e clasa pe table-ul principal de 600px.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "entity html email",
        "question": "De ce folosesti `&mdash;` si `&rarr;` in loc de caracterele — si -> in email HTML?",
        "options": [
          "E mai rapid",
          "Unii clienti de email au probleme cu charset-uri — HTML entities sunt sigure indiferent de encoding",
          "E conventional",
          "SEO beneficiu"
        ],
        "answer": "Unii clienti de email au probleme cu charset-uri — HTML entities sunt sigure indiferent de encoding",
        "explanation": "&mdash; (—), &rarr; (->), &copy; (&copy;) sunt intotdeauna corecte. Caracterele Unicode pot aparea ca ??? in clientii vechi.",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "vertical-align top",
        "question": "De ce adaugi `vertical-align:top` pe td-urile din layout-ul cu coloane?",
        "options": [
          "Design",
          "Implicit: middle. Daca coloanele au inaltimi diferite, continutul se centreaza vertical. Top = aliniere la varf",
          "Outlook fix",
          "Nu e necesar"
        ],
        "answer": "Implicit: middle. Daca coloanele au inaltimi diferite, continutul se centreaza vertical. Top = aliniere la varf",
        "explanation": "3 coloane de articole: unul cu titlu scurt, altul cu titlu lung. Fara valign=top, apar la inaltimi diferite in coloane.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "send time",
        "question": "Care este cel mai bun moment pentru trimiterea unui newsletter B2B conform studiilor?",
        "options": [
          "Weekend dimineata",
          "Marti-Joi intre 10:00-11:00 sau 14:00-15:00 — maxim activitate profesionala",
          "Luni 7:00",
          "Vineri 17:00"
        ],
        "answer": "Marti-Joi intre 10:00-11:00 sau 14:00-15:00 — maxim activitate profesionala",
        "explanation": "Luni: inbox plin dupa weekend. Vineri: weekend mood. Weekend: nimeni la serviciu pentru B2B. Marti-Joi = engagement maxim.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "juice inlining",
        "question": "Ce face instrumentul `juice` in contextul email development?",
        "options": [
          "Comprima imaginile",
          "Converteste CSS din <style> in inline style pe fiecare element — automatizeaza inlining-ul necesar pentru email",
          "Valideaza HTML",
          "Trimite emailuri"
        ],
        "answer": "Converteste CSS din <style> in inline style pe fiecare element — automatizeaza inlining-ul necesar pentru email",
        "explanation": "juice newsletter.html = ia CSS din <style> si il muta pe elementele HTML. Scrii CSS normal, juice face inlining automat.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "spam trigger words",
        "question": "Care cuvinte in subject line cresc sansele ca emailul sa ajunga in spam?",
        "options": [
          "Newsletter, Update",
          "GRATIS!!!, Castigator, $$$, Oferta exclusiva URGENTA, Click ACUM",
          "Firma, Produs, Articol",
          "Salut, Buna, Bun venit"
        ],
        "answer": "GRATIS!!!, Castigator, $$$, Oferta exclusiva URGENTA, Click ACUM",
        "explanation": "Spam filters detecteaza: ALL CAPS, multe semne de exclamare, cuvinte spam ('gratuit', 'castigat', 'urgent'). Fii natural si specific.",
        "difficulty": "easy"
      },
      {
        "number": 12,
        "name": "Header Newsletter",
        "question": "Scrie HTML pentru un header de newsletter cu fundal albastru #1a56db, logo (img 150x40) aliniat stanga si link 'Viziteaza site-ul' aliniat dreapta.",
        "options": [],
        "answer": "",
        "explanation": "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td><img src='logo.png' alt='Logo' width='150' height='40' style='display:block;'></td><td align='right'><a href='#' style='color:#bfdbfe;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;'>Viziteaza site-ul</a></td></tr></table>",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Buton CTA table",
        "question": "Scrie un buton CTA complet pentru email: text 'Incepe acum', fundal #ff6b35, border-radius 6px, padding 16px 40px, font alb bold.",
        "options": [],
        "answer": "",
        "explanation": "<table border='0' cellpadding='0' cellspacing='0' style='margin:0 auto;'><tr><td style='background-color:#ff6b35;border-radius:6px;'><a href='#' style='display:inline-block;padding:16px 40px;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;'>Incepe acum</a></td></tr></table>",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "Footer GDPR",
        "question": "Scrie footer-ul unui newsletter cu: adresa firmei, link dezabonare si link preferinte email, text centrat, font 12px gri.",
        "options": [],
        "answer": "",
        "explanation": "<p style='margin:0 0 8px;font-family:Arial;font-size:12px;color:#9ca3af;'>Firma SRL, Str. Florilor 5, Bucuresti</p><p style='margin:0;font-family:Arial;font-size:11px;color:#9ca3af;'><a href='#unsubscribe' style='color:#9ca3af;'>Dezaboneaza-te</a> | <a href='#preferences' style='color:#9ca3af;'>Preferinte</a></p>",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "newsletter review",
        "question": "Inainte de trimiterea unui newsletter la 10.000 abonati, care sunt cele 3 verificari critice?",
        "options": [
          "Gramatura, culori, fonturi",
          "Spam score (mail-tester.com), testare in Gmail+Outlook+Apple Mail, link dezabonare functional",
          "Numar imagini, lungime subiect, ora trimitere",
          "HTML valid, CSS valid, JS functional"
        ],
        "answer": "Spam score (mail-tester.com), testare in Gmail+Outlook+Apple Mail, link dezabonare functional",
        "explanation": "Spam score ridicat = inbox rate scazut. Randare gresita in Outlook (40% market share) = design rupt. Dezabonare nefunctionala = incalcare GDPR.",
        "difficulty": "hard"
      }
    ]
  }
];

module.exports = { htmlExtra3 };
