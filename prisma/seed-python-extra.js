const pythonExtra = [
  {
    "slug": "python-machine-learning",
    "title": "41. Machine Learning cu scikit-learn",
    "order": 41,
    "theory": [
      {
        "order": 1,
        "title": "Train/test split si preprocesare date",
        "content": "Prima regula in ML: nu antrenezi si evaluezi pe aceleasi date.\n\n```python\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nimport numpy as np\n\n# Date sintetice\nX = np.random.rand(200, 4)  # 200 exemple, 4 features\ny = (X[:, 0] + X[:, 1] > 1).astype(int)  # etichete binare\n\n# 80% train, 20% test, random_state pt reproducibilitate\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42, stratify=y\n)\n\nprint(X_train.shape)  # (160, 4)\nprint(X_test.shape)   # (40, 4)\n\n# Scalare — fit DOAR pe train, transform pe ambele!\nscaler = StandardScaler()\nX_train_sc = scaler.fit_transform(X_train)\nX_test_sc  = scaler.transform(X_test)  # NU fit_transform!\n# Data leakage: daca scaler vede test data la fit, \n# statisticile test influenteaza antrenamentul\n```\n\n**Interviu:** De ce nu aplici `fit_transform` pe test? Raspuns: data leakage — scaler-ul ar invata distributia datelor de test, influentand evaluarea si dand rezultate optimist."
      },
      {
        "order": 2,
        "title": "LinearRegression si metrici de evaluare",
        "content": "```python\nfrom sklearn.linear_model import LinearRegression, Ridge, Lasso\nfrom sklearn.metrics import mean_squared_error, r2_score\nfrom sklearn.datasets import make_regression\n\nX, y = make_regression(n_samples=500, n_features=5,\n                        noise=10, random_state=42)\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42\n)\n\n# Regresia liniara simpla\nlr = LinearRegression()\nlr.fit(X_train, y_train)\ny_pred = lr.predict(X_test)\n\nprint('R2 score:', r2_score(y_test, y_pred))          # 0.97+\nprint('RMSE:', mean_squared_error(y_test, y_pred)**0.5)\nprint('Coeficienti:', lr.coef_)\nprint('Intercept:', lr.intercept_)\n\n# Regularizare\nridge = Ridge(alpha=1.0)   # penalizeaza coeficienti mari (L2)\nlasso = Lasso(alpha=0.1)   # produce coeficienti sparsi (L1)\nridge.fit(X_train, y_train)\nlasso.fit(X_train, y_train)\n```\n\n**Interviu:** Ce e overfitting? Cand modelul invata zgomotul din date de training si performeaza prost pe date noi. Ridge/Lasso adauga penalizare pt coeficienti mari, reducand overfitting-ul."
      },
      {
        "order": 3,
        "title": "RandomForest si importanta feature-urilor",
        "content": "```python\nfrom sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier\nfrom sklearn.metrics import accuracy_score, classification_report\nfrom sklearn.datasets import load_iris\n\niris = load_iris()\nX, y = iris.data, iris.target\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.25, random_state=42\n)\n\n# Random Forest\nrf = RandomForestClassifier(\n    n_estimators=100,  # 100 de arbori\n    max_depth=5,       # adancime maxima\n    random_state=42\n)\nrf.fit(X_train, y_train)\ny_pred = rf.predict(X_test)\n\nprint('Accuracy:', accuracy_score(y_test, y_pred))\nprint(classification_report(y_test, y_pred,\n      target_names=iris.target_names))\n\n# Importanta feature-urilor\nfor name, imp in zip(iris.feature_names, rf.feature_importances_):\n    print(f'{name}: {imp:.3f}')\n\n# Cross-validation corecta\nfrom sklearn.model_selection import cross_val_score\nscores = cross_val_score(rf, X, y, cv=5, scoring='accuracy')\nprint(f'CV accuracy: {scores.mean():.3f} (+/- {scores.std():.3f})')\n```\n\n**Interviu:** Diferenta Random Forest vs Gradient Boosting? RF = arbori paraleli, votul majoritatii, robust la overfitting. GB = arbori secventiali, fiecare corecteaza erorile precedentului, mai precis dar mai lent si mai susceptibil la overfitting."
      },
      {
        "order": 4,
        "title": "Pipeline scikit-learn si GridSearchCV",
        "content": "```python\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.model_selection import GridSearchCV\nfrom sklearn.svm import SVC\nfrom sklearn.preprocessing import StandardScaler\n\n# Pipeline: secventa de transformari + estimator final\npipe = Pipeline([\n    ('scaler', StandardScaler()),\n    ('svm', SVC(probability=True))\n])\n\n# GridSearchCV: cauta hyperparametrii optimi\nparams = {\n    'svm__C': [0.1, 1, 10, 100],\n    'svm__kernel': ['rbf', 'linear'],\n    'svm__gamma': ['scale', 'auto']\n}\n\n# Notatia 'step__param' acceseaza parametrul step-ului\ngrid = GridSearchCV(\n    pipe, params, cv=5,\n    scoring='accuracy', n_jobs=-1, verbose=1\n)\ngrid.fit(X_train, y_train)\n\nprint('Best params:', grid.best_params_)\nprint('Best score:', grid.best_score_)\nprint('Test score:', grid.score(X_test, y_test))\n\n# Pipeline previne data leakage:\n# scaler.fit se apeleaza DOAR pe fold-ul de train in CV\n```\n\n**Interviu:** De ce folosesti Pipeline in GridSearchCV? Raspuns: fara Pipeline, daca scaler-ul e aplicat inaintea CV, testul 'vede' date de training (data leakage). Pipeline integreaza preprocesarea in CV corect."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "test_size parametru",
        "question": "Ce face `test_size=0.2` in `train_test_split`?",
        "options": [
          "20 de exemple merg la test",
          "20% din date merg la test, 80% la train",
          "2 exemple merg la test",
          "80% merg la test"
        ],
        "answer": "20% din date merg la test, 80% la train",
        "explanation": "test_size accepta float (proportie) sau int (numar absolut). 0.2 = 20% pentru evaluare.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "Data leakage scaler",
        "question": "De ce aplici `fit_transform` pe train si `transform` (nu `fit_transform`) pe test?",
        "options": [
          "Nu conteaza, sunt echivalente",
          "Sa previi data leakage: scaler-ul trebuie sa invete statistici DOAR din train",
          "transform e mai rapid",
          "fit_transform crapa pe test"
        ],
        "answer": "Sa previi data leakage: scaler-ul trebuie sa invete statistici DOAR din train",
        "explanation": "Daca fit_transform pe test: scaler invata distributia test-ului, influentand evaluarea — rezultate optimiste si nereale.",
        "difficulty": "hard"
      },
      {
        "number": 3,
        "name": "stratify parametru",
        "question": "Ce face `stratify=y` in `train_test_split`?",
        "options": [
          "Sorteaza datele",
          "Pastreaza proportia claselor din y in ambele split-uri",
          "Selecteaza primele n exemple",
          "Ignora clasele rare"
        ],
        "answer": "Pastreaza proportia claselor din y in ambele split-uri",
        "explanation": "Fara stratify, split-ul aleator poate suprareprezenta o clasa in test. stratify=y garanteaza proportii egale.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "R2 score interpretare",
        "question": "Un R2 score de 0.95 inseamna?",
        "options": [
          "Modelul e corect in 95% din cazuri",
          "Modelul explica 95% din variatia din datele target",
          "RMSE e 0.05",
          "95% din predictii sunt exacte"
        ],
        "answer": "Modelul explica 95% din variatia din datele target",
        "explanation": "R2 masoara cat de bine modelul explica variatia y. R2=1 = predictie perfecta; R2=0 = la fel ca media.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "Ridge vs Lasso",
        "question": "Care regularizare produce coeficienti exact zero (selectie de feature-uri)?",
        "options": [
          "Ridge (L2)",
          "Lasso (L1)",
          "Amandoua",
          "Niciuna"
        ],
        "answer": "Lasso (L1)",
        "explanation": "Lasso (L1) penalizeaza suma valorilor absolute ale coeficientilor — forteaza unii la zero (selectie de feature-uri). Ridge (L2) micsoreaza, nu anuleaza.",
        "difficulty": "hard"
      },
      {
        "number": 6,
        "name": "feature_importances_",
        "question": "Ce reprezinta `rf.feature_importances_` in RandomForest?",
        "options": [
          "Coeficientii liniari",
          "Cat contribuie fiecare feature la reducerea impuritatii (Gini)",
          "Corelatia Pearson cu y",
          "Numarul de arbori care folosesc feature-ul"
        ],
        "answer": "Cat contribuie fiecare feature la reducerea impuritatii (Gini)",
        "explanation": "Feature importance in RF = media reducerii impuritatii (Gini/entropy) adusa de feature in toti arborii.",
        "difficulty": "hard"
      },
      {
        "number": 7,
        "name": "cross_val_score cv=5",
        "question": "Ce face `cross_val_score(model, X, y, cv=5)`?",
        "options": [
          "Imparte datele in 5 bucati si testeaza de 5 ori, fiecare bucata ca test o data",
          "Antreneaza 5 modele identice",
          "Repeta antrenamentul de 5 ori pe aceleasi date",
          "Selecteaza top 5 features"
        ],
        "answer": "Imparte datele in 5 bucati si testeaza de 5 ori, fiecare bucata ca test o data",
        "explanation": "5-fold CV: 5 rulari, fiecare cu alt fold ca test. Evaluare mai robusta, rezultat = media celor 5 scoruri.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "Pipeline beneficiu CV",
        "question": "De ce Pipeline previne data leakage in GridSearchCV?",
        "options": [
          "Nu previne, e acelasi lucru",
          "Pipeline aplica fit al preprocesarii DOAR pe fold-ul de train in fiecare iteratie CV",
          "Pipeline e mai rapid",
          "Pipeline sare scaler-ul pe test"
        ],
        "answer": "Pipeline aplica fit al preprocesarii DOAR pe fold-ul de train in fiecare iteratie CV",
        "explanation": "Fara Pipeline, daca scalezi inainte de CV, fiecare fold de test 'vede' statistici din tot dataset-ul.",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "n_estimators RandomForest",
        "question": "Ce face `n_estimators=100` in RandomForestClassifier?",
        "options": [
          "100 de features sunt folosite",
          "Adancimea maxima e 100",
          "100 de arbori de decizie sunt construiti",
          "Sunt 100 de iteratii de antrenament"
        ],
        "answer": "100 de arbori de decizie sunt construiti",
        "explanation": "Random Forest = ansamblu de n_estimators arbori. Mai multi arbori = mai stabil, dar mai lent.",
        "difficulty": "easy"
      },
      {
        "number": 10,
        "name": "Accuracy vs F1",
        "question": "Cand preferi F1-score in locul accuracy?",
        "options": [
          "Niciodata, accuracy e mereu mai bun",
          "Cand clasele sunt dezechilibrate (de ex. 95% clasa 0, 5% clasa 1)",
          "Cand ai mai mult de 2 clase",
          "Cand datele sunt scalate"
        ],
        "answer": "Cand clasele sunt dezechilibrate (de ex. 95% clasa 0, 5% clasa 1)",
        "explanation": "Pe date dezechilibrate, un model care prezice mereu clasa majoritara are accuracy 95% dar F1 scazut — F1 penalizeaza omiterea clasei rare.",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "random_state importanta",
        "question": "De ce specifici `random_state=42` in modele si split?",
        "options": [
          "42 e cel mai bun numar",
          "Reproducibilitate: acelasi random_state da mereu aceleasi rezultate",
          "E obligatoriu",
          "Creste accuracy"
        ],
        "answer": "Reproducibilitate: acelasi random_state da mereu aceleasi rezultate",
        "explanation": "random_state initiaza generatorul aleator. Fara el, rezultatele difera la fiecare rulare — nu poti reproduce experimentele.",
        "difficulty": "easy"
      },
      {
        "number": 12,
        "name": "predict_proba utilitate",
        "question": "Ce returneza `model.predict_proba(X_test)` (ex. SVC cu probability=True)?",
        "options": [
          "Eticheta clasei prezise",
          "Probabilitatile pentru fiecare clasa (suma = 1 per exemplu)",
          "Un singur numar de incredere",
          "Eroare daca nu e clasificator"
        ],
        "answer": "Probabilitatile pentru fiecare clasa (suma = 1 per exemplu)",
        "explanation": "predict_proba returneaza array (n_samples, n_classes). Util pentru ROC AUC, threshold tuning, calibrare.",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Train/test split coding",
        "question": "Scrie cod care incarca datasetul iris, face train/test split 75/25, antreneaza un RandomForestClassifier si afiseaza accuracy pe test.",
        "options": [],
        "answer": "",
        "explanation": "train_test_split cu test_size=0.25, apoi rf.fit(X_train, y_train), accuracy_score(y_test, rf.predict(X_test)).",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "Pipeline ML coding",
        "question": "Construieste un Pipeline cu StandardScaler si LogisticRegression. Antreneaza pe date sintetice si afiseaza scorul.",
        "options": [],
        "answer": "",
        "explanation": "Pipeline([('scaler', StandardScaler()), ('lr', LogisticRegression())]), fit pe train, score pe test.",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Feature importance coding",
        "question": "Antreneaza RandomForest pe datasetul iris si afiseaza feature importances sortate descrescator.",
        "options": [],
        "answer": "",
        "explanation": "sorted(zip(iris.feature_names, rf.feature_importances_), key=lambda x: x[1], reverse=True)",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "python-pandas",
    "title": "42. Pandas pentru Data Science",
    "order": 42,
    "theory": [
      {
        "order": 1,
        "title": "DataFrame — creare, selectie, filtrare",
        "content": "```python\nimport pandas as pd\nimport numpy as np\n\n# Creare DataFrame\ndf = pd.DataFrame({\n    'nume': ['Ana', 'Bob', 'Carol', 'Dan'],\n    'varsta': [25, 30, 22, 35],\n    'salar': [3000, 5000, 2800, 7000],\n    'departament': ['IT', 'HR', 'IT', 'Finance']\n})\n\n# Selectie coloane\nprint(df['nume'])          # Series\nprint(df[['nume', 'salar']]) # DataFrame\n\n# Filtrare\nit_dept = df[df['departament'] == 'IT']\nsenior = df[(df['varsta'] > 25) & (df['salar'] > 4000)]\n\n# loc (label-based) vs iloc (position-based)\nprint(df.loc[0, 'nume'])    # 'Ana' — by label\nprint(df.iloc[0, 0])        # 'Ana' — by position\nprint(df.loc[:, 'varsta':'salar'])  # slice coloane\n\n# Adaugare coloana\ndf['bonus'] = df['salar'] * 0.1\n\n# Stergere\ndf.drop(columns=['bonus'], inplace=True)\n```\n\n**Interviu:** Diferenta loc vs iloc? loc foloseste labels (indecsi si nume coloane), iloc foloseste pozitii intregi. La filtrare cu boolean mask, loc e mai sigur."
      },
      {
        "order": 2,
        "title": "groupby, aggregare si pivot_table",
        "content": "```python\n# groupby — agrega date dupa o coloana\ndf_grouped = df.groupby('departament').agg(\n    salar_mediu=('salar', 'mean'),\n    nr_angajati=('nume', 'count'),\n    salar_max=('salar', 'max')\n).reset_index()\n\nprint(df_grouped)\n# departament  salar_mediu  nr_angajati  salar_max\n# Finance           7000            1       7000\n# HR                5000            1       5000\n# IT                2900            2       3000\n\n# pivot_table\nimport numpy as np\ndf2 = pd.DataFrame({\n    'an': [2022,2022,2023,2023],\n    'trim': ['Q1','Q2','Q1','Q2'],\n    'vanzari': [100, 120, 130, 150]\n})\n\npivot = df2.pivot_table(\n    values='vanzari',\n    index='an',\n    columns='trim',\n    aggfunc='sum',\n    fill_value=0\n)\nprint(pivot)\n#       Q1   Q2\n# 2022  100  120\n# 2023  130  150\n```\n\n**Interviu:** Diferenta groupby+agg vs pivot_table? pivot_table e sugar sintactic pentru groupby cu reshape — mai intuitiv pentru rapoarte 2D."
      },
      {
        "order": 3,
        "title": "read_csv, merge si gestionare valori lipsa",
        "content": "```python\n# Citire CSV cu optiuni\ndf = pd.read_csv('date.csv',\n    sep=',',\n    encoding='utf-8',\n    dtype={'cod': str},      # forteaza tipul coloanei\n    parse_dates=['data'],    # parseaza automat datele\n    na_values=['N/A', '-']   # valori tratate ca NaN\n)\n\n# Gestionare valori lipsa\nprint(df.isnull().sum())    # numara NaN per coloana\ndf.fillna({'salar': df['salar'].median()}, inplace=True)\ndf.dropna(subset=['nume'], inplace=True)  # sterge randul daca 'nume' e NaN\n\n# merge (JOIN)\nangajati = pd.DataFrame({'id': [1,2,3], 'nume': ['A','B','C']})\ndepartamente = pd.DataFrame({'id': [1,2,4], 'dept': ['IT','HR','Fin']})\n\ninner = pd.merge(angajati, departamente, on='id', how='inner')  # 2 randuri\nleft  = pd.merge(angajati, departamente, on='id', how='left')   # 3 randuri, NaN la dept\nouter = pd.merge(angajati, departamente, on='id', how='outer')  # 4 randuri\n```\n\n**Interviu:** Tipuri de join Pandas? inner (numai matching), left/right (tot din stanga/dreapta + matching), outer (tot). Similar cu SQL JOIN."
      },
      {
        "order": 4,
        "title": "apply, vectorizare si performanta",
        "content": "```python\nimport pandas as pd\nimport numpy as np\n\ndf = pd.DataFrame({'x': range(1, 100001)})\n\n# SLAB: apply cu lambda (lent — Python loop)\ndf['x2_slow'] = df['x'].apply(lambda x: x ** 2)\n\n# BUN: operatii vectorizate (numpy sub capota)\ndf['x2_fast'] = df['x'] ** 2\n\n# BUN: np.where pentru conditii\ndf['categorie'] = np.where(df['x'] > 50000, 'mare', 'mic')\n\n# apply e ok pt logica complexa care nu se vectorizeaza\ndef categorizeaza(row):\n    if row['x'] > 90000: return 'VIP'\n    elif row['x'] > 50000: return 'Premium'\n    return 'Standard'\n\ndf['tier'] = df.apply(categorizeaza, axis=1)  # axis=1 = pe fiecare rand\n\n# str accessor pt operatii pe siruri\ndf_str = pd.DataFrame({'email': ['ana@it.ro', 'bob@hr.ro']})\ndf_str['domeniu'] = df_str['email'].str.split('@').str[1]\ndf_str['uppercase'] = df_str['email'].str.upper()\n```\n\n**Interviu:** Cand folosesti apply vs operatii vectorizate? Vectorizat (df['col'] * 2, np.where) e de 10-100x mai rapid. apply e pentru logica complexa imposibil de vectorizat."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "loc vs iloc",
        "question": "Diferenta dintre `df.loc[0, 'varsta']` si `df.iloc[0, 1]`?",
        "options": [
          "Identice mereu",
          "loc foloseste labels, iloc foloseste pozitii intregi — pot diferi daca indexul nu e 0-based",
          "iloc e mai rapid",
          "loc nu functioneaza pe coloane"
        ],
        "answer": "loc foloseste labels, iloc foloseste pozitii intregi — pot diferi daca indexul nu e 0-based",
        "explanation": "Daca df e filtrat si reindexat, df.loc[0] cauta label 0, care poate sa nu existe. iloc[0] = primul rand mereu.",
        "difficulty": "hard"
      },
      {
        "number": 2,
        "name": "groupby agg",
        "question": "Ce returneaza `df.groupby('dept')['salar'].mean()`?",
        "options": [
          "Un float cu media globala",
          "Un DataFrame cu media salariului per departament",
          "O Serie indexata dupa departament cu media salariilor",
          "O lista de medii"
        ],
        "answer": "O Serie indexata dupa departament cu media salariilor",
        "explanation": "groupby + aggregare = Series cu indexul = valorile coloanei de grup si valorile = agregarea ceruta.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "merge how=left",
        "question": "Ce se intampla cu randurile din left DataFrame care nu au corespondent in right la `merge(..., how='left')`?",
        "options": [
          "Sunt sterse",
          "Sunt pastrate cu NaN in coloanele right",
          "Produc eroare",
          "Sunt duplicate"
        ],
        "answer": "Sunt pastrate cu NaN in coloanele right",
        "explanation": "LEFT JOIN: toti randurile din left sunt pastrate. Coloanele din right sunt NaN unde nu exista match.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "fillna vs dropna",
        "question": "Diferenta `fillna(0)` vs `dropna()`?",
        "options": [
          "Identice",
          "fillna inlocuieste NaN cu o valoare; dropna sterge randurile/coloanele cu NaN",
          "dropna inlocuieste, fillna sterge",
          "Ambele sterg"
        ],
        "answer": "fillna inlocuieste NaN cu o valoare; dropna sterge randurile/coloanele cu NaN",
        "explanation": "fillna pastreaza toate randurile; dropna reduce dimensiunea. Alegerea depinde de context si de ce reprezinta NaN.",
        "difficulty": "easy"
      },
      {
        "number": 5,
        "name": "pivot_table vs groupby",
        "question": "Cand preferi `pivot_table` fata de `groupby`?",
        "options": [
          "Niciodata, groupby e mai puternic",
          "Cand vrei rezultat 2D (matrice) cu doua dimensiuni categoriale",
          "Cand ai date numerice",
          "Cand ai un singur grup"
        ],
        "answer": "Cand vrei rezultat 2D (matrice) cu doua dimensiuni categoriale",
        "explanation": "pivot_table e ideal pentru tabele de rapoarte: vanzari per an si trimestru, ratings per user si produs etc.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "apply vs vectorizare",
        "question": "De ce eviti `df['col'].apply(lambda x: x*2)` cand poti?",
        "options": [
          "Lambda nu functioneaza in apply",
          "apply e un Python loop, de 10-100x mai lent decat operatii vectorizate NumPy",
          "apply schimba tipul coloanei",
          "apply e deprecated"
        ],
        "answer": "apply e un Python loop, de 10-100x mai lent decat operatii vectorizate NumPy",
        "explanation": "df['col'] * 2 apeleaza BLAS/NumPy C-code. apply(lambda x: x*2) e Python pur per element — mult mai lent.",
        "difficulty": "hard"
      },
      {
        "number": 7,
        "name": "dtype fortat la read_csv",
        "question": "De ce folosesti `dtype={'cod': str}` la `read_csv`?",
        "options": [
          "Performanta",
          "Previne parsarea numerica a codurilor (ex. '007' nu devine 7)",
          "Obligatoriu",
          "Reduce memoria"
        ],
        "answer": "Previne parsarea numerica a codurilor (ex. '007' nu devine 7)",
        "explanation": "Pandas ghiceste tipurile — '007' devine int 7, pierzand zeroul. dtype explicit forteaza pastrarea ca string.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "reset_index dupa groupby",
        "question": "De ce apelezi `reset_index()` dupa `groupby().agg()`?",
        "options": [
          "E obligatoriu",
          "Transforma indexul ierarhic intr-o coloana normala, mai usor de lucrat",
          "Sorteaza rezultatul",
          "Elimina NaN"
        ],
        "answer": "Transforma indexul ierarhic intr-o coloana normala, mai usor de lucrat",
        "explanation": "Dupa groupby, coloana de grup devine index. reset_index() o transforma in coloana normala — util pentru merge-uri ulterioare.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "str accessor",
        "question": "Ce face `df['email'].str.split('@').str[1]`?",
        "options": [
          "Imparte email-urile si extrage al doilea element (domeniu)",
          "Eroare — str.split returneaza lista",
          "Extrage caracterul de la pozitia 1",
          "Imparte in max 1 bucata"
        ],
        "answer": "Imparte email-urile si extrage al doilea element (domeniu)",
        "explanation": "str.split('@') returneaza Serie de liste. str[1] indexeaza fiecare lista — extrage domeniu-ul.",
        "difficulty": "hard"
      },
      {
        "number": 10,
        "name": "isnull vs isna",
        "question": "Diferenta dintre `df.isnull()` si `df.isna()`?",
        "options": [
          "isnull detecteaza None, isna detecteaza NaN",
          "Identice — sunt alias-uri",
          "isna detecteaza si string-uri goale",
          "isnull e deprecated"
        ],
        "answer": "Identice — sunt alias-uri",
        "explanation": "isnull si isna sunt exact acelasi lucru in Pandas — alias-uri. Detecteaza NaN, None, pd.NaT.",
        "difficulty": "easy"
      },
      {
        "number": 11,
        "name": "inplace parametru",
        "question": "Diferenta `df.dropna(inplace=True)` vs `df = df.dropna()`?",
        "options": [
          "inplace e mai rapid",
          "Ambele au acelasi efect final, dar inplace modifica obiectul existent; fara inplace returneaza obiect nou",
          "inplace e deprecated in versiunile noi",
          "Sunt complet diferite"
        ],
        "answer": "Ambele au acelasi efect final, dar inplace modifica obiectul existent; fara inplace returneaza obiect nou",
        "explanation": "Pandas recomandata tot mai mult evitarea inplace=True (poate cauza probleme cu chain-uri si copii). df = df.dropna() e mai clar.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "GroupBy coding",
        "question": "Creeaza un DataFrame cu coloanele 'produs', 'categorie', 'pret'. Calculeaza pretul mediu pe categorie si afiseaza sortat descrescator.",
        "options": [],
        "answer": "",
        "explanation": "df.groupby('categorie')['pret'].mean().sort_values(ascending=False)",
        "difficulty": "easy"
      },
      {
        "number": 13,
        "name": "Merge coding",
        "question": "Realizeaza un LEFT JOIN intre un DataFrame de comenzi si unul de clienti pe coloana 'client_id'. Afiseaza comenzile chiar si fara client gasit.",
        "options": [],
        "answer": "",
        "explanation": "pd.merge(comenzi, clienti, on='client_id', how='left') — comanda 4 (client_id=99) va avea NaN la 'nume'.",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "Pivot table coding",
        "question": "Pornind de la un DataFrame cu 'an', 'luna' si 'vanzari', creeaza un pivot_table cu sumele vanzarilor pe an (index) si luna (coloane).",
        "options": [],
        "answer": "",
        "explanation": "df.pivot_table(values='vanzari', index='an', columns='luna', aggfunc='sum', fill_value=0)",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Curatare date coding",
        "question": "Citeste un DataFrame cu valori lipsa in coloana 'salar'. Inlocuieste NaN cu mediana salariilor si adauga coloana 'nivel' ('junior' daca salar < 4000, altfel 'senior').",
        "options": [],
        "answer": "",
        "explanation": "df['salar'].fillna(df['salar'].median(), inplace=True); df['nivel'] = np.where(df['salar'] < 4000, 'junior', 'senior')",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "python-numpy",
    "title": "43. NumPy — Calcul Numeric",
    "order": 43,
    "theory": [
      {
        "order": 1,
        "title": "Arrays NumPy — creare si proprietati",
        "content": "```python\nimport numpy as np\n\n# Creare\na = np.array([1, 2, 3, 4, 5])\nb = np.array([[1, 2, 3], [4, 5, 6]])  # 2D\n\nprint(a.shape)   # (5,)\nprint(b.shape)   # (2, 3)\nprint(b.ndim)    # 2\nprint(b.dtype)   # int64\nprint(b.size)    # 6 (total elemente)\n\n# Initializare speciala\nnp.zeros((3, 4))           # matrice de zerouri 3x4\nnp.ones((2, 3))            # matrice de 1\nnp.eye(3)                  # matrice identitate 3x3\nnp.arange(0, 10, 2)        # [0, 2, 4, 6, 8]\nnp.linspace(0, 1, 5)       # 5 valori uniforme: [0, .25, .5, .75, 1]\nnp.random.rand(3, 3)       # valori uniforme [0,1)\nnp.random.randn(3, 3)      # distributie normala\nnp.random.randint(1, 10, (3,3))  # intregi aleatoare\n\n# Reshape\na2 = np.arange(12).reshape(3, 4)  # (12,) -> (3,4)\na3 = a2.reshape(-1)               # inapoi la 1D (-1 = automat)\n```\n\n**Interviu:** De ce NumPy e mai rapid decat Python lists? Raspuns: array-urile NumPy sunt contigue in memorie (C array), operatiile sunt vectorizate in C/Fortran (BLAS). Python lists stocheaza pointeri la obiecte si fiecare operatie e Python bytecode."
      },
      {
        "order": 2,
        "title": "Broadcasting si operatii vectorizate",
        "content": "```python\nimport numpy as np\n\na = np.array([[1, 2, 3],\n              [4, 5, 6]])\n\n# Broadcasting: operatii element-by-element fara loop\nprint(a * 2)         # fiecare element * 2\nprint(a + 10)        # fiecare + 10\nprint(a ** 2)        # fiecare la patrat\n\n# Broadcasting cu shape diferit\nb = np.array([10, 20, 30])  # shape (3,)\nprint(a + b)  # (2,3) + (3,) = (2,3): adauga b la fiecare rand\n# [[11,22,33],\n#  [14,25,36]]\n\nc = np.array([[100], [200]])  # shape (2,1)\nprint(a + c)  # (2,3) + (2,1) = (2,3): adauga la fiecare coloana\n# [[101,102,103],\n#  [204,205,206]]\n\n# Regula broadcasting: dimensiunile sunt compatibile daca\n# sunt egale sau una e 1\n\n# Functii ufunc (universal functions)\nnp.sqrt(a)      # radacina patrata\nnp.exp(a)       # e^x\nnp.log(a)       # ln(x)\nnp.abs(a)       # valoare absoluta\n```"
      },
      {
        "order": 3,
        "title": "Indexare avansata si slicing",
        "content": "```python\nimport numpy as np\n\na = np.arange(10)  # [0,1,2,3,4,5,6,7,8,9]\n\n# Slicing (view, nu copie!)\nprint(a[2:5])    # [2,3,4]\nprint(a[::2])    # [0,2,4,6,8] — pas 2\nprint(a[::-1])   # [9,8,7,...,0] — inversare\n\n# Modificare prin view:\nb = a[2:5]\nb[0] = 99  # a[2] devine 99!\n# Copie explicita: c = a[2:5].copy()\n\n# Boolean indexing\na = np.array([1, -2, 3, -4, 5])\npozitive = a[a > 0]  # [1, 3, 5]\na[a < 0] = 0         # inlocuieste negativele cu 0\n\n# Fancy indexing (creaza COPIE)\nindici = [0, 2, 4]\nprint(a[indici])  # [1, 3, 5] — selectie arbitrara\n\n# 2D slicing\nm = np.arange(16).reshape(4, 4)\nprint(m[1:3, 2:4])   # submatrice randuri 1-2, coloane 2-3\nprint(m[:, 0])       # prima coloana\nprint(m[0, :])       # primul rand\n```"
      },
      {
        "order": 4,
        "title": "Linear algebra si agregari",
        "content": "```python\nimport numpy as np\n\n# Agregari\na = np.array([[1, 2, 3], [4, 5, 6]])\nprint(a.sum())         # 21 — total\nprint(a.sum(axis=0))   # [5,7,9] — suma pe coloane\nprint(a.sum(axis=1))   # [6,15] — suma pe randuri\nprint(a.mean(), a.std(), a.min(), a.max())\n\n# Operatii linalg\nA = np.array([[1,2],[3,4]])\nB = np.array([[5,6],[7,8]])\n\n# Produs matriceal\nprint(A @ B)           # [[19,22],[43,50]]\nprint(np.dot(A, B))    # identic cu @\n\n# Transpusa\nprint(A.T)\n\n# Determinant, invers, valori proprii\nprint(np.linalg.det(A))         # -2.0\nprint(np.linalg.inv(A))         # inversa matricii\nvals, vecs = np.linalg.eig(A)   # valori si vectori proprii\n\n# Rezolvare sistem liniar Ax = b\nb = np.array([1, 2])\nx = np.linalg.solve(A, b)\nprint(x)   # solutia\nprint(np.allclose(A @ x, b))  # True — verificare\n```"
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "shape vs size",
        "question": "Diferenta dintre `a.shape` si `a.size` pentru un array (3, 4)?",
        "options": [
          "Identice",
          "shape = (3,4) dimensiunile; size = 12 numarul total de elemente",
          "size = (3,4), shape = 12",
          "shape e doar pentru 1D"
        ],
        "answer": "shape = (3,4) dimensiunile; size = 12 numarul total de elemente",
        "explanation": "shape = tuple de dimensiuni. size = produsul dimensiunilor = numar total de elemente.",
        "difficulty": "easy"
      },
      {
        "number": 2,
        "name": "View vs copie",
        "question": "```python\na = np.arange(10)\nb = a[2:5]\nb[0] = 99\nprint(a[2])\n```",
        "options": [
          "2",
          "99",
          "0",
          "Eroare"
        ],
        "answer": "99",
        "explanation": "Slicing NumPy returneaza un VIEW (nu copie). Modificarea lui b modifica si a. Pentru copie: a[2:5].copy()",
        "difficulty": "hard"
      },
      {
        "number": 3,
        "name": "Broadcasting regula",
        "question": "Ce se intampla la `(3,4) + (4,)` in NumPy broadcasting?",
        "options": [
          "Eroare — shape incompatibil",
          "Arrayul (4,) e extins pe fiecare rand — rezultat (3,4)",
          "Rezultat (3,)",
          "Rezultat (4,3)"
        ],
        "answer": "Arrayul (4,) e extins pe fiecare rand — rezultat (3,4)",
        "explanation": "Broadcasting aliniaza de la dreapta: (3,4) + (4,) = (3,4) + (1,4) -> adauga randul (4,) la fiecare din cele 3 randuri.",
        "difficulty": "hard"
      },
      {
        "number": 4,
        "name": "axis in sum",
        "question": "Pt `a` cu shape (2,3): ce face `a.sum(axis=0)` vs `a.sum(axis=1)`?",
        "options": [
          "axis=0 = total; axis=1 = nimic",
          "axis=0 = suma pe coloane (shape 3,); axis=1 = suma pe randuri (shape 2,)",
          "axis=0 = suma pe randuri; axis=1 = suma pe coloane",
          "Identice"
        ],
        "answer": "axis=0 = suma pe coloane (shape 3,); axis=1 = suma pe randuri (shape 2,)",
        "explanation": "axis=0 colapseaza dimensiunea 0 (randuri) -> suma pe verticala. axis=1 colapseaza dim 1 (coloane) -> suma pe orizontala.",
        "difficulty": "hard"
      },
      {
        "number": 5,
        "name": "@ operator",
        "question": "Ce face operatorul `@` in `A @ B` unde A, B sunt matrice 2D?",
        "options": [
          "Inmultire element-by-element",
          "Produs matriceal (dot product)",
          "Concatenare",
          "Transpusa"
        ],
        "answer": "Produs matriceal (dot product)",
        "explanation": "@ (Python 3.5+) = produs matriceal = np.dot(A, B). NU e inmultire element-by-element (aceea e A*B).",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "Boolean indexing",
        "question": "Ce face `a[a > 0]` daca `a = np.array([-1, 2, -3, 4])`?",
        "options": [
          "[True, False, True, False]",
          "Eroare",
          "[2, 4]",
          "[-1, -3]"
        ],
        "answer": "[2, 4]",
        "explanation": "a > 0 = boolean mask [False,True,False,True]. a[mask] selecteaza elementele unde mask e True.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "reshape -1",
        "question": "Ce face `a.reshape(-1)` pe un array de shape (3,4)?",
        "options": [
          "Eroare",
          "Transforma in 1D cu 12 elemente (-1 = calculat automat)",
          "Inverseaza dimensiunile la (4,3)",
          "Returneaza (3,4,-1)"
        ],
        "answer": "Transforma in 1D cu 12 elemente (-1 = calculat automat)",
        "explanation": "-1 in reshape = 'calculeaza aceasta dimensiune automat'. (3,4).reshape(-1) = (12,). (3,4).reshape(2,-1) = (2,6).",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "np.linspace vs arange",
        "question": "Diferenta `np.linspace(0,1,5)` vs `np.arange(0,1,0.25)`?",
        "options": [
          "Identice",
          "linspace garanteaza N puncte inclusiv capetele; arange foloseste pasul si poate omite capatul",
          "arange e mai rapid",
          "linspace e doar pentru float"
        ],
        "answer": "linspace garanteaza N puncte inclusiv capetele; arange foloseste pasul si poate omite capatul",
        "explanation": "linspace(0,1,5) = exact 5 puncte: [0,.25,.5,.75,1]. arange cu float poate fi imprecis din cauza floating point.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "np.allclose utilitate",
        "question": "De ce folosesti `np.allclose(A, B)` in loc de `A == B` pentru comparatii de float?",
        "options": [
          "allclose e mai rapid",
          "Floating point nu e exact: 0.1+0.2 != 0.3 exact; allclose permite o toleranta",
          "== nu functioneaza pe array-uri",
          "allclose returneaza un array boolean"
        ],
        "answer": "Floating point nu e exact: 0.1+0.2 != 0.3 exact; allclose permite o toleranta",
        "explanation": "np.allclose(a, b, atol=1e-8) = True daca toate elementele sunt la distanta < toleranta. == verifica egalitate exacta.",
        "difficulty": "hard"
      },
      {
        "number": 10,
        "name": "Fancy indexing copie",
        "question": "Care dintre urmatoarele creaza VIEW (nu copie) in NumPy?",
        "options": [
          "a[[0,2,4]] — fancy indexing",
          "a[1:4] — slicing",
          "a[a>0] — boolean indexing",
          "a.copy()"
        ],
        "answer": "a[1:4] — slicing",
        "explanation": "Slicing de baza (a[1:4]) = VIEW. Fancy indexing si boolean indexing = COPIE intotdeauna.",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "dtype float32 vs float64",
        "question": "De ce ai vrea `np.array([1.0, 2.0], dtype=np.float32)` in loc de float64 default?",
        "options": [
          "float32 e mai precis",
          "float32 foloseste jumatate din memorie si e mai rapid pe GPU/ML",
          "float64 nu exista in NumPy",
          "float32 e mai usor de debugat"
        ],
        "answer": "float32 foloseste jumatate din memorie si e mai rapid pe GPU/ML",
        "explanation": "ML pe GPU (TensorFlow/PyTorch) prefera float32 — jumatate din memorie, operatii mai rapide. float64 e default pentru precizie generala.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Broadcasting coding",
        "question": "Creeaza o matrice 4x4 unde elementul [i,j] = i*10 + j, folosind broadcasting (fara loop).",
        "options": [],
        "answer": "",
        "explanation": "rows = np.arange(4).reshape(4,1) * 10; cols = np.arange(4); result = rows + cols",
        "difficulty": "hard"
      },
      {
        "number": 13,
        "name": "Normalizare array coding",
        "question": "Normalizeaza un array 1D la intervalul [0,1] fara a folosi sklearn. Afiseaza min si max dupa normalizare.",
        "options": [],
        "answer": "",
        "explanation": "normalized = (a - a.min()) / (a.max() - a.min()). Min = 0.0, max = 1.0.",
        "difficulty": "easy"
      },
      {
        "number": 14,
        "name": "Produs matriceal coding",
        "question": "Rezolva sistemul de ecuatii Ax = b folosind `np.linalg.solve`. Verifica solutia cu np.allclose.",
        "options": [],
        "answer": "",
        "explanation": "x = np.linalg.solve(A, b). Solutia: x[0] = 7.36..., x[1] = -3.72... Verificare: A @ x ≈ b.",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Statistica pe axe coding",
        "question": "Creeaza o matrice 5x4 cu valori aleatoare (normal), calculeaza media si std per coloana, si standardizeaza fiecare coloana (Z-score).",
        "options": [],
        "answer": "",
        "explanation": "mean = X.mean(axis=0); std = X.std(axis=0); Z = (X - mean) / std. Z.mean(axis=0) ≈ 0.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "python-matplotlib-seaborn",
    "title": "44. Matplotlib si Seaborn — Vizualizare Date",
    "order": 44,
    "theory": [
      {
        "order": 1,
        "title": "Matplotlib pyplot — bazele",
        "content": "```python\nimport matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(0, 2*np.pi, 100)\ny_sin = np.sin(x)\ny_cos = np.cos(x)\n\n# Figura si subplot\nfig, ax = plt.subplots(figsize=(10, 5))\n\nax.plot(x, y_sin, color='blue', linewidth=2, label='sin(x)')\nax.plot(x, y_cos, color='red', linestyle='--', label='cos(x)')\n\nax.set_title('Functii trigonometrice', fontsize=14)\nax.set_xlabel('x (radiani)')\nax.set_ylabel('y')\nax.legend()\nax.grid(True, alpha=0.3)\nax.axhline(y=0, color='black', linewidth=0.5)\n\nplt.tight_layout()\nplt.savefig('trig.png', dpi=150, bbox_inches='tight')\nplt.show()\n```\n\n**Interviu:** Diferenta `plt.plot` vs `ax.plot`? plt foloseste interfata de stare (state machine) — mereu pe figura/subplot curent. ax.plot e orientat obiect, explicit, recomandat in cod de productie."
      },
      {
        "order": 2,
        "title": "Subplots si tipuri de grafice",
        "content": "```python\nimport matplotlib.pyplot as plt\nimport numpy as np\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 8))\n\n# Scatter plot\nn = 100\nx = np.random.randn(n)\ny = x * 2 + np.random.randn(n)\naxes[0,0].scatter(x, y, alpha=0.5, c='steelblue')\naxes[0,0].set_title('Scatter')\n\n# Bar chart\ncategorii = ['A', 'B', 'C', 'D']\nvalori = [23, 45, 12, 67]\naxes[0,1].bar(categorii, valori, color='coral')\naxes[0,1].set_title('Bar Chart')\n\n# Histogram\ndata = np.random.normal(0, 1, 1000)\naxes[1,0].hist(data, bins=30, color='green', alpha=0.7, edgecolor='black')\naxes[1,0].set_title('Histograma')\n\n# Box plot\nboxdata = [np.random.normal(0,1,100) for _ in range(4)]\naxes[1,1].boxplot(boxdata, labels=['G1','G2','G3','G4'])\naxes[1,1].set_title('Box Plot')\n\nplt.tight_layout()\nplt.show()\n```"
      },
      {
        "order": 3,
        "title": "Seaborn — vizualizari statistice",
        "content": "```python\nimport seaborn as sns\nimport matplotlib.pyplot as plt\nimport pandas as pd\nimport numpy as np\n\n# Dataset\nsns.set_style('whitegrid')\nsns.set_palette('husl')\n\ndf = sns.load_dataset('tips')  # dataset inclus in seaborn\n\n# Distriburie: histplot cu KDE\nfig, axes = plt.subplots(1, 2, figsize=(12, 4))\nsns.histplot(df['total_bill'], kde=True, ax=axes[0])\nsns.boxplot(x='day', y='total_bill', data=df, ax=axes[1])\nplt.tight_layout()\nplt.show()\n\n# Heatmap pentru corelatii\nfig, ax = plt.subplots(figsize=(8, 6))\nnumeric_df = df.select_dtypes(include='number')\ncorr_matrix = numeric_df.corr()\nsns.heatmap(corr_matrix, annot=True, fmt='.2f',\n            cmap='coolwarm', center=0, ax=ax)\nplt.title('Matrice de corelatie')\nplt.show()\n```\n\n**Interviu:** Cand folosesti Seaborn vs Matplotlib pur? Seaborn = vizualizari statistice rapide cu Pandas DataFrames (heatmap, pairplot, violinplot). Matplotlib = control granular, animatii, grafice custom."
      },
      {
        "order": 4,
        "title": "Stilizare, subplots complexe si exportare",
        "content": "```python\nimport matplotlib.pyplot as plt\nimport matplotlib.gridspec as gridspec\nimport numpy as np\n\n# GridSpec pentru layout asimetric\nfig = plt.figure(figsize=(12, 8))\ngs = gridspec.GridSpec(2, 3, figure=fig,\n                       hspace=0.4, wspace=0.3)\n\nax1 = fig.add_subplot(gs[0, :2])   # primul rand, primele 2 coloane\nax2 = fig.add_subplot(gs[0, 2])    # primul rand, ultima coloana\nax3 = fig.add_subplot(gs[1, :])    # al doilea rand complet\n\nx = np.linspace(0, 10, 200)\nax1.plot(x, np.sin(x), 'b-', linewidth=2)\nax1.fill_between(x, np.sin(x), 0, alpha=0.3)\nax1.set_title('Area fill')\n\nax2.pie([30, 25, 20, 15, 10],\n        labels=['A','B','C','D','E'],\n        autopct='%1.1f%%', startangle=90)\nax2.set_title('Pie Chart')\n\nax3.plot(x, np.cos(x), 'r--', label='cos')\nax3.annotate('minim', xy=(np.pi, -1),\n             xytext=(np.pi+1, -0.5),\n             arrowprops=dict(arrowstyle='->'))\nax3.legend()\n\nplt.savefig('complex.png', dpi=200, bbox_inches='tight')\nplt.show()\n```"
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "fig, ax vs plt direct",
        "question": "Care e abordarea recomandata in cod de productie: `plt.plot(...)` sau `fig, ax = plt.subplots(); ax.plot(...)`?",
        "options": [
          "plt.plot — mai simplu",
          "fig, ax = plt.subplots() — OOP, mai explicit si controlabil",
          "Identice mereu",
          "plt.plot e mai rapid"
        ],
        "answer": "fig, ax = plt.subplots() — OOP, mai explicit si controlabil",
        "explanation": "OOP API (ax.plot) e recomandat: multiple subplot-uri, referinte explicite, evita efecte secundare ale state machine-ului.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "tight_layout utilitate",
        "question": "De ce folosesti `plt.tight_layout()`?",
        "options": [
          "Face graficul mai mare",
          "Ajusteaza automat spatiul intre subploturi ca sa nu se suprapuna labeluri",
          "Salveaza figura",
          "Seteaza fontul"
        ],
        "answer": "Ajusteaza automat spatiul intre subploturi ca sa nu se suprapuna labeluri",
        "explanation": "Fara tight_layout, titlurile si labelurile subplot-urilor se pot suprapune. tight_layout calculeaza spatiu optim.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "bins in histogram",
        "question": "Ce controleaza parametrul `bins` in `ax.hist(data, bins=30)`?",
        "options": [
          "Numarul de culori",
          "Numarul de intervale (baruri) in histograma",
          "Latimea totala a graficului",
          "Numarul de date"
        ],
        "answer": "Numarul de intervale (baruri) in histograma",
        "explanation": "bins = numarul de intervale in care se impart datele. Prea putine = prea general; prea multe = zgomot.",
        "difficulty": "easy"
      },
      {
        "number": 4,
        "name": "heatmap annot",
        "question": "Ce face `annot=True` in `sns.heatmap(corr, annot=True)`?",
        "options": [
          "Adauga titlu automat",
          "Afiseaza valorile numerice in fiecare celula",
          "Roteste labelurile",
          "Adauga colorbar"
        ],
        "answer": "Afiseaza valorile numerice in fiecare celula",
        "explanation": "annot=True scrie valoarea numerica in fiecare celula a heatmap-ului. fmt='.2f' controleaza formatul.",
        "difficulty": "easy"
      },
      {
        "number": 5,
        "name": "KDE in histplot",
        "question": "Ce e KDE in `sns.histplot(data, kde=True)`?",
        "options": [
          "Un tip de culoare",
          "Kernel Density Estimation — curba de densitate care estimeaza distributia probabilitatii",
          "K-Means clustering",
          "Cheie de export"
        ],
        "answer": "Kernel Density Estimation — curba de densitate care estimeaza distributia probabilitatii",
        "explanation": "KDE = curba netezita care estimeaza PDF-ul (probability density function) al distributiei datelor.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "alpha parametru",
        "question": "Ce face `alpha=0.5` in `ax.scatter(x, y, alpha=0.5)`?",
        "options": [
          "Seteaza marimea punctelor la 50%",
          "Seteaza transparenta la 50%",
          "Selecteaza 50% din date",
          "Seteaza culoarea"
        ],
        "answer": "Seteaza transparenta la 50%",
        "explanation": "alpha controleaza opacitatea: 0 = complet transparent, 1 = complet opac. Util pentru date dense unde punctele se suprapun.",
        "difficulty": "easy"
      },
      {
        "number": 7,
        "name": "savefig dpi",
        "question": "Ce face `dpi=200` in `plt.savefig('img.png', dpi=200)`?",
        "options": [
          "Seteaza adancimea de culoare la 200 biti",
          "Dots per inch — rezolutia imaginii salvate (200 = imagine de calitate printabila)",
          "Durata salvarii in ms",
          "Numarul de culori"
        ],
        "answer": "Dots per inch — rezolutia imaginii salvate (200 = imagine de calitate printabila)",
        "explanation": "dpi 72 = ecran web, 150 = bun, 300 = print professional. Default matplotlib e 100.",
        "difficulty": "medium"
      },
      {
        "number": 8,
        "name": "Seaborn vs Matplotlib",
        "question": "Cand e Seaborn mai potrivit decat Matplotlib pur?",
        "options": [
          "Intotdeauna, Seaborn e mai bun",
          "Cand lucrezi cu Pandas DataFrames si vrei vizualizari statistice rapide (heatmap, pairplot)",
          "Cand ai nevoie de control pixel cu pixel",
          "Cand faci animatii"
        ],
        "answer": "Cand lucrezi cu Pandas DataFrames si vrei vizualizari statistice rapide (heatmap, pairplot)",
        "explanation": "Seaborn = wrapper statistic peste Matplotlib. Excelent pentru EDA. Matplotlib = control absolut, animatii, grafice custom.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "subplots(2,2) indexare",
        "question": "Cum accesezi subplot-ul din randul 1, coloana 0 al unui `fig, axes = plt.subplots(2, 2)`?",
        "options": [
          "axes[1][0]",
          "axes[1,0]",
          "Ambele sunt corecte",
          "axes.get(1,0)"
        ],
        "answer": "Ambele sunt corecte",
        "explanation": "axes e un numpy array 2D. axes[1][0] si axes[1,0] sunt echivalente in NumPy.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "fill_between",
        "question": "Ce face `ax.fill_between(x, y, 0, alpha=0.3)`?",
        "options": [
          "Coloreaza toate punctele de sub y=0",
          "Umple aria intre curba y si linia y=0",
          "Adauga banda de eroare",
          "Coloreaza background-ul"
        ],
        "answer": "Umple aria intre curba y si linia y=0",
        "explanation": "fill_between umple zona dintre doua curbe (sau curba si o constanta). Util pentru intervale de incredere, arii sub curbe.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "bbox_inches tight",
        "question": "De ce folosesti `bbox_inches='tight'` la `savefig`?",
        "options": [
          "Comprima fisierul",
          "Include labelurile si titlul in imaginea salvata (fara ele ar fi taiate)",
          "Mareste rezolutia",
          "Seteaza formatul JPEG"
        ],
        "answer": "Include labelurile si titlul in imaginea salvata (fara ele ar fi taiate)",
        "explanation": "Fara bbox_inches='tight', labelurile de pe axe pot fi taiate la salvare. tight ajusteaza bounding box-ul sa includa totul.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Grafic simplu coding",
        "question": "Creeaza un grafic line care afiseaza sin si cos pe [0, 2pi] cu legenda, titlu si grila.",
        "options": [],
        "answer": "",
        "explanation": "ax.plot(x, np.sin(x), label='sin'); ax.plot(x, np.cos(x), '--', label='cos'); ax.legend(); ax.grid(True)",
        "difficulty": "easy"
      },
      {
        "number": 13,
        "name": "Histograma coding",
        "question": "Genereaza 1000 de valori din distributia normala (mean=5, std=2) si afiseaza histograma cu 25 bins si KDE.",
        "options": [],
        "answer": "",
        "explanation": "fig, ax = plt.subplots(); sns.histplot(data, kde=True, bins=25, ax=ax); ax.set_title('Distributie normala')",
        "difficulty": "easy"
      },
      {
        "number": 14,
        "name": "Heatmap corelatie coding",
        "question": "Genereaza un DataFrame cu 4 coloane corelate si afiseaza un heatmap de corelatie cu seaborn.",
        "options": [],
        "answer": "",
        "explanation": "sns.heatmap(df.corr(), annot=True, fmt='.2f', cmap='coolwarm', center=0)",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Subplots multipli coding",
        "question": "Creeaza un grafic 2x2 cu: scatter (stanga sus), histograma (dreapta sus), bar chart (stanga jos), box plot (dreapta jos).",
        "options": [],
        "answer": "",
        "explanation": "axes[0,0].scatter(x,y); axes[0,1].hist(y,bins=20); axes[1,0].bar(cat,val); axes[1,1].boxplot(boxdata)",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "python-fastapi",
    "title": "45. FastAPI — Web API modern",
    "order": 45,
    "theory": [
      {
        "order": 1,
        "title": "Rute, path parameters si query parameters",
        "content": "```python\nfrom fastapi import FastAPI, HTTPException, Query, Path\nfrom typing import Optional\n\napp = FastAPI(title='API Demo', version='1.0.0')\n\n# Baza: GET fara parametri\n@app.get('/')\nasync def root():\n    return {'message': 'Salut, FastAPI!'}\n\n# Path parameter: {item_id} in URL\n@app.get('/items/{item_id}')\nasync def get_item(\n    item_id: int = Path(..., gt=0, description='ID-ul articolului')\n):\n    if item_id > 100:\n        raise HTTPException(status_code=404, detail='Articol negasit')\n    return {'item_id': item_id, 'name': f'Articol {item_id}'}\n\n# Query parameter: /items?skip=0&limit=10\n@app.get('/items')\nasync def list_items(\n    skip: int = Query(0, ge=0),\n    limit: int = Query(10, ge=1, le=100),\n    search: Optional[str] = None\n):\n    return {'skip': skip, 'limit': limit, 'search': search}\n```\n\n**Interviu:** De ce FastAPI in loc de Flask? FastAPI: validare automata cu Pydantic, documentatie OpenAPI auto-generata, async nativ, type hints, de 2-3x mai rapid. Flask: mai simplu, ecosistem mai vechi, mai flexibil."
      },
      {
        "order": 2,
        "title": "Pydantic models — validare request/response",
        "content": "```python\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel, Field, validator\nfrom typing import Optional, List\nfrom datetime import datetime\n\napp = FastAPI()\n\nclass ItemCreate(BaseModel):\n    name: str = Field(..., min_length=1, max_length=100)\n    price: float = Field(..., gt=0, description='Pret pozitiv')\n    tags: List[str] = Field(default_factory=list)\n    is_available: bool = True\n\n    @validator('name')\n    def name_must_not_be_empty(cls, v):\n        return v.strip()\n\nclass ItemResponse(BaseModel):\n    id: int\n    name: str\n    price: float\n    created_at: datetime\n\n    class Config:\n        from_attributes = True  # Pydantic v2 (orm_mode in v1)\n\ndb: list = []  # 'baza de date' in memorie\n\n@app.post('/items', response_model=ItemResponse, status_code=201)\nasync def create_item(item: ItemCreate):\n    new_item = {'id': len(db)+1, 'created_at': datetime.now(), **item.dict()}\n    db.append(new_item)\n    return new_item\n```\n\n**Interviu:** Pydantic asigura validarea la runtime — daca clientul trimite price='abc', FastAPI returneaza 422 Unprocessable Entity cu detalii clare."
      },
      {
        "order": 3,
        "title": "Dependency Injection si middleware",
        "content": "```python\nfrom fastapi import FastAPI, Depends, Header, HTTPException\nfrom functools import lru_cache\n\napp = FastAPI()\n\n# Dependency simpla\ndef get_db():\n    db = {'connection': 'simulata'}  # in realitate: SQLAlchemy session\n    try:\n        yield db\n    finally:\n        pass  # inchide conexiunea\n\n# Dependency pentru autentificare\nasync def verify_token(\n    authorization: str = Header(...)\n):\n    if not authorization.startswith('Bearer '):\n        raise HTTPException(status_code=401, detail='Token invalid')\n    token = authorization.split(' ')[1]\n    return {'user_id': 1}  # in realitate: decodezi JWT\n\n@app.get('/profile')\nasync def get_profile(\n    db = Depends(get_db),\n    user = Depends(verify_token)\n):\n    return {'user': user, 'db': 'conectat'}\n\n# Middleware CORS\nfrom fastapi.middleware.cors import CORSMiddleware\napp.add_middleware(\n    CORSMiddleware,\n    allow_origins=['http://localhost:3000'],\n    allow_methods=['*'],\n    allow_headers=['*']\n)\n```"
      },
      {
        "order": 4,
        "title": "Async si background tasks",
        "content": "```python\nfrom fastapi import FastAPI, BackgroundTasks\nimport asyncio\nimport httpx\n\napp = FastAPI()\n\n# Async endpoint — elibereaza thread-ul in timp ce asteapta I/O\n@app.get('/async-data')\nasync def fetch_data():\n    async with httpx.AsyncClient() as client:\n        # Face request HTTP fara a bloca alte request-uri\n        r = await client.get('https://api.example.com/data')\n    return r.json()\n\n# Background task — ruleaza dupa ce raspunsul e trimis\ndef send_email(email: str, body: str):\n    import time\n    time.sleep(2)  # simulare trimitere email lenta\n    print(f'Email trimis la {email}: {body}')\n\n@app.post('/register')\nasync def register(\n    email: str,\n    background_tasks: BackgroundTasks\n):\n    # Inregistrare rapida + email in background\n    background_tasks.add_task(send_email, email, 'Bun venit!')\n    return {'message': 'Inregistrat! Vei primi un email.'}\n\n# Async la nivel de startup/shutdown\n@app.on_event('startup')\nasync def startup_event():\n    print('API pornit!')\n\n@app.on_event('shutdown')\nasync def shutdown_event():\n    print('API oprit!')\n```\n\n**Interviu:** Cand async conteaza in FastAPI? Async ajuta cand ai I/O bound operations (DB, HTTP, fisiere). CPU-bound (calcule intense) = nu beneficiaza de async — folosesti multiprocessing sau celery."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Path vs query param",
        "question": "Diferenta dintre path parameter `/items/{id}` si query parameter `/items?id=5`?",
        "options": [
          "Identice",
          "Path param face parte din URL structurat (obligatoriu); query param e optional dupa ?",
          "Query param e in body",
          "Nu exista diferenta in FastAPI"
        ],
        "answer": "Path param face parte din URL structurat (obligatoriu); query param e optional dupa ?",
        "explanation": "Path params: /users/42 — identifica resursa. Query params: /users?age=25 — filtrare/paginare. RESTful: ID-uri in path.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "Status code 422",
        "question": "Ce returneaza FastAPI automat cand requestul nu trece validarea Pydantic?",
        "options": [
          "400 Bad Request",
          "422 Unprocessable Entity cu detalii despre erori",
          "500 Internal Server Error",
          "404 Not Found"
        ],
        "answer": "422 Unprocessable Entity cu detalii despre erori",
        "explanation": "FastAPI+Pydantic returneaza automat 422 cu JSON detaliat: ce camp a esuat si de ce. Nu trebuie cod manual.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "Depends utilitate",
        "question": "De ce folosesti `Depends()` in FastAPI?",
        "options": [
          "Performanta",
          "Dependency Injection: reutilizare logica (auth, DB session) fara cod duplicat",
          "E obligatoriu",
          "Async support"
        ],
        "answer": "Dependency Injection: reutilizare logica (auth, DB session) fara cod duplicat",
        "explanation": "Depends permite injectarea de dependente (DB session, user autentificat) reutilizabile in mai multi endpoint-uri.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "response_model",
        "question": "Ce face `response_model=ItemResponse` in `@app.post('/items', response_model=ItemResponse)`?",
        "options": [
          "Valideaza input-ul",
          "Filtreaza si valideaza raspunsul — exclude campuri extra (ex. parola) si valideaza tipurile",
          "Seteaza status code",
          "Seteaza Content-Type"
        ],
        "answer": "Filtreaza si valideaza raspunsul — exclude campuri extra (ex. parola) si valideaza tipurile",
        "explanation": "response_model = ce returneaza API-ul client-ului. Campuri din model care nu sunt in response_model sunt excluse automat.",
        "difficulty": "hard"
      },
      {
        "number": 5,
        "name": "async endpoint beneficiu",
        "question": "De ce async endpoint-urile FastAPI sunt mai eficiente pentru I/O operations?",
        "options": [
          "Ruleaza pe mai multe thread-uri",
          "Elibereaza event loop-ul pe durata asteptarii I/O, permitand alte request-uri sa fie procesate",
          "Sunt mai rapide CPU",
          "Evita erorile de retea"
        ],
        "answer": "Elibereaza event loop-ul pe durata asteptarii I/O, permitand alte request-uri sa fie procesate",
        "explanation": "await suspenda coroutine-ul si da control event loop-ului. In timp ce asteapta DB/HTTP, alte request-uri pot fi procesate.",
        "difficulty": "hard"
      },
      {
        "number": 6,
        "name": "BackgroundTasks utilitate",
        "question": "Cand folosesti `BackgroundTasks` in FastAPI?",
        "options": [
          "Pentru toate operatiile async",
          "Pentru operatii lente (email, notificari) care nu trebuie sa blocheze raspunsul",
          "Nu exista in FastAPI",
          "Pentru cache"
        ],
        "answer": "Pentru operatii lente (email, notificari) care nu trebuie sa blocheze raspunsul",
        "explanation": "BackgroundTasks ruleaza dupa ce raspunsul e trimis clientului. Clientul nu asteapta trimiterea email-ului.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "HTTPException",
        "question": "Cum returnezi un 404 Not Found cu mesaj custom in FastAPI?",
        "options": [
          "return 404",
          "raise HTTPException(status_code=404, detail='Nu gasit')",
          "return Response(404)",
          "abort(404)"
        ],
        "answer": "raise HTTPException(status_code=404, detail='Nu gasit')",
        "explanation": "HTTPException e exceptia FastAPI pentru erori HTTP. FastAPI o prinde si returneaza JSON: {detail: 'Nu gasit'} cu status 404.",
        "difficulty": "easy"
      },
      {
        "number": 8,
        "name": "Field validare",
        "question": "Ce face `Field(..., gt=0)` in Pydantic?",
        "options": [
          "gt=0 = valoarea implicita e 0",
          "... = obligatoriu, gt=0 = valoarea trebuie sa fie strict mai mare ca 0",
          "gt = tipul string",
          "... = optional"
        ],
        "answer": "... = obligatoriu, gt=0 = valoarea trebuie sa fie strict mai mare ca 0",
        "explanation": "... = Ellipsis = camp obligatoriu (fara default). gt=0 = greater than 0. Similar: ge=0, lt=100, le=100.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "CORS middleware",
        "question": "De ce adaugi CORSMiddleware in FastAPI?",
        "options": [
          "Performanta",
          "Permite browser-elor sa faca request-uri cross-origin (ex. frontend pe port 3000 catre API pe 8000)",
          "Compresie",
          "Logging"
        ],
        "answer": "Permite browser-elor sa faca request-uri cross-origin (ex. frontend pe port 3000 catre API pe 8000)",
        "explanation": "Browser-ele blocheaza implicit cross-origin requests. CORS headers (Access-Control-Allow-Origin) permit explicit.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "yield in dependency",
        "question": "De ce folosesti `yield` in loc de `return` intr-o dependency (ex. get_db)?",
        "options": [
          "yield e mai rapid",
          "yield permite cod de cleanup dupa ce endpoint-ul termina (inchidere conexiune DB)",
          "Nu conteaza",
          "yield e obligatoriu"
        ],
        "answer": "yield permite cod de cleanup dupa ce endpoint-ul termina (inchidere conexiune DB)",
        "explanation": "try: yield db; finally: db.close() — cleanup garantat indiferent de erori, similar cu context managers.",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "Documentatie automata",
        "question": "Unde gasesti documentatia API generata automat de FastAPI?",
        "options": [
          "Trebuie generata manual",
          "/docs (Swagger UI) si /redoc (ReDoc) — auto-generate din tipuri si Pydantic models",
          "Trebuie instalat pachet extra",
          "/api-docs"
        ],
        "answer": "/docs (Swagger UI) si /redoc (ReDoc) — auto-generate din tipuri si Pydantic models",
        "explanation": "FastAPI genereaza automat OpenAPI schema si o serveste la /docs (interactiv) si /redoc (citire). Zero configurare.",
        "difficulty": "easy"
      },
      {
        "number": 12,
        "name": "Endpoint GET simplu coding",
        "question": "Creeaza un endpoint GET /health care returneaza {status: 'ok', version: '1.0.0'} si un endpoint GET /greet/{name} care returneaza salutare personalizata.",
        "options": [],
        "answer": "",
        "explanation": "@app.get('/health') async def health(): return {'status': 'ok', 'version': '1.0.0'}",
        "difficulty": "easy"
      },
      {
        "number": 13,
        "name": "Pydantic model coding",
        "question": "Defineste un model Pydantic `UserCreate` cu campurile: username (str, min 3 chars), email (str), age (int, 0-120). Adauga un endpoint POST /users care il primeste si returneaza datele cu un id generat.",
        "options": [],
        "answer": "",
        "explanation": "class UserCreate(BaseModel): username: str = Field(..., min_length=3); email: str; age: int = Field(..., ge=0, le=120)",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "Dependency auth coding",
        "question": "Creeaza o dependency `get_current_user` care verifica un API key din header 'X-API-Key'. Daca nu e 'secret123', returneaza 401.",
        "options": [],
        "answer": "",
        "explanation": "async def get_current_user(x_api_key: str = Header(...)): if x_api_key != 'secret123': raise HTTPException(401)",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "CRUD complet coding",
        "question": "Implementeaza un CRUD simplu in memorie pentru o resursa 'Note' (id, title, content). Endpoint-uri: POST /notes, GET /notes, GET /notes/{id}, DELETE /notes/{id}.",
        "options": [],
        "answer": "",
        "explanation": "CRUD complet: post creeaza NoteDB cu id incrementat; get lista returneaza notes_db; get/{id} cauta in lista; delete sterge.",
        "difficulty": "hard"
      }
    ]
  },
  {
    "slug": "python-sqlalchemy",
    "title": "46. SQLAlchemy — ORM in Python",
    "order": 46,
    "theory": [
      {
        "order": 1,
        "title": "Engine, Session si modele declarative",
        "content": "```python\nfrom sqlalchemy import create_engine, Column, Integer, String, Float\nfrom sqlalchemy.orm import DeclarativeBase, Session\n\n# Engine: conexiunea la baza de date\n# SQLite pentru dev, PostgreSQL pentru productie\nengine = create_engine(\n    'sqlite:///./app.db',\n    echo=True  # afiseaza SQL generat\n)\n\n# Clasa de baza pentru modele\nclass Base(DeclarativeBase):\n    pass\n\n# Model\nclass Produs(Base):\n    __tablename__ = 'produse'\n\n    id = Column(Integer, primary_key=True, index=True)\n    nume = Column(String(100), nullable=False)\n    pret = Column(Float, nullable=False)\n    stoc = Column(Integer, default=0)\n\n    def __repr__(self):\n        return f'<Produs id={self.id} nume={self.nume}>'\n\n# Creeaza tabelele in DB\nBase.metadata.create_all(bind=engine)\n\n# Sesiune — unitatea de lucru\nwith Session(engine) as session:\n    prod = Produs(nume='Laptop', pret=3000.0, stoc=10)\n    session.add(prod)\n    session.commit()\n    session.refresh(prod)  # incarca id-ul generat\n    print(prod.id)\n```\n\n**Interviu:** ORM vs SQL raw? ORM: cod Python, type safety, portabilitate intre DB. Raw SQL: performanta maxima, control total, complexitate pentru queries specifice."
      },
      {
        "order": 2,
        "title": "Query si filtrare",
        "content": "```python\nfrom sqlalchemy import create_engine, select, and_, or_, desc\nfrom sqlalchemy.orm import Session\n\nwith Session(engine) as session:\n    # SELECT * FROM produse\n    toate = session.execute(select(Produs)).scalars().all()\n\n    # WHERE pret > 100\n    scumpe = session.execute(\n        select(Produs).where(Produs.pret > 100)\n    ).scalars().all()\n\n    # AND, OR\n    filtrat = session.execute(\n        select(Produs).where(\n            and_(Produs.pret > 100, Produs.stoc > 0)\n        )\n    ).scalars().all()\n\n    # ORDER BY, LIMIT\n    primele_5 = session.execute(\n        select(Produs)\n        .where(Produs.stoc > 0)\n        .order_by(desc(Produs.pret))\n        .limit(5)\n    ).scalars().all()\n\n    # SELECT BY PRIMARY KEY\n    prod = session.get(Produs, 1)  # None daca nu exista\n\n    # UPDATE\n    if prod:\n        prod.pret = 2500.0\n        session.commit()\n\n    # DELETE\n    session.delete(prod)\n    session.commit()\n```"
      },
      {
        "order": 3,
        "title": "Relatii — one-to-many si many-to-many",
        "content": "```python\nfrom sqlalchemy import ForeignKey, Table\nfrom sqlalchemy.orm import relationship\n\n# Many-to-many: tabel intermediar\nproduse_categorii = Table(\n    'produse_categorii', Base.metadata,\n    Column('produs_id', ForeignKey('produse.id'), primary_key=True),\n    Column('categorie_id', ForeignKey('categorii.id'), primary_key=True)\n)\n\nclass Categorie(Base):\n    __tablename__ = 'categorii'\n    id = Column(Integer, primary_key=True)\n    nume = Column(String, nullable=False)\n    produse = relationship('Produs', secondary=produse_categorii,\n                           back_populates='categorii')\n\nclass Produs(Base):\n    __tablename__ = 'produse'\n    id = Column(Integer, primary_key=True)\n    nume = Column(String)\n    comenzi = relationship('ComandaItem', back_populates='produs')\n    categorii = relationship('Categorie', secondary=produse_categorii,\n                             back_populates='produse')\n\nclass ComandaItem(Base):\n    __tablename__ = 'comanda_items'\n    id = Column(Integer, primary_key=True)\n    produs_id = Column(Integer, ForeignKey('produse.id'))\n    cantitate = Column(Integer)\n    produs = relationship('Produs', back_populates='comenzi')\n```\n\n**Interviu:** lazy vs eager loading? lazy (implicit): relatia se incarca la prima accesare (N+1 query problem). eager (`joinedload`/`selectinload`): incarca relatia intr-un singur query."
      },
      {
        "order": 4,
        "title": "Alembic migrari si session management",
        "content": "```python\n# Pattern pentru aplicatii web: session per request\nfrom sqlalchemy.orm import sessionmaker\nfrom contextlib import contextmanager\n\nSessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)\n\n@contextmanager\ndef get_db_session():\n    session = SessionLocal()\n    try:\n        yield session\n        session.commit()\n    except Exception:\n        session.rollback()\n        raise\n    finally:\n        session.close()\n\n# Utilizare\nwith get_db_session() as db:\n    produs = db.get(Produs, 1)\n    produs.pret = 999.0\n    # commit automat la sfarsit\n\n# Alembic migrari (CLI):\n# alembic init alembic\n# alembic revision --autogenerate -m 'add column'\n# alembic upgrade head   — aplica migrarea\n# alembic downgrade -1   — revine la versiunea anterioara\n\n# N+1 problem si solutia:\nfrom sqlalchemy.orm import joinedload\nwith Session(engine) as s:\n    # BAD: incarca produsele, apoi categoriile separat per produs\n    # produse = s.execute(select(Produs)).scalars().all()\n    # GOOD: un singur JOIN\n    produse = s.execute(\n        select(Produs).options(joinedload(Produs.categorii))\n    ).scalars().unique().all()\n```"
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "ORM vs raw SQL",
        "question": "Care e avantajul principal al ORM fata de SQL raw?",
        "options": [
          "ORM e intotdeauna mai rapid",
          "Cod Python type-safe, portabil intre DB-uri, fara SQL injection vulnerabilities",
          "ORM nu necesita conexiune DB",
          "SQL raw e mai greu de scris"
        ],
        "answer": "Cod Python type-safe, portabil intre DB-uri, fara SQL injection vulnerabilities",
        "explanation": "ORM = abstractie peste SQL. Schimbi SQLite cu PostgreSQL fara sa modifici codul. Parametrizare automata = no SQL injection.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "session.add vs session.merge",
        "question": "Diferenta dintre `session.add(obj)` si `session.merge(obj)`?",
        "options": [
          "Identice",
          "add: adauga obiect nou (eroare daca exista); merge: adauga sau updateaza daca exista dupa primary key",
          "merge e mai lent",
          "add e pentru bulk insert"
        ],
        "answer": "add: adauga obiect nou (eroare daca exista); merge: adauga sau updateaza daca exista dupa primary key",
        "explanation": "merge e UPSERT: daca obiectul are id care exista in DB, il updateaza; altfel il insereaza.",
        "difficulty": "hard"
      },
      {
        "number": 3,
        "name": "session.commit vs session.flush",
        "question": "Diferenta `session.commit()` vs `session.flush()`?",
        "options": [
          "Identice",
          "flush: trimite SQL la DB dar pastreaza tranzactia deschisa; commit: finalizeaza tranzactia permanent",
          "commit e mai rapid",
          "flush face rollback"
        ],
        "answer": "flush: trimite SQL la DB dar pastreaza tranzactia deschisa; commit: finalizeaza tranzactia permanent",
        "explanation": "flush e util cand vrei ID-ul generat inainte de commit (ex. pentru a crea relatii). flush fara commit = rollback posibil.",
        "difficulty": "hard"
      },
      {
        "number": 4,
        "name": "N+1 problem",
        "question": "Ce e problema N+1 in ORM?",
        "options": [
          "Prea multe coloane",
          "La accesarea relatiei lazy, se face cate un query per obiect parinte (N query-uri extra)",
          "Un bug SQLAlchemy",
          "Overflow de ID"
        ],
        "answer": "La accesarea relatiei lazy pentru N obiecte parinte, se face cate un query per obiect parinte (N query-uri extra)",
        "explanation": "5 comenzi, fiecare cu relatie lazy la produse = 1 (comenzi) + 5 (produse) = 6 query-uri. Fix: joinedload sau selectinload.",
        "difficulty": "hard"
      },
      {
        "number": 5,
        "name": "ForeignKey in SQLAlchemy",
        "question": "Ce face `Column(Integer, ForeignKey('tabela.id'))`?",
        "options": [
          "Creeaza o tabela noua",
          "Defineste o cheie straina care referencesaza coloana id din tabela specificata",
          "E echivalent cu primary_key",
          "Indexeaza coloana"
        ],
        "answer": "Defineste o cheie straina care referencesaza coloana id din tabela specificata",
        "explanation": "ForeignKey = constrangere la nivel DB: valorile coloanei trebuie sa existe in tabela referentiata.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "session.rollback",
        "question": "Cand apelezi `session.rollback()`?",
        "options": [
          "Dupa fiecare commit",
          "Dupa o eroare — anuleaza toate modificarile din tranzactia curenta",
          "Pentru a sterge date",
          "Niciodata manual"
        ],
        "answer": "Dupa o eroare — anuleaza toate modificarile din tranzactia curenta",
        "explanation": "In contextmanager: except Exception: session.rollback() — revine la starea anterioara commit-ului.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "echo=True in engine",
        "question": "Ce face `echo=True` la `create_engine`?",
        "options": [
          "Afiseaza erorile",
          "Logheaza toate SQL-urile generate catre stdout — util pentru debugging",
          "Activeaza verbose mode",
          "Face query-urile mai lente intentionat"
        ],
        "answer": "Logheaza toate SQL-urile generate catre stdout — util pentru debugging",
        "explanation": "echo=True = vezi exact ce SQL genereaza ORM-ul. Esential la debugging N+1, query-uri ineficiente.",
        "difficulty": "easy"
      },
      {
        "number": 8,
        "name": "lazy vs eager loading",
        "question": "Care e diferenta intre lazy si eager loading in SQLAlchemy?",
        "options": [
          "Lazy e mai rapid mereu",
          "Lazy incarca relatia la acces (potentiale N+1); eager incarca cu JOIN intr-un singur query",
          "Eager e implicit",
          "Nu exista eager loading"
        ],
        "answer": "Lazy incarca relatia la acces (potentiale N+1); eager incarca cu JOIN intr-un singur query",
        "explanation": "Lazy = comodo dar periculos la volume. Eager (joinedload, selectinload) = un query mai mare dar mai eficient total.",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "Base.metadata.create_all",
        "question": "Ce face `Base.metadata.create_all(bind=engine)`?",
        "options": [
          "Sterge tabelele",
          "Creeaza tabelele definite in modele daca nu exista deja (nu face migrate)",
          "Migreaza schema",
          "Populeaza cu date"
        ],
        "answer": "Creeaza tabelele definite in modele daca nu exista deja (nu face migrate)",
        "explanation": "create_all e pentru setup initial. Nu modifica tabele existente. Pentru modificari schema: folosesti Alembic.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "select() modern",
        "question": "Care e sintaxa moderna SQLAlchemy 2.0 pentru SELECT?",
        "options": [
          "session.query(Model).filter()",
          "session.execute(select(Model).where()).scalars().all()",
          "Model.query.filter()",
          "session.SELECT(Model)"
        ],
        "answer": "session.execute(select(Model).where()).scalars().all()",
        "explanation": "SQLAlchemy 2.0 foloseste select() construct si session.execute(). session.query() (stil vechi) e deprecated.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "Alembic scop",
        "question": "De ce folosesti Alembic in loc sa apelezi create_all() de fiecare data?",
        "options": [
          "create_all e prea lent",
          "Alembic gestioneaza migrari incrementale (add column, alter type) fara sa stearga date existente",
          "Obligatoriu cu FastAPI",
          "Alembic e mai simplu"
        ],
        "answer": "Alembic gestioneaza migrari incrementale (add column, alter type) fara sa stearga date existente",
        "explanation": "create_all nu modifica tabele existente. Alembic face upgrade/downgrade schema cu date pastrate — esential in productie.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Model simplu coding",
        "question": "Defineste un model SQLAlchemy `Utilizator` cu campurile id, email (unic), nume, activ (bool, default True). Creeaza tabelul cu SQLite.",
        "options": [],
        "answer": "",
        "explanation": "class Utilizator(Base): __tablename__='utilizatori'; id=Column(Integer, primary_key=True); email=Column(String, unique=True); etc.",
        "difficulty": "easy"
      },
      {
        "number": 13,
        "name": "CRUD SQLAlchemy coding",
        "question": "Adauga 3 produse in DB, actualizeaza pretul primului, sterge al treilea, si afiseaza toate produsele ramase.",
        "options": [],
        "answer": "",
        "explanation": "session.add_all([p1,p2,p3]); session.commit(); p1.pret=...; session.delete(p3); session.commit()",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "Relatie one-to-many coding",
        "question": "Defineste o relatie one-to-many intre Autor (id, nume) si Carte (id, titlu, autor_id). Adauga un autor cu 2 carti si afiseaza cartile lui.",
        "options": [],
        "answer": "",
        "explanation": "class Autor(Base): carti = relationship('Carte', back_populates='autor'). autor.carti.append(Carte(titlu=...))",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Query cu filtre coding",
        "question": "Creeaza 10 produse cu preturi intre 10-1000 si stoc intre 0-50. Afiseaza produsele cu stoc > 0 sortate dupa pret descrescator, limitate la 5.",
        "options": [],
        "answer": "",
        "explanation": "session.execute(select(Produs).where(Produs.stoc>0).order_by(desc(Produs.pret)).limit(5)).scalars().all()",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "python-docker",
    "title": "47. Docker si Python",
    "order": 47,
    "theory": [
      {
        "order": 1,
        "title": "Dockerfile pentru aplicatii Python",
        "content": "```dockerfile\n# Dockerfile pentru FastAPI\nFROM python:3.11-slim\n\n# Variabile de build\nARG APP_ENV=production\n\n# Setare workdir\nWORKDIR /app\n\n# Copiere requirements PRIMUL (cache layer)\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\n# Copiere cod sursa\nCOPY . .\n\n# User non-root pentru securitate\nRUN useradd --create-home appuser\nUSER appuser\n\n# Variabile de mediu\nENV PORT=8000\nENV PYTHONUNBUFFERED=1\nENV PYTHONDONTWRITEBYTECODE=1\n\n# Expune portul\nEXPOSE 8000\n\n# Healthcheck\nHEALTHCHECK --interval=30s --timeout=3s \\\n  CMD curl -f http://localhost:8000/health || exit 1\n\n# Comanda de start\nCMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]\n```\n\n**Interviu:** De ce copiezi requirements.txt separat inainte de restul codului? Layer caching Docker: daca requirements.txt nu s-a schimbat, layer-ul cu pip install e din cache — build mult mai rapid."
      },
      {
        "order": 2,
        "title": "docker-compose pentru mediu de dezvoltare",
        "content": "```yaml\n# docker-compose.yml\nversion: '3.8'\n\nservices:\n  api:\n    build:\n      context: .\n      dockerfile: Dockerfile\n    ports:\n      - '8000:8000'\n    environment:\n      DATABASE_URL: postgresql://user:pass@db:5432/mydb\n      SECRET_KEY: dev-secret-key\n      DEBUG: 'true'\n    volumes:\n      - .:/app  # hot reload in dev\n    depends_on:\n      db:\n        condition: service_healthy\n    command: uvicorn main:app --reload --host 0.0.0.0\n\n  db:\n    image: postgres:15-alpine\n    environment:\n      POSTGRES_DB: mydb\n      POSTGRES_USER: user\n      POSTGRES_PASSWORD: pass\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n    healthcheck:\n      test: [\"CMD\", \"pg_isready\", \"-U\", \"user\"]\n      interval: 5s\n      retries: 5\n\n  redis:\n    image: redis:7-alpine\n    ports:\n      - '6379:6379'\n\nvolumes:\n  postgres_data:\n```\n\n**Interviu:** Diferenta image vs container? Image = template read-only (layere). Container = instanta rulabila a unui image."
      },
      {
        "order": 3,
        "title": "Environment variables si secrets",
        "content": "```python\nimport os\nfrom dotenv import load_dotenv\nfrom pydantic_settings import BaseSettings\n\n# Abordare simpla cu os.environ\nDATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///./dev.db')\n\n# Abordare recomandata: pydantic-settings\nclass Settings(BaseSettings):\n    database_url: str = 'sqlite:///./dev.db'\n    secret_key: str\n    debug: bool = False\n    allowed_origins: list[str] = ['http://localhost:3000']\n\n    model_config = {'env_file': '.env'}\n\nsettings = Settings()\nprint(settings.database_url)\n\n# .env fisier (nu se comite in git!)\n# DATABASE_URL=postgresql://...\n# SECRET_KEY=super-secret\n\n# .env.example (se comite)\n# DATABASE_URL=sqlite:///./dev.db\n# SECRET_KEY=change-me\n```\n\n**Interviu:** Cum gestionezi secretele in Docker/productie? Nu le baga in imagine! Optiuni: env_file in docker-compose (local), environment variables la deployment (Vercel/Railway), Docker secrets, AWS Secrets Manager."
      },
      {
        "order": 4,
        "title": "Multi-stage builds si optimizare",
        "content": "```dockerfile\n# Multi-stage build: imagine mai mica in productie\nFROM python:3.11 AS builder\n\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --user --no-cache-dir -r requirements.txt\n\n# Stage final — fara tools de build\nFROM python:3.11-slim AS final\n\n# Copiaza DOAR pachetele instalate\nCOPY --from=builder /root/.local /root/.local\nCOPY . /app\n\nWORKDIR /app\nENV PATH=/root/.local/bin:$PATH\nENV PYTHONUNBUFFERED=1\n\nCMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]\n\n# Comenzi utile Docker:\n# docker build -t my-api .\n# docker run -p 8000:8000 --env-file .env my-api\n# docker-compose up -d\n# docker-compose logs -f api\n# docker-compose exec api bash\n# docker system prune -f  -- curata imagini/containere neutilizate\n```\n\n**Interviu:** Avantajul multi-stage build? Imaginea finala nu contine gcc, pip, tools de build — mult mai mica (300MB -> 100MB). Suprafata de atac redusa pentru securitate."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Layer caching",
        "question": "De ce copiezi `requirements.txt` si faci `pip install` INAINTE de a copia restul codului in Dockerfile?",
        "options": [
          "Cerinta Docker",
          "Layer caching: daca requirements nu se schimba, layer-ul pip install e din cache — build mult mai rapid",
          "Securitate",
          "Obligatoriu pentru Python"
        ],
        "answer": "Layer caching: daca requirements nu se schimba, layer-ul pip install e din cache — build mult mai rapid",
        "explanation": "Docker cache-uieste fiecare layer. requirements.txt se schimba rar, codul des. Daca pui COPY . . primul, orice modificare de cod invalideaza si pip install.",
        "difficulty": "hard"
      },
      {
        "number": 2,
        "name": "Image vs Container",
        "question": "Diferenta dintre Docker image si Docker container?",
        "options": [
          "Identice",
          "Image = template read-only (blueprint); Container = instanta rulabila a unui image",
          "Container e mai mare",
          "Image ruleaza, Container e stocat"
        ],
        "answer": "Image = template read-only (blueprint); Container = instanta rulabila a unui image",
        "explanation": "Image = cod + dependente + config. Container = image + stare runtime + procese. Multe containere pot rula din acelasi image.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "PYTHONUNBUFFERED",
        "question": "De ce setezi `ENV PYTHONUNBUFFERED=1` in Dockerfile?",
        "options": [
          "Performanta",
          "Forteaza Python sa nu buffereze stdout/stderr — log-urile apar imediat in docker logs",
          "Obligatoriu",
          "Dezactiveaza erori"
        ],
        "answer": "Forteaza Python sa nu buffereze stdout/stderr — log-urile apar imediat in docker logs",
        "explanation": "Fara PYTHONUNBUFFERED, log-urile pot fi retinute in buffer si nu apar in 'docker logs' pana ce container-ul se opreste.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "depends_on vs healthcheck",
        "question": "De ce nu e suficient `depends_on: [db]` fara healthcheck in docker-compose?",
        "options": [
          "depends_on e deprecated",
          "depends_on asteapta ca containerul sa porneasca, nu ca serviciul sa fie ready (DB nevoie de cateva secunde)",
          "depends_on e mai lent",
          "Nu exista depends_on"
        ],
        "answer": "depends_on asteapta ca containerul sa porneasca, nu ca serviciul sa fie ready (DB nevoie de cateva secunde)",
        "explanation": "Container pornit != DB accepta conexiuni. healthcheck + condition: service_healthy asteapta ca pg_isready sa returneze OK.",
        "difficulty": "hard"
      },
      {
        "number": 5,
        "name": "Volumes in docker-compose",
        "question": "Ce face `volumes: - .:/app` in docker-compose.yml?",
        "options": [
          "Copiaza fisierele in imagine",
          "Monteaza directorul local in container — modificarile locale apar instant (hot reload)",
          "Face backup la date",
          "Creeaza volum nou"
        ],
        "answer": "Monteaza directorul local in container — modificarile locale apar instant (hot reload)",
        "explanation": "Volume mount = sincronizare bidirectionala intre host si container. Esential pentru dev: `uvicorn --reload` vede modificarile imediat.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "Multi-stage build avantaj",
        "question": "Care e principalul avantaj al multi-stage build?",
        "options": [
          "Build mai lent dar mai sigur",
          "Imaginea finala e mai mica (fara tools de build) si cu suprafata de atac redusa",
          "Permite mai multi FROM",
          "Imagini mai colorate"
        ],
        "answer": "Imaginea finala e mai mica (fara tools de build) si cu suprafata de atac redusa",
        "explanation": "Stage builder: instaleaza gcc, pip etc. Stage final: copiaza DOAR pachetele compilate. Imaginea finala poate fi 3-10x mai mica.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "docker-compose exec",
        "question": "Ce face `docker-compose exec api bash`?",
        "options": [
          "Porneste un nou container",
          "Deschide un shell bash in container-ul api care ruleaza deja",
          "Opreste containerul",
          "Afiseaza log-urile"
        ],
        "answer": "Deschide un shell bash in container-ul api care ruleaza deja",
        "explanation": "exec ruleaza o comanda in container-ul existent. Util pentru debugging, inspectare stare, rulare migrate etc.",
        "difficulty": "easy"
      },
      {
        "number": 8,
        "name": "Secretele in productie",
        "question": "Cum NU ar trebui sa gestionezi secretele (DB password, API keys) in Docker?",
        "options": [
          "Environment variables la deploy",
          "Hardcodate in Dockerfile sau codate in imagine",
          "Docker secrets",
          "Variabile de mediu din CI/CD"
        ],
        "answer": "Hardcodate in Dockerfile sau codate in imagine",
        "explanation": "Imaginile Docker pot fi inspectate (docker history). Secretele hardcodate sunt expuse. Foloseste env vars la runtime sau secrets managers.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "pydantic-settings",
        "question": "Avantajul `pydantic-settings` fata de `os.environ.get()` direct?",
        "options": [
          "pydantic-settings e mai rapid",
          "Validare tipuri, valori default, suport .env, un singur loc de configurare",
          "Nu e diferenta",
          "pydantic-settings e gratuit"
        ],
        "answer": "Validare tipuri, valori default, suport .env, un singur loc de configurare",
        "explanation": "pydantic-settings valideaza automat: DATABASE_URL trebuie sa fie string, DEBUG trebuie sa fie bool. Eroare clara la startup daca lipseste ceva.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "USER non-root",
        "question": "De ce adaugi `USER appuser` (non-root) in Dockerfile?",
        "options": [
          "Performanta",
          "Securitate: un container compromis cu root are acces la sistemul host; non-root limiteaza daunele",
          "Obligatoriu",
          "Reduce dimensiunea imaginii"
        ],
        "answer": "Securitate: un container compromis cu root are acces la sistemul host; non-root limiteaza daunele",
        "explanation": "Principiul least privilege: procesele nu trebuie sa aiba mai multe permisiuni decat necesare. Rularea ca root in container e risc de securitate.",
        "difficulty": "medium"
      },
      {
        "number": 11,
        "name": "docker system prune",
        "question": "Ce face `docker system prune -f`?",
        "options": [
          "Sterge toate containerele rulate",
          "Curata containere oprite, imagini neutilizate, retele si cache build",
          "Opreste toate containerele",
          "Reseteaza Docker"
        ],
        "answer": "Curata containere oprite, imagini neutilizate, retele si cache build",
        "explanation": "Curata deseurile Docker care ocupa spatiu. -f = fara confirmare interactiva. Nu sterge volume (pentru asta: --volumes).",
        "difficulty": "easy"
      },
      {
        "number": 12,
        "name": "Dockerfile simplu coding",
        "question": "Scrie un Dockerfile pentru o aplicatie Python Flask care ruleaza pe portul 5000.",
        "options": [],
        "answer": "",
        "explanation": "FROM python:3.11-slim; WORKDIR /app; COPY requirements.txt .; RUN pip install -r requirements.txt; COPY . .; EXPOSE 5000; CMD [\"flask\",\"run\",\"--host\",\"0.0.0.0\"]",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Settings cu pydantic coding",
        "question": "Scrie o clasa Settings folosind pydantic-settings cu campurile: db_url (str, default sqlite), api_key (str, obligatoriu), debug (bool, default False). Afiseaza valorile cu defaults.",
        "options": [],
        "answer": "",
        "explanation": "Clasa Settings citeste din env vars cu fallback la defaults. In productie: pydantic-settings face asta mai elegant.",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "docker-compose config coding",
        "question": "Scrie un docker-compose.yml pentru o aplicatie cu doua servicii: api (Python) si redis. Api se conecteaza la Redis prin variabila REDIS_URL.",
        "options": [],
        "answer": "",
        "explanation": "api: build:.; ports: ['8000:8000']; environment: REDIS_URL=redis://redis:6379; depends_on: [redis]. redis: image: redis:7-alpine",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Health check script coding",
        "question": "Scrie un script Python care verifica daca un serviciu e disponibil (simuleaza healthcheck). Incearca de maxim 5 ori cu pauza de 1 secunda intre incercari.",
        "options": [],
        "answer": "",
        "explanation": "for attempt in range(max_retries): print(f'Incercare {attempt+1}/{max_retries}'); if attempt >= 2: return True; time.sleep(delay)",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "python-cli-click-rich",
    "title": "48. CLI cu Click si Rich",
    "order": 48,
    "theory": [
      {
        "order": 1,
        "title": "Click — comenzi, optiuni si argumente",
        "content": "```python\nimport click\n\n@click.group()\ndef cli():\n    '''Tool CLI demo'''\n    pass\n\n@cli.command()\n@click.argument('fisier')                        # pozitional, obligatoriu\n@click.option('--output', '-o', default='.',    # optional cu shorthand\n              help='Director de output')\n@click.option('--verbose', '-v', is_flag=True,  # flag boolean\n              help='Output detaliat')\n@click.option('--format', type=click.Choice(['json', 'csv', 'txt']),\n              default='json', show_default=True)\ndef proceseaza(fisier, output, verbose, format):\n    '''Proceseaza un fisier si salveaza output'''\n    if verbose:\n        click.echo(click.style(f'Procesez: {fisier}', fg='blue'))\n\n    click.echo(f'Format: {format}')\n    # Confirmare interactiva\n    if click.confirm(f'Salvezi in {output}?', default=True):\n        click.echo(click.style('Salvat!', fg='green', bold=True))\n\n@cli.command()\n@click.option('--count', type=int, default=1,\n              help='De cate ori sa salute')\n@click.argument('name')\ndef salut(count, name):\n    for _ in range(count):\n        click.echo(f'Salut, {name}!')\n\nif __name__ == '__main__':\n    cli()\n```\n\n**Interviu:** Click vs argparse? Click: decoratori, grupuri de comenzi (git-style), testare usoara cu CliRunner. argparse: stdlib, mai verbos, fara dependente externe."
      },
      {
        "order": 2,
        "title": "Rich — tabele, progress bar si styled output",
        "content": "```python\nfrom rich.console import Console\nfrom rich.table import Table\nfrom rich.progress import Progress, SpinnerColumn, TimeElapsedColumn\nfrom rich import print as rprint\nimport time\n\nconsole = Console()\n\n# Print stilizat\nconsole.print('[bold blue]Titlu[/bold blue] si [green]verde[/green]')\nconsole.print('[red]Eroare:[/red] ceva a mers gresit', style='on white')\n\n# Tabel\ntabel = Table(title='Angajati', show_header=True, header_style='bold cyan')\ntabel.add_column('Nume', style='blue')\ntabel.add_column('Departament')\ntabel.add_column('Salar', justify='right', style='green')\n\ntabel.add_row('Ana Popescu', 'IT', '5000 RON')\ntabel.add_row('Bob Ionescu', 'HR', '4500 RON')\ntabel.add_row('Carol Popa', 'Finance', '[bold]7000 RON[/bold]')\n\nconsole.print(tabel)\n\n# Progress bar\nwith Progress(\n    SpinnerColumn(),\n    '[progress.description]{task.description}',\n    TimeElapsedColumn()\n) as progress:\n    task = progress.add_task('Procesez date...', total=100)\n    for i in range(100):\n        time.sleep(0.02)\n        progress.update(task, advance=1)\n```"
      },
      {
        "order": 3,
        "title": "Combinare Click + Rich si testare CLI",
        "content": "```python\nimport click\nfrom rich.console import Console\nfrom rich.table import Table\nfrom click.testing import CliRunner\n\nconsole = Console()\n\n@click.group()\n@click.version_option(version='1.0.0')\ndef app():\n    pass\n\n@app.command()\n@click.option('--format', type=click.Choice(['table', 'json']), default='table')\ndef lista(format):\n    '''Afiseaza lista de iteme'''\n    date = [('Laptop', 3000), ('Mouse', 150), ('Tastatura', 200)]\n\n    if format == 'table':\n        t = Table('Produs', 'Pret')\n        for produs, pret in date:\n            t.add_row(produs, str(pret))\n        console.print(t)\n    else:\n        import json\n        click.echo(json.dumps([{'p': n, 'v': v} for n,v in date]))\n\n# Testare automata cu CliRunner\ndef test_lista():\n    runner = CliRunner()\n    result = runner.invoke(app, ['lista', '--format', 'json'])\n    assert result.exit_code == 0\n    assert 'Laptop' in result.output\n    print('Test trecut!')\n\ntest_lista()\n```\n\n**Interviu:** Cum testezi un CLI Click fara sa rulezi efectiv procesul? Cu `CliRunner` din `click.testing` — simuleaza input/output, verifica exit_code si output fara a lansa un subprocess real."
      },
      {
        "order": 4,
        "title": "Rich Prompt, Panel si Live Display",
        "content": "```python\nfrom rich.console import Console\nfrom rich.panel import Panel\nfrom rich.prompt import Prompt, Confirm\nfrom rich.live import Live\nfrom rich.table import Table\nimport time\n\nconsole = Console()\n\n# Panel — boxing de continut\nconsole.print(Panel(\n    '[bold]Bine ai venit![/bold]\\n[dim]Version 1.0.0[/dim]',\n    title='CLI Tool', subtitle='Apasa Ctrl+C pentru iesire',\n    border_style='blue'\n))\n\n# Prompt interactiv\nnume = Prompt.ask('Cum te numesti', default='Utilizator')\nvarsta = Prompt.ask('Varsta ta', default='25')\nconfirm = Confirm.ask(f'Esti sigur ca te numesti {nume}?')\n\n# Live display — actualizeaza tabelul in timp real\ndef generate_table(progress: float) -> Table:\n    t = Table('Task', 'Status', 'Progress')\n    for i, task_name in enumerate(['Download', 'Process', 'Upload']):\n        done = progress > (i+1) * 33\n        status = '[green]Done[/green]' if done else '[yellow]...[/yellow]'\n        t.add_row(task_name, status, f'{min(100, int(progress))}%')\n    return t\n\nwith Live(generate_table(0), refresh_per_second=10) as live:\n    for i in range(100):\n        time.sleep(0.05)\n        live.update(generate_table(i))\n```"
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Click argument vs option",
        "question": "Diferenta dintre `click.argument('fisier')` si `click.option('--fisier')`?",
        "options": [
          "Identice",
          "argument = pozitional (obligatoriu implicit); option = keyword cu -- (optional implicit)",
          "option = obligatoriu mereu",
          "argument accepta --flag"
        ],
        "answer": "argument = pozitional (obligatoriu implicit); option = keyword cu -- (optional implicit)",
        "explanation": "cmd file.txt — argument pozitional. cmd --file file.txt — option. Argumente = resurse, optiuni = modificatori de comportament.",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "is_flag in Click",
        "question": "Ce face `@click.option('--verbose', is_flag=True)`?",
        "options": [
          "Creeaza un option cu valori 0/1",
          "Creeaza un boolean switch: prezent = True, absent = False",
          "Creeaza un option obligatoriu",
          "Defineste un subcomand"
        ],
        "answer": "Creeaza un boolean switch: prezent = True, absent = False",
        "explanation": "is_flag=True: `cmd --verbose` -> verbose=True; `cmd` (fara flag) -> verbose=False. Util pentru on/off switches.",
        "difficulty": "easy"
      },
      {
        "number": 3,
        "name": "click.Choice",
        "question": "Ce face `type=click.Choice(['json', 'csv', 'txt'])`?",
        "options": [
          "Valideaza ca input-ul e o lista",
          "Restrictioneaza valorile acceptate la lista specificata (altfel eroare)",
          "Transforma inputul in lista",
          "Creeaza un meniu interactiv"
        ],
        "answer": "Restrictioneaza valorile acceptate la lista specificata (altfel eroare)",
        "explanation": "Click.Choice valideaza la parsare. Daca utilizatorul da --format xml si xml nu e in lista, Click afiseaza eroare clara.",
        "difficulty": "easy"
      },
      {
        "number": 4,
        "name": "Rich markup syntax",
        "question": "Ce face `console.print('[bold red]Eroare[/bold red]')` in Rich?",
        "options": [
          "Afiseaza tag-urile HTML literal",
          "Afiseaza 'Eroare' cu text aldin si culoare rosie (markup Rich)",
          "Eroare de sintaxa",
          "Afiseaza in fisier HTML"
        ],
        "answer": "Afiseaza 'Eroare' cu text aldin si culoare rosie (markup Rich)",
        "explanation": "Rich foloseste markup similar HTML dar pentru terminal. [bold], [red], [green], [dim], [underline] etc.",
        "difficulty": "easy"
      },
      {
        "number": 5,
        "name": "CliRunner testare",
        "question": "De ce folosesti `CliRunner` din `click.testing`?",
        "options": [
          "E obligatoriu in productie",
          "Permite testarea comenzilor CLI fara a rula un subprocess real — mai rapid si controlabil",
          "E mai rapid decat Click normal",
          "Ruleaza CLI in parallel"
        ],
        "answer": "Permite testarea comenzilor CLI fara a rula un subprocess real — mai rapid si controlabil",
        "explanation": "CliRunner.invoke() simuleaza apelul comenzii in-process: captureaza output, seteaza exit_code. Perfect pentru unit tests.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "click.group",
        "question": "Ce creeaza `@click.group()`?",
        "options": [
          "Un option cu multiple valori",
          "Un grup de subcomandi (similare cu git: git commit, git push)",
          "Un decorator invalid",
          "Un callback"
        ],
        "answer": "Un grup de subcomandi (similare cu git: git commit, git push)",
        "explanation": "group() creeaza un CLI cu subcomandi. `cli commit`, `cli push` sunt subcomandi. Fiecare subcomand e decorat cu @cli.command().",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "Rich Table justify",
        "question": "Ce face `justify='right'` in `Table.add_column('Pret', justify='right')`?",
        "options": [
          "Justifica textul la stanga",
          "Aliniaza textul din coloana la dreapta",
          "Face coloana obligatorie",
          "Seteaza culoarea"
        ],
        "answer": "Aliniaza textul din coloana la dreapta",
        "explanation": "Numeric data e conventional aliniat la dreapta in tabele. Rich suporta 'left', 'center', 'right'.",
        "difficulty": "easy"
      },
      {
        "number": 8,
        "name": "Progress context manager",
        "question": "De ce folosesti `with Progress(...) as progress:` (context manager) pentru progress bar?",
        "options": [
          "E singura sintaxa disponibila",
          "Context manager garanteaza curatarea display-ului terminal la iesire, chiar si la erori",
          "E mai rapid",
          "Nu exista alta varianta"
        ],
        "answer": "Context manager garanteaza curatarea display-ului terminal la iesire, chiar si la erori",
        "explanation": "with = __enter__/__exit__ asigura ca Rich reseteaza terminalul corect dupa afisarea progress bar-ului.",
        "difficulty": "medium"
      },
      {
        "number": 9,
        "name": "click.confirm",
        "question": "Ce face `click.confirm('Stergi fisierul?', default=False)` si cum il poti skip in teste?",
        "options": [
          "Nu poate fi skipped",
          "Afiseaza prompt interactiv; in CliRunner: runner.invoke(cmd, input='y\\n') sau --yes flag",
          "Sterge automat",
          "default=False = nu afiseaza"
        ],
        "answer": "Afiseaza prompt interactiv; in CliRunner: runner.invoke(cmd, input='y\\n') sau --yes flag",
        "explanation": "confirm() asteapta y/n de la utilizator. In teste: runner.invoke(cmd, input='y\\n') simuleaza 'yes'. Pattern: --yes flag ca `is_flag=True`.",
        "difficulty": "hard"
      },
      {
        "number": 10,
        "name": "Rich Panel",
        "question": "Ce face `Panel('continut', title='Titlu', border_style='blue')` in Rich?",
        "options": [
          "Creeaza un GUI window",
          "Afiseaza continutul intr-o casuta cu bordura stilizata si titlu",
          "Face request HTTP",
          "Creeaza un fisier"
        ],
        "answer": "Afiseaza continutul intr-o casuta cu bordura stilizata si titlu",
        "explanation": "Panel = box border in terminal, similar unui card UI. Excelent pentru sectiuni, mesaje de bun venit, erori prominente.",
        "difficulty": "easy"
      },
      {
        "number": 11,
        "name": "click.version_option",
        "question": "Ce adauga `@click.version_option(version='1.0.0')` la un grup Click?",
        "options": [
          "Seteaza versiunea Python minima",
          "Adauga --version flag care afiseaza versiunea si iese",
          "Valideaza versiunea pachetelor",
          "E obligatoriu"
        ],
        "answer": "Adauga --version flag care afiseaza versiunea si iese",
        "explanation": "myapp --version afiseaza 'myapp, version 1.0.0'. Standard pentru CLI tools. Poate citi si din __version__ al pachetului.",
        "difficulty": "easy"
      },
      {
        "number": 12,
        "name": "Click command coding",
        "question": "Scrie o comanda Click `salut` care primeste un argument `name` si un option `--titlu` (default 'Dr.'). Afiseaza '{titlu} {name}, bun venit!'",
        "options": [],
        "answer": "",
        "explanation": "@click.argument('name'); @click.option('--titlu', default='Dr.'); click.echo(f'{titlu} {name}, bun venit!')",
        "difficulty": "easy"
      },
      {
        "number": 13,
        "name": "Rich Table coding",
        "question": "Creeaza un tabel Rich cu coloanele 'Produs', 'Stoc', 'Pret' si 3 randuri de date. Stilizeaza header cu bold si pretul aliniat la dreapta.",
        "options": [],
        "answer": "",
        "explanation": "t = Table(title='Inventar'); t.add_column('Produs', style='bold'); t.add_column('Pret', justify='right'); t.add_row(...)",
        "difficulty": "easy"
      },
      {
        "number": 14,
        "name": "Click group cu subcomandi coding",
        "question": "Creeaza un grup CLI cu doua subcomanduri: `list` (afiseaza 3 iteme hardcodate) si `add` care primeste un argument `item` si il afiseaza.",
        "options": [],
        "answer": "",
        "explanation": "@cli.command(); def list(): for i in items: click.echo(i). @cli.command(); @click.argument('item'); def add(item): click.echo(f'Adaugat: {item}')",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Progress bar simulat coding",
        "question": "Simuleaza o operatie lunga (100 de pasi) cu un progress bar Rich. La final, afiseaza un mesaj de succes cu Panel verde.",
        "options": [],
        "answer": "",
        "explanation": "with Progress() as p: task = p.add_task('...', total=100); for _ in range(100): time.sleep(0.01); p.update(task, advance=1)",
        "difficulty": "easy"
      }
    ]
  },
  {
    "slug": "python-concurenta",
    "title": "49. Concurenta — threading, multiprocessing, asyncio avansat",
    "order": 49,
    "theory": [
      {
        "order": 1,
        "title": "Threading — I/O bound tasks si GIL",
        "content": "```python\nimport threading\nimport time\nfrom queue import Queue\n\n# Thread simplu\ndef task(name, delay):\n    print(f'{name} pornit')\n    time.sleep(delay)  # I/O bound — elibereaza GIL\n    print(f'{name} terminat')\n\nt1 = threading.Thread(target=task, args=('T1', 2))\nt2 = threading.Thread(target=task, args=('T2', 1))\nt1.start(); t2.start()\nt1.join(); t2.join()  # asteapta ambele\n\n# Semaphore — limiteaza accesul concurent\nsem = threading.Semaphore(3)  # max 3 thread-uri simultan\n\ndef task_cu_sem(i):\n    with sem:\n        print(f'Thread {i} executa')\n        time.sleep(1)\n\nthreads = [threading.Thread(target=task_cu_sem, args=(i,))\n           for i in range(10)]\nfor t in threads: t.start()\nfor t in threads: t.join()\n\n# Queue thread-safe pentru comunicare\nq = Queue()\n\ndef producer():\n    for i in range(5):\n        q.put(i)\n\ndef consumer():\n    while True:\n        item = q.get()\n        if item is None: break\n        print(f'Procesat: {item}')\n        q.task_done()\n```\n\n**Interviu:** Ce e GIL (Global Interpreter Lock)? Un mutex care permite UNUI SINGUR thread Python sa ruleze bytecode la un moment dat. Threading bun pentru I/O bound (sleep, DB, HTTP); prost pentru CPU-bound (calcule). Pentru CPU: multiprocessing."
      },
      {
        "order": 2,
        "title": "Multiprocessing — CPU bound tasks",
        "content": "```python\nimport multiprocessing as mp\nimport time\n\ndef calcul_greu(n):\n    '''CPU-bound: calculeaza suma patratelor'''\n    return sum(i*i for i in range(n))\n\nif __name__ == '__main__':\n    date = [10**6, 10**6, 10**6, 10**6]  # 4 sarcini\n\n    # Fara paralel\n    start = time.time()\n    results = [calcul_greu(n) for n in date]\n    print(f'Secvential: {time.time()-start:.2f}s')\n\n    # Cu Pool (foloseste n CPU cores)\n    start = time.time()\n    with mp.Pool(processes=mp.cpu_count()) as pool:\n        results = pool.map(calcul_greu, date)\n    print(f'Paralel: {time.time()-start:.2f}s')\n\n    # Pool.starmap pentru functii cu multipli argumente\n    def aduna(a, b): return a + b\n    with mp.Pool() as pool:\n        results = pool.starmap(aduna, [(1,2), (3,4), (5,6)])\n    print(results)  # [3, 7, 11]\n\n    # Shared memory (cu cautela!)\n    val = mp.Value('i', 0)  # integer partajat\n    lock = mp.Lock()\n    def incrementeaza(val, lock):\n        with lock:\n            val.value += 1\n```"
      },
      {
        "order": 3,
        "title": "asyncio avansat — gather, semaphore, queue",
        "content": "```python\nimport asyncio\nimport aiohttp\n\n# asyncio.gather — ruleaza coroutines concurent\nasync def fetch(session, url):\n    async with session.get(url) as resp:\n        return await resp.text()\n\nasync def main():\n    urls = ['https://httpbin.org/delay/1'] * 5\n\n    async with aiohttp.ClientSession() as session:\n        # Toate request-urile concurent\n        tasks = [fetch(session, url) for url in urls]\n        results = await asyncio.gather(*tasks)\n    return results\n\n# asyncio.Semaphore — limiteaza concurenta\nasync def fetch_cu_sem(sem, session, url):\n    async with sem:\n        return await fetch(session, url)\n\nasync def main_limited():\n    sem = asyncio.Semaphore(3)  # max 3 concurent\n    urls = ['https://example.com'] * 20\n\n    async with aiohttp.ClientSession() as session:\n        tasks = [fetch_cu_sem(sem, session, url) for url in urls]\n        results = await asyncio.gather(*tasks)\n\n# asyncio.Queue pentru producer/consumer\nasync def producer(queue):\n    for i in range(10):\n        await queue.put(i)\n        await asyncio.sleep(0.1)\n    await queue.put(None)  # sentinel\n\nasync def consumer(queue):\n    while True:\n        item = await queue.get()\n        if item is None: break\n        print(f'Procesat: {item}')\n\nasync def run():\n    queue = asyncio.Queue(maxsize=5)\n    await asyncio.gather(producer(queue), consumer(queue))\n\nasyncio.run(run())\n```"
      },
      {
        "order": 4,
        "title": "concurrent.futures si alegerea modelului",
        "content": "```python\nfrom concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor\nimport time\n\n# ThreadPoolExecutor — I/O bound (HTTP, DB, fisiere)\ndef io_task(n):\n    time.sleep(0.5)  # simuleaza I/O\n    return n * 2\n\nwith ThreadPoolExecutor(max_workers=10) as executor:\n    futures = [executor.submit(io_task, i) for i in range(20)]\n    results = [f.result() for f in futures]\n\n# ProcessPoolExecutor — CPU bound\ndef cpu_task(n):\n    return sum(i**2 for i in range(n))\n\nwith ProcessPoolExecutor() as executor:\n    results = list(executor.map(cpu_task, [10**6]*4))\n\n# as_completed — proceseaza rezultatele in ordinea terminarii\nfrom concurrent.futures import as_completed\n\nwith ThreadPoolExecutor(max_workers=5) as executor:\n    futures = {executor.submit(io_task, i): i for i in range(10)}\n    for future in as_completed(futures):\n        input_val = futures[future]\n        result = future.result()\n        print(f'Task {input_val} -> {result}')\n```\n\n**Interviu:** Cand alegi threading, multiprocessing sau asyncio? threading = I/O bound, cod sync, legacy. asyncio = I/O bound, cod nou, framework async (FastAPI, aiohttp). multiprocessing = CPU-bound. concurrent.futures = API unificat peste threading/multiprocessing."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "GIL si threading",
        "question": "De ce threading Python nu ajuta la task-uri CPU-bound (calcule intense)?",
        "options": [
          "Thread-urile sunt prea lente",
          "GIL permite unui singur thread sa ruleze bytecode Python la un moment dat — CPU-bound nu beneficiaza de paralel real",
          "Nu se pot crea thread-uri in Python",
          "Thread-urile consuma prea multa memorie"
        ],
        "answer": "GIL permite unui singur thread sa ruleze bytecode Python la un moment dat — CPU-bound nu beneficiaza de paralel real",
        "explanation": "GIL = Global Interpreter Lock. Thread-urile alterne rapid, dar nu pot rula simultan pe CPU diferiti. Pentru CPU-bound: multiprocessing (procese separate au GIL propriu).",
        "difficulty": "hard"
      },
      {
        "number": 2,
        "name": "I/O bound vs CPU bound",
        "question": "Care model e potrivit pentru a descarca 100 de fisiere simultan?",
        "options": [
          "multiprocessing.Pool",
          "threading sau asyncio — I/O bound beneficiaza de concurenta (asteapta retea)",
          "Secvential e la fel",
          "GPU computing"
        ],
        "answer": "threading sau asyncio — I/O bound beneficiaza de concurenta (asteapta retea)",
        "explanation": "Descarcarea fisierelor = I/O bound (asteapta retea). Thread-urile/asyncio elibereaza GIL la I/O -> concurenta reala.",
        "difficulty": "medium"
      },
      {
        "number": 3,
        "name": "thread.join()",
        "question": "Ce face `t1.join()` dupa `t1.start()`?",
        "options": [
          "Uneste doua thread-uri intr-unul",
          "Blocheaza thread-ul curent pana ce t1 se termina",
          "Adauga t1 la un pool",
          "Opreste t1"
        ],
        "answer": "Blocheaza thread-ul curent pana ce t1 se termina",
        "explanation": "join() = 'asteapta'. Fara join(), main thread-ul poate termina inainte ca thread-urile secundare sa se termine.",
        "difficulty": "medium"
      },
      {
        "number": 4,
        "name": "Semaphore scop",
        "question": "De ce folosesti `Semaphore(5)` cand lansezi 100 de thread-uri?",
        "options": [
          "Permite doar 5 thread-uri total",
          "Limiteaza la max 5 thread-uri executand concurent — evita supraincarcare resurse",
          "Face thread-urile mai rapide",
          "E obligatoriu"
        ],
        "answer": "Limiteaza la max 5 thread-uri executand concurent — evita supraincarcare resurse",
        "explanation": "Fara semaphore: 100 conexiuni DB simultane pot satura server-ul. Semaphore(5) = max 5 concurent, restul asteapta.",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "asyncio.gather",
        "question": "Ce face `await asyncio.gather(coro1(), coro2(), coro3())`?",
        "options": [
          "Ruleaza cele 3 coroutine secvential",
          "Ruleaza toate 3 concurent si asteapta sa se termine toate",
          "Ruleaza prima care e gata",
          "Creeaza thread-uri"
        ],
        "answer": "Ruleaza toate 3 concurent si asteapta sa se termine toate",
        "explanation": "gather() = concurrent.futures.wait() dar pentru async. Toate coroutine-urile pornesc simultan; gather returneaza cand toate sunt gata.",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "Pool.map vs pool.starmap",
        "question": "Diferenta `pool.map(func, [1,2,3])` vs `pool.starmap(func, [(1,2),(3,4)])`?",
        "options": [
          "Identice",
          "map = functie cu un singur argument; starmap = functie cu multipli argumente (unpacked din tuple)",
          "starmap e mai rapid",
          "map e pentru async"
        ],
        "answer": "map = functie cu un singur argument; starmap = functie cu multipli argumente (unpacked din tuple)",
        "explanation": "pool.starmap(aduna, [(1,2),(3,4)]) = aduna(1,2) si aduna(3,4). map(aduna, [1,2,3]) = aduna(1), aduna(2), aduna(3).",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "Queue thread-safe",
        "question": "De ce `queue.Queue` e preferata listelor normale pentru comunicare intre thread-uri?",
        "options": [
          "Queue e mai rapida",
          "Queue e thread-safe (locking intern); list.append/pop nu sunt atomice in Python",
          "Queue are mai multe metode",
          "Nu e preferata"
        ],
        "answer": "Queue e thread-safe (locking intern); list.append/pop nu sunt atomice in Python",
        "explanation": "Queue implementeaza locking intern. listele Python sunt relativ thread-safe datorita GIL, dar Queue ofera semantica Producer/Consumer corecta.",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "asyncio vs threading",
        "question": "Cand alegi asyncio in loc de threading pentru I/O bound?",
        "options": [
          "Niciodata, threading e mai bun",
          "Cand scrii cod nou cu framework-uri async (FastAPI, aiohttp) — mai eficient, fara overhead thread creation",
          "Cand ai mai mult de 10 task-uri",
          "Cand ruleaza pe Linux"
        ],
        "answer": "Cand scrii cod nou cu framework-uri async (FastAPI, aiohttp) — mai eficient, fara overhead thread creation",
        "explanation": "asyncio: un singur thread, overhead mic, sute/mii de coroutine. threading: overhead per thread, context switching OS, mai simplu cu cod sync existent.",
        "difficulty": "hard"
      },
      {
        "number": 9,
        "name": "as_completed utilitate",
        "question": "De ce folosesti `concurrent.futures.as_completed()` in loc de `[f.result() for f in futures]`?",
        "options": [
          "as_completed e mai rapid",
          "as_completed proceseaza rezultatele in ordinea terminarii, nu in ordinea crearii",
          "Sunt identice",
          "as_completed e mai sigur"
        ],
        "answer": "as_completed proceseaza rezultatele in ordinea terminarii, nu in ordinea crearii",
        "explanation": "Daca task-ul 10 termina primul, [f.result()] asteapta task-urile 1-9 inainte. as_completed il proceseaza imediat.",
        "difficulty": "hard"
      },
      {
        "number": 10,
        "name": "if __name__ == '__main__'",
        "question": "De ce e obligatoriu `if __name__ == '__main__':` in fisierele cu multiprocessing pe Windows?",
        "options": [
          "E obligatoriu in Python in general",
          "Windows foloseste 'spawn' (nu fork) — fara guard, fiecare proces worker re-importa modulul si creeaza infinite procese",
          "Performanta",
          "Nu e obligatoriu"
        ],
        "answer": "Windows foloseste 'spawn' (nu fork) — fara guard, fiecare proces worker re-importa modulul si creeaza infinite procese",
        "explanation": "Linux/Mac: fork() copiaza procesul parinte. Windows: spawn = porneste Python nou si importa modulul. Fara guard, fiecare worker porneste si el Pool -> bomb.",
        "difficulty": "hard"
      },
      {
        "number": 11,
        "name": "asyncio.Semaphore",
        "question": "Ce face `asyncio.Semaphore(3)` in context async?",
        "options": [
          "Creeaza 3 event loop-uri",
          "Limiteaza la maxim 3 coroutine executand sectiunea async with simultan",
          "Creeaza 3 thread-uri",
          "Limiteaza la 3 request-uri total"
        ],
        "answer": "Limiteaza la maxim 3 coroutine executand sectiunea async with simultan",
        "explanation": "asyncio.Semaphore = semaforul threading dar non-blocking. Util pentru rate limiting: max 3 request-uri HTTP concurente.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "Thread pool coding",
        "question": "Folosind ThreadPoolExecutor cu max 5 workers, descarca (simuleaza) 20 de URL-uri concurent. Afiseaza primele 5 rezultate.",
        "options": [],
        "answer": "",
        "explanation": "with ThreadPoolExecutor(max_workers=5) as ex: results = list(ex.map(simulate_download, urls)); print(results[:5])",
        "difficulty": "easy"
      },
      {
        "number": 13,
        "name": "asyncio gather coding",
        "question": "Scrie o functie async care simuleaza descarcarea a 5 URL-uri concurent cu asyncio.gather. Fiecare 'descarcare' dureaza 1 secunda (asyncio.sleep). Masoara timpului total.",
        "options": [],
        "answer": "",
        "explanation": "tasks = [download(i) for i in range(5)]; results = await asyncio.gather(*tasks). Toate 5 ruleaza concurent -> ~1s total.",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "Producer consumer threading coding",
        "question": "Implementeaza un pattern producer-consumer cu threading.Thread si queue.Queue: producer adauga 10 numere, consumer le proceseaza (afiseaza patul).",
        "options": [],
        "answer": "",
        "explanation": "while True: item = q.get(); if item is None: break; print(item**2). t1=Thread(target=producer); t2=Thread(target=consumer); t1.start(); t2.start(); t1.join(); t2.join()",
        "difficulty": "medium"
      },
      {
        "number": 15,
        "name": "Multiprocessing pool coding",
        "question": "Calculeaza suma patratelor pentru numerele [100000, 200000, 300000, 400000] in paralel cu ProcessPoolExecutor. Compara cu executia secventiala.",
        "options": [],
        "answer": "",
        "explanation": "with ProcessPoolExecutor() as ex: rez_par = list(ex.map(suma_patrate, numere)). Pe multi-core ar trebui sa fie mai rapid.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "slug": "python-mini-proiect",
    "title": "50. Mini Proiect Python Final — API complet cu FastAPI + SQLAlchemy + Docker",
    "order": 50,
    "theory": [
      {
        "order": 1,
        "title": "Arhitectura proiectului si structura fisierelor",
        "content": "```\nproiect/\n├── app/\n│   ├── __init__.py\n│   ├── main.py           # FastAPI app, routers\n│   ├── config.py         # Settings pydantic-settings\n│   ├── database.py       # Engine, SessionLocal, Base\n│   ├── models/\n│   │   ├── __init__.py\n│   │   ├── user.py       # SQLAlchemy models\n│   │   └── task.py\n│   ├── schemas/\n│   │   ├── __init__.py\n│   │   ├── user.py       # Pydantic schemas\n│   │   └── task.py\n│   ├── routers/\n│   │   ├── users.py      # APIRouter\n│   │   └── tasks.py\n│   └── services/\n│       └── task_service.py\n├── tests/\n│   ├── conftest.py\n│   └── test_tasks.py\n├── alembic/\n├── Dockerfile\n├── docker-compose.yml\n├── requirements.txt\n└── .env.example\n```\n\n**Pattern Repository:** separa logica de business de DB queries. Service layer apeleaza repository, router apeleaza service. Testabilitate maxima — poti mock repository in teste."
      },
      {
        "order": 2,
        "title": "Database setup si dependency injection",
        "content": "```python\n# app/database.py\nfrom sqlalchemy import create_engine\nfrom sqlalchemy.orm import sessionmaker, DeclarativeBase\nfrom app.config import settings\n\nengine = create_engine(\n    settings.database_url,\n    connect_args={'check_same_thread': False}  # doar pt SQLite\n)\n\nSessionLocal = sessionmaker(autocommit=False, autoflush=False,\n                             bind=engine)\n\nclass Base(DeclarativeBase):\n    pass\n\n# Dependency FastAPI\ndef get_db():\n    db = SessionLocal()\n    try:\n        yield db\n    finally:\n        db.close()\n\n# app/models/task.py\nfrom sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime\nfrom sqlalchemy.orm import relationship\nfrom sqlalchemy.sql import func\nfrom app.database import Base\n\nclass Task(Base):\n    __tablename__ = 'tasks'\n    id = Column(Integer, primary_key=True, index=True)\n    titlu = Column(String(200), nullable=False)\n    descriere = Column(String, nullable=True)\n    finalizat = Column(Boolean, default=False)\n    prioritate = Column(Integer, default=1)  # 1-5\n    creat_la = Column(DateTime(timezone=True), server_default=func.now())\n    user_id = Column(Integer, ForeignKey('users.id'))\n    user = relationship('User', back_populates='tasks')\n```"
      },
      {
        "order": 3,
        "title": "Routers, schemas si logica CRUD completa",
        "content": "```python\n# app/schemas/task.py\nfrom pydantic import BaseModel, Field\nfrom typing import Optional\nfrom datetime import datetime\n\nclass TaskCreate(BaseModel):\n    titlu: str = Field(..., min_length=1, max_length=200)\n    descriere: Optional[str] = None\n    prioritate: int = Field(1, ge=1, le=5)\n\nclass TaskUpdate(BaseModel):\n    titlu: Optional[str] = None\n    descriere: Optional[str] = None\n    finalizat: Optional[bool] = None\n    prioritate: Optional[int] = Field(None, ge=1, le=5)\n\nclass TaskResponse(TaskCreate):\n    id: int\n    finalizat: bool\n    creat_la: datetime\n    class Config:\n        from_attributes = True\n\n# app/routers/tasks.py\nfrom fastapi import APIRouter, Depends, HTTPException\nfrom sqlalchemy.orm import Session\nfrom app.database import get_db\nfrom app.models.task import Task\nfrom app.schemas.task import TaskCreate, TaskUpdate, TaskResponse\nfrom typing import List\n\nrouter = APIRouter(prefix='/tasks', tags=['Tasks'])\n\n@router.get('/', response_model=List[TaskResponse])\nasync def get_tasks(\n    skip: int = 0, limit: int = 20,\n    finalizat: bool = None,\n    db: Session = Depends(get_db)\n):\n    query = db.query(Task)\n    if finalizat is not None:\n        query = query.filter(Task.finalizat == finalizat)\n    return query.offset(skip).limit(limit).all()\n\n@router.post('/', response_model=TaskResponse, status_code=201)\nasync def create_task(task: TaskCreate, db: Session = Depends(get_db)):\n    db_task = Task(**task.dict())\n    db.add(db_task)\n    db.commit()\n    db.refresh(db_task)\n    return db_task\n```"
      },
      {
        "order": 4,
        "title": "Testare cu pytest si configurare Docker completa",
        "content": "```python\n# tests/conftest.py\nimport pytest\nfrom fastapi.testclient import TestClient\nfrom sqlalchemy import create_engine\nfrom sqlalchemy.orm import sessionmaker\nfrom app.main import app\nfrom app.database import Base, get_db\n\n# DB in memorie pentru teste\nTEST_DB = 'sqlite:///:memory:'\ntest_engine = create_engine(TEST_DB)\nTestSessionLocal = sessionmaker(bind=test_engine)\n\n@pytest.fixture\ndef client():\n    Base.metadata.create_all(bind=test_engine)\n\n    def override_get_db():\n        db = TestSessionLocal()\n        try:\n            yield db\n        finally:\n            db.close()\n\n    app.dependency_overrides[get_db] = override_get_db\n    with TestClient(app) as c:\n        yield c\n    Base.metadata.drop_all(bind=test_engine)\n\n# tests/test_tasks.py\ndef test_create_task(client):\n    response = client.post('/tasks/', json={\n        'titlu': 'Test task', 'prioritate': 3\n    })\n    assert response.status_code == 201\n    data = response.json()\n    assert data['titlu'] == 'Test task'\n    assert data['finalizat'] == False\n\ndef test_get_tasks(client):\n    client.post('/tasks/', json={'titlu': 'Task 1'})\n    client.post('/tasks/', json={'titlu': 'Task 2'})\n    response = client.get('/tasks/')\n    assert response.status_code == 200\n    assert len(response.json()) == 2\n```\n\n**Interviu:** Cum testezi endpoint-uri FastAPI? TestClient din starlette (sync) sau AsyncClient pentru async tests. Suprascri dependency-ul get_db cu o DB de test (SQLite in-memory). Fiecare test are DB curata (fixture cu drop_all)."
      }
    ],
    "tasks": [
      {
        "number": 1,
        "name": "Structura proiect",
        "question": "De ce separati `models/` de `schemas/` in proiectul FastAPI?",
        "options": [
          "Conventie arbitrara",
          "models = SQLAlchemy (DB layer); schemas = Pydantic (validare input/output) — responsabilitati separate",
          "Performanta",
          "Obligatoriu de FastAPI"
        ],
        "answer": "models = SQLAlchemy (DB layer); schemas = Pydantic (validare input/output) — responsabilitati separate",
        "explanation": "Separation of Concerns: model SQLAlchemy defineste structura DB. Schema Pydantic defineste ce vine de la/spre client. Pot diferi (ex. parola e in model, nu in response schema).",
        "difficulty": "medium"
      },
      {
        "number": 2,
        "name": "TestClient vs AsyncClient",
        "question": "Cand folosesti `TestClient` (sync) vs `AsyncClient` (async) in teste FastAPI?",
        "options": [
          "Identice",
          "TestClient = suficient pentru majority; AsyncClient = cand testezi endpoint-uri cu logica async specifica sau WebSockets",
          "AsyncClient e intotdeauna mai bun",
          "TestClient nu functioneaza"
        ],
        "answer": "TestClient = suficient pentru majority; AsyncClient = cand testezi endpoint-uri cu logica async specifica sau WebSockets",
        "explanation": "TestClient wrapper-uieste ASGI app in mod sync — ok pentru majority. httpx.AsyncClient + pytest-anyio pentru logica async complexa.",
        "difficulty": "hard"
      },
      {
        "number": 3,
        "name": "dependency_overrides",
        "question": "Ce face `app.dependency_overrides[get_db] = override_get_db` in teste?",
        "options": [
          "Suprascrie permanent get_db",
          "Inlocuieste dependency get_db cu o versiune care foloseste DB de test in loc de cea reala",
          "Dezactiveaza autentificarea",
          "Accelereaza testele"
        ],
        "answer": "Inlocuieste dependency get_db cu o versiune care foloseste DB de test in loc de cea reala",
        "explanation": "dependency_overrides permite injectarea mock-urilor in teste fara sa modifici codul aplicatiei. Esential pentru izolarea testelor.",
        "difficulty": "hard"
      },
      {
        "number": 4,
        "name": "APIRouter prefix",
        "question": "Ce face `APIRouter(prefix='/tasks', tags=['Tasks'])`?",
        "options": [
          "Creeaza un endpoint /tasks",
          "Toate endpoint-urile din router au prefix /tasks automat, si sunt grupate in docs la sectiunea Tasks",
          "Face router-ul privat",
          "Seteaza autentificarea"
        ],
        "answer": "Toate endpoint-urile din router au prefix /tasks automat, si sunt grupate in docs la sectiunea Tasks",
        "explanation": "prefix = evita repetarea /tasks in fiecare ruta. tags = grouping in Swagger UI. router e inclus in app cu app.include_router(router).",
        "difficulty": "medium"
      },
      {
        "number": 5,
        "name": "PATCH vs PUT",
        "question": "Diferenta semantica HTTP intre PUT si PATCH pentru update?",
        "options": [
          "Identice in practica",
          "PUT = inlocuire completa a resursei (toate campurile); PATCH = actualizare partiala (doar campurile trimise)",
          "PATCH e mai rapid",
          "PUT e deprecated"
        ],
        "answer": "PUT = inlocuire completa a resursei (toate campurile); PATCH = actualizare partiala (doar campurile trimise)",
        "explanation": "PUT cu campuri lipsa => campurile devin null/default. PATCH e mai flexibil: trimiti doar ce vrei sa modifici (Optional fields in schema).",
        "difficulty": "medium"
      },
      {
        "number": 6,
        "name": "pytest fixture scope",
        "question": "De ce se defineste `client` ca fixture pytest si nu ca variabila globala?",
        "options": [
          "E obligatoriu in pytest",
          "Fixture = DB curata per test, setup/teardown automat, injectare DI eleganta",
          "Performanta",
          "Nu exista diferenta"
        ],
        "answer": "Fixture = DB curata per test, setup/teardown automat, injectare DI eleganta",
        "explanation": "Fiecare test primeste fixture proaspat (default scope='function'). DB drop_all la final = teste izolate, non-dependente.",
        "difficulty": "medium"
      },
      {
        "number": 7,
        "name": "server_default vs default in Column",
        "question": "Diferenta `Column(DateTime, server_default=func.now())` vs `Column(DateTime, default=datetime.now)`?",
        "options": [
          "Identice",
          "server_default = DB genereaza valoarea (mai precis pt timestamps); default = Python genereaza la creare obiect",
          "server_default e deprecated",
          "default nu functioneaza"
        ],
        "answer": "server_default = DB genereaza valoarea (mai precis pt timestamps); default = Python genereaza la creare obiect",
        "explanation": "server_default = SQL DEFAULT NOW() — gestionat de DB, consistent cu timezone DB. Python default poate avea decalaje daca serverul are timezone diferit.",
        "difficulty": "hard"
      },
      {
        "number": 8,
        "name": "alembic upgrade head",
        "question": "Ce face `alembic upgrade head`?",
        "options": [
          "Reseteaza DB la versiunea initiala",
          "Aplica toate migrarile pending pana la cea mai recenta versiune",
          "Sterge toate tabelele",
          "Porneste API-ul"
        ],
        "answer": "Aplica toate migrarile pending pana la cea mai recenta versiune",
        "explanation": "head = ultima migrare. upgrade head = ruleaza toate migrarile neaplicate inca. downgrade -1 = revine o migrare inapoi.",
        "difficulty": "easy"
      },
      {
        "number": 9,
        "name": "TaskUpdate cu Optional",
        "question": "De ce toate campurile din `TaskUpdate` schema sunt `Optional`?",
        "options": [
          "Eroare de design",
          "PATCH semantic: clientul trimite doar campurile pe care vrea sa le modifice, restul raman neschimbate",
          "Pydantic cere asta",
          "Performanta"
        ],
        "answer": "PATCH semantic: clientul trimite doar campurile pe care vrea sa le modifice, restul raman neschimbate",
        "explanation": "PATCH /tasks/1 cu {finalizat: true} nu trebuie sa ceara si titlul. Optional = camp optional in request body.",
        "difficulty": "medium"
      },
      {
        "number": 10,
        "name": "app.include_router",
        "question": "Cum incluzi un APIRouter intr-o aplicatie FastAPI?",
        "options": [
          "Se include automat",
          "app.include_router(router) sau app.include_router(router, prefix='/api/v1')",
          "router.mount(app)",
          "import router in main.py e suficient"
        ],
        "answer": "app.include_router(router) sau app.include_router(router, prefix='/api/v1')",
        "explanation": "include_router inregistreaza toate rutele din router in aplicatia principala. Poti adauga prefix suplimentar pentru versioning API.",
        "difficulty": "easy"
      },
      {
        "number": 11,
        "name": "from_attributes Pydantic v2",
        "question": "De ce ai `from_attributes = True` in Config a schemelor de response?",
        "options": [
          "E default in Pydantic v2",
          "Permite Pydantic sa citeasca atribute din obiecte SQLAlchemy (nu doar dict-uri)",
          "Obligatoriu pentru toate modelele",
          "Activeaza validarea stricta"
        ],
        "answer": "Permite Pydantic sa citeasca atribute din obiecte SQLAlchemy (nu doar dict-uri)",
        "explanation": "Fara from_attributes, Pydantic nu stie sa citeasca din SQLAlchemy ORM objects (care au atribute, nu chei de dict). orm_mode in Pydantic v1.",
        "difficulty": "medium"
      },
      {
        "number": 12,
        "name": "CRUD endpoint coding",
        "question": "Implementeaza un endpoint PATCH /tasks/{task_id} care actualizeaza partial un task (folosind TaskUpdate cu campuri Optional). Returneaza 404 daca task-ul nu exista.",
        "options": [],
        "answer": "",
        "explanation": "task = tasks_db.get(task_id); if not task: raise HTTPException(404). update_data = task_update.dict(exclude_none=True); task.update(update_data)",
        "difficulty": "medium"
      },
      {
        "number": 13,
        "name": "Test FastAPI coding",
        "question": "Scrie un test pytest care verifica ca POST /items returneaza 201 si datele corecte, si GET /items returneaza lista cu un element.",
        "options": [],
        "answer": "",
        "explanation": "response = client.post('/items', json={'name':'test','value':5}); assert response.status_code == 201; assert response.json()['name'] == 'test'",
        "difficulty": "medium"
      },
      {
        "number": 14,
        "name": "Proiect complet coding",
        "question": "Creeaza un mini API de notes cu SQLAlchemy in memorie (SQLite), Pydantic schemas si FastAPI. Include create, list si delete note.",
        "options": [],
        "answer": "",
        "explanation": "Model Note cu Column-uri; NoteCreate(BaseModel) cu titlu+continut; NoteResponse cu id+from_attributes; 3 endpoint-uri cu Depends(get_db).",
        "difficulty": "hard"
      },
      {
        "number": 15,
        "name": "Arhitectura alegere",
        "question": "Intr-un proiect FastAPI cu SQLAlchemy, de ce e recomandat pattern-ul Service Layer (routers -> services -> repositories)?",
        "options": [
          "E obligatoriu",
          "Separare responsabilitati: router (HTTP), service (business logic), repository (DB) — testabilitate, reusabilitate, single responsibility",
          "E mai rapid",
          "Reduce numarul de fisiere"
        ],
        "answer": "Separare responsabilitati: router (HTTP), service (business logic), repository (DB) — testabilitate, reusabilitate, single responsibility",
        "explanation": "Fara layere: router face DB queries direct = greu de testat, de intretinut. Cu layere: poti testa service fara HTTP; poti schimba DB fara sa modifici service-ul.",
        "difficulty": "hard"
      }
    ]
  }
];

module.exports = { pythonExtra };
