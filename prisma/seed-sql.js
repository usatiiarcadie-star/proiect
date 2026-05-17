const sqlLessons = [
  {
    "slug": "sql-introducere-select",
    "title": "1. Introducere SQL + SELECT de bază",
    "order": 1,
    "theory": [
      {
        "order": 1,
        "title": "Ce este SQL și unde îl folosești în viața reală",
        "content": "SQL (Structured Query Language) este limbajul cu care vorbești cu bazele de date relaționale. E ca o limbă universală — dacă știi SQL, poți lucra cu MySQL, PostgreSQL, SQLite, SQL Server și Oracle fără să schimbi aproape nimic.\n\nGândește-ți aplicația ca un restaurant:\n- Baza de date = depozitul cu ingrediente și rețete\n- Tabelele = rafturile (clienți, comenzi, produse)\n- SQL = comenzile pe care le dai ospătarului\n\nUNDE E FOLOSIT SQL:\n```\nMySQL       → WordPress, Laravel, e-commerce\nPostgreSQL  → startup-uri moderne, date complexe\nSQLite      → aplicații mobile, browser-e\nSQL Server  → ecosistem Microsoft, .NET\nOracle      → banking, corporații mari\n```\n\nPrimul tău query:\n```sql\nSELECT * FROM utilizatori;\n-- * = toate coloanele, fara WHERE = toate randurile\n```"
      },
      {
        "order": 2,
        "title": "Structura unei tabele și SELECT fundament",
        "content": "O tabelă e ca un Excel: coloane + rânduri. Fiecare rând are un ID unic (Primary Key).\n\nTabela produse:\n```\nid | nume            | pret | categorie   | stoc\n1  | Laptop Dell     | 3500 | electronics | 15\n2  | Mouse Logitech  |  120 | electronics | 50\n3  | Birou IKEA      |  800 | furniture   |  8\n4  | Scaun Gaming    | 1200 | furniture   |  3\n5  | Monitor 27inch  | 1800 | electronics | 12\n```\n\nSELECT — alege ce vrei să vezi:\n```sql\n-- Toate coloanele (evita in productie):\nSELECT * FROM produse;\n\n-- Coloane specifice (recomandat):\nSELECT id, nume, pret FROM produse;\n\n-- Alias — redenumesti coloana in rezultat:\nSELECT id, nume AS produs, pret AS cost_ron FROM produse;\n\n-- Calcule in SELECT:\nSELECT nume, pret, pret * 1.19 AS pret_cu_tva FROM produse;\n```"
      },
      {
        "order": 3,
        "title": "WHERE — filtrezi datele",
        "content": "WHERE e filtrul tau — lasi sa treaca doar randurile care respecta conditia.\n\n```sql\n-- Conditie simpla:\nSELECT * FROM produse WHERE pret > 500;\nSELECT * FROM produse WHERE categorie = 'electronics';\n\n-- Combinare conditii:\nSELECT * FROM produse\nWHERE categorie = 'electronics' AND pret < 200;\n\nSELECT * FROM produse\nWHERE stoc = 0 OR pret > 3000;\n\n-- BETWEEN (include capetele):\nSELECT * FROM produse WHERE pret BETWEEN 100 AND 1000;\n\n-- IN — lista de valori:\nSELECT * FROM produse WHERE categorie IN ('electronics', 'furniture');\n\n-- LIKE — pattern matching:\nSELECT * FROM produse WHERE nume LIKE '%gaming%'; -- contine gaming\nSELECT * FROM produse WHERE nume LIKE 'L%';       -- incepe cu L\n\n-- NULL:\nSELECT * FROM produse WHERE descriere IS NULL;\n-- GREȘIT: WHERE descriere = NULL (nu returneaza nimic!)\n```"
      },
      {
        "order": 4,
        "title": "ORDER BY, LIMIT, DISTINCT",
        "content": "ORDER BY sorteaza rezultatele. LIMIT limiteaza cate randuri iei. DISTINCT elimina duplicatele.\n\n```sql\n-- Sortare descrescatoare:\nSELECT * FROM produse ORDER BY pret DESC;\n\n-- Sortare pe mai multe coloane:\nSELECT * FROM produse ORDER BY categorie ASC, pret DESC;\n\n-- Top 3 cele mai scumpe:\nSELECT * FROM produse ORDER BY pret DESC LIMIT 3;\n\n-- Paginare (pagina 3, 10 produse pe pagina):\nSELECT * FROM produse ORDER BY id LIMIT 10 OFFSET 20;\n-- Formula: OFFSET = (pagina - 1) * produse_per_pagina\n\n-- Valori unice:\nSELECT DISTINCT categorie FROM produse;\n-- Returneaza: electronics, furniture (fara repetare)\n```\n\nLA INTERVIU: MySQL/PostgreSQL folosesc LIMIT. SQL Server foloseste TOP 10. Oracle foloseste FETCH FIRST 10 ROWS ONLY."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Primul SELECT",
        "question": "Ce afișează `SELECT * FROM produse;`?",
        "options": [
          "Toate coloanele și toate rândurile din tabela produse",
          "Doar prima coloană din tabela produse",
          "Un singur rând din tabela produse",
          "Returnează eroare dacă tabela e goală"
        ],
        "answer": "Toate coloanele și toate rândurile din tabela produse",
        "explanation": "* înseamnă toate coloanele, iar fără WHERE iei toate rândurile.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "Coloane specifice",
        "question": "Cum selectezi doar coloanele `id` și `nume` din tabela `produse`?",
        "options": [
          "SELECT id, nume FROM produse;",
          "SELECT produse(id, nume);",
          "GET id, nume FROM produse;",
          "SELECT id AND nume FROM produse;"
        ],
        "answer": "SELECT id, nume FROM produse;",
        "explanation": "Listezi coloanele separate prin virgulă după SELECT.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "Alias coloană",
        "question": "Ce face `SELECT pret AS cost FROM produse`?",
        "options": [
          "Redenumește coloana pret în cost în rezultat",
          "Creează o nouă coloană numită cost",
          "Modifică numele coloanei în baza de date",
          "Copiază coloana pret în cost"
        ],
        "answer": "Redenumește coloana pret în cost în rezultat",
        "explanation": "AS redenumește coloana doar în rezultatul afișat, nu în baza de date.",
        "difficulty": "easy"
      },
      {
        "number": 4,
        "name": "Filtrare numerică",
        "question": "Cum selectezi produsele cu prețul mai mare de 1000?",
        "options": [
          "SELECT * FROM produse WHERE pret > 1000;",
          "SELECT * FROM produse IF pret > 1000;",
          "SELECT * FROM produse HAVING pret > 1000;",
          "SELECT * FROM produse FILTER pret > 1000;"
        ],
        "answer": "SELECT * FROM produse WHERE pret > 1000;",
        "explanation": "WHERE filtrează rândurile. HAVING se folosește cu GROUP BY.",
        "difficulty": "easy"
      },
      {
        "number": 5,
        "name": "Filtrare text",
        "question": "Care query găsește produsele din categoria 'electronics'?",
        "options": [
          "SELECT * FROM produse WHERE categorie = 'electronics';",
          "SELECT * FROM produse WHERE categorie == 'electronics';",
          "SELECT * FROM produse WHERE categorie EQUALS 'electronics';",
          "SELECT * FROM produse WHERE categorie IS 'electronics';"
        ],
        "answer": "SELECT * FROM produse WHERE categorie = 'electronics';",
        "explanation": "În SQL folosești = (egal simplu) pentru comparare, nu ==.",
        "difficulty": "easy"
      },
      {
        "number": 6,
        "name": "AND operator",
        "question": "Care query găsește produsele din 'electronics' cu prețul sub 200?",
        "options": [
          "SELECT * FROM produse WHERE categorie = 'electronics' AND pret < 200;",
          "SELECT * FROM produse WHERE categorie = 'electronics' OR pret < 200;",
          "SELECT * FROM produse WHERE categorie = 'electronics' THEN pret < 200;",
          "SELECT * FROM produse WHERE (categorie = 'electronics') + (pret < 200);"
        ],
        "answer": "SELECT * FROM produse WHERE categorie = 'electronics' AND pret < 200;",
        "explanation": "AND cere ca ambele condiții să fie adevărate simultan.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "LIKE pattern",
        "question": "Care query găsește produsele al căror nume conține 'gaming'?",
        "options": [
          "SELECT * FROM produse WHERE nume LIKE '%gaming%';",
          "SELECT * FROM produse WHERE nume CONTAINS 'gaming';",
          "SELECT * FROM produse WHERE nume = '*gaming*';",
          "SELECT * FROM produse WHERE nume LIKE 'gaming';"
        ],
        "answer": "SELECT * FROM produse WHERE nume LIKE '%gaming%';",
        "explanation": "% e wildcard pentru orice număr de caractere. '%gaming%' înseamnă orice text care conține gaming.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "NULL check",
        "question": "Cum găsești produsele fără descriere (NULL)?",
        "options": [
          "SELECT * FROM produse WHERE descriere IS NULL;",
          "SELECT * FROM produse WHERE descriere = NULL;",
          "SELECT * FROM produse WHERE descriere == NULL;",
          "SELECT * FROM produse WHERE ISNULL(descriere);"
        ],
        "answer": "SELECT * FROM produse WHERE descriere IS NULL;",
        "explanation": "NULL nu se poate compara cu =. Trebuie IS NULL sau IS NOT NULL.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "ORDER BY DESC",
        "question": "Cum sortezi produsele de la cel mai scump la cel mai ieftin?",
        "options": [
          "SELECT * FROM produse ORDER BY pret DESC;",
          "SELECT * FROM produse ORDER BY pret ASC;",
          "SELECT * FROM produse SORT BY pret DESC;",
          "SELECT * FROM produse ORDER pret DESC;"
        ],
        "answer": "SELECT * FROM produse ORDER BY pret DESC;",
        "explanation": "DESC = descrescător (de la mare la mic). ASC = crescător (implicit).",
        "difficulty": "easy"
      },
      {
        "number": 10,
        "name": "LIMIT paginare",
        "question": "Ce face `LIMIT 10 OFFSET 20`?",
        "options": [
          "Sare primele 20 de rânduri și returnează următoarele 10",
          "Returnează primele 10 rânduri și ultimele 20",
          "Returnează rândurile de la 10 la 20",
          "Limitează la 20 și sare 10"
        ],
        "answer": "Sare primele 20 de rânduri și returnează următoarele 10",
        "explanation": "OFFSET sare primele N rânduri. LIMIT ia maxim N rânduri. Util pentru paginare.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "DISTINCT",
        "question": "Ce returnează `SELECT DISTINCT categorie FROM produse`?",
        "options": [
          "Lista unică de categorii, fără duplicate",
          "Toate rândurile cu categoria lor",
          "Numărul de categorii distincte",
          "Produsele cu categorie unică"
        ],
        "answer": "Lista unică de categorii, fără duplicate",
        "explanation": "DISTINCT elimină duplicatele din rezultat.",
        "difficulty": "easy"
      },
      {
        "number": 12,
        "name": "BETWEEN",
        "question": "Ce face `WHERE pret BETWEEN 100 AND 500`?",
        "options": [
          "Returnează produse cu pret >= 100 AND pret <= 500",
          "Returnează produse cu pret > 100 AND pret < 500",
          "Returnează produse cu pret = 100 sau pret = 500",
          "Returnează produse cu pret intre 100 si 500 exclusiv"
        ],
        "answer": "Returnează produse cu pret >= 100 AND pret <= 500",
        "explanation": "BETWEEN include capetele (100 și 500 sunt incluse).",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "IN operator",
        "question": "Ce face `WHERE id IN (1, 3, 5)`?",
        "options": [
          "Returnează rândurile cu id egal cu 1, 3 sau 5",
          "Returnează rândurile cu id diferit de 1, 3 și 5",
          "Returnează primele 3 rânduri",
          "Returnează rândul cu id suma 9"
        ],
        "answer": "Returnează rândurile cu id egal cu 1, 3 sau 5",
        "explanation": "IN verifică dacă valoarea se află în lista dată. Echivalent cu id=1 OR id=3 OR id=5.",
        "difficulty": "easy"
      },
      {
        "number": 14,
        "name": "Calcul în SELECT",
        "question": "Ce returnează `SELECT pret * 1.19 AS pret_tva FROM produse`?",
        "options": [
          "Prețul fiecărui produs cu TVA de 19% adăugat",
          "Prețul fiecărui produs împărțit la 1.19",
          "Eroare — nu poți face calcule în SELECT",
          "Prețul original, alias-ul nu face calcule"
        ],
        "answer": "Prețul fiecărui produs cu TVA de 19% adăugat",
        "explanation": "Poți face orice calcul aritmetic direct în SELECT. Rezultatul apare sub denumirea alias-ului.",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Proiect: catalog produse",
        "question": "Query-ul care afișează numele și prețul cu TVA al produselor din 'electronics', sortate de la ieftin la scump, primele 5:",
        "options": [
          "SELECT nume, pret*1.19 AS pret_tva FROM produse WHERE categorie='electronics' ORDER BY pret ASC LIMIT 5;",
          "SELECT * FROM produse WHERE categorie='electronics' ORDER BY pret LIMIT 5;",
          "SELECT nume, pret FROM produse LIMIT 5 WHERE categorie='electronics';",
          "SELECT TOP 5 nume, pret*1.19 FROM produse WHERE categorie='electronics' ORDER BY pret;"
        ],
        "answer": "SELECT nume, pret*1.19 AS pret_tva FROM produse WHERE categorie='electronics' ORDER BY pret ASC LIMIT 5;",
        "explanation": "Ordinea corectă: SELECT → FROM → WHERE → ORDER BY → LIMIT. TOP este SQL Server, LIMIT este MySQL/PostgreSQL.",
        "difficulty": "hard"
      }
    ]
  },
  {
    "slug": "sql-where-avansat",
    "title": "2. WHERE avansat — filtrare complexă",
    "order": 2,
    "theory": [
      {
        "order": 1,
        "title": "Operatori logici și precedența lor",
        "content": "AND, OR, NOT se combina la fel ca in matematica — AND are prioritate mai mare ca OR.\n\n```sql\n-- Operatori de comparare:\n-- =  egal       <> sau != diferit\n-- <  mai mic    >  mai mare\n-- <= mai mic sau egal    >= mai mare sau egal\n\n-- NOT inverseza orice conditie:\nSELECT * FROM produse WHERE NOT categorie = 'furniture';\nSELECT * FROM produse WHERE id NOT IN (1, 2, 3);\n\n-- PRIORITATEA: NOT > AND > OR\n-- ATENTIE: A OR B AND C = A OR (B AND C)\n-- Cu paranteze: (A OR B) AND C — diferit!\n\nSELECT * FROM produse\nWHERE (categorie = 'electronics' OR categorie = 'furniture')\n  AND pret > 500;\n-- Toate produsele din ambele categorii, dar doar cele scumpe\n\n-- Fara paranteze ar fi:\nWHERE categorie = 'electronics' OR (categorie = 'furniture' AND pret > 500)\n-- Electronics toate + doar furniture scumpe\n```\n\nFoloseste INTOTDEAUNA paranteze cand combini AND cu OR!"
      },
      {
        "order": 2,
        "title": "LIKE avansat și pattern matching",
        "content": "LIKE e util pentru bara de search de pe orice site.\n\n```sql\n-- Wildcards:\n-- %  = orice numar de caractere (inclusiv 0)\n-- _  = exact un singur caracter\n\nSELECT * FROM produse WHERE nume LIKE 'L%';        -- incepe cu L\nSELECT * FROM produse WHERE nume LIKE '%ing';       -- se termina in ing\nSELECT * FROM produse WHERE cod LIKE 'AB__';        -- AB + exact 2 caractere\n\n-- Case sensitivity:\n-- MySQL: LIKE e case-insensitive implicit\n-- PostgreSQL: LIKE e case-sensitive, folosesti ILIKE\n\n-- Bara de cautare dintr-o aplicatie:\nSELECT id, nume, pret\nFROM produse\nWHERE nume LIKE CONCAT('%', :searchTerm, '%')\nORDER BY nume LIMIT 20;\n```\n\nATENTIE: LIKE cu % la inceput ('%smith') nu foloseste indexul — full table scan pe date mari. Pentru search serios se foloseste Full Text Search."
      },
      {
        "order": 3,
        "title": "NULL — capcanele care strica query-urile",
        "content": "NULL inseamna valoare necunoscuta. Se comporta ciudat fata de orice alt limbaj.\n\nREGULI:\n- NULL nu e egal cu nimic (nici cu 0, nici cu string gol, nici cu NULL)\n- Orice comparatie cu NULL returneaza NULL (nu true, nu false)\n\n```sql\n-- CORECT:\nSELECT * FROM produse WHERE descriere IS NULL;\nSELECT * FROM produse WHERE descriere IS NOT NULL;\n\n-- GRESIT (nu returneaza nimic):\nSELECT * FROM produse WHERE descriere = NULL;\n\n-- COALESCE — returneaza prima valoare non-NULL:\nSELECT nume, COALESCE(reducere, 0) AS reducere\nFROM produse;\n-- Daca reducere e NULL, afiseaza 0\n\n-- NULLIF — returneaza NULL daca doua valori sunt egale:\nSELECT vanzari / NULLIF(vizitatori, 0) AS rata_conversie\nFROM statistici;\n-- Evita impartirea la zero (NULLIF(0,0) = NULL, nu eroare)\n```"
      },
      {
        "order": 4,
        "title": "Subquery-uri simple în WHERE",
        "content": "Un subquery e un SELECT in interiorul altui SELECT. Util cand nu stii exact valorile de filtrat.\n\n```sql\n-- Produse mai scumpe decat media:\nSELECT * FROM produse\nWHERE pret > (SELECT AVG(pret) FROM produse);\n\n-- Produse comandate cel putin o data:\nSELECT * FROM produse\nWHERE id IN (SELECT DISTINCT produs_id FROM comenzi);\n\n-- Produse NICIODATA comandate:\nSELECT * FROM produse\nWHERE id NOT IN (\n    SELECT produs_id FROM comenzi WHERE produs_id IS NOT NULL\n);\n-- ATENTIE: adauga WHERE IS NOT NULL!\n-- Daca subquery returneaza vreun NULL, NOT IN returneaza 0 randuri!\n\n-- EXISTS — mai eficient decat IN pe date mari:\nSELECT * FROM clienti c\nWHERE EXISTS (\n    SELECT 1 FROM comenzi o WHERE o.client_id = c.id\n);\n```"
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Operatorul !=",
        "question": "Cum găsești produsele care NU sunt din categoria 'furniture'?",
        "options": [
          "SELECT * FROM produse WHERE categorie != 'furniture';",
          "SELECT * FROM produse WHERE NOT categorie = furniture;",
          "SELECT * FROM produse EXCEPT categorie = 'furniture';",
          "SELECT * FROM produse WHERE categorie IS NOT 'furniture';"
        ],
        "answer": "SELECT * FROM produse WHERE categorie != 'furniture';",
        "explanation": "!= sau <> înseamnă 'diferit de'.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "NOT IN",
        "question": "Care query exclude produsele cu id 1, 2 și 3?",
        "options": [
          "SELECT * FROM produse WHERE id NOT IN (1, 2, 3);",
          "SELECT * FROM produse WHERE id != (1, 2, 3);",
          "SELECT * FROM produse EXCLUDE id IN (1, 2, 3);",
          "SELECT * FROM produse WHERE id NOT = 1, 2, 3;"
        ],
        "answer": "SELECT * FROM produse WHERE id NOT IN (1, 2, 3);",
        "explanation": "NOT IN verifică că valoarea nu se află în lista dată.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "Precedență AND/OR",
        "question": "Ce returnează: `WHERE a=1 OR b=2 AND c=3`?",
        "options": [
          "WHERE a=1 OR (b=2 AND c=3) — AND are prioritate față de OR",
          "WHERE (a=1 OR b=2) AND c=3 — OR are prioritate față de AND",
          "WHERE (a=1 OR b=2) AND (b=2 OR c=3)",
          "Eroare de sintaxă"
        ],
        "answer": "WHERE a=1 OR (b=2 AND c=3) — AND are prioritate față de OR",
        "explanation": "AND are prioritate mai mare decât OR, exact ca înmulțirea față de adunare în matematică.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "LIKE wildcard _",
        "question": "Ce returnează `WHERE cod LIKE 'A_3'`?",
        "options": [
          "Coduri de 3 caractere care încep cu A și se termină cu 3 (ex: AB3, AC3)",
          "Orice cod care conține A și 3",
          "Coduri care încep cu A_3 literal",
          "Coduri cu A urmat de orice până la 3"
        ],
        "answer": "Coduri de 3 caractere care încep cu A și se termină cu 3 (ex: AB3, AC3)",
        "explanation": "_ înseamnă exact un singur caracter. A_3 = A, orice un caracter, 3.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "NULL comportament",
        "question": "Ce returnează `WHERE pret = NULL`?",
        "options": [
          "0 rânduri — comparația cu NULL e mereu false",
          "Rândurile cu prețul NULL",
          "Eroare de sintaxă",
          "Depinde de baza de date"
        ],
        "answer": "0 rânduri — comparația cu NULL e mereu false",
        "explanation": "Orice comparație cu = NULL returnează NULL (nu true). Trebuie IS NULL.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "COALESCE",
        "question": "Ce face `SELECT COALESCE(reducere, 0) FROM produse`?",
        "options": [
          "Returnează reducerea dacă există, altfel 0",
          "Returnează 0 dacă reducerea există, altfel reducerea",
          "Returnează NULL dacă reducerea e 0",
          "Sumă reducere + 0"
        ],
        "answer": "Returnează reducerea dacă există, altfel 0",
        "explanation": "COALESCE returnează primul argument non-NULL din lista sa.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "NOT LIKE",
        "question": "Cum găsești produsele al căror nume NU conține 'gaming'?",
        "options": [
          "SELECT * FROM produse WHERE nume NOT LIKE '%gaming%';",
          "SELECT * FROM produse WHERE nume LIKE NOT '%gaming%';",
          "SELECT * FROM produse WHERE NOT (nume = '%gaming%');",
          "SELECT * FROM produse EXCLUDE WHERE nume LIKE '%gaming%';"
        ],
        "answer": "SELECT * FROM produse WHERE nume NOT LIKE '%gaming%';",
        "explanation": "NOT LIKE inversează condiția LIKE.",
        "difficulty": "easy"
      },
      {
        "number": 8,
        "name": "Subquery simplu",
        "question": "Cum găsești produsele mai scumpe decât media tuturor prețurilor?",
        "options": [
          "SELECT * FROM produse WHERE pret > (SELECT AVG(pret) FROM produse);",
          "SELECT * FROM produse WHERE pret > AVG(pret);",
          "SELECT * FROM produse WHERE pret > AVERAGE;",
          "SELECT * FROM produse HAVING pret > AVG(pret);"
        ],
        "answer": "SELECT * FROM produse WHERE pret > (SELECT AVG(pret) FROM produse);",
        "explanation": "AVG nu poate fi folosit direct în WHERE — trebuie într-un subquery sau cu HAVING după GROUP BY.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "NOT IN cu NULL",
        "question": "De ce `WHERE id NOT IN (SELECT produs_id FROM comenzi)` poate returna 0 rânduri?",
        "options": [
          "Dacă subquery-ul conține vreun NULL, NOT IN returnează 0 rânduri",
          "NOT IN nu funcționează cu subquery-uri",
          "Subquery-ul trebuie să aibă DISTINCT",
          "Ordinea clauzelor e greșită"
        ],
        "answer": "Dacă subquery-ul conține vreun NULL, NOT IN returnează 0 rânduri",
        "explanation": "NULL în lista NOT IN face ca toată condiția să fie NULL (necunoscut), deci niciun rând nu trece.",
        "difficulty": "hard"
      },
      {
        "number": 10,
        "name": "Paranteze în WHERE",
        "question": "Ce diferență face `(A OR B) AND C` față de `A OR B AND C`?",
        "options": [
          "Prima filtrează pe ambele A/B și apoi pe C; a doua filtrează A separat și (B AND C) separat",
          "Nu există diferență, OR și AND au aceeași prioritate",
          "Prima e greșită sintactic",
          "A doua filtrează (A OR B) și C"
        ],
        "answer": "Prima filtrează pe ambele A/B și apoi pe C; a doua filtrează A separat și (B AND C) separat",
        "explanation": "Parantezele schimbă ordinea evaluării. Fără paranteze, AND are prioritate față de OR.",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "BETWEEN cu date",
        "question": "Ce face `WHERE data_comanda BETWEEN '2024-01-01' AND '2024-12-31'`?",
        "options": [
          "Returnează comenzile din anul 2024 inclusiv ambele capete",
          "Returnează comenzile din 2024 exclusiv capetele",
          "Eroare — BETWEEN nu funcționează cu date calendaristice",
          "Returnează comenzile dinaintea lui 2024"
        ],
        "answer": "Returnează comenzile din anul 2024 inclusiv ambele capete",
        "explanation": "BETWEEN funcționează cu orice tip ordonat: numere, date, șiruri. Capetele sunt incluse.",
        "difficulty": "easy"
      },
      {
        "number": 12,
        "name": "LIKE case sensitivity",
        "question": "În PostgreSQL, `WHERE nume LIKE 'laptop%'` găsește și 'Laptop Dell'?",
        "options": [
          "Nu — LIKE în PostgreSQL e case-sensitive, trebuie ILIKE",
          "Da — LIKE e mereu case-insensitive",
          "Da, dar doar pe PostgreSQL 14+",
          "Depinde de configurarea serverului"
        ],
        "answer": "Nu — LIKE în PostgreSQL e case-sensitive, trebuie ILIKE",
        "explanation": "PostgreSQL: LIKE e case-sensitive. Folosești ILIKE pentru insensitiv. MySQL: LIKE e insensitiv implicit.",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Filtrare complexă",
        "question": "Cum găsești produsele din 'electronics' cu preț între 100 și 2000 și care au stoc?",
        "options": [
          "WHERE categorie='electronics' AND pret BETWEEN 100 AND 2000 AND stoc > 0;",
          "WHERE categorie='electronics' OR pret BETWEEN 100 AND 2000 OR stoc > 0;",
          "WHERE categorie='electronics' AND (pret BETWEEN 100 AND 2000) OR stoc > 0;",
          "WHERE categorie='electronics' HAVING pret BETWEEN 100 AND 2000 AND stoc > 0;"
        ],
        "answer": "WHERE categorie='electronics' AND pret BETWEEN 100 AND 2000 AND stoc > 0;",
        "explanation": "Toate condițiile sunt legate cu AND pentru că vrei ca toate să fie adevărate simultan.",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "NULLIF",
        "question": "Ce face `SELECT vanzari / NULLIF(vizitatori, 0) AS rata_conversie`?",
        "options": [
          "Împarte vanzari la vizitatori, dar evită împărțirea la 0 returnând NULL",
          "Returnează NULL dacă vanzari e 0",
          "Returnează 0 când vizitatori e 0",
          "Eroare — NULLIF nu poate fi folosit în expresii aritmetice"
        ],
        "answer": "Împarte vanzari la vizitatori, dar evită împărțirea la 0 returnând NULL",
        "explanation": "NULLIF(x, 0) returnează NULL dacă x=0, altfel x. NULL/orice = NULL, nu eroare. Perfect pentru rate/procentaje.",
        "difficulty": "hard"
      },
      {
        "number": 15,
        "name": "Proiect: motor de căutare",
        "question": "Query pentru bara de căutare: caută produse după termen parțial în nume, exclude fără stoc, sortează potrivirile exacte primele:",
        "options": [
          "SELECT * FROM produse WHERE nume LIKE '%:term%' AND stoc > 0 ORDER BY CASE WHEN nume = ':term' THEN 0 ELSE 1 END, nume;",
          "SELECT * FROM produse WHERE LIKE(:term) AND stoc != 0;",
          "SELECT * FROM produse SEARCH(:term) WHERE stoc > 0;",
          "SELECT * FROM produse WHERE CONTAINS(nume, :term) ORDER BY relevance;"
        ],
        "answer": "SELECT * FROM produse WHERE nume LIKE '%:term%' AND stoc > 0 ORDER BY CASE WHEN nume = ':term' THEN 0 ELSE 1 END, nume;",
        "explanation": "CASE în ORDER BY permite sortare complexă: potrivirile exacte sus, restul alfabetic.",
        "difficulty": "hard"
      }
    ]
  },
  {
    "slug": "sql-insert-update-delete",
    "title": "3. INSERT, UPDATE, DELETE și Tranzacții",
    "order": 3,
    "theory": [
      {
        "order": 1,
        "title": "INSERT — adaugi date noi",
        "content": "INSERT adaugă rânduri noi într-o tabelă. E operația prin care orice formular de pe site salvează date.\n\n```sql\n-- Un singur rand:\nINSERT INTO produse (nume, pret, categorie, stoc)\nVALUES ('Tastatura Mecanica', 450, 'electronics', 25);\n\n-- Mai multe randuri (mult mai eficient!):\nINSERT INTO produse (nume, pret, categorie, stoc)\nVALUES\n    ('Webcam HD', 280, 'electronics', 30),\n    ('Pad Mouse XL', 80, 'accessories', 100),\n    ('Hub USB-C', 150, 'electronics', 45);\n-- Insertarea in bulk e de 10-100x mai rapida!\n\n-- INSERT din SELECT (copiezi date):\nINSERT INTO produse_arhiva (nume, pret, categorie)\nSELECT nume, pret, categorie\nFROM produse WHERE stoc = 0;\n\n-- Evita duplicate:\nINSERT INTO useri (email, nume)\nVALUES ('ion@email.com', 'Ion Popescu')\nON CONFLICT (email) DO NOTHING; -- PostgreSQL\n-- MySQL: INSERT IGNORE INTO ...\n```"
      },
      {
        "order": 2,
        "title": "UPDATE — modifici date existente",
        "content": "UPDATE schimba valori in randurile existente. FARA WHERE modifici TOATE randurile!\n\n```sql\n-- Corect — cu WHERE:\nUPDATE produse SET pret = 3200 WHERE id = 1;\n\n-- Mai multe coloane:\nUPDATE produse\nSET\n    pret = 3200,\n    stoc = stoc - 1,\n    ultima_modificare = NOW()\nWHERE id = 1;\n\n-- Reducere 10% la toata categoria:\nUPDATE produse\nSET pret = pret * 0.9\nWHERE categorie = 'furniture';\n\n-- Update cu subquery:\nUPDATE produse\nSET pret = pret * 1.05\nWHERE id IN (\n    SELECT produs_id FROM comenzi\n    WHERE data_comanda > '2024-01-01'\n);\n```\n\nREGULA DE AUR: Inainte de orice UPDATE, ruleaza SELECT cu acelasi WHERE ca sa verifici ce vei modifica!"
      },
      {
        "order": 3,
        "title": "DELETE — stergi date cu mare grija",
        "content": "DELETE sterge randuri. Fara WHERE stergi TOATA tabela. E ireversibil fara backup.\n\n```sql\n-- Sterge un singur rand:\nDELETE FROM produse WHERE id = 5;\n\n-- Sterge mai multe:\nDELETE FROM produse WHERE stoc = 0;\n\n-- TRUNCATE — sterge TOT, mult mai rapid:\nTRUNCATE TABLE produse_temp;\n-- Diferenta: reseteaza auto-increment, nu poate fi rollback-at in unele DB\n\n-- Soft delete (recomandat in aplicatii reale):\nALTER TABLE produse ADD COLUMN deleted_at DATETIME;\n\nUPDATE produse SET deleted_at = NOW() WHERE id = 5;\n-- Nu stergi fizic, marchezi ca sters\n-- Avantaje: poti restaura, pastezi istoricul, GDPR\n-- Dezavantaje: tabela creste, queries trebuie sa filtreze mereu\n```"
      },
      {
        "order": 4,
        "title": "Tranzacții — ACID și de ce contează",
        "content": "O tranzactie grupeaza mai multe operatii ca un singur tot. Fie toate reusesc, fie nicio una.\n\nSCENARIU: Transfer bancar 1000 RON.\n```sql\nSTART TRANSACTION;\n\nUPDATE conturi SET sold = sold - 1000 WHERE id = 1;  -- scade de la Ion\nUPDATE conturi SET sold = sold + 1000 WHERE id = 2;  -- adauga la Maria\n\nCOMMIT;   -- salveaza ambele modificari\n\n-- Daca ceva merge prost:\nROLLBACK; -- anuleaza TOTUL din tranzactie\n```\n\nACID — proprietatile unei tranzactii corecte:\n- Atomicity: totul sau nimic\n- Consistency: baza de date trece dintr-o stare valida in alta\n- Isolation: tranzactiile paralele nu se vad intre ele pana la COMMIT\n- Durability: dupa COMMIT, datele sunt salvate permanent\n\nSAVEPOINT — rollback partial:\n```sql\nSTART TRANSACTION;\nINSERT INTO comenzi ...;\nSAVEPOINT dupa_insert;\nUPDATE produse ...;  -- ceva merge rau\nROLLBACK TO SAVEPOINT dupa_insert; -- revii fara a pierde insert-ul\nCOMMIT;\n```"
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "INSERT sintaxă",
        "question": "Care este sintaxa corectă pentru INSERT?",
        "options": [
          "INSERT INTO tabela (col1, col2) VALUES (val1, val2);",
          "INSERT INTO tabela VALUES (col1=val1, col2=val2);",
          "ADD INTO tabela (col1, col2) VALUES (val1, val2);",
          "INSERT tabela SET col1=val1, col2=val2;"
        ],
        "answer": "INSERT INTO tabela (col1, col2) VALUES (val1, val2);",
        "explanation": "INSERT INTO urmat de tabelă, lista de coloane în paranteze, VALUES și valorile.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "INSERT multiple",
        "question": "Cum inserezi 3 rânduri cu un singur INSERT?",
        "options": [
          "INSERT INTO t (c) VALUES (1), (2), (3);",
          "INSERT INTO t (c) VALUES (1); VALUES (2); VALUES (3);",
          "INSERT 3 INTO t (c) VALUES (1), (2), (3);",
          "INSERT INTO t (c) MULTIPLE VALUES (1), (2), (3);"
        ],
        "answer": "INSERT INTO t (c) VALUES (1), (2), (3);",
        "explanation": "Listezi mai multe seturi de valori separate prin virgulă după VALUES.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "UPDATE fără WHERE",
        "question": "Ce se întâmplă dacă faci UPDATE fără WHERE?",
        "options": [
          "Se modifică TOATE rândurile din tabelă",
          "Se modifică primul rând",
          "Eroare — UPDATE necesită WHERE",
          "Nu se modifică nimic"
        ],
        "answer": "Se modifică TOATE rândurile din tabelă",
        "explanation": "UPDATE fără WHERE este periculos — modifică fiecare rând din tabelă. Rulează SELECT mai întâi.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "UPDATE calcul",
        "question": "Cum aplici o reducere de 15% la toate produsele din 'furniture'?",
        "options": [
          "UPDATE produse SET pret = pret * 0.85 WHERE categorie = 'furniture';",
          "UPDATE produse SET pret = pret - 15% WHERE categorie = 'furniture';",
          "UPDATE produse SET pret = pret * 15 / 100 WHERE categorie = 'furniture';",
          "UPDATE produse (pret * 0.85) WHERE categorie = 'furniture';"
        ],
        "answer": "UPDATE produse SET pret = pret * 0.85 WHERE categorie = 'furniture';",
        "explanation": "0.85 = 100% - 15% = 85% din prețul original.",
        "difficulty": "easy"
      },
      {
        "number": 5,
        "name": "DELETE vs TRUNCATE",
        "question": "Care este diferența principală între DELETE și TRUNCATE?",
        "options": [
          "DELETE poate fi filtrat cu WHERE și rollback-at; TRUNCATE șterge tot mai rapid fără rollback",
          "TRUNCATE poate fi filtrat cu WHERE; DELETE șterge tot",
          "Sunt identice dar TRUNCATE e mai nou",
          "DELETE funcționează pe tabele mari, TRUNCATE pe mici"
        ],
        "answer": "DELETE poate fi filtrat cu WHERE și rollback-at; TRUNCATE șterge tot mai rapid fără rollback",
        "explanation": "DELETE e controlat (WHERE, rollback). TRUNCATE e rapid dar șterge tot.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "Soft delete",
        "question": "De ce aplicațiile reale preferă soft delete față de DELETE fizic?",
        "options": [
          "Permite restaurarea datelor și păstrarea istoricului de audit",
          "E mai rapid decât DELETE",
          "Economisește spațiu pe disc",
          "E singurul mod care funcționează cu JOIN"
        ],
        "answer": "Permite restaurarea datelor și păstrarea istoricului de audit",
        "explanation": "Soft delete (deleted_at timestamp) permite restaurare, audit trail, conformitate GDPR.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "COMMIT și ROLLBACK",
        "question": "Ce face ROLLBACK într-o tranzacție?",
        "options": [
          "Anulează toate modificările făcute de la START TRANSACTION",
          "Salvează modificările permanente",
          "Creează un backup al tranzacției",
          "Continuă tranzacția la o stare anterioară"
        ],
        "answer": "Anulează toate modificările făcute de la START TRANSACTION",
        "explanation": "ROLLBACK anulează orice modificare din tranzacția curentă. Util când apare o eroare.",
        "difficulty": "easy"
      },
      {
        "number": 8,
        "name": "ACID - Atomicity",
        "question": "Ce garantează proprietatea Atomicity dintr-o tranzacție?",
        "options": [
          "Fie toate operațiile din tranzacție reușesc, fie niciuna",
          "Tranzacția nu poate fi întreruptă de altele",
          "Datele sunt corecte după tranzacție",
          "Modificările sunt salvate permanent"
        ],
        "answer": "Fie toate operațiile din tranzacție reușesc, fie niciuna",
        "explanation": "Atomicity = totul sau nimic. Dacă o operație din tranzacție eșuează, toate se anulează.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "INSERT SELECT",
        "question": "Ce face `INSERT INTO arhiva SELECT * FROM produse WHERE stoc = 0`?",
        "options": [
          "Copiază toate produsele fără stoc din tabela produse în arhiva",
          "Mută produsele (le șterge din produse)",
          "Creează tabela arhiva cu produsele fără stoc",
          "Eroare — INSERT nu poate fi combinat cu SELECT"
        ],
        "answer": "Copiază toate produsele fără stoc din tabela produse în arhiva",
        "explanation": "INSERT...SELECT copiază date dintr-o tabelă în alta în baza unui query.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "ON CONFLICT",
        "question": "Ce face `INSERT INTO useri (email) VALUES ('a@b.com') ON CONFLICT (email) DO NOTHING`?",
        "options": [
          "Inserează userul dacă emailul nu există, altfel ignoră (fără eroare)",
          "Inserează întotdeauna, duplicând emailul",
          "Actualizează userul dacă emailul există",
          "Generează eroare de duplicat silențioasă"
        ],
        "answer": "Inserează userul dacă emailul nu există, altfel ignoră (fără eroare)",
        "explanation": "ON CONFLICT DO NOTHING ignorează INSERT-ul dacă violează o constrângere unică. PostgreSQL syntax.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "Tranzacție și crash",
        "question": "Dacă serverul cade DUPĂ `UPDATE conturi SET sold=sold-1000` dar ÎNAINTE de COMMIT, ce se întâmplă?",
        "options": [
          "Tranzacția e rollback-ată automat — banii nu se scad",
          "Banii se scad dar nu se adaugă la destinatar",
          "Tranzacția e salvată parțial",
          "Depinde de baza de date"
        ],
        "answer": "Tranzacția e rollback-ată automat — banii nu se scad",
        "explanation": "Fără COMMIT, modificările din tranzacție nu sunt permanente. Recovery-ul DB face rollback automat.",
        "difficulty": "hard"
      },
      {
        "number": 12,
        "name": "UPDATE cu subquery",
        "question": "Cum mărești prețul cu 5% al produselor comandate în ultimele 30 de zile?",
        "options": [
          "UPDATE produse SET pret=pret*1.05 WHERE id IN (SELECT produs_id FROM comenzi WHERE data > DATE_SUB(NOW(), INTERVAL 30 DAY));",
          "UPDATE produse SET pret*1.05 WHERE EXISTS (SELECT * FROM comenzi INTERVAL 30 DAY);",
          "UPDATE produse, comenzi SET pret=pret*1.05 WHERE data > -30;",
          "UPDATE produse SET pret+5% WHERE comenzi.data > NOW()-30;"
        ],
        "answer": "UPDATE produse SET pret=pret*1.05 WHERE id IN (SELECT produs_id FROM comenzi WHERE data > DATE_SUB(NOW(), INTERVAL 30 DAY));",
        "explanation": "DATE_SUB(NOW(), INTERVAL 30 DAY) calculează data de acum 30 de zile.",
        "difficulty": "hard"
      },
      {
        "number": 13,
        "name": "SAVEPOINT",
        "question": "La ce folosește SAVEPOINT în interiorul unei tranzacții?",
        "options": [
          "Poți face rollback parțial la acel punct fără a anula întreaga tranzacție",
          "Salvează tranzacția permanent la acel punct",
          "Creează o ramificație a tranzacției",
          "E echivalent cu un COMMIT parțial"
        ],
        "answer": "Poți face rollback parțial la acel punct fără a anula întreaga tranzacție",
        "explanation": "SAVEPOINT îți permite rollback granular. ROLLBACK TO savepoint_name revine la acel punct, nu la START TRANSACTION.",
        "difficulty": "hard"
      },
      {
        "number": 14,
        "name": "ACID - Isolation",
        "question": "Ce garantează proprietatea Isolation?",
        "options": [
          "Tranzacțiile concurente nu văd modificările ne-committed ale celorlalte",
          "O singură tranzacție poate rula la un moment dat",
          "Datele izolate nu pot fi șterse",
          "Fiecare tabelă e accesibilă dintr-o singură conexiune"
        ],
        "answer": "Tranzacțiile concurente nu văd modificările ne-committed ale celorlalte",
        "explanation": "Isolation previne 'dirty reads' — nu citești datele intermediate ale altor tranzacții necomplete.",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Proiect: sistem comenzi",
        "question": "Tranzacția corectă pentru plasarea unei comenzi (scade stoc, inserează comanda, actualizează total user):",
        "options": [
          "START TRANSACTION; UPDATE produse SET stoc=stoc-1 WHERE id=:pid; INSERT INTO comenzi (user_id,produs_id) VALUES (:uid,:pid); UPDATE useri SET total_comenzi=total_comenzi+1 WHERE id=:uid; COMMIT;",
          "BEGIN; INSERT INTO comenzi VALUES(:uid,:pid); COMMIT;",
          "TRANSACTION { UPDATE produse; INSERT comenzi; UPDATE useri; }",
          "START; UPDATE produse; INSERT comenzi; END TRANSACTION;"
        ],
        "answer": "START TRANSACTION; UPDATE produse SET stoc=stoc-1 WHERE id=:pid; INSERT INTO comenzi (user_id,produs_id) VALUES (:uid,:pid); UPDATE useri SET total_comenzi=total_comenzi+1 WHERE id=:uid; COMMIT;",
        "explanation": "Toate cele 3 operații trebuie să fie atomice — dacă una eșuează, ROLLBACK anulează tot.",
        "difficulty": "hard"
      }
    ]
  },
  {
    "slug": "sql-functii-agregate",
    "title": "4. Funcții agregate + GROUP BY",
    "order": 4,
    "theory": [
      {
        "order": 1,
        "title": "Funcții agregate — calculezi statistici",
        "content": "Functiile agregate calculeaza o valoare pentru un grup de randuri. Esentiale pentru rapoarte.\n\n```sql\n-- COUNT:\nSELECT COUNT(*) FROM produse;           -- toate randurile\nSELECT COUNT(descriere) FROM produse;   -- doar cele cu descriere (non-NULL)\nSELECT COUNT(DISTINCT categorie) FROM produse; -- categorii unice\n\n-- SUM:\nSELECT SUM(pret) FROM comenzi WHERE luna = 6; -- venit luna iunie\n\n-- AVG:\nSELECT ROUND(AVG(pret), 2) AS pret_mediu FROM produse;\n\n-- MIN / MAX:\nSELECT MIN(pret) AS cel_mai_ieftin, MAX(pret) AS cel_mai_scump\nFROM produse;\n\n-- Combinate:\nSELECT\n    COUNT(*) AS total,\n    SUM(stoc) AS stoc_total,\n    AVG(pret) AS pret_mediu,\n    MIN(pret) AS minim,\n    MAX(pret) AS maxim\nFROM produse;\n```\n\nDIFERETA CRITICA: COUNT(*) numara toate randurile inclusiv cu NULL. COUNT(coloana) numara doar non-NULL. Esti aproape sigur intrebat la interviu!"
      },
      {
        "order": 2,
        "title": "GROUP BY — statistici pe grupuri",
        "content": "GROUP BY grupeaza randurile cu valori identice si aplica functiile agregate pe fiecare grup.\n\n```sql\n-- Statistici per categorie:\nSELECT\n    categorie,\n    COUNT(*) AS nr_produse,\n    AVG(pret) AS pret_mediu,\n    SUM(stoc) AS stoc_total\nFROM produse\nGROUP BY categorie;\n\n-- REGULA GROUP BY:\n-- In SELECT, orice coloana care NU e intr-o functie agregata\n-- TREBUIE sa fie in GROUP BY!\n\n-- GRESIT:\nSELECT categorie, nume, COUNT(*) FROM produse GROUP BY categorie;\n-- Eroare: 'nume' nu e in GROUP BY si nu e agregat\n\n-- CORECT:\nSELECT categorie, COUNT(*) FROM produse GROUP BY categorie;\n\n-- GROUP BY pe expresie:\nSELECT YEAR(data), COUNT(*) FROM comenzi GROUP BY YEAR(data);\n```"
      },
      {
        "order": 3,
        "title": "HAVING — filtrezi grupuri",
        "content": "HAVING e ca WHERE dar pentru grupuri. WHERE filtreaza INAINTE de grupare, HAVING DUPA.\n\n```sql\n-- Categorii cu mai mult de 3 produse:\nSELECT categorie, COUNT(*) AS nr\nFROM produse\nGROUP BY categorie\nHAVING COUNT(*) > 3;\n-- NU poti pune COUNT(*) > 3 in WHERE!\n\n-- WHERE + HAVING combinate:\nSELECT categorie, AVG(pret) AS pret_mediu\nFROM produse\nWHERE stoc > 0          -- FILTRARE 1: exclude fara stoc\nGROUP BY categorie\nHAVING AVG(pret) > 500; -- FILTRARE 2: exclude categorii ieftine\n\n-- Report real: top categorii dupa vanzari:\nSELECT\n    p.categorie,\n    SUM(c.cantitate * p.pret) AS venit_total\nFROM comenzi c\nJOIN produse p ON c.produs_id = p.id\nWHERE c.data >= DATE_FORMAT(NOW(), '%Y-%m-01')\nGROUP BY p.categorie\nHAVING venit_total > 10000\nORDER BY venit_total DESC;\n```"
      },
      {
        "order": 4,
        "title": "Ordinea completă de execuție SQL",
        "content": "SQL nu se executa in ordinea in care scrii clauzele. Ordinea de executie e critica pentru a intelege erori.\n\nORDINEA:\n```\n1. FROM      — din ce tabele\n2. JOIN      — combini tabelele\n3. WHERE     — filtrezi randuri (inainte de grup)\n4. GROUP BY  — formezi grupuri\n5. HAVING    — filtrezi grupuri\n6. SELECT    — calculezi/alegi coloanele\n7. DISTINCT  — elimini duplicate\n8. ORDER BY  — sortezi\n9. LIMIT     — limitezi\n```\n\nIn practica:\n```sql\n-- Nu poti folosi alias din SELECT in WHERE:\nSELECT pret * 1.19 AS pret_tva\nFROM produse\nWHERE pret_tva > 500;  -- EROARE! pret_tva nu exista la momentul WHERE\n\n-- Corect: repeti expresia\nWHERE pret * 1.19 > 500;\n\n-- ORDER BY poate folosi alias (vine dupa SELECT):\nSELECT pret * 1.19 AS pret_tva FROM produse\nORDER BY pret_tva DESC;  -- OK!\n```"
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "COUNT(*) vs COUNT(col)",
        "question": "Diferența dintre `COUNT(*)` și `COUNT(descriere)`?",
        "options": [
          "COUNT(*) numără toate rândurile; COUNT(descriere) numără doar rândurile cu descriere non-NULL",
          "COUNT(descriere) numără toate rândurile; COUNT(*) numără doar rândurile complete",
          "Sunt identice",
          "COUNT(*) e mai rapid, COUNT(col) mai precis"
        ],
        "answer": "COUNT(*) numără toate rândurile; COUNT(descriere) numără doar rândurile cu descriere non-NULL",
        "explanation": "COUNT(*) = toate rândurile. COUNT(col) = rânduri unde col nu e NULL. Diferența contează!",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "SUM venituri",
        "question": "Cum calculezi venitul total al comenzilor din luna curentă?",
        "options": [
          "SELECT SUM(total) FROM comenzi WHERE MONTH(data) = MONTH(NOW());",
          "SELECT COUNT(total) FROM comenzi WHERE luna = NOW();",
          "SELECT TOTAL(suma) FROM comenzi THIS MONTH;",
          "SELECT SUM(*) FROM comenzi WHERE data = NOW();"
        ],
        "answer": "SELECT SUM(total) FROM comenzi WHERE MONTH(data) = MONTH(NOW());",
        "explanation": "SUM adună valorile. MONTH() extrage luna din dată. NOW() returnează data curentă.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "GROUP BY bază",
        "question": "Ce returnează `SELECT categorie, COUNT(*) FROM produse GROUP BY categorie`?",
        "options": [
          "Un rând per categorie cu numărul de produse din ea",
          "Toate produsele cu categoria lor repetată",
          "Un singur număr total de produse",
          "Eroare — COUNT(*) nu funcționează cu GROUP BY"
        ],
        "answer": "Un rând per categorie cu numărul de produse din ea",
        "explanation": "GROUP BY grupează rândurile identice. COUNT(*) numără câte rânduri sunt în fiecare grup.",
        "difficulty": "easy"
      },
      {
        "number": 4,
        "name": "Regula GROUP BY",
        "question": "De ce `SELECT categorie, nume, COUNT(*) FROM produse GROUP BY categorie` e greșit?",
        "options": [
          "'nume' nu e în GROUP BY și nu e funcție agregată — ambiguitate",
          "COUNT(*) nu poate fi combinat cu alte coloane",
          "GROUP BY necesită ORDER BY",
          "Trebuie să specifici toate coloanele în GROUP BY"
        ],
        "answer": "'nume' nu e în GROUP BY și nu e funcție agregată — ambiguitate",
        "explanation": "Orice coloană din SELECT care nu e într-o funcție agregată trebuie să fie în GROUP BY.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "HAVING vs WHERE",
        "question": "Unde filtrezi pentru 'categorii cu mai mult de 5 produse'?",
        "options": [
          "HAVING COUNT(*) > 5 — după GROUP BY",
          "WHERE COUNT(*) > 5 — înainte de GROUP BY",
          "FILTER COUNT(*) > 5",
          "ORDER BY COUNT(*) > 5"
        ],
        "answer": "HAVING COUNT(*) > 5 — după GROUP BY",
        "explanation": "Funcțiile agregate nu pot fi în WHERE. HAVING filtrează grupurile formate de GROUP BY.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "MIN și MAX",
        "question": "Cum găsești cel mai scump și cel mai ieftin produs din fiecare categorie?",
        "options": [
          "SELECT categorie, MIN(pret), MAX(pret) FROM produse GROUP BY categorie;",
          "SELECT categorie, LOWEST(pret), HIGHEST(pret) FROM produse GROUP BY categorie;",
          "SELECT categorie, pret WHERE pret = MIN OR pret = MAX GROUP BY categorie;",
          "SELECT MIN(pret), MAX(pret) FROM produse ORDER BY categorie;"
        ],
        "answer": "SELECT categorie, MIN(pret), MAX(pret) FROM produse GROUP BY categorie;",
        "explanation": "MIN și MAX returnează valorile extreme din grup când sunt combinate cu GROUP BY.",
        "difficulty": "easy"
      },
      {
        "number": 7,
        "name": "AVG și ROUND",
        "question": "Cum calculezi prețul mediu rotunjit la 2 zecimale per categorie?",
        "options": [
          "SELECT categorie, ROUND(AVG(pret), 2) FROM produse GROUP BY categorie;",
          "SELECT categorie, AVG(ROUND(pret, 2)) FROM produse GROUP BY categorie;",
          "SELECT categorie, ROUND(pret, 2) FROM produse GROUP BY categorie;",
          "SELECT categorie, FORMAT(AVG(pret), 2) FROM produse GROUP BY categorie;"
        ],
        "answer": "SELECT categorie, ROUND(AVG(pret), 2) FROM produse GROUP BY categorie;",
        "explanation": "Aplici ROUND pe rezultatul AVG. Ordinea: AVG calculează media, ROUND o rotunjește.",
        "difficulty": "easy"
      },
      {
        "number": 8,
        "name": "Ordinea execuției",
        "question": "De ce `WHERE pret_tva > 500` eșuează dacă pret_tva e alias din SELECT?",
        "options": [
          "WHERE se execută înaintea SELECT, deci alias-ul nu există încă",
          "Alias-urile nu pot fi folosite în filtrare",
          "WHERE nu acceptă comparații",
          "pret_tva trebuie să fie coloană fizică"
        ],
        "answer": "WHERE se execută înaintea SELECT, deci alias-ul nu există încă",
        "explanation": "Ordinea: FROM→WHERE→GROUP BY→HAVING→SELECT→ORDER BY. WHERE rulează înainte de SELECT.",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "WHERE + HAVING combinat",
        "question": "Cum calculezi media prețurilor (excluzând fără stoc) per categorie, și arăți doar categoriile cu medie > 500?",
        "options": [
          "SELECT categorie, AVG(pret) FROM produse WHERE stoc > 0 GROUP BY categorie HAVING AVG(pret) > 500;",
          "SELECT categorie, AVG(pret) FROM produse GROUP BY categorie HAVING stoc > 0 AND AVG(pret) > 500;",
          "SELECT categorie, AVG(pret) FROM produse WHERE stoc > 0 HAVING AVG(pret) > 500;",
          "SELECT categorie FROM produse WHERE stoc > 0 AND AVG(pret) > 500 GROUP BY categorie;"
        ],
        "answer": "SELECT categorie, AVG(pret) FROM produse WHERE stoc > 0 GROUP BY categorie HAVING AVG(pret) > 500;",
        "explanation": "WHERE filtrează rânduri înainte de grupare. HAVING filtrează grupul după.",
        "difficulty": "hard"
      },
      {
        "number": 10,
        "name": "COUNT DISTINCT",
        "question": "Cum numeri câți utilizatori unici au plasat comenzi?",
        "options": [
          "SELECT COUNT(DISTINCT user_id) FROM comenzi;",
          "SELECT DISTINCT COUNT(user_id) FROM comenzi;",
          "SELECT COUNT(user_id) UNIQUE FROM comenzi;",
          "SELECT UNIQUE_COUNT(user_id) FROM comenzi;"
        ],
        "answer": "SELECT COUNT(DISTINCT user_id) FROM comenzi;",
        "explanation": "DISTINCT în interiorul COUNT numără valorile unice, nu totale.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "GROUP BY cu JOIN",
        "question": "Cum calculezi totalul vânzărilor per categorie (tabele comenzi și produse)?",
        "options": [
          "SELECT p.categorie, SUM(c.total) FROM comenzi c JOIN produse p ON c.produs_id=p.id GROUP BY p.categorie;",
          "SELECT SUM(c.total) FROM comenzi GROUP BY p.categorie JOIN produse;",
          "SELECT p.categorie, SUM(c.total) FROM produse GROUP BY p.categorie JOIN comenzi;",
          "SELECT categorie, SUM(total) FROM comenzi, produse GROUP BY categorie;"
        ],
        "answer": "SELECT p.categorie, SUM(c.total) FROM comenzi c JOIN produse p ON c.produs_id=p.id GROUP BY p.categorie;",
        "explanation": "JOIN combini tabelele, GROUP BY grupezi, SUM agregezi. Ordinea: FROM→JOIN→GROUP BY.",
        "difficulty": "hard"
      },
      {
        "number": 12,
        "name": "Procente din total",
        "question": "Cum calculezi procentul din total al fiecărei categorii?",
        "options": [
          "SELECT categorie, COUNT(*) * 100.0 / (SELECT COUNT(*) FROM produse) AS procent FROM produse GROUP BY categorie;",
          "SELECT categorie, COUNT(*) / COUNT(*) * 100 FROM produse GROUP BY categorie;",
          "SELECT categorie, PERCENT(COUNT(*)) FROM produse GROUP BY categorie;",
          "SELECT categorie, COUNT(*) AS procent FROM produse GROUP BY categorie ORDER BY procent;"
        ],
        "answer": "SELECT categorie, COUNT(*) * 100.0 / (SELECT COUNT(*) FROM produse) AS procent FROM produse GROUP BY categorie;",
        "explanation": "Subquery calculează totalul, împarți count-ul grupului la total. Folosești 100.0 (nu 100!) pentru a evita împărțirea de întregi.",
        "difficulty": "hard"
      },
      {
        "number": 13,
        "name": "GROUP BY pe expresie",
        "question": "Cum grupezi comenzile pe an?",
        "options": [
          "SELECT YEAR(data), COUNT(*) FROM comenzi GROUP BY YEAR(data);",
          "SELECT data, COUNT(*) FROM comenzi GROUP BY YEAR;",
          "SELECT COUNT(*) FROM comenzi GROUP YEAR(data);",
          "SELECT YEAR, COUNT(*) FROM comenzi GROUP BY data;"
        ],
        "answer": "SELECT YEAR(data), COUNT(*) FROM comenzi GROUP BY YEAR(data);",
        "explanation": "Poți GROUP BY pe o expresie sau funcție, nu doar pe coloane.",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "HAVING cu alias MySQL",
        "question": "În MySQL, funcționează `SELECT categorie, COUNT(*) AS nr FROM produse GROUP BY categorie HAVING nr > 3`?",
        "options": [
          "Da, MySQL permite alias în HAVING",
          "Nu, trebuie HAVING COUNT(*) > 3 întotdeauna",
          "Da, dar e non-standard și nu merge în PostgreSQL",
          "Depinde de versiunea MySQL"
        ],
        "answer": "Da, dar e non-standard și nu merge în PostgreSQL",
        "explanation": "MySQL extinde standardul SQL și permite alias în HAVING. PostgreSQL standard nu. Folosește COUNT(*) > 3 pentru portabilitate.",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Proiect: dashboard vânzări",
        "question": "Top 5 categorii după venituri din ultimele 30 de zile, cu nr. comenzi și valoare medie:",
        "options": [
          "SELECT p.categorie, COUNT(c.id) AS nr, SUM(c.total) AS venit, AVG(c.total) AS medie FROM comenzi c JOIN produse p ON c.produs_id=p.id WHERE c.data >= DATE_SUB(NOW(),INTERVAL 30 DAY) GROUP BY p.categorie ORDER BY venit DESC LIMIT 5;",
          "SELECT COUNT(*), SUM(total) FROM comenzi LIMIT 5 WHERE data > -30;",
          "SELECT TOP 5 categorie, SUM(total) FROM comenzi ORDER BY SUM DESC;",
          "SELECT categorie, AVG(total) FROM comenzi INTERVAL 30 ORDER BY 1 LIMIT 5;"
        ],
        "answer": "SELECT p.categorie, COUNT(c.id) AS nr, SUM(c.total) AS venit, AVG(c.total) AS medie FROM comenzi c JOIN produse p ON c.produs_id=p.id WHERE c.data >= DATE_SUB(NOW(),INTERVAL 30 DAY) GROUP BY p.categorie ORDER BY venit DESC LIMIT 5;",
        "explanation": "Combini JOIN, WHERE pe dată, GROUP BY, mai multe agregate și LIMIT pentru top 5.",
        "difficulty": "hard"
      }
    ]
  },
  {
    "slug": "sql-joins",
    "title": "5. JOINs — combini tabele",
    "order": 5,
    "theory": [
      {
        "order": 1,
        "title": "De ce avem mai multe tabele și ce sunt JOINs",
        "content": "Bazele de date relationale stocheaza datele in tabele separate pentru a evita duplicarea. O comanda nu stocheaza tot textul adresei clientului — stocheaza doar ID-ul clientului.\n\nTabelele:\n```\nclienti:          comenzi:\nid | nume         id | client_id | total\n1  | Ion          1  |     1     |  250\n2  | Maria        2  |     1     |  800\n3  | Andrei       3  |     2     |  150\n4  | Elena        4  |     4     | 1200\n```\n\nJOIN uneste randuri din tabele diferite pe baza unei conditii:\n```sql\nSELECT clienti.nume, comenzi.total\nFROM clienti\nJOIN comenzi ON clienti.id = comenzi.client_id;\n-- Rezultat: Ion+250, Ion+800, Maria+150, Elena+1200\n-- Andrei nu apare — nu are comenzi (INNER JOIN exclude randurile fara corespondent)\n```"
      },
      {
        "order": 2,
        "title": "INNER, LEFT, RIGHT, FULL JOIN — vizual",
        "content": "Fiecare tip de JOIN controleaza ce se intampla cu randurile care nu au corespondent.\n\n```\nTabela A: [1, 2, 3, 4]    Tabela B: [2, 3, 5]\n\nINNER JOIN: [2, 3]            — doar randurile comune\nLEFT JOIN:  [1, 2, 3, 4]     — toate din A, NULL pentru cele fara B\nRIGHT JOIN: [2, 3, 5]        — toate din B, NULL pentru cele fara A\nFULL JOIN:  [1, 2, 3, 4, 5]  — toate randurile din ambele\n```\n\n```sql\n-- LEFT JOIN — toti clientii, cu sau fara comenzi:\nSELECT c.nume, o.total\nFROM clienti c\nLEFT JOIN comenzi o ON c.id = o.client_id;\n-- 5 randuri: Ion(250), Ion(800), Maria(150), Andrei(NULL), Elena(1200)\n\n-- Clientii FARA comenzi:\nSELECT c.nume\nFROM clienti c\nLEFT JOIN comenzi o ON c.id = o.client_id\nWHERE o.id IS NULL;\n-- Returneaza: Andrei\n```"
      },
      {
        "order": 3,
        "title": "JOIN pe mai multe tabele și aliasuri",
        "content": "Poti inlantui oricate JOIN-uri. Aliasurile scurteaza codul si evita ambiguitatile.\n\n```sql\n-- Trei tabele: utilizatori, comenzi, produse:\nSELECT\n    u.nume AS utilizator,\n    p.nume AS produs,\n    c.cantitate,\n    c.cantitate * p.pret AS subtotal\nFROM comenzi c\nJOIN utilizatori u ON c.user_id = u.id\nJOIN produse p    ON c.produs_id = p.id\nWHERE c.data >= '2024-01-01'\nORDER BY subtotal DESC;\n\n-- Self JOIN — tabela cu ea insasi:\nSELECT\n    a.nume AS angajat,\n    m.nume AS manager\nFROM angajati a\nLEFT JOIN angajati m ON a.manager_id = m.id;\n-- CEO-ul nu are manager — LEFT JOIN il include cu NULL\n\n-- CROSS JOIN — produsul cartezian:\nSELECT culoare, marime\nFROM culori CROSS JOIN marimi;\n-- Genereaza toate combinatiile: rosu-S, rosu-M, albastru-S, etc.\n```"
      },
      {
        "order": 4,
        "title": "Capcana ON vs WHERE în LEFT JOIN",
        "content": "Aceasta e o intrebare clasica de interviu! Diferenta dintre filtrul in ON si in WHERE pentru LEFT JOIN.\n\n```sql\n-- DIFERENTA CRITICA:\n\n-- Query 1: WHERE filtreaza DUPA LEFT JOIN\nSELECT c.nume, o.total\nFROM clienti c\nLEFT JOIN comenzi o ON c.id = o.client_id\nWHERE o.data > '2024-01-01';\n-- Andrei e pierdut! WHERE exclude randurile cu NULL.\n-- Se comporta ca un INNER JOIN!\n\n-- Query 2: conditia in ON — face parte din JOIN\nSELECT c.nume, o.total\nFROM clienti c\nLEFT JOIN comenzi o ON c.id = o.client_id\n              AND o.data > '2024-01-01';\n-- Andrei apare cu NULL (nu are comenzi recente)\n-- Toti clientii sunt inclusi!\n```\n\nREGULA: Pune filtrul pe tabela dreapta in ON daca vrei sa pastrezi toate randurile din stanga. Pune-l in WHERE daca vrei sa filtrezi rândurile dupa JOIN."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "JOIN bază",
        "question": "Ce face `FROM clienti JOIN comenzi ON clienti.id = comenzi.client_id`?",
        "options": [
          "Returnează rândurile unde clienti.id = comenzi.client_id (clienți cu comenzi)",
          "Returnează toate rândurile din ambele tabele",
          "Returnează doar comenzile fără client",
          "Returnează un rând per tabelă"
        ],
        "answer": "Returnează rândurile unde clienti.id = comenzi.client_id (clienți cu comenzi)",
        "explanation": "INNER JOIN (scris simplu JOIN) returnează rândurile care au corespondent în ambele tabele.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "LEFT JOIN",
        "question": "Cum obții toți clienții inclusiv cei fără comenzi?",
        "options": [
          "SELECT c.*, o.* FROM clienti c LEFT JOIN comenzi o ON c.id = o.client_id;",
          "SELECT c.*, o.* FROM clienti c RIGHT JOIN comenzi o ON c.id = o.client_id;",
          "SELECT c.*, o.* FROM clienti c FULL JOIN comenzi o ON c.id = o.client_id;",
          "SELECT c.*, o.* FROM clienti c INNER JOIN comenzi o ON c.id = o.client_id;"
        ],
        "answer": "SELECT c.*, o.* FROM clienti c LEFT JOIN comenzi o ON c.id = o.client_id;",
        "explanation": "LEFT JOIN include toate rândurile din tabela stângă (clienti), cu NULL pentru coloanele din dreapta unde nu există corespondent.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "Clienți fără comenzi",
        "question": "Cum găsești clienții care NU au nicio comandă?",
        "options": [
          "SELECT c.* FROM clienti c LEFT JOIN comenzi o ON c.id=o.client_id WHERE o.id IS NULL;",
          "SELECT c.* FROM clienti c WHERE NOT EXISTS (SELECT * FROM comenzi);",
          "SELECT c.* FROM clienti c INNER JOIN comenzi o ON c.id=o.client_id WHERE o.id IS NULL;",
          "SELECT c.* FROM clienti c EXCEPT SELECT client_id FROM comenzi;"
        ],
        "answer": "SELECT c.* FROM clienti c LEFT JOIN comenzi o ON c.id=o.client_id WHERE o.id IS NULL;",
        "explanation": "LEFT JOIN cu WHERE o.id IS NULL găsește rândurile din stânga fără corespondent în dreapta.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "INNER vs LEFT JOIN",
        "question": "Câți clienți apar cu INNER JOIN dacă 2 din 10 nu au comenzi?",
        "options": [
          "8 clienți (cei cu comenzi)",
          "10 clienți (toți)",
          "2 clienți (cei fără comenzi)",
          "12 clienți (toți + duplicatele)"
        ],
        "answer": "8 clienți (cei cu comenzi)",
        "explanation": "INNER JOIN exclude rândurile fără corespondent. 2 clienți fără comenzi sunt excluși.",
        "difficulty": "easy"
      },
      {
        "number": 5,
        "name": "Aliasuri în JOIN",
        "question": "De ce se folosesc aliasuri (AS c, AS o) la JOIN?",
        "options": [
          "Scurtează codul și evită ambiguitatea când ambele tabele au coloana 'id'",
          "Sunt obligatorii la JOIN",
          "Îmbunătățesc performanța query-ului",
          "Redenumesc tabelele în baza de date"
        ],
        "answer": "Scurtează codul și evită ambiguitatea când ambele tabele au coloana 'id'",
        "explanation": "Aliasurile sunt opționale dar foarte utile: u.id e clar vs scris utilizatori.id de fiecare dată.",
        "difficulty": "easy"
      },
      {
        "number": 6,
        "name": "JOIN trei tabele",
        "question": "Cum obții numele utilizatorului și produsul pentru fiecare comandă?",
        "options": [
          "SELECT u.nume, p.nume FROM comenzi c JOIN utilizatori u ON c.user_id=u.id JOIN produse p ON c.produs_id=p.id;",
          "SELECT u.nume, p.nume FROM utilizatori u, produse p, comenzi c WHERE c.user_id=u.id OR c.produs_id=p.id;",
          "SELECT * FROM comenzi JOIN utilizatori JOIN produse;",
          "SELECT u.nume, p.nume FROM comenzi c DOUBLE JOIN (utilizatori u, produse p);"
        ],
        "answer": "SELECT u.nume, p.nume FROM comenzi c JOIN utilizatori u ON c.user_id=u.id JOIN produse p ON c.produs_id=p.id;",
        "explanation": "Înlănțuiești JOIN-urile. Primul JOIN adaugă utilizatori, al doilea adaugă produse.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "Self JOIN",
        "question": "La ce folosește SELF JOIN?",
        "options": [
          "Când o tabelă are relație cu ea însăși (ex: angajat → manager din aceeași tabelă)",
          "Când vrei să dublezi rândurile unei tabele",
          "Când tabela nu are relații externe",
          "Când tabela e prea mare pentru JOIN normal"
        ],
        "answer": "Când o tabelă are relație cu ea însăși (ex: angajat → manager din aceeași tabelă)",
        "explanation": "Self JOIN e un JOIN al tabelei cu ea însăși, util pentru ierarhii (manager-angajat, categorie-subcategorie).",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "ON vs WHERE în LEFT JOIN",
        "question": "Diferența: `LEFT JOIN comenzi o ON c.id=o.client_id AND o.data>'2024'` vs `LEFT JOIN comenzi o ON c.id=o.client_id WHERE o.data>'2024'`?",
        "options": [
          "Cu AND în ON: toți clienții apar (fără comenzi 2024 au NULL). Cu WHERE: clienții fără comenzi 2024 dispar",
          "Cu WHERE: toți clienții apar. Cu AND în ON: dispar cei fără comenzi",
          "Nu există diferență",
          "Cu AND în ON e eroare de sintaxă"
        ],
        "answer": "Cu AND în ON: toți clienții apar (fără comenzi 2024 au NULL). Cu WHERE: clienții fără comenzi 2024 dispar",
        "explanation": "WHERE după LEFT JOIN filtrează NULLurile, transformând efectiv LEFT JOIN în INNER JOIN.",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "CROSS JOIN",
        "question": "Câte rânduri returnează un CROSS JOIN între o tabelă cu 5 rânduri și una cu 3 rânduri?",
        "options": [
          "15 rânduri (5 × 3)",
          "8 rânduri (5 + 3)",
          "3 rânduri (minimul)",
          "5 rânduri (maximul)"
        ],
        "answer": "15 rânduri (5 × 3)",
        "explanation": "CROSS JOIN e produsul cartezian: fiecare rând din A combinat cu fiecare rând din B. 5×3=15.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "JOIN cu filtre",
        "question": "Cum obții comenzile din 2024 cu numele clientului?",
        "options": [
          "SELECT c.nume, o.total FROM clienti c JOIN comenzi o ON c.id=o.client_id WHERE YEAR(o.data)=2024;",
          "SELECT c.nume, o.total FROM clienti c JOIN comenzi o WHERE YEAR=2024 ON c.id=o.client_id;",
          "SELECT c.nume FROM clienti c JOIN (SELECT * FROM comenzi WHERE YEAR=2024) o;",
          "SELECT c.nume, o.total FROM clienti JOIN comenzi WHERE o.data=2024;"
        ],
        "answer": "SELECT c.nume, o.total FROM clienti c JOIN comenzi o ON c.id=o.client_id WHERE YEAR(o.data)=2024;",
        "explanation": "WHERE vine după ON, filtrând rezultatul JOIN-ului. YEAR() extrage anul din dată.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "Index pentru JOIN",
        "question": "De ce trebuie index pe `client_id` din tabela `comenzi`?",
        "options": [
          "Fără index, SQL face full scan al tabelei comenzi pentru fiecare client — extrem de lent pe date mari",
          "Index-urile sunt necesare pentru a defini relații",
          "Index-urile previn valorile duplicate în client_id",
          "Fără index JOIN-ul returnează rezultate greșite"
        ],
        "answer": "Fără index, SQL face full scan al tabelei comenzi pentru fiecare client — extrem de lent pe date mari",
        "explanation": "JOIN-ul caută rânduri după client_id. Fără index: scanează toată tabela pentru fiecare client.",
        "difficulty": "hard"
      },
      {
        "number": 12,
        "name": "NULL în JOIN",
        "question": "Ce se întâmplă cu rândurile unde `client_id IS NULL` la INNER JOIN?",
        "options": [
          "Sunt excluse — NULL nu satisface nicio condiție de egalitate",
          "Sunt incluse cu NULL în ambele tabele",
          "Provoacă eroare",
          "Sunt incluse cu valori din prima tabelă"
        ],
        "answer": "Sunt excluse — NULL nu satisface nicio condiție de egalitate",
        "explanation": "NULL = NULL returnează NULL (nu TRUE), deci rândurile cu client_id NULL sunt excluse din INNER JOIN.",
        "difficulty": "hard"
      },
      {
        "number": 13,
        "name": "FULL OUTER JOIN",
        "question": "Ce returnează FULL OUTER JOIN?",
        "options": [
          "Toate rândurile din ambele tabele, cu NULL unde nu există corespondent",
          "Rândurile comune din ambele tabele",
          "Rândurile din stânga plus rândurile fără corespondent din dreapta",
          "Rândurile din dreapta plus rândurile fără corespondent din stânga"
        ],
        "answer": "Toate rândurile din ambele tabele, cu NULL unde nu există corespondent",
        "explanation": "FULL OUTER JOIN = LEFT JOIN + RIGHT JOIN (fără duplicate). MySQL nu suportă nativ — se emulează cu UNION.",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "Raport cu JOIN",
        "question": "Cum calculezi totalul comenzilor per client, incluzând clienții cu 0 comenzi?",
        "options": [
          "SELECT c.nume, COUNT(o.id) AS nr, COALESCE(SUM(o.total), 0) AS total FROM clienti c LEFT JOIN comenzi o ON c.id=o.client_id GROUP BY c.id, c.nume;",
          "SELECT c.nume, COUNT(o.id) FROM clienti c INNER JOIN comenzi o ON c.id=o.client_id GROUP BY c.id;",
          "SELECT c.nume, SUM(o.total) FROM clienti c JOIN comenzi o ON c.id=o.client_id GROUP BY c.id;",
          "SELECT c.nume, COUNT(*) FROM clienti GROUP BY c.id LEFT JOIN comenzi;"
        ],
        "answer": "SELECT c.nume, COUNT(o.id) AS nr, COALESCE(SUM(o.total), 0) AS total FROM clienti c LEFT JOIN comenzi o ON c.id=o.client_id GROUP BY c.id, c.nume;",
        "explanation": "LEFT JOIN include clienții fără comenzi. COALESCE(SUM(o.total),0) transformă NULL în 0.",
        "difficulty": "hard"
      },
      {
        "number": 15,
        "name": "Proiect: factură",
        "question": "Query care generează o factură: client cu adresa, produsele cu prețul și cantitatea, subtotal per produs:",
        "options": [
          "SELECT u.nume, u.adresa, p.nume, c.cantitate, p.pret, c.cantitate*p.pret AS subtotal FROM comenzi c JOIN utilizatori u ON c.user_id=u.id JOIN produse p ON c.produs_id=p.id WHERE c.id=:id;",
          "SELECT * FROM comenzi JOIN utilizatori JOIN produse WHERE id=:id;",
          "SELECT factura FROM comenzi c, utilizatori u, produse p WHERE c.id=:id;",
          "JOIN comenzi WITH utilizatori AND produse WHERE c.id=:id SELECT *;"
        ],
        "answer": "SELECT u.nume, u.adresa, p.nume, c.cantitate, p.pret, c.cantitate*p.pret AS subtotal FROM comenzi c JOIN utilizatori u ON c.user_id=u.id JOIN produse p ON c.produs_id=p.id WHERE c.id=:id;",
        "explanation": "JOIN-uri multiple pentru a aduna toate datele necesare facturii dintr-o singură interogare.",
        "difficulty": "hard"
      }
    ]
  },
  {
    "slug": "sql-subqueries-cte",
    "title": "6. Subquery-uri + CTE",
    "order": 6,
    "theory": [
      {
        "order": 1,
        "title": "Tipuri de subquery-uri",
        "content": "Un subquery e un SELECT in interiorul altui SELECT. Il poti pune in WHERE, FROM sau SELECT.\n\n```sql\n-- Subquery in WHERE:\nSELECT * FROM produse\nWHERE pret > (SELECT AVG(pret) FROM produse);\n\n-- Subquery in FROM (tabela derivata):\nSELECT categorie, pret_mediu\nFROM (\n    SELECT categorie, AVG(pret) AS pret_mediu\n    FROM produse GROUP BY categorie\n) AS statistici\nWHERE pret_mediu > 500;\n\n-- Subquery scalar in SELECT:\nSELECT\n    nume,\n    pret,\n    (SELECT AVG(pret) FROM produse) AS medie_globala,\n    pret - (SELECT AVG(pret) FROM produse) AS diferenta\nFROM produse;\n\n-- EXISTS — verifici existenta, nu valoarea:\nSELECT * FROM clienti c\nWHERE EXISTS (\n    SELECT 1 FROM comenzi o WHERE o.client_id = c.id\n);\n-- EXISTS e mai eficient decat IN pe seturi mari!\n```"
      },
      {
        "order": 2,
        "title": "Subquery-uri corelate și NOT EXISTS",
        "content": "Un subquery corelat se refera la valori din query-ul exterior. Se executa o data per rand.\n\n```sql\n-- Angajatii cu salariul mai mare decat media departamentului:\nSELECT a.nume, a.salariu, a.departament\nFROM angajati a\nWHERE a.salariu > (\n    SELECT AVG(a2.salariu)\n    FROM angajati a2\n    WHERE a2.departament = a.departament -- refera randul exterior\n);\n\n-- Acelasi rezultat cu JOIN (mai eficient):\nSELECT a.nume, a.salariu, a.dept\nFROM angajati a\nJOIN (\n    SELECT dept, AVG(salariu) AS medie\n    FROM angajati GROUP BY dept\n) m ON a.dept = m.dept\nWHERE a.salariu > m.medie;\n\n-- NOT EXISTS — mai sigur decat NOT IN:\nSELECT * FROM produse p\nWHERE NOT EXISTS (\n    SELECT 1 FROM comenzi c WHERE c.produs_id = p.id\n);\n-- Produse niciodata comandate\n-- NOT EXISTS e corect chiar daca exista NULL-uri!\n```"
      },
      {
        "order": 3,
        "title": "CTE (WITH) — query-uri reutilizabile",
        "content": "CTE (Common Table Expression) e ca o variabila pentru un query. Il definesti cu WITH si il reutilizezi.\n\nAVANTAJE fata de subquery:\n- Mai lizibil (nu ai subquery-uri imbricate la infinit)\n- Poti reutiliza acelasi CTE de mai multe ori\n- Poti testa CTE-ul independent\n\n```sql\n-- CTE simplu:\nWITH clienti_activi AS (\n    SELECT id, nume, email\n    FROM clienti\n    WHERE activ = true\n      AND ultima_comanda > DATE_SUB(NOW(), INTERVAL 90 DAY)\n)\nSELECT * FROM clienti_activi;\n\n-- Mai multe CTE:\nWITH\nvanzari AS (\n    SELECT produs_id, SUM(cantitate) AS total_vandut\n    FROM comenzi WHERE YEAR(data) = 2024\n    GROUP BY produs_id\n),\npopulare AS (\n    SELECT p.*, v.total_vandut\n    FROM produse p JOIN vanzari v ON p.id = v.produs_id\n    WHERE v.total_vandut > 100\n)\nSELECT categorie, COUNT(*) AS nr_populare\nFROM populare GROUP BY categorie;\n```"
      },
      {
        "order": 4,
        "title": "CTE Recursiv — parcurgi ierarhii",
        "content": "CTE recursiv parcurge structuri arborescente: categorii/subcategorii, organigrama, BOM.\n\n```sql\nWITH RECURSIVE subordonati AS (\n    -- Baza recursiei (punctul de start):\n    SELECT id, nume, manager_id, 0 AS nivel\n    FROM angajati WHERE id = 1  -- CEO-ul\n\n    UNION ALL\n\n    -- Pasul recursiv:\n    SELECT a.id, a.nume, a.manager_id, s.nivel + 1\n    FROM angajati a\n    JOIN subordonati s ON a.manager_id = s.id\n    -- Se opreste cand nu mai gaseste randuri noi\n)\nSELECT * FROM subordonati ORDER BY nivel;\n\n-- Categorii cu subcategorii (oricate niveluri):\nWITH RECURSIVE cat_tree AS (\n    SELECT id, nume, parinte_id, 0 AS adancime\n    FROM categorii WHERE parinte_id IS NULL\n\n    UNION ALL\n\n    SELECT c.id, c.nume, c.parinte_id, ct.adancime+1\n    FROM categorii c\n    JOIN cat_tree ct ON c.parinte_id = ct.id\n)\nSELECT * FROM cat_tree ORDER BY adancime, nume;\n```"
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Subquery în WHERE",
        "question": "Cum găsești produsele cu prețul peste media globală?",
        "options": [
          "SELECT * FROM produse WHERE pret > (SELECT AVG(pret) FROM produse);",
          "SELECT * FROM produse WHERE pret > AVG(pret);",
          "SELECT * FROM produse HAVING pret > AVG(pret);",
          "SELECT * FROM produse WHERE pret > AVERAGE(produse.pret);"
        ],
        "answer": "SELECT * FROM produse WHERE pret > (SELECT AVG(pret) FROM produse);",
        "explanation": "AVG nu poate fi folosit direct în WHERE. Trebuie ca subquery.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "Tabelă derivată",
        "question": "Ce e o 'tabelă derivată'?",
        "options": [
          "Un subquery în FROM care produce un rezultat temporar folosit ca tabelă",
          "O tabelă creată din alta cu CREATE TABLE AS SELECT",
          "O VIEW salvată în baza de date",
          "O tabelă temporară creată cu TEMP TABLE"
        ],
        "answer": "Un subquery în FROM care produce un rezultat temporar folosit ca tabelă",
        "explanation": "Un subquery în FROM e o tabelă derivată — există doar în durata query-ului, nu e salvată.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "EXISTS vs IN eficiență",
        "question": "De ce EXISTS e mai eficient decât IN pe seturi mari?",
        "options": [
          "EXISTS se oprește la primul rând găsit; IN parcurge toate valorile din subquery",
          "EXISTS folosește indecși, IN nu",
          "IN face JOIN intern, EXISTS nu",
          "EXISTS e mai nou și optimizat în toate bazele de date"
        ],
        "answer": "EXISTS se oprește la primul rând găsit; IN parcurge toate valorile din subquery",
        "explanation": "EXISTS returnează TRUE la primul match și se oprește. IN colectează toate valorile din subquery și le compară.",
        "difficulty": "hard"
      },
      {
        "number": 4,
        "name": "NOT IN cu NULL",
        "question": "De ce `WHERE id NOT IN (1, NULL, 3)` nu returnează niciun rând?",
        "options": [
          "Comparația cu NULL returnează NULL, deci NOT IN e NULL pentru toate rândurile",
          "NULL înseamnă că tabela e goală",
          "NULL e tratat ca 0 în IN",
          "IN cu NULL e eroare de sintaxă"
        ],
        "answer": "Comparația cu NULL returnează NULL, deci NOT IN e NULL pentru toate rândurile",
        "explanation": "id NOT IN (1, NULL, 3) devine id!=1 AND id!=NULL AND id!=3. id!=NULL e mereu NULL. NULL AND anything = NULL. Niciun rând nu trece.",
        "difficulty": "hard"
      },
      {
        "number": 5,
        "name": "NOT EXISTS avantaj",
        "question": "Care e avantajul NOT EXISTS față de NOT IN pentru produse necomandante?",
        "options": [
          "NOT EXISTS e corect chiar dacă subquery-ul returnează NULL; NOT IN cu NULL returnează 0 rânduri",
          "NOT IN e mai rapid decât NOT EXISTS",
          "NOT EXISTS necesită mai puțin cod",
          "Sunt identice"
        ],
        "answer": "NOT EXISTS e corect chiar dacă subquery-ul returnează NULL; NOT IN cu NULL returnează 0 rânduri",
        "explanation": "NOT EXISTS nu are problema NULL. E pattern-ul preferat pentru verificarea absenței.",
        "difficulty": "hard"
      },
      {
        "number": 6,
        "name": "CTE sintaxă",
        "question": "Care este sintaxa corectă pentru un CTE?",
        "options": [
          "WITH cte_name AS (SELECT ...) SELECT * FROM cte_name;",
          "CREATE TEMP AS cte_name SELECT ...;",
          "DEFINE cte_name AS (SELECT ...); SELECT * FROM cte_name;",
          "WITH (SELECT ... AS cte_name) SELECT * FROM cte_name;"
        ],
        "answer": "WITH cte_name AS (SELECT ...) SELECT * FROM cte_name;",
        "explanation": "WITH cte_name AS (...) definește CTE-ul. Urmezi cu query-ul principal care îl folosește.",
        "difficulty": "easy"
      },
      {
        "number": 7,
        "name": "CTE vs subquery",
        "question": "Când preferi CTE față de subquery?",
        "options": [
          "Când ai nevoie să reutilizești același query de mai multe ori sau codul e complex",
          "Când performanța e critică — CTE e mereu mai rapid",
          "Când subquery-ul e în FROM",
          "CTE funcționează cu orice bază de date, subquery nu"
        ],
        "answer": "Când ai nevoie să reutilizești același query de mai multe ori sau codul e complex",
        "explanation": "CTE îmbunătățesc lizibilitatea și permit reutilizare. Performanța e similară în most databases.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "Subquery corelat execuție",
        "question": "Cât de des se execută un subquery corelat?",
        "options": [
          "O dată per rând din query-ul exterior",
          "O singură dată pentru tot query-ul",
          "De câte ori e nevoie, bazat pe cache",
          "Depinde de numărul de coloane"
        ],
        "answer": "O dată per rând din query-ul exterior",
        "explanation": "Subquery-ul corelat se referă la valori din rândul curent al query-ului exterior, deci rulează per rând.",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "CTE multiplu",
        "question": "Pot defini mai multe CTE cu WITH?",
        "options": [
          "Da: WITH cte1 AS (...), cte2 AS (...) SELECT ...",
          "Nu, trebuie câte un WITH per CTE",
          "Da, dar cel de-al doilea trebuie în subquery",
          "Da: WITH cte1 AS (...) WITH cte2 AS (...) SELECT ..."
        ],
        "answer": "Da: WITH cte1 AS (...), cte2 AS (...) SELECT ...",
        "explanation": "Poți defini oricâte CTE separate prin virgulă după WITH. Ultimul e urmat de query-ul principal.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "CTE recursiv bază",
        "question": "Ce are un CTE recursiv obligatoriu?",
        "options": [
          "O parte de bază (anchor) și o parte recursivă unite cu UNION ALL",
          "O condiție de oprire în WHERE",
          "Un index pe tabela parcursă",
          "O limită explicită a nivelurilor"
        ],
        "answer": "O parte de bază (anchor) și o parte recursivă unite cu UNION ALL",
        "explanation": "Baza (anchor) produce rândurile inițiale. Recursivul se aplică repetat până nu mai produce rânduri noi.",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "Scalar subquery eroare",
        "question": "Ce se întâmplă dacă un scalar subquery returnează mai mult de un rând?",
        "options": [
          "SQL aruncă eroare — scalar subquery trebuie să returneze exact 0 sau 1 rând",
          "Returnează primul rând",
          "Returnează NULL",
          "Returnează un array"
        ],
        "answer": "SQL aruncă eroare — scalar subquery trebuie să returneze exact 0 sau 1 rând",
        "explanation": "Un scalar subquery TREBUIE să returneze exact 0 sau 1 rând. Dacă returnează mai mult, SQL aruncă eroare.",
        "difficulty": "hard"
      },
      {
        "number": 12,
        "name": "CTE recursiv utilitate",
        "question": "Pentru ce e util CTE recursiv?",
        "options": [
          "Structuri arborescente: organigramă, categorii/subcategorii, comentarii imbricate",
          "Tabele foarte mari care necesită procesare în pași",
          "Query-uri cu multe JOIN-uri",
          "Calcule matematice iterative"
        ],
        "answer": "Structuri arborescente: organigramă, categorii/subcategorii, comentarii imbricate",
        "explanation": "CTE recursiv parcurge ierarhii. Fără el, ai nevoie de cod aplicativ sau proceduri stocate.",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Subquery vs JOIN performanță",
        "question": "Subquery corelat sau JOIN — care e mai eficient pe milioane de rânduri?",
        "options": [
          "JOIN e aproape mereu mai eficient — subquery corelat rulează per rând exterior",
          "Subquery corelat e mai eficient — evită tabelele temporare",
          "Depinde de optimizer, dar JOIN e preferabil",
          "Sunt identice ca performanță"
        ],
        "answer": "Depinde de optimizer, dar JOIN e preferabil",
        "explanation": "JOIN-urile beneficiază de indecși și optimizare. Subquery corelat rulează N ori. Prefer JOIN dar explainuiți ambele.",
        "difficulty": "hard"
      },
      {
        "number": 14,
        "name": "CTE testabilitate",
        "question": "Cum testezi un CTE înainte de a folosi rezultatul în query-ul principal?",
        "options": [
          "Scrii `WITH cte AS (...) SELECT * FROM cte;` și rulezi ca query separat",
          "Nu poți testa CTE izolat",
          "Creezi o VIEW temporară din CTE",
          "Folosești EXPLAIN pe CTE"
        ],
        "answer": "Scrii `WITH cte AS (...) SELECT * FROM cte;` și rulezi ca query separat",
        "explanation": "Poți rula CTE cu `SELECT * FROM cte` ca să-l inspectezi independent. E un avantaj mare față de subquery-uri imbricate.",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Proiect: raport ierarhic",
        "question": "Toți angajații dintr-o firmă cu nivelul lor în ierarhie (CEO = nivel 0):",
        "options": [
          "WITH RECURSIVE org AS (SELECT id,nume,0 AS nivel FROM ang WHERE manager_id IS NULL UNION ALL SELECT a.id,a.nume,o.nivel+1 FROM ang a JOIN org o ON a.manager_id=o.id) SELECT * FROM org ORDER BY nivel;",
          "SELECT * FROM angajati JOIN managers ON id=manager_id ORDER BY nivel;",
          "WITH org AS (SELECT * FROM angajati) SELECT nivel FROM org;",
          "RECURSIVE SELECT angajati HIERARCHY ORDER BY manager_id;"
        ],
        "answer": "WITH RECURSIVE org AS (SELECT id,nume,0 AS nivel FROM ang WHERE manager_id IS NULL UNION ALL SELECT a.id,a.nume,o.nivel+1 FROM ang a JOIN org o ON a.manager_id=o.id) SELECT * FROM org ORDER BY nivel;",
        "explanation": "CTE recursiv cu anchor (CEO fără manager) și pas recursiv (angajații subordonați). nivel+1 la fiecare nivel.",
        "difficulty": "hard"
      }
    ]
  },
  {
    "slug": "sql-create-table-design",
    "title": "7. CREATE TABLE și Design baze de date",
    "order": 7,
    "theory": [
      {
        "order": 1,
        "title": "CREATE TABLE și tipuri de date",
        "content": "CREATE TABLE defineste structura tabelei: coloanele, tipurile, constrangerile.\n\n```sql\nCREATE TABLE utilizatori (\n    id          INT           AUTO_INCREMENT PRIMARY KEY,\n    email       VARCHAR(255)  NOT NULL UNIQUE,\n    nume        VARCHAR(100)  NOT NULL,\n    parola_hash VARCHAR(255)  NOT NULL,\n    varsta      TINYINT       CHECK (varsta >= 18),\n    rol         ENUM('user','admin') DEFAULT 'user',\n    activ       BOOLEAN       DEFAULT true,\n    creat_la    DATETIME      DEFAULT CURRENT_TIMESTAMP\n);\n```\n\nTIPURI DE DATE — alege cu grija:\n```\nINT          → varste, cantitati, ID-uri\nBIGINT       → ID-uri pentru sisteme foarte mari\nDECIMAL(10,2)→ BANI! FLOAT/DOUBLE nu sunt exacte!\nVARCHAR(n)   → text variabil (email, nume)\nCHAR(n)      → text fix (cod tara 'RO', hash)\nTEXT         → continut lung (articole, descrieri)\nBOOLEAN      → true/false\nDATETIME     → data + ora exacta\nJSON         → structuri flexibile (settings)\n```"
      },
      {
        "order": 2,
        "title": "Relații: 1:1, 1:N, M:N",
        "content": "Designul relational se bazeaza pe 3 tipuri de relatii.\n\n1:N (cel mai comun) — un client, mai multe comenzi:\n```sql\nCREATE TABLE comenzi (\n    id         INT AUTO_INCREMENT PRIMARY KEY,\n    client_id  INT NOT NULL,\n    total      DECIMAL(10,2),\n    FOREIGN KEY (client_id) REFERENCES clienti(id)\n        ON DELETE CASCADE  -- daca stergi clientul, sterge si comenzile\n        ON UPDATE CASCADE  -- propagheaza schimbarile de PK\n);\n```\n\nM:N — un student poate lua mai multe cursuri, un curs are mai multi studenti:\n```sql\n-- Tabela pivot (junction table):\nCREATE TABLE inscrieri (\n    student_id INT NOT NULL,\n    curs_id    INT NOT NULL,\n    data_inscriere DATETIME DEFAULT CURRENT_TIMESTAMP,\n    nota       DECIMAL(4,2),\n    PRIMARY KEY (student_id, curs_id), -- cheie compusa\n    FOREIGN KEY (student_id) REFERENCES studenti(id),\n    FOREIGN KEY (curs_id)    REFERENCES cursuri(id)\n);\n-- Tabela pivot poate stoca si atribute ale relatiei (nota, data)\n```"
      },
      {
        "order": 3,
        "title": "Normalizare — 1NF, 2NF, 3NF",
        "content": "Normalizarea e procesul de organizare a tabelelor pentru a elimina redundanta.\n\n1NF — o celula = o singura valoare:\n```\nBAD:  id | telefoane\n      1  | 0724xxx, 0312xxx  (doua valori!)\n\nGOOD: id | telefon\n      1  | 0724xxx\n      1  | 0312xxx\n```\n\n2NF — fara dependente partiale (pentru chei compuse):\n```\nBAD:  student_id | curs_id | nota | titlu_curs\n(titlu_curs depinde DOAR de curs_id)\n\nGOOD: inscrieri: student_id, curs_id, nota\n      cursuri: curs_id, titlu_curs\n```\n\n3NF — fara dependente tranzitive:\n```\nBAD:  id | oras | cod_postal | tara\n(tara depinde de cod_postal, nu de id)\n\nGOOD: adrese: id, oras, cod_postal_id\n      coduri_postale: id, cod, tara\n```"
      },
      {
        "order": 4,
        "title": "INDEX-uri — faci query-urile rapide",
        "content": "Un index e ca index-ul dintr-o carte — in loc sa citesti totul, mergi direct la pagina corecta.\n\n```sql\n-- Index simplu:\nCREATE INDEX idx_produse_categorie ON produse(categorie);\n\n-- Index compus (ordinea conteaza!):\nCREATE INDEX idx_comenzi_user_data ON comenzi(user_id, data);\n-- Functioneaza pentru: WHERE user_id=1 sau WHERE user_id=1 AND data>...\n-- NU functioneaza: WHERE data>... (fara user_id)\n-- Regula leftmost prefix!\n\n-- EXPLAIN — verifici daca e folosit indexul:\nEXPLAIN SELECT * FROM produse WHERE categorie = 'electronics';\n-- type=ALL → full scan → ai nevoie de index\n-- type=ref → foloseste index → bine!\n```\n\nCAND ADAUGI INDEX: coloanele din WHERE frecvente, coloanele FK din JOIN, coloanele din ORDER BY.\n\nCAND NU ADAUGI: nu la orice coloana! INSERT/UPDATE/DELETE devin mai lente pentru ca indexul trebuie actualizat."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "AUTO_INCREMENT",
        "question": "Ce face `id INT AUTO_INCREMENT PRIMARY KEY`?",
        "options": [
          "Creează un ID care crește automat la fiecare INSERT și e cheie primară",
          "Creează un ID aleatoriu unic la fiecare INSERT",
          "Creează un ID incrementat manual de aplicație",
          "Creează o secvență de la 0 la infinit"
        ],
        "answer": "Creează un ID care crește automat la fiecare INSERT și e cheie primară",
        "explanation": "AUTO_INCREMENT (MySQL) sau SERIAL (PostgreSQL) generează automat un ID unic crescător la fiecare INSERT.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "DECIMAL vs FLOAT",
        "question": "De ce folosești DECIMAL(10,2) și nu FLOAT pentru prețuri?",
        "options": [
          "FLOAT are erori de precizie la calcule — DECIMAL e exact pentru valori monetare",
          "DECIMAL e mai rapid decât FLOAT",
          "FLOAT nu poate stoca valori cu 2 zecimale",
          "DECIMAL ocupă mai puțin spațiu"
        ],
        "answer": "FLOAT are erori de precizie la calcule — DECIMAL e exact pentru valori monetare",
        "explanation": "FLOAT/DOUBLE au erori binare: 0.1 + 0.2 = 0.30000000000000004. Pentru bani, DECIMAL e obligatoriu.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "FOREIGN KEY CASCADE",
        "question": "Ce face `ON DELETE CASCADE` pe un FOREIGN KEY?",
        "options": [
          "Când ștergi rândul din tabela referință, se șterg automat și rândurile din tabela cu FK",
          "Când ștergi rândul cu FK, se șterge automat și rândul referit",
          "Previne ștergerea dacă există FK-uri",
          "Setează FK la NULL la ștergere"
        ],
        "answer": "Când ștergi rândul din tabela referință, se șterg automat și rândurile din tabela cu FK",
        "explanation": "ON DELETE CASCADE: dacă ștergi clientul 1, toate comenzile lui sunt șterse automat.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "Relație M:N",
        "question": "Cum implementezi relația M:N între studenți și cursuri?",
        "options": [
          "Cu o tabelă pivot (inscrieri) cu FK la ambele tabele",
          "Cu o coloană JSON în studenți cu lista de cursuri",
          "Cu un array de cursuri_id în tabela studenți",
          "Cu două FK-uri în ambele tabele principale"
        ],
        "answer": "Cu o tabelă pivot (inscrieri) cu FK la ambele tabele",
        "explanation": "M:N necesită tabelă pivot (junction table) cu FK la ambele. Poate stoca și atribute ale relației.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "1NF",
        "question": "Ce problemă are coloana `telefoane VARCHAR(500)` cu valoarea '0724xxx, 0312xxx'?",
        "options": [
          "Violează 1NF — o celulă trebuie să conțină o singură valoare atomică",
          "Ocupă prea mult spațiu",
          "Nu se poate indexa",
          "E o problemă de securitate"
        ],
        "answer": "Violează 1NF — o celulă trebuie să conțină o singură valoare atomică",
        "explanation": "1NF cere valori atomice. O coloană cu liste separate prin virgulă e greu de interogat și indexat.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "Index simplu",
        "question": "Când creezi `CREATE INDEX idx_produse_cat ON produse(categorie)`?",
        "options": [
          "Când faci frecvent WHERE categorie = '...' și tabela are mii+ de rânduri",
          "La orice coloană din tabelă pentru siguranță",
          "Doar la coloanele UNIQUE",
          "Doar la PRIMARY KEY"
        ],
        "answer": "Când faci frecvent WHERE categorie = '...' și tabela are mii+ de rânduri",
        "explanation": "Index pe coloanele frecvent filtrate/sortate. Pe tabele mici indexul nu ajută.",
        "difficulty": "easy"
      },
      {
        "number": 7,
        "name": "Index compus — leftmost prefix",
        "question": "Index pe (user_id, data). Care query NU beneficiază de index?",
        "options": [
          "WHERE data = '2024-01-01' (fără user_id)",
          "WHERE user_id = 1 AND data = '2024-01-01'",
          "WHERE user_id = 1",
          "WHERE user_id IN (1, 2, 3)"
        ],
        "answer": "WHERE data = '2024-01-01' (fără user_id)",
        "explanation": "Regula leftmost prefix: index compus pe (A,B) funcționează pentru WHERE A... sau WHERE A AND B..., dar nu pentru WHERE B... singur.",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "EXPLAIN type=ALL",
        "question": "Ce înseamnă `type = ALL` în output-ul EXPLAIN?",
        "options": [
          "Full table scan — SQL citește fiecare rând, semn că lipsește un index",
          "Query-ul returnează toate coloanele",
          "Indexul acoperă toată tabela",
          "Query-ul folosește toate indexurile disponibile"
        ],
        "answer": "Full table scan — SQL citește fiecare rând, semn că lipsește un index",
        "explanation": "type=ALL în EXPLAIN = full scan = cel mai lent. Vrei type=ref, range, index sau const.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "DEFAULT TIMESTAMP",
        "question": "Ce face `creat_la DATETIME DEFAULT CURRENT_TIMESTAMP`?",
        "options": [
          "Setează automat data și ora curentă la INSERT dacă nu specifici o valoare",
          "Actualizează data la fiecare modificare a rândului",
          "Stochează timestamp-ul serverului la creare tabelă",
          "Necesită că INSERT să includă explicit NULL"
        ],
        "answer": "Setează automat data și ora curentă la INSERT dacă nu specifici o valoare",
        "explanation": "DEFAULT CURRENT_TIMESTAMP completează automat câmpul cu ora curentă la INSERT.",
        "difficulty": "easy"
      },
      {
        "number": 10,
        "name": "CHECK constraint",
        "question": "Ce face `varsta TINYINT CHECK (varsta >= 18)`?",
        "options": [
          "Previne inserarea valorilor mai mici de 18 — INSERT eșuează cu eroare",
          "Returnează un avertisment dar inserează oricum",
          "Returnează NULL pentru valorile sub 18",
          "Funcționează doar pe UPDATE, nu INSERT"
        ],
        "answer": "Previne inserarea valorilor mai mici de 18 — INSERT eșuează cu eroare",
        "explanation": "CHECK constraint validează datele la INSERT și UPDATE. Dacă condiția e falsă, operația eșuează.",
        "difficulty": "easy"
      },
      {
        "number": 11,
        "name": "2NF exemplu",
        "question": "Tabela (student_id, curs_id, nota, titlu_curs). Ce problemă are?",
        "options": [
          "Violează 2NF: titlu_curs depinde de curs_id singur, nu de (student_id, curs_id)",
          "Violează 1NF: cheia e compusă",
          "Violează 3NF: nota depinde de ambele chei",
          "Nu are probleme de normalizare"
        ],
        "answer": "Violează 2NF: titlu_curs depinde de curs_id singur, nu de (student_id, curs_id)",
        "explanation": "2NF: fiecare coloană non-cheie trebuie să depindă de ÎNTREAGA cheie primară. titlu_curs depinde doar de curs_id.",
        "difficulty": "hard"
      },
      {
        "number": 12,
        "name": "VARCHAR vs CHAR",
        "question": "Când folosești CHAR(n) față de VARCHAR(n)?",
        "options": [
          "CHAR pentru date cu lungime fixă (cod țară 'RO', hash); VARCHAR pentru lungime variabilă (email, nume)",
          "CHAR e mai rapid deci îl folosești mereu",
          "VARCHAR salvează spațiu deci îl folosești mereu",
          "CHAR pentru numere, VARCHAR pentru text"
        ],
        "answer": "CHAR pentru date cu lungime fixă (cod țară 'RO', hash); VARCHAR pentru lungime variabilă (email, nume)",
        "explanation": "CHAR(2) stochează exact 2 caractere. VARCHAR(255) stochează 0-255 caractere. CHAR e mai rapid pentru lungimi fixe.",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "ON UPDATE CASCADE",
        "question": "Ce se întâmplă cu comenzile la `ON UPDATE CASCADE` dacă schimbi ID-ul clientului?",
        "options": [
          "Toate comenzile clientului au client_id actualizat automat la noul ID",
          "Comenzile sunt șterse",
          "Operația e blocată",
          "client_id devine NULL în comenzi"
        ],
        "answer": "Toate comenzile clientului au client_id actualizat automat la noul ID",
        "explanation": "ON UPDATE CASCADE propagă modificările cheii primare în toate tabelele care referențiează cu FK.",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "Index și write performance",
        "question": "De ce adăugarea de indexuri la fiecare coloană poate fi dăunătoare?",
        "options": [
          "INSERT/UPDATE/DELETE devin mai lente pentru că fiecare index trebuie actualizat la modificare",
          "Indexurile fac SELECT-urile mai lente",
          "Baza de date devine coruptă cu prea mulți indexuri",
          "Indexurile funcționează doar pe PRIMARY KEY"
        ],
        "answer": "INSERT/UPDATE/DELETE devin mai lente pentru că fiecare index trebuie actualizat la modificare",
        "explanation": "Fiecare index = structură de date suplimentară care trebuie menținută la orice modificare. Indexează inteligent.",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Proiect: schema magazin",
        "question": "Câte tabele minim și ce relații are un magazin online complet (utilizatori, produse, comenzi, categorii)?",
        "options": [
          "6 tabele: utilizatori, produse, categorii, comenzi, detalii_comanda(pivot M:N), produse_categorii(pivot M:N)",
          "3 tabele: utilizatori, produse, comenzi cu toate datele în JSON",
          "2 tabele: users și orders cu toate produsele",
          "4 tabele fără tabele pivot"
        ],
        "answer": "6 tabele: utilizatori, produse, categorii, comenzi, detalii_comanda(pivot M:N), produse_categorii(pivot M:N)",
        "explanation": "Produse-Categorii e M:N. Comenzi-Produse e M:N (cu cantitate, preț unitar). Necesită tabele pivot.",
        "difficulty": "hard"
      }
    ]
  },
  {
    "slug": "sql-window-functions",
    "title": "8. Window Functions — calcule avansate",
    "order": 8,
    "theory": [
      {
        "order": 1,
        "title": "Ce sunt Window Functions",
        "content": "Window functions calculeaza valori pe un set de randuri fara sa le grupeze. Pastrezi toate randurile dar adaugi informatie agregata.\n\nDIFERENTA FATA DE GROUP BY:\n```sql\n-- GROUP BY comprima randurile:\nSELECT departament, AVG(salariu) FROM angajati GROUP BY departament;\n-- Returneaza 1 rand per departament\n\n-- WINDOW FUNCTION pastreaza toate randurile:\nSELECT\n    nume, salariu, departament,\n    AVG(salariu) OVER (PARTITION BY departament) AS medie_dept\nFROM angajati;\n-- Returneaza TOTI angajatii cu media departamentului adaugata!\n```\n\nSintaxa:\n```sql\nFUNCTIE() OVER (\n    PARTITION BY coloana  -- optional: imparte in grupuri\n    ORDER BY coloana      -- optional: ordinea in grup\n    ROWS/RANGE ...        -- optional: fereastra de calcul\n)\n```\n\nCele mai utile:\n```\nROW_NUMBER()  → numar rand unic (1, 2, 3...)\nRANK()        → rang cu salturi (1, 1, 3 ex-aequo)\nDENSE_RANK()  → rang fara salturi (1, 1, 2 ex-aequo)\nLAG(col)      → valoarea din randul anterior\nLEAD(col)     → valoarea din randul urmator\nSUM/AVG OVER  → suma/medie cumulativa\n```"
      },
      {
        "order": 2,
        "title": "ROW_NUMBER, RANK și DENSE_RANK",
        "content": "Aceste functii atribuie un numar fiecarui rand. Difera la ex-aequo.\n\n```sql\nSELECT\n    nume, salariu, departament,\n    ROW_NUMBER() OVER (ORDER BY salariu DESC) AS row_num,\n    RANK()       OVER (ORDER BY salariu DESC) AS rank,\n    DENSE_RANK() OVER (ORDER BY salariu DESC) AS dense_rank\nFROM angajati;\n```\n\nRezultat:\n```\nnume  | salariu | row_num | rank | dense_rank\nAna   |  5000   |    1    |   1  |     1\nIon   |  4500   |    2    |   2  |     2\nMaria |  4500   |    3    |   2  |     2   (ex-aequo)\nDan   |  3000   |    4    |   4  |     3   (RANK sare la 4, DENSE_RANK la 3)\n```\n\nTOP N per grup — pattern clasic de interviu:\n```sql\nWITH ranked AS (\n    SELECT *,\n        DENSE_RANK() OVER (\n            PARTITION BY departament\n            ORDER BY salariu DESC\n        ) AS rang\n    FROM angajati\n)\nSELECT * FROM ranked WHERE rang <= 2;\n-- Top 2 angajati per departament dupa salariu\n```"
      },
      {
        "order": 3,
        "title": "LAG și LEAD — compari rânduri consecutive",
        "content": "LAG si LEAD acceseaza date din alte randuri fara un self-JOIN.\n\nSCENARIU REAL: Cresterea zilnica a vanzarilor.\n\n```sql\nSELECT\n    data,\n    vanzari,\n    LAG(vanzari) OVER (ORDER BY data) AS vanzari_ziua_anterioara,\n    vanzari - LAG(vanzari) OVER (ORDER BY data) AS crestere,\n    ROUND(\n        (vanzari - LAG(vanzari) OVER (ORDER BY data)) * 100.0\n        / LAG(vanzari) OVER (ORDER BY data), 2\n    ) AS crestere_procent\nFROM vanzari_zilnice;\n\n-- LAG cu offset si valoare default:\nLAG(vanzari, 7) OVER (ORDER BY data)    -- acum 7 zile\nLAG(vanzari, 1, 0) OVER (ORDER BY data) -- ziua anterioara, 0 daca nu exista\n\n-- LEAD — valoarea din randul urmator:\nLEAD(vanzari) OVER (ORDER BY data) AS vanzari_maine\n```"
      },
      {
        "order": 4,
        "title": "SUM/AVG cu fereastra — agregate cumulative",
        "content": "Window functions cu agregare calculeaza sume/medii cumulative sau mobile.\n\n```sql\n-- Suma cumulativa (running total):\nSELECT\n    data, vanzari,\n    SUM(vanzari) OVER (ORDER BY data) AS total_cumulativ\nFROM vanzari_zilnice;\n\n-- Media mobila pe 7 zile:\nSELECT\n    data, vanzari,\n    AVG(vanzari) OVER (\n        ORDER BY data\n        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW\n    ) AS medie_7_zile\nFROM vanzari_zilnice;\n\n-- Procent din total:\nSELECT\n    produs, vanzari,\n    ROUND(vanzari * 100.0 / SUM(vanzari) OVER (), 2) AS procent\nFROM raport;\n-- OVER () fara PARTITION = fereastra e tot tabelul\n\n-- Total per categorie + total global simultan:\nSELECT\n    categorie, vanzari,\n    SUM(vanzari) OVER (PARTITION BY categorie) AS total_cat,\n    SUM(vanzari) OVER () AS total_global\nFROM raport;\n```"
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Window vs GROUP BY",
        "question": "Diferența principală între window functions și GROUP BY?",
        "options": [
          "Window functions păstrează toate rândurile; GROUP BY le comprimă la câte un rând per grup",
          "Window functions sunt mai lente decât GROUP BY",
          "GROUP BY poate calcula mai multe agregate, window functions una singură",
          "Nu există diferență funcțională"
        ],
        "answer": "Window functions păstrează toate rândurile; GROUP BY le comprimă la câte un rând per grup",
        "explanation": "Window function = adaugi informație agregată fără a pierde rânduri. GROUP BY = comprimi rândurile.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "PARTITION BY",
        "question": "Ce face `PARTITION BY departament` în OVER()?",
        "options": [
          "Împarte rândurile în grupuri per departament, calculul se face independent per grup",
          "Filtrează rândurile la un singur departament",
          "Sortează rândurile după departament",
          "Grupează și comprimă rândurile ca GROUP BY"
        ],
        "answer": "Împarte rândurile în grupuri per departament, calculul se face independent per grup",
        "explanation": "PARTITION BY e ca GROUP BY pentru window functions — definește fereastra de calcul, dar nu comprimă rândurile.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "ROW_NUMBER",
        "question": "Cum numerotezi rândurile unui SELECT în ordinea prețului descrescător?",
        "options": [
          "SELECT *, ROW_NUMBER() OVER (ORDER BY pret DESC) AS nr FROM produse;",
          "SELECT *, ROWNUM OVER pret DESC FROM produse;",
          "SELECT *, ROW_NUMBER(pret DESC) AS nr FROM produse;",
          "SELECT *, COUNT(*) AS nr FROM produse ORDER BY pret DESC;"
        ],
        "answer": "SELECT *, ROW_NUMBER() OVER (ORDER BY pret DESC) AS nr FROM produse;",
        "explanation": "ROW_NUMBER() OVER (ORDER BY col) atribuie numere 1,2,3... în ordinea specificată.",
        "difficulty": "easy"
      },
      {
        "number": 4,
        "name": "RANK vs DENSE_RANK",
        "question": "Dacă trei angajați au același salariu și sunt pe locul 2, ce returnează RANK vs DENSE_RANK?",
        "options": [
          "RANK returnează 2,2,2 și sare la 5; DENSE_RANK returnează 2,2,2 și continuă cu 3",
          "RANK returnează 2,3,4; DENSE_RANK returnează 2,2,2",
          "RANK și DENSE_RANK returnează același lucru",
          "RANK returnează 2,2,2; DENSE_RANK returnează 2,3,4"
        ],
        "answer": "RANK returnează 2,2,2 și sare la 5; DENSE_RANK returnează 2,2,2 și continuă cu 3",
        "explanation": "RANK sare numere după ex-aequo (1,2,2,2,5). DENSE_RANK nu sare (1,2,2,2,3). DENSE_RANK e preferat pentru top-N.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "Top N per grup",
        "question": "Cum obții top 3 produse per categorie după preț?",
        "options": [
          "WITH r AS (SELECT *, DENSE_RANK() OVER (PARTITION BY categorie ORDER BY pret DESC) AS rang FROM produse) SELECT * FROM r WHERE rang <= 3;",
          "SELECT * FROM produse WHERE pret > AVG(pret) GROUP BY categorie LIMIT 3;",
          "SELECT TOP 3 * FROM produse PARTITION BY categorie ORDER BY pret DESC;",
          "SELECT * FROM produse ORDER BY categorie, pret DESC LIMIT 3;"
        ],
        "answer": "WITH r AS (SELECT *, DENSE_RANK() OVER (PARTITION BY categorie ORDER BY pret DESC) AS rang FROM produse) SELECT * FROM r WHERE rang <= 3;",
        "explanation": "Pattern clasic: DENSE_RANK cu PARTITION BY categorie în CTE, apoi WHERE rang <= 3.",
        "difficulty": "hard"
      },
      {
        "number": 6,
        "name": "LAG primul rând",
        "question": "Ce returnează `LAG(vanzari) OVER (ORDER BY data)` pentru primul rând?",
        "options": [
          "NULL — nu există rând anterior",
          "0 — valoare default",
          "Valoarea celui mai mare rând",
          "Eroare"
        ],
        "answer": "NULL — nu există rând anterior",
        "explanation": "LAG pentru primul rând returnează NULL (nu există predecessor). Poți specifica un default: LAG(vanzari, 1, 0).",
        "difficulty": "easy"
      },
      {
        "number": 7,
        "name": "Creștere zilnică",
        "question": "Cum calculezi creșterea procentuală zilnică a vânzărilor?",
        "options": [
          "SELECT data, (vanzari-LAG(vanzari) OVER (ORDER BY data))*100.0/LAG(vanzari) OVER (ORDER BY data) AS crestere FROM vanzari;",
          "SELECT data, vanzari / LAG(vanzari) OVER () * 100 AS crestere FROM vanzari;",
          "SELECT data, PERCENT_CHANGE(vanzari) OVER (ORDER BY data) FROM vanzari;",
          "SELECT data, (vanzari - previous_day) * 100 FROM vanzari GROUP BY data;"
        ],
        "answer": "SELECT data, (vanzari-LAG(vanzari) OVER (ORDER BY data))*100.0/LAG(vanzari) OVER (ORDER BY data) AS crestere FROM vanzari;",
        "explanation": "LAG(vanzari) returnează vânzările de ieri. (azi - ieri) / ieri * 100 = procentul de creștere.",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "SUM cumulativ",
        "question": "Cum calculezi totalul cumulativ al vânzărilor pe zile?",
        "options": [
          "SELECT data, SUM(vanzari) OVER (ORDER BY data) AS total_cumulativ FROM vanzari;",
          "SELECT data, CUMSUM(vanzari) FROM vanzari ORDER BY data;",
          "SELECT data, SUM(vanzari) FROM vanzari GROUP BY data CUMULATIVE;",
          "SELECT data, SUM(vanzari) OVER () AS total FROM vanzari ORDER BY data;"
        ],
        "answer": "SELECT data, SUM(vanzari) OVER (ORDER BY data) AS total_cumulativ FROM vanzari;",
        "explanation": "SUM() OVER (ORDER BY data) fără ROWS = implicit UNBOUNDED PRECEDING TO CURRENT ROW = sumă cumulativă.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "OVER fără PARTITION",
        "question": "Ce fereastra calculezi cu `SUM(vanzari) OVER ()`?",
        "options": [
          "Suma totală globală din întreaga tabelă, aceeași pentru fiecare rând",
          "Suma cumulativă până la rândul curent",
          "Suma rândului curent",
          "Eroare — OVER() trebuie să aibă clauze"
        ],
        "answer": "Suma totală globală din întreaga tabelă, aceeași pentru fiecare rând",
        "explanation": "OVER() fără nimic = fereastra e toată tabela. Util pentru a calcula % din total: val/SUM(val) OVER().",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "Medie mobilă 7 zile",
        "question": "Ce face `AVG(vanzari) OVER (ORDER BY data ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)`?",
        "options": [
          "Calculează media vânzărilor din ultimele 7 zile (inclusiv ziua curentă)",
          "Calculează media vânzărilor din ultimele 6 zile (fără ziua curentă)",
          "Calculează media pe un interval de 7 zile fix din calendar",
          "Calculează media ultimelor 7 rânduri indiferent de dată"
        ],
        "answer": "Calculează media vânzărilor din ultimele 7 zile (inclusiv ziua curentă)",
        "explanation": "ROWS BETWEEN 6 PRECEDING AND CURRENT ROW = 6 rânduri înainte + rândul curent = 7 rânduri total.",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "LEAD",
        "question": "Cum afișezi vânzările de mâine lângă vânzările de azi?",
        "options": [
          "SELECT data, vanzari, LEAD(vanzari) OVER (ORDER BY data) AS maine FROM vanzari;",
          "SELECT data, vanzari, LAG(vanzari, -1) OVER (ORDER BY data) FROM vanzari;",
          "SELECT data, vanzari, NEXT(vanzari) FROM vanzari;",
          "SELECT data, vanzari, LEAD(1) OVER (ORDER BY data) FROM vanzari;"
        ],
        "answer": "SELECT data, vanzari, LEAD(vanzari) OVER (ORDER BY data) AS maine FROM vanzari;",
        "explanation": "LEAD(col) returnează valoarea din rândul URMĂTOR. LAG(col) din cel ANTERIOR.",
        "difficulty": "easy"
      },
      {
        "number": 12,
        "name": "NTILE",
        "question": "Ce face `NTILE(4) OVER (ORDER BY salariu)`?",
        "options": [
          "Împarte angajații în 4 grupe egale (quartile) după salariu",
          "Returnează 1/4 din totalul salariului",
          "Selectează fiecare al 4-lea angajat",
          "Rotunjește salariul la cel mai apropiat sfert"
        ],
        "answer": "Împarte angajații în 4 grupe egale (quartile) după salariu",
        "explanation": "NTILE(n) numerotează rândurile ca aparținând unuia din n grupuri egale. NTILE(4) = quartile.",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "FIRST_VALUE vs MAX",
        "question": "Cum obții salariul maxim din departament pentru fiecare angajat?",
        "options": [
          "Ambele sunt corecte: MAX(salariu) OVER (PARTITION BY dept) și FIRST_VALUE(salariu) OVER (PARTITION BY dept ORDER BY salariu DESC)",
          "Doar MAX(salariu) OVER (PARTITION BY dept) funcționează",
          "Doar FIRST_VALUE funcționează",
          "Niciuna nu funcționează — trebuie subquery"
        ],
        "answer": "Ambele sunt corecte: MAX(salariu) OVER (PARTITION BY dept) și FIRST_VALUE(salariu) OVER (PARTITION BY dept ORDER BY salariu DESC)",
        "explanation": "MAX(salariu) OVER (PARTITION BY dept) și FIRST_VALUE(salariu) OVER (PARTITION BY dept ORDER BY salariu DESC) returnează același rezultat.",
        "difficulty": "hard"
      },
      {
        "number": 14,
        "name": "Window pe JOIN",
        "question": "Poți folosi window functions pe rezultatul unui JOIN?",
        "options": [
          "Da — window functions se aplică pe rezultatul oricărui query valid",
          "Nu — window functions funcționează doar pe tabele simple",
          "Da, dar trebuie într-un subquery sau CTE",
          "Doar în PostgreSQL și SQL Server, nu MySQL"
        ],
        "answer": "Da — window functions se aplică pe rezultatul oricărui query valid",
        "explanation": "Window functions sunt clauze SELECT, deci se aplică pe orice set de rânduri rezultat din FROM/JOIN/WHERE.",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Proiect: raport vânzări complet",
        "question": "Raport cu: rank vânzări per produs, % din total, medie mobilă 7 zile, creștere față de ziua anterioară — toate într-un query:",
        "options": [
          "SELECT produs, vanzari, RANK() OVER (ORDER BY vanzari DESC) AS rank, vanzari*100/SUM(vanzari) OVER() AS pct, AVG(vanzari) OVER(ORDER BY data ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS avg7, vanzari-LAG(vanzari) OVER(ORDER BY data) AS delta FROM vanzari;",
          "SELECT * FROM vanzari WITH ANALYTICS;",
          "SELECT produs, RANK(vanzari), PERCENT(vanzari), MOVING_AVG(7), DELTA FROM vanzari;",
          "Necesită 4 query-uri separate cu JOIN la final"
        ],
        "answer": "SELECT produs, vanzari, RANK() OVER (ORDER BY vanzari DESC) AS rank, vanzari*100/SUM(vanzari) OVER() AS pct, AVG(vanzari) OVER(ORDER BY data ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS avg7, vanzari-LAG(vanzari) OVER(ORDER BY data) AS delta FROM vanzari;",
        "explanation": "Multiple window functions pot fi combinate în același SELECT — fiecare calculează independent pe fereastra sa.",
        "difficulty": "hard"
      }
    ]
  },
  {
    "slug": "sql-optimizare",
    "title": "9. Optimizare și întrebări de interviu",
    "order": 9,
    "theory": [
      {
        "order": 1,
        "title": "EXPLAIN — înțelegi cum rulează query-ul",
        "content": "EXPLAIN iti arata planul de executie. E instrumentul numarul 1 pentru optimizare.\n\n```sql\nEXPLAIN SELECT * FROM produse WHERE categorie = 'electronics';\n```\n\nColumnele importante:\n```\ntype     → tipul de acces (ALL=rau, ref/range/const=bine)\nkey      → indexul ales de optimizer\nrows     → estimarea nr de randuri scanate\n```\n\nSCALA (de la mai rau la mai bun):\n```\nALL    → full table scan — scaneza tot\nindex  → parcurge indexul\nrange  → interval din index\nref    → matching pe index non-unic\neq_ref → matching pe index unic\nconst  → matching pe PRIMARY KEY\n```\n\n```sql\n-- EXPLAIN ANALYZE (PostgreSQL) — timpi reali:\nEXPLAIN ANALYZE\nSELECT * FROM comenzi c JOIN clienti cl ON c.client_id = cl.id\nWHERE c.data > '2024-01-01';\n```"
      },
      {
        "order": 2,
        "title": "Anti-pattern-uri comune",
        "content": "Acestea sunt greselile frecvente care fac aplicatiile sa fie lente.\n\n1. SELECT * in productie:\n```sql\n-- BAD:\nSELECT * FROM articole;  -- transfera toate coloanele inclusiv cele mari\n\n-- GOOD:\nSELECT id, titlu, autor FROM articole;\n```\n\n2. Functie pe coloana indexata in WHERE:\n```sql\n-- BAD: indexul pe data NU e folosit!\nWHERE YEAR(data) = 2024\n\n-- GOOD: range scan pe index:\nWHERE data >= '2024-01-01' AND data < '2025-01-01'\n```\n\n3. Problema N+1:\n```\n// BAD:\nusers = SELECT * FROM users;  // 1 query\nfor each user:\n    orders = SELECT * FROM orders WHERE user_id = user.id;  // N queries\n// 1000 useri = 1001 queries!\n\n// GOOD:\nSELECT u.*, o.* FROM users u LEFT JOIN orders o ON u.id = o.user_id;\n// 1 singur query!\n```\n\n4. LIKE cu prefix wildcard:\n```sql\nWHERE nume LIKE '%smith'  -- full scan! Index nu e folosit\nWHERE nume LIKE 'smith%'  -- index e folosit! Cautare de prefix\n```"
      },
      {
        "order": 3,
        "title": "Întrebări clasice de interviu",
        "content": "Acestea sunt query-urile pe care le esti intrebat la orice interviu.\n\nAL 2-LEA CEL MAI MARE SALARIU:\n```sql\n-- Varianta 1: subquery\nSELECT MAX(salariu) FROM angajati\nWHERE salariu < (SELECT MAX(salariu) FROM angajati);\n\n-- Varianta 2: OFFSET\nSELECT DISTINCT salariu FROM angajati\nORDER BY salariu DESC LIMIT 1 OFFSET 1;\n\n-- Varianta 3: window function (cel mai flexibil)\nWITH ranked AS (\n    SELECT salariu, DENSE_RANK() OVER (ORDER BY salariu DESC) AS rang\n    FROM angajati\n)\nSELECT salariu FROM ranked WHERE rang = 2;\n```\n\nGASESTI DUPLICATE:\n```sql\nSELECT email, COUNT(*) AS aparitii\nFROM useri GROUP BY email\nHAVING COUNT(*) > 1;\n\n-- Sterge duplicate (pastreaza ID minim):\nDELETE FROM useri\nWHERE id NOT IN (SELECT MIN(id) FROM useri GROUP BY email);\n```\n\nANGAJATI PESTE MEDIA DEPARTAMENTULUI:\n```sql\nSELECT a.nume, a.salariu, a.dept\nFROM angajati a\nJOIN (SELECT dept, AVG(salariu) AS medie FROM angajati GROUP BY dept) m\n  ON a.dept = m.dept\nWHERE a.salariu > m.medie;\n```"
      },
      {
        "order": 4,
        "title": "VIEW, Materialized View și proceduri stocate",
        "content": "VIEW e un query salvat ca obiect. Il folosesti ca o tabela.\n\n```sql\n-- Creare VIEW:\nCREATE VIEW vw_clienti_activi AS\nSELECT id, nume, email\nFROM clienti\nWHERE activ = true\n  AND ultima_comanda > DATE_SUB(NOW(), INTERVAL 90 DAY);\n\nSELECT * FROM vw_clienti_activi WHERE email LIKE '%@gmail.com';\n\n-- VIEW nu stocheaza datele — ruleaza query-ul la fiecare acces!\n-- Avantaje: simplitate, securitate, abstractizare\n```\n\nMATERIALIZED VIEW (PostgreSQL):\n```sql\nCREATE MATERIALIZED VIEW mv_statistici AS\nSELECT MONTH(data) AS luna, SUM(total) AS vanzari\nFROM comenzi GROUP BY MONTH(data);\n\nREFRESH MATERIALIZED VIEW mv_statistici;\n-- Stocheaza fizic rezultatul! Rapid la citire dar necesita refresh\n-- Bun pentru rapoarte pe date istorice mari\n```\n\nPROCEDURA STOCATA:\n```sql\nCREATE PROCEDURE plaseaza_comanda(IN p_user INT, IN p_produs INT)\nBEGIN\n    START TRANSACTION;\n    UPDATE produse SET stoc = stoc - 1 WHERE id = p_produs;\n    INSERT INTO comenzi (user_id, produs_id) VALUES (p_user, p_produs);\n    COMMIT;\nEND;\n\nCALL plaseaza_comanda(1, 3);\n```"
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "EXPLAIN type=ALL",
        "question": "Ai `EXPLAIN SELECT * FROM comenzi WHERE data > '2024-01-01'` și type=ALL. Ce înseamnă?",
        "options": [
          "Full table scan — SQL citește fiecare rând din tabelă, lipsește index pe 'data'",
          "Query-ul returnează toate coloanele",
          "Query-ul folosește toate indexurile disponibile",
          "Tabela nu are date"
        ],
        "answer": "Full table scan — SQL citește fiecare rând din tabelă, lipsește index pe 'data'",
        "explanation": "type=ALL = full scan = cel mai lent. Adaugă CREATE INDEX idx_comenzi_data ON comenzi(data).",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "Funcție pe coloană indexată",
        "question": "De ce `WHERE YEAR(data) = 2024` e mai lent decât `WHERE data >= '2024-01-01' AND data < '2025-01-01'`?",
        "options": [
          "Prima varianta aplică funcția pe fiecare rând, invalidând indexul; a doua face range scan pe index",
          "Prima varianta e greșită sintactic",
          "A doua varianta face full scan, prima folosește index",
          "Nu există diferență de performanță"
        ],
        "answer": "Prima varianta aplică funcția pe fiecare rând, invalidând indexul; a doua face range scan pe index",
        "explanation": "YEAR(data) aplică funcția pe fiecare rând, indexul nu poate fi folosit. Range pe data directă folosește indexul.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "Problema N+1",
        "question": "Ce e problema N+1 la ORM-uri?",
        "options": [
          "Un query pentru lista de obiecte + N query-uri individuale pentru relații = N+1 total",
          "N query-uri care returnează 1 rând fiecare",
          "Un query cu N JOIN-uri",
          "N tranzacții cu câte 1 operație"
        ],
        "answer": "Un query pentru lista de obiecte + N query-uri individuale pentru relații = N+1 total",
        "explanation": "N+1 e una din cele mai comune probleme de performanță: încarci lista (1 query) și pentru fiecare element încarci relațiile (N queries).",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "Al 2-lea cel mai mare salariu",
        "question": "Care varianta găsește al 2-lea cel mai mare salariu?",
        "options": [
          "SELECT MAX(salariu) FROM angajati WHERE salariu < (SELECT MAX(salariu) FROM angajati);",
          "SELECT salariu FROM angajati ORDER BY salariu DESC LIMIT 1;",
          "SELECT SECOND_MAX(salariu) FROM angajati;",
          "SELECT salariu FROM angajati ORDER BY salariu LIMIT 2 OFFSET 1;"
        ],
        "answer": "SELECT MAX(salariu) FROM angajati WHERE salariu < (SELECT MAX(salariu) FROM angajati);",
        "explanation": "Subquery-ul găsește maximul global, outer query găsește maximul din rândurile mai mici.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "Găsire duplicate",
        "question": "Cum găsești emailurile care apar de mai mult de o dată?",
        "options": [
          "SELECT email, COUNT(*) FROM useri GROUP BY email HAVING COUNT(*) > 1;",
          "SELECT DISTINCT email FROM useri WHERE COUNT(*) > 1;",
          "SELECT email FROM useri WHERE email IN (SELECT email FROM useri);",
          "SELECT email FROM useri GROUP BY email WHERE COUNT > 1;"
        ],
        "answer": "SELECT email, COUNT(*) FROM useri GROUP BY email HAVING COUNT(*) > 1;",
        "explanation": "GROUP BY emailul, COUNT numără aparițiile, HAVING filtrează grupurile cu mai mult de 1 apariție.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "VIEW beneficii",
        "question": "Care NU e un beneficiu al VIEW-urilor?",
        "options": [
          "Îmbunătățesc performanța query-urilor complexe prin caching",
          "Simplifică query-uri complexe reutilizate frecvent",
          "Ascund coloane sensibile de anumiți utilizatori",
          "Oferă un nivel de abstractizare față de schimbările de schemă"
        ],
        "answer": "Îmbunătățesc performanța query-urilor complexe prin caching",
        "explanation": "VIEW-urile simple nu cachează rezultatele — rulează query-ul la fiecare acces. Materialized View cachează.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "Materialized View când",
        "question": "Când folosești Materialized View față de View normal?",
        "options": [
          "Când query-ul e scump și datele se schimbă rar — tolerezi date ușor vechi",
          "Mereu, pentru că e mai rapid",
          "Când tabela are mai puțin de 1 milion de rânduri",
          "Când vrei să ascunzi coloane"
        ],
        "answer": "Când query-ul e scump și datele se schimbă rar — tolerezi date ușor vechi",
        "explanation": "Materialized View stochează rezultatul fizic. Bun pentru rapoarte historice unde câteva minute de latență e acceptabilă.",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "SELECT * probleme",
        "question": "De ce evitați `SELECT *` în codul de producție?",
        "options": [
          "Transferi mai multă dată decât ai nevoie, coloanele mari sunt costisitoare, codul se poate rupe la modificări de schemă",
          "SQL Server nu suportă SELECT *",
          "SELECT * e mai lent la parsare",
          "SELECT * nu folosește indecși"
        ],
        "answer": "Transferi mai multă dată decât ai nevoie, coloanele mari sunt costisitoare, codul se poate rupe la modificări de schemă",
        "explanation": "SELECT * = transfer de date inutil, posibilă expunere de date sensibile, și dacă adaugi o coloană nouă codul tău s-ar putea rupe.",
        "difficulty": "easy"
      },
      {
        "number": 9,
        "name": "LIKE prefix wildcard",
        "question": "De ce `WHERE nume LIKE '%smith'` e mai lent decât `WHERE nume LIKE 'smith%'`?",
        "options": [
          "Prefix wildcard % la început dezactivează utilizarea indexului — trebuie full scan",
          "Nu există diferență",
          "LIKE cu prefix e mai rapid decât cu sufix",
          "Indexul B-tree funcționează bidirecțional"
        ],
        "answer": "Prefix wildcard % la început dezactivează utilizarea indexului — trebuie full scan",
        "explanation": "Indexul B-tree poate face căutare de prefix (smith%). Nu poate face căutare inversă (%smith) — necesită full scan.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "Soluție N+1",
        "question": "Cum rezolvi problema N+1 la încărcarea utilizatorilor cu comenzile lor?",
        "options": [
          "LEFT JOIN utilizatori u ON o.user_id = u.id într-un singur query",
          "Foreach user: câte un query SELECT * FROM orders WHERE user_id = ?",
          "SELECT * FROM orders WHERE user_id IN (SELECT id FROM users)",
          "Cache-uiești rezultatele fiecărui query individual"
        ],
        "answer": "LEFT JOIN utilizatori u ON o.user_id = u.id într-un singur query",
        "explanation": "Un JOIN aduce toate datele în un singur round-trip la baza de date. N query-uri = N round-trip-uri = lent.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "Angajați peste medie dept",
        "question": "Cel mai curat mod de a găsi angajații cu salariu peste media departamentului lor?",
        "options": [
          "WITH medii AS (SELECT dept, AVG(sal) m FROM ang GROUP BY dept) SELECT a.* FROM ang a JOIN medii ON a.dept=medii.dept WHERE a.sal > medii.m;",
          "SELECT * FROM ang WHERE sal > (SELECT AVG(sal) FROM ang);",
          "SELECT * FROM ang GROUP BY dept HAVING sal > AVG(sal);",
          "SELECT * FROM ang a1 WHERE sal > ALL (SELECT AVG(sal) FROM ang a2 GROUP BY dept);"
        ],
        "answer": "WITH medii AS (SELECT dept, AVG(sal) m FROM ang GROUP BY dept) SELECT a.* FROM ang a JOIN medii ON a.dept=medii.dept WHERE a.sal > medii.m;",
        "explanation": "CTE calculează media per departament, JOIN le combină, WHERE filtrează angajații sub media lor.",
        "difficulty": "hard"
      },
      {
        "number": 12,
        "name": "Procedură stocată avantaje",
        "question": "Care e avantajul principal al procedurilor stocate față de query-uri din aplicație?",
        "options": [
          "Logica rulează pe serverul DB (mai rapid), reduce traficul rețea, reutilizabilă din orice limbaj",
          "Sunt mai ușor de scris decât SQL direct",
          "Sunt mai sigure față de SQL injection",
          "Funcționează offline"
        ],
        "answer": "Logica rulează pe serverul DB (mai rapid), reduce traficul rețea, reutilizabilă din orice limbaj",
        "explanation": "Proceduri stocate: compilate și cachate pe server, un singur round-trip pentru operații complexe.",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Index selectivitate",
        "question": "Un index pe o coloană booleană (true/false) e util?",
        "options": [
          "Rar util — selectivitate scăzută: 50% din rânduri sunt true, optimizer preferă full scan",
          "Mereu util — orice coloană din WHERE beneficiază de index",
          "Util doar pentru coloane false",
          "Util dacă tabela are mai puțin de 1000 rânduri"
        ],
        "answer": "Rar util — selectivitate scăzută: 50% din rânduri sunt true, optimizer preferă full scan",
        "explanation": "Indexul e util când selectivitatea e mare (multe valori distincte). Pe boolean: full scan e mai rapid decât index + I/O random.",
        "difficulty": "hard"
      },
      {
        "number": 14,
        "name": "Query plan cache",
        "question": "Ce e query plan cache?",
        "options": [
          "Baza de date memorează planul de execuție compilat pentru query-uri repetate, evitând re-parsarea",
          "Cache-ul aplicației pentru rezultatele query-urilor",
          "Buffer de memorie pentru date des accesate",
          "Indexul pentru query-uri frecvente"
        ],
        "answer": "Baza de date memorează planul de execuție compilat pentru query-uri repetate, evitând re-parsarea",
        "explanation": "Plan cache = DB compilează query-ul o dată și reutilizează planul. Prepared statements beneficiază de plan cache.",
        "difficulty": "hard"
      },
      {
        "number": 15,
        "name": "Proiect: diagnoza performanță",
        "question": "Ai un query lent. Care e ordinea corectă de diagnoză?",
        "options": [
          "EXPLAIN → verifici type/key → adaugi index dacă lipsește → re-rulezi EXPLAIN → verifici îmbunătățirea",
          "Adaugi index pe toate coloanele din WHERE → rulezi query → verifici dacă e mai rapid",
          "Rescrii query-ul → optimizezi logica aplicației → adaugi index la final",
          "Pornești cu Materialized View → treci la index → la final EXPLAIN"
        ],
        "answer": "EXPLAIN → verifici type/key → adaugi index dacă lipsește → re-rulezi EXPLAIN → verifici îmbunătățirea",
        "explanation": "EXPLAIN mai întâi, înțelegi problema, adaugi indexul corect, verifici că s-a rezolvat. Nu adaugi indexuri la orb.",
        "difficulty": "hard"
      }
    ]
  }
];

module.exports = { sqlLessons };
