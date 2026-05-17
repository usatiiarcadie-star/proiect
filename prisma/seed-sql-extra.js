const sqlExtra = [
  {
    "slug": "sql-postgres-mysql-sqlite",
    "title": "21. PostgreSQL vs MySQL vs SQLite",
    "order": 21,
    "theory": [
      {
        "order": 1,
        "title": "Comparatie generala si use cases",
        "content": "Cele trei sisteme de baze de date relationale au filosofii, forturi si slabiciuni diferite.\n\nSQLite:\n- Fisier unic pe disc (nu server separat)\n- Zero configuratie, embedded in aplicatie\n- Use cases: aplicatii mobile, desktop, prototipuri, teste, browsere (Chrome foloseste SQLite intern)\n- Limitari: un singur writer la un moment dat, fara user management\n\nMySQL:\n- Server dedicat, multi-user, battle-tested\n- Cel mai popular pentru web (LAMP stack)\n- Use cases: aplicatii web, CMS (WordPress), SaaS mediu\n- Motoare: InnoDB (tranzactii, FK), MyISAM (legacy, fara FK)\n- Owned de Oracle, versiune community vs enterprise\n\nPostgreSQL:\n- Open-source 100%, cel mai conform cu standardul SQL\n- Tip system avansat, extensibil, JSONB, full-text search nativ\n- Use cases: aplicatii complexe, date geospatiale (PostGIS), analytics, FinTech\n- Suporta: arrays, JSONB, enum types, inheritance, window functions avansate\n\n```sql\n-- SQLite: tipuri flexibile\nCREATE TABLE test (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  data TEXT  -- SQLite accepta orice valoare in orice coloana (type affinity)\n);\n\n-- MySQL:\nCREATE TABLE test (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  data VARCHAR(255) NOT NULL\n) ENGINE=InnoDB;\n\n-- PostgreSQL:\nCREATE TABLE test (\n  id SERIAL PRIMARY KEY,         -- sau GENERATED ALWAYS AS IDENTITY\n  data VARCHAR(255) NOT NULL,\n  tags TEXT[],                   -- Array nativ!\n  meta JSONB                     -- JSON binar indexabil\n);\n```\n\nLA INTERVIU: Cand alegi PostgreSQL fata de MySQL? PostgreSQL pentru query-uri complexe, JSON avansat, conformitate SQL, full-text search. MySQL pentru ecosistem mai larg, hosting shared mai ieftin."
      },
      {
        "order": 2,
        "title": "Sintaxa specifica — diferente practice",
        "content": "Diferente de sintaxa care te vor prinde la interviu sau la migrari.\n\n```sql\n-- AUTO INCREMENT:\n-- MySQL:\nCREATE TABLE produse (\n  id INT AUTO_INCREMENT PRIMARY KEY\n);\n\n-- PostgreSQL (3 moduri):\nCREATE TABLE produse (\n  id SERIAL PRIMARY KEY\n);\n-- sau modern:\nCREATE TABLE produse (\n  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY\n);\n\n-- SQLite:\nCREATE TABLE produse (\n  id INTEGER PRIMARY KEY  -- AUTOINCREMENT implicit pentru INTEGER PRIMARY KEY\n);\n\n-- LIMIT si OFFSET:\n-- MySQL + PostgreSQL + SQLite: identice\nSELECT * FROM produse LIMIT 10 OFFSET 20;\n\n-- String concatenare:\n-- MySQL: CONCAT()\nSELECT CONCAT(prenume, ' ', nume) FROM utilizatori;\n\n-- PostgreSQL: operator ||\nSELECT prenume || ' ' || nume FROM utilizatori;\n-- sau CONCAT() (suportat si in PostgreSQL 9.1+)\n\n-- SQLite: operator ||\nSELECT prenume || ' ' || nume FROM utilizatori;\n\n-- Formatare data:\n-- MySQL:\nSELECT DATE_FORMAT(created_at, '%Y-%m-%d') FROM comenzi;\nSELECT NOW(), CURDATE(), DATE_ADD(NOW(), INTERVAL 7 DAY);\n\n-- PostgreSQL:\nSELECT TO_CHAR(created_at, 'YYYY-MM-DD') FROM comenzi;\nSELECT NOW(), CURRENT_DATE, NOW() + INTERVAL '7 days';\n\n-- SQLite:\nSELECT strftime('%Y-%m-%d', created_at) FROM comenzi;\nSELECT datetime('now'), date('now', '+7 days');\n\n-- UPSERT:\n-- MySQL:\nINSERT INTO setari (cheie, valoare) VALUES ('tema', 'dark')\nON DUPLICATE KEY UPDATE valoare = VALUES(valoare);\n\n-- PostgreSQL:\nINSERT INTO setari (cheie, valoare) VALUES ('tema', 'dark')\nON CONFLICT (cheie) DO UPDATE SET valoare = EXCLUDED.valoare;\n\n-- SQLite:\nINSERT OR REPLACE INTO setari (cheie, valoare) VALUES ('tema', 'dark');\n```"
      },
      {
        "order": 3,
        "title": "Tipuri de date specifice",
        "content": "Fiecare sistem are tipuri de date unice si diferente de comportament.\n\n```sql\n-- BOOLEAN:\n-- MySQL: TINYINT(1) sau BOOLEAN (alias)\nCREATE TABLE produse (activ TINYINT(1) DEFAULT 1);\nSELECT * FROM produse WHERE activ = 1; -- sau TRUE\n\n-- PostgreSQL: BOOLEAN nativ\nCREATE TABLE produse (activ BOOLEAN DEFAULT TRUE);\nSELECT * FROM produse WHERE activ = TRUE; -- sau activ IS TRUE\n\n-- SQLite: INTEGER (0/1) — nu are BOOLEAN nativ\nCREATE TABLE produse (activ INTEGER DEFAULT 1);\n\n-- JSON:\n-- MySQL 5.7+: coloana JSON\nCREATE TABLE produse (\n  id INT PRIMARY KEY,\n  meta JSON\n);\nSELECT meta->>'$.culoare' FROM produse;  -- MySQL\nSELECT JSON_EXTRACT(meta, '$.culoare') FROM produse;\nSELECT JSON_VALUE(meta, '$.pret') FROM produse;\n\n-- PostgreSQL: JSON si JSONB (binar, indexabil)\nCREATE TABLE produse (\n  id SERIAL PRIMARY KEY,\n  meta JSONB  -- Preferat: indexabil, validat, stocat eficient\n);\nSELECT meta->>'culoare' FROM produse;    -- text\nSELECT meta->'specificatii'->>'cpu' FROM produse;  -- nested\nSELECT * FROM produse WHERE meta @> '{\"disponibil\": true}'::jsonb;  -- containment\n\n-- UUID:\n-- MySQL 8+:\nCREATE TABLE sesiuni (\n  id CHAR(36) DEFAULT (UUID()) PRIMARY KEY\n);\n\n-- PostgreSQL:\nCREATE EXTENSION IF NOT EXISTS pgcrypto;\nCREATE TABLE sesiuni (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY\n);\n\n-- ENUM:\n-- MySQL:\nCREATE TABLE comenzi (\n  status ENUM('pending', 'processing', 'shipped', 'delivered') DEFAULT 'pending'\n);\n\n-- PostgreSQL:\nCREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered');\nCREATE TABLE comenzi (status order_status DEFAULT 'pending');\nALTER TYPE order_status ADD VALUE 'cancelled'; -- Adauga valori\n```"
      },
      {
        "order": 4,
        "title": "Performanta si configurare — diferente de productie",
        "content": "Diferente importante de configurare si comportament la productie.\n\n```sql\n-- EXPLAIN (analiza query):\n-- MySQL:\nEXPLAIN SELECT * FROM comenzi WHERE user_id = 42;\nEXPLAIN FORMAT=JSON SELECT * FROM comenzi WHERE user_id = 42;\nEXPLAIN ANALYZE SELECT * FROM comenzi WHERE user_id = 42; -- MySQL 8+\n\n-- PostgreSQL (mai detaliat):\nEXPLAIN SELECT * FROM comenzi WHERE user_id = 42;\nEXPLAIN ANALYZE SELECT * FROM comenzi WHERE user_id = 42;  -- Executa si masoara\nEXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT * FROM comenzi WHERE user_id = 42;\n\n-- Case sensitivity:\n-- MySQL: case-insensitive by default pentru string comparisons (collation latin1_swedish_ci)\n-- PostgreSQL: case-sensitive by default\n\n-- MySQL:\nSELECT * FROM utilizatori WHERE email = 'ION@TEST.COM';  -- Gaseste 'ion@test.com'\n\n-- PostgreSQL:\nSELECT * FROM utilizatori WHERE email = 'ION@TEST.COM';  -- NU gaseste (case-sensitive!)\nSELECT * FROM utilizatori WHERE LOWER(email) = LOWER('ION@TEST.COM');  -- Corect\nSELECT * FROM utilizatori WHERE email ILIKE 'ion@test.com';  -- ILIKE = case-insensitive LIKE\n\n-- Transactions default:\n-- MySQL (InnoDB): autocommit = ON\nSHOW VARIABLES LIKE 'autocommit';\n\n-- PostgreSQL: autocommit de facto (fiecare statement intr-o tranzactie implicita)\nSHOW autocommit; -- Nu exista variabila, e comportament intern\n\n-- Connection string:\n-- MySQL: mysql://user:pass@localhost:3306/dbname\n-- PostgreSQL: postgresql://user:pass@localhost:5432/dbname\n-- SQLite: ./database.db (cale fisier)\n\n-- Full Text Search nativ:\n-- MySQL:\nCREATE FULLTEXT INDEX idx_ft ON articole(titlu, continut);\nSELECT *, MATCH(titlu, continut) AGAINST('react hooks' IN NATURAL LANGUAGE MODE) AS relevanta\nFROM articole\nWHERE MATCH(titlu, continut) AGAINST('react hooks' IN NATURAL LANGUAGE MODE)\nORDER BY relevanta DESC;\n\n-- PostgreSQL:\nALTER TABLE articole ADD COLUMN search_vector TSVECTOR;\nUPDATE articole SET search_vector = to_tsvector('romanian', titlu || ' ' || continut);\nCREATE INDEX idx_ft ON articole USING GIN(search_vector);\nSELECT * FROM articole\nWHERE search_vector @@ to_tsquery('romanian', 'react & hooks')\nORDER BY ts_rank(search_vector, to_tsquery('react & hooks')) DESC;\n```\n\nLA INTERVIU: SQLite pentru productie? Da, pentru aplicatii read-heavy sau embedded (ex: Litestream pentru replicare). NU pentru multi-user write-heavy."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "SQLite use case",
        "question": "Care este cel mai potrivit use case pentru SQLite in productie?",
        "options": [
          "Server web cu 1000 utilizatori concurenti",
          "Aplicatie mobila, embedded, sau baza de date read-heavy cu un singur writer",
          "Data warehouse",
          "Aplicatie financiara cu tranzactii complexe"
        ],
        "answer": "Aplicatie mobila, embedded, sau baza de date read-heavy cu un singur writer",
        "explanation": "SQLite e perfect pentru mobile (React Native, Flutter), brows, IoT. Multi-writer concurrent = MySQL sau PostgreSQL.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "AUTO_INCREMENT vs SERIAL",
        "question": "Echivalentul MySQL AUTO_INCREMENT in PostgreSQL este?",
        "options": [
          "AUTO_INCREMENT",
          "SERIAL sau GENERATED ALWAYS AS IDENTITY",
          "AUTOINCREMENT",
          "INCREMENT"
        ],
        "answer": "SERIAL sau GENERATED ALWAYS AS IDENTITY",
        "explanation": "SERIAL = alias pentru INTEGER + sequence. GENERATED ALWAYS AS IDENTITY e standardul SQL modern, preferat.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "JSONB vs JSON PostgreSQL",
        "question": "Diferenta JSONB vs JSON in PostgreSQL?",
        "options": [
          "Identice",
          "JSONB: stocat binar, indexabil cu GIN, mai rapid la query. JSON: stocat ca text, mai rapid la insert",
          "JSON e mai nou",
          "JSONB nu suporta arrays"
        ],
        "answer": "JSONB: stocat binar, indexabil cu GIN, mai rapid la query. JSON: stocat ca text, mai rapid la insert",
        "explanation": "In practica, foloseste intotdeauna JSONB. Indexarea cu GIN e critica pentru query-uri pe date JSON.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "ON CONFLICT PostgreSQL",
        "question": "Sintaxa PostgreSQL pentru UPSERT (insert sau update daca exista)?",
        "options": [
          "ON DUPLICATE KEY UPDATE",
          "ON CONFLICT (col) DO UPDATE SET col = EXCLUDED.col",
          "INSERT OR REPLACE",
          "MERGE INTO"
        ],
        "answer": "ON CONFLICT (col) DO UPDATE SET col = EXCLUDED.col",
        "explanation": "EXCLUDED refera valorile care ar fi fost inserate. ON CONFLICT ... DO NOTHING ignora conflictul.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "Case sensitivity PostgreSQL",
        "question": "In PostgreSQL, comparatia WHERE email = 'ION@test.com' gaseste 'ion@test.com'?",
        "options": [
          "Da, PostgreSQL e case-insensitive",
          "Nu, PostgreSQL e case-sensitive by default — foloseste ILIKE sau LOWER()",
          "Depinde de versiune",
          "Da, daca ai index"
        ],
        "answer": "Nu, PostgreSQL e case-sensitive by default — foloseste ILIKE sau LOWER()",
        "explanation": "MySQL: case-insensitive default. PostgreSQL: case-sensitive. ILIKE = case-insensitive LIKE in PostgreSQL.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "EXPLAIN ANALYZE",
        "question": "Diferenta dintre EXPLAIN si EXPLAIN ANALYZE in PostgreSQL?",
        "options": [
          "Identice",
          "EXPLAIN: plan estimat fara executie. EXPLAIN ANALYZE: executa query si masoara timpi reali",
          "ANALYZE e mai rapid",
          "EXPLAIN ANALYZE sterge date"
        ],
        "answer": "EXPLAIN: plan estimat fara executie. EXPLAIN ANALYZE: executa query si masoara timpi reali",
        "explanation": "EXPLAIN ANALYZE e esential pentru optimizare — vezi diferenta estimated vs actual rows. Evita pe productie la DELETE/UPDATE.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "SQLite AUTOINCREMENT",
        "question": "In SQLite, INTEGER PRIMARY KEY face autoincrement automat?",
        "options": [
          "Nu, trebuie AUTOINCREMENT explicit",
          "Da, INTEGER PRIMARY KEY = rowid automat incrementat",
          "Nu, trebuie SERIAL",
          "Depinde de versiune"
        ],
        "answer": "Da, INTEGER PRIMARY KEY = rowid automat incrementat",
        "explanation": "SQLite: INTEGER PRIMARY KEY e alias pentru rowid. AUTOINCREMENT explicit previne reutilizarea ID-urilor sterse.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "ENUM PostgreSQL",
        "question": "Cum adaugi o valoare noua la un ENUM existent in PostgreSQL?",
        "options": [
          "ALTER TABLE ... MODIFY COLUMN",
          "ALTER TYPE nume_enum ADD VALUE 'noua_valoare'",
          "DROP si recreezi",
          "Nu se poate"
        ],
        "answer": "ALTER TYPE nume_enum ADD VALUE 'noua_valoare'",
        "explanation": "ALTER TYPE e unica metoda. Nu poti sterge valori din ENUM fara DROP/RECREATE.",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "Connection string",
        "question": "Care este formatul connection string pentru PostgreSQL?",
        "options": [
          "mysql://user:pass@host/db",
          "postgresql://user:pass@host:5432/dbname",
          "pg://user:pass@host/db",
          "db://postgres:5432/name"
        ],
        "answer": "postgresql://user:pass@host:5432/dbname",
        "explanation": "Port default PostgreSQL: 5432. MySQL: 3306. SQLite: cale fisier. Prisma foloseste aceeasi conventie.",
        "difficulty": "easy"
      },
      {
        "number": 10,
        "name": "FTS MySQL",
        "question": "Ce index este necesar pentru MATCH ... AGAINST in MySQL?",
        "options": [
          "INDEX normal",
          "FULLTEXT INDEX pe coloanele de tip text",
          "UNIQUE INDEX",
          "PRIMARY KEY"
        ],
        "answer": "FULLTEXT INDEX pe coloanele de tip text",
        "explanation": "CREATE FULLTEXT INDEX idx ON tabela(col1, col2) — necesar pentru MATCH AGAINST. Functioneaza pe MyISAM si InnoDB.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "Coding: UPSERT comparatie",
        "question": "Scrie acelasi UPSERT (insert user sau update email daca username exista) in MySQL si PostgreSQL.",
        "options": [],
        "answer": "",
        "explanation": "MySQL: ON DUPLICATE KEY UPDATE. PostgreSQL: ON CONFLICT (username) DO UPDATE SET email = EXCLUDED.email.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Coding: JSONB query",
        "question": "In PostgreSQL, selecteaza produsele unde meta->>'culoare' = 'rosu' si meta contine {'disponibil': true}.",
        "options": [],
        "answer": "",
        "explanation": "meta->>'cheie' pentru text extraction. meta @> '{...}'::jsonb pentru containment check.",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Coding: date format cross-DB",
        "question": "Selecteaza comenzile din luna curenta, formatand data ca 'YYYY-MM'. Scrie versiunile MySQL, PostgreSQL si SQLite.",
        "options": [],
        "answer": "",
        "explanation": "MySQL: DATE_FORMAT. PostgreSQL: TO_CHAR. SQLite: strftime. Conditia luna curenta difera de asemenea.",
        "difficulty": "hard"
      },
      {
        "number": 14,
        "name": "PostgreSQL array",
        "question": "In PostgreSQL, cum selectezi utilizatorii care au 'admin' in coloana roles TEXT[]?",
        "options": [
          "WHERE roles = 'admin'",
          "WHERE 'admin' = ANY(roles)",
          "WHERE roles CONTAINS 'admin'",
          "WHERE roles LIKE '%admin%'"
        ],
        "answer": "WHERE 'admin' = ANY(roles)",
        "explanation": "ANY(array) verifica daca valoarea exista in array. Alternativ: WHERE roles @> ARRAY['admin'].",
        "difficulty": "hard"
      },
      {
        "number": 15,
        "name": "SQLite productie cu Litestream",
        "question": "Ce este Litestream si cand il folosesti cu SQLite?",
        "options": [
          "Extension SQLite",
          "Tool de replicare continua SQLite la S3/cloud — permite SQLite in productie cu backup",
          "Connection pooler",
          "ORM pentru SQLite"
        ],
        "answer": "Tool de replicare continua SQLite la S3/cloud — permite SQLite in productie cu backup",
        "explanation": "Litestream repliceaza WAL-ul SQLite in timp real la S3. Disaster recovery < 1 minut. Folosit de companii mici pentru simplitate.",
        "difficulty": "hard"
      }
    ]
  },
  {
    "slug": "sql-indexuri-avansate",
    "title": "22. Indexuri avansate",
    "order": 22,
    "theory": [
      {
        "order": 1,
        "title": "Composite Index — ordinea conteaza",
        "content": "Un index compus pe mai multe coloane are reguli stricte despre cand e folosit.\n\n```sql\n-- Index compus:\nCREATE INDEX idx_user_status_date\nON comenzi(user_id, status, created_at);\n\n-- FOLOSIT (respecta leftmost prefix):\nSELECT * FROM comenzi WHERE user_id = 1;\nSELECT * FROM comenzi WHERE user_id = 1 AND status = 'livrat';\nSELECT * FROM comenzi WHERE user_id = 1 AND status = 'livrat' AND created_at > '2024-01-01';\n\n-- NEFOLOSIT (nu incepe cu prima coloana):\nSELECT * FROM comenzi WHERE status = 'livrat';  -- Nu e leftmost!\nSELECT * FROM comenzi WHERE created_at > '2024-01-01';  -- Nu e leftmost!\n\n-- PARTIAL FOLOSIT (pana la primul range/skip):\nSELECT * FROM comenzi WHERE user_id = 1 AND created_at > '2024-01-01';\n-- Foloseste indexul pe user_id, dar NU pe created_at (status e sarit)\n\n-- REGULA: Plasati coloanele cu cardinalitate mare la inceput:\nCREATE INDEX idx_bun ON comenzi(user_id, status);\n-- user_id: multi valori unice => cardinalitate mare\n-- status: putine valori (pending/done/etc) => cardinalitate mica\n\n-- Exemplu e-commerce — index pentru pagina produse cu filtru si sortare:\nCREATE INDEX idx_products ON produse(categorie_id, pret, creat_la);\n-- Query: WHERE categorie_id = 5 ORDER BY pret\n-- Index folosit: categorie_id pentru filter, pret pentru ORDER (evita filesort)\n```\n\nLA INTERVIU: Ce e leftmost prefix rule? Indexul compus e folosit de la stanga la dreapta, incontinuu. Daca sari o coloana, restul nu mai sunt folosite."
      },
      {
        "order": 2,
        "title": "Partial Index — indexuri conditionale",
        "content": "Partial index (PostgreSQL) sau filtered index (SQL Server) indexeaza doar randurile care satisfac o conditie.\n\n```sql\n-- PostgreSQL partial index:\n-- Indexeaza doar comenzile active (nu cele arhivate)\nCREATE INDEX idx_comenzi_active\nON comenzi(user_id, created_at)\nWHERE status = 'activ';\n\n-- Folosit DOAR pentru query-uri care includ conditia:\nSELECT * FROM comenzi WHERE user_id = 42 AND status = 'activ';  -- Foloseste indexul\nSELECT * FROM comenzi WHERE user_id = 42;  -- NU foloseste indexul (lipseste conditia)\n\n-- Util pentru: coloane cu multe NULL-uri (indexeaza doar non-NULL)\nCREATE INDEX idx_email_not_null\nON utilizatori(email)\nWHERE email IS NOT NULL;\n\n-- Index pentru valori rare:\nCREATE INDEX idx_admins\nON utilizatori(email, creat_la)\nWHERE rol = 'admin';  -- 1% din utilizatori sunt admin\n-- Mult mai mic decat un index complet pe utilizatori cu milioane de randuri\n\n-- MySQL nu are partial index nativ, dar poti simula cu coloane generate:\nALTER TABLE comenzi\n  ADD COLUMN status_activ TINYINT AS (IF(status = 'activ', 1, NULL)) STORED;\nCREATE INDEX idx_activ ON comenzi(status_activ, user_id);\n-- Index pe status_activ: NULL = neindexat (MySQL ignora NULL in indexuri)\n```"
      },
      {
        "order": 3,
        "title": "Covering Index — evita table lookup",
        "content": "Un covering index contine toate coloanele necesare unui query — elimina citirea din tabelul de baza.\n\n```sql\n-- Fara covering index:\nSELECT user_id, total, status FROM comenzi WHERE user_id = 42;\n\n-- MySQL EXPLAIN: Extra = 'Using index condition' (citeste si tabela)\n-- Doua operatii: 1) Index lookup pentru user_id=42, 2) Row fetch pentru total si status\n\n-- Covering index (include toate coloanele din SELECT + WHERE):\nCREATE INDEX idx_covering ON comenzi(user_id, total, status);\n-- EXPLAIN: Extra = 'Using index' — citeste DOAR din index, nu tabelul de baza!\n\n-- PostgreSQL INCLUDE clause (mai explicit):\nCREATE INDEX idx_user_covering\nON comenzi(user_id)\nINCLUDE (total, status, created_at);\n-- user_id: in structura B-tree pentru search\n-- total, status, created_at: extra data in index pages, nu in tree\n\n-- Exemplu practic — pagina dashboard cu ultimele comenzi:\nCREATE INDEX idx_dashboard\nON comenzi(user_id, created_at DESC)\nINCLUDE (total, status, produs_name);\n\nSELECT total, status, produs_name, created_at\nFROM comenzi\nWHERE user_id = 42\nORDER BY created_at DESC\nLIMIT 10;\n-- Citeste NUMAI din index — ultra-rapid!\n\n-- Verificare in PostgreSQL:\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT total, status FROM comenzi WHERE user_id = 42;\n-- Index Only Scan: citeste doar indexul (cel mai rapid)\n-- Index Scan: citeste indexul + heap\n-- Seq Scan: citeste toata tabela (cel mai lent, ok pentru tabele mici)\n```\n\nLA INTERVIU: Ce este un covering index? Un index care contine toate coloanele necesare unui query, eliminand citirea din tabelul de baza. Extrem de eficient pentru query-uri frecvente."
      },
      {
        "order": 4,
        "title": "EXPLAIN ANALYZE — citirea planurilor de executie",
        "content": "Cum interpretezi output-ul EXPLAIN ANALYZE pentru optimizare.\n\n```sql\n-- PostgreSQL EXPLAIN ANALYZE complet:\nEXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)\nSELECT c.id, c.total, u.email\nFROM comenzi c\nJOIN utilizatori u ON c.user_id = u.id\nWHERE c.status = 'livrat' AND c.created_at > '2024-01-01'\nORDER BY c.total DESC\nLIMIT 20;\n\n/* Output tipic:\nLimit  (cost=1234.56..1234.78 rows=20 width=48) (actual time=45.231..45.245 rows=20 loops=1)\n  ->  Sort  (cost=1234.56..1289.23 rows=21867 width=48) (actual time=45.222..45.228 rows=20)\n        Sort Key: c.total DESC\n        Sort Method: top-N heapsort  Memory: 26kB\n        ->  Hash Join  (cost=234.00..876.45 rows=21867 width=48) (actual time=5.123..38.456)\n              Hash Cond: (c.user_id = u.id)\n              ->  Index Scan using idx_status_date on comenzi c  (cost=0.43..534.12)\n                    Index Cond: ((status = 'livrat') AND (created_at > '2024-01-01'))\n                    Rows Removed by Filter: 234\n              ->  Hash  (cost=123.45..123.45 rows=8764 width=20)\n                    Buckets: 16384  Batches: 1  Memory Usage: 512kB\n                    ->  Seq Scan on utilizatori u  (cost=0.00..123.45 rows=8764)\nPlanning Time: 2.345 ms\nExecution Time: 46.789 ms\n*/\n\n-- CE CAUTI in EXPLAIN:\n-- Seq Scan pe tabela mare => lipseste index\n-- Rows Removed by Filter mare => index prea larg, adauga coloana in WHERE\n-- Hash Join vs Nested Loop: Hash e bun pentru seturi mari, NL pentru seturi mici\n-- Execution Time >> Planning Time: ok. Planning Time >> Execution Time: query trivial dar plan complex\n\n-- MySQL EXPLAIN:\nEXPLAIN SELECT * FROM comenzi WHERE user_id = 42 AND status = 'livrat';\n/* Coloane importante:\n   type: ALL (bad!) | range | ref | eq_ref | const (good!)\n   key: indexul folosit (NULL = no index)\n   rows: randuri estimate scanate\n   Extra: Using index, Using where, Using filesort, Using temporary\n*/\n\n-- RED FLAGS in EXPLAIN:\n-- type=ALL + rows=1000000: Full table scan pe masa mare\n-- Extra=Using filesort: sortare fara index\n-- Extra=Using temporary: tabela temporara (GROUP BY fara index)\n```"
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Leftmost prefix",
        "question": "Ai index pe (user_id, status, data). Ce query NU foloseste indexul?",
        "options": [
          "WHERE user_id = 1",
          "WHERE user_id = 1 AND status = 'x'",
          "WHERE status = 'x'",
          "WHERE user_id = 1 AND status = 'x' AND data > '2024'"
        ],
        "answer": "WHERE status = 'x'",
        "explanation": "Leftmost prefix rule: indexul incepe cu user_id. Daca nu ai user_id in WHERE, indexul nu se foloseste.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "Cardinalitate",
        "question": "Intr-un index compus, cum ar trebui ordonate coloanele?",
        "options": [
          "Alfabetic",
          "Cardinalitate mare (multe valori unice) inainte, cardinalitate mica dupa",
          "Cardinalitate mica inainte",
          "Dupa dimensiunea coloanei"
        ],
        "answer": "Cardinalitate mare (multe valori unice) inainte, cardinalitate mica dupa",
        "explanation": "user_id (milioane unice) inainte de status (5 valori). Filtrul initial elimina cele mai multe randuri.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "Partial index conditie",
        "question": "Partial index cu WHERE status = 'activ' e folosit pentru?",
        "options": [
          "Orice query pe tabela",
          "Doar query-uri care includ conditia WHERE status = 'activ'",
          "Doar INSERT",
          "Orice WHERE status"
        ],
        "answer": "Doar query-uri care includ conditia WHERE status = 'activ'",
        "explanation": "Partial index e folosit NUMAI cand WHERE include conditia indexului. Altfel, optimizerul ignora indexul.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "Index Only Scan",
        "question": "Ce este un Index Only Scan in PostgreSQL?",
        "options": [
          "Scaneaza numai tabelul",
          "Citeste date exclusiv din index, fara acces la tabelul de baza — cel mai rapid tip de scan",
          "Index partial",
          "Full text scan"
        ],
        "answer": "Citeste date exclusiv din index, fara acces la tabelul de baza — cel mai rapid tip de scan",
        "explanation": "Posibil doar cu covering index. INCLUDE clause adauga coloane extra la index fara a le pune in B-tree.",
        "difficulty": "hard"
      },
      {
        "number": 5,
        "name": "Seq Scan",
        "question": "Cand este Seq Scan (full table scan) MAI BUN decat Index Scan?",
        "options": [
          "Niciodata",
          "Cand query returneaza >10-20% din randuri — overhead index lookup > citire secventiala",
          "La tabele mari",
          "La tabele mici mereu"
        ],
        "answer": "Cand query returneaza >10-20% din randuri — overhead index lookup > citire secventiala",
        "explanation": "Daca ai 1M randuri si query returneaza 300K, Seq Scan e mai rapid decat 300K index lookups + heap reads.",
        "difficulty": "hard"
      },
      {
        "number": 6,
        "name": "Extra Using filesort",
        "question": "Ce inseamna Extra='Using filesort' in MySQL EXPLAIN?",
        "options": [
          "Sorteaza pe disc un fisier",
          "Sortarea se face prin algoritm, nu prin index — potentiala problema de performanta",
          "Fisier corupt",
          "Fisierul e sortat deja"
        ],
        "answer": "Sortarea se face prin algoritm, nu prin index — potentiala problema de performanta",
        "explanation": "Solutie: creeaza index pe coloana de ORDER BY. Daca query si ORDER sunt pe acelasi index, se evita filesort.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "INCLUDE index",
        "question": "La ce serveste clauza INCLUDE in CREATE INDEX din PostgreSQL?",
        "options": [
          "Include alte tabele",
          "Adauga coloane extra in index fara a le pune in structura B-tree (pentru covering index)",
          "Importa date",
          "Comentariu"
        ],
        "answer": "Adauga coloane extra in index fara a le pune in structura B-tree (pentru covering index)",
        "explanation": "INCLUDE cols sunt stocate in leaf pages. Nu afecteaza search, dar permit Index Only Scan.",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "type=ALL EXPLAIN",
        "question": "Ce inseamna type=ALL in MySQL EXPLAIN?",
        "options": [
          "Toate indexurile folosite",
          "Full table scan — cel mai lent, indica lipsa unui index util",
          "All columns selectate",
          "Tip generic"
        ],
        "answer": "Full table scan — cel mai lent, indica lipsa unui index util",
        "explanation": "type: ALL > range > ref > eq_ref > const (ordinea de performanta, const e cel mai bun).",
        "difficulty": "easy"
      },
      {
        "number": 9,
        "name": "Index pe NULL",
        "question": "MySQL include valorile NULL in indexuri?",
        "options": [
          "Da, mereu",
          "Nu, MySQL nu indexeaza NULL — un index partial natural",
          "Depinde de tip",
          "Doar BTREE"
        ],
        "answer": "Nu, MySQL nu indexeaza NULL — un index partial natural",
        "explanation": "Coloana cu 90% NULL + index = index foarte mic. Utiliza WHERE col IS NOT NULL in query pentru a folosi indexul.",
        "difficulty": "hard"
      },
      {
        "number": 10,
        "name": "Coding: composite index optimization",
        "question": "Scrie CREATE INDEX pentru query-ul: SELECT id, email, total FROM comenzi WHERE user_id = ? AND status = 'livrat' ORDER BY created_at DESC LIMIT 10. Explica alegerile.",
        "options": [],
        "answer": "",
        "explanation": "Composite pe (user_id, status, created_at DESC) + INCLUDE(id, email, total) = covering index cu sortare incorporata.",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "Coding: partial index PostgreSQL",
        "question": "Creeaza un partial index pentru a optimiza cautarea utilizatorilor neconfirmati (confirmed = false), stiind ca 95% dintre utilizatori sunt confirmati.",
        "options": [],
        "answer": "",
        "explanation": "WHERE confirmed = false => index mic, rapid. Query trebuie sa includa conditia pentru a folosi indexul.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Coding: EXPLAIN ANALYZE",
        "question": "Ruleaza EXPLAIN ANALYZE pe un JOIN intre comenzi si utilizatori si identifica problemele de performanta.",
        "options": [],
        "answer": "",
        "explanation": "Cauta: Seq Scan pe tabela mare, Rows Removed by Filter mare, Using filesort, Hash Join pe seturi mari.",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Index vs query speed",
        "question": "Adaugarea prea multor indexuri pe o tabela poate:",
        "options": [
          "Imbunatati mereu performanta",
          "Incetini INSERT/UPDATE/DELETE — fiecare index trebuie actualizat la modificare",
          "Nu afecteaza writes",
          "Reduce spatiul pe disc"
        ],
        "answer": "Incetini INSERT/UPDATE/DELETE — fiecare index trebuie actualizat la modificare",
        "explanation": "Trade-off: READ mai rapid, WRITE mai lent. O tabela cu 20 indexuri va avea INSERT foarte lent.",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "GIN vs BTREE",
        "question": "Cand folosesti un index GIN in PostgreSQL?",
        "options": [
          "Mereu pentru performanta",
          "Pentru JSONB, arrays, full-text search — containment si overlap queries",
          "Pentru integer simple",
          "Pentru sortare"
        ],
        "answer": "Pentru JSONB, arrays, full-text search — containment si overlap queries",
        "explanation": "GIN (Generalized Inverted Index): ideal pentru multi-valued (jsonb, text[], tsvector). BTREE: range queries, equality.",
        "difficulty": "hard"
      },
      {
        "number": 15,
        "name": "Index selectivitate",
        "question": "De ce un index pe coloana 'gen' (valori: 'M', 'F') e adesea inutil?",
        "options": [
          "E gresit",
          "Selectivitate prea mica — 50% din randuri per valoare, query planner prefera Seq Scan",
          "Nu e valid",
          "Trebuie UNIQUE"
        ],
        "answer": "Selectivitate prea mica — 50% din randuri per valoare, query planner prefera Seq Scan",
        "explanation": "Indexul e util cand selectivitate e inalta (returneaza <10-20% din randuri). 50% => Seq Scan e mai eficient.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "sql-json",
    "title": "23. JSON in SQL",
    "order": 23,
    "theory": [
      {
        "order": 1,
        "title": "JSON in MySQL — coloane si extractie",
        "content": "MySQL 5.7+ suporta coloana JSON cu validare si functii de extractie.\n\n```sql\n-- Creare tabela cu coloana JSON:\nCREATE TABLE produse (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  nume VARCHAR(255),\n  specificatii JSON\n);\n\n-- INSERT cu JSON valid:\nINSERT INTO produse (nume, specificatii) VALUES\n('Laptop Dell', '{\"cpu\": \"i7\", \"ram\": 16, \"ssd\": 512, \"culori\": [\"negru\", \"argintiu\"]}'),\n('Mouse Logitech', '{\"dpi\": 1600, \"wireless\": true, \"butoane\": 6}');\n\n-- EXTRACTIE (2 sintaxe echivalente):\nSELECT\n  nume,\n  specificatii->>'$.cpu' AS cpu,         -- Operatorul -> sau ->>\n  JSON_EXTRACT(specificatii, '$.ram') AS ram,  -- Functie\n  specificatii->>'$.culori[0]' AS prima_culoare  -- Array element\nFROM produse;\n\n-- Diferenta -> vs ->>:\n-- -> returneaza JSON (cu ghilimele): \"i7\"\n-- ->> returneaza TEXT (fara ghilimele): i7\nSELECT specificatii->'$.cpu',   -- Returneaza: \"i7\" (cu ghilimele)\n       specificatii->>'$.cpu'   -- Returneaza: i7 (fara ghilimele)\nFROM produse;\n\n-- MODIFICARE JSON:\nUPDATE produse\nSET specificatii = JSON_SET(specificatii, '$.ram', 32)\nWHERE id = 1;\n-- JSON_SET: seteaza (insert sau update)\n-- JSON_INSERT: insert doar daca NU exista\n-- JSON_REPLACE: update doar daca EXISTA\n-- JSON_REMOVE: sterge o proprietate\n\nUPDATE produse\nSET specificatii = JSON_REMOVE(specificatii, '$.culori')\nWHERE id = 1;\n\n-- CAUTARE in JSON:\nSELECT * FROM produse\nWHERE JSON_EXTRACT(specificatii, '$.wireless') = TRUE;\n\nSELECT * FROM produse\nWHERE specificatii->>'$.cpu' = 'i7';\n```"
      },
      {
        "order": 2,
        "title": "JSONB in PostgreSQL — indexare si operatori",
        "content": "JSONB in PostgreSQL e mai puternic: stocat binar, indexabil cu GIN, operatori speciali.\n\n```sql\n-- Creare si insert:\nCREATE TABLE produse (\n  id SERIAL PRIMARY KEY,\n  nume VARCHAR(255),\n  meta JSONB\n);\n\nINSERT INTO produse (nume, meta) VALUES\n('Laptop Dell', '{\"cpu\": \"i7\", \"ram\": 16, \"tags\": [\"laptop\", \"dell\"], \"stoc\": {\"ro\": 5, \"de\": 10}}'),\n('Mouse MX Master', '{\"dpi\": 4000, \"wireless\": true, \"tags\": [\"mouse\", \"logitech\"]}');\n\n-- OPERATORI JSONB:\nSELECT\n  meta->'cpu' AS cpu_json,          -- Returneaza JSON value: \"i7\"\n  meta->>'cpu' AS cpu_text,         -- Returneaza text: i7\n  meta->'stoc'->>'ro' AS stoc_ro,   -- Nested: 5\n  meta #>> '{stoc,ro}' AS stoc_ro2  -- Path operator\nFROM produse;\n\n-- CONTAINMENT @>:\nSELECT * FROM produse\nWHERE meta @> '{\"wireless\": true}'::jsonb;\n-- Gaseste toate cu wireless = true\n\nSELECT * FROM produse\nWHERE meta @> '{\"tags\": [\"laptop\"]}'::jsonb;\n-- Gaseste produse cu 'laptop' in tags array\n\n-- KEY EXISTS ?:\nSELECT * FROM produse WHERE meta ? 'wireless';\n-- Gaseste unde exista cheia 'wireless'\n\nSELECT * FROM produse WHERE meta ?| ARRAY['wireless', 'bluetooth'];\n-- Gaseste unde exista 'wireless' SAU 'bluetooth'\n\nSELECT * FROM produse WHERE meta ?& ARRAY['cpu', 'ram'];\n-- Gaseste unde exista 'cpu' SI 'ram'\n\n-- INDEX GIN pentru JSONB:\nCREATE INDEX idx_meta ON produse USING GIN(meta);\n-- Accelereaza: @>, ?, ?|, ?&\n\nCREATE INDEX idx_meta_path ON produse USING GIN(meta jsonb_path_ops);\n-- Doar @> (containment) — mai mic si mai rapid\n\n-- UPDATE JSONB:\nUPDATE produse\nSET meta = meta || '{\"pret\": 2999}'::jsonb  -- Merge\nWHERE id = 1;\n\nUPDATE produse\nSET meta = jsonb_set(meta, '{stoc,ro}', '15'::jsonb)\nWHERE id = 1;\n```"
      },
      {
        "order": 3,
        "title": "JSON aggregation si generare",
        "content": "Construirea si agregarea JSON direct din query-uri SQL.\n\n```sql\n-- MySQL JSON aggregation:\nSELECT\n  u.id AS user_id,\n  u.nume,\n  JSON_ARRAYAGG(\n    JSON_OBJECT(\n      'id', c.id,\n      'total', c.total,\n      'status', c.status\n    )\n  ) AS comenzi\nFROM utilizatori u\nLEFT JOIN comenzi c ON c.user_id = u.id\nGROUP BY u.id, u.nume;\n\n/* Rezultat:\n[\n  { \"user_id\": 1, \"nume\": \"Ana\", \"comenzi\": [{\"id\":1,\"total\":250},{\"id\":2,\"total\":80}] },\n  ...\n]\n*/\n\n-- PostgreSQL JSON aggregation:\nSELECT\n  u.id,\n  u.nume,\n  jsonb_agg(\n    jsonb_build_object(\n      'id', c.id,\n      'total', c.total,\n      'status', c.status\n    )\n  ) AS comenzi,\n  jsonb_build_object(\n    'id', u.id,\n    'email', u.email,\n    'role', u.rol\n  ) AS user_json\nFROM utilizatori u\nLEFT JOIN comenzi c ON c.user_id = u.id\nGROUP BY u.id, u.nume, u.email, u.rol;\n\n-- json_each si jsonb_each — expand JSON la randuri:\nSELECT key, value\nFROM produse, jsonb_each(meta)\nWHERE id = 1;\n/* Returneaza:\n   key    | value\n   cpu    | \"i7\"\n   ram    | 16\n   tags   | [\"laptop\",\"dell\"]\n*/\n\n-- jsonb_array_elements — expand array JSON la randuri:\nSELECT id, tag\nFROM produse, jsonb_array_elements_text(meta->'tags') AS tag\nWHERE id = 1;\n/* Returneaza:\n   id | tag\n   1  | laptop\n   1  | dell\n*/\n```"
      },
      {
        "order": 4,
        "title": "Cand sa folosesti JSON in SQL vs coloane normale",
        "content": "JSON in SQL e puternic dar nu un inlocuitor pentru schema relationala.\n\n```sql\n-- BUN pentru JSON:\n-- 1. Date cu schema variabila (setari utilizator, metadata produs):\nCREATE TABLE setari_utilizator (\n  user_id INT PRIMARY KEY,\n  preferinte JSONB\n  -- Fiecare user poate stoca orice setari, schema nu e fixa\n);\n\n-- 2. Payload-uri externe (webhooks, API responses):\nCREATE TABLE webhook_events (\n  id SERIAL PRIMARY KEY,\n  source VARCHAR(50),\n  received_at TIMESTAMP DEFAULT NOW(),\n  payload JSONB  -- Stocheaza tot payload-ul pentru reprocessing\n);\n\n-- 3. Coloane extra rare (nu vrei 50 de coloane NULL):\nCREATE TABLE produse (\n  id SERIAL PRIMARY KEY,\n      categorie VARCHAR(50),\n  pret DECIMAL(10,2),\n  atribute JSONB  -- Dimensiuni, culori, dimensiuni — variaza per categorie\n);\n\n-- RAU pentru JSON (antipattern):\n-- Coloane pe care faci JOIN sau WHERE frecvent:\nSELECT * FROM comenzi\nWHERE meta->>'user_email' = 'test@test.com';\n-- Email ar trebui sa fie o coloana proprie cu index!\n\n-- Date cu schema stabila si relatii clare:\n-- user_id, email, created_at => coloane, nu JSON\n\n-- HIBRID pattern — mereu bun:\nCREATE TABLE produse (\n  id SERIAL PRIMARY KEY,\n  categorie_id INT REFERENCES categorii(id),  -- Relational\n  pret DECIMAL(10,2) NOT NULL,               -- Indexed frecvent\n  stoc INT NOT NULL,\n  meta JSONB  -- Atribute variabile per categorie\n);\n\n-- LA INTERVIU: Cand folosesti JSON in SQL?\n-- Schema variabila, date rare, payload extern, prototipare rapida.\n-- NU pentru: chei straine, campuri pe care cauti des, date relationale clare.\n```"
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "JSON_EXTRACT sintaxa",
        "question": "In MySQL, cum extragi valoarea 'cpu' din coloana specificatii JSON?",
        "options": [
          "specificatii.cpu",
          "specificatii->>'$.cpu'",
          "JSON_GET(specificatii, 'cpu')",
          "specificatii['cpu']"
        ],
        "answer": "specificatii->>'$.cpu'",
        "explanation": "Operator ->> returneaza text (fara ghilimele). -> returneaza JSON value. Alternativ: JSON_EXTRACT(col, '$.cpu').",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "JSON vs JSONB",
        "question": "De ce preferi JSONB lui JSON in PostgreSQL pentru query-uri frecvente?",
        "options": [
          "E mai nou",
          "JSONB e indexabil cu GIN, suporta operatori speciali (@>, ?) si e mai rapid la read",
          "JSON e deprecat",
          "JSONB e mai mic"
        ],
        "answer": "JSONB e indexabil cu GIN, suporta operatori speciali (@>, ?) si e mai rapid la read",
        "explanation": "JSON: stocat ca text (validat). JSONB: stocat binar (parsare o singura data, indexabil). Alege mereu JSONB.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "containment operator",
        "question": "Ce face operatorul @> in PostgreSQL pentru JSONB?",
        "options": [
          "Compara dimensiuni",
          "Verifica daca JSON-ul din stanga contine JSON-ul din dreapta (containment)",
          "Concateneaza",
          "Extrage proprietate"
        ],
        "answer": "Verifica daca JSON-ul din stanga contine JSON-ul din dreapta (containment)",
        "explanation": "meta @> '{\"status\": \"activ\"}'::jsonb — true daca meta are cheia status cu valoarea activ.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "JSON_ARRAYAGG",
        "question": "La ce serveste JSON_ARRAYAGG in MySQL?",
        "options": [
          "Sorteaza un array",
          "Agregheaza mai multe randuri intr-un array JSON (dupa GROUP BY)",
          "Valideaza JSON",
          "Extrage array"
        ],
        "answer": "Agregheaza mai multe randuri intr-un array JSON (dupa GROUP BY)",
        "explanation": "Similar cu GROUP_CONCAT, dar returneaza JSON array. JSON_ARRAYAGG(JSON_OBJECT('id',id,'total',total)).",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "jsonb_agg PostgreSQL",
        "question": "Echivalentul PostgreSQL pentru MySQL JSON_ARRAYAGG este?",
        "options": [
          "json_array()",
          "jsonb_agg()",
          "array_agg() cu cast",
          "JSON_COLLECT()"
        ],
        "answer": "jsonb_agg()",
        "explanation": "jsonb_agg(expr) — agregheaza in JSONB array. json_agg() pentru JSON (text). jsonb_build_object pentru obiecte.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "JSON antipattern",
        "question": "Care este principalul antipattern al coloanelor JSON in SQL?",
        "options": [
          "Prea mult spatiu",
          "Stocarea de campuri pe care faci JOIN/WHERE frecvent (ar trebui sa fie coloane cu index)",
          "JSON nu e valid",
          "Prea lent"
        ],
        "answer": "Stocarea de campuri pe care faci JOIN/WHERE frecvent (ar trebui sa fie coloane cu index)",
        "explanation": "WHERE meta->>'email' = 'x' nu poate folosi un index B-tree normal. Email trebuie sa fie coloana proprie.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "JSON_SET MySQL",
        "question": "Diferenta JSON_SET vs JSON_INSERT in MySQL?",
        "options": [
          "Identice",
          "JSON_SET: seteaza (insert sau update). JSON_INSERT: insert NUMAI daca cheia nu exista",
          "JSON_INSERT e mai rapid",
          "JSON_SET e pentru arrays"
        ],
        "answer": "JSON_SET: seteaza (insert sau update). JSON_INSERT: insert NUMAI daca cheia nu exista",
        "explanation": "JSON_REPLACE: update numai daca exista. JSON_SET: insert sau update. JSON_INSERT: insert daca nu exista.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "GIN index JSONB",
        "question": "Ce tip de index folosesti pentru a accelera query-uri @> pe o coloana JSONB?",
        "options": [
          "BTREE",
          "HASH",
          "GIN",
          "BRIN"
        ],
        "answer": "GIN",
        "explanation": "CREATE INDEX idx ON tabela USING GIN(col). GIN (Generalized Inverted Index) e optimizat pentru multi-valued data.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "jsonb_each",
        "question": "Ce face jsonb_each(coloana_jsonb)?",
        "options": [
          "Listeaza chei",
          "Expandeaza obiectul JSON in randuri de tip (key, value)",
          "Merge doua JSON-uri",
          "Valideaza JSON"
        ],
        "answer": "Expandeaza obiectul JSON in randuri de tip (key, value)",
        "explanation": "Util pentru a itera proprietatile unui JSON ca randuri SQL. jsonb_each_text returneaza text.",
        "difficulty": "hard"
      },
      {
        "number": 10,
        "name": "Coding: JSON extrage MySQL",
        "question": "Selecteaza din tabela produse: id, nume, cpu din specificatii->cpu, si filtreaza unde ram >= 16.",
        "options": [],
        "answer": "",
        "explanation": "JSON_EXTRACT sau operatorul ->>. Comparatia numerica cu CAST sau operatorul direct.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "Coding: JSONB PostgreSQL",
        "question": "In PostgreSQL: selecteaza produsele unde tags array contine 'laptop' SI wireless este true, folosind operatorii JSONB.",
        "options": [],
        "answer": "",
        "explanation": "Doua conditii @> separate sau combine cu AND. tags array containment si wireless boolean.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Coding: JSON aggregation",
        "question": "Construieste un query care returneaza fiecare utilizator cu un array JSON al comenzilor sale (id, total, status).",
        "options": [],
        "answer": "",
        "explanation": "MySQL: JSON_ARRAYAGG(JSON_OBJECT(...)). PostgreSQL: jsonb_agg(jsonb_build_object(...)). LEFT JOIN pentru a include utilizatori fara comenzi.",
        "difficulty": "hard"
      },
      {
        "number": 13,
        "name": "JSON merge PostgreSQL",
        "question": "Cum mergi (combini) doua valori JSONB in PostgreSQL, cu proprietatile celui de-al doilea suprascriindu-le pe ale primului?",
        "options": [
          "JSON_MERGE(a, b)",
          "a || b (operatorul de concatenare JSONB)",
          "jsonb_merge(a, b)",
          "UPDATE SET = a + b"
        ],
        "answer": "a || b (operatorul de concatenare JSONB)",
        "explanation": "meta || '{\"pret\": 999}'::jsonb — adauga sau suprascrie 'pret' in meta. Valorile din dreapta au prioritate.",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "JSON schema variabila",
        "question": "Cel mai bun use case pentru o coloana JSON intr-o baza de date relationala este?",
        "options": [
          "Stocare ID-uri pentru JOIN",
          "Date cu schema variabila (setari, metadata, atribute specifice categoriei)",
          "Date relationale clare",
          "Inlocuire completa a tabelelor"
        ],
        "answer": "Date cu schema variabila (setari, metadata, atribute specifice categoriei)",
        "explanation": "Laptop: cpu, ram. Tricou: marime, culori. Schema variabila pe categorie = perfect pentru JSONB.",
        "difficulty": "easy"
      },
      {
        "number": 15,
        "name": "JSON_CONTAINS MySQL",
        "question": "Cum verifici in MySQL daca un array JSON contine o valoare specifica (ex: 'laptop' in tags)?",
        "options": [
          "tags = 'laptop'",
          "JSON_CONTAINS(tags, '\"laptop\"')",
          "JSON_SEARCH(tags, 'laptop')",
          "FIND_IN_SET"
        ],
        "answer": "JSON_CONTAINS(tags, '\"laptop\"')",
        "explanation": "JSON_CONTAINS(coloana, valoare_json_string). Valoarea trebuie sa fie JSON valid: '\"laptop\"' (cu ghilimele extra).",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "sql-full-text-search",
    "title": "24. Full-Text Search in SQL",
    "order": 24,
    "theory": [
      {
        "order": 1,
        "title": "MATCH AGAINST in MySQL — cautare full-text",
        "content": "MySQL Full-Text Search permite cautare semantica in texte, nu doar LIKE '%cuvant%'.\n\n```sql\n-- 1. Creeaza index FULLTEXT:\nCREATE TABLE articole (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  titlu VARCHAR(500),\n  continut TEXT,\n  FULLTEXT INDEX idx_ft (titlu, continut)\n);\n\n-- SAU adauga la tabela existenta:\nALTER TABLE articole ADD FULLTEXT INDEX idx_ft (titlu, continut);\n\n-- 2. Cautare Natural Language (default):\nSELECT id, titlu,\n  MATCH(titlu, continut) AGAINST('programare javascript' IN NATURAL LANGUAGE MODE) AS scor\nFROM articole\nWHERE MATCH(titlu, continut) AGAINST('programare javascript' IN NATURAL LANGUAGE MODE)\nORDER BY scor DESC\nLIMIT 10;\n\n-- 3. Cautare Boolean (controlata):\nSELECT id, titlu\nFROM articole\nWHERE MATCH(titlu, continut) AGAINST(\n  '+react +hooks -jQuery'  -- react SI hooks DAR NU jQuery\n  IN BOOLEAN MODE\n);\n\n-- Operatori Boolean Mode:\n-- +cuvant : obligatoriu\n-- -cuvant : exclus\n-- cuvant  : optional (creste scorul)\n-- \"cuvant cheie\" : fraza exacta\n-- cuvant* : prefix wildcard (react*)\n-- ~cuvant : scade scorul\n\n-- 4. Query Expansion (si termeni asociati):\nSELECT id, titlu\nFROM articole\nWHERE MATCH(titlu, continut)\n      AGAINST('javascript' WITH QUERY EXPANSION);\n-- Cauta 'javascript' + termeni din documentele cu scor mare\n\n-- Limitare: minimum_word_length = 4 (default)\n-- Cuvinte prea comune (stopwords) sunt ignorate\n```"
      },
      {
        "order": 2,
        "title": "tsvector si tsquery in PostgreSQL",
        "content": "PostgreSQL are un sistem FTS nativ si mai puternic cu suport pentru limbi multiple.\n\n```sql\n-- tsvector: reprezentarea indexata a textului\nSELECT to_tsvector('romanian', 'programarea in JavaScript si TypeScript este importanta');\n-- Returneaza: 'javascript':3 'programar':1 'typescrip':5 'import':7\n-- Stemming: 'programarea' -> 'programar', eliminare cuvinte comune\n\n-- tsquery: expresia de cautare\nSELECT to_tsquery('romanian', 'javascript & typescript');\n-- Returneaza: 'javascript' & 'typescrip'\n\n-- Verificare match:\nSELECT to_tsvector('english', 'The quick brown fox') @@ to_tsquery('english', 'fox & quick');\n-- Returneaza: true\n\n-- SETUP COMPLET pentru FTS:\nALTER TABLE articole ADD COLUMN search_vector TSVECTOR;\n\n-- Populeaza:\nUPDATE articole\nSET search_vector = to_tsvector('romanian',\n  COALESCE(titlu, '') || ' ' || COALESCE(continut, '')\n);\n\n-- Index GIN pentru FTS:\nCREATE INDEX idx_fts ON articole USING GIN(search_vector);\n\n-- Query cu relevanta:\nSELECT\n  id,\n  titlu,\n  ts_rank(search_vector, query) AS relevanta,\n  ts_headline('romanian', continut, query, 'MaxWords=20, MinWords=10') AS fragment\nFROM articole,\n     to_tsquery('romanian', 'javascript & react') query\nWHERE search_vector @@ query\nORDER BY relevanta DESC\nLIMIT 10;\n\n-- Mentinere automata cu trigger:\nCREATE FUNCTION update_search_vector() RETURNS TRIGGER AS $$\nBEGIN\n  NEW.search_vector := to_tsvector('romanian',\n    COALESCE(NEW.titlu,'') || ' ' || COALESCE(NEW.continut,''));\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;\n\nCREATE TRIGGER trig_search_vector\n  BEFORE INSERT OR UPDATE ON articole\n  FOR EACH ROW EXECUTE FUNCTION update_search_vector();\n```"
      },
      {
        "order": 3,
        "title": "ts_rank — relevanta si ranking",
        "content": "Ordonarea rezultatelor dupa relevanta e critica pentru o cautare buna.\n\n```sql\n-- ts_rank: scor bazat pe frecventa termenilor\nSELECT\n  titlu,\n  ts_rank(search_vector, query) AS rank_frecventa,\n  ts_rank_cd(search_vector, query) AS rank_cover_density\nFROM articole,\n     to_tsquery('english', 'database & performance') query\nWHERE search_vector @@ query;\n\n-- ts_rank_cd (cover density): ia in calcul proximitatea termenilor\n-- Daca 'database' si 'performance' apar aproape => scor mai mare\n\n-- Normalizare rank (optionala, parametru de normalizare):\nts_rank(search_vector, query, 1)  -- Divide la log(ndoc+1)\nts_rank(search_vector, query, 2)  -- Divide la document length\nts_rank(search_vector, query, 4)  -- Divide la distanta medie intre pozitii\n\n-- ts_headline: extrage fragmente relevante cu highlight:\nSELECT\n  titlu,\n  ts_headline(\n    'romanian',\n    continut,\n    to_tsquery('romanian', 'javascript & reactjs'),\n    'StartSel=<strong>, StopSel=</strong>, MaxWords=30, MinWords=15, MaxFragments=2'\n  ) AS excerpt\nFROM articole\nWHERE search_vector @@ to_tsquery('romanian', 'javascript & reactjs');\n\n-- Combinare FTS cu alte filtre:\nSELECT id, titlu, categorie, ts_rank(sv, q) AS rank\nFROM articole,\n     to_tsquery('romanian', 'react & hooks') q\nWHERE sv @@ q\n  AND categorie = 'frontend'\n  AND published_at > NOW() - INTERVAL '6 months'\nORDER BY rank DESC;\n\n-- Cautare fuzzy cu pg_trgm (similar cu LIKE dar cu index):\nCREATE EXTENSION pg_trgm;\nCREATE INDEX idx_trgm ON articole USING GIN(titlu gin_trgm_ops);\n\nSELECT titlu, similarity(titlu, 'javascrpit') AS sim\nFROM articole\nWHERE titlu % 'javascrpit'  -- similarity > 0.3 (default)\nORDER BY sim DESC;\n```"
      },
      {
        "order": 4,
        "title": "Comparatie MySQL FTS vs PostgreSQL FTS si alternative",
        "content": "Diferente practice si cand sa alegi solutii externe.\n\n```\n+------------------+--------------------+--------------------+\n| Feature          | MySQL FULLTEXT     | PostgreSQL FTS     |\n+------------------+--------------------+--------------------+\n| Limbi            | Basic (stopwords)  | 25+ limbi, stemming|\n| Indexare         | FULLTEXT index     | tsvector + GIN     |\n| Sintaxa query    | MATCH AGAINST      | @@ cu tsquery      |\n| Ranking          | Scor float         | ts_rank, ts_rank_cd|\n| Highlight        | Nu nativ           | ts_headline        |\n| Fuzzy search     | Nu nativ           | pg_trgm extension  |\n| Update automata  | Index se updatesaza| Trigger + tsvector |\n| Limita cuvant    | min 4 chars default| Configurabil       |\n+------------------+--------------------+--------------------+\n```\n\nSOLUTII EXTERNE (pentru productie la scara):\n```js\n// Elasticsearch / OpenSearch:\nconst { body } = await client.search({\n  index: 'articole',\n  body: {\n    query: {\n      multi_match: {\n        query: 'react hooks tutorial',\n        fields: ['titlu^2', 'continut'],  // titlu are ponderea 2x\n        fuzziness: 'AUTO',  // Corecteaza typo-uri\n      },\n    },\n    highlight: {\n      fields: { continut: { fragment_size: 100 } },\n    },\n  },\n});\n\n// Meilisearch (alternativa simpla, self-hosted):\nawait client.index('articole').addDocuments(articole);\nconst results = await client.index('articole').search('react hooks', {\n  attributesToHighlight: ['titlu', 'continut'],\n  limit: 10,\n});\n\n// Typesense (similar Meilisearch):\nconst results = await typesense.collections('articole').documents().search({\n  q: 'react hooks',\n  query_by: 'titlu,continut',\n  num_typos: 2,\n});\n```\n\nLA INTERVIU: Cand folosesti Elasticsearch vs SQL FTS? SQL FTS: date deja in DB, volum mic-mediu, nu vrei extra infra. Elasticsearch: volum mare, cautari complexe, highlighting, analytics pe text."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "FULLTEXT index",
        "question": "Ce tip de index este necesar pentru MATCH AGAINST in MySQL?",
        "options": [
          "INDEX normal",
          "FULLTEXT INDEX",
          "UNIQUE INDEX",
          "SPATIAL INDEX"
        ],
        "answer": "FULLTEXT INDEX",
        "explanation": "CREATE FULLTEXT INDEX idx ON tabela(col1, col2) sau FULLTEXT KEY in CREATE TABLE.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "MATCH AGAINST scor",
        "question": "Cum obtii scorul de relevanta al rezultatelor cu MATCH AGAINST?",
        "options": [
          "ORDER BY relevanta",
          "Folosesti MATCH() in SELECT si ii dai alias — returneaza un float intre 0-1",
          "MATCH returneaza rank automat",
          "Separat cu RANK()"
        ],
        "answer": "Folosesti MATCH() in SELECT si ii dai alias — returneaza un float intre 0-1",
        "explanation": "SELECT MATCH(col) AGAINST('query') AS scor FROM t WHERE MATCH(col) AGAINST('query') ORDER BY scor DESC.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "Boolean Mode",
        "question": "In MySQL BOOLEAN MODE, ce face prefixul + (plus) inaintea unui cuvant?",
        "options": [
          "Aduna scoruri",
          "Cuvantul este OBLIGATORIU in rezultate",
          "Creste scorul",
          "Cautare fuzzy"
        ],
        "answer": "Cuvantul este OBLIGATORIU in rezultate",
        "explanation": "+cuvant = must contain. -cuvant = must not contain. cuvant (fara prefix) = optional, creste scorul.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "tsvector",
        "question": "Ce face to_tsvector('romanian', text) in PostgreSQL?",
        "options": [
          "Cauta in text",
          "Converteste text in reprezentare indexabila: normalizeaza, elimina stopwords, face stemming",
          "Creeaza index",
          "Valideaza text"
        ],
        "answer": "Converteste text in reprezentare indexabila: normalizeaza, elimina stopwords, face stemming",
        "explanation": "'programarea' devine 'programar', cuvinte comune eliminate, pozitii retinute. Rezultatul e indexat cu GIN.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "operatorul @@",
        "question": "Ce face operatorul @@ in PostgreSQL FTS?",
        "options": [
          "String concat",
          "Verifica daca tsvector contine termenii din tsquery (match)",
          "JSON containment",
          "Array overlap"
        ],
        "answer": "Verifica daca tsvector contine termenii din tsquery (match)",
        "explanation": "search_vector @@ to_tsquery('react & hooks') — returneaza TRUE daca vectorul contine ambii termeni.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "ts_headline",
        "question": "La ce serveste ts_headline in PostgreSQL?",
        "options": [
          "Creeaza index",
          "Returneaza fragment din text cu termenii cautati evidentiati (highlight)",
          "Calculeaza scorul",
          "Formateaza text"
        ],
        "answer": "Returneaza fragment din text cu termenii cautati evidentiati (highlight)",
        "explanation": "ts_headline(config, text, query, options) — extrage fragment relevant si wraps termenii in StartSel/StopSel.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "pg_trgm",
        "question": "La ce serveste extensia pg_trgm in PostgreSQL?",
        "options": [
          "Trigonometrie",
          "Cautare fuzzy bazata pe trigrame — gaseste text similar (tolereaza typo-uri)",
          "Timestamp operations",
          "Regex avansate"
        ],
        "answer": "Cautare fuzzy bazata pe trigrame — gaseste text similar (tolereaza typo-uri)",
        "explanation": "similarity('javascrpit', 'javascript') > 0.3 — gaseste 'javascript' chiar cu typo. Index GIN + gin_trgm_ops.",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "ts_rank_cd",
        "question": "Diferenta ts_rank vs ts_rank_cd?",
        "options": [
          "Identice",
          "ts_rank: frecventa termeni. ts_rank_cd: cover density — ia in calcul proximitatea termenilor",
          "ts_rank e mai rapid",
          "ts_rank_cd e pentru multilanguage"
        ],
        "answer": "ts_rank: frecventa termeni. ts_rank_cd: cover density — ia in calcul proximitatea termenilor",
        "explanation": "Daca 'react' si 'hooks' apar in aceeasi propozitie, ts_rank_cd le da scor mai mare decat daca apar departe.",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "FTS vs Elasticsearch",
        "question": "Cand alegi Elasticsearch in loc de PostgreSQL FTS?",
        "options": [
          "Mereu",
          "Volum foarte mare, cautari complexe cu facets, analytics text, scalare orizontala",
          "Niciodata",
          "Doar pentru JavaScript"
        ],
        "answer": "Volum foarte mare, cautari cautari complexe cu facets, analytics text, scalare orizontala",
        "explanation": "PostgreSQL FTS excelent pentru < 10M documente. Elasticsearch pentru 100M+, autocomplete complex, analytics.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "Coding: MySQL FULLTEXT",
        "question": "Creeaza un FULLTEXT index pe titlu si continut, si scrie un query care cauta '+react +hooks' in Boolean Mode, ordonand dupa scor.",
        "options": [],
        "answer": "",
        "explanation": "FULLTEXT INDEX pe ambele coloane. MATCH(titlu, continut) AGAINST(query IN BOOLEAN MODE) ca WHERE si in SELECT pentru scor.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "Coding: PostgreSQL FTS setup",
        "question": "Adauga coloana search_vector la tabela articole, populeaz-o cu to_tsvector, creeaza index GIN si scrie un query de cautare.",
        "options": [],
        "answer": "",
        "explanation": "ALTER TABLE + UPDATE pentru populare. CREATE INDEX USING GIN. Query cu @@ si ts_rank pentru sortare.",
        "difficulty": "hard"
      },
      {
        "number": 12,
        "name": "Coding: ts_headline highlight",
        "question": "Scrie un query PostgreSQL FTS care returneaza titlu, excerpt cu termenii cautati in bold (<strong>) si scorul de relevanta.",
        "options": [],
        "answer": "",
        "explanation": "ts_headline cu StartSel='<strong>' StopSel='</strong>'. ts_rank pentru scor. @@ pentru filtru.",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Stopwords",
        "question": "Ce sunt stopwords in Full-Text Search?",
        "options": [
          "Cuvinte importante",
          "Cuvinte prea comune (si, sau, este) care sunt ignorate in indexare si cautare",
          "Cuvinte gresite",
          "Cuvinte rezervate SQL"
        ],
        "answer": "Cuvinte prea comune (si, sau, este) care sunt ignorate in indexare si cautare",
        "explanation": "Indexarea lor nu ar fi utila (apar in toate documentele). MySQL are lista hardcodata, PostgreSQL e configurabil.",
        "difficulty": "easy"
      },
      {
        "number": 14,
        "name": "MySQL min word length",
        "question": "De ce MySQL FTS ignora cuvintele scurte (< 4 caractere) in mod default?",
        "options": [
          "Bug",
          "ft_min_word_len = 4 default — cuvintele scurte sunt prea comune pentru a fi utile in search",
          "Limitare charset",
          "Performanta"
        ],
        "answer": "ft_min_word_len = 4 default — cuvintele scurte sunt prea comune pentru a fi utile in search",
        "explanation": "Schimba cu ft_min_word_len = 2 in my.cnf si rebuild index. PostgreSQL nu are aceasta limitare.",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Trigger tsvector update",
        "question": "De ce creezi un trigger pentru update-ul coloanei tsvector la INSERT/UPDATE?",
        "options": [
          "E obligatoriu",
          "Mentine automat search_vector sincronizat la fiecare modificare de date",
          "E mai rapid",
          "E o conventie"
        ],
        "answer": "Mentine automat search_vector sincronizat la fiecare modificare de date",
        "explanation": "Fara trigger: dupa UPDATE pe continut, search_vector ramane cu date vechi. Trigger = consistenta automata.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "sql-replicare-sharding",
    "title": "25. Replicare si Sharding",
    "order": 25,
    "theory": [
      {
        "order": 1,
        "title": "Master-Slave Replication — read replicas",
        "content": "Replicarea permite distribuirea sarcinii de citire pe mai multi serveri.\n\n```\nArhitectura Master-Slave:\n\n  Client Writes                Client Reads\n       |                         /    |    \\\n       v                        v     v     v\n  +---------+               +--+  +--+  +--+\n  | MASTER  |  Replication  | S|  | S|  | S|\n  | (Write) |  -----------> |l1|  |l2|  |l3|\n  +---------+               +--+  +--+  +--+\n  Binlog --> Relay log --> Apply changes\n```\n\nCONFIGURARE MySQL (simplificat):\n```sql\n-- Pe MASTER (my.cnf):\n-- server-id = 1\n-- log-bin = mysql-bin\n-- binlog-do-db = production_db\n\n-- Pe MASTER, creeaza user de replicare:\nCREATE USER 'replication'@'%' IDENTIFIED BY 'parola_puternica';\nGRANT REPLICATION SLAVE ON *.* TO 'replication'@'%';\nFLUSH TABLES WITH READ LOCK;\nSHOW MASTER STATUS;  -- Noteaza File si Position\n-- Exporta baza de date (mysqldump sau snapshot)\nUNLOCK TABLES;\n\n-- Pe SLAVE, configureaza conexiunea la master:\nCHANGE MASTER TO\n  MASTER_HOST = '192.168.1.100',\n  MASTER_USER = 'replication',\n  MASTER_PASSWORD = 'parola_puternica',\n  MASTER_LOG_FILE = 'mysql-bin.000001',\n  MASTER_LOG_POS = 4567;\nSTART SLAVE;\nSHOW SLAVE STATUS\\G  -- Verifica Seconds_Behind_Master\n\n-- Verificare lag replicare:\nSHOW SLAVE STATUS\\G\n-- Cauta: Seconds_Behind_Master (0 = sincronizat)\n-- Slave_SQL_Running: Yes (running)\n-- Slave_IO_Running: Yes (conectat la master)\n```\n\nCONSIDERATII:\n- Replicarea e ASYNC default (potentiala pierdere date la crash master)\n- Replicarea sincrona (semi-sync) — master asteapta confirmare de la cel putin un slave\n- Read replicas pentru rapoarte, analytics, backup — fara sa incarce masterul"
      },
      {
        "order": 2,
        "title": "Replication lag si consistency models",
        "content": "Replication lag poate cauza inconsistente temporare — important de inteles in design.\n\n```\nProblema replication lag:\n\nT0: User A face purchase (WRITE pe master): sold = 100\nT1: Master confirma tranzactia\nT2: User A citeste soldul (READ pe slave): vede 150 (date vechi!)\nT3: Replicare ajunge la slave: slave are sold = 100\nT4: User A citeste din nou: vede 100\n\nPeriada T1-T3 = replication lag\n```\n\n```sql\n-- Solutii pentru read-your-own-writes:\n\n-- 1. Citeste dupa write din MASTER pentru user care a scris:\n-- Aplicatie: daca user a facut write recent, citeste din master\n\n-- 2. Session consistency — MySQL:\nSELECT @@global.read_only; -- 0 pe master, 1 pe slave\n-- Rutare bazata pe: user recent write => master\n\n-- 3. Wait for slave to catch up (MySQL 5.6+):\nSELECT MASTER_POS_WAIT('mysql-bin.000001', 4567, 5);\n-- Asteapta max 5 secunde ca slave-ul sa aplice pozitia\n\n-- 4. PostgreSQL synchronous_commit:\n-- synchronous_commit = on  => master asteapta slave sa confirme WAL\n-- Mai lent dar consistent garantat\nSET LOCAL synchronous_commit = 'remote_apply';\nUPDATE conturi SET sold = sold - 100 WHERE id = 1;\n-- Asteapta slave-ul sa aplice tranzactia\n\n-- MODELE DE CONSISTENTA:\n-- Strong consistency: toate nodurile vad aceeasi data (RDBMS + sync replication)\n-- Eventual consistency: nodurile converg in timp (NoSQL, async replication)\n-- Read-your-own-writes: citesti ce ai scris tu (session affinity)\n-- Monotonic reads: nu citesti date mai vechi decat ultima citire\n```"
      },
      {
        "order": 3,
        "title": "Vertical vs Horizontal Scaling si Sharding concepts",
        "content": "Sharding = impartirea datelor pe mai multi serveri pentru scale-out orizontal.\n\n```\nVertical Scaling (Scale-up):\n  CPU: 8 -> 64 cores\n  RAM: 64GB -> 1TB\n  SSD: 2TB -> 100TB\n  LIMITA: exista un maxim hardware, pret creste exponential\n\nHorizontal Scaling (Scale-out):\n  Server1: utilizatori 1-1M\n  Server2: utilizatori 1M-2M\n  Server3: utilizatori 2M-3M\n  AVANTAJ: infinit scalabil (teoretic)\n  DEZAVANTAJ: complexitate enorma\n```\n\n```\nSTRATEGII DE SHARDING:\n\n1. Range Sharding (pe range de valori):\n   Shard 1: user_id 1 - 1,000,000\n   Shard 2: user_id 1,000,001 - 2,000,000\n   Shard 3: user_id 2,000,001 - 3,000,000\n   PROBLEMA: hot spots daca noii useri (ID mare) sunt mai activi\n\n2. Hash Sharding:\n   shard = hash(user_id) % num_shards\n   AVANTAJ: distributie uniforma\n   DEZAVANTAJ: range queries dificile, reshard la adaugare shard\n\n3. Directory Sharding:\n   Tabela de mapare: user_id -> shard_id\n   AVANTAJ: flexibil, useri pot fi mutati\n   DEZAVANTAJ: tabela de mapare = single point of failure\n\n4. Geographic Sharding:\n   Shard EU: utilizatori Europa\n   Shard US: utilizatori America\n   AVANTAJ: latenta mica, conformitate date (GDPR)\n```\n\nCHALLENGES:\n- Cross-shard queries: JOIN intre tabele pe shards diferite = costisitor\n- Distributed transactions: ACID cross-shard e foarte complex\n- Resharding: adaugare shard nou = redistribuire date\n- Schema changes: trebuie aplicate pe toate sharduri"
      },
      {
        "order": 4,
        "title": "Implementare practica — connection pooling si routing",
        "content": "Cum implementezi read replicas si sharding in cod Node.js.\n\n```js\n// Read Replica routing cu mysql2:\nconst mysql = require('mysql2/promise');\n\n// Connection pool pentru master (writes):\nconst masterPool = mysql.createPool({\n  host: process.env.DB_MASTER_HOST,\n  user: 'app',\n  password: process.env.DB_PASSWORD,\n  database: 'mydb',\n  connectionLimit: 10,\n});\n\n// Connection pools pentru replici (reads):\nconst replicaPools = [\n  mysql.createPool({ host: process.env.DB_REPLICA1_HOST, ... }),\n  mysql.createPool({ host: process.env.DB_REPLICA2_HOST, ... }),\n];\nlet replicaIndex = 0;\n\n// Round-robin replica selection:\nfunction getReadPool() {\n  const pool = replicaPools[replicaIndex];\n  replicaIndex = (replicaIndex + 1) % replicaPools.length;\n  return pool;\n}\n\n// Functii helper:\nasync function query(sql, params) {\n  return getReadPool().execute(sql, params);\n}\n\nasync function mutate(sql, params) {\n  return masterPool.execute(sql, params);\n}\n\n// Utilizare:\nconst [users] = await query('SELECT * FROM users WHERE id = ?', [1]);\nawait mutate('UPDATE users SET name = ? WHERE id = ?', ['Ana', 1]);\n\n// PgBouncer pentru PostgreSQL connection pooling:\n// pgbouncer.ini:\n// [databases]\n// mydb = host=127.0.0.1 port=5432 dbname=mydb\n// pool_mode = transaction  -- Cel mai eficient\n// max_client_conn = 1000\n// default_pool_size = 25\n\n// Prisma cu read replicas:\n// schema.prisma:\n// datasource db {\n//   provider = \"postgresql\"\n//   url      = env(\"DATABASE_URL\")\n//   directUrl = env(\"DIRECT_URL\")  // Pentru migrari, direct la master\n// }\n```\n\nLA INTERVIU: Cum scalezi o baza de date MySQL? Read replicas pentru read scaling, connection pooling (ProxySQL, PgBouncer), query optimization, caching (Redis), eventual sharding daca nu ajunge."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Read replica rol",
        "question": "Principala utilizare a read replica-elor in MySQL/PostgreSQL?",
        "options": [
          "Backup exclusiv",
          "Distribuirea sarcinii de citire (READ) — masterul se ocupa de write-uri",
          "Failover exclusiv",
          "Testing"
        ],
        "answer": "Distribuirea sarcinii de citire (READ) — masterul se ocupa de write-uri",
        "explanation": "Master: INSERT/UPDATE/DELETE. Replici: SELECT pentru rapoarte, listinguri, API-uri read-heavy.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "Replication lag",
        "question": "Ce este replication lag?",
        "options": [
          "Intarzierea de la CREATE TABLE",
          "Intarzierea intre momentul write-ului pe master si aplicarea lui pe slave",
          "Latenta retea",
          "Dimensiunea binlog"
        ],
        "answer": "Intarzierea intre momentul write-ului pe master si aplicarea lui pe slave",
        "explanation": "Daca slave-ul e in urma cu 5 secunde, un user poate citi date vechi (eventual consistency).",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "SHOW SLAVE STATUS",
        "question": "Ce indica Seconds_Behind_Master = 0 in SHOW SLAVE STATUS?",
        "options": [
          "Slave oprit",
          "Slave-ul e sincronizat cu masterul — fara lag",
          "Lag de 0 secunde nu e posibil",
          "Replicare dezactivata"
        ],
        "answer": "Slave-ul e sincronizat cu masterul — fara lag",
        "explanation": "Seconds_Behind_Master = lag in secunde. 0 = sincronizat. NULL = Slave_IO_Running: No (deconectat).",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "Hash sharding avantaj",
        "question": "Avantajul hash sharding fata de range sharding?",
        "options": [
          "Mai simplu",
          "Distributie uniforma a datelor — evita hot spots",
          "Cross-shard queries mai usoare",
          "Reshard mai simplu"
        ],
        "answer": "Distributie uniforma a datelor — evita hot spots",
        "explanation": "Range sharding: toti userii noi pot ajunge pe acelasi shard (hot spot). Hash: distribuit uniform.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "Cross-shard JOIN",
        "question": "Care este principala dificultate a sharding-ului?",
        "options": [
          "Setup complicat",
          "Cross-shard queries (JOIN intre date pe shards diferite) sunt costisitoare sau imposibile",
          "Stocare extra",
          "Backup complicat"
        ],
        "answer": "Cross-shard queries (JOIN intre date pe shards diferite) sunt costisitoare sau imposibile",
        "explanation": "In baza de date shardizata: un JOIN intre users (shard 1) si orders (shard 2) necesita multiple round-trips.",
        "difficulty": "hard"
      },
      {
        "number": 6,
        "name": "Connection pool",
        "question": "De ce este connection pooling esential in aplicatii web?",
        "options": [
          "Securitate",
          "Conexiunile DB sunt scumpe — pool-ul le refoloseste (O(ms) vs O(seconds) pentru conexiune noua)",
          "Replicare",
          "Indexare"
        ],
        "answer": "Conexiunile DB sunt scumpe — pool-ul le refoloseste (O(ms) vs O(seconds) pentru conexiune noua)",
        "explanation": "Fara pool: fiecare request web deschide si inchide o conexiune DB. Pool: reutilizeaza conexiuni existente.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "Semisync replication",
        "question": "Avantajul replicarii semi-sincrone fata de cea asincron?",
        "options": [
          "Mai rapida",
          "Masterul asteapta confirmare de la minim un slave inainte de COMMIT — reduce pierderea datelor la crash",
          "Mai simpla",
          "Mai ieftina"
        ],
        "answer": "Masterul asteapta confirmare de la minim un slave inainte de COMMIT — reduce pierderea datelor la crash",
        "explanation": "Async: potential data loss la crash master. Semi-sync: cel putin un slave are datele. Tradeoff: latenta mai mare.",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "Vertical vs horizontal",
        "question": "Cand devine vertical scaling (scale-up) insuficient?",
        "options": [
          "Niciodata",
          "Cand cel mai puternic server disponibil nu face fata sau costul e prohibitiv",
          "La 1000 utilizatori",
          "La 10GB date"
        ],
        "answer": "Cand cel mai puternic server disponibil nu face fata sau costul e prohibitiv",
        "explanation": "Cel mai puternic server are limite fizice si costul creste exponential. Horizontal scaling = scalabilitate liniara.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "PgBouncer pool mode",
        "question": "Cel mai eficient mod de pooling PgBouncer pentru aplicatii web este?",
        "options": [
          "Session pooling",
          "Transaction pooling — conexiunea e returnata la pool dupa fiecare tranzactie",
          "Statement pooling",
          "Connection pooling"
        ],
        "answer": "Transaction pooling — conexiunea e returnata la pool dupa fiecare tranzactie",
        "explanation": "Session: conexiunea e a clientului toata sesiunea. Transaction: conexiunea e eliberata dupa fiecare tranzactie (mai eficient).",
        "difficulty": "hard"
      },
      {
        "number": 10,
        "name": "Coding: read/write routing",
        "question": "Implementeaza in Node.js o functie db care ruteaza automat SELECT-urile la replica si celelalte query-uri la master.",
        "options": [],
        "answer": "",
        "explanation": "Regex sau string check pe prima parte a query-ului. SELECT => replica, rest => master.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "Coding: shard routing",
        "question": "Implementeaza o functie getShardForUser(userId) care foloseste hash sharding cu 4 shard-uri, si un array de connection pools per shard.",
        "options": [],
        "answer": "",
        "explanation": "shard = userId % numShards. Return shardPools[shard]. Distributie uniforma.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "GTID replication",
        "question": "Ce este GTID (Global Transaction Identifier) in MySQL replication?",
        "options": [
          "Un index global",
          "ID unic per tranzactie care simplifica failover si evita duplicate transactions",
          "ID al serverului",
          "ID al binlog-ului"
        ],
        "answer": "ID unic per tranzactie care simplifica failover si evita duplicate transactions",
        "explanation": "GTID = server_uuid:transaction_id. La failover, slave-ul stie exact unde a ramas fara sa depinda de pozitia din binlog.",
        "difficulty": "hard"
      },
      {
        "number": 13,
        "name": "Resharding cost",
        "question": "Care este principala dificultate la adaugarea unui shard nou intr-un sistem shardizat?",
        "options": [
          "Configurare",
          "Redistribuirea datelor existente (rehashing/resharding) — downtime sau complexitate enorma",
          "Cost hardware",
          "Replicare"
        ],
        "answer": "Redistribuirea datelor existente (rehashing/resharding) — downtime sau complexitate enorma",
        "explanation": "La 4 shard-uri => 5 shard-uri: jumatate din date trebuie mutate. Consistent hashing reduce impactul.",
        "difficulty": "hard"
      },
      {
        "number": 14,
        "name": "Read-your-own-writes",
        "question": "Ce este modelul de consistenta 'read-your-own-writes'?",
        "options": [
          "Citesti mereu date actuale",
          "Un user vede intotdeauna modificarile proprii, chiar daca alte noduri au lag",
          "Nu citesti date sterse",
          "Citesti in ordine"
        ],
        "answer": "Un user vede intotdeauna modificarile proprii, chiar daca alte noduri au lag",
        "explanation": "Solutie: dupa write, citeste din master pentru acel user sau asteapta slave-ul sa se sincronizeze.",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Patroni si HA",
        "question": "Ce face Patroni in contextul PostgreSQL?",
        "options": [
          "Connection pooler",
          "Manager de High Availability — detecteaza caderea masterului si promoveaza automat un slave",
          "Backup tool",
          "Sharding manager"
        ],
        "answer": "Manager de High Availability — detecteaza caderea masterului si promoveaza automat un slave",
        "explanation": "Patroni + etcd/Consul: quorum pentru alegerea liderului, failover automat. Standard industry pentru HA PostgreSQL.",
        "difficulty": "hard"
      }
    ]
  },
  {
    "slug": "sql-design-patterns",
    "title": "26. Database Design Patterns",
    "order": 26,
    "theory": [
      {
        "order": 1,
        "title": "Soft Delete — stergere logica",
        "content": "Soft delete pastreaza inregistrarile marcate ca sterse in loc sa le elimine fizic.\n\n```sql\n-- Pattern clasic:\nALTER TABLE utilizatori ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;\n\n-- Delete logic (nu sterge fizic):\nUPDATE utilizatori SET deleted_at = NOW() WHERE id = 42;\n\n-- Toate query-urile trebuie sa filtreze:\nSELECT * FROM utilizatori WHERE deleted_at IS NULL;  -- Utilizatori activi\nSELECT * FROM utilizatori WHERE deleted_at IS NOT NULL;  -- Stersi (pentru admin)\n\n-- Problema: uitati sa adaugi filtrul => date compromise\n-- Solutie: VIEW care ascunde deleted:\nCREATE VIEW utilizatori_activi AS\nSELECT * FROM utilizatori WHERE deleted_at IS NULL;\n\n-- Undelete:\nUPDATE utilizatori SET deleted_at = NULL WHERE id = 42;\n\n-- AVANTAJE soft delete:\n-- 1. Audit: stii cand si de cine a fost sters\n-- 2. Undelete: recuperare accidentala\n-- 3. GDPR: 'stergere' logica + reala dupa 30 zile\n-- 4. Referinte FK: nu se rupe lantul de referinte\n\n-- DEZAVANTAJE:\n-- 1. Toate query-urile trebuie sa includa filtrul\n-- 2. Tabela creste (date vechi acumulate)\n-- 3. Indecsi mai mari\n-- 4. UNIQUE constraints: email UNIQUE + soft delete = problema\n\n-- Solutie UNIQUE cu soft delete:\n-- Partial unique index (PostgreSQL):\nCREATE UNIQUE INDEX idx_unique_email\nON utilizatori(email)\nWHERE deleted_at IS NULL;\n-- Permite duplicate email daca unul e sters (deleted_at IS NOT NULL)\n\n-- MySQL (coloana computed):\nALTER TABLE utilizatori\n  ADD COLUMN email_unique AS (\n    IF(deleted_at IS NULL, email, NULL)\n  ) STORED;\nALTER TABLE utilizatori ADD UNIQUE(email_unique);\n```"
      },
      {
        "order": 2,
        "title": "Audit Tables — istoricul modificarilor",
        "content": "Audit tables pastreaza istoricul complet al modificarilor pentru conformitate si debugging.\n\n```sql\n-- Pattern 1: Tabela de audit separata\nCREATE TABLE utilizatori_audit (\n  audit_id BIGINT AUTO_INCREMENT PRIMARY KEY,\n  actiune ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,\n  utilizator_id INT NOT NULL,\n  modificat_de INT,  -- User-ul care a facut modificarea\n  modificat_la TIMESTAMP DEFAULT NOW(),\n  date_vechi JSON,  -- Starea inainte\n  date_noi JSON     -- Starea dupa\n);\n\n-- Trigger pentru audit automat (MySQL):\nDELIMITER //\nCREATE TRIGGER trg_audit_update\nAFTER UPDATE ON utilizatori\nFOR EACH ROW\nBEGIN\n  INSERT INTO utilizatori_audit (\n    actiune, utilizator_id,\n    date_vechi, date_noi\n  ) VALUES (\n    'UPDATE',\n    OLD.id,\n    JSON_OBJECT('email', OLD.email, 'rol', OLD.rol, 'activ', OLD.activ),\n    JSON_OBJECT('email', NEW.email, 'rol', NEW.rol, 'activ', NEW.activ)\n  );\nEND;//\nDELIMITER ;\n\n-- Pattern 2: Temporal tables (MySQL 8+)\n-- Pastreaza automat istoricul versiunilor:\nCREATE TABLE produse (\n  id INT PRIMARY KEY,\n  pret DECIMAL(10,2),\n  start_time DATETIME(6) GENERATED ALWAYS AS ROW START,\n  end_time DATETIME(6) GENERATED ALWAYS AS ROW END,\n  PERIOD FOR SYSTEM_TIME(start_time, end_time)\n) WITH SYSTEM VERSIONING;\n\n-- Selecteaza starea la un moment din trecut:\nSELECT * FROM produse FOR SYSTEM_TIME AS OF '2024-01-15 12:00:00';\n\n-- Toata istoria unui rand:\nSELECT * FROM produse FOR SYSTEM_TIME ALL WHERE id = 5;\n```"
      },
      {
        "order": 3,
        "title": "CQRS si Event Sourcing concepte",
        "content": "CQRS = Command Query Responsibility Segregation, Event Sourcing = baza de date ca log de evenimente.\n\n```\nCQRS - Separarea read de write:\n\nTraditional:\n  Client --> [Single Model] <--> Database\n  Acelasi model pentru citire si scriere\n\nCQRS:\n  Client --> [Write Model (Commands)] --> Write DB (normalized)\n                                          |   Sync/Replication\n  Client <-- [Read Model (Queries)] <--- Read DB (denormalized, optimized)\n\n  Write DB: normalizat, ACID, validari complexe\n  Read DB: denormalizat pentru speed (poate fi Redis, Elasticsearch)\n```\n\n```sql\n-- CQRS cu SQL:\n-- Write side (normalizat):\nCREATE TABLE orders (\n  id UUID PRIMARY KEY,\n  user_id INT REFERENCES users(id),\n  status VARCHAR(20),\n  created_at TIMESTAMP\n);\n\n-- Read side (denormalizat, optimizat pentru display):\nCREATE TABLE orders_read_model (\n  order_id UUID PRIMARY KEY,\n  user_email VARCHAR(255),  -- Denormalizat (nu JOIN)\n  user_name VARCHAR(255),\n  total_amount DECIMAL(10,2),  -- Precalculat\n  items_count INT,\n  status VARCHAR(20),\n  created_at TIMESTAMP,\n  -- Toate datele pentru un listing fara JOIN\n  INDEX(user_email),\n  INDEX(status, created_at)\n);\n\n-- Event Sourcing:\nCREATE TABLE events (\n  id BIGINT AUTO_INCREMENT PRIMARY KEY,\n  aggregate_id UUID NOT NULL,  -- ID-ul entitatii (order, user)\n  aggregate_type VARCHAR(50),   -- 'Order', 'User'\n  event_type VARCHAR(100),      -- 'OrderCreated', 'ItemAdded'\n  payload JSON,\n  created_at TIMESTAMP DEFAULT NOW(),\n  INDEX(aggregate_id, created_at)\n);\n\n-- Reconstruire stare din evenimente:\nSELECT * FROM events\nWHERE aggregate_id = 'uuid-123' AND aggregate_type = 'Order'\nORDER BY created_at;\n-- Aplica evenimentele in ordine => starea curenta\n```"
      },
      {
        "order": 4,
        "title": "Patterns clasice de schema — EAV, Polymorphic, STI",
        "content": "Patterns comune pentru scheme complexe sau flexibile.\n\n```sql\n-- EAV (Entity-Attribute-Value) — schema flexibila:\nCREATE TABLE produse (id INT PRIMARY KEY, categorie VARCHAR(50));\nCREATE TABLE produs_atribute (\n  produs_id INT REFERENCES produse(id),\n  atribut VARCHAR(100),\n  valoare TEXT,\n  PRIMARY KEY (produs_id, atribut)\n);\n-- Laptop: { cpu: 'i7', ram: '16GB', ssd: '512GB' }\n-- Tricou: { marime: 'L', culoare: 'albastru' }\n-- PROBLEMA: query-uri complexe, lent, fara tipare, JOIN-uri costisitoare\n-- ALTERNATIVA MODERNA: JSONB column\n\n-- Polymorphic Association:\nCREATE TABLE comentarii (\n  id INT PRIMARY KEY,\n  body TEXT,\n  commentable_type VARCHAR(50),  -- 'Post', 'Video', 'Product'\n  commentable_id INT,            -- ID-ul entitatii\n  INDEX(commentable_type, commentable_id)\n);\n-- Comentarii pentru orice tip de entitate fara FK separat\n-- PROBLEMA: nu poti defini FK constraint\n-- SOLUTIE ALTERNATIVA: tabel de legatura per tip\nCREATE TABLE post_comentarii (post_id INT REFERENCES posts(id), comentariu_id INT ...);\nCREATE TABLE video_comentarii (video_id INT REFERENCES videos(id), ...);\n\n-- STI (Single Table Inheritance) — motenire in o singura tabela:\nCREATE TABLE vehicule (\n  id INT PRIMARY KEY,\n  tip ENUM('masina', 'camion', 'motocicleta'),\n  marca VARCHAR(100),\n  model VARCHAR(100),\n  numar_roti INT,\n  -- Masina:\n  numar_portiere INT,\n  -- Camion:\n  capacitate_tone DECIMAL(5,2),\n  -- Motocicleta:\n  cilindree INT\n  -- Multe NULL-uri pentru campuri irelevante tipului\n);\n-- ALTERNATIVA: CTI (Class Table Inheritance)\nCREATE TABLE vehicule (id INT PRIMARY KEY, tip VARCHAR(20), marca VARCHAR(100));\nCREATE TABLE masini (vehicul_id INT PRIMARY KEY REFERENCES vehicule(id), numar_portiere INT);\nCREATE TABLE camioane (vehicul_id INT PRIMARY KEY REFERENCES vehicule(id), capacitate_tone DECIMAL);\n```\n\nLA INTERVIU: Cand folosesti EAV? Evita EAV daca posibil — prefer JSONB. EAV = performanta slaba, schema greu de intretinut. Acceptabil daca schema e cu adevarat necunoscuta la design time."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Soft delete query",
        "question": "Intr-o schema cu soft delete (deleted_at IS NULL = activ), cum selectezi NUMAI utilizatorii activi?",
        "options": [
          "SELECT * FROM users",
          "SELECT * FROM users WHERE deleted_at IS NULL",
          "SELECT * FROM users WHERE deleted = 0",
          "SELECT * FROM users WHERE active = true"
        ],
        "answer": "SELECT * FROM users WHERE deleted_at IS NULL",
        "explanation": "Toti query-urile trebuie sa includa WHERE deleted_at IS NULL pentru a exclude inregistrarile sterse.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "Soft delete UNIQUE",
        "question": "Problema cu UNIQUE(email) in combinatie cu soft delete?",
        "options": [
          "Nu exista probleme",
          "Un user sters (deleted_at NOT NULL) blocheaza re-inregistrarea cu acelasi email",
          "Email e case-sensitive",
          "Indexul e prea mare"
        ],
        "answer": "Un user sters (deleted_at NOT NULL) blocheaza re-inregistrarea cu acelasi email",
        "explanation": "Solutie: partial unique index WHERE deleted_at IS NULL (PostgreSQL) sau coloana calculated cu NULL (MySQL).",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "Audit trigger",
        "question": "De ce folosesti trigger pentru audit in loc de logica in aplicatie?",
        "options": [
          "E mai rapid",
          "Captureaza toate modificarile indiferent de sursa (aplicatie, SQL direct, alte scripturi)",
          "E mai simplu",
          "Triggere sunt mai sigure"
        ],
        "answer": "Captureaza toate modificarile indiferent de sursa (aplicatie, SQL direct, alte scripturi)",
        "explanation": "Logica applicatie: doar daca trece prin app. Trigger: orice UPDATE/DELETE, oricine face, e auditat.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "CQRS read model",
        "question": "In CQRS, read model-ul este de obicei?",
        "options": [
          "Normalizat si strict ACID",
          "Denormalizat si optimizat pentru query-uri de display (fara JOIN)",
          "Identic cu write model",
          "Un fisier JSON"
        ],
        "answer": "Denormalizat si optimizat pentru query-uri de display (fara JOIN)",
        "explanation": "Read model: user_email precalculat, total suma precalculata. Nu are sens sa normalizezi ce afisezi des.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "Event Sourcing",
        "question": "Principalul avantaj al Event Sourcing?",
        "options": [
          "Mai rapid",
          "Istoricul complet al schimbarilor — poti reconstrui starea la orice moment din trecut",
          "Mai simplu de implementat",
          "Mai putin spatiu"
        ],
        "answer": "Istoricul complet al schimbarilor — poti reconstrui starea la orice moment din trecut",
        "explanation": "Starea = suma evenimentelor aplicate. Time travel: aplici evenimentele pana la o data => starea de atunci.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "EAV antipattern",
        "question": "De ce EAV (Entity-Attribute-Value) este considerat antipattern?",
        "options": [
          "E greu de scris",
          "Query-uri complexe, lent, fara type safety, JOIN-uri costisitoare — JSONB e alternativa mai buna",
          "Nu e normalizat",
          "Nu are indecsi"
        ],
        "answer": "Query-uri complexe, lent, fara type safety, JOIN-uri costisitoare — JSONB e alternativa mai buna",
        "explanation": "SELECT * FROM produse JOIN attr WHERE atribut='cpu' AND valoare='i7' AND EXISTS (SELECT ... atribut='ram'...) = cosmarul SQL.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "STI vs CTI",
        "question": "Principala diferenta STI (Single Table Inheritance) vs CTI (Class Table Inheritance)?",
        "options": [
          "Identice",
          "STI: o tabela cu multe NULL-uri. CTI: tabela parinte + tabele copil per subtip (mai normal dar JOIN necesar)",
          "CTI e mai rapid",
          "STI e deprecated"
        ],
        "answer": "STI: o tabela cu multe NULL-uri. CTI: tabela parinte + tabele copil per subtip (mai normal dar JOIN necesar)",
        "explanation": "STI simplu dar 'polueaza' schema. CTI: mai curat, type-safe, dar query-uri necesita JOIN.",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "Temporal tables",
        "question": "Ce fac MySQL Temporal Tables (WITH SYSTEM VERSIONING)?",
        "options": [
          "Adauga timestamp la INSERT",
          "Pastreaza automat istoricul versiunilor randurilor — time travel queries",
          "Sorteaza pe timestamp",
          "Cache temporal"
        ],
        "answer": "Pastreaza automat istoricul versiunilor randurilor — time travel queries",
        "explanation": "FOR SYSTEM_TIME AS OF '2024-01-01' returneaza starea bazei de date la acea data.",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "Polymorphic association",
        "question": "Problema FK cu polymorphic associations (commentable_type + commentable_id)?",
        "options": [
          "Nu exista problema",
          "Nu poti defini FOREIGN KEY constraint — baza de date nu valideaza integritatea referentiala",
          "E prea lent",
          "Nu suporta JOIN"
        ],
        "answer": "Nu poti defini FOREIGN KEY constraint — baza de date nu valideaza integritatea referentiala",
        "explanation": "FK necesita referinta la o singura tabela. Polymorphic = tabela dinamica, imposibil de definit FK.",
        "difficulty": "hard"
      },
      {
        "number": 10,
        "name": "Coding: soft delete view",
        "question": "Creeaza tabela users cu soft delete si un view users_active. Scrie query pentru delete logic si undelete.",
        "options": [],
        "answer": "",
        "explanation": "deleted_at TIMESTAMP NULL. UPDATE SET deleted_at = NOW() pentru delete. NULL pentru undelete. VIEW cu WHERE.",
        "difficulty": "easy"
      },
      {
        "number": 11,
        "name": "Coding: audit trigger",
        "question": "Creeaza un trigger MySQL AFTER UPDATE pe tabela produse care insereaza in produse_audit cu id, pret_vechi, pret_nou, modificat_la.",
        "options": [],
        "answer": "",
        "explanation": "AFTER UPDATE trigger. OLD.pret pentru valoarea anterioara, NEW.pret pentru cea noua. NOW() pentru timestamp.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Coding: CQRS read model",
        "question": "Creeaza un read model denormalizat orders_summary cu: order_id, user_email, total_items, total_amount, status. Populeaza din tabele normalize.",
        "options": [],
        "answer": "",
        "explanation": "INSERT INTO orders_summary SELECT + JOIN + SUM/COUNT + GROUP BY. Read model = denormalizat pentru speed.",
        "difficulty": "hard"
      },
      {
        "number": 13,
        "name": "gdpr soft delete",
        "question": "Cum implementezi GDPR 'dreptul de a fi uitat' cu soft delete?",
        "options": [
          "DELETE fizic imediat",
          "Soft delete + job periodic care sterge fizic datele cu deleted_at > 30 de zile",
          "Anonimizare imediata",
          "Soft delete permanent"
        ],
        "answer": "Soft delete + job periodic care sterge fizic datele cu deleted_at > 30 de zile",
        "explanation": "Soft delete imediat (UX instant). Job cron: DELETE FROM users WHERE deleted_at < NOW() - INTERVAL 30 DAY.",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "Event store aggregate",
        "question": "In Event Sourcing, ce este un 'aggregate'?",
        "options": [
          "O functie SQL",
          "O entitate (ex: Order, User) identificata prin aggregate_id, al carei stat e reconstruit din evenimente",
          "Un tabel de agregare",
          "Un index compus"
        ],
        "answer": "O entitate (ex: Order, User) identificata prin aggregate_id, al carei stat e reconstruit din evenimente",
        "explanation": "Aggregate = unitate de consistenta. OrderCreated + ItemAdded + OrderShipped = starea curenta a comenzii.",
        "difficulty": "hard"
      },
      {
        "number": 15,
        "name": "Schema versioning",
        "question": "Care este cel mai bun tool pentru gestionarea migrarilor de schema intr-un proiect de echipa?",
        "options": [
          "SQL manual",
          "Tool de migrare (Flyway, Liquibase, Prisma Migrate, Alembic) — versioning si history",
          "Backup/restore",
          "Schema compare tool"
        ],
        "answer": "Tool de migrare (Flyway, Liquibase, Prisma Migrate, Alembic) — versioning si history",
        "explanation": "Migrari versionate in git: oricine poate reproduce exact schema de productie, forward si backward migrations.",
        "difficulty": "easy"
      }
    ]
  },
  {
    "slug": "sql-nodejs",
    "title": "27. SQL in aplicatii Node.js",
    "order": 27,
    "theory": [
      {
        "order": 1,
        "title": "mysql2 si pg — drivere native",
        "content": "Driverele native pentru MySQL si PostgreSQL in Node.js.\n\n```bash\nnpm install mysql2\nnpm install pg\n```\n\n```js\n// mysql2 — PROMISE API:\nconst mysql = require('mysql2/promise');\n\n// Connection pool (RECOMANDAT):\nconst pool = mysql.createPool({\n  host: process.env.DB_HOST || 'localhost',\n  user: process.env.DB_USER,\n  password: process.env.DB_PASSWORD,\n  database: process.env.DB_NAME,\n  connectionLimit: 10,    // Max conexiuni simultane\n  waitForConnections: true,\n  queueLimit: 0,           // Fara limita coada\n});\n\n// Query simplu:\nconst [rows] = await pool.execute('SELECT * FROM produse WHERE activ = ?', [1]);\n\n// pg (node-postgres) — Pool:\nconst { Pool } = require('pg');\nconst pgPool = new Pool({\n  connectionString: process.env.DATABASE_URL,\n  // sau:\n  host: 'localhost',\n  database: 'mydb',\n  user: 'postgres',\n  password: process.env.PG_PASSWORD,\n  port: 5432,\n  max: 10,                 // Max connections\n  idleTimeoutMillis: 30000,\n  connectionTimeoutMillis: 2000,\n});\n\n// Query pg:\nconst result = await pgPool.query(\n  'SELECT * FROM produse WHERE categorie_id = $1 AND pret < $2',\n  [5, 1000]\n);\nconsole.log(result.rows);\n\n// DIFERENTA SINTAXA PARAMETRI:\n// mysql2: ? placeholder\nawait pool.execute('SELECT * FROM t WHERE id = ?', [1]);\n\n// pg: $1, $2, $N placeholder\nawait pgPool.query('SELECT * FROM t WHERE id = $1', [1]);\n```"
      },
      {
        "order": 2,
        "title": "Parameterized queries — prevenire SQL injection",
        "content": "SQL injection este una dintre cele mai periculoase vulnerabilitati. Parameterized queries sunt solutia.\n\n```js\n// SQL INJECTION — PERICULOS (NICIODATA asa):\nasync function getUserDangerous(email) {\n  // Ce se intampla daca email = \"' OR '1'='1\" ?\n  const query = `SELECT * FROM users WHERE email = '${email}'`;\n  // Query devine: SELECT * FROM users WHERE email = '' OR '1'='1'\n  // Returneaza TOTI utilizatorii!\n  const [rows] = await pool.query(query);\n  return rows;\n}\n\n// CORECT — parameterized query:\nasync function getUserSafe(email) {\n  const [rows] = await pool.execute(\n    'SELECT * FROM users WHERE email = ?',\n    [email]\n  );\n  return rows[0];\n}\n\n// Execute vs Query in mysql2:\n// execute: prepared statement (compilat o data, refolosit) — mai rapid la repeat\n// query: compilat la fiecare apel — ok pentru query-uri unice\n\n// BULK INSERT sigur:\nasync function insertProducts(products) {\n  const values = products.map(p => [p.name, p.price, p.stock]);\n  const [result] = await pool.execute(\n    'INSERT INTO products (name, price, stock) VALUES ?',\n    [values]  // mysql2 suporta arrays pentru bulk\n  );\n  return result.insertId;\n}\n\n// INSERT dinamic sigur (cu pg):\nasync function createUser(userData) {\n  const keys = Object.keys(userData);\n  const values = Object.values(userData);\n  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');\n  const cols = keys.join(', ');\n\n  const result = await pgPool.query(\n    `INSERT INTO users (${cols}) VALUES (${placeholders}) RETURNING *`,\n    values\n  );\n  return result.rows[0];\n}\n\n// Exemplu: createUser({ name: 'Ana', email: 'ana@test.com' })\n// => INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *\n```\n\nLA INTERVIU: Ce este SQL injection? Injectarea de cod SQL in input user. Prevenire: parameterized queries (prepared statements) — datele nu sunt tratate ca cod SQL."
      },
      {
        "order": 3,
        "title": "Tranzactii in Node.js",
        "content": "Gestionarea tranzactiilor cu async/await in Node.js.\n\n```js\n// mysql2 — tranzactie manuala:\nasync function transferFunds(fromId, toId, amount) {\n  const conn = await pool.getConnection();\n  try {\n    await conn.beginTransaction();\n\n    const [sender] = await conn.execute(\n      'SELECT sold FROM conturi WHERE id = ? FOR UPDATE',\n      [fromId]\n    );\n    if (sender[0].sold < amount) {\n      throw new Error('Fonduri insuficiente');\n    }\n\n    await conn.execute(\n      'UPDATE conturi SET sold = sold - ? WHERE id = ?',\n      [amount, fromId]\n    );\n    await conn.execute(\n      'UPDATE conturi SET sold = sold + ? WHERE id = ?',\n      [amount, toId]\n    );\n\n    await conn.commit();\n    return { success: true };\n  } catch (err) {\n    await conn.rollback();\n    throw err;\n  } finally {\n    conn.release();  // MEREU elibereaza conexiunea\n  }\n}\n\n// pg — tranzactie:\nasync function createOrderPg(userId, items) {\n  const client = await pgPool.connect();\n  try {\n    await client.query('BEGIN');\n\n    const orderResult = await client.query(\n      'INSERT INTO orders (user_id) VALUES ($1) RETURNING id',\n      [userId]\n    );\n    const orderId = orderResult.rows[0].id;\n\n    for (const item of items) {\n      await client.query(\n        'INSERT INTO order_items (order_id, product_id, qty, price) VALUES ($1, $2, $3, $4)',\n        [orderId, item.productId, item.qty, item.price]\n      );\n      await client.query(\n        'UPDATE products SET stock = stock - $1 WHERE id = $2',\n        [item.qty, item.productId]\n      );\n    }\n\n    await client.query('COMMIT');\n    return orderId;\n  } catch (e) {\n    await client.query('ROLLBACK');\n    throw e;\n  } finally {\n    client.release();\n  }\n}\n```"
      },
      {
        "order": 4,
        "title": "Connection pooling, error handling si best practices",
        "content": "Practici bune pentru productie cu drivere SQL Node.js.\n\n```js\n// Pool events si monitoring:\npool.on('connection', (conn) => {\n  console.log('Conexiune noua:', conn.threadId);\n});\n\npool.on('error', (err) => {\n  console.error('Pool error:', err);\n  if (err.code === 'PROTOCOL_CONNECTION_LOST') {\n    // Reconecteaza\n  }\n});\n\n// pg error handling:\npgPool.on('error', (err, client) => {\n  console.error('Unexpected error on idle client', err);\n  process.exit(-1);\n});\n\n// Helper pentru pagination sigur:\nasync function paginate(tableName, { page = 1, limit = 20, orderBy = 'id', orderDir = 'ASC' }) {\n  // Valideaza orderBy (SQL injection via column name):\n  const allowedColumns = ['id', 'created_at', 'name', 'price'];\n  if (!allowedColumns.includes(orderBy)) throw new Error('Invalid orderBy');\n  if (!['ASC', 'DESC'].includes(orderDir)) throw new Error('Invalid orderDir');\n\n  const offset = (page - 1) * limit;\n  const [rows] = await pool.execute(\n    `SELECT * FROM ?? ORDER BY ?? ${orderDir} LIMIT ? OFFSET ?`,\n    [tableName, orderBy, limit, offset]\n  );\n  const [[{ total }]] = await pool.execute(\n    'SELECT COUNT(*) as total FROM ??',\n    [tableName]\n  );\n  return {\n    data: rows,\n    pagination: { total, page, limit, pages: Math.ceil(total / limit) },\n  };\n}\n// ?? in mysql2 = identifier (table/column name) escaping\n\n// Healthcheck endpoint:\napp.get('/health', async (req, res) => {\n  try {\n    await pool.execute('SELECT 1');\n    res.json({ db: 'ok' });\n  } catch (e) {\n    res.status(503).json({ db: 'down', error: e.message });\n  }\n});\n```\n\nLA INTERVIU: Cum previi SQL injection cu mysql2/pg? Parameterized queries (?/$ placeholders). Column names/table names cu ?? (mysql2) sau whitelist validation — nu pot fi parameterize la nivel de driver."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "mysql2 vs query",
        "question": "Diferenta execute vs query in mysql2?",
        "options": [
          "Identice",
          "execute: prepared statement (compilat o data, refolosit, mai rapid la repetitie). query: compilat la fiecare apel",
          "execute e async",
          "query suporta mai multe optiuni"
        ],
        "answer": "execute: prepared statement (compilat o data, refolosit, mai rapid la repetitie). query: compilat la fiecare apel",
        "explanation": "execute = prepared statement server-side. La query-uri frecvente (GET user), execute e mai eficient.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "pg placeholder",
        "question": "In pg (node-postgres), cum arata placeholder-ul pentru parametri?",
        "options": [
          "?",
          "$1, $2, $N (numbered)",
          "@param",
          ":param"
        ],
        "answer": "$1, $2, $N (numbered)",
        "explanation": "pg: 'SELECT * FROM t WHERE id = $1 AND status = $2' cu values: [1, 'active']. mysql2 foloseste ?.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "SQL injection",
        "question": "De ce este PERICULOASA concatenarea directa a input-ului in SQL?",
        "options": [
          "E lenta",
          "Permite SQL injection: input malitios poate executa orice SQL (DROP TABLE, bypass auth)",
          "Nu e portabila",
          "E deprecated"
        ],
        "answer": "Permite SQL injection: input malitios poate executa orice SQL (DROP TABLE, bypass auth)",
        "explanation": "email = \"' OR '1'='1\" transforma un SELECT intr-un query care returneaza toti utilizatorii.",
        "difficulty": "easy"
      },
      {
        "number": 4,
        "name": "conn.release",
        "question": "De ce este OBLIGATORIE conn.release() in finally block la mysql2?",
        "options": [
          "Buna practica",
          "Returneaza conexiunea la pool — fara release, pool-ul se epuizeaza si aplicatia se blochheaza",
          "Inchide DB",
          "Confirma tranzactia"
        ],
        "answer": "Returneaza conexiunea la pool — fara release, pool-ul se epuizeaza si aplicatia se blochheaza",
        "explanation": "Pool are connectionLimit conexiuni. Fara release la fiecare utilizare, pool-ul se umple si orice request nou asteapta.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "RETURNING pg",
        "question": "La ce serveste clauza RETURNING in PostgreSQL (prin pg driver)?",
        "options": [
          "Rollback la eroare",
          "Returneaza randurile afectate de INSERT/UPDATE/DELETE fara a face un SELECT separat",
          "Returneaza count",
          "Validare"
        ],
        "answer": "Returneaza randurile afectate de INSERT/UPDATE/DELETE fara a face un SELECT separat",
        "explanation": "INSERT ... RETURNING id — obtii ID-ul generat instant. Echivalent MySQL: result.insertId.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "Identifier injection",
        "question": "De ce nu poti parametriza table/column names cu ? sau $N?",
        "options": [
          "Bug in driver",
          "Parametrii SQL sunt pentru valori de date, nu pentru structura SQL (identifier). Folosesti whitelist.",
          "Poti, dar e mai lent",
          "Doar in PostgreSQL"
        ],
        "answer": "Parametrii SQL sunt pentru valori de date, nu pentru structura SQL (identifier). Folosesti whitelist.",
        "explanation": "ORDER BY $1 nu merge — $1 injectata ca string 'name', nu ca identifier SQL. Solutie: whitelist + `${col}` dupa validare.",
        "difficulty": "hard"
      },
      {
        "number": 7,
        "name": "pool connectionLimit",
        "question": "Ce se intampla cand toate conexiunile din pool sunt ocupate si vine un request nou?",
        "options": [
          "Eroare imediata",
          "Request-ul asteapta in coada pana o conexiune devine libera (daca waitForConnections: true)",
          "Se creeaza conexiune noua automat",
          "Pool se mareste"
        ],
        "answer": "Request-ul asteapta in coada pana o conexiune devine libera (daca waitForConnections: true)",
        "explanation": "waitForConnections: false => eroare imediata daca poolul e plin. queueLimit: 0 = coada infinita.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "FOR UPDATE mysql",
        "question": "De ce folosesti SELECT ... FOR UPDATE intr-o tranzactie de transfer fonduri?",
        "options": [
          "Citire mai rapida",
          "Blocheaza randul pentru scriere — previne race condition la citire + update concurent",
          "Returneaza data",
          "Optimizare"
        ],
        "answer": "Blocheaza randul pentru scriere — previne race condition la citire + update concurent",
        "explanation": "Fara FOR UPDATE: doua tranzactii citesc sold=100 simultan, amandoua scad 80 => sold negativ!",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "?? mysql2",
        "question": "La ce serveste ?? in query-urile mysql2?",
        "options": [
          "Doua valori",
          "Escapeaza un identifier (table sau column name)",
          "Query optional",
          "Comentariu"
        ],
        "answer": "Escapeaza un identifier (table sau column name)",
        "explanation": "pool.execute('SELECT * FROM ?? WHERE ??=?', ['users', 'email', 'test']) — ?? pentru table/column names.",
        "difficulty": "hard"
      },
      {
        "number": 10,
        "name": "Coding: parameterized query",
        "question": "Scrie o functie Node.js searchProducts(keyword, maxPrice) care cauta produse SIGUR (fara SQL injection) cu mysql2.",
        "options": [],
        "answer": "",
        "explanation": "Parameterized query cu ? pentru LIKE (adauga % in parametru) si pentru maxPrice. execute > query.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "Coding: transactie pg",
        "question": "Implementeaza createOrder(userId, items) cu pg care insereaza comanda, item-urile si scade stocul atomic.",
        "options": [],
        "answer": "",
        "explanation": "pgPool.connect(), BEGIN, INSERT RETURNING id, loop items cu INSERT + UPDATE stock, COMMIT/ROLLBACK, release.",
        "difficulty": "hard"
      },
      {
        "number": 12,
        "name": "Coding: pagination helper",
        "question": "Creeaza o functie paginateProduse(page, limit, sortBy) cu whitelist pentru sortBy, folosind mysql2.",
        "options": [],
        "answer": "",
        "explanation": "Whitelist sortBy inainte de a-l folosi in query. LIMIT si OFFSET parametrizate cu ?.",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "mysql2 destructor",
        "question": "Ce returneaza await pool.execute('SELECT * FROM users')?",
        "options": [
          "Array de rows",
          "[rows, fields] — destructurezi: const [rows] = await ...",
          "Object cu rows",
          "Promise de rows"
        ],
        "answer": "[rows, fields] — destructurezi: const [rows] = await ...",
        "explanation": "mysql2 returneaza [rows, fieldPackets]. Conventional: const [rows] = await pool.execute(...) — ignori fields.",
        "difficulty": "easy"
      },
      {
        "number": 14,
        "name": "pg rows",
        "question": "La pg (node-postgres), datele sunt accesibile la?",
        "options": [
          "result",
          "result.rows (array de obiecte)",
          "result.data",
          "result[0]"
        ],
        "answer": "result.rows (array de obiecte)",
        "explanation": "const result = await pool.query('SELECT ...'); const rows = result.rows; const first = result.rows[0];",
        "difficulty": "easy"
      },
      {
        "number": 15,
        "name": "Healthcheck DB",
        "question": "Care este cel mai simplu query pentru a verifica daca conexiunea la DB functioneaza?",
        "options": [
          "SELECT * FROM users LIMIT 1",
          "SELECT 1 (sau SELECT 1+1 in MySQL, SELECT 1 in PostgreSQL)",
          "SHOW TABLES",
          "PING"
        ],
        "answer": "SELECT 1 (sau SELECT 1+1 in MySQL, SELECT 1 in PostgreSQL)",
        "explanation": "SELECT 1 nu necesita niciun tabel, e instantaneu. Folosit in healthcheck endpoints si connection validation.",
        "difficulty": "easy"
      }
    ]
  },
  {
    "slug": "sql-python",
    "title": "28. SQL in aplicatii Python",
    "order": 28,
    "theory": [
      {
        "order": 1,
        "title": "psycopg2 — driver nativ PostgreSQL pentru Python",
        "content": "psycopg2 este cel mai popular driver PostgreSQL pentru Python.\n\n```bash\npip install psycopg2-binary  # Pre-compiled, mai usor de instalat\n# sau:\npip install psycopg2  # Versiunea completa (necesita libpq-dev)\n```\n\n```python\nimport psycopg2\nimport psycopg2.extras\nfrom contextlib import contextmanager\nimport os\n\n# Conexiune simpla:\nconn = psycopg2.connect(\n    host=os.environ['DB_HOST'],\n    database=os.environ['DB_NAME'],\n    user=os.environ['DB_USER'],\n    password=os.environ['DB_PASSWORD'],\n    port=5432,\n)\n\n# SAU cu connection string:\nconn = psycopg2.connect('postgresql://user:pass@localhost/mydb')\n\n# CURSOR si query:\ncursor = conn.cursor()\ncursor.execute('SELECT * FROM produse WHERE pret < %s', (1000,))\n# Placeholder in psycopg2: %s (NU ? ca in mysql, NU f-string!)\nrows = cursor.fetchall()  # Lista de tuple\nrow = cursor.fetchone()   # Un singur tuple\n\n# DictCursor — acces prin nume coloana:\ncursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)\ncursor.execute('SELECT id, nume, pret FROM produse WHERE id = %s', (42,))\nprod = cursor.fetchone()\nprint(prod['nume'], prod['pret'])  # Acces prin cheie, nu index\n\n# Context manager pattern (recomandat):\n@contextmanager\ndef get_db():\n    conn = psycopg2.connect(os.environ['DATABASE_URL'])\n    try:\n        yield conn\n        conn.commit()\n    except Exception:\n        conn.rollback()\n        raise\n    finally:\n        conn.close()\n\nwith get_db() as conn:\n    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:\n        cur.execute('SELECT * FROM produse WHERE activ = %s', (True,))\n        produse = cur.fetchall()\n```"
      },
      {
        "order": 2,
        "title": "SQLAlchemy Core si ORM",
        "content": "SQLAlchemy este cel mai popular ORM Python — suporta MySQL, PostgreSQL, SQLite.\n\n```bash\npip install sqlalchemy psycopg2-binary\n```\n\n```python\nfrom sqlalchemy import create_engine, Column, Integer, String, Decimal, ForeignKey, DateTime\nfrom sqlalchemy.ext.declarative import declarative_base\nfrom sqlalchemy.orm import sessionmaker, relationship\nfrom datetime import datetime\n\n# Engine (connection pool inclus):\nengine = create_engine(\n    'postgresql://user:pass@localhost/mydb',\n    pool_size=10,\n    max_overflow=20,\n    echo=False,  # True = logheza toate query-urile SQL\n)\n\nBase = declarative_base()\n\n# Modele ORM:\nclass User(Base):\n    __tablename__ = 'utilizatori'\n\n    id = Column(Integer, primary_key=True)\n    email = Column(String(255), unique=True, nullable=False)\n    name = Column(String(100))\n    created_at = Column(DateTime, default=datetime.utcnow)\n    orders = relationship('Order', back_populates='user', lazy='dynamic')\n\nclass Order(Base):\n    __tablename__ = 'comenzi'\n\n    id = Column(Integer, primary_key=True)\n    user_id = Column(Integer, ForeignKey('utilizatori.id'), nullable=False)\n    total = Column(Decimal(10, 2))\n    status = Column(String(20), default='pending')\n    user = relationship('User', back_populates='orders')\n\n# Creare tabele:\nBase.metadata.create_all(engine)\n\n# Session:\nSession = sessionmaker(bind=engine)\n\ndef get_session():\n    session = Session()\n    try:\n        yield session\n        session.commit()\n    except Exception:\n        session.rollback()\n        raise\n    finally:\n        session.close()\n\n# CRUD cu ORM:\nwith Session() as session:\n    # Create:\n    user = User(email='ana@test.com', name='Ana Pop')\n    session.add(user)\n    session.flush()  # Obtine ID fara commit\n    print(user.id)\n\n    # Read:\n    users = session.query(User).filter(User.email.like('%@test.com')).all()\n    user = session.query(User).filter_by(email='ana@test.com').first()\n    user = session.get(User, 42)  # By primary key\n\n    # Update:\n    user.name = 'Ana Ionescu'\n    session.commit()\n\n    # Delete:\n    session.delete(user)\n    session.commit()\n```"
      },
      {
        "order": 3,
        "title": "Alembic — migrari de schema",
        "content": "Alembic gestioneaza migrarile de schema in aplicatii Python/SQLAlchemy.\n\n```bash\npip install alembic\nalembic init alembic\n```\n\n```python\n# alembic/env.py — configureaza URL-ul:\nfrom myapp.models import Base\ntarget_metadata = Base.metadata\n\n# alembic.ini:\n# sqlalchemy.url = postgresql://user:pass@localhost/mydb\n\n# Genereaza migrare automata:\n# alembic revision --autogenerate -m 'add users table'\n```\n\n```python\n# alembic/versions/001_add_users.py — generata automat:\nfrom alembic import op\nimport sqlalchemy as sa\n\ndef upgrade() -> None:\n    op.create_table('utilizatori',\n        sa.Column('id', sa.Integer(), nullable=False),\n        sa.Column('email', sa.String(length=255), nullable=False),\n        sa.Column('name', sa.String(length=100)),\n        sa.Column('created_at', sa.DateTime()),\n        sa.PrimaryKeyConstraint('id'),\n        sa.UniqueConstraint('email'),\n    )\n    op.create_index('idx_email', 'utilizatori', ['email'])\n\ndef downgrade() -> None:\n    op.drop_table('utilizatori')\n\n# Migrare manuala (ex: add column, rename):\ndef upgrade() -> None:\n    op.add_column('produse', sa.Column('discount', sa.Decimal(5,2), nullable=True))\n    op.alter_column('produse', 'pret', type_=sa.Decimal(12,2))\n    op.create_index('idx_produse_pret', 'produse', ['pret'])\n\ndef downgrade() -> None:\n    op.drop_index('idx_produse_pret', 'produse')\n    op.drop_column('produse', 'discount')\n```\n\n```bash\n# Comenzi Alembic:\nalembic upgrade head           # Aplica toate migrarile\nalembic downgrade -1           # Rollback ultima migrare\nalembic current                # Versiunea curenta\nalembic history                # Istoric migrari\nalembic upgrade +1             # O migrare inainte\nalembic downgrade base         # Rollback la inceput\n```"
      },
      {
        "order": 4,
        "title": "SQLAlchemy 2.0 async si query patterns avansate",
        "content": "SQLAlchemy 2.0 cu suport async pentru FastAPI si aplicatii moderne.\n\n```bash\npip install sqlalchemy[asyncio] asyncpg\n```\n\n```python\nfrom sqlalchemy.ext.asyncio import create_async_engine, AsyncSession\nfrom sqlalchemy.orm import sessionmaker\nfrom sqlalchemy import select, func, and_, or_\n\n# Engine async:\nengine = create_async_engine(\n    'postgresql+asyncpg://user:pass@localhost/mydb',\n    pool_size=10,\n)\nAsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)\n\n# Dependency injection (FastAPI):\nasync def get_db():\n    async with AsyncSessionLocal() as session:\n        yield session\n\n# Query cu SQLAlchemy 2.0 style (select statement):\nasync def get_users_with_orders(session: AsyncSession, min_orders: int = 1):\n    stmt = (\n        select(User, func.count(Order.id).label('order_count'))\n        .join(Order, Order.user_id == User.id)\n        .where(User.created_at > '2024-01-01')\n        .group_by(User.id)\n        .having(func.count(Order.id) >= min_orders)\n        .order_by(func.count(Order.id).desc())\n        .limit(100)\n    )\n    result = await session.execute(stmt)\n    return result.all()  # Lista de (User, order_count) tuple\n\n# Eager loading (evita N+1):\nfrom sqlalchemy.orm import selectinload, joinedload\n\nstmt = (\n    select(User)\n    .options(selectinload(User.orders))  # Incarca orders separat (1 query extra)\n    # sau:\n    .options(joinedload(User.orders))    # JOIN in acelasi query\n    .where(User.id.in_([1, 2, 3]))\n)\n\n# Bulk operations:\nawait session.execute(\n    User.__table__.insert(),\n    [{'email': f'user{i}@test.com', 'name': f'User {i}'} for i in range(1000)]\n)\nawait session.commit()\n\n# Raw SQL cu SQLAlchemy:\nfrom sqlalchemy import text\nresult = await session.execute(\n    text('SELECT * FROM produse WHERE pret BETWEEN :min AND :max'),\n    {'min': 100, 'max': 500}\n)\nrows = result.fetchall()\n```\n\nLA INTERVIU: Ce este problema N+1 in ORM? La listarea a 100 useri fara eager loading, faci 1 query pentru useri + 100 query-uri pentru orders = 101 total. selectinload/joinedload = 1-2 query-uri."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "psycopg2 placeholder",
        "question": "In psycopg2, care este placeholder-ul pentru parametri SQL?",
        "options": [
          "?",
          "$1",
          "%s",
          "@param"
        ],
        "answer": "%s",
        "explanation": "psycopg2 foloseste %s pentru toti parametrii, indiferent de tip. Nu concatena valori cu f-string!",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "DictCursor",
        "question": "La ce serveste DictCursor in psycopg2?",
        "options": [
          "Mai rapid",
          "Returneaza randuri ca dict (acces prin cheie) in loc de tuple (acces prin index)",
          "Async support",
          "Cursor pentru DDL"
        ],
        "answer": "Returneaza randuri ca dict (acces prin cheie) in loc de tuple (acces prin index)",
        "explanation": "row['email'] in loc de row[1]. Cod mai lizibil si mai rezistent la schimbari de schema.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "session.flush",
        "question": "Diferenta session.flush() vs session.commit() in SQLAlchemy?",
        "options": [
          "Identice",
          "flush: trimite SQL la DB (obtii ID) fara a finaliza tranzactia. commit: finalizeaza si confirma tranzactia",
          "flush e async",
          "commit e mai rapid"
        ],
        "answer": "flush: trimite SQL la DB (obtii ID) fara a finaliza tranzactia. commit: finalizeaza si confirma tranzactia",
        "explanation": "flush util cand ai nevoie de ID-ul generat inainte de commit (pentru FK intr-o alta entitate din aceeasi tranzactie).",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "alembic autogenerate",
        "question": "Ce face alembic revision --autogenerate?",
        "options": [
          "Aplica migrarile",
          "Compara modelele SQLAlchemy cu schema DB si genereaza fisier de migrare cu diferentele",
          "Creeaza schema",
          "Sterge migrarile"
        ],
        "answer": "Compara modelele SQLAlchemy cu schema DB si genereaza fisier de migrare cu diferentele",
        "explanation": "Autogenerate detecteaza: tabele noi, coloane adaugate/sterse/modificate, indecsi. REVIEW mereu outputul!",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "N+1 problem",
        "question": "Ce este problema N+1 in ORM?",
        "options": [
          "N+1 conexiuni",
          "1 query pentru lista + N query-uri pentru relatii (un query per rand) = 1+N total",
          "N+1 tranzactii",
          "N+1 coloane"
        ],
        "answer": "1 query pentru lista + N query-uri pentru relatii (un query per rand) = 1+N total",
        "explanation": "Listezi 100 useri si accesezi user.orders => 101 query-uri. Solutie: selectinload sau joinedload.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "selectinload vs joinedload",
        "question": "Diferenta selectinload vs joinedload in SQLAlchemy?",
        "options": [
          "Identice",
          "selectinload: query separat cu IN clause. joinedload: JOIN in acelasi query (mai rapid pentru putine relatii)",
          "joinedload e mai rapid mereu",
          "selectinload e mai nou"
        ],
        "answer": "selectinload: query separat cu IN clause. joinedload: JOIN in acelasi query (mai rapid pentru putine relatii)",
        "explanation": "joinedload: un query mare cu JOIN. selectinload: 2 query-uri mici. selectinload e mai bun pentru many-to-many.",
        "difficulty": "hard"
      },
      {
        "number": 7,
        "name": "alembic upgrade head",
        "question": "Ce face alembic upgrade head?",
        "options": [
          "Upgrade Python",
          "Aplica toate migrarile neaplicate (pana la cea mai recenta)",
          "Creeaza schema noua",
          "Verifica migrarile"
        ],
        "answer": "Aplica toate migrarile neaplicate (pana la cea mai recenta)",
        "explanation": "alembic upgrade head = aplica toate. upgrade +1 = un pas inainte. downgrade -1 = rollback un pas.",
        "difficulty": "easy"
      },
      {
        "number": 8,
        "name": "SQLAlchemy text()",
        "question": "Cum executi SQL raw sigur in SQLAlchemy 2.0?",
        "options": [
          "session.execute(query_string)",
          "session.execute(text('SELECT * WHERE id = :id'), {'id': 42})",
          "session.raw_query()",
          "session.sql()"
        ],
        "answer": "session.execute(text('SELECT * WHERE id = :id'), {'id': 42})",
        "explanation": "text() wrapper + named parameters :param cu dict. NU concatena string — SQL injection.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "asyncpg vs psycopg2",
        "question": "De ce folosesti asyncpg in loc de psycopg2 intr-o aplicatie FastAPI async?",
        "options": [
          "asyncpg e mai popular",
          "asyncpg este async nativ — nu blocheaza event loop-ul la operatii DB",
          "asyncpg e mai usor",
          "psycopg2 nu suporta PostgreSQL"
        ],
        "answer": "asyncpg este async nativ — nu blocheaza event loop-ul la operatii DB",
        "explanation": "psycopg2 e sincron — blocheaza threadul. asyncpg cu SQLAlchemy async: non-blocking IO pentru toate query-urile.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "Coding: psycopg2 query",
        "question": "Scrie o functie Python get_user_orders(user_id) care returneaza comenzile unui utilizator ca lista de dict-uri, folosind psycopg2 cu DictCursor.",
        "options": [],
        "answer": "",
        "explanation": "DictCursor pentru acces prin cheie. %s placeholder. fetchall() pentru toate comenzile.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "Coding: SQLAlchemy model",
        "question": "Defineste modelele SQLAlchemy pentru Produs si Categorie (many-to-one: produs are o categorie) cu relationship.",
        "options": [],
        "answer": "",
        "explanation": "ForeignKey + relationship + back_populates. Column types: Integer, String, Decimal, DateTime.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Coding: Alembic migration",
        "question": "Scrie un fisier de migrare Alembic care adauga coloana 'discount' (Numeric 5,2, nullable) la tabela produse si un index pe ea.",
        "options": [],
        "answer": "",
        "explanation": "op.add_column cu Column. op.create_index pentru performance. downgrade: drop_index + drop_column.",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "conn.commit psycopg2",
        "question": "De ce trebuie sa apelezi conn.commit() in psycopg2 dupa INSERT/UPDATE?",
        "options": [
          "E optional",
          "psycopg2 nu face autocommit implicit — toate modificarile sunt intr-o tranzactie pana la commit",
          "E pentru audit",
          "E pentru securitate"
        ],
        "answer": "psycopg2 nu face autocommit implicit — toate modificarile sunt intr-o tranzactie pana la commit",
        "explanation": "Fara commit: datele sunt vizibile doar in sesiunea curenta. conn.autocommit = True dezactiveaza comportamentul de tranzactie.",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "SQLAlchemy 2.0 select",
        "question": "In SQLAlchemy 2.0, cum executi un SELECT folosind noul stil?",
        "options": [
          "session.query(User).all()",
          "session.execute(select(User)).scalars().all()",
          "session.select(User)",
          "User.query.all()"
        ],
        "answer": "session.execute(select(User)).scalars().all()",
        "explanation": "2.0 style: select(Model). scalars() extrage primul element per row. 1.x style (session.query) deprecated dar functional.",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "bulk insert SQLAlchemy",
        "question": "Cum faci un INSERT bulk (1000+ randuri) eficient cu SQLAlchemy?",
        "options": [
          "session.add() in loop",
          "session.execute(Model.__table__.insert(), list_of_dicts)",
          "Multiple session.commit()",
          "session.bulk_save_objects()"
        ],
        "answer": "session.execute(Model.__table__.insert(), list_of_dicts)",
        "explanation": "Table.insert() + list de dict-uri = un singur INSERT cu multi-values. Mult mai rapid decat add() in loop.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "sql-performance-tuning",
    "title": "29. Performance Tuning avansat SQL",
    "order": 29,
    "theory": [
      {
        "order": 1,
        "title": "Query plans — citirea EXPLAIN in profunzime",
        "content": "Intelegerea planurilor de executie este esentiala pentru optimizare.\n\n```sql\n-- PostgreSQL EXPLAIN noduri de executie:\n\nEXPLAIN (ANALYZE, BUFFERS, VERBOSE, FORMAT TEXT)\nSELECT c.id, c.total, u.email, p.nume AS produs\nFROM comenzi c\nJOIN utilizatori u ON c.user_id = u.id\nJOIN order_items oi ON oi.order_id = c.id\nJOIN produse p ON oi.produs_id = p.id\nWHERE c.status = 'livrat'\n  AND c.created_at > NOW() - INTERVAL '30 days'\nORDER BY c.total DESC\nLIMIT 50;\n\n/* OUTPUT ANALYSIS:\n\nNoduri plan PostgreSQL:\n- Seq Scan: citeste toata tabela row by row\n- Index Scan: foloseste B-tree index, citeste heap\n- Index Only Scan: citeste NUMAI indexul (cel mai rapid)\n- Bitmap Index Scan + Bitmap Heap Scan: pt multiple index lookups\n- Nested Loop: pt seturi mici, O(n*m)\n- Hash Join: pt seturi medii-mari, hash table in memorie\n- Merge Join: pt date sortate, O(n+m)\n- Sort: sortare explicita\n- Hash Aggregate: GROUP BY via hash table\n- WindowAgg: window functions\n\nCOST in EXPLAIN: (cost=start..total rows=estimate width=bytes)\n- start: cost pana la primul rand\n- total: cost pana la ultimul rand\n- rows: estimare randuri\n- ACTUAL rows vs ESTIMATED: daca difera mult => statistici invechite\n*/\n\n-- Actualizare statistici:\nANALYZE comenzi;  -- Actualizeaza statistici pentru planner\nVACUUM ANALYZE comenzi;  -- Curata + actualizeaza\n\n-- MySQL EXPLAIN FORMAT=TREE (MySQL 8.0.16+, mai lizibil):\nEXPLAIN FORMAT=TREE\nSELECT * FROM comenzi\nWHERE status = 'livrat' AND user_id = 42;\n\n-- Identify slow queries:\n-- MySQL slow query log:\n-- slow_query_log = ON\n-- long_query_time = 1  (log queries > 1 sec)\n-- slow_query_log_file = /var/log/mysql/slow.log\n```"
      },
      {
        "order": 2,
        "title": "Statistics, vacuum si pg_stat_user_tables",
        "content": "PostgreSQL mentine statistici despre date pentru query planner — trebuie mentinute.\n\n```sql\n-- Statistici tabele PostgreSQL:\nSELECT\n  schemaname,\n  tablename,\n  n_live_tup AS live_rows,\n  n_dead_tup AS dead_rows,\n  last_vacuum,\n  last_autovacuum,\n  last_analyze,\n  last_autoanalyze,\n  seq_scan,\n  idx_scan,\n  ROUND(100.0 * idx_scan / NULLIF(seq_scan + idx_scan, 0), 2) AS idx_usage_pct\nFROM pg_stat_user_tables\nORDER BY seq_scan DESC;\n-- seq_scan mare, idx_scan mic => tabela scanata full, poate lipsi index!\n\n-- Statistici indecsi:\nSELECT\n  tablename,\n  indexname,\n  idx_scan,   -- De cate ori a fost folosit indexul\n  idx_tup_read,  -- Randuri citite\n  idx_tup_fetch  -- Randuri fetched din heap\nFROM pg_stat_user_indexes\nWHERE idx_scan = 0  -- Indexuri NEFOLOSITE!\nORDER BY tablename;\n\n-- VACUUM manual:\nVACUUM ANALYZE comenzi;  -- Curata + actualizeaza statistici\nVACUUM FULL comenzi;     -- Reclaima spatiu pe disc (lock exclusiv!)\n\n-- Configurare autovacuum agresiv (postgresql.conf):\n-- autovacuum = on\n-- autovacuum_vacuum_threshold = 50\n-- autovacuum_analyze_threshold = 50\n-- autovacuum_vacuum_scale_factor = 0.05  -- 5% din tabela\n-- autovacuum_analyze_scale_factor = 0.02  -- 2% din tabela\n\n-- Tabele cu bloat (dead tuples >20%):\nSELECT\n  relname AS tabela,\n  n_dead_tup AS dead,\n  n_live_tup AS live,\n  ROUND(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) AS bloat_pct\nFROM pg_stat_user_tables\nWHERE n_dead_tup > 10000\nORDER BY bloat_pct DESC;\n```"
      },
      {
        "order": 3,
        "title": "Connection limits si pooling optimization",
        "content": "Gestionarea corecta a conexiunilor e esentiala pentru scalabilitate.\n\n```sql\n-- Conexiuni active PostgreSQL:\nSELECT\n  count(*) TOTAL,\n  count(*) FILTER (WHERE state = 'active') AS active,\n  count(*) FILTER (WHERE state = 'idle') AS idle,\n  count(*) FILTER (WHERE state = 'idle in transaction') AS idle_in_tx,\n  count(*) FILTER (WHERE wait_event_type = 'Lock') AS waiting_locks\nFROM pg_stat_activity\nWHERE pid <> pg_backend_pid();\n\n-- Query-uri care ruleaza acum:\nSELECT\n  pid,\n  now() - pg_stat_activity.query_start AS duration,\n  query,\n  state\nFROM pg_stat_activity\nWHERE state = 'active'\n  AND now() - query_start > interval '5 seconds';\n\n-- Configurare PostgreSQL (postgresql.conf):\n-- max_connections = 100  -- Default, suficient cu PgBouncer\n-- shared_buffers = 25% din RAM\n-- effective_cache_size = 75% din RAM\n-- work_mem = 4MB  -- Per sort/hash operation (atentie: work_mem * max_connections)\n-- maintenance_work_mem = 256MB  -- Pentru VACUUM, CREATE INDEX\n-- wal_buffers = 16MB\n\n-- Terminare conexiune care asteapta prea mult:\nSELECT pg_terminate_backend(pid)\nFROM pg_stat_activity\nWHERE now() - query_start > interval '10 minutes'\n  AND state = 'idle in transaction';\n\n-- Lock-uri active:\nSELECT\n  pg_stat_activity.pid,\n  pg_class.relname AS tabela,\n  pg_locks.mode,\n  pg_locks.granted,\n  pg_stat_activity.query\nFROM pg_locks\nJOIN pg_class ON pg_class.oid = pg_locks.relation\nJOIN pg_stat_activity ON pg_stat_activity.pid = pg_locks.pid\nWHERE NOT pg_locks.granted;\n```"
      },
      {
        "order": 4,
        "title": "Caching strategies si materialized views",
        "content": "Reducerea load-ului pe DB prin caching la multiple niveluri.\n\n```sql\n-- PostgreSQL Materialized Views:\nCREATE MATERIALIZED VIEW statistici_produse AS\nSELECT\n  c.id AS categorie_id,\n  c.nume AS categorie,\n  COUNT(p.id) AS numar_produse,\n  AVG(p.pret) AS pret_mediu,\n  MIN(p.pret) AS pret_min,\n  MAX(p.pret) AS pret_max,\n  SUM(p.stoc) AS stoc_total\nFROM categorii c\nLEFT JOIN produse p ON p.categorie_id = c.id\nGROUP BY c.id, c.nume;\n\nCREATE UNIQUE INDEX ON statistici_produse(categorie_id);\n\n-- Refresh:\nREFRESH MATERIALIZED VIEW statistici_produse;  -- Lock exclusiv\nREFRESH MATERIALIZED VIEW CONCURRENTLY statistici_produse;  -- Fara lock (necesita unique index)\n\n-- Query rapid (precomputed):\nSELECT * FROM statistici_produse WHERE numar_produse > 10;\n\n-- Refresh automat cu cron (in PostgreSQL via pg_cron extension):\nSELECT cron.schedule('refresh-stats', '*/15 * * * *',\n  'REFRESH MATERIALIZED VIEW CONCURRENTLY statistici_produse');\n\n-- Caching cu Redis in Node.js:\n// Pattern: cache-aside\nasync function getCategoriStatistici(id) {\n  const cacheKey = `cat:stats:${id}`;\n  const cached = await redis.get(cacheKey);\n  if (cached) return JSON.parse(cached);\n\n  const [rows] = await db.execute(\n    'SELECT * FROM statistici_produse WHERE categorie_id = ?', [id]\n  );\n  await redis.setex(cacheKey, 300, JSON.stringify(rows[0]));  // TTL 5 min\n  return rows[0];\n}\n\n// Invalidare cache la modificare produs:\nasync function updateProduct(id, data) {\n  await db.execute('UPDATE produse SET ? WHERE id = ?', [data, id]);\n  const [prod] = await db.execute('SELECT categorie_id FROM produse WHERE id = ?', [id]);\n  await redis.del(`cat:stats:${prod[0].categorie_id}`);\n  // Sau refresh materialized view\n}\n```\n\nLA INTERVIU: Cum optimizezi o baza de date lenta? 1) EXPLAIN ANALYZE, 2) Index-uri pe coloanele din WHERE/JOIN, 3) Covering index, 4) Query rewriting, 5) Materialized views pentru agregari grele, 6) Read replicas, 7) Connection pooling."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Bitmap Index Scan",
        "question": "Cand PostgreSQL foloseste Bitmap Index Scan in loc de Index Scan?",
        "options": [
          "Mereu",
          "La conditii multiple sau range queries — combina multiple index lookups eficient",
          "La tabele mici",
          "La sortare"
        ],
        "answer": "La conditii multiple sau range queries — combina multiple index lookups eficient",
        "explanation": "Bitmap: colecteaza pagini din mai multi indecsi, elimina duplicate, fetch heap o singura data.",
        "difficulty": "hard"
      },
      {
        "number": 2,
        "name": "VACUUM rol",
        "question": "De ce este VACUUM important in PostgreSQL?",
        "options": [
          "Sterge date",
          "Curata dead tuples (randuri sterse/update-ate dar nereclamate), permite refolosirea spatiului",
          "Optimizeaza indecsi",
          "Actualizeaza statistici"
        ],
        "answer": "Curata dead tuples (randuri sterse/update-ate dar nereclamate), permite refolosirea spatiului",
        "explanation": "PostgreSQL MVCC: UPDATE = insert rand nou + marcare vechi ca dead. VACUUM curata dead tuples. Fara VACUUM: bloat.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "pg_stat_user_tables",
        "question": "Ce indica un seq_scan mare si idx_scan mic in pg_stat_user_tables?",
        "options": [
          "Tabela sanatoasa",
          "Tabela e scanata full frecvent — posibil lipsesc indecsi pe coloanele folosite in WHERE",
          "Indecsi corupti",
          "Statistici vechi"
        ],
        "answer": "Tabela e scanata full frecvent — posibil lipsesc indecsi pe coloanele folosite in WHERE",
        "explanation": "seq_scan = full table scans, idx_scan = index scans. Ratio mic idx/total => query-uri fara index beneficiu.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "work_mem",
        "question": "Ce face parametrul work_mem in PostgreSQL?",
        "options": [
          "Memorie totala DB",
          "Memorie alocata per operatie de sort/hash — mai mare = sort in memorie (rapid), mai mic = disc (lent)",
          "Connection pool",
          "Cache tabele"
        ],
        "answer": "Memorie alocata per operatie de sort/hash — mai mare = sort in memorie (rapid), mai mic = disc (lent)",
        "explanation": "Atentie: work_mem se multiplica per conexiune per operatie. 4MB * 100 conexiuni * 2 sorts = 800MB RAM!",
        "difficulty": "hard"
      },
      {
        "number": 5,
        "name": "Materialized view vs view",
        "question": "Diferenta principala Materialized View vs View?",
        "options": [
          "Identice",
          "Materialized View: stocheaza fizic datele (rapid, necesita refresh). View: query salvat (mereu actualizat, posibil lent)",
          "View e mai nou",
          "Materialized View e automat"
        ],
        "answer": "Materialized View: stocheaza fizic datele (rapid, necesita refresh). View: query salvat (mereu actualizat, posibil lent)",
        "explanation": "Pentru agregari grele (SUM, COUNT pe milioane de randuri), materialized view e esential.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "idle in transaction",
        "question": "De ce este 'idle in transaction' periculos in PostgreSQL?",
        "options": [
          "E normal",
          "Tranzactia deschisa mentine lock-uri — blochheaza VACUUM si alte tranzactii sa acceseze randurile",
          "E lent",
          "Nu e periculos"
        ],
        "answer": "Tranzactia deschisa mentine lock-uri — blochheaza VACUUM si alte tranzactii sa acceseze randurile",
        "explanation": "BEGIN; SELECT ... -- (uita COMMIT/ROLLBACK) => lock pe randuri pana la timeout sau kill. Seteaza idle_in_transaction_session_timeout.",
        "difficulty": "hard"
      },
      {
        "number": 7,
        "name": "shared_buffers",
        "question": "Valoarea recomandata pentru shared_buffers in PostgreSQL?",
        "options": [
          "1% din RAM",
          "25-30% din RAM",
          "50% din RAM",
          "All available RAM"
        ],
        "answer": "25-30% din RAM",
        "explanation": "shared_buffers: 25% din RAM e regula generala. effective_cache_size = 75% din RAM (hint pentru planner, nu alocare reala).",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "REFRESH CONCURRENTLY",
        "question": "De ce preferi REFRESH MATERIALIZED VIEW CONCURRENTLY fata de REFRESH fara CONCURRENTLY?",
        "options": [
          "E mai rapid",
          "Nu blocheaza query-urile pe view in timpul refresh-ului (necesita unique index)",
          "E automat",
          "E mai precis"
        ],
        "answer": "Nu blocheaza query-urile pe view in timpul refresh-ului (necesita unique index)",
        "explanation": "REFRESH normal: lock exclusiv, view inaccesibil. CONCURRENTLY: foloseste snapshot, view ramine accesibil.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "slow query log MySQL",
        "question": "Cum activezi logul de query-uri lente in MySQL?",
        "options": [
          "SHOW SLOW QUERIES",
          "slow_query_log = ON + long_query_time = N in my.cnf sau SET GLOBAL",
          "EXPLAIN ALL",
          "Monitor tool"
        ],
        "answer": "slow_query_log = ON + long_query_time = N in my.cnf sau SET GLOBAL",
        "explanation": "SET GLOBAL slow_query_log = 1; SET GLOBAL long_query_time = 1; — log-ezi query-urile > 1 secunda.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "Coding: indexuri nefolosite",
        "question": "Scrie un query PostgreSQL care listeaza indexurile nefolosite (idx_scan = 0) pe care le poti sterge.",
        "options": [],
        "answer": "",
        "explanation": "pg_stat_user_indexes cu idx_scan = 0. Exclude primary keys si unique constraints.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "Coding: materialized view refresh",
        "question": "Creeaza o materialized view top_produse (top 20 produse dupa vanzari) si un job care o refresheaza la fiecare ora.",
        "options": [],
        "answer": "",
        "explanation": "CREATE MATERIALIZED VIEW + UNIQUE INDEX pentru CONCURRENTLY. pg_cron sau event scheduler pentru refresh.",
        "difficulty": "hard"
      },
      {
        "number": 12,
        "name": "Coding: kill idle transactions",
        "question": "Scrie un query PostgreSQL care termina toate conexiunile 'idle in transaction' mai vechi de 10 minute.",
        "options": [],
        "answer": "",
        "explanation": "pg_terminate_backend(pid) + WHERE state = 'idle in transaction' + duration > 10 minute.",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "ANALYZE vs VACUUM ANALYZE",
        "question": "Diferenta ANALYZE vs VACUUM ANALYZE?",
        "options": [
          "Identice",
          "ANALYZE: actualizeaza statistici pentru planner. VACUUM ANALYZE: curata dead tuples + actualizeaza statistici",
          "VACUUM e mai lent",
          "ANALYZE e deprecat"
        ],
        "answer": "ANALYZE: actualizeaza statistici pentru planner. VACUUM ANALYZE: curata dead tuples + actualizeaza statistici",
        "explanation": "Dupa import mare de date: VACUUM ANALYZE tabela. Dupa update selectiv: ANALYZE tabela (mai rapid).",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "autovacuum scale factor",
        "question": "Ce face autovacuum_vacuum_scale_factor = 0.05 in PostgreSQL?",
        "options": [
          "5% din memorie",
          "Declanseaza autovacuum cand 5% din randurile tabelei sunt dead tuples",
          "5% din disc",
          "5 conexiuni"
        ],
        "answer": "Declanseaza autovacuum cand 5% din randurile tabelei sunt dead tuples",
        "explanation": "Tabela cu 1M randuri: autovacuum la 50K dead tuples. Tabele mari cu writes frecvente: scale factor mai mic (0.01).",
        "difficulty": "hard"
      },
      {
        "number": 15,
        "name": "Nested Loop vs Hash Join",
        "question": "Cand PostgreSQL alege Nested Loop in loc de Hash Join?",
        "options": [
          "Mereu pentru seturi mari",
          "Cand unul dintre seturi e mic (index lookup per rand e eficient)",
          "Cand nu exista index",
          "Niciodata"
        ],
        "answer": "Cand unul dintre seturi e mic (index lookup per rand e eficient)",
        "explanation": "Nested Loop: O(outer * lookup_cost). Bun daca outer=100, inner=indexed. Hash Join: O(build+probe). Bun pentru seturi mari.",
        "difficulty": "hard"
      }
    ]
  },
  {
    "slug": "sql-ecommerce-final",
    "title": "30. Mini Proiect SQL Final — Schema E-Commerce completa",
    "order": 30,
    "theory": [
      {
        "order": 1,
        "title": "Schema completa — tabele si relatii",
        "content": "Schema normalizata (3NF) pentru un E-Commerce complet.\n\n```sql\n-- PostgreSQL schema completa:\n\n-- 1. Utilizatori si autentificare:\nCREATE TABLE utilizatori (\n  id SERIAL PRIMARY KEY,\n  email VARCHAR(255) UNIQUE NOT NULL,\n  parola_hash VARCHAR(255) NOT NULL,\n  rol VARCHAR(20) DEFAULT 'customer' CHECK (rol IN ('customer', 'admin', 'vendor')),\n  email_verificat BOOLEAN DEFAULT FALSE,\n  creat_la TIMESTAMP DEFAULT NOW(),\n  actualizat_la TIMESTAMP DEFAULT NOW()\n);\n\n-- 2. Profile utilizatori:\nCREATE TABLE profile (\n  user_id INT PRIMARY KEY REFERENCES utilizatori(id) ON DELETE CASCADE,\n  prenume VARCHAR(100),\n  nume VARCHAR(100),\n  telefon VARCHAR(20),\n  avatar_url TEXT,\n  data_nastere DATE\n);\n\n-- 3. Adrese:\nCREATE TABLE adrese (\n  id SERIAL PRIMARY KEY,\n  user_id INT REFERENCES utilizatori(id) ON DELETE CASCADE,\n  tip VARCHAR(20) DEFAULT 'shipping' CHECK (tip IN ('shipping', 'billing')),\n  strada VARCHAR(255),\n  oras VARCHAR(100),\n  judet VARCHAR(100),\n  cod_postal VARCHAR(10),\n  tara VARCHAR(2) DEFAULT 'RO',\n  default_adresa BOOLEAN DEFAULT FALSE\n);\n\n-- 4. Categorii (ierarhice):\nCREATE TABLE categorii (\n  id SERIAL PRIMARY KEY,\n  parinte_id INT REFERENCES categorii(id),\n  slug VARCHAR(255) UNIQUE NOT NULL,\n  nume VARCHAR(255) NOT NULL,\n  descriere TEXT,\n  imagine_url TEXT,\n  activa BOOLEAN DEFAULT TRUE\n);\n\n-- 5. Produse:\nCREATE TABLE produse (\n  id SERIAL PRIMARY KEY,\n  categorie_id INT REFERENCES categorii(id),\n  slug VARCHAR(255) UNIQUE NOT NULL,\n  sku VARCHAR(100) UNIQUE,\n  nume VARCHAR(255) NOT NULL,\n  descriere TEXT,\n  pret DECIMAL(10,2) NOT NULL,\n  pret_promotie DECIMAL(10,2),\n  stoc INT DEFAULT 0 CHECK (stoc >= 0),\n  activ BOOLEAN DEFAULT TRUE,\n  imagini TEXT[],       -- Array de URL-uri\n  atribute JSONB,       -- Specificatii variabile\n  creat_la TIMESTAMP DEFAULT NOW()\n);\n\n-- 6. Comenzi:\nCREATE TABLE comenzi (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id INT REFERENCES utilizatori(id),\n  adresa_livrare_id INT REFERENCES adrese(id),\n  status VARCHAR(30) DEFAULT 'pending'\n    CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),\n  subtotal DECIMAL(10,2),\n  discount DECIMAL(10,2) DEFAULT 0,\n  taxa_livrare DECIMAL(10,2) DEFAULT 0,\n  total DECIMAL(10,2),\n  metoda_plata VARCHAR(50),\n  platit_la TIMESTAMP,\n  livrat_la TIMESTAMP,\n  note TEXT,\n  creat_la TIMESTAMP DEFAULT NOW()\n);\n\n-- 7. Iteme comanda:\nCREATE TABLE order_items (\n  id SERIAL PRIMARY KEY,\n  comanda_id UUID REFERENCES comenzi(id) ON DELETE CASCADE,\n  produs_id INT REFERENCES produse(id),\n  cantitate INT NOT NULL CHECK (cantitate > 0),\n  pret_unitar DECIMAL(10,2) NOT NULL,\n  subtotal DECIMAL(10,2) GENERATED ALWAYS AS (cantitate * pret_unitar) STORED\n);\n\n-- 8. Recenzii:\nCREATE TABLE recenzii (\n  id SERIAL PRIMARY KEY,\n  produs_id INT REFERENCES produse(id),\n  user_id INT REFERENCES utilizatori(id),\n  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),\n  titlu VARCHAR(255),\n  comentariu TEXT,\n  verificata BOOLEAN DEFAULT FALSE,\n  creat_la TIMESTAMP DEFAULT NOW(),\n  UNIQUE(produs_id, user_id)  -- Un user, o recenzie per produs\n);\n\n-- 9. Cosuri (persistent):\nCREATE TABLE cos_items (\n  id SERIAL PRIMARY KEY,\n  user_id INT REFERENCES utilizatori(id) ON DELETE CASCADE,\n  produs_id INT REFERENCES produse(id) ON DELETE CASCADE,\n  cantitate INT DEFAULT 1 CHECK (cantitate > 0),\n  adaugat_la TIMESTAMP DEFAULT NOW(),\n  UNIQUE(user_id, produs_id)\n);\n```"
      },
      {
        "order": 2,
        "title": "Indecsi si optimizari pentru productie",
        "content": "Strategie de indexare pentru schema E-Commerce.\n\n```sql\n-- Indecsi cheie pentru performanta:\n\n-- Utilizatori:\nCREATE INDEX idx_utilizatori_email ON utilizatori(email);  -- Login\n\n-- Produse:\nCREATE INDEX idx_produse_categorie_activ ON produse(categorie_id, activ);\nCREATE INDEX idx_produse_pret ON produse(pret) WHERE activ = TRUE;\nCREATE INDEX idx_produse_slug ON produse(slug);  -- URL routing\nCREATE INDEX idx_produse_search ON produse USING GIN(\n  to_tsvector('romanian', coalesce(nume,'') || ' ' || coalesce(descriere,''))\n);\nCREATE INDEX idx_produse_atribute ON produse USING GIN(atribute);\n\n-- Comenzi:\nCREATE INDEX idx_comenzi_user ON comenzi(user_id, creat_la DESC);\nCREATE INDEX idx_comenzi_status ON comenzi(status, creat_la) WHERE status != 'delivered';\n\n-- Order items:\nCREATE INDEX idx_order_items_comanda ON order_items(comanda_id);\nCREATE INDEX idx_order_items_produs ON order_items(produs_id);\n\n-- Recenzii:\nCREATE INDEX idx_recenzii_produs ON recenzii(produs_id, rating);\n\n-- Cos:\nCREATE INDEX idx_cos_user ON cos_items(user_id);\n\n-- QUERY CHEIE 1: Lista produse pe categorie cu paginare:\nSELECT p.id, p.slug, p.nume, p.pret, p.pret_promotie,\n  p.imagini[1] AS imagine_principala,\n  COALESCE(AVG(r.rating), 0) AS rating_mediu\nFROM produse p\nLEFT JOIN recenzii r ON r.produs_id = p.id AND r.verificata = TRUE\nWHERE p.categorie_id = $1 AND p.activ = TRUE\nGROUP BY p.id\nORDER BY p.creat_la DESC\nLIMIT 20 OFFSET $2;\n\n-- QUERY CHEIE 2: Istoricul comenzilor utilizatorului:\nSELECT\n  c.id, c.total, c.status, c.creat_la,\n  COUNT(oi.id) AS nr_produse,\n  jsonb_agg(jsonb_build_object(\n    'produs', p.nume, 'cantitate', oi.cantitate\n  )) AS produse_sumar\nFROM comenzi c\nJOIN order_items oi ON oi.comanda_id = c.id\nJOIN produse p ON p.id = oi.produs_id\nWHERE c.user_id = $1\nGROUP BY c.id\nORDER BY c.creat_la DESC\nLIMIT 10 OFFSET $2;\n```"
      },
      {
        "order": 3,
        "title": "Proceduri si functii stocate esentiale",
        "content": "Logica de business encapsulata in proceduri stocate.\n\n```sql\n-- Functie: calculeaza total comanda:\nCREATE OR REPLACE FUNCTION calculeaza_total_comanda(p_comanda_id UUID)\nRETURNS DECIMAL AS $$\nDECLARE\n  v_subtotal DECIMAL;\nBEGIN\n  SELECT SUM(cantitate * pret_unitar)\n  INTO v_subtotal\n  FROM order_items\n  WHERE comanda_id = p_comanda_id;\n  RETURN COALESCE(v_subtotal, 0);\nEND;\n$$ LANGUAGE plpgsql;\n\n-- Procedura: proceseaza comanda (scade stoc + update status):\nCREATE OR REPLACE PROCEDURE proceseaza_comanda(p_comanda_id UUID)\nLANGUAGE plpgsql AS $$\nDECLARE\n  v_item RECORD;\nBEGIN\n  -- Verifica stoc pentru fiecare item:\n  FOR v_item IN\n    SELECT oi.produs_id, oi.cantitate, p.stoc, p.nume\n    FROM order_items oi\n    JOIN produse p ON p.id = oi.produs_id\n    WHERE oi.comanda_id = p_comanda_id\n  LOOP\n    IF v_item.stoc < v_item.cantitate THEN\n      RAISE EXCEPTION 'Stoc insuficient pentru %: disponibil %, necesar %',\n        v_item.nume, v_item.stoc, v_item.cantitate;\n    END IF;\n  END LOOP;\n\n  -- Scade stoc si actualizeaza status:\n  UPDATE produse p\n  SET stoc = stoc - oi.cantitate\n  FROM order_items oi\n  WHERE oi.comanda_id = p_comanda_id AND p.id = oi.produs_id;\n\n  UPDATE comenzi\n  SET status = 'confirmed',\n      actualizat_la = NOW()\n  WHERE id = p_comanda_id;\n\n  -- Sterge din cos:\n  DELETE FROM cos_items\n  WHERE user_id = (SELECT user_id FROM comenzi WHERE id = p_comanda_id)\n    AND produs_id IN (\n      SELECT produs_id FROM order_items WHERE comanda_id = p_comanda_id\n    );\nEND;\n$$;\n\n-- Apel:\nCALL proceseaza_comanda('uuid-comanda-here');\n\n-- Trigger: update actualizat_la automat:\nCREATE OR REPLACE FUNCTION update_timestamp()\nRETURNS TRIGGER AS $$\nBEGIN\n  NEW.actualizat_la = NOW();\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;\n\nCREATE TRIGGER trg_update_ts\n  BEFORE UPDATE ON utilizatori\n  FOR EACH ROW EXECUTE FUNCTION update_timestamp();\n```"
      },
      {
        "order": 4,
        "title": "Rapoarte si analytics SQL",
        "content": "Query-uri de raportare pentru dashboard-ul admin.\n\n```sql\n-- Vanzari zilnice ultimele 30 zile:\nSELECT\n  DATE(creat_la) AS zi,\n  COUNT(*) AS nr_comenzi,\n  SUM(total) AS vanzari,\n  AVG(total) AS valoare_medie,\n  COUNT(DISTINCT user_id) AS clienti_unici\nFROM comenzi\nWHERE creat_la >= NOW() - INTERVAL '30 days'\n  AND status NOT IN ('cancelled', 'refunded')\nGROUP BY DATE(creat_la)\nORDER BY zi;\n\n-- Top 10 produse dupa vanzari (volum):\nSELECT\n  p.id, p.sku, p.nume,\n  SUM(oi.cantitate) AS total_vandut,\n  SUM(oi.subtotal) AS venit_total,\n  COUNT(DISTINCT c.user_id) AS clienti_unici,\n  AVG(r.rating)::NUMERIC(3,2) AS rating_mediu\nFROM order_items oi\nJOIN produse p ON p.id = oi.produs_id\nJOIN comenzi c ON c.id = oi.comanda_id\nLEFT JOIN recenzii r ON r.produs_id = p.id AND r.verificata = TRUE\nWHERE c.status = 'delivered'\n  AND c.creat_la >= NOW() - INTERVAL '90 days'\nGROUP BY p.id, p.sku, p.nume\nORDER BY total_vandut DESC\nLIMIT 10;\n\n-- Clienti cu valoare mare (LTV - Lifetime Value):\nSELECT\n  u.id,\n  pr.prenume || ' ' || pr.nume AS client,\n  u.email,\n  COUNT(c.id) AS total_comenzi,\n  SUM(c.total) AS ltv,\n  AVG(c.total) AS valoare_medie,\n  MAX(c.creat_la) AS ultima_comanda,\n  NOW() - MAX(c.creat_la) AS inactiv_de\nFROM utilizatori u\nJOIN profile pr ON pr.user_id = u.id\nJOIN comenzi c ON c.user_id = u.id\nWHERE c.status = 'delivered'\nGROUP BY u.id, pr.prenume, pr.nume, u.email\nHAVING SUM(c.total) > 1000\nORDER BY ltv DESC\nLIMIT 100;\n\n-- Rata de conversie cos -> comanda:\nSELECT\n  DATE(adaugat_la) AS zi,\n  COUNT(DISTINCT ci.user_id) AS useri_cu_cos,\n  COUNT(DISTINCT c.user_id) AS useri_cu_comanda,\n  ROUND(\n    100.0 * COUNT(DISTINCT c.user_id) / NULLIF(COUNT(DISTINCT ci.user_id), 0),\n    2\n  ) AS rata_conversie\nFROM cos_items ci\nLEFT JOIN comenzi c\n  ON c.user_id = ci.user_id\n  AND DATE(c.creat_la) = DATE(ci.adaugat_la)\nGROUP BY DATE(adaugat_la)\nORDER BY zi DESC\nLIMIT 30;\n\n-- Window function: rank produse per categorie:\nSELECT\n  c.nume AS categorie,\n  p.nume AS produs,\n  SUM(oi.cantitate) AS vandut,\n  RANK() OVER (PARTITION BY p.categorie_id ORDER BY SUM(oi.cantitate) DESC) AS rank\nFROM order_items oi\nJOIN produse p ON p.id = oi.produs_id\nJOIN categorii c ON c.id = p.categorie_id\nJOIN comenzi cmd ON cmd.id = oi.comanda_id\nWHERE cmd.status = 'delivered'\nGROUP BY c.id, c.nume, p.id, p.nume, p.categorie_id\nORDER BY c.nume, rank;\n```\n\nLA INTERVIU: Cum ai proiecta schema unui E-Commerce? Normalizare 3NF: utilizatori, produse, categorii, comenzi, order_items. UUID pentru comenzi (distributed-friendly). JSONB pentru atribute variabile. Soft delete pe produse. Indecsi pe coloanele din WHERE/JOIN frecvente."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "UUID pentru comenzi",
        "question": "De ce e mai bun UUID decat SERIAL (integer) ca PK pentru tabela comenzi intr-un sistem distribuit?",
        "options": [
          "E mai scurt",
          "UUID e generat offline, nu necesita coordonare intre noduri, nu expune volumul comenzilor",
          "E mai sigur",
          "Sortabil"
        ],
        "answer": "UUID e generat offline, nu necesita coordonare intre noduri, nu expune volumul comenzilor",
        "explanation": "Integer PK: ordine 1001, 1002 => atacatorul stie cate comenzi ai. UUID: opac, generabil distributed.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "ON DELETE CASCADE",
        "question": "Ce face ON DELETE CASCADE la REFERENCES?",
        "options": [
          "Previne stergerea",
          "La stergerea parintelui, sterge automat toate randurile copil referentiate",
          "Null-ifica FK",
          "Arunca eroare"
        ],
        "answer": "La stergerea parintelui, sterge automat toate randurile copil referentiate",
        "explanation": "user DELETE => profile, adrese, cos_items sterse automat. Alternativa: ON DELETE SET NULL.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "CHECK constraint",
        "question": "La ce serveste CHECK (stoc >= 0) pe coloana stoc?",
        "options": [
          "Valideaza tipul",
          "Previne inserarea sau updatarea cu valori negative la nivel de baza de date",
          "Index",
          "Trigger"
        ],
        "answer": "Previne inserarea sau updatarea cu valori negative la nivel de baza de date",
        "explanation": "Validare la nivel DB este complementara validarii din aplicatie. DB e ultima linie de aparare.",
        "difficulty": "easy"
      },
      {
        "number": 4,
        "name": "GENERATED ALWAYS AS",
        "question": "Ce face `subtotal DECIMAL GENERATED ALWAYS AS (cantitate * pret_unitar) STORED`?",
        "options": [
          "Creeaza view",
          "Coloana calculata automat la orice INSERT/UPDATE si stocata pe disc",
          "Trigger implicit",
          "Index functional"
        ],
        "answer": "Coloana calculata automat la orice INSERT/UPDATE si stocata pe disc",
        "explanation": "Nu poti scrie in ea manual. Mereu consistent cu formula. STORED = pe disc (rapid la read).",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "UNIQUE(produs_id, user_id)",
        "question": "Ce garanteaza UNIQUE(produs_id, user_id) pe tabela recenzii?",
        "options": [
          "Fiecare recenzie are un ID unic",
          "Un utilizator poate scrie maxim o recenzie per produs",
          "Recenziile sunt unice global",
          "FK corect"
        ],
        "answer": "Un utilizator poate scrie maxim o recenzie per produs",
        "explanation": "Composite unique constraint: combinatia produs_id + user_id trebuie sa fie unica.",
        "difficulty": "easy"
      },
      {
        "number": 6,
        "name": "imagini TEXT[]",
        "question": "Avantajul stocarii imaginilor ca TEXT[] (array) in PostgreSQL fata de tabela separata imagini?",
        "options": [
          "Identice ca performanta",
          "Simplitate pentru seturi mici de imagini — evita JOIN. Tabela separata: mai buna pentru metadata, operatii individuale",
          "Array e mai rapid",
          "Array e mai sigur"
        ],
        "answer": "Simplitate pentru seturi mici de imagini — evita JOIN. Tabela separata: mai buna pentru metadata, operatii individuale",
        "explanation": "produse.imagini[1] pentru imaginea principala fara JOIN. Daca ai nevoie de alt, caption, order => tabela separata.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "LTV query",
        "question": "In query-ul LTV (Lifetime Value), ce face HAVING SUM(total) > 1000?",
        "options": [
          "Filtreaza inainte de GROUP BY",
          "Filtreaza grupele dupa agregare — pastreaza doar clientii cu LTV > 1000 RON",
          "Index conditie",
          "Limita"
        ],
        "answer": "Filtreaza grupele dupa agregare — pastreaza doar clientii cu LTV > 1000 RON",
        "explanation": "WHERE filtreaza randuri individuale (inainte de GROUP BY). HAVING filtreaza grupele (dupa agregare).",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "NULLIF in rata conversie",
        "question": "De ce folosesti NULLIF(COUNT(DISTINCT ci.user_id), 0) in calculul ratei de conversie?",
        "options": [
          "Performanta",
          "Previne impartirea la zero — returneaza NULL daca numitorul e 0 (in loc de eroare)",
          "Obligatoriu",
          "Tip conversie"
        ],
        "answer": "Previne impartirea la zero — returneaza NULL daca numitorul e 0 (in loc de eroare)",
        "explanation": "COUNT poate fi 0. x/0 = Division by zero error. NULLIF(x,0): daca x=0, returneaza NULL, 100*y/NULL = NULL.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "PARTITION BY window",
        "question": "Ce face PARTITION BY p.categorie_id in RANK() OVER (...)?",
        "options": [
          "Sorteaza global",
          "Reseteaza window function per categorie — rank 1 in fiecare categorie, nu global",
          "Filtreaza",
          "Group By echivalent"
        ],
        "answer": "Reseteaza window function per categorie — rank 1 in fiecare categorie, nu global",
        "explanation": "Fara PARTITION: rank global 1..N. Cu PARTITION BY categorie: rank 1..M per fiecare categorie.",
        "difficulty": "hard"
      },
      {
        "number": 10,
        "name": "Coding: creare comanda",
        "question": "Scrie o tranzactie PostgreSQL care creeaza o comanda cu 2 produse: INSERT in comenzi, INSERT in order_items, si UPDATE stoc.",
        "options": [],
        "answer": "",
        "explanation": "BEGIN + INSERT comenzi RETURNING id + 2x INSERT order_items + 2x UPDATE produse stoc + COMMIT/ROLLBACK.",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "Coding: vanzari zilnice",
        "question": "Scrie un query care afiseaza vanzarile zilnice ale ultimelor 30 de zile: data, numar_comenzi, total_vanzari, comparate cu ziua precedenta (LAG window function).",
        "options": [],
        "answer": "",
        "explanation": "GROUP BY DATE(creat_la) + LAG(total_vanzari) OVER (ORDER BY zi) pentru comparatie cu ziua precedenta.",
        "difficulty": "hard"
      },
      {
        "number": 12,
        "name": "Coding: produse recomandate",
        "question": "Scrie un query care gaseste produse cumparate impreuna cu un produs dat (product_id=42) — baza pentru 'Clientii au cumparat si'.",
        "options": [],
        "answer": "",
        "explanation": "Self-join pe order_items: comenzi care contin prod 42 + celelalte produse din acele comenzi. GROUP BY + COUNT.",
        "difficulty": "hard"
      },
      {
        "number": 13,
        "name": "Recursive CTE categorii",
        "question": "Cum selectezi o categorie si TOATE subcategoriile ei (ierarhie completa) cu un singur query?",
        "options": [
          "Multiple JOIN-uri",
          "WITH RECURSIVE CTE — traverseaza ierarhia pana la frunze",
          "GROUP BY categorie",
          "Subcerere corelata"
        ],
        "answer": "WITH RECURSIVE CTE — traverseaza ierarhia pana la frunze",
        "explanation": "WITH RECURSIVE cat AS (SELECT id FROM cat WHERE id=5 UNION ALL SELECT c.id FROM cat c JOIN ...) SELECT * FROM cat.",
        "difficulty": "hard"
      },
      {
        "number": 14,
        "name": "Soft delete produse",
        "question": "De ce e mai bun soft delete pe produse fata de DELETE fizic?",
        "options": [
          "Spatiu",
          "Comenzile vechi pastreaza referinte valide. Istoricul e intact. Produsul poate fi reactivat.",
          "Performanta",
          "Nu exista avantaj"
        ],
        "answer": "Comenzile vechi pastreaza referinte valide. Istoricul e intact. Produsul poate fi reactivat.",
        "explanation": "DELETE fizic produs cu comenzi => FK error sau cascade delete. Soft delete: comenzile vechi raman valide.",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Schema review final",
        "question": "La un interviu, esti intrebat sa proiectezi schema pentru un E-Commerce. Care e ordinea corecta de abordare?",
        "options": [
          "Indexuri mai intai",
          "Entitati si relatii (ER) => normalizare => tabele cu PK/FK => indecsi => proceduri => optimizari",
          "Cod mai intai",
          "Migrari mai intai"
        ],
        "answer": "Entitati si relatii (ER) => normalizare => tabele cu PK/FK => indecsi => proceduri => optimizari",
        "explanation": "Top-down: identifica entitatile si relatiile, normalizeaza (3NF), adauga constrangeri, apoi optimizeaza pentru use cases.",
        "difficulty": "medium"
      }
    ]
  }
];

module.exports = { sqlExtra };
